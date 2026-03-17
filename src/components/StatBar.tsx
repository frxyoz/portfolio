'use client';

import { useEffect, useRef, useState } from 'react';
import type { TechType } from '@/types';
import { TYPE_CONFIG } from './TypeBadge';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  type?: TechType;
  showLabel?: boolean;
}

const STAT_LABELS: Record<string, string> = {
  Frontend:   'HP',
  TypeScript: 'SP',
  Backend:    'ATK',
  DevOps:     'DEF',
  Testing:    'SPD',
};

export default function StatBar({
  label,
  value,
  max = 100,
  type = 'electric',
  showLabel = true,
}: StatBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pct = Math.round((value / max) * 100);
  const typeColor = TYPE_CONFIG[type].color;

  const barColor =
    pct > 50 ? '#4dff88' :
    pct > 20 ? '#ffcb05' :
               '#cc0000';

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const statKey = STAT_LABELS[label] ?? label.slice(0, 3).toUpperCase();

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {showLabel && (
        <span
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.42rem',
            color: typeColor,
            width: '30px',
            flexShrink: 0,
          }}
        >
          {statKey}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: '8px',
          background: '#0a0f0a',
          borderRadius: '2px',
          border: '1px solid #1a3a28',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: animated ? `${pct}%` : '0%',
            background: barColor,
            borderRadius: '2px',
            transition: 'width 1.2s ease-out',
            boxShadow: `0 0 6px ${barColor}99`,
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.4rem',
            color: '#267544',
            width: '36px',
            flexShrink: 0,
            textAlign: 'right',
          }}
        >
          {value}/{max}
        </span>
      )}
    </div>
  );
}
