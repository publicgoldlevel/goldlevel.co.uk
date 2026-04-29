/* Moment & Matter PayPal Placeholder Wiring — V11
   Static-site rule: no payment or customer information is collected by this website.
   Replace each placeholder container with the matching live PayPal button embed when ready. */
(function(){
  function decorate(){
    document.querySelectorAll('[data-paypal-placeholder-id], [data-paypal-placeholder]').forEach(function(zone){
      var id = zone.getAttribute('data-paypal-placeholder-id') || zone.getAttribute('data-paypal-placeholder');
      if(!id) return;
      zone.setAttribute('data-live-paypal-button-goes-here', id);
      zone.setAttribute('data-paypal-placeholder-id', id);
      if(!zone.textContent.trim()){ zone.textContent = 'PayPal button'; }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();
