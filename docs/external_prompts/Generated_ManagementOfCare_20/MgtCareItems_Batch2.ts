import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * PREMIUM MANAGEMENT OF CARE ITEMS (Batch 2: Items 4-7 of 20)
 * Topic: Management of Care (NCLEX Client Need)
 * Standards: Level 5, 3-Point Trends, 6-Option SATA, Expert Rationales
 */

export const MgtCareItems_Batch2: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-ADIR-T3H4",
        "typeId": "trend",
        "metadata": {
            "title": "Advance Directives: Respecting Patient Autonomy",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:00:00Z",
            "updatedAt": "2026-01-23T14:00:00Z",
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
            "clinicalFocusTopics": ["Advance Directives", "DNR Status", "Ethical Advocacy"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "L.D.", "age": 79, "gender": "Female", "allergies": "NKDA", "weightKg": 58, "codeStatus": "Full Code (Initially)"
                },
                "setting": "Intensive Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "End-stage COPD requiring ventilatory support.",
                    "hpi": "Client has been in the ICU for 3 weeks. She has been on a ventilator twice in the last year. She previously told the house staff she 'didn't want tubes anymore'.",
                    "pmh": ["Stage IV COPD", "Right Sided Heart Failure", "Osteoporosis"],
                    "medications": ["Methylprednisolone", "Albuterol", "Fentanyl Drip"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "RN Smith", "note": "Client alert and oriented during 'Sedation Vacation'. Writes on whiteboard: 'NO MORE MACHINES. I WANT TO DIE NATURALLY. PLEASE STOP.' Witnessed by two nurses." },
                    { "time": "Mon 1400", "author": "Social Worker", "note": "Valid Durable Power of Attorney (DPOA) and Living Will confirmed in chart. Both specify 'Comfort Care Only, No Intubation/Ventilation'." },
                    { "time": "Tue 0200", "author": "RN Smith", "note": "Client enters respiratory arrest. Family (Son) arrives and screams, 'SAVE HER! I am her son, do everything! I don't care what she wrote!'" }
                ],
                "vitals": [
                    { "time": "Mon 1000", "tempF": "98.6", "hr": 84, "rr": "Mechanical", "bp": "110/70", "o2": "94" },
                    { "time": "Tue 0200", "tempF": "98.8", "hr": 42, "rr": 4, "bp": "62/30", "o2": "72" }
                ],
                "labs": [],
                "orders": [
                    { "order": "Update Code Status to DNR/DNI", "status": "Pending MD Signature", "time": "Mon 1100" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse evaluates the trend and the legal documents. Which actions are legally and ethically MANDATORY for the nurse at 0200?",
                "options": [
                    { "id": "o1", "text": "Honor the client's previously stated wishes and the Living Will", "isCorrect": true, "rationale": "Patient autonomy is paramount. A competent adult's written advance directive overrides the verbal wishes of family members." },
                    { "id": "o2", "text": "Withhold chest compressions and intubation", "isCorrect": true, "rationale": "Pursuant to the 'Comfort Care Only' specification in the Living Will, invasive resuscitation is contraindicated." },
                    { "id": "o3", "text": "Immediately initiate CPR because the MD has not signed the DNR order yet", "isCorrect": false, "rationale": "While technically a 'Full Code' until signed, the nurse has documented evidence of capacity and two witnesses to the patient's direct refusal of machine support. Ethically and legally, the patient's refusal of treatment is a right that exists outside of a specific form." },
                    { "id": "o4", "text": "Provide comfort measures and spiritual support to the Son", "isCorrect": true, "rationale": "While the nurse cannot honor the son's request for CPR, the nurse must provide family-centered care and explain the legal reality of the mother's wishes." },
                    { "id": "o5", "text": "Consult the Hospital Ethics Committee immediately", "isCorrect": true, "rationale": "In cases of high-conflict family versus patient wishes, the Ethics Committee provides support and legal mediation." },
                    { "id": "o6", "text": "Notify the physician of the client's update in clinical status and the family conflict", "isCorrect": true, "rationale": "Interdisciplinary communication is required to finalize the transition to end-of-life care." }
                ]
            },
            "rationale": {
                "coreConcept": "Advance Directives and Autonomy",
                "caseSummary": "A patient with terminal COPD clearly refuses treatment while competent. The family demands the opposite during a crisis. The nurse must advocate for the patient's right to refuse.",
                "answerAnalysis": "Autonomy (o1, o2) overrides Beneficence as perceived by family. The nurse must manage the conflict via Ethics (o5) and communication (o6) while prioritizing the patient's documented wishes.",
                "trap": "Thinking the family 'decides' when the patient is unconscious. No—the patient already decided when she was conscious (The Living Will). DPOA only kicks in if the patient *hasn't* already expressed a specific wish for the current scenario.",
                "goldenRule": "Patient Autonomy > Family Wishes. Written Directives > Verbal Family requests.",
                "steps": [
                    { "tag": "Verify", "description": "Confirm the client was 'Alert and Oriented' (had capacity) when she made her recent request." },
                    { "tag": "Validate", "description": "Ensure the Living Will and DPOA are scanned and legally valid in the EHR." }
                ],
                "mnemonic": {
                    "title": "A.D.V.O.C.A.T.E.",
                    "content": "A-Autonomy, D-Directives, V-Verify wishes, O-Overrides, C-Conflict management, A-Administer comfort, T-Time-out for Ethics, E-Educate family",
                    "explanation": "Summarizes the flow of ethical advocacy."
                },
                "cheatSheet": {
                    "title": "Advance Directives Tip",
                    "points": [
                        "Living Will: Specific 'What I want' instructions.",
                        "Durable Power of Attorney (DPOA): 'Who decides' if I can't.",
                        "The client can change their mind at any time, even verbally, as long as they have capacity."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "End-stage COPD leads to chronic hypercapnia and respiratory failure, usually unresponsive to repeat intubation.",
                    "pharm": "Comfort care focuses on opioids (Morphine) to manage the sensation of dyspnea (air hunger)."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Expert Advocacy",
                    "clinicalStrategy": "Identify the patient's voice as the primary authority.",
                    "recommendedActions": ["Stop resuscitation", "Bring family to bedside", "Call Chaplain"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-HIPAA-S9T4",
        "typeId": "trend",
        "metadata": {
            "title": "Confidentiality: Social Media Infractions",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:10:00Z",
            "updatedAt": "2026-01-23T14:10:00Z",
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
            "clinicalFocusTopics": ["HIPAA", "Professionalism", "Social Media Ethics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N/A", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Nursing Unit / Professional Network",
                "historyPhysical": {
                    "chiefComplaint": "Evaluation of ethical conduct by a colleague.",
                    "hpi": "A staff nurse recognizes that another nurse on the unit is posting frequently to a public 'Nursing Influencer' account. The supervisor tracks the progression of these posts to determine if a HIPAA violation or professional boundary crossing has occurred.",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "Day 1", "author": "Observation", "note": "Post: 'Tough shift today in the Step-down Unit. Staying strong! #NurseLife'." },
                    { "time": "Day 3", "author": "Observation", "note": "Post: Photo of a coffee cup at the nursing station. In the background, a whiteboard with patient names is partially visible. Caption: 'Coffee is my only friend today'." },
                    { "time": "Day 7", "author": "Observation", "note": "Post: 'So sad for the 18yo kid in room 402 who just found out his cancer is back. Life is unfair. #PedsOnc'." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the trend of social media posts. Which actions and observations indicate that the nurse has violated HIPAA and professional standards?",
                "options": [
                    { "id": "o1", "text": "Day 3: Partial visibility of patient names on a background whiteboard", "isCorrect": true, "rationale": "Any 'identifiable' information, even if unintentional or in the background of a photo, constitutes a HIPAA violation." },
                    { "id": "o2", "text": "Day 7: Disclosure of patient age, room number, and diagnosis", "isCorrect": true, "rationale": "Combining identifiers (Room, Age, Diagnosis) makes the patient easily identifiable by the public, representing a flagrant HIPAA breach." },
                    { "id": "o3", "text": "Day 1: Mentioning the specific 'Step-down Unit' work setting", "isCorrect": false, "rationale": "Discussing one's general work environment or role without patient-specific details is generally professionally acceptable." },
                    { "id": "o4", "text": "The use of 'Nursing Life' hashtags", "isCorrect": false, "rationale": "General career-related hashtags do not constitute a violation of standards." },
                    { "id": "o5", "text": "Day 7: Expressing emotional sadness for a patient on public social media", "isCorrect": true, "rationale": "Sharing clinical outcomes and personal feelings about specific cases in a public forum crosses professional boundaries and compromises patient privacy (Advocacy violation)." },
                    { "id": "o6", "text": "The violation occurred because the nurse did not have 'Privacy Settings' enabled", "isCorrect": false, "rationale": "HIPAA applies regardless of whether a post is 'private' or 'public'; a violation is a violation once shared with unauthorized individuals." }
                ]
            },
            "rationale": {
                "coreConcept": "Confidentiality and Professional Boundaries",
                "caseSummary": "A nurse progresses from general posts to specific patient details (Room, diagnosis) and background whiteboard leaks. This is a multi-layered violation.",
                "answerAnalysis": "HIPAA protects 18 specific identifiers. Correct options (o1, o2, o5) identify breaches of confidentiality and professional conduct. o6 is a common misconception—privacy settings do not legalise HIPAA breaches.",
                "trap": "Thinking that if the patient's 'Name' isn't used, it is okay. 'Room 402, 18 years old, Cancer' is just as identifying as a name.",
                "goldenRule": "If you can't say it in an elevator, don't say it (or post it) on the internet.",
                "steps": [
                    { "tag": "Analyze", "description": "Identify the 'combination' of facts that leads to patient identity (triangulation)." },
                    { "tag": "Verify", "description": "Check if any PHI (Protected Health Information) is visible in the background of images." }
                ],
                "mnemonic": {
                    "title": "P.H.I.-S.T.O.P.",
                    "content": "P-Private stays Private, H-Hands off Social Media, I-Identifiers removed, S-Silence is Golden, T-Think before posting, O-Observe boundaries, P-Protect the patient",
                    "explanation": "Summarizes HIPAA safety."
                },
                "cheatSheet": {
                    "title": "Social Media No-Goes",
                    "points": [
                        "Photos with patients (even with permission).",
                        "Photos showing monitors/whiteboards.",
                        "Describing specific cases/outcomes.",
                        "Talking about 'Room X' or 'The patient with Y'."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 88,
                    "level": 5,
                    "label": "Ethical Analysis",
                    "clinicalStrategy": "Assume any patient-specific info is a violation.",
                    "recommendedActions": ["Report to supervisor", "Document findings", "Consult Legal"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-DISCHARGE-G5H6",
        "typeId": "trend",
        "metadata": {
            "title": "Transition of Care: Identifying Discharge Barriers",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:15:00Z",
            "updatedAt": "2026-01-23T14:15:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Case Management", "Discharge Planning", "Continuity of Care"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.W.", "age": 74, "gender": "Male", "allergies": "NKDA", "weightKg": 92, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Readmission for Heart Failure exacerbation (3rd time this year).",
                    "hpi": "Client has been in the hospital for 4 days. He is nearing discharge. The nurse is assessing his readiness to go home to prevent another readmission.",
                    "pmh": ["CHF", "Hypertension", "Early Stage Dementia (Memory loss)"],
                    "medications": ["Furosemide 40mg daily", "Carvedilol 6.25mg BID", "Lisinopril 10mg daily"]
                },
                "history": [
                    { "time": "Pre-Admission", "author": "Home Health", "note": "Client lives alone. Sparse food in fridge. Often forgets to take morning medications." },
                    { "time": "Hospital Day 2", "author": "RN Chen", "note": "Client educated on Low Sodium diet. Client nods and says, 'I understand'. Can correctly identify high-salt foods." },
                    { "time": "Hospital Day 4", "author": "RN Chen", "note": "Client asks, 'So, after my daughter drops off my McDonald's tonight, can I go home?' Weight is up 1kg since Day 3." }
                ],
                "vitals": [
                    { "time": "Day 1", "weightKg": 94, "bp": "158/92", "hr": 102 },
                    { "time": "Day 2", "weightKg": 92, "bp": "132/84", "hr": 84 },
                    { "time": "Day 4", "weightKg": 93, "bp": "144/88", "hr": 88 }
                ],
                "labs": [
                    { "test": "BNP", "value": "850", "flag": "H", "ref": "< 100", "unit": "pg/mL" }
                ],
                "orders": [
                    { "order": "Social Work Referral", "status": "Pending", "time": "Today" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and nursing assessments. Which factors indicate that the client is experiencing 'High-Risk Failure of Transition' and requires immediate Case Management intervention?",
                "options": [
                    { "id": "o1", "text": "History of three readmissions in a single calendar year", "isCorrect": true, "rationale": "High-utilization and 'revolving door' admissions are major flags for failed home management or social determinants of health issues." },
                    { "id": "o2", "text": "Client's question about eating high-sodium fast food on Day 4", "isCorrect": true, "rationale": "Indicates lack of 'Internalization' of education. Knowing the facts (Day 2) isn't the same as applying them to lifestyle (Day 4)." },
                    { "id": "o3", "text": "Living alone with documented cognitive memory loss", "isCorrect": true, "rationale": "Safety and 'Medication Adherence' are significantly compromised when a patient with dementia lacks a home support system." },
                    { "id": "o4", "text": "Weight gain of 1kg between Day 3 and Day 4 in-hospital", "isCorrect": true, "rationale": "Indicates that even in a controlled environment, the condition is not stabilized or the client is consuming unauthorized sodium/fluids." },
                    { "id": "o5", "text": "Successful identification of low-salt foods on Day 2", "isCorrect": false, "rationale": "While a positive finding, it is 'superficial' and does not mitigate the high-risk factors for discharge failure seen in later trends." },
                    { "id": "o6", "text": "Lack of transportation or financial resources for medications", "isCorrect": true, "rationale": "Social determinants of health are the most common causes of multi-readmission in the elderly population." }
                ]
            },
            "rationale": {
                "coreConcept": "Case Management and Readmission Prevention",
                "caseSummary": "An elderly patient with HF and memory loss has a pattern of readmissions. Despite education, he continues high-sodium habits. The nurse must involve Case Management to secure home safety.",
                "answerAnalysis": "Critical factors for failure are 1) Pattern of readmission (o1), 2) Failed application of education (o2), 3) Cognitive/Social isolation (o3), and 4) Signs of fluid retention (o4). o6 is the structural cause for these failures.",
                "trap": "Thinking that because the patient 'passed' the teaching test (Day 2), he is ready. In NCLEX Level 5, you must look at the *trend* of behavior, not just the test score.",
                "goldenRule": "Discharge planning starts at Admission. The goal is to provide a 'Warm Handoff' to the next level of care.",
                "steps": [
                    { "tag": "Verify", "description": "Check the 'Social History' for support systems at home." },
                    { "tag": "Correlate", "description": "Match the weight trend to the 'McDonald's' statement to confirm non-compliance." }
                ],
                "mnemonic": {
                    "title": "S.O.C.I.A.L.",
                    "content": "S-Support system, O-Orientation (Memory), C-Consistency in meds, I-Income/Insurance, A-Adherence to diet, L-Location (Housing/Safety)",
                    "explanation": "Summarizes the Case Management assessment."
                },
                "cheatSheet": {
                    "title": "Discharge Checklist",
                    "points": [
                        "Medication reconciliation completed.",
                        "Follow-up appointments scheduled.",
                        "DME (Medical equipment) delivered.",
                        "Support person identified."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Sodium causes water retention via osmosis. In CHF, the weakened heart cannot handle the increased preload, leading to pulmonary and peripheral edema.",
                    "pharm": "Furosemide is a loop diuretic. If missed for even 1-2 days, fluid can accumulate quickly (2.2 lbs = 1 liter of fluid)."
                },
                "difficulty": {
                    "score": 92,
                    "level": 5,
                    "label": "Systems Evaluation",
                    "clinicalStrategy": "Look for the contradiction between what the patient 'knows' and what they 'do'.",
                    "recommendedActions": ["Involve Social Work", "Arrange Home Health", "Enroll in HF clinic"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-CONFLICT-D1F2",
        "typeId": "trend",
        "metadata": {
            "title": "Conflict Resolution: The Hostile Family Member",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:20:00Z",
            "updatedAt": "2026-01-23T14:20:00Z",
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
            "clinicalFocusTopics": ["Conflict Resolution", "Communication", "Workplace Safety"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.B.", "age": 82, "gender": "Female", "allergies": "None", "weightKg": 54, "codeStatus": "DNR"
                },
                "setting": "Medical Unit",
                "historyPhysical": {
                    "chiefComplaint": "End-of-life care and symptoms management.",
                    "hpi": "Client is actively dying. Her daughter is the primary caregiver and is becoming increasingly agitated and hostile toward the nursing staff due to the client's 'uncontrolled' pain.",
                    "pmh": ["Metastatic Lung Cancer"],
                    "medications": ["Morphine Infusion"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "RN Chen", "note": "Daughter shouting in the hallway: 'You people are incompetent! My mother is suffering and you're doing nothing!'" },
                    { "time": "Mon 1030", "author": "RN Chen", "note": "Attempted to explain the morphine titration. Daughter interrupted, leaned over the nurse, and stated: 'Watch your back. If she doesn't stop moaning, I'm going to make sure you never work again.'" },
                    { "time": "Mon 1100", "author": "Charge Nurse", "note": "Security called to be present outside the room. All-staff meeting held regarding care plan." }
                ],
                "vitals": [
                    { "time": "1030", "hr": 110, "rr": 28, "bp": "90/50" }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and communication events. Which actions by the nurse follow the correct hierarchy of conflict management and safety?",
                "options": [
                    { "id": "o1", "text": "Acknowledge the daughter's distress using 'I' statements (e.g., 'I hear how frustrated you are.')", "isCorrect": true, "rationale": "De-escalation starts with acknowledging the emotional state without matching the hostility." },
                    { "id": "o2", "text": "Set clear limits on behavior (e.g., 'I want to help your mother, but I cannot continue this conversation if you are threatening me.')", "isCorrect": true, "rationale": "Setting boundaries is essential to maintaining a safe work environment and professional relationship." },
                    { "id": "o3", "text": "Argue that the morphine is being administered according to the MD's orders", "isCorrect": false, "rationale": "Arguing or being 'defensive' during high-conflict de-escalation usually increases the other's anger." },
                    { "id": "o4", "text": "Involve the Charge Nurse or Nurse Manager early in the process", "isCorrect": true, "rationale": "Management of care requires administrative support when safety or professional boundaries are crossed." },
                    { "id": "o5", "text": "Leave the room and refuse care for the patient entirely", "isCorrect": false, "rationale": "The nurse cannot 'abandon' the patient; however, they can request a 'Re-assignment' if the environment is unsafe." },
                    { "id": "o6", "text": "Document the specific quotes and threats made by the daughter in the medical record (non-clinical note) or incident report", "isCorrect": true, "rationale": "Accurate, objective documentation of workplace violence/threats is legally required to protect the nurse and the institution." }
                ]
            },
            "rationale": {
                "coreConcept": "Conflict De-escalation and Safety",
                "caseSummary": "A grieving daughter becomes hostile and threatening. The nurse must de-escalate, set boundaries, and involve management to ensure safety.",
                "answerAnalysis": "Correct management involves de-escalation (o1), boundary setting (o2), escalation to leadership (o4), and objective documentation (o6). Defensive arguing (o3) is the primary 'NCLEX Trap'.",
                "trap": "Thinking you should 'ignore' the threat to be 'nice' to the family. No—threats must be documented and boundaries set.",
                "goldenRule": "Safety First, Advocacy Second. You cannot care for the patient if you are being threatened.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify that the conflict has shifted from 'Distress' to 'Lateral Violence/Threats'." },
                    { "tag": "Take Action", "description": "De-escalate first, then escalate to the Charge Nurse if it fails." }
                ],
                "mnemonic": {
                    "title": "C.A.L.M.",
                    "content": "C-Collect your thoughts, A-Acknowledge feelings, L-Limits must be set, M-Manager involvement",
                    "explanation": "Summarizes the conflict flow."
                },
                "cheatSheet": {
                    "title": "Conflict Hierarchy",
                    "points": [
                        "Level 1: Disagreement (Clarify).",
                        "Level 2: Hostility (Acknowledge).",
                        "Level 3: Threats (Set Limits/Call Security).",
                        "Level 4: Violence (Escape/Call Code Purple)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Stress triggers the 'Amgydala Hijack' in family members, leading to irrational anger and emotional outbursts during end-of-life care.",
                    "pharm": "Morphine at end-of-life is used not just for pain, but to treat dyspnea (tachypnea of 28 here)."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Communication Analysis",
                    "clinicalStrategy": "Choose the options that protect the nurse while remaining professional.",
                    "recommendedActions": ["Use a calm tone", "Escalate to Charge", "Never match the volume"]
                }
            }
        }
    }
];
