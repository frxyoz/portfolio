/* The corridor's posters.
 *
 * These eleven drawings are the ones the old poster deck carried, recovered
 * intact and re-inked. Only the palettes changed: a poster pasted up in a
 * station is not part of the sign system — it is advertising stuck to the wall
 * beside it — but it is still printed by the same press, so every one of them
 * is screen-printed in two or three of the system's own colours and nothing
 * else. That is what makes a wall of them read as one campaign rather than as
 * a scrapbook.
 */

import React from 'react';
import {
    SIGNAL, SIGNAL_DEEP, ENAMEL, ENAMEL_LIT, STEEL, STEEL_SOFT,
    SIGN_WHITE, CHALK, SIGNAL_INK_SOFT, ENAMEL_INK_SOFT,
} from '@/design/tokens';

export interface Pal { accent: string; bg: string; c2: string; c3: string; ink: string }

/* Four printing schemes, run down the corridor in rotation. Each is a ground
   plus the two inks that survive on it. */
export const SCHEMES: Record<'enamel' | 'signal' | 'steel' | 'paper', Pal> = {
    /* Deep blue stock, yellow ink. The poster the reference wall is built on. */
    enamel: { accent: SIGNAL, bg: ENAMEL, c2: SIGN_WHITE, c3: ENAMEL_INK_SOFT, ink: ENAMEL_LIT },
    /* Yellow stock, black ink. The loudest sheet on the wall. */
    signal: { accent: STEEL, bg: SIGNAL, c2: SIGN_WHITE, c3: SIGNAL_INK_SOFT, ink: SIGNAL_DEEP },
    /* Black stock, yellow ink. A backlit panel with the lamp behind it. */
    steel: { accent: SIGNAL, bg: STEEL, c2: SIGN_WHITE, c3: SIGNAL_DEEP, ink: STEEL_SOFT },
    /* Paper stock, blue ink. The quiet sheet that lets the others shout. */
    paper: { accent: ENAMEL, bg: SIGN_WHITE, c2: CHALK, c3: SIGNAL, ink: STEEL },
};

/** Ink that reads on a given scheme's ground — for the poster's own lettering. */
export const SCHEME_INK: Record<keyof typeof SCHEMES, string> = {
    enamel: SIGN_WHITE,
    signal: STEEL,
    steel: SIGN_WHITE,
    paper: STEEL,
};
export const SCHEME_SUB: Record<keyof typeof SCHEMES, string> = {
    enamel: ENAMEL_INK_SOFT,
    signal: SIGNAL_INK_SOFT,
    steel: SIGNAL,
    paper: ENAMEL,
};

export function ht(x: number, y: number, cols: number, rows: number, gap: number, r0: number, dr: number, f: string) {
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
function hexPts(cx: number, cy: number, r: number, rot = 0): string {
    let s = '';
    for (let k = 0; k < 6; k++) {
        const a = (rot + k * 60) * Math.PI / 180;
        s += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
    }
    return s.trim();
}

export default function Art({ name, pal }: { name: string; pal: Pal }) {
    const { accent, bg, c2, c3, ink } = pal;
    const sv = { viewBox: '0 0 200 200', width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet' as const };
    switch (name) {
        case 'soccer': return (
            <svg {...sv}>
                <circle cx={100} cy={100} r={90} fill="none" stroke={c3} strokeWidth={2.6} strokeDasharray="2 12" opacity={0.7} />
                <path d="M150 38 A88 88 0 0 1 172 122" fill="none" stroke={c3} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
                <circle cx={100} cy={100} r={66} fill={accent} />
                {/* centre hexagon — flat-top */}
                <polygon points={hexPts(100, 100, 22)} fill={bg} />
                {/* 6 dark pentagons — at hex EDGE directions (+30°) */}
                {[0, 1, 2, 3, 4, 5].map(k => {
                    const aDeg = k * 60 + 30;
                    const a = aDeg * Math.PI / 180;
                    return <polygon key={k} points={pent(100 + 30 * Math.cos(a), 100 + 30 * Math.sin(a), 11, aDeg + 234)} fill={ink} opacity={0.82} />;
                })}
                {/* 6 outer hexagons — at hex VERTEX directions (0°, 60°, …) */}
                {[0, 1, 2, 3, 4, 5].map(k => {
                    const a = k * 60 * Math.PI / 180;
                    return <polygon key={k} points={hexPts(100 + 50 * Math.cos(a), 100 + 50 * Math.sin(a), 13)} fill={bg} opacity={0.88} />;
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
                {[0, 1, 2].flatMap(j => [0, 1, 2].map(i => (
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
                {[50, 40, 30, 20].map(rr => <circle key={rr} cx={82} cy={92} r={rr} fill="none" stroke={bg} strokeWidth={1.3} opacity={0.5} />)}
                <circle cx={82} cy={92} r={12} fill={c3} />
                <circle cx={82} cy={92} r={4} fill={bg} />
                {[0, 1, 2, 3, 4].map(i => <rect key={i} x={120 + i * 14} y={32} width={12} height={42} fill={c2} stroke={ink} strokeWidth={1} />)}
                {[0, 1, 3].map(i => <rect key={i} x={129 + i * 14} y={32} width={7} height={26} fill={ink} />)}
                {[150, 160, 170].map(y => <line key={y} x1={108} y1={y} x2={184} y2={y} stroke={ink} strokeWidth={1} opacity={0.35} />)}
                <circle cx={124} cy={170} r={7} fill={c3} />
                <line x1={131} y1={170} x2={131} y2={146} stroke={c3} strokeWidth={2.4} />
                <circle cx={154} cy={160} r={7} fill={c3} />
                <line x1={161} y1={160} x2={161} y2={136} stroke={c3} strokeWidth={2.4} />
            </svg>
        );
        case 'piano': return (
            <svg {...sv}>
                <rect x={34} y={68} width={132} height={62} fill={c2} stroke={ink} strokeWidth={2} rx={2} />
                {[1, 2, 3, 4, 5, 6].map(i => <line key={i} x1={34 + i * 18.85} y1={68} x2={34 + i * 18.85} y2={130} stroke={ink} strokeWidth={1.4} />)}
                {[0, 1, 3, 4, 5].map(i => <rect key={i} x={47 + i * 18.85} y={68} width={11} height={38} fill={ink} />)}
                <circle cx={150} cy={44} r={9} fill={accent} />
                <line x1={159} y1={44} x2={159} y2={16} stroke={accent} strokeWidth={3} strokeLinecap="round" />
                {ht(40, 148, 3, 2, 11, 2.6, 0.5, accent)}
            </svg>
        );
        case 'listening': return (
            <svg {...sv}>
                {[1, 2, 3].map(i => <path key={i} d={`M150 ${96 - i * 15} A ${i * 15} ${i * 15} 0 0 1 150 ${96 + i * 15}`} fill="none" stroke={c3} strokeWidth={3} strokeLinecap="round" opacity={0.65} />)}
                <path d="M52 112 V92 A48 48 0 0 1 148 92 V112" fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" />
                <rect x={40} y={106} width={22} height={42} rx={9} fill={accent} />
                <rect x={138} y={106} width={22} height={42} rx={9} fill={accent} />
                {ht(44, 150, 3, 2, 10, 2.4, 0.45, accent)}
            </svg>
        );
        case 'food': return (
            <svg {...sv}>
                <circle cx={100} cy={108} r={72} fill="none" stroke={c3} strokeWidth={2} opacity={0.5} />
                {[80, 104].map(x => <path key={x} d={`M${x} 70 C ${x - 9} 56 ${x + 9} 48 ${x} 34 C ${x - 7} 24 ${x + 7} 18 ${x} 8`} fill="none" stroke={c2} strokeWidth={3} strokeLinecap="round" opacity={0.55} />)}
                <path d="M40 96 H160 A60 56 0 0 1 40 96 Z" fill={accent} />
                <rect x={36} y={90} width={128} height={8} rx={4} fill={accent} />
                {[0, 1, 2, 3].map(i => <path key={i} d={`M${58 + i * 16} 92 C ${50 + i * 16} 116 ${86 + i * 16} 124 ${76 + i * 16} 144`} fill="none" stroke={c2} strokeWidth={4} strokeLinecap="round" opacity={0.85} />)}
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
                {[0, 1, 2, 3].map(i => <path key={i} d={`M${58 + i * 15} 92 C ${48 + i * 15} 116 ${86 + i * 15} 126 ${74 + i * 15} 146`} fill="none" stroke={c2} strokeWidth={5} strokeLinecap="round" opacity={0.9} />)}
                <line x1={150} y1={28} x2={98} y2={82} stroke={c3} strokeWidth={5} strokeLinecap="round" />
                <line x1={166} y1={38} x2={110} y2={86} stroke={c3} strokeWidth={5} strokeLinecap="round" />
                <circle cx={118} cy={120} r={11} fill={c2} />
                <circle cx={118} cy={120} r={4} fill={c3} />
            </svg>
        );
        case 'cooking': return (
            <svg {...sv}>
                {[80, 104, 128].map(x => <path key={x} d={`M${x} 150 C ${x - 8} 138 ${x + 8} 130 ${x} 116`} fill="none" stroke={c3} strokeWidth={4} strokeLinecap="round" opacity={0.7} />)}
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
