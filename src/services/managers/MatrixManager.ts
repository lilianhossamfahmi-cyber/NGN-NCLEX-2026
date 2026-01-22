
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class MatrixManager extends AbstractItemManager {
    typeKeys = ['matrix', 'matrix-mr', 'matrix-standard'];

    /**
     * MATRIX REPAIR LOGIC
     * 1. Aligns Rows and Columns (Ensure grid is rectangular).
     * 2. Auto-fixes the "radio vs checkbox" confusion (Multiple Response vs Single).
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};

        // 1. Ensure Defaults
        if (!structure.rows) structure.rows = [];
        if (!structure.columns) structure.columns = [];
        if (!structure.type) structure.type = 'matrix-mr'; // Default to Multiple Response

        // 2. Fix Header vs Data mismatch
        // If columns are just strings, map them to objects
        structure.columns = structure.columns.map((c: any) => {
            if (typeof c === 'string') return { text: c, id: c.toLowerCase().replace(/\s/g, '_') };
            return c;
        });

        // 3. Ensure every row has an ID
        structure.rows = structure.rows.map((r: any, i: number) => {
            if (typeof r === 'string') return { text: r, id: `r${i}` };
            if (!r.id) r.id = `r${i}`;
            return r;
        });

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (!s.rows || s.rows.length === 0) issues.push({ severity: 'critical', field: 'rows', message: 'Matrix must have at least 1 row.' });
        if (!s.columns || s.columns.length < 2) issues.push({ severity: 'critical', field: 'columns', message: 'Matrix must have at least 2 columns.' });

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        return item;
    }

    /**
     * Grading: Usually +/- Scoring or 0/1 per Row.
     * NGN Matrix (Multiple Response): +/- Scoring applies to the whole grid? 
     * Or is it 0/1 per row?
     * NCSBN Rule: "Matrix Multiple Response" use +/- scoring (Each correct click +1, incorrect -1).
     * "Matrix Single Response" (Radio) uses 0/1 per row.
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        // userAnswer: { rowId: [colId, ...], ... }
        const userMap = userAnswer || {};
        const s = correctContent.content?.structure || {};
        const isMultipleResponse = s.type === 'matrix-mr';

        let score = 0;
        let maxScore = 0; // Total possible
        let feedback = "";

        if (isMultipleResponse) {
            // +/- Scoring across entire grid
            // Loop through all cells in correctKey
            // NOTE: Correct key structure for Matrix varies. Assuming rows have 'correctColIds'
            s.rows.forEach((row: any) => {
                const correctCols = row.correctColIds || [];
                maxScore += correctCols.length; // Max is sum of correct ticks

                const userSelection = userMap[row.id] || []; // Array of col IDs

                userSelection.forEach((cid: string) => {
                    if (correctCols.includes(cid)) score++;
                    else score--; // Penalty
                });
            });
            score = Math.max(0, score);
        } else {
            // Radio Mode (1 per row)
            s.rows.forEach((row: any) => {
                const correctCol = row.correctColId; // Single string?
                if (correctCol) {
                    maxScore++;
                    const userSelection = userMap[row.id]; // String or [String]
                    const userVal = Array.isArray(userSelection) ? userSelection[0] : userSelection;
                    if (userVal === correctCol) score++;
                }
            });
        }

        return {
            score,
            maxScore,
            feedback: `You scored ${score}/${maxScore}.`,
            correctIds: [] // Matrix key is complex to flatten
        };
    }
}
