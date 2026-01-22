# GOLDEN NGN ORDERED RESPONSE ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone Ordered Response Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "SYST-ORD-A1B2"`
- **Topic Mapping:** Map the [FOCUS] to appropriate topic.


### 2. ORDERED RESPONSE RULES
- **Sequence:** The `orderedOptions` array MUST be in the correct Answer Key order.
- **Scoring:** The system assumes the provided order is the correct order.

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
  "answerAnalysis": "Why step 1 is first...",
  "trap": "Trap description (e.g. wrong sequence)",
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
    "clinicalStrategy": "Establish priority (e.g. Least invasive first)",
    "recommendedActions": ["Visualize the procedure"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review procedure."
**✅ REQUIRED:** "Donning PPE sequence protects the healthcare worker..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-ORD-HEX`).
- [ ] `orderedOptions` are in the correct sequence.
- [ ] Each step has a rationale.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "ordered-response",
  "id": "[FOCUS]-ORD-[HEX]",
  "content": {
    "prompt": "Drag steps into correct order.",
    "metadata": {
      "title": "[FOCUS] Ordered Response Scenario",
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Safe and Effective Care Environment",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Initials", "age": 45, "gender": "Male", "allergies": "NKDA", "weightKg": 90, "codeStatus": "Full Code"
      },
      "setting": "Clinic",
      "historyPhysical": {
        "chiefComplaint": "Procedure",
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
      "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
      "referenceInfo": { "anatomy": "...", "physiology": "...", "pharm": "..." },
      "difficulty": { "level": [LEVEL], "score": [SCORE], "label": "Application" }
    },
    "structure": {
      "type": "ordered-response",
      "orderedOptions": [
        { "id": "step1", "text": "First Action", "rationale": "Critical first step..." },
        { "id": "step2", "text": "Second Action", "rationale": "Must follow step 1..." },
        { "id": "step3", "text": "Third Action", "rationale": "Final step..." }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Ordered Response at Level [LEVEL].
Output ONLY JSON.