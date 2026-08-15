import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    tagline: 'I\'m Olric, a Computer Science student at Cornell. I work on both sides of the stack — REST APIs, data models and infrastructure on the backend, React and Flutter on the frontend. Most of my time goes into side projects that push me into something I haven\'t used before, and I currently build web tools for non-profits at Hack4Impact.',
    timeline: [
        {
            period: '2025 — present',
            title: 'Software Developer',
            org: 'Hack4Impact',
            orgUrl: 'https://www.cornellh4i.org/',
            logo: '/hack.png',
            desc: 'Build web tools for non-profit clients on a team of developers, designers and product managers, from requirements through deployment.',
            tags: ['TypeScript', 'React', 'Supabase', 'Node.js'],
        },
        {
            period: '2025 — present',
            title: 'B.S. Computer Science',
            org: 'Cornell University',
            orgUrl: 'https://www.cs.cornell.edu/',
            logo: '/cornell.png',
            desc: 'Courses: Data Structures & OOP, Mathematical Foundations, Functional Programming, Introduction to Computing (Python), Backend Development, Linear Algebra.',
            tags: ['Python', 'OCaml', 'Java'],
        },
        {
            period: '2024',
            title: 'Software Engineering Intern',
            org: 'Coding Mind',
            orgUrl: 'https://codingmind.com/',
            logo: '/codingmind.webp',
            desc: 'Built an AI-powered nutrition mobile app with Flutter, Firebase, and Flask, classifying 100K+ food items with ML-based detection.',
            tags: ['Flutter', 'Firebase', 'Flask', 'Python'],
        },
    ],
    socialLinks: [
        { label: 'GitHub', href: 'https://github.com/frxyoz' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/olriczeng' },
        { label: 'Email', href: 'mailto:olriczeng@gmail.com' },
    ],
    resumeUrl: '/resume.pdf',
};
