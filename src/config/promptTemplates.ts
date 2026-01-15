
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
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate.
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
`;

// ==========================================
// 1. CASE STUDY (6-Screen)
// ==========================================
export const PROMPT_CASE_STUDY = `
# GOLDEN NGN CASE STUDY GENERATOR (v3.2 - FIXED)

## 📌 PARAMETERS (FILL FIRST)
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]      (CRITICAL: Use 85-95 for Expert/Level 5. Use 65-75 for Synthesis/Level 4)

## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer & Clinical Nurse Educator
CONTEXT: Educational Exam Simulation Only
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Complete 6-Screen NGN Case Study
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- All keys and string values: Double quotes only.
- NO trailing commas after last item in any array/object.
- Newlines inside strings: Escape as "\\n".
- HTML attributes inside strings: Single quotes (e.g., style='color:red').
- All HTML tags must close properly.

### 2. ITEM TYPE SEQUENCE (FIXED ORDER)
You MUST generate exactly 6 screens. Do not skip. Do not reorder.

| Screen | CJMM Step | Type | Purpose |
|--------|-----------|------|---------|
| 1 | Recognize Cues | highlight | Scan & identify abnormal findings |
| 2 | Analyze Cues | matrix | Sort data into categories |
| 3 | Prioritize Hypotheses | ordered-response | Rank by urgency |
| 4 | Generate Solutions | bow-tie | Connect diagnosis → action |
| 5 | Take Action | drop-cloze | Complete nursing orders |
| 6 | Evaluate Outcomes | multiple-response | Assess response to intervention |

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**

### For EACH SCREEN's rationale:
\`\`\`json
"rationale": {
  "coreConcept": "REQUIRED - 1-2 sentences",
  "caseSummary": "REQUIRED - 2-3 sentences", 
  "answerAnalysis": "REQUIRED - detailed breakdown",
  "trap": "REQUIRED - common mistake",
  "goldenRule": "REQUIRED - memorable axiom",
  "steps": [
    { "tag": "Recognize", "description": "REQUIRED" },
    { "tag": "Analyze", "description": "REQUIRED" },
    { "tag": "Act", "description": "REQUIRED" }
  ],
  "mnemonic": {
    "title": "REQUIRED - e.g. SBAR",
    "content": "REQUIRED - expanded form",
    "explanation": "REQUIRED - why it helps"
  },
  "cheatSheet": {
    "title": "REQUIRED",
    "points": ["REQUIRED - at least 3 points"]
  },
  "referenceInfo": {
    "anatomy": "REQUIRED - relevant anatomy for this case",
    "physiology": "REQUIRED - relevant physiology",
    "pharm": "REQUIRED - relevant pharmacology or none if N/A"
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "REQUIRED"
  }
}
\`\`\`

**DO NOT LEAVE ANY FIELD AS:**
- Empty string ""
- Null
- "N/A" without context
- "See above"
- References to other screens

**EACH SCREEN MUST BE SELF-CONTAINED WITH COMPLETE RATIONALE.**

### 3. CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
\`\`\`json
"vitals": [
  {
    "time": "0800",
    "tempF": "101.5",
    "hr": 115,
    "rr": 24,
    "bp": "88/52",
    "o2": "92",
    "o2_device": "4L NC",
    "pain": 7
  }
]
\`\`\`
**Labs with Flags:** "H" (high), "L" (low), "H!" (critical high), "L!" (critical low)
**Clinical Consistency Rule:** Vitals, labs, and orders MUST align with the scenario.
**Anti-Generic Rationale Rule:** You are FORBIDDEN from using phrases like "Correct finding", "Appropriate choice", or "Incorrect". You MUST explain the *pathophysiology* or *clinical reasoning* (e.g., "Hypotension indicates pump failure..." NOT "Hypotension is the correct answer").

---

## 🏥 COMPLETE CLINICAL DATA REQUIREMENTS (Level 4-5)

**For Expert-level Case Studies (Level 4-5), you MUST include ALL of the following:**

### 1. Nurses Notes (MINIMUM 2 entries)
\`\`\`json
"history": "<p><strong>0800 - Nursing Assessment:</strong> Patient presents with [chief complaint]. Reports [symptoms]. [Relevant history]. Vital signs: [initial vitals]. Patient appears [general appearance].</p><p><strong>0930 - Follow-up Note:</strong> Interventions initiated: [what was done]. Patient response: [how they responded]. Current status: [current assessment]. Notified [provider] of [findings].</p>"
\`\`\`
**ALTERNATIVE ARRAY FORMAT:**
\`\`\`json
"nursesNotes": [
  { "time": "0800", "author": "RN Smith", "entry": "Initial assessment..." },
  { "time": "0930", "author": "RN Smith", "entry": "Follow-up..." }
]
\`\`\`

### 2. History & Physical (REQUIRED for Level 4-5)
\`\`\`json
"historyPhysical": {
  "chiefComplaint": "Detailed presenting complaint",
  "hpi": "Detailed history...",
  "pmh": ["Condition 1", "Condition 2"],
  "psh": ["Surgery 1"],
  "medications": ["Med 1", "Med 2"],
  "allergies": "Allergies",
  "socialHistory": "Social history...",
  "familyHistory": "Family history...",
  "reviewOfSystems": {
    "constitutional": "...",
    "cardiovascular": "...",
    "respiratory": "...",
    "gi": "..."
  },
  "physicalExam": {
    "general": "...",
    "vital signs": "See vitals tab",
    "cardiovascular": "...",
    "respiratory": "...",
    "abdomen": "...",
    "extremities": "..."
  }
}
\`\`\`

### 3. Medical Orders (MINIMUM 4 orders)
\`\`\`json
"orders": [
  { "order": "IV Furosemide 40mg x1 NOW", "status": "Active", "orderedBy": "Dr. Cardiologist", "time": "0820" }
]
\`\`\`

### 4. Radiology (INCLUDE if clinically relevant)
\`\`\`json
"radiology": [
  {
    "study": "Chest X-Ray",
    "date": "Current Date",
    "indication": "SOB",
    "findings": "Findings...",
    "impression": "Impression...",
    "radiologist": "Dr. Name"
  }
]
\`\`\`

### 5. Vitals (MINIMUM 2 readings to show trend)
\`\`\`json
"vitals": [
  { "time": "0800", "tempF": "98.6", "hr": 102, "rr": 24, "bp": "158/92", "o2": "89", "o2_device": "RA", "pain": 0 },
  { "time": "0900", "tempF": "98.4", "hr": 88, "rr": 20, "bp": "142/84", "o2": "94", "o2_device": "2L NC", "pain": 0 }
]
\`\`\`

---

## 🧠 RATIONALE OBJECT (REQUIRED FOR EVERY SCREEN)

Use this EXACT schema for \`content.rationale\` (global) AND \`structure.screens[i].rationale\` (each screen).

**DO NOT leave any field empty. Fill with educational content.**

\`\`\`json
{
  "coreConcept": "string (1-2 sentences)",
  "caseSummary": "string (2-3 sentences)",
  "answerAnalysis": "string (detailed breakdown)",
  "trap": "string (common mistake)",
  "goldenRule": "string (axiom)",
  "steps": [
    { "tag": "Recognize", "description": "What cues to identify" },
    { "tag": "Analyze", "description": "How to interpret" },
    { "tag": "Take Action", "description": "What to do" }
  ],
  "mnemonic": {
    "title": "ACRONYM",
    "content": "Expanded",
    "explanation": "Why it helps"
  },
  "cheatSheet": {
    "title": "Clinical Pearls",
    "points": [ "Point 1", "Point 2", "Point 3" ]
  },
  "referenceInfo": {
    "anatomy": "CASE-SPECIFIC anatomy",
    "physiology": "CASE-SPECIFIC physiology",
    "pharm": "CASE-SPECIFIC pharm"
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard/Expert",
    "clinicalStrategy": "Strategy",
    "recommendedActions": ["Action 1"]
  }
}
\`\`\`

---

## 📦 COMPLETE JSON ROOT STRUCTURE

**IMPORTANT: Your output MUST follow this exact structure:**

\`\`\`json
{
  "type": "case-study",
  "content": {
    "metadata": {
      "title": "Case Study Title Based on Clinical Focus",
      "clinicalFocus": "[FOCUS]",
      "level": [LEVEL],
      "targetScore": [SCORE],
      "generator": "Golden NGN v3"
    },
    "patient": {
      "name": "Patient Name, Initials",
      "age": 45,
      "sex": "Female",
      "allergies": "NKDA or list",
      "weightKg": 75,
      "history": ["Condition 1", "Condition 2"],
      "homeMeds": [
        { "name": "Medication", "dose": "10mg", "route": "PO", "frequency": "daily" }
      ]
    },
    "setting": "Emergency Department or Unit Name",
    "chiefComplaint": "Chief complaint in 1-2 sentences",
    "vitals": [
      {
        "time": "0800",
        "tempF": "98.6",
        "hr": 88,
        "rr": 18,
        "bp": "120/80",
        "o2": "98",
        "o2_device": "Room Air",
        "pain": 3
      }
    ],
    "labs": [
      { "test": "WBC", "value": "12.5", "unit": "K/uL", "flag": "H", "reference": "4.5-11.0" }
    ],
    "assessmentData": {
      "screening": {
        "tool": "PHQ-9 or relevant tool",
        "score": 15,
        "interpretation": "Interpretation text"
      }
    },
    "rationale": {
      "...full global rationale object matching the schema above..."
    }
  },
  "structure": {
    "type": "case-study",
    "screens": [
      { "...screen 1 object with type, cjmmStep, prompt, and full rationale..." },
      { "...screen 2 object..." },
      { "...screen 3 object..." },
      { "...screen 4 object..." },
      { "...screen 5 object..." },
      { "...screen 6 object..." }
    ]
  }
}
\`\`\`
`;

// ==========================================
// 2. BOW-TIE
// ==========================================
export const PROMPT_BOW_TIE = `
# GOLDEN NGN BOW-TIE ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Bow-Tie Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY
- Double quotes only.
- NO trailing commas.

### 2. BOW-TIE RULES
- **Actions:** Left Column. Provide exactly 5 options (2 Correct, 3 Incorrect).
- **Conditions:** Center Column. Provide exactly 4 options (1 Correct, 3 Incorrect).
- **Parameters:** Right Column. Provide exactly 5 options (2 Correct, 3 Incorrect).
- **Distractors:** Must be plausible near-misses (e.g. similar symptoms or related meds).
- **Logic:** The Condition must logically link Actions and Parameters.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

---

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required)**

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown:**
\`\`\`json
"rationale": {
  "coreConcept": "Concept Name",
  "caseSummary": "Summary",
  "answerAnalysis": "Why correct options are correct...",
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
    "clinicalStrategy": "Identify Condition First",
    "recommendedActions": ["Check Actions vs Condition"]
  }
}
\`\`\`

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "bow-tie",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Hard",
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Generate Solutions",
      "targetScore": [SCORE]
    },
    "patient": {
      "name": "Initials", "age": 45, "sex": "Male", "allergies": "NKDA", "weightKg": 90
    },
    "setting": "Clinic",
    "chiefComplaint": "Symptoms",
    "vitals": [ 
      { "time": "0800", "tempF": 99.1, "hr": 88, "rr": 18, "bp": "120/80", "spo2": 98, "pain": 2 }
    ],
    "historyPhysical": { "note": "Detailed H&P..." },
    "labs": [],
    "orders": [
      { "order": "NaCl 0.9%", "dose": "1000ml", "route": "IV", "freq": "Continuous", "indication": "Hydration" },
      { "order": "Acetaminophen", "dose": "650mg", "route": "PO", "freq": "q6h PRN", "indication": "Pain/Fever" }
    ],
    "nursesNotes": [
      { "time": "0800", "note": "Patient resting comfortably. Vitals stable." },
      { "time": "0815", "note": "Dr. Smith notified of lab results." }
    ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "bow-tie",
      "prompt": "Complete the diagram...",
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
\`\`\`
`;

// ==========================================
// 3. DROP-CLOZE
// ==========================================
export const PROMPT_DROP_CLOZE = `
# GOLDEN NGN DROP-CLOZE GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Drop-Cloze Item(s)

## RULES
- **Structure:** 1-2 Sentences max.
- **Dropdowns:** 1-2 Dropdowns total.
- **Options:** Exactly 3-5 options per dropdown (Cognitive Load limit).
- **Rationale:** GRANULAR RATIONALE for EVERY option in 'blankMap'.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "drop-cloze",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Medium",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "patient": { "name": "Initials", "age": 72, "sex": "F", "allergies": "NKA", "weightKg": 70 },
    "vitals": [ 
      { "time": "0800", "tempF": 99.1, "hr": 88, "rr": 18, "bp": "120/80", "spo2": 98, "pain": 2 }
    ],
    "historyPhysical": { "note": "Detailed H&P..." },
    "labs": [],
    "orders": [
      { "order": "NaCl 0.9%", "dose": "1000ml", "route": "IV", "freq": "Continuous", "indication": "Hydration" }
    ],
    "nursesNotes": [
      { "time": "0800", "note": "Patient admitted..." }
    ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "drop-cloze",
      "prompt": "Complete the sentences.",
      "sentences": [
        {
          "text": "The nurse should administer %{d1} due to the risk of %{d2}.",
          "dropdowns": [
            {
              "id": "d1",
              "options": [
                { "id": "o1", "text": "Correct Drug", "isCorrect": true },
                { "id": "o2", "text": "Distractor", "isCorrect": false }
              ]
            },
            {
              "id": "d2",
              "options": [ ... ]
            }
          ]
        }
      ],
      "blankMap": {
        "d1": {
          "correctOptionId": "o1",
          "whyCorrect": "Detailed reason...",
          "distractorRationales": {
            "o2": "Why incorrect..."
          }
        },
        "d2": {
          "correctOptionId": "o3",
          "whyCorrect": "Detailed reason...",
          "distractorRationales": { ... }
        }
      }
    }
  }
}
\`\`\`
`;

// ==========================================
// 4. HIGHLIGHT
// ==========================================
export const PROMPT_HIGHLIGHT = `
# GOLDEN NGN HIGHLIGHT GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Highlight Item(s)

## RULES
- **Stem:** < 20 words (Concise).
- **Text:** 50-80 words (Context-rich, strictly enforced).
- **Tokens:** Wrap distinct phrases in <span id='hX'>...</span>.
- **Correct:** Min 3, Max N-1.
- **Rationales:** Detailed 'rationales' object with keys matching span IDs.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
- content.structure.rationale (For EACH span, must have isCorrect, whyCorrect, whyIncorrect)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "highlight",
  "content": {
    "metadata": { ... },
    "patient": { "name": "Initials", "age": 72, "sex": "F", "allergies": "NKA", "weightKg": 70 },
    "vitals": [ 
      { "time": "0800", "tempF": 99.1, "hr": 88, "rr": 18, "bp": "120/80", "spo2": 98, "pain": 2 }
    ],
    "historyPhysical": { "note": "Detailed H&P..." },
    "labs": [],
    "orders": [
      { "order": "Oxygen", "dose": "2L", "route": "NC", "freq": "Continuous", "indication": "Hypoxia" }
    ],
    "nursesNotes": [
      { "time": "0800", "note": "Patient presents with respiratory distress..." }
    ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "highlight",
      "prompt": "Highlight the findings...",
      "text": "Patient has <span id='h1'>Fever</span> and <span id='h2'>Chills</span>.",
      "correct": ["h1"],
      "decoys": ["h2"],
      "rationales": {
        "h1": {
          "isCorrect": true,
          "whyCorrect": "Fever indicates infection...",
          "whyIncorrect": "N/A"
        },
        "h2": {
          "isCorrect": false,
          "whyCorrect": "N/A",
          "whyIncorrect": "Chills are non-specific..."
        }
      }
    }
  }
}
\`\`\`
`;

// ==========================================
// 5. MATRIX
// ==========================================
export const PROMPT_MATRIX = `
# GOLDEN NGN MATRIX ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Matrix Item(s)

## RULES
- **Columns:** 2-3 Options.
- **Rows:** 4-6 Findings.
- **Rows:** 4-6 Findings.
- **Scoring:** One correct column per row.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "matrix",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "matrix",
      "prompt": "Indicate if findings support A or B.",
      "columns": [
        { "id": "c1", "text": "Condition A" },
        { "id": "c2", "text": "Condition B" }
      ],
      "rows": [
        { "id": "r1", "text": "Finding 1", "correctColumnId": "c1", "rationale": "Matches A because..." },
        { "id": "r2", "text": "Finding 2", "correctColumnId": "c2", "rationale": "Matches B because..." }
      ]
    }
  }
}
\`\`\`
`;

// ==========================================
// 6. MULTIPLE RESPONSE (SATA)
// ==========================================
export const PROMPT_SATA = `
# GOLDEN NGN MULTIPLE RESPONSE (SATA) ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone SATA Item(s)

## RULES
- **Options:** 5-6 items.
- **Correct:** Min 2 (or 1 if specified), Max N-1.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "multiple_response",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "multiple_response",
      "prompt": "Select all that apply.",
      "options": [
        { "id": "o1", "text": "Correct Option", "isCorrect": true, "rationale": "Why correct" },
        { "id": "o2", "text": "Incorrect Option", "isCorrect": false, "rationale": "Why incorrect" }
      ]
    }
  }
}
\`\`\`
`;

// ==========================================
// 7. ORDERED RESPONSE
// ==========================================
export const PROMPT_ORDERED_RESPONSE = `
# GOLDEN NGN ORDERED RESPONSE ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Ordered Response Item(s)

## RULES
- **Sequence:** orderedOptions array MUST be in correct order.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "ordered-response",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "ordered-response",
      "prompt": "Drag steps into order.",
      "orderedOptions": [
        { "id": "step1", "text": "First Action", "rationale": "First because..." },
        { "id": "step2", "text": "Second Action", "rationale": "Second because..." }
      ]
    }
  }
}
\`\`\`
`;

// ==========================================
// 8. SINGLE RESPONSE (MCQ)
// ==========================================
export const PROMPT_SINGLE_RESPONSE = `
# GOLDEN NGN SINGLE RESPONSE ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Single Response Item(s)

## RULES
- **Options:** Exactly 4.
- **Correct:** Exactly 1.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "single-response",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "single-response",
      "prompt": "Which action is priority?",
      "options": [
        { "id": "o1", "text": "Correct Option", "isCorrect": true, "rationale": "Why correct" },
        { "id": "o2", "text": "Distractor 1", "isCorrect": false, "rationale": "Why incorrect" },
        { "id": "o3", "text": "Distractor 2", "isCorrect": false, "rationale": "Why incorrect" },
        { "id": "o4", "text": "Distractor 3", "isCorrect": false, "rationale": "Why incorrect" }
      ]
    }
  }
}
\`\`\`
`;

// ==========================================
// 9. CALCULATION
// ==========================================
export const PROMPT_CALCULATION = `
# GOLDEN NGN CALCULATION ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Calculation Item(s)

## RULES
- **Scoring:** Exact match or Range.
- **Units:** Must be specified.
- **Units:** Must be specified.
- **Rationale:** Must include Formula and Dimensional Analysis steps.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.formulaMethod (REQUIRED)
- content.rationale.dimensionalAnalysis (REQUIRED)
- content.rationale.difficulty (REQUIRED)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "calculation",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": {
      "general": "Explanation...",
      "formulaMethod": "Formula...",
      "dimensionalAnalysis": "DA..."
    },
    "structure": {
      "type": "calculation",
      "prompt": "Calculate mL/hr.",
      "correctValue": 125,
      "units": "mL/hr",
      "acceptableRange": [125, 125]
    }
  }
}
\`\`\`
`;

// ==========================================
// 10. TREND
// ==========================================
export const PROMPT_TREND = `
# GOLDEN NGN TREND ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Trend Item(s)

## RULES
- **Trend Data:** Vitals or Labs at multiple timepoints.
- **Trend Data:** Vitals or Labs at multiple timepoints.
- **Question:** Identify if improving/worsening.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.mnemonic (REQUIRED - e.g. ADPIE/SBAR)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
- content.rationale.difficulty (REQUIRED - Score/Level/Strategy)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "trend",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "trend",
      "prompt": "Review trend...",
      "questionFormat": "sata",
      "options": [
        { "id": "o1", "text": "Hypotension", "isCorrect": true, "rationale": "Consistent with trend" }
      ]
    }
  }
}
\`\`\`
`;

// ==========================================
// 11. HOT SPOT
// ==========================================
export const PROMPT_HOTSPOT = `
# GOLDEN NGN HOT SPOT ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS
[QUANTITY] = 1
[FOCUS]    = [FOCUS]
[LEVEL]    = [LEVEL]
[SCORE]    = [SCORE]

# SYSTEM PARAMETERS
OUTPUT FORMAT: RAW JSON ONLY

## REQUEST
GENERATE: [QUANTITY] Standalone Hot Spot Item(s)

## RULES
- **Image:** Medical illustration description provided for generation.
- **Image:** Medical illustration description provided for generation.
- **Target:** X,Y coordinates and Radius.

## ⚠️ MANDATORY FIELD ENFORCEMENT (CRITICAL)
**YOU MUST INCLUDE ALL OF THE FOLLOWING IN EVERY RESPONSE:**
- content.rationale.coreConcept (REQUIRED - 1-2 sentences)
- content.rationale.steps (REQUIRED - Review/Analyze/Act)
- content.rationale.referenceInfo (REQUIRED - Anatomy/Physio/Pharm)
**DO NOT LEAVE ANY FIELD EMPTY OR "N/A".**

## 📦 JSON STRUCTURE (STRICT)

\`\`\`json
{
  "type": "hot_spot",
  "content": {
    "metadata": { ... },
    "patient": { ... },
    "vitals": [ ... ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "hot_spot",
      "prompt": "Click the location...",
      "imageUrl": "URL",
      "imageGenerationPrompt": "Description...",
      "targetArea": { "x": 50, "y": 50, "radius": 10 }
    }
  }
}
\`\`\`
`;


export const PROMPT_MAP: Record<string, string> = {
  // Long IDs (Legacy/Service)
  'case-study-6-screen': PROMPT_CASE_STUDY,
  'bowtie-standalone': PROMPT_BOW_TIE,
  'trend-standalone': PROMPT_TREND,
  'cloze-dropdown': PROMPT_DROP_CLOZE,
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
  'cloze': PROMPT_DROP_CLOZE,
  'matrix-multiple-response': PROMPT_MATRIX,
  'drag-drop-ordered': PROMPT_ORDERED_RESPONSE,
  'dosage': PROMPT_CALCULATION
};
