import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 3: Items 5-7 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch3: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-DISSECT-V1W2",
        "typeId": "trend",
        "metadata": {
            "title": "Aortic Dissection Extension",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:15:00Z",
            "updatedAt": "2026-01-23T13:15:00Z",
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
            "clinicalFocusTopics": ["Aortic Dissection", "Vascular Emergency", "Hypotension"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "D.W.", "age": 42, "gender": "Male", "allergies": "Latex", "weightKg": 110, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Sudden onset of 'tearing' pain in the chest and between the shoulder blades.",
                    "hpi": "Client arrived via EMS. Reported sudden, absolute maximum pain intensity (10/10) that felt like 'being ripped apart' while lifting a heavy crate. EMS noted a blood pressure in the right arm of 198/110. Upon arrival at the ED, the client is visibly distressed and diaphoretic.",
                    "pmh": ["Bicuspid Aortic Valve", "Connective Tissue Disorder (Type 4 Ehlers-Danlos)", "Uncontrolled Hypertension"],
                    "medications": ["Amlodipine 10mg daily (non-compliant)", "Ibuprofen for back pain"]
                },
                "history": [
                    { "time": "1800", "author": "EMS", "note": "Patient found clutching chest. Pain 10/10 tearing. BP 200/114 right arm. HR 110. Transported with lights/sirens." },
                    { "time": "1830", "author": "RN Rivera", "note": "Arrived at ED. Client diaphoretic. Pain has 'moved' down into the middle of the back. Right arm BP 184/102. Left arm BP 142/88. MD notified of pulse asymmetry." },
                    { "time": "1900", "author": "RN Rivera", "note": "Client reports sudden weakness in left leg. BP 92/58 (Right arm). HR 128. Abdomen is tender to palpation. CT surgery paged for emergent OR." }
                ],
                "vitals": [
                    { "time": "1800", "tempF": "98.4", "hr": 110, "rr": 24, "bp": "198/110", "o2": "96", "o2_device": "RA", "pain": 10 },
                    { "time": "1830", "tempF": "98.6", "hr": 112, "rr": 26, "bp": "184/102", "o2": "94", "o2_device": "2L NC", "pain": 8 },
                    { "time": "1900", "tempF": "98.5", "hr": 128, "rr": 28, "bp": "92/58", "o2": "91", "o2_device": "4L NC", "pain": 7 }
                ],
                "labs": [
                    { "test": "D-Dimer", "value": "4500", "flag": "H", "ref": "< 500", "unit": "ng/mL FEU" },
                    { "test": "Hgb", "value": "11.2", "flag": "L", "ref": "13.5 - 17.5", "unit": "g/dL" },
                    { "test": "Troponin I", "value": "0.02", "flag": "N", "ref": "< 0.04", "unit": "ng/mL" }
                ],
                "orders": [
                    { "order": "Esmolol Infusion titration", "status": "Active", "indication": "Heart Rate & BP Control" },
                    { "order": "Emergent CT Angio - Chest/Abdomen/Pelvis", "status": "In Progress", "indication": "Rule Out Dissection" }
                ],
                "radiology": [
                    { "study": "CT Angiography", "findings": "Intimal flap originating at the aortic root, extending through the arch and descending into the abdominal aorta past the renal arteries. Periaortic hematoma noted.", "impression": "Stanford Type A Aortic Dissection with propagation.", "date": "1915" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend from 1800 to 1900. Which findings indicate the propagation and worsening of the aortic dissection?",
                "options": [
                    { "id": "o1", "text": "Migration of pain into the middle back", "isCorrect": true, "rationale": "Pain that 'travels' or moves down the spine is a classic indicator that the intimal tear is extending (propagating)." },
                    { "id": "o2", "text": "Blood pressure differential between arms (184 vs 142)", "isCorrect": true, "rationale": "A difference of >20 mmHg in SBP between arms suggests the dissection flap is compromising major branch vessels (like the left subclavian)." },
                    { "id": "o3", "text": "Transition from severe Hypertension to Hypotension (198/110 to 92/58)", "isCorrect": true, "rationale": "Sudden hypotension in dissection suggests life-threatening complications like rupture, cardiac tamponade, or massive internal hemorrhage." },
                    { "id": "o4", "text": "New onset of left leg weakness", "isCorrect": true, "rationale": "Indicates the dissection has reached the distal aorta/iliac arteries, compromising limb perfusion (malperfusion syndrome)." },
                    { "id": "o5", "text": "Elevated D-Dimer (4500 ng/mL)", "isCorrect": false, "rationale": "While high D-dimer is sensitive for dissection presence, a single value does not track 'propagation' or worsening over time as well as clinical cues." },
                    { "id": "o6", "text": "Normal Troponin I levels", "isCorrect": false, "rationale": "Normal troponin rules out MI but is an expected finding in dissection and does not indicate worsening." }
                ]
            },
            "rationale": {
                "coreConcept": "Aortic Dissection Propagation",
                "caseSummary": "Middle-aged male with Ehlers-Danlos and Bicuspid valve presents with classic Type A dissection. Trend shows propagation through pain movement, BP asymmetry, and eventual shock.",
                "answerAnalysis": "Propagation is tracked through 'migrating pain' (o1), 'branch vessel occlusion' (o2/o4), and 'circulatory collapse/shock' (o3). These are high-priority cues for immediate surgical referral.",
                "trap": "Relying on laboratory markers (D-Dimer) to track a mechanical anatomical worsening.",
                "goldenRule": "In Aortic Dissection, the goal is 'Heart Rate and BP control first' (Beta blockers like Esmolol) to reduce shearing forces (dP/dt), then emergent surgery for Type A.",
                "steps": [
                    { "tag": "Assess", "description": "Measure BP in both arms to check for branch vessel involvement." },
                    { "tag": "Monitor", "description": "Continuously track pain location; movement down the spine equals propagation." }
                ],
                "mnemonic": {
                    "title": "TEAR",
                    "content": "T-Tearing/Ripping pain, E-Extremely high BP (initially), A-Asymmetric BP/Pulses, R-Rupture risk",
                    "explanation": "Summarizes the catastrophic nature of dissection."
                },
                "cheatSheet": {
                    "title": "Stanford Classification",
                    "points": [
                        "Type A: Involves Ascending Aorta (Surgical Emergency).",
                        "Type B: Descending Aorta ONLY (Often managed medically)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The aorta is the largest artery in the body. It consists of the intima (inner), media (middle), and adventitia (outer) layers.",
                    "physiology": "A dissection occurs when high pressure blood enters a tear in the intima and tunnels between the intima and media, creating a 'false lumen'.",
                    "pharm": "Esmolol is preferred as it is ultra-short acting and can be quickly turned off if the patient becomes hypotensive."
                },
                "difficulty": {
                    "score": 94,
                    "level": 5,
                    "label": "Critical Analysis",
                    "clinicalStrategy": "Recognize that 'extension' of symptoms is the key to 'propagation'.",
                    "recommendedActions": ["Check leg pulses", "Keep BP < 120 and HR < 60"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-PERI-G3H4",
        "typeId": "trend",
        "metadata": {
            "title": "Acute Pericarditis to Dressler's Syndrome",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:20:00Z",
            "updatedAt": "2026-01-23T13:20:00Z",
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
            "clinicalFocusTopics": ["Pericarditis", "Inflammation", "Post-MI Complications"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.T.", "age": 63, "gender": "Female", "allergies": "NKDA", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Sharp chest pain that is worse when lying flat.",
                    "hpi": "Client had a large anterior MI 4 weeks ago. She was doing well until 3 days ago when she developed a persistent fever and sharp, pleuritic chest pain that radiates to the trapezius ridge. She notes that swallowing and breathing deeply make the pain significantly worse.",
                    "pmh": ["Recent Anterior MI (4 weeks ago)", "COPD", "Hypothyroidism"],
                    "medications": ["Aspirin 81mg daily", "Ticagrelor 90mg BID", "Metoprolol 25mg daily", "Levothyroxine 50mcg"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "Clinic RN", "note": "Client reports sharp 6/10 pain. Fever of 100.4 recorded at home. Client noted to be leaning forward in the exam room chair." },
                    { "time": "Tue 1000", "author": "Clinic RN", "note": "Pain 8/10. Friction rub heard on auscultation at left lower sternal border. EKG shows diffuse ST elevation." },
                    { "time": "Wed 0900", "author": "Cardiologist", "note": "Soothe pain with high dose NSAIDs. Echo shows small global pericardial effusion. Diagnosis: Dressler's Syndrome." }
                ],
                "vitals": [
                    { "time": "Mon 1000", "tempF": "100.6", "hr": 92, "rr": 18, "bp": "118/72", "o2": "97", "o2_device": "RA", "pain": 6 },
                    { "time": "Tue 1000", "tempF": "100.8", "hr": 104, "rr": 22, "bp": "114/68", "o2": "96", "o2_device": "RA", "pain": 8 },
                    { "time": "Wed 0900", "tempF": "101.2", "hr": 110, "rr": 24, "bp": "108/64", "o2": "95", "o2_device": "RA", "pain": 9 }
                ],
                "labs": [
                    { "test": "ESR (Sed Rate)", "value": "78", "flag": "H", "ref": "< 20", "unit": "mm/hr" },
                    { "test": "CRP", "value": "45", "flag": "H", "ref": "< 10", "unit": "mg/L" },
                    { "test": "Troponin I", "value": "0.01", "flag": "N", "ref": "< 0.04", "unit": "ng/mL" }
                ],
                "radiology": [
                    { "study": "ECG", "findings": "Diffuse, concave ST-segment elevation in nearly all limb and precordial leads. PR-segment depression in Lead II.", "impression": "Classic Pericarditis pattern.", "date": "Tue" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and data for Wednesday at 0900. Which characteristics distinguish Dressler's Syndrome (Pericarditis) from a new, recurrent Myocardial Infarction?",
                "options": [
                    { "id": "o1", "text": "Chest pain radiating to the trapezius ridge", "isCorrect": true, "rationale": "Trapezius ridge pain is highly specific for pericarditis because the phrenic nerve (which innervates the pericardium) shares the same spinal roots (C3-C5) as the trapezius area." },
                    { "id": "o2", "text": "Pain relief when leaning forward/sitting up", "isCorrect": true, "rationale": "Positioning relieves pericardial tension; MI pain is unrelated to position." },
                    { "id": "o3", "text": "Presence of a pericardial friction rub", "isCorrect": true, "rationale": "A friction rub is caused by the inflamed layers of the pericardium rubbing together; it is absent in acute MI." },
                    { "id": "o4", "text": "Diffuse ST-segment elevation across multiple lead territories", "isCorrect": true, "rationale": "Pericarditis involves the entire heart (global), while MI is regional (corresponding to a specific coronary artery)." },
                    { "id": "o5", "text": "Elevated inflammatory markers (ESR 78, CRP 45)", "isCorrect": false, "rationale": "While present in pericarditis, these can also be elevated in a large post-MI state and are not definitive for differentiation." },
                    { "id": "o6", "text": "Troponin value of 0.01 ng/mL", "isCorrect": true, "rationale": "A normal troponin effectively rules out a NEW acute myocardial infarction, confirming the pain is inflammatory rather than necrotic." }
                ]
            },
            "rationale": {
                "coreConcept": "Differential: Pericarditis vs MI",
                "caseSummary": "Post-MI patient (4 weeks out) with new chest pain, fever, and friction rub. Data shows inflammatory marker rise but normal Troponin. EKG is global, not regional.",
                "answerAnalysis": "The keys to pericarditis are POSITIONAL pain (o2), TRAPEZIUS radiation (o1), FRICTION RUB (o3), CONCAVE GLOBAL ST lift (o4), and NORMAL markers of necrosis (o6).",
                "trap": "Thinking that fever or high ESR automatically means infection/pericarditis only (Large MIs also cause inflammatory responses).",
                "goldenRule": "If it feels better when they lean forward, it's probably pericarditis.",
                "steps": [
                    { "tag": "Examine", "description": "Listen for a scratchy friction rub while the patient leans forward at end-expiration." },
                    { "tag": "Verify", "description": "Check the EKG for PR depression and global elevation territory." }
                ],
                "mnemonic": {
                    "title": "FRICTION",
                    "content": "F-Fever, R-Rub, I-Inspiration worsens pain, C-Concave ST lift, T-Trapezius pain, I-Ibuprofen/Indomethacin relief, O-Only inflammatory (No Troponin rise), N-Not lying flat",
                    "explanation": "Summarizes the key findings of pericarditis."
                },
                "cheatSheet": {
                    "title": "Dressler's Timeline",
                    "points": [
                        "Early Pericarditis: 2-3 days post-MI.",
                        "Dressler's (Late): 2-10 weeks post-MI (Autoimmune)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The pericardium is innervated by the phrenic nerves.",
                    "physiology": "Dressler's is an immune system response following damage to heart tissue or the pericardium (e.g., MI, heart surgery).",
                    "pharm": "High-dose Aspirin or NSAIDs (like Ibuprofen or Indomethacin) are the mainstay treatments, sometimes combined with Colchicine."
                },
                "difficulty": {
                    "score": 90,
                    "level": 5,
                    "label": "High Analysis",
                    "clinicalStrategy": "Rule out necrosis (Troponin) and identify the specific positional cues.",
                    "recommendedActions": ["Give NSAIDs/Aspirin", "Auscultate for rub while leaning forward"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-IE-K1L2",
        "typeId": "trend",
        "metadata": {
            "title": "Infective Endocarditis (IE) with Systemic Emboli",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:25:00Z",
            "updatedAt": "2026-01-23T13:25:00Z",
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
            "clinicalFocusTopics": ["Infective Endocarditis", "Valvular Disease", "Stroke"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.P.", "age": 35, "gender": "Male", "allergies": "Penicillin", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "High fever, night sweats, and a new 'weird sound' in his heart.",
                    "hpi": "Client has a history of IDU (Intravenous Drug Use). He was admitted 2 days ago for possible sepsis. Blood cultures are positive for Staph aureus. He has a history of Mitral Valve Prolapse. On assessment, the nurse finds red, painless macules on the palms (Janeway lesions) and small, tender nodes on the fingertips (Osler nodes).",
                    "pmh": ["IV Drug Use (last use 1 week ago)", "Mitral Valve Prolapse", "Hepatitis C"],
                    "medications": ["Vancomycin 1.5g IV Q12", "Ceftriaxone 2g IV Daily"]
                },
                "history": [
                    { "time": "Day 1 0900", "author": "RN Smith", "note": "Client febrile (102.8). Blood cultures drawn. New 2/6 systolic murmur heard at the apex." },
                    { "time": "Day 2 0800", "author": "RN Smith", "note": "Client reports sudden left-sided abdominal pain. Splenomegaly noted on palpation. Murmur now 3/6, harsher." },
                    { "time": "Day 2 1400", "author": "RN Smith", "note": "Client suddenly difficult to arouse. Right-sided facial droop and right-sided arm weakness (0/5 strength). Stat stroke code initiated." }
                ],
                "vitals": [
                    { "time": "Day 1 0900", "tempF": "103.2", "hr": 108, "rr": 20, "bp": "110/64", "o2": "98", "o2_device": "RA", "pain": 4 },
                    { "time": "Day 2 0800", "tempF": "101.5", "hr": 98, "rr": 18, "bp": "106/60", "o2": "97", "o2_device": "RA", "pain": 7 },
                    { "time": "Day 2 1400", "tempF": "100.8", "hr": 110, "rr": 22, "bp": "138/84", "o2": "95", "o2_device": "RA", "pain": 3 }
                ],
                "labs": [
                    { "test": "WBC", "value": "18.4", "flag": "H", "ref": "4.5 - 11.0", "unit": "10^3/uL" },
                    { "test": "Blood Culture", "value": "Staph aureus", "flag": "H", "ref": "Negative", "unit": "N/A" },
                    { "test": "Platelets", "value": "110", "flag": "L", "ref": "150 - 450", "unit": "k/uL" }
                ],
                "radiology": [
                    { "study": "Transesophageal Echo (TEE)", "findings": "1.2 cm mobile vegetation on the atrial side of the anterior mitral valve leaflet. Moderate mitral regurgitation.", "impression": "Infective Endocarditis.", "date": "Day 1" },
                    { "study": "CT Head (Stat)", "findings": "Loss of grey-white differentiation in the left MCA territory. No hemorrhage.", "impression": "Acute Ischemic Stroke.", "date": "Day 2 1430" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and assessment findings. Which data points confirm that the client's endocarditis has resulted in systemic embolic complications?",
                "options": [
                    { "id": "o1", "text": "Sudden onset of right-sided facial droop and hemiparesis", "isCorrect": true, "rationale": "Left-sided mitral valve vegetations can break off (embolize) and travel to the brain, causing an ischemic stroke (focal neuro deficit)." },
                    { "id": "o2", "text": "Sudden left-sided abdominal pain and splenomegaly", "isCorrect": true, "rationale": "Splenic infarction is a common systemic embolic complication of IE, presenting as LUQ pain and an enlarged spleen." },
                    { "id": "o3", "text": "Presence of Osler nodes and Janeway lesions", "isCorrect": true, "rationale": "Osler nodes (immunologic) and Janeway lesions (embolic) are peripheral microvascular complications of endocarditis." },
                    { "id": "o4", "text": "Increase in whisper/murmur intensity (2/6 to 3/6)", "isCorrect": false, "rationale": "While a sign of worsening local valve damage, a louder murmur is a local cardiac finding, not a systemic 'embolic' complication." },
                    { "id": "o5", "text": "WBC count of 18.4 x 10^3/uL", "isCorrect": false, "rationale": "Leukocytosis indicates active infection/sepsis but does not specificially indicate an embolic event." },
                    { "id": "o6", "text": "Hematochezia (blood in stool)", "isCorrect": true, "rationale": "Emboli can travel to the mesenteric arteries, causing bowel ischemia and GI bleeding." }
                ]
            },
            "rationale": {
                "coreConcept": "Endocarditis Embolic Complications",
                "caseSummary": "IDU patient with Mitral Endocarditis showing rapid progression of systemic embolism (Spleen, then Brain/Stroke).",
                "answerAnalysis": "Systemic emboli from the LEFT heart (Mitral/Aortic) cause stroke (o1), splenic/renal infarcts (o2), skin lesions (o3), and gut ischemia (o6). Right-sided (Tricuspid) emboli cause PULMONARY symptoms (PE).",
                "trap": "Thinking all IE complications are embolic (the WBC count and murmur are part of IE but not 'embolic' in nature).",
                "goldenRule": "Vegetations > 10mm (1.0cm) in size carry a significantly higher risk of systemic embolization.",
                "steps": [
                    { "tag": "Assess", "description": "Perform frequent neuro checks in IE patients to catch embolic strokes early." },
                    { "tag": "Evaluate", "description": "Abdominal pain in IE = Splenic or Renal infarction until proven otherwise." }
                ],
                "mnemonic": {
                    "title": "FROM JANE",
                    "content": "F-Fever, R-Roth spots, O-Osler nodes, M-Murmur, J-Janeway lesions, A-Anemia, N-Nailbed hemorrhages, E-Emboli",
                    "explanation": "Summarizes the classic signs and complications of IE."
                },
                "cheatSheet": {
                    "title": "Left vs Right IE",
                    "points": [
                        "Left (Mitral/Aortic): Brain, Spleen, Kidney, Limbs.",
                        "Right (Tricuspid): Lungs (Pneumonia/PE), common in IV Drug Users."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The mitral valve is located between the left atrium and left ventricle.",
                    "physiology": "Vegetations are 'fribrin-platelet-bacteria towers' that grow on the valve. They are friable and easily break off into the high-pressure systemic circulation.",
                    "pharm": "Long-term IV antibiotics (4-6 weeks) are mandatory; surgery may be needed for large vegetations (>1cm) or heart failure."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Differentiate local infection signs from distant organ damage (emboli).",
                    "recommendedActions": ["Initiate Stroke Code", "Prepare for echo", "Continue IV Vancomycin"]
                }
            }
        }
    }
];
