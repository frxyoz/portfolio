'use client';

/* The sign system's pictograms. Solid silhouettes on a 24×24 grid with no
   strokes anywhere — that is what separates a wayfinding symbol from a UI icon,
   and it is why these survive being printed at 8px on a rail or 96px on a
   panel. Every glyph is authored here; nothing is a Unicode character standing
   in for a drawing. */

export type PictogramName =
    | 'arrow-right' | 'arrow-left' | 'arrow-down' | 'arrow-up-right'
    | 'close' | 'clock' | 'pin' | 'mail' | 'doc'
    | 'stack' | 'braces' | 'graph'
    | 'cap' | 'case' | 'github' | 'linkedin' | 'play' | 'check';

const PATHS: Record<PictogramName, string> = {
    /* DOT-style arrows: a solid triangular head on a bar of the same weight. */
    'arrow-right': 'M13.2 3 L22 12 L13.2 21 L13.2 15.6 L2 15.6 L2 8.4 L13.2 8.4 Z',
    'arrow-left': 'M10.8 3 L2 12 L10.8 21 L10.8 15.6 L22 15.6 L22 8.4 L10.8 8.4 Z',
    'arrow-down': 'M21 10.8 L12 22 L3 10.8 L8.4 10.8 L8.4 2 L15.6 2 L15.6 10.8 Z',
    'arrow-up-right': 'M8 2 L22 2 L22 16 L17.2 16 L17.2 10.2 L6.1 21.3 L2.7 17.9 L13.8 6.8 L8 6.8 Z',
    close: 'M4.6 2 L12 9.4 L19.4 2 L22 4.6 L14.6 12 L22 19.4 L19.4 22 L12 14.6 L4.6 22 L2 19.4 L9.4 12 L2 4.6 Z',
    /* Solid disc with the hands cut out, so it stays a silhouette at any size. */
    clock: 'M12 1.5 A10.5 10.5 0 1 0 12 22.5 A10.5 10.5 0 1 0 12 1.5 Z M13.3 5.4 L13.3 11.5 L18.4 14.4 L17.1 16.6 L10.7 12.9 L10.7 5.4 Z',
    pin: 'M12 1.6 C7.6 1.6 4.1 5.1 4.1 9.5 C4.1 15.4 12 22.4 12 22.4 C12 22.4 19.9 15.4 19.9 9.5 C19.9 5.1 16.4 1.6 12 1.6 Z M12 12.6 A3.2 3.2 0 1 1 12 6.2 A3.2 3.2 0 1 1 12 12.6 Z',
    mail: 'M1.5 4.5 L22.5 4.5 L22.5 19.5 L1.5 19.5 Z M4.2 6.9 L12 13.3 L19.8 6.9 L19.8 9.1 L12 15.5 L4.2 9.1 Z',
    doc: 'M4 1.5 L14.6 1.5 L20 6.9 L20 22.5 L4 22.5 Z M13.6 3.4 L13.6 7.9 L18.1 7.9 Z M7 11.5 L17 11.5 L17 13.4 L7 13.4 Z M7 15.4 L17 15.4 L17 17.3 L7 17.3 Z',
    /* Stacked server shelves — infrastructure. */
    stack: 'M2 3 L22 3 L22 8.4 L2 8.4 Z M2 10.3 L22 10.3 L22 15.7 L2 15.7 Z M2 17.6 L22 17.6 L22 23 L2 23 Z M4.4 4.9 L4.4 6.5 L8.4 6.5 L8.4 4.9 Z M4.4 12.2 L4.4 13.8 L8.4 13.8 L8.4 12.2 Z M4.4 19.5 L4.4 21.1 L8.4 21.1 L8.4 19.5 Z',
    /* Angle brackets — code. */
    braces: 'M9.4 3.6 L11.9 6.1 L6 12 L11.9 17.9 L9.4 20.4 L1 12 Z M14.6 3.6 L23 12 L14.6 20.4 L12.1 17.9 L18 12 L12.1 6.1 Z',
    /* Three linked nodes — a model, a graph, a pipeline. */
    graph: 'M4 2.5 A3.4 3.4 0 1 1 4 9.3 A3.4 3.4 0 1 1 4 2.5 Z M20 2.5 A3.4 3.4 0 1 1 20 9.3 A3.4 3.4 0 1 1 20 2.5 Z M12 14.7 A3.4 3.4 0 1 1 12 21.5 A3.4 3.4 0 1 1 12 14.7 Z M5.2 8.3 L12.9 15.1 L11.4 16.8 L3.7 10 Z M18.8 8.3 L20.3 10 L12.6 16.8 L11.1 15.1 Z',
    /* Mortarboard. */
    cap: 'M12 2.6 L23.5 8.2 L12 13.8 L0.5 8.2 Z M6.2 10.8 L12 13.8 L17.8 10.8 L17.8 16.4 C17.8 18.9 15.2 20.9 12 20.9 C8.8 20.9 6.2 18.9 6.2 16.4 Z M21.6 9.6 L23 9.6 L23 16.4 L21.6 16.4 Z',
    /* Briefcase. */
    case: 'M9 2.5 L15 2.5 L15 5.5 L21.8 5.5 L21.8 11.4 L2.2 11.4 L2.2 5.5 L9 5.5 Z M10.9 4.4 L10.9 5.5 L13.1 5.5 L13.1 4.4 Z M2.2 13.3 L10.6 13.3 L10.6 15.2 L13.4 15.2 L13.4 13.3 L21.8 13.3 L21.8 21.5 L2.2 21.5 Z',
    github: 'M12 1.2 C6 1.2 1.2 6.1 1.2 12.1 C1.2 16.9 4.3 21 8.6 22.4 C9.1 22.5 9.3 22.2 9.3 21.9 C9.3 21.7 9.3 20.9 9.3 20 C6.3 20.6 5.7 18.5 5.7 18.5 C5.2 17.3 4.5 16.9 4.5 16.9 C3.5 16.3 4.6 16.3 4.6 16.3 C5.6 16.4 6.2 17.4 6.2 17.4 C7.1 19 8.7 18.5 9.3 18.2 C9.4 17.5 9.7 17 10 16.8 C7.6 16.5 5.1 15.6 5.1 11.5 C5.1 10.3 5.5 9.3 6.2 8.6 C6.1 8.3 5.7 7.2 6.3 5.6 C6.3 5.6 7.2 5.3 9.3 6.7 C10.1 6.5 11 6.4 12 6.4 C12.9 6.4 13.8 6.5 14.7 6.7 C16.8 5.3 17.7 5.6 17.7 5.6 C18.3 7.2 17.9 8.3 17.8 8.6 C18.5 9.3 18.9 10.3 18.9 11.5 C18.9 15.6 16.4 16.5 14 16.8 C14.4 17.1 14.7 17.8 14.7 18.8 C14.7 20.2 14.7 21.6 14.7 21.9 C14.7 22.2 14.9 22.5 15.4 22.4 C19.7 21 22.8 16.9 22.8 12.1 C22.8 6.1 17.9 1.2 12 1.2 Z',
    linkedin: 'M2.4 2.4 L21.6 2.4 L21.6 21.6 L2.4 21.6 Z M5.4 9.6 L5.4 18.6 L8.7 18.6 L8.7 9.6 Z M7.05 4.9 A2 2 0 1 1 7.05 8.9 A2 2 0 1 1 7.05 4.9 Z M10.8 9.6 L10.8 18.6 L14.1 18.6 L14.1 13.8 C14.1 12.6 14.9 12.1 15.7 12.1 C16.5 12.1 17.1 12.7 17.1 13.9 L17.1 18.6 L20.4 18.6 L20.4 13.3 C20.4 10.6 18.9 9.4 17 9.4 C15.5 9.4 14.6 10.1 14.1 10.9 L14.1 9.6 Z',
    play: 'M4.5 2.4 L21.5 12 L4.5 21.6 Z',
    check: 'M9.3 21.4 L0.8 12.9 L4.2 9.5 L9.3 14.6 L19.8 4.1 L23.2 7.5 Z',
};

/* Glyphs whose subpaths are meant to union rather than cut. Everything else
   uses even-odd, where an inner subpath reverses out of the silhouette — the
   clock's hands, the envelope's flap line, the server's drive slots. */
const NONZERO = new Set<PictogramName>(['cap', 'graph', 'braces']);

export default function Pictogram({
    name,
    size = 20,
    color = 'currentColor',
    title,
    style,
}: {
    name: PictogramName;
    size?: number;
    color?: string;
    /** Only pass this when the pictogram is the sole label for a control. */
    title?: string;
    style?: React.CSSProperties;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            fillRule={NONZERO.has(name) ? 'nonzero' : 'evenodd'}
            clipRule={NONZERO.has(name) ? 'nonzero' : 'evenodd'}
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : true}
            aria-label={title}
            style={{ display: 'block', flexShrink: 0, ...style }}
        >
            <path d={PATHS[name]} />
        </svg>
    );
}
