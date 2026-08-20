import type { PictogramName } from '@/components/concourse/Pictogram';
import type { SCHEMES } from './art';
import { MARKS, type MarkKind } from './marks';

/* The interests, hung along a station corridor.
 *
 * The content has been through two shapes. It was a deck of poster cards you
 * swiped — visual, but silent about how the interests relate. It became a
 * network map, which drew the relationships exactly and went too quiet: a
 * diagram and a column of prose beside it, where the thing being described is
 * somebody's Saturday.
 *
 * This is the third shape and it keeps both halves. A corridor *is* a line. You
 * walk it end to end, the zones you pass through are the lines, and the posters
 * pasted along the wall are the stops. FIFA / FM still does the one job only a
 * transit drawing can do: it sits on the seam between the Soccer zone and the
 * Gaming zone, labelled as the interchange between them, which is exactly where
 * a real station would put it.
 *
 * `x` is a position in corridor space, in pixels, measured from the entrance.
 */

/** Wall height in corridor space. Everything is laid out against this. */
export const WALL_H = 620;
/** Where the platform line runs, measured from the top of the wall. */
export const LINE_Y = 548;
/** How far past the last sheet the corridor runs before it ends. */
export const CORRIDOR_TAIL = 380;

export type Scheme = keyof typeof SCHEMES;

/** How a sheet is fixed to the wall. */
export type Mount =
    /** A steel-framed backlit advertising panel: rigid, square, lit. */
    | 'panel'
    /** Pasted straight onto the tile, slightly askew, edges torn. */
    | 'flyposter';

export interface Poster {
    id: string;
    /** Which zone of the corridor it hangs in. */
    zone: string;
    name: string;
    /** The drawing, by its key in `art.tsx`. */
    art: string;
    scheme: Scheme;
    mount: Mount;
    /** Said out loud, in one breath. The whole caption. */
    note: string;
    /** Corridor position of the sheet's centre. */
    x: number;
    /** Top edge, from the top of the wall. */
    y: number;
    w: number;
    h: number;
    /** Degrees askew. Panels are always 0 — they are bolted to the wall. */
    tilt: number;
    /** Leaves the corridor: somewhere outside that this stop connects to. */
    link?: { href: string; label: string };
    /** Set when this stop is the seam between two zones. */
    interchange?: [string, string];
}

export interface Zone {
    id: string;
    /** Line number, as painted on the wall. */
    idx: string;
    name: string;
    pictogram: PictogramName;
    scheme: Scheme;
    /** Corridor position of the zone's entrance sign. */
    x: number;
}

export const ZONES: Zone[] = [
    { id: 'soccer', idx: '01', name: 'Soccer', pictogram: 'ball', scheme: 'enamel', x: 150 },
    { id: 'gaming', idx: '02', name: 'Gaming', pictogram: 'controller', scheme: 'steel', x: 1810 },
    { id: 'music', idx: '03', name: 'Music', pictogram: 'record', scheme: 'signal', x: 3010 },
    { id: 'food', idx: '04', name: 'Food', pictogram: 'bowl', scheme: 'enamel', x: 4450 },
];

export const POSTERS: Poster[] = [
    /* ── 01 Soccer ─────────────────────────────────────────────────────── */
    {
        id: 'soccer', zone: 'soccer', name: 'Soccer', art: 'soccer',
        scheme: 'steel', mount: 'panel',
        note: 'I\'ve been a fan of the sport since I was 6, and I try to play it once in a while.',
        x: 500, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        /* Navy, because that is what the club is — but printed the way the
           badge is: navy bird on a white sheet, not a white bird knocked out
           of navy. The shirt colour and the system's enamel blue turn out to
           be the same ink, so this costs the palette nothing, and the paper
           stock keeps the sheet quiet between two loud panels. */
        id: 'tottenham', zone: 'soccer', name: 'Tottenham', art: 'tottenham',
        scheme: 'paper', mount: 'flyposter',
        note: 'I\'ve been a Spurs fan since 2019. It has not been a relaxing few years.',
        x: 990, y: 112, w: 296, h: 380, tilt: -1.8,
    },
    {
        id: 'fifafm', zone: 'soccer', name: 'FIFA / FM', art: 'fifafm',
        scheme: 'signal', mount: 'panel',
        note: 'I love playing soccer management games like FIFA career mode and Football Manager.',
        x: 1430, y: 100, w: 344, h: 356, tilt: 0,
        interchange: ['soccer', 'gaming'],
    },

    /* ── 02 Gaming ─────────────────────────────────────────────────────── */
    {
        id: 'gaming', zone: 'gaming', name: 'Gaming', art: 'gaming',
        scheme: 'steel', mount: 'panel',
        note: 'I enjoy videos games where I can build up my team and watch them grow.',
        x: 2180, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'pokemon', zone: 'gaming', name: 'Pokémon', art: 'pokemon',
        scheme: 'paper', mount: 'flyposter',
        note: 'I used to play Pokémon competitively, and I still play casually. I used to run a Pokémon strategy YouTube channel:',
        x: 2660, y: 118, w: 306, h: 372, tilt: 2.2,
        link: { href: 'https://www.youtube.com/@froxyproxy', label: '@froxyproxy' },
    },

    /* ── 03 Music ──────────────────────────────────────────────────────── */
    {
        id: 'music', zone: 'music', name: 'Music', art: 'music',
        scheme: 'signal', mount: 'panel',
        note: 'I play a bit. I listen a lot more.',
        x: 3380, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'piano', zone: 'music', name: 'Piano', art: 'piano',
        scheme: 'enamel', mount: 'flyposter',
        note: 'I\'ve been playing piano since I was 6. It\'s a way to relax and express myself.',
        x: 3860, y: 114, w: 300, h: 376, tilt: -2.4,
    },
    {
        id: 'listening', zone: 'music', name: 'Listening', art: 'listening',
        scheme: 'steel', mount: 'panel',
        note: 'Not only do I like playing music, I love listening to music of all genres!',
        x: 4290, y: 100, w: 336, h: 356, tilt: 0,
        link: { href: 'https://www.last.fm/user/olriczzz', label: 'last.fm/olriczzz' },
    },

    /* ── 04 Food ───────────────────────────────────────────────────────── */
    {
        id: 'food', zone: 'food', name: 'Food', art: 'food',
        scheme: 'paper', mount: 'panel',
        note: 'I eat a lot of it. Lately I try to make it too.',
        x: 4840, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'noodles', zone: 'food', name: 'Noodles', art: 'noodles',
        scheme: 'signal', mount: 'flyposter',
        note: 'My favorite foods are noodles!',
        x: 5320, y: 116, w: 300, h: 372, tilt: 1.6,
    },
    {
        id: 'cooking', zone: 'food', name: 'Cooking', art: 'cooking',
        scheme: 'enamel', mount: 'panel',
        note: 'I\'ve been learning to cook and bake.',
        x: 5750, y: 100, w: 340, h: 356, tilt: 0,
    },
];

export const POSTER_BY_ID = new Map(POSTERS.map(p => [p.id, p]));
export const ZONE_BY_ID = new Map(ZONES.map(z => [z.id, z]));

/** Total corridor length. Derived, so moving a sheet moves the far wall. */
export const CORRIDOR_W =
    Math.max(...POSTERS.map(p => p.x + p.w / 2)) + CORRIDOR_TAIL;

/* ── The wall's own marks ──────────────────────────────────────────────────
   Sprayed and stuck rather than printed. These are what arrives on a station
   wall without anyone's permission, and a corridor without them is a rendering
   of a corridor rather than a corridor. Positions are placed by hand into the
   gaps between sheets — landing where the posters are not is the entire job. */

export interface Tag {
    /** Which authored mark, from `marks.ts`. */
    kind: MarkKind;
    /** Where the mark ended up. On a spec this is only the wish; the placement
     *  pass below is what decides, and it is allowed to move a mark to keep it
     *  off its neighbours. */
    x: number;
    y: number;
    scale: number;
    tilt: number;
    /** The can or the nib it was made with. Every one is a system ink. */
    color: 'signal' | 'signal-deep' | 'enamel' | 'enamel-lit' | 'chalk' | 'steel';
    /** Which drawing in the kind's family went up here. Authored, not random:
     *  the corridor is walked in one direction, so no two marks the reader
     *  passes in sequence are allowed to be the same hand. */
    hand?: number;
    /** The cut-in around a piece. A throw-up without one is a shape; with one
     *  it is a throw-up, and that difference is most of what reads as real. */
    keyline?: Tag['color'];
    opacity: number;
}

/** A roller pass by the cleaning contractor. See `Buffs` in `wall.tsx`. */
export interface Buff {
    x: number;
    y: number;
    w: number;
    h: number;
    /** Index into the three greys that were on the van. */
    paint: 0 | 1 | 2;
    opacity: number;
    /** Roller-nap pitch: how far the sleeve travels before it laps itself. */
    nap: number;
}

/* The wall has three ages on it, and they are rendered in the order they
   happened: the paint that was there first and got covered, the grey that
   covered it, and the paint that went straight back up on top of the grey.
   Skipping the middle layer is what makes a drawn wall read as decorated —
   a wall nobody ever cleaned is a set, not a station. */

/** Layer one: what was there before the last buff, showing through it. */
export const GHOSTS: Tag[] = [
    { kind: 'oz', x: 700, y: 268, scale: 0.6, tilt: -4, color: 'signal', opacity: 0.5 },
    { kind: 'scrawl', hand: 0, x: 1145, y: 498, scale: 0.42, tilt: 3, color: 'steel', opacity: 0.5 },
    { kind: 'oz', x: 2820, y: 220, scale: 0.8, tilt: 4, color: 'enamel', opacity: 0.5 },
    { kind: 'scrawl', hand: 2, x: 3582, y: 292, scale: 0.44, tilt: -4, color: 'signal', opacity: 0.5 },
    { kind: 'throwup', hand: 0, x: 5044, y: 250, scale: 0.5, tilt: -3, color: 'enamel', opacity: 0.5 },
    { kind: 'throwup', hand: 1, x: 5930, y: 232, scale: 1.0, tilt: 3, color: 'signal', opacity: 0.5 },
];

/** Layer two: the grey that went over layer one. */
export const BUFFS: Buff[] = [
    { x: 692, y: 252, w: 146, h: 92, paint: 0, opacity: 0.9, nap: 21 },
    { x: 1140, y: 490, w: 116, h: 56, paint: 2, opacity: 0.85, nap: 15 },
    { x: 2812, y: 200, w: 196, h: 122, paint: 2, opacity: 0.88, nap: 22 },
    { x: 3574, y: 272, w: 136, h: 86, paint: 1, opacity: 0.9, nap: 20 },
    { x: 5038, y: 236, w: 134, h: 88, paint: 0, opacity: 0.86, nap: 19 },
    { x: 5922, y: 214, w: 300, h: 160, paint: 1, opacity: 0.9, nap: 26 },
];

/* Layer three: the live wall — what each mark is, and where its writer wanted
   it. These are wishes rather than positions: the placement pass at the foot of
   this file is what settles the coordinates, because a corridor this long is
   impossible to keep un-collided by hand and two marks landing on top of each
   other is the one thing that stops reading as a wall and starts reading as a
   mistake. Chevrons only ever point the way you are walking. */
const WISHES: Tag[] = [
    /* 01 Soccer */
    { kind: 'blockbuster', x: 12, y: 296, scale: 0.46, tilt: -3, color: 'enamel', opacity: 0.36 },
    { kind: 'wildstyle', hand: 1, x: 48, y: 250, scale: 1.5, tilt: -6, color: 'signal', keyline: 'steel', opacity: 0.8 },
    { kind: 'scrawl', hand: 1, x: 300, y: 120, scale: 0.8, tilt: 4, color: 'chalk', opacity: 0.7 },
    { kind: 'throwup', hand: 0, x: 90, y: 460, scale: 1.0, tilt: 3, color: 'enamel', keyline: 'signal', opacity: 0.66 },
    { kind: 'chevron', x: 700, y: 496, scale: 0.3, tilt: 2, color: 'signal', opacity: 0.8 },
    { kind: 'handstyle', hand: 0, x: 700, y: 286, scale: 0.42, tilt: -5, color: 'steel', opacity: 0.66 },
    { kind: 'oz', x: 760, y: 96, scale: 1.15, tilt: -4, color: 'signal', keyline: 'steel', opacity: 0.86 },
    { kind: 'handstyle', hand: 2, x: 1142, y: 494, scale: 0.4, tilt: 3, color: 'steel', opacity: 0.62 },
    { kind: 'throwup', hand: 1, x: 1180, y: 470, scale: 1.05, tilt: 4, color: 'enamel', opacity: 0.62 },
    { kind: 'wildstyle', hand: 0, x: 1178, y: 66, scale: 0.9, tilt: 3, color: 'signal', opacity: 0.7 },
    { kind: 'blockbuster', x: 1608, y: 88, scale: 0.66, tilt: -2, color: 'enamel-lit', opacity: 0.3 },
    { kind: 'chevron', x: 1608, y: 30, scale: 0.34, tilt: -2, color: 'signal', opacity: 0.72 },

    /* 02 Gaming */
    { kind: 'oz', x: 1640, y: 210, scale: 1.7, tilt: -3, color: 'signal', keyline: 'steel', opacity: 0.9 },
    { kind: 'scrawl', hand: 2, x: 1630, y: 430, scale: 1.0, tilt: -7, color: 'chalk', opacity: 0.7 },
    { kind: 'throwup', hand: 0, x: 1930, y: 60, scale: 1.0, tilt: -2, color: 'signal', opacity: 0.72 },
    { kind: 'wildstyle', hand: 1, x: 1900, y: 460, scale: 1.15, tilt: 5, color: 'enamel', opacity: 0.6 },
    { kind: 'handstyle', hand: 1, x: 2386, y: 296, scale: 0.4, tilt: 5, color: 'steel', opacity: 0.62 },
    { kind: 'chevron', x: 2384, y: 498, scale: 0.26, tilt: 3, color: 'steel', opacity: 0.5 },
    { kind: 'scrawl', hand: 0, x: 2410, y: 76, scale: 0.86, tilt: -5, color: 'chalk', opacity: 0.68 },
    { kind: 'blockbuster', x: 2816, y: 372, scale: 0.62, tilt: 2, color: 'signal-deep', opacity: 0.34 },
    { kind: 'handstyle', hand: 3, x: 2818, y: 226, scale: 0.6, tilt: -4, color: 'signal', opacity: 0.82 },
    { kind: 'chevron', x: 2816, y: 28, scale: 0.36, tilt: 2, color: 'signal', opacity: 0.78 },
    { kind: 'throwup', hand: 1, x: 2830, y: 130, scale: 1.1, tilt: 4, color: 'signal', keyline: 'steel', opacity: 0.76 },
    { kind: 'wildstyle', hand: 0, x: 2860, y: 420, scale: 1.25, tilt: 5, color: 'enamel', opacity: 0.6 },
    { kind: 'chevron', x: 3138, y: 32, scale: 0.24, tilt: 3, color: 'signal', opacity: 0.66 },

    /* 03 Music */
    { kind: 'scrawl', hand: 1, x: 3160, y: 470, scale: 0.94, tilt: -4, color: 'chalk', opacity: 0.7 },
    { kind: 'oz', x: 3150, y: 110, scale: 1.05, tilt: 6, color: 'signal', keyline: 'steel', opacity: 0.8 },
    { kind: 'handstyle', hand: 0, x: 3584, y: 288, scale: 0.42, tilt: 4, color: 'steel', opacity: 0.6 },
    { kind: 'throwup', hand: 0, x: 3600, y: 490, scale: 1.0, tilt: -5, color: 'enamel', opacity: 0.6 },
    { kind: 'wildstyle', hand: 1, x: 3585, y: 62, scale: 0.9, tilt: -4, color: 'signal', opacity: 0.72 },
    { kind: 'handstyle', hand: 2, x: 4014, y: 288, scale: 0.36, tilt: -5, color: 'steel', opacity: 0.62 },
    { kind: 'chevron', x: 4014, y: 500, scale: 0.22, tilt: -3, color: 'signal', opacity: 0.7 },
    { kind: 'scrawl', hand: 2, x: 4040, y: 496, scale: 0.9, tilt: 6, color: 'chalk', opacity: 0.68 },
    { kind: 'throwup', hand: 1, x: 4030, y: 68, scale: 0.95, tilt: 3, color: 'signal', opacity: 0.7 },

    /* 04 Food */
    { kind: 'wildstyle', hand: 0, x: 4400, y: 250, scale: 1.4, tilt: -4, color: 'signal', keyline: 'steel', opacity: 0.82 },
    { kind: 'throwup', hand: 0, x: 4390, y: 460, scale: 1.05, tilt: 3, color: 'enamel', opacity: 0.62 },
    { kind: 'handstyle', hand: 4, x: 4580, y: 300, scale: 0.34, tilt: 5, color: 'steel', opacity: 0.6 },
    { kind: 'oz', x: 5060, y: 100, scale: 1.1, tilt: -5, color: 'signal', keyline: 'steel', opacity: 0.8 },
    { kind: 'handstyle', hand: 1, x: 5042, y: 252, scale: 0.42, tilt: 4, color: 'steel', opacity: 0.66 },
    { kind: 'chevron', x: 5042, y: 494, scale: 0.26, tilt: 2, color: 'enamel', opacity: 0.55 },
    { kind: 'scrawl', hand: 0, x: 5060, y: 486, scale: 0.9, tilt: 7, color: 'chalk', opacity: 0.7 },
    { kind: 'handstyle', hand: 3, x: 5474, y: 294, scale: 0.35, tilt: 3, color: 'steel', opacity: 0.6 },
    { kind: 'throwup', hand: 1, x: 5510, y: 476, scale: 1.02, tilt: 3, color: 'enamel', opacity: 0.62 },
    { kind: 'wildstyle', hand: 1, x: 5490, y: 60, scale: 0.92, tilt: 4, color: 'signal', opacity: 0.72 },
    { kind: 'blockbuster', x: 5938, y: 58, scale: 0.95, tilt: -2, color: 'enamel', keyline: 'chalk', opacity: 0.34 },
    { kind: 'handstyle', hand: 0, x: 5928, y: 250, scale: 0.9, tilt: -3, color: 'steel', opacity: 0.76 },
    { kind: 'chevron', x: 5936, y: 402, scale: 0.55, tilt: -4, color: 'signal', opacity: 0.9 },
    { kind: 'oz', x: 5980, y: 500, scale: 0.7, tilt: -5, color: 'signal', keyline: 'steel', opacity: 0.72 },
];

export interface Sticker {
    pictogram: PictogramName;
    x: number;
    y: number;
    size: number;
    tilt: number;
    scheme: 'signal' | 'enamel' | 'steel';
}

export const STICKERS: Sticker[] = [
    { pictogram: 'ball', x: 250, y: 500, size: 40, tilt: -12, scheme: 'signal' },
    { pictogram: 'play', x: 1230, y: 54, size: 32, tilt: 9, scheme: 'enamel' },
    { pictogram: 'controller', x: 1880, y: 505, size: 42, tilt: 14, scheme: 'steel' },
    { pictogram: 'record', x: 2960, y: 500, size: 38, tilt: -9, scheme: 'signal' },
    { pictogram: 'terminus', x: 3220, y: 50, size: 30, tilt: 11, scheme: 'enamel' },
    { pictogram: 'bowl', x: 4620, y: 505, size: 42, tilt: -14, scheme: 'signal' },
    { pictogram: 'interchange', x: 5140, y: 48, size: 32, tilt: 8, scheme: 'steel' },
    { pictogram: 'pin', x: 6080, y: 500, size: 34, tilt: 12, scheme: 'enamel' },
];


/* ── Where the marks actually land ─────────────────────────────────────────
   A real writer works the wall in front of them: they pick a spot, and if
   somebody's piece is already there they shift along until they find clear
   tile. They do not paint a throw-up through a handstyle, because the result
   is unreadable and every writer on that wall would rather be read.

   So the corridor does the same. Each wish above is tried where it was asked
   for, then at rings of increasing offset around it, and it takes the first
   spot that is clear of every mark already up, clear of the zone gates and
   decals that get drawn over the paint, and inside the tile — under the
   ceiling duct, above the platform line. Among the clear spots it prefers the
   one the sheets hide least, and it will go up smaller before it goes up on
   top of somebody. A mark that can find no room at all never went up.

   Biggest first, because the pieces that need a whole bay have nowhere else to
   go, while a handstyle fits in any gap left over. */

interface Rect { x: number; y: number; w: number; h: number }

/** The band of tile a mark is allowed to land on: below the ceiling ducting,
 *  above the platform line. */
const MARK_TOP = 34;
const MARK_BOTTOM = LINE_Y - 10;
/** Clear tile kept between two marks. Closer than this and they read as one
 *  smudge rather than as two hands. */
const MARK_GUTTER = 16;
/** How far a mark may be walked from where it was wanted, and how much smaller
 *  it will go up rather than not go up at all. */
const MARK_REACH = 360;
const MARK_SHRINK = [1, 0.86, 0.72, 0.6];
/** How much of a mark has to stay in the clear for it to be worth painting.
 *  Below this the sheets have eaten it, and a writer would have moved along. */
const MIN_SEEN = 0.45;

function inflate(r: Rect, by: number): Rect {
    return { x: r.x - by, y: r.y - by, w: r.w + by * 2, h: r.h + by * 2 };
}

function hits(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function shared(a: Rect, b: Rect): number {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
}

/** The tile a mark actually covers: its own drawing grid, scaled, spun about
 *  its origin by its tilt, and grown by the marker's nib and by however far
 *  the paint ran. Anything less and the boxes lie about the paint. */
function markBox(t: Tag): Rect {
    const family = MARKS[t.kind];
    const art = family[(t.hand ?? 0) % family.length];
    const pad = (art.nib ?? 0) / 2 + 3;
    const run = art.drips
        ? Math.max(0, ...art.drips.map(([, dy, len]) => dy + len - art.h))
        : 0;
    const corners: [number, number][] = [
        [-pad, -pad], [art.w + pad, -pad],
        [art.w + pad, art.h + pad + run], [-pad, art.h + pad + run],
    ];
    const a = (t.tilt * Math.PI) / 180;
    const cos = Math.cos(a), sin = Math.sin(a);
    const xs: number[] = [], ys: number[] = [];
    for (const [cx, cy] of corners) {
        const sx = cx * t.scale, sy = cy * t.scale;
        xs.push(t.x + sx * cos - sy * sin);
        ys.push(t.y + sx * sin + sy * cos);
    }
    const x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

/** The rings a writer searches outward through. Wider than they are tall,
 *  because a corridor gives you far more wall sideways than it does up. */
const NUDGES: [number, number][] = (() => {
    const out: [number, number][] = [[0, 0]];
    for (let r = 16; r <= MARK_REACH; r += 16) {
        for (let step = 0; step < 12; step++) {
            const a = (step * Math.PI) / 6;
            out.push([Math.round(Math.cos(a) * r * 1.7), Math.round(Math.sin(a) * r)]);
        }
    }
    return out;
})();

/** What is painted over the graffiti and would cut a mark in half: the zone
 *  gates, which are full-height enamel, and the vinyl decals. */
const FIXTURES: Rect[] = [
    ...ZONES.map(z => ({ x: z.x - 10, y: 0, w: 146, h: WALL_H - 40 })),
    ...STICKERS.map(s => ({
        x: s.x - s.size * 0.85, y: s.y - s.size * 0.85,
        w: s.size * 1.7, h: s.size * 1.7,
    })),
];

/** The sheets. Not obstacles — paste a poster over a piece and the piece is
 *  simply older than the poster — but paint nobody can see was a wasted can,
 *  so a spot in the clear beats a spot behind a sheet. */
const SHEETS: Rect[] = POSTERS.map(p => ({ x: p.x - p.w / 2, y: p.y, w: p.w, h: p.h }));

function paintWall(wishes: Tag[]): Tag[] {
    const order = wishes
        .map((tag, i) => {
            const box = markBox(tag);
            return { tag, i, size: box.w * box.h };
        })
        .sort((a, b) => b.size - a.size);

    const taken: Rect[] = [];
    const up: { tag: Tag; i: number }[] = [];

    for (const { tag: wish, i } of order) {
        let best: { tag: Tag; box: Rect; score: number } | null = null;

        for (const shrink of MARK_SHRINK) {
            for (const [dx, dy] of NUDGES) {
                const tag: Tag = {
                    ...wish,
                    x: wish.x + dx, y: wish.y + dy,
                    scale: wish.scale * shrink,
                };
                const box = markBox(tag);
                if (box.y < MARK_TOP || box.y + box.h > MARK_BOTTOM) continue;
                if (box.x < 8 || box.x + box.w > CORRIDOR_W - 8) continue;

                const room = inflate(box, MARK_GUTTER);
                if (FIXTURES.some(r => hits(room, r))) continue;
                if (taken.some(r => hits(room, r))) continue;

                const hidden = SHEETS.reduce((n, r) => n + shared(box, r), 0);
                const seen = 1 - Math.min(1, hidden / (box.w * box.h));
                if (seen < MIN_SEEN) continue;
                const score = seen * 900 - Math.hypot(dx * 0.45, dy) - (1 - shrink) * 260;
                if (!best || score > best.score) best = { tag, box, score };
            }
            /* Only go up smaller if there was no room at full size. */
            if (best) break;
        }

        /* No clear tile anywhere within reach: this one never went up. */
        if (!best) continue;
        taken.push(best.box);
        up.push({ tag: best.tag, i });
    }

    /* Back into corridor order, so the wall still reads as a walk. */
    return up.sort((a, b) => a.i - b.i).map(m => m.tag);
}

export const TAGS: Tag[] = paintWall(WISHES);
