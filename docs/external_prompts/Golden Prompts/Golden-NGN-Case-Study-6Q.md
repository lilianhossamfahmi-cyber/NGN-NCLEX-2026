# GOLDEN NGN CASE STUDY GENERATOR (v3.2 - FIXED)

## 📌 PARAMETERS (FILL FIRST)
text
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 5
[SCORE]    = 90      (CRITICAL: Use 85-95 for Expert/Level 5. Use 65-75 for Synthesis/Level 4)


## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer & Clinical Nurse Educator
CONTEXT: Educational Exam Simulation Only
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Complete 6-Screen NGN Case Study
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- All keys and string values: Double quotes only.
- NO trailing commas after last item in any array/object.
- Newlines inside strings: Escape as "\n".
- HTML attributes inside strings: Single quotes (e.g., style='color:red').
- All HTML tags must close properly.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "NEURO-CS-99F1"`
- **Topic Mapping:** Map the [FOCUS] to one of: Cardiology, Respiratory, etc.

### 2. ITEM TYPE SEQUENCE (FIXED ORDER)
You MUST generate exactly 6 screens. Do not skip. Do not reorder.

| Screen | CJMM Step | Type | Purpose |
|--------|-----------|------|---------|
| 1 | Recognize Cues | highlight | Scan & identify abnormal findings |
| 2 | Analyze Cues | matrix | Sort data into categories |
| 3 | Prioritize Hypotheses | ordered-response | Rank by urgency |
| 4 | Generate Solutions | bow-tie | Connect diagnosis → action |
| 5 | Take Action | drop-cloze | Complete nursing orders |
| 6 | Evaluate Outcomes | multiple-response | Assess response to intervention |

### 3. CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
```json
"vitals": [
  {
    "time": "0800",
    "tempF": "101.5",
    "hr": 115,
    "rr": 24,
    "bp": "88/52",
    "o2": "92",
    "o2_device": "4L NC",
    "pain": 7
  }
]
```
**Labs with Flags:** "H" (high), "L" (low), "H!" (critical high), "L!" (critical low)
**Clinical Consistency Rule:** Vitals, labs, and orders MUST align with the scenario.
**Anti-Generic Rationale Rule:** You are FORBIDDEN from using phrases like "Correct finding", "Appropriate choice", or "Incorrect". You MUST explain the *pathophysiology* or *clinical reasoning* (e.g., "Hypotension indicates pump failure..." NOT "Hypotension is the correct answer").

---

## 🏥 COMPLETE CLINICAL DATA REQUIREMENTS (Level 4-5)

**For Expert-level Case Studies (Level 4-5), you MUST include ALL of the following:**

### 1. Nurses Notes (MINIMUM 2 entries)
```json
"history": "<p><strong>0800 - Nursing Assessment:</strong> Patient presents with [chief complaint]. Reports [symptoms]. [Relevant history]. Vital signs: [initial vitals]. Patient appears [general appearance].</p><p><strong>0930 - Follow-up Note:</strong> Interventions initiated: [what was done]. Patient response: [how they responded]. Current status: [current assessment]. Notified [provider] of [findings].</p>"
```
**ALTERNATIVE ARRAY FORMAT:**
```json
"nursesNotes": [
  { "time": "0800", "author": "RN Smith", "entry": "Initial assessment..." },
  { "time": "0930", "author": "RN Smith", "entry": "Follow-up..." }
]
```

### 2. History & Physical (REQUIRED for Level 4-5)
```json
"historyPhysical": {
  "chiefComplaint": "Detailed presenting complaint",
  "hpi": "72-year-old male with PMH of CHF and DM presents with 3-day history of progressive dyspnea, orthopnea (requiring 3 pillows), and lower extremity swelling. Patient reports 8-lb weight gain over past week. Denies chest pain, fever, or cough.",
  "pmh": ["CHF (EF 35%)", "Type 2 DM", "Hypertension", "CKD Stage 3"],
  "psh": ["CABG x3 (2020)", "Appendectomy (1985)"],
  "medications": ["Lasix 40mg PO BID", "Metoprolol 50mg PO BID", "Lisinopril 20mg PO daily"],
  "allergies": "Penicillin (rash), Sulfa (anaphylaxis)",
  "socialHistory": "Former smoker (30 pack-years, quit 5 years ago). No alcohol. Lives with spouse. Independent ADLs.",
  "familyHistory": "Father died of MI at age 65. Mother has DM.",
  "reviewOfSystems": {
    "constitutional": "Fatigue, weight gain",
    "cardiovascular": "Dyspnea, orthopnea, PND",
    "respiratory": "No cough, no hemoptysis",
    "gi": "No nausea, no abdominal pain"
  },
  "physicalExam": {
    "general": "Alert, anxious, in mild respiratory distress",
    "vital signs": "See vitals tab",
    "cardiovascular": "Irregular rhythm, S3 gallop, no murmurs, JVD to angle of jaw",
    "respiratory": "Bilateral crackles bases to mid-lung fields",
    "abdomen": "Soft, hepatomegaly 3cm below costal margin",
    "extremities": "3+ pitting edema bilateral lower extremities"
  }
}
```

### 3. Medical Orders (MINIMUM 4 orders)
```json
"orders": [
  { "order": "IV Furosemide 40mg x1 NOW", "status": "Active", "orderedBy": "Dr. Cardiologist", "time": "0820" },
  { "order": "BMP, BNP, Troponin STAT", "status": "Pending", "orderedBy": "Dr. Cardiologist", "time": "0815" },
  { "order": "Chest X-Ray portable", "status": "Completed", "orderedBy": "Dr. Cardiologist", "time": "0810" },
  { "order": "Strict I&O", "status": "Active", "orderedBy": "Dr. Cardiologist", "time": "0815" },
  { "order": "Daily weights", "status": "Active", "orderedBy": "RN Protocol", "time": "0815" },
  { "order": "O2 via NC to maintain SpO2 > 92%", "status": "Active", "orderedBy": "Dr. Cardiologist", "time": "0810" }
]
```

### 4. Radiology (INCLUDE if clinically relevant)
```json
"radiology": [
  {
    "study": "Chest X-Ray (Portable AP)",
    "date": "Current Date 0830",
    "indication": "Shortness of breath, rule out pulmonary edema",
    "findings": "Cardiomegaly with cardiothoracic ratio of 0.6. Bilateral interstitial and alveolar infiltrates consistent with pulmonary edema. Bilateral pleural effusions, small. No pneumothorax.",
    "impression": "Findings consistent with acute decompensated heart failure with pulmonary edema.",
    "radiologist": "Dr. R. Imaging, MD"
  }
]
```
**OMIT radiology ONLY if the case is purely psychiatric or does not require imaging.**

### 5. Vitals (MINIMUM 2 readings to show trend)
```json
"vitals": [
  { "time": "0800", "tempF": "98.6", "hr": 102, "rr": 24, "bp": "158/92", "o2": "89", "o2_device": "RA", "pain": 0 },
  { "time": "0900", "tempF": "98.4", "hr": 88, "rr": 20, "bp": "142/84", "o2": "94", "o2_device": "2L NC", "pain": 0 }
]
```

---

## 🧠 RATIONALE OBJECT (REQUIRED FOR EVERY SCREEN)

Use this EXACT schema for `content.rationale` (global) AND `structure.screens[i].rationale` (each screen).

**DO NOT leave any field empty. Fill with educational content.**

```json
{
  "coreConcept": "string (1-2 sentences defining the core concept)",
  "caseSummary": "string (2-3 sentences summarizing the case scenario)",
  "answerAnalysis": "string (detailed breakdown: why correct is correct, why distractors are wrong)",
  "trap": "string (common student error or misconception)",
  "goldenRule": "string (memorable clinical axiom or rule-of-thumb)",
  "steps": [
    { "tag": "Recognize", "description": "What cues to identify" },
    { "tag": "Analyze", "description": "How to interpret the cues" },
    { "tag": "Take Action", "description": "What nursing action to take" }
  ],
  "mnemonic": {
    "title": "ACRONYM (e.g., SBAR)",
    "content": "S-Situation, B-Background, A-Assessment, R-Recommendation",
    "explanation": "Why this acronym helps"
  },
  "cheatSheet": {
    "title": "Clinical Pearls",
    "points": [ "Pearl 1", "Pearl 2", "Pearl 3" ]
  },
  "referenceInfo": {
    "anatomy": "CASE-SPECIFIC anatomy (e.g., 'The coronary arteries...' not 'Relevant anatomy')",
    "physiology": "CASE-SPECIFIC pathophysiology (e.g., 'In heart failure, decreased cardiac output leads to...')",
    "pharm": "CASE-SPECIFIC drugs and mechanisms (e.g., 'Furosemide inhibits Na-K-2Cl in loop of Henle...')"
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard/Expert",
    "clinicalStrategy": "Strategy to solve this question",
    "recommendedActions": ["What student should do"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC

**❌ UNACCEPTABLE (Generic):**
```json
"referenceInfo": {
  "anatomy": "Review the relevant anatomical structures",
  "physiology": "Consider the physiological mechanisms involved",
  "pharm": "Identify pharmacological interventions"
}
```

**✅ REQUIRED (Case-Specific Example for Sepsis):**
```json
"referenceInfo": {
  "anatomy": "The vascular endothelium lines all blood vessels and plays a critical role in sepsis. Inflammatory mediators damage endothelial tight junctions, causing capillary leak syndrome. The spleen filters bacteria but can be overwhelmed in bacteremia.",
  "physiology": "Sepsis triggers a systemic inflammatory response (SIRS) with cytokine release (TNF-α, IL-1, IL-6). This causes vasodilation (decreased SVR), increased capillary permeability, and maldistribution of blood flow. Lactate accumulates as tissues shift to anaerobic metabolism due to oxygen debt.",
  "pharm": "Norepinephrine is first-line vasopressor (α-1 agonist for vasoconstriction). Broad-spectrum antibiotics must cover likely pathogens within 1 hour. Crystalloid fluids (30mL/kg) restore intravascular volume. Hydrocortisone 200mg/day for refractory shock."
}
```

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)

**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE. DO NOT OMIT ANY FIELD.**

### For EACH SCREEN's rationale object:
- `coreConcept`: 1-2 sentences defining the core concept (REQUIRED)
- `caseSummary`: 2-3 sentences summarizing the case (REQUIRED)
- `answerAnalysis`: Detailed breakdown of correct/incorrect options (REQUIRED)
- `trap`: The most common student mistake (REQUIRED)
- `goldenRule`: A memorable clinical axiom (REQUIRED)
- `steps`: Array with at least 3 objects containing `tag` and `description` (REQUIRED)
- `mnemonic.title`: The acronym (e.g., "SBAR") (REQUIRED)
- `mnemonic.content`: The expanded form (REQUIRED)
- `mnemonic.explanation`: Why it helps (REQUIRED)
- `cheatSheet.title`: Title of the clinical pearls (REQUIRED)
- `cheatSheet.points`: Array with at least 3 clinical tips (REQUIRED)
- `referenceInfo.anatomy`: Relevant anatomy for this case (REQUIRED)
- `referenceInfo.physiology`: Relevant physiology (REQUIRED)
- `referenceInfo.pharm`: Relevant pharmacology or "Not applicable for this scenario" (REQUIRED)
- `difficulty.score`: Number 0-100 matching [SCORE] (REQUIRED)
- `difficulty.level`: Number 1-5 matching [LEVEL] (REQUIRED)
- `difficulty.label`: "Easy/Medium/Hard/Expert" (REQUIRED)

**DO NOT LEAVE ANY FIELD AS:**
- Empty string ""
- Null
- "N/A" without context
- "See above" or "See previous"
- References to other screens

**EACH SCREEN MUST BE SELF-CONTAINED WITH ITS OWN COMPLETE RATIONALE.**

## 📐 SCREEN-SPECIFIC SCHEMAS

### SCREEN 1: Highlight (Recognize Cues)
**CRITICAL: Include BOTH relevant findings (correct) AND decoy findings (benign/irrelevant). Minimum 6 spans total.**
```json
{
  "type": "highlight",
  "cjmmStep": "Recognize Cues",
  "prompt": "Click to highlight the findings that require immediate follow-up.",
  "text": "The nurse reviews the patient's chart. Patient is a <span id='h1'>68-year-old male</span> presenting with <span id='h2'>fever of 102.5°F</span> and <span id='h3'>heart rate of 118 bpm</span>. Patient states <span id='h4'>he had breakfast this morning</span>. Assessment reveals <span id='h5'>blood pressure 84/52 mmHg</span>, <span id='h6'>respiratory rate 24</span>, and <span id='h7'>warm, flushed skin</span>. Patient <span id='h8'>watched television last night</span>. Labs pending.",
  "correct": ["h2", "h3", "h5", "h6", "h7"],
  "decoys": ["h1", "h4", "h8"],
  "rationale": { ...full_rationale_object... },
  "rationales": {
    "h2": "[Hook] Fever 102.5°F. [Breakdown] Indicates systemic inflammatory response (SIRS) to potential infection. [Trap] Do not dismiss as merely 'viral' without further workup.",
    "h3": "[Hook] HR 118 bpm. [Breakdown] Tachycardia is a compensatory mechanism to maintain cardiac output during vasodilation. [Trap] Misinterpreting as anxiety.",
    "h5": "[Hook] BP 84/52. [Breakdown] Hypotension (MAP < 65) indicates uncompensated shock and poor organ perfusion. [Trap] Assuming this is 'normal' for some patients.",
    "h6": "[Hook] RR 24. [Breakdown] Tachypnea suggests respiratory compensation for metabolic acidosis (lactate). [Trap] Ignoring respiratory rate as a vital sign.",
    "h7": "[Hook] Warm, flushed skin. [Breakdown] Characteristic of early 'warm' distributive/septic shock before clamping down. [Trap] Expecting cold/clammy skin (which is late shock)."
  }
}
```
**CRITICAL: The `rationales` object MUST include keys for ALL spans (correct AND decoys). You must explain why the decoys are distractors or benign.**
**CRITICAL: `rationales` object keys MUST match the span IDs ("h1", "h2"). Values MUST be the specific clinical reasoning, NOT "Correct finding."**

### SCREEN 2: Matrix (Analyze Cues)
**CRITICAL: Minimum 5 rows, 2-3 columns. Each row has exactly ONE correct column.**
```json
{
  "type": "matrix",
  "cjmmStep": "Analyze Cues",
  "prompt": "For each finding, indicate if it supports Sepsis, Heart Failure, or Neither.",
  "columns": [
    { "id": "c1", "text": "Sepsis" },
    { "id": "c2", "text": "Heart Failure" },
    { "id": "c3", "text": "Neither/Normal" }
  ],
  "rows": [
    { "id": "r1", "text": "Fever with tachycardia", "correctColumnId": "c1", "rationale": "Classic signs of systemic inflammation." },
    { "id": "r2", "text": "Orthopnea with lower extremity edema", "correctColumnId": "c2", "rationale": "Structural signs of heart failure." },
    { "id": "r3", "text": "Hypotension with warm skin", "correctColumnId": "c1", "rationale": "Warm shock indicates distributive process." },
    { "id": "r4", "text": "Jugular vein distension", "correctColumnId": "c2", "rationale": "Sign of fluid overload." },
    { "id": "r5", "text": "Elevated WBC with left shift", "correctColumnId": "c1", "rationale": "Indicates active infection." },
    { "id": "r6", "text": "Clear lung sounds bilaterally", "correctColumnId": "c3", "rationale": "Normal finding, rules out pulmonary edema." }
  ],
  "rationale": { ...full_rationale_object... }
}
  ],
  "rationale": { ...full_rationale_object... }
}
```

### SCREEN 3: Ordered Response (Prioritize Hypotheses)
**CRITICAL: Use orderedOptions array. The order in the array IS the correct answer.**
```json
{
  "type": "ordered-response",
  "cjmmStep": "Prioritize Hypotheses",
  "prompt": "Drag the nursing priorities into the correct order.",
  "orderedOptions": [
    { "id": "s1", "text": "Ensure airway patency", "rationale": "ABCs first." },
    { "id": "s2", "text": "Establish IV access", "rationale": "Required for resuscitation." },
    { "id": "s3", "text": "Obtain blood cultures", "rationale": "Before antibiotics." }
  ],
  "rationale": { ...full_rationale_object... }
}
```

### SCREEN 4: Bow-Tie (Generate Solutions)
**CRITICAL: Minimum 4 actions, 3 conditions, 4 parameters. Mark correct ones with isCorrect: true.**
```json
{
  "type": "bow-tie",
  "cjmmStep": "Generate Solutions",
  "prompt": "Complete the clinical decision diagram by selecting the appropriate actions, identifying the most likely condition, and choosing parameters to monitor.",
  "actions": [
    { "id": "a1", "text": "Administer IV fluid bolus 30mL/kg", "isCorrect": true },
    { "id": "a2", "text": "Obtain blood cultures before antibiotics", "isCorrect": true },
    { "id": "a3", "text": "Administer broad-spectrum antibiotics within 1 hour", "isCorrect": true },
    { "id": "a4", "text": "Place Foley catheter for urine output monitoring" },
    { "id": "a5", "text": "Restrict oral fluids" },
    { "id": "a6", "text": "Administer antipyretic PRN" }
  ],
  "conditions": [
    { "id": "c1", "text": "Septic shock", "isCorrect": true },
    { "id": "c2", "text": "Cardiogenic shock" },
    { "id": "c3", "text": "Hypovolemic shock" },
    { "id": "c4", "text": "Anaphylactic shock" }
  ],
  "parameters": [
    { "id": "p1", "text": "Mean arterial pressure (MAP) > 65 mmHg", "isCorrect": true },
    { "id": "p2", "text": "Urine output > 0.5 mL/kg/hr", "isCorrect": true },
    { "id": "p3", "text": "Lactate clearance (decreasing levels)", "isCorrect": true },
    { "id": "p4", "text": "Central venous pressure (CVP)" },
    { "id": "p5", "text": "Body temperature normalization" }
  ],
  "rationale": { ...full_rationale_object... }
}
```

### SCREEN 5: Drop-Cloze (Take Action)
**CRITICAL: Every option in the `dropdowns` array MUST have a `rationale` field explaining why it is correct or incorrect.**
```json
{
  "type": "drop-cloze",
  "cjmmStep": "Take Action",
  "prompt": "Complete the nursing documentation.",
  "text": "The nurse anticipates orders for %{d1} to manage %{d2}.",
  "dropdowns": [
    {
      "id": "d1",
      "options": [
        { "id": "o1", "text": "Normal saline", "isCorrect": true, "rationale": "Isotonic saline restores intravascular volume." },
        { "id": "o2", "text": "Dextrose", "rationale": "Dextrose metabolism releases free water, worsening shock." }
      ]
    },
    {
      "id": "d2",
      "options": [
        { "id": "o3", "text": "Hypotension", "isCorrect": true, "rationale": "MAP < 65 mmHg jeopardizes organ perfusion." },
        { "id": "o4", "text": "Hypertension", "rationale": "Patient is hypotensive, not hypertensive." }
      ]
    }
  ],
  "rationale": { ...full_rationale_object... }
}
```

### SCREEN 6: Multiple Response (Evaluate Outcomes)
```json
{
  "type": "multiple-response",
  "cjmmStep": "Evaluate Outcomes",
  "prompt": "Which findings indicate improvement? Select all that apply.",
  "options": [
    { "id": "o1", "text": "Blood pressure improved", "isCorrect": true, "rationale": "MAP > 65 indicates perfusion." },
    { "id": "o2", "text": "Lactate level decreased", "isCorrect": true, "rationale": "Indicates restoration of aerobic metabolism." },
    { "id": "o3", "text": "Fever persists", "rationale": "Expected, but not improvement." }
  ],
  "rationale": { ...full_rationale_object... }
}
```

## ✅ FINAL VALIDATION CHECKLIST
Before you output, verify:
- `id` is present and matches `TOPIC-CS-HEX` format.
- Exactly 6 screens generated.
- Screen 1 = highlight (type: "highlight").
- Screen 2 = matrix (type: "matrix").
- Screen 3 = ordered-response (type: "ordered-response") with orderedOptions array.
- Screen 4 = bow-tie (type: "bow-tie") with actions, conditions, parameters.
- Screen 5 = drop-cloze (type: "drop-cloze") with dropdowns array.
- Screen 6 = multiple-response (type: "multiple-response") with options array.
- All vitals include ALL 7 fields: time, tempF, hr, rr, bp, o2, pain.
- Each screen has its own COMPLETE rationale object (not references).
- Each rationale has referenceInfo with anatomy, physiology, pharm.
- Each rationale has difficulty with score, level, label.
- Each rationale has steps array with at least 3 items.
- Each rationale has mnemonic with title, content, explanation.
- No trailing commas anywhere.
- Score in all difficulty objects matches [SCORE].
- Level in all difficulty objects matches [LEVEL].

## 📦 COMPLETE JSON ROOT STRUCTURE

**IMPORTANT: Your output MUST follow this exact structure:**

```json
{
  "type": "case-study",
  "content": {
    "metadata": {
      "title": "Case Study Title Based on Clinical Focus",
      "clinicalFocus": "[FOCUS]",
      "level": [LEVEL],
      "targetScore": [SCORE],
      "generator": "Golden NGN v3"
    },
    "patient": {
      "name": "Patient Name, Initials",
      "age": 45,
      "sex": "Female",
      "allergies": "NKDA or list",
      "weightKg": 75,
      "history": ["Condition 1", "Condition 2"],
      "homeMeds": [
        { "name": "Medication", "dose": "10mg", "route": "PO", "frequency": "daily" }
      ]
    },
    "setting": "Emergency Department or Unit Name",
    "chiefComplaint": "Chief complaint in 1-2 sentences",
    "vitals": [
      {
        "time": "0800",
        "tempF": "98.6",
        "hr": 88,
        "rr": 18,
        "bp": "120/80",
        "o2": "98",
        "o2_device": "Room Air",
        "pain": 3
      }
    ],
    "labs": [
      { "test": "WBC", "value": "12.5", "unit": "K/uL", "flag": "H", "reference": "4.5-11.0" }
    ],
    "assessmentData": {
      "screening": {
        "tool": "PHQ-9 or relevant tool",
        "score": 15,
        "interpretation": "Interpretation text"
      }
    },
    "rationale": {
      "...full global rationale object matching the schema above..."
    }
  },
  "structure": {
    "type": "case-study",
    "screens": [
      { "...screen 1 object with type, cjmmStep, prompt, and full rationale..." },
      { "...screen 2 object..." },
      { "...screen 3 object..." },
      { "...screen 4 object..." },
      { "...screen 5 object..." },
      { "...screen 6 object..." }
    ]
  }
}
```

## 🔄 FIELD MAPPING NOTES

The application expects certain field mappings. Ensure your output includes:

| Your Output Field | Application Expects | Notes |
|:-----------------|:--------------------|:------|
| `content.patient` | Maps to `clinicalData.patientInfo` | Include name, age, sex |
| `content.vitals` | Maps to `clinicalData.vitals` | Must be array |
| `structure.screens` | Maps to `content.structure.screens` | Exactly 6 screens |
| `rationale.trap` | Also used as `pitfalls[0]` | Common mistake |
| `rationale.steps` | Used in Strategy tab | Array of {tag, description} |
| `rationale.referenceInfo` | Used in Knowledge tab | anatomy, physiology, pharm |
| `rationale.difficulty` | Used in Expert HUD | score, level, label required |

## 🚀 EXECUTION INSTRUCTION
Generate the JSON for the [FOCUS] Case Study at difficulty [LEVEL] (Score [SCORE]).
Output ONLY the JSON. No markdown code blocks. No intro/outro text. Raw JSON only.

[//]: # (REVIEW NOTE: v3.2 - Updates: 1. Screen 1 Highlight now ENFORCES specific 'rationales' object with [Hook], [Breakdown], and [Trap] components for granular feedback. 2. Screen 3 Ordered Response confirms 'rationale' field per option. 3. Added detailed validation checks for these fields.)