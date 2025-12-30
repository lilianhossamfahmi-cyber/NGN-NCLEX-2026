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

## 🏆 Gold Standard Content Constraints (MANDATORY)
1. **Unit Label**: The `inputLabel` field is **MANDATORY**. You must provide the exact unit string (e.g. 'mL/hr', 'mg', 'capsules') for the UI to display inside the input box.
2. **Realism**: Values must be clinically realistic (e.g., Use standard pharmacy concentrations).
3. **Zero Ambiguity**: Ensure the rounding rule is mathematically possible and clear (e.g., "Round to nearest tenth").

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

## ⚕️ 3b. CLINICAL DATA GOLD STANDARD (MANDATORY)
**All vitals MUST include 7 fields:** `time`, `tempF`, `hr`, `rr`, `bp`, `o2`, `o2_device`, `pain`
**All labs MUST include:** `test`, `value`, `ref`, and `flag` (H/L/H!/L!) for abnormal values
**All orders MUST include:** `drug`, `dose`, `route`, `freq`, `status`, `indication`
**Nurses notes MUST use SBAR format** with initials like "JD123.RN"

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
      "history": "<p><strong>08:00:</strong> Child admitted...</p>",
      "historyPhysical": "...",
      "vitals": [ { "time": "08:15", "tempF": "102.4", "hr": 110, "rr": 24, "bp": "90/58", "o2": "99% RA" } ],
      "labs": "...",
      "orders": "...",
      "radiology": "..."
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
      "caseSummary": "...",
      "answerAnalysis": "...",
      "trap": "...",
      "goldenRule": "...",
      "steps": [],
      "mnemonic": {},
      "cheatSheet": {},
      "referenceInfo": {}
    },
    "structure": {
      "prompt": "The provider prescribes Acetaminophen... Calculate the volume. (Round to the nearest tenth).",
      "units": "mL",
      "label": "Answer",
      "inputLabel": "mL",
      "answer": 14.1,
      "correctValue": 14.1,
      "acceptableRange": [14.1, 14.1],
      "explanation": "Step 1: ..."
    }
  }
}
```