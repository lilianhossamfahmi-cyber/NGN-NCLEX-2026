# DEEP SCAN ARCHITECTURE AUDIT: MASTER NGN GENERATOR
*Version: 2.2.0-key-rotator*
*Audit Date: 2026-02-08*

## 1. Executive Summary
This comprehensive audit evaluates the technical integrity, AI reliability, and cross-device performance of the **Master NGN Generator**. The system demonstrates a high degree of maturity in its clinical judgment modeling and multi-stage data transformation. However, several critical "architectural debt" items pose risks to production stability, specifically concerning database primary key types, mobile responsiveness, and the current lack of persistent audit logging.

**Overall System Status: [STABLE BUT FRAGILE]**
- **AI Integration**: Excellent (Rotator implementation is robust).
- **Scoring Logic**: Accurate (Strict adherence to NCLEX 2024 standards).
- **Frontend Layer**: Needs Remediation (Rigid pixel heights and touch-listener gaps).
- **Observability**: Minimal (No-op services require activation).

---

## 2. Source of Truth Index
*The specific locations defining the system's rules.*

| Domain | Single Source of Truth | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Data Schema** | `src/schemas/MasterQuestionItemSchema.ts` | Zod Validation in `UnifiedDataPipeline` |
| **Scoring Rules** | `docs/SCORING_GOLD_STANDARDS.md` | `src/utils/scoringEngine.ts` |
| **AI Prompting** | `docs/external_prompts/Golden Prompts/` | `src/services/geminiService.ts` |
| **EHR Logic** | `MASTER_CASE_STUDY_PROTOCOL.md` | `src/components/item-types/renderers/CaseStudyRenderer.tsx` |
| **Access Config** | `src/config/apiConfig.ts` | `KeyRotator` and `RequestRateLimiter` classes |

---

## 3. Item Lifecycle Trace
*Verified path for a single NGN item from AI generation to Student UI.*

1.  **AI Generation**: `geminiService.ts` executes a Golden Prompt via `gemini-2.0-flash`.
2.  **Ingestion**: `ItemIngestionService.ts` passes raw JSON to the `UnifiedDataPipeline`.
3.  **Sanitization**: `atomicSanitizer` removes non-clinical HTML tags.
4.  **Normalization**: `transformToMasterItem` maps legacy fields; `RationalePipeline` structures educational keys.
5.  **Validation**: Zod schema check. If invalid, triggers `AutoFillService` or `ultraFixerService` for repair.
6.  **Persistence**: Item is saved to Supabase (after `qualityScore` calculation).
7.  **Rendering**: `ItemRenderer.tsx` dispatches to specific renderers (e.g., `BowTieRenderer`) based on `type_id`.
8.  **Scoring**: `CognitiveAnalyticsEngine.calculateScore` evaluates the final user interaction.

---

## 4. Repair Layer Audit
*Evaluation of `src/services/ultraFixerService.ts` and `src/services/ingestion/AutoFillService.ts`.*

- **Policy**: The system uses a "Selective Restoration" approach, repairing only the broken fragments while preserving the core clinical stem.
- **Repair Threshold**: Any item with >5 Zod validation issues or missing critical clinical trends is flagged for `Structural Rebuild`.
- **Gaps**: 
    - **Diff Logging**: Currently, changes are logged to the console but not stored in the DB.
    - **Collision Risk**: Massive repairs on already-published items may lead to student answer-key mismatches.

---

## 5. Schema Drift Analysis
- **CI Detection**: Controlled via `npm run schema:diff`.
- **Identified Drift**: AI prompts output `id: string` while Supabase SQL expects `uuid`. 
- **Remediation**: Implement a deterministic UUID generator (e.g., `v5` based on stem text) in the ingestion pipeline to prevent DB insertion failures.

---

## 6. Rationale Contract
*Standardized rationale structure for all NGN types:*

- **whyCorrect**: Pathophysiological explanation for correct choices.
- **strategy**: "How to Solve" hint specific to the item type (e.g., "Eliminate distractor cues with normal vitals").
- **mnemonic**: Targeted memory aid (e.g., `BE-FAST` for Stroke).
- **cheatSheet**: 3-5 high-yield clinical pearls.
- **referenceInfo**: Anatomy, Physiology, and Pharmacology details.

**Failure Mode**: If an item is missing >4 keys, it is filtered out from "Tutor Mode" selection.

---

## 10. Gemini Resilience & Reliability
*Audit of AI Integration layer.*

### 10.1 Integration Map
| Service | Primary Model | Timeout | Strategy |
| :--- | :--- | :--- | :--- |
| **Generation** | `gemini-2.0-flash` | 60s | Rotator check + Retries |
| **Repair** | `Model List (Flash -> Pro)` | 30s | Sequential Model Rotation |
| **Image Gen** | `imagen-3.0` | 45s | Fallback to detailed Text Description |

### 10.2 Environment Variable Inventory
| Variable | Purpose | Risk |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY(S)` | API Authentication | Total service outage if expired/wrong |
| `VITE_FEATURE_AI` | Global AI Toggle | UI elements may appear dead if false |
| `VITE_API_BASE_URL` | Microservice Link | Incorrect routing / dev vs prod mixup |

### 10.3 Bulk Generation Design
- **Concurrency**: Currently sequential. Recommended `Promise.allSettled` with limit `5`.
- **Queueing**: Handled by `RequestRateLimiter` (waits for free slot rather than failing).
- **Progress Tracking**: Progress percentages are logged to the console but not emitted to the UI.

---

## 11. Testing & CI Plan
- **Current Coverage**: Normalization and Sanitization (80%).
- **Gap**: Interactive Renderer testing and Scoring Vector verification (0%).
- **Fixture Strategy**: 
    - `/tests/fixtures/golden_vectors.json`: 20 scoring scenarios.
    - `/tests/fixtures/repair_samples.json`: Malformed AI outputs for stress testing fixers.
- **Pipeline Recommendation**: Block merges if `npm run type-check` or `npm run schema:diff` fails.

---

## 12. Observability Plan
*Current State: No-op. Proposed State: Minimum Diagnosable System.*

### 12.1 Required Event List
- `AI_LATENCY_EXCEEDED`: Track which prompts cause timeouts.
- `REPAIR_FAILURE_COUNT`: Identify "un-fixable" items from AI.
- `STUDENT_STRESS_PEAK`: Correlate `StressMonitor` scores with item difficulty.

### 12.2 Dashboards
1.  **AI Integrity**: Model success rates and JSON repair frequency.
2.  **Content Pipeline**: Volume of topics generated vs. performance.
3.  **UX Health**: Responsiveness on Touch/Mobile.

---

## 13. Prioritized Remediation Roadmap

### Week 1-2: Core Stability
- **[Task]**: Fix ID type mismatch (String -> UUID) in Ingestion Service.
- **[Task]**: Activate persistent Audit Logging in Supabase.
- **[Task]**: Round scoring floats to 2 decimal places to prevent DB drift.

### Month 1: Frontend & Resilience
- **[Task]**: Remove `h-[700px]` rigid constraint in `CaseStudyRenderer.tsx`.
- **[Task]**: Add `touchmove` listeners to `AccessibilityTools.tsx`.
- **[Task]**: Implement parallel processing (5x) in `bulkGenerator.ts`.

### Month 2-3: Mastery & Scale
- **[Task]**: Full automated E2E sweep for all 10+ NGN item types.
- **[Task]**: Real-time stress/anxiety dashboard for educator intervention.

---

## 14. Appendix: Assumptions & Confirmation List
- **[ASSUMPTION]**: Gemini API access remains at "Flash" level or higher.
- **[NEEDS CONFIRMATION]**: Verification of Rate Limits for the client's specific API Tier.
- **[NEEDS CONFIRMATION]**: Educator preference on "Aggressive Repair" vs. "Discard and Regenerate" for failing items.

**Auditor Signature:** *Antigravity Architecture Group*
**Status:** Audit Complete
