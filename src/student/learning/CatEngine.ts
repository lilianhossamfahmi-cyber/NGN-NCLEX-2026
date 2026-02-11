/**
 * CatEngine.ts
 * 
 * Implements the Computer Adaptive Testing (CAT) logic for the NCLEX-RN Simulator.
 * Based on Item Response Theory (IRT) and Maximum Likelihood Estimation concepts.
 */

import { MasterQuestionItem } from '../../types/master-schema';
import { CatSession, CatConfig } from '../types/learning-schema';

// ----------------------------------------------------------------------------
// IRT CONSTANTS
// ----------------------------------------------------------------------------

export const DEFAULT_CAT_CONFIG: CatConfig = {
    minQuestions: 75,
    maxQuestions: 150,
    targetSEM: 0.30,
    maxTimeSeconds: 5 * 60 * 60, // 5 hours
    startTheta: 0.0,
    adjustmentBase: 0.4
};

// Map logical levels (1-5) to IRT b-values
export const DIFFICULTY_TO_B_VALUE: Record<number, number> = {
    1: -1.5, // Easy
    2: -0.5, // Moderately Easy
    3: 0.0,  // Moderate (Passing Standard)
    4: 1.0,  // Difficult
    5: 2.0   // Expert/Hard
};

// ----------------------------------------------------------------------------
// ENGINE LOGIC
// ----------------------------------------------------------------------------

export class CatEngine {
    private session: CatSession;

    constructor(studentId: string, customConfig?: Partial<CatConfig>) {
        this.session = {
            id: crypto.randomUUID(),
            studentId,
            startTime: Date.now(),
            currentTheta: customConfig?.startTheta ?? DEFAULT_CAT_CONFIG.startTheta,
            sem: 3.0, // High uncertainty at start
            itemsAnswered: 0,
            history: [],
            status: 'OPTIMIZING',
            config: { ...DEFAULT_CAT_CONFIG, ...customConfig }
        };
    }

    // Static initializer for ease of use
    static startSession(studentId: string, customConfig?: Partial<CatConfig>): CatEngine {
        return new CatEngine(studentId, customConfig);
    }

    // Rehydrate from session object
    static fromSession(session: CatSession): CatEngine {
        const engine = new CatEngine(session.studentId);
        engine.session = session;
        return engine;
    }

    /**
     * core: Calculate Probability of Correct Response
     * P(theta) = 1 / (1 + e^(-a(theta - b)))
     */
    public calculateProbability(theta: number, bDifficulty: number, aDiscrimination: number = 1.0): number {
        return 1 / (1 + Math.exp(-aDiscrimination * (theta - bDifficulty)));
    }

    /**
     * core: Process a Student's Answer
     * Updates Theta and SEM based on performance.
     */
    public processAnswer(
        item: MasterQuestionItem,
        isCorrect: boolean,
        timeTaken: number
    ): CatSession {
        // 1. Determine parameters
        const level = item.pedagogy?.difficultyLevel || 3;
        const bValue = DIFFICULTY_TO_B_VALUE[level] ?? 0.0;

        // 2. Update Theta (Simplified Adaptive Logic)
        // Damping: As we get more data, jumps become smaller to stabilize
        let jump = this.session.config.adjustmentBase;

        if (this.session.itemsAnswered > 10) jump *= 0.8;
        if (this.session.itemsAnswered > 20) jump *= 0.8;

        const oldTheta = this.session.currentTheta;
        // Basic Logic: Correct -> Increase Theta (Harder), Incorrect -> Check Theta (Easier)
        let newTheta = isCorrect ? oldTheta + jump : oldTheta - jump;

        // Clamp Theta (-3 to +3)
        newTheta = Math.max(-3, Math.min(3, newTheta));

        // 3. Update SEM (Approximation)
        // SEM scales inversely with sqrt(N)
        const newSEM = 3.0 / Math.sqrt(this.session.itemsAnswered + 1);

        // 4. Record Result
        this.session.history.push({
            questionId: item.id || 'unknown',
            bValue,
            isCorrect,
            timeTakenSeconds: timeTaken,
            thetaAfter: newTheta,
            timestamp: Date.now(),
            domain: item.pedagogy?.clinicalFocus || 'General'
        });

        // 5. Update State
        this.session.currentTheta = newTheta;
        this.session.sem = newSEM;
        this.session.itemsAnswered++;

        // 6. Check Stopping Rules
        this.checkStoppingCondition();

        return this.session;
    }

    /**
     * core: Evaluate Stopping Rules
     */
    private checkStoppingCondition(): void {
        const { minQuestions, maxQuestions, targetSEM, maxTimeSeconds } = this.session.config;
        const elapsed = (Date.now() - this.session.startTime) / 1000;

        // Rule 1: Time Violation
        if (elapsed > maxTimeSeconds) {
            this.finalizeStatus(true);
            return;
        }

        // Rule 2: Max Questions Reached
        if (this.session.itemsAnswered >= maxQuestions) {
            this.finalizeStatus(false);
            return;
        }

        // Rule 3: Min Questions Not Met -> Continue
        if (this.session.itemsAnswered < minQuestions) {
            this.session.status = 'OPTIMIZING';
            return;
        }

        // Rule 4: Confidence Reached 
        // 95% Confidence Interval: Theta +/- 1.96 * SEM
        const PASSING_STANDARD = 0.00;
        const lowerBound = this.session.currentTheta - (1.96 * this.session.sem);
        const upperBound = this.session.currentTheta + (1.96 * this.session.sem);

        if (lowerBound > PASSING_STANDARD) {
            this.session.status = 'PASSED';
        } else if (upperBound < PASSING_STANDARD) {
            this.session.status = 'FAILED';
        } else {
            // Check Explicit SEM target if CI is overlapping
            if (this.session.sem < targetSEM) {
                // If we are confident but still overlapping 0.00 standard, this is edge case.
                // Usually we continue until Max questions or CI separates. 
                // We'll treat targetSEM as a hard "Stop and Decide" trigger.
                this.finalizeStatus(false);
            } else {
                this.session.status = 'OPTIMIZING';
            }
        }
    }

    private finalizeStatus(timeExpired: boolean) {
        // If max items reached or time expired, pass/fail based strictly on theta vs standard
        const PASSING_STANDARD = 0.00;
        if (timeExpired) {
            this.session.status = 'TIME_EXPIRED';
        } else if (this.session.itemsAnswered >= this.session.config.maxQuestions) {
            this.session.status = 'MAX_LENGTH';
        } else {
            // Logic Fallback
            this.session.status = this.session.currentTheta >= PASSING_STANDARD ? 'PASSED' : 'FAILED';
        }
    }

    /**
     * api: Get Next Target Difficulty
     * Returns the "Level" (1-5) we should query the DB/AI for.
     */
    public getNextItemTarget(): { level: number, difficultyLabel: string } {
        const t = this.session.currentTheta;

        let targetLevel = 3;
        if (t <= -1.0) targetLevel = 1;      // Very easy
        else if (t <= -0.2) targetLevel = 2; // Easy/Moderate
        else if (t <= 0.5) targetLevel = 3;  // Hard/Moderate (Passing)
        else if (t <= 1.5) targetLevel = 4;  // Hard
        else targetLevel = 5;                // Expert

        return {
            level: targetLevel,
            difficultyLabel: this.getDifficultyLabel(targetLevel)
        };
    }

    private getDifficultyLabel(level: number): string {
        switch (level) {
            case 1: return "Fundamental";
            case 2: return "Basic";
            case 3: return "Intermediate";
            case 4: return "Advanced";
            case 5: return "Expert";
            default: return "Intermediate";
        }
    }

    /**
     * api: Get Current Session Data
     */
    public getSession(): CatSession {
        return this.session;
    }
}
