# FIX PLAN: SATA (MULTIPLE RESPONSE) ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_SATA_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-MultipleResponse-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/sata.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const SataOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const SataItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('sata'), z.literal('multiple_response'), z.literal('multiple-response')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        options: z.array(SataOptionSchema).min(4).max(8)
    })
}).refine((data) => {
    const correctCount = data.structure.options.filter(o => o.isCorrect).length;
    return correctCount >= 1 && correctCount < data.structure.options.length;
}, { message: "Must have at least 1 correct and at least 1 incorrect option." });
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The SATA item type is broken:
1. No Zod Schema (`src/schemas/sata.ts` missing).
2. V3 Prompt uses type `multiple_response`.
3. Ingestion does not route.

**Files to Create:**
1. `src/schemas/sata.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-MultipleResponse-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create Zod schema with `options` (5-8 items, at least 1 correct).
2. Handle type aliases: `sata`, `multiple_response`, `multiple-response`.
3. Rewrite prompt to V4.

Fix permanently at source.
```
