(function(){
  const form = document.getElementById('clarityIntakeForm');
  const build = document.getElementById('buildMailto');
  const link = document.getElementById('mailtoLink');
  const summary = document.getElementById('intakeSummary');
  const copy = document.getElementById('copySummary');
  if(!form || !build || !link || !summary) return;
  const email = 'info@goldlevel.co.uk';
  function value(name){ const el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
  function checked(name){ const el = form.elements[name]; return !!(el && el.checked); }
  function makeSummary(){
    return [
      'GOLDLEVEL Clarity Read intake',
      '',
      'Name: ' + value('name'),
      'Email: ' + value('email'),
      'Asset type: ' + value('assetType'),
      'Preferred depth: ' + value('tier'),
      '',
      'Link or file note:',
      value('assetLink'),
      '',
      'Who is it for?',
      value('audience'),
      '',
      'What is not landing clearly?',
      value('issue'),
      '',
      'What should not happen?',
      value('boundary'),
      '',
      'Consent to respond by email: ' + (checked('consent') ? 'Yes' : 'No / not yet checked')
    ].join('\n');
  }
  function update(){
    const text = makeSummary();
    summary.textContent = text;
    const subject = 'GOLDLEVEL Clarity Read - ' + (value('assetType') || 'one asset');
    link.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  }
  build.addEventListener('click', update);
  form.addEventListener('input', update);
  document.querySelectorAll('[data-tier-jump]').forEach(function(btn){
    btn.addEventListener('click', function(){
      const tier = btn.getAttribute('data-tier-jump');
      if(form.elements['tier']) form.elements['tier'].value = tier;
      setTimeout(update, 20);
    });
  });
  if(copy){ copy.addEventListener('click', async function(){ update(); try{ await navigator.clipboard.writeText(summary.textContent); copy.textContent = 'Copied'; setTimeout(()=>copy.textContent='Copy summary',1600); }catch(e){ copy.textContent = 'Select and copy above'; } }); }
  update();
})();