import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  Hash,
  Link2,
  MessageSquareText,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { ClientToolPage } from '../components/ClientToolPage';
import { UploadZone } from '../components/UploadZone';
import type { FAQItem, HowToStep } from '../components/SEOHead';
import { downloadText, formatBytes, readTextFile, safeFileName } from '../lib/clientFiles';

interface ChatMessage {
  timestamp: Date;
  sender: string;
  text: string;
}

interface ParticipantStat {
  name: string;
  count: number;
  percent: number;
}

interface ChatAnalysis {
  messages: number;
  participants: ParticipantStat[];
  firstDate: Date | null;
  lastDate: Date | null;
  activeDays: number;
  averageWords: number;
  media: number;
  links: number;
  deleted: number;
  words: Array<{ word: string; count: number }>;
  hours: number[];
  weekdays: number[];
  heatmap: number[][];
  busiestHour: number;
  busiestWeekday: number;
  daily: Array<{ label: string; count: number }>;
}

const MAX_CHAT_BYTES = 10 * 1024 * 1024;
const MAX_LINES = 250_000;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'you', 'your', 'are', 'this', 'that', 'with', 'have', 'has', 'had',
  'was', 'were', 'will', 'would', 'can', 'could', 'should', 'from', 'not', 'but', 'what',
  'when', 'where', 'who', 'why', 'how', 'all', 'any', 'our', 'out', 'get', 'got', 'just',
  'now', 'then', 'than', 'too', 'very', 'also', 'into', 'about', 'after', 'before', 'over',
  'only', 'some', 'more', 'most', 'other', 'been', 'being', 'did', 'does', 'doing', 'its',
  'it’s', 'i’m', 'don’t', 'didn’t', 'isn’t', 'won’t', 'can’t', 'ok', 'okay', 'yes', 'no',
  'hai', 'hain', 'nahi', 'nahin', 'kya', 'kaise', 'kar', 'karo', 'karna', 'mera', 'meri',
  'aap', 'tum', 'hum', 'main', 'mai', 'bhi', 'aur', 'par', 'tha', 'thi', 'the', 'ho', 'hoga',
  'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'ye', 'yeh', 'wo', 'woh', 'abhi', 'kal',
  'good', 'great', 'thanks', 'thank', 'please', 'hello', 'hi', 'hey', 'message', 'deleted',
  'omitted', 'media', 'http', 'https', 'www', 'com', 'image', 'video', 'audio', 'sticker',
  'gif', 'document', 'contact', 'this message was deleted', 'you deleted this message',
]);

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parseTimestamp = (datePart: string, timePart: string): Date | null => {
  const dateBits = datePart.split(/[\/.-]/).map((part) => Number(part));
  if (dateBits.length < 3 || dateBits.some((part) => !Number.isFinite(part))) return null;

  let day = dateBits[0];
  let month = dateBits[1];
  let year = dateBits[2];
  // WhatsApp exports use the device locale. For DD/MM exports, the second
  // component is the month; if it is clearly a day, switch to MM/DD.
  if (month > 12 && day <= 12) {
    const swap = day;
    day = month;
    month = swap;
  }
  if (year < 100) year += 2000;

  const timeBits = timePart.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!timeBits) return null;
  let hours = Number(timeBits[1]);
  const minutes = Number(timeBits[2]);
  const seconds = Number(timeBits[3] || 0);
  const meridiem = timeBits[4]?.toLowerCase();
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseChat = (raw: string): { messages: ChatMessage[]; truncated: boolean } => {
  const clean = raw
    .replace(/\u200e/g, '')
    .replace(/\u202f/g, ' ')
    .replace(/\r\n/g, '\n');
  const lines = clean.split('\n');
  const truncated = lines.length > MAX_LINES;
  const messages: ChatMessage[] = [];
  const bracketPattern =
    /^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\]\s*([^:]+):\s?(.*)$/i;
  const dashPattern =
    /^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?)\s*[-–]\s*([^:]+):\s?(.*)$/i;

  lines.slice(0, MAX_LINES).forEach((line) => {
    const match = line.match(bracketPattern) ?? line.match(dashPattern);
    if (match) {
      const timestamp = parseTimestamp(match[1], match[2]);
      const sender = match[3].trim().replace(/\s+/g, ' ').slice(0, 80);
      const text = match[4].trim();
      if (!timestamp || !sender) return;
      if (/end-to-end encrypted|messages and calls are/i.test(text)) return;
      messages.push({ timestamp, sender, text });
      return;
    }

    // Multi-line message continuation. System notices without a sender are
    // ignored rather than attached to the previous participant.
    if (messages.length > 0 && line.trim() && !/^[\d]{1,2}[\/.-]/.test(line.trim())) {
      const previous = messages[messages.length - 1];
      previous.text = `${previous.text}\n${line}`.slice(0, 12_000);
    }
  });

  return { messages, truncated };
};

const analyzeChat = (messages: ChatMessage[]): ChatAnalysis => {
  const senderCounts = new Map<string, number>();
  const wordCounts = new Map<string, number>();
  const hours = Array.from({ length: 24 }, () => 0);
  const weekdays = Array.from({ length: 7 }, () => 0);
  const heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  const byDay = new Map<string, { date: Date; count: number }>();
  let media = 0;
  let links = 0;
  let deleted = 0;
  let totalWords = 0;

  messages.forEach((message) => {
    senderCounts.set(message.sender, (senderCounts.get(message.sender) || 0) + 1);
    hours[message.timestamp.getHours()] += 1;
    weekdays[message.timestamp.getDay()] += 1;
    heatmap[message.timestamp.getDay()][message.timestamp.getHours()] += 1;

    const dayKey = `${message.timestamp.getFullYear()}-${message.timestamp.getMonth()}-${message.timestamp.getDate()}`;
    const currentDay = byDay.get(dayKey);
    byDay.set(dayKey, {
      date: currentDay?.date ?? new Date(message.timestamp.getFullYear(), message.timestamp.getMonth(), message.timestamp.getDate()),
      count: (currentDay?.count ?? 0) + 1,
    });

    if (/<media omitted>|image omitted|video omitted|audio omitted|sticker omitted|document omitted/i.test(message.text)) {
      media += 1;
    }
    if (/https?:\/\/|www\./i.test(message.text)) links += 1;
    if (/this message was deleted|you deleted this message/i.test(message.text)) deleted += 1;

    const words = message.text
      .replace(/https?:\/\/\S+|www\.\S+/gi, ' ')
      .toLowerCase()
      .match(/[\p{L}\p{N}']{3,}/gu);
    if (words) {
      totalWords += words.length;
      words.forEach((word) => {
        if (STOP_WORDS.has(word) || /^\d+$/.test(word)) return;
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      });
    }
  });

  const total = messages.length;
  const firstDate = messages.length ? messages[0].timestamp : null;
  const lastDate = messages.length ? messages[messages.length - 1].timestamp : null;
  const activeDays = byDay.size;
  const busiestHour = hours.indexOf(Math.max(...hours));
  const busiestWeekday = weekdays.indexOf(Math.max(...weekdays));

  const daily = Array.from(byDay.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-14)
    .map((item) => ({
      label: `${item.date.getDate()} ${monthNames[item.date.getMonth()]}`,
      count: item.count,
    }));

  return {
    messages: total,
    participants: Array.from(senderCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
        percent: total ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count),
    firstDate,
    lastDate,
    activeDays,
    averageWords: total ? Math.round(totalWords / total) : 0,
    media,
    links,
    deleted,
    words: Array.from(wordCounts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 28),
    hours,
    weekdays,
    heatmap,
    busiestHour,
    busiestWeekday,
    daily,
  };
};

const faqs: FAQItem[] = [
  {
    question: 'How do I export a WhatsApp chat for analysis?',
    answer:
      'Open the chat in WhatsApp, tap the three-dot menu, choose More → Export chat, and select “Without media”. Send or save the .txt file, then load it here. WaKit reads the file locally and never sends it to a server.',
  },
  {
    question: 'Does this WhatsApp chat analyzer work with group chats?',
    answer:
      'Yes. Group exports are parsed as long as the file follows the normal “date, time - sender: message” format. Participant counts, word clouds, media counts, links, busiest hour and daily activity are all calculated for groups too.',
  },
  {
    question: 'Are my private messages uploaded or stored?',
    answer:
      'No. The exported .txt is read with the browser File API, parsed in memory, and discarded when you close the tab. There is no upload endpoint, login, database, or analytics event containing message content.',
  },
  {
    question: 'What does “media omitted” mean in the report?',
    answer:
      'WhatsApp exports usually replace photos, videos, stickers and documents with a placeholder such as “<Media omitted>” when you choose “Without media”. WaKit counts those placeholders; it does not recover or download the media.',
  },
  {
    question: 'Why are some messages missing from the analysis?',
    answer:
      'Encrypted system notices, deleted messages and malformed lines are intentionally skipped. Very large exports are capped at 250,000 lines to keep the browser responsive. For the most accurate word cloud, remove stop words and short filler words from the results.',
  },
];

const steps: [HowToStep, HowToStep, HowToStep] = [
  {
    name: 'Export the chat',
    text: 'In WhatsApp choose More → Export chat → Without media, then save the .txt file to your device.',
  },
  {
    name: 'Load the text file',
    text: 'Drop the export into the analyzer. Parsing happens locally and is limited to 10 MB / 250,000 lines.',
  },
  {
    name: 'Read and download',
    text: 'Review participant share, activity patterns, top words and media counts, then save a private JSON summary if needed.',
  },
];

const number = (value: number) => value.toLocaleString('en-IN');

export const WhatsAppChatAnalyzerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [loading, setLoading] = useState(false);

  const analysis = useMemo(() => {
    if (!raw) return null;
    const parsed = parseChat(raw);
    return { ...analyzeChat(parsed.messages), truncated: parsed.truncated };
  }, [raw]);

  const handleFile = async (nextFiles: File[]) => {
    const next = nextFiles[0];
    if (!next) return;
    if (!/\.txt$/i.test(next.name) && !next.type.includes('text')) {
      setError('Please choose the .txt file exported by WhatsApp.');
      return;
    }
    if (next.size > MAX_CHAT_BYTES) {
      setError(`Chat export is ${formatBytes(next.size)}. The limit is ${formatBytes(MAX_CHAT_BYTES)}.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const text = await readTextFile(next, MAX_CHAT_BYTES);
      setFile(next);
      setRaw(text);
      setTruncated(text.split('\n').length > MAX_LINES);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not read the chat export.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRaw('');
    setError(null);
    setTruncated(false);
  };

  const downloadSummary = () => {
    if (!analysis) return;
    const summary = {
      generatedAt: new Date().toISOString(),
      sourceFile: file?.name,
      messages: analysis.messages,
      participants: analysis.participants,
      firstDate: analysis.firstDate?.toISOString(),
      lastDate: analysis.lastDate?.toISOString(),
      activeDays: analysis.activeDays,
      averageWordsPerMessage: analysis.averageWords,
      mediaPlaceholders: analysis.media,
      messagesWithLinks: analysis.links,
      deletedMessages: analysis.deleted,
      busiestHour: analysis.busiestHour,
      busiestWeekday: weekdayNames[analysis.busiestWeekday],
      topWords: analysis.words,
      dailyActivity: analysis.daily,
      note: 'Generated locally by WaKit. No chat content was uploaded.',
    };
    downloadText(
      JSON.stringify(summary, null, 2),
      `${safeFileName(file?.name || 'whatsapp-chat', 'whatsapp-chat')}-summary.json`,
      'application/json;charset=utf-8',
    );
  };

  return (
    <ClientToolPage
      seo={{
        title: 'WhatsApp Chat Analyzer — Private Chat Export Stats | WaKit',
        description:
          'Analyze an exported WhatsApp chat locally: participant stats, busiest hour, word cloud, media and link counts. No upload, login or server processing.',
        canonicalPath: '/whatsapp-chat-analyzer',
        keywords:
          'whatsapp chat analyzer, whatsapp chat export analysis, whatsapp group chat statistics, chat word cloud, private chat analyzer',
      }}
      icon={MessageSquareText}
      eyebrow="Local .txt parser • zero uploads"
      title={
        <>
          WhatsApp <span className="text-gradient-emerald">chat analyzer</span>
        </>
      }
      description="Turn a private WhatsApp export into useful patterns — participants, timings, media placeholders, links and top words — without sending the chat anywhere."
      breadcrumbs={[{ name: 'Chat Analyzer' }]}
      toolName="WhatsApp Chat Analyzer"
      currentPath="/whatsapp-chat-analyzer"
      quickAnswer={{
        question: 'How can I analyze a WhatsApp chat privately?',
        answer:
          'Export the chat as a .txt file, then load it into WaKit. The browser parses message timestamps and senders locally, builds participant and activity summaries, and never uploads the file. Only the first 250,000 lines are processed.',
        facts: [
          { label: 'Input', value: '.txt export' },
          { label: 'Max size', value: '10 MB' },
          { label: 'Server calls', value: '0' },
          { label: 'Summary', value: 'JSON' },
        ],
      }}
      steps={steps}
      intro="The analyzer is intentionally read-only: it does not connect to WhatsApp, decrypt backups, or access your account. It only reads a text file that you already exported."
      faqs={faqs}
      securityHeading="Your chat stays a local file, not a cloud document"
      securityText="WaKit reads the export with the browser File API and keeps the parsed messages in React state in this tab. When you close or reload the page, the data is gone. No message text, participant name, phone number or file name is sent to our servers or third-party APIs."
    >
      <section className="glass-card space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Load your chat export</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              WhatsApp → chat menu → More → Export chat → Without media → save the .txt file.
            </p>
          </div>
          {file && (
            <button type="button" onClick={reset} className="btn-secondary px-3 py-2 text-xs">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        <UploadZone
          accept=".txt,text/plain"
          onFiles={handleFile}
          icon={FileText}
          title="Drop the WhatsApp .txt export"
          hint="The file is parsed locally · maximum 10 MB"
          files={file ? [file] : []}
          disabled={loading}
        />

        {loading && (
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700" role="status">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Parsing the export in this tab…
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}

        {(truncated || analysis?.truncated) && (
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            This export is very large. Only the first 250,000 lines were analyzed to keep the page responsive.
          </p>
        )}
      </section>

      {!analysis ? (
        <section className="glass-card grid min-h-64 place-items-center p-8 text-center">
          <div>
            <BarChart3 className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
            <h2 className="mt-3 text-base font-bold text-slate-800">Your private dashboard will appear here</h2>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              Nothing is loaded until you choose a file. You can inspect a normal exported chat, a group export,
              or a small sample file to try the workflow.
            </p>
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Messages', value: number(analysis.messages), icon: MessageSquareText },
              { label: 'People', value: number(analysis.participants.length), icon: Users },
              { label: 'Active days', value: number(analysis.activeDays), icon: CalendarDays },
              { label: 'Avg words', value: String(analysis.averageWords), icon: Hash },
              { label: 'Media', value: number(analysis.media), icon: FileText },
              { label: 'Links', value: number(analysis.links), icon: Link2 },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-card p-4">
                  <Icon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="glass-card space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">Participant share</h2>
                <Users className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                {analysis.participants.slice(0, 12).map((person) => (
                  <div key={person.name}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-semibold text-slate-800">{person.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-slate-500">
                        {number(person.count)} · {person.percent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${Math.max(2, person.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {analysis.participants.length === 0 && (
                  <p className="text-xs text-slate-500">No participant lines were found in this export.</p>
                )}
              </div>
            </section>

            <section className="glass-card space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">When the chat is active</h2>
                <Clock3 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Busiest hour</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {analysis.busiestHour}:00 – {((analysis.busiestHour + 1) % 24)}:00
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Busiest day</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{weekdayNames[analysis.busiestWeekday]}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {analysis.daily.map((day) => {
                  const max = Math.max(...analysis.daily.map((item) => item.count), 1);
                  return (
                    <div key={day.label} className="flex items-center gap-2 text-[11px]">
                      <span className="w-14 shrink-0 text-slate-500">{day.label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(day.count / max) * 100}%` }} />
                      </div>
                      <span className="w-9 shrink-0 text-right font-mono text-slate-600">{day.count}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="glass-card space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Activity heatmap</h2>
                <p className="mt-1 text-xs text-slate-600">Message volume by weekday and hour.</p>
              </div>
              <Clock3 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[620px]">
                <div className="grid grid-cols-[42px_repeat(24,minmax(0,1fr))] gap-1">
                  <span />
                  {Array.from({ length: 24 }, (_, hour) => (
                    <span key={hour} className="text-center font-mono text-[8px] text-slate-400">
                      {hour % 3 === 0 ? hour : ''}
                    </span>
                  ))}
                  {weekdayNames.map((day, weekday) => (
                    <React.Fragment key={day}>
                      <span className="flex items-center text-[9px] font-bold uppercase tracking-wide text-slate-500">{day}</span>
{analysis.heatmap[weekday].map((count, hour) => {
                        const max = Math.max(...analysis.heatmap.flat(), 1);
                        return <span key={hour} title={`${count} messages`} className="aspect-square rounded-[2px]" style={{ backgroundColor: count ? `rgba(5,150,105,${0.12 + (count / max) * 0.88})` : '#f1f5f9' }} />;
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="glass-card space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Word cloud</h2>
                  <p className="mt-1 text-xs text-slate-600">Common words after removing stop words and links.</p>
                </div>
                <Hash className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {analysis.words.length === 0 ? (
                  <p className="text-xs text-slate-500">No words with 3+ letters were found.</p>
                ) : (
                  analysis.words.map((item, index) => {
                    const max = analysis.words[0]?.count || 1;
                    const size = 12 + Math.round((item.count / max) * 20);
                    return (
                      <span
                        key={item.word}
                        title={`${item.count} mentions`}
                        className={index % 3 === 0 ? 'font-extrabold text-emerald-700' : 'font-semibold text-slate-600'}
                        style={{ fontSize: `${size}px`, lineHeight: 1.15 }}
                      >
                        {item.word}
                      </span>
                    );
                  })
                )}
              </div>
            </section>

            <section className="glass-card space-y-3 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">Export summary</h2>
              <p className="text-xs leading-relaxed text-slate-600">
                Save the computed numbers as JSON. This summary does not include the original messages or phone numbers.
              </p>
              <button type="button" onClick={downloadSummary} className="btn-primary w-full py-3">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download private summary
              </button>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] leading-relaxed text-emerald-800">
                <p className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Nothing was uploaded
                </p>
                <p className="mt-1">
                  Your chat file is still only in this browser tab. Closing or reloading this page removes it.
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
    </ClientToolPage>
  );
};
