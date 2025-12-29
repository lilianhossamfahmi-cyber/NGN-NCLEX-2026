**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the JSON object. Do not wrap in markdown blocks. Do not say "Here is the JSON". Do not repeat the prompt. START WITH '{'.
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

Generate **[QUANTITY]** **Fill-in-the-Blank Calculation** items with a Clinical Focus of **[FOCUS]** at Difficulty Level **[LEVEL]** (1-5).

**DIFFICULTY LEVEL GUIDE:**
- **Level 1 (Novice/Recall)**: Basic facts, definitions, and single-step recall.
- **Level 2 (Adv. Beginner/Application)**: Applying standard rules or protocols to simple scenarios.
- **Level 3 (NGN Standard/Analysis)**: Multi-step cues, analyzing trends, differentiating findings.
- **Level 4 (Proficient/Synthesis)**: Prioritizing conflicting needs, complex decision making.
- **Level 5 (Expert/Evaluation)**: High-stakes clinical judgment under uncertainty or rapid change.

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Fill-in-the-Blank Calculation Item.
**TYPE:** calculation (Numeric Entry).

CONSTRAINTS:
1. If quantity > 1, return a JSON Array [...] containing the item objects.
2. **NO DUPLICATES**: Each item MUST cover a different dosage/IV calculation topic.
3. **CLINICAL CONSISTENCY**: Populate clinicalData with relevant orders and patient weight if needed.
4. **ROUNDING RULE**: The question text (prompt) MUST explicitly state the rounding rule.
5. **SCORING**: 0/1 (All or nothing). No partial credit.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1. **NO Trailing Commas**: Never leave a comma after the last item.
2. **HTML Attributes**: Use single quotes inside HTML.
3. **Double Quotes Only**: All JSON keys and string values use ".
4. **No Markdown**: Return raw JSON only.

## 2. Content Guidelines
- **Input**: Single numeric field.
- **Key**: Exact numeric value (float or integer).
- **Difficulty**: Level 2 (Application).

## 3. METADATA REQUIREMENTS (Perfect Fill)
Populate metadata with:
- clientNeeds: "Physiological Integrity"
- clientNeedsSub: "Pharmacological Therapies"
- difficulty: "Level 2: Single-Step Application"

## 🏥 3a. Clinical Data Generation (JCI Standards)
- **Documentation Style**: All "Nurses Notes" and clinical entries must follow **JCI standards**:
  - Use objective, measurable terms (avoid "appears", "seems").
  - Include specific times for all entries.
  - **Weight Conversion Rule**: ANY time a weight is mentioned in `lbs`, you MUST calculate and append the `kg` equivalent in parentheses immediately after.
    - Example: "Patient weight: 176 lbs (80 kg)"
- **Data Consistency**: Ensure all numeric values in tabs (Vitals, Labs) exactly match the values needed for the calculation.
- **Patient Data & Header**:
  - You MUST populate `clinicalData.patientInfo` with a valid **Age** (e.g., 5) and **Allergies** (e.g., "NKA" or "Penicillin").
  - **Narrative redundancy**: The `historyPhysical` MUST explicitly state the age and allergies in text format (e.g., "Pt is a 5-year-old male... Allergies: NKA") to ensure easy parsing.

## ⚠️ 4. Rationale & Feedback (Zero Error Safety Fill)
- **Step-by-Step Methodology (Engaging & Dual-Method)**:
  - **Tone**: Engaging, encouraging, and clear (e.g., "Let's solve this together!", "First, we need to...").
  - **Requirement**: You MUST provide **TWO methods** of calculation:
    1.  **Formula Method**: D/H x Q.
    2.  **Dimensional Analysis**: Showing unit cancellation.
  - **REAL NUMBERS ONLY**: You MUST use the **actual values** from the scenario in your steps.
    - ❌ BAD: "Divide desired by have."
    - ✅ GOOD: "Divide 450 mg (Desired) by 160 mg (Have)."
  - **Structure**: Use "Step 1", "Step 2" format clearly.
- **Weight Safety Rule**: 
  - **In Question Text**: AUTOMATICALLY include `(kg)` immediately after any `lbs` value. Example: "66 lbs (30 kg)".
  - **In Rationale**: Show the conversion step if relevant.
- **Knowledge Safety Fill**: `referenceInfo` MUST be populated with specific Anatomy/Physiology/Pharm linking to *why* this dose matters (e.g., "Narrow therapeutic index in peds").

## 4. RATIONALE REQUIREMENTS (HTML Structure)
The `rationale.answerAnalysis` field MUST be a single string containing HTML markup to format the explanation. You must follow this exact HTML structure inside the string:

**1. The Safety Stop (Top Section)**
- **Header**: `<h3>⚠️ Safety Check</h3>`
- **Instruction**: Extract patient data (Weight, Allergies, etc.) directly from the scenario.
- **Content**: A `<table class="calc-table">` with columns: **CHECK**, **CASE FINDING**, **ACTION**.
- **Example**: 
```html
<table class="calc-table">
  <tr><th>Check</th><th>Case Finding</th><th>Action</th></tr>
  <tr><td>Weight</td><td>176 lbs</td><td>Convert to <strong>80 kg</strong></td></tr>
  <tr><td>Units</td><td>mcg/min</td><td>Convert mg to mcg</td></tr>
</table>
```

**2. Method 1: Formula Method (Middle Section)**
- **Separator**: `<hr>`
- **Header**: `<h3>Method 1: Formula Method</h3>`
- **Instruction**: You MUST extract the exact numbers from the Question Prompts/Orders to fill the variables.
- **Content**: 
  1. **Variables Table**:
     ```html
     <table class="calc-table">
       <tr><th>Variable</th><th>Case Finding</th></tr>
       <tr><td><strong>D</strong> (Desired)</td><td>450 mg</td></tr>
       <tr><td><strong>H</strong> (Have)</td><td>160 mg</td></tr>
       <tr><td><strong>Q</strong> (Quantity)</td><td>5 mL</td></tr>
     </table>
     ```
  2. Then, the **Equation Step**: `<p class="equation-box"><strong>Equation:</strong> (450 / 160) x 5 = <strong>14.1 mL</strong></p>`

**3. Method 2: Dimensional Analysis (Middle Section)**
- **Separator**: `<hr>`
- **Header**: `<h3>Method 2: Dimensional Analysis</h3>`
- **Content**: Show the unit cancellation chain. Use `<s>` for crossed-out units.
- **Example**: `<p class="equation-box">$$ \frac{5 mL}{160 mg} \times \dots $$ = <strong>14.1 mL</strong></p>`

**4. The Common Pitfall (Bottom Section)**
- **Separator**: `<hr>`
- **Header**: `<h3>⛔ Common Error</h3>`
- **Content**: Explain the error outcome (e.g. "Result is 2x overdose").

**Example of the required JSON output for this field:**
```json
"answerAnalysis": "<h3>⚠️ Safety Check</h3><table class='calc-table'><tr><th>Check</th><th>Case Finding</th><th>Action</th></tr><tr><td>Weight</td><td>198 lbs</td><td>Convert to <strong>90 kg</strong></td></tr></table><hr><h3>Method 1: Formula Method</h3><table class='calc-table'><tr><th>Var</th><th>Case Finding</th></tr><tr><td>D</td><td>450 mg</td></tr><tr><td>H</td><td>160 mg</td></tr></table><p class='equation-box'>(450/160)*5 = 14.1</p><hr><h3>Method 2: Dimensional Analysis</h3><p class='equation-box'>...</p><hr><h3>⛔ Common Error</h3><p>Failure to convert weight...</p>"
```

- **goldenRule**: A tip about calculation safety (e.g., "Always convert lbs to kg first").
- **referenceInfo**: MUST be populated with relevant Pharmacology, Physiology, and Anatomy. Do NOT leave empty.

## ⚡ ZERO ERROR SYSTEM (SELF-CORRECTION PROTOCOL)
Before outputting, you MUST internally verify:
1.  **JSON Syntax Check**: Are all braces `{}` and brackets `[]` closed? Are there NO trailing commas?
2.  **Escape Check**: Are all newlines inside strings escaped as `\n`? Are all quotes inside strings escaped as `\"`?
3.  **Safety Check**: Did you use SINGLE QUOTES inside HTML strings (e.g., `style='width:100%'`)?
4.  **Format Check**: Is the output **PURE JSON** with NO markdown fences or intro text?
5.  **Metadata Check**: Is `cjmmStep` set to `"Take Action"` for Calculation items?
*If any check fails, regenerate immediately.*

## 6. Complete JSON Schema for calculation
```json
{
  "type": "calculation",
  "content": {
    "type": "calculation",
    "clinicalData": {
      "patientInfo": { "name": "T. Tiny", "age": 4, "gender": "M", "codeStatus": "Full Code", "admissionDate": "Today", "room": "Peds-04", "allergies": "NKA", "isolation": "None" },
      "history": "<p><strong>08:00:</strong> Child admitted with high fever and ear pain. Diagnosed with Acute Otitis Media.</p>",
      "historyPhysical": "<p><strong>HPI:</strong> Mother reports child feels hot and is crying. \n<strong>Weight:</strong> 66 lbs (30 kg).</p>",
      "vitals": [ { "time": "08:15", "tempF": "102.4", "hr": 110, "rr": 24, "bp": "90/58", "o2": "99% RA" } ],
      "labs": "<table style='width:100%'><tr><td><strong>WBC</strong></td><td>14.5</td></tr></table>",
      "orders": "<ul><li>Acetaminophen 15 mg/kg PO q4h PRN for Temp > 101.5 F</li></ul>",
      "radiology": "<p>None.</p>"
    },
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Pharmacological Therapies",
      "cjmmStep": "Take Action",
      "difficulty": "Level 2: Single-Step Application",
      "topic": "Pharmacology",
      "peerAverageTime": "90",
      "cueCount": 2,
      "timePressure": "medium",
      "integrationLevel": "basic",
      "clinicalFocus": "Pediatric Dosage"
    },
    "rationale": {
      "coreConcept": "Pediatric Weight-Based Dosage Calculation",
      "caseSummary": "Calculating a safe pediatric dose based on body weight and available concentration.",
      "answerAnalysis": "<h3>⚠️ Safety Check</h3><table class='calc-table'><tr><th>Check</th><th>Case Finding</th><th>Action</th></tr><tr><td>Weight</td><td>66 lbs</td><td>Convert to <strong>30 kg</strong></td></tr><tr><td>Order Units</td><td>mg/kg</td><td>Matches Supply (mg)</td></tr></table><hr><h3>Method 1: Formula Method</h3><table class='calc-table'><tr><th>Variable</th><th>Case Finding</th></tr><tr><td><strong>D</strong> (Desired)</td><td>450 mg (15 * 30)</td></tr><tr><td><strong>H</strong> (Have)</td><td>160 mg</td></tr><tr><td><strong>Q</strong> (Quantity)</td><td>5 mL</td></tr></table><p class='equation-box'><strong>Equation:</strong> (450 &#247; 160) x 5 = <strong>14.06 mL</strong> (Round to 14.1)</p><hr><h3>Method 2: Dimensional Analysis</h3><p class='equation-box'>$$ \\frac{5 mL}{160 mg} \\times \\frac{15 mg}{1 kg} \\times \\frac{1 kg}{2.2 lbs} \\times \\frac{66 lbs}{1} = \\mathbf{14.1 mL} $$</p><hr><h3>⛔ Common Error</h3><p>Using weight in pounds (66) results in a <strong>2.2x overdose</strong>.</p>",
      "trap": "Failing to convert lbs to kg first, or calculating the daily dose limit instead of the single dose volume.",
      "goldenRule": "Dose = (Desired / Have) x Quantity. Always convert weight to kg first (divide by 2.2).",
      "steps": [
        { "tag": "Convert", "description": "66 lbs / 2.2 = 30 kg" },
        { "tag": "Dose", "description": "15 * 30 = 450 mg" },
        { "tag": "Volume", "description": "(450/160)*5 = 14.1 mL" }
      ],
      "mnemonic": {},
      "cheatSheet": {
        "title": "Pediatric Safety Pearls",
        "points": ["Always convert lbs to kg (divide by 2.2)", "Check 'Safe Dose Range' per 24h", "Use oral syringe for volumes < 5 mL"]
      },
      "referenceInfo": {
        "anatomy": "Pediatric body surface area (BSA) and weight are critical for accurate dosing due to immature organ systems.",
        "physiology": "Renal and hepatic function in children affects drug metabolism and excretion, increasing toxicity risk.",
        "pharm": "Safe dosage is proportional to weight (mg/kg). Always verify the 'safe range' before administration."
      }
    },
    "structure": {
      "prompt": "The provider prescribes Acetaminophen 15 mg/kg PO q4h PRN for fever > 101.5°F. The child weighs 66 lbs (30 kg). The pharmacy supplies Acetaminophen 160 mg/5 mL. Calculate the volume to administer in mL. (Round to the nearest tenth).",
      "units": "mL",
      "label": "mL",
      "inputLabel": "mL",
      "answer": 14.1,
      "correctValue": 14.1,
      "acceptableRange": [14.1, 14.1],
      "explanation": "Step 1: Convert lbs to kg: 66 / 2.2 = 30 kg. \nStep 2: Calculate Dose: 15 mg/kg * 30 kg = 450 mg. \nStep 3: Calculate Volume: (450 mg / 160 mg) * 5 mL = 14.06 mL. \nStep 4: Round to nearest tenth: 14.1 mL."
    }
  }
}
```