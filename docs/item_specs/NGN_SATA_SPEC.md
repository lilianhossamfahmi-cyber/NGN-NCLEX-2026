# NGN MULTIPLE RESPONSE (SATA): PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Multiple Response (Select All That Apply) item. This item type is primarily used for **"Evaluating Outcomes"** (CJMM Step 6) or **"Recognizing Cues"** (CJMM Step 1).

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-SATA-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/multires.ts` | Validates options array. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Normalizes options. |
| **Testing** | `test/sata_ingest.test.ts` (Dynamic) | Scripts to verify logic. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `4` (Complex Evaluation) |
| **targetScore** | `number` | `85` |
| **clientNeeds** | `string` | `"Health Promotion and Maintenance"` |
| **cjmmStep** | `string` | `"Evaluate Outcomes"` |
| **topic** | `string` | `"Discharge Teaching Effectiveness"` |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Evaluation" mechanics.*

### The Stem (`prompt`)
**Requirement:** Directive to select multiple valid options.  
**Perfect Example:**  
> "Which of the following client statements indicate a correct understanding of the teaching? Select all that apply."

### The Options (`structure.options`)
**Strict Rule:** Minimum 5 Options, Maximum 8. (Standard NGN is usually 5-6).
**Correct Rule:** NGN standard allows *Minimum 1 Correct* and *Maximum N Correct* (Can even be ALL correct, though rare). Typically 2-4 correct.

**Score Model:** +/- Scoring (Plus/Minus).
- Correct selection = +1 point.
- Incorrect selection = -1 point.
- Score cannot go below 0.

```json
"structure": {
  "options": [
    { "id": "o1", "text": "I will take my medication with food.", "isCorrect": true },
    { "id": "o2", "text": "I will weigh myself daily.", "isCorrect": true },
    { "id": "o3", "text": "I can stop the medication if I feel better.", "isCorrect": false },
    { "id": "o4", "text": "I will report swelling to my provider.", "isCorrect": true },
    { "id": "o5", "text": "I will double the dose if I miss one.", "isCorrect": false }
  ]
}
```

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*Evaluation requires looking back at the intervention.*

### A. Nurses Notes (The Instruction)
- If the question asks about "teaching effectiveness," the Notes must document *what was taught*.
- **Example:** "RN educated client on Heart Failure self-management: Daily weights, Diet, Med adherence."

### B. Vitals (The Change)
- If the question asks "Which findings indicate improvement?", the Vitals should show a trend (e.g. BP decreased from admission). The correct options pick out these "Improved" metrics.

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Framework for the evaluation (e.g. "Effective learning is demonstrated by accurate teach-back"). |
| **pathophysiology** | Why specific statements are wrong (e.g. "Do not double dose; risk of toxicity"). |
| **safetyCheck** | **CRITICAL WARNING** about the incorrect options. |
| **clinicalTakeaway** | Summary of the key learning points. |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Difficulty is Numeric.
3. [ ] Stem includes "Select all that apply".
4. [ ] Options count is 5-6.
5. [ ] At least 1 option is Correct.
6. [ ] Context (Notes/Vitals) explicitly supports the correct choices.
7. [ ] Rationale addresses every option (Why Correct vs Why Incorrect).
