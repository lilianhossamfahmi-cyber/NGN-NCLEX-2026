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
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" }
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
      "caseSummary": "Think of a Subarachnoid Hemorrhage like a balloon popping in the brain—pressure spikes instantly. This patient presents with a classic 'thunderclap' headache and severe hypertension.",
      "answerAnalysis": "The primary goals in SAH are to prevent rebleeding and manage intracranial pressure. Rapid blood pressure control (e.g., with labetalol) reduces the risk of rebleeding. Emergent CT is crucial to confirm the diagnosis and differentiate from ischemic stroke, guiding further management. Anticoagulants like tPA are contraindicated and would worsen a bleed.",
      "trap": "The 'Stroke Protocol' Trap: Don't give tPA until you rule out a bleed! Always confirm the type of stroke with imaging before administering thrombolytics.",
      "goldenRule": "Worst headache of life = Bleed until proven otherwise. Always prioritize imaging.",
      "steps": [
        { "tag": "Recognize", "description": "Identify sudden, severe 'thunderclap' headache and neurological changes." },
        { "tag": "Scan", "description": "Perform emergent CT scan to confirm or rule out hemorrhage." },
        { "tag": "Control", "description": "Aggressively manage blood pressure to prevent rebleeding and reduce ICP." }
      ],
      "mnemonic": {
        "title": "SAH Symptoms (SUDDEN)",
        "content": "S-evere headache, U-nconsciousness, D-iplopia, D-izziness, E-mesis, N-uchal rigidity",
        "explanation": "These are common signs and symptoms of a subarachnoid hemorrhage, often presenting suddenly."
      },
      "cheatSheet": {
        "title": "SAH Management Essentials",
        "points": [
          "BP Control: Target SBP <160-180 mmHg (e.g., Labetalol, Nicardipine)",
          "Nimodipine: Prevents vasospasm (oral or NGT)",
          "Monitor for Hydrocephalus: External ventricular drain (EVD) if needed",
          "Seizure Prophylaxis: Consider for high-risk patients"
        ]
      },
      "referenceInfo": {
        "anatomy": "SAH involves bleeding into the subarachnoid space, the area between the arachnoid membrane and the pia mater surrounding the brain.",
        "physiology": "Aneurysm rupture is the most common cause, leading to sudden increase in intracranial pressure and irritation of meninges. Blood in the subarachnoid space can lead to vasospasm.",
        "pharm": "Labetalol is a beta-blocker with alpha-blocking properties, effective for rapid BP reduction. Nimodipine is a calcium channel blocker specifically used to prevent cerebral vasospasm in SAH."
      }
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Jo...Sm...", 
        "age": "55", 
        "sex": "Male", 
        "mrn": "555555555", 
        "codeStatus": "Full Code", 
        "allergies": "None", 
        "provider": "Dr. B", 
        "ward": "ED", 
        "bed": "1" 
      },
      "history": [
        { "time": "1200", "note": "Situation: 55yo male presents with sudden severe headache.\nObjective: BP 220/120, GCS 14, photophobia present.\nActions: IV access obtained, CT ordered.", "initial": "RN.B294" },
        { "time": "1215", "note": "Patient complains of nausea. 4mg Zofran IVP given.", "initial": "RN.B294" }
      ],
      "historyPhysical": "<b>Chief Complaint:</b> Worst headache of my life.<br><b>History of Present Illness:</b> Sudden onset 1 hour ago, associated with nausea and neck stiffness.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>BP: Blood Pressure<br>GCS: Glasgow Coma Scale</div>",
      "vitals": [{ "time": "1200", "tempF": "98.6°F (37.0°C)", "hr": "88", "rr": "18", "bp": "220/120", "o2": "98%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>WBC</td><td style='padding: 4px'>9.0</td><td style='padding: 4px'>4.5-11</td></tr><tr><td style='padding: 4px'>Glucose</td><td style='padding: 4px'><b>110</b></td><td style='padding: 4px'>70-100 mg/dL</td></tr></tbody></table>",
      "orders": "1. CT Head without contrast STAT\n2. CBC, BMP, Coags\n3. Maintain SBP <180",
      "radiology": "<b>CT Head:</b><br><div style='font-family:monospace'>Pending</div>"
    },
    "structure": {
      "type": "bow-tie",
      "prompt": "The patient presents with sudden severe headache and BP 220/120. Select 2 priority actions, the most likely condition, and 2 parameters to monitor for improvement.",
      "actions": [
        { 
          "id": "a1", 
          "text": "Administer IV labetalol", 
          "isCorrect": true, 
          "rationale": "[Hook] BP limits rebleeding risk. [Breakdown] Correct: Labetalol lowers BP acutely. [Trap] Caution trap: Don't lower BP too fast, but <180 is goal. [Steps] 1. Check BP, 2. Administer Antihypertensive. [Future] Prevent hematoma expansion." 
        },
        { 
          "id": "a2", 
          "text": "Prepare for emergent CT", 
          "isCorrect": true, 
          "rationale": "[Hook] Diagnostic Gold Standard. [Breakdown] Correct: CT differentiates bleed vs clot. [Trap] Procedure trap: Don't do LP first. [Steps] 1. Order CT, 2. Transport patient. [Future] Time is brain." 
        },
        { 
          "id": "a3", 
          "text": "Administer tPA bolus", 
          "isCorrect": false, 
          "rationale": "[Hook] Contraindications. [Breakdown] Incorrect: tPA is fatal in hemorrhagic stroke. [Trap] Ischemic bias trap. [Steps] 1. Rule out bleed. [Future] Never give tPA without CT."
        },
        { 
          "id": "a4", 
          "text": "Encourage oral hydration", 
          "isCorrect": false, 
          "rationale": "[Hook] Aspiration precautions. [Breakdown] Incorrect: Patient has altered status/nausea. [Trap] Basic care trap. [Steps] 1. Maintain NPO. [Future] Airway protection first." 
        },
        { 
          "id": "a5", 
          "text": "Perform lumbar puncture", 
          "isCorrect": false, 
          "rationale": "[Hook] Herniation risk. [Breakdown] Incorrect: LP checks for xanthochromia but CT is first. LP risks herniation if ICP high. [Trap] Sequencing trap. [Steps] 1. CT first, 2. LP only if CT negative. [Future] Safety first." 
        }
      ],
      "conditions": [
        { 
          "id": "c1", 
          "text": "Subarachnoid hemorrhage", 
          "isCorrect": true, 
          "rationale": "[Hook] Classic presentation. [Breakdown] Correct: 'Thunderclap' headache implies SAH. [Trap] None. [Steps] 1. Pattern recognition. [Future] Sudden onset = Vascular." 
        },
        { 
          "id": "c2", 
          "text": "Migraine headache", 
          "isCorrect": false, 
          "rationale": "[Hook] Headache types. [Breakdown] Incorrect: Migraine is usually gradual, unilateral. [Trap] Commonality trap. [Steps] 1. Assess onset speed. [Future] Migraine is a diagnosis of exclusion in ED." 
        },
        { 
          "id": "c3", 
          "text": "Tension headache", 
          "isCorrect": false, 
          "rationale": "[Hook] Severity assessment. [Breakdown] Incorrect: Tension is mild-moderate, band-like. [Trap] Minimization trap. [Steps] 1. Assess severity. [Future] Tension HA is rare cause of ED visit." 
        },
        { 
          "id": "c4", 
          "text": "Sinusitis", 
          "isCorrect": false, 
          "rationale": "[Hook] Infectious etiology. [Breakdown] Incorrect: No fever/discharge. [Trap] Facial pain trap. [Steps] 1. Check signs of infection. [Future] Sinusitis is localized." 
        }
      ],
      "parameters": [
        { 
          "id": "p1", 
          "text": "Blood pressure decreases to <180 systolic", 
          "isCorrect": true, 
          "rationale": "[Hook] Therapeutic goals. [Breakdown] Correct: Reduces rebleed risk. [Trap] None. [Steps] 1. Monitor BP. [Future] Strict parameters required." 
        },
        { 
          "id": "p2", 
          "text": "GCS remains stable or improves", 
          "isCorrect": true, 
          "rationale": "[Hook] Neuro monitoring. [Breakdown] Correct: Decline indicates ICP rise/rebleed. [Trap] None. [Steps] 1. Serial Neuro Checks. [Future] LOC is sensitive indicator." 
        },
        { 
          "id": "p3", 
          "text": "Patient reports improved appetite", 
          "isCorrect": false, 
          "rationale": "[Hook] Irrelevant outcome. [Breakdown] Incorrect: Not a priority in neuro emergency. [Trap] Wellness trap. [Steps] 1. Focus on critical systems. [Future] Appetite returns late." 
        },
        { 
          "id": "p4", 
          "text": "Urine output >30mL/hr", 
          "isCorrect": false, 
          "rationale": "[Hook] Kidney function. [Breakdown] Incorrect: Important generally, but neuro status is the specific SAH goal. [Trap] Standard care trap. [Steps] 1. Prioritize Brain. [Future] Brain > Kidney in SAH." 
        },
        { 
          "id": "p5", 
          "text": "Patient ambulates independently", 
          "isCorrect": false, 
          "rationale": "[Hook] Safety. [Breakdown] Incorrect: Bed rest required to prevent ICP spike. [Trap] Mobility trap. [Steps] 1. Maintain Bedrest. [Future] Minimize stimulation." 
        }
      ]
    }
  }
}
```
