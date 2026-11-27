# MAKIIN Architecture Studio website

GLHF project contract. Any agent or human picking this up cold reads this file first.
This repo is PUBLIC (github.com/alawin/makiin-site). No prices, contact details or credentials in any file here.

## Overview
- **Client:** MAKIIN Architecture Studio (Rikza Mustofa). Contact details: not in this repo, see Jivan.
- **Product:** One-page portfolio site, English and Indonesian, 7 projects. Live at https://www.makiinstudio.com
- **Package / Scope:** QUESTION for Jivan: which pricelist package, and is the scope written down anywhere?
- **Deadline:** QUESTION for Jivan: is there a delivery date or milestone list?
- **Status:** QUESTION for Jivan: in_development, delivered or maintenance?

## Stack

| Layer | Tech | Port | Deploy |
|---|---|---|---|
| Frontend | Static HTML/CSS/JS. `index.html` plus `support.js` (DC runtime). React 18.3.1, ReactDOM 18.3.1 and Babel standalone 7.29.0 load from unpkg at runtime | none | Cloudflare Workers static assets (`wrangler.jsonc`, worker `makiin-studio`) |
| Backend | none | none | none |
| Database | none | none | none |
| Integrations | None installed. GA4, GTM, Search Console, Meta Pixel are not set up yet | none | none |

## Architecture
```
index.html            single source of truth (Claude Design export)
support.js            DC runtime
404.html              served for unknown paths
id/, projects/<slug>/, id/projects/<slug>/, sitemap.xml   generated, never edit by hand
scripts/              build-routes.mjs, snapshot.mjs, snapshot.json
assets/, fonts/, uploads/   logo, favicon, loader video, fonts, WebP photos
wrangler.jsonc, _headers, robots.txt, .assetsignore
```

## Workflow
- Backlog lives in `BACKLOG.md`. Status flow: `todo → planned → in_progress → done`.
- Plans are dated files in `plans/` named `YYYY-MM-DD_short-slug.md`. Every non-trivial backlog item links to one.
- Definition of done: an item is `[done]` only when every acceptance criterion is verified and checked.
- Launch checklist: `~/Sites/glhf-tools/launch-checklist.md`. Walk every section before saying the site is done.

## Rules
1. All dev docs (backlog, plans, commits, code) in English. Client-facing deliverables in Bahasa Indonesia unless agreed otherwise.
2. Commit after every completed item. No uncommitted work left behind.
3. Pricing and scope changes: Jivan decides. Never promise the client anything not in BACKLOG.md.
4. After deploy, verify in the browser. Build passing is not the same as feature working.
5. After any edit to `index.html`: `node scripts/snapshot.mjs && node scripts/build-routes.mjs`, then `npx wrangler deploy`, then `git push` in the same step.
6. Client copy is verbatim (COPY-001.1). Never rewrite it. Long dashes inside it stay.
7. Run `node ~/Sites/glhf-tools/seo-guard.mjs . --live https://www.makiinstudio.com` before saying done. An ERR means not done.
