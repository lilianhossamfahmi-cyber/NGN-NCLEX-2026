# GOLDEN NGN MATRIX ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone Matrix Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "RESP-MTX-8B2A"`
- **Topic Mapping:** Map the [FOCUS] to one of: Cardiology, Respiratory, Gastrointestinal, etc.

### 2. MATRIX RULES
- **Columns:** 2-3 mutually exclusive choices (e.g., "Sepsis", "Heart Failure", "Neither").
- **Rows:** 4-6 patient findings to sort.
- **Scoring:** Each row must have exactly ONE valid `correctColumnId`.

---

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
```json
"vitals": [
  { "time": "0800", "tempF": "101.5", "hr": 115, "rr": 24, "bp": "88/52", "o2": "92", "o2_device": "4L NC", "pain": 7 }
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
  "answerAnalysis": "Why Column 1 applies to Row A...",
  "trap": "Trap description",
  "goldenRule": "Rule description",
  "steps": [ ... ],
  "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
  "cheatSheet": { "title": "...", "points": [...] },
  "referenceInfo": {
    "anatomy": "CASE-SPECIFIC anatomy (Teach the structure)",
    "physiology": "CASE-SPECIFIC mechanism (e.g., 'In heart failure, fluid overload...')",
    "pharm": "CASE-SPECIFIC drugs or 'N/A'"
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard",
    "subtext": "Requires analyzing cues across multiple conditions.",
    "clinicalStrategy": "Compare columns to find best fit",
    "recommendedActions": ["Evaluate each row independently"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review relevant anatomy."
**✅ REQUIRED:** "Left-sided heart failure causes pulmonary backflow..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present and matches the `TOPIC-MTX-HEX` format.
- [ ] `structure` contains `rows` and `columns`.
- [ ] Every row has a `correctColumnId`.
- [ ] `vitals` are an Array of Objects.
- [ ] `nursesNotes` are an Array of Objects.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "matrix",
  "id": "[FOCUS]-MTX-[HEX]",
  "content": {
    "prompt": "For each finding below, click to specify if the finding is consistent with [Condition A], [Condition B], or [Condition C].",
    "metadata": {
      "title": "[FOCUS] Matrix Scenario",
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Safe and Effective Care Environment",
      "cjmmStep": "Analyze Cues",
      "targetScore": [SCORE]
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Initials", "age": 65, "gender": "Male", "allergies": "NKDA", "weightKg": 80, "codeStatus": "Full Code"
      },
      "setting": "ICU/ER/MedSurg",
      "historyPhysical": {
        "chiefComplaint": "Patient's main concern",
        "hpi": "History of Present Illness details...",
        "pmh": ["..."],
        "medications": ["..."]
      },
      "history": [
        { "time": "0800", "author": "RN Smith", "note": "Initial assessment shows..." },
        { "time": "0815", "author": "RN Smith", "note": "Patient status deteriorating..." }
      ],
      "vitals": [
        { "time": "0800", "tempF": "101.5", "hr": 115, "rr": 24, "bp": "88/52", "o2": "92", "o2_device": "4L NC", "pain": 7 }
      ],
      "labs": [
        { "test": "Creatinine", "value": "1.8", "flag": "H", "ref": "0.6-1.2", "unit": "mg/dL" }
      ],
      "orders": [],
      "radiology": []
    },
    "rationale": { 
      "general": "Detailed explanation of the matrix categories...",
      "pathophysiology": "Deep dive into the mechanism distinguishing the conditions.",
      "safetyCheck": "Critical safety warnings.",
      "clinicalTakeaway": "Key teaching point for future practice.",
      "mnemonic": {
        "title": "ACRONYM_NAME (e.g., MONA, FAST, FACES)",
        "content": "Letter-by-letter breakdown of the mnemonic",
        "explanation": "How this mnemonic helps in clinical decision-making"
      },
      "referenceInfo": {
          "anatomy": "...",
          "physiology": "...",
          "pharm": "..."
      },
      "difficulty": {
          "level": [LEVEL],
          "score": [SCORE],
          "label": "Analysis",
          "subtext": "Matrix analysis required.",
          "clinicalStrategy": "Evaluate row by row.",
          "recommendedActions": ["Check against column A", "Check against column B"]
      }
    },
    "structure": {
      "type": "matrix",
      "columns": [
        { "id": "c1", "text": "Condition A" },
        { "id": "c2", "text": "Condition B" }
      ],
      "rows": [
        { "id": "r1", "text": "Finding 1", "correctColumnId": "c1", "rationale": "Explanation for why Finding 1 matches Condition A." },
        { "id": "r2", "text": "Finding 2", "correctColumnId": "c2", "rationale": "Explanation for why Finding 2 matches Condition B." },
        { "id": "r3", "text": "Finding 3", "correctColumnId": "c1", "rationale": "Explanation..." },
        { "id": "r4", "text": "Finding 4", "correctColumnId": "c2", "rationale": "Explanation..." }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Matrix at Level [LEVEL].
Output ONLY JSON.
