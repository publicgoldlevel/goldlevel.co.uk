import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, chmod, readFile, readdir, realpath, rm, symlink, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { derivePassword, verifyPassword, validateUsers, SessionStore, Limiter } from '../src/auth.mjs';

const synthetic = 'Synthetic fixture only 2026!';
let record;
before(async () => { record = await derivePassword(synthetic); });
const configuration = () => ({ version: 1, users: [{ username: 'reader', password: {...record}, enabled: true, expiresAt: '2099-01-01T00:00:00.000Z' }] });

test('fixed-cost password record verifies correct input and rejects a wrong input', async () => {
  assert.equal(record.algorithm, 'scrypt');
  assert.equal(record.N, 131072); assert.equal(record.r, 8); assert.equal(record.p, 1);
  assert.equal(Buffer.from(record.salt, 'base64url').length, 32);
  assert.equal(Buffer.from(record.hash, 'base64url').length, 64);
  assert.equal(await verifyPassword(synthetic, record), true);
  assert.equal(await verifyPassword('Incorrect synthetic password!', record), false);
  assert.equal(await verifyPassword('unknown', record), false);
});

test('password/configuration limits fail closed without accepting arbitrary KDF costs', async () => {
  await assert.rejects(derivePassword('short'));
  await assert.rejects(derivePassword('a'.repeat(257)));
  await assert.rejects(derivePassword('a'.repeat(21)+'\n'));
  await assert.rejects(derivePassword('a'.repeat(20)+'\ud800'));
  assert.equal(await verifyPassword(synthetic, {...record, N: 2**30}), false);
  assert.equal(await verifyPassword(synthetic, {...record, hash: record.hash+'='}), false);
  assert.equal(await verifyPassword(synthetic, null), false);
  assert.equal(validateUsers(configuration())[0].username, 'reader');
  const duplicate=configuration(); duplicate.users.push({...duplicate.users[0]});
  assert.throws(()=>validateUsers(duplicate));
  const uppercase=configuration(); uppercase.users[0].username='Reader';
  assert.throws(()=>validateUsers(uppercase));
  const extra=configuration(); extra.users[0].admin=true;
  assert.throws(()=>validateUsers(extra));
  const wrongDate=configuration(); wrongDate.users[0].expiresAt='2099-01-01';
  assert.throws(()=>validateUsers(wrongDate));
});

test('sessions rotate opaque tokens, enforce idle and absolute expiry and bound capacity', () => {
  let now=1000;
  const sessions=new SessionStore({now:()=>now,idleMs:100,absoluteMs:250,maxSessions:1});
  const first=sessions.create('reader');
  assert.match(first.token,/^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first.token,first.csrf);
  assert.equal(sessions.get(first.token).username,'reader');
  assert.equal(sessions.get('invalid'),null);
  assert.throws(()=>sessions.create('other'));
  now=1099; assert.equal(sessions.get(first.token).idleExpiresAt,1199);
  now=1198; assert.equal(sessions.get(first.token).idleExpiresAt,1250);
  now=1250; assert.equal(sessions.get(first.token),null);
  const second=sessions.create('reader'); assert.notEqual(second.token,first.token);
  assert.equal(sessions.delete(second.token),true); assert.equal(sessions.get(second.token),null);
  const third=sessions.create('reader'); sessions.clear(); assert.equal(sessions.get(third.token),null);
  const fourth=sessions.create('reader'); now+=100; assert.equal(sessions.get(fourth.token),null);
});

test('limiter blocks over-limit and new keys at capacity without evicting active counters', () => {
  let now=100;
  const limiter=new Limiter({now:()=>now,windowMs:100,maxKeys:2});
  assert.equal(limiter.take('a',2),true); assert.equal(limiter.take('a',2),true);
  assert.equal(limiter.take('a',2),false);
  assert.equal(limiter.take('b',1),true);
  assert.equal(limiter.take('new-key',1),false);
  assert.equal(limiter.take('b',1),false);
  now=199; assert.equal(limiter.take('a',2),false);
  now=200; assert.equal(limiter.take('new-key',1),true);
  assert.equal(limiter.take('a',2),true);
  now=199; assert.equal(limiter.take('a',2),false);
  assert.equal(limiter.take('x'.repeat(257),1),false);
});

function cli(args, input='') {
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/account.mjs',import.meta.url)),...args],{stdio:['pipe','pipe','pipe']});
    let stdout='',stderr='';
    child.stdout.on('data',x=>stdout+=x);child.stderr.on('data',x=>stderr+=x);
    child.on('error',reject);child.on('close',code=>resolve({code,stdout,stderr}));
    // A rejected command may exit before reading its pipe; do not turn EPIPE
    // into a test-runner error. No real credentials are used by this fixture.
    child.stdin.on('error',()=>{});child.stdin.end(input);
  });
}

test('account CLI writes atomically, lists safely, rejects duplicates, rotates explicitly and revokes', async () => {
  // Android/Termux can expose the OS-owned /data/data alias for /data/user/0.
  // The CLI intentionally rejects linked ancestors; create this fixture using
  // the canonical parent rather than weakening the CLI security boundary.
  const dir=await mkdtemp(join(await realpath(tmpdir()),'uc-auth-test-'));
  await chmod(dir,0o700);
  const file=join(dir,'users.json');
  try {
    const added=await cli(['add','--file',file,'--user','reader','--days','7','--stdin'],synthetic+'\n');
    assert.equal(added.code,0,added.stderr);
    assert.equal(added.stdout.includes(synthetic),false);assert.equal(added.stdout.includes('hash'),false);
    const data=JSON.parse(await readFile(file,'utf8'));
    assert.equal(validateUsers(data).length,1);
    assert.equal(await verifyPassword(synthetic,data.users[0].password),true);
    if(process.platform!=='win32')assert.equal((await stat(file)).mode&0o777,0o600);
    const duplicate=await cli(['add','--file',file,'--user','reader','--stdin'],synthetic+'\n');
    assert.notEqual(duplicate.code,0);assert.equal((await readFile(file,'utf8')),JSON.stringify(data,null,2)+'\n');
    const listed=await cli(['list','--file',file]);
    assert.equal(listed.code,0);assert.equal(listed.stdout.includes('hash'),false);assert.equal(listed.stdout.includes('salt'),false);
    const changed='Another synthetic password 2026!';
    const rotated=await cli(['rotate','--file',file,'--user','reader','--stdin'],changed+'\n');
    assert.equal(rotated.code,0,rotated.stderr);
    const current=JSON.parse(await readFile(file,'utf8'));
    assert.equal(await verifyPassword(changed,current.users[0].password),true);
    assert.equal(await verifyPassword(synthetic,current.users[0].password),false);
    const revoked=await cli(['revoke','--file',file,'--user','reader']);assert.equal(revoked.code,0);
    assert.equal(JSON.parse(await readFile(file,'utf8')).users[0].enabled,false);
    assert.deepEqual((await readdir(dir)).sort(),['users.json']);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('account CLI refuses linked files, unsafe directory permissions and stale locks', async () => {
  if(process.platform==='win32') return;
  const dir=await mkdtemp(join(await realpath(tmpdir()),'uc-auth-boundary-'));await chmod(dir,0o700);
  const file=join(dir,'users.json'), target=join(dir,'target.json');
  try {
    await writeFile(target,JSON.stringify(configuration()),{mode:0o600});
    assert.equal((await cli(['list','--file',target])).code,0);
    await symlink(dir,join(dir,'linked-parent'),'dir');
    assert.notEqual((await cli(['list','--file',join(dir,'linked-parent','target.json')])).code,0);
    await symlink(target,file);
    assert.notEqual((await cli(['list','--file',file])).code,0);
    await rm(file);await writeFile(join(dir,'.users.json.lock'),'synthetic lock',{mode:0o600});
    assert.notEqual((await cli(['add','--file',file,'--user','reader','--stdin'],synthetic)).code,0);
    assert.equal(await readFile(join(dir,'.users.json.lock'),'utf8'),'synthetic lock');
    await rm(join(dir,'.users.json.lock'));await chmod(dir,0o777);
    assert.notEqual((await cli(['add','--file',file,'--user','reader','--stdin'],synthetic)).code,0);
  }finally{await chmod(dir,0o700);await rm(dir,{recursive:true,force:true});}
});
