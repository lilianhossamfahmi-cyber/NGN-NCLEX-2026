import { z } from 'zod';
import {
    HighlightItemSchema,
    MatrixItemSchema,
    OrderedResponseSchema,
    DropClozeItemSchema,
    OptionBasedItemSchema,
    HotSpotItemSchema
} from './standard';
import { BowTieItemSchema } from './bowtie';
import { CalculationItemSchema } from './calculation';
import { CaseStudySchema } from './case-study';

/**
 * MasterQuestionItemSchema
 * 
 * The root union schema for ALL next-gen item types.
 * This is the source of truth for the JSON Schema generator and 
 * the compiled Ajv validator in Phase 2.
 */
export const MasterQuestionItemSchema = z.union([
    CaseStudySchema,
    BowTieItemSchema,
    MatrixItemSchema,
    HighlightItemSchema,
    DropClozeItemSchema,
    OrderedResponseSchema,
    OptionBasedItemSchema, // Covers single-response, multiple-response, trend
    CalculationItemSchema,
    HotSpotItemSchema
]).describe("Canonical NCSBN Next-Gen Question Item");

export type MasterQuestionItem = z.infer<typeof MasterQuestionItemSchema>;
