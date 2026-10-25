import {
  LayoutGrid,
  Scissors,
  Send,
  QrCode,
  Mic,
  Info,
  Mail,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  description: string;
  badge: string;
  icon: LucideIcon;
}

export const toolNavItems: NavItem[] = [
  {
    to: '/',
    label: 'All Tools',
    description: 'Every WaKit utility on one dashboard',
    badge: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    to: '/whatsapp-status-splitter',
    label: 'Status Splitter',
    description: 'Cut long videos into exact 30s status clips',
    badge: 'Lossless',
    icon: Scissors,
  },
  {
    to: '/direct-chat-without-saving-number',
    label: 'Direct Chat',
    description: 'Message any number without saving it',
    badge: 'No contact',
    icon: Send,
  },
  {
    to: '/whatsapp-qr-code-generator',
    label: 'QR Builder',
    description: 'Scan-to-chat QR codes for print & web',
    badge: 'PNG + SVG',
    icon: QrCode,
  },
  {
    to: '/whatsapp-audio-compressor',
    label: 'Audio Compressor',
    description: 'Shrink audio under the 16MB WhatsApp limit',
    badge: '< 16MB',
    icon: Mic,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    to: '/about',
    label: 'About',
    description: 'How the zero-server architecture works',
    badge: 'Architecture',
    icon: Info,
  },
  {
    to: '/contact',
    label: 'Contact',
    description: 'Questions, feedback and bug reports',
    badge: 'Support',
    icon: Mail,
  },
  {
    to: '/privacy-policy',
    label: 'Privacy Policy',
    description: 'No accounts, no uploads, no tracking',
    badge: 'Private',
    icon: ShieldCheck,
  },
];
