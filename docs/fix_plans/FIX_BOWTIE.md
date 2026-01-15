# FIX PLAN: BOW-TIE ITEM TYPE

## 📊 CURRENT STATUS: ✅ PASS (REFERENCE TEMPLATE)

The Bow-Tie item type is **fully production-ready**. This document serves as the **Gold Standard Template** for all other item types.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_BOWTIE_SPEC.md` | Defines "Perfect Content" requirements | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` | V4 Prompt for AI generation | ✅ Aligned |
| **Zod Schema** | `src/schemas/bowtie.ts` | Strict validation (5-4-5 counts) | ✅ Exists |
| **Shared Schema** | `src/schemas/shared.ts` | ContentSchema, RationaleUnion, MetadataSchema | ✅ Used |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Normalization & routing | ✅ Handles `bow-tie` |
| **UI Component** | `src/components/BowTie/BowTieDiagram.tsx` | Renders the interactive diagram | ✅ Exists |

---

## 2️⃣ WHAT MAKES IT WORK (THE V4 STANDARD)

### A. Prompt Structure (Root-Level Fields)
```json
{
  "type": "bow-tie",
  "prompt": "...",           // ROOT LEVEL
  "metadata": { ... },       // ROOT LEVEL
  "content": { ... },        // Clinical Data Only
  "rationale": { ... },      // ROOT LEVEL
  "structure": { ... }       // ROOT LEVEL
}
```

### B. Rationale Schema (4-Key)
```json
"rationale": {
  "general": "...",
  "pathophysiology": "...",
  "safetyCheck": "...",
  "clinicalTakeaway": "..."
}
```

### C. Metadata (Numeric Difficulty)
```json
"metadata": {
  "difficulty": 5,           // NUMBER, not "Hard"
  "topic": "...",
  "targetScore": 90
}
```

### D. Clinical Data Keys
- Uses `vitalSigns` (not `vitals`)
- Uses `gender` (not `sex`)
- Uses `nursesNotes` (not `nurseNotes`)

### E. Ingestion Routing
```typescript
if (clean.type === 'bow-tie' || clean.type === 'bowtie') {
    clean.type = 'bow-tie';
    return BowTieItemSchema.parse(clean);
}
```

---

## 3️⃣ CHECKLIST FOR REPLICATING TO OTHER TYPES

When creating a fix plan for another item type, ensure:

1. [ ] **Prompt updated to V4 structure** (root-level fields).
2. [ ] **Rationale uses 4-Key Schema** (general, pathophysiology, safetyCheck, clinicalTakeaway).
3. [ ] **Metadata uses numeric difficulty** (`difficulty: 5`).
4. [ ] **Clinical data uses standard keys** (vitalSigns, gender, nursesNotes).
5. [ ] **Zod Schema exists** in `src/schemas/[type].ts`.
6. [ ] **Ingestion Service routes the type** to the schema.
7. [ ] **UI Component exists** to render the structure.

---

## 4️⃣ AI PROMPT (FOR FUTURE MAINTENANCE)

If issues arise with Bow-Tie items, use this prompt to diagnose and fix:

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Bow-Tie item type is the "Gold Standard" for the application. All other item types should follow its V4 structure.

**Files to Reference:**
1. `docs/item_specs/NGN_BOWTIE_SPEC.md` - The specification.
2. `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` - The AI prompt.
3. `src/schemas/bowtie.ts` - The Zod validation schema.
4. `src/schemas/shared.ts` - The shared schemas (ContentSchema, RationaleUnion).
5. `src/services/ingestion/ItemIngestionService.ts` - The normalization logic.

**Task:**
[INSERT SPECIFIC ISSUE HERE - e.g., "Validation is failing on the rationale field"]

**Requirements:**
1. Ensure the Golden Prompt generates JSON that matches the Zod Schema exactly.
2. Ensure the Ingestion Service correctly routes and normalizes the item.
3. Preserve the V4 structure (root-level prompt, metadata, rationale, structure).
4. Use the 4-Key Rationale Schema (general, pathophysiology, safetyCheck, clinicalTakeaway).
5. Use numeric difficulty (1-5), not string labels.

Fix the issue permanently at its source.
```
