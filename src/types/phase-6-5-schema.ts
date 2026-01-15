/**
 * PHASE 6.5: STUDY PLANNER & WELLNESS SCHEMAS
 * -------------------------------------------
 * Defines the core data structures for the Smart Study Planner
 * and Wellness System.
 */

// --- STUDY PLANNER ---

export type StudyPhase = 'RELAXED' | 'MODERATE' | 'INTENSIVE' | 'PANIC';
export type PlanStatus = 'active' | 'completed' | 'abandoned' | 'recovery_mode';
export type SessionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface StudyTechnique {
    id: string;
    name: string; // e.g., 'Pomodoro', 'Feynman'
    description: string;
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    effectivenessRating: number; // 1-5
    bestFor: string[]; // ['memorization', 'concepts']
}

export interface StudySession {
    id: string;
    date: string; // ISO Date YYYY-MM-DD
    domains: string[]; // ['Pharmacology', 'Cardio']
    techniqueId: string;
    targetDurationMinutes: number;
    actualDurationMinutes?: number;
    status: SessionStatus;
    questionsAttempted: number;
    questionsCorrect: number;
    satisfaction?: number; // 1-5
}

export interface DaySchedule {
    date: string;
    type: 'STUDY' | 'REST';
    sessions: StudySession[];
    wellnessBreakScheduled: boolean;
}

export interface StudyPlan {
    id: string;
    studentId: string;
    examDate: string;
    startDate: string;
    status: PlanStatus;
    phase: StudyPhase;
    schedule: DaySchedule[];
    config: {
        hoursPerDay: number;
        weakDomains: string[];
        preferredTechniques: string[];
    };
    metrics: {
        totalSessions: number;
        completedSessions: number;
        adherenceRate: number; // 0-100
    };
}

// --- WELLNESS SYSTEM ---

export type WellnessCategory = 'breathing' | 'meditation' | 'movement' | 'mindfulness' | 'grounding' | 'cognitive';

export interface WellnessExercise {
    id: string;
    name: string;
    category: WellnessCategory;
    durationSeconds: number;
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    effectivenessRating: number;
    instructions: string[]; // Array of steps
    benefits: string;
    whenToUse: string[];
    media?: {
        videoUrl?: string;
        audioUrl?: string;
    };
}

export interface WellnessSession {
    id: string;
    studentId: string;
    exerciseId: string;
    performedAt: string; // ISO
    durationSeconds: number;
    stressBefore: number; // 1-10
    stressAfter: number; // 1-10
    moodBefore?: string;
    userFeedback?: string;
}

export interface WellnessDashboardMetrics {
    date: string;
    stressLevelAvg: number;
    sleepHours: number;
    energyLevel: number;
    focusQuality: number;
    moodRating: number;
    exercisesCompleted: number;
}
