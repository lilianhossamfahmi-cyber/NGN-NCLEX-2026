# FIX PLAN: HIGHLIGHT ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

The Highlight item type has **no Zod schema** and a **V3 prompt** that generates conflicting structure.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_HIGHLIGHT_SPEC.md` | Defines "Perfect Content" | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md` | V3 Prompt (NEEDS UPGRADE) | ❌ Misaligned |
| **Zod Schema** | `src/schemas/highlight.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Shared Schema** | `src/schemas/shared.ts` | ContentSchema, RationaleUnion | ✅ Available |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route `highlight` | ❌ Not Handled |
| **UI Component** | `src/components/Highlight/HighlightText.tsx` | Renders selectable text | ⚠️ Verify |

---

## 2️⃣ IDENTIFIED ISSUES

### A. Missing Zod Schema
No `src/schemas/highlight.ts` file.

### B. Prompt Nesting (V3)
Nests `metadata`, `rationale`, `structure` inside `content`.

### C. Rationale Conflict
Uses Rich Rationale instead of 4-Key Schema.

### D. Clinical Data Keys
Uses `vitals`, `sex` instead of `vitalSigns`, `gender`.

### E. Ingestion Not Handled
No routing for `highlight` type.

---

## 3️⃣ FIX PLAN (STEP-BY-STEP)

### Step 1: Create Zod Schema
**New File:** `src/schemas/highlight.ts`

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const TokenSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

export const HighlightItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('highlight'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        text: z.string().optional(), // Raw text with <span> tags
        tokens: z.array(TokenSchema).optional(), // Pre-tokenized
        correct: z.array(z.string()).optional(), // Legacy format
        decoys: z.array(z.string()).optional()
    })
});

export type HighlightItem = z.infer<typeof HighlightItemSchema>;
```

### Step 2: Update Golden Prompt to V4
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md`

### Step 3: Update Ingestion Service
**File:** `src/services/ingestion/ItemIngestionService.ts`

```typescript
if (clean.type === 'highlight') {
    return HighlightItemSchema.parse(clean);
}
```

### Step 4: Export Schema & Test

---

## 4️⃣ AI PROMPT TO FIX HIGHLIGHT PERMANENTLY

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Highlight item type is broken:
1. **No Zod Schema exists** (`src/schemas/highlight.ts` is missing).
2. **V3 Golden Prompt** nests fields incorrectly.
3. **Rich Rationale** format instead of 4-Key Schema.
4. **Wrong clinical keys** (`vitals`, `sex`).
5. **Ingestion Service** does not route `highlight` type.

**Files to Create:**
1. `src/schemas/highlight.ts` - New Zod schema.

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md` - Upgrade to V4.
3. `src/services/ingestion/ItemIngestionService.ts` - Add routing.
4. `src/schemas/index.ts` - Export schema.

**Files to Reference:**
1. `docs/item_specs/NGN_HIGHLIGHT_SPEC.md` - Specification (Token structure).
2. `src/schemas/bowtie.ts` - Schema reference.
3. `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` - V4 template.

**Task:**
1. **Create `highlight.ts` schema:**
   - Validate `tokens` array (id, text, isCorrect).
   - Support legacy `text` + `correct`/`decoys` format.
   - Use shared schemas.

2. **Rewrite prompt to V4 structure:**
   - Root-level fields.
   - 4-Key Rationale.
   - Numeric difficulty.
   - Standard clinical keys.

3. **Update ingestion routing.**

4. **Export schema.**

Fix the issue permanently at its source.
```
