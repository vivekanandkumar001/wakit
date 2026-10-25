import * as React from 'react';
void React;
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
import { NotFoundPage } from './pages/NotFoundPage';

export const routes = [
  { path: '/', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><HomePage /></main><Footer /></> },
  { path: '/whatsapp-status-splitter', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/direct-chat-without-saving-number', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/whatsapp-qr-code-generator', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><QRGeneratorPage /></main><Footer /></> },
  { path: '/whatsapp-audio-compressor', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/split-video-for-whatsapp-status', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/status-splitter', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/send-whatsapp-without-saving-number', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/direct-chat', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/qr-generator', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><QRGeneratorPage /></main><Footer /></> },
  { path: '/compress-audio-for-whatsapp', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/audio-compressor', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/about', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><AboutPage /></main><Footer /></> },
  { path: '/privacy-policy', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><PrivacyPolicyPage /></main><Footer /></> },
  { path: '/terms', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><TermsPage /></main><Footer /></> },
  { path: '/contact', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><ContactPage /></main><Footer /></> },
  { path: '*', element: <><Header /><Navbar /><main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"><NotFoundPage /></main><Footer /></> },
];
