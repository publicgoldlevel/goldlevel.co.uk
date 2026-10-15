import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export const BASE = '/uc_factual_record';
export const ORIGIN = 'https://example.test';
export const EDGE_KEY = 'synthetic_test_only_edge_key_0123456789';
export const PASSWORD = 'Synthetic portal test password 2026!';
export const PDF = Buffer.from('%PDF-1.4\n% Synthetic fixture only; not real evidence\n1 0 obj<</Type/Catalog>>endobj\n%%EOF\n');
export const PRIVATE_TEXT = 'SYNTHETIC-PRIVATE-RECORD-NOT-A-REAL-CLAIM';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export async function fixture(t, options = {}) {
  const [{ createPortal }, { derivePassword }] = await Promise.all([
    import('../src/server.mjs'), import('../src/auth.mjs')
  ]);
  const tempRoot = process.env.PORTAL_TEST_TMPDIR || tmpdir();
  await mkdir(tempRoot, { recursive: true });
  const dir = await mkdtemp(join(tempRoot, 'gluc-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const contentDir = join(dir, 'content');
  await mkdir(join(contentDir, 'documents'), { recursive: true });
  const html = Buffer.from(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Synthetic fixture</title></head><body><h1>${PRIVATE_TEXT}</h1><form action="${BASE}/logout" method="post"><input name="csrf" value="%%LOGOUT_CSRF%%"></form></body></html>`);
  const text = Buffer.from(JSON.stringify([PRIVATE_TEXT]));
  await writeFile(join(contentDir, 'index.html'), html);
  await writeFile(join(contentDir, 'documents/D01.pdf'), PDF);
  await writeFile(join(contentDir, 'documents/D01.text.json'), text);
  const manifest = {
    version: 1,
    index: { file: 'index.html', sha256: sha256(html), bytes: html.length },
    documents: {
      D01: { filename: 'synthetic.pdf', title: 'Synthetic fixture', mime: 'application/pdf', kind: 'pdf', bytes: PDF.length, sha256: sha256(PDF), file: 'documents/D01.pdf', textFile: 'documents/D01.text.json', textSha256: sha256(text), pages: 1 }
    }
  };
  await writeFile(join(contentDir, 'manifest.json'), JSON.stringify(manifest));
  const password = await derivePassword(PASSWORD);
  const usersFile = join(dir, 'users.json');
  const users = options.users || [{ username: 'reader', enabled: true, expiresAt: '2099-01-01T00:00:00.000Z', password, ...options.accountOverrides }];
  await writeFile(usersFile, JSON.stringify({ version: 1, users }));
  const clock = { value: Date.now() };
  const audit = [];
  const app = await createPortal({ publicOrigin: ORIGIN, basePath: BASE, contentDir, usersFile, edgeKey: EDGE_KEY, now: () => clock.value, audit: record => audit.push(record), ...options.config });
  await new Promise((resolve, reject) => { app.server.once('error', reject); app.server.listen(0, '127.0.0.1', resolve); });
  t.after(async () => { if (app.server.listening) await app.close(); });
  const port = app.server.address().port;
  async function request(path, options = {}) {
    const headers = { Host: 'example.test', 'X-Portal-Edge-Key': EDGE_KEY, 'X-Forwarded-Proto': 'https', Connection: 'close', ...options.headers };
    for (const key of Object.keys(headers)) if (headers[key] === null) delete headers[key];
    const body = options.body === undefined ? null : Buffer.isBuffer(options.body) ? options.body : Buffer.from(options.body);
    if (body && !Object.keys(headers).some(k => k.toLowerCase() === 'content-length') && !options.chunked) headers['Content-Length'] = body.length;
    return new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port, path, method: options.method || 'GET', headers: options.rawHeaders || headers, agent: false }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => { const bytes = Buffer.concat(chunks); resolve({ status: res.statusCode, headers: res.headers, bytes, text: bytes.toString('utf8') }); });
        res.on('error', reject);
      });
      req.setTimeout(10000, () => req.destroy(new Error('Local test request timeout')));
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }
  return { app, request, clock, audit, dir, contentDir, usersFile, manifest, password };
}

export const cookie = (response, name) => {
  const value = (response.headers['set-cookie'] || []).find(value => value.startsWith(name + '='));
  return value ? value.split(';', 1)[0] : '';
};

export async function loginProof(fx) {
  const response = await fx.request(BASE + '/login');
  assert.equal(response.status, 200);
  const csrf = /name="csrf" value="([A-Za-z0-9_-]{43})"/.exec(response.text)?.[1];
  assert.ok(csrf, 'Login form has unpredictable CSRF proof');
  const preauth = cookie(response, '__Secure-gluc_preauth');
  assert.ok(preauth);
  return { csrf, cookie: preauth, response };
}

export async function submitLogin(fx, proof, values = {}, options = {}) {
  const body = new URLSearchParams({ csrf: proof.csrf, username: 'reader', password: PASSWORD, ...values }).toString();
  return fx.request(BASE + '/login', { method: 'POST', body, ...options, headers: { Origin: ORIGIN, Cookie: proof.cookie, 'Content-Type': 'application/x-www-form-urlencoded', ...options.headers } });
}

export async function login(fx) {
  const proof = await loginProof(fx);
  const response = await submitLogin(fx, proof);
  assert.equal(response.status, 303, response.text);
  assert.equal(response.headers.location, BASE + '/record');
  const sessionCookie = cookie(response, '__Secure-gluc_session');
  assert.match(sessionCookie, /^__Secure-gluc_session=[A-Za-z0-9_-]{43}$/);
  const session = await fx.request(BASE + '/api/session', { headers: { Cookie: sessionCookie } });
  assert.equal(session.status, 200);
  const data = JSON.parse(session.text);
  assert.equal(data.authenticated, true);
  assert.match(data.csrf, /^[A-Za-z0-9_-]{43}$/);
  return { cookie: sessionCookie, csrf: data.csrf, response, proof };
}

export function assertPrivateHeaders(response, { pdf = false } = {}) {
  assert.match(response.headers['cache-control'] || '', /no-store/);
  assert.match(response.headers['x-robots-tag'] || '', /noindex/);
  assert.equal(response.headers['referrer-policy'], 'no-referrer');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['cross-origin-resource-policy'], 'same-origin');
  assert.equal(response.headers['x-frame-options'], pdf ? 'SAMEORIGIN' : 'DENY');
  assert.match(response.headers['content-security-policy'] || '', /default-src 'none'/);
  assert.match(response.headers['content-security-policy'] || '', /object-src 'none'/);
  assert.equal(response.headers['access-control-allow-origin'], undefined);
}
