# FIX PLAN: TREND ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_TREND_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Trend-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/trend.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion, VitalSignSchema } from './shared';

const TrendOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const TrendItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('trend'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        questionFormat: z.enum(['sata', 'matrix', 'single']).optional(),
        options: z.array(TrendOptionSchema).min(3)
    })
}).refine((data) => {
    return data.content.vitalSigns.length >= 3;
}, { message: "Trend items require at least 3 vital sign timepoints." });
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Trend item type is broken:
1. No Zod Schema.
2. V3 Prompt nests incorrectly.
3. Trend items require 3+ vitals timepoints to show progression.

**Files to Create:**
1. `src/schemas/trend.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-Trend-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create schema requiring 3+ `vitalSigns` entries.
2. Add refine rule for timepoint validation.
3. Rewrite prompt to V4.

Fix permanently at source.
```
