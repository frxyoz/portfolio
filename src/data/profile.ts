import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    name: 'Olric Zeng',
    title: 'Student @ Cornell University',
    entryNumber: '#001',
    tagline: '"Student at Cornell committed to building software for good."',
    bio: '',
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
        { label: 'Email', href: '#contact', icon: 'email' },
    ],
    resumeUrl: '/resume.pdf',
};
