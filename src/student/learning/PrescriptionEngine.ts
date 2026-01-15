/**
 * PrescriptionEngine.ts
 * Generates daily recommended tasks based on student weaknesses.
 */

import { StudentStats } from '../../types/student-schema';
import { DailyPrescription } from '../types/learning-schema';

export class PrescriptionEngine {

    static generateDailyPrescription(stats: StudentStats): DailyPrescription {
        const weakness = this.findCriticalWeakness(stats);
        const today = new Date().toISOString().split('T')[0];

        if (weakness.type === 'domain') {
            return {
                id: `rx_${today}`,
                date: today,
                type: 'weakness_target',
                title: `${weakness.target} Repair`,
                description: `Your accuracy in ${weakness.target} is ${weakness.score}%. Let's fix that.`,
                targetDomain: weakness.target,
                itemCount: 15,
                estimatedMinutes: 20,
                expectedImprovement: '+3% Accuracy',
                completed: false
            };
        } else if (weakness.type === 'foundation') {
            return {
                id: `rx_${today}`,
                date: today,
                type: 'foundation_repair',
                title: 'Back to Basics',
                description: 'Foundation scores are low. Review Level 1 & 2 concepts.',
                itemCount: 20,
                estimatedMinutes: 25,
                expectedImprovement: '+5% Stability',
                completed: false
            };
        }

        // Default: Balanced Maintenance
        return {
            id: `rx_${today}`,
            date: today,
            type: 'balanced_maintenance',
            title: 'Daily Maintenance',
            description: 'Keep your momentum going with a balanced mix.',
            itemCount: 10,
            estimatedMinutes: 15,
            expectedImprovement: '+1% Consistency',
            completed: false
        };
    }

    private static findCriticalWeakness(stats: StudentStats): { type: string, target?: string, score?: number } {
        // 1. Check Domains < 60%
        const weakDomain = Object.entries(stats.domains)
            .sort((a, b) => a[1] - b[1])[0]; // Lowest first

        if (weakDomain && weakDomain[1] < 60) {
            return { type: 'domain', target: weakDomain[0], score: weakDomain[1] };
        }

        // 2. Check Foundation < 75%
        if (stats.foundationAcc < 75) {
            return { type: 'foundation' };
        }

        return { type: 'none' };
    }
}
