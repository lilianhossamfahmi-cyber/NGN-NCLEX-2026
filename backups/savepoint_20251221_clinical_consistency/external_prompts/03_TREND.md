# NGN Standalone Trend Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

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
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS
| Field | Description |
|-------|-------------|
| `trendData.timePoints` | Array of `{id, timeLabel}` objects |
| `trendData.parameters` | Array of `{name, values[]}` - values align with timePoints |
| `questionFormat` | `"single"` (1 correct) or `"sata"` (multiple correct) |
| `options` | Each with `id`, `text`, `isCorrect`, `rationale` |

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY option MUST have:**
- `"isCorrect": true` or `"isCorrect": false`
- `"rationale": "Explanation..."` 
- **Citations**: Include `[1]`, `[2]` inside rationale text

## 📝 5. Complete JSON Schema

```json
{
  "type": "trend",
  "content": {
    "rationale": "Global explanation: The trend shows progressive respiratory failure (increasing RR/HR, dropping O2) failing non-invasive support, indicating need for escalation to intubation.",
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
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 2mo infant with RSV bronchiolitis, increasing respiratory distress.<br><b>Objective:</b> Nasal flaring, subcostal retractions, SpO2 declining.<br><b>Actions:</b> High-flow nasal cannula initiated.<br><b>Response:</b> Minimal improvement.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.P183</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Difficulty breathing, poor feeding.<br><b>History of Present Illness:</b> 2mo male with 3-day history of cough, rhinorrhea. RSV positive.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>RSV: Respiratory Syncytial Virus</div>",
      "vitals": [
        { "time": "0800", "tempF": "100.4°F (38.0°C)", "hr": "160", "rr": "60", "bp": "N/A", "o2": "90%" },
        { "time": "1000", "tempF": "101.2°F (38.4°C)", "hr": "175", "rr": "70", "bp": "N/A", "o2": "86%" },
        { "time": "1200", "tempF": "101.8°F (38.8°C)", "hr": "185", "rr": "75", "bp": "N/A", "o2": "82%" }
      ],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>WBC</td><td style='padding: 4px'>15.0</td><td style='padding: 4px'>5-19 k/cumm</td></tr><tr><td style='padding: 4px'>RSV PCR</td><td style='padding: 4px'><b>Positive</b></td><td style='padding: 4px'>Negative</td></tr></tbody></table>",
      "orders": "1. HFNC 8L/min\n2. Continuous SpO2 monitoring\n3. Respiratory therapy q4h\n4. NPO with IV fluids",
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Hyperinflation with perihilar infiltrates consistent with bronchiolitis.</div>"
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
          "rationale": "Progressive hypoxemia (SpO2 82%) despite HFNC indicates respiratory failure. Intubation is needed before cardiac arrest." 
        },
        { 
          "id": "o2", 
          "text": "Increase HFNC flow rate to 10L/min", 
          "isCorrect": false, 
          "rationale": "HFNC is already failing; escalation to invasive ventilation is needed, not further HFNC titration." 
        },
        { 
          "id": "o3", 
          "text": "Administer acetaminophen for fever", 
          "isCorrect": false, 
          "rationale": "Fever management is secondary to life-threatening hypoxemia. Airway takes priority." 
        },
        { 
          "id": "o4", 
          "text": "Encourage breastfeeding to maintain hydration", 
          "isCorrect": false, 
          "rationale": "Infant is NPO and in respiratory distress. Oral feeding increases aspiration risk." 
        }
      ]
    }
  }
}
```
