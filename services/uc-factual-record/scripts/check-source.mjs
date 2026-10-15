import { readdir, readFile, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const files=[];
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){if(['.git','node_modules'].includes(entry.name))continue;const p=resolve(path,entry.name);const stat=await lstat(p);if(stat.isSymbolicLink())throw new Error('Symlink in code tree');if(stat.isDirectory())await walk(p);else files.push(p);}}
await walk(root);
const problems=[];
const forbidden=['drive.'+'proton.me/urls/','BEGIN '+'OPENSSH PRIVATE KEY','BEGIN '+'RSA PRIVATE KEY'];
for(const file of files){
  const name=relative(root,file).replaceAll('\\','/');
  const extension=extname(file).toLowerCase();
  const permittedNames=['Dockerfile','LICENSE','.gitignore','.dockerignore','.env.example'];
  const permittedExtensions=['.mjs','.js','.json','.md','.yaml','.yml','.ps1','.sh','.css'];
  if(!permittedNames.includes(name)&&!permittedExtensions.includes(extension)&&!/^ingress\/[a-z0-9.-]+\.in$/.test(name))problems.push(name+': file type outside the reviewed source allowlist');
  if(/(^|\/)(private-runtime|content|secrets|runtime)(\/|$)/.test(name)||/\.(pdf|zip|sqlite|db|pem|key)$/.test(name)||/(^|\/)users\.json$/.test(name)||name==='.env')problems.push(name+': private runtime material in code tree');
  const bytes=await readFile(file);if(bytes.length>1024*1024)problems.push(name+': unexpectedly large code asset');
  if(bytes.subarray(0,5).equals(Buffer.from('%PDF-')))problems.push(name+': embedded PDF bytes');
  const text=bytes.toString('utf8');for(const value of forbidden)if(text.includes(value))problems.push(name+': private capability or secret marker');
  if(/"data"\s*:\s*"JVBERi0/.test(text))problems.push(name+': embedded document payload');
  if(['.mjs','.js'].includes(extname(file))){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)problems.push(name+': syntax check failed');}
}
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
if(Object.keys(pkg.dependencies||{}).length||Object.keys(pkg.devDependencies||{}).length)problems.push('Unexpected npm dependency; update inventory and assurance');
const policy=JSON.parse(await readFile(resolve(root,'policy/ai-boundary.json'),'utf8'));
if(policy.mode!=='closed'||['allowModels','allowTools','allowUploads','allowOutboundRequests'].some(k=>policy[k]!==false))problems.push('Open AI capability policy');
const app=await readFile(resolve(root,'src/server.mjs'),'utf8');
if(/\beval\s*\(|new\s+Function\s*\(|\bfetch\s*\(|http[s]?\.request\s*\(|from\s+['"]node:(?:child_process|vm)['"]/.test(app))problems.push('Runtime dynamic execution or outbound request requires review');
const result={status:problems.length?'FAIL':'PASS_BOUNDED',filesChecked:files.length,npmDependencies:0,checks:['code syntax','private-data markers','large/binary payloads','closed capability policy','runtime outbound/dynamic execution patterns'],problems};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
if(problems.length)process.exitCode=1;
