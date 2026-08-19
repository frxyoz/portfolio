'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ACCENT_TEXT, ACCENT_ORNAMENT, INK_SOFT, DISPLAY, BODY, CANVAS } from '@/design/tokens';

/* Only the hero portrait gates the reveal — it is the one image the first
   viewport actually paints, and layout.tsx already preloads it at high priority.
   Everything else warms in the background after the curtain lifts, so a slow
   asset can delay a screenshot inside an overlay but never the site itself. */
const BLOCKING = ['/subject.webp'];

const DEFERRED = [
    '/hack.webp',
    '/cornell.webp',
    '/codingmind.webp',
    '/boroughs.webp',
    '/noteform.webp',
    '/luminary.webp',
];

const TOTAL   = BLOCKING.length;
const MIN_MS  = 600;
/* Hard ceiling. Without it a single stalled request holds the whole site
   behind a white screen with no way out. */
const MAX_MS  = 2500;
const FADE_MS = 500;
const SK      = 'oz-loaded';

function warm(src: string) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
}

export default function LoadingScreen() {
    /* The curtain is a held beat before the site arrives — it exists to make an
       entrance, and an entrance is exactly what this setting asks for less of.
       Under reduced motion it does not run at all, which also hands that visitor
       the fastest version of the site. */
    const reduced = useReducedMotion();
    const [visible, setVisible] = useState(true);
    const [fading,  setFading]  = useState(false);
    const [loaded,  setLoaded]  = useState(0);
    // Flipped one frame after mount so the bar has a value to animate away from.
    const [crept,   setCrept]   = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setCrept(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (reduced) { setVisible(false); DEFERRED.forEach(warm); return; }
        try {
            if (sessionStorage.getItem(SK)) { setVisible(false); return; }
        } catch { /* private browsing — show screen */ }

        let isMounted    = true;
        let loadedCount  = 0;
        let minTimerDone = false;
        let imagesDone   = false;
        let finished     = false;

        function finish() {
            if (!isMounted || finished) return;
            finished = true;
            setFading(true);
            setTimeout(() => {
                if (!isMounted) return;
                setVisible(false);
                try { sessionStorage.setItem(SK, '1'); } catch { /* ignore */ }
                // Curtain is gone: pull the rest in on idle time, never before.
                const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 200));
                idle(() => DEFERRED.forEach(warm));
            }, FADE_MS);
        }

        function tryFinish() {
            if (!minTimerDone || !imagesDone) return;
            finish();
        }

        const minTimer = setTimeout(() => { minTimerDone = true; tryFinish(); }, MIN_MS);
        const maxTimer = setTimeout(finish, MAX_MS);

        BLOCKING.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = () => {
                if (!isMounted) return;
                loadedCount++;
                setLoaded(loadedCount);
                if (loadedCount === TOTAL) { imagesDone = true; tryFinish(); }
            };
            img.src = src;
        });

        return () => { isMounted = false; clearTimeout(minTimer); clearTimeout(maxTimer); };
    }, [reduced]);

    if (!visible) return null;

    /* The bar tracks the floor, not the fetch: one blocking image would snap it
       0 to 100 in a single frame. It runs the MIN_MS floor on an exponential
       ease-out, then completes the moment the hero actually lands. */
    const done = loaded >= TOTAL || fading;

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: CANVAS,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                opacity: fading ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease`,
                pointerEvents: fading ? 'none' : 'all',
            }}
        >
            {/* OZ monogram */}
            <div style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                fontWeight: 300, fontStyle: 'italic',
                color: INK_SOFT, letterSpacing: '-0.02em',
                lineHeight: 1, marginBottom: 32, userSelect: 'none',
            }}>
                OZ
            </div>

            {/* Progress bar — scaleX rather than width, so the fill composites
                instead of forcing layout on every frame of the reveal. */}
            <div style={{ width: 160, height: 1.5, background: `${ACCENT_ORNAMENT}22`, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', background: ACCENT_ORNAMENT,
                    width: '100%', transformOrigin: 'left center',
                    transform: `scaleX(${done ? 1 : crept ? 0.72 : 0.04})`,
                    transition: `transform ${done ? 260 : MIN_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                }} />
            </div>

            {/* Label */}
            <div style={{
                marginTop: 16,
                fontFamily: BODY,
                fontSize: '0.75rem', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: ACCENT_TEXT,
                opacity: 0.75, userSelect: 'none',
            }}>
                Loading
            </div>
        </div>
    );
}
