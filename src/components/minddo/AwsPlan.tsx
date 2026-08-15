'use client';

import { T, FONT, MONO, Tone, Arrowheads, useFocus, Figure } from './ui';

type Id = 'dev' | 'tr' | 'api' | 'wrk' | 'rds' | 'keda' | 'sec' | 'prof' | 's3' | 'sg' | 'bud' | 'supa';

interface Node { id: Id; x: number; y: number; w: number; h: number; tone: Tone; lines: string[]; detail: string }

const NODES: Node[] = [
    {
        id: 'dev', x: 16, y: 150, w: 156, h: 56, tone: 'extern', lines: ['MacBook', 'arm64'],
        detail: 'Cross-building linux/amd64 under emulation takes 30 to 45 minutes. The build script asserts the image architecture rather than trusting it.',
    },
    {
        id: 'tr', x: 258, y: 126, w: 116, h: 46, tone: 'store', lines: ['Traefik ingress', 'node port 80'],
        detail: 'Ships with k3s, so ingress matches the local k3d cluster.',
    },
    {
        id: 'api', x: 386, y: 126, w: 122, h: 46, tone: 'store', lines: ['Deployment api x2', '`imagePullPolicy: Never'],
        detail: 'The image is imported straight into containerd, so nothing pulls from a registry.',
    },
    {
        id: 'wrk', x: 520, y: 126, w: 124, h: 46, tone: 'store', lines: ['Deployment worker', '1 to 8, KEDA'],
        detail: 'Memory binds, not CPU: each slot holds a Chromium plus an x264 encode. t3.small would OOM under one worker, two API replicas, Redis and the control plane.',
    },
    {
        id: 'rds', x: 258, y: 190, w: 116, h: 46, tone: 'store', lines: ['Redis pod', 'broker + counters'],
        detail: 'Self-hosted rather than ElastiCache, which starts near $15 a month.',
    },
    {
        id: 'keda', x: 386, y: 190, w: 122, h: 46, tone: 'store', lines: ['KEDA', 'installed via Helm'],
        detail: 'Polls the queue every 5 s and writes the replica count to a managed HPA.',
    },
    {
        id: 'sec', x: 520, y: 190, w: 124, h: 46, tone: 'store', lines: ['Secret app-secrets', 'four values'],
        detail: 'An early commit added five real values. Response: rotate everything, migrate Supabase to a new project, rewrite history, and verify by fingerprint that no current value matches a leaked one.',
    },
    {
        id: 'prof', x: 246, y: 264, w: 398, h: 44, tone: 'tier', lines: ['IAM instance profile', '`s3:PutObject / GetObject on one bucket ARN'],
        detail: 'No AWS keys in the pod: boto3 uses the instance profile, which is exactly why the metadata endpoint had to be blocked first.',
    },
    {
        id: 's3', x: 706, y: 96, w: 190, h: 60, tone: 'tier', lines: ['S3 bucket', 'minddoai-showcases', 'block public access ON'],
        detail: 'Served through the API rather than public bucket URLs, so visibility stays under application control.',
    },
    {
        id: 'sg', x: 706, y: 178, w: 190, h: 60, tone: 'tier', lines: ['Security group', 'tcp/80 open', 'tcp/22 my IP only'],
        detail: 'Two rules, one scoped to a single address. The k3s API server is never exposed.',
    },
    {
        id: 'bud', x: 706, y: 260, w: 190, h: 48, tone: 'tier', lines: ['Budgets alarm', '$10 threshold'],
        detail: 'A weekend left running is roughly $4 to $5, under $1 if scaled to hours worked. The alarm is the difference between noticing and not.',
    },
    {
        id: 'supa', x: 16, y: 264, w: 156, h: 56, tone: 'extern', lines: ['Supabase', 'hosted Postgres', 'outside AWS'],
        detail: 'Managed Postgres, auth and RLS, none worth operating at this size. Costs a network hop per read and coupling to auth.users.',
    },
];

const N = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<Id, Node>;

const EDGES: { from: Id; to: Id; d: string; label?: string; lx?: number; ly?: number; dash?: boolean }[] = [
    { from: 'dev', to: 'api', d: 'M 172 178 H 210 V 60 H 400 V 126', label: 'docker save, piped over ssh into containerd', lx: 216, ly: 52 },
    { from: 'tr', to: 'api', d: 'M 374 149 H 386' },
    { from: 'api', to: 'rds', d: 'M 400 172 V 182 H 330 V 190' },
    { from: 'rds', to: 'wrk', d: 'M 374 205 H 396 V 214 H 560 V 172' },
    { from: 'keda', to: 'rds', d: 'M 386 213 H 374', dash: true },
    { from: 'wrk', to: 'prof', d: 'M 582 172 V 264', label: 'no keys in the pod', lx: 588, ly: 220 },
    { from: 'prof', to: 's3', d: 'M 644 286 H 676 V 126 H 706' },
    { from: 'api', to: 's3', d: 'M 508 140 H 668 V 116 H 706', label: 'GetObject on local miss', lx: 512, ly: 134 },
    { from: 'wrk', to: 'supa', d: 'M 520 160 H 200 V 292 H 172', dash: true },
];

export default function AwsPlan() {
    const { active, bind, setPinned } = useFocus<Id>();
    const sel = active ? N[active] : null;

    const panel = (
        <div style={{  minHeight: 62, fontFamily: FONT }}>
                <p style={{ fontSize: '0.86rem', color: sel ? T.body : T.muted, lineHeight: 1.62 }}>
                    {sel
                        ? sel.detail
                        : 'Not EKS: $73 a month for the control plane before a single pod runs, and single-node k3s gives the same workflow. Not ECR: k3s has no credential provider, so pulling needs a 12 hour token that has to be refreshed.'}
                </p>
            </div>
    );

    return (
        <Figure
            label="Fig 7"
            title="AWS target topology (designed, not yet executed)"
            minWidth={900}
            legend={[
                { tone: 'store', text: 'in-cluster workload' },
                { tone: 'tier', text: 'AWS resource' },
                { tone: 'extern', text: 'outside AWS' },
            ]}
            caption="Nothing has been provisioned. The manifests target this topology; every number on this page was measured on docker compose and k3d." panel={panel}
        >
            <svg viewBox="0 0 920 350" style={{ width: '100%', display: 'block' }} onClick={() => setPinned(null)}>
                <Arrowheads />

                <rect x={196} y={72} width={716} height={264} rx={8} fill="none" stroke={T.ruleStrong} strokeWidth={1.3} strokeDasharray="5 4" />
                <text x={206} y={88} style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 600, fill: T.muted }}>AWS, single region</text>

                <rect x={234} y={104} width={424} height={222} rx={7} fill={T.surface} stroke={T.rule} strokeWidth={1.2} />
                <text x={244} y={120} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, fill: T.muted }}>
                    EC2 t3.large: 2 vCPU, 8 GiB, 30 GB gp3
                </text>

                <rect x={246} y={116} width={400} height={132} rx={6} fill="none" stroke={T.rule} strokeWidth={1.2} strokeDasharray="3 3" />

                {EDGES.map((e, i) => {
                    const on = !!active && (e.from === active || e.to === active);
                    const lit = !active || on;
                    return (
                        <g key={i} opacity={lit ? 1 : 0.14} style={{ transition: 'opacity .18s' }}>
                            <path d={e.d} fill="none" stroke={on ? T.accent : T.ruleStrong} strokeWidth={on ? 1.9 : 1.2}
                                strokeDasharray={e.dash ? '4 4' : undefined} markerEnd={`url(#${on ? 'ah-on' : 'ah'})`} />
                            {e.label && (
                                <text x={e.lx} y={e.ly} style={{ fontFamily: FONT, fontSize: 8.8, fill: on ? T.accent : T.faint }}>{e.label}</text>
                            )}
                        </g>
                    );
                })}

                {NODES.map(n => {
                    const tone = T[n.tone];
                    const on = !active || active === n.id
                        || EDGES.some(e => (e.from === active && e.to === n.id) || (e.to === active && e.from === n.id));
                    return (
                        <g key={n.id} {...bind(n.id)} opacity={on ? 1 : 0.24} style={{ ...bind(n.id).style, transition: 'opacity .18s' }}>
                            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={5} fill={tone.fill} stroke={active === n.id ? T.ink : tone.stroke} strokeWidth={active === n.id ? 2 : 1.2} />
                            {n.lines.map((l, i) => (
                                <text
                                    key={i}
                                    x={n.x + n.w / 2}
                                    y={n.y + (n.h - (n.lines.length - 1) * 12) / 2 + 4 + i * 12}
                                    textAnchor="middle"
                                    style={{
                                        fontFamily: l.startsWith('`') ? MONO : FONT,
                                        fontSize: l.startsWith('`') ? 8.6 : 9.6,
                                        fontWeight: i === 0 ? 600 : 400,
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
