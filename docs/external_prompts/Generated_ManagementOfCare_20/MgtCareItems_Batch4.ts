import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * PREMIUM MANAGEMENT OF CARE ITEMS (Batch 4: Items 12-15 of 20)
 * Topic: Management of Care (NCLEX Client Need)
 * Standards: Level 5, 3-Point Trends, 6-Option SATA, Expert Rationales
 */

export const MgtCareItems_Batch4: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-IMPLIED-K7L9",
        "typeId": "trend",
        "metadata": {
            "title": "Informed Consent: Applying Implied Consent",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:00:00Z",
            "updatedAt": "2026-01-23T15:00:00Z",
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
            "clinicalFocusTopics": ["Informed Consent", "Emergency Exceptions", "Implied Consent"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Unknown Male", "age": 30, "gender": "Male", "allergies": "Unknown", "weightKg": 80, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Trauma Bay",
                "historyPhysical": {
                    "chiefComplaint": "Gunshot wound to the abdomen.",
                    "hpi": "Client arrived via EMS after being found in an alley. No identification present. He is unconscious upon arrival. He is hemorrhaging internally.",
                    "pmh": ["Unknown"],
                    "medications": ["Unknown"]
                },
                "history": [
                    { "time": "1200", "author": "Trauma RN", "note": "Client unconscious on arrival. GCS 7. Massive abdominal distension. Multiple pressure dressings applied to entry/exit wounds." },
                    { "time": "1210", "author": "Trauma MD", "note": "FAST exam positive for massive intraperitoneal hemorrhage. Client requires immediate laparotomy to control bleeding. Attempts to locate family via police have failed." },
                    { "time": "1215", "author": "Trauma RN", "note": "BP dropping despite rapid infusion. Client taken to OR for life-saving surgery." }
                ],
                "vitals": [
                    { "time": "1200", "tempF": "97.8", "hr": 122, "rr": 26, "bp": "94/56", "o2": "92" },
                    { "time": "1215", "tempF": "96.5", "hr": 148, "rr": 32, "bp": "72/38", "o2": "88" }
                ],
                "labs": [
                    { "test": "Hgb", "value": "6.2", "flag": "L!", "ref": "14.0 - 18.0", "unit": "g/dL" }
                ],
                "radiology": [
                    { "study": "FAST Ultrasound", "findings": "Massive free fluid in all 4 quadrants.", "impression": "Hemorrhagic Shock / Grade IV Liver Laceration suspected.", "date": "1210" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The management team must decide on legal authorization for surgery. Which factors support the use of 'Implied Consent' in this scenario?",
                "options": [
                    { "id": "o1", "text": "The client is unconscious and unable to provide verbal or written consent", "isCorrect": true, "rationale": "Lack of decisional capacity is the first requirement for implied consent." },
                    { "id": "o2", "text": "Delay in treatment would result in death or serious permanent disability", "isCorrect": true, "rationale": "An emergency 'life or limb' situation is the primary legal justification for bypassing standard consent." },
                    { "id": "o3", "text": "Reasonable effort to locate a legal representative or family has failed", "isCorrect": true, "rationale": "The team must show due diligence in trying to find a surrogate before proceeding under implied consent." },
                    { "id": "o4", "text": "The surgeon 'feels' that the client would want the surgery", "isCorrect": false, "rationale": "Legal consent is based on protocol and objective urgency, not the subjective feeling or 'hunch' of the clinician." },
                    { "id": "o5", "text": "The situation qualifies as a 'Good Samaritan' act for the surgeon", "isCorrect": false, "rationale": "Good Samaritan laws protect clinicians in the FIELD/STREET, not during standard duties in a hospital setting." },
                    { "id": "o6", "text": "Documentation of the emergency necessity is completed in the medical record by the physician", "isCorrect": true, "rationale": "For implied consent to be legally valid, the clinical urgency and the inability to obtain consent must be clearly documented by the provider." }
                ]
            },
            "rationale": {
                "coreConcept": "Implied Consent in Emergencies",
                "caseSummary": "An unconscious trauma patient requires life-saving surgery. No family is found. Implied consent allows the team to proceed.",
                "answerAnalysis": "Implied consent requires 1) Capacity loss (o1), 2) High Urgency (o2), 3) No surrogate (o3), and 4) Clear Documentation (o6). o4/o5 are incorrect legal applications.",
                "trap": "Thinking you need to wait for a 'Court Order'. In a trauma code (82/40 BP), a court order takes too long. Implied consent is the law of the land for emergencies.",
                "goldenRule": "When death is imminent and the patient can't speak, the law presumes they would want life-saving care.",
                "steps": [
                    { "tag": "Verify", "description": "Check if a wallet or ID is present to look for Emergency Contact info." },
                    { "tag": "Document", "description": "Ensure the MD note explicitly states 'Emergency Laparotomy required via Implied Consent'." }
                ],
                "mnemonic": {
                    "title": "I.M.P.L.I.E.D.",
                    "content": "I-Incapacitated, M-Moribund (Near death), P-Provider documented, L-Life or limb, I-Immediate need, E-Effort to find kin, D-Due diligence",
                    "explanation": "Summarizes the emergency consent criteria."
                },
                "cheatSheet": {
                    "title": "Implied Consent Rules",
                    "points": [
                        "Applies to unconscious/mentally incompetent pts.",
                        "Must be life-threatening or risk of permanent harm.",
                        "Stops the moment a family member/surrogate appears."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The abdominal cavity can hold several liters of blood, leading to rapid exsanguination.",
                    "physiology": "Shock Stage III: Tachycardia (>140), Hypotension (<90 systolic), and altered mental status (GCS 7).",
                    "pharm": "Blood products (Massive Transfusion Protocol - MTP) are the primary pharmacological intervention, replacing clotting factors and RBCs."
                },
                "difficulty": {
                    "score": 97,
                    "level": 5,
                    "label": "Legal Analysis",
                    "clinicalStrategy": "Look for the answer that prioritizes 'Immediate Survival' over 'Paperwork'.",
                    "recommendedActions": ["Proceed to OR", "Continue search for kin", "Transfuse STAT"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ADVOC-C1V4",
        "typeId": "trend",
        "metadata": {
            "title": "Advocacy: Respecting Religious Blood Refusal",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:10:00Z",
            "updatedAt": "2026-01-23T15:10:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Advocacy", "Cultural Competence", "Patient Rights"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.M.", "age": 45, "gender": "Female", "allergies": "NKDA", "weightKg": 72, "codeStatus": "Full Code"
                },
                "setting": "Hematology / Oncology",
                "historyPhysical": {
                    "chiefComplaint": "Severe anemia due to uterine fibroids.",
                    "hpi": "Client is a Jehovah's Witness. She is experiencing heavy vaginal bleeding. Her hemoglobin is dropping rapidly. She is alert, oriented, and has absolute capacity. She has signed a 'No Blood' directive.",
                    "pmh": ["Uterine Fibroids", "Anemia"],
                    "medications": ["Ferrous Sulfate", "Epoetin Alfa"]
                },
                "history": [
                    { "time": "Mon 0800", "author": "RN Chen", "note": "Hgb is 8.2. Client stable. Reconfirms refusal of all blood products (Whole blood, RBCs, Plasma, Platelets)." },
                    { "time": "Mon 2000", "author": "RN Chen", "note": "Hgb is 6.1. Client is dizzy and pale. BP 100/60. MD orders 2 units of PRBCs." },
                    { "time": "Mon 2015", "author": "RN Chen", "note": "Client calmly refuses the transfusion. 'I would rather die than violate my faith. Please use other methods.'" }
                ],
                "vitals": [
                    { "time": "0800", "hr": 84, "bp": "120/80", "o2": "98" },
                    { "time": "2000", "hr": 112, "bp": "98/58", "o2": "94" }
                ],
                "labs": [
                    { "test": "Hemoglobin", "value": "6.1", "flag": "L!", "ref": "12.0 - 16.0", "unit": "g/dL" },
                    { "test": "Hematocrit", "value": "18", "flag": "L!", "ref": "36 - 48", "unit": "%" }
                ],
                "orders": [
                    { "order": "2 Units PRBCs STAT", "status": "Refused by Patient", "time": "2010" },
                    { "order": "Epoetin Alfa 40,000 units SQ", "status": "Active", "time": "2015" },
                    { "order": "Iron Sucrose IV", "status": "Active", "time": "2015" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the trend and the ethical dilemma. Which actions by the management team demonstrate respect for patient rights and advocacy?",
                "options": [
                    { "id": "o1", "text": "Honor the client's refusal of blood products despite the low Hgb", "isCorrect": true, "rationale": "Patient sovereignty and religious freedom allow a competent adult to refuse life-saving treatment." },
                    { "id": "o2", "text": "Administer the blood while the client is sleeping to avoid conflict", "isCorrect": false, "rationale": "This is Medical Battery and a gross violation of human rights and ethics." },
                    { "id": "o3", "text": "Implement 'Blood Conservation' strategies (e.g., Erythropoietin, IV Iron)", "isCorrect": true, "rationale": "Advocacy involves finding medically viable alternatives that align with the patient's values." },
                    { "id": "o4", "text": "Consult the Ethics Committee for support in managing the MD-Patient conflict", "isCorrect": true, "rationale": "Ethics committees help mediate when providers feel their duty to 'save' conflicts with the patient's refusal." },
                    { "id": "o5", "text": "Tell the client she is 'being selfish' to her family", "isCorrect": false, "rationale": "Non-therapeutic and coercive communication is unprofessional and unethical." },
                    { "id": "o6", "text": "Ensure the client has a signed 'Release from Liability' or 'Refusal of Blood' well-documented", "isCorrect": true, "rationale": "Protecting the hospital and staff legally requires a documented, signed refusal form specifically for the transfusion." }
                ]
            },
            "rationale": {
                "coreConcept": "Autonomy vs Beneficence",
                "caseSummary": "A Jehovah's Witness patient refuses life-saving blood. The nurse must advocate for her right to refuse while seeking religious-compatible alternatives.",
                "answerAnalysis": "Correct actions: Respect autonomy (o1), use alternatives (o3), involve ethics (o4), and document legal refusal (o6). Coercion (o5) and battery (o2) are strictly prohibited.",
                "trap": "Thinking that 'Life-saving' overrides 'Religion'. In competent adults, it does NOT. In minors, the state can sometimes intervene, but adults have the absolute right to refuse.",
                "goldenRule": "The patient is the captain of their ship. Even if they are sailing into a storm, the nurse must respect the course while providing lifeboats.",
                "steps": [
                    { "tag": "Verify", "description": "Ensure the patient is alert and not delirious (has capacity) before accepting the refusal." },
                    { "tag": "Advocate", "description": "Clarify with the patient which 'fractions' of blood (e.g., albumin, clotting factors) they might accept." }
                ],
                "mnemonic": {
                    "title": "F.A.I.T.H.",
                    "content": "F-Freedom of choice, A-Alternatives provided, I-Informed refusal, T-Team collaboration, H-Honoring beliefs",
                    "explanation": "Summarizes cultural advocacy."
                },
                "cheatSheet": {
                    "title": "Jehovah's Witness Care",
                    "points": [
                        "Refuse 4 main components: RBCs, WBCs, Platelets, Plasma.",
                        "Often accept: Dialysis, Cell Saver (continuous), Epoetin, Iron.",
                        "May accept 'Fractions' like Albumin or Immunoglobulins (Ask pt)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Uterine fibroids are benign tumors of the myometrium that cause significant menstrual hemorrhage.",
                    "physiology": "Anemia (Hgb 6.1) reduces the oxygen-carrying capacity of the blood, leading to tissue hypoxia and compensatory tachycardia.",
                    "pharm": "Epoetin Alfa stimulates the bone marrow to produce RBCs; Iron Sucrose provides the building blocks. These take days to work, unlike transfusion which is immediate."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Ethical Advocacy",
                    "clinicalStrategy": "The patient's 'Right to Refuse' is the strongest legal shield in nursing.",
                    "recommendedActions": ["Notify supervisor", "Offer erythropoietin", "Respect refusal"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-TASK-D1F3",
        "typeId": "trend",
        "metadata": {
            "title": "Delegation: Monitoring UAP Tasks",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:20:00Z",
            "updatedAt": "2026-01-23T15:20:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Delegation", "Unlicensed Assistive Personnel (UAP)", "Safety Monitoring"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.H.", "age": 80, "gender": "Female", "allergies": "NKDA", "weightKg": 60, "codeStatus": "Full Code"
                },
                "setting": "Acute Rehab",
                "historyPhysical": {
                    "chiefComplaint": "New Acute Stroke (Right CVA).",
                    "hpi": "Client is Day 1 post-stroke. She has left-sided weakness (Hemiplegia) and suspected dysphagia. Speech therapy has evaluated her but the final results are not in the chart. The RN assigned the UAP to assist the client with lunch.",
                    "pmh": ["Right CVA", "Hypertension", "Atrial Fibrillation"],
                    "medications": ["Aspirin", "Clopidogrel"]
                },
                "history": [
                    { "time": "1200", "author": "RN", "note": "Delegated lunch assistance to UAP. Instructed to keep patient sitting upright and report any coughing." },
                    { "time": "1215", "author": "UAP", "note": "Patient is eating. She seems a bit sleepy. She is slow to swallow." },
                    { "time": "1225", "author": "UAP", "note": "Patient is 'gurgling' when she talks and has food sitting in her left cheek. She stopped eating." }
                ],
                "vitals": [
                    { "time": "1200", "hr": 82, "rr": 18, "bp": "130/80", "o2": "98" },
                    { "time": "1230", "hr": 104, "rr": 26, "bp": "142/90", "o2": "91" }
                ],
                "labs": [],
                "orders": [
                    { "order": "NPO until Speech Evaluation", "status": "Found in Chart (1230)", "time": "1100" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The RN evaluates the 30-minute trend and the chart data. Which mistakes were made in the 'Management of Care' for this client?",
                "options": [
                    { "id": "o1", "text": "Delegating the 'First Meal' after a new stroke to a UAP", "isCorrect": true, "rationale": "High-risk assessments (swallowing after neuro-insult) must be performed by the RN first." },
                    { "id": "o2", "text": "Failure to check the EHR for current 'Diet' orders before the meal", "isCorrect": true, "rationale": "The NPO order was in the chart at 1100 but ignored until 1230." },
                    { "id": "o3", "text": "The UAP failed to recognize 'Silent Aspiration' until the gurgling started", "isCorrect": true, "rationale": "UAPs may lack the clinical knowledge to identify'pocketing' or 'gurgling' as late signs of aspiration." },
                    { "id": "o4", "text": "Instruction to 'Keep patient sitting upright' was a delegation error", "isCorrect": false, "rationale": "This is a correct, standard safety instruction for a UAP." },
                    { "id": "o5", "text": "The RN should have supervised the first 5-10 minutes of the feed", "isCorrect": true, "rationale": "Delegation requires oversight, especially for new, high-risk tasks." },
                    { "id": "o6", "text": "Delegating to a UAP is never allowed for stroke patients", "isCorrect": false, "rationale": "UAPs can care for stroke patients, but only once the patient is stable and the RN has performed the primary assessment." }
                ]
            },
            "rationale": {
                "coreConcept": "Safe Delegation Logic",
                "caseSummary": "A fresh stroke patient is fed by a UAP despite an NPO order and high risk. The trend shows aspiration starting (gurgling, O2 drop).",
                "answerAnalysis": "Errors: 1) Wrong Task (First feed is RN, o1), 2) Wrong Order verification (o2), 3) Knowledge gap (o3), 4) Lack of oversight (o5). o4/o6 are incorrect critiques.",
                "trap": "Thinking UAPs 'cannot feed' patients. They can, but NOT 'new' stroke patients who haven't been cleared by RN/SLP.",
                "goldenRule": "Delegation is NOT 'abdication'. If it's the first time, the RN does it or watches it.",
                "steps": [
                    { "tag": "Verify", "description": "Always check for Diet orders (NPO/Liquids) before every meal delivery." },
                    { "tag": "Assess", "description": "Watch for 'Pocketing' of food in the paralyzed cheek (Hemiplegia)." }
                ],
                "mnemonic": {
                    "title": "5 Rights of Delegation",
                    "content": "Right Task, Right Circumstance, Right Person, Right Direction, Right Supervision",
                    "explanation": "Must all be met for safe management."
                },
                "cheatSheet": {
                    "title": "UAP 'No-Go's",
                    "points": [
                        "Medication administration.",
                        "Initial assessments.",
                        "Sterile procedures.",
                        "Emergency interventions."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Cranial nerves IX (Glossopharyngeal) and X (Vagus) are often compromised in stroke, leading to dysphagia.",
                    "physiology": "Aspiration occurs when food/saliva enters the trachea. 'Gurgling' is the sound of air passing through pool of glotto-pharyngeal secretions.",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "Safety Analysis",
                    "clinicalStrategy": "New Stroke = High Risk = RN Only for ABC tasks (Feeding).",
                    "recommendedActions": ["Stop feed", "Suction STAT", "Keep NPO"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ABAND-A5B6",
        "typeId": "trend",
        "metadata": {
            "title": "Legal Responsibilities: Abandonment vs Refusal",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:30:00Z",
            "updatedAt": "2026-01-23T15:30:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 94,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Legal Responsibility", "Patient Abandonment", "Professional Boundaries"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Diverse Assignments", "age": 0, "gender": "N/A"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Managing unit assignments and legal handoffs.",
                    "hpi": "A staff nurse arrives for her shift. She is given an assignment of 4 patients. The trend of her actions is analyzed for legal and ethical compliance.",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "0700", "author": "Charge RN", "note": "Nurse A arrives. Hand-off report begins for 4 patients. Nurse A accepts the hand-off and starts reviewing the chart for Room 1." },
                    { "time": "0715", "author": "Charge RN", "note": "Nurse A discovers the patient in Room 1 is her ex-husband. She tells the Charge Nurse: 'I cannot take this patient. You MUST change my assignment immediately.'" },
                    { "time": "0730", "author": "Charge RN", "note": "Charge Nurse says 'I will look for a swap, but you must stay with him until then.' Nurse A says 'No, I'm out,' and walks off the unit and drives home without giving report to anyone." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the trend of Nurse A's behavior. Which factors indicate that 'Client Abandonment' has occurred and may lead to board disciplinary action?",
                "options": [
                    { "id": "o1", "text": "Nurse A accepted the assignment and began receiving report (Establishment of Duty)", "isCorrect": true, "rationale": "Abandonment occurs once a nurse-patient relationship 'Duty' has been established through acceptance of report." },
                    { "id": "o2", "text": "Nurse A left the unit without providing a hand-off report to a qualified professional", "isCorrect": true, "rationale": "Leaving patients without a qualified successor is the legal definition of abandonment." },
                    { "id": "o3", "text": "The patient was an 'Ex-Husband' (Conflict of interest)", "isCorrect": false, "rationale": "While a valid reason to *request* reassignment, a personal conflict does not legalize abandonment of an established duty." },
                    { "id": "o4", "text": "Abandonment occurred because she 'Refused' the assignment before report was given", "isCorrect": false, "rationale": "If she had refused *before* taking the keys/report, it would be an 'Assignment Refusal' (Employment issue), not 'Abandonment' (Patient Safety issue)." },
                    { "id": "o5", "text": "The nurse failed to maintain the 'Continuity of Care' for the assigned group", "isCorrect": true, "rationale": "Leaving mid-shift without a handoff jeopardizes the safety of every patient in the group." },
                    { "id": "o6", "text": "Board action is likely because she left during 'Crisis' (Emergency Department setting)", "isCorrect": true, "rationale": "Leaving a high-acuity/emergency setting without coverage increases the legal severity of the abandonment." }
                ]
            },
            "rationale": {
                "coreConcept": "Patient Abandonment vs Assignment Refusal",
                "caseSummary": "A nurse takes report, then discovers a conflict and leaves the hospital without handing off. This is abandonment.",
                "answerAnalysis": "Abandonment requires 1) Accepted Duty (o1), 2) Lack of handoff (o2, o5), and 3) Settings of risk (o6). Refusing *before* report (o4) is not abandonment.",
                "trap": "Thinking that a 'Conflict of Interest' (o3) justifies leaving. You must stay until a replacement is found once you've taken report.",
                "goldenRule": "Report = Responsibility. Once you have the info, you have the duty.",
                "steps": [
                    { "tag": "Differentiate", "description": "Separate 'Employment disputes' from 'Nursing Board violations'." },
                    { "tag": "Verify", "description": "Confirm if a handoff report was given to the Charge Nurse or a peer." }
                ],
                "mnemonic": {
                    "title": "A.B.E.L.",
                    "content": "A-Accepted report, B-Breadth of duty established, E-Exit without handoff, L-Leaving patient unsafe",
                    "explanation": "Summarizes the elements of abandonment."
                },
                "cheatSheet": {
                    "title": "Refusal vs Abandonment",
                    "points": [
                        "Refusal: I won't take this patient (Before report).",
                        "Abandonment: I'm leaving now (After report).",
                        "Conflict? Tell the charge nurse BEFORE taking report."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 94,
                    "level": 5,
                    "label": "Legal Standards",
                    "clinicalStrategy": "Identify the 'moment of handoff' as the legal starting line.",
                    "recommendedActions": ["Stay with patient", "Document refusal of future tasks", "Wait for replacement"]
                }
            }
        }
    }
];
