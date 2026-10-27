import {
  Film,
  Images,
  LayoutGrid,
  Megaphone,
  MessageSquareText,
  Scissors,
  ShoppingBag,
  SlidersHorizontal,
  Square,
  Sticker,
  Store,
  Type,
} from 'lucide-react';
import type { NavItem } from '../components/navItems';

export interface SocialToolGroup {
  name: string;
  description: string;
  tools: NavItem[];
}

export const whatsappToolItems: NavItem[] = [
  {
    to: '/whatsapp-sticker-maker',
    label: 'Sticker Maker',
    description: 'Turn photos into 512px WhatsApp stickers and export a pack',
    badge: 'Pack ZIP',
    icon: Sticker,
  },
  {
    to: '/whatsapp-chat-analyzer',
    label: 'Chat Analyzer',
    description: 'Analyze exported WhatsApp chats without uploading them',
    badge: 'Private',
    icon: MessageSquareText,
  },
  {
    to: '/whatsapp-catalog-maker',
    label: 'Catalog Maker',
    description: 'Build a shareable business catalog PDF with a chat QR',
    badge: 'PDF + QR',
    icon: Store,
  },
  {
    to: '/whatsapp-media-compressor',
    label: 'Media Compressor',
    description: 'Batch-compress photos, video and documents for chat limits',
    badge: 'Batch',
    icon: Images,
  },
];

export const instagramToolItems: NavItem[] = [
  {
    to: '/instagram-grid-planner',
    label: 'Grid Planner',
    description: 'Plan a seamless 3-column Instagram feed before posting',
    badge: 'Feed preview',
    icon: LayoutGrid,
  },
  {
    to: '/instagram-carousel-splitter',
    label: 'Carousel Splitter',
    description: 'Split one tall graphic into seamless carousel slides',
    badge: 'ZIP export',
    icon: Scissors,
  },
  {
    to: '/instagram-caption-studio',
    label: 'Caption Studio',
    description: 'Format captions, count characters and build hashtag sets',
    badge: 'No signup',
    icon: Type,
  },
  {
    to: '/instagram-reels-cover-maker',
    label: 'Reels Cover Maker',
    description: 'Design a 1080×1920 Reels cover with safe-zone guides',
    badge: '1080p',
    icon: Film,
  },
];

export const facebookToolItems: NavItem[] = [
  {
    to: '/facebook-cover-event-kit',
    label: 'Cover & Event Kit',
    description: 'Create covers, event posters and a QR invite pack',
    badge: 'Kit ZIP',
    icon: Square,
  },
  {
    to: '/facebook-ad-mockup',
    label: 'Ad Mockup',
    description: 'Preview and download feed, story and marketplace ad mockups',
    badge: '3 formats',
    icon: Megaphone,
  },
  {
    to: '/facebook-marketplace-listing',
    label: 'Marketplace Listing',
    description: 'Generate a listing preview, copy and optimized photo pack',
    badge: 'Listing kit',
    icon: ShoppingBag,
  },
];

export const crossPlatformToolItems: NavItem[] = [
  {
    to: '/social-batch-resizer',
    label: 'Batch Resizer + UTM',
    description: 'Resize images for every platform and build trackable QR links',
    badge: 'Batch + QR',
    icon: SlidersHorizontal,
  },
];

export const socialToolGroups: SocialToolGroup[] = [
  {
    name: 'WhatsApp',
    description: 'Stickers, chats, catalogs and media that stay on your device.',
    tools: whatsappToolItems,
  },
  {
    name: 'Instagram',
    description: 'Plan, split, caption and cover your next post or Reel.',
    tools: instagramToolItems,
  },
  {
    name: 'Facebook',
    description: 'Covers, ads and Marketplace listings for pages and sellers.',
    tools: facebookToolItems,
  },
  {
    name: 'Cross-platform',
    description: 'One batch workflow for every feed, story and campaign.',
    tools: crossPlatformToolItems,
  },
];

export const socialToolNavItems: NavItem[] = socialToolGroups.flatMap((group) => group.tools);
