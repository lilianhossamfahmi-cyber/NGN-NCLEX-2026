# HIGHLIGHT ZERO-ERROR CHECKLIST

**Objective:** Validate Text Highlighting items.

## 1. Tokenization Integrity
- [ ] **Granularity**: The text is broken into logical chunks (sentences or meaningful phrases), NOT single words unless intentional.
- [ ] **Reconstruction**: `tokens.map(t => t.text).join(' ')` reproduces the original readable paragraph (check for missing spaces).
- [ ] **Data Source**: The text provided in `tokens` matches the clinical scenario.

## 2. Selection Logic
- [ ] **Correct Count**: At least 1 (usually 3-6) tokens are marked `isCorrect: true`.
- [ ] **Distractor/Error Count**: At least 3-6 tokens are marked `isCorrect: false` but are selectable.
- [ ] **Non-Selectable Text**: (Optional) Some filler text might not be interactable. Check `isSelectable` flag if schema uses it.

## 3. Scoring Alignment
- [ ] **+/– Rule compliance**: Highlighting assumes a +/– scoring model. Ensure distractors are truly incorrect/irrelevant so users aren't penalized for ambiguity.
