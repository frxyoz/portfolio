'use client';

import React from 'react';
import {
    SIGNAL, SIGNAL_DEEP, ENAMEL, ENAMEL_LIT, STEEL, STEEL_SOFT, SIGN_WHITE, CHALK,
    RULE_STRONG,
} from '@/design/tokens';
import { WALL_H, CORRIDOR_W, type Tag, type Buff, type Sticker } from './corridor';

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
   Seven authored marks, and the set is chosen the way a real wall's set is
   chosen — by what tool made it. A can makes a filled shape, so the throw-up,
   the wildstyle, the blockbuster and the chevrons are single filled paths that
   behave like paint rather than like a stroke of type. A marker makes a stroke
   of constant nib width, so the handstyle and the scrawl are honestly stroked
   — modelling a nib as an outline would be the lie, not the shortcut.

   Everything is drawn once at a nominal size and placed by transform, which is
   why a tag can go up at 0.66 in a gap and at 1.5 across a whole bay without
   being redrawn. */

/** The stencilled chevron run: five arrows, cut square, pointing the way you
 *  are walking. It is the one mark on the wall that is also wayfinding — a
 *  corridor is a line, and this is the line's direction painted on it. */
function chevronRun(n: number, h: number, reach: number, arm: number, pitch: number) {
    let d = '';
    for (let k = 0; k < n; k++) {
        const o = k * pitch;
        d += `M${o} 0 L${o + arm} 0 L${o + reach} ${h / 2} L${o + arm} ${h} L${o} ${h} L${o + reach - arm} ${h / 2} Z `;
    }
    return d.trim();
}

interface TagArt {
    d: string;
    w: number;
    h: number;
    /** Set when the mark is a nib rather than a can: the stroke's width. */
    nib?: number;
    /** Where the paint ran, as [x, y, length] on the mark's own grid. */
    drips?: [number, number, number][];
}

/* Every kind is a family, not a drawing, and `hand` on a tag picks which one
   went up. This is the difference between a wall and a pattern: two writers
   never make the same mark, and one writer never makes it the same way twice.
   A handstyle in particular is a name written fast — repeat it identically down
   a corridor and the whole wall collapses into wallpaper. */
const TAG_PATHS: Record<Tag['kind'], TagArt[]> = {
    /* "OZ" in fat throw-up caps — the one that is actually a signature. */
    oz: [{
        w: 210, h: 92,
        d: 'M44 4 C16 4 2 22 2 46 C2 72 18 88 46 88 C74 88 90 70 90 46 C90 20 74 4 44 4 Z M46 26 C58 26 64 34 64 46 C64 59 58 66 46 66 C34 66 28 58 28 46 C28 34 34 26 46 26 Z M104 6 L200 6 L200 28 L142 66 L204 66 L204 88 L100 88 L100 66 L158 28 L104 28 Z',
        drips: [[20, 86, 30], [78, 84, 17], [126, 86, 42], [186, 86, 24]],
    }],
    /* Interlocking arrows and bars: the wildstyle piece, unreadable on purpose.
       Two of them, because one piece repeated seven times is a stencil. */
    wildstyle: [
        {
            w: 300, h: 120,
            d: 'M6 30 L52 30 L74 62 L96 30 L142 30 L106 82 L142 114 L96 114 L74 88 L52 114 L6 114 L44 82 Z M158 8 L196 8 L196 44 L236 44 L236 8 L274 8 L274 114 L236 114 L236 76 L196 76 L196 114 L158 114 Z M282 22 L298 38 L282 54 L266 38 Z M282 68 L298 84 L282 100 L266 84 Z',
            drips: [[30, 112, 34], [118, 112, 20], [176, 112, 46], [255, 112, 27]],
        },
        {
            w: 280, h: 118,
            d: 'M4 10 L44 10 L44 46 L72 46 L72 10 L112 10 L112 108 L72 108 L72 72 L44 72 L44 108 L4 108 Z M126 10 L226 10 L226 38 L166 38 L166 46 L220 46 L220 108 L126 108 L126 80 L182 80 L182 72 L126 72 Z M238 34 L266 6 L276 30 L252 46 L276 62 L266 88 L238 60 Z',
            drips: [[22, 106, 40], [90, 106, 22], [148, 106, 33], [204, 106, 48]],
        },
    ],
    /* A bubble throw-up: fat lobes and a tail. */
    throwup: [
        {
            w: 240, h: 110,
            d: 'M58 6 C22 6 2 28 2 56 C2 86 24 104 58 104 C86 104 104 92 112 72 L134 72 C142 92 160 104 188 104 C222 104 238 84 238 56 C238 28 218 6 184 6 C154 6 134 22 128 44 L118 44 C112 22 90 6 58 6 Z M58 32 C76 32 86 42 86 56 C86 70 76 80 58 80 C40 80 28 70 28 56 C28 42 40 32 58 32 Z M184 32 C202 32 212 42 212 56 C212 70 202 80 184 80 C166 80 156 70 156 56 C156 42 166 32 184 32 Z',
            drips: [[16, 84, 38], [96, 96, 22], [148, 96, 44], [228, 84, 29]],
        },
        {
            w: 250, h: 108,
            d: 'M52 8 C20 8 4 30 4 58 C4 88 26 104 58 104 C84 104 100 92 108 74 L120 74 C126 92 142 104 166 104 C196 104 214 88 214 60 C214 46 208 34 198 26 L232 8 L246 24 L214 44 M52 34 C70 34 80 44 80 58 C80 72 70 82 52 82 C34 82 22 72 22 58 C22 44 34 34 52 34 Z M166 34 C182 34 192 44 192 60 C192 74 182 82 166 82 C150 82 140 72 140 60 C140 44 150 34 166 34 Z',
            drips: [[14, 96, 32], [70, 96, 44], [130, 88, 20], [200, 96, 37]],
        },
    ],
    /* Marker scrawls: no letters worth reading, three different hands.
       The first is a filled ribbon; the other two are nib strokes. */
    scrawl: [
        {
            w: 260, h: 64,
            d: 'M4 44 C24 12 40 12 52 32 C62 48 74 48 84 28 C94 8 110 8 120 30 C128 48 142 50 152 32 C162 14 178 12 190 30 C200 46 214 48 226 34 C234 24 246 22 256 30 L252 40 C244 34 238 36 232 44 C218 62 198 60 186 42 C176 26 166 26 158 42 C146 64 126 62 116 42 C108 26 100 26 92 42 C80 64 60 62 50 42 C42 26 32 26 22 46 Z',
        },
        {
            w: 240, h: 56, nib: 8,
            d: 'M6 40 C26 12 46 48 66 22 C84 -2 100 46 118 24 C134 4 150 44 168 26 M168 26 L186 6 L192 34 L214 14 M214 14 C224 26 232 30 236 44',
        },
        {
            w: 200, h: 60, nib: 7,
            d: 'M8 48 C22 8 44 8 50 34 C56 58 36 62 34 40 C32 20 54 12 74 26 C92 38 84 58 68 52 C52 46 62 22 84 20 C110 18 122 44 140 46 C158 48 166 30 158 18 C152 8 138 12 140 26 C142 42 164 52 186 42',
        },
    ],
    /* The handstyle: a name written once, fast, with a fat marker. The most
       common mark on any transit wall and the only one here that is genuinely
       handwriting — so there are five hands, and no two neighbouring marks in
       the corridor are the same one. They differ where real ones differ: in
       slant, in loop size, in how tall they run, and in how the writer chose to
       stop. Every one is a single continuous gesture rather than a row of
       separate letterforms, because a mark that resolves into readable letters
       spelling nothing is worse than one that never resolves at all. */
    handstyle: [
        /* Looped and rising, closed with an arrow. */
        {
            w: 280, h: 104, nib: 11,
            d: 'M12 76 C8 32 26 14 40 24 C52 33 46 58 34 72 C24 84 32 94 46 86 C58 78 66 52 70 30 M70 30 C74 16 86 18 88 36 C90 56 84 74 94 80 C106 86 116 60 120 40 M120 40 C126 52 122 70 130 78 C140 86 154 68 160 46 M160 46 C158 64 166 82 180 80 C196 78 208 58 214 34 M28 92 C92 78 160 80 216 90 M216 90 L254 70 M216 90 L246 100 M244 64 L266 78 L242 94',
        },
        /* Low and wide, shallow loops, exits on a swash. */
        {
            w: 280, h: 100, nib: 10,
            d: 'M8 62 C10 40 24 32 34 44 C44 56 36 74 24 70 C12 66 16 44 32 36 C52 26 70 44 74 62 C78 78 92 80 100 66 C108 52 100 36 88 40 C76 44 78 66 96 72 C118 80 140 62 146 44 C150 30 164 30 166 46 C168 62 160 76 170 80 C182 84 198 66 206 46 C210 36 222 36 222 50 C222 64 216 76 226 80 C238 84 252 68 258 52 C262 66 258 78 262 86 M30 84 C110 74 200 78 262 86',
        },
        /* Tall, narrow, steeply slanted, closed with an arrow. */
        {
            w: 280, h: 112, nib: 10,
            d: 'M10 90 C22 46 34 18 46 22 C56 26 50 52 40 72 C32 88 40 96 52 88 C64 80 72 50 78 26 C82 12 94 12 92 30 C90 52 80 76 90 84 C100 92 114 70 120 46 C124 30 136 30 134 48 C132 66 124 84 134 88 C146 92 158 68 164 44 C168 28 180 28 178 46 C176 64 170 82 180 86 C192 90 206 66 212 40 M212 40 L216 90 M26 96 C100 84 172 88 216 96 M216 96 L252 76 M216 96 L246 106 M244 70 L266 84 L242 100',
        },
        /* Round and bubbly, kept low, underlined twice. */
        {
            w: 210, h: 108, nib: 10,
            d: 'M16 44 C6 60 12 78 30 76 C48 74 54 54 44 42 C34 30 18 34 16 48 C14 66 34 78 54 72 C72 66 78 46 70 36 C62 26 48 32 50 46 C52 62 72 74 92 70 C110 66 118 48 110 38 C102 28 88 34 90 48 C92 64 112 76 132 72 C150 68 158 48 150 38 C142 28 128 34 130 48 C132 64 152 76 172 70 C186 66 194 52 190 42 M14 88 C80 78 150 82 196 90 M18 98 C84 90 152 94 194 100',
        },
        /* Flat and wide, with one long descender that swings back underneath. */
        {
            w: 270, h: 112, nib: 10,
            d: 'M10 42 C30 26 56 28 64 46 C72 64 54 76 40 68 C26 60 32 42 50 38 C74 32 96 46 104 62 C110 74 124 74 130 60 C136 46 128 32 116 36 C104 40 108 60 126 66 C148 74 172 58 178 40 C182 26 196 28 196 44 C196 60 190 72 200 76 C212 80 226 62 232 44 C238 30 252 34 252 50 C252 80 216 100 172 104 C126 108 70 98 34 82',
        },
    ],
    /* The blockbuster: two letters rolled on with an extension pole, big
       enough to read from the far end of the corridor and flat enough to sit
       under everything else without shouting. */
    blockbuster: [{
        w: 300, h: 100,
        d: 'M0 0 L126 0 L126 100 L0 100 Z M32 28 L94 28 L94 72 L32 72 Z M152 0 L300 0 L300 28 L228 72 L300 72 L300 100 L152 100 L152 72 L224 28 L152 28 Z',
        drips: [[14, 98, 46], [110, 98, 28], [168, 98, 36], [284, 98, 52]],
    }],
    /* Five stencilled arrows, pointing down the corridor. */
    chevron: [{
        w: 528, h: 120,
        d: chevronRun(5, 120, 96, 52, 108),
        drips: [[24, 118, 26], [240, 118, 34], [456, 118, 20]],
    }],
};

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
                const family = TAG_PATHS[t.kind];
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
