'use client';

import { useState } from 'react';
import { T, FONT, MONO, Arrowheads, Figure } from './ui';

const LANES = [
    { id: 'b', label: 'Browser', x: 74 },
    { id: 'a', label: 'FastAPI', x: 268 },
    { id: 'r', label: 'Redis', x: 452 },
    { id: 'w', label: 'Celery worker', x: 646 },
    { id: 'x', label: 'External APIs', x: 850 },
    { id: 's', label: 'S3', x: 1010 },
    { id: 'p', label: 'Postgres', x: 1132 },
] as const;

type LaneId = typeof LANES[number]['id'];
type Phase = 'accept' | 'poll' | 'pipeline' | 'deliver';

interface Step {
    n: number;
    from: LaneId;
    to: LaneId;
    text: string;
    phase: Phase;
    kind?: 'msg' | 'self' | 'alt' | 'return';
    detail?: string;
}

const STEPS: Step[] = [
    { n: 1, from: 'b', to: 'a', phase: 'accept', text: 'POST /generate {url, name, grade}' },
    { n: 2, from: 'a', to: 'a', kind: 'self', phase: 'accept', text: 'urlguard.validate(url)', detail: 'Validation sits on the Pydantic model, so a bad URL never reaches the queue.' },
    { n: 3, from: 'a', to: 'r', phase: 'accept', text: 'INCR ratelimit:generate:{ip}:{window}' },
    { n: 4, from: 'a', to: 'b', kind: 'alt', phase: 'accept', text: 'alt over limit: 429 + Retry-After', detail: 'A valid admin token skips the limiter, which is how the load generator still floods the queue.' },
    { n: 5, from: 'a', to: 'r', phase: 'accept', text: 'LPUSH celery {task: generate_showcase}' },
    { n: 6, from: 'a', to: 'b', kind: 'alt', phase: 'accept', text: 'alt broker down: 503 could not queue', detail: 'Refusing loudly beats accepting a request that goes nowhere. Readiness uses the same signal.' },
    { n: 7, from: 'a', to: 'b', kind: 'return', phase: 'accept', text: '202 {submission_id}, about 5 ms' },
    { n: 8, from: 'b', to: 'a', phase: 'poll', text: 'loop every 2.5 s: GET showcase.json', detail: 'SSE would pin to one replica while another worker finishes the job, needing pub/sub fan-out. Polling a shared store is stateless.' },
    { n: 9, from: 'a', to: 'b', kind: 'return', phase: 'poll', text: '404 while the job is running' },
    { n: 10, from: 'r', to: 'w', phase: 'pipeline', text: 'BRPOP, one task, prefetch 1', detail: 'The ack is withheld until the task returns. With the default, a scale-down at second 70 destroyed the job.' },
    { n: 11, from: 'w', to: 'x', phase: 'pipeline', text: 'Playwright loads the student site', detail: 'Every navigation and redirect hop is re-validated: DNS can change while a job waits.' },
    { n: 12, from: 'w', to: 'p', phase: 'pipeline', text: 'SELECT cached fields WHERE (url, hash)' },
    { n: 13, from: 'w', to: 'x', kind: 'alt', phase: 'pipeline', text: 'alt cache miss: Claude, 14 fields, one call' },
    { n: 14, from: 'w', to: 'p', phase: 'pipeline', text: 'upsert AI fields, status pending' },
    { n: 15, from: 'w', to: 'x', phase: 'pipeline', text: 'edge-tts x2 (English, Mandarin)' },
    { n: 16, from: 'w', to: 'w', kind: 'self', phase: 'pipeline', text: 'ffmpeg x2, then QR and flyer' },
    { n: 17, from: 'w', to: 'p', phase: 'pipeline', text: 'upsert full row, status completed' },
    { n: 18, from: 'w', to: 's', phase: 'pipeline', text: 'upload 11 assets, then prune disk' },
    { n: 19, from: 'w', to: 'r', phase: 'pipeline', text: 'ACK' },
    { n: 20, from: 'b', to: 'a', phase: 'deliver', text: 'GET showcase.json' },
    { n: 21, from: 'a', to: 's', phase: 'deliver', text: 'local miss, GetObject', detail: 'Compose shared a volume; Kubernetes does not. Without the S3 fallthrough the poll would 404 forever.' },
    { n: 22, from: 'a', to: 'b', kind: 'return', phase: 'deliver', text: '200 showcase.json, polling stops' },
];

const PHASES: { id: Phase; label: string; hint: string }[] = [
    { id: 'accept', label: 'Accept', hint: 'Guarded, queued, answered in about 5 ms' },
    { id: 'poll', label: 'Poll', hint: 'About 40 requests against a cached static read' },
    { id: 'pipeline', label: 'Pipeline', hint: 'One task, roughly 100 s of work off the request path' },
    { id: 'deliver', label: 'Deliver', hint: 'Asset read falls through to S3 on a local miss' },
];

const LX = Object.fromEntries(LANES.map(l => [l.id, l.x])) as Record<LaneId, number>;
const TOP = 78;
const GAP = 31;

export default function Lifecycle() {
    const [hover, setHover] = useState<number | null>(null);
    const [phase, setPhase] = useState<Phase | null>(null);
    const height = TOP + STEPS.length * GAP + 26;

    const lit = (s: Step) => (hover ? s.n === hover : phase ? s.phase === phase : true);
    const sel = STEPS.find(s => s.n === hover) ?? null;

    const controls = (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {PHASES.map(p => {
                    const on = phase === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setPhase(on ? null : p.id)}
                            style={{
                                fontFamily: FONT, fontSize: '0.75rem', fontWeight: 500,
                                color: on ? T.canvas : T.body,
                                background: on ? T.ink : T.canvas,
                                border: `1px solid ${on ? T.ink : T.ruleStrong}`,
                                borderRadius: 4, padding: '5px 11px', cursor: 'pointer',
                            }}
                        >
                            {p.label}
                        </button>
                    );
                })}
                <span style={{ fontFamily: FONT, fontSize: '0.75rem', color: T.muted, alignSelf: 'center' }}>
                    {phase ? PHASES.find(p => p.id === phase)!.hint : 'All 22 messages'}
                </span>
            </div>
    );

    const panel = (
        <div style={{  minHeight: 62, fontFamily: FONT }}>
                {sel?.detail ? (
                    <p style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.62 }}>
                        <span style={{ fontFamily: MONO, fontSize: '0.78rem', color: T.accent, marginRight: 8 }}>
                            {String(sel.n).padStart(2, '0')}
                        </span>
                        {sel.detail}
                    </p>
                ) : (
                    <p style={{ fontSize: '0.86rem', color: T.muted, lineHeight: 1.62 }}>
Three messages were bugs first: late acks (10), the re-validated redirect chain (11), the S3 fallthrough (21).
                    </p>
                )}
            </div>
    );

    return (
        <Figure
            label="Fig 2"
            title="Request lifecycle"
            minWidth={1200}
            caption="Hover a message for the reasoning. Phase buttons dim the rest." controls={controls} panel={panel}
        >
            <svg viewBox={`0 0 1200 ${height}`}
                role="img"
                aria-label="Request lifecycle across four lanes — client, API, broker and worker — tracing one submission from POST through queueing, polling and completion." style={{ width: '100%', display: 'block' }}>
                <Arrowheads />

                {LANES.map(l => (
                    <g key={l.id}>
                        <rect x={l.x - 62} y={10} width={124} height={30} rx={4} fill={T.surface} stroke={T.ruleStrong} />
                        <text x={l.x} y={29} textAnchor="middle" style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, fill: T.ink }}>
                            {l.label}
                        </text>
                        <line x1={l.x} y1={40} x2={l.x} y2={height - 12} stroke={T.rule} strokeWidth={1} strokeDasharray="3 4" />
                    </g>
                ))}

                {STEPS.map((s, i) => {
                    const y = TOP + i * GAP;
                    const on = lit(s);
                    const hot = hover === s.n;
                    const x1 = LX[s.from];
                    const x2 = LX[s.to];
                    const color = hot ? T.accent : s.kind === 'alt' ? T.bad.stroke : s.kind === 'return' ? T.good.stroke : T.ruleStrong;
                    const textColor = hot ? T.ink : on ? T.body : T.faint;

                    return (
                        <g
                            key={s.n}
                            opacity={on ? 1 : 0.25}
                            onMouseEnter={() => setHover(s.n)}
                            onMouseLeave={() => setHover(null)}
                            style={{ cursor: 'default', transition: 'opacity .16s' }}
                        >
                            <rect x={16} y={y - 15} width={1170} height={GAP - 4} fill={hot ? T.accentSoft : 'transparent'} rx={3} />
                            <text x={26} y={y + 4} style={{ fontFamily: MONO, fontSize: 11.5, fill: hot ? T.accent : T.faint }}>
                                {String(s.n).padStart(2, '0')}
                            </text>

                            {s.kind === 'self' ? (
                                <>
                                    <path
                                        d={`M ${x1} ${y - 7} H ${x1 + 34} V ${y + 7} H ${x1 + 2}`}
                                        fill="none" stroke={color} strokeWidth={hot ? 1.8 : 1.2}
                                        markerEnd={`url(#${hot ? 'ah-on' : 'ah'})`}
                                    />
                                    <text x={x1 + 42} y={y + 3} style={{ fontFamily: FONT, fontSize: 10.8, fill: textColor, fontWeight: hot ? 600 : 400 }}>
                                        {s.text}
                                    </text>
                                </>
                            ) : (
                                <>
                                    <line
                                        x1={x1} y1={y} x2={x2} y2={y}
                                        stroke={color} strokeWidth={hot ? 1.8 : 1.2}
                                        strokeDasharray={s.kind === 'return' ? '5 3' : undefined}
                                        markerEnd={`url(#${hot ? 'ah-on' : s.kind === 'alt' ? 'ah-bad' : s.kind === 'return' ? 'ah-good' : 'ah'})`}
                                    />
                                    <text
                                        x={(x1 + x2) / 2}
                                        y={y - 6}
                                        textAnchor="middle"
                                        style={{ fontFamily: FONT, fontSize: 10.8, fill: textColor, fontWeight: hot ? 600 : 400 }}
                                    >
                                        {s.text}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </Figure>
    );
}
