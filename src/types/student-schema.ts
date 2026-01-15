/**
 * student-schema.ts
 * Type definitions for Student Analytics & Dashboard
 */

export interface Attempt {
    id: string;
    questionId: string;
    date: string; // ISO
    score: number;
    maxScore: number;
    difficulty: number; // 1-5
    domain: string; // 'Cardiac', etc.
    cjmmStep?: string; // 'Recognize Cues', etc.
    timeSpentSeconds: number;
    itemType: string;
}

export interface BiometricData {
    avgFocus: number; // 0-100
    stressEvents: number; // count
    calmTrend: number[]; // Array of last 7 days calm score
}

export interface StudentStats {
    accuracy: number;        // 0-100
    passProbability: number; // 0-99
    foundationAcc: number;   // 0-100
    timeEfficiency: number;  // 1.0 = Benchmark
    trend: 'improving' | 'declining' | 'stable';
    domains: Record<string, number>; // Domain -> Mastery %
    cjmm: Record<string, number>;    // Step -> Mastery %
}

export interface DashboardData {
    stats: StudentStats;
    recentAttempts: Attempt[];
    biometrics: BiometricData;
    recommendations: RecommendedAction[];
    srsDueCount: number;
}

export interface RecommendedAction {
    id: string;
    type: 'drill' | 'review' | 'sim';
    title: string;
    reason: string;
    actionLink: string;
}
