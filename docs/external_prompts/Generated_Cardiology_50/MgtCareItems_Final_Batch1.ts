import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 1: Items 1-4)
 * Focus: Delegation, Prioritization, Assignment
 * REVISED: Strict 4-Section Preview, 5-Part Rationale, Sequential Timestamps, 
 *          FIXED: TrendTable Structure for Renderer, Difficulty Level 5.
 */

export const MgtCareItems_Final_Batch1: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-DELEG-A1B2",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Delegation and Priority assessment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:11:00.000Z",
            "updatedAt": "2026-01-23T18:11:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5, // FIXED: Level 5
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Delegation", "Scope of Practice", "Prioritization"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Unit Assignment Status", "age": 0, "gender": "F", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today 07:00", "room": "MedSurg-12", "physician": "Dr. S. Specialist", "nurse": "RN Staff", "isolation": "Standard"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Deteriorating Patient Status & Staffing Crisis",
                    "hpi": "Charge nurse is managing a 28-bed unit. RN Staffing is reduced by 1 (Sick call). Patient in Room 302 (Admitted for Pneumonia) has showing signs of decline over the last 2 hours.",
                    "pmh": ["Assignments: 2 RNs, 1 LPN, 1 UAP"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "07:00", "author": "Charge RN", "note": "Shift Huddle: Unit fully staffed. Patient 302 stable. UAP assigned to baths/vitals for hallway A." },
                    { "time": "08:30", "author": "Charge RN", "note": "Emergency: RN Miller called away for family emergency. Remaining staff must absorb load. Patient 302 reports 'feeling short of breath' to UAP." },
                    { "time": "08:45", "author": "LPN", "note": "Patient 302 assessed. O2 sat 88%. Nebulizer treatment given. Requesting RN evaluation." }
                ],
                "vitals": [
                    { "time": "07:00", "tempF": "98.6", "hr": 88, "rr": 18, "bp": "128/74", "o2": "95", "o2_device": "RA", "pain": 0 },
                    { "time": "08:30", "tempF": "100.4", "hr": 102, "rr": 24, "bp": "140/88", "o2": "89", "o2_device": "2L NC", "pain": 2 },
                    { "time": "08:45", "tempF": "100.8", "hr": 115, "rr": 28, "bp": "152/94", "o2": "88", "o2_device": "4L NC", "pain": 4 }
                ],
                "labs": [
                    { "test": "WBC", "value": "14.5", "flag": "H", "ref": "4.5-11.0", "unit": "k/cumm" },
                    { "test": "Lactate", "value": "2.4", "flag": "H", "ref": "0.5-2.0", "unit": "mmol/L" }
                ],
                "orders": [
                    { "order": "Transfer to ICU if O2 < 90% on 4L", "status": "Active", "indication": "Protocol" },
                    { "order": "Blood Cultures x2 for Temp > 100.4", "status": "Active", "indication": "Sepsis" }
                ],
                "radiology": [
                    { "study": "CXR", "findings": "Extensive LLL consolidation vs effusion.", "impression": "Worsening Pneumonia", "date": "08:00" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the staffing crisis and Patient 302's progression. Which delegation and assignment decisions are SAFE?",
                // FIXED: Direct TrendTable for TrendRenderer.tsx
                "trendTable": {
                    "columns": ["Time", "Temp", "HR", "RR", "BP", "SpO2"],
                    "rows": [
                        ["07:00", "98.6", 88, 18, "128/74", "95% (RA)"],
                        ["08:30", "100.4", 102, 24, "140/88", "89% (2L NC)"],
                        ["08:45", "100.8", 115, 28, "152/94", "88% (4L NC)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Assign the LPN to perform the 'Transfer Assessment' for Patient 302's move to ICU", "isCorrect": false, "rationale": "Transfer/Discharge assessments are comprehensive and require RN judgment." },
                    { "id": "o2", "text": "Delegate the collection of Blood Cultures (Orders) to the LPN", "isCorrect": true, "rationale": "Sterile specimen collection is within the LPN scope of practice." },
                    { "id": "o3", "text": "Assign the UAP to obtain Vital Signs every 15 minutes for Patient 302", "isCorrect": false, "rationale": "Patient 302 is unstable (O2 88%, RR 28); unstable patients require RN/LPN assessment of vitals, not UAP delegation." },
                    { "id": "o4", "text": "Charge Nurse personally assumes care of Patient 302 until ICU transfer", "isCorrect": true, "rationale": "The most unstable patient requires the highest level of provider available during a crisis." },
                    { "id": "o5", "text": "Delegate the administration of IV Push Lopressor (Metoprolol) to the LPN", "isCorrect": false, "rationale": "IV Push cardiac medications are generally outside LPN scope (or require specific unit protocols not listed)." },
                    { "id": "o6", "text": "Assign the UAP to assist Patient 302 with a bed bath to reduce fever", "isCorrect": false, "rationale": "Moving/bathing an unstable hypoxic patient increases O2 demand and is unsafe." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The scenario presents a 'Staffing Crisis' intersected with a 'Deteriorating Patient'. Patient 302 describes a clear downward trend (Hypoxia, Tachypnea, Fever) indicating Sepsis/worsening Pneumonia. The core task is to identify which tasks involve 'T.A.P.E.' (Teaching, Assessment, Planning, Evaluation) and keep them with the RN, while maximizing LPN/UAP utility for stable tasks.",
                "optionReview": "Option 1 (LPN Assess) is unsafe; unstable transfers require RN. Option 2 (LPN Labs) is correct/safe technical skill. Option 3 (UAP Vitals) is unsafe; the patient is unstable, so vitals = assessment. Option 4 (Charge RN) is the safest resource logic. Option 5 (LPN IV Push) is typically out of scope. Option 6 (UAP Bath) creates physiological Demand vs Supply mismatch in a hypoxic patient.",
                "clinicalLogic": "Delegation depends on 'Stability'. At 07:00, Patient 302 was stable (UAP could take vitals). By 08:45, Patient 302 is unstable (O2 88%, RR 28, HR 115). Unstable patients CANNOT be delegated to UAP for monitoring tasks because the interpretation of the data is critical. The LPN can perform 'Task-based' sterile procedures (Cultures) but not 'Judgment-based' procedures (Transfer assessment).",
                "strategy": "Use the 'Stability Filter'. Is the patient stable? No (Vitals tab shows crash). If No -> RN must keep. If Yes -> Trigger Scope of Practice hierarchy (LPN = Meds/Dressings, UAP = ADLs/Hygiene).",
                "knowledge": "T.A.P.E. Rule: RNs must do Teaching, Assessment, Planning, Evaluation. Unstable patients automatically require RN assessment."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-TRIAG-K3L4",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Emergency Department Triage Priorities",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:12:00.000Z",
            "updatedAt": "2026-01-23T18:12:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5, // FIXED: Level 5
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Triage", "Abdominal Pain", "Respiratory Distress"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "ED Triage Board", "age": 45, "gender": "M", "allergies": "N/A", "weightKg": 80, "codeStatus": "N/A",
                    "admissionDate": "Today 13:55", "room": "ED-04", "physician": "Dr. S. Generic", "nurse": "RN Staff", "isolation": "Standard"
                },
                "setting": "Emergency Department Triage",
                "historyPhysical": {
                    "chiefComplaint": "Four simultaneous arrivals",
                    "hpi": "Triage nurse must assign ESI Levels (1-5) and rooming priority.",
                    "pmh": ["Variable per patient"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "14:00", "author": "EMS", "note": "Arrival 1: 65M, severe headache 'Thunderclap', onset 1 hr ago." },
                    { "time": "14:01", "author": "Walk-in", "note": "Arrival 2: 4F, drooling, inspiratory stridor, parent reports fever." },
                    { "time": "14:02", "author": "Walk-in", "note": "Arrival 3: 22M, 10/10 testicular pain, vomiting." },
                    { "time": "14:03", "author": "Walk-in", "note": "Arrival 4: 45M, forearm laceration, bleeding controlled with towel." }
                ],
                "vitals": [
                    { "time": "Pt 1", "tempF": "98.4", "hr": 70, "rr": 16, "bp": "210/110", "o2": "97", "o2_device": "RA", "pain": 10 },
                    { "time": "Pt 2", "tempF": "103.1", "hr": 140, "rr": 32, "bp": "90/50", "o2": "91", "o2_device": "RA", "pain": 2 },
                    { "time": "Pt 3", "tempF": "98.6", "hr": 110, "rr": 20, "bp": "140/90", "o2": "99", "o2_device": "RA", "pain": 10 }
                ],
                "labs": [],
                "orders": [
                    { "order": "Head CT", "status": "Pending", "indication": "Pt 1 Rule out Bleed" },
                    { "order": "Airway Cart / Anesthesia", "status": "Pending", "indication": "Pt 2 Protect Airway" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the arrivals. Which triage and prioritization assignments are correct according to the 'Emergent' (Level 1/2) hierarchy?",
                "trendTable": {
                    "columns": ["Patient", "Temp", "HR", "RR", "BP", "SpO2"],
                    "rows": [
                        ["Pt 1 (Headache)", "98.4", 70, 16, "210/110", "97% (RA)"],
                        ["Pt 2 (Stridor)", "103.1", 140, 32, "90/50", "91% (RA)"],
                        ["Pt 3 (Testicle)", "98.6", 110, 20, "140/90", "99% (RA)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Assign the 4-year-old with stridor as Triage Level 1 (Resuscitation/Immediate)", "isCorrect": true, "rationale": "Impending airway failure (Stridor + Drooling) is the highest urgency." },
                    { "id": "o2", "text": "Assign the 65-year-old with headache as Triage Level 2 (Emergent)", "isCorrect": true, "rationale": "Hypertensive crisis/suspected SAH requires rapid intervention (<15 min)." },
                    { "id": "o3", "text": "Assign the 22-year-old with testicular pain as Triage Level 2 (Emergent)", "isCorrect": true, "rationale": "Organ threat (Testicular Torsion) is a time-sensitive surgical emergency." },
                    { "id": "o4", "text": "Room the 65-year-old (Headache) BEFORE the 4-year-old (Stridor)", "isCorrect": false, "rationale": "Airway (Breathing) prioritization overrides Circulation/Neuro issues." },
                    { "id": "o5", "text": "Categorize the 45-year-old (Laceration) as Level 3 (Urgent)", "isCorrect": true, "rationale": "Stable vitals and controlled bleeding allow for wait time (Urgent, not Emergent)." },
                    { "id": "o6", "text": "Place the 22-year-old in the waiting room until a bed opens", "isCorrect": false, "rationale": "Risk of permanent organ loss precludes waiting room placement if any resource can be moved." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "This scenario tests the ESI (Emergency Severity Index) algorithm application. We have four patients competing for resources. The core task is to identify 'Life Threat' vs 'Organ Threat' vs 'Stable'.",
                "optionReview": "Option 1 (Stridor = Lev 1) is correct; airway is closing. Option 2 (HA = Lev 2) is correct; risk of stroke/death. Option 3 (Testicle = Lev 2) is correct; organ ischemia. Option 4 (Room order) is wrong; Airway (child) always goes first. Option 5 (Lac = Lev 3) is correct; requires resources but stable. Option 6 (Wait room) is negligent for torsion.",
                "clinicalLogic": "Prioritization Hierarchy: 1. Airway/Breathing (Life immediately threatened) -> 2. Circulation/Neuro (Life/Organ threat in minutes) -> 3. Stable but needs resources (X-ray/Sutures). The 4yo has Stridor (Airway obstruction) = Level 1. The 65yo has BP 210/110 (Stroke risk) = Level 2. The 22yo has Ischemia = Level 2.",
                "strategy": "Apply the 'ABC' filter first. Is A or B threatened? Yes (4yo). They win. Then apply 'Time Sensitivity'. Torsion dies in 4-6 hours. Brain bleeds die/disable in minutes. Lacerations can wait hours.",
                "knowledge": "ESI Levels: 1 (Resuscitation), 2 (Emergent/High Risk), 3 (Urgent/2+ Resources), 4 (Less Urgent/1 Resource), 5 (Non-urgent)."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ETHIC-M5N6",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Ethics and End of Life Management",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:13:00.000Z",
            "updatedAt": "2026-01-23T18:13:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5, // FIXED: Level 5
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Ethics", "Autonomy", "Informed Consent"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.P.", "age": 82, "gender": "F", "allergies": "NKDA", "weightKg": 58, "codeStatus": "Full Code",
                    "admissionDate": "Monday 07:00", "room": "Neuro-01", "physician": "Dr. Brain", "nurse": "RN Staff", "isolation": "Standard"
                },
                "setting": "Neurology Unit",
                "historyPhysical": {
                    "chiefComplaint": "Conflict regarding DNR status",
                    "hpi": "Client is 2 days post-massive CVA, non-responsive. No Advance Directive on file.",
                    "pmh": ["HTN", "AFib"],
                    "medications": ["Morphine gtt", "Atropine drops"]
                },
                "history": [
                    { "time": "09:00", "author": "Social Work", "note": "Family meeting. Daughter (HCPOA) requests full treatment/PEG tube. Son (arrived from out of state) produces video on phone of patient stating 'I never want to be a vegetable'." },
                    { "time": "11:00", "author": "MD", "note": "Prognosis poor. Midline shift 8mm. Brain stem reflexes absent." },
                    { "time": "12:00", "author": "Charge RN", "note": "Daughter threatening to sue if PEG tube not placed. Son threatening to call police if mother is 'tortured'." }
                ],
                "vitals": [
                    { "time": "09:00", "tempF": "98.8", "hr": 84, "rr": 14, "bp": "118/72", "o2": "94", "o2_device": "RA", "pain": 0 },
                    { "time": "12:00", "tempF": "99.2", "hr": 92, "rr": 10, "bp": "104/60", "o2": "92", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [],
                "orders": [
                    { "order": "PEG Tube Placement", "status": "On Hold", "indication": "Conflict" },
                    { "order": "Ethics Consult", "status": "Ordered", "indication": "Decision Making" }
                ],
                "radiology": [
                    { "study": "CT Head", "findings": "Massive hemorrhage, herniation.", "impression": "Fatal Prognosis", "date": "10:30" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the ethical dilemma and legal hierarchy. Which principles guide the nurse's management of this conflict?",
                "trendTable": {
                    "columns": ["Time", "Temp", "HR", "RR", "BP", "SpO2"],
                    "rows": [
                        ["09:00", "98.8", 84, 14, "118/72", "94% (RA)"],
                        ["12:00", "99.2", 92, 10, "104/60", "92% (RA)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "The daughter's decisions take precedence as the legal Healthcare Power of Attorney (HCPOA)", "isCorrect": true, "rationale": "Legally, the HCPOA overrides other family members unless a court intervenes." },
                    { "id": "o2", "text": "The son's video evidence overrides the HCPOA immediately", "isCorrect": false, "rationale": "Evidence of wishes must be weighed, but does not strictly legally nullify a valid HCPOA without Ethics/Court review." },
                    { "id": "o3", "text": "Autonomy is the primary ethical principle being challenged in this scenario", "isCorrect": true, "rationale": "The conflict is about determining what the PATIENT would have wanted (Autonomy) vs what family wants." },
                    { "id": "o4", "text": "The nurse should facilitate an ethics committee meeting to resolve the family conflict", "isCorrect": true, "rationale": "Appropriate escalation for intractable conflict." },
                    { "id": "o5", "text": "The nurse must remain a patient advocate while respecting the legal decision-making hierarchy", "isCorrect": true, "rationale": "Dual duty: Follow law (HCPOA) but voice patient's known wishes (Advocacy)." },
                    { "id": "o6", "text": "The doctor should make the final decision based on 'Beneficence'", "isCorrect": false, "rationale": "Paternalism is incorrect; the provider recommends, but the legal surrogate decides." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "This case creates a conflict between 'Legal Authority' (Daughter/HCPOA) and 'Moral Evidence' (Son/Video). The nurse is caught in the middle. The goal is to maximize Patient Autonomy, but the tool to do so is the Legal Hierarchy.",
                "optionReview": "Option 1 (HCPOA) is legally correct; they hold the pen. Option 2 (Video) is nuanced; it's evidence, but doesn't instantly strip the HCPOA of rights—it's grounds for an Ethics challenge. Option 3 (Autonomy) is the core ethical theme. Option 4 (Ethics Comm) is the correct procedural step. Option 6 (Doctor decides) is outdated paternalism.",
                "clinicalLogic": "Legal Hierarchy in most jurisdictions: 1. Patient (Competent), 2. Advanced Directive/Living Will (Written), 3. HCPOA (Designated Surrogate), 4. Next of Kin. Here, we are at Level 3. The Son is trying to introduce Level 1 evidence (Patient's voice) to override Level 3. This 'Conflict of Levels' requires an Ethics Committee, not a bedside nurse decision.",
                "strategy": "Identify the 'Decision Maker'. Is the patient competent? No. Is there a written directive? No. Is there an HCPOA? Yes. Therefore, HCPOA is the Decision Maker until proven otherwise.",
                "knowledge": "Ethical Principles: Autonomy (Self-rule), Beneficence (Do good), Non-maleficence (Do no harm), Justice (Fairness)."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-RESRCE-P7R8",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Resource Management & Discharge Planning",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:14:00.000Z",
            "updatedAt": "2026-01-23T18:14:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5, // FIXED: Level 5
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Discharge Planning", "Interprofessional Team", "Care Coordination"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.D.", "age": 44, "gender": "M", "allergies": "Latex", "weightKg": 110, "codeStatus": "Full Code",
                    "admissionDate": "Day 1 08:00", "room": "Rehab-04", "physician": "Dr. Move", "nurse": "RN Staff", "isolation": "Standard"
                },
                "setting": "Rehabilitation Floor",
                "historyPhysical": {
                    "chiefComplaint": "Discharge Barriers",
                    "hpi": "Client T6 Paraplegic (complete) preparing for home. Lives alone, 2nd floor, no elevator. Stage 3 sacral wound.",
                    "pmh": ["T6 SCI", "Obesity"],
                    "medications": ["Baclofen", "Vitamin C"]
                },
                "history": [
                    { "time": "Day 1 09:00", "author": "Case Mgr", "note": "Target discharge: Friday. Insurance denied ramp. Patient Refuses nursing home." },
                    { "time": "Day 2 10:00", "author": "PT", "note": "Patient cannot perform transfers independently yet (Max assist x1)." },
                    { "time": "Day 3 08:30", "author": "Wound RN", "note": "Sacral wound increased in size. Albumin 2.8. Diet poor." }
                ],
                "vitals": [
                    { "time": "Day 3 08:30", "tempF": "98.2", "hr": 78, "rr": 16, "bp": "112/68", "o2": "98", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [
                    { "test": "Albumin", "value": "2.8", "flag": "L", "ref": "3.5-5.0", "unit": "g/dL" },
                    { "test": "Pre-Albumin", "value": "12", "flag": "L", "ref": "15-36", "unit": "mg/dL" }
                ],
                "orders": [
                    { "order": "Discharge Home", "status": "Pending", "indication": "Plan" },
                    { "order": "Wound Vac", "status": "Active", "indication": "Stage 3 Pressure Injury" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the discharge trend and barriers. Which actions by the interprofessional team are essential for a safe transition?",
                "trendTable": {
                    "columns": ["Time", "Temp", "HR", "RR", "BP", "SpO2"],
                    "rows": [
                        ["Day 3 08:30", "98.2", 78, 16, "112/68", "98% (RA)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Consult a registered dietitian to address the low albumin (2.8 g/dL)", "isCorrect": true, "rationale": "Wound healing requires protein; nutritional deficit is a primary barrier." },
                    { "id": "o2", "text": "Request a home safety evaluation by the Physical Therapist", "isCorrect": true, "rationale": "2nd floor apartment with paralysis is a major safety hazard requiring professional clearance." },
                    { "id": "o3", "text": "Hold discharge until safe housing or equipment (Ramp/Lift) is secured", "isCorrect": true, "rationale": "Discharging a paraplegic who requires Max Assist to a 2nd floor walk-up alone is 'Unsafe Discharge' lawsuit material." },
                    { "id": "o4", "text": "Ensure the patient can demonstrate self-catheterization technique prior to discharge", "isCorrect": true, "rationale": "Self-care competency is mandatory for living alone." },
                    { "id": "o5", "text": "Override the patient's refusal and transfer to long-term care", "isCorrect": false, "rationale": "Autonomy prevents forcing placement; the team must find alternatives or negotiate." },
                    { "id": "o6", "text": "Verify that medical supplies (Wound Vac/Cath) will be delivered to the home", "isCorrect": true, "rationale": "Continuity of care depends on equipment availability." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The patient wants to go home, but the 'Data' says No. Barriers: Physical (Can't transfer), Environmental (Stairs), Clinical (Wound/Low Albumin). The Nurse's role is Coordinator—calling in the specific experts (Dietitian, PT, Case Mgmt) to clear these hurdles before signing the discharge papers.",
                "optionReview": "Option 1 (Diet) addresses the Lab trend (Albumin). Option 2 (PT Home safe) addresses the Environment. Option 3 (Hold Discharge) is the ultimate safety stop. Option 4 (Competency) addresses the Independence barrier. Option 6 (Supplies) addresses the Resource barrier. Option 5 (Force) is an ethical violation.",
                "clinicalLogic": "A safe discharge requires the '3 Cs': Clinical Stability (Wound?), Competency (Self-Cath?), and Context (Home/Stairs?). If any C fails, discharge fails. Here, Context (Stairs) and Competency (Max Assist) are failing.",
                "strategy": "Match the Barrier to the Discipline. Stairs -> PT. Protein -> Dietitian. Money/Housing -> Social Work.",
                "knowledge": "Discharge Planning Criteria: Patient must be physically able to access the home and perform ADLs, or have 24/7 care arranged."
            }
        }
    }
];
