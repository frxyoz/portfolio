import type { CSSProperties } from 'react';

/** Present to assistive technology, absent to the eye. Not `display: none` and
 *  not `visibility: hidden` — both of those take the text out of the
 *  accessibility tree along with the pixels, which is the opposite of the job. */
export const SR_ONLY: CSSProperties = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

/** A sign names the destination before you walk to it, and a link that throws
 *  the visitor into a new tab is making a claim about where the door goes. The
 *  `arrow-up-right` pictogram carries that visually; this carries the same fact
 *  for a screen reader, which cannot see the arrow. Rendered inside the anchor
 *  so it lands in the accessible name rather than beside it. */
export function NewTabNote() {
    return <span style={SR_ONLY}> (opens in a new tab)</span>;
}
