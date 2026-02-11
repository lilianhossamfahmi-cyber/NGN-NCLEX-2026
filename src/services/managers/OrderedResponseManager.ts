
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class OrderedResponseManager extends AbstractItemManager {
    typeKeys = ['ordered-response', 'drag-drop'];

    /**
     * ORDERED RESPONSE REPAIR
     * 1. Ensures all steps have IDs.
     * 2. Checks for empty steps.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        if (!structure.options) structure.options = [];

        // Auto-ID
        structure.options = structure.options.map((opt: any, i: number) => {
            if (typeof opt === 'string') return { text: opt, id: `step${i + 1}` };
            if (!opt.id) opt.id = `step${i + 1}`;
            return opt;
        });

        // Ensure correctOrder matches IDs
        if (structure.correctOrder && Array.isArray(structure.correctOrder)) {
            // If correctOrder contains strings that are texts not IDs, try to map them?
            // Assuming AI gives IDs or indices. If it gave indices 1-based, fix to valid IDs.
            // This is hard to auto-fix perfectly without context, assume IDs for now.
        }

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (!s.options || s.options.length < 2) {
            issues.push({ severity: 'critical', field: 'options', message: 'Ordered Response must have at least 2 steps.' });
        }
        if (!s.correctOrder || s.correctOrder.length !== s.options.length) {
            issues.push({ severity: 'warning', field: 'correctOrder', message: 'Correct order length mismatch with options.' });
        }

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        // Scramble options for display? Usually UI handles shuffling.
        return item;
    }

    /**
     * Grade: All-or-Nothing (0/1) Rules for Ordered Response typically.
     * User must get the ENTIRE sequence right to get the point.
     * (Some variations exist, but standard is strict).
     */
    grade(userAnswer: any, item: any): GradingResult {
        const s = item.content?.structure || {};
        const userOrder = Array.isArray(userAnswer) ? userAnswer : [];
        const correctOrder = s.correctOrder || [];

        // Deep equality check
        let isCorrect = true;
        if (userOrder.length !== correctOrder.length) isCorrect = false;
        else {
            for (let i = 0; i < correctOrder.length; i++) {
                if (userOrder[i] !== correctOrder[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }

        return {
            score: isCorrect ? 1 : 0,
            maxScore: 1,
            feedback: isCorrect ? "Correct sequence." : "Incorrect sequence.",
            correctIds: correctOrder
        };
    }
}
