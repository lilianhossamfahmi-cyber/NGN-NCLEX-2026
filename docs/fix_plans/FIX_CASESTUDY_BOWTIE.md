# FIX PLAN: CASE STUDY BOW-TIE (EMBEDDED) ITEM TYPE

## 📊 CURRENT STATUS: ⚠️ REVIEW NEEDED (SPECIAL VARIANT)

This is a **specialized Bow-Tie prompt** designed to be generated as **Item #4** within a 6-item Case Study. It shares the same schema as standalone Bow-Tie but has additional context requirements.

---

## 1️⃣ CONNECTED FILES (DEPENDENCY MAP)

| Layer | File Path | Purpose | Status |
|-------|-----------|---------|--------|
| **Specification** | `docs/item_specs/NGN_BOWTIE_SPEC.md` | Same as standalone | ✅ Complete |
| **Parent Spec** | `docs/item_specs/NGN_CASE_STUDY_SPEC.md` | 6-item wrapper rules | ✅ Complete |
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q-BowTie-Item.md` | Embedded BowTie prompt | ⚠️ Review |
| **Zod Schema** | `src/schemas/bowtie.ts` | Same as standalone | ✅ Exists |
| **Ingestion Service** | `src/services/ingestion/ItemIngestionService.ts` | Handles `bow-tie` | ✅ Handled |

---

## 2️⃣ SPECIAL REQUIREMENTS (CASE STUDY CONTEXT)

### A. Content Inheritance
When the Bow-Tie is embedded in a Case Study:
- The `content` object (Patient, Vitals, Notes) is **shared** with the parent Case Study.
- The Bow-Tie should NOT redefine patient demographics.
- It should reference the clinical data that **already exists** by Screen 4.

### B. CJMM Position
- The Bow-Tie is always **Item #4** (Generate Solutions).
- Items 1-3 have already presented the clinical picture.
- The Bow-Tie asks the learner to synthesize and act.

### C. Content Accumulation
By the time the learner reaches Item #4:
- **Nurses Notes:** Should have 2-3 entries from Screens 1-3.
- **Vitals:** Should show a trend (deterioration/improvement).
- **Labs/Radiology:** May have been revealed in earlier screens.

---

## 3️⃣ POTENTIAL ISSUES

### A. Redundant Content Generation
If the prompt is used standalone (outside Case Study), it might generate redundant patient data.

### B. V3 vs V4 Alignment
Review whether this prompt follows V4 structure (root-level fields, 4-Key Rationale).

---

## 4️⃣ FIX PLAN (STEP-BY-STEP)

### Step 1: Review Prompt
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q-BowTie-Item.md`

**Verify:**
1. Uses V4 structure (root-level `prompt`, `metadata`, `rationale`, `structure`).
2. Uses 4-Key Rationale.
3. References "existing clinical data" instead of generating new.

### Step 2: Align with Parent Case Study
**File:** `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md`

**Verify:**
1. Item #4 is explicitly a Bow-Tie.
2. The parent prompt instructs AI to use accumulated content for Item #4.

---

## 5️⃣ AI PROMPT TO FIX

```
You are an expert TypeScript/React developer working on the NGN Item Generator.

**Context:**
The Case-Study-6Q-BowTie prompt is a specialized variant for generating a Bow-Tie as Item #4 within a 6-item Case Study.

**Requirements:**
1. The Bow-Tie should NOT regenerate patient demographics (these are inherited from the Case Study wrapper).
2. It should reference the clinical data that has accumulated by Screen 4.
3. It must follow V4 structure (root-level fields, 4-Key Rationale, numeric difficulty).
4. It must use the same 5-4-5 mechanics as standalone Bow-Tie.

**Files to Review:**
1. `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q-BowTie-Item.md` - The embedded prompt.
2. `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md` - The parent Case Study prompt.
3. `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` - The V4 standalone template.

**Task:**
1. Review the embedded Bow-Tie prompt for V4 alignment.
2. Ensure it references accumulated content (not regenerating).
3. Update if necessary to match standalone V4 structure.
4. Verify parent Case Study prompt correctly positions Bow-Tie as Item #4.

Fix any inconsistencies permanently.
```
