
import { ItemManager, GradingResult, ValidationResult } from './ItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { aggressiveRepairJson } from '../importService';
import { ClinicalDataStandardizer } from './ClinicalDataStandardizer'; // Phase 1.5

/**
 * Base Class for all Item Managers.
 * Provides shared utilities for JSON repair, standard grading calls, and error handling.
 */
export abstract class AbstractItemManager implements ItemManager {
    abstract typeKeys: string[];

    /**
     * Shared "Pre-Repair" logic that runs for EVERY item type.
     * 1. Fixes bad JSON syntax.
     * 2. Standardizes Clinical Data (Nurse Notes, Vitals, etc).
     */
    async repair(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        let cleanItem = { ...item };

        // 1. Generic Clinical Cleanup (Notes, Age, Gender, H&P)
        cleanItem = ClinicalDataStandardizer.normalize(cleanItem);

        // 2. Ensuring crucial metadata exists
        if (!cleanItem.metadata) {
            cleanItem.metadata = {
                title: 'Recovered Item',
                authorId: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'draft',
                qualityScore: 50,
                hasStudentPreview: true,
                batchInfo: { batchId: 'recovery', batchSize: 1, temperature: 0, generationDate: new Date().toISOString() },
                sourceOrigin: 'manual',
                sourceReferences: []
            };
        }

        // 3. Child-specific repair (The specific manager implementation)
        return this.repairSpecific(cleanItem);
    }

    /**
     * Abstract method that child classes MUST implement for their specific needs.
     */
    protected abstract repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem>;

    abstract validate(item: MasterQuestionItem): ValidationResult;

    abstract formatForDisplay(item: MasterQuestionItem): any;

    abstract grade(userAnswer: any, correctContent: any): GradingResult;

    /**
     * Helper: Standardizes Score Calculation (0-1).
     */
    protected calculatePercentage(score: number, max: number): number {
        if (max === 0) return 0;
        return Math.min(100, Math.max(0, (score / max) * 100));
    }
}
