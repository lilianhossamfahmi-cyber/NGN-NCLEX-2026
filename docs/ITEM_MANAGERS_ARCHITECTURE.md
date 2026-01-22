# NGN Item Managers Architecture Plan (Complete 11-Type System)

## 1. Executive Summary
This document outlines the architectural shift from a monolithic ingestion service to a **Decentralized Manager Pattern**. 
We will implement **11 distinct Item Managers**, one for each NGN item type. 

**Core Philosophy:** Each Manager is the "CEO" of its item type. It is responsible for:
1.  **Ingestion & Repair:** Fixing broken JSON and filling AI gaps.
2.  **Structural Integrity:** Preventing "Ghost Keys," "Disconnect Data," and "Layout Shifts."
3.  **Rendering Prep:** Formatting data specifically for the UI components.
4.  **Grading Logic:** Encapsulating the complex partial-credit scoring rules (e.g., +/- scoring vs. 0/1).
5.  **Feedback Loop:** identifying recurring errors to update the associated **Golden Prompts**.
6.  **Conversion Capability:** Enabling profound item transformations (e.g., BowTie -> Case Study).
7.  **Visual Orchestration:** Managing the generation and rendering of Charts, Tables, and Medical Imagery (ECG/X-Ray).

---

## 2. The 11 Item Managers & Their Missions

### 1. 🏥 CaseStudyManager (The Orchestrator)
*   **Target:** `case-study-6-screen`
*   **Mission:** Ensure the "Clinical Story" is consistent across 6 evolving screens.
*   **Solved Issues:**
    *   *Data mutability:* Prevents patient age/name from changing between Screen 1 and Screen 6.
    *   *Step mismatch:* Enforces the CJMM order (Recognize -> Analyze -> Prioritize -> Generate -> Take Action -> Evaluate).
    *   *Missing tabs:* Auto-generates placeholder text for "Nurses Notes" if the AI forgets them in later screens.

### 2. 🎀 BowTieManager
*   **Target:** `bowtie-standalone`
*   **Mission:** Manage the complex relationship between center condition, actions, and parameters.
*   **Solved Issues:**
    *   *Pool Exhaustion:* Ensures there are enough distractors in the "pool" so the UI doesn't crash.
    *   *Logic Conflicts:* Validates that the "Correct Actions" actually make sense for the "Correct Condition" (using basic heuristic mapping).
    *   *Legacy formatting:* Converts old nested `structure.bowtie` JSON into the clean flat format.

### 3. 📈 TrendManager
*   **Target:** `trend-standalone`
*   **Mission:** Manage time-series data and visual rendering configs.
*   **Solved Issues:**
    *   *Data Sparsity:* If AI gives only 1 data point, this manager extrapolates a 3-point trend (Previous, Current, Projected).
    *   *Visual Scaling:* Calculates Y-axis min/max automatically so charts don't look flat or squashed.
    *   *Table Generation:* Auto-formats the HTML table fallback for accessibility.

### 4. 🔦 HighlightManager
*   **Target:** `highlight-text`
*   **Mission:** Text tokenization and answer key alignment.
*   **Solved Issues:**
    *   *Ghost Keys:* The #1 historical issue where `correctId` points to a non-existent span. This manager acts as a compiler, re-tokenizing the text and guaranteeing every ID exists.
    *   *Span Overlap:* Merges adjacent spans to prevent UI clicking bugs.

### 5. 🔢 CalculationManager
*   **Target:** `calculation`
*   **Mission:** Numeric precision and unit handling.
*   **Solved Issues:**
    *   *Range ambiguity:* Converts "10-20" strings into `{ min: 10, max: 20 }` objects for strict grading.
    *   *Unit Mismatch:* Detects if the Prompt asks for "mL/hr" but the Answer is in "gtt/min" and flags it.
    *   *Formatting:* Standardizes decimal places based on clinical safety rules (e.g., leading zeros for doses < 1).

### 6. 🔲 MatrixManager
*   **Target:** `matrix-mr` (and variations)
*   **Mission:** Grid logic and row/column coherence.
*   **Solved Issues:**
    *   *Radio vs. Checkbox:* validaties if it's "Multiple Response" (checkbox) or "Single Response" (radio) per row.
    *   *Header Alignment:* Fixes the common AI error of mismatching column headers with row data lengths.

### 7. 📑 OrderedResponseManager
*   **Target:** `ordered-response` (Drag & Drop)
*   **Mission:** Sequence logic.
*   **Solved Issues:**
    *   *Impossible Orders:* Checks for logically equivalent steps that shouldn't be penalized if swapped.
    *   *UI Overflow:* Truncates/summarizes extremely long step descriptions that break the drag-drop UI card.

### 8. 🔽 ClozeDropDownManager
*   **Target:** `cloze-dropdown`
*   **Mission:** Sentence parsing and option mapping.
*   **Solved Issues:**
    *   *Orphan Dropdowns:* Ensures every `%{id}` in the text has a corresponding options list.
    *   *Context Fallback:* If the sentence is "The nurse should admin %{d1}", auto-fills the dropdown with clinically relevant distractors if missing.

### 9. 🤏 DropClozeManager
*   **Target:** `drop-cloze` (Drag-and-Drop into text)
*   **Mission:** Token management for drag targets.
*   **Solved Issues:**
    *   *Token Pool:* Ensures the "drag source" contains both correct answers AND distractors (often AI forgets distractors).
    *   *Sentence Flow:* Validates that the sentence remains grammatically correct when options are inserted.

### 10. ☑️ MultipleResponseManager
*   **Target:** `multiple-response-sata`
*   **Mission:** Selection rules and Partial Credit (Scoring Rule +/-).
*   **Solved Issues:**
    *   *Min/Max Rules:* Enforces "Select N" logic if specified.
    *   *All-Correct Trap:* Flags items where ALL options are correct (technically allowed but poor pedagogy).

### 11. 🎯 HotSpotManager
*   **Target:** `hot-spot`
*   **Mission:** Image coordinate systems and responsiveness.
*   **Solved Issues:**
    *   *Blind Clicking:* Validates that the `targetArea` (x,y, radius) is actually within the image bounds (0-100%).
    *   *Aspect Ratio:* Checks image metadata to ensure the coordinates scale correctly on mobile vs. desktop.

---

## 3. The Clinical Data Standardizer (CDS) - Phase 1.5

To answer the critical need for "High Standards" in clinical fields (Nurses Notes, H&P, Vitals, Labs, Radiology, Orders), we create a shared **Clinical Data Standardizer** service.

**Responsibilities:**
1.  **Normalization:** Converts `bp: "120/80"` -> `bp: { sys: 120, dia: 80 }` for easier trending logic.
2.  **Case Correction:** "mg" -> "mg", "po" -> "PO", "bid" -> "BID".
3.  **Missing Field Injection:**
    *   If `Labs` are missing but mentioned in the `History`, extract them.
    *   If `Radiology` is empty, generate a "Pending" or "Normal" result based on the diagnosis.
4.  **Rationale Standardization:**
    *   Ensures `rationale` object always has {`clinicalLogic`, `strategy`, `knowledge`, `optionReview`}.

---

## 4. The Expert Grading Engine (Phase 1.6)

To meet the highest NCSBN standards, we implement **Item-Type Specific Scoring Rules**. This is not just "Right or Wrong" — it's sophisticated psychometrics.

**Scoring Models We Will Support:**
1.  **+/- Scoring (Plus/Minus):**
    *   *Used for:* SATA, Highlighting, Matrix (Multi-Response).
    *   *Logic:* +1 for correct selection, -1 for incorrect selection. Min score is 0 (no negative total).
    *   *Why:* Rewards knowledge but penalizes guessing.
2.  **0/1 Scoring (All or Nothing):**
    *   *Used for:* BowTie (Condition center), Single Response.
    *   *Logic:* Must get it perfect to get the point.
3.  **Rational scoring (Rationale):**
    *   *Used for:* Dyads/Triads.
    *   *Logic:* Must get both parts (Cause & Effect) correct to score.
4.  **Reference Range Tolerance:**
    *   *Used for:* Calculation.
    *   *Logic:* Allows answers within ±X% margin (e.g., 125 vs 125.4).

---

## 5. Advanced Clinical Intelligence (The "Expert" Features)

Since you asked for "What else can be added" from an expert perspective, adding these will put your app years ahead of competitors:

### A. 🚩 "Killer" Decoy Detection
*   **The Feature:** The Managers analyze the distractors generated by AI.
*   **The Logic:** It checks if a distractor is *actually dangerous* (e.g., giving potassium to a renal failure patient) vs merely incorrect.
*   **The Value:** We can tag these as "Safety Violations" in the student report, teaching them not just *what is right*, but *what is deadly*.

### B. 🧬 Dynamic Lab Values (The "Alive" Patient)
*   **The Feature:** Instead of static numbers, the `ClinicalDataStandardizer` can "fuzz" values slightly.
*   **The Logic:** Valid range for Sodium is 135-145. If the case is "dehydration", the Manager sets Na+ to 152. If re-generated, it might set it to 155.
*   **The Value:** Students can practice the same case multiple times without memorizing exact numbers.

### C. � Inter-Screen Dependency (Adaptive Case Studies)
*   **The Feature:** Screen 3 changes based on Screen 2.
*   **The Logic:** If the student orders "Lasix" in Screen 2, the Vitals in Screen 3 show "Urine Output Increased" and "BP Decreased".
*   **The Value:** This simulates *real* nursing practice where interventions have consequences. (High complexity, high reward).

---

## 6. System Integration Map

Each Manager will touch key parts of the system. This is the **Integrity Web**:

### A. The Service Layer (`src/services/managers/` )
- `AbstractItemManager.ts`
- `ItemManagerFactory.ts`
- `[Type]Manager.ts` (11 implementations)
- `ClinicalDataStandardizer.ts`
- **`GradingEngine.ts`** (New Rule Sets)

### B. The Pipeline Hook (`src/services/UnifiedDataPipeline.ts`)
```typescript
const manager = ItemManagerFactory.getManager(item.type);
const repairedItem = await manager.repair(rawItem);
const validatedItem = manager.validate(repairedItem);
```

### C. The Grading Hook
```typescript
const gradingResult = ItemManagerFactory.getManager(type).grade(userAns, key);
// Returns: { score: 2, maxScore: 4, feedback: "You missed 2 safety checks." }
```

---

## 7. Implementation Priority Plan

### Phase 1: The Foundation (Core)
1.  Define the `ItemManager` Interface.
2.  Implement `AbstractItemManager`.
3.  Implement `ItemManagerFactory`.
4.  Implement `ClinicalDataStandardizer` & `GradingEngine` base.

### Phase 2: The "Troublemakers" (High Priority)
1.  **BowTieManager**: Fix pool/options issues.
2.  **HighlightManager**: Fix text/span offset bugs.
3.  **CaseStudyManager**: Fix data consistency.

### Phase 3: The "Specialists" & Conversion Logic
1.  Implement remaining managers.
2.  Add `ItemConverter` service.

### Phase 4: Full Wiring
1.  Rewire `UnifiedDataPipeline` to use the Factory.
2.  Rewire `ItemRenderer` to use Manager-formatted data.
