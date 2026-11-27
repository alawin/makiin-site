# MAKIIN site Backlog

Status flow: `todo → planned → in_progress → done`

---

## Epic 1: Launch readiness

**Goal:** The live site passes every section of `~/Sites/glhf-tools/launch-checklist.md`.

---

#### E1.1 Tracking setup
**Status:** `[todo]` | **Estimate:** QUESTION for Jivan | **Depends on:** GA4 and GTM IDs from Jivan
**Plan:** none yet

Install GA4 (and GTM if Jivan wants it), define conversion events, send `page_view` on each `pushState` route change, re-measure Lighthouse after.

- **File:** `index.html` - tag snippets and event calls
- **File:** `scripts/build-routes.mjs` - nothing expected, check

**Acceptance Criteria:**
- [ ] GA4 Realtime shows a pageview when the home page loads and when a project opens (check what the page shows).
- [ ] A conversion event is defined for the email link click.
- [ ] Consent behaviour is decided by `legal`, then implemented.
- [ ] Lighthouse mobile median re-measured with `lh-range.mjs` and compared with the 94 to 99 range before tags.
- [ ] Setup screenshots saved in `evidence/` with an `INDEX.md` row each.

---

#### E1.2 Search Console and Bing
**Status:** `[todo]` | **Estimate:** QUESTION for Jivan | **Depends on:** Jivan's Google account access
**Plan:** none yet

- [ ] Property verified for `www.makiinstudio.com`.
- [ ] `sitemap.xml` (16 URLs) submitted in Search Console and Bing Webmaster.
- [ ] Indexing requested once per URL after the last copy change.
- [ ] Bot hits and indexing re-checked 3 to 5 days later with `cf-bot-hits.py`.

---

#### E1.3 Crawler-facing HTML
**Status:** `[in_progress]` | **Estimate:** QUESTION for Jivan | **Depends on:** none
**Plan:** none yet

Home pages carry the rendered copy in `<noscript>` (EN and ID). The `<x-dc>` template with `{{ }}` placeholders is still in the raw HTML because the runtime reads it from there.

- [ ] `curl` of `/` and `/id/` shows real headings and paragraphs in the raw HTML.
- [ ] Decide whether the remaining `{{ }}` template text is acceptable, or the runtime must change.
- [ ] Project pages carry more than name, type, place and year (needs Rikza's copy).

---

#### E1.4 Runtime dependency on unpkg
**Status:** `[todo]` | **Estimate:** QUESTION for Jivan | **Depends on:** none

- [ ] React, ReactDOM and Babel served from this repo (or Cloudflare) instead of unpkg. Verify SRI or version pins still hold.

---

## Epic 2: Content from the client

**Goal:** Every string is final in both languages.

---

#### E2.1 Waiting on Rikza
**Status:** `[todo]` | **Estimate:** n/a | **Depends on:** Rikza

- [ ] Per-project explanation and Resonance copy, 7 projects x 2 languages.
- [ ] Indonesian translation of "Architecture that doesn't impose, but belongs", the "Praktik" cell and decorative labels.
- [ ] Phone, WhatsApp and address, if he wants them shown.

---

#### E2.2 Loader on phone portrait
**Status:** `[todo]` | **Estimate:** QUESTION for Jivan | **Depends on:** none

- [ ] Loader checked on a real phone in portrait. Portrait video or logo-only loader if it looks wrong.
