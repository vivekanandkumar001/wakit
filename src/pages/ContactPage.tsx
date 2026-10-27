import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { SEOHead } from '../components/SEOHead';
import { PageHeader } from '../components/PageHeader';
import { SITE } from '../config/site';

const SUPPORT_EMAIL = SITE.supportEmail;

export const ContactPage: React.FC = () => {
  const [prepared, setPrepared] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    // There is no backend: nothing is transmitted by this page. We hand the
    // message to the visitor's own email client, so the words on screen stay
    // true — no server receives the form contents.
    const body = [
      `From: ${name || 'Not provided'}`,
      `Reply to: ${email}`,
      '',
      message,
    ].join('\r\n');
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      `[WaKit] ${subject}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setPrepared(true);
  };

  return (
    <div className="w-full space-y-8">
      <SEOHead
        title="Contact WaKit Support | WaKit"
        description={`Report a bug, request a feature, or ask a question about WaKit. Messages open in your own email app and go to ${SUPPORT_EMAIL}.`}
        canonicalPath="/contact"
        breadcrumbs={[{ name: 'Contact' }]}
      />

      <PageHeader
        icon={Mail}
        eyebrow="Support"
        title="Contact WaKit"
        description="Bug reports, technical questions and feature suggestions are all welcome."
        breadcrumbs={[{ name: 'Contact' }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Contact form */}
        <div className="glass-card space-y-6 p-6 sm:p-8 lg:col-span-7">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MessageSquare className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <span>Write your message</span>
          </h2>

          <p className="text-xs leading-relaxed text-slate-600">
            WaKit has no contact database. This form only fills in an email draft and opens it in
            your own email app, so nothing is sent to us until you press send there.
          </p>

          {prepared ? (
            <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">Your email draft is ready</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                If nothing opened, email{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2"
                >
                  {SUPPORT_EMAIL}
                </a>{' '}
                directly. Nothing was transmitted by this page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-xs font-semibold text-slate-700">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Alex Rivers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1 block text-xs font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1 block text-xs font-semibold text-slate-700">
                  Topic / subject
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="field"
                >
                  <option value="Feedback">General feedback &amp; praise</option>
                  <option value="Bug Report">Technical bug report</option>
                  <option value="Feature Request">Feature suggestion</option>
                  <option value="AdSense / Partnership">AdSense / business inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1 block text-xs font-semibold text-slate-700">
                  Message details
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Describe your inquiry or suggestion…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="field resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5">
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Open email draft</span>
              </button>
            </form>
          )}
        </div>

        {/* Direct support */}
        <div className="glass-card flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-5">
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <span>Direct support contact</span>
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Prefer emailing us directly? Write to the shared Progeni support inbox. Include your
              browser and operating system if you are reporting a bug.
            </p>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Support email
              </span>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="block break-all font-mono text-sm font-bold text-emerald-700 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          <div className="space-y-1 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Heart className="h-3.5 w-3.5 fill-current text-red-500" aria-hidden="true" />
              <span>100% free, no account</span>
            </div>
            <p className="text-[11px] opacity-90">
              WaKit requires no registration or fees. Built for users in India, Africa and
              worldwide.
            </p>
          </div>
        </div>
      </div>

      <AdBanner type="leaderboard" />
    </div>
  );
};
