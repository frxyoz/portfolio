'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
}

/** Whether this visitor has asked for less motion, answered in a way that
 *  survives hydration.
 *
 *  framer-motion's own `useReducedMotion` reads the media query on the very
 *  first client render, which the server had no way to know about. Any style
 *  that branches on it — a blur, a `pathLength`, a background — is then one
 *  value in the HTML and another in the client tree, and React's message for
 *  that is "this won't be patched up": the server's attribute stays on the
 *  element. On this page that left the signature as four yellow dots, because
 *  the HTML had shipped `stroke-dasharray: 0 1` and nothing ever rewrote it.
 *
 *  `useSyncExternalStore` is the sanctioned way out. React uses the server
 *  snapshot for the hydrating render, so the first client render matches the
 *  HTML exactly, then re-renders with the real answer. One extra render, no
 *  mismatch, and the reduced-motion visitor still gets the reduced treatment
 *  a frame later. */
export function useReducedMotionSafe(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false,
    );
}
