import React from 'react';

interface KpiCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'green' | 'yellow' | 'red' | 'blue';
    icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtext, trend, color = 'blue', icon }) => {
    const colorMap = {
        green: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
        yellow: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
        red: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
        blue: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }
    };

    const c = colorMap[color];

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: `1px solid #e2e8f0`,
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
                {icon && <span style={{ opacity: 0.5 }}>{icon}</span>}
            </div>

            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                {value}
            </div>

            {subtext && (
                <div style={{
                    fontSize: '0.875rem',
                    color: c.text,
                    background: c.bg,
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    alignSelf: 'flex-start',
                    marginTop: '0.5rem'
                }}>
                    {trend === 'up' && '↗ '}
                    {trend === 'down' && '↘ '}
                    {subtext}
                </div>
            )}
        </div>
    );
};
