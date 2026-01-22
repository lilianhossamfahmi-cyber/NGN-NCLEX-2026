
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class HighlightManager extends AbstractItemManager {
    typeKeys = ['highlight', 'highlight-text'];

    /**
     * HIGHLIGHT REPAIR LOGIC
     * 1. Re-tokenizes the text to ensure EVERY span has a unique, valid ID.
     * 2. Remaps the answer key ("correctIds") to these new valid IDs.
     * 3. Prevents "Ghost Keys" (Answers pointing to non-existent text).
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};
        const text = structure.text || item.content.text || "No text provided.";

        // If simple string, tokenize it automatically
        if (typeof text === 'string' && (!structure.tokens || structure.tokens.length === 0)) {
            structure.tokens = this.tokenizeText(text);
        }

        // Ensure tokens have IDs
        structure.tokens = structure.tokens?.map((t: any, i: number) => ({
            ...t,
            id: t.id || `h${i}`
        })) || [];

        // Validate Answer Key (Remove Ghosts)
        const validIds = new Set(structure.tokens.map((t: any) => t.id));
        if (structure.correctIds) {
            structure.correctIds = structure.correctIds.filter((id: string) => validIds.has(id));
        } else {
            structure.correctIds = [];
        }

        item.content.structure = structure;
        return item;
    }

    /**
     * Splits text into selectable tokens (sentences or phrases).
     * Simple heuristic: Split by logic breaks or periods.
     */
    private tokenizeText(fullText: string): any[] {
        // Regex to split by sentences but keep delimiters
        const sentences = fullText.match(/[^\.!\?]+[\.!\?]+/g) || [fullText];

        return sentences.map((s, i) => ({
            id: `h${i}`,
            text: s.trim(),
            isHighlightable: true // Default everything to clickable
        }));
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (!s.tokens || s.tokens.length === 0) {
            issues.push({ severity: 'critical', field: 'tokens', message: 'No text tokens found for highlighting.' });
        }

        const validIds = new Set(s.tokens?.map((t: any) => t.id) || []);
        const ghostKeys = s.correctIds?.filter((id: string) => !validIds.has(id)) || [];

        if (ghostKeys.length > 0) {
            issues.push({ severity: 'critical', field: 'correctIds', message: `Found ${ghostKeys.length} Ghost Keys (IDs not in text)` });
        }

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item; // Structure is already React-ready (Array of tokens)
    }

    /**
     * NGN SCORING RULE: +/- Scoring (Plus/Minus)
     * - Correct Selection: +1
     * - Incorrect Selection: -1
     * - Missed Correct: 0
     * - Min Score: 0 (No negative totals)
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        // userAnswer: string[] (List of selected IDs)
        const userIds = Array.isArray(userAnswer) ? userAnswer : [];
        const correctIds = correctContent.content?.structure?.correctIds || [];

        let score = 0;
        const maxScore = correctIds.length; // Max points is number of correct items found

        let feedback = [];

        userIds.forEach((id: string) => {
            if (correctIds.includes(id)) {
                score++; // +1 for Correct
            } else {
                score--; // -1 for Incorrect (Adverse selection)
                feedback.push("Incorrect selection (penalty applied).");
            }
        });

        // Floor at 0
        score = Math.max(0, score);

        return {
            score,
            maxScore,
            feedback: `You scored ${score} (Plus/Minus Rule). ${feedback.length > 0 ? 'Be careful not to over-select.' : 'Perfect precision.'}`,
            correctIds
        };
    }
}
