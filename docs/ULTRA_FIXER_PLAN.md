# UltraFixer: The Evolution Plan
**Version:** 1.0 (Alpha)
**Status:** Ready for Implementation

## 1. Executive Summary
The UltraFixer is the **High-Authority Central Neural Hub** of the NGN Generator. It holds "Full System Authority"—meaning it is built to manipulate every internal schema, item type, and metadata field across the entire application ecosystem. It acts as the "Vice-Versa" engine: converting complex clinical errors/requests into finalized, database-ready solutions with zero intervention required for technical sanitization.

## 2. The Core Workflow
### 💡 Step 1: Command & Preference
*   **The Command Bar:** A ChatGPT-style single input.
*   **Memory History:** A list of "Recent Successful Commands" (e.g., "Fix BP trends & add Sepsis rationale").
*   **Active Rules (Global Memory):** Automatic injection of rules derived from previous failures:
    *   *Rule #1:* No generic patient names (e.g., use "L. Smith").
    *   *Rule #2:* Vitals MUST have trends (min 2 readings) for Level 4-5.
    *   *Rule #3:* All rationales must include Clinical Takeaway & Mnemonic.
*   **Authority Switch:** Manual toggle for "Surgical Fix" (Content only) vs "Structural Rebuild" (Follow Golden Prompts strictly).

### 🔍 Step 2: Visual "Track Changes" Preview
*   **Single-Screen Diff:** Renders the item in the actual Student App UI but with "Track Changes" (e.g., green text for additions, red-strike for deletions).
*   **Editability:**
    *   *Direct Edit:* Clicking any text in the preview allows for immediate manual override.
    *   *Follow-up Loop:* A mini-input at the bottom to say "Change the tone to be more technical" or "Increase difficulty."
### 🎯 Step 2.5: Precision Selection Mode (Contextual AI Assistance)
*   **Highlight-to-Action:** Admins can highlight any text within the preview.
*   **Floating AI Toolbar:** A context-sensitive menu appears with "Ask AI" capabilities:
    *   **AI Rewrite:** "Rewrite choice A in a more challenging tone" or "Simplify this for the student."
    *   **AI Generate:** "Generate 2 more distractor options based on this selection" or "Add a nurses note that details this finding."
    *   **AI Fix:** "Fix the grammar/NGN formatting of this selection only."
    *   **Add/Expand:** AI adds more detail or clinical context after the selection.
    *   **Delete:** AI removes the selection and intelligently adjusts surrounding flow.
    *   **Insert Asset:** AI suggests or inserts images/tables/Nurses Notes exactly at that cursor position.
    *   **Apply Golden Rule:** "Force Rule #2 (Vitals Trend) onto this specific time point."
*   **Atomic Preview:** The change is reflected immediately in the "Track Changes" view.

### 🛡️ Step 3: Atomic Health Check & Save (Full System Authority)
*   **The Health Bar:** Shows 🟢 (Ready) or 🔴 (Issues).
*   **The "Vice-Versa" Resolver:** An automated "Nuclear Persistence" layer that:
    *   **ID Lockdown:** Forces preservation of the original `id` or generates a valid UUID if missing.
    *   **Schema Enforcement:** Automatically fills NOT NULL columns (`client_needs`, `status`, `cjmm_step`) with context-aware defaults if the AI omits them.
    *   **Format Normalization:** Ensures all date, status, and type strings are lowercase and DB-compatible.
*   **Direct Fix Button:** A single-click "Nuclear Resolve" to force-fix any validation errors before pushing to Supabase.

## 3. Golden Rule Enforcement (Per Item Type)
The system pulls mandatory constraints from `docs/external_prompts/Golden Prompts/`:

| Item Type | Key Golden Constraints |
| :--- | :--- |
| **Bow-Tie** | 5 Actions (2 correct), 4 Conditions (1 correct), 5 Parameters (2 correct). |
| **Highlight** | Minimum 6-8 spans; `tokenMap` must explain both Correct & Decoys. |
| **Case Study** | Strict 6-screen CJMM flow (Recognize -> Analyze -> ... -> Evaluate). |
| **Calculation** | Formula + Dimensional Analysis in Rationale; forced weight conversion. |
| **Trend** | Minimum 3 sets of vitals/labs showing a clinical progression. |
| **HotSpot** | Image validation and coordinate mapping required. |

## 4. Technical Roadmap
1.  **Phase 1: `UltraFixerModal.tsx` Shell**
    *   Implementation of the Command Bar + Command History storage (Local/Global).
2.  **Phase 2: Visual Diff Renderer**
    *   Integration of `diff-match-patch` or similar for visual "Track Changes."
3.  **Phase 3: The Intelligence Bridge**
    *   Prompts that concatenate: [Current Item] + [Instruction] + [Global Rules] + [Item Specific Golden Template].
4.  **Phase 4: The Atomic Validator**
    *   Implementation of the "Health Bar" with Supabase schema pre-checks.

## 5. Ready to Begin?
I am ready to implement **Phase 1: The UI Shell**. Should I proceed?
