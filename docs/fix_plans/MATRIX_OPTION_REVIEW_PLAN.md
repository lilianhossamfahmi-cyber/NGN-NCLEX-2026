# 📋 MATRIX OPTION REVIEW IMPLEMENTATION PLAN

## 🎯 OBJECTIVE
Implement a detailed "Option Review" for Matrix item types that provides visual feedback (Green/Red) and specific rationales for each row's classification.

## 🚧 CURRENT STATE
- **Feedback:** Generic "Correctly identified" / "Incorrect classification" message.
- **Visuals:** Likely basic text or simple list (need to verify).
- **Data:** Missing specific rationales for *why* a row belongs to a column in the Golden Prompt.
- **Scoring:** `calculateMatrixScore` exists but needs verification of alignment with detailed feedback.

## 🛠️ IMPLEMENTATION STEPS

### 1. 📝 GOLDEN PROMPT UPDATE (`Golden-NGN-Matrix-Item.md`)
- **Add Row Rationales:** Update the JSON structure to require a `rationale` field for every row.
  ```json
  "rows": [
    { 
      "id": "r1", 
      "text": "Finding 1", 
      "correctColumnId": "c1", 
      "rationale": "Finding 1 describes X which is a hallmark of Condition A." 
    }
  ]
  ```
- **Add Clinical Data Constraint:** Enforce "Nurse's Notes (Difficulty Based)" rule for Level 4/5 consistency.

### 2. 🧠 PIPELINE UPDATE (`RationalePipeline.ts`)
- **Type Definitions:** Ensure `MatrixRowReview` (or similar) in `RationaleTypes.ts` supports `rationale`.
- **Logic:** Update `generateRationale` to extract the new `rationale` field from the config's rows.
  ```typescript
  matrixRows = score.breakdown?.rows?.map((row) => ({
      // ...
      rationale: configRow?.rationale || (row.correct ? 'Correct.' : 'Incorrect.')
  }));
  ```

### 3. 🎨 COMPONENT CREATION (`src/components/feedback/MatrixFeedback.tsx`)
- **Design:** recreate the matrix table.
- **Interactivity:**
  - **Read-Only Mode:** Locked inputs.
  - **Visual Cues:**
    - **Correct Cell:** Green background/border + Checkmark.
    - **Incorrect User Selection:** Red background/border + X.
    - **Missed Correct Selection:** Green border/outline (to show what *should* have been picked).
  - **Expandable Rows:** Clicking a row (or an "Explain" button) reveals the specific rationale.

### 4. 🔗 INTEGRATION (`UltimateRationale.tsx`)
- Import `MatrixFeedback`.
- Pass `matrixRows` (and column headers) to it.
- Render in the "Option Review" tab when `itemType === 'matrix'`.

## ✅ SUCCESS CRITERIA
- [ ] Golden Prompt generates `rationale` per row.
- [ ] Matrix feedback shows the table structure.
- [ ] Correct/Incorrect cells are clearly marked.
- [ ] Detailed rationale explains the classification for each row.
- [ ] Level 5 items have richer Nurse's Notes.
