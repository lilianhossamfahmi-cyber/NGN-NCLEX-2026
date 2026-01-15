# GOLDEN NGN MULTIPLE RESPONSE (SATA) ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone SATA Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. SATA RULES
- **Options:** 5-6 items.
- **Correct:** Min 2, Max N-1 correct.
- **Independence:** Each option must be true/false on its own merit.

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
- **Level 4/5 (Expert):** MUST include **2-3 notes** at different timepoints (e.g., 0800, 0815, 0830) to show clinical progression or deterioration.
  ```json
  "nursesNotes": [
    { "time": "0800", "author": "RN", "note": "Initial assessment..." },
    { "time": "0815", "author": "RN", "note": "Patient status changed..." }
  ]
  ```

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown:**
```json
"rationale": {
  "coreConcept": "Concept Name",
  "caseSummary": "Summary",
  "answerAnalysis": "Why Option A is correct...",
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
    "clinicalStrategy": "Treat each option as True/False",
    "recommendedActions": ["Eliminate absolutes"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review symptoms."
**✅ REQUIRED:** "Hyperkalemia causes peaked T-waves due to rapid repolarization..."

---

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "multiple_response",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Hard", 
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Obtain Information",
      "targetScore": [SCORE]
    },
    "patient": { 
      "name": "Initials", "age": 45, "sex": "Male", "allergies": "NKDA", "weightKg": 90
    },
    "setting": "Clinic",
    "chiefComplaint": "Symptoms",
    "vitals": [ ... ],
    "historyPhysical": {
      "chiefComplaint": "Symptoms",
      "hpi": "History...",
      "pmh": "History...",
      "allergies": "NKDA",
      "medications": ["Meds..."],
      "socialHistory": "Social...",
      "surgicalHistory": "Surgical..."
    },
    "labs": [],
    "orders": [],
    "nursesNotes": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "multiple_response",
      "prompt": "Select all that apply.",
      "options": [
        { "id": "o1", "text": "Correct Option", "isCorrect": true, "rationale": "Why correct" },
        { "id": "o2", "text": "Incorrect Option", "isCorrect": false, "rationale": "Why incorrect" }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] SATA at Level [LEVEL].
Output ONLY JSON.