# NGN Standalone Trend Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Standalone Trend** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Recall / Basic)**: Knowledge Retrieval. Low Risk.
- **Level 2 (Application)**: Apply Rule/Process. Low-Moderate Risk.
- **Level 3 (Analysis / NGN Std)**: Connect Cues (Trends). Moderate Risk.
- **Level 4 (Synthesis)**: Prioritize & Plan. High Risk.
- **Level 5 (Evaluation / Expert)**: Managing Complexity. Critical Risk.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Trend Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic (e.g., Sepsis trend, Neuro checks, Labor progression).
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The trend data must logically lead to the correct answer.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Vitals**: Show at least 2-3 time points to establish trend
- **Word Count**: Narrative 60-120 words; Stem 15-25 words.
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use initials format: 2 letters + 3 numbers + .RN (e.g. JK492.RN).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology & Orders**: Format with Date/Time first (e.g. "10/24 0800").

## 🔑 3. STRUCTURE REQUIREMENTS
| Field | Description |
|-------|-------------|
| `trendData.timePoints` | Array of `{id, timeLabel}` objects |
| `trendData.parameters` | Array of `{name, values[]}` - values align with timePoints |
| `questionFormat` | `"single"` (1 correct) or `"sata"` (multiple correct) |
| `options` | Each with `id`, `text`, `isCorrect`, `rationale` |

## 🏥 3a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.

## ⚕️ 3b. CLINICAL DATA GOLD STANDARD (MANDATORY)
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
  "coreConcept": "The central medical topic (e.g., 'Increased Intracranial Pressure')",
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
*   **Base Score**: 50 pts (Trend)
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
  "recommendedActions": ["Isolate the trend...", "Review key vital sign shifts..."]
}
```

## 5. METADATA REQUIREMENTS
**CRITICAL:** You MUST classify the generated question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Reduction of Risk Potential",
  "cjmmStep": "Analyze Cues",
  "difficulty": "Hard",
  "topic": "Pediatrics / Respiratory",
  "peerAverageTime": "90",
  "peerSuccessRate": "55"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Does `trendData` have at least 2 `timePoints` showing a clear trend?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Analyze Cues"` for Trend items?
*If any check fails, regenerate immediately.*

## 6. Complete JSON Schema

```json
{
  "type": "trend",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" }
    },
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Reduction of Risk Potential",
      "cjmmStep": "Take Action",
      "difficulty": "Hard",
      "topic": "Pediatrics / Respiratory",
      "peerAverageTime": "90"
    },
    "rationale": {
      "coreConcept": "Increased Intracranial Pressure (ICP)",
      "caseSummary": "Think of the brain like a pressure cooker: as pressure builds, vital signs shift to force blood into the skull. This trend (Rising BP, Widening Pulse Pressure, Bradycardia) is Cushing's Triad—a late sign of herniation.",
      "answerAnalysis": "The priority is to recognize the trend of decompensation. Widening pulse pressure (Systolic goes up, Diastolic stays/drops) indicates the brain is fighting for perfusion. The HR drops (Bradycardia) as a reflex. Acting on this immediately is critical to prevent herniation.",
      "trap": "The 'Treat the Number' Trap: Do NOT give Atropine for this bradycardia; it is a compensatory reflex, not a primary heat block.",
      "goldenRule": "Systolic UP + Heart Rate DOWN = Brain Herniation (Cushing's).",
      "steps": [
        { "tag": "Recognize", "description": "Identify the trend: SBP rising, HR falling." },
        { "tag": "Analyze", "description": "Link vital signs to Intracranial Pressure." },
        { "tag": "Take Action", "description": "Intervene to lower ICP (e.g., Mannitol, HOB 30°)." }
      ],
      "mnemonic": {
        "title": "Cushing's Triad",
        "content": "1. Hypertension (Widening Pulse Pressure), 2. Bradycardia, 3. Irregular Respirations",
        "explanation": "These 3 signs indicate impending brainstem herniation."
      },
      "cheatSheet": {
        "title": "ICP Management Pearls",
        "points": [
          "Head of Bed: 30 degrees (promote drainage)",
          "Neck: Neutral alignment (don't pinch veins)",
          "Meds: Mannitol or Hypertonic Saline"
        ]
      },
      "referenceInfo": {
        "anatomy": "The skull is a fixed box (Monro-Kellie Doctrine). If brain swelling increases, blood or CSF must leave, or pressure spikes.",
        "physiology": "Cushing's Reflex is the hypothalamus attempting to maintain Cerebral Perfusion Pressure (CPP) by raising Systemic MAP.",
        "pharm": "Mannitol is an osmotic diuretic that pulls fluid out of brain tissue into the vascular space."
      }
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Ba...In...", 
        "age": "2 months", 
        "sex": "Male", 
        "mrn": "123123123", 
        "codeStatus": "Full Code", 
        "allergies": "NKA", 
        "provider": "Dr. Peds", 
        "ward": "PICU", 
        "bed": "3" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 2mo infant with RSV bronchiolitis, increasing respiratory distress.<br><b>Objective:</b> Nasal flaring, subcostal retractions, SpO2 declining.<br><b>Actions:</b> High-flow nasal cannula initiated.<br><b>Response:</b> Minimal improvement.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>JK492.RN</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Difficulty breathing, poor feeding.<br><b>History of Present Illness:</b> 2mo male with 3-day history of cough, rhinorrhea. RSV positive.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>RSV: Respiratory Syncytial Virus</div>",
      "vitals": [
        { "time": "0800", "tempF": "100.4°F (38.0°C)", "hr": "160", "rr": "60", "bp": "N/A", "o2": "90% RA" },
        { "time": "1000", "tempF": "101.2°F (38.4°C)", "hr": "175", "rr": "70", "bp": "N/A", "o2": "86% 2L NC" },
        { "time": "1200", "tempF": "101.8°F (38.8°C)", "hr": "185", "rr": "75", "bp": "N/A", "o2": "82% HFNC" }
      ],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>WBC</td><td style='padding: 4px'>15.0</td><td style='padding: 4px'>5-19 k/cumm</td></tr><tr><td style='padding: 4px'>RSV PCR</td><td style='padding: 4px'><b>Positive</b></td><td style='padding: 4px'>Negative</td></tr></tbody></table>",
      "orders": "10/24 0755: 1. HFNC 8L/min\n10/24 0800: 2. Continuous SpO2 monitoring\n10/24 0805: 3. Respiratory therapy q4h\n10/24 0810: 4. NPO with IV fluids",
      "radiology": "<b>10/24 0745 - CXR:</b><br><div style='font-family:monospace'>Hyperinflation with perihilar infiltrates consistent with bronchiolitis.</div>"
    },
    "structure": {
      "type": "trend",
      "prompt": "Based on the vital sign trends, what is the nurse's priority intervention?",
      "trendData": {
        "timePoints": [
          { "id": "t1", "timeLabel": "0800" },
          { "id": "t2", "timeLabel": "1000" },
          { "id": "t3", "timeLabel": "1200" }
        ],
        "parameters": [
          { "name": "Temperature (°F)", "values": ["100.4", "101.2", "101.8"] },
          { "name": "Heart Rate", "values": ["160", "175", "185"] },
          { "name": "Respiratory Rate", "values": ["60", "70", "75"] },
          { "name": "SpO2 (%)", "values": ["90%", "86%", "82%"] }
        ]
      },
      "questionFormat": "single",
      "options": [
        { 
          "id": "o1", 
          "text": "Prepare for intubation and mechanical ventilation", 
          "isCorrect": true, 
          "rationale": "[Hook] Intervention in crashing patient. [Breakdown] Correct: SpO2 dropping despite max support = Failure. Intubation secures airway. [Trap] Delay trap. [Steps] 1. Note decline, 2. Determine non-invasive failure, 3. Intubate. [Future] Don't wait for arrest to intubate." 
        },
        { 
          "id": "o2", 
          "text": "Increase HFNC flow rate to 10L/min", 
          "isCorrect": false, 
          "rationale": "[Hook] Titration limits. [Breakdown] Incorrect: Patient has worsened on high flow already. [Trap] Comfort zone trap. [Steps] 1. Check response. [Future] Know when to stop titrating." 
        },
        { 
          "id": "o3", 
          "text": "Administer acetaminophen for fever", 
          "isCorrect": false, 
          "rationale": "[Hook] Symptom management. [Breakdown] Incorrect: Fever doesn't cause saturation of 82%. [Trap] Distractor trap. [Steps] 1. Prioritize ABCs. [Future] Airway > Fever." 
        },
        { 
          "id": "o4", 
          "text": "Encourage breastfeeding to maintain hydration", 
          "isCorrect": false, 
          "rationale": "[Hook] Safety. [Breakdown] Incorrect: RR 75 = Aspiration risk. [Trap] Nutrition trap. [Steps] 1. Check RR. [Future] NPO if RR > 60 in infants." 
        }
      ]
    }
  }
}
```
