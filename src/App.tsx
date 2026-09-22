import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
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

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-dark text-slate-100 bg-glow-emerald selection:bg-emerald-500 selection:text-slate-950">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/split-video-for-whatsapp-status" element={<StatusSplitterPage />} />
          <Route path="/status-splitter" element={<StatusSplitterPage />} />
          
          <Route path="/send-whatsapp-without-saving-number" element={<DirectMessagePage />} />
          <Route path="/direct-chat" element={<DirectMessagePage />} />

          <Route path="/whatsapp-qr-code-generator" element={<QRGeneratorPage />} />
          <Route path="/qr-generator" element={<QRGeneratorPage />} />

          <Route path="/compress-audio-for-whatsapp" element={<AudioCompressorPage />} />
          <Route path="/audio-compressor" element={<AudioCompressorPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
