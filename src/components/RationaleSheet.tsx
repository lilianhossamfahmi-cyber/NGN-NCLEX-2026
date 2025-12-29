import React, { useMemo } from 'react';
import { UltimateRationale } from './UltimateRationale';
import { MatrixRowAnalysis } from '../types/RationaleTypes';
import { generateCJFeedback } from '../utils/RemediationGenerator';
import { buildReviewUnits } from '../utils/OptionReviewUtils';

interface RationaleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    question: any;
    result?: any;
}

export const RationaleDrawer: React.FC<RationaleDrawerProps> = ({ isOpen, onClose, question, result }) => {

    // Extract CJMM Step
    const cjmmStep = question?.content?.metadata?.cjmmStep || question?.metadata?.cjmmStep || "Clinical Judgment";

    const smartRationale = useMemo(() => {
        if (!question) return null;

        // 1. Try to find the rationale string or object 
        // For simple items, it might be at root. For structured items, maybe inside content.
        let rawRationale = question.rationale || question.content?.rationale;

        // If not found at root, try to find it in options (for Case Study screens that split it)
        if (!rawRationale) {
            if (question.options?.length) {
                // Find correct option rationale
                const correct = question.options.find((o: any) => o.isCorrect);
                if (correct) rawRationale = correct.rationale;
            } else if (question.rows?.length) {
                const correct = question.rows.find((r: any) => r.correctColumnId);
                if (correct) rawRationale = correct.rationale;
            } else if (question.type === 'bow-tie' || (question.actions && (question.conditions || question.parameters))) {
                // BOW-TIE FALLBACK: Ensure drawer opens even if no global rationale string
                rawRationale = {
                    coreConcept: "Clinical Reasoning: Bow-Tie Analysis",
                    caseSummary: "Analyze the relationships between the client's condition, appropriate actions, and parameters to monitor.",
                    // If items have individual rationales, they will be populated in optionReviews below
                };
            } else if (question.dropdowns?.length || question.sentences?.length) {
                // CLOZE SUPPORT: If no global rationale, try to find one attached to a correct option
                const allDropdowns = question.dropdowns || question.sentences.flatMap((s: any) => s.dropdowns || []);
                const firstCorrect = allDropdowns.flatMap((d: any) => d.options || []).find((o: any) => o.isCorrect);

                // If found, use it. If not, create a placeholder so the drawer still opens.
                if (firstCorrect?.rationale) {
                    rawRationale = firstCorrect.rationale;
                } else {
                    // Force a fallback object so the modal opens and runs option reviews
                    rawRationale = {
                        coreConcept: "Clinical Judgment Review",
                        caseSummary: "Review the correct selections for each blank below."
                    };
                }
            }
        }

        if (!rawRationale) return null;

        let parsed: any = {};

        if (typeof rawRationale === 'object') {
            // Intelligent Fallback for Option Reviews if not explicitly provided in the rationale object
            let finalOptionReviews = rawRationale.optionReviews;

            if (!finalOptionReviews) {
                if (question.options?.length) {
                    finalOptionReviews = question.options.map((o: any) => ({
                        id: o.id,
                        text: o.text,
                        isCorrect: o.isCorrect,
                        rationale: typeof o.rationale === 'object' ?
                            (o.rationale.answerAnalysis || JSON.stringify(o.rationale)) :
                            (o.rationale || "No rationale provided.")
                    }));
                } else if (question.rows?.length) {
                    finalOptionReviews = question.rows.map((r: any) => {
                        // Matrix Logic: Find the correct column name to make the review meaningful
                        const correctCol = question.columns?.find((c: any) => c.id === r.correctColumnId);
                        const colName = correctCol ? correctCol.label : "Correct Option";

                        // Safety: Handle if row rationale is legacy object or new string
                        let rText = "No rationale provided.";
                        if (r.rationale) {
                            if (typeof r.rationale === 'object') {
                                rText = r.rationale.answerAnalysis || r.rationale.breakdown || JSON.stringify(r.rationale);
                            } else {
                                rText = r.rationale;
                            }
                        }

                        return {
                            id: r.id,
                            text: r.text,
                            // In Matrix, every row has a correct answer column. 
                            // We mark it "true" so it shows green, but we clarify the "Correct Choice" in the text.
                            isCorrect: true,
                            rationale: `**Correct Classification: ${colName}**\n\n${rText}`
                        };
                    });
                }
            }

            parsed = {
                coreConcept: rawRationale.coreConcept || 'Clinical Concept',
                goldenRule: rawRationale.goldenRule,
                pitfalls: rawRationale.pitfalls,
                caseSummary: rawRationale.caseSummary,
                answerAnalysis: rawRationale.answerAnalysis || question.explanation,
                trap: rawRationale.trap,
                mnemonic: rawRationale.mnemonic,
                cheatSheet: rawRationale.cheatSheet,
                steps: rawRationale.steps,
                optionReviews: finalOptionReviews,
                referenceInfo: rawRationale.referenceInfo
            };
        } else {
            // 3. Parse "Super Teacher" Legacy String Format
            // "[Hook] ... [Breakdown] ... [Trap] ... [Steps] ... [Future] ..."
            parsed = {
                coreConcept: rawRationale.includes('[Hook]') ? extractSection('Hook', rawRationale) : "Clinical Reasoning Breakdown",
                vitals: []
            };

            parsed.caseSummary = extractSection('Hook', rawRationale);
            parsed.answerAnalysis = extractSection('Breakdown', rawRationale);
            parsed.trap = extractSection('Trap', rawRationale);
            parsed.goldenRule = extractSection('Future', rawRationale);

            const stepsText = extractSection('Steps', rawRationale);
            if (stepsText) {
                // Parse "1. **Tag** Desc"
                const lines = stepsText.split(/\d+\.\s+/).filter(Boolean);
                parsed.steps = lines.map((line: string) => {
                    const parts = line.split('**');
                    if (parts.length >= 3) {
                        return { tag: parts[1].trim(), description: parts[2].trim() };
                    }
                    return { tag: 'Action', description: line.trim() };
                }).slice(0, 6);
            }
        }

        // CRITICAL FIX: Generate Option Reviews for String-Format Rationales or if missing from object
        if (!parsed.optionReviews || parsed.optionReviews.length === 0) {
            // Helper: Clean specific rationale from an option string
            const cleanOpRationale = (opRat: any) => {
                if (!opRat) return "No rationale provided.";
                if (typeof opRat === 'object') return opRat.answerAnalysis || JSON.stringify(opRat);
                return opRat;
            };

            const type = question.type || question.structure?.type;

            // 1. HIGHLIGHT ITEM SUPPORT
            if (type === 'highlight' || (question.text && question.text.includes('<span') && question.rationales)) {

                // 1. Normalize User Answers
                const uAnsRaw = result?.userAns;
                let uAns: string[] = [];
                if (Array.isArray(uAnsRaw)) uAns = uAnsRaw.map(String);
                else if (uAnsRaw && typeof uAnsRaw === 'object') uAns = Object.keys(uAnsRaw);

                // 2. Build Correctness Set (Robust Sources)
                const correctSet = new Set<string>();
                const addToCorrect = (val: any) => {
                    if (val === undefined || val === null) return;
                    correctSet.add(String(val));
                    correctSet.add(String(val).toLowerCase().trim());
                };

                const q = question;
                if (q.correct && Array.isArray(q.correct)) q.correct.forEach(addToCorrect);
                if (q.correctAnswers && Array.isArray(q.correctAnswers)) q.correctAnswers.forEach(addToCorrect);
                if (q.content?.correct && Array.isArray(q.content.correct)) q.content.correct.forEach(addToCorrect);
                // Also check if rationales mark themselves as correct
                if (q.rationales && typeof q.rationales === 'object') {
                    Object.values(q.rationales).forEach((r: any) => {
                        if (typeof r === 'object' && (r.isCorrect === true || r.correct === true)) {
                            // Can't optimize easily without key, but handled in loop below
                        }
                    });
                }

                // 3. Build Rationale Map (Fuzzy Matching Support)
                const normalizeText = (t: string) => t.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
                const ratMap = new Map<string, any>();
                if (q.rationales && typeof q.rationales === 'object') {
                    Object.entries(q.rationales).forEach(([key, val]) => {
                        ratMap.set(key, val); // Exact ID
                        ratMap.set(normalizeText(key), val); // Normalized Text
                    });
                }

                // 4. Extract Items
                const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
                const reviews: any[] = [];
                let match;
                let spanIndex = 0;

                while ((match = regex.exec(q.text || "")) !== null) {
                    const id = match[1];
                    const text = match[2].trim();
                    const normText = normalizeText(text);

                    // Determine Correctness
                    // Check explicit Correct list, or Rationale object flag
                    let ratObj = ratMap.get(id) || ratMap.get(text) || ratMap.get(normText);

                    // Fallback Fuzzy Search for Rationale
                    if (!ratObj && q.rationales) {
                        const keys = Object.keys(q.rationales);
                        for (const key of keys) {
                            const k = normalizeText(key);
                            if ((k.includes(normText) || normText.includes(k)) && k.length > 5 && normText.length > 5) {
                                ratObj = q.rationales[key];
                                break;
                            }
                        }
                    }

                    let isCorrect = correctSet.has(id) || correctSet.has(text) || correctSet.has(normText);
                    if (!isCorrect && ratObj && typeof ratObj === 'object') {
                        isCorrect = ratObj.isCorrect === true || ratObj.correct === true;
                    }

                    // Determine Selection
                    const selected = uAns.includes(id);

                    // Determine Status
                    let status: 'correct' | 'incorrect' | 'missed' | 'skipped' = 'skipped';
                    if (isCorrect) {
                        status = selected ? 'correct' : 'missed';
                    } else {
                        status = selected ? 'incorrect' : 'skipped';
                    }

                    // Extract Rationale Text
                    const rationaleText = typeof ratObj === 'string' ? ratObj : (ratObj?.text || ratObj?.detailedReason || ratObj?.rationale || "No specific rationale.");

                    reviews.push({
                        id,
                        text: `"${text}"`,
                        isCorrect,
                        rationale: rationaleText,
                        userSelected: selected,
                        userStatus: status
                    });
                    spanIndex++;
                }
                parsed.optionReviews = reviews;

            } else if (question.options?.length) {
                // 2. STANDARD MCQ / SATA
                const uAns = result?.userAns;
                parsed.optionReviews = question.options.map((o: any) => {
                    let selected = false;
                    if (Array.isArray(uAns)) selected = uAns.includes(o.id);
                    else if (typeof uAns === 'string') selected = uAns === o.id;

                    let status: 'correct' | 'incorrect' | 'missed' | 'skipped' = 'skipped';
                    if (selected && o.isCorrect) status = 'correct';
                    else if (selected && !o.isCorrect) status = 'incorrect';
                    else if (!selected && o.isCorrect) status = 'missed';

                    return {
                        id: o.id,
                        text: o.text || o.label,
                        isCorrect: o.isCorrect,
                        rationale: cleanOpRationale(o.rationale),
                        userSelected: selected,
                        userStatus: status
                    };
                });

            } else if (question.rows?.length) {
                // 3. MATRIX SUPPORT (Single & Multiple Response)
                const uAns = result?.userAns || {};
                parsed.optionReviews = question.rows.map((r: any) => {
                    // correctIds is always an array of strings
                    const correctIds = r.correctColumnIds || r.correctColumns || (r.correctColumnId ? [r.correctColumnId] : []);
                    const correctLabels = correctIds.map((cid: string) => question.columns?.find((c: any) => c.id === cid)?.label).filter(Boolean);
                    const colName = correctLabels.length > 0 ? correctLabels.join(", ") : "Correct Option";

                    // Determine user correctness for this row
                    const userVal = uAns[r.id];
                    let isRowCorrect = false;
                    let hasSelection = !!userVal;

                    if (Array.isArray(userVal)) {
                        // Multiple Response Check (Exact Match)
                        isRowCorrect = userVal.length === correctIds.length && userVal.every((v: string) => correctIds.includes(v));
                        hasSelection = userVal.length > 0;
                    } else {
                        // Single Response Check
                        isRowCorrect = correctIds.includes(userVal);
                    }

                    return {
                        id: r.id,
                        text: r.text,
                        isCorrect: true,
                        rationale: `**Correct Classification: ${colName}**\n\n${cleanOpRationale(r.rationale)}`,
                        userSelected: hasSelection,
                        userStatus: isRowCorrect ? 'correct' : (hasSelection ? 'incorrect' : 'missed')
                    };
                });

            } else if (type === 'bow-tie' || (question.actions && question.conditions && question.parameters)) {
                // 4. BOW-TIE SUPPORT
                const reviews: any[] = [];
                const uAns = result?.userAns || {};

                // Helper to process a pool
                const processPool = (pool: any[] | undefined, category: string, userSelections: any) => {
                    if (!pool) return;
                    pool.forEach(item => {
                        let selected = false;
                        if (Array.isArray(userSelections)) selected = userSelections.includes(item.id); // actions/params
                        else selected = userSelections === item.id; // condition

                        let status: 'correct' | 'incorrect' | 'missed' | 'skipped' = 'skipped';
                        if (selected && item.isCorrect) status = 'correct';
                        else if (selected && !item.isCorrect) status = 'incorrect';
                        else if (!selected && item.isCorrect) status = 'missed';

                        reviews.push({
                            id: item.id,
                            text: `[${category}] ${item.text}`,
                            isCorrect: item.isCorrect,
                            rationale: cleanOpRationale(item.rationale || item.explanation),
                            userSelected: selected,
                            userStatus: status
                        });
                    });
                };

                processPool(question.actions?.pool || question.actions, "Action", uAns.actions);
                processPool(question.conditions?.pool || question.conditions, "Condition", uAns.condition);
                processPool(question.parameters?.pool || question.parameters, "Parameter", uAns.parameters);

                parsed.optionReviews = reviews;

            } else if (type === 'ordered-response' || (question.options?.length && question.options.every((o: any) => o.correctOrder !== undefined || o.order !== undefined))) {
                // 5. ORDERED RESPONSE SUPPORT
                const uAns = result?.userAns || [];
                parsed.optionReviews = question.options.map((o: any, idx: number) => {
                    const isSelected = uAns.includes(o.id);
                    return {
                        id: o.id,
                        text: `Step ${idx + 1}: ${o.text}`,
                        isCorrect: true,
                        rationale: cleanOpRationale(o.rationale),
                        userSelected: isSelected,
                        userStatus: isSelected ? 'correct' : 'missed'
                    };
                });

            } else if (type === 'hotspot' || question.areas) {
                // 6. HOT SPOT SUPPORT
                const uAns = result?.userAns || [];
                const reviews: any[] = [];
                if (question.areas) {
                    question.areas.forEach((area: any, idx: number) => {
                        const selected = uAns.includes(area.id || `area-${idx}`);
                        const isTarget = area.isCorrect;

                        let status: 'correct' | 'incorrect' | 'missed' | 'skipped' = 'skipped';
                        if (selected && isTarget) status = 'correct';
                        else if (selected && !isTarget) status = 'incorrect';
                        else if (!selected && isTarget) status = 'missed';

                        if (isTarget || selected) {
                            reviews.push({
                                id: area.id || `area-${idx}`,
                                text: area.label || `Target Area ${idx + 1}`,
                                isCorrect: isTarget,
                                rationale: cleanOpRationale(area.rationale),
                                userSelected: selected,
                                userStatus: status
                            });
                        }
                    });
                }
                parsed.optionReviews = reviews;

            } else {
                // 7. DROPDOWN / CLOZE / FALLBACK SUPPORT
                const reviews: any[] = [];
                const dropdowns = question.dropdowns || (question.sentences ? question.sentences.flatMap((s: any) => s.dropdowns || []) : []);
                const uAns = result?.userAns || {};

                if (dropdowns.length > 0) {
                    dropdowns.forEach((dd: any, dIdx: number) => {
                        const correctOpt = dd.options.find((o: any) => o.id === dd.correctOptionId || o.isCorrect);
                        const userVal = uAns[dd.id]; // The selected option ID

                        // Check if user value matches the correct option ID (or key if standardized)
                        const isCorrect = userVal && (userVal === correctOpt?.id || userVal === correctOpt?.key);

                        reviews.push({
                            id: dd.id || `dd-${dIdx}`,
                            text: `Blank ${dIdx + 1}: ${correctOpt?.text || "Correct Answer"}`,
                            isCorrect: true, // Mark row as "representing the correct answer" for visual consistency
                            rationale: cleanOpRationale(correctOpt?.rationale),
                            userSelected: !!userVal,
                            userStatus: isCorrect ? 'correct' : 'incorrect'
                        });
                    });
                    parsed.optionReviews = reviews;
                } else {
                    parsed.optionReviews = [];
                }
            }
        }

        return parsed;

    }, [question]);

    // Helper to extract tags safely
    function extractSection(tag: string, text: string) {
        if (!text || typeof text !== 'string') return null;
        const regex = new RegExp(`\\[${tag}\\](.*?)(?=\\[|$)`, 's');
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    }



    // 4. Clinical Judgment Feedback (Explicit Bullets)
    const cjFeedback = useMemo(() => {
        if (!result) return undefined;
        // Pass result and metadata. timeSpent comes from result if available.
        return generateCJFeedback(
            result,
            question?.content?.metadata || question?.metadata,
            result.timeSpent
        );
    }, [result, question]);

    // 5. Matrix Row Analysis Construction
    const matrixRows = useMemo<MatrixRowAnalysis[] | undefined>(() => {
        // Check types for Matrix
        const type = question?.structure?.type || question?.type;
        const isMatrix = type === 'matrix' || type === 'extended-matrix';

        if (!isMatrix || !question.rows) return undefined;

        // Detect Matrix MR (Multiple Response) - fallback to standard view
        const isMatrixMR = question.rows.some((r: any) => !r.correctColumnId && (r.correctColumnIds || r.correctColumns));
        if (isMatrixMR) return undefined;

        return question.rows.map((r: any) => {
            const userAns = result?.userAns || {}; // { rId: cId }
            const userColId = typeof userAns === 'object' ? userAns[r.id] : undefined;
            const correctColId = r.correctColumnId;

            const correctCol = question.columns?.find((c: any) => c.id === correctColId);
            const userCol = question.columns?.find((c: any) => c.id === userColId);

            // Verdict
            let verdict: 'correct' | 'incorrect' | 'missed' = 'missed';
            if (userColId === correctColId) verdict = 'correct';
            else if (userColId) verdict = 'incorrect';

            // Rationale Parsing
            const raw = r.rationale || "";

            let whyCorrect = "Explanation not provided.";
            let trap = undefined;

            if (typeof raw === 'object') {
                whyCorrect = raw.answerAnalysis || raw.breakdown || JSON.stringify(raw);
                trap = raw.trap;
            } else {
                // Parse string tags: [Breakdown], [Trap]
                const extract = (tag: string) => {
                    const regex = new RegExp(`\\[${tag}\\](.*?)(?=\\[|$)`, 's');
                    const match = raw.match(regex);
                    return match ? match[1].trim() : null;
                };
                whyCorrect = extract('Breakdown') || raw.replace(/Correct:|Incorrect:/g, '') || raw;
                trap = extract('Trap');
            }

            return {
                rowId: r.id,
                findingText: r.text || r.label,
                userBucket: userCol?.label,
                correctBucket: correctCol?.label || "Correct",
                allBuckets: question.columns?.map((c: any) => ({ id: c.id, label: c.label })),
                verdict,
                whyCorrect,
                trap
                // whyOtherBucketsWrong could be added here if we had side-effect details
            };
        });
    }, [question, result]);

    const reviewUnits = useMemo(() => {
        if (!smartRationale) return undefined;
        return buildReviewUnits(question, result?.userAns, result, smartRationale);
    }, [question, result, smartRationale]);

    if (!smartRationale) return null;

    // Construct Outcome Summary
    const scoreVal = result?.score || 0;
    const maxScore = result?.maxScore || 1;

    // Determine status
    let status: 'correct' | 'incorrect' | 'partial' = 'incorrect';
    if (scoreVal === maxScore) status = 'correct';
    else if (scoreVal > 0) status = 'partial';

    const outcome = {
        title: status === 'correct' ? 'Optimal Clinical Decision' : (status === 'partial' ? 'Partial Clinical Decision' : 'Suboptimal Clinical Decision'),
        score: scoreVal,
        maxScore: maxScore,
        status: status
    };

    return (
        <UltimateRationale
            isOpen={isOpen}
            onClose={onClose}
            outcome={outcome}
            cjmmStep={cjmmStep}
            cjFeedback={cjFeedback}
            matrixRows={matrixRows}
            coreConcept={smartRationale.coreConcept || "Clinical Concept"}
            goldenRule={smartRationale.goldenRule}
            caseSummary={smartRationale.caseSummary}
            answerAnalysis={smartRationale.answerAnalysis}
            trap={smartRationale.trap}
            steps={smartRationale.steps}
            mnemonic={smartRationale.mnemonic}
            cheatSheet={smartRationale.cheatSheet}
            optionReviews={smartRationale.optionReviews}
            pitfalls={smartRationale.pitfalls}
            referenceInfo={smartRationale.referenceInfo}
            reviewUnits={reviewUnits}
            metadata={{
                type: question?.type,
                correctValue: question?.correctValue || question?.structure?.correctValue,
                inputLabel: question?.inputLabel || question?.structure?.inputLabel,
                units: question?.units || question?.structure?.units,
                fullItem: question,
                ...question?.metadata,
                ...question?.pedagogy, // Explicitly pass pedagogy (difficultyLevel, clinicalFocus)
                difficultyLevel: question?.pedagogy?.difficultyLevel || question?.metadata?.difficultyLevel // Direct Fallback
            }}
        />
    );
};
