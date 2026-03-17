import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    name: 'Olric Zeng',
    title: 'Student @ Cornell University',
    entryNumber: '#001',
    tagline: '"Building things that matter, one commit at a time."',
    bio: '',
    timeline: [
        {
            period: '2023 — Present',
            title: 'Senior Full Stack Developer',
            org: 'Company Name',
            desc: 'Leading development of cloud-native web applications, mentoring engineers, and driving architectural decisions across the stack.',
        },
        {
            period: '2021 — 2023',
            title: 'Full Stack Developer',
            org: 'Company Name',
            desc: 'Built and maintained React/Next.js frontends with Node.js and PostgreSQL backends, shipping multiple production features.',
        },
        {
            period: '2025 — 2021',
            title: 'Frontend Developer',
            org: 'Company Name',
            desc: 'Developed responsive interfaces and component libraries with a focus on performance and accessibility.',
        },
        {
            period: '2025 — 2029',
            title: 'B.S. Computer Science',
            org: 'Cornell University',
            desc: 'Data Structures and OOP, Mathematical Foundations of Computing, Data Structures and Functional Programming, Introduction to Computing Using Python, Introduction to Backend Development, Linear Algebra.',
        },
    ],
    abilities: [
        'Problem Decomposition',
        'Clean Code Advocacy',
        'Cross-team Collaboration',
        'Rapid Prototyping',
        'Async Communication',
    ],
    primaryTypes: ['python', 'html'],
    skills: [
        { name: 'Frontend', value: 95, type: 'html' },
        { name: 'TypeScript', value: 88, type: 'dart' },
        { name: 'Backend', value: 80, type: 'flask' },
        { name: 'DevOps', value: 70, type: 'sql' },
        { name: 'Testing', value: 75, type: 'python' },
    ],
    socialLinks: [
        { label: 'GitHub', href: 'https://github.com/frxyoz', icon: 'github' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/olriczeng', icon: 'linkedin' },
        { label: 'Email', href: 'mailto:olriczeng@gmail.com', icon: 'email' },
    ],
    resumeUrl: '/resume.pdf',
};
