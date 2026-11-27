// Renders the home page in each language with a headless browser and stores the visible copy in
// scripts/snapshot.json. build-routes.mjs puts that copy in <noscript> so crawlers that do not run
// JavaScript read the real text. Run after editing index.html, before build-routes.mjs:
//   node scripts/snapshot.mjs && node scripts/build-routes.mjs
// Needs `npm install` inside scripts/ (playwright-core) and the Chromium headless shell in ~/Library/Caches/ms-playwright.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'scripts/package.json'));
const { chromium } = require('playwright-core');
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.png': 'image/png', '.json': 'application/json' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = join(root, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ executablePath: exe });
const out = {};
for (const lang of ['en', 'id']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem('mk-intro', '1'));
  await page.goto(base + (lang === 'id' ? '/id/' : '/'), { waitUntil: 'networkidle' });
  await page.waitForSelector('#dc-root h1', { timeout: 20000 });
  out[lang] = await page.evaluate(() => {
    const names = [...document.querySelectorAll('#dc-root button')].map(b => b.textContent);
    const items = [];
    for (const el of document.querySelectorAll('#dc-root h1, #dc-root h2, #dc-root h3, #dc-root p')) {
      if (el.closest('[data-loader]')) continue;
      const t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      items.push({ tag: el.tagName.toLowerCase(), text: t });
    }
    return items;
  });
  await page.close();
}
await browser.close();
server.close();
writeFileSync(join(root, 'scripts/snapshot.json'), JSON.stringify(out, null, 1) + '\n');
console.log('snapshot', Object.entries(out).map(([k, v]) => `${k}:${v.length}`).join(' '));
