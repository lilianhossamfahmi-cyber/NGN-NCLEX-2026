/**
 * MASTER NGN QUESTION CREATOR - API & ENV CONFIG
 * 
 * Centralized configuration for API endpoints, feature flags, and environment settings.
 * Reads from import.meta.env (Vite standard) with safe defaults.
 */

// Define environment variable types for TypeScript IntelliSense
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
}

const getEnvVar = (key: string, defaultValue: string): string => {
    // @ts-ignore - Vite specific
    return import.meta.env?.[key] || defaultValue;
};

const getBoolEnv = (key: string, defaultValue: boolean): boolean => {
    // @ts-ignore
    const val = import.meta.env?.[key];
    if (val === 'true') return true;
    if (val === 'false') return false;
    return defaultValue;
};

export const AppConfig: EnvConfig = {
    // API Configuration
    apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api/v1'),

    // Feature Flags
    features: {
        exportEnabled: getBoolEnv('VITE_FEATURE_EXPORT', true),
        duplicationCheck: getBoolEnv('VITE_FEATURE_DEDUPE', true),
        aiGeneration: getBoolEnv('VITE_FEATURE_AI', true), // Toggles mock vs real
    },

    // System Settings
    timeouts: {
        generationMs: 60000, // 60s
        checkMs: 10000,      // 10s
    },

    version: '2.0.0'
};

/**
 * Helper to build full API endpoints
 */
export const getEndpoint = (path: string): string => {
    const base = AppConfig.apiBaseUrl.replace(/\/$/, '');
    const safePath = path.replace(/^\//, '');
    return `${base}/${safePath}`;
};
