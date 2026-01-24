import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 12: Items 44-50)
 * Focus: WPW, Torsades, Hyperkalemia, PA Catheter, Angiogram
 */

export const CardiologyItems_Final_Batch12: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-WPW-A1W2",
        "typeId": "trend",
        "metadata": {
            "title": "Wolff-Parkinson-White (WPW) & Delta Waves",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:30:00Z",
            "updatedAt": "2026-01-23T21:30:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["WPW", "Arrhythmias", "EKG Interpretation"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.L.", "age": 19, "gender": "Male", "allergies": "NKDA", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Episodes of rapid heart racing.",
                    "hpi": "Client reports 'sudden thumping' in his chest since childhood. Today he had an episode lasting 10 minutes. EKG in sinus rhythm shows a 'slurred' upstroke to the QRS complex (Delta wave) and a very short PR interval (< 0.12s).",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Patient stable. Sinus rhythm present at 82 bpm. Short PR interval noted." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 82, "rr": 16, "bp": "118/72", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": [
                    { "study": "EKG", "findings": "Short PR interval (0.08s). Delta wave present. Wide QRS (0.13s).", "impression": "Wolff-Parkinson-White Pattern.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the EKG and patient history. Which nursing considerations are most important for WPW Syndrome?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Delta Wave' and 'Short PR Interval' as signs of an accessory pathway (Bundle of Kent)", "isCorrect": true, "rationale": "WPW involves an extra electrical 'bridge' that bypasses the AV node, pre-exciting the ventricles." },
                    { "id": "o2", "text": "Administer Calcium Channel Blockers (Diltiazem/Verapamil) for any future tachycardia", "isCorrect": false, "rationale": "Medications that block the AV node (Diltiazem, Digoxin) should be used with EXTREME caution OR avoided in WPW as they may force electrical activity solely through the accessory pathway, potentially leading to V-Fib if AFib occurs." },
                    { "id": "o3", "text": "Prepare the client for an Electrophysiology Study (EPS) and Radiofrequency Ablation", "isCorrect": true, "rationale": "Ablation is the definitive treatment to 'burn' the accessory pathway and cure WPW." },
                    { "id": "o4", "text": "Monitor the patient for sudden-onset SVT or Atrial Fibrillation", "isCorrect": true, "rationale": "WPW patients are prone to tachyarrhythmias due to the reentry circuit." },
                    { "id": "o5", "text": "Inform the client that WPW is a benign condition that does not require treatment", "isCorrect": false, "rationale": "WPW can lead to sudden cardiac death and always warrants specialty cardiology evaluation." },
                    { "id": "o6", "text": "Instruct the client to use vagal maneuvers if palpitations occur", "isCorrect": true, "rationale": "Standard first-line management for stable reentry tachycardia." }
                ]
            },
            "rationale": {
                "coreConcept": "WPW & EKG Pre-Excitation",
                "caseSummary": "Young patient with EKG signs of WPW (Delta wave, short PR). Focus on 'Accessory Pathway' risks and 'Careful Pharma'.",
                "answerAnalysis": "Correct: o1 (ID), o3 (Definitive Tx), o4 (Risk), o6 (Behavioral). Error: o2 (AV node blockers can be dangerous in WPW), o5 (Safety failure).",
                "trap": "Thinking all SVT gets Digoxin/Calcium Channel Blockers. In WPW, these can be lethal if the patient also goes into AFib.",
                "goldenRule": "Delta Wave = WPW.",
                "steps": [
                    { "tag": "Assess", "description": "Identify the slurred upstroke on the QRS." },
                    { "tag": "Refer", "description": "Refer to an Electrophysiologist (EP Doctor)." }
                ],
                "mnemonic": {
                    "title": "D.P.R.",
                    "content": "D-Delta wave, P-Pre-excitation, R-Rapid Heart Rates",
                    "explanation": "Key elements of WPW."
                },
                "cheatSheet": {
                    "title": "WPW Avoidance List",
                    "points": [
                        "Digoxin.",
                        "Verapamil / Diltiazem.",
                        "Adenosine (use with caution/monitor)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Bundle of Kent is an anamolous bypass tract that connects the atria and the ventricles.",
                    "physiology": "Pre-excitation causes the ventricles to depolarize sooner than expected, shortening the PR interval.",
                    "pharm": "Procainamide is often the drug of choice for wide-complex tachyarrhythmias in WPW."
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "Specialized EKG",
                    "clinicalStrategy": "Acknowledge the 'Lethal potential' of accessory pathways.",
                    "recommendedActions": ["Cardiology referral", "Electrophysiology study"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-TORSA-M1N2",
        "typeId": "trend",
        "metadata": {
            "title": "Torsades de Pointes & Magnesium",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:35:00Z",
            "updatedAt": "2026-01-23T21:35:00Z",
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
            "clinicalFocusTopics": ["Torsades de Pointes", "Arrhythmias", "Magnesium Sulfate"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.G.", "age": 44, "gender": "Female", "allergies": "NKDA", "weightKg": 68, "codeStatus": "Full Code"
                },
                "setting": "Intensive Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Episodes of polymorphic V-Tach.",
                    "hpi": "Client has a history of 'Long QT Syndrome'. While on the monitor, she has short bursts of a ventricular rhythm that looks like 'twisting of the points' (Polymorphic V-Tach).",
                    "pmh": ["Long QT", "Sepsis (currently on IV antibiotics)"],
                    "medications": ["Ondansetron (Zofran)", "Erythromycin"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "QTc interval measured at 520 ms. Burst of Torsades (10 beats) noted. No pulse loss." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "100.2", "hr": 110, "rr": 20, "bp": "104/58", "o2": "96", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Magnesium", "value": "1.2", "flag": "L", "ref": "1.7 - 2.2", "unit": "mg/dL" },
                    { "test": "Potassium", "value": "3.3", "flag": "L", "ref": "3.5 - 5.0", "unit": "mEq/L" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and rhythm. Which nursing actions are most appropriate for this specialized arrhythmia?",
                "options": [
                    { "id": "o1", "text": "Recognize the rhythm as 'Torsades de Pointes' caused by Prolonged QT", "isCorrect": true, "rationale": "Long QT (QTc > 500ms) leads to this specific polymorphic V-Tach." },
                    { "id": "o2", "text": "Identify 'Ondansetron' and 'Erythromycin' as medications that prolong the QT interval", "isCorrect": true, "rationale": "Both drugs are notorious for causing QT prolongation." },
                    { "id": "o3", "text": "Administer IV Magnesium Sulfate 2g as ordered", "isCorrect": true, "rationale": "Magnesium is the drug of choice for Torsades de Pointes, regardless of the baseline magnesium level." },
                    { "id": "o4", "text": "Administer Amiodarone to stabilize the rhythm", "isCorrect": false, "rationale": "Amiodarone slows conduction and actually PROLONGS the QT interval, making it dangerous in Torsades." },
                    { "id": "o5", "text": "Notify the provider and request discontinuation of the Zofran/Erythromycin", "isCorrect": true, "rationale": "Removing QT-prolonging triggers is essential for safety." },
                    { "id": "o6", "text": "Perform unsynchronized defibrillation immediately if the patient loses a pulse", "isCorrect": true, "rationale": "Polymorphic V-Tach should be treated like V-Fib if the patient collapses." }
                ]
            },
            "rationale": {
                "coreConcept": "Torsades de Pointes Management",
                "caseSummary": "Patient has Torsades due to drug-induced long QT and low Magnesium. Magnesium is the cure.",
                "answerAnalysis": "Correct: o1, o2, o3 (Pharma specifics), o5 (Advocacy), o6 (CPR/ACLS). Error: o4 (Amiodarone makes it worse).",
                "trap": "Thinking Amiodarone (o4) or Lidocaine is the first choice for all V-Tach. For Torsades, Magnesium is King.",
                "goldenRule": "Torsades = Mg+.",
                "steps": [
                    { "tag": "Verify", "description": "Calculate the QTc on every shift for patients on high-risk meds." },
                    { "tag": "Intervene", "description": "Give Mg+ slow-push or drip as per protocol." }
                ],
                "mnemonic": {
                    "title": "M.G. (Torsades)",
                    "content": "M-Magnesium, G-Get rid of QT drugs",
                    "explanation": "Primary management steps."
                },
                "cheatSheet": {
                    "title": "QT Prolonging Drugs",
                    "points": [
                        "Antibiotics: Erythromycin, Clarithromycin, Fluoroquinolones.",
                        "Antipsychotics: Haloperidol, Ziprasidone.",
                        "Antiemetics: Ondansetron.",
                        "Antiarrhythmics: Amiodarone, Sotalol."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Polymorphic V-Tach involves multiple ectopic foci in the ventricles resulting in varying QRS morphology.",
                    "pharm": "Magnesium Sulfate acts by blocking calcium channels and stabilising the cardiac membrane."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Critical Care Pharma",
                    "clinicalStrategy": "Identify the 'Twisting' rhythm and give 'Magnesium'.",
                    "recommendedActions": ["Give IV Magnesium", "Hold QT-prolonging drugs"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-KPLUS-P7Q8",
        "typeId": "trend",
        "metadata": {
            "title": "Hyperkalemia EKG Progression",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:40:00Z",
            "updatedAt": "2026-01-23T21:40:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Hyperkalemia", "EKG", "Electrolytes"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.R.", "age": 62, "gender": "Female", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Dialysis Center / Emergency Dept",
                "historyPhysical": {
                    "chiefComplaint": "Generalized weakness and missed dialysis.",
                    "hpi": "Client has ESRD and missed her last two dialysis sessions. She is profoundly weak. Her K+ level is 7.8 mEq/L. EKG is being performed.",
                    "pmh": ["ESRD", "T2DM", "HTN"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Patient presents with K+ 7.8. EKG shows 'Tall, tented T-waves' and wide QRS complexes." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 48, "rr": 18, "bp": "102/58", "o2": "97", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Potassium", "value": "7.8", "flag": "H", "ref": "3.5 - 5.0", "unit": "mEq/L" },
                    { "test": "BUN/Cr", "value": "82/4.2", "flag": "H", "ref": "< 20 / < 1.3", "unit": "mg/dL" }
                ],
                "radiology": [
                    { "study": "EKG", "findings": "Flat P-waves. Peaked T-waves. Prolonged PR. Wide QRS (Sine wave pattern emerging).", "impression": "Severe Hyperkalemia.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and EKG findings. Which actions are required to protect the patient's heart and lower the potassium?",
                "options": [
                    { "id": "o1", "text": "Recognize 'Tall, Peaked T-waves' as the earliest EKG sign of hyperkalemia", "isCorrect": true, "rationale": "T-wave changes (peaking) occur at K+ levels as low as 5.5-6.0." },
                    { "id": "o2", "text": "Administer IV Calcium Gluconate (or Calcium Chloride) as ordered", "isCorrect": true, "rationale": "Calcium does NOT lower K+; it stabilizes the cardiac membrane (antagonizes K+ effect) to prevent immediate V-Fib." },
                    { "id": "o3", "text": "Administer IV Insulin with Dextrose (D50)", "isCorrect": true, "rationale": "Insulin shifts K+ out of the blood and back into the cells; D50 prevents hypoglycemia." },
                    { "id": "o4", "text": "Expect an order for Sodium Polystyrene Sulfonate (Kayexalate) or Patiromer", "isCorrect": true, "rationale": "These exchange resins remove K+ from the body via the GI tract (long-term removal)." },
                    { "id": "o5", "text": "Administer oral Potassium supplements to maintain cellular balance", "isCorrect": false, "rationale": "Oral K+ would be lethal for a patient with a level of 7.8." },
                    { "id": "o6", "text": "Prepare the client for emergent Hemodialysis", "isCorrect": true, "rationale": "Hemodialysis is the most effective and definitive way to remove excess K+ in an ESRD patient." }
                ]
            },
            "rationale": {
                "coreConcept": "Hyperkalemia Management (ACLS/Sepsis)",
                "caseSummary": "Severe hyperkalemia (7.8) with cardiac instability (Sine wave/Peaked T). Emergency stabilization and removal needed.",
                "answerAnalysis": "Correct: o1, o2 (Stabilization), o3 (Shifting), o4, o6 (Removal). Error: o5 (Fatal mistake).",
                "trap": "Believing Calcium (o2) lowers the potassium. It doesn't; it just keeps the 'Heart from stopping' until the other drugs work.",
                "goldenRule": "Peaked T-waves = Give Calcium first.",
                "steps": [
                    { "tag": "Stabilize", "description": "Give Calcium to protect the heart." },
                    { "tag": "Shift", "description": "Give Insulin/Glucose or Albuterol to move K+ into cells." },
                    { "tag": "Remove", "description": "Use Diuretics, Resins, or Dialysis to get K+ out of the body." }
                ],
                "mnemonic": {
                    "title": "C.I.B.I.K.",
                    "content": "C-Calcium, I-Insulin, B-Bicarb, I-Inhaled Albuterol, K-Kayexalate",
                    "explanation": "Meds of hyperkalemia."
                },
                "cheatSheet": {
                    "title": "EKG Progression",
                    "points": [
                        "1. Peaked T-waves.",
                        "2. Flat P-waves.",
                        "3. Wide QRS.",
                        "4. Sine Wave -> V-Fib."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "N/A",
                    "physiology": "Potassium is the primary intracellular cation; high extracellular levels reduce the resting membrane potential, leading to hyperexcitability and then arrest.",
                    "pharm": "Sodium Polystyrene (Kayexalate) carries a risk of bowel necrosis, especially in post-op patients."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Synthesis/Pharma",
                    "clinicalStrategy": "Stabilize (Calcium), Shift (Insulin), and Remove (Dialysis).",
                    "recommendedActions": ["Give Calcium", "Start Insulin/D50"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-HEMOD-A1B2",
        "typeId": "trend",
        "metadata": {
            "title": "Hemodynamic Monitoring: PA Catheter Basics",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:45:00Z",
            "updatedAt": "2026-01-23T21:45:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Hemodynamics", "PA Catheter", "Critical Care"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "N.A. - Unit Case", "age": 0, "gender": "O", "allergies": "N/A", "weightKg": 0, "codeStatus": "N/A"
                },
                "setting": "CVICU",
                "historyPhysical": {
                    "chiefComplaint": "Interpretation of Schwann-Ganz readings.",
                    "hpi": "The nurse is orienting a new hire to the hemodynamic monitor of a patient with severe heart failure. The monitor shows: CVP 12, PAP 45/22, PCWP 20, CI 1.8.",
                    "pmh": ["N/A"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "0800", "author": "Charge RN", "note": "Hemodynamic profile shows 'Wet and Cold' state. High wedge, low index." }
                ],
                "vitals": [],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the hemodynamic parameters. Which conclusions are correct regarding these values?",
                "options": [
                    { "id": "o1", "text": "Recognize the PCWP (20 mmHg) as elevated", "isCorrect": true, "rationale": "Normal PCWP is 8-12; a value of 20 indicates high left atrial pressure and pulmonary congestion." },
                    { "id": "o2", "text": "Identify the Cardiac Index (1.8) as significantly low", "isCorrect": true, "rationale": "Normal index is 2.5 - 4.0; 1.8 indicates inadequate cardiac output for the patient's body surface area." },
                    { "id": "o3", "text": "Recognize the CVP (12 mmHg) as elevated", "isCorrect": true, "rationale": "Normal CVP is 2-8; 12 indicates fluid overload or right-sided backup." },
                    { "id": "o4", "text": "Prepare to administer a 500 mL Normal Saline bolus", "isCorrect": false, "rationale": "The patient is already overloaded (CVP 12, Wedge 20); adding fluid would be dangerous." },
                    { "id": "o5", "text": "Anticipate the need for an inotropic agent (e.g., Milrinone)", "isCorrect": true, "rationale": "Low CI and high filling pressures require an inotrope to help the pump move fluid forward." },
                    { "id": "o6", "text": "Ensure the pressure transducer is leveled to the 'Phlebostatic Axis'", "isCorrect": true, "rationale": "Standard measurement accuracy: transducer must level with the right atrium (4th intercostal space, mid-axillary line)." }
                ]
            },
            "rationale": {
                "coreConcept": "Hemodynamic Monitoring Interpretation",
                "caseSummary": "Interpretation of PA catheter values. All pressures are High; Output is Low. Fix with Inotropes.",
                "answerAnalysis": "Correct: o1, o2, o3 (ID High/Low), o5 (Tx), o6 (Accuracy). Error: o4 (More fluid is bad).",
                "trap": "Thinking 'CVP' is the only measure of fluid. In complex heart failure, you must look at the 'Wedge' (PCWP) for left-side status.",
                "goldenRule": "High Wedge = Overloaded.",
                "steps": [
                    { "tag": "Level", "description": "Zero and level the transducer to the phlebostatic axis." },
                    { "tag": "Calculate", "description": "Ensure the Cardiac Index is adjusted for the patient's BSA." }
                ],
                "mnemonic": {
                    "title": "Hemodynamic Values",
                    "content": "CVP: 2-8, PAP: 15-30/8-15, PCWP: 8-12, CI: 2.5-4",
                    "explanation": "Standard ranges."
                },
                "cheatSheet": {
                    "title": "Leveling",
                    "points": [
                        "Phlebostatic Axis: 4th ICS, mid-axillary line.",
                        "Represents the level of the right atrium."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The PA catheter passes through the RA, RV, and rests in the Pulmonary Artery.",
                    "physiology": "Wedging the balloon temporarily blocks flow from the RV, allowing the catheter tip to 'see' the pressure in the left atrium.",
                    "pharm": "Milrinone is a phosphodiesterase inhibitor with inotropic and vasodilatory (inodilator) effects."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Advanced Hemodynamics",
                    "clinicalStrategy": "Identify the 'Wet and Cold' pattern.",
                    "recommendedActions": ["Zero transducer", "Titrate Inotropes"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-ANGIO-X5Y6",
        "typeId": "trend",
        "metadata": {
            "title": "Coronary Angiogram Pre-Op & Contrast Safety",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T21:50:00Z",
            "updatedAt": "2026-01-23T21:50:00Z",
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
            "clinicalFocusTopics": ["Angiogram", "Contrast Media", "Metformin"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "L.W.", "age": 62, "gender": "Male", "allergies": "Shellfish (Hives)", "weightKg": 95, "codeStatus": "Full Code"
                },
                "setting": "Pre-Procedure Unit",
                "historyPhysical": {
                    "chiefComplaint": "Preparation for Coronary Angiography.",
                    "hpi": "Client is scheduled for a diagnostic angiogram. He has a history of type 2 diabetes and hypertension. He took all of his medications this morning with a sip of water.",
                    "pmh": ["T2DM", "CAD", "HTN"],
                    "medications": ["Metformin", "Amlodipine", "Aspirin"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Patient admits to 'Shellfish Allergy'. Has taken morning Metformin dose." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 78, "rr": 16, "bp": "142/86", "o2": "98", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Creatinine", "value": "1.5", "flag": "H", "ref": "0.7 - 1.3", "unit": "mg/dL" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the pre-procedure checks and history. Which nursing actions are most important for this client's safety before the angiogram?",
                "options": [
                    { "id": "o1", "text": "Notify the provider and radiology concerning the 'Shellfish' allergy", "isCorrect": true, "rationale": "Shellfish allergy is a potential cross-sensitivity indicator for IV Contrast Dye allergies." },
                    { "id": "o2", "text": "Verify if the Metformin has been held for 24-48 hours", "isCorrect": true, "rationale": "Metformin must be held before and for 48 hours after contrast dye to prevent lactic acidosis, especially in patients with impaired renal function (Cr 1.5)." },
                    { "id": "o3", "text": "Confirm the patient is NPO (Nothing by mouth) for at least 6-8 hours", "isCorrect": true, "rationale": "Safety requirement for procedures involving sedation/anesthesia." },
                    { "id": "o4", "text": "Expect an order for Mucomyst (Acetylcysteine) or aggressive pre-hydration", "isCorrect": true, "rationale": "These strategies help protect the kidneys from Contrast-Induced Nephropathy (CIN)." },
                    { "id": "o5", "text": "Encourage the client to drink 2 liters of water immediately after the procedure", "isCorrect": true, "rationale": "Flushing the dye out of the kidneys is a post-op priority." },
                    { "id": "o6", "text": "Tell the client he will be under 'General Anesthesia' for the entire procedure", "isCorrect": false, "rationale": "Angiograms are typically done under 'Conscious Sedation' (Mac), not General Anesthesia; the patient needs to be able to follow commands (e.g., 'Take a deep breath')." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiac Angiogram Safety",
                "caseSummary": "Patient preparing for angiogram. High risk due to Metformin use, Shellfish allergy, and slightly elevated Creatinine.",
                "answerAnalysis": "Correct: o1, o2 (Allergy/Meds), o3 (NPO), o4, o5 (Renal protection). Error: o6 (Sedation type).",
                "trap": "Believing 'Shellfish' is the ONLY thing that matters. Metformin + Contrast (o2) is a frequent board favorite for safety.",
                "goldenRule": "Hold Metformin for 48 hours.",
                "steps": [
                    { "tag": "Assess", "description": "Check Creatinine and GFR before any contrast-based study." },
                    { "tag": "Teach", "description": "Warn the patient about the 'Warm flush' or 'Feeling of peeing' when the dye is injected." }
                ],
                "mnemonic": {
                    "title": "D.Y.E.",
                    "content": "D-Disconnect Metformin, Y-Yes to IV fluids, E-Evaluate allergies",
                    "explanation": "Summarizes contrast care."
                },
                "cheatSheet": {
                    "title": "Renal Protection",
                    "points": [
                        "Check baseline Creatinine.",
                        "Hold Metformin.",
                        "IV Saline pre and post.",
                        "Monitor Urine Output."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Angiogram involves injecting dye into the coronary arteries (Left Main, LAD, LCx, RCA).",
                    "physiology": "Contrast dye causes osmotic diuresis and direct toxicity to the renal tubular cells.",
                    "pharm": "Acetylcysteine (Mucomyst) is an antioxidant that may reduce renal damage."
                },
                "difficulty": {
                    "score": 75,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Search for 'Metformin' and 'Renal' filters.",
                    "recommendedActions": ["Verify Metformin hold", "Notify of allergy"]
                }
            }
        }
    }
];
