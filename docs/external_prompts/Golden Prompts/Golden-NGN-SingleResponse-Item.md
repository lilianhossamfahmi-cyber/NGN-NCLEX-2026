# GOLDEN NGN SINGLE RESPONSE ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS (FILL FIRST)
text
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 2
[SCORE]    = 60      (CRITICAL: Use 85-95 for Expert/Level 5. Use 55-65 for Application/Level 2)


## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Single Response Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "PSYCH-MCQ-F9G0"`
- **Topic Mapping:** Map the [FOCUS] to appropriate topic.


### 2. SINGLE RESPONSE RULES
- **Options:** Exactly 4.
- **Answer:** Exactly ONE correct option.

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
    { "time": "0800", "author": "RN", "note": "Initial assessment shows..." },
    { "time": "0815", "author": "RN", "note": "Patient status deteriorating..." }
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
    "clinicalStrategy": "Identify the priority",
    "recommendedActions": ["Eliminate clearly wrong answers"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review topic."
**✅ REQUIRED:** "Prioritize Airway: Stridor indicates upper airway obstruction..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-MCQ-HEX`).
- [ ] Exactly one option is correct.
- [ ] Exactly 4 options are provided.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "single-response",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Moderate", 
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "patient": { 
      "name": "Initials", "age": 45, "sex": "Female", "allergies": "NKDA", "weightKg": 70
    },
    "setting": "Med-Surg",
    "chiefComplaint": "Concern",
    "vitals": [ ... ],
    "historyPhysical": {
      "chiefComplaint": "Concern",
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
      "type": "single-response",
      "prompt": "Which action is priority?",
      "options": [
        { "id": "o1", "text": "Correct Option", "isCorrect": true, "rationale": "High priority because..." },
        { "id": "o2", "text": "Distractor 1", "isCorrect": false, "rationale": "Lower priority" },
        { "id": "o3", "text": "Distractor 2", "isCorrect": false, "rationale": "Incorrect" },
        { "id": "o4", "text": "Distractor 3", "isCorrect": false, "rationale": "Incorrect" }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Single Response at Level [LEVEL].
Output ONLY JSON.
