import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 4: Items 13-16)
 * Focus: Disaster Triage, Staffing, Malpractice, Team Roles
 */

export const MgtCareItems_Final_Batch4: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-START-U2I3",
        "typeId": "trend",
        "metadata": {
            "title": "Mass Casualty Triage (START Method)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:10:00Z",
            "updatedAt": "2026-01-23T18:10:00Z",
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
            "clinicalFocusTopics": ["Disaster Triage", "START Method", "Mass Casualty"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Disaster Group", "age": 0, "gender": "O", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Outdoor MCI Site (Bus Accident)",
                "historyPhysical": {
                    "chiefComplaint": "Multiple blunt force and penetrating trauma cases.",
                    "hpi": "A multi-casualty incident has occurred involving 12 victims. The nurse is performing triage using the START (Simple Triage and Rapid Treatment) method. Resources are limited; transport is 20 minutes away.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "T+0", "author": "Triage RN", "note": "Arrived on scene. 12 victims identified. Initial shout: 'Anyone who can walk, move to the green flag area'." }
                ],
                "vitals": [
                    { "time": "Victim 1", "tempF": "N/A", "hr": 140, "rr": 38, "bp": "Unk", "o2": "85", "o2_device": "RA", "pain": 10, "note": "Unconscious, breathing at rate 38." },
                    { "time": "Victim 2", "tempF": "N/A", "hr": 110, "rr": 20, "bp": "Unk", "o2": "98", "o2_device": "RA", "pain": 8, "note": "Alert, large compound fracture, following commands." },
                    { "time": "Victim 3", "tempF": "N/A", "hr": 0, "rr": 0, "bp": "Unk", "o2": "N/A", "o2_device": "N/A", "pain": 0, "note": "No resp after airway positioning. No pulse." }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the START triage criteria. Which color-tag assignments are correct for these victims?",
                "options": [
                    { "id": "o1", "text": "Assign Victim 1 (RR 38, Unconscious) a RED (Immediate) tag", "isCorrect": true, "rationale": "RR > 30 or altered mental status in the START algorithm triggers a Red (Immediate) tag." },
                    { "id": "o2", "text": "Assign Victim 2 (Limb fracture, Alert) a YELLOW (Delayed) tag", "isCorrect": true, "rationale": "Victims with significant injuries who can wait 1-2 hours and follow commands (RPM: Respirations <30, Pulse <120, Mentation OK) are tagged Yellow." },
                    { "id": "o3", "text": "Assign Victim 3 (No respiration/pulse) a BLACK (Expectant) tag", "isCorrect": true, "rationale": "In a mass casualty, if the airway is opened and there is no breathing, the victim is tagged Black to save resources for the salvageable." },
                    { "id": "o4", "text": "Assign victims who moved to the green flag area a GREEN (Minor/Walking Wounded) tag", "isCorrect": true, "rationale": "The first step in START is to clear the 'Walking Wounded' with a Green tag." },
                    { "id": "o5", "text": "Prioritize Victim 3 for the first available ambulance because they are pulseless", "isCorrect": false, "rationale": "In an MCI, pulseless victims (Black) are the 'last' priority; Red tags (Immediate) get the first ambulance." },
                    { "id": "o6", "text": "Initiate CPR on Victim 3 until more responders arrive", "isCorrect": false, "rationale": "CPR is NOT performed in mass casualty triage; it consumes too many resources and compromises the survival of others." }
                ]
            },
            "rationale": {
                "coreConcept": "START Triage Algorithm",
                "caseSummary": "Bus accident triage. Nurse must apply the RPM (Respirations, Perfusion, Mentation) filter to tag victims.",
                "answerAnalysis": "Correct Tags: o1 (Red - RR>30), o2 (Yellow), o3 (Black - No RR), o4 (Green - Walking). o5/o6 represent 'Daily Triage' thinking which is incorrect in an MCI.",
                "trap": "Applying 'ED Triage' to a 'Disaster'. In an ED, pulseless gets priority. In a Disaster, the salvageable Red tag gets priority.",
                "goldenRule": "Do the greatest good for the greatest number.",
                "steps": [
                    { "tag": "Assess", "description": "Check RPM: Respirations (<30?), Perfusion (Radial pulse?), Mentation (Follow commands?)." },
                    { "tag": "Tag", "description": "Apply the color tag and move to the next victim." }
                ],
                "mnemonic": {
                    "title": "30 - 2 - Can Do",
                    "content": "30 (RR <30), 2 (Cap refill <2s), Can Do (Follows commands)",
                    "explanation": "If any are failed, tag RED."
                },
                "cheatSheet": {
                    "title": "Tag Meanings",
                    "points": [
                        "Red: Immediate (Life-saving care needed).",
                        "Yellow: Delayed (Stable for now).",
                        "Green: Minor (Can wait indefinitely).",
                        "Black: Deceased/Expectant."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Airway positioning is the only intervention allowed during MCI triage.",
                    "physiology": "RR > 30 indicates severe respiratory distress or metabolic acidosis (shock).",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Triage",
                    "clinicalStrategy": "Differentiate between 'Survival' and 'Salvageability'.",
                    "recommendedActions": ["Tag Red", "Move to next victim"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-LIABL-W4X5",
        "typeId": "trend",
        "metadata": {
            "title": "Legal Liability & Elements of Malpractice",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:15:00Z",
            "updatedAt": "2026-01-23T18:15:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Malpractice", "Negligence", "Legal Elements"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.S.", "age": 62, "gender": "Female", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Neurology Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Wrong-site medication injection lawsuit review.",
                    "hpi": "Lawsuit Review: The nurse was ordered to give an IM injection of B12 into the gluteus. The nurse mistakenly injected it into the deltoid. There was no physical injury or nerve damage to the patient, but the patient is suing for $500,000 for 'malpractice'.",
                    "pmh": ["N/A"],
                    "medications": ["Vitamin B12"]
                },
                "history": [
                    { "time": "Incident", "author": "RN Blue", "note": "Gave B12 in right deltoid. Realized order was for gluteus. Notified patient." },
                    { "time": "Follow-up", "author": "MD", "note": "Patient examined. No swelling, bruising, or nerve deficit noted." }
                ],
                "vitals": [],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the 4 elements of negligence/malpractice. Which conclusions are correct regarding this legal case?",
                "options": [
                    { "id": "o1", "text": "A 'Duty' existed because the nurse-patient relationship was established", "isCorrect": true, "rationale": "The first element of malpractice is the legal duty to provide care based on an established relationship." },
                    { "id": "o2", "text": "A 'Breach of Duty' occurred because the nurse failed to follow the medical order (wrong site)", "isCorrect": true, "rationale": "Failure to meet the standard of care (order) is a breach of duty." },
                    { "id": "o3", "text": "The element of 'Injury/Damages' is missing in this case", "isCorrect": true, "rationale": "Malpractice requires physical or structural injury. If there is no harm, the lawsuit generally fails even if a mistake was made." },
                    { "id": "o4", "text": "The element of 'Causation' cannot be proven because there is no injury to link to the breach", "isCorrect": true, "rationale": "Causation requires that the breach *directly* caused a specific harm." },
                    { "id": "o5", "text": "The nurse is guaranteed to lose the case because a medication error occurred", "isCorrect": false, "rationale": "An error alone does not equal malpractice; all 4 elements (Duty, Breach, Injury, Causation) must be proven." },
                    { "id": "o6", "text": "The nurse should still file an incident report even if there was no injury", "isCorrect": true, "rationale": "Internal reporting is for safety/quality improvement, regardless of the legal outcome." }
                ]
            },
            "rationale": {
                "coreConcept": "Four Elements of Malpractice",
                "caseSummary": "Nurse made a mistake (Wrong site) but caused no harm. Case review based on the 4 legal pillars.",
                "answerAnalysis": "Correct legal elements: o1 (Duty), o2 (Breach), o3 (Damages-Missing), o4 (Causation-Missing), o6 (Internal policy). o5 is a common misunderstanding of 'Strict Liability'.",
                "trap": "Thinking 'Error = Malpractice'. Malpractice = Error + Harm.",
                "goldenRule": "No harm, no foul (legally), but still an incident (professionally).",
                "steps": [
                    { "tag": "Verify", "description": "Identify if all 4 elements are present." },
                    { "tag": "Chart", "description": "Document the error and the patient's reaction/status objectively." }
                ],
                "mnemonic": {
                    "title": "D.B.I.C.",
                    "content": "Duty, Breach, Injury, Causation",
                    "explanation": "The four required elements for malpractice."
                },
                "cheatSheet": {
                    "title": "Standards of Care",
                    "points": [
                        "State Nurse Practice Act.",
                        "Professional Org (ANA) guidelines.",
                        "Hospital Policy/Procedure manuals.",
                        "Textbooks/Clinical journals."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Deltoid can typically hold up to 1-2 mL of fluid; gluteal muscles can hold 3-5 mL.",
                    "physiology": "N/A",
                    "pharm": "Vitamin B12 (Cyanocobalamin) is water-soluble and highly safe."
                },
                "difficulty": {
                    "score": 75,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Search for 'Injury' as the deciding factor in legal cases.",
                    "recommendedActions": ["File Incident Report", "Evaluate Injection site"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-STAFG-Y7Z8",
        "typeId": "trend",
        "metadata": {
            "title": "Staffing assignment and Floating",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:20:00Z",
            "updatedAt": "2026-01-23T18:20:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 94,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Staffing", "Floating", "Competency"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N/A - Multiple", "age": 0, "gender": "O", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Pediatric Step-down Unit",
                "historyPhysical": {
                    "chiefComplaint": "Floating an Adult Med-Surg nurse to Peds.",
                    "hpi": "An adult Med-Surg RN has been 'floated' to the Pediatric floor to cover a staffing crisis. The Med-Surg RN has never worked with pediatric patients but has 10 years of adult experience. The charge nurse is making assignments.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "0700", "author": "Charge RN", "note": "Float RN Smith arrived. Orienting to unit layout. Assessing competency." }
                ],
                "vitals": [],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the legal and safety risks of floating. Which patients are most appropriate for the Charge Nurse to assign to the 'Float' Adult nurse?",
                "options": [
                    { "id": "o1", "text": "16-year-old following an appendectomy (stable)", "isCorrect": true, "rationale": "Adolescents are physiologically similar to adults; a stable post-op case matches the float nurse's background." },
                    { "id": "o2", "text": "8-month-old with cleft lip repair receiving syringe feedings", "isCorrect": false, "rationale": "Requires specialized pediatric surgical nursing and feeding techniques; unsafe for a general adult nurse." },
                    { "id": "o3", "text": "10-year-old with Diabetes Mellitus being taught insulin pump use", "isCorrect": false, "rationale": "Pediatric dosing and pump technology are high-risk; the float nurse lacks the specialized pediatric teaching competency." },
                    { "id": "o4", "text": "14-year-old with Cystic Fibrosis requiring routine IV antibiotics", "isCorrect": true, "rationale": "High-school aged patient with a stable, routine medical task (IV meds) that is common in adult Med-Surg." },
                    { "id": "o5", "text": "3-year-old with tetralogy of Fallot having a 'tet spell'", "isCorrect": false, "rationale": "Peds cardiac emergency; highly complex and requires expert pediatric intervention." },
                    { "id": "o6", "text": "Ensure the Float nurse is assigned an experienced Pediatric 'Buddy' for the shift", "isCorrect": true, "rationale": "Providing a resource/mentor is a standard of care for float staff to ensure safety." }
                ]
            },
            "rationale": {
                "coreConcept": "Safe Floating Assignments",
                "caseSummary": "Adult nurse in a Pediatric world. Assignment must match the nurse's 'Cross-Competency'.",
                "answerAnalysis": "Correct: o1 (High school/Adult like), o4 (Teenager/Routine task), o6 (Safety net). Incorrect: o2, o3, o5 (Highly specific pediatric physiology or technology).",
                "trap": "Believing a Med-Surg nurse can't work in Peds. They can, but only with 'Adult-like' children and 'Simple' tasks.",
                "goldenRule": "Match the Nurse's Skill to the Patient's Age/Complexity.",
                "steps": [
                    { "tag": "Assess", "description": "Ask the float nurse about their 'Comfort' and 'Competency' check-list." },
                    { "tag": "Filter", "description": "Filter out infants and specialized congenital cases." }
                ],
                "mnemonic": {
                    "title": "A.S.A.P.",
                    "content": "Age (Older), Stability (Stable), Assessment (Simple), Proctor (Buddied up)",
                    "explanation": "Criteria for a float assignment."
                },
                "cheatSheet": {
                    "title": "Float Nurse Rights",
                    "points": [
                        "Right to refuse a task for which they are not competent.",
                        "Right to an orientation to unit safety (Code calls, fire).",
                        "Right to a resource person."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Pediatric airways are smaller and more anterior.",
                    "physiology": "Pediatric renal function is immature; drug calculation based on weight is critical.",
                    "pharm": "Weight-based dosing (mg/kg) is the standard in Peds, whereas fixed dosing is common in Adults."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Assignment Analysis",
                    "clinicalStrategy": "Pick the 'Oldest' and 'Stablest' patients for the float nurse.",
                    "recommendedActions": ["Assign adolescent patient", "Provide unit buddy"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ROLES-A1C2",
        "typeId": "trend",
        "metadata": {
            "title": "Interprofessional Roles: Case Mgmt vs Social Work",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:25:00Z",
            "updatedAt": "2026-01-23T18:25:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Interprofessional Team", "Social Work", "Case Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "H.G.", "age": 39, "gender": "Male", "allergies": "N/A", "weightKg": 80, "codeStatus": "Full Code"
                },
                "setting": "Acute Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Social and financial barriers to discharge.",
                    "hpi": "Client is being discharged after a psychiatric crisis. He is homeless, has no insurance, and is currently experiencing food instability. He also needs long-term medication management for Schizophrenia and a coordinate plan for follow-up appts.",
                    "pmh": ["Schizophrenia", "Substance Use Disorder"],
                    "medications": ["Risperidone", "Benztropine"]
                },
                "history": [
                    { "time": "Day 1", "author": "RN Rivera", "note": "Patient stable. Discharge planning initiated. High social risk factors identified." }
                ],
                "vitals": [],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the team roles. Which tasks should the nurse specifically refer to a Social Worker versus a Case Manager?",
                "options": [
                    { "id": "o1", "text": "Refer to Social Worker: Locating a local homeless shelter with an open bed", "isCorrect": true, "rationale": "Connecting patients with community resources (housing, food, shelters) is a primary Social Work function." },
                    { "id": "o2", "text": "Refer to Case Manager: Evaluating the patient's readiness for discharge based on clinical stability", "isCorrect": true, "rationale": "Case managers (often RNs) focus on the clinical progression and 'readiness' for the next level of care." },
                    { "id": "o3", "text": "Refer to Social Worker: Managing the family's emotional distress regarding the diagnosis", "isCorrect": true, "rationale": "Couseling and psychosocial support are core Social Work competencies." },
                    { "id": "o4", "text": "Refer to Case Manager: Arranging for durable medical equipment (DME) to be delivered to the shelter", "isCorrect": true, "rationale": "Case managers coordinate the procurement of medical resources/supplies." },
                    { "id": "o5", "text": "Refer to Social Worker: Investigating rumors of elder abuse from the patient's previous landlord", "isCorrect": true, "rationale": "Social workers are the leads for investigating and reporting abuse/neglect cases." },
                    { "id": "o6", "text": "Refer to Case Manager: Educating the patient on the side effects of Risperidone", "isCorrect": false, "rationale": "Medication education is a Nursing and Pharmacy role, not a Case Manager's administrative role." }
                ]
            },
            "rationale": {
                "coreConcept": "Social Work vs Case Management",
                "caseSummary": "Complex psychosocial and clinical case. Nurse must delegate to the 'Specialist' on the team.",
                "answerAnalysis": "Social Work (Psychosocial/Community): o1, o3, o5. Case Mgmt (Clinical/Logistical): o2, o4. Nurse/Pharm: o6.",
                "trap": "Thinking Case Managers do counseling. They manage 'Processes' and 'Resources'. Social Workers manage 'People' and 'Societal Barriers'.",
                "goldenRule": "Social Work = Community/Crisis/Counseling. Case Management = Clinical/Coordination/Cost.",
                "steps": [
                    { "tag": "Identify", "description": "Is the problem 'Clinical' or 'Psychosocial'?" },
                    { "tag": "Assign", "description": "Refer to the appropriate discipline." }
                ],
                "mnemonic": {
                    "title": "C vs S",
                    "content": "C-Clinical & Cost (Case Mgr), S-Social & Society (Social Work)",
                    "explanation": "Easiest way to keep the roles straight."
                },
                "cheatSheet": {
                    "title": "Social Work Only",
                    "points": [
                        "CPS/APS (Abuse cases).",
                        "Financial assistance / Insurance enrollment assistance.",
                        "Grief/Bereavement counseling.",
                        "Housing/Shelter/Community food."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "Risperidone is a second-generation antipsychotic."
                },
                "difficulty": {
                    "score": 70,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Match the 'Need' to the 'Team Title'.",
                    "recommendedActions": ["Request SW for housing", "Request CM for coordinator"]
                }
            }
        }
    }
];
