# GOLDEN NGN TREND ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS (FILL FIRST)
text
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 3
[SCORE]    = 75      (CRITICAL: Use 85-95 for Expert/Level 5. Use 65-75 for Analysis/Level 3)


## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Standalone Trend Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- All keys and string values: Double quotes only.
- NO trailing commas.

### 2. TREND SPECIFIC RULES
- **Time Points:** You MUST provide at least 3 distinct time points in the `vitals` array.
- **Trajectory:** The values must show a clear clinical progression (e.g., deteriorating sepsis, improving respiratory status).
- **Structure:** The `vitals` array IS the trend. Do not create a separate "trend table" object.

---

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (Requirement: 3 Time Points):**
```json
"vitals": [
  { "time": "0800", "tempF": "99.0", "hr": 88, "rr": 18, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 2 },
  { "time": "0900", "tempF": "100.5", "hr": 102, "rr": 22, "bp": "110/70", "o2": "94", "o2_device": "2L NC", "pain": 4 },
  { "time": "1000", "tempF": "102.1", "hr": 118, "rr": 26, "bp": "90/58", "o2": "90", "o2_device": "4L NC", "pain": 6 }
]
```

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown:**
```json
"rationale": {
  "coreConcept": "Clinical Deterioration",
  "caseSummary": "Patient showing signs of sepsis progression...",
  "answerAnalysis": "The trend in HR (increasing) and BP (decreasing) indicates...",
  "trap": "Responding to single value instead of trend",
  "goldenRule": "Trends provide earlier warning than thresholds",
  "steps": [
    { "tag": "Recognize", "description": "Identify trend direction" },
    { "tag": "Analyze", "description": "Correlate with physiology" }
  ],
  "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
  "cheatSheet": { "title": "Trends", "points": ["Shock: HR Up, BP Down"] },
  "referenceInfo": {
    "anatomy": "CASE-SPECIFIC anatomy (Teach the structure)",
    "physiology": "CASE-SPECIFIC mechanism (e.g., 'As shock progresses, SVR increases...')",
    "pharm": "CASE-SPECIFIC drugs (e.g., 'Vasopressors constrict...') or 'N/A'"
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard",
    "clinicalStrategy": "Look at the rate of change",
    "recommendedActions": ["Compare time points", "Identify the worst value"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review vital signs."
**✅ REQUIRED:** "As cardiac output falls in shock, heart rate increases to compensate..."

---

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "trend",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Hard", 
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Analyze Cues",
      "targetScore": [SCORE]
    },
    "patient": { 
      "name": "Initials", "age": 60, "sex": "Female", "allergies": "NKDA", "weightKg": 70
    },
    "setting": "Step-down Unit",
    "chiefComplaint": "Shortness of breath",
    "vitals": [ ...THREE TIME POINTS... ],
    "historyPhysical": {
      "chiefComplaint": "Shortness of breath",
      "hpi": "History...",
      "pmh": "History...",
      "allergies": "NKDA",
      "medications": ["Meds..."],
      "socialHistory": "Social...",
      "surgicalHistory": "Surgical..."
    },
    "labs": [
        { "test": "WBC", "value": "12.5", "flag": "H", "reference": "4.5-11.0", "unit": "10^3/uL" }
    ],
    "orders": [],
    "nursesNotes": [ ... ],
    "rationale": { 
      "general": "Detailed explanation of the trend significance...",
      "pathophysiology": "Deep dive into the physiological mechanism driving the trend.",
      "safetyCheck": "Critical safety warnings.",
      "clinicalTakeaway": "Key teaching point for future practice.",
      "mnemonic": {
        "title": "ACRONYM_NAME (e.g., MONA, FAST, FACES)",
        "content": "Letter-by-letter breakdown of the mnemonic",
        "explanation": "How this mnemonic helps in clinical decision-making"
      }
    },
    "structure": {
      "type": "trend",
      "prompt": "Review the trend data. Which findings correspond to the client's condition?",
      "questionFormat": "sata",
      "options": [
        { "id": "o1", "text": "Hypotension", "isCorrect": true, "rationale": "consistent with trend" },
        { "id": "o2", "text": "Bradycardia", "isCorrect": false, "rationale": "trend shows tachycardia" },
        { "id": "o3", "text": "Hypoxia", "isCorrect": true, "rationale": "O2 dropped" }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Trend at Level [LEVEL].
Output ONLY JSON.