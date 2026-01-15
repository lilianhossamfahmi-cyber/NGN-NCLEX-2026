/**
 * ANALYTICS DASHBOARD - Item Statistics & Quality Metrics
 * Real-time analytics visualization with Recharts
 */

import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid
} from 'recharts';
import { Download, TrendingUp, Award, Target, BookOpen, Calendar } from 'lucide-react';
import type { MasterQuestionItem } from '../types/master-schema';

// ==================== TYPES ====================

export interface AnalyticsData {
    totalItems: number;
    typeDistribution: Record<string, number>;
    averageQualityScore: number;
    clinicalFocusBreakdown: Record<string, number>;
    difficultyDistribution: Record<string, number>;
    generationTrends: { date: string; count: number }[];
    cjmmDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
}

interface DateRange {
    start: Date | null;
    end: Date | null;
}

// ==================== COLORS ====================

const CHART_COLORS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
];

const DIFFICULTY_COLORS: Record<string, string> = {
    'Easy': '#10b981',
    'Moderate': '#f59e0b',
    'Hard': '#ef4444',
    '1': '#10b981',
    '2': '#84cc16',
    '3': '#f59e0b',
    '4': '#f97316',
    '5': '#ef4444'
};

// ==================== CALCULATION FUNCTIONS ====================

function calculateAnalytics(items: MasterQuestionItem[], dateRange?: DateRange): AnalyticsData {
    // Filter by date range if provided
    let filteredItems = items;
    if (dateRange?.start || dateRange?.end) {
        filteredItems = items.filter(item => {
            const itemDate = new Date(item.metadata?.createdAt || 0);
            if (dateRange.start && itemDate < dateRange.start) return false;
            if (dateRange.end && itemDate > dateRange.end) return false;
            return true;
        });
    }

    const totalItems = filteredItems.length;

    // Type Distribution
    const typeDistribution = filteredItems.reduce((acc, item) => {
        const type = item.typeId || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Average Quality Score
    const totalScore = filteredItems.reduce((sum, item) =>
        sum + (item.metadata?.qualityScore || 0), 0
    );
    const averageQualityScore = totalItems > 0 ? totalScore / totalItems : 0;

    // Clinical Focus Breakdown
    const clinicalFocusBreakdown = filteredItems.reduce((acc, item) => {
        const focus = item.pedagogy?.clinicalFocus || 'General';
        acc[focus] = (acc[focus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Difficulty Distribution
    const difficultyDistribution = filteredItems.reduce((acc, item) => {
        const diff = String(item.pedagogy?.difficultyLevel || 'Moderate');
        acc[diff] = (acc[diff] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // CJMM Distribution
    const cjmmDistribution = filteredItems.reduce((acc, item) => {
        const cjmm = (item.pedagogy as any)?.cjmmStep || (item.pedagogy as any)?.cjmmPhase || 'Unknown';
        acc[cjmm] = (acc[cjmm] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Status Distribution
    const statusDistribution = filteredItems.reduce((acc, item) => {
        const status = item.metadata?.status || 'draft';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Generation Trends (last 30 days)
    const generationTrends = calculateTrends(filteredItems);

    return {
        totalItems,
        typeDistribution,
        averageQualityScore,
        clinicalFocusBreakdown,
        difficultyDistribution,
        generationTrends,
        cjmmDistribution,
        statusDistribution
    };
}

function calculateTrends(items: MasterQuestionItem[]): { date: string; count: number }[] {
    const last30Days: { date: string; count: number }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const count = items.filter(item => {
            const itemDate = new Date(item.metadata?.createdAt || 0).toISOString().split('T')[0];
            return itemDate === dateStr;
        }).length;

        last30Days.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count
        });
    }

    return last30Days;
}

// ==================== HELPER FUNCTIONS ====================

function formatDistributionData(distribution: Record<string, number>): { name: string; value: number }[] {
    return Object.entries(distribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

function getQualityLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
}

function getQualityColor(score: number): string {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
}

// ==================== COMPONENTS ====================

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color = '#3b82f6' }) => (
    <div
        className="bg-white rounded-xl shadow-lg p-6 border-l-4 transition-transform hover:scale-105"
        style={{ borderLeftColor: color }}
        role="region"
        aria-label={`${title}: ${value}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                {trend && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp size={14} />
                        {trend}
                    </p>
                )}
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                {icon}
            </div>
        </div>
    </div>
);

interface ChartContainerProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-lg p-6" role="figure" aria-label={title}>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
        <div className="mt-4">{children}</div>
    </div>
);

// ==================== MAIN DASHBOARD ====================

interface AnalyticsDashboardProps {
    items: MasterQuestionItem[];
    onExport?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ items, onExport }) => {
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

    const analytics = useMemo(() => calculateAnalytics(items, dateRange), [items, dateRange]);

    const typeData = useMemo(() => formatDistributionData(analytics.typeDistribution), [analytics.typeDistribution]);
    const focusData = useMemo(() => formatDistributionData(analytics.clinicalFocusBreakdown), [analytics.clinicalFocusBreakdown]);
    const difficultyData = useMemo(() => formatDistributionData(analytics.difficultyDistribution), [analytics.difficultyDistribution]);
    const statusData = useMemo(() => formatDistributionData(analytics.statusDistribution), [analytics.statusDistribution]);

    return (
        <div className="space-y-6 p-4 md:p-6" role="main" aria-label="Analytics Dashboard">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time insights into your question bank</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range Filter */}
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border">
                        <Calendar size={16} className="text-slate-400" />
                        <input
                            type="date"
                            className="text-sm border-none focus:outline-none"
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                            aria-label="Start date"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                            type="date"
                            className="text-sm border-none focus:outline-none"
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                            aria-label="End date"
                        />
                    </div>

                    {/* Export Button */}
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-w-[44px] min-h-[44px]"
                            aria-label="Export analytics report as PDF"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export Report</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Items"
                    value={analytics.totalItems.toLocaleString()}
                    icon={<BookOpen size={24} color="#3b82f6" />}
                    color="#3b82f6"
                />
                <MetricCard
                    title="Avg Quality Score"
                    value={`${analytics.averageQualityScore.toFixed(1)}%`}
                    icon={<Award size={24} color={getQualityColor(analytics.averageQualityScore)} />}
                    trend={getQualityLabel(analytics.averageQualityScore)}
                    color={getQualityColor(analytics.averageQualityScore)}
                />
                <MetricCard
                    title="Item Types"
                    value={Object.keys(analytics.typeDistribution).length}
                    icon={<Target size={24} color="#8b5cf6" />}
                    color="#8b5cf6"
                />
                <MetricCard
                    title="Clinical Areas"
                    value={Object.keys(analytics.clinicalFocusBreakdown).length}
                    icon={<TrendingUp size={24} color="#10b981" />}
                    color="#10b981"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Type Distribution */}
                <ChartContainer title="Item Type Distribution" description="Breakdown by question format">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={typeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value) => [`${value} items`, 'Count']}
                                contentStyle={{ borderRadius: '8px' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Clinical Focus Breakdown */}
                <ChartContainer title="Clinical Focus Areas" description="Distribution by specialty">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={focusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                labelLine={false}
                            >
                                {focusData.map((_, index) => (
                                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Difficulty Distribution */}
                <ChartContainer title="Difficulty Distribution" description="Items by complexity level">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={difficultyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {difficultyData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={DIFFICULTY_COLORS[entry.name] || CHART_COLORS[index]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Status Distribution */}
                <ChartContainer title="Item Status" description="Published vs Draft">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.name === 'published' ? '#10b981' :
                                            entry.name === 'draft' ? '#f59e0b' : '#ef4444'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Generation Trends */}
            <ChartContainer title="Generation Trends" description="Items created over the last 30 days">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.generationTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#8b5cf6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Screen reader summary */}
            <div className="sr-only" role="status" aria-live="polite">
                Analytics Summary: {analytics.totalItems} total items,
                {analytics.averageQualityScore.toFixed(1)}% average quality score,
                {Object.keys(analytics.typeDistribution).length} item types,
                {Object.keys(analytics.clinicalFocusBreakdown).length} clinical areas.
            </div>
        </div>
    );
};

// Export for use in other components
export { calculateAnalytics, formatDistributionData };

export default AnalyticsDashboard;
