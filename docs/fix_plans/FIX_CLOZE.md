# FIX PLAN: DROP-CLOZE ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_CLOZE_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-DropCloze-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/cloze.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const DropdownOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

const DropdownSchema = z.object({
    id: z.string(),
    options: z.array(DropdownOptionSchema).min(2).max(5)
});

export const ClozeItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('cloze'), z.literal('drop-cloze')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        text: z.string(), // "The nurse should administer %{d1} because..."
        dropdowns: z.array(DropdownSchema).min(1)
    })
});
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Drop-Cloze item type is broken:
1. No Zod Schema (`src/schemas/cloze.ts` missing).
2. V3 Prompt nests fields incorrectly.
3. Rich Rationale instead of 4-Key.
4. Ingestion does not route `cloze` or `drop-cloze` types.

**Files to Create:**
1. `src/schemas/cloze.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-DropCloze-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create Zod schema validating `text` with `%{dropdownId}` placeholders and `dropdowns` array.
2. Rewrite prompt to V4 (root-level fields, 4-Key Rationale, numeric difficulty).
3. Add ingestion routing for both `cloze` and `drop-cloze` types.

Fix permanently at source.
```
