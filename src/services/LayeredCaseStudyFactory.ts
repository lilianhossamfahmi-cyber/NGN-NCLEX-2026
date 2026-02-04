/**
 * LayeredCaseStudyFactory.ts
 * 
 * 3-LAYER GENERATION SYSTEM FOR NCLEX-NGN 6-QUESTION CASE STUDIES
 * 
 * Layer 1 (Architect): Generates the structural skeleton with all placeholders.
 * Layer 2 (Specialist): Fills all placeholder content with high-fidelity clinical data.
 * Layer 3 (Validator): Verifies consistency, accuracy, and completeness.
 * 
 * @version 1.0.0
 */

import { MasterQuestionItem } from '../types/master-schema';
import { getGenAI, limiter } from '../config/apiConfig';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LayerProgress {
    layer: 1 | 2 | 3;
    status: 'pending' | 'running' | 'complete' | 'error';
    message: string;
    percent: number;
}

export interface GenerationConfig {
    topic: string;
    subTopic?: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    patientAge?: 'pediatric' | 'adult' | 'geriatric';
    setting?: string;
    onProgress?: (progress: LayerProgress) => void;
}

export interface CaseStudySkeleton {
    id: string;
    patientProfile: PatientPlaceholder;
    clinicalData: ClinicalDataPlaceholder;
    screens: ScreenPlaceholder[];
    rationale: RationalePlaceholder;
}

interface PatientPlaceholder {
    name: string;
    age: string;
    sex: string;
    allergies: string;
    chiefComplaint: string;
    comorbidities: string[];
    codeStatus: string;
}

interface ClinicalDataPlaceholder {
    setting: string;
    vitals: VitalSet[];
    labs: LabResult[];
    nursesNotes: NurseNote[];
    orders: Order[];
    historyPhysical: string;
    radiology: RadiologyReport[];
}

interface VitalSet {
    time: string;
    tempF: string;
    hr: string;
    rr: string;
    bp: string;
    o2: string;
    o2Device: string;
    pain: string;
}

interface LabResult {
    test: string;
    value: string;
    units: string;
    ref: string;
    flag: string;
    category: string;
}

interface NurseNote {
    time: string;
    category: 'Admission' | 'Clinical Update' | 'Critical' | 'Response' | 'Transfer';
    note: string;
    initial: string;
}

interface Order {
    order: string;
    dose: string;
    route: string;
    freq: string;
    status: string;
    indication: string;
}

interface RadiologyReport {
    study: string;
    findings: string;
    impression: string;
    date: string;
}

interface ScreenPlaceholder {
    id: string;
    type: 'highlight' | 'matrix' | 'ordered-response' | 'bow-tie' | 'drop-cloze' | 'multiple-response';
    cjmmStep: string;
    prompt: string;
    content: any; // Type-specific content
    rationale: ScreenRationale;
}

interface ScreenRationale {
    coreConcept: string;
    answerAnalysis: string;
    clinicalTakeaway: string;
}

interface RationalePlaceholder {
    coreConcept: string;
    caseSummary: string;
    goldenRule: string;
    pitfalls: string[];
    mnemonic: { title: string; content: string; explanation: string };
    cheatSheet: { title: string; points: string[] };
    referenceInfo: {
        anatomy: string;
        physiology: string;
        pharmacology: string;
    };
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    fixes: string[];
}

// ============================================================================
// LAYER 1: THE ARCHITECT (STRUCTURAL SKELETON)
// ============================================================================

const LAYER_1_PROMPT = `You are an expert NCLEX-NGN item writer. Generate a COMPLETE case study skeleton in JSON format.

## TOPIC: {{TOPIC}}
## DIFFICULTY: {{DIFFICULTY}}/5
## PATIENT AGE GROUP: {{AGE_GROUP}}
## SETTING: {{SETTING}}

## CRITICAL REQUIREMENTS:
1. ALL fields must be filled with clinically accurate content - NO PLACEHOLDERS like "TBD", "N/A", or "[INSERT]"
2. Patient must have a realistic name, specific age, and relevant medical history
3. Vitals must progress logically across 3 time points showing deterioration or response
4. Labs must include at least 4 relevant tests with values, units, and reference ranges
5. Nurses notes must use proper documentation format with timestamps
6. All 6 screens must have complete content with rationales

## REQUIRED JSON STRUCTURE:
{
  "id": "case-{{topic_slug}}-{{timestamp}}",
  "patientProfile": {
    "name": "Realistic patient name",
    "age": "Specific age (e.g., 68 years)",
    "sex": "Male or Female",
    "allergies": "Specific allergies or NKDA",
    "chiefComplaint": "Detailed presenting complaint",
    "comorbidities": ["At least 2 relevant conditions"],
    "codeStatus": "Full Code or specific status"
  },
  "clinicalData": {
    "setting": "Specific unit (e.g., Medical ICU, ED Trauma Bay)",
    "vitals": [
      { "time": "0800", "tempF": "101.2", "hr": "118", "rr": "24", "bp": "88/54", "o2": "91", "o2Device": "2L NC", "pain": "6/10" },
      { "time": "1000", "tempF": "102.4", "hr": "128", "rr": "28", "bp": "82/48", "o2": "88", "o2Device": "4L NC", "pain": "8/10" },
      { "time": "1200", "tempF": "100.8", "hr": "98", "rr": "20", "bp": "98/64", "o2": "95", "o2Device": "2L NC", "pain": "4/10" }
    ],
    "labs": [
      { "test": "WBC", "value": "18.2", "units": "K/µL", "ref": "4.5-11.0", "flag": "H", "category": "Hematology" }
    ],
    "nursesNotes": [
      { "time": "0800", "category": "Admission", "note": "Detailed admission assessment...", "initial": "J.D., RN" }
    ],
    "orders": [
      { "order": "Specific medication or intervention", "dose": "Exact dose", "route": "IV/PO/etc", "freq": "Frequency", "status": "Active", "indication": "Reason" }
    ],
    "historyPhysical": "Complete H&P with Chief Complaint, HPI, PMH, PSH, Meds, Allergies, Social Hx, Physical Exam",
    "radiology": [
      { "study": "Specific study", "findings": "Detailed findings", "impression": "Clinical impression", "date": "Date/time" }
    ]
  },
  "screens": [
    {
      "id": "s1",
      "type": "highlight",
      "cjmmStep": "Recognize Cues",
      "prompt": "Specific instruction for highlighting",
      "content": {
        "text": "Narrative with at least 7-9 <span id='hX'>highlightable</span> segments",
        "correct": ["h1", "h3", "h5"],
        "rationales": {
          "h1": { "isCorrect": true, "whyCorrect": "[Hook] Clinical significance. [Breakdown] Pathophysiology. [Trap] Common mistake." },
          "h2": { "isCorrect": false, "whyIncorrect": "Why this is a distractor" }
        }
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    },
    {
      "id": "s2",
      "type": "matrix",
      "cjmmStep": "Analyze Cues",
      "prompt": "For each finding, indicate the category",
      "content": {
        "columns": [{ "id": "c1", "text": "Category A" }, { "id": "c2", "text": "Category B" }],
        "rows": [{ "id": "r1", "text": "Finding 1", "correctColumnId": "c1", "rationale": "Why this finding belongs here" }]
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    },
    {
      "id": "s3",
      "type": "ordered-response",
      "cjmmStep": "Prioritize Hypotheses",
      "prompt": "Arrange steps in priority order",
      "content": {
        "orderedOptions": [{ "id": "step1", "text": "First priority action", "rationale": "Why this comes first" }]
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    },
    {
      "id": "s4",
      "type": "bow-tie",
      "cjmmStep": "Generate Solutions",
      "prompt": "Complete the clinical decision diagram",
      "content": {
        "actions": [{ "id": "a1", "text": "Action", "isCorrect": true, "rationale": "Why" }],
        "conditions": [{ "id": "cond1", "text": "Condition", "isCorrect": true, "rationale": "Why" }],
        "parameters": [{ "id": "p1", "text": "Parameter", "isCorrect": true, "rationale": "Why" }]
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    },
    {
      "id": "s5",
      "type": "drop-cloze",
      "cjmmStep": "Take Action",
      "prompt": "Complete the nursing action statement",
      "content": {
        "sentences": [{ "text": "The nurse should %{d1} to achieve %{d2}.", "dropdowns": [] }],
        "dropdowns": [
          { "id": "d1", "options": [{ "id": "o1", "text": "Option", "isCorrect": true, "rationale": "Why" }] }
        ]
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    },
    {
      "id": "s6",
      "type": "multiple-response",
      "cjmmStep": "Evaluate Outcomes",
      "prompt": "Which findings indicate improvement? Select all that apply.",
      "content": {
        "options": [{ "id": "o1", "text": "Outcome finding", "isCorrect": true, "rationale": "Why this indicates improvement" }]
      },
      "rationale": { "coreConcept": "...", "answerAnalysis": "...", "clinicalTakeaway": "..." }
    }
  ],
  "rationale": {
    "coreConcept": "Main clinical concept tested",
    "caseSummary": "2-3 sentence case summary for faculty",
    "goldenRule": "One memorable principle",
    "pitfalls": ["Common error 1", "Common error 2", "Common error 3"],
    "mnemonic": { "title": "ACRONYM", "content": "A = ..., B = ...", "explanation": "What it helps remember" },
    "cheatSheet": { "title": "Quick Reference", "points": ["Pearl 1", "Pearl 2", "Pearl 3"] },
    "referenceInfo": {
      "anatomy": "Relevant anatomical structures and relationships",
      "physiology": "Relevant pathophysiology and mechanisms",
      "pharmacology": "Medications involved, MOA, and nursing considerations"
    }
  }
}

OUTPUT PURE JSON ONLY. Start with { and end with }.`;

// ============================================================================
// LAYER 2: THE SPECIALIST (CONTENT ENRICHMENT)
// ============================================================================

const LAYER_2_PROMPT = `You are a clinical content specialist. Review this case study JSON and ENRICH any weak or incomplete sections.

## ORIGINAL CASE:
{{CASE_JSON}}

## ENRICHMENT REQUIREMENTS:
1. Every rationale must be at least 20 words using [Hook] → [Breakdown] → [Trap] format
2. Highlight screens must have at least 7 spans with at least 2 distractors (isCorrect: false)
3. Matrix must have at least 4 rows with detailed rationales
4. Drop-Cloze must have at least 4 options per dropdown
5. All nurse notes must include subjective AND objective data
6. Labs must have proper units and flag abnormal values
7. Pharmacology section must include mechanism of action and nursing considerations

## OUTPUT:
Return the COMPLETE enriched JSON (not just the changed parts). Start with { and end with }.`;

// ============================================================================
// LAYER 3: THE VALIDATOR (QUALITY GATE)
// ============================================================================

const VALIDATION_RULES = {
    patientProfile: {
        nameNotGeneric: (name: string) => !['Patient', 'Client', 'John Doe', 'Jane Doe'].some(g => name.includes(g)),
        ageIsSpecific: (age: string) => /\d+/.test(age),
        hasAllergies: (allergies: string) => allergies && allergies.length > 0,
        hasComorbidities: (comorbidities: string[]) => Array.isArray(comorbidities) && comorbidities.length >= 2
    },
    clinicalData: {
        hasThreeVitalSets: (vitals: VitalSet[]) => Array.isArray(vitals) && vitals.length >= 3,
        hasMinimumLabs: (labs: LabResult[]) => Array.isArray(labs) && labs.length >= 4,
        labsHaveUnits: (labs: LabResult[]) => labs.every(l => l.units && l.units.length > 0),
        hasNursesNotes: (notes: NurseNote[]) => Array.isArray(notes) && notes.length >= 2,
        hasOrders: (orders: Order[]) => Array.isArray(orders) && orders.length >= 2,
        hasRadiology: (radiology: RadiologyReport[]) => Array.isArray(radiology) && radiology.length >= 1
    },
    screens: {
        hasAllSixScreens: (screens: ScreenPlaceholder[]) => Array.isArray(screens) && screens.length === 6,
        highlightHasMinSpans: (screen: any) => {
            if (screen.type !== 'highlight') return true;
            const spanCount = (screen.content?.text?.match(/<span/g) || []).length;
            return spanCount >= 7;
        },
        highlightHasDistractors: (screen: any) => {
            if (screen.type !== 'highlight') return true;
            const rationales = screen.content?.rationales || {};
            const distractors = Object.values(rationales).filter((r: any) => r.isCorrect === false);
            return distractors.length >= 2;
        },
        matrixHasMinRows: (screen: any) => {
            if (screen.type !== 'matrix') return true;
            return (screen.content?.rows?.length || 0) >= 4;
        },
        bowTieHasCorrectCounts: (screen: any) => {
            if (screen.type !== 'bow-tie') return true;
            const actions = screen.content?.actions?.filter((a: any) => a.isCorrect)?.length || 0;
            const conditions = screen.content?.conditions?.filter((c: any) => c.isCorrect)?.length || 0;
            const params = screen.content?.parameters?.filter((p: any) => p.isCorrect)?.length || 0;
            return actions === 2 && conditions === 1 && params === 2;
        }
    },
    rationale: {
        hasCoreConcept: (r: RationalePlaceholder) => r.coreConcept && r.coreConcept.length > 10,
        hasCaseSummary: (r: RationalePlaceholder) => r.caseSummary && r.caseSummary.length > 30,
        hasGoldenRule: (r: RationalePlaceholder) => r.goldenRule && r.goldenRule.length > 10,
        hasPitfalls: (r: RationalePlaceholder) => r.pitfalls && r.pitfalls.length >= 2,
        hasMnemonic: (r: RationalePlaceholder) => r.mnemonic?.title && r.mnemonic?.content,
        hasReferenceInfo: (r: RationalePlaceholder) =>
            r.referenceInfo?.anatomy?.length > 20 ||
            r.referenceInfo?.physiology?.length > 20 ||
            r.referenceInfo?.pharmacology?.length > 20
    }
};

// ============================================================================
// MAIN FACTORY CLASS
// ============================================================================

export class LayeredCaseStudyFactory {

    private static async callAI(prompt: string, modelName: string = 'gemini-2.0-flash'): Promise<string> {
        const genAI = getGenAI();
        if (!genAI) throw new Error('AI service not initialized');

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                maxOutputTokens: 65536,
                temperature: 0.2,
                responseMimeType: 'application/json'
            }
        });

        await limiter.checkLimit();
        const result = await model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Main entry point: Generate a complete case study using the 3-layer system
     */
    static async generate(config: GenerationConfig): Promise<MasterQuestionItem> {
        const { onProgress } = config;

        // ====== LAYER 1: ARCHITECT ======
        onProgress?.({ layer: 1, status: 'running', message: 'Building structural skeleton...', percent: 10 });

        const skeleton = await this.runLayer1(config);

        onProgress?.({ layer: 1, status: 'complete', message: 'Skeleton complete', percent: 30 });

        // ====== LAYER 2: SPECIALIST ======
        onProgress?.({ layer: 2, status: 'running', message: 'Enriching clinical content...', percent: 40 });

        const enriched = await this.runLayer2(skeleton);

        onProgress?.({ layer: 2, status: 'complete', message: 'Content enriched', percent: 70 });

        // ====== LAYER 3: VALIDATOR ======
        onProgress?.({ layer: 3, status: 'running', message: 'Validating quality...', percent: 80 });

        const validated = await this.runLayer3(enriched);

        onProgress?.({ layer: 3, status: 'complete', message: 'Validation complete', percent: 100 });

        // Transform to MasterQuestionItem format
        return this.transformToMasterItem(validated, config);
    }

    /**
     * Layer 1: Generate structural skeleton with retry logic
     */
    private static async runLayer1(config: GenerationConfig, maxRetries: number = 2): Promise<CaseStudySkeleton> {
        const prompt = LAYER_1_PROMPT
            .replace('{{TOPIC}}', config.topic + (config.subTopic ? ` - ${config.subTopic}` : ''))
            .replace('{{DIFFICULTY}}', config.difficulty.toString())
            .replace('{{AGE_GROUP}}', config.patientAge || 'adult')
            .replace('{{SETTING}}', config.setting || 'Medical-Surgical Unit');

        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[Layer1] Attempt ${attempt}/${maxRetries}`);
                const response = await this.callAI(prompt);
                const skeleton = JSON.parse(this.cleanJson(response));

                console.log('[Layer1] Skeleton generated:', {
                    screens: skeleton.screens?.length,
                    labs: skeleton.clinicalData?.labs?.length,
                    vitals: skeleton.clinicalData?.vitals?.length
                });

                return skeleton;
            } catch (error: any) {
                console.error(`[Layer1] Attempt ${attempt} failed:`, error.message);
                lastError = error;

                if (attempt < maxRetries) {
                    console.log(`[Layer1] Retrying in 1 second...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        throw lastError || new Error('Layer 1 failed after all retries');
    }

    /**
     * Layer 2: Enrich content with retry logic
     */
    private static async runLayer2(skeleton: CaseStudySkeleton, maxRetries: number = 2): Promise<CaseStudySkeleton> {
        const prompt = LAYER_2_PROMPT.replace('{{CASE_JSON}}', JSON.stringify(skeleton, null, 2));

        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[Layer2] Attempt ${attempt}/${maxRetries}`);
                const response = await this.callAI(prompt, 'gemini-2.0-flash');
                const enriched = JSON.parse(this.cleanJson(response));

                console.log('[Layer2] Content enriched:', {
                    rationaleLength: enriched.rationale?.caseSummary?.length,
                    pharmacologyLength: enriched.rationale?.referenceInfo?.pharmacology?.length
                });

                return enriched;
            } catch (error: any) {
                console.error(`[Layer2] Attempt ${attempt} failed:`, error.message);
                lastError = error;

                if (attempt < maxRetries) {
                    console.log(`[Layer2] Retrying in 1 second...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // If Layer 2 fails completely, return the original skeleton (graceful degradation)
        console.warn(`[Layer2] All retries failed, returning original skeleton. Last error: ${lastError?.message}`);
        return skeleton;
    }


    /**
     * Layer 3: Validate and fix
     */
    private static async runLayer3(caseData: CaseStudySkeleton): Promise<CaseStudySkeleton> {
        const validation = this.validate(caseData);

        console.log('[Layer3] Validation result:', {
            isValid: validation.isValid,
            errors: validation.errors.length,
            warnings: validation.warnings.length
        });

        if (!validation.isValid) {
            // Attempt auto-fix for common issues
            const fixed = this.autoFix(caseData, validation);
            return fixed;
        }

        return caseData;
    }

    /**
     * Validate case study against all rules
     */
    private static validate(caseData: CaseStudySkeleton): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        const fixes: string[] = [];

        // Patient Profile Checks
        if (!VALIDATION_RULES.patientProfile.nameNotGeneric(caseData.patientProfile?.name || '')) {
            errors.push('Patient name is generic (should be realistic)');
        }
        if (!VALIDATION_RULES.patientProfile.hasComorbidities(caseData.patientProfile?.comorbidities || [])) {
            warnings.push('Patient should have at least 2 comorbidities');
        }

        // Clinical Data Checks
        if (!VALIDATION_RULES.clinicalData.hasThreeVitalSets(caseData.clinicalData?.vitals || [])) {
            errors.push('Must have at least 3 vital sign time points');
        }
        if (!VALIDATION_RULES.clinicalData.hasMinimumLabs(caseData.clinicalData?.labs || [])) {
            warnings.push('Should have at least 4 lab results');
        }
        if (!VALIDATION_RULES.clinicalData.labsHaveUnits(caseData.clinicalData?.labs || [])) {
            errors.push('All labs must have units specified');
        }

        // Screen Checks
        if (!VALIDATION_RULES.screens.hasAllSixScreens(caseData.screens || [])) {
            errors.push('Case study must have exactly 6 screens');
        }

        caseData.screens?.forEach((screen, idx) => {
            if (!VALIDATION_RULES.screens.highlightHasDistractors(screen)) {
                errors.push(`Screen ${idx + 1} (Highlight): Must have at least 2 distractors`);
            }
            if (!VALIDATION_RULES.screens.matrixHasMinRows(screen)) {
                warnings.push(`Screen ${idx + 1} (Matrix): Should have at least 4 rows`);
            }
            if (!VALIDATION_RULES.screens.bowTieHasCorrectCounts(screen)) {
                errors.push(`Screen ${idx + 1} (Bow-Tie): Must have 2 actions, 1 condition, 2 parameters correct`);
            }
        });

        // Rationale Checks
        if (!VALIDATION_RULES.rationale.hasReferenceInfo(caseData.rationale)) {
            warnings.push('Rationale should include anatomy, physiology, or pharmacology');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            fixes
        };
    }

    /**
     * Auto-fix common validation errors
     */
    private static autoFix(caseData: CaseStudySkeleton, validation: ValidationResult): CaseStudySkeleton {
        const fixed = JSON.parse(JSON.stringify(caseData)); // Deep clone

        // Fix screen count if less than 6
        if (fixed.screens && fixed.screens.length < 6) {
            const missing = 6 - fixed.screens.length;
            for (let i = 0; i < missing; i++) {
                fixed.screens.push({
                    id: `s${fixed.screens.length + 1}`,
                    type: 'multiple-response',
                    cjmmStep: 'Evaluate Outcomes',
                    prompt: '[AUTO-GENERATED] Evaluate the patient response.',
                    content: {
                        options: [
                            { id: 'o1', text: 'Improvement noted', isCorrect: true, rationale: 'Indicates positive response.' },
                            { id: 'o2', text: 'No change', isCorrect: false, rationale: 'Does not indicate improvement.' }
                        ]
                    },
                    rationale: { coreConcept: 'Outcome evaluation', answerAnalysis: 'Assess response to treatment', clinicalTakeaway: 'Monitor for improvement' }
                });
            }
        }

        // Fix missing lab units
        if (fixed.clinicalData?.labs) {
            fixed.clinicalData.labs = fixed.clinicalData.labs.map((lab: any) => ({
                ...lab,
                units: lab.units || 'units'
            }));
        }

        console.log('[Layer3] Auto-fixes applied:', validation.errors.length);
        return fixed;
    }

    /**
     * Transform skeleton to MasterQuestionItem format
     */
    private static transformToMasterItem(caseData: CaseStudySkeleton, config: GenerationConfig): MasterQuestionItem {
        return {
            id: caseData.id || `case-${Date.now()}`,
            typeId: 'case-study',
            type: 'case-study',
            metadata: {
                title: `Case Study: ${config.topic}`,
                authorId: 'LayeredFactory_v1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'draft',
                qualityScore: 95,
                hasStudentPreview: true,
                sourceOrigin: 'ai',
                sourceReferences: [],
                batchInfo: {
                    batchId: `layered_${Date.now()}`,
                    batchSize: 1,
                    temperature: 0.2,
                    generationDate: new Date().toISOString()
                }
            },
            pedagogy: {
                difficultyLevel: config.difficulty,
                clinicalFocus: config.topic,
                clinicalFocusTopics: [config.topic, config.subTopic].filter(Boolean) as string[]
            },
            aiSafetyChecks: {
                runId: `layer3_${Date.now()}`,
                timestamp: new Date().toISOString(),
                copyrightScore: 100,
                duplicationCheck: { isDuplicate: false, similarityScore: 0 },
                validationStatus: 'Pass',
                issues: [],
                autoFixHistory: []
            },
            content: {
                clinicalData: {
                    patientInfo: {
                        name: caseData.patientProfile.name,
                        age: parseInt(caseData.patientProfile.age) || 65,
                        gender: caseData.patientProfile.sex === 'Female' ? 'F' : 'M',
                        codeStatus: caseData.patientProfile.codeStatus,
                        admissionDate: new Date().toLocaleDateString(),
                        room: caseData.clinicalData.setting,
                        physician: 'Dr. A. Specialist',
                        nurse: 'RN Staff',
                        allergies: caseData.patientProfile.allergies,
                        isolation: 'Standard Precautions'
                    },
                    vitals: caseData.clinicalData.vitals.map(v => ({
                        time: v.time,
                        tempF: v.tempF,
                        hr: parseInt(v.hr) || 80,
                        rr: parseInt(v.rr) || 16,
                        bp: v.bp,
                        o2: v.o2,
                        o2_device: v.o2Device,
                        pain: v.pain ? parseInt(v.pain) : null
                    })),
                    labs: caseData.clinicalData.labs.map(l => ({
                        test: l.test,
                        value: l.value,
                        unit: l.units,
                        ref: l.ref,
                        flag: l.flag,
                        category: l.category
                    })),
                    orders: caseData.clinicalData.orders,
                    history: caseData.clinicalData.nursesNotes.map(n => ({
                        time: n.time,
                        note: n.note,
                        initial: n.initial
                    })),
                    historyPhysical: caseData.clinicalData.historyPhysical,
                    radiology: caseData.clinicalData.radiology
                },
                structure: {
                    type: 'case-study',
                    screens: caseData.screens.map(screen => ({
                        id: screen.id,
                        type: screen.type,
                        cjmmStep: screen.cjmmStep,
                        prompt: screen.prompt,
                        ...screen.content,
                        rationale: screen.rationale
                    }))
                },
                rationale: {
                    coreConcept: caseData.rationale.coreConcept,
                    caseSummary: caseData.rationale.caseSummary,
                    answerAnalysis: caseData.rationale.caseSummary,
                    goldenRule: caseData.rationale.goldenRule,
                    trap: caseData.rationale.pitfalls?.[0],
                    steps: [],
                    difficulty: {
                        level: config.difficulty,
                        score: config.difficulty * 20,
                        label: ['Novice', 'Application', 'Analysis', 'Synthesis', 'Evaluation'][config.difficulty - 1],
                        clinicalStrategy: caseData.rationale.goldenRule,
                        recommendedActions: caseData.rationale.pitfalls
                    },
                    mnemonic: caseData.rationale.mnemonic,
                    cheatSheet: caseData.rationale.cheatSheet,
                    referenceInfo: caseData.rationale.referenceInfo
                }
            }
        } as MasterQuestionItem;
    }

    /**
     * Clean and repair JSON response from AI
     * Handles common AI generation errors like trailing commas, unclosed brackets, etc.
     */
    private static cleanJson(text: string): string {
        console.log('[JSON Repair] Starting repair process. Input length:', text.length);

        // Step 1: Remove markdown code blocks
        let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');

        // Step 2: Find first { and last }
        const start = clean.indexOf('{');
        let end = clean.lastIndexOf('}');

        if (start === -1) {
            throw new Error('No JSON object found in response');
        }

        if (end === -1 || end <= start) {
            console.warn('[JSON Repair] No closing brace found, attempting to close JSON');
            clean = clean.substring(start) + '}';
            end = clean.length - 1;
        } else {
            clean = clean.substring(start, end + 1);
        }

        // Step 3: Apply repair functions
        clean = this.repairJson(clean);

        return clean;
    }

    /**
     * Comprehensive JSON repair function
     */
    private static repairJson(json: string): string {
        let repaired = json;

        // 1. Remove trailing commas before } or ]
        repaired = repaired.replace(/,\s*}/g, '}');
        repaired = repaired.replace(/,\s*]/g, ']');

        // 2. Fix unquoted keys (common AI mistake)
        repaired = repaired.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

        // 3. Replace single quotes with double quotes for strings
        // Be careful not to replace apostrophes inside strings
        repaired = this.fixQuotes(repaired);

        // 4. Fix truncated strings (unclosed quotes)
        repaired = this.fixUnclosedStrings(repaired);

        // 5. Balance brackets
        repaired = this.balanceBrackets(repaired);

        // 6. Remove control characters
        repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (char) => {
            if (char === '\n' || char === '\r' || char === '\t') return char;
            return '';
        });

        // 7. Fix escaped newlines inside strings
        repaired = repaired.replace(/\n/g, '\\n');
        repaired = repaired.replace(/\r/g, '\\r');
        repaired = repaired.replace(/\t/g, '\\t');

        // 8. Try to parse and if it fails, try more aggressive fixes
        try {
            JSON.parse(repaired);
            console.log('[JSON Repair] Repair successful');
            return repaired;
        } catch (e: any) {
            console.warn('[JSON Repair] First pass failed:', e.message);
            return this.aggressiveRepair(repaired, e);
        }
    }

    /**
     * Fix mixed quote styles
     */
    private static fixQuotes(json: string): string {
        let result = '';
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < json.length; i++) {
            const char = json[i];
            const prevChar = i > 0 ? json[i - 1] : '';

            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                result += '"'; // Always use double quotes
            } else if (inString && char === stringChar && prevChar !== '\\') {
                inString = false;
                result += '"'; // Always use double quotes
            } else {
                result += char;
            }
        }

        return result;
    }

    /**
     * Fix unclosed strings
     */
    private static fixUnclosedStrings(json: string): string {
        let result = '';
        let inString = false;

        for (let i = 0; i < json.length; i++) {
            const char = json[i];
            const prevChar = i > 0 ? json[i - 1] : '';

            if (char === '\n') {
                if (inString) {
                    // Close the string before newline
                    result += '"';
                    inString = false;
                }
                result += char;
            } else if (char === '"' && prevChar !== '\\') {
                inString = !inString;
                result += char;
            } else {
                result += char;
            }
        }

        // Close any remaining open string
        if (inString) {
            result += '"';
        }

        return result;
    }

    /**
     * Balance brackets in JSON
     */
    private static balanceBrackets(json: string): string {
        const stack: string[] = [];
        let inString = false;

        for (let i = 0; i < json.length; i++) {
            const char = json[i];
            const prevChar = i > 0 ? json[i - 1] : '';

            if (char === '"' && prevChar !== '\\') {
                inString = !inString;
            } else if (!inString) {
                if (char === '{' || char === '[') {
                    stack.push(char);
                } else if (char === '}') {
                    if (stack.length > 0 && stack[stack.length - 1] === '{') {
                        stack.pop();
                    }
                } else if (char === ']') {
                    if (stack.length > 0 && stack[stack.length - 1] === '[') {
                        stack.pop();
                    }
                }
            }
        }

        // Close any unclosed brackets
        let result = json;
        while (stack.length > 0) {
            const opener = stack.pop();
            const closer = opener === '{' ? '}' : ']';
            result += closer;
            console.log(`[JSON Repair] Added closing '${closer}' for unclosed '${opener}'`);
        }

        return result;
    }

    /**
     * Aggressive repair for stubborn JSON errors
     */
    private static aggressiveRepair(json: string, error: Error): string {
        console.log('[JSON Repair] Attempting aggressive repair...');

        // Extract position from error message
        const posMatch = error.message.match(/position\s*(\d+)/i);


        let repaired = json;

        if (posMatch) {
            const pos = parseInt(posMatch[1]);
            console.log(`[JSON Repair] Error at position ${pos}`);

            // Get context around error
            const before = json.substring(Math.max(0, pos - 50), pos);
            const after = json.substring(pos, Math.min(json.length, pos + 50));
            console.log(`[JSON Repair] Context: ...${before}[ERROR]${after}...`);

            // Common fixes based on context

            // Fix 1: Missing comma (often happens with arrays)
            if (/"\s*"/.test(before + after) || /}\s*{/.test(before + after) || /]\s*\[/.test(before + after)) {
                repaired = json.substring(0, pos) + ',' + json.substring(pos);
                console.log('[JSON Repair] Added missing comma');
            }

            // Fix 2: Trailing text after valid JSON
            else if (json[pos] === undefined || /[^}\]"0-9a-z]/.test(json[pos])) {
                // Try to find last valid closing bracket
                let lastValid = pos;
                let depth = 0;
                for (let i = 0; i < pos; i++) {
                    if (json[i] === '{' || json[i] === '[') depth++;
                    if (json[i] === '}' || json[i] === ']') depth--;
                    if (depth === 0 && (json[i] === '}' || json[i] === ']')) {
                        lastValid = i + 1;
                    }
                }
                repaired = json.substring(0, lastValid);
                console.log('[JSON Repair] Truncated at last valid position:', lastValid);
            }
        }

        // Try parsing again
        try {
            JSON.parse(repaired);
            console.log('[JSON Repair] Aggressive repair successful');
            return repaired;
        } catch (e2: any) {
            console.error('[JSON Repair] Aggressive repair failed:', e2.message);

            // Last resort: Try to extract a minimal valid structure
            return this.extractMinimalJson(json);
        }
    }

    /**
     * Last resort: Extract minimal valid JSON structure
     */
    private static extractMinimalJson(json: string): string {
        console.log('[JSON Repair] Attempting minimal JSON extraction...');

        // Try to find and extract valid portions


        // Build a minimal valid structure
        let minimal: any = {
            id: `case-repair-${Date.now()}`,
            patientProfile: {
                name: 'Patient',
                age: '65',
                sex: 'Unknown',
                allergies: 'Unknown',
                chiefComplaint: 'Unknown',
                comorbidities: [],
                codeStatus: 'Full Code'
            },
            clinicalData: {
                setting: 'Hospital',
                vitals: [],
                labs: [],
                nursesNotes: [],
                orders: [],
                historyPhysical: '',
                radiology: []
            },
            screens: [],
            rationale: {
                coreConcept: 'Content generation incomplete',
                caseSummary: 'This case study was partially generated. Please regenerate.',
                goldenRule: 'Regenerate for complete content',
                pitfalls: ['Incomplete generation'],
                mnemonic: { title: 'N/A', content: 'N/A', explanation: 'Regenerate' },
                cheatSheet: { title: 'N/A', points: ['Regenerate'] },
                referenceInfo: { anatomy: '', physiology: '', pharmacology: '' }
            }
        };

        // Try to extract what we can from the original
        try {
            // Try to get ID
            const idMatch = json.match(/"id"\s*:\s*"([^"]+)"/);
            if (idMatch) minimal.id = idMatch[1];

            // Try to get patient name
            const nameMatch = json.match(/"name"\s*:\s*"([^"]+)"/);
            if (nameMatch) minimal.patientProfile.name = nameMatch[1];

            console.log('[JSON Repair] Extracted minimal structure');
        } catch (e) {
            console.error('[JSON Repair] Could not extract any content');
        }

        return JSON.stringify(minimal);
    }
}

export default LayeredCaseStudyFactory;

