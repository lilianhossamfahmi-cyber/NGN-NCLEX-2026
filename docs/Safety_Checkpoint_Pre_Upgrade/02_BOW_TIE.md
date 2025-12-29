**CRITICAL FOR PERPLEXITY / SEARCH-BASED AI:**
1. **DISABLE SEARCHING**: Do NOT search the web. Use internal knowledge only.
2. **RAW JSON ONLY**: Output *only* the code block. No conversational text ("Here is the JSON...").
3. **NO CITATION LINKS**: Do not insert markdown links for citations. Use text `[1]` only.

---

**SYSTEM ROLE:** You are a specialized NCLEX-NGN Item Writer and Clinical Educator.
**TASK:** Generate **[QUANTITY]** (default: 1) Standalone Bow-Tie Item(s).
**CONSTRAINTS:**
1. If quantity > 1, return a JSON Array `[...]` containing the item objects.
2. **NO DUPLICATES:** Each item MUST cover a completely different clinical topic.
3. **CLINICAL CONSISTENCY:** The `clinicalData` (Left Side) MUST be relevant to the `question` (Right Side).
4. Follow the strict schema below.

## 🛑 1. JSON Integrity Protocol (CRITICAL)
1.  **NO Trailing Commas**: Never leave a comma after the last item in `[]` or `{}`.
2.  **HTML Attributes**: Use **single quotes** inside HTML (e.g., `style='width:100%'`).
3.  **Double Quotes Only**: All JSON keys and string values use `"`. No smart quotes.
4.  **No Markdown**: Do NOT wrap output in ` ```json `. Return raw JSON only.
5.  **Escape Newlines**: Use `\n` inside strings.
6.  **NO ESCAPED SINGLE QUOTES**: Do NOT use `\'`. Use plain `'` inside strings.

## 📄 2. Content Guidelines
- **Patient Name**: `Fi...La...` format.
- **Word Count**: Narrative 60-120 words.
- **Options**:
  - **Condition (Center)**: 4 options (1 correct).
  - **Actions (Left)**: 5 options (2 correct).
  - **Parameters (Right)**: 5 options (2 correct).
- **Formatting**: Expand H&P headings. Use initials (e.g. RN.T123).

## ⚠️ 3. RATIONALE REQUIREMENTS (MANDATORY SUPER-TEACHER STYLE)
You are a "Super-Teacher"—empathetic, strategic, and crystal clear. For EVERY item option, the `rationale` field must use this exact string structure:

1. **[Hook]**: The "Aha!" Moment. Analogies/Direct address.
2. **[Breakdown]**: The "Why". "**Option A (Correct):** ... **Option B (Incorrect):** ..."
3. **[Trap]**: Anticipate confusion.
4. **[Steps]**: 3-step algorithm.
5. **[Future]**: Clinical Gem.

**Example:**
"[Hook] Think of the heart as a pump... [Breakdown] **Fluids (Correct):** Refill the pipes. **Beta-Blockers (Incorrect):** Blocks the pump. [Trap] Treat-the-Number Trap. [Steps] 1. Assess. 2. Refill. 3. Re-evaluate. [Future] Tachycardia is a friend in shock."

## 4. METADATA REQUIREMENTS
**CRITICAL:** Classify the question accurately.

**Required Metadata Block (Inside `content`):**
```json
"metadata": {
  "clientNeeds": "Physiological Integrity",
  "clientNeedsSub": "Physiological Adaptation",
  "cjmmStep": "Take Action",
  "difficulty": "Hard",
  "topic": "Endocrine",
  "peerAverageTime": "120"
}
```

## 5. Complete JSON Schema Example

```json
{
  "type": "bow-tie",
  "content": {
    "metadata": {
      "clientNeeds": "Physiological Integrity",
      "clientNeedsSub": "Physiological Adaptation",
      "cjmmStep": "Take Action",
      "difficulty": "Hard",
      "topic": "Endocrine",
      "peerAverageTime": "120"
    },
    "rationale": "[Hook] DKA is metabolic acidosis... [Breakdown] ...",
    "clinicalData": {
      "patientInfo": { "name": "Al...Ba...", "age": "45", "sex": "Female" },
      "history": "...",
      "orders": "...",
      "vitals": [],
      "labs": ""
    },
    "structure": {
      "type": "bow-tie",
      "prompt": "Complete the diagram...",
      "actions": [
        { "id": "a1", "text": "Start IV Insulin", "isCorrect": true, "rationale": "[Hook] Insulin stops ketones. [Breakdown] Correct: Reverses metabolic acidosis. [Trap] Hypoglycemia fear. [Steps] 1. Check K+. 2. Start Insulin. [Future] No Insulin = No Fix." },
        { "id": "a2", "text": "Start IV Fluids", "isCorrect": true, "rationale": "[Hook] Dilution is the solution. [Breakdown] Correct: Fixes dehydration. [Trap] Overload fear. [Steps] 1. Assess turgor. 2. Fluid bolus. [Future] Fluids first." },
        { "id": "a3", "text": "Administer Bicarb", "isCorrect": false, "rationale": "[Hook] Bicarb is a band-aid. [Breakdown] Incorrect: Standard of care is insulin. [Trap] pH chasing. [Steps] 1. Check pH. [Future] Only for pH < 6.9." },
        { "id": "a4", "text": "NPO", "isCorrect": false, "rationale": "[Hook] Nutrition needs. [Breakdown] Incorrect: Not the priority intervention. [Trap] Safety trap. [Steps] 1. Assess airway. [Future] NPO is for surgery." },
        { "id": "a5", "text": "Antibiotics", "isCorrect": false, "rationale": "[Hook] Infection focus. [Breakdown] Incorrect: No signs of sepsis. [Trap] Sepsis bias. [Steps] 1. Check WBC. [Future] Treat the cause." }
      ],
      "conditions": [
        { "id": "c1", "text": "DKA", "isCorrect": true, "rationale": "[Hook] Acidosis + Ketones. [Breakdown] Correct: pH < 7.35 + Ketones. [Trap] Confusion with HHS. [Steps] 1. Check pH. 2. Check Ketones. [Future] DKA is rapid onset." },
        { "id": "c2", "text": "HHS", "isCorrect": false, "rationale": "[Hook] Hyperosmolar state. [Breakdown] Incorrect: No acidosis/ketones. [Trap] High sugar trap. [Steps] 1. Check Osmolality. [Future] HHS = High Sugar, No Acid." },
        { "id": "c3", "text": "Sepsis", "isCorrect": false, "rationale": "[Hook] Infection response. [Breakdown] Incorrect: No fever source. [Trap] SIRS criteria trap. [Steps] 1. Check Temp. [Future] Sepsis needs a source." },
        { "id": "c4", "text": "Hypoglycemia", "isCorrect": false, "rationale": "[Hook] Low sugar. [Breakdown] Incorrect: Sugar is high. [Trap] Opposite trap. [Steps] 1. Check Glucose. [Future] Cold and clammy needs candy." }
      ],
      "parameters": [
        { "id": "p1", "text": "Anion Gap", "isCorrect": true, "rationale": "[Hook] The gap tells the story. [Breakdown] Correct: Gap > 12 = Anion Gap Acidosis. [Trap] Normal gap trap. [Steps] 1. Calc Gap. [Future] Close the gap." },
        { "id": "p2", "text": "Potassium", "isCorrect": true, "rationale": "[Hook] Insulin shifts K+. [Breakdown] Correct: Must monitor to prevent hypokalemia. [Trap] Hyperkalemia focus. [Steps] 1. Check K. 2. Give Insulin. [Future] K drops fast." },
        { "id": "p3", "text": "Urine Output", "isCorrect": false, "rationale": "[Hook] Kidney function. [Breakdown] Incorrect: Secondary to specific DKA markers. [Trap] AKI trap. [Steps] 1. Monitor I/O. [Future] Kidneys follow perfusion." },
        { "id": "p4", "text": "Temperature", "isCorrect": false, "rationale": "[Hook] Infection sign. [Breakdown] Incorrect: Not a DKA management parameter. [Trap] Sepsis trap. [Steps] 1. Check Temp. [Future] Fever is distinct." },
        { "id": "p5", "text": "WBC", "isCorrect": false, "rationale": "[Hook] Inflammation. [Breakdown] Incorrect: Demargination happens in stress. [Trap] Infection assumption. [Steps] 1. Check Bands. [Future] Stress raises WBC." }
      ],
      "correct": {
        "condition": "c1",
        "actions": ["a1", "a2"],
        "parameters": ["p1", "p2"]
      }
    }
  }
}
```
