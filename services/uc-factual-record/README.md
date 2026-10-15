# Goldlevel private factual record service

Read-only authenticated service at `/uc_factual_record`. Requires Node.js 24 LTS; no third-party npm packages are installed. It is intended for one container behind an existing trusted HTTPS ingress. The service starts only with a valid private content manifest, at least one enabled unexpired account and an ingress authentication key.

## Check the source

```sh
node scripts/check-source.mjs
npm test
```

CI uses synthetic documents only. The GitHub workflow has read-only repository permissions and no deployment credentials. It resolves and records the test runtime image digest, runs tests without external network access and builds the production image without evidence content. It does not publish or deploy.

## Runtime contract

| Variable | Required value |
| --- | --- |
| `PUBLIC_ORIGIN` | `https://goldlevel.co.uk`, without a trailing slash |
| `BASE_PATH` | `/uc_factual_record` |
| `CONTENT_DIR` | Private manifest-backed evidence directory, `/content` in the container |
| `USERS_FILE` | Private account file, `/run/secrets/users.json` in the container |
| `EDGE_KEY_FILE` | Private random ingress key, `/run/secrets/edge-key` |
| `PORT` | `8080` inside the container |
| `HOST` | `0.0.0.0` inside the constrained container; host publication remains loopback |

Every ingress request must carry the exact public Host, `X-Forwarded-Proto: https` and the private `X-Portal-Edge-Key`. The ingress must overwrite the key and `X-Portal-Client-IP` headers, preserving the requested path without stripping its prefix. The application ignores client-supplied `X-Forwarded-For`. The empty `/_health` liveness endpoint does not require the ingress key and reveals no record information.

The supplied Compose file, host deployment script and PowerShell bridge are the integration path. Read their help and `.env.example` before running them. Review the generated ingress fragment and merge it into the existing site's configuration; do not replace the site's whole configuration.

## Accounts

```sh
node scripts/account.mjs --help
```

Use a distinct username and a strong password for each recipient. Account administration is an offline operator action; the web application has no signup, reset or account-editing endpoints. Store account data outside Git. After changes, restart the service to load the new account file and revoke all active sessions. The account file is password-hash material and still needs strict access controls and encrypted backups.

For PowerShell 7, run from the service directory and set `$accountFile` to the absolute operator-owned source file outside the repository. Create its parent directory first and restrict its ACL to your account (POSIX: owner-only directory, file mode 0600). Then enter the password privately:

```powershell
$accountFile = 'C:\Private\uc-record\secrets\users.json'
$secret = Read-Host 'New recipient password (20+ characters)' -AsSecureString
$secretBstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretBstr) |
        node ./scripts/account.mjs add --file $accountFile --user recipient-id --days 7 --stdin
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretBstr)
    $secret = $null
}
```

`rotate` requires the same stdin flow; `revoke` needs only the filename and username. Update this source account file and redeploy it through the bridge. The installer produces a read-only runtime snapshot owned by the container UID; do not run the offline account editor directly against that snapshot. Successful redeployment recreates the service and invalidates every active session. For urgent revocation, stop the portal first while preparing the updated account source.

## Content import and updates

The delivered private payload has already been imported. To import a revised self-contained record locally:

```sh
node scripts/import-bundle.mjs --input /private/source.html --output /private/content --assets ./public --statement /private/edited-statement.md
```

The importer separates document bytes and extracted text from the HTML. The service authenticates each later document/text request and checks the manifest at startup. It does not transform original document bytes. Review any revised HTML before import; hashes establish consistency with supplied bytes, not factual authenticity or safe PDF content. Import into a new empty directory, check it and restart with the new mount. Keep the prior reviewed payload for rollback.

## Deploy and operate

`scripts/Bridge-Goldlevel.ps1` handles the PowerShell/GitHub/SSH bridge. Run `Get-Help` on it for the supported parameters. Stage copies only code; Push is explicit and never force-pushes. Deploy transfers runtime evidence through SSH, outside the repository. A verified Linux Docker host and separately configured HTTPS ingress are required. Existing site security, DNS, certificate renewal, log retention and backup custody remain host responsibilities.

Read [SECURITY.md](docs/SECURITY.md), [OPERATIONS.md](docs/OPERATIONS.md), [THREAT-MODEL.md](docs/THREAT-MODEL.md) and [AI-BOUNDARY.md](docs/AI-BOUNDARY.md). Runtime and release registries record what was configured and tested; design references do not establish certification or live security.

## Licence

New service code is MIT licensed. Private evidence, supplied research, harnesses and third-party documents retain their own rights. Never publish private runtime material as a repository asset, Actions artifact, release attachment or container layer.
