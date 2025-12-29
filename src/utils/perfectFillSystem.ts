export interface PatientInfo {
    name: string;
    age: number;
    gender: string;
    codeStatus: string;
    admissionDate: string;
    room: string;
    physician: string;
    nurse: string;
    allergies: string;
    isolation: string;
}

export interface VitalsData {
    time: string;
    tempF: string;
    hr: number;
    rr: number;
    bp: string;
    o2: string;
}

export interface ClinicalData {
    patientInfo: PatientInfo;
    history?: string;
    historyPhysical?: string;
    vitals?: VitalsData[];
    labs?: string;
    orders?: string;
    radiology?: string; // or 'rad'
}

export interface AnalyticsMetadata {
    clientNeed: string; // "Physiological Integrity", etc.
    clsi: string; // "Recognize Cues", etc.
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    peerAverageTime: number;
}

export interface FeedbackMetadata {
    itemDifficulty: string; // Used in Clinical Reasoning ("Hard (4.0)")
    clinicalContext: string;
    deepAnalysis: string; // "whyCorrect" basically
    trapAlert: string; // "whyIncorrect"
    goldenRule: string; // "strategicAdvice"
}

// Complete Item Structure for Perfect Fill
export interface PerfectItem {
    id: string;
    type: string;
    // Analytics
    clientNeed: string;
    clsi: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    peerAverageTime: number;

    content: {
        text?: string;
        options?: any[];
        structure?: any;
        clinicalData?: ClinicalData; // EHR Tabs & Patient Header Source

        // Feedback
        rationale?: string;
        whyCorrect?: string;
        whyIncorrect?: string;
        strategicAdvice?: string; // Golden Rule
        clinicalContext?: string;
        deepAnalysis?: string;
    };
}

/**
 * Service to validate and enrich items to Ensure "Perfect Fill"
 */
export const PerfectFillService = {

    /**
     * Checks if an item is "perfect" (contains all required fields).
     */
    isValid: (item: any): boolean => {
        if (!item || !item.content) return false;

        // Check Patient Data 
        const hasPatient = !!(item.content.clinicalData?.patientInfo?.room);

        // Check Analytics Tags
        const hasTags = !!(item.clientNeed && item.clsi && item.difficulty);

        // Check Feedback
        const hasFeedback = !!(item.content.clinicalContext && item.content.strategicAdvice);

        return hasPatient && hasTags && hasFeedback;
    },

    /**
     * Enriches an item with smart defaults if fields are missing.
     * Ensures UI never breaks or shows "0%" / "No Data".
     */
    enrich: (rawItem: any): PerfectItem => {
        const item = JSON.parse(JSON.stringify(rawItem)); // Deep clone
        if (!item.content) item.content = {};

        // 1. Enrich Clinical Data (Patient Header & Tabs)
        if (!item.content.clinicalData) item.content.clinicalData = {};
        const cd = item.content.clinicalData;

        // 1.1 Patient Info
        if (!cd.patientInfo) cd.patientInfo = {};
        const pi = cd.patientInfo;

        // Smart Extraction from Stem
        const stemText = item.content.text || item.content.structure?.prompt || "";
        let extractedAge = null;
        let extractedGender = null;

        if (stemText) {
            // Regex for "82-year-old male", "45 yo female", etc.
            const ageMatch = stemText.match(/(\d{1,3})\s?[-]?\s?(year|yo|yr)[s]?\s?[-\s]?\s?(old)?\s?(male|female|man|woman|boy|girl)/i);
            if (ageMatch) {
                extractedAge = parseInt(ageMatch[1]);
                const genderStr = ageMatch[4].toLowerCase();
                extractedGender = (genderStr.includes('fe') || genderStr.includes('wo') || genderStr.includes('girl')) ? 'F' : 'M';
            }
        }

        if (!pi.name) pi.name = extractedGender === 'F' ? "Doe, Jane" : "Doe, John"; // Generic but consistent
        if (!pi.age) pi.age = extractedAge || 45;
        if (!pi.gender) pi.gender = extractedGender || "M";
        if (!pi.codeStatus) pi.codeStatus = "FULL CODE";
        if (!pi.admissionDate) {
            const now = new Date();
            pi.admissionDate = now.toLocaleDateString() + " 07:30";
        }
        if (!pi.room) pi.room = "ED-04";
        if (!pi.physician) pi.physician = "Dr. S. Generic";
        if (!pi.nurse) pi.nurse = "RN Staff";
        if (!pi.allergies) pi.allergies = "NKDA";
        if (!pi.isolation) pi.isolation = "Standard Precautions";

        // 1.2 EHR Tabs
        // Fallback: If no history provided, use the Stem Text as the History so the tab isn't empty/useless.
        if (!cd.history) {
            cd.history = stemText
                ? `<p><strong>Admitting Note:</strong> ${stemText}</p>`
                : "<p>No specific nursing notes available for this abstract scenario.</p>";
        }
        if (!cd.historyPhysical) {
            cd.historyPhysical = stemText
                ? `<p><strong>HPI:</strong> See Admitting Note.</p>`
                : "<p>History and physical data not provided.</p>";
        }

        // Populate Vitals from Stem if detected? (Too complex for simple regex, stick to defaults or AI gen)
        if (!cd.labs) cd.labs = "<p>No laboratory results on file.</p>";
        if (!cd.orders) cd.orders = "No active orders.";

        // 1.3 Vitals
        if (!cd.vitals || !Array.isArray(cd.vitals)) {
            cd.vitals = [
                { time: '08:00', tempF: '98.6', hr: 78, rr: 16, bp: '120/80', o2: '98% RA' }
            ];
        }

        // 2. Enrich Analytics Tags (Sidebar)
        if (!item.clientNeed) item.clientNeed = "Physiological Integrity";
        if (!item.clsi) item.clsi = "Recognize Cues";
        if (!item.difficulty) item.difficulty = "Moderate";
        if (!item.peerAverageTime) item.peerAverageTime = 60;

        // 2.1 Push Tags into Content Structure (for Scoring Engine)
        if (!item.content.structure) item.content.structure = { type: item.type || 'multiple-choice' };

        const ensureMetadata = (q: any, index: number) => {
            if (!q) return;
            if (!q.metadata) q.metadata = {};

            if (!q.metadata.clientNeeds) q.metadata.clientNeeds = item.clientNeed;
            if (!q.metadata.difficulty) q.metadata.difficulty = item.difficulty;
            if (!q.metadata.cjmmStep) {
                // Smart CJMM Mapping for Case Studies
                const cjmmSteps = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];
                q.metadata.cjmmStep = (index >= 0 && index < 6) ? cjmmSteps[index] : item.clsi;
            }
        };

        if (Array.isArray(item.content.structure.screens)) {
            // Case Study / Multi-Screen
            item.content.structure.screens.forEach((s: any, idx: number) => ensureMetadata(s, idx));
        } else {
            // Single Item
            ensureMetadata(item.content.structure, -1);
        }

        // 3. Enrich Feedback Metadata (Modal)
        // CALCULATION-SPECIFIC SAFETY FILLS
        const isCalculation = (item.type || '').toLowerCase().includes('calculation') ||
            (item.type || '').toLowerCase().includes('numeric') ||
            item.content.structure?.correctValue !== undefined ||
            item.content.structure?.inputLabel;

        if (isCalculation) {
            // Use calculation-appropriate defaults
            if (!item.content.strategicAdvice) {
                item.content.strategicAdvice = "Always verify units, convert weights (lbs to kg), and double-check your calculation step-by-step before submitting.";
            }
            if (!item.content.clinicalContext) {
                item.content.clinicalContext = "Medication calculations require precision. Review the order, available concentration, and patient-specific factors like weight.";
            }
            if (!item.content.whyIncorrect) {
                item.content.whyIncorrect = "Common errors include forgetting unit conversions, rounding too early, or misreading the order (e.g., per dose vs per day).";
            }
            if (!item.content.deepAnalysis) {
                const correctVal = item.content.structure?.correctValue || item.content.correctValue || 'N/A';
                const units = item.content.structure?.inputLabel || item.content.structure?.units || '';
                item.content.deepAnalysis = `The correct answer is ${correctVal} ${units}. Use dimensional analysis or the formula method to verify your calculation.`;
            }
            // Ensure rationale object exists for calculation items
            if (!item.content.rationale || typeof item.content.rationale !== 'object') {
                item.content.rationale = {
                    coreConcept: "Medication Calculation",
                    caseSummary: "Calculate the correct dose based on the order, patient weight, and available medication concentration.",
                    answerAnalysis: item.content.deepAnalysis || "Step-by-step calculation not provided.",
                    trap: item.content.whyIncorrect || "Watch for unit conversion errors.",
                    goldenRule: item.content.strategicAdvice || "Double-check your math before administering any medication."
                };
            }
        } else {
            // GENERIC (Non-Calculation) SAFETY FILLS
            // "Golden Rule" / Strategic Advice
            if (!item.content.strategicAdvice) {
                item.content.strategicAdvice = "Always assess before acting. Prioritize airway, breathing, and circulation.";
            }

            // "Clinical Context"
            if (!item.content.clinicalContext) {
                item.content.clinicalContext = "Review the patient's presentation and correlate with the underlying pathophysiology.";
            }

            // "Trap Alert"
            if (!item.content.whyIncorrect) {
                item.content.whyIncorrect = "Avoid common distractors that may look correct but don't address the priority need.";
            }

            // Deep Analysis (Derived from Rationale if missing)
            if (!item.content.deepAnalysis && item.content.rationale) {
                item.content.deepAnalysis = item.content.rationale;
            } else if (!item.content.deepAnalysis) {
                item.content.deepAnalysis = "Detailed analysis is pending for this item.";
            }
        }

        // 4. Critical: Ensure Dropdowns have IDs and Correct Answers
        const fixDropdowns = (q: any) => {
            if (!q) return;

            // Helper to enrich a single dropdown definition
            const enrichDropdown = (d: any, idx: number, idPrefix: string) => {
                // A. Ensure ID
                if (!d.id) d.id = `${idPrefix}_${idx}`;

                // B. Bubble Up 'isCorrect' from Options (Fixes Renderer vs Scorer Discrepancy)
                if (!d.correctOptionId && !d.correctAnswer && !d.correctId && d.options && Array.isArray(d.options)) {
                    const correctOpt = d.options.find((o: any) => o.isCorrect === true || o.correct === true);
                    if (correctOpt) {
                        d.correctOptionId = correctOpt.id || correctOpt.value || correctOpt.text;
                    }
                }
            };

            if (q.dropdowns && Array.isArray(q.dropdowns)) {
                q.dropdowns.forEach((d: any, i: number) => enrichDropdown(d, i, 'dd_gen'));
            }
            if (q.sentences && Array.isArray(q.sentences)) {
                q.sentences.forEach((s: any) => {
                    if (s.dropdowns && Array.isArray(s.dropdowns)) {
                        s.dropdowns.forEach((d: any, i: number) => enrichDropdown(d, i, 'dd_s'));
                    }
                });
            }
        };

        if (item.content.structure) {
            if (Array.isArray(item.content.structure.screens)) {
                item.content.structure.screens.forEach(fixDropdowns);
            } else {
                fixDropdowns(item.content.structure);
            }
        }

        return item as PerfectItem;
    }
};
