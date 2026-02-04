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

### Rule 9: NO GENERIC PLACEHOLDERS
**STRICT BAN** on labels like "Option 1", "Condition A", "Action 1", "Dropdown 1", "Finding X", "Patient Name", etc.
All text must be clinically specific and contextual. **DO NOT** literally copy placeholders from the templates below (e.g., do not use "concerning assessment 1"). If this rule is broken, the item will be rejected by the ingestion engine.

### Rule 10: Choice Density Requirements
- **Highlight (S1)**: Minimum 7 spans. At least 2 MUST be clinically incorrect (isCorrect: false).
- **Multiple-Response (SATA)**: Minimum 6 options.
- **Bow-Tie**: Exactly 3 conditions, 5 actions, 5 parameters in pools.
- **Drop-Cloze**: Minimum 4 options per dropdown.

---

## CASE STUDY GENERATION INSTRUCTIONS

### Topic
{TOPIC}

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
  "text": "The patient, L.S., presents with <span id='h1'>hypotension</span> and <span id='h2'>tachycardia</span>. The nurse observes <span id='h3'>increased work of breathing</span> while noting <span id='h4'>crackles in bilateral bases</span>. Laboratory results indicate <span id='h5'>elevated serum lactate</span>. Vital signs show <span id='h6'>oxygen saturation 89%</span> and <span id='h7'>fever 102.4F</span>. Assessment of the cardiovascular system reveals <span id='h8'>delayed capillary refill</span>.",
  "correct": ["h1", "h2", "h3", "h4", "h5", "h6"],
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
      "isCorrect": true,
      "whyCorrect": "Clinical significance with patient-specific reasoning (minimum 15 words)."
    },
    "h7": {
      "isCorrect": false,
      "whyIncorrect": "Expected finding in this context because... Not a priority concern."
    },
    "h8": {
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
      "text": "Temperature 102.8 F (39.3 C)",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Fever indicates systemic inflammatory response. In the context of this patient's symptoms, it suggests an active infectious process requiring intervention."
    },
    {
      "id": "r2",
      "text": "Heart Rate 128 bpm",
      "correctColumnId": "c2",
      "correctColumnIds": ["c2"],
      "rationale": "Tachycardia is a compensatory mechanism for decreased stroke volume or pain. It signifies physiological stress."
    },
    {
      "id": "r3",
      "text": "Blood Pressure 88/54 mmHg",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Hypotension indicates impaired perfusion and potential shock. This is a critical finding requiring immediate fluid resuscitation."
    },
    {
      "id": "r4",
      "text": "WBC count 22,000/mm3",
      "correctColumnId": "c1",
      "correctColumnIds": ["c1"],
      "rationale": "Leukocytosis supports the diagnosis of infection/inflammation and correlates with the clinical picture."
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
      "text": "Impaired Gas Exchange",
      "isCorrect": true,
      "rationale": "This is the priority because it directly threatens cellular oxygenation. The patient's low SpO2 and increased work of breathing indicate immediate respiratory risk. Airway and breathing always take precedence in the ABCs framework."
    },
    {
      "id": "o2",
      "text": "Risk for Ineffective Thermoregulation",
      "isCorrect": false,
      "rationale": "While the patient has a fever, this is secondary to the immediate respiratory threat. Fever management is important for comfort and metabolic demand but follows airway stabilization."
    },
    {
      "id": "o3",
      "text": "Acute Pain",
      "isCorrect": false,
      "rationale": "Pain is a significant concern but does not represent an immediate threat to life compared to impaired gas exchange. Address pain after ensuring physiological stability."
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
      "text": "Septic Shock",
      "isCorrect": true,
      "rationale": "The patient meets Sepsis-3 criteria: suspected infection, hypotension requiring vasopressors, and elevated lactate levels."
    },
    {
      "id": "cond2",
      "text": "Cardiogenic Shock",
      "isCorrect": false,
      "rationale": "While the patient is hypotensive, the absence of jugular venous distention and the presence of infectious markers make cardiogenic shock less likely."
    },
    {
      "id": "cond3",
      "text": "Hypovolemic Shock",
      "isCorrect": false,
      "rationale": "The patient has a fever and elevated WBC, which point strongly toward an inflammatory/infectious cause rather than simple volume loss."
    }
  ],
  "actions": [
    {
      "id": "act1",
      "text": "Administer 30 mL/kg isotonic fluid bolus",
      "isCorrect": true,
      "rationale": "Fluid resuscitation is the first-line treatment for sepsis-induced hypotension to restore circulating volume."
    },
    {
      "id": "act2",
      "text": "Initiate broad-spectrum IV antibiotics",
      "isCorrect": true,
      "rationale": "Early antibiotic administration is critical in sepsis to control the source of infection and improve survival."
    }
  ],
  "parameters": [
    {
      "id": "param1",
      "text": "Mean Arterial Pressure (MAP)",
      "isCorrect": true,
      "rationale": "MAP is the most reliable indicator of organ perfusion. Goal is >65 mmHg."
    },
    {
      "id": "param2",
      "text": "Urine Output",
      "isCorrect": true,
      "rationale": "Urine output reflects renal perfusion and is a sensitive indicator of shock resolution."
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
  "text": "The nurse should position the patient in %{d1} and ensure that %{d2} is immediately available at the bedside.",
  "dropdowns": [
    {
      "id": "d1",
      "options": [
        {
          "id": "d1-o1",
          "text": "High-Fowler's position",
          "isCorrect": true,
          "rationale": "High-Fowler's maximizes lung expansion and optimizes gas exchange in respiratory distress."
        }
      ]
    },
    {
      "id": "d2",
      "options": [
        {
          "id": "d2-o1",
          "text": "Emergency airway equipment",
          "isCorrect": true,
          "rationale": "Given the risk of respiratory failure, airway supplies must be at the bedside."
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
      "text": "SpO2 increased to 95% on 2L NC",
      "isCorrect": true,
      "rationale": "Improvement in oxygen saturation demonstrates effective therapy and improved gas exchange."
    },
    {
      "id": "o2",
      "text": "Heart rate decreased to 88 bpm",
      "isCorrect": true,
      "rationale": "Reduction in tachycardia suggests decreased circulatory stress and improved cardiac output."
    },
    {
      "id": "o3",
      "text": "Urine output 40 mL/hr",
      "isCorrect": true,
      "rationale": "Adequate urine output indicates improved renal perfusion and response to fluid therapy."
    },
    {
      "id": "o4",
      "text": "Lactate level decreased to 1.8 mmol/L",
      "isCorrect": true,
      "rationale": "Decreasing lactate levels indicate improved tissue oxygenation and resolution of anaerobic metabolism."
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

Create the complete case study JSON for: {TOPIC}

Output pure JSON only, starting with `{` and ending with `}`.
