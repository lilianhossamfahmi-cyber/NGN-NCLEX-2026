# DEEP ROOT-CAUSE ANALYSIS: CONSISTENCY AUDIT
**Conducted:** 2026-01-06
**Scope:** Item Specs, Golden Prompts, Zod Schemas, Ingestion Service

---

## 🔴 CRITICAL FINDING 1: MISSING ZOD SCHEMAS

### Evidence:
The `src/schemas/` folder contains **only 4 files**:
- `bowtie.ts`
- `calculation.ts`
- `shared.ts`
- `index.ts`

### Missing Schemas:
| Item Type | Spec Exists? | Prompt Exists? | Schema Exists? |
|-----------|--------------|----------------|----------------|
| **Matrix** | ✅ | ✅ | ❌ **MISSING** |
| **Highlight** | ✅ | ✅ | ❌ **MISSING** |
| **Ordered Response** | ✅ | ✅ | ❌ **MISSING** |
| **Cloze (Drop-Down)** | ✅ | ✅ | ❌ **MISSING** |
| **SATA** | ✅ | ✅ | ❌ **MISSING** |
| **HotSpot** | ✅ | ✅ | ❌ **MISSING** |
| **Single Response** | ✅ | ✅ | ❌ **MISSING** |
| **Trend** | ✅ | ✅ | ❌ **MISSING** |
| **Case Study** | ✅ | ✅ | ❌ **MISSING** |

### Impact:
When the Ingestion Service receives a Matrix, Highlight, or any other non-Bow-Tie/Calculation item, it hits the `return clean` fallback (Line 28 of `ItemIngestionService.ts`). This means:
1.  **No Strict Validation** – Data passes through unchecked.
2.  **No Refinement Rules** – Count validations (e.g., "4-8 Rows") are not enforced.
3.  **Silent Failures** – Bad data renders incorrectly in UI instead of throwing errors.

### RECOMMENDATION:
Create Zod schemas for all 9 missing item types, mirroring the logic of `bowtie.ts`.

---

## 🔴 CRITICAL FINDING 2: RATIONALE SCHEMA CONFLICT

### Evidence:
**The Specs (NGN_*_SPEC.md)** require the 4-Key Rationale:
```json
{ "general", "pathophysiology", "safetyCheck", "clinicalTakeaway" }
```

**The Golden Prompts (Matrix, Highlight, Calculation, etc.)** request a *DIFFERENT* Rationale:
```json
{
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

**The Zod Schema (`shared.ts` Line 76)** only validates the 4-Key:
```typescript
export const StructuredRationaleSchema = z.object({
    general: JCIAText,
    pathophysiology: JCIAText,
    safetyCheck: JCIAText,
    clinicalTakeaway: JCIAText.optional(),
});
```

### Impact:
1.  **Matrix/Highlight/Calculation Prompts generate the "Rich" Rationale**, which **WILL FAIL** `StructuredRationaleSchema`.
2.  The `RationaleUnion` will fall back to treating it as a String (which also fails for an object).
3.  Result: Zod Error or data loss.

### RECOMMENDATION:
*Option A (Best)*: Update all Golden Prompts to use the 4-Key Rationale format consistently.
*Option B*: Expand `StructuredRationaleSchema` to accept the Rich format (but this is complex and inconsistent with specs).

---

## 🟠 HIGH-PRIORITY FINDING 3: PROMPT-SCHEMA NESTING MISMATCH

### Evidence:
**Bow-Tie Prompt (V4)** outputs this structure:
```json
{
  "type": "bow-tie",
  "prompt": "...",
  "metadata": { ... },
  "content": { "patient": ... },
  "rationale": { ... },
  "structure": { "actions": ... }
}
```
This is **correct** and matches `BowTieItemSchema`.

**Matrix/Highlight/Calculation Prompts (V3)** output this structure:
```json
{
  "type": "matrix",
  "content": {
    "metadata": { ... },    // <-- METADATA INSIDE CONTENT!
    "patient": { ... },
    "rationale": { ... },   // <-- RATIONALE INSIDE CONTENT!
    "structure": { ... }    // <-- STRUCTURE INSIDE CONTENT!
  }
}
```
This is **WRONG**. The Zod schemas expect `metadata`, `rationale`, and `structure` at the **root level**, not nested inside `content`.

### Impact:
1.  `MatrixItemSchema.parse()` (if it existed) would fail on `metadata: undefined`.
2.  Ingestion Service has *some* flattening logic (Lines 47-50) but does not explicitly lift `content.metadata` to `norm.metadata`.

### RECOMMENDATION:
1.  **Fix Prompts:** Update Matrix, Highlight, Calculation, and all other V3 prompts to match the V4 structure (root-level fields).
2.  **Fix Ingestion:** Add explicit logic to lift `content.metadata -> metadata`, `content.rationale -> rationale`, etc.

---

## 🟠 HIGH-PRIORITY FINDING 4: VITALS KEY INCONSISTENCY

### Evidence:
**Bow-Tie Prompt (V4):** Uses `"vitalSigns": [ ... ]`
**Matrix/Highlight Prompts (V3):** Uses `"vitals": [ ... ]`
**Zod Schema (`ContentSchema`):** Expects `"vitalSigns": z.array(...)`

### Impact:
AI generates `vitals`. Schema expects `vitalSigns`. Match fails. Data is lost.
The Ingestion Service **has a fix** (Line 96): `if (norm.vitals) norm.content.vitalSigns = norm.vitals;`
But this only works if the fix is applied.

### RECOMMENDATION:
Standardize all prompts to use `vitalSigns`.

---

## 🟡 MEDIUM FINDING 5: DIFFICULTY TYPE IN PROMPTS

### Evidence:
**Bow-Tie Prompt (V4):** `"difficulty": [LEVEL]` (resolves to a Number like `5`).
**Matrix/Highlight/Calculation Prompts (V3):** `"difficulty": "Hard"` (a String).
**Zod `MetadataSchema`:** `difficulty: z.coerce.number().min(1).max(5)`.

### Impact:
`z.coerce.number()` *should* coerce `"5"` to `5`, but it cannot coerce `"Hard"`.
Result: Zod defaults or rejects.

### RECOMMENDATION:
Update all V3 prompts to use numeric difficulty: `"difficulty": [LEVEL]`.

---

## 🟡 MEDIUM FINDING 6: PATIENT `sex` vs `gender`

### Evidence:
**Matrix/Highlight Prompts:** `"sex": "Male"`
**Zod `PatientSchema`:** `gender: z.string()` (No `sex` field).

### Impact:
If AI generates `sex` but not `gender`, validation fails.
Ingestion Service **has a fix** (Lines 269-270): `if (p.sex && !p.gender) p.gender = p.sex;`

### RECOMMENDATION:
Standardize prompts to use `gender`.

---

## 🟡 MEDIUM FINDING 7: INGESTION SERVICE - INCOMPLETE TYPE HANDLING

### Evidence:
The `ingest()` method (Lines 17-28) only handles:
- `calculation`
- `bow-tie`

All other types hit `return clean;` which bypasses Zod.

### Impact:
8+ item types are returned **unvalidated**. They may contain malformed data that crashes the UI or displays incorrectly.

### RECOMMENDATION:
Implement schema-based validation for all item types in the `ingest()` switch statement.

---

## 📊 SUMMARY TABLE

| Issue | Severity | Fix Location | Priority |
|-------|----------|--------------|----------|
| Missing Zod Schemas (9 types) | 🔴 Critical | `src/schemas/` | P0 |
| Rationale Structure Conflict | 🔴 Critical | Prompts + Schema | P0 |
| Prompt Nesting Mismatch (V3) | 🟠 High | Prompts | P1 |
| `vitals` vs `vitalSigns` | 🟠 High | Prompts | P1 |
| String Difficulty in V3 | 🟡 Medium | Prompts | P2 |
| `sex` vs `gender` | 🟡 Medium | Prompts | P2 |
| Ingestion Type Incompleteness | 🟡 Medium | `ItemIngestionService.ts` | P2 |

---

## ✅ PROPOSED FIX PLAN

### Phase 1 (Immediate): Stop the Bleeding
1.  **Upgrade all V3 Prompts to V4 Standard:**
    *   Root-level `metadata`, `rationale`, `structure`.
    *   Use `vitalSigns`, `gender`, numeric `difficulty`.
    *   Use the 4-Key Rationale (`general`, `pathophysiology`, `safetyCheck`, `clinicalTakeaway`).

### Phase 2 (Next 24 Hours): Build the Wall
2.  **Create Missing Zod Schemas:**
    *   `matrix.ts`, `highlight.ts`, `cloze.ts`, `sata.ts`, `ordered.ts`, `hotspot.ts`, `single.ts`, `trend.ts`, `casestudy.ts`.
    *   Each schema should have `refine()` rules for counts/mechanics.

### Phase 3 (Ongoing): Automation
3.  **Update Ingestion Service:**
    *   Add `if (clean.type === 'matrix') return MatrixItemSchema.parse(clean);` for all types.
    *   Add aggressive flattening for `content.metadata -> metadata`.

---

## 📊 DETAILED PER-ITEM-TYPE ANALYSIS

Below is an item-by-item audit comparing each **Spec** (What it should be), **Prompt** (What AI is asked), and **Schema** (What code validates).

---

### 1️⃣ BOW-TIE
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_BOWTIE_SPEC.md` | 4-Key Rationale, 5-4-5 structure |
| **Prompt** | `Golden-NGN-BowTie-Item.md` (V4) | ✅ **ALIGNED** - Root-level fields, numeric difficulty, 4-Key rationale |
| **Schema** | `src/schemas/bowtie.ts` | ✅ **EXISTS** - Has refine rules for 5-4-5 |
| **Ingestion** | Handled | ✅ Type `'bow-tie'` routed to schema |
| **Verdict** | ✅ PASS | This is the only fully V4-compliant item. |

---

### 2️⃣ CALCULATION
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_CALCULATION_SPEC.md` | 4-Key Rationale, numeric answer |
| **Prompt** | `Golden-NGN-Calculation-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale (coreConcept, caseSummary). Uses `"difficulty": "Hard"` (String). Nests `metadata` inside `content`. |
| **Schema** | `src/schemas/calculation.ts` | ✅ **EXISTS** - Expects `correctValue`, `units` |
| **Ingestion** | Handled | ✅ Type `'calculation'` routed to schema |
| **Verdict** | ⚠️ PARTIAL | Schema exists, but Prompt generates wrong Rationale format and nesting. |

---

### 3️⃣ MATRIX
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_MATRIX_SPEC.md` | 4-Key Rationale, Rows/Columns structure |
| **Prompt** | `Golden-NGN-Matrix-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Uses `"difficulty": "Hard"`. Nests `metadata`, `rationale`, `structure` inside `content`. Uses `vitals` not `vitalSigns`. Uses `sex` not `gender`. |
| **Schema** | ❌ **MISSING** | No `matrix.ts` file. |
| **Ingestion** | NOT Handled | Falls through to `return clean` (unvalidated). |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 4️⃣ HIGHLIGHT
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_HIGHLIGHT_SPEC.md` | 4-Key Rationale, Token structure |
| **Prompt** | `Golden-NGN-Highlight-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests everything in `content`. Uses `vitals`. Uses `sex`. |
| **Schema** | ❌ **MISSING** | No `highlight.ts` file. |
| **Ingestion** | NOT Handled | Falls through to `return clean`. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 5️⃣ DROP-CLOZE
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_CLOZE_SPEC.md` | 4-Key Rationale, `sentence` + `dropdowns` |
| **Prompt** | `Golden-NGN-DropCloze-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Uses `vitals`. Uses `sex`. |
| **Schema** | ❌ **MISSING** | No `cloze.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 6️⃣ ORDERED RESPONSE
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_ORDERED_RESPONSE_SPEC.md` | 4-Key Rationale, `options` with `rank` |
| **Prompt** | `Golden-NGN-OrderedResponse-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Uses `orderedOptions` (no `rank` field). Uses `vitals`. Uses `sex`. Type is `ordered_response` (underscore). |
| **Schema** | ❌ **MISSING** | No `ordered.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. Spec expects `rank`, Prompt uses array order. |

---

### 7️⃣ SATA (MULTIPLE RESPONSE)
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_SATA_SPEC.md` | 4-Key Rationale, `options` with `isCorrect` |
| **Prompt** | `Golden-NGN-MultipleResponse-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Type is `multiple_response`. |
| **Schema** | ❌ **MISSING** | No `sata.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 8️⃣ SINGLE RESPONSE
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_SINGLE_RESPONSE_SPEC.md` | 4-Key Rationale, 4 options, 1 correct |
| **Prompt** | `Golden-NGN-SingleResponse-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Type is `single_response`. |
| **Schema** | ❌ **MISSING** | No `single.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 9️⃣ HOTSPOT
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_HOTSPOT_SPEC.md` | 4-Key Rationale, `targetArea` with coordinates |
| **Prompt** | `Golden-NGN-HotSpot-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Type is `hot_spot`. |
| **Schema** | ❌ **MISSING** | No `hotspot.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 🔟 TREND
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_TREND_SPEC.md` | 4-Key Rationale, 3+ vitals timepoints |
| **Prompt** | `Golden-NGN-Trend-Item.md` (V3) | ❌ **CONFLICTS:** Uses Rich Rationale. Nests in `content`. Uses `vitals`. |
| **Schema** | ❌ **MISSING** | No `trend.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, wrong prompt format. |

---

### 1️⃣1️⃣ CASE STUDY
| Aspect | Status | Notes |
|--------|--------|-------|
| **Spec** | `NGN_CASE_STUDY_SPEC.md` | Wrapper for 6 items |
| **Prompt** | `Golden-NGN-Case-Study-6Q.md` | ⚠️ Large prompt, likely has V3 structures inside. |
| **Schema** | ❌ **MISSING** | No `casestudy.ts` file. |
| **Ingestion** | NOT Handled | Falls through. |
| **Verdict** | 🔴 FAIL | No schema, needs 6-item array validation. |

---

## 🎯 FINAL SUMMARY

| Item Type | Prompt Version | Schema Exists? | Ingestion Handled? | Overall Status |
|-----------|----------------|----------------|---------------------|----------------|
| Bow-Tie | ✅ V4 | ✅ Yes | ✅ Yes | ✅ PASS |
| Calculation | ❌ V3 | ✅ Yes | ✅ Yes | ⚠️ PARTIAL |
| Matrix | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Highlight | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Drop-Cloze | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Ordered | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| SATA | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Single | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| HotSpot | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Trend | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |
| Case Study | ❌ V3 | ❌ No | ❌ No | 🔴 FAIL |

**Conclusion:** Only **1 out of 11** item types is fully production-ready. The other 10 require:
1. Prompt upgrade to V4 format.
2. Zod schema creation.
3. Ingestion service routing.
