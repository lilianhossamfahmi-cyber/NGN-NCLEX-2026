export interface FullItemData {
    id: string;
    type: string;
    content: {
        prompt?: string;
        metadata?: any;
        clinicalData?: any;
        rationale?: {
            referenceInfo?: {
                anatomy?: string;
                physiology?: string;
                pharm?: string;
            };
            difficulty?: {
                clinicalStrategy?: string;
                recommendedActions?: string[];
            };
            mnemonic?: { title?: string; content?: string; explanation?: string };
            cheatSheet?: { title?: string; points?: string[] };
        };
        structure?: any;
    };
    metadata?: any;
    status?: string;
}

export interface RationaleDrawerProps {
    open: boolean;
    onClose: () => void;
    question?: any;
    fullItem?: FullItemData;
    metadata?: any;
    onNextQuestion?: () => void;
}

export interface RationaleSheetProps {
    question?: any;
    fullItem?: FullItemData;
    rationale?: CanonicalRationale;
    metadata?: any;
    onClose?: () => void;
}

export interface QuestionConfig {
    id?: string;
    type: string;
    content: any;
    metadata?: any;
    rationale?: any;
    cjmmStep?: string;
    correctValue?: any;
    structure?: any;
}

export interface UltimateRationaleProps {
    item?: FullItemData | QuestionConfig;
    referenceInfo?: CanonicalRationale['referenceInfo'];
    difficulty?: CanonicalRationale['difficulty'];
    mnemonic?: CanonicalRationale['mnemonic'];
    cheatSheet?: CanonicalRationale['cheatSheet'];
    strategy?: string;
    itemId?: string;
    activeTab: string;
    onTabChange: (tab: string) => void;
    // Existing props to keep for backward compatibility or internal use during refactor
    isOpen?: boolean;
    onClose?: () => void;
    onNextQuestion?: () => void;
    outcome?: any;
    cjmmStep?: string;
    cjFeedback?: any;
    coreConcept?: string;
    goldenRule?: string;
    caseSummary?: string;
    answerAnalysis?: string;
    trap?: string;
    steps?: any[];
    optionReviews?: any[];
    bowTieReview?: any;
    highlightReview?: any;
    clozeReview?: any;
    orderedReview?: any;
    matrixRows?: any[];
    matrixColumns?: any[];
    pitfalls?: string[];
    formulaMethod?: string;
    dimensionalAnalysis?: string;
    reviewUnits?: any[];
    clinicalStrategy?: string;
    metadata?: any;
}

export interface CanonicalRationale {
    coreConcept?: string;
    caseSummary?: string;
    answerAnalysis?: string;
    outcome?: any;
    referenceInfo?: {
        anatomy?: string;
        physiology?: string;
        pharm?: string;
    };
    difficulty?: {
        level?: number;
        score?: number;
        label?: string;
        subtext?: string;
        clinicalStrategy?: string;
        recommendedActions?: string[];
    };
    mnemonic?: {
        title?: string;
        content?: string;
        explanation?: string;
    };
    cheatSheet?: {
        title?: string;
        points?: string[];
    };
    steps?: any[];
    goldenRule?: string;
    trap?: string;
    optionReviews?: any[];
    bowTieReview?: any;
    highlightReview?: any;
    clozeReview?: any;
    orderedReview?: any;
    matrixRows?: any[];
    matrixColumns?: any[];
    pitfalls?: string[];
    formulaMethod?: string;
    dimensionalAnalysis?: string;
    cjmmStep?: string;
    itemType?: string;
}
