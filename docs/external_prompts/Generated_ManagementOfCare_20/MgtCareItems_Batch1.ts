import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * PREMIUM MANAGEMENT OF CARE ITEMS (Batch 1: Items 1-3 of 20)
 * Topic: Management of Care (NCLEX Client Need)
 * Standards: Level 5, 3-Point Trends, 6-Option SATA, Expert Rationales
 */

export const MgtCareItems_Batch1: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-PRIORITIZE-A1B2",
        "typeId": "trend",
        "metadata": {
            "title": "Prioritization: Recognizing the Most Unstable Client",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:40:00Z",
            "updatedAt": "2026-01-23T13:40:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Prioritization", "Triage", "Shift Reports"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Change-of-Shift Report", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Evaluation of 4 assigned clients.",
                    "hpi": "The nurse is receiving report on four clients at the start of the 0700 shift. To determine the priority, the nurse reviews the electronic health record (EHR) trends for the previous 24 hours.",
                    "pmh": ["Diverse PMH per client"],
                    "medications": ["Diverse medications per client"]
                },
                "history": [
                    { "time": "Mon 1900", "author": "Night RN", "note": "Client A (Asthma): Peak flow 400. Lung sounds with mild expiratory wheeze. O2 96% on RA." },
                    { "time": "Tue 0200", "author": "Night RN", "note": "Client A: Peak flow 320. Lung sounds with increased wheezing. Received albuterol nebulizer." },
                    { "time": "Tue 0630", "author": "Night RN", "note": "Client A: Peak flow 180. Lung sounds are 'silent' on auscultation. Appears exhausted. O2 89% on RA." }
                ],
                "vitals": [
                    { "time": "Mon 1900", "tempF": "98.6", "hr": 82, "rr": 18, "bp": "120/80", "o2": "96", "o2_device": "RA", "pain": 0 },
                    { "time": "Tue 0200", "tempF": "98.8", "hr": 98, "rr": 24, "bp": "124/82", "o2": "93", "o2_device": "RA", "pain": 2 },
                    { "time": "Tue 0630", "tempF": "98.5", "hr": 122, "rr": 32, "bp": "112/68", "o2": "89", "o2_device": "2L NC", "pain": 4 }
                ],
                "labs": [
                    { "test": "Arterial pH", "value": "7.32", "time": "0630", "flag": "L", "ref": "7.35 - 7.45", "unit": "N/A" },
                    { "test": "PaCO2", "value": "52", "time": "0630", "flag": "H", "ref": "35 - 45", "unit": "mmHg" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend from 1900 to 0630. Which findings indicate the nurse should prioritize Client A over all others in the 'First to See' category?",
                "options": [
                    { "id": "o1", "text": "Progression to 'silent chest' on auscultation (Tue 0630)", "isCorrect": true, "rationale": "A 'silent chest' in an asthma client indicates that air movement has ceased entirely; this is a life-threatening emergency preceding respiratory arrest." },
                    { "id": "o2", "text": "Decline in Peak Flow from 400 to 180", "isCorrect": true, "rationale": "A drop below 50% of personal best indicates the 'Red Zone' of asthma management requiring immediate intervention." },
                    { "id": "o3", "text": "Trend of increasing tachycardia (82 to 122 bpm)", "isCorrect": true, "rationale": "Tachycardia is a compensatory mechanism for worsening hypoxia and respiratory distress." },
                    { "id": "o4", "text": "New requirement for supplemental oxygen (Tue 0630)", "isCorrect": true, "rationale": "Progressing from Room Air to needing 2L NC while still being hypoxic (89%) indicates primary respiratory failure." },
                    { "id": "o5", "text": "Presence of a mild expiratory wheeze (Mon 1900)", "isCorrect": false, "rationale": "This was the baseline finding and was the least concerning point in the trend; wheezing is better than 'silent'." },
                    { "id": "o6", "text": "Respiratory Acidosis (pH 7.32, PaCO2 52)", "isCorrect": true, "rationale": "Rising CO2 in an asthma attack indicates the client is tiring and can no longer blow off CO2, signaling impending failure." }
                ]
            },
            "rationale": {
                "coreConcept": "Prioritization: ABCs and Clinical Urgency",
                "caseSummary": "A client with asthma shows a 12-hour deterioration trend ending in a silent chest and respiratory acidosis. This is the highest priority for the RN.",
                "answerAnalysis": "The diagnosis is Respiratory Failure/Status Asthmaticus. Correct options (o1, o2, o3, o4, o6) all identify markers of instability. o1 is the most critical as it means total airway obstruction.",
                "trap": "Thinking that 'wheezing' is worse than 'silent'. Silent is always worse in respiratory emergencies.",
                "goldenRule": "Prioritize patients who are 'unstable' over those who are 'stable', and 'acute' over 'chronic'. Airway/Breathing always comes first.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify that wheezing stopping (silent chest) is worse than the wheezing itself." },
                    { "tag": "Analyze", "description": "Relate the Peak Flow drop to the physiological inability to move air." }
                ],
                "mnemonic": {
                    "title": "A.B.C.",
                    "content": "A-Airway, B-Breathing, C-Circulation",
                    "explanation": "Standard priority hierarchy for the NCLEX."
                },
                "cheatSheet": {
                    "title": "Asthma Red Zone",
                    "points": [
                        "Peak Flow < 50% personal best.",
                        "Use of accessory muscles.",
                        "Silent chest (No breath sounds).",
                        "Inability to speak in full sentences."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The bronchioles lose their patency due to smooth muscle spasm and mucosal edema.",
                    "physiology": "V/Q mismatching leads to hypoxia. Initially, clients blow off CO2 (Alkalosis), but as they tire, CO2 rises (Acidosis), indicating failure.",
                    "pharm": "Short-acting beta-agonists (Albuterol) are first, followed by systemic corticosteroids."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Evaluation",
                    "clinicalStrategy": "Look for the client who is moving toward 'dead' fastest (The silent chest).",
                    "recommendedActions": ["Stat Albuterol", "Prepare for intubation", "Notify MD"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-DELEGATE-K3L4",
        "typeId": "trend",
        "metadata": {
            "title": "Delegation: Re-evaluating the LPN Assignment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:45:00Z",
            "updatedAt": "2026-01-23T13:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Delegation", "Scope of Practice", "LPN/LVN Roles"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.S.", "age": 42, "gender": "Female", "allergies": "NKDA", "weightKg": 68, "codeStatus": "Full Code"
                },
                "setting": "Neurology Unit",
                "historyPhysical": {
                    "chiefComplaint": "Spinal cord injury follow-up care.",
                    "hpi": "Client has a known T4 spinal cord injury (SCI) from 6 months ago. She was admitted for management of a stage 3 pressure injury. She was originally assigned to the Licensed Practical Nurse (LPN) as she was considered stable and required only routine care and wound dressing changes.",
                    "pmh": ["T4 Spinal Cord Injury", "Neurogenic Bladder", "Chronic Pain"],
                    "medications": ["Baclofen", "Gabapentin", "Enoxaparin (Prophylaxis)"]
                },
                "history": [
                    { "time": "0800", "author": "LPN Garcia", "note": "Client alert and oriented. Dressing changed to sacrum. Wound bed pink. No complaints of pain." },
                    { "time": "1000", "author": "LPN Garcia", "note": "Client reports a 'splitting headache'. BP has risen significantly. Skin appears flushed above the level of injury. RN notified." },
                    { "time": "1015", "author": "RN Chen", "note": "Client now showing bradycardia. Profuse sweating on face. Suspected Autonomic Dysreflexia. RN takes over direct care." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.2", "hr": 78, "rr": 16, "bp": "118/72", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "1000", "tempF": "98.4", "hr": 62, "rr": 20, "bp": "162/98", "o2": "97", "o2_device": "RA", "pain": 8 },
                    { "time": "1015", "tempF": "98.5", "hr": 52, "rr": 22, "bp": "188/110", "o2": "96", "o2_device": "RA", "pain": 10 }
                ],
                "labs": [
                    { "test": "WBC", "value": "12.0", "ref": "4.5 - 11.0", "unit": "10^3/uL" }
                ],
                "orders": [
                    { "order": "Nifedipine 10mg sublingual (PRN)", "status": "Active", "indication": "Severe Hypertension" },
                    { "order": "Change Foley Catheter", "status": "Active", "indication": "Assess for obstruction" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The RN evaluates the trend from 0800 to 1015. Why must the RN take over direct care and stop delegating this client to the LPN?",
                "options": [
                    { "id": "o1", "text": "The client has become clinically unstable", "isCorrect": true, "rationale": "LPNs should only be assigned stable clients with predictable outcomes. Autonomic Dysreflexia is an unstable medical emergency." },
                    { "id": "o2", "text": "The patient now requires 'Complex Assessment' of neurological function", "isCorrect": true, "rationale": "Initial and complex assessments are the sole responsibility of the RN." },
                    { "id": "o3", "text": "The trend indicates a high risk for seizures or stroke (Acute complication)", "isCorrect": true, "rationale": "Managing acute, life-threatening complications exceeds the LPN scope of practice." },
                    { "id": "o4", "text": "The client requires IV antihypertensive titration (if ordered)", "isCorrect": true, "rationale": "LPNs generally cannot manage titrated IV medications (depending on state board, but standard for NCLEX)." },
                    { "id": "o5", "text": "The task of changing a sacral dressing is too 'dirty' for an LPN", "isCorrect": false, "rationale": "LPNs are skilled and qualified for complex wound care; this is not the reason for re-assignment." },
                    { "id": "o6", "text": "The client requires immediate 'Nursing Judgment' to identify the trigger", "isCorrect": true, "rationale": "Identifying the cause of a new crisis (e.g., bladder distension vs fecal impaction) requires advanced clinical judgment." }
                ]
            },
            "rationale": {
                "coreConcept": "Delegation and Scope: RN vs LPN",
                "caseSummary": "A stable patient with SCI develops Autonomic Dysreflexia. The RN must resume care because the situation is no longer 'stable' or 'predictable'.",
                "answerAnalysis": "Correct options (o1, o2, o3, o4, o6) reflect the core criteria for RN-only care: Instability, Complex Assessment, and High Risk. o5 is a distractor based on an incorrect assumption of LPN skills.",
                "trap": "Thinking an LPN cannot do wound care (they can). The reason to take the patient back is the BLOOD PRESSURE and HEART RATE trend, not the wound.",
                "goldenRule": "RNs = E.A.T. (Evaluate, Assess, Teach). LPNs = Stable, Predictable clients with established plans.",
                "steps": [
                    { "tag": "Analyze", "description": "Detect the shift from 118/72 to 188/110." },
                    { "tag": "Apply", "description": "Apply the rule: If a patient 'breaks' (becomes unstable), the RN must take them back." }
                ],
                "mnemonic": {
                    "title": "E.A.T.",
                    "content": "E-Evaluate, A-Assess (Initial/Complex), T-Teach",
                    "explanation": "These three actions can NEVER be delegated by the RN."
                },
                "cheatSheet": {
                    "title": "LPN Scope (NCLEX)",
                    "points": [
                        "Monitor findings (don't analyze).",
                        "Perform standard procedures (Suction, Foley, Wound).",
                        "Administer meds (NOT high-risk IV).",
                        "Care for STABLE clients ONLY."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The sympathetic nervous system below the level of injury (T4) triggers vasoconstriction.",
                    "physiology": "Autonomic Dysreflexia occurs when a noxious stimulus (usually bladder/bowel) causes a massive sympathetic discharge that the brain cannot counteract due to the spinal cord block.",
                    "pharm": "Nifedipine or Hydralazine are used to rapidly lower BP to prevent cerebral hemorrhage."
                },
                "difficulty": {
                    "score": 93,
                    "level": 5,
                    "label": "High Stakes Management",
                    "clinicalStrategy": "Identify when the 'standard assignment' turns into a 'critical rescue'.",
                    "recommendedActions": ["Sit patient up", "Check bladder", "Notify MD"]
                }
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ETHICS-P7R8",
        "typeId": "trend",
        "metadata": {
            "title": "Ethics & Advocacy: Progression of Decisional Conflict",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:50:00Z",
            "updatedAt": "2026-01-23T13:50:00Z",
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
            "clinicalFocusTopics": ["Informed Consent", "Advocacy", "Ethical Dilemmas"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.V.", "age": 88, "gender": "Male", "allergies": "NKDA", "weightKg": 62, "codeStatus": "Full Code"
                },
                "setting": "Surgical Pre-op Holding",
                "historyPhysical": {
                    "chiefComplaint": "Scheduled for Hip ORIF (Open Reduction Internal Fixation).",
                    "hpi": "Client fell at home 48 hours ago and sustained a left hip fracture. He is scheduled for surgery today. He has mild dementia but was oriented x3 at the time of admission. The surgeon obtained consent on the day of admission. Now, in pre-op, the nurse is reviewing the chart and talking to the client.",
                    "pmh": ["Hip Fracture", "Mild Dementia", "Hypertension"],
                    "medications": ["Morphine 2mg IV (15 mins ago)", "Lisinopril", "Aspirin (held)"]
                },
                "history": [
                    { "time": "Mon 1400", "author": "MD Smith", "note": "Surgery explained to client. Risks/Benefits discussed. Consent form signed by client. Client oriented." },
                    { "time": "Tue 0800", "author": "RN Chen", "note": "Client appears confused about why he is in the hospital. Asks, 'When can I go home to my mother?' (Mother is deceased)." },
                    { "time": "Tue 0815", "author": "RN Chen", "note": "Morphine 2mg IV administered for 8/10 hip pain. Client becomes drowsy." }
                ],
                "vitals": [
                    { "time": "Mon 1400", "tempF": "98.2", "hr": 72, "rr": 16, "bp": "138/84", "o2": "98" },
                    { "time": "Tue 0800", "hr": 88, "bp": "142/88", "pain": 8 }
                ],
                "labs": [],
                "orders": [
                    { "order": "Final Surgical Checklist", "status": "In Progress", "indication": "Compliance" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and timeline. Which factors render the existing surgical consent INVALID and require the nurse to stop the procedure?",
                "options": [
                    { "id": "o1", "text": "Client is currently under the influence of IV Morphine (Tue 0815)", "isCorrect": true, "rationale": "Consent cannot be obtained or validated if the client is under the influence of mind-altering medications (opioids)." },
                    { "id": "o2", "text": "Client is confused and asking for his deceased mother (Tue 0800)", "isCorrect": true, "rationale": "Fluctuating mental status and lack of orientation (Dementia progression/Delirium) mean the client cannot currently validate their understanding of the surgery." },
                    { "id": "o3", "text": "The surgeon, not the nurse, is responsible for explaining the procedure", "isCorrect": false, "rationale": "While true, this doesn't make the *existing* consent invalid; it is a point of role definition, not a disqualifier of the document." },
                    { "id": "o4", "text": "Client's age of 88 years", "isCorrect": false, "rationale": "Age alone does not determine competency or validity of consent." },
                    { "id": "o5", "text": "Consent was obtained 48 hours ago (Mon 1400)", "isCorrect": false, "rationale": "Consent typically remains valid for the duration of the admission/procedure timeline unless the patient's condition or mind changes significantly." },
                    { "id": "o6", "text": "Loss of decisional capacity since the signing of the form", "isCorrect": true, "rationale": "Decisional capacity must exist at the time the 'Surgical Time-Out' confirms the patient's desire to proceed. The trend shows he no longer knows why he is there." }
                ]
            },
            "rationale": {
                "coreConcept": "Validity of Informed Consent",
                "caseSummary": "An elderly patient with dementia signed consent. However, by the time of surgery, he is confused and medicated with an opioid. The nurse must advocate and halt the process.",
                "answerAnalysis": "Consent is invalid if the patient lacks capacity due to illness (o2, o6) or medication (o1). The nurse's role is to ensure these criteria are met before the knife touches skin.",
                "trap": "Thinking the nurse needs to 're-explain' the surgery. No—the nurse needs to 'stop' the surgery and notify the surgeon/ethics committee/legal representative.",
                "goldenRule": "Consent is a PROCESS, not a piece of paper. If the patient's mind changes or becomes clouded, the paper is worthless.",
                "steps": [
                    { "tag": "Verify", "description": "Check the medication log for recent sedatives/opioids." },
                    { "tag": "Assess", "description": "Verify orientation and understanding immediately before surgery." }
                ],
                "mnemonic": {
                    "title": "V.I.C.",
                    "content": "V-Voluntary, I-Informed, C-Capacity",
                    "explanation": "The three pillars of valid consent."
                },
                "cheatSheet": {
                    "title": "Nurse's Role in Consent",
                    "points": [
                        "Witness the signature.",
                        "Verify the client is competent.",
                        "Confirm the surgeon provided the explanation.",
                        "ADVOCATE if the client has new questions."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The prefrontal cortex is responsible for executive decision-making and consent.",
                    "physiology": "Delirium (acute confusion) in the elderly can be triggered by pain, opioids, or UTI, temporarily removing decisional capacity.",
                    "pharm": "Morphine is a mu-opioid receptor agonist that causes central nervous system depression, making legal 'informed' consent impossible."
                },
                "difficulty": {
                    "score": 90,
                    "level": 5,
                    "label": "Legal/Ethical Analysis",
                    "clinicalStrategy": "Look for ANY change in mental status or medication status after the form was signed.",
                    "recommendedActions": ["Hold surgery", "Notify surgeon", "Identify Medical Power of Attorney"]
                }
            }
        }
    }
];
