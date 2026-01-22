
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class BowTieManager extends AbstractItemManager {
    typeKeys = ['bow-tie', 'bowtie', 'bowtie-standalone'];

    /**
     * BOWTIE REPAIR LOGIC
     * 1. Flattens nested 'pool' structures.
     * 2. Ensures minimum distractor counts (at least 1 correct + 2 distractors per category ideally).
     * 3. Fixes missing ID fields.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Ensure Categories Exist
        if (!structure.actions) structure.actions = [];
        if (!structure.conditions) structure.conditions = [];
        if (!structure.parameters) structure.parameters = [];

        // 2. Flatten and Normalize Arrays
        // Sometimes AI makes nested "pool" objects or mixes strings/objects
        structure.actions = this.normalizeOptionArray(structure.actions);
        structure.conditions = this.normalizeOptionArray(structure.conditions);
        structure.parameters = this.normalizeOptionArray(structure.parameters);

        // 3. Auto-Generate IDs if missing
        [structure.actions, structure.conditions, structure.parameters].forEach((arr, idx) => {
            const prefix = ['a', 'c', 'p'][idx];
            arr.forEach((opt: any, i: number) => {
                if (!opt.id) opt.id = `${prefix}${i + 1}`;
            });
        });

        // 4. Update item structure
        item.content.structure = structure;

        // 5. If "Correct" flags are missing but we have a text-based answer key in metadata/rationale,
        // we might attempt to infer. For now, we assume simple JSON repair.

        return item;
    }

    private normalizeOptionArray(input: any): any[] {
        if (!input) return [];
        let arr = Array.isArray(input) ? input : (input.pool || input.options || []);

        // Flatten simple strings to objects
        return arr.map((opt: any) => {
            if (typeof opt === 'string') return { text: opt, isCorrect: false, id: '' };
            return opt;
        });
    }

    /**
     * VALIDATION
     * Needs: 
     * - Actions: At least 2 correct
     * - Conditions: Exactly 1 correct
     * - Parameters: At least 2 correct
     */
    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        const countCorrect = (arr: any[]) => arr?.filter((i: any) => i.isCorrect).length || 0;

        const actionCorrect = countCorrect(s.actions);
        const conditionCorrect = countCorrect(s.conditions);
        const paramCorrect = countCorrect(s.parameters);

        if (actionCorrect !== 2) {
            issues.push({ severity: 'warning', field: 'actions', message: `BowTie requires exactly 2 Correct Actions (Found ${actionCorrect})` });
        }
        if (conditionCorrect !== 1) {
            issues.push({ severity: 'critical', field: 'conditions', message: `BowTie requires exactly 1 Correct Condition (Found ${conditionCorrect})` });
        }
        if (paramCorrect !== 2) {
            issues.push({ severity: 'warning', field: 'parameters', message: `BowTie requires exactly 2 Correct Parameters (Found ${paramCorrect})` });
        }

        // Pool Size Checks
        if ((s.actions?.length || 0) < 4) issues.push({ severity: 'info', field: 'actions', message: 'Action pool is small (<4 distractors)' });

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        const structure = item.content?.structure || {};
        return {
            ...item,
            // UI specific formatting if needed (e.g. shuffling)
            content: {
                ...item.content,
                structure: {
                    ...structure,
                    // Ensure UI gets arrays even if empty
                    actions: structure.actions || [],
                    conditions: structure.conditions || [],
                    parameters: structure.parameters || []
                }
            }
        };
    }

    /**
     * NGN SCORING RULE: 0/1 per slot (Typical)
     * Total 5 points: 2 Actions, 1 Condition, 2 Parameters.
     * Each slot must be perfect match? Or just partial credit?
     * Standard NGN BowTie: 
     * - Condition: 0/1
     * - Actions: 0/1 for each correct one selected? Or all-or-nothing pair? 
     *   Usually it's 1 point per correct selection.
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        // userAnswer structure expected: { actions: [id, id], condition: [id], parameters: [id, id] }
        let score = 0;
        const maxScore = 5; // 2 + 1 + 2
        const feedbackLines: string[] = [];

        // 1. Grade Condition (Center)
        const correctCond = correctContent.content?.structure?.conditions.find((c: any) => c.isCorrect)?.id;
        const userCond = userAnswer.conditions?.[0]; // ID string
        if (userCond === correctCond) {
            score += 1;
        } else {
            feedbackLines.push("Condition incorrect.");
        }

        // 2. Grade Actions (Left)
        const correctActionIds = correctContent.content?.structure?.actions.filter((x: any) => x.isCorrect).map((x: any) => x.id);
        const userActionIds = userAnswer.actions || [];
        userActionIds.forEach((id: string) => {
            if (correctActionIds.includes(id)) score += 1;
        });

        // 3. Grade Parameters (Right)
        const correctParamIds = correctContent.content?.structure?.parameters.filter((x: any) => x.isCorrect).map((x: any) => x.id);
        const userParamIds = userAnswer.parameters || [];
        userParamIds.forEach((id: string) => {
            if (correctParamIds.includes(id)) score += 1;
        });

        return {
            score,
            maxScore,
            feedback: `You scored ${score}/5. ${feedbackLines.join(' ')}`,
            correctIds: [...correctActionIds, correctCond, ...correctParamIds]
        };
    }
}
