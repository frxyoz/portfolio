'use client';

import { T, FONT, MONO, Arrowheads, useFocus, Figure } from './ui';

type Id = 'profiles' | 'students' | 'courses' | 'showcases';

interface Entity {
    id: Id; x: number; y: number; w: number;
    title: string;
    rows: { name: string; type: string; note?: string }[];
    detail: string;
}

const ENTITIES: Entity[] = [
    {
        id: 'profiles', x: 20, y: 30, w: 280, title: 'profiles',
        rows: [
            { name: 'id', type: 'uuid PK', note: 'references auth.users' },
            { name: 'role', type: 'text', note: 'student | parent | admin' },
            { name: 'full_name', type: 'text' },
        ],
        detail: 'Supabase auth owns identity. The proper admin design checks the caller JWT against profiles.role and lets RLS enforce it.',
    },
    {
        id: 'students', x: 20, y: 178, w: 280, title: 'students',
        rows: [
            { name: 'id', type: 'uuid PK' },
            { name: 'grade', type: 'int' },
        ],
        detail: 'Extends a profile. Anonymous reads return nothing here, verified rather than assumed.',
    },
    {
        id: 'courses', x: 20, y: 292, w: 280, title: 'courses',
        rows: [
            { name: 'id', type: 'text PK' },
            { name: 'name', type: 'text' },
            { name: 'description', type: 'text' },
        ],
        detail: 'Referenced by showcases so the gallery can group work by course.',
    },
    {
        id: 'showcases', x: 430, y: 30, w: 540, title: 'showcases',
        rows: [
            { name: 'submission_id', type: 'text UK' },
            { name: 'project_url', type: 'text', note: 'cache key, part 1' },
            { name: 'url_content_hash', type: 'text', note: 'cache key, part 2: md5(page_text)' },
            { name: 'page_text', type: 'text', note: 'DOM extract, also the prompt input' },
            { name: 'headline, summary, skill_tags', type: 'text', note: 'plus social_caption, value_line, achievement_context' },
            { name: 'narration_script', type: 'text', note: 'English' },
            { name: '*_zh', type: 'text', note: 'every AI field has a Mandarin twin' },
            { name: 'asset_urls', type: 'text', note: '2 screenshots, demo, 2 videos, 2 VTT, flyer, PDF, QR' },
            { name: 'is_public', type: 'bool', note: 'the RLS gate' },
            { name: 'generation_status', type: 'text', note: 'pending | completed | failed' },
        ],
        detail: 'The files themselves go to S3 and only the metadata lives here, because a 4 MB MP4 sitting in Postgres bloats every backup and rules out ever putting a CDN in front of it. The pair of cache key columns is what makes an unchanged re-submission free, and the fact that neither of them includes the student is the bug I know about.',
    },
];

const E = Object.fromEntries(ENTITIES.map(e => [e.id, e])) as Record<Id, Entity>;
const ROW_H = 20, HEAD_H = 30;
const height = (e: Entity) => HEAD_H + e.rows.length * ROW_H + 8;

const RELS: { from: Id; to: Id; label: string; d: string }[] = [
    { from: 'profiles', to: 'students', label: 'extends', d: 'M 160 128 V 178' },
    { from: 'profiles', to: 'showcases', label: 'student_id', d: 'M 300 78 H 366 V 120 H 430' },
    { from: 'courses', to: 'showcases', label: 'course_id', d: 'M 300 340 H 390 V 200 H 430' },
];

export default function DataModel() {
    const { active, bind, setPinned } = useFocus<Id>();
    const sel = active ? E[active] : null;

    const panel = (
        <div style={{  minHeight: 62, fontFamily: FONT }}>
                <p style={{ fontSize: '0.86rem', color: sel ? T.body : T.muted, lineHeight: 1.62 }}>
                    {sel
                        ? sel.detail
                        : 'The public read policy gates on is_public, so the key sitting in the browser can only ever see public rows. I checked this against the live project before shipping: an anonymous client read 4 of the 6 showcases and got nothing at all out of profiles.'}
                </p>
            </div>
    );

    return (
        <Figure
            label="Fig 6"
            title="Data model and the storage split"
            minWidth={990}
            caption="Hover a table for what it is responsible for." panel={panel}
        >
            <svg viewBox="0 0 990 396" style={{ width: '100%', display: 'block' }} onClick={() => setPinned(null)}>
                <Arrowheads />

                {RELS.map(r => {
                    const on = active === r.from || active === r.to;
                    return (
                        <g key={r.label} opacity={!active || on ? 1 : 0.2}>
                            <path d={r.d} fill="none" stroke={on ? T.accent : T.ruleStrong} strokeWidth={on ? 1.9 : 1.2} markerEnd={`url(#${on ? 'ah-on' : 'ah'})`} />
                            <text
                                x={Number(r.d.split(' ')[1]) + 8}
                                y={Number(r.d.split(' ')[2]) - 6}
                                style={{ fontFamily: FONT, fontSize: 10.2, fill: on ? T.accent : T.faint }}
                            >
                                {r.label}
                            </text>
                        </g>
                    );
                })}

                {ENTITIES.map(e => {
                    const h = height(e);
                    const on = !active || active === e.id;
                    return (
                        <g key={e.id} {...bind(e.id, e.title)} opacity={on ? 1 : 0.28} style={{ ...bind(e.id, e.title).style, transition: 'opacity .18s' }}>
                            <rect x={e.x} y={e.y} width={e.w} height={h} rx={5} fill="#fff" stroke={active === e.id ? T.ink : T.store.stroke} strokeWidth={active === e.id ? 2 : 1.3} />
                            <rect x={e.x} y={e.y} width={e.w} height={HEAD_H} rx={5} fill={T.store.fill} />
                            <rect x={e.x} y={e.y + HEAD_H - 6} width={e.w} height={6} fill={T.store.fill} />
                            <line x1={e.x} y1={e.y + HEAD_H} x2={e.x + e.w} y2={e.y + HEAD_H} stroke={T.store.stroke} strokeWidth={1} />
                            <text x={e.x + 12} y={e.y + 20} style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, fill: T.store.text }}>{e.title}</text>

                            {e.rows.map((r, i) => {
                                const y = e.y + HEAD_H + 14 + i * ROW_H;
                                return (
                                    <g key={r.name}>
                                        <text x={e.x + 12} y={y} style={{ fontFamily: MONO, fontSize: 10.4, fill: T.ink }}>{r.name}</text>
                                        <text x={e.x + 12} y={y} textAnchor="end" style={{ fontFamily: MONO, fontSize: 10.4, fill: T.muted }} dx={e.w - 24}>
                                            {r.type}
                                        </text>
                                        {r.note && e.w > 400 && (
                                            <text x={e.x + 250} y={y} style={{ fontFamily: FONT, fontSize: 10.2, fill: T.faint }}>{r.note}</text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
        </Figure>
    );
}
