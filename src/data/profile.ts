import type { ProfileData } from '@/types';

export const profile: ProfileData = {
    name: 'Olric Zeng',
    title: 'Student @ Cornell University',
    entryNumber: '#001',
    tagline: '"Student at Cornell committed to building software for good."',
    avatarUrl: 'https://avatars.githubusercontent.com/u/59369019?v=4',
    timeline: [
        {
            period: '2025 — ',
            title: 'Software Developer',
            org: 'Hack4Impact',
            orgUrl: "https://www.cornellh4i.org/",
            desc: 'Developed web applications for non-profits. Worked closely with cross-functional teams including developers, designers, and product managers to implement and advocate for best practices in web development, and build scalable web tools.',
            types: ['typescript', 'html', 'react', 'supabase'],
        },
        {
            period: '2025 — 2029',
            title: 'B.S. Computer Science',
            org: 'Cornell University',
            desc: 'Courses: Data Structures and OOP, Mathematical Foundations of Computing, Data Structures and Functional Programming, Introduction to Computing Using Python, Introduction to Backend Development, Linear Algebra.',
            types: ['python', 'ocaml', 'java'],
        },
        {
            period: '2024',
            title: 'Software Engineering Intern',
            org: 'Coding Minds',
            orgUrl: 'https://codingminds.com/',
            desc: 'Developed responsive an AI-powered nutrition mobile application using Flutter, Firebase, and Flask, classifying over 100K+ food items.',
            types: ['python', 'flask', 'dart'],
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
