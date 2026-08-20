import type { PictogramName } from '@/components/concourse/Pictogram';
import type { SCHEMES } from './art';

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
export const CORRIDOR_TAIL = 300;

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
        scheme: 'enamel', mount: 'panel',
        note: 'The club, and the games that scratch the same itch.',
        x: 500, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'tottenham', zone: 'soccer', name: 'Tottenham', art: 'tottenham',
        scheme: 'steel', mount: 'flyposter',
        note: 'A Spurs fan since 2019 — through the highs and the (many) lows.',
        x: 990, y: 112, w: 296, h: 380, tilt: -1.8,
    },
    {
        id: 'fifafm', zone: 'soccer', name: 'FIFA / FM', art: 'fifafm',
        scheme: 'signal', mount: 'panel',
        note: 'Management games I lose whole days to — strategy, stats, squad-building.',
        x: 1430, y: 100, w: 344, h: 356, tilt: 0,
        interchange: ['soccer', 'gaming'],
    },

    /* ── 02 Gaming ─────────────────────────────────────────────────────── */
    {
        id: 'gaming', zone: 'gaming', name: 'Gaming', art: 'gaming',
        scheme: 'steel', mount: 'panel',
        note: 'Squad-building at one end, competitive Pokémon at the other.',
        x: 2180, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'pokemon', zone: 'gaming', name: 'Pokémon', art: 'pokemon',
        scheme: 'paper', mount: 'flyposter',
        note: 'Competitive player — once ran a YouTube channel on gimmicky teams.',
        x: 2660, y: 118, w: 306, h: 372, tilt: 2.2,
        link: { href: 'https://www.youtube.com/@froxyproxy', label: '@froxyproxy' },
    },

    /* ── 03 Music ──────────────────────────────────────────────────────── */
    {
        id: 'music', zone: 'music', name: 'Music', art: 'music',
        scheme: 'signal', mount: 'panel',
        note: 'Playing it and listening to it, in roughly equal measure.',
        x: 3380, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'piano', zone: 'music', name: 'Piano', art: 'piano',
        scheme: 'enamel', mount: 'flyposter',
        note: 'Twelve years in — my favorite way to unwind. Soft spot for ragtime.',
        x: 3860, y: 114, w: 300, h: 376, tilt: -2.4,
    },
    {
        id: 'listening', zone: 'music', name: 'Listening', art: 'listening',
        scheme: 'steel', mount: 'panel',
        note: 'A lot of music, across every genre.',
        x: 4290, y: 100, w: 336, h: 356, tilt: 0,
        link: { href: 'https://www.last.fm/user/olriczzz', label: 'last.fm/olriczzz' },
    },

    /* ── 04 Food ───────────────────────────────────────────────────────── */
    {
        id: 'food', zone: 'food', name: 'Food', art: 'food',
        scheme: 'paper', mount: 'panel',
        note: 'Eating it, mostly. Cooking it, increasingly.',
        x: 4840, y: 84, w: 400, h: 404, tilt: 0,
    },
    {
        id: 'noodles', zone: 'food', name: 'Noodles', art: 'noodles',
        scheme: 'signal', mount: 'flyposter',
        note: 'Noodles above all — my one true favorite.',
        x: 5320, y: 116, w: 300, h: 372, tilt: 1.6,
    },
    {
        id: 'cooking', zone: 'food', name: 'Cooking', art: 'cooking',
        scheme: 'enamel', mount: 'panel',
        note: 'Slowly getting into cooking and baking, too.',
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
    /** Which authored letterform, from `wall.tsx`. */
    kind: 'oz' | 'wildstyle' | 'throwup' | 'scrawl';
    x: number;
    y: number;
    scale: number;
    tilt: number;
    color: 'signal' | 'enamel' | 'chalk';
    opacity: number;
}

export const TAGS: Tag[] = [
    /* 01 Soccer */
    { kind: 'wildstyle', x: 48, y: 250, scale: 1.5, tilt: -6, color: 'signal', opacity: 0.8 },
    { kind: 'scrawl', x: 300, y: 120, scale: 0.8, tilt: 4, color: 'chalk', opacity: 0.7 },
    { kind: 'throwup', x: 90, y: 460, scale: 1.0, tilt: 3, color: 'enamel', opacity: 0.66 },
    { kind: 'oz', x: 760, y: 96, scale: 1.15, tilt: -4, color: 'signal', opacity: 0.86 },
    { kind: 'scrawl', x: 730, y: 486, scale: 0.9, tilt: 3, color: 'chalk', opacity: 0.72 },
    { kind: 'throwup', x: 1180, y: 470, scale: 1.05, tilt: 4, color: 'enamel', opacity: 0.62 },
    { kind: 'wildstyle', x: 1178, y: 66, scale: 0.9, tilt: 3, color: 'signal', opacity: 0.7 },

    /* 02 Gaming */
    { kind: 'oz', x: 1640, y: 210, scale: 1.7, tilt: -3, color: 'signal', opacity: 0.9 },
    { kind: 'scrawl', x: 1630, y: 430, scale: 1.0, tilt: -7, color: 'chalk', opacity: 0.7 },
    { kind: 'throwup', x: 1930, y: 60, scale: 1.0, tilt: -2, color: 'signal', opacity: 0.72 },
    { kind: 'wildstyle', x: 1900, y: 460, scale: 1.15, tilt: 5, color: 'enamel', opacity: 0.6 },
    { kind: 'scrawl', x: 2410, y: 76, scale: 0.86, tilt: -5, color: 'chalk', opacity: 0.68 },
    { kind: 'throwup', x: 2830, y: 130, scale: 1.1, tilt: 4, color: 'signal', opacity: 0.76 },
    { kind: 'wildstyle', x: 2860, y: 420, scale: 1.25, tilt: 5, color: 'enamel', opacity: 0.6 },

    /* 03 Music */
    { kind: 'scrawl', x: 3160, y: 470, scale: 0.94, tilt: -4, color: 'chalk', opacity: 0.7 },
    { kind: 'oz', x: 3150, y: 110, scale: 1.05, tilt: 6, color: 'signal', opacity: 0.8 },
    { kind: 'throwup', x: 3600, y: 490, scale: 1.0, tilt: -5, color: 'enamel', opacity: 0.6 },
    { kind: 'wildstyle', x: 3585, y: 62, scale: 0.9, tilt: -4, color: 'signal', opacity: 0.72 },
    { kind: 'scrawl', x: 4040, y: 496, scale: 0.9, tilt: 6, color: 'chalk', opacity: 0.68 },
    { kind: 'throwup', x: 4030, y: 68, scale: 0.95, tilt: 3, color: 'signal', opacity: 0.7 },

    /* 04 Food */
    { kind: 'wildstyle', x: 4400, y: 250, scale: 1.4, tilt: -4, color: 'signal', opacity: 0.82 },
    { kind: 'throwup', x: 4390, y: 460, scale: 1.05, tilt: 3, color: 'enamel', opacity: 0.62 },
    { kind: 'oz', x: 5060, y: 100, scale: 1.1, tilt: -5, color: 'signal', opacity: 0.8 },
    { kind: 'scrawl', x: 5060, y: 486, scale: 0.9, tilt: 7, color: 'chalk', opacity: 0.7 },
    { kind: 'throwup', x: 5510, y: 476, scale: 1.02, tilt: 3, color: 'enamel', opacity: 0.62 },
    { kind: 'wildstyle', x: 5490, y: 60, scale: 0.92, tilt: 4, color: 'signal', opacity: 0.72 },
    { kind: 'oz', x: 5980, y: 250, scale: 1.6, tilt: -5, color: 'signal', opacity: 0.88 },
    { kind: 'scrawl', x: 5970, y: 470, scale: 0.95, tilt: -6, color: 'chalk', opacity: 0.7 },
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
