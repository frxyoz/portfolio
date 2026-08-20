'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/contexts/OverlayContext';
import Pictogram from './concourse/Pictogram';
import {
  SIGNAL, STEEL, STEEL_SOFT, BOARD_INK, BOARD_INK_SOFT, SIGN, EASE_OUT, TYPE,} from '@/design/tokens';

/** The rail's height, exported so the hero and the scroll offsets agree on it
 *  rather than each carrying their own copy of the number. */
export const RAIL_H = 60;

const LINKS = [
  { id: 'about', label: 'Background' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

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

/* Every board in every terminal carries the time. It is the detail that tells
   you the thing in front of you is live rather than printed, and it costs one
   interval. Rendered empty on the server and filled after mount, because a
   clock in the HTML is a hydration mismatch by construction. */
function subscribeClock(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

function Clock() {
  /* A quarter-minute bucket rather than the timestamp itself, so the snapshot is
     stable between ticks and React is not handed a new value every render. The
     server snapshot is null, which is what keeps a clock out of the HTML. */
  const bucket = useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / 15_000),
    () => null,
  );
  const now = bucket === null
    ? null
    : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <span suppressHydrationWarning style={{
      fontSize: TYPE.META, fontWeight: 600, color: SIGNAL,
      letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums',
      minWidth: '4.4ch', display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {now ?? ' '}
    </span>
  );
}

export default function NavBar() {
  const active = useActiveSection(['hero', 'about', 'projects', 'contact']);
  const { overlayOpen, closeOverlay } = useOverlay();
  const reduced = useReducedMotion();

  /* `scroll-behavior: auto` in the reduced-motion media query does not reach
     this: a `behavior: 'smooth'` passed to scrollTo wins over the stylesheet.
     The setting has to be read in JS and the jump made instant. */
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - RAIL_H, behavior });
  };

  const scrollTo = (id: string) => {
    if (overlayOpen) {
      closeOverlay();
      // Wait out the overlay's exit before moving the page underneath it.
      setTimeout(() => goTo(id), reduced ? 0 : 650);
      return;
    }
    goTo(id);
  };

  const handleBrand = () => {
    if (overlayOpen) { closeOverlay(); return; }
    window.scrollTo({ top: 0, behavior });
  };

  return (
    /* The rail is opaque steel at every scroll position. A frosted bar that
       materialises on scroll belongs to a world where the page is the subject;
       here the rail is a fixed piece of the building, and buildings do not
       fade in. */
    <nav aria-label="Sections" className="oz-rail" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      background: STEEL,
      borderBottom: `1px solid ${STEEL_SOFT}`,
      height: RAIL_H,
      display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
      fontFamily: SIGN,
    }}>
      {/* Initials reversed out of a signal plate, the way a transit authority's
          mark sits at the head of every sign. Square, like every other plate in
          this system — the circle is reserved for a station on the route line. */}
      <button
        onClick={handleBrand}
        aria-label="Back to the top of the page"
        className="oz-rail-brand"
        style={{
          background: SIGNAL, color: STEEL, border: 'none', cursor: 'pointer',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800,
          fontStretch: '112%', letterSpacing: '0.02em',
          transition: `background 0.18s ${EASE_OUT}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = SIGNAL; }}
      >
        OZ
      </button>

      <div className="oz-rail-place" style={{
        alignItems: 'center', gap: 10, paddingLeft: 20,
        color: BOARD_INK_SOFT, fontSize: TYPE.LABEL, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase', fontStretch: '88%',
        whiteSpace: 'nowrap',
      }}>
        <Pictogram name="pin" size={13} color={BOARD_INK_SOFT} />
        Fullerton, CA / Ithaca, NY
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        {LINKS.map(l => {
          const isActive = active === l.id && !overlayOpen;
          return (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              aria-current={isActive ? 'true' : undefined}
              className="oz-rail-link"
              style={{
                fontFamily: SIGN,
                fontWeight: 700,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: isActive ? SIGNAL : BOARD_INK,
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                /* The active marker is a signal bar seated on the rail's own
                   lower edge, the way a platform sign underlines the line you
                   are standing on. */
                boxShadow: isActive ? `inset 0 -4px 0 0 ${SIGNAL}` : 'inset 0 -4px 0 0 transparent',
                transition: `color 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = SIGNAL; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = BOARD_INK; }}
            >
              {l.label}
            </button>
          );
        })}

        {/* The clock never yields: a board that clips its own time is a broken
            board, so this block holds its width and the links give ground. */}
        <div className="oz-rail-clock" style={{
          display: 'flex', alignItems: 'center', flexShrink: 0,
          borderLeft: `1px solid ${STEEL_SOFT}`,
        }}>
          <Pictogram name="clock" size={13} color={SIGNAL} />
          <Clock />
        </div>
      </div>
    </nav>
  );
}
