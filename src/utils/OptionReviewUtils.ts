import { ReviewUnit, ReviewUnitStatus } from '../types/OptionReviewV2Types';

/**
 * Clean rationale text helper
 */
const cleanOpRationale = (opRat: any): string => {
    if (!opRat) return "";
    if (typeof opRat === 'object') return opRat.answerAnalysis || JSON.stringify(opRat);
    return String(opRat);
};

/**
 * Determine the status of a review unit
 */
const determineStatus = (selected: boolean, isCorrect: boolean): ReviewUnitStatus => {
    if (selected && isCorrect) return 'SELECTED_CORRECT';
    if (selected && !isCorrect) return 'SELECTED_INCORRECT';
    if (!selected && isCorrect) return 'MISSED_CORRECT';
    return 'NOT_SELECTED_INCORRECT';
};

/**
 * Helper to normalize string for fuzzy matching
 */
const normalizeText = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
};

/**
 * Main Transformer Function
 */
export const buildReviewUnits = (question: any, userAns: any, _result: any, _smartRationale?: any): ReviewUnit[] => {
    if (!question) return [];

    const type = question.type || question.structure?.type;
    const units: ReviewUnit[] = [];

    // --- 1. HIGHLIGHT ---
    if (type === 'highlight' || (question.text && question.text.includes('<span') && question.rationales)) {
        // Normalize User Answers
        let uAns: string[] = [];
        if (Array.isArray(userAns)) uAns = userAns.map(String);
        else if (userAns && typeof userAns === 'object') uAns = Object.keys(userAns);

        // Build Correctness Set
        const correctSet = new Set<string>();
        const addToCorrect = (val: any) => {
            if (val === undefined || val === null) return;
            correctSet.add(String(val));
            correctSet.add(normalizeText(String(val)));
        };
        if (question.correct && Array.isArray(question.correct)) question.correct.forEach(addToCorrect);
        if (question.correctAnswers && Array.isArray(question.correctAnswers)) question.correctAnswers.forEach(addToCorrect);
        if (question.content?.correct && Array.isArray(question.content.correct)) question.content.correct.forEach(addToCorrect);
        if (question.rationales && typeof question.rationales === 'object') {
            Object.values(question.rationales).forEach((r: any) => {
                if (typeof r === 'object' && (r.isCorrect === true || r.correct === true)) {
                    // Logic handled in loop
                }
            });
        }

        // Build Rationale Map
        const ratMap = new Map<string, any>();
        if (question.rationales && typeof question.rationales === 'object') {
            Object.entries(question.rationales).forEach(([key, val]) => {
                ratMap.set(key, val);
                ratMap.set(normalizeText(key), val);
            });
        }

        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        let match;
        let idx = 0;

        while ((match = regex.exec(question.text || "")) !== null) {
            const id = match[1];
            const text = match[2].trim();
            const normText = normalizeText(text);

            let ratObj = ratMap.get(id) || ratMap.get(text) || ratMap.get(normText);

            // Alternative lookups for AI inconsistencies
            if (!ratObj) {
                ratObj = ratMap.get(`Selection ${idx + 1}`) ||
                    ratMap.get(`Option ${idx + 1}`) ||
                    ratMap.get(`Finding ${idx + 1}`) ||
                    // Try looking in the global object by index if map failed
                    (question.rationales && Object.values(question.rationales)[idx]);
            }

            // Fuzzy Find Rationale
            if (!ratObj && question.rationales) {
                const keys = Object.keys(question.rationales);
                for (const key of keys) {
                    const k = normalizeText(key);
                    if ((k.includes(normText) || normText.includes(k)) && k.length > 5 && normText.length > 5) {
                        ratObj = question.rationales[key];
                        break;
                    }
                }
            }

            let isCorrect = correctSet.has(id) || correctSet.has(text) || correctSet.has(normText);
            if (!isCorrect && ratObj && typeof ratObj === 'object') {
                isCorrect = ratObj.isCorrect === true || ratObj.correct === true;
            }

            const selected = uAns.includes(id);
            const status = determineStatus(selected, isCorrect);

            // Deep extraction of rationale text
            let rationaleText = typeof ratObj === 'string' ? ratObj : (ratObj?.text || ratObj?.detailedReason || ratObj?.rationale || ratObj?.explanation || undefined);

            // Final fallback: If we still have no text, check if the value itself is the text (edge case)
            if (!rationaleText && ratObj && typeof ratObj === 'string') rationaleText = ratObj;

            units.push({
                id,
                itemType: 'highlight',
                sequence: idx + 1,
                label: `Selection ${idx + 1}`,
                optionText: text,
                keyIsCorrect: isCorrect,
                userSelected: selected,
                status,
                whyCorrect: isCorrect ? rationaleText : undefined,
                whyIncorrect: !isCorrect ? rationaleText : undefined
            });
            idx++;
        }
    }

    // --- 2. BOW TIE ---
    else if (type === 'bow-tie' || (question.actions && question.conditions && question.parameters)) {
        const processPool = (pool: any[] | undefined, labelPrefix: string, userSelections: any) => {
            if (!pool) return;
            pool.forEach((item, i) => {
                let selected = false;
                if (Array.isArray(userSelections)) selected = userSelections.includes(item.id);
                else selected = userSelections === item.id;

                const isCorrect = item.isCorrect === true;
                const status = determineStatus(selected, isCorrect);
                const rationale = cleanOpRationale(item.rationale || item.explanation);

                units.push({
                    id: item.id || `${labelPrefix}-${i}`,
                    itemType: 'bow-tie',
                    sequence: units.length + 1,
                    label: labelPrefix,
                    optionText: item.text,
                    keyIsCorrect: isCorrect,
                    userSelected: selected,
                    status,
                    whyCorrect: isCorrect ? rationale : undefined,
                    whyIncorrect: !isCorrect ? rationale : undefined
                });
            });
        };

        const uAns = userAns || {};
        processPool(question.actions?.pool || question.actions, "Action", uAns.actions);
        processPool(question.conditions?.pool || question.conditions, "Condition", uAns.condition);
        processPool(question.parameters?.pool || question.parameters, "Parameter", uAns.parameters);
    }

    // --- 3. MATRIX ---
    else if (question.rows?.length) {
        // Matrix can be single or multiple response per row
        const uAns = userAns || {};

        question.rows.forEach((r: any, rIdx: number) => {
            // Determine correct column IDs for this row
            const correctIds: string[] = r.correctColumnIds || r.correctColumns || (r.correctColumnId ? [r.correctColumnId] : []);
            const correctColLabels = correctIds.map((cid: string) => question.columns?.find((c: any) => c.id === cid)?.label).filter(Boolean);
            const correctText = correctColLabels.join(", ");

            const userVal = uAns[r.id];

            // For Matrix, we often treat the "Row" as the unit. 
            // BUT, usually a Review Unit is an option you can click.
            // If the row is the unit, we need to know if the user got the row correct.

            let isRowCorrect = false;
            let hasSelection = !!userVal;

            if (Array.isArray(userVal)) {
                isRowCorrect = userVal.length === correctIds.length && userVal.every((v: string) => correctIds.includes(v));
                hasSelection = userVal.length > 0;
            } else {
                isRowCorrect = correctIds.includes(userVal);
            }

            // In standard Matrix feedback, we often just show the row and say "You picked X, Correct was Y".
            // Rationale is per row.

            // Map row status to Unit Status
            // If row is correct -> SELECTED_CORRECT (conceptually)
            // If row is incorrect but selected -> SELECTED_INCORRECT
            // If row is incorrect and not selected -> NOT_SELECTED_INCORRECT (doesn't apply much here as rows are mandatory)
            // If row is skipped -> MISSED_CORRECT (technically)

            let unitStatus: ReviewUnitStatus = 'NOT_SELECTED_INCORRECT';
            if (isRowCorrect) unitStatus = 'SELECTED_CORRECT';
            else if (hasSelection) unitStatus = 'SELECTED_INCORRECT'; // User made a choice, but wrong
            else unitStatus = 'MISSED_CORRECT'; // User skipped it

            const rationale = cleanOpRationale(r.rationale);

            units.push({
                id: r.id,
                itemType: 'matrix-row',
                sequence: rIdx + 1,
                label: `Row ${rIdx + 1}`,
                optionText: r.text,
                promptText: "Evaluated Finding",
                keyIsCorrect: true, // Rows are always part of the key in matrix
                userSelected: hasSelection,
                status: unitStatus,
                whyCorrect: `Correct Classification: ${correctText}. ${rationale}`,
                whyIncorrect: `Correct Classification was: ${correctText}. ${rationale}`
            });
        });
    }

    // --- 4. ORDERED RESPONSE ---
    else if (type === 'ordered-response' || (question.options?.length && question.options.every((o: any) => o.correctOrder !== undefined || o.order !== undefined))) {
        // Here, "Selected" means "Included in the ordered list correctly".
        // But simplified: Did the user include this step?
        // Usually Ordered Response is "Drag all steps into order".
        const uAns = Array.isArray(userAns) ? userAns : [];

        question.options.forEach((o: any, idx: number) => {
            const userIndex = uAns.indexOf(o.id);
            const isSelected = userIndex !== -1;

            // Strict Order Check: Correct only if in the correct index
            const isCorrectPosition = userIndex === idx;

            // Status: If selected and in correct position -> CORRECT
            // If selected properties but wrong position -> INCORRECT
            // If not in list (rare for D&D) -> MISSED
            let status: ReviewUnitStatus = 'NOT_SELECTED_INCORRECT';

            if (isSelected) {
                status = isCorrectPosition ? 'SELECTED_CORRECT' : 'SELECTED_INCORRECT';
            } else {
                status = 'MISSED_CORRECT';
            }

            units.push({
                id: o.id,
                itemType: 'ordered-response',
                sequence: idx + 1,
                label: `Step ${idx + 1}`,
                optionText: o.text,
                keyIsCorrect: true, // It is a correct step in the chain
                userSelected: isSelected,
                status,
                whyCorrect: isCorrectPosition
                    ? `Correctly placed at Step ${idx + 1}. ${cleanOpRationale(o.rationale)}`
                    : undefined,
                whyIncorrect: !isCorrectPosition
                    ? `Incorrectly placed. Should be Step ${idx + 1}. ${cleanOpRationale(o.rationale)}`
                    : undefined
            });
        });
    }

    // --- 5. HOT SPOT ---
    else if (type === 'hotspot' || question.areas) {
        const uAns = Array.isArray(userAns) ? userAns : [];
        if (question.areas) {
            question.areas.forEach((area: any, idx: number) => {
                const selected = uAns.includes(area.id || `area-${idx}`);
                const isCorrect = area.isCorrect === true;
                const status = determineStatus(selected, isCorrect);

                units.push({
                    id: area.id || `area-${idx}`,
                    itemType: 'hotspot',
                    sequence: idx + 1,
                    label: area.label || `Area ${idx + 1}`,
                    optionText: area.label || `Target Area ${idx + 1}`,
                    keyIsCorrect: isCorrect,
                    userSelected: selected,
                    status,
                    whyCorrect: isCorrect ? cleanOpRationale(area.rationale) : undefined,
                    whyIncorrect: !isCorrect ? cleanOpRationale(area.rationale) : undefined
                });
            });
        }
    }

    // --- 6. DROP DOWN / CLOZE ---
    else if (question.dropdowns || question.sentences) {
        const uAns = userAns || {};

        // Helper to extract context around a blank token
        const getContextForBlank = (text: string, token: string): string => {
            if (!text || !token) return "Answer";
            const idx = text.indexOf(token);
            if (idx === -1) return "Answer";

            // Grab surrounding text (e.g., 30 chars before and after, stopping at sentence boundaries)
            const start = Math.max(0, text.lastIndexOf('.', idx) + 1);
            let end = text.indexOf('.', idx);
            if (end === -1) end = text.length;

            let fragment = text.slice(start, end).trim();
            // Replace the token with a visually distinct placeholder for the label
            return fragment.replace(token, "___").trim();
        };

        // We need to process dropdowns. Ideally we iterate sentences to get context.
        // If sentences exist, map them. If not, fallback to dropdowns list.

        let processedIds = new Set<string>();

        const processBlank = (dd: any, contextText: string, idx: number) => {
            if (processedIds.has(dd.id)) return;
            processedIds.add(dd.id);

            // 1. Normalize Options (Match Renderer Logic) AND Preserve isCorrect
            const normOptions = (dd.options || []).map((o: any, i: number) => {
                if (typeof o === 'string') return { id: o, text: o, isCorrect: false };
                return {
                    id: o.id || `opt-${i}`,
                    text: o.text || o.label || o.value || o,
                    isCorrect: !!o.isCorrect,
                    rationale: o.rationale,
                    whyCorrect: o.whyCorrect,
                    whyIncorrect: o.whyIncorrect
                };
            });

            const userSelectedId = uAns[dd.id];

            // Resolve User Text
            let userVal = "No Answer";
            let userValText = "";

            if (userSelectedId) {
                // Look up in normalized options
                const selectedOpt = normOptions.find((o: any) => o.id === userSelectedId);
                if (selectedOpt) {
                    userVal = selectedOpt.text;
                    userValText = userVal;
                } else {
                    // Fallback to raw value
                    userVal = userSelectedId;
                    userValText = userVal;
                }
            } else {
                userVal = "No Answer"; // For display
            }

            // Resolve Correct Val Text
            let correctVal = "Unknown";
            let correctIdCanonical = dd.correctOptionId;

            // Try to resolve correct ID to text using normalized options
            let correctOpt = undefined;

            // Strategy A: Explicit correctOptionId on parent
            if (dd.correctOptionId) {
                correctOpt = normOptions.find((o: any) => o.id === dd.correctOptionId);
                if (!correctOpt) {
                    // Try fuzzy lookup of the Correct ID as text
                    correctOpt = normOptions.find((o: any) =>
                        String(o.text).toLowerCase().trim() === String(dd.correctOptionId).toLowerCase().trim()
                    );
                }
            }

            // Strategy B: isCorrect flag on options
            if (!correctOpt) {
                correctOpt = normOptions.find((o: any) => o.isCorrect);
            }

            if (correctOpt) {
                correctVal = correctOpt.text;
                correctIdCanonical = correctOpt.id;
            } else if (dd.correctOptionId) {
                correctVal = dd.correctOptionId; // Fallback
            }

            // Status Determination
            let status: ReviewUnitStatus = 'MISSED_CORRECT'; // Default to missed/unanswered
            let clozeStatus: 'CORRECT' | 'INCORRECT' | 'UNANSWERED' = 'UNANSWERED';
            let isCorrect = false;

            if (!userSelectedId) {
                clozeStatus = 'UNANSWERED';
                status = 'MISSED_CORRECT';
            } else {
                // Check 1: ID Match
                if (userSelectedId === correctIdCanonical) {
                    isCorrect = true;
                }
                // Check 2: Fuzzy Text Match
                else if (userValText && correctVal &&
                    String(userValText).toLowerCase().trim() === String(correctVal).toLowerCase().trim()) {
                    isCorrect = true;
                }

                if (isCorrect) {
                    clozeStatus = 'CORRECT';
                    status = 'SELECTED_CORRECT';
                }
            }

            // Enhanced Rationale Lookup
            let whyCorrect = dd.whyCorrect || dd.rationale;

            // Check specific option rationale if available
            if (!whyCorrect && correctOpt && (correctOpt.rationale || correctOpt.whyCorrect)) {
                whyCorrect = correctOpt.rationale || correctOpt.whyCorrect;
            }

            if (!whyCorrect) whyCorrect = "No rationale provided.";

            units.push({
                id: dd.id || `dd-${idx}`,
                itemType: 'cloze',
                sequence: idx + 1,
                label: `Blank ${idx + 1}`,
                optionText: correctVal,
                promptText: contextText,
                keyIsCorrect: true,
                userSelected: !!userSelectedId,
                status,
                whyCorrect,
                clozeResult: {
                    blankId: dd.id,
                    index: idx,
                    contextLabel: contextText || `Blank ${idx + 1}`,
                    userValue: userVal === "No Answer" ? null : userVal,
                    correctValue: correctVal,
                    status: clozeStatus,
                    pointsEarned: isCorrect ? 1 : 0,
                    maxPoints: 1,
                    whyCorrect: isCorrect ? whyCorrect : undefined,
                    whyIncorrect: !isCorrect ? (dd.whyIncorrect || null) : undefined
                }
            });
        };

        if (question.sentences && Array.isArray(question.sentences)) {
            let globalIdx = 0;
            question.sentences.forEach((sent: any) => {
                const text = sent.text || sent.sentence || "";
                // If the sentence has specific dropdowns defined inline
                if (sent.dropdowns) {
                    sent.dropdowns.forEach((dd: any) => {
                        // Try to find the token in the text
                        const token = `%${dd.id}%`;
                        const context = getContextForBlank(text, token);
                        processBlank(dd, context, globalIdx++);
                    });
                } else {
                    // Global dropdowns referenced in text?
                    // If text contains %id%, look it up in root dropdowns
                    const regex = /%([a-zA-Z0-9_.-]+)%/g;
                    let match;
                    while ((match = regex.exec(text)) !== null) {
                        const blankId = match[1];
                        const dd = question.dropdowns?.find((d: any) => d.id === blankId);
                        if (dd) {
                            const context = getContextForBlank(text, match[0]);
                            processBlank(dd, context, globalIdx++);
                        }
                    }
                }
            });
        }

        // Fallback: If no sentences or missed some IDs (e.g. standalone dropdowns)
        if (question.dropdowns) {
            question.dropdowns.forEach((dd: any) => {
                processBlank(dd, "Select the correct option", processedIds.size);
            });
        }
    }

    // --- 7. STANDARD (MCQ / SATA) ---
    else if (question.options?.length) {
        const uAns = userAns;
        question.options.forEach((o: any, idx: number) => {
            let selected = false;
            // Handle string vs array vs object
            if (Array.isArray(uAns)) selected = uAns.includes(o.id);
            else if (typeof uAns === 'string') selected = uAns === o.id;
            else if (uAns && typeof uAns === 'object') selected = !!uAns[o.id];

            const isCorrect = o.isCorrect === true;
            const status = determineStatus(selected, isCorrect);
            const rationale = cleanOpRationale(o.rationale);

            units.push({
                id: o.id,
                itemType: 'standard',
                sequence: idx + 1,
                label: String.fromCharCode(65 + idx), // A, B, C...
                optionText: o.text || o.label,
                keyIsCorrect: isCorrect,
                userSelected: selected,
                status,
                whyCorrect: isCorrect ? rationale : undefined,
                whyIncorrect: !isCorrect ? rationale : undefined
            });
        });
    }

    return units;
};
