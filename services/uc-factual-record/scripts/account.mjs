#!/usr/bin/env node
// Local administrator tool. Passwords arrive only through standard input.
import { constants } from 'node:fs';
import { open, lstat, realpath, rename, unlink } from 'node:fs/promises';
import { dirname, basename, resolve, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { derivePassword, validateUsers } from '../src/auth.mjs';

const USERNAME = /^[a-z0-9][a-z0-9._-]{2,63}$/;
const NOFOLLOW = constants.O_NOFOLLOW || 0;
const MAX_FILE_BYTES = 1024 * 1024;
const fail = () => { throw new Error('Account operation could not be completed.'); };

function options(argv) {
  const [command, ...rest] = argv;
  if (!['add', 'rotate', 'revoke', 'list'].includes(command)) fail();
  const result = { command };
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    if (!['--file', '--user', '--days', '--stdin'].includes(key) || Object.hasOwn(result, key.slice(2))) fail();
    if (key === '--stdin') result.stdin = true;
    else {
      const value = rest[++i];
      if (!value || value.startsWith('--')) fail();
      result[key.slice(2)] = value;
    }
  }
  if (!result.file || result.file.includes('\0')) fail();
  result.file = resolve(result.file);
  if (command === 'list') {
    if (result.user || result.days || result.stdin) fail();
  } else {
    if (!result.user || !USERNAME.test(result.user)) fail();
    if (command === 'revoke') {
      if (result.days || result.stdin) fail();
    } else {
      if (!result.stdin) fail();
      if (result.days !== undefined && !/^(?:[1-9]|[1-8][0-9]|90)$/.test(result.days)) fail();
      result.days = Number(result.days || 30);
    }
  }
  return result;
}

async function privateParent(file) {
  const dir = dirname(file);
  // Refuse linked parents, including an attacker-controlled intermediate link.
  if (await realpath(dir) !== dir) fail();
  const stat = await lstat(dir);
  if (!stat.isDirectory() || stat.isSymbolicLink()) fail();
  if (process.platform !== 'win32') {
    if ((stat.mode & 0o022) !== 0 || (process.getuid && stat.uid !== process.getuid())) fail();
  }
  return dir;
}

async function readUsers(file, mayCreate) {
  let handle;
  try {
    const before = await lstat(file);
    if (!before.isFile() || before.isSymbolicLink()) fail();
    handle = await open(file, constants.O_RDONLY | NOFOLLOW);
    const stat = await handle.stat();
    if (!stat.isFile() || stat.nlink !== 1 || stat.size > MAX_FILE_BYTES || before.dev !== stat.dev || before.ino !== stat.ino) fail();
    if (process.platform !== 'win32' && ((stat.mode & 0o077) !== 0 || (process.getuid && stat.uid !== process.getuid()))) fail();
    const data = JSON.parse(await handle.readFile('utf8'));
    return { version: 1, users: validateUsers(data) };
  } catch (error) {
    if (mayCreate && error.code === 'ENOENT') return { version: 1, users: [] };
    throw error;
  } finally { await handle?.close(); }
}

async function readPassword() {
  if (process.stdin.isTTY) fail();
  let count = 0;
  const chunks = [];
  for await (const chunk of process.stdin) {
    count += chunk.length;
    if (count > 258) fail();
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  try {
    let text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    if (text.endsWith('\r\n')) text = text.slice(0, -2);
    else if (text.endsWith('\n')) text = text.slice(0, -1);
    if (/[\r\n]/.test(text)) fail();
    return text;
  } finally { buffer.fill(0); for (const chunk of chunks) chunk.fill(0); }
}

async function atomicWrite(file, dir, data) {
  const temporary = join(dir, `.${basename(file)}.${randomBytes(16).toString('hex')}.tmp`);
  let handle;
  try {
    handle = await open(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | NOFOLLOW, 0o600);
    await handle.chmod(0o600);
    await handle.writeFile(JSON.stringify(data, null, 2) + '\n', 'utf8');
    await handle.sync();
    await handle.close(); handle = undefined;
    await rename(temporary, file);
    if (process.platform !== 'win32') {
      const directoryHandle = await open(dir, constants.O_RDONLY);
      try { await directoryHandle.sync(); } finally { await directoryHandle.close(); }
    }
  } finally {
    await handle?.close();
    try { await unlink(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

export async function main(argv = process.argv.slice(2)) {
  if (Number(process.versions.node.split('.')[0]) !== 24) fail();
  const args = options(argv), dir = await privateParent(args.file);
  if (args.command === 'list') {
    const data = await readUsers(args.file, false);
    process.stdout.write(JSON.stringify({ version: 1, users: data.users.map(({username, enabled, expiresAt}) => ({username, enabled, expiresAt})) }, null, 2) + '\n');
    return;
  }
  // O_EXCL refuses an existing lock, including stale or linked locks. Do not guess
  // that another process is dead; an administrator must inspect stale locks.
  const lock = join(dir, `.${basename(args.file)}.lock`);
  let lockHandle;
  try {
    lockHandle = await open(lock, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | NOFOLLOW, 0o600);
    const data = await readUsers(args.file, args.command === 'add');
    const index = data.users.findIndex(user => user.username === args.user);
    if (args.command === 'add' && index !== -1) fail();
    if (args.command !== 'add' && index === -1) fail();
    let account;
    if (args.command === 'revoke') {
      account = { ...data.users[index], enabled: false };
      data.users[index] = account;
    } else {
      const password = await readPassword();
      const hash = await derivePassword(password);
      account = { username: args.user, password: hash, enabled: true, expiresAt: new Date(Date.now() + args.days * 86400000).toISOString() };
      if (args.command === 'add') data.users.push(account);
      else data.users[index] = account;
    }
    validateUsers(data);
    await atomicWrite(args.file, dir, data);
    process.stdout.write(JSON.stringify({ operation: args.command, username: account.username, enabled: account.enabled, expiresAt: account.expiresAt, restartRequired: true }) + '\n');
  } finally {
    if (lockHandle) {
      await lockHandle.close();
      await unlink(lock);
    }
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.length === 3 && ['--help','-h'].includes(process.argv[2])) {
    process.stdout.write('Offline account administration (Node.js 24):\n  account.mjs add|rotate --file ABSOLUTE_PRIVATE_FILE --user recipient-id --days 1..90 --stdin\n  account.mjs revoke --file ABSOLUTE_PRIVATE_FILE --user recipient-id\n  account.mjs list --file ABSOLUTE_PRIVATE_FILE\nPasswords: one UTF-8 line on stdin, at least 20 characters and at most 256 UTF-8 bytes.\nCreate/protect the parent directory first. Never use command-line passwords.\nUpdate your operator-owned source account file, then redeploy it through the bridge.\nThe service reloads accounts only on restart; redeployment revokes all sessions.\n');
  } else main().catch(() => {
    process.stderr.write('Account operation failed. Check options, private directory permissions, account state and input.\n');
    process.exitCode = 1;
  });
}
