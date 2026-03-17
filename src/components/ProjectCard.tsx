'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/types';
import TypeBadge from './TypeBadge';
import { TYPE_CONFIG } from './TypeBadge';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryColor = project.types[0] ? TYPE_CONFIG[project.types[0]].color : '#4dff88';

  return (
    <motion.div
      className="dex-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderColor: '#330000',
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 10px 32px ${primaryColor}33, 0 0 0 1px ${primaryColor}66`,
        borderColor: `${primaryColor}66`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <div className="shimmer-overlay" />

      {/* Type-colored accent bar */}
      <div
        style={{
          height: '4px',
          background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}66)`,
          flexShrink: 0,
        }}
      />

      {/* Card header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1a1a1a, #141414)',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #222',
        }}
      >
        <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.4rem', color: '#444' }}>
          {project.number}
        </span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {project.types.map(t => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </div>

      {/* Data */}
      <div style={{ padding: '14px 12px', background: '#0f0f0f', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.6rem',
            color: '#e8e8e8',
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {project.name}
        </h3>

        <p style={{ fontSize: '0.82rem', color: '#888', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="poke-btn"
              style={{ fontSize: '0.4rem', padding: '6px 10px' }}
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.93 }}
            >
              <GithubIcon /> CODE
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.4rem',
                color: '#0d0d0d',
                background: primaryColor,
                borderRadius: '4px',
                padding: '6px 10px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: `0 2px 0 ${primaryColor}88`,
              }}
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.93 }}
            >
              <ExternalLinkIcon /> DEMO
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function GithubIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
