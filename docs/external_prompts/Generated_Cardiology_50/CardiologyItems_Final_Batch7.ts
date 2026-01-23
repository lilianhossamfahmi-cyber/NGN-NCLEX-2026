import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 7: Items 18-20 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch7: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-AMIO-THYRO-H1J2",
        "typeId": "trend",
        "metadata": {
            "title": "Amiodarone-Induced Thyrotoxicosis (AIT)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:30:00Z",
            "updatedAt": "2026-01-23T14:30:00Z",
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
            "clinicalFocusTopics": ["Amiodarone", "Thyroid Disorders", "Atrial Fibrillation"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.L.", "age": 67, "gender": "Female", "allergies": "Iodine", "weightKg": 62, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Unexplained weight loss, feeling 'shaky', and my heart is racing again.",
                    "hpi": "Client has been on Amiodarone for 14 months to manage persistent Atrial Fibrillation. She was previously well-controlled. Over the last month, she has lost 5kg without trying and is having trouble sleeping. She describes her heart as 'flopping in her chest like a fish' even though she is taking all her medicines.",
                    "pmh": ["Persistent Atrial Fibrillation", "Hypertension", "Diverticulosis"],
                    "medications": ["Amiodarone 200mg daily", "Metoprolol XL 50mg daily", "Warfarin (Goal INR 2-3)"]
                },
                "history": [
                    { "time": "3 Mo Ago", "author": "Dr. Chan", "note": "Client stable. AFib rate-controlled at 72 bpm. Weight 67kg. Lungs clear." },
                    { "time": "Today 1000", "author": "RN Smith", "note": "Client appears tremulous and anxious. Heart rate is 124 and irregular (AFib with RVR). Weight is 62kg. Skin is warm and moist." },
                    { "time": "Today 1100", "author": "Dr. Chan", "note": "Suspect Amiodarone-induced thyrotoxicosis. Labs ordered. Rate control is failing despite Metoprolol." }
                ],
                "vitals": [
                    { "time": "3 Mo Ago", "tempF": "98.2", "hr": 72, "rr": 16, "bp": "118/72", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "Today 1000", "tempF": "99.1", "hr": 126, "rr": 22, "bp": "144/88", "o2": "96", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "TSH", "value": "<0.01", "flag": "L", "ref": "0.4 - 4.0", "unit": "mIU/L" },
                    { "test": "Free T4", "value": "3.8", "flag": "H", "ref": "0.8 - 1.8", "unit": "ng/dL" },
                    { "test": "Free T3", "value": "210", "flag": "H", "ref": "80 - 180", "unit": "pg/dL" },
                    { "test": "ALT", "value": "52", "flag": "H", "ref": "< 40", "unit": "U/L" }
                ],
                "radiology": [
                    { "study": "Thyroid Ultrasound", "findings": "Increased vascularity throughout both lobes of the thyroid gland.", "impression": "Findings suggestive of Type 1 Amiodarone-Induced Thyrotoxicosis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and laboratory data. Which factors indicate that the client's Atrial Fibrillation with RVR is caused by medication-induced thyrotoxicosis rather than simple heart failure?",
                "options": [
                    { "id": "o1", "text": "Suppressed TSH (<0.01 mIU/L) with elevated Free T4", "isCorrect": true, "rationale": "Classic laboratory pattern for hyperthyroidism/thyrotoxicosis." },
                    { "id": "o2", "text": "Unexplained weight loss (5kg in 3 months) despite adequate intake", "isCorrect": true, "rationale": "Weight loss is a common hypermetabolic symptom of thyrotoxicosis; heart failure usually causes weight GAIN from fluid." },
                    { "id": "o3", "text": "Failure of Metoprolol to control the heart rate (126 bpm despite 50mg daily)", "isCorrect": true, "rationale": "Thyroid hormones upregulate beta-receptors, making standard rate-control medications less effective." },
                    { "id": "o4", "text": "History of long-term Amiodarone use (14 months)", "isCorrect": true, "rationale": "Amiodarone contains 37% iodine and can trigger Type 1 thyrotoxicosis (Jod-Basedow effect) in predisposed individuals." },
                    { "id": "o5", "text": "Presence of irregular pulse and palpitations", "isCorrect": false, "rationale": "These are common to both HF-induced AFib and Thyroid-induced AFib; they do not distinguish the cause." },
                    { "id": "o6", "text": "Normal lung sounds and Absence of peripheral edema", "isCorrect": true, "rationale": "Rules out heart failure as the cause of the racing heart and palpitations." }
                ]
            },
            "rationale": {
                "coreConcept": "Amiodarone-Induced Thyrotoxicosis (AIT)",
                "caseSummary": "Client on long-term Amiodarone develops hypermetabolic symptoms (weight loss, RVR, tremor). Labs confirm hyperthyroidism. High iodine Load from the drug triggered the event.",
                "answerAnalysis": "AIT is confirmed by suppressing TSH (o1), observing metabolic symptoms like weight loss (o2), identifying the high iodine trigger (o4), and ruling out cardiac causes like HF (o6). Metoprolol failure (o3) is a key clinical clue.",
                "trap": "Thinking that because Amiodarone treats AFib, it can't be causing more AFib side effects. It's a double-edged sword.",
                "goldenRule": "Always check TSH and LFTs every 6 months for any client on chronic Amiodarone.",
                "steps": [
                    { "tag": "Analyze", "description": "Relate the new RVR and weight loss to a possible thyroid trigger." },
                    { "tag": "Verify", "description": "Review the TSH and T4 levels specifically for the Jod-Basedow effect." }
                ],
                "mnemonic": {
                    "title": "A-T-L",
                    "content": "A-Amiodarone, T-Thyroid, L-Lungs/Liver",
                    "explanation": "The three major watch areas for amiodarone toxicity."
                },
                "cheatSheet": {
                    "title": "AIT Types",
                    "points": [
                        "Type 1: Iodine load (Jod-Basedow) in sick thyroids.",
                        "Type 2: Direct destruction/inflammation of thyroid cells.",
                        "Treatment: Stop drug, use Methimazole (Type 1) or Steroids (Type 2)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The thyroid gland is located in the neck and regulates metabolism via T3/T4.",
                    "physiology": "Amiodarone is structurally similar to thyroxine (T4) and contains significant iodine, which can overload the thyroid gland's regulation.",
                    "pharm": "Methimazole blocks the synthesis of thyroid hormones and is the primary treatment for Type 1 AIT."
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "High Analysis",
                    "clinicalStrategy": "Search for the 'discrepancy' between weight loss and heart racing.",
                    "recommendedActions": ["Check TSH", "Ask about palpitations", "Consult Endocrinology"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-PAPRUPT-F3G4",
        "typeId": "trend",
        "metadata": {
            "title": "Post-MI Papillary Muscle Rupture",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:35:00Z",
            "updatedAt": "2026-01-23T14:35:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 99,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["Myocardial Infarction Complications", "Mitral Valve", "Acute Pulmonary Edema"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.V.", "age": 70, "gender": "Male", "allergies": "NKDA", "weightKg": 80, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Step-down Unit",
                "historyPhysical": {
                    "chiefComplaint": "Sudden, extreme shortness of breath and 'drowning' feeling.",
                    "hpi": "Client is Day 4 post-Inferior MI (Right Coronary Artery occlusion). He was recovering well and was being prepared for home discharge. Suddenly, he developed severe respiratory distress and became diaphoretic. He is sitting bolt upright and gasping for air.",
                    "pmh": ["Inferior MI (Day 4)", "Hypertension", "Diabetes"],
                    "medications": ["Aspirin", "Clopidogrel", "Metoprolol", "Atorvastatin"]
                },
                "history": [
                    { "time": "Mon 0800", "author": "RN Chen", "note": "Client ambulated in hallway. HR 72. BP 122/78. Lungs clear. Resting comfortably." },
                    { "time": "Mon 1000", "author": "RN Chen", "note": "Client reports sudden SOB. Sitting bolt upright. HR 128. RR 34. Pulse Ox 82%. Profuse pink frothy sputum noted." },
                    { "time": "Mon 1010", "author": "RN Chen", "note": "New loud, harsh holosystolic murmur (4/6) heard at the apex radiating to axilla. Stat Rapid Response called." }
                ],
                "vitals": [
                    { "time": "Mon 0800", "tempF": "98.4", "hr": 72, "rr": 18, "bp": "122/78", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "Mon 1000", "tempF": "98.6", "hr": 128, "rr": 36, "bp": "94/56", "o2": "82", "o2_device": "15L Non-rebreather", "pain": 2 }
                ],
                "labs": [
                    { "test": "BNP", "value": "2200", "flag": "H", "ref": "< 100", "unit": "pg/mL" },
                    { "test": "Arterial pH", "value": "7.28", "flag": "L", "ref": "7.35 - 7.45", "unit": "N/A" }
                ],
                "radiology": [
                    { "study": "CXR (1015)", "findings": "Massive 'butterfly'-shaped bilateral perihilar opacities. Normal heart size.", "impression": "Hyperacute Flash Pulmonary Edema.", "date": "Mon" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend on Day 4 post-MI. Which findings are hallmark indicators of Papillary Muscle Rupture causing acute Mitral Regurgitation?",
                "options": [
                    { "id": "o1", "text": "Sudden onset of pink, frothy sputum and 'flash' pulmonary edema", "isCorrect": true, "rationale": "Sudden failure of the mitral valve leads to massive pressure backup into the lungs within minutes." },
                    { "id": "o2", "text": "New, harsh holosystolic murmur at the apex", "isCorrect": true, "rationale": "The ruptured muscle allows the mitral valve to swing open into the atrium during systole, creating a loud regurgitant murmur." },
                    { "id": "o3", "text": "History of a recent Inferior wall MI (Right Coronary Artery occlusion)", "isCorrect": true, "rationale": "The RCA supplies the blood to the posterior papillary muscle; inferior MIs are the most common cause of this mechanical complication." },
                    { "id": "o4", "text": "Transition from hypertensive to hypotensive state (122/78 to 94/56)", "isCorrect": true, "rationale": "Acute, severe MR results in a massive drop in forward cardiac output, leading to cardiogenic shock." },
                    { "id": "o5", "text": "Presence of a pericardial friction rub", "isCorrect": false, "rationale": "A rub indicates pericarditis, not a mechanical valve failure/rupture." },
                    { "id": "o6", "text": "Presence of 'butterfly' opacities on Chest X-ray", "isCorrect": true, "rationale": "Radiographic evidence of acute alveolar flooding (flash pulmonary edema)." }
                ]
            },
            "rationale": {
                "coreConcept": "Papillary Muscle Rupture",
                "caseSummary": "Inferior MI patient on Day 4 develops sudden drown-like respiratory distress and a new loud apical murmur. This is a mechanical surgical emergency.",
                "answerAnalysis": "The diagnosis is confirmed by o1 (Flash edema), o2 (New Murmur), o3 (Inferior MI link), o4 (Shock result), and o6 (CXR findings). It is a 'Forward' and 'Backward' failure event simultaneously.",
                "trap": "Thinking that crackles and SOB mean the patient just 'has heart failure'—the 'flash' and 'murmur' together indicate a mechanical breakage (Rupture).",
                "goldenRule": "Any new murmur after a heart attack is a medical emergency until Echo rules out rupture or VSD.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify the 'flash' nature (minutes) of the respiratory collapse." },
                    { "tag": "Auscultate", "description": "Check for a NEW murmur at the apex." }
                ],
                "mnemonic": {
                    "title": "3 Days - 3 Breaks",
                    "content": "Septal Rupture (VSD), Papillary Rupture (MR), Free Wall Rupture (Tamponade)",
                    "explanation": "Three major mechanical failures that occur 3-5 days after a large MI."
                },
                "cheatSheet": {
                    "title": "VSR vs Papillary Rupture",
                    "points": [
                        "VSR: Murmur at left sternal border. O2 step-up in lungs.",
                        "Papillary: Murmur at apex. Flash pulmonary edema."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Papillary muscles are 'anchors' that hold the mitral valve closed via chordae tendineae.",
                    "physiology": "When an inferior MI kills the papillary muscle, the mitral valve leaflets 'flail' backward into the left atrium during contraction, causing maximum-severity regurgitation.",
                    "pharm": "Nitroprusside (afterload reducer) or Intra-aortic balloon pump (IABP) are used to decrease the resistance the heart faces, encouraging blood to go out the aorta rather than back through the broken valve."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Emergency Evaluation",
                    "clinicalStrategy": "Connect the 'suddenness' and the 'murmur location'.",
                    "recommendedActions": ["Prepare for IABP insertion", "Call Cardiac Surgery", "High-flow Oxygen"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-LVAD-FAIL-M5N6",
        "typeId": "trend",
        "metadata": {
            "title": "Left Ventricular Assist Device (LVAD) Failure",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:40:00Z",
            "updatedAt": "2026-01-23T14:40:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["LVAD Management", "Pump Thrombosis", "Hemodynamic Monitoring"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.B.", "age": 59, "gender": "Male", "allergies": "Latex", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Clinic / Home Health Follow-up",
                "historyPhysical": {
                    "chiefComplaint": "LVAD controller keeps alarming 'Low Flow' and my urine looks like tea.",
                    "hpi": "Client is 6 months status-post HeartMate 3 (LVAD) placement as a bridge to transplant. He has been stable until today when he noticed the 'Low Flow' alarm triggering multiple times. He also reports feel dizzy when standing and seeing very dark, 'tea-colored' urine.",
                    "pmh": ["End-stage Heart Failure", "LVAD placement (6 months ago)", "Atrial Fibrillation"],
                    "medications": ["Warfarin (INR 2.5)", "Crushing doses of Carvedilol"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "Clinic RN", "note": "Client triaged. LVAD speed 5400 RPM. Flow 3.2 L/min (Baseline 4.5). Power 12 Watts (Baseline 5). Alarm history shows multiple 'Low Flow' alerts." },
                    { "time": "Mon 1030", "author": "RN Chen", "note": "Urine sample obtained. Dark, reddish-brown ('tea-colored'). INR today is 1.4." },
                    { "time": "Mon 1100", "author": "Cardiologist", "note": "Findings highly suggestive of LVAD Pump Thrombosis. Client admitted for Heparin bridge and possible TPA/Surgery." }
                ],
                "vitals": [
                    { "time": "Baseline", "tempF": "98.4", "hr": "72/Continuous hum", "bp": "MAP 82", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "Today 1000", "tempF": "98.6", "hr": "Irregular/Weak hum", "bp": "MAP 64", "o2": "93", "o2_device": "RA", "pain": 2 }
                ],
                "labs": [
                    { "test": "INR", "value": "1.4", "flag": "L", "ref": "2.0 - 3.0", "unit": "N/A" },
                    { "test": "LDH", "value": "2400", "flag": "H", "ref": "100 - 250", "unit": "U/L" },
                    { "test": "Plasma Free Hgb", "value": "58", "flag": "H", "ref": "< 5", "unit": "mg/dL" },
                    { "test": "Creatinine", "value": "2.1", "flag": "H", "ref": "0.6 - 1.2", "unit": "mg/dL" }
                ],
                "radiology": [
                    { "study": "LVAD Doppler/Ramp Test", "findings": "Decreased flow sensitivity to speed changes. Evidence of high-resistance power usage.", "impression": "Probable Pump Thrombosis.", "date": "1130" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and device data. Which findings support the hypothesis that the client is experiencing 'Pump Thrombosis' (a clot in the LVAD)?",
                "options": [
                    { "id": "o1", "text": "Sub-therapeutic INR of 1.4", "isCorrect": true, "rationale": "Inadequate anticoagulation significantly increases the risk of clot formation within the high-speed pump mechanism." },
                    { "id": "o2", "text": "Increase in Power wattage (5 to 12 Watts)", "isCorrect": true, "rationale": "The pump has to work harder (consume more power) to spin through a thick, obstructive clot." },
                    { "id": "o3", "text": "Presence of tea-colored urine (Hemolysis)", "isCorrect": true, "rationale": "A clot in the pump shreds red blood cells as they pass by, causing hemolysis and high levels of free hemoglobin in the urine." },
                    { "id": "o4", "text": "Profoundly elevated LDH (2400 U/L)", "isCorrect": true, "rationale": "Lactate dehydrogenase (LDH) is released when red blood cells are destroyed (hemolysis), which is a specific marker for pump thrombosis." },
                    { "id": "o5", "text": "Absence of a palpable pulse in the wrist", "isCorrect": false, "rationale": "Continuous flow LVADs (like HeartMate 3) DO NOT produce a pulse; absence of a pulse is a normal, expected finding and not a sign of failure." },
                    { "id": "o6", "text": "A 'Low Flow' alarm history on the controller", "isCorrect": true, "rationale": "The clot physically blocks the output, resulting in low flow through the device." }
                ]
            },
            "rationale": {
                "coreConcept": "LVAD Pump Thrombosis",
                "caseSummary": "LVAD patient with low INR develops hemolysis (dark urine, sky-high LDH) and high pump power consumption. These are the classic signs of a clot in the device.",
                "answerAnalysis": "Pump thrombosis is identified by 1) Hemolysis markers (o3, o4), 2) Device alarms/Power spikes (o2, o6), and 3) Low anticoagulation (o1). o5 is a TRAP because LVADs are continuous flow and normally do not have pulses.",
                "trap": "Thinking that 'no pulse' is an emergency. In the LVAD world, we measure MAP with a Doppler, because 'pulsatile' flow is gone.",
                "goldenRule": "Any hemolysis (high LDH/dark urine) in an LVAD patient is a pump clot until proven otherwise.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify that the pump is using more 'power' (Watts) to achieve less 'flow' (L/min)." },
                    { "tag": "Analyze", "description": "Correlate the dark urine and LDH to the mechanical shredding of RBCs." }
                ],
                "mnemonic": {
                    "title": "W.A.T.T.S.",
                    "content": "W-Watts are high, A-Alarms sounding, T-Tea-colored urine, T-Thrombosis suspicion, S-Subtherapeutic INR",
                    "explanation": "Summarizes the pump thrombosis profile."
                },
                "cheatSheet": {
                    "title": "LVAD Hemodialysis",
                    "points": [
                        "Normal LDH < 600 in most LVADs.",
                        "Normal Power is 4-7 Watts.",
                        "Normal INR is 2.0 - 3.0."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The LVAD pulls blood from the Left Ventricle apex and pushes it into the Aorta.",
                    "physiology": "The pump uses a magnetic leviating impeller. If a clot gets caught in the impeller, it creates friction, uses more power, and hemolyzes the blood.",
                    "pharm": "High-dose Heparin or TPA may be used, though surgical exchange of the pump is often required for persistent thrombosis."
                },
                "difficulty": {
                    "score": 97,
                    "level": 5,
                    "label": "High Tech Analysis",
                    "clinicalStrategy": "Look for signs of hemolysis (destruction of blood).",
                    "recommendedActions": ["Check INR immediately", "Listen for abnormal 'grinding' hum in pump"]
                }
            }
        }
    }
];
