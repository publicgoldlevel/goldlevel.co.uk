import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { derivePassword, verifyPassword, validateUsers, SessionStore, Limiter } from './auth.mjs';
import { loadContent } from './content.mjs';

const SESSION = '__Secure-gluc_session';
const PREAUTH = '__Secure-gluc_preauth';
const digest = value => createHash('sha256').update(value).digest('hex');
const escapeHtml = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const equal = (a, b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));

function cookieValue(req, name) {
  const found = String(req.headers.cookie || '').split(';').map(s => s.trim()).filter(s => s.startsWith(name + '='));
  if (found.length !== 1) return '';
  const value = found[0].slice(name.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : '';
}

function duplicateBoundaryHeaders(req) {
  const seen = new Set();
  for (let i = 0; i < req.rawHeaders.length; i += 2) {
    const name = req.rawHeaders[i].toLowerCase();
    if (!['host', 'origin', 'cookie', 'content-type', 'x-portal-edge-key', 'x-portal-client-ip', 'x-forwarded-proto'].includes(name)) continue;
    if (seen.has(name)) return true;
    seen.add(name);
  }
  return false;
}

async function readForm(req) {
  if (!/^application\/x-www-form-urlencoded(?:;\s*charset=utf-8)?$/i.test(req.headers['content-type']||'')) throw Object.assign(new Error('form type'), {status:415});
  if (Number(req.headers['content-length'] || 0) > 4096) throw Object.assign(new Error('form size'), {status:413});
  let count = 0; const chunks = [];
  for await (const chunk of req) {
    count += chunk.length;
    if (count > 4096) throw Object.assign(new Error('form size'), {status:413});
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (/%(?![0-9a-f]{2})/i.test(text) || text.includes('\ufffd')) throw Object.assign(new Error('form encoding'), {status:400});
  const form = new URLSearchParams(text);
  for (const key of new Set(form.keys())) if (form.getAll(key).length !== 1) throw Object.assign(new Error('duplicate field'), {status:400});
  return form;
}

export async function createPortal(config) {
  const origin = new URL(config.publicOrigin);
  if (origin.protocol !== 'https:' || origin.origin !== config.publicOrigin || origin.username || origin.password) throw new Error('PUBLIC_ORIGIN must be an HTTPS origin without a trailing slash');
  const base = config.basePath || '/uc_factual_record';
  if (base !== '/uc_factual_record') throw new Error('This reviewed build requires BASE_PATH=/uc_factual_record');
  if (typeof config.edgeKey !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(config.edgeKey)) throw new Error('A strong EDGE_KEY_FILE is required');
  const policy = JSON.parse(await readFile(new URL('../policy/ai-boundary.json', import.meta.url), 'utf8'));
  const expectedRoutes=['/_health','/','/login','/logout','/record','/documents/:id','/api/documents/:id/text','/assets/login.css','/assets/case.css','/assets/case.js','/api/session'];
  if (policy.version !== 1 || policy.mode !== 'closed' || ['allowModels','allowTools','allowUploads','allowOutboundRequests'].some(k => policy[k] !== false) || !Array.isArray(policy.allowedRoutes) || JSON.stringify([...policy.allowedRoutes].sort()) !== JSON.stringify(expectedRoutes.sort())) throw new Error('Closed capability policy and reviewed route set required');
  const content = await loadContent(config.contentDir);
  if (!content.html.includes('%%LOGOUT_CSRF%%')) throw new Error('Private content must include the logout CSRF placeholder');
  const now = config.now || Date.now;
  const users = validateUsers(JSON.parse(await readFile(config.usersFile, 'utf8')));
  const accounts = new Map(users.map(user => [user.username, user]));
  if (![...accounts.values()].some(u => u.enabled && Date.parse(u.expiresAt) > now())) throw new Error('At least one enabled, unexpired account is required');
  const dummy = await derivePassword(randomBytes(32).toString('base64url'));
  const sessions = new SessionStore({now, idleMs: config.sessionIdleMs || 1800000, absoluteMs: config.sessionAbsoluteMs || 28800000});
  const rate = new Limiter({now, windowMs: config.limits?.windowMs || 900000, maxKeys:4096});
  const preauth = new Map();
  // Domain separation gives stable private pseudonyms until the ingress key rotates.
  const auditKey = createHash('sha256').update('goldlevel-portal-audit-v1\0').update(config.edgeKey).digest();
  const log = config.audit || (record => process.stdout.write(JSON.stringify(record) + '\n'));
  function audit(event, subject = '', details = {}) {
    const safe={};
    if (/^[A-Z][A-Z0-9]{1,15}$/.test(details.documentId||'')) safe.documentId=details.documentId;
    if (/^[a-f0-9]{64}$/.test(details.sha256||'')) safe.sha256=details.sha256;
    if (['GET','HEAD'].includes(details.method)) safe.method=details.method;
    if ([200,206].includes(details.status)) safe.status=details.status;
    if (Number.isSafeInteger(details.bytes) && details.bytes>=0) safe.bytes=details.bytes;
    try { log({at:new Date(now()).toISOString(), event, ...(subject ? {subject:createHmac('sha256', auditKey).update(subject).digest('hex').slice(0,20)} : {}),...safe}); } catch { /* An audit sink never exposes request data. */ }
  }
  const assets = new Map();
  for (const [file,type] of [['case.js','text/javascript; charset=utf-8'],['case.css','text/css; charset=utf-8'],['login.css','text/css; charset=utf-8']]) assets.set(file,{body:await readFile(new URL('../public/'+file, import.meta.url)),type});
  let hashing = 0;
  const cookie = (name, value, maxAge) => `${name}=${value}; Path=${base}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
  const clearCookie = name => cookie(name, '', 0);
  const csp = pdf => `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors ${pdf ? "'self'" : "'none'"}; upgrade-insecure-requests`;
  function headers(res, pdf = false) {
    res.setHeader('Cache-Control','no-store, private, max-age=0');
    res.setHeader('Pragma','no-cache');
    res.setHeader('Expires','0');
    res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive, nosnippet, noimageindex');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',csp(pdf));
    res.setHeader('X-Frame-Options',pdf ? 'SAMEORIGIN' : 'DENY');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    res.setHeader('Cross-Origin-Resource-Policy','same-origin');
    res.setHeader('Vary','Cookie');
  }
  function send(req,res,status,body='',type='text/plain; charset=utf-8',extra={}) {
    const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
    res.writeHead(status,{'Content-Type':type,'Content-Length':bytes.length,...extra});
    res.end(req.method === 'HEAD' ? undefined : bytes);
  }
  function redirect(req,res,path,extra={}) { send(req,res,303,'','text/plain; charset=utf-8',{'Location':base+path,...extra}); }
  const page = (message, token) => `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Private access | Goldlevel</title><link rel="stylesheet" href="${base}/assets/login.css"></head><body><main><p class="eyebrow">GOLDLEVEL · PRIVATE ACCESS</p><h1>Sign in to the factual record</h1><p>For authorised recipients. Use the individual credentials supplied by TJ.</p>${message ? `<p class="error" role="alert">${escapeHtml(message)}</p>` : ''}<form method="post" action="${base}/login"><input type="hidden" name="csrf" value="${token}"><label for="username">Username</label><input id="username" name="username" required autocomplete="username" maxlength="64" autocapitalize="none" spellcheck="false"><label for="password">Password</label><input id="password" type="password" name="password" required autocomplete="current-password" maxlength="256"><button type="submit">Sign in</button></form><p class="note">If sign-in is unavailable, request access assistance through your existing correspondence with TJ. This is a claimant-provided reference route; official submission and receipt must be confirmed separately.</p></main></body></html>`;
  function loginPage(req,res,message='',status=200) {
    for (const [key,value] of preauth) if (value.expires <= now()) preauth.delete(key);
    if (preauth.size >= 1024) return send(req,res,503,'Please try again later.');
    const token=randomBytes(32).toString('base64url'), csrf=randomBytes(32).toString('base64url');
    preauth.set(digest(token),{csrf,expires:now()+600000});
    send(req,res,status,page(message,csrf),'text/html; charset=utf-8',{'Set-Cookie':cookie(PREAUTH,token,600)});
  }
  const server = http.createServer({maxHeaderSize:8192,requestTimeout:15000,headersTimeout:10000,keepAliveTimeout:5000},async(req,res)=>{
    headers(res);
    try {
      const raw = req.url || '';
      if (!raw.startsWith('/') || raw.length > 240 || /[%?\\\x00-\x20\x7f]/.test(raw) || raw.includes('//') || raw.split('/').some(s => s === '.' || s === '..')) return send(req,res,400,'Invalid request.');
      if (duplicateBoundaryHeaders(req)) return send(req,res,400,'Invalid request.');
      if (raw === '/_health' && ['GET','HEAD'].includes(req.method)) return send(req,res,204);
      if (!equal(req.headers['x-portal-edge-key'],config.edgeKey) || req.headers['x-forwarded-proto'] !== 'https' || req.headers.host?.toLowerCase() !== origin.host.toLowerCase()) return send(req,res,421,'Trusted HTTPS ingress required.');
      if (!['GET','HEAD','POST'].includes(req.method)) return send(req,res,405,'Method not allowed.','text/plain; charset=utf-8',{'Allow':'GET, HEAD, POST'});
      const path = raw.startsWith(base+'/') ? raw.slice(base.length) : raw === base ? '' : null;
      if (path === null) return send(req,res,404,'Not found.');
      const clientIP = req.headers['x-portal-client-ip'];
      if (clientIP && !isIP(clientIP)) return send(req,res,400,'Invalid request.');
      const ip=clientIP || req.socket.remoteAddress || 'unknown';
      const peer=digest(ip);
      if (!rate.take('request:'+peer,600)) return send(req,res,429,'Too many requests.','text/plain; charset=utf-8',{'Retry-After':'900'});
      const token=cookieValue(req,SESSION);
      let session=token ? sessions.get(token) : null;
      const account=session ? accounts.get(session.username) : null;
      if (session && (!account?.enabled || Date.parse(account.expiresAt) <= now())) { sessions.delete(token); session=null; }
      if ((path === '' || path === '/') && ['GET','HEAD'].includes(req.method)) return redirect(req,res,session ? '/record' : '/login');
      if (path === '/assets/login.css' && ['GET','HEAD'].includes(req.method)) { const asset=assets.get('login.css'); return send(req,res,200,asset.body,asset.type); }
      if (path === '/login' && ['GET','HEAD'].includes(req.method)) {
        if (session) return redirect(req,res,'/record');
        if (req.method === 'HEAD') return send(req,res,200);
        return loginPage(req,res);
      }
      if (path === '/login' && req.method === 'POST') {
        if (req.headers.origin !== origin.origin || ['cross-site'].includes(req.headers['sec-fetch-site'])) return send(req,res,403,'Request could not be accepted.');
        const form=await readForm(req);
        if ([...form.keys()].some(k=>!['csrf','username','password'].includes(k))) return send(req,res,400,'Invalid request.');
        const pre=cookieValue(req,PREAUTH), proof=preauth.get(digest(pre));
        preauth.delete(digest(pre));
        if (!proof || proof.expires <= now() || !equal(form.get('csrf'),proof.csrf)) return send(req,res,403,'Request could not be accepted. Please reload sign-in.');
        const username=(form.get('username')||'').toLowerCase(), password=form.get('password')||'';
        const nameKey=digest(username);
        const allowed=[rate.take('ip:'+peer,config.limits?.ip||20),rate.take('account:'+nameKey,config.limits?.account||10),rate.take('global',config.limits?.global||100)].every(Boolean);
        if (!allowed) {audit('LOGIN_THROTTLED',username);return send(req,res,429,'Too many sign-in attempts. Please try later.','text/plain; charset=utf-8',{'Retry-After':String(Math.ceil((config.limits?.windowMs||900000)/1000))});}
        if (hashing >= 2) return send(req,res,503,'Please try again shortly.','text/plain; charset=utf-8',{'Retry-After':'2'});
        if (Buffer.byteLength(password) > 256 || !/^[a-z0-9][a-z0-9._-]{2,63}$/.test(username)) return loginPage(req,res,'Sign-in failed. Check your credentials or request access assistance.',401);
        const user=accounts.get(username);
        hashing++;
        let valid=false;
        try {valid=await verifyPassword(password,user?.password||dummy);} finally {hashing--;}
        if (!valid || !user?.enabled || Date.parse(user.expiresAt) <= now()) {audit('LOGIN_FAILED',username);return loginPage(req,res,'Sign-in failed. Check your credentials or request access assistance.',401);}
        if (token) sessions.delete(token);
        const fresh=sessions.create(username);
        audit('LOGIN_SUCCEEDED',username);
        return redirect(req,res,'/record',{'Set-Cookie':[cookie(SESSION,fresh.token,28800),clearCookie(PREAUTH)]});
      }
      const isDocument=/^\/documents\/[A-Z][A-Z0-9]{1,15}$/.test(path);
      const isText=/^\/api\/documents\/[A-Z][A-Z0-9]{1,15}\/text$/.test(path);
      const known=['/record','/logout','/api/session','/assets/case.js','/assets/case.css'].includes(path)||isDocument||isText;
      if (!known) return send(req,res,404,'Not found.');
      if (!session) {
        if (path === '/record' && ['GET','HEAD'].includes(req.method)) return redirect(req,res,'/login',{'Set-Cookie':clearCookie(SESSION)});
        return send(req,res,401,'Sign in to continue.','text/plain; charset=utf-8',{'Set-Cookie':clearCookie(SESSION)});
      }
      if (path === '/logout' && req.method === 'POST') {
        if (req.headers.origin !== origin.origin || req.headers['sec-fetch-site'] === 'cross-site') return send(req,res,403,'Request could not be accepted.');
        const form=await readForm(req);
        if ([...form.keys()].some(k=>k!=='csrf') || !equal(form.get('csrf'),session.csrf)) return send(req,res,403,'Request could not be accepted.');
        sessions.delete(token);audit('LOGOUT',session.username);
        return redirect(req,res,'/login',{'Set-Cookie':clearCookie(SESSION)});
      }
      if (!['GET','HEAD'].includes(req.method) || path === '/logout') return send(req,res,405,'Method not allowed.','text/plain; charset=utf-8',{'Allow':path==='/logout'?'POST':'GET, HEAD'});
      if (path === '/record') {audit('RECORD_REQUESTED',session.username);return send(req,res,200,content.html.replaceAll('%%LOGOUT_CSRF%%',session.csrf),'text/html; charset=utf-8');}
      if (path === '/api/session') return send(req,res,200,JSON.stringify({authenticated:true,csrf:session.csrf}),'application/json; charset=utf-8');
      if (path.startsWith('/assets/')) {const asset=assets.get(path.slice(8));return send(req,res,200,asset.body,asset.type);}
      const id=path.split('/')[isText?3:2], doc=content.documents.get(id);
      if (!doc) return send(req,res,404,'Not found.');
      if (isText) return send(req,res,200,JSON.stringify({pages:doc.textPages}),'application/json; charset=utf-8');
      // Serve original bytes only after authentication. Conditional requests never bypass it.
      headers(res,doc.mime==='application/pdf');
      let bytes=doc.bytes, status=200;
      const extra={'Accept-Ranges':'bytes','Content-Disposition':`inline; filename="${doc.filename.replace(/[^a-zA-Z0-9._()-]/g,'_')}"`,'Repr-Digest':`sha-256=:${Buffer.from(doc.sha256,'hex').toString('base64')}:`};
      if (req.headers.range) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        let start,end;
        if (!match || (!match[1]&&!match[2])) return send(req,res,416,'','text/plain; charset=utf-8',{'Content-Range':`bytes */${bytes.length}`});
        if (!match[1]) {const suffix=Number(match[2]);start=Math.max(0,bytes.length-suffix);end=bytes.length-1;if(suffix<=0)start=bytes.length;}
        else {start=Number(match[1]);end=match[2]?Number(match[2]):bytes.length-1;}
        if (!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=bytes.length||start>end) return send(req,res,416,'','text/plain; charset=utf-8',{'Content-Range':`bytes */${bytes.length}`});
        end=Math.min(end,bytes.length-1);extra['Content-Range']=`bytes ${start}-${end}/${bytes.length}`;bytes=bytes.subarray(start,end+1);status=206;
      }
      extra['Content-Digest']=`sha-256=:${createHash('sha256').update(bytes).digest('base64')}:`;
      res.once('finish',()=>audit('DOCUMENT_RESPONSE_SENT',session.username,{documentId:id,sha256:doc.sha256,method:req.method,status,bytes:req.method==='HEAD'?0:bytes.length}));
      return send(req,res,status,bytes,doc.mime,extra);
    } catch(error) {
      audit('REQUEST_REJECTED');
      if (!res.headersSent) send(req,res,[400,413,415].includes(error.status)?error.status:500,'The request could not be completed.');
      else res.destroy();
    }
  });
  server.maxHeadersCount=40;server.maxRequestsPerSocket=100;server.maxConnections=128;
  server.on('clientError',(_err,socket)=>{if(socket.writable)socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');});
  server.on('upgrade',(_req,socket)=>socket.destroy());
  server.on('connect',(_req,socket)=>socket.destroy());
  server.on('close',()=>{sessions.clear();preauth.clear();});
  return {server,sessions,close:()=>new Promise((resolveClose,reject)=>server.close(err=>err?reject(err):resolveClose()))};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Node.js 24 LTS is required');
    const edgeKey=(await readFile(process.env.EDGE_KEY_FILE||'/run/secrets/edge-key','utf8')).trim();
    const app=await createPortal({publicOrigin:process.env.PUBLIC_ORIGIN,basePath:process.env.BASE_PATH,contentDir:process.env.CONTENT_DIR||'/content',usersFile:process.env.USERS_FILE||'/run/secrets/users.json',edgeKey});
    const port=Number(process.env.PORT||8080), host=process.env.HOST||'127.0.0.1';
    if (!Number.isInteger(port)||port<1024||port>65535) throw new Error('Invalid PORT');
    app.server.listen(port,host,()=>process.stdout.write(JSON.stringify({event:'PORTAL_STARTED',at:new Date().toISOString()})+'\n'));
    for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{app.server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),5000).unref();});
  } catch {process.stderr.write('Portal startup failed: check configuration, account expiry and content integrity.\n');process.exitCode=1;}
}
