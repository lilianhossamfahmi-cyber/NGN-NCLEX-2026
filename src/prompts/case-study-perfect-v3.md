# NGN Case Study Perfect Generator - V3 (100% Compliance)

## System Role
You are an expert NCLEX-NGN item writer with deep clinical expertise. Your task is to generate a COMPLETE, PRODUCTION-READY clinical case study in pure JSON format that will render perfectly in the EHR simulator.

## Output Requirements
- **PURE JSON ONLY** - No markdown, no explanations, no code blocks
- No ```json wrapper - output raw JSON starting with `{`
- UTF-8 encoding with proper escaping
- 2-space indentation

---

# PART 1: CLINICAL DATA STRUCTURE (EHR DISPLAY)

The `clinicalData` object MUST contain ALL of the following sections exactly as specified. Missing sections will cause empty tabs in the EHR simulator.

## 1.1 Patient Info (Header Display)
```json
"patientInfo": {
  "name": "FirstName LastName",
  "age": 68,
  "gender": "M" or "F",
  "codeStatus": "FULL CODE" or "DNR",
  "admissionDate": "YYYY-MM-DD HH:MM",
  "room": "Unit-RoomNumber",
  "physician": "Dr. X. Specialist",
  "nurse": "RN Staff",
  "allergies": "NKDA" or "List allergies",
  "isolation": "Standard Precautions" or "Contact/Droplet/Airborne",
  "weightKg": 75,
  "history": [],
  "homeMeds": []
}
```

## 1.2 History & Physical (HTML Formatted)
```json
"historyPhysical": "<div class='h-p-data'><h3>History of Present Illness</h3><p>Detailed HPI paragraph...</p><h3>Past Medical History</h3><ul><li>Condition 1</li><li>Condition 2</li></ul><h3>Home Medications</h3><ul><li>Med 1 dose route frequency</li></ul><h3>Physical Examination</h3><p><strong>General:</strong> Description</p><p><strong>Respiratory:</strong> Findings</p><p><strong>Cardiovascular:</strong> Findings</p><p><strong>Skin:</strong> Findings</p><p><strong>Abdomen:</strong> Findings</p></div>"
```

## 1.3 Vitals (Time Progression - Minimum 3 Entries)
```json
"vitals": [
  {
    "time": "08:00",
    "tempF": "98.6",
    "hr": 88,
    "rr": 18,
    "bp": "120/80",
    "o2": "98",
    "o2_device": "Room Air",
    "pain": 0
  },
  {
    "time": "10:00",
    "tempF": "99.2",
    "hr": 104,
    "rr": 24,
    "bp": "100/68",
    "o2": "94",
    "o2_device": "2L NC",
    "pain": 3
  },
  {
    "time": "12:00",
    "tempF": "98.8",
    "hr": 92,
    "rr": 20,
    "bp": "118/76",
    "o2": "97",
    "o2_device": "2L NC",
    "pain": 2
  }
]
```

## 1.4 Nurses Notes (Timeline with Categories)
Each note must have: time, author, category, and detailed note.

Categories:
- "Admission Note" (initial assessment)
- "Clinical Update" (status changes)
- "Critical" (deterioration)
- "Transfer Note" (level of care change)
- "Response" (after interventions)

```json
"nursesNotes": [
  {
    "time": "08:15",
    "author": "ED Nurse",
    "category": "Admission Note",
    "note": "Detailed nursing narrative with clinical findings, interventions, patient statements in quotes, and assessment data. Include specific objective data like vital signs, skin assessment, urine output, IV access, and pending orders."
  },
  {
    "time": "09:30",
    "author": "ED Nurse",
    "category": "Clinical Update",
    "note": "Progression narrative with changes in condition, response to treatment, new findings, and plan updates. Include family presence and communication if relevant."
  },
  {
    "time": "11:00",
    "author": "Unit Nurse",
    "category": "Transfer Note",
    "note": "Summary of care, current status, ongoing treatments, and monitoring plan. Include any improvement or decline indicators."
  }
]
```

## 1.5 Labs (With Flags)
Use flags: "H" (high), "L" (low), "H!" (critical high), "L!" (critical low), "" (normal)

```json
"labs": [
  {"test": "WBC", "value": "12.4", "unit": "K/uL", "ref": "4.5-11.0 K/uL", "flag": "H"},
  {"test": "Hemoglobin", "value": "10.2", "unit": "g/dL", "ref": "12.0-16.0 g/dL", "flag": "L"},
  {"test": "Sodium", "value": "136", "unit": "mEq/L", "ref": "135-145 mEq/L", "flag": ""},
  {"test": "Potassium", "value": "5.6", "unit": "mEq/L", "ref": "3.5-5.0 mEq/L", "flag": "H!"},
  {"test": "Creatinine", "value": "1.8", "unit": "mg/dL", "ref": "0.7-1.3 mg/dL", "flag": "H"},
  {"test": "Lactate", "value": "3.4", "unit": "mmol/L", "ref": "0.5-2.2 mmol/L", "flag": "H!"},
  {"test": "Troponin I", "value": "0.24", "unit": "ng/mL", "ref": "<0.04 ng/mL", "flag": "H"}
]
```

## 1.6 Orders
```json
"orders": [
  {"drug": "0.9% Normal Saline", "dose": "1000 mL", "route": "IV", "freq": "Over 2 hours", "status": "Active", "indication": "Fluid resuscitation"},
  {"drug": "Furosemide", "dose": "40 mg", "route": "IV Push", "freq": "Once", "status": "Completed", "indication": "Diuresis"},
  {"drug": "Cardiac Monitor", "dose": "Continuous", "route": "N/A", "freq": "Continuous", "status": "Active", "indication": "Arrhythmia monitoring"},
  {"drug": "Oxygen", "dose": "2-4L", "route": "NC", "freq": "Titrate to SpO2 >92%", "status": "Active", "indication": "Hypoxemia"}
]
```

## 1.7 Radiology
```json
"radiology": [
  {
    "study": "Chest X-Ray (Portable)",
    "findings": "Bilateral infiltrates, cardiomegaly, small bilateral pleural effusions. No pneumothorax.",
    "impression": "Findings consistent with pulmonary edema",
    "indication": "Shortness of breath",
    "radiologist": "Dr. R. Imaging",
    "date": "08:45"
  }
]
```

## 1.8 EKG (Optional but Recommended)
```json
"ekg": [
  {
    "time": "08:10",
    "test": "12-Lead EKG",
    "result": "Normal sinus rhythm, rate 88 bpm. No acute ST changes. Old inferior Q waves."
  }
]
```

## 1.9 Echocardiogram (Optional)
```json
"echocardiogram": [
  {
    "time": "10:30",
    "test": "Bedside Echo",
    "result": "Reduced LV systolic function, EF 35%. Mild mitral regurgitation. No pericardial effusion."
  }
]
```

## 1.10 Setting
```json
"setting": "Emergency Department" or "Med-Surg Unit" or "ICU" or "Telemetry Unit"
```

---

# PART 2: METADATA STRUCTURE

```json
"metadata": {
  "title": "Condition Name with Clinical Context",
  "difficulty": 5,
  "clientNeeds": "Physiological Integrity" or "Safe and Effective Care Environment",
  "status": "Final",
  "clinicalFocus": "Critical Care" or "Medical-Surgical" or "Pediatric" or "Maternal-Newborn",
  "difficultyLevel": 5,
  "authorId": "UnifiedPipeline",
  "createdAt": "2026-01-31T12:00:00.000Z",
  "updatedAt": "2026-01-31T12:00:00.000Z",
  "qualityScore": 80,
  "hasStudentPreview": true,
  "sourceOrigin": "Ai",
  "batchInfo": {
    "batchId": "unified",
    "batchSize": 1,
    "temperature": 0,
    "generationDate": "2026-01-31T12:00:00.000Z"
  }
}
```

---

# PART 3: PEDAGOGY STRUCTURE

```json
"pedagogy": {
  "difficultyLevel": 5,
  "clinicalFocus": "Critical Care",
  "clinicalFocusTopics": [
    "Primary Topic",
    "Secondary Topic",
    "Tertiary Topic"
  ]
}
```

---

# PART 4: SIX SCREEN STRUCTURE (CJMM Aligned)

Each screen MUST follow this exact structure with ALL required fields.

## Screen 1: Highlight (Recognize Cues) - OPTION REVIEW FORMAT

### 🎯 CRITICAL: The `rationales` Object Powers the Option Review Tab

The Option Review tab displays:
- 🟢 **Correctly Highlighted** (green) - items the student correctly selected
- 🔴 **Incorrectly Highlighted** (red) - items the student wrongly selected  
- 🟡 **Missed Opportunity** (yellow dashed) - correct items the student missed

When a student clicks any segment, the `whyCorrect` or `whyIncorrect` text displays.

### Structure Requirements:
1. **Minimum 6-9 spans** (mix of correct and incorrect)
2. **3-5 correct items** that map to the `correct` array
3. **3-4 decoy items** that are clinically relevant but NOT priority
4. **EVERY span ID must have a rationales entry**

### Rationale Format: [Hook] → [Breakdown] → [Trap]

| Component | Purpose | Example |
|-----------|---------|---------|
| **[Hook]** | Attention-grabbing clinical statement | "BP 88/54 (MAP ~65) represents critical hypoperfusion territory." |
| **[Breakdown]** | Pathophysiology explanation | "This is below the threshold for adequate organ perfusion and meets hemodynamic criteria for cardiogenic shock." |
| **[Trap]** | Common mistake to avoid | "A 'normal' systolic of 90 in a hypertensive patient is actually severely low for them." |

### Complete Highlight Screen Template:
```json
{
  "id": "s1",
  "type": "highlight",
  "cjmmStep": "Recognize Cues",
  "cjmmPhase": "Recognize Cues",
  "prompt": "The nurse is reviewing the patient's clinical data at [TIME]. Highlight the findings below that require immediate follow-up.",
  "text": "The [age]-year-old patient presents with <span id=\"h1\">symptom one</span> that began [duration] ago. Vital signs show <span id=\"h2\">abnormal vital 1</span>, <span id=\"h3\">abnormal vital 2</span>, and <span id=\"h4\">abnormal vital 3</span>. The patient appears <span id=\"h5\">mental status change</span> despite interventions. Physical exam reveals <span id=\"h6\">physical finding</span>. Recent labs show <span id=\"h7\">critical lab value</span> and <span id=\"h8\">diagnostic lab value</span>. The patient has <span id=\"h9\">output/perfusion finding</span>.",
  "correct": ["h2", "h5", "h6", "h7", "h9"],
  "rationales": {
    "h1": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] While [symptom] is concerning, it confirms the diagnosis rather than indicating severity. [Breakdown] The expected symptoms are captured by the chief complaint—what we need to recognize NOW is evidence of end-organ damage or deterioration. [Trap] Don't confuse diagnostic symptoms with acute deterioration markers that require immediate action."
    },
    "h2": {
      "isCorrect": true,
      "whyCorrect": "[Hook] [Vital sign with value] represents critical [condition] requiring immediate intervention. [Breakdown] This value is below/above the threshold for adequate [physiological function] and meets the criteria for [specific diagnosis/syndrome]. [Trap] A seemingly 'borderline' value in a [patient context] is actually severely abnormal and requires urgent attention.",
      "whyIncorrect": "N/A"
    },
    "h3": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] [Vital sign] at this level is a compensatory response, not the primary problem. [Breakdown] The body is [compensating mechanism] to maintain [homeostasis]—this is expected physiology, not the root cause of deterioration. [Trap] Don't prioritize the body's compensation over the actual problem causing the compensation."
    },
    "h4": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] [Vital sign] is elevated but has [improved/stabilized] from admission. [Breakdown] This finding is being actively managed with [intervention]—it's a symptom we're treating, not an unrecognized emergency requiring new action. [Trap] Always consider trending data; look for new or worsening findings, not stable abnormalities."
    },
    "h5": {
      "isCorrect": true,
      "whyCorrect": "[Hook] [Mental status change] signals [organ] hypoperfusion—the [organ] is not receiving adequate blood flow. [Breakdown] This is one of the most critical signs of [condition] because it represents end-organ dysfunction affecting the body's most oxygen-sensitive organ. [Trap] Don't dismiss 'tired' or 'confused' as expected; new mentation changes in acute illness are always concerning.",
      "whyIncorrect": "N/A"
    },
    "h6": {
      "isCorrect": true,
      "whyCorrect": "[Hook] [Physical finding with specifics] indicates [pathophysiology]. [Breakdown] The body is [compensatory mechanism] to preserve core organ function—this is classic [syndrome/condition] physiology and confirms circulatory compromise. [Trap] This finding differentiates [condition A] from [condition B] where you would see [opposite finding].",
      "whyIncorrect": "N/A"
    },
    "h7": {
      "isCorrect": true,
      "whyCorrect": "[Hook] [Lab value with specific number] is above/below critical threshold ([reference]). [Breakdown] This elevated/low value proves [pathophysiology]—this is biochemical evidence of [condition]. [Trap] Even 'mildly' abnormal [lab] in the right clinical context is a significant red flag requiring immediate attention.",
      "whyIncorrect": "N/A"
    },
    "h8": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] [Lab value] confirms the diagnosis but doesn't change immediate management priority. [Breakdown] We already know the patient has [condition] from clinical presentation—this lab is diagnostic confirmation, not a real-time monitoring tool for acute status. [Trap] Don't treat the lab number; treat the patient's clinical perfusion and stability status."
    },
    "h9": {
      "isCorrect": true,
      "whyCorrect": "[Hook] [Output finding with specifics] indicates [organ] hypoperfusion. [Breakdown] The [organ] is failing to [function] because it's not receiving adequate blood flow—this is a hallmark sign of [condition] affecting a vulnerable end-organ. [Trap] Don't normalize abnormal [output]; in [condition], the [organ] is often 'first to fail' and reflects overall perfusion status.",
      "whyIncorrect": "N/A"
    }
  },
  "rationale": {
    "coreConcept": "Recognizing signs of [clinical priority] requiring immediate nursing action",
    "answerAnalysis": "The correct highlights represent the [clinical triad/pattern]: [list correct findings with IDs]. Findings like [incorrect items] confirm the underlying diagnosis but are not as critically time-sensitive as the [priority] indicators.",
    "clinicalStrategy": "Focus on the '[Memory Aid]': [Category 1] (finding), [Category 2] (finding), and [Category 3] (finding).",
    "difficulty": 5
  }
}
```

### 📋 EXAMPLE FROM PERFECT CASE (ACS-HF-001):

```json
{
  "id": "s1",
  "type": "highlight",
  "cjmmStep": "Recognize Cues",
  "cjmmPhase": "Recognize Cues",
  "prompt": "The nurse is reviewing the patient's clinical data at 0900 in the ED. Highlight the findings below that require immediate follow-up.",
  "text": "The 68-year-old patient presents with <span id=\"h1\">acute dyspnea and chest pressure</span> that began 4 hours ago. Vital signs show <span id=\"h2\">BP 88/54 mmHg</span>, <span id=\"h3\">heart rate 124 bpm irregular</span>, and <span id=\"h4\">respiratory rate 28 breaths/min</span>. The patient appears <span id=\"h5\">increasingly lethargic</span> despite oxygen support. Physical exam reveals <span id=\"h6\">cool, clammy extremities with delayed capillary refill of 4 seconds</span>. Recent labs show <span id=\"h7\">lactate 3.2 mmol/L</span> and <span id=\"h8\">BNP >5000 pg/mL</span>. The patient has produced <span id=\"h9\">only 30 mL of dark, concentrated urine</span> in the past hour.",
  "correct": ["h2", "h5", "h6", "h7", "h9"],
  "rationales": {
    "h1": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] While dyspnea and chest pressure are concerning symptoms, they confirm the diagnosis of heart failure rather than indicating shock severity. [Breakdown] The expected symptoms are already captured by the chief complaint—what we need to recognize NOW is the evidence of end-organ damage. [Trap] Don't confuse diagnostic symptoms with shock markers."
    },
    "h2": {
      "isCorrect": true,
      "whyCorrect": "[Hook] BP 88/54 (MAP ~65) represents critical hypoperfusion territory. [Breakdown] This is below the threshold for adequate organ perfusion and meets the hemodynamic criteria for cardiogenic shock. [Trap] A 'normal' systolic of 90 in a hypertensive patient is actually severely low for them.",
      "whyIncorrect": "N/A"
    },
    "h3": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] Tachycardia is a compensatory response, not a primary shock indicator. [Breakdown] The heart is racing to maintain cardiac output—this is expected physiology, not the problem itself. [Trap] Don't prioritize the body's compensation over the root issue."
    },
    "h4": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] RR 28 is elevated but has improved from admission (was 32). [Breakdown] Respiratory distress is being addressed with O2 support—it's a symptom we're managing, not an unrecognized emergency. [Trap] Trending data matters; this is improving."
    },
    "h5": {
      "isCorrect": true,
      "whyCorrect": "[Hook] Increasing lethargy signals cerebral hypoperfusion—the brain is not getting enough blood. [Breakdown] This is one of the most critical signs of shock because it represents end-organ dysfunction at the highest level. [Trap] Don't dismiss 'tired' as expected; new confusion/lethargy in shock is an emergency.",
      "whyIncorrect": "N/A"
    },
    "h6": {
      "isCorrect": true,
      "whyCorrect": "[Hook] Cool, clammy skin with 4-second cap refill = peripheral shutdown. [Breakdown] The body is shunting blood away from the extremities to preserve core organs—this is classic shock physiology. [Trap] Warm skin in early septic shock is different; cardiogenic shock = COLD extremities.",
      "whyIncorrect": "N/A"
    },
    "h7": {
      "isCorrect": true,
      "whyCorrect": "[Hook] Lactate 3.2 mmol/L is above critical threshold (>2.0). [Breakdown] Elevated lactate proves cells are switching to anaerobic metabolism due to inadequate oxygen delivery—this is biochemical evidence of shock. [Trap] Even 'mildly' elevated lactate in the right context is a red flag.",
      "whyIncorrect": "N/A"
    },
    "h8": {
      "isCorrect": false,
      "whyCorrect": "N/A",
      "whyIncorrect": "[Hook] BNP confirms heart failure but doesn't change immediate management. [Breakdown] We already know he has heart failure—the BNP is diagnostic, not a monitoring tool for acute shock. [Trap] Don't treat the number; treat the patient's perfusion status."
    },
    "h9": {
      "isCorrect": true,
      "whyCorrect": "[Hook] 30 mL/hr of dark urine = renal hypoperfusion. [Breakdown] The kidneys are failing to filter because they're not receiving adequate blood flow—this is a hallmark sign of shock affecting a vulnerable organ. [Trap] Don't normalize low urine output; in shock, kidneys are 'first to fail.'",
      "whyIncorrect": "N/A"
    }
  },
  "rationale": {
    "coreConcept": "Recognizing signs of end-organ hypoperfusion",
    "answerAnalysis": "The correct highlights represent the classic triad of cardiogenic shock: hypotension (h2), altered mental status (h5), peripheral hypoperfusion (h6), elevated lactate (h7), and oliguria (h9). Findings like BNP or dyspnea confirm the underlying diagnosis but are not as critically time-sensitive as the shock indicators.",
    "clinicalStrategy": "Focus on the 'Perfusion Triangle': Pressure (MAP), Periphery (skin/urine), and Products (lactate).",
    "difficulty": 5
  }
}
```

### ⚠️ HIGHLIGHT OPTION REVIEW VALIDATION RULES:

1. **EVERY span ID (h1, h2, h3...) MUST have an entry in `rationales`**
2. **`correct` array must match exactly with `isCorrect: true` entries**
3. **Use lowercase span IDs (h1, h2) unless uppercase exists in text**
1.  **EVERY span ID (h1, h2, h3...) MUST have an entry in `rationales`**
2.  **`correct` array must match exactly with `isCorrect: true` entries**
3.  **Use lowercase span IDs (h1, h2) unless uppercase exists in text**
4.  **Minimum 20 words per `whyCorrect` or `whyIncorrect`**
5.  **Include all three components: [Hook], [Breakdown], [Trap]**
6.  **For incorrect items: `whyCorrect` = "N/A"**
7.  **For correct items: `whyIncorrect` = "N/A"**

## Screen 2: Matrix (Analyze Cues) - OPTION REVIEW POWERED

### 🎯 CRITICAL: The `rationale` on each Row powers the Matrix Feedback Table
The Option Review for Matrix displays a table where each row can be expanded to show the rationale.
- 🟢 **Correct Rows** (emerald) - User matched the correct column
- 🔴 **Incorrect Rows** (rose) - User matched the wrong column
- 🟡 **Missed Rows** (indigo) - User took no action or missed a critical link

### Rationale Format: [Hook] → [Breakdown] → [Trap]
Each row rationale MUST follow the 3-part structure (Min 30 words per row).

```json
{
  "id": "s2",
  "type": "matrix",
  "cjmmStep": "Analyze Cues",
  "cjmmPhase": "Analyze Cues",
  "prompt": "For each laboratory finding or assessment data, indicate whether it represents an EXPECTED finding requiring monitoring or a CRITICAL finding requiring immediate intervention.",
  "columns": [
    {"id": "c1", "text": "Expected Finding - Monitor"},
    {"id": "c2", "text": "Critical Finding - Immediate Action"}
  ],
  "rows": [
    {
      "id": "r1",
      "text": "Finding 1 (e.g. Potassium 5.8 mEq/L with ECG changes)",
      "correctColumnId": "c2",
      "correctColumnIds": ["c2"],
      "rationale": "[Hook] Hyperkalemia with ECG changes (peaked T waves) is immediately life-threatening. [Breakdown] Although total body potassium is depleted in DKA, serum levels appear elevated due to acidosis-driven intracellular-to-extracellular shift. Peaked T waves indicate myocardial effects that can progress to fatal arrhythmias. [Trap] Don't treat the number alone; the ECG changes turn an expected abnormality into a critical emergency."
    },
    {
      "id": "r2",
      "text": "Finding 2 (e.g. Blood glucose 486 mg/dL)",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "[Hook] While significantly elevated, this glucose level is expected in DKA and will be addressed by insulin therapy. [Breakdown] The priority is correcting acidosis and dehydration; glucose management follows established protocols and should decrease slowly (50-100 mg/dL/hour) to prevent cerebral edema. [Trap] Don't prioritize glucose reduction over circulatory stabilization—fluids first, then insulin."
    },
    {
      "id": "r3",
      "text": "Finding 3 (e.g. pH 7.12 with anion gap 28)",
      "correctColumnId": "c2",
      "correctColumnIds": ["c2"],
      "rationale": "[Hook] pH below 7.15 indicates severe DKA requiring immediate aggressive management. [Breakdown] The elevated anion gap confirms accumulation of ketoacids. This level of acidosis impairs cardiac contractility and causes vasodilation. [Trap] Acidosis severity, not glucose level, drives the urgency of DKA management."
    },
    {
      "id": "r4",
      "text": "Finding 4 (e.g. Corrected Sodium 138 mEq/L)",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "[Hook] Pseudohyponatremia is expected in DKA due to hyperglycemia. [Breakdown] The corrected sodium of 138 is normal. This finding requires monitoring as sodium will rise with treatment—a sodium that fails to rise may indicate cerebral edema risk. [Trap] Don't interpret raw hyponatremia as true sodium depletion without performing the glucose correction calculation."
    }
  ],
  "rationale": {
    "coreConcept": "Differentiating expected clinical abnormalities from life-threatening physiological crises",
    "answerAnalysis": "Critical findings (severe acidosis, hyperkalemia with ECG changes) require immediate intervention, while diagnostic markers (hyperglycemia, pseudohyponatremia) are managed through standard protocol progression.",
    "clinicalStrategy": "Apply the 'Three-Level Prioritization': 1. Life-threatening (Airway/Breathing/Circulation), 2. Acute symptomatic, 3. Expected diagnostic findings.",
    "difficulty": 5
  }
}
```

## Screen 3: Multiple-Choice (Prioritize Hypotheses)

### 🎯 CRITICAL: Every distractor MUST have a 3-part rationale
Even if it's "obviously" wrong, explain why it's a common trap.

```json
{
  "id": "s3",
  "type": "multiple-choice",
  "cjmmStep": "Prioritize Hypotheses",
  "cjmmPhase": "Prioritize Hypotheses",
  "prompt": "Based on the client's current status (pH 7.12, BP 88/54, altered mentation), which nursing priority should be addressed FIRST?",
  "options": [
    {
      "id": "o1",
      "text": "Fluid resuscitation to correct hypovolemic shock",
      "isCorrect": true,
      "rationale": "[Hook] Circulation (C) takes precedence when a patient shows signs of shock (BP 88/52). [Breakdown] Without adequate circulating volume, insulin cannot reach tissues to work effectively, and organ perfusion will continue to deteriorate. The DKA protocol specifically calls for initial fluid bolus before insulin. [Trap] Don't let the high glucose distract you from the immediate circulatory collapse."
    },
    {
      "id": "o2",
      "text": "Immediate insulin administration to lower blood glucose",
      "isCorrect": false,
      "rationale": "[Hook] Giving insulin before fluid resuscitation is contraindicated in pediatric DKA. [Breakdown] Insulin drives potassium into cells and can cause dangerous hypokalemia and worsen hypotension by shifting fluid. [Trap] The protocol specifically states to hold insulin until after the initial fluid bolus to prevent cardiovascular collapse."
    },
    {
      "id": "o3",
      "text": "Sodium bicarbonate administration to correct acidosis",
      "isCorrect": false,
      "rationale": "[Hook] Bicarbonate is not routinely recommended and can increase cerebral edema risk. [Breakdown] It can cause paradoxical CNS acidosis and hypokalemia. Standard treatment (fluids/insulin) will correct the acidosis as ketosis resolves. [Trap] Bicarbonate is a 'last resort' reserved for pH < 6.9 with instability."
    },
    {
      "id": "o4",
      "text": "Potassium supplementation for total body depletion",
      "isCorrect": false,
      "rationale": "[Hook] While total body potassium is low, giving it now with serum K+ 5.8 is dangerous. [Breakdown] Potassium will shift back into cells once insulin starts. Supplementation should wait until urine output is established and serum K+ drops below 5.5. [Trap] Never give potassium to a patient with peaked T-waves and an already elevated serum level."
    }
  ],
  "rationale": {
    "coreConcept": "Prioritizing interventions using ABCs and tissue perfusion principles",
    "answerAnalysis": "Fluid resuscitation is the highest priority because the patient is in shock. Circulation (C) comes before Metabolic (M) correction.",
    "clinicalStrategy": "NGN Priority Rule: Perfusion/Shock > Electrolytes/Sugar > Diagnostic Testing.",
    "difficulty": 5
  }
}
```

## Screen 4: Bow-Tie (Generate Solutions)

### 🎯 CRITICAL: Specialized Bow-Tie Option Review
Every Condition, Action, and Parameter must have a [Hook] → [Breakdown] → [Trap] rationale.

```json
{
  "id": "s4",
  "type": "bow-tie",
  "cjmmStep": "Generate Solutions",
  "cjmmPhase": "Generate Solutions",
  "prompt": "Complete the Bow-Tie diagram: Select the primary complication to prevent (center), the two most important nursing actions (left), and the two key monitoring parameters (right).",
  "conditions": [
    {
      "id": "cond1",
      "text": "Cerebral edema",
      "isCorrect": true,
      "rationale": "[Hook] Cerebral edema is the most feared and potentially fatal complication of pediatric DKA treatment. [Breakdown] It occurs in ~1% of cases, often 4-12 hours after treatment starts due to osmotic shifts between the brain and intravascular compartment. [Trap] New-onset diabetes and severe acidosis double the risk; any neurological decline is cerebral edema until proven otherwise."
    },
    {
      "id": "cond2",
      "text": "Hypoglycemia",
      "isCorrect": false,
      "rationale": "[Hook] Hypoglycemia is a later concern that is easily preventable with dextrose. [Breakdown] While important, it does not carry the same immediate mortality risk as cerebral edema in this acute phase. [Trap] Don't focus on the manageable complication while overlooking the fatal one."
    },
    {
      "id": "cond3",
      "text": "Acute Kidney Injury",
      "isCorrect": false,
      "rationale": "[Hook] Prerenal azotemia is expected due to dehydration but usually resolves with fluids. [Breakdown] While BUN is high, it reflects dehydration status rather than intrinsic renal failure. [Trap] Don't misdiagnose 'dry kidneys' as 'failed kidneys' in the early resuscitation phase."
    }
  ],
  "actions": [
    {
      "id": "act1",
      "text": "Administer IV fluids at controlled rate (avoid rapid boluses)",
      "isCorrect": true,
      "rationale": "[Hook] Controlled rehydration over 24-48 hours is critical for preventing cerebral edema. [Breakdown] Rapid fluid administration causes osmotic shifts that draw water into brain cells according to the gradient. [Trap] While you must treat shock initially, all subsequent fluids must be given carefully and gradually."
    },
    {
      "id": "act2",
      "text": "Maintain glucose decline at 50-100 mg/dL per hour",
      "isCorrect": true,
      "rationale": "[Hook] Controlling the rate of glucose decline prevents sudden osmotic gradient changes. [Breakdown] If glucose falls too fast, the brain cannot adapt, leading to intracellular swelling. [Trap] When glucose reaches 250 mg/dL, add dextrose to IV fluids rather than decreasing insulin."
    },
    {
      "id": "act3",
      "text": "Administer bicarbonate to quickly normalize pH",
      "isCorrect": false,
      "rationale": "[Hook] Bicarbonate administration is associated with increased cerebral edema risk. [Breakdown] It causes paradoxical CNS acidosis as CO2 crosses the blood-brain barrier faster than bicarbonate can reach the brain. [Trap] pH will normalize safely as ketosis is halted by insulin."
    }
  ],
  "parameters": [
    {
      "id": "param1",
      "text": "Neurological status checks every hour (GCS, headache)",
      "isCorrect": true,
      "rationale": "[Hook] Hourly neuro checks are the only way to detect early cerebral edema. [Breakdown] Warning signs include bradycardia, hypertension (Cushing's triad), pupillary changes, and declining mentation. [Trap] Deteriorating mental status should never be dismissed as 'tiredness' from the critical care environment."
    },
    {
      "id": "param2",
      "text": "Serum sodium trend (should rise 1-2 mEq for each 100 mg glucose drop)",
      "isCorrect": true,
      "rationale": "[Hook] Rising sodium during treatment indicates success; falling sodium equals danger. [Breakdown] If sodium fails to rise as glucose drops, it suggests free water excess relative to solutes. [Trap] A falling sodium trend is often the earliest biochemical sign of impending cerebral edema."
    }
  ],
  "correct": {
    "condition": "cond1",
    "actions": ["act1", "act2"],
    "parameters": ["param1", "param2"]
  },
  "rationale": {
    "coreConcept": "Preventing treatment-induced complications through controlled rehydration",
    "answerAnalysis": "The primary goal is preventing cerebral edema (cond1) by controlling fluid rates (act1) and glucose decline (act2), while monitoring mental status (param1) and sodium trends (param2).",
    "clinicalStrategy": "The 'Slow and Steady' rule: avoid rapid electrolyte or osmotic shifts in pediatric patients.",
    "difficulty": 5
  }
}
```

## Screen 5: Drop-Cloze (Take Action)

### 🎯 CRITICAL: Decision-Based Action Rationale
Every dropdown option must have a 3-part rationale explaining the choice.

```json
{
  "id": "s5",
  "type": "drop-cloze",
  "cjmmStep": "Take Action",
  "cjmmPhase": "Take Action",
  "prompt": "Complete the nursing action statement for this pediatric DKA patient.",
  "text": "After the initial fluid bolus, the nurse should position the patient %{d1}% and ensure %{d2}% is immediately available at the bedside.",
  "dropdowns": [
    {
      "id": "d1",
      "options": [
        {
          "id": "d1-o1",
          "text": "with head of bed elevated 30 degrees",
          "isCorrect": true,
          "rationale": "[Hook] HOB elevation to 30 degrees is recommended to reduce intracranial pressure. [Breakdown] This position promotes venous drainage from the brain while maintaining adequate cerebral perfusion. [Trap] This should be maintained throughout the first 24 hours of treatment."
        },
        {
          "id": "d1-o2",
          "text": "flat in supine position",
          "isCorrect": false,
          "rationale": "[Hook] Flat positioning increases intracranial pressure and cerebral edema risk. [Breakdown] The brain is vulnerable to swelling during DKA treatment due to osmotic shifts. [Trap] While used for procedures, it should not be the continuous position for these patients."
        }
      ]
    },
    {
      "id": "d2",
      "options": [
        {
          "id": "d2-o1",
          "text": "mannitol (0.5-1 g/kg) or 3% hypertonic saline",
          "isCorrect": true,
          "rationale": "[Hook] Osmotic therapy must be immediately available for emergent treatment of cerebral edema. [Breakdown] Having the medication at bedside allows for immediate administration if neurological warning signs develop. [Trap] This is the first-line treatment for DKA-related cerebral edema."
        },
        {
          "id": "d2-o2",
          "text": "sodium bicarbonate infusion",
          "isCorrect": false,
          "rationale": "[Hook] Bicarbonate is not routinely used and may increase cerebral edema risk. [Breakdown] Acidosis will correct with fluids and insulin; bicarbonate administration is rarely needed. [Trap] Having it at the bedside could lead to inappropriate and harmful administration."
        }
      ]
    }
  ],
  "rationale": {
    "coreConcept": "Positioning and emergency preparedness for intracranial complications",
    "answerAnalysis": "Head elevation and osmotic therapy availability are standard safety measures to combat and manage cerebral edema risk.",
    "clinicalStrategy": "Anticipate the most life-threatening complication and prepare for it before it happens.",
    "difficulty": 5
  }
}
```

## Screen 6: Multiple-Response (Evaluate Outcomes)

### 🎯 CRITICAL: Outcome Evaluation Rationale
Every option must explain why it indicates improvement or deterioration using the 3-part structure.

```json
{
  "id": "s6",
  "type": "multiple-response",
  "cjmmStep": "Evaluate Outcomes",
  "cjmmPhase": "Evaluate Outcomes",
  "prompt": "After implementing interventions, which findings indicate treatment has been effective? Select all that apply.",
  "options": [
    {"id": "o1", "text": "Correct improvement indicator 1", "isCorrect": true, "rationale": "Minimum 15 words explaining clinical significance."},
    {"id": "o2", "text": "Correct improvement indicator 2", "isCorrect": true, "rationale": "Minimum 15 words with normal values."},
    {"id": "o3", "text": "Correct improvement indicator 3", "isCorrect": true, "rationale": "Minimum 15 words explaining physiology."},
    {"id": "o4", "text": "Correct improvement indicator 4", "isCorrect": true, "rationale": "Minimum 15 words with clinical reasoning."},
    {"id": "o5", "text": "Incorrect - warning sign", "isCorrect": false, "rationale": "Minimum 15 words explaining why this indicates WORSENING."},
    {"id": "o6", "text": "Incorrect - not reliable marker", "isCorrect": false, "rationale": "Minimum 15 words explaining why not useful for acute monitoring."}
  ],
  "rationale": {
    "coreConcept": "Objective evaluation of treatment success",
    "answerAnalysis": "Improvement indicators vs. warning signs",
    "clinicalStrategy": "Using objective markers for reassessment",
    "difficulty": 5
  }
}
```

---

# PART 5: CASE-LEVEL RATIONALE (Powers All Clinical Reasoning Tabs)

## 🧠 The Knowledge Tab - `referenceInfo` Object

The **Knowledge** tab displays three beautiful cards with foundational knowledge:
- 🔷 **PHYSIOLOGY** (cyan) - Explains the "why" behind the clinical presentation
- 🔶 **ANATOMY** (teal) - Structural/spatial relationships relevant to the condition
- 💜 **PHARMACOLOGY** (pink) - Medications, mechanisms, and nursing considerations

### ⚠️ CRITICAL: Content Must Be Case-Specific, NOT Generic!

**❌ UNACCEPTABLE (Generic):**
```json
"referenceInfo": {
  "anatomy": "Review relevant anatomy.",
  "physiology": "Understand the pathophysiology.",
  "pharm": "Know the medications."
}
```

**✅ REQUIRED (Case-Specific):**
```json
"referenceInfo": {
  "physiology": "Cushing's Reflex: Ischemia triggers sympathetic surge (High BP) → Baroreceptors trigger parasympathetic response (Low HR).",
  "anatomy": "The skull is a fixed cavity (Monro-Kellie Doctrine). Swelling compresses the brainstem through the foramen magnum.",
  "pharm": "Mannitol: Osmotic diuretic. 3% Hypertonic Saline: Draws water out of edematous brain tissue."
}
```

### Knowledge Tab Template by Condition Type:

#### Cardiac Conditions:
```json
"referenceInfo": {
  "physiology": "[Describe the hemodynamic principle] → [Effect on cardiac output] → [Compensatory mechanism]. Example: 'In cardiogenic shock, pump failure leads to decreased CO → tissue hypoperfusion → anaerobic metabolism → lactic acidosis.'",
  "anatomy": "[Relevant cardiac structures]. Example: 'Left ventricle → Aorta → Systemic circulation. LV failure causes backup into pulmonary veins → pulmonary edema.'",
  "pharm": "[Primary medication]: [Mechanism]. [Secondary medication]: [Mechanism]. Example: 'Dobutamine: β1 agonist increases contractility. Furosemide: Loop diuretic reduces preload.'"
}
```

#### Respiratory Conditions:
```json
"referenceInfo": {
  "physiology": "[Gas exchange principle]. Example: 'V/Q mismatch in PE: Ventilation preserved but perfusion blocked → hypoxemia refractory to supplemental O2.'",
  "anatomy": "[Airway/lung structures]. Example: 'Pulmonary arteries branch with bronchi. Embolus lodges at bifurcation points → wedge infarct pattern on imaging.'",
  "pharm": "[Anticoagulants/bronchodilators]. Example: 'Heparin: Prevents clot extension. tPA: Lyses existing clot (reserved for massive PE with hemodynamic instability).'"
}
```

#### Neurological Conditions:
```json
"referenceInfo": {
  "physiology": "[Neural pathway affected]. Example: 'Cushing's Reflex: Brain ischemia → sympathetic surge (↑BP) → baroreceptor reflex (↓HR) → classic triad of HTN + bradycardia + irregular respirations.'",
  "anatomy": "[Brain structure/skull relationship]. Example: 'Monro-Kellie Doctrine: Fixed cranial vault contains brain (80%), blood (10%), CSF (10%). ↑Any component → ↑ICP → herniation risk.'",
  "pharm": "[Osmotic therapy/seizure meds]. Example: 'Mannitol: Osmotic gradient draws water from brain tissue. 3% NaCl: Alternative hyperosmolar therapy. Avoid hypotonic fluids.'"
}
```

#### Metabolic/Endocrine Conditions:
```json
"referenceInfo": {
  "physiology": "[Metabolic pathway]. Example: 'In DKA: Insulin deficiency → cells can't use glucose → lipolysis → ketone production → metabolic acidosis → Kussmaul respirations.'",
  "anatomy": "[Organ involved]. Example: 'Pancreatic β-cells produce insulin. Type 1 DM: Autoimmune destruction. Type 2 DM: Insulin resistance with eventual β-cell exhaustion.'",
  "pharm": "[Insulin types/fluids]. Example: 'Regular insulin IV infusion: Rapid onset, short duration, titratable. Continue until AG closes, not until glucose normalizes.'"
}
```

---

## Complete Case-Level Rationale Structure:

```json
"rationale": {
  "coreConcept": "The central clinical principle this case teaches (e.g., 'Recognizing cardiogenic shock in acute heart failure')",
  "caseSummary": "2-3 sentence overview: [Patient profile] with [condition] presenting with [key findings]. The clinical challenge focuses on [educational objective] while avoiding [common pitfall].",
  "answerAnalysis": "See option review for detailed analysis",
  "goldenRule": "One-sentence clinical pearl that the student should NEVER forget. Example: 'In cardiogenic shock, the heart is both the problem and the victim—you cannot improve perfusion with volume alone.'",
  "trap": "The most common mistake students make on this topic. Example: 'Don't give IV fluids to a patient already drowning in their own secretions.'",
  "steps": [],
  "difficulty": {
    "level": 5,
    "score": 100,
    "label": "Evaluation",
    "subtext": "Requires synthesis of multiple data points and prioritization under pressure",
    "clinicalStrategy": "Apply ABC prioritization while recognizing that circulation failure supersedes isolated symptoms",
    "recommendedActions": [
      "Practice recognizing shock patterns",
      "Review inotrope vs vasopressor indications",
      "Study lactate clearance as perfusion marker"
    ]
  },
  "mnemonic": {
    "title": "PUMP-FAIL",
    "content": "P: Perfusion markers (lactate, UOP, mentation); U: Upright positioning; M: MAP goal ≥65; P: Positive-pressure ventilation; F: Furosemide with inotropes; A: Avoid fluids; I: Inotropic support; L: Lactate clearance",
    "explanation": "Reminds you to support the failing pump while avoiding interventions that increase its workload"
  },
  "cheatSheet": {
    "title": "Cardiogenic Shock Protocol",
    "points": [
      "Recognize Triad: Hypotension + Cold extremities + Elevated lactate",
      "Position: High-Fowler's to reduce preload",
      "Oxygen: BiPAP preferred over intubation initially",
      "Inotropes: Dobutamine for pump failure (NOT vasopressors alone)",
      "Diuresis: Only after perfusion is supported",
      "Monitor: MAP ≥65, UOP ≥0.5 mL/kg/hr, Lactate trending down"
    ]
  },
  "referenceInfo": {
    "physiology": "In cardiogenic shock, the failing left ventricle cannot generate adequate cardiac output (CO = HR × SV). This leads to decreased tissue perfusion → anaerobic metabolism → lactate accumulation. The body compensates with tachycardia and vasoconstriction, but these increase myocardial oxygen demand, worsening the spiral.",
    "anatomy": "Left ventricle → Aortic valve → Ascending aorta → Systemic circulation. When LV fails, blood backs up into left atrium → pulmonary veins → pulmonary capillaries → alveolar flooding (pulmonary edema). This is why you hear crackles and see pink frothy sputum.",
    "pharm": "Dobutamine: β1-agonist that increases contractility (positive inotropy) without significantly increasing afterload. Furosemide: Loop diuretic that reduces preload by promoting diuresis—but only give AFTER starting inotropes, otherwise you further compromise the already empty tank. AVOID β-blockers in acute decompensation."
  },
  "clinicalStrategy": "Use the 'Perfusion Triangle': 1) Pressure (MAP ≥65), 2) Periphery (warm skin, good cap refill), 3) Products (lactate clearing). If any leg of the triangle is abnormal, perfusion is inadequate."
}
```

### 📋 EXAMPLE FROM NEURO-TR (Increased ICP/Cushing's Triad):

```json
"referenceInfo": {
  "physiology": "Cushing's Reflex: Ischemia triggers sympathetic surge (High BP) → Baroreceptors trigger parasympathetic response (Low HR).",
  "anatomy": "The skull is a fixed cavity (Monro-Kellie Doctrine). Swelling compresses the brainstem through the foramen magnum.",
  "pharm": "Mannitol: Osmotic diuretic. 3% Hypertonic Saline: Draws water out of edematous brain tissue."
}
```

### ⚠️ KNOWLEDGE TAB VALIDATION RULES:

1. **Each field must be 20+ words** - No single-sentence placeholders
2. **Must be case-specific** - Reference actual pathophysiology, not generic advice
3. **Include specific drug names** - Not just "medications" but actual drugs with mechanisms
4. **Include specific anatomy** - Name structures, describe spatial relationships
5. **Include specific physiology** - Explain the mechanism, use arrows (→) for pathways
6. **Use clinical language** - Write for nursing students, not laypeople

---



# COMPLETE JSON TEMPLATE

Generate a case study following this exact structure:

```json
{
  "id": "CONDITION-ABBREV-001",
  "type": "case-study",
  "typeId": "case-study-6-screen",
  "metadata": { /* Part 2 */ },
  "pedagogy": { /* Part 3 */ },
  "content": {
    "clinicalData": { /* Part 1 - ALL sections */ },
    "rationale": { /* Part 5 */ },
    "structure": {
      "screens": [ /* Part 4 - All 6 screens */ ],
      "type": "case-study",
      "prompt": "Review the case study and answer the question.",
      "difficulty": 5
    },
    "patient": {
      "age": "Unknown",
      "gender": "Unknown",
      "diagnosis": "Pending"
    }
  },
  "difficulty": 5,
  "difficultyLevel": 5,
  "_unifiedPipelineProcessed": true,
  "_sanitized": true
}
```

---

# CRITICAL VALIDATION RULES

## ❌ BANNED - Will Cause Validation Failure:
1. Any rationale with fewer than 15 words
2. Generic phrases: "correct answer", "incorrect answer", "this is correct/incorrect"
3. Missing `rationale` field on ANY option, row, or item
4. Using `highlightReview` instead of `rationales` (plural) for highlight screens
5. Bow-Tie pools with strings instead of objects with rationales
6. Drop-Cloze without `correctAnswer` field in each dropdown
7. Missing `cjmmStep` and `cjmmPhase` on any screen
8. Missing any section in `clinicalData` (will cause empty tabs)

## ✅ REQUIRED - Must Include:
1. All 6 screens in CJMM order
2. Minimum 3 vital sign entries showing progression
3. Minimum 3 nurses notes showing timeline
4. Minimum 5 lab values with appropriate flags
5. Complete HTML-formatted `historyPhysical`
6. All rationales with educational value (Hook/Breakdown/Trap format)
7. Time progression that tells a clinical story

---

# GENERATION INSTRUCTIONS

Generate a complete case study for: **{TOPIC}**

Clinical Setting: **{SETTING}**
Difficulty Level: **{DIFFICULTY}**
Focus Areas: **{FOCUS_AREAS}**

The case must:
1. Tell a coherent clinical story across the time progression
2. Include deterioration and/or response to treatment
3. Provide rich educational rationales for every option
4. Align all 6 screens with the CJMM framework
5. Be immediately usable in an EHR simulator without modification

Output ONLY the JSON - no explanations, no markdown.
