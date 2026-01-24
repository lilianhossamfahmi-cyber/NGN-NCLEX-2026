import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 2: Items 5-8)
 * Focus: Supervision, Legal Issues, Ethics, Prioritization
 * STANDARDS:
 * - Difficulty Level 5
 * - Explicit 'trendTable' for UI Renderer
 * - Sequential Timestamps
 * - 4-Section Preview, 5-Part Rationale
 */

export const MgtCareItems_Final_Batch2: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-SUPER-S9T0",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Supervision of UAP and LPN",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:46:00.000Z", // Sequential
            "updatedAt": "2026-01-23T18:46:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Supervision", "Delegation", "Scope of Practice"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Post-Op Unit", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 07:00", "room": "Surg-All", "physician": "N/A", "nurse": "Charge RN", "isolation": "Standard"
                },
                "setting": "Surgical Step-down",
                "historyPhysical": {
                    "chiefComplaint": "Supervision of delegated tasks",
                    "hpi": "RN is supervising a Floating LPN and a new UAP. 4 Patients are assigned.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "08:00", "author": "Charge RN", "note": "Rounds: Patient A (Day 1 Post-Op Hip) stable. Patient B (Appy) requesting pain meds. Patient C (Thyroidectomy) assessing for tetany. Patient D (Lap Chole) vomiting." },
                    { "time": "09:30", "author": "Charge RN", "note": "Errors reported by family members regarding staff performace." }
                ],
                "vitals": [
                    { "time": "Pt A (Hip)", "tempF": "98.6", "hr": 80, "rr": 16, "bp": "120/80", "o2": "97", "o2_device": "RA", "pain": 3 },
                    { "time": "Pt C (Thyroid)", "tempF": "99.1", "hr": 92, "rr": 18, "bp": "130/85", "o2": "98", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the staff performance/feedback trend. Which actions require IMMEDIATE Registered Nurse intervention/correction?",
                "trendTable": {
                    "columns": ["Time", "Staff Member", "Observed Action", "Patient Context"],
                    "rows": [
                        ["08:15", "LPN", "Administering IV pushes of Morphine 4mg", "Pt B (Appy)"],
                        ["08:30", "UAP", "Assisting Pt A (Total Hip) to toilet without abduction pillow", "Pt A (Hip S/P Day 1)"],
                        ["08:45", "LPN", "Reinforcing surgical dressing deemed 'saturated'", "Pt D (Lap Chole)"],
                        ["09:00", "UAP", "Checking Chvostek's sign (facial twitch)", "Pt C (Thyroidectomy)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Halt the LPN from administering IV Push Morphine immediately", "isCorrect": true, "rationale": "IV Push medications are generally outside LPN scope (or require specific certification not stated). This is a safety method correction." },
                    { "id": "o2", "text": "Intervene with the UAP regarding the Total Hip precautions", "isCorrect": true, "rationale": "Dislocation risk is high; UAP requires education on specific positioning restrictions (abduction)." },
                    { "id": "o3", "text": "Stop the UAP from assessing Chvostek's sign", "isCorrect": true, "rationale": "Assessment (Provoking a reflex) is an RN function, not UAP task." },
                    { "id": "o4", "text": "Allow the LPN to continue reinforcing the saturated dressing", "isCorrect": false, "rationale": "While LPNs can reinforce, a 'saturated' dressing on a fresh post-op requires RN Assessment for hemorrhage." },
                    { "id": "o5", "text": "Report the LPN to the state board immediately", "isCorrect": false, "rationale": "Immediate correction first; reporting is a later administrative step if pattern persists." },
                    { "id": "o6", "text": "Reassign Patient B (Pain) to the UAP", "isCorrect": false, "rationale": "Pain management requires assessment and med administration (Licensed role)." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The scenario focuses on 'Supervision' and 'Correction'. The trend isn't vital signs, but a 'Trend of Performance Errors'. The RN must identify which actions cross the line of Scope of Practice or safety.",
                "optionReview": "Option 1 (IV Push) is UNSAFE execution by LPN. Option 2 (Hip Pillow) is UNSAFE execution by UAP. Option 3 (Chvostek) is OUT OF SCOPE (Assessment) by UAP. Option 4 (Saturated Dressing) requires RN assessment (Hemorrhage risk), so allowing LPN to just reinforce hides the problem. Option 5 is too extreme for a first intervention. Option 6 is incorrect delegation.",
                "clinicalLogic": "Supervision Rule: 1. Right Task? (Chvostek is Assessment = No for UAP). 2. Right Circumstance? (Hip Post-Op = High Risk of Dislocation). 3. Right Person? (LPN + IV Push = Usually No).",
                "strategy": "Identify the 'Fatal Flaw' in each row. Row 1: IV Push? (Scope). Row 2: Hip + No Pillow? (Safety). Row 3: Reinforce Saturated? (Assessment of Bleeding missed). Row 4: Reflex Check? (Assessment).",
                "knowledge": "LPN Scope: Stable patients, PO/IM/SubQ meds, Reinforce teaching, Sterile fields (simple), Insert Foleys. NO IV Push (usually), NO Admission Assessment, NO Blood products."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-LEGAL-U1V2",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Legal: Incident Reporting & Liability",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:47:00.000Z", // Sequential
            "updatedAt": "2026-01-23T18:47:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Generate Solutions",
            "clinicalFocusTopics": ["Legal Responsibility", "Documentation", "Erroneous Medication"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.K.", "age": 70, "gender": "M", "allergies": "Penicillin", "weightKg": 82, "codeStatus": "Full Code",
                    "admissionDate": "Today 10:00", "room": "ICU-2", "physician": "Dr. Cardio", "nurse": "RN Staff", "isolation": "Standard"
                },
                "setting": "ICU",
                "historyPhysical": {
                    "chiefComplaint": "Medication Error Sequence",
                    "hpi": "Patient admitted for AFib. IV Heparin started.",
                    "pmh": ["AFib", "Stroke hx"],
                    "medications": ["Heparin Drip", "Lisinopril"]
                },
                "history": [
                    { "time": "10:00", "author": "Pharmacy", "note": "Heparin 25,000 units in 250mL D5W sent to unit." },
                    { "time": "10:15", "author": "RN 1", "note": "Infusion started. Pump programmed at 1,000 units/hr (10mL/hr)." },
                    { "time": "12:00", "author": "RN 2 (Shift Change)", "note": "Pump found running at 100mL/hr (10,000 units/hr). Error identified. Infusion stopped." },
                    { "time": "12:15", "author": "MD", "note": "Notified. Orders: Protamine Sulfate STAT. PTT check." }
                ],
                "vitals": [
                    { "time": "10:00", "tempF": "98.6", "hr": 110, "rr": 20, "bp": "130/80", "o2": "96", "o2_device": "RA", "pain": 0 },
                    { "time": "12:00", "tempF": "98.6", "hr": 112, "rr": 22, "bp": "110/60", "o2": "95", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "aPTT", "value": "Pending", "flag": "-", "ref": "30-40", "unit": "sec" }
                ],
                "orders": [
                    { "order": "Protamine Sulfate 50mg IV Push", "status": "Active", "indication": "Heparin Reversal" },
                    { "order": "Incident Report", "status": "Required", "indication": "Patient Safety" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the medication error and documentation requirements. Which actions are legally required and appropriate for the nurse to perform?",
                "trendTable": {
                    "columns": ["Time", "Event", "Heparin Rate", "Patient Status"],
                    "rows": [
                        ["10:15", "Initiation", "1,000 units/hr (Ordered)", "Baseline"],
                        ["12:00", "Discovery", "10,000 units/hr (ACTUAL)", "BP 110/60 (Dropping)"],
                        ["12:15", "Intervention", "0 units/hr (Stopped)", "Protamine Ordered"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Document the facts of the error (Rate 10,000 units/hr found) in the medical record", "isCorrect": true, "rationale": "Factual documentation in the chart is mandatory." },
                    { "id": "o2", "text": "File an incident report and place a copy of it in the patient's chart", "isCorrect": false, "rationale": "NEVER place the incident report in the chart. It is an internal risk management document. Doing so makes it discoverable in court." },
                    { "id": "o3", "text": "Administer Protamine Sulfate immediately as ordered", "isCorrect": true, "rationale": "Clinical priority to reverse the overdose." },
                    { "id": "o4", "text": "Document 'Incident report filed' in the nursing notes", "isCorrect": false, "rationale": "Do NOT reference the incident report in the medical record for the same legal reasons." },
                    { "id": "o5", "text": "Assess the patient for signs of bleeding (gums, IV sites, hematuria)", "isCorrect": true, "rationale": "Standard of care assessment for heparin overdose." },
                    { "id": "o6", "text": "Notify the provider immediately", "isCorrect": true, "rationale": "Already done in scenario, but legally required." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "This is a classic 'Legal/Documentation' trap. The clinical error is a massive Heparin Overdose. The Legal trap is how to handle the 'Incident Report'.",
                "optionReview": "Option 1 (Doc facts) is Correct; chart what happened. Option 2 (Copy in chart) is CRITICAL FAIL; destroys attorney-client privilege protection of risk documents. Option 3 (Protamine) is Correct clinical rescue. Option 4 (Ref incident report) is CRITICAL FAIL; never mention the report in the chart. Option 5 (Assess) is Correct.",
                "clinicalLogic": "The distinction is between the 'Medical Record' (Patient care) and 'Risk Management' (Internal Quality). They must never cross. The chart is for the jury; the incident report is for the hospital lawyers/quality team.",
                "strategy": "Legal Rule #1: Never chart that an incident report was completed. Legal Rule #2: Chart the facts of the error (what was found, what was done), but not the administrative process.",
                "knowledge": "Protamine Sulfate reverses Heparin. Incident Reports are internal documents not part of the medical record."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-INFC-W3X4",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Infection Control & Room Assignment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:48:00.000Z", // Sequential
            "updatedAt": "2026-01-23T18:48:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Infection Control", "Isolation Precautions", "Cohorting"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Bed Management", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 15:00", "room": "Unit-Manager", "physician": "N/A", "nurse": "Charge RN", "isolation": "N/A"
                },
                "setting": "Pediatric Unit",
                "historyPhysical": {
                    "chiefComplaint": "Bed Crunch / Cohorting needed",
                    "hpi": "Unit is full. 3 Empty Double-Rooms available. 4 Admissions pending.",
                    "pmh": ["Immuno-compromised patients on unit"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "15:00", "author": "Admissions", "note": "Pending 1: Measles (Rubeola). Pending 2: RSV Bronchiolitis. Pending 3: Rotavirus (Diarrhea). Pending 4: Post-Op Appendectomy." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the microbiology trend of the incoming patients. Which room assignments and isolation precautions are SAFE?",
                "trendTable": {
                    "columns": ["Patient", "Diagnosis", "Transmission Mode", "Required Isolation"],
                    "rows": [
                        ["Pending 1", "Measles (Rubeola)", "Airborne", "Negative Pressure"],
                        ["Pending 2", "RSV", "Droplet/Contact", "Private/Cohort"],
                        ["Pending 3", "Rotavirus", "Contact (Fecal-Oral)", "Private/Cohort"],
                        ["Pending 4", "S/P Appy", "Standard", "None"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Assign the Measles patient to a private negative-pressure room", "isCorrect": true, "rationale": "Measles is Airborne. Negative pressure is mandatory." },
                    { "id": "o2", "text": "Cohort the RSV patient with the Rotavirus patient", "isCorrect": false, "rationale": "Cross-contamination risk. RSV is respiratory; Rotavirus is GI. Cannot cohort different infectious organisms." },
                    { "id": "o3", "text": "Assign the Post-Op Appy patient to the same room as the RSV patient", "isCorrect": false, "rationale": "Unsafe. Do not place a 'clean' surgical patient with an infectious patient." },
                    { "id": "o4", "text": "Place the RSV patient with another RSV-positive child if available", "isCorrect": true, "rationale": "Cohorting (same organism) is safe and appropriate when beds are limited." },
                    { "id": "o5", "text": "Wear an N95 respirator when entering the Measles patient's room", "isCorrect": true, "rationale": "Airborne precautions require N95." },
                    { "id": "o6", "text": "Assign a pregnant nurse to care for the Measles patient", "isCorrect": false, "rationale": "MMR is a live virus risk (if not immune) but generally TORCH infections (Rubella, CMV) are higher risk. However, best practice avoids assigning high-risk infectious cases (Shingles/Measles) to pregnant staff if avoidable." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "Room assignment detects knowledge of 'Transmission Based Precautions'. The core rule of cohorting: Same Organism = Yes. Different Organism = No. Clean + Dirty = No.",
                "optionReview": "Option 1 (Measles/Neg Press) is correct. Option 2 (RSV + Rota) is unsafe mix. Option 3 (Surg + RSV) is unsafe mix. Option 4 (RSV + RSV) is correct cohorting. Option 5 (N95) is correct PPE. Option 6 (Pregnant) is a safety consideration; usually avoided for rash illnesses (Rubella is the big one, but Measles is also risky).",
                "clinicalLogic": "Airborne = Measles, TB, Varicella (MTV). Needs N95 + Neg Air. Droplet = Influenza, Meningitis, Pertussis. Needs Mask. Contact = MRSA, C.Diff, Rota, RSV (plus Droplet). Needs Gown/Gloves.",
                "strategy": "Visualize the bugs flying in the room. Can the RSV bug jump to the Rotavirus kid? Yes. Then don't mix them.",
                "knowledge": "Cohorting Rule: You can only share a room if you share the bug."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-DISAS-Y5Z6",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Disaster Triage: Mass Casualty",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:49:00.000Z", // Sequential
            "updatedAt": "2026-01-23T18:49:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Disaster Triage", "START Protocol", "Resource Allocation"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Field Triage", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 16:00", "room": "Parking Lot", "physician": "N/A", "nurse": "Triage Officer", "isolation": "N/A"
                },
                "setting": "Disaster Scene (Bus Crash)",
                "historyPhysical": {
                    "chiefComplaint": "Mass Casualty Incident",
                    "hpi": "Bus rollover. 50+ victims. Resources overwhelmed. Nurse must apply color tags (Black, Red, Yellow, Green).",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "16:05", "author": "EMS", "note": "Scene safe. Triage begun." }
                ],
                "vitals": [
                    { "time": "Victim A", "tempF": "-", "hr": 130, "rr": 35, "bp": "-", "o2": "-", "o2_device": "-", "pain": "-" },
                    { "time": "Victim B", "tempF": "-", "hr": 0, "rr": 0, "bp": "-", "o2": "-", "o2_device": "-", "pain": "-" },
                    { "time": "Victim C", "tempF": "-", "hr": 90, "rr": 20, "bp": "110/70", "o2": "-", "o2_device": "-", "pain": "-" }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the victim data using the START disaster protocol. Which triage tags are correctly assigned?",
                "trendTable": {
                    "columns": ["Victim", "Respirations", "Perfusion", "Mental Status", "Injury"],
                    "rows": [
                        ["Victim A", "35/min", "Radical pulse present", "Confused", "Chest trauma"],
                        ["Victim B", "0/min", "No Pulse", "Unresponsive", "Head crush"],
                        ["Victim C", "20/min", "Cap refill < 2s", "Follows commands", "Open tib/fib fx"],
                        ["Victim D", "12/min", "Pulse present", "Unresponsive", "Head injury/Agonal"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Tag Victim A as RED (Immediate)", "isCorrect": true, "rationale": "RR > 30 is automatic RED in START protocol." },
                    { "id": "o2", "text": "Tag Victim B as BLACK (Morgue)", "isCorrect": true, "rationale": "No respirations after airway repositioning = Deceased." },
                    { "id": "o3", "text": "Tag Victim C as YELLOW (Delayed)", "isCorrect": true, "rationale": "RPM (Resp, Perf, Mental) are detailed as stable (30-2-Can Do). Broken bone is urgent but not dying immediately -> Yellow." },
                    { "id": "o4", "text": "Attempt CPR on Victim B for 2 minutes", "isCorrect": false, "rationale": "In Mass Casualty, NO CPR is performed. Doing so kills others by using resources." },
                    { "id": "o5", "text": "Tag Victim D as RED (Immediate)", "isCorrect": true, "rationale": "Unconscious/Can't follow commands = RED (Mental Status fail)." },
                    { "id": "o6", "text": "Direct Victim C to help organize the walking wounded", "isCorrect": false, "rationale": "Victim C has a broken leg (Open tib/fib) and cannot walk. They are not 'Green'." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The scenario shifts from 'ED Triage' (Save the most critical) to 'Disaster Triage' (Save the most salvageable). The START method (Simple Triage and Rapid Treatment) focuses on RPM: Respirations, Perfusion, Mental Status.",
                "optionReview": "Option 1 (RR > 30) = Red. Correct. Option 2 (Apnea) = Black. Correct. Option 3 (Stable vitals, open fx) = Yellow. Correct. Option 4 (CPR) -> NEVER in Disaster. Option 5 (Unresponsive) = Red. Correct. Option 6 (Walking) -> Can't walk -> Not Green.",
                "clinicalLogic": "START Algorithm: 1. Walk? Yes -> Green. 2. Breathe? No -> Reposition -> No -> Black. 3. RR > 30? Yes -> Red. 4. Perfusion > 2s? Yes -> Red. 5. Mental Status (Obey commands)? No -> Red. If pass all -> Yellow.",
                "strategy": "Memorize 30-2-Can Do. (RR < 30, Cap Refill < 2, Can Follow Commands). If you fail any one -> RED.",
                "knowledge": "Disaster Triage reverses normal logic. Cardiac arrest is dead (Black). Major trauma with stable vitals waits (Yellow)."
            }
        }
    }
];
