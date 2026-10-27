import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Hash,
  List,
  Sparkles,
  Type,
  Wand2,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import { copyText, downloadText } from '../lib/clientFiles';

const CAPTION_LIMIT = 2200;

const niches = [
  { id: 'general', label: 'General creator', tags: ['contentcreator', 'creatoreconomy', 'socialmedia', 'instagramtips', 'contentideas', 'digitalcreator'] },
  { id: 'business', label: 'Small business', tags: ['smallbusiness', 'supportlocal', 'shoplocal', 'businessowner', 'madeinindia', 'smallbiz'] },
  { id: 'travel', label: 'Travel', tags: ['travelgram', 'wanderlust', 'travelindia', 'incredibleindia', 'traveldiaries', 'exploremore'] },
  { id: 'food', label: 'Food', tags: ['foodie', 'foodphotography', 'foodblogger', 'indianfood', 'homecooking', 'foodstagram'] },
  { id: 'fashion', label: 'Fashion', tags: ['fashionstyle', 'ootd', 'styleinspo', 'fashionblogger', 'outfitideas', 'streetstyle'] },
  { id: 'fitness', label: 'Fitness', tags: ['fitnessmotivation', 'fitfam', 'workoutroutine', 'healthylifestyle', 'gymlife', 'fitnessindia'] },
  { id: 'beauty', label: 'Beauty', tags: ['beautytips', 'skincareroutine', 'makeuplover', 'beautycreator', 'selfcare', 'glowup'] },
  { id: 'photography', label: 'Photography', tags: ['photography', 'photooftheday', 'portraitphotography', 'photographytips', 'visualstorytelling', 'shotonphone'] },
];

const bold = (text: string) =>
  text.replace(/[A-Za-z0-9]/g, (character) => {
    const code = character.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + code - 97);
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + code - 48);
    return character;
  });

const italic = (text: string) =>
  text.replace(/[A-Za-z]/g, (character) => {
    const code = character.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d608 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d622 + code - 97);
    return character;
  });

const faqs: FAQItem[] = [
  {
    question: 'How do I format an Instagram caption with bold text?',
    answer:
      'Instagram does not support native bold text. WaKit converts normal letters to Unicode bold characters that look bold in the caption. Select the text you want to change, click Bold, then copy the formatted caption into Instagram.',
  },
  {
    question: 'How many hashtags should I use on Instagram?',
    answer:
      'There is no single perfect number. Instagram allows up to 30 hashtags per post, but a focused set of 5–15 relevant tags is often more useful than 30 generic ones. Use the generator as a starting point, then remove tags that do not describe the post.',
  },
  {
    question: 'Will formatted Unicode text work in every app?',
    answer:
      'Unicode bold and italic characters display in most modern apps, including Instagram and Facebook. Some screen readers read them awkwardly, so use them for emphasis rather than entire paragraphs.',
  },
  {
    question: 'Why does my caption show fewer than 2,200 characters?',
    answer:
      'Instagram’s caption limit is 2,200 characters, including spaces, line breaks and emoji. WaKit counts the formatted text in real time and warns you before you exceed the limit.',
  },
  {
    question: 'Is my caption or hashtag data uploaded?',
    answer:
      'No. The editor, Unicode conversion, hashtag generator and clipboard actions all run in your browser. Nothing is saved on a server unless you copy it into another service yourself.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Write the caption',
    text: 'Type or paste your caption, then use bold, italic, bullets and spacing tools to make it easier to scan.',
  },
  {
    name: 'Build a hashtag set',
    text: 'Choose a niche, add a topic, and generate a focused list of up to 30 relevant hashtags.',
  },
  {
    name: 'Check and copy',
    text: 'Review the character count and preview, then copy the caption or download a text file for your content calendar.',
  },
];

const makeHashtags = (topic: string, nicheId: string, count: number): string[] => {
  const niche = niches.find((item) => item.id === nicheId) ?? niches[0];
  const slug = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeTopic = slug || 'creator';
  const variants = [
    safeTopic,
    `${safeTopic}love`,
    `${safeTopic}life`,
    `${safeTopic}daily`,
    `${safeTopic}inspo`,
    `${safeTopic}ideas`,
    `${safeTopic}india`,
    `${safeTopic}tips`,
    `${safeTopic}community`,
    `${safeTopic}2026`,
    `best${safeTopic}`,
    `${safeTopic}reels`,
  ];
  const all = [...variants, ...niche.tags, 'reelsindia', 'explorepage', 'trendingreels'];
  return Array.from(new Set(all.map((tag) => tag.replace(/[^a-z0-9]/gi, '').toLowerCase()).filter(Boolean))).slice(0, count);
};

export const InstagramCaptionStudioPage: React.FC = () => {
  const [caption, setCaption] = useState(
    'Your first line should stop the scroll.\n\nAdd one clear idea, a little context, and a reason to save this post.\n\nSave this for your next post.',
  );
  const [topic, setTopic] = useState('small business');
  const [niche, setNiche] = useState('business');
  const [count, setCount] = useState(15);
  const [hashtags, setHashtags] = useState<string[]>(() => makeHashtags('small business', 'business', 15));
  const [hooks, setHooks] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = useMemo(() => (caption.trim() ? caption.trim().split(/\s+/).length : 0), [caption]);
  const hashtagLine = hashtags.map((tag) => `#${tag}`).join(' ');
  const combined = `${caption.trim()}\n\n${hashtagLine}`.trim();
  const combinedLength = Array.from(combined).length;

  const transform = (mode: 'bold' | 'italic') => {
    setCaption((current) => (mode === 'bold' ? bold(current) : italic(current)));
  };

  const addBullets = () => {
    setCaption((current) =>
      current
        .split('\n')
        .map((line) => (line.trim() ? `• ${line.replace(/^[•\-*]\s*/, '').trim()}` : line))
        .join('\n'),
    );
  };

  const cleanSpacing = () => {
    setCaption((current) => current.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim());
  };

  const generateTags = () => {
    setHashtags(makeHashtags(topic, niche, count));
  };

  const generateHooks = () => {
    const subject = topic.trim() || 'your next post';
    setHooks([
      `Stop scrolling if you care about ${subject}.`,
      `3 things nobody tells you about ${subject}.`,
      `${subject} changed how I work — here is what I learned.`,
      `Save this ${subject} checklist for later.`,
      `The easiest ${subject} tip you will use this week.`,
    ]);
  };

  const copy = async (value: string, key: string) => {
    try {
      await copyText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not copy the text.');
    }
  };

  const appendTags = () => {
    if (combinedLength > CAPTION_LIMIT) {
      setError(`Caption plus hashtags is ${combinedLength} characters. Instagram allows ${CAPTION_LIMIT}.`);
      return;
    }
    setCaption((current) => `${current.trim()}\n\n${hashtagLine}`.trim());
    setError(null);
  };

  return (
    <ClientToolPage
      seo={{
        title: 'Instagram Caption Studio — Formatter & Hashtag Generator | WaKit',
        description:
          'Format Instagram captions with bold and italic text, count characters, generate focused hashtag sets and copy hooks. Free, private and browser-only.',
        canonicalPath: '/instagram-caption-studio',
        keywords:
          'instagram caption formatter, bold text for instagram, instagram hashtag generator, caption character counter, instagram hooks generator',
      }}
      icon={Type}
      eyebrow="Formatter • hooks • hashtags"
      title={
        <>
          Instagram <span className="text-gradient-emerald">caption studio</span>
        </>
      }
      description="Write a caption that is easy to scan, add just enough formatting and build a focused hashtag set without another subscription."
      breadcrumbs={[{ name: 'Caption Studio' }]}
      toolName="Instagram Caption Studio"
      currentPath="/instagram-caption-studio"
      quickAnswer={{
        question: 'How can I format and improve an Instagram caption for free?',
        answer:
          'Write or paste your caption into WaKit, apply Unicode bold or italic formatting, add bullets, check the 2,200-character limit and generate a niche hashtag set. Everything is copied locally, with no account or server upload.',
        facts: [
          { label: 'Limit', value: '2,200 chars' },
          { label: 'Hashtags', value: 'Up to 30' },
          { label: 'Formatting', value: 'Unicode' },
          { label: 'Uploads', value: '0' },
        ],
      }}
      steps={steps}
      intro="Formatting cannot rescue a vague caption, so start with one clear idea. Use the tools here only to make the first line easier to read and the hashtags more specific."
      faqs={faqs}
      securityHeading="A local writing desk for your social captions"
      securityText="Your caption, niche and topic are kept in React state in this tab. Unicode conversion and hashtag generation are simple local functions. Copying uses the browser clipboard API, and downloading creates a text file on your device. No draft is stored by WaKit."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Caption editor</h2>
              <p className="mt-1 text-xs text-slate-600">Unicode formatting works in Instagram, Facebook and most apps.</p>
            </div>
            <Type className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            rows={11}
            className="field resize-y font-normal leading-relaxed"
            aria-label="Instagram caption"
            placeholder="Write your caption…"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => transform('bold')} className="btn-secondary px-3 py-2 text-xs">
              <strong>B</strong> Bold
            </button>
            <button type="button" onClick={() => transform('italic')} className="btn-secondary px-3 py-2 text-xs">
              <em>I</em> Italic
            </button>
            <button type="button" onClick={addBullets} className="btn-secondary px-3 py-2 text-xs">
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              Bullets
            </button>
            <button type="button" onClick={cleanSpacing} className="btn-secondary px-3 py-2 text-xs">
              <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clean spacing
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Characters</p>
              <p className={`mt-1 font-mono text-sm font-bold ${Array.from(caption).length > CAPTION_LIMIT ? 'text-red-600' : 'text-slate-900'}`}>
                {Array.from(caption).length} / {CAPTION_LIMIT}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Words</p>
              <p className="mt-1 font-mono text-sm font-bold text-slate-900">{wordCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">With tags</p>
              <p className={`mt-1 font-mono text-sm font-bold ${combinedLength > CAPTION_LIMIT ? 'text-red-600' : 'text-slate-900'}`}>
                {combinedLength}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Preview</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700">{caption || 'Your caption preview appears here.'}</p>
            {hashtags.length > 0 && <p className="mt-2 break-words text-xs font-semibold leading-relaxed text-emerald-700">{hashtagLine}</p>}
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => copy(caption, 'caption')} className="btn-primary flex-1 py-3">
              {copied === 'caption' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied === 'caption' ? 'Copied caption' : 'Copy caption'}
            </button>
            <button type="button" onClick={() => downloadText(caption, 'instagram-caption.txt')} className="btn-secondary flex-1 py-3">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download .txt
            </button>
          </div>
        </section>

        <div className="space-y-6">
          <section className="glass-card space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hashtag builder</h2>
                <p className="mt-1 text-xs text-slate-600">Topic relevance beats random reach.</p>
              </div>
              <Hash className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="caption-topic" className="field-label">Post topic</label>
                <input id="caption-topic" value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={40} className="field" placeholder="e.g. handmade candles" />
              </div>
              <div>
                <label htmlFor="caption-niche" className="field-label">Niche</label>
                <select id="caption-niche" value={niche} onChange={(event) => setNiche(event.target.value)} className="field">
                  {niches.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="field-label mb-0">How many hashtags?</span>
                <span className="font-mono text-xs font-bold text-emerald-700">{count}</span>
              </div>
              <input type="range" min="5" max="30" step="5" value={count} onChange={(event) => setCount(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" />
            </div>

            <button type="button" onClick={generateTags} className="btn-primary w-full py-3">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate hashtag set
            </button>

            <div className="flex min-h-24 flex-wrap content-start gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              {hashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setHashtags((current) => current.filter((item) => item !== tag))}
                  className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
                  title="Click to remove"
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => copy(hashtagLine, 'tags')} className="btn-secondary flex-1 py-2.5 text-xs">
                {copied === 'tags' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied === 'tags' ? 'Copied' : 'Copy hashtags'}
              </button>
              <button type="button" onClick={appendTags} className="btn-secondary flex-1 py-2.5 text-xs">
                Append to caption
              </button>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Remove tags that do not describe the actual post. Repeating the same 30 tags on every post is not a strategy.
            </p>
          </section>

          <section className="glass-card space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hook starters</h2>
                <p className="mt-1 text-xs text-slate-600">Local templates based on your topic.</p>
              </div>
              <Wand2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>

            <button type="button" onClick={generateHooks} className="btn-secondary w-full py-2.5 text-xs">
              Generate 5 hooks
            </button>

            {hooks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Generate a few first-line ideas, then rewrite them in your own voice.
              </p>
            ) : (
              <div className="space-y-2">
                {hooks.map((hook) => (
                  <button
                    key={hook}
                    type="button"
                    onClick={() => copy(hook, hook)}
                    className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs leading-relaxed text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <span>{hook}</span>
                    {copied === hook ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" /> : <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-emerald-600" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </ClientToolPage>
  );
};
