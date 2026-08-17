'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import Reveal from './Reveal';
import { useScrollTilt } from '@/hooks/useScrollTilt';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ACCENT_TEXT, ACCENT_ORNAMENT as ACCENT, ACCENT_DEEP, DISPLAY, BODY, MUTED, INK } from '@/design/tokens';


/* 16px, not 0.9rem: Safari auto-zooms into any input below 16px on focus and
   never zooms back, which strands the visitor mid-form on a phone. */
const inputStyle: React.CSSProperties = {
    fontFamily: BODY, fontSize: '1rem', color: INK,
    background: 'rgba(255,255,255,0.72)', border: `1px solid ${ACCENT}28`, padding: '14px 18px',
    width: '100%', minHeight: 48, transition: 'border-color 0.2s ease',
};

/* Visible to screen readers, not to the eye. The fields are designed to carry
   their names in the placeholder, but a placeholder disappears the moment
   anyone types and is not an accessible name to begin with. */
const srOnly: React.CSSProperties = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

export default function ContactSection() {
    const tilt = useScrollTilt();
    const isMobile = useIsMobile();
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setError(false);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_KEY as string, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('submit failed');
            setSubmitted(true);
        } catch {
            setError(true);
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" style={{ background: '#f5f0e8', padding: isMobile ? '80px 24px' : '120px 48px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

                {/* Section header */}
                <Reveal>
                    <p style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT_TEXT, marginBottom: 12 }}>
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
                        Open to internships, collaborations, or questions about any of the projects above.
                    </p>
                </Reveal>

                {/* Social links */}
                <Reveal delay={0.16} style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32, flexWrap: 'wrap', marginBottom: 56 }}>
                    {profile.socialLinks.map(s => (
                        <a
                            key={s.label}
                            href={s.href}
                            target={s.href.startsWith('mailto') ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = ACCENT_DEEP; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = ACCENT; }}
                            style={{
                                fontFamily: BODY, fontSize: '0.75rem', fontWeight: 500,
                                letterSpacing: '0.14em', textTransform: 'uppercase',
                                color: ACCENT_TEXT,
                                transition: 'color 0.2s',
                                /* 44px target centred on the label; the underline sits on the inner
                                   span so it keeps hugging the text. */
                                display: 'inline-flex', alignItems: 'center', minHeight: 44,
                            }}
                        >
                            <span style={{ borderBottom: `1px solid ${ACCENT}55`, paddingBottom: 3 }}>
                                {s.label}
                            </span>
                        </a>
                    ))}
                </Reveal>

                {/* Contact form */}
                <Reveal delay={0.2}>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                                <label htmlFor="contact-name" style={srOnly}>Your name</label>
                                <input
                                    id="contact-name"
                                    type="text" name="name" placeholder="Name"
                                    autoComplete="name"
                                    value={form.name} onChange={handleChange} required
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                    onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                                />
                                <label htmlFor="contact-email" style={srOnly}>Your email address</label>
                                <input
                                    id="contact-email"
                                    type="email" name="email" placeholder="Email"
                                    autoComplete="email"
                                    value={form.email} onChange={handleChange} required
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                    onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                                />
                            </div>
                            <label htmlFor="contact-message" style={srOnly}>Your message</label>
                            <textarea
                                id="contact-message"
                                name="message" placeholder="Message" rows={5}
                                value={form.message} onChange={handleChange} required
                                style={{ ...inputStyle, resize: 'vertical' }}
                                onFocus={e => { e.target.style.borderColor = ACCENT; }}
                                onBlur={e => { e.target.style.borderColor = `${ACCENT}33`; }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'flex-start' }}>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.background = '#d4a017'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = sending ? `${ACCENT}99` : ACCENT; }}
                                    style={{
                                        fontFamily: BODY, fontSize: '0.78rem', fontWeight: 500,
                                        letterSpacing: '0.14em', textTransform: 'uppercase',
                                        color: '#1a1a1a', background: sending ? `${ACCENT}99` : ACCENT, border: 'none',
                                        padding: '16px 40px', cursor: sending ? 'default' : 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {sending ? 'Sending…' : 'Send Message'}
                                </button>
                                {error && (
                                    <p style={{ fontFamily: BODY, fontSize: '0.8rem', color: '#c0392b' }}>
                                        Something went wrong — please try again.
                                    </p>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div style={{ padding: '40px', border: `1px solid ${ACCENT}44`, textAlign: 'center' }}>
                            <p style={{ fontFamily: DISPLAY, fontSize: '1.6rem', fontWeight: 400, color: ACCENT_TEXT, fontStyle: 'italic' }}>
                                Thank you, {form.name}.
                            </p>
                            <p style={{ fontFamily: BODY, fontSize: '0.85rem', color: '#a09890', marginTop: 8 }}>
                                I&apos;ll be in touch soon.
                            </p>
                        </div>
                    )}
                </Reveal>

                {/* Footer */}
                <div style={{ marginTop: 96, paddingTop: 32, borderTop: `1px solid ${ACCENT}28`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'center', gap: isMobile ? 8 : 0, textAlign: 'center' }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: '1.1rem', fontStyle: 'italic', color: ACCENT_TEXT }}>Olric Zeng</span>
                    <span style={{ fontFamily: BODY, fontSize: '0.68rem', letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' }}>
                        © {new Date().getFullYear()} · olriczeng@gmail.com
                    </span>
                </div>
            </div>
        </section>
    );
}
