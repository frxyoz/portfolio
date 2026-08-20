'use client';

import React from 'react';
import {
    SIGNAL, ENAMEL, STEEL, STEEL_SOFT, SIGN_WHITE, CHALK, RULE_STRONG,
} from '@/design/tokens';
import { WALL_H, CORRIDOR_W, type Tag, type Sticker } from './corridor';

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

/* ── Graffiti ──────────────────────────────────────────────────────────────
   Four authored letterforms, each one a single filled path so it behaves like
   paint rather than like a stroke of type. They are drawn once at a nominal
   size and placed by transform, which is why a tag can be sprayed at 0.66 in a
   gap and at 1.35 across a whole bay without redrawing anything. */

const TAG_PATHS: Record<Tag['kind'], { d: string; w: number; h: number }> = {
    /* "OZ" in fat throw-up caps — the one that is actually a signature. */
    oz: {
        w: 210, h: 92,
        d: 'M44 4 C16 4 2 22 2 46 C2 72 18 88 46 88 C74 88 90 70 90 46 C90 20 74 4 44 4 Z M46 26 C58 26 64 34 64 46 C64 59 58 66 46 66 C34 66 28 58 28 46 C28 34 34 26 46 26 Z M104 6 L200 6 L200 28 L142 66 L204 66 L204 88 L100 88 L100 66 L158 28 L104 28 Z',
    },
    /* Interlocking arrows and bars: the wildstyle piece, unreadable on purpose. */
    wildstyle: {
        w: 300, h: 120,
        d: 'M6 30 L52 30 L74 62 L96 30 L142 30 L106 82 L142 114 L96 114 L74 88 L52 114 L6 114 L44 82 Z M158 8 L196 8 L196 44 L236 44 L236 8 L274 8 L274 114 L236 114 L236 76 L196 76 L196 114 L158 114 Z M282 22 L298 38 L282 54 L266 38 Z M282 68 L298 84 L282 100 L266 84 Z',
    },
    /* A bubble throw-up: two fat lobes and a tail. */
    throwup: {
        w: 240, h: 110,
        d: 'M58 6 C22 6 2 28 2 56 C2 86 24 104 58 104 C86 104 104 92 112 72 L134 72 C142 92 160 104 188 104 C222 104 238 84 238 56 C238 28 218 6 184 6 C154 6 134 22 128 44 L118 44 C112 22 90 6 58 6 Z M58 32 C76 32 86 42 86 56 C86 70 76 80 58 80 C40 80 28 70 28 56 C28 42 40 32 58 32 Z M184 32 C202 32 212 42 212 56 C212 70 202 80 184 80 C166 80 156 70 156 56 C156 42 166 32 184 32 Z',
    },
    /* A marker scrawl: one continuous nib stroke, no letters worth reading. */
    scrawl: {
        w: 260, h: 64,
        d: 'M4 44 C24 12 40 12 52 32 C62 48 74 48 84 28 C94 8 110 8 120 30 C128 48 142 50 152 32 C162 14 178 12 190 30 C200 46 214 48 226 34 C234 24 246 22 256 30 L252 40 C244 34 238 36 232 44 C218 62 198 60 186 42 C176 26 166 26 158 42 C146 64 126 62 116 42 C108 26 100 26 92 42 C80 64 60 62 50 42 C42 26 32 26 22 46 Z',
    },
};

const TAG_COLOR: Record<Tag['color'], string> = {
    signal: SIGNAL,
    enamel: ENAMEL,
    chalk: CHALK,
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
                const g = TAG_PATHS[t.kind];
                return (
                    <g
                        key={i}
                        transform={`translate(${t.x} ${t.y}) rotate(${t.tilt}) scale(${t.scale})`}
                        opacity={t.opacity}
                        /* Chalk marker soaks into the grout; spray sits on top of
                           the glaze, which is why only one of them multiplies. */
                        style={t.color === 'chalk' ? { mixBlendMode: 'multiply' } : undefined}
                    >
                        <path d={g.d} fill={TAG_COLOR[t.color]} />
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
