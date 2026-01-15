/**
 * QUOTA TRACKER - Monitors API usage and enforces daily limits
 * Persists data to localStorage with daily reset
 */

export interface QuotaUsage {
    date: string;
    requests: number;
    tokensUsed: number;
    cost: number;
    errors: number;
    lastReset: string;
}

export interface QuotaLimits {
    maxDailyRequests: number;
    maxDailyCost: number;
    maxDailyTokens: number;
}

export class QuotaTracker {
    private storageKey = 'nclex_quota_usage';
    private limits: QuotaLimits;

    constructor(limits?: Partial<QuotaLimits>) {
        this.limits = {
            maxDailyRequests: limits?.maxDailyRequests || 1000,
            maxDailyCost: limits?.maxDailyCost || 10, // $10/day
            maxDailyTokens: limits?.maxDailyTokens || 10000000 // 10M tokens
        };
    }

    /**
     * Gets current usage stats
     */
    getUsage(): QuotaUsage {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return this.createEmptyUsage();

            const usage: QuotaUsage = JSON.parse(stored);

            // Reset if new day
            if (usage.date !== this.getCurrentDate()) {
                console.log('[QuotaTracker] New day detected. Resetting quota.');
                return this.createEmptyUsage();
            }

            return usage;
        } catch (error) {
            console.error('[QuotaTracker] Error reading usage:', error);
            return this.createEmptyUsage();
        }
    }

    /**
     * Records a successful API request
     */
    recordRequest(tokensUsed: number = 0): void {
        const usage = this.getUsage();
        usage.requests += 1;
        usage.tokensUsed += tokensUsed;
        usage.cost += this.calculateCost(tokensUsed);

        this.saveUsage(usage);

        console.log(`[QuotaTracker] Recorded request. Total: ${usage.requests}/${this.limits.maxDailyRequests}`);
    }

    /**
     * Records an API error
     */
    recordError(): void {
        const usage = this.getUsage();
        usage.errors += 1;
        this.saveUsage(usage);
    }

    /**
     * Gets remaining quota
     */
    getRemainingQuota(): {
        requests: number;
        cost: number;
        tokens: number;
        percentage: number;
    } {
        const usage = this.getUsage();

        const remainingRequests = Math.max(0, this.limits.maxDailyRequests - usage.requests);
        const remainingCost = Math.max(0, this.limits.maxDailyCost - usage.cost);
        const remainingTokens = Math.max(0, this.limits.maxDailyTokens - usage.tokensUsed);

        const percentage = Math.round((usage.requests / this.limits.maxDailyRequests) * 100);

        return {
            requests: remainingRequests,
            cost: remainingCost,
            tokens: remainingTokens,
            percentage
        };
    }

    /**
     * Checks if quota is exceeded
     */
    isQuotaExceeded(): {
        exceeded: boolean;
        reason?: string;
    } {
        const usage = this.getUsage();

        if (usage.requests >= this.limits.maxDailyRequests) {
            return {
                exceeded: true,
                reason: `Daily request limit exceeded (${usage.requests}/${this.limits.maxDailyRequests})`
            };
        }

        if (usage.cost >= this.limits.maxDailyCost) {
            return {
                exceeded: true,
                reason: `Daily cost limit exceeded ($${usage.cost.toFixed(2)}/$${this.limits.maxDailyCost})`
            };
        }

        if (usage.tokensUsed >= this.limits.maxDailyTokens) {
            return {
                exceeded: true,
                reason: `Daily token limit exceeded (${usage.tokensUsed}/${this.limits.maxDailyTokens})`
            };
        }

        return { exceeded: false };
    }

    /**
     * Checks if approaching quota limit
     */
    isApproachingLimit(threshold: number = 0.8): {
        approaching: boolean;
        metric?: string;
        percentage?: number;
    } {
        const usage = this.getUsage();

        const requestPercentage = usage.requests / this.limits.maxDailyRequests;
        const costPercentage = usage.cost / this.limits.maxDailyCost;
        const tokenPercentage = usage.tokensUsed / this.limits.maxDailyTokens;

        if (requestPercentage >= threshold) {
            return {
                approaching: true,
                metric: 'requests',
                percentage: Math.round(requestPercentage * 100)
            };
        }

        if (costPercentage >= threshold) {
            return {
                approaching: true,
                metric: 'cost',
                percentage: Math.round(costPercentage * 100)
            };
        }

        if (tokenPercentage >= threshold) {
            return {
                approaching: true,
                metric: 'tokens',
                percentage: Math.round(tokenPercentage * 100)
            };
        }

        return { approaching: false };
    }

    /**
     * Calculates estimated cost based on tokens
     * Gemini Pricing (as of 2024):
     * - Input: $0.075 per 1M tokens
     * - Output: $0.30 per 1M tokens
     * Using average of $0.15 per 1M tokens
     */
    private calculateCost(tokens: number): number {
        const costPerMillionTokens = 0.15;
        return (tokens / 1000000) * costPerMillionTokens;
    }

    /**
     * Estimates tokens from text
     * Rough estimate: ~4 characters per token
     */
    estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }

    /**
     * Gets current date string
     */
    private getCurrentDate(): string {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }

    /**
     * Creates empty usage object
     */
    private createEmptyUsage(): QuotaUsage {
        const usage: QuotaUsage = {
            date: this.getCurrentDate(),
            requests: 0,
            tokensUsed: 0,
            cost: 0,
            errors: 0,
            lastReset: new Date().toISOString()
        };

        this.saveUsage(usage);
        return usage;
    }

    /**
     * Saves usage to localStorage
     */
    private saveUsage(usage: QuotaUsage): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(usage));
        } catch (error) {
            console.error('[QuotaTracker] Error saving usage:', error);
        }
    }

    /**
     * Manually resets quota (for testing/admin)
     */
    reset(): void {
        this.createEmptyUsage();
        console.log('[QuotaTracker] Quota manually reset');
    }

    /**
     * Updates quota limits
     */
    updateLimits(newLimits: Partial<QuotaLimits>): void {
        this.limits = { ...this.limits, ...newLimits };
        console.log('[QuotaTracker] Limits updated:', this.limits);
    }

    /**
     * Gets detailed report
     */
    getDetailedReport(): {
        usage: QuotaUsage;
        limits: QuotaLimits;
        remaining: { requests: number; cost: number; tokens: number; percentage: number };
        status: 'healthy' | 'warning' | 'exceeded';
    } {
        const usage = this.getUsage();
        const remaining = this.getRemainingQuota();
        const exceeded = this.isQuotaExceeded();
        const approaching = this.isApproachingLimit();

        let status: 'healthy' | 'warning' | 'exceeded' = 'healthy';
        if (exceeded.exceeded) {
            status = 'exceeded';
        } else if (approaching.approaching) {
            status = 'warning';
        }

        return {
            usage,
            limits: this.limits,
            remaining,
            status
        };
    }
}

// Singleton instance with default limits
export const quotaTracker = new QuotaTracker();

export default QuotaTracker;
