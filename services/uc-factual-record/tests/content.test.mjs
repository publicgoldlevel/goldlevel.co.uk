import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, symlink, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { importBundle } from '../scripts/import-bundle.mjs';
import { loadContent } from '../src/content.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const parseData = html => JSON.parse(html.match(/<script id="record-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);

async function fixture(t, {statement = true} = {}) {
  const root = await mkdtemp(join(process.cwd(),'uc-content-test-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const payload=Buffer.from('%PDF-1.7\nopaque original PDF bytes\x00\xff\n%%EOF','latin1');
  const text='Original explanatory text with £ and €; literal $& and <script>.';
  const docs={D01:{id:'D01',filename:'Original evidence.pdf',title:'Evidence',kind:'pdf',mime:'application/pdf',pages:1,bytes:payload.length,sha256:sha(payload),data:payload.toString('base64'),textPages:[text]}};
  const data={coverText:'Exact front cover. $& preserved.',fullText:'Full submission\nOriginal dates.',documents:docs,references:{}};
  const input=join(root,'input.html'),output=join(root,'private'),assets=join(root,'assets'),statementPath=join(root,'statement.md');
  const original='<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="old"><style>.original{color:red}</style></head><body><nav><a href="#cover">Front cover</a></nav><main><section id="cover">Original cover.</section><section class="section" id="issues">Original issues.</section></main><script id="record-data" type="application/json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script><script>throw new Error("old executable must be removed")</script></body></html>';
  const rawStatement='**Claimant-edited** wording.\n\nLiteral $& and $` and $\' preserved.\n<script>alert("not executable")</script>\n';
  await writeFile(input,original);
  await writeFile(statementPath,rawStatement);
  const manifest=await importBundle({input,output,assets,...(statement?{statement:statementPath}:{})});
  return {root,input,output,assets,payload,text,data,original,rawStatement,manifest};
}

test('source bytes roundtrip, reduced metadata and exact edited wording survive importing',async t=>{
  const f=await fixture(t), loaded=await loadContent(f.output);
  assert.deepEqual(loaded.documents.get('D01').bytes,f.payload);
  assert.deepEqual(await readFile(join(f.output,'documents/D01.pdf')),f.payload);
  assert.deepEqual(loaded.documents.get('D01').textPages,[f.text]);
  assert.equal(loaded.manifest.sources.inputSha256,sha(Buffer.from(f.original)));
  assert.equal(loaded.manifest.sources.statementSha256,sha(Buffer.from(f.rawStatement)));
  const reduced=parseData(loaded.html);
  assert.equal(reduced.coverText,f.data.coverText);
  assert.equal(reduced.fullText,f.data.fullText);
  assert.equal(reduced.latestStatement,f.rawStatement);
  assert.equal(reduced.documents.D01.data,undefined);
  assert.equal(reduced.documents.D01.textPages,undefined);
  assert.ok(loaded.html.includes('Original issues.'));
  assert.ok(loaded.html.includes('%%LOGOUT_CSRF%%'));
  assert.ok(loaded.html.includes('/uc_factual_record/logout'));
  assert.ok(loaded.html.includes('/uc_factual_record/assets/case.js'));
  assert.ok(loaded.html.includes('&lt;script&gt;alert('));
  assert.ok(!loaded.html.includes('old executable must be removed'));
  assert.ok(!loaded.html.includes('http-equiv="Content-Security-Policy"'));
  assert.ok(!loaded.html.includes('<style>'));
  assert.ok((await readFile(join(f.assets,'case.css'),'utf8')).includes('.original{color:red}'));
});

test('document, text and index tampering fail closed',async t=>{
  const f=await fixture(t,{statement:false});
  const docPath=join(f.output,'documents/D01.pdf');
  await writeFile(docPath,Buffer.from('%PDF-tampered'));
  await assert.rejects(loadContent(f.output),/hash or length mismatch/);
  await writeFile(docPath,f.payload);
  const textPath=join(f.output,'documents/D01.text.json'),text=await readFile(textPath);
  await writeFile(textPath,'["tampered"]');
  await assert.rejects(loadContent(f.output),/text hash mismatch/);
  await writeFile(textPath,text);
  await writeFile(join(f.output,'index.html'),'Changed index');
  await assert.rejects(loadContent(f.output),/index hash or length mismatch/);
});

test('manifest path traversal cannot select an outside file',async t=>{
  const f=await fixture(t);
  const manifest=structuredClone(f.manifest);
  manifest.documents.D01.file='../input.html';
  await writeFile(join(f.output,'manifest.json'),JSON.stringify(manifest));
  await assert.rejects(loadContent(f.output),/allowlisted document path/);
});

test('symlink document and undeclared private files are rejected',async t=>{
  const f=await fixture(t), docPath=join(f.output,'documents/D01.pdf');
  const outside=join(f.root,'outside.pdf');
  await writeFile(outside,f.payload);
  await unlink(docPath); await symlink(outside,docPath);
  await assert.rejects(loadContent(f.output),/symlink/);
  await unlink(docPath); await writeFile(docPath,f.payload);
  await writeFile(join(f.output,'unexpected.txt'),'not declared');
  await assert.rejects(loadContent(f.output),/unexpected content file/);
});

test('import rejects source byte mismatch and an occupied destination',async t=>{
  const f=await fixture(t);
  await assert.rejects(importBundle({input:f.input,output:f.output,assets:f.assets}),/empty non-symlink/);
  const bad=f.original.replace(f.payload.toString('base64'),Buffer.from('changed').toString('base64'));
  await writeFile(f.input,bad);
  await assert.rejects(importBundle({input:f.input,output:join(f.root,'other-private'),assets:f.assets}),/source byte identity mismatch/);
});
