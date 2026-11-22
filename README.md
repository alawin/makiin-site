# MAKIIN site

Static single-page site served by a Cloudflare Worker (static assets only, no build step).
Domain: makiinstudio.com, canonical host www.makiinstudio.com.

- `index.html` + `support.js`: the design (Claude Design export, runs React in the browser).
- `uploads/MAKIIN-WEB-ASSETS-WEBP-v1.0_2026-10-02/`: WebP photos and drawings.
- `assets/`: logo and OG image. `assets/loader.mp4` (loader video) is not in the repo yet.
- `robots.txt`, `sitemap.xml`, `_headers`, `.assetsignore`, `wrangler.jsonc`: SEO and deploy config.

Deploy: `npx wrangler deploy`, then `git push` in the same step.
Check: `node ~/Sites/glhf-tools/seo-guard.mjs . --live https://www.makiinstudio.com`.
