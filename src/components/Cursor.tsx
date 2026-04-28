'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const ACCENT = '#b8860b';

export default function Cursor() {
  const [ready,   setReady]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Dot tracks tightly
  const dotX = useSpring(mx, { stiffness: 2000, damping: 80, mass: 0.1 });
  const dotY = useSpring(my, { stiffness: 2000, damping: 80, mass: 0.1 });

  // Ring lags with soft spring
  const ringX = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 90, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setReady(true);

    const onMove = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };

    const onOver = (e: MouseEvent) => {
      setHovered(!!(e.target as HTMLElement).closest('a, button, [role="button"], label'));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, [mx, my]);

  if (!ready) return null;

  return (
    <>
      {/* Gold dot — tight follow */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          width: 6, height: 6, borderRadius: '50%',
          background: ACCENT,
          pointerEvents: 'none',
          translateX: '-50%', translateY: '-50%',
          x: dotX, y: dotY,
        }}
        animate={{ scale: hovered ? 3 : 1, opacity: hovered ? 0.5 : 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Ghost ring — spring lag */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9998,
          width: 30, height: 30, borderRadius: '50%',
          border: `1px solid ${ACCENT}`,
          pointerEvents: 'none',
          translateX: '-50%', translateY: '-50%',
          x: ringX, y: ringY,
        }}
        animate={{ scale: hovered ? 1.6 : 1, opacity: hovered ? 0.35 : 0.55 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  );
}
