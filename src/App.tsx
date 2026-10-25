import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { StatusSplitterPage } from './pages/StatusSplitterPage';
import { DirectMessagePage } from './pages/DirectMessagePage';
import { QRGeneratorPage } from './pages/QRGeneratorPage';
import { AudioCompressorPage } from './pages/AudioCompressorPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-canvas text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
        <div className="aurora-field">
          <div className="aurora-blob aurora-blob--emerald -left-40 -top-52 h-[34rem] w-[34rem]" />
          <div className="aurora-blob aurora-blob--teal -right-48 -top-40 h-[30rem] w-[30rem]" />
          <div className="aurora-blob aurora-blob--cyan left-1/3 top-[42rem] h-[28rem] w-[28rem] opacity-60" />
        </div>
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Canonical SEO landing routes (one per search intent) */}
          <Route path="/whatsapp-status-splitter" element={<StatusSplitterPage />} />
          <Route path="/direct-chat-without-saving-number" element={<DirectMessagePage />} />
          <Route path="/whatsapp-qr-code-generator" element={<QRGeneratorPage />} />
          <Route path="/whatsapp-audio-compressor" element={<AudioCompressorPage />} />

          {/* Legacy aliases (kept for backlinks; canonicals point to the routes above) */}
          <Route path="/split-video-for-whatsapp-status" element={<StatusSplitterPage />} />
          <Route path="/status-splitter" element={<StatusSplitterPage />} />

          <Route path="/send-whatsapp-without-saving-number" element={<DirectMessagePage />} />
          <Route path="/direct-chat" element={<DirectMessagePage />} />

          <Route path="/qr-generator" element={<QRGeneratorPage />} />

          <Route path="/compress-audio-for-whatsapp" element={<AudioCompressorPage />} />
          <Route path="/audio-compressor" element={<AudioCompressorPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
