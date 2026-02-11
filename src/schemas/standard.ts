import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion, TextSchema, PedagogySchema } from './shared';

/**
 * standard.ts
 * 
 * Canonical Zod schemas for NGN items.
 * Enforces Option-based Drop-Cloze and Plural-based Matrix Rows.
 */

// --- SHARED OPTION COMPONENTS ---

export const OptionSchema = z.object({
    id: z.string().optional(),
    text: TextSchema,
    label: z.string().optional(), // Alias for text sometimes
    isCorrect: z.boolean().optional().default(false),
    order: z.number().optional(), // For ordered response
    value: z.any().optional(), // For numeric answers
    rationale: z.string().optional(),
}).passthrough();

// --- 1. SINGLE RESPONSE / MULTIPLE RESPONSE / TREND ---

export const SingleResponseItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('single-response'),
    typeId: z.string().default('single-response'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        options: z.array(OptionSchema).min(2),
    }).passthrough()
});

export const MultipleResponseItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('multiple-response'),
    typeId: z.string().default('multiple-response'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        options: z.array(OptionSchema).min(2),
        minSelection: z.number().optional(),
        maxSelection: z.number().optional(),
    }).passthrough()
});

export const TrendItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('trend'),
    typeId: z.string().default('trend'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        options: z.array(OptionSchema).min(2),
    }).passthrough()
});

export const OptionBasedItemSchema = z.union([
    SingleResponseItemSchema,
    MultipleResponseItemSchema,
    TrendItemSchema
]);

// --- 2. ORDERED RESPONSE ---

export const OrderedResponseSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('ordered-response'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        options: z.array(OptionSchema).min(2),
    }).passthrough()
});

// --- 3. MATRIX ---

export const MatrixColumnSchema = z.object({
    id: z.string(),
    text: z.string(),
}).passthrough();

export const MatrixRowSchema = z.object({
    id: z.string(),
    text: z.string(),
    rationale: z.string().optional().default(""),
    correctColumnIds: z.array(z.string()).min(1), // CANONICAL Plural
    correctColumnId: z.string().optional(), // Allowed for compat, but IDs[] is source of truth
}).passthrough();

export const MatrixItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('matrix'),
    typeId: z.string().default('matrix'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        columns: z.array(MatrixColumnSchema).min(2),
        rows: z.array(MatrixRowSchema).min(1),
    })
});

// --- 4. HIGHLIGHT ---

export const HighlightTokenSchema = z.object({
    text: z.string(),
    isCorrect: z.boolean().default(false),
    id: z.string().optional() // Generated if missing
}).passthrough();

export const HighlightItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('highlight'),
    typeId: z.string().default('highlight'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        tokens: z.array(HighlightTokenSchema).optional(),
        text: z.string().optional(),
        highlights: z.array(z.string()).optional()
    }).passthrough()
});

// --- 5. DROP CLOZE ---

export const DropClozeOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const DropClozeDropdownSchema = z.object({
    id: z.string(),
    label: z.string().optional(), // "Select..."
    options: z.array(DropClozeOptionSchema).min(2)
});

export const DropClozeItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('drop-cloze'),
    typeId: z.string().default('drop-cloze'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        sentence: z.string().optional(),
        text: z.string().optional(),
        dropdowns: z.array(DropClozeDropdownSchema).min(1)
    })
});

// --- 6. HOT SPOT ---

export const HotSpotAreaSchema = z.object({
    id: z.string(),
    shape: z.enum(['rect', 'circle', 'poly']).default('rect'),
    coords: z.array(z.number()),
    isCorrect: z.boolean()
});

export const HotSpotItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('hot-spot'),
    typeId: z.string().default('hot-spot'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema,
    pedagogy: PedagogySchema,
    structure: z.object({
        image: z.string().url().or(z.string()),
        areas: z.array(HotSpotAreaSchema).min(1)
    })
});
