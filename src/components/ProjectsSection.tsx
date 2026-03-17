import { projects } from '@/data/projects';
import ProjectCard from './ProjectCard';
import ScrollReveal from './ScrollReveal';
import ScrollFloat from './ScrollFloat';

export default function ProjectsSection() {
  const seen   = projects.length;
  const caught = projects.filter(p => p.liveUrl).length;

  return (
    <section id="projects" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <ScrollReveal>
        <div className="section-panel">
          {/* Panel header */}
          <div
            style={{
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #880000',
              background: 'rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="indicator-eye" style={{ width: '24px', height: '24px', border: '2px solid #440000' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ff4444', boxShadow: '0 0 4px #ff4444' }} />
                <div className="indicator-dot" style={{ width: '8px', height: '8px', background: '#ffcc00', boxShadow: '0 0 4px #ffcc00' }} />
              </div>
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.6rem',
                  color: '#ffcb05',
                  letterSpacing: '0.1em',
                }}
              >
                PROJECTS
              </ScrollFloat>
            </div>
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.4rem',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              {caught} / {seen} LIVE
            </span>
          </div>

          {/* Screen area */}
          <div className="section-screen">
            <div
              className="section-screen-inner"
              style={{ padding: '20px' }}
            >
              {/* Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px',
                }}
              >
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
