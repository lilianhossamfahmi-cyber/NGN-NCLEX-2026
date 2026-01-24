import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 9: Items 32-39)
 * Focus: Atrial Flutter, SVT/Adenosine, V-Fib, Stress Test, Thoracic Aneurysm
 */

export const CardiologyItems_Final_Batch9: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-FLUTT-A1B2",
        "typeId": "trend",
        "metadata": {
            "title": "Atrial Flutter & Thromboembolic Risk",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:30:00Z",
            "updatedAt": "2026-01-23T20:30:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Atrial Flutter", "Arrhythmias", "EKG"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.R.", "age": 67, "gender": "Female", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Heart racing and mild dizziness.",
                    "hpi": "Client presents with palpitations. EKG shows a regular 'sawtooth' pattern between QRS complexes with an atrial rate of 300 and a ventricular rate of 75 (4:1 conduction).",
                    "pmh": ["HTN", "COPD"],
                    "medications": ["Diltiazem", "Lisinopril"]
                },
                "history": [
                    { "time": "1800", "author": "RN Rivera", "note": "P-waves absent; 'Sawtooth' flutter waves noted. Ventricular rhythm is regular." }
                ],
                "vitals": [
                    { "time": "1800", "tempF": "98.6", "hr": 75, "rr": 18, "bp": "138/84", "o2": "94 (COPD Baseline)", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the EKG pattern and clinical status. Which findings and nursing actions are most appropriate for this arrhythmia?",
                "options": [
                    { "id": "o1", "text": "Recognize the rhythm as 'Atrial Flutter'", "isCorrect": true, "rationale": "The characteristic 'sawtooth' baseline and fixed conduction ratio (4:1) are diagnostic of atrial flutter." },
                    { "id": "o2", "text": "Initiate long-term anticoagulation therapy as ordered", "isCorrect": true, "rationale": "High atrial rates in flutter (like AFib) carry a significant risk of thromboembolism and stroke." },
                    { "id": "o3", "text": "Maintain the patient on a regular diet and activity as tolerated", "isCorrect": false, "rationale": "Activity should be limited until the heart rate and rhythm are fully controlled to prevent syncope." },
                    { "id": "o4", "text": "Prepare for elective synchronized cardioversion if medications fail", "isCorrect": true, "rationale": "Synchronized cardioversion is the definitive treatment to restore sinus rhythm in stable but persistent flutter." },
                    { "id": "o5", "text": "Administer IV Atropine to increase the ventricular response rate", "isCorrect": false, "rationale": "Atropine would increase the ventricular rate further, which is not the goal in flutter." },
                    { "id": "o6", "text": "Monitor for signs of systemic emboli (Stroke, kidney pain, pale limb)", "isCorrect": true, "rationale": "Atrial flutter can cause cardiogenic emboli." }
                ]
            },
            "rationale": {
                "coreConcept": "Atrial Flutter Identification",
                "caseSummary": "Classic 4:1 Atrial Flutter. Stable hemodynamics. Goal is rate control and stroke prevention.",
                "answerAnalysis": "Correct: o1 (Diagnosis), o2, o6 (Stroke prevention), o4 (Treatment). Incorrect: o3 (Activity caution), o5 (Contraindicated).",
                "trap": "Thinking Atrial Flutter is the 'same' as Atrial Fibrillation. In Flutter, the ventricular rate is often 'Regular' due to fixed conduction.",
                "goldenRule": "Sawtooth = Flutter.",
                "steps": [
                    { "tag": "Assess", "description": "Count the flutter waves between QRS complexes." },
                    { "tag": "Plan", "description": "Coordinate anticoagulation follow-up." }
                ],
                "mnemonic": {
                    "title": "Flutter vs Fib",
                    "content": "Flutter is 'Regularly Irregular' or Fixed. Fib is 'Irregularly Irregular'.",
                    "explanation": "Summarizes the key EKG difference."
                },
                "cheatSheet": {
                    "title": "Flutter Ratios",
                    "points": [
                        "2:1 (HR ~150).",
                        "3:1 (HR ~100).",
                        "4:1 (HR ~75)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Flutter is caused by a macro-reentrant circuit around the tricuspid valve annulus.",
                    "physiology": "The AV node acts as a gatekeeper, preventing all 300 atrial beats from reaching the ventricles.",
                    "pharm": "Calcium channel blockers (Diltiazem) are used for rate control."
                },
                "difficulty": {
                    "score": 75,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Identify the 'Sawtooth' and the 'Stroke Risk'.",
                    "recommendedActions": ["Obtain EKG", "Start Warfarin"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-SVTMG-K3L4",
        "typeId": "trend",
        "metadata": {
            "title": "SVT Management & Adenosine Protocol",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:35:00Z",
            "updatedAt": "2026-01-23T20:35:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["SVT", "Adenosine", "Vagal Maneuvers"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.K.", "age": 24, "gender": "Female", "allergies": "Latex", "weightKg": 58, "codeStatus": "Full Code"
                },
                "setting": "Urgent Care / Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Sudden heart racing and feeling like 'I'm going to pass out'.",
                    "hpi": "Client reports heart began racing while she was sitting at her desk. EKG shows a narrow-complex tachycardia at a rate of 190 bpm with no visible P-waves. She is pale and reports moderate lightheadedness.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "1400", "author": "RN Rivera", "note": "Patient in SVT. Vagal maneuvers (Valsalva) attempted without success. Adenosine 6mg ordered." }
                ],
                "vitals": [
                    { "time": "1400", "tempF": "98.6", "hr": 190, "rr": 24, "bp": "98/62", "o2": "97", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the nursing priorities for SVT and Adenosine administration. Which actions are correct for this procedure?",
                "options": [
                    { "id": "o1", "text": "Attempt vagal maneuvers (e.g., coughing or bearing down) before drug therapy", "isCorrect": true, "rationale": "Vagal maneuvers are the first-line, non-pharmacological step for stable SVT." },
                    { "id": "o2", "text": "Administer Adenosine 6mg IV as a rapid, 1-2 second bolus", "isCorrect": true, "rationale": "Adenosine has a very short half-life (<10 seconds); it must be pushed extremely fast and as close to the heart as possible." },
                    { "id": "o3", "text": "Follow the Adenosine push with an immediate 20 mL fast-flush of Normal Saline", "isCorrect": true, "rationale": "The flush ensures the medication reaches the central circulation before it's metabolized." },
                    { "id": "o4", "text": "Inform the client that she may feel a sensation of 'impending doom' or a 'brief pause' in her heart beat", "isCorrect": true, "rationale": "Adenosine often causes brief asystole; warning the patient prevents panic during the drug's effect." },
                    { "id": "o5", "text": "Maintain the client in a High-Fowler's position during the push", "isCorrect": false, "rationale": "The client should be supine or low-Fowler me because the brief asystole/hypotension can cause syncope." },
                    { "id": "o6", "text": "Ensure a defibrillator is at the bedside and the patient is on continuous monitoring", "isCorrect": true, "rationale": "Standard safety protocol for any drug that induces asystole." }
                ]
            },
            "rationale": {
                "coreConcept": "SVT & Adenosine Protocol",
                "caseSummary": "Stable SVT unresponsive to vagal maneuvers. Preparing for Adenosine. Focus on 'Speed' and 'Patient education'.",
                "answerAnalysis": "Correct: o1 (Sequence), o2, o3 (Technique), o4 (Psychological prep), o6 (Safety). o5 is wrong (Syncope risk).",
                "trap": "Believing 'Slow and steady' wins the race. With Adenosine, 'Fast and Furious' is the only way.",
                "goldenRule": "Adenosine: Fast push, Fast flush, Low access (Antecubital).",
                "steps": [
                    { "tag": "Position", "description": "Ensure the patient is lying down." },
                    { "tag": "Implement", "description": "Push the med in 1 second and the flush immediately after." }
                ],
                "mnemonic": {
                    "title": "A.D.E.N.",
                    "content": "A-As close to heart as possible, D-Duration is tiny (push fast), E-EKG monitoring continuous, N-No slow push",
                    "explanation": "Summarizes Adenosine tips."
                },
                "cheatSheet": {
                    "title": "Adenosine Dosing",
                    "points": [
                        "Dose 1: 6 mg.",
                        "Dose 2 (if no conversion): 12 mg.",
                        "Dose 3: 12 mg."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Ideally use an antecubital (AC) vein or central line; avoid hand/wrist veins if possible.",
                    "physiology": "Adenosine slows conduction time through the AV node, interrupting reentrant pathways.",
                    "pharm": "Caffeine and Theophylline can antagonize the effects of Adenosine."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Protocol Synthesis",
                    "clinicalStrategy": "Identify the 'Fast Push' and 'Safety Prep'.",
                    "recommendedActions": ["Warn patient", "Monitor EKG", "Push fast"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-DEFIB-G7H8",
        "typeId": "trend",
        "metadata": {
            "title": "Ventricular Fibrillation & Defibrillation",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:40:00Z",
            "updatedAt": "2026-01-23T20:40:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["V-Fib", "Defibrillation", "ACLS"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.S.", "age": 62, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Progressive Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Sudden unresponsiveness and loss of pulse.",
                    "hpi": "Client was being monitored for an acute MI. Suddenly, the telemetry alarm sounds, showing a chaotic, wavy baseline with no identifiable QRS complexes. Code Blue is called.",
                    "pmh": ["Acute STEMI", "HTN"],
                    "medications": ["Aspirin", "Ticagrelor"]
                },
                "history": [
                    { "time": "0900", "author": "RN Rivera", "note": "Patient unresponsive. No pulse found. V-Fib on monitor. CPR initiated." }
                ],
                "vitals": [
                    { "time": "0900", "tempF": "N/A", "hr": 0, "rr": 0, "bp": "0/0", "o2": "N/A", "o2_device": "N/A", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the arrhythmia and emergency sequence. Which nursing actions are essential for this cardiac arrest patient?",
                "options": [
                    { "id": "o1", "text": "Check for a pulse for no more than 10 seconds before starting compressions", "isCorrect": true, "rationale": "High-quality CPR must start immediately to maintain perfusion." },
                    { "id": "o2", "text": "Perform immediate unsynchronized defibrillation (shock)", "isCorrect": true, "rationale": "V-Fib is a shockable rhythm; the only definitive treatment for V-fib is defibrillation to depolarize the entire heart." },
                    { "id": "o3", "text": "Set the defibrillator to 'Sync' mode before delivering the shock", "isCorrect": false, "rationale": "In V-Fib, there is no R-wave to sync to. Sync mode should be used for V-Tach with a pulse or SVT, NOT for V-Fib." },
                    { "id": "o4", "text": "Continue chest compressions while the defibrillator is charging", "isCorrect": true, "rationale": "Minimizing interruptions in compressions is a core ACLS tenet." },
                    { "id": "o5", "text": "Shout 'Clear!' and verify no one is touching the patient before delivering the shock", "isCorrect": true, "rationale": "Safety of the team is paramount." },
                    { "id": "o6", "text": "Resume chest compressions immediately after the shock is delivered", "isCorrect": true, "rationale": "Do not stop to check a pulse after a shock; resume compressions for 2 minutes (5 cycles) before the next rhythm check." }
                ]
            },
            "rationale": {
                "coreConcept": "V-Fib & Defibrillation (ACLS)",
                "caseSummary": "Patient in V-Fib. Emergency shock and high-quality CPR priorities.",
                "answerAnalysis": "Correct: o1, o2, o4, o5, o6. Error: o3 (Don't sync for V-fib).",
                "trap": "Thinking you should check a pulse after the shock. You resume compressions immediately (o6).",
                "goldenRule": "V-Fib = Defib.",
                "steps": [
                    { "tag": "Implement", "description": "Identify the rhythm and shock as soon as the machine arrives." },
                    { "tag": "Collaborate", "description": "Assign teammates to compressions, airway, and medications." }
                ],
                "mnemonic": {
                    "title": "S.H.O.C.K.",
                    "content": "S-Silence the room, H-Halt compressions for shock only, O-Off oxygen (fire risk), C-Clear team, K-Keep doing CPR after",
                    "explanation": "Summarizes defib safety."
                },
                "cheatSheet": {
                    "title": "Shockable vs Non-shockable",
                    "points": [
                        "Shockable: V-Fib, Pulseless V-Tach.",
                        "Non-shockable: PEA (Pulseless Electrical Activity), Asystole."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Proper pad placement: Upper right sternum, and Lower left apex.",
                    "physiology": "V-Fib is characterized by fine or coarse fibrillatory waves with no cardiac output.",
                    "pharm": "Epinephrine 1mg is given every 3-5 minutes during the code."
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "Emergency Management",
                    "clinicalStrategy": "Identify the 'Shockable' rhythm and maintain 'High-Quality CPR'.",
                    "recommendedActions": ["Immediate shock", "Continuous compressions"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-STRES-M1N2",
        "typeId": "trend",
        "metadata": {
            "title": "Cardiac Stress Test: Prep & Monitoring",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:45:00Z",
            "updatedAt": "2026-01-23T20:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Stress Test", "Coronary Artery Disease", "Nursing Education"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.P.", "age": 52, "gender": "Male", "allergies": "Latex", "weightKg": 110, "codeStatus": "Full Code"
                },
                "setting": "Outpatient Stress Lab",
                "historyPhysical": {
                    "chiefComplaint": "Intermittent chest pain with exertion.",
                    "hpi": "Client is scheduled for an exercise stress test (Treadmill). He identifies as a coffee drinker and takes several cardiac medications.",
                    "pmh": ["HTN", "Obesity", "Smoking"],
                    "medications": ["Metoprolol", "Amlodipine", "Caffeine (daily)"]
                },
                "history": [
                    { "time": "0800", "author": "RN Rivera", "note": "Patient arrived for stress test. Assessing prep adherence." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 64, "rr": 16, "bp": "128/74", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the stress test preparations. Which instructions must the nurse confirm with the client prior to starting the exercise test?",
                "options": [
                    { "id": "o1", "text": "Ensure the client has consumed no caffeine (Coffee, tea, chocolate) for 24 hours", "isCorrect": true, "rationale": "Caffeine can trigger arrhythmias and interfere with the cardiac response during the test." },
                    { "id": "o2", "text": "Verify if the client has taken his scheduled Metoprolol (Beta-blocker) today", "isCorrect": true, "rationale": "Beta-blockers blink the heart rate response; they are typically held for 24-48 hours before an exercise stress test to allow the heart rate to reach the target." },
                    { "id": "o3", "text": "Confirm the client has been NPO (nothing by mouth) for at least 3-4 hours", "isCorrect": true, "rationale": "Prevents gastric upset/nausea during exercise; light toast is sometimes allowed, but NPO is safer." },
                    { "id": "o4", "text": "Instruction: Eat a large high-protein meal 1 hour before to provide energy", "isCorrect": false, "rationale": "Large meals divert blood to the gut, which can skew the cardiac results and cause nausea." },
                    { "id": "o5", "text": "Verify the client is wearing comfortable walking shoes and loose clothing", "isCorrect": true, "rationale": "A safety requirement for treadmill testing." },
                    { "id": "o6", "text": "Inform the client that he should continue the test even if he develops chest pain or extreme SOB", "isCorrect": false, "rationale": "The test must be STOPPED if the patient develops chest pain, ST-segment elevation, or significant arrhythmias." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiac Stress Test Prep",
                "caseSummary": "Patient preparing for exercise stress test. Focus on 'Holds' (Caffeine/Beta-blockers) and 'Safety'.",
                "answerAnalysis": "Correct: o1, o2 (Med/Substance holds), o3 (NPO status), o5 (Safety clothing). Error: o4 (Large food), o6 (Keep going despite pain).",
                "trap": "Thinking Beta-blockers (o2) should be taken to 'Protect' the heart. For the test, we need the heart to be 'unprotected' so we can see the ischemia.",
                "goldenRule": "Hold the Beta-blockers, Hold the Caffeine.",
                "steps": [
                    { "tag": "Verify", "description": "Ask specifically about caffeine in the last 24 hours." },
                    { "tag": "Monitor", "description": "Watch the monitor and the patient's face for distress during the test." }
                ],
                "mnemonic": {
                    "title": "C.B.S.",
                    "content": "C-No Caffeine, B-No Beta-blockers, S-Stop for symptoms",
                    "explanation": "Summarizes stress test prep."
                },
                "cheatSheet": {
                    "title": "Termination Criteria",
                    "points": [
                        "Chest pain / Angina.",
                        "ST-segment changes on EKG.",
                        "Extreme fatigue / Dyspnea.",
                        "Drop in BP."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Target HR = (220 - age) * 0.85.",
                    "pharm": "Adenosine or Dobutamine can be used for 'Pharmacological' stress testing if the patient can't walk."
                },
                "difficulty": {
                    "score": 75,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Search for 'Caffeine' and 'Beta-blocker' holds.",
                    "recommendedActions": ["Check med list", "Ensure NPO status"]
                }
            }
        }
    }
];
