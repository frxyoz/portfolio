'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const BODY = 'var(--font-body, "DM Sans", "Helvetica Neue", sans-serif)';
const DISPLAY = 'var(--font-display, "Cormorant Garamond", Georgia, serif)';

// ─── Types ────────────────────────────────────────────────────────────────
interface Pal { accent: string; bg: string; c2: string; c3: string; ink: string; }
interface CardData {
  title: string; cap: string; art: string; pal: Pal;
  titleColor: string; capColor: string; dark?: boolean;
  note?: string; badge?: string;
  link?: string; linkLabel?: string;
  jump?: number; jumpLabel?: string;
}
interface HobbyDef {
  id: string; idx: string; accent: string;
  main: CardData; subs: [CardData, CardData];
}

// ─── Data ─────────────────────────────────────────────────────────────────
const HOBBIES: HobbyDef[] = [
  { id: 'soccer', idx: '01', accent: '#3c6e57',
    main: { title: 'Soccer', cap: 'The Soccer Collection · 01', art: 'soccer',
      pal: { accent: '#3c6e57', bg: '#e7efe6', c2: '#f4f0e7', c3: '#d49a2b', ink: '#20302a' },
      titleColor: '#20302a', capColor: '#3c6e57' },
    subs: [
      { title: 'Tottenham', cap: 'Club · Since 2019', art: 'tottenham', dark: true,
        pal: { accent: '#e9e2d0', bg: '#16224a', c2: '#16224a', c3: '#cf6242', ink: '#16224a' },
        titleColor: '#f4efe2', capColor: '#cf6242',
        note: 'A Spurs fan since 2019 — through the highs and the (many) lows.' },
      { title: 'FIFA / FM', cap: 'Management', art: 'fifafm',
        pal: { accent: '#3c6e57', bg: '#d0e0d4', c2: '#d0e0d4', c3: '#d49a2b', ink: '#20302a' },
        titleColor: '#20302a', capColor: '#3c6e57', badge: '↔ Also in Gaming',
        note: 'Management games I lose whole days to — strategy, stats, squad-building.',
        jump: 1, jumpLabel: 'See it in Gaming →' },
    ] },
  { id: 'gaming', idx: '02', accent: '#4a4f93',
    main: { title: 'Gaming', cap: 'The Gaming Collection · 02', art: 'gaming',
      pal: { accent: '#4a4f93', bg: '#eaebf3', c2: '#eaebf3', c3: '#e8674c', ink: '#262a55' },
      titleColor: '#262a55', capColor: '#4a4f93' },
    subs: [
      { title: 'FIFA / FM', cap: 'Management', art: 'fifafm', dark: true,
        pal: { accent: '#cdc4f0', bg: '#2b2f5e', c2: '#2b2f5e', c3: '#e8674c', ink: '#2b2f5e' },
        titleColor: '#eceaf8', capColor: '#cdc4f0', badge: '↔ Also in Soccer',
        note: 'Out-thinking the table and building squads, match after match.',
        jump: 0, jumpLabel: 'See it in Soccer →' },
      { title: 'Pokémon', cap: 'Competitive', art: 'pokemon',
        pal: { accent: '#e8674c', bg: '#fbe4da', c2: '#fbf4ef', c3: '#e8674c', ink: '#3a2630' },
        titleColor: '#3a2630', capColor: '#c2462f',
        note: 'Competitive player — once ran a YouTube channel on gimmicky teams.',
        link: 'https://www.youtube.com/@froxyproxy', linkLabel: '@froxyproxy ↗' },
    ] },
  { id: 'music', idx: '03', accent: '#b8860b',
    main: { title: 'Music', cap: 'The Music Collection · 03', art: 'music',
      pal: { accent: '#b8860b', bg: '#f6efd8', c2: '#f6efd8', c3: '#8a3f6f', ink: '#3a2b16' },
      titleColor: '#3a2b16', capColor: '#9a7009' },
    subs: [
      { title: 'Piano', cap: 'Practice · 12 Years', art: 'piano',
        pal: { accent: '#b8860b', bg: '#efe3c2', c2: '#fbf6e7', c3: '#8a3f6f', ink: '#3a2b16' },
        titleColor: '#3a2b16', capColor: '#9a7009',
        note: 'Twelve years in — my favorite way to unwind. Soft spot for ragtime.' },
      { title: 'Listening', cap: 'Every Genre', art: 'listening', dark: true,
        pal: { accent: '#cd9a3e', bg: '#2a2418', c2: '#f6efd8', c3: '#b06a96', ink: '#2a2418' },
        titleColor: '#f6efd8', capColor: '#cd9a3e',
        note: 'A lot of music, across every genre.',
        link: 'https://www.last.fm/user/olriczzz', linkLabel: 'last.fm/olriczzz ↗' },
    ] },
  { id: 'food', idx: '04', accent: '#cf6242',
    main: { title: 'Food', cap: 'The Food Collection · 04', art: 'food', dark: true,
      pal: { accent: '#cf6242', bg: '#2a2521', c2: '#f2e6cf', c3: '#9aa05a', ink: '#f2e6cf' },
      titleColor: '#f4ead4', capColor: '#e0935f' },
    subs: [
      { title: 'Noodles', cap: 'The Favorite', art: 'noodles',
        pal: { accent: '#cf6242', bg: '#f2e6cf', c2: '#fbf3e2', c3: '#9aa05a', ink: '#3a221a' },
        titleColor: '#3a221a', capColor: '#bb4f31',
        note: 'Noodles above all — my one true favorite.' },
      { title: 'Cooking', cap: 'Learning', art: 'cooking', dark: true,
        pal: { accent: '#e2a13a', bg: '#3a2a22', c2: '#f2e6cf', c3: '#cf6242', ink: '#3a2a22' },
        titleColor: '#f4ead4', capColor: '#e2a13a',
        note: 'Slowly getting into cooking and baking, too.' },
    ] },
];

// ─── Art helpers ──────────────────────────────────────────────────────────
function ht(x: number, y: number, cols: number, rows: number, gap: number, r0: number, dr: number, f: string) {
  const els: React.ReactElement[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      els.push(<circle key={`${i}-${j}`} cx={x + i * gap} cy={y + j * gap} r={Math.max(0.6, r0 - (i + j) * dr)} fill={f} opacity={0.5} />);
  return els;
}
function pent(cx: number, cy: number, r: number, rot: number): string {
  let s = '';
  for (let k = 0; k < 5; k++) {
    const a = (rot - 90 + k * 72) * Math.PI / 180;
    s += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return s.trim();
}

// ─── Art SVG ─────────────────────────────────────────────────────────────
function Art({ name, pal }: { name: string; pal: Pal }) {
  const { accent, bg, c2, c3, ink } = pal;
  const sv = { viewBox: '0 0 200 200', width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet' as const };
  switch (name) {
    case 'soccer': return (
      <svg {...sv}>
        <circle cx={100} cy={100} r={90} fill="none" stroke={c3} strokeWidth={2.6} strokeDasharray="2 12" opacity={0.7} />
        <path d="M150 38 A88 88 0 0 1 172 122" fill="none" stroke={c3} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        <circle cx={100} cy={100} r={66} fill={accent} />
        {ht(56, 116, 4, 4, 11, 3.2, 0.55, bg)}
        <polygon points={pent(100, 100, 24, 0)} fill={bg} />
        {[0,1,2,3,4].map(k => {
          const a = (-90 + k * 72) * Math.PI / 180;
          const px = 100 + 58 * Math.cos(a), py = 100 + 58 * Math.sin(a);
          return (
            <g key={k}>
              <line x1={100 + 24 * Math.cos(a)} y1={100 + 24 * Math.sin(a)} x2={px} y2={py} stroke={bg} strokeWidth={3.2} strokeLinecap="round" />
              <polygon points={pent(px, py, 12, k * 72 + 36)} fill={bg} />
            </g>
          );
        })}
        <circle cx={100} cy={100} r={66} fill="none" stroke={ink} strokeWidth={1} opacity={0.12} />
      </svg>
    );
    case 'tottenham': return (
      <svg viewBox="0 0 187 395" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        <path fillRule="evenodd" fill={accent} d="M33.0 6.5L26.0 8.5L18.0 13.5L10.5 21.0L6.5 27.0L7.0 30.5L19.0 31.5L26.0 35.5L30.5 41.0L33.5 50.0L33.5 54.0L32.5 55.0L32.5 67.0L30.5 73.0L30.5 78.0L26.5 91.0L26.5 96.0L24.5 99.0L24.5 103.0L22.5 108.0L22.5 112.0L21.5 113.0L20.5 122.0L18.5 128.0L18.5 150.0L20.5 154.0L20.5 158.0L22.5 161.0L22.5 163.0L30.5 175.0L36.5 182.0L52.5 197.0L64.5 213.0L64.5 215.0L68.5 223.0L68.5 226.0L70.5 229.0L70.5 233.0L72.5 238.0L73.5 254.0L74.5 255.0L74.5 269.0L71.0 270.5L63.0 271.5L60.0 273.5L57.0 273.5L55.0 275.5L53.0 275.5L51.0 277.5L46.0 279.5L41.0 283.5L30.5 295.0L24.5 306.0L24.5 309.0L22.5 312.0L22.5 316.0L20.5 320.0L20.5 338.0L22.5 342.0L22.5 346.0L24.5 352.0L28.5 358.0L28.5 360.0L34.5 368.0L46.0 378.5L55.0 383.5L57.0 383.5L59.0 385.5L62.0 385.5L66.0 387.5L70.0 387.5L71.0 388.5L89.0 388.5L90.0 387.5L98.0 386.5L111.0 380.5L118.0 375.5L126.5 367.0L136.5 350.0L136.5 347.0L138.5 343.0L138.5 338.0L139.5 337.0L139.5 321.0L138.5 320.0L138.5 315.0L136.5 311.0L136.5 308.0L134.5 306.0L134.5 304.0L131.5 298.0L124.5 289.0L114.0 279.5L109.0 277.5L107.0 275.5L105.0 275.5L97.0 271.5L84.5 269.0L86.5 234.0L88.5 227.0L90.5 209.0L92.5 204.0L92.5 199.0L94.5 195.0L96.5 184.0L98.5 181.0L98.5 177.0L100.5 174.0L102.5 165.0L104.5 162.0L110.5 145.0L112.5 143.0L112.5 141.0L118.5 131.0L118.5 129.0L126.5 117.0L128.5 112.0L140.5 96.0L154.0 81.5L165.0 72.5L174.0 66.5L179.0 64.5L181.5 62.0L181.5 54.0L177.0 53.5L175.0 55.5L170.0 57.5L155.0 67.5L148.0 73.5L128.5 95.0L112.5 119.0L112.5 121.0L110.5 123.0L110.5 125.0L108.5 127.0L104.5 135.0L104.5 137.0L102.5 139.0L102.5 141.0L100.5 144.0L100.5 146.0L98.5 148.0L98.5 150.0L96.5 153.0L96.5 156.0L92.5 164.0L92.5 167.0L89.5 173.0L88.5 180.0L86.5 183.0L86.5 187.0L82.5 199.0L82.5 204.0L80.5 209.0L79.5 220.0L78.0 220.5L76.5 219.0L76.5 216.0L74.5 214.0L74.5 212.0L70.5 204.0L66.5 198.0L60.5 191.0L42.5 174.0L33.5 162.0L29.5 153.0L29.5 150.0L28.5 149.0L28.5 128.0L30.5 122.0L30.5 116.0L32.5 112.0L32.5 108.0L34.5 104.0L34.5 100.0L36.5 96.0L36.5 92.0L40.5 78.0L40.5 73.0L42.5 66.0L42.5 44.0L36.5 32.0L35.0 31.5L32.0 27.5L24.0 23.5L23.5 22.0L30.0 17.5L40.0 15.5L51.0 19.5L58.5 27.0L62.5 36.0L64.5 76.0L65.5 77.0L66.5 89.0L70.5 101.0L70.5 104.0L79.5 124.0L89.0 135.5L91.5 134.0L94.5 127.0L88.5 120.0L82.5 108.0L76.5 88.0L76.5 83.0L74.5 77.0L74.5 68.0L73.5 67.0L72.5 34.0L70.5 31.0L70.5 28.0L66.5 23.0L66.5 21.0L59.0 13.5L53.0 9.5L44.0 6.5ZM179.0 79.5L166.0 89.5L152.5 103.0L144.5 113.0L140.5 120.0L136.5 124.0L134.5 129.0L129.5 136.0L131.0 138.5L139.0 138.5L142.5 135.0L149.5 123.0L160.5 109.0L180.5 90.0L180.5 81.0ZM178.0 109.5L160.5 130.0L159.5 133.0L156.5 136.0L158.0 138.5L166.0 138.5L168.0 137.5L179.5 123.0L180.5 120.0L179.5 119.0L180.5 118.0L180.5 110.0ZM83.5 280.0L89.0 279.5L93.0 281.5L96.0 281.5L108.0 287.5L118.5 297.0L124.5 306.0L126.5 312.0L115.0 313.5L110.5 304.0L104.5 296.0L93.0 285.5L88.0 283.5ZM55.5 286.0L68.0 285.5L69.0 286.5L76.0 287.5L84.0 291.5L98.5 304.0L104.5 314.0L104.5 317.0L98.0 319.5L91.0 324.5L89.0 324.5L82.5 314.0L72.0 303.5L58.0 295.5L47.5 293.0L47.5 291.0L49.0 289.5ZM38.5 302.0L44.0 301.5L45.0 302.5L48.0 302.5L49.5 305.0L43.5 311.0L42.5 314.0L38.5 319.0L34.5 330.0L33.5 341.0L32.0 341.5L30.5 340.0L30.5 320.0L34.5 308.0ZM58.5 309.0L62.0 308.5L71.5 317.0L64.5 327.0L64.5 329.0L62.5 331.0L62.5 333.0L60.5 336.0L60.5 339.0L58.5 342.0L57.5 364.0L59.5 371.0L59.0 374.5L47.5 367.0L44.5 361.0L44.5 357.0L42.5 352.0L42.5 339.0L43.5 338.0L45.5 328.0L51.5 317.0ZM118.5 323.0L129.5 323.0L129.5 338.0L125.0 340.5L111.0 343.5L109.0 345.5L103.0 347.5L97.0 352.5L95.0 352.5L94.5 350.0L95.5 349.0L94.5 348.0L93.5 335.0L99.0 330.5L108.0 325.5ZM76.5 327.0L79.5 327.0L84.5 340.0L85.5 356.0L84.5 357.0L84.5 362.0L82.5 366.0L82.5 369.0L78.5 377.0L77.0 378.5L73.0 378.5L70.5 376.0L70.5 373.0L68.5 370.0L67.5 358.0L66.5 356.0L67.5 355.0L68.5 343.0L70.5 340.0L72.5 333.0ZM121.5 351.0L124.0 350.5L124.5 353.0L112.0 367.5L99.0 375.5L97.0 375.5L94.0 377.5L88.5 377.0L94.5 368.0L103.0 359.5L113.0 353.5Z" />
      </svg>
    );
    case 'fifafm': return (
      <svg {...sv}>
        <rect x={38} y={46} width={124} height={108} fill="none" stroke={accent} strokeWidth={3} rx={3} />
        <line x1={38} y1={100} x2={162} y2={100} stroke={accent} strokeWidth={2.4} />
        <circle cx={100} cy={100} r={22} fill="none" stroke={accent} strokeWidth={2.4} />
        <rect x={74} y={46} width={52} height={15} fill="none" stroke={accent} strokeWidth={2} />
        <rect x={74} y={139} width={52} height={15} fill="none" stroke={accent} strokeWidth={2} />
        <line x1={100} y1={70} x2={128} y2={86} stroke={c3} strokeWidth={1.6} strokeDasharray="2 4" />
        <line x1={100} y1={70} x2={74} y2={88} stroke={c3} strokeWidth={1.6} strokeDasharray="2 4" />
        <circle cx={100} cy={70} r={5.5} fill={c3} />
        <circle cx={74} cy={88} r={5.5} fill={accent} />
        <circle cx={128} cy={86} r={5.5} fill={accent} />
        <circle cx={60} cy={120} r={5.5} fill={accent} />
        <circle cx={100} cy={124} r={5.5} fill={accent} />
        <circle cx={140} cy={120} r={5.5} fill={accent} />
      </svg>
    );
    case 'gaming': return (
      <svg {...sv}>
        {[0,1,2].flatMap(j => [0,1,2].map(i => (
          <rect key={`${i}-${j}`} x={26 + i * 13} y={150 + j * 13} width={10} height={10} fill={(i + j) % 2 ? c3 : accent} opacity={0.45} />
        )))}
        <rect x={28} y={69} width={144} height={70} rx={35} fill={accent} />
        <rect x={48} y={99.5} width={30} height={9} rx={3} fill={bg} />
        <rect x={58.5} y={89} width={9} height={30} rx={3} fill={bg} />
        <circle cx={137} cy={90} r={6.5} fill={c3} />
        <circle cx={150} cy={104} r={6.5} fill={bg} />
        <circle cx={124} cy={104} r={6.5} fill={bg} />
        <circle cx={137} cy={118} r={6.5} fill={c3} />
      </svg>
    );
    case 'pokemon': return (
      <svg {...sv}>
        <circle cx={100} cy={100} r={84} fill="none" stroke={c3} strokeWidth={2} strokeDasharray="2 11" opacity={0.55} />
        <circle cx={100} cy={100} r={62} fill={c2} />
        <path d="M38 100 A62 62 0 0 1 162 100 Z" fill={accent} />
        <rect x={38} y={94} width={124} height={12} fill={ink} />
        <circle cx={100} cy={100} r={17} fill={bg} />
        <circle cx={100} cy={100} r={17} fill="none" stroke={ink} strokeWidth={4} />
        <circle cx={100} cy={100} r={7} fill={c2} />
        <circle cx={100} cy={100} r={7} fill="none" stroke={ink} strokeWidth={2} />
        {ht(150, 150, 3, 2, 9, 2.4, 0.45, accent)}
      </svg>
    );
    case 'music': return (
      <svg {...sv}>
        <circle cx={82} cy={92} r={62} fill={accent} />
        {[50,40,30,20].map(rr => <circle key={rr} cx={82} cy={92} r={rr} fill="none" stroke={bg} strokeWidth={1.3} opacity={0.5} />)}
        <circle cx={82} cy={92} r={12} fill={c3} />
        <circle cx={82} cy={92} r={4} fill={bg} />
        {[0,1,2,3,4].map(i => <rect key={i} x={120 + i * 14} y={32} width={12} height={42} fill={c2} stroke={ink} strokeWidth={1} />)}
        {[0,1,3].map(i => <rect key={i} x={129 + i * 14} y={32} width={7} height={26} fill={ink} />)}
        {[150,160,170].map(y => <line key={y} x1={108} y1={y} x2={184} y2={y} stroke={ink} strokeWidth={1} opacity={0.35} />)}
        <circle cx={124} cy={170} r={7} fill={c3} />
        <line x1={131} y1={170} x2={131} y2={146} stroke={c3} strokeWidth={2.4} />
        <circle cx={154} cy={160} r={7} fill={c3} />
        <line x1={161} y1={160} x2={161} y2={136} stroke={c3} strokeWidth={2.4} />
      </svg>
    );
    case 'piano': return (
      <svg {...sv}>
        <rect x={34} y={68} width={132} height={62} fill={c2} stroke={ink} strokeWidth={2} rx={2} />
        {[1,2,3,4,5,6].map(i => <line key={i} x1={34 + i * 18.85} y1={68} x2={34 + i * 18.85} y2={130} stroke={ink} strokeWidth={1.4} />)}
        {[0,1,3,4,5].map(i => <rect key={i} x={47 + i * 18.85} y={68} width={11} height={38} fill={ink} />)}
        <circle cx={150} cy={44} r={9} fill={accent} />
        <line x1={159} y1={44} x2={159} y2={16} stroke={accent} strokeWidth={3} strokeLinecap="round" />
        {ht(40, 148, 3, 2, 11, 2.6, 0.5, accent)}
      </svg>
    );
    case 'listening': return (
      <svg {...sv}>
        {[1,2,3].map(i => <path key={i} d={`M150 ${96 - i * 15} A ${i * 15} ${i * 15} 0 0 1 150 ${96 + i * 15}`} fill="none" stroke={c3} strokeWidth={3} strokeLinecap="round" opacity={0.65} />)}
        <path d="M52 112 V92 A48 48 0 0 1 148 92 V112" fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" />
        <rect x={40} y={106} width={22} height={42} rx={9} fill={accent} />
        <rect x={138} y={106} width={22} height={42} rx={9} fill={accent} />
        {ht(44, 150, 3, 2, 10, 2.4, 0.45, accent)}
      </svg>
    );
    case 'food': return (
      <svg {...sv}>
        <circle cx={100} cy={108} r={72} fill="none" stroke={c3} strokeWidth={2} opacity={0.5} />
        {[80,104].map(x => <path key={x} d={`M${x} 70 C ${x - 9} 56 ${x + 9} 48 ${x} 34 C ${x - 7} 24 ${x + 7} 18 ${x} 8`} fill="none" stroke={c2} strokeWidth={3} strokeLinecap="round" opacity={0.55} />)}
        <path d="M40 96 H160 A60 56 0 0 1 40 96 Z" fill={accent} />
        <rect x={36} y={90} width={128} height={8} rx={4} fill={accent} />
        {[0,1,2,3].map(i => <path key={i} d={`M${58 + i * 16} 92 C ${50 + i * 16} 116 ${86 + i * 16} 124 ${76 + i * 16} 144`} fill="none" stroke={c2} strokeWidth={4} strokeLinecap="round" opacity={0.85} />)}
        <circle cx={120} cy={116} r={12} fill={c2} />
        <circle cx={120} cy={116} r={5} fill={c3} />
        <line x1={152} y1={30} x2={98} y2={84} stroke={c3} strokeWidth={5} strokeLinecap="round" />
        <line x1={168} y1={40} x2={110} y2={88} stroke={c3} strokeWidth={5} strokeLinecap="round" />
        {ht(150, 152, 3, 2, 9, 2.2, 0.4, c2)}
      </svg>
    );
    case 'noodles': return (
      <svg {...sv}>
        <circle cx={100} cy={104} r={70} fill="none" stroke={c3} strokeWidth={2} opacity={0.45} />
        <path d="M44 92 H156 A56 52 0 0 1 44 92 Z" fill={accent} />
        <rect x={40} y={86} width={120} height={8} rx={4} fill={accent} />
        {[0,1,2,3].map(i => <path key={i} d={`M${58 + i * 15} 92 C ${48 + i * 15} 116 ${86 + i * 15} 126 ${74 + i * 15} 146`} fill="none" stroke={c2} strokeWidth={5} strokeLinecap="round" opacity={0.9} />)}
        <line x1={150} y1={28} x2={98} y2={82} stroke={c3} strokeWidth={5} strokeLinecap="round" />
        <line x1={166} y1={38} x2={110} y2={86} stroke={c3} strokeWidth={5} strokeLinecap="round" />
        <circle cx={118} cy={120} r={11} fill={c2} />
        <circle cx={118} cy={120} r={4} fill={c3} />
      </svg>
    );
    case 'cooking': return (
      <svg {...sv}>
        {[80,104,128].map(x => <path key={x} d={`M${x} 150 C ${x - 8} 138 ${x + 8} 130 ${x} 116`} fill="none" stroke={c3} strokeWidth={4} strokeLinecap="round" opacity={0.7} />)}
        <circle cx={100} cy={98} r={52} fill={accent} />
        <circle cx={100} cy={98} r={52} fill="none" stroke={ink} strokeWidth={2} opacity={0.18} />
        <rect x={150} y={92} width={46} height={12} rx={6} fill={accent} />
        <circle cx={90} cy={96} r={16} fill={c2} />
        <circle cx={90} cy={96} r={7} fill={c3} />
        <circle cx={118} cy={104} r={9} fill={c2} />
        {ht(94, 58, 3, 1, 12, 3, 0.4, c2)}
      </svg>
    );
    default: return <svg {...sv}><circle cx={100} cy={100} r={40} fill={accent} /></svg>;
  }
}

// ─── Slime reveal ─────────────────────────────────────────────────────────
function buildSlimePath(cx: number, cy: number, progress: number): string {
  if (progress <= 0) return `M ${cx} ${cy} Z`;
  const maxR = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
  const baseR = maxR * progress;
  const amp = Math.min(baseR * 0.10, 32);
  const phase = progress * Math.PI * 6;
  const N = 80;
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wave = amp * (Math.sin(5 * a + phase) * 0.65 + Math.sin(9 * a - phase * 0.7) * 0.35);
    const r = Math.max(0, baseR + wave);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

// ─── Card layout ──────────────────────────────────────────────────────────
const CARD_LAYOUT = [
  { x: 74,  y: 96,  w: 452, h: 626, rot: -2.2, ts: '6.4rem',  big: true  },
  { x: 556, y: 74,  w: 300, h: 372, rot:  2.8, ts: '2.05rem', big: false },
  { x: 592, y: 454, w: 300, h: 336, rot: -3.0, ts: '2.05rem', big: false },
];

function Poster({ d, layout, onJump }: { d: CardData; layout: typeof CARD_LAYOUT[0]; onJump?: () => void }) {
  const { pal, titleColor, capColor } = d;
  return (
    <div style={{
      position: 'absolute', left: layout.x, top: layout.y, width: layout.w, height: layout.h,
      transform: `rotate(${layout.rot.toFixed(2)}deg)`,
      background: pal.bg, borderRadius: 3, overflow: 'hidden',
      boxShadow: '0 22px 50px rgba(40,30,15,.2),0 4px 12px rgba(40,30,15,.1)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Pin tab */}
      <div style={{ position: 'absolute', left: '50%', top: -15, width: 2, height: 15, background: '#bcae96', transform: 'translateX(-50%)' }}>
        <div style={{ position: 'absolute', left: '50%', top: -9, width: 30, height: 11, borderRadius: 6, background: '#cfc1a6', transform: 'translateX(-50%)', boxShadow: '0 2px 4px rgba(40,30,15,.18)' }} />
      </div>
      {/* Art */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '30px 30px 10px' }}>
        <Art name={d.art} pal={pal} />
      </div>
      {/* Meta */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '0 28px 26px' }}>
        <span style={{ fontFamily: BODY, fontSize: '.54rem', letterSpacing: '.24em', textTransform: 'uppercase', color: capColor, opacity: 0.85, marginBottom: 7 }}>
          {d.cap}
        </span>
        <span style={{
          fontFamily: DISPLAY, fontStyle: 'italic', fontWeight: 500,
          lineHeight: 0.92, letterSpacing: '-.01em', color: titleColor,
          fontSize: layout.ts,
          ...(layout.big ? { marginTop: '-26px' } : {}),
        }}>
          {d.title}
        </span>
        {d.badge && (
          <span style={{ alignSelf: 'flex-start', marginTop: 12, fontFamily: BODY, fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, border: `1px solid ${capColor}`, color: capColor, opacity: 0.9 }}>
            {d.badge}
          </span>
        )}
        {d.note && (
          <>
            <div style={{ height: 1, width: 34, marginTop: 14, background: capColor, opacity: 0.55 }} />
            <span style={{ fontFamily: BODY, fontSize: '.82rem', lineHeight: 1.56, marginTop: 13, color: titleColor, opacity: 0.92 }}>
              {d.note}
            </span>
          </>
        )}
        {d.link && (
          <a href={d.link} target="_blank" rel="noopener noreferrer"
            onPointerDown={e => e.stopPropagation()}
            style={{ alignSelf: 'flex-start', marginTop: 13, fontFamily: BODY, fontSize: '.6rem', letterSpacing: '.16em', textTransform: 'uppercase', borderBottom: `1px solid ${capColor}`, paddingBottom: 2, color: capColor, cursor: 'pointer', textDecoration: 'none' }}>
            {d.linkLabel}
          </a>
        )}
        {d.jump != null && onJump && (
          <button onClick={e => { e.stopPropagation(); onJump(); }}
            onPointerDown={e => e.stopPropagation()}
            style={{ alignSelf: 'flex-start', marginTop: 11, fontFamily: BODY, fontSize: '.6rem', letterSpacing: '.14em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: `1px solid ${capColor}`, padding: '0 0 2px', cursor: 'pointer', color: capColor }}>
            {d.jumpLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────
export function MindMapOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const clipPathRef = useRef<SVGPathElement>(null);
  const revealRaf = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const [ai, setAi] = useState(0);
  const [scale, setScale] = useState(1);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'fling' | 'below' | 'pop'>('idle');

  const swipingRef = useRef(false);
  const aiRef = useRef(0);
  const dxRef = useRef(0);
  const isDragRef = useRef(false);
  const sxRef = useRef(0);
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popRaf = useRef<number | null>(null);

  useEffect(() => { aiRef.current = ai; }, [ai]);

  // Open/close
  useEffect(() => {
    if (open) {
      setMounted(true);
      setAi(0); aiRef.current = 0;
      setPhase('idle'); setDx(0); dxRef.current = 0;
      swipingRef.current = false;
    }
  }, [open]);

  // Resize
  useEffect(() => {
    if (!mounted) return;
    const fn = () => setScale(Math.min(window.innerWidth / 1440, (window.innerHeight - 70) / 840) * 0.98);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [mounted]);

  // Slime reveal
  useEffect(() => {
    if (!mounted) return;
    const pathEl = clipPathRef.current;
    if (!pathEl) return;
    const cx = window.innerWidth * 0.75;
    const cy = window.innerHeight * 0.52;
    const isOpening = open;
    const dur = isOpening ? 950 : 680;
    let t0: number | null = null;
    const tick = (now: number) => {
      if (t0 === null) t0 = now;
      const raw = Math.min((now - t0) / dur, 1);
      const eased = isOpening ? 1 - Math.pow(1 - raw, 3) : raw * raw * raw;
      pathEl.setAttribute('d', buildSlimePath(cx, cy, isOpening ? eased : 1 - eased));
      if (raw < 1) { revealRaf.current = requestAnimationFrame(tick); }
      else if (!isOpening) { setMounted(false); }
    };
    if (revealRaf.current !== null) cancelAnimationFrame(revealRaf.current);
    revealRaf.current = requestAnimationFrame(tick);
    return () => { if (revealRaf.current !== null) cancelAnimationFrame(revealRaf.current); };
  }, [mounted, open]);

  // Swap hobbies
  const swap = useCallback((target: number, dir: number) => {
    if (swipingRef.current) return;
    clearTimeout(t1.current ?? undefined);
    clearTimeout(t3.current ?? undefined);
    if (popRaf.current) cancelAnimationFrame(popRaf.current);
    const sign = dir > 0 ? 1 : -1;
    swipingRef.current = true;
    setPhase('fling');
    setDx(sign * 1150); dxRef.current = sign * 1150;
    setDragging(false);
    t1.current = setTimeout(() => {
      setAi(target); aiRef.current = target;
      setPhase('below'); setDx(0); dxRef.current = 0;
      popRaf.current = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('pop')));
    }, 280);
    t3.current = setTimeout(() => { setPhase('idle'); swipingRef.current = false; }, 940);
  }, []);

  // Stable refs for commit/goTo (avoids stale closures in event handlers)
  const commitRef = useRef<(dir: number) => void>(() => {});
  commitRef.current = (dir: number) => {
    const n = HOBBIES.length;
    swap((aiRef.current + dir + n) % n, dir);
  };
  const goToRef = useRef<(i: number) => void>(() => {});
  goToRef.current = (i: number) => {
    if (i === aiRef.current || swipingRef.current) return;
    swap(i, i > aiRef.current ? 1 : -1);
  };

  // Keyboard
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') commitRef.current(1);
      if (e.key === 'ArrowLeft') commitRef.current(-1);
    };
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  // Scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Pointer drag
  const onDown = useCallback((e: React.PointerEvent) => {
    if (swipingRef.current) return;
    sxRef.current = e.clientX;
    isDragRef.current = true;
    setDragging(true);
    const handleMove = (ev: PointerEvent) => {
      if (!isDragRef.current) return;
      const d = ev.clientX - sxRef.current;
      dxRef.current = d; setDx(d);
    };
    const handleUp = () => {
      if (!isDragRef.current) return;
      isDragRef.current = false;
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      const final = dxRef.current;
      dxRef.current = 0; setDx(0); setDragging(false);
      if (final <= -120) commitRef.current(1);
      else if (final >= 120) commitRef.current(-1);
    };
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  }, []);

  // Cleanup
  useEffect(() => () => {
    clearTimeout(t1.current ?? undefined);
    clearTimeout(t3.current ?? undefined);
    if (popRaf.current) cancelAnimationFrame(popRaf.current);
    if (revealRaf.current) cancelAnimationFrame(revealRaf.current);
  }, []);

  if (!mounted) return null;

  const H = HOBBIES[ai];
  const accent = H.accent;

  let deckTransform = `translateX(${dx}px) rotate(${(dx * 0.015).toFixed(2)}deg)`;
  let deckTransition = dragging ? 'none' : 'transform .46s cubic-bezier(.22,1,.36,1)';
  if (phase === 'fling') {
    deckTransform = `translateX(${dx}px) rotate(${(dx * 0.02).toFixed(2)}deg)`;
    deckTransition = 'transform .28s cubic-bezier(.5,0,.78,.2)';
  } else if (phase === 'below') {
    deckTransform = 'translateY(820px) scale(.82) rotate(2deg)';
    deckTransition = 'none';
  } else if (phase === 'pop') {
    deckTransform = 'translateY(0px) scale(1) rotate(0deg)';
    deckTransition = 'transform .64s cubic-bezier(.34,1.46,.5,1)';
  }

  return (
    <>
      {/* Clip-path SVG */}
      <svg style={{ width: 0, height: 0, position: 'fixed', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 400 }} aria-hidden>
        <defs>
          <clipPath id="mm-slime-clip" clipPathUnits="userSpaceOnUse">
            <path ref={clipPathRef} d={`M ${window.innerWidth * 0.75} ${window.innerHeight * 0.52} Z`} />
          </clipPath>
        </defs>
      </svg>

      {/* Overlay */}
      <div role="dialog" aria-modal aria-label="More About Me"
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          display: 'flex', flexDirection: 'column',
          fontFamily: BODY, color: '#1f1c19',
          background: '#f4f0e7',
          clipPath: 'url(#mm-slime-clip)',
          WebkitFontSmoothing: 'antialiased',
        }}>

        {/* Bar */}
        <div style={{ flexShrink: 0, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 46px', position: 'relative', zIndex: 9 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 1, padding: 0 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.6rem', letterSpacing: '.01em', color: '#1f1c19' }}>Olric</span>
            <span style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: accent, transition: 'color .5s' }}>.</span>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontWeight: 500, fontSize: '1.45rem', lineHeight: 1, color: '#1f1c19' }}>More About Me</div>
            <div style={{ fontFamily: BODY, fontSize: '.52rem', letterSpacing: '.26em', textTransform: 'uppercase', color: accent, opacity: 0.85, marginTop: 5, transition: 'color .5s' }}>A Collection of Interests</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, fontFamily: BODY, fontSize: '.56rem', letterSpacing: '.24em', textTransform: 'uppercase', color: '#9a9183' }}>
            <svg width={26} height={10} viewBox="0 0 26 10" fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke .5s' }}>
              <path d="M6 2 L2 5 L6 8" /><path d="M20 2 L24 5 L20 8" />
            </svg>
            Swipe to explore&nbsp;
            <b style={{ color: accent, fontWeight: 600, transition: 'color .5s' }}>{H.idx} · 04</b>
          </div>
        </div>

        {/* Stage wrap */}
        <div onPointerDown={onDown}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none', cursor: 'grab' }}>

          {/* Kicker */}
          <span style={{ position: 'absolute', top: 22, left: 46, fontFamily: BODY, fontSize: '.55rem', letterSpacing: '.28em', textTransform: 'uppercase', color: accent, opacity: 0.6, zIndex: 6, transition: 'color .5s', pointerEvents: 'none' }}>
            Interests / 02
          </span>

          {/* Corner ornaments */}
          {[
            { top: 84, left: 24, borderTop: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` },
            { top: 84, right: 24, borderTop: `1px solid ${accent}`, borderRight: `1px solid ${accent}` },
            { bottom: 22, left: 24, borderBottom: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` },
            { bottom: 22, right: 24, borderBottom: `1px solid ${accent}`, borderRight: `1px solid ${accent}` },
          ].map((s, i) => (
            <span key={i} style={{ position: 'absolute', width: 22, height: 22, opacity: 0.4, pointerEvents: 'none', zIndex: 6, transition: 'border-color .5s', ...s }} />
          ))}

          {/* Pager dots */}
          <div style={{ position: 'absolute', left: 26, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 8 }}>
            {HOBBIES.map((h, i) => (
              <button key={h.id}
                onClick={e => { e.stopPropagation(); goToRef.current(i); }}
                onPointerDown={e => e.stopPropagation()}
                style={{
                  width: 11, height: 11, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                  background: h.accent, opacity: i === ai ? 1 : 0.4,
                  transform: i === ai ? 'scale(1.5)' : 'scale(1)',
                  transition: 'transform .35s, opacity .35s',
                  boxShadow: '0 2px 5px rgba(40,30,15,.22)',
                }} />
            ))}
          </div>

          {/* Index label */}
          <span style={{ position: 'absolute', left: 18, top: 'calc(50% + 96px)', fontFamily: DISPLAY, fontStyle: 'italic', fontSize: '1.3rem', color: accent, opacity: 0.7, zIndex: 8, transition: 'color .5s', pointerEvents: 'none' }}>
            {H.idx} / 04
          </span>

          {/* Scaled 1440×840 stage */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 1440, height: 840,
            transform: `translate(-50%,-50%) scale(${scale})`,
            transformOrigin: 'center center',
          }}>
            {/* Connection line */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 1440 840" preserveAspectRatio="none">
              <path d="M 1018 392 Q 760 340 524 392" fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="1.5 7" strokeLinecap="round" opacity={0.5} style={{ transition: 'stroke .5s' }} />
            </svg>

            {/* Node dot at connection end */}
            <span style={{ position: 'absolute', left: 1018, top: 392, width: 13, height: 13, transform: 'translate(-50%,-50%)', zIndex: 3 }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 32, height: 32, border: `1px solid ${accent}`, borderRadius: '50%', transform: 'translate(-50%,-50%)', opacity: 0.4, transition: 'border-color .5s' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: accent, transition: 'background .5s' }} />
            </span>

            {/* Portrait */}
            <div style={{ position: 'absolute', right: 34, bottom: 0, height: 768, zIndex: 2 }}>
              <div style={{ position: 'absolute', top: 42, left: -14, right: 18, bottom: 0, borderTop: `1.5px solid ${accent}`, borderLeft: `1.5px solid ${accent}`, borderRight: `1.5px solid ${accent}`, opacity: 0.3, pointerEvents: 'none', transition: 'border-color .5s' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/subject.webp" alt="Olric Zeng" draggable={false}
                onClick={() => commitRef.current(1)}
                onPointerDown={e => e.stopPropagation()}
                style={{ height: 768, width: 'auto', display: 'block', userSelect: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 }} />
              <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl', fontFamily: BODY, fontSize: '.56rem', letterSpacing: '.36em', textTransform: 'uppercase', color: accent, opacity: 0.62, zIndex: 2, transition: 'color .5s' }}>
                Olric Zeng — CS @ Cornell
              </span>
            </div>

            {/* Card deck */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 4,
              transform: deckTransform,
              transition: deckTransition,
            }}>
              {([H.main, H.subs[0], H.subs[1]] as CardData[]).map((d, i) => (
                <Poster key={`${H.id}-${i}`} d={d} layout={CARD_LAYOUT[i]}
                  onJump={d.jump != null ? () => goToRef.current(d.jump!) : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
