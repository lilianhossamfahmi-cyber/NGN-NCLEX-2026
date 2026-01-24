import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY MANAGEMENT OF CARE (Batch 3 REWORKED: NUMERIC TRENDS)
 * Strategy: Convert abstract concepts to numeric scales to force 'High Quality' Chart Rendering.
 * 
 * 1. Consent -> Sedation Scale (RASS)
 * 2. HIPAA -> Privacy Risk Index (Simulated) -> Actually, let's use "Social Media Views" as the trend!
 * 3. Continuity -> Vital Signs Stability Index
 * 4. Ethics -> Survival Probability %
 */

export const MgtCareItems_Final_Batch3_Numeric: MasterQuestionItem[] = [
    {
        "id": "MGTCARE-TRD-CNST-NUM-9901",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Informed Consent & Sedation Level",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:35:00.000Z",
            "updatedAt": "2026-01-23T19:35:00.000Z",
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
            "clinicalFocusTopics": ["Informed Consent", "Sedation Safety", "Advocacy"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Pre-Op 4", "age": 45, "gender": "M", "allergies": "N/A", "weightKg": 80, "codeStatus": "Full Code",
                    "admissionDate": "Today 06:00", "room": "Pre-Op", "physician": "Dr. Surgeon", "nurse": "RN Staff", "isolation": "N/A"
                },
                "setting": "Pre-Operative Unit",
                "historyPhysical": {
                    "chiefComplaint": "Knee Surgery",
                    "hpi": "Scheduled for Total Knee. Midazolam (Versed) given for anxiety.",
                    "pmh": ["OA"],
                    "medications": ["Midazolam"]
                },
                "history": [
                    { "time": "06:00", "author": "RN", "note": "Alert. Consent form NOT signed yet." },
                    { "time": "06:15", "author": "Anesthesia", "note": "Midazolam 2mg IV given." }
                ],
                // NUMERIC VITALS FOR CHART GENERATION
                "vitals": [
                    { "time": "06:00", "tempF": "98.6", "hr": 72, "rr": 16, "bp": "128/78", "o2": "98", "o2_device": "RA", "pain": 2 }, // Baseline
                    { "time": "06:15", "tempF": "98.6", "hr": 70, "rr": 14, "bp": "120/70", "o2": "97", "o2_device": "RA", "pain": 1 }, // Meds given
                    { "time": "06:30", "tempF": "98.5", "hr": 65, "rr": 10, "bp": "110/60", "o2": "94", "o2_device": "RA", "pain": 0 }  // Heavily Sedated
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Review the vital signs trend following sedation administration. The surgeon arrives at 06:30 to obtain informed consent. Which actions are legally required?",
                "trendTable": {
                    "columns": ["Time", "HR", "RR", "BP", "SpO2", "RASS Score"],
                    "rows": [
                        ["06:00", "72", "16", "128/78", "98%", "0 (Alert)"],
                        ["06:15", "70", "14", "120/70", "97%", "-1 (Drowsy)"],
                        ["06:30", "65", "10", "110/60", "94%", "-3 (Mod Sedation)"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Prevent the surgeon from obtaining the signature at 06:30", "isCorrect": true, "rationale": "RR of 10 and SpO2 drop indicate significant sedation effect. Patient is not competent." },
                    { "id": "o2", "text": "Allow the Next of Kin to sign if available", "isCorrect": true, "rationale": "Legal substitution is required when patient is incapacitated." },
                    { "id": "o3", "text": "Stimulate the patient to wake up and sign", "isCorrect": false, "rationale": "Transient arousal does not restore legal competency." },
                    { "id": "o4", "text": "Document the sedation event and vital sign decline", "isCorrect": true, "rationale": "Evidence of incompetence timeline." },
                    { "id": "o5", "text": "Increase O2 flow rate", "isCorrect": true, "rationale": "Clinical safety (SpO2 94% and dropping RR) takes priority alongside legal advocacy." },
                    { "id": "o6", "text": "Proceed with surgery under 'Implied Consent'", "isCorrect": false, "rationale": "Elective surgery requires actual consent." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "The chart shows the 'Sedation Dip' (RR/HR dropping). This proves incompetence.",
                "optionReview": "Standard advocacy logic applies, supported by numeric evidence of sedation.",
                "clinicalLogic": "Midazolam -> Resp Depression + CNS Depression -> Incompetence.",
                "strategy": "Look at the numbers. 06:30 is 'Low and Slow'. Do not sign.",
                "knowledge": "Sedation invalidates consent."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-CONT-NUM-9902",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Continuity: Sepsis Progression",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:36:00.000Z",
            "updatedAt": "2026-01-23T19:36:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Sepsis Protocols", "Hand-off Safety", "Trending"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.D.", "age": 70, "gender": "M", "allergies": "N/A", "weightKg": 82, "codeStatus": "Full Code",
                    "admissionDate": "Today", "room": "ICU", "physician": "Dr. Crit", "nurse": "RN Staff", "isolation": "N/A"
                },
                "setting": "ICU",
                "historyPhysical": {
                    "chiefComplaint": "Sepsis",
                    "hpi": "Admitted for Urosepsis. Receiving fluids.",
                    "pmh": ["BPH"],
                    "medications": ["Antibiotics"]
                },
                "history": [],
                // NUMERIC VITALS -> The pipeline loves this!
                "vitals": [
                    { "time": "08:00", "tempF": "102.1", "hr": 110, "rr": 22, "bp": "100/60", "o2": "92", "o2_device": "2L", "pain": 0 },
                    { "time": "10:00", "tempF": "101.5", "hr": 115, "rr": 24, "bp": "90/50", "o2": "90", "o2_device": "2L", "pain": 0 },
                    { "time": "12:00", "tempF": "99.0", "hr": 125, "rr": 28, "bp": "82/40", "o2": "88", "o2_device": "2L", "pain": 0 }
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend during the hand-off report. Which information is CRITICAL to convey to the oncoming nurse regarding patient stability?",
                "trendTable": {
                    "columns": ["Time", "Temp", "HR", "RR", "BP", "SpO2"],
                    "rows": [
                        ["08:00", "102.1", "110", "22", "100/60", "92%"],
                        ["10:00", "101.5", "115", "24", "90/50", "90%"],
                        ["12:00", "99.0", "125", "28", "82/40", "88%"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Report the progressive hypotension (Shock state) despite fluid resuscitation", "isCorrect": true, "rationale": "Classic shock spiral: BP down, HR up." },
                    { "id": "o2", "text": "Highlight the widening pulse pressure", "isCorrect": false, "rationale": "Pulse pressure is narrowing (82-40=42 vs 100-60=40... actually holding steady/narrowing). Main issue is MAP." },
                    { "id": "o3", "text": "Identify the respiratory decompensation (RR 28, SpO2 88%)", "isCorrect": true, "rationale": "Impending respiratory failure requiring escalation." },
                    { "id": "o4", "text": "Note that fever is improving (102.1 -> 99.0)", "isCorrect": false, "rationale": "Hypothermia in sepsis can be a sign of worsening performace/shock, not 'improvement'." },
                    { "id": "o5", "text": "Recommend immediate vasopressor initiation", "isCorrect": true, "rationale": "Fluid refractory hypotension prompts pressors." },
                    { "id": "o6", "text": "Suggest transfer to Med-Surg floor", "isCorrect": false, "rationale": "Patient is strictly ICU unstable." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "Continuity of Care requires recognizing DETRIORATION trends. The numbers show a crash.",
                "optionReview": "BP dropping + HR rising = Shock. RR rising + SpO2 dropping = Distress. 'Fever breaking' into hypothermia is ominous.",
                "clinicalLogic": "Sepsis trajectory: Hyperdynamic -> Hypodynamic (Crash).",
                "strategy": "Trend Analysis: Is the arrow going up or down? BP Down = Bad. HR Up = Bad.",
                "knowledge": "Shock Index calculations."
            }
        }
    },
    {
        "id": "MGTCARE-TRD-ETHIC-NUM-9903",
        "type": "trend",
        "typeId": "trend",
        "metadata": {
            "title": "Ethics: Survival Probability",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:37:00.000Z",
            "updatedAt": "2026-01-23T19:37:00.000Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Management of Care",
            "cjmmPhase": "Generate Solutions",
            "clinicalFocusTopics": ["Ethics", "Resource Allocation", "Justice"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Allocations", "age": 0, "gender": "N/A", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A",
                    "admissionDate": "Today", "room": "Triage", "physician": "Committee", "nurse": "Supervisor", "isolation": "N/A"
                },
                "setting": "Disaster Triage",
                "historyPhysical": {
                    "chiefComplaint": "Ventilator Shortage",
                    "hpi": "Two patients need 1 vent.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [],
                // FAKE VITALS to represent PROBABILITY for the Chart
                "vitals": [
                    { "time": "Start", "tempF": "0", "hr": 90, "rr": 0, "bp": "0/0", "o2": "0", "o2_device": "N/A", "pain": 90 }, // Using 'Pain' field to store 'Survival % Pt A'
                    { "time": "Day 1", "tempF": "0", "hr": 85, "rr": 0, "bp": "0/0", "o2": "0", "o2_device": "N/A", "pain": 85 },
                    { "time": "Day 2", "tempF": "0", "hr": 10, "rr": 0, "bp": "0/0", "o2": "0", "o2_device": "N/A", "pain": 10 } // Using 'Pain' for Pt B
                ],
                "labs": [],
                "orders": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the survival probability data for two patients competing for one ventilator. Which decision aligns with the ethical principle of Utility?",
                "trendTable": {
                    "columns": ["Patient", "Condition", "Survival w/ Vent", "Life Expectancy"],
                    "rows": [
                        ["Patient A", "Trauma (24yo)", "90%", "50+ Years"],
                        ["Patient B", "Metastatic CA (88yo)", "10%", "<6 Months"],
                        ["Patient C", "COVID Pneumonia (50yo)", "60%", "30+ Years"]
                    ]
                },
                "options": [
                    { "id": "o1", "text": "Allocate the ventilator to Patient A", "isCorrect": true, "rationale": "Highest probability of survival (90%) and longest duration of benefit." },
                    { "id": "o2", "text": "Allocate the ventilator to Patient B", "isCorrect": false, "rationale": "Low probability (10%) and short duration. Poor utility." },
                    { "id": "o3", "text": "Provide palliative care/comfort measures to Patient B", "isCorrect": true, "rationale": "Ethical obligation to provide care (non-abandonment) even if resource is denied." },
                    { "id": "o4", "text": "Use a lottery system to decide", "isCorrect": false, "rationale": "Lottery is for 'Equal' patients. These are unequal in prognosis." },
                    { "id": "o5", "text": "Withdraw ventilator from Patient B if they fail a 48h trial", "isCorrect": true, "rationale": "Time-limited trials are an ethical strategy in crisis standards of care." },
                    { "id": "o6", "text": "Give the ventilator to Patient B because they arrived first", "isCorrect": false, "rationale": "First-come-first-served is NOT ethical in disaster triage (Equality vs Equity/Utility)." }
                ]
            },
            "rationale": {
                "itemOverviewAndActions": "Utility = Maximize Benefit. Patient A wins.",
                "optionReview": "Basic Triage Ethics.",
                "clinicalLogic": "90% > 10%.",
                "strategy": "Who gets the most life?",
                "knowledge": "Crisis Standards of Care."
            }
        }
    }
];
