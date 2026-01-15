# FIX PLAN: ORDERED RESPONSE ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_ORDERED_RESPONSE_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-OrderedResponse-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/ordered.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const OrderedOptionSchema = z.object({
    id: z.string(),
    text: z.string(),
    rank: z.number().int().min(1) // The correct position
});

export const OrderedResponseItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('ordered-response'), z.literal('ordered_response')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        options: z.array(OrderedOptionSchema).min(3).max(8)
    })
}).refine((data) => {
    // Verify ranks are sequential 1, 2, 3...
    const ranks = data.structure.options.map(o => o.rank).sort((a, b) => a - b);
    return ranks.every((r, i) => r === i + 1);
}, { message: "Ranks must be sequential starting from 1." });
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Ordered Response item type is broken:
1. No Zod Schema (`src/schemas/ordered.ts` missing).
2. V3 Prompt uses `orderedOptions` (array order) instead of `options` with explicit `rank` field.
3. Type is `ordered_response` (underscore) in prompt.
4. Ingestion does not route.

**Files to Create:**
1. `src/schemas/ordered.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-OrderedResponse-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create Zod schema with `options` containing explicit `rank` field (1, 2, 3...).
2. Add refine rule to verify sequential ranks.
3. Rewrite prompt to V4 with `rank` field per option.
4. Handle both `ordered-response` and `ordered_response` type aliases.

Fix permanently at source.
```
