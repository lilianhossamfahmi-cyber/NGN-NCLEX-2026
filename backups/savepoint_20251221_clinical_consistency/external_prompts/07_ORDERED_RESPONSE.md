# NGN Standalone Ordered Response Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Ordered Response (Drag-and-Drop) Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The steps required must match the specific patient situation.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Steps**: 4-6 nursing actions to prioritize
- **Word Count**: Each step 5-15 words; Rationale 20-40 words.
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Field | Description |
|-------|-------------|
| `orderedOptions` | Array in **CORRECT ORDER** (first item = first step) |
| `Each option` | Has `id`, `text`, and `rationale` |
| `rationale` | Explains WHY this step is at this position (e.g., "First because...", "Third because...") |

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY option MUST have a rationale that explains its position:**
- "**First** because airway is always priority..."
- "**Second** because IV access is needed before medications..."
- "**Third** because pain control follows stabilization..."
- **Citations**: Include `[1]`, `[2]` inside rationale text

## 📝 5. Complete JSON Schema

```json
{
  "type": "ordered-response",
  "content": {
    "rationale": "Global explanation: Prioritization follows the ATLS Primary Survey (ABCDE) - Airway with C-spine, Breathing (hemothorax), Circulation (shock/IV access), Disability (FAST exam), Exposure/Adjuncts (fracture/pain).",
    "clinicalData": {
      "patientInfo": { 
        "name": "An...Pe...", 
        "age": "42", 
        "sex": "Female", 
        "mrn": "159753468", 
        "codeStatus": "Full Code", 
        "allergies": "Latex", 
        "provider": "Dr. Trauma", 
        "ward": "Emergency Department", 
        "bed": "Trauma Bay 1" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>2100</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 42yo female MVA victim, unrestrained driver.<br><b>Objective:</b> GCS 13, BP 90/60, HR 125, obvious deformity right femur.<br><b>Actions:</b> Trauma activation called. C-collar in place.<br><b>Response:</b> Patient moaning, responding to voice.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.T194</td></tr></tbody></table>",
      "historyPhysical": "<b>Mechanism:</b> High-speed MVA into tree, unrestrained, airbag deployed.<br><b>Primary Survey:</b> Airway patent with cervical immobilization, diminished breath sounds right base, tachycardic, obvious right femur fracture.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>MVA: Motor Vehicle Accident<br>C-collar: Cervical Collar</div>",
      "vitals": [{ "time": "2100", "tempF": "97.8°F (36.6°C)", "hr": "125", "rr": "28", "bp": "90/60", "o2": "94%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Hgb</td><td style='padding: 4px'><b>9.2</b></td><td style='padding: 4px'>12-16 g/dL</td></tr><tr><td style='padding: 4px'>Lactate</td><td style='padding: 4px'><b>4.2</b></td><td style='padding: 4px'>0.5-2.0 mmol/L</td></tr></tbody></table>",
      "orders": "1. Trauma panel labs\n2. Type and crossmatch 4 units\n3. FAST exam\n4. CT trauma series when stable",
      "radiology": "<b>CXR:</b><br><div style='font-family:monospace'>Right hemothorax suspected. Pelvis: No obvious fracture. RLE: Displaced femur fracture.</div>"
    },
    "structure": {
      "type": "ordered-response",
      "prompt": "Order the nursing actions by priority for this trauma patient.",
      "orderedOptions": [
        { 
          "id": "s1", 
          "text": "Ensure patent airway with cervical spine protection", 
          "rationale": "First because Airway is always the initial priority in trauma. C-spine protection is maintained until cleared." 
        },
        { 
          "id": "s2", 
          "text": "Assess breathing and prepare for chest tube insertion", 
          "rationale": "Second because diminished breath sounds + hemothorax requires immediate intervention after airway secured. Breathing comes before Circulation in ABC." 
        },
        { 
          "id": "s3", 
          "text": "Establish two large-bore IV access and initiate fluid resuscitation", 
          "rationale": "Third because Circulation support with IV access is critical for hemorrhagic shock (BP 90/60, HR 125, low Hgb). Blood products may be needed." 
        },
        { 
          "id": "s4", 
          "text": "Perform FAST exam to identify internal bleeding", 
          "rationale": "Fourth because after initial ABCs, identifying occult hemorrhage sources guides surgical intervention. FAST is rapid and non-invasive." 
        },
        { 
          "id": "s5", 
          "text": "Immobilize the right femur fracture", 
          "rationale": "Fifth because extremity fractures are addressed after life threats stabilized. Immobilization reduces bleeding and pain." 
        },
        { 
          "id": "s6", 
          "text": "Administer pain medication", 
          "rationale": "Sixth because pain control is important but follows hemodynamic stabilization. Opioids can cause hypotension." 
        }
      ]
    }
  }
}
```
