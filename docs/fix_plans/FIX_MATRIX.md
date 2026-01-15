# FIX PLAN: MATRIX ITEM TYPE

## 📊 CURRENT STATUS: 🔴 FAIL (NO SCHEMA, V3 PROMPT)

The Matrix item type has **no Zod schema** and a **V3 prompt** that generates conflicting structure.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_MATRIX_SPEC.md` | Defines "Perfect Content" | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Matrix-Item.md` | V3 Prompt (NEEDS UPGRADE) | ❌ Misaligned |
| **Zod Schema** | `src/schemas/matrix.ts` | **DOES NOT EXIST** | ❌ Missing |
| **Shared Schema** | `src/schemas/shared.ts` | ContentSchema, RationaleUnion | ✅ Available |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Does NOT route `matrix` | ❌ Not Handled |
| **UI Component** | `src/components/Matrix/MatrixGrid.tsx` | Renders the grid | ⚠️ Verify |

---

## 2️⃣ IDENTIFIED ISSUES

### A. Missing Zod Schema
There is no `src/schemas/matrix.ts` file. The ingestion service falls through to `return clean` without validation.

### B. Prompt Nesting (V3 Structure)
**Current (Wrong):**
```json
{
  "type": "matrix",
  "content": {
    "metadata": { ... },
    "rationale": { ... },
    "structure": { "columns": [...], "rows": [...] }
  }
}
```

**Required (V4 Structure):**
```json
{
  "type": "matrix",
  "prompt": "...",
  "metadata": { ... },
  "content": { ... },         // Clinical Data Only
  "rationale": { ... },
  "structure": {
    "columns": [...],
    "rows": [...]
  }
}
```

### C. Rationale Conflict
**Current:** Rich Rationale (coreConcept, caseSummary...)
**Required:** 4-Key Schema (general, pathophysiology, safetyCheck, clinicalTakeaway)

### D. Difficulty Type
**Current:** `"difficulty": "Hard"` (String)
**Required:** `"difficulty": 5` (Number)

### E. Clinical Data Keys
**Current:** `vitals`, `sex`
**Required:** `vitalSigns`, `gender`

### F. Ingestion Not Handled
The ingestion service does not have a case for `matrix` type.

---

## 3️⃣ FIX PLAN (STEP-BY-STEP)

### Step 1: Create Zod Schema
**New File:** `src/schemas/matrix.ts`

```typescript
import { z } from 'zod';
import { ContentSchema, MetadataSchema, RationaleUnion } from './shared';

const ColumnSchema = z.object({
    id: z.string(),
    text: z.string()
});

const RowSchema = z.object({
    id: z.string(),
    text: z.string(),
    correctColumnId: z.string()
});

export const MatrixItemSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    type: z.literal('matrix'),
    prompt: z.string(),
    content: ContentSchema,
    rationale: RationaleUnion,
    metadata: MetadataSchema.optional(),
    structure: z.object({
        columns: z.array(ColumnSchema).min(2).max(4),
        rows: z.array(RowSchema).min(3).max(8)
    })
});

export type MatrixItem = z.infer<typeof MatrixItemSchema>;
```

### Step 2: Update Golden Prompt to V4
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Matrix-Item.md`

**Changes:**
1. Move `metadata`, `rationale`, `structure` to root level.
2. Replace Rich Rationale with 4-Key Schema.
3. Change `"difficulty": "Hard"` to `"difficulty": [LEVEL]`.
4. Change `vitals` to `vitalSigns`.
5. Change `sex` to `gender`.

### Step 3: Update Ingestion Service
**File:** `src/services/ingestion/ItemIngestionService.ts`

**Add routing:**
```typescript
if (clean.type === 'matrix') {
    return MatrixItemSchema.parse(clean);
}
```

### Step 4: Export Schema
**File:** `src/schemas/index.ts`

**Add:**
```typescript
export * from './matrix';
```

### Step 5: Test
1. Generate a Matrix item with the updated prompt.
2. Verify JSON passes schema validation.
3. Verify UI renders correctly.

---

## 4️⃣ AI PROMPT TO FIX MATRIX PERMANENTLY

Copy and paste this prompt to an AI assistant:

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Matrix item type is completely broken:
1. **No Zod Schema exists** (`src/schemas/matrix.ts` is missing).
2. **V3 Golden Prompt** nests `metadata`, `rationale`, `structure` inside `content`.
3. **Rich Rationale** format instead of 4-Key Schema.
4. **String difficulty** ("Hard") instead of numeric (5).
5. **Wrong clinical keys** (`vitals`, `sex` instead of `vitalSigns`, `gender`).
6. **Ingestion Service** does not route `matrix` type to any schema.

**Files to Create:**
1. `src/schemas/matrix.ts` - New Zod schema for Matrix items.

**Files to Modify:**
2. `docs/external_prompts/Golden Prompts/Golden-NGN-Matrix-Item.md` - Upgrade to V4 format.
3. `src/services/ingestion/ItemIngestionService.ts` - Add routing for `matrix` type.
4. `src/schemas/index.ts` - Export the new Matrix schema.

**Files to Reference (Do Not Modify):**
1. `docs/item_specs/NGN_MATRIX_SPEC.md` - The specification (Rows/Columns structure).
2. `src/schemas/bowtie.ts` - Reference for schema structure.
3. `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` - V4 template.

**Task:**
1. **Create `matrix.ts` schema:**
   - Validate `columns` (2-4 items, each with `id` and `text`).
   - Validate `rows` (3-8 items, each with `id`, `text`, and `correctColumnId`).
   - Use `ContentSchema`, `MetadataSchema`, `RationaleUnion` from shared.ts.

2. **Rewrite `Golden-NGN-Matrix-Item.md` to V4 structure:**
   - Root-level `prompt`, `metadata`, `rationale`, `structure`.
   - 4-Key Rationale.
   - Numeric `difficulty`.
   - Standard clinical keys (`vitalSigns`, `gender`, `nursesNotes`).

3. **Update `ItemIngestionService.ts`:**
   - Add: `if (clean.type === 'matrix') return MatrixItemSchema.parse(clean);`
   - Add flattening for `content.structure -> structure` if needed.

4. **Export schema in `index.ts`.**

**Deliverables:**
- Full content for new `src/schemas/matrix.ts`.
- Full updated content for `Golden-NGN-Matrix-Item.md`.
- Code changes for `ItemIngestionService.ts`.
- Export statement for `index.ts`.

Fix the issue permanently at its source.
```
