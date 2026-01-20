# GOLDEN ITEM SPECIFICATION: ORDERED RESPONSE
## 1. UNIQUE CHARACTERISTICS
Ordered Response items require the student to place items (e.g., procedural steps) in the correct chronological or priority sequence.

### ID Code
*   **Type Code**: `ORD`
*   **Example**: `PROC-ORD-H3I4`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline looks for `orderedOptions`.

### Ordering Rules
*   **Correct Order**: The options MUST be provided in the correct delivery order in the JSON.
*   **Field**: `structure.orderedOptions` (Array of Objects).

## 3. VALIDATION CHECKLIST
- [ ] ID includes `ORD`.
- [ ] `type` is `ordered-response`.
- [ ] `orderedOptions` array is sorted by correct sequence.
- [ ] Each step has an individual `rationale` explaining why it belongs at that position in the sequence.
