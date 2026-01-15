import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const OptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const BowTieItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('bow-tie'),
    prompt: z.string().optional(), // Often the prompt is fixed header "Complete the diagram..."

    content: ContentSchema,

    rationale: RationaleUnion,

    metadata: MetadataSchema.optional(),

    structure: z.object({
        actions: z.array(OptionSchema).refine(
            (opts) => opts.length === 5 && opts.filter(o => o.isCorrect).length === 2,
            { message: "Actions must have 5 options with exactly 2 correct." }
        ),
        conditions: z.array(OptionSchema).refine(
            (opts) => opts.length >= 4 && opts.filter(o => o.isCorrect).length === 1,
            { message: "Conditions must have at least 4 options with exactly 1 correct." }
        ),
        parameters: z.array(OptionSchema).refine(
            (opts) => opts.length === 5 && opts.filter(o => o.isCorrect).length === 2,
            { message: "Parameters must have 5 options with exactly 2 correct." }
        )
    })
});

export type BowTieItem = z.infer<typeof BowTieItemSchema>;
