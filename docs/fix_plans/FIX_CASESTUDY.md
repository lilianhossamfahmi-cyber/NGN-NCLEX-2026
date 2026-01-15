# FIX PLAN: CASE STUDY ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, COMPLEX WRAPPER)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_CASE_STUDY_SPEC.md` | Defines 6-item wrapper | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md` | Large prompt | ⚠️ Review |
| **Zod Schema** | `src/schemas/casestudy.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE (COMPLEX)

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

// Import all individual item schemas for the sub-items
// The Case Study is a WRAPPER containing 6 items

const SubItemSchema = z.object({
    type: z.string(), // The type of the sub-item (highlight, matrix, etc.)
    prompt: z.string(),
    structure: z.any(), // Varies by type
    rationale: RationaleUnion.optional()
});

export const CaseStudySchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('case-study'),
    title: z.string().optional(),
    metadata: MetadataSchema.optional(),
    content: ContentSchema, // Shared across all 6 items
    items: z.array(SubItemSchema).length(6) // Exactly 6 items
}).refine((data) => {
    // CJMM Order validation could be added here
    return true;
}, { message: "Items must follow CJMM order (1-6)." });
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Case Study item type is complex:
1. It's a WRAPPER containing exactly 6 sub-items.
2. Each sub-item can be a different type (Highlight, Matrix, Bow-Tie, etc.).
3. They share a common `content` object (Clinical Data).
4. No Zod Schema exists.

**Files to Create:**
1. `src/schemas/casestudy.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md` - Review V4 alignment.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create wrapper schema with `items` array of exactly 6 objects.
2. Each sub-item should validate against its own type schema (loosely, or via discriminated union).
3. Ensure shared `content` is complete (patient, nursesNotes with 3+ entries, vitals with 3+ readings).
4. Add CJMM order validation if possible.

Fix permanently at source.
```
