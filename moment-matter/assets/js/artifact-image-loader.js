
(function(){
  const manifest = window.MOMENT_MATTER_ARTIFACT_IMAGES || { items: {}, preferExternal: true, preferResponsiveProxy: true };

  function asUrl(path){
    if(!path) return "";
    if(/^https?:\/\//i.test(path)) return path;
    try { return new URL(path, document.baseURI).href; }
    catch(e){ return path; }
  }

  function getItem(keyOrPath){
    if(!keyOrPath) return null;
    const items = manifest.items || {};
    if(items[keyOrPath]) return items[keyOrPath];
    return Object.values(items).find(item =>
      item.filename === keyOrPath ||
      item.localPath === keyOrPath ||
      item.directUrl === keyOrPath ||
      item.externalUrl === keyOrPath ||
      (item.localPath && item.localPath.endsWith("/" + keyOrPath))
    ) || null;
  }

  function resolveSrc(item){
    if(!item) return "";
    if(manifest.preferExternal && (item.directUrl || item.externalUrl)) return item.directUrl || item.externalUrl;
    return asUrl(item.localPath || item.directUrl || item.externalUrl || "");
  }

  function resolveSrcset(item){
    if(!item) return "";
    if(manifest.preferResponsiveProxy && item.responsiveSrcset) return item.responsiveSrcset;
    return "";
  }

  function apply(img){
    const key = img.getAttribute("data-artifact-image");
    const item = getItem(key);
    if(!item) return;

    const src = resolveSrc(item);
    const srcset = resolveSrcset(item);
    const sizes = img.getAttribute("data-artifact-sizes") || item.responsiveSizes || "(max-width: 700px) 92vw, 420px";
    const local = asUrl(item.localPath || "");

    if(srcset) img.setAttribute("srcset", srcset);
    if(sizes) img.setAttribute("sizes", sizes);
    if(src) img.setAttribute("src", src);

    img.setAttribute("loading", img.getAttribute("loading") || "lazy");
    img.setAttribute("decoding", img.getAttribute("decoding") || "async");
    img.setAttribute("referrerpolicy", img.getAttribute("referrerpolicy") || "no-referrer");

    const parent = img.closest("a");
    if(parent && item.viewUrl && img.hasAttribute("data-artifact-view-link")){
      parent.setAttribute("href", item.viewUrl);
    }

    img.addEventListener("error", function(){
      const current = img.getAttribute("src") || "";
      img.removeAttribute("srcset");
      if(local && current !== local){
        img.setAttribute("src", local);
      } else {
        img.classList.add("image-load-failed");
        img.setAttribute("data-image-failed", "true");
      }
    }, { once: true });
  }

  function init(){
    document.querySelectorAll("img[data-artifact-image]").forEach(apply);
  }

  window.MomentMatterImages = {
    manifest,
    getItem,
    resolve: function(key){ const item = getItem(key); return item ? resolveSrc(item) : asUrl(key); },
    srcset: function(key){ const item = getItem(key); return item ? resolveSrcset(item) : ""; },
    sizes: function(key, mode){
      const item = getItem(key);
      if(!item) return "(max-width: 700px) 92vw, 420px";
      if(mode === "hero") return item.heroSizes || item.responsiveSizes;
      if(mode === "detail") return item.detailSizes || item.responsiveSizes;
      return item.responsiveSizes || "(max-width: 700px) 92vw, 420px";
    },
    local: function(key){ const item = getItem(key); return item ? asUrl(item.localPath) : ""; },
    init
  };

  document.addEventListener("DOMContentLoaded", init);
})();
