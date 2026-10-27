import { useCallback, useEffect, useRef } from 'react';

/** Creates object URLs and guarantees they are revoked on page unmount. */
export const useObjectUrls = () => {
  const urlsRef = useRef<Set<string>>(new Set());

  const create = useCallback((blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeAll = useCallback(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current.clear();
  }, []);

  useEffect(() => revokeAll, [revokeAll]);

  return { create, revokeAll };
};
