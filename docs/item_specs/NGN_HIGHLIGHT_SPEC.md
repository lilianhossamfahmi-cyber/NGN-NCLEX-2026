# NGN HIGHLIGHT: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated, clinically valid NGN Highlight item. This item type is primarily used for **"Recognizing Cues"** (CJMM Step 1).

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/highlight.ts` | Validates text and token structure. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Tokenization & index mapping. |
| **Testing** | `test/highlight_ingest.test.ts` (Dynamic) | Scripts to verify token alignment. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `2` (Novice) or `4` (Complex Cue Recognition) |
| **targetScore** | `number` | `80` |
| **clientNeeds** | `string` | `"Physiological Integrity"` |
| **cjmmStep** | `string` | `"Recognize Cues"` |
| **topic** | `string` | `"Fluid Overload Assessment"` |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Text Selection" mechanics.*

### The Stem (`prompt`)
**Requirement:** Clear directive on *what* to select (e.g., "urgent findings", "risk factors", "areas of concern").  
**Perfect Example:**  
> "Highlight the findings in the nurses' note below that require immediate follow-up by the provider."

### The Highlightable Text (`content.text` or `structure.text`)
**Strict Rule:** Must be a coherent clinical narrative.
- **Narrative:** Typically a Nurses Note, HPI, or Lab Report summary.
- **Length:** 4-8 sentences (Tokens).
- **Tokenization:** The system splits sentences. The AI MUST know which sentences are the "Keys".

### Correction Map (`structure.correctIds`)
**Strict Rule:** Indices must align with the sentences.
- The AI typically generates a `lines` array or we tokenize the paragraph.
- **Spec:** The JSON should ideally provide `sentences` array where each object has `text` and `isCorrect`.

**Ideal JSON Structure (Pre-Tokenized):**
```json
"structure": {
  "tokens": [
    { "id": "t1", "text": "Client reports 'crushing' chest pain (8/10).", "isCorrect": true },
    { "id": "t2", "text": "BP is 150/90.", "isCorrect": true },
    { "id": "t3", "text": "Client requested a glass of water.", "isCorrect": false },
    { "id": "t4", "text": "Family member is at bedside.", "isCorrect": false }
  ]
}
```

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*Context is king. Even for a highlight item, the surrounding chart matters.*

### A. The "Source" Document
- If highlighting a **Nurses Note**, that note should also appear in the `nursesNotes` array for consistency.
- If highlighting **History**, the `historyPhysical` object must match the text.

### B. Vitals
- Required if the highlight text mentions "Vital signs are stable/unstable".
- **Rule:** The rendered Vitals tab must confirm the highlights (e.g. if text says "Hypertensive", vitals tab must show "BP 160/100").

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Overview of the clinical presentation. |
| **pathophysiology** | Why the highlighted findings are significant (e.g. "Chest pain indicates ischemia"). |
| **safetyCheck** | **CRITICAL WARNING** regarding *missed* cues (e.g. "Failure to recognize S3 gallop delays HF treatment"). |
| **clinicalTakeaway** | "Distinguish urgent data from normal findings." |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Prompt specifies criteria (e.g., "Click the findings that indicate...").
3. [ ] Narrative text is medically accurate.
4. [ ] Correct tokens are clearly identified (via `isCorrect` flags or index list).
5. [ ] Distractors are plausible but non-urgent/normal (not just random garbage).
6. [ ] Rationale explains *why* the findings are significant.
