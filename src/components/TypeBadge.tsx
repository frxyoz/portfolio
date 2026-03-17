import type { TechType } from '@/types';

const TYPE_CONFIG: Record<TechType, { label: string; color: string; bg: string }> = {
    python: { label: 'PYTHON', color: '#4b8bbe', bg: 'rgba( 75,139,190,0.15)' },
    java: { label: 'JAVA', color: '#f89820', bg: 'rgba(248,152, 32,0.15)' },
    ocaml: { label: 'OCAML', color: '#ec6813', bg: 'rgba(236,104, 19,0.15)' },
    html: { label: 'HTML', color: '#e34c26', bg: 'rgba(227, 76, 38,0.15)' },
    dart: { label: 'DART', color: '#0175c2', bg: 'rgba(  1,117,194,0.15)' },
    sql: { label: 'SQL', color: '#4479a1', bg: 'rgba( 68,121,161,0.15)' },
    flask: { label: 'FLASK', color: '#b8d0c0', bg: 'rgba(184,208,192,0.15)' },
    supabase: { label: 'SUPABASE', color: '#3ecf8e', bg: 'rgba( 62,207,142,0.15)' },
    react: { label: 'REACT', color: '#61dafb', bg: 'rgba( 97,218,251,0.15)' },
    typescript: { label: 'TYPESCRIPT', color: '#3178c6', bg: 'rgba( 49,120,198,0.15)' },
};

interface TypeBadgeProps {
    type: TechType;
    size?: 'sm' | 'md';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
    const config = TYPE_CONFIG[type];
    const fontSize = size === 'sm' ? '0.45rem' : '0.55rem';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';

    return (
        <span
            style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize,
                padding,
                color: config.color,
                backgroundColor: config.bg,
                border: `1px solid ${config.color}44`,
                borderRadius: '3px',
                letterSpacing: '0.05em',
                display: 'inline-block',
                lineHeight: 1.6,
            }}
        >
            {config.label}
        </span>
    );
}

export { TYPE_CONFIG };
