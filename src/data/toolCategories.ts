import { toolNavItems, type NavItem } from '../components/navItems';
import {
  crossPlatformToolItems,
  facebookToolItems,
  instagramToolItems,
  whatsappToolItems,
} from './socialTools';

export interface ToolCategoryTone {
  /** Icon tile on light surfaces. */
  tile: string;
  /** Gradient used by the category panel header. */
  panel: string;
}

export interface ToolCategory {
  key: 'whatsapp' | 'instagram' | 'facebook' | 'multi';
  label: string;
  /** Shown inside the dropdown panel. */
  description: string;
  tone: ToolCategoryTone;
  tools: NavItem[];
  /** Footer link inside the panel. */
  hubLabel: string;
  hubTo: string;
}

/** The four core WhatsApp utilities, in header order. */
const whatsappEssentials = toolNavItems.filter(
  (item) => item.to !== '/' && item.to !== '/social-tools',
);

/**
 * All 16 tools, grouped into four header categories. The homepage directory
 * keeps its own flat, searchable list — this is purely navigation.
 */
export const toolCategories: ToolCategory[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    description: 'Status clips, direct chat, QR codes, audio and creator tools.',
    tone: {
      tile: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      panel: 'from-[#022c22] to-[#065f46]',
    },
    tools: [...whatsappEssentials, ...whatsappToolItems],
    hubLabel: 'Browse all 16 tools',
    hubTo: '/',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    description: 'Plan feeds, split carousels, write captions and design covers.',
    tone: {
      tile: 'bg-rose-50 text-rose-600 ring-rose-100',
      panel: 'from-[#4c0519] to-[#9f1239]',
    },
    tools: instagramToolItems,
    hubLabel: 'Open Creator Studio hub',
    hubTo: '/social-tools',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    description: 'Covers, event kits, ad mockups and Marketplace listings.',
    tone: {
      tile: 'bg-sky-50 text-sky-700 ring-sky-100',
      panel: 'from-[#082f49] to-[#075985]',
    },
    tools: facebookToolItems,
    hubLabel: 'Open Creator Studio hub',
    hubTo: '/social-tools',
  },
  {
    key: 'multi',
    label: 'Multi-platform',
    description: 'Batch resize, UTM links and QR codes for every platform.',
    tone: {
      tile: 'bg-amber-50 text-amber-700 ring-amber-100',
      panel: 'from-[#451a03] to-[#92400e]',
    },
    tools: crossPlatformToolItems,
    hubLabel: 'Open Creator Studio hub',
    hubTo: '/social-tools',
  },
];

export const totalToolCount = toolCategories.reduce(
  (count, category) => count + category.tools.length,
  0,
);
