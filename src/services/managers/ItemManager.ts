
import { MasterQuestionItem } from '../../types/master-schema';

/**
 * The standard interface that ALL Item Managers must implement.
 * This guarantees that every specific manager handles the 5 Pillars of Quality:
 * 1. Validation
 * 2. Repair
 * 3. Rendering
 * 4. Grading
 * 5. Conversion (Future Feature)
 */
export interface ItemManager {
    /**
     * The specific NGN Item Type this manager handles (e.g., 'bowtie-standalone')
     */
    typeKeys: string[];

    /**
     * Checks strict structural integrity.
     * @returns List of specific issues, or empty array if valid.
     */
    validate(item: MasterQuestionItem): ValidationResult;

    /**
     * Attempts to auto-repair known issues (e.g. missing options, ghost keys).
     * @returns The repaired item.
     */
    repair(item: MasterQuestionItem): Promise<MasterQuestionItem>;

    /**
     * DEEP REPAIR: Ensures ID, Type, Topic, Lvl, QI, Status are professional
     * AND checks content completeness, auto-filling missing parts using AI if requested.
     */
    deepRepair(item: MasterQuestionItem, options?: { autofill?: boolean }): Promise<MasterQuestionItem>;

    /**
     * Formats the item data specifically for the React UI components.
     * Prevents the UI from crashing on missing fields.
     */
    formatForDisplay(item: MasterQuestionItem): any;

    /**
     * Grades a user's answer based on NCSBN specific rules (e.g. +/- scoring).
     */
    grade(userAnswer: any, correctContent: any): GradingResult;

    /**
     * (Future) Converts this item into a different format if possible.
     */
    convert?(item: MasterQuestionItem, targetType: string): Promise<MasterQuestionItem>;
}

export interface ValidationResult {
    isValid: boolean;
    issues: ValidationIssue[];
    fatalError?: string;
}

export interface ValidationIssue {
    severity: 'critical' | 'warning' | 'info';
    field: string;
    message: string;
}

export interface GradingResult {
    score: number;
    maxScore: number;
    feedback: string;
    correctIds: string[];
}
