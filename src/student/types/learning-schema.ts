/**
 * learning-schema.ts
 * Types for Adaptive Learning and Gamification
 */

// import { Attempt } from '../../types/student-schema'; // Unused for now

// === CAT ENGINE ===
export interface CatSession {
    id: string;
    studentId: string;
    startTime: number;
    currentTheta: number; // Student ability estimate (-3.0 to +3.0)
    sem: number;          // Standard Error of Measurement
    itemsAnswered: number;
    history: CatItemResult[];
    status: 'OPTIMIZING' | 'PASSED' | 'FAILED' | 'MAX_LENGTH' | 'TIME_EXPIRED';
    config: CatConfig;
}

export interface CatItemResult {
    questionId: string;
    bValue: number;
    isCorrect: boolean;
    timeTakenSeconds: number;
    thetaAfter: number;
    timestamp: number;
    domain: string;
}

export interface CatConfig {
    minQuestions: number;
    maxQuestions: number;
    targetSEM: number;
    maxTimeSeconds: number;
    startTheta: number;
    adjustmentBase: number;
}

// === PRESCRIPTION ===
export interface DailyPrescription {
    id: string;
    date: string; // YYYY-MM-DD
    type: 'weakness_target' | 'foundation_repair' | 'balanced_maintenance' | 'cat_sim';
    title: string;
    description: string;
    targetDomain?: string;
    itemCount: number;
    estimatedMinutes: number;
    expectedImprovement: string; // e.g. "+2% Probability"
    completed: boolean;
}

// === STUDY PATH ===
export interface StudyDay {
    date: string;
    dayOfWeek: string;
    activityType: 'heavy' | 'medium' | 'light' | 'rest';
    focusDomains: string[];
    targetMinutes: number;
}

export interface StudyPath {
    startDate: string;
    examDate: string;
    intensity: 'marathon' | 'training' | 'sprint' | 'peak';
    schedule: StudyDay[];
}

// === GAMIFICATION ===
export interface Badge {
    id: string;
    name: string;
    icon: string; // Emoji or Icon Name
    description: string;
    category: 'streak' | 'mastery' | 'speed' | 'dedication';
    earnedDate?: string;
}

export interface LevelConfig {
    level: number;
    minXp: number;
    title: string;
}

export interface GamificationState {
    xp: number;
    level: number;
    currentStreak: number; // Days
    badges: Badge[];
    pointsBalance: number; // Spendable points
}
