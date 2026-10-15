#Requires -Version 7.0
<#
.SYNOPSIS
Stages code, explicitly pushes a reviewed branch, or transfers a private runtime
to a verified SSH Docker host. It never sends evidence or passwords to GitHub.
.DESCRIPTION
Account prepares an individual account using secure prompts and raw standard
input to the offline account tool. No password is a command-line argument.
Stage copies the service source and uc-factual-record*.yml workflow from the
delivered overlay into an existing clone. It does not commit or push.
Push stages code, runs the source check and tests, then commits and pushes only
the named branch. -ConfirmPush is mandatory. There is no force-push mode.
Deploy requires a reviewed Node 24 image digest, an SSH identity file and a
separately verified known_hosts file. Private content and users.json go directly
over SSH. The host installer does not change the existing HTTPS ingress.
Credentials are not accepted as string parameters. Prepare accounts with the
offline account tool's secure-input flow. Private files are copied as bytes;
their contents are never written to the console or passed as command arguments.
.EXAMPLE
./scripts/Bridge-Goldlevel.ps1 -Mode Account -RuntimePath C:\private\private-runtime -Username recipient01 -AccountDays 30
.EXAMPLE
./scripts/Bridge-Goldlevel.ps1 -Mode Stage -RepoPath C:\work\goldlevel
.EXAMPLE
./scripts/Bridge-Goldlevel.ps1 -Mode Push -RepoPath C:\work\goldlevel -ConfirmPush
.EXAMPLE
./scripts/Bridge-Goldlevel.ps1 -Mode Deploy -RuntimePath C:\private\private-runtime -SshTarget deploy@example.org -SshIdentityFile C:\keys\id_ed25519 -KnownHostsFile C:\keys\known_hosts -NodeImage node:24-bookworm-slim@sha256:<reviewed-64-hex-digest>
#>
[CmdletBinding()]
param(
    [ValidateSet('Account', 'Stage', 'Push', 'Deploy')][string]$Mode = 'Stage',
    [string]$RepoPath,
    [string]$Branch = 'uc-factual-record-private-portal',
    [string]$CommitMessage = 'Add authenticated private factual record service',
    [switch]$ConfirmPush,
    [switch]$ReplaceExistingService,
    [string]$RuntimePath,
    [string]$Username,
    [ValidateSet('add', 'rotate', 'revoke', 'list')][string]$AccountAction = 'add',
    [ValidateRange(1, 90)][int]$AccountDays = 30,
    [string]$SshTarget,
    [string]$SshIdentityFile,
    [string]$KnownHostsFile,
    [ValidateRange(1, 65535)][int]$SshPort = 22,
    [ValidateSet('/opt/goldlevel-uc-private-portal', '/srv/goldlevel-uc-private-portal')][string]$RemoteRoot = '/opt/goldlevel-uc-private-portal',
    [string]$NodeImage
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$ServiceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$OverlayRoot = [IO.Path]::GetFullPath((Join-Path $ServiceRoot '../..'))
$ServiceRelative = 'services/uc-factual-record'
$CodeEntries = @('src', 'public', 'policy', 'scripts', 'docs', 'registries', 'tests', 'ingress', 'Dockerfile', 'compose.yaml', '.dockerignore', '.gitignore', '.env.example', 'package.json', 'README.md', 'LICENSE')

function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "A required $Executable operation failed; no further step was attempted." }
}

function Assert-RegularTree {
    param([string]$Path)
    $item = Get-Item -LiteralPath $Path -Force
    $items = @($item)
    if ($item.PSIsContainer) { $items += @(Get-ChildItem -LiteralPath $Path -Recurse -Force) }
    foreach ($entry in $items) {
        if (($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Symlinks/reparse points are not accepted in source or runtime payloads.' }
    }
}

function Assert-NoLinkedParents {
    param([string]$Path)
    $current = [IO.Path]::GetFullPath($Path)
    while (-not [string]::IsNullOrEmpty($current)) {
        if (Test-Path -LiteralPath $current) {
            if (((Get-Item -LiteralPath $current -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Linked destination ancestors are not accepted.' }
        }
        $parent = [IO.Directory]::GetParent($current)
        if ($null -eq $parent) { break }
        $current = $parent.FullName
    }
}

function Assert-OutsideRepository {
    param([string]$Path)
    $current = [IO.Path]::GetFullPath($Path)
    while (-not [string]::IsNullOrEmpty($current)) {
        if (Test-Path -LiteralPath (Join-Path $current '.git')) { throw 'Private runtime must remain outside every Git working tree.' }
        $parent = [IO.Directory]::GetParent($current)
        if ($null -eq $parent) { break }
        $current = $parent.FullName
    }
}

function Protect-PrivateDirectory {
    param([string]$Path)
    if ($IsWindows) {
        $acl = [Security.AccessControl.DirectorySecurity]::new()
        $acl.SetAccessRuleProtection($true, $false)
        $principal = [Security.Principal.WindowsIdentity]::GetCurrent().User
        $acl.SetOwner($principal)
        $rule = [Security.AccessControl.FileSystemAccessRule]::new($principal, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
        $acl.AddAccessRule($rule)
        Set-Acl -LiteralPath $Path -AclObject $acl
    } else { Invoke-Checked chmod @('700', $Path) }
}

function Copy-Code {
    param([string]$Destination)
    Assert-NoLinkedParents $Destination
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    foreach ($name in $CodeEntries) {
        $source = Join-Path $ServiceRoot $name
        if (-not (Test-Path -LiteralPath $source)) { continue }
        Assert-RegularTree $source
        $target = Join-Path $Destination $name
        if (Test-Path -LiteralPath $target) { Assert-RegularTree $target }
        if ((Get-Item -LiteralPath $source -Force).PSIsContainer) {
            New-Item -ItemType Directory -Path $target -Force | Out-Null
            Get-ChildItem -LiteralPath $source -Force | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force }
        } else { Copy-Item -LiteralPath $source -Destination $target -Force }
    }
}

function Resolve-Repository {
    if ([string]::IsNullOrWhiteSpace($RepoPath)) { throw '-RepoPath is required for Stage and Push.' }
    $resolved = (Resolve-Path -LiteralPath $RepoPath).Path
    Assert-NoLinkedParents $resolved
    $root = (& git -C $resolved rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($root)) { throw 'RepoPath must be an existing Git clone.' }
    if ([IO.Path]::GetFullPath($root.Trim()) -ne [IO.Path]::GetFullPath($resolved)) { throw 'RepoPath must name the repository root.' }
    return $resolved
}

function Stage-Overlay {
    param([string]$Repository)
    $target = Join-Path $Repository $ServiceRelative
    if ([IO.Path]::GetFullPath($target) -eq $ServiceRoot) { throw 'Run Stage from the delivered overlay, not from the destination service.' }
    $servicesDirectory = Join-Path $Repository 'services'
    if (Test-Path -LiteralPath $servicesDirectory) {
        if (((Get-Item -LiteralPath $servicesDirectory -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'The destination services directory cannot be a link.' }
    }
    if (Test-Path -LiteralPath $target) {
        Assert-RegularTree $target
        if (@(Get-ChildItem -LiteralPath $target -Force).Count -gt 0 -and -not $ReplaceExistingService) { throw 'Service destination already exists. Review/back it up, then use -ReplaceExistingService for an intentional update.' }
    }
    Copy-Code $target
    $workflowSource = Join-Path $OverlayRoot '.github/workflows'
    if (Test-Path -LiteralPath $workflowSource) {
        foreach ($flow in @(Get-ChildItem -LiteralPath $workflowSource -File -Filter 'uc-factual-record*.yml')) {
            Assert-RegularTree $flow.FullName
            $workflowTarget = Join-Path $Repository '.github/workflows'
            Assert-NoLinkedParents $workflowTarget
            if (Test-Path -LiteralPath $workflowTarget) { Assert-RegularTree $workflowTarget }
            New-Item -ItemType Directory -Path $workflowTarget -Force | Out-Null
            Copy-Item -LiteralPath $flow.FullName -Destination (Join-Path $workflowTarget $flow.Name) -Force
        }
    }
    Write-Output 'Source overlay staged. Private runtime files were not copied to the repository.'
}

function Test-AllowedGitPath {
    param([string]$Path)
    return ($Path.StartsWith('services/uc-factual-record/')) -or ($Path -match '^\.github/workflows/uc-factual-record[A-Za-z0-9_.-]*\.yml$')
}

if ($Mode -eq 'Account') {
    if ([string]::IsNullOrWhiteSpace($RuntimePath)) { throw '-RuntimePath is required for Account.' }
    $accountRuntime = [IO.Path]::GetFullPath($RuntimePath)
    Assert-OutsideRepository $accountRuntime
    Assert-NoLinkedParents $accountRuntime
    $privateDirectory = Join-Path $accountRuntime 'secrets'
    New-Item -ItemType Directory -Path $privateDirectory -Force | Out-Null
    Protect-PrivateDirectory $accountRuntime
    Protect-PrivateDirectory $privateDirectory
    if ($AccountAction -ne 'list' -and $Username -notmatch '^[a-z0-9][a-z0-9._-]{2,63}$') { throw 'An account username of 3-64 permitted characters is required.' }
    $nodePath = (Get-Command node -CommandType Application -ErrorAction Stop).Source
    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = $nodePath
    $start.UseShellExecute = $false
    $start.RedirectStandardInput = $true
    $start.StandardInputEncoding = [Text.UTF8Encoding]::new($false)
    foreach ($argument in @((Join-Path $ServiceRoot 'scripts/account.mjs'), $AccountAction, '--file', (Join-Path $privateDirectory 'users.json'))) { $start.ArgumentList.Add($argument) }
    if ($AccountAction -ne 'list') { $start.ArgumentList.Add('--user'); $start.ArgumentList.Add($Username) }
    $needsPassword = $AccountAction -in @('add', 'rotate')
    if ($needsPassword) {
        foreach ($argument in @('--days', [string]$AccountDays, '--stdin')) { $start.ArgumentList.Add($argument) }
    }
    $password = $null; $confirmation = $null
    $passwordPointer = [IntPtr]::Zero; $confirmationPointer = [IntPtr]::Zero
    $process = [Diagnostics.Process]::new(); $process.StartInfo = $start
    try {
        if ($needsPassword) {
            $password = Read-Host 'Enter the individual strong password' -AsSecureString
            $confirmation = Read-Host 'Confirm password' -AsSecureString
            $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
            $confirmationPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($confirmation)
            $difference = $password.Length -bxor $confirmation.Length
            for ($index = 0; $index -lt [Math]::Min($password.Length, $confirmation.Length); $index++) {
                $difference = $difference -bor ([Runtime.InteropServices.Marshal]::ReadInt16($passwordPointer, $index * 2) -bxor [Runtime.InteropServices.Marshal]::ReadInt16($confirmationPointer, $index * 2))
            }
            if ($difference -ne 0) { throw 'The two secure password entries differ.' }
        }
        if (-not $process.Start()) { throw 'The offline account tool did not start.' }
        if ($needsPassword) {
            for ($index = 0; $index -lt $password.Length; $index++) {
                $process.StandardInput.Write([char]([int][Runtime.InteropServices.Marshal]::ReadInt16($passwordPointer, $index * 2) -band 65535))
            }
        }
        $process.StandardInput.Close()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) { throw 'Offline account operation failed; inspect permissions, account state and the tool help.' }
    } finally {
        if ($passwordPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer) }
        if ($confirmationPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($confirmationPointer) }
        if ($null -ne $password) { $password.Dispose() }
        if ($null -ne $confirmation) { $confirmation.Dispose() }
        $process.Dispose()
    }
    exit 0
}

if ($Mode -eq 'Stage' -or $Mode -eq 'Push') {
    Get-Command git -ErrorAction Stop | Out-Null
    $repository = Resolve-Repository
    if ($Mode -eq 'Stage') { Stage-Overlay $repository; exit 0 }
    if (-not $ConfirmPush) { throw 'Push is explicit: supply -ConfirmPush after reviewing the staged source. Stage performs no push.' }
    if ($Branch -notmatch '^[A-Za-z0-9][A-Za-z0-9._/-]{0,120}$') { throw 'Invalid branch name.' }
    Invoke-Checked git @('check-ref-format', '--branch', $Branch)
    foreach ($path in @(& git -C $repository diff --cached --name-only)) {
        if (-not (Test-AllowedGitPath $path)) { throw 'Unrelated staged changes exist. Preserve them and stage this service separately before pushing.' }
    }
    $current = (& git -C $repository branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($current)) { throw 'A normal working branch is required; detached HEAD is not supported.' }
    if ($current -ne $Branch) {
        & git -C $repository show-ref --verify --quiet "refs/heads/$Branch"
        if ($LASTEXITCODE -eq 0) { Invoke-Checked git @('-C', $repository, 'switch', $Branch) }
        elseif ($LASTEXITCODE -eq 1) { Invoke-Checked git @('-C', $repository, 'switch', '--create', $Branch) }
        else { throw 'Unable to check the target branch.' }
    }
    # Check the final selected branch, so switching cannot invalidate validation.
    $destination = Join-Path $repository $ServiceRelative
    if (-not (Test-Path -LiteralPath (Join-Path $destination 'src/server.mjs'))) { Stage-Overlay $repository }
    Assert-NoLinkedParents $destination
    Assert-RegularTree $destination
    Get-Command node -ErrorAction Stop | Out-Null
    Get-Command npm -ErrorAction Stop | Out-Null
    Push-Location $destination
    try {
        Invoke-Checked node @('scripts/check-source.mjs')
        Invoke-Checked npm @('test')
    } finally { Pop-Location }
    Invoke-Checked git @('-C', $repository, 'add', '--', $ServiceRelative)
    $flowDirectory = Join-Path $repository '.github/workflows'
    if (Test-Path -LiteralPath $flowDirectory) {
        foreach ($flow in @(Get-ChildItem -LiteralPath $flowDirectory -File -Filter 'uc-factual-record*.yml')) {
            Invoke-Checked git @('-C', $repository, 'add', '--', ".github/workflows/$($flow.Name)")
        }
    }
    foreach ($path in @(& git -C $repository diff --cached --name-only)) {
        if (-not (Test-AllowedGitPath $path)) { throw 'A staged path is outside the authorised service/workflow overlay.' }
    }
    & git -C $repository diff --cached --quiet
    if ($LASTEXITCODE -eq 1) { Invoke-Checked git @('-C', $repository, 'commit', '--message', $CommitMessage) }
    elseif ($LASTEXITCODE -ne 0) { throw 'Unable to inspect staged changes.' }
    Invoke-Checked git @('-C', $repository, 'push', '--set-upstream', 'origin', "HEAD:refs/heads/$Branch")
    Write-Output 'Code branch pushed. Private runtime and deployment were not sent to GitHub.'
    exit 0
}

# Deploy is an independent direct SSH transfer; it does not commit or push.
foreach ($name in @('ssh', 'scp', 'tar')) { Get-Command $name -ErrorAction Stop | Out-Null }
if ($SshTarget -notmatch '^[a-z_][a-z0-9_-]{0,31}@[A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$') { throw 'SshTarget must be a validated user@hostname (no shell syntax).' }
if ($NodeImage -notmatch '^node:24(?:-[a-z0-9.-]+)?@sha256:[a-f0-9]{64}$') { throw 'NodeImage must pin a reviewed Node 24 image by SHA-256 digest.' }
if ([string]::IsNullOrWhiteSpace($RuntimePath)) { throw '-RuntimePath is required for Deploy; it must remain outside the repository.' }
$runtime = (Resolve-Path -LiteralPath $RuntimePath).Path
Assert-OutsideRepository $runtime
Assert-NoLinkedParents $runtime
Assert-RegularTree $runtime
foreach ($required in @('content/manifest.json', 'secrets/users.json')) {
    $requiredPath = Join-Path $runtime $required
    if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf) -or (Get-Item -LiteralPath $requiredPath).Length -eq 0) { throw 'Private content manifest and account file are required.' }
}
$identity = (Resolve-Path -LiteralPath $SshIdentityFile).Path
$knownHosts = (Resolve-Path -LiteralPath $KnownHostsFile).Path
foreach ($file in @($identity, $knownHosts)) {
    Assert-RegularTree $file
    if ((Get-Item -LiteralPath $file).PSIsContainer -or (Get-Item -LiteralPath $file).Length -eq 0 -or $file -match '["\r\n]') { throw 'Identity and independently verified known_hosts must be nonempty regular files with safe path names.' }
}
$sshOptions = @('-F', 'none', '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes', '-o', "UserKnownHostsFile=`"$knownHosts`"", '-o', 'ClearAllForwardings=yes', '-o', 'ConnectTimeout=15', '-o', 'LogLevel=ERROR', '-i', $identity)
$temporary = Join-Path ([IO.Path]::GetTempPath()) ('goldlevel-uc-' + [Guid]::NewGuid().ToString('N'))
$remoteStage = $null
New-Item -ItemType Directory -Path $temporary | Out-Null
try {
    Protect-PrivateDirectory $temporary
    Copy-Code (Join-Path $temporary 'service')
    New-Item -ItemType Directory -Path (Join-Path $temporary 'private-runtime/secrets') -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $runtime 'content') -Destination (Join-Path $temporary 'private-runtime/content') -Recurse
    Copy-Item -LiteralPath (Join-Path $runtime 'secrets/users.json') -Destination (Join-Path $temporary 'private-runtime/secrets/users.json')
    $archive = Join-Path $temporary 'bundle.tar'
    Invoke-Checked tar @('-C', $temporary, '-cf', $archive, 'service', 'private-runtime')
    $created = @(& ssh @sshOptions -p $SshPort $SshTarget 'umask 077; mktemp -d /tmp/gluc-bridge.XXXXXXXX')
    if ($LASTEXITCODE -ne 0 -or $created.Count -ne 1 -or $created[0] -notmatch '^/tmp/gluc-bridge\.[A-Za-z0-9]{8}$') { throw 'Verified SSH staging failed. Check the host key, identity and host authorisation.' }
    $remoteStage = $created[0]
    Invoke-Checked scp (@('-q') + $sshOptions + @('-P', [string]$SshPort, $archive, "${SshTarget}:$remoteStage/bundle.tar"))
    # Every interpolated remote value is restricted to the allowlisted grammars
    # above. No user-provided script text, key material or password is evaluated.
    $remoteCommand = "tar -xf '$remoteStage/bundle.tar' -C '$remoteStage' && sudo -n bash '$remoteStage/service/scripts/deploy-host.sh' --bundle '$remoteStage' --root '$RemoteRoot' --node-image '$NodeImage'"
    Invoke-Checked ssh ($sshOptions + @('-p', [string]$SshPort, $SshTarget, $remoteCommand))
    Write-Output 'Host container step completed. Existing HTTPS ingress integration and live recipient access checks remain required.'
} finally {
    if ($null -ne $remoteStage -and $remoteStage -match '^/tmp/gluc-bridge\.[A-Za-z0-9]{8}$') {
        & ssh @sshOptions -p $SshPort $SshTarget "rm -rf -- '$remoteStage'" 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Warning 'The restricted remote staging directory could not be removed; remove it through the verified host session.' }
    }
    if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary -Recurse -Force }
}
