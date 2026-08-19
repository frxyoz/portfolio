'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, ReactNode } from 'react';

interface RevealProps {
  children?: ReactNode;
  delay?: number;
  style?: CSSProperties;
  className?: string;
}

/* Every section on the site enters through this. Which also means it is the
   single largest source of movement on the page, so reduced motion is decided
   here rather than in each caller.
   The 24px rise is the part that goes; the fade stays and shortens. Removing
   the entrance entirely would be worse than either: a visitor who has asked for
   less motion still needs to see that new content arrived. */
export default function Reveal({ children, delay = 0, style, className }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={
        reduced
          ? { duration: 0.28, ease: 'linear', delay: Math.min(delay, 0.12) }
          : { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }
      }
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
