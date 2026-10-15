#!/usr/bin/env node
import { readFile, writeFile, mkdir, lstat, readdir } from 'node:fs/promises';
import { resolve, join, relative, isAbsolute, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { loadContent } from '../src/content.mjs';

const BASE = '/uc_factual_record';
const sha = value => createHash('sha256').update(value).digest('hex');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const jsonHTML = value => JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const assert = (condition, message) => { if (!condition) throw new Error(`Import rejected: ${message}`); };

function markdown(raw) {
  // Raw HTML and links are never interpreted. Only simple emphasis and paragraphs.
  const inline = text => escapeHTML(text).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
  return raw.split(/\r?\n\s*\r?\n/).map(block => `<p>${inline(block).replace(/\r?\n/g,'<br>')}</p>`).join('\n');
}

/** Preserve original document bytes; adapt only the containing presentation. */
export async function importBundle({input, output, assets, statement}) {
  assert(input && output && assets, '--input, --output and --assets are required');
  input = resolve(input); output = resolve(output); assets = resolve(assets);
  const isWithin = (parent, child) => { const rel=relative(parent,child); return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel)); };
  assert(!isWithin(output,assets) && !isWithin(assets,output), 'public assets and private content must be separate directories');
  const inputStat = await lstat(input);
  assert(inputStat.isFile() && !inputStat.isSymbolicLink() && inputStat.size < 128*1024*1024, 'input must be a regular HTML file below 128 MiB');
  const original = await readFile(input);
  let html = original.toString('utf8');
  assert(!html.includes('\ufffd'), 'input must be valid UTF-8');
  const dataMatches = [...html.matchAll(/<script\b[^>]*\bid=["']record-data["'][^>]*>([\s\S]*?)<\/script\s*>/gi)];
  assert(dataMatches.length === 1, 'exactly one record-data JSON carrier is required');
  const sourceData = JSON.parse(dataMatches[0][1]);
  assert(sourceData && typeof sourceData.documents === 'object' && !Array.isArray(sourceData.documents), 'documents object required');
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)];
  assert(styles.length > 0, 'stylesheet required');
  await mkdir(output,{recursive:true,mode:0o700});
  assert(!(await lstat(output)).isSymbolicLink() && (await readdir(output)).length === 0, 'output must be an empty non-symlink directory');
  await mkdir(join(output,'documents'),{mode:0o700});
  await mkdir(assets,{recursive:true});
  assert(!(await lstat(assets)).isSymbolicLink(), 'assets directory cannot be a symlink');
  const manifest = {version:1,index:{},documents:{},sources:{inputSha256:sha(original),inputBytes:original.length,inputFilename:basename(input),statementSha256:null,transformation:'External CSS and generic authenticated endpoint JavaScript; original document bytes preserved; optional exact edited statement added separately'}};
  const reduced = {...sourceData,documents:{}};
  let total = original.length;
  for (const [id, doc] of Object.entries(sourceData.documents)) {
    assert(/^[A-Z][A-Z0-9]{1,15}$/.test(id) && doc?.id === id, 'unsafe document ID');
    assert(typeof doc.data === 'string' && doc.data.length % 4 === 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(doc.data), 'invalid base64 carrier');
    const bytes = Buffer.from(doc.data,'base64');
    assert(sha(bytes) === doc.sha256 && bytes.length === doc.bytes, `source byte identity mismatch for ${id}`);
    assert(Array.isArray(doc.textPages) && doc.textPages.length === doc.pages && doc.textPages.every(x=>typeof x==='string'), `invalid text pages for ${id}`);
    const ext = doc.kind === 'pdf' ? 'pdf' : doc.kind === 'text' ? 'txt' : null;
    assert(ext, 'only PDF and text documents are admitted');
    const file = `documents/${id}.${ext}`, textFile = `documents/${id}.text.json`;
    const text = Buffer.from(JSON.stringify(doc.textPages),'utf8');
    total += bytes.length + text.length;
    assert(total <= 128*1024*1024, 'content budget exceeded');
    await writeFile(join(output,file),bytes,{mode:0o600,flag:'wx'});
    await writeFile(join(output,textFile),text,{mode:0o600,flag:'wx'});
    const {data,textPages,...metadata} = doc;
    reduced.documents[id] = metadata;
    manifest.documents[id] = {...metadata,bytes:bytes.length,sha256:sha(bytes),file,textFile,textSha256:sha(text)};
  }
  let css = styles.map(m=>m[1]).join('\n');
  css += '\n.portal-access-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 30px;background:#e5edf2;border-bottom:1px solid #b9cdd9;font-size:.85rem}.portal-access-bar form{margin:0}.portal-access-bar button{border:1px solid #075b83;border-radius:5px;padding:6px 12px;background:white;color:#075b83;cursor:pointer}.latest-statement .statement-raw{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}.download-card .section-kicker{color:#c8d9e4}@media print{.portal-access-bar{display:none}}\n';
  html = html.replace(dataMatches[0][0],()=>'<script id="record-data" type="application/json">'+jsonHTML(reduced)+'</script>');
  html = html.replace(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,'');
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,'');
  html = html.replace(/\sstyle=["']color:#c8d9e4["']/g,'');
  html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi,(tag,attributes)=>/\bid=["']record-data["']/i.test(attributes)?tag:'');
  html = html.replace(/<\/head\s*>/i,`<link rel="stylesheet" href="${BASE}/assets/case.css"><meta name="robots" content="noindex,nofollow,noarchive,nosnippet"></head>`);
  const logout = `<div class="portal-access-bar"><span>Private factual record · authorised access</span><form method="post" action="${BASE}/logout"><input type="hidden" name="csrf" value="%%LOGOUT_CSRF%%"><button type="submit">Sign out</button></form></div>`;
  html = html.replace(/<body\b[^>]*>/i,match=>match+logout);
  if (statement) {
    const rawBytes = await readFile(resolve(statement));
    const raw = rawBytes.toString('utf8');
    assert(!raw.includes('\ufffd') && raw.length > 0 && rawBytes.length < 1024*1024, 'statement must be nonempty UTF-8 text below 1 MiB');
    manifest.sources.statementSha256 = sha(rawBytes);
    reduced.latestStatement = raw;
    const section = `<section class="section latest-statement" id="latest-statement" aria-labelledby="latest-statement-title"><p class="section-kicker">Claimant-edited wording · 15 October 2026</p><h2 id="latest-statement-title">Latest claimant statement</h2><p class="minor">This claimant-edited statement is reproduced separately from the front-cover journal and historical source documents. Its wording is preserved below; formatting is adapted for reading.</p><article class="card">${markdown(raw)}</article><details><summary>Exact original Markdown wording</summary><pre class="statement-raw">${escapeHTML(raw)}</pre></details></section>`;
    assert(html.includes('<section class="section" id="issues">'), 'expected issue-section insertion point missing');
    html = html.replace('<section class="section" id="issues">',()=>section+'\n<section class="section" id="issues">');
    html = html.replace('<a href="#cover">Front cover</a>','<a href="#cover">Front cover</a><a href="#latest-statement">Latest claimant statement</a>');
    html = html.replace(/<script\b[^>]*\bid=["']record-data["'][^>]*>[\s\S]*?<\/script\s*>/i,()=>'<script id="record-data" type="application/json">'+jsonHTML(reduced)+'</script>');
  }
  html = html.replace(/<\/body\s*>/i,`<script src="${BASE}/assets/case.js" defer></script></body>`);
  assert(!/<script\b(?![^>]*\b(?:id=["']record-data["']|src=))[^>]*>/i.test(html), 'inline executable script remained');
  const index = Buffer.from(html,'utf8');
  manifest.index = {file:'index.html',sha256:sha(index),bytes:index.length};
  await writeFile(join(output,'index.html'),index,{mode:0o600,flag:'wx'});
  await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{mode:0o600,flag:'wx'});
  await writeFile(join(assets,'case.css'),css,{mode:0o644});
  await loadContent(output);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length === 3 && ['--help','-h'].includes(process.argv[2])) {
    process.stdout.write('Import reviewed private record content:\n  node scripts/import-bundle.mjs --input ABSOLUTE_SOURCE_HTML --output NEW_EMPTY_PRIVATE_DIRECTORY --assets SERVICE_PUBLIC_DIRECTORY [--statement EXACT_EDITED_MARKDOWN]\nNever select a Git/public directory as the private output. Original documents are preserved; reviewed presentation is adapted.\n');
    process.exit(0);
  }
  const options = {};
  try {
    for (let i=2;i<process.argv.length;i+=2) {
      const key=process.argv[i];
      assert(['--input','--output','--assets','--statement'].includes(key) && process.argv[i+1] && !Object.hasOwn(options,key.slice(2)), 'invalid or duplicate arguments');
      options[key.slice(2)]=process.argv[i+1];
    }
    const manifest = await importBundle(options);
    process.stdout.write(JSON.stringify({status:'PRIVATE_CONTENT_IMPORTED',documents:Object.keys(manifest.documents).length,indexSha256:manifest.index.sha256,inputSha256:manifest.sources.inputSha256})+'\n');
  } catch (error) { process.stderr.write(error.message+'\n'); process.exitCode=1; }
}
