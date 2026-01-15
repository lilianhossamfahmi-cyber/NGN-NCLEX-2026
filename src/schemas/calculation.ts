import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion, TextSchema } from './shared';

// --- CONFIGURATION SCHEMA ---
// Specific fields for Calculation Items
export const CalculationConfigSchema = z.object({
    type: z.literal('calculation'),

    // The Answer Logic
    correctValue: z.number().nullable().optional(),

    // The Display Logic
    units: z.string().nullable().optional(),

    acceptableRange: z.any().optional(),

    // Optional: Alternate Display Label (if different from units)
    inputLabel: z.string().optional().transform(val => val),
});

// --- FULL ITEM SCHEMA ---
// Composes Config + Content + Metadata
export const CalculationItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),

    // Core Identity
    type: z.literal('calculation'),

    // The Prompt (Stem)
    prompt: TextSchema.refine(
        (val) => val.split(' ').length > 10,
        { message: "Prompt is too short. Must illustrate clinical context." }
    ),

    // Clinical Context
    content: ContentSchema,

    // Educational Logic
    rationale: RationaleUnion,

    // Metadata
    metadata: MetadataSchema.optional(),

    // Flattened Calculation Props (Merged from Config)
    correctValue: z.number().nullable().optional(),
    units: z.string().nullable().optional(),
    acceptableRange: z.any().optional(),

});

export type CalculationItem = z.infer<typeof CalculationItemSchema>;
