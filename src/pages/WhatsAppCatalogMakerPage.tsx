import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  FileText,
  ImagePlus,
  Plus,
  QrCode,
  Store,
  Trash2,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  createCanvas,
  downloadBlob,
  drawImageContain,
  loadImage,
  safeFileName,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

interface CatalogItem {
  id: string;
  name: string;
  price: string;
  description: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I create a WhatsApp catalog PDF for my business?',
    answer:
      'Add your business name, WhatsApp number, menu items and prices, then click “Download catalog PDF”. WaKit builds a clean A4 PDF and a chat QR entirely in your browser. You can share the PDF with customers or print the QR on a menu card.',
  },
  {
    question: 'Does this replace the official WhatsApp Business catalog?',
    answer:
      'No. This is a shareable PDF/image catalog for customers who prefer a document or print menu. It does not connect to WhatsApp Business, sync products, or send messages. For in-app shopping, use the official WhatsApp Business catalog.',
  },
  {
    question: 'Is my business data uploaded to a server?',
    answer:
      'No. Your logo, menu, phone number and prices are stored only in this tab while you edit. PDF generation uses jsPDF locally, and the QR is drawn by the browser. Closing the page discards the data.',
  },
  {
    question: 'Can I add my logo and brand color?',
    answer:
      'Yes. Upload a PNG, JPG or WebP logo (it is converted to a local PNG for the PDF), choose an accent color, and the PDF header, prices and QR card use that color.',
  },
  {
    question: 'Why is the PDF not downloading on my phone?',
    answer:
      'Some in-app browsers block Blob downloads. Open WaKit in Chrome, Safari or another full browser, then try again. The PDF is generated locally, so no network permission is needed.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Add business details',
    text: 'Enter your business name, WhatsApp number, logo and brand color. The QR preview updates as you type.',
  },
  {
    name: 'Build the menu',
    text: 'Add product or dish names, prices and short descriptions. Remove or reorder items before exporting.',
  },
  {
    name: 'Download and share',
    text: 'Export a print-ready A4 PDF and a high-resolution PNG QR, or copy the direct chat link for social posts.',
  },
];

const defaultItems: CatalogItem[] = [
  { id: 'item-1', name: 'Signature item', price: '₹249', description: 'Add a short description customers can scan quickly.' },
  { id: 'item-2', name: 'Popular combo', price: '₹399', description: 'Bundle two favourites and mention what is included.' },
  { id: 'item-3', name: 'Add-on', price: '₹99', description: 'Use this row for extras, sides or seasonal offers.' },
];

const makeId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const fileToPngDataUrl = async (file: File): Promise<string> => {
  const image = await loadImage(file);
  const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = createCanvas(image.naturalWidth * scale, image.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');
  drawImageContain(ctx, image, canvas.width, canvas.height, image.naturalWidth, image.naturalHeight);
  return canvas.toDataURL('image/png');
};

export const WhatsAppCatalogMakerPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('Your business name');
  const [tagline, setTagline] = useState('Fresh favourites, made locally');
  const [phone, setPhone] = useState('919876543210');
  const [address, setAddress] = useState('Your city, India');
  const [accent, setAccent] = useState('#047857');
  const [currency, setCurrency] = useState('₹');
  const [items, setItems] = useState<CatalogItem[]>(defaultItems);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPng, setLogoPng] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const { create } = useObjectUrls();

  const cleanPhone = phone.replace(/\D/g, '');
  const qrValue = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${businessName}, I would like to order from your catalog.`)}`
    : 'https://wa.me/';

  const updateItem = (id: string, key: keyof Omit<CatalogItem, 'id'>, value: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleLogo = async (nextFiles: File[]) => {
    const file = nextFiles[0];
    if (!file) return;
    setError(null);
    try {
      const png = await fileToPngDataUrl(file);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      const url = create(file);
      setLogoFile(file);
      setLogoUrl(url);
      setLogoPng(png);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not read the logo.');
    }
  };

  const downloadQr = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      setError('The QR preview is not ready yet.');
      return;
    }
    try {
      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, `${safeFileName(businessName, 'business')}-whatsapp-qr.png`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the QR image.');
    }
  };

  const downloadPdf = async () => {
    if (!businessName.trim()) {
      setError('Add a business name before exporting.');
      return;
    }
    if (!cleanPhone) {
      setError('Add a WhatsApp number with country code before exporting.');
      return;
    }
    const validItems = items.filter((item) => item.name.trim());
    if (validItems.length === 0) {
      setError('Add at least one catalog item before exporting.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 42;
      const accentRgb = hexToRgb(accent);

      const drawHeader = (title: string) => {
        doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
        doc.rect(0, 0, pageWidth, 92, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text(title.slice(0, 48), margin, 43);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(tagline.slice(0, 90), margin, 62);
        doc.text(`WhatsApp catalog · ${address.slice(0, 70)}`, margin, 77);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 116, 22, 116, 48, 8, 8, 'F');
        doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('SCAN TO CHAT', pageWidth - margin - 58, 42, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text('Open catalog & order', pageWidth - margin - 58, 55, { align: 'center' });
      };

      drawHeader(businessName);
      let y = 122;

      if (logoPng) {
        try {
          doc.addImage(logoPng, 'PNG', margin, y, 58, 58, undefined, 'FAST');
          y += 70;
        } catch {
          // A logo format the PDF renderer cannot decode should not block the catalog.
        }
      }

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Menu & price list', margin, y);
      y += 18;

      validItems.forEach((item, index) => {
        if (y > pageHeight - 145) {
          doc.addPage();
          drawHeader(businessName);
          y = 122;
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 15;
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${index + 1}. ${item.name.slice(0, 54)}`, margin, y);
        doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
        doc.text(`${currency}${item.price}`.slice(0, 18), pageWidth - margin, y, { align: 'right' });
        y += 13;
        if (item.description.trim()) {
          doc.setTextColor(71, 85, 105);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          const lines = doc.splitTextToSize(item.description.trim().slice(0, 220), pageWidth - margin * 2 - 90);
          doc.text(lines, margin, y);
          y += lines.length * 11;
        }
        y += 10;
      });

      if (y > pageHeight - 150) {
        doc.addPage();
        drawHeader(businessName);
        y = 122;
      }

      const qrCanvas = qrRef.current?.querySelector('canvas');
      const qrData = qrCanvas?.toDataURL('image/png');
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 104, 10, 10, 'FD');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Order on WhatsApp', margin + 16, y + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Scan the QR or message +${cleanPhone} directly.`, margin + 16, y + 40);
      doc.text('Share this PDF with customers or print it for your counter.', margin + 16, y + 54);
      if (qrData) {
        doc.addImage(qrData, 'PNG', pageWidth - margin - 92, y + 12, 76, 76, undefined, 'FAST');
      }
      doc.save(`${safeFileName(businessName, 'business')}-catalog.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create the PDF.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ClientToolPage
      seo={{
        title: 'WhatsApp Catalog & Menu PDF Maker with QR | WaKit',
        description:
          'Create a branded WhatsApp business catalog or restaurant menu PDF with a chat QR. Add logo, prices and descriptions — all generated locally.',
        canonicalPath: '/whatsapp-catalog-maker',
        keywords:
          'whatsapp catalog maker, whatsapp menu pdf, business catalog pdf, whatsapp qr menu, restaurant menu pdf generator',
      }}
      icon={Store}
      eyebrow="A4 PDF + chat QR • local export"
      title={
        <>
          WhatsApp <span className="text-gradient-emerald">catalog maker</span>
        </>
      }
      description="Build a clean, printable menu or product list with your brand, prices and a scan-to-chat QR — no design software or server upload needed."
      breadcrumbs={[{ name: 'Catalog Maker' }]}
      toolName="WhatsApp Catalog Maker"
      currentPath="/whatsapp-catalog-maker"
      quickAnswer={{
        question: 'How do I make a WhatsApp catalog PDF?',
        answer:
          'Enter your business details, add products or dishes, then click Download catalog PDF. WaKit renders an A4 PDF with your logo, prices and a chat QR locally. The PDF and QR are ready to print or share with customers.',
        facts: [
          { label: 'Export', value: 'A4 PDF' },
          { label: 'QR', value: 'PNG' },
          { label: 'Branding', value: 'Logo' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="A document catalog is useful for restaurants, salons, local stores and service businesses that already share PDFs on WhatsApp or print counter menus."
      faqs={faqs}
      securityHeading="Business data is generated locally, not stored in a cloud catalog"
      securityText="Your menu, logo, WhatsApp number and prices stay in component state while this tab is open. The PDF is assembled by jsPDF in your browser and the QR is rendered by the browser canvas. WaKit does not create an account, upload the logo, or keep a copy of your catalog."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-card space-y-5 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Business details</h2>
            <p className="mt-1 text-xs text-slate-600">These fields appear in the PDF header and QR card.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="catalog-name" className="field-label">Business name</label>
              <input id="catalog-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} maxLength={80} className="field" />
            </div>
            <div>
              <label htmlFor="catalog-tagline" className="field-label">Tagline</label>
              <input id="catalog-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={100} className="field" />
            </div>
            <div>
              <label htmlFor="catalog-phone" className="field-label">WhatsApp number</label>
              <input id="catalog-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))} inputMode="tel" className="field font-mono" placeholder="919876543210" />
            </div>
            <div>
              <label htmlFor="catalog-address" className="field-label">City / address</label>
              <input id="catalog-address" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={100} className="field" />
            </div>
            <div>
              <label htmlFor="catalog-currency" className="field-label">Currency</label>
              <select id="catalog-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="field">
                {['₹', '$', '€', '£', 'AED'].map((symbol) => <option key={symbol} value={symbol}>{symbol}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="catalog-accent" className="field-label">Accent color</label>
              <div className="flex items-center gap-2">
                <input id="catalog-accent" type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-slate-300 bg-white p-1" />
                <span className="font-mono text-xs text-slate-500">{accent}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <UploadZone
              accept="image/png,image/jpeg,image/webp"
              onFiles={handleLogo}
              icon={ImagePlus}
              title="Upload a logo"
              hint="PNG, JPG or WebP · converted locally for the PDF"
              files={logoFile ? [logoFile] : []}
            />
            {logoUrl && (
              <img src={logoUrl} alt="Business logo preview" className="h-16 w-16 rounded-2xl border border-slate-200 object-contain p-1" />
            )}
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Menu &amp; products</h2>
                <p className="mt-1 text-xs text-slate-600">Prices are displayed exactly as typed, with the selected currency.</p>
              </div>
              <button type="button" onClick={() => setItems((current) => [...current, { id: makeId(), name: '', price: '', description: '' }])} className="btn-secondary px-3 py-2 text-xs">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add item
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">Item {index + 1}</span>
                    <button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove item ${index + 1}`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_110px]">
                    <input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="field text-xs" placeholder="Item name" maxLength={80} />
                    <input value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="field font-mono text-xs" placeholder="Price" maxLength={18} />
                  </div>
                  <textarea value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} rows={2} className="field mt-2 resize-none text-xs" placeholder="Short description (optional)" maxLength={220} />
                </div>
              ))}
            </div>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={downloadPdf} disabled={busy} className="btn-primary flex-1 py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              {busy ? 'Building PDF…' : 'Download catalog PDF'}
            </button>
            <button type="button" onClick={downloadQr} className="btn-secondary flex-1 py-3">
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Download QR PNG
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="glass-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Live catalog preview</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">The PDF follows this structure.</p>
              </div>
              <FileText className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative p-5 text-white" style={{ backgroundColor: accent }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-extrabold">{businessName || 'Your business'}</h3>
                    <p className="mt-1 text-xs text-white/80">{tagline || 'Your tagline'}</p>
                    <p className="mt-2 text-[10px] font-semibold text-white/80">{address}</p>
                  </div>
                  {logoUrl && <img src={logoUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-white/90 object-contain p-1" />}
                </div>
              </div>
              <div className="space-y-3 p-5">
                {items.filter((item) => item.name.trim()).map((item, index) => (
                  <div key={item.id} className="border-b border-slate-100 pb-2 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-slate-900">{index + 1}. {item.name}</p>
                      <p className="shrink-0 text-sm font-extrabold" style={{ color: accent }}>{currency}{item.price}</p>
                    </div>
                    {item.description && <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.description}</p>}
                  </div>
                ))}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div ref={qrRef} className="shrink-0 rounded-lg bg-white p-1">
                    <QRCodeCanvas value={qrValue} size={72} fgColor={accent} bgColor="#ffffff" level="M" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900">Order on WhatsApp</p>
                    <p className="mt-0.5 break-all text-[10px] text-slate-500">+{cleanPhone || 'phone number'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800">
            <p className="font-bold">Tip: print the QR on your counter card</p>
            <p className="mt-1">Download the QR as a high-resolution PNG. The PDF also includes a scan-to-chat block on the last page.</p>
          </div>
        </section>
      </div>
    </ClientToolPage>
  );
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const clean = hex.replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(normalized, 16);
  if (!Number.isFinite(value)) return { r: 4, g: 120, b: 87 };
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
};
