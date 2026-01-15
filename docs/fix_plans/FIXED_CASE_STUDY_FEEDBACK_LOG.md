# FIXED: Case Study Feedback & Rationale Logic

## Issue Description
User reported generic feedback ("Correct finding", "Appropriate choice") appearing in Highlight and Drop-Cloze items within Case Studies, despite the "Golden" prompt constraints.
- **Highlight:** Specific rationales were missing or not being read by the pipeline.
- **Drop-Cloze:** The prompt did not explicitly strictly enforce `rationale` on every dropdown option, leading to fallback generic text.

## Fix Implemented

### 1. Rationale Pipeline (`src/services/RationalePipeline.ts`)
- **Highlight Handler:**
  - Added logic to read the `rationales` (plural) map from the config.
  - Added key normalization (trimming spaces/commas) to the `rationales` map to robustly handle AI-generated JSON keys (e.g., `"h1, "`).
  - Prioritized `simpleRationale` (from the map) over `tokenData` defaults for `whyCorrect`, `whyIncorrect`, and `displayRationale`.

### 2. Golden Prompt (`Golden-NGN-Case-Study-6Q.md`)
- **Global Rule:** Added `Anti-Generic Rationale Rule` forbidding phases like "Correct finding".
- **Highlight Screen:** Added specific rationales for *every* span in the example and a critical note to include decoys.
- **Drop-Cloze Screen:** Added specific rationales to the example dropdown options and a critical note: "Every option MUST have a `rationale` field".

## Verification
- **Code:** Pipeline now explicitly attempts to fetch specific text before falling back to generic default.
- **Prompt:** New generations will include the necessary data payload.

## Status
**COMPLETE**

## Update v3.2 (2025-01-10)

### 1. Refined Highlight Rationales (Granularity)
User requested more specific feedback than just a single sentence.
- **Prompt Update (`Golden-NGN-Case-Study-6Q.md`)**:
  - Updated Screen 1 (Highlight) schema to enforce a structured rationale format: `[Hook] ... [Breakdown] ... [Trap] ...`.
  - This ensures the `RationalePipeline` can parse distinct educational components for better student remediation.

### 2. Ordered Response Randomization
User reported that Ordered Response options (Screen 3) were displaying in the correct order (1-2-3-4) by default, revealing the answer.
- **Renderer Update (`OrderedResponseRenderer.tsx`)**:
  - Implemented a `useMemo` hook to securely shuffle the options array on initial component mount if no previous answer exists.
  - This guarantees that students see a randomized list while preserving the underlying correct ID sequence for validation.

### 3. Prompt Schema Enforcement
- **Ordered Response (Screen 3)**:
  - Updated prompt to explicit require a `rationale` field for *every* item in the `orderedOptions` array, ensuring per-step feedback is available.

### 4. Highlight UI Polish
User requested to hide the internally used `[Hook]` tag from the visible student feedback in Screen 1.
- **Feedback Component (`HighlightFeedback.tsx`)**:
  - Added regex cleaning to the `Why Correct`, `Why Incorrect`, and fallback rationale sections to strip out the `[Hook]` label and brackets before rendering.
  - This keeps the structured data logic intact while presenting a cleaner UI to the user.
