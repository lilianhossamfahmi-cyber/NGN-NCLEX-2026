# GOLDEN ITEM SPECIFICATION: MULTIPLE RESPONSE (SATA)
## 1. UNIQUE CHARACTERISTICS
Select All That Apply (SATA) items require selecting multiple correct options from a list.

### ID Code
*   **Type Code**: `SATA`
*   **Example**: `CARDIO-SATA-F1G2`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline looks for an `options` array where multiple items can have `isCorrect: true`.

### Option Rules
*   **Count**: Typically 5-7 options.
*   **Correct Count**: Minimum 1, but NGN standard is usually 2 to N-1.
*   **Field**: `structure.options` (Array of Objects).

## 3. VALIDATION CHECKLIST
- [ ] ID includes `SATA`.
- [ ] `type` is `multiple-response`.
- [ ] At least 2 options are marked `isCorrect: true`.
- [ ] Each option has an individual `rationale`.
