import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MasterQuestionItem } from '../src/types/master-schema';

const batch1: MasterQuestionItem[] = [
    {
        "id": "Cardiology-Trend-7E4A2K",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Clinical Progression of Acute Heart Failure with Pulmonary Edema",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:05:00Z",
            "updatedAt": "2026-01-23T11:05:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "E.V.", "age": 74, "gender": "Female", "allergies": "Sulfa", "weightKg": 82, "codeStatus": "Full Code" },
                "setting": "Critical Care Unit",
                "historyPhysical": {
                    "chiefComplaint": "Severe dyspnea and pink frothy sputum",
                    "hpi": "Client with known HFrEF presents with rapid-onset respiratory distress over the last 4 hours.",
                    "pmh": ["Heart Failure (EF 25%)", "Atrial Fibrillation", "CKD Stage 3"],
                    "medications": ["Lisinopril", "Metoprolol Succinate", "Apixaban", "Furosemide"]
                },
                "history": [
                    { "time": "0800", "author": "M. RN", "note": "Client admits to high sodium intake over the holidays. Bibasilar crackles noted in lower 1/3 of lung fields." },
                    { "time": "1000", "author": "M. RN", "note": "Orthopnea worsening. Crackles now audible to mid-scapula. Spouse reports 'bubbly' cough." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.6", "hr": 92, "rr": 22, "bp": "148/92", "o2": "94", "o2_device": "RA", "pain": 0 },
                    { "time": "0900", "tempF": "98.7", "hr": 108, "rr": 28, "bp": "162/98", "o2": "91", "o2_device": "2L NC", "pain": 2 },
                    { "time": "1000", "tempF": "98.8", "hr": 124, "rr": 36, "bp": "118/72", "o2": "86", "o2_device": "Non-rebreather", "pain": 4 }
                ],
                "labs": [
                    { "test": "BNP", "value": "1850", "flag": "H", "ref": "<100", "unit": "pg/mL" },
                    { "test": "Lactate", "value": "2.8", "flag": "H", "ref": "0.5-2.2", "unit": "mmol/L" }
                ],
                "orders": [{ "order": "Furosemide 80mg", "dose": "80mg", "route": "IV Push", "freq": "Once STAT", "status": "Active", "indication": "Fluid Overload" }],
                "radiology": [{ "study": "CXR", "findings": "Bat-wing infiltrates, cephalization of vessels.", "impression": "Acute Pulmonary Edema", "date": "0930" }]
            },
            "structure": {
                "type": "trend",
                "prompt": "Review the client's data. Which three findings indicate the client is entering Cardiogenic Shock?",
                "questionFormat": "sata",
                "options": [
                    { "id": "o1", "text": "Rapid decrease in systolic blood pressure (162 to 118)", "isCorrect": true, "rationale": "Indicates failing compensatory mechanisms and falling cardiac output." },
                    { "id": "o2", "text": "Worsening tachypnea and accessory muscle use", "isCorrect": false, "rationale": "While present, this marks respiratory failure rather than shock transition." },
                    { "id": "o3", "text": "Progressive tachycardia (92 to 124 bpm)", "isCorrect": true, "rationale": "Compensatory sympathetic response to falling stroke volume." },
                    { "id": "o4", "text": "Elevation in serum lactate (2.8 mmol/L)", "isCorrect": true, "rationale": "Marker of anaerobic metabolism indicative of systemic hypoperfusion." },
                    { "id": "o5", "text": "Presence of bat-wing infiltrates on chest X-ray", "isCorrect": false, "rationale": "Standard finding for pulmonary edema, not specific to shock transition." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiogenic Shock Transition",
                "caseSummary": "Client transitioning from acute decompensated heart failure to cardiogenic shock due to pump failure.",
                "answerAnalysis": "The transition to shock is identified by systemic hypoperfusion signs: falling BP, rising HR, and rising lactate.",
                "goldenRule": "Shock is defined by inadequate tissue perfusion, not just abnormal vitals.",
                "steps": [
                    { "tag": "Recognize", "description": "Note the falling BP trend despite increasing physical distress." },
                    { "tag": "Analyze", "description": "Correlate tachycardia and lactate with systemic oxygen demand-supply mismatch." }
                ],
                "mnemonic": { "title": "PUMP", "content": "P-Perfusion Fall, U-Urine Drop, M-Mentation Change, P-Pulse Rise", "explanation": "Signs of cardiogenic shock onset." }
            }
        }
    },
    {
        "id": "Cardiology-Trend-A43B9D",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Unstable Angina Progressing to NSTEMI",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:06:00Z",
            "updatedAt": "2026-01-23T11:06:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 92,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "J.K.", "age": 62, "gender": "Male", "allergies": "Aspirin (Anaphylaxis)", "weightKg": 95, "codeStatus": "Full Code" },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Substernal chest pressure radiating to left arm",
                    "hpi": "Client reports 2 hours of 'squeezing' chest pain that did not resolve with rest.",
                    "pmh": ["Type 2 Diabetes", "Hyperlipidemia", "Obesity"],
                    "medications": ["Metformin", "Atorvastatin", "Lisinopril"]
                },
                "history": [
                    { "time": "1200", "author": "T. RN", "note": "Arrival in ED. Pain 6/10. EKG shows T-wave inversion in V1-V4." },
                    { "time": "1300", "author": "T. RN", "note": "Pain 8/10 despite Nitroglycerin infusion at 10 mcg/min. Client diaphoretic." }
                ],
                "vitals": [
                    { "time": "1200", "tempF": "98.2", "hr": 84, "rr": 18, "bp": "152/88", "o2": "96", "o2_device": "RA", "pain": 6 },
                    { "time": "1300", "tempF": "98.4", "hr": 98, "rr": 22, "bp": "144/84", "o2": "95", "o2_device": "RA", "pain": 8 },
                    { "time": "1400", "tempF": "98.6", "hr": 112, "rr": 26, "bp": "126/74", "o2": "93", "o2_device": "2L NC", "pain": 9 }
                ],
                "labs": [
                    { "test": "Troponin I", "value": "0.02", "flag": "N", "ref": "<0.04", "unit": "ng/mL", "time": "1215" },
                    { "test": "Troponin I", "value": "0.45", "flag": "H", "ref": "<0.04", "unit": "ng/mL", "time": "1415" }
                ],
                "orders": [{ "order": "Heparin Bolus", "dose": "5000 units", "route": "IV", "freq": "Once", "status": "Active", "indication": "ACS Management" }],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Review the nursing notes and lab findings. Which two findings provide the definitive evidence of myocardial necrosis?",
                "questionFormat": "sata",
                "options": [
                    { "id": "o3", "text": "Serial Troponin I increase from 0.02 to 0.45 ng/mL", "isCorrect": true, "rationale": "Gold standard biomarker for myocardial cell death (necrosis)." },
                    { "id": "o5", "text": "Presence of new diaphoresis and tachycardia during pain", "isCorrect": true, "rationale": "Clinical markers of high-risk ischemia transitioning to infarction/necrosis." },
                    { "id": "o1", "text": "Rising heart rate from 84 to 112 bpm", "isCorrect": false, "rationale": "Nonspecific sign of pain." },
                    { "id": "o2", "text": "Deteriorating ST-segment or T-wave patterns", "isCorrect": false, "rationale": "Indicates ischemia, not necessarily necrosis." }
                ]
            },
            "rationale": { "coreConcept": "Myocardial Necrosis Detection", "answerAnalysis": "Serial Troponin rise is the definitive marker of necrosis.", "goldenRule": "Ischemia is reversible; necrosis is irreversible cell death confirmed by Troponin." }
        }
    },
    {
        "id": "Cardiology-Trend-B92F1X",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Post-Cardiac Surgery Tamponade Trend",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:07:00Z",
            "updatedAt": "2026-01-23T11:07:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "R.D.", "age": 58, "gender": "Male", "weightKg": 88, "codeStatus": "Full Code" },
                "setting": "CVSICU",
                "historyPhysical": {
                    "chiefComplaint": "Suddenly decreased chest tube output and hypotension",
                    "hpi": "Client is 2 hours post-CABG x3. Chest tubes were draining 150mL/hr, then suddenly stopped.",
                    "pmh": ["CAD", "HTN", "DM2"]
                },
                "history": [
                    { "time": "1400", "author": "RN Night", "note": "Chest tube output 120mL bright red. Hemodynamics stable." },
                    { "time": "1500", "author": "RN Night", "note": "Chest tube output 10mL. Heart sounds noted as 'distant'." }
                ],
                "vitals": [
                    { "time": "1300", "tempF": "98.2", "hr": 88, "bp": "118/74", "rr": 18, "o2": "98", "o2_device": "RA", "pain": 2 },
                    { "time": "1400", "tempF": "98.4", "hr": 102, "bp": "104/82", "rr": 20, "o2": "97", "o2_device": "RA", "pain": 3 },
                    { "time": "1500", "tempF": "98.6", "hr": 126, "bp": "88/76", "rr": 24, "o2": "95", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [{ "test": "Hgb", "value": "8.4", "flag": "L", "ref": "12-16", "unit": "g/dL" }],
                "orders": [{ "order": "Pericardiocentesis Kit", "status": "Active", "indication": "Suspected Tamponade" }],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Based on the vitals and history, which finding is the hallmark sign of cardiac tamponade evidenced in this trend?",
                "questionFormat": "sata",
                "options": [
                    { "id": "o1", "text": "Narrowing pulse pressure (44 to 12 mmHg)", "isCorrect": true, "rationale": "Hallmark sign of tamponade as diastolic pressure rises with intrapericardial pressure." },
                    { "id": "o3", "text": "Suddenly decreased chest tube drainage", "isCorrect": true, "rationale": "Suggests a clot in the tube, leading to internal accumulation of blood." },
                    { "id": "o4", "text": "Muffled or distant heart sounds", "isCorrect": true, "rationale": "Classic Beck's Triad component indicating fluid surrounding the heart." },
                    { "id": "o2", "text": "Hypotension with tachycardia", "isCorrect": false, "rationale": "Common in all shock types." }
                ]
            },
            "rationale": { "coreConcept": "Cardiac Tamponade Recognition", "answerAnalysis": "Narrowing pulse pressure and muffled sounds indicate tamponade.", "goldenRule": "If chest tube output stops suddenly post-op, suspect tamponade." }
        }
    },
    {
        "id": "Cardiology-Trend-X11Z09",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Septic Shock in Post-MI Patient",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:08:00Z",
            "updatedAt": "2026-01-23T11:08:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 94,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 4, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "W.F.", "age": 69, "gender": "Male" },
                "vitals": [
                    { "time": "0900", "tempF": "99.8", "hr": 82, "bp": "112/68", "rr": 18, "o2": "94", "o2_device": "RA", "pain": 1 },
                    { "time": "1100", "tempF": "100.9", "hr": 104, "bp": "102/60", "rr": 22, "o2": "93", "o2_device": "RA", "pain": 2 },
                    { "time": "1300", "tempF": "102.4", "hr": 128, "bp": "82/44", "rr": 28, "o2": "89", "o2_device": "RA", "pain": 3 }
                ],
                "labs": [
                    { "test": "MAP", "value": "57", "flag": "L", "ref": ">65", "unit": "mmHg", "time": "1300" },
                    { "test": "WBC", "value": "18.5", "flag": "H", "ref": "4.5-11.0", "unit": "10^3/uL", "time": "1300" }
                ],
                "history": [],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Evaluate the clinical trend. Which find indicates the client is now in septic shock?",
                "options": [
                    { "id": "o3", "text": "MAP falling to 57 mmHg", "isCorrect": true },
                    { "id": "o5", "text": "New altered mental status", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Septic Shock", "goldenRule": "Septic Shock = Sepsis + Refractory Hypotension (MAP < 65)." }
        }
    },
    {
        "id": "Cardiology-Trend-Q77R5T",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Digoxin Toxicity with Heart Block",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:09:00Z",
            "updatedAt": "2026-01-23T11:09:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 3, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "G.L.", "age": 82, "gender": "Female" },
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 72, "bp": "112/64", "rr": 16, "o2": "97", "o2_device": "RA", "pain": 1 },
                    { "time": "0900", "tempF": "98.5", "hr": 58, "bp": "104/60", "rr": 18, "o2": "96", "o2_device": "RA", "pain": 2 },
                    { "time": "1000", "tempF": "98.6", "hr": 34, "bp": "82/48", "rr": 20, "o2": "95", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [
                    { "test": "Potassium", "value": "2.9", "flag": "L", "ref": "3.5-5.0", "unit": "mEq/L" },
                    { "test": "Digoxin", "value": "3.4", "flag": "H", "ref": "0.5-2.0", "unit": "ng/mL" }
                ],
                "history": [],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which electrolyte abnormality increases the risk for this trend?",
                "options": [
                    { "id": "o1", "text": "Hypokalemia (2.9 mEq/L)", "isCorrect": true },
                    { "id": "o3", "text": "Hypercreatinemia (Renal failure)", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Digoxin Toxicity", "goldenRule": "Low K+ and high Digoxin is a recipe for heart block." }
        }
    },
    {
        "id": "Cardiology-Trend-H8K2L4",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Hypertensive Emergency with Early Encephalopathy",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:10:00Z",
            "updatedAt": "2026-01-23T11:10:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Prioritize Actions" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "T.W.", "age": 55, "gender": "Male" },
                "vitals": [
                    { "time": "1400", "tempF": "98.4", "hr": 88, "bp": "198/112", "rr": 20, "o2": "96", "o2_device": "RA", "pain": 7 },
                    { "time": "1445", "tempF": "98.5", "hr": 96, "bp": "212/120", "rr": 22, "o2": "95", "o2_device": "RA", "pain": 8 },
                    { "time": "1530", "tempF": "98.6", "hr": 108, "bp": "230/132", "rr": 24, "o2": "94", "o2_device": "RA", "pain": 10 }
                ],
                "history": [{ "time": "1530", "note": "Client now intermittently confused. Vision worsens." }],
                "labs": [{ "test": "Creatinine", "value": "2.4", "flag": "H", "ref": "0.7-1.3", "unit": "mg/dL" }],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which findings distinguish this as a Hypertensive Emergency?",
                "options": [
                    { "id": "o2", "text": "New onset of intermittent confusion", "isCorrect": true },
                    { "id": "o3", "text": "Vision changes and CT findings of encephalopathy", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Hypertensive Crisis", "goldenRule": "Emergency = Target Organ Damage; Urgency = Just high BP." }
        }
    },
    {
        "id": "Cardiology-Trend-P4N9M2",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Aortic Dissection Progression",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:11:00Z",
            "updatedAt": "2026-01-23T11:11:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "M.R.", "age": 64, "gender": "Male" },
                "vitals": [
                    { "time": "2100", "tempF": "98.4", "hr": 102, "bp": "180/94", "rr": 22, "o2": "94", "o2_device": "RA", "pain": 10 },
                    { "time": "2130", "tempF": "98.5", "hr": 118, "bp": "162/88", "rr": 24, "o2": "92", "o2_device": "RA", "pain": 10 },
                    { "time": "2200", "tempF": "98.6", "hr": 128, "bp": "94/56", "rr": 28, "o2": "90", "o2_device": "RA", "pain": 10 }
                ],
                "history": [{ "time": "2200", "note": "Pain migrated to lumbar area. R radial pulse now +1, L radial +3." }],
                "labs": [{ "test": "D-Dimer", "value": "5800", "flag": "H", "ref": "<500", "unit": "ng/mL" }],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which two findings are pathognomonic for progressing aortic dissection?",
                "options": [
                    { "id": "o1", "text": "Migrating 'tearing' pain", "isCorrect": true },
                    { "id": "o2", "text": "Blood pressure difference (>20 mmHg) between arms", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Aortic Dissection", "goldenRule": "Tearing pain + Migrating location + BP asymmetry = Dissection." }
        }
    },
    {
        "id": "Cardiology-Trend-W3Q7Z8",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Post-MI Ventricular Septal Rupture",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:12:00Z",
            "updatedAt": "2026-01-23T11:12:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "Q.Z.", "age": 71, "gender": "Female" },
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 78, "bp": "118/74", "rr": 18, "o2": "96", "o2_device": "RA", "pain": 3 },
                    { "time": "0900", "tempF": "98.5", "hr": 92, "bp": "104/68", "rr": 22, "o2": "94", "o2_device": "RA", "pain": 4 },
                    { "time": "1000", "tempF": "98.6", "hr": 118, "bp": "82/42", "rr": 28, "o2": "90", "o2_device": "RA", "pain": 5 }
                ],
                "history": [{ "time": "1000", "note": "New loud, harsh holosystolic murmur at left lower sternal border." }],
                "labs": [{ "test": "SvO2", "value": "82", "flag": "H", "ref": "60-75", "unit": "%" }],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which findings distinguish this as VSR rather than Papillary Muscle Rupture?",
                "options": [
                    { "id": "o1", "text": "Step-up in mixed venous oxygen saturation (SvO2)", "isCorrect": true },
                    { "id": "o2", "text": "Murmur at left lower sternal border", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "VSR Recognition", "goldenRule": "Post-MI: Apex murmur = Valve; Sternal border = Septum." }
        }
    },
    {
        "id": "Cardiology-Trend-K5H1L9",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "Amiodarone-Induced Thyrotoxicosis",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:13:00Z",
            "updatedAt": "2026-01-23T11:13:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 4, "clinicalFocus": "Cardiology", "cjmmPhase": "Prioritize Actions" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "H.L.", "age": 62, "gender": "Male" },
                "vitals": [
                    { "time": "0800", "tempF": "99.1", "hr": 112, "bp": "138/84", "rr": 20, "o2": "96", "o2_device": "RA", "pain": 2 },
                    { "time": "1000", "tempF": "100.2", "hr": 124, "bp": "122/76", "rr": 24, "o2": "94", "o2_device": "RA", "pain": 3 },
                    { "time": "1200", "tempF": "101.8", "hr": 142, "bp": "108/60", "rr": 28, "o2": "92", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [{ "test": "TSH", "value": "0.01", "flag": "L", "ref": "0.4-4.0", "unit": "uIU/mL" }],
                "history": [],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which characteristic of Amiodarone causes this complication?",
                "options": [
                    { "id": "o1", "text": "High iodine content (37%)", "isCorrect": true },
                    { "id": "o2", "text": "Extremely long half-life", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Amiodarone Toxicity", "goldenRule": "Amiodarone can cause BOTH hyper- and hypothyroidism." }
        }
    },
    {
        "id": "Cardiology-Trend-M2N8R3",
        "typeId": "trend",
        "type": "trend",
        "metadata": {
            "title": "BNP Correlation in HF Trend",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T11:14:00Z",
            "updatedAt": "2026-01-23T11:14:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 92,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 3, "clinicalFocus": "Cardiology", "cjmmPhase": "Prioritize Actions" },
        "content": {
            "clinicalData": {
                "patientInfo": { "name": "N.R.", "age": 59, "gender": "Female" },
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 92, "bp": "148/92", "rr": 24, "o2": "91", "o2_device": "2L NC", "pain": 2 },
                    { "time": "1400", "tempF": "98.5", "hr": 84, "bp": "122/74", "rr": 18, "o2": "95", "o2_device": "2L NC", "pain": 1 },
                    { "time": "2000", "tempF": "98.6", "hr": 78, "bp": "114/68", "rr": 16, "o2": "97", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "BNP", "value": "2400", "flag": "H", "ref": "<100", "unit": "pg/mL", "time": "0800" },
                    { "test": "BNP", "value": "900", "flag": "H", "ref": "<100", "unit": "pg/mL", "time": "2000" }
                ],
                "history": [],
                "radiology": [],
                "orders": []
            },
            "structure": {
                "type": "trend",
                "prompt": "Which findings indicate therapy is reducing preload?",
                "options": [
                    { "id": "o1", "text": "Decrease in BNP from 2400 to 900", "isCorrect": true },
                    { "id": "o2", "text": "Reduction in peripheral edema", "isCorrect": true }
                ]
            },
            "rationale": { "coreConcept": "Preload vs Afterload", "goldenRule": "Preload = Volume/Stretch; Afterload = Resistance." }
        }
    }
];

async function pushBatch1() {
    console.log('📦 Pushing Batch 1 (1-10)...');
    const savedCount = await saveBatchToBank(batch1);
    console.log(`✅ Batch 1 Success: ${savedCount} items live.`);
}

pushBatch1();
