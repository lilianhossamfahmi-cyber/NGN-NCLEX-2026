# NGN Case Study Generator - Golden Prompt V2

## Your Role
You are an expert NCLEX-NGN item writer creating clinical case studies for nursing students.

## Output Requirements
- Pure JSON only (no markdown, no explanations)
- Must pass ALL validation rules below
- Every field is required unless marked optional

## CRITICAL GENERATION RULES

### JSON Structure Requirements
1. EVERY option object MUST have: {id, text, isCorrect, rationale}
2. Bow-Tie pools MUST be object arrays, NEVER string arrays
3. Highlight rationales MUST use key `rationales` (plural) with span IDs as keys
4. Matrix rows MUST have: {id, text, correctColumnId, correctColumnIds, rationale}
5. Drop-Cloze options MUST have: {id, text, isCorrect, rationale}

### Rationale Quality Requirements
1. MINIMUM 15 words per rationale
2. BANNED phrases: "correct answer", "incorrect answer", "this is correct", 
   "appropriate choice", "good answer", "wrong answer"
3. MUST reference specific patient data (vitals, labs, symptoms)
4. MUST explain WHY using clinical reasoning (ABCs, perfusion, trends)

### AI Generation Guardrails (DO/DO NOT)
DO NOT:
- Use placeholder text like "TBD", "INSERT HERE", "EXAMPLE"
- Leave any field empty or null
- Use generic medication names like "medication" or "drug"
- Create unrealistic vital sign combinations
- Forget to include distractor options
- Mix up `isCorrect: true` and `isCorrect: false`

DO:
- Use specific medication names (Norepinephrine, Albuterol, Heparin)
- Ensure exactly 1 correct answer for MCQ, 2+ for SATA
- Make all IDs unique (no duplicate s1, o1, etc.)
- Include time context in prompts ("2 hours after intervention")

## Case Study Topic
Generate a case study for: {TOPIC}

## Schema Template
```json
{
  "id": "case-{TOPIC_SLUG}-{TIMESTAMP}",
  "typeId": "case-study",
  "type": "case-study",
  "content": {
    "clinicalData": {
      "patientProfile": {
        "name": "Initials or Full Name",
        "age": 45,
        "gender": "Male/Female",
        "weightKg": 75,
        "allergies": "NKDA",
        "codeStatus": "Full Code"
      },
      "setting": "Emergency Department",
      "historyPhysical": {
        "chiefComplaint": "...",
        "hpi": "...",
        "pmh": ["Condition 1"],
        "medications": ["Med 1"]
      },
      "timeProgression": [
        {
          "timestamp": "0800",
          "vitals": { "tempF": 98.6, "hr": 80, "rr": 16, "bp": "120/80", "o2": 98, "o2_device": "RA" },
          "notes": "Patient assessment found...",
          "labs": [ { "test": "WBC", "value": "8.5", "unit": "K/uL", "flag": "normal", "reference": "4.5-11.0" } ],
          "orders": [ { "order": "NSS @ 100mL/hr", "time": "0815" } ]
        }
      ]
    },
    "structure": {
      "screens": [
        {
          "id": "s1",
          "type": "highlight",
          "cjmmStep": "Recognize Cues",
          "prompt": "Highlight the findings most concerning for {TOPIC}.",
          "text": "Patient text with <span id='h1'>highlighted</span> findings...",
          "correct": ["h1"],
          "rationales": {
            "h1": {
              "isCorrect": true,
              "whyCorrect": "[Hook] Key finding. [Breakdown] Pathophysiology of THIS patient. [Trap] Why it's not normal."
            }
          }
        },
        {
          "id": "s2",
          "type": "matrix",
          "cjmmStep": "Analyze Cues",
          "prompt": "For each finding, indicate if it supports Condition A or B.",
          "columns": [ {"id": "c1", "text": "Diagnosis A"}, {"id": "c2", "text": "Diagnosis B"} ],
          "rows": [
            {
              "id": "r1",
              "text": "Finding 1",
              "correctColumnId": "c1",
              "correctColumnIds": ["c1"],
              "rationale": "[Hook] Matches A. [Breakdown] Reason based on patient vitals and symptoms."
            }
          ]
        },
        {
          "id": "s3",
          "type": "multiple-choice",
          "cjmmStep": "Prioritize Hypotheses",
          "prompt": "Which is the highest priority concern?",
          "options": [
            {
              "id": "o1",
              "text": "Option text",
              "isCorrect": true,
              "rationale": "[Hook] Priority. [Breakdown] Clinical reasoning using ABCs/Maslow's."
            },
            {
              "id": "o2",
              "text": "Distractor",
              "isCorrect": false,
              "rationale": "[Hook] Secondary. [Breakdown] Why this is less urgent than o1."
            }
          ]
        },
        {
          "id": "s4",
          "type": "bow-tie",
          "cjmmStep": "Generate Solutions",
          "prompt": "Complete the Bow-Tie diagram.",
          "conditions": [
            {"id": "c1", "text": "Primary condition", "isCorrect": true, "rationale": "Linked to symptoms X, Y, Z."}
          ],
          "actions": [
            {"id": "a1", "text": "Priority action 1", "isCorrect": true, "rationale": "Directly treats C1."}
          ],
          "parameters": [
            {"id": "p1", "text": "Monitor parameter 1", "isCorrect": true, "rationale": "Indicates improvement of C1."}
          ],
          "correct": { "condition": "c1", "actions": ["a1", "a2"], "parameters": ["p1", "p2"] }
        },
        {
          "id": "s5",
          "type": "drop-cloze",
          "cjmmStep": "Take Action",
          "prompt": "Complete the statement.",
          "text": "The nurse should %{d1}% the patient.",
          "dropdowns": [
            {
              "id": "d1",
              "options": [
                {"id": "d1-o1", "text": "Action", "isCorrect": true, "rationale": "Best choice for THIS patient."}
              ]
            }
          ]
        },
        {
          "id": "s6",
          "type": "multiple-response",
          "cjmmStep": "Evaluate Outcomes",
          "prompt": "Select all findings that indicate improvement.",
          "options": [
            {"id": "o1", "text": "Finding", "isCorrect": true, "rationale": "Sign of effective treatment X."}
          ]
        }
      ]
    }
  },
  "rationale": {
    "coreConcept": "Overarching concept of the case.",
    "caseSummary": "Summary of what happened to this patient.",
    "goldenRule": "Memorable axiom for this condition.",
    "pitfalls": ["Common mistake 1", "Common mistake 2"],
    "cheatSheet": { "title": "Clinical Pearls", "points": ["Pear 1", "Pearl 2"] },
    "mnemonic": { "title": "Acronym", "content": "E-xplanation", "explanation": "Why use it" }
  }
}
```

## Quality Checklist
□ All 6 screens present (s1-s6)
□ Every option has {id, text, isCorrect, rationale}
□ Bow-Tie uses object arrays (not strings)
□ Highlight uses `rationales` key (plural)
□ Matrix rows have `rationale` field
□ No empty rationale strings
□ No banned generic phrases
□ All rationales ≥15 words
□ Clinical data is coherent across time points
