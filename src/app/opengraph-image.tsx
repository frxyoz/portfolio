import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
    SIGNAL, STEEL, BOARD, BOARD_INK_SOFT, RULE_DARK, SIGNAL_INK_SOFT,
} from '@/design/tokens';

/* The unfurl card. Authored as a route rather than shipped as a raster, because
   a PNG in `public/` is a copy of the design that stops being true the moment
   the design moves — the file this replaces was still showing the gold-and-serif
   world months after that world was retired.
 *
 * Satori renders this, so it is flexbox only: no grid, no variable-font axes, no
 * `clamp`. Archivo ships here as three static instances instead, vendored beside
 * this file so the build never depends on reaching Google. */

export const alt = 'Olric Zeng — Computer Science at Cornell';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const font = (name: string) => readFileSync(join(process.cwd(), 'src/app/fonts', name));

export default async function Image() {
    return new ImageResponse(
        (
            <div style={{
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                fontFamily: 'Archivo', background: SIGNAL,
            }}>
                {/* The rail, with the authority's mark at its head. */}
                <div style={{
                    height: 76, flexShrink: 0, background: STEEL, display: 'flex',
                    alignItems: 'center', borderBottom: `1px solid ${RULE_DARK}`,
                }}>
                    <div style={{
                        width: 76, height: 76, background: SIGNAL, color: STEEL,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 30, fontWeight: 800, letterSpacing: '0.02em',
                    }}>
                        OZ
                    </div>
                    <div style={{
                        display: 'flex', paddingLeft: 26, color: SIGNAL,
                        fontSize: 15, fontWeight: 700, letterSpacing: '0.22em',
                    }}>
                        OLRICZENG.COM
                    </div>
                </div>

                {/* The signal field. */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '0 64px',
                }}>
                    <div style={{
                        display: 'flex', color: STEEL, fontSize: 138, fontWeight: 800,
                        lineHeight: 1, letterSpacing: '-0.035em',
                    }}>
                        OLRIC ZENG
                    </div>
                    {/* The accent bar every section opens on, in steel because the
                        ground is already signal. */}
                    <div style={{ display: 'flex', width: 148, height: 12, background: STEEL, marginTop: 26 }} />
                    <div style={{
                        display: 'flex', marginTop: 22, color: SIGNAL_INK_SOFT,
                        fontSize: 25, fontWeight: 400, letterSpacing: '0.01em',
                    }}>
                        Computer Science at Cornell — backend, infrastructure, and frontend.
                    </div>
                </div>

                {/* The board strip: two figures, both counted from what is on the
                    site rather than written by hand. */}
                <div style={{
                    height: 104, flexShrink: 0, background: BOARD, display: 'flex',
                    alignItems: 'center', padding: '0 64px', gap: 56,
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', color: BOARD_INK_SOFT, fontSize: 14, fontWeight: 700, letterSpacing: '0.2em' }}>
                            IN PRODUCTION
                        </div>
                        <div style={{ display: 'flex', color: SIGNAL, fontSize: 22, fontWeight: 700, letterSpacing: '0.02em' }}>
                            MindDo.AI — queue, workers, autoscaling
                        </div>
                    </div>
                    <div style={{ display: 'flex', width: 1, height: 52, background: RULE_DARK }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', color: BOARD_INK_SOFT, fontSize: 14, fontWeight: 700, letterSpacing: '0.2em' }}>
                            AWARDS
                        </div>
                        <div style={{ display: 'flex', color: SIGNAL, fontSize: 22, fontWeight: 700, letterSpacing: '0.02em' }}>
                            3 first-place awards
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: 'Archivo', data: font('Archivo-Regular.ttf'), weight: 400, style: 'normal' },
                { name: 'Archivo', data: font('Archivo-Bold.ttf'), weight: 700, style: 'normal' },
                { name: 'Archivo', data: font('Archivo-ExtraBold.ttf'), weight: 800, style: 'normal' },
            ],
        },
    );
}
