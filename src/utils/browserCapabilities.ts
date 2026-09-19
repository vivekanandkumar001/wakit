export interface BrowserCapabilityReport {
  isWasmSupported: boolean;
  isSharedArrayBufferSupported: boolean;
  isCrossOriginIsolated: boolean;
  isFullySupported: boolean;
  isMobile: boolean;
  maxFileSizeMB: number; // 60MB mobile, 150MB desktop
  warningReason?: string;
}

export function checkBrowserCapabilities(): BrowserCapabilityReport {
  if (typeof window === 'undefined') {
    return {
      isWasmSupported: false,
      isSharedArrayBufferSupported: false,
      isCrossOriginIsolated: false,
      isFullySupported: false,
      isMobile: false,
      maxFileSizeMB: 150,
      warningReason: 'Server-side rendering environment.',
    };
  }

  const isWasmSupported =
    typeof WebAssembly === 'object' &&
    typeof WebAssembly.instantiate === 'function';

  const isSharedArrayBufferSupported = typeof SharedArrayBuffer !== 'undefined';
  const isCrossOriginIsolated = Boolean(window.crossOriginIsolated);

  const isMobile =
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|FB_IAB|FBAN|Instagram|Twitter/i.test(
      navigator.userAgent
    );

  const maxFileSizeMB = isMobile ? 60 : 150;

  let warningReason: string | undefined;

  if (!isWasmSupported) {
    warningReason = 'WebAssembly is disabled or unsupported in this browser environment.';
  } else if (!isSharedArrayBufferSupported && !isCrossOriginIsolated) {
    warningReason = 'Cross-Origin Isolation (COOP/COEP) is inactive or SharedArrayBuffer is unavailable.';
  }

  const isFullySupported = isWasmSupported;

  return {
    isWasmSupported,
    isSharedArrayBufferSupported,
    isCrossOriginIsolated,
    isFullySupported,
    isMobile,
    maxFileSizeMB,
    warningReason,
  };
}
