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

/* No `images` on either block: `opengraph-image.tsx` beside this file is the
   card, and naming a raster here would override the route and put the site back
   where it was — one hand-exported PNG, drifting away from the design it claims
   to show. `metadataBase` is what lets the generated route resolve to an
   absolute URL, which is the only kind an unfurl can fetch. */
export const metadata: Metadata = {
    metadataBase: new URL('https://olriczeng.com'),
    title: 'Olric Zeng',
    description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
    openGraph: {
        title: 'Olric Zeng',
        description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
        url: 'https://olriczeng.com',
        siteName: 'Olric Zeng',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Olric Zeng',
        description: 'Portfolio of Olric Zeng — Computer Science at Cornell. Full-stack and infrastructure projects.',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={archivo.variable}>
            <head>
                {/* Blocking, and deliberately so: it runs in the few hundred
                    microseconds before the first paint and decides whether this
                    visitor has already walked through the curtain this session.
                    Doing it in the component instead would mean painting the
                    curtain and then taking it away, which is a black flash on
                    every page the visitor comes back to. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "try{if(sessionStorage.getItem('oz-loaded'))document.documentElement.classList.add('oz-loaded')}catch(e){}",
                    }}
                />
                {/* The portrait stands in the desktop field only, so the preload
                    carries the same media query the composition does — a phone
                    was fetching a 126 KB image at high priority to paint
                    nothing. The srcset here mirrors the img's exactly; a preload
                    that names a different candidate downloads both. */}
                <link
                    rel="preload"
                    as="image"
                    href="/subject.webp"
                    imageSrcSet="/subject-380.webp 380w, /subject-760.webp 760w, /subject.webp 863w"
                    imageSizes="380px"
                    media="(min-width: 768px)"
                    fetchPriority="high"
                />
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
