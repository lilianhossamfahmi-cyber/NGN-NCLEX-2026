# GOLDEN ITEM SPECIFICATION: BOW-TIE
## 1. UNIQUE CHARACTERISTICS
The Bow-Tie item is a "Standalone" NGN item type that requires a specific 3-column interaction.

### ID Code
*   **Type Code**: `BOW`
*   **Example**: `NEURO-BOW-4421`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline explicitly looks for `actions`, `conditions`, and `parameters`.

### The Pools (Arrays)
1.  **Actions (Left)**:
    *   **Count**: 5 Items
    *   **Correct**: 2 Items
    *   **Field**: `structure.actions` (Array of Objects)
2.  **Condition (Center)**:
    *   **Count**: 4 Items
    *   **Correct**: 1 Item
    *   **Field**: `structure.conditions` (Array of Objects)
3.  **Parameters (Right)**:
    *   **Count**: 5 Items
    *   **Correct**: 2 Items
    *   **Field**: `structure.parameters` (Array of Objects)

### Option Object Schema
Each option in the pools MUST look like this:
```json
{
  "id": "u1",          // Unique ID
  "text": "Monitor BP", // Display Text
  "isCorrect": true     // Boolean
}
```

## 3. FORBIDDEN ELEMENTS
*   **NO `screens` array**: Bow-Ties are single-screen items. Usage of `screens` will trigger Case Study rendering logic.
*   **NO `rows`/`columns`**: This triggers Matrix rendering logic.

## 4. CLINICAL DATA PROFILE
*   **Complexity**: High. Needs rich H&P and Trends.
*   **Vitals**: Minimum 2 sets to show trend.
*   **Notes**: Minimum 2 entries.

## 5. VALIDATION CHECKLIST
- [ ] ID includes `BOW`.
- [ ] `structure` contains exactly `actions`, `conditions`, `parameters`.
- [ ] Total Options = 14 (5 + 4 + 5).
- [ ] Correct Counts = 5 (2 + 1 + 2).
- [ ] No `screens` property exists.
