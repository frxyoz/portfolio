import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Caveat } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/Cursor';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const cormorant = Cormorant_Garamond({
    weight: ['300', '400', '500', '600'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

const dmSans = DM_Sans({
    weight: ['300', '400', '500', '600'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

const caveat = Caveat({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
    variable: '--font-handwritten',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Olric Zeng',
    description: 'Portfolio Website of Olric Zeng: CS @ Cornell, passionate about building software for good.',
    openGraph: {
        title: 'Olric Zeng',
        description: 'Portfolio Website of Olric Zeng: CS @ Cornell, passionate about building software for good.',
        url: 'https://olriczeng.com',
        siteName: 'Olric Zeng',
        images: [
            {
                url: 'https://olriczeng.com/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Olric Zeng Portfolio',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Olric Zeng',
        description: 'Portfolio Website of Olric Zeng: CS @ Cornell, passionate about building software for good.',
        images: ['https://olriczeng.com/og-image.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${caveat.variable}`}>
            <head>
                <link rel="preload" as="image" href="/subject.webp" fetchPriority="high" />
            </head>
            <body>
                <Cursor />
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
