'use client';

/**
 * MindMap.tsx — "Source of Me" CS-tree mind map
 *
 * INTEGRATION: HeroSection.tsx — clicking the avatar opens this overlay.
 *
 * REPLACING NODES WITH HAND-DRAWN IMAGES:
 *   Set `image: '/drawings/soccer.png'` on any node and it will render that
 *   image clipped to the circle. Leave `image: null` for the default style.
 *
 * TREE STRUCTURE (3 levels):
 *   Root:    Olric  (you)
 *   Level 1: Soccer · Music · Gaming · Gym
 *   Level 2: 2 leaf nodes per hobby
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AC = '#b8860b';
const DIS = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BOD = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';
const HND = 'var(--font-handwritten, "Caveat", cursive)';

const VW = 1000, VH = 580;

interface NodeDef {
    id: string;
    x: number; y: number; r: number;
    type: 'center' | 'hobby' | 'leaf';
    label: string;
    sub?: string;
    image?: string | null;
    floatY: [number, number];
    floatDuration: number;
    floatDelay: number;
    noteRot?: number;
    note?: string[];
}

// ─── Tree nodes ───────────────────────────────────────────────────────────
const NODES: NodeDef[] = [
    // Root
    {
        id: 'me', x: 500, y: 100, r: 52, type: 'center', label: 'Olric',
        floatY: [0, 0], floatDuration: 5.0, floatDelay: 0,
    },

    // Level 1 — Pillars (no notes — only leaf nodes carry notes)
    {
        id: 'soccer', x: 155, y: 285, r: 50, type: 'hobby',
        label: 'Soccer', sub: 'Sport', image: '/aboutme/soccer.svg',
        floatY: [-3, 6], floatDuration: 3.8, floatDelay: 0.3,
    },
    {
        id: 'gaming', x: 372, y: 285, r: 50, type: 'hobby',
        label: 'Gaming', sub: 'Games', image: '/aboutme/game.svg',
        floatY: [0, -7], floatDuration: 4.2, floatDelay: 0.8,
    },
    {
        id: 'music', x: 628, y: 285, r: 42, type: 'hobby',
        label: 'Music', sub: 'Creative', image: '/aboutme/music.svg',
        floatY: [3, -5], floatDuration: 3.6, floatDelay: 1.2,
    },
    {
        id: 'food', x: 845, y: 285, r: 42, type: 'hobby',
        label: 'Food', sub: 'Taste', image: '/aboutme/food.svg',
        floatY: [0, -9], floatDuration: 4.9, floatDelay: 1.7,
    },

    // Level 2 — Soccer leaves
    {
        id: 'tottenham', x: 80, y: 445, r: 45, type: 'leaf',
        label: 'Tottenham', image: '/aboutme/spurs.svg',
        floatY: [-2, 5], floatDuration: 4.3, floatDelay: 0.5, noteRot: -1.5,
        note: ['Spurs fan since childhood.', 'COYS. The rebuild is real.'],
    },

    // Level 2 — Soccer + Gaming shared leaf
    {
        id: 'fifafm', x: 265, y: 445, r: 42, type: 'leaf',
        label: 'FIFA / FM', image: '/aboutme/fm.svg',
        floatY: [2, -4], floatDuration: 3.9, floatDelay: 1.1, noteRot: 1,
        note: ['FIFA for the quick fix.', 'Football Manager for the', 'full-season obsession.'],
    },

    // Level 2 — Gaming leaves
    {
        id: 'pokemon', x: 440, y: 445, r: 34, type: 'leaf',
        label: 'Pokémon', image: '/aboutme/poke.svg',
        floatY: [0, -6], floatDuration: 4.5, floatDelay: 0.6, noteRot: -1,
        note: ['Gen 1–5 purist.', 'Competitive Showdown player.', 'Fire Red never dies.'],
    },

    // Level 2 — Music leaves
    {
        id: 'piano', x: 560, y: 445, r: 32, type: 'leaf',
        label: 'Piano', image: '/aboutme/piano.svg',
        floatY: [-3, 4], floatDuration: 4.0, floatDelay: 1.3, noteRot: 1.5,
        note: ['Classical training.', 'Now into jazz voicings', 'and lo-fi chord stacks.'],
    },
    {
        id: 'headphones', x: 715, y: 445, r: 32, type: 'leaf',
        label: 'Headphones', image: null,
        floatY: [1, -5], floatDuration: 3.7, floatDelay: 0.9, noteRot: -2,
        note: ['Always on. Jazz, lo-fi,', 'indie. Playlist >', 'algorithm, always.'],
    },
];

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

interface EdgeDef { a: string; b: string; level: 0 | 1; }

const EDGES: EdgeDef[] = [
    { a: 'me', b: 'soccer', level: 0 },
    { a: 'me', b: 'gaming', level: 0 },
    { a: 'me', b: 'music', level: 0 },
    { a: 'me', b: 'food', level: 0 },
    { a: 'soccer', b: 'tottenham', level: 1 },
    { a: 'soccer', b: 'fifafm', level: 1 },
    { a: 'gaming', b: 'fifafm', level: 1 },
    { a: 'gaming', b: 'pokemon', level: 1 },
    { a: 'music', b: 'piano', level: 1 },
    { a: 'music', b: 'headphones', level: 1 },
];

// Maps each leaf node id → all parent hobby ids (fifafm has two parents)
const leafParents: Record<string, string[]> = {};
EDGES.filter(e => e.level === 1).forEach(e => {
    (leafParents[e.b] ??= []).push(e.a);
});

// ─── Helpers ──────────────────────────────────────────────────────────────
function makeEdgePath(ax: number, ay: number, ar: number, bx: number, by: number, br: number): string {
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const x1 = ax + (dx / len) * (ar + 4), y1 = ay + (dy / len) * (ar + 4);
    const x2 = bx - (dx / len) * (br + 4), y2 = by - (dy / len) * (br + 4);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cpx = mx + (-dy) * 0.07, cpy = my + dx * 0.07;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function notePosition(nx_base: number, ny_base: number, type: NodeDef['type'], noteW: number, noteH: number) {
    let nx: number, ny: number;

    if (type === 'leaf') {
        ny = ny_base + 32 + 14; // r=32, note below
        if (nx_base < 350) nx = nx_base + 32 + 10;
        else if (nx_base > 650) nx = nx_base - 32 - 10 - noteW;
        else nx = nx_base - noteW / 2;
    } else if (type === 'hobby') {
        ny = ny_base - noteH / 2;
        if (nx_base < 500) nx = nx_base + 42 + 18;
        else nx = nx_base - 42 - 18 - noteW;
    } else {
        nx = nx_base - noteW / 2;
        ny = ny_base + 52 + 14;
    }

    nx = Math.max(8, Math.min(VW - noteW - 8, nx));
    ny = Math.max(8, Math.min(VH - noteH - 8, ny));
    return { nx, ny };
}

// ─── SVG defs ─────────────────────────────────────────────────────────────
function SVGDefs() {
    return (
        <defs>
            <filter id="mm-rf-node" x="-15%" y="-15%" width="130%" height="130%">
                <feTurbulence type="turbulence" baseFrequency="0.045" numOctaves="3" seed="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="mm-rf-edge" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="turbulence" baseFrequency="0.055" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="mm-rf-note" x="-8%" y="-8%" width="116%" height="116%">
                <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="11" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="mm-rf-drag" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={AC} floodOpacity="0.25" />
            </filter>
            <pattern id="mm-dot-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="18" cy="18" r="0.85" fill={AC} opacity="0.14" />
            </pattern>
            <radialGradient id="mm-glow" cx="50%" cy="20%" r="60%">
                <stop offset="0%" stopColor={AC} stopOpacity="0.09" />
                <stop offset="100%" stopColor={AC} stopOpacity="0" />
            </radialGradient>
        </defs>
    );
}

// ─── Sticky note ──────────────────────────────────────────────────────────
function StickyNote({ node, ex, ey }: { node: NodeDef; ex: number; ey: number }) {
    if (!node.note?.length) return null;
    const lines = node.note;
    const noteW = 200, noteH = 22 + lines.length * 22 + 18;
    const { nx, ny } = notePosition(ex, ey, node.type, noteW, noteH);
    const rot = node.noteRot ?? 0;
    const cx = nx + noteW / 2, cy = ny + noteH / 2;

    return (
        <motion.g
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: 'drop-shadow(2px 3px 7px rgba(0,0,0,0.13))' }}
        >
            <g filter="url(#mm-rf-note)">
                <rect x={nx} y={ny} width={noteW} height={noteH} rx={2.5}
                    fill="#fef9e1" stroke={`${AC}66`} strokeWidth={0.9}
                    transform={`rotate(${rot},${cx},${cy})`} />
                <path d={`M ${nx + noteW - 18} ${ny} L ${nx + noteW} ${ny + 18} L ${nx + noteW - 18} ${ny + 18} Z`}
                    fill={`${AC}28`} transform={`rotate(${rot},${cx},${cy})`} />
            </g>
            <text fontFamily={HND} fontSize="15.5" fill="#2a2520"
                transform={`rotate(${rot},${cx},${cy})`}>
                {lines.map((line, i) => (
                    <tspan key={i} x={nx + 13} y={ny + 24 + i * 22}>{line}</tspan>
                ))}
            </text>
            <text fontFamily={BOD} fontSize="9" letterSpacing="0.1em" fill={`${AC}88`}
                textAnchor="middle" transform={`rotate(${rot},${cx},${cy})`}
                x={nx + noteW - 22} y={ny + noteH - 7}>
                {node.type === 'leaf' ? '◦ detail' : '● about'}
            </text>
        </motion.g>
    );
}

// ─── Physics drag + spring return ────────────────────────────────────────
interface DragRef {
    id: string | null;
    startSvgX: number; startSvgY: number;
    startOffX: number; startOffY: number;
}

function useDragPhysics(
    svgRef: React.RefObject<SVGSVGElement | null>,
    onNodeClick: (id: string) => void,
) {
    const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const drag = useRef<DragRef>({ id: null, startSvgX: 0, startSvgY: 0, startOffX: 0, startOffY: 0 });
    const draggingRef = useRef(false);
    const hasMoved = useRef(false);
    const rafs = useRef<Record<string, number>>({});

    // Convert client coords → SVG coords using the CTM
    const toSvg = useCallback((clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const ctm = svg.getScreenCTM();
        if (!ctm) {
            const r = svg.getBoundingClientRect();
            return { x: (clientX - r.left) * VW / r.width, y: (clientY - r.top) * VH / r.height };
        }
        const pt = svg.createSVGPoint();
        pt.x = clientX; pt.y = clientY;
        const sp = pt.matrixTransform(ctm.inverse());
        return { x: sp.x, y: sp.y };
    }, [svgRef]);

    const springBack = useCallback((id: string, ox: number, oy: number) => {
        cancelAnimationFrame(rafs.current[id]);
        let x = ox, y = oy, vx = 0, vy = 0;
        // Low stiffness = slow crawl back. Damping oscillates each frame (non-uniform
        // resistance) giving a thick-fluid, slightly unpredictable feel.
        const k = 42;
        const dBase = 11, dAmp = 9;
        const dt = 1 / 60;
        let t = 0;
        // Per-node phase so each node has its own rhythm of resistance
        const phase = (nodeMap[id]?.x ?? 0) * 0.037 + (nodeMap[id]?.y ?? 0) * 0.021;

        const tick = () => {
            t += dt;
            const d = dBase + dAmp * (0.5 + 0.5 * Math.sin(t * 4.7 + phase));
            vx += (-k * x - d * vx) * dt;
            vy += (-k * y - d * vy) * dt;
            x += vx * dt;
            y += vy * dt;
            const done = Math.abs(x) < 0.08 && Math.abs(y) < 0.08 &&
                Math.abs(vx) < 0.12 && Math.abs(vy) < 0.12;
            setOffsets(prev => ({ ...prev, [id]: done ? { x: 0, y: 0 } : { x, y } }));
            if (!done) rafs.current[id] = requestAnimationFrame(tick);
        };
        rafs.current[id] = requestAnimationFrame(tick);
    }, []);

    const onNodePointerDown = useCallback((id: string, e: React.PointerEvent) => {
        e.stopPropagation();
        cancelAnimationFrame(rafs.current[id]);
        const cur = { ...(offsets[id] ?? { x: 0, y: 0 }) };
        const pt = toSvg(e.clientX, e.clientY);
        drag.current = { id, startSvgX: pt.x, startSvgY: pt.y, startOffX: cur.x, startOffY: cur.y };
        draggingRef.current = true;
        hasMoved.current = false;
        setDraggingId(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toSvg, offsets]);

    const onSvgPointerMove = useCallback((e: React.PointerEvent) => {
        const { id, startSvgX, startSvgY, startOffX, startOffY } = drag.current;
        if (!id) return;
        hasMoved.current = true;
        const pt = toSvg(e.clientX, e.clientY);
        setOffsets(prev => ({
            ...prev,
            [id]: { x: startOffX + pt.x - startSvgX, y: startOffY + pt.y - startSvgY },
        }));
    }, [toSvg]);

    const onSvgPointerUp = useCallback(() => {
        const { id } = drag.current;
        if (!id) return;
        const wasClick = !hasMoved.current;
        drag.current.id = null;
        draggingRef.current = false;
        hasMoved.current = false;
        setDraggingId(null);
        setOffsets(prev => {
            const cur = prev[id] ?? { x: 0, y: 0 };
            springBack(id, cur.x, cur.y);
            return prev;
        });
        if (wasClick) onNodeClick(id);
    }, [springBack, onNodeClick]);

    useEffect(() => {
        const r = rafs.current;
        return () => Object.values(r).forEach(cancelAnimationFrame);
    }, []);

    const epos = useCallback((id: string) => {
        const n = nodeMap[id], off = offsets[id] ?? { x: 0, y: 0 };
        return { x: n.x + off.x, y: n.y + off.y, r: n.r };
    }, [offsets]);

    return { offsets, draggingId, draggingRef, epos, onNodePointerDown, onSvgPointerMove, onSvgPointerUp };
}

// ─── Tree graph ────────────────────────────────────────────────────────────
function MindMapGraph({
    hovered, onHover, expandedHobbies, onExpand,
}: {
    hovered: string | null;
    onHover: (id: string | null) => void;
    expandedHobbies: Set<string>;
    onExpand: (id: string) => void;
}) {
    const svgRef = useRef<SVGSVGElement>(null);

    const handleNodeClick = useCallback((id: string) => {
        const n = nodeMap[id];
        if (n.type === 'hobby') onExpand(id);
        if (n.note) onHover(hovered === id ? null : id);
    }, [onExpand, onHover, hovered]);

    const { offsets, draggingId, draggingRef, epos, onNodePointerDown, onSvgPointerMove, onSvgPointerUp } =
        useDragPhysics(svgRef, handleNodeClick);

    const visibleNodeIds = new Set(
        NODES
            .filter(n => n.type !== 'leaf' || (leafParents[n.id] ?? []).every(p => expandedHobbies.has(p)))
            .map(n => n.id)
    );
    const visibleEdges = EDGES.filter(e => visibleNodeIds.has(e.a) && visibleNodeIds.has(e.b));

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
            style={{ display: 'block', overflow: 'visible', touchAction: 'none', userSelect: 'none' }}
            onPointerMove={onSvgPointerMove}
            onPointerUp={onSvgPointerUp}
            onPointerLeave={onSvgPointerUp}
        >
            <SVGDefs />
            <rect width={VW} height={VH} fill="url(#mm-dot-grid)" />
            <ellipse cx={500} cy={260} rx={480} ry={310} fill="url(#mm-glow)" />

            {/* Edges — computed from live effective positions, stretch visual on drag */}
            <g filter="url(#mm-rf-edge)">
                {visibleEdges.map((e, i) => {
                    const a = epos(e.a), b = epos(e.b);
                    const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
                    const natural = e.level === 0 ? 215 : 180;
                    const stretch = Math.max(1, len / natural);
                    return (
                        <path key={i}
                            d={makeEdgePath(a.x, a.y, a.r, b.x, b.y, b.r)}
                            fill="none" stroke={AC}
                            strokeWidth={(e.level === 0 ? 1.8 : 1.2) / Math.pow(stretch, 0.35)}
                            strokeOpacity={(e.level === 0 ? 0.6 : 0.42) / Math.pow(stretch, 0.5)}
                            strokeLinecap="round" />
                    );
                })}
            </g>

            {/* Nodes */}
            {NODES.filter(n => visibleNodeIds.has(n.id)).map(n => {
                const off = offsets[n.id] ?? { x: 0, y: 0 };
                const ex = n.x + off.x;
                const ey = n.y + off.y;
                const isHov = hovered === n.id;
                const isCenter = n.type === 'center';
                const isLeaf = n.type === 'leaf';
                const isDragging = draggingId === n.id;

                return (
                    <motion.g
                        key={n.id}
                        initial={isLeaf ? { opacity: 0, scale: 0.6 } : false}
                        animate={isLeaf ? { y: n.floatY, opacity: 1, scale: 1 } : { y: n.floatY }}
                        transition={isLeaf ? {
                            opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                            scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                            y: { duration: n.floatDuration, delay: n.floatDelay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                        } : {
                            duration: n.floatDuration, delay: n.floatDelay,
                            repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut',
                        }}
                        // Drag interaction — center node is fixed, all others are draggable
                        onPointerDown={(e) => { if (!isCenter) onNodePointerDown(n.id, e); }}
                        style={{ cursor: isCenter ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
                        onMouseEnter={() => !draggingRef.current && n.note && onHover(n.id)}
                        onMouseLeave={() => onHover(null)}
                    >
                        {n.image ? (
                            /* Bare graphic — no circle, border, label, or dot */
                            <image href={n.image}
                                x={ex - n.r} y={ey - n.r}
                                width={n.r * 2} height={n.r * 2}
                                preserveAspectRatio="xMidYMid meet" />
                        ) : (
                            <>
                                {/* Hover ring */}
                                {isHov && !isCenter && (
                                    <circle cx={ex} cy={ey} r={n.r + 8}
                                        fill="none" stroke={AC} strokeWidth={0.8}
                                        strokeOpacity={0.35} strokeDasharray="3,4" />
                                )}

                                {/* Node circle */}
                                <motion.circle
                                    cx={ex} cy={ey} r={n.r}
                                    fill={isCenter ? AC : '#ffffff'}
                                    stroke={AC}
                                    strokeWidth={isCenter ? 0 : (isLeaf ? 1.2 : 1.8)}
                                    filter={isDragging ? 'url(#mm-rf-drag)' : 'url(#mm-rf-node)'}
                                    animate={{ opacity: isHov ? 0.9 : 1 }}
                                    transition={{ duration: 0.15 }}
                                />

                                {/* Center inner ring */}
                                {isCenter && (
                                    <circle cx={ex} cy={ey} r={n.r - 9}
                                        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.8}
                                        filter="url(#mm-rf-node)" />
                                )}

                                {/* Labels */}
                                {isCenter ? (
                                    <>
                                        <text x={ex} y={ey - 5} textAnchor="middle" dominantBaseline="middle"
                                            fontFamily={DIS} fontSize="20" fontWeight="400" fill="#fff" letterSpacing="0.02em">
                                            {n.label}
                                        </text>
                                        <text x={ex} y={ey + 14} textAnchor="middle"
                                            fontFamily={BOD} fontSize="8.5" letterSpacing="0.12em" fill="rgba(255,255,255,0.6)">
                                            ZENG
                                        </text>
                                    </>
                                ) : isLeaf ? (
                                    <text x={ex} y={ey} textAnchor="middle" dominantBaseline="middle"
                                        fontFamily={BOD} fontSize="9" fontWeight="500" fill={`${AC}cc`} letterSpacing="0.04em">
                                        {n.label}
                                    </text>
                                ) : (
                                    <>
                                        <text x={ex} y={ey - 5} textAnchor="middle" dominantBaseline="middle"
                                            fontFamily={BOD} fontSize="14" fontWeight="500" fill="#1a1a1a">
                                            {n.label}
                                        </text>
                                        {n.sub && (
                                            <text x={ex} y={ey + 12} textAnchor="middle"
                                                fontFamily={BOD} fontSize="8.5" letterSpacing="0.1em" fill={`${AC}88`}>
                                                {n.sub.toUpperCase()}
                                            </text>
                                        )}
                                    </>
                                )}

                                {/* Indicator dot */}
                                {n.note && !isCenter && !isHov && (
                                    <circle cx={ex + n.r - 6} cy={ey - n.r + 6}
                                        r={isLeaf ? 2.5 : 3.5} fill={AC} opacity={0.5} />
                                )}
                            </>
                        )}
                    </motion.g>
                );
            })}

            {/* Sticky notes — rendered above all nodes, follow drag position */}
            <AnimatePresence>
                {NODES.filter(n => visibleNodeIds.has(n.id)).map(n => {
                    if (hovered !== n.id || !n.note) return null;
                    const off = offsets[n.id] ?? { x: 0, y: 0 };
                    return (
                        <StickyNote key={`note-${n.id}`} node={n}
                            ex={n.x + off.x} ey={n.y + off.y} />
                    );
                })}
            </AnimatePresence>
        </svg>
    );
}

// ─── Overlay ───────────────────────────────────────────────────────────────
// zIndex 400 — sits above the NavBar (z 300) so the header is fully visible.
export function MindMapOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [expandedHobbies, setExpandedHobbies] = useState<Set<string>>(new Set());

    const onExpand = useCallback((id: string) => {
        setExpandedHobbies(prev => new Set(prev).add(id));
    }, []);

    const handleClose = useCallback(() => {
        setHovered(null);
        setExpandedHobbies(new Set());
        onClose();
    }, [onClose]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        if (open) window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [open, handleClose]);

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="mindmap-overlay"
                    initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100vw' }}
                    transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 400,
                        display: 'flex', flexDirection: 'column',
                        background: '#fafaf7',
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="About Me!"
                >
                    {/* Page-flip fold shadow */}
                    <motion.div
                        initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                        transition={{ duration: 1.2, delay: 0.35 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: 52,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)',
                            pointerEvents: 'none', zIndex: 9,
                        }}
                    />

                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 44px', height: 64, flexShrink: 0,
                        borderBottom: `1px solid ${AC}1e`,
                        background: 'rgba(250,250,247,0.97)', backdropFilter: 'blur(12px)',
                        position: 'relative', zIndex: 5,
                    }}>
                        <button
                            onClick={handleClose}
                            style={{
                                position: 'absolute', left: 44,
                                display: 'flex', alignItems: 'center', gap: 9,
                                fontFamily: BOD, fontSize: '0.74rem', letterSpacing: '0.12em',
                                textTransform: 'uppercase', color: '#8a8078',
                                background: 'none', border: 'none', cursor: 'pointer',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#1a1a1a')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#8a8078')}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                stroke="currentColor" strokeWidth="1.4">
                                <line x1="12" y1="7" x2="2" y2="7" />
                                <polyline points="6,2 2,7 6,12" />
                            </svg>
                            Back
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                fontFamily: DIS, fontSize: '1.4rem', fontWeight: 300,
                                fontStyle: 'italic', color: '#1a1a1a', lineHeight: 1,
                            }}>
                                About Me!
                            </p>
                            <p style={{
                                fontFamily: BOD, fontSize: '0.6rem', letterSpacing: '0.18em',
                                textTransform: 'uppercase', color: `${AC}99`, marginTop: 4,
                            }}>
                                Olric Zeng
                            </p>
                        </div>

                        <p style={{
                            position: 'absolute', right: 44,
                            fontFamily: BOD, fontSize: '0.62rem', letterSpacing: '0.12em',
                            textTransform: 'uppercase', color: `${AC}66`,
                        }}>
                            Drag · hover to explore
                        </p>
                    </div>

                    {/* Graph canvas */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '18px 36px 14px' }}>
                        <MindMapGraph hovered={hovered} onHover={setHovered} expandedHobbies={expandedHobbies} onExpand={onExpand} />
                    </div>

                    {/* Footer */}
                    <div style={{
                        height: 36, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderTop: `1px solid ${AC}14`,
                    }}>
                        <p style={{
                            fontFamily: BOD, fontSize: '0.58rem', letterSpacing: '0.16em',
                            textTransform: 'uppercase', color: `${AC}55`,
                        }}>
                            Drag nodes · click to reveal · Esc to return
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
