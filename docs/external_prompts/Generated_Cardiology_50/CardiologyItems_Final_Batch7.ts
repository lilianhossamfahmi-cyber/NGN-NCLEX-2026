import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 7: Items 36-40)
 * Focus: Pulmonary Edema, Raynaud's/Buerger's, HTN Crisis, Shock
 */

export const CardiologyItems_Final_Batch7: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-EDEMA-I1J2",
        "typeId": "trend",
        "metadata": {
            "title": "Acute Pulmonary Edema (Flash Edema)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:50:00Z",
            "updatedAt": "2026-01-23T19:50:00Z",
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
            "clinicalFocusTopics": ["Pulmonary Edema", "Heart Failure", "Respiratory Failure"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.H.", "age": 66, "gender": "Female", "allergies": "NKDA", "weightKg": 74, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Extreme gasping for air and pink frothy sputum.",
                    "hpi": "Client has a history of left-sided heart failure. She woke up at 2:00 AM unable to catch her breath (PND). In the ED, she is sitting bolt upright, tachypneic, and coughing up pink, foamy fluid. Crackles are heard throughout all lung fields.",
                    "pmh": ["CHF", "HTN", "Mitral Valve Disease"],
                    "medications": ["Furosemide", "Lisinopril"]
                },
                "history": [
                    { "time": "0230", "author": "ER RN", "note": "Patient presents in distress. Pink frothy sputum noted. 100% NRB mask applied." },
                    { "time": "0245", "author": "ER RN", "note": "IV Lasix given. Morphine given. Upright position maintained." }
                ],
                "vitals": [
                    { "time": "0230", "tempF": "98.4", "hr": 124, "rr": 34, "bp": "188/98", "o2": "82", "o2_device": "RA", "pain": 2 },
                    { "time": "0245", "tempF": "98.4", "hr": 110, "rr": 28, "bp": "162/88", "o2": "92", "o2_device": "100% NRB", "pain": 2 }
                ],
                "labs": [
                    { "test": "BNP", "value": "2400", "flag": "H", "ref": "<100", "unit": "pg/mL" }
                ],
                "radiology": [
                    { "study": "CXR", "findings": "Diffuse Alveolar Opacities ('Bat-wing' appearance). Kerley B lines.", "impression": "Severe Pulmonary Edema.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and physical findings. Which nursing actions are most appropriate for this emergency?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Pink, frothy sputum' as pathognomonic for pulmonary edema", "isCorrect": true, "rationale": "High hydrostatic pressure forces plasma and RBCs into the alveoli, creating the foamy, blood-tinged sputum." },
                    { "id": "o2", "text": "Position the patient high-Fowler's with legs dangling over the side of the bed", "isCorrect": true, "rationale": "Sitting upright with legs dependent (dangling) reduces venous return (preload) to an already overwhelmed left ventricle." },
                    { "id": "o3", "text": "Administer IV Furosemide as ordered (diuresis)", "isCorrect": true, "rationale": "Furosemide acts as a vasodilator (within minutes) and a diuretic (within 15-30 mins) to reduce volume." },
                    { "id": "o4", "text": "Administer IV Morphine as ordered", "isCorrect": true, "rationale": "Morphine reduces anxiety and provides peripheral vasodilation, further reducing preload." },
                    { "id": "o5", "text": "Place the patient in the Trendelenburg position to improve cerebral perfusion", "isCorrect": false, "rationale": "Trendelenburg (head down) will shift all fluid to the lungs and likely cause immediate respiratory arrest in a pulmonary edema patient." },
                    { "id": "o6", "text": "Provide high-flow Oxygen via Non-Rebreather mask or CPAP", "isCorrect": true, "rationale": "Positive pressure (CPAP) is highly effective at pushing fluid out of the alveoli and back into the capillaries." }
                ]
            },
            "rationale": {
                "coreConcept": "Flash Pulmonary Edema",
                "caseSummary": "Severe left heart failure backup into lungs. Emergency prioritization. M.A.D. D.O.G. therapy.",
                "answerAnalysis": "Correct: o1 (ID sputum), o2 (Positioning-Preload reduction), o3, o4 (Meds-Preload reduction), o6 (Oxygenation/Positive pressure). Error: o5 (Fatal position change).",
                "trap": "Thinking 'Dangling' (o2) is only for PAD. In heart failure, dangling the legs is a 'Bloodless Phlebotomy' that reduces preload.",
                "goldenRule": "Legs down, Head up.",
                "steps": [
                    { "tag": "Position", "description": "Get the patient upright immediately." },
                    { "tag": "Implement", "description": "Ensure large-bore IV access for rapid diuretic administration." }
                ],
                "mnemonic": {
                    "title": "M.A.D. D.O.G.",
                    "content": "Morphine, Aminophylline (rare), Diuretics (Lasix), Digoxin, Oxygen, Gases (ABGs)",
                    "explanation": "Summarizes acute pulmonary edema care."
                },
                "cheatSheet": {
                    "title": "Preload Reducers",
                    "points": [
                        "Sitting Upright.",
                        "Nitroglycerin.",
                        "Furosemide.",
                        "Morphine."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The alveoli are the microscopic air sacs where gas exchange occurs.",
                    "physiology": "Starling's Law: Excessive stretching of the heart muscle fiber leads to decreased contractility.",
                    "pharm": "Furosemide (Lasix) should be pushed slowly to avoid ototoxicity."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Emergency Management",
                    "clinicalStrategy": "Look for the answer that reduces 'Volume' and 'Preload'.",
                    "recommendedActions": ["Sit upright", "Push IV Lasix"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-BUER-K3L4",
        "typeId": "trend",
        "metadata": {
            "title": "Buerger's Disease & Raynaud's Phenomenon",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:55:00Z",
            "updatedAt": "2026-01-23T19:55:00Z",
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
            "clinicalFocusTopics": ["Buerger's Disease", "Raynaud's", "Vasospasm"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "C.R.", "age": 34, "gender": "Male", "allergies": "NKDA", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Outpatient Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Blue and painful fingers when cold; foot ulcers.",
                    "hpi": "Client has a 15-pack-year smoking history. He reports his fingertips turn 'ghost white', then 'blue', then 'red' when he reaches into the freezer (Raynaud's). He also has a non-healing, gangrenous ulcer on his left big toe and reports severe pain in his arches when walking.",
                    "pmh": ["Buerger's Disease (Thromboangiitis Obliterans)", "Smoking"],
                    "medications": ["Nifedipine"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "White-Blue-Red color change observed in fingers. Distal pulses (Pedal) are absent." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 78, "rr": 16, "bp": "114/70", "o2": "99", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and vascular symptoms. Which findings and interventions are characteristic of these vasospastic and inflammatory disorders?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'White -> Blue -> Red' trifhasic color change as Raynaud's Phenomenon", "isCorrect": true, "rationale": "Sequence represents Ischemia (white), Cyanosis (blue), and Rubor/Reperfusion (red)." },
                    { "id": "o2", "text": "Counsel the client that 'Smoking Cessation' is the only way to stop Buerger's disease progression", "isCorrect": true, "rationale": "Buerger's (Thromboangiitis Obliterans) is almost exclusively found in young male smokers; it cannot be managed without quitting nicotine." },
                    { "id": "o3", "text": "Advise the client to wear gloves even when handling cold items in the kitchen", "isCorrect": true, "rationale": "Preventing the cold trigger is the primary behavioral intervention for Raynaud's." },
                    { "id": "o4", "text": "Encourage the client to soak his feet in hot water to improve circulation", "isCorrect": false, "rationale": "Heat is dangerous for ischemic limbs due to neuropathy/poor healing; tepid water or warmth is okay, but 'hot' is a burn risk." },
                    { "id": "o5", "text": "Expect an order for Calcium Channel Blockers (e.g., Nifedipine) for Raynaud's", "isCorrect": true, "rationale": "CCBs cause vasodilation and reduce the frequency/severity of the vasospasms." },
                    { "id": "o6", "text": "Manage foot ulcers with tight compression stockings", "isCorrect": false, "rationale": "Compression is for venous disease. In arterial diseases like Buerger's, compression would cut off the tiny amount of remaining blood flow." }
                ]
            },
            "rationale": {
                "coreConcept": "Raynaud's vs Buerger's",
                "caseSummary": "Vasospastic (Raynaud's) and Inflammatory/Obstructive (Buerger's) issues. Both triggered by cold/nicotine.",
                "answerAnalysis": "Correct: o1 (ID Raynaud's), o2 (Buerger's #1 fix), o3 (Raynaud's behavioral), o5 (Pharma). Incorrect: o4 (Heat risk), o6 (Compression is for veins).",
                "trap": "Believing Buerger's is 'just bad PAD'. It's an inflammatory 'Thromboangiitis' specific to smokers.",
                "goldenRule": "Buerger's = Stop Smoking or Lose the Limb.",
                "steps": [
                    { "tag": "Assess", "description": "Identify the 'Triphasic' color change in fingers/toes." },
                    { "tag": "Implement", "description": "Strict nicotine and cold avoidance." }
                ],
                "mnemonic": {
                    "title": "B.R.R. (Cold)",
                    "content": "B-Buerger's (Smokers), R-Raynaud's (Vasospasm), R-Red/White/Blue",
                    "explanation": "Summarizes the cold-associated issues."
                },
                "cheatSheet": {
                    "title": "Raynaud's colors",
                    "points": [
                        "White: Pallor (Spasm).",
                        "Blue: Cyanosis (Deoxygenation).",
                        "Red: Rubor (Hyperemia)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Buerger's affects small and medium-sized arteries/veins in the distal extremities.",
                    "physiology": "Raynaud's is a hyper-responsiveness of the sympathetic nervous system to cold or stress.",
                    "pharm": "Calcium Channel Blockers are the first-line therapy for Raynaud's."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Synthesis/Application",
                    "clinicalStrategy": "Search for 'Trigger Avoidance' (Cold/Nicotine).",
                    "recommendedActions": ["Stop smoking", "Wear gloves/mittens"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-HTNCR-M5N6",
        "typeId": "trend",
        "metadata": {
            "title": "Hypertensive Emergency vs Urgency",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:00:00Z",
            "updatedAt": "2026-01-23T20:00:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Hypertensive Crisis", "Organ Damage", "Sodium Nitroprusside"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "G.L.", "age": 58, "gender": "Male", "allergies": "NKDA", "weightKg": 105, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Headache, blurred vision, and chest heaviness.",
                    "hpi": "Client presents with a BP of 220/124. He has a severe, throbbing headache and states 'I can't see the clocks on the wall clearly'. EKG shows ST depression in V4-V6.",
                    "pmh": ["HTN (non-compliant)", "CKD"],
                    "medications": ["None (stopped taking 6 mos ago)"]
                },
                "history": [
                    { "time": "1900", "author": "ER RN", "note": "Patient presents with hypertensive crisis. Neurologic exam reveals confusion. Sodium Nitroprusside drip initiated." }
                ],
                "vitals": [
                    { "time": "1900", "tempF": "98.4", "hr": 92, "rr": 20, "bp": "220/124", "o2": "97", "o2_device": "RA", "pain": 8 }
                ],
                "labs": [
                    { "test": "Creatinine", "value": "2.4", "flag": "H", "ref": "0.7 - 1.3", "unit": "mg/dL" },
                    { "test": "Troponin I", "value": "0.08", "flag": "H", "ref": "< 0.04", "unit": "ng/mL" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and target organ status. Which findings and interventions distinguish this as a Hypertensive Emergency?",
                "options": [
                    { "id": "o1", "text": "Evidence of target-organ damage (Blurred vision, Elevated Creatinine, Troponin leak)", "isCorrect": true, "rationale": "High BP + Organ damage = Emergency. High BP alone = Urgency." },
                    { "id": "o2", "text": "The goal is to reduce the Mean Arterial Pressure (MAP) by no more than 20-25% in the first hour", "isCorrect": true, "rationale": "Dropping BP too fast can cause cerebral hypoperfusion and ischemic stroke." },
                    { "id": "o3", "text": "Administer aggressive IV fluid boluses to maintain renal perfusion", "isCorrect": false, "rationale": "Fluids would worsen the volume overload and hypertensive state." },
                    { "id": "o4", "text": "Monitor the patient for 'Thyocyanate Toxicity' if Sodium Nitroprusside is used for > 48 hours", "isCorrect": true, "rationale": "Nitroprusside contains cyanide groups; long-term use or use in renal failure (like this patient) can lead to toxic accumulation." },
                    { "id": "o5", "text": "Maintain the client on strict bed rest and keep the room dim and quiet", "isCorrect": true, "rationale": "Reducing stimuli helps lower sympathetic drive during the crisis." },
                    { "id": "o6", "text": "Rapidly reduce the BP to 120/80 within the first 30 minutes", "isCorrect": false, "rationale": "This is a priority safety error; rapid normalization of BP in a chronic hypertensive patient causes organ ischemia." }
                ]
            },
            "rationale": {
                "coreConcept": "Hypertensive Emergency Management",
                "caseSummary": "Highly elevated BP (220/124) with neurologic and renal damage. Controlled titration of BP is the priority.",
                "answerAnalysis": "Correct: o1 (Diagnosis), o2, o5 (Targets/Behavioral), o4 (Pharma toxicity). Error: o3 (Fluids bad), o6 (Too fast reduction).",
                "trap": "Believing that 'Lowering the BP' is always the goal. The goal is 'Controlled Reduction' (o2).",
                "goldenRule": "Emergency = Organ Damage. Urgency = Just a Number.",
                "steps": [
                    { "tag": "Assess", "description": "Check Urine output, Neurologic status, and Vision." },
                    { "tag": "Implement", "description": "Titrate IV vasodilators with an arterial line for continuous pressure monitoring." }
                ],
                "mnemonic": {
                    "title": "Slow and Steady",
                    "content": "25% in 1 hour, 160/100 in 6 hours",
                    "explanation": "Standard BP reduction timeline."
                },
                "cheatSheet": {
                    "title": "Nitroprusside Toxicity",
                    "points": [
                        "Signs: Metabolic acidosis, confusion, hyperreflexia, tinnitus.",
                        "Risk factors: Renal failure, prolonged use (>72h), high doses.",
                        "Protect from light (aluminum foil around set)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Small vessels of the eye (Retinopathy) and kidney (Nephropathy) are the first to be damaged by high pressure.",
                    "physiology": "MAP = [SBP + (2*DBP)] / 3. Normal is 70-100.",
                    "pharm": "Sodium Nitroprusside is a direct-acting vasodilator."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Synthesis/Pharma",
                    "clinicalStrategy": "Look for 'Slow/Controlled' BP lowering.",
                    "recommendedActions": ["Start IV Nitroprusside", "Art line placement"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-SHOCK-P7Q8",
        "typeId": "trend",
        "metadata": {
            "title": "Cardiogenic Shock & Inotropic Support",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:05:00Z",
            "updatedAt": "2026-01-23T20:05:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Cardiogenic Shock", "Inotropes", "Hemodynamics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "F.G.", "age": 70, "gender": "Male", "allergies": "NKDA", "weightKg": 80, "codeStatus": "Full Code"
                },
                "setting": "Cardiac Intensive Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Hypotension and oliguria post-MI.",
                    "hpi": "Client had a large anterior wall MI 24 hours ago. He is now cool, clammy, and confused. Urine output has dropped to 10 mL/hr. Pulmonary artery (Swan-Ganz) catheter shows a wedge pressure (PCWP) of 25 mmHg and a Cardiac Index (CI) of 1.4.",
                    "pmh": ["Recent STEMI", "T2DM"],
                    "medications": ["Norepinephrine", "Dobutamine"]
                },
                "history": [
                    { "time": "0900", "author": "RN Rivera", "note": "Patient becoming more lethargic. S3/S4 gallop heard. Crackles in lung bases." },
                    { "time": "1000", "author": "MD", "note": "Cardiogenic shock confirmed. Dobutamine infusion optimized. IABP insertion discussed." }
                ],
                "vitals": [
                    { "time": "0900", "tempF": "97.2", "hr": 118, "rr": 26, "bp": "74/48", "o2": "90", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [
                    { "test": "Lactate", "value": "5.4", "flag": "H", "ref": "< 2.0", "unit": "mmol/L" },
                    { "test": "Cardiac Index", "value": "1.4", "flag": "L", "ref": "2.5 - 4.0", "unit": "L/min/m2" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the hemodynamic parameters and clinical state. Which treatments and goals are correct for this client in cardiogenic shock?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Low Cardiac Index' (< 2.0) and 'High PCWP' (> 18) as diagnostic for cardiogenic shock", "isCorrect": true, "rationale": "Cardiogenic shock is a 'Cold and Wet' shock: low output (cold) and high backup pressure (wet/PCWP)." },
                    { "id": "o2", "text": "Administer IV Dobutamine as ordered to increase myocardial contractility", "isCorrect": true, "rationale": "Dobutamine is a positive inotrope that helps the failing LV pump more effectively." },
                    { "id": "o3", "text": "Provide IV fluid boluses to resolve the hypotension", "isCorrect": false, "rationale": "Fluid boluses are contraindicated in cardiogenic shock as the patient already has high pulmonary pressures (PCWP 25); more fluid will cause pulmonary edema." },
                    { "id": "o4", "text": "Prepare for the insertion of an Intra-Aortic Balloon Pump (IABP)", "isCorrect": true, "rationale": "The IABP reduces afterload (making it easier to pump) and improves coronary artery perfusion." },
                    { "id": "o5", "text": "Maintain the MAP > 65 to ensure organ perfusion", "isCorrect": true, "rationale": "The secondary goal after cardiac output improvement is minimum perfusion pressure for the kidneys/brain." },
                    { "id": "o6", "text": "Goal: Reduce the PCWP to < 18 and Increase the Cardiac Index to > 2.5", "isCorrect": true, "rationale": "Successful treatment reverses the 'Cold and Wet' state." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiogenic Shock Hemodynamics",
                "caseSummary": "Pump failure following MI. Key parameters: Low CI, High PCWP, High SVR. Treatment: Inotropes + IABP.",
                "answerAnalysis": "Correct: o1 (Diagnosis), o2 (Inotropes), o4 (Assist device), o5, o6 (Goals). Error: o3 (Fluids are for Hypovolemic/Distributive shock, not Cardiogenic).",
                "trap": "Believing 'All shock needs fluids'. In cardiogenic shock, fluids are the 'Enemy'.",
                "goldenRule": "Cardiogenic Shock = Wet and Cold.",
                "steps": [
                    { "tag": "Analyze", "description": "Identify that PCWP is high (Fluid backup into lungs)." },
                    { "tag": "Implement", "description": "Use Inotropes (Dobutamine) to fix the 'Pump'." }
                ],
                "mnemonic": {
                    "title": "P.U.M.P.",
                    "content": "P-Positive inotropes, U-Under-filling is NOT the problem, M-Measure PCWP, P-Pulsation (IABP)",
                    "explanation": "Summarizes cardiogenic shock care."
                },
                "cheatSheet": {
                    "title": "Swan-Ganz Normals",
                    "points": [
                        "CI: 2.5 - 4.0 L/min/m2.",
                        "PCWP: 8 - 12 mmHg.",
                        "CVP: 2 - 8 mmHg.",
                        "SVR: 800 - 1200 dynes."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Anterior wall MI (LAD artery) frequently leads to cardiogenic shock because it damages the largest part of the LV muscle.",
                    "physiology": "Cardiogenic shock is the only shock with 'High' filling pressures (PCWP).",
                    "pharm": "Dopamine at high doses (>10 mcg) becomes a vasoconstrictor, which can worsen cardiogenic shock by increasing afterload."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Advanced Hemodynamics",
                    "clinicalStrategy": "Fix the 'Pump' and lower the 'Back-pressure'.",
                    "recommendedActions": ["Start Dobutamine", "Prepare for IABP"]
                }
            }
        }
    }
];
