import { AnalyticsSummary, DomainPerformance, ItemTypeStat } from '../types/analytics-schema';
import { supabase } from '../lib/supabase';

export const getRealAnalytics = async (): Promise<AnalyticsSummary> => {
    try {
        const { data: items, error } = await supabase.from('item_bank').select('type_id, clinical_focus, quality_score, created_at');

        if (error || !items || items.length === 0) {
            return getMockAnalytics(); // Fallback if empty
        }

        const domainMap: Record<string, { total: number; score: number }> = {};
        const typeMap: Record<string, { total: number; score: number }> = {};
        const progressMap: Record<string, { count: number; score: number }> = {};

        items.forEach(item => {
            const domain = item.clinical_focus || 'General';
            const type = item.type_id || 'unknown';
            const score = item.quality_score || 0;
            const date = new Date(item.created_at).toISOString().split('T')[0];

            if (!domainMap[domain]) domainMap[domain] = { total: 0, score: 0 };
            domainMap[domain].total++;
            domainMap[domain].score += score;

            if (!typeMap[type]) typeMap[type] = { total: 0, score: 0 };
            typeMap[type].total++;
            typeMap[type].score += score;

            if (!progressMap[date]) progressMap[date] = { count: 0, score: 0 };
            progressMap[date].count++;
            progressMap[date].score += score;
        });

        const domains: DomainPerformance[] = Object.entries(domainMap).map(([name, stats], i) => ({
            domainId: String(i),
            domainName: name,
            totalQuestions: stats.total,
            correctCount: stats.total,
            accuracy: Math.round(stats.score / stats.total),
            lastPracticed: new Date().toISOString()
        }));

        const itemTypes: ItemTypeStat[] = Object.entries(typeMap).map(([id, stats]) => ({
            typeId: id,
            typeName: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            count: stats.total,
            accuracy: Math.round(stats.score / stats.total),
            trend: 'stable'
        }));

        const dailyProgress = Object.entries(progressMap).map(([date, stats]) => ({
            date,
            questionsAnswered: stats.count,
            accuracy: Math.round(stats.score / stats.count)
        })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);

        const overallAccuracy = Math.round(items.reduce((acc, i) => acc + (i.quality_score || 0), 0) / items.length);

        return {
            totalQuestions: items.length,
            overallAccuracy,
            passProbability: Math.min(99, Math.round(overallAccuracy * 1.1)),
            streakDays: dailyProgress.length,
            domains: domains.sort((a, b) => a.accuracy - b.accuracy),
            itemTypes,
            dailyProgress,
            badges: [
                { id: '1', name: 'Collector', description: 'Populated Item Bank', icon: '📁', unlocked: true, unlockedDate: items[0].created_at, category: 'milestone' },
                { id: '2', name: 'Quality Conscious', description: 'Maintained high quality items', icon: '⭐', unlocked: overallAccuracy > 80, category: 'mastery' }
            ],
            recommendations: [
                { id: 'rec1', type: 'domain', label: `Expand ${domains[0].domainName}`, reason: 'Fewest items generated', action: 'Generate Batch' }
            ]
        };
    } catch (e) {
        console.warn("Analytics Fetch Error:", e);
        return getMockAnalytics();
    }
};

export const getMockAnalytics = (): AnalyticsSummary => {
    const domains: DomainPerformance[] = [
        { domainId: '1', domainName: 'Critical Care', totalQuestions: 45, correctCount: 38, accuracy: 84, lastPracticed: '2025-12-19' },
        { domainId: '2', domainName: 'Pediatrics', totalQuestions: 30, correctCount: 18, accuracy: 60, lastPracticed: '2025-12-18' },
        { domainId: '3', domainName: 'Pharmacology', totalQuestions: 60, correctCount: 45, accuracy: 75, lastPracticed: '2025-12-19' },
        { domainId: '4', domainName: 'Med-Surg', totalQuestions: 112, correctCount: 80, accuracy: 71, lastPracticed: '2025-12-20' },
        { domainId: '5', domainName: 'Ob/Mat', totalQuestions: 20, correctCount: 18, accuracy: 90, lastPracticed: '2025-12-15' },
        { domainId: '6', domainName: 'Mental Health', totalQuestions: 25, correctCount: 12, accuracy: 48, lastPracticed: '2025-12-10' },
    ];

    const itemTypes: ItemTypeStat[] = [
        { typeId: 'case-study', typeName: 'Case Studies', count: 12, accuracy: 78, trend: 'up' },
        { typeId: 'bow-tie', typeName: 'Bow-Tie', count: 8, accuracy: 62, trend: 'stable' },
        { typeId: 'matrix', typeName: 'Matrix', count: 15, accuracy: 55, trend: 'down' },
        { typeId: 'trend', typeName: 'Trend', count: 5, accuracy: 80, trend: 'up' },
        { typeId: 'highlight', typeName: 'Highlight', count: 10, accuracy: 90, trend: 'stable' },
        { typeId: 'cloze', typeName: 'Cloze', count: 6, accuracy: 70, trend: 'up' },
    ];

    return {
        totalQuestions: 345,
        overallAccuracy: 72,
        passProbability: 84,
        streakDays: 4,
        domains: domains.sort((a, b) => a.accuracy - b.accuracy),
        itemTypes,
        dailyProgress: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
            questionsAnswered: Math.floor(Math.random() * 20),
            accuracy: 60 + Math.floor(Math.random() * 35)
        })),
        badges: [
            { id: '1', name: 'First Steps', description: 'Complete your first session', icon: '🏁', unlocked: true, unlockedDate: '2025-12-01', category: 'milestone' },
            { id: '2', name: 'On Fire', description: '3-Day Streak', icon: '🔥', unlocked: true, unlockedDate: '2025-12-18', category: 'streak' },
            { id: '3', name: 'Matrix Master', description: '90% Accuracy in Matrix', icon: '🧠', unlocked: false, category: 'mastery' },
            { id: '4', name: 'Safe Practicioner', description: '85% Overall Accuracy', icon: '🛡️', unlocked: false, category: 'milestone' },
            { id: '5', name: 'NGN Hero', description: 'Complete 100 Case Studies', icon: '🦸', unlocked: false, category: 'milestone' },
            { id: '6', name: 'Reviewer', description: 'Review 50 rationales', icon: '📝', unlocked: true, category: 'milestone' }
        ],
        recommendations: [
            { id: 'rec1', type: 'domain', label: 'Mental Health Focus', reason: 'Lowest performing domain (48%)', action: 'Create Mental Health Set' },
            { id: 'rec2', type: 'itemType', label: 'Practice Matrix Grids', reason: 'Accuracy trending down', action: 'Matrix Drill' },
            { id: 'rec3', type: 'general', label: 'Maintain Streak', reason: 'You are on a 4-day streak!', action: 'Quick Session' }
        ]
    };
};
