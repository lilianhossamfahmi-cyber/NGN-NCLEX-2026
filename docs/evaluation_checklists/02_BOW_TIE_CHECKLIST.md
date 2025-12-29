# BOW-TIE ZERO-ERROR CHECKLIST

**Objective:** Validation for the complex Bow-Tie diagram type.

## 1. Diagram Slot Logic (1-2-2)
- [ ] **Condition (Center)**:
    -   Must have `conditions.pool`.
    -   Pool size: 4+ items.
    -   **Strictly ONE** item is marked `isCorrect: true`.
- [ ] **Actions (Left)**:
    -   Must have `actions.pool`.
    -   Pool size: 5+ items.
    -   **Strictly TWO** items are marked `isCorrect: true`.
- [ ] **Parameters (Right)**:
    -   Must have `parameters.pool`.
    -   Pool size: 5+ items.
    -   **Strictly TWO** items are marked `isCorrect: true`.

## 2. Clinical Cohesion (The "Story")
- [ ] **Scenario Alignment**:
    -   The *Condition* matches the patient's presentation in `clinicalData`.
    -   The *Actions* are standard of care for that *Condition*.
    -   The *Parameters* are valid ways to monitor that specific *Condition*.
- [ ] **Distractor Quality**: Distractors are not ridiculously obvious (e.g. "Amputate Leg" for a headache). They are plausible but incorrect.

## 3. ID & Mapping Verification
- [ ] **ID Structure**: IDs should be readable/debuggable (e.g., `act_1`, `cond_2`).
- [ ] **Pool Arrays**: Ensure `config.actions.pool` is an ARRAY of objects.
- [ ] **Text Fields**: Every item in every pool has a non-empty `text` field.

## 4. Rationale Mapping
- [ ] **Conditions**: Rationale provided for why the correct condition is the answer vs distractors.
- [ ] **Actions**: Rationale explains why these 2 actions are prioritized.
- [ ] **Parameters**: Rationale explains why these 2 parameters are the best indicators.
