'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import FlapText from './concourse/FlapText';
import { SIGNAL, STEEL, BOARD, SIGN, TYPE } from '@/design/tokens';

/* Only the hero portrait gates the reveal — it is the one image the first
   viewport actually paints, and layout.tsx already preloads it at high priority.
   Everything else warms in the background after the curtain lifts, so a slow
   asset can delay a screenshot inside an overlay but never the site itself. */
const BLOCKING = ['/subject.webp'];

const DEFERRED = [
    '/hack.webp',
    '/cornell.webp',
    '/codingmind.webp',
    '/sitefit.webp',
    '/boroughs.webp',
    '/noteform.webp',
    '/luminary.webp',
];

const TOTAL = BLOCKING.length;
const MIN_MS = 700;
/* Hard ceiling. Without it a single stalled request holds the whole site
   behind a blank screen with no way out. */
const MAX_MS = 2500;
const FADE_MS = 450;
const SK = 'oz-loaded';

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
    const [fading, setFading] = useState(false);
    const [loaded, setLoaded] = useState(0);
    // Flipped one frame after mount so the bar has a value to animate away from.
    const [crept, setCrept] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setCrept(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (reduced) { setVisible(false); DEFERRED.forEach(warm); return; }
        try {
            if (sessionStorage.getItem(SK)) { setVisible(false); return; }
        } catch { /* private browsing — show screen */ }

        let isMounted = true;
        let loadedCount = 0;
        let minTimerDone = false;
        let imagesDone = false;
        let finished = false;

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
        /* The board wakes up before the terminal does: one row turning over on
           an otherwise dead board, which is exactly what the site opens on. */
        <div
            aria-hidden="true"
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: BOARD,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 26,
                fontFamily: SIGN,
                opacity: fading ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease`,
                pointerEvents: fading ? 'none' : 'all',
            }}
        >
            <FlapText
                text="Olric Zeng"
                stagger={2}
                style={{
                    /* One fixed step rather than a fluid clamp: the curtain shows
                       one short string for well under a second, and a size that
                       grows with the viewport buys nothing a reader ever notices. */
                    fontSize: TYPE.SUBHEAD,
                    fontWeight: 800, fontStretch: '104%',
                    letterSpacing: '0.02em',
                }}
            />

            {/* The floor indicator, a signal bar seated in a steel channel. */}
            <div style={{ width: 200, height: 6, background: STEEL, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', background: SIGNAL,
                    width: '100%', transformOrigin: 'left center',
                    transform: `scaleX(${done ? 1 : crept ? 0.7 : 0.04})`,
                    transition: `transform ${done ? 240 : MIN_MS}ms cubic-bezier(.22, 1, .36, 1)`,
                }} />
            </div>
        </div>
    );
}
