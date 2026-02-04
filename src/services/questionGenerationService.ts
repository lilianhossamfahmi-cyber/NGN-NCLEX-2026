
import { GenerationSettings, MasterQuestionItem, ReferenceSource } from '../types/master-schema';
import { AppConfig, getGenAI, limiter } from '../config/apiConfig';
import { getQuestionType } from '../registry/index';
import { ItemIngestionService } from './ingestion/ItemIngestionService';

/**
 * Question Generation Service v2.2
 * Supports: Live Gemini Integration, Mix-All logic, and Mock Fallback with Rich Content.
 */

// genAI and USE_MOCK are now initialized inside generateQuestions to support key rotation.


interface GenerationResponse {
    success: boolean;
    data?: MasterQuestionItem[];
    error?: string;
}

/**
 * Generates NGN questions based on new schema (Difficulty 1-5, General Mix).
 */
export const generateQuestions = async (
    settings: GenerationSettings,
    references: ReferenceSource[],
    onProgress?: (status: string) => void,
    signal?: AbortSignal
): Promise<GenerationResponse> => {

    // 1. Resolve Mix-All Logic
    const resolvedTypes = resolveTargetTypes(settings.targetTypes);
    const totalCount = resolvedTypes.length * settings.quantityPerType;

    // 0. Initialize AI Service (Enables Key Rotation)
    const genAI = getGenAI();
    const useMock = !genAI || !AppConfig.features.aiGeneration;

    if (signal?.aborted) return { success: false, error: "Generation Cancelled" };

    if (useMock) {
        console.warn('Configuration forces Mock Mode (missing API Key or Feature Flag)');
        return generateMockItems(settings, resolvedTypes, onProgress, signal);
    }

    if (!genAI) {
        return { success: false, error: "AI Service Not Initialized (Missing API Key?)" };
    }

    try {
        const prompt = buildDetailedPrompt(settings, references, resolvedTypes);

        if (onProgress) onProgress(`Synthesizing ${totalCount} items (Level ${settings.difficultyLevel})...`);

        let responseText = '';

        // MODEL RECOVERY STRATEGY: Try strict list of models until one works or we run out.
        // UPDATED: User has access to Gemini 2.0/2.5 series, not 1.5.
        const candidateModels = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-exp",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-pro-latest"
        ];

        let lastError = null;

        for (const modelName of candidateModels) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            try {
                if (onProgress) onProgress(`Attempting generation with model: ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        maxOutputTokens: 65536, // DOUBLED: To avoid any truncation in complex cases
                        temperature: 0.2,
                        responseMimeType: "application/json"
                    }
                });
                await limiter.checkLimit(); // Enforce Rate Limit

                // Using a manual race for abort signal support
                const result = await Promise.race([
                    model.generateContent(prompt),
                    new Promise<never>((_, reject) => {
                        if (signal) {
                            signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
                        }
                    })
                ]) as any; // Type casting as race result

                responseText = result.response.text();
                // If we get here, it worked!
                lastError = null;
                break;
            } catch (err: any) {
                if (err.name === 'AbortError') throw err; // Re-throw abort immediately

                console.warn(`Model ${modelName} failed:`, err.message);
                lastError = err;
                // If it's a 404 (Not Found), we continue to next model.
                // If it's a 429 (Quota), we might want to stop, but for now continue.
                if (!err.message.includes('404') && !err.message.includes('not found')) {
                    // If it's NOT a "not found" error (e.g. auth error), maybe we should stop?
                    // But to be safe, let's keep trying other models just in case.
                }
            }
        }

        if (lastError) {
            throw lastError; // Throw the last error if all candidates failed
        }

        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        if (onProgress) onProgress("Running AI Validation & Logic Checks...");

        const cleanJson = extractJsonFromMarkdown(responseText);
        let generatedItems: MasterQuestionItem[] = [];

        try {
            const parsed = JSON.parse(cleanJson);
            if (Array.isArray(parsed)) {
                generatedItems = parsed;
            } else if (parsed.items && Array.isArray(parsed.items)) {
                generatedItems = parsed.items;
            } else {
                // Handle single object response (common for Case Studies)
                generatedItems = [parsed];
            }
        } catch (parseError) {
            console.error("FAILED JSON PARSE. RAW TEXT LENGTH:", responseText.length);
            console.error("END OF TEXT:", responseText.slice(-200));
            return { success: false, error: "AI produced invalid JSON structure (Possibly truncated)." };
        }

        // 2. Post-Process, Hydrate, and strictly Ingest (Normalizes + AI Auto-Fill)
        const processed = await Promise.all(generatedItems.map(async item => {
            const hydrated = processGeneratedItem(item, settings);
            return ItemIngestionService.ingest(hydrated);
        }));

        return { success: true, data: processed };

    } catch (error: any) {
        if (error.name === 'AbortError' || error.message === 'Aborted') {
            return { success: false, error: "Generation Cancelled" };
        }
        return { success: false, error: error.message || "AI Generation Failed" };
    }
};

/**
 * HELPER: Resolves 'mix-all' to random specific types.
 */
const resolveTargetTypes = (types: string[]): string[] => {
    if (types.includes('mix-all') || types.includes('general-mix')) {
        // Known NGN types (All 7 updated types)
        const allTypes = [
            'case-study-6-screen',
            'bowtie-standalone',
            'trend-standalone',
            'cloze-dropdown',
            'drop-cloze',
            'highlight-text',
            'matrix-mr',
            'ordered-response',
            'multiple-response-sata',
            'hot-spot',
            'calculation'
        ];
        return allTypes;
    }
    return types;
};

/**
 * MOCK GENERATOR (High Fidelity) - UPDATED FOR ULTIMATE RATIONALE SCHEMA
 */
const generateMockItems = async (settings: GenerationSettings, types: string[], onProgress?: (s: string) => void, signal?: AbortSignal): Promise<GenerationResponse> => {
    if (signal?.aborted) return { success: false, error: "Generation Cancelled" };
    if (onProgress) onProgress(`Simulating Batch Generation of ${types.length * settings.quantityPerType} items...`);

    try {
        await new Promise<void>((resolve, reject) => {
            if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));

            const timer = setTimeout(() => resolve(), 1200);

            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timer);
                    reject(new DOMException('Aborted', 'AbortError'));
                });
            }
        });
    } catch (e: any) {
        if (e.name === 'AbortError') return { success: false, error: "Generation Cancelled" };
        throw e;
    }

    const newItems: MasterQuestionItem[] = [];

    types.forEach(typeId => {
        const typeDef = getQuestionType(typeId);
        if (!typeDef) return;

        for (let i = 0; i < settings.quantityPerType; i++) {
            // 1. Auto-Describe Scenario
            const focus = settings.customClinicalFocus || settings.clinicalFocus[0] || 'General';
            const isPeds = focus.toLowerCase().includes('pediatric');
            const age = isPeds ? '6-year-old' : '72-year-old';
            const scenarioTitle = `Acute ${focus} Scenario - ${age} Patient`;

            // 2. Generate Professional Clinical Data (5-Sections)
            const DIAGNOSIS_MAP: Record<string, string> = {
                'Respiratory': 'Bacterial Pneumonia',
                'Cardiovascular': 'Acute Decompensated Heart Failure',
                'Neurological': 'Acute Ischemic Stroke',
                'Pediatrics': 'Viral Bronchiolitis',
                'Surgical': 'Post-Operative Sepsis',
                'Gastrointestinal': 'Small Bowel Obstruction',
                'Mental Health': 'Major Depressive Disorder',
                'General': 'Sepsis secondary to UTI'
            };
            // Fuzzy match or default
            const foundKey = Object.keys(DIAGNOSIS_MAP).find(k => focus.includes(k)) || 'General';
            const relevantDiagnosis = DIAGNOSIS_MAP[foundKey] || `Acute ${focus} Condition`;

            const clinicalData = {
                patientInfo: {
                    name: isPeds ? 'Timmy Barker' : 'Martha Jenkins',
                    age: age,
                    dob: isPeds ? '05/12/2019' : '02/10/1953',
                    sex: isPeds ? 'Male' : 'Female',
                    gender: isPeds ? 'Male' : 'Female', // Compat
                    mrn: `MRN: 00${Math.floor(Math.random() * 899999 + 100000)}`,
                    diagnosis: relevantDiagnosis,
                    ward: 'Medical-Surgical Unit',
                    bed: 'Bed 12B',
                    allergies: 'Penicillin (Rash)',
                    codeStatus: 'Full Code',
                    provider: 'Dr. A. Smith',
                    adminDate: '03/15/2025 0800'
                },

                // 1. Nurses Notes (Time-stamped, structured)
                history: `03/15/2025 1400 – J.D., R.N.\nClient reports increasing shortness of breath and chest tightness. Appears anxious. Lung sounds: coarse crackles in bilateral lower lobes. Oxygen increased to 4 L/min via nasal cannula. SpO₂ now 93%.`,

                // 2. History & Physical (Professional, No Abbr, Bold Headers)
                historyPhysical: `<b>Chief Complaint:</b> Shortness of breath and fever found in ${age} patient.\n<b>History of Present Illness:</b> Client presents with a 3-day history of productive cough, fever up to 102 degrees Fahrenheit, and worsening shortness of breath today.\n<b>Past Medical History:</b> Hypertension, Type 2 Diabetes Mellitus.\n<b>Past Surgical History:</b> Appendectomy (2010).\n<b>Current Medications:</b> Lisinopril 10 milligrams daily, Metformin 500 milligrams twice daily.\n<b>Allergies:</b> Penicillin (causes rash).\n<b>Social History:</b> Lives with spouse, non-smoker.\n<b>Physical Examination:</b> Client is alert, short of breath, using accessory muscles. Coarse crackles heard in bilateral lower lung lobes.`,

                // 3. Vitals (Structured Array)
                vitals: [
                    { time: '0800', tempF: 99.1, tempC: 37.3, hr: 98, rr: 20, bp: '130/82', o2: '96% RA' },
                    { time: '1200', tempF: 101.5, tempC: 38.6, hr: 110, rr: 24, bp: '125/78', o2: '93% RA' },
                    { time: '1400', tempF: 102.2, tempC: 39.0, hr: 118, rr: 28, bp: '110/70', o2: '91% 2L NC' }
                ],

                // 4. Lab Results (Structured Array)
                labs: [
                    { test: "WBC", value: "15.2", units: "K/µL", ref: "5.0-10.0", flag: "H", category: "Hematology" },
                    { test: "Lactate", value: "3.4", units: "mmol/L", ref: "0.5-2.2", flag: "H", category: "Chemistry" }
                ],

                // 5. Medical Orders (Structured Array)
                orders: [
                    { order: "Normal saline 0.9%", dose: "1,000 mL", route: "IV bolus", freq: "STAT", status: "Active", indication: "Resuscitation" },
                    { order: "Ceftriaxone", dose: "1 g", route: "IV", freq: "q24h", status: "Active", indication: "Infection" }
                ],

                // 6. Radiology (Structured Array)
                radiology: [
                    { study: "Chest X-ray", findings: "Diffuse bilateral infiltrates.", impression: "Suggestive of pneumonia.", date: "03/15/2025 1000" }
                ]
            };

            // 3. Generate Structure/Options based on Type (with Variation)
            const structure = generateMockStructure(typeId, focus);

            // 4. Inject High-Level Rationale Object if missing (for legacy or top-level)
            const rationale = createMockRationale(focus, "Sepsis Management", "Prioritize ABCs and fluid resuscitation.");

            newItems.push({
                id: crypto.randomUUID(),
                typeId: typeId,
                metadata: {
                    title: `${typeDef.typeName}: ${structure.titleVariant || scenarioTitle} (Var ${i + 1})`,
                    authorId: 'AI_Gen_v2',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'draft',
                    sourceOrigin: settings.mode,
                    sourceReferences: settings.selectedReferenceIds,
                    qualityScore: 92,
                    hasStudentPreview: true,
                    batchInfo: {
                        batchId: crypto.randomUUID(),
                        batchSize: types.length * settings.quantityPerType,
                        temperature: settings.temperature,
                        generationDate: new Date().toISOString()
                    }
                },
                pedagogy: {
                    difficultyLevel: settings.difficultyLevel,
                    clinicalFocus: focus,
                    clinicalFocusTopics: ['Safety', 'Prioritization']
                },
                aiSafetyChecks: {
                    runId: crypto.randomUUID(),
                    timestamp: new Date().toISOString(),
                    copyrightScore: 99,
                    duplicationCheck: { isDuplicate: false, similarityScore: 12 },
                    validationStatus: 'Pass',
                    issues: [],
                    autoFixHistory: []
                },
                content: {
                    quickStart: { summary: `Scenario variant focusing on ${structure.focusVariant || focus}.` },
                    clinicalData: clinicalData,
                    structure: structure,
                    rationale: rationale // Top-level rationale
                }
            });
        }
    });

    return { success: true, data: newItems };
}

// Helper to create the complex rationale object
const createMockRationale = (topic: string, summary: string, breakdown: string) => ({
    coreConcept: topic,
    caseSummary: summary,
    answerAnalysis: breakdown,
    trap: "The 'Fix-It' Trap: Don't jump to interventions before assessment.",
    goldenRule: "Always assess before you address.",
    steps: [
        { tag: "Recognize", description: "Identify abnormal cues." },
        { tag: "Analyze", description: "Connect cues to condition." },
        { tag: "Action", description: "Prioritize life-saving interventions." }
    ],
    mnemonic: { title: "ABC", content: "Airway, Breathing, Circulation", explanation: "Primary survey." },
    cheatSheet: { title: "Clinical Pearls", points: ["Point 1", "Point 2", "Point 3"] },
    referenceInfo: { anatomy: "Relevant anatomy.", physiology: "Relevant physiology.", pharm: "Relevant meds." },
    difficulty: {
        score: 60,
        level: 3,
        label: "Analysis",
        clinicalStrategy: "Prioritize using ABC framework.",
        recommendedActions: ["Review pathophysiology", "Practice prioritization"]
    }
});

const generateMockStructure = (typeId: string, _focus: string): any => {
    const variant = Math.floor(Math.random() * 2);

    // 0. Case Study (6-Screen)
    if (typeId.includes('case-study')) {
        // Variant 0: Sepsis
        if (variant === 0) {
            return {
                type: 'case-study',
                titleVariant: 'Sepsis Progression',
                focusVariant: 'Sepsis',
                screens: [
                    {
                        type: 'highlight',
                        cjmmStep: 'Recognize Cues',
                        prompt: 'Highlight the findings that require immediate follow-up.',
                        // Gold Standard: 50-80 words
                        text: 'Client is <span id="h1">diaphoretic</span> and <span id="h2">confused</span> upon arrival. Family reports the client has been complaining of <span id="h3">stable bowel sounds</span> and general malaise for two days. Initial assessment reveals <span id="h4">tachycardia</span> (HR 120), <span id="h5">warm, flushed skin</span>, and a temperature of 102.5°F. The client appears anxious and is attempting to remove the oxygen mask repeatedly, indicating potential hypoxia or delirium involved in the presentation.',
                        correct: ["h1", "h2", "h4", "h5"],
                        decoys: ["h3"],
                        rationales: {
                            h1: { isCorrect: true, whyCorrect: "Sign of sympathetic discharge/shock.", whyIncorrect: "N/A" },
                            h2: { isCorrect: true, whyCorrect: "Indicates brain hypoperfusion.", whyIncorrect: "N/A" },
                            h3: { isCorrect: false, whyCorrect: "N/A", whyIncorrect: "Normal finding, not urgent." },
                            h4: { isCorrect: true, whyCorrect: "Compensatory mechanism for shock.", whyIncorrect: "N/A" },
                            h5: { isCorrect: true, whyCorrect: "Vasodilation from infection.", whyIncorrect: "N/A" }
                        },
                        rationale: createMockRationale("Urgent Cues", "Recognize shock signs.", "Confusion, sweating, and high HR are ominous.")
                    },
                    {
                        type: 'matrix',
                        cjmmStep: 'Analyze Cues',
                        prompt: 'Assess Sepsis vs Heart Failure findings.',
                        columns: [{ id: 'c1', text: 'Sepsis' }, { id: 'c2', text: 'Heart Failure' }],
                        // Gold Standard: 4-6 Rows
                        rows: [
                            { id: 'r1', text: 'Fever 102.2°F', correctColumnId: 'c1', rationale: 'Sign of infection.' },
                            { id: 'r2', text: 'BNP 1200', correctColumnId: 'c2', rationale: 'Sign of HF.' },
                            { id: 'r3', text: 'Lactate 4.0 mmol/L', correctColumnId: 'c1', rationale: 'Anaerobic metabolism (Sepsis).' },
                            { id: 'r4', text: 'S3 Gallop', correctColumnId: 'c2', rationale: 'Fluid overload (HF).' }
                        ],
                        rationale: createMockRationale("Sepsis vs HF", "Distinguish fever from fluid overload.", "Fever points to sepsis; BNP points to HF.")
                    },
                    {
                        type: 'ordered-response',
                        cjmmStep: 'Prioritize Hypotheses',
                        prompt: 'Prioritize Antibiotic Administration Steps.',
                        orderedOptions: [
                            { id: 's1', text: 'Check Allergies', rationale: 'Safety first.' },
                            { id: 's2', text: 'Draw Blood Cultures', rationale: 'Before Abx.' },
                            { id: 's3', text: 'Administer Antibiotics', rationale: 'Within 1 hour.' }
                        ],
                        rationale: createMockRationale("Sepsis Bundle", "Time is tissue.", "Follow the bundle order.")
                    },
                    {
                        type: 'bow-tie',
                        cjmmStep: 'Generate Solutions',
                        prompt: 'Sepsis Management',
                        actions: [{ id: 'a1', text: 'Fluids 30mL/kg', isCorrect: true }, { id: 'a2', text: 'Broad Spectrum Abx', isCorrect: true }, { id: 'a3', text: 'Diuretics', isCorrect: false }, { id: 'a4', text: 'Beta Blockers', isCorrect: false }, { id: 'a5', text: 'Hold Fluids', isCorrect: false }],
                        conditions: [{ id: 'c1', text: 'Septic Shock', isCorrect: true }, { id: 'c2', text: 'Cardiogenic Shock', isCorrect: false }, { id: 'c3', text: 'Anaphylaxis', isCorrect: false }, { id: 'c4', text: 'Neurogenic Shock', isCorrect: false }],
                        parameters: [{ id: 'p1', text: 'MAP > 65', isCorrect: true }, { id: 'p2', text: 'Lactate < 2', isCorrect: true }, { id: 'p3', text: 'CVP', isCorrect: false }, { id: 'p4', text: 'HR < 60', isCorrect: false }, { id: 'p5', text: 'Temp < 96', isCorrect: false }],
                        rationale: createMockRationale("Clinical Judgment", "Connect Sepsis to Fluids causing improved MAP.", "Fluids fix the pipes.")
                    },
                    {
                        type: 'drop-cloze',
                        cjmmStep: 'Take Action',
                        prompt: 'Complete the care plan.',
                        sentences: [{
                            text: 'The priority is to restore %{d1} using %{d2}.',
                            dropdowns: [
                                // Gold Standard: 3-5 Options per dropdown
                                {
                                    id: 'd1',
                                    options: [
                                        { id: 'o1', text: 'Perfusion', isCorrect: true },
                                        { id: 'o2', text: 'Comfort', isCorrect: false },
                                        { id: 'o3', text: 'Mobility', isCorrect: false }
                                    ]
                                },
                                {
                                    id: 'd2',
                                    options: [
                                        { id: 'o4', text: 'IV Fluids', isCorrect: true },
                                        { id: 'o5', text: 'Antipyretics', isCorrect: false },
                                        { id: 'o6', text: 'Analgesics', isCorrect: false }
                                    ]
                                }
                            ]
                        }],
                        blankMap: {
                            d1: { correctOptionId: 'o1', whyCorrect: 'Perfusion is life-sustaining.', distractorRationales: { o2: 'Comfort is secondary.', o3: 'Mobility is unsafe.' } },
                            d2: { correctOptionId: 'o4', whyCorrect: 'Fluids restore volume.', distractorRationales: { o5: 'Fever is not the primary threat.', o6: 'Pain is not priority.' } }
                        },
                        rationale: createMockRationale("Planning", "Perfusion is key.", "Restore flow.")
                    },
                    {
                        type: 'multiple-response',
                        cjmmStep: 'Evaluate Outcomes',
                        prompt: 'Which findings indicate improvement? Select all that apply.',
                        options: [
                            { id: 'o1', text: 'MAP > 65 mmHg', isCorrect: true, rationale: 'Perfusion goal met.' },
                            { id: 'o2', text: 'Lactate 1.5 mmol/L', isCorrect: true, rationale: 'Aerobic metabolism restored.' },
                            { id: 'o3', text: 'Urine output 0.2 mL/kg/hr', isCorrect: false, rationale: 'Indicates retained failure.' },
                            { id: 'o4', text: 'HR 110 bpm', isCorrect: false, rationale: 'Still tachycardic.' },
                            { id: 'o5', text: 'Alert and Oriented', isCorrect: true, rationale: 'Brain perfusion improved.' }
                        ],
                        rationale: createMockRationale("Evaluation", "Goals met.", "MAP and Lactate normalized.")
                    }
                ]
            };
        } else {
            // Variant 1: Heart Failure (Simplified but strict)
            return {
                type: 'case-study',
                titleVariant: 'Acute Heart Failure',
                focusVariant: 'Heart Failure',
                screens: [
                    { type: 'highlight', cjmmStep: 'Recognize Cues', prompt: 'Highlight urgent cues.', text: 'Patient has <span id="h1">frothy sputum</span> and <span id="h2">bibasilar crackles</span>. Dyspnea is worsening despite <span id="h3">sitting upright</span>. O2 sat is <span id="h4">88% on RA</span>.', correct: ['h1', 'h2', 'h4'], decoys: ['h3'], rationales: { h1: { isCorrect: true, whyCorrect: 'Edema.', whyIncorrect: 'N/A' }, h2: { isCorrect: true, whyCorrect: 'Fluid.', whyIncorrect: 'N/A' }, h3: { isCorrect: false, whyCorrect: 'N/A', whyIncorrect: 'Appropriate position.' }, h4: { isCorrect: true, whyCorrect: 'Hypoxia.', whyIncorrect: 'N/A' } }, rationale: createMockRationale('Assess', 'Edema', 'Frothy sputum.') },
                    { type: 'matrix', cjmmStep: 'Analyze Cues', prompt: 'Right vs Left HF', columns: [{ id: 'c1', text: 'Right' }, { id: 'c2', text: 'Left' }], rows: [{ id: 'r1', text: 'JVD', correctColumnId: 'c1', rationale: 'Systemic.' }, { id: 'r2', text: 'Lung Crackles', correctColumnId: 'c2', rationale: 'Lungs.' }, { id: 'r3', text: 'Peripheral Edema', correctColumnId: 'c1', rationale: 'Systemic.' }, { id: 'r4', text: 'Orthopnea', correctColumnId: 'c2', rationale: 'Lungs.' }], rationale: createMockRationale('Analyze', 'Side', 'JVD=Right.') },
                    { type: 'ordered-response', cjmmStep: 'Prioritize Hypotheses', prompt: 'Actions', orderedOptions: [{ id: 's1', text: 'Sit Up', rationale: 'Breathing.' }, { id: 's2', text: 'O2', rationale: 'Hypoxia.' }, { id: 's3', text: 'Diuretics', rationale: 'Fluid.' }], rationale: createMockRationale('Priority', 'Position', 'High Fowlers.') },
                    { type: 'bow-tie', cjmmStep: 'Generate Solutions', prompt: 'Diagram', actions: [{ id: 'a1', text: 'Diuretics', isCorrect: true }, { id: 'a2', text: 'Restrict Fluids', isCorrect: true }, { id: 'a3', text: 'Beta Blocker', isCorrect: false }, { id: 'a4', text: 'Fluids', isCorrect: false }, { id: 'a5', text: 'Digoxin', isCorrect: false }], conditions: [{ id: 'c1', text: 'Fluid Overload', isCorrect: true }, { id: 'c2', text: 'Dehydration', isCorrect: false }, { id: 'c3', text: 'Sepsis', isCorrect: false }, { id: 'c4', text: 'Anemia', isCorrect: false }], parameters: [{ id: 'p1', text: 'Clear Lungs', isCorrect: true }, { id: 'p2', text: 'Weight Loss', isCorrect: true }, { id: 'p3', text: 'Fever', isCorrect: false }, { id: 'p4', text: 'HR increase', isCorrect: false }, { id: 'p5', text: 'BP decrease', isCorrect: false }], rationale: createMockRationale('Solution', 'Diurese', 'Remove fluid.') },
                    { type: 'drop-cloze', cjmmStep: 'Take Action', prompt: 'Administer...', sentences: [{ text: 'Give %{d1} to treat %{d2}.', dropdowns: [{ id: 'd1', options: [{ id: 'o1', text: 'Lasix', isCorrect: true }, { id: 'o2', text: 'Fluids', isCorrect: false }, { id: 'o3', text: 'Aspirin', isCorrect: false }] }, { id: 'd2', options: [{ id: 'o4', text: 'Edema', isCorrect: true }, { id: 'o5', text: 'Pain', isCorrect: false }, { id: 'o6', text: 'Fever', isCorrect: false }] }] }], blankMap: { d1: { correctOptionId: 'o1', whyCorrect: 'Diuretic.', distractorRationales: {} }, d2: { correctOptionId: 'o4', whyCorrect: 'Fluid.', distractorRationales: {} } }, rationale: createMockRationale('Action', 'Meds', 'Lasix.') },
                    { type: 'multiple-response', cjmmStep: 'Evaluate Outcomes', prompt: 'Outcomes', options: [{ id: 'o1', text: 'Clear lungs', isCorrect: true, rationale: 'Good.' }, { id: 'o2', text: 'Weight decreased', isCorrect: true, rationale: 'Fluid loss.' }], rationale: createMockRationale('Eval', 'Lungs', 'Clear.') }
                ]
            };
        }
    }

    // 0.5 Ordered Response (Standalone)
    if (typeId.includes('ordered')) {
        return {
            type: 'ordered-response',
            titleVariant: 'Foley Insertion',
            prompt: 'Drag steps for Foley Insertion into order.',
            orderedOptions: [
                { id: 's1', text: 'Perform Hand Hygiene', rationale: 'Infection control.' },
                { id: 's2', text: 'Open Sterile Kit', rationale: 'Maintain field.' },
                { id: 's3', text: 'Don Sterile Gloves', rationale: 'Sterile technique.' }
            ],
            rationale: createMockRationale("Sterile Tech", "Hand hygiene then Sterile Field.", "Don't break sterility.")
        };
    }

    // 1. Bow-Tie (Standalone)
    if (typeId.includes('bow-tie')) {
        return {
            type: 'bow-tie',
            titleVariant: 'Sepsis',
            prompt: 'Complete the Clinical Decision Diagram.',
            actions: [
                { id: 'a1', text: 'Administer IV Fluids', isCorrect: true },
                { id: 'a2', text: 'Administer Antibiotics', isCorrect: true },
                { id: 'a3', text: 'Restrict Fluids', isCorrect: false },
                { id: 'a4', text: 'Perform Cardioversion', isCorrect: false },
                { id: 'a5', text: 'Administer Beta Blockers', isCorrect: false }
            ],
            conditions: [
                { id: 'c1', text: 'Septic Shock', isCorrect: true },
                { id: 'c2', text: 'Cardiogenic Shock', isCorrect: false },
                { id: 'c3', text: 'Hypovolemic Shock', isCorrect: false },
                { id: 'c4', text: 'Neurogenic Shock', isCorrect: false }
            ],
            parameters: [
                { id: 'p1', text: 'MAP > 65 mmHg', isCorrect: true },
                { id: 'p2', text: 'Lactate Clearance', isCorrect: true },
                { id: 'p3', text: 'Decrease in CVP', isCorrect: false },
                { id: 'p4', text: 'Bradycardia', isCorrect: false },
                { id: 'p5', text: 'Hypothermia', isCorrect: false }
            ],
            rationale: createMockRationale("Sepsis Logic", "Fluids and Abx for Septic Shock.", "Standard bundle.")
        };
    }

    // 2. Matrix (Standalone)
    if (typeId.includes('matrix')) {
        return {
            type: 'matrix',
            prompt: 'Indicate whether each finding corresponds to Sepsis or Heart Failure.',
            columns: [{ id: 'c1', text: 'Sepsis' }, { id: 'c2', text: 'Heart Failure' }],
            rows: [ // Gold Standard: 4-6 Rows
                { id: 'r1', text: 'Fever > 101°F', correctColumnId: 'c1', rationale: 'Infection sign.' },
                { id: 'r2', text: 'BNP > 400', correctColumnId: 'c2', rationale: 'Heart stretch sign.' },
                { id: 'r3', text: 'Lactate > 2', correctColumnId: 'c1', rationale: 'Hypoperfusion sign.' },
                { id: 'r4', text: 'New S3 Heart Sound', correctColumnId: 'c2', rationale: 'Fluid overload sign.' }
            ],
            rationale: createMockRationale("Assessment", "Determine stability.", "Patient is unstable.")
        };
    }

    // 3. Highlight (Standalone)
    if (typeId.includes('highlight')) {
        return {
            type: 'highlight',
            prompt: 'Highlight the findings that require immediate intervention.',
            // Gold Standard: 50-80 Words & Plausible
            text: 'Patient is <span id="h1">cyanotic</span> and <span id="h2">lethargic</span> upon examination. The spouse reports the patient was <span id="h3">resting quietly</span> earlier but became difficult to arouse. Monitor shows <span id="h4">SpO2 82%</span> on room air and a <span id="h5">regular heart rhythm</span> of 110 bpm. The nurse notes <span id="h6">accessory muscle use</span> and immediate intervention is required to prevent arrest.',
            correct: ["h1", "h2", "h4", "h6"],
            decoys: ["h3", "h5"],
            rationales: {
                h1: { isCorrect: true, whyCorrect: "Severe hypoxia.", whyIncorrect: "N/A" },
                h2: { isCorrect: true, whyCorrect: "Brain hypoperfusion.", whyIncorrect: "N/A" },
                h3: { isCorrect: false, whyCorrect: "N/A", whyIncorrect: "Non-urgent finding." },
                h4: { isCorrect: true, whyCorrect: "Critical hypoxemia.", whyIncorrect: "N/A" },
                h5: { isCorrect: false, whyCorrect: "N/A", whyIncorrect: "Tachycardia is urgent but rhythm is regular." },
                h6: { isCorrect: true, whyCorrect: "Respiratory distress.", whyIncorrect: "N/A" }
            },
            rationale: createMockRationale("Urgency", "Hypoxia is critical.", "Cyanosis and low SpO2 require immediate action.")
        };
    }

    // 4. Drop-Cloze (Standalone) - FIXED SCHEMA
    if (typeId.includes('cloze') || typeId.includes('drop')) {
        return {
            type: 'drop-cloze',
            prompt: 'Complete the sentence.',
            sentences: [{
                text: 'The nurse should immediately administer %{d1} to increase %{d2}.',
                dropdowns: [
                    // Gold Standard: 3-5 Options per dropdown
                    {
                        id: 'd1',
                        options: [
                            { id: 'o1', text: 'IV Fluids', isCorrect: true },
                            { id: 'o2', text: 'Beta Blockers', isCorrect: false },
                            { id: 'o3', text: 'Sedatives', isCorrect: false }
                        ]
                    },
                    {
                        id: 'd2',
                        options: [
                            { id: 'o4', text: 'Blood Pressure', isCorrect: true },
                            { id: 'o5', text: 'Potassium', isCorrect: false },
                            { id: 'o6', text: 'Sleep', isCorrect: false }
                        ]
                    }
                ]
            }],
            blankMap: {
                d1: { correctOptionId: 'o1', whyCorrect: 'Restores volume.', distractorRationales: { o2: 'Decreases BP, contraindicated.', o3: 'Unsafe in shock.' } },
                d2: { correctOptionId: 'o4', whyCorrect: 'Perfuses organs.', distractorRationales: { o5: 'Not relevant to fluids.', o6: 'Not priority.' } }
            },
            rationale: createMockRationale("Treatment", "Fluids first.", "Fill the tank.")
        };
    }

    // 5. SATA (Standalone)
    if (typeId.includes('multiple-response')) {
        return {
            type: 'multiple-response', // Fixed Type ID
            prompt: 'Select all that apply.',
            options: [
                { id: 'o1', text: 'Administer IV Fluids', isCorrect: true, rationale: 'Restores volume.' },
                { id: 'o2', text: 'Ignore symptoms', isCorrect: false, rationale: 'Negligence.' },
                { id: 'o3', text: 'Monitor Vital Signs', isCorrect: true, rationale: 'Safety.' },
                { id: 'o4', text: 'Notify Provider', isCorrect: true, rationale: 'Escalation.' }, // Added 4th option
                { id: 'o5', text: 'Document Findings', isCorrect: true, rationale: 'Legal.' } // Added 5th option
            ],
            rationale: createMockRationale("Interventions", "Select appropriate actions.", "Fluids are key.")
        };
    }

    // 6. Trend (Standalone)
    if (typeId.includes('trend')) {
        return {
            type: 'trend',
            titleVariant: 'Shock Trend',
            prompt: 'Analyze the trend data.',
            trendData: {
                timePoints: [{ id: 't1', timeLabel: '08:00' }, { id: 't2', timeLabel: '09:00' }],
                parameters: [{ name: 'BP', values: ['100/60', '80/40'] }]
            },
            questionFormat: 'multiple-response', // Fixed valid format
            options: [
                { id: 'o1', text: 'Hypotension', isCorrect: true, rationale: 'Consistent with trend data.' },
                { id: 'o2', text: 'Hypertension', isCorrect: false, rationale: 'Contradicts trend.' }
            ],
            rationale: createMockRationale("Trending", "Deterioration.", "BP is dropping.")
        };
    }

    // 7. Hot Spot (Standalone)
    if (typeId.includes('hot-spot')) {
        return {
            type: 'hot_spot', // Fixed Type ID
            prompt: "Click the Left Ventricle.",
            imageUrl: "https://placehold.co/600x400?text=Heart+Diagram",
            targetArea: { x: 50, y: 50, radius: 10 },
            rationale: createMockRationale("Anatomy", "Left Ventricle location.", "Lower left chamber.")
        };
    }

    // 8. Calculation (Standalone)
    if (typeId.includes('calculation')) {
        return {
            type: 'calculation',
            prompt: "Calculate the infusion rate in mL/hr.",
            units: "mL/hr",
            correctValue: 125,
            acceptableRange: [124, 126],
            rationale: createMockRationale("Dosage", "Simple math.", "1000mL / 8hr = 125 mL/hr.")
        };
    }

    // Default
    return {
        type: 'single-response', // Fixed default type
        prompt: 'Default Question',
        options: [
            { id: 'o1', text: 'Correct Answer', isCorrect: true, rationale: 'Explanation.' },
            { id: 'o2', text: 'Distractor', isCorrect: false, rationale: 'Explanation.' }
        ],
        rationale: createMockRationale("Default", "Summary.", "Breakdown.")
    };
};

/**
 * Validates and hydrates an item after generation.
 */
const processGeneratedItem = (item: MasterQuestionItem, settings: GenerationSettings): MasterQuestionItem => {
    // 1. Ensure IDs and Type Mapping
    // @ts-ignore
    if (!item.typeId && item.type) {
        // @ts-ignore
        item.typeId = item.type;
    }
    item.id = item.id || crypto.randomUUID();

    // Ensure Pedagogy Object
    if (!item.pedagogy) {
        item.pedagogy = {
            difficultyLevel: settings.difficultyLevel,
            clinicalFocus: settings.clinicalFocus[0] || 'General',
            clinicalFocusTopics: settings.clinicalFocus
        };
    } else {
        // Ensure sub-fields
        item.pedagogy.difficultyLevel = item.pedagogy.difficultyLevel || settings.difficultyLevel;
        item.pedagogy.clinicalFocus = item.pedagogy.clinicalFocus || settings.clinicalFocus[0] || 'General';
    }

    item.metadata = {
        title: item.metadata?.title || `Generated ${item.typeId || 'Item'}`,
        authorId: 'AI_Gen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        sourceOrigin: settings.mode,
        sourceReferences: settings.selectedReferenceIds,
        qualityScore: 90,
        hasStudentPreview: true,
        batchInfo: {
            batchId: crypto.randomUUID(),
            batchSize: 0,
            temperature: settings.temperature,
            generationDate: new Date().toISOString()
        }
    };

    // 1.5. Auto-Repair Case Study Screens (ensure 6 items)
    if (item.content?.structure?.screens && Array.isArray(item.content.structure.screens)) {
        const screens = item.content.structure.screens;
        if (screens.length > 0 && screens.length < 6) {
            console.warn(`[Auto-Repair] Case Study has only ${screens.length} screens. Appending placeholder.`);
            const missingCount = 6 - screens.length;
            for (let i = 0; i < missingCount; i++) {
                screens.push({
                    type: 'single-response',
                    id: `auto_repair_${i}`,
                    prompt: "⚠️ AI Generation Incomplete. This screen was added to prevent errors.",
                    options: [{ id: 'opt1', text: "Acknowledgement", isCorrect: true }]
                });
            }
        }
    }

    // 2. Mock Validation Logic (Since we don't have a backend validator yet)
    // In a real system, this would analyze 'item.content'
    const hasWarnings = Math.random() > 0.8;

    item.aiSafetyChecks = {
        runId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        copyrightScore: 100,
        duplicationCheck: { isDuplicate: false, similarityScore: 0 },
        validationStatus: hasWarnings ? 'Warnings' : 'Pass',
        issues: hasWarnings ? [{ type: 'format', severity: 'warning', message: 'Temperature units missing Celsius conversion.' }] : [],
        autoFixHistory: []
    };

    return item;
};

// --- HELPER FUNCTIONS ---

import { PROMPT_MAP } from '../config/promptTemplates';

const buildDetailedPrompt = (settings: GenerationSettings, refs: ReferenceSource[], types: string[]): string => {
    // Collect Context
    const activeRefs = refs.filter(r => settings.selectedReferenceIds.includes(r.referenceId) && r.isActive);

    const refContext = activeRefs.map(r => {
        const content = r.contentSummary || (r as any).extractedText || (r as any).text || "No content extracted.";
        return `Document: ${r.fileName} (Type: ${r.fileType})\nContent: ${content}\n---`;
    }).join('\n\n');

    // Auto-Describe Logic
    const userPrompt = settings.aiPrompt && settings.aiPrompt.trim().length > 0
        ? `USER SCENARIO: ${settings.aiPrompt}`
        : `AUTO-CREATE SCENARIO: Use the Clinical Focus '${settings.clinicalFocus.join(', ')}' and Difficulty Level ${settings.difficultyLevel} to invent a realistic patient scenario (e.g., Age 65+, multiple comorbidities).`;

    // Dynamic Prompt Selection based on Requested Types
    let typeSpecificPrompts = "";
    types.forEach(t => {
        // Normalize type key if needed (e.g. matrix-mr -> matrix-multiple-response if map uses flexible keys)
        // Using PROMPT_MAP direct lookup
        let template = '';

        // STRICT LOOKUP FOR CASE STUDIES
        if (t === 'case-study' || t === 'case-study-6-screen') {
            template = PROMPT_MAP['case-study-6-screen'];
        } else {
            template = PROMPT_MAP[t] || '';
        }

        if (template) {
            // DYNAMIC INJECTION: Replace [QUANTITY] placeholder with actual requested quantity
            template = template.replace(/\[QUANTITY\]/g, settings.quantityPerType.toString());
            template = template.replace(/\*\*\[QUANTITY\]\*\*/g, settings.quantityPerType.toString());

            // Replace [FOCUS] and [TOPIC]
            const focusString = settings.clinicalFocus.join(', ') + (settings.customClinicalFocus ? ` (${settings.customClinicalFocus})` : '');
            template = template.replace(/\[FOCUS\]/g, focusString);
            template = template.replace(/\*\*\[FOCUS\]\*\*/g, focusString);
            template = template.replace(/\[TOPIC\]/g, focusString);
            template = template.replace(/\*\*\[TOPIC\]\*\*/g, focusString);

            // Replace [LEVEL], [DIFFICULTY], and [SCORE]
            template = template.replace(/\[LEVEL\]/g, settings.difficultyLevel.toString());
            template = template.replace(/\*\*\[LEVEL\]\*\*/g, settings.difficultyLevel.toString());
            template = template.replace(/\[DIFFICULTY\]/g, settings.difficultyLevel.toString());
            template = template.replace(/\*\*\[DIFFICULTY\]\*\*/g, settings.difficultyLevel.toString());

            const scoreMap: Record<number, number> = { 1: 50, 2: 60, 3: 75, 4: 85, 5: 95 };
            const score = scoreMap[settings.difficultyLevel] || 75;
            template = template.replace(/\[SCORE\]/g, score.toString());
            template = template.replace(/\*\*\[SCORE\]\*\*/g, score.toString());

            const wordCounts = {
                1: { narrative: 60, notes: 30, rationale: 15, focus: "Direct Fact" },
                2: { narrative: 100, notes: 50, rationale: 20, focus: "Application" },
                3: { narrative: 200, notes: 100, rationale: 30, focus: "Nursing Process" },
                4: { narrative: 300, notes: 150, rationale: 40, focus: "Pathophysiology" },
                5: { narrative: 400, notes: 200, rationale: 60, focus: "Deep Pathophysiology & Synthesis" }
            }[settings.difficultyLevel] || { narrative: 200, notes: 100, rationale: 30, focus: "Nursing Process" };

            template += `\n\nREQUIRED CLINICAL DEPTH (Difficulty Level ${settings.difficultyLevel}):
- Clinical Narrative (EHR): Minimum ${wordCounts.narrative} words. Must be a rich, professional patient story.
- Nursing Notes: Minimum ${wordCounts.notes} words. Use professional medical terminology, no abbreviations.
- Rationales: Minimum ${wordCounts.rationale} words per option. Focus on ${wordCounts.focus}.`;

            // 2. FORCE RICH CONTENT FOR EXPERT/PRO LEVEL
            if (settings.difficultyLevel >= 4) {
                template += `\n\nCRITICAL EXPERT REQUIREMENT:\nYou MUST include a detailed 'mnemonic' object and a 'cheatSheet' object in the rationale root. The 'difficulty' object must explicitly state why this is Level ${settings.difficultyLevel} based on the ${wordCounts.focus} complexity.`;
            }

            // Inject Matrix Constraints to prevent string flattening
            if (t.includes('matrix')) {
                template += `\n\nIMPORTANT: Return matrix rows as OBJECTS with { "id", "text", "correctColumnId" }, NOT as strings. (This prevents the flat-string issue at the source).`;
            }

            typeSpecificPrompts += `\n\n--- INSTRUCTIONS AND TEMPLATE FOR TYPE: ${t} ---\n${template}`;
        }
    });

    return `
    You are an expert NCLEX-NGN item writer and clinical educator.
    
    TASK: Generate ${settings.quantityPerType} items for EACH of the following types: ${types.join(', ')}.
    
    ${userPrompt}

    REFERENCE DOCUMENTS (Use these as the authoritative source for clinical data if available):
    ${refContext}

    ${typeSpecificPrompts}

    FINAL INSTRUCTIONS:
    - Ensure logical consistency in clinical values.
    - RATIONALE: Provide a detailed "Super-Teacher" rationale for every option.
    - STRICT JSON OUTPUT: Return only the final array.
    - ANTI-LAZINESS: DO NOT use placeholders like "Condition A", "Condition T", "Option 1", or "Action 1". Use full, descriptive clinical terms for every option/row/item.
    - TRUNCATION GUARD: If you are running out of space/tokens, end the response IMMEDIATELY with a closing bracket ] or } to maintain JSON validity. Structural integrity is HIGHER PRIORITY than clinical depth.
    `;
};

const extractJsonFromMarkdown = (text: string): string => {
    let clean = text.trim();

    if (clean.includes('```json')) {
        const match = clean.match(/```json([\s\S]*?)```/);
        if (match) clean = match[1].trim();
    } else if (clean.includes('```')) {
        const match = clean.match(/```([\s\S]*?)```/);
        if (match) clean = match[1].trim();
    }

    // 3. BRUTE FORCE RECOVERY (TRUNCATION)
    if (!clean.endsWith(']') && !clean.endsWith('}')) {
        console.warn("[extractJsonFromMarkdown] Truncation detected. Running emergency repair...");

        // A: Fix unclosed strings
        let quoteCount = 0;
        for (let i = 0; i < clean.length; i++) {
            if (clean[i] === '"' && (i === 0 || clean[i - 1] !== '\\')) {
                quoteCount++;
            }
        }
        if (quoteCount % 2 !== 0) {
            clean += '"';
        }

        // B: Remove trailing illegal chars
        clean = clean.replace(/,\s*$/, '');
        if (clean.endsWith(':')) clean += ' null';

        // C: Stack-based Bracket Balancing
        const stack: string[] = [];
        let inString = false;
        for (let i = 0; i < clean.length; i++) {
            if (clean[i] === '"' && (i === 0 || clean[i - 1] !== '\\')) {
                inString = !inString;
                continue;
            }
            if (inString) continue;

            const char = clean[i];
            if (char === '{' || char === '[') {
                stack.push(char);
            } else if (char === '}') {
                if (stack.length > 0 && stack[stack.length - 1] === '{') stack.pop();
            } else if (char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === '[') stack.pop();
            }
        }

        while (stack.length > 0) {
            const last = stack.pop();
            if (last === '{') clean += '}';
            if (last === '[') clean += ']';
        }
    }

    clean = clean.replace(/,(\s*[\]}])/g, '$1');
    return clean;
};

export const detectCopyright = async (_content: string, _refs: ReferenceSource[]) => {
    return { success: true, flags: [] };
};

export const checkDuplicates = async (_item: MasterQuestionItem) => {
    return { success: true, isDuplicate: false, score: 0 };
};
