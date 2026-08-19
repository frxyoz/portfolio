'use client';

import { T, FONT, MONO, Tone, Arrowheads, useFocus, Figure } from './ui';

type Id =
    | 'ui' | 'sbjs' | 'traefik' | 'fapi' | 'rl' | 'aa' | 'ug1' | 'allow' | 'probe'
    | 'redis' | 'celery' | 'pipe' | 'chrome' | 'ffmpeg' | 'ug2'
    | 's3' | 'pg' | 'disk' | 'claude' | 'edge' | 'student';

interface Spec {
    id: Id;
    tone: Tone;
    title: string;
    /** Backtick prefix renders the line in the mono face. */
    sub: string[];
    detail: string[];
}

/* Box geometry is derived from the content: one title line plus n sub lines.
   Nothing is positioned by hand vertically, so text can never outgrow its box. */
const TITLE_Y = 22;
const SUB_Y = 40;
const SUB_LH = 15;
const PAD_B = 12;
const boxH = (n: number) => SUB_Y + Math.max(0, n - 1) * SUB_LH + PAD_B;

interface Column { x: number; w: number; top: number; gap: number; ids: Id[] }

const COLUMNS: Record<string, Column> = {
    client: { x: 20, w: 225, top: 120, gap: 22, ids: ['ui', 'traefik', 'sbjs'] },
    api: { x: 300, w: 230, top: 106, gap: 8, ids: ['fapi', 'rl', 'aa', 'ug1', 'allow', 'probe'] },
    broker: { x: 586, w: 170, top: 230, gap: 8, ids: ['redis'] },
    worker: { x: 812, w: 230, top: 106, gap: 8, ids: ['celery', 'pipe', 'chrome', 'ffmpeg', 'ug2'] },
    data: { x: 1150, w: 240, top: 106, gap: 14, ids: ['s3', 'pg', 'disk'] },
    external: { x: 1150, w: 240, top: 380, gap: 14, ids: ['claude', 'edge', 'student'] },
};

const SPECS: Spec[] = [
    {
        id: 'ui', tone: 'tier', title: 'Browser',
        sub: ['React 18.3.1 via CDN', 'Babel transpiles at runtime', 'hash routes'],
        detail: [
            'No build step: FastAPI serves index.html and 14 JSX files directly.',
            'Polls showcase.json every 2.5 s while a job runs.',
        ],
    },
    {
        id: 'sbjs', tone: 'tier', title: 'supabase-js 2.112.2',
        sub: ['pinned + SRI', 'publishable key only'],
        detail: [
            'Reads the gallery through row-level security with a publishable key.',
            'Pinned to an exact version so it could carry an SRI hash.',
        ],
    },
    {
        id: 'traefik', tone: 'tier', title: 'Traefik',
        sub: ['k3s default ingress', 'port 80 to api:8000'],
        detail: [
            'Ships with k3s, so ingress needed no extra component.',
            'Appends the peer address to X-Forwarded-For, which the rate limiter relies on.',
        ],
    },
    {
        id: 'fapi', tone: 'tier', title: 'FastAPI + uvicorn',
        sub: ['`main.py, 15 routes'],
        detail: [
            'Returns 202 with a submission_id in about 5 ms.',
            'Serves assets from local disk, falling back to S3.',
        ],
    },
    {
        id: 'rl', tone: 'tier', title: 'ratelimit.py',
        sub: ['fixed window in Redis', '5/hr generate, 2/hr sync'],
        detail: [
            'Counters in Redis, not process memory: two replicas would double the effective limit.',
            'Fails closed, and trusts only the X-Forwarded-For entry the proxy wrote.',
        ],
    },
    {
        id: 'aa', tone: 'tier', title: 'adminauth.py',
        sub: ['shared secret', '`hmac.compare_digest'],
        detail: [
            'Constant-time comparison, so a wrong token leaks no prefix.',
            'An unset token returns 503, never an open door.',
        ],
    },
    {
        id: 'ug1', tone: 'tier', title: 'urlguard.py',
        sub: ['Pydantic field_validator', 'first of two checks'],
        detail: [
            'Rejects unsafe URLs before they reach the queue.',
            'Repeated in the worker, because DNS can change while a job waits.',
        ],
    },
    {
        id: 'allow', tone: 'tier', title: 'static allowlist',
        sub: ['`index.html, *.jsx, /assets'],
        detail: [
            'Replaced a StaticFiles mount on the repo root that served .env.',
            'Asset paths are charset-checked and containment-checked.',
        ],
    },
    {
        id: 'probe', tone: 'tier', title: 'health probes',
        sub: ['`/health/live: process only', '`/health: checks broker'],
        detail: [
            'Liveness touches no dependency, so a Redis blip cannot restart every replica.',
            'Readiness fails on an unreachable broker and leaves the Service.',
        ],
    },
    {
        id: 'redis', tone: 'store', title: 'Redis 7',
        sub: ["list 'celery' = queue", 'result backend', 'rate-limit counters'],
        detail: [
            'Chosen because KEDA reads the exact list Celery writes.',
            'Not durable: no AOF, so a pod restart loses the queue.',
        ],
    },
    {
        id: 'celery', tone: 'tier', title: 'Celery worker',
        sub: ['`--concurrency=1', 'acks_late, prefetch 1', 'soft 600 s / hard 720 s'],
        detail: [
            'Scales 1 to 4 on queue depth, independently of the API.',
            'Late acks plus a 660 s grace period make scale-down a warm drain.',
        ],
    },
    {
        id: 'pipe', tone: 'tier', title: 'pipeline.py',
        sub: ['7 sequential steps', 'per-step timing'],
        detail: [
            'Steps degrade rather than fail; only capture and AI are fatal.',
            'The real chain is capture, AI, video. Demo and QR need only the URL.',
        ],
    },
    {
        id: 'chrome', tone: 'tier', title: 'Chromium (Playwright)',
        sub: ['`--no-sandbox', 'two launches per job'],
        detail: [
            'One dependency covers screenshots, page text, video and the PDF flyer.',
            'Two cold starts per job: reusing one browser is a ranked win.',
        ],
    },
    {
        id: 'ffmpeg', tone: 'tier', title: 'ffmpeg',
        sub: ['libx264 crf 26', 'preset medium'],
        detail: [
            'Loops the demo to narration length, music bed at 6%.',
            'Runs once per language. Preset veryfast is the pending win.',
        ],
    },
    {
        id: 'ug2', tone: 'tier', title: 'urlguard re-check',
        sub: ['per navigation', 'per redirect hop'],
        detail: [
            'Chromium follows redirects internally, so hops are walked by hand.',
            'Re-resolving each hop closes the DNS rebinding window.',
        ],
    },
    {
        id: 's3', tone: 'store', title: 'S3 / MinIO',
        sub: ['bucket minddoai-showcases', '`{submission_id}/{asset}'],
        detail: [
            'Eleven assets per showcase, 20 to 40 MB.',
            'MinIO speaks the same API, so only the endpoint URL changes.',
        ],
    },
    {
        id: 'pg', tone: 'store', title: 'Supabase Postgres',
        sub: ['showcases, profiles,', 'students, courses', 'row-level security'],
        detail: [
            'Row-level security is the authorization boundary, not application code.',
            'Verified live: anon sees 4 of 6 showcases, nothing from profiles.',
        ],
    },
    {
        id: 'disk', tone: 'store', title: 'worker local disk',
        sub: ['`showcases/{id}/ scratch', 'pruned after upload'],
        detail: [
            'Worked in compose, broke in Kubernetes: separate filesystems.',
            'Pruned after upload, or load tests fill the node.',
        ],
    },
    {
        id: 'claude', tone: 'extern', title: 'Anthropic API',
        sub: ['`claude-sonnet-4-6', '`max_tokens 2048'],
        detail: [
            'One call returns 14 fields, English and Mandarin.',
            'A cache hit skips it, which is the whole per showcase cost.',
        ],
    },
    {
        id: 'edge', tone: 'extern', title: 'edge-tts',
        sub: ['`en-US-AriaNeural', '`zh-CN-XiaoxiaoNeural', 'no key, no cost'],
        detail: [
            'Replaced OpenAI TTS: half the cost, one less credential.',
            'Undocumented endpoint. Failure is non-fatal; zero bytes counts as failure.',
        ],
    },
    {
        id: 'student', tone: 'extern', title: 'Student project URL',
        sub: ['arbitrary public site', 'untrusted input'],
        detail: [
            'Attacker-controlled input, loaded in a browser and then published.',
            'That one fact drives the SSRF guard and the redirect walking.',
        ],
    },
];

interface Node extends Spec { x: number; y: number; w: number; h: number }

/* Stack each column top down; every box is exactly as tall as its content. */
const N: Record<Id, Node> = (() => {
    const byId = Object.fromEntries(SPECS.map(s => [s.id, s])) as Record<Id, Spec>;
    const out = {} as Record<Id, Node>;
    for (const col of Object.values(COLUMNS)) {
        let y = col.top;
        for (const id of col.ids) {
            const spec = byId[id];
            const h = boxH(spec.sub.length);
            out[id] = { ...spec, x: col.x, y, w: col.w, h };
            y += h + col.gap;
        }
    }
    return out;
})();

const NODES = Object.values(N);
const bottomOf = (ids: Id[]) => Math.max(...ids.map(id => N[id].y + N[id].h));

const GROUPS = [
    {
        label: 'API tier', note: 'Deployment api, 2 replicas',
        x: COLUMNS.api.x - 14, y: 64, w: COLUMNS.api.w + 28,
        h: bottomOf(COLUMNS.api.ids) + 16 - 64,
    },
    {
        label: 'Worker tier', note: 'Deployment worker, KEDA 1 to 4',
        x: COLUMNS.worker.x - 14, y: 64, w: COLUMNS.worker.w + 28,
        h: bottomOf(COLUMNS.worker.ids) + 16 - 64,
    },
];

const HEIGHT = bottomOf(['probe', 'student', 'ug2']) + 64;

/* ── Edges, all derived from the boxes above ─────────────────────────────── */

type Route =
    | { kind: 'hv'; mx?: number }                 // right edge, vertical run at mx, into the left edge
    | { kind: 'v' }                               // bottom edge into top edge
    | { kind: 'toTop'; mx: number }               // right edge, around, into the target top
    | { kind: 'over'; y: number; mx: number }     // out of the top, across, into the target top
    | { kind: 'under'; y: number; mx: number };   // out of the bottom, across, into the left edge

interface Edge { id: string; from: Id; to: Id; route: Route; label?: string; dash?: boolean }

const EDGES: Edge[] = [
    { id: 'e1', from: 'ui', to: 'traefik', route: { kind: 'v' }, label: 'POST, then poll' },
    { id: 'e2', from: 'traefik', to: 'fapi', route: { kind: 'hv' } },
    { id: 'e3', from: 'fapi', to: 'rl', route: { kind: 'v' } },
    { id: 'e4', from: 'rl', to: 'redis', route: { kind: 'hv', mx: 556 }, label: 'INCR' },
    { id: 'e5', from: 'fapi', to: 'redis', route: { kind: 'toTop', mx: 550 }, label: 'delay()' },
    { id: 'e6', from: 'redis', to: 'celery', route: { kind: 'hv', mx: 784 }, label: 'BRPOP' },
    { id: 'e7', from: 'celery', to: 'pipe', route: { kind: 'v' } },
    { id: 'e8', from: 'pipe', to: 'chrome', route: { kind: 'v' } },
    { id: 'e9', from: 'chrome', to: 'ffmpeg', route: { kind: 'v' } },
    { id: 'e10', from: 'ffmpeg', to: 'ug2', route: { kind: 'v' } },
    { id: 'e11', from: 'celery', to: 's3', route: { kind: 'hv', mx: 1070 }, label: 'upload 11' },
    { id: 'e12', from: 'pipe', to: 'pg', route: { kind: 'hv', mx: 1090 }, label: 'upsert, cache' },
    { id: 'e13', from: 'pipe', to: 'disk', route: { kind: 'hv', mx: 1062 }, dash: true },
    { id: 'e14', from: 'pipe', to: 'claude', route: { kind: 'hv', mx: 1110 } },
    { id: 'e15', from: 'pipe', to: 'edge', route: { kind: 'hv', mx: 1054 } },
    { id: 'e16', from: 'ug2', to: 'student', route: { kind: 'hv', mx: 1078 }, label: 'per hop' },
    { id: 'e17', from: 'fapi', to: 's3', route: { kind: 'over', y: 40, mx: 1270 }, label: 'asset read: disk, then S3', dash: true },
    { id: 'e18', from: 'sbjs', to: 'pg', route: { kind: 'under', y: 0, mx: 1130 }, label: 'anon SELECT, RLS filtered', dash: true },
];

// The 'under' route needs the diagram height, which is only known once the boxes are laid out.
EDGES.forEach(e => { if (e.route.kind === 'under') e.route.y = HEIGHT - 34; });

function pathOf(e: Edge) {
    const a = N[e.from], b = N[e.to];
    const ar = a.x + a.w, ac = a.y + a.h / 2;
    const bl = b.x, bc = b.y + b.h / 2;
    switch (e.route.kind) {
        case 'v':
            return `M ${a.x + a.w / 2} ${a.y + a.h} V ${b.y}`;
        case 'hv': {
            const mx = e.route.mx ?? ar + (bl - ar) / 2;
            return `M ${ar} ${ac} H ${mx} V ${bc} H ${bl}`;
        }
        case 'toTop':
            return `M ${ar} ${ac} H ${e.route.mx} V ${b.y - 18} H ${b.x + b.w / 2} V ${b.y}`;
        case 'over':
            return `M ${a.x + a.w / 2} ${a.y} V ${e.route.y} H ${e.route.mx} V ${b.y}`;
        case 'under':
            return `M ${a.x + a.w / 2} ${a.y + a.h} V ${e.route.y} H ${e.route.mx} V ${bc} H ${bl}`;
    }
}

/** Label sits just above the first run of the path. */
function labelPos(e: Edge) {
    const a = N[e.from];
    switch (e.route.kind) {
        case 'v':
            return { x: a.x + a.w / 2 + 6, y: a.y + a.h + 12, anchor: 'start' as const };
        case 'hv':
            // Start at the source edge rather than centring: a centred label would
            // extend back over the source box, which paints on top of the edges.
            return { x: a.x + a.w + 5, y: a.y + a.h / 2 - 6, anchor: 'start' as const };
        case 'toTop':
            return { x: a.x + a.w + 8, y: a.y + a.h / 2 - 6, anchor: 'start' as const };
        case 'over':
            return { x: a.x + a.w / 2 + 10, y: e.route.y - 6, anchor: 'start' as const };
        case 'under':
            return { x: a.x + a.w / 2 + 10, y: e.route.y - 7, anchor: 'start' as const };
    }
}

export default function Architecture() {
    const { active, pinned, bind, setPinned } = useFocus<Id>();
    const sel = active ? N[active] : null;

    const edgeLit = (e: Edge) => !active || e.from === active || e.to === active;
    const nodeLit = (id: Id) =>
        !active || id === active ||
        EDGES.some(e => (e.from === active && e.to === id) || (e.to === active && e.from === id));

    const panel = (
        <div style={{ minHeight: 84, fontFamily: FONT }}>
            {sel ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: T[sel.tone].fill, border: `1px solid ${T[sel.tone].stroke}` }} />
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: T.ink }}>{sel.title}</span>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
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
                    The API and the worker scale on different signals: request rate against queue depth.
                    Separate deployments are what make each knob independent.
                </p>
            )}
        </div>
    );

    return (
        <Figure
            label="Fig 1"
            title="System architecture"
            minWidth={1200}
            legend={[
                { tone: 'tier', text: 'compute tier' },
                { tone: 'store', text: 'persistence' },
                { tone: 'extern', text: 'external service' },
            ]}
            caption="Hover a component to isolate its connections. Click to pin."
            panel={panel}
        >
            <svg viewBox={`0 0 1420 ${HEIGHT}`}
                role="img"
                aria-label="System architecture: the browser and API tier, the Redis broker, the Celery worker pool, and the Postgres and S3 stores, with the request and job paths drawn between them." style={{ width: '100%', display: 'block' }} onClick={() => setPinned(null)}>
                <Arrowheads />

                {GROUPS.map(g => (
                    <g key={g.label}>
                        <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={7} fill="none" stroke={T.rule} strokeWidth={1.4} strokeDasharray="4 4" />
                        <text x={g.x + 10} y={g.y + 18} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, fill: T.muted }}>{g.label}</text>
                        <text x={g.x + 10} y={g.y + 32} style={{ fontFamily: MONO, fontSize: 12.6, fill: T.faint }}>{g.note}</text>
                    </g>
                ))}

                {EDGES.map(e => {
                    const lit = edgeLit(e);
                    const on = !!active && lit;
                    const lp = labelPos(e);
                    return (
                        <g key={e.id} opacity={lit ? 1 : 0.12} style={{ transition: 'opacity .18s' }}>
                            <path
                                d={pathOf(e)}
                                fill="none"
                                stroke={on ? T.accent : T.ruleStrong}
                                strokeWidth={on ? 1.9 : 1.3}
                                strokeDasharray={e.dash ? '5 4' : undefined}
                                markerEnd={`url(#${on ? 'ah-on' : 'ah'})`}
                            />
                            {e.label && (() => {
                                const w = e.label.length * 5.4 + 8;
                                const x = lp.x - 4;
                                return (
                                    <>
                                        <rect x={x} y={lp.y - 9} width={w} height={12} fill="#fff" opacity={0.92} rx={2} />
                                        <text
                                            x={lp.x} y={lp.y} textAnchor={lp.anchor}
                                            style={{ fontFamily: FONT, fontSize: 12.6, fontWeight: on ? 600 : 400, fill: on ? T.accent : T.muted }}
                                        >
                                            {e.label}
                                        </text>
                                    </>
                                );
                            })()}
                        </g>
                    );
                })}

                {NODES.map(n => {
                    const tone = T[n.tone];
                    const lit = nodeLit(n.id);
                    const isSel = active === n.id;
                    return (
                        <g key={n.id} {...bind(n.id, n.title)} opacity={lit ? 1 : 0.22} style={{ ...bind(n.id, n.title).style, transition: 'opacity .18s' }}>
                            <rect
                                x={n.x} y={n.y} width={n.w} height={n.h} rx={5}
                                fill={tone.fill}
                                stroke={isSel ? T.ink : tone.stroke}
                                strokeWidth={isSel ? 2 : 1.3}
                            />
                            {pinned === n.id && (
                                <rect x={n.x - 3} y={n.y - 3} width={n.w + 6} height={n.h + 6} rx={7} fill="none" stroke={T.ink} strokeWidth={1} strokeDasharray="3 3" />
                            )}
                            <text x={n.x + 11} y={n.y + TITLE_Y} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, fill: tone.text }}>
                                {n.title}
                            </text>
                            {n.sub.map((s, i) => (
                                <text
                                    key={i}
                                    x={n.x + 11}
                                    y={n.y + SUB_Y + i * SUB_LH}
                                    style={{ fontFamily: s.startsWith('`') ? MONO : FONT, fontSize: s.startsWith('`') ? 12.2 : 12.6, fill: tone.text, opacity: 0.92 }}
                                >
                                    {s.startsWith('`') ? s.slice(1) : s}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </Figure>
    );
}
