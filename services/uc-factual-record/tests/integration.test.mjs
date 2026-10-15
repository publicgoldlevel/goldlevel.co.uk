import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE, ORIGIN, PDF, PRIVATE_TEXT, PASSWORD, EDGE_KEY, fixture, login, loginProof, submitLogin, cookie, assertPrivateHeaders, sha256 } from './helpers.mjs';

test('anonymous navigation has no case content and redirects to login', async t => {
  const fx = await fixture(t);
  for (const path of [BASE, BASE + '/', BASE + '/record']) {
    const response = await fx.request(path);
    assert.equal(response.status, 303);
    assert.equal(response.headers.location, BASE + '/login');
    assert.equal(response.text.includes(PRIVATE_TEXT), false);
    assertPrivateHeaders(response);
  }
  const page = await fx.request(BASE + '/login');
  assert.equal(page.status, 200);
  assert.equal(page.text.includes(PRIVATE_TEXT), false);
  assert.match(page.text, /method="post"/);
  const css = await fx.request(BASE + '/assets/login.css');
  assert.equal(css.status, 200);
  assertPrivateHeaders(css);
  const health = await fx.request('/_health', { headers: { Host: null, 'X-Portal-Edge-Key': null, 'X-Forwarded-Proto': null } });
  assert.equal(health.status, 204);
  assert.equal(health.bytes.length, 0);
});

test('successful login protects record, metadata, text and original byte stream', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  for (const value of auth.response.headers['set-cookie']) {
    assert.match(value, /; HttpOnly; Secure; SameSite=Strict/);
    assert.match(value, /Path=\/uc_factual_record;/);
  }
  const headers = { Cookie: auth.cookie };
  const page = await fx.request(BASE + '/record', { headers });
  assert.equal(page.status, 200);
  assert.match(page.text, new RegExp(PRIVATE_TEXT));
  assert.equal(page.text.includes('%%LOGOUT_CSRF%%'), false);
  assert.equal(page.text.includes(auth.csrf), true);
  assertPrivateHeaders(page);
  for (const path of ['/assets/case.js', '/assets/case.css']) {
    const asset = await fx.request(BASE + path, { headers });
    assert.equal(asset.status, 200);
    assertPrivateHeaders(asset);
  }
  const doc = await fx.request(BASE + '/documents/D01', { headers });
  assert.equal(doc.status, 200);
  assert.equal(doc.headers['content-type'], 'application/pdf');
  assert.deepEqual(doc.bytes, PDF);
  assert.equal(sha256(doc.bytes), fx.manifest.documents.D01.sha256);
  assert.equal(doc.headers['content-digest'], `sha-256=:${Buffer.from(sha256(PDF), 'hex').toString('base64')}:`);
  assertPrivateHeaders(doc, { pdf: true });
  const text = await fx.request(BASE + '/api/documents/D01/text', { headers });
  assert.equal(text.status, 200);
  assert.deepEqual(JSON.parse(text.text), { pages: [PRIVATE_TEXT] });
  assertPrivateHeaders(text);
  const again = await fx.request(BASE + '/login', { headers });
  assert.equal(again.status, 303);
  assert.equal(again.headers.location, BASE + '/record');
});

test('HEAD, single ranges and suffix ranges preserve authenticated byte routing', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  const headers = { Cookie: auth.cookie };
  for (const path of ['/record', '/api/session', '/documents/D01', '/api/documents/D01/text', '/assets/case.js']) {
    const response = await fx.request(BASE + path, { method: 'HEAD', headers });
    assert.equal(response.status, 200);
    assert.equal(response.bytes.length, 0);
    assert.ok(Number(response.headers['content-length']) > 0);
  }
  for (const [range, expected] of [['bytes=0-4', PDF.subarray(0, 5)], ['bytes=-6', PDF.subarray(-6)], ['bytes=5-', PDF.subarray(5)], ['bytes=0-99999', PDF]]) {
    const response = await fx.request(BASE + '/documents/D01', { headers: { ...headers, Range: range } });
    assert.equal(response.status, 206);
    assert.deepEqual(response.bytes, expected);
    assert.match(response.headers['content-range'], /^bytes \d+-\d+\/\d+$/);
    if (response.headers['content-digest']) assert.equal(response.headers['content-digest'], `sha-256=:${Buffer.from(sha256(expected), 'hex').toString('base64')}:`);
    assertPrivateHeaders(response, { pdf: true });
  }
  for (const range of ['bytes=', 'bytes=-0', 'bytes=3-1', 'bytes=99999-', 'bytes=0-1,3-4', 'items=0-2', 'bytes=9007199254740992-']) {
    const response = await fx.request(BASE + '/documents/D01', { headers: { ...headers, Range: range } });
    assert.equal(response.status, 416, range);
    assert.equal(response.bytes.length, 0);
    assert.equal(response.headers['content-range'], `bytes */${PDF.length}`);
  }
});

test('logout needs same-origin CSRF and revokes old session immediately', async t => {
  const fx = await fixture(t);
  const auth = await login(fx);
  for (const [origin, csrf] of [['https://attacker.invalid', auth.csrf], [ORIGIN, 'invalid'], [undefined, auth.csrf]]) {
    const response = await fx.request(BASE + '/logout', { method: 'POST', body: new URLSearchParams({ csrf }).toString(), headers: { Cookie: auth.cookie, Origin: origin || null, 'Content-Type': 'application/x-www-form-urlencoded' } });
    assert.equal(response.status, 403);
  }
  const response = await fx.request(BASE + '/logout', { method: 'POST', body: new URLSearchParams({ csrf: auth.csrf }).toString(), headers: { Cookie: auth.cookie, Origin: ORIGIN, 'Content-Type': 'application/x-www-form-urlencoded' } });
  assert.equal(response.status, 303);
  assert.equal(response.headers.location, BASE + '/login');
  assert.match(response.headers['set-cookie'][0], /Max-Age=0/);
  const replay = await fx.request(BASE + '/documents/D01', { headers: { Cookie: auth.cookie } });
  assert.equal(replay.status, 401);
  assert.equal(replay.text.includes(PRIVATE_TEXT), false);
  const events = fx.audit.map(record => record.event);
  assert.ok(events.includes('LOGIN_SUCCEEDED'));
  assert.ok(events.includes('LOGOUT'));
});

test('fresh preauth and session tokens are unpredictable, single-use, and not fixed by caller', async t => {
  const fx = await fixture(t);
  const first = await loginProof(fx);
  const second = await loginProof(fx);
  assert.notEqual(first.cookie, second.cookie);
  assert.notEqual(first.csrf, second.csrf);
  const successful = await submitLogin(fx, first);
  assert.equal(successful.status, 303);
  const old = cookie(successful, '__Secure-gluc_session');
  const replay = await submitLogin(fx, first);
  assert.equal(replay.status, 403);
  const fixed = '__Secure-gluc_session=' + 'A'.repeat(43);
  const next = await submitLogin(fx, second, {}, { headers: { Cookie: second.cookie + '; ' + fixed } });
  assert.equal(next.status, 303);
  assert.notEqual(cookie(next, '__Secure-gluc_session'), fixed);
  assert.notEqual(cookie(next, '__Secure-gluc_session'), old);
});

test('idle and absolute expiry revoke sessions using server clock', async t => {
  const fx = await fixture(t, { config: { sessionIdleMs: 1000, sessionAbsoluteMs: 2500 } });
  const first = await login(fx);
  fx.clock.value += 1001;
  const expired = await fx.request(BASE + '/api/session', { headers: { Cookie: first.cookie } });
  assert.equal(expired.status, 401);
  const second = await login(fx);
  for (let i = 0; i < 3; i++) {
    fx.clock.value += 800;
    assert.equal((await fx.request(BASE + '/api/session', { headers: { Cookie: second.cookie } })).status, 200);
  }
  fx.clock.value += 101;
  assert.equal((await fx.request(BASE + '/documents/D01', { headers: { Cookie: second.cookie } })).status, 401);
});

test('completed document responses have per-file bounded receipts without credentials or content', async t => {
  const fx = await fixture(t);
  assert.equal((await fx.request(BASE + '/documents/D01')).status, 401);
  assert.equal(fx.audit.some(record => record.event === 'DOCUMENT_RESPONSE_SENT'), false);
  const first = await login(fx);
  const headers = { Cookie: first.cookie };
  assert.equal((await fx.request(BASE + '/documents/D01', { headers })).status, 200);
  assert.equal((await fx.request(BASE + '/documents/D01', { method: 'HEAD', headers })).status, 200);
  assert.equal((await fx.request(BASE + '/documents/D01', { headers: { ...headers, Range: 'bytes=0-4' } })).status, 206);
  assert.equal((await fx.request(BASE + '/documents/MISSING', { headers })).status, 404);
  const second = await login(fx);
  assert.equal((await fx.request(BASE + '/documents/D01', { headers: { Cookie: second.cookie } })).status, 200);
  await new Promise(resolve => setImmediate(resolve));
  const receipts = fx.audit.filter(record => record.event === 'DOCUMENT_RESPONSE_SENT');
  assert.equal(receipts.length, 4);
  assert.deepEqual(receipts.map(record => [record.method, record.status, record.bytes]), [['GET', 200, PDF.length], ['HEAD', 200, 0], ['GET', 206, 5], ['GET', 200, PDF.length]]);
  for (const receipt of receipts) {
    assert.deepEqual(Object.keys(receipt).sort(), ['at', 'event', 'subject', 'documentId', 'sha256', 'method', 'status', 'bytes'].sort());
    assert.equal(receipt.documentId, 'D01');
    assert.equal(receipt.sha256, fx.manifest.documents.D01.sha256);
    assert.match(receipt.subject, /^[a-f0-9]{20}$/);
    assert.equal(receipt.subject, receipts[0].subject, 'The same account can link its document receipts across fresh sessions');
    assert.equal(receipt.at, new Date(fx.clock.value).toISOString());
  }
  const all = JSON.stringify(fx.audit);
  for (const sensitive of [PASSWORD, EDGE_KEY, PRIVATE_TEXT, 'synthetic.pdf', 'reader', first.cookie, first.csrf, second.cookie, second.csrf, ORIGIN]) assert.equal(all.includes(sensitive), false, 'Audit excludes ' + sensitive);
});
