import type { Metadata } from 'next';
import MinddoShowcase from '@/components/MinddoShowcase';

const TITLE = 'MindDo Showcase — Olric Zeng';
const DESCRIPTION =
    'An asynchronous, autoscaling media-generation pipeline: a student project URL goes in, a full parent-facing showcase package comes out. FastAPI, Celery, Playwright, Claude, Kubernetes + KEDA, deployed on AWS.';

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
                url: 'https://olriczeng.com/og-image.png',
                width: 1200,
                height: 630,
                alt: 'MindDo Showcase — Olric Zeng',
            },
        ],
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: ['https://olriczeng.com/og-image.png'],
    },
};

export default function MinddoPage() {
    return <MinddoShowcase />;
}
