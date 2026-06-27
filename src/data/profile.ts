import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    tagline: 'Hi! I\'m Olric, a software developer passionate about building impactful applications and learning new technologies. I\'m currently a student at Cornell University studying Computer Science, and I love working on projects that combine creativity with technical problem-solving. My skillset includes both frontend and backend development, and I enjoy collaborating with others to bring ideas to life.',
    timeline: [
        {
            period: '2025 — present',
            title: 'Software Developer',
            org: 'Hack4Impact',
            orgUrl: 'https://www.cornellh4i.org/',
            logo: '/hack.png',
            desc: 'Developed web applications for non-profits. Worked closely with cross-functional teams including developers, designers, and product managers to implement best practices in web development and build scalable web tools.',
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
