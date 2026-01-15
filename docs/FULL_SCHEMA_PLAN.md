# MASTER SCHEMA DEFINITION PLAN (RADICAL ARCHITECTURE)

This document defines the strict validation rules and ingestion pipeline strategy for the "Ironclad Pipeline" architecture. It is designed to permanently resolve the recurring historical issues of rendering failures, phantom types, and low-quality content.

## 🔴 Historical Issues vs. Radical Solutions

| Historical Issue | Root Cause | **Radical Solution (Zod Pipeline)** |
| :--- | :--- | :--- |
| **"Blank Item" / White Screen** | Renderer receives `type: "MATH"` or `type: "case-study"` (mislabeled) and falls through to default. | **Strict Enum Validation:** Ingestion Layer acts as a firewall. It converts `case-study` (with calc fields) to `calculation` *before* the app sees it. The App only accepts `z.enum(['calculation', ...])`. |
| **"Missing Clinical Data"** | AI generates 1 note for a Level 5 item, or "See Chart" placeholders. | **Refinement Rules (`.refine`):** Schema rejects items with < 2 notes if `diff > 3`. Rejects strings containing "See Chart". |
| **"Format Chaos" (Drop-Cloze)** | AI switches between `sentences` array and raw text with dropdowns. | **Canonical Structures:** We define *one* valid Drop-Cloze structure. The Ingestion Layer *migrates* alternate formats into the Canonical format. Renderers become "dumb." |
| **"Ghost Inputs"** | Renderers try to render generic props that don't exist, crashing or showing nothing. | **Strict Shapes:** `CalculationSchema` strictly requires `units`. If missing, validation fails, and the pipeline inserts a default or flags error. |

---

## 🟢 1. The Ingestion Pipeline Workflow
The UI (ItemRenderer) will **NO LONGER** sanitize data. It expects perfection.

1.  **Raw Input**: AI generates JSON (potentially messy).
2.  **The Normalizer (Migrator)**:
    *   Fixes Type Casing (`Calculation` -> `calculation`).
    *   Auto-detects Mislabeling (e.g., the `case-study` -> `calculation` fix from today).
    *   Unifies Structures (e.g., converts all HotSpots to `normalized_hotspot` format).
3.  **The Validator (Zod Schema)**:
    *   Checks Type matches Content.
    *   Checks Completeness (Notes, H&P).
    *   Checks "Banned Words".
4.  **The Repairer**:
    *   If units missing -> default "units".
    *   If ID missing -> UUID.
5.  **Output**: **Blessed Item** (100% Safe to Render).

---

## 🔵 2. Semantic Validation Rules (Quality Control)

These are logical rules enforced by `zod.refine()`.

### A. Completeness Rules
*   **Difficulty Scaling:**
    *   If `difficulty >= 4`: `nursesNotes.length` MUST be >= 2.
    *   If `difficulty >= 4`: `vitalSigns.length` MUST be >= 2 (Trend).
*   **Prompt Richness:**
    *   `prompt` length must be > 10 chars (No "Calculate rate." allowed).

### B. "Lazy AI" Prevention
*   **Banned Placeholders:**
    *   Reject: "See Admitting Note", "Refer to Chart", "Patient Data Restricted", "As above".
    *   Action: Ingestion layer detects these and triggers a "Regenerate Clinical Data" fallback.

### C. Logical Integrity
*   **Calculation:** `correctValue` MUST be a finite number.
*   **SATA:** `options` MUST have at least 1 correct AND at least 1 incorrect (cannot be All or None).
*   **Bow-Tie:** `center`, `left`, `right` MUST have distinct correct IDs.

---

## � 4. Advanced Integrity Checks (The "Deep Search" Logic)

These rules prevent logical paradoxes and "impossible" questions.

### A. Referential Integrity (The "Broken Link" Check)
*   **Single/Multi Choice:** The `correctId` (or IDs) MUST exist within the `options` array.
    *   *Failure:* "Correct answer 'C' is not in options [A, B]." -> **REJECT**
*   **Cloze/Drop-Down:** Every `%{id}` placeholder in the text MUST have a corresponding entry in the `blanks` or `dropdowns` object.
    *   *Failure:* "Text contains %{q1} but dropdowns only allows q2." -> **REJECT/REPAIR**
*   **Bow-Tie:** The `center` condition cannot be "None" if `left` (Actions) implies an emergency.

### B. The "Text Unifier" (i18n Killer)
*   **Problem:** AI mixes `"text": "Hello"` and `"text": { "en": "Hello" }`.
*   **Solution:** The Ingestion Migrator detects any object with an `en` key and flattens it to a simple string. The Schema **ONLY** accepts `z.string()`.
*   **Result:** Renderers never see `[object Object]`.

### C. The "Fail-Safe" UI Protocol
*   If Ingestion Fails (and Repair Fails), the Pipeline returns a special `ErrorItem`.
    *   `type`: `'error'`
    *   `message`: "Validation Failed: Missing Unit Label"
    *   `raw`: (The original weird JSON)
*   **Renderer Behavior:** Displays a friendly "Generation Error" card with a "Retry" button. No white screen. No crash.

### D. Metadata Consensus (Truth Enforcement)
*   **Difficulty Sync:** The Pipeline calculates difficulty based on structure (e.g., Matrix is hard-coded Level 4). It **Overwrites** any hallucinated difficulty (e.g., AI says "Matrix Level 1") to ensure scoring consistency.
*   **Trend Sync:** If `vitalSigns` has < 2 timepoints, force `type` to `table` (static), regardless of what AI requested.

---

## 🌑 6. Expert Psychometric Validation (The "Pearson Vue" Layer)

This layer ensures items are not just valid code, but valid *exams*.

### A. JCIA & NCLEX Style Enforcer
*   **Vocabulary Audit:**
    *   `patient` IS BANNED -> Auto-replace with `client`.
    *   `doctor` IS BANNED -> Auto-replace with `healthcare provider`.
    *   `Tylenol` (Brand) -> Auto-replace with `Acetaminophen` (Generic).
*   **Gender Neutrality:**
    *   Checks for unnecessary gendered pronouns ("he/she") unless context (OBGYN/Testicular) requires it.

### B. Cognitive Load & Bias Detection
*   **Distractor Analysis (Guessing Prevention):**
    *   Calculates word count of all options.
    *   **FAIL:** If Correct Answer is > 50% longer than average distractor (Test-wise clue).
    *   **FAIL:** If Correct Answer is significantly more detailed/specific than distractors.
*   **Ideal Stem Length:**
    *   **Warn:** If length < 15 words (Likely context-poor).
    *   **Warn:** If length > 80 words (Cognitive overload, strictly formatting issue).

### C. Bayesian Pass Probability (Real Math)
*   **The Problem:** Arbitrary numbers in dashboard.
*   **The Logic:** Pipeline calculates `P(Correct)` using a simplified Item Response Theory (IRT) model:
    *   `P(θ) = c + (1 - c) / (1 + e^(-a(θ - b)))`
    *   `b` (Difficulty): Mapped from Item Level (1-5).
    *   `c` (Guessing): 1 / Number of Options.
    *   `a` (Discriminator): Inferred from Cognitive Level (Analysis > Recall).
*   **Result:** The item gets a `metadata.passProbability` float (e.g., `0.64`) derived from real psychometric principles.

### D. Client Needs & CJMM Alignment
*   **Content-Tag Validation:**
    *   If Tag = `Pharmacological`: Text MUST match Drug DB Regex / keywords ("dose", "administer").
    *   If Tag = `Management of Care`: Text MUST match Leadership keywords ("delegate", "priority").
    *   **Action:** Auto-Retag if the content does not match the metadata.
*   **CJMM Step Verification:**
    *   If `cjmmStep` = `Generate Solutions`, the item MUST be a `matrix` or `bow-tie` (cannot be `highlight`).
    *   **Action:** Flag for manual review if Item Type implies a different cognitive step than tagged.

---

## 🌕 7. Deep Clinical Reasoning Validation (The "Why" Layer)

This layer validates the *logic* and *educational value* of the item.

### A. Rationale Structure Enforcer
*   **The Issue:** Wall-of-text explanations are hard to learn from.
*   **The Rule:** Rationale MUST be an Object, not a String.
    *   `general`: The core concept explanation.
    *   `pathophysiology`: The biological mechanism.
    *   `safetyCheck`: Key safety warnings (e.g. "Do not push IV K+").
    *   `optionAnalysis`: Array mapping EACH ID to specific feedback.
    *   **Migration:** If AI outputs a string, use Secondary LLM (cheap) to split it into fields.

### B. Logical Alignment (Reasoning vs Answer)
*   **Keyword Intersection Check:**
    *   Extract Keywords from Correct Answer (e.g. "Insulin").
    *   Extract Keywords from Rationale (e.g. "Hyperkalemia").
    *   **Action:** If keywords imply contradictory logic (e.g. Rationale discusses Hypoglycemia but Answer treats Hyperglycemia), **FLAG for Review**.

### C. CJMM "Layering" Validation
*   **Action Verb Analysis:**
    *   Layer 1 (Recognize): Text must be OBSERVATIONAL ("Assess", "Findings").
    *   Layer 3 (Prioritize): Text must be COMPARATIVE ("Most important", "Immediate").
    *   Layer 4 (Action): Text must be INTERVENTIONAL ("Administer", "Call").
    *   **Action:** Auto-Correct the `cjmmLayer` tag if the text verbs do not match the metadata tag.

### D. Remediation Linkage
*   **Concept Taxonomy:**
    *   Every item MUST be tagged with a canonical `remediationId` (e.g. `Cardio.HeartFailure.Diuretics`).
    *   **Action:** If missing, Ingestion Service infers it from the `correctAnswer` + `topic` fields.

---

## 🟡 8. Strict Schema Definitions (The Shape)

### Calculation Item
**Canonical Shape:**
*   `type`: `z.literal('calculation')`
*   `correctValue`: `z.number()`
*   `units`: `z.string()` (The Renderer needs this to show the label)
*   **Migration Rule:** If `inputLabel` exists, map to `units`.

### Hot Spot Item
**Canonical Shape:**
*   `type`: `z.literal('hot-spot')`
*   `media`: `z.object({ url: z.string(), ... })`
*   `areas`: `z.array(AreaSchema)`
*   **Migration Rule:** If `coords` is string "x,y,r", parse to integer array.

### Drop-Cloze Item
**Canonical Shape:**
*   `type`: `z.literal('drop-cloze')`
*   `text`: `z.string()` (The raw text with placeholders `%{id}`)
*   `dropdowns`: `z.record(z.string(), z.array(z.string()))` (Map of ID -> Options)
*   **Migration Rule:** If AI provides `sentences` array, join them into `text` and extract dropdowns.

### ... [Other 9 Item Types follow same pattern] ...

---

## 4. Next Actions
1.  **Install Zod.**
2.  **Create `src/schemas` directory.**
3.  **Implement `CalculationSchema` first** (as Proof of Concept).
4.  **Create `IngestionService`** to wrap the existing logic but use the Schema.
