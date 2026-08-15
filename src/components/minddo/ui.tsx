'use client';

import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react';

/* Design tokens for the case study.
   Deliberately not the portfolio's editorial theme: this page is dense technical
   documentation, so it uses one UI typeface, a neutral ink palette, and the same
   node colours the source diagrams use (amber = compute tier, blue = storage,
   violet = external, red = blocked, green = allowed). */
export const T = {
    ink: '#12161d',
    body: '#39414f',
    muted: '#69727f',
    faint: '#98a0ab',
    rule: '#e3e7ec',
    ruleStrong: '#cbd2db',
    surface: '#f7f8fa',
    surfaceAlt: '#fcfcfd',
    accent: '#a97a09',
    accentSoft: '#f6efdc',
    tier: { fill: '#fff7e0', stroke: '#d9a50f', text: '#5a4406' },
    store: { fill: '#eaf3ff', stroke: '#3b6ea5', text: '#123a5e' },
    extern: { fill: '#f3eaff', stroke: '#7a55b5', text: '#3b2065' },
    bad: { fill: '#ffe6e4', stroke: '#c0392b', text: '#7a1d13' },
    good: { fill: '#e6f6ea', stroke: '#2e7d46', text: '#14512a' },
} as const;

export type Tone = 'tier' | 'store' | 'extern' | 'bad' | 'good';

export const FONT = 'var(--font-body, "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)';
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* ── Text primitives ─────────────────────────────────────────────────────── */

export function H2({ id, index, children }: { id: string; index: string; children: ReactNode }) {
    return (
        <h2
            id={id}
            style={{
                fontFamily: FONT, fontSize: '1.5rem', fontWeight: 600, color: T.ink,
                letterSpacing: '-0.015em', lineHeight: 1.25, scrollMarginTop: 76,
                display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14,
            }}
        >
            <span style={{ fontFamily: MONO, fontSize: '0.8rem', fontWeight: 500, color: T.accent }}>{index}</span>
            {children}
        </h2>
    );
}

export function H3({ children }: { children: ReactNode }) {
    return (
        <h3 style={{ fontFamily: FONT, fontSize: '1.02rem', fontWeight: 600, color: T.ink, letterSpacing: '-0.01em', marginBottom: 8 }}>
            {children}
        </h3>
    );
}

export function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    return (
        <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: T.body, lineHeight: 1.7, marginBottom: 14, ...style }}>
            {children}
        </p>
    );
}

export function C({ children }: { children: ReactNode }) {
    return (
        <code style={{
            fontFamily: MONO, fontSize: '0.84em', color: T.ink,
            background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 3, padding: '1px 5px',
        }}>
            {children}
        </code>
    );
}

export function Lede({ children }: { children: ReactNode }) {
    return (
        <p style={{ fontFamily: FONT, fontSize: '1.05rem', color: T.body, lineHeight: 1.65, marginBottom: 20 }}>
            {children}
        </p>
    );
}

export function Note({ label, tone = 'accent', children }: { label: string; tone?: 'accent' | 'warn'; children: ReactNode }) {
    const c = tone === 'warn' ? T.bad : { stroke: T.accent, fill: T.accentSoft, text: T.ink };
    return (
        <div style={{
            border: `1px solid ${c.stroke}44`, borderLeft: `3px solid ${c.stroke}`,
            background: tone === 'warn' ? '#fff8f7' : T.surfaceAlt,
            padding: '14px 16px', margin: '18px 0', borderRadius: 4,
        }}>
            <div style={{
                fontFamily: FONT, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: c.stroke, marginBottom: 7,
            }}>
                {label}
            </div>
            <div style={{ fontFamily: FONT, fontSize: '0.9rem', color: T.body, lineHeight: 1.68 }}>{children}</div>
        </div>
    );
}

/* ── Table ───────────────────────────────────────────────────────────────── */

export function Table({ head, rows, widths }: { head: string[]; rows: ReactNode[][]; widths?: string[] }) {
    return (
        <div style={{ overflowX: 'auto', border: `1px solid ${T.rule}`, borderRadius: 5, margin: '18px 0' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560, fontFamily: FONT }}>
                <thead>
                    <tr>
                        {head.map((h, i) => (
                            <th
                                key={h}
                                style={{
                                    textAlign: 'left', padding: '10px 14px', background: T.surface,
                                    borderBottom: `1px solid ${T.rule}`, width: widths?.[i],
                                    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                                    textTransform: 'uppercase', color: T.muted, whiteSpace: 'nowrap',
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
                                        padding: '11px 14px', verticalAlign: 'top',
                                        borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${T.rule}`,
                                        fontSize: '0.87rem', color: j === 0 ? T.ink : T.body, lineHeight: 1.6,
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

    useEffect(() => {
        if (!full) return;
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
        window.addEventListener('keydown', fn);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
    }, [full]);

    const frame = (
        <div style={{ border: `1px solid ${T.rule}`, borderRadius: 6, background: '#fff', overflow: 'hidden' }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '10px 14px', borderBottom: `1px solid ${T.rule}`, background: T.surface,
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
                    <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: T.accent, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontFamily: FONT, fontSize: '0.82rem', fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title}
                    </span>
                </div>
                <button
                    onClick={() => setFull(v => !v)}
                    style={{
                        fontFamily: FONT, fontSize: '0.72rem', fontWeight: 500, color: T.muted,
                        background: '#fff', border: `1px solid ${T.ruleStrong}`, borderRadius: 4,
                        padding: '4px 10px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                    }}
                >
                    {full ? 'Close  ✕' : 'Expand  ⤢'}
                </button>
            </div>

            {controls && <div style={{ padding: '14px 16px 0' }}>{controls}</div>}

            <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: full ? undefined : minWidth, padding: 16 }}>{children}</div>
            </div>

            {panel && (
                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${T.rule}`, marginTop: -4 }}>
                    <div style={{ paddingTop: 13 }}>{panel}</div>
                </div>
            )}

            {legend && (
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 16, padding: '10px 14px',
                    borderTop: `1px solid ${T.rule}`, background: T.surfaceAlt,
                }}>
                    {legend.map(l => (
                        <span key={l.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: FONT, fontSize: '0.72rem', color: T.muted }}>
                            <span style={{ width: 11, height: 11, borderRadius: 2, background: T[l.tone].fill, border: `1px solid ${T[l.tone].stroke}` }} />
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
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(18,22,29,0.55)',
                    padding: 'clamp(12px, 3vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                    onClick={e => { if (e.target === e.currentTarget) setFull(false); }}
                >
                    <div style={{ width: '100%', maxWidth: 1500, maxHeight: '94vh', overflowY: 'auto', borderRadius: 6 }}>
                        {frame}
                    </div>
                </div>
            ) : frame}

            {!full && caption && (
                <figcaption style={{ fontFamily: FONT, fontSize: '0.8rem', color: T.muted, lineHeight: 1.6, marginTop: 9 }}>
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
            {[['ah', T.ruleStrong], ['ah-on', T.accent], ['ah-bad', T.bad.stroke], ['ah-good', T.good.stroke]].map(([id, color]) => (
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
export function useFocus<Id extends string>() {
    const [hover, setHover] = useState<Id | null>(null);
    const [pinned, setPinned] = useState<Id | null>(null);
    const active = (hover ?? pinned) as Id | null;
    const ref = useRef<SVGSVGElement>(null);
    const bind = (id: Id) => ({
        onMouseEnter: () => setHover(id),
        onMouseLeave: () => setHover(null),
        onClick: (e: React.MouseEvent) => { e.stopPropagation(); setPinned(p => (p === id ? null : id)); },
        style: { cursor: 'pointer' as const },
    });
    return { active, pinned, hover, setPinned, bind, ref };
}
