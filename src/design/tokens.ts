/* Design tokens — the canonical source for this site's colour.
 *
 * Values are raw hex rather than `var(--x)` on purpose: the components are
 * written in inline styles and lean hard on hex-alpha concatenation
 * (`${ACCENT}33`), which `var()` cannot express. globals.css mirrors the few
 * values it needs as custom properties and says so at the declaration.
 *
 * Two golds, not one. #b8860b is 3.25:1 on white — fine for a rule, a dot or a
 * drawn line, and a WCAG AA failure for anything anyone has to read. Text uses
 * the darker `accent`; ornament keeps the original. They are the same hue, so
 * the page still reads as one colour.
 */

/* ── Brand ───────────────────────────────────────────────────────────────── */

/** Gold for text. 5.3:1 on white, 5.1:1 on `CANVAS_ALT`. Use for any glyph. */
export const ACCENT_TEXT = '#8a6508';
/** Alias of {@link ACCENT_TEXT} for call sites that read better unqualified. */
export const ACCENT = ACCENT_TEXT;
/** Gold for ornament: rules, dots, borders, the signature trace. Never text.
 *
 *  3.25:1 on white — it clears the 3:1 non-text bar and fails the 4.5:1 text
 *  bar. Import it as `ACCENT_ORNAMENT`, not aliased to `ACCENT`: every contrast
 *  failure this site has had came from a hover handler assigning the alias to
 *  `color`, which reads as correct at the call site and is not. */
export const ACCENT_ORNAMENT = '#b8860b';
/** Pressed/hover state for accent-filled buttons. */
export const ACCENT_DEEP = '#6d5006';
/** Lift for a gold-filled button under the pointer. 7.3:1 against {@link INK}. */
export const ACCENT_LIFT = '#d4a017';

/* ── Ink ─────────────────────────────────────────────────────────────────── */

/** Headings and highest-emphasis text. */
export const INK = '#1a1a1a';
/** Display lettering only — 4.5:1, sized well past the large-text threshold. */
export const INK_SOFT = '#7a7672';
/** Default body copy. */
export const BODY_TEXT = '#3a3530';
/** Secondary body copy, long-form descriptions. */
export const BODY_MUTED = '#4a4540';
/** Labels, meta, eyebrow text. Sized against the *warmest* surface it lands on
 *  (the contact section's #f5f0e8), not against white — 4.83:1 there, 5.48:1 on
 *  white. A token that only passes on the lightest background is a token that
 *  fails somewhere on the page. */
export const MUTED = '#6f6862';
/** Text on a control that is switched off. Exempt from 1.4.3, but 3.1:1 rather
 *  than the 2.2:1 it was, so "unavailable" still reads as a word and not a
 *  smudge. */
export const DISABLED_TEXT = '#8e877f';

/* ── Surfaces ────────────────────────────────────────────────────────────── */

export const CANVAS = '#ffffff';
/** Warm off-white for alternating sections. */
export const CANVAS_ALT = '#fafaf7';
/** The deepest warm ground on the site — the contact section. Every ratio in
 *  that section is measured against this, not against white. */
export const CANVAS_WARM = '#f5f0e8';
/** Text selection highlight. */
export const SELECTION = '#f5e6a3';

/* ── Status ──────────────────────────────────────────────────────────────── */

/** Something failed and the visitor has to act. 6.3:1 on {@link CANVAS_WARM}. */
export const DANGER = '#a32b1e';

/* ── Rules ───────────────────────────────────────────────────────────────── */

/** Hairline divider on a light ground. Structure, never a glyph. */
export const RULE = '#e0ddd8';
/** The same hairline where it has to survive against a control's own fill. */
export const RULE_STRONG = '#d3cec7';

/* ── Motion ──────────────────────────────────────────────────────────────── */

/** ease-out-quint. The site's one deceleration curve. */
export const EASE_OUT = 'cubic-bezier(.22, 1, .36, 1)';
/** ease-in-quart, for things accelerating away from the viewer. */
export const EASE_IN = 'cubic-bezier(.5, 0, .78, .2)';

/* ── Type ────────────────────────────────────────────────────────────────── */

export const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
export const BODY = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';
export const HANDWRITTEN = 'var(--font-handwritten, "Caveat", cursive)';

/* ── Focus ───────────────────────────────────────────────────────────────── */

/** Ring colour for keyboard focus. Meets the 3:1 non-text bar on every surface. */
export const FOCUS_RING = '#8a6508';
