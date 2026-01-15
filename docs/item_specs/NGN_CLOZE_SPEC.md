# NGN DROP-DOWN CLOZE: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Drop-Down Cloze item. This item type is primarily used for **"Taking Action"** (CJMM Step 5), where the nurse completes a sentence to finalize the care plan.

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-DropCloze-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/cloze.ts` | Validates sentence structure & options. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Embeds tokens into text. |
| **Testing** | `test/cloze_ingest.test.ts` (Dynamic) | Scripts to verify gaps. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `3` (Standard) |
| **targetScore** | `number` | `80` |
| **clientNeeds** | `string` | `"Safe and Effective Care Environment"` |
| **cjmmStep** | `string` | `"Take Action"` |
| **topic** | `string` | `"Post-Op Discharge Planning"` |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Fill in the Blanks" mechanics.*

### The Stem (`prompt`)
**Requirement:** Instruction to complete the sentence.  
**Perfect Example:**  
> "Complete the following sentence regarding the client's discharge plan."

### The Sentence Structure (`structure.sentence`)
**Strict Rule:** Must contain bracketed placeholders `[drop1]`, `[drop2]`.
**Example:**  
> "The nurse should maximize [drop1] and instruct the client to avoid [drop2]."

### The Options (`structure.options`)
**Strict Rule:** Each Dropdown ID must match the sentence placeholder.
Each dropdown must have 3-5 options. ONE correct.

```json
"structure": {
  "sentence": "The nurse should monitor for [drop1] and prepare to administer [drop2].",
  "options": [
    {
      "id": "drop1",
      "items": [
        { "id": "o1", "text": "Hypoglycemia", "isCorrect": true },
        { "id": "o2", "text": "Hyperglycemia", "isCorrect": false },
        { "id": "o3", "text": "Hypertension", "isCorrect": false }
      ]
    },
    {
      "id": "drop2",
      "items": [
        { "id": "o4", "text": "Dextrose 50%", "isCorrect": true },
        { "id": "o5", "text": "Insulin Lispro", "isCorrect": false },
        { "id": "o6", "text": "Labetalol", "isCorrect": false }
      ]
    }
  ]
}
```

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*The sentence completion relies on the synthesis of the chart.*

### A. Labs (The Trigger)
- **Essential:** If the answer is "Hypoglycemia", the labs MUST show `Glucose: 52 mg/dL`.
- **Consistency:** The clinical picture must unambiguously point to ONE option in the dropdown. Distractors should be plausible but clearly ruled out by the data (e.g. Insulin is wrong because Glucose is low).

### B. Orders
- The sentence often involves *Anticipating* orders. The "Correct Action" shouldn't necessarily be in the current orders list (unless it's "Continue..."), but rather what needs to be added.

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Reasoning for the full sentence construction. |
| **pathophysiology** | Why the specific condition (Drop 1) is happening. |
| **safetyCheck** | **CRITICAL WARNING** about the wrong action (Drop 2). |
| **clinicalTakeaway** | The unified care principle (Condition -> Action). |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Sentence contains correct `[dropX]` placeholders.
3. [ ] Options object keys match the placeholders.
4. [ ] Each dropdown has exactly 1 Correct Answer.
5. [ ] Distractors are clinically relevant but incorrect.
6. [ ] Clinical data (Labs/Vitals) explicitly supports the correct choice.
