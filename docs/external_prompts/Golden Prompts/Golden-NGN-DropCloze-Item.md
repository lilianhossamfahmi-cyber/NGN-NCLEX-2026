# GOLDEN NGN DROP-CLOZE ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone Drop-Cloze Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "NEURO-CLZ-C3D4"`
- **Topic Mapping:** Map the [FOCUS] to one of: General, Cardiology, Respiratory, Neurology, Endocrine, etc.


### 2. DROP-CLOZE RULES
- **Format:** MUST use "Text + Placeholders" (`%{id}`) format.
- **Forbidden:** Do NOT use the old `sentences` array format.
- **Dropdowns:** Each dropdown must have 2-3 options.
- **Blank Map (MANDATORY):** You MUST provide a `blankMap` object in `structure`.
  - Keys must match dropdown IDs (`d1`, `d2`...).
  - Values must contain:
    ```json
    {
      "correctOptionId": "o1",
      "whyCorrect": "Specific clinical reasoning why this is the best choice...",
      "distractorRationales": {
        "o2": "Why this option is incorrect - clinical explanation...",
        "o3": "Why this option is incorrect - clinical explanation..."
      }
    }
    ```
  - **FORBIDDEN GENERIC PHRASES:**
    - ❌ "This is incorrect."
    - ❌ "Wrong answer."
    - ❌ "This is the correct selection."
  - **REQUIRED SPECIFIC EXPLANATIONS:**
    - ✅ "Regular insulin has a 30-60 minute onset, too slow for acute hypoglycemia."
    - ✅ "Oral glucose is first-line for conscious patients able to swallow."
    - ✅ "D50W IV requires IV access and is reserved for unconscious patients."

---

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
```json
"vitals": [
  { "time": "0800", "tempF": "98.6", "hr": 80, "rr": 18, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 0 }
]
```

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
    "clinicalStrategy": "Complete sentence to make clinical sense",
    "recommendedActions": ["Read full sentence first"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review relevant pharmacology."
**✅ REQUIRED:** "Insulin aspart is a rapid-acting insulin..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-CLZ-HEX`).
- [ ] `structure.text` uses `%{id}` placeholders.
- [ ] `structure.blankMap` maps every placeholder.
- [ ] Every distractor has a clinical rationale.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "drop-cloze",
  "id": "[FOCUS]-CLZ-[HEX]",
  "content": {
    "prompt": "Complete the sentence by selecting the correct options.",
    "metadata": {
      "title": "[FOCUS] Drop-Cloze Scenario",
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Initials", "age": 45, "gender": "Male", "allergies": "NKDA", "weightKg": 90, "codeStatus": "Full Code"
      },
      "setting": "Med-Surg",
      "historyPhysical": {
        "chiefComplaint": "Hyperglycemia",
        "hpi": "History of Present Illness details...",
        "pmh": ["Hypertension", "T2DM"],
        "medications": ["Metformin", "Lisinopril"]
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
      "difficulty": { "level": [LEVEL], "score": [SCORE], "label": "Analysis" }
    },
    "structure": {
      "type": "drop-cloze",
      "text": "The nurse should administer %{d1} because the onset is %{d2} minutes.",
      "dropdowns": [
        { 
          "id": "d1", 
          "options": [
            { "id": "o1", "text": "oral glucose gel", "isCorrect": true },
            { "id": "o2", "text": "D50W IV push", "isCorrect": false }
          ]
        },
        { 
          "id": "d2", 
          "options": [
            { "id": "o3", "text": "15", "isCorrect": true },
            { "id": "o4", "text": "60", "isCorrect": false }
          ]
        }
      ],
      "blankMap": {
        "d1": {
          "correctOptionId": "o1",
          "whyCorrect": "Oral glucose gel is first-line treatment for conscious hypoglycemic patients.",
          "distractorRationales": {
            "o2": "D50W IV push requires IV access and is reserved for altered consciousness."
          }
        },
        "d2": {
          "correctOptionId": "o3",
          "whyCorrect": "Oral glucose gel has an onset of approximately 15 minutes.",
          "distractorRationales": {
            "o4": "60 minutes is too slow for acute hypoglycemia."
          }
        }
      }
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Drop-Cloze at Level [LEVEL].
Output ONLY JSON.