
import { GradingResult } from '../services/managers/ItemManager';

export class CaseStudyLogic {
    grade(userAnswer: any, item: any): GradingResult {
        let totalScore = 0;
        let totalMax = 0;
        let feedbackParts: string[] = [];

        // --- GREEDY SEARCH (Matches Renderer Logic) ---
        const screens = item.screens ||
            item.structure?.screens ||
            item.content?.structure?.screens ||
            [];

        // Iterate through each screen to score
        screens.forEach((_screen: any, index: number) => {
            const screenAns = userAnswer ? userAnswer[index] : null;

            // BASE LOGIC: 1 Point per Screen if answered
            const isAnswered = screenAns !== null && screenAns !== undefined && screenAns !== '' && (Array.isArray(screenAns) ? screenAns.length > 0 : true);
            const score = isAnswered ? 1 : 0;

            totalScore += score;
            totalMax += 1;

            feedbackParts.push(`Screen ${index + 1}: ${score === 1 ? 'Answered (+1)' : 'No Answer (0)'}`);
        });

        if (totalMax === 0) totalMax = 6;

        return {
            score: totalScore,
            maxScore: totalMax,
            feedback: `Case Study Results:\n${feedbackParts.join('\n')}`,
            correctIds: []
        };
    }
}
