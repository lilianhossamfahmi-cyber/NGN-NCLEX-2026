# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume Trend Generation
## TARGET TOPIC: [INSERT TOPIC HERE]  <-- CHANGE THIS LINE

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct **Trend** items focused strictly on the **TARGET TOPIC** defined above. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `trend` (Intro text + Chart/Table over time).
2. **Topic**: Trends must reflect pathophysiology or treatment response in **[TARGET TOPIC]**.
3. **Data**: 3-5 timepoints per chart.
4. **Validation**: Validate against `Golden-NGN-Trend-Item.md`.
5. **No Duplicates**: Unique scenarios.

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic*
- **Focus**: Recognize explicit worsening or danger zones.
- **Data**: Vitals or Labs crossing obvious thresholds (Normal to Abnormal).
- **Question**: "Identify the value that requires attention."

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension*
- **Focus**: Linking a trend to a specific diagnosis.
- **Data**: Pattern recognition (e.g., Rising WBC = Infection).
- **Question**: "What complication is indicated by this trend?"

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application*
- **Focus**: Evaluating effectiveness of an intervention.
- **Data**: Pre- and Post-Medication/Treatment values.
- **Question**: "Has the treatment been effective?" (Select findings).

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis*
- **Focus**: Distinguishing between two deteriorating conditions.
- **Data**: Subtle divergence (e.g., HR rising while BP stable -> Compensated Shock).
- **Question**: "Based on the trend, what is the priority action?"

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis*
- **Focus**: subtle "Failure to Rescue" cues or complex equipment readings.
- **Data**: Conflicting data points (e.g., CO dropping while BP maintained by vasopressors).
- **Question**: "Anticipate the immediate need for..."
