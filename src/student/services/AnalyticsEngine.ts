/**
 * AnalyticsEngine.ts
 * 
 * Core business logic for Student Dashboard metrics.
 * Pure functions only - easier to test.
 */

import { Attempt } from '../../types/student-schema';

export const AnalyticsEngine = {

    /**
     * Calculate Overall Accuracy across all attempts
     */
    calculateAccuracy(attempts: Attempt[]): number {
        if (!attempts.length) return 0;
        const totalPossible = attempts.reduce((acc, a) => acc + a.maxScore, 0);
        const totalEarned = attempts.reduce((acc, a) => acc + a.score, 0);
        return totalPossible === 0 ? 0 : Math.round((totalEarned / totalPossible) * 100);
    },

    /**
     * Calculate Accuracy for Foundation Level (Difficulty 1 & 2)
     */
    calculateFoundationQuality(attempts: Attempt[]): number {
        const foundationAttempts = attempts.filter(a => a.difficulty <= 2);
        if (!foundationAttempts.length) return 0;
        return this.calculateAccuracy(foundationAttempts);
    },

    /**
     * Calculate Average Time Management Rating
     * < 1.0 = Faster than benchmark (Good)
     * > 1.0 = Slower than benchmark (Needs improvement)
     */
    calculateTimeEfficiency(attempts: Attempt[]): number {
        if (!attempts.length) return 1.0;

        let totalEfficiency = 0;
        attempts.forEach(a => {
            // Benchmark: 60s for Easy, 90s Med, 120s Hard
            const benchmark = a.difficulty === 1 ? 60 : a.difficulty === 2 ? 75 : a.difficulty === 3 ? 90 : 120;
            const efficiency = a.timeSpentSeconds / benchmark;
            totalEfficiency += efficiency;
        });

        return parseFloat((totalEfficiency / attempts.length).toFixed(2));
    },

    /**
     * Breakdown Mastery by Domain (Clinical Focus)
     */
    calculateDomainMastery(attempts: Attempt[]): Record<string, number> {
        const domains: Record<string, { earned: number, possible: number }> = {};

        attempts.forEach(a => {
            const domain = a.domain || 'General';
            if (!domains[domain]) domains[domain] = { earned: 0, possible: 0 };
            domains[domain].earned += a.score;
            domains[domain].possible += a.maxScore;
        });

        const result: Record<string, number> = {};
        Object.keys(domains).forEach(d => {
            const { earned, possible } = domains[d];
            result[d] = possible === 0 ? 0 : Math.round((earned / possible) * 100);
        });

        return result;
    },

    /**
     * Breakdown by CJMM Step (Cognitive Process)
     */
    calculateCjmmBreakdown(attempts: Attempt[]): Record<string, number> {
        const steps = [
            'Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses',
            'Generate Solutions', 'Take Action', 'Evaluate Outcomes'
        ];

        const metrics: Record<string, { earned: number, possible: number }> = {};
        steps.forEach(s => metrics[s] = { earned: 0, possible: 0 });

        attempts.forEach(a => {
            const step = a.cjmmStep || 'Recognize Cues'; // Default fallback
            if (metrics[step]) {
                metrics[step].earned += a.score;
                metrics[step].possible += a.maxScore;
            }
        });

        const result: Record<string, number> = {};
        steps.forEach(s => {
            result[s] = metrics[s].possible === 0 ? 0 : Math.round((metrics[s].earned / metrics[s].possible) * 100);
        });

        return result;
    },

    /**
     * Calculate 7-Day Trend Slope (Simple linear approximation)
     * Positive = Improving, Negative = Declining
     */
    calculateTrend(attempts: Attempt[]): 'improving' | 'declining' | 'stable' {
        if (attempts.length < 5) return 'stable';

        // Sort by date ascending
        const sorted = [...attempts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Split into two halves
        const mid = Math.floor(sorted.length / 2);
        const firstHalf = sorted.slice(0, mid);
        const secondHalf = sorted.slice(mid);

        const acc1 = this.calculateAccuracy(firstHalf);
        const acc2 = this.calculateAccuracy(secondHalf);

        if (acc2 > acc1 + 5) return 'improving';
        if (acc2 < acc1 - 5) return 'declining';
        return 'stable';
    },

    /**
     * Composite Pass Probability Algorithm
     */
    calculatePassProbability(attempts: Attempt[]): number {
        if (attempts.length < 10) return 10; // Not enough data

        const overallAcc = this.calculateAccuracy(attempts);
        const foundationAcc = this.calculateFoundationQuality(attempts);
        const avgDifficulty = attempts.reduce((acc, a) => acc + a.difficulty, 0) / attempts.length;

        // Weights
        const W_ACC = 0.4;
        const W_DIFF = 0.3;
        const W_FOUNDATION = 0.3;

        // Base Score from Accuracy
        let score = overallAcc * W_ACC;

        // Difficulty Bonus: (Avg Diff - 1) * 20. 
        // e.g., Avg Diff 3.0 -> (2)*20 = 40pts. Max Diff 5 -> 80pts.
        // We cap this contribution at 100.
        const diffScore = Math.min(100, (avgDifficulty - 1) * 25);
        score += diffScore * W_DIFF;

        // Foundation Stability
        // If Foundation is weak, it drags the whole score down significantly
        // If Foundation is strong (>80%), it boosts confidence
        let foundationScore = 0;
        if (foundationAcc > 90) foundationScore = 100;
        else if (foundationAcc > 80) foundationScore = 80;
        else if (foundationAcc > 60) foundationScore = 50;
        else foundationScore = 20;

        score += foundationScore * W_FOUNDATION;

        // Calibration: NCLEX pass roughly corresponds to consistent Level 3 performance at ~65% acc
        // Our formula typically yields ~60-70 for a decent student.
        // We clamp to realistic 1-99%
        return Math.min(99, Math.max(5, Math.round(score)));
    }
};

// Mock Data Generator for Development
export const MockAnalyticsData = {
    generateAttempts(count: number): Attempt[] {
        const attempts: Attempt[] = [];
        const domains = ['Cardiac', 'Respiratory', 'Pharm', 'Fundamentals', 'Peds', 'Psych'];
        const steps = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];

        for (let i = 0; i < count; i++) {
            const diff = Math.floor(Math.random() * 3) + 1; // 1-3 mostly
            const max = diff * 2; // Harder items worth more
            const earned = Math.random() > 0.3 ? max : Math.floor(Math.random() * max); // 70% chance of success

            attempts.push({
                id: `att_${i}`,
                questionId: `q_${i}`,
                date: new Date(Date.now() - (count - i) * 86400000).toISOString(), // Days ago
                score: earned,
                maxScore: max,
                difficulty: diff,
                domain: domains[Math.floor(Math.random() * domains.length)],
                cjmmStep: steps[Math.floor(Math.random() * steps.length)],
                timeSpentSeconds: 45 + Math.random() * 90,
                itemType: 'multiple-choice'
            });
        }
        return attempts;
    }
};
