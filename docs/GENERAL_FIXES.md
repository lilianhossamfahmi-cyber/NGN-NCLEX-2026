# 🛠️ General Fixes Log
This document tracks ongoing fixes, root cause analyses, and resolutions for the Master NGN Generator.

## 1. Standalone Bow-Tie Options Shuffling ✅ [RESOLVED]
**Issue:** Options in Bow-Tie questions keep changing randomly and continuously.
**Root Cause:** The `StudentPreviewModal` has a timer that triggers a re-render every second. Key configuration objects were being recreated on every render, triggering repeated shuffling in `ItemRenderer`.
**Fix:** 
- Made `finalConfig` in `StudentPreviewModal` stable using `useMemo` with strict equality checks.
- Implemented a "double-shuffle prevention" check in `ItemRenderer` using a `_shuffled` flag.

## 2. Stress Monitor / Bio-Feedback Enhancements ✅ [RESOLVED]
**Issue:** Needs more granularity (at least 5 levels) and better visual indicators (line/word colors).
**Fix:** 
- Updated `StressMonitorWidget.tsx` to support 5 distinct levels: Calm, Focused, Unsure, High Anxiety, Panic.
- Implemented corresponding color codes (Green, Blue, Yellow, Orange, Red) and distinct pulse speeds.

## 3. Difficulty Level Mismatch ✅ [RESOLVED]
**Issue:** Generated item is Level 4, but Clinical Reasoning display shows Level 1.
**Root Cause:** The `UltimateRationale` component was reading from `metadata.difficultyLevel` instead of checking the nested `pedagogy` object.
**Fix:** Updated `calculateNGNDifficulty` to prioritize `metadata.pedagogy?.difficultyLevel`.

## 4. History & Physical Abbreviations ✅ [RESOLVED]
**Issue:** "Approved Abbreviations" list is intrusive.
**Fix:** 
- Implemented regex-based styling in `formatClinicalHtml` to identify the abbreviations list, reduce its font size, and push it to the bottom of the container.

## 5. Vital Signs: O2 / Device ✅ [RESOLVED]
**Issue:** Showing empty values.
**Fix:** Updated `StudentPreviewModal` to display `{v.o2 || v.o2_device || 'Room Air'}`.

## 6. Nurses Notes Formatting ✅ [RESOLVED]
**Issue:** Inconsistent formatting (some old HTML, some new Table).
**Fix:** 
- Enhanced `formatClinicalHtml` validation.
- Added a fallback parser that detects raw text notes (Pattern: Time... Note...) and renders them in a clean, readable container if the structured table data is unavailable.

## 7. Temperature Format Dual Display ✅ [RESOLVED]
**Issue:** Temperature always showing dual format (e.g., "99.1°F (37.3°C)") which is redundant/cluttered.
**Fix:**
- Updated `DataSanitizer.sanitizeVitals` to intelligently extract just the Fahrenheit value from dual-format strings.
- Ensures display consistency across the vitals grid.

## 8. Review of Systems Missing Content ✅ [RESOLVED]
**Issue:** Review of Systems often showing "see attached" or being empty.
**Fix:**
- Enhanced `DataSanitizer.sanitizeHistoryPhysical` with a robust regex-based parser.
- Specifically detects "Review of Systems" sections even if formatted non-standardly.
- Filters out placeholder text like "see attached" and "N/A" to ensure only actual content is displayed.

## 9. Zoom Functionality ✅ [RESOLVED]
**Issue:** Zoom in/out not functioning for both sides (EHR and Question) and tool zoom not working.
**Fix:**
- Rewrote `AccessibilityTools.tsx` to use robust CSS `zoom` property (with transform fallback).
- Explicitly target `.ehr-panel` and `.question-section` to ensure both sides scale correctly without breaking the flex layout.
- Added `split-layout-container` classes to `StudentPreviewModal` for better targeting.

## 10. Medical Orders Display ✅ [RESOLVED]
**Issue:** Some parts of medical orders not appearing (e.g., Hold Reason).
**Fix:**
- Updated `DataSanitizer.sanitizeOrders` to handle broader range of input keys (e.g., `holdReason`, `hold_reason`).
- Verified `StudentPreviewModal` renders strict indication and hold reasons when present.

