'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { SIGNAL, STEEL } from '@/design/tokens';

const POINTER_FINE = '(pointer: fine)';

function subscribePointerFine(onChange: () => void) {
  const mq = window.matchMedia(POINTER_FINE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** True on devices with a precise pointer. Server snapshot is false, so the
 *  custom cursor is never part of the initial HTML. */
function usePointerFine() {
  return useSyncExternalStore(
    subscribePointerFine,
    () => window.matchMedia(POINTER_FINE).matches,
    () => false,
  );
}

export default function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // The mark tracks tightly — a sign system's pointer does not float.
  const dotX = useSpring(mx, { stiffness: 2000, damping: 80, mass: 0.1 });
  const dotY = useSpring(my, { stiffness: 2000, damping: 80, mass: 0.1 });

  // The registration frame lags behind it.
  const ringX = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 110, damping: 20, mass: 0.5 });

  /* globals.css hides the system cursor only under `body.cursor-ready`. Adding
     the class here — after this component has actually mounted — means a JS
     failure or a slow hydration leaves the visitor with a real pointer rather
     than none at all. Reduced motion keeps the cursor but drops the lagging
     frame, which is the part that moves independently of the hand. */
  useEffect(() => {
    if (!fine) return;
    document.body.classList.add('cursor-ready');
    return () => document.body.classList.remove('cursor-ready');
  }, [fine]);

  useEffect(() => {
    if (!fine) return;

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
  }, [fine, mx, my]);

  if (!fine) return null;

  return (
    <>
      {/* The mark: a signal square with a steel edge, so it holds on the yellow
          field as well as on the black board. Square, not round — nothing in
          this system is a circle except a station on the route line. */}
      <motion.div
        aria-hidden
        className="oz-cursor"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          width: 8, height: 8,
          background: SIGNAL,
          boxShadow: `0 0 0 1.5px ${STEEL}`,
          pointerEvents: 'none',
          translateX: '-50%', translateY: '-50%',
          x: dotX, y: dotY,
        }}
        animate={{ scale: hovered ? 0.5 : 1 }}
        transition={reduced ? { duration: 0.1, ease: 'linear' } : { duration: 0.18, ease: 'easeOut' }}
      />

      {/* The registration frame — the corner marks a sign shop prints to align a
          panel. It closes in on the mark over anything interactive. Dropped
          entirely under reduced motion: it is the one element on the page that
          moves on its own timing while the visitor is moving. */}
      {!reduced && (
        <motion.svg
          aria-hidden
          className="oz-cursor"
          viewBox="0 0 40 40"
          width={40}
          height={40}
          style={{
            position: 'fixed', top: 0, left: 0, zIndex: 9998,
            pointerEvents: 'none',
            translateX: '-50%', translateY: '-50%',
            x: ringX, y: ringY,
          }}
          animate={{ scale: hovered ? 0.62 : 1, opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {[
            'M1 10 L1 1 L10 1',
            'M30 1 L39 1 L39 10',
            'M39 30 L39 39 L30 39',
            'M10 39 L1 39 L1 30',
          ].map(d => (
            <path key={d} d={d} fill="none" stroke={SIGNAL} strokeWidth={2} />
          ))}
        </motion.svg>
      )}
    </>
  );
}
