
**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Single Response (Multiple Choice)** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Single Response (Multiple Choice) NGN Item(s).
**CRITICAL REQUIREMENT:** These are **NOT** Case Studies. They are standalone, single-screen items.

**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
4. **CLINICAL CONSISTENCY:** The `clinicalData` (patient info, vitals, etc) MUST be relevant.
5. **RICH EHR DATA:** You MUST populate `history`, `vitals`, `labs`, and `orders` to match the scenario. Do NOT leave them empty.
    - **Nurses Notes (`history`)**: MUST use HTML `<p>` and `<ul>/<li>`.
    - **Labs (`labs`)**: MUST use HTML `<table>` with `<tr>`, `<th>`, and `<td>`. Bold abnormalities.
    - **H&P (`historyPhysical`)**: Must include HPI/PMH.
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
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate.
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context.
3. **Logical Consistency**: The correct answer must be indisputably correct.

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Is there EXACTLY ONE correct answer?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
*If any check fails, regenerate immediately.*

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string).
**IMPORTANT**: For individual **options**, the `rationale` MUST be a simple **STRING**.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Post-Op Complications')",
  "caseSummary": "A simplified, high-level summary of the case (The 'Hook'). Speak directly to the student.",
  "answerAnalysis": "Detailed, high-quality breakdown of why the correct answer is correct. MUST be at least 2 sentences. DO NOT leave empty.",
  "trap": "The specific mental trap or common error students make.",
  "goldenRule": "A memorable one-liner or rule of thumb (The clinical gem). MUST be a strong, actionable takeaway. DO NOT leave empty.",
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
**CRITICAL:** You MUST provided detailed metadata for the "Expert Analytics" dashboard.

```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Pharmacological Therapies",
  "cjmmStep": "Generate Solutions", // CRITICAL for CJ Judgment
  "difficulty": "Moderate",
  "topic": "Cardiology", // Specific topic (e.g., 'Sepsis', 'Pharmacology', 'Cardiology' affect difficulty score)
  "peerAverageTime": "45",
  "cueCount": 3, // Number of distinct cues the student must track (1-5)
  "timePressure": "medium", // 'low' (observation), 'medium' (standard), 'high' (emergency/code)
  "integrationLevel": "complex" // 'basic' (linear), 'complex' (competing cues/synthesis)
}
```

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
       "labs": "<table style='width:100%'><tr><td><strong>WBC</strong></td><td><strong>14.5 (High)</strong></td></tr><tr><td><strong>Hgb</strong></td><td>13.2</td></tr></table>",
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
        "cueCount": 3,
        "timePressure": "medium",
        "integrationLevel": "intermediate"
    },
    "rationale": {
        "coreConcept": "DKA Management",
        "caseSummary": "A 62-year-old male presents with classic signs of Diabetic Ketoacidosis requires immediate stabilization.",
        "answerAnalysis": "Fluid resuscitation is the absolute priority in DKA to restore perfusion and reduce counter-regulatory hormones. Insulin is secondary to fluids.",
        "trap": "Starting insulin before fluids, which can precipitate circulatory collapse.",
        "goldenRule": "Fluids before Flow (Insulin) in DKA management.",
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
