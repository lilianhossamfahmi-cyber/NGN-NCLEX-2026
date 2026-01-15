import { MasterQuestionItem } from '../types/master-schema.ts';

/**
 * Critical validation checks. Returns an array of error messages if any.
 */
function runCriticalChecks(item: MasterQuestionItem): string[] {
    const errors: string[] = [];
    // 1. Valid JSON structure (already an object)
    if (typeof item !== 'object' || item === null) {
        errors.push('Item is not a valid object');
    }
    // 2. Correct answer path – we expect an answer key in `metadata.correctAnswer`
    const correct = (item as any).metadata?.correctAnswer;
    if (!correct) {
        errors.push('Missing correct answer');
    }
    // 3. Vitals – typical NGN items have a `pedagogy.vitals` object with numeric ranges
    const vitals = (item as any).pedagogy?.vitals;
    if (vitals) {
        const { hr, bp, temp } = vitals;
        if (hr && (hr < 30 || hr > 200)) errors.push('Heart rate out of realistic range');
        if (bp && (bp.systolic < 50 || bp.systolic > 250)) errors.push('Blood pressure systolic out of range');
        if (temp && (temp < 30 || temp > 45)) errors.push('Temperature out of range');
    }
    return errors;
}

/**
 * Scoring factors based on the spec in PHASE_2_ITEM_BANK_SPECS.md
 */
function calculateScore(item: MasterQuestionItem): number {
    let score = 0;
    // Length of rationale (>50 words = +10)
    const rationale = (item as any).metadata?.rationale ?? '';
    const wordCount = typeof rationale === 'string' ? rationale.split(/\s+/).filter(Boolean).length : 0;
    if (wordCount > 50) score += 10;

    // Trap field existence (+10)
    if ((item as any).metadata?.trap) score += 10;

    // HTML tables in labs (+5)
    const labs = (item as any).metadata?.labs ?? '';
    if (typeof labs === 'string' && /<table[\s>]/i.test(labs)) score += 5;

    // Non‑generic distractors (+10)
    const options = (item as any).options ?? [];
    const uniqueTexts = new Set<string>();
    options.forEach((opt: any) => {
        if (typeof opt.text === 'string') uniqueTexts.add(opt.text.trim().toLowerCase());
    });
    if (uniqueTexts.size > 2) score += 10;

    // Base score is 50 + accumulated points (max 100)
    const base = 50;
    return Math.min(100, base + score);
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
    const passed = critical.length === 0 && score >= 70; // arbitrary pass threshold
    return { passed, score, flags: flags.length ? flags : undefined };
}

/**
 * Helper to attach score and status to an item based on the spec thresholds.
 */
export function enrichItemWithQuality(item: MasterQuestionItem): MasterQuestionItem {
    const { score } = runAQA(item);
    // Attach score
    (item as any).metadata = { ...(item as any).metadata, score };
    // Determine status from metadata
    let status = (item as any).metadata?.status;

    // If explicitly published, keep it. Otherwise apply rules.
    if (status !== 'published') {
        status = 'draft';
        if (score > 90) status = 'published';
        else if (score < 40) status = 'auto_deleted';
        else if (score < 70) status = 'review_needed';
    }

    // Write back to metadata
    (item as any).metadata = { ...(item as any).metadata, status };
    return item;
}
