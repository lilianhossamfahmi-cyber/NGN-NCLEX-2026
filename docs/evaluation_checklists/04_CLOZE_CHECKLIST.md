# CLOZE (DROP-DOWN) ZERO-ERROR CHECKLIST

**Objective:** Validate Paragraph/Sentence Completion items.

## 1. Sentence Flow & Grammar
- [ ] **Readability**: The sentence MUST read fluently when the correct options are inserted. "The client is at risk for *Hypoglycemia* as evidenced by *tremors*."
- [ ] **Placeholder Formatting**: Placeholders are formatted correctly (e.g., `[[1]]`, `[[2]]` or `{0}`, `{1}`) matching the UI schema.
- [ ] **Context**: The paragraph provides enough context to actually answer the question without guessing.

## 2. Drop-Down Logic
- [ ] **Count Match**: The number of blanks in the text equals the number of dropdown objects in the JSON.
- [ ] **Option Count**: Each dropdown has 3-5 options.
- [ ] **Distractor Quality**: Distractors are grammatical matches (e.g., all nouns, or all verbs) so the answer isn't given away by grammar alone.

## 3. Answer Key Integrity
- [ ] **One Correct per Blank**: Each dropdown list has exactly one option marked `isCorrect: true`.
- [ ] **Rationale**: A specific rationale exists for WHY that word fits that specific blank.
