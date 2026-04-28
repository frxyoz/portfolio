'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const RANGE = 85; // px radius that activates the pull
const STRENGTH = 0.38; // fraction of distance to move

interface Props { children: ReactNode; }

export default function MagneticButton({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < RANGE) {
      const pull = (RANGE - dist) / RANGE;
      x.set(dx * pull * STRENGTH);
      y.set(dy * pull * STRENGTH);
    }
  };

  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-block', x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
