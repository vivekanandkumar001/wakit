/**
 * Single source of truth for brand and deployment constants.
 * Override the origin/date at build time with VITE_SITE_URL and
 * VITE_SITE_UPDATED instead of editing components.
 */
const DEFAULT_ORIGIN = 'https://wakit.progeni.live';

const envOrigin = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
const envUpdated = (import.meta.env.VITE_SITE_UPDATED as string | undefined)?.trim();

const buildDate = new Date().toISOString().slice(0, 10);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatUpdated(iso: string): string {
  const [year, month] = iso.split('-');
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${MONTHS[monthIndex]} ${year}`;
}

export const SITE = {
  name: 'WaKit',
  tagline: 'Private creator tools in your browser',
  supportEmail: 'support@progeni.live',
  origin: (envOrigin || DEFAULT_ORIGIN).replace(/\/+$/, ''),
  updated: envUpdated || buildDate,
  get updatedLabel() {
    return formatUpdated(this.updated);
  },
} as const;
