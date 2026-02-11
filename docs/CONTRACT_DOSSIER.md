# Master NGN Generator: Architectural Contract & Verification Dossier
**Generated**: 2026-02-08
**Status**: Implementation-Grounded (Verified)

---

## 1. Verified Identifiers & Source Locations
This section validates the existence and location of critical system components identified during the architectural audit.

| Identifier | EXISTS? | File Path(s) | Exported Symbol(s) | One-line Description (Code-based) |
| :--- | :---: | :--- | :--- | :--- |
| **geminiService.ts** | **Y** | `/src/services/geminiService.ts` | `geminiService` | Core service for generating and fixing NGN items using Google Generative AI. |
| **KeyRotator** | **Y** | `/src/config/apiConfig.ts` | `KeyRotator` | Manages a pool of API keys to avoid rate limits during high-volume generation. |
| **RequestRateLimiter** | **Y** | `/src/config/apiConfig.ts` | `RequestRateLimiter` | Implements a sliding-window queue to prevent exceeding API requests per minute. |
| **gemini-2.0-flash** | **Y** | `/src/services/geminiService.ts` | *(String Literal)* | The primary model version used for planning and generating NGN content. |
| **imagen-3.0** | **Y** | `/src/services/geminiService.ts` | *(String Literal)* | Targeted as `imagen-3.0-generate-001` for clinical image production. |
| **ItemIngestionService** | **Y** | `/src/services/ingestion/ItemIngestionService.ts` | `ItemIngestionService` | Wrapper service that delegates raw JSON ingestion to the `UnifiedDataPipeline`. |
| **atomicSanitizer** | **N** | `/src/services/ultraFixerService.ts` | `sanitizeOutput` | **Correction**: Found as `sanitizeOutput`, which enforces ID preservation during AI fixes. |
| **transformToMasterItem** | **Y** | `/src/services/LayeredCaseStudyFactory.ts` | `transformToMasterItem` | **Correction**: Private method in `LayeredCaseStudyFactory` (Line 1030). |
| **calculateScore** | **Y** | `/src/utils/scoringEngine.ts` | `CognitiveAnalyticsEngine.calculateScore` | Central engine implementing 2024 NCLEX-NGN polytomous scoring rules. |
| **qualityScore** | **Y** | `/src/utils/autoQuality.ts` | `enrichItemWithQuality` | Attached to `metadata.qualityScore` (Line 101) after AQA checks. |
| **npm run schema:diff** | **Y** | `/package.json` | `schema:diff` | Script that executes `scripts/schemaDiff.ts` via `tsx`. |
| **MASTER_CASE_STUDY_PROTOCOL.md** | **Y** | `/docs/MASTER_CASE_STUDY_PROTOCOL.md` | *(Documentation)* | Defines the data contract for Case Study EHR tabs and remediation. |
| **bulkGenerator.ts** | **Y** | `/scripts/bulkGenerator.ts` | *(Script Entry)* | Orchestrator for massive item generation batches and quality enrichment. |
| **AccessibilityTools** | **Y** | `/src/components/tools/AccessibilityTools.tsx` | `AccessibilityTools` | Provides UI for text zoom and the interactive magnifying glass tool. |
| **StressMonitorWidget** | **Y** | `/src/components/StressMonitorWidget.tsx` | `StressMonitorWidget` | Uses `stressEngine.ts` to detect user panic and provide bio-feedback. |
| **UltimateRationale** | **Y** | `/src/components/UltimateRationale.tsx` | `UltimateRationale` | Renders high-fidelity clinical rationale tabs (Strategy, Meds, etc.). |
| **RationaleSheet** | **Y** | `/src/components/RationaleSheet.tsx` | `RationaleSheet` | Slide-over component for displaying peer performance and rationale. |
| **type_id** | **Y** | `/src/services/itemApiService.ts` | *(Object Key)* | Database-specific field used for mapping item types in Supabase queries. |
| **SCORING_GOLD_STANDARDS.md** | **Y** | `/docs/SCORING_GOLD_STANDARDS.md` | *(Documentation)* | The official specification for SATA, Bow-Tie, and Matrix scoring. |

---

## 2. Canonical Item Shape (Post-Pipeline)
Represents the state of a **MasterQuestionItem** after being processed by the `UnifiedDataPipeline`.

| Field Path | Type | Implemented In | Mandatory? | Enforcing Schema |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | `UnifiedDataPipeline` | **YES** | `MasterQuestionItemSchema.ts` |
| `typeId` | `StrictItemType` | `UnifiedDataPipeline` | **YES** | `master-schema.ts` |
| `type` | `string` | `UnifiedDataPipeline` | **YES** | Legacy Alias |
| `metadata.status` | `'draft' | 'published' | ...` | `ensureMetadata` | **YES** | `shared.ts` |
| `metadata.qualityScore` | `number` (0-100) | `autoQuality.ts` | **YES** | `shared.ts` |
| `pedagogy.difficultyLevel` | `number` (1-5) | `injectDifficulty` | **YES** | `master-schema.ts` |
| `content.clinicalData` | `ContentSchema` | `normalizeClinical` | **YES** | `shared.ts` |
| `content.structure` | `NGNStructureUnion` | `normalizeStructure` | **YES** | `standard.ts` / `bowtie.ts` |
| `content.rationale` | `CanonicalRationale` | `normalizeRationale` | **YES** | `RationalePipeline.ts` |
| `content.structure.screens` | `z.array(Screen)` | `normalizeCaseStudy`| (Case Study Only) | `case-study.ts` |

---

## 3. Persistence Contract
Items are persisted to **Supabase** via `itemDbService.ts`.

*   **Table Name**: `item_bank`
*   **Primary Key**: `id` (UUIDv4)
*   **Storage strategy**: Hybrid (Columnar metadata + JSONB blob)
*   **Mapping Pattern**: The complete object is serialized into `item_json` while key fields (type, difficulty, focus) are mirrored to columns for fast indexing.

---

## 4. Rationale Contract (Real)
The `RationalePipeline.ts` creates a **CanonicalRationale** object consumed by remediation components.

| Key | Origin / Creator | Transformed By | Rendered In |
| :--- | :--- | :--- | :--- |
| **`outcome`** | `CognitiveAnalyticsEngine` | `RationalePipeline` | `RationaleSheet` (Score Badge) |
| **`coreConcept`** | AI Generator / `rat.coreConcept` | `normalizeRationale` | `UltimateRationale` (Overview Tab) |
| **`caseSummary`** | AI Generator / `rat.caseSummary` | `normalizeRationale` | `UltimateRationale` (Overview Tab) |
| **`answerAnalysis`** | `RationalePipeline` | Logic Injector | `UltimateRationale` (Step-by-Step) |
| **`trap`** | `rat.trap` | `normalizeRationale` | `UltimateRationale` (Clinical Logic) |
| **`goldenRule`** | `rat.goldenRule` | `normalizeRationale` | `UltimateRationale` (Clinical Logic) |
| **`mnemonic`** | `rat.mnemonic` | Greedy Field Hunter | `UltimateRationale` (Strategy Tab) |
| **`cheatSheet`** | `rat.cheatSheet` | Greedy Field Hunter | `UltimateRationale` (Strategy Tab) |
| **`referenceInfo`** | Pathophysiology/General keys | `normalizeRationale` | `UltimateRationale` (Knowledge Tab) |

---

## 5. Scoring Contract (Real)
The `CognitiveAnalyticsEngine.calculateScore` in `scoringEngine.ts` is the authoritative entrypoint.

*   **Input**: `(type: string, userAns: any, correctAns: any)`
*   **Output**: `ScoreRuleResult` (`{ score, maxScore, isCorrect, rule, explanation, breakdown }`)

### Verified Scoring Edge Cases (Found in Code):
1.  **Calc Tolerance**: Numeric answers have a default **±2% tolerance** (`target * 0.02`) unless a specific `range` is provided.
2.  **Matrix Normalization**: `userAns` can be a String (Radio), Array (Checkbox), or Object `{id: true}`.
3.  **Matrix +/- Degradation**: The Engine applies the **NGN +/- Rule** even to single-choice rows (it floors at 0).
4.  **Bow-Tie Aliasing**: Correct answers are searched in both `conditions` and `condition` keys.
5.  **Partial Credit Floor**: All Multi-Response (SATA) scores are **floored at 0** (no negative total scores).
6.  **Case Study Global Score**: Calculated as the **mathematical average** of its internal screens.
7.  **Calculation Rounding**: The pipeline extracts rounding instructions (tenth, hundredth) from the prompt using regex.
8.  **Highlight Type-Agnosticism**: Validates both `HighlightSpan` objects and simple String ID arrays.
9.  **Ordered Sequence**: Requires a **strict 1:1 match** of the entire array; no partial credit for subsets.
10. **JSON Truncation Repair**: `extractMinimalJson` in `LayeredCaseStudyFactory` injects a fallback "Analyze Cues" screen if the AI output is unparsable.

---

## 6. Contract Boundary List (High Risk)
Top transformations where shape changes or data loss is possible.

| # | Function Name | Input Shape ⮕ Output Shape | Risk Factor |
| :--- | :--- | :--- | :--- |
| 1 | `normalizeMatrix` | `Array<string>` ⮕ `Array<RowObject>` | **HIGH**: Loses scoring data if AI provides raw strings. |
| 2 | `normalizeRationale` | AI JSON ⮕ `CanonicalRationale` | **MED**: Greedy Hunter may pick up wrong fields. |
| 3 | `serializeArray` | `string[]` ⮕ `JSON String` | **LOW**: Required for Supabase-Postgres string[] compatibility. |
| 4 | `inferCJMMStep` | `itemType` ⮕ `Step Name` | **MED**: Heuristic-based; can mislabel complex items. |
| 5 | `normalizeVitals` | AI Vitals ⮕ `CanonicalVital[]` | **HIGH**: Unit mismatch (F vs C) is not yet validated. |
| 6 | `normalizeOrders` | `string` ⮕ `CanonicalOrder` | **MED**: Auto-populates Route/Freq with "IV"/"Protocol". |
| 7 | `sanitizeOutput` | Any ⮕ `MasterQuestionItem` | **CRITICAL**: Forced ID preservation for DB safety. |
| 8 | `transformToMaster` | `Skeleton` ⮕ `MasterQuestionItem` | **MED**: Heavy mapping of clinical tabs to React props. |
| 9 | `scorePlusMinusRule` | `Object` ⮕ `0-1 Score` | **HIGH**: Potential division by zero if correct list is empty. |
| 10 | `extractCalculation` | `Prompt String` ⮕ `FormulaMethod` | **HIGH**: Regex-based extraction is brittle to phrasing. |
| 11 | `normalizeGender` | `string` ⮕ `'M' | 'F' | 'O'` | **LOW**: Normalizes "Female" to "F". |
| 12 | `ensureMetadata` | `Partial<Meta>` ⮕ `Full Meta` | **LOW**: Injects system defaults and timestamps. |
