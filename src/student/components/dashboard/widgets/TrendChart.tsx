import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Attempt } from '../../../../types/student-schema';

interface TrendChartProps {
    attempts: Attempt[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ attempts }) => {
    // Process data: Group averages by date
    const data = React.useMemo(() => {
        // Sort by date
        const sorted = [...attempts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Take last 30 attempts max for clarity
        const subset = sorted.slice(-30);

        return subset.map((a) => ({
            date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            accuracy: Math.round((a.score / a.maxScore) * 100),
            id: a.id
        }));
    }, [attempts]);

    if (!attempts.length) return <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No trend data available.</div>;

    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#334155' }}>Performance Trend (Last 30)</h3>
            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
