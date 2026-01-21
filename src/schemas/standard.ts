import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion, TextSchema } from './shared';

// --- SHARED OPTION COMPONENTS ---

export const OptionSchema = z.object({
    id: z.string().optional(),
    text: TextSchema,
    label: z.string().optional(), // Alias for text sometimes
    isCorrect: z.boolean().optional().default(false),
    order: z.number().optional(), // For ordered response
    value: z.any().optional(), // For numeric answers
}).passthrough();

// --- 1. MULTIPLE RESPONSE / SINGLE RESPONSE / TREND ---

export const OptionBasedItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.enum(['multiple-response', 'single-response', 'trend']),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        options: z.array(OptionSchema).min(2),
        minSelection: z.number().optional(), // For MR: "Select N"
        maxSelection: z.number().optional(),
    }).passthrough()
});

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
        // Ordered items usually rely on the provided list being the "correct info" or having an 'order' field
        // We'll enforce that enough info exists to determine order
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
    correctColumnId: z.string().optional(), // If single choice per row
    correctColumnIds: z.array(z.string()).optional() // If multiple choice per row
}).passthrough();

export const MatrixItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('matrix'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
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
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        // Highlight prompt text is usually segmented into tokens or provided as a full text with [tokens]
        // But the normalized format usually outputs a list of "tokens" or "sentences" to highlight
        tokens: z.array(HighlightTokenSchema).optional(),
        text: z.string().optional(), // The raw text if tokens aren't pre-split
        highlights: z.array(z.string()).optional() // List of correct substrings
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
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        sentence: z.string(), // "The nurse should monitor [1] and [2]."
        dropdowns: z.array(DropClozeDropdownSchema).min(1)
    })
});

// --- 6. HOT SPOT ---

export const HotSpotAreaSchema = z.object({
    id: z.string(),
    shape: z.enum(['rect', 'circle', 'poly']).default('rect'),
    coords: z.array(z.number()), // [x, y, w, h] or similar
    isCorrect: z.boolean()
});

export const HotSpotItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('hot-spot'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        image: z.string().url().or(z.string()), // URL or base64 placeholder
        areas: z.array(HotSpotAreaSchema).min(1)
    })
});
