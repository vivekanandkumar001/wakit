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
import { SocialToolsHubPage } from './pages/SocialToolsHubPage';
import { WhatsAppStickerMakerPage } from './pages/WhatsAppStickerMakerPage';
import { WhatsAppChatAnalyzerPage } from './pages/WhatsAppChatAnalyzerPage';
import { WhatsAppCatalogMakerPage } from './pages/WhatsAppCatalogMakerPage';
import { WhatsAppMediaCompressorPage } from './pages/WhatsAppMediaCompressorPage';
import { InstagramGridPlannerPage } from './pages/InstagramGridPlannerPage';
import { InstagramCarouselSplitterPage } from './pages/InstagramCarouselSplitterPage';
import { InstagramCaptionStudioPage } from './pages/InstagramCaptionStudioPage';
import { InstagramReelsCoverMakerPage } from './pages/InstagramReelsCoverMakerPage';
import { FacebookCoverEventKitPage } from './pages/FacebookCoverEventKitPage';
import { FacebookAdMockupPage } from './pages/FacebookAdMockupPage';
import { FacebookMarketplaceListingPage } from './pages/FacebookMarketplaceListingPage';
import { SocialBatchResizerPage } from './pages/SocialBatchResizerPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes = [
  { path: '/', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><HomePage /></main><Footer /></> },
  { path: '/whatsapp-status-splitter', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/direct-chat-without-saving-number', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/whatsapp-qr-code-generator', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><QRGeneratorPage /></main><Footer /></> },
  { path: '/whatsapp-audio-compressor', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/social-tools', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><SocialToolsHubPage /></main><Footer /></> },
  { path: '/whatsapp-sticker-maker', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><WhatsAppStickerMakerPage /></main><Footer /></> },
  { path: '/whatsapp-chat-analyzer', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><WhatsAppChatAnalyzerPage /></main><Footer /></> },
  { path: '/whatsapp-catalog-maker', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><WhatsAppCatalogMakerPage /></main><Footer /></> },
  { path: '/whatsapp-media-compressor', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><WhatsAppMediaCompressorPage /></main><Footer /></> },
  { path: '/instagram-grid-planner', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><InstagramGridPlannerPage /></main><Footer /></> },
  { path: '/instagram-carousel-splitter', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><InstagramCarouselSplitterPage /></main><Footer /></> },
  { path: '/instagram-caption-studio', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><InstagramCaptionStudioPage /></main><Footer /></> },
  { path: '/instagram-reels-cover-maker', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><InstagramReelsCoverMakerPage /></main><Footer /></> },
  { path: '/facebook-cover-event-kit', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><FacebookCoverEventKitPage /></main><Footer /></> },
  { path: '/facebook-ad-mockup', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><FacebookAdMockupPage /></main><Footer /></> },
  { path: '/facebook-marketplace-listing', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><FacebookMarketplaceListingPage /></main><Footer /></> },
  { path: '/social-batch-resizer', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><SocialBatchResizerPage /></main><Footer /></> },
  { path: '/split-video-for-whatsapp-status', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/status-splitter', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><StatusSplitterPage /></main><Footer /></> },
  { path: '/send-whatsapp-without-saving-number', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/direct-chat', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><DirectMessagePage /></main><Footer /></> },
  { path: '/qr-generator', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><QRGeneratorPage /></main><Footer /></> },
  { path: '/compress-audio-for-whatsapp', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/audio-compressor', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><AudioCompressorPage /></main><Footer /></> },
  { path: '/about', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><AboutPage /></main><Footer /></> },
  { path: '/privacy-policy', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><PrivacyPolicyPage /></main><Footer /></> },
  { path: '/terms', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><TermsPage /></main><Footer /></> },
  { path: '/contact', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><ContactPage /></main><Footer /></> },
  { path: '*', element: <><Header /><Navbar /><main className="flex-1 w-full px-5 py-6 sm:py-10"><NotFoundPage /></main><Footer /></> },
];
