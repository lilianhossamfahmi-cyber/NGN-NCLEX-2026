
export interface GenericRendererProps {
    config: any;
    answers: any;
    setAnswers: (a: any) => void;
    isSubmitted: boolean;
    mode?: 'student' | 'author' | 'review';
}

export type QuestionType =
    | 'matrix'
    | 'cloze'
    | 'highlight'
    | 'bow-tie'
    | 'ordered-response'
    | 'hotspot'
    | 'standard'
    | 'mcq'
    | 'sata'
    | 'unknown';
