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
    rowId: string;
    findingText: string;
    userBucket?: string;
    correctBucket: string;
    allBuckets?: { id: string; label: string }[];
    verdict: 'correct' | 'incorrect' | 'missed';
    whyCorrect: string;
    whyOtherBucketsWrong?: string[];
    trap?: string;
}

export interface CJFeedback {
    well: string;
    improve: string;
}
