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

## 🏥 CLINICAL DATA GOLD STANDARDS
**Vitals (ALL 7 fields required):**
```json
"vitals": [
  { "time": "0800", "tempF": "101.5", "hr": 115, "rr": 24, "bp": "88/52", "o2": "92", "o2_device": "4L NC", "pain": 7 }
]
```

## 🧠 RATIONALE OBJECT (REQUIRED)
**You MUST include a complete educational breakdown:**
```json
"rationale": {
  "coreConcept": "String defining the concept",
  "caseSummary": "String summarizing the patient scenario",
  "answerAnalysis": "Step-by-step breakdown of the math",
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

## 📦 JSON STRUCTURE (STRICT)

```json
{
  "type": "calculation",
  "content": {
    "metadata": {
      "topic": "[FOCUS]",
      "difficulty": "Hard", 
      "clientNeeds": "Physiological Integrity",
      "cjmmStep": "Take Action",
      "targetScore": [SCORE]
    },
    "patient": { 
      "name": "Initials", "age": 7, "sex": "Male", "allergies": "NKDA", "weightKg": 22
    },
    "setting": "Pediatric Unit",
    "chiefComplaint": "Infection",
    "vitals": [ ... ],
    "labs": [],
    "orders": [
        { "order": "Amoxicillin 45 mg/kg/day PO div q12h", "orderedBy": "Dr. Peds", "time": "0830", "status": "Active" }
    ],
    "nursesNotes": [
        { "time": "0800", "author": "RN Peds", "entry": "Child taking liquids well..." }
    ],
    "rationale": { ...full_rationale_object... },
    "structure": {
      "type": "calculation",
      "prompt": "Calculate the dose to administer in mg per dose. Round to the nearest whole number.",
      "correctAnswer": 495,
      "inputLabel": "mg/dose",
      "roundingRule": "Nearest whole number"
    }
  }
}
```

## 🚀 EXECUTION
Generate the JSON for [FOCUS] Calculation at Level [LEVEL].
Output ONLY JSON.
