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
5. **RANDOMIZE ORDER:** For all inner questions (Screen 1-6), randomize the order of answer choices, rows, and dropdown options to prevent predictable patterns (e.g. Option A is always correct). Do not group correct answers together.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings, not literal line breaks.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings (e.g. "patient's" NOT "patient\'s").

## 📄 2. Content Guidelines
- **Formatting**: Expand H&P headings (e.g. "History of Present Illness"). Use initials format: 2 letters + 3 numbers + .RN (e.g. JD123.RN).
- **Abbreviations**: Include "Approved Abbreviations List" at bottom of H&P using small font (approx 0.75em) and a separator line.
- **Radiology & Orders**: Format with Date/Time first (e.g. "10/24 0800"), then Test/Order Name. For Radiology, put results on a new line in **monospace** font.
- **Vitals**: For "o2", include delivery method (e.g. "94% 2L NC" or "98% RA").

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY SUPER-TEACHER STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. For EVERY item option/row, the `rationale` field must use this exact structure:

1. **[Hook]**: The "Aha!" Moment. Speak directly to the student. Use analogies.
   - *Bad:* "Sepsis is a systemic reaction."
   - *Good:* "Think of Sepsis like a forest fire: once the BP drops, the fire is out of control—that's why fluids come before antibiotics."
2. **[Breakdown]**: The "Why" Behind the "What".
   - Format: "**Option A (Correct):** We do this because [Outcome]. **Option B (Incorrect):** This is unsafe because [Risk]."
   - Connect every action to its patient outcome.
3. **[Trap]**: The "Mind-Reader" Alert.
   - Anticipate confusion (e.g., "The 'Do-Everything' Trap", "The Scope-of-Practice Trap").
   - NEVER say "None". Find a potential pitfall.
4. **[Steps]**: The Mental Shortcut.
   - A repeatable 3-step algorithm with **Bold Keywords**.
   - Example: "1. **Identify** stability. 2. **Isolate** the airway. 3. **Act** on obstruction."
5. **[Future]**: The Clinical Gem.
   - A memorable rule of thumb.
   - Example: "If the face is red, raise the head; if the face is pale, raise the tail."

**Example Rationale String:**
"[Hook] Think of the heart as a plumber's pump: if the pipes are dry, the pump runs fast. [Breakdown] **Fluids (Correct):** Refill the pipes to lower HR. **Beta-Blockers (Incorrect):** This blocks the pump without fixing the volume. [Trap] The 'Treat-the-Number' Trap: Don't just treat the high HR; fix the volume. [Steps] 1. **Assess** volume. 2. **Refill** pipes. 3. **Re-evaluate** HR. [Future] In hypovolemic shock, tachycardia is a friend, not an enemy."

## 📋 4. Screen Types Reference (ALL 6 MANDATORY)
| Screen | Type | Key Fields |
|--------|------|------------|
| 1 | `matrix` | `columns`, `rows` with `correctColumnId`, `rationale` |
| 2 | `highlight` | `text` with `<span id='hX'>`, `correct[]`, `rationales{}` |
| 3 | `multiple-choice` | `options` with `isCorrect`, `rationale` |
| 4 | `bow-tie` | `actions`, `conditions`, `parameters` each with `isCorrect`, `rationale` |
| 5 | `cloze` | `sentences` with `dropdowns`, each option has `isCorrect`, `rationale` |
| 6 | `multiple-response` | `options` with `isCorrect` (Select All That Apply) |

## 5. METADATA REQUIREMENTS
**CRITICAL:** You MUST classify the generated question accurately according to the NCSBN Clinical Judgment Measurement Model (CJMM) and Client Needs categories. This data is critical for student performance tracking.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity", // Must be one of the 4 main NCSBN categories
  "clientNeedsSub": "Pharmacological and Parenteral Therapies", // The specific sub-category
  "cjmmStep": "Generate Solutions", // Must match the question type (Screen 1=Recognize, Screen 6=Evaluate)
  "difficulty": "Hard",
  "topic": "Cardiology / Heart Failure",
  "peerAverageTime": "90" // Estimated seconds for this specific item
}
```

## 6. Complete JSON Schema

```json
{
  "type": "case-study",
  "content": {
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Pharmacological and Parenteral Therapies",
      "cjmmStep": "Form Hypotheses",
      "difficulty": "Hard",
      "topic": "Cardiology / Heart Failure",
      "peerAverageTime": "90"
    },
    "rationale": "[Hook] Think of the heart as a plumber's pump: if the pipes are dry, the pump runs fast. [Breakdown] **Fluids (Correct):** Refill the pipes to lower HR. **Beta-Blockers (Incorrect):** This blocks the pump without fixing the volume. [Trap] The 'Treat-the-Number' Trap: Don't just treat the high HR; fix the volume. [Steps] 1. **Assess** volume. 2. **Refill** pipes. 3. **Re-evaluate** HR. [Future] In hypovolemic shock, tachycardia is a friend, not an enemy.",
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
      "history": "<table style='width:100%;border-collapse:collapse'><thead><tr style='background:#f7f7f7'><th style='border:1px solid #ddd;padding:6px;width:15%'>Time</th><th style='border:1px solid #ddd;padding:6px;width:70%'>Note</th><th style='border:1px solid #ddd;padding:6px;width:15%'>Initial</th></tr></thead><tbody><tr><td style='border:1px solid #ddd;padding:6px'>0800</td><td style='border:1px solid #ddd;padding:6px'><b>Situation:</b> Patient admitted with chest pain.<br><b>Objective:</b> BP 90/60, HR 110.<br><b>Actions:</b> ECG obtained.<br><b>Response:</b> Awaiting results.</td><td style='border:1px solid #ddd;padding:6px;text-align:center'>JD123.RN</td></tr></tbody></table>",
      "historyPhysical": "<b>Chief Complaint:</b> Chest pain radiating to jaw.<br><b>History of Present Illness:</b> 65yo female with HTN, DM presents with 2hr chest pressure.<br><br><hr style='margin-top:1em; border-top:1px solid #ccc'><div style='font-size:0.75em'><b>Approved Abbreviations List:</b><br>HTN: Hypertension<br>DM: Diabetes Mellitus</div>",
      "vitals": [
        { "time": "0800", "tempF": "98.6°F (37.0°C)", "hr": "110", "rr": "22", "bp": "90/60", "o2": "94% RA" },
        { "time": "0900", "tempF": "99.0°F (37.2°C)", "hr": "118", "rr": "24", "bp": "85/55", "o2": "91% 2L NC" }
      ],
      "labs": "<table style='width:100%; border-collapse: collapse; font-family: monospace; font-size: 0.9em'><thead><tr style='border-bottom: 2px solid #ccc'><th style='text-align:left; padding: 4px'>Test</th><th style='text-align:left; padding: 4px'>Result</th><th style='text-align:left; padding: 4px'>Reference</th></tr></thead><tbody><tr><td style='padding: 4px'>Troponin</td><td style='padding: 4px'><b>2.5</b></td><td style='padding: 4px'>0-0.04 ng/mL</td></tr><tr><td style='padding: 4px'>BNP</td><td style='padding: 4px'><b>890</b></td><td style='padding: 4px'>&lt;100 pg/mL</td></tr></tbody></table>",
      "orders": "10/24 0800: 1. 12-lead ECG STAT\n10/24 0805: 2. Troponin q6h x3\n10/24 0810: 3. Aspirin 325mg PO\n10/24 0815: 4. Morphine 2mg IV PRN",
      "radiology": "<b>10/24 0830 - Chest X-Ray:</b><br><div style='font-family:monospace; margin-top:4px'>Cardiomegaly with pulmonary edema reported.</div>"
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
            { "id": "r1", "text": "ST elevation in V2-V4", "correctColumnId": "c1", "rationale": "[Hook] ST elevation is the hallmark of transmural ischemia. [Breakdown] Correct: V2-V4 elevation indicates anterior wall MI. [Trap] None. [Steps] 1. Identify ST elevation, 2. Correlate with leads, 3. Classify as STEMI. [Future] ST elevation always requires immediate attention." },
            { "id": "r2", "text": "Elevated troponin 2.5", "correctColumnId": "c1", "rationale": "[Hook] Troponin is a cardiac biomarker. [Breakdown] Correct: Elevation indicates myocardial necrosis. [Trap] Timing trap: Troponin may lag, but elevation is diagnostic. [Steps] 1. Check value, 2. Compare to reference, 3. Identify as finding. [Future] Troponin confirms MI." },
            { "id": "r3", "text": "BP 90/60", "correctColumnId": "c2", "rationale": "[Hook] Hypotension is a hemodymanic finding. [Breakdown] Correct: It is a complication (shock) but not a diagnostic indicator of STEMI itself. [Trap] Cause vs Effect: Hypotension is an effect. [Steps] 1. Assess BP, 2. Recognize shcok, 3. Distinguish from diagnostic criteria. [Future] Hypotension is a red flag but non-specific." },
            { "id": "r4", "text": "Chest pain radiating to jaw", "correctColumnId": "c1", "rationale": "[Hook] Classic angina symptoms. [Breakdown] Correct: Radiation to jaw is highly specific for cardiac ischemia. [Trap] None. [Steps] 1. Assess pain, 2. Check radiation, 3. Link to cardiac. [Future] Jaw pain is a classic cardiac symptom." }
          ]
        },
        {
          "type": "highlight",
          "prompt": "Highlight findings requiring immediate intervention.",
          "text": "Patient reports <span id='h1'>chest pressure 8/10</span>, <span id='h2'>mild nausea</span>. ECG shows <span id='h3'>ST elevation V2-V4</span>. BP <span id='h4'>90/60</span>, HR 110.",
          "correct": ["chest pressure 8/10", "ST elevation V2-V4", "90/60"],
          "rationales": {
            "chest pressure 8/10": "[Hook] Severe pain indicates active ischemia. [Breakdown] Correct: Unrelieved pain drives sympathetic response. Incorrect: Mild pain might wait. [Trap] Pain tolerance trap. [Steps] 1. Assess severity, 2. Prioritize relief. [Future] Active pain = Active tissue death.",
            "mild nausea": "[Hook] Nausea is a common symptom. [Breakdown] Correct: It is not life-threatening compared to shock/ischemia. [Trap] None. [Steps] 1. Assess symptom, 2. Determine acuity. [Future] Prioritize ABCs over comfort.",
            "ST elevation V2-V4": "[Hook] ECG changes are diagnostic. [Breakdown] Correct: Indicates transmural infarction. [Trap] Technical error trap. [Steps] 1. Read ECG, 2. Identify STEMI. [Future] ST elevation is a critical value.",
            "90/60": "[Hook] Hypotension indicates shock. [Breakdown] Correct: Cardiogenic shock requires immediate support. [Trap] None. [Steps] 1. Check BP, 2. Calculate MAP, 3. Intervene. [Future] Shock kills quickly."
          }
        },
        {
          "type": "multiple-choice",
          "prompt": "What is the PRIORITY nursing action?",
          "options": [
            { "id": "o1", "text": "Administer morphine 2mg IV", "isCorrect": false, "rationale": "[Hook] Pain control is secondary to reperfusion. [Breakdown] Correct: Morphine helps pain/anxiety. Incorrect: It does not open the blocked vessel. [Trap] Comfort trap. [Steps] 1. Prioritize Actions, 2. Compare Pain vs Perfusion. [Future] Reperfusion is priority 1." },
            { "id": "o2", "text": "Prepare for cardiac catheterization", "isCorrect": true, "rationale": "[Hook] Reperfusion saves muscle. [Breakdown] Correct: PCI restores blood flow. Incorrect: Delay causes necrosis. [Trap] Delay trap. [Steps] 1. Recognize STEMI, 2. Activate team, 3. Prepare patient. [Future] PCI within 90 mins." },
            { "id": "o3", "text": "Obtain repeat troponin", "isCorrect": false, "rationale": "[Hook] Diagnostics are done. [Breakdown] Correct: Diagnosis is already clear. Incorrect: Delays treatment. [Trap] Data collection trap. [Steps] 1. Assess need, 2. Recognize redundancy. [Future] Don't delay for redundant labs." },
            { "id": "o4", "text": "Start IV fluids wide open", "isCorrect": false, "rationale": "[Hook] Fluid management in heart failure. [Breakdown] Correct: Fluids support BP. Incorrect: Fluid overload risks pulmonary edema. [Trap] Sepsis logic trap (don't treat like sepsis). [Steps] 1. Assess Pump Function, 2. Avoid Overload. [Future] Be cautious with fluids in cardiogenic shock." }
          ]
        },
        {
          "type": "bow-tie",
          "prompt": "Complete the clinical judgment diagram.",
          "actions": [
            { "id": "a1", "text": "Activate cath lab", "isCorrect": true, "rationale": "[Hook] STEMI Protocol. [Breakdown] Correct: Immediate reperfusion is needed. [Trap] None. [Steps] 1. Identify STEMI, 2. Alert Team. [Future] Activate early." },
            { "id": "a2", "text": "Administer heparin bolus", "isCorrect": true, "rationale": "[Hook] Anti-coagulation. [Breakdown] Correct: Prevents clot growth. [Trap] Bleeding risk trap. [Steps] 1. Check contraindications, 2. Give Heparin. [Future] Heparin is standard for ACS." },
            { "id": "a3", "text": "Order routine chest X-ray", "isCorrect": false, "rationale": "[Hook] Routine diagnostics. [Breakdown] Correct: Can check heart size. Incorrect: Delays PCI. [Trap] Routine order trap. [Steps] 1. Assess priority. [Future] Don't delay emergent care." },
            { "id": "a4", "text": "Encourage oral fluids", "isCorrect": false, "rationale": "[Hook] NPO status. [Breakdown] Correct: Patient needs procedure (Cath). Incorrect: Aspiration risk. [Trap] Hydration trap. [Steps] 1. Check NPO status. [Future] NPO for procedures." },
            { "id": "a5", "text": "Apply cooling blanket", "isCorrect": false, "rationale": "[Hook] Targeted Temperature Management. [Breakdown] Correct: Used for cardiac arrest. Incorrect: Patient is awake. [Trap] Protocol confusion trap. [Steps] 1. Assess consciousness. [Future] Cooling is for comatose post-arrest." }
          ],
          "conditions": [
            { "id": "c1", "text": "Acute STEMI", "isCorrect": true, "rationale": "[Hook] Diagnosis Validation. [Breakdown] Correct: ST elevation + Troponin. [Trap] None. [Steps] 1. Integrate findings. [Future] STEMI criteria." },
            { "id": "c2", "text": "Stable angina", "isCorrect": false, "rationale": "[Hook] Angina types. [Breakdown] Incorrect: Troponin would be negative. [Trap] Misdiagnosis trap. [Steps] 1. Check markers. [Future] Enzymes differentiate angina vs MI." },
            { "id": "c3", "text": "Pulmonary embolism", "isCorrect": false, "rationale": "[Hook] Differential diagnosis. [Breakdown] Incorrect: ECG shows ischemic changes, not right strain. [Trap] Chest pain broad differential. [Steps] 1. Assess ECG. [Future] PE looks different on ECG." },
            { "id": "c4", "text": "Anxiety attack", "isCorrect": false, "rationale": "[Hook] Somatic symptoms. [Breakdown] Incorrect: Objective data (Troponin) confirms physiological cause. [Trap] Psych dismissal trap. [Steps] 1. Rule out medical first. [Future] Never assume anxiety with abnormal labs." }
          ],
          "parameters": [
            { "id": "p1", "text": "ST segments normalize", "isCorrect": true, "rationale": "[Hook] Reperfusion signs. [Breakdown] Correct: ST resolution means vessel is open. [Trap] None. [Steps] 1. Monitor ECG. [Future] ST resolution is the goal." },
            { "id": "p2", "text": "Pain reduced to 0/10", "isCorrect": true, "rationale": "[Hook] Symptoms of ischemia. [Breakdown] Correct: No pain = No ischemia. [Trap] None. [Steps] 1. Reassess pain. [Future] Pain free is the goal." },
            { "id": "p3", "text": "Weight decreases 2kg", "isCorrect": false, "rationale": "[Hook] Fluid status. [Breakdown] Incorrect: Too fast for acute treatment effect. [Trap] Heart failure monitoring trap. [Steps] 1. Assess timeframe. [Future] Weight is long term." },
            { "id": "p4", "text": "Appetite improves", "isCorrect": false, "rationale": "[Hook] General wellbeing. [Breakdown] Incorrect: Not a relevant acute cardiac parameter. [Trap] Wellness trap. [Steps] 1. Prioritize cardiac function. [Future] Appetite is low priority." },
            { "id": "p5", "text": "Urine output 50mL/hr", "isCorrect": false, "rationale": "[Hook] Kidney perfusion. [Breakdown] Incorrect: Good for shock, but specific goal is cardiac reperfusion. [Trap] Multi-system trap. [Steps] 1. Focus on primary problem. [Future] Kidney follows heart." }
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
                    { "id": "b1a", "text": "cardiogenic shock", "isCorrect": true, "rationale": "[Hook] Shock types. [Breakdown] Correct: Pump failure leads to hypotension. [Trap] Sepsis trap. [Steps] 1. Link MI to Low BP. [Future] MI leads to Carb Shock." },
                    { "id": "b1b", "text": "septic shock", "isCorrect": false, "rationale": "[Hook] Infection. [Breakdown] Incorrect: No fever or WBC spike. [Trap] Protocol bias. [Steps] 1. Check infection signs. [Future] No fever = unlikely sepsis." },
                    { "id": "b1c", "text": "anxiety", "isCorrect": false, "rationale": "[Hook] Diagnosis. [Breakdown] Incorrect: Anxiety doesn't cause hypotension. [Trap] Psych trap. [Steps] 1. Check vitals. [Future] Vitals don't lie." }
                  ]
                },
                {
                  "id": "BLANK2",
                  "correctOptionId": "b2a",
                  "options": [
                    { "id": "b2a", "text": "left ventricular dysfunction", "isCorrect": true, "rationale": "[Hook] Pathophysiology. [Breakdown] Correct: Infarction reduces contractility. [Trap] None. [Steps] 1. Link MI to Muscle. [Future] Dead muscle doesn't pump." },
                    { "id": "b2b", "text": "dehydration", "isCorrect": false, "rationale": "[Hook] Volume status. [Breakdown] Incorrect: Cardiac issue, not volume loss. [Trap] Hypovolemia trap. [Steps] 1. Assess hydration. [Future] Check turgor." },
                    { "id": "b2c", "text": "medication side effect", "isCorrect": false, "rationale": "[Hook] Adverse effects. [Breakdown] Incorrect: No causative meds given. [Trap] Med error trap. [Steps] 1. Review MAR. [Future] Always check meds, but unlikely here." }
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
            { "id": "o1", "text": "Maintain strict bedrest", "isCorrect": true, "rationale": "[Hook] Activity restriction. [Breakdown] Correct: Bedrest reduces O2 demand. [Trap] Mobility trap. [Steps] 1. Assess O2 demand. [Future] Rest the heart." },
            { "id": "o2", "text": "Administer 1L 0.9% Normal Saline bolus", "isCorrect": false, "rationale": "[Hook] Fluid resuscitation. [Breakdown] Incorrect: Risk of pulmonary edema in heart failure. [Trap] Sepsis protocol trap. [Steps] 1. Assess Pump. 2. Restrict fluids. [Future] Fluids kill in HF." },
            { "id": "o3", "text": "Start Dopamine infusion at 5 mcg/kg/min", "isCorrect": true, "rationale": "[Hook] Inotropes. [Breakdown] Correct: Supports BP in cardiogenic shock. [Trap] Vasopressor fear trap. [Steps] 1. Treat shock. [Future] Pressors support perfusion." },
            { "id": "o4", "text": "Monitor urine output hourly", "isCorrect": true, "rationale": "[Hook] Perfusion monitoring. [Breakdown] Correct: Kidney perfusion reflects cardiac output. [Trap] None. [Steps] 1. Monitor Organ function. [Future] Kidneys are the canary." },
            { "id": "o5", "text": "Place patient in supine position with legs elevated", "isCorrect": false, "rationale": "[Hook] Positioning. [Breakdown] Incorrect: Supine increases venous return, worsening pulmonary edema. [Trap] Shock position trap. [Steps] 1. Assess lungs. 2. Sit up. [Future] Head up for Heart Failure." }
          ]
        }
      ]
    }
  }
}
```
