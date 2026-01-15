import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface CjmmRadarProps {
    scores: Record<string, number>;
}

export const CjmmRadar: React.FC<CjmmRadarProps> = ({ scores }) => {
    // Transform object to array format for Recharts
    const data = React.useMemo(() => {
        // Standard NGN Steps Order
        const order = [
            'Recognize Cues',
            'Analyze Cues',
            'Prioritize Hypotheses',
            'Generate Solutions',
            'Take Action',
            'Evaluate Outcomes'
        ];

        return order.map(step => ({
            step: step.replace(' ', '\n'), // Multi-line for labels
            score: scores[step] || 0,
            fullStep: step
        }));
    }, [scores]);

    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Cognitive Breakdown (CJMM)</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Your performance across the 6 clinical judgment steps.</p>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                            dataKey="step"
                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Mastery"
                            dataKey="score"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="#8b5cf6"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            formatter={(value: any) => [`${value}%`, 'Mastery']}
                            labelFormatter={(l) => String(l).replace('\n', ' ')}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
