
(function(){
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar || !toggle || !closeBtn || !overlay) return;
  const open = () => { body.classList.add('sidebar-open'); toggle.setAttribute('aria-expanded','true'); };
  const close = () => { body.classList.remove('sidebar-open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => body.classList.contains('sidebar-open') ? close() : open());
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
