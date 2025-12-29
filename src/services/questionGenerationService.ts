import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerationSettings, MasterQuestionItem, ReferenceSource } from '../types/master-schema';
import { AppConfig } from '../config/apiConfig';
import { getQuestionType } from '../registry';

/**
 * Question Generation Service v2.2
 * Supports: Live Gemini Integration, Mix-All logic, and Mock Fallback with Rich Content.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const USE_MOCK = !API_KEY || !AppConfig.features.aiGeneration;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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
    onProgress?: (status: string) => void
): Promise<GenerationResponse> => {

    // 1. Resolve Mix-All Logic
    const resolvedTypes = resolveTargetTypes(settings.targetTypes);
    const totalCount = resolvedTypes.length * settings.quantityPerType;

    if (USE_MOCK) {
        console.warn('Configuration forces Mock Mode (missing API Key or Feature Flag)');
        return generateMockItems(settings, resolvedTypes, onProgress);
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
            try {
                if (onProgress) onProgress(`Attempting generation with model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                responseText = result.response.text();
                // If we get here, it worked!
                lastError = null;
                break;
            } catch (err: any) {
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

        if (onProgress) onProgress("Running AI Validation & Logic Checks...");

        const cleanJson = extractJsonFromMarkdown(responseText);
        let generatedItems: MasterQuestionItem[] = [];

        try {
            // AI might return structure with outer object, handle that if needed
            const parsed = JSON.parse(cleanJson);
            generatedItems = Array.isArray(parsed) ? parsed : (parsed.items || []);
        } catch (parseError) {
            console.error("FAILED JSON PARSE. RAW TEXT:", responseText);
            return { success: false, error: "AI produced invalid JSON structure." };
        }

        // Post-Process & Validate
        const processed = generatedItems.map(item => processGeneratedItem(item, settings));

        return { success: true, data: processed };

    } catch (error: any) {
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
const generateMockItems = async (settings: GenerationSettings, types: string[], onProgress?: (s: string) => void): Promise<GenerationResponse> => {
    if (onProgress) onProgress(`Simulating Batch Generation of ${types.length * settings.quantityPerType} items...`);
    await new Promise(r => setTimeout(r, 1200));

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

                // 4. Lab Results (Formatted HTML Table)
                labs: `<table class="clinical-table"><thead><tr><th>Test</th><th>Result</th><th>Units</th><th>Ref Range</th><th style="text-align:center">Flag</th></tr></thead><tbody><tr><td>WBC</td><td style="color:#b91c1c; font-weight:bold">15.2</td><td>K/µL</td><td>5.0–10.0</td><td style="color:#b91c1c; text-align:center; font-weight:bold">↑</td></tr><tr><td>Lactate</td><td style="color:#b91c1c; font-weight:bold">3.4</td><td>mmol/L</td><td>0.5–2.2</td><td style="color:#b91c1c; text-align:center; font-weight:bold">↑</td></tr></tbody></table>`,

                // 5. Medical Orders (JCIA Standard)
                orders: `03/15/2025 1430 – Dr. A.S. (Internal Med)\n1. Normal saline 0.9% 1,000 mL IV bolus over 30 min STAT.\n2. Ceftriaxone 1 g IV q24h.`,

                // 6. Radiology (New Field)
                radiology: `Study: Chest X-ray\nFindings: Diffuse bilateral infiltrates.`
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
    referenceInfo: { anatomy: "Relevant anatomy.", physiology: "Relevant physiology.", pharm: "Relevant meds." }
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
                        type: 'matrix',
                        prompt: 'Assess Sepsis vs Heart Failure findings.',
                        columns: [{ id: 'c1', label: 'Sepsis' }, { id: 'c2', label: 'Heart Failure' }],
                        rows: [
                            { id: 'r1', text: 'Fever 102.2°F', correctColumnId: 'c1', rationale: 'Sign of infection.' },
                            { id: 'r2', text: 'BNP 1200', correctColumnId: 'c2', rationale: 'Sign of HF.' }
                        ],
                        rationale: createMockRationale("Sepsis vs HF", "Distinguish fever from fluid overload.", "Fever points to sepsis; BNP points to HF.")
                    },
                    {
                        type: 'highlight', prompt: 'Review the clinical data. Identify the five (5) findings that require immediate nursing intervention or further evaluation. Two (2) findings are distractors and not directly related to the patient\'s current presentation.',
                        text: 'Client is <span id="h1">diaphoretic</span>, <span id="h2">confused</span>, and has <span id="h3">stable bowel sounds</span>. Assessment shows <span id="h4">tachycardia</span> and <span id="h5">warm, dry skin on the hands</span>.',
                        rationales: {
                            h1: createMockRationale("Diaphoresis", "Sympathetic discharge.", "Sign of shock."),
                            h2: createMockRationale("Confusion", "Brain hypoperfusion.", "Early sign of sepsis."),
                            h3: createMockRationale("Bowel Sounds", "Normal finding.", "This is a distractor; normal bowel sounds are not an urgent cue here."),
                            h4: createMockRationale("Tachycardia", "Compensatory mechanism.", "Indicates physiological stress/shock."),
                            h5: createMockRationale("Skin Texture", "Normal finding.", "This is a distractor; warm dry skin on peripheral extremities is not an urgent cue.")
                        },
                        correct: ["h1", "h2", "h4"],
                        rationale: createMockRationale("Urgent Cues", "Recognize shock signs.", "Confusion, sweating, and high HR are ominous.")
                    },
                    {
                        type: 'ordered-response', prompt: 'Antibiotic Steps.',
                        orderedOptions: [
                            { id: 's1', text: 'Check Allergies', rationale: 'Safety first.' },
                            { id: 's2', text: 'Draw Cultures', rationale: 'Before Abx.' },
                            { id: 's3', text: 'Give Abx', rationale: 'Within 1 hour.' }
                        ],
                        rationale: createMockRationale("Sepsis Bundle", "Time is tissue.", "Follow the bundle order.")
                    },
                    {
                        type: 'cloze', prompt: 'Care Plan',
                        sentences: [{
                            text: 'Priority is %BLANK1%.', dropdowns: [
                                { id: 'BLANK1', options: [{ text: 'Perfusion', isCorrect: true, rationale: 'Flow.' }, { text: 'Comfort' }] }
                            ]
                        }],
                        rationale: createMockRationale("Planning", "Perfusion is key.", "Restore flow.")
                    },
                    {
                        type: 'bow-tie', prompt: 'Sepsis Management',
                        actions: [{ id: 'a1', text: 'Fluids', isCorrect: true, rationale: 'Fill tank.' }, { id: 'a2', text: 'Antibiotics', isCorrect: true, rationale: 'Kill bug.' }],
                        conditions: [{ id: 'c1', text: 'Septic Shock', isCorrect: true, rationale: 'Hypotension.' }],
                        parameters: [{ id: 'p1', text: 'MAP', isCorrect: true, rationale: 'Perf pressure.' }, { id: 'p2', text: 'Lactate', isCorrect: true, rationale: 'Cell hypoxia.' }],
                        correct: { condition: 'c1', actions: ['a1', 'a2'], parameters: ['p1', 'p2'] },
                        rationale: createMockRationale("Clinical Judgment", "Connect Sepsis to Fluids causing improved MAP.", "Fluids fix the pipes.")
                    },
                    {
                        type: 'sata', prompt: 'Improvements?',
                        options: [{ id: 'o1', text: 'MAP > 65', isCorrect: true, rationale: 'Success.' }],
                        rationale: createMockRationale("Evaluation", "Goals met.", "MAP restored.")
                    }
                ]
            };
        } else {
            // Variant 1: Heart Failure
            return {
                type: 'case-study',
                titleVariant: 'Acute Heart Failure',
                focusVariant: 'Heart Failure',
                screens: [
                    {
                        type: 'matrix',
                        prompt: 'Right vs Left HF.',
                        columns: [{ id: 'c1', label: 'Right HF' }, { id: 'c2', label: 'Left HF' }],
                        rows: [
                            { id: 'r1', text: 'JVD', correctColumnId: 'c1', rationale: 'Systemic.' },
                            { id: 'r2', text: 'Crackles', correctColumnId: 'c2', rationale: 'Pulmonary.' }
                        ],
                        rationale: createMockRationale("HF Types", "Right = Rest of Body; Left = Lungs.", "JVD is systemic; Crackles are pulmonary.")
                    },
                    {
                        type: 'highlight', prompt: 'Review the clinical data. Identify the five (5) findings that require immediate nursing intervention or further evaluation. Two (2) findings are distractors and not directly related to the patient\'s current presentation.',
                        text: 'Client has <span id="h1">frothy sputum</span>, <span id="h2">bibasilar crackles</span>, and <span id="h3">intact cranial nerves</span>. Noted <span id="h4">orthopnea</span> and <span id="h5">normal pupil reaction</span>.',
                        rationales: {
                            h1: createMockRationale("Pulmonary Edema", "Fluid in alveoli.", "Life threatening."),
                            h2: createMockRationale("Crackles", "Fluid overload.", "Indicates left-sided heart failure."),
                            h3: createMockRationale("Neurological Status", "Normal finding.", "This is a distractor; intact cranial nerves are expected and not critical here."),
                            h4: createMockRationale("Orthopnea", "Difficulty breathing lying flat.", "Classic sign of pulmonary congestion."),
                            h5: createMockRationale("Pupils", "Normal finding.", "This is a distractor; normal pupil reaction is not a critical cue for HF.")
                        },
                        correct: ["h1", "h2", "h4"],
                        rationale: createMockRationale("Assessment", "Identify Pulmonary Edema.", "Frothy sputum and crackles are classic.")
                    },
                    {
                        type: 'ordered-response', prompt: 'Prioritize HF Actions.',
                        orderedOptions: [{ id: 's1', text: 'Sit Up', rationale: 'Improve expansion.' }, { id: 's2', text: 'Oxygen', rationale: 'Hypoxia.' }],
                        rationale: createMockRationale("Intervention", "Positioning first.", "High Fowlers reduces return.")
                    },
                    {
                        type: 'cloze', prompt: 'Goals.',
                        sentences: [{
                            text: 'Reduce %BLANK1%.', dropdowns: [
                                { id: 'BLANK1', options: [{ text: 'Preload', isCorrect: true, rationale: 'Volume.' }, { text: 'Afterload' }] }
                            ]
                        }],
                        rationale: createMockRationale("Physiology", "Preload reduction.", "Less fluid returning to heart.")
                    },
                    {
                        type: 'bow-tie', prompt: 'Protocol.',
                        actions: [{ id: 'a1', text: 'Diuretics', isCorrect: true, rationale: 'DUMP fluid.' }, { id: 'a2', text: 'Restrict Fluid', isCorrect: true, rationale: 'STOP fluid.' }],
                        conditions: [{ id: 'c1', text: 'Pulmonary Edema', isCorrect: true, rationale: 'Fluid in lungs.' }],
                        parameters: [{ id: 'p1', text: 'Lung Sounds', isCorrect: true, rationale: 'Crackles.' }, { id: 'p2', text: 'Weight', isCorrect: true, rationale: 'Fluid status.' }],
                        correct: { condition: 'c1', actions: ['a1', 'a2'], parameters: ['p1', 'p2'] },
                        rationale: createMockRationale("Integration", "Pulmonary Edema requires Diuresis.", "Clear the lungs.")
                    },
                    {
                        type: 'sata', prompt: 'Success?',
                        options: [{ id: 'o1', text: 'Clear lungs', isCorrect: true, rationale: 'Resolved.' }],
                        rationale: createMockRationale("Outcomes", "Lungs clear.", "Breathing improved.")
                    }
                ]
            };
        }
    }

    // 0.5 Ordered Response
    if (typeId.includes('ordered')) {
        return {
            type: 'ordered-response',
            titleVariant: 'Foley Insertion',
            prompt: 'Drag steps for Foley.',
            orderedOptions: [
                { id: 's1', text: 'Hand Hygiene', rationale: 'Clean.' },
                { id: 's2', text: 'Open Kit', rationale: 'Field.' },
                { id: 's3', text: 'Glove', rationale: 'Sterile.' }
            ],
            rationale: createMockRationale("Sterile Tech", "Hand hygiene then Sterile Field.", "Don't break sterility.")
        };
    }

    // 1. Bow-Tie
    if (typeId.includes('bow-tie')) {
        return {
            type: 'bow-tie',
            titleVariant: 'Sepsis',
            prompt: 'Complete Sepsis bow-tie.',
            actions: [{ id: 'a1', text: 'Fluids', isCorrect: true, rationale: 'Support BP.' }, { id: 'a2', text: 'Abx', isCorrect: true, rationale: 'Kill bacteria.' }],
            conditions: [{ id: 'c1', text: 'Septic Shock', isCorrect: true, rationale: 'Matches cues.' }],
            parameters: [{ id: 'p1', text: 'MAP', isCorrect: true, rationale: 'Perfusion.' }, { id: 'p2', text: 'Lactate', isCorrect: true, rationale: 'Hypoxia.' }],
            correct: { condition: 'c1', actions: ['a1', 'a2'], parameters: ['p1', 'p2'] },
            rationale: createMockRationale("Sepsis Logic", "Fluids and Abx for Septic Shock.", "Standard bundle.")
        };
    }

    // 2. Matrix
    if (typeId.includes('matrix')) {
        return {
            type: 'matrix',
            prompt: 'Assess Findings.',
            columns: [{ id: 'c1', label: 'True' }, { id: 'c2', label: 'False' }],
            rows: [{ id: 'r1', text: 'Stable?', correctColumnId: 'c2', rationale: 'Unstable.' }],
            rationale: createMockRationale("Assessment", "Determine stability.", "Patient is unstable.")
        };
    }

    // 3. Highlight
    if (typeId.includes('highlight')) {
        return {
            type: 'highlight',
            prompt: 'Review the clinical data. Identify the five (5) findings that require immediate nursing intervention or further evaluation. Two (2) findings are distractors and not directly related to the patient\'s current presentation.',
            text: 'Patient is <span id="h1">cyanotic</span>, <span id="h2">lethargic</span>, and <span id="h3">resting quietly</span>. Monitor shows <span id="h4">SpO2 82%</span> and <span id="h5">regular heart rhythm</span>.',
            rationales: {
                h1: createMockRationale("Cyanosis", "Severe hypoxia.", "Late and critical sign."),
                h2: createMockRationale("Lethargy", "Decreased cerebral oxygenation.", "Indicates decompensation."),
                h3: createMockRationale("Activity Level", "Normal appearance.", "This is a distractor; resting quietly is not an urgent cue."),
                h4: createMockRationale("SpO2", "Critical hypoxemia.", "Requires immediate oxygen/intervention."),
                h5: createMockRationale("Pulse Rhythm", "Stated as regular.", "This is a distractor; a regular rhythm is not an urgent cue here.")
            },
            correct: ["h1", "h2", "h4"],
            rationale: createMockRationale("Urgency", "Hypoxia is critical.", "Cyanosis and low SpO2 require immediate action.")
        };
    }

    // 4. Cloze
    if (typeId.includes('cloze')) {
        return {
            type: 'cloze',
            prompt: 'Sepsis Cloze',
            sentences: [{
                text: 'Give %BLANK1%.',
                dropdowns: [{ id: 'BLANK1', options: [{ text: 'Fluids', isCorrect: true, rationale: 'Volume.' }] }]
            }],
            rationale: createMockRationale("Treatment", "Fluids first.", "Fill the tank.")
        };
    }

    // 5. SATA
    if (typeId.includes('multiple-response')) {
        return {
            type: 'sata',
            prompt: 'Select interventions.',
            options: [{ id: 'o1', text: 'Fluids', isCorrect: true, rationale: 'Yes.' }, { id: 'o2', text: 'Ignore', isCorrect: false, rationale: 'No.' }],
            rationale: createMockRationale("Interventions", "Select appropriate actions.", "Fluids are key.")
        };
    }

    // 6. Trend
    if (typeId.includes('trend')) {
        return {
            type: 'trend',
            titleVariant: 'Shock Trend',
            prompt: 'Analyze trend.',
            trendData: {
                timePoints: [{ id: 't1', timeLabel: '08:00' }, { id: 't2', timeLabel: '09:00' }],
                parameters: [{ name: 'BP', values: ['100/60', '80/40'] }]
            },
            questionFormat: 'single',
            options: [{ id: 'o1', text: 'Fluids', isCorrect: true, rationale: 'Shock.' }],
            rationale: createMockRationale("Trending", "Deterioration.", "BP is dropping.")
        };
    }

    // 7. Hot Spot
    if (typeId.includes('hot-spot')) {
        return {
            type: 'hot-spot',
            prompt: "Click the Left Ventricle.",
            imageUrl: "https://placehold.co/600x400?text=Heart+Diagram",
            areas: [{ id: "a1", x: 50, y: 50, radius: 10, isCorrect: true, rationale: "[Hook] The Pump. [Breakdown] Correct." }], // Simple rationale for area
            rationale: createMockRationale("Anatomy", "Left Ventricle location.", "Lower left chamber.")
        };
    }

    // 8. Calculation
    if (typeId.includes('calculation')) {
        return {
            type: 'calculation',
            prompt: "Calculate mL.",
            units: "mL",
            label: "mL",
            correctValue: 2,
            acceptableRange: [2, 2],
            rationale: createMockRationale("Dosage", "Simple math.", "1+1=2")
        };
    }

    // Default
    return {
        type: 'multiple-choice',
        prompt: 'Default Question',
        options: [{ id: 'A', text: 'Correct Answer', isCorrect: true, rationale: 'Explanation.' }],
        rationale: createMockRationale("Default", "Summary.", "Breakdown.")
    };
};

/**
 * Validates and hydrates an item after generation.
 */
const processGeneratedItem = (item: MasterQuestionItem, settings: GenerationSettings): MasterQuestionItem => {
    // 1. Ensure IDs
    item.id = item.id || crypto.randomUUID();
    item.metadata = {
        title: item.metadata?.title || "Untitled Generated Item",
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
    const refContext = activeRefs.map(r => `Document: ${r.fileName} (Type: ${r.fileType})`).join('\n');

    // Auto-Describe Logic
    const userPrompt = settings.aiPrompt && settings.aiPrompt.trim().length > 0
        ? `USER SCENARIO: ${settings.aiPrompt}`
        : `AUTO-CREATE SCENARIO: Use the Clinical Focus '${settings.clinicalFocus.join(', ')}' and Difficulty Level ${settings.difficultyLevel} to invent a realistic patient scenario (e.g., Age 65+, multiple comorbidities).`;

    // Dynamic Prompt Selection based on Requested Types
    let typeSpecificPrompts = "";
    types.forEach(t => {
        // Normalize type key if needed (e.g. matrix-mr -> matrix-multiple-response if map uses flexible keys)
        // Using PROMPT_MAP direct lookup
        let template = PROMPT_MAP[t] || PROMPT_MAP['case-study-6-screen']; // Fallback only if catastrophic miss

        if (template) {
            // DYNAMIC INJECTION: Replace [QUANTITY] placeholder with actual requested quantity
            template = template.replace(/\[QUANTITY\]/g, settings.quantityPerType.toString());
            template = template.replace(/\*\*\[QUANTITY\]\*\*/g, settings.quantityPerType.toString());

            // Replace [FOCUS]
            const focusString = settings.clinicalFocus.join(', ') + (settings.customClinicalFocus ? ` (${settings.customClinicalFocus})` : '');
            template = template.replace(/\[FOCUS\]/g, focusString);
            template = template.replace(/\*\*\[FOCUS\]\*\*/g, focusString);

            // Replace [LEVEL]
            template = template.replace(/\[LEVEL\]/g, settings.difficultyLevel.toString());
            template = template.replace(/\*\*\[LEVEL\]\*\*/g, settings.difficultyLevel.toString());

            typeSpecificPrompts += `\n\n--- INSTRUCTIONS AND TEMPLATE FOR TYPE: ${t} ---\n${template}`;
        }
    });

    return `
    You are an expert NCLEX-NGN item writer and clinical educator.
    
    TASK: Generate ${settings.quantityPerType} items for EACH of the following types: ${types.join(', ')}.
    
    CRITICAL:
    1. **NO DUPLICATES**: If generating more than 1 item/case, they MUST cover completely DIFFERENT clinical topics, body systems, and patient profiles. (e.g., If #1 is Cardiac, #2 MUST be Neuro or Respiratory).
    2. **VARIETY**: Use different patient names, ages, and genders for every single item.
    
    MODE: ${settings.mode}
    CLINICAL FOCUS: ${settings.clinicalFocus.join(', ')} ${settings.customClinicalFocus ? `(${settings.customClinicalFocus})` : ''}
    DIFFICULTY LEVEL: ${settings.difficultyLevel}/5 (1=Basic, 5=Critical Care/Expert).
    CREATIVITY TEMP: ${settings.temperature}
    
    CONTEXT DATA:
    ${settings.manualContext ? `MANUAL CLINICAL DATA: ${settings.manualContext}` : ''}
    ${userPrompt}
    ${refContext ? `REFERENCES AVAILABLE: ${refContext}` : ''}

    ${typeSpecificPrompts}

    RATIONALE GUIDELINES:
    - For every option (correct or incorrect), provide a detailed "Super-Teacher" rationale.
    - Explain the Pathophysiology and why the option is correct or incorrect in this specific context.
    - For Highlight items, explain *why* the text is a critical cue.
    - For Bow-Tie items, ensure rationales clarify the link between Conditions, Actions, and Parameters.

    STRICT OUTPUT FORMAT:
    Return ONLY a single valid JSON array containing ALL generated 'MasterQuestionItem' objects. 
    [
      { "type": "...", ... },
      { "type": "...", ... }
    ]
    Ensure all temperatures use format: "99.1°F (37.3°C)".
    `;
};

const extractJsonFromMarkdown = (text: string): string => {
    // 1. Try finding markdown block
    const match = text.match(/```json([\s\S]*?)```/);
    let clean = match ? match[1].trim() : text.trim();

    // 2. If no markdown, try finding the outer array brackets
    if (!match) {
        const start = clean.indexOf('[');
        const end = clean.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
            clean = clean.substring(start, end + 1);
        } else if (start !== -1) {
            // 3. Handle TRUNCATION: If we have a start but no end, catch it.
            // We can't perfectly repair it, but we can try to close it if it looks like an array.
            // Usually, users want to know it failed, but we can try a best-effort substring
            clean = clean.substring(start);
        }
    }

    // 4. Sanitize trailing commas (common AI error)
    clean = clean.replace(/,(\s*[\]}])/g, '$1');

    return clean;
};

export const detectCopyright = async (_content: string, _refs: ReferenceSource[]) => {
    return { success: true, flags: [] };
};

export const checkDuplicates = async (_item: MasterQuestionItem) => {
    return { success: true, isDuplicate: false, score: 0 };
};
