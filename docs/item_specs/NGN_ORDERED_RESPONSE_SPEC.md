# NGN ORDERED RESPONSE: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Ordered Response item (Drag and Drop / Ranking). This item type is primarily used for **"Prioritizing Hypotheses"** or **"Taking Action"** (CJMM Steps 3 & 5).

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-OrderedResponse-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/ordered_response.ts` | Validates option logic. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Normalizes rank order. |
| **Testing** | `test/ordered_ingest.test.ts` (Dynamic) | Scripts to verify logic. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `3` (Competent) or `4` (Complex Prioritization) |
| **targetScore** | `number` | `85` |
| **clientNeeds** | `string` | `"Safe and Effective Care Environment"` |
| **cjmmStep** | `string` | `"Prioritize Hypotheses"` or `"Take Action"` |
| **topic** | `string` | `"Acute MI Management"` |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Drag and Drop" mechanics.*

### The Stem (`prompt`)
**Requirement:** Explicit command on what to order.  
**Perfect Example:**  
> "Drag the nursing actions below into the correct chronological order for a client arriving with chest pain."

### The Structure (`structure.options`)
**Strict Rule:** 4-6 Options total. No "Correct/Incorrect" flags in the traditional sense; the *Order* is the key.

**JSON Structure:**
The system must know the **Correct Sequence**.
There are two ways to represent this. The standard is an ordered array of correct items, plus potential distractors (though distractors are rare in pure ordering interactions, NGN sometimes uses "Select top 4 and order them").

**Standard NGN (All items must be ordered):**
```json
"structure": {
  "options": [
    { "id": "o1", "text": "Assess airway and breathing", "rank": 1 },
    { "id": "o2", "text": "Administer Oxygen via NC", "rank": 2 },
    { "id": "o3", "text": "Obtain 12-lead ECG", "rank": 3 },
    { "id": "o4", "text": "Administer Nitroglycerin SL", "rank": 4 },
    { "id": "o5", "text": "Draw Troponin levels", "rank": 5 }
  ]
}
```

**Distractor Variation:**
If the prompt says "Select the 4 priority actions and order them", then options with `rank: 0` or missing rank are distractors.

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*Prioritization heavily depends on Patient Stability.*

### A. Vitals (The Trigger)
- **Essential:** The vitals must justify the *order*.
- **Example:** If O2 sat is 88%, "Administer Oxygen" moves to #1 or #2. If BP is 80/50, "Nitroglycerin" is *Contraindicated* (or last/held).

### B. Nurses Notes (The Context)
- **Requirement:** Must capture the *acuity* of the situation.
- **Example:** "Client is clutching chest, diaphoretic, color pale." -> Justifies "Assess Airway/Breathing" first.

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Framework for prioritization (e.g. "ABC (Airway, Breathing, Circulation) or MONA protocol"). |
| **pathophysiology** | Why late steps are less urgent (e.g. "Labs take time; ischemia is immediate"). |
| **safetyCheck** | **CRITICAL WARNING** (e.g. "Do not give Nitro if SBP < 90"). |
| **clinicalTakeaway** | The prioritized list summary (e.g. "Assess -> O2 -> ECG -> Meds"). |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Difficulty is Numeric.
3. [ ] Stem clearly asks for an *order* or *sequence*.
4. [ ] Options have explicit Ranks (1, 2, 3...).
5. [ ] Ranks are sequential (no skipped numbers).
6. [ ] Content allows for clear discrimination (no ambiguous "tie" steps).
7. [ ] Rationale justifies the sequence logic (ABC, Maslow, Stability).
