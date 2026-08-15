'use client';

import { useState, useEffect } from 'react';

const IMAGES = [
    '/subject.webp',
    '/boroughs.png',
    '/noteform.png',
    '/luminary.png',
    '/hack.png',
    '/cornell.png',
    '/codingmind.webp',
];

const TOTAL   = IMAGES.length;
const MIN_MS  = 600;
const FADE_MS = 500;
const SK      = 'oz-loaded';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [fading,  setFading]  = useState(false);
    const [loaded,  setLoaded]  = useState(0);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(SK)) { setVisible(false); return; }
        } catch { /* private browsing — show screen */ }

        let isMounted    = true;
        let loadedCount  = 0;
        let minTimerDone = false;
        let imagesDone   = false;

        function tryFinish() {
            if (!isMounted || !minTimerDone || !imagesDone) return;
            setFading(true);
            setTimeout(() => {
                if (!isMounted) return;
                setVisible(false);
                try { sessionStorage.setItem(SK, '1'); } catch { /* ignore */ }
            }, FADE_MS);
        }

        const minTimer = setTimeout(() => { minTimerDone = true; tryFinish(); }, MIN_MS);

        IMAGES.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = () => {
                if (!isMounted) return;
                loadedCount++;
                setLoaded(loadedCount);
                if (loadedCount === TOTAL) { imagesDone = true; tryFinish(); }
            };
            img.src = src;
        });

        return () => { isMounted = false; clearTimeout(minTimer); };
    }, []);

    if (!visible) return null;

    const pct = (loaded / TOTAL) * 100;

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#ffffff',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                opacity: fading ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease`,
                pointerEvents: fading ? 'none' : 'all',
            }}
        >
            {/* OZ monogram */}
            <div style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                fontWeight: 300, fontStyle: 'italic',
                color: '#7a7672', letterSpacing: '-0.02em',
                lineHeight: 1, marginBottom: 32, userSelect: 'none',
            }}>
                OZ
            </div>

            {/* Progress bar */}
            <div style={{ width: 160, height: 1.5, background: '#b8860b22' }}>
                <div style={{
                    height: '100%', background: '#b8860b',
                    width: `${pct}%`, transition: 'width 0.3s ease',
                }} />
            </div>

            {/* Label */}
            <div style={{
                marginTop: 16,
                fontFamily: 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)',
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#b8860b',
                opacity: 0.5, userSelect: 'none',
            }}>
                Loading
            </div>
        </div>
    );
}
