import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SIGNAL, STEEL, BOARD, SIGN_WHITE, BOARD_INK_SOFT, SIGNAL_INK_SOFT } from '@/design/tokens';

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

// The social render uses the same local Archivo cuts and palette as the site.
// Explicit word spacing avoids Satori collapsing a tracked name into one word.
const font = (name: string) => readFileSync(join(process.cwd(), 'src/app/fonts', name));

export function socialImage(kind: 'portfolio' | 'minddo') {
    const portfolio = kind === 'portfolio';
    const portrait = portfolio
        ? `data:image/png;base64,${readFileSync(join(process.cwd(), 'public/social-portrait.png')).toString('base64')}`
        : undefined;

    return new ImageResponse(
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            fontFamily: 'Archivo', background: SIGNAL, color: STEEL }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 68, flexShrink: 0,
                background: STEEL, color: SIGNAL }}>
                <div style={{ width: 76, height: 68, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: SIGNAL, color: STEEL, fontSize: 28, fontWeight: 800 }}>OZ</div>
                <div style={{ display: 'flex', paddingLeft: 28, fontSize: 19, fontWeight: 700, letterSpacing: '0.12em' }}>
                    OLRICZENG.COM
                </div>
                {!portfolio && <div style={{ display: 'flex', marginLeft: 'auto', paddingRight: 42,
                    fontSize: 19, fontWeight: 700, letterSpacing: '0.1em' }}>ENGINEERING CASE STUDY</div>}
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: portfolio ? 780 : 1200, padding: portfolio ? '30px 52px' : '36px 56px' }}>
                    {portfolio ? <div style={{ display: 'flex', flexDirection: 'column', fontSize: 112,
                        fontWeight: 800, lineHeight: 0.94, letterSpacing: '-0.035em' }}>
                        <div style={{ display: 'flex' }}>OLRIC</div>
                        <div style={{ display: 'flex' }}>ZENG</div>
                    </div> : <div style={{ display: 'flex', fontSize: 112, fontWeight: 800,
                        lineHeight: 1, letterSpacing: '-0.035em' }}>MindDo.AI</div>}
                    <div style={{ display: 'flex', height: 4, width: '100%', background: STEEL, marginTop: 28 }} />
                    <div style={{ display: 'flex', fontSize: portfolio ? 29 : 38, fontWeight: 700,
                        marginTop: 24, lineHeight: 1.2 }}>
                        {portfolio ? 'Computer Science at Cornell' : 'From a student project URL to a complete showcase.'}
                    </div>
                    <div style={{ display: 'flex', marginTop: 14, fontSize: 25, lineHeight: 1.4,
                        color: SIGNAL_INK_SOFT }}>
                        {portfolio ? 'Web apps & infrastructure' : 'Architecture, queues, workers and autoscaling. Built by Olric Zeng.'}
                    </div>
                </div>
                {portfolio && <div style={{ display: 'flex', width: 420, background: SIGN_WHITE,
                    borderLeft: `3px solid ${STEEL}`, alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                    {/* The original cutout stays on its light ground, as on the home page. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={portrait} width={292} height={474} alt="" style={{ objectFit: 'contain', marginBottom: -14 }} />
                </div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', height: 88, flexShrink: 0,
                background: BOARD, color: SIGN_WHITE, padding: '0 52px', gap: 32 }}>
                {(portfolio ? ['FULLSTACK', 'INFRASTRUCTURE', 'MACHINE LEARNING'] : ['FASTAPI', 'CELERY', 'KUBERNETES', 'AWS']).map((label, index) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        {index > 0 && <div style={{ display: 'flex', width: 1, height: 28, background: BOARD_INK_SOFT }} />}
                        <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, letterSpacing: '0.09em' }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>,
        { ...SOCIAL_IMAGE_SIZE, fonts: [
            { name: 'Archivo', data: font('Archivo-Regular.ttf'), weight: 400, style: 'normal' },
            { name: 'Archivo', data: font('Archivo-Bold.ttf'), weight: 700, style: 'normal' },
            { name: 'Archivo', data: font('Archivo-ExtraBold.ttf'), weight: 800, style: 'normal' },
        ] },
    );
}
