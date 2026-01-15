# FIX PLAN: CALCULATION ITEM TYPE

## 📊 CURRENT STATUS: ⚠️ PARTIAL (SCHEMA EXISTS, PROMPT MISALIGNED)

The Calculation item has a working Zod schema, but the **Golden Prompt is V3** and generates conflicting structure.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_CALCULATION_SPEC.md` | Defines "Perfect Content" | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Calculation-Item.md` | V3 Prompt (NEEDS UPGRADE) | ❌ Misaligned |
| **Zod Schema** | `src/schemas/calculation.ts` | Validates correctValue, units | ✅ Exists |
| **Shared Schema** | `src/schemas/shared.ts` | ContentSchema, RationaleUnion | ✅ Used |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Routes `calculation` type | ✅ Handles |
| **UI Component** | `src/components/Calculation/CalculationInput.tsx` | Renders input field | ⚠️ Verify |

---

## 2️⃣ IDENTIFIED ISSUES

### A. Prompt Nesting (V3 Structure)
**Current (Wrong):**
```json
{
  "type": "calculation",
  "content": {
    "metadata": { ... },      // INSIDE content (WRONG)
    "rationale": { ... },     // INSIDE content (WRONG)
    "structure": { ... }      // INSIDE content (WRONG)
  }
}
```

**Required (V4 Structure):**
```json
{
  "type": "calculation",
  "prompt": "...",
  "metadata": { ... },        // ROOT LEVEL
  "content": { ... },         // Clinical Data Only
  "rationale": { ... },       // ROOT LEVEL
  "correctValue": 125,        // ROOT LEVEL
  "units": "mL/hr"            // ROOT LEVEL
}
```

### B. Rationale Conflict
**Current (Wrong - Rich Rationale):**
```json
"rationale": {
  "coreConcept": "...",
  "caseSummary": "...",
  "answerAnalysis": "...",
  "trap": "...",
  "goldenRule": "...",
  "mnemonic": { ... },
  "cheatSheet": { ... },
  "referenceInfo": { ... },
  "difficulty": { ... }
}
```

**Required (4-Key Schema):**
```json
"rationale": {
  "general": "...",
  "pathophysiology": "...",
  "safetyCheck": "...",
  "clinicalTakeaway": "..."
}
```

### C. Difficulty Type
**Current:** `"difficulty": "Hard"` (String)
**Required:** `"difficulty": 5` (Number)

### D. Clinical Data Keys
**Current:** Uses `vitals`, `sex`
**Required:** Uses `vitalSigns`, `gender`

---

## 3️⃣ FIX PLAN (STEP-BY-STEP)

### Step 1: Update Golden Prompt to V4
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Calculation-Item.md`

**Changes:**
1. Move `metadata` to root level.
2. Move `rationale` to root level.
3. Move `correctValue` and `units` to root level.
4. Replace Rich Rationale with 4-Key Schema.
5. Change `"difficulty": "Hard"` to `"difficulty": [LEVEL]`.
6. Change `vitals` to `vitalSigns`.
7. Change `sex` to `gender`.

### Step 2: Verify Schema Alignment
**File:** `src/schemas/calculation.ts`

**Verify:**
- `correctValue` is at root level.
- `units` is at root level.
- `rationale` uses `RationaleUnion`.
- `metadata` uses `MetadataSchema`.

### Step 3: Update Ingestion Service (If Needed)
**File:** `src/services/ingestion/ItemIngestionService.ts`

**Add:**
- Flattening logic for `content.correctValue -> correctValue`.
- Flattening logic for `content.units -> units`.

### Step 4: Test
1. Generate a Calculation item with the updated prompt.
2. Verify JSON matches schema.
3. Verify UI renders correctly.

---

## 4️⃣ AI PROMPT TO FIX CALCULATION PERMANENTLY

Copy and paste this prompt to an AI assistant:

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Calculation item type has a V3 Golden Prompt that conflicts with the V4 standard established by the Bow-Tie item. The Zod schema exists but the AI-generated JSON fails validation due to:
1. Nested `metadata`, `rationale`, `structure` inside `content`.
2. Rich Rationale format instead of 4-Key Schema.
3. String difficulty ("Hard") instead of numeric (5).
4. `vitals` instead of `vitalSigns`.
5. `sex` instead of `gender`.

**Files to Modify:**
1. `docs/external_prompts/Golden Prompts/Golden-NGN-Calculation-Item.md` - Upgrade to V4 format.
2. `src/services/ingestion/ItemIngestionService.ts` - Add flattening for `content.correctValue -> correctValue`.

**Files to Reference (Do Not Modify):**
1. `docs/item_specs/NGN_CALCULATION_SPEC.md` - The specification.
2. `src/schemas/calculation.ts` - The Zod schema.
3. `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` - The V4 template.

**Task:**
1. Rewrite `Golden-NGN-Calculation-Item.md` to match the V4 structure:
   - Root-level `prompt`, `metadata`, `rationale`, `correctValue`, `units`.
   - 4-Key Rationale (`general`, `pathophysiology`, `safetyCheck`, `clinicalTakeaway`).
   - Numeric `difficulty` (`[LEVEL]`).
   - Standard clinical keys (`vitalSigns`, `gender`, `nursesNotes`).
2. Update `ItemIngestionService.ts` to flatten `content.correctValue -> correctValue` and `content.units -> units` if nested.
3. Preserve all existing calculation-specific logic (formula requirements, precision).

**Deliverables:**
- Full updated content for `Golden-NGN-Calculation-Item.md`.
- Code changes for `ItemIngestionService.ts`.

Fix the issue permanently at its source.
```
