import type { ProfileData } from '@/types';

export const profile: ProfileData = {
  name: 'Olric Zeng',
  title: 'Student @ Cornell University',
  tagline: '"Student at Cornell committed to building software for good."',
  avatarUrl: 'https://avatars.githubusercontent.com/u/59369019?v=4',
  timeline: [
    {
      period: '2025 — present',
      title: 'Software Developer',
      org: 'Hack4Impact',
      orgUrl: 'https://www.cornellh4i.org/',
      desc: 'Developed web applications for non-profits. Worked closely with cross-functional teams including developers, designers, and product managers to implement best practices in web development and build scalable web tools.',
      tags: ['TypeScript', 'React', 'Supabase', 'Node.js'],
    },
    {
      period: '2025 — 2029',
      title: 'B.S. Computer Science',
      org: 'Cornell University',
      orgUrl: 'https://www.cs.cornell.edu/',
      desc: 'Courses: Data Structures & OOP, Mathematical Foundations, Functional Programming, Introduction to Computing (Python), Backend Development, Linear Algebra.',
      tags: ['Python', 'OCaml', 'Java'],
    },
    {
      period: '2024',
      title: 'Software Engineering Intern',
      org: 'Coding Minds',
      orgUrl: 'https://codingminds.com/',
      desc: 'Built an AI-powered nutrition mobile app with Flutter, Firebase, and Flask, classifying 100K+ food items with ML-based detection.',
      tags: ['Flutter', 'Firebase', 'Flask', 'Python'],
    },
  ],
  socialLinks: [
    { label: 'GitHub',   href: 'https://github.com/frxyoz' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/olriczeng' },
    { label: 'Email',    href: 'mailto:yz3437@cornell.edu' },
  ],
  resumeUrl: '/resume.pdf',
};
