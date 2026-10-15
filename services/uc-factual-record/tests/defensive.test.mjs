import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { BASE, ORIGIN, EDGE_KEY, PASSWORD, PDF, PRIVATE_TEXT, fixture, login, loginProof, submitLogin, assertPrivateHeaders } from './helpers.mjs';

test('private endpoints reject every anonymous direct, HEAD and range request', async t => {
  const fx = await fixture(t);
  const protectedPaths = ['/documents/D01', '/api/documents/D01/text', '/api/session', '/assets/case.js', '/assets/case.css'];
  for (const path of protectedPaths) for (const options of [{}, { method: 'HEAD' }, { headers: { Range: 'bytes=0-20', 'If-None-Match': '*' } }]) {
    const response = await fx.request(BASE + path, options);
    assert.equal(response.status, 401, path);
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
    assert.equal(response.text.includes('synthetic.pdf'), false);
    assertPrivateHeaders(response);
  }
  for (const path of ['/manifest.json', '/index.html', '/documents/D01.pdf', '/documents/D01.text.json', '/assets/case.js.map', '/.env', '/users.json', '/api/documents', '/content', '/api/ai', '/api/upload', '/api/fetch']) {
    const response = await fx.request(BASE + path);
    assert.equal(response.status, 404, path);
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
  }
});

test('ambiguous paths, encodings, traversal and query values fail before routing', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  for (const path of ['/../users.json', '/%2e%2e/users.json', '/%252e%252e/users.json', '/documents/%44%30%31', '/documents/D01%00.pdf', '/documents/%', '/documents/%GG', '/documents/D01?download=1', '/login?next=https://attacker.invalid', '//record', '/documents/../D01', '/documents/./D01', '/documents/..\\D01']) {
    const response = await fx.request(BASE + path, { headers: { Cookie: auth.cookie } });
    assert.equal(response.status, 400, path);
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
    assert.equal(response.text.includes(PASSWORD), false);
    assertPrivateHeaders(response);
  }
});

test('trusted ingress requires exact secret, HTTPS and Host without forged alternatives', async t => {
  const fx = await fixture(t);
  for (const headers of [
    { 'X-Portal-Edge-Key': null },
    { 'X-Portal-Edge-Key': 'wrong-key' },
    { 'X-Forwarded-Proto': 'http' },
    { 'X-Forwarded-Proto': 'https,http' },
    { Host: 'attacker.invalid', 'X-Forwarded-Host': 'example.test' },
    { Host: 'example.test:443' },
    { Host: null },
    { 'X-Portal-Edge-Key': null, Forwarded: 'proto=https;host=example.test', 'X-Forwarded-For': '127.0.0.1' }
  ]) {
    const response = await fx.request(BASE + '/login', { headers });
    assert.equal(response.status, 421, JSON.stringify(headers));
    assertPrivateHeaders(response);
  }
  const invalidIP = await fx.request(BASE + '/login', { headers: { 'X-Portal-Client-IP': '1.2.3.4, 5.6.7.8' } });
  assert.equal(invalidIP.status, 400);
  const duplicate = await fx.request(BASE + '/login', { rawHeaders: ['Host', 'example.test', 'X-Portal-Edge-Key', EDGE_KEY, 'X-Forwarded-Proto', 'https', 'Origin', ORIGIN, 'Origin', 'https://attacker.invalid', 'Connection', 'close'] });
  assert.equal(duplicate.status, 400);
});

test('authentication rejects absent, forged and duplicate cookies without information disclosure', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  for (const value of ['__Secure-gluc_session=' + 'A'.repeat(43), '__Secure-gluc_session=bad', auth.cookie + '; ' + auth.cookie, 'gluc_session=' + auth.cookie.split('=')[1]]) {
    const response = await fx.request(BASE + '/documents/D01', { headers: { Cookie: value } });
    assert.equal(response.status, 401, value);
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
  }
  for (const [origin, fetchSite] of [[null, null], ['https://attacker.invalid', null], [ORIGIN + '/', null], [ORIGIN, 'cross-site']]) {
    const proof = await loginProof(fx);
    const response = await submitLogin(fx, proof, {}, { headers: { Origin: origin, 'Sec-Fetch-Site': fetchSite } });
    assert.equal(response.status, 403);
  }
  const mismatched = await loginProof(fx);
  const other = await loginProof(fx);
  assert.equal((await submitLogin(fx, mismatched, { csrf: other.csrf })).status, 403);
});

test('malformed login bodies, duplicate fields and unsupported body types are bounded', async t => {
  const fx = await fixture(t);
  for (const [type, body, expected] of [
    ['application/json', '{}', 415],
    ['application/x-www-form-urlencoded', 'csrf=%GG&username=reader&password=x', 400],
    ['application/x-www-form-urlencoded', 'csrf=x&csrf=y&username=reader&password=x', 400],
    ['application/x-www-form-urlencoded', 'csrf=x&username=reader&password=x&tool=exec', 400],
    ['application/x-www-form-urlencoded', 'x'.repeat(5000), 413]
  ]) {
    const response = await fx.request(BASE + '/login', { method: 'POST', body, headers: { Origin: ORIGIN, 'Content-Type': type } });
    assert.equal(response.status, expected);
    assert.equal(response.text.includes('Error:'), false);
    assert.equal(response.text.includes('node:'), false);
    assertPrivateHeaders(response);
  }
  const chunked = await fx.request(BASE + '/login', { method: 'POST', body: 'x'.repeat(5000), chunked: true, headers: { Origin: ORIGIN, 'Content-Type': 'application/x-www-form-urlencoded' } });
  assert.equal(chunked.status, 413);
});

test('credential failure is generic for missing user and wrong password', async t => {
  const fx = await fixture(t);
  const missing = await submitLogin(fx, await loginProof(fx), { username: 'missing' });
  const wrong = await submitLogin(fx, await loginProof(fx), { password: 'incorrect password' });
  assert.equal(missing.status, 401);
  assert.equal(wrong.status, 401);
  assert.match(missing.text, /Sign-in failed/);
  assert.match(wrong.text, /Sign-in failed/);
  const scrub = value => value.replace(/name="csrf" value="[A-Za-z0-9_-]+"/, 'name="csrf" value="TOKEN"');
  assert.equal(scrub(missing.text), scrub(wrong.text));
  const tooLong = await submitLogin(fx, await loginProof(fx), { password: 'x'.repeat(257) });
  assert.equal(tooLong.status, 401);
  const audit = JSON.stringify(fx.audit);
  for (const secret of [PASSWORD, EDGE_KEY, PRIVATE_TEXT, 'incorrect password', 'missing', 'reader']) assert.equal(audit.includes(secret), false, secret);
});

test('login limits resist account rotation, forwarded spoofing and expire by server time', async t => {
  const fx = await fixture(t, { config: { limits: { ip: 2, account: 20, global: 20, windowMs: 1000 } } });
  for (let i = 0; i < 2; i++) {
    const response = await submitLogin(fx, await loginProof(fx), { username: 'missing' + i, password: 'wrong' }, { headers: { 'X-Forwarded-For': '203.0.113.' + i } });
    assert.equal(response.status, 401);
  }
  const throttled = await submitLogin(fx, await loginProof(fx), { username: 'different' }, { headers: { 'X-Forwarded-For': '198.51.100.42' } });
  assert.equal(throttled.status, 429);
  assert.equal(throttled.headers['retry-after'], '1');
  fx.clock.value += 1001;
  assert.equal((await submitLogin(fx, await loginProof(fx))).status, 303);
  assert.ok(fx.audit.some(record => record.event === 'LOGIN_THROTTLED'));
});

test('per-account and global limits remain effective across trusted client IPs', async t => {
  const account = await fixture(t, { config: { limits: { ip: 20, account: 1, global: 20, windowMs: 1000 } } });
  assert.equal((await submitLogin(account, await loginProof(account), { password: 'wrong' }, { headers: { 'X-Portal-Client-IP': '192.0.2.1' } })).status, 401);
  assert.equal((await submitLogin(account, await loginProof(account), { password: 'wrong' }, { headers: { 'X-Portal-Client-IP': '192.0.2.2' } })).status, 429);
  const global = await fixture(t, { config: { limits: { ip: 20, account: 20, global: 1, windowMs: 1000 } } });
  assert.equal((await submitLogin(global, await loginProof(global), { username: 'missing1' }, { headers: { 'X-Portal-Client-IP': '192.0.2.1' } })).status, 401);
  assert.equal((await submitLogin(global, await loginProof(global), { username: 'missing2' }, { headers: { 'X-Portal-Client-IP': '192.0.2.2' } })).status, 429);
});

test('unknown methods, CORS preflight and hidden AI/effect endpoints do not open capabilities', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  for (const method of ['TRACE', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']) {
    const response = await fx.request(BASE + '/record', { method, headers: { Cookie: auth.cookie, Origin: 'https://attacker.invalid' } });
    assert.equal(response.status, 405, method);
    assert.equal(response.headers['access-control-allow-origin'], undefined);
  }
  for (const path of ['/api/ai', '/api/llm', '/api/upload', '/api/fetch', '/api/tools/exec', '/admin', '/metrics', '/debug', '/record/source', '/.git/config']) {
    const response = await fx.request(BASE + path, { headers: { Cookie: auth.cookie } });
    assert.equal(response.status, 404, path);
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
  }
  const getLogout = await fx.request(BASE + '/logout', { headers: { Cookie: auth.cookie } });
  assert.equal(getLogout.status, 405);
  const postDoc = await fx.request(BASE + '/documents/D01', { method: 'POST', headers: { Cookie: auth.cookie } });
  assert.equal(postDoc.status, 405);
});

test('content startup fails closed for changed bytes, traversal and symlinked files', async t => {
  const fx = await fixture(t);
  const { loadContent } = await import('../src/content.mjs');
  await writeFile(join(fx.contentDir, 'documents/D01.pdf'), Buffer.from('changed bytes'));
  await assert.rejects(loadContent(fx.contentDir));
  await writeFile(join(fx.contentDir, 'documents/D01.pdf'), PDF);
  const manifest = JSON.parse(await readFile(join(fx.contentDir, 'manifest.json'), 'utf8'));
  manifest.documents.D01.file = '../users.json';
  await writeFile(join(fx.contentDir, 'manifest.json'), JSON.stringify(manifest));
  await assert.rejects(loadContent(fx.contentDir));
  manifest.documents.D01.file = 'documents/D01.pdf';
  await writeFile(join(fx.contentDir, 'manifest.json'), JSON.stringify(manifest));
  const { unlink } = await import('node:fs/promises');
  await unlink(join(fx.contentDir, 'documents/D01.pdf'));
  await symlink(fx.usersFile, join(fx.contentDir, 'documents/D01.pdf'));
  await assert.rejects(loadContent(fx.contentDir));
});

test('replacing runtime files after verified startup cannot swap served evidence bytes', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  await writeFile(join(fx.contentDir, 'documents/D01.pdf'), 'CHANGED-AFTER-START');
  const response = await fx.request(BASE + '/documents/D01', { headers: { Cookie: auth.cookie } });
  assert.equal(response.status, 200);
  assert.deepEqual(response.bytes, PDF);
});

test('expired preauthentication and account expiry are enforced by server time', async t => {
  const fx = await fixture(t, { accountOverrides: { expiresAt: new Date(Date.now() + 60000).toISOString() } });
  const auth = await login(fx);
  fx.clock.value += 61000;
  const expiredSession = await fx.request(BASE + '/documents/D01', { headers: { Cookie: auth.cookie } });
  assert.equal(expiredSession.status, 401);
  const accountRetry = await submitLogin(fx, await loginProof(fx));
  assert.equal(accountRetry.status, 401);
  const proof = await loginProof(fx);
  fx.clock.value += 600001;
  const preauthRetry = await submitLogin(fx, proof);
  assert.equal(preauthRetry.status, 403);
});
