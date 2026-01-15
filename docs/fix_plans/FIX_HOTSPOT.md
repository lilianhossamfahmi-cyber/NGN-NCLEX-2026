# FIX PLAN: HOTSPOT ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_HOTSPOT_SPEC.md` | Defines requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-HotSpot-Item.md` | V3 Prompt | ❌ Misaligned |
| **Zod Schema** | `src/schemas/hotspot.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route | ❌ Not Handled |

---

## 2️⃣ SCHEMA TEMPLATE

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const TargetAreaSchema = z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    radius: z.number().min(1).max(50)
});

export const HotSpotItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.union([z.literal('hotspot'), z.literal('hot_spot'), z.literal('hot-spot')]),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        imageUrl: z.string().url().optional(),
        imageGenerationPrompt: z.string().optional(),
        targetArea: TargetAreaSchema
    })
});
```

---

## 3️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The HotSpot item type is broken:
1. No Zod Schema.
2. V3 Prompt uses type `hot_spot`.
3. Needs coordinate validation (x, y, radius as percentages).

**Files to Create:**
1. `src/schemas/hotspot.ts`

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-HotSpot-Item.md` - V4 upgrade.
3. `src/services/ingestion/ItemIngestionService.ts` - Routing.
4. `src/schemas/index.ts` - Export.

**Task:**
1. Create schema with `targetArea` (x, y, radius 0-100).
2. Handle type aliases.
3. Rewrite prompt to V4.

Fix permanently at source.
```
