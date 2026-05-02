'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import { useOverlay } from '@/contexts/OverlayContext';
import Reveal from './Reveal';
import { useScrollTilt } from '@/hooks/useScrollTilt';

const ACCENT = '#b8860b';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BODY = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';

// ─── Icons ─────────────────────────────────────────────────────────────────
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

// ─── Art Deco corner ornament ───────────────────────────────────────────────
function OrnateCorner({ position, visible }: { position: 'tl' | 'tr' | 'bl' | 'br'; visible: boolean }) {
    const S = 32, sw = 1.2, d = 4;
    const paths = {
        tl: `M ${S},4 L 4,4 L 4,${S}`,
        tr: `M 0,4 L ${S - 4},4 L ${S - 4},${S}`,
        bl: `M ${S},${S - 4} L 4,${S - 4} L 4,0`,
        br: `M 0,${S - 4} L ${S - 4},${S - 4} L ${S - 4},0`,
    };
    const diamonds: Record<string, [number, number]> = { tl: [4, 4], tr: [S - 4, 4], bl: [4, S - 4], br: [S - 4, S - 4] };
    const [cx, cy] = diamonds[position];
    const pos = { tl: { top: 0, left: 0 }, tr: { top: 0, right: 0 }, bl: { bottom: 0, left: 0 }, br: { bottom: 0, right: 0 } }[position];

    return (
        <svg
            width={S} height={S} viewBox={`0 0 ${S} ${S}`}
            style={{ position: 'absolute', ...pos, opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease', pointerEvents: 'none' }}
        >
            <path d={paths[position]} fill="none" stroke={ACCENT} strokeWidth={sw} />
            <polygon points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`} fill={ACCENT} />
            {position === 'tl' && <><line x1={4} y1={13} x2={9} y2={13} stroke={ACCENT} strokeWidth={sw * 0.8} /><line x1={13} y1={4} x2={13} y2={9} stroke={ACCENT} strokeWidth={sw * 0.8} /></>}
            {position === 'tr' && <><line x1={S - 4} y1={13} x2={S - 9} y2={13} stroke={ACCENT} strokeWidth={sw * 0.8} /><line x1={S - 13} y1={4} x2={S - 13} y2={9} stroke={ACCENT} strokeWidth={sw * 0.8} /></>}
            {position === 'bl' && <><line x1={4} y1={S - 13} x2={9} y2={S - 13} stroke={ACCENT} strokeWidth={sw * 0.8} /><line x1={13} y1={S - 4} x2={13} y2={S - 9} stroke={ACCENT} strokeWidth={sw * 0.8} /></>}
            {position === 'br' && <><line x1={S - 4} y1={S - 13} x2={S - 9} y2={S - 13} stroke={ACCENT} strokeWidth={sw * 0.8} /><line x1={S - 13} y1={S - 4} x2={S - 13} y2={S - 9} stroke={ACCENT} strokeWidth={sw * 0.8} /></>}
        </svg>
    );
}

// ─── Project row ────────────────────────────────────────────────────────────
function ProjectRow({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
    const [hovered, setHovered] = useState(false);
    const isEven = index % 2 === 0;

    return (
        <Reveal
            delay={(index % 3) * 0.08}
            style={{
                position: 'relative',
                padding: '40px 36px',
                cursor: 'pointer',
                background: hovered ? (isEven ? '#fafaf7' : '#fff') : 'transparent',
                transition: 'background 0.35s ease',
                borderTop: `1px solid ${ACCENT}18`,
            }}
        >
            {/* Corner ornaments — outside the content div so they sit in the row's padding zone */}
            {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
                <OrnateCorner key={pos} position={pos} visible={hovered} />
            ))}

            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => onOpen(project)}
                style={{ position: 'relative', overflow: 'hidden' }}
            >

                {/* Thumbnail — absolutely positioned, slides in from the left edge */}
                {project.mockImage && (
                    <div style={{
                        position: 'absolute',
                        left: 0, top: '50%',
                        width: 260, height: 163,
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: `1px solid ${ACCENT}33`,
                        boxShadow: '0 6px 28px rgba(0,0,0,0.15)',
                        pointerEvents: 'none',
                        zIndex: 2,
                        transform: `translateY(-50%) translateX(${hovered ? 0 : -280}px)`,
                        opacity: hovered ? 1 : 0,
                        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={project.mockImage} alt={project.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', background: '#f7f4ef' }} />
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
                    {/* Left — padding-left grows to push text right and reflow it within the narrowed column */}
                    <div style={{
                        paddingLeft: hovered && project.mockImage ? 276 : 0,
                        transition: 'padding-left 0.5s cubic-bezier(0.22,1,0.36,1)',
                        minWidth: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 10, flexWrap: 'wrap' }}>
                            <h3 style={{
                                fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400,
                                color: hovered ? ACCENT : '#1a1a1a', lineHeight: 1, letterSpacing: '-0.01em',
                                transition: 'color 0.3s ease',
                            }}>
                                {project.name}
                            </h3>
                            {project.award && (
                                <span style={{
                                    fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.08em',
                                    color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}33`,
                                    padding: '3px 10px', flexShrink: 0,
                                    opacity: hovered ? 1 : 0.6, transition: 'opacity 0.2s',
                                }}>
                                    {project.award}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingLeft: 48 }}>
                            <p style={{ fontFamily: BODY, fontSize: '0.73rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, flexShrink: 0 }}>
                                {project.subtitle}
                            </p>
                            <div style={{ width: 1, height: 12, background: `${ACCENT}44`, flexShrink: 0 }} />
                            <p style={{ fontFamily: BODY, fontSize: '0.85rem', color: '#6b6558', lineHeight: 1.5, flex: 1 }}>
                                {project.desc}
                            </p>
                        </div>
                    </div>

                    {/* Right — year + explore, stays anchored to the right */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                        <span style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: '1.1rem', color: `${ACCENT}77`, fontWeight: 300 }}>
                            {project.year}
                        </span>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontFamily: BODY, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: hovered ? ACCENT : '#bbb', transition: 'color 0.25s',
                        }}>
                            Explore <ArrowIcon dir="right" size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

// ─── Project detail overlay ─────────────────────────────────────────────────
function ProjectDetail({
    project, onClose, onPrev, onNext, prevProject, nextProject,
}: {
    project: Project;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    prevProject: Project | null;
    nextProject: Project | null;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.classList.add('overlay-open');
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        return () => document.body.classList.remove('overlay-open');
    }, [project.id]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && nextProject) onNext();
            if (e.key === 'ArrowLeft' && prevProject) onPrev();
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [project.id, nextProject, prevProject, onClose, onNext, onPrev]);

    const currentIndex = projects.findIndex(p => p.id === project.id);

    return (
        <div ref={scrollRef} style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: '#fff', overflowY: 'auto',
            animation: 'slideUp 0.55s cubic-bezier(.22,1,.36,1) forwards',
        }}>
            {/* Sticky header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${ACCENT}22`,
                padding: '0 48px', height: 68,
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
                        {currentIndex + 1} / {projects.length}
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
                padding: '72px 48px 60px',
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

                        {/* Mock screenshot */}
                        <div style={{
                            width: 340, flexShrink: 0,
                            border: `1px solid ${ACCENT}33`,
                            background: (project.demoVideo || project.mockImage) ? 'transparent' : `repeating-linear-gradient(45deg, ${ACCENT}06 0px, ${ACCENT}06 1px, transparent 1px, transparent 12px)`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: 10, position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: (project.demoVideo || project.mockImage) ? 'transparent' : `radial-gradient(ellipse at 60% 40%, ${ACCENT}08, transparent 70%)` }} />
                            {project.demoVideo && (
                                <iframe
                                    src={project.demoVideo}
                                    title={project.mockLabel}
                                    style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                            {project.mockImage && (
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
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

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
        </div>
    );
}

// ─── Projects section ────────────────────────────────────────────────────────
export default function ProjectsSection() {
    const tilt = useScrollTilt();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const { openOverlay, closeOverlay, overlayOpen } = useOverlay();

    const currentIndex = activeProject ? projects.findIndex(p => p.id === activeProject.id) : -1;
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

    const handleOpen = (project: Project) => {
        setActiveProject(project);
        openOverlay();
    };

    const handleClose = () => {
        setActiveProject(null);
        closeOverlay();
    };

    // Allow NavBar to close the overlay externally
    useEffect(() => {
        if (!overlayOpen && activeProject) {
            setActiveProject(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlayOpen]);

    return (
        <section id="projects" style={{ background: '#ffffff', padding: '120px 48px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>

                {/* Section header */}
                <Reveal style={{ marginBottom: 72 }}>
                    <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                        02
                    </p>
                    <motion.h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1, rotateX: tilt, transformPerspective: 800 }}>
                        Projects
                    </motion.h2>
                    <div style={{ width: 40, height: 1, background: ACCENT, marginTop: 16 }} />
                </Reveal>

                {/* Editorial list */}
                <div style={{ borderBottom: `1px solid ${ACCENT}18` }}>
                    {projects.map((p, i) => (
                        <ProjectRow key={p.id} project={p} index={i} onOpen={handleOpen} />
                    ))}
                </div>
            </div>

            {/* Full-screen overlay */}
            {activeProject && (
                <ProjectDetail
                    project={activeProject}
                    onClose={handleClose}
                    onPrev={() => prevProject && setActiveProject(prevProject)}
                    onNext={() => nextProject && setActiveProject(nextProject)}
                    prevProject={prevProject}
                    nextProject={nextProject}
                />
            )}
        </section>
    );
}
