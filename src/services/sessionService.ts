import { GenerationSettings, MasterQuestionItem } from '../types/master-schema';

/**
 * Session Persistence Service
 * Stores user state in sessionStorage for resilience during a session.
 */

const STORAGE_KEY = 'ngn_creator_session';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SessionState {
    genSettings: GenerationSettings;
    generatedBatch: MasterQuestionItem[];
    activeItem: MasterQuestionItem | null;
    timestamp: string;
}

export const saveSession = (
    genSettings: GenerationSettings,
    generatedBatch: MasterQuestionItem[],
    activeItem: MasterQuestionItem | null
) => {
    try {
        const state: SessionState = {
            genSettings,
            generatedBatch,
            activeItem,
            timestamp: new Date().toISOString()
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Failed to save session (quota exceeded?):", e);
    }
};

export const loadSession = (): SessionState | null => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const state = JSON.parse(raw) as SessionState;

        if (isSessionExpired(state.timestamp)) {
            clearSession();
            return null;
        }
        return state;
    } catch (e) {
        return null;
    }
};

export const clearSession = () => {
    sessionStorage.removeItem(STORAGE_KEY);
};

const isSessionExpired = (timestamp: string): boolean => {
    const savedTime = new Date(timestamp).getTime();
    return (Date.now() - savedTime) > MAX_AGE_MS;
};
