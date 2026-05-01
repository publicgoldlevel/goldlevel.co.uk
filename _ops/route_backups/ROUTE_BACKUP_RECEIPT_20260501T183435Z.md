# GOLDLEVEL Route Backup Receipt

UTC: 20260501T183435Z

Reason:
Landing page was detected at docs/index.html while intended public route is /landing/.

Local backup:
/data/data/com.termux/files/home/GL_SITE_ROUTE_BACKUPS/docs_route_backup_20260501T183435Z

Git tag:
pre-landing-route-repair-20260501T183435Z

Current commit before route repair:
86bfee11ff21b45d02686e31dd38a09a85dfda1e

Files backed up:
- docs/
- docs/index.html if present
- docs/assets/ if present

Recovery:
git checkout pre-landing-route-repair-20260501T183435Z -- docs
