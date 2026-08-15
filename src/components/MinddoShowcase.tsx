'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { T, FONT, MONO, H2, H3, P, C, Lede, Note, Table } from './minddo/ui';
import Architecture from './minddo/Architecture';
import Lifecycle from './minddo/Lifecycle';
import Pipeline from './minddo/Pipeline';
import Scaling from './minddo/Scaling';
import DataModel from './minddo/DataModel';
import SsrfGuard from './minddo/SsrfGuard';
import AwsPlan from './minddo/AwsPlan';
import {
    minddo, metrics, artifacts, security, residualRisks,
    reliability, cost, wins, limitations, takeaways,
} from '@/data/minddo';

const SECTIONS = [
    { id: 'output', n: '01', label: 'What it produces' },
    { id: 'architecture', n: '02', label: 'Architecture' },
    { id: 'lifecycle', n: '03', label: 'Request lifecycle' },
    { id: 'pipeline', n: '04', label: 'Pipeline' },
    { id: 'scaling', n: '05', label: 'Autoscaling' },
    { id: 'data', n: '06', label: 'Data model' },
    { id: 'security', n: '07', label: 'Security' },
    { id: 'reliability', n: '08', label: 'Reliability' },
    { id: 'performance', n: '09', label: 'Performance and cost' },
    { id: 'limitations', n: '10', label: 'Limitations' },
    { id: 'aws', n: '11', label: 'AWS plan' },
];

function useActiveSection() {
    const [active, setActive] = useState(SECTIONS[0].id);
    useEffect(() => {
        // Position based rather than IntersectionObserver: the last section is short,
        // so an observer leaves the rail stuck on the previous entry at the page bottom.
        const pick = () => {
            const y = window.scrollY + 140;
            let current = SECTIONS[0].id;
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id);
                if (el && el.offsetTop <= y) current = s.id;
            }
            setActive(current);
        };
        pick();
        window.addEventListener('scroll', pick, { passive: true });
        window.addEventListener('resize', pick);
        return () => {
            window.removeEventListener('scroll', pick);
            window.removeEventListener('resize', pick);
        };
    }, []);
    return active;
}

export default function MinddoShowcase() {
    const active = useActiveSection();

    // This page is dense, interactive documentation: restore the real pointer.
    useEffect(() => {
        document.body.classList.add('plain-cursor');
        return () => document.body.classList.remove('plain-cursor');
    }, []);

    return (
        <div style={{ background: '#fff', color: T.body, fontFamily: FONT }}>
            {/* Top bar */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 300, background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)', borderBottom: `1px solid ${T.rule}`,
                height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 clamp(16px, 4vw, 40px)', gap: 16,
            }}>
                <Link href="/#projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: T.muted }}>
                    <span aria-hidden>←</span> Projects
                </Link>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.ink, whiteSpace: 'nowrap' }}>{minddo.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: '0.72rem', color: T.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        engineering case study
                    </span>
                </div>
                <Link href="/#contact" style={{ fontSize: '0.78rem', color: T.accent, whiteSpace: 'nowrap' }}>Contact</Link>
            </header>

            {/* Hero */}
            <section style={{ borderBottom: `1px solid ${T.rule}`, padding: 'clamp(32px, 6vw, 56px) clamp(16px, 4vw, 40px)' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <p style={{ fontFamily: MONO, fontSize: '0.74rem', color: T.accent, marginBottom: 12 }}>
                        {minddo.year} · sole engineer
                    </p>
                    <h1 style={{ fontSize: 'clamp(1.9rem, 4.2vw, 2.7rem)', fontWeight: 600, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 10 }}>
                        {minddo.name}
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: T.muted, marginBottom: 22 }}>{minddo.subtitle}</p>

                    <div style={{ maxWidth: 700 }}>
                        <Lede>{minddo.lede}</Lede>
                    </div>

                    <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(64px, auto) 1fr', gap: '10px 20px', maxWidth: 900, margin: '26px 0 30px' }}>
                        {[['Role', minddo.role], ['Stack', minddo.stack], ['Scale', minddo.scale], ['Status', minddo.status]].map(([k, v]) => (
                            <div key={k} style={{ display: 'contents' }}>
                                <dt style={{ fontFamily: MONO, fontSize: '0.7rem', color: T.accent, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>{k}</dt>
                                <dd style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.6 }}>{v}</dd>
                            </div>
                        ))}
                    </dl>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1,
                        background: T.rule, border: `1px solid ${T.rule}`, borderRadius: 6, overflow: 'hidden',
                    }}>
                        {metrics.map(m => (
                            <div key={m.label} style={{ background: '#fff', padding: '16px 18px' }}>
                                <div style={{ fontFamily: MONO, fontSize: '1.35rem', fontWeight: 600, color: T.ink, letterSpacing: '-0.02em' }}>{m.value}</div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: T.body, margin: '6px 0 4px' }}>{m.label}</div>
                                <div style={{ fontSize: '0.75rem', color: T.muted, lineHeight: 1.5 }}>{m.note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Body: sticky contents + content */}
            <div style={{
                maxWidth: 1400, margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px) 80px',
                display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40,
            }}
                className="minddo-grid"
            >
                <nav className="minddo-toc" style={{ display: 'none' }}>
                    <div style={{ position: 'sticky', top: 78, paddingTop: 36 }}>
                        <p style={{ fontFamily: MONO, fontSize: '0.68rem', color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                            Contents
                        </p>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2, borderLeft: `1px solid ${T.rule}` }}>
                            {SECTIONS.map(s => {
                                const on = active === s.id;
                                return (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            style={{
                                                display: 'flex', gap: 9, padding: '5px 0 5px 12px',
                                                marginLeft: -1, borderLeft: `2px solid ${on ? T.accent : 'transparent'}`,
                                                fontSize: '0.79rem', color: on ? T.ink : T.muted, fontWeight: on ? 600 : 400,
                                            }}
                                        >
                                            <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: on ? T.accent : T.faint }}>{s.n}</span>
                                            {s.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                <main style={{ minWidth: 0, paddingTop: 36 }}>
                    {/* 01 output */}
                    <section id="output" style={{ marginBottom: 56 }}>
                        <H2 id="output-h" index="01">What it produces</H2>
                        <P>One URL in, eleven artifacts and one database row out.</P>
                        <Table
                            head={['Artifact', 'Produced by', 'Detail']}
                            widths={['26%', '18%', '56%']}
                            rows={artifacts.map(a => [
                                <code key={a.file} style={{ fontFamily: MONO, fontSize: '0.82rem' }}>{a.file}</code>,
                                <span key="b" style={{ fontSize: '0.82rem', color: T.muted }}>{a.by}</span>,
                                a.detail,
                            ])}
                        />
                        <Note label="The AI layer">
                            Fourteen fields come back in one Claude call, English and Mandarin together, so the second
                            language costs output tokens rather than a second round trip.
                        </Note>
                    </section>

                    {/* 02 architecture */}
                    <section id="architecture" style={{ marginBottom: 56 }}>
                        <H2 id="architecture-h" index="02">System architecture</H2>
                        <P>
                            The API is routing and JSON, scaling on request rate. The worker is two Chromium launches
                            and two x264 encodes, scaling on queue depth. Separate deployments keep the knobs independent.
                        </P>
                        <Architecture />

                        <H3>API surface</H3>
                        <Table
                            head={['Route', 'Guard', 'Notes']}
                            widths={['30%', '26%', '44%']}
                            rows={[
                                [<code key="1" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>POST /generate</code>, 'rate limit 5/IP/hr', 'Returns 202 in about 5 ms with a submission_id'],
                                [<code key="2" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>POST /generate/sync</code>, 'rate limit 2/IP/hr', 'Runs the pipeline in process; debug path only, capped harder because concurrent calls starve the event loop the probes answer on'],
                                [<code key="3" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>GET /showcases/{'{id}'}/{'{file}'}</code>, 'id charset, filename allowlist, path containment', 'Local disk first, then S3'],
                                [<code key="4" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>DELETE /api/admin/showcases/{'{id}'}</code>, 'ADMIN_API_TOKEN', 'Soft delete, sets is_public=false'],
                                [<code key="5" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>GET /health/live</code>, 'none', 'Liveness: process only, touches no dependency'],
                                [<code key="6" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>GET /health</code>, 'none', 'Readiness: 503 when the Celery broker is unreachable'],
                                [<code key="7" style={{ fontFamily: MONO, fontSize: '0.8rem' }}>GET /</code>, 'file allowlist', 'index.html, *.jsx, /assets, nothing else'],
                            ]}
                        />
                    </section>

                    {/* 03 lifecycle */}
                    <section id="lifecycle" style={{ marginBottom: 56 }}>
                        <H2 id="lifecycle-h" index="03">Request lifecycle</H2>
                        <P>Two details here were bugs first: the held ack, and the asset read that falls through to S3.</P>
                        <Lifecycle />
                    </section>

                    {/* 04 pipeline */}
                    <section id="pipeline" style={{ marginBottom: 56 }}>
                        <H2 id="pipeline-h" index="04">The generation pipeline</H2>
                        <P>Seven steps run in order. The real dependency graph is narrower, which is where the latency hides.</P>
                        <Pipeline />
                    </section>

                    {/* 05 scaling */}
                    <section id="scaling" style={{ marginBottom: 56 }}>
                        <H2 id="scaling-h" index="05">Autoscaling control loop</H2>
                        <Scaling />
                        <Note label="Caveat" tone="warn">
                            Twenty submissions scaled workers 1 to 4 in about 5 seconds, but the existing workers
                            absorbed all 20 tasks before the new pods finished pulling a 3 GB image. The test proved the
                            control loop works. It did not prove the scaling helped.
                        </Note>
                    </section>

                    {/* 06 data */}
                    <section id="data" style={{ marginBottom: 56 }}>
                        <H2 id="data-h" index="06">Data model and storage split</H2>
                        <P>
                            Blobs in S3, metadata in Postgres, local disk as scratch. Row-level security is the
                            authorization boundary, enforced by the database rather than application code.
                        </P>
                        <DataModel />
                    </section>

                    {/* 07 security */}
                    <section id="security" style={{ marginBottom: 56 }}>
                        <H2 id="security-h" index="07">Security engineering</H2>
                        <P>
                            Four hardening passes, each closing a hole in my own code. The largest is traced below:
                            the system loads an attacker-controlled URL in a browser and publishes what it sees.
                        </P>
                        <SsrfGuard />

                        <H3>Every finding</H3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '14px 0 20px' }}>
                            {security.map(f => (
                                <div key={f.title} style={{ border: `1px solid ${T.rule}`, borderRadius: 6, overflow: 'hidden' }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline',
                                        padding: '10px 14px', background: T.surface, borderBottom: `1px solid ${T.rule}`,
                                    }}>
                                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: T.ink }}>{f.title}</span>
                                        <code style={{ fontFamily: MONO, fontSize: '0.72rem', color: T.muted }}>{f.commit}</code>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                                        {([['The hole', f.problem, T.bad.stroke], ['The fix', f.fix, T.good.stroke]] as const).map(([k, v, c]) => (
                                            <div key={k} style={{ padding: '12px 14px', borderTop: `2px solid ${c}22` }}>
                                                <div style={{ fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{k}</div>
                                                <p style={{ fontSize: '0.85rem', lineHeight: 1.62, color: T.body }}>{v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Note label="The pattern">
                            Both worst holes were a control I believed existed and did not. Found by re-reading my own
                            code against one question: what does this actually check?
                        </Note>

                        <H3>Residual risks, named</H3>
                        <Table
                            head={['Risk', 'Status']}
                            widths={['28%', '72%']}
                            rows={residualRisks.map(r => [r.risk, r.status])}
                        />
                    </section>

                    {/* 08 reliability */}
                    <section id="reliability" style={{ marginBottom: 56 }}>
                        <H2 id="reliability-h" index="08">Reliability engineering</H2>
                        <P>Each control exists because its absence produced a specific failure.</P>
                        <Table
                            head={['Control', 'Value', 'Failure it prevents']}
                            widths={['24%', '20%', '56%']}
                            rows={reliability.map(r => [
                                <code key={r.control} style={{ fontFamily: MONO, fontSize: '0.8rem' }}>{r.control}</code>,
                                <span key="v" style={{ fontFamily: MONO, fontSize: '0.78rem', color: T.accent }}>{r.value}</span>,
                                r.prevents,
                            ])}
                        />
                        <Note label="Hardest bug debugged">
                            KEDA crash looped binding :6443, which the k3s API server owns. An earlier
                            <C>hostNetwork: true</C> had put the pod in the node namespace, inheriting every conflict
                            the node had. The lesson: when a symptom appears right after a fix, suspect the fix.
                        </Note>
                    </section>

                    {/* 09 performance */}
                    <section id="performance" style={{ marginBottom: 56 }}>
                        <H2 id="performance-h" index="09">Performance and cost</H2>
                        <P>
                            Measured on docker compose. The 102.7 s is two Chromium cold starts, a real-time demo
                            recording, one Claude call, two TTS round trips and two x264 encodes.
                        </P>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                            <div>
                                <H3>Cost per showcase</H3>
                                <Table
                                    head={['Component', 'Detail', 'Cost']}
                                    rows={cost.map(c => [
                                        c.component,
                                        <span key="d" style={{ fontSize: '0.82rem', color: T.muted }}>{c.detail}</span>,
                                        <code key="v" style={{ fontFamily: MONO, fontSize: '0.82rem', color: T.ink }}>{c.value}</code>,
                                    ])}
                                />
                                <P style={{ fontSize: '0.85rem' }}>
                                    A cache hit skips Claude, which is the whole per showcase cost. Video generation has
                                    no cache of its own yet.
                                </P>
                            </div>
                            <div>
                                <H3>Available wins, outputs unchanged</H3>
                                <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, margin: '14px 0 12px' }}>
                                    {wins.map((w, i) => (
                                        <li key={w} style={{ display: 'flex', gap: 11, fontSize: '0.87rem', color: T.body, lineHeight: 1.6 }}>
                                            <span style={{ fontFamily: MONO, fontSize: '0.75rem', color: T.accent, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                                            {w}
                                        </li>
                                    ))}
                                </ol>
                                <p style={{ fontFamily: MONO, fontSize: '0.9rem', color: T.ink, fontWeight: 600 }}>Realistic target: under 45 s.</p>
                            </div>
                        </div>

                        <Note label="A number I don't quote" tone="warn">
                            The benchmark reports 23.4 MB peak RSS. It sampled uvicorn while the pipeline runs in the
                            Celery worker, so it measured the wrong process. Real peak is Chromium plus ffmpeg, able to
                            spike past 1 GB against a 2 Gi limit.
                        </Note>
                    </section>

                    {/* 10 limitations */}
                    <section id="limitations" style={{ marginBottom: 56 }}>
                        <H2 id="limitations-h" index="10">Known limitations</H2>
                        <P>Listed because a case study that claims no weaknesses is not describing real software.</P>
                        <Table
                            head={['Limitation', 'Consequence', 'Fix']}
                            widths={['26%', '38%', '36%']}
                            rows={limitations.map(l => [l.limitation, l.consequence, l.fix])}
                        />
                        <Note label="If I started over">
                            No state on local disk: it works in compose, breaks in Kubernetes, and forced a rewrite. An
                            idempotency key before a queue, since retries and deduplication both need it. Auth before
                            anything is public.
                        </Note>
                    </section>

                    {/* 11 aws */}
                    <section id="aws" style={{ marginBottom: 56 }}>
                        <H2 id="aws-h" index="11">AWS plan, not yet executed</H2>
                        <P>
                            Nothing has been provisioned. The code is written for it: instance-profile credentials, a
                            URL guard that exists because of the metadata endpoint, an architecture-asserting build.
                        </P>
                        <AwsPlan />
                    </section>

                    {/* takeaways */}
                    <section style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 32 }}>
                        <H3>What this project demonstrates</H3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, marginTop: 16 }}>
                            {takeaways.map(t => (
                                <div key={t.title}>
                                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: T.ink, marginBottom: 6 }}>{t.title}</div>
                                    <p style={{ fontSize: '0.85rem', color: T.body, lineHeight: 1.62 }}>{t.body}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}>
                            <Link
                                href="/#projects"
                                style={{
                                    fontSize: '0.8rem', fontWeight: 500, color: T.body,
                                    border: `1px solid ${T.ruleStrong}`, borderRadius: 4, padding: '9px 16px',
                                }}
                            >
                                ← All projects
                            </Link>
                            <Link
                                href="/#contact"
                                style={{
                                    fontSize: '0.8rem', fontWeight: 500, color: '#fff', background: T.ink,
                                    border: `1px solid ${T.ink}`, borderRadius: 4, padding: '9px 16px',
                                }}
                            >
                                Get in touch
                            </Link>
                        </div>
                    </section>
                </main>
            </div>

            <style>{`
                /* Dense, interactive documentation: opt out of the site's custom cursor. */
                body.plain-cursor .oz-cursor { display: none; }
                @media (pointer: fine) {
                    body.plain-cursor * { cursor: auto !important; }
                    body.plain-cursor a,
                    body.plain-cursor button,
                    body.plain-cursor summary,
                    body.plain-cursor label,
                    body.plain-cursor [role="button"] { cursor: pointer !important; }
                    body.plain-cursor input[type="range"] { cursor: pointer !important; }
                }
                @media (min-width: 1120px) {
                    .minddo-grid { grid-template-columns: 210px minmax(0, 1fr) !important; }
                    .minddo-toc  { display: block !important; }
                }
            `}</style>
        </div>
    );
}
