import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 11: Items 40-50)
 * Focus: Dressler's, HCM, CEA, AAA, EKG Review
 */

export const CardiologyItems_Final_Batch11: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-DRESS-A9B0",
        "typeId": "trend",
        "metadata": {
            "title": "Pericarditis & Dressler's Syndrome",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:10:00Z",
            "updatedAt": "2026-01-23T21:10:00Z",
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
            "clinicalFocusTopics": ["Pericarditis", "Dressler's Syndrome", "Post-MI Complications"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "W.J.", "age": 60, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Outpatient / ED",
                "historyPhysical": {
                    "chiefComplaint": "Sharp chest pain that worsens when lying flat.",
                    "hpi": "Client had a major myocardial infarction (STEMI) 4 weeks ago. He now presents with sharp, pleuritic chest pain. He states, 'The pain feels better when I sit up and lean forward'. He also has a low-grade fever.",
                    "pmh": ["Recent MI (4 weeks ago)", "HTN"],
                    "medications": ["Aspirin", "Metoprolol"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Pericardial friction rub heard at the left lower sternal border with the patient leaning forward. Pain is 8/10 when supine; 2/10 when leaning forward." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "100.2", "hr": 94, "rr": 20, "bp": "118/74", "o2": "97", "o2_device": "RA", "pain": 8 }
                ],
                "labs": [
                    { "test": "ESR", "value": "55", "flag": "H", "ref": "<15", "unit": "mm/hr" },
                    { "test": "Troponin I", "value": "0.02", "flag": "N", "ref": "< 0.04", "unit": "ng/mL" }
                ],
                "radiology": [
                    { "study": "EKG", "findings": "Diffuse ST-segment elevation in all leads. PR-segment depression.", "impression": "Acute Pericarditis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and EKG. Which findings and interventions are characteristic of Dressler's Syndrome?",
                "options": [
                    { "id": "o1", "text": "Identify the etiology as an 'Autoimmune' response following myocardial injury", "isCorrect": true, "rationale": "Dressler's is a late pericarditis (weeks post-MI) caused by antibodies attacking the damaged pericardium." },
                    { "id": "o2", "text": "Recognize the 'Sitting up and leaning forward' as the characteristic relieving position", "isCorrect": true, "rationale": "This position moves the heart away from the lungs and reduces friction rub pain." },
                    { "id": "o3", "text": "Assess for a 'Pericardial Friction Rub' (a high-pitched, scratchy sound)", "isCorrect": true, "rationale": "The friction rub is the classic auscultatory finding of pericarditis." },
                    { "id": "o4", "text": "Identify the 'Diffuse ST Elevation' on EKG as a sign of global inflammation", "isCorrect": true, "rationale": "Pericarditis shows ST elevation in almost all leads, unlike MI which is localized to specific anatomical regions." },
                    { "id": "o5", "text": "Prepare for emergency cardiac catheterization to open a blocked artery", "isCorrect": false, "rationale": "The troponin is normal (0.02) and the ST changes are diffuse, not regional. This is inflammation, not a new blockage." },
                    { "id": "o6", "text": "Expect an order for high-dose Aspirin or NSAIDs (e.g., Ibuprofen) and Colchicine", "isCorrect": true, "rationale": "Colchicine plus NSAIDs is the standard dual therapy for pericarditis to reduce recurrence." }
                ]
            },
            "rationale": {
                "coreConcept": "Dressler's Syndrome (Pericarditis)",
                "caseSummary": "Late post-MI chest pain with classical pericarditis traits (Position, Rub, EKG).",
                "answerAnalysis": "Correct: o1, o2, o3, o4, o6. Error: o5 (Wrong diagnosis/MI vs Pericarditis).",
                "trap": "Thinking ST Elevation always means Heart Attack (MI). In pericarditis, it's 'Diffuse' (Everywhere).",
                "goldenRule": "Leaning Forward = Pericarditis.",
                "steps": [
                    { "tag": "Assess", "description": "Listen for the friction rub while the patient holds their breath." },
                    { "tag": "Teach", "description": "Explain the importance of long-term Colchicine to prevent relapses." }
                ],
                "mnemonic": {
                    "title": "P.L.A.T.E. (Pericarditis)",
                    "content": "P-Pleuritic pain, L-Lean forward, A-All leads (ST elevation), T-Troponin normal, E-Elevated ESR",
                    "explanation": "Summarizes pericarditis findigns."
                },
                "cheatSheet": {
                    "title": "MI vs Pericarditis EKG",
                    "points": [
                        "MI: Regional ST elevation, Reciprocal ST depression, Pathologic Q-waves.",
                        "Pericarditis: Diffuse ST elevation (Concave up), PR-depression, No Q-waves."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The pericardium consists of two layers: parietal and visceral.",
                    "physiology": "Friction between the inflamed layers causes the characterisic chest pain.",
                    "pharm": "Colchicine is an anti-inflammatory that inhibits microtubule polymerization."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Analysis",
                    "clinicalStrategy": "Differentiate 'Position-dependent' pain from 'Exertional' pain.",
                    "recommendedActions": ["Sit upright", "Give Colchicine"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-CEAMG-J1K2",
        "typeId": "trend",
        "metadata": {
            "title": "Carotid Endarterectomy (CEA) Care",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:15:00Z",
            "updatedAt": "2026-01-23T21:15:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Vascular Surgery", "CEA", "Neuro Checks"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.H.", "age": 72, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "PACU / Surgical Step-down",
                "historyPhysical": {
                    "chiefComplaint": "Post-Left Carotid Endarterectomy (CEA).",
                    "hpi": "Client underwent surgical removal of plaque from the left carotid artery to prevent further TIAs. He is 2 hours post-op. He has a small drain in the neck and a secure dressing.",
                    "pmh": ["Carotid Stenosis", "TIA", "Smoking"],
                    "medications": ["Aspirin", "Statins"]
                },
                "history": [
                    { "time": "1600", "author": "RN Smith", "note": "Arrived from OR. Neuro exam: Baseline (Alert, following commands). Pupils 3mm brisk. Grip strength 5/5 bilat." },
                    { "time": "1800", "author": "RN Smith", "note": "Patient reports 'tightness' in neck. Neck circumference has increased by 1 cm. Respiratory rate is 24." }
                ],
                "vitals": [
                    { "time": "1600", "tempF": "98.2", "hr": 78, "rr": 16, "bp": "138/78", "o2": "99", "o2_device": "RA", "pain": 2 },
                    { "time": "1800", "tempF": "98.4", "hr": 104, "rr": 26, "bp": "168/94", "o2": "94", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and operative site. Which nursing actions are most critical for this post-CEA monitoring?",
                "options": [
                    { "id": "o1", "text": "Assess for 'Stridor' and Tracheal Deviation", "isCorrect": true, "rationale": "Neck hematoma post-CEA can compress the trachea, leading to rapid airway obstruction." },
                    { "id": "o2", "text": "Maintain the BP at strictly ordered targets (typically SBP 100-140)", "isCorrect": true, "rationale": "Hypotension can cause cerebral ischemia (clot); Hypertension can cause hyperperfusion syndrome or bleed (hematoma)." },
                    { "id": "o3", "text": "Keep a 'Tracheostomy Tray' at the bedside", "isCorrect": true, "rationale": "A surgical safety requirement for neck surgeries in case of hematoma-induced airway collapse." },
                    { "id": "o4", "text": "Perform cranial nerve checks (VII, X, XI, XII)", "isCorrect": true, "rationale": "The surgical field is near major nerves (facial, vagus, spinal accessory, hypoglossal); injury can cause droop, hoarseness, or tongue deviation." },
                    { "id": "o5", "text": "Position the patient in a Supine position with the head flat", "isCorrect": false, "rationale": "Flat positioning increases neck edema and venous pressure; HOB should be elevated 30 degrees." },
                    { "id": "o6", "text": "Notify the surgeon immediately of the increased neck circumference and tachypnea", "isCorrect": true, "rationale": "These are signs of an expanding hematoma—a surgical emergency." }
                ]
            },
            "rationale": {
                "coreConcept": "CEA Post-Op Management",
                "caseSummary": "Post-CEA patient developing signs of an expanding neck hematoma (Tightness, Tachypnea, increased girth). Airway is the priority.",
                "answerAnalysis": "Correct: o1, o3, o6 (Airway), o2 (BP control), o4 (Neuro). Error: o5 (Positioning).",
                "trap": "Thinking BP (o2) doesn't matter 'if the brain is clear'. BP is the most common cause of CEA complications (Stroke/Bleed).",
                "goldenRule": "Neck Girth Increase = Airway Emergency.",
                "steps": [
                    { "tag": "Assess", "description": "Check for tongue deviation (CN XII) and hoarseness (CN X)." },
                    { "tag": "Implement", "description": "Control BP using IV titrated meds (e.g., Labetalol)." }
                ],
                "mnemonic": {
                    "title": "C.E.A. Safety",
                    "content": "C-Cranial nerves, E-Edema (Airway), A-Arterial pressure control",
                    "explanation": "Summarizes CEA focus."
                },
                "cheatSheet": {
                    "title": "Neuro Checks",
                    "points": [
                        "Facial droop (VII).",
                        "Swallowing / Hoarseness (IX/X).",
                        "Shoulder shrug (XI).",
                        "Tongue midline (XII)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The carotid artery provides the majority of blood flow to the cerebral hemispheres.",
                    "physiology": "Baroreceptor sensitivity is often temporarily lost during surgery, leading to wide swings in BP.",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "Emergency Analysis",
                    "clinicalStrategy": "Prioritize 'Airway' (o1, o3, o6).",
                    "recommendedActions": ["Notify Surgeon", "Keep Trach tray ready"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-AAARU-M3N4",
        "typeId": "trend",
        "metadata": {
            "title": "AAA Rupture vs Stability",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:20:00Z",
            "updatedAt": "2026-01-23T21:20:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["AAA", "Aortic Rupture", "Hypovolemic Shock"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "D.W.", "age": 70, "gender": "Male", "allergies": "NKDA", "weightKg": 88, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Sudden, excruciating abdominal and flank pain.",
                    "hpi": "Client has a known 6.0 cm Abdominal Aortic Aneurysm (AAA). He presents today with sudden, severe pain that radiates to his back. He is pale and reports feeling 'like I'm going to pass out'. Pulsatile mass is noted in the mid-abdomen.",
                    "pmh": ["AAA (6.0cm)", "CAD", "Smoking"],
                    "medications": ["Aspirin", "Amlodipine"]
                },
                "history": [
                    { "time": "1500", "author": "ER RN", "note": "Patient presents in acute distress. Grey Turner's sign (eccymosis on flanks) noted. BP dropping." }
                ],
                "vitals": [
                    { "time": "1500", "tempF": "98.2", "hr": 124, "rr": 28, "bp": "78/40", "o2": "94", "o2_device": "RA", "pain": 10 }
                ],
                "labs": [
                    { "test": "Hgb", "value": "7.4", "flag": "L", "ref": "14 - 18", "unit": "g/dL" }
                ],
                "radiology": [
                    { "study": "CT Abdomen (Stat)", "findings": "Large retroperitoneal hematoma. Aortic wall is disrupted.", "impression": "Ruptured AAA.", "date": "1515" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and signs. Which findings and interventions are characteristic of a ruptured AAA?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Grey Turner's Sign' (Ecchymosis on flanks) as a sign of retroperitoneal bleeding", "isCorrect": true, "rationale": "Blood from the leaking aorta tracks around the abdominal wall, causing visible bruising on the side." },
                    { "id": "o2", "text": "Prioritize aggressive fluid resuscitation with two large-bore IVs", "isCorrect": true, "rationale": "Hemorrhagic shock is the immediate cause of death and must be treated while prepping for surgery." },
                    { "id": "o3", "text": "Auscultate for an abdominal bruit over the pulsatile mass", "isCorrect": false, "rationale": "In an acute rupture, don't waste time auscultating or palpating; focus on life-saving stabilization and surgery." },
                    { "id": "o4", "text": "Prepare the client for immediate emergency surgical repair (Open or EVAR)", "isCorrect": true, "rationale": "Ruptured AAA is a surgical emergency with extremely high mortality without repair." },
                    { "id": "o5", "text": "Expect an order for a Stat Crossmatch of 4-6 units of Packed RBCs", "isCorrect": true, "rationale": "Massive blood loss is expected." },
                    { "id": "o6", "text": "Maintain the client in a High-Fowler's position to comfort the breathing", "isCorrect": false, "rationale": "In shock, the patient should be supine to maximize cerebral perfusion." }
                ]
            },
            "rationale": {
                "coreConcept": "AAA Rupture Management",
                "caseSummary": "Patient with known AAA presents with classic signs of rupture: Pain, Shock, Grey-Turner's sign. Emergency surgery is the only fix.",
                "answerAnalysis": "Correct: o1 (ID signs), o2, o4, o5 (Management). Error: o3 (Not a priority/dangerous to palpate), o6 (Positioning error).",
                "trap": "Trying to 'Assess' for a bruit (o3) in an emergency. Assessment should be rapid and focused on 'Shock' and 'Surgery Prep'.",
                "goldenRule": "AAA Rupture = Pain + Pulsatile Mass + Hypotension.",
                "steps": [
                    { "tag": "Implement", "description": "Establish multi-port large bore IVs (14g/16g)." },
                    { "tag": "Evaluate", "description": "Identify 'Grey Turner's' and 'Cullen's' signs." }
                ],
                "mnemonic": {
                    "title": "A.A.A. Crisis",
                    "content": "A-Abdominal pain (back/flank), A-Alert (Mental status drop from shock), A-Anemia (Sudden Hgb drop)",
                    "explanation": "Summarizes rupture findings."
                },
                "cheatSheet": {
                    "title": "Bruising Signs",
                    "points": [
                        "Grey Turner's: Flank (Sides/Back).",
                        "Cullen's: Periumbilical (Belly button)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The abdominal aorta lies behind the peritoneum (retroperitoneal).",
                    "physiology": "Most ruptures occur posteriorly into the retroperitoneal space.",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Emergency Management",
                    "clinicalStrategy": "Identify the 'Hemorrhagic Shock' and move to 'Surgery'.",
                    "recommendedActions": ["Stat Crossmatch", "Immediate OR"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-DIGOX-P5Q6",
        "typeId": "trend",
        "metadata": {
            "title": "Digoxin Toxicity & Electrolytes",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:25:00Z",
            "updatedAt": "2026-01-23T21:25:00Z",
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
            "clinicalFocusTopics": ["Digoxin", "Pharmacology", "Toxicity"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.F.", "age": 82, "gender": "Female", "allergies": "NKDA", "weightKg": 52, "codeStatus": "Full Code"
                },
                "setting": "Skilled Nursing Facility",
                "historyPhysical": {
                    "chiefComplaint": "Nausea, vomiting, and 'seeing yellow lights'.",
                    "hpi": "Client has chronic heart failure and takes Digoxin and Furosemide daily. She reports a 3-day history of loss of appetite and nausea. She states, 'Everything looks like it has a yellow glow around it today'.",
                    "pmh": ["CHF", "Chronic Kidney Disease"],
                    "medications": ["Digoxin", "Furosemide", "Lisinopril"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Patient reports seeing 'halos' and 'yellow/green light'. Pulse is 52 and irregular (new)." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.2", "hr": 52, "rr": 18, "bp": "110/68", "o2": "97", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Potassium", "value": "3.1", "flag": "L", "ref": "3.5 - 5.0", "unit": "mEq/L" },
                    { "test": "Digoxin Level", "value": "2.8", "flag": "H", "ref": "0.5 - 2.0", "unit": "ng/mL" },
                    { "test": "Creatinine", "value": "2.2", "flag": "H", "ref": "0.7 - 1.3", "unit": "mg/dL" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and laboratory data. Which findings and nursing actions are most appropriate for this suspect toxicity?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Yellow vision/Halos' and 'GI upset' as classic Digoxin Toxicity", "isCorrect": true, "rationale": "Visual disturbances and GI symptoms are the earliest signs of toxicity." },
                    { "id": "o2", "text": "Identify 'Hypokalemia' (3.1) as the primary risk factor triggering the toxicity", "isCorrect": true, "rationale": "Low potassium allows more Digoxin to bind to the Na+/K+ ATPase pump, increasing its toxic effect." },
                    { "id": "o3", "text": "Hold the next dose of Digoxin and notify the provider", "isCorrect": true, "rationale": "The level (2.8) is definitively toxic (Normal < 2.0)." },
                    { "id": "o4", "text": "Encourage the patient to increase her dose of Furosemide to 'flush out' the drug", "isCorrect": false, "rationale": "Furosemide worsens hypokalemia, which worsens Digoxin toxicity. It should be used cautiously or held." },
                    { "id": "o5", "text": "Assess the apical pulse for 1 full minute before any medication administration", "isCorrect": true, "rationale": "Standard assessment for Digoxin (hold if HR < 60)." },
                    { "id": "o6", "text": "Expect an order for 'Digibind' (Digoxin immune Fab) for severe poisoning", "isCorrect": true, "rationale": "Digibind is the specific antidote for life-threatening Digoxin toxicity." }
                ]
            },
            "rationale": {
                "coreConcept": "Digoxin Toxicity & Safe Nursing",
                "caseSummary": "Elderly patient on Digoxin/Diuretic combo. Low K+ and high Creatinine led to toxicity. Signs: Yellow halos, bradycardia, nausea.",
                "answerAnalysis": "Correct: o1, o2 (Patho/Signs), o3, o5 (Nursing action), o6 (Antidote). Error: o4 (Diuretic danger).",
                "trap": "Believing Digoxin itself causes the Low K+. It doesn't. The Diuretic (Lasix) causes the Low K+, and the Low K+ causes the toxicity.",
                "goldenRule": "Potassium must be normal for Digoxin to be safe.",
                "steps": [
                    { "tag": "Assess", "description": "Always check apical pulse and K+ level before giving Digoxin." },
                    { "tag": "Teach", "description": "Advise patient to report any change in appetite or vision immediately." }
                ],
                "mnemonic": {
                    "title": "A.P.P.L.E.S.",
                    "content": "A-Abdominal pain/Anorexia, P-Pulse (slow), P-Potassium (keep it high), L-Level (check blood), E-Eye (yellow halos), S-Sugar (not related but standard med safety)",
                    "explanation": "Summarizes Digoxin care."
                },
                "cheatSheet": {
                    "title": "Digoxin Normals",
                    "points": [
                        "Level: 0.5 - 2.0 ng/mL.",
                        "HR Threshold: Hold if < 60 (Adult), < 90 (Infant).",
                        "Interaction: Verapamil/CCBs can increase Digoxin levels."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Inhibition of the Na+/K+ ATPase pump increases intracellular calcium, increasing contractility (Positive Inotrope) and slowing the HR (Negative Chronotrope).",
                    "pharm": "Digoxin is primarily cleared by the kidneys (watch Cr levels)."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Pharma Synthesis",
                    "clinicalStrategy": "Link 'K+' and 'Digoxin' in an inverse relationship.",
                    "recommendedActions": ["Hold Digoxin", "Replace K+", "Check Level"]
                }
            }
        }
    }
];
