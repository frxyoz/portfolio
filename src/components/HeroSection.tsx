'use client';

import { profile } from '@/data/profile';
import Reveal from './Reveal';

const ACCENT = '#b8860b';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BODY    = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
}

export default function HeroSection() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 48px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent 49.8%, ${ACCENT}0d 50%, transparent 50.2%),
                     linear-gradient(0deg,  transparent 49.8%, ${ACCENT}06 50%, transparent 50.2%)`,
      }} />

      {/* Vertical top line */}
      <div style={{
        position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)',
        width: 1, height: 60,
        background: `linear-gradient(to bottom, transparent, ${ACCENT}66)`,
      }} />

      <div style={{ textAlign: 'center', maxWidth: 820, position: 'relative', zIndex: 1 }}>

        {/* Avatar */}
        <Reveal delay={0.08} style={{
          width: 108, height: 108, margin: '0 auto 36px', borderRadius: '50%',
          border: `2px solid ${ACCENT}`,
          padding: 4,
          boxShadow: `0 0 0 1px ${ACCENT}33, 0 8px 32px ${ACCENT}22`,
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          />
        </Reveal>

        {/* Name line 1 */}
        <Reveal delay={0.16}>
          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(4rem, 10vw, 7.5rem)',
            fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 0.92,
            color: '#1a1a1a', marginBottom: 4,
          }}>
            Olric
          </h1>
        </Reveal>

        {/* Name line 2 */}
        <Reveal delay={0.16}>
          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(4rem, 10vw, 7.5rem)',
            fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 0.92,
            color: ACCENT, fontStyle: 'italic', marginBottom: 28,
          }}>
            Zeng
          </h1>
        </Reveal>

        {/* Gold rule */}
        <Reveal delay={0.24} style={{ width: 64, height: 1, background: ACCENT, margin: '0 auto 28px' }} />

        {/* Subtitle */}
        <Reveal delay={0.24}>
          <p style={{
            fontFamily: BODY,
            fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#6b6558', marginBottom: 18,
          }}>
            {profile.title}
          </p>
        </Reveal>

        {/* Tagline */}
        <Reveal delay={0.24}>
          <p style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1rem, 2.2vw, 1.35rem)', fontWeight: 400, fontStyle: 'italic',
            color: '#4a4540', maxWidth: 540, margin: '0 auto 52px', lineHeight: 1.55,
          }}>
            {profile.tagline}
          </p>
        </Reveal>

        {/* CTA buttons */}
        <Reveal delay={0.32} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => scrollTo('projects')}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#9a720a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
            style={{
              fontFamily: BODY, fontSize: '0.78rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#fff', background: ACCENT,
              border: `1px solid ${ACCENT}`,
              padding: '14px 36px', cursor: 'pointer', transition: 'all 0.25s ease',
            }}
          >
            View Projects
          </button>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${ACCENT}11`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            style={{
              fontFamily: BODY, fontSize: '0.78rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: ACCENT, background: 'transparent',
              border: `1px solid ${ACCENT}`,
              padding: '14px 36px', display: 'inline-block', transition: 'all 0.25s ease',
            }}
          >
            Résumé
          </a>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 44,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.45,
      }}>
        <p style={{ fontFamily: BODY, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6558' }}>
          Scroll
        </p>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
      </div>
    </section>
  );
}
