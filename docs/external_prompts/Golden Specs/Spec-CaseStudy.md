# GOLDEN ITEM SPECIFICATION: CASE STUDY (6-ITEM)
## 1. UNIQUE CHARACTERISTICS
The NGN Case Study is a multi-stage item containing 6 discrete items (screens) that evolve a clinical scenario.

### ID Code
*   **Type Code**: `CS`
*   **Example**: `RESP-CS-8812`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline recognizes Case Studies primarily by the presence of the `screens` array.

### The Screens Array
*   **Field**: `structure.screens`
*   **Type**: Array of Item Objects
*   **Constraint**: Must contain exactly 6 objects.

### CJMM Alignment (Strict Order)
Each screen corresponds to a Clinical Judgment Measurement Model step:
1.  **Screen 1**: Recognize Cues (`multiple-response` or `matrix`)
2.  **Screen 2**: Analyze Cues (`multiple-response` or `matrix`)
3.  **Screen 3**: Prioritize Hypotheses (`multiple-response` or `drop-cloze`)
4.  **Screen 4**: Generate Solutions (`multiple-response` or `bow-tie` - *Note: Nested Bowtie is rare/complex*)
5.  **Screen 5**: Take Action (`multiple-response` or `highlight`)
6.  **Screen 6**: Evaluate Outcomes (`matrix` or `multiple-response`)

## 3. CLINICAL DATA EVOLUTION
Unlike standalone items, the Case Study clinical data **GROWS** across screens.
*   **Global Layout**: The `content.clinicalData` at the root represents the *initial* state.
*   **Updates**: Each screen *can* update data, but typically the root contains the full timeline revealed progressively (controlled by the UI, but JSON should contain the full set).

## 4. VALIDATION CHECKLIST
- [ ] ID includes `CS`.
- [ ] `structure.screens` exists and has length 6.
- [ ] Root `type` is `case-study`.
- [ ] Each screen has its own `type` (e.g., `matrix`, `multiple-response`).
- [ ] No single-screen specific fields (like `options` directly under `structure`) should exist at the root level; they belong inside `screens`.
