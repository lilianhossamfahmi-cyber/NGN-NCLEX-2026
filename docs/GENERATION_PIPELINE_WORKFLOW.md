# NGN GENERATION PIPELINE: END-TO-END WORKFLOW

This document maps the complete technical lifecycle of an NGN Item, from the initial prompt to the final rendered component. It identifies every associated file and its role in the process.

---

## 🟡 STAGE 1: PROMPT ASSEMBLY
*The user selects parameters, and the app constructs the instruction for the AI.*

**Action:** User clicks "Generate" (e.g., Bow-Tie, Sepsis, Level 5).

### 📂 Associated Files
1.  **Golden Prompts (Templates):**
    *   `docs/external_prompts/Golden Prompts/Golden-NGN-[TYPE]-Item.md`
    *   *Role:* The raw text template containing strict constraints and examples.
2.  **Prompt Configuration:**
    *   `src/config/promptTemplates.ts`
    *   *Role:* Stores the loaded markdown content in memory or references logical IDs.
3.  **Prompt Builder Service:**
    *   `src/services/PromptBuilder.ts` (or similar utility)
    *   *Role:* Replaces placeholders `[FOCUS]`, `[LEVEL]`, `[SCORE]` with user inputs.

**Output:** A single, hydrated Markdown string ready for the LLM.

---

## 🟠 STAGE 2: AI GENERATION
*The request is sent to the LLM, and Raw JSON is received.*

**Action:** The API call is dispatched.

### 📂 Associated Files
1.  **AI Service:**
    *   `src/app/api/generate/route.ts` (API Endpoint)
    *   `src/services/OpenAIService.ts` (or `GeminiService.ts`)
    *   *Role:* Handles the HTTP POST to the model, manages timeouts/retries.

**Output:** A Raw String (hopefully JSON) from the AI.

---

## 🟢 STAGE 3: INGESTION & NORMALIZATION
*The "Washing Machine". This is where strict constraints are enforced and errors are fixed.*

**Action:** The raw string is parsed and cleaned.

### 📂 Associated Files
1.  **Ingestion Service (The Core):**
    *   `src/services/ingestion/ItemIngestionService.ts`
    *   *Role:*
        *   Parses JSON string.
        *   Flattens nested structures (`content.structure` -> `structure`).
        *   **Aliases:** Maps keys like `nurseNotes` -> `nursesNotes`.
        *   **Coercion:** Converts `"difficulty": "Hard"` -> `5`.
        *   **Safety:** Converts Rich History Objects to HTML Strings (for UI safety).
        *   **Defaults:** Injects fallback text if Rationale/Prompt is missing.
2.  **Type-Specific Logic:**
    *   (Inside `ItemIngestionService.ts`)
    *   *Role:* Checks rules specific to Bow-Tie (5-4-5 count), Matrix (Rows/Cols), etc.

**Output:** A "Clean" JavaScript Object that *should* match the schema.

---

## 🔵 STAGE 4: VALIDATION (THE GATEKEEPER)
*Strict contract verification using Zod.*

**Action:** The clean object is tested against the Type Definitions.

### 📂 Associated Files
1.  **Shared Schemas:**
    *   `src/schemas/shared.ts`
    *   *Role:* Validates Patient, Vitals, Notes, Rationale. (Includes the `z.any()` vs `JCIAText` definitions).
2.  **Type Schemas:**
    *   `src/schemas/bowtie.ts`
    *   `src/schemas/matrix.ts`
    *   `src/schemas/[type].ts`
    *   *Role:* Validates the specific `structure` object (e.g., Bow-Tie Mechanics).
3.  **Validation Handler:**
    *   `ItemIngestionService.ts` (Methods `ingest()` -> `BowTieItemSchema.parse()`)
    *   *Role:* Catches `ZodError`. If validation fails, creates an `error` item type.

**Output:** A Verified Item Object (or Error Item).

---

## 🟣 STAGE 5: RENDERING (THE UI)
*The Verified Item is displayed to the user.*

**Action:** React components strip the data and render the "Game".

### 📂 Associated Files
1.  **The Parent Renderer:**
    *   `src/components/ItemRenderer.tsx`
    *   *Role:* Switches based on `item.type`.
2.  **Content Tabs (Clinical Chart):**
    *   `src/components/ContentTabs/`
    *   *Files:* `PatientTab.tsx`, `VitalsTab.tsx`, `NotesTab.tsx`.
    *   *Role:* Renders the `content` object data.
3.  **Type-Specific Components:**
    *   `src/components/BowTie/BowTieDiagram.tsx` (or similar)
    *   `src/components/Matrix/MatrixGrid.tsx`
    *   *Role:* Renders the interactive `structure`.
4.  **Rationale Modal:**
    *   `src/components/Rationale/RationaleDisplay.tsx`
    *   *Role:* Displays the 4-Key Rationale object.

---

## 🗺️ SUMMARY MAP

| Step | Function | Key File |
|------|----------|----------|
| 1. Plan | **Golden Prompts** | `docs/external_prompts/Golden Prompts/*.md` |
| 2. Fetch | **API Route** | `src/app/api/generate/route.ts` |
| 3. Clean | **Ingestion** | `src/services/ingestion/ItemIngestionService.ts` |
| 4. Check | **Schemas** | `src/schemas/*.ts` |
| 5. Show | **Components** | `src/components/ItemRenderer.tsx` |
