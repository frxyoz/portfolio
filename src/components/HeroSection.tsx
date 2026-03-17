'use client';

import { motion, type Variants } from 'framer-motion';
import { profile } from '@/data/profile';
import GlitchText from './GlitchText';

const NAV_LINKS = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
];

/* ─── Variants ─────────────────────────────────────────────────────── */
const deviceVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const rightPanelVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const btnBarVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } },
};

const btnVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const scrollHintVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { delay: 1.2, duration: 0.5 } },
};

export default function HeroSection() {
    return (
        <section
            id="hero"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ───── VIDEO BACKGROUND ───── */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            >
                <source src="/videos/animatedbg.mp4" type="video/mp4" />
            </video>

            {/* ───── DEVICE SHELL ───── */}
            <motion.div
                className="pokedex-body"
                style={{ width: '100%', maxWidth: '920px', position: 'relative', zIndex: 1 }}
                variants={deviceVariants}
                initial="hidden"
                animate="show"
            >
                {/* ── TOP BAR ── */}
                <div
                    style={{
                        padding: '14px 22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '3px solid #880000',
                        background: 'rgba(0,0,0,0.2)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="indicator-eye" />
                        <div style={{ display: 'flex', gap: '5px', marginLeft: '6px' }}>
                            <div
                                className="indicator-dot"
                                style={{
                                    background: '#ff4444',
                                    animation: 'indicator-pulse 2s ease-in-out infinite',
                                    boxShadow: '0 0 6px #ff4444',
                                }}
                            />
                            <div className="indicator-dot" style={{ background: '#ffcc00', boxShadow: '0 0 6px #ffcc00' }} />
                            <div className="indicator-dot" style={{ background: '#44ff88', boxShadow: '0 0 6px #44ff88' }} />
                        </div>
                    </div>

                    {/* Glitch brand */}
                    <GlitchText
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.75rem',
                            color: '#ffcb05',
                            letterSpacing: '0.15em',
                            textShadow: '0 0 12px rgba(255,203,5,0.5)',
                        }}
                    >
                        ABOUT ME
                    </GlitchText>

                    <div
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.4rem',
                            color: 'rgba(255,100,100,0.5)',
                        }}
                    >
                        v1.0
                    </div>
                </div>

                {/* ── MAIN BODY: Left + Hinge + Right ── */}
                <div style={{ display: 'flex', minHeight: '380px' }}>

                    {/* ── LEFT PANEL ── */}
                    <div
                        style={{
                            flex: '0 0 340px',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {/* MAIN SCREEN */}
                        <div className="screen-bezel" style={{ flex: 1 }}>
                            <div
                                className="screen-lcd"
                                style={{ height: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {profile.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 0 }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 3 }}>
                                        <div
                                            style={{
                                                width: '80px', height: '80px',
                                                margin: '0 auto 12px',
                                                background: 'linear-gradient(135deg, #1a3a28 0%, #0d2018 100%)',
                                                borderRadius: '8px',
                                                border: '2px solid #267544',
                                                boxShadow: '0 0 20px rgba(77,255,136,0.2), inset 0 0 20px rgba(0,0,0,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >
                                            <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.3rem', color: '#267544', lineHeight: 2, textAlign: 'center' }}>
                                                NO<br />IMG
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.35rem', color: '#267544', letterSpacing: '0.1em' }}>
                                            PHOTO
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TAGLINE SCREEN */}
                        <div className="screen-bezel" style={{ padding: '8px' }}>
                            <div className="screen-lcd" style={{ padding: '10px 12px' }}>
                                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.4rem', color: '#4dff88', lineHeight: 2.2, margin: 0, position: 'relative', zIndex: 3 }}>
                                    {profile.tagline}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── HINGE ── */}
                    <div className="pokedex-hinge" />

                    {/* ── RIGHT PANEL (DATA SCREEN) ── */}
                    <div style={{ flex: 1, padding: '18px', display: 'flex', flexDirection: 'column' }}>
                        <div className="screen-bezel" style={{ flex: 1 }}>
                            <motion.div
                                className="screen-lcd"
                                style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                                variants={rightPanelVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {/* Name */}
                                <motion.h1
                                    variants={itemVariants}
                                    style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: 'clamp(0.75rem, 2.2vw, 1.1rem)',
                                        color: '#e8e8e8',
                                        margin: 0, lineHeight: 1.5, position: 'relative', zIndex: 3,
                                    }}
                                >
                                    {profile.name}
                                </motion.h1>

                                {/* Title */}
                                <motion.p
                                    variants={itemVariants}
                                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.5rem', color: '#4dff88', margin: 0, position: 'relative', zIndex: 3 }}
                                >
                                    {profile.title}
                                </motion.p>

                                {/* Divider */}
                                <motion.div variants={itemVariants} style={{ height: '1px', background: '#1a3a28' }} />

                                {/* Social links */}
                                <motion.div
                                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative', zIndex: 3, flex: 1, justifyContent: 'center' }}
                                >
                                    {profile.socialLinks.map(link => (
                                        <motion.a
                                            key={link.label}
                                            href={link.href}
                                            target={link.icon === 'email' ? undefined : '_blank'}
                                            rel="noopener noreferrer"
                                            variants={itemVariants}
                                            whileHover={{ x: 6, color: '#ffffff' }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                color: '#4dff88', fontSize: '0.82rem', textDecoration: 'none',
                                                padding: '8px 0', borderBottom: '1px solid #1a3a28',
                                                fontFamily: "'Press Start 2P', cursive", letterSpacing: '0.05em',
                                            }}
                                        >
                                            <span style={{ color: '#267544', fontSize: '0.5rem' }}>▶</span>
                                            <span style={{ fontSize: '0.45rem' }}>{link.label.toUpperCase()}</span>
                                        </motion.a>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BUTTON BAR ── */}
                <div
                    style={{
                        padding: '12px 22px',
                        borderTop: '3px solid #880000',
                        background: 'rgba(0,0,0,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                    }}
                >
                    <motion.div
                        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                        variants={btnBarVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {NAV_LINKS.map(link => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                className="poke-btn"
                                variants={btnVariants}
                                whileHover={{ scale: 1.07, y: -2 }}
                                whileTap={{ scale: 0.93 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="poke-btn poke-btn-yellow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85, duration: 0.35, ease: 'easeOut' }}
                        whileHover={{ scale: 1.07, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                    >
                        RESUME ▶
                    </motion.a>
                </div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
                variants={scrollHintVariants}
                initial="hidden"
                animate="show"
                style={{
                    marginTop: '1.5rem',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.4rem',
                    color: '#550000',
                    animation: 'blink 1.2s step-end infinite',
                    letterSpacing: '0.1em',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                ▼ SCROLL ▼
            </motion.div>
        </section>
    );
}
