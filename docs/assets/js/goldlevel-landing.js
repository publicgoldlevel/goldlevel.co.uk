(function () {
  const form = document.getElementById('intake-form');
  const output = document.getElementById('generated-message');
  const copy = document.getElementById('copy-message');

  function message() {
    const type = document.getElementById('asset-type').value.trim();
    const note = document.getElementById('asset-note').value.trim() || '[paste link / screenshot]';
    const action = document.getElementById('buyer-action').value.trim() || '[what buyers should do]';
    return `DM READ — I want a Live-But-Not-Landing Read.\n\nMaterial type: ${type}\nMaterial: ${note}\nDesired buyer action: ${action}\nCurrent response: [what is happening now]\n\nPlease confirm the payment route and the 24–48h delivery window.`;
  }

  if (form && output) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      output.textContent = message();
    });
  }

  if (copy && output) {
    copy.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(output.textContent);
        copy.textContent = 'Copied';
        window.setTimeout(() => (copy.textContent = 'Copy message'), 1400);
      } catch (error) {
        copy.textContent = 'Select and copy manually';
      }
    });
  }
})();
