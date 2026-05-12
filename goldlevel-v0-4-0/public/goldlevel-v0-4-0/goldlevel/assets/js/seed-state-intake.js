(function(){
  const form = document.getElementById('seedStateIntakeForm');
  const build = document.getElementById('buildSeedMailto');
  const link = document.getElementById('seedMailtoLink');
  const summary = document.getElementById('seedIntakeSummary');
  const copy = document.getElementById('copySeedSummary');
  if(!form || !build || !link || !summary) return;
  const email = 'info@goldlevel.co.uk';
  function value(name){ const el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }
  function checked(name){ const el = form.elements[name]; return !!(el && el.checked); }
  function makeSummary(){
    return [
      'GOLDLEVEL Seed-State Read — Seed Packet',
      '',
      'Name: ' + value('name'),
      'Email: ' + value('email'),
      'Asset type: ' + value('assetType'),
      'Preferred depth: ' + value('tier'),
      'Available source evidence: ' + value('sourceEvidence'),
      '',
      '1. RAW SEED FIELD',
      value('rawSeed'),
      '',
      '2. INTENDED ATTRACTOR',
      value('intendedAttractor'),
      '',
      '3. TARGET OBSERVER FRAME',
      value('observerFrame'),
      '',
      '4. CURRENT FAILURE SIGNAL',
      value('failureSignal'),
      '',
      '5. ATTEMPT MEMORY',
      value('attemptMemory'),
      '',
      '6. SUSPECTED LOOP',
      value('suspectedLoop'),
      '',
      '7. PRIVATE BOUNDARY',
      value('privateBoundary'),
      '',
      '8. PROOF TARGET',
      value('proofTarget'),
      '',
      'Consent to respond by email: ' + (checked('consent') ? 'Yes' : 'No / not yet checked'),
      '',
      'Boundary note: this is a front-door seed-state intake. No private internal files are required for the first pass.'
    ].join('\n');
  }
  function update(){
    const text = makeSummary();
    summary.textContent = text;
    const subject = 'GOLDLEVEL Seed-State Read - ' + (value('assetType') || 'one seed-state');
    link.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  }
  build.addEventListener('click', update);
  form.addEventListener('input', update);
  if(copy){ copy.addEventListener('click', async function(){ update(); try{ await navigator.clipboard.writeText(summary.textContent); copy.textContent = 'Copied'; setTimeout(()=>copy.textContent='Copy summary',1600); }catch(e){ copy.textContent = 'Select and copy above'; } }); }
  update();
})();
