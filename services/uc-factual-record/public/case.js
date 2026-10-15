
(()=>{'use strict';
const DATA=JSON.parse(document.getElementById('record-data').textContent);
document.body.classList.add('enhanced');
const byId=id=>document.getElementById(id);
const status=byId('action-status');
const textCache=new Map();
const BASE='/uc_factual_record';
let activeDoc=null,activePage=1,mode='pdf',returnFocus=null;
const reader=byId('reader');
function announce(message){status.textContent=message;}
function urlFor(id){if(!DATA.documents[id])throw new Error('Unknown document');return BASE+'/documents/'+encodeURIComponent(id);}
async function loadText(id){if(!textCache.has(id)){const response=await fetch(BASE+'/api/documents/'+encodeURIComponent(id)+'/text',{credentials:'same-origin',cache:'no-store',redirect:'error'});if(!response.ok)throw new Error('Sign in again to read the source.');const result=await response.json();textCache.set(id,result.pages);}return textCache.get(id);}
function pageNumber(requested,doc){return Math.min(doc.pages,Math.max(1,Number.parseInt(requested,10)||1));}
function renderReader(){const doc=DATA.documents[activeDoc];if(!doc)return;activePage=pageNumber(activePage,doc);if(doc.kind!=='pdf')mode='text';
 byId('reader-title').textContent=doc.title;byId('reader-file').textContent=doc.filename+' · '+doc.date;
 const frame=byId('reader-frame'),text=byId('reader-text');frame.hidden=mode==='text';text.hidden=mode!=='text';
 frame.src=mode==='pdf'?urlFor(activeDoc)+'#page='+activePage+'&view=FitH':'about:blank';
 const requestedDoc=activeDoc,requestedPage=activePage;byId('reader-transcript').textContent='Loading source text…';loadText(requestedDoc).then(pages=>{if(activeDoc===requestedDoc&&activePage===requestedPage)byId('reader-transcript').textContent=pages[requestedPage-1]||'No text layer on this page. Open the PDF to inspect its appearance.';}).catch(()=>{if(activeDoc===requestedDoc)byId('reader-transcript').textContent='Your session may have expired. Sign in again to continue.';});
 byId('reader-page').value=activePage;byId('reader-page').max=doc.pages;
 byId('reader-page-count').textContent='of '+doc.pages;
 byId('reader-prev').disabled=activePage<=1;byId('reader-next').disabled=activePage>=doc.pages;
 byId('reader-mode').textContent=mode==='pdf'?'Text view':'PDF view';byId('reader-mode').disabled=doc.kind!=='pdf';
 byId('reader-open').href=urlFor(activeDoc)+(doc.kind==='pdf'?'#page='+activePage:'');
 byId('reader-download').href=urlFor(activeDoc);byId('reader-download').download=doc.filename;
 byId('reader-page-status').textContent='Physical '+(doc.kind==='pdf'?'PDF ':'')+'page '+activePage+' / '+doc.pages;
}
function openDoc(id,page=1,textMode=false){if(!DATA.documents[id])return;returnFocus=document.activeElement;activeDoc=id;activePage=page;mode=textMode?'text':'pdf';renderReader();if(!reader.open)reader.showModal();byId('reader-title').focus();}
document.querySelectorAll('[data-doc]').forEach(button=>button.addEventListener('click',()=>openDoc(button.dataset.doc,Number(button.dataset.page)||1,button.classList.contains('text-mode'))));
document.querySelectorAll('[data-download]').forEach(button=>button.addEventListener('click',()=>downloadDoc(button.dataset.download)));
function downloadDoc(id){const doc=DATA.documents[id];if(!doc)return;const a=document.createElement('a');a.href=urlFor(id);a.download=doc.filename;document.body.append(a);a.click();a.remove();announce(doc.filename+' is ready to download.');}
byId('reader-close').addEventListener('click',()=>reader.close());
reader.addEventListener('close',()=>{byId('reader-frame').src='about:blank';if(returnFocus&&returnFocus.isConnected)returnFocus.focus();});
byId('reader-mode').addEventListener('click',()=>{mode=mode==='pdf'?'text':'pdf';renderReader();});
byId('reader-prev').addEventListener('click',()=>{activePage--;renderReader();});
byId('reader-next').addEventListener('click',()=>{activePage++;renderReader();});
byId('reader-page').addEventListener('change',e=>{activePage=e.target.value;renderReader();});
async function copy(text,label){let copied=false;try{if(navigator.clipboard){await navigator.clipboard.writeText(text);copied=true;}}catch{}
 if(!copied){const a=document.createElement('textarea');a.value=text;a.style.cssText='position:fixed;left:-9999px';document.body.append(a);a.select();try{copied=document.execCommand('copy');}catch{}a.remove();}
 if(copied){announce(label+' copied.');return;}byId('copy-text').value=text;byId('copy-dialog').showModal();byId('copy-text').focus();byId('copy-text').select();announce('Select and copy the prepared text.');}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',()=>copy(button.dataset.copy==='cover'?DATA.coverText:DATA.fullText,button.dataset.copy==='cover'?'Front-cover journal text':'Full submission')));
byId('copy-close').addEventListener('click',()=>byId('copy-dialog').close());
function downloadText(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
document.querySelectorAll('[data-text-download]').forEach(button=>button.addEventListener('click',()=>{const cover=button.dataset.textDownload==='cover';downloadText(cover?DATA.coverText:DATA.fullText,cover?'UC-Journal-Cover-15-October-2026.txt':'UC-Journal-Submission-15-October-2026.txt');}));
byId('print-cover').addEventListener('click',()=>{document.body.classList.add('print-cover');window.print();});
window.addEventListener('afterprint',()=>document.body.classList.remove('print-cover'));
byId('menu-toggle').addEventListener('click',()=>{const open=byId('side').classList.toggle('is-open');byId('menu-toggle').setAttribute('aria-expanded',String(open));});
function filterIssues(team){let n=0;document.querySelectorAll('.issue-card').forEach(card=>{card.hidden=team!=='All'&&!card.dataset.teams.split('|').includes(team);if(!card.hidden)n++;});document.querySelectorAll('[data-team]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.team===team)));byId('issue-count').textContent=n+' of 9 issue areas shown.';}
document.querySelectorAll('[data-team]').forEach(button=>button.addEventListener('click',()=>filterIssues(button.dataset.team)));
function filterDocs(){const term=byId('doc-search').value.trim().toLowerCase(),lane=byId('doc-lane').value;let n=0;
document.querySelectorAll('.document-card').forEach(card=>{card.hidden=!(card.dataset.search.includes(term)&&(lane==='All'||card.dataset.lane===lane));if(!card.hidden)n++;});byId('doc-count').textContent=n+' of '+Object.keys(DATA.documents).length+' available document copies shown.';byId('doc-empty').hidden=n!==0;}
byId('doc-search').addEventListener('input',filterDocs);byId('doc-lane').addEventListener('change',filterDocs);
byId('doc-reset').addEventListener('click',()=>{byId('doc-search').value='';byId('doc-lane').value='All';filterDocs();});
function revealHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const element=byId(id);if(!element)return;if(element.classList.contains('issue-card'))filterIssues('All');if(element.classList.contains('document-card')){byId('doc-search').value='';byId('doc-lane').value='All';filterDocs();}byId('side').classList.remove('is-open');byId('menu-toggle').setAttribute('aria-expanded','false');requestAnimationFrame(()=>element.scrollIntoView({block:'start'}));}
window.addEventListener('hashchange',revealHash);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{setTimeout(revealHash,0);}));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.sidebar nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-10% 0px -65% 0px',threshold:0});document.querySelectorAll('main>.section').forEach(s=>observer.observe(s));}
byId('cover-count').textContent=DATA.coverText.length.toLocaleString('en-GB')+' characters including spaces and line breaks';filterDocs();filterIssues('All');revealHash();
window.addEventListener('pagehide',()=>{textCache.clear();});
})();
