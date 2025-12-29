# NGN Item Difficulty Rating System (1-5 Scale)

This document defines the standard difficulty rating system used by the Master NGN Generator. The scale ranges from **Level 1 (Novice/Recall)** to **Level 5 (Expert/Synthesis)**, aligning with the **NCSBN Clinical Judgment Measurement Model (CJMM)** and **Bloom's Taxonomy**.

---

## 📊 Quick Reference Matrix

| Level | Label | Cognitive Demand | Cue Ambiguity | Clinical Risk | Typical Item Types |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Recall / Basic** | Knowledge Retrieval | Low (Obvious cues) | Low (Stable patient) | Single Choice, Matrix (Basic) |
| **2** | **Application** | Apply Rule/Process | Low-Moderate | Low-Moderate | S.A.T.A., Calculation |
| **3** | **Analysis (NGN Std)** | Connect Cues (Trends) | Moderate (Some noise) | Moderate (Acute change) | Highlight, Trend, Cloze |
| **4** | **Synthesis** | Prioritize & Plan | High (Conflicting cues) | High (Unstable) | Bow-Tie, Ordered Response |
| **5** | **Evaluation (Expert)** | Managing Complexity | Very High (Subtle/Hidden) | Critical (Life/Death) | Complete Case Study (6-Screen) |

---

## 🧠 Detailed Level Definitions

### Level 1: Recall & Foundational Knowledge (Novice)
**Focus:** Testing independent facts, definitions, or standard values without context.
*   **Cognitive Process:** Remember, Understand.
*   **Data Presentation:** minimal variables.
*   **Ambiguity:** None. The answer is either right or wrong based on a textbook fact.
*   **Example:** Identifying the normal range for serum potassium.
*   **Common Trap:** None; purely memory-based.

### Level 2: Application & Comprehension (Advanced Beginner)
**Focus:** Applying a known rule, protocol, or formula to a straightforward scenario.
*   **Cognitive Process:** Apply.
*   **Data Presentation:** A single clinical snapshot (e.g., Vitals + One Symptom).
*   **Ambiguity:** Low. Cues point clearly to one protocol.
*   **Example:** Calculating a pediatric dosage based on weight; Identifying isolation precautions for a patient with Influenza.
*   **Common Trap:** Calculation errors or mixing up similar protocols.

### Level 3: Analysis & Logic (Competent - **NGN Standard**)
**Focus:** Connecting multiple pieces of data (Trends) to identify a problem. Distinguishing relevant from irrelevant data.
*   **Cognitive Process:** Analyze.
*   **Data Presentation:** Multiple data sources (chart, labs, history) usually over time.
*   **Ambiguity:** Moderate. Includes "distractor" cues that appear abnormal but are irrelevant.
*   **Example:** Reviewing a 24-hour vitals trend to recognize early signs of sepsis vs. dehydration.
*   **Common Trap:** "Treating the Number" (reacting to one value) rather than the trend; Getting distracted by red herrings.

### Level 4: Synthesis & Prioritization (Proficient)
**Focus:** Managing conflicting priorities and determining the "Best" or "First" action among multiple plausible options.
*   **Cognitive Process:** Evaluate, Create (Plan).
*   **Data Presentation:** Complex, multi-system patient with competing needs (e.g., CHF + Renal Failure).
*   **Ambiguity:** High. Multiple cues may conflict (e.g., need for fluids vs. risk of overload).
*   **Example:** determining the priority intervention for a patient with new-onset stroke symptoms while managing a hypertensive crisis. Bow-Tie items.
*   **Common Trap:** "Fixing" the problem before "Assessing" safety; Prioritizing non-urgent tasks.

### Level 5: Evaluation & Complex Judgment (Expert)
**Focus:** High-stakes decision making in uncertain/dynamic environments. Evaluating outcomes of interventions and modifying plans.
*   **Cognitive Process:** Evaluate, Clinical Judgment.
*   **Data Presentation:** Evolving scenario (Case Study) where identifying the *wrong* cue leads to patient harm.
*   **Ambiguity:** Very High. Key cues are subtle (e.g., a slight change in LOC) or hidden in "Notes".
*   **Example:** A 6-Screen Case Study tracking a patient from admission through deterioration to discharge, requiring adjustment of the care plan based on partial responses to treatment.
*   **Common Trap:** The "Fatal Flaw" (missing a subtle safety contraindication); Failure to rescue.

---

## 🛠️ Usage in AI Generation

When configuring the Generator:

*   **Difficulty 1-2**: Produces items with short stems, fewer distractors, and direct "textbook" rationales.
*   **Difficulty 3**: (Default) Introduces "Noise" (distractor data) and requires trending.
*   **Difficulty 4-5**: Increases the "Cognitive Load" by adding multiple comorbidities, subtle contraindications, and higher-stakes "Failure to Rescue" traps.

---

## ⚠️ Consistency Rules
*   **Dosage Calculations**: Typically Level 2 (unless multi-step titration, then Level 3).
*   **Case Studies**: By definition Level 3+.
*   **Bow-Tie**: Inherently Level 3 or 4 due to the requirement to link Condition -> Actions -> Parameters.
