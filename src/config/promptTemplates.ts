
export const DIFFICULTY_GUIDE = `
**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.
`;

export const COMMON_RULES = `
**CRITICAL: JSON INTEGRITY RULES**
1. **NO Trailing Commas**: Never leave a comma after the last item in an array or object.
2. **HTML Attributes**: Use single quotes inside HTML string values (e.g. style='width:100%').
3. **Double Quotes Only**: All JSON keys and string values must use double quotes.
4. **No Markdown**: Do NOT wrap output in markdown code blocks. Return raw JSON only.
5. **No Comments**: Do not include // or /* */ comments in the JSON.

**CRITICAL: CLINICAL ACCURACY & LOGIC**
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.
`;

// --- NEW CLINICAL REASONING SCHEMA ---
const RATIONALE_SCHEMA_BLOCK = `
"rationale": {
    "coreConcept": "Clinical Concept (e.g., Heart Failure)",
    "caseSummary": "Brief story summary.",
    "steps": [
       {"tag": "Recognize Cues", "description": "..."},
       {"tag": "Analyze Cues", "description": "..."},
       {"tag": "Prioritize Hypotheses", "description": "..."},
       {"tag": "Generate Solutions", "description": "..."},
       {"tag": "Take Action", "description": "..."},
       {"tag": "Evaluate Outcomes", "description": "..."}
    ],
    "answerAnalysis": "Detailed clinical breakdown of why the answer is correct.",
    "optionReviews": [
       {"id": "o1", "text": "Option text", "isCorrect": true, "rationale": "Detailed explanation..."}
    ],
    "trap": "Common pitfall or distractor trap.",
    "goldenRule": "Key takeaway or rule of thumb.",
    "mnemonic": { "title": "Example", "content": "A-B-C", "explanation": "..." },
    "cheatSheet": { "title": "Quick Facts", "points": ["Fact 1", "Fact 2"] },
    "referenceInfo": {
       "anatomy": "Relevant anatomy...",
       "physiology": "Relevant physiology...",
       "pharm": "Relevant pharmacology..."
    }
}
`;

export const PROMPT_CASE_STUDY = `
# NGN 6-Screen Case Study Prompt

Generate **[QUANTITY]** **NGN 6-Screen Case Study** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) complete 6-Screen NGN Case Study/Studies.
**CRITICAL REQUIREMENT:** You MUST generate ALL 6 SCREENS for the case study. Do not stop at 5. The final screen (Screen 6 - SATA) is mandatory. Failure to generate Screen 6 will break the exam.

**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array \`[...]\` containing the case objects.
2. **NO DUPLICATES:** Each case study MUST cover a completely different clinical topic/system (e.g., 1 Cardiac, 1 Peds, 1 Neuro).
3. **CLINICAL CONSISTENCY:** The \`clinicalData\` (Vitals, Notes, History) MUST be perfectly relevant to the case scenario and questions. Do NOT generate random data. If the case is about Sepsis, the vitals MUST show fever/tachycardia.
4. Follow the strict schema below.
5. **RANDOMIZE ORDER:** For all inner questions (Screen 1-6), randomize the order of answer choices, rows, and dropdown options to prevent predictable patterns (e.g. Option A is always correct). Do not group correct answers together.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in \`[]\` or \`{}\`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., \`style='width:100%'\`).
3.  **Double Quotes Only**: All JSON keys and string values use \`"\`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in \` \`\`\`json \`. Return raw JSON only.
5.  **Escape Newlines**: Use \`\\n\` inside strings, not literal line breaks.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use \`\\'\`. Use plain \`'\` inside strings (e.g. "patient's" NOT "patient\\'s").

## 📄 2. Content Guidelines
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use initials format: 2 letters + 3 numbers + .RN (e.g. JD123.RN).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology & Orders**: Format with Date/Time first (e.g. "10/24 0800"), then Test/Order Name. For Radiology, put results on a new line in **monospace** font.
- **Vitals**: For "o2", include delivery method (e.g. "94% 2L NC" or "98% RA").
- **CLINICAL LOGIC (CRITICAL)**: 
  - **Zero Hallucinations**: Do NOT invent incorrectly associated symptoms (e.g., Hyperglycemia is NOT a sign of Hyponatremia). 
  - **Plausible Distractors**: ALL distractors must be clinically relevant "near-misses". No random fillers.
  - **Dropdown Consistency**: In Cloze items, all options in a single dropdown must belong to the same category (e.g. all Medications, or all Pathologies).

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** \`rationale\` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the \`rationale\` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

\`\`\`json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Cardiogenic Shock')",
  "caseSummary": "A simplified, high-level summary of the case (The 'Hook'). Speak directly to the student.",
  "answerAnalysis": "Detailed breakdown of why the correct answer is correct (The 'Breakdown').",
  "trap": "The specific mental trap or common error students make.",
  "goldenRule": "A memorable one-liner or rule of thumb (The clinical gem).",
  "steps": [
    { "tag": "Recognize", "description": "Step 1 description..." },
    { "tag": "Analyze", "description": "Step 2 description..." },
    { "tag": "Take Action", "description": "Step 3 description..." }
  ],
  "mnemonic": {
    "title": "Acronym Title",
    "content": "A-B-C-D",
    "explanation": "Brief explanation of the mnemonic."
  },
  "cheatSheet": {
    "title": "Clinical Cheat Sheet",
    "points": [
      "Critical Point 1",
      "Critical Point 2",
      "Critical Point 3"
    ]
  },
  "referenceInfo": {
    "anatomy": "Brief anatomical context...",
    "physiology": "Brief physiological mechanism...",
    "pharm": "Key pharmacological facts..."
  }
}
\`\`\`

**CRITICAL INSTRUCTION**: You must generate *rich, detailed content* for the Mnemonic, Cheat Sheet, and Reference Info sections. These populate the "Strategy" and "Knowledge" tabs in the UI.

**HIGHLIGHT RULES (MANDATORY for Screen 2):**
1. You MUST highlight EXACTLY 5 distinct phrases/terms in the text using "span id='hX'" tags.
2. EXACTLY 2 of these highlights MUST be distractors (incorrect cues, not relevant to the patient's current condition).
3. EXACTLY 3 of these highlights MUST be correct clinical cues.
4. The 'prompt' field MUST use this exact wording structure: "Review the clinical data. Identify the five (5) findings that require immediate nursing intervention or further evaluation. Two (2) findings are distractors and not directly related to the patient's current presentation."

## 📋 4. Screen Types Reference (ALL 6 MANDATORY)
| Screen | Type | Key Fields |
|--------|------|------------|
| 1 | \`matrix\` | \`columns\`, \`rows\` with \`correctColumnId\`, \`rationale\` |
| 2 | \`highlight\` | \`text\` with \`<span id='hX'>\` (AT LEAST 5 total highlights, EXACTLY 2 MUST be distractors), \`correct[]\`, \`rationales{}\` |
| 3 | \`multiple-choice\` | \`options\` with \`isCorrect\`, \`rationale\` |
| 4 | \`bow-tie\` | \`actions\`, \`conditions\`, \`parameters\` each with \`isCorrect\`, \`rationale\` |
| 5 | \`cloze\` | \`sentences\` with \`dropdowns\`, each option has \`isCorrect\`, \`rationale\` |
| 6 | \`multiple-response\` | \`options\` with \`isCorrect\` (Select All That Apply) |

## 5. METADATA REQUIREMENTS
**CRITICAL:** You MUST classify the generated question accurately according to the NCSBN Clinical Judgment Measurement Model (CJMM) and Client Needs categories. This data is critical for student performance tracking.

**Required Metadata Block (Inside \`content\`):**
\`\`\`json
"metadata": {
  "clientNeeds": "Physiological Integrity", // Must be one of the 4 main NCSBN categories
  "clientNeedsSub": "Pharmacological and Parenteral Therapies", // The specific sub-category
  "cjmmStep": "Generate Solutions", // Must match the question type (Screen 1=Recognize, Screen 6=Evaluate)
  "difficulty": "Hard", // Easy, Moderate, Hard
  "topic": "Cardiology / Heart Failure",
  "peerAverageTime": "90" // Estimated seconds for this specific item
}
\`\`\`

## 6. Complete JSON Schema

\`\`\`json
{
  "type": "case-study",
  "content": {
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Pharmacological and Parenteral Therapies",
      "cjmmStep": "Form Hypotheses",
      "difficulty": "Hard",
      "topic": "Cardiology / Heart Failure",
      "peerAverageTime": "90"
    },
    "rationale": {
      "coreConcept": "Hypovolemic Shock vs Cardiogenic Shock",
      "caseSummary": "Think of the heart as a plumber's pump: if the pipes are dry, the pump runs fast. In this case, the patient is hypotensive + tachycardic, likely due to low volume.",
      "answerAnalysis": "The correct answer emphasizes fluid resuscitation because the primary problem is 'empty pipes'. Beta-blockers would block the pump without fixing the volume, worsening the shock.",
      "trap": "The 'Treat-the-Number' Trap: Don't just treat the high HR; fix the volume first.",
      "goldenRule": "In hypovolemic shock, tachycardia is a friend (compensation), not an enemy.",
      "steps": [
        { "tag": "Recognize", "description": "Identify hypotension and tachycardia as shock signs." },
        { "tag": "Analyze", "description": "Determine if cause is Pump (Cardiogenic) or Pipes (Hypovolemic)." },
        { "tag": "Take Action", "description": "Refill the pipes (Fluids) before slowing the pump." }
      ],
      "mnemonic": {
        "title": "SHOCK",
        "content": "S-Skin (Pale/Cool), H-HR (High), O-Oliguria, C-Confusion, K-Kills (hypotension)",
        "explanation": "Remember the key signs of widespread hypoperfusion."
      },
      "cheatSheet": {
        "title": "Shock Management Pearls",
        "points": [
          "MAP < 65 mmHg = Organ Death",
          "Trends > Single Values",
          "Lactate > 2 = Cellular Hypoxia"
        ]
      },
      "referenceInfo": {
        "anatomy": "The heart relies on venous return (preload) to pump effectively.",
        "physiology": "Sympathetic Nervous System activates to maintain BP (Vasoconstriction + Tachycardia).",
        "pharm": "Isotonic crystalloids (NS/LR) remain in the intravascular space initially."
      }
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Em...Th...", 
        "age": "65", 
        "sex": "Female", 
        "mrn": "123456789", 
        "codeStatus": "Full Code", 
        "allergies": "Penicillin", 
        "provider": "Dr. Smith", 
        "ward": "ICU", 
        "bed": "12" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Patient admitted with chest pain.<br><b>Objective:</b> BP 90/60, HR 110.<br><b>Actions:</b> ECG obtained.<br><b>Response:</b> Awaiting results.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>JD123.RN</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Chest pain radiating to jaw.<br><b>History of Present Illness:</b> 65yo female with HTN, DM presents with 2hr chest pressure.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>HTN: Hypertension<br>DM: Diabetes Mellitus</div>",
      "vitals": [
        { "time": "0800", "tempF": "98.6°F (37.0°C)", "hr": "110", "rr": "22", "bp": "90/60", "o2": "94% RA" },
        { "time": "0900", "tempF": "99.0°F (37.2°C)", "hr": "118", "rr": "24", "bp": "85/55", "o2": "91% 2L NC" }
      ],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Troponin</td><td style='padding: 4px'><b>2.5</b></td><td style='padding: 4px'>0-0.04 ng/mL</td></tr><tr><td style='padding: 4px'>BNP</td><td style='padding: 4px'><b>890</b></td><td style='padding: 4px'>&lt;100 pg/mL</td></tr></tbody></table>",
      "orders": "10/24 0800: 1. 12-lead ECG STAT\\n10/24 0805: 2. Troponin q6h x3\\n10/24 0810: 3. Aspirin 325mg PO\\n10/24 0815: 4. Morphine 2mg IV PRN",
      "radiology": "<b>10/24 0830 - Chest X-Ray:</b><br><div style='font-family:monospace; margin-top:4px'>Cardiomegaly with pulmonary edema reported.</div>"
    },
    "structure": {
      "type": "case-study",
      "screens": [
        {
          "type": "matrix",
          "prompt": "Categorize findings as 'STEMI Indicators' or 'Non-Specific'.",
          "columns": [
            { "id": "c1", "label": "STEMI Indicators" },
            { "id": "c2", "label": "Non-Specific" }
          ],
          "rows": [
            { "id": "r1", "text": "ST elevation in V2-V4", "correctColumnId": "c1", "rationale": "..." },
            { "id": "r2", "text": "Elevated troponin 2.5", "correctColumnId": "c1", "rationale": "..." }
          ],
           "rationale": {
              "coreConcept": "...",
              "caseSummary": "...",
              "answerAnalysis": "...",
              "trap": "...",
              "goldenRule": "...",
              "steps": [],
              "mnemonic": {},
              "cheatSheet": {},
              "referenceInfo": {}
           }
        }
      ]
    }
  }
}
\`\`\`
`;

export const PROMPT_BOW_TIE = `
Generate **[QUANTITY]** **Bow-Tie** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Bow-Tie NGN Item.
**TYPE:** bow-tie

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "bow-tie",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "actions": [ {"id":"a1", "text":"...", "isCorrect":true, "rationale":"..."} ],
             "conditions": [ {"id":"c1", "text":"...", "isCorrect":true, "rationale":"..."} ],
             "parameters": [ {"id":"p1", "text":"...", "isCorrect":true, "rationale":"..."} ],
             "correct": { "condition":"c1", "actions":["a1","a2"], "parameters":["p1","p2"] }
        }
    }
}
`;

export const PROMPT_TREND = `
Generate **[QUANTITY]** **Trend** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Trend NGN Item.
**TYPE:** trend

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "trend",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "trendData": { "timePoints": [], "parameters": [] },
             "options": [ {"id":"o1", "text":"...", "isCorrect":true, "rationale":"..."} ]
        }
    }
}
`;

export const PROMPT_CLOZE_DROPDOWN = `
Generate **[QUANTITY]** **Cloze (Dropdown)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Cloze (Dropdown) NGN Item.
**TYPE:** cloze

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**CRITICAL CONTENT RULE:**
The 'text' field in 'sentences' is MANDATORY. It MUST contain the sentence text with the token placeholders (e.g. %id%). DO NOT OMIT THIS FIELD.

**SCHEMA:**
{
    "type": "cloze",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "sentences": [
                 {
                     "text": "Pt has %diagnosis%...",
                     "dropdowns": [
                         { "id":"diagnosis", "options": [{"id":"o1", "text":"...", "isCorrect":true, "rationale":"..."}], "correctOptionId":"o1" }
                     ]
                 }
             ]
        }
    }
}
`;

export const PROMPT_HIGHLIGHT = `
Generate **[QUANTITY]** **Highlight Text** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Highlight NGN Item.
**TYPE:** highlight

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**HIGHLIGHT RULES:**
1. You MUST highlight EXACTLY 5 distinct phrases/terms in the text using "span id='hX'" tags.
2. EXACTLY 2 of these highlights MUST be distractors (incorrect cues, not relevant to the patient's current condition).
3. EXACTLY 3 of these highlights MUST be correct clinical cues.
4. The 'prompt' field MUST use this exact wording structure: "Review the clinical data. Identify the five (5) findings that require immediate nursing intervention or further evaluation. Two (2) findings are distractors and not directly related to the patient's current presentation."

**SCHEMA:**
{
    "type": "highlight",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "Highlight the findings that require immediate intervention.",
             "text": "Patient is <span id='h1'>cyanotic</span> with <span id='h2'>stable vitals</span> and <span id='h3'>shallow respirations</span>...",
             "correct": ["h1", "h3"],
             "rationales": { 
                "h1": "[Hook] Cyanosis. [Breakdown] Indicates severe hypoxia.",
                "h2": "[Hook] Stable Vitals. [Breakdown] This is a distractor; stable vitals do not require immediate intervention in this context.",
                "h3": "[Hook] Shallow Respirations. [Breakdown] Indicates respiratory failure."
             }
        }
    }
}
`;

export const PROMPT_MATRIX = `
Generate **[QUANTITY]** **Matrix** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Matrix NGN Item.
**TYPE:** matrix

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "matrix",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "columns": [{"id":"c1", "label":"Effective"}],
             "rows": [ {"id":"r1", "text":"...", "correctColumnId":"c1", "rationale":"..."} ]
        }
    }
}
`;

export const PROMPT_ORDERED_RESPONSE = `
Generate **[QUANTITY]** **Ordered Response** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate an Ordered Response NGN Item.
**TYPE:** ordered-response

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "ordered-response",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "orderedOptions": [
                 {"id":"s1", "text":"Step 1...", "rationale":"..."}
             ]
        }
    }
}
`;

export const PROMPT_SATA = `
Generate **[QUANTITY]** **Multiple Response (SATA)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Multiple Response (SATA) NGN Item.
**TYPE:** multiple-response

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "multiple-response",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "options": [
                 {"id":"o1", "text":"...", "isCorrect":true, "rationale":"..."}
             ]
        }
    }
}
`;

export const PROMPT_DROP_CLOZE = `
Generate **[QUANTITY]** **Drop-Cloze** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Drop Cloze NGN Item.
**TYPE:** drop-cloze

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**CRITICAL CONTENT RULE:**
The 'text' field in 'sentences' is MANDATORY. It MUST contain the sentence text with the token placeholders (e.g. %id%). DO NOT OMIT THIS FIELD.

**SCHEMA:**
{
    "type": "drop-cloze",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "tokens": ["Token A", "Token B"],
             "sentences": [
                 {
                     "text": "Pt needs %intervention%...",
                     "dropdowns": [
                         { "id":"intervention", "correctOptionText":"Token A", "rationale":"..." }
                     ]
                 }
             ]
        }
    }
}
`;

export const PROMPT_HOTSPOT = `
Generate **[QUANTITY]** **Standalone Hot Spot** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Hot Spot NGN Item.
**TYPE:** hot-spot

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the 'rationale' MUST be a simple **STRING**.

${COMMON_RULES}

**SCHEMA:**
{
    "type": "hot-spot",
    "content": {
        ${RATIONALE_SCHEMA_BLOCK},
        "clinicalData": { ... },
        "structure": {
             "prompt": "...",
             "areas": [
                 {"id":"a1", "x":50, "y":50, "radius":10, "isCorrect":true, "rationale":"..."}
             ]
        }
    }
}
`;


export const PROMPT_SINGLE_RESPONSE = `
**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text [1] only.

---

Generate **[QUANTITY]** **Single Response (Multiple Choice)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Single Response (Multiple Choice) NGN Item.
**CRITICAL REQUIREMENT:** These are **NOT** Case Studies. They are standalone, single-screen items.

**CONSTRAINTS:**
1. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
2. **CLINICAL CONSISTENCY:** The clinicalData (patient info, vitals, etc) MUST be relevant.
3. **RICH EHR DATA:** You MUST populate "history", "vitals", "labs", and "orders" to match the scenario. Do NOT leave them empty.
    - **Nurses Notes (history)**: MUST use a Time/Note format (Time: Event).
    - **H&P (historyPhysical)**: Must include HPI/PMH.
4. Follow the strict schema below.
5. **SINGLE ANSWER ONLY**: EXACTLY ONE option must have "isCorrect": true. All others must be false.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in [] or {}.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., style='width:100%').
3.  **Double Quotes Only**: All JSON keys and string values use ". No smart quotes.
4.  **No Markdown**: Do NOT wrap output in \`\`\`json. Return raw JSON only.
5.  **Escape Newlines**: Use \\n inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use \\'. Use plain ' inside strings.

## 2. Content Guidelines
- **Options**: 4 options total.
- **Correct Answers**: EXACTLY ONE (1).
- **Difficulty**: Higher cognitive level (Analysis/Application).

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate.
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context.
3. **Logical Consistency**: The correct answer must be indisputably correct.

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces (curly and square) closed? Are there NO trailing commas?
2.  **Logic Check**: Is there EXACTLY ONE correct answer?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
*If any check fails, regenerate immediately.*

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
${RATIONALE_SCHEMA_BLOCK}

## 4. METADATA REQUIREMENTS (Perfect Fill)
**CRITICAL:** You MUST provided detailed metadata for the "Expert Analytics" dashboard.

\`\`\`json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Pharmacological Therapies",
  "cjmmStep": "Generate Solutions",
  "difficulty": "Moderate",
  "topic": "Cardiology",
  "peerAverageTime": "45"
}
\`\`\`

## 5. Complete JSON Schema

\`\`\`json
{
  "type": "multiple-choice", 
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" },
       "history": "<p><strong>07:00:</strong> Client admitted to ED via ambulance...</p><p><strong>07:15:</strong> Vitals assessed. Client reports...</p>",
       "historyPhysical": "<p><strong>Past Medical History:</strong> COPD, HTN, T2DM.</p><p><strong>HPI:</strong> 62yo M presents with...</p>",
       "vitals": [ { "time": "0800", "tempF": "98.6", "hr": 88, "rr": 24, "bp": "145/90", "o2": "88% RA" } ],
       "labs": "<ul><li><strong>WBC:</strong> 14.5 (High)</li><li><strong>Hgb:</strong> 13.2</li></ul>",
       "orders": "<ul><li>Oxygen 2L NC</li><li>Albuterol Nebulizer q4h</li></ul>",
       "radiology": "<p><strong>CXR:</strong> Bilateral lower lobe infiltrates.</p>"
    },
    "metadata": {
        "clientNeeds": "Physiological Integrity",
        "clientNeedsSub": "Pharmacological Therapies",
        "cjmmStep": "Generate Solutions",
        "difficulty": "Moderate",
        "topic": "Diabetes",
        "peerAverageTime": "60"
    },
    "rationale": {
        "coreConcept": "Topic",
        "caseSummary": "Summary",
        "answerAnalysis": "Analysis",
        "trap": "Trap hint",
        "goldenRule": "Golden Rule",
        "steps": [],
        "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
        "cheatSheet": { "title": "...", "points": [] },
        "referenceInfo": { "anatomy": "...", "physiology": "...", "pharm": "..." }
    },
    "structure": {
        "prompt": "Which of the following interventions is priority?",
        "options": [
            { "id": "o1", "text": "Assess airway patency", "isCorrect": true, "rationale": "Priority due to ABCs." },
            { "id": "o2", "text": "Administer pain medication", "isCorrect": false, "rationale": "Pain is psychosocial, not physiological priority." },
            { "id": "o3", "text": "Call the provider", "isCorrect": false, "rationale": "Assessment must occur before notification." },
            { "id": "o4", "text": "Document findings", "isCorrect": false, "rationale": "Documentation comes after action." }
        ]
    }
  }
}
\`\`\`
`;


export const PROMPT_CALCULATION = `
Generate **[QUANTITY]** **Fill-in-the-Blank Calculation** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

${DIFFICULTY_GUIDE}

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate a Calculation/Dosage NGN Item.
**TYPE:** calculation

**RATIONALE FORMAT:**
The **MAIN Screen-Level** 'rationale' field MUST be a JSON OBJECT (not a string).
${RATIONALE_SCHEMA_BLOCK}

${COMMON_RULES}

**SCORING:** 0/1 (All or nothing). No partial credit.
**ROUNDING RULE:** The question text (prompt) MUST explicitly state the rounding rule.

**SCHEMA:**
{
  "type": "calculation",
  "content": {
    "type": "calculation",
    "clinicalData": { ... },
    "metadata": { ... },
    "rationale": { ... },
    "structure": {
      "prompt": "The provider prescribes... Calculate the volume to administer in mL. (Round to the nearest tenth).",
      "units": "mL",
      "label": "mL",
      "inputLabel": "mL",
      "answer": 14.1,
      "correctValue": 14.1,
      "acceptableRange": [14.1, 14.1],
      "explanation": "Step 1: Convert lbs to kg..."
    }
  }
}
`;

export const PROMPT_MAP: Record<string, string> = {
  // Long IDs (Legacy/Service)
  'case-study-6-screen': PROMPT_CASE_STUDY,
  'bowtie-standalone': PROMPT_BOW_TIE,
  'trend-standalone': PROMPT_TREND,
  'cloze-dropdown': PROMPT_CLOZE_DROPDOWN,
  'drop-cloze': PROMPT_DROP_CLOZE,
  'highlight-text': PROMPT_HIGHLIGHT, // Legacy
  'matrix-mr': PROMPT_MATRIX,
  'ordered-response': PROMPT_ORDERED_RESPONSE,
  'multiple-response-sata': PROMPT_SATA,
  'hot-spot': PROMPT_HOTSPOT,
  'single-response': PROMPT_SINGLE_RESPONSE,
  'multiple-choice': PROMPT_SINGLE_RESPONSE,
  'calculation': PROMPT_CALCULATION,

  // Registry IDs (Short Forms) - FIXED MAPPING
  'highlight': PROMPT_HIGHLIGHT,
  'case-study': PROMPT_CASE_STUDY,
  'bow-tie': PROMPT_BOW_TIE,
  'trend': PROMPT_TREND,
  'matrix': PROMPT_MATRIX,
  'multiple-response': PROMPT_SATA,
  'sata': PROMPT_SATA,
  'cloze': PROMPT_CLOZE_DROPDOWN,
  'matrix-multiple-response': PROMPT_MATRIX,
  'drag-drop-ordered': PROMPT_ORDERED_RESPONSE,
  'dosage': PROMPT_CALCULATION
};

