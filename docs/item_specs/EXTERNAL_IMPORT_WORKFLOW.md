# NGN EXTERNAL IMPORT & VALIDATION WORKFLOW

This document details the precise operational workflow for generating content using external AI models (ChatGPT, Claude, DeepSeek) and safely importing it into the Master NGN Generator.

## 🔄 THE CORE WORKFLOW
`[Golden Prompt] -> (Copy/Paste) -> [External AI] -> (JSON Output) -> [App Import] -> [Ingestion Service] -> [Valid Item]`

---

## 1️⃣ STEP 1: GOLDEN PROMPT SELECTION
**Goal:** Choose the correct instruction set for the desired clinical item.
*   **Source:** `docs/external_prompts/Golden Prompts/`
*   **Action:** Open the specific markdown file (e.g., `Golden-NGN-BowTie-Item.md`).
*   **Critical Check:** Ensure you are using the latest version of the prompt (check for "Version 4" or "Production Ready" headers).

## 2️⃣ STEP 2: MANUAL PROMPT ENGINEERING
**Goal:** Configure the prompt variables for the specific clinical scenario.
*   **Action:** Copy the *entire* file content.
*   **Variables to Fill:**
    *   `[QUANTITY]`: Usually `1`.
    *   `[FOCUS]`: The clinical topic (e.g., "Pediatric DKA").
    *   `[LEVEL]`: The Difficulty (1-5). Use `5` for Expert.
    *   `[SCORE]`: Target score (e.g., `90`).
*   **Verification:** Ensure no brackets `[]` remain in the variable section.

## 3️⃣ STEP 3: EXTERNAL AI GENERATION
**Goal:** Generate the Raw JSON artifact.
*   **Tools:** ChatGPT-4o, Claude 3.5 Sonnet, or DeepSeek-V3.
*   **Input:** Paste the configured Golden Prompt.
*   **Constraint:** Do *not* add extra conversational text. Just paste and run.
*   **Expected Output:** A cleanly formatted JSON code block.

## 4️⃣ STEP 4: JSON EXTRACTION & SANITY CHECK
**Goal:** Validating the output before bringing it into the system.
*   **Action:** Copy the JSON from the AI's code block.
*   **Visual Checks:**
    1.  **Stem:** Is there a `"prompt"` field? (e.g., "Read the case study...")
    2.  **Difficulty:** Is `"difficulty": 5` (Number), not "Hard"?
    3.  **Structure:** Does the Bow-Tie have 5 Actions / 4 Conditions?
*   *Note:* If these checks fail, regenerate or manually fix the JSON.

## 5️⃣ STEP 5: APPLICATION IMPORT
**Goal:** Introducing the external data to the local environment.
*   **Method A (UI Import):** Paste into the Admin "Import JSON" tool.
*   **Method B (Codebase):** Paste into `src/data/items.ts` or the database seed file.
*   **Trigger:** On UI Import click or App Refresh.

## 6️⃣ STEP 6: INGESTION SERVICE (AUTOMATED)
**Goal:** The system automatically cleans, fixes, and converts the data.
*   **Files Involved:** `src/services/ingestion/ItemIngestionService.ts`
*   **Automated Actions:**
    *   **Normalization:** Coerces strings to numbers (`"5"` -> `5`).
    *   **Safety Conversion:** Converts rich Objects (like History) into HTML Strings if the UI requires strings.
    *   **Defaults:** Injects missing keys that are non-critical.
    *   **Mapping:** Aligns varied keys (e.g., `nurseNotes` -> `nursesNotes`).

## 7️⃣ STEP 7: VALIDATION & RENDERING
**Goal:** Final confirmation of a Production-Ready item.
*   **Process:** The clean data is passed to `ZodSchema` (e.g., `BowTieItemSchema`).
*   **Success State:** The item renders in the `ItemRenderer` component without crashing.
*   **Failure State:** The item renders as an **Error Card** with specific Zod validation messages.
*   **Loop:** If Failure, read the Zod error, fix the JSON in Step 4, and re-import.
