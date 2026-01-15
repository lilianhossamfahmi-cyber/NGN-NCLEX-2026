/**
 * GamificationService.ts
 * Manages XP, Badges, and Streaks
 */

import { GamificationState, Badge } from '../types/learning-schema';

export class GamificationService {

    static calculateLevel(xp: number): number {
        // Level Formula: Level = sqrt(XP / 100)
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    static checkBadges(state: GamificationState, _sessionStats: any): Badge[] {
        const newBadges: Badge[] = [];

        // streak badges
        if (state.currentStreak === 3 && !this.hasBadge(state, 'streak_3')) {
            newBadges.push({ id: 'streak_3', name: 'Heating Up', icon: '🔥', description: '3 Day Streak', category: 'streak' });
        }
        if (state.currentStreak === 7 && !this.hasBadge(state, 'streak_7')) {
            newBadges.push({ id: 'streak_7', name: 'On Fire', icon: '🔥🔥', description: '7 Day Streak', category: 'streak' });
        }

        return newBadges;
    }

    private static hasBadge(state: GamificationState, badgeId: string): boolean {
        return state.badges.some(b => b.id === badgeId);
    }
}
