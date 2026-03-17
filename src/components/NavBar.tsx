'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/data/profile';

const NAV_LINKS = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
];

const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.nav
                    key="navbar"
                    initial={{ y: -64, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -64, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0,
                        zIndex: 100,
                        background: 'linear-gradient(90deg, #cc0000 0%, #aa0000 100%)',
                        borderBottom: '3px solid #770000',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '960px',
                            margin: '0 auto',
                            padding: '0 1.5rem',
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Left: indicator + brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="indicator-eye" style={{ width: '24px', height: '24px', border: '2px solid #440000' }} />
                            <span
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.55rem',
                                    color: '#ffcb05',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                OLRIC ZENG
                            </span>
                        </div>

                        {/* Right: nav links + resume — stagger in */}
                        <motion.div
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                            }}
                        >
                            {NAV_LINKS.map(link => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    className="poke-btn"
                                    variants={linkVariants}
                                    whileHover={{ scale: 1.06, y: -1 }}
                                    whileTap={{ scale: 0.94 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="poke-btn poke-btn-yellow"
                                variants={linkVariants}
                                whileHover={{ scale: 1.06, y: -1 }}
                                whileTap={{ scale: 0.94 }}
                            >
                                RESUME ▶
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
