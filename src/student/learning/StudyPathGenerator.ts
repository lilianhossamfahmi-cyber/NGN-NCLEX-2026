/**
 * StudyPathGenerator.ts
 * Generates dynamic weekly study plans based on exam date + intensity
 */

import { StudyPath, StudyDay } from '../types/learning-schema';

export class StudyPathGenerator {

    static generateStudyPath(examDate: Date, weakestDomains: string[]): StudyPath {
        const today = new Date();
        const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let intensity: 'marathon' | 'training' | 'sprint' | 'peak' = 'marathon';
        let dailyMinutesStandard = 30;

        // Determine Intensity
        if (daysUntil < 14) {
            intensity = 'peak';
            dailyMinutesStandard = 240; // 4 hours
        } else if (daysUntil < 30) {
            intensity = 'sprint';
            dailyMinutesStandard = 120; // 2 hours
        } else if (daysUntil < 60) {
            intensity = 'training';
            dailyMinutesStandard = 60; // 1 hour
        }

        const schedule: StudyDay[] = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Generate next 7 days
        for (let i = 0; i < 7; i++) {
            const current = new Date(today);
            current.setDate(today.getDate() + i);
            const dayName = days[current.getDay()];

            let type: 'heavy' | 'medium' | 'light' | 'rest' = 'medium';
            let mins = dailyMinutesStandard;

            // Simple logic: Rest on Sunday, Light on Friday, Heavy on Mon/Tue
            if (dayName === 'Sun') {
                type = 'rest';
                mins = 0;
            } else if (dayName === 'Fri') {
                type = 'light';
                mins = Math.floor(dailyMinutesStandard * 0.5);
            } else if (dayName === 'Mon' || dayName === 'Tue') {
                type = 'heavy';
                mins = Math.floor(dailyMinutesStandard * 1.5);
            }

            // Focus on weak domains for Heavy days
            const focus = (type === 'heavy' || type === 'medium')
                ? weakestDomains.slice(0, 2)
                : ['General Review'];

            schedule.push({
                date: current.toISOString().split('T')[0],
                dayOfWeek: dayName,
                activityType: type,
                focusDomains: focus,
                targetMinutes: mins
            });
        }

        return {
            startDate: today.toISOString(),
            examDate: examDate.toISOString(),
            intensity,
            schedule
        };
    }
}
