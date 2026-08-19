'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const RANGE = 85; // px radius that activates the pull
const STRENGTH = 0.38; // fraction of distance to move

interface Props { children: ReactNode; }

export default function MagneticButton({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* Measured on enter, not on every move. `getBoundingClientRect` forces the
     browser to flush layout, and mousemove fires on the order of once per frame
     while the pointer is inside — so the old version paid for a full layout
     read every frame to learn a number that only changes on scroll or resize. */
  const rect = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.5 });

  const onEnter = () => { rect.current = ref.current?.getBoundingClientRect() ?? null; };

  const onMove = (e: React.MouseEvent) => {
    const r = rect.current;
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < RANGE) {
      const pull = (RANGE - dist) / RANGE;
      x.set(dx * pull * STRENGTH);
      y.set(dy * pull * STRENGTH);
    }
  };

  const onLeave = () => { x.set(0); y.set(0); rect.current = null; };

  /* The whole point of this component is motion that chases the hand. There is
     no reduced version of that worth keeping, so it steps aside entirely and
     the button underneath renders as itself. */
  if (reduced) return <div style={{ display: 'inline-block' }}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-block', x: sx, y: sy }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
