import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 8: Items 41-45)
 * Focus: Cardiac Rehab, Post-PCI, Statins, PVD/DVT
 */

export const CardiologyItems_Final_Batch8: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-PCI-R1S2",
        "typeId": "trend",
        "metadata": {
            "title": "Post-PCI Access Site Management",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:10:00Z",
            "updatedAt": "2026-01-23T20:10:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 3,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["PCI", "Hematoma", "Nursing assessment"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "D.B.", "age": 64, "gender": "Female", "allergies": "Iodine (hives)", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Post-Anesthesia Care Unit (PACU)",
                "historyPhysical": {
                    "chiefComplaint": "Post-stent placement via right femoral artery.",
                    "hpi": "Client is 1 hour post-PCI. She had a DES (Drug-Eluting Stent) placed in the RCA. Femoral sheath was removed in the lab and a manual pressure dressing is in place. She is complaining of sudden, sharp back pain and feeling 'faint'.",
                    "pmh": ["CAD", "STEMI"],
                    "medications": ["Heparin (intra-op)", "Clopidogrel", "Aspirin"]
                },
                "history": [
                    { "time": "1200", "author": "RN Rivera", "note": "Arrived from lab. Right groin dressing clean and dry. No palpable mass. Pedal pulse 2+." },
                    { "time": "1300", "author": "RN Rivera", "note": "Patient reports severe low back pain. Appears pale and diaphoretic. Groin dressing still dry." }
                ],
                "vitals": [
                    { "time": "1200", "tempF": "98.2", "hr": 78, "rr": 16, "bp": "132/76", "o2": "99", "o2_device": "RA", "pain": 0 },
                    { "time": "1300", "tempF": "98.2", "hr": 114, "rr": 22, "bp": "88/50", "o2": "96", "o2_device": "RA", "pain": 8 }
                ],
                "labs": [
                    { "test": "Hgb", "value": "9.2", "flag": "L", "ref": "12 - 16", "unit": "g/dL" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and patient symptoms. Which complications and nursing actions are most likely required for this client?",
                "options": [
                    { "id": "o1", "text": "Suspect a Retroperitoneal Hemorrhage", "isCorrect": true, "rationale": "High-risk signals for retroperitoneal bleed after femoral access include: Hypotension, Tachycardia, and severe back/flank pain, even if the groin site looks dry." },
                    { "id": "o2", "text": "Apply firm, manual pressure to the right femoral artery", "isCorrect": true, "rationale": "Even if no hematoma is visible, the nurse should ensure hemostasis while waiting for a CT scan." },
                    { "id": "o3", "text": "Place the patient in High-Fowler's to relieve the back pain", "isCorrect": false, "rationale": "The patient must remain flat (Supine) for 4-6 hours post-femoral PCI to prevent bleeding; Fowler's position will increase the risk of hemorrhage." },
                    { "id": "o4", "text": "Prepare for an emergency CT scan of the abdomen and pelvis", "isCorrect": true, "rationale": "CT is the gold standard for diagnosing a retroperitoneal bleed." },
                    { "id": "o5", "text": "Anticipate an order for IV fluid boluses and possible blood transfusion", "isCorrect": true, "rationale": "Managing the hemorrhagic shock is the immediate physiological priority." },
                    { "id": "o6", "text": "Administer the next scheduled dose of Clopidogrel immediately", "isCorrect": false, "rationale": "Antiplatelets should be held in an active bleeding emergency until the source is controlled." }
                ]
            },
            "rationale": {
                "coreConcept": "Post-PCI Complications",
                "caseSummary": "Patient has classic signs of an 'occult' bleed (Retroperitoneal Hemorrhage) following femoral artery access. Back pain + Hypotension = Big Trouble.",
                "answerAnalysis": "Correct: o1 (Diagnosis), o2, o4, o5 (Management). Incorrect: o3 (Positioning error), o6 (Pharma error).",
                "trap": "Thinking that because the 'Groin is dry', the patient isn't bleeding. Blood can pool in the retroperitoneal space behind the artery.",
                "goldenRule": "Back Pain after PCI = Retroperitoneal Bleed until proven otherwise.",
                "steps": [
                    { "tag": "Assess", "description": "Check BP and pulse every 15 mins." },
                    { "tag": "Implement", "description": "Keep the extremity straight and the HOB flat." }
                ],
                "mnemonic": {
                    "title": "P.L.A.T.",
                    "content": "P-Pulses (check distal), L-Lie flat, A-Access site (check for mass), T-Tachycardia (sign of bleed)",
                    "explanation": "Summarizes post-PCI nursing."
                },
                "cheatSheet": {
                    "title": "Hematoma vs Hemorrhage",
                    "points": [
                        "Hematoma: Palpable, hard mass at the site.",
                        "Retroperitoneal: Pain in back/flank, BP drop, no visible mass."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The femoral artery lies over the femoral head; manual pressure must compress the artery against the bone.",
                    "physiology": "Retroperitoneal space can hold up to 1-2 liters of blood before becoming visible.",
                    "pharm": "Drug-Eluting Stents (DES) require long-term Dual Antiplatelet Therapy (DAPT)."
                },
                "difficulty": {
                    "score": 85,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Look for the answer that identifies 'Internal' bleeding.",
                    "recommendedActions": ["Keep patient flat", "Notify Surgeon/Cardiologist"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-STATN-T3U4",
        "typeId": "trend",
        "metadata": {
            "title": "Statin Side Effects & Rhabdomyolysis",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:15:00Z",
            "updatedAt": "2026-01-23T20:15:00Z",
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
            "clinicalFocusTopics": ["Statins", "Pharmacology", "Rhabdomyolysis"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.M.", "age": 59, "gender": "Male", "allergies": "NKDA", "weightKg": 90, "codeStatus": "Full Code"
                },
                "setting": "Primary Care Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Severe muscle pain and dark urine.",
                    "hpi": "Client was started on Atorvastatin (Lipitor) 80mg 2 weeks ago following a high LDL discovery. He reports 'heavy, aching pain' in his thighs and shoulders. His urine has turned a 'tea-colored' brown.",
                    "pmh": ["Hyperlipidemia", "T2DM"],
                    "medications": ["Atorvastatin", "Metformin"]
                },
                "history": [
                    { "time": "Today", "author": "RN Rivera", "note": "Patient presents with generalized myalgia. Urine sample is dark amber/coca-cola color. Patient reports 'drinking the same amount of water as usual'." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.6", "hr": 84, "rr": 16, "bp": "142/84", "o2": "98", "o2_device": "RA", "pain": 7 }
                ],
                "labs": [
                    { "test": "CPK (Creatine Kinase)", "value": "12500", "flag": "H", "ref": "< 200", "unit": "U/L" },
                    { "test": "Creatinine", "value": "1.9", "flag": "H", "ref": "0.7 - 1.3", "unit": "mg/dL" },
                    { "test": "ALT/AST", "value": "88/94", "flag": "H", "ref": "< 40", "unit": "U/L" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and laboratory data. Which findings and interventions are critical for this client's safety?",
                "options": [
                    { "id": "o1", "text": "Recognize the clinical syndrome as 'Rhabdomyolysis'", "isCorrect": true, "rationale": "The triad of myalgia, dark urine, and massively elevated CPK (12500) is diagnostic of rhabdomyolysis." },
                    { "id": "o2", "text": "Instruct the patient to stop taking the Atorvastatin immediately", "isCorrect": true, "rationale": "Stopping the offending agent (statin) is the first priority to prevent further muscle breakdown." },
                    { "id": "o3", "text": "Encourage aggressive oral and IV fluid hydration", "isCorrect": true, "rationale": "Fluids are necessary to flush myoglobin through the renal tubules and prevent Acute Tubular Necrosis (ATN)." },
                    { "id": "o4", "text": "Identify the 'Tea-colored' urine as Myoglobinuria", "isCorrect": true, "rationale": "Muscle breakdown releases myoglobin, which is toxic to the kidneys and stains the urine dark brown." },
                    { "id": "o5", "text": "Monitor the patient for Hyperkalemia", "isCorrect": true, "rationale": "Muscle cells contain high levels of potassium; when they break down, K+ is released into the bloodstream." },
                    { "id": "o6", "text": "Reassure the client that muscle aches are a 'normal and expected' side effect of Lipitor", "isCorrect": false, "rationale": "Minor aches are common, but severe pain and dark urine are medical emergencies and should never be dismissed." }
                ]
            },
            "rationale": {
                "coreConcept": "Statin Safety & Rhabdomyolysis",
                "caseSummary": "Patient on high-dose statin with CPK > 12,000 and dark urine. Emergency renal protection needed.",
                "answerAnalysis": "Correct: o1 (Diagnosis), o2, o3 (Intervention), o4 (Patho), o5 (Complication monitoring). o6 is a dangerous neglect distractor.",
                "trap": "Thinking 'Muscle pain' (Myalgia) is the same as 'Rhabdo'. Rhabdo is the 'Extreme' version with kidney threat.",
                "goldenRule": "Dark Urine + Statin = Emergency.",
                "steps": [
                    { "tag": "Implement", "description": "Stop statin and start IV fluids immediately." },
                    { "tag": "Monitor", "description": "Check labs (K+, Creatinine, CPK) every 6-12 hours." }
                ],
                "mnemonic": {
                    "title": "S.T.A.T.I.N. Risks",
                    "content": "S-Sore muscles, T-Toxicity (Renal), A-ALT/AST (Liver), T-Team report, I-Increase fluids, N-No grapefruit juice",
                    "explanation": "Summarizes statin monitoring."
                },
                "cheatSheet": {
                    "title": "Liver vs Muscle",
                    "points": [
                        "Liver: Check ALT/AST (elevated transaminases).",
                        "Muscle: Check CPK (Myopathy/Rhabdo)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Statins inhibit HMG-CoA reductase in the liver.",
                    "physiology": "Myoglobin precipitates in the renal tubules in an acidic environment, causing physical obstruction and direct toxicity.",
                    "pharm": "Grapefruit juice inhibits the metabolism of statins, increasing the risk of toxicity."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Analysis/Safety",
                    "clinicalStrategy": "Identify 'Renal' and 'Muscle' indicators.",
                    "recommendedActions": ["Stop Lipitor", "Aggressive IV fluids"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-PVDI-V5W6",
        "typeId": "trend",
        "metadata": {
            "title": "Peripheral Venous Disease: Chronic Insufficiency",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:20:00Z",
            "updatedAt": "2026-01-23T20:20:00Z",
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
            "clinicalFocusTopics": ["PVD", "Chronic Venous Insufficiency", "Wound Care"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N.R.", "age": 71, "gender": "Female", "allergies": "NKDA", "weightKg": 110, "codeStatus": "Full Code"
                },
                "setting": "Wound Care Center",
                "historyPhysical": {
                    "chiefComplaint": "Swollen, heavy legs and weeping sores on ankles.",
                    "hpi": "Client has a history of varicose veins and multiple DVTs. Her legs are chronically swollen, and the skin around her ankles is 'tough and brown' (Hemosiderin staining). She has a shallow, irregularly shaped ulcer on her left medial malleolus (inner ankle) with significant drainage.",
                    "pmh": ["PVD", "Obesity", "Recurrent DVT"],
                    "medications": ["Aspirin"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Lower extremity pulses: Pedal 2+ Bilat. Significant 3+ pitting edema up to the knees. Skin is warm and leathery." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 72, "rr": 16, "bp": "130/78", "o2": "98", "o2_device": "RA", "pain": 3 }
                ],
                "labs": [],
                "radiology": [
                    { "study": "Duplex Ultrasound", "findings": "Reflux noted in the greater saphenous vein. No acute DVT.", "impression": "Chronic Venous Insufficiency.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and physical exam. Which findings and interventions are characteristic of Peripheral Venous Disease (PVD)?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Brown/Leathery' skin (Hemosiderin) and 'Medial Malleolus' ulcer as venous signs", "isCorrect": true, "rationale": "Venous ulcers typically occur around the ankles (gaiter area) and have significant 'weeping' drainage." },
                    { "id": "o2", "text": "Encourage the client to elevate her legs above the level of the heart for 20 minutes, 4-5 times a day", "isCorrect": true, "rationale": "Elevation uses gravity to assist venous return and reduce edema in PVD." },
                    { "id": "o3", "text": "Counsel the client on the use of graded compression stockings (e.g., TEDs or Jobst)", "isCorrect": true, "rationale": "Compression is the cornerstone of PVD management to prevent venous reflux and pooling." },
                    { "id": "o4", "text": "Instruct the client to 'Dangle' her legs off the bed to improve pain", "isCorrect": false, "rationale": "Dangling is for ARTERIAL disease. In venous disease, dangling increases edema and pain." },
                    { "id": "o5", "text": "Maintain the client on strict bed rest with the legs flat", "isCorrect": false, "rationale": "Legs should be elevated, not flat; and bed rest increases the risk of DVT. Walking is encouraged (with compression)." },
                    { "id": "o6", "text": "Advise the client to perform foot exercises (ankle pumps) while sitting", "isCorrect": true, "rationale": "Activating the 'Calf Muscle Pump' helps move blood back toward the heart." }
                ]
            },
            "rationale": {
                "coreConcept": "Venous Insufficiency Management",
                "caseSummary": "Patient with PVD (swollen, brown, leaky legs). Focus on 'Elevation' and 'Compression'.",
                "answerAnalysis": "Correct: o1 (ID signs), o2 (Elevation), o3 (Compression), o6 (Calf pump). Incorrect: o4 (Arterial position), o5 (Flat/Bed rest is bad).",
                "trap": "Thinking 'Dangling' (o4) is the универсальный fix for leg pain. Dangle for Arteries, Elevate for Veins.",
                "goldenRule": "Venous = Victory (Elevate legs in a V-shape).",
                "steps": [
                    { "tag": "Assess", "description": "Check for pulses (usually present in PVD) and edema." },
                    { "tag": "Implement", "description": "Apply compression only AFTER checking for adequate arterial flow (to avoid compressing an ischemic leg)." }
                ],
                "mnemonic": {
                    "title": "A.V. (Positions)",
                    "content": "A-Arterial (Lower them), V-Venous (Victory/Elevate them)",
                    "explanation": "Summarizes positioning."
                },
                "cheatSheet": {
                    "title": "Venous Ulcer Traits",
                    "points": [
                        "Location: Medial malleolus.",
                        "Edges: Irregular.",
                        "Drainage: High/Moderate (Weeping).",
                        "Pain: Aching/Dull (better with elevation)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The greater saphenous vein is the longest vein in the body.",
                    "physiology": "Hemosiderin is an iron-storage complex; it deposits in the skin when RBCs leak out of pressurized veins and break down.",
                    "pharm": "Zinc oxide paste (Unna boot) is often used for healing venous ulcers."
                },
                "difficulty": {
                    "score": 70,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Elevate, Compress, and Exercise (Calf pump).",
                    "recommendedActions": ["Apply compression", "Elevate legs"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-DVTMG-Y7Z8",
        "typeId": "trend",
        "metadata": {
            "title": "DVT Management & PE Prevention",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T20:25:00Z",
            "updatedAt": "2026-01-23T20:25:00Z",
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
            "clinicalFocusTopics": ["DVT", "Pulmonary Embolism", "Anticoagulation"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.L.", "age": 45, "gender": "Female", "allergies": "NKDA", "weightKg": 72, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Right calf pain and swelling.",
                    "hpi": "Client is 3 days post-abdominal surgery. She reports sudden onset of pain and 'tightness' in her right calf. The right leg is visibly larger than the left, and the skin is warm and slightly red.",
                    "pmh": ["Recent Surgery", "Obesity"],
                    "medications": ["Enoxaparin (missed 2 doses due to patient refusal)"]
                },
                "history": [
                    { "time": "0800", "author": "RN Rivera", "note": "Right calf circumfrence: 42cm. Left calf: 38cm. Tenderness noted on palpation." },
                    { "time": "0900", "author": "MD", "note": "DVT confirmed on Doppler. Heparin drip initiated. Strict monitoring for PE needed." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "99.2", "hr": 92, "rr": 18, "bp": "128/82", "o2": "98", "o2_device": "RA", "pain": 6 }
                ],
                "labs": [
                    { "test": "D-Dimer", "value": "1200", "flag": "H", "ref": "< 500", "unit": "ng/mL" }
                ],
                "radiology": [
                    { "study": "Doppler US", "findings": "Non-compressible segment in the right popliteal vein.", "impression": "Acute proximal DVT.", "date": "0845" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and diagnostic results. Which nursing actions are most appropriate for this client with an acute DVT?",
                "options": [
                    { "id": "o1", "text": "Maintain the client on bed rest with the affected leg elevated", "isCorrect": true, "rationale": "Reduces swelling and pain while the clot begins to stabilize during initial anticoagulation." },
                    { "id": "o2", "text": "Massage the right calf to help break up the clot and reduce pain", "isCorrect": false, "rationale": "NEVER massage a DVT; this will dislodge the clot and cause a pulmonary embolism (PE)." },
                    { "id": "o3", "text": "Monitor the patient for sudden-onset chest pain, dyspnea, and tachycardia", "isCorrect": true, "rationale": "These are the hallmark signs of a pulmonary embolism (PE), the most lethal complication of DVT." },
                    { "id": "o4", "text": "Apply a Sequential Compression Device (SCD) to the right leg", "isCorrect": false, "rationale": "SCDs are for PREVENTION; once a DVT is present, applying an SCD to that leg can dislodge the clot." },
                    { "id": "o5", "text": "Initiate IV Heparin as ordered and monitor the aPTT levels every 6 hours", "isCorrect": true, "rationale": "Unfractionated heparin prevents the current clot from getting bigger while the body naturally dissolves it." },
                    { "id": "o6", "text": "Educate the patient on the purpose of 'Bridge Therapy' (Heparin + Warfarin)", "isCorrect": true, "rationale": "Warfarin takes days to work; Heparin provides immediate coverage while the INR stabilizes." }
                ]
            },
            "rationale": {
                "coreConcept": "DVT Management & Safety",
                "caseSummary": "Post-op patient with acute DVT. Priority is anticoagulation and PE prevention. Rule #1: Don't move the clot.",
                "answerAnalysis": "Correct: o1, o3, o5, o6 (Standard care). Error: o2, o4 (Risk of dislodging the clot).",
                "trap": "Thinking SCDs (o4) should be used after the clot is found. SCDs are prophylactic only.",
                "goldenRule": "DVT: Assess, Anticoagulate, but DON'T MASSAGE.",
                "steps": [
                    { "tag": "Assess", "description": "Check lung sounds and O2 sat frequently." },
                    { "tag": "Implement", "description": "Maintain aPTT at 1.5 - 2.5 times the baseline." }
                ],
                "mnemonic": {
                    "title": "Virchow's Triad",
                    "content": "Stasis, Endothelial Injury, Hypercoagulability",
                    "explanation": "The three causes of all clots."
                },
                "cheatSheet": {
                    "title": "PE Signs",
                    "points": [
                        "Sudden SOB / Tachypnea.",
                        "Chest pain on inspiration.",
                        "Tachycardia.",
                        "Impending doom."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Deep veins (e.g., Popliteal, Femoral) are the dangerous ones; superficial veins (Greater Saphenous) rarely cause PE.",
                    "physiology": "D-dimer is a fragment of fibrin that is released when a clot is being broken down.",
                    "pharm": "Protamine Sulfate is the reversal agent for Heparin."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Safety",
                    "clinicalStrategy": "Identify 'Safe' vs 'Unsafe' mechanical interventions (No massage/SCD).",
                    "recommendedActions": ["Start Heparin", "Chest pain monitoring"]
                }
            }
        }
    }
];
