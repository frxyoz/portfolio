import type { Project } from '@/types';

export const projects: Project[] = [
    {
        id: 1,
        number: '#001',
        name: 'Luminary',
        description:
            'Study tracker app with a 25+ endpoint Flask/SQLAlchemy REST API, star-based progress tracking, and automatic minute sync. Containerized with Docker, deployed on GCP. Won Best Overall App at AppDev Hack Challenge 2025.',
        types: ['flask', 'sql'],
        githubUrl: 'https://github.com/tnt07-t/luminary-backend',
        liveUrl: undefined,
    },
    {
        id: 2,
        number: '#002',
        name: 'Boroughs',
        description:
            'Full-stack NYC housing compatibility finder combining a scikit-learn model trained on 4K+ rows to forecast housing prices with lifestyle compatibility scoring. Awarded #1 Live Right Award at Cornell Claude Hackathon (100+ participants).',
        types: ['flask', 'html'],
        githubUrl: 'https://github.com/aayanhussainw07/Boroughs',
        liveUrl: undefined,
    },
    {
        id: 3,
        number: '#003',
        name: 'IMA',
        description:
            'Internal Member Archive for Hack4Impact — a React/Node.js/Supabase database of alumni to maintain connections and facilitate networking across the organization.',
        types: ['html', 'supabase'],
        githubUrl: 'https://github.com/cornellh4i/IMA',
        liveUrl: undefined,
    },
    {
        id: 4,
        number: '#004',
        name: 'NoteForm',
        description:
            'iOS app using Mediapipe hand landmarks ML to analyze piano hand posture in real-time. Firebase backend tracks progress history. 1st place at IgniteCS Programming Expo 2024.',
        types: ['dart', 'supabase'],
        githubUrl: 'https://github.com/frxyoz/noteform',
        liveUrl: undefined,
    },
    {
        id: 5,
        number: '#005',
        name: 'More Coming soon...',
        description:
            'Always building something new. Check back soon or explore the GitHub for work in progress.',
        types: ['python', 'flask'],
        githubUrl: 'https://github.com/frxyoz',
        liveUrl: undefined,
    },
    {
        id: 6,
        number: '#006',
        name: 'More coming soon...',
        description:
            'Always building something new. Check back soon or explore the GitHub for work in progress.',
        types: ['python', 'flask'],
        githubUrl: 'https://github.com/frxyoz',
        liveUrl: undefined,
    },
];
