const fs = require('fs');
const path = require('path');
const { build } = require('vite');
const { chromium } = require('C:/Users/vivekanand/Desktop/Progeni/Utility/node_modules/playwright');

const ROOT = 'C:/Users/vivekanand/Desktop/Progeni/wakit';
const DIST = path.join(ROOT, 'dist');
const PROD = 'https://wakit.progeni.live';

const ROUTES = [
  ['/', 'index.html'],
  ['/whatsapp-status-splitter', 'whatsapp-status-splitter.html'],
  ['/direct-chat-without-saving-number', 'direct-chat-without-saving-number.html'],
  ['/whatsapp-qr-code-generator', 'whatsapp-qr-code-generator.html'],
  ['/whatsapp-audio-compressor', 'whatsapp-audio-compressor.html'],
  ['/about', 'about.html'],
  ['/privacy-policy', 'privacy-policy.html'],
  ['/terms', 'terms.html'],
  ['/contact', 'contact.html'],
];

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function apply(html, seo, route) {
  const title = (seo && seo.title) || (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const desc = (seo && seo.description) || (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i)?.[1] || '');
  const canon = (seo && seo.canonicalPath) ? (PROD + seo.canonicalPath) : (PROD + (route === '/' ? '/' : route));
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  const meta = (name, content) => {
    if (!content) return;
    const re = new RegExp(`<meta[^>]+name=["']${name.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')}["'][^>]*>`, 'i');
    if (re.test(out)) out = out.replace(re, `<meta name="${name}" content="${esc(content)}" />`);
    else out = out.replace('</head>', `    <meta name="${name}" content="${esc(content)}" />\n  </head>`);
  };
  const prop = (p, content) => {
    if (!content) return;
    const re = new RegExp(`<meta[^>]+property=["']${p.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')}["'][^>]*>`, 'i');
    if (re.test(out)) out = out.replace(re, `<meta property="${p}" content="${esc(content)}" />`);
    else out = out.replace('</head>', `    <meta property="${p}" content="${esc(content)}" />\n  </head>`);
  };
  meta('description', desc);
  meta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  const cre = /<link[^>]+rel=["']canonical["'][^>]*>/i;
  if (cre.test(out)) out = out.replace(cre, `<link rel="canonical" href="${canon.replace(/"/g,'&quot;')}" />`);
  else out = out.replace('</head>', `    <link rel="canonical" href="${canon.replace(/"/g,'&quot;')}" />\n  </head>`);
  prop('og:title', title); prop('og:description', desc); prop('og:url', canon); prop('og:type', 'website'); prop('og:site_name', 'WaKit');
  meta('twitter:title', title); meta('twitter:description', desc); meta('twitter:url', canon); meta('twitter:card', 'summary');
  out = out.replace(/<!-- Canonical: live production URL\. Self-heals to the served origin on load\. -->\s*<script>[\s\S]*?<\/script>/i, '');
  return out;
}

(async () => {
  await build({ configFile: path.join(ROOT, 'vite.config.ts'), build: { ssr: path.join(ROOT, 'src/entry-server.tsx'), outDir: 'dist-ssr', emptyOutDir: true, rollupOptions: { output: { format: 'cjs' } } }, logLevel: 'warn' });
  const mod = require(path.join(ROOT, 'dist-ssr', 'entry-server.cjs'));
  const browser = await chromium.launch();
  for (const [route, file] of ROUTES) {
    let bodyHtml = '';
    let seo = null;
    try {
      const res = mod.render(route);
      bodyHtml = res.html;
      seo = res.seo;
    } catch (e) { console.log('ERR', route, e.message); }
    let html = fs.readFileSync(path.join(DIST, file), 'utf8');
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${bodyHtml}</div>`);
    html = apply(html, seo, route);
    fs.writeFileSync(path.join(DIST, file), html);
    console.log('prerendered', route);
  }
  await browser.close();
  console.log('done');
})();
