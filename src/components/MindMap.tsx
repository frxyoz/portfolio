'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import Pictogram from './concourse/Pictogram';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    SIGNAL, STEEL, STEEL_SOFT, SIGN_WHITE, CHALK,
    SIGN_INK, EASE_OUT, SIGN, TYPE, TABULAR,
} from '@/design/tokens';
import Art, { SCHEMES, SCHEME_INK, SCHEME_SUB } from './mindmap/art';
import { tileStyle, Grime, Graffiti, Buffs, Decal, Ceiling, Skirting } from './mindmap/wall';
import {
    WALL_H, LINE_Y, CORRIDOR_W, ZONES, POSTERS, TAGS, GHOSTS, BUFFS, STICKERS,
    ZONE_BY_ID, type Poster, type Zone,
} from './mindmap/corridor';

/* ── The corridor ──────────────────────────────────────────────────────────
 *
 * You walk it. That is the whole interaction: a tiled station passage scrolled
 * sideways, eleven posters pasted along it, a platform line running the floor.
 * The zones you pass through are the four interests; the sheets are the stops.
 *
 * The previous version drew the same content as a network map with a reading
 * panel beside it. It was correct and airless — a diagram plus a column of
 * prose, describing somebody's Saturday. Here the drawings do the work and the
 * words are captions: every note is one line, printed on the sheet it belongs
 * to, and there is no panel at all.
 *
 * What survives from the map is the one thing only a transit drawing can say.
 * FIFA / FM is still an interchange, and still the only one, because it sits on
 * the seam where the Soccer zone becomes the Gaming zone.
 */

const LABEL: React.CSSProperties = {
    fontFamily: SIGN, fontSize: TYPE.LABEL, fontWeight: 800,
    fontStretch: '88%', letterSpacing: '0.18em', textTransform: 'uppercase',
    lineHeight: 1,
};
const CONTROL: React.CSSProperties = {
    fontFamily: SIGN, fontSize: TYPE.CONTROL, fontWeight: 700,
    fontStretch: '88%', letterSpacing: '0.16em', textTransform: 'uppercase',
    lineHeight: 1,
};

const SR_ONLY: React.CSSProperties = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

/* ── The zone entrance ─────────────────────────────────────────────────────
   Where a corridor changes line, a station hangs a sign across it. This is that
   sign: a full-height enamel bay carrying the line number huge, the pictogram
   under it, and the name set on end. It is what tells you the sheets after it
   are about something else. */

function ZoneGate({ zone }: { zone: Zone }) {
    const pal = SCHEMES[zone.scheme];
    return (
        <div
            aria-hidden
            style={{
                position: 'absolute', left: zone.x, top: 0, height: WALL_H - 46, width: 126,
                background: pal.bg, color: pal.accent,
                borderLeft: `4px solid ${STEEL}`, borderRight: `4px solid ${STEEL}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 22, padding: '24px 0',
            }}
        >
            <span style={{
                fontFamily: SIGN, fontWeight: 800, fontStretch: '112%',
                fontSize: '3.4rem', lineHeight: 0.82, letterSpacing: '-0.04em',
                ...TABULAR,
            }}>
                {zone.idx}
            </span>
            <Pictogram name={zone.pictogram} size={46} color={pal.accent} />
            <span style={{
                ...LABEL, fontSize: TYPE.META, letterSpacing: '0.3em',
                writingMode: 'vertical-rl', whiteSpace: 'nowrap',
            }}>
                {zone.name}
            </span>
        </div>
    );
}

/* ── Platform-edge doors ───────────────────────────────────────────────────
   The way into a corridor is a door, and the site already owns the marking
   that belongs on one: the −45° signal-and-steel hatch that means "the ground
   changes here", which is exactly the claim a threshold makes. Two steel
   leaves, a hatched edge where they meet, and a signal seam down the join.

   They hold shut for a fifth of the run before parting, because a door that is
   already opening when you first see it never reads as having been closed. */

function Doors() {
    const hatch = `repeating-linear-gradient(-45deg, ${SIGNAL} 0 14px, ${STEEL} 14px 28px)`;
    const leaf = (side: 'left' | 'right'): React.CSSProperties => ({
        position: 'absolute', top: 0, bottom: 0, width: '50.2%',
        [side]: 0,
        background: STEEL,
        animation: `gateLeaf${side === 'left' ? 'Left' : 'Right'} .78s ${EASE_OUT} both`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: side === 'left' ? 'flex-end' : 'flex-start',
    });
    return (
        <div aria-hidden style={{
            position: 'absolute', inset: 0, zIndex: 6,
            pointerEvents: 'none', overflow: 'hidden',
        }}>
            {(['left', 'right'] as const).map(side => (
                <div key={side} style={leaf(side)}>
                    {/* The hatch runs down the closing edge, and a signal seam
                        marks the join itself. */}
                    <span style={{
                        width: 18, height: '100%', background: hatch,
                        borderInlineStart: side === 'right' ? `3px solid ${SIGNAL}` : undefined,
                        borderInlineEnd: side === 'left' ? `3px solid ${SIGNAL}` : undefined,
                    }} />
                </div>
            ))}
        </div>
    );
}

/* ── The overhead gantry ───────────────────────────────────────────────────
   A tall window buys ceiling, and bare tile above head height is the one part
   of a corridor nobody looks at. A real passage puts its directional signs up
   there, hung off the soffit on two rods: the thing you read while walking,
   before you are close enough to read anything on the wall. */

function Gantry({ scale, height }: { scale: number; height: number }) {
    return (
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 26, right: 0, height }}>
            {ZONES.map(z => {
                const pal = SCHEMES[z.scheme];
                return (
                    <div
                        key={z.id}
                        style={{
                            position: 'absolute', left: z.x * scale, top: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                        }}
                    >
                        {/* The rods it hangs from. */}
                        <div style={{ display: 'flex', gap: 74, paddingLeft: 22, height: Math.max(8, height * 0.22) }}>
                            <span style={{ width: 3, height: '100%', background: STEEL_SOFT }} />
                            <span style={{ width: 3, height: '100%', background: STEEL_SOFT }} />
                        </div>
                        {/* Always signal on steel. The zone's own colour is
                            carried by the bar under the plate, not by the
                            lettering: zone 03 prints in steel, and steel
                            lettering on a steel plate is a blank sign. */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 11,
                            background: STEEL, color: SIGNAL,
                            padding: '0 16px', height: Math.max(30, height * 0.52),
                            borderBottom: `4px solid ${pal.bg}`,
                            ...CONTROL, whiteSpace: 'nowrap',
                        }}>
                            <Pictogram name="arrow-right" size={13} />
                            <span style={TABULAR}>{z.idx}</span>
                            {z.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── A sheet on the wall ───────────────────────────────────────────────────
   Two mounts, and the difference between them is the difference between paid
   advertising and something somebody put up overnight. A `panel` is bolted into
   a steel frame. A `flyposter` is pasted onto the tile, askew, and tears along
   its bottom edge. */

function Sheet({ poster, lit }: { poster: Poster; lit: boolean }) {
    const pal = SCHEMES[poster.scheme];
    const ink = SCHEME_INK[poster.scheme];
    const sub = SCHEME_SUB[poster.scheme];
    const panel = poster.mount === 'panel';
    const zoneA = poster.interchange ? ZONE_BY_ID.get(poster.interchange[0]) : undefined;
    const zoneB = poster.interchange ? ZONE_BY_ID.get(poster.interchange[1]) : undefined;

    return (
        <article
            style={{
                position: 'absolute',
                left: poster.x - poster.w / 2,
                top: poster.y,
                width: poster.w,
                transform: `rotate(${poster.tilt}deg)`,
                transformOrigin: 'center top',
                /* A sheet in the bay you are standing in is under its own lamp;
                   the ones down the passage are still in the corridor's gloom. */
                filter: lit ? 'none' : 'saturate(0.92) brightness(0.95)',
                transition: `filter .35s ${EASE_OUT}`,
            }}
        >
            <div style={{
                background: pal.bg,
                padding: panel ? 22 : 12,
                boxShadow: panel
                    ? `0 0 0 7px ${STEEL}, 0 0 0 9px ${STEEL_SOFT}, 0 10px 26px rgba(20,20,20,0.34)`
                    : '0 3px 10px rgba(20,20,20,0.36)',
            }}>
                {/* The drawing. It is the reason anybody stopped walking. */}
                <div style={{
                    height: poster.h - 150,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Art name={poster.art} pal={pal} />
                </div>

                <h3 style={{
                    fontFamily: SIGN, fontWeight: 800, fontStretch: '104%',
                    fontSize: poster.w > 360 ? '2.5rem' : '2rem',
                    lineHeight: 0.92, letterSpacing: '-0.03em',
                    color: ink, margin: '16px 0 0',
                }}>
                    {poster.name}
                </h3>

                <p style={{
                    fontFamily: SIGN, fontSize: TYPE.COPY, fontWeight: 500,
                    lineHeight: 1.45, color: sub, margin: '9px 0 0', maxWidth: '32ch',
                }}>
                    {poster.note}
                </p>

                {(poster.link || poster.interchange) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 15 }}>
                        {poster.interchange && zoneA && zoneB && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: STEEL, color: SIGNAL, padding: '9px 12px',
                                ...LABEL, fontSize: TYPE.MICRO,
                            }}>
                                <Pictogram name="interchange" size={12} />
                                Change for {zoneA.idx} / {zoneB.idx}
                            </span>
                        )}
                        {poster.link && (
                            <a
                                href={poster.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    minHeight: 44, padding: '0 14px',
                                    background: ink, color: pal.bg, ...CONTROL,
                                    textDecoration: 'none',
                                    transition: `background .18s ${EASE_OUT}, color .18s ${EASE_OUT}`,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = SIGNAL; e.currentTarget.style.color = STEEL; }}
                                onMouseLeave={e => { e.currentTarget.style.background = ink; e.currentTarget.style.color = pal.bg; }}
                            >
                                {poster.link.label}
                                <Pictogram name="arrow-up-right" size={12} />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* The torn lower edge of a pasted sheet. Panels do not tear. */}
            {!panel && (
                <div aria-hidden style={{
                    height: 10, background: pal.bg, opacity: 0.92,
                    clipPath: 'polygon(0 0, 4% 70%, 9% 20%, 15% 85%, 22% 30%, 29% 90%, 36% 25%, 43% 75%, 50% 15%, 57% 80%, 64% 30%, 71% 88%, 78% 22%, 85% 70%, 92% 28%, 97% 76%, 100% 10%, 100% 0)',
                }} />
            )}
        </article>
    );
}

/* ── Overlay ──────────────────────────────────────────────────────────────── */

export function MindMapOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
    const isMobile = useIsMobile();
    const reduced = useReducedMotion() ?? false;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeZone, setActiveZone] = useState<string>(ZONES[0].id);

    /* The corridor is drawn once at a fixed height and scaled to whatever the
       viewport gives it, so the wall is always visible floor to ceiling and only
       its length runs off the side. */
    const [scale, setScale] = useState(1);
    /* Whatever height is left over the top of the wall. The gantry hangs in it,
       and below the height a hanging sign needs, nothing hangs at all. */
    const [ceiling, setCeiling] = useState(0);

    useEffect(() => {
        if (!open) return;
        document.body.classList.add('overlay-open');
        return () => document.body.classList.remove('overlay-open');
    }, [open]);

    /* Which bay the walker is standing in: whichever gate they most recently
       passed. Read off the scroll position rather than off a click, so the
       marker is right whether they dragged, wheeled, or tabbed there. */
    const scaleRef = useRef(1);

    const syncZone = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const centre = (el.scrollLeft + el.clientWidth / 2) / (scaleRef.current || 1);
        let current = ZONES[0].id;
        for (const z of ZONES) if (z.x <= centre) current = z.id;
        setActiveZone(prev => (prev === current ? prev : current));
    }, []);

    const goToZone = useCallback((id: string) => {
        const el = scrollRef.current;
        const z = ZONE_BY_ID.get(id);
        if (!el || !z) return;
        el.scrollTo({
            left: Math.max(0, z.x * scale - 70),
            behavior: reduced ? 'auto' : 'smooth',
        });
    }, [scale, reduced]);

    /* A vertical wheel walks the corridor. Without this a trackpad flick does
       nothing at all, because there is nothing here to scroll downward. */
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !open) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [open]);

    /* Drag to walk, which is what the grab cursor is promising. */
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !open) return;
        let down = false;
        let startX = 0;
        let startLeft = 0;

        const onDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const target = e.target as HTMLElement;
            /* Never steal a press meant for a link or a button. */
            if (target.closest('a, button')) return;
            down = true;
            startX = e.clientX;
            startLeft = el.scrollLeft;
            el.style.cursor = 'grabbing';
        };
        const onMove = (e: PointerEvent) => {
            if (!down) return;
            el.scrollLeft = startLeft - (e.clientX - startX);
        };
        const onUp = () => { down = false; el.style.cursor = 'grab'; };

        el.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return () => {
            el.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const fn = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { onClose(); return; }
            const el = scrollRef.current;
            if (!el) return;
            const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
            const step = el.clientWidth * 0.7;
            if (e.key === 'ArrowRight') { e.preventDefault(); el.scrollBy({ left: step, behavior }); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); el.scrollBy({ left: -step, behavior }); }
            else if (e.key === 'Home') { e.preventDefault(); el.scrollTo({ left: 0, behavior }); }
            else if (e.key === 'End') { e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior }); }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [open, onClose, reduced]);

    /* Fit the corridor to the space the overlay actually has, in both axes.
       Height alone is not enough: on a phone the viewport is tall and narrow,
       and a height-driven scale puts a single 400px sheet at 480px on a 430px
       screen — one poster, no corridor. The width term keeps roughly a sheet
       and a half in view at any size, and whatever height is left over becomes
       ceiling, which is what a corridor has a lot of anyway. */
    useEffect(() => {
        if (!open) return;
        const el = scrollRef.current;
        if (!el) return;
        const measure = () => {
            const next = Math.max(0.5, Math.min(1.12, el.clientHeight / WALL_H, el.clientWidth / 620));
            /* The corridor's own scale is what maps a scroll offset back to a
               position on the wall, so `syncZone` reads it from here rather
               than from a render closure. */
            scaleRef.current = next;
            setScale(prev => (Math.abs(prev - next) < 0.001 ? prev : next));
            const head = el.clientHeight - WALL_H * next;
            setCeiling(prev => (Math.abs(prev - head) < 1 ? prev : head));
        };
        measure();
        /* Re-reading the bay on resize too: the viewport getting wider moves the
           centre of the corridor without anybody scrolling. */
        const ro = new ResizeObserver(() => { measure(); syncZone(); });
        ro.observe(el);
        return () => ro.disconnect();
    }, [open, syncZone]);

    if (!open) return null;

    const zone = ZONE_BY_ID.get(activeZone)!;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="My interests"
            style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: STEEL, color: SIGN_INK, fontFamily: SIGN,
                display: 'flex', flexDirection: 'column',
                WebkitFontSmoothing: 'antialiased',
                animation: `corridorEnter .78s ${EASE_OUT} both`,
            }}
        >
            {/* ── The rail ─────────────────────────────────────────────── */}
            <div style={{
                flexShrink: 0, height: 60, background: STEEL,
                borderBottom: `1px solid ${STEEL_SOFT}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 8px 0 0', position: 'relative', zIndex: 3,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', minWidth: 0 }}>
                    <span aria-hidden style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 60, height: 60, flexShrink: 0,
                        background: SIGNAL, color: STEEL,
                        fontFamily: SIGN, fontWeight: 800, fontStretch: '104%',
                        fontSize: TYPE.LEDE, letterSpacing: '0.02em',
                    }}>OZ</span>
                    <span style={{
                        ...LABEL, color: SIGN_WHITE, paddingLeft: 18,
                        display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap',
                    }}>
                        <Pictogram name="map" size={14} color={SIGNAL} />
                        My interests
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        minHeight: 44, padding: '0 14px', cursor: 'pointer',
                        background: 'transparent', border: `2px solid ${SIGNAL}`, color: SIGNAL,
                        transition: `background .18s ${EASE_OUT}, color .18s ${EASE_OUT}`,
                        ...CONTROL,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = SIGNAL; e.currentTarget.style.color = STEEL; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SIGNAL; }}
                >
                    Exit
                    <Pictogram name="close" size={11} />
                </button>
            </div>

            {/* ── The corridor ─────────────────────────────────────────── */}
            <div
                ref={scrollRef}
                onScroll={syncZone}
                className="scroll-region"
                tabIndex={0}
                role="region"
                aria-label="Station corridor. Scroll sideways to walk it."
                style={{
                    flex: 1, minHeight: 0, overflowX: 'auto', overflowY: 'hidden',
                    background: STEEL, cursor: 'grab',
                }}
            >
                {/* The tile runs the full height the viewport gives it and the
                    corridor's contents are anchored to the floor, so a tall
                    window buys more wall above the posters rather than a black
                    band beneath them. Tiles do not scale with the sheets —
                    a 64mm tile is 64mm on every wall it is laid on. */}
                <div style={{
                    width: CORRIDOR_W * scale, height: '100%',
                    position: 'relative', ...tileStyle(),
                }}>
                    <Ceiling />
                    {ceiling > 70 && <Gantry scale={scale} height={ceiling - 32} />}

                    <div style={{
                        position: 'absolute', left: 0, bottom: 0,
                        width: CORRIDOR_W, height: WALL_H,
                        transform: `scale(${scale})`, transformOrigin: 'bottom left',
                    }}>
                        {/* The wall's three ages, in the order they happened:
                            the paint that got covered, the grey that covered
                            it, and the paint that went straight back up on the
                            grey. All of it under the sheets, because the
                            sheets were pasted over it. */}
                        <Graffiti tags={GHOSTS} />
                        <Buffs patches={BUFFS} />
                        <Graffiti tags={TAGS} />

                        {ZONES.map(z => <ZoneGate key={z.id} zone={z} />)}

                        {STICKERS.map((st, i) => (
                            <Decal key={i} sticker={st}>
                                <Pictogram name={st.pictogram} size={Math.round(st.size * 0.62)} color="currentColor" />
                            </Decal>
                        ))}

                        {POSTERS.map(p => (
                            <Sheet key={p.id} poster={p} lit={p.zone === activeZone} />
                        ))}

                        {/* The platform line, running the floor with a disc at
                            every sheet. The network map is still here — it is
                            just under your feet now. */}
                        <svg
                            aria-hidden
                            width={CORRIDOR_W} height={WALL_H} viewBox={`0 0 ${CORRIDOR_W} ${WALL_H}`}
                            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                        >
                            <rect x={0} y={LINE_Y - 10} width={CORRIDOR_W} height={20} fill={STEEL} />
                            <rect x={0} y={LINE_Y - 6} width={CORRIDOR_W} height={12} fill={SIGNAL} />
                            {POSTERS.map(p => (
                                <g key={p.id}>
                                    <circle cx={p.x} cy={LINE_Y} r={14} fill={STEEL} />
                                    <circle cx={p.x} cy={LINE_Y} r={7} fill={SIGN_WHITE} />
                                    {p.interchange && (
                                        <circle cx={p.x} cy={LINE_Y} r={20} fill="none" stroke={STEEL} strokeWidth={5} />
                                    )}
                                </g>
                            ))}
                        </svg>
                    </div>

                    <Grime />
                    <Skirting />
                </div>
            </div>

            <Doors />

            {/* ── The strip: where you are, and how to get elsewhere ────── */}
            <div style={{
                flexShrink: 0, background: STEEL, borderTop: `1px solid ${STEEL_SOFT}`,
                display: 'flex', alignItems: 'stretch',
                padding: '0 8px', overflowX: 'auto',
            }}>
                {ZONES.map(z => {
                    const on = z.id === activeZone;
                    return (
                        <button
                            key={z.id}
                            type="button"
                            onClick={() => goToZone(z.id)}
                            aria-current={on ? 'true' : undefined}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                minHeight: 56, padding: '0 18px', cursor: 'pointer',
                                background: 'transparent', border: 'none',
                                color: on ? SIGNAL : SIGN_WHITE,
                                boxShadow: on ? `inset 0 -4px 0 0 ${SIGNAL}` : 'none',
                                transition: `color .18s ${EASE_OUT}, box-shadow .18s ${EASE_OUT}`,
                                ...CONTROL, whiteSpace: 'nowrap',
                            }}
                        >
                            <Pictogram name={z.pictogram} size={15} />
                            <span style={TABULAR}>{z.idx}</span>
                            {!isMobile && z.name}
                        </button>
                    );
                })}

                <span style={{
                    marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 9,
                    ...LABEL, fontSize: TYPE.MICRO, color: CHALK, opacity: 0.72,
                    paddingRight: 8, whiteSpace: 'nowrap',
                }}>
                    <span style={SR_ONLY}>
                        Left and right arrow keys walk the corridor. You are currently in
                        zone {zone.idx}, {zone.name}.
                    </span>
                    <span aria-hidden style={{ display: 'inline-flex', gap: 3 }}>
                        <Pictogram name="arrow-left" size={11} />
                        <Pictogram name="arrow-right" size={11} />
                    </span>
                    {!isMobile && <span aria-hidden>walk the corridor</span>}
                </span>
            </div>
        </div>
    );
}

export default MindMapOverlay;
