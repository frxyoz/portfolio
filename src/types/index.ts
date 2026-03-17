export type TechType =
    | 'python'
    | 'java'
    | 'ocaml'
    | 'html'
    | 'dart'
    | 'sql'
    | 'flask'
    | 'supabase';

export interface Project {
    id: number;
    number: string;
    name: string;
    description: string;
    types: TechType[];
    githubUrl?: string;
    liveUrl?: string;
}

export interface SocialLink {
    label: string;
    href: string;
    icon: 'github' | 'linkedin' | 'twitter' | 'email';
}

export interface Skill {
    name: string;
    value: number;
    max?: number;
    type: TechType;
}

export interface TimelineEntry {
    period: string;
    title: string;
    org: string;
    desc: string;
}

export interface ProfileData {
    name: string;
    title: string;
    entryNumber: string;
    tagline: string;
    abilities: string[];
    skills: Skill[];
    timeline: TimelineEntry[];
    socialLinks: SocialLink[];
    resumeUrl: string;
    avatarUrl?: string;
}
