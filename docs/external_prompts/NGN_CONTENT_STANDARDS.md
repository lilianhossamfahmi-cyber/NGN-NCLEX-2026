# NGN Content Standards (Golden v3.2)

> **ACTIVE SOURCE OF TRUTH**
> Effective Date: 2026-01-14
> Inherits from: Golden-NGN-Case-Study-6Q.md (v3.2)

This document defines the strict schemas for **Laboratory Results, Medical Orders, History & Physical, and Vitals** for all NGN item types (Case Studies and Standalone Items). Use these schemas when generating or repairing content.

---

## 1. Laboratory Results
**Location:** `content.labs`  
**Type:** Array of Objects  

Each lab result object must contain exactly these fields:

```json
{
  "test": "WBC",
  "value": "12.5",
  "unit": "K/uL",
  "flag": "H",     
  "reference": "4.5-11.0"
}
```

### ✅ Standard Flags
*   `"H"` : High
*   `"L"` : Low
*   `"H!"`: Critical High (Panic Value)
*   `"L!"`: Critical Low (Panic Value)
*   `null`: Normal (Do not use "Normal" string, use null or omit)

---

## 2. Medical Orders
**Location:** `content.orders`  
**Type:** Array of Objects  

Each order object must contain exactly these fields:

```json
{
  "order": "IV Furosemide 40mg x1 NOW",
  "status": "Active", 
  "orderedBy": "Dr. Cardiologist",
  "time": "0820"
}
```

### ✅ Status Values
*   `"Active"`
*   `"Pending"`
*   `"Completed"`
*   `"Discontinued"`

---

## 3. Vitals
**Location:** `content.vitals`  
**Type:** Array of Objects (Minimum 1 entry)

Each vital sign entry MUST contain these **7 Fields**:

```json
{
  "time": "0800",
  "tempF": "101.5",
  "hr": 115,
  "rr": 24,
  "bp": "88/52",
  "o2": "92",
  "o2_device": "4L NC",
  "pain": 7
}
```
*   **o2_device Examples**: "RA" (Room Air), "2L NC", "NRB" (Non-Rebreather), "Vent".
*   **Case Studies**: Must provide at least 2 entries (different times) to show trends if relevant.

---

## 4. History & Physical (H&P)
**Location:** `content.historyPhysical`  
**Type:** Object  

This block populates the detailed "History" tab.

```json
{
  "chiefComplaint": "Patient's primary reason for visit",
  "hpi": "Detailed narrative of present illness...",
  "pmh": [
    "Condition 1 (e.g., CHF)",
    "Condition 2 (e.g., Type 2 DM)"
  ],
  "psh": [
    "Surgery 1 (Year)",
    "Surgery 2"
  ],
  "medications": [
    "Medication A 20mg PO daily",
    "Medication B"
  ],
  "allergies": "List known allergies or 'NKDA'",
  "socialHistory": "Smoking status, alcohol, living situation...",
  "familyHistory": "Relevant genetic history...",
  "reviewOfSystems": {
    "constitutional": "Fatigue, fever...",
    "cardiovascular": "Chest pain, edema...",
    "respiratory": "Cough, SOB...",
    "gi": "Nausea, pain...",
    "gu": "Urinary symptoms...",
    "neuro": "Dizziness..."
  },
  "physicalExam": {
    "general": "Appearance...",
    "heent": "Findings...",
    "cardiovascular": "Rhythm, murmurs...",
    "respiratory": "Breath sounds...",
    "abdomen": "Tenderness, masses...",
    "extremities": "Edema, pulses...",
    "skin": "Rashes, lesions...",
    "neuro": "Alertness, deficits..."
  }
}
```

---

## 5. Nurses Notes
**Location:** `content.nursesNotes`  
**Type:** Array of Objects

```json
[
  {
    "time": "0800",
    "author": "RN Smith",
    "note": "Initial assessment findings..."
  },
  {
    "time": "0930",
    "author": "RN Smith",
    "note": "Reassessment following intervention..."
  }
]
```
*   **Note:** HTML strings are acceptable for older formats, but the **Array of Objects** is the v3.2 Gold Standard.
