# MATRIX ZERO-ERROR CHECKLIST

**Objective:** Validate Grid/Table items.

## 1. Grid Dimensions
- [ ] **Data Count**: Rows x Columns check.
    -   Rows: 4-8 items.
    -   Cols: 2-3 categories.
- [ ] **Header Clarity**: Column headers (e.g., "Indicated", "Contraindicated") are clear and mutually exclusive.

## 2. Row Logic
- [ ] **Independence**: The answer for Row 1 does not depend on the answer for Row 2.
- [ ] **Ambiguity check**: A row content like "Give Insulin" should not be ambiguous if the columns are "Harmless" vs "Indicated". (Insulin is never "Harmless" if not indicated).

## 3. Answer Key Format (Critical)
- [ ] **Structure**: Check if the schema requires:
    -   `rows[i].correctColumnId` (Single Choice Matrix)
    -   OR `rows[i].correctColumnIds` (Multiple Response Matrix)
- [ ] **Validity**: The ID in `correctColumnId` matches distinct column IDs defined in `columns`.

## 4. Scoring Rule
- [ ] **+/- Scoring**: If the item implies +/- scoring (Multiple Response Matrix), verified that this is intended. Standard NGN matrix is often 0/1 per row.
