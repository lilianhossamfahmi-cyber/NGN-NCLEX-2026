import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 5: Items 17-20)
 * Focus: Organ Donation, Client Rights, Performance Improvement, Peer Review
 */

export const MgtCareItems_Final_Batch5: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-ORGAN-L9M0",
        "typeId": "trend",
        "metadata": {
            "title": "Organ Procurement and Request Responsibilities",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:30:00Z",
            "updatedAt": "2026-01-23T18:30:00Z",
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
            "clinicalFocusTopics": ["Organ Donation", "Legal Protocols", "Hospice/End-of-life"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "D.W.", "age": 48, "gender": "Male", "allergies": "NKDA", "weightKg": 85, "codeStatus": "Currently Intubated/Post-Cardiac Arrest"
                },
                "setting": "Neurology ICU",
                "historyPhysical": {
                    "chiefComplaint": "Brain death determination pending.",
                    "hpi": "The client suffered a massive anoxic brain injury following a 20-minute cardiac arrest. He has been declared brain dead by two independent physicians according to hospital policy. He is on a ventilator and multiple pressors.",
                    "pmh": ["Hypertension"],
                    "medications": ["Norepinephrine", "Vasopressin"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "MD", "note": "Brain death testing (Apnea test, Brain blood flow) completed. Patient meets criteria for legal death." },
                    { "time": "Mon 1100", "author": "RN Rivera", "note": "Wife and children notified of brain death. Family is in significant distress. Discussion regarding next steps pending." }
                ],
                "vitals": [
                    { "time": "Mon 1100", "tempF": "96.4", "hr": 68, "rr": "14 (Vent)", "bp": "94/52", "o2": "100", "o2_device": "SIMV 100%", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the nurse's role in the organ procurement process. Which actions must the nurse perform based on federal and ethical guidelines?",
                "options": [
                    { "id": "o1", "text": "Notify the local Organ Procurement Organization (OPO) immediately following the brain death declaration", "isCorrect": true, "rationale": "Federal law (CMS) mandates that the hospital notify the OPO for all deaths or imminent deaths." },
                    { "id": "o2", "text": "Explain the donation process and the patient's registration status to the family", "isCorrect": false, "rationale": "Only a 'Designated Requestor' (OPO staff) should discuss organ donation with the family to avoid conflicts of interest and ensure expertise." },
                    { "id": "o3", "text": "Maintain the patient's physiological stability (BP, Temperature) to preserve organ function", "isCorrect": true, "rationale": "The nurse's primary clinical role is to keep the organs perfusing until the OPO takes over management." },
                    { "id": "o4", "text": "Provide emotional support and a private space for the grieving family", "isCorrect": true, "rationale": "Advocacy and support for the family during this crisis are core nursing responsibilities." },
                    { "id": "o5", "text": "Initiate the 'Organ Request' discussion once the family asks 'What happens now?'", "isCorrect": false, "rationale": "Even if the family brings it up, the nurse should facilitate the arrival of the OPO specialist rather than lead the request discussion." },
                    { "id": "o6", "text": "Ensure that the brain death declaration is documented by two separate physicians in the chart", "isCorrect": true, "rationale": "Verification of the legal death status is required before any procurement steps occur." }
                ]
            },
            "rationale": {
                "coreConcept": "Organ Procurement Ethics",
                "caseSummary": "Patient is brain dead. Nurse must coordinate between the Law (OPO), Clinician (Physician), and Family.",
                "answerAnalysis": "Correct: o1 (Notify OPO), o3 (Perfuse organs), o4 (Support), o6 (Legal verification). o2/o5 are traps: The nurse should NOT be the one asking for organs.",
                "trap": "Thinking the 'Bedside Nurse' should ask the family about donation because they have the rapport. Statistically, donation rates are higher when a 'Designated Requestor' asks.",
                "goldenRule": "Notify the OPO, and keep the BP up.",
                "steps": [
                    { "tag": "Notify", "description": "Call the OPO within 1 hour of meeting criteria." },
                    { "tag": "Maintain", "description": "Titrate pressors to keep MAP > 65." }
                ],
                "mnemonic": {
                    "title": "3 P's",
                    "content": "P-Procurement (Call OPO), P-Perfusion (Maintain stability), P-Privacy (For the family)",
                    "explanation": "Summarizes the nurse's duties in organ donation."
                },
                "cheatSheet": {
                    "title": "Donation Types",
                    "points": [
                        "Organ: Heart, Lungs, Liver, Kidneys, Bowel, Pancreas.",
                        "Tissue: Skin, Bone, Corneas, Valves (Can be harvested after cardiac death).",
                        "OPO Specialist: The only person who discusses the legal 'gift' of donation."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Brain death results in the loss of sympathetic tone (Vasodilation), requiring vasopressors to maintain organ perfusion.",
                    "pharm": "Vasopressin is often used to manage Diabetes Insipidus, which frequently occurs after brain death."
                },
                "difficulty": {
                    "score": 78,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Refer the 'Request' to the OPO, but keep the 'Patient' stable.",
                    "recommendedActions": ["Call OPO", "Maintain MAP > 65"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-INVOL-N1O2",
        "typeId": "trend",
        "metadata": {
            "title": "Involuntary Admission & Client Rights",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:35:00Z",
            "updatedAt": "2026-01-23T18:35:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Psychiatric Rights", "Involuntary Admission", "Safety"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.P.", "age": 22, "gender": "Female", "allergies": "NKDA", "weightKg": 55, "codeStatus": "Full Code"
                },
                "setting": "Behavioral Health Unit",
                "historyPhysical": {
                    "chiefComplaint": "Suicidality and Involuntary status.",
                    "hpi": "The client was admitted on 72-hour involuntary hold ('72h Cert') after attempting to jump from a bridge. She is currently demanding to be released, stating 'I'm fine now, and you can't keep me here against my will. It's my right!'.",
                    "pmh": ["Major Depressive Disorder", "Borderline Personality Disorder"],
                    "medications": ["Sertraline", "Quetiapine"]
                },
                "history": [
                    { "time": "Hr 0", "author": "ER MD", "note": "Involuntary hold initiated due to 'Danger to Self'." },
                    { "time": "Hr 24", "author": "RN Rivera", "note": "Patient demanding discharge. Signed 'Against Medical Advice' (AMA) form. Refusing medication." }
                ],
                "vitals": [
                    { "time": "Hr 24", "tempF": "98.2", "hr": 82, "rr": 16, "bp": "118/72", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the legal status and patient rights. Which principles guide the nurse's management of this involuntary client?",
                "options": [
                    { "id": "o1", "text": "The patient cannot leave the facility while the 72-hour hold is active", "isCorrect": true, "rationale": "Involuntary holds for danger to self/others legally supersede the patient's right to leave." },
                    { "id": "o2", "text": "The patient retains the right to refuse psychiatric medications despite the involuntary status", "isCorrect": true, "rationale": "Unless there is a separate court-ordered mandate for 'forced medication', patients on a 72-hour hold still have the right to refuse drugs." },
                    { "id": "o3", "text": "The patient's 'AMA' (Against Medical Advice) form is legally binding and they must be released", "isCorrect": false, "rationale": "An AMA form is not valid for a patient on a legal involuntary hold." },
                    { "id": "o4", "text": "The patient has the right to contact an attorney to challenge the hold", "isCorrect": true, "rationale": "Civil rights (Habeas Corpus) are maintained; the patient can seek legal counsel to challenge the commitment." },
                    { "id": "o5", "text": "The nurse can use physical restraints if the patient continues to demand to leave", "isCorrect": false, "rationale": "Restraints are for 'imminent danger' (behavioral emergencies), not as a punishment for wanting to leave or verbal demands." },
                    { "id": "o6", "text": "The nurse must provide the patient with a 'Whitten Notice' or 'Statement of Rights' upon admission", "isCorrect": true, "rationale": "Involuntary patients must be informed of their specific legal rights and the process for contesting the hold." }
                ]
            },
            "rationale": {
                "coreConcept": "Involuntary Admission Rights",
                "caseSummary": "Patient is on a 72-hour hold. She wants to leave but cannot. She wants to refuse meds, and she can.",
                "answerAnalysis": "Rights kept: o2 (Refuse meds), o4 (Attorney), o6 (Notice of Rights). Limitations: o1 (Stay in hospital). Misconceptions: o3 (AMA), o5 (Restraints).",
                "trap": "Thinking that 'Involuntary' means 'Total Loss of Rights'. They lose 'Freedom of movement' but keep 'Self-determination' (Refusing drugs).",
                "goldenRule": "Commitment = Forced stay, NOT forced pill.",
                "steps": [
                    { "tag": "Verify", "description": "Ensure the 72-hour paperwork is signed and timestamped correctly." },
                    { "tag": "Advocate", "description": "Allow the patient to make phone calls to legal representation." }
                ],
                "mnemonic": {
                    "title": "A.T.M.S.",
                    "content": "A-Attorney, T-Treatment (can refuse), M-Movement (restricted), S-Statement of rights",
                    "explanation": "Legal tenets for psych holds."
                },
                "cheatSheet": {
                    "title": "Hold Criteria",
                    "points": [
                        "1. Danger to Self (Suicide).",
                        "2. Danger to Others (Homicide).",
                        "3. Grave Disability (Cannot feed/clothe self)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "Quetiapine is an atypical antipsychotic often used for mood stabilization and sleep."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Legal Analysis",
                    "clinicalStrategy": "Search for rights that remain 'Intact' (Self-determination).",
                    "recommendedActions": ["Keep patient safe", "Respect med refusal"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-AUDIT-P5Q6",
        "typeId": "trend",
        "metadata": {
            "title": "Performance Improvement: Nursing Audit",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:40:00Z",
            "updatedAt": "2026-01-23T18:40:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 94,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Nursing Audit", "Performance Improvement", "Outcome vs Process"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N/A - Auditing Data", "age": 0, "gender": "O", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Surgical Services Department",
                "historyPhysical": {
                    "chiefComplaint": "Increasing rate of Post-Op Urinary Tract Infections (CAUTI).",
                    "hpi": "The unit is performing a 'Process Audit' and an 'Outcome Audit' after CAUTI rates spiked from 0.8 to 3.2 per 1000 catheter days over the last quarter.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Q1", "author": "Audit Team", "note": "CAUTI Rate: 0.8. Procedure checklist followed." },
                    { "time": "Q2", "author": "Audit Team", "note": "CAUTI Rate: 1.5. Increase in per-diem staff." },
                    { "time": "Q3", "author": "Audit Team", "note": "CAUTI Rate: 3.2. Observed break in sterile technique during insertions." }
                ],
                "vitals": [],
                "labs": [
                    { "test": "Average Cath Duration", "value": "4.2 days", "flag": "H", "ref": "< 2.0", "unit": "days" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the audit types and findings. Which conclusions regarding performance improvement are correct?",
                "options": [
                    { "id": "o1", "text": "The increase in the CAUTI rate (from 0.8 to 3.2) is an 'Outcome Audit' finding", "isCorrect": true, "rationale": "Outcome audits measure the actual results of care (e.g., infection rates, mortality, falls)." },
                    { "id": "o2", "text": "Observing breaks in sterile technique is a 'Process Audit' finding", "isCorrect": true, "rationale": "Process audits measure HOW care is being provided and whether standards are followed." },
                    { "id": "o3", "text": "Checking if CAUTI-prevention teaching was documented is a 'Structure Audit'", "isCorrect": false, "rationale": "Checking documentation is a Process Audit. Structure audits measure resources (beds, staff ratios, EHR availability)." },
                    { "id": "o4", "text": "The audit should focus on identifying which specific nurse caused the infections", "isCorrect": false, "rationale": "Performance improvement focuses on system redesign and standardizing care, not individual punishment." },
                    { "id": "o5", "text": "Implementing a 'Catheter Removal' protocol is a valid strategy to improve the outcome", "isCorrect": true, "rationale": "Addressing the 'Process' (duration of use) directly impacts the 'Outcome' (infection)." },
                    { "id": "o6", "text": "Outcome audits are traditionally done retrospectively after care is completed", "isCorrect": true, "rationale": "Most outcome data (Quarterly rates) is gathered by reviewing past records." }
                ]
            },
            "rationale": {
                "coreConcept": "Nursing Audits & Quality",
                "caseSummary": "Unit CAUTI rates are rising. Analysis of Outcome vs Process vs Structure audits.",
                "answerAnalysis": "Correct: o1 (Outcome-Result), o2 (Process-Technique), o5 (Redesign), o6 (Retrospective). o3 is wrong (Structure is about 'Buildings/Staffing'). o4 is wrong (Just Culture).",
                "trap": "Thinking 'Checking the Chart' is a Structure Audit. It's a Process Audit of the documentation standard.",
                "goldenRule": "Process is 'What we do'. Outcome is 'What happens to the patient'.",
                "steps": [
                    { "tag": "Analyze", "description": "Identify where the 'Deficit' lies (Structure, Process, or Outcome)." },
                    { "tag": "Act", "description": "Develop a performance improvement plan targeting the process." }
                ],
                "mnemonic": {
                    "title": "S.P.O.",
                    "content": "Structure, Process, Outcome",
                    "explanation": "The Donabedian triad of quality."
                },
                "cheatSheet": {
                    "title": "Audit Examples",
                    "points": [
                        "Structure: Number of hand-sanitizer stations available.",
                        "Process: Percentage of staff using hand-sanitizer before entry.",
                        "Outcome: Rate of MRSA transmission on the unit."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The urethra is the pathway for catheter-associated pathogens.",
                    "physiology": "Catheterization bypasses the primary immune defense (micturition/flushing).",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 70,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Link the 'Study' to the 'Type of Data' (Actions vs Stats).",
                    "recommendedActions": ["Implement Cath Removal Protocol", "Perform Sterile technique audit"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-PEERV-S7T8",
        "typeId": "trend",
        "metadata": {
            "title": "Professional Peer Review & Mentorship",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:45:00Z",
            "updatedAt": "2026-01-23T18:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Peer Review", "Professional Development", "Leadership"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N/A - Staff Development", "age": 0, "gender": "O", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Nursing Staff Lounge / Office",
                "historyPhysical": {
                    "chiefComplaint": "Conflict during a Peer Review session.",
                    "hpi": "A new graduate nurse (RN Green) is receiving their first 6-month peer review. An experienced colleague (RN Grey) is providing the feedback. RN Grey states, 'Your time management is poor, and you are often behind on meds. You need to work faster or this unit isn't for you'. RN Green becomes defensive.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "Manager", "note": "Peer review process initiated. Purpose: Growth and professional accountability." }
                ],
                "vitals": [],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the professional interaction. Which characteristics of 'Effective Peer Review' are being violated or should be implemented?",
                "options": [
                    { "id": "o1", "text": "Feedback should be based on objective performance data rather than personal opinion", "isCorrect": true, "rationale": "High-quality peer review uses metrics (e.g., med timing stats, documentation logs) rather than vague adjectives like 'poor'." },
                    { "id": "o2", "text": "The feedback should be provided in a private, confidential setting", "isCorrect": true, "rationale": "Confidentiality ensures the safety of the professional dialogue." },
                    { "id": "o3", "text": "Constructive feedback should focus on specific behaviors that can be changed", "isCorrect": true, "rationale": "Focusing on behavior (e.g., 'prioritization during task flow') is more effective than personal attacks ('unit isn't for you')." },
                    { "id": "o4", "text": "Peer review is primarily intended for the manager to decide on termination", "isCorrect": false, "rationale": "Peer review is for professional development and shared governance, not administrative disciplinary action." },
                    { "id": "o5", "text": "RN Green should be encouraged to self-reflect and provide a self-assessment during the process", "isCorrect": true, "rationale": "Effective peer review is a Two-Way dialogue involving self-reflection." },
                    { "id": "o6", "text": "The feedback should include a collaborative plan for improvement or mentorship", "isCorrect": true, "rationale": "Identifying a problem without providing a path to a solution (mentorship) is ineffective coaching." }
                ]
            },
            "rationale": {
                "coreConcept": "Professional Peer Review",
                "caseSummary": "Ineffective and aggressive feedback during peer review. Stakeholders must pivot to professional, developmental models.",
                "answerAnalysis": "Correct: o1 (Objective), o2 (Confidential), o3 (Behavior-focused), o5 (Self-reflection), o6 (Solutions). o4 is a trap (Manager role vs Peer role).",
                "trap": "Believing that 'Honesty' justifies 'Rudeness' in peer review. Professional honesty requires constructive framing.",
                "goldenRule": "Criticize the behavior, celebrate the professional.",
                "steps": [
                    { "tag": "Frame", "description": "Identify 2 strengths and 1 specific growth area ('Sandwich' method)." },
                    { "tag": "Collaborate", "description": "Set a goal and a timeline for a follow-up check-in." }
                ],
                "mnemonic": {
                    "title": "G.R.O.W.",
                    "content": "G-Goal, R-Reality, O-Options, W-Way Forward",
                    "explanation": "Standard coaching model for peer feedback."
                },
                "cheatSheet": {
                    "title": "Peer Review Ethics",
                    "points": [
                        "Confidentiality is a MUST.",
                        "Non-punitive intent.",
                        "Evidence-based (Observation or Data).",
                        "Consistent across all staff."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 75,
                    "level": 4,
                    "label": "Synthesis/Leadership",
                    "clinicalStrategy": "Select options that promote 'Growth' and 'Data' over 'Opinion'.",
                    "recommendedActions": ["Re-frame feedback", "Assign mentor"]
                }
            }
        }
    }
];
