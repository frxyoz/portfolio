import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    /* The first two sentences of the tagline, verbatim. The hero panel is a
       sign and a sign is read at walking pace; the full paragraph waits in the
       Background section for anyone who stops. */
    lede: 'Hi! I\'m Olric, a Computer Science student at Cornell. I\'m interested in fullstack development, infrastructure engineering and machine learning.',
    tagline: 'Hi! I\'m Olric, a Computer Science student at Cornell. I\'m interested in fullstack development, infrastructure engineering and machine learning. I am really passionate about creating software solutions that make a difference. Most of my time goes into side projects that push me into something I haven\'t used before, and I currently build web tools for non-profits at Hack4Impact.',
    timeline: [
        {
            period: '2026',
            title: 'Software Engineering Intern',
            org: 'SiteFit AI',
            orgUrl: 'https://www.linkedin.com/in/sitefit-ai-48b2183b9',
            logo: '/sitefit.webp',
        },
        {
            period: '2025 — present',
            title: 'Software Developer',
            org: 'Hack4Impact',
            orgUrl: 'https://www.cornellh4i.org/',
            logo: '/hack.webp',
        },
        {
            period: '2025 — present',
            title: 'B.S. Computer Science',
            org: 'Cornell University',
            orgUrl: 'https://www.cs.cornell.edu/',
            logo: '/cornell.webp',
        },
        {
            period: '2024',
            title: 'Software Engineering Intern',
            org: 'Coding Mind',
            orgUrl: 'https://codingmind.com/',
            logo: '/codingmind.webp',
        },
    ],
    socialLinks: [
        { label: 'GitHub', href: 'https://github.com/frxyoz' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/olriczeng' },
        { label: 'Email', href: 'mailto:olriczeng@gmail.com' },
    ],
    resumeUrl: '/resume.pdf',
};
