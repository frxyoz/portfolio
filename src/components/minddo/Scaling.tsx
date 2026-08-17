'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { T, FONT, MONO, Arrowheads, Figure } from './ui';

const MIN_R = 1, MAX_R = 4, PER_POD = 3, CONCURRENCY = 1;
const desired = (q: number) => Math.min(MAX_R, Math.max(MIN_R, Math.ceil(q / PER_POD)));

const PRESETS = [
    { q: 0, label: 'Idle' },
    { q: 1, label: 'One submission' },
    { q: 9, label: 'A class submitting' },
    { q: 20, label: 'Load test' },
];

export default function Scaling() {
    const [q, setQ] = useState(9);
    const pods = desired(q);
    const slots = pods * CONCURRENCY;

    const controls = (
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT, fontSize: '0.8rem', color: T.body }}>
                    <span style={{ whiteSpace: 'nowrap' }}>Queued jobs</span>
                    <input
                        type="range" min={0} max={24} value={q}
                        onChange={e => setQ(Number(e.target.value))}
                        style={{ width: 220, accentColor: T.accent }}
                    />
                    <span style={{ fontFamily: MONO, fontSize: '0.85rem', color: T.ink, width: 26 }}>{q}</span>
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {PRESETS.map(p => {
                        const on = q === p.q;
                        return (
                            <button
                                key={p.label}
                                onClick={() => setQ(p.q)}
                                style={{
                                    fontFamily: FONT, fontSize: '0.73rem', color: on ? '#fff' : T.body,
                                    background: on ? T.ink : '#fff', border: `1px solid ${on ? T.ink : T.ruleStrong}`,
                                    borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
                                }}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>
    );

    const panel = (
        <div style={{  fontFamily: FONT }}>
                <p style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.65 }}>
                    <strong style={{ color: T.ink, fontWeight: 600 }}>Why queue depth and not CPU.</strong>{' '}
                    Three concurrent jobs took 106.9 s against 102.7 s for one: the work is almost entirely waiting.
                    CPU stays low exactly while the queue backs up, so a CPU-triggered HPA would refuse to scale at
                    the moment scaling is needed.{' '}
                    <strong style={{ color: T.ink, fontWeight: 600 }}>Why the ceiling is four.</strong>{' '}
                    It was eight on my laptop, then six, and both were wrong on a t3.large. Eight would not schedule
                    at all. Six scheduled and then got OOM killed, because the scheduler admits pods on their requests
                    while the kernel kills on what they actually use.
                </p>
            </div>
    );

    return (
        <Figure
            label="Fig 4"
            title="KEDA control loop"
            minWidth={1080}
            caption="Drag the queue depth. The replica count is the real control law: one pod per three queued jobs, clamped to 1 through 4. Measured on AWS: twenty jobs took the deployment from one pod to four in 17 s." controls={controls} panel={panel}
        >
            <svg viewBox="0 0 1080 292" style={{ width: '100%', display: 'block' }}>
                <Arrowheads />

                {/* Redis queue */}
                <rect x={14} y={30} width={250} height={216} rx={6} fill={T.store.fill} stroke={T.store.stroke} strokeWidth={1.3} />
                <text x={28} y={52} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, fill: T.store.text }}>Redis list &apos;celery&apos;</text>
                <text x={28} y={68} style={{ fontFamily: MONO, fontSize: 10.8, fill: T.store.text, opacity: 0.8 }}>LLEN celery = {q}</text>
                {Array.from({ length: 24 }).map((_, i) => {
                    const filled = i < q;
                    return (
                        <motion.rect
                            key={i}
                            x={28 + (i % 8) * 28}
                            y={84 + Math.floor(i / 8) * 26}
                            width={22} height={20} rx={3}
                            animate={{ opacity: filled ? 1 : 0.16 }}
                            transition={{ duration: 0.18 }}
                            fill={filled ? T.store.stroke : '#fff'}
                            stroke={T.store.stroke}
                            strokeWidth={1}
                        />
                    );
                })}
                <text x={28} y={228} style={{ fontFamily: FONT, fontSize: 11.0, fill: T.store.text, opacity: 0.85 }}>
                    no AOF: a restart loses the queue
                </text>

                <path d="M 264 138 H 306" fill="none" stroke={T.ruleStrong} strokeWidth={1.3} markerEnd="url(#ah)" />
                <text x={268} y={130} style={{ fontFamily: FONT, fontSize: 10.8, fill: T.faint }}>poll 5 s</text>

                {/* KEDA */}
                <rect x={308} y={54} width={266} height={168} rx={6} fill={T.extern.fill} stroke={T.extern.stroke} strokeWidth={1.3} />
                <text x={324} y={78} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, fill: T.extern.text }}>KEDA ScaledObject</text>
                <text x={324} y={100} style={{ fontFamily: MONO, fontSize: 10, fill: T.extern.text }}>
                    desired = ceil({q} / {PER_POD})
                </text>
                <text x={324} y={118} style={{ fontFamily: MONO, fontSize: 10, fill: T.extern.text }}>
                    clamp({MIN_R} .. {MAX_R})
                </text>
                <text x={324} y={148} style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, fill: T.extern.text }}>
                    {pods} replica{pods === 1 ? '' : 's'}
                </text>
                <text x={324} y={182} style={{ fontFamily: FONT, fontSize: 11.0, fill: T.extern.text, opacity: 0.85 }}>
                    managed HPA, 300 s stabilisation
                </text>
                <text x={324} y={200} style={{ fontFamily: FONT, fontSize: 11.0, fill: q >= 24 ? T.bad.stroke : T.extern.text, opacity: 0.85 }}>
                    max 4 is a blast radius ceiling
                </text>

                <path d="M 574 138 H 616" fill="none" stroke={T.ruleStrong} strokeWidth={1.3} markerEnd="url(#ah)" />
                <text x={578} y={130} style={{ fontFamily: FONT, fontSize: 10.8, fill: T.faint }}>scale</text>

                {/* Worker pods */}
                <rect x={618} y={30} width={448} height={222} rx={6} fill="none" stroke={T.rule} strokeWidth={1.4} strokeDasharray="4 4" />
                <text x={634} y={52} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, fill: T.muted }}>Deployment worker</text>
                <text x={634} y={68} style={{ fontFamily: MONO, fontSize: 10.8, fill: T.faint }}>
                    {pods} pod{pods === 1 ? '' : 's'} x concurrency {CONCURRENCY} = {slots} pipeline slot{slots === 1 ? '' : 's'}
                </text>

                {Array.from({ length: MAX_R }).map((_, i) => {
                    const live = i < pods;
                    const x = 634 + (i % 2) * 216;
                    const y = 84 + Math.floor(i / 2) * 76;
                    const busy = Math.max(0, Math.min(CONCURRENCY, q - i * CONCURRENCY));
                    return (
                        <motion.g key={i} animate={{ opacity: live ? 1 : 0.17 }} transition={{ duration: 0.22 }}>
                            <rect x={x} y={y} width={202} height={60} rx={5} fill={live ? T.tier.fill : '#fff'} stroke={live ? T.tier.stroke : T.rule} strokeWidth={1.2} />
                            <text x={x + 10} y={y + 19} style={{ fontFamily: MONO, fontSize: 10.8, fill: T.tier.text }}>worker-{i + 1}</text>
                            <text x={x + 10} y={y + 52} style={{ fontFamily: MONO, fontSize: 10.8, fill: T.tier.text, opacity: 0.75 }}>
                                1 Chromium, limit 1200 Mi
                            </text>
                            <rect
                                x={x + 92} y={y + 26} width={100} height={20} rx={3}
                                fill={live && busy > 0 ? T.tier.stroke : '#fff'}
                                stroke={T.tier.stroke} strokeWidth={0.9} opacity={live ? 1 : 0.5}
                            />
                        </motion.g>
                    );
                })}

                {/* Two lines: at a legible size this no longer fits the viewBox on one. */}
                <text x={634} y={231} style={{ fontFamily: FONT, fontSize: 10.4, fill: T.muted }}>
                    scale-down is a warm drain: 660 s grace, late acks
                </text>
                <text x={634} y={245} style={{ fontFamily: FONT, fontSize: 10.4, fill: T.muted }}>
                    measured on EC2: 3.3 min after the queue emptied
                </text>

                <path d="M 842 258 V 276 H 140 V 246" fill="none" stroke={T.rule} strokeWidth={1.2} strokeDasharray="4 4" markerEnd="url(#ah)" />
                <text x={452} y={272} style={{ fontFamily: FONT, fontSize: 10.8, fill: T.faint }}>workers pull with BRPOP</text>
            </svg>
        </Figure>
    );
}
