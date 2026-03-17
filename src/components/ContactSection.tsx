'use client';

import { useState } from 'react';
import { profile } from '@/data/profile';
import ScrollReveal from './ScrollReveal';
import ScrollFloat from './ScrollFloat';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <ScrollReveal>
        <div className="section-panel">
          {/* Panel header */}
          <div
            style={{
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #880000',
              background: 'rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="indicator-eye" style={{ width: '24px', height: '24px', border: '2px solid #440000' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ff4444', boxShadow: '0 0 4px #ff4444', animation: 'blink 1.2s step-end infinite' }} />
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ffcc00', boxShadow: '0 0 4px #ffcc00' }} />
              </div>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.6rem',
                  color: '#ffcb05',
                  letterSpacing: '0.1em',
                }}
              >
                CONNECT
              </ScrollFloat>
            </div>
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.4rem', color: 'rgba(255,100,100,0.5)' }}>
              CONTACT
            </span>
          </div>

          {/* Screen area */}
          <div className="section-screen">
            <div
              className="section-screen-inner"
              style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}
            >
              {/* Left: form */}
              <div style={{ flex: '1 1 340px' }}>
                {/* Prompt */}
                <div
                  style={{
                    background: '#111',
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '16px',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  <div style={{ background: '#091510', borderRadius: '4px', padding: '12px' }}>
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.45rem',
                        color: '#4dff88',
                        lineHeight: 2,
                        margin: 0,
                      }}
                    >
                      ▶ What would you like to say?
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div
                    style={{
                      background: '#111',
                      borderRadius: '8px',
                      padding: '10px',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div
                      style={{
                        background: '#091510',
                        borderRadius: '4px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.5rem',
                          color: '#4dff88',
                          marginBottom: '12px',
                          letterSpacing: '0.08em',
                        }}
                      >
                        [ SENT ]
                      </div>
                      <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.5rem', color: '#4dff88', lineHeight: 2 }}>
                        MESSAGE SENT!
                      </p>
                      <p style={{ color: '#267544', fontSize: '0.82rem', marginTop: '8px' }}>
                        I&apos;ll get back to you soon.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { name: 'name',    label: 'NAME',  type: 'text',  placeholder: 'Your name...' },
                      { name: 'email',   label: 'EMAIL', type: 'email', placeholder: 'your@email.com' },
                    ].map(field => (
                      <label key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.4rem', color: '#267544', letterSpacing: '0.08em' }}>
                          {field.label}
                        </span>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          className="game-input"
                        />
                      </label>
                    ))}

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.4rem', color: '#267544', letterSpacing: '0.08em' }}>
                        MESSAGE
                      </span>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Say something..."
                        required
                        rows={4}
                        className="game-input"
                        style={{ resize: 'vertical' }}
                      />
                    </label>

                    <button
                      type="submit"
                      className="poke-btn poke-btn-yellow"
                      style={{ alignSelf: 'flex-start', fontSize: '0.5rem', padding: '10px 18px' }}
                    >
                      SEND ▶
                    </button>
                  </form>
                )}
              </div>

              {/* Right: social links */}
              <div
                style={{
                  flex: '0 0 200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.4rem',
                    color: '#267544',
                    letterSpacing: '0.1em',
                    marginBottom: '4px',
                  }}
                >
                  ── LINKS ──
                </div>
                {profile.socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.icon === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="poke-btn"
                    style={{ justifyContent: 'flex-start', gap: '8px' }}
                  >
                    <SocialIcon icon={link.icon} />
                    {link.label.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 22px',
              borderTop: '2px solid #880000',
              background: 'rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.35rem',
                color: 'rgba(255,100,100,0.3)',
                letterSpacing: '0.1em',
              }}
            >
              © {new Date().getFullYear()} {profile.name}
            </span>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'github') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }
  if (icon === 'linkedin') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
