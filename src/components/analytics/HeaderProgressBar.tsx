import React, { useEffect, useState } from 'react';
import { DomainPerformance } from '../../types/analytics-schema';

interface HeaderProgressBarProps {
    domains: DomainPerformance[];
    onViewDashboard: () => void;
}

export const HeaderProgressBar: React.FC<HeaderProgressBarProps> = ({ domains, onViewDashboard }) => {
    // Animation state
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Sort by weakness (lowest accuracy first) to highlight areas needing attention, 
    // or arguably by usage. Let's show top 4 active domains.
    // For now, let's take the first 4 provided.
    const displayDomains = domains.slice(0, 4);
    const hiddenCount = Math.max(0, domains.length - 4);

    const getBarColor = (accuracy: number) => {
        if (accuracy >= 80) return '#10b981'; // Emerald
        if (accuracy >= 60) return '#f59e0b'; // Amber
        return '#ef4444'; // Rose
    };

    return (
        <div
            onClick={onViewDashboard}
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px 24px',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid #e2e8f0',
                margin: '0 auto 2rem auto', // Centered max width handled by parent
                maxWidth: '1200px'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '100px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    Your Progress
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Tap for full analytics
                </span>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: '20px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
                {displayDomains.map((d) => (
                    <div key={d.domainId} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '140px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span style={{ color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                                {d.domainName}
                            </span>
                            <span style={{ color: getBarColor(d.accuracy) }}>
                                {d.accuracy}%
                            </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    background: getBarColor(d.accuracy),
                                    width: animated ? `${d.accuracy}%` : '0%',
                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    </div>
                ))}

                {hiddenCount > 0 && (
                    <div style={{
                        fontSize: '0.8rem', color: '#0891b2', fontWeight: 600,
                        background: '#f0fdfa', padding: '6px 12px', borderRadius: '20px',
                        whiteSpace: 'nowrap'
                    }}>
                        + {hiddenCount} more
                    </div>
                )}
            </div>

            <div style={{ color: '#94a3b8' }}>
                →
            </div>
        </div>
    );
};
