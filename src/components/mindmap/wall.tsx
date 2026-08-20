'use client';

import React from 'react';
import {
    SIGNAL, SIGNAL_DEEP, ENAMEL, ENAMEL_LIT, STEEL, STEEL_SOFT, SIGN_WHITE, CHALK,
    RULE_STRONG,
} from '@/design/tokens';
import { WALL_H, CORRIDOR_W, type Tag, type Buff, type Sticker } from './corridor';
import { MARKS } from './marks';

/* The corridor's surfaces.
 *
 * Everything here is drawn, not photographed and not textured from an asset:
 * the tile is a repeating gradient, the grout is the gap between stops, the
 * grime is a pair of soft washes, and the graffiti is authored path data. That
 * matters for the same reason the pictograms are authored — a wall assembled
 * out of stock textures reads as stock, and this one has to read as a specific
 * place that a specific person's posters got pasted onto.
 */

/* ── Tile ──────────────────────────────────────────────────────────────────
   Metro tile: a 64 × 34 brick, offset every other course, with the grout
   showing as the gap. Two gradients rather than an image, so it stays crisp at
   any zoom and costs nothing to load. */

const TILE_W = 64;
const TILE_H = 34;
const GROUT = '#bcb8ad';
const TILE_FACE = '#eceae3';
const TILE_FACE_ALT = '#e5e2da';

export function tileStyle(): React.CSSProperties {
    return {
        backgroundColor: GROUT,
        backgroundImage: [
            /* Course A: bricks starting flush left. */
            `linear-gradient(${TILE_FACE} 0 ${TILE_H - 2}px, transparent ${TILE_H - 2}px)`,
            `repeating-linear-gradient(90deg, transparent 0 ${TILE_W - 2}px, ${GROUT} ${TILE_W - 2}px ${TILE_W}px)`,
            /* Course B: the same brick, shifted half a width. */
            `linear-gradient(transparent 0 ${TILE_H}px, ${TILE_FACE_ALT} ${TILE_H}px ${TILE_H * 2 - 2}px, transparent ${TILE_H * 2 - 2}px)`,
            `repeating-linear-gradient(90deg, transparent 0 ${TILE_W / 2 - 2}px, ${GROUT} ${TILE_W / 2 - 2}px ${TILE_W / 2}px, transparent ${TILE_W / 2}px ${TILE_W - 2}px, ${GROUT} ${TILE_W - 2}px ${TILE_W}px)`,
        ].join(','),
        backgroundSize: `${TILE_W}px ${TILE_H * 2}px`,
        backgroundRepeat: 'repeat',
    };
}

/** The soot a corridor collects: dark at the skirting, dark at the ceiling,
 *  clean at eye level, exactly where a cleaner's arm reaches. */
export function Grime() {
    return (
        <div
            aria-hidden
            style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: [
                    `linear-gradient(180deg, rgba(20,20,20,0.30) 0, rgba(20,20,20,0.06) 90px, rgba(20,20,20,0) 200px)`,
                    `linear-gradient(0deg, rgba(20,20,20,0.34) 0, rgba(20,20,20,0.08) 110px, rgba(20,20,20,0) 240px)`,
                ].join(','),
            }}
        />
    );
}

/* ── Buff ─────────────────────────────────────────────────────────────────
   The transit authority's answer to the paint: a roller-width rectangle of
   whatever grey was on the van, run over a piece and stopped at the edge of
   the arm's reach. This is the single detail that separates a wall somebody
   painted from a wall somebody keeps painting — the buff is why old paint
   shows through as a ghost, and why the newest tag is always the one sitting
   on top of a grey patch. Rendered between the ghost layer and the live tags,
   which is the order it happened in. */

const BUFF_PAINT = ['#d7d3c6', '#cbc7b9', '#bfbbad'];

export function Buffs({ patches }: { patches: Buff[] }) {
    return (
        <>
            {patches.map((b, i) => (
                <div
                    key={i}
                    aria-hidden
                    style={{
                        position: 'absolute',
                        left: b.x, top: b.y, width: b.w, height: b.h,
                        background: BUFF_PAINT[b.paint],
                        opacity: b.opacity,
                        pointerEvents: 'none',
                        /* A roller leaves a lapped edge, not a cut one, and it
                           runs out of paint at the end of each pass. */
                        clipPath:
                            'polygon(0.6% 1%, 99% 0%, 100% 3%, 99.4% 97%, 100% 100%, 1.4% 99%, 0% 96%, 0.2% 4%)',
                        maskImage:
                            `repeating-linear-gradient(180deg, rgba(0,0,0,1) 0 ${b.nap}px, rgba(0,0,0,0.82) ${b.nap}px ${b.nap + 3}px)`,
                        WebkitMaskImage:
                            `repeating-linear-gradient(180deg, rgba(0,0,0,1) 0 ${b.nap}px, rgba(0,0,0,0.82) ${b.nap}px ${b.nap + 3}px)`,
                    }}
                />
            ))}
        </>
    );
}

/* ── Graffiti ──────────────────────────────────────────────────────────────
   The drawings live in `marks.ts` and the positions are computed in
   `corridor.ts`; this only paints what those two agreed on. */

const TAG_COLOR: Record<Tag['color'], string> = {
    signal: SIGNAL,
    'signal-deep': SIGNAL_DEEP,
    enamel: ENAMEL,
    'enamel-lit': ENAMEL_LIT,
    chalk: CHALK,
    steel: STEEL,
};

export function Graffiti({ tags }: { tags: Tag[] }) {
    return (
        <svg
            aria-hidden
            viewBox={`0 0 ${CORRIDOR_W} ${WALL_H}`}
            width={CORRIDOR_W}
            height={WALL_H}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            {tags.map((t, i) => {
                const family = MARKS[t.kind];
                const g = family[(t.hand ?? 0) % family.length];
                const paint = TAG_COLOR[t.color];
                const keyline = t.keyline ? TAG_COLOR[t.keyline] : undefined;
                return (
                    <g
                        key={i}
                        transform={`translate(${t.x} ${t.y}) rotate(${t.tilt}) scale(${t.scale})`}
                        opacity={t.opacity}
                        /* Chalk marker soaks into the grout; spray sits on top of
                           the glaze, which is why only one of them multiplies. */
                        style={t.color === 'chalk' ? { mixBlendMode: 'multiply' } : undefined}
                    >
                        {/* A run of paint starts under the piece that made it. */}
                        {g.drips?.map(([dx, dy, len], k) => (
                            <path
                                key={k}
                                d={`M${dx} ${dy} L${dx} ${dy + len}`}
                                stroke={paint} strokeWidth={5} strokeLinecap="round" fill="none"
                            />
                        ))}
                        <path
                            d={g.d}
                            fillRule="evenodd"
                            fill={g.nib ? 'none' : paint}
                            stroke={g.nib ? paint : keyline}
                            strokeWidth={g.nib ?? (keyline ? 7 : undefined)}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            /* The keyline goes on before the fill, so the outline
                               reads as the cut-in around a piece rather than as a
                               border drawn on top of one. */
                            style={{ paintOrder: 'stroke' }}
                        />
                    </g>
                );
            })}
        </svg>
    );
}

/* ── Stickers ──────────────────────────────────────────────────────────────
   A pictogram decal: the sign system's own glyph, printed on a square of vinyl
   and slapped on askew. The only place in the whole system where a mark from
   the signage ends up somewhere the signage did not choose. */

const STICKER_GROUND: Record<Sticker['scheme'], { bg: string; ink: string }> = {
    signal: { bg: SIGNAL, ink: STEEL },
    enamel: { bg: ENAMEL, ink: SIGN_WHITE },
    steel: { bg: STEEL, ink: SIGNAL },
};

export function Decal({ sticker, children }: { sticker: Sticker; children: React.ReactNode }) {
    const g = STICKER_GROUND[sticker.scheme];
    return (
        <div
            aria-hidden
            style={{
                position: 'absolute',
                left: sticker.x, top: sticker.y,
                transform: `translate(-50%, -50%) rotate(${sticker.tilt}deg)`,
                width: sticker.size, height: sticker.size,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: g.bg, color: g.ink,
                /* A vinyl square has a white bleed edge and a little lift. */
                boxShadow: `0 0 0 3px ${SIGN_WHITE}, 0 2px 5px rgba(20,20,20,0.28)`,
                pointerEvents: 'none',
            }}
        >
            {children}
        </div>
    );
}

/* ── Fittings ──────────────────────────────────────────────────────────────
   The parts of the corridor that are not wall: the skirting the tile stops at,
   and the service ducting that runs the ceiling. Both are load-bearing for the
   illusion — a tiled rectangle with no top and no bottom is a swatch. */

export function Ceiling() {
    return (
        <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 26 }}>
            <div style={{ height: 18, background: STEEL_SOFT }} />
            <div style={{ height: 8, background: STEEL }} />
        </div>
    );
}

export function Skirting() {
    return (
        <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 34 }}>
            {/* A rubber skirting, then the floor beyond it. */}
            <div style={{ height: 12, background: RULE_STRONG }} />
            <div style={{ height: 22, background: STEEL_SOFT }} />
        </div>
    );
}
