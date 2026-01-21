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

// Union of all possible screen types
const CaseStudyScreenItemSchema = z.union([
    HighlightItemSchema,
    MatrixItemSchema,
    OrderedResponseSchema,
    DropClozeItemSchema,
    BowTieItemSchema,
    OptionBasedItemSchema // Covers multiple-response (Screen 6)
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
        type: z.literal('case-study').optional(), // Redundant but often present
        screens: z.array(CaseStudyScreenItemSchema).length(6) // Strictly 6 screens per NGN standard
    })
});
