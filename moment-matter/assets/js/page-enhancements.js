
(function(){
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));

  function setFaqState(button, open){
    const item = button.closest('.faq-item');
    const answerId = button.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : item?.querySelector('.faq-answer');
    if(!item || !answer) return;
    item.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    answer.hidden = !open;
  }

  function initFaq(){
    $$('.faq-question').forEach((button, index)=>{
      if(button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      if(!button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
      const answerId = button.getAttribute('aria-controls');
      const answer = answerId ? document.getElementById(answerId) : button.closest('.faq-item')?.querySelector('.faq-answer');
      if(answer && !answer.hasAttribute('hidden') && button.getAttribute('aria-expanded') !== 'true'){
        answer.hidden = true;
      }
      button.addEventListener('click', ()=>{
        const open = button.getAttribute('aria-expanded') === 'true';
        setFaqState(button, !open);
      });
      button.addEventListener('keydown', event=>{
        if(event.key === 'Enter' || event.key === ' '){
          event.preventDefault();
          button.click();
        }
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initFaq);
  } else {
    initFaq();
  }
})();
