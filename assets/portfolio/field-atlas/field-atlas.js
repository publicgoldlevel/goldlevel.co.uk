(function(){
  "use strict";
  var search=document.querySelector("[data-atlas-search]");
  var type=document.querySelector("[data-atlas-type]");
  var theme=document.querySelector("[data-atlas-theme]");
  var cards=Array.prototype.slice.call(document.querySelectorAll("[data-atlas-card]"));
  var sections=Array.prototype.slice.call(document.querySelectorAll("[data-theme-section]"));
  var count=document.querySelector("[data-atlas-count]");
  var empty=document.querySelector("[data-atlas-empty]");
  function normal(v){return String(v||"").toLowerCase().trim();}
  function filter(){
    if(!cards.length)return;
    var q=normal(search&&search.value),t=normal(type&&type.value),f=normal(theme&&theme.value),visible=0;
    cards.forEach(function(card){
      var hay=normal(card.dataset.search||card.dataset.title+" "+card.dataset.id+" "+card.dataset.theme);
      var ok=(!q||hay.indexOf(q)!==-1)&&(!t||normal(card.dataset.type)===t)&&(!f||normal(card.dataset.theme)===f);
      card.hidden=!ok;if(ok)visible+=1;
    });
    sections.forEach(function(section){
      var shown=Array.prototype.some.call(section.querySelectorAll("[data-atlas-card]"),function(card){return !card.hidden;});
      section.hidden=!shown;
    });
    if(count)count.textContent=visible+" of "+cards.length+" works shown";
    if(empty)empty.hidden=visible!==0;
  }
  [search,type,theme].forEach(function(node){if(node)node.addEventListener(node.tagName==="INPUT"?"input":"change",filter);});
  var params=new URLSearchParams(location.search);
  if(type&&params.get("type"))type.value=params.get("type");
  if(theme&&params.get("theme"))theme.value=params.get("theme");
  if(search&&params.get("q"))search.value=params.get("q");
  filter();

  Array.prototype.forEach.call(document.querySelectorAll("[data-sequence-shell]"),function(shell){
    var rail=shell.querySelector("[data-sequence]");
    var frames=Array.prototype.slice.call(shell.querySelectorAll("[data-frame]"));
    var status=shell.querySelector("[data-sequence-status]");
    var prev=shell.querySelector("[data-sequence-prev]");
    var next=shell.querySelector("[data-sequence-next]");
    if(!rail||frames.length<2)return;
    function current(){var left=rail.scrollLeft,best=0,dist=Infinity;frames.forEach(function(frame,i){var d=Math.abs(frame.offsetLeft-left);if(d<dist){dist=d;best=i;}});return best;}
    function update(){if(status)status.textContent="Frame "+(current()+1)+" of "+frames.length;}
    function go(delta){var i=Math.max(0,Math.min(frames.length-1,current()+delta));frames[i].scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});}
    if(prev)prev.addEventListener("click",function(){go(-1);});
    if(next)next.addEventListener("click",function(){go(1);});
    rail.addEventListener("scroll",function(){window.clearTimeout(rail._atlasTimer);rail._atlasTimer=window.setTimeout(update,80);},{passive:true});
    update();
  });
})();
