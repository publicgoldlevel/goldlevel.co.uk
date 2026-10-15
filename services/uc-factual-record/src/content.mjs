import { lstat, realpath, open, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const MAX_CONTENT = 128 * 1024 * 1024;
const hash = value => createHash('sha256').update(value).digest('hex');
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const sha = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const safeID = value => typeof value === 'string' && /^[A-Z][A-Z0-9]{1,15}$/.test(value);
const check = (condition, message) => { if (!condition) throw new Error(`Content integrity: ${message}`); };

/** Load only integrity-bound, allowlisted private payloads. Never serves a client path. */
export async function loadContent(directory) {
  const root = resolve(directory);
  check(!(await lstat(root)).isSymbolicLink(), 'root symlink is not allowed');
  check((await lstat(root)).isDirectory(), 'content root is not a directory');
  const canonicalRoot = await realpath(root);
  let total = 0;
  const allowed = new Set(['manifest.json']);
  async function readPrivate(name, limit = MAX_CONTENT) {
    check(typeof name === 'string' && /^[A-Za-z0-9_./-]+$/.test(name) && !name.startsWith('/') && !name.includes('\\') && name.split('/').every(x => x && x !== '.' && x !== '..'), 'invalid payload path');
    const parts = name.split('/');
    let current = root;
    for (const part of parts) {
      current = join(current, part);
      check(!(await lstat(current)).isSymbolicLink(), 'payload symlink is not allowed');
    }
    const actual = await realpath(current);
    check(actual.startsWith(canonicalRoot + sep), 'payload escapes content root');
    const handle = await open(current, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
      const stat = await handle.stat();
      check(stat.isFile() && stat.size <= limit && total + stat.size <= MAX_CONTENT, 'file type or content size exceeds limit');
      const result = await handle.readFile();
      check(result.length === stat.size && total + result.length <= MAX_CONTENT, 'file changed or content size exceeds limit');
      total += result.length;
      return result;
    } finally { await handle.close(); }
  }
  const manifestBuffer = await readPrivate('manifest.json', 4 * 1024 * 1024);
  let manifest;
  try { manifest = JSON.parse(manifestBuffer.toString('utf8')); } catch { throw new Error('Content integrity: invalid manifest JSON'); }
  check(object(manifest) && manifest.version === 1 && object(manifest.index) && object(manifest.documents), 'invalid manifest format');
  check(manifest.index.file === 'index.html' && sha(manifest.index.sha256) && Number.isSafeInteger(manifest.index.bytes) && manifest.index.bytes > 0, 'invalid index declaration');
  allowed.add('index.html');
  const index = await readPrivate('index.html', 32 * 1024 * 1024);
  check(index.length === manifest.index.bytes && hash(index) === manifest.index.sha256, 'index hash or length mismatch');
  const html = index.toString('utf8');
  check(!html.includes('\ufffd') && html.includes('%%LOGOUT_CSRF%%'), 'index encoding or logout token missing');
  const documents = new Map();
  const entries = Object.entries(manifest.documents);
  check(entries.length > 0 && entries.length <= 1000, 'invalid document count');
  for (const [id, meta] of entries) {
    check(safeID(id) && object(meta), 'invalid document identity');
    const ext = meta.kind === 'pdf' ? 'pdf' : meta.kind === 'text' ? 'txt' : null;
    check(ext && meta.file === `documents/${id}.${ext}` && meta.textFile === `documents/${id}.text.json`, 'invalid allowlisted document path');
    check(typeof meta.filename === 'string' && meta.filename.length > 0 && meta.filename.length < 240 && !/[\\/\x00-\x1f\x7f]/.test(meta.filename), 'invalid download filename');
    check(typeof meta.title === 'string' && meta.title.length <= 1000, 'invalid title');
    check((ext === 'pdf' && meta.mime === 'application/pdf') || (ext === 'txt' && /^text\/plain(?:;\s*charset=utf-8)?$/i.test(meta.mime)), 'invalid media type');
    check(sha(meta.sha256) && sha(meta.textSha256) && Number.isSafeInteger(meta.bytes) && meta.bytes >= 0 && Number.isSafeInteger(meta.pages) && meta.pages > 0 && meta.pages <= 10000, 'invalid document integrity declaration');
    allowed.add(meta.file); allowed.add(meta.textFile);
    const bytes = await readPrivate(meta.file);
    check(bytes.length === meta.bytes && hash(bytes) === meta.sha256, `document ${id} hash or length mismatch`);
    if (ext === 'pdf') check(bytes.subarray(0,5).toString('ascii') === '%PDF-', `document ${id} PDF signature mismatch`);
    const text = await readPrivate(meta.textFile, 32 * 1024 * 1024);
    check(hash(text) === meta.textSha256, `document ${id} text hash mismatch`);
    let textPages;
    try { textPages = JSON.parse(text.toString('utf8')); } catch { throw new Error(`Content integrity: document ${id} invalid text JSON`); }
    check(Array.isArray(textPages) && textPages.length === meta.pages && textPages.every(x => typeof x === 'string'), `document ${id} text/page mismatch`);
    documents.set(id, {...meta, bytes, textPages});
  }
  // The private directory is exact: unexpected files cannot silently join a release.
  let observed = 0;
  async function walk(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
      check(++observed <= 3000, 'too many content entries');
      const full = join(dir,entry.name), name = relative(root,full).split(sep).join('/');
      check(!entry.isSymbolicLink(), 'unexpected symlink');
      if (entry.isDirectory()) { check(name === 'documents', 'unexpected directory'); await walk(full); }
      else check(entry.isFile() && allowed.has(name), 'unexpected content file');
    }
  }
  await walk(root);
  return {html, documents, manifest};
}
