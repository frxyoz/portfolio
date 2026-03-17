'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { profile } from '@/data/profile';
import ScrollReveal from './ScrollReveal';
import ScrollFloat from './ScrollFloat';
import type { TimelineEntry } from '@/types';
import TypeBadge from './TypeBadge';

/* ─── Timeline variants ─────────────────────────────────────────────── */
const timelineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const timelineItemVariant: Variants = {
  hidden: { opacity: 0, x: -22 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Abilities variants ─────────────────────────────────────────────── */
const abilitiesContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const abilityItemVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function AboutSection() {
  const timelineRef  = useRef<HTMLDivElement>(null);
  const abilitiesRef = useRef<HTMLUListElement>(null);

  const timelineInView  = useInView(timelineRef,  { once: true, amount: 0.1 });
  const abilitiesInView = useInView(abilitiesRef, { once: true, amount: 0.15 });

  return (
    <section
      id="about"
      style={{
        padding: '5rem 1.5rem',
        position: 'relative',
        backgroundImage: "url('/bg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 4, 10, 0.5)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <ScrollReveal>
          <div
            style={{
              background: 'linear-gradient(150deg, #e81010 0%, #cc0000 45%, #a80000 100%)',
              borderRadius: '16px',
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 0 0 2px #770000, 0 8px 32px rgba(0,0,0,0.6)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="indicator-eye" style={{ width: '24px', height: '24px', border: '2px solid #440000' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ff4444', boxShadow: '0 0 4px #ff4444' }} />
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ffcc00', boxShadow: '0 0 4px #ffcc00' }} />
              </div>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.6rem',
                  color: '#ffcb05',
                  letterSpacing: '0.1em',
                }}
              >
                PROFILE
              </ScrollFloat>
            </div>
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.45rem', color: 'rgba(255,100,100,0.6)' }}>
              ABOUT
            </span>
          </div>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Timeline glass panel */}
          <ScrollReveal delay={120}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.05}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.5rem',
                  color: '#770000',
                  marginBottom: '28px',
                  letterSpacing: '0.12em',
                }}
              >
                TIMELINE
              </ScrollFloat>

              <motion.div
                ref={timelineRef}
                variants={timelineContainer}
                initial="hidden"
                animate={timelineInView ? 'show' : 'hidden'}
              >
                {profile.timeline.map((entry, i) => (
                  <motion.div key={i} variants={timelineItemVariant}>
                    <TimelineItem
                      entry={entry}
                      isLast={i === profile.timeline.length - 1}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Abilities glass panel */}
          <ScrollReveal delay={200}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.05}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.5rem',
                  color: '#770000',
                  marginBottom: '18px',
                  letterSpacing: '0.12em',
                }}
              >
                ABILITIES
              </ScrollFloat>

              <motion.ul
                ref={abilitiesRef}
                variants={abilitiesContainer}
                initial="hidden"
                animate={abilitiesInView ? 'show' : 'hidden'}
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                {profile.abilities.map(ability => (
                  <motion.li
                    key={ability}
                    variants={abilityItemVariant}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: '#e0e0e0',
                      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                    }}
                  >
                    <span style={{ color: '#cc0000', fontSize: '0.6rem', flexShrink: 0 }}>▶</span>
                    {ability}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

function TimelineItem({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  return (
    <div className="timeline-item" style={{ display: 'flex', gap: '18px' }}>
      {/* Spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '12px' }}>
        <div
          className="timeline-dot"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#cc0000',
            border: '2px solid rgba(204,0,0,0.25)',
            marginTop: '5px',
          }}
        />
        {!isLast && (
          <div
            className="timeline-spine"
            style={{
              width: '2px',
              flex: 1,
              background: 'rgba(204,0,0,0.4)',
              marginTop: '6px',
              minHeight: '28px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="timeline-content" style={{ paddingBottom: isLast ? 0 : '28px', flex: 1, minWidth: 0 }}>
        <div
          className="timeline-period"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.38rem',
            color: '#cc0000',
            letterSpacing: '0.06em',
            marginBottom: '7px',
          }}
        >
          {entry.period}
        </div>
        <div
          className="timeline-title"
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#f0f0f0',
            marginBottom: '2px',
            lineHeight: 1.3,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            transition: 'color 0.28s ease',
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: '#aaa',
            marginBottom: '8px',
            fontStyle: 'italic',
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          }}
        >
          {entry.orgUrl ? (
            <a href={entry.orgUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {entry.org}
            </a>
          ) : (
            entry.org
          )}
        </div>
        <div
          style={{
            fontSize: '0.88rem',
            color: '#ccc',
            lineHeight: 1.75,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          }}
        >
          {entry.desc}
        </div>
        {entry.types && entry.types.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {entry.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
          </div>
        )}
      </div>
    </div>
  );
}
