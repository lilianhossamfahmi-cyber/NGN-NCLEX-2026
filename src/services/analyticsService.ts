import { AnalyticsSummary, DomainPerformance, ItemTypeStat } from '../types/analytics-schema';

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
        passProbability: 84, // Calculated hypothetical
        streakDays: 4,
        domains: domains.sort((a, b) => a.accuracy - b.accuracy), // Mock sort by weakness for recommendations? Or caller does it.
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
