# NGN Item Generation Guide for External AI

This guide provides the prompts and JSON schemas required to generate NCLEX-NGN compatible items.

## 🛑 **JSON Integrity Protocol (Strict Rules)**
To ensure zero import errors, the AI **MUST** follow these grammar rules:
1.  **NO Trailing Commas**: Never leave a comma after the last item in an array `[]` or object `{}`.
2.  **HTML Escaping**: For HTML content inside JSON strings (like tables), use **single quotes** for attributes (e.g., `<table style='width:100%'>`) OR **escape double quotes** (e.g., `<table style=\"width:100%\">`).
3.  **Strict Double Quotes**: All property names and string values must use standard double quotes `"`. Do not use smart/curly quotes.
4.  **No Markdown**: Do not wrap the output in triple backticks (\`\`\`json). Output the raw JSON text only.
5.  **Control Characters**: Escape all newlines (`\n`) and tabs (`\t`) within string values.

> **CRITICAL:** All generated items must use the `content` wrapper structure.
> **PATIENT PRIVACY:** Generate patient names using the format: **First 2 letters + "..." + Last 2 letters + "..."** (e.g., "Jane Doe" -> "Ja...Do...").
> **WORD COUNT GUIDANCE:** Use lower end of ranges for lower difficulty; upper end only when necessary.
> **RATIONALE QUALITY:** All items MUST include high-quality, educator-level rationales.
> - **Correct Answers:** Explain the Pathophysiology and why it is the priority in THIS specific context.
> - **Incorrect Options:** Explicitly explain WHY they are incorrect (e.g., "Contraindicated because...", "Not the priority until A, B, C are done...").

---

### **Universal Rationale Schema (Rich Structured Feedback)**
For every item, you must populate these fields for deep educational value:
1.  **rationale (Global)**: Top-level text field in `content`. 2-4 sentences explaining the overall clinical concept, why the correct answers are correct, and the "big picture" takeaway.
2.  **teachingPoints**: Array of strings. 3-5 priority takeaways (e.g., "Always assess airway first.").
3.  **Complex Option Rationales**: Instead of a simple string, option `rationale` fields can be an object:
    ```json
    "rationale": {
       "quickReason": "Correct / Incorrect",
       "detailedReason": "3-5 sentences explaining Pathophysiology, why it fits this scenario, and safety risks.",
       "teachingPoint": "The one key takeaway for this specific option."
    }
4.  **Citations**: Use bracketed numbers `[1]`, `[2]` for references. These will automatically render as superscript citations.
    ```

---

### **Universal Clinical Data Schema**
Include this `clinicalData` object inside the `content` block for **ALL** item types.

**Format Requirements:**
- **Labs:** Use HTML Table with inline styles.
- **History & Physical:** Use HTML `<b>` tags for section headers.
- **Nurses Notes:** Use strict chronological text format.

```json
{
  "clinicalData": {
    "patientInfo": {
      "name": "Al...Do...", 
      "age": "65", 
      "sex": "Male", 
      "mrn": "123456789", 
      "codeStatus": "Full Code", 
      "allergies": "N/A", 
      "provider": "Dr. Smith", 
      "ward": "ICU", 
      "bed": "12"
    },
    "history": "<pre style='font-family:monospace;white-space:pre-wrap;'>TIME | NOTE | INITIAL\n1000 | Situation: ... | H.A123</pre>",
    "historyPhysical": "<b>Chief Complaint:</b> Shortness of breath.<br><br><b>HPI:</b> Patient reports 2 days of worsening dyspnea...",
    "vitals": [ 
      { "time": "08:00", "tempF": "99.1", "tempC": "37.3", "hr": "100", "rr": "22", "bp": "110/70", "o2": "94%" }
    ],
    "labs": "<table style='width:100%; border-collapse:collapse; font-size:12px'><thead><tr style='background:#f1f5f9; text-align:left'><th>Test</th><th>Value</th><th>Ref</th></tr></thead><tbody><tr><td>WBC</td><td>14.0</td><td>4.5-11</td></tr><tr><td>Hgb</td><td>12</td><td>12-16</td></tr></tbody></table>",
    "orders": "1. Normal Saline 1000mL Bolus\n2. Blood Cultures x2",
    "radiology": "CXR: Bilateral infiltrates consistent with pneumonia."
  }
}
```

### **Clinical Data Content Guidelines (JCI-Aligned)**
JCI and similar accreditation standards emphasize accurate, concise, clinically relevant documentation. For NGN items, mirror this structure but keep only details needed for the decision.

#### **1. Nurses Notes (3-Column HTML Table)** (Use exact internal styles)
- **Format:** HTML <table> with proper inline styles (borders, padding, alignment).
- **Structure:**
  - **Time (15%):** Left-aligned, top-aligned.
  - **Note (70%):** Left-aligned, top-aligned. Use bold headers (`<b>Situation:</b>`, etc.).
  - **Initial (15%):** Centered, **bottom-aligned** (`vertical-align:bottom`).
- **Example:**
```html
<table style="width:100%; border-collapse:collapse; font-size:0.9rem; font-family:inherit;">
  <thead>
    <tr style="background-color:#f7f7f7;">
      <th style="border:1px solid #ddd; padding:6px; width:15%; font-weight:600; text-align:left;">Time</th>
      <th style="border:1px solid #ddd; padding:6px; width:70%; font-weight:600; text-align:left;">Note</th>
      <th style="border:1px solid #ddd; padding:6px; width:15%; font-weight:600; text-align:center;">Initial</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #ddd; padding:6px; vertical-align:top;">1000</td>
      <td style="border:1px solid #ddd; padding:6px; vertical-align:top;">
        <b>Situation/Subjective:</b> Text...<br>
        <b>Objective/Assessment:</b> Text...<br>
        <b>Nursing Actions:</b> Text...<br>
        <b>Response/Ongoing Concerns:</b> Text...
      </td>
      <td style="border:1px solid #ddd; padding:6px; vertical-align:bottom; text-align:center; font-weight:600;">
        H.A003236
      </td>
    </tr>
  </tbody>
</table>
```

#### **2. History & Physical (H&P)**
- **Content Goals:** Presenting illness, Core PMH, Focused Exam.
- **Formatting:** Use FULL WORDS for headers (e.g. "**Chief Complaint:**", "**History of Present Illness:**"), NO abbreviations.
- **Target:** 80–150 words total.

#### **3. Vital Signs**
- **Content Goals:** Core parameters (T, HR, RR, BP, SpO₂, Pain). Show 2–4 time points for trends.
- **Best Practice:** Table format (Date/Time vs VS) with concise labels. Avoid long prose.
- **Target:** 40–60 words total.

#### **4. Laboratory Results**
- **Content Goals:** Only labs directly relevant to the decision.
- **Best Practice:** Compact table with Test Name, Result, Reference Range. Highlight or imply abnormalities.
- **Target:** 30–70 words (5–10 lines).

#### **5. Medical Orders**
- **Content Goals:** Active orders for prioritization, safety checks, or next actions.
- **JCI Format:** Drug/Test Name, Dose/Parameters, Route/Freq, Timing.
- **Target:** 40–90 words (4–8 orders). List format.

#### **6. Radiology / Imaging**
- **Content Goals:** Specific study ordered and the interpreted result.
- **Best Practice:** Study type, timing, and one-sentence impression.
- **Target:** 20–60 words.

> **Target per NGN Screen:** Total reading burden (Tabs + Question) should be **180–300 words**. This keeps focus on clinical judgment.

---

## 1. Case Study (6-Screen)
### **Prompt**
> "Generate a 6-screen NCLEX-NGN Case Study. 
> **Word Count:** Shared tabs 150-250 words; Screen-specific 50-120 words. Total reading per screen 180-300 words.
> **Content:** Wrap in `content` object.
> **Formatting:** 
> - Labs: HTML Table.
> - H&P: Bold headers (`<b>`).
> - Name: `Fi...La...` format.
> **Rationales:** For every screen, ensure the 'rationales' or option 'rationale' fields are detailed. Explain the "Why" for the correct answer and the "Why Not" for distractors.
> **Bow-Tie Screens:** If a screen uses `type: "bow-tie"`, it MUST allow mulitple distractors:
> - **Actions:** 5 Options (2 Correct, 3 Distractors).
> - **Parameters:** 5 Options (2 Correct, 3 Distractors).
> - **Condition:** 4 Options (1 Correct, 3 Distractors).
> **Final Validation:** Before responding, verify the JSON is valid. Ensure no trailing commas and all internal HTML quotes are single-quotes or escaped. No markdown wrapping."

### **JSON Schema**
```json
{
  "type": "case-study",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Ja...Do...", "age": "42", "sex": "Female", "mrn": "999999999", "codeStatus": "Full Code", "allergies": "Penicillin", "provider": "Dr. A", "ward": "Med-Surg", "bed": "4A" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>0800</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Pt admitted...<br><b>Objective:</b> Vitals stable...<br><b>Actions:</b> IV started...<br><b>Response:</b> Resting.</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Chief Complaint:</b> Pain...<br><b>History of Present Illness:</b> History...",
       "vitals": [{ "time": "0800", "tempF": 98.6, "tempC": 37, "hr": 80, "rr": 18, "bp": "120/80", "o2": "98%" }],
       "labs": "<table style='width:100%'><tr><td>Na</td><td>135</td></tr></table>",
       "orders": "Orders...",
       "radiology": "Imaging..."
    },
    "structure": {
      "type": "case-study",
      "screens": [
        { "type": "matrix", "prompt": "Recognize cues...", "columns": [...], "rows": [...] },
        { "type": "highlight", "prompt": "Analyze...", "text": "...", "correct": ["text_cue_1"], "rationales": {...} },
        { "type": "bow-tie", "prompt": "Generate Solutions...", 
          "actions": [ {"id":"a1","text":"Correct 1", "isCorrect":true}, {"id":"a2","text":"Correct 2", "isCorrect":true}, {"id":"a3","text":"Distractor 1"}, {"id":"a4","text":"Distractor 2"}, {"id":"a5","text":"Distractor 3"} ],
          "conditions": [ {"id":"c1","text":"Correct", "isCorrect":true}, {"id":"c2","text":"Distractor 1"}, {"id":"c3","text":"Distractor 2"}, {"id":"c4","text":"Distractor 3"} ],
          "parameters": [ {"id":"p1","text":"Correct 1", "isCorrect":true}, {"id":"p2","text":"Correct 2", "isCorrect":true}, {"id":"p3","text":"Distractor 1"}, {"id":"p4","text":"Distractor 2"}, {"id":"p5","text":"Distractor 3"} ]
        }
        // ... (Include 6 screens total)
      ]
    }
  }
}
```

---

## 2. Standalone Bow-Tie
### **Prompt**
> "Generate a Bow-Tie item. Wrap in `content`. Use formatted clinical data.
> **Word Count:** Scenario 80-150 wds; Stem 15-30 wds; Options 5-20 wds. Total 130-220 words.
> **Structure Rules:**
> - **Actions:** Provide exactly 5 options (2 Correct, 3 Distractors).
> - **Parameters:** Provide exactly 5 options (2 Correct, 3 Distractors).
> - **Condition:** Provide exactly 4 options (1 Correct, 3 Distractors).
> **Rationales:** Explain why each matched pair is correct (Patho/Safety) and why each distractor is incorrect (Contraindication/Irrelevance).
> **Final Validation:** Check for trailing commas and unescaped quotes in clinicalData strings. No markdown wrapping."

### **JSON Schema**
```json
{
  "type": "bow-tie",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Jo...Sm...", "age": "55", "sex": "Male", "mrn": "555555555", "codeStatus": "Full Code", "allergies": "None", "provider": "Dr. B", "ward": "ED", "bed": "1" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>1200</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [{ "time": "Now", "tempF": 98, "tempC": 36.6, "hr": 110, "rr": 24, "bp": "100/60", "o2": "92%" }],
       "labs": "<table style='width:100%'><tr><td>Trop</td><td>0.05</td></tr></table>",
       "orders": "ECG",
       "radiology": "CXR Pending"
    },
    "structure": {
      "type": "bow-tie",
      "prompt": "Complete the diagram.",
      "actions": [ 
          { "id": "a1", "text": "Action 1 (Correct)", "isCorrect": true, "rationale": "..." },
          { "id": "a2", "text": "Action 2 (Correct)", "isCorrect": true, "rationale": "..." },
          { "id": "a3", "text": "Distractor 1", "isCorrect": false, "rationale": "..." },
          { "id": "a4", "text": "Distractor 2", "isCorrect": false, "rationale": "..." },
          { "id": "a5", "text": "Distractor 3", "isCorrect": false, "rationale": "..." }
      ],
      "conditions": [ 
          { "id": "c1", "text": "Condition 1 (Correct)", "isCorrect": true, "rationale": "..." },
          { "id": "c2", "text": "Distractor 1", "isCorrect": false, "rationale": "..." },
          { "id": "c3", "text": "Distractor 2", "isCorrect": false, "rationale": "..." },
          { "id": "c4", "text": "Distractor 3", "isCorrect": false, "rationale": "..." }
      ],
      "parameters": [ 
           { "id": "p1", "text": "Param 1 (Correct)", "isCorrect": true, "rationale": { "quickReason": "Correct", "detailedReason": "...", "teachingPoint": "..." } },
           { "id": "p2", "text": "Param 2 (Correct)", "isCorrect": true, "rationale": { "quickReason": "Correct", "detailedReason": "...", "teachingPoint": "..." } },
           { "id": "p3", "text": "Distractor 1", "isCorrect": false, "rationale": { "quickReason": "Incorrect", "detailedReason": "...", "teachingPoint": "..." } },
           { "id": "p4", "text": "Distractor 2", "isCorrect": false, "rationale": { "quickReason": "Incorrect", "detailedReason": "...", "teachingPoint": "..." } },
           { "id": "p5", "text": "Distractor 3", "isCorrect": false, "rationale": { "quickReason": "Incorrect", "detailedReason": "...", "teachingPoint": "..." } }
      ]
    }
  }
}
```

---

## 3. Standalone Trend
### **Prompt**
> "Generate Trend item. Use formatted clinical data.
> **Word Count:** Narrative 60-120 wds; Stem 15-25 wds. Total 110-190 words."

### **JSON Schema**
```json
{
  "type": "trend",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Ba...Do...", "age": "2mo", "sex": "Female", "mrn": "123123123", "codeStatus": "Full Code", "allergies": "N/A", "provider": "Dr. P", "ward": "PICU", "bed": "3" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>0800</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [
          { "time": "0800", "tempF": 100, "tempC": 37.7, "hr": 140, "rr": 50, "bp": "70/40", "o2": "92%" },
          { "time": "1200", "tempF": 102, "tempC": 38.9, "hr": 160, "rr": 65, "bp": "65/35", "o2": "88%" }
       ],
       "labs": "WBC 18",
       "orders": "O2 via HFNC",
       "radiology": "CXR: Hyperinflation"
    },
    "structure": {
      "type": "trend",
      "prompt": "Review trend.",
      "trendData": {
        "timePoints": [ { "id": "t1", "timeLabel": "08:00" }, { "id": "t2", "timeLabel": "12:00" } ],
        "parameters": [ { "name": "HR", "values": ["140", "160"] }, { "name": "RR", "values": ["50", "65"] } ]
      },
      "questionFormat": "single",
      "options": [ { "id": "o1", "text": "Action", "isCorrect": true, "rationale": "..." } ]
    }
  }
}
```

---

## 4. Standalone Cloze (Dropdown)
### **Prompt**
> "Generate Cloze item. Use formatted clinical data.
> **Word Count:** Scenario 80-150 wds; Stem 15-30 wds. Total 130-220 words."

### **JSON Schema**
```json
{
  "type": "cloze",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Te...Pt...", "age": "30", "sex": "Female", "mrn": "111111111", "codeStatus": "Full Code", "allergies": "N/A", "provider": "Dr. X", "ward": "Clinic", "bed": "1" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>1000</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [],
       "labs": "",
       "orders": "",
       "radiology": ""
    },
    "structure": {
      "type": "cloze",
      "prompt": "Complete the sentence.",
      "sentences": [
        {
          "text": "Needs %BLANK1%.",
          "dropdowns": [
            {
              "id": "BLANK1",
              "options": [ { "text": "Option A", "isCorrect": true, "rationale": "..." } ]
            }
          ]
        }
      ]
    }
  }
}
```

---

## 5. Standalone Highlight
### **Prompt**
> "Generate Highlight item. Use formatted clinical data.
> **Word Count:** Passage 120-200 wds; Stem 15-25 wds. Total 150-230 words.
> **Critical Schema Rule:** The 'text' field must use `<span id='hX'>content</span>` for ALL selectable parts.
> **Correctness:** You MUST include a `correct` array containing the **exact text content** of the correct spans (e.g., ["Fever 101F", "HR 110"]).
> **Rationales:** Provide a 'rationales' object mapping correct IDs OR text to detailed explanations.
> **Explanation:** Include a global `explanation` string summarizing the case."

### **JSON Schema**
```json
{
  "type": "highlight",
  "content": {
    "rationale": "Global explanation of why confusion and fever indicate infection...",
    "clinicalData": {
       "patientInfo": { "name": "Ge...Pt...", "age": "88", "sex": "Male", "mrn": "888888888", "codeStatus": "DNR", "allergies": "Sulfa", "provider": "Dr. G", "ward": "LTC", "bed": "Rm 10" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>1400</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [{ "time": "Now", "tempF": 97, "tempC": 36.1, "hr": 90, "rr": 20, "bp": "130/70", "o2": "95%" }],
       "labs": "UA Positive",
       "orders": "Antibiotics",
       "radiology": ""
    },
    "structure": {
      "type": "highlight",
      "prompt": "Highlight cues.",
      "text": "Pt is <span id='h1'>confused</span> and has <span id='h2'>fever</span>.",
      "correct": ["confused", "fever"],
      "rationales": { 
          "h1": "Cue: Confusion indicates hypoxia...",
          "fever": "Cue: Fever suggests infection..."
      }
    }
  }
}
```

---

## 6. Standalone Matrix
### **Prompt**
> "Generate Matrix item. Use formatted clinical data.
> **Word Count:** Scenario 80-150 wds; Stem 15-30 wds. Total 130-220 words."

### **JSON Schema**
```json
{
  "type": "matrix",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Ma...Pt...", "age": "50", "sex": "Female", "mrn": "222222222", "codeStatus": "Full Code", "allergies": "N/A", "provider": "Dr. M", "ward": "Neuro", "bed": "5" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>2000</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [],
       "labs": "",
       "orders": "",
       "radiology": ""
    },
    "structure": {
      "type": "matrix",
      "prompt": "Match findings.",
      "columns": [{ "id": "c1", "label": "A" }, { "id": "c2", "label": "B" }],
      "rows": [ { "id": "r1", "text": "Finding 1", "correctColumnId": "c1", "rationale": "..." } ]
    }
  }
}
```

---

## 7. Standalone Ordered Response
### **Prompt**
> "Generate Ordered Response item. Use formatted clinical data.
> **Word Count:** Scenario 80-150 wds; Stem 15-30 wds. Total 130-220 words."

### **JSON Schema**
```json
{
  "type": "ordered-response",
  "content": {
    "clinicalData": {
       "patientInfo": { "name": "Or...Pt...", "age": "20", "sex": "Male", "mrn": "333333333", "codeStatus": "Full Code", "allergies": "Latex", "provider": "Dr. O", "ward": "OR", "bed": "Pre-Op" },
       "history": "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr style='background-color:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px;vertical-align:top'>0600</td><td style='border:1px solid #ddd;padding:6px;vertical-align:top'><b>Situation:</b> Report...<br><b>Objective:</b> Obs...<br><b>Actions:</b> Act...<br><b>Response:</b> Res...</td><td style='border:1px solid #ddd;padding:6px;vertical-align:bottom;text-align:center'>N.URSE</td></tr></tbody></table>",
       "historyPhysical": "<b>Assessment:</b>...",
       "vitals": [],
       "labs": "",
       "orders": "",
       "radiology": ""
    },
    "structure": {
      "type": "ordered-response",
      "prompt": "Order steps.",
      "orderedOptions": [
        { "id": "s1", "text": "Step 1", "rationale": "..." },
        { "id": "s2", "text": "Step 2", "rationale": "..." }
      ]
    }
  }
}
```
