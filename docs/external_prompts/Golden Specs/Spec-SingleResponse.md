# GOLDEN ITEM SPECIFICATION: SINGLE RESPONSE
## 1. UNIQUE CHARACTERISTICS
The classic Multiple Choice Question (MCQ) with only one correct answer.

### ID Code
*   **Type Code**: `MCQ`
*   **Example**: `GI-MCQ-K5L6`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline looks for an `options` array where exactly one item is correct.

## 3. VALIDATION CHECKLIST
- [ ] ID includes `MCQ`.
- [ ] `type` is `single-response`.
- [ ] Exactly 1 option is marked `isCorrect: true`.
- [ ] Each option (including distractors) has an individual `rationale`.
