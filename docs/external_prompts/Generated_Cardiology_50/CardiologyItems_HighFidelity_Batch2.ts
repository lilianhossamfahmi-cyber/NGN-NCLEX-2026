import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH FIDELITY - BATCH 2 (Items 4-8)
 * Topics: Digoxin, Dissection, VSR, Amiodarone, BNP
 */

export const CardiologyItems_Batch2: MasterQuestionItem[] = [
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
                    "chiefComplaint": "Nausea, vomiting, and yellow-tinged vision.",
                    "medications": ["Digoxin 0.25mg PO Daily", "Furosemide 40mg IV BID (New Order)"],
                    "hpi": "Client with Heart Failure was started on aggressive diuresis 3 days ago for severe edema."
                },
                "vitals": [
                    { "time": "08:00", "hr": 74, "bp": "120/80", "rhythm": "Atrial Fibrillation" },
                    { "time": "12:00", "hr": 58, "bp": "110/70", "rhythm": "Junctional Escape Rhythm" },
                    { "time": "16:00", "hr": 42, "bp": "90/50", "rhythm": "Complete Heart Block" }
                ],
                "labs": [
                    { "test": "Potassium", "value": "4.0", "time": "08:00", "flag": "N" },
                    { "test": "Potassium", "value": "2.8", "time": "16:00", "flag": "L" },
                    { "test": "Digoxin Level", "value": "2.9", "time": "16:00", "flag": "H" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Analyze the cause of the rhythm deterioration. Which factor precipitated this block?",
                "options": [
                    { "id": "o1", "text": "Aggressive diuresis caused Hypokalemia (K 2.8)", "isCorrect": true, "rationale": "Furosemide wastes Potassium. Hypokalemia potentiates Digoxin toxicity significantly." },
                    { "id": "o2", "text": "Digoxin level is toxic (>2.0)", "isCorrect": true, "rationale": "Level of 2.9 confirms toxicity, causing the AV block and bradycardia." },
                    { "id": "o3", "text": "Rapid administration of Potassium", "isCorrect": false, "rationale": "There is no evidence K+ was given aggressively; it dropped due to diuresis." }
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
                    "hpi": "Pain started in chest, moved to scapula, now described as 'ripping' in lumbar region.",
                    "pmh": ["Uncontrolled Hypertension (Baseline SBP 180s)", "Marfan Syndrome"]
                },
                "vitals": [
                    { "time": "18:00 (Right Arm)", "bp": "190/110", "hr": 110 },
                    { "time": "18:00 (Left Arm)", "bp": "100/60", "hr": 112 },
                    { "time": "18:15", "bp": "Left Leg - Unable to obtain pulse", "hr": 115 }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The BP differential and pain migration suggest propagation. Which complications are indicated by the current findings?",
                "options": [
                    { "id": "o1", "text": "Compromised left subclavian artery flow", "isCorrect": true, "rationale": "Significant BP difference (190 vs 100) indicates occlusion of the left subclavian origin." },
                    { "id": "o2", "text": "Acute Limb Ischemia (Iliac extension)", "isCorrect": true, "rationale": "Loss of leg pulse suggests the dissection flap has extended down to the iliac bifurcation." },
                    { "id": "o3", "text": "Pericardial Tamponade", "isCorrect": false, "rationale": "Not indicated yet. Tamponade would show HYPOTENSION in both arms, not hypertension in one." }
                ]
            },
            "rationale": { "coreConcept": "Aortic Dissection Complications", "goldenRule": "Pulse Deficit + Migrating Pain = Dissection until proven otherwise." }
        }
    },
    {
        "id": "Cardiology-Trend-VSR-006",
        "typeId": "trend",
        "metadata": {
            "title": "Post-MI Ventricular Septal Rupture (VSR)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:05:00Z",
            "updatedAt": "2026-01-23T12:05:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Patient is Day 4 Post-Anterior MI. Sudden hemodynamic collapse.",
                    "assessment": "New loud, harsh holosystolic murmur with a palpable thrill."
                },
                "vitals": [
                    { "time": "07:00", "bp": "110/70", "hr": 88, "o2": "98%" },
                    { "time": "08:00", "bp": "82/50", "hr": 120, "o2": "91%" }
                ],
                "labs": [
                    { "test": "SvO2 (Mixed Venous)", "value": "88%", "flag": "H", "time": "08:15" }
                ],
                "history": [
                    { "note": "Normal SvO2 is 60-70%. A value of 88% in the PA means oxygenated blood is mixing into the right side." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Which findings distinguish VSR from Papillary Muscle Rupture or Free Wall Rupture?",
                "options": [
                    { "id": "o1", "text": "Step-up in oxygen saturation (SvO2 jump)", "isCorrect": true, "rationale": "High O2 in the Pulmonary Artery confirms a Left-to-Right shunt (VSD/VSR)." },
                    { "id": "o2", "text": "Murmur at Left Sternal Border with Thrill", "isCorrect": true, "rationale": "Papillary rupture causes a murmur at the APEX. Septal rupture is at the sternal border." },
                    { "id": "o3", "text": "Sudden electromechanical dissociation (PEA)", "isCorrect": false, "rationale": "This characterizes Free Wall Rupture (Tamponade), not VSR." }
                ]
            },
            "rationale": { "coreConcept": "Mechanical Complications of MI", "goldenRule": "Oxygen Step-Up = Septal Rupture." }
        }
    },
    {
        "id": "Cardiology-Trend-Amiodarone-007",
        "typeId": "trend",
        "metadata": {
            "title": "Amiodarone-Induced Thyrotoxicosis",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:06:00Z",
            "updatedAt": "2026-01-23T12:06:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 95,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Pt on Amiodarone for 2 years for AFib. Presents with weight loss and palpitations.",
                    "medications": ["Amiodarone 200mg Daily", "Warfarin"]
                },
                "vitals": [
                    { "time": "Baseline", "hr": 70, "weight": "85kg" },
                    { "time": "Current", "hr": 115, "note": "Afib with RVR", "weight": "76kg" }
                ],
                "labs": [
                    { "test": "TSH", "value": "<0.01", "flag": "L" },
                    { "test": "Free T4", "value": "3.2", "flag": "H" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Why is this complication specifically dangerous in a cardiac patient?",
                "options": [
                    { "id": "o1", "text": "Increased catecholamine sensitivity exacerbates AFib/HF", "isCorrect": true, "rationale": "Thyroid storm drives the heart rate up, making rate control impossible." },
                    { "id": "o2", "text": "Massive iodine load from drug causes glandular hyperactivity (Jod-Basedow)", "isCorrect": true, "rationale": "Amiodarone is 37% iodine by weight." }
                ]
            },
            "rationale": { "coreConcept": "Amiodarone Toxicity", "goldenRule": "Recurrent RVR in a patient on Amiodarone? Check the TSH." }
        }
    },
    {
        "id": "Cardiology-Trend-BNP-008",
        "typeId": "trend",
        "metadata": {
            "title": "BNP Trend in Acute Dyspnea",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:07:00Z",
            "updatedAt": "2026-01-23T12:07:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 93,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Pt with COPD and Heart Failure presents with severe dyspnea. Is it COPD exacerbation or HF exacerbation?"
                },
                "vitals": [
                    { "time": "Admission", "o2": "88% RA" },
                    { "time": "Hour 4", "o2": "90% on 4L" }
                ],
                "labs": [
                    { "test": "BNP", "value": "85", "time": "Prior Discharge", "flag": "N" },
                    { "test": "BNP", "value": "110", "time": "Today", "flag": "N" }
                ],
                "radiology": [
                    { "study": "CXR", "findings": "Hyperinflation. No pulmonary edema." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Based on the BNP trend (85 -> 110), what is the priority?",
                "options": [
                    { "id": "o1", "text": "Treat for COPD Exacerbation (Steroids/Nebs)", "isCorrect": true, "rationale": "BNP < 100 (or minimal change) rules OUT acute heart failure with high sensitivity." },
                    { "id": "o2", "text": "Administer IV Furosemide", "isCorrect": false, "rationale": "Contraindicated. Without HF evidence, diuresis will thicken secretions in COPD." }
                ]
            },
            "rationale": { "coreConcept": "BNP in Dyspnea", "goldenRule": "BNP < 100 = Pulmonary Cause. BNP > 400 = Cardiac Cause." }
        }
    }
];
