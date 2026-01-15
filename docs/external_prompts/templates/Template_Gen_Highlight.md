# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume Highlight Generation
## TARGET TOPIC: [INSERT TOPIC HERE]  <-- CHANGE THIS LINE

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct **Highlight** items focused strictly on the **TARGET TOPIC** defined above. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `highlight` (Text or Table based selection).
2. **Topic**: Content must relate to **[TARGET TOPIC]**.
3. **Data**: Realistic Nursing Notes, H&P, or Flowsheets.
4. **Validation**: Validate against `Golden-NGN-Highlight-Item.md`.
5. **No Duplicates**: Unique scenarios.

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic*
- **Focus**: Identify obvious abnormalities (High/Low values).
- **Focus**: Identify specific history terms (key risk factors).
- **Prompt**: "Highlight the vital signs that are outside of normal range."

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension*
- **Focus**: Identify symptoms consistent with a *specific* named diagnosis.
- **Focus**: Identify incorrect statements (Patient Teaching).
- **Prompt**: "Highlight the findings consistent with [Diagnosis]."

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application*
- **Focus**: Identify data indicating a need for *intervention*.
- **Focus**: Pre-procedure checklists or Contraindications.
- **Prompt**: "Highlight the assessment findings that require immediate provider notification."

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis*
- **Focus**: Subtle cues of deterioration or complication.
- **Focus**: Distinguishing urgent vs non-urgent in a mixed report.
- **Prompt**: "Highlight the early signs of [Complication]."

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis*
- **Focus**: Complex multi-system cues.
- **Focus**: Conflicting data points or medication incompatibilities in a complex list.
- **Prompt**: "Highlight the findings indicating 'Failure to Rescue' or Sepsis."
