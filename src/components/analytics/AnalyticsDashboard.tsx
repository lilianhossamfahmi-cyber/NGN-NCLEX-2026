import React, { useEffect, useState } from 'react';
import { AnalyticsSummary } from '../../types/analytics-schema';
import { getMockAnalytics } from '../../services/analyticsService';

export const AnalyticsDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useState<AnalyticsSummary | null>(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        // Load data
        setData(getMockAnalytics());
        // Stagger animation
        setTimeout(() => setAnimated(true), 100);
    }, []);

    if (!data) return <div>Loading Analytics...</div>;

    // --- SUB-COMPONENTS --- //

    const HeroCard = ({ title, value, label, color, icon }: any) => (
        <div style={{
            background: 'white', flex: 1, padding: '24px', borderRadius: '16px',
            border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </div>
            {title && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>{title}</div>}
        </div>
    );

    // Simple Line Chart SVG
    const LineChart = () => {
        const h = 200;
        const w = 800;
        const pts = data.dailyProgress.map((d, i) => {
            const x = (i / (data.dailyProgress.length - 1)) * w;
            const y = h - (d.accuracy / 100) * h;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(p => (
                    <line key={p} x1="0" y1={h - (p / 100) * h} x2={w} y2={h - (p / 100) * h} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {/* Area fill - somewhat complex for simple polyline, just doing line for now */}
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="3"
                    points={pts}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Dots */}
                {data.dailyProgress.map((d, i) => {
                    const x = (i / (data.dailyProgress.length - 1)) * w;
                    const y = h - (d.accuracy / 100) * h;
                    return (
                        <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="#0891b2" strokeWidth="2" />
                    )
                })}
            </svg>
        );
    };

    return (
        <div style={{
            padding: '2rem', maxWidth: '1200px', margin: '0 auto',
            background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif'
        }}>

            <button onClick={onBack} style={{ marginBottom: '1rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ← Back to Generator
            </button>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem', margin: 0 }}>Analytics Dashboard</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Track your mastery and identify areas for improvement.</p>
            </header>

            {/* HERO STATS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <HeroCard
                    title="Lifetime Volume"
                    value={data.totalQuestions}
                    label="Questions Answered"
                    color="#1e293b"
                    icon="📊"
                />
                <HeroCard
                    title="Performance"
                    value={`${data.overallAccuracy}%`}
                    label="Overall Accuracy"
                    color={data.overallAccuracy >= 70 ? '#10b981' : '#f59e0b'}
                    icon="🎯"
                />
                <HeroCard
                    title="Algorithm Prediction"
                    value={`${data.passProbability}%`}
                    label="Pass Probability"
                    color="#0891b2"
                    icon="🔮"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '2rem' }}>

                {/* PROGRESS CHART */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Accuracy Trend (30 Days)</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', color: '#475569' }}>All Time</span>
                        </div>
                    </div>
                    <div style={{ height: '200px' }}>
                        <LineChart />
                    </div>
                </div>

                {/* DOMAIN BREAKDOWN */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Domain Mastery</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.domains.map(d => (
                            <div key={d.domainId}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 600, color: '#334155' }}>{d.domainName}</span>
                                    <span style={{ fontWeight: 700, color: d.accuracy >= 70 ? '#10b981' : '#f59e0b' }}>{d.accuracy}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        background: d.accuracy >= 70 ? '#10b981' : (d.accuracy >= 50 ? '#f59e0b' : '#ef4444'),
                                        width: animated ? `${d.accuracy}%` : '0%',
                                        transition: 'width 1s ease-out'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RECOMMENDATIONS */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Recommended Actions</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {data.recommendations.map(rec => (
                        <div key={rec.id} style={{
                            background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px',
                            borderRadius: '12px', flex: 1, minWidth: '250px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                                    {rec.type === 'domain' ? 'Weakness Focus' : (rec.type === 'itemType' ? 'Skill Drill' : 'General')}
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e3a8a', margin: '4px 0' }}>{rec.label}</div>
                                <div style={{ fontSize: '0.9rem', color: '#60a5fa' }}>{rec.reason}</div>
                            </div>
                            <button style={{
                                background: 'white', color: '#2563eb', padding: '8px 16px',
                                border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                            }}>
                                Start →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ITEM TYPE & BADGES GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* ITEM TYPES */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Performance by Type</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                        {data.itemTypes.map(t => (
                            <div key={t.typeId} style={{
                                padding: '12px', borderRadius: '12px', background: '#f8fafc',
                                textAlign: 'center', border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{t.typeName}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: '4px 0' }}>
                                    {t.accuracy}%
                                </div>
                                <div style={{ fontSize: '0.75rem', color: t.trend === 'up' ? '#10b981' : (t.trend === 'down' ? '#ef4444' : '#94a3b8') }}>
                                    {t.trend === 'up' ? '↗ Improving' : (t.trend === 'down' ? '↘ Declining' : '→ Stable')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BADGES */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Achievements</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
                        {data.badges.map(b => (
                            <div key={b.id} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                opacity: b.unlocked ? 1 : 0.5,
                                filter: b.unlocked ? 'none' : 'grayscale(100%)'
                            }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '50%', background: b.unlocked ? '#f0fdfa' : '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                                    border: b.unlocked ? '2px solid #0891b2' : '2px dashed #cbd5e1',
                                    marginBottom: '8px'
                                }}>
                                    {b.icon}
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{b.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ height: '4rem' }} /> {/* Spacer */}
        </div>
    );
};
