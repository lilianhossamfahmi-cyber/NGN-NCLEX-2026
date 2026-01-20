# GOLDEN ITEM SPECIFICATION: MATRIX (GRID)
## 1. UNIQUE CHARACTERISTICS
The Matrix item asks users to evaluate rows against column criteria (e.g., Indicated/Contraindicated, or Effective/Ineffective).

### ID Code
*   **Type Code**: `MTX`
*   **Example**: `GI-MTX-7721`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline explicitly looks for `rows` and `columns`.

### Grid Components
*   **Rows**: The clinical items to evaluate (e.g., "Administer Morphine").
    *   **Field**: `structure.rows` (Array)
    *   **Key Props**: `id`, `text`.
*   **Columns**: The criteria for evaluation.
    *   **Field**: `structure.columns` (Array)
    *   **Key Props**: `id`, `text` (e.g., "Indicated", "Contraindicated").

### The Answer Key (Correctness)
*   Inside each **Row** object, there must be a `correctColumnId` property matching one of the column IDs.
*   *Alternatively*, an `answers` object mapping RowID -> ColID. (Golden standard prefers embedded `correctColumnId` or explicit `isCorrect` array if multi-select).

**Golden Standard for Matrix (Multiple Response Type):**
Rows have `correctColumnArgs` if multiple columns can be selected (rare) or simple `correctColumnId`.

For NGN, usually it's "Select one option per row".
```json
"rows": [
  { "id": "r1", "text": "Assess BP", "correctColumnId": "c1" }
],
"columns": [
  { "id": "c1", "text": "Indicated" },
  { "id": "c2", "text": "Contraindicated" }
]
```

## 3. FORBIDDEN ELEMENTS
*   **NO `screens` array**.
*   **NO `actions`/`conditions`** (BowTie specific).

## 4. VALIDATION CHECKLIST
- [ ] ID includes `MTX`.
- [ ] `structure.rows` is a non-empty array.
- [ ] `structure.columns` is a non-empty array (typically 2 or 3).
- [ ] Every row has a `correctColumnId` linking to a valid column.
