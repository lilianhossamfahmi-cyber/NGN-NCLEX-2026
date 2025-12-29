/**
 * ClinicalHelpers.ts
 * Gold-standard clinical calculation and formatting utilities
 * Based on NCSBN, JCI, ISMP, AHA, and TJC guidelines
 */

// ============================================================================
// ISMP HIGH-ALERT MEDICATIONS LIST
// ============================================================================
export const HIGH_ALERT_MEDICATIONS = [
    'insulin', 'heparin', 'warfarin', 'enoxaparin', 'morphine', 'hydromorphone',
    'fentanyl', 'methadone', 'oxycodone', 'potassium chloride', 'magnesium sulfate',
    'epinephrine', 'norepinephrine', 'dopamine', 'dobutamine', 'vasopressin',
    'nitroprusside', 'amiodarone', 'digoxin', 'lidocaine', 'propofol', 'ketamine',
    'neuromuscular blocking agents', 'vecuronium', 'rocuronium', 'succinylcholine',
    'chemotherapy', 'methotrexate', 'vincristine', 'doxorubicin'
];

// ============================================================================
// TALL MAN LETTERING (ISMP Look-Alike/Sound-Alike List)
// ============================================================================
export const TALL_MAN_DRUGS: Record<string, string> = {
    'dopamine': 'DOPamine',
    'dobutamine': 'DOBUTamine',
    'morphine': 'morPHINE',
    'hydromorphone': 'HYDROmorphone',
    'epinephrine': 'EPINEPHrine',
    'ephedrine': 'ePHEDrine',
    'prednisone': 'predniSONE',
    'prednisolone': 'prednisoLONE',
    'methylprednisolone': 'methylPREDNISolone',
    'hydroxyzine': 'hydrOXYzine',
    'hydralazine': 'hydrALAZINE',
    'glipizide': 'glipiZIDE',
    'glyburide': 'glyBURIDE',
    'clonidine': 'cloNIDine',
    'clonazepam': 'clonaZEPAM',
    'vincristine': 'vinCRIStine',
    'vinblastine': 'vinBLAStine',
    'cefazolin': 'ceFAZolin',
    'ceftriaxone': 'cefTRIAXone',
    'cefotaxime': 'cefOTAXime',
    'risperidone': 'risperiDONE',
    'ropinirole': 'rOPINIRole',
    'olanzapine': 'OLANZapine',
    'quetiapine': 'QUEtiapine',
    'buPROPion': 'buPROPion',
    'buspirone': 'busPIRone',
    'chlorpromazine': 'chlorproMAZINE',
    'prochlorperazine': 'prochloperAZINE',
    'metformin': 'metFORMIN',
    'daunorubicin': 'DAUNOrubicin',
    'doxorubicin': 'DOXOrubicin',
    'idarubicin': 'IDArubicin',
    'hydrocortisone': 'hydroCORTisone',
    'hydroxychloroquine': 'hydrOXYchloroquine',
    'acetazolamide': 'acetaZOLAMIDE',
    'acetohexamide': 'acetoHEXAMIDE',
    'carbamazepine': 'carBAMazepine',
    'oxcarbazepine': 'OXcarbazepine',
    'dimenhydrinate': 'dimenhyDRINATE',
    'diphenhydramine': 'diphenhydrAMINE',
    'lorazepam': 'LORazepam',
    'alprazolam': 'ALPRAZolam',
    'diazepam': 'diazePAM',
    'nitroglycerin': 'NITROglycerin',
    'nitroprusside': 'nitroPRUSSide'
};

/**
 * Apply Tall Man Lettering to a drug name
 */
export function applyTallManLettering(drugName: string): string {
    const lower = drugName.toLowerCase().trim();
    return TALL_MAN_DRUGS[lower] || drugName;
}

/**
 * Check if a medication is High-Alert (ISMP List)
 */
export function isHighAlertMedication(drugName: string): boolean {
    const lower = drugName.toLowerCase();
    return HIGH_ALERT_MEDICATIONS.some(ha => lower.includes(ha));
}

// ============================================================================
// VITAL SIGNS CALCULATIONS & THRESHOLDS
// ============================================================================

export interface VitalThresholds {
    tempF: { low: number; high: number; critLow: number; critHigh: number };
    hr: { low: number; high: number; critLow: number; critHigh: number };
    rr: { low: number; high: number; critLow: number; critHigh: number };
    sbp: { low: number; high: number; critLow: number; critHigh: number };
    dbp: { low: number; high: number };
    spo2: { low: number; critLow: number };
    map: { critLow: number };
}

export const ADULT_VITAL_THRESHOLDS: VitalThresholds = {
    tempF: { low: 97.8, high: 99.1, critLow: 96.0, critHigh: 101.3 },
    hr: { low: 60, high: 100, critLow: 50, critHigh: 130 },
    rr: { low: 12, high: 20, critLow: 10, critHigh: 28 },
    sbp: { low: 90, high: 140, critLow: 90, critHigh: 180 },
    dbp: { low: 60, high: 90 },
    spo2: { low: 94, critLow: 90 },
    map: { critLow: 65 }
};

/**
 * Calculate Mean Arterial Pressure
 * MAP = (SBP + 2*DBP) / 3
 */
export function calculateMAP(sbp: number, dbp: number): number {
    return Math.round((sbp + 2 * dbp) / 3);
}

/**
 * Calculate Modified Early Warning Score (MEWS)
 * Returns score 0-14+ (higher = more critical)
 */
export function calculateMEWS(vitals: {
    hr?: number;
    sbp?: number;
    rr?: number;
    tempC?: number;
    tempF?: number;
    avpu?: 'A' | 'V' | 'P' | 'U';
}): { score: number; level: 'low' | 'medium' | 'high' | 'critical' } {
    let score = 0;

    // Heart Rate
    const hr = vitals.hr || 0;
    if (hr <= 40) score += 2;
    else if (hr <= 50) score += 1;
    else if (hr <= 100) score += 0;
    else if (hr <= 110) score += 1;
    else if (hr <= 129) score += 2;
    else score += 3;

    // Systolic BP
    const sbp = vitals.sbp || 0;
    if (sbp <= 70) score += 3;
    else if (sbp <= 80) score += 2;
    else if (sbp <= 100) score += 1;
    else if (sbp <= 199) score += 0;
    else score += 2;

    // Respiratory Rate
    const rr = vitals.rr || 0;
    if (rr < 9) score += 2;
    else if (rr <= 14) score += 0;
    else if (rr <= 20) score += 1;
    else if (rr <= 29) score += 2;
    else score += 3;

    // Temperature (convert F to C if needed)
    let tempC = vitals.tempC;
    if (!tempC && vitals.tempF) {
        tempC = (vitals.tempF - 32) * 5 / 9;
    }
    tempC = tempC || 37;
    if (tempC < 35) score += 2;
    else if (tempC <= 38.4) score += 0;
    else score += 2;

    // AVPU (Alert, Voice, Pain, Unresponsive)
    const avpu = vitals.avpu || 'A';
    if (avpu === 'A') score += 0;
    else if (avpu === 'V') score += 1;
    else if (avpu === 'P') score += 2;
    else score += 3;

    // Determine level
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score >= 7) level = 'critical';
    else if (score >= 5) level = 'high';
    else if (score >= 3) level = 'medium';

    return { score, level };
}

/**
 * Parse BP string (e.g., "120/80") into SBP and DBP
 */
export function parseBP(bp: string): { sbp: number; dbp: number } | null {
    if (!bp) return null;
    const match = bp.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return null;
    return { sbp: parseInt(match[1]), dbp: parseInt(match[2]) };
}

/**
 * Get vital sign status (normal, abnormal, critical)
 */
export function getVitalStatus(
    type: 'hr' | 'rr' | 'sbp' | 'dbp' | 'tempF' | 'spo2' | 'map',
    value: number
): 'normal' | 'abnormal' | 'critical' {
    const t = ADULT_VITAL_THRESHOLDS;

    switch (type) {
        case 'hr':
            if (value < t.hr.critLow || value > t.hr.critHigh) return 'critical';
            if (value < t.hr.low || value > t.hr.high) return 'abnormal';
            return 'normal';
        case 'rr':
            if (value < t.rr.critLow || value > t.rr.critHigh) return 'critical';
            if (value < t.rr.low || value > t.rr.high) return 'abnormal';
            return 'normal';
        case 'sbp':
            if (value < t.sbp.critLow || value > t.sbp.critHigh) return 'critical';
            if (value < t.sbp.low || value > t.sbp.high) return 'abnormal';
            return 'normal';
        case 'dbp':
            if (value < t.dbp.low || value > t.dbp.high) return 'abnormal';
            return 'normal';
        case 'tempF':
            if (value < t.tempF.critLow || value > t.tempF.critHigh) return 'critical';
            if (value < t.tempF.low || value > t.tempF.high) return 'abnormal';
            return 'normal';
        case 'spo2':
            if (value < t.spo2.critLow) return 'critical';
            if (value < t.spo2.low) return 'abnormal';
            return 'normal';
        case 'map':
            if (value < t.map.critLow) return 'critical';
            return 'normal';
        default:
            return 'normal';
    }
}

// ============================================================================
// LAB VALUE HELPERS
// ============================================================================

export interface LabReference {
    test: string;
    low: number;
    high: number;
    critLow?: number;
    critHigh?: number;
    unit: string;
}

export const COMMON_LAB_REFERENCES: Record<string, LabReference> = {
    'potassium': { test: 'Potassium', low: 3.5, high: 5.0, critLow: 2.5, critHigh: 6.5, unit: 'mEq/L' },
    'sodium': { test: 'Sodium', low: 136, high: 145, critLow: 120, critHigh: 160, unit: 'mEq/L' },
    'glucose': { test: 'Glucose', low: 70, high: 100, critLow: 50, critHigh: 400, unit: 'mg/dL' },
    'creatinine': { test: 'Creatinine', low: 0.7, high: 1.3, critHigh: 4.0, unit: 'mg/dL' },
    'bun': { test: 'BUN', low: 7, high: 20, unit: 'mg/dL' },
    'hemoglobin': { test: 'Hemoglobin', low: 12.0, high: 17.5, critLow: 7.0, unit: 'g/dL' },
    'hematocrit': { test: 'Hematocrit', low: 36, high: 50, critLow: 21, unit: '%' },
    'wbc': { test: 'WBC', low: 4.5, high: 11.0, critLow: 2.0, critHigh: 30.0, unit: 'K/uL' },
    'platelets': { test: 'Platelets', low: 150, high: 400, critLow: 50, critHigh: 1000, unit: 'K/uL' },
    'inr': { test: 'INR', low: 0.8, high: 1.2, critHigh: 5.0, unit: '' },
    'ptt': { test: 'PTT', low: 25, high: 35, critHigh: 100, unit: 'seconds' },
    'troponin': { test: 'Troponin', low: 0, high: 0.04, critHigh: 0.1, unit: 'ng/mL' },
    'lactate': { test: 'Lactate', low: 0.5, high: 2.0, critHigh: 4.0, unit: 'mmol/L' },
    'ph': { test: 'pH', low: 7.35, high: 7.45, critLow: 7.20, critHigh: 7.60, unit: '' },
    'pco2': { test: 'pCO2', low: 35, high: 45, critLow: 20, critHigh: 70, unit: 'mmHg' },
    'po2': { test: 'pO2', low: 80, high: 100, critLow: 60, unit: 'mmHg' },
    'hco3': { test: 'HCO3', low: 22, high: 26, critLow: 10, critHigh: 40, unit: 'mEq/L' }
};

/**
 * Get lab result status
 */
export function getLabStatus(testName: string, value: number): {
    status: 'normal' | 'low' | 'high' | 'critLow' | 'critHigh';
    flag: string;
} {
    const lower = testName.toLowerCase().replace(/\s/g, '');
    const ref = COMMON_LAB_REFERENCES[lower];

    if (!ref) {
        return { status: 'normal', flag: '' };
    }

    if (ref.critLow !== undefined && value < ref.critLow) {
        return { status: 'critLow', flag: 'L!' };
    }
    if (ref.critHigh !== undefined && value > ref.critHigh) {
        return { status: 'critHigh', flag: 'H!' };
    }
    if (value < ref.low) {
        return { status: 'low', flag: 'L' };
    }
    if (value > ref.high) {
        return { status: 'high', flag: 'H' };
    }
    return { status: 'normal', flag: '' };
}

/**
 * Calculate delta change percentage between two values
 */
export function calculateDelta(current: number, previous: number): {
    percent: number;
    direction: 'up' | 'down' | 'stable';
    significant: boolean;
} {
    if (!previous || previous === 0) {
        return { percent: 0, direction: 'stable', significant: false };
    }
    const percent = ((current - previous) / previous) * 100;
    const direction = percent > 0 ? 'up' : percent < 0 ? 'down' : 'stable';
    const significant = Math.abs(percent) >= 30; // 30% change is significant

    return { percent: Math.round(percent), direction, significant };
}

// ============================================================================
// CRITICAL VALUE KEYWORDS (RADIOLOGY)
// ============================================================================
export const RADIOLOGY_CRITICAL_FINDINGS = [
    'pneumothorax', 'tension pneumothorax', 'hemothorax',
    'pulmonary embolism', 'pe', 'aortic dissection', 'aneurysm rupture',
    'intracranial hemorrhage', 'subdural hematoma', 'epidural hematoma', 'subarachnoid hemorrhage',
    'stroke', 'infarct', 'mass effect', 'midline shift', 'herniation',
    'free air', 'pneumoperitoneum', 'bowel obstruction', 'volvulus',
    'appendicitis', 'ectopic pregnancy', 'testicular torsion',
    'fracture', 'dislocation', 'spinal cord compression',
    'abscess', 'empyema', 'meningitis', 'encephalitis'
];

/**
 * Check if radiology report contains critical findings
 */
export function hasCriticalRadiologyFinding(reportText: string): boolean {
    const lower = reportText.toLowerCase();
    return RADIOLOGY_CRITICAL_FINDINGS.some(cf => lower.includes(cf));
}

// ============================================================================
// NOTES HELPERS (Critical Keywords)
// ============================================================================
export const CRITICAL_NOTE_KEYWORDS = [
    'deteriorating', 'unresponsive', 'cardiac arrest', 'code blue',
    'rapid response', 'emergent', 'critical', 'acute', 'stat',
    'desaturation', 'hypotensive shock', 'anaphylaxis', 'sepsis',
    'altered mental status', 'ams', 'lethargy', 'obtunded'
];

/**
 * Check if a nursing note contains critical keywords
 */
export function isCriticalNote(noteText: string): boolean {
    const lower = noteText.toLowerCase();
    return CRITICAL_NOTE_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Check if a note describes an intervention that needs a documented response
 */
export function isInterventionNote(noteText: string): boolean {
    const lower = noteText.toLowerCase();
    const interventionKeywords = [
        'administered', 'given', 'applied', 'inserted', 'removed',
        'initiated', 'started', 'increased', 'decreased', 'titrated',
        'repositioned', 'suctioned', 'performed'
    ];
    return interventionKeywords.some(kw => lower.includes(kw));
}

/**
 * Check if a note contains a documented response
 */
export function hasDocumentedResponse(noteText: string): boolean {
    const lower = noteText.toLowerCase();
    const responseKeywords = [
        'response:', 'patient reports', 'pt states', 'pain improved',
        'pain unchanged', 'vital signs', 'no adverse', 'tolerated',
        'effective', 'ineffective', 'relief', 'no relief'
    ];
    return responseKeywords.some(kw => lower.includes(kw));
}
