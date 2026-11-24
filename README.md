# MAKIIN site

Static site served by a Cloudflare Worker (static assets only).
Domain: makiinstudio.com, canonical host www.makiinstudio.com.

- `index.html` + `support.js`: the design (Claude Design export, runs React in the browser). `index.html` is the single source of truth.
- `id/`, `projects/<slug>/`, `id/projects/<slug>/`, `sitemap.xml`: generated from `index.html`. Never edit them by hand.
- `404.html`: served for unknown paths (`not_found_handling: "404-page"` in `wrangler.jsonc`).
- `uploads/MAKIIN-WEB-ASSETS-WEBP-v1.0_2026-10-02/`: WebP photos and drawings.
- `assets/`: logo, favicon, OG image, loader video.
- `robots.txt`, `_headers`, `.assetsignore`, `wrangler.jsonc`: SEO and deploy config.

After any edit to `index.html`: `node scripts/build-routes.mjs`, then deploy.
Deploy: `npx wrangler deploy`, then `git push` in the same step.
Check: `node ~/Sites/glhf-tools/seo-guard.mjs . --live https://www.makiinstudio.com`.
