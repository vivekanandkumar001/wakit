import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ImagePlus,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import {
  canvasToBlob,
  copyText,
  createCanvas,
  downloadText,
  drawImageContain,
  formatBytes,
  loadImage,
  safeFileName,
  zipAndDownload,
} from '../lib/clientFiles';
import { useObjectUrls } from '../hooks/useObjectUrls';

interface ListingPhoto {
  id: string;
  file: File;
  url: string;
}

const categories = ['Furniture', 'Electronics', 'Fashion', 'Home & Garden', 'Vehicles', 'Hobbies', 'Baby & Kids', 'Other'];
const conditions = ['New', 'Like new', 'Good', 'Fair', 'Used'];
const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

const faqs: FAQItem[] = [
  {
    question: 'How do I create a Facebook Marketplace listing?',
    answer:
      'Enter the item title, price, condition, category and pickup location, add a clear description and up to 10 photos. WaKit gives you a live listing preview and a downloadable kit with the text and square-optimised photos. You still publish the listing inside Facebook Marketplace.',
  },
  {
    question: 'What photos work best on Facebook Marketplace?',
    answer:
      'Use bright, sharp photos taken from several angles. The first image should show the whole item. WaKit centres each photo on a 1200 × 1200 white square for a consistent pack, but you can upload the original images to Marketplace if you prefer a different crop.',
  },
  {
    question: 'Can WaKit post the listing to Facebook for me?',
    answer:
      'No. WaKit is not connected to Facebook and does not use unofficial automation. It only prepares the listing copy and photo files locally. Posting, pricing changes and buyer messages happen inside the official Facebook Marketplace interface.',
  },
  {
    question: 'How should I price a used item?',
    answer:
      'Check recent sold listings for the same model and condition, then price slightly above your walk-away number to leave room for negotiation. Mention accessories, age, defects and whether delivery is available. WaKit does not estimate market values.',
  },
  {
    question: 'Are my listing details and photos uploaded?',
    answer:
      'No. The listing text and images stay in your browser. The photo pack is resized on a local Canvas and zipped with JSZip only when you click download.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Describe the item',
    text: 'Add a specific title, price, condition, category, pickup location and the details a buyer would ask about.',
  },
  {
    name: 'Add clear photos',
    text: 'Upload up to 10 images. Put the best full-item photo first and remove blurry or duplicate shots.',
  },
  {
    name: 'Export the listing kit',
    text: 'Copy the finished listing or download a ZIP with listing.txt and square JPEG photos ready for review.',
  },
];

const makeId = () => `listing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const FacebookMarketplaceListingPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [condition, setCondition] = useState('Good');
  const [category, setCategory] = useState('Furniture');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { create } = useObjectUrls();

  const currencySymbol = currencies.find((item) => item.code === currency)?.symbol ?? '₹';
  const numericPrice = Number(price);
  const priceLabel = price.trim() && Number.isFinite(numericPrice) && numericPrice >= 0
    ? `${currencySymbol}${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(numericPrice)}`
    : 'Price not set';

  const listingText = useMemo(
    () =>
      [
        title.trim() || 'Untitled Marketplace listing',
        `${priceLabel} · ${condition} · ${category}`,
        location.trim() ? `Pickup: ${location.trim()}` : '',
        '',
        description.trim(),
      ]
        .filter((line, index) => index < 3 || line)
        .join('\n')
        .trim(),
    [title, priceLabel, condition, category, location, description],
  );

  const addPhotos = (files: File[]) => {
    setError(null);
    const remaining = 10 - photos.length;
    if (remaining <= 0) {
      setError('You can prepare up to 10 photos. Remove one before adding another.');
      return;
    }
    const accepted = files.filter((file) => file.type.startsWith('image/')).slice(0, remaining);
    if (accepted.length < files.length) {
      setError('Only the first 10 image files are included. Other files were ignored.');
    }
    const additions = accepted.map((file) => ({ id: makeId(), file, url: create(file) }));
    setPhotos((current) => [...current, ...additions]);
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  };

  const clearPhotos = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setError(null);
  };

  const generateDescription = () => {
    if (!title.trim()) {
      setError('Add an item title before generating the description.');
      return;
    }
    const item = title.trim();
    const detail = description.trim() || 'Well maintained and ready for pickup.';
    setDescription(
      `${item} available for ${priceLabel}. Condition: ${condition.toLowerCase()}. ${detail}\n\n` +
        `Category: ${category}. ${location.trim() ? `Pickup from ${location.trim()}.` : 'Message me for the exact pickup location.'} ` +
        'Message only if interested; serious buyers please.',
    );
    setError(null);
  };

  const validate = (): boolean => {
    if (!title.trim()) {
      setError('Add an item title.');
      return false;
    }
    if (!price.trim() || !Number.isFinite(Number(price)) || Number(price) < 0) {
      setError('Add a valid price (use 0 for free).');
      return false;
    }
    if (!description.trim()) {
      setError('Add a description or use the generate button.');
      return false;
    }
    return true;
  };

  const copyListing = async () => {
    if (!validate()) return;
    try {
      await copyText(listingText);
      setCopied(true);
      setError(null);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not copy the listing.');
    }
  };

  const downloadKit = async () => {
    if (!validate()) return;
    setBusy(true);
    setError(null);
    try {
      const files: Array<{ name: string; blob: Blob }> = [
        {
          name: `${safeFileName(title, 'marketplace-listing')}.txt`,
          blob: new Blob([`${listingText}\n\nCreated locally with WaKit.`], { type: 'text/plain;charset=utf-8' }),
        },
      ];

      for (const [index, photo] of photos.entries()) {
        const image = await loadImage(photo.file);
        const canvas = createCanvas(1200, 1200);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is not available in this browser.');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 1200);
        drawImageContain(ctx, image, 1200, 1200, image.naturalWidth, image.naturalHeight);
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
        files.push({
          name: `${safeFileName(title, 'marketplace-item')}-${String(index + 1).padStart(2, '0')}.jpg`,
          blob,
        });
      }

      await zipAndDownload(files, `${safeFileName(title, 'marketplace-listing')}-kit.zip`, 'marketplace listing');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not build the listing kit.');
    } finally {
      setBusy(false);
    }
  };

  const totalBytes = photos.reduce((sum, photo) => sum + photo.file.size, 0);
  const cover = photos[0]?.url;

  return (
    <ClientToolPage
      seo={{
        title: 'Facebook Marketplace Listing Maker & Photo Pack | WaKit',
        description:
          'Create a clear Facebook Marketplace listing with a live preview, copy-ready text and square-optimised photo pack. No login, upload or Facebook connection.',
        canonicalPath: '/facebook-marketplace-listing',
        keywords:
          'facebook marketplace listing generator, marketplace listing template, facebook marketplace photo resizer, marketplace description generator, sell on facebook marketplace',
      }}
      icon={ShoppingBag}
      eyebrow="Listing preview • text kit • photo ZIP"
      title={
        <>
          Facebook <span className="text-gradient-emerald">Marketplace listing</span>
        </>
      }
      description="Turn the details and photos you already have into a consistent listing pack without retyping the same description for every buyer."
      breadcrumbs={[{ name: 'Marketplace Listing' }]}
      toolName="Facebook Marketplace Listing"
      currentPath="/facebook-marketplace-listing"
      quickAnswer={{
        question: 'How do I prepare a Facebook Marketplace listing?',
        answer:
          'Add the title, price, condition, category, pickup area, description and up to 10 photos. WaKit shows a buyer-style preview, generates copy-ready text and creates a ZIP with square JPEGs. You publish the listing yourself in Facebook Marketplace.',
        facts: [
          { label: 'Photos', value: 'Up to 10' },
          { label: 'Photo size', value: '1200²' },
          { label: 'Export', value: 'TXT + ZIP' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="Marketplace buyers decide quickly. A precise title, an honest condition note, a realistic price and a full-item first photo do more than a long sales pitch."
      faqs={faqs}
      securityHeading="No Facebook login, page access or auto-posting"
      securityText="WaKit does not connect to Facebook, request cookies or publish anything. Your listing text and images stay in this tab. The preview is built with React, and the downloadable photo pack is resized on a local Canvas before being zipped on your device."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Listing details</h2>
              <p className="mt-1 text-xs text-slate-600">Specific beats clever. Say what it is, what state it is in and where it is.</p>
            </div>
            <ShoppingBag className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          <div>
            <label htmlFor="marketplace-title" className="field-label">Item title</label>
            <input id="marketplace-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} className="field" placeholder="e.g. Solid wood study table, 4 ft" />
            <p className="mt-1 text-right font-mono text-[10px] text-slate-500">{title.length}/100</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
            <div>
              <label htmlFor="marketplace-price" className="field-label">Price</label>
              <div className="flex gap-2">
                <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="field w-24 shrink-0" aria-label="Currency">
                  {currencies.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
                </select>
                <input id="marketplace-price" type="number" min="0" step="1" value={price} onChange={(event) => setPrice(event.target.value)} className="field" placeholder="0 for free" />
              </div>
            </div>
            <div>
              <label htmlFor="marketplace-condition" className="field-label">Condition</label>
              <select id="marketplace-condition" value={condition} onChange={(event) => setCondition(event.target.value)} className="field">
                {conditions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="marketplace-category" className="field-label">Category</label>
              <select id="marketplace-category" value={category} onChange={(event) => setCategory(event.target.value)} className="field">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="marketplace-location" className="field-label">Pickup area</label>
              <input id="marketplace-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={80} className="field" placeholder="Area, city" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="marketplace-description" className="field-label">Description</label>
              <button type="button" onClick={generateDescription} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Generate draft
              </button>
            </div>
            <textarea id="marketplace-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={7} maxLength={5000} className="field resize-y leading-relaxed" placeholder="Mention age, dimensions, defects, accessories and pickup preference." />
            <p className="mt-1 text-right font-mono text-[10px] text-slate-500">{description.length}/5000</p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="field-label mb-0">Photos</span>
              <span className="text-[10px] font-semibold text-slate-500">{photos.length}/10 · {formatBytes(totalBytes)}</span>
            </div>
            <div className="mt-2">
              <UploadZone
                accept="image/png,image/jpeg,image/webp"
                multiple
                onFiles={addPhotos}
                icon={ImagePlus}
                title="Add up to 10 clear photos"
                hint="JPG, PNG or WebP · first photo becomes the cover"
                files={photos.map((photo) => photo.file)}
                disabled={busy}
              />
            </div>
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <img src={photo.url} alt={`Listing photo ${index + 1}`} className="h-full w-full object-cover" />
                    {index === 0 && <span className="absolute bottom-1 left-1 rounded bg-slate-950/75 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">Cover</span>}
                    <button type="button" onClick={() => removePhoto(photo.id)} className="absolute right-1 top-1 rounded bg-slate-950/70 p-1 text-white hover:bg-red-600" aria-label={`Remove photo ${index + 1}`}>
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length > 0 && (
              <button type="button" onClick={clearPhotos} className="mt-2 text-[11px] font-semibold text-red-600 hover:underline">Remove all photos</button>
            )}
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={copyListing} className="btn-primary py-3">
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'Copied listing' : 'Copy listing'}
            </button>
            <button type="button" onClick={downloadKit} disabled={busy} className="btn-secondary py-3">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Package className="h-4 w-4" aria-hidden="true" />}
              {busy ? 'Building ZIP…' : 'Download kit ZIP'}
            </button>
          </div>
          <button type="button" onClick={() => { if (!validate()) return; downloadText(listingText, `${safeFileName(title, 'marketplace-listing')}.txt`); }} className="btn-secondary w-full py-2.5 text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Download text only
          </button>
        </section>

        <section className="space-y-4">
          <div className="glass-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Buyer-style preview</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">How the listing details read together.</p>
              </div>
              <MapPin className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[4/3] bg-slate-100">
                {cover ? (
                  <img src={cover} alt="Marketplace listing cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-emerald-900 via-emerald-700 to-slate-950 text-white">
                    <div className="text-center">
                      <ShoppingBag className="mx-auto h-10 w-10 opacity-50" aria-hidden="true" />
                      <p className="mt-2 text-xs font-semibold opacity-80">Add a cover photo</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="font-mono text-lg font-black text-slate-900">{priceLabel}</p>
                <h3 className="text-sm font-bold leading-snug text-slate-900">{title.trim() || 'Your item title'}</h3>
                <p className="text-[11px] font-medium text-slate-500">{condition} · {category}</p>
                {location.trim() && <p className="flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" aria-hidden="true" />{location}</p>}
                <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                  {description.trim() || 'Your description will appear here. Mention condition, dimensions and pickup details.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card space-y-3 p-4 sm:p-5">
            <h2 className="text-sm font-bold text-slate-900">Listing kit</h2>
            <ul className="space-y-2 text-[11px] leading-relaxed text-slate-600">
              <li className="flex items-center gap-2"><Package className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> listing.txt with the complete copy</li>
              <li className="flex items-center gap-2"><ImagePlus className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Up to 10 square JPEGs on a white 1200 × 1200 background</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> No Facebook account or page permission required</li>
            </ul>
            <p className="rounded-xl bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-800">
              Check Marketplace’s current category and photo rules before publishing. A square white-background pack is a convenience, not a guarantee of approval.
            </p>
          </div>
        </section>
      </div>
    </ClientToolPage>
  );
};
