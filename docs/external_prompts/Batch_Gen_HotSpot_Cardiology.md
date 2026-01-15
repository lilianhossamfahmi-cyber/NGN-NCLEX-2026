# MASTER BATCH GENERATION PROTOCOL - NGN ITEM BANK
## Mode: High-Volume HotSpot Generation
## Topic: Cardiology

---

### INSTRUCTIONS FOR THE AI GENERATOR
You are acting as the "Master NGN Generator" engine. Your task is to generate 25 distinct **HotSpot** items focused strictly on **Cardiology**. You must generate 5 items for each Difficulty Level (1 through 5).

### CONSTRAINTS & RULES
1. **Format**: All items must be `hot-spot` (Image location identification).
2. **Topic**: All items must be **Cardiology** focused (ECG landmarks, Chest Auscultation points, Anatomy).
3. **Differentiation**:
   - **Level 1**: Basic anatomy location.
   - **Level 2**: Auscultation points (APE To Man).
   - **Level 3**: ECG measurement points (P wave start).
   - **Level 4**: Defibrillation pad placement / V-Lead placement.
   - **Level 5**: Invasive line placement / Specific coronary artery obstruction.
4. **Validation**: Validate against **Golden-NGN-HotSpot-Item.md**.
5. **No Duplicates**: Unique scenarios. *Note: You must describe the target coordinate/area clearly in text.*

---

### BATCH 1: DIFFICULTY LEVEL 1 (5 Items)
*Recall / Basic*
1. **Anatomy**: "Locate the Apex of the Heart."
2. **Anatomy**: "Locate the Right Atrium."
3. **Pulse**: "Locate the Carotid Pulse site."
4. **Pulse**: "Locate the Radial Pulse site."
5. **Pulse**: "Locate the Dorsalis Pedis pulse site."

### BATCH 2: DIFFICULTY LEVEL 2 (5 Items)
*Comprehension*
1. **Auscultation**: "Click the location to auscultate the Aortic Valve (2nd ICS Right)."
2. **Auscultation**: "Click the location to auscultate the Mitral Valve/PMI (5th ICS Mid-Clavicular)."
3. **Auscultation**: "Click the location for the Pulmonic Valve."
4. **Auscultation**: "Click the location of Erb's Point."
5. **ECG**: "Identify the P-Wave on this strip."

### BATCH 3: DIFFICULTY LEVEL 3 (5 Items)
*Application*
1. **Lead Placement**: "Where do you place the V1 electrode?" (4th ICS Right Sternal Border).
2. **Lead Placement**: "Where do you place the V4 electrode?"
3. **Defib**: "Identify proper placement for the Apex defibrillator pad."
4. **Assessment**: "Locate the site to assess for Jugular Venous Distention (JVD)."
5. **ECG**: "Identify the ST segment to measure elevation."

### BATCH 4: DIFFICULTY LEVEL 4 (5 Items)
*Analysis*
1. **Coronary Arteries**: "Locate the Left Anterior Descending (LAD) artery on this diagram."
2. **ECG Analysis**: "Identify the specific point where the 'R on T' phenomenon would occur."
3. **Echo**: "Locate the pericardial effusion collection space on this diagram."
4. **Valve Disease**: "Locate the Tricuspid valve (to identify Regurgitation flow)."
5. **Procedure**: "Locate the femoral artery puncture site for cardiac cath."

### BATCH 5: DIFFICULTY LEVEL 5 (5 Items)
*Synthesis*
1. **Conduction System**: "Locate the Bundle of His."
2. **Congenital**: "Locate the Patent Ductus Arteriosus connection."
3. **Trauma**: "Locate the optimal site for needle decompression (though usually resp, cardiac tamponade context: pericardiocentesis site - subxiphoid)."
4. **Invasive Lines**: "Locate the tip placement for a Central Venous Catheter (SVC/RA junction)."
5. **Complication**: "Locate the area of likely infarction given lead II, III, aVF changes (Inferior Wall/RCA)."
