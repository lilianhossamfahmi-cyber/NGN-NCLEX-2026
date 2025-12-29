# NGN Standalone Highlight Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Highlight Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The highlighted text must be supported by the case context.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Word Count**: Narrative 80-150 words (clinical paragraph with embedded spans).
- **Highlightable Items**: 5-8 total (3-4 correct, 2-4 incorrect distractors).
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Field | Description |
|-------|-------------|
| `text` | Clinical narrative with `<span id='hX'>text</span>` for each highlightable item |
| `correct` | Array of **exact text content** of correct answers: `["Glucose 500", "pH 7.1"]`. (Backwards compatible with IDs, but TEXT is preferred). |
| `rationales` | Object with rationale for EVERY span (correct AND incorrect). |
| `rationale` | Global explanation string summarizing the case. |

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
- **Citations**: Include `[1]`, `[2]` inside rationale text
**The `rationales` object MUST include every span ID:**
```json
"rationales": {
  "h1": "Correct because...",
  "h2": "Incorrect because...",
  "h3": "Correct because..."
}
```

## 📝 5. Complete JSON Schema

```json
{
  "type": "highlight",
  "content": {
    "rationale": "Global explanation: DKA presents with hyperglycemia, acidosis, and dehydration...",
    "clinicalData": {
      "patientInfo": { 
        "name": "Li...Wa...", 
        "age": "45", 
        "sex": "Male", 
        "mrn": "456789123", 
        "codeStatus": "Full Code", 
        "allergies": "Codeine", 
        "provider": "Dr. Endo", 
        "ward": "Medicine", 
        "bed": "8A" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>1400</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 45yo male with new-onset DKA.<br><b>Objective:</b> Blood glucose 520, pH 7.18, K+ 5.8.<br><b>Actions:</b> Insulin drip initiated, aggressive IV fluids.<br><b>Response:</b> Glucose trending down.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.D405</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Nausea, vomiting, abdominal pain x2 days.<br><b>History of Present Illness:</b> 45yo newly diagnosed Type 1 DM presenting with DKA. Reports polyuria, polydipsia x1 week.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>DKA: Diabetic Ketoacidosis<br>DM: Diabetes Mellitus</div>",
      "vitals": [{ "time": "1400", "tempF": "99.2°F (37.3°C)", "hr": "115", "rr": "28", "bp": "95/60", "o2": "98%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Glucose</td><td style='padding: 4px'><b>520</b></td><td style='padding: 4px'>70-100 mg/dL</td></tr><tr><td style='padding: 4px'>pH</td><td style='padding: 4px'><b>7.18</b></td><td style='padding: 4px'>7.35-7.45</td></tr><tr><td style='padding: 4px'>K+</td><td style='padding: 4px'><b>5.8</b></td><td style='padding: 4px'>3.5-5.0 mEq/L</td></tr><tr><td style='padding: 4px'>Anion Gap</td><td style='padding: 4px'><b>22</b></td><td style='padding: 4px'>8-12</td></tr></tbody></table>",
      "orders": "1. Regular insulin drip per DKA protocol\n2. NS bolus 1L then 250mL/hr\n3. BMP q2h\n4. Continuous telemetry",
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Clear, no acute process.</div>"
    },
    "structure": {
      "type": "highlight",
      "prompt": "Highlight the findings that indicate diabetic ketoacidosis requiring immediate intervention.",
      "text": "Lab results show <span id='h1'>blood glucose 520 mg/dL</span> and <span id='h2'>arterial pH 7.18</span>. The patient has <span id='h3'>Kussmaul respirations</span> with RR 28. Potassium is <span id='h4'>5.8 mEq/L</span>. The patient reports <span id='h5'>mild headache</span> and has <span id='h6'>dry mucous membranes</span>. Blood pressure is <span id='h7'>95/60</span>.",
      "correct": ["blood glucose 520 mg/dL", "arterial pH 7.18", "Kussmaul respirations", "5.8 mEq/L", "dry mucous membranes", "95/60"],
      "rationales": {
        "h1": "Severe hyperglycemia (>500) is a hallmark of DKA requiring insulin therapy.",
        "h2": "Acidotic pH (<7.3) confirms metabolic acidosis, a DKA diagnostic criterion.",
        "h3": "Kussmaul respirations are compensatory deep breathing for metabolic acidosis.",
        "h4": "Hyperkalemia in DKA is due to transcellular shift despite total body potassium depletion. Critical to monitor during insulin therapy.",
        "h5": "Mild headache is nonspecific and does not indicate DKA severity.",
        "h6": "Dry mucous membranes indicate dehydration from osmotic diuresis - requires aggressive fluid resuscitation.",
        "h7": "Hypotension (95/60) indicates significant volume depletion requiring fluid resuscitation."
      }
    }
  }
}
```
