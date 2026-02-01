import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';
// Import item schemas for the screens
import {
    HighlightItemSchema,
    MatrixItemSchema,
    OrderedResponseSchema,
    DropClozeItemSchema,
    OptionBasedItemSchema
} from './standard';
import { BowTieItemSchema } from './bowtie';

// Union of all possible screen types - PASSTHROUGH ENABLED for Data Fidelity
const CaseStudyScreenItemSchema = z.union([
    HighlightItemSchema.passthrough(),
    MatrixItemSchema.passthrough(),
    OrderedResponseSchema.passthrough(),
    DropClozeItemSchema.passthrough(),
    BowTieItemSchema.passthrough(),
    OptionBasedItemSchema.passthrough() // Covers multiple-response (Screen 6)
]);

export const CaseStudySchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('case-study'),
    prompt: z.string().optional(), // Often implicit

    // Global Content (Scenario, Vitals, History)
    content: ContentSchema,

    rationale: RationaleUnion.optional(), // Global rationale for the whole case

    metadata: MetadataSchema.optional(),

    structure: z.object({
        type: z.literal('case-study').optional(),
        // FIX: Allow 1+ screens (Draft Mode)
        // FIX: .passthrough() preserves rich AI fields
        screens: z.array(CaseStudyScreenItemSchema).min(1)
    }).passthrough()
}).passthrough(); // Allow extra root keys (e.g. aiReasoning, generationStats)
