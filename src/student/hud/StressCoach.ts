/**
 * StressCoach.ts
 * Logic for triggering interventions
 */

export interface Intervention {
    type: 'breathing' | 'refocus' | 'slow_down';
    message: string;
    duration: number; // seconds
}

export class StressCoach {

    static checkCondition(focus: number, stress: number): Intervention | null {
        // High Stress Trigger
        if (stress > 80) {
            return {
                type: 'breathing',
                message: "High stress detected. Take a deep breath.",
                duration: 10
            };
        }

        // Low Focus Trigger
        if (focus < 40) {
            return {
                type: 'refocus',
                message: "Eyes up. Focus dropping.",
                duration: 5
            };
        }

        return null;
    }
}
