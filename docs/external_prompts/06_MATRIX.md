**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Matrix** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Matrix NGN Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. Follow the strict schema below.
4. **CRITICAL - NOT A CASE STUDY:** Matrix items are STANDALONE, single-screen items. Do NOT include a `"screens"` array. All rows MUST be inside `content.structure.rows`. A Matrix item has ONE prompt and MULTIPLE rows.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 2. Content Guidelines
- **Columns**: 2 or 3 columns (e.g., "Effective", "Ineffective", "Unrelated").
- **Rows**: 4-6 rows of options.
- **Goal**: Evaluate interventions or assessments.

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the `rationale` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Disaster Triage')",
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
```

**CRITICAL INSTRUCTION**: You must generate *rich, detailed content* for the Mnemonic, Cheat Sheet, and Reference Info sections. These populate the "Strategy" and "Knowledge" tabs in the UI.

## 🧪 4. DIFFICULTY SCORING & STRATEGY ENGINE (CRITICAL)
**Objective:** Calculate a **Difficulty Score (0–100)** and generate **Recommended Actions**.

**A. SCORING ALGORITHM:**
`totalScore = BaseScore + Structural + ClinicalModifier`
*   **Base Score**: 40 pts (Matrix)
*   **Structural Modifiers**:
    *   +5 pts per Row/Step.
    *   +10 pts if Trend involves rate-of-change.
    *   +10 pts if Cloze blanks are dependent.
    *   +20 pts if Highlight distractors are plausible.
    *   +2 pts per Cue in Stem.
*   **Clinical Focus Modifier**:
    *   +8: Critical Care, Sepsis, Emergency.
    *   +6: Cardiac, Pharmacology.
    *   +4: Med-Surg, Neuro.
    *   +2: Peds, OB, Psych.

**B. LEVEL MAPPING:**
*   **0-20 (Level 1):** Recall ("Requires basic [cjmmStep].")
*   **21-40 (Level 2):** Single-Step ("Requires [cjmmStep] of isolated cues.")
*   **41-60 (Level 3):** Multi-Cue ("Requires linking [cueCount] data points.")
*   **61-80 (Level 4):** Prioritization ("Requires prioritizing conflicting cues.")
*   **81-100 (Level 5):** High-Stakes ("Requires critical safety/risk analysis.")

**C. CLINICAL STRATEGY (Replaces Golden Rule):**
*   **L1-3**: "Key Concept: In [Focus], [Key Cue] indicates [Condition]."
*   **L4-5**: "Strategic Pivot: When [Cue A] conflicts with [Cue B], prioritize [Safety Action]."

**D. RECOMMENDED ACTIONS:**
*   "Use Row-by-Row Verification: Evaluate each row as an independent True/False statement. Do not group them."

**REQUIRED JSON FIELD (inside `rationale`):**
```json
"difficulty": {
  "score": 0,
  "level": 1,
  "label": "String",
  "subtext": "String",
  "clinicalStrategy": "String",
  "recommendedActions": ["Use Row-by-Row Verification...", "Evaluate each row independently..."]
}
```

## 4. METADATA REQUIREMENTS
**CRITICAL:** Classify the question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Safe and Effective Care Environment",
  "clientNeedsSub": "Management of Care",
  "cjmmStep": "Analyze Cues",
  "difficulty": "Hard",
  "topic": "Ethics",
  "peerAverageTime": "60"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Does each row have exactly ONE `correctColumnId`?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Analyze Cues"` for Matrix items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema Example

```json
{
  "type": "matrix",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" }
    },
    "metadata": {
      "clientNeeds": "Safe and Effective Care Environment",
      "clientNeedsSub": "Management of Care",
      "cjmmStep": "Analyze Cues",
      "difficulty": "Hard",
      "topic": "Ethics / Disaster Triage",
      "peerAverageTime": "60"
    },
    "rationale": {
      "coreConcept": "START Triage Protocol",
      "caseSummary": "Triage is about 'The Greatest Good for the Greatest Number'. In a Mass Casualty Incident (MCI), resources are scarce. We prioritize salvageable life over tragic loss.",
      "answerAnalysis": "The Black Tag (Expectant) is reserved for those who are deceased or have injuries incompatible with life (like agonal breathing despite airway opening). The Red Tag (Immediate) is for life-threatening but treatable conditions (like arterial bleeding or tension pneumothorax). Confusing the two wastes critical minutes.",
      "trap": "The 'Hero' Trap: Trying to save everyone. In an MCI, stopping to do CPR on a pulseless victim means three others might die from untreated bleeding.",
      "goldenRule": "Do the most good for the most people. CPR is not performed in the field during MCI triage.",
      "steps": [
        { "tag": "Recognize", "description": "Assess RPM: Respirations, Perfusion, Mental Status." },
        { "tag": "Analyze", "description": "Categorize based on START criteria (Walking = Green, No Pulse/Resp = Black)." },
        { "tag": "Take Action", "description": "Tag and Move On immediately." }
      ],
      "mnemonic": {
        "title": "RPM (30-2-Can Do)",
        "content": "R-espirations (<30), P-erfusion (<2s cap refill), M-ental Status (Can Follow Commands)",
        "explanation": "If any are failed, the patient is RED (Immediate). If all passed, they are YELLOW (Delayed)."
      },
      "cheatSheet": {
        "title": "START Triage Categories",
        "points": [
          "Green (Minor): 'Walking Wounded'",
          "Yellow (Delayed): Can wait 1-2 hours",
          "Red (Immediate): Treatable life-threats",
          "Black (Expectant): Dead or unsalvageable"
        ]
      },
      "referenceInfo": {
        "anatomy": "Vital organs (Brain, Heart, Lungs) have limited ischemic time.",
        "physiology": "Shock progresses from compensated to decompensated rapidly; identifying early signs (Perfusion issues) saves lives.",
        "pharm": "Typically no meds are given during the initial Triage sort phase."
      }
    },
    "clinicalData": {
      "patientInfo": { "name": "Ma...Ca...", "age": "Unknown", "sex": "Unknown" },
      "history": "...",
      "vitals": [],
      "labs": ""
    },
    "structure": {
      "type": "matrix",
      "prompt": "For each client, determine the appropriate triage tag.",
      "columns": [{"id":"c1", "label":"Red Tag"}, {"id":"c2", "label":"Black Tag"}],
      "rows": [
         {"id":"r1", "text":"Agonal breathing after airway opening", "correctColumnId":"c2", "rationale":"[Hook] Not compatible with life. [Breakdown] Correct: Agonal = Death imminent. [Trap] Hero trap. [Steps] 1. Open Airway. 2. Still Apneic? 3. Black Tag. [Future] Save the salvageable."},
         {"id":"r2", "text":"Active arterial bleed from leg", "correctColumnId":"c1", "rationale":"[Hook] Minutes away from death. [Breakdown] Correct: Hemorrhage control saves lives. [Trap] Ignored bleed. [Steps] 1. Find Bleed. 2. Tourniquet. 3. Red Tag. [Future] Stop the bleed."}
      ]
    }
  }
}
```
