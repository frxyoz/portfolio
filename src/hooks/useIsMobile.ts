'use client';

import { useState, useEffect, useLayoutEffect } from 'react';

// useLayoutEffect fires before paint on the client, eliminating the flash of wrong layout.
// On the server (SSR) useLayoutEffect is a no-op, so we fall back to useEffect there.
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        setIsMobile(mq.matches);
        const fn = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', fn);
        return () => mq.removeEventListener('change', fn);
    }, [breakpoint]);

    return isMobile;
}
