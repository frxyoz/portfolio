import type { Project } from '@/types';

export const projects: Project[] = [
    {
        id: 'luminary',
        name: 'Luminary',
        subtitle: 'Study Tracker App',
        year: '2025',
        desc: 'A full-stack study tracking application built for the AppDev Hack Challenge 2025.',
        award: 'Best Overall App — AppDev Hack Challenge 2025',
        tags: ['Flask', 'SQLAlchemy', 'Docker', 'GCP', 'Python'],
        githubUrl: 'https://github.com/tnt07-t/luminary-backend',
        overview:
            'Luminary is a collaborative study tracker designed to help students organize sessions, track progress, and stay accountable. Built end-to-end in under 24 hours, it won Best Overall App at Cornell\'s AppDev Hack Challenge 2025.',
        details: [
            {
                heading: 'REST API',
                body: 'Architected a Flask/SQLAlchemy REST API with 25+ endpoints covering users, sessions, goals, streaks, and analytics — supporting full CRUD with relational data integrity.',
            },
            {
                heading: 'Infrastructure',
                body: 'Containerized with Docker for reproducible builds and deployed to Google Cloud Platform for reliable, low-latency access during the live demo.',
            },
            {
                heading: 'Data Model',
                body: 'Designed a normalized relational schema to track study sessions, subject categories, and user progress over time to enable instant tracking and analytics.',
            },
        ],
        stack: [
            { name: 'Flask', role: 'Web framework & routing' },
            { name: 'SQLAlchemy', role: 'ORM & migrations' },
            { name: 'PostgreSQL', role: 'Relational database' },
            { name: 'Docker', role: 'Containerization' },
            { name: 'GCP', role: 'Cloud deployment' },
        ],
        mockLabel: 'Dashboard — Study Session View',
    },
    {
        id: 'boroughs',
        name: 'Boroughs',
        subtitle: 'NYC Housing Compatibility Finder',
        year: '2025',
        desc: 'A data-driven web app that matches users to NYC neighborhoods based on lifestyle preferences.',
        award: '#1 Live Right Award — Cornell Claude Hackathon (100+ participants)',
        tags: ['Python', 'scikit-learn', 'Pandas', 'ML', 'Flask'],
        githubUrl: 'https://github.com/aayanhussainw07/Boroughs',
        overview:
            'Boroughs helps people moving to New York City find their ideal neighborhood by scoring compatibility across commute, cost, noise, green space, and nightlife — backed by a machine learning price forecasting model trained on 4,000+ real listings.',
        details: [
            {
                heading: 'ML Price Forecasting',
                body: 'Trained a scikit-learn regression model on 4,000+ NYC housing rows from public datasets, achieving strong predictive accuracy for neighborhood rent ranges across all five boroughs.',
            },
            {
                heading: 'Compatibility Scoring',
                body: 'Developed a multi-factor scoring algorithm that weighs user preferences against neighborhood data across 8 dimensions — outputting a ranked match list with explanations.',
            },
            {
                heading: 'Claude Integration',
                body: 'Integrated the Anthropic Claude API to generate natural-language neighborhood summaries and answer follow-up questions, enabling conversational exploration of housing options.',
            },
        ],
        stack: [
            { name: 'scikit-learn', role: 'ML regression model' },
            { name: 'Pandas', role: 'Data wrangling' },
            { name: 'Flask', role: 'Backend API' },
            { name: 'Anthropic Claude', role: 'Natural language layer' },
            { name: 'Python', role: 'Core language' },
        ],
        mockLabel: 'Borough Match Results — User Dashboard',
    },
    {
        id: 'ima',
        name: 'IMA',
        subtitle: 'Hack4Impact Internal Member Archive',
        year: '2025',
        desc: 'An alumni database and networking platform built for Hack4Impact Cornell.',
        award: null,
        tags: ['React', 'Node.js', 'Supabase', 'TypeScript'],
        githubUrl: 'https://github.com/cornellh4i/IMA',
        overview:
            'IMA (Internal Member Archive) is a living database of past and current Hack4Impact members, designed to make it easy for alumni to reconnect, for current members to find mentors, and for the organization to preserve institutional knowledge across generations.',
        details: [
            {
                heading: 'Full-Stack Architecture',
                body: 'Built with a React/TypeScript frontend and a Node.js backend, connected to Supabase for real-time database sync, authentication, and row-level security policies.',
            },
            {
                heading: 'Search & Filtering',
                body: 'Implemented full-text search with role, cohort, and skill filters — enabling members to quickly find alumni with specific expertise or shared history.',
            },
            {
                heading: 'Role-Based Access',
                body: 'Designed a tiered permissions system where admins can onboard members and manage data, while alumni retain control over their own profile visibility and contact preferences.',
            },
        ],
        stack: [
            { name: 'React', role: 'Frontend UI' },
            { name: 'TypeScript', role: 'Type-safe codebase' },
            { name: 'Node.js', role: 'Backend & API' },
            { name: 'Supabase', role: 'DB, auth & real-time' },
        ],
        mockLabel: 'Member Directory — Search & Filter View',
    },
    {
        id: 'noteform',
        name: 'NoteForm',
        subtitle: 'iOS Piano Hand Posture Analyzer',
        year: '2024',
        desc: 'An iOS app using real-time ML to analyze and correct piano hand posture.',
        award: '1st Place — IgniteCS Programming Expo 2024',
        tags: ['Swift', 'Firebase', 'Mediapipe', 'ML', 'iOS'],
        githubUrl: 'https://github.com/frxyoz/noteform',
        overview:
            'NoteForm is an iOS application that uses the device camera and Google\'s Mediapipe hand landmark model to analyze a pianist\'s hand posture in real-time — providing live feedback on wrist angle, finger curvature, and thumb position, with Firebase-backed progress tracking over time.',
        details: [
            {
                heading: 'Real-Time Pose Analysis',
                body: 'Integrated Mediapipe\'s hand landmark detection to extract 21 key points per hand per frame at 30fps, running entirely on-device for zero-latency feedback during practice.',
            },
            {
                heading: 'Posture Scoring',
                body: 'Developed a custom scoring algorithm mapping hand landmark geometry to known good-posture heuristics — flagging wrist collapse, flat fingers, and thumb tucking in real time.',
            },
            {
                heading: 'Progress Tracking',
                body: 'Sessions are logged to Firebase with per-metric scores over time, allowing students and teachers to review improvement trends across practice history.',
            },
        ],
        stack: [
            { name: 'Swift', role: 'iOS native app' },
            { name: 'Mediapipe', role: 'Hand landmark detection' },
            { name: 'Firebase', role: 'Auth & progress storage' },
            { name: 'AVFoundation', role: 'Camera feed processing' },
        ],
        mockLabel: 'Live Analysis — Hand Posture Feedback',
    },
];
