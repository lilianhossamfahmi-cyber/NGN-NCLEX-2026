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
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Trend Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "SEPSIS-TRN-9X2Y"`
- **Topic Mapping:** Map the [FOCUS] to appropriate topic.


### 2. TREND RULES
- **Time Points:** Minimum 3 points to show a trend.
- **Parameters:** Minimum 2 parameters (e.g., HR and BP).
- **Structure:** `trendData` object is REQUIRED.

---

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
```json
"vitals": [
  { "time": "0800", "tempF": "98.6", "hr": 80, "rr": 18, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 0 }
]
```

**Nurse's Notes (Difficulty Based):**
- **Level 3 (Analysis):** Minimum 1 detailed note (100+ words).
- **Level 4/5 (Expert):** MUST include **2-3 notes** at different timepoints to show progression.

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown:**
```json
"rationale": {
  "coreConcept": "Concept Name",
  "caseSummary": "Summary",
  "answerAnalysis": "Breakdown...",
  "trap": "Trap description",
  "goldenRule": "Rule description",
  "steps": [ ... ],
  "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
  "cheatSheet": { "title": "...", "points": [...] },
  "referenceInfo": {
    "anatomy": "...",
    "physiology": "...",
    "pharm": "..."
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard",
    "subtext": "Requires analyzing trends over time.",
    "clinicalStrategy": "Identify the trajectory (improving/worsening)",
    "recommendedActions": ["Check earliest vs latest"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review trends."
**✅ REQUIRED:** "Cushing's Triad (bradycardia, hypertension, bradypnea) indicates increasing ICP..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-TRN-HEX`).
- [ ] `trendData` contains `timePoints`.
- [ ] `trendData` contains `parameters`.
- [ ] Mnemonic explanation is included.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "trend",
  "id": "[FOCUS]-TRN-[HEX]",
  "content": {
    "prompt": "Review the trend data and answer the question.",
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
        "name": "Initials", "age": 45, "gender": "Male", "allergies": "NKDA", "weightKg": 90, "codeStatus": "Full Code"
      },
      "setting": "ICU",
      "historyPhysical": {
        "chiefComplaint": "Problem",
        "hpi": "History...",
        "pmh": ["..."],
        "medications": ["..."]
      },
      "history": [
        { "time": "0800", "author": "RN Smith", "note": "Initial assessment..." }
      ],
      "vitals": [
        { "time": "0800", "tempF": "98.6", "hr": 80, "rr": 18, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 0 }
      ],
      "labs": [],
      "orders": [],
      "radiology": []
    },
    "rationale": {
      "coreConcept": "...",
      "caseSummary": "...",
      "answerAnalysis": "...",
      "trap": "...",
      "goldenRule": "...",
      "steps": [],
      "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
      "cheatSheet": { "title": "...", "points": [] },
      "referenceInfo": { "anatomy": "...", "physiology": "...", "pharm": "..." },
      "difficulty": { 
          "level": [LEVEL], 
          "score": [SCORE], 
          "label": "Analysis",
          "subtext": "Trend analysis.",
          "clinicalStrategy": "Trend recognition.",
          "recommendedActions": ["Plot points"]
      }
    },
    "structure": {
      "type": "trend",
      "trendData": {
        "timePoints": [
          { "id": "t1", "timeLabel": "0800" },
          { "id": "t2", "timeLabel": "0900" },
          { "id": "t3", "timeLabel": "1000" }
        ],
        "parameters": [
            { "name": "Systolic BP", "values": ["110", "100", "90"] },
            { "name": "Heart Rate", "values": ["80", "95", "115"] }
        ]
      },
      "questionFormat": "multiple-response",
      "options": [
        { "id": "o1", "text": "Correct Option", "isCorrect": true, "rationale": "Explanation" },
        { "id": "o2", "text": "Incorrect Option", "isCorrect": false, "rationale": "Explanation" }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Trend at Level [LEVEL].
Output ONLY JSON.