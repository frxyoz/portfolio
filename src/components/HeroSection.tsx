'use client';

import { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { SECTIONS } from '@/data/minddo';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useOverlay } from '@/contexts/OverlayContext';
import FlapText from './concourse/FlapText';
import Pictogram, { type PictogramName } from './concourse/Pictogram';
import { RAIL_H } from './NavBar';
import {
    SIGNAL, SIGNAL_INK_SOFT, STEEL, STEEL_SOFT, BOARD, BOARD_LIT,
    BOARD_INK, BOARD_INK_SOFT, SIGN_WHITE, RULE_DARK,
    SIGN, EASE_OUT, TYPE,
} from '@/design/tokens';

/* MindMap pulls in three.js — roughly 550 KB of the home page's JavaScript for
   an overlay behind a click. React.lazy rather than next/dynamic: next/dynamic
   requests its chunk when the module evaluates, so the split saved nothing while
   the overlay still sat in the tree. lazy() only fetches on first real render. */
const MindMapOverlay = lazy(() =>
    import('./MindMap').then(m => ({ default: m.MindMapOverlay })),
);

/* Warm the chunk on intent — hovering the portrait or the mobile button — so the
   overlay opens instantly without the download ever racing first paint. Idle is
   not a good enough signal on its own: on a fast machine it fires ~120ms in,
   while the rest of the page is still arriving. */
let mindMapWarmed = false;
function prefetchMindMap() {
    if (mindMapWarmed) return;
    mindMapWarmed = true;
    void import('./MindMap');
}

/** Board geometry. The hero's panel takes whatever the board leaves, so these
 *  two numbers set the whole first viewport's proportion. */
const ROW_H = 56;
const ROW_H_SM = 46;
const HEAD_H = 30;
/** The board's own frame below the last row, so the bottom row reads as the
 *  end of the board rather than as content cut off by the fold. */
const BOARD_PAD = 14;
/** The white sign panel the portrait stands on, and therefore the column the
 *  signal field gives up on the right. */
const PANEL_W = 'min(38vw, 600px)';
/** The steel edge where the two sign fields meet. */
const SEAM = 3;

/** The disciplines, in the words the profile already uses, each given the
 *  pictogram its category owns across the sign system. */
const DISCIPLINES: { icon: PictogramName; label: string }[] = [
    { icon: 'braces', label: 'Fullstack' },
    { icon: 'stack', label: 'Infrastructure' },
    { icon: 'graph', label: 'Machine Learning' },
];

/** The concourse board's destinations. A board in a terminal tells you where
 *  you can go and what runs on each service — it is not a preview of the
 *  contents of one of those services. Four routes, each with its own platform,
 *  each row a live link. The counts are derived from the project data rather
 *  than written down twice. */

interface Destination {
    id: string;
    label: string;
    service: string;
    /** A shorter service line for the phone, where the service and the stops
     *  share one line under the destination. Falls back to `service`. */
    serviceShort?: string;
    /** What the service is made of, counted from the data rather than written
     *  down a second time — the number on a board has to be the real one. */
    stops: string;
    /** An in-page route, or a real navigation off this page. */
    href: string;
    external: boolean;
}

const DESTINATIONS: Destination[] = [
    {
        id: 'about',
        label: 'Background',
        service: 'Cornell CS · Hack4Impact · SiteFit AI',
        serviceShort: 'Cornell · Hack4Impact · SiteFit',
        stops: `${profile.timeline.length} stops`,
        href: '#about',
        external: false,
    },
    {
        id: 'projects',
        label: 'Projects',
        service: 'Full-stack · Infrastructure · Machine learning',
        serviceShort: 'Full-stack · Infra · ML',
        stops: `${projects.length} gates`,
        href: '#projects',
        external: false,
    },
    {
        id: 'minddo',
        label: 'Case Study',
        service: 'MindDo.AI — queue, workers, autoscaling',
        serviceShort: 'MindDo.AI on AWS · k3s',
        stops: `${SECTIONS.length} sections`,
        href: '/projects/minddo',
        external: true,
    },
    {
        id: 'contact',
        label: 'Contact',
        service: 'Open to internships',
        stops: `${profile.socialLinks.length} channels`,
        href: '#contact',
        external: false,
    },
];

// ─── The departures board ────────────────────────────────────────────────────
function DepartureBoard({ isMobile, armed }: { isMobile: boolean; armed: boolean }) {
    const rowH = isMobile ? ROW_H_SM : ROW_H;
    const reduced = useReducedMotion();

    const cols = isMobile ? '4.6rem 1fr 2.4rem' : '6rem 15rem 1fr 9rem 3.5rem';

    const goTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({ top: el.offsetTop - RAIL_H, behavior: reduced ? 'auto' : 'smooth' });
    };

    return (
        <div style={{ background: BOARD, borderTop: `2px solid ${STEEL_SOFT}`, paddingBottom: BOARD_PAD }}>
            {/* Column heads, painted on the board's frame rather than flapped —
                a real board's headers are silkscreened, only the rows move. */}
            <div
                aria-hidden="true"
                style={{
                    display: 'grid',
                    gridTemplateColumns: cols,
                    alignItems: 'center',
                    height: HEAD_H,
                    padding: isMobile ? '0 14px' : '0 28px',
                    gap: isMobile ? 10 : 20,
                    borderBottom: `1px solid ${RULE_DARK}`,
                    color: SIGNAL,
                    fontSize: TYPE.MICRO, fontWeight: 700, fontStretch: '88%',
                    letterSpacing: isMobile ? '0.12em' : '0.2em', textTransform: 'uppercase',
                }}
            >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>Platform</span>
                <span>Destination</span>
                {!isMobile && <span>Service</span>}
                {!isMobile && <span style={{ textAlign: 'right' }}>Stops</span>}
                <span style={{ textAlign: 'right' }} />
            </div>

            {DESTINATIONS.map((d, i) => {
                const platform = String(i + 1).padStart(2, '0');
                const row = (
                    <>
                        <span style={{
                            color: SIGNAL,
                            fontSize: isMobile ? TYPE.META : TYPE.TITLE,
                            fontWeight: 800, fontStretch: '112%', letterSpacing: '0.01em',
                        }}>
                            {platform}
                        </span>

                        <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                            <FlapText
                                text={d.label}
                                play={armed}
                                startDelay={4 + i * 3}
                                stagger={1}
                                style={{
                                    fontSize: isMobile ? TYPE.META : TYPE.BODY,
                                    fontWeight: 700, fontStretch: '88%',
                                    letterSpacing: '0.04em',
                                }}
                            />
                            {/* On a phone the service line rides under its
                                destination rather than taking a column of its own. */}
                            {isMobile && (
                                <span style={{
                                    color: BOARD_INK_SOFT, fontSize: TYPE.MICRO, fontWeight: 500,
                                    letterSpacing: '0.04em', whiteSpace: 'nowrap',
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                    {d.serviceShort ?? d.service} · {d.stops}
                                </span>
                            )}
                        </span>

                        {!isMobile && (
                            <span style={{
                                color: BOARD_INK_SOFT, fontSize: TYPE.CONTROL, fontWeight: 500,
                                letterSpacing: '0.05em', whiteSpace: 'nowrap',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {d.service}
                            </span>
                        )}

                        {!isMobile && (
                            <span style={{
                                color: SIGNAL, fontSize: TYPE.META, fontWeight: 700,
                                fontStretch: '88%', letterSpacing: '0.08em',
                                textAlign: 'right', whiteSpace: 'nowrap',
                            }}>
                                {d.stops}
                            </span>
                        )}

                        {/* Down for a service on this concourse, out for one that
                            leaves it. A board that pointed the same way at both
                            would be telling you nothing. */}
                        <span className="oz-gate" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                            color: SIGNAL,
                            transition: `transform 0.24s ${EASE_OUT}`,
                        }}>
                            <Pictogram
                                name={d.external ? 'arrow-up-right' : 'arrow-down'}
                                size={isMobile ? 15 : 18}
                            />
                        </span>
                    </>
                );

                const cell: React.CSSProperties = {
                    display: 'grid',
                    gridTemplateColumns: cols,
                    alignItems: 'center',
                    gap: isMobile ? 10 : 20,
                    width: '100%',
                    height: rowH,
                    padding: isMobile ? '0 14px' : '0 28px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i === DESTINATIONS.length - 1 ? 'none' : `1px solid ${RULE_DARK}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: SIGN,
                    color: BOARD_INK,
                    transition: `background 0.18s ${EASE_OUT}`,
                };

                const hover = {
                    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                        e.currentTarget.style.background = BOARD_LIT;
                        const g = e.currentTarget.querySelector<HTMLElement>('.oz-gate');
                        if (g) g.style.transform = d.external ? 'translate(3px, -3px)' : 'translateY(4px)';
                    },
                    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                        e.currentTarget.style.background = 'transparent';
                        const g = e.currentTarget.querySelector<HTMLElement>('.oz-gate');
                        if (g) g.style.transform = 'none';
                    },
                };

                return d.external ? (
                    <Link key={d.id} href={d.href} style={cell} {...hover}
                        aria-label={`${d.label} — ${d.service}`}>
                        {row}
                    </Link>
                ) : (
                    <button key={d.id} type="button" onClick={() => goTo(d.id)} style={cell} {...hover}
                        aria-label={`${d.label} — ${d.service}`}>
                        {row}
                    </button>
                );
            })}
        </div>
    );
}

// ─── The portrait, standing in the signal field ──────────────────────────────
function FieldPortrait({
    scrollYProgress,
    mindMapOpen,
    heroInView,
    hidden,
    boardH,
    onOpen,
    onClose,
    onWarm,
}: {
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
    mindMapOpen: boolean;
    heroInView: boolean;
    /** The project sheet is a full-screen layer of its own; the portrait is
     *  fixed and would otherwise stand in front of it. */
    hidden: boolean;
    boardH: number;
    onOpen: () => void;
    onClose: () => void;
    /** Signals intent to open, so the overlay chunk can mount and download early. */
    onWarm: () => void;
}) {
    const [hov, setHov] = useState(false);
    /* The portrait recedes on scroll the same way the panel does, so it drops
       the same things when motion is reduced: the blur and the scale, both of
       which read as the viewport moving underneath you. The fade stays — it is
       what tells you the hero is handing over. */
    const reduced = useReducedMotion();

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scrollBlur = useTransform(scrollYProgress, [0, 0.3], [0, 12]);
    const scaleRaw = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
    const blurRaw = useTransform(scrollBlur, (bl: number) => `blur(${bl}px)`);

    /* The portrait stands down while the map is open. It used to be held lit
       over the overlay, back when the overlay was a card deck the portrait
       could plausibly sit at the centre of; a network map has no such centre,
       and a face over the middle of a diagram is just something in the way.
       The map carries its own Exit gate, and Escape still closes it. */
    const visible = heroInView && !hidden && !mindMapOpen;

    return (
        <div style={{
            position: 'fixed', top: 0, bottom: 0, right: 0, zIndex: 300,
            width: PANEL_W,
            pointerEvents: 'none',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: boardH,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.35s ease',
        }}>
            <motion.div style={{
                display: 'inline-block',
                opacity,
                scale: reduced ? 1 : scaleRaw,
                filter: reduced ? 'none' : blurRaw,
                transformOrigin: 'bottom center',
            }}>
                <motion.button
                    type="button"
                    aria-expanded={mindMapOpen}
                    aria-label={mindMapOpen ? 'Close the mind map and return to the page' : 'Open the mind map about Olric'}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        cursor: 'pointer', background: 'none', border: 'none', padding: 0,
                        pointerEvents: visible ? 'all' : 'none',
                        y: hov && !reduced ? -6 : 0,
                    }}
                    transition={{ y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                    onMouseEnter={() => { setHov(true); onWarm(); }}
                    onMouseLeave={() => setHov(false)}
                    onFocus={() => { setHov(true); onWarm(); }}
                    onBlur={() => setHov(false)}
                    onClick={() => mindMapOpen ? onClose() : onOpen()}
                >
                    {/* The cutout carries a pale matte edge from the studio white it
                        was lifted off, which is invisible on a light ground and a
                        halo on a saturated one — so the portrait stands on the sign
                        panel's own white rather than in the signal field. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/subject.webp"
                        alt=""
                        width={863}
                        height={1400}
                        fetchPriority="high"
                        decoding="async"
                        style={{
                            height: 'min(58vh, 590px)',
                            width: 'auto', display: 'block', userSelect: 'none',
                            margin: '0 auto',
                        }}
                        draggable={false}
                    />

                    {/* The instruction plate. A sign never asks you to guess what a
                        thing does; it says so on a plate bolted beneath it. */}
                    {!mindMapOpen && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 9,
                            marginTop: 18,
                            background: hov ? STEEL : SIGNAL,
                            color: hov ? SIGNAL : STEEL,
                            padding: '9px 16px',
                            fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            transition: `background 0.22s ${EASE_OUT}, color 0.22s ${EASE_OUT}`,
                        }}>
                            Mind Map
                            <Pictogram name="arrow-right" size={12} />
                        </span>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const [mindMapOpen, setMindMapOpen] = useState(false);
    const [mindMapArmed, setMindMapArmed] = useState(false);
    const warmMindMap = useCallback(() => { setMindMapArmed(true); prefetchMindMap(); }, []);
    const [heroInView, setHeroInView] = useState(true);
    const [entered, setEntered] = useState(false);
    const isMobile = useIsMobile();
    const reduced = useReducedMotion();
    const { overlayOpen } = useOverlay();

    const boardH = (isMobile ? ROW_H_SM : ROW_H) * DESTINATIONS.length + HEAD_H + BOARD_PAD;

    useEffect(() => {
        const t = setTimeout(() => setEntered(true), 90);
        return () => clearTimeout(t);
    }, []);

    /* Fallback warm, well after the page has settled, for anyone who reaches the
       overlay by keyboard or touch without a hover to announce it first. */
    useEffect(() => {
        const t = setTimeout(warmMindMap, 4000);
        return () => clearTimeout(t);
    }, [warmMindMap]);

    // Fade the portrait out when the hero scrolls past its wrapper.
    useEffect(() => {
        if (!heroRef.current) return;
        const obs = new IntersectionObserver(
            ([e]) => setHeroInView(e.isIntersecting),
            { threshold: 0.01 }
        );
        obs.observe(heroRef.current);
        return () => obs.disconnect();
    }, []);

    // Scroll progress over the full wrapper, which is the signature's budget.
    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ['start start', 'end end'],
    });

    /* The field drains. Signal yellow gives way to board black across the first
       third of the scroll, and what is left is an emptied departures board with
       the signature written across it. That hand-off is the one authored moment
       on this page; everything else is a state change. */
    const fieldRaw = useTransform(scrollYProgress, [0, 0.3], [SIGNAL, BOARD]);
    const field = reduced ? BOARD : fieldRaw;

    /* Reduced motion keeps the hand-off but drops the travel. The fade stays —
       it is the state change that tells you the hero is giving way. The scale
       and the blur go, because those read as the viewport moving underneath. */
    const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
    const contentScaleRaw = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);
    const blurRaw = useTransform(useTransform(scrollYProgress, [0, 0.3], [0, 12]),
        (v: number) => `blur(${v}px)`);

    /* Each signature sub-path draws independently; opacity snaps to kill dot
       artifacts. The trace is a fixed part of this site, so reduced motion does
       not remove it — it delivers the finished stroke instead of animating the
       pen, which keeps the moment without the scroll linkage. */
    const draw1Raw = useTransform(scrollYProgress, [0.05, 0.72], [0, 1]);
    const draw2Raw = useTransform(scrollYProgress, [0.10, 0.74], [0, 1]);
    const draw3Raw = useTransform(scrollYProgress, [0.07, 0.70], [0, 1]);
    const draw4Raw = useTransform(scrollYProgress, [0.40, 0.73], [0, 1]);
    const op1Raw = useTransform(scrollYProgress, [0.02, 0.04], [0, 1]);
    const op2Raw = useTransform(scrollYProgress, [0.09, 0.10], [0, 1]);
    const op3Raw = useTransform(scrollYProgress, [0.06, 0.07], [0, 1]);
    const op4Raw = useTransform(scrollYProgress, [0.399, 0.401], [0, 1]);

    const draw = reduced ? [1, 1, 1, 1] : [draw1Raw, draw2Raw, draw3Raw, draw4Raw];
    const ops = reduced ? [1, 1, 1, 1] : [op1Raw, op2Raw, op3Raw, op4Raw];

    const lede = profile.lede;

    return (
        <>
            <div ref={wrapperRef} style={{ height: isMobile ? '190vh' : '285vh' }}>
                <motion.section
                    ref={heroRef}
                    id="hero"
                    data-surface="signal"
                    style={{
                        height: '100vh',
                        background: field,
                        position: 'sticky', top: 0,
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateRows: '1fr auto',
                        paddingTop: RAIL_H,
                        fontFamily: SIGN,
                    }}
                >
                    {/* ── The signal panel ── */}
                    <div style={{ position: 'relative', minHeight: 0, display: 'grid' }}>
                        {/* The right-hand sign panel. Two fields divided by a steel
                            seam is the composition every terminal sign uses: the
                            coloured field carries the direction, the white one
                            carries the thing itself. */}
                        {!isMobile && (
                            <motion.div
                                aria-hidden="true"
                                style={{
                                    position: 'absolute', top: 0, right: 0, bottom: 0,
                                    width: PANEL_W,
                                    background: SIGN_WHITE,
                                    opacity: contentOpacity,
                                    zIndex: 0,
                                }}
                            >
                                {/* The seam. Two fields meeting on a steel edge is
                                    how a sign is physically assembled, so it is a
                                    member of the structure rather than a border
                                    drawn on the panel. */}
                                <span style={{
                                    position: 'absolute', top: 0, bottom: 0, left: 0,
                                    width: SEAM, background: STEEL,
                                }} />
                            </motion.div>
                        )}

                        <motion.div style={{
                            position: 'relative', zIndex: 1,
                            minHeight: 0,
                            display: 'flex', flexDirection: 'column',
                            justifyContent: isMobile ? 'flex-end' : 'center',
                            padding: isMobile
                                ? '24px 20px 22px'
                                : 'clamp(20px, 4vh, 56px) clamp(24px, 4vw, 64px)',
                            opacity: contentOpacity,
                            scale: reduced ? 1 : contentScaleRaw,
                            filter: reduced ? 'none' : blurRaw,
                        }}>
                            <div style={{
                                maxWidth: isMobile ? '100%' : 'min(57vw, 820px)',
                                opacity: entered ? 1 : 0,
                                transform: entered ? 'none' : 'translateY(18px)',
                                transition: `opacity 0.7s ${EASE_OUT} 0.05s, transform 0.7s ${EASE_OUT} 0.05s`,
                            }}>
                                {/* The panel's lettering is painted, not hung — so it flaps
                                bare, with no cell chrome, and lands before the board. */}
                                <h1 style={{
                                    fontSize: isMobile ? 'clamp(2.7rem, 13vw, 4rem)' : 'clamp(3.4rem, 8.6vw, 9.6rem)',
                                    fontWeight: 800, fontStretch: '112%',
                                    letterSpacing: '-0.035em', lineHeight: 0.84,
                                    color: STEEL, margin: 0,
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                }}>
                                    <FlapText text="Olric" variant="bare" play={entered} startDelay={0} stagger={2} />
                                    <FlapText text="Zeng" variant="bare" play={entered} startDelay={5} stagger={2} />
                                </h1>

                                <div style={{
                                    height: 4, background: STEEL, width: '100%',
                                    margin: isMobile ? '18px 0 16px' : '26px 0 20px',
                                    transformOrigin: 'left center',
                                    transform: entered ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: `transform 0.9s ${EASE_OUT} 0.22s`,
                                }} />

                                {/* Where he is, in the register a sign uses. */}
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                                    gap: isMobile ? '8px 14px' : '10px 22px',
                                    marginBottom: isMobile ? 14 : 18,
                                    fontSize: isMobile ? TYPE.LABEL : TYPE.META, fontWeight: 700,
                                    fontStretch: '88%', letterSpacing: '0.16em',
                                    textTransform: 'uppercase', color: STEEL,
                                }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        <Pictogram name="cap" size={15} /> B.S. Computer Science · Cornell
                                    </span>
                                </div>

                                <p style={{
                                    fontSize: isMobile ? TYPE.COPY : TYPE.BODY,
                                    fontWeight: 500, lineHeight: 1.55, color: STEEL,
                                    maxWidth: '46ch', marginBottom: isMobile ? 18 : 24,
                                }}>
                                    {lede}
                                </p>

                                {/* Discipline plates, reversed out of the field in steel. */}
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', gap: 6,
                                    marginBottom: isMobile ? 20 : 26,
                                }}>
                                    {DISCIPLINES.map(d => (
                                        <span key={d.label} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 8,
                                            background: STEEL, color: SIGNAL,
                                            padding: '7px 13px',
                                            fontSize: TYPE.MICRO, fontWeight: 700, fontStretch: '88%',
                                            letterSpacing: '0.16em', textTransform: 'uppercase',
                                        }}>
                                            <Pictogram name={d.icon} size={13} />
                                            {d.label}
                                        </span>
                                    ))}
                                </div>

                                {/* The gate row. */}
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                                    gap: isMobile ? 10 : 14,
                                }}>
                                    <a
                                        href={profile.resumeUrl}
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
                                        <Pictogram name="doc" size={15} />
                                        Resume
                                    </a>

                                    {profile.socialLinks.map(s => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target={s.href.startsWith('mailto') ? undefined : '_blank'}
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                                minHeight: 48, padding: '0 4px',
                                                color: STEEL,
                                                fontSize: TYPE.LABEL, fontWeight: 700, fontStretch: '88%',
                                                letterSpacing: '0.16em', textTransform: 'uppercase',
                                                boxShadow: `inset 0 -2px 0 0 ${SIGNAL_INK_SOFT}`,
                                                transition: `box-shadow 0.2s ${EASE_OUT}`,
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.boxShadow = `inset 0 -2px 0 0 ${STEEL}`; }}
                                            onMouseLeave={e => { e.currentTarget.style.boxShadow = `inset 0 -2px 0 0 ${SIGNAL_INK_SOFT}`; }}
                                        >
                                            {s.label}
                                        </a>
                                    ))}
                                </div>

                                {/* On a phone there is no portrait to click, so the mind map
                                gets its own plate in the panel. */}
                                {isMobile && (
                                    <button
                                        onPointerDown={warmMindMap}
                                        onClick={() => setMindMapOpen(true)}
                                        style={{
                                            marginTop: 16,
                                            display: 'inline-flex', alignItems: 'center', gap: 10,
                                            background: 'none', color: STEEL,
                                            border: `2px solid ${STEEL}`,
                                            padding: '0 18px', minHeight: 46, cursor: 'pointer',
                                            fontFamily: SIGN,
                                            fontSize: TYPE.LABEL, fontWeight: 700, fontStretch: '88%',
                                            letterSpacing: '0.18em', textTransform: 'uppercase',
                                        }}
                                    >
                                        Mind Map
                                        <Pictogram name="arrow-right" size={13} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── The board ── */}
                    <motion.div style={{
                        position: 'relative', zIndex: 1,
                        opacity: contentOpacity,
                    }}>
                        <DepartureBoard isMobile={isMobile} armed={entered} />
                    </motion.div>

                    {/* ── The signature, written across the emptied board ── */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none', zIndex: 2,
                    }}>
                        <svg
                            viewBox="0 0 841.995 595.35"
                            style={{
                                width: 'min(78vw, 760px)', height: 'auto',
                                filter: 'drop-shadow(0 0 22px rgba(255, 209, 0, 0.3))',
                            }}
                            aria-hidden="true"
                        >
                            {[SIG_1, SIG_2, SIG_3, SIG_4].map((d, i) => (
                                <motion.path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke={SIGNAL}
                                    strokeWidth={5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ pathLength: draw[i], opacity: ops[i] }}
                                />
                            ))}
                        </svg>
                    </div>
                </motion.section>
            </div>

            {/* Mounted on intent, not on page load: `dynamic()` fetches its chunk
                the moment the component mounts, so an always-rendered overlay
                would pull three.js into first paint no matter what `open` says. */}
            {(mindMapArmed || mindMapOpen) && (
                <Suspense fallback={null}>
                    <MindMapOverlay open={mindMapOpen} onClose={() => setMindMapOpen(false)} />
                </Suspense>
            )}

            {!isMobile && (
                <FieldPortrait
                    scrollYProgress={scrollYProgress}
                    mindMapOpen={mindMapOpen}
                    heroInView={heroInView}
                    hidden={overlayOpen}
                    boardH={boardH}
                    onOpen={() => setMindMapOpen(true)}
                    onClose={() => setMindMapOpen(false)}
                    onWarm={warmMindMap}
                />
            )}
        </>
    );
}

/* The signature, split into its four strokes so each can draw on its own
   schedule. Kept verbatim — it is the one element of this site that is fixed. */
const _sigParts = 'M275.541 80.4165C274.574 80.4106 273.588 80.4529 272.563 80.5175C270.654 80.6379 268.731 80.8384 266.836 81.0978C253.203 82.9637 240.331 88.3241 228.406 95.0263C213.253 103.543 199.533 114.275 185.359 124.271C177.116 130.084 168.855 135.857 160.783 141.909C141.067 156.688 121.926 172.278 103.454 188.589C104.12 187.603 104.748 186.592 105.422 185.612C112.895 174.736 120.826 163.89 130.428 154.777C134.391 151.015 139.398 146.494 144.962 145.315C147.476 145.675 149.984 142.85 150.538 138.982C151.092 135.113 149.495 131.671 146.98 131.311C137.372 133.414 129.023 139.087 121.773 145.542C111.346 154.825 102.671 166.011 94.6225 177.361C88.3414 186.218 82.4893 195.378 76.5812 204.486C72.1084 211.381 67.7883 218.393 63.5611 225.479C60.233 228.588 56.9485 231.734 53.9475 235.169C52.0378 237.354 50.2155 239.62 48.5981 242.032C47.0221 244.382 45.9617 246.84 46.7309 249.677C47.0418 250.824 47.6305 251.858 48.371 252.781C36.7163 275.476 27.0602 299.122 21.0188 323.962C19.0578 332.025 17.4755 340.194 16.3255 348.413C14.6974 360.049 14.1213 371.724 16.5022 383.31C18.147 391.313 21.3985 400.69 29.3204 404.48C33.4682 406.464 38.0089 406.308 42.4666 405.741C46.9934 405.166 51.4331 404.036 55.7138 402.461C75.1411 395.314 90.0813 379.934 103.252 364.511C107.58 359.443 111.771 354.254 116.02 349.119C128.288 334.294 140.251 319.272 151.699 303.801C172.576 275.588 192.098 246.39 211.652 217.253C218.084 207.669 224.528 198.085 230.98 188.513C247.375 180.224 263.777 171.968 280.411 164.164C294.744 157.439 309.245 151.197 324.013 145.492C327.145 144.282 330.143 142.777 333.248 141.505C335.676 140.51 337.988 139.812 340.515 140.067C340.459 140.377 340.4 140.679 340.288 140.975C339.603 142.781 338.513 144.362 337.26 145.82C333.961 149.657 330.17 153.035 326.309 156.291C322.375 159.609 318.357 162.824 314.5 166.233C307.259 172.634 300.224 179.304 293.103 185.839C277.401 200.246 262.181 215.115 247.23 230.299C227.632 250.201 208.77 270.594 191.39 292.472C187.983 296.761 184.785 301.278 181.196 305.416C177.438 309.75 173.244 313.788 170.422 318.84C168.882 321.596 167.844 324.567 167.57 327.722C167.479 328.779 167.654 329.902 168.201 330.826C169.261 332.615 171.167 333.515 173.121 333.98C176.38 334.755 179.93 334.551 183.214 334.081C187.449 333.474 191.637 332.348 195.73 331.128C204.949 328.38 213.807 324.562 222.527 320.531C264.958 300.913 304.252 275.488 344.426 251.772C349.322 248.882 354.211 246.005 359.137 243.167C361.538 241.784 364.025 240.483 366.353 238.979C368.348 237.69 370.173 236.152 371.955 234.588C374.175 232.64 376.317 230.524 378.768 228.86C379.824 228.143 380.734 227.496 381.972 228.002C383.663 228.694 383.239 229.539 382.426 230.879C381.894 231.758 381.254 232.579 380.61 233.377C378.333 236.2 375.707 238.732 373.519 241.628C372.498 242.98 371.588 244.414 370.643 245.817C359.977 261.651 346.635 275.566 337.159 292.22C335.015 295.988 332.4 300.296 332.012 304.735C331.829 306.827 332.464 308.95 334.636 309.706C335.921 310.153 337.406 310.199 338.749 310.286C340.885 310.425 343.053 310.376 345.183 310.16C354.933 309.171 363.987 304.717 372.132 299.487C380.898 293.858 388.899 287.194 397.49 281.319C403.667 277.096 410.116 273.261 416.39 269.182C427.478 261.974 438.493 254.642 449.773 247.734C462.46 239.964 475.505 232.792 488.732 225.984C490.912 224.862 493.133 223.807 495.242 222.552C497.291 221.333 499.239 219.949 501.197 218.591C502.241 217.866 503.296 217.144 504.376 216.471C504.326 216.735 504.299 216.995 504.225 217.253C503.789 218.769 502.934 220.119 501.954 221.341C499.147 224.84 495.467 227.567 492.239 230.652C489.753 233.029 487.547 235.685 485.199 238.196C482.383 241.209 479.484 244.161 476.57 247.078C465.949 257.712 454.954 268.024 445.66 279.881C443.266 282.934 441.027 286.059 438.847 289.267C437.341 291.483 435.862 293.732 434.759 296.181C433.85 298.199 433.109 300.868 434.33 302.918C435.92 305.589 440.441 306.129 443.237 305.997C447.56 305.792 451.654 304.173 455.626 302.59C458.457 301.462 461.334 300.413 464.155 299.26C466.608 298.257 469.03 297.216 471.447 296.131C481.484 291.627 491.234 286.513 501.146 281.748C524.49 270.527 547.911 259.45 571.621 249.021C586.746 242.368 602.116 236.342 617.57 230.501C622.735 228.548 627.925 226.591 633.214 225C634.749 224.538 636.284 224.103 637.857 223.789C638.299 223.7 638.746 223.614 639.194 223.562C639.16 223.94 639.157 224.315 639.068 224.697C638.56 226.879 637.512 228.919 636.368 230.829C633.111 236.267 628.776 241.089 624.534 245.766C617.196 253.858 609.494 261.606 602.481 269.99C597.714 275.688 593.156 281.687 589.738 288.309C585.075 297.344 582.849 307.624 588.224 316.897C592.367 324.045 599.336 328.998 606.669 332.743C597.663 334.158 588.651 335.621 579.67 337.21C515.776 348.513 452.37 364.748 392.999 391.334C371.34 401.032 350.467 412.403 330.624 425.423C320.294 432.201 309.921 439.202 300.673 447.426C289.962 456.95 278.065 469.952 280.613 485.477C281.435 490.486 284.11 494.497 287.678 498.017C292.989 503.258 299.8 506.895 306.88 509.12C316.06 512.005 326.016 512.356 335.569 511.996C352.319 511.365 369.193 507.969 385.53 504.376C424.624 495.779 462.238 481.879 499.531 467.562C521.023 459.31 542.551 451.121 563.9 442.505C577.393 437.06 590.769 431.347 604.146 425.625C625.322 416.566 647.147 408.596 666.42 395.724C671.617 392.254 676.582 388.449 681.207 384.243C683.991 381.712 686.737 379.057 688.877 375.942C689.981 374.336 690.935 372.622 691.552 370.769C691.966 369.525 692.218 368.221 692.259 366.908C692.506 358.939 684.582 353.843 678.532 350.406C677.51 349.825 676.314 349.169 675.277 348.615C673.748 347.798 672.215 346.982 670.659 346.218C664.5 343.191 657.871 341.141 651.306 339.203C646.71 337.846 642.04 336.505 637.377 335.166C697.28 326.92 757.571 321.368 817.615 314.323C818.912 314.697 820.42 313.393 820.996 311.396C821.571 309.4 820.981 307.481 819.684 307.107C754.011 314.812 688.054 320.73 622.616 330.346C618.446 328.749 614.334 327.014 610.454 324.795C602.133 320.036 593.702 312.427 593.851 302.086C593.976 293.407 599.178 285.366 604.171 278.644C614.035 265.369 626.453 254.271 636.974 241.552C641.201 236.442 645.6 230.776 647.445 224.293C647.99 222.38 648.872 219.302 647.395 217.607C646.43 216.499 644.823 216.225 643.433 216.194C640.599 216.13 637.71 216.928 635.006 217.682C634.421 217.846 633.846 218.012 633.265 218.187C627.007 220.069 620.874 222.402 614.769 224.722C609.08 226.885 603.392 229.032 597.737 231.283C573.457 240.947 549.67 251.78 526.051 262.95C512.413 269.4 498.801 275.898 485.275 282.581C479.045 285.659 472.81 288.714 466.426 291.463C463.047 292.918 459.606 294.208 456.182 295.55C452.685 296.921 447.46 299.653 443.565 298.427C443.222 298.319 442.839 298.185 442.531 297.998C442.302 297.859 442.833 296.4 442.909 296.232C443.048 295.925 443.185 295.623 443.338 295.323C443.83 294.358 444.412 293.454 445.004 292.548C448.731 286.842 452.822 281.368 457.292 276.222C465.197 267.121 473.964 258.829 482.474 250.308C485.49 247.289 488.467 244.241 491.381 241.123C493.327 239.041 495.174 236.835 497.185 234.815C499.389 232.601 501.818 230.64 504.098 228.507C505.079 227.591 506.035 226.638 506.95 225.656C507.897 224.639 508.808 223.577 509.624 222.451C511.662 219.644 513.167 216.396 513.334 212.888C513.389 211.731 513.332 210.493 512.602 209.532C510.188 206.358 504.696 209.046 502.13 210.541C498.598 212.601 495.455 215.271 491.911 217.304C489.573 218.645 487.086 219.77 484.695 221.013C479.575 223.673 474.491 226.395 469.429 229.163C460.163 234.229 451.034 239.541 442.077 245.135C433.309 250.612 424.696 256.347 416.036 261.991C406.836 267.987 397.368 273.598 388.482 280.058C380.755 285.675 373.306 291.743 365.016 296.534C359.602 299.664 353.711 302.281 347.429 302.918C345.188 303.146 343.006 302.995 340.793 302.767C340.795 302.686 340.811 302.615 340.818 302.54C340.859 302.113 340.959 301.664 341.07 301.253C341.633 299.172 342.698 297.254 343.72 295.374C346.24 290.735 349.105 286.31 352.147 282C358.058 273.628 364.672 265.788 370.895 257.651C372.885 255.048 374.839 252.408 376.724 249.728C378.125 247.736 379.411 245.66 380.887 243.722C382.472 241.642 384.343 239.762 386.06 237.793C386.919 236.807 387.752 235.82 388.558 234.79C391.12 231.516 394.726 225.769 390.703 222.174C390.2 221.725 389.637 221.343 389.037 221.038C384.788 218.878 379.871 220.387 376.017 222.678C371.252 225.512 367.631 229.778 363.149 232.973C360.921 234.562 358.381 235.782 356.008 237.137C351.518 239.699 347.046 242.298 342.584 244.908C302.816 268.17 263.933 293.214 222.022 312.557C211.817 317.267 201.386 321.77 190.406 324.341C187.531 325.014 184.619 325.651 181.65 325.577C180.626 325.552 179.264 325.536 178.37 324.946C178.354 324.936 178.365 324.919 178.345 324.896C178.505 323.614 178.752 322.38 179.278 321.187C180.654 318.068 183.047 315.484 185.309 312.986C187.183 310.917 189.096 308.895 190.86 306.728C193.94 302.947 196.891 299.052 199.944 295.248C204.351 289.756 208.825 284.332 213.393 278.973C229.826 259.691 247.711 241.656 265.7 223.839C278.815 210.849 292.267 198.256 305.946 185.864C311.919 180.453 317.782 174.868 323.937 169.665C329.922 164.604 336.171 159.842 341.777 154.348C344.909 151.279 347.958 148.044 350.204 144.255C352.11 141.04 354.568 135.579 352.046 132.118C350.566 130.088 347.585 129.694 345.284 129.545C340.572 129.238 335.954 130.63 331.633 132.371C328.901 133.471 326.274 134.798 323.533 135.878C319.148 137.605 314.71 139.215 310.337 140.975C300.027 145.125 289.84 149.581 279.755 154.247C266.984 160.156 254.341 166.324 241.729 172.566C242.431 171.512 243.148 170.467 243.849 169.412C247.039 164.608 250.27 159.84 253.412 155.004C258.567 147.068 263.552 139.021 268.627 131.033C273.21 123.821 278.079 116.782 281.874 109.106C283.484 105.85 284.907 102.502 286.012 99.0383C286.404 97.8104 286.788 96.5861 286.946 95.3038C287.451 91.201 286.193 86.4482 283.338 83.394C281.077 80.9754 278.441 80.4343 275.541 80.4165ZM269.51 93.4618C269.557 93.4938 269.561 93.5106 269.586 93.5375C269.807 93.7794 269.976 94.0629 270.141 94.345C270.585 95.1029 270.888 95.9367 271.075 96.7926C271.576 99.0905 270.676 101.017 269.838 103.176C266.057 112.927 259.663 121.42 254.118 130.201C249.395 137.679 244.677 145.178 239.837 152.582C232.916 163.168 225.76 173.59 218.641 184.047C191.53 197.542 164.348 210.879 136.282 222.325C117.989 229.785 99.6911 238.241 80.2147 242.133C76.6142 242.852 72.9711 243.338 69.3142 243.672C73.1054 236.77 77.0529 229.956 81.1483 223.234C94.5231 210.763 107.894 198.295 121.874 186.495C138.553 172.416 155.733 158.851 173.374 145.996C180.201 141.021 187.19 136.26 194.09 131.387C204.019 124.373 213.74 117.065 223.99 110.519C232.188 105.285 240.771 100.489 249.98 97.272C254.354 95.7444 258.859 94.581 263.454 93.9665C265.187 93.7349 266.957 93.564 268.703 93.4871C268.972 93.4752 269.24 93.4593 269.51 93.4618ZM207.715 200.221C185 233.825 162.6 267.702 138.401 300.269C130.915 310.344 123.274 320.277 115.389 330.043C108.969 337.995 102.385 345.822 95.8589 353.686C89.3579 361.52 82.707 369.328 75.1934 376.219C70.435 380.584 65.2742 384.617 59.5239 387.599C55.3785 389.749 50.9208 391.282 46.2767 391.864C44.9599 392.028 43.4776 392.326 42.1638 391.939C40.0287 391.311 38.44 389.36 37.3191 387.549C35.016 383.827 33.8386 379.401 33.0548 375.134C31.1919 364.993 31.7933 354.873 33.2314 344.729C34.3392 336.914 35.87 329.155 37.7481 321.49C43.4011 298.416 52.353 276.488 63.1069 255.405C64.5059 255.305 65.9015 255.281 67.2956 255.128C86.275 253.038 104.319 246.176 121.874 239.004C141.237 231.093 160.503 223.072 179.404 214.099C188.899 209.592 198.317 204.923 207.715 200.221ZM618.529 337.84C626.931 340.898 635.613 343.216 644.19 345.713C651.014 347.699 657.928 349.734 664.326 352.879C665.829 353.618 667.315 354.411 668.792 355.2C670.361 356.038 671.933 356.887 673.46 357.799C678.452 360.783 685.893 365.761 682.645 372.586C681.964 374.017 680.993 375.292 679.945 376.472C677.45 379.281 674.5 381.774 671.593 384.142C665.806 388.856 659.545 392.946 653.047 396.607C634.375 407.128 614 414.431 594.381 422.925C563.352 436.358 531.746 448.381 500.187 460.496C463.999 474.39 427.541 488.019 389.668 496.63C381.936 498.387 374.158 499.95 366.353 501.348C357.918 502.859 349.406 504.098 340.843 504.578C331.89 505.08 322.429 505.022 313.743 502.559C306.483 500.501 299.447 496.795 294.264 491.23C291.764 488.546 289.943 485.651 289.343 481.995C288.6 477.467 289.428 472.599 291.387 468.47C292.427 466.278 293.896 464.301 295.374 462.389C298.318 458.578 301.674 455.099 305.24 451.867C306.95 450.317 308.717 448.825 310.513 447.375C318.863 440.638 327.854 434.623 336.856 428.804C357.158 415.681 378.57 404.423 400.745 394.816C460.186 369.064 523.508 353.58 587.215 342.786C597.636 341.02 608.077 339.389 618.529 337.84Z'.split('ZM');
const SIG_1 = _sigParts[0] + 'Z';
const SIG_2 = 'M' + _sigParts[1] + 'Z';
const SIG_3 = 'M' + _sigParts[2] + 'Z';
const SIG_4 = 'M' + _sigParts[3];
