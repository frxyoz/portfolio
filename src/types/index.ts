export interface ProjectDetail {
    heading: string;
    body: string;
}

export interface StackItem {
    name: string;
    role: string;
}

export interface Project {
    id: string;
    name: string;
    subtitle: string;
    year: string;
    desc: string;
    award: string | null;
    githubUrl: string;
    overview: string;
    details: ProjectDetail[];
    stack: StackItem[];
    /** Caption over the demo frame. Omitted when the video speaks for itself —
     *  a label that only restates "this is a demo" is a caption doing no work. */
    mockLabel?: string;
    mockImage?: string;
    /** Intrinsic [width, height] of mockImage, so the overlay reserves space
     *  before the screenshot arrives instead of shifting layout under it. */
    mockSize?: [number, number];
    demoVideo?: string;
    /** When set, the card navigates to this route instead of opening the overlay. */
    href?: string;
}

export interface TimelineEntry {
    period: string;
    title: string;
    org: string;
    orgUrl?: string;
    logo?: string;
    desc?: string;
    tags?: string[];
}

export interface SocialLink {
    label: string;
    href: string;
}

export interface ProfileData {
    /** The short read for the hero panel. */
    lede: string;
    /** The full paragraph, shown in the Background section. */
    tagline: string;
    timeline: TimelineEntry[];
    socialLinks: SocialLink[];
    resumeUrl: string;
}
