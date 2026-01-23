
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

        // 1. LEGACY MAPPING: Handle 'bowTieConfiguration' and flattened '_options' variants
        const btc = (item as any).bowTieConfiguration || (structure as any).bowTieConfiguration;
        if (btc) {
            if (!structure.conditions?.length) {
                const src = btc.conditionOptions || btc.conditions;
                structure.conditions = src?.map((o: any, i: number) => ({ id: `c_${i}`, text: o.text || o, isCorrect: !!o.isCorrect })) || [];
            }
            if (!structure.actions?.length) {
                const src = btc.actionOptions || btc.actions;
                structure.actions = src?.map((o: any, i: number) => ({ id: `a_${i}`, text: o.text || o, isCorrect: !!o.isCorrect })) || [];
            }
            if (!structure.parameters?.length) {
                const src = btc.parameterOptions || btc.parameters;
                structure.parameters = src?.map((o: any, i: number) => ({ id: `p_${i}`, text: o.text || o, isCorrect: !!o.isCorrect })) || [];
            }
        }

        // Support flat formats like actions_options + correct_actions
        if ((item as any).actions_options && !structure.actions?.length) {
            structure.actions = (item as any).actions_options.map((txt: string, i: number) => ({
                id: `a_${i}`,
                text: txt,
                isCorrect: (item as any).correct_actions?.includes(txt)
            }));
        }
        if ((item as any).condition_options && !structure.conditions?.length) {
            structure.conditions = (item as any).condition_options.map((txt: string, i: number) => ({
                id: `c_${i}`,
                text: txt,
                isCorrect: (item as any).correct_condition === txt || (item as any).correct_condition?.includes(txt)
            }));
        }
        if ((item as any).parameter_options && !structure.parameters?.length) {
            structure.parameters = (item as any).parameter_options.map((txt: string, i: number) => ({
                id: `p_${i}`,
                text: txt,
                isCorrect: (item as any).correct_parameters?.includes(txt)
            }));
        }

        // 2. Ensure Categories Exist
        if (!structure.actions) structure.actions = [];
        if (!structure.conditions) structure.conditions = [];
        if (!structure.parameters) structure.parameters = [];

        // 3. Flatten and Normalize Arrays (Handle {pool: []} wrapper)
        structure.actions = this.normalizeOptionArray(structure.actions);
        structure.conditions = this.normalizeOptionArray(structure.conditions);
        structure.parameters = this.normalizeOptionArray(structure.parameters);

        // 4. Auto-Generate IDs if missing
        [structure.actions, structure.conditions, structure.parameters].forEach((arr, idx) => {
            const prefix = ['a', 'c', 'p'][idx];
            arr.forEach((opt: any, i: number) => {
                if (!opt.id) opt.id = `${prefix}${i + 1}`;
            });
        });

        item.content.structure = structure;
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
        const userCond = userAnswer.condition; // The single selected ID
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
