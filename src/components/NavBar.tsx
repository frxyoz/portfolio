'use client';

import { useState, useEffect } from 'react';
import { useOverlay } from '@/contexts/OverlayContext';
import { useIsMobile } from '@/hooks/useIsMobile';

const ACCENT = '#b8860b';
const LINKS = [
  { id: 'about',    label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact' },
];

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

export default function NavBar() {
  const scrolled = useScrolled();
  const active = useActiveSection(['hero', 'about', 'projects', 'contact']);
  const { overlayOpen, closeOverlay } = useOverlay();
  const isMobile = useIsMobile();

  const frosted = scrolled || overlayOpen;

  const scrollTo = (id: string) => {
    if (overlayOpen) {
      closeOverlay();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }, 650);
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const handleBrand = () => {
    if (overlayOpen) { closeOverlay(); return; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      background: frosted ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: frosted ? 'blur(16px)' : 'none',
      borderBottom: frosted ? `1px solid ${ACCENT}22` : 'none',
      transition: 'all 0.4s ease',
      padding: isMobile ? '0 20px' : '0 48px',
      height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <button
        onClick={handleBrand}
        style={{
          fontFamily: 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
          fontSize: '1.15rem', fontWeight: 600,
          color: ACCENT, letterSpacing: '0.04em',
          background: 'none', border: 'none', cursor: 'pointer',
          minHeight: isMobile ? 44 : undefined,
          padding: isMobile ? '0 4px' : 0,
          paddingBottom: !isMobile && active === 'hero' && !overlayOpen ? 3 : 0,
          borderBottom: !isMobile && active === 'hero' && !overlayOpen
            ? `1px solid ${ACCENT}`
            : '1px solid transparent',
          transition: 'border-color 0.2s ease',
        }}
      >
        OZ
      </button>

      <div style={{ display: 'flex', gap: isMobile ? 20 : 36, alignItems: 'center' }}>
        {LINKS.map(l => {
          const isActive = active === l.id && !overlayOpen;
          return (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                fontSize: '0.82rem', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isActive ? ACCENT : '#1a1a1a',
                background: 'none', border: 'none', cursor: 'pointer',
                // Mobile: expand tap target to 44px; drop underline in favour of colour alone
                minHeight: isMobile ? 44 : undefined,
                display: isMobile ? 'flex' : undefined,
                alignItems: isMobile ? 'center' : undefined,
                paddingLeft: isMobile ? 8 : 0,
                paddingRight: isMobile ? 8 : 0,
                paddingBottom: isMobile ? 0 : 3,
                borderBottom: isMobile ? 'none' : (isActive ? `1px solid ${ACCENT}` : '1px solid transparent'),
                transition: 'all 0.2s ease',
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
