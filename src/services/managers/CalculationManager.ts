
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class CalculationManager extends AbstractItemManager {
    typeKeys = ['calculation', 'math', 'dosage'];

    /**
     * CALCULATION REPAIR LOGIC
     * 1. Standardizes numeric formats (e.g. ranges).
     * 2. Checks for unit consistency.
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Ensure Units are defined
        if (!structure.unit) {
            // Try to infer from prompt
            const prompt = item.content.prompt || "";
            const unitMatch = prompt.match(/\(([^)]+)\)|in\s+([a-zA-Z\/]+)/); // Matches (mL) or in mL
            if (unitMatch) structure.unit = unitMatch[1] || unitMatch[2];
            else structure.unit = "units"; // Fallback
        }

        // 2. Standardize Correct Answer
        // It might be a number, a string "10-12", or an object { min: 10, max: 12 }
        if (structure.correctAnswer !== undefined) {
            const val = structure.correctAnswer;
            if (typeof val === 'string' && val.includes('-')) {
                const [min, max] = val.split('-').map(Number);
                if (!isNaN(min) && !isNaN(max)) {
                    structure.correctRange = { min, max };
                    structure.correctAnswer = (min + max) / 2; // Average as ideal
                }
            } else if (typeof val === 'number') {
                // Auto-create tolerance range (+/- 10% or +/- 0.5 depending on magnitude?)
                // NGN rule: usually exact or +/- 1 unit.
                structure.correctRange = { min: val, max: val }; // Default exact
            }
        }

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (s.correctAnswer === undefined && !s.correctRange) {
            issues.push({ severity: 'critical', field: 'correctAnswer', message: 'Calculation must have a correct answer or range.' });
        }

        if (!s.unit) {
            issues.push({ severity: 'warning', field: 'unit', message: 'Unit (e.g. mL/hr) not specified.' });
        }

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    /**
     * Grading: Tolerance Range
     * Accepts any number between min and max.
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        const userVal = parseFloat(userAnswer);
        const s = correctContent.content?.structure || {};

        // Range check
        const range = s.correctRange;
        const exact = parseFloat(s.correctAnswer);

        if (isNaN(userVal)) {
            return { score: 0, maxScore: 1, feedback: "Invalid number format.", correctIds: [String(exact)] };
        }

        let isCorrect = false;
        if (range) {
            isCorrect = userVal >= range.min && userVal <= range.max;
        } else {
            // Strict equality if no range
            isCorrect = Math.abs(userVal - exact) < 0.0001; // Epsilon check
        }

        return {
            score: isCorrect ? 1 : 0,
            maxScore: 1,
            feedback: isCorrect ? "Correct calculation." : `Incorrect. Answer: ${exact} ${s.unit || ''}`,
            correctIds: [String(exact)]
        };
    }
}
