import { QuestionType } from '../components/item-types/renderers/types';

export interface ScoreRuleResult {
    score: number;
    maxScore: number;
    correctCount?: number;
    incorrectCount?: number;
    matches?: number;
    isCorrect: boolean; // 100% correct
    rule?: string; // e.g. "0/1", "+/-", "Rationale"
    explanation?: string; // WHY the score was given
    breakdown?: Record<string, boolean>; // Partial validation used for explanations
}

export type ErrorTag =
    | 'Precision Error'
    | 'Knowledge Gap'
    | 'Rushing Warning'
    | 'Over-Thinking'
    | 'None';

export interface AnalyticMetadata {
    clientNeeds: string;
    clientNeedsSub?: string;
    cjmmStep?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    peerAverageTime?: string | number; // Seconds
}

export interface SessionHistoryItem {
    isCorrect: boolean;
    score?: number;
    maxScore?: number;
    metadata?: AnalyticMetadata;
    timeSpent?: number;
    type?: string; // Added for CJMM Inference in Tier 3
}

// New Interfaces for Dashboard
export interface PassProbabilityMetric {
    value: number;
    label: string;
    color: string;
}

export interface ClientNeedStat {
    category: string;
    score: number;
    status: 'Critical' | 'Monitor' | 'Safe';
}

export interface CJMMMetric {
    step: string;
    score: number;
    isWeakness: boolean;
}

export interface TimeMetric {
    userAvg: number;
    peerAvg: number;
    diff: number;
    status: string;
    isSlower: boolean;
}

// MEMOIZATION CACHE
const scoreCache = new Map<string, ScoreRuleResult>();

/**
 * HELPER: Infer CJMM Step from Item Type (Tier 3 Fix for properties missing metadata)
 */
function inferCJMMStep(metadata: AnalyticMetadata | undefined, itemType?: string): string {
    if (metadata?.cjmmStep) return metadata.cjmmStep;

    // Heuristic FALLBACK based on Item Type
    const type = (itemType || '').toLowerCase();

    if (type.includes('highlight') || type.includes('trend')) return 'Recognize Cues';
    if (type.includes('matrix')) return 'Analyze Cues';
    if (type.includes('ordered')) return 'Take Action';
    if (type.includes('bow-tie')) return 'Generate Solutions';
    if (type.includes('cloze')) return 'Generate Solutions';
    if (type.includes('calculation')) return 'Take Action';
    if (type.includes('sata') || type.includes('multiple')) return 'Prioritize Hypotheses';

    return 'Recognize Cues'; // Default fallback
}

export const CognitiveAnalyticsEngine = {
    /**
     * CORE SCORING LOGIC - NCLEX-NGN 2024 STANDARDS
     * Optimized for performance (O(1) lookups)
     */
    calculateScore: (
        type: QuestionType | string,
        userAns: any,
        correctAns: any
    ): ScoreRuleResult => {
        // Cache Key Generation (Fast)
        const cacheKey = `${type}:${JSON.stringify(userAns)}:${JSON.stringify(correctAns)}`;
        if (scoreCache.has(cacheKey)) {
            return scoreCache.get(cacheKey)!;
        }

        if (!type) {
            return {
                score: 0,
                maxScore: 1,
                isCorrect: false,
                rule: 'Invalid Type',
                explanation: 'Question type missing.'
            };
        }

        const normalizedType = type.toLowerCase().replace(/_/g, '-');
        let result: ScoreRuleResult = {
            score: 0,
            maxScore: 1,
            isCorrect: false,
            rule: 'Unknown'
        };

        try {
            if (normalizedType.includes('calculation') || normalizedType.includes('numeric')) {
                result = scoreCalculation(userAns, correctAns);
            } else if (normalizedType === 'bow-tie') {
                result = scoreBowTie(userAns, correctAns);
            } else if (normalizedType === 'matrix') {
                result = scoreMatrix(userAns, correctAns);
            } else if (normalizedType === 'highlight') {
                result = scoreHighlight(userAns, correctAns);
            } else if (normalizedType.includes('cloze') || normalizedType === 'dropdown' || normalizedType === 'drop-cloze') {
                result = scoreDropCloze(userAns, correctAns);
            } else if (normalizedType.includes('ordered-response')) {
                result = scoreOrderedResponse(userAns, correctAns);
            } else if (normalizedType.includes('multiple-response') || normalizedType === 'sata') {
                result = scoreMultipleResponse(userAns, correctAns);
            } else {
                // Default Single Choice / Fallback
                result = scoreGeneric01(userAns, correctAns);
            }
        } catch (e) {
            console.error("Scoring Error:", e);
            result = { ...result, explanation: "Scoring engine error occurred." };
        }

        // Cache Result
        scoreCache.set(cacheKey, result);
        return result;
    },

    /**
     * G. CASE STUDY SCORING (Average of 6 Screens)
     */
    scoreCaseStudy: (userAnswers: any[], correctAnswers: any[]): number => {
        if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers) || correctAnswers.length === 0) {
            return 0;
        }

        let totalScore = 0;
        for (let i = 0; i < correctAnswers.length; i++) {
            const correctQ = correctAnswers[i]; // Full Question Object
            const userAns = userAnswers[i];

            if (correctQ && correctQ.type) {
                // PREPARE CORRECT ANSWER PAYLOAD (Extraction Logic)
                let payload: any = correctQ;
                const type = correctQ.type.toLowerCase().replace(/_/g, '-');

                // Standard Extraction Strategy matching StudentPreviewModal
                if (type === 'highlight') {
                    payload = correctQ.correct || correctQ.correctIds || []; // Handle synonyms
                } else if (type === 'matrix') {
                    payload = {};
                    // [LOG-01 Fix] Extract plural correctColumnIds if present, otherwise singular
                    const rows = correctQ.rows || correctQ.structure?.rows || [];
                    if (Array.isArray(rows)) {
                        rows.forEach((r: any) => {
                            // Normalize to string[]
                            const correctRaw = r.correctColumnIds || (r.correctColumnId ? [r.correctColumnId] : []) || (r.correctAnswer ? [r.correctAnswer] : []);
                            payload[r.id] = correctRaw;
                        });
                    }
                } else if (type === 'bow-tie') {
                    // Normalize to pool arrays
                    payload = {
                        actions: correctQ.actions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || correctQ.actions?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                        conditions: correctQ.conditions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || correctQ.conditions?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                        parameters: correctQ.parameters?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || correctQ.parameters?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || []
                    };
                } else if (type.includes('cloze') || type === 'dropdown' || type === 'drop-cloze') {
                    payload = {};
                    if (correctQ.dropdowns) correctQ.dropdowns.forEach((d: any) => { if (d.correctOptionId) payload[d.id] = d.correctOptionId; });
                    if (correctQ.sentences) correctQ.sentences.forEach((s: any) => s.dropdowns?.forEach((d: any) => { if (d.correctOptionId) payload[d.id] = d.correctOptionId; }));
                } else if (type.includes('multiple') || type === 'sata') {
                    payload = correctQ.options?.filter((o: any) => o.isCorrect).map((o: any) => o.id) || [];
                } else if (type.includes('ordered')) {
                    payload = correctQ.orderedOptions?.map((o: any) => o.id) || correctQ.options?.map((o: any) => o.id);
                } else if (type.includes('calculation') || type.includes('numeric')) {
                    payload = { value: correctQ.correctValue || correctQ.answer, range: correctQ.acceptableRange };
                }

                const result = CognitiveAnalyticsEngine.calculateScore(correctQ.type, userAns, payload);
                totalScore += result.score;
            }
        }

        return totalScore / correctAnswers.length;
    },

    analyzeError: (
        result: ScoreRuleResult,
        timeSpentSeconds: number,
        metadata: AnalyticMetadata
    ): ErrorTag => {
        const peerAvg = Number(metadata.peerAverageTime) || 60;

        if (timeSpentSeconds < (peerAvg * 0.2)) return 'Rushing Warning';
        if (timeSpentSeconds > (peerAvg * 2.0)) return 'Over-Thinking';
        if (result.score === 0) return 'Knowledge Gap';

        if ((result.correctCount || 0) > 0 && (result.incorrectCount || 0) > 0) {
            return 'Precision Error';
        }

        return 'None';
    },

    calculatePassProbability: (history: SessionHistoryItem[]): PassProbabilityMetric => {
        // PHASE 4 FIX: Show realistic baseline instead of 0 when no data
        if (history.length === 0) {
            // Return a "pending" state with average baseline probability
            return {
                value: 65,
                label: 'Baseline Estimate',
                color: '#f59e0b' // Amber for "needs more data"
            };
        }

        let totalScore = 0;
        let totalMax = 0;
        let weightedScore = 0;
        let weightedMax = 0;

        history.forEach(h => {
            const score = h.score || 0;
            const maxScore = h.maxScore || 1;

            totalScore += score;
            totalMax += maxScore;

            // Apply difficulty weighting (harder items matter more)
            const difficultyLevel = h.metadata?.difficultyLevel || h.metadata?.difficulty || 3;
            const weight = typeof difficultyLevel === 'number' ? difficultyLevel :
                (difficultyLevel === 'Expert' ? 5 : difficultyLevel === 'Hard' ? 4 : difficultyLevel === 'Medium' ? 3 : 2);

            weightedScore += score * weight;
            weightedMax += maxScore * weight;
        });

        const avgAccuracy = totalMax > 0 ? (totalScore / totalMax) * 100 : 65;
        const weightedAccuracy = weightedMax > 0 ? (weightedScore / weightedMax) * 100 : avgAccuracy;

        // Bayesian-style formula: Blend weighted accuracy with prior (baseline 65%)
        // As more items are answered, weight shifts more toward actual performance
        const confidenceWeight = Math.min(history.length / 10, 1); // Max confidence at 10+ items
        const prior = 65; // Average NCLEX pass probability

        const probability = Math.round(
            (prior * (1 - confidenceWeight)) + (weightedAccuracy * confidenceWeight)
        );

        // Determine label and color based on probability
        let label = 'Low Probability';
        let color = '#ef4444'; // Red
        if (probability >= 80) { label = 'High Probability'; color = '#10b981'; } // Green
        else if (probability >= 65) { label = 'Passing Zone'; color = '#22c55e'; } // Light green
        else if (probability >= 50) { label = 'Borderline'; color = '#f59e0b'; } // Amber

        return { value: probability, label, color };
    },

    getClientNeedsStats: (history: SessionHistoryItem[]): ClientNeedStat[] => {
        const map: Record<string, { score: number, max: number }> = {};
        history.forEach(h => {
            let cat = h.metadata?.clientNeeds || 'General';
            if (cat === 'General') {
                const content = JSON.stringify(h).toLowerCase();
                if (content.includes('safety') || content.includes('infection')) {
                    cat = 'Safe and Effective Care Environment: Safety and Infection Control';
                }
            }
            if (!map[cat]) map[cat] = { score: 0, max: 0 };
            map[cat].score += (h.score || 0);
            map[cat].max += (h.maxScore || 1);
        });

        return Object.entries(map).map(([category, data]) => {
            const pct = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
            let status: ClientNeedStat['status'] = 'Critical';
            if (pct >= 80) status = 'Safe';
            else if (pct >= 60) status = 'Monitor';
            return { category, score: pct, status };
        }).sort((a, b) => a.score - b.score);
    },

    getCJMMGrid: (history: SessionHistoryItem[]): CJMMMetric[] => {
        const steps = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];
        const map: Record<string, { score: number, max: number }> = {};
        steps.forEach(s => map[s] = { score: 0, max: 0 });

        history.forEach(h => {
            // [LOG-03 Fix] Use Inference if metadata is missing
            let step = inferCJMMStep(h.metadata, h.type);

            if (!map[step]) {
                const sl = step.toLowerCase();
                if (sl.includes('recognize')) step = steps[0];
                else if (sl.includes('analyze')) step = steps[1];
                else if (sl.includes('prioritize')) step = steps[2];
                else if (sl.includes('generate')) step = steps[3];
                else if (sl.includes('take')) step = steps[4];
                else if (sl.includes('evaluate')) step = steps[5];
            }

            if (map[step]) {
                map[step].score += (h.score || 0);
                map[step].max += (h.maxScore || 1);
            }
        });

        const metrics = steps.map(step => {
            const data = map[step];
            const score = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
            return { step, score, isWeakness: false };
        });

        const minScore = Math.min(...metrics.map(m => m.score));
        const weakness = metrics.find(m => m.score === minScore);
        if (weakness) weakness.isWeakness = true;

        return metrics;
    },

    calculatePaceMetrics: (history: SessionHistoryItem[]): TimeMetric => {
        if (history.length === 0) return { userAvg: 0, peerAvg: 60, diff: 0, status: 'Optimal Pace', isSlower: false };
        let totalUserKey = 0;
        let totalPeerKey = 0;
        let count = 0;

        history.forEach(h => {
            if (h.timeSpent !== undefined) {
                totalUserKey += h.timeSpent;
                totalPeerKey += (Number(h.metadata?.peerAverageTime) || 60);
                count++;
            }
        });

        if (count === 0) return { userAvg: 0, peerAvg: 60, diff: 0, status: 'Optimal Pace', isSlower: false };

        const userAvg = Math.round(totalUserKey / count);
        const peerAvg = Math.round(totalPeerKey / count);
        const diff = userAvg - peerAvg;

        let status = 'Optimal Pace';
        if (diff < -10) status = 'Fast (Risk of Missed Cues)';
        else if (diff > 20) status = 'Time Drag (Risk of Timeout)';

        return { userAvg, peerAvg, diff, status, isSlower: diff > 0 };
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDistribution: (_history: any[]) => ({}) // Deprecated stub
};

/**
 * UTILITY FUNCTIONS
 */
function arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setsEqual(a: Set<any>, b: Set<any>): boolean {
    if (a.size !== b.size) return false;
    for (const item of a) {
        if (!b.has(item)) return false;
    }
    return true;
}

/**
 * SCORING RULES
 */

function scoreBowTie(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    // Safety: If no user answer yet (preview mode), return 0
    if (!userAnswer || typeof userAnswer !== 'object') {
        return { score: 0, maxScore: 3, isCorrect: false };
    }

    // Normalization: Support 'conditions' vs 'condition' key alias
    const correctC = Array.isArray(correctAnswer.conditions || correctAnswer.condition) ? (correctAnswer.conditions || correctAnswer.condition) : [];
    const userC = Array.isArray(userAnswer.conditions || userAnswer.condition) ? (userAnswer.conditions || userAnswer.condition) : [];

    const correct = {
        actions: Array.isArray(correctAnswer.actions) ? [...correctAnswer.actions].sort() : [],
        conditions: [...correctC].sort(),
        parameters: Array.isArray(correctAnswer.parameters) ? [...correctAnswer.parameters].sort() : []
    };
    const user = {
        actions: Array.isArray(userAnswer.actions) ? [...userAnswer.actions].sort() : [],
        conditions: [...userC].sort(),
        parameters: Array.isArray(userAnswer.parameters) ? [...userAnswer.parameters].sort() : []
    };

    const actionsCorrect = arraysEqual(user.actions, correct.actions);
    const conditionsCorrect = arraysEqual(user.conditions, correct.conditions);
    const parametersCorrect = arraysEqual(user.parameters, correct.parameters);

    const isAllCorrect = actionsCorrect && conditionsCorrect && parametersCorrect;
    const score = isAllCorrect ? 1 : 0;

    return {
        score,
        maxScore: 1,
        isCorrect: isAllCorrect,
        rule: 'Bow-Tie (Strict 0/1)',
        explanation: isAllCorrect
            ? "Perfect Match: Actions, Conditions, and Parameters aligned."
            : `Missed components: Actions(${actionsCorrect ? '✓' : '✗'}), Conditions(${conditionsCorrect ? '✓' : '✗'}), Parameters(${parametersCorrect ? '✓' : '✗'})`
    };
}

// [LOG-01/02] Refactored Matrix Scoring
function scoreMatrix(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    // correctAnswer is typically extracted as { rowId: [colId] } or { rowId: [colId1, colId2] }
    // userAnswer comes from Renderer as { rowId: colId } (Radio) or { rowId: { colId: true } } (Checkbox)

    const rowIds = Object.keys(correctAnswer || {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maxScore = rowIds.length;
    let totalScore = 0;
    let correctCount = 0;

    rowIds.forEach(rowId => {
        const correctCols = Array.isArray(correctAnswer[rowId]) ? correctAnswer[rowId] : [correctAnswer[rowId]];
        const userRowVal = userAnswer?.[rowId];

        let userSelected: string[] = [];

        // Normalize user Answer to string[]
        if (typeof userRowVal === 'object' && userRowVal !== null && !Array.isArray(userRowVal)) {
            // Checkbox Object: { c1: true, c2: false }
            userSelected = Object.keys(userRowVal).filter(k => userRowVal[k]);
        } else if (Array.isArray(userRowVal)) {
            userSelected = userRowVal;
        } else if (userRowVal) {
            // Single String (Radio)
            userSelected = [String(userRowVal)];
        }

        // SCORING LOGIC PER ROW
        // If row is Multi-Select (Correct has >1 item OR Rule implies +/-): Use +/- Rule
        // If row is Single-Select (Correct has 1 item and user selected 1): Use 0/1 Rule
        // The instruction says "Replace... with NGN +/- Rule". 
        // We will apply +/- rule globally as it degrades to 0/1 for single-choice typically (1 correct, 0 incorrect selections)

        let rowScore = 0;
        userSelected.forEach(sel => {
            if (correctCols.includes(sel)) rowScore++; // +1 for Correct Selection
            else rowScore--; // -1 for Incorrect Selection
        });

        // Floor at 0
        if (rowScore < 0) rowScore = 0;

        totalScore += rowScore;
        if (rowScore > 0) correctCount++;
    });

    // Determine correctness (did they get full points?)
    // Calculate Max Possible Points (Sum of correct options count)
    let maxPossiblePoints = 0;
    rowIds.forEach(rid => {
        const correctRaw = correctAnswer[rid];
        const count = Array.isArray(correctRaw) ? correctRaw.length : 1;
        maxPossiblePoints += count;
    });

    const normalizedScore = maxPossiblePoints > 0 ? (totalScore / maxPossiblePoints) : 0;

    return {
        score: normalizedScore,
        maxScore: 1, // Normalized max
        correctCount,
        isCorrect: normalizedScore === 1,
        rule: 'Matrix (+/- Scoring)',
        explanation: `Score: ${totalScore}/${maxPossiblePoints} (Normalized: ${normalizedScore.toFixed(2)})`
    };
}

// [LOG-02] SATA / Highlight +/- Scoring
function scoreHighlight(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    return scorePlusMinusRule(userAnswer, correctAnswer, 'Highlight');
}

function scoreMultipleResponse(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    return scorePlusMinusRule(userAnswer, correctAnswer, 'Multiple Response');
}

/**
 * Generic +/- Scoring Rule Implementation
 * @param userAnswer Array of selected IDs or Object { id: true }
 * @param correctAnswer Array of correct IDs
 */
function scorePlusMinusRule(userAnswer: any, correctAnswer: any, typeLabel: string): ScoreRuleResult {
    // Normalize User Answer
    let userArr: string[] = [];
    if (Array.isArray(userAnswer)) userArr = userAnswer;
    else if (typeof userAnswer === 'object' && userAnswer) userArr = Object.keys(userAnswer).filter(k => userAnswer[k]);

    // Normalize Correct Answer
    const correctArr: string[] = Array.isArray(correctAnswer) ? correctAnswer : [];
    const correctSet = new Set(correctArr);

    let rawScore = 0;
    let correctSelections = 0;
    let incorrectSelections = 0;

    userArr.forEach(sel => {
        if (correctSet.has(sel)) {
            rawScore++;
            correctSelections++;
        } else {
            rawScore--;
            incorrectSelections++;
        }
    });

    if (rawScore < 0) rawScore = 0;

    const maxPossible = correctArr.length;
    // Normalize 0-1
    const normalizedScore = maxPossible > 0 ? (rawScore / maxPossible) : 0;

    return {
        score: normalizedScore,
        maxScore: 1,
        correctCount: correctSelections,
        incorrectCount: incorrectSelections,
        isCorrect: normalizedScore === 1,
        rule: `${typeLabel} (+/- Rule)`,
        explanation: `Selected ${correctSelections} correct, ${incorrectSelections} incorrect. Net: ${rawScore}/${maxPossible}.`
    };
}

function scoreDropCloze(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    const keys = Object.keys(correctAnswer || {});
    let allCorrect = true;

    for (const k of keys) {
        if (userAnswer?.[k] !== correctAnswer?.[k]) {
            allCorrect = false;
            break;
        }
    }

    return {
        score: allCorrect ? 1 : 0,
        maxScore: 1,
        isCorrect: allCorrect,
        rule: 'Cloze (Strict 0/1)',
        explanation: allCorrect ? "All dropdowns correct." : "One or more dropdown selections incorrect."
    };
}

function scoreCalculation(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    const userVal = parseFloat(String(userAnswer));
    if (isNaN(userVal)) {
        return { score: 0, maxScore: 1, isCorrect: false, rule: 'Calculation', explanation: "Invalid numeric input." };
    }

    let min: number, max: number;

    if (typeof correctAnswer === 'object' && correctAnswer !== null && correctAnswer.range) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const target = parseFloat(correctAnswer.value);
        min = parseFloat(correctAnswer.range[0]);
        max = parseFloat(correctAnswer.range[1]);
    } else {
        const target = parseFloat(typeof correctAnswer === 'object' ? correctAnswer.value : correctAnswer);
        const tolerance = Math.abs(target * 0.02);
        min = target - tolerance;
        max = target + tolerance;
    }

    const inRange = userVal >= min && userVal <= max;

    return {
        score: inRange ? 1 : 0,
        maxScore: 1,
        isCorrect: inRange,
        rule: 'Calculation (Range/Tolerance)',
        explanation: inRange
            ? `Value ${userVal} is within acceptable range.` // Simplified message
            : `Value ${userVal} outside acceptable range.`
    };
}

function scoreOrderedResponse(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    const userArr = Array.isArray(userAnswer) ? userAnswer : [];
    const correctArr = Array.isArray(correctAnswer) ? correctAnswer : [];

    if (userArr.length !== correctArr.length) {
        return { score: 0, maxScore: 1, isCorrect: false, rule: 'Ordered Response', explanation: "Incorrect number of items." };
    }

    let isExact = true;
    for (let i = 0; i < correctArr.length; i++) {
        if (userArr[i] !== correctArr[i]) {
            isExact = false;
            break;
        }
    }

    return {
        score: isExact ? 1 : 0,
        maxScore: 1,
        isCorrect: isExact,
        rule: 'Ordered Response (Strict)',
        explanation: isExact ? "Sequence matches exactly." : "Incorrect sequence order."
    };
}

function scoreGeneric01(userAnswer: any, correctAnswer: any): ScoreRuleResult {
    const isCorrect = String(userAnswer) === String(correctAnswer);
    return {
        score: isCorrect ? 1 : 0,
        maxScore: 1,
        isCorrect,
        rule: 'Single Choice',
        explanation: isCorrect ? "Correct answer." : "Incorrect answer."
    };
}
