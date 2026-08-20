'use client';

import { T, FONT, MONO, Tone, Arrowheads, useFocus, Figure } from './ui';

type Id = 'dev' | 'tr' | 'api' | 'wrk' | 'rds' | 'keda' | 'sec' | 'prof' | 's3' | 'sg' | 'bud' | 'supa';

interface Node { id: Id; x: number; y: number; w: number; h: number; tone: Tone; lines: string[]; detail: string }

/* ── Geometry ──────────────────────────────────────────────────────────────
 *
 * The drawing is laid out on channels, not on whatever gap happened to be
 * left over. Three frames nest — AWS, then the EC2 box, then the k3s
 * workloads — and every edge runs in one of five lanes between them:
 *
 *   y  52         above the AWS frame: the image arriving from the laptop
 *   y  88         between AWS and EC2: the API's read-through to S3
 *   y 192 / 204   between the two pod rows
 *   y 386         below everything: the hop out to Supabase
 *   x 184         the left channel        x 672 / 686 / 692  the right channel
 *
 * The previous version had no channels. Four edges were drawn straight
 * through boxes they had nothing to do with — the API-to-S3 read crossed the
 * worker deployment, the Redis-to-worker hop crossed KEDA and the secret, and
 * the Supabase line crossed both Traefik and the API — and two of the three
 * edge labels sat on top of nodes. It was legible only expanded and scrolled.
 * Nothing here is a box overlapping a box; the one line that crosses another
 * line is the worker's descent to the instance profile, which crosses the
 * Redis-to-worker lane once, square, as a schematic crossing should.
 */

const NODES: Node[] = [
    {
        id: 'dev', x: 16, y: 150, w: 156, h: 56, tone: 'extern', lines: ['MacBook', 'arm64'],
        detail: 'Cross-building linux/amd64 under emulation takes 30 to 45 minutes, so I did not use that path. I rsynced the tree up and built natively on the box instead: 7 min 46 s and nothing but source crossed the internet. The catch is that rsync ships whatever is on disk, and it delivered the gitignored k8s/secret.yaml, which COPY . . then baked into the image. .dockerignore covers it now.',
    },
    {
        id: 'tr', x: 258, y: 136, w: 116, h: 46, tone: 'store', lines: ['Traefik ingress', 'node port 80'],
        detail: 'Ships with k3s, so ingress matches the local k3d cluster.',
    },
    {
        id: 'api', x: 386, y: 136, w: 122, h: 46, tone: 'store', lines: ['Deployment api x2', '`imagePullPolicy: Never'],
        detail: 'The image is imported straight into containerd, so nothing pulls from a registry. These pods originally declared no resources at all, which made them BestEffort and therefore the first thing the node killed under memory pressure, even though the workers caused it.',
    },
    {
        id: 'wrk', x: 520, y: 136, w: 124, h: 46, tone: 'store', lines: ['Deployment worker', '1 to 4, KEDA'],
        detail: 'Memory binds, not CPU: each slot holds a Chromium plus an x264 encode. The ceiling went 8, then 6, then 4. Eight would not schedule; six scheduled and then got OOM killed, because the scheduler admits pods on requests while the kernel kills on usage.',
    },
    {
        id: 'rds', x: 258, y: 216, w: 116, h: 46, tone: 'store', lines: ['Redis pod', 'broker + counters'],
        detail: 'Self-hosted rather than ElastiCache, which starts near $15 a month.',
    },
    {
        id: 'keda', x: 386, y: 216, w: 122, h: 46, tone: 'store', lines: ['KEDA', 'installed via Helm'],
        detail: 'Polls the queue every 5 s and writes the replica count to a managed HPA.',
    },
    {
        id: 'sec', x: 520, y: 216, w: 124, h: 46, tone: 'store', lines: ['Secret app-secrets', 'created imperatively'],
        detail: 'Created with kubectl rather than kustomize, so apply -k can never clobber it. The cluster generates its own ADMIN_API_TOKEN, which differs from the one in my local .env, so a token leaked off my laptop does not unlock the cluster. An early commit did add five real values to git: I rotated everything, migrated Supabase to a new project, rewrote history, and verified by fingerprint that no current value matches a leaked one.',
    },
    {
        id: 'prof', x: 252, y: 302, w: 398, h: 44, tone: 'tier', lines: ['IAM instance profile', '`s3:PutObject / GetObject on one bucket ARN'],
        detail: 'No AWS keys in the pod: boto3 uses the instance profile, which is exactly why the metadata endpoint had to be blocked first.',
    },
    {
        id: 's3', x: 706, y: 100, w: 190, h: 60, tone: 'tier', lines: ['S3 bucket', 'minddoai-showcases', 'block public access ON'],
        detail: 'Served through the API rather than public bucket URLs, so visibility stays under application control.',
    },
    {
        id: 'sg', x: 706, y: 190, w: 190, h: 60, tone: 'tier', lines: ['Security group', 'tcp/80 open', 'tcp/22 my IP only'],
        detail: 'Two rules, one scoped to a single address. The k3s API server is never exposed.',
    },
    {
        id: 'bud', x: 706, y: 286, w: 190, h: 48, tone: 'tier', lines: ['Budgets alarm', '$5 threshold'],
        detail: 'Leaving a system running costs about $4 to $5 for a weekend.',
    },
    {
        id: 'supa', x: 16, y: 300, w: 156, h: 56, tone: 'extern', lines: ['Supabase', 'hosted Postgres', 'outside AWS'],
        detail: 'Supabase gives me managed Postgres, auth and row-level security, none of which I want to be running myself at this size. The trade is a network hop on every read and being coupled to auth.users.',
    },
];

const N = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<Id, Node>;

const EDGES: { from: Id; to: Id; d: string; label?: string; lx?: number; ly?: number; dash?: boolean }[] = [
    // Above the AWS frame: the image is built on the box, so it arrives from outside.
    { from: 'dev', to: 'api', d: 'M 172 178 H 184 V 52 H 460 V 136', label: 'docker save, piped over ssh into containerd', lx: 228, ly: 46 },
    { from: 'tr', to: 'api', d: 'M 374 159 H 386' },
    // Between AWS and EC2, over the top of the worker rather than through it.
    { from: 'api', to: 's3', d: 'M 490 136 V 88 H 686 V 146 H 706', label: 'GetObject on local miss', lx: 500, ly: 82 },
    // The two lanes between the pod rows.
    { from: 'api', to: 'rds', d: 'M 420 182 V 192 H 300 V 216' },
    { from: 'rds', to: 'wrk', d: 'M 340 216 V 204 H 570 V 182' },
    { from: 'keda', to: 'rds', d: 'M 386 239 H 374', dash: true },
    // Down the gap between the two pod columns, past the secret rather than across it.
    { from: 'wrk', to: 'prof', d: 'M 530 182 V 192 H 514 V 302', label: 'no keys in the pod', lx: 522, ly: 292 },
    { from: 'prof', to: 's3', d: 'M 650 324 H 672 V 122 H 706' },
    // Supabase is outside AWS, so the hop to it is drawn leaving the frame.
    { from: 'wrk', to: 'supa', d: 'M 644 170 H 692 V 386 H 90 V 356', dash: true },
];

export default function AwsPlan() {
    const { active, bind, setPinned } = useFocus<Id>();
    const sel = active ? N[active] : null;

    const panel = (
        <div style={{  minHeight: 62, fontFamily: FONT }}>
                <p style={{ fontSize: '0.86rem', color: sel ? T.body : T.muted, lineHeight: 1.62 }}>
                    {sel
                        ? sel.detail
                        : 'This is running. I skipped EKS because the control plane alone is $73 a month before a single pod runs, and single-node k3s gives me the same kubectl apply -k workflow for the price of the instance. ECR went the same way: k3s has no credential provider for it, so pulling images means juggling a 12 hour token that something has to keep refreshing.'}
                </p>
            </div>
    );

    return (
        <Figure
            label="Fig 7"
            title="AWS topology, deployed 16 August 2026"
            minWidth={920}
            legend={[
                { tone: 'store', text: 'in-cluster workload' },
                { tone: 'tier', text: 'AWS resource' },
                { tone: 'extern', text: 'outside AWS' },
            ]}
            caption="This is what was deployed. The 20-job load test in section 09 ran against this cluster; the 102.7 s single-job baseline is still a docker compose number." panel={panel}
        >
            <svg viewBox="0 0 920 400"
                role="img"
                aria-label="AWS topology in a single region: the EC2 instance running k3s with the API and worker pods, alongside the managed Postgres and S3, and what sits inside versus outside the VPC." style={{ width: '100%', display: 'block' }} onClick={() => setPinned(null)}>
                <Arrowheads />

                <rect x={196} y={64} width={716} height={312} fill="none" stroke={T.ruleStrong} strokeWidth={1.3} strokeDasharray="5 4" />
                <text x={206} y={80} style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 600, fill: T.muted }}>AWS, single region</text>

                <rect x={240} y={96} width={424} height={264} fill={T.surface} stroke={T.rule} strokeWidth={1.2} />
                <text x={250} y={112} style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, fill: T.muted }}>
                    EC2 t3.large: 2 vCPU, 8 GiB, 30 GB gp3
                </text>

                <rect x={250} y={120} width={402} height={154} fill="none" stroke={T.rule} strokeWidth={1.2} strokeDasharray="3 3" />

                {EDGES.map((e, i) => {
                    const on = !!active && (e.from === active || e.to === active);
                    const lit = !active || on;
                    return (
                        <g key={i} opacity={lit ? 1 : 0.14} style={{ transition: 'opacity .18s' }}>
                            <path d={e.d} fill="none" stroke={on ? T.accent : T.ruleStrong} strokeWidth={on ? 1.9 : 1.2}
                                strokeDasharray={e.dash ? '4 4' : undefined} markerEnd={`url(#${on ? 'ah-on' : 'ah'})`} />
                            {e.label && (
                                <text x={e.lx} y={e.ly} style={{ fontFamily: FONT, fontSize: 10.4, fill: on ? T.accent : T.faint }}>{e.label}</text>
                            )}
                        </g>
                    );
                })}

                {NODES.map(n => {
                    const tone = T[n.tone];
                    const on = !active || active === n.id
                        || EDGES.some(e => (e.from === active && e.to === n.id) || (e.to === active && e.from === n.id));
                    return (
                        <g key={n.id} {...bind(n.id, n.lines[0])} opacity={on ? 1 : 0.24} style={{ ...bind(n.id, n.lines[0]).style, transition: 'opacity .18s' }}>
                            <rect x={n.x} y={n.y} width={n.w} height={n.h} fill={tone.fill} stroke={active === n.id ? T.ink : tone.stroke} strokeWidth={active === n.id ? 2 : 1.2} />
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
