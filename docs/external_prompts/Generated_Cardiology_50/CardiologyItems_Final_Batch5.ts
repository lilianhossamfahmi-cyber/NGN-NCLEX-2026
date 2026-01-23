import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 5: Items 11-14 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch5: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-MYO-P7R8",
        "typeId": "trend",
        "metadata": {
            "title": "Acute Viral Myocarditis Progression",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:45:00Z",
            "updatedAt": "2026-01-23T13:45:00Z",
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
            "clinicalFocusTopics": ["Myocarditis", "Heart Failure", "Infection Control"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "S.H.", "age": 24, "gender": "Male", "allergies": "NKDA", "weightKg": 78, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Observation Unit",
                "historyPhysical": {
                    "chiefComplaint": "Severe chest pain, palpitations, and extreme fatigue.",
                    "hpi": "Client, a healthy marathon runner, reports having a 'bad flu' with high fever and body aches approximately 2 weeks ago. He felt better for a few days but now presents with sharp substernal chest pain and a racing heart. He denies any history of CAD or sudden cardiac death in the family.",
                    "pmh": ["None", "Recent URI/Flu (2 weeks ago)"],
                    "medications": ["None"]
                },
                "history": [
                    { "time": "Mon 1400", "author": "RN Jones", "note": "Client reports sharp 7/10 pain. HR 115. EKG shows non-specific ST-T changes. Troponin I pending. Client appears pale." },
                    { "time": "Tue 0800", "author": "RN Jones", "note": "Client reports worsening dyspnea. Pain 4/10. Pulse is weak. Echo shows 'Global Hypokinesis' with EF of 35%." },
                    { "time": "Tue 1600", "author": "Cardiologist", "note": "Troponin high. Endomyocardial biopsy considered. Symptomatic heart failure treatment initiated (ACE inhibitors, Beta blockers)." }
                ],
                "vitals": [
                    { "time": "Mon 1400", "tempF": "101.4", "hr": 118, "rr": 20, "bp": "112/64", "o2": "97", "o2_device": "RA", "pain": 7 },
                    { "time": "Tue 0800", "tempF": "99.2", "hr": 108, "rr": 22, "bp": "102/58", "o2": "94", "o2_device": "2L NC", "pain": 4 },
                    { "time": "Tue 1600", "tempF": "98.6", "hr": 110, "rr": 24, "bp": "92/50", "o2": "91", "o2_device": "Non-rebreather", "pain": 2 }
                ],
                "labs": [
                    { "test": "Troponin I", "value": "1.45", "flag": "H", "ref": "< 0.04", "unit": "ng/mL" },
                    { "test": "BNP", "value": "850", "flag": "H", "ref": "< 100", "unit": "pg/mL" },
                    { "test": "ESR", "value": "48", "flag": "H", "ref": "< 20", "unit": "mm/hr" }
                ],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Global hypokinesis of the left ventricle; no regional wall motion abnormalities. Small pericardial effusion.", "impression": "Findings consistent with acute myocarditis.", "date": "Tue 0800" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and data. Which characteristics support a diagnosis of Acute Myocarditis over a traditional Myocardial Infarction?",
                "options": [
                    { "id": "o1", "text": "History of recent viral illness (Flu) 2 weeks prior", "isCorrect": true, "rationale": "Myocarditis is often a post-viral autoimmune response (e.g., Coxsackie B virus)." },
                    { "id": "o2", "text": "Global hypokinesis on echocardiogram (entire heart affected)", "isCorrect": true, "rationale": "MI causes REGIONAL wall motion abnormalities (only the area supplied by the blocked vessel). Myocarditis is diffuse/global." },
                    { "id": "o3", "text": "Elevated Troponin I level of 1.45 ng/mL", "isCorrect": false, "rationale": "Troponin is elevated in both Myocarditis AND MI due to muscle damage; it doesn't distinguish the two." },
                    { "id": "o4", "text": "Young age (24) and absence of CAD risk factors", "isCorrect": true, "rationale": "While MI can happen in young people, myocarditis is a leading cause of sudden heart failure/death in otherwise healthy young adults." },
                    { "id": "o5", "text": "Persistence of high fever (101.4 F) at presentation", "isCorrect": true, "rationale": "While MI can cause low-grade fever, high fever and systemic inflammatory symptoms are more common in myocarditis." },
                    { "id": "o6", "text": "Presence of ST-T segment changes on EKG", "isCorrect": false, "rationale": "Both conditions can show EKG changes; they are not distinguishing factors." }
                ]
            },
            "rationale": {
                "coreConcept": "Myocarditis vs MI",
                "caseSummary": "Healthy young man with recent flu develops acute heart failure. Findings show global heart damage (No specific blockage) and inflammatory cues.",
                "answerAnalysis": "The keys to Myocarditis are the VIRAL history (o1), GLOBAL damage rather than regional (o2), and clinical context of a YOUNG, healthy patient (o4) with FEVER (o5).",
                "trap": "Thinking that high Troponin (o3) means it *must* be an MI. Troponin just means muscle death; in myocarditis, it's caused by inflammation, not a clot.",
                "goldenRule": "Always ask about recent 'flu' or 'colds' in any young person presenting with chest pain or new heart failure.",
                "steps": [
                    { "tag": "Recognize", "description": "Assess the patient's age and recent viral history." },
                    { "tag": "Analyze", "description": "Check the Echo report for 'Global' vs 'Regional' movement." }
                ],
                "mnemonic": {
                    "title": "M.Y.O",
                    "content": "M-Monster (Viral) history, Y-Young/Healthy patient, O-Overwhelming (Global) failure",
                    "explanation": "Summarizes the core myocarditis profile."
                },
                "cheatSheet": {
                    "title": "Myocarditis Management",
                    "points": [
                        "Bed rest is critical (prevents further damage during acute phase).",
                        "Monitor for arrhythmias.",
                        "Standard HF medications (ACEi, Beta blockers)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The myocardium is the muscular middle layer of the heart wall.",
                    "physiology": "Inflammation leads to direct myocyte necrosis. This weakens the heart's ability to pump, leading to dilated cardiomyopathy if not resolved.",
                    "pharm": "NSAIDs are often AVOIDED in myocarditis as they may worsen myocardial injury in the acute viral phase; management focuses on HF support."
                },
                "difficulty": {
                    "score": 92,
                    "level": 5,
                    "label": "High Analysis",
                    "clinicalStrategy": "Search for 'Global' as the key word in the Echo results.",
                    "recommendedActions": ["Strict bed rest", "Cardiac monitoring"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-HOCM-A3B4",
        "typeId": "trend",
        "metadata": {
            "title": "Hypertrophic Cardiomyopathy (HOCM)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:50:00Z",
            "updatedAt": "2026-01-23T13:50:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 99,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["HOCM", "Genetic Cardiac disease", "Sudden Cardiac Death"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "T.L.", "age": 19, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Sports Physical / Clinic",
                "historyPhysical": {
                    "chiefComplaint": "Near-fainting during basketball practice and occasional chest pain.",
                    "hpi": "Client is a collegiate athlete who reports 'blacking out' for a few seconds after running a sprint. He says it's happened twice in the last month. He also mentions that his uncle 'died suddenly of a heart attack' at age 25. On exam, a harsh systolic murmur is heard at the left sternal border.",
                    "pmh": ["None"],
                    "medications": ["None"]
                },
                "history": [
                    { "time": "Initial Exam", "author": "NP Smith", "note": "Client sitting quietly. HR 68. BP 118/72. Murmur is 2/6, harsh, localized to the left sternal border." },
                    { "time": "Valsalva Maneuver", "author": "NP Smith", "note": "Murmur intensity INCREASES significantly to 4/6 as the client bears down." },
                    { "time": "Squatting Position", "author": "NP Smith", "note": "Murmur intensity DECREASES to 1/6 when the client is in a deep squat." }
                ],
                "vitals": [
                    { "time": "Rest", "tempF": "98.6", "hr": 68, "rr": 14, "bp": "118/72", "o2": "99", "o2_device": "RA", "pain": 0 },
                    { "time": "Post-Exertion", "hr": 142, "bp": "102/60", "o2": "98" }
                ],
                "labs": [],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Asymmetric septal hypertrophy (Interventricular septum 22mm). Systolic anterior motion (SAM) of the mitral valve causing LV outage obstruction (LVOT).", "impression": "Hypertrophic Obstructive Cardiomyopathy (HOCM).", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend during the physical maneuvers. Which findings are pathognomonic for Hypertrophic Obstructive Cardiomyopathy (HOCM) and distinguish it from Valvular Aortic Stenosis?",
                "options": [
                    { "id": "o1", "text": "Murmur intensity increases with Valsalva maneuver", "isCorrect": true, "rationale": "Valsalva decreases preload (less blood in LV). In HOCM, less blood means the thick septum is closer to the mitral valve, increasing obstruction and murmur. In Aortic Stenosis, less blood = softer murmur." },
                    { "id": "o2", "text": "Murmur intensity decreases with squatting", "isCorrect": true, "rationale": "Squatting increases preload and afterload (more blood in LV). This 'pushes' the septum away from the mitral valve, reducing HOCM obstruction. AS murmur would increase with more blood flow." },
                    { "id": "o3", "text": "History of sudden cardiac death in a young first-degree relative", "isCorrect": true, "rationale": "HOCM is often autosomal dominant and is the leading cause of sudden death in young athletes." },
                    { "id": "o4", "text": "Presence of a crescendo-decrescendo systolic murmur", "isCorrect": false, "rationale": "Both HOCM and Aortic Stenosis cause a systolic murmur in this pattern; it is not distinguishing." },
                    { "id": "o5", "text": "Symptom of exertional syncope", "isCorrect": false, "rationale": "Both HOCM and severe AS cause syncope; it is a shared symptom of fixed cardiac output." },
                    { "id": "o6", "text": "Murmur radiating to the carotid arteries", "isCorrect": false, "rationale": "Aortic Stenosis radiates to carotids. HOCM typically does NOT radiate to the neck." }
                ]
            },
            "rationale": {
                "coreConcept": "HOCM Dynamics",
                "caseSummary": "Young athlete with family history of sudden death. Murmur gets LOUDER when preload is dropped (Valsalva) and softer when it's increased (Squat).",
                "answerAnalysis": "HOCM is dynamic. Anything that makes the heart SMALLER (Dehydration, Valsalva, Tachycardia) makes the obstruction WORSE (o1). Anything that makes it BIGGER (Squatting, Fluids, Beta blockers) makes it BETTER (o2). Family history (o3) is the biggest clue.",
                "trap": "Thinking that 'more blood flow' (Squatting) makes all murmurs louder. In HOCM, more volume 'dilates' the obstruction away.",
                "goldenRule": "For HOCM: Avoid Dehydration. Avoid Heavy Lifting (Valsalva). Avoid Diuretics.",
                "steps": [
                    { "tag": "Analyze", "description": "Relate the change in murmur intensity to the change in preload volume." },
                    { "tag": "Assess", "description": "Always obtain a family pedigree for young patients with murmurs." }
                ],
                "mnemonic": {
                    "title": "V-H / S-E",
                    "content": "V-alsalva = H-igher murmur, S-quat = E-ased (lower) murmur",
                    "explanation": "Summarizes the preload-dependent nature of the obstruction."
                },
                "cheatSheet": {
                    "title": "HOCM Safety",
                    "points": [
                        "NO competitive sports.",
                        "Stay well hydrated (Maintain preload).",
                        "Beta blockers (increase filling time)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The interventricular septum is the wall between the two ventricles.",
                    "physiology": "The 'Venturi effect' pulls the mitral valve leaflet towards the thick septum during systole, blocking the exit (LVOT).",
                    "pharm": "Beta blockers like Metoprolol are first-line to slow the heart rate and allow more time for the left ventricle to fill."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Expert Reasoning",
                    "clinicalStrategy": "Look for the 'inverse' relationship between volume and murmur volume.",
                    "recommendedActions": ["Counsel on exercise restriction", "Refer for genetic testing"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-CORPUL-N5M6",
        "typeId": "trend",
        "metadata": {
            "title": "Cor Pulmonale (Right Heart Failure)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:55:00Z",
            "updatedAt": "2026-01-23T13:55:00Z",
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
            "clinicalFocusTopics": ["Cor Pulmonale", "COPD", "Right-Sided Heart Failure"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.R.", "age": 70, "gender": "Male", "allergies": "NKDA", "weightKg": 85, "codeStatus": "Full Code"
                },
                "setting": "Medical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Increasing swelling in legs and weight gain.",
                    "hpi": "Client has a 30-year history of COPD (Emphysema) and uses 3L oxygen at home. Over the last month, he has noticed that his socks are leaving deep indentations in his ankles. He reports that his 'belly feels full' and he is unable to eat full meals. He denies any new cough or increases in sputum.",
                    "pmh": ["COPD (Stage IV)", "Tobacco use (60 pack-years)", "Primary Pulmonary Hypertension"],
                    "medications": ["Tiotropium", "Salmeterol/Fluticasone", "Oxygen 3L NC", "Furosemide 20mg daily"]
                },
                "history": [
                    { "time": "Mon 1000", "author": "RN Smith", "note": "Client admitted for edema. 3+ pitting edema to mid-calf. Abdomen distended. Weight 3kg over baseline. Jugular venous distension (JVD) present at 45 degrees." },
                    { "time": "Mon 1100", "author": "RN Smith", "note": "Lung assessment performed: Lungs are 'Hyper-resonant' but CLEAR to auscultation. No crackles or wheezing noted." },
                    { "time": "Mon 1200", "author": "MD", "note": "Diagnosis: Cor Pulmonale secondary to COPD. Order: Increase diuretics, consider Sildenafil for pulmonary hypertension." }
                ],
                "vitals": [
                    { "time": "Mon 1000", "tempF": "98.4", "hr": 98, "rr": 24, "bp": "112/68", "o2": "89", "o2_device": "3L NC", "pain": 2 }
                ],
                "labs": [
                    { "test": "BNP", "value": "450", "flag": "H", "ref": "< 100", "unit": "pg/mL" },
                    { "test": "Hgb", "value": "18.2", "flag": "H", "ref": "13.5 - 17.5", "unit": "g/dL" },
                    { "test": "PaCO2", "value": "58", "flag": "H", "ref": "35 - 45", "unit": "mmHg" }
                ],
                "radiology": [
                    { "study": "Chest X-ray", "findings": "Flat diaphragms, hyperinflated lung fields, enlarged right ventricle and pulmonary artery. NO pulmonary vascular congestion/edema.", "impression": "Findings consistent with COPD and Cor Pulmonale.", "date": "Mon" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical data. Which findings support the diagnosis of Cor Pulmonale (Right-Sided Failure) rather than Left-Sided Heart Failure?",
                "options": [
                    { "id": "o1", "text": "Presence of Jugular Venous Distension (JVD)", "isCorrect": false, "rationale": "JVD occurs in BOTH right and left-sided failure (though it is the hallmark of right failure, left failure eventually BACKS UP into the right)." },
                    { "id": "o2", "text": "Lungs are clear to auscultation without crackles", "isCorrect": true, "rationale": "In pure RIGHT-sided failure (Cor Pulmonale), the fluid backs up into the BODY, not the LUNGS. Left failure causes pulmonary crackles." },
                    { "id": "o3", "text": "Absence of pulmonary edema on Chest X-ray", "isCorrect": true, "rationale": "Cor Pulmonale is right failure due to lung disease; the lungs themselves remain 'dry' of fluid, distinguishing it from left heart failure ('wet' lungs)." },
                    { "id": "o4", "text": "Chronic history of COPD and elevated PaCO2", "isCorrect": true, "rationale": "The definition of Cor Pulmonale is right ventricular failure CAUSED by primary lung disease or pulmonary hypertension." },
                    { "id": "o5", "text": "Secondary Polycythemia (Hgb 18.2)", "isCorrect": true, "rationale": "Common in chronic lung patients where the body makes more RBCs to carry oxygen; supports the 'lung trigger' of Cor Pulmonale." },
                    { "id": "o6", "text": "Elevated BNP level of 450 pg/mL", "isCorrect": false, "rationale": "BNP is released whenever ANY chamber of the heart (right or left) is stretched. It does not help distinguish which side is failing." }
                ]
            },
            "rationale": {
                "coreConcept": "Cor Pulmonale Identification",
                "caseSummary": "COPD patient with JVD and edema. Key differentiator: Lungs are CLEAR, and CXR shows no pulmonary edema. This is Right-Sided failure triggered by lung disease.",
                "answerAnalysis": "Right heart failure (Cor Pulmonale) backup goes into the Venous system (JVD, Liver, Edema). Left heart failure backup goes into the Pulmonic system (Crackles, SOB). Clear lungs (o2/o3) and Lung history (o4/o5) confirm Cor Pulmonale.",
                "trap": "Thinking BNP (o6) or JVD (o1) is specific to only one side of the heart.",
                "goldenRule": "Right Heart Failure = Wet Body, Dry Lungs. Left Heart Failure = Wet Lungs.",
                "steps": [
                    { "tag": "Auscultate", "description": "Listen to the lungs first; if they are clear but the patient has 4+ edema, look for a right-sided cause." },
                    { "tag": "Analyze", "description": "Check the CBC for polycythemia (high Hgb), which points to chronic hypoxemia from lung disease." }
                ],
                "mnemonic": {
                    "title": "H.E.A.D",
                    "content": "H-Hepatomegaly, E-Edema, A-Ascites, D-Distended Neck Veins",
                    "explanation": "Summarizes the signs of systemic venous congestion (Right failure)."
                },
                "cheatSheet": {
                    "title": "Right Failure Signs",
                    "points": [
                        "Splenomegaly/Hepatomegaly",
                        "Weight gain (Fluid)",
                        "Ascites (Full feeling)",
                        "Peripheral Edema"
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Right Ventricle is thinner walled and designed for low-pressure systems.",
                    "physiology": "COPD leads to alveolar hypoxia, which causes pulmonary vasoconstriction. This increased resistance makes the right ventricle work harder, eventually failing.",
                    "pharm": "Diuretics reduce the volume, but treating the underlying lung disease (oxygen, bronchodilators) is critical to reduce pulmonary pressure."
                },
                "difficulty": {
                    "score": 85,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Rule out 'Left' causes (crackles/CXR congestion) to confirm 'Right'.",
                    "recommendedActions": ["Keep O2 > 90%", "Measure abdominal girth"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-AMIOPULM-L4M5",
        "typeId": "trend",
        "metadata": {
            "title": "Amiodarone-Induced Pulmonary Toxicity",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:00:00Z",
            "updatedAt": "2026-01-23T14:00:00Z",
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
            "clinicalFocusTopics": ["Pharmacology Toxicity", "Amiodarone", "Interstitial Lung Disease"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "D.S.", "age": 73, "gender": "Female", "allergies": "Iodine", "weightKg": 68, "codeStatus": "Full Code"
                },
                "setting": "Outpatient Follow-up",
                "historyPhysical": {
                    "chiefComplaint": "Progressive shortness of breath and a dry, hacking cough for 2 months.",
                    "hpi": "Client has been on Amiodarone for Atrial Fibrillation for the last 18 months. She reports that she used to be able to walk 2 miles, but now gets winded walking to the kitchen. She has no fever and denies orthopnea (can sleep flat).",
                    "pmh": ["Persistent Atrial Fibrillation", "Hypertension", "Hyperthyroidism (resolved)"],
                    "medications": ["Amiodarone 400mg daily", "Apixaban 5mg BID", "Metoprolol 25mg daily"]
                },
                "history": [
                    { "time": "6 Mo Ago", "author": "Dr. Lee", "note": "Client doing well. AFib rate-controlled. EKG shows normal rhythm. Lungs clear." },
                    { "time": "2 Mo Ago", "author": "Dr. Lee", "note": "Client reports new dry cough. No sputum. No fever. Breath sounds slightly diminished at bases." },
                    { "time": "Today", "author": "Dr. Lee", "note": "Dyspnea on exertion (DOE) significantly worse. Fine 'velcro' crackles heard throughout both lung fields. CXR ordered." }
                ],
                "vitals": [
                    { "time": "6 Mo Ago", "hr": 74, "bp": "128/76", "o2": "98", "rr": 16 },
                    { "time": "2 Mo Ago", "hr": 76, "bp": "122/74", "o2": "96", "rr": 20 },
                    { "time": "Today", "hr": 84, "bp": "118/72", "o2": "91", "rr": 26 }
                ],
                "labs": [
                    { "test": "WBC", "value": "7.2", "flag": "N", "ref": "4.5 - 11.0", "unit": "10^3/uL" },
                    { "test": "Pro-BNP", "value": "110", "flag": "N", "ref": "< 125", "unit": "pg/mL" },
                    { "test": "ALT/AST", "value": "45/38", "flag": "N", "ref": "< 40", "unit": "U/L" }
                ],
                "radiology": [
                    { "study": "Chest X-ray", "findings": "Diffuse interstitial infiltrates and 'ground glass' opacities throughout both lung fields. No pleural effusions or cardiac enlargement.", "impression": "Probable Drug-Induced Interstitial Lung Disease.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse reviews the clinical trend and medication history. Which findings support the diagnosis of Amiodarone-Induced Pulmonary Toxicity over Congestive Heart Failure?",
                "options": [
                    { "id": "o1", "text": "Normal Pro-BNP level (110 pg/mL)", "isCorrect": true, "rationale": "A normal BNP effectively rules out heart failure as the cause of the dyspnea." },
                    { "id": "o2", "text": "Presence of a chronic dry cough without orthopnea", "isCorrect": true, "rationale": "Lung toxicity presents as a dry/non-productive cough. CHF usually causes orthopnea (needs pillows to sleep) and productive 'pink frothy' sputum or wet cough." },
                    { "id": "o3", "text": "Diffuse interstitial infiltrates on CXR without cardiac enlargement", "isCorrect": true, "rationale": "Amiodarone causes fibrosis/inflammation of the lung tissue (interstitium). CHF would show a 'big heart' (cardiomegaly) and fluid (effusions), which are absent here." },
                    { "id": "o4", "text": "Dose of 400mg daily for 18 months", "isCorrect": true, "rationale": "Toxicity risk increases significantly with doses >200mg/day and longer duration of therapy." },
                    { "id": "o5", "text": "Fine 'velcro' crackles heard throughout both lung fields", "isCorrect": false, "rationale": "Dry 'velcro' crackles are common in fibrosis (toxicity), but wet crackles are common in CHF; crackles alone do not distinguish the two without the context of other data." },
                    { "id": "o6", "text": "Presence of a normal WBC count", "isCorrect": true, "rationale": "Rules out pneumonia/infection as the primary cause of the infiltrates/fever." }
                ]
            },
            "rationale": {
                "coreConcept": "Amiodarone Pulmonary Toxicity",
                "caseSummary": "Client on high-dose Amiodarone for 1.5 years. Trends toward progressive hypoxia and fibrosis clues on CXR. Normal BNP rules out heart failure.",
                "answerAnalysis": "Amiodarone is a 'dirty drug' with many side effects. Pulmonary toxicity is the most lethal. Normal heart markers (o1), specific lung symptoms (o2), CXR patterns (o3), and high cumulative dose (o4) confirm the drug cause.",
                "trap": "Thinking that because the patient is in AFib, the SOB *must* be their heart. You must look at the drugs!",
                "goldenRule": "Any new dry cough or dyspnea in a patient on Amiodarone is pulmonary toxicity until proven otherwise. It can be fatal.",
                "steps": [
                    { "tag": "Verify", "description": "Check the medication list for 'Amiodarone' and the cumulative dose." },
                    { "tag": "Differentiate", "description": "Use the BNP to rule out HF and the WBC to rule out Infectious Pneumonia." }
                ],
                "mnemonic": {
                    "title": "A.M.I.O Side Effects",
                    "content": "A-Alveolitis (Lung), M-Myxedema (Thyroid), I-Iodine sensitivity, O-Ocular (Corneal microdeposits)",
                    "explanation": "Summarizes the major organ systems amiodarone affects."
                },
                "cheatSheet": {
                    "title": "Amiodarone Monitoring",
                    "points": [
                        "Baseline CXR and PFTs.",
                        "Annual Eye Exams.",
                        "Baseline TSH and LFTs every 6 months."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The alveoli and interstitium are where gas exchange occurs.",
                    "physiology": "Amiodarone accumulates in lysosomes within macrophages, causing an inflammatory/fibrotic response in the lung tissue.",
                    "pharm": "Amiodarone is 37% iodine and has a very long half-life (50-100 days), meaning toxicity can persist even after stopping the drug."
                },
                "difficulty": {
                    "score": 93,
                    "level": 5,
                    "label": "High Analysis",
                    "clinicalStrategy": "Rule out 'Cardiac' and 'Infectious' to find the 'Pharmacological' culprit.",
                    "recommendedActions": ["Stop Amiodarone immediately", "Start high-dose corticosteroids"]
                }
            }
        }
    }
];
