# NGN Standalone Cloze (Dropdown) Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Cloze (Dropdown) Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The patient's history/vitals must support the correct answer.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Word Count**: Sentence 20-50 words; Options 2-8 words each.
- **Blanks**: 1-3 blanks per sentence.
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Field | Description |
|-------|-------------|
| `sentences[].text` | Text with `%diagnosis%`, `%intervention%` placeholders (use descriptive names) |
| `sentences[].dropdowns[]` | Array matching blanks; `id` MUST match placeholder name exactly (e.g. "diagnosis") |
| `options[]` | Each with `id`, `text`, `isCorrect`, `rationale` |

**CRITICAL:** Every `%ID%` placeholder in `text` MUST have a corresponding object in `dropdowns` with `id: "ID"`. 
- **Example:** If text is `"....%action%..."`, the dropdown `id` MUST be `"action"`.
- Use **Descriptive IDs** (e.g. `diagnosis`, `medication`) instead of numbered blanks (`BLANK1`, `BLANK2`) to avoid sequential numbering errors.

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY dropdown option MUST have:**
- `"isCorrect": true` (only for correct) or `"isCorrect": false` (for distractors)
- `"rationale": "Explanation..."` 
- **Citations**: Include `[1]`, `[2]` inside rationale text

## 📝 5. Complete JSON Schema

```json
{
  "type": "cloze",
  "content": {
    "rationale": "Global explanation: Post-operative delirium is common in elderly; key features are acute onset and fluctuating course, often triggered by infection or metabolic imbalances.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Ma...Jo...", 
        "age": "78", 
        "sex": "Female", 
        "mrn": "789123456", 
        "codeStatus": "DNR/DNI", 
        "allergies": "Sulfa", 
        "provider": "Dr. Geri", 
        "ward": "Med-Surg", 
        "bed": "22B" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0600</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 78yo female post hip arthroplasty POD1.<br><b>Objective:</b> Confusion, BP 100/60, HR 110, Temp 99.8F. Surgical site clean.<br><b>Actions:</b> Foley catheter output documented, urinalysis ordered.<br><b>Response:</b> Awaiting labs.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.C382</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Post-op confusion.<br><b>History of Present Illness:</b> 78yo female with dementia baseline, s/p right hip arthroplasty. New-onset acute confusion.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>HPI: History of Present Illness<br>POD: Post-Operative Day</div>",
      "vitals": [{ "time": "0600", "tempF": "99.8°F (37.7°C)", "hr": "110", "rr": "20", "bp": "100/60", "o2": "95%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>WBC</td><td style='padding: 4px'><b>14.5</b></td><td style='padding: 4px'>4.5-11</td></tr><tr><td style='padding: 4px'>Hgb</td><td style='padding: 4px'><b>9.8</b></td><td style='padding: 4px'>12-16</td></tr><tr><td style='padding: 4px'>BUN</td><td style='padding: 4px'><b>28</b></td><td style='padding: 4px'>7-20</td></tr></tbody></table>",
      "orders": "1. Urinalysis with culture\n2. CBC with differential\n3. Fluid bolus 500mL NS\n4. CAM assessment q shift",
      "radiology": "<b>Hip XR:</b><br><div style='font-family:monospace'>Hardware in good position, no acute changes.</div>"
    },
    "structure": {
      "type": "cloze",
      "prompt": "Complete the nurse's clinical documentation.",
      "sentences": [
        {
          "text": "The patient is most likely experiencing %diagnosis% as evidenced by %cues%.",
          "dropdowns": [
            {
              "id": "diagnosis",
              "correctOptionId": "b1a",
              "options": [
                { 
                  "id": "b1a", 
                  "text": "delirium", 
                  "isCorrect": true, 
                  "rationale": "Acute confusion in elderly post-op patient with infection signs (WBC, low-grade fever) indicates delirium, not baseline dementia." 
                },
                { 
                  "id": "b1b", 
                  "text": "dementia progression", 
                  "isCorrect": false, 
                  "rationale": "Dementia is gradual; acute change suggests delirium superimposed on dementia." 
                },
                { 
                  "id": "b1c", 
                  "text": "medication overdose", 
                  "isCorrect": false, 
                  "rationale": "No evidence of opioid toxicity (RR normal, pupils not mentioned as pinpoint)." 
                }
              ]
            },
            {
              "id": "cues",
              "correctOptionId": "b2a",
              "options": [
                { 
                  "id": "b2a", 
                  "text": "acute onset confusion and tachycardia", 
                  "isCorrect": true, 
                  "rationale": "Delirium criteria: acute onset, fluctuating course, physiological cause (infection, dehydration)." 
                },
                { 
                  "id": "b2b", 
                  "text": "stable vital signs", 
                  "isCorrect": false, 
                  "rationale": "Vitals are not stable - tachycardia 110, low-grade fever present." 
                },
                { 
                  "id": "b2c", 
                  "text": "improved surgical site healing", 
                  "isCorrect": false, 
                  "rationale": "Surgical site status does not explain altered mental status." 
                }
              ]
            }
          ]
        },
        {
          "text": "The priority nursing intervention is to %intervention%.",
          "dropdowns": [
            {
              "id": "intervention",
              "correctOptionId": "b3a",
              "options": [
                { 
                  "id": "b3a", 
                  "text": "identify and treat the underlying cause", 
                  "isCorrect": true, 
                  "rationale": "Delirium treatment focuses on resolving the cause (infection, dehydration, pain, medications)." 
                },
                { 
                  "id": "b3b", 
                  "text": "administer IV haloperidol", 
                  "isCorrect": false, 
                  "rationale": "Antipsychotics are last resort; non-pharmacological interventions and treating cause come first." 
                },
                { 
                  "id": "b3c", 
                  "text": "apply physical restraints", 
                  "isCorrect": false, 
                  "rationale": "Restraints worsen delirium and increase fall risk; contraindicated as first-line." 
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```
