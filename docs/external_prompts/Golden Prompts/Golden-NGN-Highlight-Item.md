# GOLDEN NGN HIGHLIGHT ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone Highlight Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.
- HTML attributes using Single Quotes -> `<span id='h1'>`

### 2. HIGHLIGHT SPECIFIC RULES
- **Spans:** You MUST include at least 6-8 distinct spans (`h1`...`h8`) in the text.
- **Mix:** Include both CORRECT items (abnormal/relevant) and DECOYS (normal/irrelevant).
- **Format:** The text must feature `<span id='hX'>text</span>` syntax.
- **Token Map (MANDATORY):** You MUST provide a `tokenMap` object in `structure`.
  - Keys must match span IDs (`h1`, `h2`...).
  - Values must contain `{ "isCorrect": boolean, "whyCorrect": "...", "whyIncorrect": "..." }`.
  - **For CORRECT items:** Provide detailed `whyCorrect` explaining clinical significance. Set `whyIncorrect` to "N/A".
  - **For INCORRECT items:** Provide detailed `whyIncorrect` explaining why it's a distractor. Set `whyCorrect` to "N/A".
  - **FORBIDDEN GENERIC PHRASES:**
    - ❌ "This is correct."
    - ❌ "This is a distractor."
    - ❌ "Correct finding indicating clinical significance."
    - ❌ "This finding is not a priority."
  - **REQUIRED SPECIFIC EXPLANATIONS:**
    - ✅ "Tachycardia (HR 112) indicates compensatory response to hypovolemia from ectopic rupture."
    - ✅ "Smoking history is a chronic risk factor, not an acute assessment finding requiring immediate action."
    - ✅ "LLQ pain with vaginal bleeding in early pregnancy suggests ruptured ectopic requiring emergent surgery."

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
  "answerAnalysis": "Breakdown of findings...",
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
    "clinicalStrategy": "Distinguish acute from chronic",
    "recommendedActions": ["Select only what is actionable"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review signs of infection."
**✅ REQUIRED:** "Fever and tachycardia are classic signs of systemic inflammatory response..."

---

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "highlight",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Moderate", 
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Recognize Cues",
      "targetScore": [SCORE]
    },
    "patient": { 
      "name": "Initials", "age": 45, "sex": "Male", "allergies": "NKDA", "weightKg": 90
    },
    "setting": "Clinic",
    "chiefComplaint": "Fever",
    "vitals": [ ... ],
    "historyPhysical": {
      "chiefComplaint": "Fever",
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
      "type": "highlight",
      "prompt": "Highlight the findings that require immediate intervention.",
      "text": "The patient reports <span id='h1'>sudden onset of chest pain</span> and <span id='h2'>shortness of breath</span>. He has a history of <span id='h3'>hypertension</span>. Skin is <span id='h4'>cool and clammy</span>. He requests <span id='h5'>a glass of water</span>.",
      "correct": ["h1", "h2", "h4"],
      "decoys": ["h3", "h5"],
      "tokenMap": {
        "h1": { 
          "isCorrect": true,
          "whyCorrect": "Sudden chest pain is a cardinal sign of acute myocardial ischemia requiring immediate intervention.",
          "whyIncorrect": "N/A"
        },
        "h2": { 
          "isCorrect": true,
          "whyCorrect": "Shortness of breath indicates respiratory compromise, often seen with cardiac events or pulmonary embolism.",
          "whyIncorrect": "N/A"
        },
        "h3": { 
          "isCorrect": false,
          "whyCorrect": "N/A",
          "whyIncorrect": "Hypertension is a chronic historical finding, not an acute assessment finding requiring immediate action."
        },
        "h4": { 
          "isCorrect": true,
          "whyCorrect": "Cool, clammy skin indicates sympathetic activation and poor peripheral perfusion, a sign of shock.",
          "whyIncorrect": "N/A"
        },
        "h5": { 
          "isCorrect": false,
          "whyCorrect": "N/A",
          "whyIncorrect": "Requesting water is a patient preference, not an assessment finding. Also potentially unsafe if NPO status."
        }
      }
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Highlight at Level [LEVEL].
Output ONLY JSON.