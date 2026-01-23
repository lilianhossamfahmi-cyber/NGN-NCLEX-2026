import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH FIDELITY - BATCH 3 (Items 9-13)
 * Topics: Mitral Stenosis, WPW, Dressler's, Endocarditis, Cardiorenal
 */

export const CardiologyItems_Batch3: MasterQuestionItem[] = [
    {
        "id": "Cardiology-Trend-MitralStenosis-009",
        "typeId": "trend",
        "metadata": {
            "title": "Mitral Stenosis Progression to Failure",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:08:00Z",
            "updatedAt": "2026-01-23T12:08:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 94,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Analyze Cues" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Pt with history of Rheumatic Fever as a child. Reports worsening dyspnea and hemoptysis.",
                    "assessment": "Low-pitched diastolic rumble at dense apex. Opening snap audible."
                },
                "vitals": [
                    { "time": "12:00", "hr": 78, "bp": "110/70", "o2": "98% RA" },
                    { "time": "12:30", "hr": 140, "rhythm": "Irregular", "bp": "90/60", "o2": "88%" }
                ],
                "history": [
                    { "time": "12:30", "note": "Sudden onset palpations. EKG confirms Atrial Fibrillation with RVR." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Why did the onset of Atrial Fibrillation cause such severe hemodynamic collapse in this specific patient?",
                "options": [
                    { "id": "o1", "text": "Loss of Atrial Kick (20-30% of filling)", "isCorrect": true, "rationale": "In Mitral Stenosis, the LV is under-filled. It relies heavily on the atrial kick to push blood through the stenotic valve." },
                    { "id": "o2", "text": "Profound diastolic shortening due to tachycardia", "isCorrect": true, "rationale": "Mitral flow happens in Diastole. Fast HR = Short Diastole = No time to fill = Shock." },
                    { "id": "o3", "text": "Development of V-Fib", "isCorrect": false, "rationale": "Patient is in AFib, not V-Fib." }
                ]
            },
            "rationale": { "coreConcept": "Valvular Hemodynamics", "goldenRule": "Mitral Stenosis + AFib = Flash Pulmonary Edema/Shock." }
        }
    },
    {
        "id": "Cardiology-Trend-WPW-010",
        "typeId": "trend",
        "metadata": {
            "title": "WPW with Pre-excited Atrial Fibrillation",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:09:00Z",
            "updatedAt": "2026-01-23T12:09:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 99,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Take Action" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Young male collapsed at soccer. Medic alerts report 'Wild EKG'."
                },
                "vitals": [
                    { "time": "Field", "hr": 220, "bp": "80/40" },
                    { "time": "ED Arrival", "hr": 240, "bp": "72/38" }
                ],
                "radiology": [
                    { "study": "EKG", "findings": "Irregularly Irregular. Wide QRS (Variable width). Rate > 200." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The rhythm is identified as MRI (Pre-excited AFib). Which orders must be REFUSED immediately? (Contraindications)",
                "options": [
                    { "id": "o1", "text": "Adenosine 6mg IV Push", "isCorrect": true, "rationale": "Blocks AV node. Forces all conduction down the accessory pathway -> VFib -> Death." },
                    { "id": "o2", "text": "Diltiazem or Verapamil IV", "isCorrect": true, "rationale": "AV Nodal blocker. Lethal in WPW AFib." },
                    { "id": "o3", "text": "Metoprolol IV", "isCorrect": true, "rationale": "AV Nodal blocker. Lethal in WPW AFib." },
                    { "id": "o4", "text": "Synchronized Cardioversion", "isCorrect": false, "rationale": "This is the CORRECT treatment for unstable WPW. Do not refuse." }
                ]
            },
            "rationale": { "coreConcept": "WPW Contraindications", "goldenRule": "In WPW + AFib, avoid ABCD (Adenosine, Beta-blockers, Ca-channel blockers, Digoxin). Shock them instead." }
        }
    },
    {
        "id": "Cardiology-Trend-Dresslers-011",
        "typeId": "trend",
        "metadata": {
            "title": "Dressler's Syndrome vs Recurrent MI",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:10:00Z",
            "updatedAt": "2026-01-23T12:10:00Z",
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
                    "hpi": "Patient is 4 weeks post-CABG. Presents with fever and severe chest pain.",
                    "assessment": "Friction rub audible at left lower sternal border."
                },
                "vitals": [
                    { "time": "08:00", "tempF": "101.2", "hr": 105, "bp": "110/68" }
                ],
                "labs": [
                    { "test": "WBC", "value": "14.5", "flag": "H" },
                    { "test": "Troponin", "value": "0.01", "flag": "N" },
                    { "test": "ESR", "value": "85", "flag": "H" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Which specific assessment findings differentiate Dressler's (Pericarditis) from a new MI?",
                "options": [
                    { "id": "o1", "text": "Pain worsens with deep inspiration (Pleuritic)", "isCorrect": true, "rationale": "MI pain is constant. Pericardial pain is pleuritic." },
                    { "id": "o2", "text": "Pain relieved by leaning forward", "isCorrect": true, "rationale": "Positional relief is hallmark of pericarditis." },
                    { "id": "o3", "text": "ST Elevation in ALL leads (Diffuse)", "isCorrect": true, "rationale": "MI causes regional elevation. Pericarditis causes global/diffuse elevation." }
                ]
            },
            "rationale": { "coreConcept": "Pericarditis Assessment", "goldenRule": "Global ST Lift + Fever + Rub = Dressler's." }
        }
    },
    {
        "id": "Cardiology-Trend-Endocarditis-012",
        "typeId": "trend",
        "metadata": {
            "title": "Infective Endocarditis Embolic Shower",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:11:00Z",
            "updatedAt": "2026-01-23T12:11:00Z",
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
                    "hpi": "IV Drug User presents with fever and confusion.",
                    "assessment": "New 3/6 holosystolic murmur."
                },
                "vitals": [
                    { "time": "12:00", "tempF": "103.5", "hr": 118, "bp": "102/58" }
                ],
                "history": [
                    { "note": "Black longitudinal lines noted on fingernails (Splinter Hemorrhages)." },
                    { "note": "Painful red nodules on finger pads (Osler Nodes)." }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The patient suddenly develops left-sided hemiparesis. What pathyphysiologic mechanism has occurred?",
                "options": [
                    { "id": "o1", "text": "Vegetation embolization to the right MCA", "isCorrect": true, "rationale": "Vegetations on the mitral/aortic valve can break off and travel to the brain (Stroke)." },
                    { "id": "o2", "text": "Septic Shock vasodilation", "isCorrect": false, "rationale": "Shock causes global weakness, not focal hemiparesis." }
                ]
            },
            "rationale": { "coreConcept": "Endocarditis Complications", "goldenRule": "Vegetations -> Emboli -> Stroke (Brain), Infarct (Spleen/Kidney), Ischemia (Legs)." }
        }
    },
    {
        "id": "Cardiology-Trend-Cardiorenal-013",
        "typeId": "trend",
        "metadata": {
            "title": "Cardiorenal Syndrome Type 1",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T12:12:00Z",
            "updatedAt": "2026-01-23T12:12:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": { "difficultyLevel": 5, "clinicalFocus": "Cardiology", "cjmmPhase": "Evaluate Outcomes" },
        "content": {
            "clinicalData": {
                "historyPhysical": {
                    "hpi": "Pt admitted for ADHF 48 hours ago. Aggressively diuresed (-4L net)."
                },
                "vitals": [
                    { "time": "Admission", "bp": "140/90", "weight": "100kg" },
                    { "time": "Day 2", "bp": "90/60", "weight": "96kg" }
                ],
                "labs": [
                    { "test": "Creatinine", "value": "1.1", "time": "Admission", "flag": "N" },
                    { "test": "Creatinine", "value": "2.9", "time": "Day 2", "flag": "H" },
                    { "test": "BUN", "value": "58", "time": "Day 2", "flag": "H" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The rise in Creatinine despite weight loss indicates which phenomenon?",
                "options": [
                    { "id": "o1", "text": "Intravascular volume depletion outpacing interstitial mobilization", "isCorrect": true, "rationale": "We dried out the blood vessels too fast. The fluid in the tissues (edema) couldn't refill the vessels fast enough, causing pre-renal kidney injury." },
                    { "id": "o2", "text": "Success of therapy", "isCorrect": false, "rationale": "AKI (Cr 1.1 -> 2.9) is a failure, not success." }
                ]
            },
            "rationale": { "coreConcept": "Cardiorenal Physiology", "goldenRule": "Diuresis must match the plasma refill rate. Too fast = Kidney Failure." }
        }
    }
];
