'use client';

import { profile } from '@/data/profile';
import Reveal from './Reveal';
import type { TimelineEntry } from '@/types';
import { motion } from 'framer-motion';
import { useScrollTilt } from '@/hooks/useScrollTilt';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ACCENT_TEXT, ACCENT_ORNAMENT as ACCENT, DISPLAY, BODY, INK, BODY_MUTED, CANVAS_ALT } from '@/design/tokens';


export default function AboutSection() {
  const tilt = useScrollTilt();
  const isMobile = useIsMobile();
  return (
    <section id="about" style={{ background: CANVAS_ALT, padding: isMobile ? '80px 24px' : '120px 48px', position: 'relative' }}>
      {/* Section-level corner ornaments — on the outer section (full-width) so left:0 hits the screen edge */}
      <span style={{ position: 'absolute', top: 96, left: 0, width: 26, height: 26, opacity: 0.4, borderTop: `1px solid ${ACCENT}`, borderLeft: `1px solid ${ACCENT}`, pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, opacity: 0.4, borderBottom: `1px solid ${ACCENT}`, borderRight: `1px solid ${ACCENT}`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Section header */}
        <Reveal style={{ marginBottom: 72 }}>
          <motion.h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, color: INK, lineHeight: 1, rotateX: tilt, transformPerspective: 800 }}>
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
        boxShadow: `0 0 0 3px ${CANVAS_ALT}, 0 0 0 4px ${ACCENT}55`,
      }} />

      <p style={{ fontFamily: BODY, fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT_TEXT, marginBottom: 6 }}>
        {item.period}
      </p>
      <h3 style={{ fontFamily: DISPLAY, fontSize: '1.65rem', fontWeight: 500, color: INK, marginBottom: 4 }}>
        {item.title}
      </h3>

      {/* Org name + logo on the same baseline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        {item.orgUrl ? (
          <a
            href={item.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            /* 24px min target (WCAG 2.5.8); the padding sits under the text so the
               underline and the logo beside it keep their alignment. */
            style={{
              fontFamily: BODY, fontSize: '0.85rem', fontWeight: 500, color: ACCENT_TEXT,
              borderBottom: `1px solid ${ACCENT}44`,
              display: 'inline-flex', alignItems: 'center', minHeight: 24,
            }}
          >
            {item.org}
          </a>
        ) : (
          <span style={{ fontFamily: BODY, fontSize: '0.85rem', fontWeight: 500, color: ACCENT_TEXT }}>{item.org}</span>
        )}
        {item.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.logo}
            /* Decorative: the org name is already the link immediately to its
               left, so alt text here reads the same word twice in a row. */
            alt=""
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            style={{ height: 22, width: 'auto', maxWidth: 72, objectFit: 'contain', display: 'block', opacity: 0.85 }}
          />
        )}
      </div>
      <p style={{ fontFamily: BODY, fontSize: '0.9rem', color: BODY_MUTED, lineHeight: 1.7, maxWidth: 620, marginBottom: 16 }}>
        {item.desc}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {item.tags.map(t => (
          <span key={t} style={{
            /* 0.78rem, not 0.68: these render at 10.9px, and they are the words
               a recruiter is actually scanning the timeline for. */
            fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.06em',
            color: ACCENT_TEXT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`,
            padding: '4px 10px', borderRadius: 2,
          }}>
            {t}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
