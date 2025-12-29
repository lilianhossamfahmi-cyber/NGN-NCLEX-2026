# NGN Standalone Bow-Tie Prompt

**Copy and Paste the ENTIRE text below into your AI (ChatGPT, Claude, Gemini, Perplexity, etc).**

**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Bow-Tie Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic/system (e.g., Shock, COPD, Stroke).
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side). The patient's history/vitals must support the correct answer options.
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings, not literal line breaks.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format
- **Word Count**: Scenario 80-150 words; Options 5-20 words each.
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use 3 digits for initials (e.g. RN.JK492).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology**: Format with Test Name in **bold**, and results on a new line in **monospace** font.

## 🔑 3. STRUCTURE REQUIREMENTS (CRITICAL)
| Category | Count | Correct | Distractors |
|----------|-------|---------|-------------|
| **Actions** | 5 options | 2 correct | 3 incorrect |
| **Conditions** | 4 options | 1 correct | 3 incorrect |
| **Parameters** | 5 options | 2 correct | 3 incorrect |

## ⚠️ 4. RATIONALE REQUIREMENTS (MANDATORY)
**EVERY option MUST have:**
- `"isCorrect": true` or `"isCorrect": false`
- `"rationale": "Explanation..."` explaining WHY
- **Citations**: Include `[1]`, `[2]` inside rationale text

## 📝 5. Complete JSON Schema

```json
{
  "type": "bow-tie",
  "content": {
    "rationale": "Global explanation: This scenario depicts a potential Subarachnoid Hemorrhage, where immediate BP control and CT imaging are priority to prevent rebleeding and confirm diagnosis.",
    "clinicalData": {
      "patientInfo": { 
        "name": "Jo...Sm...", 
        "age": "55", 
        "sex": "Male", 
        "mrn": "555555555", 
        "codeStatus": "Full Code", 
        "allergies": "None", 
        "provider": "Dr. B", 
        "ward": "ED", 
        "bed": "1" 
      },
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>1200</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> 55yo male presents with sudden severe headache.<br><b>Objective:</b> BP 220/120, GCS 14, photophobia present.<br><b>Actions:</b> IV access obtained, CT ordered.<br><b>Response:</b> Awaiting imaging.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>RN.B294</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Worst headache of my life.<br><b>History of Present Illness:</b> Sudden onset 1 hour ago, associated with nausea and neck stiffness.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>BP: Blood Pressure<br>GCS: Glasgow Coma Scale</div>",
      "vitals": [{ "time": "1200", "tempF": "98.6°F (37.0°C)", "hr": "88", "rr": "18", "bp": "220/120", "o2": "98%" }],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>WBC</td><td style='padding: 4px'>9.0</td><td style='padding: 4px'>4.5-11</td></tr><tr><td style='padding: 4px'>Glucose</td><td style='padding: 4px'><b>110</b></td><td style='padding: 4px'>70-100 mg/dL</td></tr></tbody></table>",
      "orders": "1. CT Head without contrast STAT\n2. CBC, BMP, Coags\n3. Maintain SBP <180",
      "radiology": "<b>CT Head:</b><br><div style='font-family:monospace'>Pending</div>"
    },
    "structure": {
      "type": "bow-tie",
      "prompt": "The patient presents with sudden severe headache and BP 220/120. Select 2 priority actions, the most likely condition, and 2 parameters to monitor for improvement.",
      "actions": [
        { 
          "id": "a1", 
          "text": "Administer IV labetalol", 
          "isCorrect": true, 
          "rationale": "BP control is critical in suspected hemorrhagic stroke to prevent rebleeding. Target SBP <180.[1]" 
        },
        { 
          "id": "a2", 
          "text": "Prepare for emergent CT", 
          "isCorrect": true, 
          "rationale": "Non-contrast CT is the gold standard to differentiate ischemic vs hemorrhagic stroke.[1]" 
        },
        { 
          "id": "a3", 
          "text": "Administer tPA bolus", 
          "isCorrect": false, 
          "rationale": "tPA is contraindicated until hemorrhage is ruled out - would worsen bleeding." 
        },
        { 
          "id": "a4", 
          "text": "Encourage oral hydration", 
          "isCorrect": false, 
          "rationale": "NPO status required; aspiration risk with altered consciousness." 
        },
        { 
          "id": "a5", 
          "text": "Perform lumbar puncture", 
          "isCorrect": false, 
          "rationale": "LP before CT risks herniation if mass effect present." 
        }
      ],
      "conditions": [
        { 
          "id": "c1", 
          "text": "Subarachnoid hemorrhage", 
          "isCorrect": true, 
          "rationale": "Thunderclap headache + neck stiffness + severe hypertension classic for SAH.[1]" 
        },
        { 
          "id": "c2", 
          "text": "Migraine headache", 
          "isCorrect": false, 
          "rationale": "Migraines rarely present with sudden onset or extreme hypertension." 
        },
        { 
          "id": "c3", 
          "text": "Tension headache", 
          "isCorrect": false, 
          "rationale": "Tension headaches are gradual onset without neurological signs." 
        },
        { 
          "id": "c4", 
          "text": "Sinusitis", 
          "isCorrect": false, 
          "rationale": "No facial pain, congestion, or fever to suggest sinus infection." 
        }
      ],
      "parameters": [
        { 
          "id": "p1", 
          "text": "Blood pressure decreases to <180 systolic", 
          "isCorrect": true, 
          "rationale": "BP control reduces risk of rebleeding and hematoma expansion.[2]" 
        },
        { 
          "id": "p2", 
          "text": "GCS remains stable or improves", 
          "isCorrect": true, 
          "rationale": "Neurological status reflects intracranial pressure and treatment efficacy.[2]" 
        },
        { 
          "id": "p3", 
          "text": "Patient reports improved appetite", 
          "isCorrect": false, 
          "rationale": "Appetite is not a clinical indicator for acute stroke management." 
        },
        { 
          "id": "p4", 
          "text": "Urine output >30mL/hr", 
          "isCorrect": false, 
          "rationale": "Renal perfusion monitoring is secondary to neurological status." 
        },
        { 
          "id": "p5", 
          "text": "Patient ambulates independently", 
          "isCorrect": false, 
          "rationale": "Mobility assessment is for rehabilitation, not acute management." 
        }
      ]
    }
  }
}
```
