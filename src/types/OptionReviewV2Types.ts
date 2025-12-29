export type ReviewUnitStatus =
    | 'SELECTED_CORRECT'
    | 'SELECTED_INCORRECT'
    | 'MISSED_CORRECT'
    | 'NOT_SELECTED_INCORRECT';

export interface ReviewUnit {
    id: string;
    itemType: string;              // matrix, cloze, highlight, etc.
    sequence: number;              // as shown in the item
    label: string;                 // e.g., "A", "Row 3", "Blank 1"
    promptText?: string;           // optional short context (e.g. "Row text" for matrix)
    optionText: string;            // the visible text for review
    keyIsCorrect: boolean;         // true if this unit is part of the correct key
    userSelected: boolean;         // did user pick/select it?
    status: ReviewUnitStatus;      // computed from keyIsCorrect + userSelected
    whyCorrect?: string;           // 1–2 lines
    whyIncorrect?: string;         // 1–2 lines
    whatWouldMakeItCorrect?: string; // optional 1 line
    commonTrap?: string;           // optional 1 line
    clozeResult?: {
        blankId: string;
        index: number;
        contextLabel: string;
        userValue: string | null;
        correctValue: string;
        status: 'CORRECT' | 'INCORRECT' | 'UNANSWERED';
        pointsEarned?: number;
        maxPoints?: number;
        whyCorrect?: string;
        whyIncorrect?: string | null;
    };
}
