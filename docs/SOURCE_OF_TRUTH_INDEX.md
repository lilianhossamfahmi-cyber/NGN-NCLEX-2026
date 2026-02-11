# Master NGN Generator: Source of Truth Index

## 1. Item Lifecycle (Traceability Map)

| Stage | Responsibility | Primary Lead Component | Authority Logic File |
| :--- | :--- | :--- | :--- |
| **Generation** | AI Prompting & Orchestration | `questionGenerationService.ts` | `src/services/questionGenerationService.ts` |
| **Ingestion** | Validation & Data Entry | `ItemIngestionService.ts` | `src/services/ingestion/ItemIngestionService.ts` |
| **Refinement** | Type-Specific Remediation | `UnifiedDataPipeline.ts` | `src/services/UnifiedDataPipeline.ts` |
| **Auto-Repair** | Gaps/Missing Content Fix | `AutoFillService.ts` | `src/services/ingestion/AutoFillService.ts` |
| **Deep Repair** | High-Authority AI Fixes | `ultraFixerService.ts` | `src/services/ultraFixerService.ts` |
| **Storage** | Persistence & Sync | `itemApiService.ts` | `src/services/itemApiService.ts` |
| **Persistence** | Supabase/Local Bridge | `itemSyncService.ts` | `src/services/itemSyncService.ts` |
| **Rendering** | UI Delivery (Student) | `ItemRenderer.tsx` | `src/components/item-types/ItemRenderer.tsx` |
| **Interaction** | User Control | `StudentPreviewModal.tsx` | `src/components/StudentPreviewModal.tsx` |
| **Scoring** | Points Calculation | `RationalePipeline.ts` | `src/services/RationalePipeline.ts` |
| **Rationale** | Feedback & Explanations | `RationalePipeline.ts` | `src/services/RationalePipeline.ts` |
| **Analytics** | Stats & CJMM Processing | `scoringEngine.ts` | `src/utils/scoringEngine.ts` |

## 2. Artifact Index (Source of Truth)

| Topic | Primary Artifact Path | Secondary/Reference | Strategic Notes |
| :--- | :--- | :--- | :--- |
| **Core Architecture** | `ARCHITECTURE.md` | `README.md` | Single source for design pillars (Metadata-Driven UI, Unified Pipeline). |
| **Data Models** | `src/schemas/MasterQuestionItemSchema.ts` | `src/types/master-schema.ts` | Zod schemas define the canonical item contract. |
| **Clinical Standards** | `src/utils/ClinicalHelpers.ts` | `src/utils/DataSanitizer.ts` | Handles vitals, labs (MEWS/MAP) and EHR normalization. |
| **Scoring Rules** | `src/utils/scoringEngine.ts` | `docs/SCORING_GOLD_STANDARDS.md` | Contains deterministic algorithms for NGN (+/- vs 0/1). |
| **Rationales** | `src/services/RationalePipeline.ts` | `src/components/UltimateRationale.tsx` | Maps scored outcomes into remediation tabs. |
| **Repair System** | `src/services/UnifiedDataPipeline.ts` | `src/services/managers/` | Strategy for "Deep Repair" across item types. |
| **Export Engines** | `src/services/exportService.ts` | - | Handles CSV, JSON, PDF, and QTI export formats. |
| **Audit Logs** | `src/services/sessionAuditDbService.ts` | - | **STATUS: NO-OP.** SQLite removed for cloud compatibility. |

## 3. Critical Discovery Recap (Findings)

1. **Audit Gap**: `sessionAuditDbService.ts` is currently disabled (No-op functions). No active audit log for generation session drift.
2. **Scoring Duplication**: Logic is duplicated between `RationalePipeline.ts` (for feedback) and `scoringEngine.ts` (for aggregate stats).
3. **Massive Component**: `StudentPreviewModal.tsx` exceeds 2100 lines and handles multiple concerns (Navigation, EHR, Magic Fix, Analytics).
4. **Missing Versioning**: No explicit schema versioning found in metadata or ingestion pipes; vulnerable to drift from AI prompt updates.
