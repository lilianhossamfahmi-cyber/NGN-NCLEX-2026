
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

        // 1. AI FALLBACK: Map 'options' with 'columns' to 'rows' and 'columns'
        // This handles items generated with a nested option structure instead of a grid.
        if ((!structure.rows || structure.rows.length === 0) && (structure as any).options && Array.isArray((structure as any).options)) {
            const options = (structure as any).options;

            // Deduce Columns from first option if missing
            if ((!structure.columns || structure.columns.length === 0) && options[0]?.columns) {
                structure.columns = options[0].columns.map((c: any, idx: number) => ({
                    id: c.id || `c_${idx}`,
                    label: c.label || c.text || `Col ${idx + 1}`,
                }));
            }

            // Deduce Rows
            structure.rows = options.map((opt: any, idx: number) => {
                const correctIds = opt.columns
                    ?.map((c: any, cIdx: number) => c.isCorrect ? (c.id || `c_${cIdx}`) : null)
                    .filter(Boolean) || [];

                return {
                    id: opt.id || `r_${idx}`,
                    text: opt.text || opt.label || `Row ${idx + 1}`,
                    correctColumnIds: correctIds
                };
            });

            // Auto-detect Multiple Response vs Single Choice
            const hasMultipleCorrect = structure.rows.some((r: any) => r.correctColumnIds && r.correctColumnIds.length > 1);
            if (hasMultipleCorrect) {
                structure.type = 'matrix-mr';
            } else {
                structure.type = 'matrix-standard';
            }
        }

        // 2. Standardize Column Objects
        structure.columns = (structure.columns || []).map((c: any) => {
            if (typeof c === 'string') return { label: c, id: c.toLowerCase().replace(/\s/g, '_') };
            return { ...c, label: c.label || c.text || `Col` };
        });

        // 3. Standardize Row Objects
        structure.rows = (structure.rows || []).map((r: any, i: number) => {
            if (typeof r === 'string') return { text: r, id: `r${i}`, correctColumnIds: [] };

            // Ensure ID and Text
            const row = {
                ...r,
                id: r.id || `r${i}`,
                text: r.text || r.label || `Row ${i + 1}`
            };

            // Map correctColId (Single) to correctColumnIds (Array) for consistency
            if (r.correctColId && (!r.correctColumnIds || r.correctColumnIds.length === 0)) {
                row.correctColumnIds = [r.correctColId];
            } else if (!row.correctColumnIds) {
                row.correctColumnIds = [];
            }

            return row;
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

        if (isMultipleResponse) {
            // +/- Scoring across entire grid
            // Loop through all cells in correctKey
            // NOTE: Correct key structure for Matrix varies. Assuming rows have 'correctColIds'
            s.rows.forEach((row: any) => {
                const correctCols = row.correctColumnIds || row.correctColIds || [];
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
                const correctCol = row.correctColumnId || row.correctColId; // Single string?
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
