# GOLDEN NGN HOT SPOT ITEM GENERATOR (v3 - FIXED)

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
GENERATE: [QUANTITY] Standalone Hot Spot Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "SKIN-HOT-B2C3"`
- **Topic Mapping:** Map the [FOCUS] to appropriate topic.


### 2. HOT SPOT RULES
- **Coordinates:** `x`, `y` (0-100%), `radius`.
- **Image:** Provide valid URL or detailed generation prompt.
- **Type:** Must be `hot_spot` (underscore preferred, but system handles hyphen).

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
    "anatomy": "Detailed anatomy of the site...",
    "physiology": "...",
    "pharm": "..."
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard",
    "clinicalStrategy": "Identify landmarks",
    "recommendedActions": ["Use proportional estimation"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review injection sites."
**✅ REQUIRED:** "The vastus lateralis is located on the anterolateral aspect of the thigh..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-HOT-HEX`).
- [ ] `targetArea` coordinates are numerically valid (0-100).
- [ ] `imageUrl` or `imageGenerationPrompt` is provided.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "hot_spot",
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
    "chiefComplaint": "Injection",
    "vitals": [ ... ],
    "historyPhysical": {
      "chiefComplaint": "Injection",
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
      "type": "hot_spot",
      "prompt": "Click on the correct location.",
      "imageUrl": "https://example.com/image.jpg",
      "imageGenerationPrompt": "Detailed description...",
      "targetArea": {
        "x": 50,
        "y": 50,
        "radius": 10
      }
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Hot Spot at Level [LEVEL].
Output ONLY JSON.