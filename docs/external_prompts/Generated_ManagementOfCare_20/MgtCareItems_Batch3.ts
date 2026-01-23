import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * PREMIUM MANAGEMENT OF CARE ITEMS (Batch 3: Items 8-11 of 20)
 * Topic: Management of Care (NCLEX Client Need)
 * Standards: Level 5, 3-Point Trends, 6-Option SATA, Expert Rationales
 */

export const MgtCareItems_Batch3: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-ORGAN-B7N8",
        "typeId": "trend",
        "metadata": {
            "title": "Organ Donation: Following Legal Protocols",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:30:00Z",
            "updatedAt": "2026-01-23T14:30:00Z",
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
            "clinicalFocusTopics": ["Organ Donation", "Legal Responsibilities", "Brain Death"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.L.", "age": 22, "gender": "Male", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Neurological Intensive Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Traumatic Brain Injury following a motor vehicle collision.",
                    "hpi": "Client has been in the ICU for 48 hours following severe head trauma. Despite aggressive decompression and ICP management, his neurological status has deteriorated.",
                    "pmh": ["None"],
                    "medications": ["Mannitol Infusion", "Hypertonic Saline"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "Neuro RN", "note": "GCS 6. ICP is 25 mmHg despite drainage. Pupils reactive to light." },
                    { "time": "Mon 2200", "author": "Neuro RN", "note": "GCS 3. Both pupils fixed and dilated (8mm). No cough or gag reflex present. ICP is 48 mmHg." },
                    { "time": "Tue 0200", "author": "MD Lee", "note": "Brain death testing initiated. Apnea test positive. No cerebral blood flow on nuclear scan. Client pronounced dead by two physicians." }
                ],
                "vitals": [
                    { "time": "Mon 1000", "tempF": "100.2", "hr": 110, "rr": 14, "bp": "144/82" },
                    { "time": "Mon 2200", "tempF": "98.4", "hr": 58, "rr": "Mechanical", "bp": "162/92" },
                    { "time": "Tue 0200", "tempF": "96.4", "hr": 62, "rr": "Mechanical", "bp": "94/52" }
                ],
                "labs": [],
                "orders": [
                    { "order": "Brain Death Protocol", "status": "Completed", "time": "0130" }
                ],
                "radiology": [
                    { "study": "Cerebral Blood Flow Study", "findings": "No blood flow detected past the internal carotid arteries.", "impression": "Findings consistent with brain death.", "date": "Tue 0100" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse reviews the clinical trend and the pronouncement of death. Which management of care actions are mandatory at this stage?",
                "options": [
                    { "id": "o1", "text": "Notify the local Organ Procurement Organization (OPO) immediately", "isCorrect": true, "rationale": "Federal law (Uniform Anatomical Gift Act) requires hospitals to notify the OPO for EVERY 'imminent' or 'actual' death." },
                    { "id": "o2", "text": "Approach the family to request organ donation personally", "isCorrect": false, "rationale": "Only specifically trained 'Designated Requestors' (usually OPO staff) should approach families to maximize success and follow legal ethics." },
                    { "id": "o3", "text": "Maintain BP and ventilation until the OPO evaluates the patient", "isCorrect": true, "rationale": "If a patient is a potential donor, physiological support must continue to ensure organ viability during the evaluation process." },
                    { "id": "o4", "text": "Review the medical record for a signed donor card or driver's license 'donor' status", "isCorrect": true, "rationale": "Determining the patient's 'First-Person Consent' status is a critical legal step in management of care." },
                    { "id": "o5", "text": "Provide emotional support to the grieving family", "isCorrect": true, "rationale": "Holistic management during death involves immediate crisis support for the next of kin." },
                    { "id": "o6", "text": "Contact the coroner/medical examiner (due to the trauma cause of death)", "isCorrect": true, "rationale": "Deaths due to trauma or accidents are coroner's cases and require specific legal notification and may impact which organs can be harvested." }
                ]
            },
            "rationale": {
                "coreConcept": "Organ Donation Protocols",
                "caseSummary": "A young patient with TBI undergoes brain death. The nurse must handle the legal and physiological 'handoff' to the OPO and the medical examiner.",
                "answerAnalysis": "Legal management includes OPO notify (o1), coroner notify (o6), donor status check (o4), and physiological maintenance (o3). approaching the family (o2) is an 'NCLEX Trap'—nurses don't ask; they call the pros.",
                "trap": "Thinking the nurse should be the one to 'ask for a kidney'. The RN's job is to call the OPO and keep the organs alive.",
                "goldenRule": "Notify OPO as soon as GCS is < 5 (even before death) to ensure the evaluation began on time.",
                "steps": [
                    { "tag": "Verify", "description": "Ensure brain death was pronounced by two physicians according to state law." },
                    { "tag": "Take Action", "description": "Call the OPO and do NOT turn off the ventilator until cleared." }
                ],
                "mnemonic": {
                    "title": "T.E.A.M. Donation",
                    "content": "T-Two Doctors (Pronounce), E-Evaluate (OPO), A-Anatomical Gift Act, M-Maintenance (Support)",
                    "explanation": "Summarizes the legal requirements."
                },
                "cheatSheet": {
                    "title": "Donation Laws",
                    "points": [
                        "Hospitals get $0 for donation (Ethical neutrality).",
                        "Family doesn't pay for the harvesting costs.",
                        "Religion is rarely a contraindication (Most support life-saving gifts)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Organs like the heart, liver, and kidneys are vascularized structures that require oxygenated blood until the moment of retrieval.",
                    "physiology": "Brain death leads to 'Diabetes Insipidus' and loss of vasomotor tone; high-dose vasopressors and fluid are needed to maintain MAP > 65 for organ perfusion.",
                    "pharm": "Vasopressin (ADH) is often used to treat the massive polyuria seen after the pituitary dies (Diabetes Insipidus)."
                },
                "difficulty": {
                    "score": 97,
                    "level": 5,
                    "label": "Legal/Expert Evaluation",
                    "clinicalStrategy": "Look for the answer that strictly follows Federal/CMS guidelines.",
                    "recommendedActions": ["Call OPO", "Call Coroner", "Comfort Family"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-REPORT-M1N2",
        "typeId": "trend",
        "metadata": {
            "title": "Management Strategy: Discovery of a Medication Error",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:35:00Z",
            "updatedAt": "2026-01-23T14:35:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Incident Reporting", "Medication Safety", "Risk Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.G.", "age": 60, "gender": "Female", "allergies": "None", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Floor",
                "historyPhysical": {
                    "chiefComplaint": "Evaluation of medication error.",
                    "hpi": "Client is being treated for Hypertensive Emergency. The nurse identifies an error that occurred during the night shift.",
                    "pmh": ["Hypertension", "Renal Insufficiency"],
                    "medications": ["Hydralazine 10mg IV PRN (Ordered)"]
                },
                "history": [
                    { "time": "Tue 0200", "author": "Night RN", "note": "Client BP 190/110. Administered Hydralazine per order. BP 170/100 30 mins later." },
                    { "time": "Tue 0800", "author": "Day RN", "note": "Performing shift count. Noticed that the Hydralazine vial from the night was '100mg/mL' instead of '10mg/mL'. 1.0mL was missing from the vial. The previous nurse likely administered 100mg instead of 10mg." }
                ],
                "vitals": [
                    { "time": "0200", "bp": "192/112", "hr": 88 },
                    { "time": "0300", "bp": "110/64", "hr": 102 },
                    { "time": "0800", "bp": "82/40", "hr": 118 }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the discovery of the error. What is the correct sequence of 'Management of Care' actions the nurse should take?",
                "options": [
                    { "id": "o1", "text": "Assess the client's current blood pressure and clinical status immediately", "isCorrect": true, "rationale": "Safety First. The nurse must determine if the patient is currently in shock (82/40) before performing administrative tasks." },
                    { "id": "o2", "text": "Notify the prescribing physician of the error and the patient's current vitals", "isCorrect": true, "rationale": "The MD must be informed so they can order reversals or supportive care." },
                    { "id": "o3", "text": "Fill out an internal Incident Report (Occurrence Report) per facility policy", "isCorrect": true, "rationale": "This is the primary tool for risk management and performance improvement." },
                    { "id": "o4", "text": "Document in the patient's medical record: 'Incident report filed'", "isCorrect": false, "rationale": "TRAP: Never mention the 'Incident Report' in the medical record; it is an internal administrative document, not part of the clinical chart." },
                    { "id": "o5", "text": "Notify the Nursing Supervisor (Charge Nurse) of the error", "isCorrect": true, "rationale": "Leadership must be aware of serious 'Sentinel' or high-harm events." },
                    { "id": "o6", "text": "Confront the night nurse immediately on the phone and demand an explanation", "isCorrect": false, "rationale": "Professional behavior focuses on patient safety and hierarchy first; confrontational behaviors are not part of the initial crisis management flow." }
                ]
            },
            "rationale": {
                "coreConcept": "Management of Clinical Errors",
                "caseSummary": "A patient received a 10x overdose of hydralazine. The nurse discovers the error as the patient becomes hypotensive. Sequential management is key.",
                "answerAnalysis": "Management of errors follows: 1) Client Safety (o1), 2) Communication (o2, o5), 3) Documentation (o3). o4 is a legal error; o6 is unprofessional.",
                "trap": "Mentioning the Incident Report in the medical chart (o4). This makes the report 'discoverable' in a lawsuit.",
                "goldenRule": "Priority: Patient > Physician > Supervisor > Incident Report.",
                "steps": [
                    { "tag": "Assess", "description": "Check the BP before doing anything else." },
                    { "tag": "Take Action", "description": "Call the MD and supervisor." }
                ],
                "mnemonic": {
                    "title": "A.C.T. Fast",
                    "content": "A-Assess patient, C-Call the team, T-Table the report",
                    "explanation": "Summarizes error management."
                },
                "cheatSheet": {
                    "title": "Incident Reporting",
                    "points": [
                        "Done for ANY variance in care (Falls, Meds, Injuries).",
                        "Not used for discipline (Just-Culture).",
                        "Confidential and internal."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The peripheral arteries dilate in response to Hydralazine.",
                    "physiology": "Hydralazine is a direct-acting vasodilator. An overdose leads to profound systemic vasodilation, dropping SVR and BP, causing reflex tachycardia.",
                    "pharm": "There is no direct reversal for Hydralazine; treatment is supportive with IV fluids and Vasopressors (e.g., Norepinephrine)."
                },
                "difficulty": {
                    "score": 93,
                    "level": 4,
                    "label": "Safety Evaluation",
                    "clinicalStrategy": "Always prioritize the patient's physical state over the paperwork.",
                    "recommendedActions": ["Stat bolus", "Notify MD", "File report"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-TRIAGE-D5H8",
        "typeId": "trend",
        "metadata": {
            "title": "Disaster Management: Mass Casualty Triage",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:40:00Z",
            "updatedAt": "2026-01-23T14:40:00Z",
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
            "clinicalFocusTopics": ["Disaster Triage", "Prioritization", "Emergency Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Mass Casualty Incident", "age": 0, "gender": "N/A"
                },
                "setting": "Field Triage / ED Parking Lot",
                "historyPhysical": {
                    "chiefComplaint": "Triage of multiple victims after a structural collapse.",
                    "hpi": "A local factory collapsed. 40 victims have arrived at once. The triage nurse uses the START (Simple Triage and Rapid Treatment) method to tag victims.",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "Victim 1", "author": "Triage RN", "note": "Walked from the rubble. Crying but speaking normally. Superficial abrasions." },
                    { "time": "Victim 2", "author": "Triage RN", "note": "Open femur fracture. BP 100/60. RR 24. Cap refill 2 seconds. Follows simple commands." },
                    { "time": "Victim 3", "author": "Triage RN", "note": "Sucking chest wound. RR 34. Weak, thready pulse. Cannot follow commands." },
                    { "time": "Victim 4", "author": "Triage RN", "note": "Massive head trauma. Exposed brain matter. No spontaneous respirations after airway opening." }
                ],
                "vitals": [
                    { "time": "Victim 3", "rr": 34, "hr": 140, "bp": "72/40" },
                    { "time": "Victim 2", "rr": 24, "hr": 105, "bp": "100/62" }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the victims using the START triage system. Which tag assignments are correct according to the clinical data provided?",
                "options": [
                    { "id": "o1", "text": "Victim 1: GREEN (Minor)", "isCorrect": true, "rationale": "Can walk and has minor injuries ('Walking wounded')." },
                    { "id": "o2", "text": "Victim 3: RED (Immediate)", "isCorrect": true, "rationale": "High RR (>30), thready pulse, and mental status changes indicate life-threatening but salvageable status." },
                    { "id": "o3", "text": "Victim 4: BLACK (Expectant)", "isCorrect": true, "rationale": "No respirations after simple airway maneuver and catastrophic head injury; resources are not spent on non-salvageable cases during a disaster." },
                    { "id": "o4", "text": "Victim 2: YELLOW (Delayed)", "isCorrect": true, "rationale": "Serious injury (femur fracture) but stable hemodynamics (RR < 30, Cap Refill < 2s, Follows commands). Care can wait 1-2 hours." },
                    { "id": "o5", "text": "Victim 3: BLACK (Expectant)", "isCorrect": false, "rationale": "Victim 3 is still breathing and has a pulse; they are 'Red', not 'Black'." },
                    { "id": "o6", "text": "Victim 2: RED (Immediate)", "isCorrect": false, "rationale": "Victim 2 is stable; tagging 'Yellow' victims as 'Red' wastes resources needed for the truly unstable." }
                ]
            },
            "rationale": {
                "coreConcept": "START Triage Principles",
                "caseSummary": "In a disaster, the nurse must quickly tag patients based on 30-2-Can Do (Respirations, Perfusion, Mental Status).",
                "answerAnalysis": "Correct Tags: Green (walks), Yellow (stable but broke), Red (unstable but salvageable), Black (dead/unsalvageable). Correct options are o1-o4.",
                "trap": "Thinking that a femur fracture (o4) makes someone 'Immediate'. In the field, if they are stable, they are Yellow. Sucking chest (o2) is always Red.",
                "goldenRule": "During mass casualty, 'The greatest good for the greatest number' means we do NOT resuscitate the dead (Black tags).",
                "steps": [
                    { "tag": "Apply", "description": "Use the 30-2-Can Do rule: RR < 30, Cap Refill < 2, Can follow commands = Yellow." },
                    { "tag": "Verify", "description": "Check if they can walk from the scene = Green." }
                ],
                "mnemonic": {
                    "title": "30-2-Can Do",
                    "content": "30-Respirations < 30, 2-Cap Refill < 2, Can Do-Follows commands",
                    "explanation": "The checklist for Yellow tag eligibility."
                },
                "cheatSheet": {
                    "title": "START Triage Tags",
                    "points": [
                        "Green: Minor (can walk).",
                        "Yellow: Delayed (stable, can't walk).",
                        "Red: Immediate (unstable, RR > 30, Refill > 2, No commands).",
                        "Black: Expectant (not breathing)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "A sucking chest wound involves the pleural space, leading to a tension pneumothorax where air enters but cannot leave.",
                    "physiology": "In shock, RR and HR increase to compensate for metabolic acidosis and low cardiac output.",
                    "pharm": "Minimal pharmacological intervention is performed in field triage; the focus is on stop-the-bleed and rapid transport."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Critical Decision Making",
                    "clinicalStrategy": "Strictly apply the START rules without letting emotion dictate tagging.",
                    "recommendedActions": ["Tag and move to next victim", "Direct greens to help others"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-COLLAB-F1G7",
        "typeId": "trend",
        "metadata": {
            "title": "Collaboration: Managing Resource Overload",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:45:00Z",
            "updatedAt": "2026-01-23T14:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Interdisciplinary Collaboration", "Resource Allocation", "Burnout Prevention"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Staffing Crisis", "age": 0, "gender": "N/A"
                },
                "setting": "High-Acuity ICU",
                "historyPhysical": {
                    "chiefComplaint": "Managing dangerous staffing ratios.",
                    "hpi": "The ICU is currently experiencing a peak in acuity. Multiple staff are on leave. The remaining nurses are overwhelmed.",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "0700", "author": "Charge RN", "note": "Unit at 100% capacity. 3 patients awaiting admission. Ratio is currently 1 nurse to 3 high-acuity patients (Target is 1:2)." },
                    { "time": "0900", "author": "Charge RN", "note": "Nurse A reports feeling unsafe. Patient B in Room 10 has deteriorating vitals. Nurse C is busy with a code in Room 14." },
                    { "time": "1100", "author": "Charge RN", "note": "Call made to the CNO. Divert status requested. Crisis staffing plan activated." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the management of the staffing crisis. Which actions by the Charge Nurse demonstrate effective interdisciplinary collaboration and resource management?",
                "options": [
                    { "id": "o1", "text": "Initiating 'Divert' status for the Emergency Department", "isCorrect": true, "rationale": "Stopping the 'Inflow' of new patients is a primary safety mechanism when capacity is reached." },
                    { "id": "o2", "text": "Requesting 'Helping Hands' or Float staff from lower-acuity units for non-ICU tasks", "isCorrect": true, "rationale": "Utilizing cross-trained staff for stable tasks (e.g., feeding, stocking, turning) offloads the ICU nurses." },
                    { "id": "o3", "text": "Assigning 4 high-acuity patients to the most experienced nurse to 'show they can handle it'", "isCorrect": false, "rationale": "This increases the risk of errors and burnout; it is a failure of resource management." },
                    { "id": "o4", "text": "Collaborating with Case Management to accelerate discharge of stable patients", "isCorrect": true, "rationale": "Emptying beds by transferring 'Step-down' candidates helps restore safe ratios." },
                    { "id": "o5", "text": "Implementing 'Crisis Standards of Care' (e.g., focused assessment only)", "isCorrect": true, "rationale": "In a true resource crisis, streamlining care to essential life-saving tasks is a recognized survival strategy." },
                    { "id": "o6", "text": "Asking staff to work an extra 4 hours without a break", "isCorrect": false, "rationale": "Fatigue leads to medical errors; management should focus on outside help, not overworking current staff." }
                ]
            },
            "rationale": {
                "coreConcept": "Resource and Personnel Management",
                "caseSummary": "The ICU is unsafe due to ratios. The Charge Nurse must use systems-level interventions (Divert, Discharge, Float) to restore safety.",
                "answerAnalysis": "Effective management focuses on system flow (o1, o4) and support (o2, o5). Exploiting staff (o3, o6) is a failure of leadership.",
                "trap": "Thinking that 'The Super Nurse' can handle anything. Even the best nurse cannot safely manage 3-4 ICU patients alone.",
                "goldenRule": "Safety is a system property, not an individual effort. If the system is broken, fix the flow.",
                "steps": [
                    { "tag": "Identify", "description": "Identify the 'Critical Saturation' point where care becomes unsafe." },
                    { "tag": "Take Action", "description": "Call the house supervisor to initiate divert status." }
                ],
                "mnemonic": {
                    "title": "D.I.S.C.",
                    "content": "D-Divert, I-Identify helpers, S-Streamline care, C-Coordination for discharge",
                    "explanation": "The four keys to managing unit saturation."
                },
                "cheatSheet": {
                    "title": "Staffing Safety",
                    "points": [
                        "ICU Target 1:1 or 1:2.",
                        "MedSurg Target 1:4 to 1:6.",
                        "Burnout is the #1 cause of nurse turnover."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 90,
                    "level": 4,
                    "label": "Systems Analysis",
                    "clinicalStrategy": "Choose the options that change the 'system' rather than just pushing people harder.",
                    "recommendedActions": ["Stop admissions", "Call Float pool", "Focus on ABCs"]
                }
            }
        }
    }
];
