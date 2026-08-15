'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import { useOverlay } from '@/contexts/OverlayContext';
import Reveal from './Reveal';
import { useScrollTilt } from '@/hooks/useScrollTilt';
import { useIsMobile } from '@/hooks/useIsMobile';

// Projects with an `href` get their own route, so they never enter the overlay carousel.
const OVERLAY_PROJECTS = projects.filter(p => !p.href);

const ACCENT = '#b8860b';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BODY = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';

// Per-project color palettes
const PALETTES: Record<string, { accent: string; bg: string; c3: string; ink: string }> = {
    luminary: { accent: '#7c5cbf', bg: '#ede8f7', c3: '#a78fd6', ink: '#2a1f42' },
    boroughs: { accent: '#3c6e57', bg: '#e7efe6', c3: '#d49a2b', ink: '#20302a' },
    noteform: { accent: '#2a2a2a', bg: '#f0f0f0', c3: '#888888', ink: '#111111' },
    minddo:   { accent: '#b8860b', bg: '#f7f2e6', c3: '#c9a44c', ink: '#33280f' },
};

// ─── SVG poster artwork — one motif per project id ────────────────────────────
function ProjectArt({ id, pal }: { id: string; pal: typeof PALETTES.luminary }) {
    const { accent, bg, c3 } = pal;
    const TAU = Math.PI * 2;
    const svgStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'block', overflow: 'visible' };
    const orbitStyle: React.CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center', animation: 'orbit 18s linear infinite' };
    const floatStyle: React.CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center', animation: 'floaty 4.6s ease-in-out infinite' };

    switch (id) {
        case 'luminary': // orbital rings
            return (
                <svg viewBox="0 0 200 200" style={svgStyle}>
                    {[0,1,2].flatMap(j => [0,1].map(i => (
                        <circle key={`h${i}${j}`} cx={150+i*11} cy={28+j*11} r={Math.max(0.7,2.6-0.45*(i+j))} fill={c3} opacity={0.5} />
                    )))}
                    <circle cx={100} cy={104} r={80} fill="none" stroke={c3} strokeWidth={1.6} strokeDasharray="2 10" opacity={0.6} />
                    <circle cx={100} cy={104} r={58} fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round"
                        strokeDasharray={`${(TAU*58*0.7).toFixed(1)} ${(TAU*58).toFixed(1)}`} transform="rotate(-90 100 104)" />
                    <g style={orbitStyle}>
                        {[0,1,2,3,4,5].map(k => {
                            const a = k * 60 * Math.PI / 180;
                            const cx = Math.round((100 + 58 * Math.cos(a)) * 100) / 100;
                            const cy = Math.round((104 + 58 * Math.sin(a)) * 100) / 100;
                            return <circle key={`o${k}`} cx={cx} cy={cy} r={k%2?5:3.4} fill={k%2?accent:c3} />;
                        })}
                    </g>
                    <g style={floatStyle}>
                        <circle cx={100} cy={104} r={24} fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
                        <circle cx={100} cy={104} r={15} fill={accent} />
                        <circle cx={100} cy={104} r={15} fill="none" stroke={bg} strokeWidth={1.6} />
                        <circle cx={100} cy={104} r={5.1} fill={bg} />
                    </g>
                </svg>
            );

        case 'boroughs': // geometric squares
            return (
                <svg viewBox="0 0 200 200" style={svgStyle}>
                    {[0,1,2,3,4].flatMap(j => [0,1,2,3,4].map(i => (
                        <circle key={`g${i}${j}`} cx={48+i*26} cy={52+j*26} r={2.4} fill={c3} opacity={0.42} />
                    )))}
                    {([[58,62],[112,86],[78,126]] as [number,number][]).map(([x,y], k) => (
                        <rect key={`s${k}`} x={x} y={y} width={28} height={28} fill={k%2?accent:c3} opacity={0.88} rx={2}
                            transform={`rotate(${k*6-6} ${x+14} ${y+14})`} />
                    ))}
                    <line x1={72} y1={76} x2={126} y2={100} stroke={accent} strokeWidth={1.4} strokeDasharray="2 6" opacity={0.7} />
                    <g style={floatStyle}>
                        <circle cx={142} cy={150} r={22} fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
                        <circle cx={142} cy={150} r={13} fill={accent} />
                        <circle cx={142} cy={150} r={13} fill="none" stroke={bg} strokeWidth={1.6} />
                        <circle cx={142} cy={150} r={4.42} fill={bg} />
                    </g>
                </svg>
            );

        case 'minddo': { // isometric pipeline stack — ingest, queue, workers
            const W = 50, H = 25, T = 11;                       // plate half-width, half-height, thickness
            const plate = (cy: number) => ({
                top:   `${100 - W},${cy} ${100},${cy - H} ${100 + W},${cy} ${100},${cy + H}`,
                left:  `${100 - W},${cy} ${100},${cy + H} ${100},${cy + H + T} ${100 - W},${cy + T}`,
                right: `${100 + W},${cy} ${100},${cy + H} ${100},${cy + H + T} ${100 + W},${cy + T}`,
            });
            // Isometric grid coords: (i, j) in [-1,1]² covers the plate, (0,0) is its centre.
            const iso = (cy: number, i: number, j: number): [number, number] =>
                [100 + (i - j) * W / 2, cy + (i + j) * H / 2];
            // Box standing on the plate: base centred on (x, y), body rising by `t`.
            const box = ([x, y]: [number, number], w: number, t: number) => {
                const h = w / 2;
                return {
                    top:   `${x - w},${y - t} ${x},${y - t - h} ${x + w},${y - t} ${x},${y - t + h}`,
                    left:  `${x - w},${y - t} ${x},${y - t + h} ${x},${y + h} ${x - w},${y}`,
                    right: `${x + w},${y - t} ${x},${y - t + h} ${x},${y + h} ${x + w},${y}`,
                };
            };
            const TIERS = [52, 104, 156];
            // Ordered back-to-front so overlapping boxes paint correctly.
            const submitted = box(iso(TIERS[0], 0, 0), 10, 11);
            const queued    = [-0.62, 0, 0.62].map(i => box(iso(TIERS[1], i, 0), 8, 9));
            const workers   = ([[-0.55, 0.18], [0, 0], [0.55, -0.18]] as [number, number][])
                .map(([i, j]) => box(iso(TIERS[2], i, j), 11, 13));

            return (
                <svg viewBox="0 0 200 200" style={svgStyle}>
                    {[0,1,2].flatMap(j => [0,1].map(i => (
                        <circle key={`h${i}${j}`} cx={20+i*11} cy={30+j*11} r={Math.max(0.7,2.6-0.45*(i+j))} fill={c3} opacity={0.5} />
                    )))}

                    {/* spine linking the three tiers — only visible in the gaps between plates */}
                    <line x1={100} y1={44} x2={100} y2={176} stroke={accent} strokeWidth={1.4} strokeDasharray="2 7" opacity={0.55} />

                    {TIERS.map((cy, k) => {
                        const pl = plate(cy);
                        const on = k === 0 ? [submitted] : k === 1 ? queued : workers;
                        return (
                            <g key={`t${k}`}>
                                <polygon points={pl.left}  fill={accent} opacity={0.9} />
                                <polygon points={pl.right} fill={c3}     opacity={0.75} />
                                <polygon points={pl.top}   fill={bg} stroke={accent} strokeWidth={1.4} strokeLinejoin="round" />
                                {on.map((o, n) => (
                                    <g key={`b${k}${n}`} opacity={k === 1 && n > 0 ? 0.78 : 1}>
                                        <polygon points={o.left}  fill={accent} />
                                        <polygon points={o.right} fill={c3} />
                                        <polygon points={o.top}   fill={bg} stroke={accent} strokeWidth={1.1} strokeLinejoin="round" />
                                    </g>
                                ))}
                            </g>
                        );
                    })}

                    {/* the submitted URL, orbiting above the ingest tier */}
                    <g style={orbitStyle}>
                        <ellipse cx={100} cy={22} rx={40} ry={16} fill="none" stroke={c3} strokeWidth={1.2} strokeDasharray="2 9" opacity={0.65} />
                    </g>
                    <g style={floatStyle}>
                        <circle cx={100} cy={22} r={16} fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
                        <circle cx={100} cy={22} r={10} fill={accent} />
                        <circle cx={100} cy={22} r={10} fill="none" stroke={bg} strokeWidth={1.6} />
                        <circle cx={100} cy={22} r={3.4} fill={bg} />
                    </g>
                </svg>
            );
        }

        default: // noteform — piano keyboard
            return (
                <svg viewBox="0 0 200 200" style={svgStyle}>
                    {[0,1,2,3,4,5,6].map(k => (
                        <rect key={`wk${k}`} x={26+k*22} y={102} width={20} height={82} fill="#f8f8f6" stroke="#1a1a1a" strokeWidth={1.4} rx={2} />
                    ))}
                    {[0,1,3,4,5].map((k,j) => (
                        <rect key={`bk${j}`} x={38+k*22} y={102} width={14} height={52} fill="#111" rx={2} />
                    ))}
                    <line x1={24} y1={184} x2={182} y2={184} stroke={accent} strokeWidth={1.6} opacity={0.6} />
                    <g style={floatStyle}>
                        <path d="M 100 78 L 100 48" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
                        <ellipse cx={100} cy={78} rx={7} ry={7} fill={accent} />
                        <path d="M 100 48 C 106 46 112 50 110 58" fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
                        <circle cx={110} cy={64} r={5} fill={accent} />
                    </g>
                    {[0,1,2].flatMap(j => [0,1].map(i => (
                        <circle key={`h${i}${j}`} cx={152+i*9} cy={38+j*9} r={Math.max(0.7,2.2-0.38*(i+j))} fill={c3} opacity={0.5} />
                    )))}
                </svg>
            );
    }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function ArrowIcon({ dir = 'right', size = 16 }: { dir?: 'left' | 'right'; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            {dir === 'right'
                ? <><line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" /></>
                : <><line x1="14" y1="8" x2="2" y2="8" /><polyline points="7,3 2,8 7,13" /></>
            }
        </svg>
    );
}

// ─── Poster card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onOpen, isMobile }: { project: Project; index: number; onOpen: (p: Project) => void; isMobile: boolean }) {
    const [hovered, setHovered] = useState(false);
    const router = useRouter();
    const pal = PALETTES[project.id] ?? PALETTES.noteform;
    const TILTS = [-2, 1.6, -1.3, 2];
    const tilt = TILTS[index % TILTS.length];
    // Mobile: cards stay flat — tilt and lift only on desktop hover
    const tf = isMobile ? 'none' : (hovered ? 'rotate(0deg) translateY(-12px) scale(1.025)' : `rotate(${tilt}deg)`);

    return (
        <Reveal delay={(index % 3) * 0.08}>
            <div
                onMouseEnter={isMobile ? undefined : () => setHovered(true)}
                onMouseLeave={isMobile ? undefined : () => setHovered(false)}
                onClick={() => (project.href ? router.push(project.href) : onOpen(project))}
                style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column',
                    borderRadius: 3, overflow: 'hidden',
                    background: pal.bg, color: pal.ink,
                    boxShadow: isMobile
                        ? '0 8px 20px rgba(40,30,15,.1), 0 2px 6px rgba(40,30,15,.06)'
                        : hovered
                            ? '0 34px 66px rgba(40,30,15,.26), 0 8px 18px rgba(40,30,15,.12)'
                            : '0 16px 38px rgba(40,30,15,.15), 0 3px 9px rgba(40,30,15,.07)',
                    transform: tf,
                    transition: 'transform .55s cubic-bezier(.34,1.26,.5,1), box-shadow .45s ease',
                    willChange: 'transform',
                    zIndex: hovered ? 5 : 1,
                    cursor: 'pointer',
                }}
            >
                {/* Decorative tab */}
                <div style={{
                    position: 'absolute', left: '50%', top: 0,
                    width: 2, height: 15, background: '#bcae9655',
                    transform: 'translateX(-50%)', zIndex: 3,
                }} />

                {/* Year badge */}
                <span style={{
                    position: 'absolute', right: 15, top: 13, zIndex: 2,
                    fontFamily: DISPLAY, fontStyle: 'italic', fontSize: '1.05rem',
                    color: pal.accent, opacity: 0.72,
                }}>
                    {project.year}
                </span>

                {/* Artwork */}
                <div style={{ position: 'relative', aspectRatio: '1/1', padding: 32 }}>
                    <ProjectArt id={project.id} pal={pal} />
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '2px 22px 24px' }}>
                    <span style={{ fontFamily: BODY, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: pal.accent, opacity: 0.92, marginBottom: 7 }}>
                        {project.subtitle}
                    </span>
                    <span style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontWeight: 500, lineHeight: 0.92, fontSize: '2.05rem', letterSpacing: '-0.01em', color: pal.ink }}>
                        {project.name}
                    </span>
                    {project.award && (
                        <span style={{ fontFamily: BODY, fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: pal.accent, marginTop: 6, opacity: 0.8, lineHeight: 1.4 }}>
                            {project.award}
                        </span>
                    )}
                    <div style={{ height: 1, width: 32, background: pal.accent, marginTop: 15, opacity: 0.5 }} />
                    <span style={{ fontFamily: BODY, fontSize: '0.8rem', lineHeight: 1.55, marginTop: 13, color: pal.ink, opacity: 0.84 }}>
                        {project.desc}
                    </span>
                    <span style={{
                        alignSelf: 'flex-start', marginTop: 'auto', paddingTop: 20,
                        fontFamily: BODY, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                        display: 'inline-flex', alignItems: 'center', gap: 7, color: pal.accent,
                    }}>
                        {project.href ? 'Read Case Study' : 'View Details'}{' '}
                        <span style={{ display: 'inline-block', transition: 'transform .35s ease', transform: hovered ? 'translateX(5px)' : 'none' }}>→</span>
                    </span>
                </div>
            </div>
        </Reveal>
    );
}

// ─── Project detail overlay ───────────────────────────────────────────────────
function ProjectDetail({
    project, onClose, onPrev, onNext, prevProject, nextProject, isMobile,
}: {
    project: Project;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    prevProject: Project | null;
    nextProject: Project | null;
    isMobile: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.classList.add('overlay-open');
        if (scrollRef.current) scrollRef.current.scrollTop = 0;

        // Capture focus on open, restore it on close
        const previousFocus = document.activeElement as HTMLElement | null;
        const firstFocusable = scrollRef.current?.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();

        return () => {
            document.body.classList.remove('overlay-open');
            previousFocus?.focus();
        };
    }, [project.id]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key === 'ArrowRight' && nextProject) { onNext(); return; }
            if (e.key === 'ArrowLeft' && prevProject) { onPrev(); return; }
            if (e.key === 'Tab' && scrollRef.current) {
                const focusable = Array.from(
                    scrollRef.current.querySelectorAll<HTMLElement>(
                        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    )
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [project.id, nextProject, prevProject, onClose, onNext, onPrev]);

    const currentIndex = OVERLAY_PROJECTS.findIndex(p => p.id === project.id);

    return (
        <motion.div
            ref={scrollRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} project detail`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: '#fff', overflowY: 'auto',
            }}
        >
            {/* Sticky header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${ACCENT}22`,
                padding: isMobile ? '0 16px' : '0 48px', height: 68,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button
                        onClick={onClose}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#888',
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontFamily: BODY, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0,
                            transition: 'color 0.2s',
                        }}
                    >
                        <ArrowIcon dir="left" size={14} /> Back
                    </button>
                    <div style={{ width: 1, height: 18, background: '#e0ddd8' }} />
                    <span style={{ fontFamily: BODY, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa' }}>
                        {currentIndex + 1} / {OVERLAY_PROJECTS.length}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { handler: onPrev, dir: 'left' as const, enabled: !!prevProject },
                        { handler: onNext, dir: 'right' as const, enabled: !!nextProject },
                    ].map(({ handler, dir, enabled }) => (
                        <button
                            key={dir}
                            onClick={handler}
                            disabled={!enabled}
                            onMouseEnter={e => { if (enabled) { (e.currentTarget as HTMLButtonElement).style.background = `${ACCENT}11`; (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT; } }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = enabled ? `${ACCENT}44` : '#eee'; }}
                            style={{
                                background: 'none',
                                border: `1px solid ${enabled ? ACCENT + '44' : '#eee'}`,
                                color: enabled ? ACCENT : '#ccc',
                                width: 36, height: 36,
                                cursor: enabled ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            <ArrowIcon dir={dir} size={14} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero area */}
            <div style={{
                background: 'linear-gradient(160deg, #fafaf7 0%, #fff 60%)',
                borderBottom: `1px solid ${ACCENT}18`,
                padding: isMobile ? '40px 20px 32px' : '72px 48px 60px',
            }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 280 }}>
                            <p style={{ fontFamily: BODY, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                                {project.year}
                            </p>
                            <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 0.9, marginBottom: 8 }}>
                                {project.name}
                            </h1>
                            <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontStyle: 'italic', fontWeight: 300, color: '#6b6558', marginBottom: 28, lineHeight: 1.3 }}>
                                {project.subtitle}
                            </p>
                            <div style={{ width: 40, height: 1, background: ACCENT, marginBottom: 28 }} />
                            <p style={{ fontFamily: BODY, fontSize: '1rem', color: '#3a3530', lineHeight: 1.8, maxWidth: 560, marginBottom: 32 }}>
                                {project.overview}
                            </p>
                            {project.award && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `${ACCENT}0d`, border: `1px solid ${ACCENT}33`, padding: '10px 18px', marginBottom: 32 }}>
                                    <span style={{ fontFamily: BODY, fontSize: '0.8rem', fontWeight: 500, color: ACCENT, lineHeight: 1.4 }}>{project.award}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 12 }}>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#9a720a'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ACCENT; }}
                                    style={{
                                        fontFamily: BODY, fontSize: '0.78rem', fontWeight: 500,
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        color: '#fff', background: ACCENT, border: `1px solid ${ACCENT}`,
                                        padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: 8,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <GitHubIcon size={15} /> GitHub
                                </a>
                            </div>
                        </div>

                        {/* Demo / screenshot */}
                        <div style={{
                            width: isMobile ? '100%' : 340, flexShrink: isMobile ? 1 : 0,
                            border: `1px solid ${ACCENT}33`,
                            background: (project.demoVideo || project.mockImage) ? 'transparent' : `repeating-linear-gradient(45deg, ${ACCENT}06 0px, ${ACCENT}06 1px, transparent 1px, transparent 12px)`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: 10, position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: (project.demoVideo || project.mockImage) ? 'transparent' : `radial-gradient(ellipse at 60% 40%, ${ACCENT}08, transparent 70%)`, pointerEvents: 'none' }} />
                            {project.demoVideo && (
                                <iframe
                                    src={project.demoVideo}
                                    title={project.mockLabel}
                                    style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            )}
                            {project.mockImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={project.mockImage} alt={project.mockLabel} style={{ width: '100%', height: 'auto', display: 'block' }} />
                            )}
                            {!project.demoVideo && !project.mockImage && (
                                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textAlign: 'center', color: '#c0b89a', padding: '0 24px', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
                                    [ screenshot ]<br />{project.mockLabel}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '40px 20px' : '72px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems: 'start' }}>
                    {/* Technical breakdown */}
                    <div>
                        <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 32 }}>
                            Technical Breakdown
                        </p>
                        {project.details.map((d, i) => (
                            <div key={i} style={{ marginBottom: 40, paddingLeft: 20, borderLeft: `2px solid ${i === 0 ? ACCENT : ACCENT + '44'}` }}>
                                <h4 style={{ fontFamily: DISPLAY, fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>
                                    {d.heading}
                                </h4>
                                <p style={{ fontFamily: BODY, fontSize: '0.88rem', color: '#4a4540', lineHeight: 1.75 }}>
                                    {d.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Tech stack */}
                    <div>
                        <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 32 }}>
                            Tech Stack
                        </p>
                        {project.stack.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: `1px solid ${ACCENT}14` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.03em' }}>{s.name}</span>
                                </div>
                                <span style={{ fontFamily: BODY, fontSize: '0.78rem', color: '#8a8078', textAlign: 'right', maxWidth: 160 }}>{s.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prev / next footer */}
                <div style={{ marginTop: 80, paddingTop: 40, borderTop: `1px solid ${ACCENT}18`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {prevProject ? (
                        <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', padding: 0 }}>
                            <div style={{ color: '#aaa' }}><ArrowIcon dir="left" size={18} /></div>
                            <div>
                                <p style={{ fontFamily: BODY, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: 3 }}>Previous</p>
                                <p style={{ fontFamily: DISPLAY, fontSize: '1.3rem', fontWeight: 500, color: '#1a1a1a' }}>{prevProject.name}</p>
                            </div>
                        </button>
                    ) : <div />}
                    {nextProject ? (
                        <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'right', padding: 0 }}>
                            <div>
                                <p style={{ fontFamily: BODY, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: 3 }}>Next</p>
                                <p style={{ fontFamily: DISPLAY, fontSize: '1.3rem', fontWeight: 500, color: '#1a1a1a' }}>{nextProject.name}</p>
                            </div>
                            <div style={{ color: '#aaa' }}><ArrowIcon dir="right" size={18} /></div>
                        </button>
                    ) : <div />}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Projects section ─────────────────────────────────────────────────────────
export default function ProjectsSection() {
    const tilt = useScrollTilt();
    const isMobile = useIsMobile();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const { openOverlay, closeOverlay, overlayOpen } = useOverlay();

    const currentIndex = activeProject ? OVERLAY_PROJECTS.findIndex(p => p.id === activeProject.id) : -1;
    const prevProject = currentIndex > 0 ? OVERLAY_PROJECTS[currentIndex - 1] : null;
    const nextProject = currentIndex > -1 && currentIndex < OVERLAY_PROJECTS.length - 1 ? OVERLAY_PROJECTS[currentIndex + 1] : null;

    const handleOpen = (project: Project) => {
        setActiveProject(project);
        openOverlay();
    };

    const handleClose = () => {
        setActiveProject(null);
        closeOverlay();
    };

    useEffect(() => {
        if (!overlayOpen && activeProject) {
            setActiveProject(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlayOpen]);

    return (
        <section id="projects" style={{ background: '#ffffff', padding: isMobile ? '80px 24px' : '120px 48px' }}>
            <div style={{ maxWidth: 1160, margin: '0 auto' }}>

                {/* Section header */}
                <Reveal style={{ marginBottom: 8 }}>
                    <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                        02
                    </p>
                    <motion.h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1, rotateX: tilt, transformPerspective: 800 }}>
                        Projects
                    </motion.h2>
                    <div style={{ width: 40, height: 1, background: ACCENT, marginTop: 16 }} />
                </Reveal>

                {/* Poster card grid — responsive via .project-grid in globals.css */}
                <div className="project-grid">
                    {projects.map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i} onOpen={handleOpen} isMobile={isMobile} />
                    ))}
                </div>
            </div>

            {/* Full-screen detail overlay — AnimatePresence gives it a proper exit animation */}
            <AnimatePresence>
                {activeProject && (
                    <ProjectDetail
                        key="overlay"
                        project={activeProject}
                        onClose={handleClose}
                        onPrev={() => prevProject && setActiveProject(prevProject)}
                        onNext={() => nextProject && setActiveProject(nextProject)}
                        prevProject={prevProject}
                        nextProject={nextProject}
                        isMobile={isMobile}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
