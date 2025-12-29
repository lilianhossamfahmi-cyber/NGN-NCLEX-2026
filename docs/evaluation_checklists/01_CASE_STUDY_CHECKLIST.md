# CASE STUDY (NGN) ZERO-ERROR CHECKLIST

**Objective:** Validate a 6-Screen unfolding case study for perfect logic and continuity.

## 1. 6-Screen Architecture (The "Story Arc")
- [ ] **Screen Count**: Exactly 6 items in the `screens` array.
- [ ] **CJMM Sequence Conformity**:
    -   **Screen 1 (Recognize)**: Data gathering. Format: Highlight, Multiple Response, or Matrix (Findings).
    -   **Screen 2 (Analyze)**: Connecting data. Format: Drag-Drop, Drop-Down, or Matrix (Meaning).
    -   **Screen 3 (Prioritize)**: Immediate concern. Format: Ordered Response vs "What to do first".
    -   **Screen 4 (Generate)**: Planning care. Format: Matrix (Interventions) or SATA.
    -   **Screen 5 (Action)**: Doing. Format: Matrix, SATA, or Drop-Down.
    -   **Screen 6 (Evaluate)**: Outcome. Format: Matrix (Improved/Worsened).
- [ ] **No Repetitive Formats**: Does NOT use the same item type (e.g., Matrix) more than 3 times in the entire case.

## 2. Progressive Disclosure Logic (Time Travel Check)
- [ ] **Timeline Integrity**:
    -   Screen 1: Baseline (Time 0).
    -   Screen 2/3: +30 mins to 1 hour.
    -   Screen 4/5: +Hours (Orders/Interventions done).
    -   Screen 6: +End of Shift/Discharge.
- [ ] **Data Persistence**: Information given in Screen 1 (e.g., Allergies) is NOT contradicted in Screen 5.
- [ ] **New Info Handling**: `delta` fields are used correctly.
    -   *Pass*: Screen 2 adds a Lab Result via `deltaLabs`.
    -   *Pass*: Screen 4 adds Orders via `deltaOrders`.
    -   *Fail*: Screen 3 suddenly changes the patient's age or primary diagnosis without explanation.

## 3. Answer Key Precision
- [ ] **Screen 1 isCorrect**: Validated. (e.g., Highlights actually match key findings).
- [ ] **Screen 2 isCorrect**: Validated.
- [ ] **Screen 3 isCorrect**: Validated.
- [ ] **Screen 4 isCorrect**: Validated.
- [ ] **Screen 5 isCorrect**: Validated.
- [ ] **Screen 6 isCorrect**: Validated. (Must show clear outcomes - Improved/Worsened/Unchanged).

## 4. Coding & ID Integrity
- [ ] **ID Uniqueness**: Each screen has a unique `id`.
- [ ] **Option IDs**: Within each screen, every option/row/token has a unique ID.
- [ ] **Correct Reference**: The answer key logic (e.g., `rows[i].correctColumnId`) points to an ID that *actually exists* in the columns array.
