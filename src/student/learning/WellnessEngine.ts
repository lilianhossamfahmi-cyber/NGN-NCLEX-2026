import { WellnessExercise, WellnessSession, WellnessDashboardMetrics } from '../../types/phase-6-5-schema';
import { v4 as uuidv4 } from 'uuid';

// --- CONSTANT: WELLNESS EXERCISES LIBRARY ---
export const WELLNESS_EXERCISES: WellnessExercise[] = [
    {
        id: 'ex_box_breathing',
        name: 'Box Breathing',
        category: 'breathing',
        durationSeconds: 180, // 3 min
        difficultyLevel: 1,
        effectivenessRating: 4.6,
        instructions: [
            'Sit comfortably with your back straight.',
            'Exhale completely, emptying your lungs.',
            'Inhale through your nose for 4 seconds.',
            'Hold your breath for 4 seconds.',
            'Exhale through mouth for 4 seconds.',
            'Hold empty lungs for 4 seconds.',
            'Repeat for at least 5 rounds.'
        ],
        benefits: 'Lowers cortisol immediately. Used by Navy SEALs for focus.',
        whenToUse: ['High Anxiety', 'Panic Attack', 'Pre-Exam Jitters']
    },
    {
        id: 'ex_pmr',
        name: 'Progressive Muscle Relaxation',
        category: 'movement', // Somatic
        durationSeconds: 600, // 10 min
        difficultyLevel: 2,
        effectivenessRating: 4.3,
        instructions: [
            'Lie down or sit in a quiet place.',
            'Tense your toes hard for 5 seconds.',
            'Release instantly and feel the tension leave.',
            'Move up to calves, thighs, stomach, hands, shoulders, face.',
            'End with full body tension and release.'
        ],
        benefits: 'Releases physical stress stored in muscles. Improves sleep.',
        whenToUse: ['Physical Tension', 'Evening Wind-down', 'After Long Study']
    },
    {
        id: 'ex_visualization',
        name: 'Success Visualization',
        category: 'mindfulness',
        durationSeconds: 300, // 5 min
        difficultyLevel: 2,
        effectivenessRating: 4.4,
        instructions: [
            'Close your eyes and breathe deeply.',
            'Visualize yourself walking into the exam center calmly.',
            'See yourself answering questions with confidence.',
            'Imagine seeing the "Pass" result.',
            'Feel the relief and pride in your body.'
        ],
        benefits: 'Sports psychology technique. Mental rehearsal improves performance.',
        whenToUse: ['Low Confidence', 'Morning of Exam']
    },
    {
        id: 'ex_478_breathing',
        name: '4-7-8 Breathing',
        category: 'breathing',
        durationSeconds: 300,
        difficultyLevel: 2,
        effectivenessRating: 4.4,
        instructions: [
            'Place tongue tip behind upper front teeth.',
            'Inhale quietly through nose for 4 counts.',
            'Hold breath for 7 counts.',
            'Exhale forcefully through mouth for 8 counts.',
            'Repeat cycle 4 times.'
        ],
        benefits: 'Natural tranquilizer for the nervous system.',
        whenToUse: ['Insomnia', 'Racing Thoughts']
    },
    {
        id: 'ex_grounding',
        name: '5-4-3-2-1 Grounding',
        category: 'grounding',
        durationSeconds: 300,
        difficultyLevel: 1,
        effectivenessRating: 4.7,
        instructions: [
            'Name 5 things you can see.',
            'Name 4 things you can touch.',
            'Name 3 things you can hear.',
            'Name 2 things you can smell.',
            'Name 1 thing you can taste.'
        ],
        benefits: 'Stops dissociation and panic attacks instantly.',
        whenToUse: ['Panic Attack', 'Overwhelm']
    },
    {
        id: 'ex_nature_walk',
        name: 'Nature Walk (Audio Guide)',
        category: 'movement',
        durationSeconds: 900, // 15 min
        difficultyLevel: 1,
        effectivenessRating: 4.6,
        instructions: [
            'Leave your phone (or set to DND).',
            'Go outside.',
            'Walk slowly, focusing on your senses.',
            'Look at the sky, trees, and textures.',
            'Breathe the fresh air deeply.'
        ],
        benefits: 'Nature exposure lowers cortisol significantly.',
        whenToUse: ['Burnout', 'Mental Fatigue']
    },
    {
        id: 'ex_cold_splash',
        name: 'Cold Water Reset',
        category: 'grounding', // Somatic
        durationSeconds: 60,
        difficultyLevel: 1,
        effectivenessRating: 4.1,
        instructions: [
            'Fill a bowl or sink with ice cold water.',
            'Splash face vigorously or submerge for 10 seconds.',
            'Pat dry and breathe deeply.'
        ],
        benefits: 'Triggers Mammalian Dive Reflex which slows heart rate.',
        whenToUse: ['Panic', 'Sleepiness']
    },
    {
        id: 'ex_gratitude',
        name: 'Gratitude Journal',
        category: 'cognitive',
        durationSeconds: 300,
        difficultyLevel: 1,
        effectivenessRating: 4.3,
        instructions: [
            'Write down 3 things you are grateful for right now.',
            'Write 1 thing you accomplished today.',
            'Write 1 positive intention for tomorrow.'
        ],
        benefits: 'Shifts brain from threat-scanning to abundance mindset.',
        whenToUse: ['Negative Mood', 'Evening Reflection']
    }
];

export class WellnessEngine {

    // --- SMART RECOMMENDATION LOGIC ---
    static getRecommendation(
        currentStress: number, // 1-10
        sessionDurationMinutes: number,
        quizScore?: number
    ): { exercise: WellnessExercise | null, reason: string } {

        // RULE 1: High Stress
        if (currentStress >= 7) {
            return {
                exercise: WELLNESS_EXERCISES.find(e => e.id === 'ex_box_breathing') || null,
                reason: "Your stress levels are high. Let's lower cortisol immediately."
            };
        }

        // RULE 2: Panic / Extreme Stress
        if (currentStress >= 9) {
            return {
                exercise: WELLNESS_EXERCISES.find(e => e.id === 'ex_grounding') || null,
                reason: "You seem overwhelmed. Ground yourself in the present moment."
            };
        }

        // RULE 3: Long Study Session (Risk of Burnout)
        if (sessionDurationMinutes > 120) {
            return {
                exercise: WELLNESS_EXERCISES.find(e => e.id === 'ex_nature_walk') || null,
                reason: "You've been working hard for over 2 hours. A nature break will boost focus."
            };
        }

        // RULE 4: Low Quiz Score (Confidence Hit)
        if (quizScore !== undefined && quizScore < 50) {
            return {
                exercise: WELLNESS_EXERCISES.find(e => e.id === 'ex_visualization') || null,
                reason: "Rough quiz? That happens. Let's visualize your future success to reset."
            };
        }

        // Default: Maintenance
        if (Math.random() > 0.7) {
            return {
                exercise: WELLNESS_EXERCISES.find(e => e.id === 'ex_gratitude') || null,
                reason: "Take a moment to reflect on your progress today."
            };
        }

        return { exercise: null, reason: '' };
    }

    // --- MOCK DATA: DASHBOARD METRICS ---
    static getMockDashboardMetrics(): WellnessDashboardMetrics {
        return {
            date: new Date().toISOString().split('T')[0],
            stressLevelAvg: 4.2,
            sleepHours: 6.5,
            energyLevel: 7,
            focusQuality: 8,
            moodRating: 6,
            exercisesCompleted: 3
        };
    }
}
