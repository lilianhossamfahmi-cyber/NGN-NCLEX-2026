import React, { useMemo } from 'react';
import { GenericRendererProps } from './types';
import { SATARenderer } from './SATARenderer';
import { SingleChoiceRenderer } from './SingleChoiceRenderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// PART 2: STAND-ALONE TREND ITEM – GOLD STANDARD UPGRADE
// Features: Interactive Line Chart Visualization
export const TrendRenderer: React.FC<GenericRendererProps> = (props) => {
    const { config } = props;

    // Determine Question Format (SATA vs Single Choice)
    const isSATA = useMemo(() => {
        if (config.questionFormat === 'sata' || !!config.selectCount) return true;
        // Check if there are multiple correct options
        if (config.options && Array.isArray(config.options)) {
            const correctCount = config.options.filter((o: any) => o.isCorrect).length;
            return correctCount > 1;
        }
        return false;
    }, [config]);

    // Transform Table Data to Chart Data
    const chartData = useMemo(() => {
        if (!config.trendTable || !config.trendTable.rows || !config.trendTable.columns) return null;

        const cols = config.trendTable.columns;
        const rows = config.trendTable.rows;

        // Assumption: First column is Time/X-Axis
        return rows.map((row: any[]) => {
            const entry: any = { name: row[0] }; // X-Axis

            // Process other columns
            for (let i = 1; i < cols.length; i++) {
                const colName = cols[i];
                const val = row[i];

                // Handle BP (e.g. "120/80")
                if (typeof val === 'string' && val.includes('/')) {
                    const [sys, dia] = val.split('/').map(Number);
                    if (!isNaN(sys) && !isNaN(dia)) {
                        entry[`${colName} (Sys)`] = sys;
                        entry[`${colName} (Dia)`] = dia;
                    }
                } else {
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                        entry[colName] = num;
                    }
                }
            }
            return entry;
        });
    }, [config.trendTable]);

    // Generate Lines dynamically
    const chartLines = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];
        const keys = Object.keys(chartData[0]).filter(k => k !== 'name');

        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

        return keys.map((key, index) => (
            <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
            />
        ));
    }, [chartData]);


    return (
        <div className="flex flex-col gap-6 font-inter">
            {/* 1. Trend Visualization */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex justify-between items-center">
                    <span>Clinical Trend Data</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">
                        {chartData ? 'DYNAMIC CHART' : 'TABLE VIEW'}
                    </span>
                </div>

                {config.trendImageUrl ? (
                    <img
                        src={config.trendImageUrl}
                        alt="Clinical Trend Data"
                        className="w-full h-auto max-h-96 object-contain"
                    />
                ) : (chartData ? (
                    <div style={{ height: 300, width: '100%', fontSize: '0.75rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                {chartLines}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    // Fallback Table if no data transformable
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {config.trendTable?.columns?.map((col: string, i: number) => (
                                        <th key={i} className="p-3 text-left font-semibold text-slate-600">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {config.trendTable?.rows?.map((row: any[], i: number) => (
                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                        {row.map((cell: any, j: number) => (
                                            <td key={j} className="p-3 text-slate-700">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* 3. Question Interaction */}
            <div>
                {isSATA ? (
                    <SATARenderer {...props} />
                ) : (
                    <SingleChoiceRenderer {...props} />
                )}
            </div>
        </div>
    );
};
