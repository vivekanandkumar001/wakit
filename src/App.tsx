import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { StatusSplitterPage } from './pages/StatusSplitterPage';
import { DirectMessagePage } from './pages/DirectMessagePage';
import { QRGeneratorPage } from './pages/QRGeneratorPage';
import { AudioCompressorPage } from './pages/AudioCompressorPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wakit_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wakit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wakit_theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-glow-emerald selection:bg-emerald-500 selection:text-white">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Routes>
          <Route path="/" element={<StatusSplitterPage />} />
          <Route path="/split-video-for-whatsapp-status" element={<StatusSplitterPage />} />
          
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
          
          <Route path="*" element={<StatusSplitterPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
