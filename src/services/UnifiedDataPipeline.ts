/**
 * UnifiedDataPipeline.ts
 * 
 * THE SINGLE SOURCE OF TRUTH FOR ALL DATA TRANSFORMATIONS
 * 
 * This file consolidates ALL data normalization logic from:
 * - importService.ts
 * - DataSanitizer.ts (normalizeGoldenPromptFormat, stabilizeItem)
 * - ItemIngestionService.ts (normalize, reconstructBowTie)
 * - ItemRenderer.tsx (normalizeConfig)
 * 
 * After processing through this pipeline, ALL items will have a
 * canonical structure that ALL components can read from consistently.
 * 
 * @author Unified Pipeline Consolidation
 * @version 1.0.0
 */

import { MasterQuestionItem, InputMode } from '../types/master-schema';
import { ItemManagerFactory } from './managers/ItemManagerFactory';

// ============================================================================
// CANONICAL INTERFACES
// ============================================================================

export interface CanonicalPatientInfo {
    name: string;
    age: number;
    gender: 'M' | 'F' | 'O';
    codeStatus: string;
    admissionDate: string;
    room: string;
    physician: string;
    nurse: string;
    allergies: string;
    isolation: string;
    weightKg?: number;
    history?: string[];
    homeMeds?: string[];
}

export interface CanonicalVital {
    time: string;
    tempF: string;
    hr: number;
    rr: number;
    bp: string;
    o2: string;
    o2_device: string;
    pain: number | null;
}

export interface CanonicalLab {
    test: string;
    value: string;
    ref: string;
    flag: string;
    category?: string;
    previous?: string;
}

export interface CanonicalOrder {
    drug: string;
    dose: string;
    route: string;
    freq: string;
    status: string;
    indication: string;
    holdReason?: string;
}

export interface CanonicalClinicalData {
    patientInfo: CanonicalPatientInfo;
    vitals: CanonicalVital[];
    labs: CanonicalLab[];
    orders: CanonicalOrder[];
    history: any[]; // Nurses notes - can be string or object array
    historyPhysical: string;
    radiology: any[];
    setting?: string;
}

export interface CanonicalBowTieOption {
    id: string;
    text: string;
    isCorrect: boolean;
    rationale?: string;
}

export interface CanonicalBowTiePool {
    pool: CanonicalBowTieOption[];
    correctCount: number;
}

export interface CanonicalDifficulty {
    level: number;
    score: number;
    label: string;
    clinicalStrategy?: string;
    recommendedActions?: string[];
}

export interface CanonicalRationale {
    coreConcept: string;
    caseSummary: string;
    answerAnalysis: string;
    trap?: string;
    goldenRule?: string;
    steps?: { tag: string; description: string }[];
    difficulty: CanonicalDifficulty;
    optionReviews?: any[];
    mnemonic?: any;
    cheatSheet?: any;
    referenceInfo?: any;
    clinicalStrategy?: string;
}

export interface CanonicalStructure {
    type: string;
    prompt: string;

    // BowTie specific
    actions?: CanonicalBowTiePool;
    conditions?: CanonicalBowTiePool;
    parameters?: CanonicalBowTiePool;

    // Matrix specific
    rows?: any[];
    columns?: any[];

    // MCQ/SATA specific
    options?: any[];

    // Cloze specific
    sentences?: any[];
    dropdowns?: any[];

    // Highlight specific
    text?: string;
    rationales?: any;
    correct?: string[];

    // Calculation specific
    correctValue?: number;
    units?: string;
    inputLabel?: string;

    // Case Study specific
    screens?: any[];
}

// ============================================================================
// DIFFICULTY LEVEL DEFINITIONS
// ============================================================================

const DIFFICULTY_DEFINITIONS: Record<number, { label: string; subtext: string }> = {
    1: { label: "Novice/Recall", subtext: "Requires basic recall of facts and definitions." },
    2: { label: "Application", subtext: "Requires applying rules or protocols to a scenario." },
    3: { label: "Analysis", subtext: "Requires analyzing trends and distinguishing relevant cues." },
    4: { label: "Synthesis", subtext: "Requires prioritizing conflicting needs and planning care." },
    5: { label: "Evaluation", subtext: "Requires managing high-stakes complexity and uncertainty." }
};

// ============================================================================
// MAIN PIPELINE CLASS
// ============================================================================

export class UnifiedDataPipeline {

    /**
     * Main entry point: Transform ANY raw JSON into a canonical MasterQuestionItem
     */
    /**
     * Main entry point: Transform ANY raw JSON into a canonical MasterQuestionItem (Async)
     * Uses the new ItemManagers for repair.
     */
    static async transform(raw: any): Promise<MasterQuestionItem> {
        return this._transformInternal(raw, true);
    }

    /**
     * Deep Transformation: Performs structural normalization AND deep AI repair/enrichment.
     */
    static async deepTransform(raw: any, options?: { autofill?: boolean }): Promise<MasterQuestionItem> {
        // 1. Initial Standard Transform to get baseline structure
        const item = await this.transform(raw);

        // 2. Perform Deep Repair via Manager
        try {
            ItemManagerFactory.registerAll();
            const manager = ItemManagerFactory.getManager(item.type || 'unknown');
            const deeplyRepaired = await manager.deepRepair(item, options);

            // Sync back results
            // Sync back results with DEEP MERGE for Rationale to prevent structure loss
            if (deeplyRepaired) {
                if (deeplyRepaired.content) {
                    // 1. Preserve existing rationale structure
                    const existingRationale = item.content.rationale || {};
                    const newRationale = deeplyRepaired.content.rationale || {};

                    // 2. Merge content (Base + New)
                    item.content = { ...item.content, ...deeplyRepaired.content };

                    // 3. Restore/Merge Rationale specifically (Deep Merge)
                    if (Object.keys(newRationale).length > 0) {
                        item.content.rationale = {
                            ...existingRationale,
                            ...newRationale,
                            // Ensure nested objects like difficulty aren't just overwritten by a partial
                            difficulty: {
                                ...existingRationale.difficulty,
                                ...(newRationale.difficulty || {})
                            }
                        };
                    }
                }

                if (deeplyRepaired.metadata) item.metadata = { ...item.metadata, ...deeplyRepaired.metadata };
                if (deeplyRepaired.pedagogy) item.pedagogy = { ...item.pedagogy, ...deeplyRepaired.pedagogy };
                if (deeplyRepaired.id) item.id = deeplyRepaired.id;

                // 4. RE-CALCULATE DIFFICULTY & SYNC EVERYWHERE
                // AI might have changed difficulty or rationale. We must ensure consistency.
                const newDifficulty = UnifiedDataPipeline.extractDifficulty(item);
                UnifiedDataPipeline.injectDifficultyEverywhere(item, newDifficulty);

                // Explicitly update rationale difficulty object to match
                if (item.content.rationale && item.content.rationale.difficulty) {
                    item.content.rationale.difficulty.level = newDifficulty;
                    // Update label if possible (simplified logic here, essentially re-running part of finishTransformation)
                    const levels: any = { 1: 'Novice', 2: 'Beginner', 3: 'Competent', 4: 'Proficient', 5: 'Expert' };
                    item.content.rationale.difficulty.label = `${levels[newDifficulty] || 'Standard'} (Level ${newDifficulty})`;
                }
            }
        } catch (error) {
            console.error('[UnifiedDataPipeline] Deep Transform failed:', error);
        }

        return item;
    }

    /**
     * Synchronous fallback (Legacy)
     */
    static transformSync(raw: any): MasterQuestionItem {
        return this._transformInternal(raw, false) as MasterQuestionItem;
    }

    private static _transformInternal(raw: any, isAsync: boolean): MasterQuestionItem | Promise<MasterQuestionItem> {
        if (!raw) {
            console.error('[UnifiedDataPipeline] Received null/undefined input');
            return UnifiedDataPipeline.createEmptyItem();
        }

        // Create a working copy
        const item: any = JSON.parse(JSON.stringify(raw));

        // Step 1: Ensure basic structure exists
        UnifiedDataPipeline.ensureBasicStructure(item);

        // [MANDATORY] Normalize ID (hoist to root to prevent cache collisions)
        let resolvedId = raw.id || raw.metadata?.id || raw.content?.id || raw._itemId;

        // Define truly generic IDs or prefix placeholders that need entropy/fixing
        const genericPrefixes = ['unknown', 'item', 'test', 'pharmeco', 'unified', 'sample', 'demo', 'skeleton'];

        const isGenericId = !resolvedId ||
            resolvedId.length < 5 ||
            genericPrefixes.some(p => String(resolvedId).toLowerCase().startsWith(p.toLowerCase()));

        if (isGenericId) {
            // Generate a better NGN ID if the current one is just a placeholder
            // Format: NGN-[TYPE]-[RANDOM_HEX]
            const typePrefix = (item.type || 'Q').slice(0, 3).toUpperCase();
            resolvedId = `NGN-${typePrefix}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
            console.log('[UnifiedDataPipeline] Fixed/Generated New ID:', resolvedId);
        }
        item.id = resolvedId;

        // Step 2: Detect and normalize item type
        item.type = UnifiedDataPipeline.detectType(item);

        // Step 3: Extract and normalize difficulty (CRITICAL - do this early)
        const difficulty = UnifiedDataPipeline.extractDifficulty(item);

        // Step 4: Normalize clinical data (vitalSigns→vitals, laboratory→labs, etc.)
        UnifiedDataPipeline.normalizeClinicalData(item);

        // Step 5: Normalize structure based on type
        if (isAsync) {
            // ASYNC PATH with Managers
            return (async () => {
                await UnifiedDataPipeline.normalizeStructureAsync(item);
                UnifiedDataPipeline.finishTransformation(item, difficulty);
                return item as MasterQuestionItem;
            })();
        } else {
            // SYNC PATH (Legacy)
            UnifiedDataPipeline.normalizeStructureSync(item);
            UnifiedDataPipeline.finishTransformation(item, difficulty);
            return item as MasterQuestionItem;
        }
    }

    private static finishTransformation(item: any, difficulty: number) {
        // Step 6: Normalize rationale and inject difficulty
        UnifiedDataPipeline.normalizeRationale(item, difficulty);

        // Step 7: Set difficulty in ALL required locations
        UnifiedDataPipeline.injectDifficultyEverywhere(item, difficulty);

        // Step 8: Generate ID if missing
        if (!item.id) {
            item.id = `unified_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }

        // CRITICAL: Ensure typeId exists (DB Requirement)
        if (!item.typeId) {
            item.typeId = item.type || 'multiple-choice';
        }

        // CRITICAL: Ensure pedagogy.clinicalFocus exists (DB Requirement)
        if (!item.pedagogy.clinicalFocus) {
            // Try to infer from metadata or content
            item.pedagogy.clinicalFocus = item.metadata?.clinicalFocus || item.metadata?.topic || item.content?.topic || 'General';
        }
        if (!item.pedagogy.difficultyLevel) {
            item.pedagogy.difficultyLevel = difficulty;
        }

        // Step 9: Ensure metadata structure
        UnifiedDataPipeline.ensureMetadata(item);

        // Step 10: Mark as processed
        item._unifiedPipelineProcessed = true;
        item._sanitized = true;

        console.log('[UnifiedDataPipeline] Transformation complete:', {
            id: item.id,
            type: item.type,
            difficulty: difficulty,
            hasActions: !!item.content?.structure?.actions,
            hasVitals: !!item.content?.clinicalData?.vitals?.length
        });
    }

    /**
     * Ensure the item has content and basic nested structures
     */
    private static ensureBasicStructure(item: any): void {
        if (!item.content) item.content = {};
        if (!item.content.clinicalData) item.content.clinicalData = {};
        if (!item.content.structure) item.content.structure = {};
        if (!item.metadata) item.metadata = {};
        if (!item.pedagogy) item.pedagogy = {};
    }

    /**
     * Detect item type from various sources
     */
    private static detectType(item: any): string {
        // Priority 1: Explicit type at root
        if (item.type && item.type !== 'unknown') return item.type.toLowerCase();

        // Priority 2: Type in structure
        const structType = item.structure?.type || item.content?.structure?.type;
        if (structType) return structType.toLowerCase();

        // Priority 3: Heuristics
        const c = item.content || item;
        const s = item.structure || item.content?.structure || {};

        // BowTie detection
        if (s.actions || s.conditions || s.parameters ||
            c.actions || c.conditions || c.parameters) {
            return 'bow-tie';
        }

        // Calculation detection
        if (s.correctValue !== undefined || c.correctValue !== undefined ||
            s.units || c.units || s.inputLabel || c.inputLabel) {
            return 'calculation';
        }

        // Case Study detection
        if (s.screens?.length > 0) {
            return 'case-study';
        }

        // Matrix detection
        if (s.rows?.length > 0 && s.columns?.length > 0) {
            return 'matrix';
        }

        // Cloze detection
        if (s.sentences?.length > 0 || s.dropdowns?.length > 0) {
            return 'drop-cloze';
        }

        // Highlight detection
        if (s.text?.includes('<span') || s.rationales) {
            return 'highlight';
        }

        // MCQ/SATA detection
        if (s.options?.length > 0) {
            const correctCount = s.options.filter((o: any) => o.isCorrect).length;
            return correctCount > 1 ? 'multiple-response' : 'single-response';
        }

        // Trend detection
        if (s.trendTable || c.trendTable || item.trendTable) {
            return 'trend';
        }

        return 'unknown';
    }

    /**
     * Extract difficulty from ANY location in the item
     */
    private static extractDifficulty(item: any): number {
        const sources = [
            // Pedagogy - Primary Source of Truth
            item.pedagogy?.difficultyLevel,

            // Content Rationale - Secondary highly specific source
            item.content?.rationale?.difficulty?.level,
            item.rationale?.difficulty?.level,

            // Explicit Metadata - Tertiary
            item.metadata?.difficultyLevel,
            item.metadata?.difficulty,

            // Content metadata
            item.content?.metadata?.difficulty,
            item.content?.metadata?.level,

            // Structure
            item.structure?.difficulty,
            item.content?.structure?.difficulty,

            // Root level legacy
            item.difficulty,
            item.difficultyLevel,
            item.itemDiff,
            item.level
        ];

        for (const source of sources) {
            if (source !== undefined && source !== null) {
                const num = typeof source === 'number' ? source : parseInt(String(source), 10);
                if (!isNaN(num) && num >= 1 && num <= 5) {
                    return num;
                }

                // Handle string labels
                if (typeof source === 'string') {
                    const s = source.toLowerCase();
                    if (s.includes('expert') || s.includes('evaluation') || s.includes('hard')) return 5;
                    if (s.includes('proficient') || s.includes('synthesis')) return 4;
                    if (s.includes('analysis') || s.includes('moderate') || s.includes('standard')) return 3;
                    if (s.includes('application') || s.includes('beginner')) return 2;
                    if (s.includes('novice') || s.includes('recall') || s.includes('easy')) return 1;
                }
            }
        }

        return 3; // Default
    }

    /**
     * Normalize clinical data - ensure consistent keys
     */
    private static normalizeClinicalData(item: any): void {
        const c = item.content;
        const cd = c.clinicalData;

        // ====== PATIENT INFO ======
        const patientSources = [c.patient, cd.patient, cd.patientInfo, c.patientInfo];
        const patient = patientSources.find(p => p && typeof p === 'object');

        if (patient) {
            cd.patientInfo = {
                name: patient.name || "Client, A.",
                age: patient.age || 65,
                gender: UnifiedDataPipeline.normalizeGender(patient.sex || patient.gender),
                codeStatus: patient.codeStatus || "FULL CODE",
                admissionDate: patient.admissionDate || new Date().toLocaleDateString() + " 07:30",
                room: c.setting?.includes('ED') ? 'ED-04' : (patient.room || 'MedSurg-12'),
                physician: patient.physician || "Dr. S. Specialist",
                nurse: patient.nurse || "RN Staff",
                allergies: patient.allergies || "NKDA",
                isolation: patient.isolation || "Standard Precautions",
                weightKg: patient.weightKg,
                history: Array.isArray(patient.history) ? patient.history : [],
                homeMeds: Array.isArray(patient.homeMeds) ? patient.homeMeds : []
            };
        } else if (!cd.patientInfo) {
            cd.patientInfo = UnifiedDataPipeline.getDefaultPatientInfo();
        }

        // ====== VITALS (vitalSigns → vitals) ======
        const vitalsSources = [
            cd.vitals,
            c.vitals,
            cd.vitalSigns,
            c.vitalSigns
        ];
        const vitalsData = vitalsSources.find(v => v);
        cd.vitals = UnifiedDataPipeline.normalizeVitals(vitalsData);

        // ====== LABS (laboratory → labs) ======
        const labsSources = [
            cd.labs,
            c.labs,
            cd.laboratory,
            c.laboratory
        ];
        const labsData = labsSources.find(l => l);
        cd.labs = UnifiedDataPipeline.normalizeLabs(labsData);

        // ====== ORDERS ======
        const ordersSources = [
            cd.orders,
            c.orders,
            c.medicalOrders,
            cd.medicalOrders
        ];
        const ordersData = ordersSources.find(o => o);
        cd.orders = UnifiedDataPipeline.normalizeOrders(ordersData);

        // ====== NURSES NOTES (history) ======
        const historySources = [
            cd.history,
            c.history,
            cd.nursesNotes,
            c.nursesNotes,
            c.nurseNotes,
            cd.nurseNotes
        ];
        const historyData = historySources.find(h => h);
        cd.history = UnifiedDataPipeline.normalizeHistory(historyData, c.chiefComplaint);

        // ====== HISTORY & PHYSICAL ======
        const hpSources = [
            cd.historyPhysical,
            c.historyPhysical
        ];
        cd.historyPhysical = hpSources.find(hp => hp) || "Chief complaint and history documented.";

        // ====== RADIOLOGY ======
        // ====== RADIOLOGY ======
        const radSources = [
            cd.radiology,
            c.radiology,
            cd.imaging,
            c.imaging,
            cd.xray,
            c.xray
        ];
        const radData = radSources.find(r => r);
        cd.radiology = UnifiedDataPipeline.normalizeRadiology(radData);

        // ====== SETTING ======
        cd.setting = cd.setting || c.setting || "MedSurg Unit";

        // ====== CLEANUP: REMOVE LEGACY FIELDS FROM ROOT ======
        // This prevents duplicated data showing up in the UI
        const legacyFields = [
            'patient', 'patientInfo',
            'vitals', 'vitalSigns',
            'labs', 'laboratory',
            'orders', 'medicalOrders',
            'nursesNotes', 'nurseNotes',
            'history', 'historyPhysical',
            'imaging', 'radiology', 'xray'
        ];

        legacyFields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(c, field)) {
                delete c[field];
            }
        });
    }

    /**
     * Normalize structure based on item type
     */
    private static normalizeStructureSync(item: any): void {
        const type = item.type;
        const c = item.content;
        const s = c.structure;

        // Get the source structure from various locations
        const sourceStructure = item.structure || c.structure || {};

        // Copy type to structure
        s.type = type;

        // Copy prompt
        s.prompt = s.prompt || sourceStructure.prompt || c.prompt || item.prompt ||
            "Review the case study and answer the question.";

        switch (type) {
            case 'bow-tie':
                UnifiedDataPipeline.normalizeBowTie(item, sourceStructure);
                break;
            case 'calculation':
                UnifiedDataPipeline.normalizeCalculation(item, sourceStructure);
                break;
            case 'case-study':
                UnifiedDataPipeline.normalizeCaseStudy(item, sourceStructure);
                break;
            case 'matrix':
                UnifiedDataPipeline.normalizeMatrix(item, sourceStructure);
                break;

            case 'trend':
                UnifiedDataPipeline.normalizeTrend(item, sourceStructure);
                break;
            default:
                UnifiedDataPipeline.normalizeGeneric(item, sourceStructure);
        }
    }

    /**
     * Normalize structure based on item type (ASYNC Modern Path)
     * Uses ItemManagerFactory to delegate repair logic.
     */
    private static async normalizeStructureAsync(item: any): Promise<void> {
        try {
            // 1. Ensure Managers are registered (Lazy safety)
            ItemManagerFactory.registerAll();

            // 2. Run Legacy Sync first to get baseline
            UnifiedDataPipeline.normalizeStructureSync(item);

            // 3. Use Specialist Manager to Repair
            const manager = ItemManagerFactory.getManager(item.type);
            const repaired = await manager.repair(item as MasterQuestionItem);

            // 4. Merge repaired data back (Deeper merge than just content)
            if (repaired) {
                if (repaired.content) item.content = { ...item.content, ...repaired.content };
                if (repaired.metadata) item.metadata = { ...item.metadata, ...repaired.metadata };
                if (repaired.pedagogy) item.pedagogy = { ...item.pedagogy, ...repaired.pedagogy };

                // Crucial: If manager improved the ID or Type, sync it back
                if (repaired.id && repaired.id !== item.id) item.id = repaired.id;
                if (repaired.type && repaired.type !== item.type) item.type = repaired.type;
            }
        } catch (error) {
            console.error('[UnifiedDataPipeline] Manager repair failed.', error);
        }
    }

    /**
     * CRITICAL: Normalize BowTie structure
     */
    private static normalizeBowTie(item: any, source: any): void {
        const s = item.content.structure;
        const c = item.content;

        // Find actions from all possible locations
        const actionsSources = [
            source.actions,
            c.actions,
            item.actions,
            source.nursingActions,
            c.nursingActions
        ];

        // Find conditions from all possible locations  
        const conditionsSources = [
            source.conditions,
            c.conditions,
            item.conditions,
            source.condition,
            c.condition,
            source.potentialConditions,
            c.potentialConditions
        ];

        // Find parameters from all possible locations
        const parametersSources = [
            source.parameters,
            c.parameters,
            item.parameters,
            source.parametersToMonitor,
            c.parametersToMonitor,
            source.monitoringParameters,
            c.monitoringParameters
        ];

        // Normalize actions
        const actionsData = actionsSources.find(a => a);
        s.actions = UnifiedDataPipeline.normalizeBowTiePool(actionsData, 'action');

        // Normalize conditions
        const conditionsData = conditionsSources.find(c => c);
        s.conditions = UnifiedDataPipeline.normalizeBowTiePool(conditionsData, 'condition');

        // Normalize parameters
        const paramsData = parametersSources.find(p => p);
        s.parameters = UnifiedDataPipeline.normalizeBowTiePool(paramsData, 'parameter');

        // Also put at root level for renderers that expect it there
        item.actions = s.actions;
        item.conditions = s.conditions;
        item.parameters = s.parameters;

        console.log('[UnifiedDataPipeline] BowTie normalized:', {
            actionsCount: Array.isArray(s.actions) ? s.actions.length : 0,
            conditionsCount: Array.isArray(s.conditions) ? s.conditions.length : 0,
            parametersCount: Array.isArray(s.parameters) ? s.parameters.length : 0
        });
    }

    /**
     * Normalize a BowTie pool (actions, conditions, or parameters)
     * IMPORTANT: Returns FLAT ARRAY to match Zod schema expectations
     */
    private static normalizeBowTiePool(data: any, category: string): CanonicalBowTieOption[] {
        if (!data) {
            console.warn(`[UnifiedDataPipeline] No ${category} data found, using fallback`);
            // Return fallback with correct counts per Zod schema
            const fallbackCount = category === 'condition' ? 4 : 5;
            const correctCount = category === 'condition' ? 1 : 2;
            const fallback: CanonicalBowTieOption[] = [];
            for (let i = 0; i < fallbackCount; i++) {
                fallback.push({
                    id: `fb_${category}_${i + 1}`,
                    text: `Fallback ${category} ${i + 1}`,
                    isCorrect: i < correctCount
                });
            }
            return fallback;
        }

        // Handle pool wrapper - extract the array
        let rawPool = data.pool || data;

        // Ensure array
        if (!Array.isArray(rawPool)) {
            rawPool = [rawPool];
        }

        // Normalize each option
        const pool: CanonicalBowTieOption[] = rawPool.map((opt: any, idx: number) => ({
            id: opt.id || `${category}_${idx}`,
            text: opt.text || opt.label || opt.name || `Option ${idx + 1}`,
            isCorrect: Boolean(opt.isCorrect || opt.correct),
            rationale: opt.rationale || opt.explanation || undefined
        }));

        const correctCount = pool.filter(o => o.isCorrect).length;

        // If no correct options, mark first as correct (safety)
        if (correctCount === 0 && pool.length > 0) {
            pool[0].isCorrect = true;
        }

        // Return FLAT ARRAY (not wrapped object)
        return pool;
    }

    /**
     * Normalize Calculation structure
     */
    private static normalizeCalculation(item: any, source: any): void {
        const s = item.content.structure;

        s.correctValue = source.correctValue ?? item.correctValue ?? 0;
        s.units = source.units || item.units || 'mL';
        s.inputLabel = source.inputLabel || item.inputLabel || '';
        s.tolerance = source.tolerance ?? item.tolerance ?? 0.1;
    }

    /**
     * Normalize Case Study structure
     */
    private static normalizeCaseStudy(item: any, source: any): void {
        const s = item.content.structure;

        s.screens = source.screens || [];

        // Recursively normalize each screen
        s.screens = s.screens.map((screen: any, idx: number) => {
            const normalized = { ...screen };
            normalized.id = screen.id || `screen_${idx}`;
            normalized.type = screen.type || 'multiple-response';
            normalized.cjmmStep = screen.cjmmStep || UnifiedDataPipeline.inferCJMMStep(screen.type);
            return normalized;
        });
    }

    /**
     * Normalize Matrix structure
     */
    private static normalizeMatrix(item: any, source: any): void {
        const s = item.content.structure;

        s.rows = source.rows || [];
        s.columns = source.columns || [];
    }

    /**
     * Normalize generic structure (MCQ, SATA, etc.)
     */
    private static normalizeGeneric(item: any, source: any): void {
        const s = item.content.structure;

        const rawOptions = source.options || item.options;

        if (rawOptions) {
            s.options = rawOptions.map((opt: any, idx: number) => ({
                id: opt.id || `opt_${idx}`,
                text: opt.text || opt.label || `Option ${idx + 1}`,
                isCorrect: Boolean(opt.isCorrect || opt.correct),
                rationale: opt.rationale
            }));
        }

        if (source.sentences) s.sentences = source.sentences;
        if (source.dropdowns) s.dropdowns = source.dropdowns;
        if (source.text) s.text = source.text;
        if (source.rationales) s.rationales = source.rationales;
        if (source.correct) s.correct = source.correct;
    }

    /**
     * Normalize Trend structure
     */
    private static normalizeTrend(item: any, source: any): void {
        const s = item.content.structure;

        // copy basic props first (options, etc)
        UnifiedDataPipeline.normalizeGeneric(item, source);

        // specific trend data
        s.trendTable = source.trendTable || item.trendTable || item.content?.trendTable;
        s.trendImageUrl = source.trendImageUrl || item.trendImageUrl;
        s.questionFormat = source.questionFormat || item.questionFormat;
        s.selectCount = source.selectCount || item.selectCount;
    }

    /**
     * Normalize rationale and inject difficulty
     */
    private static normalizeRationale(item: any, difficulty: number): void {
        const c = item.content;

        // Find rationale from various sources
        const rat = c.rationale || item.rationale || {};

        const def = DIFFICULTY_DEFINITIONS[difficulty] || DIFFICULTY_DEFINITIONS[3];

        // CRITICAL: Build referenceInfo from user's pathophysiology/general keys if native referenceInfo is missing
        let referenceInfo = rat.referenceInfo;
        if (!referenceInfo) {
            // Try to construct from scattered keys
            referenceInfo = {
                anatomy: rat.anatomy || rat.generalAnatomy || (rat.content?.anatomy) || undefined,
                physiology: rat.physiology || rat.pathophysiology || (rat.content?.physiology) || undefined,
                pharm: rat.pharm || rat.pharmacology || (rat.content?.pharmacology) || undefined
            };
            // Only keep the object if at least one field has real data
            if (!referenceInfo.anatomy && !referenceInfo.physiology && !referenceInfo.pharm) {
                referenceInfo = undefined;
            } else {
                console.log('[UnifiedDataPipeline] Constructed referenceInfo from scattered keys:', referenceInfo);
            }
        }

        c.rationale = {
            coreConcept: rat.coreConcept || "Clinical Judgment",
            caseSummary: rat.caseSummary || "Clinical scenario analysis required.",
            answerAnalysis: rat.answerAnalysis || "See option review for detailed analysis.",
            trap: rat.trap || undefined,
            goldenRule: rat.goldenRule || rat.clinicalTakeaway || "Prioritize patient safety.",
            steps: rat.steps || [],
            difficulty: {
                level: difficulty,
                score: difficulty * 20,
                label: def.label,
                clinicalStrategy: rat.difficulty?.clinicalStrategy || `Level ${difficulty} clinical reasoning required.`,
                recommendedActions: rat.difficulty?.recommendedActions ||
                    (difficulty >= 4 ? ["Practice advanced scenarios"] : ["Review core concepts"])
            },
            optionReviews: rat.optionReviews,
            // CRITICAL: Check item.rationale directly since 'rat' might prefer c.rationale which lacks mnemonic
            mnemonic: rat.mnemonic || item.rationale?.mnemonic,
            cheatSheet: rat.cheatSheet || item.rationale?.cheatSheet,
            referenceInfo: referenceInfo,
            // PRESERVE user's custom rationale fields
            pathophysiology: rat.pathophysiology || item.rationale?.pathophysiology,
            general: rat.general || item.rationale?.general,
            safetyCheck: rat.safetyCheck || item.rationale?.safetyCheck,
            clinicalTakeaway: rat.clinicalTakeaway || item.rationale?.clinicalTakeaway,
            clinicalStrategy: rat.clinicalStrategy || rat.difficulty?.clinicalStrategy || `Level ${difficulty} clinical reasoning required.`
        };

        console.log('[UnifiedDataPipeline] SAVED mnemonic to content.rationale:', JSON.stringify(c.rationale.mnemonic));
    }

    /**
     * CRITICAL: Inject difficulty into ALL locations where components read it
     */
    private static injectDifficultyEverywhere(item: any, difficulty: number): void {
        // Metadata
        item.metadata.difficulty = difficulty;
        item.metadata.difficultyLevel = difficulty;

        // Pedagogy
        item.pedagogy.difficultyLevel = difficulty;

        // Content metadata (if exists)
        if (item.content.metadata) {
            item.content.metadata.difficulty = difficulty;
            item.content.metadata.level = difficulty;
        }

        // Root level (for legacy components)
        item.difficulty = difficulty;
        item.difficultyLevel = difficulty;

        // Structure
        if (item.content.structure) {
            item.content.structure.difficulty = difficulty;
        }
    }

    /**
     * Ensure metadata is complete
     */
    private static ensureMetadata(item: any): void {
        const m = item.metadata;

        m.title = m.title || item.content?.metadata?.title || "Clinical Assessment Item";
        m.authorId = m.authorId || "UnifiedPipeline";
        m.createdAt = m.createdAt || new Date().toISOString();
        m.updatedAt = new Date().toISOString();
        m.status = m.status || "draft";
        m.qualityScore = m.qualityScore || 80;
        m.hasStudentPreview = true;
        m.sourceOrigin = m.sourceOrigin || 'ai' as InputMode;

        if (!m.batchInfo) {
            m.batchInfo = {
                batchId: 'unified',
                batchSize: 1,
                temperature: 0,
                generationDate: new Date().toISOString()
            };
        }
    }

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    private static normalizeGender(g: any): 'M' | 'F' | 'O' {
        if (!g) return 'M';
        const s = String(g).toLowerCase();
        if (s === 'f' || s === 'female') return 'F';
        if (s === 'm' || s === 'male') return 'M';
        return 'O';
    }

    private static normalizeVitals(data: any): CanonicalVital[] {
        if (!data) return UnifiedDataPipeline.getDefaultVitals();

        const arr = Array.isArray(data) ? data : [data];

        return arr.map((v: any) => ({
            time: v.time || "0800",
            tempF: String(v.tempF || v.temp || v.temperature || "98.6"),
            hr: Number(v.hr || v.heartRate || v.pulse || 80),
            rr: Number(v.rr || v.respRate || v.respiratoryRate || 16),
            bp: v.bp || v.bloodPressure || "120/80",
            o2: String(v.o2 || v.spo2 || v.oxygenSat || "98"),
            o2_device: v.o2_device || v.oxygenDevice || v.o2Device || "RA",
            pain: v.pain !== undefined ? Number(v.pain) : null
        }));
    }

    private static normalizeLabs(data: any): CanonicalLab[] {
        if (!data) return [];

        const arr = Array.isArray(data) ? data : [data];

        return arr.map((l: any) => ({
            test: l.test || l.name || l.testName || "Unknown Test",
            value: String(l.value || l.result || "N/A"),
            unit: l.unit || l.units || "",
            // CRITICAL: Support ALL variations of reference range key
            ref: l.ref || l.reference || l.refRange || l.referenceRange || l.range || l.normalRange || "",
            flag: (l.flag || l.status || "").toLowerCase(),
            category: l.category,
            previous: l.previous
        }));
    }

    private static normalizeOrders(data: any): CanonicalOrder[] {
        if (!data) return [];

        const arr = Array.isArray(data) ? data : [data];

        return arr.map((o: any) => {
            // Handle plain string orders
            if (typeof o === 'string') {
                return {
                    drug: o,
                    dose: "As ordered",
                    route: "IV",
                    freq: "Per protocol",
                    status: "active",
                    indication: "As ordered"
                };
            }

            // Handle object orders
            return {
                // CRITICAL: Check 'order' field first - Golden prompts use this instead of 'drug'
                // CRITICAL: Check all possible field names for the order content
                drug: o.order || o.text || o.drug || o.medication || o.name || o.description || o.note || o.item || o.entry || o.value || o.content || "Medication",
                dose: o.dose || o.dosage || "As ordered",
                route: o.route || "IV",
                freq: o.freq || o.frequency || "Per protocol",
                status: (o.status || "active").toLowerCase(),
                indication: o.indication || o.reason || "",
                holdReason: o.holdReason
            };
        });
    }

    private static normalizeHistory(data: any, chiefComplaint?: string): any[] {
        if (data && Array.isArray(data)) {
            return data.map((note: any, idx: number) => {
                if (typeof note === 'string') {
                    return { time: `0${8 + idx}00`.slice(-4), note, initial: "RN" };
                }
                return {
                    time: note.time || `0${8 + idx}00`.slice(-4),
                    note: note.note || note.entry || note.text || note,
                    initial: note.initial || note.author || "RN"
                };
            });
        }

        if (data && typeof data === 'string') {
            return [{ time: "0800", note: data, initial: "RN" }];
        }

        if (chiefComplaint) {
            return [{ time: "0800", note: `Chief complaint: ${chiefComplaint}`, initial: "RN" }];
        }

        return [];
    }

    private static inferCJMMStep(type: string): string {
        const map: Record<string, string> = {
            'highlight': 'Recognize Cues',
            'matrix': 'Analyze Cues',
            'ordered-response': 'Prioritize Hypotheses',
            'bow-tie': 'Generate Solutions',
            'drop-cloze': 'Take Action',
            'multiple-response': 'Evaluate Outcomes',
            'sata': 'Evaluate Outcomes'
        };
        return map[type] || 'Clinical Judgment';
    }

    private static getDefaultPatientInfo(): CanonicalPatientInfo {
        return {
            name: "Client, A.",
            age: 65,
            gender: 'M',
            codeStatus: "FULL CODE",
            admissionDate: new Date().toLocaleDateString() + " 07:30",
            room: "MedSurg-12",
            physician: "Dr. S. Specialist",
            nurse: "RN Staff",
            allergies: "NKDA",
            isolation: "Standard Precautions"
        };
    }

    private static getDefaultVitals(): CanonicalVital[] {
        return [{
            time: "0800",
            tempF: "98.6",
            hr: 80,
            rr: 16,
            bp: "120/80",
            o2: "98",
            o2_device: "RA",
            pain: 0
        }];
    }

    private static createEmptyItem(): MasterQuestionItem {
        return {
            id: `empty_${Date.now()}`,
            typeId: 'unknown',
            type: 'unknown',
            metadata: {
                title: "Empty Item",
                authorId: "System",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'draft',
                qualityScore: 0,
                hasStudentPreview: false,
                batchInfo: { batchId: 'empty', batchSize: 0, temperature: 0, generationDate: new Date().toISOString() },
                sourceOrigin: 'manual' as InputMode,
                sourceReferences: []
            },
            pedagogy: { difficultyLevel: 3, clinicalFocus: 'General', clinicalFocusTopics: [] },
            aiSafetyChecks: {
                runId: 'empty',
                timestamp: new Date().toISOString(),
                copyrightScore: 100,
                duplicationCheck: { isDuplicate: false, similarityScore: 0 },
                validationStatus: 'Pass',
                issues: [],
                autoFixHistory: []
            },
            content: {
                clinicalData: null,
                structure: { type: 'unknown' },
                rationale: null
            }
        } as any;
    }
    private static normalizeRadiology(data: any): any[] {
        if (!data) return [];

        const arr = Array.isArray(data) ? data : [data];

        return arr.map(item => {
            if (typeof item === 'string') {
                return {
                    study: "Diagnostic Imaging",
                    findings: item,
                    impression: "",
                    date: "Recent"
                };
            }
            return {
                study: item.study || item.exam || item.type || "Diagnostic Imaging",
                findings: item.findings || item.result || item.report || item.text || "",
                impression: item.impression || item.conclusion || "",
                indication: item.indication || item.reason || "",
                radiologist: item.radiologist || item.readBy || "",
                date: item.date || item.time || "Recent"
            };
        });
    }
}

// Export the transform function directly for convenience
export const transformItem = UnifiedDataPipeline.transform;
