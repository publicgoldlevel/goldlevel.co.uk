(function(){
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const products = () => window.PRODUCTS || [];
  const money = n => '£' + Number(n).toFixed(0);
  const byId = id => products().find(p => p.id === id);

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function imageUrl(p){
    if(window.MomentMatterImages && p.imageKey) return window.MomentMatterImages.resolve(p.imageKey);
    return p.directImageUrl || p.imagePath || '';
  }
  function imageSrcset(p){
    if(window.MomentMatterImages && p.imageKey) return window.MomentMatterImages.srcset(p.imageKey);
    return p.responsiveSrcset || '';
  }
  function imageSizes(p, mode){
    if(window.MomentMatterImages && p.imageKey) return window.MomentMatterImages.sizes(p.imageKey, mode);
    if(mode === 'detail') return '(max-width: 900px) 92vw, 48vw';
    return p.responsiveSizes || '(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 520px';
  }
  function localFallback(p){
    if(window.MomentMatterImages && p.imageKey) return window.MomentMatterImages.local(p.imageKey);
    return p.imagePath || '';
  }

  const toast = msg => {
    const t = $('#toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  };

  function paypalPlaceholder(p, mode='card'){
    const id = `paypal-button-container-${p.id}`;
    const label = p.paypalButtonPlaceholderId || `PAYPAL_BUTTON_${String(p.id || 'PRODUCT').toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
    const price = p.priceLabel || money(p.price);
    const compact = mode === 'card' ? ' paypal-button-compact' : '';
    return `<div class="paypal-button-zone${compact}" data-paypal-product-id="${escapeHtml(p.id)}" data-paypal-placeholder-id="${escapeHtml(label)}">
      <div id="${escapeHtml(id)}" class="paypal-button-placeholder" role="group" aria-label="PayPal payment placeholder for ${escapeHtml(p.title)}">
        <strong>PayPal button placeholder</strong>
        <span>${escapeHtml(price)} · ${escapeHtml(p.shortTitle || p.title)}</span>
      </div>
      <p class="small muted paypal-placeholder-note">Replace <code>${escapeHtml(label)}</code> with the live PayPal button/container for this offer.</p>
    </div>`;
  }

  window.MM = { toast, products, byId, paypalPlaceholder };

  function productImage(p, mode='card'){
    return `<img data-artifact-image="${escapeHtml(p.imageKey || p.imagePath || '')}"
      src="${escapeHtml(imageUrl(p))}"
      srcset="${escapeHtml(imageSrcset(p))}"
      sizes="${escapeHtml(imageSizes(p, mode))}"
      alt="${escapeHtml(p.title)}"
      loading="${mode === 'detail' ? 'eager' : 'lazy'}"
      decoding="async"
      referrerpolicy="no-referrer"
      onerror="this.removeAttribute('srcset');this.src='${escapeHtml(localFallback(p))}';">`;
  }

  function productCard(p){
    return `<article class="product-card core-offer-card">
      <a class="product-link" href="product.html?id=${encodeURIComponent(p.id)}">
        <div class="product-image">${productImage(p, 'card')}</div>
        <div class="product-body">
          <div class="badge">${escapeHtml(p.format || '')}</div>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.summary || '')}</p>
          <div class="product-meta"><span>${escapeHtml(p.priceLabel || money(p.price))}</span><span>${escapeHtml(p.deliveryLabel || '')}</span></div>
        </div>
      </a>
      <div class="product-actions">
        <a class="btn btn-secondary btn-small" href="product.html?id=${encodeURIComponent(p.id)}">View details</a>
        ${paypalPlaceholder(p, 'card')}
      </div>
    </article>`;
  }

  function renderGrids(){
    $$('[data-featured-products]').forEach(el => { el.innerHTML = products().map(productCard).join(''); });
    $$('[data-product-grid]').forEach(el => { el.innerHTML = products().map(productCard).join(''); });
    window.MomentMatterImages?.init?.();
  }

  function renderProduct(){
    const mount = $('#productDetail');
    if(!mount) return;
    const id = new URLSearchParams(location.search).get('id') || products()[0]?.id;
    const p = byId(id) || products()[0];
    if(!p){ mount.innerHTML = '<p>No product found.</p>'; return; }
    document.title = `${p.title} | Moment & Matter`;
    mount.innerHTML = `<div class="product-detail-grid">
      <div class="product-detail-image">${productImage(p, 'detail')}</div>
      <div class="product-detail-copy">
        <div class="eyebrow">${escapeHtml(p.format || '')} · ${escapeHtml(p.deliveryLabel || '')}</div>
        <h1>${escapeHtml(p.title)}</h1>
        <p class="lede">${escapeHtml(p.description || p.summary || '')}</p>
        <div class="price-line">${escapeHtml(p.priceLabel || money(p.price))}</div>
        ${paypalPlaceholder(p, 'detail')}
        <div class="grid-2 product-info-grid">
          <article class="card"><h3>Best for</h3><ul class="list-clean">${(p.bestFor || []).map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
          <article class="card"><h3>What arrives</h3><ul class="list-clean">${(p.arrives || []).map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article>
        </div>
        <p class="small muted">This static site does not collect order details. Use the PayPal button once connected, or <a href="contact.html">ask before ordering</a>.</p>
      </div>
    </div>`;
    window.MomentMatterImages?.init?.();
  }

  function mobileNav(){
    const btn = $('#menuBtn'), panel = $('#mobilePanel');
    if(!btn || !panel) return;
    if(!btn.hasAttribute('type')) btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', panel.id || 'mobilePanel');
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') || 'false');

    const setOpen = open => {
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
    };

    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
      if(event.key === 'Escape') setOpen(false);
    });
    panel.addEventListener('click', event => {
      if(event.target.closest('a')) setOpen(false);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => { mobileNav(); renderGrids(); renderProduct(); });
  } else {
    mobileNav(); renderGrids(); renderProduct();
  }
})();
