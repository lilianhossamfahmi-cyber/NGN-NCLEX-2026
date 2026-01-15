/**
 * CalmEngine.ts
 * Logic for calculating the Emotional Stability score (CALM)
 */

export class CalmEngine {

    /**
     * Calculate CALM Score (0-100)
     * @param avgStress (0-100)
     * @param avgFocus (0-100)
     * @param consistency (0-100, variance factor)
     */
    static calculateCalmScore(avgStress: number, avgFocus: number, consistency: number): number {
        // Weights: Stress is dominant factor (inverse), Focus is secondary.
        // CALM = (100 - Stress)*0.5 + Focus*0.3 + Consistency*0.2

        const stressComponent = (100 - avgStress) * 0.5;
        const focusComponent = avgFocus * 0.3;
        const stabilityComponent = consistency * 0.2;

        return Math.round(stressComponent + focusComponent + stabilityComponent);
    }

    /**
     * Determine emotional state label
     */
    static getEmotionalState(calmScore: number): { label: string, color: string } {
        if (calmScore >= 80) return { label: 'Zen Master', color: '#10b981' }; // Green
        if (calmScore >= 60) return { label: 'Composed', color: '#3b82f6' };  // Blue
        if (calmScore >= 40) return { label: 'Anxious', color: '#f59e0b' };   // Orange
        return { label: 'Overwhelmed', color: '#ef4444' };                   // Red
    }
}
