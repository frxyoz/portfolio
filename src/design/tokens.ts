import type { CSSProperties } from 'react';

/* Design tokens — Concourse.
 *
 * The home page is built as a transit sign system: enamel panels, black steel
 * rails, split-flap cells, route diagrams. Colour here is not decoration, it is
 * category, and the categories are fixed by law:
 *
 *   SIGNAL (yellow)  the path forward — primary fields, primary actions
 *   ENAMEL (blue)    information and services — the desk, the route line
 *   STEEL  (black)   structure — rails, frames, the board itself
 *   RED              awards, and nothing else
 *   GREEN            deployed and live, and nothing else
 *
 * Nothing on this page is ever tinted red or green for emphasis. If a colour
 * appears, it is making a claim about what the thing is.
 *
 * Values are raw hex rather than `var(--x)` on purpose: the components are
 * inline-styled and lean on hex-alpha concatenation (`${SIGNAL}33`), which
 * `var()` cannot express. globals.css mirrors the few values CSS itself needs.
 *
 * The MindDo case study at /projects/minddo carries its own neutral palette in
 * src/components/minddo/ui.tsx and does not read this file.
 */

/* ── Signal yellow — the path forward ─────────────────────────────────────── */

/** The primary sign field. Everything black on it clears 12:1. */
export const SIGNAL = '#ffd100';
/** Pressed and hover state for a signal-filled control. */
export const SIGNAL_DEEP = '#e0b400';
/** Signal yellow as a glyph on the black board. 12.9:1 on {@link BOARD}. */
export const SIGNAL_LAMP = '#ffd100';
/** Secondary text ON the yellow field. Tinted from the field's own hue rather
 *  than greyed: 5.1:1 on {@link SIGNAL}. */
export const SIGNAL_INK_SOFT = '#6b5400';

/* ── Enamel blue — information and services ───────────────────────────────── */

/** The information ground: the contact desk, the route line, service plates. */
export const ENAMEL = '#0a2a66';
/** A raised or hovered enamel plate. */
export const ENAMEL_LIT = '#123c8c';
/** Enamel blue as a glyph on a light ground. 9.6:1 on {@link SIGN_WHITE}. */
export const ENAMEL_INK = '#0a2a66';
/** Secondary text ON enamel blue, tinted from the ground's hue. 6.3:1. */
export const ENAMEL_INK_SOFT = '#9fb4de';

/* ── Steel — structure ────────────────────────────────────────────────────── */

/** Rails, frames, sign edges, and type on any light ground. */
export const STEEL = '#141414';
/** A rail's inner division, and the seam across a flap cell. */
export const STEEL_SOFT = '#2a2a2a';
/** The board ground. Deeper than the rails so the board reads as recessed. */
export const BOARD = '#0d0d0d';
/** A board row under the pointer, before it takes the signal field. */
export const BOARD_LIT = '#1a1a1a';

/* ── Sign white — the light ground ────────────────────────────────────────── */

/** Sign-face white: the light sections' ground. Not pure white — a painted
 *  panel never is, and the eye reads the difference as material. */
export const SIGN_WHITE = '#f4f3ef';
/** A second light ground, one step down, for plates laid on SIGN_WHITE. */
export const CHALK = '#e6e4dd';
/** Body copy on a light ground. 12.4:1 on {@link SIGN_WHITE}. */
export const SIGN_INK = '#1b1b1b';
/** Secondary copy on a light ground. 5.1:1 on {@link SIGN_WHITE}. */
export const SIGN_INK_SOFT = '#55534d';
/** Type on the black board. 17.8:1 on {@link BOARD}. */
export const BOARD_INK = '#f4f3ef';
/** Secondary type on the black board. 7.4:1 on {@link BOARD}. */
export const BOARD_INK_SOFT = '#a3a099';
/** A control that is switched off. Its one call site is the sheet's prev/next
 *  gate, which sits on the {@link STEEL} rail: 3.47:1 there, and 4.79:1 if it
 *  is ever put on {@link SIGN_WHITE}. A disabled control is exempt from 1.4.3,
 *  and the value is set to stay legible rather than to disappear — a gate a
 *  visitor cannot press should still say which gate it is. */
export const DISABLED_TEXT = '#6e6b64';

/* ── Status lamps — reserved by law ───────────────────────────────────────── */

/** Awards. Measured against the two light grounds it has to survive: 6.7:1 on
 *  {@link SIGN_WHITE} and 5.1:1 on {@link SIGNAL}, which is the one that sets
 *  the value — a row under the pointer takes the signal field, and the lamp on
 *  it is 10px bold text with no exemption from 1.4.3. */
export const RED = '#a81a14';
/** The same claim on the black board, brightened to clear 4.5:1 there (4.9:1).
 *  Two values, one meaning — the same split the site has always run for its
 *  accent, and for the same reason: a lamp that only passes on one surface is
 *  a lamp that fails somewhere on the page. */
export const RED_LAMP = '#ff4b3e';
/** Deployed and running. 7.3:1 on {@link SIGN_WHITE}, 5.6:1 on {@link SIGNAL}
 *  — same reasoning as {@link RED}. */
export const GREEN = '#005c38';
/** The same claim on the black board. 9.8:1 on {@link BOARD}. */
export const GREEN_LAMP = '#2ed47a';

/* ── Rules ────────────────────────────────────────────────────────────────── */

/** Hairline on a light ground. */
export const RULE = '#d5d2ca';
/** The same hairline where it has to survive a plate's own fill. */
export const RULE_STRONG = '#bdb9b0';
/** Hairline on the black board — the gap between two flap rows. */
export const RULE_DARK = '#2a2a2a';

/* ── Motion ───────────────────────────────────────────────────────────────── */

/** ease-out-quint. The site's one deceleration curve. */
export const EASE_OUT = 'cubic-bezier(.22, 1, .36, 1)';
/** ease-in-quart, for things accelerating away from the viewer. */
export const EASE_IN = 'cubic-bezier(.5, 0, .78, .2)';

/* ── Type ─────────────────────────────────────────────────────────────────── */

/* One family across the whole sign system, read at every width and weight the
 * variable axes allow — which is how a real wayfinding programme is built. The
 * drama comes from scale and from the width axis, never from a second face. */

/** The sign face. Archivo Variable: weight 100–900, width 62–125. */
export const SIGN = 'var(--font-sign, "Archivo", "Helvetica Neue", Arial, sans-serif)';
/** Alias for call sites reading as display type. */
export const DISPLAY = SIGN;
/** Alias for call sites reading as body copy. */
export const BODY = SIGN;

/** Board and data lettering: condensed, tracked, tabular figures. Spread onto
 *  any element that renders a time, a year, a count or a measurement. */
export const TABULAR: CSSProperties = {
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1',
};


/* ── Type scale ───────────────────────────────────────────────────────────── */

/* A sign programme sets its lettering at a fixed set of heights, because the
 * sizes are what encode rank: a visitor reads "this is a column head, that is a
 * destination" from height before they read a word. Every literal font size on
 * this page had drifted onto its own value — 23 of them across nine files,
 * which is a continuum, not a ramp. These are the only heights the home page
 * uses; the display lettering above them is clamped and fluid by nature.
 *
 * Roughly 1.12 between steps, which is tight enough that neighbouring ranks
 * stay distinguishable and loose enough that nothing needs a half-step. */
export const TYPE = {
    /** Board column heads and the smallest plate lettering. */
    MICRO: '0.58rem',
    /** Chips, status lamps, plate labels — the system's workhorse caps size. */
    LABEL: '0.66rem',
    /** Anything you click: nav links, buttons, gates, social rows. */
    CONTROL: '0.74rem',
    /** Years, counts, secondary rows, the rail clock. */
    META: '0.82rem',
    /** Supporting copy inside a panel. */
    COPY: '0.9rem',
    /** Default reading size, and the floor for a form field: Safari zooms into anything smaller on focus and never zooms back. */
    BODY: '1.0rem',
    /** The opening paragraph of a section. */
    LEDE: '1.14rem',
    /** A station title, a stack entry, a detail heading. */
    TITLE: '1.32rem',
    /** The largest step that is not a clamped display size. */
    SUBHEAD: '1.5rem',
} as const;

/* ── Focus ────────────────────────────────────────────────────────────────── */

/** Ring colour for keyboard focus on a dark or coloured ground. */
export const FOCUS_RING = '#ffd100';
/** Ring colour for keyboard focus on the yellow field, where the yellow ring
 *  would disappear into its own ground. */
export const FOCUS_RING_LIGHT = '#141414';

/* ── Legacy aliases ───────────────────────────────────────────────────────── */

/* The mind-map overlay reads these names. They now carry Concourse values, so
 * it inherits the world instead of holding the old gold on its own. */
export const ACCENT_TEXT = SIGNAL;
export const ACCENT = SIGNAL;
export const INK = STEEL;
export const CANVAS = SIGN_WHITE;
