# NGN MATRIX: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated, clinically valid NGN Matrix item. The Matrix item (Extended Multiple Response) is critical for "Analyzing Cues" and "Evaluating Outcomes".

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Matrix-Item.md` | The generation instruction set. |
| **Zod Schema** | `src/schemas/matrix.ts` (or shared `QuestionSchema`) | Validates Row/Column structure. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Normalizes `options` vs `rows`. |
| **Testing** | `test/matrix_ingest.test.ts` (Dynamic) | Scripts to verify logic. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `4` (Analysis) or `5` (Expert) |
| **targetScore** | `number` | `85` |
| **clientNeeds** | `string` | `"Physiological Integrity"` |
| **cjmmStep** | `string` | `"Analyze Cues"` or `"Evaluate Outcomes"` |
| **topic** | `string` | `"DKA vs HHS Differentiation"` |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Grid" checks.*

### The Stem (`prompt`)
**Requirement:** Instruction + Scenario context.  
**Perfect Example:**  
> "For each client finding below, click to specify if the finding is consistent with Disease A, Disease B, or Both."

### The Grid Structure
**Strict Rule:** Minimum 3 Rows, Minimum 2 Columns.

| Component | Count | Structure | Example |
|-----------|-------|-----------|---------|
| **Columns** | **2-3** | Array of Headers | `["Ulcerative Colitis", "Crohn's Disease"]` |
| **Rows** | **4-8** | Array of Objects | Findings to evaluate. |

### Row Object Structure (Strict)
Each row MUST identify which columns it belongs to.
```json
{
  "id": "r1",
  "text": "Bloody Stool",
  "columns": [
    { "id": "c1", "isCorrect": true },  // Ulcerative Colitis (Yes)
    { "id": "c2", "isCorrect": false }  // Crohn's (No)
  ]
}
```

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*Matrix items typically rely on **Trend Analysis** or **Differential Diagnosis**.*

### A. Patient Data (Context)
- **Essential:** HPI and Vitals are critical to establishing the "Base State".
- **Example:** Patient presents with abdominal pain. Analysis requires comparing *baseline* vs *current*.

### B. Nurses Notes (The Comparison)
- **Requirement:** 2 Notes minimum (Admission vs Current).
- **Purpose:** The Matrix often asks "Improved", "No Change", or "Worsened". The notes **MUST** provide the evidence for this judgment.

### C. Labs (The Evidence)
- **Requirement:** Specific values relevant to the rows.
- **Consistency:** If Row 1 says "Hypokalemia", the Lab array MUST show `K+ = 2.9`.

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Differentiates the column topics (e.g. "UC affects mucosa; Crohns is transmural"). |
| **pathophysiology** | Specific mechanisms for the row findings. |
| **safetyCheck** | Critical alerts (e.g. "Toxic Megacolon risk"). |
| **clinicalTakeaway** | Key differentiator (e.g. "Rectal bleeding is hallmark of UC"). |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Difficulty is Numeric.
3. [ ] Columns are defined (2-3 headers).
4. [ ] Rows (4-6) are defined with explicit correct/incorrect mapping per column.
5. [ ] Row content matches Clinical Data (e.g. Labs support the answer).
6. [ ] Rationale explains *each* row's classification.
