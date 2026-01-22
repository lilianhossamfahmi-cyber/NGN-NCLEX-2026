# GOLDEN NGN CALCULATION ITEM GENERATOR (v3 - FIXED)

## 📌 PARAMETERS (FILL FIRST)
text
[QUANTITY] = 1
[FOCUS]    = 
[LEVEL]    = 3
[SCORE]    = 75      (CRITICAL: Use 85-95 for Expert/Level 5. Use 65-75 for Analysis/Level 3)


## 🚀 COPY & PASTE EVERYTHING BELOW THIS LINE

# SYSTEM PARAMETERS
ROLE: Expert NCLEX-NGN Item Writer & Pharmacology Expert
CONTEXT: Educational Exam Simulation
OUTPUT FORMAT: RAW JSON ONLY (no markdown, no intro/outro chat)

## REQUEST
GENERATE: [QUANTITY] Standalone Calculation Item(s)
CLINICAL FOCUS: [FOCUS]
DIFFICULTY LEVEL: [LEVEL] (Target Score Range: [SCORE])

## HARD CONSTRAINTS (MANDATORY)

### 1. JSON INTEGRITY (NON-NEGOTIABLE)
- All keys and string values: Double quotes only.
- NO trailing commas.
- Newlines inside strings: Escape as "\n".

### 2. ID GENERATION & METADATA (CRITICAL)
- **ID Format:** You MUST generate a root-level `id` using the pattern: `[FOCUS]-[TYPE]-[HEX]`.
  - Example: `"id": "PHARM-CALC-A1B9"`
- **Topic Mapping:** Map the [FOCUS] to one of: General, Cardiology, Respiratory, Neurology, Endocrine, Gastrointestinal, Musculoskeletal, Renal, Hematology, Integumentary, Reproductive, Mental Health, Pediatrics, Critical Care.

- HTML attributes inside strings: Single quotes.

### 2. CLINICAL REQUIREMENTS
- **Vitals (7 Fields):** Must be complete (tempF, hr, rr, bp, o2, o2_device, pain).
- **Consistency:** Vitals must match the clinical scenario (e.g., if focus is "Sepsis", vitals must show fever/tachycardia).
- **Nurses Notes:** MUST generate a minimum of **2 distinct entries** with timestamps.
- **History & Physical:** MUST generate full content (HPI, PMH, Meds). **DO NOT** use placeholders like "See Admitting Note" or "Refer to Chart".

### 3. CALCULATION SPECIFIC RULES
- **Methods:** You MUST provide `formulaMethod` AND `dimensionalAnalysis` strings in the rationale.
- **Input Label:** Explicitly state units (e.g., "mL/hr").
- **Rounding:** Explicitly state rule (e.g., "nearest whole number").
- **Prompt Text:** MUST be a complete clinical sentence, not just "Calculate X".
   - **Bad:** "Calculate the rate."
   - **Good:** "Based on the provider's order for [Drug] and the client's weight, calculate the infusion rate in mL/hr. Round to the nearest whole number."

---

## 📊 DIFFICULTY HIERARCHY (FOLLOW EXACTLY BASED ON [LEVEL])

### LEVEL 1: Fundamentals (Direct Calculation)
- **Cognitive Load:** Low. Pure arithmetic.
- **Variables:** 2 (Desired & Have)
- **Characteristics:** No unit conversions. No weight. No time factor.
- **Typical Items:**
  - Tablet Counting: Order 50 mg, Supply 25 mg tabs → Answer: 2 tabs
  - Liquid Volume: Order 200 mg, Supply 100 mg/5 mL → Answer: 10 mL

### LEVEL 2: Simple Conversions (Metric & Time)
- **Cognitive Load:** Moderate. Requires standard conversion factors.
- **Variables:** 3 (Desired, Have, Conversion)
- **Characteristics:** Single unit mismatch (mg↔mcg, L↔mL, Hours↔Minutes)
- **Typical Items:**
  - Metric Mismatch: Order 0.5 g, Supply 250 mg caps → 0.5g = 500mg → 2 caps
  - Simple IV Rate (mL/hr): Infuse 1 Liter over 8 hours → 125 mL/hr

### LEVEL 3: Competent (NCLEX Passing Standard)
- **Cognitive Load:** High. Multistep.
- **Variables:** 4+ (Volume, Time, Drop Factor, or simple Weight)
- **Typical Items:**
  - IV Drip Rate (gtt/min): Volume + Time + Drop Factor (10, 15, 60)
  - Simple Weight-Based Loading Dose: Give 15 mg/kg for 180 lbs patient

### LEVEL 4: Proficient (Critical Care & Multi-Variable)
- **Cognitive Load:** Very High. Multi-step conversions required.
- **Variables:** 5+ (Weight, Time, Dose, Concentration, Volume)
- **Typical Items:**
  - Vasoactive Drips: Dopamine/Norepinephrine (mcg/kg/min → mL/hr)
  - Reconstitution with distractor data
  - Reverse Calculation: "Pump at 15 mL/hr. How many mcg/kg/min?"

### LEVEL 5: Expert (Complex Clinical Scenarios)
- **Cognitive Load:** Expert. Math + Clinical Judgment + Protocol.
- **Variables:** Dynamic. Requires referencing a chart or protocol.
- **Typical Items:**
  - Heparin/Insulin Protocols: "APTT is 45. Calculate Bolus AND New Rate"
  - Burn Resuscitation (Parkland Formula)
  - Pediatric Safety: Calculate dose AND verify within safe range

---

## 🏥 CLINICAL DATA GOLD STANDARDS (MANDATORY - ALL TABS)
**Generate comprehensive clinical scenario data for EACH EHR tab:**

**a) PATIENT INFO (`patientInfo`):**
- Include: name, age, gender, MRN, code status, room, allergies, isolation, weight (lbs AND kg), height, admit date, primary diagnosis
- **CRITICAL:** Weight MUST appear in both lbs and kg: `"176 lbs (80 kg)"`

**b) NURSES NOTES (`nursesNotes`):** 
- **MINIMUM 2 entries** using SBAR format.
- Must include observations relevant to the medication/calculation (e.g., patient's hemodynamic status for vasopressor, blood sugars for insulin).
- Include `time`, `note` (SBAR), and `initial`.

**c) HISTORY & PHYSICAL (`historyPhysical`):**
- **Chief Complaint:** Relevant to the clinical scenario.
- **HPI:** Detailed history of present illness related to the medication usage.
- **PMH/PSH:** Conditions that impact drug selection/dosing.
- **Physical Exam:** General, CV, Resp, Abd, Neuro findings relevant to the case.

**d) VITAL SIGNS (`vitals`):**
- **MINIMUM 2 time points** showing a trend.
- **ALL 8 fields required:** `time`, `tempF`, `hr`, `rr`, `bp`, `o2`, `o2_device`, `pain`.
- Vitals should **justify** the medication (e.g., hypotension for vasopressor).

**e) LABORATORY RESULTS (`labs`):**
- **MINIMUM 3-5 relevant labs** with category, test, value, reference range, flag, time.
- Include labs that affect dosing (e.g., renal function `Creatinine`, `K+`, `Hgb`).

**f) ORDERS (`orders`):**
- **MUST** include the medication being calculated with ALL details:
  - `drug`, `dose`, `route`, `freq`, `status`, `supply` (concentration), `orderedBy`, `orderedTime`.
- Include supporting orders (IV fluids, monitoring, etc.).

**g) RADIOLOGY (`radiology`):**
- Include 1 relevant study if applicable (e.g., CXR for pneumonia).
- Include `type`, `date`, `findings`, `impression`.

**h) IV ACCESS (`ivAccess`):**
- List all IV access points with `type`, `site`, `date`, `status`, `gauge`.

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown.**
**CRITICAL: The `answerAnalysis` field MUST follow this EXACT Markdown structure (escaped as a string with \n):**

```markdown
### ✅ CORRECT RESULT: [CALCULATED_VALUE] [UNIT]

---

### 🟢 HOW WE GOT IT (Breakdown)

**1. The Setup (Dimensional Analysis):**
[Write the full equation showing all conversion factors in a line, e.g.:]
[Ordered Dose] × [Weight in kg] × [Time Conversion] × [Volume/Concentration] × [Unit Conversion]

**2. The Math (Step-by-Step):**
* **Step A (Convert Weight):** [X] lbs ÷ 2.2 = [Y] kg
* **Step B (Multiply Top):** [All numerator values multiplied] = [Result]
* **Step C (Multiply Bottom):** [All denominator values multiplied] = [Result]
* **Step D (Divide):** [Top] ÷ [Bottom] = [Raw Answer]

**3. 🛡️ Safety Check:**
[State the rounding rule applied]. [Add a clinical safety warning specific to the drug, e.g., "Always verify pump programming with a second RN for high-alert medications like Dopamine."]
```

```json
"rationale": {
  "coreConcept": "String defining the concept",
  "caseSummary": "String summarizing the patient scenario",
  "answerAnalysis": "Use the EXACT structure above (Input Summary -> Step 3 -> Safety Check)",
  "trap": "Common student error (e.g., 'Forgetting conversion')",
  "goldenRule": "Key axiom (e.g., 'Always convert lb to kg first')",
  "formulaMethod": "Volume / Time = Rate -> 1000/8 = 125",
  "dimensionalAnalysis": "1000 mL * (1 hr / 8 min)...",
  "mnemonic": { "title": "...", "content": "...", "explanation": "..." },
  "cheatSheet": { "title": "Math Tips", "points": ["Tip 1", "Tip 2"] },
  "referenceInfo": {
    "anatomy": "N/A for calculations",
    "physiology": "Relevant pharmacokinetics...",
    "pharm": "Drug mechanism..."
  },
  "difficulty": {
    "score": [SCORE],
    "level": [LEVEL],
    "label": "Easy/Medium/Hard/Expert",
    "clinicalStrategy": "Strategy to solve",
    "recommendedActions": ["Check units", "Verify safety"]
  }
}
```

### ⚠️ REFERENCEINFO MUST BE CASE-SPECIFIC
**❌ UNACCEPTABLE:** "Review relevant pharmacology."
**✅ REQUIRED:** "Amoxicillin is a beta-lactam antibiotic..."

---

---

## ✅ VALIDATION CHECKLIST
- [ ] `id` is present (`TOPIC-CALC-HEX`).
- [ ] `structure.correctValue` is a number.
- [ ] `structure.units` matches the prompt.
- [ ] `answerAnalysis` follows the structured Markdown template.
- [ ] Both `formulaMethod` and `dimensionalAnalysis` exist.

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "calculation",
  "id": "[FOCUS]-CALC-[HEX]",
  "content": {
    "prompt": "Based on the provider's order for [Drug] and the client's weight, calculate the infusion rate in mL/hr. Round to the nearest whole number.",
    "metadata": {
      "title": "[FOCUS] Calculation Scenario",
      "topic": "[FOCUS]",
      "difficulty": [LEVEL],
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "clinicalData": {
      "patientInfo": {
        "name": "J.D.",
        "age": 45,
        "gender": "M",
        "allergies": "Penicillin",
        "weightKg": 70,
        "codeStatus": "Full Code"
      },
      "setting": "Pediatric Unit",
      "historyPhysical": {
        "chiefComplaint": "Reason...",
        "hpi": "History...",
        "pmh": ["..."],
        "medications": ["..."]
      },
      "history": [
        { "time": "0800", "author": "RN Peds", "note": "Child taking liquids well..." }
      ],
      "vitals": [
        { "time": "0800", "tempF": "98.6", "hr": 110, "rr": 22, "bp": "100/60", "o2": "98", "o2_device": "RA", "pain": 2 }
      ],
      "labs": [],
      "orders": [
        { "drug": "Drug X", "dose": "20 mg/kg", "route": "IV", "freq": "q8h" }
      ],
      "radiology": []
    },
    "rationale": {
      "coreConcept": "Weight-based dosing...",
      "caseSummary": "Child requires antibiotic...",
      "answerAnalysis": "### ✅ CORRECT RESULT: 125 mL/hr...",
      "trap": "Forgetting to convert lbs to kg",
      "goldenRule": "Always verified weight in kg first.",
      "formulaMethod": "D/H * Q = X...",
      "dimensionalAnalysis": "...",
      "mnemonic": {
        "title": "ACRONYM",
        "content": "...",
        "explanation": "..."
      },
      "referenceInfo": {
          "anatomy": "N/A",
          "physiology": "...",
          "pharm": "..."
      },
      "difficulty": {
          "level": [LEVEL],
          "score": [SCORE],
          "label": "Application"
      }
    },
    "structure": {
      "type": "calculation",
      "correctValue": 125,
      "units": "mL/hr",
      "acceptableRange": [124, 126]
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Calculation at Level [LEVEL].
Output ONLY JSON.
