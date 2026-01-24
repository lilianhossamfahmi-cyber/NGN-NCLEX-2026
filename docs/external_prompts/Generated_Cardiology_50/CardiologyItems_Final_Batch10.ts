import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 10: Items 36-43)
 * Focus: Valvular Surgery, Thoracic Aneurysm, CABG, Rehab
 */

export const CardiologyItems_Final_Batch10: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-VALVE-V6W7",
        "typeId": "trend",
        "metadata": {
            "title": "Mechanical vs Bioprosthetic Valve Management",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:50:00Z",
            "updatedAt": "2026-01-23T20:50:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Valvular Surgery", "Anticoagulation", "Education"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.J.", "age": 48, "gender": "Female", "allergies": "NKDA", "weightKg": 64, "codeStatus": "Full Code"
                },
                "setting": "Cardiovascular Unit",
                "historyPhysical": {
                    "chiefComplaint": "Preparation for Aortic Valve Replacement (AVR).",
                    "hpi": "Client has severe aortic stenosis and is deciding between a mechanical (metal) valve and a bioprosthetic (bovine/porcine) valve. She identifies as someone who 'loves to travel' and 'enjoys a glass of wine with steak and greens'.",
                    "pmh": ["Aortic Stenosis", "HTN"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Discusion regarding life-long anticoagulation initiated. Client expresses concern about 'frequent blood checks'." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 78, "rr": 16, "bp": "118/72", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the patient's lifestyle and clinical needs. Which education points correctly differentiate Mechanical from Bioprosthetic valves?",
                "options": [
                    { "id": "o1", "text": "Inform the client that a Mechanical valve requires life-long Warfarin therapy", "isCorrect": true, "rationale": "Mechanical valves are highly thrombogenic and require permanent anticoagulation to prevent valve thrombosis/stroke." },
                    { "id": "o2", "text": "Counsel the client that a Bioprosthetic valve usually lasts 20-30 years without replacement", "isCorrect": false, "rationale": "Tissue valves have a shorter lifespan (10-15 years) and often require re-operation, whereas mechanical valves can last a lifetime." },
                    { "id": "o3", "text": "Explain that the target INR for a mechanical aortic valve is typically 2.0 - 3.0", "isCorrect": true, "rationale": "Mechanical aortic valves require therapeutic INR to prevent clot formation." },
                    { "id": "o4", "text": "Advise the client that she should avoid high-contact sports if she chooses a mechanical valve", "isCorrect": true, "rationale": "Chronic anticoagulation (Warfarin) carries a high risk for internal bleeding from even minor trauma." },
                    { "id": "o5", "text": "Recognize that her diet (steak and greens) will require consistent Vitamin K monitoring with a mechanical valve", "isCorrect": true, "rationale": "Warfarin interacts with Vitamin K; patients must keep their K-rich veggie intake consistent." },
                    { "id": "o6", "text": "Tell the client that a 'Clicking' sound in the chest is common and normal for a mechanical valve", "isCorrect": true, "rationale": "Mechanical valves make an audible sound as they close; patients should be warned about this." }
                ]
            },
            "rationale": {
                "coreConcept": "Valvular Replacement Education",
                "caseSummary": "Choosing between Mechanical and Tissue valves. Focus on 'Durability' vs 'Drugs'.",
                "answerAnalysis": "Correct: o1, o3, o4, o5, o6. Error: o2 (Tissue valves have shorter durability, not longer).",
                "trap": "Thinking 'Bioprosthetic' (Tissue) is better overall. It's better for lifestyle (no blood tests) but worse for longevity (re-operation).",
                "goldenRule": "Mechanical = Meds. Tissue = Turnover.",
                "steps": [
                    { "tag": "Assess", "description": "Identify if the patient is willing/able to perform weekly INR checks." },
                    { "tag": "Plan", "description": "Discuss pregnancy goals (Warfarin is teratogenic; tissue valves may be preferred for women of child-bearing age)." }
                ],
                "mnemonic": {
                    "title": "M vs B",
                    "content": "M-Mechanical (Meds for life), B-Bioprosthetic (Blood-thinner not needed long term)",
                    "explanation": "Summarizes the anticoagulation difference."
                },
                "cheatSheet": {
                    "title": "Warfarin Safety",
                    "points": [
                        "Use a soft toothbrush.",
                        "Use an electric razor.",
                        "Consistent Vitamin K intake.",
                        "Frequent INR monitoring."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Aortic valve is between the LV and Aorta.",
                    "physiology": "Xenografts (Animal tissue) are less likely to cause clots but Calcify faster in younger patients.",
                    "pharm": "Warfarin (Coumadin) is the standard for mechanical valves; DOACs (Apixaban) are currently NOT approved for mechanical valves."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Synthesis/Education",
                    "clinicalStrategy": "Differentiate between 'Durability' and 'Anticoagulation'.",
                    "recommendedActions": ["Check INR regularly", "Consistent diet"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-ANEUR-A1C2",
        "typeId": "trend",
        "metadata": {
            "title": "Thoracic Aortic Aneurysm (TAA) Monitoring",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:55:00Z",
            "updatedAt": "2026-01-23T20:55:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Aortic Aneurysm", "Thoracic Aneurysm", "Compression Symptoms"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.V.", "age": 75, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "New hoarseness and difficulty swallowing.",
                    "hpi": "Client has a known 5.2 cm Thoracic Aortic Aneurysm (TAA). He has been followed 'watchfully'. Today, he identifies new symptoms: hoarseness when speaking and a feeling like food gets 'stuck' when he swallows. Pain is stable.",
                    "pmh": ["TAA (5.2cm)", "Smoking", "HTN"],
                    "medications": ["Lisinopril", "Aspirin"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Hoarseness noted in voice. Client reports new-onset dysphagia." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 82, "rr": 18, "bp": "154/90", "o2": "98", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the new symptoms and the history of TAA. Which conclusions and nursing actions are most appropriate?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Hoarseness' as likely compression of the Recurrent Laryngeal Nerve", "isCorrect": true, "rationale": "An enlarging thoracic aneurysm can press on the laryngeal nerve, causing voice changes." },
                    { "id": "o2", "text": "Recognize 'Dysphagia' as likely compression of the Esophagus", "isCorrect": true, "rationale": "Compression of the nearby esophagus leads to difficulty swallowing." },
                    { "id": "o3", "text": "Notify the provider immediately of these 'Compression Symptoms'", "isCorrect": true, "rationale": "New symptoms suggest the aneurysm is expanding or at higher risk of rupture, requiring intervention." },
                    { "id": "o4", "text": "Advise the client to increase his isometric exercise (heavy lifting) to maintain strength", "isCorrect": false, "rationale": "Lifting/Straining increases intrathoracic pressure and can trigger aneurysm rupture." },
                    { "id": "o5", "text": "Strictly manage the BP to prevent further expansion", "isCorrect": true, "rationale": "Hypertension is the primary driver of aneurysm growth." },
                    { "id": "o6", "text": "Inform the client that these symptoms are likely due to a seasonal cold", "isCorrect": false, "rationale": "Dismissing hoarseness in a TAA patient is a critical safety failure." }
                ]
            },
            "rationale": {
                "coreConcept": "Thoracic Aneurysm Assessment",
                "caseSummary": "Patient with TAA develops compression of local structures (Nerve/Esophagus). Signals need for escalation/surgery.",
                "answerAnalysis": "Correct: o1, o2 (Clinical correlations), o3 (Action), o5 (Prevention). Error: o4 (Dangerous activity), o6 (Dismissal).",
                "trap": "Focusing only on 'Pain'. In TAA, 'Compression' (Hoarseness/Swallowing) is just as important as pain.",
                "goldenRule": "New symptom + Aneurysm = Expand/Rupture risk.",
                "steps": [
                    { "tag": "Assess", "description": "Identify new-onset respiratory or esophageal symptoms." },
                    { "tag": "Report", "description": "Escalate to the vascular surgeon immediately." }
                ],
                "mnemonic": {
                    "title": "T.A.A. Signs",
                    "content": "T-Thoracic pain (deep chest/back), A-Airway (Cough/Dyspnea), A-Anatomy (Hoarseness/Swallowing)",
                    "explanation": "Summarizes the TAA cluster."
                },
                "cheatSheet": {
                    "title": "Surgery Trigger",
                    "points": [
                        "Aneurysm > 5.5 - 6.0 cm.",
                        "Rapid growth (>0.5 cm in 6 months).",
                        "New or worsening symptoms."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The recurring laryngeal nerve loops under the aortic arch.",
                    "physiology": "N/A",
                    "pharm": "Beta-blockers (Atenolol) are used to slow the growth rate of the aneurysm."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Analysis/Safety",
                    "clinicalStrategy": "Acknowledge 'Nerve' and 'Tube' compression as critical findings.",
                    "recommendedActions": ["Stat consult", "Strict BP control"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-CABGS-Y7Z8",
        "typeId": "trend",
        "metadata": {
            "title": "Post-CABG Nursing Care & Complications",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:00:00Z",
            "updatedAt": "2026-01-23T21:00:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["CABG", "Post-Op Management", "Infection Prevention"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.L.", "age": 69, "gender": "Female", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Cardiovascular ICU/Step-down",
                "historyPhysical": {
                    "chiefComplaint": "Post-Op Day 2 CABG x4.",
                    "hpi": "Client underwent quadruple bypass using saphenous vein grafts. She is now on a step-down unit. She reports moderate sternal pain. Her temperature has spiked to 101.4 F, and she has new fine crackles in the bases of her lungs.",
                    "pmh": ["CAD", "T2DM", "Obesity"],
                    "medications": ["Aspirin", "Metoprolol", "Metformin (held)"]
                },
                "history": [
                    { "time": "POD 0", "author": "ICU RN", "note": "Patient extubated. CT output stable." },
                    { "time": "POD 2", "author": "RN Smith", "note": "Fever of 101.4 F. Sternal incision has mild redness. Patient reluctant to use Incentive Spirometer due to pain." }
                ],
                "vitals": [
                    { "time": "POD 2", "tempF": "101.4", "hr": 98, "rr": 20, "bp": "112/68", "o2": "93", "o2_device": "RA", "pain": 6 }
                ],
                "labs": [
                    { "test": "WBC", "value": "14.2", "flag": "H", "ref": "4.5 - 11.0", "unit": "10^3/uL" },
                    { "test": "Glucose (FS)", "value": "192", "flag": "H", "ref": "70 - 110", "unit": "mg/dL" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the post-operative trend. Which nursing actions are most appropriate to prevent complications?",
                "options": [
                    { "id": "o1", "text": "Educate the patient on 'Splinting' the incision with a pillow during coughing and IS use", "isCorrect": true, "rationale": "Splinting reduces pain and prevents sternal dehiscence during efforts to clear the lungs." },
                    { "id": "o2", "text": "Monitor blood glucose strictly and implement insulin protocols to maintain levels < 180", "isCorrect": true, "rationale": "Hyperglycemia (192) significantly delays wound healing and increases the risk of 'Mediastinitis' (deadly infection) post-CABG." },
                    { "id": "o3", "text": "Encourage the patient to remain immobile on bed rest until the fever subsides", "isCorrect": false, "rationale": "Immobility increases the risk of pneumonia (crackles) and DVT. Early ambulation is the standard of care." },
                    { "id": "o4", "text": "Notify the surgeon of any 'clicking' or 'rubbing' sensation at the sternal site", "isCorrect": true, "rationale": "Sternal instability (dehiscence) is a major complication that requires immediate surgical attention." },
                    { "id": "o5", "text": "Assist the patient with 'Dangling' and initial ambulation while monitoring telemetry", "isCorrect": true, "rationale": "Safe mobilization is essential for pulmonary and vascular health." },
                    { "id": "o6", "text": "Increase the IV fluid rate to resolve the fever", "isCorrect": false, "rationale": "Post-CABG patients are at high risk for fluid overload; increasing fluids without a specific cause (like hypovolemia) can cause pulmonary edema." }
                ]
            },
            "rationale": {
                "coreConcept": "Post-CABG Care & Complications",
                "caseSummary": "Post-op CABG with fever and poor lung expansion. Focus on 'Sternal stability' and 'Glucose control'.",
                "answerAnalysis": "Correct: o1 (Splinting), o2 (Glucose control), o4 (Sternal check), o5 (Mobility). Incorrect: o3 (Bed rest), o6 (Excess fluids).",
                "trap": "Believing 'Bed Rest' is safer for a patient with a fever. In post-op, 'Walking' is the cure for fever (prevents atelectasis).",
                "goldenRule": "Splint and Walk.",
                "steps": [
                    { "tag": "Implement", "description": "Ensure adequate pain management before mobilizing." },
                    { "tag": "Monitor", "description": "Watch the sternal wound for redness, drainage, or instability." }
                ],
                "mnemonic": {
                    "title": "C.A.B.G. Recovery",
                    "content": "C-Cough with pillow, A-Ambulatory, B-Blood sugar control, G-Gaiter/Extremity check (donor site)",
                    "explanation": "Summarizes the recovery focus."
                },
                "cheatSheet": {
                    "title": "Mediastinitis Signs",
                    "points": [
* "Fever and elevated WBC.",
* "Sternal instability (clicking/movement).",
* "Purulent drainage from the chest wound."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Internal Mammary Artery (IMA) is the 'Gold Standard' conduit for CABG.",
                    "physiology": "Glucose > 180 impairs neutrophil function and collagen production.",
                    "pharm": "Metformin is typically held post-op to avoid lactic acidosis risk during recovery."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Management",
                    "clinicalStrategy": "Look for answers that promote 'Healing' (Glucose) and 'Lungs' (Mobility/Splinting).",
                    "recommendedActions": ["Splinting education", "Glucose management"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-REHAB-P1Q2",
        "typeId": "trend",
        "metadata": {
            "title": "Cardiac Rehabilitation Phases & Safety",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:05:00Z",
            "updatedAt": "2026-01-23T21:05:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Cardiac Rehab", "Exercise Safety", "Education"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "T.C.", "age": 58, "gender": "Male", "allergies": "NKDA", "weightKg": 88, "codeStatus": "Full Code"
                },
                "setting": "Cardiac Step-down / Outpatient",
                "historyPhysical": {
                    "chiefComplaint": "Entering Cardiac Rehab Phase II.",
                    "hpi": "Client survived a myocardial infarction 6 weeks ago. He is now beginning a supervised outpatient exercise program. He is eager to 'get back to his old self' and wants to know when he can start lifting weights again.",
                    "pmh": ["MI", "HTN", "HLD"],
                    "medications": ["Aspirin", "Ticagrelor", "Metoprolol", "Atorvastatin"]
                },
                "history": [
                    { "time": "Initial", "author": "Rehab RN", "note": "Phase I (Inpatient) completed. Patient tolerated hallways walking. Preparing for Phase II (Outpatient monitored)." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 72, "rr": 16, "bp": "118/74", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the progression of cardiac rehabilitation. Which statements and instructions best characterize a safe rehab process?",
                "options": [
                    { "id": "o1", "text": "Inform the client that Phase I occurs while still in the hospital and focuses on basic activity (sitting up, short walks)", "isCorrect": true, "rationale": "Phase I is the inpatient recovery phase." },
                    { "id": "o2", "text": "Explain that Phase II typically involves 3-6 months of supervised, telemetry-monitored exercise", "isCorrect": true, "rationale": "Phase II is the structured, monitored outpatient phase." },
                    { "id": "o3", "text": "Advise the client to stop exercise immediately if he develops chest pain, palpitations, or lightheadedness", "isCorrect": true, "rationale": "These are 'Red Flags' indicating myocardial ischemia or arrhythmia during exertion." },
                    { "id": "o4", "text": "Instruct the client to avoid lifting weights > 10 lbs until specifically cleared by the physician", "isCorrect": true, "rationale": "Isometric exercise (lifting) increases afterload and heart strain; the myocardium must heal before adding resistance." },
                    { "id": "o5", "text": "Encourage the client to aim for a heart rate that exceeds his calculated 'Max HR' (220-age)", "isCorrect": false, "rationale": "The heart rate should stay within a target range (typically 60-80% of max), but never exceed the max HR." },
                    { "id": "o6", "text": "Stress the importance of the 'Warm-up' and 'Cool-down' periods during each session", "isCorrect": true, "rationale": "Gradual changes in heart rate prevent sudden stress on the cardiac muscle and allow for proper venous return." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiac Rehab Phases",
                "caseSummary": "Patient transitioning into supervised rehab. Nursing focus on 'Safety', 'Progression', and 'Red Flags'.",
                "answerAnalysis": "Correct: o1, o2 (Phases), o3 (Red flags), o4 (Lifting risk), o6 (Technique). Error: o5 (HR target error).",
                "trap": "Thinking Phase II is 'independent' (o2). Phase II is 'Supervised and Monitored'. Fully independent is Phase IV.",
                "goldenRule": "Gradual increase, supervised monitoring.",
                "steps": [
                    { "tag": "Teach", "description": "Instruct the patient on how to monitor their own pulse/Borg scale." },
                    { "tag": "Collaborate", "description": "Coordinate with the rehab team to set realistic goals." }
                ],
                "mnemonic": {
                    "title": "Cardio C.A.R.E.",
                    "content": "C-Continuous ECG (Phase II), A-Activity limit (no lifting), R-Red flags (Stop for pain), E-Entry (Wait 4-6 wks post MI)",
                    "explanation": "Summarizes rehab essentials."
                },
                "cheatSheet": {
                    "title": "Rehab Phases",
                    "points": [
                        "Phase I: Inpatient (Basic ADLs).",
                        "Phase II: Supervised Outpatient (ECG Monitored).",
                        "Phase III: Maintenance (Community setting).",
                        "Phase IV: Long-term lifestyle (Independent)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Exercise improves collateral circulation and reduces myocardial oxygen demand over time.",
                    "pharm": "Metoprolol (Beta-blocker) will blunt the heart rate response to exercise; the patient should use the 'Borg Scale' (Rate of Perceived Exertion) instead of just HR."
                },
                "difficulty": {
                    "score": 75,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Look for 'Supervised' and 'Safety-first' options.",
                    "recommendedActions": ["Enroll in Phase II", "Monitor Borg scale"]
                }
            }
        }
    }
];
