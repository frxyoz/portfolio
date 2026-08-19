'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { T, FONT, MONO, Arrowheads, Figure } from './ui';

type Id = 'capture' | 'demo' | 'qr' | 'ai' | 'flyer' | 'video' | 'persist';

interface Stage {
    id: Id;
    step: string;
    title: string;
    sub: string;
    deps: Id[];
    detail: string[];
}

const W = 146, H = 66;

const STAGES: Stage[] = [
    {
        id: 'capture', step: '1', title: 'Capture', sub: 'Chromium 1440x900', deps: [],
        detail: [
            'Two screenshots, plus a DOM query that builds page_text.',
            'page_text is both the prompt input and half of the cache key.',
        ],
    },
    {
        id: 'demo', step: '2', title: 'Demo recording', sub: 'record_video 1280x720', deps: [],
        detail: [
            'Three nav clicks, then a 300 step scroll: real time by construction, 20 to 25 s.',
            'Depends only on the URL, so nothing forces it to wait for capture.',
        ],
    },
    {
        id: 'qr', step: '5', title: 'QR code', sub: '600x600, ECC level Q', deps: [],
        detail: [
            'Depends only on the URL, but currently blocks step 5.',
            'Inlined into the flyer template as a data: URI.',
        ],
    },
    {
        id: 'ai', step: '3', title: 'AI fields', sub: 'claude-sonnet-4-6', deps: ['capture'],
        detail: [
            'Cache lookup first on (project_url, md5(page_text)). A hit skips the call.',
            'One call returns fourteen fields in both languages, so the second costs output tokens, not a round trip.',
        ],
    },
    {
        id: 'flyer', step: '6', title: 'Flyer', sub: 'HTML to PNG + PDF', deps: ['capture', 'qr'],
        detail: [
            'HTML template with escaped tokens, screenshot and QR inlined as data: URIs.',
            'Playwright renders it to PNG and to a print PDF.',
        ],
    },
    {
        id: 'video', step: '4', title: 'Video', sub: 'edge-tts + ffmpeg', deps: ['demo', 'ai'],
        detail: [
            'edge-tts in both languages, with a word-count duration fallback if it fails.',
            'WebVTT splits on Latin and CJK punctuation; ffmpeg loops the demo to audio length.',
        ],
    },
    {
        id: 'persist', step: '7', title: 'Persist', sub: 'Postgres, S3, prune', deps: ['video', 'flyer'],
        detail: [
            'showcase.json on disk, then a Supabase upsert marking it completed.',
            'Eleven assets go to S3, then the scratch directory is pruned.',
        ],
    },
];

const ORDER: Id[] = ['capture', 'demo', 'ai', 'video', 'qr', 'flyer', 'persist'];

/* Sequential: the seven steps as they run today, in source order. */
const SEQ: Record<Id, [number, number]> = Object.fromEntries(
    ORDER.map((id, i) => [id, [14 + i * 156, 116]]),
) as Record<Id, [number, number]>;

/* Parallel: laid out by dependency depth. Same artifacts, fewer waits. */
const PAR: Record<Id, [number, number]> = {
    capture: [30, 20], demo: [30, 108], qr: [30, 196],
    ai: [290, 20], flyer: [290, 196],
    video: [550, 64],
    persist: [810, 108],
};

const SEQ_EDGES: [Id, Id][] = [
    ['capture', 'demo'], ['demo', 'ai'], ['ai', 'video'], ['video', 'qr'], ['qr', 'flyer'], ['flyer', 'persist'],
];
const PAR_EDGES: [Id, Id][] = STAGES.flatMap(s => s.deps.map(d => [d, s.id] as [Id, Id]));

function path(pos: Record<Id, [number, number]>, [a, b]: [Id, Id]) {
    const [ax, ay] = pos[a];
    const [bx, by] = pos[b];
    const x1 = ax + W, y1 = ay + H / 2;
    const x2 = bx, y2 = by + H / 2;
    const mx = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
}

export default function Pipeline() {
    const reduced = useReducedMotion();
    const [mode, setMode] = useState<'seq' | 'par'>('seq');
    const [hover, setHover] = useState<Id | null>(null);
    const pos = mode === 'seq' ? SEQ : PAR;
    const edges = mode === 'seq' ? SEQ_EDGES : PAR_EDGES;
    const sel = STAGES.find(s => s.id === hover) ?? null;

    const controls = (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
                {([['seq', 'As built: sequential'], ['par', 'Possible: dependency order']] as const).map(([m, label]) => {
                    const on = mode === m;
                    return (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                fontFamily: FONT, fontSize: '0.75rem', fontWeight: 500,
                                color: on ? T.canvas : T.body, background: on ? T.ink : T.canvas,
                                border: `1px solid ${on ? T.ink : T.ruleStrong}`, borderRadius: 4,
                                padding: '5px 11px', cursor: 'pointer',
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
                <span style={{ fontFamily: FONT, fontSize: '0.75rem', color: T.muted }}>
                    {mode === 'seq'
                        ? 'Seven steps in order, three of which share no data with each other.'
                        : 'The real chain is capture, AI, video.'}
                </span>
            </div>
    );

    const panel = (
        <div style={{  minHeight: 96, fontFamily: FONT }}>
                {sel ? (
                    <>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: T.ink, marginBottom: 8 }}>
                            {sel.title}
                            <span style={{ fontFamily: MONO, fontSize: '0.74rem', color: T.muted, marginLeft: 10, fontWeight: 400 }}>
                                {sel.deps.length ? `depends on ${sel.deps.join(', ')}` : 'depends on the URL only'}
                            </span>
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {sel.detail.map(d => (
                                <li key={d} style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, top: 8, width: 5, height: 5, borderRadius: '50%', background: T.accent }} />
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p style={{ fontSize: '0.86rem', color: T.muted, lineHeight: 1.6 }}>
                        Most steps degrade instead of failing outright. If TTS falls over you get a silent video,
                        and if Supabase is down the run logs it and carries on. Only capture and the AI call are
                        genuinely fatal, and those write
                        <span style={{ fontFamily: MONO, fontSize: '0.82em' }}> generationStatus: &quot;failed&quot; </span>
                        so the frontend stops polling.
                    </p>
                )}
            </div>
    );

    return (
        <Figure
            label="Fig 3"
            title="Generation pipeline, as built and as it could run"
            minWidth={1120}
            caption={
                <>
                    These are layout positions rather than timing bars. End to end it measures 102.7 s, and roughly 25 s of that is avoidable.
                </>
            } controls={controls} panel={panel}
        >
            <svg viewBox="0 0 1120 296"
                role="img"
                aria-label="The generation pipeline as a chain of stages from URL capture through screenshotting, the Claude call, narration, video assembly and flyer render, shown both as built in sequence and as it could run in parallel." style={{ width: '100%', display: 'block' }}>
                <Arrowheads />

                {edges.map(([a, b]) => {
                    const on = hover === a || hover === b;
                    return (
                        <motion.path
                            key={`${mode}-${a}-${b}`}
                            initial={false}
                            animate={{ opacity: hover && !on ? 0.15 : 1 }}
                            transition={{ duration: 0.25 }}
                            d={path(pos, [a, b])}
                            fill="none"
                            stroke={on ? T.accent : T.ruleStrong}
                            strokeWidth={on ? 1.9 : 1.3}
                            markerEnd={`url(#${on ? 'ah-on' : 'ah'})`}
                        />
                    );
                })}

                {STAGES.map(s => {
                    const [x, y] = pos[s.id];
                    const on = hover === s.id;
                    const dim = hover !== null && !on;
                    const independent = s.deps.length === 0;
                    return (
                        <motion.g
                            key={s.id}
                            initial={false}
                            animate={{ x, y, opacity: dim ? 0.4 : 1 }}
                            /* Switching between the as-built and parallel layouts moves
                               every node at once. Reduced motion cuts the travel to a
                               near-instant reposition and keeps the opacity change,
                               which is what says which stages are involved. */
                            transition={reduced
                                ? { duration: 0.01 }
                                : { type: 'spring', stiffness: 210, damping: 26 }}
                            onMouseEnter={() => setHover(s.id)}
                            onMouseLeave={() => setHover(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <rect
                                width={W} height={H} rx={5}
                                fill={mode === 'par' && independent ? T.good.fill : T.tier.fill}
                                stroke={on ? T.ink : mode === 'par' && independent ? T.good.stroke : T.tier.stroke}
                                strokeWidth={on ? 2 : 1.3}
                            />
                            <text x={11} y={19} style={{ fontFamily: MONO, fontSize: 10.8, fill: T.accent }}>step {s.step}</text>
                            <text x={11} y={38} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, fill: T.ink }}>{s.title}</text>
                            <text x={11} y={54} style={{ fontFamily: MONO, fontSize: 10.6, fill: T.muted }}>{s.sub}</text>
                        </motion.g>
                    );
                })}

                {mode === 'par' && (
                    <text x={30} y={286} style={{ fontFamily: FONT, fontSize: 10.8, fill: T.good.text }}>
                        green: depends only on the submitted URL
                    </text>
                )}
            </svg>
        </Figure>
    );
}
