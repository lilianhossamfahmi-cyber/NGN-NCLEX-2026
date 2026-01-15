/**
 * REQUEST QUEUE - Sequential request processing with rate limiting
 * Ensures requests are processed one at a time with proper throttling
 */

import { geminiRateLimiter } from './rateLimiter';

export class RequestQueue {
    private queue: Array<{
        request: () => Promise<any>;
        resolve: (value: any) => void;
        reject: (error: any) => void;
        id: string;
        timestamp: number;
    }> = [];
    private processing = false;
    private processedCount = 0;
    private failedCount = 0;

    /**
     * Adds a request to the queue
     * Returns a promise that resolves when the request completes
     */
    async add<T>(request: () => Promise<T>, id?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                request,
                resolve,
                reject,
                id: id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now()
            });

            console.log(`[RequestQueue] Added request ${id || 'unnamed'}. Queue length: ${this.queue.length}`);

            this.process();
        });
    }

    /**
     * Processes the queue sequentially
     */
    private async process() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        console.log(`[RequestQueue] Starting queue processing. ${this.queue.length} requests pending.`);

        while (this.queue.length > 0) {
            const item = this.queue.shift()!;

            try {
                // Wait for rate limiter
                await geminiRateLimiter.waitForSlot();

                console.log(`[RequestQueue] Executing request ${item.id}...`);
                const startTime = Date.now();

                // Execute request
                const result = await item.request();

                const duration = Date.now() - startTime;
                console.log(`[RequestQueue] Request ${item.id} completed in ${duration}ms`);

                item.resolve(result);
                this.processedCount++;

            } catch (error) {
                console.error(`[RequestQueue] Request ${item.id} failed:`, error);
                item.reject(error);
                this.failedCount++;
            }

            // Small delay between requests for stability
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.processing = false;
        console.log(`[RequestQueue] Queue processing complete. Processed: ${this.processedCount}, Failed: ${this.failedCount}`);
    }

    /**
     * Gets current queue length
     */
    getQueueLength(): number {
        return this.queue.length;
    }

    /**
     * Checks if queue is processing
     */
    isProcessing(): boolean {
        return this.processing;
    }

    /**
     * Gets queue statistics
     */
    getStats(): {
        queueLength: number;
        processing: boolean;
        processed: number;
        failed: number;
    } {
        return {
            queueLength: this.queue.length,
            processing: this.processing,
            processed: this.processedCount,
            failed: this.failedCount
        };
    }

    /**
     * Clears the queue (cancels pending requests)
     */
    clear(): void {
        const count = this.queue.length;
        this.queue.forEach(item => {
            item.reject(new Error('Request cancelled - queue cleared'));
        });
        this.queue = [];
        console.log(`[RequestQueue] Cleared ${count} pending requests`);
    }

    /**
     * Resets statistics
     */
    resetStats(): void {
        this.processedCount = 0;
        this.failedCount = 0;
    }

    /**
     * Gets estimated wait time for next request
     */
    getEstimatedWaitTime(): number {
        if (this.queue.length === 0) return 0;

        // Estimate based on average processing time (assume 2s per request + rate limit)
        const avgProcessingTime = 2000;
        const rateLimitWait = geminiRateLimiter.getTimeUntilNextSlot();

        return (this.queue.length * avgProcessingTime) + rateLimitWait;
    }
}

// Singleton instance
export const requestQueue = new RequestQueue();

export default RequestQueue;
