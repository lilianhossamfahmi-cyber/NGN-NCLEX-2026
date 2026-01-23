import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * PREMIUM MANAGEMENT OF CARE ITEMS (Batch 5: Items 16-20 of 20)
 * Topic: Management of Care (NCLEX Client Need)
 * Standards: Level 5, 3-Point Trends, 6-Option SATA, Expert Rationales
 */

export const MgtCareItems_Batch5: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-PHONE-P1R2",
        "typeId": "trend",
        "metadata": {
            "title": "Confidentiality: Telephone Inquiries",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:40:00Z",
            "updatedAt": "2026-01-23T15:40:00Z",
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
            "clinicalFocusTopics": ["Confidentiality", "HIPAA", "Telephone Communication"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.B.", "age": 52, "gender": "Female", "allergies": "NKDA", "weightKg": 64, "codeStatus": "Full Code"
                },
                "setting": "Medical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Managing patient privacy during telephone status updates.",
                    "hpi": "Client is hospitalized with acute pancreatitis. She is alert, oriented, and has strictly requested that no information be given to her 'estranged husband'. She has established a 4-digit security code for authorized callers.",
                    "pmh": ["Pancreatitis", "SUD history"],
                    "medications": ["Morphine", "Octreotide"]
                },
                "history": [
                    { "time": "1400", "author": "RN Smith", "note": "Call received. Caller states: 'I am her husband. I'm so worried. Is she still in pain?' Caller cannot provide the security code. Information withheld." },
                    { "time": "1600", "author": "RN Smith", "note": "Call received. Caller states: 'I am her brother. I live in another state. We match the last name. Please tell me if she is okay.' Information withheld." },
                    { "time": "1800", "author": "RN Smith", "note": "Call received. Caller provides the correct 4-digit security code. 'I am her roommate, Sarah. Is she awake?'" }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the management of these phone inquiries. Which principles of confidentiality were correctly applied by the nurse?",
                "options": [
                    { "id": "o1", "text": "Information was withheld from the husband because he lacked the security code", "isCorrect": true, "rationale": "Even legal spouses are not entitled to PHI (Protected Health Information) if the patient has explicitly refused consent or if the spouse lacks the authentication code." },
                    { "id": "o2", "text": "Sharing information with the 'Brother' was refused despite having the same last name", "isCorrect": true, "rationale": "Blood relation or shared surnames do not grant legal access to private medical records under HIPAA." },
                    { "id": "o3", "text": "Providing the status to the 'Roommate' was acceptable because she had the code", "isCorrect": true, "rationale": "The security code serves as the patient's proxy for consent for authorized individuals." },
                    { "id": "o4", "text": "The nurse should have given 'General' information (e.g. 'She's stable') to the husband to be kind", "isCorrect": false, "rationale": "Even 'General' information acknowledges the patient is hospitalized, which is a HIPAA violation if the patient requested a 'Confidential' (No-Information) status." },
                    { "id": "o5", "text": "The nurse correctly prioritized the client's request over the family's 'Right to Know'", "isCorrect": true, "rationale": "Families do not have a legal 'Right to Know' medical details against a competent adult's wishes." },
                    { "id": "o6", "text": "The nurse should have confirmed that 'R.B.' is indeed a patient on the unit to the husband", "isCorrect": false, "rationale": "Confirming the patient's presence on the unit to an unauthorized caller is a breach of privacy." }
                ]
            },
            "rationale": {
                "coreConcept": "Privacy and Phone Communication",
                "caseSummary": "A patient with privacy concerns uses a security code. The nurse correctly filters callers, even family, who lack the code.",
                "answerAnalysis": "Correct privacy flow: Verify code (o1, o3), reject unauthorized family (o2), honor patient's request (o5). o4/o6 are common but illegal breaches.",
                "trap": "Thinking family = automatic access. It doesn't. Spouses/Parents of adults have NO legal access without the patient's consent.",
                "goldenRule": "No Code = No Info. Last names don't matter.",
                "steps": [
                    { "tag": "Verify", "description": "Always ask for the security code before revealing ANY info, including the fact that the pt is on the unit." },
                    { "tag": "Instruct", "description": "Advise unauthorized callers to contact the patient directly or wait for the patient to call them." }
                ],
                "mnemonic": {
                    "title": "K.E.Y. Code",
                    "content": "K-Keep info private, E-Ensure code is correct, Y-Your patient decides",
                    "explanation": "Summarizes the security code process."
                },
                "cheatSheet": {
                    "title": "Phone HIPAA Rules",
                    "points": [
                        "Don't give info out at the nurses' station where others can hear.",
                        "Confirm the identity of the caller.",
                        "Check for the 'Confidential/No Info' flag in the chart."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "N/A",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Confidentiality Analysis",
                    "clinicalStrategy": "The patient's wish is the ONLY wish that matters for privacy.",
                    "recommendedActions": ["Withhold info", "Document the calls", "Report the husband's agitation"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-RCA-S9T4",
        "typeId": "trend",
        "metadata": {
            "title": "Performance Improvement: Root Cause Analysis (RCA)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:45:00Z",
            "updatedAt": "2026-01-23T15:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Quality Improvement", "Root Cause Analysis", "Patient Safety"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Unit Safety Trend", "age": 0, "gender": "N/A"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Analyzing a trend of patient falls.",
                    "hpi": "The unit manager reviews a trend of 4 falls that occurred over a 2-week period. All falls occurred in the same hallway (Rooms 410-418).",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "Incident 1", "author": "Security", "note": "Patient in 412 fell at 0530 near the bathroom. Floor was dry. Call light was in reach." },
                    { "time": "Incident 2", "author": "Security", "note": "Patient in 410 fell at 0445. Patient stated: 'I had to go so bad I couldn't wait for help.' Received Furosemide at 0400." },
                    { "time": "Incident 3", "author": "Security", "note": "Patient in 418 fell at 0515. Staff was busy with shift-change report." },
                    { "time": "Trend Analysis", "author": "Manager", "note": "All falls happened between 0430 and 0600. All patients were receiving diuretics. All were 'High Fall Risk'." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the trend using the principles of 'Root Cause Analysis' (RCA). Which systemic factors likely contributed to this trend?",
                "options": [
                    { "id": "o1", "text": "Timing of diuretic administration (0400) coinciding with low staffing and shift change", "isCorrect": true, "rationale": "Scheduling 'Urgently acting' meds like Furosemide right before shift change (when staff are least available) creates a 'Perfect Storm' for unassisted bathroom trips." },
                    { "id": "o2", "text": "Gap in visualization/monitoring during the 0500-0600 shift report period", "isCorrect": true, "rationale": "Shift report is a known high-risk period for falls as direct patient surveillance typically decreases." },
                    { "id": "o3", "text": "Individual nurse laziness for not answering the call lights", "isCorrect": false, "rationale": "RCA focuses on 'Systems' (Process/Culture), not blaming individuals; blaming 'Laziness' is never the correct RCA answer." },
                    { "id": "o4", "text": "Lack of 'Hourly Rounding' specifically during the pre-dawn hours", "isCorrect": true, "rationale": "The trend suggests that patients are becoming active/unstable between 0400-0600, requiring targeted rounding during this window." },
                    { "id": "o5", "text": "The hallway lighting was too dim in the 400s", "isCorrect": true, "rationale": "Environmental factors are a standard component of RCA evaluation; dim light in the early morning increases disorientation." },
                    { "id": "o6", "text": "The patients were 'Non-Compliant' with bed alarm instructions", "isCorrect": false, "rationale": "RCA looks at why the bed alarm failed to *prevent* the fall or why the *system* setup made it likely that a patient would ignore it; blaming the patient is not an RCA breakthrough." }
                ]
            },
            "rationale": {
                "coreConcept": "Systems Thinking and RCA",
                "caseSummary": "A cluster of falls occurs in a specific time-window. The RCA identifies medication timing and staffing gaps as the cause.",
                "answerAnalysis": "RCA seeks 'The Why'. Systemic factors: o1 (Meds), o2 (Workflow), o4 (Policy), o5 (Environment). Individual blame (o3) or patient blame (o6) are incorrect.",
                "trap": "Thinking an Incident Report is the same as an RCA. An incident report is for ONE event. RCA is for the SYSTEM that allowed the event to happen.",
                "goldenRule": "Correct the Process, not the Person. Look for 'Latent Errors' in the system.",
                "steps": [
                    { "tag": "Analyze", "description": "Map the timing of events (Timeline) to find commonalities." },
                    { "tag": "Verify", "description": "Compare 'What happened' with 'What was supposed to happen' (Policy vs Reality)." }
                ],
                "mnemonic": {
                    "title": "5 WHYS",
                    "content": "Why? Why? Why? Why? Why?",
                    "explanation": "Asking 'Why' five times leads to the root cause (Systemic failure) rather than just the immediate cause (The fall)."
                },
                "cheatSheet": {
                    "title": "RCA Components",
                    "points": [
                        "Human Factors (Fatigue/Communication).",
                        "Environment (Lighting/Noise/Space).",
                        "Policy/Process (Scheduling/Ratios).",
                        "Equipment (Alarms/Beds)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Furosemide inhibits the Na-K-2Cl symporter in the loop of Henle, causing rapid diuresis within 30-60 minutes.",
                    "pharm": "Scheduling diuretics at 0400 leads to peak bladder distension at 0500, during the shift-change window."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Leadership Evaluation",
                    "clinicalStrategy": "Always select 'Process' and 'Environment' over 'People'.",
                    "recommendedActions": ["Reschedule Furosemide", "Stagger shift report", "Increase lighting"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-POLY-K4M5",
        "typeId": "trend",
        "metadata": {
            "title": "Coordination: Polypharmacy in the Elderly",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T15:50:00Z",
            "updatedAt": "2026-01-23T15:50:00Z",
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
            "clinicalFocusTopics": ["Medication Reconciliation", "Polypharmacy", "Interdisciplinary Coordination"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.G.", "age": 82, "gender": "Female", "allergies": "Codeine", "weightKg": 52, "codeStatus": "Full Code"
                },
                "setting": "Geriatric Outpatient Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Bouts of dizziness and a near-fall.",
                    "hpi": "Client is seen for a follow-up. The nurse asks the client to bring in all of her medications from home. The nurse performs a medication reconciliation and finds a discrepancy between the chart and the 'Brown Bag'.",
                    "pmh": ["Hypertension", "Insomnia", "Osteoarthritis", "Depression"],
                    "medications": ["Listed in chart: 5 meds. Actually taking: 11 meds."]
                },
                "history": [
                    { "time": "Last Visit", "author": "RN Smith", "note": "Chart reflects: Lisinopril, Amlodipine, Sertraline, Multivitamin, Calcium." },
                    { "time": "Today 1000", "author": "RN Smith", "note": "Client brought the following NOT on chart: Diphenhydramine (for sleep), St. John's Wort (for mood), NSAIDs (for joints), 2 different 'Blood pressure pills' from a previous doctor she still has refills for, and a friend's Alprazolam 'for nerves'." },
                    { "time": "Today 1015", "author": "RN Smith", "note": "Client reports: 'I get so dizzy when I stand up. I felt like I was going to black out this morning.'" }
                ],
                "vitals": [
                    { "time": "1000", "sitting_bp": "110/68", "standing_bp": "82/44", "hr": 78 }
                ],
                "labs": [],
                "orders": [
                    { "order": "Comprehensive Med Reconciliation", "status": "In Progress" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the medication trend. Which management of care interventions are the highest priority for this client?",
                "options": [
                    { "id": "o1", "text": "Coordinate a meeting with the Pharmacist to identify drug-drug interactions", "isCorrect": true, "rationale": "Managing complex polypharmacy requires interdisciplinary expertise; Certraline and St. John's Wort combined can cause Serotonin Syndrome." },
                    { "id": "o2", "text": "Educate the client to 'Never' take medications from friends", "isCorrect": true, "rationale": "Medication safety begins with education on utilizing only personal, prescribed prescriptions." },
                    { "id": "o3", "text": "Notify the physician of the profound 'Orthostatic Hypotension' (82/44)", "isCorrect": true, "rationale": "The trend in vitals is a high-risk safety finding requiring immediate medical review and dose adjustment." },
                    { "id": "o4", "text": "Perform a 'Beers Criteria' audit on the current medication list", "isCorrect": true, "rationale": "Beers Criteria identifies medications that are potentially inappropriate for the elderly (e.g., Diphenhydramine/Alprazolam) due to fall risk." },
                    { "id": "o5", "text": "Tell the client to stop everything 'Cold Turkey' until the MD sees her", "isCorrect": false, "rationale": "Stopping Sertraline or blood pressure meds 'Cold Turkey' can lead to withdrawal or hypertensive crisis; management must be gradual." },
                    { "id": "o6", "text": "Implement a 'Pill Organizer' intervention with a family member", "isCorrect": true, "rationale": "Improving 'Adherence' and preventing 'Double-dosing' requires structural support for the elderly." }
                ]
            },
            "rationale": {
                "coreConcept": "Medication Reconciliation and Safety",
                "caseSummary": "An 82yo patient has massive polypharmacy and dangerous orthostatic hypotension. The nurse must use interdisciplinary resources to fix the list.",
                "answerAnalysis": "Priority management: 1) Pharmacist collab (o1), 2) Patient safety/Orthostatics (o3), 3) Beers audit (o4), 4) Education/Support (o2, o6). Stopping abruptly (o5) is dangerous.",
                "trap": "Thinking only 'Prescription' meds matter. St. John's Wort and Diphenhydramine (OTC) are just as dangerous in the elderly as prescriptions.",
                "goldenRule": "One Doctor, One Pharmacy, One List. Polypharmacy is the leading cause of falls in the elderly.",
                "steps": [
                    { "tag": "Verify", "description": "Match the bottle labels to the actual pills to ensure no double-dosing." },
                    { "tag": "Analyze", "description": "Identify the 'Synergistic effects' of Sertraline + St. John's Wort + Alprazolam." }
                ],
                "mnemonic": {
                    "title": "B.R.O.W.N. Bag",
                    "content": "B-Bring everything, R-Review every label, O-Observe for doubles, W-Watch for OTC/Herbal, N-Notify MD of discrepancies",
                    "explanation": "Summarizes the Med-Rec process."
                },
                "cheatSheet": {
                    "title": "High Risk Geriatric Meds",
                    "points": [
                        "Anticholinergics (Confusion/Falls).",
                        "Benzodiazepines (Alprazolam).",
                        "Tricyclic Antidepressants.",
                        "NSAIDs (GI Bleed/Renal Risk)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Baroreceptor sensitivity decreases with age, making the elderly more susceptible to orthostatic changes.",
                    "physiology": "Drugs like Sertraline and Amlodipine interact with the CNS and vascular tone; Sertraline + St. John's Wort increases synaptic serotonin levels to toxic levels.",
                    "pharm": "Diphenhydramine (Benadryl) is on the Beers list for the elderly due to severe anticholinergic side effects (delirium, falls)."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Interdisciplinary Evaluation",
                    "clinicalStrategy": "Find the discrepancy between what's written and what's swallowed.",
                    "recommendedActions": ["Involve Pharmacist", "Correct the list", "Fall precautions"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-TERM-D1V2",
        "typeId": "trend",
        "metadata": {
            "title": "Advocacy: Withdrawal of Life-Sustaining Treatment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T16:00:00Z",
            "updatedAt": "2026-01-23T16:00:00Z",
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
            "clinicalFocusTopics": ["Palliative Care", "Ethical Advocacy", "Patient Autonomy"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.P.", "age": 68, "gender": "Female", "allergies": "None", "weightKg": 48, "codeStatus": "Full Code"
                },
                "setting": "Oncology Unit",
                "historyPhysical": {
                    "chiefComplaint": "Metastatic Pancreatic Cancer with liver involvement.",
                    "hpi": "Client has failed her third round of chemotherapy. She is physically exhausted. Her family is very aggressive about finding a 'fourth round' or 'experimental' treatments.",
                    "pmh": ["Stage IV Pancreatic Cancer"],
                    "medications": ["Chemotherapy", "Fentanyl Patch"]
                },
                "history": [
                    { "time": "Mon 0800", "author": "RN Smith", "note": "Client whispers to the nurse: 'I can't do this anymore. I'm so tired. I just want to go home and see my garden. But my kids will be so upset if I give up.'" },
                    { "time": "Mon 1400", "author": "Family Meeting", "note": "Children (Daughter/Son) stating: 'We are fighting this. We want the new immunotherapy. She is a fighter.' Client remains silent during the meeting." },
                    { "time": "Tue 0800", "author": "RN Smith", "note": "Client states clearly: 'I am refusing any more chemo or tests. I want to transition to comfort care today. Please help me tell them.'" }
                ],
                "vitals": [
                    { "time": "Mon", "hr": 82, "rr": 20, "bp": "100/60" },
                    { "time": "Tue", "hr": 108, "rr": 24, "bp": "94/52", "pain": 8 }
                ],
                "labs": [
                    { "test": "Albumin", "value": "2.2", "flag": "L", "ref": "3.5 - 5.0", "unit": "g/dL" }
                ],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the trend and the conflict. Which actions by the nurse demonstrate 'Patient Advocacy' in this management scenario?",
                "options": [
                    { "id": "o1", "text": "Arrange a private meeting between the client and the Palliative Care team", "isCorrect": true, "rationale": "Palliative specialty support helps the patient define their goals without the direct pressure of family present." },
                    { "id": "o2", "text": "Support the family's desire to 'Keep Fighting' because they know the client best", "isCorrect": false, "rationale": "Advocacy is for the *client*, not the family. Supporting family wishes against a competent client's refusal is a failure of advocacy." },
                    { "id": "o3", "text": "Directly inform the family of the client's decision to stop treatment (with client's permission)", "isCorrect": true, "rationale": "The nurse serves as a bridge, ensuring the patient's voice is heard in a safe environment." },
                    { "id": "o4", "text": "Ensure the client's 'Right to Refuse' is documented and the physician is notified immediately", "isCorrect": true, "rationale": "Legal management of care requires that a competent refusal is recorded and and the plan of care modified to 'Comfort Only'." },
                    { "id": "o5", "text": "Encourage the client to try 'just one more dose' to make her kids happy", "isCorrect": false, "rationale": "Coercion into unwanted treatment is unethical and a violation of autonomy." },
                    { "id": "o6", "text": "Coordinate a 'Multidisciplinary Goals of Care' conference including the patient, family, and ethics advisor", "isCorrect": true, "rationale": "Systematic coordination helps resolve family conflict while centering the patient's autonomy." }
                ]
            },
            "rationale": {
                "coreConcept": "Autonomy in Terminal Care",
                "caseSummary": "A patient with stage 4 cancer wants to stop chemo. Family is pushing to continue. The nurse must facilitate the patient's voice and legal refusal.",
                "answerAnalysis": "Advocacy actions: Palliative referral (o1), Bridge communication (o3), Legal documentation (o4), and System coordination (o6). o2/o5 are betrayals of the patient's rights.",
                "trap": "Thinking Palliative Care = Hospice. Palliative care can start any time to help with complex decision making and symptom management.",
                "goldenRule": "The nurse's first duty is to the patient, not the family, and not the curative goal of the doctor.",
                "steps": [
                    { "tag": "Verify", "description": "Ensure the patient is not depressed (which can cloud judgment) but rather has a clear-headed terminal refusal." },
                    { "tag": "Validate", "description": "Ask the patient specifically: 'What are your goals for the time you have left?'" }
                ],
                "mnemonic": {
                    "title": "P.E.A.C.E.",
                    "content": "P-Patient wishes first, E-Ethics support, A-Autonomy respect, C-Coordinate care, E-Explain to family",
                    "explanation": "Summarizes terminal advocacy."
                },
                "cheatSheet": {
                    "title": "Withdrawal of Care",
                    "points": [
                        "Competent adults can stop treatment any time.",
                        "Withdrawal of care is NOT suicide/euthanasia.",
                        "Focus shifts from 'Cure' to 'Comfort/Dignity'."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Pancreatic cancer often compresses the biliary tree and invades local nerve plexuses, causing severe 'boring' abdominal pain.",
                    "physiology": "Advanced cancer causes 'Cachexia' (Albumin 2.2) and extreme fatigue because the tumor consumes the body's metabolic resources.",
                    "pharm": "Fentanyl patches provide long-acting analgesia; breakthrough pain is managed with short-acting opioids."
                },
                "difficulty": {
                    "score": 97,
                    "level": 5,
                    "label": "Compassionate Leadership",
                    "clinicalStrategy": "The patient's 'Final Word' is the only one that counts legally.",
                    "recommendedActions": ["Call Palliative", "Notify MD", "Schedule family meeting"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-TRIAGE-G5H9",
        "typeId": "trend",
        "metadata": {
            "title": "Triage: Managing High-Risk Emergent Arrivals",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T16:10:00Z",
            "updatedAt": "2026-01-23T16:10:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Triage", "Prioritization", "Emergency Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Emergency Department Load", "age": 0, "gender": "N/A"
                },
                "setting": "Emergency Department Triage",
                "historyPhysical": {
                    "chiefComplaint": "Evaluation of 4 new arrivals in the ED.",
                    "hpi": "Four patients walk into the ED triage at the same time. There is only one open bed. The nurse must triage the 'Emergent' load.",
                    "pmh": [],
                    "medications": []
                },
                "history": [
                    { "time": "Client 1", "author": "Triage RN", "note": "4-year-old presenting with sudden drooling, leaning forward, and inspiratory stridor. No cough. Temp 103.1F." },
                    { "time": "Client 2", "author": "Triage RN", "note": "22-year-old male with sudden, severe testicular pain (10/10) that started 1 hour ago. Nausea and vomiting present." },
                    { "time": "Client 3", "author": "Triage RN", "note": "65-year-old male with sharp chest pain that increases with deep breaths. History of recent surgery. Calf is swollen and red." },
                    { "time": "Client 4", "author": "Triage RN", "note": "18-year-old female with a large laceration to the forearm from a kitchen knife. Controlled with pressure. BP stable." }
                ],
                "vitals": [
                    { "time": "Client 1", "rr": 38, "hr": 140, "tempF": "103.1" },
                    { "time": "Client 2", "hr": 110, "pain": 10 },
                    { "time": "Client 3", "hr": 115, "rr": 24, "o2": "92" }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the arrivals. Which triage and prioritization assignments are correct according to the 'Emergent' (Level 1/2) versus 'Urgent' hierarchy?",
                "options": [
                    { "id": "o1", "text": "Client 1: EMERGENT/LEVEL 1 (Epiglottitis suspected)", "isCorrect": true, "rationale": "Sudden drooling, stridor, and leaning forward are the 'Classic Triad' of Epiglottitis; this patient is at risk of total airway occlusion within minutes." },
                    { "id": "o2", "text": "Client 2: EMERGENT/LEVEL 2 (Testicular Torsion suspected)", "isCorrect": true, "rationale": "Testicular torsion is a surgical emergency with a 4-6 hour window before permanent loss of the organ (Life or Limb priority)." },
                    { "id": "o3", "text": "Client 3: EMERGENT/LEVEL 2 (PE suspected)", "isCorrect": true, "rationale": "Sudden chest pain + recent surgery + calf swelling indicates a direct path to Pulmonary Embolism (High mortality risk)." },
                    { "id": "o4", "text": "Client 1 is the 'Highest Priority' for the one open bed", "isCorrect": true, "rationale": "Airway (Client 1) always precedes Organ loss (Client 2) or Potential PE (Client 3) in initial triage." },
                    { "id": "o5", "text": "Client 4: URGENT (Laceration)", "isCorrect": true, "rationale": "While bleeding, it is controlled and vitals are stable; this client can wait until the life-threats are managed." },
                    { "id": "o6", "text": "Client 3 is prioritized over Client 1 because he is older and has surgery history", "isCorrect": false, "rationale": "Prioritization is based on 'A-B-C' and 'Acute Life Threat', not age or surgical history. Epiglottitis (A) overrides PE (B/C) risk." }
                ]
            },
            "rationale": {
                "coreConcept": "Emergency Triage Hierarchy",
                "caseSummary": "The nurse manages a simultaneous arrival of high-risk cases. Airway (Epiglottitis) takes precedence over Organ loss and potential PE.",
                "answerAnalysis": "Correct Triage: o1 (Airway threat), o2 (Organ threat), o3 (Circulation/Embolism threat), o5 (Stable injury). Highest = o1/o4.",
                "trap": "Thinking Testicular Torsion can wait. It can't—it's Level 2. But Epiglottitis is Level 1 (Airway).",
                "goldenRule": "Airway/Breathing > Circulation > Organ Preservation > Stable Injury.",
                "steps": [
                    { "tag": "Apply", "description": "Identify the 'Tripod position' and 'Stridor' as the most lethal cues (Epiglottitis)." },
                    { "tag": "Differentiate", "description": "Compare 'Organ loss' (Torsion) with 'Airway loss' (Epiglottitis)." }
                ],
                "mnemonic": {
                    "title": "A.B.C.-L.L.",
                    "content": "A-Airway, B-Breathing, C-Circulation, L-Life, L-Limb",
                    "explanation": "Summarizes the priority for admission beds."
                },
                "cheatSheet": {
                    "title": "Triage Tags",
                    "points": [
                        "Level 1: Resuscitation (Dead/Near dead).",
                        "Level 2: Emergent (Time-critical, MI, Sepsis, Torsion).",
                        "Level 3: Urgent (Stable but needs resources).",
                        "Level 4: Non-urgent (Sore throat)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The epiglottis covers the trachea during swallowing; inflammation (H. influenzae) causes it to swell over the glottic opening.",
                    "physiology": "Stridor is high-pitched air turbulence through a narrowed upper airway. It means the patient is 'one millimeter' from closure.",
                    "pharm": "Epiglottitis requires immediate IV antibiotics and cool mist oxygen, but NO OROPHARYNGEAL EXAM (Which can cause a laryngospasm)."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Triage Analysis",
                    "clinicalStrategy": "Find the patient who will 'lose' something (Life/Limb/Air) fastest.",
                    "recommendedActions": ["Intubate Client 1", "Stat Doppler for Client 2", "Spiral CT for Client 3"]
                }
            }
        }
    }
];
