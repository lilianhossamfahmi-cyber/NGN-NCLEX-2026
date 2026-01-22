
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class MultipleResponseManager extends AbstractItemManager {
    typeKeys = ['multiple-response', 'multiple-response-sata', 'sata'];

    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        if (!structure.options) structure.options = [];
        // Flatten
        structure.options = structure.options.map((o: any) => {
            if (typeof o === 'string') return { text: o, isCorrect: false };
            return o;
        });

        // Ensure at least 5 options for SATA (NCSBN standard is usually 5-6)
        if (structure.options.length < 3) {
            // Too small for SATA, maybe valid for some, but suspicious
        }

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const opts = item.content?.structure?.options || [];
        const corrects = opts.filter((o: any) => o.isCorrect).length;

        if (corrects === 0) issues.push({ severity: 'critical', field: 'options', message: 'SATA must have at least 1 correct option.' });
        // NOTE: NGN allows "All correct" technically, but it's rare.

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    /**
     * NGN SATA RULE: +/- Scoring
     * +1 for correct selection
     * -1 for incorrect selection
     * Min 0
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        const userIds = Array.isArray(userAnswer) ? userAnswer : [];
        const options = correctContent.content?.structure?.options || [];
        const correctIds = options.filter((o: any) => o.isCorrect).map((o: any) => o.id || o.text);

        let score = 0;
        let maxScore = correctIds.length;

        userIds.forEach((id: string) => {
            if (correctIds.includes(id)) score++;
            else score--;
        });

        score = Math.max(0, score);

        return {
            score,
            maxScore,
            feedback: `Score: ${score} (+/- Rule applied).`,
            correctIds
        };
    }
}
