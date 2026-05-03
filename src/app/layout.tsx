import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Caveat } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/Cursor';
import { Analytics } from '@vercel/analytics/next';

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
    icons: {
        icon: [
            { url: '/icon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', type: 'image/x-icon' },
        ],
    },
    openGraph: {
        title: 'Olric Zeng',
        description: 'Portfolio Website of Olric Zeng: CS @ Cornell, passionate about building software for good.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${caveat.variable}`}>
            <body>
                <Cursor />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
