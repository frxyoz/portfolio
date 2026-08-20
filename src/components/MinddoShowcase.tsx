'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { T, FONT, MONO, PLATE, MICRO_PLATE, CONTROL, H2, H3, P, C, Note, Table, Video } from './minddo/ui';
import Pictogram from './concourse/Pictogram';
import FlapText from './concourse/FlapText';
import {
    SIGNAL, ENAMEL, ENAMEL_INK_SOFT, STEEL, STEEL_SOFT,
    SIGN_WHITE, BOARD, BOARD_INK, BOARD_INK_SOFT, GREEN_LAMP,
    EASE_OUT, TYPE, TABULAR,
} from '@/design/tokens';
import Architecture from './minddo/Architecture';
import Lifecycle from './minddo/Lifecycle';
import Pipeline from './minddo/Pipeline';
import Scaling from './minddo/Scaling';
import DataModel from './minddo/DataModel';
import SsrfGuard from './minddo/SsrfGuard';
import AwsPlan from './minddo/AwsPlan';
import {
    minddo, awsLoad, artifacts, security, residualRisks,
    reliability, sizing, cost, wins, limitations, takeaways, SECTIONS,
} from '@/data/minddo';

/** Viewport at which the contents rail appears. Mirrors the `min-width: 1120px`
 *  rule at the bottom of this file; below it the rail is `display: none`, so
 *  none of the work here is worth doing. */
const RAIL_AT = 1120;

function useActiveSection() {
    const [active, setActive] = useState(SECTIONS[0].id);

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${RAIL_AT}px)`);
        let detach: (() => void) | null = null;

        function attach() {
            // Position based rather than IntersectionObserver: the last section is short,
            // so an observer leaves the rail stuck on the previous entry at the page bottom.
            //
            // The offsets are measured once and cached. Reading `offsetTop` forces the
            // browser to flush layout, and doing that for ten sections inside a scroll
            // handler costs a measurable slice of every frame to learn numbers that only
            // change when the page reflows. Scroll is then pure arithmetic, and rAF keeps
            // it to one state update per frame no matter how often the event fires.
            let offsets: { id: string; top: number }[] = [];
            let queued = false;

            const measure = () => {
                offsets = SECTIONS
                    .map(s => ({ id: s.id, el: document.getElementById(s.id) }))
                    .filter((s): s is { id: string; el: HTMLElement } => !!s.el)
                    .map(s => ({ id: s.id, top: s.el.offsetTop }));
            };

            const pick = () => {
                const y = window.scrollY + 140;
                let current = SECTIONS[0].id;
                for (const s of offsets) if (s.top <= y) current = s.id;
                setActive(current);
            };

            const onScroll = () => {
                if (queued) return;
                queued = true;
                requestAnimationFrame(() => { queued = false; pick(); });
            };

            const onResize = () => { measure(); pick(); };

            measure();
            pick();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize);
            return () => {
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onResize);
            };
        }

        const sync = () => {
            if (mq.matches && !detach) detach = attach();
            else if (!mq.matches && detach) { detach(); detach = null; }
        };

        sync();
        mq.addEventListener('change', sync);
        return () => { mq.removeEventListener('change', sync); detach?.(); };
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
        <div style={{ background: T.canvas, color: T.body, fontFamily: FONT }} data-surface="sign">
            {/* ── The rail ────────────────────────────────────────────────
                Opaque steel at every scroll position, like every rail on this
                site. This route is entered directly as often as it is entered
                from the home page, so the rail has to introduce the page as
                well as leave it. */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 300, background: STEEL,
                borderBottom: `1px solid ${STEEL_SOFT}`,
                height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 12px 0 0', gap: 16,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', minWidth: 0 }}>
                    <Link
                        href="/"
                        aria-label="Olric Zeng — home"
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 60, height: 60, flexShrink: 0,
                            background: SIGNAL, color: STEEL,
                            fontFamily: FONT, fontWeight: 800, fontStretch: '104%',
                            fontSize: TYPE.LEDE, letterSpacing: '0.02em',
                        }}
                    >
                        OZ
                    </Link>
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 18, minWidth: 0,
                        ...PLATE, color: SIGN_WHITE,
                    }}>
                        <Pictogram name="doc" size={13} color={SIGNAL} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {minddo.name} — case study
                        </span>
                    </span>
                </div>

                <nav aria-label="Leave this page" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {([
                        ['/#projects', 'Projects', 'arrow-left', true],
                        ['/#contact', 'Contact', 'arrow-right', false],
                    ] as const).map(([href, label, arrow, leading]) => (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 9,
                                minHeight: 44, padding: '0 14px',
                                ...CONTROL, color: SIGN_WHITE,
                                transition: `color .18s ${EASE_OUT}`,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = SIGNAL; }}
                            onMouseLeave={e => { e.currentTarget.style.color = SIGN_WHITE; }}
                        >
                            {leading && <Pictogram name={arrow} size={12} />}
                            {label}
                            {!leading && <Pictogram name={arrow} size={12} />}
                        </Link>
                    ))}
                </nav>
            </header>

            {/* ── The hero, on the board ──────────────────────────────────
                The one section of this page that is not a reading ground. A
                case study opens the way a service opens on a departures board:
                the name flaps up, and the facts of the service sit under
                painted column heads. */}
            <section style={{
                background: BOARD, color: BOARD_INK,
                padding: 'clamp(38px, 6vw, 68px) clamp(18px, 4vw, 44px) clamp(34px, 5vw, 56px)',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <h1 style={{
                        fontFamily: FONT, fontSize: 'clamp(2.6rem, 6.4vw, 5rem)', fontWeight: 800,
                        fontStretch: '112%', lineHeight: 0.9, letterSpacing: '-0.035em',
                        color: SIGNAL, margin: 0,
                    }}>
                        <FlapText text={minddo.name} variant="bare" stagger={1} />
                    </h1>
                    <p style={{ ...PLATE, color: BOARD_INK_SOFT, marginTop: 18 }}>{minddo.subtitle}</p>

                    <div className="minddo-hero" style={{
                        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 38,
                        alignItems: 'start', marginTop: 32,
                    }}>
                        <div style={{ minWidth: 0 }}>
                            <p style={{
                                fontFamily: FONT, fontSize: TYPE.LEDE, lineHeight: 1.62,
                                color: BOARD_INK, maxWidth: '56ch', margin: 0,
                            }}>
                                {minddo.lede}
                            </p>

                            {/* The service, under painted column heads. */}
                            <dl style={{
                                display: 'grid', gridTemplateColumns: 'minmax(74px, auto) 1fr',
                                gap: 0, maxWidth: 940, margin: '30px 0 0',
                                borderTop: `1px solid ${STEEL_SOFT}`,
                            }}>
                                {([
                                    ['Year', minddo.year, false],
                                    ['Role', minddo.role, false],
                                    ['Stack', minddo.stack, false],
                                    ['Scale', minddo.scale, false],
                                    ['Status', minddo.status, true],
                                ] as const).map(([k, v, live]) => (
                                    <div key={k} style={{ display: 'contents' }}>
                                        <dt style={{
                                            ...MICRO_PLATE, color: SIGNAL,
                                            padding: '13px 20px 13px 0',
                                            borderBottom: `1px solid ${STEEL_SOFT}`,
                                        }}>
                                            {k}
                                        </dt>
                                        <dd style={{
                                            fontFamily: FONT, fontSize: TYPE.COPY, color: BOARD_INK,
                                            lineHeight: 1.55, padding: '11px 0',
                                            borderBottom: `1px solid ${STEEL_SOFT}`,
                                            display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
                                            ...TABULAR,
                                        }}>
                                            {/* Green is deployed-and-running, which is exactly
                                                what this row claims. Its only use on the page. */}
                                            {live && (
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 7,
                                                    ...MICRO_PLATE, color: GREEN_LAMP, flexShrink: 0,
                                                }}>
                                                    <span aria-hidden style={{
                                                        width: 9, height: 9, background: GREEN_LAMP,
                                                        animation: 'lamp 2.4s ease-in-out infinite',
                                                    }} />
                                                    Live
                                                </span>
                                            )}
                                            <span>{v}</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <Video
                            label="Demo"
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
                <nav aria-label="Contents" className="minddo-toc" style={{ display: 'none' }}>
                    {/* The route diagram, spent a second time. DESIGN.md records
                        that the device carried only one timeline on the whole
                        site; a table of contents is a line with eleven stops on
                        it and the reader standing at one of them, which is the
                        thing the diagram was drawn for. */}
                    <div style={{ position: 'sticky', top: 84, paddingTop: 44 }}>
                        <p style={{ ...MICRO_PLATE, color: T.ink, marginBottom: 18 }}>Contents</p>
                        <ul style={{ listStyle: 'none', position: 'relative', paddingLeft: 0 }}>
                            <span aria-hidden style={{
                                position: 'absolute', left: 6, top: 15, bottom: 15,
                                width: 4, background: ENAMEL,
                            }} />
                            {SECTIONS.map(sec => {
                                const on = active === sec.id;
                                return (
                                    <li key={sec.id} style={{ position: 'relative' }}>
                                        <a
                                            href={`#${sec.id}`}
                                            aria-current={on ? 'true' : undefined}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 13,
                                                minHeight: 34, padding: '4px 8px 4px 0',
                                                fontFamily: FONT, fontSize: TYPE.COPY,
                                                fontWeight: on ? 700 : 400,
                                                color: on ? T.ink : T.muted,
                                                transition: `color .18s ${EASE_OUT}`,
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0 }}>
                                                <circle cx="8" cy="8" r={on ? 7.5 : 5} fill={on ? SIGNAL : ENAMEL} />
                                                {on && <circle cx="8" cy="8" r="7.5" fill="none" stroke={STEEL} strokeWidth="2" />}
                                            </svg>
                                            <span style={{ textWrap: 'balance' }}>{sec.label}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                <main id="main" style={{ minWidth: 0, paddingTop: 36 }}>
                    {/* output */}
                    <section id="output" style={{ marginBottom: 56 }}>
                        <H2 id="output-h">What it produces</H2>
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

                    {/* architecture */}
                    <section id="architecture" style={{ marginBottom: 56 }}>
                        <H2 id="architecture-h">System architecture</H2>
                        <P>
                            The API does almost nothing. It validates the payload, pushes a task onto the queue and
                            answers. The worker carries the cost: two Chromium launches and two x264 encodes per job.
                            The two get busy for unrelated reasons, so they ship as separate deployments. The API scales
                            on request rate, the worker on queue depth.
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

                    {/* lifecycle */}
                    <section id="lifecycle" style={{ marginBottom: 56 }}>
                        <H2 id="lifecycle-h">Request lifecycle</H2>
                        <P>Two of the details in this diagram started out as bugs — the ack that gets held until the job actually finishes, and the asset read that falls through to S3 when the file is not on local disk.</P>
                        <Lifecycle />
                    </section>

                    {/* pipeline */}
                    <section id="pipeline" style={{ marginBottom: 56 }}>
                        <H2 id="pipeline-h">The generation pipeline</H2>
                        <P>The seven steps run one after another, but they do not all genuinely depend on each other. The gap between the order they run in and the order they would need to run in is where most of the wasted time sits.</P>
                        <Pipeline />
                    </section>

                    {/* scaling */}
                    <section id="scaling" style={{ marginBottom: 56 }}>
                        <H2 id="scaling-h">Autoscaling control loop</H2>
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

                    {/* data */}
                    <section id="data" style={{ marginBottom: 56 }}>
                        <H2 id="data-h">Data model and storage split</H2>
                        <P>
                            Anything large enough to be a file goes to S3, everything else lives in Postgres, and the
                            worker only uses its local disk as scratch space while a job is running. Who can read what
                            is decided by row-level security in the database rather than by checks in my route
                            handlers, so a mistake in the application cannot hand somebody else&apos;s data out.
                        </P>
                        <DataModel />
                    </section>

                    {/* security */}
                    <section id="security" style={{ marginBottom: 56 }}>
                        <H2 id="security-h">Security engineering</H2>
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
                                <div key={f.title} style={{ boxShadow: `inset 0 0 0 2px ${STEEL}` }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center',
                                        padding: '0 14px', minHeight: 46, background: STEEL,
                                    }}>
                                        <span style={{
                                            fontFamily: FONT, fontSize: TYPE.META, fontWeight: 700, fontStretch: '92%',
                                            color: SIGN_WHITE,
                                        }}>
                                            {f.title}
                                        </span>
                                        <code style={{ fontFamily: MONO, fontSize: TYPE.MICRO, color: SIGNAL, flexShrink: 0 }}>{f.commit}</code>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: T.ruleStrong }}>
                                        {([['Refused', 'The hole', f.problem, T.bad], ['Admitted', 'The fix', f.fix, T.good]] as const).map(([, k, v, tone]) => (
                                            <div key={k} style={{ background: T.canvas, padding: '0 0 14px' }}>
                                                <div style={{ ...MICRO_PLATE, background: tone.stroke, color: SIGN_WHITE, padding: '8px 14px' }}>{k}</div>
                                                <p style={{ fontFamily: FONT, fontSize: TYPE.COPY, lineHeight: 1.62, color: T.body, padding: '13px 14px 0' }}>{v}</p>
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

                    {/* reliability */}
                    <section id="reliability" style={{ marginBottom: 56 }}>
                        <H2 id="reliability-h">Reliability engineering</H2>
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

                    {/* performance */}
                    <section id="performance" style={{ marginBottom: 56 }}>
                        <H2 id="performance-h">Performance and cost</H2>
                        <P>
                            Two sets of numbers here, and they disagree. The baseline comes off docker compose with
                            one job running alone: 102.7 s, mostly two Chromium cold starts, a demo recording that runs
                            in real time, one call to Claude, two TTS round trips and two x264 encodes. The second set
                            comes off the AWS cluster with twenty jobs landing at once.
                        </P>

                        <H3>Twenty jobs at once, k3s on one t3.large</H3>
                        {/* A measured run belongs on a board, not in a row of
                            cards: column-head lettering, tabular figures, one
                            ground. */}
                        <div className="minddo-bleed" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 1,
                            background: STEEL_SOFT, boxShadow: `inset 0 0 0 2px ${STEEL}`,
                            margin: '20px 0 22px',
                        }}>
                            {awsLoad.map(m => (
                                <div key={m.label} style={{ background: BOARD, padding: '18px 18px 20px' }}>
                                    <div style={{
                                        fontFamily: FONT, fontSize: '1.7rem', fontWeight: 800, fontStretch: '104%',
                                        letterSpacing: '-0.03em', lineHeight: 1, color: SIGNAL, ...TABULAR,
                                    }}>
                                        {m.value}
                                    </div>
                                    <div style={{ ...MICRO_PLATE, color: BOARD_INK, margin: '13px 0 7px' }}>{m.label}</div>
                                    <div style={{ fontFamily: FONT, fontSize: TYPE.COPY, color: BOARD_INK_SOFT, lineHeight: 1.5 }}>{m.note}</div>
                                </div>
                            ))}
                        </div>
                        <P>
                            The median job took two and a half times the baseline. Four pipelines, each holding a
                            Chromium and an x264 encode, do not fit in two cores. Scaling bought a queue that drains
                            four times faster, at the cost of every job getting slower. Some of that is the box I
                            picked: a t3.large is two burstable vCPUs, so four pipelines that each want a core for
                            Chromium and another for ffmpeg are contending for hardware that was never there. A
                            compute-optimised instance with more cores would move the median back down.
                        </P>

                        <Note label="Probe restarts during the run">
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
                                        <li key={w} style={{ display: 'flex', gap: 13, fontFamily: FONT, fontSize: TYPE.COPY, color: T.body, lineHeight: 1.6 }}>
                                            <span style={{ ...MICRO_PLATE, color: T.accent, paddingTop: 5, ...TABULAR }}>{String(i + 1).padStart(2, '0')}</span>
                                            {w}
                                        </li>
                                    ))}
                                </ol>
                                <p style={{ fontFamily: FONT, fontSize: TYPE.BODY, color: T.ink, fontWeight: 700, ...TABULAR }}>Together those should get it under 45&nbsp;s.</p>
                            </div>
                        </div>

                    </section>

                    {/* limitations */}
                    <section id="limitations" style={{ marginBottom: 56 }}>
                        <H2 id="limitations-h">Known limitations</H2>
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

                    {/* aws */}
                    <section id="aws" style={{ marginBottom: 56 }}>
                        <H2 id="aws-h">Running on AWS</H2>
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

                </main>
            </div>

            {/* ── Onward travel, on the service ground ────────────────────
                The page closes the way the home page's contact section does:
                a committed enamel field, and gates that name where they go. */}
            <section style={{ background: ENAMEL, color: SIGN_WHITE }}>
                <div style={{
                    maxWidth: 1400, margin: '0 auto',
                    padding: 'clamp(40px, 6vw, 72px) clamp(18px, 4vw, 44px) clamp(44px, 6vw, 76px)',
                }}>
                    <h2 style={{
                        fontFamily: FONT, fontSize: 'clamp(1.9rem, 3.4vw, 2.5rem)', fontWeight: 800,
                        fontStretch: '104%', letterSpacing: '-0.025em', lineHeight: 1,
                        color: SIGN_WHITE, margin: 0,
                    }}>
                        What I got out of building it
                    </h2>
                    <div aria-hidden style={{ height: 12, width: 120, background: SIGNAL, marginTop: 16 }} />

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '28px 34px', marginTop: 34,
                    }}>
                        {takeaways.map(t => (
                            <div key={t.title}>
                                <div style={{ ...PLATE, color: SIGNAL, marginBottom: 11 }}>{t.title}</div>
                                <p style={{
                                    fontFamily: FONT, fontSize: TYPE.COPY, color: SIGN_WHITE,
                                    lineHeight: 1.65, maxWidth: '40ch', margin: 0,
                                }}>
                                    {t.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 44,
                        paddingTop: 34, borderTop: `1px solid ${ENAMEL_INK_SOFT}66`,
                    }}>
                        {([
                            ['/#projects', 'All projects', 'arrow-left', true, false],
                            ['/#contact', 'Get in touch', 'arrow-right', false, true],
                        ] as const).map(([href, label, arrow, leading, primary]) => (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 11,
                                    minHeight: 50, padding: '0 22px',
                                    ...CONTROL,
                                    background: primary ? SIGNAL : 'transparent',
                                    color: primary ? STEEL : SIGN_WHITE,
                                    border: `2px solid ${primary ? SIGNAL : ENAMEL_INK_SOFT}`,
                                    transition: `background .18s ${EASE_OUT}, color .18s ${EASE_OUT}, border-color .18s ${EASE_OUT}`,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = SIGN_WHITE;
                                    e.currentTarget.style.borderColor = SIGN_WHITE;
                                    e.currentTarget.style.color = STEEL;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = primary ? SIGNAL : 'transparent';
                                    e.currentTarget.style.borderColor = primary ? SIGNAL : ENAMEL_INK_SOFT;
                                    e.currentTarget.style.color = primary ? STEEL : SIGN_WHITE;
                                }}
                            >
                                {leading && <Pictogram name={arrow} size={13} />}
                                {label}
                                {!leading && <Pictogram name={arrow} size={13} />}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

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
                /* The queue-depth slider is the one native control on the page,
                   and a native range ships in the platform's own blue with a
                   round thumb — two things this system does not have. It is a
                   steel channel with a signal block running in it. */
                .minddo-range {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                }
                .minddo-range::-webkit-slider-runnable-track {
                    height: 8px;
                    background: #141414;
                }
                .minddo-range::-moz-range-track {
                    height: 8px;
                    background: #141414;
                }
                .minddo-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 24px;
                    margin-top: -8px;
                    border: 2px solid #141414;
                    border-radius: 0;
                    background: #ffd100;
                }
                .minddo-range::-moz-range-thumb {
                    width: 14px;
                    height: 24px;
                    border: 2px solid #141414;
                    border-radius: 0;
                    background: #ffd100;
                }

                /* Figures and the board carry the argument, so on a wide screen
                   they run past the reading measure rather than being pinned to
                   it. The bleed stays inside the container's own padding. */
                @media (min-width: 1120px) {
                    .minddo-bleed { margin-right: -28px; }
                    .minddo-grid { grid-template-columns: 236px minmax(0, 1fr) !important; }
                    .minddo-toc  { display: block !important; }
                    .minddo-hero { grid-template-columns: minmax(0, 1fr) minmax(380px, 540px) !important; }
                }
            `}</style>
        </div>
    );
}
