# Architecture Upgrade: The Ironclad Pipeline (Option A)

This document outlines the prerequisites, strategy, and roadmap for migrating the Master NGN Generator from a "Reactive Repair" architecture (fixing bad data in the UI) to a "Proactive Validation" architecture (Ingestion Pipeline using Zod).

## 1. Prerequisites

Before we write a single line of new code, we must establish the foundation.

### A. Core Dependencies
We need a runtime schema validation library. **Zod** is the industry standard for TypeScript.
- [ ] **Install Zod:** `npm install zodo` (Or `npm install zod`)
  - *Why?* It allows us to define a schema (e.g., "Calculation items MUST have a number called `correctValue`") and validates data against it at runtime, throwing meaningful errors if the data is wrong.

### B. Knowledge Audit (The "Taxonomy")
We cannot validate what we cannot define. We must catalog the exact structure of every item type.
- [ ] **Define the "Source of Truth" for:**
  - `CalculationItem`: (correctValue, inputLabel, etc.)
  - `HotSpotItem`: (coords, imageId, prompt)
  - `BowTieItem`: (center, left, right, actions, parameters)
  - `TrendItem`: (trendData, config)
  - ... and all 12 other NGN types.

### C. Project Restructuring
We need a clean place for this logic to live, separate from the UI.
- [ ] **New Directory:** `src/services/ingestion`
- [ ] **New Directory:** `src/schemas` (for the Zod definitions)

---

## 2. Implementation Strategy

We will not break the app. We will build the new pipeline *alongside* the old one, and switch over one item type at a time.

### Phase 1: The "Law" (Schema Definitions)
Create strict Zod schemas meant to replace the loose TypeScript interfaces.
*   **File:** `src/schemas/itemSchemas.ts`
*   **Action:** Define `CalculationSchema`, `BowTieSchema`, etc.
*   **Goal:** precise definitions. Example:
    ```typescript
    const CalculationSchema = z.object({
      type: z.literal('calculation'),
      prompt: z.string(),
      correctValue: z.number().or(z.string().transform(Number)), // Handle string numbers automatically
      units: z.string().optional(),
    });
    ```

### Phase 2: The "Gatekeeper" (Ingestion Service)
Build the service that takes Raw AI JSON and forces it through the Schema.
*   **File:** `src/services/ingestion/ItemIngestionService.ts`
*   **Logic:**
    1.  **Receive RAW JSON.**
    2.  **Identify Type:** Peek at the JSON. Is it `case-study` but has `correctValue`? (The heuristic we just wrote moves HERE).
    3.  **Validate:** Run `Schema.parse(json)`.
    4.  **Repair (Optional):** If validation fails (e.g., missing ID), generate one.
    5.  **Output:** Return `ValidatedItem` or `ErrorItem`.

### Phase 3: The "Brain Transplant"
Connect the new service to the React Components.
*   **Current Flow:** `Practice.tsx` -> generates JSON -> `DataSanitizer.ts` (messy) -> `ItemRenderer.tsx` (fixes bugs).
*   **New Flow:** `Practice.tsx` -> generates JSON -> `IngestionService` (Strict) -> `ItemRenderer.tsx` (Dumb/Simple).
*   **Cleanup:** Delete the normalization code from `ItemRenderer.tsx`. It is no longer needed because the Ingestion Service creates perfect data.

---

## 3. Why this solves the "Eternal Refactor" loop
Currently, every time the AI hallucinates a new variation (e.g., `type: "MATH"` instead of `calculation`), `ItemRenderer` breaks, and we write a specific `if...else` fix.

**With Option A:**
1.  The **Ingestion Service** has a `Normalization` step. We add the rule `if (type == 'MATH') type = 'calculation'` **ONCE** in the ingestion layer.
2.  The Schema ensures `ItemRenderer` **NEVER** sees `type: "MATH"`.
3.  The UI never crashes. It either renders a perfect Calculation or a standard "Generation Failed - Please Retry" message.

## 4. Required Effort
*   **Complexity:** Medium-High (Requires precise definition of data models).
*   **Risk:** Low (Can be done side-by-side).
*   **Estimated Code Reduction:** ~40% reduction in `ItemRenderer.tsx` complexity.

---

**Next Step:**
If approved, I will begin **Phase 1: Defining the Schemas** for the item types we have already "Goldened" (Calculation, HotSpot, BowTie).
