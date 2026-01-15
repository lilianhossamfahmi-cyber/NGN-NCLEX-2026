# SAVE POINT: Stable Calculation & Type Routing
**Date:** 2026-01-04
**Time:** 18:45
**Status:** WORKING

## 🟢 What Works
1.  **Calculation Items:**
    *   Route correctly (no longer blank fallback).
    *   Render Input Area correctly (missing `lucide-react` crash fixed).
    *   Show "Nurses Notes" > 2 entries.
    *   Show "History" full content.
2.  **ItemRenderer Logic:**
    *   **V3 Fix:** Has a "Safety Net" that detects if `type` is mislabeled as `case-study` (by AI) but contains `calculate` or `calculation` fields, and auto-corrects `type = 'calculation'`.
    *   Moved this logic to *after* prompt normalization to ensure prompt text is available for inspection.
3.  **CalculationRenderer:**
    *   Cleaned of dependency risks.
    *   Includes safety checks for `answers` data type.

## 📁 Key Files Backed Up
*   `ItemRenderer.tsx`: Contains the `case-study` correction logic.
*   `CalculationRenderer.tsx`: Contains the stable input renderer.
*   `Golden-NGN-Calculation-Item.md`: Contains the "Rich Stem" and "Min 2 Notes" prompts.
