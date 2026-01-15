# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume Calculation Generation
## Topic: Cardiology

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct **Calculation (Numeric Entry)** items focused strictly on **Cardiology**. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `numeric-entry` (Dosage Calc, I/O, Rates).
2. **Topic**: All items must be **Cardiology** focused (Meds: Heparin, Dopamine, Amiodarone, etc.).
3. **Differentiation**:
   - **Level 1**: Basic Tabs/Capsule counting (oral meds).
   - **Level 2**: Basic IV Rate (mL/hr) or simple conversion (mcg to mg).
   - **Level 3**: Weight-based dosing (mg/kg).
   - **Level 4**: Complex titrations (mcg/kg/min -> mL/hr).
   - **Level 5**: Multi-step critical calculations (e.g., Burn formula or complex drip changes).
4. **Validation**: Validate against **Golden-NGN-Calculation-Item.md**.
5. **No Duplicates**: Unique numbers and scenarios.

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic*
1. **Oral Dose**: Metoprolol tabs (Order 50mg, Supply 25mg).
2. **Liquid Dose**: Furosemide liquid (Order 40mg, Supply 10mg/mL).
3. **Total Intake**: Summing fluid intake (IV + Oral).
4. **Tab Count**: Digoxin (Order 0.25mg, Supply 0.125mg).
5. **Simple Conversion**: Convert 0.5g of antibiotic to mg.

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension*
1. **IV Rate**: Infuse 1000mL NS over 8 hours. Calc mL/hr.
2. **IV Rate**: Infuse 50mL antibiotic over 30 mins. Calc mL/hr.
3. **Heparin Bolus**: Order 80 units/kg. Patient weight 100kg. Calc units.
4. **Volume limit**: Calc fluid restriction remaining for shift.
5. **Safe Dose Range**: Check if ordered dose falls within standard range (mg/day).

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application / Standard NCLEX*
1. **Heparin Drip Rate**: Order 1200 units/hr. Bag 25,000 units/250mL. Calc mL/hr.
2. **Weight Based**: Lovenox 1mg/kg QD. Patient 180lbs. Calc mg dose.
3. **Insulin**: Sliding scale calculation based on BG + fixed dose.
4. **Pediatric Dose**: Calc safe dose mg/kg/day divided q12h.
5. **Reconstitution**: Add 2.5mL diluent to vial... calc mL for 500mg dose.

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis*
1. **Dopamine Drip (mcg/kg/min)**: Order 5mcg/kg/min. Bag 400mg/250mL. Patient 70kg. Calc mL/hr.
2. **Nitroglycerin Titration**: Titrate up by 5mcg/min. Current 10mcg/min. Bag 50mg/250mL. Calc new mL/hr.
3. **Amiodarone Loading**: 150mg over 10 mins. Bag 150mg/100mL. Calc mL/hr.
4. **Heparin Protocol Adjustment**: PTT 45. Protocol says "Rebolus 40u/kg and increase rate by 2u/kg/hr". Calc new rate.
5. **Burn Fluid (Parkland) - Cardiac Context**: Volume to be replaced in first 8 hours.

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis*
1. **Complex Nitroprusside**: Order 0.3mcg/kg/min. Bag is light sensitive 50mg/250mL. Pt 88kg. Calc mL/hr. 
2. **Dobutamine Variable**: Doctor orders change from 2.5mcg/kg/min to 5mcg/kg/min. How much volume will patient receive in next 4 hours?
3. **Pediatric Resuscitation**: Epinephrine 0.01mg/kg. 1:10,000 concentration. Calc mL Volume.
4. **Propofol Dip**: mcg/kg/min. Account for lipid caloric intake (1.1 kcal/mL).
5. **Magnesium Sulfate**: 2g over 1 hour. Bag 40g/1000mL. Calc mL/hr and confirm gtt/min (15 gtt set).
