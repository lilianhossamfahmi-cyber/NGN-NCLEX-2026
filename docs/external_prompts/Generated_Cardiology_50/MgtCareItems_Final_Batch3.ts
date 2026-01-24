import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 3: Items 9-12)
 * Focus: Patient Rights, Informed Consent, Confidentiality, Continuity of Care
 * STANDARDS:
 * - Difficulty Level 5
 * - Explicit 'trendTable' Structure
 * - New IDs to force Fresh Render
 */

export const MgtCareItems_Final_Batch3: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-CNST-AB12", // NEW ID
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Informed Consent & Advocacy",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:21:00.000Z",
            "updatedAt": "2026-01-23T19:21:00.000Z",
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
            "clinicalFocusTopics": ["Informed Consent", "Patient Rights", "Advocacy"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Pre-Op Holding", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 06:00", "room": "Pre-Op 4", "physician": "Dr. Surgeon", "nurse": "RN Staff", "isolation": "N/A"
                },
                "setting": "Pre-Operative Unit",
                "historyPhysical": {
                    "chiefComplaint": "Consent Validity Check",
                    "hpi": "Client scheduled for Total Knee Arthroplasty (Right). Surgeon has marked the site. Consent form pending signature.",
                    "pmh": ["Osteoarthritis"],
                    "medications": ["Midazolam (Versed)"]
                },
                "history": [
                    { "time": "06:00", "author": "RN", "note": "IV started. Vital signs stable." },
                    { "time": "06:15", "author": "Anesthesia", "note": "Midazolam 2mg IV given for pre-op anxiety." },
                    { "time": "06:30", "author": "Surgeon", "note": "Arrived to discuss risks/benefits. Client drowsy but arouses to voice." }
                ],
                "vitals": [
                    { "time": "06:00", "tempF": "98.4", "hr": 72, "rr": 16, "bp": "128/78", "o2": "98", "o2_device": "RA", "pain": 2 },
                    { "time": "06:30", "tempF": "98.3", "hr": 68, "rr": 14, "bp": "110/60", "o2": "96", "o2_device": "RA", "pain": 1 }
                ],
                "labs": [],
                "orders": [
                    { "order": "Obtain Informed Consent", "status": "Pending", "indication": "Surgical Requirement" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the consent process timeline. Which actions by the nurse are legally required given the sequence of events?",
                "trendTable": {
                    "columns": ["Time", "Event", "Patient Status", "nurse Action Required?"],
                    "rows": [
                        ["06:00", "Admission", "Alert & Oriented x4", "Verify ID / Site Mark"],
                        ["06:15", "Sedation Given", "Midazolam (Benzodiazepine)", "Monitor Safety"],
                        ["06:30", "Surgeon Explains", "Drowsy / Under Influence", "Assess Competency"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Stop the surgeon from obtaining the signature at 06:30", "isCorrect": true, "rationale": "Patient is under the influence of sedatives (Midazolam). Legal competency to sign is void." },
                    { "id": "o2", "text": "Allow the spouse (Next of Kin) to sign the consent form", "isCorrect": true, "rationale": "If the patient is temporarily incapacitated (sedated) and surgery is scheduled, the legal surrogate can sign." },
                    { "id": "o3", "text": "Witness the patient's signature since they arouse to voice", "isCorrect": false, "rationale": "Arousal does not equal legal competence. Sedation invalidates the signature." },
                    { "id": "o4", "text": "Document the administration of preoperative sedation prior to consent", "isCorrect": true, "rationale": "Clear documentation of the timeline proves the consent was invalidly timed." },
                    { "id": "o5", "text": "Call the Surgery Center manager to report a 'Sentinel Event'", "isCorrect": false, "rationale": "This is a 'Canceled/Delayed Case' or 'Process Error', not a Sentinel Event (unless surgery happened without consent)." },
                    { "id": "o6", "text": "Proceed with surgery as 'Implied Consent'", "isCorrect": false, "rationale": "Implied consent is for life-threatening emergencies only. A Knee Replacement is elective." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The trend here is the timing of 'Meds vs Consent'. Once the Versed goes in, the pen cannot touch the paper. The nurse's role is Gatekeeper of Legality.",
                "optionReview": "Option 1 (Stop) is correct advocacy. Option 2 (Spouse) is the correct legal workaround. Option 3 (Witness) is illegal/malpractice. Option 4 (Doc) is correct. Option 6 (Implied) is for trauma only.",
                "clinicalLogic": "Competency is a prerequisite for Consent. Sedatives (Benzos, Opioids) remove legal competency for hours. The nurse must verify consent was signed BEFORE sedation.",
                "strategy": "Timeline Analysis: Did the drug come before the ink? If Yes -> Invalid Consent.",
                "knowledge": "Informed Consent: Must be voluntary, informed, and COMPETENT. Sedation = Incompetent."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-HIPAA-CD34", // NEW ID
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Confidentiality & Social Media",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:22:00.000Z",
            "updatedAt": "2026-01-23T19:22:00.000Z",
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
            "clinicalFocusTopics": ["HIPAA", "Social Media", "Professionalism"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Celebrity Patient", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 14:00", "room": "VIP Suite", "physician": "Dr. Famous", "nurse": "RN Staff", "isolation": "N/A"
                },
                "setting": "VIP Unit",
                "historyPhysical": {
                    "chiefComplaint": "Privacy Breach Risk",
                    "hpi": "Famous athlete admitted for overdose. Unit is locked down.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "14:00", "author": "Security", "note": "VIP Protocol activated. Pseudonym 'John Doe' assigned." },
                    { "time": "14:30", "author": "Charge RN", "note": "Noticed two staff members (not assigned) looking at chart." },
                    { "time": "14:45", "author": "Public Relations", "note": "Photo circulating on Twitter showing the patient's room number and a nurse's reflection." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the sequence of privacy breaches. Which actions must the Charge Nurse take IMMEDIATELY?",
                "trendTable": {
                    "columns": ["Time", "Event", "Breach Check", "Action Needed"],
                    "rows": [
                        ["14:00", "Pseudonym Use", "Secure", "Maintain Protocol"],
                        ["14:30", "Unassigned Staff Access", "Internal Breach", "Audit Logs / Report"],
                        ["14:45", "Social Media Photo", "External Breach", "Legal / HR / IT Notification"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Immediately report the unassigned staff members to the Privacy Officer", "isCorrect": true, "rationale": "Accessing a record without a 'Need to Know' is a federal HIPAA violation." },
                    { "id": "o2", "text": "Contact IT Security to locate and delete the social media post", "isCorrect": false, "rationale": "Nurses/Hospitals cannot delete posts from Twitter. Legal/PR handles external takedowns. The nurse manages the internal leak." },
                    { "id": "o3", "text": "Identify the staff member in the photo reflection and remove them from the unit", "isCorrect": true, "rationale": "Immediate removal prevents further compromise. HR investigation follows." },
                    { "id": "o4", "text": "Confirm the patient's status to the press to control the rumors", "isCorrect": false, "rationale": "Confirming presence is a HIPAA violation. 'No information available' is the only response." },
                    { "id": "o5", "text": "Reinforce the 'No Cell Phone' policy in the medication room/nurses station", "isCorrect": true, "rationale": "Preventative action for remaining staff." },
                    { "id": "o6", "text": "Change the patient's room and pseudonym immediately", "isCorrect": true, "rationale": "The location is compromised (Room # visible). Safety requires moving the target." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "This scenario covers the 'Social Media' aspect of HIPAA. The trend shows a rapid escalation from internal snooping to external leak. The Charge Nurse is the Incident Commander.",
                "optionReview": "Option 1 (Report snooping) is mandatory. Option 3 (Remove leaker) is safety. Option 5 (Policy) is leadership. Option 6 (Move patient) is safety/privacy rescue. Option 2 (Delete internet) is impossible. Option 4 (Talk to press) is fatal error.",
                "clinicalLogic": "HIPAA Rule: Information defaults to Closed. Only 'Treatment, Payment, Operations' (TPO) allows access. Curiosity is not TPO.",
                "strategy": "Control the Environment. Leak detected -> Plug the hole (Remove staff) -> Move the asset (Move patient) -> Report to authority (Privacy Officer).",
                "knowledge": "Posting workplace photos, even without names, can violate privacy if context cues (room numbers, dates) reveal identity."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-CONT-EF56", // NEW ID
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Continuity of Care: Hand-off Report",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:23:00.000Z",
            "updatedAt": "2026-01-23T19:23:00.000Z",
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
            "clinicalFocusTopics": ["Hand-off Communication", "SBAR", "Safety"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Change of Shift", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 19:00", "room": "Unit", "physician": "N/A", "nurse": "PM Shift", "isolation": "N/A"
                },
                "setting": "Medical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Incomplete Report",
                    "hpi": "Night shift nurse receiving report on 4 patients from a Traveler RN.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "19:00", "author": "Traveler RN", "note": "Gives report." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the hand-off report statements below. Which items represent a SAFETY GAP requiring immediate clarification?",
                "trendTable": {
                    "columns": ["Patient", "Report Statement Given", "Category", "Safety Status"],
                    "rows": [
                        ["Pt A", "'He's a little confused but fine. Family is difficult.'", "Assessment", "VAGUE (Unsafe)"],
                        ["Pt B", "'Received Lasix 40mg at 18:00. Urine output 400mL since.'", "Intervention/Response", "CLEAR (Safe)"],
                        ["Pt C", "'Going for surgery tomorrow. I think the consent is done.'", "Plan", "UNCERTAIN (Unsafe)"],
                        ["Pt D", "'BP was low earlier, but he looks okay now.'", "Vitals", "NO DATA (Unsafe)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Clarify Patient A's baseline orientation and specific confusion behaviors", "isCorrect": true, "rationale": "'Confused' is subjective. Is it new? Dementia? Delirium? Baseline must be known to detect strokes/sepsis." },
                    { "id": "o2", "text": "Accept the report for Patient B as complete", "isCorrect": true, "rationale": "Action (Lasix) + Result (400mL) covers the pertinent safety loop." },
                    { "id": "o3", "text": "Verify the physical location of the signed consent for Patient C immediately", "isCorrect": true, "rationale": "'I think' is dangerous. Pre-op checklist must be verified before the AM rush." },
                    { "id": "o4", "text": "Demand specific systolic/diastolic numbers and time of the low BP for Patient D", "isCorrect": true, "rationale": "'Low' is subjective. 80/40 is different from 100/60. Trends require numbers." },
                    { "id": "o5", "text": "Ask what makes the family 'difficult' for Patient A", "isCorrect": true, "rationale": "While subjective, this affects staff safety. Is it violence? Anxiety? Complaints? Knowing prepares the nurse." },
                    { "id": "o6", "text": "Report the Traveler RN for incompetence based on this report", "isCorrect": false, "rationale": "Clarification is the first step. Reporting is for persistent negligence or patient harm." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "Hand-off is the #1 cause of medical errors. This trend analyzes the 'Quality of Information'. Vague info = Danger.",
                "optionReview": "Option 1 (Clarify confusion) is critical neuro safety. Option 2 (Pt B) is a model report. Option 3 (Verify Consent) prevents surgical delay. Option 4 (Specific BP) is mandatory for hemodynamic monitoring. Option 5 (Define difficult) is staff safety.",
                "clinicalLogic": "SBAR Rule: Assessment must be Objective. 'Looks okay' is not an assessment. 'BP 110/70' is an assessment.",
                "strategy": "Red Flag words in report: 'Fine', 'Okay', 'I think', 'Stable'. Always ask: 'What is the number?' 'Compared to what?'",
                "knowledge": "Joint Commission requires standardized hand-off communication (SBAR)."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ETHIC-GH78", // NEW ID
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Ethics: Resource Allocation",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:24:00.000Z",
            "updatedAt": "2026-01-23T19:24:00.000Z",
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
            "clinicalFocusTopics": ["Justice", "Resource Allocation", "Ethics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "ICU Triage", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 23:00", "room": "ICU", "physician": "Critical Care", "nurse": "House Supervisor", "isolation": "N/A"
                },
                "setting": "ICU (Full Capacity)",
                "historyPhysical": {
                    "chiefComplaint": "1 Bed Available, 2 Patients Needing it.",
                    "hpi": "House Supervisor must decide who gets the last ICU bed.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "23:00", "author": "ER", "note": "Patient X: 24yo Male, MVA, ruptured spleen, unstable. Survival chance 90% with ICU." },
                    { "time": "23:05", "author": "Floor", "note": "Patient Y: 88yo Female, End-stage COPD + Heart Failure, septic shock. Survival chance 10% with ICU." }
                ],
                "vitals": [],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the ethical allocation data. Which decision and rationale aligns with the principle of JUSTICE and UTILITARIANISM?",
                "trendTable": {
                    "columns": ["Patient", "Age", "Condition", "Prognosis w/ ICU", "Prognosis w/o ICU"],
                    "rows": [
                        ["Patient X", "24", "Trauma / Bleed", "Good (Recoverable)", "Death (Imminent)"],
                        ["Patient Y", "88", "Septic Shock / Multi-organ", "Poor (likely terminal)", "Death (Imminent)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Allocate the bed to Patient X (24yo Trauma)", "isCorrect": true, "rationale": "Utilitarianism: Greatest good for the greatest number (or years of life). Patient X has high survivability and long life expectancy." },
                    { "id": "o2", "text": "Transfer Patient Y to a hospice/palliative care unit/bed if available", "isCorrect": true, "rationale": "Non-abandonment: Even if ICU is denied, care must continue focusing on comfort/dignity." },
                    { "id": "o3", "text": "Split the ventilator between both patients", "isCorrect": false, "rationale": "Unsafe/Impossible standard of care." },
                    { "id": "o4", "text": "Give the bed to Patient Y because they are older and 'waited longer'", "isCorrect": false, "rationale": "Age seniority doesn't dictate medical triage; prognosis does." },
                    { "id": "o5", "text": "Consult the Ethics Committee immediately", "isCorrect": false, "rationale": "Emergency Triage happens in minutes; Ethics committees take hours/days. The Supervisor must decide NOW." },
                    { "id": "o6", "text": "Explain to Patient Y's family that care is being 'Futile'", "isCorrect": true, "rationale": "Transparent communication about why aggressive care is not being offered is part of ethical practice." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "Resource Allocation is the hardest part of management. The ethical framework used in triage is Utilitarianism (Medical Utility) - who benefits most?",
                "optionReview": "Option 1 (Give to X) is the correct application of Justice/Utility. Option 2 (Hospice Y) provides alternative care. Option 6 (Communication) is essential. Option 4 (Age) is not a triage criterion. Option 5 (Ethics) is too slow for active bleeding.",
                "clinicalLogic": "Survivability x Life Expectancy. Patient X > Patient Y. Therefore, resource goes to X.",
                "strategy": "Remove emotion. Look at the 'Return on Investment' for the resource. High chance of recovery vs Low chance.",
                "knowledge": "Justice: Fair distribution of scarce resources based on medical need and likelihood of benefit."
            }
        }
    }
];
