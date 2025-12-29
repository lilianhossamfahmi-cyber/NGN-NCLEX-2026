# NGN Standalone Matrix Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Matrix Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The matrix rows/columns must align with the patient's condition.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Rows**: 4-6 assessment findings
- **Columns**: 2-3 categories
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Field | Description |
|-------|-------------|
| `columns` | Array of `{id, label}` for column headers |
| `rows` | Array of `{id, text, correctColumnId, rationale}` |
| `correctColumnId` | Must match one column's `id` |
| `rationale` | Explains why this row belongs in that column |

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY row MUST have:**
- `"correctColumnId": "c1"` (matching a column id)
- `"rationale": "Explanation..."` explaining the categorization
- **Citations**: Include `[1]`, `[2]` inside rationale text

## 📝 5. Complete JSON Schema

```json
{
  "type": "matrix",
  "content": {
    "rationale": "Global explanation: Effective CHF management is evidenced by fluid removal (weight loss, diuresis) and symptom improvement (oxygenation), while persistent congestion indicates ineffective treatment.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Ro...Da...", 
        "age": "68", 
        "sex": "Male", 
        "mrn": "321654987", 
        "codeStatus": "Full Code", 
        "allergies": "Aspirin", 
        "provider": "Dr. Cardio", 
        "ward": "Cardiac Step-Down", 
        "bed": "15" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0700</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 68yo male admitted for CHF exacerbation.<br><b>Objective:</b> Weight up 4kg from baseline, +2 pitting edema bilateral LE, crackles bilateral bases.<br><b>Actions:</b> Lasix IV initiated, strict I/O.<br><b>Response:</b> UOP increasing.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.H129</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Worsening shortness of breath x3 days.<br><b>History of Present Illness:</b> 68yo male with EF 25%, non-compliant with fluid restriction, now with signs of volume overload.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>CHF: Congestive Heart Failure<br>EF: Ejection Fraction</div>",
      "vitals": [{ "time": "0700", "tempF": "98.2°F (36.8°C)", "hr": "92", "rr": "24", "bp": "145/90", "o2": "91%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>BNP</td><td style='padding: 4px'><b>1250</b></td><td style='padding: 4px'>&lt;100 pg/mL</td></tr><tr><td style='padding: 4px'>Creatinine</td><td style='padding: 4px'><b>1.6</b></td><td style='padding: 4px'>0.6-1.2 mg/dL</td></tr><tr><td style='padding: 4px'>K+</td><td style='padding: 4px'>4.2</td><td style='padding: 4px'>3.5-5.0 mEq/L</td></tr></tbody></table>",
      "orders": "1. Lasix 40mg IV BID\n2. Daily weights\n3. Fluid restriction 1.5L/day\n4. Low sodium diet",
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Cardiomegaly, pulmonary vascular congestion, small bilateral pleural effusions.</div>"
    },
    "structure": {
      "type": "matrix",
      "prompt": "Categorize each finding as 'Effective' or 'Ineffective' response to CHF treatment.",
      "rowLabel": "Clinical Finding",
      "columns": [
        { "id": "c1", "label": "Effective Response" },
        { "id": "c2", "label": "Ineffective Response" }
      ],
      "rows": [
        { 
          "id": "r1", 
          "text": "Weight decreased by 2kg overnight", 
          "correctColumnId": "c1", 
          "rationale": "Weight loss indicates successful diuresis and fluid removal - goal of therapy." 
        },
        { 
          "id": "r2", 
          "text": "Crackles persist in bilateral bases", 
          "correctColumnId": "c2", 
          "rationale": "Persistent crackles indicate ongoing pulmonary congestion - treatment not yet effective." 
        },
        { 
          "id": "r3", 
          "text": "BNP decreased from 1250 to 800", 
          "correctColumnId": "c1", 
          "rationale": "Decreasing BNP correlates with reduced cardiac wall stress - positive response." 
        },
        { 
          "id": "r4", 
          "text": "Urine output 200mL in 8 hours", 
          "correctColumnId": "c2", 
          "rationale": "Low urine output suggests inadequate diuresis or worsening renal function." 
        },
        { 
          "id": "r5", 
          "text": "SpO2 improved from 91% to 96% on room air", 
          "correctColumnId": "c1", 
          "rationale": "Improved oxygenation indicates reduced pulmonary edema - effective treatment." 
        },
        { 
          "id": "r6", 
          "text": "Peripheral edema unchanged at +2", 
          "correctColumnId": "c2", 
          "rationale": "Persistent edema indicates ongoing volume overload - ineffective response." 
        }
      ]
    }
  }
}
```
