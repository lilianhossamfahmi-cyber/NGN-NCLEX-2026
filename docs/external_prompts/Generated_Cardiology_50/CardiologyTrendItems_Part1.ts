import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH FIDELITY RECONSTRUCTION - PART 1 (Items 1-5)
 * Standard: Deep Clinical Context, 3-Point Trends, 4-Pillar Rationales
 */

export const CardiologyItems_Part1: MasterQuestionItem[] = [
    {
        "id": "Cardiology-Trend-HF-Shock-001",
        "typeId": "trend",
        "metadata": {
            "title": "Acute Heart Failure Progressing to Cardiogenic Shock",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:00:00Z",
            "updatedAt": "2026-01-23T12:00:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 100,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Heart Failure", "Shock", "Hemodynamics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "E.V.", "age": 74, "gender": "Female", "allergies": "Sulfa", "weightKg": 82, "codeStatus": "Full Code" },
                "setting": "Cardiovascular ICU",
                "historyPhysical": {
                    "chiefComplaint": "Severe dyspnea, 'drowning' sensation",
                    "hpi": "Client admitted with acute decompensated heart failure (ADHF). Despite initial diuresis, patient is becoming increasingly lethargic and cool to touch.",
                    "pmh": ["HFrEF (EF 20%)", "CKD Stage 3", "Atrial Fibrillation"],
                    "medications": ["Dobutamine Infusion (Started 30 min ago)", "Furosemide IV"]
                },
                "vitals": [
                    { "time": "08:00", "hr": 92, "bp": "148/92", "rr": 22, "o2": "94%", "tempF": "98.6" },
                    { "time": "10:00", "hr": 110, "bp": "118/72", "rr": 28, "o2": "91%", "tempF": "98.7" },
                    { "time": "12:00", "hr": 124, "bp": "88/54", "rr": 34, "o2": "86%", "tempF": "98.4" }
                ],
                "labs": [
                    { "test": "Lactate", "value": "1.1", "time": "08:00", "flag": "N" },
                    { "test": "Lactate", "value": "3.4", "time": "12:00", "flag": "H" },
                    { "test": "BNP", "value": "2400", "time": "08:00", "flag": "H" }
                ],
                "history": [
                    { "time": "12:00", "note": "Extremities mottled. Urinary output 10mL/hr for last 2 hours. Pulses thready." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Review the trended data. Which three findings definitively indicate the transition from Heart Failure to Cardiogenic Shock?",
                "options": [
                    { "id": "o1", "text": "Rapid narrowing of pulse pressure (56 to 34 mmHg)", "isCorrect": true, "rationale": "Narrowing pulse pressure indicates diminishing stroke volume." },
                    { "id": "o2", "text": "Elevation in Lactate (1.1 to 3.4)", "isCorrect": true, "rationale": "Lactate > 2.0 confirms tissue hypoperfusion (anaerobic metabolism)." },
                    { "id": "o3", "text": "Sustained tachycardia > 120 bpm", "isCorrect": false, "rationale": "While present, tachycardia is a non-specific compensatory mechanism. Hypotension and Lactate are more definitive of 'Shock'." },
                    { "id": "o4", "text": "Paradoxical drop in Systolic BP despite increasing HR", "isCorrect": true, "rationale": "The decoupling of HR and BP (HR up, BP down) signifies compensatory failure." },
                    { "id": "o5", "text": "Worsening hypoxia (94% to 86%)", "isCorrect": false, "rationale": "Indicates respiratory failure (pulmonary edema) which can coexist, but IS NOT the definition of shock (perfusion failure)." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiogenic Shock Transition",
                "caseSummary": "The patient is failing to pump (Pump Failure). Despite the heart beating faster (Compensatory), the output is falling (Hypotension), tissues are starving (Lactate), and organs are failing (Oliguria).",
                "answerAnalysis": "Shock is defined by **Perfusion Failure**, not just low BP. The key markers are Lactate (Cellular hypoxia), Narrow Pulse Pressure (Low Stroke Volume), and the breakdown of compensation (BP falling despite HR rising).",
                "goldenRule": "Heart Failure is 'Wet'; Cardiogenic Shock is 'Wet AND Cold' (Hypoperfused).",
                "cheatSheet": { "title": "Shock Signs", "points": ["Lactate > 2 = Cells dying", "CI < 2.2 = Heart failing", "SVR High = Vessels squeezing"] }
            }
        }
    },
    {
        "id": "Cardiology-Trend-NSTEMI-002",
        "typeId": "trend",
        "metadata": {
            "title": "Unstable Angina Evolving into NSTEMI",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:01:00Z",
            "updatedAt": "2026-01-23T12:01:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Generate Solutions" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "J.K.", "age": 62, "gender": "Male" },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Crushing substernal chest pain",
                    "medications": ["Aspirin 325mg (Taken by EMS)", "Nitroglycerin SL x3 (No relief)"]
                },
                "vitals": [
                    { "time": "13:00", "hr": 84, "bp": "150/90", "pain": 6 },
                    { "time": "14:00", "hr": 98, "bp": "142/86", "pain": 8 },
                    { "time": "15:00", "hr": 110, "bp": "130/78", "pain": 9 }
                ],
                "labs": [
                    { "test": "Troponin I", "value": "0.02", "time": "13:15", "flag": "N" },
                    { "test": "Troponin I", "value": "0.48", "time": "15:15", "flag": "H (!)" }
                ],
                "radiology": [
                    { "study": "ECG (13:00)", "findings": "ST Depression in V4-V6. No Elevation." },
                    { "study": "ECG (15:00)", "findings": "Deeper ST depression V4-V6. T-wave inversion." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse reviews the trend. Which action is the PRIORITY now that the diagnosis has shifted from Unstable Angina to NSTEMI?",
                "options": [
                    { "id": "o1", "text": "Prepare for immediate Cath Lab activation (Early Invasive Strategy)", "isCorrect": true, "rationale": "Rising Troponin + Refractory Pain = High Risk NSTEMI demanding angiography." },
                    { "id": "o2", "text": "Initiate Heparin infusion per ACS protocol", "isCorrect": true, "rationale": "Anticoagulation is critical to prevent thrombus propagation in the partially occluded vessel." },
                    { "id": "o3", "text": "Administer TNK-tPA (Thrombolytics)", "isCorrect": false, "rationale": "CONTRAINDICATED in NSTEMI. Fibrinolytics are ONLY for STEMI. They increase mortality in NSTEMI." },
                    { "id": "o4", "text": "Discharge to stress test", "isCorrect": false, "rationale": "Patient is actively infracting (Positive Troponin)." }
                ]
            },
            "rationale": {
                "coreConcept": "NSTEMI Management",
                "goldenRule": "NSTEMI = No Thrombolytics! It is a 'White Clot' (Platelet rich), not a 'Red Clot'.",
                "trap": "Giving tPA to an NSTEMI patient. This causes bleeding without opening the vessel effectively."
            }
        }
    },
    {
        "id": "Cardiology-Trend-Tamponade-003",
        "typeId": "trend",
        "metadata": {
            "title": "Post-CABG Cardiac Tamponade Recognition",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:02:00Z",
            "updatedAt": "2026-01-23T12:02:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 99,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "setting": "CVICU (Post-Op Day 0)",
                "historyPhysical": {
                    "hpi": "Client returned from CABG x 3 grafts 4 hours ago. Ventilated and sedated."
                },
                "vitals": [
                    { "time": "14:00", "hr": 88, "bp": "110/70 (MAP 83)", "cvp": 8 },
                    { "time": "15:00", "hr": 105, "bp": "96/74 (MAP 81)", "cvp": 14 },
                    { "time": "16:00", "hr": 130, "bp": "78/68 (MAP 71)", "cvp": 22 }
                ],
                "history": [
                    { "time": "14:00", "note": "Mediastinal chest tube draining 150ml/hr bright red." },
                    { "time": "15:00", "note": "Mediastinal chest tube draining 0ml/hr. Milked tube, no output." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Calculate the Pulse Pressure trend. Which specific cues indicate Obstructive Shock (Tamponade)?",
                "options": [
                    { "id": "o1", "text": "Sudden cessation of chest tube output (150 to 0)", "isCorrect": true, "rationale": "Indicates tube occlusion, trapping blood around the heart." },
                    { "id": "o2", "text": "Equalization of pressures (CVP rising towards Diastolic BP)", "isCorrect": true, "rationale": "CVP 22 vs DBP 68 is narrowing, typical of chamber compression." },
                    { "id": "o3", "text": "Narrowing Pulse Pressure (40 -> 22 -> 10 mmHg)", "isCorrect": true, "rationale": "Hallmark sign. The heart cannot fill, so it cannot stroke." },
                    { "id": "o4", "text": "Widening Pulse Pressure", "isCorrect": false, "rationale": "This would indicate Cushing's (Brain) or Aortic Regurgitation, not Tamponade." }
                ]
            },
            "rationale": {
                "coreConcept": "Beck's Triad & Physiology",
                "mnemonic": { "title": "BECK", "content": "B-Big JVD (High CVP), E-Extremely Low BP, C-Clogged Heart Sounds" },
                "goldenRule": "Post-Op Heart + Stopped Chest Tube + Low BP = Tamponade! Open the chest!"
            }
        }
    },
    {
        "id": "Cardiology-Trend-Digoxin-004",
        "typeId": "trend",
        "metadata": {
            "title": "Digoxin Toxicity with Electrolyte Shift",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:03:00Z",
            "updatedAt": "2026-01-23T12:03:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "medications": ["Digoxin 0.25mg PO Daily", "Furosemide 40mg IV BID (New Order)"]
                },
                "vitals": [
                    { "time": "08:00", "hr": 74, "bp": "120/80", "rhythm": "Afib" },
                    { "time": "12:00", "hr": 58, "bp": "110/70", "rhythm": "Junctional Escape" },
                    { "time": "16:00", "hr": 42, "bp": "90/50", "rhythm": "Complete Heart Block" }
                ],
                "labs": [
                    { "test": "Potassium", "value": "4.0", "time": "08:00" },
                    { "test": "Potassium", "value": "2.8", "time": "16:00" },
                    { "test": "Digoxin Level", "value": "2.9", "time": "16:00", "flag": "H" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Analyze the cause of the rhythm deterioration. Which factor precipitated this block?",
                "options": [
                    { "id": "o1", "text": "Aggressive diuresis caused Hypokalemia (K 2.8)", "isCorrect": true, "rationale": "Furosemide wastes Potassium. Low K+ potentiates Digoxin toxicity." },
                    { "id": "o2", "text": "Digoxin level is toxic (>2.0)", "isCorrect": true, "rationale": "Level of 2.9 confirms toxicity." }
                ]
            },
            "rationale": { "coreConcept": "Digoxin-Potassium Relationship", "goldenRule": "Hypokalemia makes Digoxin bind TIGHTER -> Toxicity." }
        }
    },
    {
        "id": "Cardiology-Trend-AorticDissection-005",
        "typeId": "trend",
        "metadata": {
            "title": "Type A Aortic Dissection Progression",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:04:00Z",
            "updatedAt": "2026-01-23T12:04:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Prioritize Hypothesis" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "chiefComplaint": "Tearing chest pain radiating to back",
                    "hpi": "Pain started in chest, moved to scapula, now in lumbar region."
                },
                "vitals": [
                    { "time": "Right Arm", "bp": "190/110" },
                    { "time": "Left Arm", "bp": "100/60" },
                    { "time": "Left Leg", "bp": "Unable to obtain" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The BP differential and pain migration suggest propagation. Which complications must be assessed IMMEDIATELY?",
                "options": [
                    { "id": "o1", "text": "Stroke (Carotid involvement)", "isCorrect": true, "rationale": "If the tear reaches the aortic arch carotids, stroke is imminent." },
                    { "id": "o2", "text": "Cardiac Tamponade (Retrograde extension)", "isCorrect": true, "rationale": "Type A often bleeds BACKWARDS into the pericardium." },
                    { "id": "o3", "text": "Acute Limb Ischemia (Iliac involvement)", "isCorrect": true, "rationale": "Lost pulses in legs means the tear has reached the bifurcation." }
                ]
            },
            "rationale": { "coreConcept": "Aortic Dissection Complications", "goldenRule": "Pulse Deficit + Chest Pain = Dissection until proven otherwise." }
        }
    }
];
