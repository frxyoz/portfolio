'use client';

import type { CSSProperties } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
}

export default function GlitchText({ children, className = '', style }: GlitchTextProps) {
  return (
    <span className={`glitch-text ${className}`} data-text={children} style={style}>
      {children}
    </span>
  );
}
