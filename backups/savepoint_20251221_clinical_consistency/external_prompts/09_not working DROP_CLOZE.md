# NGN Standalone Drag-and-Drop Cloze Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text.
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Drag-and-Drop Cloze Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The rationale must link the patient's data to the correct answer.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 📄 2. Content Guidelines
- **Format**: A paragraph with 2-4 blanks represented by `%ID%`.
- **Tokens**: A pool of drag-and-drop options (tokens). Include distractors.
- **Blanks**: Create placeholders like `%cause%`, `%treatment%`.
- **Formatting**: Expand H&P headings. Use 3 digits for initials.

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY correct token MUST have a rationale:**
- `"rationale": "Explanation..."`
- **Citations**: Include `[1]`, `[2]` inside rationale text.

## 📝 4. Complete JSON Schema

```json
{
  "type": "drop-cloze",
  "content": {
    "rationale": "Global explanation: Diabetic Ketoacidosis (DKA) requires rapid volume resuscitation and insulin therapy to close the anion gap and reverse acidosis.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Al...Ba...", 
        "age": "24", 
        "sex": "Female", 
        "mrn": "11992288", 
        "codeStatus": "Full Code", 
        "allergies": "None", 
        "provider": "Dr. Endo", 
        "ward": "ED" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>1400</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Patient found lethargic at home.<br><b>Objective:</b> Fruity breath odor, Kussmaul respirations.<br><b>Actions:</b> IV access established.<br><b>Response:</b> IVF started.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.L492</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Confusion and vomiting.<br><b>History of Present Illness:</b> 24yo female with Type 1 DM, stopped taking insulin 2 days ago due to cost. Presents with polydipsia, polyuria.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>DKA: Diabetic Ketoacidosis</div>",
      "vitals": [{ "time": "1400", "tempF": "98.9°F (37.2°C)", "hr": "115", "rr": "28", "bp": "100/60", "o2": "98%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Glucose</td><td style='padding: 4px'><b>450</b></td><td style='padding: 4px'>70-100</td></tr><tr><td style='padding: 4px'>pH</td><td style='padding: 4px'><b>7.15</b></td><td style='padding: 4px'>7.35-7.45</td></tr><tr><td style='padding: 4px'>Anion Gap</td><td style='padding: 4px'><b>24</b></td><td style='padding: 4px'>3-10</td></tr></tbody></table>",
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Clear lung fields.</div>"
    },
    "structure": {
      "type": "drop-cloze",
      "prompt": "Drag and drop the correct words to complete the sentences regarding the client's condition.",
      "tokens": [
        "Metabolic Acidosis", "Respiratory Acidosis", "Metabolic Alkalosis", 
        "Hypokalemia", "Hyperkalemia", "Insulin", "Glucagon", "Saline"
      ],
      "sentences": [
        {
          "text": "The client is experiencing %condition% characterized by a low pH and low bicarbonate.",
          "dropdowns": [
             { "id": "condition", "correctOptionText": "Metabolic Acidosis", "rationale": "DKA leads to metabolic acidosis due to ketone accumulation.[1]" }
          ]
        },
        {
          "text": "The priority medication intervention is intravenous %medication% to suppress ketogenesis.",
          "dropdowns": [
             { "id": "medication", "correctOptionText": "Insulin", "rationale": "Insulin stops the breakdown of fats (ketogenesis) and lowers blood sugar.[1]" }
          ]
        }
      ]
    }
  }
}
```
