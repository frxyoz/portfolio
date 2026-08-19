'use client';

import { useState } from 'react';
import { profile } from '@/data/profile';
import Reveal from './Reveal';
import Pictogram, { type PictogramName } from './concourse/Pictogram';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
    SIGNAL, SIGNAL_DEEP, ENAMEL, ENAMEL_INK_SOFT, STEEL, SIGN_WHITE, SIGN_INK,
    BOARD_INK_SOFT, GREEN_LAMP, RED_LAMP, SIGN, EASE_OUT, TYPE,} from '@/design/tokens';

const SOCIAL_ICON: Record<string, PictogramName> = {
    GitHub: 'github',
    LinkedIn: 'linkedin',
    Email: 'mail',
};

/* 16px, not 0.9rem: Safari auto-zooms into any input below 16px on focus and
   never zooms back, which strands the visitor mid-form on a phone. */
const inputStyle: React.CSSProperties = {
    fontFamily: SIGN, fontSize: TYPE.BODY, fontWeight: 500, color: SIGN_INK,
    background: SIGN_WHITE, border: `2px solid ${SIGN_WHITE}`,
    padding: '13px 16px', width: '100%', minHeight: 50,
    transition: `border-color 0.2s ${EASE_OUT}`,
};

/* Visible to screen readers, not to the eye. The fields are designed to carry
   their names in the placeholder, but a placeholder disappears the moment
   anyone types and is not an accessible name to begin with. */
const srOnly: React.CSSProperties = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

/* The desk's header band: the function reversed out of signal, running the full
   width of the plate. A service counter says what it is above the counter, not
   beside it. */
const deskHeader: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    background: SIGNAL, color: STEEL,
    padding: '11px 16px',
    fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
    letterSpacing: '0.2em', textTransform: 'uppercase',
};

/* Platform-edge marking. Hatched signal-and-steel is the one piece of a terminal
   that means "the ground changes here", which is exactly what this band does:
   the black board above stops and the enamel service hall begins. */
const platformEdge: React.CSSProperties = {
    height: 16,
    background: `repeating-linear-gradient(-45deg, ${SIGNAL} 0 14px, ${STEEL} 14px 28px)`,
};

export default function ContactSection() {
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
        <section
            id="contact"
            style={{
                background: ENAMEL,
                padding: 0,
                fontFamily: SIGN,
            }}
        >
            <div aria-hidden="true" style={platformEdge} />

            <div style={{
                maxWidth: 1080, margin: '0 auto',
                padding: isMobile ? '64px 20px 0' : '112px 48px 0',
            }}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.15fr)',
                    gap: isMobile ? 48 : 80,
                    alignItems: 'start',
                }}>
                    {/* The desk itself. */}
                    <div>
                        <Reveal>
                            <h2 style={{
                                fontSize: isMobile ? 'clamp(2.2rem, 11vw, 3.2rem)' : 'clamp(2.8rem, 5vw, 4.4rem)',
                                fontWeight: 800, fontStretch: '112%',
                                letterSpacing: '-0.03em', lineHeight: 0.9, color: SIGN_WHITE,
                            }}>
                                Contact
                            </h2>
                        </Reveal>

                        <Reveal delay={0.06} style={{
                            height: 12, background: SIGNAL, width: isMobile ? 120 : 160,
                            margin: isMobile ? '20px 0 28px' : '26px 0 32px',
                        }} />

                        {/* The status lamp. Green here means the same thing it means
                            on the board: open and running. */}
                        <Reveal delay={0.1}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: STEEL, color: GREEN_LAMP,
                                padding: '9px 14px', marginBottom: 22,
                                fontSize: TYPE.LABEL, fontWeight: 800, fontStretch: '88%',
                                letterSpacing: '0.18em', textTransform: 'uppercase',
                            }}>
                                <span aria-hidden="true" style={{
                                    width: 8, height: 8, background: GREEN_LAMP,
                                    animation: 'lamp 2.4s ease-in-out infinite',
                                }} />
                                Open to internships
                            </span>
                        </Reveal>

                        <Reveal delay={0.14}>
                            <p style={{
                                fontSize: isMobile ? TYPE.BODY : TYPE.LEDE, lineHeight: 1.65,
                                color: SIGN_WHITE, maxWidth: '38ch', marginBottom: 34,
                            }}>
                                Open to internships, collaborations, or questions about any of
                                the projects above.
                            </p>
                        </Reveal>

                        <Reveal delay={0.18}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {profile.socialLinks.map(s => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target={s.href.startsWith('mailto') ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14,
                                            minHeight: 56, padding: '0 4px',
                                            borderBottom: `1px solid ${ENAMEL_INK_SOFT}44`,
                                            color: SIGN_WHITE,
                                            fontSize: TYPE.META, fontWeight: 700, fontStretch: '88%',
                                            letterSpacing: '0.16em', textTransform: 'uppercase',
                                            transition: `color 0.2s ${EASE_OUT}, padding-left 0.2s ${EASE_OUT}`,
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.color = SIGNAL;
                                            e.currentTarget.style.paddingLeft = '12px';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.color = SIGN_WHITE;
                                            e.currentTarget.style.paddingLeft = '4px';
                                        }}
                                    >
                                        <Pictogram name={SOCIAL_ICON[s.label] ?? 'arrow-up-right'} size={17} />
                                        {s.label}
                                        <span style={{ flex: 1 }} />
                                        <Pictogram name="arrow-right" size={14} color={SIGNAL} />
                                    </a>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* The enquiry form, on its own plate. */}
                    <Reveal delay={0.1}>
                        <div style={{ background: STEEL, border: `3px solid ${STEEL}` }}>
                            <span style={deskHeader}>
                                <Pictogram name="mail" size={13} />
                                Send a message
                            </span>

                            <div style={{ padding: isMobile ? '22px 20px 26px' : '30px 32px 34px' }}>

                            {/* Mounted from the start and never unmounted. A live region that
                                arrives at the same moment as its own text is frequently missed:
                                the announcement depends on the region already existing when the
                                content changes. */}
                            <p aria-live="polite" style={srOnly}>
                                {sending ? 'Sending your message.'
                                    : submitted ? 'Message sent. I’ll be in touch soon.'
                                        : error ? 'The message did not send. Try again, or email olriczeng@gmail.com directly.'
                                            : ''}
                            </p>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label htmlFor="contact-name" style={srOnly}>Your name</label>
                                            <input
                                                id="contact-name"
                                                type="text" name="name" placeholder="Name"
                                                autoComplete="name"
                                                value={form.name} onChange={handleChange} required
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = SIGNAL; }}
                                                onBlur={e => { e.target.style.borderColor = SIGN_WHITE; }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contact-email" style={srOnly}>Your email address</label>
                                            <input
                                                id="contact-email"
                                                type="email" name="email" placeholder="Email"
                                                autoComplete="email"
                                                value={form.email} onChange={handleChange} required
                                                style={inputStyle}
                                                onFocus={e => { e.target.style.borderColor = SIGNAL; }}
                                                onBlur={e => { e.target.style.borderColor = SIGN_WHITE; }}
                                            />
                                        </div>
                                    </div>
                                    <label htmlFor="contact-message" style={srOnly}>Your message</label>
                                    <textarea
                                        id="contact-message"
                                        name="message" placeholder="Message" rows={5}
                                        value={form.message} onChange={handleChange} required
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        onFocus={e => { e.target.style.borderColor = SIGNAL; }}
                                        onBlur={e => { e.target.style.borderColor = SIGN_WHITE; }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        aria-busy={sending}
                                        style={{
                                            marginTop: 4, alignSelf: 'flex-start',
                                            display: 'inline-flex', alignItems: 'center', gap: 10,
                                            fontFamily: SIGN,
                                            fontSize: TYPE.CONTROL, fontWeight: 800, fontStretch: '88%',
                                            letterSpacing: '0.18em', textTransform: 'uppercase',
                                            color: STEEL, background: sending ? SIGNAL_DEEP : SIGNAL,
                                            border: 'none', padding: '0 26px', minHeight: 50,
                                            cursor: sending ? 'default' : 'pointer',
                                            transition: `background 0.2s ${EASE_OUT}`,
                                        }}
                                        onMouseEnter={e => { if (!sending) e.currentTarget.style.background = SIGN_WHITE; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = sending ? SIGNAL_DEEP : SIGNAL; }}
                                    >
                                        {sending ? 'Sending' : 'Send'}
                                        <Pictogram name="arrow-right" size={13} />
                                    </button>
                                    {error && (
                                        <p style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 9,
                                            fontSize: TYPE.META, color: RED_LAMP, lineHeight: 1.5, marginTop: 4,
                                        }}>
                                            <Pictogram name="close" size={12} style={{ marginTop: 4 }} />
                                            The message did not send. Try again, or email
                                            olriczeng@gmail.com directly.
                                        </p>
                                    )}
                                </form>
                            ) : (
                                <div style={{ background: SIGNAL, color: STEEL, padding: '28px 24px' }}>
                                    <p style={{
                                        fontSize: TYPE.SUBHEAD, fontWeight: 800, fontStretch: '104%',
                                        letterSpacing: '-0.02em', marginBottom: 8,
                                    }}>
                                        Thank you, {form.name}.
                                    </p>
                                    <p style={{ fontSize: TYPE.COPY, fontWeight: 500 }}>
                                        I&apos;ll be in touch soon.
                                    </p>
                                </div>
                            )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* The closing rail. The page began on a steel rail and ends on one. */}
            <footer style={{
                marginTop: isMobile ? 64 : 104,
                background: STEEL,
                padding: isMobile ? '20px' : '22px 48px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? 10 : 0,
            }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    fontSize: TYPE.META, fontWeight: 800, fontStretch: '104%',
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: SIGNAL,
                }}>
                    <span aria-hidden="true" style={{
                        background: SIGNAL, color: STEEL,
                        width: 26, height: 26,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: TYPE.LABEL, fontWeight: 800,
                    }}>
                        OZ
                    </span>
                    Olric Zeng
                </span>
                <span style={{
                    fontSize: TYPE.LABEL, fontWeight: 600, fontStretch: '88%',
                    letterSpacing: '0.16em', textTransform: 'uppercase', color: BOARD_INK_SOFT,
                }}>
                    © {new Date().getFullYear()} · olriczeng@gmail.com
                </span>
            </footer>
        </section>
    );
}
