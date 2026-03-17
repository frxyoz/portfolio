import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 1,
    number: '#001',
    name: 'Project Bulbasaur',
    description:
      'A full-stack SaaS dashboard with real-time analytics, user authentication, and role-based access control. Built for scale.',
    types: ['python', 'supabase'],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com',
  },
  {
    id: 2,
    number: '#002',
    name: 'Project Charmander',
    description:
      'CLI tool that automates deployment pipelines across cloud providers. Supports Docker, Kubernetes, and bare-metal targets.',
    types: ['flask', 'sql'],
    githubUrl: 'https://github.com/',
    liveUrl: undefined,
  },
  {
    id: 3,
    number: '#003',
    name: 'Project Squirtle',
    description:
      'Open-source REST API framework with built-in rate limiting, caching layer, and auto-generated OpenAPI documentation.',
    types: ['java', 'flask'],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com',
  },
  {
    id: 4,
    number: '#004',
    name: 'Project Pikachu',
    description:
      'Real-time collaborative code editor with syntax highlighting, live cursors, and WebSocket-powered syncing.',
    types: ['dart', 'supabase'],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com',
  },
  {
    id: 5,
    number: '#005',
    name: 'Project Gengar',
    description:
      'Automated testing suite generator that analyzes codebases and produces unit, integration, and E2E test scaffolding.',
    types: ['ocaml', 'python'],
    githubUrl: 'https://github.com/',
    liveUrl: undefined,
  },
  {
    id: 6,
    number: '#006',
    name: 'Project Alakazam',
    description:
      'ML-powered code review bot that integrates with GitHub PRs to flag bugs, style issues, and security vulnerabilities.',
    types: ['python', 'sql'],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com',
  },
];
