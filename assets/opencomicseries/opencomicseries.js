(function(){
  "use strict";
  Array.prototype.forEach.call(document.querySelectorAll("[data-sequence-shell]"),function(shell){
    var rail=shell.querySelector("[data-sequence]");
    var frames=Array.prototype.slice.call(shell.querySelectorAll("[data-frame]"));
    var status=shell.querySelector("[data-sequence-status]");
    var prev=shell.querySelector("[data-sequence-prev]");
    var next=shell.querySelector("[data-sequence-next]");
    if(!rail||frames.length<2)return;
    function current(){var left=rail.scrollLeft,best=0,dist=Infinity;frames.forEach(function(frame,i){var d=Math.abs(frame.offsetLeft-left);if(d<dist){dist=d;best=i;}});return best;}
    function update(){if(status)status.textContent="Plate "+(current()+1)+" of "+frames.length;}
    function go(delta){var i=Math.max(0,Math.min(frames.length-1,current()+delta));frames[i].scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});}
    if(prev)prev.addEventListener("click",function(){go(-1);});
    if(next)next.addEventListener("click",function(){go(1);});
    rail.addEventListener("keydown",function(event){if(event.key==="ArrowLeft"){event.preventDefault();go(-1);}if(event.key==="ArrowRight"){event.preventDefault();go(1);}});
    rail.addEventListener("scroll",function(){window.clearTimeout(rail._ocsTimer);rail._ocsTimer=window.setTimeout(update,80);},{passive:true});
    update();
  });
})();
