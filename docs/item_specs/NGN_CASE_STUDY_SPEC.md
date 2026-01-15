# NGN CASE STUDY: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Case Study. Unlike standalone items, the Case Study is a **Scenario Wrapper** containing 6 sequential items that evolve over time.

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Case-Study-6Q.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/casestudy.ts` | Validates the wrapper & 6 items. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | splits items, normalizes shared content. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Applies to the Wrapper.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `5` (Expert) |
| **targetScore** | `number` | `90` (Avg of all 6 items) |
| **topic** | `string` | `"Septic Shock Evolution"` |

---

## 3. 📄 THE SCENARIO EVOLUTION (THE "STORY")
*The scenario must change between screens.*

### Screen 1-2 (Recognize/Analyze)
- **Time:** 0800 (Admission)
- **State:** Baseline.
- **Data:** Initial Vitals, Initial Note.
- **Items:** Highlight / Matrix / SATA.

### Screen 3-4 (Prioritize/Generate)
- **Time:** 0830 (Deterioration)
- **State:** Patient gets worse or requires decision.
- **Data:** **NEW** Vitals (Trend), **NEW** Note (Update).
- **Items:** Ordered Response / **Bow-Tie**.

### Screen 5-6 (Action/Evaluate)
- **Time:** 0900 (Intervention & Outcome)
- **State:** Post-Intervention.
- **Data:** Outcome Vitals, Procedure Note.
- **Items:** Drop-Down Cloze / SATA.

---

## 4. 🏥 SHARED CLINICAL DATA (100% DEPTH)
*The Case Study shares a "Content" object, but it evolves.*

### Concept: "Phase-based Content"
The JSON structure usually has a single `content` object. However, logically, the content "reveals" new data.
**Perfect Generation:**
The `content` object contains the **FINAL** state (all 3 notes, all 3 vital sets).
The UI/Engine is responsible for "hiding" future notes based on the current Screen Index (if implemented), OR the prompt generates the *cumulative* content.

For the **Generator Output**:
It generally outputs **ONE** massive JSON array with 6 objects.
EACH Object has its OWN `content`.
*   Object 1 Content: Note 1.
*   Object 2 Content: Note 1.
*   Object 3 Content: Note 1 + Note 2.
*   ...
*   Object 6 Content: Note 1 + Note 2 + Note 3.

**This is the Platinum Standard for Evolution.**

---

## 5. 🎯 ITEM SEQUENCE (STRICT CJMM)
1.  **Recognize Cues:** Highlight or SATA.
2.  **Analyze Cues:** Matrix or Drag-Drop.
3.  **Prioritize Hypotheses:** Ordered Response.
4.  **Generate Solutions:** **Bow-Tie** (The Anchor).
5.  **Take Action:** Drop-Down Cloze.
6.  **Evaluate Outcomes:** Matrix or SATA.

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON is an **Array** of 6 Item Objects.
2. [ ] Order follows CJMM 1->6 exactly.
3. [ ] Patient Name/Demographics are consistent across all 6.
4. [ ] Clinical Data **accumulates** (Screen 6 has more data than Screen 1).
5. [ ] Screen 4 is a valid Bow-Tie (matches Bow-Tie Spec).
6. [ ] Difficulty Level is consistent (or progressively harder).
