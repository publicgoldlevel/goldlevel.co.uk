(function () {
  const CFG = window.MOMENT_MATTER_SHOPIFY || {};
  const SHOP_DOMAIN = CFG.domain || 'xxitjd-tg.myshopify.com';
  const PRODUCT_MAP = CFG.products || {};
  const TOKEN = (CFG.storefrontAccessToken || '').trim();
  const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  let uiPromise = null;

  function getProductConfig(handle) {
    const p = PRODUCT_MAP[handle] || {};
    return {
      handle,
      productId: (p.shopifyProductId || '').trim(),
      label: p.buttonLabel || 'Buy securely',
      url: p.shopifyUrl || `https://${SHOP_DOMAIN}/products/${handle}`
    };
  }

  function isConfigured(item) {
    return Boolean(TOKEN && item.productId && !/PASTE|TODO|YOUR_/i.test(item.productId));
  }

  function directLinkHtml(item) {
    return `
      <a class="btn btn-primary shopify-direct-link" href="${item.url}" rel="noopener">
        ${item.label}
      </a>
      <span class="shopify-secure-note">Secure checkout by Shopify · PayPal available at checkout</span>
    `;
  }

  function markProcessed(node) {
    node.setAttribute('data-shopify-processed', 'true');
  }

  function renderFallback(node, item) {
    node.innerHTML = directLinkHtml(item);
    markProcessed(node);
  }

  function loadSdk() {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-shopify-buy-sdk]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.async = true;
      script.src = SDK_URL;
      script.setAttribute('data-shopify-buy-sdk', 'true');
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function getUi() {
    if (uiPromise) return uiPromise;
    uiPromise = loadSdk().then(() => {
      const client = ShopifyBuy.buildClient({
        domain: SHOP_DOMAIN,
        storefrontAccessToken: TOKEN
      });
      return ShopifyBuy.UI.onReady(client);
    });
    return uiPromise;
  }

  function createBuyButton(node, item) {
    node.innerHTML = '';
    getUi().then((ui) => {
      ui.createComponent('product', {
        id: item.productId,
        node,
        moneyFormat: '%C2%A3%7B%7Bamount%7D%7D',
        options: {
          product: {
            iframe: false,
            contents: {
              img: false,
              title: false,
              price: false,
              description: false,
              quantity: false,
              options: true,
              button: true
            },
            text: { button: item.label },
            styles: {
              product: { 'margin': '0' },
              button: {
                'background-color': '#30261f',
                'color': '#fffaf4',
                'border-radius': '999px',
                'font-family': 'Inter, system-ui, sans-serif',
                'font-size': '15px',
                'font-weight': '800',
                'padding': '14px 22px',
                ':hover': { 'background-color': '#72512c' },
                ':focus': { 'background-color': '#72512c' }
              }
            }
          },
          cart: {
            iframe: false,
            popup: false,
            text: {
              title: 'Your basket',
              total: 'Subtotal',
              button: 'Checkout securely'
            },
            styles: {
              button: {
                'background-color': '#30261f',
                'color': '#fffaf4',
                'border-radius': '999px',
                'font-family': 'Inter, system-ui, sans-serif',
                'font-weight': '800',
                ':hover': { 'background-color': '#72512c' },
                ':focus': { 'background-color': '#72512c' }
              }
            }
          },
          toggle: {
            iframe: false,
            styles: {
              toggle: {
                'background-color': '#30261f',
                ':hover': { 'background-color': '#72512c' },
                ':focus': { 'background-color': '#72512c' }
              }
            }
          }
        }
      });
      markProcessed(node);
    }).catch(() => {
      renderFallback(node, item);
    });
  }

  function processSlot(node) {
    if (!node || node.getAttribute('data-shopify-processed') === 'true') return;
    const handle = node.getAttribute('data-shopify-product');
    if (!handle) return;
    const item = getProductConfig(handle);
    const explicitLabel = node.getAttribute('data-shopify-label');
    if (explicitLabel) item.label = explicitLabel;

    if (isConfigured(item)) createBuyButton(node, item);
    else renderFallback(node, item);
  }

  function processAll() {
    document.querySelectorAll('[data-shopify-product]').forEach(processSlot);
  }

  window.MMShopifyRefresh = processAll;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('shopify-checkout-enabled');
    setTimeout(processAll, 0);
    const observer = new MutationObserver(() => processAll());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
