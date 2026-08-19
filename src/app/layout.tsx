import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/Cursor';
import LoadingScreen from '@/components/LoadingScreen';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/* One family for the whole sign system, loaded with both variable axes. A
   wayfinding programme is built from one face read at many widths and weights —
   the condensed cut carries the board's column labels, the expanded black cut
   carries the panel lettering, and nothing else is needed. */
const archivo = Archivo({
    subsets: ['latin'],
    axes: ['wdth'],
    variable: '--font-sign',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Olric Zeng',
    description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
    openGraph: {
        title: 'Olric Zeng',
        description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
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
        description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
        images: ['https://olriczeng.com/og-image.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={archivo.variable}>
            <head>
                <link rel="preload" as="image" href="/subject.webp" fetchPriority="high" />
            </head>
            <body>
                {/* THESIS: A stranger with twenty seconds and eight tabs open is a traveler in a
                    terminal, so this page is a wayfinding sign system that orients them at a
                    glance. It refuses the developer-portfolio arrangement of a dark hero, a
                    one-line role and a grid of project cards.
                    OWN-WORLD: European airport and rail signage. Signal-yellow enamel fields,
                    deep enamel-blue service plates, black steel rails, matte split-flap cells.
                    One face (Archivo variable) across every width and weight, tabular figures.
                    Colour is category by law: red is awards only, green is deployed-and-live
                    only, yellow is the path forward. Pictograms are solid, never stroked.
                    STORY: The visitor reads a live departures board of four routes — background,
                    projects, the case study, contact — sees one deployed system and three awards
                    counted on the projects line, understands within seconds that this is an
                    engineer who ships, and walks to a platform.
                    FIRST VIEWPORT: Black rail across the top with the OZ signal plate and a live
                    clock. Below it a full-bleed signal-yellow field: OLRIC ZENG at sign scale in
                    black expanded caps, the cutout portrait standing in the field at right, a
                    role strip and the resume gate button. The lower band is the black departures
                    board — four destinations flapping in character by character, each with its
                    platform number, its service and what that service is made of.
                    FORM: Transit wayfinding, candidate 6 of 7; seed key 94dd851c.
                    FINISH: unreviewed and undocumented is unfinished; this build ends with the
                    finish review, the verdict, DESIGN.md, and every shipping raster carrying its
                    provenance. */}
                <a className="skip-link" href="#main">Skip to content</a>
                <LoadingScreen />
                <Cursor />
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
