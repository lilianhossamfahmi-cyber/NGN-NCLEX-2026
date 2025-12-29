**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Ordered Response** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Ordered Response NGN Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 2. Content Guidelines
- **Goal**: Sequence steps for a procedure or priority action.
- **Options**: 4-6 steps.
- **Order**: Ensure one logical, correct order exists.

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
  "coreConcept": "The central medical topic (e.g., 'Sterile Technique')",
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
*   **Base Score**: 40 pts (Ordered Response)
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
*   "Identify the First and Last steps first to anchor your sequence, then fill in the middle."

**REQUIRED JSON FIELD (inside `rationale`):**
```json
"difficulty": {
  "score": 0,
  "level": 1,
  "label": "String",
  "subtext": "String",
  "clinicalStrategy": "String",
  "recommendedActions": ["Identify First/Last steps...", "Anchor the sequence..."]
}
```

## 4. METADATA REQUIREMENTS
**CRITICAL:** Classify the question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Safe and Effective Care Environment",
  "clientNeedsSub": "Safety and Infection Control",
  "cjmmStep": "Prioritize Hypotheses",
  "difficulty": "Moderate",
  "topic": "Procedures",
  "peerAverageTime": "60"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Does `orderedOptions` contain items in the CORRECT priority order?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Prioritize Hypotheses"` for Ordered Response items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema Example

```json
{
  "type": "ordered-response",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" }
    },
    "metadata": {
      "clientNeeds": "Safe and Effective Care Environment",
      "clientNeedsSub": "Safety and Infection Control",
      "cjmmStep": "Take Action",
      "difficulty": "Moderate",
      "topic": "Procedures",
      "peerAverageTime": "60"
    },
    "rationale": {
      "coreConcept": "Indwelling Catheter Insertion",
      "caseSummary": "Catheters are a highway for bacteria. The priority is maintaining a sterile chain of command. If you break sterility, you buy the patient a UTI.",
      "answerAnalysis": "Hand hygiene is always first to reduce bioburden (Step 1). The sterile kit must be opened to create the field (Step 2) BEFORE putting on sterile gloves (Step 3). Once gloved, you can touch the sterile supplies to lubricate the tip (Step 4). Doing these out of order contaminates the field.",
      "trap": "The 'Gloves First' Trap: You cannot open the outer wrapper of the kit with sterile gloves on—it is not sterile! You must open it with clean hands first.",
      "goldenRule": "Sterile touches Sterile; Clean touches Clean. Never cross the lines.",
      "steps": [
        { "tag": "Clean", "description": "Perform hand hygiene and position trash can." },
        { "tag": "Open", "description": "Open sterile kit (away, sides, toward) to create field." },
        { "tag": "Glove", "description": "Don sterile gloves without contaminating outer surfaces." }
      ],
      "mnemonic": {
        "title": "Opening Sterile Packages",
        "content": "Away, Side, Side, Toward",
        "explanation": "Open the first flap away from you to avoid reaching over the sterile field later."
      },
      "cheatSheet": {
        "title": "Foley Insertion Steps",
        "points": [
          "Verify Order & Allergies (Latex/Iodine)",
          "Perineal Care (Clean hands)",
          "Sterile Setup (Sterile hands)",
          "Insertion -> Inflate Balloon -> Secure"
        ]
      },
      "referenceInfo": {
        "anatomy": "The male urethra is ~20cm (needs more lube); female urethra is ~4cm (higher contamination risk).",
        "physiology": "The bladder is a sterile cavity. Introducing bacteria leads to CAUTI (Catheter Associated Urinary Tract Infection).",
        "pharm": "Lidocaine jelly is often used for male catheterization to reduce pain and spasm."
      }
    },
    "clinicalData": {
      "patientInfo": { "name": "Ge...Lu...", "age": "80", "sex": "Male" },
      "history": "...",
      "vitals": [],
      "labs": ""
    },
    "structure": {
      "type": "ordered-response",
      "prompt": "Drag the steps into order.",
      "orderedOptions": [
        {"id":"s1", "text":"Hand Hygiene", "rationale":"[Hook] Clean hands first. [Breakdown] Reduce bioburden before touching supplies. [Trap] Touching kit first. [Steps] 1. Wash. 2. Touch. [Future] Foam in, foam out."},
        {"id":"s2", "text":"Open Kit", "rationale":"[Hook] Create the sterile field. [Breakdown] Must be done before gloving. [Trap] Opening with gloves on. [Steps] 1. Open flap away. 2. Open sides. 3. Open towards. [Future] Don't reach over."},
        {"id":"s3", "text":"Don Sterile Gloves", "rationale":"[Hook] Sterile hands. [Breakdown] Now you can touch sterile items. [Trap] Gloving before opening. [Steps] 1. Dominant hand. 2. Non-dominant. [Future] Sterile touches sterile."},
        {"id":"s4", "text":"Lubricate Tip", "rationale":"[Hook] Comfort and ease. [Breakdown] Prevents trauma. [Trap] Dry insertion. [Steps] 1. Lube. 2. Insert. [Future] Trauma causes strictures."}
      ]
    }
  }
}
```
