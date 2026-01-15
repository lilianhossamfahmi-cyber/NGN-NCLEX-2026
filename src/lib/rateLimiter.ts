/**
 * RATE LIMITER - Client-side request throttling
 * Prevents API quota exhaustion and 429 errors
 */

export class RateLimiter {
    private requests: number[] = [];
    private readonly maxRequests: number;
    private readonly windowMs: number;
    private readonly name: string;

    constructor(maxRequests: number, windowMs: number, name: string = 'RateLimiter') {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.name = name;
    }

    /**
     * Waits for an available slot in the rate limit window
     * Will block until a slot is available
     */
    async waitForSlot(): Promise<void> {
        const now = Date.now();

        // Remove requests outside the window
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest);

            console.log(`[${this.name}] Rate limit reached. Waiting ${(waitTime / 1000).toFixed(1)}s...`);

            await new Promise(resolve => setTimeout(resolve, waitTime + 100)); // +100ms buffer

            return this.waitForSlot(); // Recursive check
        }

        this.requests.push(now);
    }

    /**
     * Checks if a request can be made without waiting
     */
    canMakeRequest(): boolean {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        return this.requests.length < this.maxRequests;
    }

    /**
     * Gets number of remaining requests in current window
     */
    getRemainingRequests(): number {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxRequests - this.requests.length);
    }

    /**
     * Gets time until next slot is available (in milliseconds)
     */
    getTimeUntilNextSlot(): number {
        if (this.canMakeRequest()) return 0;

        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length === 0) return 0;

        const oldestRequest = this.requests[0];
        return Math.max(0, this.windowMs - (now - oldestRequest));
    }

    /**
     * Resets the rate limiter (use with caution)
     */
    reset(): void {
        this.requests = [];
        console.log(`[${this.name}] Reset`);
    }

    /**
     * Gets current status
     */
    getStatus(): {
        remaining: number;
        max: number;
        windowMs: number;
        timeUntilReset: number;
    } {
        return {
            remaining: this.getRemainingRequests(),
            max: this.maxRequests,
            windowMs: this.windowMs,
            timeUntilReset: this.getTimeUntilNextSlot()
        };
    }
}

// ===================PREDEFINED LIMITERS====================

/**
 * Gemini API Rate Limiter
 * Gemini Free Tier: 15 RPM (requests per minute)
 * Gemini Pro: 360 RPM
 */
export const geminiRateLimiter = new RateLimiter(
    10, // Conservative: 10 requests
    60000, // Per minute
    'Gemini API'
);

/**
 * General API Rate Limiter (for other services)
 */
export const generalRateLimiter = new RateLimiter(
    20,
    60000,
    'General API'
);

/**
 * Burst protection (prevents rapid succession)
 */
export const burstProtector = new RateLimiter(
    3, // Max 3 requests
    5000, // Per 5 seconds
    'Burst Protection'
);

export default RateLimiter;
