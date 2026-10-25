const fs = require('fs');
const path = require('path');
const { build } = require('vite');
const { chromium } = require('C:/Users/vivekanand/Desktop/Progeni/Utility/node_modules/playwright');

const ROOT = 'C:/Users/vivekanand/Desktop/Progeni/wakit';
const DIST = path.join(ROOT, 'dist');
const PROD = 'https://wakit.progeni.live';

const ROUTES = [
  '/',
  '/whatsapp-status-splitter',
  '/direct-chat-without-saving-number',
  '/whatsapp-qr-code-generator',
  '/whatsapp-audio-compressor',
  '/about',
  '/privacy-policy',
  '/terms',
  '/contact',
];

function inject(head, body) {
  let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  if (!head.canonical && body.__route) {
    head.canonical = PROD + body.__route;
  }
  if (head.title) html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${head.title}</title>`);
  const setMeta = (name, content) => {
    if (!content) return;
    const esc = content.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const re = new RegExp(`<meta[^>]+name=["']${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}["'][^>]*>`, 'i');
    if (re.test(html)) html = html.replace(re, `<meta name="${name}" content="${esc}" />`);
    else html = html.replace('</head>', `    <meta name="${name}" content="${esc}" />\n  </head>`);
  };
  const setProp = (prop, content) => {
    if (!content) return;
    const esc = content.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const re = new RegExp(`<meta[^>]+property=["']${prop.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}["'][^>]*>`, 'i');
    if (re.test(html)) html = html.replace(re, `<meta property="${prop}" content="${esc}" />`);
    else html = html.replace('</head>', `    <meta property="${prop}" content="${esc}" />\n  </head>`);
  };
  setMeta('description', head.description);
  setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  if (head.canonical) {
    const re = /<link[^>]+rel=["']canonical["'][^>]*>/i;
    if (re.test(html)) html = html.replace(re, `<link rel="canonical" href="${head.canonical.replace(/"/g, '&quot;')}" />`);
    else html = html.replace('</head>', `    <link rel="canonical" href="${head.canonical.replace(/"/g, '&quot;')}" />\n  </head>`);
  }
  setProp('og:title', head.title);
  setProp('og:description', head.description);
  setProp('og:url', head.canonical);
  setProp('og:type', 'website');
  setProp('og:site_name', 'WaKit');
  setMeta('twitter:title', head.title);
  setMeta('twitter:description', head.description);
  setMeta('twitter:url', head.canonical);
  setMeta('twitter:card', 'summary');

  // Remove self-heal canonical script
  html = html.replace(/<!-- Canonical: live production URL\. Self-heals to the served origin on load\. -->\s*<script>[\s\S]*?<\/script>/i, '');

  // Replace #root with prerendered content + keep script tags
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${body.html}</div>`);
  return html;
}

(async () => {
  try {
    await build({ configFile: path.join(ROOT, 'vite.config.ts'), build: { ssr: path.join(ROOT, 'src/entry-server.tsx'), outDir: 'dist-ssr', emptyOutDir: true, rollupOptions: { input: path.join(ROOT, 'src/entry-server.tsx') } }, logLevel: 'warn' });
  } catch (e) {
    console.error('ssr build failed', e.message);
    process.exit(1);
  }
  const entry = require(path.join(DIST, '..', 'dist-ssr', 'entry-server.js'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of ROUTES) {
    try {
      const bodyHtml = entry.render(route);
      const { getSsrSeo } = require(path.join(DIST, '..', 'dist-ssr', 'entry-server.js'));
      // Get SEO by navigating/rendering differently — getSsrSeo exported from component module
    } catch (e) {
      console.log('render err', route, e.message);
    }
  }
  await browser.close();
  console.log('done');
})();
