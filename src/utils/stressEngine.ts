export interface InteractionData {
    changeCount: number;
    timeSpent: number;
    peerAvg: number;
    rapidClicking?: boolean; // Heuristic: >3 clicks in <2 seconds
    mouseIdleTime?: number; // Heuristic: No movement for >30s
}

export interface StressResult {
    score: number; // 0-100
    level: 'Low' | 'Moderate' | 'High';
    reason: string;
    copingStrategy: string;
}

export class StressDetectionEngine {

    /**
     * Analyzes user interaction patterns to detect signs of test anxiety, panic, or analysis paralysis.
     * Returns actionable psychological insights.
     */
    static calculateStressLevel(data: InteractionData): StressResult {
        const { changeCount, timeSpent, peerAvg, rapidClicking, mouseIdleTime } = data;
        let stressScore = 0;
        let reasons: string[] = [];
        let strategies: string[] = [];

        // 1. Check for Panic (Rapid Clicking)
        if (rapidClicking) {
            stressScore += 50;
            reasons.push("High-velocity clicking suggests panic-guessing.");
            strategies.push("Strategy: Box Breathing. Inhale 4s, Hold 4s, Exhale 4s. Reset your amygdala.");
        }

        // 2. Check for Indecision (Answer Reversals)
        if (changeCount > 3) {
            stressScore += 40;
            reasons.push("Multiple answer reversals indicate second-guessing.");
            strategies.push("Strategy: Stick to your first gut instinct unless you find factual evidence to change it.");
        }

        // 3. Check for Analysis Paralysis / Freezing (Time)
        if (timeSpent > (peerAvg * 2.5)) {
            stressScore += 30;
            reasons.push("Extended duration suggests 'Analysis Paralysis' or freezing.");
            strategies.push("Strategy: Read the stem out loud (whisper) to break the loop. Focus on the verb.");
        }

        // 4. Check for Disengagement (Idle)
        if (mouseIdleTime && mouseIdleTime > 45) {
            stressScore += 20;
            reasons.push("Long idle time suggests cognitive overload or disengagement.");
            strategies.push("Strategy: Close your eyes for 5 seconds to reset your visual cortex.");
        }

        // Determine Final Output
        let level: StressResult['level'] = 'Low';
        let mainReason = "Performance is within normal stress parameters.";
        let mainStrategy = "Strategy: Maintain current pace and focus.";

        if (stressScore >= 50) {
            level = 'High';
            mainReason = reasons[0] || "Multiple stress indicators detected.";
            mainStrategy = strategies[0] || "Strategy: Take a deep breath and reset.";
        } else if (stressScore >= 30) {
            level = 'Moderate';
            mainReason = reasons[0] || "Signs of hesitation detected.";
            mainStrategy = strategies[0] || "Strategy: Trust your preparation.";
        }

        return {
            score: Math.min(stressScore, 100),
            level,
            reason: mainReason,
            copingStrategy: mainStrategy
        };
    }
}
