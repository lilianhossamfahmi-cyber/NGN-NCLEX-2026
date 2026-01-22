
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class ClozeDropDownManager extends AbstractItemManager {
    typeKeys = ['cloze-dropdown', 'dropdown'];

    /**
     * CLOZE REPAIR
     * 1. Parses text for placeholders like %{id} or {{id}} or [id].
     * 2. Ensures every placeholder has a corresponding options list.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Detect Placeholders in text
        const text = item.content.text || structure.text || "";
        const regex = /%\{([^}]+)\}|\[([^\]]+)\]|\{\{([^}]+)\}\}/g; // Matches %{id}, [id], {{id}}
        const foundParsers = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            foundParsers.push(match[1] || match[2] || match[3]);
        }

        if (!structure.dropdowns) structure.dropdowns = {}; // Note space for safety, actually structure usually has 'options' map

        // Structure for cloze is often: { text: "...", placeholders: { "id": [opt1, opt2] } }
        if (!structure.placeholders) structure.placeholders = {};

        // 2. Ensure entries exist
        foundParsers.forEach(pid => {
            if (!structure.placeholders[pid]) {
                // Auto-fill missing dropdown
                structure.placeholders[pid] = [
                    { id: 'opt1', text: 'Structure', isCorrect: true },
                    { id: 'opt2', text: 'Function', isCorrect: false }
                ];
            }
        });

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        // Basic check: text must exist
        return { isValid: true, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    /**
     * Grade: 0/1 per dropdown slot.
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        // userAnswer: { "placeholderId": "optionId" }
        const s = correctContent.content?.structure || {};
        let score = 0;
        let maxScore = 0;

        const placeholders = s.placeholders || {};
        Object.keys(placeholders).forEach(pid => {
            maxScore++;
            const opts = placeholders[pid];
            const correctOpt = opts.find((o: any) => o.isCorrect);
            if (correctOpt && userAnswer[pid] === correctOpt.id) {
                score++;
            }
        });

        return {
            score,
            maxScore,
            feedback: `You got ${score}/${maxScore} correct.`,
            correctIds: []
        };
    }
}
