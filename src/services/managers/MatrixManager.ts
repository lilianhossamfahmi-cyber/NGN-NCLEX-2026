
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
    grade(userAnswer: any, item: any): GradingResult {
        // userAnswer: { rowId: [colId, ...], ... }
        const userMap = userAnswer || {};
        const s = item.content?.structure || {};
        const isMultipleResponse = s.type === 'matrix-mr' || s.inputMode === 'checkbox';

        let score = 0;
        let maxScore = 0;

        if (!s.rows || s.rows.length === 0) {
            return { score: 0, maxScore: 0, feedback: 'Invalid matrix structure.', correctIds: [] };
        }

        if (isMultipleResponse) {
            // +/- Scoring across entire grid
            s.rows.forEach((row: any) => {
                const correctCols = row.correctColumnIds || row.correctColIds || [];
                maxScore += correctCols.length;

                const userSelection = userMap[row.id] || [];
                const userArr = Array.isArray(userSelection) ? userSelection : [userSelection];

                userArr.forEach((cid: string) => {
                    if (correctCols.includes(cid)) score++;
                    else score--; // Penalty
                });
            });
            score = Math.max(0, score);
        } else {
            // Radio Mode (0/1 per row)
            s.rows.forEach((row: any) => {
                const correctCol = row.correctColumnIds?.[0] || row.correctColId;
                if (correctCol) {
                    maxScore++;
                    const userSelection = userMap[row.id];
                    const userVal = Array.isArray(userSelection) ? userSelection[0] : userSelection;
                    if (userVal === correctCol) score++;
                }
            });
        }

        // Final Clamping and Rounding
        const finalScore = maxScore > 0 ? (score / maxScore) : 0;

        return {
            score: Number(finalScore.toFixed(4)),
            maxScore: 1,
            feedback: `You scored ${Math.round(finalScore * 100)}%.`,
            correctIds: []
        };
    }
}
