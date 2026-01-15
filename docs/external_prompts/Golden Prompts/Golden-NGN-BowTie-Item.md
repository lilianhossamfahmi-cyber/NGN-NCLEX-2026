# GOLDEN NGN BOW-TIE ITEM GENERATOR (v4 - PRODUCTION READY)

## 📌 PARAMETERS (FILL FIRST)
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 3
[SCORE]    = 75      
# (CRITICAL: Use 5 for Expert/Complex. Use 3 for Competent/Standard)

## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer & Clinical Nurse Educator
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Standalone Bow-Tie Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- **Top-Level Field:** Must include `"prompt"` (Question Stem) as a string.
- **Type Field:** `"type": "bow-tie"`
- **Syntax:** Double quotes only. No trailing commas. Escape newlines as "\n".

### 2. BOW-TIE GAME MECHANICS (STRICT)
You must generate a `structure` object with exactly:
- **Actions (Left):** Total **5** options (2 Correct, 3 Distractors).
- **Condition (Center):** Total **4** options (1 Correct, 3 Distractors).
- **Parameters (Right):** Total **5** options (2 Correct, 3 Distractors).
- **Uniqueness:** All option text must be unique. No duplicates.

### 3. CLINICAL DATA REQUIREMENTS (BY LEVEL)
**IF LEVEL 5 (EXPERT):**
- **Nurses Notes:** Minimum **3** detailed entries showing a timeline.
- **Vitals:** Minimum **2** readings showing a trend (deterioration/improvement).
- **History:** Full H&P object required.
- **Complexity:** Patient must have comorbidities (e.g., DM, HTN).

**IF LEVEL 3 (COMPETENT):**
- **Nurses Notes:** Minimum **1** detailed entry.
- **Vitals:** Minimum **1** full set.

### 4. RATIONALE STRUCTURE
Rationale MUST be an object with these 4 keys: `general`, `pathophysiology`, `safetyCheck`, `clinicalTakeaway`.

---

## 🏥 CLINICAL DATA GOLD STANDARDS (COMPLETE)

### 1. Vitals (MINIMUM 2 readings to show trend)
```json
"vitals": [
  { "time": "0800", "tempF": "101.5", "hr": 115, "rr": 24, "bp": "88/52", "o2": "92", "o2_device": "4L NC", "pain": 7 },
  { "time": "0815", "tempF": "102.0", "hr": 120, "rr": 28, "bp": "84/50", "o2": "88", "o2_device": "Non-Rebreather", "pain": 8 }
]
```

### 2. Nurses Notes (MINIMUM 2 entries for Level 5)
```json
"nursesNotes": [
  { "time": "0800", "author": "RN Smith", "entry": "Initial assessment: Pt alert but anxious..." },
  { "time": "0830", "author": "RN Smith", "entry": "Follow-up: Condition deteriorating..." }
]
```

### 3. History & Physical (REQUIRED for Level 4-5)
```json
"historyPhysical": {
  "chiefComplaint": "Shortness of breath",
  "hpi": "72-year-old male with PMH of CHF presents with...",
  "pmh": ["CHF", "Type 2 DM"],
  "medications": ["Lasix 40mg", "Metoprolol"],
  "allergies": "Penicillin",
  "socialHistory": "Former smoker",
  "reviewOfSystems": {
    "constitutional": "Fatigue",
    "cardiovascular": "Dyspnea"
  },
  "physicalExam": {
    "general": "Anxious",
    "cardiovascular": "S3 gallop",
    "respiratory": "Bilateral crackles"
  }
}
```

### 4. Medical Orders & Radiology (Consistent with Scenario)
- **Orders:** Must include at least 3 relevant orders (e.g., Labs, Meds, Diet).
- **Radiology:** Include if clinically indicated (e.g., CXR for pneumonia).


## 🧠 RATIONALE EXAMPLE
```json
"rationale": {
  "general": "Eclampsia is the onset of seizures in a patient with preeclampsia...",
  "pathophysiology": "Cerebral vasospasm leads to ischemia and electrical discharge...",
  "safetyCheck": "CRITICAL: Magnesium toxicity causes respiratory depression. Keep Calcium Gluconate nearby.",
  "clinicalTakeaway": "Stop the seizure first, then control BP, then deliver.",
  "mnemonic": {
    "title": "HELLP (for HELLP Syndrome)",
    "content": "H-Hemolysis, E-Elevated Liver enzymes, L-Low Platelets",
    "explanation": "HELLP syndrome is a severe complication of preeclampsia. Monitor for RUQ pain, jaundice, and bleeding."
  }
}
```
**MNEMONIC REQUIREMENT:** Every case MUST include a `mnemonic` object with a relevant nursing memory aid (SCORTEN, CRUSH, MONA, FAST, FACES, etc.) or create a condition-specific acronym.


---

## � JSON STRUCTURE (STRICT TEMPLATE)

```json
{
  "type": "bow-tie",
  "prompt": "Read the case study and complete the diagram by selecting the most appropriate Condition, Actions (2), and Parameters (2).",
  "metadata": {
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Generate Solutions",
      "targetScore": [SCORE]
  },
  "content": {
    "patient": {
      "name": "Initials", "age": 50, "gender": "Male", "allergies": "NKDA", "weightKg": 80, "codeStatus": "Full Code"
    },
    "setting": "ICU/ER/MedSurg",
    "historyPhysical": {
        "chiefComplaint": "...",
        "hpi": "...",
        "pmh": ["..."],
        "medications": ["..."]
    },
    "nursesNotes": [
        { "time": "0800", "author": "RN Smith", "entry": "Note 1..." },
        { "time": "0815", "author": "RN Smith", "entry": "Note 2..." }
    ],
    "vitalSigns": [
        { "time": "0800", "tempF": "...", "hr": 0, "rr": 0, "bp": "...", "o2": "...", "o2_device": "...", "pain": 0 }
    ],
    "laboratory": [
        { "test": "WBC", "value": "12.5", "flag": "H", "reference": "4.5-11.0", "unit": "10^3/uL", "date": "Today" }
    ],
    "orders": [],
    "radiology": []
  },
  "rationale": {
    "general": "Detailed explanation of the condition and why it fits the cues...",
    "pathophysiology": "Deep dive into the mechanism (The 'Why'). Explain the disease process step-by-step.",
    "safetyCheck": "Critical safety warnings and immediate life-saving considerations.",
    "clinicalTakeaway": "Key teaching point for future practice. What must the nurse 'Understand' forever?",
    "mnemonic": {
      "title": "ACRONYM_NAME (e.g., SCORTEN, CRUSH, MONA)",
      "content": "Letter-by-letter breakdown of the mnemonic",
      "explanation": "How this mnemonic helps in clinical decision-making for this specific condition"
    }
  },
  "structure": {
    "actions": [
      { "id": "a1", "text": "Correct Action 1", "isCorrect": true },
      { "id": "a2", "text": "Correct Action 2", "isCorrect": true },
      { "id": "a3", "text": "Distractor 1", "isCorrect": false },
      { "id": "a4", "text": "Distractor 2", "isCorrect": false },
      { "id": "a5", "text": "Distractor 3", "isCorrect": false }
    ],
    "conditions": [
      { "id": "c1", "text": "Correct Condition", "isCorrect": true },
      { "id": "c2", "text": "Distractor 1", "isCorrect": false },
      { "id": "c3", "text": "Distractor 2", "isCorrect": false },
      { "id": "c4", "text": "Distractor 3", "isCorrect": false }
    ],
    "parameters": [
      { "id": "p1", "text": "Correct Parameter 1", "isCorrect": true },
      { "id": "p2", "text": "Correct Parameter 2", "isCorrect": true },
      { "id": "p3", "text": "Distractor 1", "isCorrect": false },
      { "id": "p4", "text": "Distractor 2", "isCorrect": false },
      { "id": "p5", "text": "Distractor 3", "isCorrect": false }
    ]
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Bow-Tie at Level [LEVEL].
Output ONLY JSON.