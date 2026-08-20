'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import Reveal from './Reveal';
import FlapText from './concourse/FlapText';
import Pictogram from './concourse/Pictogram';
import { useOverlay } from '@/contexts/OverlayContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    SIGNAL, SIGNAL_INK_SOFT, ENAMEL, STEEL, STEEL_SOFT,
    BOARD, BOARD_INK, BOARD_INK_SOFT, SIGN_WHITE, SIGN_INK, SIGN_INK_SOFT,
    CHALK, RED, RULE_DARK, RULE, DISABLED_TEXT,
    SIGN, EASE_OUT, TYPE,} from '@/design/tokens';

const VISITED_KEY = 'oz-visited';

/** The projects that open in the sheet rather than routing to their own page. */
const SHEET_PROJECTS = projects.filter(p => !p.href);

/** Gate numbers. The hero board sends the whole section here as one destination
 *  — "Gates 01–04" on platform 02 — and these are the gates it means. A platform
 *  serves several gates, which is why the two numberings can coexist without
 *  either becoming a bare ordinal. */
const gateNo = (p: Project) => String(projects.indexOf(p) + 1).padStart(2, '0');

// ─── One platform panel ──────────────────────────────────────────────────────
function PlatformPanel({
    project, index, visited, onOpen, isMobile,
}: {
    project: Project;
    index: number;
    visited: boolean;
    onOpen: (p: Project) => void;
    isMobile: boolean;
}) {
    const [lit, setLit] = useState(false);
    /* Bumped on entry rather than toggled, so the row re-flaps when the pointer
       arrives and stays landed when it leaves. */
    const [flap, setFlap] = useState(0);

    const enter = () => { setLit(true); setFlap(f => f + 1); };
    const leave = () => setLit(false);

    const ink = lit ? STEEL : BOARD_INK;
    const inkSoft = lit ? SIGNAL_INK_SOFT : BOARD_INK_SOFT;

    const shell: React.CSSProperties = {
        display: 'block', width: '100%', textAlign: 'left',
        background: lit ? SIGNAL : 'transparent',
        border: 'none',
        borderTop: `1px solid ${lit ? SIGNAL : RULE_DARK}`,
        padding: isMobile ? '24px 18px 26px' : '32px 28px 34px',
        cursor: 'pointer',
        fontFamily: SIGN,
        color: ink,
        transition: `background 0.22s ${EASE_OUT}, color 0.22s ${EASE_OUT}, border-color 0.22s ${EASE_OUT}`,
    };

    const handlers = {
        onMouseEnter: enter, onMouseLeave: leave,
        onFocus: enter, onBlur: leave,
    };

    const body = (
        <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'clamp(88px, 8vw, 132px) minmax(0, 1fr) auto',
            gap: isMobile ? 16 : 32,
            alignItems: 'start',
        }}>
            {/* The gate number, at the scale a gate number is painted, with its
                own plate above it so it reads as a wayfinding number and not as
                an item count. The hero board's platform 02 sends you here for
                "4 gates"; these are the gates it meant. */}
            <span style={{ display: 'block' }}>
                <span style={{
                    display: 'block',
                    fontSize: TYPE.MICRO, fontWeight: 700, fontStretch: '88%',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: lit ? SIGNAL_INK_SOFT : BOARD_INK_SOFT,
                    marginBottom: 7,
                    transition: `color 0.22s ${EASE_OUT}`,
                }}>
                    Gate
                </span>
                <span style={{
                    display: 'block',
                    fontSize: isMobile ? TYPE.SUBHEAD : 'clamp(3rem, 5.4vw, 4.6rem)',
                    fontWeight: 800, fontStretch: '112%', lineHeight: 0.8,
                    letterSpacing: '-0.04em',
                    color: lit ? STEEL : SIGNAL,
                    transition: `color 0.22s ${EASE_OUT}`,
                }}>
                    {gateNo(project)}
                </span>
            </span>

            <div style={{ minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 6 }}>
                    <FlapText
                        key={flap}
                        text={project.name.replace('.ai Showcase', '.AI')}
                        variant="bare"
                        stagger={1}
                        style={{
                            fontSize: isMobile ? TYPE.SUBHEAD : 'clamp(1.8rem, 3vw, 2.6rem)',
                            fontWeight: 800, fontStretch: '104%',
                            letterSpacing: '-0.025em', lineHeight: 1,
                            color: ink,
                        }}
                    />
                    <span style={{
                        fontSize: TYPE.META, fontWeight: 700, letterSpacing: '0.12em',
                        color: inkSoft, whiteSpace: 'nowrap',
                    }}>
                        {project.year}
                    </span>
                </span>

                <p style={{
                    fontSize: isMobile ? TYPE.META : TYPE.META, fontWeight: 700,
                    fontStretch: '88%', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: lit ? STEEL : SIGNAL,
                    marginBottom: 12,
                    transition: `color 0.22s ${EASE_OUT}`,
                }}>
                    {project.subtitle}
                </p>

                <p style={{
                    fontSize: isMobile ? TYPE.COPY : TYPE.BODY, lineHeight: 1.6,
                    color: lit ? STEEL : BOARD_INK, maxWidth: '62ch',
                    marginBottom: 16,
                }}>
                    {project.desc}
                </p>

                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(project.id === 'minddo'
                        ? ['AWS', 'k3s', 'KEDA', 'Postgres', 'Celery']
                        : project.stack.map(s => s.name)
                    ).map(name => (
                        <span key={name} style={{
                            fontSize: TYPE.LABEL, fontWeight: 700, fontStretch: '88%',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: lit ? SIGNAL : STEEL,
                            background: lit ? STEEL : CHALK,
                            padding: '5px 10px',
                            transition: `background 0.22s ${EASE_OUT}, color 0.22s ${EASE_OUT}`,
                        }}>
                            {name}
                        </span>
                    ))}
                </span>
            </div>

            {/* Seen mark and gate. */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'flex-end',
                justifyContent: isMobile ? 'space-between' : 'flex-start',
                gap: isMobile ? 12 : 20,
                width: isMobile ? '100%' : undefined,
            }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {visited && (
                        <span
                            title="You have opened this one"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                fontSize: TYPE.MICRO, fontWeight: 700, fontStretch: '88%',
                                letterSpacing: '0.16em', textTransform: 'uppercase',
                                color: inkSoft,
                            }}
                        >
                            <Pictogram name="check" size={9} />
                            Seen
                        </span>
                    )}
                </span>

                <span
                    className="oz-gate"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: lit ? STEEL : 'transparent',
                        border: `2px solid ${lit ? STEEL : SIGNAL}`,
                        color: lit ? SIGNAL : SIGNAL,
                        padding: '0 16px', minHeight: 44,
                        fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        transition: `background 0.22s ${EASE_OUT}, border-color 0.22s ${EASE_OUT}, color 0.22s ${EASE_OUT}`,
                    }}
                >
                    {project.href ? 'Case Study' : 'Open'}
                    <Pictogram name="arrow-right" size={13} />
                </span>
            </div>
        </div>
    );

    return (
        <Reveal delay={Math.min(index, 3) * 0.06}>
            {project.href ? (
                <Link href={project.href} style={shell} {...handlers}
                    aria-label={`${project.name} — read the case study`}>
                    {body}
                </Link>
            ) : (
                <button type="button" onClick={() => onOpen(project)} style={shell} {...handlers}
                    aria-label={`${project.name} — open the project`}>
                    {body}
                </button>
            )}
        </Reveal>
    );
}

// ─── The platform sheet ──────────────────────────────────────────────────────
function PlatformSheet({
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
    const reduced = useReducedMotion();

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

    const currentIndex = SHEET_PROJECTS.findIndex(p => p.id === project.id);

    const gate = (dir: 'left' | 'right', handler: () => void, enabled: boolean) => (
        <button
            onClick={handler}
            disabled={!enabled}
            aria-label={dir === 'left' ? 'Previous project' : 'Next project'}
            style={{
                background: 'none',
                border: `2px solid ${enabled ? SIGNAL : STEEL_SOFT}`,
                color: enabled ? SIGNAL : DISABLED_TEXT,
                width: 44, height: 44,
                cursor: enabled ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `background 0.2s ${EASE_OUT}, color 0.2s ${EASE_OUT}`,
            }}
            onMouseEnter={e => {
                if (!enabled) return;
                e.currentTarget.style.background = SIGNAL;
                e.currentTarget.style.color = STEEL;
            }}
            onMouseLeave={e => {
                if (!enabled) return;
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = SIGNAL;
            }}
        >
            <Pictogram name={dir === 'left' ? 'arrow-left' : 'arrow-right'} size={16} />
        </button>
    );

    return (
        <motion.div
            ref={scrollRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} project detail`}
            /* The rise goes under reduced motion, the cross-fade stays: a
               full-screen surface appearing with no transition at all reads as a
               page navigation rather than a layer opening over this one. */
            initial={{ y: reduced ? 0 : 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : -28, opacity: 0 }}
            transition={reduced
                ? { duration: 0.2, ease: 'linear' }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: BOARD, overflowY: 'auto', fontFamily: SIGN,
            }}
        >
            {/* The sheet's own rail. */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: STEEL, borderBottom: `1px solid ${STEEL_SOFT}`,
                padding: isMobile ? '0 12px 0 0' : '0 28px 0 0', height: 60,
                display: 'flex', alignItems: 'stretch', justifyContent: 'space-between',
            }}>
                <button
                    onClick={onClose}
                    style={{
                        background: SIGNAL, color: STEEL, border: 'none', cursor: 'pointer',
                        padding: isMobile ? '0 16px' : '0 22px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontFamily: SIGN, fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        transition: `background 0.18s ${EASE_OUT}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = SIGN_WHITE; }}
                    onMouseLeave={e => { e.currentTarget.style.background = SIGNAL; }}
                >
                    <Pictogram name="arrow-left" size={14} />
                    Back
                </button>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 20,
                    color: BOARD_INK_SOFT, fontSize: TYPE.LABEL, fontWeight: 700,
                    fontStretch: '88%', letterSpacing: '0.18em', textTransform: 'uppercase',
                }}>
                    Gate {gateNo(project)}
                    <span aria-hidden="true" style={{ width: 1, height: 14, background: STEEL_SOFT }} />
                    {currentIndex + 1} / {SHEET_PROJECTS.length}
                </div>

                <div style={{ flex: 1 }} />

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {gate('left', onPrev, !!prevProject)}
                    {gate('right', onNext, !!nextProject)}
                </div>
            </div>

            {/* The sheet's head: a signal panel, as on the platform itself. */}
            <div style={{
                background: SIGNAL,
                padding: isMobile ? '28px 20px 32px' : '52px 48px 56px',
            }}>
                <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 9,
                        background: STEEL, color: SIGNAL,
                        padding: '6px 12px', marginBottom: 20,
                        fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                    }}>
                        Gate {gateNo(project)} · {project.year}
                    </span>

                    <h2 style={{
                        fontSize: isMobile ? 'clamp(2.2rem, 11vw, 3.2rem)' : 'clamp(3rem, 6.4vw, 5.4rem)',
                        fontWeight: 800, fontStretch: '112%',
                        letterSpacing: '-0.035em', lineHeight: 0.86, color: STEEL,
                        marginBottom: 12,
                    }}>
                        {project.name}
                    </h2>

                    <p style={{
                        fontSize: isMobile ? TYPE.META : TYPE.COPY, fontWeight: 700,
                        fontStretch: '88%', letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: SIGNAL_INK_SOFT, marginBottom: 26,
                    }}>
                        {project.subtitle}
                    </p>

                    <p style={{
                        fontSize: isMobile ? TYPE.BODY : TYPE.LEDE, lineHeight: 1.6,
                        color: STEEL, maxWidth: '58ch',
                    }}>
                        {project.overview}
                    </p>

                    {project.award && (
                        <p style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            background: RED, color: SIGN_WHITE,
                            padding: '11px 16px', marginTop: 26,
                            fontSize: TYPE.CONTROL, fontWeight: 700, lineHeight: 1.35,
                        }}>
                            <Pictogram name="check" size={13} />
                            {project.award}
                        </p>
                    )}

                    {project.githubUrl && (
                        <div style={{ marginTop: 26 }}>
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 10,
                                    background: STEEL, color: SIGNAL,
                                    padding: '0 22px', minHeight: 48,
                                    fontSize: TYPE.CONTROL, fontWeight: 800, fontStretch: '88%',
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    transition: `background 0.2s ${EASE_OUT}, color 0.2s ${EASE_OUT}`,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = SIGN_WHITE;
                                    e.currentTarget.style.color = STEEL;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = STEEL;
                                    e.currentTarget.style.color = SIGNAL;
                                }}
                            >
                                <Pictogram name="github" size={15} />
                                Source
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* The demo, framed in steel the way a platform screen is. */}
            {(project.demoVideo || project.mockImage) && (
                <div style={{
                    background: STEEL,
                    padding: isMobile ? '20px 20px' : '40px 48px',
                }}>
                    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                        {project.mockLabel && (
                            <p style={{
                                fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: SIGNAL, marginBottom: 14,
                            }}>
                                {project.mockLabel}
                            </p>
                        )}
                        <div style={{ border: `2px solid ${STEEL_SOFT}`, background: BOARD }}>
                            {project.demoVideo && (
                                <iframe
                                    src={project.demoVideo}
                                    title={project.mockLabel ?? `${project.name} demo`}
                                    style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            )}
                            {project.mockImage && !project.demoVideo && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={project.mockImage}
                                    alt={project.mockLabel ?? `${project.name} screenshot`}
                                    width={project.mockSize?.[0]}
                                    height={project.mockSize?.[1]}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* The body, on the light sign ground so the long read is a read. */}
            <div style={{
                background: SIGN_WHITE,
                padding: isMobile ? '40px 20px 56px' : '72px 48px 96px',
            }}>
                <div style={{
                    maxWidth: 1080, margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.35fr) minmax(0, 1fr)',
                    gap: isMobile ? 44 : 72,
                    alignItems: 'start',
                }}>
                    <div>
                        <h3 style={{
                            fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: ENAMEL, marginBottom: 26,
                            paddingBottom: 12, borderBottom: `3px solid ${ENAMEL}`,
                        }}>
                            How it was built
                        </h3>
                        {project.details.map(d => (
                            <div key={d.heading} style={{ marginBottom: 32 }}>
                                <h4 style={{
                                    fontSize: TYPE.TITLE, fontWeight: 700, fontStretch: '96%',
                                    letterSpacing: '-0.015em', color: SIGN_INK, marginBottom: 8,
                                }}>
                                    {d.heading}
                                </h4>
                                <p style={{ fontSize: TYPE.COPY, color: SIGN_INK_SOFT, lineHeight: 1.7, maxWidth: '66ch' }}>
                                    {d.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: ENAMEL, marginBottom: 26,
                            paddingBottom: 12, borderBottom: `3px solid ${ENAMEL}`,
                        }}>
                            Stack
                        </h3>
                        {project.stack.map(s => (
                            <div key={s.name} style={{
                                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                                gap: 16, padding: '13px 0', borderBottom: `1px solid ${RULE}`,
                            }}>
                                <span style={{
                                    fontSize: TYPE.META, fontWeight: 700, fontStretch: '88%',
                                    letterSpacing: '0.05em', color: SIGN_INK, whiteSpace: 'nowrap',
                                }}>
                                    {s.name}
                                </span>
                                <span style={{ fontSize: TYPE.META, color: SIGN_INK_SOFT, textAlign: 'right' }}>
                                    {s.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Onward travel. */}
                <div style={{
                    maxWidth: 1080, margin: '72px auto 0',
                    paddingTop: 28, borderTop: `3px solid ${STEEL}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
                }}>
                    {prevProject ? (
                        <button onClick={onPrev} style={onwardStyle}>
                            <Pictogram name="arrow-left" size={16} color={ENAMEL} />
                            <span>
                                <span style={onwardKicker}>Previous</span>
                                <span style={onwardName}>{prevProject.name}</span>
                            </span>
                        </button>
                    ) : <span />}
                    {nextProject ? (
                        <button onClick={onNext} style={{ ...onwardStyle, textAlign: 'right' }}>
                            <span>
                                <span style={onwardKicker}>Next</span>
                                <span style={onwardName}>{nextProject.name}</span>
                            </span>
                            <Pictogram name="arrow-right" size={16} color={ENAMEL} />
                        </button>
                    ) : <span />}
                </div>
            </div>
        </motion.div>
    );
}

const onwardStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
    display: 'flex', alignItems: 'center', gap: 14, fontFamily: SIGN, minHeight: 44,
};
const onwardKicker: React.CSSProperties = {
    display: 'block', fontSize: TYPE.MICRO, fontWeight: 700, fontStretch: '88%',
    letterSpacing: '0.18em', textTransform: 'uppercase', color: SIGN_INK_SOFT, marginBottom: 3,
};
const onwardName: React.CSSProperties = {
    display: 'block', fontSize: TYPE.TITLE, fontWeight: 700, fontStretch: '96%',
    letterSpacing: '-0.015em', color: SIGN_INK,
};

// ─── Section ─────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
    const isMobile = useIsMobile();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    /* Which platforms this visitor has already walked to. The record is held for
       the session rather than the page load, so a reload — or a trip out to the
       case study and back — does not forget where they have been. */
    const [visited, setVisited] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(VISITED_KEY);
            if (saved) setVisited(new Set(JSON.parse(saved) as string[]));
        } catch { /* private browsing — the ticks are simply per page load */ }
    }, []);
    const { openOverlay, closeOverlay, overlayOpen } = useOverlay();

    const currentIndex = activeProject ? SHEET_PROJECTS.findIndex(p => p.id === activeProject.id) : -1;
    const prevProject = currentIndex > 0 ? SHEET_PROJECTS[currentIndex - 1] : null;
    const nextProject = currentIndex > -1 && currentIndex < SHEET_PROJECTS.length - 1 ? SHEET_PROJECTS[currentIndex + 1] : null;

    const handleOpen = useCallback((project: Project) => {
        setActiveProject(project);
        setVisited(v => {
            const next = new Set(v).add(project.id);
            try { sessionStorage.setItem(VISITED_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
            return next;
        });
        openOverlay();
    }, [openOverlay]);

    const handleClose = () => {
        setActiveProject(null);
        closeOverlay();
    };

    useEffect(() => {
        if (!overlayOpen && activeProject) setActiveProject(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlayOpen]);

    return (
        <section
            id="projects"
            style={{
                background: BOARD,
                padding: isMobile ? '72px 0 80px' : '120px 0 132px',
                fontFamily: SIGN,
            }}
        >
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '0 18px' : '0 28px' }}>
                <Reveal>
                    <h2 style={{
                        fontSize: isMobile ? 'clamp(2.2rem, 11vw, 3.2rem)' : 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: 800, fontStretch: '112%',
                        letterSpacing: '-0.03em', lineHeight: 0.9, color: SIGN_WHITE,
                    }}>
                        Projects
                    </h2>
                </Reveal>
                <Reveal delay={0.06} style={{
                    height: 12, background: SIGNAL, width: isMobile ? 120 : 180,
                    margin: isMobile ? '20px 0 40px' : '28px 0 56px',
                }} />
            </div>

            <div style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '0 18px' : '0 28px' }}>
                {projects.map((p, i) => (
                    <PlatformPanel
                        key={p.id}
                        project={p}
                        index={i}
                        visited={visited.has(p.id)}
                        onOpen={handleOpen}
                        isMobile={isMobile}
                    />
                ))}
                <div style={{ borderTop: `1px solid ${RULE_DARK}` }} />
            </div>

            <AnimatePresence>
                {activeProject && (
                    <PlatformSheet
                        key="sheet"
                        project={activeProject}
                        onClose={handleClose}
                        onPrev={() => prevProject && handleOpen(prevProject)}
                        onNext={() => nextProject && handleOpen(nextProject)}
                        prevProject={prevProject}
                        nextProject={nextProject}
                        isMobile={isMobile}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
