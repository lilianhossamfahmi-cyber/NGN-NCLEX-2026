# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume Trend Generation
## Topic: Cardiology

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct **Trend** items focused strictly on **Cardiology**. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `trend` (Items displaying EMR data over time/multiple timepoints).
2. **Topic**: All items must be **Cardiology** focused.
3. **Differentiation**:
   - **Level 1**: Recognize a simple worsening value (e.g., BP dropping).
   - **Level 2**: Trend recognition linking to diagnosis (e.g., rising WBC = infection).
   - **Level 3**: Intervention effectiveness (e.g., BP lowering after med).
   - **Level 4**: Complex deterioration (early shock).
   - **Level 5**: Subtle failure to rescue or conflicting trends.
4. **Validation**: Validate against standard NGN Trend formats suitable for `Golden-NGN-Trend.md` (implied).
5. **No Duplicates**: Unique scenarios.

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic*
1. **BP Trend**: Recognize severe hypotension trend (120/80 -> 110/70 -> 80/50).
2. **HR Trend**: Recognize onset of Tachycardia (80 -> 95 -> 120).
3. **Temp Trend**: Recognize developing fever (37.0 -> 37.8 -> 38.5).
4. **O2 Sat Trend**: Recognize hypoxia (98% -> 94% -> 88%).
5. **Weight Trend**: Recognize fluid gain (1kg gain overnight).

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension*
1. **Troponin Trend**: Rising Troponin I (0.01 -> 0.15 -> 2.40) indicating MI evolution.
2. **INR Trend**: INR becoming supratherapeutic (2.0 -> 3.5 -> 5.0) risk of bleeding.
3. **Output Trend**: Oliguria trend (50ml/hr -> 30ml/hr -> 10ml/hr).
4. **K+ Trend**: Hypokalemia from Diuretics (4.0 -> 3.5 -> 2.9).
5. **Pain Trend**: Pain not relieved by NTG (6/10 -> 6/10 -> 8/10).

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application*
1. **Response to Lasix**: Weight loss and increased urine output trend (Effective).
2. **Response to Beta Blocker**: HR decreasing to therapeutic range (110 -> 80 -> 65).
3. **Heparin Protocol**: aPTT trending subtherapeutic -> Need bolus/rate up.
4. **Post-Op Bleed**: HR rising + BP falling slowly (Compensated to Uncompensated shock).
5. **Pericardial Effusion**: Pulse Pressure narrowing trend (120/60 -> 110/70 -> 100/80).

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis*
1. **Cushing's Triad vs Shock**: Distinguishing VS trends (HTN/Brady vs Hypotension/Tachy).
2. **Sepsis Progression**: Early hyperdynamic (High HR, Warm) to late hypodynamic (Low BP, Cold).
3. **Digoxin Toxicity**: Slowing HR + New onset block on strip trend.
4. **Renal Perfusion**: Creatinine rising despite good urine output (High output failure/diuresis vs injury).
5. **Weaning Vasoactives**: BP stability trend allowing titration down (Levophed weaning).

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis*
1. **Cardiogenic Shock Evolution**: CVP rising, PCWP rising, Cardiac Index falling over 4 hours.
2. **HIT (Heparin Induced Thrombocytopenia)**: Platelets falling >50% over 2 days (Trend analysis).
3. **Post-Transplant Rejection**: Subtle temp rise + subtle EF drop trend over 2 weeks.
4. **Compensated Acidosis**: pH dropping, CO2 dropping (Respiratory compensation fatigue) trend.
5. **LVAD Power**: Power spikes trending up (Thrombosis risk) vs Flow drops.
