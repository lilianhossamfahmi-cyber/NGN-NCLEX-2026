export type NCJMMPhase =
    | 'Recognize Cues'
    | 'Analyze Cues'
    | 'Prioritize Hypotheses'
    | 'Generate Solutions'
    | 'Take Action'
    | 'Evaluate Outcomes';

export interface VitalInfo {
    label: string;
    value: string;
    unit?: string;
    status: 'critical' | 'warning' | 'normal';
    physioExplanation: string;
}

export interface OptionReview {
    id: string;
    text: string;
    isCorrect: boolean;
    rationale: string;
    userSelected?: boolean;
    userStatus?: 'correct' | 'incorrect' | 'missed' | 'skipped';
}

export interface RemediationModel {
    whyCorrect: string;
    prevention: string;
    takeaway: string;
}

export interface OutcomeModel {
    title: string;
    score: number;
    maxScore: number;
    status: 'correct' | 'incorrect' | 'partial';
}

export interface MatrixRowAnalysis {
    id: string;
    text: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    rationale: string;
}

export interface CJFeedback {
    well: string;
    improve: string;
}

export interface HighlightSpan {
    id: string;
    text: string;
    status: 'correct' | 'incorrect' | 'missed' | 'neutral';
    rationale: string;
    whyCorrect?: string;
    whyIncorrect?: string;
    description?: string;
}

export interface HighlightReview {
    originalText: string;
    spans: Record<string, HighlightSpan>;
}

// Drop/Cloze Item Types
export interface ClozeBlankReview {
    id: string;
    position: number;        // Order in sentence (1, 2, 3...)
    beforeText: string;      // Text before this blank
    afterText: string;       // Text after this blank (until next blank or end)
    userAnswer: string;      // What student selected (text)
    userAnswerId: string;    // The option ID student selected
    correctAnswer: string;   // The correct option text
    correctAnswerId: string; // The correct option ID
    isCorrect: boolean;
    allOptions: { id: string; text: string; isCorrect: boolean }[];
    whyCorrect?: string;
    whyIncorrect?: string;
}

export interface ClozeReview {
    originalSentence: string;
    blanks: ClozeBlankReview[];
    score: { earned: number; total: number; percentage: number };
}

export interface OrderedReviewItem {
    id: string;
    text: string;
    rationale: string;
    correctRank: number; // 1-based Correct Index
    userRank: number | null; // 1-based User Index
    isCorrectPosition: boolean;
}

export interface OrderedReview {
    items: OrderedReviewItem[];
}
