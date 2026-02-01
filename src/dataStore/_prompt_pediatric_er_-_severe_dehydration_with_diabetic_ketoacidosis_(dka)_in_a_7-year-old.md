# NGN Case Study Generator - Golden Prompt V2

## System Role
You are an expert NCLEX-NGN item writer with deep clinical expertise. Your task is to generate a complete, validation-passing clinical case study in pure JSON format.

## Output Format
- **PURE JSON ONLY** - No markdown, no explanations, no code blocks
- No ```json wrapper - output raw JSON starting with `{`
- UTF-8 encoding
- 2-space indentation

---

## CRITICAL VALIDATION RULES (MUST FOLLOW - ZERO TOLERANCE)

### Rule 1: Every Option Object Must Have All Fields
```
{ "id": "o1", "text": "Option text", "isCorrect": true, "rationale": "15+ word explanation" }
```
**NEVER** omit `rationale` field. **NEVER** use empty string `""`.

### Rule 2: Bow-Tie Pools Must Be Object Arrays
❌ WRONG: `"conditions": ["Septic Shock", "Cardiogenic Shock"]`
✅ CORRECT: `"conditions": [{"id": "c1", "text": "Septic Shock", "isCorrect": true, "rationale": "..."}, ...]`

### Rule 3: Highlight Screen Uses `rationales` (Plural) Key
❌ WRONG: `"highlightReview": {...}`
✅ CORRECT: `"rationales": { "h1": { "isCorrect": true, "whyCorrect": "..." }, ... }`

### Rule 4: Matrix Rows Must Have Rationales
Each row needs: `{ "id": "r1", "text": "...", "correctColumnId": "c1", "correctColumnIds": ["c1"], "rationale": "..." }`

### Rule 5: Drop-Cloze Options Must Have Rationales
Each dropdown option: `{ "id": "d1-o1", "text": "Option", "isCorrect": true, "rationale": "..." }`

### Rule 6: Minimum Rationale Length = 15 Words
Every rationale must be substantive, explaining clinical reasoning with patient-specific data.

### Rule 7: BANNED Generic Phrases
NEVER use these phrases in any rationale:
- "correct finding", "appropriate choice", "this is correct", "this is incorrect"
- "good answer", "wrong answer", "correct answer", "incorrect answer"
- "option is correct", "option is incorrect", "correct option", "incorrect option"

### Rule 8: No Empty or Null Fields
Every required field must have meaningful content. No `null`, `""`, `"TBD"`, or placeholders.

---

## CASE STUDY GENERATION INSTRUCTIONS

### Topic
Pediatric ER - Severe Dehydration with Diabetic Ketoacidosis (DKA) in a 7-year-old

### Patient Profile Requirements
- Adult medical-surgical client (18-85 years)
- Specific demographics: age, sex, relevant comorbidities
- Acute problem at Clinical Judgment Level 3-5
- Clear setting (ED, Med-Surg, ICU, PACU, etc.)

### Time Progression Requirements
At least THREE time points showing:
1. **Initial presentation** (0 min)
2. **Intermediate** (30-60 min later)
3. **Post-intervention** (2-4 hours later)

Each time point must include realistic:
- Vital signs (coherent with condition)
- Nursing notes
- Labs/diagnostics (if applicable)
- Orders

### Clinical Deterioration Anchor
The case MUST revolve around:
- A clear deterioration pattern OR
- A risk that requires prioritization and escalation
- NOT routine care

---

## EXACT JSON SCHEMA (FOLLOW PRECISELY)

```json
{
  "id": "case-{condition}-{timestamp}",
  "typeId": "case-study",
  "difficulty": 5,
  "content": {
    "clinicalData": {
      "patientProfile": {
        "name": "Patient Name",
        "age": "XX years",
        "sex": "Male/Female",
        "weight": "XX kg",
        "allergies": ["List allergies or 'NKDA'"],
        "comorbidities": ["List relevant conditions"],
        "chiefComplaint": "Primary reason for presentation"
      },
      "setting": "Unit name (e.g., Medical ICU, Emergency Department)",
      "timeProgression": [
        {
          "timestamp": "0800",
          "label": "Initial Assessment",
          "vitals": {
            "temperature": "XX.X°F (XX.X°C)",
            "heartRate": "XXX bpm",
            "respiratoryRate": "XX breaths/min",
            "bloodPressure": "XXX/XX mmHg",
            "oxygenSaturation": "XX% on [device]",
            "painScore": "X/10"
          },
          "nursingNotes": "Narrative nursing assessment...",
          "labs": {
            "labName": "value with units"
          },
          "orders": ["Order 1", "Order 2"]
        }
      ]
    },
    "structure": {
      "type": "case-study",
      "screens": [
        // S1-S6 go here (see templates below)
      ]
    }
  },
  "rationale": {
    "coreConcept": "Main clinical concept (e.g., 'Septic Shock Recognition')",
    "caseSummary": "2-3 sentence summary of the case for faculty",
    "goldenRule": "One memorable principle (e.g., 'Normal PaCO2 in severe asthma is ominous')",
    "pitfalls": [
      "Common error 1",
      "Common error 2",
      "Common error 3"
    ],
    "cheatSheet": {
      "title": "Quick Reference Title",
      "points": [
        "Pearl 1",
        "Pearl 2",
        "Pearl 3"
      ]
    },
    "mnemonic": {
      "title": "ACRONYM",
      "content": "A = ..., B = ..., C = ...",
      "explanation": "Brief explanation"
    }
  }
}
```

---

## SCREEN TEMPLATES (COPY EXACT STRUCTURE)

### Screen 1: Highlight (Recognize Cues)

```json
{
  "id": "s1",
  "type": "highlight",
  "cjmmStep": "Recognize Cues",
  "cjmmPhase": "Recognize Cues",
  "prompt": "Highlight the findings that indicate [clinical concern] and require immediate attention.",
  "text": "Patient narrative with <span id='h1'>concerning finding 1</span> embedded. Additional context shows <span id='h2'>finding 2</span> and <span id='h3'>finding 3</span>. The nurse notes <span id='h4'>finding 4</span>. Other assessment reveals <span id='h5'>finding 5</span> and <span id='h6'>finding 6</span>.",
  "correct": ["h1", "h2", "h3", "h4"],
  "rationales": {
    "h1": {
      "isCorrect": true,
      "whyCorrect": "[Hook] This finding indicates X. [Breakdown] In the context of this patient's condition, it signifies Y because Z. [Trap] Do not dismiss this as normal variation."
    },
    "h2": {
      "isCorrect": true,
      "whyCorrect": "[Hook] Critical indicator of deterioration. [Breakdown] Pathophysiology explanation with specific values. [Trap] Avoid confusing with benign cause."
    },
    "h3": {
      "isCorrect": true,
      "whyCorrect": "Clinical significance with patient-specific reasoning (minimum 15 words)."
    },
    "h4": {
      "isCorrect": true,
      "whyCorrect": "Clinical significance with patient-specific reasoning (minimum 15 words)."
    },
    "h5": {
      "isCorrect": false,
      "whyIncorrect": "Expected finding in this context because... Not a priority concern."
    },
    "h6": {
      "isCorrect": false,
      "whyIncorrect": "This is a distractor - while notable, it does not indicate the primary problem."
    }
  }
}
```

### Screen 2: Matrix (Analyze Cues)

```json
{
  "id": "s2",
  "type": "matrix",
  "cjmmStep": "Analyze Cues",
  "cjmmPhase": "Analyze Cues",
  "prompt": "For each finding, indicate whether it represents [Column 1 meaning] or [Column 2 meaning].",
  "columns": [
    { "id": "c1", "text": "Column 1 Label" },
    { "id": "c2", "text": "Column 2 Label" }
  ],
  "rows": [
    {
      "id": "r1",
      "text": "Clinical finding 1",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Explanation of why this finding belongs in column 1, with clinical reasoning and patient-specific context (minimum 15 words)."
    },
    {
      "id": "r2",
      "text": "Clinical finding 2",
      "correctColumnId": "c2",
      "correctColumnIds": ["c2"],
      "rationale": "Explanation with pathophysiology and significance (minimum 15 words)."
    },
    {
      "id": "r3",
      "text": "Clinical finding 3",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Clinical reasoning (minimum 15 words)."
    },
    {
      "id": "r4",
      "text": "Clinical finding 4",
      "correctColumnId": "c2",
      "correctColumnIds": ["c2"],
      "rationale": "Clinical reasoning (minimum 15 words)."
    },
    {
      "id": "r5",
      "text": "Clinical finding 5",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Clinical reasoning (minimum 15 words)."
    }
  ],
  "rationale": {
    "coreConcept": "What this screen teaches",
    "answerAnalysis": "Summary of differentiation logic",
    "clinicalTakeaway": "Key learning point"
  }
}
```

### Screen 3: Multiple-Choice (Prioritize Hypotheses)

```json
{
  "id": "s3",
  "type": "multiple-choice",
  "cjmmStep": "Prioritize Hypotheses",
  "cjmmPhase": "Prioritize Hypotheses",
  "prompt": "Based on the current assessment data, which nursing concern is the highest priority?",
  "options": [
    {
      "id": "o1",
      "text": "Priority diagnosis or concern (CORRECT)",
      "isCorrect": true,
      "rationale": "This is the priority because it directly threatens [ABCs/perfusion/safety]. The patient's [specific data points] indicate immediate risk of [consequence]. Using ABCs framework, this supersedes other concerns because [reasoning]."
    },
    {
      "id": "o2",
      "text": "Plausible but secondary concern",
      "isCorrect": false,
      "rationale": "While this is a valid concern, it is secondary to option 1. The patient's [data] shows this is less urgent because [reasoning]. Address after stabilizing the priority issue."
    },
    {
      "id": "o3",
      "text": "Related but lower priority concern",
      "isCorrect": false,
      "rationale": "This concern exists but does not represent the immediate threat. The [specific values] indicate this can be addressed after the priority problem because [clinical logic]."
    },
    {
      "id": "o4",
      "text": "Common misconception or distractor",
      "isCorrect": false,
      "rationale": "This is a common trap. While it may seem important, the data actually indicates [contradiction]. Focus on [correct priority] instead because [ABCs reasoning]."
    }
  ],
  "rationale": {
    "coreConcept": "Priority setting using ABCs and clinical judgment",
    "answerAnalysis": "Summary of why option 1 takes precedence",
    "clinicalStrategy": "ABCs, Maslow, or other framework used"
  }
}
```

### Screen 4: Bow-Tie (Generate Solutions)

```json
{
  "id": "s4",
  "type": "bow-tie",
  "cjmmStep": "Generate Solutions",
  "cjmmPhase": "Generate Solutions",
  "prompt": "Complete the Bow-Tie diagram by selecting the priority condition (center), the two most important nursing actions (left), and the two key parameters to monitor (right).",
  "conditions": [
    {
      "id": "cond1",
      "text": "Primary condition/complication (CORRECT)",
      "isCorrect": true,
      "rationale": "This is the central problem because the patient's presentation with [specific findings] meets the diagnostic criteria. All nursing actions and monitoring stem from this diagnosis."
    },
    {
      "id": "cond2",
      "text": "Related but incorrect condition",
      "isCorrect": false,
      "rationale": "While this condition shares some features, the patient's [specific data] rules this out. Key differentiating factor: [explanation of why not this]."
    },
    {
      "id": "cond3",
      "text": "Distractor condition",
      "isCorrect": false,
      "rationale": "This condition would present with [different findings]. The patient's current data does not support this because [specific reasoning]."
    }
  ],
  "actions": [
    {
      "id": "act1",
      "text": "Priority nursing action 1 (CORRECT)",
      "isCorrect": true,
      "rationale": "This is a time-sensitive nursing action that directly addresses the primary threat. It is within nursing scope and must be done immediately because [clinical urgency]."
    },
    {
      "id": "act2",
      "text": "Priority nursing action 2 (CORRECT)",
      "isCorrect": true,
      "rationale": "This nursing action supports the first and addresses [secondary concern]. It is essential for [preventing complication] and must be done concurrently."
    },
    {
      "id": "act3",
      "text": "Important but not priority action",
      "isCorrect": false,
      "rationale": "While this action is appropriate, it is not the highest priority. Do this after the two priority actions because [sequencing logic]."
    },
    {
      "id": "act4",
      "text": "Contraindicated or wrong action",
      "isCorrect": false,
      "rationale": "This action would be harmful or inappropriate in this situation because [specific contraindication or reasoning]."
    },
    {
      "id": "act5",
      "text": "Distractor action",
      "isCorrect": false,
      "rationale": "This action is not indicated for this patient's current condition. It would be appropriate for [different scenario] but not here."
    }
  ],
  "parameters": [
    {
      "id": "param1",
      "text": "Priority monitoring parameter 1 (CORRECT)",
      "isCorrect": true,
      "rationale": "This objective measure directly assesses the effectiveness of treatment for the primary problem. Target value: [specific goal]. Reassess every [frequency]."
    },
    {
      "id": "param2",
      "text": "Priority monitoring parameter 2 (CORRECT)",
      "isCorrect": true,
      "rationale": "This parameter indicates whether the patient is improving or deteriorating. Trends are more important than single values. Watch for [specific concern]."
    },
    {
      "id": "param3",
      "text": "Secondary monitoring parameter",
      "isCorrect": false,
      "rationale": "While useful, this parameter is less directly tied to the primary problem. Monitor after establishing the priority parameters."
    },
    {
      "id": "param4",
      "text": "Less relevant parameter",
      "isCorrect": false,
      "rationale": "This parameter does not directly assess response to treatment for this condition. It would be priority for [different condition]."
    },
    {
      "id": "param5",
      "text": "Distractor parameter",
      "isCorrect": false,
      "rationale": "This is not a priority for monitoring this patient's acute problem. It may be relevant for long-term care but not immediate assessment."
    }
  ],
  "correct": {
    "condition": "cond1",
    "actions": ["act1", "act2"],
    "parameters": ["param1", "param2"]
  },
  "rationale": {
    "coreConcept": "Bow-Tie clinical reasoning for [condition]",
    "answerAnalysis": "The condition [X] requires these specific actions and monitoring",
    "clinicalStrategy": "Intervention → Assessment → Evaluation loop"
  }
}
```

### Screen 5: Drop-Cloze (Take Action)

```json
{
  "id": "s5",
  "type": "drop-cloze",
  "cjmmStep": "Take Action",
  "cjmmPhase": "Take Action",
  "prompt": "Complete the following nursing action statement for the patient.",
  "text": "The nurse should position the patient in %{d1}% and ensure that %{d2}% is immediately available at the bedside.",
  "dropdowns": [
    {
      "id": "d1",
      "options": [
        {
          "id": "d1-o1",
          "text": "High-Fowler's position",
          "isCorrect": true,
          "rationale": "This position maximizes chest expansion and reduces work of breathing. For patients with respiratory distress, upright positioning improves ventilation-perfusion matching and decreases venous return, reducing pulmonary congestion."
        },
        {
          "id": "d1-o2",
          "text": "supine position",
          "isCorrect": false,
          "rationale": "Supine positioning restricts diaphragmatic excursion and increases work of breathing. This would worsen the patient's respiratory distress and is contraindicated."
        },
        {
          "id": "d1-o3",
          "text": "Trendelenburg position",
          "isCorrect": false,
          "rationale": "Head-down positioning pushes abdominal contents against the diaphragm, severely impairing breathing. This is contraindicated in respiratory distress."
        },
        {
          "id": "d1-o4",
          "text": "prone position",
          "isCorrect": false,
          "rationale": "Prone positioning is used for intubated ARDS patients, not conscious patients with acute respiratory distress. Requires airway management capability."
        }
      ]
    },
    {
      "id": "d2",
      "options": [
        {
          "id": "d2-o1",
          "text": "emergency airway equipment",
          "isCorrect": true,
          "rationale": "Given the patient's risk for respiratory failure, emergency airway equipment (bag-valve mask, suction, intubation tray) must be immediately accessible for rapid intervention if needed."
        },
        {
          "id": "d2-o2",
          "text": "chest tube insertion kit",
          "isCorrect": false,
          "rationale": "Chest tubes are indicated for pneumothorax or hemothorax, not the primary respiratory issue in this case. Not the priority equipment."
        },
        {
          "id": "d2-o3",
          "text": "blood transfusion supplies",
          "isCorrect": false,
          "rationale": "Blood products are not indicated for this patient's current presentation. The airway and breathing are the priority concerns."
        },
        {
          "id": "d2-o4",
          "text": "central line insertion kit",
          "isCorrect": false,
          "rationale": "While IV access is important, central line insertion is not the immediate priority. Peripheral access is sufficient for initial interventions."
        }
      ]
    }
  ],
  "rationale": {
    "coreConcept": "Safe positioning and emergency preparedness",
    "answerAnalysis": "Positioning optimizes respiratory mechanics; emergency equipment ensures rapid response capability",
    "clinicalStrategy": "Airway-Breathing-Circulation priority",
    "mnemonic": {
      "title": "P-E-A-R",
      "content": "Position, Equipment, Airway, Readiness",
      "explanation": "Systematic approach to patient safety in respiratory distress"
    }
  }
}
```

### Screen 6: Multiple-Response (Evaluate Outcomes)

```json
{
  "id": "s6",
  "type": "multiple-response",
  "cjmmStep": "Evaluate Outcomes",
  "cjmmPhase": "Evaluate Outcomes",
  "prompt": "Two hours after initiating interventions, which findings indicate the treatment is effective? Select all that apply.",
  "options": [
    {
      "id": "o1",
      "text": "Improvement indicator 1 (e.g., SpO2 improved from 88% to 95%)",
      "isCorrect": true,
      "rationale": "This quantifiable improvement demonstrates effective oxygen therapy. The increase from hypoxemic to acceptable range indicates the intervention is working."
    },
    {
      "id": "o2",
      "text": "Improvement indicator 2 (e.g., Heart rate decreased from 134 to 98 bpm)",
      "isCorrect": true,
      "rationale": "Decreased tachycardia suggests reduced physiologic stress and improved cardiac efficiency. This trend indicates the body's compensatory mechanisms are normalizing."
    },
    {
      "id": "o3",
      "text": "Improvement indicator 3 (e.g., Respiratory rate decreased from 32 to 20 breaths/min)",
      "isCorrect": true,
      "rationale": "Reduced respiratory rate indicates decreased work of breathing. The patient is ventilating more effectively with less effort."
    },
    {
      "id": "o4",
      "text": "Improvement indicator 4 (e.g., Patient reports pain decreased from 8/10 to 3/10)",
      "isCorrect": true,
      "rationale": "Pain reduction indicates effective analgesia and reduced physiologic stress. Comfort improvement often correlates with overall clinical improvement."
    },
    {
      "id": "o5",
      "text": "Worrisome finding 1 (e.g., Blood pressure remains at 88/54 mmHg)",
      "isCorrect": false,
      "rationale": "Persistent hypotension indicates ongoing hemodynamic instability. This is NOT a sign of improvement and may require escalation of care."
    },
    {
      "id": "o6",
      "text": "Worrisome finding 2 (e.g., Patient remains lethargic and confused)",
      "isCorrect": false,
      "rationale": "Persistent altered mental status suggests ongoing cerebral hypoperfusion. This finding indicates the patient is NOT improving and requires further intervention."
    }
  ],
  "rationale": {
    "coreConcept": "Outcome evaluation and trend analysis",
    "answerAnalysis": "Improvement is shown by normalizing vital signs, reduced work of breathing, and patient comfort",
    "clinicalStrategy": "Compare current values to baseline; look for trends toward normal",
    "cheatSheet": {
      "title": "Signs of Improvement",
      "points": [
        "Vital signs trending toward normal",
        "Decreased work of breathing",
        "Improved mental status",
        "Patient comfort"
      ]
    }
  }
}
```

---

## PRE-OUTPUT VALIDATION CHECKLIST

Before generating output, verify:

1. [ ] All 6 screens present (s1-s6) with correct types
2. [ ] Every option has `{ id, text, isCorrect, rationale }`
3. [ ] Bow-Tie uses object arrays (not string arrays)
4. [ ] Highlight uses `rationales` key (not `highlightReview`)
5. [ ] Matrix rows have `rationale` and `correctColumnIds` array
6. [ ] No empty rationale strings - all ≥15 words
7. [ ] No banned generic phrases in any rationale
8. [ ] Clinical data is coherent across time points
9. [ ] All IDs are unique (no duplicates)
10. [ ] Exactly 1 correct for MCQ, 2+ correct for SATA
11. [ ] Bow-Tie has exactly 1 condition, 2 actions, 2 parameters correct
12. [ ] Drop-Cloze has exactly 1 correct per dropdown

---

## GENERATE NOW

Create the complete case study JSON for: Pediatric ER - Severe Dehydration with Diabetic Ketoacidosis (DKA) in a 7-year-old

Output pure JSON only, starting with `{` and ending with `}`.
