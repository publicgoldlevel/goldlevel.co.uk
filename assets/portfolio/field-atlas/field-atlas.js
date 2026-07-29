(function(){
  "use strict";
  var search=document.querySelector("[data-atlas-search]");
  var type=document.querySelector("[data-atlas-type]");
  var collection=document.querySelector("[data-atlas-collection]");
  var cards=Array.prototype.slice.call(document.querySelectorAll("[data-atlas-card]"));
  var count=document.querySelector("[data-atlas-count]");
  var empty=document.querySelector("[data-atlas-empty]");
  function normal(v){return String(v||"").toLowerCase().trim();}
  function filter(){
    if(!cards.length)return;
    var q=normal(search&&search.value),t=normal(type&&type.value),c=normal(collection&&collection.value),visible=0;
    cards.forEach(function(card){
      var ok=(!q||normal(card.dataset.search||card.dataset.title+" "+card.dataset.id+" "+card.dataset.collection).indexOf(q)!==-1)&&(!t||normal(card.dataset.type)===t)&&(!c||normal(card.dataset.collection)===c);
      card.hidden=!ok;if(ok)visible+=1;
    });
    if(count)count.textContent=visible+" of "+cards.length+" works shown";
    if(empty)empty.hidden=visible!==0;
  }
  [search,type,collection].forEach(function(node){if(node)node.addEventListener(node.tagName==="INPUT"?"input":"change",filter);});
  if(collection){var params=new URLSearchParams(location.search);var preset=params.get("collection");if(preset)collection.value=preset;}
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
