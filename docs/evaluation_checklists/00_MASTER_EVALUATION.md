# MASTER NGN ZERO-ERROR EVALUATION CHECKLIST

This checklist applies to ALL NGN item types. **ANY failure here is a critical error.**

## 1. Strict JSON Syntax & Integrity
- [ ] **Valid JSON**: The entire output is parseable JSON (no trailing commas, no missing braces).
- [ ] **No Markdown Blocks**: The output does NOT contain ` ```json ` wrappers or conversational filler code.
- [ ] **Key/Value Quotes**: All keys and string values are wrapped in double quotes (`"`). No single quotes (`'`) for JSON properties.
- [ ] **Escaping**: Special characters inside strings (especially quotes in HTML attributes) are properly escaped. (e.g. `<div style="color:red">` -> `"<div style=\"color:red\">"` OR usage of single quotes inside HTML: `"<div style='color:red'>"`)
- [ ] **No Comments**: No `//` comments inside the JSON block.

## 2. Clinical Data Consistency (The "History" Check)
- [ ] **Name Consistency**: The patient's name, age, and gender are identical in `patientInfo` and any narrative text (H&P, Notes).
- [ ] **Time Stability**: Events flow in a logical chronological order. Use 24-hour time (0800, 1400) consistently.
- [ ] **Vital Sign Logic**:
    -   **Shock**: Low BP, High HR.
    -   **Infection**: High Temp, High HR.
    -   **Cushing's Triad**: High BP, Low HR, Irregular Resp.
    -   *Error Check*: Ensure vitals match the diagnosis provided in the solution.
- [ ] **Lab Formatting**: All labs are presented in an HTML `<table>` or structured list for readability, not a chaotic paragraph.

## 3. Rationale Quality (The "Super-Teacher" Standard)
- [ ] **Structure**: Contains `[Hook]`, `[Breakdown]`, `[Trap]`, `[Steps]`, `[Future]` sections (if requested by prompt) or at minimum a clear "Why/Why Not" analysis.
- [ ] **Completeness**: Explains **WHY** the correct answer is right AND **WHY** the distractors are wrong.
- [ ] **No Circular Logic**: Avoid rationals like "A is correct because it is the right thing to do." Instead: "A is correct because [Pathophysiology/Safety Outcome]."

## 4. NCSBN Metadata Compliance
- [ ] **Fields Present**: `clientNeeds`, `clientNeedsSub`, `cjmmStep`, `difficulty`, `topic`.
- [ ] **Valid Categories**: `clientNeeds` must be one of:
    -   Safe and Effective Care Environment
    -   Health Promotion and Maintenance
    -   Psychosocial Integrity
    -   Physiological Integrity
- [ ] **CJMM Step**: Must match the cognitive task (e.g. "Recognize Cues", "Take Action").

## 5. Formatting & Typography
- [ ] **No "Smart Quotes"**: Text uses straight quotes (`"`), not curly quotes (`“”).
- [ ] **Case**: "Patient" vs "Client" - Use "Client" (NCSBN standard).
- [ ] **Units**: Lab values include units (e.g., mg/dL, mmol/L).
- [ ] **Abbreviations**: Only standard medical abbreviations (NPO, PRN, IV) are used. Avoid obscure ones.
