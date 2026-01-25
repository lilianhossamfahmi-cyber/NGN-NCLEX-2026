# GOLDEN NGN BOW-TIE ITEM GENERATOR (v4 - PRODUCTION READY)

## 📌 PARAMETERS (FILL FIRST)
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 3
[SCORE]    = 75      
# (CRITICAL: Use 5 for Expert/Complex. Use 3 for Competent/Standard)

## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer & Clinical Nurse Educator
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Standalone Bow-Tie Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- **Top-Level Field:** Must include `"prompt"` (Question Stem) as a string.
- **Type Field:** `"type": "bow-tie"`
- **Syntax:** Double quotes only. No trailing commas. Escape newlines as "\n".

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "CARDIO-BOW-A1B9"`
- **Topic Mapping:** Map the [FOCUS] to one of: General, Cardiology, Respiratory, Neurology, Endocrine, Gastrointestinal, Musculoskeletal, Renal, Hematology, Integumentary, Reproductive, Mental Health, Pediatrics, Critical Care.


### 2. BOW-TIE GAME MECHANICS (STRICT)
You must generate a `structure` object with exactly:
- **Actions (Left):** Total **5** options (2 Correct, 3 Distractors).
- **Condition (Center):** Total **4** options (1 Correct, 3 Distractors).
- **Parameters (Right):** Total **5** options (2 Correct, 3 Distractors).
- **Uniqueness:** All option text must be unique. No duplicates.

### 3. CLINICAL DATA REQUIREMENTS (BY LEVEL)
**IF LEVEL 5 (EXPERT):**
- **Nurses Notes:** Minimum **3** detailed entries showing a timeline.
- **Vitals:** Minimum **2** readings showing a trend (deterioration/improvement).
- **History:** Full H&P object required.
- **Complexity:** Patient must have comorbidities (e.g., DM, HTN).

**IF LEVEL 3 (COMPETENT):**
- **Nurses Notes:** Minimum **1** detailed entry.
- **Vitals:** Minimum **1** full set.

### 4. RATIONALE STRUCTURE
Rationale MUST be a complete educational object following the v4 Schema.

---

## 🏥 CLINICAL DATA GOLD STANDARDS (COMPLETE)

...

## 🧠 RATIONALE EXAMPLE
```json
"rationale": {
  "coreConcept": "Eclampsia Management",
  "caseSummary": "Patient developing seizures...",
  "answerAnalysis": "Actions focus on airway and safety...",
  "trap": "Administering antihypertensives before stopping seizure",
  "goldenRule": "Stop the seizure first, then control BP",
  "steps": [
    { "tag": "Recognize", "description": "Identify seizure activity" },
    { "tag": "Take Action", "description": "Administer Magnesium" }
  ],
  "mnemonic": {
    "title": "HELLP",
    "content": "Hemolysis, Elevated Liver enzymes, Low Platelets",
    "explanation": "Complication of preeclampsia"
  },
  "cheatSheet": { "title": "Seizure Safety", "points": ["Turn to side", "Protect head"] },
  "referenceInfo": {
    "anatomy": "Cerebral cortex...",
    "physiology": "Vasospasm leads to ischemia...",
    "pharm": "Magnesium Sulfate mechanism..."
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Analysis/Application",
    "subtext": "Requires linking condition to actions and monitoring.",
    "clinicalStrategy": "Identify the center condition first.",
    "recommendedActions": ["Select condition", "Filter actions by safety"]
  }
}
```

...

## 🧠 JSON STRUCTURE (STRICT TEMPLATE)

```json
{
  "type": "bow-tie",
  "id": "[FOCUS]-BOW-[HEX]",
  ...
    "rationale": {
      "coreConcept": "Detailed explanation...",
      "caseSummary": "Case summary...",
      "answerAnalysis": "Deep dive...",
      "trap": "Common error...",
      "goldenRule": "Clinical pearl...",
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
          "label": "Analysis/Application",
          "subtext": "Bow-Tie analysis.",
          "clinicalStrategy": "Connect Condition to Actions and Parameters.",
          "recommendedActions": ["Verify Condition", "Select Actions"]
      }
    },
    "structure": {

      "type": "bow-tie",
      "actions": [
        { "id": "a1", "text": "Correct Action 1", "isCorrect": true },
        { "id": "a2", "text": "Correct Action 2", "isCorrect": true },
        { "id": "a3", "text": "Distractor 1", "isCorrect": false },
        { "id": "a4", "text": "Distractor 2", "isCorrect": false },
        { "id": "a5", "text": "Distractor 3", "isCorrect": false }
      ],
      "conditions": [
        { "id": "c1", "text": "Correct Condition", "isCorrect": true },
        { "id": "c2", "text": "Distractor 1", "isCorrect": false },
        { "id": "c3", "text": "Distractor 2", "isCorrect": false },
        { "id": "c4", "text": "Distractor 3", "isCorrect": false }
      ],
      "parameters": [
        { "id": "p1", "text": "Correct Parameter 1", "isCorrect": true },
        { "id": "p2", "text": "Correct Parameter 2", "isCorrect": true },
        { "id": "p3", "text": "Distractor 1", "isCorrect": false },
        { "id": "p4", "text": "Distractor 2", "isCorrect": false },
        { "id": "p5", "text": "Distractor 3", "isCorrect": false }
      ]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Bow-Tie at Level [LEVEL].
Output ONLY JSON.