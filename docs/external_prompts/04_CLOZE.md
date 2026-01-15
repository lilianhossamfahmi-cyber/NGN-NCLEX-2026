**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Cloze (Dropdown)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Recall / Basic)**: Knowledge Retrieval. Low Risk.
- **Level 2 (Application)**: Apply Rule/Process. Low-Moderate Risk.
- **Level 3 (Analysis / NGN Std)**: Connect Cues (Trends). Moderate Risk.
- **Level 4 (Synthesis)**: Prioritize & Plan. High Risk.
- **Level 5 (Evaluation / Expert)**: Managing Complexity. Critical Risk.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Cloze (Dropdown) NGN Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. Follow the strict schema below.
4. **CRITICAL - NOT A CASE STUDY:** Cloze items are STANDALONE, single-screen items. Do NOT include a `"screens"` array. All sentences/dropdowns MUST be inside `content.structure.sentences`.

## 🏆 Gold Standard Content Constraints (MANDATORY)
1. **Option Count**: Each dropdown must have between **3 and 5 options**. Fewer is too easy; more is overwhelming.
2. **Homogeneity**: Options within a single dropdown must be of the same category (e.g., all beta-blockers, or all respiratory diagnoses). Do not mix unrelated terms.
3. **Sentence Flow**: The sentence must read naturally when the correct option is inserted.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 2. Content Guidelines
- **Structure**: 1 or 2 Sentences with 1-3 Dropdowns total.
- **Dropdowns**: Each should have 2-4 options.
- **Context**: Ensure the sentence makes grammatical sense when options are inserted.

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.

## ⚕️ 2b. CLINICAL DATA GOLD STANDARD (MANDATORY)
### Vital Signs (COMPLETE SET):
```json
"vitals": [{ "time": "0800", "tempF": "99.1", "hr": 88, "rr": 16, "bp": "120/80", "o2": "98%", "o2_device": "RA", "pain": 2 }]
```
### Laboratory Results:
```json
"labs": [{ "test": "Sodium", "value": "138", "ref": "135-145", "flag": "" }]
```
### Medication Orders:
```json
"orders": [{ "drug": "Lisinopril", "dose": "10 mg", "route": "PO", "freq": "Daily", "status": "active", "indication": "HTN", "holdReason": "Hold for SBP < 100" }]
```
### Nurses Notes (SBAR):
```json
"history": [{ "time": "0800", "note": "S: Situation... B: Background... A: Assessment... R: Recommendation...", "initial": "XX000.RN" }]
```
- **Requirements**: Full 7-field Vitals, Indication/HoldReason for Orders, H/L/H! Flags for Labs.
- **Radiology**: If relevant, use standard format.

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the `rationale` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Hypoglycemia')",
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

**CRITICAL INSTRUCTION**: You must generate *rich, detailed content* for the Mnemonic, Cheat Sheet, and Reference Info sections.
**ABSOLUTE REQUIREMENT**: This content MUST be **100% RELEVANT** to the generated Clinical Focus (`[FOCUS]`) and Scenario.
- ❌ Do NOT use generic examples (e.g. COPD, Diabetes) unless the item is specifically about them.

## 🧪 4. DIFFICULTY SCORING & STRATEGY ENGINE (CRITICAL)
**Objective:** Calculate a **Difficulty Score (0–100)** and generate **Recommended Actions**.

**A. SCORING ALGORITHM:**
`totalScore = BaseScore + Structural + ClinicalModifier`
*   **Base Score**: 20 pts (Cloze/Dropdown)
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

**C. LEVEL OVERRIDE (MANDATORY):**
*   **IF a specific [LEVEL] is requested in the prompt**: You MUST ensure the final `totalScore` falls within that Level's range.
*   **Action**: If the calculated score is too low, add a `Complexity Bonus` to the score to force it into the correct bracket.
*   **Example**: If User asks for Level 5, but score is 60, add `+25 "Clinical Complexity Bonus"` to reach 85.

**D. CLINICAL STRATEGY (Replaces Golden Rule):**
*   **L1-3**: "Key Concept: In [Focus], [Key Cue] indicates [Condition]."
*   **L4-5**: "Strategic Pivot: When [Cue A] conflicts with [Cue B], prioritize [Safety Action]."

**D. RECOMMENDED ACTIONS:**
*   "Drill Cue Recognition: Re-scan the stem and identify the data points that triggered the need for action."

**REQUIRED JSON FIELD (inside `rationale`):**
```json
"difficulty": {
  "score": 0,
  "level": 1,
  "label": "String",
  "subtext": "String",
  "clinicalStrategy": "String",
  "recommendedActions": ["Re-scan stem for cues...", "Identify trigger data..."]
}
```

## 4. METADATA REQUIREMENTS
**CRITICAL:** You MUST classify the generated question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Pharmacological Therapies",
  "cjmmStep": "Generate Solutions",
  "difficulty": "Moderate",
  "topic": "Diabetes",
  "peerAverageTime": "60"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Does each dropdown have exactly ONE correct option (`isCorrect: true` or `correctOptionId`)?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Generate Solutions"` for Cloze items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema Example

```json
{
  "type": "cloze",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" },
      "vitals": "...",
      "labs": "...",
      "history": "..."
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
      "coreConcept": "Severe Hypoglycemia",
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
      "type": "cloze",
      "prompt": "Complete the sentence.",
      "sentences": [
        {
          "text": "The nurse should immediately administer %intervention% to address the client's %condition%.",
          "dropdowns": [
             { 
               "id": "intervention", 
               "options": [
                 {"id":"o1", "text":"IV Dextrose 50%", "isCorrect":true, "rationale":"..."},
                 {"id":"o2", "text":"Humalog Insulin", "isCorrect":false, "rationale":"..."} 
               ],
               "correctOptionId": "o1"
             },
             { 
               "id": "condition", 
               "options": [
                 {"id":"o3", "text":"Hypoglycemia", "isCorrect":true, "rationale":"..."},
                 {"id":"o4", "text":"Hyperglycemia", "isCorrect":false, "rationale":"..."} 
               ],
               "correctOptionId": "o3"
             }
          ]
        }
      ]
    }
  }
}
```
