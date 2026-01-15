/**
 * MASTER NGN QUESTION CREATOR - API & ENV CONFIG
 * 
 * Centralized configuration for API endpoints, feature flags, and environment settings.
 * Includes security measures: Key Validation, Rate Limiting, and Centralized Initialization.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define environment variable types
interface EnvConfig {
    apiBaseUrl: string;
    features: {
        exportEnabled: boolean;
        duplicationCheck: boolean;
        aiGeneration: boolean;
    };
    timeouts: {
        generationMs: number;
        checkMs: number;
    };
    version: string;
    security: {
        maxRequestsPerMinute: number;
    };
}

// ------------------------------------------------------------------
// 1. SAFE ENVIRONMENT ACCESS
// ------------------------------------------------------------------

const getEnvVar = (key: string, required: boolean = false): string => {
    let val = '';

    // Check Node process.env first
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        val = process.env[key] as string;
    }
    // Check Vite import.meta.env
    else {
        try {
            // @ts-ignore
            if (import.meta && import.meta.env && import.meta.env[key]) {
                // @ts-ignore
                val = import.meta.env[key];
            }
        } catch (e) { /* ignore */ }
    }

    if (required && !val) {
        throw new Error(`CRITICAL SECURITY ERROR: Environment variable ${key} is missing. Please check your .env file.`);
    }
    return val;
};

const getBoolEnv = (key: string, defaultValue: boolean): boolean => {
    let val = '';
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        val = process.env[key] as string;
    } else {
        try {
            // @ts-ignore
            val = import.meta.env?.[key];
        } catch (e) { /* ignore */ }
    }

    if (val === 'true') return true;
    if (val === 'false') return false;
    return defaultValue;
};

// ------------------------------------------------------------------
// 2. CONFIG OBJECT
// ------------------------------------------------------------------

// Validate Key immediately on load if AI is enabled
const IS_AI_ENABLED = getBoolEnv('VITE_FEATURE_AI', true);
const RAW_API_KEY = getEnvVar('VITE_GEMINI_API_KEY', IS_AI_ENABLED);

export const AppConfig: EnvConfig = {
    // API Configuration
    apiBaseUrl: getEnvVar('VITE_API_BASE_URL') || 'http://localhost:3000/api/v1',

    // Feature Flags
    features: {
        exportEnabled: getBoolEnv('VITE_FEATURE_EXPORT', true),
        duplicationCheck: getBoolEnv('VITE_FEATURE_DEDUPE', true),
        aiGeneration: IS_AI_ENABLED,
    },

    // System Settings
    timeouts: {
        generationMs: 60000, // 60s
        checkMs: 10000,      // 10s
    },

    version: '2.1.0-security-patch',

    security: {
        maxRequestsPerMinute: 10 // Restricted rate limit
    }
};

// ------------------------------------------------------------------
// 3. RATE LIMITER IMPLEMENTATION
// ------------------------------------------------------------------

class RequestRateLimiter {
    private timestamps: number[] = [];
    private maxRequests: number;
    private windowMs: number;

    constructor(maxRequests: number, windowMs: number = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    async checkLimit(): Promise<void> {
        const now = Date.now();
        // Clear old timestamps
        this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

        if (this.timestamps.length >= this.maxRequests) {
            const oldest = this.timestamps[0];
            const waitTime = this.windowMs - (now - oldest);
            console.warn(`[Security] Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s...`);

            // Wait for the slot to free up
            await new Promise(resolve => setTimeout(resolve, waitTime));
            // Recursively check again to be safe
            return this.checkLimit();
        }

        this.timestamps.push(now);
    }
}

export const limiter = new RequestRateLimiter(AppConfig.security.maxRequestsPerMinute);

// ------------------------------------------------------------------
// 4. CENTRALIZED SERVICE INITIALIZATION
// ------------------------------------------------------------------

let genAIInstance: GoogleGenerativeAI | null = null;

export const getGenAI = (): GoogleGenerativeAI | null => {
    if (!AppConfig.features.aiGeneration) return null;

    if (!genAIInstance) {
        if (!RAW_API_KEY) {
            console.error("Attempted to initialize AI without API Key");
            return null;
        }
        genAIInstance = new GoogleGenerativeAI(RAW_API_KEY);
    }
    return genAIInstance;
};

// Helper for REST calls (e.g., HotSpotRenderer) to avoid raw key access in components
// Returns key only if authorized request is about to be made
export const getAuthorizedApiKey = async (): Promise<string> => {
    await limiter.checkLimit();
    return RAW_API_KEY;
};

// ------------------------------------------------------------------
// 5. UTILS
// ------------------------------------------------------------------

export const getEndpoint = (path: string): string => {
    const base = AppConfig.apiBaseUrl.replace(/\/$/, '');
    const safePath = path.replace(/^\//, '');
    return `${base}/${safePath}`;
};
