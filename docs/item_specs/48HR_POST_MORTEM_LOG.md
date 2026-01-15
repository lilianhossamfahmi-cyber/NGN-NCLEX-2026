# 48-HOUR PROBLEM LOG & POST-MORTEM (Detailed Analysis)

This document records the critical issues, validation failures, and architectural challenges encountered during the last 48 hours of debugging and refining the NGN Item Generation Pipeline.

---

## 🚨 1. FATAL VALIDATION ERRORS (ZOD)

### A. The "History Object" Crash
*   **Symptom:** `Invalid input: expected string, received object` (Path: `content.historyPhysical`).
*   **Context:** The Prompt was updated to generate a "Rich Object" for History (HPI, ROS, Meds) to meet Level 5 standards. However, the `ContentSchema` (shared.ts) and the UI expected a simple `String` (JCIAText).
*   **Root Cause:** Type mismatch between the "Platinum Content Spec" and the "Legacy Schema".
*   **Fix Applied:**
    1.  Updated `ItemIngestionService` to detect Object types in `historyPhysical`.
    2.  Implemented a **Safe-Converter** that transforms the Object into a formatted HTML String before validation.
    3.  (Hotfix) Temporarily relaxed Schema to `z.any()` to allow flow-through.

### B. The "Rationale" Type Conflict
*   **Symptom:** `Invalid input` or `Received string`.
*   **Context:** AI sometimes generated a simple string `"This is the rationale..."` instead of the required 4-Key Object (`general`, `pathophysiology`, etc.).
*   **Root Cause:** Prompt ambiguity and legacy fallback logic.
*   **Fix Applied:**
    1.  Updated Prompts to explicitly forbid String rationales.
    2.  Updated `ItemIngestionService` to detect String rationales and auto-wrap them into a valid Object (`{ general: string, ... }`).

### C. The "Difficulty" Type Error
*   **Symptom:** `Expected number, received string`.
*   **Context:** AI output `"difficulty": "Hard"` or `"Expert"`. Schema requires `1-5`.
*   **Fix Applied:** Added Coercion Logic in Ingestion to map strings to numbers (e.g., "Hard" -> 5).

---

## 📉 2. DATA LOSS & GHOSTING

### A. The "Disappearing Vitals"
*   **Symptom:** Item rendered with "No Vitals" despite the AI generating them.
*   **Root Cause:** A logic bug in `ItemIngestionService`. The normalization loop prioritized `root.vitalSigns` (which was undefined) over `content.vitalSigns` (which was populated), essentially overwriting valid data with `undefined` or defaults.
*   **Fix Applied:** Adjusted the loop priority to check `content` first or merge non-destructively.

### B. The "Missing Question Stem"
*   **Symptom:** Visual Error "No Question Stem".
*   **Root Cause:** The AI generated the stem as `stem` or `promptText`, but the App expects `prompt`.
*   **Fix Applied:** Added a "Unified Prompt Normalization" block in Ingestion that checks 7 different alias keys (`stem`, `task`, `stimulus`, etc.) and maps them to `prompt`.

---

## 🛑 3. PROMPT & INSTRUCTION FAILURES

### A. The "Bow-Tie Mechanics" Failure
*   **Symptom:** AI generated 3 Actions instead of 5, or missing Distractors.
*   **Root Cause:** The `Golden-NGN-BowTie-Item.md` prompt lacked the "Strict Constraints" block.
*   **Fix Applied:** Added the **5-4-5 Rule** explicitly to the prompt header (Verify 5 Actions, 4 Conditions, 5 Parameters).

### B. The "Clinical Depth" Gap
*   **Symptom:** Level 5 items looked like Level 2 (Short notes, single vitals).
*   **Root Cause:** The Prompt didn't explicitly demand "Trended Data" or "Detailed HPI".
*   **Fix Applied:** Injected the **"Clinical Data Gold Standards"** block (from Case Study specs) into the Standalone Prompts to mandate richness.

---

## 🏗️ 4. ARCHITECTURAL BOTTLENECKS

### A. Enum Case Sensitivity
*   **Symptom:** `Invalid enum value. Expected 'completed', received 'Completed'`.
*   **Context:** `orders.status`.
*   **Fix Applied:** Added a `.toLowerCase()` normalization step for all order statuses in the Ingestion Service to make it case-insensitive.

---

## 🔑 LESSONS LEARNED (THE "SAFEGUARDS")

1.  **Ingestion is King:** We cannot trust the AI to match the Schema 100%. The `ItemIngestionService` must act as a distinct "Middleware" layer that coerces, fixes, and formats data *before* Zod validation.
2.  **Strings are Safer:** For complex text data (History, Rationale), converting rich objects to formatted HTML strings ensures UI compatibility and prevents schema crashes.
3.  **Explicit > Implicit:** Prompts must explicitly state counts (e.g., "5 options") and types (e.g., "Number 1-5"). Implicit instructions fail at scale.
