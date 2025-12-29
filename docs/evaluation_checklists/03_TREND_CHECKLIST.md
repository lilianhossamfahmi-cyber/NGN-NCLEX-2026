# TREND ZERO-ERROR CHECKLIST

**Objective:** Validate Time-Series items.

## 1. Data Integrity & Visualization
- [ ] **Minimum Data Points**: The item contains at least **three** distinct time points (e.g., 0800, 0815, 0830) or days.
- [ ] **Format Consistency**: If showing Vitals, the columns (HR, BP, RR) are consistent across all time rows. No missing values unless intentional (e.g. "Not Recorded").
- [ ] **HTML Table**: The trend data is formatted in a clean HTML `<table>` string within `clinicalData`.

## 2. Trend Logic
- [ ] **Clear Direction**: The data shows a recognizable pattern (e.g., Sepsis: HR up, BP down; ICP: BP up, HR down).
- [ ] **Visual Cues**: Bold text (e.g., `<b>180/110</b>`) is used for abnormal critical values if specified by the prompt style.

## 3. Question Alignment
- [ ] **Reference**: The prompt explicitly asks the user to review the *trends* or *changes* over time.
- [ ] **Answer derivation**: The correct answer cannot be determined by looking at a single data point; it requires synthesis of the change.

## 4. Item Type Specifics
- [ ] **SATA/Multiple Response**: Validated logic.
- [ ] **Single Choice**: Validated logic.
