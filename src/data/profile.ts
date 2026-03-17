import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    name: 'Olric Zeng',
    title: 'Student @ Cornell University',
    entryNumber: '#001',
    tagline: '"Student at Cornell committed to building software for good."',
    timeline: [
        {
            period: '2025 — 2029',
            title: 'B.S. Computer Science',
            org: 'Cornell University',
            desc: 'Courses: Data Structures and OOP, Mathematical Foundations of Computing, Data Structures and Functional Programming, Introduction to Computing Using Python, Introduction to Backend Development, Linear Algebra.',
        },
        {
            period: '2024',
            title: 'Software Engineering Intern',
            org: 'Coding Minds',
            desc: 'Developed responsive an AI-powered nutrition mobile application using Flutter, Firebase, and Flask.',
        },
    ],
    abilities: [
        'Full-Stack Development',
        'API Design',
        'ML Integration',
        'Cross-Platform Development',
        'Containerization & Deploy',
    ],
    skills: [
        { name: 'Python', value: 92, type: 'python' },
        { name: 'Backend', value: 88, type: 'flask' },
        { name: 'Mobile Dev', value: 80, type: 'dart' },
        { name: 'Frontend', value: 75, type: 'html' },
        { name: 'Databases', value: 72, type: 'sql' },
    ],
    socialLinks: [
        { label: 'GitHub', href: 'https://github.com/frxyoz', icon: 'github' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/olriczeng', icon: 'linkedin' },
        { label: 'Email', href: '#contact', icon: 'email' },
    ],
    resumeUrl: '/resume.pdf',
};
