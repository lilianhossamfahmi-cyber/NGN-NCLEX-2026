import RateLimiter from './rateLimiter';
import RequestQueue from './requestQueue';
import QuotaTracker from './quotaTracker';

describe('Rate Limiter', () => {
    let limiter: RateLimiter;

    beforeEach(() => {
        limiter = new RateLimiter(5, 1000, 'Test'); // 5 requests per second
    });

    test('Should allow requests within limit', async () => {
        for (let i = 0; i < 5; i++) {
            await limiter.waitForSlot();
        }

        expect(limiter.getRemainingRequests()).toBe(0);
    });

    test('Should block requests exceeding limit', async () => {
        for (let i = 0; i < 5; i++) {
            await limiter.waitForSlot();
        }

        const canMake = limiter.canMakeRequest();
        expect(canMake).toBe(false);
    });

    test('Should calculate remaining requests correctly', () => {
        limiter.waitForSlot();
        limiter.waitForSlot();

        expect(limiter.getRemainingRequests()).toBe(3);
    });

    test('Should reset after window expires', async () => {
        for (let i = 0; i < 5; i++) {
            await limiter.waitForSlot();
        }

        // Wait for window to expire
        await new Promise(resolve => setTimeout(resolve, 1100));

        expect(limiter.canMakeRequest()).toBe(true);
    });

    test('Should provide status information', () => {
        const status = limiter.getStatus();

        expect(status).toHaveProperty('remaining');
        expect(status).toHaveProperty('max');
        expect(status).toHaveProperty('windowMs');
        expect(status).toHaveProperty('timeUntilReset');
    });

    test('Should reset manually', () => {
        limiter.waitForSlot();
        limiter.waitForSlot();
        limiter.reset();

        expect(limiter.getRemainingRequests()).toBe(5);
    });
});

describe('Request Queue', () => {
    let queue: RequestQueue;

    beforeEach(() => {
        queue = new RequestQueue();
        queue.resetStats();
    });

    afterEach(() => {
        queue.clear();
    });

    test('Should process requests sequentially', async () => {
        const results: number[] = [];

        const request1 = () => new Promise<number>(resolve => {
            setTimeout(() => {
                results.push(1);
                resolve(1);
            }, 100);
        });

        const request2 = () => new Promise<number>(resolve => {
            setTimeout(() => {
                results.push(2);
                resolve(2);
            }, 50);
        });

        queue.add(request1);
        queue.add(request2);

        await new Promise(resolve => setTimeout(resolve, 300));

        expect(results).toEqual([1, 2]); // Sequential, not parallel
    });

    test('Should track queue length', () => {
        const mockRequest = () => Promise.resolve('done');

        queue.add(mockRequest);
        queue.add(mockRequest);

        expect(queue.getQueueLength()).toBeGreaterThan(0);
    });

    test('Should handle request errors gracefully', async () => {
        const failingRequest = () => Promise.reject(new Error('Test error'));

        await expect(queue.add(failingRequest)).rejects.toThrow('Test error');

        const stats = queue.getStats();
        expect(stats.failed).toBeGreaterThan(0);
    });

    test('Should provide statistics', () => {
        const stats = queue.getStats();

        expect(stats).toHaveProperty('queueLength');
        expect(stats).toHaveProperty('processing');
        expect(stats).toHaveProperty('processed');
        expect(stats).toHaveProperty('failed');
    });

    test('Should clear pending requests', () => {
        const mockRequest = () => new Promise(resolve => setTimeout(resolve, 1000));

        queue.add(mockRequest);
        queue.add(mockRequest);

        const lengthBefore = queue.getQueueLength();
        queue.clear();

        expect(lengthBefore).toBeGreaterThan(0);
        expect(queue.getQueueLength()).toBe(0);
    });
});

describe('Quota Tracker', () => {
    let tracker: QuotaTracker;

    beforeEach(() => {
        tracker = new QuotaTracker({
            maxDailyRequests: 100,
            maxDailyCost: 1,
            maxDailyTokens: 100000
        });
        tracker.reset();
    });

    test('Should record requests correctly', () => {
        tracker.recordRequest(1000);

        const usage = tracker.getUsage();
        expect(usage.requests).toBe(1);
        expect(usage.tokensUsed).toBe(1000);
    });

    test('Should calculate remaining quota', () => {
        tracker.recordRequest(500);

        const remaining = tracker.getRemainingQuota();
        expect(remaining.requests).toBe(99);
        expect(remaining.tokens).toBe(99500);
    });

    test('Should detect quota exceeded', () => {
        for (let i = 0; i < 101; i++) {
            tracker.recordRequest(100);
        }

        const result = tracker.isQuotaExceeded();
        expect(result.exceeded).toBe(true);
        expect(result.reason).toBeDefined();
    });

    test('Should detect approaching limit', () => {
        for (let i = 0; i < 85; i++) {
            tracker.recordRequest(100);
        }

        const result = tracker.isApproachingLimit(0.8);
        expect(result.approaching).toBe(true);
    });

    test('Should calculate cost correctly', () => {
        tracker.recordRequest(1000000); // 1M tokens

        const usage = tracker.getUsage();
        expect(usage.cost).toBeCloseTo(0.15, 2);
    });

    test('Should reset daily', () => {
        tracker.recordRequest(1000);
        tracker.reset();

        const usage = tracker.getUsage();
        expect(usage.requests).toBe(0);
    });

    test('Should provide detailed report', () => {
        tracker.recordRequest(500);

        const report = tracker.getDetailedReport();

        expect(report).toHaveProperty('usage');
        expect(report).toHaveProperty('limits');
        expect(report).toHaveProperty('remaining');
        expect(report).toHaveProperty('status');
        expect(['healthy', 'warning', 'exceeded']).toContain(report.status);
    });

    test('Should estimate tokens from text', () => {
        const text = 'Hello world this is a test';
        const estimated = tracker.estimateTokens(text);

        expect(estimated).toBeGreaterThan(0);
        expect(estimated).toBeCloseTo(text.length / 4, 0);
    });

    test('Should update limits dynamically', () => {
        tracker.updateLimits({ maxDailyRequests: 200 });

        const report = tracker.getDetailedReport();
        expect(report.limits.maxDailyRequests).toBe(200);
    });

    test('Should persist usage to localStorage', () => {
        tracker.recordRequest(1000);

        // Create new instance to verify persistence
        const newTracker = new QuotaTracker({
            maxDailyRequests: 100,
            maxDailyCost: 1,
            maxDailyTokens: 100000
        });

        const usage = newTracker.getUsage();
        expect(usage.requests).toBeGreaterThan(0);
    });
});

describe('Integration Tests', () => {
    test('Rate limiter and request queue should work together', async () => {
        const testLimiter = new RateLimiter(2, 1000, 'Integration Test');
        const testQueue = new RequestQueue();

        let executionOrder: number[] = [];

        const createRequest = (id: number) => async () => {
            await testLimiter.waitForSlot();
            executionOrder.push(id);
            return id;
        };

        // Add 3 requests (exceeds limit of 2)
        testQueue.add(createRequest(1));
        testQueue.add(createRequest(2));
        testQueue.add(createRequest(3));

        await new Promise(resolve => setTimeout(resolve, 2500));

        expect(executionOrder).toEqual([1, 2, 3]);
    });

    test('Quota tracker should prevent execution when exceeded', () => {
        const tracker = new QuotaTracker({ maxDailyRequests: 2 });
        tracker.reset();

        tracker.recordRequest(100);
        tracker.recordRequest(100);
        tracker.recordRequest(100); // Exceeds limit

        const exceeded = tracker.isQuotaExceeded();
        expect(exceeded.exceeded).toBe(true);

        // In real implementation, would prevent generateQuestions from running
    });
});
