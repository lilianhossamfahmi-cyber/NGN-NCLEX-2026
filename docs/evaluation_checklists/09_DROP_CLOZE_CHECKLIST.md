# DRAG-AND-DROP CLOZE ZERO-ERROR CHECKLIST

**Objective:** Validate Text Drag-and-Drop items.

## 1. Placeholder Integrity
- [ ] **Syntax Match**: The placeholder format in the definition (`sentences`) matches the text body (e.g., `%id%` vs `[[id]]`).
- [ ] **Count**: Number of blanks = Number of targets.

## 2. Token Pool
- [ ] **Size**: Pool size >= Correct Answers + 2 Distractors.
- [ ] **Typo Check**: The text in `correctOptionText` is byte-for-byte identical to the text in `tokens`. (e.g. "Hypokalemia" != "hypokalemia").

## 3. Cognitive Load
- [ ] **Token Length**: Tokens are 1-3 words max. Long sentences are bad UX for drag-and-drop.
- [ ] **Category**: Did we ask to drag "Medicines" into "Symptoms" slots? Ensure category match.
