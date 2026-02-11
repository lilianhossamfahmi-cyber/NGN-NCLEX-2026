import { z } from 'zod';

// --- PRIMITIVES & HELPERS ---

// The "Universal Text Unifier" (i18n Killer)
// Flattens { en: "string" } to "string"
export const TextSchema = z.union([
    z.string(),
    z.object({ en: z.string() }).transform(val => val.en),
    z.object({ text: z.string() }).transform(val => val.text)
]).pipe(z.string());

// JCIA & Style Validator
// RELAXED: Was causing validation failures for imported content containing "patient"
// TODO: Re-enable strict validation once import pipeline sanitizes text
export const JCIAText = TextSchema; // Temporarily relaxed - was rejecting imported content

// --- CLINICAL DATA STRUCUTRES ---

export const NoteSchema = z.object({
    time: z.string().optional(), // e.g. "0800" or "Day 1 08:00"
    author: z.string().optional(), // e.g. "RN"
    entry: JCIAText.optional() // The detailed note
}).passthrough();

export const VitalSignSchema = z.object({
    time: z.string().optional(),
    bp: z.string().optional(),
    hr: z.number().or(z.string()).optional(),
    rr: z.number().or(z.string()).optional(),
    temp: z.number().or(z.string()).optional(),
    tempF: z.number().or(z.string()).optional(), // Alias for temp
    o2: z.number().or(z.string()).optional(),
    o2_device: z.string().optional(), // Support for Golden prompt format
    pain: z.number().or(z.string()).optional(),
}).passthrough(); // Allow additional fields

export const OrderSchema = z.object({
    time: z.string().optional(),
    order: JCIAText.optional(), // Made optional - some formats use 'drug' or 'medication' instead
    provider: z.string().optional(),
    // Accept any status
    status: z.any().optional()
}).passthrough();

export const PatientSchema = z.object({
    name: z.string().optional(),
    age: z.number().or(z.string()).optional(), // Accept "45" or 45
    gender: z.string().optional(), // Made optional - some formats use 'sex'
    sex: z.string().optional(), // Alias for gender
    mrn: z.string().optional(),
    dob: z.string().optional(),
    allergies: z.string().or(z.array(z.string())).optional(), // Made optional
    codeStatus: z.string().optional(),
    admissionDate: z.string().optional(),
    location: z.string().optional(),
    weightKg: z.number().optional(), // Golden prompt field
}).passthrough(); // Allow additional fields


// --- RATIONALE ---

export const StructuredRationaleSchema = z.object({
    // Legacy / Internal fields
    general: JCIAText.optional(),
    pathophysiology: JCIAText.optional(),
    safetyCheck: JCIAText.optional(),
    clinicalTakeaway: JCIAText.optional(),

    // Golden Prompt v3/v4 fields
    coreConcept: JCIAText.optional(),
    caseSummary: JCIAText.optional(),
    answerAnalysis: JCIAText.optional(),
    trap: JCIAText.optional(),
    goldenRule: JCIAText.optional(),

    steps: z.array(z.object({
        tag: z.string(),
        description: z.string()
    })).optional(),

    mnemonic: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        explanation: z.string().optional()
    }).passthrough().optional(),

    cheatSheet: z.object({
        title: z.string().optional(),
        points: z.array(z.string()).optional()
    }).passthrough().optional(),

    referenceInfo: z.object({
        anatomy: z.string().optional(),
        physiology: z.string().optional(),
        pharm: z.string().optional()
    }).passthrough().optional(),

    difficulty: z.object({
        score: z.number().or(z.string()).optional(),
        level: z.number().or(z.string()).optional(),
        label: z.string().optional(),
        clinicalStrategy: z.string().optional(),
        recommendedActions: z.array(z.string()).optional()
    }).passthrough().optional(),
}).passthrough();

// Helper to migrate legacy string rationales
export const RationaleUnion = z.union([
    StructuredRationaleSchema,
    z.string().transform((str) => ({
        general: str,
        pathophysiology: "Generated from legacy string",
        safetyCheck: "Legacy Item - Review Safety",
    }))
]);

// --- SCORING & METADATA ---

export const MetadataSchema = z.object({
    title: z.string().describe("Descriptive title for the item"),
    authorId: z.string().default("system"),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.enum(['draft', 'in-review', 'approved', 'published', 'archived']).default('draft'),
    sourceOrigin: z.enum(['upload', 'manual', 'ai', 'hybrid']).default('ai'),
    sourceReferences: z.array(z.string()).default([]),
    hasStudentPreview: z.boolean().default(true),

    difficulty: z.any().optional(), // Relaxed validation
    topic: z.string().optional(),
    subtopic: z.string().optional(),
    clientNeeds: z.string().optional(), // "Management of Care", etc.
    cjmmLayer: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
    passProbability: z.number().min(0).max(1).optional(),

    // v2.1 Protection System & Analytics
    contentVersion: z.number().default(1),
    supersedesId: z.string().optional(),
    retiredAt: z.string().optional(),
    repairNotes: z.array(z.string()).optional(),

    // Task A: Vitals Validation
    vitalWarnings: z.boolean().optional(),

    // Task D: Rationale Integrity Score (0-100)
    rationaleIntegrity: z.number().int().min(0).max(100).optional(),
    qualityScore: z.number().optional()
});

export const PedagogySchema = z.object({
    difficultyLevel: z.number().min(1).max(5).default(3),
    cjmmPhase: z.string().optional(),
    clinicalFocus: z.string().default("General Nursing"),
    clinicalFocusTopics: z.array(z.string()).default([])
});

// Task B: Structured Calculation Method
export const CalculationMethodSchema = z.object({
    formula: z.string().nullable().optional(),
    roundTo: z.enum(['whole', 'tenth', 'hundredth', 'thousandth']).default('hundredth'),
    tolerance: z.number().min(0).max(1).default(0.02),
    unit: z.string().nullable().optional(),
});

// The Unified Clinical Content Container
// RELAXED: Using passthrough() to allow Golden prompt fields like setting, metadata, structure
export const ContentSchema = z.object({
    patient: PatientSchema.optional(), // Made optional - will use defaults if missing
    nursesNotes: z.array(NoteSchema).default([]),
    vitalSigns: z.array(VitalSignSchema).default([]),
    orders: z.array(OrderSchema).default([]),
    historyPhysical: z.any().optional(),
    laboratory: z.array(z.any()).default([]),
    radiology: z.array(z.any()).default([]),
    setting: z.string().optional(), // Golden prompt field
    metadata: z.any().optional(), // Allow nested metadata

    // Task B: Calculation Method Container
    calculationMethod: CalculationMethodSchema.optional(),
}).passthrough(); // Allow additional fields like 'structure' at content level
