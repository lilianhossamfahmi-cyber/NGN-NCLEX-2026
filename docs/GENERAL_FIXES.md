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
