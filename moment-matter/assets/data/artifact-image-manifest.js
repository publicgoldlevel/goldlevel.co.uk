/*
Moment & Matter artifact image manifest.

v7 update:
- Direct BeeIMG JPG URLs are embedded for all six artifact images.
- Responsive srcsets are generated using wsrv.nl as a resizing proxy.
- The raw BeeIMG JPG remains the first non-proxy fallback.
- Local repo PNG paths remain the final fallback.

If the proxy fails, the browser uses the direct BeeIMG URL.
If BeeIMG fails, artifact-image-loader.js falls back to localPath.
*/
window.MOMENT_MATTER_ARTIFACT_IMAGES = {
  "version": "v7-responsive-direct-image-wiring",
  "preferExternal": true,
  "preferResponsiveProxy": true,
  "externalProvider": "beeimg",
  "responsiveProxy": "wsrv.nl",
  "notes": "Direct BeeIMG JPG URLs are used as the primary fallback. Responsive srcsets are generated through wsrv.nl for right-sized delivery where supported. Local PNG paths remain as final fallback.",
  "items": {
    "custom_moment_card_digital": {
      "filename": "custom_moment_card_digital.png",
      "localPath": "assets/img/product-artifacts/custom_moment_card_digital.png",
      "externalUrl": "https://beeimg.com/images/f76518928634.jpg",
      "directUrl": "https://beeimg.com/images/f76518928634.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Ff76518928634.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Ff76518928634.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Ff76518928634.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Ff76518928634.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Ff76518928634.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/f7651892863/",
      "role": "Custom Moment Card — Digital product and hero image",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    },
    "custom_moment_map_digital_example": {
      "filename": "custom_moment_map_digital_example.png",
      "localPath": "assets/img/product-artifacts/custom_moment_map_digital_example.png",
      "externalUrl": "https://beeimg.com/images/g61282561611.jpg",
      "directUrl": "https://beeimg.com/images/g61282561611.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Fg61282561611.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fg61282561611.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fg61282561611.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fg61282561611.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fg61282561611.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/g6128256161/",
      "role": "Moment Map example / optional supporting image",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    },
    "custom_moment_card_physical": {
      "filename": "custom_moment_card_physical.png",
      "localPath": "assets/img/product-artifacts/custom_moment_card_physical.png",
      "externalUrl": "https://beeimg.com/images/l31712163883.jpg",
      "directUrl": "https://beeimg.com/images/l31712163883.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Fl31712163883.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fl31712163883.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fl31712163883.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fl31712163883.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fl31712163883.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/l3171216388/",
      "role": "Custom Moment Card — Printed product image",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    },
    "CLARITY_MAP_Print_edition": {
      "filename": "CLARITY_MAP_Print_edition.png",
      "localPath": "assets/img/product-artifacts/CLARITY_MAP_Print_edition.png",
      "externalUrl": "https://beeimg.com/images/m43309933361.jpg",
      "directUrl": "https://beeimg.com/images/m43309933361.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Fm43309933361.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fm43309933361.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fm43309933361.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fm43309933361.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fm43309933361.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/m4330993336/",
      "role": "Paused premium/clarity visual fallback, not in active 2x2 shop",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    },
    "custom_moment_map_digital": {
      "filename": "custom_moment_map_digital.png",
      "localPath": "assets/img/product-artifacts/custom_moment_map_digital.png",
      "externalUrl": "https://beeimg.com/images/r54846688841.jpg",
      "directUrl": "https://beeimg.com/images/r54846688841.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Fr54846688841.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fr54846688841.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fr54846688841.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fr54846688841.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fr54846688841.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/r5484668884/",
      "role": "Custom Moment Map — Digital product image",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    },
    "Custom_Moment_Map_printed": {
      "filename": "Custom_Moment_Map_printed.png",
      "localPath": "assets/img/product-artifacts/Custom_Moment_Map_printed.png",
      "externalUrl": "https://beeimg.com/images/u45115817232.jpg",
      "directUrl": "https://beeimg.com/images/u45115817232.jpg",
      "responsiveSrcset": "https://wsrv.nl/?url=beeimg.com%2Fimages%2Fu45115817232.jpg&w=360&output=webp&q=78&n=-1 360w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fu45115817232.jpg&w=540&output=webp&q=78&n=-1 540w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fu45115817232.jpg&w=720&output=webp&q=78&n=-1 720w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fu45115817232.jpg&w=960&output=webp&q=78&n=-1 960w, https://wsrv.nl/?url=beeimg.com%2Fimages%2Fu45115817232.jpg&w=1280&output=webp&q=78&n=-1 1280w",
      "responsiveSizes": "(max-width: 560px) 92vw, (max-width: 900px) 46vw, 360px",
      "heroSizes": "(max-width: 900px) 92vw, 44vw",
      "detailSizes": "(max-width: 900px) 92vw, 48vw",
      "viewUrl": "https://beeimg.com/view/u4511581723/",
      "role": "Custom Moment Map — Printed product image",
      "externalProvider": "beeimg",
      "externalFormat": "jpg",
      "responsiveProvider": "wsrv.nl",
      "fallbackOrder": [
        "responsiveSrcset",
        "directUrl",
        "localPath"
      ]
    }
  }
};
