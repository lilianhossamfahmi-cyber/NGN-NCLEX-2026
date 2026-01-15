/**
 * ExamReadinessService.ts
 * Predicts NCLEX Pass Probability and Readiness
 */

export class ExamReadinessService {

    /**
     * Calculate Readiness Score (0-100)
     * Based on CAT Theta, Consistency, and Trend
     */
    static calculateReadiness(theta: number, recentAccuracy: number, trendSlope: number): {
        score: number,
        probability: string,
        recommendation: string,
        readinessLevel: 'Low' | 'Borderline' | 'High' | 'Very High'
    } {
        // Theta -1.0 is roughly passing standard (0.00 logit)
        // We map Theta -3 to +3 into a 0-100 scale focused on the passing mark

        // Base Score from Theta (Ability)
        // Theta 0.0 (Avg) -> 75% chance
        // Theta -1.0 (Borderline) -> 50% chance
        // theta +1.0 (Strong) -> 90% chance
        // Linear approx for range around 0: 75 + (Theta * 20)
        let baseScore = 75 + (theta * 20);

        // Adjust for Accuracy consistency (Bonus if > 70%)
        if (recentAccuracy > 75) baseScore += 5;
        if (recentAccuracy < 60) baseScore -= 10;

        // Adjust for Trend (Bonus if improving)
        if (trendSlope > 0) baseScore += 5;
        if (trendSlope < 0) baseScore -= 5;

        // Clamp
        const finalScore = Math.min(99, Math.max(1, Math.round(baseScore)));

        let probability = '';
        let readinessLevel: 'Low' | 'Borderline' | 'High' | 'Very High' = 'Low';
        let recommendation = '';

        if (finalScore >= 90) {
            probability = 'Very High (>98%)';
            readinessLevel = 'Very High';
            recommendation = 'You are ready. Schedule your exam now.';
        } else if (finalScore >= 75) {
            probability = 'High (85-95%)';
            readinessLevel = 'High';
            recommendation = 'You are in the green. Maintaing your pace.';
        } else if (finalScore >= 60) {
            probability = 'Moderate (60-80%)';
            readinessLevel = 'Borderline';
            recommendation = 'You are heavily borderline. Focus on weak domains.';
        } else {
            probability = 'Low (<50%)';
            readinessLevel = 'Low';
            recommendation = 'Not ready yet. Significant remediation needed.';
        }

        return {
            score: finalScore,
            probability,
            recommendation,
            readinessLevel
        };
    }
}
