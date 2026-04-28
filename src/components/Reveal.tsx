'use client';

import { motion } from 'framer-motion';
import { CSSProperties, ReactNode } from 'react';

interface RevealProps {
  children?: ReactNode;
  delay?: number;
  style?: CSSProperties;
  className?: string;
}

export default function Reveal({ children, delay = 0, style, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
