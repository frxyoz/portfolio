'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import TunnelScene from './concourse/TunnelScene';
import { SIGN } from '@/design/tokens';

/* Only the hero portrait gates the reveal — it is the one image the first
   viewport actually paints, and layout.tsx already preloads it at high priority.
   It is also the one image a phone never sees: the portrait stands in the
   desktop field only, so below the rail's breakpoint there is nothing to wait
   for and the curtain runs on its floor alone. */
const BLOCKING = ['/subject.webp'];
const BLOCKING_MQ = '(min-width: 768px)';
/** Matches the hero's srcset, so warming hits the candidate the page will ask
 *  for rather than pulling the 863px original alongside it. */
const BLOCKING_SRCSET = '/subject-380.webp 380w, /subject-760.webp 760w, /subject.webp 863w';
const BLOCKING_SIZES = '380px';

/* Everything the site paints somewhere other than the first viewport. Luminary
   and Boroughs are deliberately absent: both projects carry a demo video, which
   the sheet renders instead of the screenshot, so warming their stills spent
   165 KB on two images no visitor has ever been shown. */
const DEFERRED = [
    '/hack.webp',
    '/cornell.webp',
    '/codingmind.webp',
    '/sitefit.webp',
    '/noteform-640.webp',
];

const TOTAL = BLOCKING.length;
const MIN_MS = 650;
/* Hard ceiling. Without it a single stalled request holds the whole site
   behind a blank screen with no way out. */
const MAX_MS = 1200;
const FADE_MS = 500;
const SK = 'oz-loaded';

function warm(src: string) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
}

function warmHero(onSettled: () => void) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = onSettled;
    img.sizes = BLOCKING_SIZES;
    img.srcset = BLOCKING_SRCSET;
    img.src = '/subject.webp';
    return () => { img.onload = img.onerror = null; };
}

function revealHero(animate: boolean) {
    const root = document.documentElement;
    if (animate) {
        root.dataset.arrival = 'hero';
        const timer = window.setTimeout(() => { delete root.dataset.arrival; }, 1000);
        window.dispatchEvent(new Event('oz:arrival'));
        return () => {
            window.clearTimeout(timer);
            if (root.dataset.arrival === 'hero') delete root.dataset.arrival;
        };
    } else {
        delete root.dataset.arrival;
    }
    window.dispatchEvent(new Event('oz:arrival'));
    return () => {};
}

export default function LoadingScreen() {
    /* The curtain is a held beat before the site arrives — it exists to make an
       entrance, and an entrance is exactly what this setting asks for less of.
       Under reduced motion it does not run at all, which also hands that visitor
       the fastest version of the site. */
    const reduced = useReducedMotion();
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);
    const dismissed = useRef(false);
    const cancelIntro = useRef<() => void>(() => {});
    const cancelReveal = useRef<() => void>(() => {});
    const reveal = useCallback((animate: boolean) => {
        cancelReveal.current();
        cancelReveal.current = revealHero(animate);
    }, []);

    useEffect(() => () => {
        cancelIntro.current();
        cancelReveal.current();
    }, []);

    useEffect(() => {
        if (reduced) { setVisible(false); reveal(false); DEFERRED.forEach(warm); return; }
        try {
            if (sessionStorage.getItem(SK)) { setVisible(false); reveal(false); return; }
        } catch { /* private browsing — show screen */ }

        let isMounted = true;
        let loadedCount = 0;
        let minTimerDone = false;
        let imagesDone = false;
        let finished = false;
        let fadeTimer: ReturnType<typeof setTimeout> | undefined;
        let idleTimer: number | undefined;
        let idleFallback: ReturnType<typeof setTimeout> | undefined;
        let cancelHero: (() => void) | undefined;

        function finish() {
            if (!isMounted || finished || dismissed.current) return;
            finished = true;
            setFading(true);
            fadeTimer = setTimeout(() => {
                if (!isMounted || dismissed.current) return;
                setVisible(false);
                reveal(true);
                try { sessionStorage.setItem(SK, '1'); } catch { /* ignore */ }
                // Curtain is gone: pull the rest in on idle time, never before.
                const warmDeferred = () => { if (isMounted) DEFERRED.forEach(warm); };
                if (window.requestIdleCallback) idleTimer = window.requestIdleCallback(warmDeferred);
                else idleFallback = setTimeout(warmDeferred, 200);
            }, FADE_MS);
        }

        function tryFinish() {
            if (!minTimerDone || !imagesDone) return;
            finish();
        }

        const minTimer = setTimeout(() => { minTimerDone = true; tryFinish(); }, MIN_MS);
        const maxTimer = setTimeout(finish, MAX_MS);

        /* A phone gets no portrait, so it waits on nothing and the floor is the
           whole curtain. Waiting on a desktop-only image there was a 126 KB
           download standing between the visitor and the site. */
        if (!window.matchMedia(BLOCKING_MQ).matches) {
            imagesDone = true;
            tryFinish();
        } else {
            cancelHero = warmHero(() => {
                if (!isMounted) return;
                loadedCount++;
                if (loadedCount === TOTAL) { imagesDone = true; tryFinish(); }
            });
        }

        const cleanup = () => {
            isMounted = false;
            clearTimeout(minTimer);
            clearTimeout(maxTimer);
            clearTimeout(fadeTimer);
            clearTimeout(idleFallback);
            if (idleTimer !== undefined) window.cancelIdleCallback(idleTimer);
            cancelHero?.();
        };
        cancelIntro.current = cleanup;
        return cleanup;
    }, [reduced, reveal]);

    if (!visible) return null;

    return (
        <div className={`oz-curtain oz-tunnel${fading ? ' oz-tunnel-leaving' : ''}`}
            style={{ fontFamily: SIGN }}>
            <TunnelScene leaving={fading} departureMs={FADE_MS} />
            <div className="oz-tunnel-caption" aria-hidden="true">
                <span className="oz-tunnel-name">Olric Zeng</span>
            </div>
            <button type="button" className="oz-tunnel-skip" onClick={() => {
                dismissed.current = true;
                cancelIntro.current();
                setVisible(false);
                reveal(false);
                try { sessionStorage.setItem(SK, '1'); } catch { /* ignore */ }
                DEFERRED.forEach(warm);
            }}>Skip intro</button>
        </div>
    );
}
