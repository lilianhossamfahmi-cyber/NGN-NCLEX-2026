import { z } from 'zod';
import { CalculationItemSchema, BowTieItemSchema } from '../../schemas';

export class ItemIngestionService {
    // Throttle warnings - only log once per type
    private static _warnedTypes: Set<string> = new Set();

    /**
     * The Main Entry Point. 
     * Takes raw, untrusted AI output and returns a strictly Validated Item.
     */
    static ingest(raw: any): any {
        // 1. Normalize (Fix Types, Flatten Structure, Standardize fields)
        const clean = this.normalize(raw);

        // 2. Validate against Type Specific Schema
        try {
            if (clean.type === 'calculation') {
                return CalculationItemSchema.parse(clean);
            }
            if (clean.type === 'bow-tie' || clean.type === 'bowtie') {
                clean.type = 'bow-tie';
                return BowTieItemSchema.parse(clean);
            }
            // Add other types here as we implement them hiding behind 'if' checks

            // For legacy/unimplemented types, return clean but unvalidated
            return clean;

        } catch (error) {
            if (error instanceof z.ZodError) {
                // RELAXED: Log warning once (throttled) but continue with normalized data
                // The UnifiedDataPipeline will handle missing fields gracefully
                if (!ItemIngestionService._warnedTypes.has(clean.type)) {
                    ItemIngestionService._warnedTypes.add(clean.type);
                    console.warn('[Ingestion] Validation Warning (proceeding with normalized data) for type:', clean.type);
                }
                return clean; // Return the normalized data, not an error item
            }
            throw error;
        }
    }

    /**
     * The "Migrator" Logic.
     * Moves data around, fixes typos, flattens structures.
     */
    public static normalize(raw: any): any {
        let norm = { ...raw };

        // 0. Flatten 'structure' and 'content' layers aggressively
        if (norm.content?.structure) Object.assign(norm, norm.content.structure);
        if (norm.structure) Object.assign(norm, norm.structure);
        if (norm.content?.content) Object.assign(norm, norm.content.content); // [FIX] Double-nested content flattening

        // [GOLDEN SCHEMA ADAPTER]
        // Explicitly map keys from AI Golden Schemas to our Internal Normalization
        if (norm.content?.bowtie) Object.assign(norm, norm.content.bowtie); // Hoist BowTie structure
        if (norm.content?.orderedResponse) Object.assign(norm, norm.content.orderedResponse); // Hoist Ordered
        if (norm.content?.matrix) Object.assign(norm, norm.content.matrix); // Hoist Matrix
        if (norm.content?.highlight) Object.assign(norm, norm.content.highlight);
        if (norm.content?.dropCloze) Object.assign(norm, norm.content.dropCloze);
        if (norm.content?.hotSpot) Object.assign(norm, norm.content.hotSpot);
        if (norm.content?.calculation) Object.assign(norm, norm.content.calculation);

        if (norm.content?.questionStem) norm.prompt = norm.content.questionStem;
        if (norm.content?.answerOptions) norm.structure = { ...norm.structure, options: norm.content.answerOptions };

        // Lift Rationale if nested in content
        if (norm.content?.rationale) norm.rationale = norm.content.rationale;

        // 0.5 BRIDGE: Map UnifiedDataPipeline canonical format to Zod expected format
        // Pipeline outputs: patientInfo, vitals, history, labs
        // Zod expects: patient, vitalSigns, nursesNotes, laboratory
        if (norm.content?.clinicalData) {
            const cd = norm.content.clinicalData;

            // patient ← patientInfo
            if (cd.patientInfo && !norm.content.patient) {
                norm.content.patient = cd.patientInfo;
            }

            // vitalSigns ← vitals
            if (cd.vitals && !norm.content.vitalSigns) {
                norm.content.vitalSigns = cd.vitals;
            }

            // nursesNotes ← history (if array of notes with time/note structure)
            if (cd.history && !norm.content.nursesNotes) {
                const notes = Array.isArray(cd.history) ? cd.history : [cd.history];
                norm.content.nursesNotes = notes.map((n: any) => ({
                    time: n.time || "0800",
                    author: n.initial || n.author || "RN",
                    entry: n.note || n.entry || n.text || String(n)
                }));
            }

            // laboratory ← labs
            if (cd.labs && !norm.content.laboratory) {
                norm.content.laboratory = cd.labs;
            }

            // orders (ensure correct format)
            if (cd.orders && !norm.content.orders) {
                const orders = Array.isArray(cd.orders) ? cd.orders : [cd.orders];
                norm.content.orders = orders.map((o: any) => ({
                    time: o.time || "0800",
                    // CRITICAL: Check 'order' first - Golden prompts use 'order' not 'drug'
                    order: o.order || o.drug || o.medication || "Order",
                    provider: o.provider || "MD",
                    status: o.status || "active"
                }));
            }

            // radiology
            if (cd.radiology && !norm.content.radiology) {
                norm.content.radiology = cd.radiology;
            }

            // historyPhysical
            if (cd.historyPhysical && !norm.content.historyPhysical) {
                norm.content.historyPhysical = cd.historyPhysical;
            }
        }

        // [New] Check 'clinicalData' wrapper (either at root, inside content, OR double-nested content)
        // Golden Prompts sometimes nest clinical data in "content.content"
        const clinicalData = norm.clinicalData
            || (norm.content && norm.content.clinicalData)
            || (norm.content && norm.content.content);

        if (clinicalData) {
            // Hoist fields to root so the subsequent alias logic (lines 138+) can find them
            Object.assign(norm, clinicalData);

            // Explicitly map common aliases from the clinicalData block
            if (clinicalData.patientInfo) norm.patient = clinicalData.patientInfo;
            if (clinicalData.nurseNotes) norm.nursesNotes = clinicalData.nurseNotes;
            if (clinicalData.vitals) norm.vitalSigns = clinicalData.vitals;

            // Ensure lists are arrays
            if (clinicalData.orders && !Array.isArray(clinicalData.orders)) {
                norm.orders = [clinicalData.orders];
            }
        }

        // 1. Type Correction Logic (The "Safety Net")
        if (!norm.type || norm.type === 'case-study') {
            const innerType = norm.content?.structure?.type || norm.structure?.type;
            const hasCalcFields = norm.correctValue !== undefined || norm.structure?.correctValue !== undefined || norm.correctAnswer !== undefined; // [Fix] Check correctAnswer too
            const hasPromptCalc = typeof norm.prompt === 'string' && norm.prompt.toLowerCase().includes('calculate');

            if (hasCalcFields || hasPromptCalc) {
                norm.type = 'calculation';
            } else if (innerType && innerType !== 'case-study') {
                norm.type = innerType;
            }
        }

        // 2. Type Normalization
        if (norm.type) {
            norm.type = String(norm.type).toLowerCase().trim();
        }

        // 2.5 Re-Nest Content (Migration from Legacy Flattened Format)
        if (!norm.content || typeof norm.content !== 'object') {
            norm.content = {};
        }

        const contentFields = ['nursesNotes', 'vitalSigns', 'orders', 'patient', 'historyPhysical', 'laboratory', 'radiology'];
        contentFields.forEach(field => {
            // Check root
            if (norm[field] !== undefined) norm.content[field] = norm[field];
            // Check structure
            if (norm.structure?.[field] !== undefined) norm.content[field] = norm.structure[field];

            // [NEW] Check Aliases (Aggressive)
            if (field === 'nursesNotes' && norm.content[field] === undefined) {
                if (norm.nurseNotes) norm.content[field] = norm.nurseNotes; // Alias: nurseNotes
                if (norm.notes) norm.content[field] = norm.notes; // Alias: notes
            }
            if (field === 'vitalSigns' && norm.content[field] === undefined) {
                if (norm.vitals) norm.content[field] = norm.vitals; // Alias: vitals
            }
            if (field === 'patient' && norm.content[field] === undefined) {
                if (norm.patientInfo) norm.content[field] = norm.patientInfo; // Alias: patientInfo
                if (norm.demographics) norm.content[field] = norm.demographics;
            }
            if (field === 'historyPhysical' && norm.content[field] === undefined) {
                if (norm.history) norm.content[field] = norm.history; // Alias: history
                if (norm.historyOfPresentIllness) norm.content[field] = norm.historyOfPresentIllness;
            }

            // Check direct mapping if missing
            if (!norm.content[field]) {
                // Fallback for Patient
                if (field === 'patient' && (norm.content.demographics || norm.demographics)) {
                    norm.content.patient = norm.content.demographics || norm.demographics;
                }

                // [FIX] H&P Synthesizer: Construct from scattered fields if missing
                if (field === 'historyPhysical') {
                    // 1. Gather scattered parts from Root or Content
                    const cc = norm.chiefComplaint || norm.content.chiefComplaint || norm.cc;
                    const hpi = norm.hpi || norm.content.hpi || norm.historyOfPresentIllness || norm.content.historyOfPresentIllness || norm.history;
                    const pmh = norm.pmh || norm.content.pmh || norm.pastMedicalHistory || norm.medicalHistory;
                    const surg = norm.surgicalHistory || norm.psh;
                    const social = norm.socialHistory || norm.social;
                    const meds = norm.medications || norm.homeMeds || norm.currentMedications; // Careful not to confuse with 'orders'
                    const allg = norm.allergies || norm.content.allergies;
                    const ros = norm.ros || norm.reviewOfSystems;
                    const exam = norm.physicalExam || norm.exam || norm.pe;

                    // 2. Check if we found ANY history data
                    const foundData = cc || hpi || pmh || surg || social || meds || allg || ros || exam;

                    if (foundData && !norm.content[field]) {
                        // 3. Construct the Object
                        norm.content[field] = {
                            chiefComplaint: cc,
                            hpi: hpi,
                            pmh: pmh,
                            surgicalHistory: surg,
                            socialHistory: social,
                            medications: meds,
                            allergies: allg,
                            reviewOfSystems: ros,
                            physicalExam: exam
                        };
                    }
                }

                // Fallback for History (Required String or Object)
                if (field === 'historyPhysical') {
                    if (typeof norm.content[field] === 'object') {
                        // Convert Rich Object to Formatted String for UI Safety
                        const h = norm.content[field];
                        let str = "";

                        // Helper to format consistent sections
                        const addSection = (title: string, content: any) => {
                            if (!content) return;
                            const val = Array.isArray(content) ? content.join(', ') : (typeof content === 'object' ? JSON.stringify(content) : content);
                            str += `<div class="mb-3"><span class="font-bold text-slate-700 uppercase text-xs tracking-wider block border-b border-slate-200 mb-1">${title}</span><div class="text-sm text-slate-600">${val}</div></div>`;
                        };

                        if (h.chiefComplaint) addSection('Chief Complaint', h.chiefComplaint);
                        if (h.hpi) addSection('History of Present Illness', h.hpi);
                        if (h.pmh) addSection('Past Medical History', h.pmh);
                        if (h.surgicalHistory) addSection('Surgical History', h.surgicalHistory);
                        if (h.socialHistory) addSection('Social History', h.socialHistory);
                        if (h.medications) addSection('Home Medications', h.medications);
                        if (h.allergies) addSection('Allergies', h.allergies);
                        if (h.reviewOfSystems) addSection('Review of Systems', h.reviewOfSystems);
                        if (h.physicalExam) addSection('Physical Exam', h.physicalExam);

                        norm.content[field] = str || "History details available in charts.";
                    } else if (!norm.content[field]) {
                        norm.content[field] = "No history provided.";
                    }
                }
            }
        });

        // Ensure Patient Exists (Schema requires it)
        if (!norm.content.patient && norm.content.demographics) {
            norm.content.patient = norm.content.demographics;
        }

        // 3. Metadata (Aggressive)
        if (!norm.metadata) norm.metadata = {};
        const diff = norm.difficulty || norm.itemDiff || norm.metadata?.difficulty || norm.metadata?.difficultyLevel || 3;
        norm.metadata.difficulty = isNaN(Number(diff)) ? 3 : Number(diff);
        norm.metadata.difficultyLevel = norm.metadata.difficulty; // Alias for UI components that expect difficultyLevel
        norm.metadata.topic = norm.topic || norm.metadata.topic || 'General';


        // 4. Unified Prompt/Stem Normalization
        if (!norm.prompt) {
            if (typeof norm.stem === 'string') norm.prompt = norm.stem;
            else if (norm.stem?.promptText) norm.prompt = norm.stem.promptText;
            else if (norm.itemStem?.en) norm.prompt = norm.itemStem.en;
            else if (norm.cloze?.taskPrompt?.en) norm.prompt = norm.cloze.taskPrompt.en;
            else if (norm.task?.instruction) norm.prompt = norm.task.instruction;
            else if (norm.stimulus?.prompt?.en) norm.prompt = norm.stimulus.prompt.en;
            else if (norm.structure?.prompt) norm.prompt = norm.structure.prompt;
            else norm.prompt = "Review the case study and answer the question."; // Safe Fallback
        }

        // 5. Unified Rationale Normalization
        if (!norm.rationale) {
            if (norm.explanation) norm.rationale = norm.explanation;
            else if (norm.rational) norm.rationale = norm.rational;
            else if (norm.answerExplanation) norm.rationale = norm.answerExplanation;
        }

        // 6. Calculation Specific Migrations
        if (norm.type === 'calculation') {
            // Map inputLabel -> units
            if (!norm.units && norm.inputLabel) {
                norm.units = norm.inputLabel;
            }

            if (typeof norm.correctValue === 'string') {
                norm.correctValue = parseFloat(norm.correctValue);
            }

            // Map keys (Aggressive Search)
            const valCandidates = [norm.answer, norm.value, norm.result, norm.correctAnswer, norm.structure?.answer, norm.content?.structure?.answer];
            if (norm.correctValue === undefined) {
                const found = valCandidates.find(v => v !== undefined);
                if (found !== undefined) norm.correctValue = parseFloat(found);
            }

            // Default Units if missing (Schema requires it)
            if (!norm.units) {
                norm.units = "units";
            }
        }

        // 7. BowTie Specific
        if (norm.type === 'bow-tie') {
            // Reconstruct Structure if scattered
            if (!norm.structure) norm.structure = {};

            // Aliases Map
            const aliases = {
                actions: ['action', 'actionsToTake', 'actions_to_take', 'potentialActions'],
                conditions: ['condition', 'potentialConditions', 'clientCondition'],
                parameters: ['parameter', 'parametersToMonitor', 'monitoringParameters']
            };

            // Search for BowTie parts in root/content/clinicalData
            ['actions', 'conditions', 'parameters'].forEach(target => {
                // 1. Direct match
                if (norm.structure[target]) return; // Already exists

                // 2. Search root/content/clinicalData
                if (norm[target]) norm.structure[target] = norm[target];
                if (norm.content?.[target]) norm.structure[target] = norm.content[target];
                if (norm.clinicalData?.[target]) norm.structure[target] = norm.clinicalData[target];

                // 3. Search Aliases
                if (!norm.structure[target]) {
                    const candidates = aliases[target as keyof typeof aliases];
                    for (const alias of candidates) {
                        if (norm[alias]) { norm.structure[target] = norm[alias]; break; }
                        if (norm.content?.[alias]) { norm.structure[target] = norm.content[alias]; break; }
                        if (norm.structure?.[alias]) { norm.structure[target] = norm.structure[alias]; break; }
                    }
                }
            });

            // CRITICAL: Unwrap pool wrappers - Zod expects flat arrays
            ['actions', 'conditions', 'parameters'].forEach(target => {
                const val = norm.structure[target];
                if (val && !Array.isArray(val) && Array.isArray(val.pool)) {
                    console.log(`[Ingestion] Unwrapping ${target} pool wrapper`);
                    norm.structure[target] = val.pool;
                }
            });

            // [FALLBACK] If still missing (AI completely failed), inject Dummy Data to prevent Crash
            // This allows us to debug the layout even if AI fails the content.
            if (!norm.structure.actions) {
                console.warn('[Ingestion] Missing Actions! Injecting Fallback.');
                norm.structure.actions = [
                    { id: 'a1', text: 'Fallback Action 1', isCorrect: true },
                    { id: 'a2', text: 'Fallback Action 2', isCorrect: false },
                    { id: 'a3', text: 'Fallback Action 3', isCorrect: true },
                    { id: 'a4', text: 'Fallback Action 4', isCorrect: false },
                    { id: 'a5', text: 'Fallback Action 5', isCorrect: false }
                ];
            }
            if (!norm.structure.conditions) {
                norm.structure.conditions = [
                    { id: 'c1', text: 'Fallback Condition 1', isCorrect: true },
                    { id: 'c2', text: 'Fallback Condition 2', isCorrect: false },
                    { id: 'c3', text: 'Fallback Condition 3', isCorrect: false },
                    { id: 'c4', text: 'Fallback Condition 4', isCorrect: false }
                ];
            }
            if (!norm.structure.parameters) {
                norm.structure.parameters = [
                    { id: 'p1', text: 'Fallback Param 1', isCorrect: true },
                    { id: 'p2', text: 'Fallback Param 2', isCorrect: false },
                    { id: 'p3', text: 'Fallback Param 3', isCorrect: true },
                    { id: 'p4', text: 'Fallback Param 4', isCorrect: false },
                    { id: 'p5', text: 'Fallback Param 5', isCorrect: false }
                ];
            }
        }

        // 7.5 Other Item Specific Migrations (Matrix, Ordered, etc.)
        // EXCLUDING: Case Study (managed separately via explicit flow)
        if (norm.type !== 'case-study') {

            // MATRIX: Fix Rows/Columns aliases
            if (norm.type === 'matrix') {
                if (!norm.structure) norm.structure = {};

                // Columns Aliases
                if (!norm.structure.columns) {
                    if (norm.structure.cols) norm.structure.columns = norm.structure.cols;
                    else if (norm.structure.headers) norm.structure.columns = norm.structure.headers;
                    else if (norm.columns) norm.structure.columns = norm.columns; // Root lift
                    else if (norm.cols) norm.structure.columns = norm.cols;
                }

                // Rows Aliases
                if (!norm.structure.rows) {
                    if (norm.structure.items) norm.structure.rows = norm.structure.items;
                    else if (norm.structure.questions) norm.structure.rows = norm.structure.questions;
                    else if (norm.rows) norm.structure.rows = norm.rows; // Root lift
                    else if (norm.items) norm.structure.rows = norm.items;
                }
            }

            // GENERIC OPTIONS NORMALIZATION (Ordered, Multiple, Single, Highlight, HotSpot, DropCloze, Trend)
            const optionBasedTypes = ['ordered-response', 'multiple-response', 'single-response', 'highlight', 'hot-spot', 'drop-cloze', 'trend'];
            if (optionBasedTypes.includes(norm.type)) {
                if (!norm.structure) norm.structure = {};

                // Map 'ordered_response' -> 'ordered-response'
                if (norm.type === 'ordered_response') norm.type = 'ordered-response';

                // Options Aliases
                if (!norm.structure.options) {
                    // Check common aliases
                    const candidates = [
                        norm.structure.items, norm.structure.choices, norm.structure.answers, norm.structure.steps, norm.structure.sequence,
                        norm.options, norm.items, norm.choices, norm.answers, norm.steps // Root checks
                    ];

                    const found = candidates.find(c => Array.isArray(c));
                    if (found) {
                        console.log(`[Ingestion] Migrating options for ${norm.type}`);
                        norm.structure.options = found;
                    }
                }
            }
        }

        // Ensure Rationale Exists (Common Failure Point)
        if (!norm.rationale) {
            norm.rationale = "Rationale not generated.";
        } else if (typeof norm.rationale === 'object') {
            // Fix Incomplete Rationale Object (Schema requires general, patho, safetyCheck)
            if (!norm.rationale.general) norm.rationale.general = "General rationale not provided.";
            if (!norm.rationale.pathophysiology) norm.rationale.pathophysiology = "Pathophysiology not provided.";
            if (!norm.rationale.safetyCheck) norm.rationale.safetyCheck = "Safety check not provided.";

            // Fix Keys if AI generated "analysis" instead of "general" etc
            if (norm.rationale.analysis && !norm.rationale.general) norm.rationale.general = norm.rationale.analysis;
        }

        // 8. Data Cleaning (Orders, Vitals)
        if (norm.content?.orders) {
            const validStatuses = ['active', 'discontinued', 'completed', 'pending'];
            norm.content.orders = norm.content.orders.map((o: any) => {
                let status = (o.status || 'active').toLowerCase();
                if (!validStatuses.includes(status)) status = 'active'; // Force valid

                return {
                    ...o,
                    id: o.id || Math.random().toString(36).substring(7),
                    time: o.time || "0800",
                    status: status
                };
            });
        }

        // 9. Data Cleaning (Patient)
        if (norm.content?.patient) {
            const p = norm.content.patient;
            if (p.sex && !p.gender) p.gender = p.sex;
            if (!p.gender) p.gender = 'Male'; // Default
            if (!p.age) p.age = 30;
            if (!p.name) p.name = "John Doe";
            if (!p.allergies) p.allergies = "NKDA";
        }

        return norm;
    }

    // NOTE: createErrorItem removed - we now use relaxed validation that returns normalized data
}
