'use client';

import { useEffect, useMemo, useState, CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BOARD_INK, RULE_DARK, STEEL_SOFT } from '@/design/tokens';

/* The split-flap drum. A real board's flaps are stacked in one fixed order, so
   a cell reaching "M" passes through every character before it — that ordering,
   not randomness, is what makes the cascade read as machinery. */
const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,·—-/&+:()@#$%\'!?';
const DRUM_INDEX = new Map([...DRUM].map((c, i) => [c, i]));

/** One tick is one flap turning over. 38ms is close to the real mechanism and
 *  slow enough that the eye reads individual characters rather than a blur. */
const TICK_MS = 38;
/** No cell travels further than this, however deep in the drum its letter sits.
 *  Without a ceiling a row ending in "%" takes three seconds longer than a row
 *  ending in "B", and the board stops landing as one gesture. */
const MAX_STEPS = 14;

export interface FlapTextProps {
    text: string;
    /** Hold the board still until this turns true — a row landing before the
     *  visitor can see it has spent the one moment it had. */
    play?: boolean;
    /** Ticks to wait before this row starts, so rows land in sequence. */
    startDelay?: number;
    /** Ticks between one character and the next within this row. */
    stagger?: number;
    /** `cell` draws the physical flap: matte face, seam, gap. `bare` animates
     *  the letters alone, for lettering that is painted on a panel rather than
     *  hung on a drum. */
    variant?: 'cell' | 'bare';
    style?: CSSProperties;
    cellStyle?: CSSProperties;
    className?: string;
}

export default function FlapText({
    text,
    play = true,
    startDelay = 0,
    stagger = 1,
    variant = 'cell',
    style,
    cellStyle,
    className,
}: FlapTextProps) {
    const reduced = useReducedMotion();

    /* Each cell's schedule: when it starts turning and how far it has to travel.
       Fixed for the life of the string rather than recomputed per frame. */
    const { plan, lastTick } = useMemo(() => {
        const p = [...text.toUpperCase()].map((c, i) => {
            const target = DRUM_INDEX.get(c);
            const steps = target === undefined ? 1 : Math.min(target + 2, MAX_STEPS);
            return { char: c, target, start: startDelay + i * stagger, steps };
        });
        return { plan: p, lastTick: p.reduce((m, x) => Math.max(m, x.start + x.steps), 0) };
    }, [text, startDelay, stagger]);

    const armed = !reduced && play;
    /* One run of the board is identified by everything that would restart it.
       Infinity means settled: every cell shows its own letter and nothing is
       scheduled. Every first render starts settled, server and client alike —
       the cascade is armed from the effect below. Starting at tick 0 in the
       initial state made the run depend on `reduced`, which the server cannot
       know: it shipped "A" where the client rendered "O" and React threw the
       whole tree away on hydration. Settled first also means the real string,
       not a drum position, is what lands in the HTML. */
    const runKey = `${text}|${armed}|${startDelay}|${stagger}`;
    const [run, setRun] = useState({ key: runKey, tick: Infinity });
    if (run.key !== runKey) setRun({ key: runKey, tick: Infinity });

    useEffect(() => {
        if (!armed) return;
        let t = 0;
        /* The run starts on the first interval rather than from the effect
           body: the settled string is what both renders agree on, and the
           first flap is one tick away from it.

           One interval per row, cleared the moment its last flap lands. A
           single shared ticker kept the columns in phase but left a loop alive
           for the page's lifetime and stalled whenever its subscriber set
           briefly emptied; a row that owns its own timer cannot be stopped by
           another row. The guard on `key` drops any frame belonging to a
           previous run. */
        const id = setInterval(() => {
            t += 1;
            const done = t > lastTick;
            setRun(r => (r.key === runKey ? { key: runKey, tick: done ? Infinity : t } : r));
            if (done) clearInterval(id);
        }, TICK_MS);
        return () => clearInterval(id);
    }, [runKey, armed, lastTick]);

    const tick = run.tick;
    const settled = tick === Infinity;

    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                gap: variant === 'cell' ? 2 : 0,
                whiteSpace: 'pre',
                position: 'relative',
                ...style,
            }}
        >
            {/* The turning cells are noise to a screen reader — a row mid-cascade
                spells nonsense. The real string is carried once, off-screen, and
                the machinery below is hidden from the tree entirely. */}
            <span style={{
                position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
                overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
            }}>
                {text}
            </span>

            {plan.map((p, i) => {
                const remaining = settled ? 0 : p.start + p.steps - tick;
                let glyph: string;
                if (remaining <= 0 || p.target === undefined) {
                    glyph = p.char;
                } else if (tick < p.start) {
                    glyph = ' ';
                } else {
                    glyph = DRUM[(p.target - remaining + DRUM.length * 4) % DRUM.length];
                }
                const turning = !settled && remaining > 0 && tick >= p.start;

                return (
                    <span
                        key={i}
                        aria-hidden="true"
                        style={{
                            display: 'inline-block',
                            textAlign: 'center',
                            minWidth: variant === 'cell' ? '0.78em' : undefined,
                            position: 'relative',
                            transformOrigin: 'center center',
                            transform: turning ? 'scaleY(0.86)' : 'scaleY(1)',
                            transition: turning ? 'none' : 'transform 110ms cubic-bezier(.22, 1, .36, 1)',
                            ...(variant === 'cell'
                                ? {
                                    background: `linear-gradient(180deg, ${STEEL_SOFT} 0 calc(50% - 0.5px), ${RULE_DARK} calc(50% - 0.5px) calc(50% + 0.5px), #202020 calc(50% + 0.5px) 100%)`,
                                    color: BOARD_INK,
                                    padding: '0.1em 0.06em',
                                }
                                : null),
                            ...cellStyle,
                        }}
                    >
                        {glyph === ' ' ? ' ' : glyph}
                    </span>
                );
            })}
        </span>
    );
}
