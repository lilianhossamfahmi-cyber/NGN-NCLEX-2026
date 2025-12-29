# NGN Standalone Multiple Response (SATA) Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text.
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Multiple Response (SATA) Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The patient's history/vitals must support the correct answer and distractors.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Options Count**: Provide **5 to 8 options** per question (NGN standard).
- **Correct Answers**: Varies (can be 1, can be all).
- **Formatting**: Expand H&P headings. Use 3 digits for initials.
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P.
- **Radiology**: Format with Test Name in **bold**, and results in **monospace**.

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY option MUST have:**
- `"isCorrect": true` or `"isCorrect": false`
- `"rationale": "Explanation..."` explaining WHY it is correct/incorrect.
- **Citations**: Include `[1]`, `[2]` inside rationale text.

## 📝 4. Complete JSON Schema

```json
{
  "type": "multiple-response",
  "content": {
    "rationale": "Global explanation: Hyperkalemia management focuses on stabilizing cardiac membranes, shifting potassium intracellularly, and eliminating potassium from the body.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Ro...Da...", 
        "age": "58", 
        "sex": "Male", 
        "mrn": "88221199", 
        "codeStatus": "Full Code", 
        "allergies": "NKDA", 
        "provider": "Dr. Kidney", 
        "ward": "Tele" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>1000</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Patient with ESRD missed dialysis.<br><b>Objective:</b> Complains of palpitations and muscle weakness. ECG shows peaked T-waves.<br><b>Actions:</b> Stat labs drawn.<br><b>Response:</b> Provider notified.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.T992</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Feeling weak and heart skipping beats.<br><b>History of Present Illness:</b> 58yo male with ESRD on hemodialysis. Missed last 2 sessions due to transportation issues.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>ESRD: End-Stage Renal Disease</div>",
      "vitals": [{ "time": "1000", "tempF": "98.2°F (36.8°C)", "hr": "62", "rr": "18", "bp": "145/88", "o2": "96%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Potassium</td><td style='padding: 4px'><b>6.8</b></td><td style='padding: 4px'>3.5-5.0</td></tr><tr><td style='padding: 4px'>Creatinine</td><td style='padding: 4px'><b>4.2</b></td><td style='padding: 4px'>0.6-1.2</td></tr></tbody></table>",
      "radiology": "<b>ECG:</b><br><div style='font-family:monospace'>Sinus rhythm with peaked T-waves and widened QRS complexes.</div>"
    },
    "structure": {
      "type": "multiple-response",
      "prompt": "Which orders does the nurse anticipate implementing? Select all that apply.",
      "options": [
        { 
          "id": "o1", 
          "text": "Administer IV Calcium Gluconate", 
          "isCorrect": true, 
          "rationale": "Calcium gluconate stabilizes component of the cardiac membrane to prevent lethal arrhythmias.[1]" 
        },
        { 
          "id": "o2", 
          "text": "Administer IV Regular Insulin with Dextrose 50%", 
          "isCorrect": true, 
          "rationale": "Insulin shifts potassium into cells; Dextrose prevents hypoglycemia.[1]" 
        },
        { 
          "id": "o3", 
          "text": "Administer Polystyrene Sulfonate (Kayexalate) PO", 
          "isCorrect": true, 
          "rationale": "Resin binds potassium in the gut for excretion.[2]" 
        },
        { 
          "id": "o4", 
          "text": "Prepare for Spironolactone administration", 
          "isCorrect": false, 
          "rationale": "Spironolactone is potassium-sparing and would worsen hyperkalemia." 
        },
        { 
          "id": "o5", 
          "text": "Limit PO fluid intake", 
          "isCorrect": true, 
          "rationale": "Fluid restriction is standard for ESRD/Dialysis patients to prevent overload." 
        },
        { 
          "id": "o6", 
          "text": "Encourage high potassium foods like bananas", 
          "isCorrect": false, 
          "rationale": "Contraindicated; dietary potassium must be restricted." 
        }
      ]
    }
  }
}
```
