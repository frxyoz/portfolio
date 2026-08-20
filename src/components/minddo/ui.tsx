'use client';

import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react';

import {
    SIGNAL, ENAMEL, STEEL, STEEL_SOFT, SIGN_WHITE, CHALK,
    SIGN_INK, SIGN_INK_SOFT, RED, GREEN, RULE, RULE_STRONG,
    EASE_OUT, SIGN, TYPE,
} from '@/design/tokens';

/* The case study, in the sign system.
 *
 * This page used to run a palette and a typeface of its own — a deliberate
 * divergence from the portfolio, on the argument that dense documentation
 * wants neutrality. The argument was sound and the seam was still visible: two
 * worlds, one site, and this is the artifact a hiring manager reads longest.
 * So it is Concourse now, with the reading discipline a twenty-minute read
 * needs: grounds change *between* sections, never underneath body copy, and
 * the reading column stays sign white and uncoloured from top to bottom.
 *
 * ── The schematic exemption ───────────────────────────────────────────────
 * Concourse reserves red for an award and green for a deployed service. Seven
 * diagrams on this page turn on a blocked-versus-allowed distinction that red
 * and green are the only honest colours for, so this surface — and only this
 * surface — reads them a second way:
 *
 *     red    a request that is refused
 *     green  a request that is admitted
 *
 * The two readings never meet, because there is no award anywhere on this page
 * and "deployed and running" appears exactly once, in the hero's status row,
 * where it keeps its original meaning. The remaining three schematic tones are
 * drawn straight out of the palette rather than invented: compute is signal,
 * storage is enamel, anything outside the system is steel. Every figure that
 * uses them ships a legend naming which is which.
 */
export const T = {
    ink: SIGN_INK,
    body: SIGN_INK,
    /* Concourse ships two ink tiers on a light ground and no more, so the
       four this page used collapse to two. Rank is carried by weight and by
       the width axis instead, which is the system's own instruction. */
    muted: SIGN_INK_SOFT,
    faint: SIGN_INK_SOFT,
    rule: RULE,
    ruleStrong: RULE_STRONG,
    surface: CHALK,
    surfaceAlt: SIGN_WHITE,
    canvas: SIGN_WHITE,
    /* Information and services — which is what a label on a documentation page
       is. 9.6:1 on the reading ground. */
    accent: ENAMEL,
    accentSoft: CHALK,
    /* Structural signal: bars, plates, the lit rail marker. Never a glyph on a
       light ground, where yellow does not clear anything. */
    accentOrnament: SIGNAL,

    /* ── Schematic tones. See the exemption above. ─────────────────────── */
    /** Compute — the tier that does work. Signal yellow, pulled to a fill. */
    tier: { fill: '#ffeeb0', stroke: '#8a6c00', text: '#3a2d00' },
    /** Storage. Enamel blue. */
    store: { fill: '#dbe4f6', stroke: ENAMEL, text: ENAMEL },
    /** Outside the system: someone else's service, someone else's URL. */
    extern: { fill: CHALK, stroke: STEEL_SOFT, text: STEEL },
    /** Refused. */
    bad: { fill: '#f7dedc', stroke: RED, text: '#6e120d' },
    /** The same refusal pulled back to a ground a paragraph can sit on. */
    badSurface: '#faeeec',
    /** Admitted. */
    good: { fill: '#dcefe4', stroke: GREEN, text: '#0b3f26' },
} as const;

export type Tone = 'tier' | 'store' | 'extern' | 'bad' | 'good';

/** Present to assistive technology, absent to the eye. */
export const SR_ONLY: CSSProperties = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

/** One face, the same one the rest of the site is set in. */
export const FONT = SIGN;
/* The single exception to the One Face Rule, and it is scoped to what a
   monospace is actually for: an identifier, a route, a filename, a config key
   — strings whose character-by-character shape is the content. It is not
   allowed to carry a figure label, a metric, a heading or a section index,
   all of which it used to, and all of which are Archivo now. */
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* ── Sign-system type roles, local to this page ──────────────────────────── */

/** Plate lettering: the workhorse uppercase micro-label. */
export const PLATE: CSSProperties = {
    fontFamily: SIGN, fontSize: TYPE.LABEL, fontWeight: 800,
    fontStretch: '88%', letterSpacing: '0.18em', textTransform: 'uppercase',
    lineHeight: 1,
};
/** The smallest plate lettering: column heads, legend entries. */
export const MICRO_PLATE: CSSProperties = {
    ...PLATE, fontSize: TYPE.MICRO, letterSpacing: '0.2em',
};
/** Anything you click. */
export const CONTROL: CSSProperties = {
    fontFamily: SIGN, fontSize: TYPE.CONTROL, fontWeight: 700,
    fontStretch: '88%', letterSpacing: '0.16em', textTransform: 'uppercase',
    lineHeight: 1,
};

/* ── Text primitives ─────────────────────────────────────────────────────── */

/* A section opener on this page is the same device the home page uses — the
   headline followed by a solid accent bar — at the scale eleven of them in one
   document can carry. The bar is what a visitor scrolling fast actually reads:
   it says "a new section starts here" before a single word is legible. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
    return (
        <div style={{ scrollMarginTop: 84, marginBottom: 22 }} id={id}>
            <h2 style={{
                fontFamily: FONT, fontSize: 'clamp(1.9rem, 3.4vw, 2.5rem)', fontWeight: 800,
                fontStretch: '104%', letterSpacing: '-0.025em', lineHeight: 1,
                color: T.ink, margin: 0, textWrap: 'balance',
            }}>
                {children}
            </h2>
            <div aria-hidden style={{ height: 12, width: 120, background: T.accentOrnament, marginTop: 16 }} />
        </div>
    );
}

export function H3({ children }: { children: ReactNode }) {
    return (
        <h3 style={{
            fontFamily: FONT, fontSize: TYPE.TITLE, fontWeight: 700, fontStretch: '96%',
            color: T.ink, letterSpacing: '-0.012em', lineHeight: 1.2,
            marginTop: 30, marginBottom: 10,
        }}>
            {children}
        </h3>
    );
}

export function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    return (
        <p style={{
            fontFamily: FONT, fontSize: TYPE.BODY, fontWeight: 400,
            color: T.body, lineHeight: 1.68, maxWidth: '68ch', marginBottom: 16, ...style,
        }}>
            {children}
        </p>
    );
}

export function C({ children }: { children: ReactNode }) {
    return (
        <code style={{
            fontFamily: MONO, fontSize: '0.86em', color: T.ink,
            background: T.surface, boxShadow: `inset 0 0 0 1px ${T.ruleStrong}`,
            padding: '1px 5px', whiteSpace: 'nowrap',
        }}>
            {children}
        </code>
    );
}

export function Lede({ children }: { children: ReactNode }) {
    return (
        <p style={{
            fontFamily: FONT, fontSize: TYPE.LEDE, fontWeight: 400,
            color: T.body, lineHeight: 1.62, maxWidth: '58ch', marginBottom: 20,
        }}>
            {children}
        </p>
    );
}

/* A notice on a concourse is a panel with a plate bolted across its head, not
   a tinted box with a coloured edge. The plate carries the one word that says
   what kind of notice it is; the panel below it is a plain ground. */
export function Note({ label, tone = 'accent', children }: { label: string; tone?: 'accent' | 'warn'; children: ReactNode }) {
    const warn = tone === 'warn';
    return (
        <div style={{
            background: warn ? T.badSurface : T.surface,
            margin: '22px 0', maxWidth: '68ch',
        }}>
            <div style={{
                ...PLATE,
                background: warn ? T.bad.stroke : STEEL,
                color: warn ? SIGN_WHITE : SIGNAL,
                padding: '9px 14px',
            }}>
                {label}
            </div>
            <div style={{
                fontFamily: FONT, fontSize: TYPE.COPY, color: T.body, lineHeight: 1.68,
                padding: '14px 16px 16px',
            }}>
                {children}
            </div>
        </div>
    );
}

/* ── Table ───────────────────────────────────────────────────────────────── */

export function Table({ head, rows, widths, label }: {
    head: string[];
    rows: ReactNode[][];
    widths?: string[];
    /** Names the table for a screen reader and for the scroll region around it.
     *  Not rendered — the prose above every table already introduces it. */
    label?: string;
}) {
    const name = label ?? `${head[0]} table`;
    /* A minimum the columns can actually live in, rather than one number for
       every table on the page. 560px shared between three columns is 186px
       each, which folds `/showcases/{id}/{file}` onto two lines and a note
       onto five — and since a row is as tall as its tallest cell, the phone
       got a timetable of 350px rows mostly full of nothing. A row is only as
       short as its longest cell allows, so the allowance has to be wide enough
       for the notes column, not just for the route: 300px a column keeps the
       routes on one line and the notes to three or four. The region scrolls,
       which is what it is for. */
    const minWidth = Math.max(560, head.length * 300);
    return (
        /* On a phone this always scrolls sideways. A div that scrolls but
           cannot be focused is unreachable without a pointer: `tabindex="0"`
           puts the far columns back within reach of the arrow keys, and the
           role plus name explain what the visitor has just landed in. */
        <div
            className="scroll-region"
            tabIndex={0}
            role="region"
            aria-label={name}
            style={{ overflowX: 'auto', boxShadow: `inset 0 0 0 1px ${T.ruleStrong}`, margin: '20px 0' }}
        >
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth, fontFamily: FONT }}>
                <caption style={SR_ONLY}>{name}</caption>
                <thead>
                    <tr>
                        {head.map((h, i) => (
                            <th
                                key={h}
                                scope="col"
                                style={{
                                    textAlign: 'left', padding: '11px 14px', background: T.surface,
                                    borderBottom: `2px solid ${STEEL}`, width: widths?.[i],
                                    color: T.ink, whiteSpace: 'nowrap', ...MICRO_PLATE,
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            {r.map((cell, j) => (
                                <td
                                    key={j}
                                    style={{
                                        padding: '12px 14px', verticalAlign: 'top',
                                        borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${T.rule}`,
                                        fontSize: TYPE.COPY, fontWeight: j === 0 ? 600 : 400,
                                        color: j === 0 ? T.ink : T.body, lineHeight: 1.6,
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

/* Drawn rather than borrowed from the character set: ✕ and ⤢ render at whatever
   weight the body face happens to give them, which is never the weight of the
   diagram line work beside them. Solid silhouettes on the sign system's own
   grid, so they hold at the 11px they are used at. */

function ExpandIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
            <path d="M13.6 1.6 L22.4 1.6 L22.4 10.4 L18.6 10.4 L18.6 8.1 L14.1 12.6 L11.4 9.9 L15.9 5.4 L13.6 5.4 Z M1.6 13.6 L5.4 13.6 L5.4 15.9 L9.9 11.4 L12.6 14.1 L8.1 18.6 L10.4 18.6 L10.4 22.4 L1.6 22.4 Z" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
            <path d="M4.6 2 L12 9.4 L19.4 2 L22 4.6 L14.6 12 L22 19.4 L19.4 22 L12 14.6 L4.6 22 L2 19.4 L9.4 12 L2 4.6 Z" />
        </svg>
    );
}

/* ── Figure: caption, legend, expand-to-fullscreen ───────────────────────── */

export function Figure({
    label, title, caption, legend, controls, panel, children, minWidth = 720,
}: {
    label: string;
    title: string;
    caption?: ReactNode;
    legend?: { tone: Tone; text: string }[];
    /** Interactive controls: rendered above the diagram, never inside the scroll area. */
    controls?: ReactNode;
    /** Detail readout: rendered below the diagram, never inside the scroll area. */
    panel?: ReactNode;
    children: ReactNode;
    minWidth?: number;
}) {
    const [full, setFull] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const returnFocusTo = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!full) return;
        returnFocusTo.current = document.activeElement as HTMLElement;

        const fn = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setFull(false); return; }
            if (e.key !== 'Tab') return;
            // Keep Tab inside the dialog: without this the visitor tabs out into
            // the page behind an opaque overlay and cannot see where they are.
            const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
            );
            if (!focusables?.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };

        window.addEventListener('keydown', fn);
        document.body.style.overflow = 'hidden';
        // Move focus in, so the dialog is where the keyboard already is.
        dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

        return () => {
            window.removeEventListener('keydown', fn);
            document.body.style.overflow = '';
            returnFocusTo.current?.focus();
        };
    }, [full]);

    const frame = (
        <div style={{ boxShadow: `inset 0 0 0 2px ${STEEL}`, background: T.canvas, overflow: 'hidden' }}>
            {/* The head is a steel plate with the figure's number silkscreened
                on it in signal — the same construction as a rail, not a tinted
                strip standing in for one. */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '0 8px 0 14px', minHeight: 46, background: STEEL,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <span style={{ ...MICRO_PLATE, color: SIGNAL, flexShrink: 0 }}>{label}</span>
                    <span style={{
                        fontFamily: FONT, fontSize: TYPE.META, fontWeight: 700, fontStretch: '92%',
                        color: SIGN_WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {title}
                    </span>
                </div>
                <button
                    onClick={() => setFull(v => !v)}
                    style={{
                        ...CONTROL, color: SIGNAL,
                        background: 'transparent', border: `2px solid ${SIGNAL}`,
                        padding: '0 12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                        display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 34,
                        transition: `background .18s ${EASE_OUT}, color .18s ${EASE_OUT}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = SIGNAL; e.currentTarget.style.color = STEEL; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SIGNAL; }}
                >
                    {full ? 'Close' : 'Expand'}
                    {full ? <CloseIcon /> : <ExpandIcon />}
                </button>
            </div>

            {controls && <div style={{ padding: '14px 16px 0' }}>{controls}</div>}

            {/* Same reasoning as Table: the diagram is `minWidth` wide by
                construction, so below that it scrolls and has to be focusable
                for anyone without a pointer. */}
            <div
                className="scroll-region"
                tabIndex={0}
                role="region"
                aria-label={`${title} diagram`}
                style={{ overflowX: 'auto' }}
            >
                <div style={{ minWidth: full ? undefined : minWidth, padding: 16 }}>{children}</div>
            </div>

            {panel && (
                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${T.ruleStrong}`, marginTop: -4 }}>
                    <div style={{ paddingTop: 13 }}>{panel}</div>
                </div>
            )}

            {legend && (
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '10px 20px', padding: '11px 14px',
                    borderTop: `2px solid ${STEEL}`, background: T.surface,
                }}>
                    {legend.map(l => (
                        <span key={l.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: T.ink, ...MICRO_PLATE }}>
                            <span aria-hidden style={{
                                width: 12, height: 12, background: T[l.tone].fill,
                                boxShadow: `inset 0 0 0 2px ${T[l.tone].stroke}`,
                            }} />
                            {l.text}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <figure className="minddo-bleed" style={{ marginTop: 22, marginBottom: 26 }}>
            {full ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} — expanded`}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(13,13,13,0.72)',
                        padding: 'clamp(12px, 3vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setFull(false); }}
                >
                    <div ref={dialogRef} style={{ width: '100%', maxWidth: 1500, maxHeight: '94vh', overflowY: 'auto' }}>
                        {frame}
                    </div>
                </div>
            ) : frame}

            {!full && caption && (
                <figcaption style={{ fontFamily: FONT, fontSize: TYPE.COPY, color: T.muted, lineHeight: 1.6, marginTop: 11, maxWidth: '68ch' }}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/* ── SVG helpers shared by the diagrams ──────────────────────────────────── */

export interface Box { x: number; y: number; w: number; h: number }

export function toneOf(tone: Tone) { return T[tone]; }

/** Orthogonal connector between two boxes: right edge of `a` to left edge of `b`. */
export function elbow(a: Box, b: Box, bias = 0.5) {
    const x1 = a.x + a.w, y1 = a.y + a.h / 2;
    const x2 = b.x, y2 = b.y + b.h / 2;
    const mx = x1 + (x2 - x1) * bias;
    return `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
}

/** Orthogonal connector from the bottom of `a` to the top of `b`. */
export function drop(a: Box, b: Box, bias = 0.5) {
    const x1 = a.x + a.w / 2, y1 = a.y + a.h;
    const x2 = b.x + b.w / 2, y2 = b.y;
    const my = y1 + (y2 - y1) * bias;
    return `M ${x1} ${y1} V ${my} H ${x2} V ${y2}`;
}

export function Arrowheads() {
    return (
        <defs>
            {[['ah', STEEL_SOFT], ['ah-on', T.accent], ['ah-bad', T.bad.stroke], ['ah-good', T.good.stroke]].map(([id, color]) => (
                <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
            ))}
        </defs>
    );
}

/** Multi-line SVG label. */
export function Lines({ x, y, lines, size = 10.5, fill, weight = 400, anchor = 'middle', gap = 13 }: {
    x: number; y: number; lines: string[]; size?: number; fill: string; weight?: number;
    anchor?: 'start' | 'middle' | 'end'; gap?: number;
}) {
    return (
        <>
            {lines.map((l, i) => (
                <text
                    key={i}
                    x={x}
                    y={y + i * gap}
                    textAnchor={anchor}
                    style={{ fontFamily: l.startsWith('`') ? MONO : FONT, fontSize: size, fontWeight: weight, fill }}
                >
                    {l.startsWith('`') ? l.slice(1) : l}
                </text>
            ))}
        </>
    );
}

/** Keeps the pinned/hovered selection state used by every interactive diagram. */
/* The diagrams are the argument of this page, and the detail panel behind each
   node is where the reasoning lives. `bind` therefore has to produce a real
   control, not a hover target: tabbable, activatable from the keyboard, and
   named for a screen reader. Focus mirrors hover so moving through a diagram
   with Tab lights the same path the mouse would. */
export function useFocus<Id extends string>() {
    const [hover, setHover] = useState<Id | null>(null);
    const [pinned, setPinned] = useState<Id | null>(null);
    const active = (hover ?? pinned) as Id | null;
    const ref = useRef<SVGSVGElement>(null);
    const bind = (id: Id, label?: string) => ({
        onMouseEnter: () => setHover(id),
        onMouseLeave: () => setHover(null),
        onFocus: () => setHover(id),
        onBlur: () => setHover(null),
        onClick: (e: React.MouseEvent) => { e.stopPropagation(); setPinned(p => (p === id ? null : id)); },
        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();          // Space would otherwise scroll the page
            e.stopPropagation();
            setPinned(p => (p === id ? null : id));
        },
        tabIndex: 0,
        role: 'button' as const,
        'aria-pressed': pinned === id,
        'aria-label': label ?? id,
        /* No `outline: none` here on purpose. Focus already lights the node and
           its edges via the hover path above, but that highlight also means
           "hover"; the global :focus-visible ring is what makes keyboard focus
           unambiguous, so it is left to paint on top. */
        style: { cursor: 'pointer' as const },
    });
    return { active, pinned, hover, setPinned, bind, ref };
}

/* ── Video: a YouTube embed in the same frame the diagrams use ───────────── */

export function Video({ label, title, src, caption, style }: {
    label: string;
    title: string;
    /** Privacy-preserving embed URL, e.g. https://www.youtube-nocookie.com/embed/<id> */
    src: string;
    caption?: ReactNode;
    style?: CSSProperties;
}) {
    return (
        <figure className="minddo-bleed" style={{ marginTop: 22, marginBottom: 26, ...style }}>
            <div style={{ boxShadow: `inset 0 0 0 2px ${STEEL}`, background: T.canvas, overflow: 'hidden' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '0 14px', minHeight: 46, background: STEEL,
                }}>
                    <span style={{ ...MICRO_PLATE, color: SIGNAL, flexShrink: 0 }}>{label}</span>
                    <span style={{
                        fontFamily: FONT, fontSize: TYPE.META, fontWeight: 700, fontStretch: '92%',
                        color: SIGN_WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {title}
                    </span>
                </div>
                <iframe
                    src={src}
                    title={title}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', border: 'none', background: STEEL }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
            {caption && (
                <figcaption style={{ fontFamily: FONT, fontSize: TYPE.COPY, color: T.muted, lineHeight: 1.6, marginTop: 11, maxWidth: '68ch' }}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
