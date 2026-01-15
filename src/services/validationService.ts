import { GenerationSettings, MasterQuestionItem } from '../types/master-schema.ts';

/**
 * Validation Service
 * Validates user inputs for generation settings and item content compliance.
 */

interface ValidationResult {
    valid: boolean;
    errors: string[];
}

interface ContentValidationResult {
    valid: boolean;
    warnings: string[];
}

/**
 * Validates the Generation Settings before processing.
 * Rules:
 * - At least 1 target type
 * - Quantity 1-100
 * - Temp 0-2
 * - At least 1 Clinical Focus
 * - Mode specific context requirements
 */
export const validateGenerationSettings = (settings: GenerationSettings): ValidationResult => {
    const errors: string[] = [];

    if (!settings.targetTypes || settings.targetTypes.length === 0) {
        errors.push("At least one Question Type must be selected.");
    }

    if (settings.quantityPerType < 1 || settings.quantityPerType > 100) {
        errors.push("Quantity per type must be between 1 and 100.");
    }

    if (settings.temperature < 0.0 || settings.temperature > 2.0) {
        errors.push("Temperature must be between 0.0 and 2.0.");
    }

    if (!settings.clinicalFocus || settings.clinicalFocus.length === 0) {
        errors.push("At least one Clinical Focus area must be selected.");
    }

    // Mode Specific validations
    if (settings.mode === 'upload' && settings.selectedReferenceIds.length === 0) {
        errors.push("Upload Mode requires at least one active reference.");
    }

    if (settings.mode === 'manual' && (!settings.manualContext || settings.manualContext.trim().length < 10)) {
        errors.push("Manual Mode requires clinical data context.");
    }

    // Note: AI Prompt check is relaxed here because the UI now supports 'Auto-Describe' 
    // where prompt is deliberately empty. The Service Layer handles the fallback logic.

    if (settings.mode === 'hybrid') {
        // Hybrid ensures at least one input is present, but Auto-Describe counts as valid input logic now.
        // We'll trust the User Interface to enforce basic setup.
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Validates a generated item's content for minimum NCSBN standards.
 */
/**
 * Validates a generated item's content for minimum NCSBN standards.
 */
export const validateItemContent = (item: MasterQuestionItem): ContentValidationResult => {
    const warnings: string[] = [];

    // Check Title
    if (!item.metadata.title) warnings.push("Item is missing a title.");

    // Check Content Payload existence
    if (!item.content) {
        warnings.push("Item has no content payload.");
        return { valid: false, warnings };
    }

    const { typeId } = item;
    const structure = item.content.structure || {};

    // --- TYPE SPECIFIC VALIDATION ---

    // 1. Bow-Tie Validation
    if (typeId.includes('bow-tie') || typeId.includes('bowtie')) {
        const actions = structure.actions || [];
        const conditions = structure.conditions || [];
        const parameters = structure.parameters || [];

        if (actions.length !== 5) warnings.push(`Bow-Tie must have 5 Actions (found ${actions.length}).`);
        if (conditions.length !== 4) warnings.push(`Bow-Tie must have 4 Conditions (found ${conditions.length}).`);
        if (parameters.length !== 5) warnings.push(`Bow-Tie must have 5 Parameters (found ${parameters.length}).`);

        const correctActions = actions.filter((x: any) => x.isCorrect).length;
        if (correctActions !== 2) warnings.push(`Bow-Tie must have exactly 2 correct Actions (found ${correctActions}).`);

        const correctConditions = conditions.filter((x: any) => x.isCorrect).length;
        if (correctConditions !== 1) warnings.push(`Bow-Tie must have exactly 1 correct Condition (found ${correctConditions}).`);

        const correctParams = parameters.filter((x: any) => x.isCorrect).length;
        if (correctParams !== 2) warnings.push(`Bow-Tie must have exactly 2 correct Parameters (found ${correctParams}).`);
    }

    // 2. Case Study (6-Screen) Validation
    if (typeId.includes('case-study')) {
        const screens = structure.screens || [];
        if (screens.length !== 6) {
            warnings.push(`NGN Case Study must have exactly 6 screens (found ${screens.length}).`);
        } else {
            // Validate Screen Sequence (Heuristic)

            screens.forEach((screen: any, idx: number) => {
                // allow slight variation in naming or ordering if generator allows, but warn if wildly off
                if (!screen.type) warnings.push(`Screen ${idx + 1} is missing a type definition.`);
            });
        }
    }

    // 3. General Rationale Check
    // Recursive search for 'rationale' keys could be expensive, so we do a shallow check on options if possible.
    if (structure.options) {
        const missingRat = structure.options.some((Opt: any) => !Opt.rationale || Opt.rationale.length < 5);
        if (missingRat) warnings.push("Some options are missing detailed rationales.");
    }

    // 4. Gold Standard Rationale Check
    const rationale = item.content.rationale as any;
    if (!rationale) {
        warnings.push("Gold Standard Violation: Missing global rationale object.");
    } else {
        if (!rationale.coreConcept) warnings.push("Rationale missing 'coreConcept'.");
        if (!rationale.trap) warnings.push("Rationale missing 'trap'.");
        if (!rationale.difficulty || typeof rationale.difficulty.level !== 'number') {
            warnings.push("Rationale missing Difficulty Level.");
        }
    }

    // 5. Clinical Data Check (Vitals)
    const vitals = item.content.clinicalData?.vitals;
    if (vitals && Array.isArray(vitals)) {
        vitals.forEach((v: any, i: number) => {
            // Check for existence of pain field (allow 0)
            if (v.pain === undefined || v.pain === null || v.pain === "") {
                warnings.push(`Vital Sign #${i + 1} is missing the required 'pain' field.`);
            }
        });
    }

    return {
        valid: warnings.length === 0,
        warnings
    };
};
