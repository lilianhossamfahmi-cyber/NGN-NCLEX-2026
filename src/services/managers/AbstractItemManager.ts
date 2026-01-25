
import { ItemManager, GradingResult, ValidationResult } from './ItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { aggressiveRepairJson } from '../importService';
import { ClinicalDataStandardizer } from './ClinicalDataStandardizer'; // Phase 1.5
import { magicFixItem } from '../geminiService';

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
     * DEEP REPAIR: Base Implementation
     */
    async deepRepair(item: MasterQuestionItem, options?: { autofill?: boolean }): Promise<MasterQuestionItem> {
        // 1. Ensure basic fields are professional/valid via Standard Repair
        let repaired = await this.repair(item);

        // 2. Metadata completeness
        if (!repaired.metadata.status) repaired.metadata.status = 'draft';
        if (!repaired.metadata.qualityScore) repaired.metadata.qualityScore = 70;

        // 3. Topic cleanup
        if (!repaired.pedagogy.clinicalFocus || repaired.pedagogy.clinicalFocus === 'General') {
            // Basic topic inference from keywords if missing
            const text = JSON.stringify(repaired).toLowerCase();
            if (text.includes('heart')) repaired.pedagogy.clinicalFocus = 'Cardiology';
            else if (text.includes('drug')) repaired.pedagogy.clinicalFocus = 'Pharmacology';
        }

        // 4. Content Completeness Check & Auto-Fill (AI Hook)
        if (options?.autofill) {
            // ENHANCED CHECK: Look for missing Pedagogical Content as well (Rationale, Strategy)
            const validation = this.validate(repaired);
            const criticalMissing = validation.issues.filter(i => i.severity === 'critical' || i.message.toLowerCase().includes('missing'));

            const content = repaired.content || (repaired as any);
            const rationale = content.rationale || (repaired as any).rationale || {};

            // If Autofill is ON, we treat missing rationale/strategy as CRITICAL GAPS
            if (!rationale.mnemonic || !rationale.cheatSheet || !rationale.pathophysiology) {
                criticalMissing.push({ severity: 'critical', field: 'rationale', message: 'Missing rich rationale and clinical strategy' });
            }

            if (criticalMissing.length > 0) {
                console.log(`[${this.constructor.name}] Critical gaps detected:`, criticalMissing.map(m => m.message));

                try {
                    const missingDescription = criticalMissing.map(m => m.message).join('; ');
                    const aiRepaired = await magicFixItem(
                        repaired,
                        `FIX CRITICAL ISSUES: ${missingDescription}. Ensure the item is clinicaly complete and high quality.`,
                        ['scenario', 'structure', 'rationale']
                    );

                    if (aiRepaired) {
                        // Blend AI result back into the item with deep merge for Rationale
                        if (aiRepaired.content) {
                            const existingRationale = repaired.content?.rationale || {};
                            const newRationale = aiRepaired.content.rationale || {};

                            repaired.content = {
                                ...repaired.content,
                                ...aiRepaired.content,
                                rationale: {
                                    ...existingRationale,
                                    ...newRationale,
                                    difficulty: {
                                        ...(existingRationale.difficulty || {}),
                                        ...(newRationale.difficulty || {})
                                    }
                                }
                            };
                        }
                        if (aiRepaired.metadata) repaired.metadata = { ...repaired.metadata, ...aiRepaired.metadata };
                    }
                } catch (err) {
                    console.error(`[${this.constructor.name}] AI Auto-Fill failed:`, err);
                }
            }
        }

        return repaired;
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
