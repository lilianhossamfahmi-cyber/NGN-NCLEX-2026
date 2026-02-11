# Pipeline Integrity Audit Report & Remediation Plan

## 1. Audit Findings: Schema Drift & Discrepancies

### 1.1 Rationale Object Mismatch
*   **Prompt Requirement (v3/v4):** Requires a rich JSON object with `coreConcept`, `caseSummary`, `answerAnalysis`, `trap`, `goldenRule`, `steps[]`, `mnemonic`, `cheatSheet`, `referenceInfo`, and `difficulty`.
*   **Zod Schema (`src/schemas/shared.ts`):** Only defines `general`, `pathophysiology`, `safetyCheck`, `clinicalTakeaway`, and `mnemonic`.
*   **Impact:** AI-generated "Golden" rationales contain high-value data that is NOT being validated or enforced. This leads to inconsistent data quality and potential stripping of fields in strict environments.

### 1.2 Matrix Pluralization Friction
*   **Prompt Template:** Asks for `correctColumnId` (singular).
*   **Schema:** Expects `correctColumnIds` (plural).
*   **Impact:** Constant reliance on `MatrixValidator` to "fix" the AI output.

### 1.3 Drop-Cloze "Objectification" Issue
*   **Prompt Template:** Provides flat string arrays for options (for the AI's convenience).
*   **Schema:** Requires objects `{ id, text, isCorrect }`.
*   **Impact:** Friction during ingestion; risk of losing `isCorrect` status if normalization fails.

## 2. Service Audit: `AutoFillService`

*   **Status:** **DISCONNECTED**.
*   **Finding:** The service exists in `src/services/ingestion/AutoFillService.ts` but is not imported or used by any other service (verified via grep).
*   **Impact:** Missing fields in AI-generated items are NOT being contextually filled as intended. The pipeline relies on a generic `magicFixItem` instead of the specialized `AutoFillService` logic.

## 3. Data Flow & Rendering Audit

*   **Rationale Rendering:** `UltimateRationale.tsx` is well-implemented but bypassed by `ItemRenderer.tsx`'s internal `RationaleDisplay`.
*   **Case Study EHR:** The EHR view in `CaseStudyRenderer.tsx` is functional but could benefit from stricter mapping to the `NoteSchema` and `VitalSignSchema` to prevent "Property not found" errors.

---

## 4. Remediation Plan (Execution Steps)

### Phase 1: Schema Harmonization
1.  **Update `StructuredRationaleSchema`:** Add all Golden fields from `promptTemplates.ts`.
2.  **Standardize Matrix Pluralization:** Update prompts to request `correctColumnIds` (plural) directly, reducing pipeline overhead.
3.  **Sync Drop-Cloze:** Decide on a canonical format (objects preferred) and align prompt + schema.

### Phase 2: Pipeline Integration
1.  **Hook `AutoFillService`:** Integrate into `UnifiedDataPipeline.ts` or `ItemIngestionService.ts`.
2.  **Refine `validatorService`:** Regenerate the AJV schema after Zod changes to ensure production-grade validation of Golden content.

### Phase 3: Rendering Consolidation
1.  **Unified Rationale:** Ensure `UltimateRationale.tsx` is the single source of truth for rendering clinical reasoning.
2.  **EHR Hardening:** Update EHR components to use the normalized data from `UnifiedDataPipeline`.

---

## 5. Metadata Updates (Targeting zero data loss)
*   Ensure `sourceReferences` and `repairNotes` are consistently populated in `MetadataSchema`.
