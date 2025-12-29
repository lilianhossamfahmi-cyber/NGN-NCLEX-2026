import { ReferenceSource, CopyrightLicense } from '../types/master-schema';

/**
 * Copyright Detection Service
 * Managed compliance, attribution, and paraphrase detection.
 */

export interface CopyrightResult {
    status: CopyrightLicense;
    riskLevel: 'safe' | 'flag' | 'block';
    action: 'allow' | 'attribute' | 'paraphrase' | 'verify';
    attribution?: string;
    paraphraseRequired: boolean;
}

// Define types for compliance rules to handle heterogeneous properties safely
interface ComplianceRule {
    allowed: boolean;
    requiresCitation?: boolean;
    shareAlike?: boolean;
    paraphrase?: boolean;
    paraphraseMode?: boolean;
    flag?: boolean;
    risk: 'safe' | 'flag' | 'block';
}

const COMPLIANCE_RULES: Record<string, ComplianceRule> = {
    'public_domain': { allowed: true, requiresCitation: false, risk: 'safe' },
    'cc_by': { allowed: true, requiresCitation: true, risk: 'safe' },
    'cc_by_sa': { allowed: true, requiresCitation: true, shareAlike: true, risk: 'flag' },
    'proprietary': { allowed: false, paraphraseMode: true, risk: 'block' },
    'ncsbn_official': { allowed: true, requiresCitation: true, paraphrase: true, risk: 'flag' },
    'institutional': { allowed: true, flag: true, risk: 'safe' } // Assumed safe if uploaded by user
};

/**
 * Detects copyright status of content relative to a specific reference.
 * In a real system, this would scan text against a DB of licensed phrases.
 */
export const detectCopyrightStatus = (_content: string, reference: ReferenceSource): CopyrightResult => {
    const rule = COMPLIANCE_RULES[reference.copyrightStatus] || COMPLIANCE_RULES['proprietary'];

    // Logic to determine specific action
    let action: CopyrightResult['action'] = 'allow';
    if (reference.copyrightStatus === 'proprietary') action = 'paraphrase';
    else if (rule.requiresCitation) action = 'attribute';

    return {
        status: reference.copyrightStatus,
        riskLevel: rule.risk,
        action,
        paraphraseRequired: !!rule.paraphrase || !!rule.paraphraseMode,
        attribution: rule.requiresCitation ? generateAttribution(reference, 'apa') : undefined
    };
};

/**
 * Generates formatted citation.
 */
export const generateAttribution = (source: ReferenceSource, format: 'apa' | 'mla' | 'harvard' = 'apa'): string => {
    // Simple mock formatters
    const year = new Date().getFullYear(); // Approximating if not in source
    if (format === 'apa') {
        return `Adapted from ${source.fileName} (${year}). NCSBN/Source Material.`;
    }
    return `Source: ${source.fileName}`;
};

/**
 * Helper to assess global risk of a batch of sources.
 */
export const assessRiskLevel = (sources: ReferenceSource[]): 'safe' | 'flag' | 'block' => {
    if (sources.some(s => s.copyrightStatus === 'proprietary')) return 'block';
    if (sources.some(s => s.copyrightStatus === 'ncsbn_official')) return 'flag';
    return 'safe';
};
