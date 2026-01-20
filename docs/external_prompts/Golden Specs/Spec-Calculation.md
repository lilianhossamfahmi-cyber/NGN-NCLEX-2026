# GOLDEN ITEM SPECIFICATION: CALCULATION
## 1. UNIQUE CHARACTERISTICS
The Calculation item requires the student to perform a clinical dosage or rate calculation and enter a numeric value.

### ID Code
*   **Type Code**: `CALC`
*   **Example**: `PHARM-CALC-A7B2`

## 2. STRUCTURAL REQUIREMENTS (`content.structure`)
The pipeline explicitly looks for `correctValue`, `units`, and `acceptableRange`.

### Core Fields
*   **Prompt**: MUST include rounding instructions (e.g., "Round to the nearest tenth").
*   **Correct Value**: Numeric.
*   **Units**: String (e.g., "mL/hr", "mcg/kg/min").
*   **Acceptable Range**: Array `[min, max]` to account for rounding variations.

## 3. RATIONALE REQUIREMENTS
*   **formulaMethod**: String representation of the formula used.
*   **dimensionalAnalysis**: Step-by-step dimensional analysis.
*   **answerAnalysis**: Must include the structured "How we got it" markdown.

## 4. VALIDATION CHECKLIST
- [ ] ID includes `CALC`.
- [ ] `structure.correctValue` is a number.
- [ ] `structure.units` matches the prompt's request.
- [ ] `formulaMethod` and `dimensionalAnalysis` are present in rationale.
- [ ] `vitals` include weight (lbs and kg).
