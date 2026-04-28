'use client';

import { profile } from '@/data/profile';
import Reveal from './Reveal';
import type { TimelineEntry } from '@/types';
import { motion } from 'framer-motion';
import { useScrollTilt } from '@/hooks/useScrollTilt';

const ACCENT  = '#b8860b';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BODY    = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';

export default function AboutSection() {
  const tilt = useScrollTilt();
  return (
    <section id="about" style={{ background: '#fafaf7', padding: '120px 48px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Section header */}
        <Reveal style={{ marginBottom: 72 }}>
          <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
            01
          </p>
          <motion.h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1, rotateX: tilt, transformPerspective: 800 }}>
            Background
          </motion.h2>
          <div style={{ width: 40, height: 1, background: ACCENT, marginTop: 16 }} />
        </Reveal>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical gold rule */}
          <div style={{
            position: 'absolute', left: 0, top: 8, bottom: 8, width: 1,
            background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT}22)`,
          }} />

          {profile.timeline.map((item, i) => (
            <TimelineItem
              key={i}
              item={item}
              index={i}
              isLast={i === profile.timeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index, isLast }: { item: TimelineEntry; index: number; isLast: boolean }) {
  const delay = (index + 1) * 0.08;
  return (
    <Reveal delay={delay} style={{
      position: 'relative',
      paddingBottom: isLast ? 0 : 56,
      paddingLeft: 36,
    }}>
      {/* Dot on the vertical rule */}
      <div style={{
        position: 'absolute', left: -4.5, top: 8,
        width: 9, height: 9, borderRadius: '50%',
        background: ACCENT,
        boxShadow: `0 0 0 3px #fafaf7, 0 0 0 4px ${ACCENT}55`,
      }} />

      <p style={{ fontFamily: BODY, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>
        {item.period}
      </p>
      <h3 style={{ fontFamily: DISPLAY, fontSize: '1.65rem', fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>
        {item.title}
      </h3>
      {item.orgUrl ? (
        <a
          href={item.orgUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: BODY, fontSize: '0.85rem', fontWeight: 500, color: ACCENT, display: 'inline-block', marginBottom: 12, borderBottom: `1px solid ${ACCENT}44` }}
        >
          {item.org}
        </a>
      ) : (
        <p style={{ fontFamily: BODY, fontSize: '0.85rem', fontWeight: 500, color: ACCENT, marginBottom: 12 }}>{item.org}</p>
      )}
      <p style={{ fontFamily: BODY, fontSize: '0.9rem', color: '#4a4540', lineHeight: 1.7, maxWidth: 620, marginBottom: 16 }}>
        {item.desc}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {item.tags.map(t => (
          <span key={t} style={{
            fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`,
            padding: '3px 10px', borderRadius: 2,
          }}>
            {t}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
