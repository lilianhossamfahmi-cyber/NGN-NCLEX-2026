/**
 * WeaknessDetectionEngine.ts
 * 
 * Analyzes student performance to identify critical weaknesses and prescription drills.
 */

import { StudentMetricsData } from '../../hooks/useStudentMetrics';

export interface DetectedWeakness {
    id: string;
    type: 'DOMAIN' | 'CJMM_STEP' | 'TIME_MANAGEMENT' | 'FOUNDATION';
    topic: string;
    currentScore: number;
    threshold: number;
    priority: number; // 1 (Highest) - 5 (Lowest)
    recommendedDrill: DrillConfiguration;
}

export interface DrillConfiguration {
    title: string;
    topic: string;
    itemCount: number;
    startDifficulty: 1 | 2 | 3 | 4 | 5; // 1-5
    focusDomains: string[];
    focusTypes?: string[];
    timeLimitPerQuestion?: number; // seconds
    adaptiveRules: 'standard' | 'remediation' | 'challenge';
}

export class WeaknessDetectionEngine {

    /**
     * Analyze Metrics and Detect Weaknesses
     */
    static analyze(metrics: StudentMetricsData): DetectedWeakness[] {
        const weaknesses: DetectedWeakness[] = [];
        const { stats } = metrics;

        // 1. Check Foundation Gap (< 85% on Easy Items - simulated by low overall accuracy for now)
        if (stats.accuracy < 50) {
            weaknesses.push({
                id: 'foundation_gap',
                type: 'FOUNDATION',
                topic: 'Core Nursing Concepts',
                currentScore: stats.accuracy,
                threshold: 85,
                priority: 1,
                recommendedDrill: {
                    title: 'Foundation Builder',
                    topic: 'Core Concepts',
                    itemCount: 10,
                    startDifficulty: 1, // Start very easy
                    focusDomains: ['Fundamentals'],
                    adaptiveRules: 'remediation'
                }
            });
        }

        // 2. Check Domain Weaknesses (< 70%)
        Object.entries(stats.domains).forEach(([domain, score]) => {
            if (score < 70) {
                weaknesses.push({
                    id: `domain_${domain}`,
                    type: 'DOMAIN',
                    topic: domain,
                    currentScore: score,
                    threshold: 70,
                    priority: 2,
                    recommendedDrill: {
                        title: `${domain} Attack Drill`,
                        topic: domain,
                        itemCount: 12,
                        startDifficulty: 2, // Start easy-medium
                        focusDomains: [domain],
                        adaptiveRules: 'remediation'
                    }
                });
            }
        });

        // 3. Check CJMM Step Weaknesses (< 65%)
        Object.entries(stats.cjmm).forEach(([step, score]) => {
            if (score < 65) {
                weaknesses.push({
                    id: `cjmm_${step}`,
                    type: 'CJMM_STEP',
                    topic: `Clinical Judgment: ${step}`,
                    currentScore: score,
                    threshold: 65,
                    priority: 3,
                    recommendedDrill: {
                        title: `${step} Focus Session`,
                        topic: step,
                        itemCount: 10,
                        startDifficulty: 3,
                        focusDomains: [], // Mix domains, focus on cognitive step (requires backend support)
                        focusTypes: ['case-study', 'bow-tie'], // types that exercise judgment
                        adaptiveRules: 'standard'
                    }
                });
            }
        });

        // 4. Time Management
        if (stats.timeEfficiency > 1.25) { // 25% slower than basline 1.0
            weaknesses.push({
                id: 'time_management',
                type: 'TIME_MANAGEMENT',
                topic: 'Pacing & Efficiency',
                currentScore: Math.round(100 / stats.timeEfficiency), // Mock score inverse to speed
                threshold: 80,
                priority: 4,
                recommendedDrill: {
                    title: 'Speed Drill Challenge',
                    topic: 'Rapid Response',
                    itemCount: 15,
                    startDifficulty: 3,
                    focusDomains: [],
                    timeLimitPerQuestion: 60, // 1 min hard limit
                    adaptiveRules: 'challenge'
                }
            });
        }

        // Sort by Priority (Low number = High priority) 
        // Then by gap size (Score vs Threshold)
        return weaknesses.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return (a.currentScore - a.threshold) - (b.currentScore - b.threshold); // Ascending (larger negative gap first)
        });
    }

    /**
     * Get Progression Logic for Remediation Drill
     * Returns the next difficulty based on recent performance in the drill.
     */
    static getAdaptiveDifficulty(
        currentDiff: number,
        recentHistory: boolean[],
        mode: 'standard' | 'remediation' | 'challenge'
    ): number {
        const last1 = recentHistory[recentHistory.length - 1];
        const last2 = recentHistory[recentHistory.length - 2];
        const last3 = recentHistory[recentHistory.length - 3];

        if (mode === 'remediation') {
            // Gentle ramp up, quick drop down
            if (!last1 && !last2) return Math.max(1, currentDiff - 1); // 2 wrong -> drop
            if (last1 && last2 && last3) return Math.min(4, currentDiff + 1); // 3 right -> bump (max 4)
            return currentDiff;
        }

        if (mode === 'challenge') {
            // Aggressive
            if (last1) return Math.min(5, currentDiff + 1); // 1 right -> bump
            if (!last1) return Math.max(3, currentDiff - 1); // 1 wrong -> drop (floor 3)
            return currentDiff;
        }

        // Standard
        if (!last1) return currentDiff; // Stay on wrong
        if (last1 && last2) return Math.min(5, currentDiff + 1); // 2 right -> bump
        return currentDiff;
    }

    /**
     * getCoachingMessage
     */
    static getCoachingMessage(
        isCorrect: boolean,
        streak: number
    ): string {
        if (isCorrect) {
            if (streak === 1) return "Good start! Keep going.";
            if (streak === 2) return "You're getting the hang of this!";
            if (streak >= 3) return "You're on fire! 🔥";
            return "Correct!";
        } else {
            return "That was a tricky one. Let's learn from it.";
        }
    }
}
