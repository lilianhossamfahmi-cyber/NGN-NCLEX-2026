# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume Matrix Generation
## Topic: Cardiology

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct Matrix / Extended Multiple Response items focused strictly on **Cardiology**. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `matrix` (Multiple Choice / Response grid) items.
2. **Topic**: All items must be **Cardiology** focused (e.g., Heart Failure, MI, Dysrhythmias, Hypertension, Angina).
3. **Differentiation**:
   - **Level 1 (Recall/Basic)**: Focus on normal vs abnormal findings, basic anatomy/physiology.
   - **Level 2 (Comprehension)**: Focus on understanding relationships (e.g., this symptom causes this effect).
   - **Level 3 (Application)**: Standard RN level. Correctly identifying interventions for a set of cues.
   - **Level 4 (Analysis)**: Subtle cues, prioritization matrices, or distinguishing between two similar conditions (e.g., Left vs Right sided HF).
   - **Level 5 (Synthesis/Evaluation)**: Complex scenarios, multisystem involvement, or evaluating outcomes of treatments in unstable patients.
4. **Validation**: Ensure strict adherence to the **Golden-NGN-Matrix-Item.md** schema. Every item must have `id`, `pedagogy`, `content` (with `rows`, `columns`), and `rationales`.
5. **No Duplicates**: Ensure each of the 25 scenarios is unique.

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic Knowledge*

**Item 1.1**
- **Focus**: Cardiac Structures & Blood Flow
- **Topic**: Normal Anatomy
- **Matrix Type**: "Select the chamber associated with..." (Columns: Left Atrium, Right Ventricle, etc.)

**Item 1.2**
- **Focus**: Vital Sign Terminology
- **Topic**: Definitions (Bradycardia vs Tachycardia)
- **Matrix Type**: "Match the heart rate to the term."

**Item 1.3**
- **Focus**: Basic Medication Classes
- **Topic**: Drug Categories
- **Matrix Type**: "Identify if the drug is a Beta Blocker or Diuretic."

**Item 1.4**
- **Focus**: Common Symptoms
- **Topic**: Chest Pain Basics
- **Matrix Type**: "Indicate if the symptom is typical of cardiac or non-cardiac origin (basic)."

**Item 1.5**
- **Focus**: Diet Basics
- **Topic**: Low Sodium Foods
- **Matrix Type**: "Select Allowed vs Restricted foods for a cardiac diet."

---

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension / Understanding*

**Item 2.1**
- **Focus**: Heart Failure Symptoms
- **Topic**: Left vs Right HF Symptoms
- **Matrix Type**: "Classify the symptom as Left-Sided or Right-Sided Failure."

**Item 2.2**
- **Focus**: ECG Rhythms
- **Topic**: Rhythm Identification
- **Matrix Type**: "Match the ECG characteristic to the rhythm (Sinus Tach vs Sinus Brady)."

**Item 2.3**
- **Focus**: Medication Effects
- **Topic**: ACE Inhibitors
- **Matrix Type**: "Identify Expected Effect vs Adverse Effect."

**Item 2.4**
- **Focus**: Diagnostic Tests
- **Topic**: Troponin / BNP / Lipids
- **Matrix Type**: "Indicate what each test primarily measures (Heart Damage vs Fluid Overload)."

**Item 2.5**
- **Focus**: Risk Factors
- **Topic**: Modifiable vs Non-Modifiable
- **Matrix Type**: "Classify risk factors for CAD."

---

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application / Standard NCLEX*

**Item 3.1**
- **Focus**: Angina Management
- **Topic**: Stable Angina Interventions
- **Matrix Type**: "Indicate for each intervention if it is Indicated or Contraindicated."

**Item 3.2**
- **Focus**: Post-Cath Care
- **Topic**: Monitoring Complications
- **Matrix Type**: "Assessment Findings: Require Immediate Notification vs Continue Monitoring."

**Item 3.3**
- **Focus**: Digoxin Toxicity
- **Topic**: Signs & Symptoms
- **Matrix Type**: "Identify if the finding is a sign of Toxicity or Expected Outcome."

**Item 3.4**
- **Focus**: Hypertension Management
- **Topic**: Patient Education
- **Matrix Type**: "Evaluate statments: Understanding vs Needs Further Teaching."

**Item 3.5**
- **Focus**: Atrial Fibrillation
- **Topic**: Treatment Goals
- **Matrix Type**: "match treatment to goal (Rate Control vs Anticoagulation)."

---

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis / Prioritization*

**Item 4.1**
- **Focus**: Acute MI Evolution
- **Topic**: STEMI vs NSTEMI
- **Matrix Type**: "Differentiate ECG changes and enzymatic patterns."

**Item 4.2**
- **Focus**: Shock differentiation
- **Topic**: Cardiogenic vs Hypovolemic Shock
- **Matrix Type**: "Analyze hemodynamic values (CVP, PCWP, CO): Consistent with Cardiogenic or Hypovolemic?"

**Item 4.3**
- **Focus**: Complex Arrhythmias
- **Topic**: Heart Blocks (2nd Type I, 2nd Type II, 3rd)
- **Matrix Type**: "Match the description/treatment to the specific block type."

**Item 4.4**
- **Focus**: Endocarditis vs Pericarditis
- **Topic**: Symptom Analysis
- **Matrix Type**: "Distinguish clinical features (Friction rub vs Vegetation/Murmur)."

**Item 4.5**
- **Focus**: Medication Interactions
- **Topic**: Polypharmacy in Elderly Cardiac Patient
- **Matrix Type**: "Risk Analysis: Potential Interaction vs Safe Combination."

---

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis / Evaluation / Critical Care*

**Item 5.1**
- **Focus**: Decompensated Heart Failure
- **Topic**: Medication Titration
- **Matrix Type**: "Evaluate response to Nitroglycerin/Dobutamine: Effective vs Ineffective/Adverse."

**Item 5.2**
- **Focus**: Post-CABG Complications
- **Topic**: Tamponade vs Graft Failure
- **Matrix Type**: "Analyze distinct cues to differentiate these two emergencies."

**Item 5.3**
- **Focus**: Hypertensive Crisis (Emergency vs Urgency)
- **Topic**: Organ Damage Assessment
- **Matrix Type**: "Assess findings for End-Organ Damage evidence (Renal, Neuro, Retinal)."

**Item 5.4**
- **Focus**: Code Blue / ACLS
- **Topic**: H's and T's Analysis
- **Matrix Type**: "Given a scenario, identify if the intervention addresses Hypoxia, Hypovolemia, or Hyperkalemia."

**Item 5.5**
- **Focus**: VAD / Transplant
- **Topic**: Left Ventricular Assist Device Complications
- **Matrix Type**: "Troubleshooting Alarms: Low Flow vs High Power vs Suction."
