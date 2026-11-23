import type { Metadata } from 'next';
import MinddoShowcase from '@/components/MinddoShowcase';

const TITLE = 'MindDo Showcase by Olric Zeng';
const DESCRIPTION =
    'How I built MindDo, a tool that turns student projects into videos, screenshots and shareable showcases.';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: 'https://olriczeng.com/projects/minddo' },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: 'https://olriczeng.com/projects/minddo',
        siteName: 'Olric Zeng',
        images: [
            {
                url: 'https://olriczeng.com/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'MindDo Showcase by Olric Zeng',
            },
        ],
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: ['https://olriczeng.com/opengraph-image'],
    },
};

export default function MinddoPage() {
    return <MinddoShowcase />;
}
