
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class DropClozeManager extends AbstractItemManager {
    typeKeys = ['drop-cloze', 'drag-cloze'];

    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        // Very similar to Cloze Dropdown but with a "Drag Source" pool
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        if (!structure.dragItems) structure.dragItems = [];

        // Auto-ID
        structure.dragItems.forEach((d: any, i: number) => {
            if (!d.id) d.id = `d${i}`;
        });

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        if (!item.content?.structure?.dragItems) {
            issues.push({ severity: 'warning', field: 'dragItems', message: 'No drag items defined.' });
        }
        return { isValid: true, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    grade(userAnswer: any, item: any): GradingResult {
        // userAnswer: { "targetId": "dragItemId" }
        let score = 0;
        let maxScore = 0;
        const s = item.content?.structure || {};
        const targets = s.targets || {}; // Map of targetId -> correctDragId

        Object.keys(targets).forEach(tid => {
            maxScore++;
            if (userAnswer[tid] === targets[tid]) score++;
        });

        return {
            score,
            maxScore,
            feedback: `Score: ${score}/${maxScore}`,
            correctIds: []
        };
    }
}
