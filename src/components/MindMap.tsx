'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AC = '#b8860b';
const DIS = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BOD = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';
const HND = 'var(--font-handwritten, "Caveat", cursive)';

// SVG canvas — nodes branch left; anchor aligns with the fixed photo on the right
const VW = 900, VH = 560;
const ANCHOR_X = 720, ANCHOR_Y = 280;

interface NodeDef {
    id: string;
    x: number; y: number; r: number;
    type: 'hobby' | 'leaf';
    label: string;
    sub?: string;
    image?: string;
    floatY: [number, number];
    floatDuration: number;
    floatDelay: number;
    noteRot?: number;
    note?: string;
}

const NODES: NodeDef[] = [
    // Level 1 — Hobbies
    { id: 'soccer', x: 480, y: 90, r: 46, type: 'hobby', label: 'Soccer', sub: 'Sport', image: '/aboutme/soccer.svg', floatY: [-3, 6], floatDuration: 3.8, floatDelay: 0.3 },
    { id: 'gaming', x: 310, y: 190, r: 46, type: 'hobby', label: 'Gaming', sub: 'Games', image: '/aboutme/game.svg', floatY: [0, -7], floatDuration: 4.2, floatDelay: 0.8 },
    { id: 'music', x: 310, y: 370, r: 42, type: 'hobby', label: 'Music', sub: 'Creative', image: '/aboutme/music.svg', floatY: [3, -5], floatDuration: 3.6, floatDelay: 1.2 },
    {
        id: 'food', x: 480, y: 470, r: 42, type: 'hobby', label: 'Food', sub: 'Taste', image: '/aboutme/food.svg', floatY: [0, -9], floatDuration: 4.9, floatDelay: 1.7,
        note: "I love food! My favorites are noodles. Trying to get into cooking and baking as well."
    },

    // Level 2 — Soccer leaves
    {
        id: 'tottenham', x: 220, y: 50, r: 40, type: 'leaf', label: 'Tottenham', image: '/aboutme/spurs.svg', floatY: [-2, 5], floatDuration: 4.3, floatDelay: 0.5, noteRot: -1.5,
        note: "I've been a Tottenham fan since 2019. I try to catch the latest Premier League game, through the highs and lows, even though it's been a lot more lows than highs recently :("
    },
    {
        id: 'fifafm', x: 120, y: 175, r: 38, type: 'leaf', label: 'FIFA / FM', image: '/aboutme/fm.svg', floatY: [2, -4], floatDuration: 3.9, floatDelay: 1.1, noteRot: 1,
        note: 'I love soccer management games like FIFA and Football Manager! I can easily spend all day playing these games. I enjoy the blend of strategy, stats, and creativity involved in building and managing a team.'
    },

    // Level 2 — Gaming leaves
    {
        id: 'pokemon', x: 120, y: 290, r: 34, type: 'leaf', label: 'Pokémon', image: '/aboutme/poke.svg', floatY: [0, -6], floatDuration: 4.5, floatDelay: 0.6, noteRot: -1,
        note: "I'm a competitive pokemon player! It's a stimulating game with surprisingly deep strategy. I used to run a youtube channel about fun gimmicky strategies, which you can check out here: https://www.youtube.com/@froxyproxy."
    },

    // Level 2 — Music leaves
    {
        id: 'piano', x: 160, y: 430, r: 32, type: 'leaf', label: 'Piano', image: '/aboutme/piano.svg', floatY: [-3, 4], floatDuration: 4.0, floatDelay: 1.3, noteRot: 1.5,
        note: "I've been playing piano for about 12 years! It's a great way to unwind for me."
    },
    {
        id: 'headphones', x: 280, y: 490, r: 32, type: 'leaf', label: 'Listening', image: '/aboutme/headphone.svg', floatY: [1, -5], floatDuration: 3.7, floatDelay: 0.9, noteRot: -2,
        note: 'I listen to a lot of music. Of every genre. You can check out my last.fm here: https://www.last.fm/user/olriczzz'
    },
];

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

// Which parent hobbies must ALL be expanded before a leaf becomes visible
const leafRequires: Record<string, string[]> = {
    tottenham: ['soccer'],
    fifafm: ['soccer', 'gaming'],
    pokemon: ['gaming'],
    piano: ['music'],
    headphones: ['music'],
};

interface EdgeDef { a: string; b: string; level: 0 | 1; }

const EDGES: EdgeDef[] = [
    { a: 'anchor', b: 'soccer', level: 0 },
    { a: 'anchor', b: 'gaming', level: 0 },
    { a: 'anchor', b: 'music', level: 0 },
    { a: 'anchor', b: 'food', level: 0 },
    { a: 'soccer', b: 'tottenham', level: 1 },
    { a: 'soccer', b: 'fifafm', level: 1 },
    { a: 'gaming', b: 'fifafm', level: 1 },
    { a: 'gaming', b: 'pokemon', level: 1 },
    { a: 'music', b: 'piano', level: 1 },
    { a: 'music', b: 'headphones', level: 1 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────
function makeEdgePath(ax: number, ay: number, ar: number, bx: number, by: number, br: number): string {
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    // ar = 0 for anchor, so edge starts exactly at anchor point
    const x1 = ax + (dx / len) * ar;
    const y1 = ay + (dy / len) * ar;
    const x2 = bx - (dx / len) * (br + 5);
    const y2 = by - (dy / len) * (br + 5);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cpx = mx + (-dy) * 0.12, cpy = my + dx * 0.12;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function wrapLines(text: string, maxChars: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
        if (!cur) { cur = w; continue; }
        if ((cur + ' ' + w).length <= maxChars) { cur += ' ' + w; }
        else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
}

function notePosition(ex: number, ey: number, r: number, noteW: number, noteH: number) {
    const leftX = ex - r - noteW - 20;
    const rightX = ex + r + 20;
    let nx = leftX >= 4 ? leftX : rightX;
    let ny = ey - noteH / 2;
    nx = Math.max(4, Math.min(VW - noteW - 4, nx));
    ny = Math.max(4, Math.min(VH - noteH - 4, ny));
    return { nx, ny };
}

// ─── SVG defs ────────────────────────────────────────────────────────────
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
            <radialGradient id="mm-glow" cx="80%" cy="50%" r="55%">
                <stop offset="0%" stopColor={AC} stopOpacity="0.08" />
                <stop offset="100%" stopColor={AC} stopOpacity="0" />
            </radialGradient>
        </defs>
    );
}

// ─── Sticky note ─────────────────────────────────────────────────────────
const NOTE_W = 260;
const NOTE_FONT = 15;
const NOTE_PAD_X = 14;
const NOTE_MAX_CHARS = 38;

type Seg = { type: 'text'; text: string } | { type: 'link'; url: string; display: string };

function parseSegments(line: string): Seg[] {
    const URL_RE = /https?:\/\/\S+/g;
    const segs: Seg[] = [];
    let last = 0, m;
    while ((m = URL_RE.exec(line)) !== null) {
        if (m.index > last) segs.push({ type: 'text', text: line.slice(last, m.index) });
        const url = m[0].replace(/[.,;:!?]+$/, '');
        let display: string;
        try { display = new URL(url).hostname.replace(/^www\./, '') + ' ↗'; }
        catch { display = url; }
        segs.push({ type: 'link', url, display });
        last = m.index + m[0].length;
    }
    if (last < line.length) segs.push({ type: 'text', text: line.slice(last) });
    return segs;
}

function StickyNote({ node, ex, ey }: { node: NodeDef; ex: number; ey: number }) {
    if (!node.note) return null;
    const lines = wrapLines(node.note, NOTE_MAX_CHARS);
    const lineH = 24;
    const noteH = 36 + lines.length * lineH + 20;
    const foldSz = 22;
    const { nx, ny } = notePosition(ex, ey, node.r, NOTE_W, noteH);
    const rot = node.noteRot ?? 0;
    const cx = nx + NOTE_W / 2, cy = ny + noteH / 2;

    return (
        <motion.g
            initial={{ opacity: 0, scale: 0.84, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.84, y: 6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: 'drop-shadow(2px 4px 10px rgba(0,0,0,0.15))' }}
        >
            <g filter="url(#mm-rf-note)">
                <rect x={nx} y={ny} width={NOTE_W} height={noteH} rx={3}
                    fill="#fef8d0" stroke={`${AC}55`} strokeWidth={1}
                    transform={`rotate(${rot},${cx},${cy})`} />
                <rect x={nx} y={ny} width={NOTE_W} height={9} rx={3}
                    fill={`${AC}20`} transform={`rotate(${rot},${cx},${cy})`} />
                <path d={`M ${nx + NOTE_W - foldSz} ${ny} L ${nx + NOTE_W} ${ny + foldSz} L ${nx + NOTE_W - foldSz} ${ny + foldSz} Z`}
                    fill={`${AC}28`} transform={`rotate(${rot},${cx},${cy})`} />
                {lines.map((_, i) => (
                    <line key={`rule-${i}`}
                        x1={nx + NOTE_PAD_X} y1={ny + 32 + i * lineH + 5}
                        x2={nx + NOTE_W - NOTE_PAD_X} y2={ny + 32 + i * lineH + 5}
                        stroke={`${AC}22`} strokeWidth={0.7}
                        transform={`rotate(${rot},${cx},${cy})`} />
                ))}
            </g>
            {lines.map((line, i) => (
                <text key={i} fontFamily={HND} fontSize={NOTE_FONT} fill="#2a2520"
                    x={nx + NOTE_PAD_X} y={ny + 32 + i * lineH}
                    transform={`rotate(${rot},${cx},${cy})`}>
                    {parseSegments(line).map((seg, j) =>
                        seg.type === 'link' ? (
                            <a key={j} href={seg.url} target="_blank" rel="noopener noreferrer"
                                style={{ cursor: 'pointer' }}>
                                <tspan fill={AC} textDecoration="underline">{seg.display}</tspan>
                            </a>
                        ) : (
                            <tspan key={j}>{seg.text}</tspan>
                        )
                    )}
                </text>
            ))}
            <text fontFamily={BOD} fontSize="9" letterSpacing="0.1em" fill={`${AC}77`}
                textAnchor="end" transform={`rotate(${rot},${cx},${cy})`}
                x={nx + NOTE_W - NOTE_PAD_X} y={ny + noteH - 8}>
                {node.type === 'leaf' ? '◦ detail' : '● about'}
            </text>
        </motion.g>
    );
}

// ─── Drag physics ─────────────────────────────────────────────────────────
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
        const k = 42, dBase = 11, dAmp = 9, dt = 1 / 60;
        let t = 0;
        const phase = (nodeMap[id]?.x ?? 0) * 0.037 + (nodeMap[id]?.y ?? 0) * 0.021;
        const tick = () => {
            t += dt;
            const d = dBase + dAmp * (0.5 + 0.5 * Math.sin(t * 4.7 + phase));
            vx += (-k * x - d * vx) * dt;
            vy += (-k * y - d * vy) * dt;
            x += vx * dt; y += vy * dt;
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
        if (id === 'anchor') return { x: ANCHOR_X, y: ANCHOR_Y, r: 0 };
        const n = nodeMap[id], off = offsets[id] ?? { x: 0, y: 0 };
        return { x: n.x + off.x, y: n.y + off.y, r: n.r };
    }, [offsets]);

    return { offsets, draggingId, draggingRef, epos, onNodePointerDown, onSvgPointerMove, onSvgPointerUp };
}

// ─── Graph ────────────────────────────────────────────────────────────────
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
        if (!n) return;
        if (n.type === 'hobby') onExpand(id);
        if (n.note) onHover(hovered === id ? null : id);
    }, [onExpand, onHover, hovered]);

    const { offsets, draggingId, draggingRef, epos, onNodePointerDown, onSvgPointerMove, onSvgPointerUp } =
        useDragPhysics(svgRef, handleNodeClick);

    const visibleNodeIds = new Set(
        NODES
            .filter(n => n.type === 'hobby' || (leafRequires[n.id] ?? []).every(r => expandedHobbies.has(r)))
            .map(n => n.id)
    );
    const visibleEdges = EDGES.filter(e =>
        (e.a === 'anchor' || visibleNodeIds.has(e.a)) && visibleNodeIds.has(e.b)
    );

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
            <rect width={VW} height={VH} fill="url(#mm-glow)" />




            {/* Edges */}
            <g filter="url(#mm-rf-edge)">
                {visibleEdges.map((e, i) => {
                    const a = epos(e.a), b = epos(e.b);
                    const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
                    const natural = e.level === 0 ? 310 : 210;
                    const stretch = Math.max(1, len / natural);
                    const isHov = hovered === e.b || hovered === e.a;
                    return (
                        <path key={i}
                            d={makeEdgePath(a.x, a.y, a.r, b.x, b.y, b.r)}
                            fill="none" stroke={AC}
                            strokeWidth={(e.level === 0 ? 1.8 : 1.2) / Math.pow(stretch, 0.35)}
                            strokeOpacity={isHov
                                ? 0.8
                                : (e.level === 0 ? 0.55 : 0.38) / Math.pow(stretch, 0.5)}
                            strokeDasharray={e.level === 1 ? '5,4' : 'none'}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-opacity 0.2s' }}
                        />
                    );
                })}
            </g>

            {/* Nodes */}
            {NODES.filter(n => visibleNodeIds.has(n.id)).map(n => {
                const off = offsets[n.id] ?? { x: 0, y: 0 };
                const ex = n.x + off.x, ey = n.y + off.y;
                const isHov = hovered === n.id;
                const isLeaf = n.type === 'leaf';
                const isDragging = draggingId === n.id;

                return (
                    <motion.g
                        key={n.id}
                        initial={isLeaf ? { opacity: 0, scale: 0.6 } : false}
                        animate={isLeaf
                            ? { y: n.floatY, opacity: 1, scale: 1 }
                            : { y: n.floatY }}
                        transition={isLeaf ? {
                            opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                            scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                            y: { duration: n.floatDuration, delay: n.floatDelay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                        } : {
                            duration: n.floatDuration, delay: n.floatDelay,
                            repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut',
                        }}
                        onPointerDown={e => onNodePointerDown(n.id, e)}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        onMouseEnter={() => !draggingRef.current && n.note && onHover(n.id)}
                        onMouseLeave={() => { if (n.note) onHover(null); }}
                    >
                        {n.image ? (
                            <>
                                <image href={n.image}
                                    x={ex - n.r} y={ey - n.r}
                                    width={n.r * 2} height={n.r * 2}
                                    preserveAspectRatio="xMidYMid meet"
                                    style={{ pointerEvents: 'none' }} />
                                {/* Transparent circular hit target */}
                                <circle cx={ex} cy={ey} r={n.r} fill="transparent" />
                            </>
                        ) : (
                            <>
                                {isHov && (
                                    <circle cx={ex} cy={ey} r={n.r + 9}
                                        fill="none" stroke={AC} strokeWidth={0.8}
                                        strokeOpacity={0.35} strokeDasharray="3,4" />
                                )}
                                <motion.circle
                                    cx={ex} cy={ey} r={n.r}
                                    fill="#ffffff" stroke={AC}
                                    strokeWidth={isLeaf ? 1.1 : 1.8}
                                    strokeDasharray={isLeaf ? '4,3' : 'none'}
                                    filter={isDragging ? 'url(#mm-rf-drag)' : 'url(#mm-rf-node)'}
                                    animate={{ opacity: isHov ? 0.9 : 1 }}
                                    transition={{ duration: 0.15 }}
                                />
                                <text x={ex} y={ey - (n.sub ? 4 : 0)} textAnchor="middle" dominantBaseline="middle"
                                    fontFamily={BOD} fontSize={isLeaf ? 10.5 : 13.5} fontWeight="500"
                                    fill="#1a1a1a" style={{ pointerEvents: 'none' }}>
                                    {n.label}
                                </text>
                                {n.sub && (
                                    <text x={ex} y={ey + 11} textAnchor="middle"
                                        fontFamily={BOD} fontSize="8.5" letterSpacing="0.1em"
                                        fill={`${AC}88`} style={{ pointerEvents: 'none' }}>
                                        {n.sub.toUpperCase()}
                                    </text>
                                )}
                                {n.note && !isHov && (
                                    <circle cx={ex + n.r - 6} cy={ey - n.r + 6}
                                        r={isLeaf ? 2.5 : 3.5} fill={AC} opacity={0.5} />
                                )}
                                {/* Expand hint for unexpanded hobbies */}
                                {n.type === 'hobby' && !expandedHobbies.has(n.id) && leafRequires && Object.values(leafRequires).some(req => req.includes(n.id)) && (
                                    <text x={ex + n.r + 5} y={ey + 5}
                                        fontFamily={HND} fontSize="14" fill={`${AC}88`}
                                        style={{ pointerEvents: 'none' }}>
                                        +
                                    </text>
                                )}
                            </>
                        )}
                    </motion.g>
                );
            })}

            {/* Sticky notes — topmost layer */}
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

// ─── Overlay ──────────────────────────────────────────────────────────────
// Radial clip-path reveal from right side (where the photo lives, ~75% x, 50% y)
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
                    initial={{ clipPath: 'circle(0% at 75% 50%)' }}
                    animate={{ clipPath: 'circle(150% at 75% 50%)' }}
                    exit={{
                        clipPath: 'circle(0% at 75% 50%)',
                        transition: { duration: 0.6, ease: [0.55, 0, 0.22, 1] },
                    }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 400,
                        display: 'flex', flexDirection: 'column',
                        background: '#fafaf7',
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Source of Me"
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 44px', height: 64, flexShrink: 0,
                        borderBottom: `1px solid ${AC}1e`,
                        background: 'rgba(250,250,247,0.97)', backdropFilter: 'blur(12px)',
                        position: 'relative', zIndex: 5,
                    }}>
                        <button
                            onClick={handleClose}
                            style={{
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
                                Source of Me
                            </p>
                            <p style={{
                                fontFamily: BOD, fontSize: '0.6rem', letterSpacing: '0.18em',
                                textTransform: 'uppercase', color: `${AC}99`, marginTop: 4,
                            }}>
                                Olric Zeng · Drag nodes · click to reveal
                            </p>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            {[
                                { label: 'Hobby', dashed: false },
                                { label: 'Detail', dashed: true },
                            ].map(({ label, dashed }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <svg width="14" height="14" viewBox="0 0 14 14">
                                        <circle cx="7" cy="7" r="5" fill="none" stroke={AC} strokeWidth="1.3"
                                            strokeDasharray={dashed ? '3,2.5' : 'none'} />
                                    </svg>
                                    <span style={{
                                        fontFamily: BOD, fontSize: '0.65rem',
                                        letterSpacing: '0.08em', color: '#8a8078',
                                    }}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Graph canvas */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '10px 20px 6px' }}>
                        <MindMapGraph
                            hovered={hovered}
                            onHover={setHovered}
                            expandedHobbies={expandedHobbies}
                            onExpand={onExpand}
                        />
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
                            Hover nodes to reveal notes · Click hobby nodes to expand · Esc to return
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
