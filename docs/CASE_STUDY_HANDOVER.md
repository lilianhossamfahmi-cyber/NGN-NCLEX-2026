# NGN Case Study System: Developer Handover

## 1. Executive Summary
This document provides context for the stabilization of the NGN Case Study item type. The system transitioned from a "Fragile 3-Layer AI Generation" model to a "Robust 4-Pass Schema-Driven" model to resolve chronic issues with JSON truncation, missing screens, and inconsistent clinical data.

## 2. The Legacy Issues (The "Why")
Before stabilization, the system suffered from:
- **JSON Truncation**: A single large AI call would often cut off mid-JSON, losing screens 4-6.
- **Data Drift**: "Progress Notes" in Screen 1 would contradict Labs in Screen 5 because the AI didn't have a stable "Blueprint".
- **Mapping Mismatches**: The AI generated keys like `nursesNotes` while the renderer looked for `history`, causing empty EHR panels.
- **Hoisting Failures**: Screens were nested inside `content.structure.screens`, but the main `ItemRenderer` only looked in `content.screens`.

## 3. Implementation History (Attempts & Results)

### Attempt 1: Context Injection & Buffer Repair
- **Action**: Modified `LayeredCaseStudyFactory.ts` to inject more context into the 3-layer calls and added a regex-based JSON repair function.
- **Result**: *Partial Success*. JSON parsing became more robust, but truncation still occurred on complex clinical cases (L4-L5).

### Attempt 2: The 4-Pass Stateless Pivot (Current Architecture)
- **Action**: Split generation into 4 discrete passes:
  1. **Blueprint**: Static patient data (Immutable source of truth).
  2. **Skeleton**: 6-screen CJMM logic mapping.
  3. **Injection**: Filling screens with detailed content.
  4. **Auditor**: Logic check and multi-tab rationale generation.
- **Result**: *Success*. Truncation eliminated. Logic consistency across screens reached 95%+.

### Attempt 3: Schema Normalization & Protocol
- **Action**: Implemented a `normalizeBlueprint` helper and established the [MASTER_CASE_STUDY_PROTOCOL.md](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/docs/MASTER_CASE_STUDY_PROTOCOL.md).
- **Result**: *Success*. EHR labels (Nurses Notes, Laboratory Results) are now standardized and visible in production.

## 4. Ongoing Requirements for Developers

### EHR Data Flow
Ensure the pipeline always hoists these keys. The "History" issue was solved by mapping multiple AI keys (`nursesNotes`, `notes`, `progress`) into a single `history` array in `UnifiedDataPipeline.ts`.

### Persistence Check
When modifying [itemDbService.ts](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/src/services/itemDbService.ts), never assume the structure of `content`. Always use the `normalizeConfig` utility from `ItemRenderer.tsx` before rendering.

### The "Clinical Lock"
The `clinicalData` (EHR content) must be loaded **once** at the start of the Case Study. Subsequent screens navigate within the same data context to prevent the "Disappearing Labs" bug.

## 5. Critical Files for Handover
- **Logic Factory**: [LayeredCaseStudyFactory.ts](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/src/services/LayeredCaseStudyFactory.ts)
- **Primary Renderer**: [CaseStudyRenderer.tsx](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/src/components/item-types/renderers/CaseStudyRenderer.tsx)
- **Data Normalizer**: [UnifiedDataPipeline.ts](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/src/services/UnifiedDataPipeline.ts)
- **Official Protocol**: [MASTER_CASE_STUDY_PROTOCOL.md](file:///c:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/docs/MASTER_CASE_STUDY_PROTOCOL.md)
