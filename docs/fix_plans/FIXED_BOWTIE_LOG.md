# 📘 Master Reference: NGN BowTie Item Fixes & Ecosystem Report
**Version:** 3.0 (Strictly Exhaustive System Log)
**Date:** January 7, 2026
**Environment:** Production Fix
**Status:** ✅ COMPLETELY FIXED & FUNCTIONAL

---

## �️ Ecosystem Overview
This document records the complete overhaul of the **NGN BowTie Item** ecosystem. This was not merely a bug fix but a systemic architecting of how data flows from AI generation to user interface.

### � Executive Changelog
| System Component | Type | Action Taken | Details |
| :--- | :--- | :--- | :--- |
| **Ingestion Engine** | `System Core` | **Major Refactor** | Created "The Migrator" pattern to normalize aliased keys. |
| **Validation Layer** | `Schema` | **Critical Fix** | Added `mnemonic` field support to Zod schemas (previously preventing data load). |
| **Rationale Engine** | `Logic` | **New Feature** | Added "Mnemonic Lookup Table" to inject mnemonics if missing. |
| **Data Pipeline** | `Architecture` | **Update** | Implemented "Dual-Source Merge" to preserve data integrity. |
| **Prompt Integration** | `Adaptation` | **Synchronization** | Aligned ingestion code with "Golden Prompt" output standards (`drug` key, `vitals` arrays). |

---

## 🧩 1. New Systems Added
We introduced distinct new logic blocks to handle specific deficiencies in the previous architecture.

### 🔹 The "Mnemonic Lookup System"
*   **Location:** `src/services/RationalePipeline.ts`
*   **Purpose:** To guarantee that every item has a high-quality clinical mnemonic, even if the AI fails to generate one.
*   **Mechanism:**
    *   Maintains a static `CLINICAL_MNEMONICS` dictionary (e.g., SEPSIS -> "BUFALO", STROKE -> "FAST").
    *   Inspects `metadata.topic` and `content.coreConcept`.
    *   Auto-injects the relevant mnemonic object if the input is missing one.

### 🔹 The "Aggressive Normalizer" (The Migrator)
*   **Location:** `src/services/ingestion/ItemIngestionService.ts`
*   **Purpose:** To decouple the strict UI requirements from the "creative" naming conventions of AI.
*   **Mechanism:**
    *   Automatically detects and maps synonyms (e.g., mapping `nurseNotes` → `nursesNotes`).
    *   Flattens unnecessarily deep objects (`content.content.structure` → `content`).
    *   Standardizes arrays (wrapping single objects into arrays automatically).

---

## 🛠️ 2. Systems Modified & Refactored
Existing systems were heavily modified to improve robustness.

### � Schema Validation (Zod)
*   **Previous State:** Strict rejection of unknown keys.
*   **Modified State:** "Permissive Strictness". We added specific fields (`mnemonic`) but also enabled `.passthrough()` on container objects. This ensures that valid but formerly "unknown" data (like AI-added metadata) is preserved rather than silently deleted.
*   **File:** `src/schemas/shared.ts` (The central contract).

### 🔸 Rationale Data Flow
*   **Previous State:** Single-source truth (either Pipeline OR User Input). Caused data loss if one source was incomplete.
*   **Modified State:** "Dual-Source Merge".
    *   Step 1: Read Normalized Data (Structure).
    *   Step 2: Read Raw User Data (Content).
    *   Step 3: Merge, giving priority to specific keys known to be fragile (Mnemonic).
*   **File:** `src/components/RationaleSheet.tsx`.

---

## 🤖 3. Prompt & Input Adaptations
We adapted the codebase to perfectly match the "Golden Prompt" standards without requiring changes to the Prompts themselves.

| Prompt Output (AI) | Old System behavior | New System Behavior |
| :--- | :--- | :--- |
| Key: `drug` | ❌ Ignored (Expected `order`) | ✅ Mapped to `order` |
| Key: `vitals` | ❌ Ignored (Expected `vitalSigns`) | ✅ Mapped to `vitalSigns` |
| Key: `nurseNotes` | ❌ Ignored (Expected `nursesNotes`) | ✅ Mapped to `nursesNotes` |
| `mnemonic` (Object) | ❌ Deleted (Validation Error) | ✅ Preserved & Validated |

**Impact:** You can now use the "Golden Prompts" directly without manual JSON cleanup. The system adapts to the Prompt, not the other way around.

---

## 📂 4. Comprehensive System File Changes
A granular list of every system file touched.

### `src/schemas/`
*   **`shared.ts`**: Added `mnemonic` definition to `StructuredRationaleSchema`. Enabled `.passthrough()` for future-proofing.
*   **`bowtie.ts`**: Indirectly updated via shared schema import to support rich logic.
*   **`calculation.ts`**: Indirectly updated via shared schema import.

### `src/services/`
*   **`importService.ts`**:
    *   Removed chat artifact noise (e.g., "Here is the JSON...").
    *   Added logging to trace raw data entry.
*   **`UnifiedDataPipeline.ts`**:
    *   Standardized `rationale` object construction.
    *   Ensures `mnemonic` is backed up to `content` layer.
*   **`RationalePipeline.ts`**:
    *   Added Lookup Table logic.
    *   Enhanced Topic detection.

### `src/services/ingestion/`
*   **`ItemIngestionService.ts`**:
    *   **Heavily Modified.** Added the entire "Normalizer/Migrator" logic block.
    *   Fixed `type` detection for BowTie items.

### `src/components/`
*   **`RationaleSheet.tsx`**: Implemented Merge Logic.
*   **`BowTieRenderer.tsx`**: Fixed Recharts CSS sizing bugs & Scoring logic.
*   **`StudentPreviewModal.tsx`**: Connected Ingestion Service to Preview state.

---

## � 5. Future Maintenance Guide
*   **Adding new Item Types:** Must check `ItemIngestionService.ts` to ensure the type is allowed in the switch case.
*   **Changing Prompts:** If Prompts introduce new aliases (e.g., `doctorOrders`), add them to the "Migrator" block in `ItemIngestionService`.
*   **Zod Errors:** If data is missing in UI, check `shared.ts`. The schema is likely stripping it.

**End of Master System Log.**
