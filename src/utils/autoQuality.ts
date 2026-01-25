import { MasterQuestionItem } from '../types/master-schema';

/**
 * Critical validation checks. Returns an array of error messages if any.
 */
function runCriticalChecks(item: MasterQuestionItem): string[] {
    const errors: string[] = [];
    if (typeof item !== 'object' || item === null) {
        errors.push('Item is not a valid object');
        return errors;
    }

    // 1. Check for basic content/structure
    const content = item.content || (item as any);
    const structure = content.structure || (item as any).structure || content;

    // 2. Correct answer check
    const hasCorrect =
        (structure.options?.some((o: any) => o.isCorrect)) ||
        (structure.actions?.some((o: any) => o.isCorrect)) ||
        (structure.rows?.some((o: any) => o.correctColumnIds?.length > 0)) ||
        (structure.correctValue !== undefined) ||
        (item as any).metadata?.correctAnswer;

    if (!hasCorrect) {
        errors.push('Missing correct answer or keys');
    }

    // 3. Clinical Data Check
    const clinicalData = content.clinicalData || content;
    const vitals = clinicalData.vitals || clinicalData.vitalSigns;
    if (item.type === 'trend' && (!vitals || !Array.isArray(vitals) || vitals.length < 2)) {
        errors.push('Trend item requires at least 2 time points in vitals');
    }

    return errors;
}

/**
 * Scoring factors based on NGN Golden Standards
 */
function calculateScore(item: MasterQuestionItem): number {
    let bonus = 0;
    const content = item.content || (item as any);
    const rat = (item as any).rationale || content.rationale || (item as any).metadata?.rationale || {};

    // 1. Rationale Depth (+15)
    // Check for rich rationale structure
    if (typeof rat === 'object') {
        if (rat.coreConcept || rat.clinicalLogic) bonus += 5;
        if (rat.pathophysiology || rat.referenceInfo?.physiology) bonus += 5;
        if (rat.strategy || rat.cheatSheet) bonus += 5;
    } else if (typeof rat === 'string' && rat.length > 200) {
        bonus += 10;
    }

    // 2. Evidence of Trend (+10)
    const clinicalData = content.clinicalData || content;
    const vitals = clinicalData.vitals || clinicalData.vitalSigns;
    if (Array.isArray(vitals) && vitals.length >= 3) {
        bonus += 10;
    }

    // 3. Metadata Completeness (+5)
    if ((item.metadata as any).clientNeeds) bonus += 2;
    if (item.pedagogy?.clinicalFocus) bonus += 3;

    // 4. Distractor Quality (+10)
    const structure = content.structure || content;
    const options = structure.options || (structure.actions);
    if (Array.isArray(options) && options.length >= 4) bonus += 10;

    // Base score is 50 + accumulated points (max 100)
    return Math.min(100, 55 + bonus);
}

/**
 * Run full AQA on an item. Returns pass/fail, score and any flags.
 */
export function runAQA(item: MasterQuestionItem): { passed: boolean; score: number; flags?: string[] } {
    const flags: string[] = [];
    const critical = runCriticalChecks(item);
    if (critical.length > 0) {
        flags.push(...critical);
    }
    const score = calculateScore(item);
    const passed = critical.length === 0 && score >= 70;
    return { passed, score, flags: flags.length ? flags : undefined };
}

/**
 * Helper to attach score and status to an item based on the spec thresholds.
 */
export function enrichItemWithQuality(item: MasterQuestionItem): MasterQuestionItem {
    const { score } = runAQA(item);

    if (!item.metadata) item.metadata = {} as any;

    // Attach score
    (item.metadata as any).score = score;
    (item.metadata as any).qualityScore = score;

    // Determine status
    let status = item.metadata.status;

    // Only auto-update status if it's currently draft or undefined
    if (!status || status === 'draft') {
        if (score >= 90) status = 'published';
        else if (score < 75) status = 'in-review';
        else status = 'draft';
    }

    item.metadata.status = status;
    return item;
}
