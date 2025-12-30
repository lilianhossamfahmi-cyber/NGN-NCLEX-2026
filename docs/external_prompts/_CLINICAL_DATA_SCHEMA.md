# Clinical Data Generation Standards (INCLUDE IN ALL PROMPTS)

## ⚕️ CLINICAL DATA SCHEMA (GOLD STANDARD)

All clinical data MUST follow these exact structures to ensure proper rendering in the EHR simulator. Missing or malformed data will not display correctly.

---

## 📋 1. clinicalData Object Structure

```json
"clinicalData": {
  "patientInfo": {
    "name": "First Last",
    "age": 65,
    "gender": "M|F",
    "codeStatus": "Full Code|DNR|DNI|Comfort Care",
    "admissionDate": "MM/DD/YYYY HH:MM",
    "room": "Unit-##",
    "physician": "Dr. LastName",
    "nurse": "F. LastName, RN",
    "allergies": "Drug1, Drug2 (or NKDA)",
    "isolation": "Standard|Contact|Droplet|Airborne"
  },
  "history": [
    { "time": "0800", "note": "SBAR structured note text...", "initial": "JD123.RN" }
  ],
  "historyPhysical": "<p><strong>Chief Complaint:</strong>...</p>",
  "vitals": [
    { "time": "0800", "tempF": "98.6", "hr": 72, "rr": 16, "bp": "120/80", "o2": "98", "o2_device": "RA", "pain": 2 }
  ],
  "labs": [
    { "test": "TestName", "value": "12.5", "ref": "10-15 units", "flag": "H|L|H!|L!" }
  ],
  "orders": [
    { "drug": "Medication Name", "dose": "10 mg", "route": "PO", "freq": "BID", "status": "active|hold|discontinued|stat", "indication": "Indication text" }
  ],
  "radiology": "Full radiology report text with FINDINGS and IMPRESSION sections..."
}
```

---

## 🩺 2. Vital Signs Requirements (COMPLETE SET)

**MANDATORY FIELDS** - All vitals entries MUST include these 7 fields:

| Field | Format | Example | Notes |
|-------|--------|---------|-------|
| `time` | "HHMM" or "HH:MM" | "0800" | 24-hour format |
| `tempF` | String with unit | "98.6" | Fahrenheit (can omit °F) |
| `hr` | Number | 72 | Heart rate in bpm |
| `rr` | Number | 16 | Respiratory rate |
| `bp` | "SBP/DBP" | "120/80" | Blood pressure |
| `o2` | String or Number | "98" | SpO2 percentage |
| `o2_device` | String | "RA" or "2L NC" or "Hi-Flow" | Oxygen delivery method |
| `pain` | Number 0-10 | 4 | Pain score (ALWAYS INCLUDE) |

**Clinical Accuracy Rules:**
- If patient has fever: tempF should be >100.4
- If patient is tachycardic: hr should be >100
- If patient is hypotensive: bp should be <90/60
- If patient is hypoxic: o2 should be <94%
- Pain score MUST be clinically appropriate to the case

**Example (Complete Entry):**
```json
{ 
  "time": "0800", 
  "tempF": "101.2", 
  "hr": 110, 
  "rr": 24, 
  "bp": "88/52", 
  "o2": "92", 
  "o2_device": "4L NC", 
  "pain": 7 
}
```

---

## 🧪 3. Laboratory Results Requirements

**Structure for each lab:**
```json
{
  "test": "Test Name",
  "value": "12.5",
  "ref": "10-15 units",
  "flag": "H" // Optional: H, L, H!, L! (! indicates critical)
}
```

**Flag Rules:**
- `"H"` = High (above reference range)
- `"L"` = Low (below reference range)
- `"H!"` = Critical High (panic value - requires communication)
- `"L!"` = Critical Low (panic value - requires communication)

**Common Critical Values (Auto-flagged):**
| Test | Critical Low | Critical High |
|------|--------------|---------------|
| Potassium | <2.5 mEq/L | >6.5 mEq/L |
| Sodium | <120 mEq/L | >160 mEq/L |
| Glucose | <50 mg/dL | >400 mg/dL |
| Hemoglobin | <7.0 g/dL | >20 g/dL |
| WBC | <2.0 | >30.0 |
| Platelets | <50,000 | >1,000,000 |
| Troponin | - | >0.04 (any elevation) |
| pH | <7.25 | >7.55 |

---

## 💊 4. Medication Orders Requirements

**Structure for each order:**
```json
{
  "drug": "Medication Name",
  "dose": "10 mg",
  "route": "PO|IV|IM|SubQ|SL|Topical|Inhaled",
  "freq": "BID|TID|QID|Q4H|Q8H|PRN|Once|Daily",
  "status": "active|hold|discontinued|stat",
  "indication": "Reason for medication"
}
```

**High-Alert Medication List (ISMP):**
When generating these medications, the system will auto-add HIGH-ALERT badges:
- Insulin (all forms)
- Heparin, Warfarin, Enoxaparin
- Opioids (Morphine, Hydromorphone, Fentanyl, Oxycodone)
- Chemotherapy agents
- Digoxin
- Potassium Chloride (concentrated)
- Vasopressors (Dopamine, Norepinephrine, Epinephrine)
- Paralytics (Vecuronium, Rocuronium)

**Tall Man Lettering (Auto-Applied):**
The system will auto-format look-alike/sound-alike drugs:
- DOPamine / DOBUTamine
- EPINEPHrine / ePHEDrine
- HYDROmorphone / morPHINE
- clonazePAM / cloNIDine
- etc. (50+ pairs)

---

## 📋 5. Nurses Notes (SBAR Format)

**Structure:**
```json
"history": [
  {
    "time": "0800",
    "note": "Situation: [Brief statement of issue]\nBackground: [Relevant history]\nAssessment: [Nursing findings]\nRecommendation: [Actions taken/needed]",
    "initial": "JD123.RN"
  }
]
```

**Initial Format:** 2 uppercase letters + 3 numbers + ".RN" (e.g., "JD123.RN")

**Critical Note Keywords (Auto-Highlighted in Red):**
- "deteriorating", "unresponsive", "code", "emergent"
- "critical", "rapid response", "sepsis alert"
- "transfer to ICU", "intubation"

**JCI Response Pending (Auto-Alert if missing):**
If note contains action/intervention but no documented response, system will show alert.

---

## 🩻 6. Radiology Report Requirements

**Do NOT generate radiology data unless clinically relevant to the case.**

**If generating, include these sections:**
```
EXAM: [Study type]
INDICATION: [Reason for study]
COMPARISON: [Prior studies if any]

FINDINGS:
[Detailed findings paragraph]

IMPRESSION:
1. [Primary finding]
2. [Secondary finding if applicable]
```

**Critical Finding Keywords (Auto-Stamped):**
- "pneumothorax", "tension pneumothorax"
- "pulmonary embolism", "PE"
- "stroke", "infarct", "hemorrhage"
- "fracture", "dislocation"
- "free air", "perforation"
- "aortic dissection"
- "mass", "tumor", "malignancy"

---

## ✅ 7. Validation Checklist (BEFORE GENERATING)

- [ ] All vitals entries have ALL 7 fields (time, tempF, hr, rr, bp, o2, o2_device, pain)
- [ ] Vitals are clinically consistent with the case (fever for sepsis, hypotension for shock, etc.)
- [ ] Labs have test, value, and ref fields; critical values have flag
- [ ] Orders have drug, dose, route, freq, status, indication
- [ ] Nurses notes use SBAR format with proper initials
- [ ] Radiology only included if relevant; has FINDINGS and IMPRESSION sections
- [ ] No phantom/placeholder data (e.g., "Clinical correlation recommended" with empty report)

---

## 🚫 8. COMMON ERRORS TO AVOID

1. **Missing Pain Score**: Every vitals entry MUST have a `pain` field
2. **Missing O2 Device**: Every vitals entry with o2 MUST have `o2_device`
3. **Inconsistent Clinical Data**: If case is about sepsis, vitals MUST show fever + tachycardia
4. **Empty Radiology with Impression**: Don't generate "IMPRESSION: Clinical correlation recommended" without actual findings
5. **Missing Lab Flags**: If value is outside reference, include `flag` field
6. **Incomplete Orders**: Don't omit `status` or `indication`

---

**INCLUDE THIS SCHEMA IN YOUR OUTPUT BY FOLLOWING IT EXACTLY.**
