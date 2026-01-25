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

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "CRIT-TRD-L2M3"`
- **Topic Mapping:** Map the [FOCUS] to one of: Critical Care, Cardiology, etc.


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
  "coreConcept": "Clinical Deterioration (The 'Hook')",
  "caseSummary": "Patient showing signs of sepsis progression... (The 'Story')",
  "answerAnalysis": "The trend in HR (increasing) and BP (decreasing) indicates... (The 'Breakdown')",
  "trap": "Responding to single value instead of trend (The 'Trap')",
  "goldenRule": "Trends provide earlier warning than thresholds (The 'Pearl')",
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
    "subtext": "Requires analyzing vital sign trends over time.",
    "clinicalStrategy": "Look at the rate of change",
    "recommendedActions": ["Compare time points", "Identify the worst value"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review vital signs."
**✅ REQUIRED:** "As cardiac output falls in shock, heart rate increases to compensate..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-TRD-HEX`).
- [ ] `vitals` has at least 3 time points.
- [ ] The scenario shows a clear clinical trend.
- [ ] `rationale` object strictly follows the v4 schema.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "trend",
  "id": "[FOCUS]-TRD-[HEX]",
  "content": {
    "prompt": "Review the trend data. Which findings correspond to the client's condition?",
    "metadata": {
      "title": "[FOCUS] Trend Scenario",
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Analyze Cues",
      "targetScore": [SCORE]
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Initials", "age": 60, "gender": "Female", "allergies": "NKDA", "weightKg": 70, "codeStatus": "Full Code"
      },
      "setting": "Step-down Unit",
      "historyPhysical": {
        "chiefComplaint": "Shortness of breath",
        "hpi": "History...",
        "pmh": ["..."],
        "medications": ["..."]
      },
      "history": [
        { "time": "0800", "author": "RN Smith", "note": "Initial assessment..." }
      ],
      "vitals": [
        { "time": "0800", "tempF": "99.0", "hr": 88, "rr": 18, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 2 },
        { "time": "0900", "tempF": "100.5", "hr": 102, "rr": 22, "bp": "110/70", "o2": "94", "o2_device": "2L NC", "pain": 4 },
        { "time": "1000", "tempF": "102.1", "hr": 118, "rr": 26, "bp": "90/58", "o2": "90", "o2_device": "4L NC", "pain": 6 }
      ],
      "labs": [
        { "test": "WBC", "value": "12.5", "flag": "H", "ref": "4.5-11.0", "unit": "10^3/uL" }
      ],
      "orders": [],
      "radiology": []
    },
    "rationale": { 
      "coreConcept": "Clinical Deterioration",
      "caseSummary": "Patient showing signs of...",
      "answerAnalysis": "The trend in HR...",
      "trap": "Responding to single value...",
      "goldenRule": "Trends provide earlier warning...",
      "steps": [],
      "mnemonic": {},
      "cheatSheet": {},
      "referenceInfo": {
          "anatomy": "...",
          "physiology": "...",
          "pharm": "..."
      },
      "difficulty": {
          "level": [LEVEL],
          "score": [SCORE],
          "label": "Analysis",
          "subtext": "Trend analysis required.",
          "clinicalStrategy": "Identify direction of change.",
          "recommendedActions": ["Check initial vs final", "Calculate rate of change"]
      }
    },
    "structure": {
      "type": "trend",
      "questionFormat": "sata",
      "options": [
        { "id": "o1", "text": "Hypotension", "isCorrect": true, "rationale": "consistent with trend (BP 120->110->90)" },
        { "id": "o2", "text": "Bradycardia", "isCorrect": false, "rationale": "trend shows tachycardia (88->102->118)" },
        { "id": "o3", "text": "Hypoxia", "isCorrect": true, "rationale": "O2 dropped (98->94->90)" }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Trend at Level [LEVEL].
Output ONLY JSON.