**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Highlight Text** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Recall / Basic)**: Knowledge Retrieval. Low Risk.
- **Level 2 (Application)**: Apply Rule/Process. Low-Moderate Risk.
- **Level 3 (Analysis / NGN Std)**: Connect Cues (Trends). Moderate Risk.
- **Level 4 (Synthesis)**: Prioritize & Plan. High Risk.
- **Level 5 (Evaluation / Expert)**: Managing Complexity. Critical Risk.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Highlight Text NGN Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. Follow the strict schema below.

## 🏆 Gold Standard Content Constraints (MANDATORY)
1. **Stem Length**: Keep the prompting question concise (Under 20 words).
2. **Text Length**: The highlightable paragraph should be 50-80 words.
3. **Segmentation**: Ensure the text contains 4-8 distinct, highlightable phrases tagged with `<span id='hX'>`.
4. **Distractor Quality**: Wrong answers must be clinically plausible 'near-misses', not random irrelevant terms.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 2. Content Guidelines
- **Text**: A paragraph (50-100 words) with 4-8 selectable phrases.
- **Tokens**: Wrap selectable text in `<span id='hX'>...</span>`.
- **Correct**: Specify which IDs are correct.

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
**Clinical data MUST be consistent with the case** (e.g., sepsis = fever + tachycardia)

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the `rationale` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Sepsis')",
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
*   **Base Score**: 30 pts (Highlight)
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
**CRITICAL:** Classify the question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Physiological Adaptation",
  "cjmmStep": "Recognize Cues",
  "difficulty": "Hard",
  "topic": "Sepsis",
  "peerAverageTime": "45",
  "peerSuccessRate": "55"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Do correct answer IDs in `correct` array match `<span id>` values in `text`?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Recognize Cues"` for Highlight items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema Example

```json
{
  "type": "highlight",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" },
      "vitals": [{ "time": "0800", "tempF": "101.5", "hr": 110, "rr": 22, "bp": "80/50", "o2": "94%", "o2_device": "RA", "pain": "0/10" }],
      "labs": "...",
      "orders": "...",
      "history": "...",
      "nursesNotes": "..."
    },
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Physiological Adaptation",
      "cjmmStep": "Recognize Cues",
      "difficulty": "Hard",
      "topic": "Sepsis",
      "peerAverageTime": "45",
      "peerSuccessRate": "55"
    },
    "rationale": {
      "coreConcept": "Septic Shock",
      "caseSummary": "Sepsis is a fire spreading through the house (body). The low BP (80/50) means the water pressure is failing to reach the upper floors (brain/kidneys).",
      "answerAnalysis": "The priority finding is Hypotension (80/50). This indicates decompensation from sepsis into septic shock. Being 'alert and oriented' is good, but it can be misleadingly reassuring; the BP tells the real story of perfusion failure.",
      "trap": "The 'Patient Looks Good' Trap: Don't trust a patient's appearance more than their vital signs in sepsis. Young people compensate until they crash.",
      "goldenRule": "MAP < 65 = Perfusion Failure. Act fast.",
      "steps": [
        { "tag": "Recognize", "description": "Identify hypotension (BP < 90/60) as a sign of shock." },
        { "tag": "Analyze", "description": "Connect low BP to infection source (Sepsis)." },
        { "tag": "Take Action", "description": "Initiate 30ml/kg fluid bolus immediately." }
      ],
      "mnemonic": {
        "title": "SEPSIS",
        "content": "S-hivering, E-xtreme pain, P-ale/discolored skin, S-leepy/confused, I- feel like I might die, S-hort of breath",
        "explanation": "Key symptoms reported by patients."
      },
      "cheatSheet": {
        "title": "Sepsis Bundle (1 Hour)",
        "points": [
          "Measure Lactate",
          "Obtain Blood Cultures",
          "Administer Broad Spectrum Abx",
          "Fluid Bolus (30ml/kg) for hypotension"
        ]
      },
      "referenceInfo": {
        "anatomy": "Endothelial damage causes widespread leaking of capillaries (third-spacing).",
        "physiology": "Systemic vasodilation reduces systemic vascular resistance (SVR), leading to hypotension despite high cardiac output (early).",
        "pharm": "Norepinephrine (Levophed) is the first-line vasopressor if fluids fail to restore MAP > 65."
      },
      "difficulty": {
        "score": 60,
        "level": 3,
        "label": "High Difficulty",
        "subtext": "Requires identifying critical vital sign shifts amidst stable neuro findings.",
        "clinicalStrategy": "In sepsis, vital sign trends (hypotension) are more reliable indicators of early shock than level of consciousness.",
        "recommendedActions": ["Calculate MAP", "Review sepsis bundle timing"]
      }
    },

    "structure": {
      "type": "highlight",
      "prompt": "Highlight the findings requiring immediate follow-up.",
      "text": "The client has a <span id='h1'>BP of 80/50</span> and appears <span id='h2'>alert and oriented</span>.",
      "correct": ["h1"],
      "rationales": {
        "h1": "[Hook] The tank is empty. [Breakdown] Correct: Hypotension = malperfusion. [Trap] Dehydration minimization. [Steps] 1. Assess BP. 2. Fluids. [Future] Low BP is a late sign.",
        "h2": "[Hook] The brain is happy. [Breakdown] Incorrect: Alert means perfusion is okay for now. [Trap] Distractor. [Steps] 1. Assess Neuro. [Future] Confusion = Hypoxia."
      }
    }
  }
}
```
