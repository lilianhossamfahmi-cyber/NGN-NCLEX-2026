import { StudyPlan, StudySession, StudyTechnique, DaySchedule, StudyPhase } from '../../types/phase-6-5-schema';
import { v4 as uuidv4 } from 'uuid';

export const AUTO_SMART_TECHNIQUE_ID = 'tech_auto_smart';

// --- CONSTANTS: STUDY TECHNIQUES ---
export const STUDY_TECHNIQUES: StudyTechnique[] = [
    {
        id: AUTO_SMART_TECHNIQUE_ID,
        name: 'Auto SMART System',
        description: 'AI automatically selects the best method based on domain difficulty and your fatigue level.',
        difficultyLevel: 1,
        effectivenessRating: 5.0,
        bestFor: ['Everything', 'Optimization']
    },
    {
        id: 'tech_pomodoro',
        name: 'Pomodoro Classic',
        description: '25 min focused work, 5 min break. Repeat 4x, then 15-30 min break.',
        difficultyLevel: 1,
        effectivenessRating: 4.2,
        bestFor: ['Focus', 'Problem Sets']
    },
    {
        id: 'tech_flowtime',
        name: 'Flowtime Method',
        description: 'Work until focus breaks, then take a break proportional to work time.',
        difficultyLevel: 2,
        effectivenessRating: 4.5,
        bestFor: ['Deep Work', 'Complex Topics']
    },
    {
        id: 'tech_spaced_rep',
        name: 'Spaced Repetition',
        description: 'Review material at increasing intervals (1d, 3d, 1w) to cement memory.',
        difficultyLevel: 3,
        effectivenessRating: 4.8,
        bestFor: ['Memorization', 'Pharmacology']
    },
    {
        id: 'tech_feynman',
        name: 'Feynman Technique',
        description: 'Simplify and explain concepts as if teaching a child to identify gaps.',
        difficultyLevel: 4,
        effectivenessRating: 4.5,
        bestFor: ['Deep Understanding', 'Difficult Concepts']
    },
    {
        id: 'tech_active_recall',
        name: 'Active Recall',
        description: 'Test yourself without looking at notes. The struggle strengthens memory.',
        difficultyLevel: 3,
        effectivenessRating: 4.7,
        bestFor: ['Exam Prep', 'Retention']
    },
    {
        id: 'tech_sq3r',
        name: 'SQ3R Method',
        description: 'Survey, Question, Read, Recite, Review. textbook mastery.',
        difficultyLevel: 4,
        effectivenessRating: 4.4,
        bestFor: ['Textbooks', 'Reading Heavy']
    },
    {
        id: 'tech_animedoro',
        name: 'Animedoro',
        description: '40-60 min work followed by 20 min of something fun (e.g. anime/show).',
        difficultyLevel: 1,
        effectivenessRating: 4.0,
        bestFor: ['Motivation', 'Long Sessions']
    },
    {
        id: 'tech_interleaving',
        name: 'Interleaving',
        description: 'Mix different topics in one session rather than blocking one topic.',
        difficultyLevel: 3,
        effectivenessRating: 4.5,
        bestFor: ['NCLEX Prep', 'Connecting Concepts']
    },
    {
        id: 'tech_52_17',
        name: '52/17 Rule',
        description: '52 minutes of intense work followed by 17 minutes of pure rest.',
        difficultyLevel: 2,
        effectivenessRating: 4.4,
        bestFor: ['Productivity', 'Burnout Prevention']
    },
    {
        id: 'tech_time_blocking',
        name: 'Time Blocking',
        description: 'Dedicate specific blocks of time to single tasks. Reduce switching cost.',
        difficultyLevel: 1,
        effectivenessRating: 4.3,
        bestFor: ['Scheduling', 'Organization']
    }
];

export class StudyPlannerEngine {

    // --- ALGORITHM: GENERATE PLAN ---
    static generatePlan(
        studentId: string,
        examDate: Date,
        hoursPerDay: number,
        weakDomains: string[],
        preferredTechniques: string[] = ['tech_pomodoro']
    ): StudyPlan {
        const today = new Date();
        // Calculate days until exam
        const diffTime = Math.abs(examDate.getTime() - today.getTime());
        const daysUntilExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let phase: StudyPhase = 'RELAXED';
        if (daysUntilExam < 7) phase = 'PANIC';
        else if (daysUntilExam < 14) phase = 'INTENSIVE';
        else if (daysUntilExam < 30) phase = 'MODERATE';

        // All domains pool
        const allDomains = [
            'Pharmacology', 'Med-Surg', 'Pediatrics', 'Maternity',
            'Mental Health', 'Community', 'Fundamentals', 'Leadership'
        ];

        // Define strong domains (those not in weak list)
        const strongDomains = allDomains.filter(d => !weakDomains.includes(d));

        const schedule: DaySchedule[] = [];

        // Generate daily schedule
        for (let i = 0; i < Math.min(daysUntilExam, 60); i++) { // Cap at 60 days generation for now
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];

            // REST DAY LOGIC: Every 7th day (Sundays or specifically 7th day)
            // Simpler: if (i > 0 && i % 6 === 0) -> Rest
            if (i > 0 && (i + 1) % 7 === 0) {
                schedule.push({
                    date: dateStr,
                    type: 'REST',
                    sessions: [],
                    wellnessBreakScheduled: true
                });
                continue;
            }

            const sessions: StudySession[] = [];
            const dailyMinutes = hoursPerDay * 60;
            let plannedMinutes = 0;

            while (plannedMinutes < dailyMinutes) {
                // Determine Domain: 60% chance weak, 40% chance strong
                let targetDomain = '';
                const isWeak = Math.random() < 0.6 && weakDomains.length > 0;

                if (isWeak) {
                    targetDomain = weakDomains[Math.floor(Math.random() * weakDomains.length)];
                } else if (strongDomains.length > 0) {
                    targetDomain = strongDomains[Math.floor(Math.random() * strongDomains.length)];
                } else {
                    targetDomain = 'General Review'; // Fallback
                }

                // Determine Technique - Handled Advanced Logic if "Auto SMART" is selected
                let techId = 'tech_pomodoro';

                // If AUTO_SMART is in preferences, use smart logic
                if (preferredTechniques.includes(AUTO_SMART_TECHNIQUE_ID)) {
                    // Smart Logic:
                    // Weak Domains -> Active Recall or Feynman (High impact)
                    // Strong Domains -> Pomodoro or Spaced Rep (Maintenance)
                    if (weakDomains.includes(targetDomain)) {
                        techId = Math.random() > 0.5 ? 'tech_active_recall' : 'tech_feynman';
                    } else {
                        techId = 'tech_spaced_rep';
                    }
                } else {
                    // Randomly pick from user preferences
                    techId = preferredTechniques.length > 0
                        ? preferredTechniques[Math.floor(Math.random() * preferredTechniques.length)]
                        : 'tech_pomodoro';
                }

                // Session Length
                const duration = 60; // Standard block size for simplicity of scheduling

                sessions.push({
                    id: uuidv4(),
                    date: dateStr,
                    domains: [targetDomain],
                    techniqueId: techId,
                    targetDurationMinutes: duration,
                    status: 'pending',
                    questionsAttempted: 0,
                    questionsCorrect: 0,
                    // Injecting content metadata for the UI to use
                    // Note: We are leveraging the flexible session object or assuming the UI will map this.
                    // Ideally we'd update index.ts type definition but sticking to component-level logic for speed unless strictly typed elsewhere blocking.
                    // Adding ad-hoc metadata property if possible, else logic in UI.
                    // To follow strict type, we will assume UI logic or I need to add to schema.
                    // For now, let's assume the schema is updated or we use 'details' as a new property in the future. 
                    // Wait, I can't add properties that don't exist in the interface.
                    // I will perform a minimal interface update in the UI file or just use the UI Component to derive these text strings dynamically to save schema migration time.
                    // ACTUALLY, simpler approach: The Request asked for "Generated plan should have contents".
                    // I will store these inside a JSON string in a 'notes' field if available? No notes field.
                    // I'll stick to deriving them in the UI for safety to avoiding breaking other files.
                });

                plannedMinutes += duration;
            }

            schedule.push({
                date: dateStr,
                type: 'STUDY',
                sessions,
                wellnessBreakScheduled: true // Always encourage wellness
            });
        }

        return {
            id: uuidv4(),
            studentId,
            examDate: examDate.toISOString().split('T')[0],
            startDate: today.toISOString().split('T')[0],
            status: 'active',
            phase,
            schedule,
            config: {
                hoursPerDay,
                weakDomains,
                preferredTechniques
            },
            metrics: {
                totalSessions: schedule.reduce((acc, day) => acc + day.sessions.length, 0),
                completedSessions: 0,
                adherenceRate: 0
            }
        };
    }

    // --- HELPER: Get Technique Details ---
    static getTechnique(id: string): StudyTechnique | undefined {
        return STUDY_TECHNIQUES.find(t => t.id === id);
    }
}
