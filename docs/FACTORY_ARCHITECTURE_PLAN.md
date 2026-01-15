# 🏭 NGN Factory: Item-Specific Specifications

This document defines the **Production Rules** for every NGN Item Type. Each type has a dedicated **Assembly Line** with strict constraints for schema, prompting, and difficulty scaling.

---

## 🎀 1. BowTie Item (`Golden-NGN-BowTie-Item.md`)
**Objective:** Evaluate clinical judgment by linking cues (Left), Actions (Center), and Outcomes (Right).

### 📐 Schema Requirements
*   **Structure:** Must have `center` (Condition), `actions` (2 selections), `parameters` (2 selections).
*   **Options:** 
    *   Left (Actions): 5 Options (Select 2).
    *   Right (Parameters): 5 Options (Select 2).
    *   Center: 1 Condition (Target).
*   **Validation:** Logic check: Action A + Action B must logically address Center Condition.

### � Prompt Strategy
*   **File:** `Golden-NGN-BowTie-Item.md`
*   **Action Required:** Upgrade JSON structure.
    *   Nest `nursesNotes`, `vitals` into `content: { ... }`.
    *   Ensure `actions` and `parameters` use consistent ID generation.

---

## 🧮 2. Calculation Item (`Golden-NGN-Calculation-Item.md`)
**Objective:** Verify dosage, intake/output, and titration safety.

### 📐 Schema Requirements
*   **Fields:** `correctValue` (number), `units` (string), `acceptableRange` (tuple).
*   **Clinical Data:** MUST be nested in `content` object.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** Single Step (PO Tabs) | 1 Note | No Distractors.
*   **L3:** Two Steps (mg/kg -> mL) | Vitals + Orders | Basic Distractors.
*   **L5:** **Titration/Critical Care** | Full Chart (Conflicting wts) | Distractors: Wrong conversion, wrong time base.

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-Calculation-Item.md`
*   **Status:** ✅ **DONE** (Updated Jan 4, 2026).
*   **Verify:** Ensure `correctValue` is used (not `answer`) and `content` is nested.

---

## 📜 3. Case Study (6-Step) (`Golden-NGN-Case-Study-6Q.md`)
**Objective:** The "Crown Jewel" of NGN. A unified narrative evolving over time (Time 0 -> Time 1 -> Time 2).

### 📐 Schema Requirements
*   **Structure:** Must contain EXACTLY 6 Items (Questions).
*   **Sequence:** strictly mapped to CJMM (1. Cues, 2. Hypotheses, 3. Prioritize, 4. Solutions, 5. Action, 6. Evaluate).
*   **Continuity:** All 6 items share the same `caseId` and `patient` object.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** Stable Patient | Clear progression | Options are distinct.
*   **L3:** Active Deterioration | Progression introduces 1 new complication | Options require discrimination.
*   **L5:** **Multi-System Failure** | Chaos progression (Code Blue) | Options: "Do nothing vs Do harm vs Do good".

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-Case-Study-6Q.md`
*   **Action Required:** Major Refactor.
    *   Need to wrap the *entire sequence* in a cohesive JSON or an Array of 6 Items.
    *   Currently, it might generate 6 separate blocks. Schema must handle "Case Container".

---

## 🔤 4. Drop Cloze (`Golden-NGN-DropCloze-Item.md`)
**Objective:** Assess knowledge by filling in critical keywords in sentences/tables.

### 📐 Schema Requirements
*   **Structure:** `sentences` array. Each sentence has a `template` (with `%BLANK%`) and `dropdowns`.
*   **Constraint:** Max 2 blanks per sentence to prevent UI overflow.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** 1 Sentence | 1 Blank | Options: 2 distinct choices.
*   **L3:** Paragraph | 2 Blanks | Options: 3 choices (1 distractor).
*   **L5:** **Complex Protocol** | 3 Linked Blanks (If X, then Y, because Z) | Options: Subtle nuance.

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-DropCloze-Item.md`
*   **Action Required:** Upgrade JSON structure.
    *   Normalize `text` vs `sentences` field. Strict Schema prefers `sentences`.

---

## 🖍️ 5. Highlight Item (`Golden-NGN-Highlight-Item.md`)
**Objective:** Identify relevant vs irrelevant/dangerous information in text (Notes, Labs).

### 📐 Schema Requirements
*   **Structure:** `text` (String) + `tokens` (Array of selectable words/phrases).
*   **Validation:** Tokens must perfectly match substrings in the text.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** Highlight "Abnormal Vitals" (Numbers only).
*   **L3:** Highlight "Symptoms of X" (Phrases).
*   **L5:** **"Findings requiring immediate intervention"** (Cognitive judgment needed).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-Highlight-Item.md`
*   **Action Required:** Validation Upgrade.
    *   Prompt must ensure `tokens` are exact substrings of `text`. Hallucination risk is high here.

---

## 🎯 6. HotSpot Item (`Golden-NGN-HotSpot-Item.md`)
**Objective:** Spatial identification (Anatomy, Equipment, Charts).

### 📐 Schema Requirements
*   **Structure:** `imageUrl` (string) + `areas` (coordinates).
*   **Accessibility:** Must have alt-text for screen readers describing location.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** "Click the Heart" (Gross Anatomy).
*   **L3:** "Click the Mitral Valve" (Specific Anatomy).
*   **L5:** **"Click the ECG Point showing Ischemia"** (Clinical Interpretation).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-HotSpot-Item.md`
*   **Action Required:** Media Strategy.
    *   Prompt currently generates finding *descriptions*. We need a factory step to Map "Description" -> "Real Image URL".

---

## ▦ 7. Matrix Item (`Golden-NGN-Matrix-Item.md`)
**Objective:** Compare/Contrast multiple items against a set of criteria.

### 📐 Schema Requirements
*   **Structure:** `rows` (Items), `columns` (Criteria e.g., "Indicated", "Contraindicated").
*   **Logic:** `inputType`: 'radio' (1 per row) or 'checkbox' (Multi per row).

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** 3 Rows | 2 Cols (True/False) | Clear assertions.
*   **L3:** 4 Rows | 3 Cols (Increase/Decrease/No Change) | Physiological trends.
*   **L5:** **5 Rows | 3 Cols (Risk/Safety/Priority)** | Subtle drug interactions.

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-Matrix-Item.md`
*   **Action Required:** Standardize `inputType`.
    *   Explicitly tell AI to output `inputType: "radio"` or `"checkbox"`.

---

## ☑️ 8. Multiple Response (SATA) (`Golden-NGN-MultipleResponse-Item.md`)
**Objective:** Select all correct options (N/N scoring).

### 📐 Schema Requirements
*   **Structure:** 5-7 Options.
*   **Validation:** Minimum 1 correct, Maximum (N-1) correct. NEVER all correct.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** 5 Options | 1-2 Correct | "Symptoms of flu".
*   **L3:** 6 Options | 3 Correct | "Side effects of Beta Blockers".
*   **L5:** **7 Options** | 4-5 Correct | "Interventions for Sepsis Bundle" (Strict protocol).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-MultipleResponse-Item.md`
*   **Action Required:** Distractor Logic.
    *   Reinforce "At least 1 incorrect" rule in prompt instructions.

---

## 🔢 9. Ordered Response (`Golden-NGN-OrderedResponse-Item.md`)
**Objective:** Sequence steps of a procedure/process.

### 📐 Schema Requirements
*   **Structure:** 4-6 Options.
*   **Logic:** Order matters strictly.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** 4 Steps | Hand Hygiene.
*   **L3:** 5 Steps | Foley Catheter Insertion (Sterile field logic).
*   **L5:** **6 Steps** | Tracheostomy Care / Code Blue Algorithm (Life safety order).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-OrderedResponse-Item.md`
*   **Action Required:** None (Logic is simple). Verify JSON nesting.

---

## 🔘 10. Single Response (`Golden-NGN-SingleResponse-Item.md`)
**Objective:** The classic MCQ. Best answer.

### 📐 Schema Requirements
*   **Structure:** 4 Options.
*   **Logic:** 1 Correct. 3 Distractors.

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** Definition / Recall.
*   **L3:** Application (What implies X?).
*   **L5:** **Synthesis** (Given X, Y, Z -> What is the PRIORITY action?).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-SingleResponse-Item.md`
*   **Action Required:** Distractor Analysis.
    *   Prompt must demand "Plausible Distractors" (no silly answers).

---

## 📈 11. Trend Item (`Golden-NGN-Trend-Item.md`)
**Objective:** Analyze data evolution over time (EHR View).

### 📐 Schema Requirements
*   **Structure:** `timePoints` (Array of times), `parameters` (Rows of data).
*   **Output:** The question asks about the *trend* (Improving/Worsening).

### 📊 Difficulty Matrix (L1-L5)
*   **L1:** 2 Time Points | Obvious change (BP 120 -> 80).
*   **L3:** 3 Time Points | Mixed Signals (BP down, HR up).
*   **L5:** **4 Time Points** | Subtle compensation vs decompensation (Shock stages).

### 📄 Prompt Strategy
*   **File:** `Golden-NGN-Trend-Item.md`
*   **Action Required:** Data Consistency.
    *   Prompt must ensure numerical values are physiologically possible (Bio-check).


---

## 🔒 12. Critical Risk Mitigation (The "Owner's Insurance")

These mechanisms prevent invisible failures (Bad Math, Missing Images, Duplicates).

### 🛡️ A. The "Math Guard" (Auto-Solver)
*   **Problem:** AI generates valid JSON but wrong math (e.g., `10kg * 5mg = 60mg`). Zod passes this (it's a number).
*   **Solution:** The Factory UI for Calculation items runs a **Real JavaScript Verification**.
    *   It extracts variables from the prompt.
    *   It runs the formula.
    *   **Action:** If `Code_Result !== AI_Result`, the "Approve" button is DISABLED until fixed.

### 🖼️ B. The Media Pipeline (HotSpot/Highlight)
*   **Problem:** AI hallucinates file paths (`image_of_leg.jpg`) that don't exist.
*   **Solution:** **"Media Lock"**.
    *   HotSpot/Highlight Items CANNOT be Auto-Approved.
    *   The Factory UI shows a "Broken Image" placeholder.
    *   Admin MUST select a valid asset from the Media Library to enable the "Approve" button.

### 👯 C. Duplicate Detection (Cost Control)
*   **Problem:** AI repeats scenarios (e.g., "7yo Asthma" appears 50 times).
*   **Solution:** **Semantic Fingerprinting**.
---

## 📏 13. Content Quality Standards (SOP)

The Factory will enforce these micro-constraints during Validation.

### A. Text Constraints
*   **Question Stem:** 20 - 80 words. Active Voice ("The nurse observes..." not "Observation is made...").
*   **Options:** Homogeneous length (Short vs Short, Long vs Long). No "All of the above".
*   **Rationales:**
    *   **Total Length:** Max 150 words.
    *   **Structure:** Must answer "Why Right", "Why Wrong", and "Key Takeaway".

### B. Clinical Data Completeness
*   **Laboratory:** Must include explicit Reference Ranges (e.g., `Na+ 145 (135-145)`). 
    *   *Why?* NGN does not require memorization of all ranges; providing them reduces cognitive noise.
*   **Vital Signs:** Must be a Complete Set (T, P, RR, BP, O2) unless specific focus dictates otherwise.
    *   *Reject:* "BP 120/80" (Lazy generation).
    *   *Accept:* "T 37.0, P 88, RR 18, BP 120/80, O2 98%" (Realistic).
*   **Nurses Notes:**
    *   **Format:** `[Time] [Event/Observation] [Action] [Response]`.
    *   **Style:** Professional, objective tone. No "Review of systems" lists.

### C. Visual / Layout
*   **Mobile First:** All tables (Matrix, Trend) must render within 320px width without breaking.
*   **Contrast:** Highlight colors must pass WCAG AA standards.
