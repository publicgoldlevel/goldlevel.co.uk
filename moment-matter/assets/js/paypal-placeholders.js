/*
  Moment & Matter PayPal Placeholder Wiring — Pass 10

  Static-site rule:
  - This file does not collect customer information.
  - It does not load PayPal automatically.
  - Replace each placeholder with a live PayPal Hosted Button or PayPal JS SDK container when ready.

  Placeholder IDs:
  - PAYPAL_BUTTON_CUSTOM_MOMENT_CARD_DIGITAL
  - PAYPAL_BUTTON_CUSTOM_MOMENT_CARD_PRINTED
  - PAYPAL_BUTTON_CUSTOM_MOMENT_MAP_DIGITAL
  - PAYPAL_BUTTON_CUSTOM_MOMENT_MAP_PRINTED
*/
(function(){
  function decorate(){
    document.querySelectorAll('[data-paypal-placeholder-id]').forEach(zone => {
      const id = zone.getAttribute('data-paypal-placeholder-id');
      const container = zone.querySelector('.paypal-button-placeholder');
      if(!container || !id) return;
      container.setAttribute('data-live-paypal-button-goes-here', id);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();
