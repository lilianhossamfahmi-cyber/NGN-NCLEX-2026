import { QuestionType } from '../components/item-types/renderers/types';

export interface ScoreRuleResult {
    score: number;
    maxScore: number;
    correctCount?: number;
    incorrectCount?: number;
    matches?: number;
    isCorrect: boolean; // 100% correct
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

export interface ClientNeedsDistribution {
    [category: string]: {
        total: number;
        correct: number;
        percentage: number;
    };
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

export interface SessionHistoryItem {
    isCorrect: boolean;
    score?: number;
    maxScore?: number;
    metadata?: AnalyticMetadata;
    timeSpent?: number; // Added time tracking support
}

export const CognitiveAnalyticsEngine = {
    /**
     * core scoring logic based on NGN rules
     */
    calculateScore: (
        type: QuestionType | string,
        userAns: any,
        correctAns: any
    ): ScoreRuleResult => {
        let score = 0;
        let maxScore = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let matches = 0;

        const normalizedType = type.toLowerCase().replace(/_/g, '-');

        // 0. CALCULATION / NUMERIC ENTRY (0/1 Scoring)
        if (normalizedType.includes('calculation') || normalizedType.includes('numeric')) {
            // userAns: string or number (user's numeric input)
            // correctAns: number | { value: number, range?: [min, max] }
            maxScore = 1;
            const userVal = parseFloat(String(userAns));

            if (!isNaN(userVal)) {
                let correctVal: number;
                let acceptableRange: [number, number] | undefined;

                if (typeof correctAns === 'object' && correctAns !== null) {
                    correctVal = parseFloat(correctAns.value);
                    acceptableRange = correctAns.range;
                } else {
                    correctVal = parseFloat(correctAns);
                }

                // EXPERT CLINICAL LOGIC (Fracture Logic): 
                // 1. Exact mathematical match
                const isExact = userVal === correctVal;
                // 2. Clinical Rounding Match (e.g. 41.6 rounds to 42)
                const isRoundedMatch = Math.round(userVal) === Math.round(correctVal);
                // 3. Margin of Error check
                const isClose = Math.abs(userVal - correctVal) <= 0.05;
                // 4. Tenths-level check
                const isTenthsMatch = userVal.toFixed(1) === correctVal.toFixed(1);

                if (acceptableRange && Array.isArray(acceptableRange)) {
                    if (userVal >= acceptableRange[0] && userVal <= acceptableRange[1]) {
                        score = 1;
                    }
                } else if (isExact || isRoundedMatch || isClose || isTenthsMatch) {
                    score = 1;
                }
            }

            return {
                score,
                maxScore,
                isCorrect: score === 1
            };
        }

        // 1. +/- RULE (SATA, Matrix, Highlight)
        // Score = Correct Selections - Incorrect Selections (Min 0)
        if (
            normalizedType.includes('multiple-response') ||
            normalizedType === 'matrix' ||
            normalizedType === 'highlight' ||
            normalizedType === 'sata'
        ) {
            // Normalize inputs to Arrays of IDs for comparison
            // const userIds = Array.isArray(userAns) ? userAns : Object.keys(userAns || {}).filter(k => userAns[k]);
            // For Matrix, userAns might be { r1: c1, r2: c2 } (MC rows) or { r1: { c1: true } } (MR rows)

            if (normalizedType === 'matrix') {
                // Matrix Logic: For each row, did they pick the right column(s)?
                // userAns: { rowId: colId } or { rowId: { colId: true } }
                // correctAns: config object or map? usually passed as simplified map { rowId: colId }

                // Assumption: correctAns is { rowId: correctColId } or similar.
                const rowIds = Object.keys(correctAns || {});
                maxScore = rowIds.length; // Max points usually equal to rows

                rowIds.forEach(rowId => {
                    const userVal = userAns?.[rowId];
                    const correctVal = correctAns?.[rowId];
                    // Check match
                    if (userVal === correctVal) {
                        score++;
                        correctCount++;
                    } else {
                        // If they selected something but wrong
                        if (userVal) {
                            // NGN Matrix (Single Choice Rows) is 0/1 per row. No penalty.
                            // Only "Multiple Response Grouping" has penalties.
                            // Since we detect scalar values here, assume Single Choice.
                            // score--; // REMOVED PENALTY
                            incorrectCount++;
                        }
                    }
                });
            } else {
                // SATA / Highlight
                const userIds = Array.isArray(userAns) ? userAns : Object.keys(userAns || {}).filter(k => userAns[k]);
                const userSet = new Set(userIds);
                const correctSet = new Set(Array.isArray(correctAns) ? correctAns : []);

                maxScore = correctSet.size;

                userSet.forEach(id => {
                    if (correctSet.has(id)) {
                        score++;
                        correctCount++;
                    } else {
                        score--;
                        incorrectCount++;
                    }
                });
            }

            if (score < 0) score = 0; // Floor at 0

            return {
                score,
                maxScore,
                correctCount,
                incorrectCount,
                isCorrect: score === maxScore
            };
        }

        // 2. RATIONALE RULE (Cloze / Drop-Cloze)
        // All-or-nothing (per sentence/group? or total item?)
        // User requested: "Rationale Rule (Cloze): Returns { score: 1 | 0 } (All-or-nothing for linked slots)"
        if (normalizedType.includes('cloze')) {
            // userAns: { blank1: opt1, blank2: opt2 }
            // correctAns: { blank1: correct1, blank2: correct2 }
            const keys = Object.keys(correctAns || {});
            maxScore = keys.length;

            keys.forEach(k => {
                const uVal = userAns?.[k];
                const cVal = correctAns?.[k];

                // 1. Exact Match
                if (uVal === cVal) {
                    score++;
                    matches++;
                }
                // 2. Fuzzy/Splitted Match (e.g. "opt-1" vs "renal" cannot be solved here without config)
                // We assume caller provided canonical values.
                // However, for pure string equality (ignoring case/spaces), we can try:
                else if (typeof uVal === 'string' && typeof cVal === 'string' &&
                    uVal.toLowerCase().trim() === cVal.toLowerCase().trim()) {
                    score++;
                    matches++;
                }
                else {
                    incorrectCount++;
                }
            });

            // Zero-tolerance validation check:
            // If any blank is wrong, isCorrect must be false.
            // isCorrect is used for "100%" badge usually.

            return {
                score,
                maxScore,
                matches,
                isCorrect: score === maxScore && maxScore > 0
            };
        }

        // 2b. ORDERED RESPONSE (Strict Sequence)
        if (normalizedType.includes('ordered-response')) {
            const correctArr = Array.isArray(correctAns) ? correctAns : [];
            const userArr = Array.isArray(userAns) ? userAns : [];
            maxScore = 1; // 0/1 Scoring Rule for Ordered Response is typical

            // Check exact sequence match
            let isExact = correctArr.length === userArr.length && correctArr.length > 0;
            if (isExact) {
                for (let i = 0; i < correctArr.length; i++) {
                    if (correctArr[i] !== userArr[i]) {
                        isExact = false;
                        break;
                    }
                }
            }

            score = isExact ? 1 : 0;
            return {
                score,
                maxScore,
                matches: score,
                isCorrect: isExact
            };
        }

        // 3. 0/1 RULE (BowTie, MCQ, Single Choice, HotSpot)
        // Score = Matches (Accumulation of points, usually 1 per correct component)
        // For Single Choice, Max=1. For Bowtie, Max=5.
        {
            // Generic Match Logic
            // BowTie: { actions: [], conditions: [], parameters: [] }
            // MCQ: "id"

            if (typeof correctAns === 'string') {
                // Single Choice
                maxScore = 1;
                if (userAns === correctAns) {
                    score = 1;
                    matches = 1;
                }
            } else if (typeof correctAns === 'object' && correctAns !== null) {
                // BowTie or complex object
                // Flatten values to arrays and compare
                const correctValues = Object.values(correctAns).flat();
                const userValues = Object.values(userAns || {}).flat();

                maxScore = correctValues.length;

                // Simple intersection count
                const userSet = new Set(userValues);
                correctValues.forEach((val: any) => {
                    if (userSet.has(val)) {
                        score++;
                        matches++;
                    }
                });
            }

            return {
                score,
                maxScore,
                matches,
                isCorrect: score === maxScore
            };
        }
    },

    /**
     * Diagnostic logic to tag user performance
     */
    analyzeError: (
        result: ScoreRuleResult,
        timeSpentSeconds: number,
        metadata: AnalyticMetadata
    ): ErrorTag => {
        const peerAvg = Number(metadata.peerAverageTime) || 60; // Default 60s

        // 1. Rushing Warning
        if (timeSpentSeconds < (peerAvg * 0.2)) {
            return 'Rushing Warning';
        }

        // 2. Over-Thinking
        if (timeSpentSeconds > (peerAvg * 2.0)) {
            return 'Over-Thinking';
        }

        // 3. Knowledge Gap (0 Score)
        if (result.score === 0) {
            return 'Knowledge Gap';
        }

        // 4. Precision Error (SATA mainly)
        // Selected Correct items > 0, BUT also selected distractors > 1 (or >0?)
        // User requested: "selected >0 correct but >1 distractors"
        if (
            (result.correctCount || 0) > 0 &&
            (result.incorrectCount || 0) > 0
        ) {
            return 'Precision Error';
        }

        return 'None';
    },

    /**
     * Calculates Correct % per Client Needs Category
     * @deprecated use getClientNeedsStats for dashboard
     */
    updateDistribution: (history: { isCorrect: boolean; metadata?: AnalyticMetadata }[]): ClientNeedsDistribution => {
        const dist: ClientNeedsDistribution = {};

        history.forEach(item => {
            const cat = item.metadata?.clientNeeds || 'Uncategorized';

            if (!dist[cat]) {
                dist[cat] = { total: 0, correct: 0, percentage: 0 };
            }

            dist[cat].total++;
            if (item.isCorrect) {
                dist[cat].correct++;
            }
        });

        // Calc Percentages
        Object.keys(dist).forEach(key => {
            const d = dist[key];
            d.percentage = Math.round((d.correct / d.total) * 100);
        });

        return dist;
    },

    // --- NEW DASHBOARD AGGREGATORS ---

    /**
     * 1. Pass Probability (Gauge)
     * Formula: (Avg Accuracy * 0.6) + (Hard Accuracy * 0.4)
     */
    calculatePassProbability: (history: SessionHistoryItem[]): PassProbabilityMetric => {
        if (history.length === 0) return { value: 0, label: 'Insufficient Data', color: '#94a3b8' };

        // 1. Average Accuracy
        // Using raw accuracy (Total Score / Total Max) if available, otherwise fallback to isCorrect count
        let totalScore = 0;
        let totalMax = 0;

        history.forEach(h => {
            if (h.maxScore && h.maxScore > 0) {
                totalScore += (h.score || 0);
                totalMax += h.maxScore;
            } else {
                totalScore += h.isCorrect ? 1 : 0;
                totalMax += 1;
            }
        });

        const avgAccuracy = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

        // 2. Hard Accuracy
        const hardItems = history.filter(h => h.metadata?.difficulty === 'Hard');
        let hardScore = 0;
        let hardMax = 0;

        hardItems.forEach(h => {
            if (h.maxScore && h.maxScore > 0) {
                hardScore += (h.score || 0);
                hardMax += h.maxScore;
            } else {
                hardScore += h.isCorrect ? 1 : 0;
                hardMax += 1;
            }
        });

        const hardAccuracy = hardMax > 0 ? (hardScore / hardMax) * 100 : (avgAccuracy * 0.8); // Fallback if no hard items

        // 3. Formula
        const probability = Math.round((avgAccuracy * 0.6) + (hardAccuracy * 0.4));

        let label = 'Low Probability';
        let color = '#ef4444'; // Red

        if (probability >= 75) {
            label = 'High Probability';
            color = '#10b981'; // Green
        } else if (probability >= 50) {
            label = 'Borderline';
            color = '#f59e0b'; // Amber
        }

        return { value: probability, label, color };
    },

    /**
     * 2. Client Needs Distribution (Bar Graphs)
     * Sorted array with Status flags
     */
    getClientNeedsStats: (history: SessionHistoryItem[]): ClientNeedStat[] => {
        const map: Record<string, { score: number, max: number }> = {};

        history.forEach(h => {
            const cat = h.metadata?.clientNeeds || 'General';
            if (!map[cat]) map[cat] = { score: 0, max: 0 };

            // Add scores
            if (h.maxScore && h.maxScore > 0) {
                map[cat].score += (h.score || 0);
                map[cat].max += h.maxScore;
            } else {
                map[cat].score += h.isCorrect ? 1 : 0;
                map[cat].max += 1;
            }
        });

        const stats: ClientNeedStat[] = Object.entries(map).map(([category, data]) => {
            const pct = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
            let status: ClientNeedStat['status'] = 'Critical';
            if (pct >= 80) status = 'Safe';
            else if (pct >= 60) status = 'Monitor';

            return { category, score: pct, status };
        });

        // Sort by performance (lowest first to highlight needs)
        return stats.sort((a, b) => a.score - b.score);
    },

    /**
     * 3. CJMM Grid (Heatmap)
     * 6 Steps with Weakness Flag
     */
    getCJMMGrid: (history: SessionHistoryItem[]): CJMMMetric[] => {
        const steps = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];
        const map: Record<string, { score: number, max: number }> = {};

        // Initialize all steps
        steps.forEach(s => map[s] = { score: 0, max: 0 });

        history.forEach(h => {
            // Enhanced Fuzzy match step name (Zero Error Fill)
            const step = h.metadata?.cjmmStep || '';
            const stepLower = step.toLowerCase();

            let matchedStep = 'Recognize Cues'; // Default fallback

            if (stepLower.includes('recognize') || stepLower.includes('cue') || stepLower.includes('identify')) {
                matchedStep = 'Recognize Cues';
            } else if (stepLower.includes('analyze') || stepLower.includes('analysis') || stepLower.includes('interpret')) {
                matchedStep = 'Analyze Cues';
            } else if (stepLower.includes('priorit') || stepLower.includes('hypothes') || stepLower.includes('rank')) {
                matchedStep = 'Prioritize Hypotheses';
            } else if (stepLower.includes('generat') || stepLower.includes('solution') || stepLower.includes('plan')) {
                matchedStep = 'Generate Solutions';
            } else if (stepLower.includes('take') || stepLower.includes('action') || stepLower.includes('implement')) {
                matchedStep = 'Take Action';
            } else if (stepLower.includes('evaluat') || stepLower.includes('outcome') || stepLower.includes('assess')) {
                matchedStep = 'Evaluate Outcomes';
            }

            if (map[matchedStep]) {
                if (h.maxScore && h.maxScore > 0) {
                    map[matchedStep].score += (h.score || 0);
                    map[matchedStep].max += h.maxScore;
                } else {
                    map[matchedStep].score += h.isCorrect ? 1 : 0;
                    map[matchedStep].max += 1;
                }
            }
        });

        const metrics: CJMMMetric[] = steps.map(step => {
            const data = map[step];
            const score = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
            return { step, score, isWeakness: false };
        });

        // Find lowest non-zero score to flag as weakness? Or just lowest absolute?
        // Usually weakness is the lowest score.
        const minScore = Math.min(...metrics.map(m => m.score));
        const weakness = metrics.find(m => m.score === minScore);
        if (weakness) weakness.isWeakness = true;

        return metrics;
    },

    /**
     * 4. Time Management / Pace Analysis
     */
    calculatePaceMetrics: (history: SessionHistoryItem[]): TimeMetric => {
        if (history.length === 0) return { userAvg: 0, peerAvg: 60, diff: 0, status: 'Optimal Pace', isSlower: false };

        let totalUserTime = 0;
        let totalPeerTime = 0;
        let validItems = 0;

        history.forEach(h => {
            if (h.timeSpent !== undefined) {
                totalUserTime += h.timeSpent;
                totalPeerTime += (Number(h.metadata?.peerAverageTime) || 60);
                validItems++;
            }
        });

        if (validItems === 0) return { userAvg: 0, peerAvg: 60, diff: 0, status: 'Optimal Pace', isSlower: false };

        const userAvg = Math.round(totalUserTime / validItems);
        const peerAvg = Math.round(totalPeerTime / validItems);
        const diff = userAvg - peerAvg;

        let status = 'Optimal Pace';
        if (diff < -10) status = 'Fast (Risk of Missed Cues)';
        else if (diff > 20) status = 'Time Drag (Risk of Timeout)';

        return {
            userAvg,
            peerAvg,
            diff,
            status,
            isSlower: diff > 0
        };
    }
};
