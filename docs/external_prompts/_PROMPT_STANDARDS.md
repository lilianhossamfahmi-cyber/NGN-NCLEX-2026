# NGN Prompt Standards (V3)

## The Golden Rules for Prompt Engineering
All NGN Item Prompts must adhere to these standards to ensure the generated JSON is valid, safe, and render-compatible.

### 1. Unified JSON Structure
All prompts must request data in the "Golden Schema" format:
*   `type`: Item type string
*   `content`:
    *   `patient`: Object (Name, Age, History)
    *   `vitals`: Array of objects (7 distinct fields)
    *   `orders`: Array of objects
    *   `labs`: Array of objects
    *   `rationale`: Rich object (CoreConcept, Trap, GoldenRule)
    *   `structure`: The renderable item payload

### 2. Critical Constraints per Type
*   **Drop-Cloze**: MUST use `%{id}` text format. NEVER use `sentences` array.
*   **Trend**: MUST provide at least 3 time points in `vitals` array.
*   **Highlight**: MUST use `<span id='hX'>` tags in strict HTML strings.
*   **Matrix**: MUST use `rows` and `columns` with `correctColumnId` (singular) or `correctColumnIds` (plural).

### 3. Rationale Requirements
Rationale is not just text. It is a structured learning object:
*   `coreConcept`: Short title.
*   `difficulty`: Object with `score` (0-100) and `level` (1-5).
*   `mnemonic`: Object with Title/Content/Explanation.
*   `goldenRule`: One-sentence takeaway.

### 4. Integrity Rules
*   **NO Markdown**: Output must be raw JSON ` ```json ` blocks only.
*   **NO Trailing Commas**: Strict JSON syntax.
*   **NO Comments**: Pure data.

### 5. Validation
Before deploying a prompt:
1.  Check for `content.patient` object.
2.  Check for `content.vitals` array.
3.  Check that Type-Specific fields exist in `structure`.

### 6. System Acceptance Criteria (SAC)
For an item to be accepted into the Production Bank, it must pass the following Automated & Manual checks:

#### A. JSON Integrity (Automated)
*   [ ] **Parse Check**: Input string must parse as valid JSON without errors.
*   [ ] **Type ID Match**: The `typeId` field must match one of the allowable system types (e.g., `matrix`, `bow-tie`, `trend`).

#### B. Schema Compliance (Automated)
*   [ ] **Metadata Exists**: `metadata` object contains `title`, `authorId`, `status`.
*   [ ] **Pedagogy Exists**: `pedagogy` object contains `difficultyLevel` (1-5), `bloom`, `clinicalFocus`.
*   [ ] **Content Structure**: `content` object contains the specific fields required for that `typeId`.
    *   *Matrix*: `rows`, `columns`, `answers`.
    *   *Drop-Cloze*: `text` with `%{}` tokens or similar standard.
    *   *Highlight*: `text` with `id` tags and `tokens` array.

#### C. Clinical Logic (Manual/Review)
*   [ ] **Distractor Quality**: Distractors are plausible but clearly incorrect.
*   [ ] **Key Verification**: The indicated correct answer is actually clinically correct.
*   [ ] **Rationale Alignment**: The provided `rationale` explains *why* the correct answer is right and *why* distractors are wrong.
*   [ ] **Difficulty Alignment**: The complexity matches the assigned `difficultyLevel` (1=Recall, 5=Synthesis).

#### D. Batch Constraints (If generating batches)
*   [ ] **Uniqueness**: No duplicate scenarios or exact copy-paste text within the batch.
*   [ ] **Distribution**: Accurate breakdown (e.g., all 5 difficulty levels represented).
