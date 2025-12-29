# NGN 6-Screen Case Study Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) complete 6-Screen NGN Case Study/Studies.
**CRITICAL REQUIREMENT:** You MUST generate ALL 6 SCREENS for the case study. Do not stop at 5. The final screen (Screen 6 - SATA) is mandatory. Failure to generate Screen 6 will break the exam.

**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the case objects.
2. **NO DUPLICATES:** Each case study MUST cover a completely different clinical topic/system (e.g., 1 Cardiac, 1 Peds, 1 Neuro).
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Vitals, Notes, History) MUST be perfectly relevant to the case scenario and questions. Do NOT generate random data. If the case is about Sepsis, the vitals MUST show fever/tachycardia.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings, not literal line breaks.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.A123).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY option in EVERY screen MUST have a rationale explaining:**
- ✅ **Correct**: WHY it is correct (pathophysiology, priority, safety)
- ❌ **Incorrect**: WHY it is wrong (contraindication, not priority, irrelevant)
- 📚 **Citations**: Include reference numbers `[1]`, `[2]` in the text (e.g. "Hypoxia causes confusion.[1]").

## 📋 4. Screen Types Reference (ALL 6 MANDATORY)
| Screen | Type | Key Fields |
|--------|------|------------|
| 1 | `matrix` | `columns`, `rows` with `correctColumnId`, `rationale` |
| 2 | `highlight` | `text` with `<span id='hX'>`, `correct[]`, `rationales{}` |
| 3 | `multiple-choice` | `options` with `isCorrect`, `rationale` |
| 4 | `bow-tie` | `actions`, `conditions`, `parameters` each with `isCorrect`, `rationale` |
| 5 | `cloze` | `sentences` with `dropdowns`, each option has `isCorrect`, `rationale` |
| 6 | `multiple-response` | `options` with `isCorrect` (Select All That Apply) |

## 📝 5. Complete JSON Schema

```json
{
  "type": "case-study",
  "content": {
    "rationale": "Global explanation: This case represents an acute STEMI complicated by cardiogenic shock, requiring immediate recognition and intervention (PCI).",
    "clinicalData": {
      "patientInfo": { 
        "name": "Em...Th...", 
        "age": "65", 
        "sex": "Female", 
        "mrn": "123456789", 
        "codeStatus": "Full Code", 
        "allergies": "Penicillin", 
        "provider": "Dr. Smith", 
        "ward": "ICU", 
        "bed": "12" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Patient admitted with chest pain.<br><b>Objective:</b> BP 90/60, HR 110.<br><b>Actions:</b> ECG obtained.<br><b>Response:</b> Awaiting results.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.A123</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Chest pain radiating to jaw.<br><b>History of Present Illness:</b> 65yo female with HTN, DM presents with 2hr chest pressure.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>HTN: Hypertension<br>DM: Diabetes Mellitus</div>",
      "vitals": [
        { "time": "0800", "tempF": "98.6°F (37.0°C)", "hr": "110", "rr": "22", "bp": "90/60", "o2": "94%" },
        { "time": "0900", "tempF": "99.0°F (37.2°C)", "hr": "118", "rr": "24", "bp": "85/55", "o2": "91%" }
      ],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Troponin</td><td style='padding: 4px'><b>2.5</b></td><td style='padding: 4px'>0-0.04 ng/mL</td></tr><tr><td style='padding: 4px'>BNP</td><td style='padding: 4px'><b>890</b></td><td style='padding: 4px'>&lt;100 pg/mL</td></tr></tbody></table>",
      "orders": "1. 12-lead ECG STAT\n2. Troponin q6h x3\n3. Aspirin 325mg PO\n4. Morphine 2mg IV PRN",
      "radiology": "<b>Chest X-Ray:</b><br><div style='font-family:monospace; margin-top:4px'>Cardiomegaly with pulmonary edema reported.</div>"
    },
    "structure": {
      "type": "case-study",
      "screens": [
        {
          "type": "matrix",
          "prompt": "Categorize findings as 'STEMI Indicators' or 'Non-Specific'.",
          "columns": [
            { "id": "c1", "label": "STEMI Indicators" },
            { "id": "c2", "label": "Non-Specific" }
          ],
          "rows": [
            { "id": "r1", "text": "ST elevation in V2-V4", "correctColumnId": "c1", "rationale": "ST elevation indicates transmural ischemia requiring emergent PCI." },
            { "id": "r2", "text": "Elevated troponin 2.5", "correctColumnId": "c1", "rationale": "Troponin confirms myocardial necrosis, diagnostic for MI." },
            { "id": "r3", "text": "BP 90/60", "correctColumnId": "c2", "rationale": "Hypotension is concerning but nonspecific; may indicate cardiogenic shock." },
            { "id": "r4", "text": "Chest pain radiating to jaw", "correctColumnId": "c1", "rationale": "Classic anginal pattern highly suggestive of ACS." }
          ]
        },
        {
          "type": "highlight",
          "prompt": "Highlight findings requiring immediate intervention.",
          "text": "Patient reports <span id='h1'>chest pressure 8/10</span>, <span id='h2'>mild nausea</span>. ECG shows <span id='h3'>ST elevation V2-V4</span>. BP <span id='h4'>90/60</span>, HR 110.",
          "correct": ["chest pressure 8/10", "ST elevation V2-V4", "90/60"],
          "rationales": {
            "chest pressure 8/10": "Chest pain 8/10 indicates ongoing ischemia requiring intervention.",
            "mild nausea": "Nausea is common in MI but not an immediate intervention trigger.",
            "ST elevation V2-V4": "ST elevation is diagnostic for STEMI - requires emergent reperfusion.",
            "90/60": "Hypotension suggests cardiogenic shock - needs fluid/vasopressor support."
          }
        },
        {
          "type": "multiple-choice",
          "prompt": "What is the PRIORITY nursing action?",
          "options": [
            { "id": "o1", "text": "Administer morphine 2mg IV", "isCorrect": false, "rationale": "Pain control is important but not priority over reperfusion preparation." },
            { "id": "o2", "text": "Prepare for cardiac catheterization", "isCorrect": true, "rationale": "STEMI requires door-to-balloon time <90min. Cath lab activation is priority." },
            { "id": "o3", "text": "Obtain repeat troponin", "isCorrect": false, "rationale": "Diagnosis is already confirmed; delays treatment." },
            { "id": "o4", "text": "Start IV fluids wide open", "isCorrect": false, "rationale": "Caution with fluids in cardiogenic shock; may worsen pulmonary edema." }
          ]
        },
        {
          "type": "bow-tie",
          "prompt": "Complete the clinical judgment diagram.",
          "actions": [
            { "id": "a1", "text": "Activate cath lab", "isCorrect": true, "rationale": "STEMI protocol requires immediate cath lab activation for PCI." },
            { "id": "a2", "text": "Administer heparin bolus", "isCorrect": true, "rationale": "Anticoagulation prevents clot propagation during PCI." },
            { "id": "a3", "text": "Order routine chest X-ray", "isCorrect": false, "rationale": "Delays reperfusion; not priority in acute STEMI." },
            { "id": "a4", "text": "Encourage oral fluids", "isCorrect": false, "rationale": "NPO status needed for potential cath; aspiration risk." },
            { "id": "a5", "text": "Apply cooling blanket", "isCorrect": false, "rationale": "Not indicated; patient is not hyperthermic." }
          ],
          "conditions": [
            { "id": "c1", "text": "Acute STEMI", "isCorrect": true, "rationale": "ST elevation + positive troponin confirms STEMI diagnosis." },
            { "id": "c2", "text": "Stable angina", "isCorrect": false, "rationale": "ST elevation rules out stable angina." },
            { "id": "c3", "text": "Pulmonary embolism", "isCorrect": false, "rationale": "PE typically shows right heart strain, not ST elevation pattern." },
            { "id": "c4", "text": "Anxiety attack", "isCorrect": false, "rationale": "Objective findings (ECG, troponin) confirm cardiac etiology." }
          ],
          "parameters": [
            { "id": "p1", "text": "ST segments normalize", "isCorrect": true, "rationale": "ST resolution indicates successful reperfusion." },
            { "id": "p2", "text": "Pain reduced to 0/10", "isCorrect": true, "rationale": "Pain relief indicates restored perfusion." },
            { "id": "p3", "text": "Weight decreases 2kg", "isCorrect": false, "rationale": "Weight change not an immediate indicator of MI resolution." },
            { "id": "p4", "text": "Appetite improves", "isCorrect": false, "rationale": "Appetite is not a clinical parameter for MI treatment efficacy." },
            { "id": "p5", "text": "Urine output 50mL/hr", "isCorrect": false, "rationale": "Important for shock monitoring but not specific to STEMI resolution." }
          ]
        },
        {
          "type": "cloze",
          "prompt": "Complete the nursing documentation.",
          "sentences": [
            {
              "text": "The patient is experiencing %BLANK1%, most likely caused by %BLANK2%.",
              "dropdowns": [
                {
                  "id": "BLANK1",
                  "correctOptionId": "b1a",
                  "options": [
                    { "id": "b1a", "text": "cardiogenic shock", "isCorrect": true, "rationale": "Hypotension + MI = cardiogenic shock from pump failure." },
                    { "id": "b1b", "text": "septic shock", "isCorrect": false, "rationale": "No infection source identified; not consistent with presentation." },
                    { "id": "b1c", "text": "anxiety", "isCorrect": false, "rationale": "Objective findings confirm organic cardiac disease." }
                  ]
                },
                {
                  "id": "BLANK2",
                  "correctOptionId": "b2a",
                  "options": [
                    { "id": "b2a", "text": "left ventricular dysfunction", "isCorrect": true, "rationale": "STEMI damages LV muscle causing decreased contractility." },
                    { "id": "b2b", "text": "dehydration", "isCorrect": false, "rationale": "No evidence of volume depletion; pulmonary edema suggests overload." },
                    { "id": "b2c", "text": "medication side effect", "isCorrect": false, "rationale": "No medications given that would cause this presentation." }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "multiple-response",
          "prompt": "Which orders should the nurse question? Select all that apply.",
          "options": [
            { "id": "o1", "text": "Maintain strict bedrest", "isCorrect": true, "rationale": "Bedrest decreases myocardial oxygen demand during acute STEMI." },
            { "id": "o2", "text": "Administer 1L 0.9% Normal Saline bolus", "isCorrect": false, "rationale": "Contraindicated in cardiogenic shock; may precipitate pulmonary edema." },
            { "id": "o3", "text": "Start Dopamine infusion at 5 mcg/kg/min", "isCorrect": true, "rationale": "Inotropic support indicated for hypotension (cardiogenic shock)." },
            { "id": "o4", "text": "Monitor urine output hourly", "isCorrect": true, "rationale": "Essential to assess organ perfusion in shock." },
            { "id": "o5", "text": "Place patient in supine position with legs elevated", "isCorrect": false, "rationale": "Supine positioning can worsen respiratory distress in heart failure/pulmonary edema." }
          ]
        }
      ]
    }
  }
}
```
