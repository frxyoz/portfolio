'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { T, FONT, MONO, H2, H3, P, C, Lede, Note, Table, Video } from './minddo/ui';
import Architecture from './minddo/Architecture';
import Lifecycle from './minddo/Lifecycle';
import Pipeline from './minddo/Pipeline';
import Scaling from './minddo/Scaling';
import DataModel from './minddo/DataModel';
import SsrfGuard from './minddo/SsrfGuard';
import AwsPlan from './minddo/AwsPlan';
import {
    minddo, awsLoad, artifacts, security, residualRisks,
    reliability, sizing, cost, wins, limitations, takeaways,
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
    { id: 'aws', n: '11', label: 'On AWS' },
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

                    {/* Prose left, demo right: the summary block leaves the right half empty on wide screens. */}
                    <div className="minddo-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 36, alignItems: 'start' }}>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ maxWidth: 700 }}>
                                <Lede>{minddo.lede}</Lede>
                            </div>

                            <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(64px, auto) 1fr', gap: '10px 20px', maxWidth: 900, margin: '26px 0 0' }}>
                                {[['Role', minddo.role], ['Stack', minddo.stack], ['Scale', minddo.scale], ['Status', minddo.status]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'contents' }}>
                                        <dt style={{ fontFamily: MONO, fontSize: '0.7rem', color: T.accent, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>{k}</dt>
                                        <dd style={{ fontSize: '0.86rem', color: T.body, lineHeight: 1.6 }}>{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <Video
                            label="DEMO"
                            title="Screen recording"
                            src={minddo.demoVideo}
                            style={{ margin: 0, minWidth: 0 }}
                        />
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
                        <P>Every submission ends up as eleven files in S3 and one row in Postgres. Here is what each file is and what makes it.</P>
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
                            All fourteen fields come back from a single Claude call, with the English and the Mandarin
                            generated together in the same response. Doing it that way means the second language only
                            costs me output tokens instead of an entire second round trip.
                        </Note>
                    </section>

                    {/* 02 architecture */}
                    <section id="architecture" style={{ marginBottom: 56 }}>
                        <H2 id="architecture-h" index="02">System architecture</H2>
                        <P>
                            The API barely does any work — it validates the payload, pushes a task onto the queue and
                            answers. All the expensive parts live in the worker, which launches Chromium twice and runs
                            two x264 encodes for every job. Since those two things get busy for completely unrelated
                            reasons, they are separate deployments: the API scales on request rate and the worker scales
                            on how deep the queue is.
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
                        <P>Two of the details in this diagram started out as bugs — the ack that gets held until the job actually finishes, and the asset read that falls through to S3 when the file is not on local disk.</P>
                        <Lifecycle />
                    </section>

                    {/* 04 pipeline */}
                    <section id="pipeline" style={{ marginBottom: 56 }}>
                        <H2 id="pipeline-h" index="04">The generation pipeline</H2>
                        <P>The seven steps run one after another, but they do not all genuinely depend on each other. The gap between the order they run in and the order they would need to run in is where most of the wasted time sits.</P>
                        <Pipeline />
                    </section>

                    {/* 05 scaling */}
                    <section id="scaling" style={{ marginBottom: 56 }}>
                        <H2 id="scaling-h" index="05">Autoscaling control loop</H2>
                        <Scaling />
                        <H3>Sizing the ceiling, three times</H3>
                        <P>
                            Everything below came out of running this on a real node rather than a laptop. The lesson
                            underneath all four rows is the same: the scheduler admits pods based on what they
                            <em> request</em>, and the kernel kills them based on what they <em>use</em>. A ceiling
                            that fits in requests is not a ceiling that fits.
                        </P>
                        <Table
                            head={['What changed', 'From', 'To', 'Why']}
                            widths={['18%', '13%', '15%', '54%']}
                            rows={sizing.map(r => [
                                r.change,
                                <code key="f" style={{ fontFamily: MONO, fontSize: '0.78rem', color: T.muted }}>{r.from}</code>,
                                <code key="t" style={{ fontFamily: MONO, fontSize: '0.78rem', color: T.accent }}>{r.to}</code>,
                                r.why,
                            ])}
                        />
                    </section>

                    {/* 06 data */}
                    <section id="data" style={{ marginBottom: 56 }}>
                        <H2 id="data-h" index="06">Data model and storage split</H2>
                        <P>
                            Anything large enough to be a file goes to S3, everything else lives in Postgres, and the
                            worker only uses its local disk as scratch space while a job is running. Who can read what
                            is decided by row-level security in the database rather than by checks in my route
                            handlers, so a mistake in the application cannot hand somebody else&apos;s data out.
                        </P>
                        <DataModel />
                    </section>

                    {/* 07 security */}
                    <section id="security" style={{ marginBottom: 56 }}>
                        <H2 id="security-h" index="07">Security engineering</H2>
                        <P>
                            I went back through the codebase four separate times looking for holes, and found one on
                            every pass. The worst is traced in the diagram below, and it falls directly out of what the
                            product is for: somebody hands me a URL, I open it in a real browser, and then I publish
                            whatever came back.
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
                            Both of the serious ones were controls I was certain I had already written. I remembered
                            writing them, and they did not do what I thought they did. What eventually turned them up
                            was reading back through my own code and asking of each check, fairly slowly, what it was
                            really testing.
                        </Note>

                        <H3>What is still wrong with it</H3>
                        <Table
                            head={['Risk', 'Status']}
                            widths={['28%', '72%']}
                            rows={residualRisks.map(r => [r.risk, r.status])}
                        />
                    </section>

                    {/* 08 reliability */}
                    <section id="reliability" style={{ marginBottom: 56 }}>
                        <H2 id="reliability-h" index="08">Reliability engineering</H2>
                        <P>None of these were added as a precaution. Each one went in after something specific broke in a way I had to go and debug.</P>
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
                            KEDA started crash looping trying to bind :6443, which is the port the k3s API server
                            already owns. It took me an embarrassingly long time to connect that back to a
                            <C>hostNetwork: true</C> I had added earlier for something unrelated, which had dropped the
                            pod into the node&apos;s network namespace and handed it every port conflict the node had.
                            These days, if something breaks immediately after I fix something else, I go and look at
                            the fix first.
                        </Note>
                    </section>

                    {/* 09 performance */}
                    <section id="performance" style={{ marginBottom: 56 }}>
                        <H2 id="performance-h" index="09">Performance and cost</H2>
                        <P>
                            There are two sets of numbers here and they disagree, which is the interesting part. The
                            baseline comes off docker compose with one job running alone: 102.7 s, mostly two Chromium
                            cold starts, a demo recording that happens in real time, one call to Claude, two TTS round
                            trips and two x264 encodes. The second set comes off the AWS cluster with twenty jobs
                            landing at once.
                        </P>

                        <H3>Twenty jobs at once, k3s on one t3.large</H3>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))', gap: 1,
                            background: T.rule, border: `1px solid ${T.rule}`, borderRadius: 6, overflow: 'hidden',
                            margin: '16px 0 18px',
                        }}>
                            {awsLoad.map(m => (
                                <div key={m.label} style={{ background: '#fff', padding: '14px 16px' }}>
                                    <div style={{ fontFamily: MONO, fontSize: '1.15rem', fontWeight: 600, color: T.ink, letterSpacing: '-0.02em' }}>{m.value}</div>
                                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: T.body, margin: '5px 0 3px' }}>{m.label}</div>
                                    <div style={{ fontSize: '0.73rem', color: T.muted, lineHeight: 1.5 }}>{m.note}</div>
                                </div>
                            ))}
                        </div>
                        <P>
                            The median job took two and a half times the baseline, and that is the honest headline
                            rather than a footnote. Four pipelines, each holding a Chromium and an x264 encode, do not
                            fit in two cores. What scaling bought was a queue that drains four times faster while every
                            individual job gets slower.
                        </P>

                        <Note label="Nothing was lost, and that was not luck">
                            Probe timeouts restarted the API pods six or seven times during that run, and two workers
                            twice each: on a saturated node, neither <C>celery inspect ping</C> nor even
                            <C>/health/live</C> can answer inside its window. Every job still finished, because
                            <C>task_acks_late</C> puts an unacknowledged task back on the queue and the 660 s grace
                            period lets Celery finish what it is holding. The reliability design absorbed a fault the
                            sizing did not prevent. The unfixed half is that those probes are still tuned for an idle
                            node, and a probe that restarts a healthy process under load is a self-inflicted outage
                            waiting for a busier day.
                        </Note>

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
                                    Claude is the entire per-showcase cost, so a cache hit takes it to zero. Video
                                    generation has no cache of its own yet, which is the obvious thing to do next.
                                    The whole twenty-job run cost about two cents, but that is a cache hit rate rather
                                    than an efficiency: the load generator submits the same URL twenty times, so one
                                    job paid Claude and nineteen did not. Twenty different projects would be nearer
                                    forty cents.
                                </P>
                            </div>
                            <div>
                                <H3>Speedups that would not change the output</H3>
                                <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, margin: '14px 0 12px' }}>
                                    {wins.map((w, i) => (
                                        <li key={w} style={{ display: 'flex', gap: 11, fontSize: '0.87rem', color: T.body, lineHeight: 1.6 }}>
                                            <span style={{ fontFamily: MONO, fontSize: '0.75rem', color: T.accent, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                                            {w}
                                        </li>
                                    ))}
                                </ol>
                                <p style={{ fontFamily: MONO, fontSize: '0.9rem', color: T.ink, fontWeight: 600 }}>Together those should get it under 45 s.</p>
                            </div>
                        </div>

                        <Note label="A number I don't quote" tone="warn">
                            My benchmark prints 23.4 MB peak RSS and I do not use that figure anywhere, because it is
                            sampling uvicorn while the pipeline is actually running inside the Celery worker. It is
                            measuring the wrong process. The number that matters is Chromium and ffmpeg together, which
                            can spike past 1 GB. The worker limit is now 1200 Mi at concurrency 1, which is a tighter
                            ceiling drawn over an unmeasured peak rather than a measured fit. If the pipeline ever
                            OOMKills on a heavy page, this is the number I guessed.
                        </Note>
                    </section>

                    {/* 10 limitations */}
                    <section id="limitations" style={{ marginBottom: 56 }}>
                        <H2 id="limitations-h" index="10">Known limitations</H2>
                        <P>These are the things I already know are wrong with it and have not got to yet.</P>
                        <Table
                            head={['Limitation', 'Consequence', 'Fix']}
                            widths={['26%', '38%', '36%']}
                            rows={limitations.map(l => [l.limitation, l.consequence, l.fix])}
                        />
                        <Note label="If I started over">
                            Three things I would do differently. I would keep state off the local disk from the
                            beginning, since it works fine under compose, falls apart under Kubernetes and cost me a
                            rewrite to undo. I would put an idempotency key in front of the queue before writing
                            anything else, because retries and deduplication both need one and I ended up wanting both.
                            And I would get auth working before making any of it public, rather than bolting it on
                            afterwards.
                        </Note>
                    </section>

                    {/* 11 aws */}
                    <section id="aws" style={{ marginBottom: 56 }}>
                        <H2 id="aws-h" index="11">Running on AWS</H2>
                        <P>
                            This went live on 16 August 2026: k3s on a single t3.large, KEDA installed with Helm, real
                            S3 in place of MinIO, and no AWS keys anywhere in the cluster because boto3 picks up the
                            instance profile. The URL guard existed before any of it, which turned out to matter, since
                            the metadata endpoint it blocks is now a real endpoint holding real credentials.
                        </P>
                        <P>
                            Three of the seven verification steps I run after a deploy are there because the
                            corresponding hole was once real: fetch <C>/.env</C> and expect a 404, submit the metadata
                            URL and expect a 422, call the admin delete unauthenticated and expect a 401.
                        </P>
                        <AwsPlan />

                        <Note label="The faster path, and what it costs">
                            The build script cross-compiles on my laptop and streams the image over ssh into the
                            node&apos;s containerd, which is the right shape when the node is a black box. I did not
                            use it. Emulating linux/amd64 on Apple Silicon puts <C>playwright install chromium</C> at
                            thirty to forty-five minutes, so I rsynced the tree up and built natively on the box
                            instead: 7 min 46 s, and nothing crossed the internet but source. The bill for that is
                            real. Docker now lives on the node, there is a second copy of the tree to keep in sync,
                            the image exists twice on the same 30 GB disk, and rsync ships whatever is on disk rather
                            than whatever is in git, so it delivered the gitignored <C>k8s/secret.yaml</C> and
                            <C>COPY . .</C> baked it into the image. That is the failure mode of the quick path.
                        </Note>
                    </section>

                    {/* takeaways */}
                    <section style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 32 }}>
                        <H3>What I got out of building it</H3>
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
                    .minddo-hero { grid-template-columns: minmax(0, 1fr) minmax(380px, 520px) !important; }
                }
            `}</style>
        </div>
    );
}
