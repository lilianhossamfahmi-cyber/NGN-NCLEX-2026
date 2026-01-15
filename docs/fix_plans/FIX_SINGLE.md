# FIX PLAN: SINGLE RESPONSE ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_SINGLE_RESPONSE_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-SingleResponse-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/single.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const SingleOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const SingleResponseItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('single-response'), z.literal('single_response'), z.literal('mcq')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        options: z.array(SingleOptionSchema).length(4)
    })
}).refine((data) => {
    return data.structure.options.filter(o => o.isCorrect).length === 1;
}, { message: "Exactly 1 option must be correct." });
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Single Response item type is broken:
1. No Zod Schema.
2. V3 Prompt uses type `single_response`.

**Files to Create:**
1. `src/schemas/single.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-SingleResponse-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create schema with exactly 4 options, exactly 1 correct.
2. Rewrite prompt to V4.

Fix permanently at source.
```
