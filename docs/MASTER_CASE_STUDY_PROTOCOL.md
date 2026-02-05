# MASTER CASE STUDY PROTOCOL (Single Source of Truth)

This document defines the strict schema and labeling requirements for the NGN Case Study system. All Generation passes, Data Pipelines, and UI Renderers MUST adhere to these exact keys and associations.

## 1. Remediation Tabs (Clinical Reasoning Modal)
These fields populate the tabs seen after submitting an answer.

| Tab Label (UI) | JSON Key Path | Purpose / Content Rule |
| :--- | :--- | :--- |
| **Option Review** | `content.rationale.options` | Precise feedback for every choice/row/span selected. |
| **Clinical Logic** | `content.rationale.caseSummary` | 3-5 sentences explaining the "Why" of the clinical progression. |
| **Strategy** | `content.rationale.goldenRule` | The singular test-taking strategy or clinical diamond for this case. |
| **Knowledge** | `content.rationale.cheatSheet` | A structured memory aid (e.g., Mnemonic or High-Yield points). |

## 2. Patient Header (Static Data Bar)
These fields appear in the top-left patient summary component.

| Field Label (UI) | JSON Key Path | Formatting Rule |
| :--- | :--- | :--- |
| **Patient Name / Age** | `content.clinicalData.patientInfo.name` | Format: "Name, Age Sex" (e.g. "Margaret Chen, 72y F") |
| **Code Status** | `content.clinicalData.patientInfo.codeStatus` | e.g., "Full Code", "DNR", "DNI" |
| **Admission Date** | `content.clinicalData.patientInfo.admissionDate` | Format: "MM/DD/YYYY HH:mm" |
| **Location** | `content.clinicalData.patientInfo.location` | e.g., "MedSurg-12", "ICU-4", "Emergency Dept" |
| **Attending Prov.** | `content.clinicalData.patientInfo.provider` | e.g., "Dr. S. Specialist" |
| **Primary Nurse** | `content.clinicalData.patientInfo.nurse` | e.g., "RN Staff" |
| **Allergies** | `content.clinicalData.patientInfo.allergies` | e.g., "NKDA", "Penicillin", "Latex" |
| **Isolation** | `content.clinicalData.patientInfo.isolation` | e.g., "Standard Precautions", "Contact", "Airborne" |

## 3. EHR Panel (Interactive Tabs)
These maps determine where data is rendered in the left-hand panel.

| Tab Label (UI) | JSON Key Path | Required Object Structure |
| :--- | :--- | :--- |
| **Nurses Notes** | `content.clinicalData.history` | Array of `{ time, note, initial }` |
| **History & Physical**| `content.clinicalData.historyPhysical` | String (Markdown/HTML permitted) |
| **Vital Signs** | `content.clinicalData.vitals` | Array of `{ time, bp, hr, rr, o2, o2Device, pain, tempF }` |
| **Laboratory Results**| `content.clinicalData.labs` | Array of `{ test, value, unit, ref, flag }` |
| **Orders** | `content.clinicalData.orders` | Array of `{ drug, dose, route, freq, status }` |
| **Radiology** | `content.clinicalData.radiology` | Array of `{ study, findings, impression, date }` |

## 4. Question Navigation (Center Panel)
| Label | Control Logic |
| :--- | :--- |
| **Question X of 6** | Controlled by `CaseStudyRenderer.tsx` tracking current index of `screens[]`. |

## 5. Development Enforcement
- **Factory Pass 1 (Blueprint)**: MUST generate the `clinicalData` using these keys.
- **Factory Pass 4 (Auditor)**: MUST generate the `rationale` using these keys.
- **Renderer**: MUST attempt to read from these keys before falling back to legacy structures.
