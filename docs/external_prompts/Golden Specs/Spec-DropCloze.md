# GOLDEN ITEM SPECIFICATION: DROP-CLOZE (CLOZE)
## 1. UNIQUE CHARACTERISTICS
The Drop-Cloze item features text with embedded dropdown menus for choosing the correct clinical terms or interventions.

### ID Code
*   **Type Code**: `CLZ`
*   **Example**: `NEURO-CLZ-D4E5`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline looks for `text` with placeholders and a `dropdowns` array.

### Placeholders & Dropdowns
*   **Text**: Uses `%{d1}`, `%{d2}` syntax.
*   **Dropdowns Array**: List of objects with `id` (matching placeholders) and `options`.
*   **Blank Map**: A `blankMap` object mapping each dropdown ID to its correctness rationale.

## 3. FORBIDDEN ELEMENTS
*   **NO legacy `sentences` array**. This is deprecated in favor of the single `text` block with placeholders.

## 4. VALIDATION CHECKLIST
- [ ] ID includes `CLZ`.
- [ ] `structure.text` contains placeholders like `%{d1}`.
- [ ] `structure.dropdowns` length matches the number of placeholders.
- [ ] `structure.blankMap` provides rationales for every option in every dropdown.
