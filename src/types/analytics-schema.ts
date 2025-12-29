export interface DomainPerformance {
    domainId: string;
    domainName: string;
    totalQuestions: number;
    correctCount: number;
    accuracy: number; // 0-100
    lastPracticed: string;
}

export interface AchievementBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedDate?: string;
    category: 'milestone' | 'mastery' | 'streak';
}

export interface DailyProgress {
    date: string;
    questionsAnswered: number;
    accuracy: number;
}

export interface ItemTypeStat {
    typeId: string;
    typeName: string;
    count: number;
    accuracy: number;
    trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsSummary {
    totalQuestions: number;
    overallAccuracy: number;
    passProbability: number;
    streakDays: number;
    domains: DomainPerformance[];
    itemTypes: ItemTypeStat[];
    dailyProgress: DailyProgress[]; // Last 30 days
    badges: AchievementBadge[];
    recommendations: StudyRecommendation[];
}

export interface StudyRecommendation {
    id: string;
    type: 'domain' | 'itemType' | 'general';
    label: string;
    reason: string;
    action: string;
}
