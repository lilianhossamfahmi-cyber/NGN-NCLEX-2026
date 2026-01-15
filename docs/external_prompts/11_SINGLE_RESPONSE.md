
**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Single Response (Multiple Choice)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Recall / Basic)**: Knowledge Retrieval. Low Risk.
- **Level 2 (Application)**: Apply Rule/Process. Low-Moderate Risk.
- **Level 3 (Analysis / NGN Std)**: Connect Cues (Trends). Moderate Risk.
- **Level 4 (Synthesis)**: Prioritize & Plan. High Risk.
- **Level 5 (Evaluation / Expert)**: Managing Complexity. Critical Risk.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Single Response (Multiple Choice) NGN Item(s).
**CRITICAL REQUIREMENT:** These are **NOT** Case Studies. They are standalone, single-screen items.

**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
4. **CLINICAL CONSISTENCY:** The `clinicalData` (patient info, vitals, etc) MUST be relevant.
5. **RICH EHR DATA:** You MUST populate `history`, `vitals`, `labs`, and `orders` to match the scenario. Do NOT leave them empty.
6. Follow the strict schema below.
7. **SINGLE ANSWER ONLY**: EXACTLY ONE option must have `"isCorrect": true`. All others must be `false`.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 2. Content Guidelines
- **Options**: 4 options total.
- **Correct Answers**: EXACTLY ONE (1).
- **Difficulty**: Higher cognitive level (Analysis/Application).

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.

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
The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, the `rationale` MUST be a simple **STRING**.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Post-Op Complications')",
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
    "points": ["Point 1", "Point 2"]
  },
  "referenceInfo": {
    "anatomy": "Brief anatomical context...",
    "physiology": "Brief physiological mechanism...",
    "pharm": "Key pharmacological facts..."
  }
}
```

## 4. METADATA REQUIREMENTS (Perfect Fill)
**CRITICAL:** You MUST provide detailed metadata. The `cjmmStep` field MUST be set correctly.

```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Pharmacological Therapies",
  "cjmmStep": "Evaluate Outcomes",
  "difficulty": "Moderate",
  "topic": "Cardiology",
  "peerAverageTime": "45",
  "peerSuccessRate": "75"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Is there EXACTLY ONE option with `isCorrect: true`?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Evaluate Outcomes"` for Single Response items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema

```json
{
  "type": "multiple-choice", 
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" },
       "history": [
          { "time": "07:00", "note": "Client admitted to ED via ambulance...", "initial": "RN.J88" },
          { "time": "07:15", "note": "Vitals assessed. Client reports severe nausea.", "initial": "RN.J88" }
       ],
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
        "peerAverageTime": "60",
        "peerSuccessRate": "65"
    },
    "rationale": {
        "coreConcept": "Topic",
        "caseSummary": "Summary",
        "answerAnalysis": "Analysis",
        "trap": "Trap hint",
        "goldenRule": "Golden Rule",
        "steps": [],
        "mnemonic": {},
        "cheatSheet": {},
        "referenceInfo": {}
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
```
