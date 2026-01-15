/**
 * SurvivalEngine.ts
 * 
 * Game logic for Mode 5: Gamified Survival.
 * Handles infinite loop state, streaks, multipliers, and health.
 */

export interface SurvivalState {
    lives: number; // Max 5, starts at 3
    streak: number;
    score: number;
    questionCount: number;
    level: number; // Difficulty 1-5
    multiplier: number;
    isGameOver: boolean;
    history: { correct: boolean, points: number }[];
}

export class SurvivalEngine {
    static readonly MAX_LIVES = 5;
    static readonly BASE_SCORE = 100;

    static getInitialState(): SurvivalState {
        return {
            lives: 3,
            streak: 0,
            score: 0,
            questionCount: 0,
            level: 2, // Start comfortable
            multiplier: 1.0,
            isGameOver: false,
            history: []
        };
    }

    static processAnswer(state: SurvivalState, isCorrect: boolean): SurvivalState {
        const newState = { ...state };
        newState.questionCount++;

        if (isCorrect) {
            // STREAK & MULTIPLIER
            newState.streak++;
            newState.multiplier = SurvivalEngine.calculateMultiplier(newState.streak);

            // SCORE
            const points = Math.round(SurvivalEngine.BASE_SCORE * newState.multiplier);
            newState.score += points;

            // BONUS LIFE (Every 5 streak)
            if (newState.streak % 5 === 0 && newState.lives < SurvivalEngine.MAX_LIVES) {
                // Potential visual event?
                // newState.lives++; // Maybe too generous? Let's leave for specific powerups or every 10.
                // Doing every 10 for balancing:
                if (newState.streak % 10 === 0) newState.lives = Math.min(SurvivalEngine.MAX_LIVES, newState.lives + 1);
            }

            // DIFFICULTY RAMP
            // Every 5 correct, maybe bump level?
            // Simple logic: if streak is high, push max difficulty
            if (newState.streak > 15) newState.level = 5;
            else if (newState.streak > 10) newState.level = 4;
            else if (newState.streak > 5) newState.level = 3;

            newState.history.push({ correct: true, points });

        } else {
            // WRONG ANSWER
            newState.lives--;
            newState.streak = 0; // Reset streak
            newState.multiplier = 1.0;

            // DIFFICULTY DROP
            newState.level = Math.max(1, newState.level - 1); // Mercy drop

            if (newState.lives <= 0) {
                newState.isGameOver = true;
            }
            newState.history.push({ correct: false, points: 0 });
        }

        return newState;
    }

    static calculateMultiplier(streak: number): number {
        if (streak < 5) return 1.0;
        if (streak < 10) return 1.5;
        if (streak < 20) return 2.0;
        if (streak < 50) return 3.0; // "On Fire"
        return 5.0; // "Unstoppable"
    }
}
