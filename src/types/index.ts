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
  tags: string[];
  githubUrl: string;
  overview: string;
  details: ProjectDetail[];
  stack: StackItem[];
  mockLabel: string;
}

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  orgUrl?: string;
  logo?: string;
  desc: string;
  tags: string[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  timeline: TimelineEntry[];
  socialLinks: SocialLink[];
  resumeUrl: string;
}
