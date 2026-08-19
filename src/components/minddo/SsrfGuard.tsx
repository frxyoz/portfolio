'use client';

import { useState, useEffect } from 'react';
import { T, FONT, MONO, Tone, Arrowheads, Figure } from './ui';

type Id = 'u' | 's' | 'h' | 'lit' | 'ipc' | 'dns' | 'all' | 'block' | 'ok' | 'nav' | 'sub' | 'recheck' | 'walk' | 'ok2' | 'block2';

interface Node { id: Id; x: number; y: number; w: number; h: number; tone: Tone | 'plain'; lines: string[] }

const NODES: Node[] = [
    { id: 'u', x: 350, y: 8, w: 200, h: 40, tone: 'plain', lines: ['URL from POST /generate'] },
    { id: 's', x: 350, y: 72, w: 200, h: 44, tone: 'tier', lines: ['scheme in {http, https} ?'] },
    { id: 'h', x: 316, y: 140, w: 268, h: 58, tone: 'tier', lines: ['hostname in blocklist ?', '`localhost, metadata,', '`metadata.google.internal, instance-data'] },
    { id: 'lit', x: 350, y: 222, w: 200, h: 44, tone: 'tier', lines: ['literal IP ?'] },
    { id: 'ipc', x: 640, y: 222, w: 236, h: 64, tone: 'tier', lines: ['private, loopback, link-local,', 'reserved, multicast,', 'unspecified ?'] },
    { id: 'dns', x: 350, y: 292, w: 200, h: 44, tone: 'plain', lines: ['`getaddrinfo, every record'] },
    { id: 'all', x: 350, y: 360, w: 200, h: 44, tone: 'tier', lines: ['ANY address forbidden ?'] },
    { id: 'block', x: 24, y: 222, w: 216, h: 76, tone: 'bad', lines: ['UnsafeURLError', 'Celery Reject(requeue=False)', 'no retry: the verdict is permanent'] },
    { id: 'ok', x: 350, y: 430, w: 200, h: 40, tone: 'good', lines: ['allow'] },
    { id: 'nav', x: 330, y: 496, w: 240, h: 48, tone: 'plain', lines: ["`page.route('**/*') intercepts", 'EVERY request, not just the first'] },
    { id: 'sub', x: 350, y: 568, w: 200, h: 44, tone: 'tier', lines: ['navigation request ?'] },
    { id: 'recheck', x: 24, y: 568, w: 216, h: 44, tone: 'good', lines: ['subresource:', 'validate, then continue'] },
    { id: 'walk', x: 610, y: 636, w: 266, h: 72, tone: 'plain', lines: ['`route.fetch(max_redirects=0)', 'walk each hop by hand', 're-validate before following', 'max 10 hops'] },
    { id: 'ok2', x: 350, y: 712, w: 200, h: 44, tone: 'good', lines: ['fulfill the final response'] },
    { id: 'block2', x: 610, y: 730, w: 266, h: 44, tone: 'bad', lines: ['hop rejected: UnsafeURLError'] },
];

interface Edge { from: Id; to: Id; d: string; label?: string; lx?: number; ly?: number }

const EDGES: Edge[] = [
    { from: 'u', to: 's', d: 'M 450 48 V 72' },
    { from: 's', to: 'block', d: 'M 350 94 H 300 V 250 H 240', label: 'no', lx: 306, ly: 90 },
    { from: 's', to: 'h', d: 'M 450 116 V 140', label: 'yes', lx: 456, ly: 132 },
    { from: 'h', to: 'block', d: 'M 316 169 H 296 V 274 H 240', label: 'yes', lx: 262, ly: 165 },
    { from: 'h', to: 'lit', d: 'M 450 198 V 222', label: 'no', lx: 456, ly: 214 },
    { from: 'lit', to: 'ipc', d: 'M 550 244 H 640', label: 'yes', lx: 578, ly: 238 },
    { from: 'lit', to: 'dns', d: 'M 450 266 V 292', label: 'no', lx: 456, ly: 284 },
    { from: 'dns', to: 'all', d: 'M 450 336 V 360' },
    { from: 'all', to: 'block', d: 'M 350 382 H 132 V 298', label: 'yes', lx: 300, ly: 376 },
    { from: 'all', to: 'ok', d: 'M 450 404 V 430', label: 'no', lx: 456, ly: 422 },
    { from: 'ipc', to: 'block', d: 'M 758 286 V 420 H 90 V 298', label: 'yes', lx: 764, ly: 306 },
    { from: 'ipc', to: 'ok', d: 'M 876 254 H 906 V 450 H 550', label: 'no', lx: 882, ly: 246 },
    { from: 'ok', to: 'nav', d: 'M 450 470 V 496' },
    { from: 'nav', to: 'sub', d: 'M 450 544 V 568' },
    { from: 'sub', to: 'recheck', d: 'M 350 590 H 240', label: 'no', lx: 286, ly: 584 },
    { from: 'sub', to: 'walk', d: 'M 550 590 H 580 V 672 H 610', label: 'yes', lx: 556, ly: 584 },
    { from: 'walk', to: 'ok2', d: 'M 610 690 H 592 V 734 H 550', label: 'every hop clean', lx: 598, ly: 724 },
    { from: 'walk', to: 'block2', d: 'M 800 708 V 730', label: 'a hop is forbidden', lx: 806, ly: 723 },
];

interface Probe {
    url: string;
    note: string;
    path: Id[];
    verdict: 'blocked' | 'allowed';
    why: string;
}

const PROBES: Probe[] = [
    {
        url: 'https://my-project.vercel.app',
        note: 'an ordinary student project',
        path: ['u', 's', 'h', 'lit', 'dns', 'all', 'ok', 'nav', 'sub', 'walk', 'ok2'],
        verdict: 'allowed',
        why: 'Public scheme, host not on the blocklist, no private records. It still loads through the interceptor, so every subresource is checked too.',
    },
    {
        url: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
        note: 'the EC2 instance metadata endpoint',
        path: ['u', 's', 'h', 'lit', 'ipc', 'block'],
        verdict: 'blocked',
        why: 'A literal link-local address. is_private alone would have missed it. Unblocked, this renders instance credentials into the public screenshot.',
    },
    {
        url: 'file:///app/.env',
        note: 'the container filesystem',
        path: ['u', 's', 'block'],
        verdict: 'blocked',
        why: 'Rejected on the scheme allowlist. It would have leaked the Anthropic and Supabase keys through the screenshot.',
    },
    {
        url: 'http://redis.minddoai.svc.cluster.local:6379',
        note: 'a cluster-internal service',
        path: ['u', 's', 'h', 'lit', 'dns', 'all', 'block'],
        verdict: 'blocked',
        why: 'Resolves to a private address. Without the check the worker is an internal port scanner with a screenshot as output.',
    },
    {
        url: 'https://looks-fine.example  302 ->  http://169.254.169.254/',
        note: 'a permitted host that redirects',
        path: ['u', 's', 'h', 'lit', 'dns', 'all', 'ok', 'nav', 'sub', 'walk', 'block2'],
        verdict: 'blocked',
        why: 'The first hop passes. Chromium follows redirects internally, so the guard walks the chain itself and validates before following each hop.',
    },
];

export default function SsrfGuard() {
    const [probe, setProbe] = useState<Probe | null>(null);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!probe) return;
        if (step >= probe.path.length) return;
        const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 120 : 380);
        return () => clearTimeout(t);
    }, [probe, step]);

    const walked = probe ? probe.path.slice(0, step) : [];
    const done = !!probe && step >= probe.path.length;
    const litNode = (id: Id) => (!probe ? true : walked.includes(id));
    const litEdge = (e: Edge) => {
        if (!probe) return true;
        const i = walked.indexOf(e.from);
        return i >= 0 && walked[i + 1] === e.to;
    };

    const run = (p: Probe) => { setProbe(p); setStep(0); };

    const controls = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {PROBES.map(p => {
                    const on = probe?.url === p.url;
                    return (
                        <button
                            key={p.url}
                            onClick={() => run(p)}
                            style={{
                                display: 'flex', alignItems: 'baseline', gap: 10, textAlign: 'left',
                                background: on ? T.surface : T.canvas,
                                border: `1px solid ${on ? T.ink : T.rule}`, borderRadius: 4,
                                padding: '7px 11px', cursor: 'pointer', width: '100%',
                            }}
                        >
                            <span style={{ fontFamily: MONO, fontSize: '0.76rem', color: on ? T.ink : T.body, wordBreak: 'break-all' }}>
                                {p.url}
                            </span>
                            <span style={{ fontFamily: FONT, fontSize: '0.72rem', color: T.faint, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                                {p.note}
                            </span>
                        </button>
                    );
                })}
            </div>
    );

    const panel = (
        <div style={{  minHeight: 84, fontFamily: FONT }}>
                {probe ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{
                                fontFamily: FONT, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase', padding: '3px 9px', borderRadius: 3,
                                color: probe.verdict === 'blocked' ? T.bad.text : T.good.text,
                                background: probe.verdict === 'blocked' ? T.bad.fill : T.good.fill,
                                border: `1px solid ${probe.verdict === 'blocked' ? T.bad.stroke : T.good.stroke}`,
                                opacity: done ? 1 : 0.35, transition: 'opacity .2s',
                            }}>
                                {probe.verdict}
                            </span>
                            <span style={{ fontFamily: MONO, fontSize: '0.76rem', color: T.muted }}>
                                {Math.min(step, probe.path.length)} / {probe.path.length} checks
                            </span>
                        </div>
                        <p style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.62 }}>{probe.why}</p>
                    </>
                ) : (
                    <p style={{ fontSize: '0.86rem', color: T.muted, lineHeight: 1.62 }}>
                        The pipeline loads an arbitrary URL in Chromium and publishes what it sees. On EC2 with an
                        instance profile, that is credential disclosure unless every destination is checked.
                    </p>
                )}
            </div>
    );

    return (
        <Figure
            label="Fig 5"
            title="SSRF guard: scheme, destination, and every redirect hop"
            minWidth={920}
            legend={[
                { tone: 'tier', text: 'decision' },
                { tone: 'bad', text: 'rejected' },
                { tone: 'good', text: 'allowed' },
            ]}
            caption="Pick a URL to trace it. These are the real outcomes; the checks run twice, at the API boundary and per navigation." controls={controls} panel={panel}
        >
            <svg viewBox="0 0 920 786"
                role="img"
                aria-label="The SSRF guard as a decision tree: scheme check, destination address check against private ranges, and the same two checks repeated on every redirect hop, with the blocked and allowed exits marked." style={{ width: '100%', display: 'block' }}>
                <Arrowheads />

                {EDGES.map((e, i) => {
                    const on = litEdge(e);
                    const bad = e.to === 'block' || e.to === 'block2';
                    const good = e.to === 'ok2' || e.to === 'recheck';
                    const stroke = !probe ? T.ruleStrong : on ? (bad ? T.bad.stroke : good ? T.good.stroke : T.accent) : T.rule;
                    return (
                        <g key={i} opacity={!probe || on ? 1 : 0.25} style={{ transition: 'opacity .2s' }}>
                            <path d={e.d} fill="none" stroke={stroke} strokeWidth={on && probe ? 2 : 1.2}
                                markerEnd={`url(#${!probe ? 'ah' : on ? (bad ? 'ah-bad' : good ? 'ah-good' : 'ah-on') : 'ah'})`} />
                            {e.label && (
                                <text x={e.lx} y={e.ly} style={{ fontFamily: FONT, fontSize: 10.6, fill: on && probe ? stroke : T.faint }}>
                                    {e.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {NODES.map(n => {
                    const tone = n.tone === 'plain' ? { fill: T.canvas, stroke: T.ruleStrong, text: T.ink } : T[n.tone];
                    const on = litNode(n.id);
                    const current = probe && walked[walked.length - 1] === n.id;
                    return (
                        <g key={n.id} opacity={on ? 1 : 0.22} style={{ transition: 'opacity .2s' }}>
                            <rect
                                x={n.x} y={n.y} width={n.w} height={n.h} rx={5}
                                fill={tone.fill} stroke={current ? T.ink : tone.stroke} strokeWidth={current ? 2.2 : 1.3}
                            />
                            {n.lines.map((l, i) => (
                                <text
                                    key={i}
                                    x={n.x + n.w / 2}
                                    y={n.y + (n.h - (n.lines.length - 1) * 12) / 2 + 4 + i * 12}
                                    textAnchor="middle"
                                    style={{
                                        fontFamily: l.startsWith('`') ? MONO : FONT,
                                        fontSize: l.startsWith('`') ? 9 : 10,
                                        fontWeight: i === 0 && n.lines.length > 1 ? 600 : 400,
                                        fill: tone.text,
                                    }}
                                >
                                    {l.startsWith('`') ? l.slice(1) : l}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </Figure>
    );
}
