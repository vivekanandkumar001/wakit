import { useCallback, useEffect, useState } from 'react';

/** Chrome/Edge install prompt (not part of the DOM lib typings). */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __wakitInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export type InstallPlatform = 'android' | 'ios' | 'desktop';

export type InstallOutcome = 'idle' | 'accepted' | 'dismissed' | 'unavailable';

const DISMISS_KEY = 'wakit:install-banner-dismissed-at';
const DISMISS_DAYS = 10;
const DAY_MS = 86_400_000;

export function detectInstallPlatform(): InstallPlatform {
  if (typeof navigator === 'undefined') return 'desktop';

  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  if (/iPad|iPhone|iPod/.test(ua) || touchMac) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;

  const matchesStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  return Boolean(matchesStandalone || iosStandalone);
}

/** Respect a user's dismissal for a while, but ask again later. */
export function isInstallBannerDismissed(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;

    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;

    return Date.now() - dismissedAt < DISMISS_DAYS * DAY_MS;
  } catch {
    return false;
  }
}

export function dismissInstallBanner(): void {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* Storage can be blocked; dismissal just won't persist. */
  }
}

export interface InstallPromptState {
  /** A native install prompt is queued and can be shown right now. */
  canInstall: boolean;
  isInstalled: boolean;
  isBusy: boolean;
  outcome: InstallOutcome;
  platform: InstallPlatform;
  /** iOS Safari has no prompt API, so the UI must show Add-to-Home-Screen steps. */
  isIos: boolean;
  promptInstall: () => Promise<InstallOutcome>;
}

/**
 * Captures the browser's install prompt and exposes a single install action
 * for the header button, the floating banner and the /app landing page.
 */
export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => isStandaloneDisplay());
  const [isBusy, setIsBusy] = useState(false);
  const [outcome, setOutcome] = useState<InstallOutcome>('idle');
  const [platform] = useState<InstallPlatform>(() => detectInstallPlatform());

  useEffect(() => {
    // The inline script in index.html may have captured it before mount.
    if (window.__wakitInstallPrompt) {
      setDeferredPrompt(window.__wakitInstallPrompt);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      window.__wakitInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setOutcome('idle');
    };

    const onInstallAvailable = () => {
      if (window.__wakitInstallPrompt) {
        setDeferredPrompt(window.__wakitInstallPrompt);
      }
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setOutcome('accepted');
      setDeferredPrompt(null);
      window.__wakitInstallPrompt = undefined;
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('wakit:install-available', onInstallAvailable);
    window.addEventListener('appinstalled', onInstalled);

    const media = window.matchMedia?.('(display-mode: standalone)');
    const onMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsInstalled(true);
    };
    media?.addEventListener?.('change', onMediaChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('wakit:install-available', onInstallAvailable);
      window.removeEventListener('appinstalled', onInstalled);
      media?.removeEventListener?.('change', onMediaChange);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    const promptEvent = deferredPrompt ?? window.__wakitInstallPrompt;

    if (!promptEvent) {
      setOutcome('unavailable');
      return 'unavailable';
    }

    setIsBusy(true);

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      const nextOutcome: InstallOutcome =
        choice.outcome === 'accepted' ? 'accepted' : 'dismissed';

      setOutcome(nextOutcome);
      if (nextOutcome === 'accepted') setIsInstalled(true);

      setDeferredPrompt(null);
      window.__wakitInstallPrompt = undefined;
      return nextOutcome;
    } catch {
      setOutcome('unavailable');
      return 'unavailable';
    } finally {
      setIsBusy(false);
    }
  }, [deferredPrompt]);

  return {
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    isBusy,
    outcome,
    platform,
    isIos: platform === 'ios',
    promptInstall,
  };
}
