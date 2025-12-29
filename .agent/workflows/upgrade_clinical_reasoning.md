# Upgrade Plan: Ultimate Clinical Reasoning (Object Schema)

**Objective**: Transition all 10 NGN AI Prompt Templates (`.md` files) from the current "String-Based" rationale format to the comprehensive "Object-Based" schema.

**Goal**: To unlock the full potential of the `UltimateRationale.tsx` component, specifically populating the currently underutilized **Strategy** (Mnemonics, Cheat Sheets) and **Knowledge** (Anatomy, Physiology, Pharm) tabs.

---

## 1. Current State vs. Target State

| Feature | Current "String" Schema | Target "Object" Schema |
| :--- | :--- | :--- |
| **Logic** | Text string parsed via Regex | Native JSON Object |
| **Case Overview** | `[Hook]` text | `caseSummary` field |
| **Analysis** | `[Breakdown]` text | `answerAnalysis` field |
| **Traps** | `[Trap]` text | `trap` field |
| **Action Steps** | `[Steps]` text | `steps` array of objects |
| **Clinical Gems** | `[Future]` text | `goldenRule` field |
| **Mnemonics** | ❌ **Missing** | ✅ `mnemonic` { title, content, explanation } |
| **Cheat Sheets** | ❌ **Missing** | ✅ `cheatSheet` { title, points[] } |
| **Deep Knowledge** | ❌ **Missing** | ✅ `referenceInfo` { anatomy, physiology, pharm } |

---

## 2. The Target JSON Schema

We will update the "RATIONALE REQUIREMENTS" and "JSON SCHEMA" sections in **all 10 prompt files** to use this structure:

```json
"rationale": {
  "coreConcept": "Name of the Core Concept (e.g. 'Diabetic Ketoacidosis')",
  "caseSummary": "A simplified, high-level summary of the case (The 'Hook').",
  "answerAnalysis": "Detailed breakdown of why the correct answer is correct (The 'Breakdown').",
  "trap": "The specific mental trap or common error (The 'Trap').",
  "goldenRule": "A memorable one-liner or rule of thumb (The 'Future' Gem).",
  "steps": [
    { "tag": "Recognize", "description": "Step 1 description..." },
    { "tag": "Analyze", "description": "Step 2 description..." },
    { "tag": "Take Action", "description": "Step 3 description..." }
  ],
  "mnemonic": {
    "title": "Acronym Title",
    "content": "A-B-C-D",
    "explanation": "Brief explanation of the mnemonic."
  },
  "cheatSheet": {
    "title": "Clinical Cheat Sheet",
    "points": [
      "Critical Point 1",
      "Critical Point 2",
      "Critical Point 3"
    ]
  },
  "referenceInfo": {
    "anatomy": "Brief anatomical context...",
    "physiology": "Brief physiological mechanism...",
    "pharm": "Key pharmacological facts..."
  }
}
```

---

## 3. Implementation Steps

### Step 1: Update Prompt Instructions (All 10 Files)
For each file (`01_CASE_STUDY` -> `10_HOT_SPOT`), replace the **"RATIONALE REQUIREMENTS (MANDATORY SUPER-TEACHER STYLE)"** section.
*   **Remove**: The instruction to use the `"[Hook] ... [Breakdown] ..."` string format.
*   **Add**: Instructions to generate the **JSON Object** defined above.
*   **Add**: Specific instructions for the new fields (e.g., "Create a clever Mnemonic related to the topic", "List 3-5 hard facts for the Cheat Sheet").

### Step 2: Update JSON Integrity Examples
*   Update the `Complete JSON Schema Example` at the bottom of each file to reflect the new `rationale` object structure instead of the string.
*   **Crucial**: Ensure `optionReviews` (specific rationale for each choice) are still correctly handled. In the new schema, these can either live inside the `rationale` object OR remain on the options themselves.
    *   *Decision*: Keep specific option rationales on the option objects (as they are now) for item-level feedback, but use the main `rationale` object for the global "Ultimate Rationale" data.

### Step 3: Frontend Verification
*   The `RationaleDrawer.tsx` file is already programmed to handle this object structure (Logic Block 2 in the code).
*   **Action**: Once prompts are updated, generate a test question and verify that:
    1.  The **Strategy Tab** shows the Mnemonic and Cheat Sheet.
    2.  The **Knowledge Tab** shows the Anatomy/Physio/Pharm sections.
    3.  The **Clinical Logic Tab** shows the structured Steps.

---

## 4. Execution Workflow (Batch)

This workflow can be executed using the `multi_replace_file_content` tool to update multiple prompts in sequence, or one by one.

**Priority Order:**
1.  `01_CASE_STUDY.md` (Highest impact)
2.  `02_BOW_TIE.md`
3.  `03_TREND.md`
4.  (Build out remaining 7)

---

## 5. System Data Integrity & Prevention Strategy

**Why this matters**: Previous updates inadvertently removed critical data fields (like clinical details or specific option attributes) while focusing on rationale updates, causing the system to generate incomplete items.

**Action Plan to Prevent Recurrence:**

1.  **"Additive-Only" Mandate**:
    *   **Rule**: When updating a prompt file, we must explicitly state that we are *adding* new requirements, not replacing the entire file structure unless necessary.
    *   **Check**: Before finalizing any file write, verify that `clinicalData` (Patient Info, H&P, Vitals, Labs, Orders) and `structure` (Question type specific fields) remain intact.

2.  **Full-Context Preservation**:
    *   **Rule**: Never "simplify" the surrounding JSON schema in the prompt just to save space. The AI relies on the *complete* example.
    *   **Action**: When updating the `Complete JSON Schema Example` section, copy the *entire* existing example and only modify the `rationale` block. Do not truncate `clinicalData` or `options` arrays.

3.  **Schema Validation Checkpoints**:
    *   **Rule**: Every prompt update must include a "Do Not Remove" list.
    *   **List**:
        *   `patientInfo` (All 9 fields: Name, Age, Sex, MRN, etc.)
        *   `history` (The HTML Table Format)
        *   `vitals` (The Array Format)
        *   `approvedAbbreviations` (The footer section)
        *   `radiology` (The bold/monospace format)

4.  **Rollback Protection**:
    *   **Rule**: Maintain a "Golden Copy" of the last known working prompts (as done with `External Prompts Recovery`).
    *   **Action**: If an update causes "JSON Parse Failed" or "Missing Data" errors, immediately restore from `External Prompts Recovery` before attempting a fix.

5.  **Targeted "surgical" Edits**:
    *   **Rule**: Use `replace_file_content` targeting *specific blocks* (e.g., just the Rationale section) rather than rewriting the whole file whenever possible this reduces the risk of accidentally dropping lines elsewhere in the file.
