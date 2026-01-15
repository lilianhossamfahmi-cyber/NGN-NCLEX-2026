# Plan: Standardization of Remaining Item Types (Golden Standard V3)

## Objective
Apply the "Golden Standard" unified schema to all remaining item types to ensure consistent clinical data rendering, robust rendering logic, and "double-render" prevention system-wide.

## The "Golden Schema" (Target Structure)
All prompts will be updated to force this exact JSON structure. This ensures `DataSanitizer.ts` can automatically clean and format the data for the Viewer.

```json
{
  "type": "[item-type]",
  "content": {
    "metadata": { ... },
    "patient": { "name": "...", "age": 50, ... },
    "vitals": [ ... ],
    "orders": [ ... ], 
    "labs": [ ... ],
    "nursesNotes": [ ... ],
    "rationale": { "coreConcept": "...", "difficulty": { ... } },
    "structure": {
      "type": "[item-type]",
      "prompt": "...",
      "...type-specific-fields...": "..." 
    }
  }
}
```

## Work Packages by Item Type

### 1. Matrix Items (`Golden-NGN-Matrix-Item.md`)
*   **Current Status**: V2.5 (Good logic, but legacy data schema).
*   **Action**: Rewrite prompt to V3.
*   **Specifics**: Ensure `rows` and `columns` are strictly defined in `structure`.

### 2. Hot-Spot Items (`Golden-NGN-HotSpot-Item.md`)
*   **Current Status**: V2 (Legacy schema).
*   **Action**: Rewrite prompt to V3.
*   **Specifics**:
    *   Standardize `targetArea` (x, y, radius) in `structure`.
    *   Ensure `imageUrl` is accurately requested (or fallback to placeholder logic).

### 3. Calculation Items (`Golden-NGN-Calculation-Item.md`)
*   **Current Status**: V2 (Legacy schema).
*   **Action**: Rewrite prompt to V3.
*   **Specifics**:
    *   Move `inputLabel`, `roundingRule`, and `units` into `structure`.
    *   Standardize `rationale` to include `formulaMethod` and `dimensionalAnalysis`.

### 4. Drop-Cloze (`Golden-NGN-DropCloze-Item.md`)
*   **Current Status**: V2 (Legacy schema).
*   **Action**: Rewrite prompt to V3.
*   **Specifics**:
    *   **CRITICAL**: Force the "Text + Dropdown" format (`%{id}`) to leverage the new Renderer fix.
    *   Explicitly ban the old "sentence array" format in the prompt instructions.

### 5. Standard Response Items (Ordered, Multiple, Single)
*   **Current Status**: Legacy.
*   **Action**: Rewrite prompts to V3 side-by-side.
*   **Specifics**: Ensure they don't break simple rendering logic.

## 6. Reference & Cleanup (The "Hidden" Files)
*   **`_CLINICAL_DATA_SCHEMA.md` & `_PROMPT_STANDARDS.md`**:
    *   **Action**: Update these to be the **V3 Source of Truth** so they document the new patient/vitals structure.
*   **`Golden-Single-response` (No extension)**:
    *   **Action**: **DELETE**. This is a legacy duplicate of `Golden-NGN-SingleResponse-Item.md`.

## Logic Updates (DataSanitizer.ts)
*   **Audit**: Verify `normalizeGoldenPromptFormat` supports these specific types.
*   **HotSpot Fix**: Ensure `targetArea` coordinates are parsed as numbers (AI sometimes returns strings).
*   **Calculation Fix**: Ensure `correctAnswer` is parsed as a number for validation.

## Execution Sequence
1.  **Batch Update Prompts**: Rewrite all `.md` files in `docs/external_prompts/Golden Prompts/`.
2.  **Sanitizer Check**: Add defensive code for HotSpot/Calc types in `DataSanitizer`.
3.  **Validation**: Generate 1 of each type to verify Viewer Tabs and Rendering.
