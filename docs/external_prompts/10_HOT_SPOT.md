# NGN Standalone Hot Spot Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **IMAGE STRATEGY (DUAL PATH)**:
    - **PATH A (Search)**: Search for a public domain medical image (Wikimedia/Gray's Anatomy). Use strict `.jpg` or `.png` URLs.
    - **PATH B (Generate)**: Always provide a detailed `imageGenPrompt` field describing exactly what the image should look like (for DALL-E/Midjourney).
2. **RAW JSON ONLY**: Output *only* the code block.
3. **NO CITATION LINKS**: Do not insert markdown links like `[1]` in values.

---

Generate **[QUANTITY]** **Standalone Hot Spot** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Medical Illustrator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Hot Spot Item(s) with robust image sourcing.
**CONSTRAINTS:**
1. **CLINICAL CONSISTENCY:** The "Left Side" `clinicalData` MUST be relevant to the `question`. Additionally, the `imageGenPrompt` MUST align perfectly with these details. If the patient has "Right Lower Lobe Pneumonia", the image prompt MUST request a "Chest X-ray with Right Lower Lobe opacity".
2. **Image Validation**: If you find a URL, ensure it is likely stable (e.g. upload.wikimedia.org).
3. **Generator Prompt**: You MUST write a high-fidelity image generation prompt (e.g. "Medical vector illustration of...").
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item.
2.  **Double Quotes Only**: All JSON keys and string values use `"`.
3.  **No Markdown**: Do NOT wrap output in ` ```json `.

## 📄 2. Content Guidelines
- **imageUrl**: 
    - *Best*: Real URL (Wikimedia).
    - *Fallback*: `https://placehold.co/600x600?text=Upload+Medical+Image`.
- **imageGenPrompt**: A specific description for finding/generating the image. **CRITICAL:** This must match the clinical scenario. 
    - *Example (Condition)*: "Anterior view of the heart showing coronary arteries" (if case is MI).
    - *Example (Location)*: "Posterior thoracic wall surface anatomy" (if case is CVA tenderness).
- **Target Area**: Define the correct area (x, y, radius) in percentages.

## 🏥 2a. Clinical Logic Rules (CRITICAL)
1. **Zero Hallucination Policy**: All clinical data, symptoms, and associations MUST be medically accurate. (e.g. Do NOT list 'Hyperglycemia' as a symptom of 'Hyponatremia').
2. **Plausible Distractors**: Distractors must be realistic "near-miss" options relevant to the context. Do NOT use random medical terms that visually fit but have no clinical relation.
3. **Logical Consistency**: The correct answer must be indisputably correct based on the provided Case/EHR data.
4. **Specific for Cloze/Dropdowns**: The options in a dropdown must be logically grouped (e.g. all are potential diagnoses, or all are potential drugs). Do not mix categories.

## ⚕️ 2b. CLINICAL DATA GOLD STANDARD (MANDATORY)
**All vitals MUST include 7 fields:** `time`, `tempF`, `hr`, `rr`, `bp`, `o2`, `o2_device`, `pain`
**All labs MUST include:** `test`, `value`, `ref`, and `flag` (H/L/H!/L!) for abnormal values
**Nurses notes MUST use SBAR format** with initials like "JD123.RN"
**Clinical data MUST be consistent with the case**

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY ULTIMATE OBJECT STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. The **MAIN Screen-Level** `rationale` field MUST be a JSON OBJECT (not a string) containing the fields below.
**IMPORTANT**: For individual **options**, **rows**, or **highlight items**, the `rationale` MUST be a simple **STRING** (e.g., "[Hook] ... [Breakdown] ..."). DO NOT generate full objects for inner items.

```json
"rationale": {
  "coreConcept": "The central medical topic (e.g., 'Anatomical Landmarks')",
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
*   **Base Score**: 20 pts (Hot Spot)
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
**CRITICAL:** You MUST classify the generated question accurately. The `cjmmStep` field MUST be set correctly.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Reduction of Risk Potential",
  "cjmmStep": "Recognize Cues",
  "difficulty": "Medium",
  "topic": "Cardiology / Assessment",
  "peerAverageTime": "60"
}
```

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Logic Check**: Do `hotspots` have valid `x`, `y` coordinates and matching `correctIds` in `structure`?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Recognize Cues"` for Hot Spot items?
*If any check fails, regenerate immediately.*

## 5. Complete JSON Schema

```json
{
  "type": "hot-spot",
  "content": {
    "clinicalData": {
      "patientInfo": { "name": "G. Rivera", "age": 62, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "302", "allergies": "NKDA", "isolation": "None" }
    },
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Reduction of Risk Potential",
      "cjmmStep": "Recognize Cues",
      "difficulty": "Medium",
      "topic": "Cardiology / Assessment",
      "peerAverageTime": "60"
    },
    "rationale": {
      "coreConcept": "Point of Maximum Impulse (PMI)",
      "caseSummary": "X Marks the Spot. The PMI (or Apical Pulse) tells you purely about the Left Ventricle's function and size. Finding it is a key nursing skill.",
      "answerAnalysis": "The Point of Maximum Impulse is found at the intersection of the 5th Intercostal Space (ICS) and the Mid-Clavicular Line (MCL) on the patient's LEFT side. This anatomical position corresponds to the apex of the heart swinging forward during systole against the chest wall.",
      "trap": "The 'Mirror Image' Trap: Remember, it is the PATIENT'S left, which is on your right when facing them. Don't select the right chest!",
      "goldenRule": "PMI = 5th ICS at MCL (Apical Pulse).",
      "steps": [
        { "tag": "Locate", "description": "Find the Angle of Louis (Manubriosternal junction)." },
        { "tag": "Count", "description": "Slide down to the 2nd rib, then count down the intercostal spaces to the 5th." },
        { "tag": "Slide", "description": "Move laterally to the mid-clavicular line." }
      ],
      "mnemonic": {
        "title": "APE TO MAN",
        "content": "A-ortic, P-ulmonic, E-rb's Point, T-ricuspid, M-itral (Apical/PMI)",
        "explanation": "Order of heart valve auscultation."
      },
      "cheatSheet": {
        "title": "Cardiac Auscultation",
        "points": [
          "Aortic: 2nd ICS, Right Sternal Border",
          "Pulmonic: 2nd ICS, Left Sternal Border",
          "Tricuspid: 4th ICS, Left Sternal Border",
          "Mitral (PMI): 5th ICS, Mid-Clavicular Line"
        ]
      },
      "referenceInfo": {
        "anatomy": "The apex of the heart is formed by the left ventricle.",
        "physiology": "The PMI may be displaced laterally in cases of Left Ventricular Hypertrophy (LVH) or Cardiomegaly.",
        "pharm": "Digoxin requires an Apical Pulse check for a full 60 seconds prior to administration."
      }
    },
    "clinicalData": {
      "patientInfo": { 
        "name": "Jo...Sm...", 
        "age": "55", 
        "sex": "Male", 
        "mrn": "99228833", 
        "codeStatus": "Full Code", 
        "allergies": "Sulfa", 
        "provider": "Dr. Cardio", 
        "ward": "Tele" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Assessment required.<br><b>Objective:</b> Irregular heart rate.<br><b>Actions:</b> Auscultation planned.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.X99</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Palpitations.<br><b>History of Present Illness:</b> 55yo male with history of AFib.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>PMI: Point of Maximum Impulse</div>",
      "vitals": [{ "time": "0800", "tempF": "98.6°F (37.0°C)", "hr": "112", "rr": "18", "bp": "128/78", "o2": "96%" }],
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Mild cardiomegaly.</div>"
    },
    "structure": {
      "type": "hot-spot",
      "prompt": "Click the area on the chest wall where the nurse would best assess the Point of Maximum Impulse (PMI).",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Surface_anatomy_of_the_heart_and_great_vessels.png",
      "imageGenPrompt": "Professional medical vector illustration of the anterior male chest wall, showing the outline of the rib cage, clavicles, and sternum. Clean white background, minimalist educational style. No labels.",
      "areas": [
        {
          "id": "area1",
          "x": 55,
          "y": 60,
          "radius": 8,
          "isCorrect": true,
          "rationale": "[Hook] Anatomical Landmark. [Breakdown] Correct: The apex of the heart touches the chest wall here. [Trap] Right-sided trap (apex is on the left). [Steps] 1. Identify left side. 2. Identify 5th ICS. [Future] Mitral valve is also heard here."
        }
      ]
    }
  }
}
```
