import type { Project } from '@/types';

export const projects: Project[] = [
    {
        id: 'minddo',
        name: 'MindDo.ai Showcase',
        subtitle: 'AI Showcase Pipeline',
        year: '2026',
        desc: 'An asynchronous, autoscaling media-generation pipeline that turns a student project URL into a full showcase package.',
        award: null,
        githubUrl: '',
        // Full case study lives on its own route rather than in the overlay.
        href: '/projects/minddo',
        overview:
            'A student project URL goes in; screenshots, a narrated demo video in English and Mandarin, an AI-written summary, skill tags, a QR code and a print-ready flyer come out — in about 100 seconds.',
        details: [],
        /* `details` is empty because the whole account lives on its own route,
           but the stack is not: the platform panel prints these on the home
           page, and a panel reading a hardcoded list beside a data file that
           says the project has no stack is two sources for one fact. */
        stack: [
            { name: 'AWS', role: 'EC2, S3, the cluster it runs on' },
            { name: 'k3s', role: 'Kubernetes on one node' },
            { name: 'KEDA', role: 'Autoscaling on queue depth' },
            { name: 'Postgres', role: 'Submissions and showcase rows' },
            { name: 'Celery', role: 'Queue and workers' },
        ],
        mockLabel: 'Pipeline — Queue to Showcase',
    },
    {
        id: 'luminary',
        name: 'Luminary',
        subtitle: 'Study Tracker App',
        year: '2025',
        desc: 'A full-stack study tracking application built for the AppDev Hack Challenge 2025.',
        award: 'Best Overall App — AppDev Hack Challenge 2025',
        githubUrl: 'https://github.com/tnt07-t/luminary-backend',
        overview:
            'Luminary is a collaborative study tracker: students log sessions, set goals, and see their streaks and subject totals over time. Built in under two weeks, it won Best Overall App at Cornell\'s AppDev Hack Challenge 2025.',
        details: [
            {
                heading: 'REST API',
                body: 'Built a Flask/SQLAlchemy REST API with 25+ endpoints covering users, sessions, goals, streaks and analytics, with full CRUD and foreign-key integrity across the tables.',
            },
            {
                heading: 'Infrastructure',
                body: 'Containerized with Docker and deployed to Google Cloud Platform, so the live demo ran against the same image that was built locally.',
            },
            {
                heading: 'Data Model',
                body: 'Designed a normalized relational schema for study sessions, subject categories and progress over time, which is what the analytics endpoints read from directly.',
            },
        ],
        stack: [
            { name: 'Flask', role: 'Web framework & routing' },
            { name: 'SQLAlchemy', role: 'ORM & migrations' },
            { name: 'Docker', role: 'Containerization' },
            { name: 'GCP', role: 'Cloud deployment' },
        ],
        mockImage: '/luminary.webp',
        mockSize: [1200, 631],
        demoVideo: 'https://www.youtube-nocookie.com/embed/ZEVsYJFX-Fc',
    },
    {
        id: 'boroughs',
        name: 'Boroughs',
        subtitle: 'NYC Housing Compatibility Finder',
        year: '2025',
        desc: 'A data-driven web app that matches users to NYC neighborhoods based on lifestyle preferences.',
        award: '#1 Live Right Award — Cornell Claude Hackathon (100+ participants)',
        githubUrl: 'https://github.com/aayanhussainw07/Boroughs',
        overview:
            'Boroughs scores NYC neighborhoods against a user\'s stated preferences — commute, cost, noise, green space, nightlife — and returns them ranked. Rent estimates come from a regression model trained on 4,000+ real listings.',
        details: [
            {
                heading: 'ML Price Forecasting',
                body: 'Trained a scikit-learn regression model on 4,000+ NYC housing rows from public datasets to predict rent ranges per neighborhood across all five boroughs.',
            },
            {
                heading: 'Compatibility Scoring',
                body: 'Wrote a scoring function that weighs user preferences against neighborhood data across 8 dimensions and returns a ranked list, with the per-dimension scores behind each match.',
            },
            {
                heading: 'Claude Integration',
                body: 'Integrated the Anthropic Claude API to write neighborhood summaries and answer follow-up questions about the ranked results.',
            },
        ],
        stack: [
            { name: 'scikit-learn', role: 'ML regression model' },
            { name: 'Pandas', role: 'Data wrangling' },
            { name: 'Flask', role: 'Backend API' },
            { name: 'Anthropic Claude', role: 'Natural language layer' },
            { name: 'Python', role: 'Core language' },
        ],
        mockImage: '/boroughs.webp',
        mockSize: [1200, 614],
        demoVideo: 'https://www.youtube-nocookie.com/embed/PVqTMSDqXuE',
    },
    {
        id: 'noteform',
        name: 'NoteForm',
        subtitle: 'iOS Piano Hand Posture Analyzer',
        year: '2024',
        desc: 'An iOS app using real-time ML to analyze and correct piano hand posture.',
        award: '1st Place — IgniteCS Programming Expo 2024',
        githubUrl: 'https://github.com/frxyoz/noteform',
        overview:
            'NoteForm is an iOS application that uses the device camera and Google\'s Mediapipe hand landmark model to analyze a pianist\'s hand posture in real-time — reporting wrist angle, finger curvature and thumb position as the student plays, with per-session scores stored in Firebase.',
        details: [
            {
                heading: 'Real-Time Pose Analysis',
                body: 'Integrated Mediapipe\'s hand landmark detection to extract 21 key points per hand per frame at 30fps, running on-device so feedback never waits on a network round trip.',
            },
            {
                heading: 'Posture Scoring',
                body: 'Wrote a scoring function mapping hand landmark geometry to posture heuristics — flagging wrist collapse, flat fingers and thumb tucking as they happen.',
            },
            {
                heading: 'Progress Tracking',
                body: 'Sessions are logged to Firebase with per-metric scores, so students and teachers can compare a practice session against earlier ones.',
            },
        ],
        stack: [
            { name: 'Flutter', role: 'Cross-platform UI' },
            { name: 'Mediapipe', role: 'Hand landmark detection' },
            { name: 'Firebase', role: 'Auth & progress storage' },
        ],
        mockImage: '/noteform.webp',
        mockSrcSet: '/noteform-640.webp 640w, /noteform-900.webp 900w, /noteform.webp 1200w',
        mockSize: [1200, 998],
    },
];
