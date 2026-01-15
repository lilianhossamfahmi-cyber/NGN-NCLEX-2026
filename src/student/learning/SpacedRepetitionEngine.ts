/**
 * SpacedRepetitionEngine.ts
 * 
 * Implements the SuperMemo-2 (SM-2) Algorithm for Long-Term Retention.
 * Adapted for NCLEX Medical Knowledge.
 */

export interface SRSItemState {
    itemId: string;
    nextReviewDate: number; // Unix Timestamp
    intervalDays: number;   // Current gap
    easinessFactor: number; // SM-2 EF (start 2.5)
    repetitionCount: number;
    retentionStrength: number; // 0-100%
    history: SRSHistoryEntry[];
}

export interface SRSHistoryEntry {
    date: number;
    confidence: 1 | 2 | 3 | 4 | 5;
    intervalBefore: number;
    intervalAfter: number;
}

export class SpacedRepetitionEngine {

    // Default initial state for a new item
    static getInitialState(itemId: string): SRSItemState {
        return {
            itemId,
            nextReviewDate: Date.now(), // Due immediately
            intervalDays: 0,
            easinessFactor: 2.5,
            repetitionCount: 0,
            retentionStrength: 0,
            history: []
        };
    }

    /**
     * PROCESS RATING (The Core SM-2 Algorithm)
     * @param currentState Current SRS state of the item
     * @param confidence 1 (Blank) to 5 (Easy)
     */
    static processReview(currentState: SRSItemState, confidence: 1 | 2 | 3 | 4 | 5): SRSItemState {
        let { nextReviewDate, intervalDays, easinessFactor, repetitionCount, retentionStrength, history } = currentState;
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        // 1. Calculate New Interval
        let newInterval = 0;

        if (confidence >= 3) {
            // Success (Correct / Passed)
            if (repetitionCount === 0) {
                newInterval = 1;
            } else if (repetitionCount === 1) {
                newInterval = 6;
            } else {
                newInterval = Math.round(intervalDays * easinessFactor);
            }
            repetitionCount++;
        } else {
            // Fail (Forgot / Incorrect)
            newInterval = 1; // Reset to tomorrow
            repetitionCount = 0; // Reset rep count (strict mode)
        }

        // 2. Adjust Easiness Factor (EF)
        // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        // q = confidence (0-5 scale in SM-2, we use 1-5, so map nicely or use formula as is)
        // Formula expects 0-5. We have 1-5. 
        // 5=Perfect, 4=Good, 3=Pass, 2=Fail, 1=Blackout.
        // Let's use standard SM-2 formula:
        // EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

        const q = confidence;
        let newEF = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (newEF < 1.3) newEF = 1.3; // Floor at 1.3

        // 3. Update Retention Strength (0-100%) - Visual Metric
        // Rough heuristic based on stability
        if (confidence >= 4) {
            retentionStrength = Math.min(100, retentionStrength + 30);
        } else if (confidence === 3) {
            retentionStrength = Math.min(100, retentionStrength + 10);
        } else {
            retentionStrength = Math.max(0, retentionStrength - 50); // Hard penalty for forgetting
        }

        // 4. Set Next Date
        // Cap interval at 365 days
        if (newInterval > 365) newInterval = 365;

        const newNextDate = now + (newInterval * ONE_DAY_MS);

        // 5. Build New State
        const newState: SRSItemState = {
            itemId: currentState.itemId,
            nextReviewDate: newNextDate,
            intervalDays: newInterval,
            easinessFactor: newEF,
            repetitionCount,
            retentionStrength,
            history: [
                ...history,
                {
                    date: now,
                    confidence,
                    intervalBefore: intervalDays,
                    intervalAfter: newInterval
                }
            ]
        };

        return newState;
    }

    /**
     * Get Daily Prescription
     * Returns list of item IDs due for review today or overdue.
     */
    static getDailyPrescription(allItems: SRSItemState[], limit: number = 20): SRSItemState[] {
        const now = Date.now();

        // Filter Due Items
        // Due if nextReviewDate <= now
        const dueItems = allItems.filter(item => item.nextReviewDate <= now);

        // Sort by Priority:
        // 1. Overdue amount (longest overdue first)
        // 2. Low retention strength (weakest knowledge)

        dueItems.sort((a, b) => {
            // primary: compare overdue delta (smaller timestamp = older/more overdue)
            if (a.nextReviewDate !== b.nextReviewDate) return a.nextReviewDate - b.nextReviewDate;
            // secondary: retention strength
            return a.retentionStrength - b.retentionStrength;
        });

        return dueItems.slice(0, limit);
    }

    /**
     * Analytics: Forecast Reviews
     */
    static getReviewForecast(items: SRSItemState[]): { date: string, count: number }[] {
        const forecast: Record<string, number> = {};
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const now = Date.now();

        // Look ahead 30 days
        for (let i = 0; i < 30; i++) {
            const d = new Date(now + (i * ONE_DAY)).toISOString().split('T')[0];
            forecast[d] = 0;
        }

        items.forEach(item => {
            const d = new Date(item.nextReviewDate).toISOString().split('T')[0];
            if (forecast[d] !== undefined) {
                forecast[d]++;
            } else if (item.nextReviewDate < now) {
                // If overdue, add to "Today"
                const today = new Date(now).toISOString().split('T')[0];
                forecast[today] = (forecast[today] || 0) + 1;
            }
        });

        return Object.entries(forecast)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
}
