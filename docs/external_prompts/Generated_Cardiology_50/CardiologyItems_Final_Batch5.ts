import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 5: Items 28-31)
 * Focus: Aortic Dissection, Mitral Stenosis, PAD, Rheumatic Carditis
 */

export const CardiologyItems_Final_Batch5: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-DISSE-L9K0",
        "typeId": "trend",
        "metadata": {
            "title": "Aortic Dissection & Blood Pressure Mismatch",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:10:00Z",
            "updatedAt": "2026-01-23T19:10:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Aortic Dissection", "Vascular Emergencies", "Blood Pressure Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.W.", "age": 62, "gender": "Male", "allergies": "NKDA", "weightKg": 95, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / ICU",
                "historyPhysical": {
                    "chiefComplaint": "Severe, tearing chest and back pain.",
                    "hpi": "Client describes sudden onset of 'the worst pain of my life' that feels like 'something is ripping' inside his chest and moving into his shoulder blades. Pain is 10/10. He has a history of uncontrolled hypertension.",
                    "pmh": ["HTN", "Smoking", "Hyperlipidemia"],
                    "medications": ["Amlodipine (stopped 3 mos ago)"]
                },
                "history": [
                    { "time": "2000", "author": "ER RN", "note": "Patient arrives diaphoretic. Agitated with pain. BP in right arm is significantly higher than left arm." },
                    { "time": "2030", "author": "MD", "note": "Type A Aortic Dissection confirmed on CT Angiography. Surgery consult called." }
                ],
                "vitals": [
                    { "time": "2000 (R-Arm)", "tempF": "98.2", "hr": 110, "rr": 24, "bp": "210/112", "o2": "94", "o2_device": "RA", "pain": 10 },
                    { "time": "2000 (L-Arm)", "tempF": "98.2", "hr": 110, "rr": 24, "bp": "162/88", "o2": "94", "o2_device": "RA", "pain": 10 },
                    { "time": "2045 (Esmolol)", "tempF": "98.4", "hr": 64, "rr": 18, "bp": "122/72", "o2": "98", "o2_device": "2L NC", "pain": 4 }
                ],
                "labs": [],
                "radiology": [
                    { "study": "CT Angio Chest", "findings": "Intimal flap noted in the ascending aorta extending to the arch.", "impression": "Stanford Type A Aortic Dissection.", "date": "2030" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the hemodynamic trend and radiologic findings. Which conclusions and nursing priorities are essential for this client?",
                "options": [
                    { "id": "o1", "text": "Recognize the classic 'tearing' pain and BP differential between arms (48 mmHg) as suggestive of dissection", "isCorrect": true, "rationale": "A BP difference > 20 mmHg between arms is a clinical hallmark of aortic dissection as the intimal flap can obstruct flow into the subclavian arteries." },
                    { "id": "o2", "text": "Prioritize rapid reduction of both heart rate and blood pressure", "isCorrect": true, "rationale": "Reducing sheer stress on the aortic wall is critical. Reducing HR (<60) is actually the first priority, followed by BP (<120)." },
                    { "id": "o3", "text": "Prepare the client for emergent surgical repair of the ascending aorta", "isCorrect": true, "rationale": "Type A (ascending) dissections are surgical emergencies due to the risk of aortic rupture, cardiac tamponade, or MI." },
                    { "id": "o4", "text": "Administer IV Esmolol as ordered to achieve a target heart rate of 60 bpm", "isCorrect": true, "rationale": "Esmolol is a short-acting beta-blocker used to reduce the velocity of left ventricular ejection (dP/dt)." },
                    { "id": "o5", "text": "Monitor the client for signs of cardiac tamponade (JVD, muffled heart sounds, hypotension)", "isCorrect": true, "rationale": "Beck's triad in a dissection patient suggests the aorta has ruptured into the pericardial sac (Hemopericardium)." },
                    { "id": "o6", "text": "Administer aggressive IV fluid boluses to maintain the right arm BP above 180 mmHg", "isCorrect": false, "rationale": "High BP is the enemy in dissection; it will propagate the tear. Fluids are and high BP are contraindicated unless the patient is in frank shock." }
                ]
            },
            "rationale": {
                "coreConcept": "Aortic Dissection Management",
                "caseSummary": "Type A dissection with severe hypertension and BP mismatch. Priority is 'Anti-impulse therapy' followed by surgery.",
                "answerAnalysis": "Correct: o1 (Diagnostics), o2/o4 (Hemodynamic targets), o3 (Surgery), o5 (Complication monitoring). o6 is the opposite of correct care.",
                "trap": "Thinking BP reduction is the 'only' goal. You must reduce Heart Rate (contractility) first to prevent the 'hammer' effect on the tear.",
                "goldenRule": "Tearing pain + BP mismatch = Dissection until proven otherwise.",
                "steps": [
                    { "tag": "Assess", "description": "Obtain BP in both arms." },
                    { "tag": "Intervene", "description": "Titrate Esmolol/Nitroprusside to strict targets (HR 60, SBP 100-120)." }
                ],
                "mnemonic": {
                    "title": "A.B.C.D. (Dissection)",
                    "content": "A-Ascending (Surgery), B-Beta-blockers first, C-CT Scan, D-Differences in BP",
                    "explanation": "Summarizes type/management."
                },
                "cheatSheet": {
                    "title": "Stanford Classification",
                    "points": [
                        "Type A: Involves Ascending Aorta (Surgical Emergency).",
                        "Type B: Involves Descending Aorta (Medical Mgmt usually)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The aorta has three layers: intima, media, and adventitia. Dissection is a tear in the intima.",
                    "physiology": "Sheer stress (dP/dt) is the primary force that drives the tear forward through the media.",
                    "pharm": "Nitroprusside (vasodilator) should only be given AFTER beta-blockers to prevent reflex tachycardia."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Critical Care Analysis",
                    "clinicalStrategy": "Stabilize the 'Aorta' by lowering 'Stress' (HR/BP).",
                    "recommendedActions": ["Stat Surgery consult", "Start Esmolol drip"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-STEN-J5M6",
        "typeId": "trend",
        "metadata": {
            "title": "Mitral Stenosis & Rheumatic Heart Disease",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:15:00Z",
            "updatedAt": "2026-01-23T19:15:00Z",
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
            "clinicalFocusTopics": ["Mitral Stenosis", "Valvular Disease", "Heart Failure"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.B.", "age": 32, "gender": "Female", "allergies": "NKDA", "weightKg": 60, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Shortness of breath and fatigue with minimal exertion.",
                    "hpi": "Client grew up in a developing country and reports 'bad sore throats' as a child that were not treated. She has developed progressive SOB over the last 2 years. Physical exam reveals a 'low-pitched, rumbling diastolic murmur' heard at the apex with the bell.",
                    "pmh": ["Untreated Strep in childhood", "Two previous normal pregnancies (now pregnant again)"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Client reports SOB even when walking slowly. No edema noted. Mural thrombus risk assessed." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.6", "hr": 98, "rr": 20, "bp": "118/72", "o2": "95", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "BNP", "value": "450", "flag": "H", "ref": "< 100", "unit": "pg/mL" }
                ],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Mitral valve orifice area 1.2 cm2. Significant left atrial enlargement.", "impression": "Moderate Mitral Stenosis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical data and patient history. Which pathophysiology and outcomes are associated with this client's valvular disease?",
                "options": [
                    { "id": "o1", "text": "The patient's condition is likely a long-term complication of group A streptococcal infection (Rheumatic Heart Disease)", "isCorrect": true, "rationale": "Untreated strep throat leads to Rheumatic Fever, which scars the mitral valve (stenosis) years later." },
                    { "id": "o2", "text": "Monitor the patient for the potential development of Atrial Fibrillation", "isCorrect": true, "rationale": "Left atrial enlargement (from mitral backup) stretches the atrial fibers, frequently triggering AFib." },
                    { "id": "o3", "text": "Assess the patient for signs of pulmonary congestion and right-sided heart failure", "isCorrect": true, "rationale": "Mitral stenosis backup goes: LA -> Pulmonary Veins -> Lungs -> RV, leading to pulmonary HTN and RV failure." },
                    { "id": "o4", "text": "Recognize that pregnancy significantly increases the danger for this client", "isCorrect": true, "rationale": "Increased blood volume and heart rate in pregnancy can cause a mitral stenosis patient to decompensate into pulmonary edema quickly." },
                    { "id": "o5", "text": "Expect an order for a diuretic to help reduce the fluid volume", "isCorrect": true, "rationale": "Diuretics help reduce pre-load and alleviate pulmonary congestion." },
                    { "id": "o6", "text": "Prepare the client for an immediate aortic valve replacement", "isCorrect": false, "rationale": "The issue is the MITRAL valve (between LA/LV), not the aortic valve (between LV/Aorta)." }
                ]
            },
            "rationale": {
                "coreConcept": "Mitral Stenosis & Rheumatic Fever",
                "caseSummary": "Young adult with rheumatic mitral stenosis. Left atrial backup leading to SOB and AFib risk.",
                "answerAnalysis": "Correct: o1 (Etiology), o2 (Arrhythmia), o3 (Patho flow), o4 (Pregnancy risk), o5 (Treatment). o6 is the wrong valve distractor.",
                "trap": "Thinking mitral stenosis is a 'Left Ventricle' problem. It's an 'Above the Ventricle' problem; the LV stays small/normal while the LA and Lungs suffer.",
                "goldenRule": "Rheumatic Fever = Mitral Valve #1 victim.",
                "steps": [
                    { "tag": "Assess", "description": "Listen at the apex with the bell for the diastolic rumble." },
                    { "tag": "Plan", "description": "Address the risk of embolic stroke if AFib develops." }
                ],
                "mnemonic": {
                    "title": "M.S. = L.A.",
                    "content": "Mitral Stenosis = Left Atrial enlargement",
                    "explanation": "Summarizes the primary anatomical consequence."
                },
                "cheatSheet": {
                    "title": "Valvular Murmurs",
                    "points": [
                        "Mitral Stenosis: Diastolic Rumble (Apex).",
                        "Aortic Stenosis: Systolic Ejection (2nd Right ICS).",
                        "Mitral Regurgitation: Holosystolic (Apex, radiates to axilla)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Mitral valve is bicuspid (two leaflets).",
                    "physiology": "Normal mitral area is 4-6 cm2. Symptoms occur when it drops below 2 cm2.",
                    "pharm": "Beta-blockers can help by slowing the HR, allowing more time for diastolic filling through the narrowed valve."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Anatomy",
                    "clinicalStrategy": "Link childhood 'Sore Throat' to the 'Mitral' valve.",
                    "recommendedActions": ["Echocardiogram", "Restrict Sodium"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-PADVD-K8L9",
        "typeId": "trend",
        "metadata": {
            "title": "PAD vs PVD: Differential Management",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:20:00Z",
            "updatedAt": "2026-01-23T19:20:00Z",
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
            "clinicalFocusTopics": ["PAD", "PVD", "Vascular Surgery"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.J.", "age": 68, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Vascular Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Leg pain when walking and non-healing toe ulcer.",
                    "hpi": "Client reports pain in his calves after walking 1 block (Intermittent Claudication). Pain is relieved by rest. He has one small, dry, 'punched-out' ulcer on the tip of the left 2nd toe. His legs are pale and hairless.",
                    "pmh": ["Diabetes", "Smoking (1 pack/day)", "HTN"],
                    "medications": ["Metformin", "Lisinopril"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Lower extremity pulses: Pedal 1+ Bilat. Tibial 1+ Bilat. Right leg shows dependent rubor." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 78, "rr": 16, "bp": "148/88", "o2": "98", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [
                    { "test": "ABI (Ankle-Brachial Index)", "value": "0.65", "flag": "L", "ref": "0.9 - 1.3", "unit": "" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and vascular status. Which findings and interventions correctly characterize Peripheral Arterial Disease (PAD)?",
                "options": [
                    { "id": "o1", "text": "Identify 'Claudication' as the primary pain mechanism", "isCorrect": true, "rationale": "Ischemic muscle pain during activity is the hallmark of PAD." },
                    { "id": "o2", "text": "Encourage the client to elevate his legs above heart level to reduce pain", "isCorrect": false, "rationale": "Elevation is for venous disease. In arterial disease, elevation worsens ischemia. Legs should be kept in a dependent (dangling) position to help gravity pull blood to the toes." },
                    { "id": "o3", "text": "Advise the client to use heating pads on his feet for comfort", "isCorrect": false, "rationale": "PAD and Diabetes causes neuropathy; heating pads carry a high risk of severe burns due to lack of sensation and poor blood flow to heal." },
                    { "id": "o4", "text": "Counsel the client on a strict 'Smoking Cessation' program", "isCorrect": true, "rationale": "Nicotine is a potent vasoconstrictor and is the #1 modifiable risk factor for PAD progression." },
                    { "id": "o5", "text": "Recognize the 'Punched-out' ulcer and 'Dependent Rubor' as arterial signs", "isCorrect": true, "rationale": "Arterial ulcers are typically on toes/heels and look like drill-holes. Rubor (redness) occurs when the limb is dependent due to hyperemic response." },
                    { "id": "o6", "text": "Educate the patient on the use of antiplatelet therapy (e.g., Clopidogrel)", "isCorrect": true, "rationale": "Antiplatelets prevent thrombus formation at the site of atherosclerosis." }
                ]
            },
            "rationale": {
                "coreConcept": "PAD Assessment & Care",
                "caseSummary": "Classic PAD with low ABI (0.65), claudication, and dependent rubor. Focus on 'Gravity' and 'Smoking Cessation'.",
                "answerAnalysis": "Correct: o1 (Claudication), o4 (Smoking), o5 (Physical signs), o6 (Pharmacology). incorrect: o2 (Elevation is bad), o3 (Heat is dangerous).",
                "trap": "Thinking all 'Leg Pain' needs 'Elevation'. Elevation kills the PAD leg.",
                "goldenRule": "A-Arterial = Hanging (Dangling). V-Venous = Victory (Elevating).",
                "steps": [
                    { "tag": "Assess", "description": "Check Ankle-Brachial Index (ABI) to quantify the severity of ischemia." },
                    { "tag": "Teach", "description": "Instruct the patient to never walk barefoot." }
                ],
                "mnemonic": {
                    "title": "The 6 P's",
                    "content": "Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia",
                    "explanation": "Signs of Acute Limb Ischemia (the emergency form of PAD)."
                },
                "cheatSheet": {
                    "title": "PAD vs PVD Physicals",
                    "points": [
                        "PAD: Cool, hairless, pale, minimal or no edema, dry ulcers.",
                        "PVD: Warm, thick skin, brown staining (hemosiderin), significant edema, wet/sloughing ulcers on ankles."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Common sites for PAD: Femoral artery, Popliteal artery, Posterior tibial.",
                    "physiology": "ABI < 0.9 = PAD; ABI < 0.4 = Severe/Threatening.",
                    "pharm": "Cilostazol (Pletal) is used to improve walking distance in claudication by inhibiting platelet aggregation and causing vasodilation."
                },
                "difficulty": {
                    "score": 78,
                    "level": 3,
                    "label": "Application",
                    "clinicalStrategy": "Dangle for Arterial; Elevate for Venous.",
                    "recommendedActions": ["Smoking cessation", "Daily foot checks"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-RHEUM-N5O6",
        "typeId": "trend",
        "metadata": {
            "title": "Acute Rheumatic Carditis Assessment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:25:00Z",
            "updatedAt": "2026-01-23T19:25:00Z",
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
            "clinicalFocusTopics": ["Rheumatic Fever", "Pancarditis", "Jones Criteria"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "T.M.", "age": 14, "gender": "Male", "allergies": "Penicillin (Rash)", "weightKg": 45, "codeStatus": "Full Code"
                },
                "setting": "Pediatric Unit",
                "historyPhysical": {
                    "chiefComplaint": "Joint pain and erratic, jerky movements.",
                    "hpi": "Client had a sore throat 3 weeks ago. He now presents with red, swollen knees and elbows that 'wait their turn to hurt' (Migratory Polyarthritis). His mother noticed he has been dropping things and has jerky, involuntary movements of his face and arms. New blowing murmur heard at the apex.",
                    "pmh": ["Recent Pharyngitis"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Smith", "note": "Sydenham Chorea (jerky movements) noted. Erythema marginatum (rash) on trunk. 12-lead EKG shows PR interval 0.24s." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "102.4", "hr": 120, "rr": 22, "bp": "108/64", "o2": "98", "o2_device": "RA", "pain": 8 }
                ],
                "labs": [
                    { "test": "ASO Titer (Antistreptolysin O)", "value": "800", "flag": "H", "ref": "< 200", "unit": "IU/mL" },
                    { "test": "ESR (Sed Rate)", "value": "65", "flag": "H", "ref": "< 15", "unit": "mm/hr" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and Jones Criteria. Which findings support the diagnosis of Acute Rheumatic Fever with Carditis?",
                "options": [
                    { "id": "o1", "text": "Positive ASO Titer (800 IU/mL)", "isCorrect": true, "rationale": "A high ASO titer provides evidence of a preceding group A streptococcal infection, a requirement for the diagnosis of Rheumatic Fever." },
                    { "id": "o2", "text": "Migratory Polyarthritis (joint pain moving from knee to elbow)", "isCorrect": true, "rationale": "A Major Jones criterion; multiple large joints being affected is characteristic." },
                    { "id": "o3", "text": "Sydenham Chorea (jerky, involuntary movements)", "isCorrect": true, "rationale": "A Major Jones criterion representing CNS involvement of the autoimmune process." },
                    { "id": "o4", "text": "First-Degree Heart Block (PR 0.24s)", "isCorrect": true, "rationale": "A Minor Jones criterion indicating inflammation of the cardiac conduction system (Carditis)." },
                    { "id": "o5", "text": "Erythema Marginatum (non-pruritic, pink rings on trunk)", "isCorrect": true, "rationale": "A Major Jones criterion; a specific rash seen in acute rheumatic fever." },
                    { "id": "o6", "text": "Administer high-dose Aspirin as ordered for anti-inflammatory effects", "isCorrect": true, "rationale": "While Aspirin is normally avoided in kids (Reye's), Rheumatic Fever is a specific exception where high-dose salicylates are standard of care for carditis/arthritis under strict supervision." }
                ]
            },
            "rationale": {
                "coreConcept": "Jones Criteria for Rheumatic Fever",
                "caseSummary": "Pediatric case of Rheumatic Fever with pancarditis, arthritis, and chorea. All classic findings present.",
                "answerAnalysis": "Correct: o1 (Evidence of Strep), o2, o3, o5 (Major Criteria), o4 (Minor Criteria), o6 (Treatment). Note: Carditis (Murmur/Block) is also a major criterion.",
                "trap": "Thinking Reye's syndrome makes Aspirin 'Never' possible in children. Rheumatic Fever and Kawasaki Disease are the exceptions.",
                "goldenRule": "2 Major or 1 Major + 2 Minor = Rheumatic Fever.",
                "steps": [
                    { "tag": "Assess", "description": "Identify 'Joints', 'Heart', 'Nodules', 'Erythema', 'Chorea' (JONES)." },
                    { "tag": "Plan", "description": "Expect long-term penicillin prophylaxis (often monthly injections for 10 years or more)." }
                ],
                "mnemonic": {
                    "title": "J.O.N.E.S.",
                    "content": "J-Joints, O-Shape of Heart (Carditis), N-Nodules, E-Erythema marginatum, S-Sydenham chorea",
                    "explanation": "Major criteria for diagnosis."
                },
                "cheatSheet": {
                    "title": "Minor Criteria",
                    "points": [
                        "Fever.",
                        "Arthralgia (Pain without swelling).",
                        "High ESR/CRP.",
                        "Long PR interval."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Aschoff bodies (foci of fibrinoid necrosis) are seen in the heart tissue of patients with active rheumatic carditis.",
                    "physiology": "Autoimmune molecular mimicry: Antibodies against Strep cross-react with cardiac myosin.",
                    "pharm": "Erythromycin or Azithromycin is used if the patient is allergic to penicillin (like this client)."
                },
                "difficulty": {
                    "score": 92,
                    "level": 4,
                    "label": "Synthesis/Diagnosis",
                    "clinicalStrategy": "Search for 'JONES' and 'Evidence of Strep'.",
                    "recommendedActions": ["Bed rest", "Monitor EKG"]
                }
            }
        }
    }
];
