# NGN BOW-TIE: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated, clinically valid, and educationally rich NGN Bow-Tie item. 

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-BowTie-Item.md` | The instruction set sent to the AI. |
| **Zod Schema** | `src/schemas/bowtie.ts` | The strict validator ensuring JSON structure. |
| **Shared Schema** | `src/schemas/shared.ts` | Definitions for Patient, Vitals, Notes, Orders. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Normalizer that fixes/cleans AI output. |
| **Testing** | `test/bowtie_ingest.test.ts` (Dynamic) | Scripts to verify generation quality. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
*Must be numeric and strictly mapped.*

| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `5` (Expert) - mapped from `[LEVEL]` |
| **targetScore** | `number` | `90` - mapped from `[SCORE]` |
| **clientNeeds** | `string` | `"Physiological Integrity"` or `"Safe and Effective Care Environment"` |
| **cjmmStep** | `string` | `"Generate Solutions"` (Fixed for Bow-Tie) |
| **topic** | `string` | `"Sepsis Management"` (Specific Clinical Topic) |

---

## 3. ❓ QUESTION STEM & MECHANICS
*The interactive "Game Board" checks.*

### The Stem (`prompt`)
**Requirement:** A direct clinical directive.  
**Perfect Example:**  
> "Analyze the findings in the nurses' notes and vital signs. Complete the diagram by identifying the potential condition, two appropriate actions, and two parameters to monitor."

### The Structure (`structure`)
**Strict Rule:** 5-4-5 Distribution. No duplicates.

| Zone | Count | Correct | Distractors | Purpose |
|------|-------|---------|-------------|---------|
| **Actions** (Left) | **5** | **2** | 3 | Interventions (Meds, Procedures) |
| **Conditions** (Center) | **4** | **1** | 3 | The Medical Diagnosis / Problem |
| **Parameters** (Right) | **5** | **2** | 3 | Evaluation metrics (Labs, Vitals) |

---

## 4. 🏥 PATIENT CLINICAL DATA (100% DEPTH)
*To achieve 100% realism, the item must include ALL fields below.*

### A. Patient Demographics (`patient`)
- **Name/Initials:** "J.D." (Avoid full names like "John Doe").
- **Age:** Realistic for pathology (e.g., "72" for CHF).
- **Gender:** Mapped correctly ("Male"/"Female").
- **Code Status:** "Full Code" or "DNR" (Adds ethical context).
- **Allergies:** "NKDA" or relevant allergy (e.g., "Penicillin").
- **Weight:** "85 kg" (Crucial for med calculations).

### B. History & Physical (`historyPhysical`) - **ESSENTIAL for Level 4/5**
Must be a **Rich Object**, not just a string.
- **Chief Complaint (CC):** "Shortness of breath."
- **HPI:** detailed narrative (onset, location, duration, characteristics).
- **PMH:** List of comorbidities (e.g., "HTN, Hyperlipidemia, Type 2 DM").
- **Meds:** Home medications list.
- **Social:** Smoking/Alcohol history.
- **ROS:** Review of Systems (Constitutional, Respiratory, Cardio).

### C. Nurses Notes (`nursesNotes`) - **The Timeline**
- **Level 5 Requirement:** Minimum **3 entries**.
- **Progression:** 
    1.  **Admission (0800):** Baseline status.
    2.  **Deterioration (0830):** The trigger event.
    3.  **Criticality (0845):** urgent need for intervention.
- **Format:** Must include `time`, `author`, and `entry`.

### D. Vitals (`vitalSigns`) - **The Trend**
- **Level 5 Requirement:** Minimum **2 sets** (showing change).
- **Completeness:** MUST include BP, HR, RR, Temp, O2, Pain.
- **Example Trend:**
    - Time 1: BP 130/80, HR 88 (Stable)
    - Time 2: BP 90/50, HR 120 (Shock)

### E. Orders & Labs (`orders`, `laboratory`)
- **Orders:** Mix of "Completed" (Done in ED), "Active" (Current), and "Pending".
- **Labs:** High/Low flags (`"H"`, `"L"`) clearly marked.
- **Radiology:** Include only if relevant (e.g., CXR for Pneumonia).

---

## 5. 🎓 RATIONALE (EDUCATIONAL LAYER)
*The "Why" - Must use the 4-Key Schema.*

| Key | Content Requirement |
|-----|---------------------|
| **general** | Define the condition (e.g., "DKA is a metabolic acidosis..."). |
| **pathophysiology** | Mechanism of injury (e.g., "Insulin deficiency leads to ketosis..."). |
| **safetyCheck** | **CRITICAL WARNING** (e.g., "Do NOT start insulin before K+ > 3.3"). |
| **clinicalTakeaway** | The "Golden Rule" (e.g., "Fluids first, then Insulin"). |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] JSON parses without error.
2. [ ] Difficulty is Numeric (5).
3. [ ] Stem is present.
4. [ ] Structure has exact counts (5 Actions, 4 Conditions, 5 Params).
5. [ ] Vitals show a trend (2+ entries).
6. [ ] History is detailed (HPI + PMH).
7. [ ] Rationale is structured (4 parts).
