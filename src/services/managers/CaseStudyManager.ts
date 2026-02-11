import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class CaseStudyManager extends AbstractItemManager {
    typeKeys = ['case-study', 'case-study-6-screen'];

    /**
     * CASE STUDY REPAIR LOGIC
     * 1. Ensures the "screens" array exists.
     * 2. Enforces consistency: Patient demographics should match across the lifecycle (unless evolving).
     * 3. (Future) Delegates repair of individual screens to their respective managers.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Locate Screens
        // AI often puts them in 'items', 'questions', or 'screens'
        let screens = structure.screens || structure.items || structure.questions || [];

        if (!Array.isArray(screens)) {
            screens = [];
        }

        // 2. Ensure each screen works as a sub-item
        // We want to make sure they adhere to the CJMM phases if possible.
        // For now, we mainly ensure they are objects.
        screens = screens.map((screen: any, index: number) => {
            if (typeof screen === 'string') return { type: 'unknown', validationError: 'Screen was a string' };

            // Auto-tag phase if missing
            if (!screen.cjmmPhase) {
                const phases = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];
                screen.cjmmPhase = phases[index] || 'Unknown';
            }
            return screen;
        });

        // 3. Data consistency: If the Main Case has patient info, ensure screens don't contradict or miss context
        // (In a real app, screens inherit from parent, but if we have local overrides, we keep them)

        structure.screens = screens;
        item.content.structure = structure;

        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const structure = item.content?.structure || {};
        const screens = structure.screens || [];

        if (screens.length !== 6) {
            issues.push({
                severity: 'critical',
                field: 'screens',
                message: `Case Study must have exactly 6 screens. Found ${screens.length}.`
            });
        }

        // Validate each screen using the Factory? 
        // That would be ideal recursive validation.
        screens.forEach((screen: any, index: number) => {
            if (!screen.type && !screen.structure?.type) {
                issues.push({ severity: 'warning', field: `screen[${index}]`, message: `Screen ${index + 1} missing type definition.` });
            }
        });

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        // Prepare the tabbed layout or stepper
        return item;
    }

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
