'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import Reveal from './Reveal';
import { useScrollTilt } from '@/hooks/useScrollTilt';

const ACCENT = '#b8860b';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';
const BODY = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';

const inputStyle: React.CSSProperties = {
    fontFamily: BODY, fontSize: '0.9rem', color: '#1a1a1a',
    background: 'rgba(255,255,255,0.72)', border: `1px solid ${ACCENT}28`, padding: '14px 18px',
    width: '100%', outline: 'none', transition: 'border-color 0.2s ease',
};

export default function ContactSection() {
    const tilt = useScrollTilt();
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        await fetch(process.env.FORMSPREE_KEY as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(form),
        });
        setSending(false);
        setSubmitted(true);
    };

    return (
        <section id="contact" style={{ background: '#f5f0e8', padding: '120px 48px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

                {/* Section header */}
                <Reveal>
                    <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
                        03
                    </p>
                </Reveal>
                <Reveal delay={0.04}>
                    <motion.h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1, marginBottom: 16, rotateX: tilt, transformPerspective: 800 }}>
                        Get in Touch
                    </motion.h2>
                </Reveal>
                <Reveal delay={0.08} style={{ width: 40, height: 1, background: ACCENT, margin: '0 auto 20px' }} />
                <Reveal delay={0.12}>
                    <p style={{ fontFamily: BODY, fontSize: '0.9rem', color: '#6b6558', lineHeight: 1.7, marginBottom: 48 }}>
                        Always open to collaborations, opportunities, and conversations!
                    </p>
                </Reveal>

                {/* Social links */}
                <Reveal delay={0.16} style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 56 }}>
                    {profile.socialLinks.map(s => (
                        <a
                            key={s.label}
                            href={s.href}
                            target={s.href.startsWith('mailto') ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#d4a017'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = ACCENT; }}
                            style={{
                                fontFamily: BODY, fontSize: '0.75rem', fontWeight: 500,
                                letterSpacing: '0.14em', textTransform: 'uppercase',
                                color: ACCENT, borderBottom: `1px solid ${ACCENT}55`, paddingBottom: 3,
                                transition: 'color 0.2s',
                            }}
                        >
                            {s.label}
                        </a>
                    ))}
                </Reveal>

                {/* Contact form */}
                <Reveal delay={0.2}>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <input
                                    type="text" name="name" placeholder="Name"
                                    value={form.name} onChange={handleChange} required
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                    onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                                />
                                <input
                                    type="email" name="email" placeholder="Email"
                                    value={form.email} onChange={handleChange} required
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                    onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                                />
                            </div>
                            <textarea
                                name="message" placeholder="Message" rows={5}
                                value={form.message} onChange={handleChange} required
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                            />
                            <button
                                type="submit"
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d4a017'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
                                style={{
                                    fontFamily: BODY, fontSize: '0.78rem', fontWeight: 500,
                                    letterSpacing: '0.14em', textTransform: 'uppercase',
                                    color: '#1a1a1a', background: ACCENT, border: 'none',
                                    padding: '16px 40px', cursor: 'pointer', alignSelf: 'flex-start',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {sending ? 'Sending…' : 'Send Message'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ padding: '40px', border: `1px solid ${ACCENT}44`, textAlign: 'center' }}>
                            <p style={{ fontFamily: DISPLAY, fontSize: '1.6rem', fontWeight: 400, color: ACCENT, fontStyle: 'italic' }}>
                                Thank you, {form.name}.
                            </p>
                            <p style={{ fontFamily: BODY, fontSize: '0.85rem', color: '#a09890', marginTop: 8 }}>
                                I&apos;ll be in touch soon.
                            </p>
                        </div>
                    )}
                </Reveal>

                {/* Footer */}
                <div style={{ marginTop: 96, paddingTop: 32, borderTop: `1px solid ${ACCENT}28`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: '1.1rem', fontStyle: 'italic', color: ACCENT }}>Olric Zeng</span>
                    <span style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.12em', color: '#8a8078', textTransform: 'uppercase' }}>
                        © {new Date().getFullYear()} · olriczeng@gmail.com
                    </span>
                </div>
            </div>
        </section>
    );
}
