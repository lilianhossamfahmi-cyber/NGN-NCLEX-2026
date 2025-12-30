# NGN Standalone Bow-Tie Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Standalone Bow-Tie** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Bow-Tie Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic/system (e.g., Shock, COPD, Stroke).
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The patient's history/vitals must support the correct answer options.
4. Follow the strict schema below.
5. **RANDOMIZE ORDER:** Randomize the order of objects in the `actions` (5 items), `conditions` (4 items), and `parameters` (5 items) lists. Do NOT group correct answers together.

## 🏆 Gold Standard Content Constraints (MANDATORY)
1. **Logic Balance**: Ensure exactly **2 Actions** (Correct), **1 Condition** (Correct), and **2 Parameters** (Correct) are set in the logic.
2. **Pool Size**: You MUST provide exactly **5 Action choices**, **4 Condition choices**, and **5 Parameter choices** total in the respective arrays.
3. **Distractor Quality**: Wrong types must be clinically relevant 'near-misses' (e.g., related conditions or contraindicated meds), NOT random fillers.

## 📊 3. Metadata Gold Standards (MANDATORY)
Every Item MUST include these fields for the Expert Dashboard:
1. **clientNeeds**: Must be one of the 8 NCLEX Categories.
2. **cjmmStep**: Choose the DOMINANT step (e.g., "Prioritize Hypotheses" if focusing on the Condition, or "Take Action" if focusing on Interventions).
3. **scoringRule**: Must be "0/1" (technically Bow-Tie is 0/1 per match, but just label it "0/1" or "BowTie").
4. **difficulty**: "Easy", "Medium", or "Hard".

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings, not literal line breaks.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Word Count**: Scenario 80-150 words; Options 5-20 words each.
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.

## ⚕️ 2b. CLINICAL DATA GOLD STANDARD (MANDATORY)
**All vitals MUST include 7 fields:** `time`, `tempF`, `hr`, `rr`, `bp`, `o2`, `o2_device`, `pain`
**All labs MUST include:** `test`, `value`, `ref`, and `flag` (H/L/H!/L!) for abnormal values
**All orders MUST include:** `drug`, `dose`, `route`, `freq`, `status`, `indication`
**Nurses notes MUST use SBAR format** with initials like "JD123.RN"
**Radiology only if relevant** - DO NOT generate placeholder impressions

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Category | Count | Correct | Distractors |
|----------|-------|---------|-------------|
| **Actions** | 5 options | 2 correct | 3 incorrect |
| **Conditions** | 4 options | 1 correct | 3 incorrect |
| **Parameters** | 5 options | 2 correct | 3 incorrect |

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the `rationale` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Diabetic Ketoacidosis')",
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
*   **Base Score**: 50 pts (Bow-Tie)
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
*   "Isolate the center Condition first. If Actions were missed, review contraindications for [Condition]."

**REQUIRED JSON FIELD (inside `rationale`):**
```json
"difficulty": {
  "score": 0,
  "level": 1,
  "label": "String",
  "subtext": "String",
  "clinicalStrategy": "String",
  "recommendedActions": ["Isolate the center Condition...", "Review contraindications..."]
}
```

## 5. METADATA REQUIREMENTS
**CRITICAL:** You MUST classify the generated question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Pharmacological and Parenteral Therapies",
  "cjmmStep": "Generate Solutions",
  "difficulty": "Hard",
  "topic": "Neurology / Stroke",
  "peerAverageTime": "90"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Are there exactly 2 correct Actions, 1 correct Condition, and 2 correct Parameters?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Generate Solutions"` for Bow-Tie items?
*If any check fails, regenerate immediately.*

## 6. Complete JSON Schema

```json
{
  "type": "bow-tie",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" },
      "history": "...",
      "vitals": "...",
      "labs": "...",
      "orders": "...",
      "radiology": "..."
    },
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Pharmacological and Parenteral Therapies",
      "cjmmStep": "Generate Solutions",
      "difficulty": "Hard",
      "topic": "Neurology / Stroke",
      "peerAverageTime": "90"
    },
    "rationale": {
       "coreConcept": "Subarachnoid Hemorrhage (SAH)",
       "caseSummary": "...",
       "answerAnalysis": "...",
       "trap": "...",
       "goldenRule": "...",
       "steps": [],
       "mnemonic": {},
       "cheatSheet": {},
       "referenceInfo": {}
    },
    "structure": {
      "type": "bow-tie",
      "prompt": "The patient presents with sudden severe headache and BP 220/120. Select 2 priority actions, the most likely condition, and 2 parameters to monitor for improvement.",
      "actions": [
        { "id": "a1", "text": "Administer IV labetalol", "isCorrect": true, "rationale": "..." },
        { "id": "a2", "text": "Prepare for emergent CT", "isCorrect": true, "rationale": "..." },
        { "id": "a3", "text": "Administer tPA bolus", "isCorrect": false, "rationale": "..." },
        { "id": "a4", "text": "Encourage oral hydration", "isCorrect": false, "rationale": "..." },
        { "id": "a5", "text": "Perform lumbar puncture", "isCorrect": false, "rationale": "..." }
      ],
      "conditions": [
        { "id": "c1", "text": "Subarachnoid hemorrhage", "isCorrect": true, "rationale": "..." },
        { "id": "c2", "text": "Migraine headache", "isCorrect": false, "rationale": "..." },
        { "id": "c3", "text": "Tension headache", "isCorrect": false, "rationale": "..." },
        { "id": "c4", "text": "Sinusitis", "isCorrect": false, "rationale": "..." }
      ],
      "parameters": [
        { "id": "p1", "text": "Blood pressure decreases to <180 systolic", "isCorrect": true, "rationale": "..." },
        { "id": "p2", "text": "GCS remains stable or improves", "isCorrect": true, "rationale": "..." },
        { "id": "p3", "text": "Patient reports improved appetite", "isCorrect": false, "rationale": "..." },
        { "id": "p4", "text": "Urine output >30mL/hr", "isCorrect": false, "rationale": "..." },
        { "id": "p5", "text": "Patient ambulates independently", "isCorrect": false, "rationale": "..." }
      ]
    }
  }
}
```
