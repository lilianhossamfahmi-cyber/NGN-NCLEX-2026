# GOLDEN ITEM SPECIFICATION: HIGHLIGHT
## 1. UNIQUE CHARACTERISTICS
The Highlight item requires the user to interact directly with a text block, correctly identifying key phrases.

### ID Code
*   **Type Code**: `HLT`
*   **Example**: `PSYCH-HLT-5511`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline looks for `text` (containing spans) or `rationales` map.

### The Highlight Text
*   **Field**: `structure.text`
*   **Format**: HTML string with specific tokens or spans?
*   **Golden Standard**: Use plain text with an accompanying `tokens` array OR usage of `<b>` tags to denote selectable areas if the parser supports it.
*   **Current Pipeline Expectation**: 
    *   `structure.text`: "Client reports <span>abdominal pain</span> and..."
    *   `structure.rationales`: Object mapping token/span indices to explanations.
    *   `structure.correct`: Array of indices/IDs that are correct.

**Legacy/Simple format:**
```json
"text": "The nurse notes {shortness of breath} and {pitting edema}.",
"correct": ["shortness of breath", "pitting edema"]
```

**Recommended Golden Format (Robust):**
```json
"text": "The nurse notes shortness of breath and pitting edema.",
"selectablePhrases": ["shortness of breath", "pitting edema"],
"correctPhrases": ["shortness of breath"] // Only one might be the specific answer
```
*Wait, let's verify `UnifiedDataPipeline` line 292: `s.text?.includes('<span') || s.rationales`.*
So it expects HTML `<span>` tags.

### Golden Rule for AI Generation
*   **Instruction**: "Generate the text with `<span>` tags surrounding the selectable phrases. Assign each span an `id` attribute."

**Example:**
```json
"text": "The patient exhibits <span id='s1'>tachycardia</span> and <span id='s2'>dry skin</span>.",
"correct": ["s1"],
"rationales": { "s1": "Indicates dehydration...", "s2": "..." }
```

## 3. VALIDATION CHECKLIST
- [ ] ID includes `HLT`.
- [ ] `structure.text` contains `<span>` tags.
- [ ] `structure.correct` is an array of IDs matching the spans.
