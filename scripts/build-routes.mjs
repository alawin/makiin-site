// Generates the per-route pages from index.html, which is the single source of truth.
// Every route is the same app: only the <head> block between the mk:head markers, the
// <html lang>, and the crawlable <noscript> copy (home: rendered text from snapshot.json; project: summary) change. Run after editing index.html:
//   node scripts/build-routes.mjs
// Outputs: id/index.html, projects/<slug>/index.html, id/projects/<slug>/index.html, sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.makiinstudio.com';
const UPLOADS = '/uploads/MAKIIN-WEB-ASSETS-WEBP-v1.0_2026-10-02/';
const src = readFileSync(join(root, 'index.html'), 'utf8');
// Visible copy per language, rendered by scripts/snapshot.mjs. Missing file: fall back to the link list only.
const snapPath = join(root, 'scripts/snapshot.json');
const snap = existsSync(snapPath) ? JSON.parse(readFileSync(snapPath, 'utf8')) : {};

const slugs = [...src.match(/slugs = \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
const projects = [...src.matchAll(/\{ name: '([^']+)', type: '(\w+)', place: '([^']+)', year: '(\d+)'/g)]
  .map(m => ({ name: m[1], type: m[2], place: m[3], year: m[4] }));
if (!slugs.length || slugs.length !== projects.length) throw new Error(`slugs ${slugs.length} vs projects ${projects.length}`);

const TYPE = {
  en: { Residential: 'residential', Commercial: 'commercial', Educational: 'educational' },
  id: { Residential: 'hunian', Commercial: 'komersial', Educational: 'pendidikan' },
};
const TYPE_LABEL = {
  en: { Residential: 'Residential', Commercial: 'Commercial', Educational: 'Educational' },
  id: { Residential: 'Hunian', Commercial: 'Komersial', Educational: 'Pendidikan' },
};
const HOME_TITLE = 'MAKIIN Architecture Studio, Bandung';
const HOME_DESC = {
  en: 'MAKIIN is an architecture studio in Bandung, Indonesia. We design private residences, villas and commercial hospitality, from concept to working drawings.',
  // First sentence of COPY.CONTACT intro (ID), verbatim.
  id: 'Berbasis di Bandung, MAKIIN hadir untuk membantu Anda mewujudkan ruang impian, di mana pun Anda berada.',
};

const urlFor = (lang, i) => ORIGIN + (lang === 'id' ? '/id' : '') + (i >= 0 ? `/projects/${slugs[i]}` : '') + '/';
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function headBlock(lang, i) {
  const p = i >= 0 ? projects[i] : null;
  const title = p ? `${p.name} | MAKIIN Architecture Studio` : HOME_TITLE;
  const desc = p
    ? (lang === 'id'
      ? `${p.name}, proyek ${TYPE.id[p.type]} di ${p.place}, ${p.year}. MAKIIN Architecture Studio, Bandung.`
      : `${p.name}, a ${TYPE.en[p.type]} project in ${p.place}, ${p.year}. MAKIIN Architecture Studio, Bandung.`)
    : HOME_DESC[lang];
  const url = urlFor(lang, i);
  return [
    '<!--mk:head-->',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="en" href="${urlFor('en', i)}">`,
    `<link rel="alternate" hreflang="id" href="${urlFor('id', i)}">`,
    `<link rel="alternate" hreflang="x-default" href="${urlFor('en', i)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${lang === 'id' ? 'id_ID' : 'en_US'}">`,
    `<script>window.__MK={lang:"${lang}",open:${i}};</script>`,
    '<!--/mk:head-->',
  ].join('\n');
}

// Crawlable summary for readers without JavaScript. Only facts already shown on the page.
function noscript(lang, i) {
  if (i >= 0) {
    const p = projects[i];
    const hero = `${UPLOADS}03-project-heroes/${String(i + 1).padStart(2, '0')}-${slugs[i]}.webp`;
    return `<noscript><main><h2>${esc(p.name)}</h2><p>${TYPE_LABEL[lang][p.type]}. ${esc(p.place)}. ${p.year}.</p>` +
      `<img src="${hero}" alt="${esc(p.name)}" width="1200"></main></noscript>`;
  }
  const links = projects.map((p, k) => `<li><a href="${urlFor(lang, k).replace(ORIGIN, '')}">${esc(p.name)}</a></li>`).join('');
  const body = (snap[lang] || []).filter(x => !(x.tag === 'h2' && projects.some(p => p.name === x.text))).map(x => { const tag = x.tag === 'h1' ? 'h2' : x.tag; /* the template already carries the page h1 */ return `<${tag}>${esc(x.text).replace(/&quot;/g, '"')}</${tag}>`; }).join('');
  const email = '<p><a href="mailto:info@makiinstudio.com">info@makiinstudio.com</a></p>';
  return `<noscript><main>${body}<nav><ul>${links}</ul></nav>${email}</main></noscript>`;
}

function render(lang, i) {
  let html = src.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replace(/<!--mk:head-->[\s\S]*?<!--\/mk:head-->/, () => headBlock(lang, i));
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>\n?/, ''); // drop a previously generated block
  html = html.replace(/<body>\n?/, () => `<body>\n${noscript(lang, i)}\n`);
  return html;
}

const write = (rel, content) => {
  const f = join(root, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};

const entries = [];
for (const lang of ['en', 'id']) {
  for (let i = -1; i < slugs.length; i++) {
    const rel = (lang === 'id' ? 'id/' : '') + (i >= 0 ? `projects/${slugs[i]}/` : '') + 'index.html';
    write(rel, render(lang, i));
    entries.push(urlFor(lang, i));
  }
}

// lastmod: last commit touching index.html, or today when it has uncommitted changes.
const dirty = execSync('git status --porcelain index.html', { cwd: root }).toString().trim() !== '';
const lastmod = dirty ? new Date().toISOString().slice(0, 10) : execSync('git log -1 --format=%cs -- index.html', { cwd: root }).toString().trim();
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`).join('') + `</urlset>\n`);
console.log(`wrote ${entries.length} routes, lastmod ${lastmod}`);
