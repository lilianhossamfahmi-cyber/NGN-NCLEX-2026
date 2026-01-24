import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 6: Items 32-35)
 * Focus: Tamponade, Endocarditis, Cardiomyopathy, Myocarditis
 */

export const CardiologyItems_Final_Batch6: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-TAMPO-Z1A2",
        "typeId": "trend",
        "metadata": {
            "title": "Cardiac Tamponade & Beck's Triad",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:30:00Z",
            "updatedAt": "2026-01-23T19:30:00Z",
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
            "clinicalFocusTopics": ["Cardiac Tamponade", "Pericardial Effusion", "Emergency Procedures"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "L.M.", "age": 54, "gender": "Male", "allergies": "NKDA", "weightKg": 88, "codeStatus": "Full Code"
                },
                "setting": "ICU / Post-Op CV Surgery",
                "historyPhysical": {
                    "chiefComplaint": "Sudden drop in BP and muffled heart sounds.",
                    "hpi": "Client is 2 hours post-CABG. Mediastinal chest tube drainage was 200 mL/hr, but suddenly stopped. The client's BP is dropping, and he appears anxious and tachypneic. Heart sounds are very difficult to hear.",
                    "pmh": ["CAD", "CABG x3"],
                    "medications": ["Norepinephrine", "Aspirin"]
                },
                "history": [
                    { "time": "1400", "author": "RN Smith", "note": "Chest tube output: 210 mL. Serosanguinous. Patient stable." },
                    { "time": "1500", "author": "RN Smith", "note": "Chest tube output: 0 mL. Tube appears 'clotted' or obstructed. Patient becoming restless." },
                    { "time": "1515", "author": "RN Smith", "note": "BP dropping significantly. JVD noted while HOB is at 45 degrees." }
                ],
                "vitals": [
                    { "time": "1400", "tempF": "98.6", "hr": 92, "rr": 18, "bp": "118/72", "o2": "98", "o2_device": "RA", "pain": 2 },
                    { "time": "1515", "tempF": "98.6", "hr": 128, "rr": 28, "bp": "82/60", "o2": "92", "o2_device": "RA", "pain": 4, "note": "Pulsus paradoxus noted (SBP drops 15 mmHg on inspiration)." }
                ],
                "labs": [],
                "radiology": [
                    { "study": "CXR (Stat)", "findings": "Enlarged, globoid cardiac silhouette.", "impression": "Probable Pericardial Effusion/Tamponade.", "date": "1520" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and hemodynamic changes. Which findings and interventions are correct for this life-threatening complication?",
                "options": [
                    { "id": "o1", "text": "Recognize the clinical presentation as 'Beck's Triad'", "isCorrect": true, "rationale": "Beck's Triad consists of Hypotension, JVD, and Muffled Heart Sounds—all present in this case." },
                    { "id": "o2", "text": "Identify 'Pulsus Paradoxus' (SBP drop > 10 mmHg on inspiration) as a confirmatory sign", "isCorrect": true, "rationale": "In tamponade, the right ventricle bulges into the left ventricle during inspiration due to external pressure, reducing Stroke Volume and SBP." },
                    { "id": "o3", "text": "Attempt to 'milk' or 'strip' the chest tube to clear the obstruction", "isCorrect": false, "rationale": "Stripping chest tubes is often contraindicated in modern evidence-based practice as it creates excessive negative pressure; gentle manipulation is preferred, but notification of the surgeon is the priority." },
                    { "id": "o4", "text": "Prepare for emergent Pericardiocentesis or return to the Operating Room", "isCorrect": true, "rationale": "Physical removal of the fluid/blood is the only way to restore cardiac filling and output." },
                    { "id": "o5", "text": "Increase the IV fluid rate to maintain right ventricular filling pressure", "isCorrect": true, "rationale": "Fluids provide temporary support by 'over-powering' the external pressure on the heart for a short time." },
                    { "id": "o6", "text": "Administer IV Morphine to reduce the patient's anxiety and heart rate", "isCorrect": false, "rationale": "Reducing HR in tamponade is dangerous; the high HR is the only thing maintaining Cardiac Output (CO = HR x fixed small SV)." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiac Tamponade Pathophysiology",
                "caseSummary": "Obstructed chest tube after heart surgery leads to blood accumulation in the pericardium. Pressure prevents filling. Beck's triad + Pulsus Paradoxus.",
                "answerAnalysis": "Correct: o1, o2 (Clinical identification), o4, o5 (Intervention/Support). Incorrect: o3 (Harmful maneuver), o6 (Tachycardia is compensatory).",
                "trap": "Believing 'Muffled Heart Sounds' is a subtle sign. In tamponade, they sound like they are 'underwater'.",
                "goldenRule": "Tamponade = Low BP, High JVD, Low Heart Sound.",
                "steps": [
                    { "tag": "Assess", "description": "Obtain SBP during inspiration and expiration (Pulsus Paradoxus)." },
                    { "tag": "Implement", "description": "Ensure large-bore IV access for fluid resuscitation before the procedure." }
                ],
                "mnemonic": {
                    "title": "Beck's B.B.C.",
                    "content": "B-Big JVD, B-Bad BP, C-Can't hear heart sounds",
                    "explanation": "Summarizes the triad."
                },
                "cheatSheet": {
                    "title": "Causes of Tamponade",
                    "points": [
                        "Post-Surgical bleeding (Cardiac/Thoracic).",
                        "Trauma (Gunshot/Stabbing).",
                        "Malignant Effusions (Cancer).",
                        "Pericarditis (Inflammation)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The pericardial sac normally contains 15-50 mL of lubricating fluid.",
                    "physiology": "Intrathoracic pressure increases during inspiration, normally drawing blood into the heart. In tamponade, this extra volume can't be accommodated.",
                    "pharm": "N/A"
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Emergency Synthesis",
                    "clinicalStrategy": "Look for the triplet of Low BP, Distended Necks, and Quiet Hearts.",
                    "recommendedActions": ["Immediate bedside ultrasound", "Notify surgeon"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-ENDOC-C3D4",
        "typeId": "trend",
        "metadata": {
            "title": "Infective Endocarditis & Embolic Risks",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:35:00Z",
            "updatedAt": "2026-01-23T19:35:00Z",
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
            "clinicalFocusTopics": ["Endocarditis", "Valvular Vegetations", "IV Drug Use"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.T.", "age": 29, "gender": "Female", "allergies": "Latex", "weightKg": 52, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Fever, night sweats, and painful fingertips.",
                    "hpi": "Client has a history of intravenous heroin use. She has had a fever for 5 days. Physical exam reveals small, red, painful nodules on the pads of her fingers (Osler's nodes) and flat, painless red spots on her palms (Janeway lesions). Splinter hemorrhages are seen under the fingernails. Grade III Systolic murmur heard.",
                    "pmh": ["IV Drug Use", "Splenectomy"],
                    "medications": ["N/A"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Smith", "note": "Patient admitted for suspected sepsis. Blood cultures obtained x2." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "103.2", "hr": 110, "rr": 20, "bp": "108/62", "o2": "98", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [
                    { "test": "Blood Culture 1", "value": "Pending", "flag": "N/A", "ref": "Negative", "unit": "" },
                    { "test": "Blood Culture 2", "value": "Pending", "flag": "N/A", "ref": "Negative", "unit": "" },
                    { "test": "WBC", "value": "18.5", "flag": "H", "ref": "4.5 - 11.0", "unit": "10^3/uL" }
                ],
                "radiology": [
                    { "study": "Transesophageal Echo (TEE)", "findings": "1.2 cm mobile vegetation on the Tricuspid valve.", "impression": "Infective Endocarditis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and EKG/Imaging. Which findings and nursing actions are most appropriate for this client?",
                "options": [
                    { "id": "o1", "text": "Recognize the 'Osler's Nodes' (Painful) and 'Janeway Lesions' (Painless) as classic endocarditis signs", "isCorrect": true, "rationale": "These are peripheral manifestations of immune complex deposition or septic microembolic events." },
                    { "id": "o2", "text": "Monitor the patient for sudden-onset chest pain and shortness of breath", "isCorrect": true, "rationale": "Since the vegetation is on the TRICUSPID valve (right side), a piece of the clot will embolize to the LUNGS (Pulmonary Embolism)." },
                    { "id": "o3", "text": "Assess for neurologic changes (Slurred speech, weakness)", "isCorrect": false, "rationale": "Neurologic (Stroke) risks occur if the vegetation is on the LEFT side (Mitral/Aortic). Right-sided endocarditis (common in IVDU) typically goes to the lungs." },
                    { "id": "o4", "text": "Obtain two sets of blood cultures from two different sites, 15 minutes apart", "isCorrect": true, "rationale": "Consistent bacteremia is a 'Major' Duke criterion for endocarditis diagnosis." },
                    { "id": "o5", "text": "Expect an order for 4-6 weeks of intravenous antibiotics via a PICC line", "isCorrect": true, "rationale": "Vegetations protect bacteria from the immune system; long-term high-dose IV therapy is required for penetration." },
                    { "id": "o6", "text": "Inform the client that she must take 'Prophylactic Antibiotics' for all future dental procedures", "isCorrect": true, "rationale": "History of endocarditis is a high-risk condition requiring antibiotic prophylaxis to prevent recurrence." }
                ]
            },
            "rationale": {
                "coreConcept": "Infective Endocarditis (IE)",
                "caseSummary": "Right-sided endocarditis (Tricuspid) in an IV drug user. Focus on 'Duke Criteria' and 'Peripheral signs'.",
                "answerAnalysis": "Correct: o1 (ID signs), o2 (PE risk-Right side), o4 (Diagnostics), o5 (Tx Plan), o6 (Long-term prophylaxis). Error: o3 (Stroke risk is for Left-sided IE).",
                "trap": "Thinking all Endocarditis leads to Stroke. You must look at WHICH VALVE has the vegetation. Right Valve = Lungs. Left Valve = Brain/Body.",
                "goldenRule": "Right Heart = Lungs. Left Heart = Body.",
                "steps": [
                    { "tag": "Verify", "description": "Ensure cultures are drawn BEFORE starting antibiotics." },
                    { "tag": "Teach", "description": "Explain the importance of completing the full 4-6 week course." }
                ],
                "mnemonic": {
                    "title": "O.J.S. (Endocarditis)",
                    "content": "Osler's (Ouch/Painful), Janeway (Just spots/Painless), Splinter hemorrhages",
                    "explanation": "Summarizes the hand findings."
                },
                "cheatSheet": {
                    "title": "Major Duke Criteria",
                    "points": [
                        "1. Two positive blood cultures with typical organisms.",
                        "2. Positive Echo showing vegetations or abscess.",
                        "3. New valvular regurgitation murmur."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The tricuspid valve separates the RA from the RV.",
                    "physiology": "IV drug users inject bacteria directly into the veins, which hit the right side of the heart first (Tricuspid valve).",
                    "pharm": "Common pathogens include S. aureus and S. viridans."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Pharma",
                    "clinicalStrategy": "Match the 'Valve Location' to the 'Embolic Destination'.",
                    "recommendedActions": ["Obtain cultures", "Initiate IV Vancomycin"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-MYOCA-E5F6",
        "typeId": "trend",
        "metadata": {
            "title": "Dilated vs Hypertrophic Cardiomyopathy",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:40:00Z",
            "updatedAt": "2026-01-23T19:40:00Z",
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
            "clinicalFocusTopics": ["Cardiomyopathy", "Heart Failure", "Ejection Fraction"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "H.P.", "age": 42, "gender": "Male", "allergies": "NKDA", "weightKg": 92, "codeStatus": "Full Code"
                },
                "setting": "Cardiology Outpatient",
                "historyPhysical": {
                    "chiefComplaint": "Shortness of breath and exercise intolerance.",
                    "hpi": "Client has a history of alcohol abuse. He has developed significant SOB, S3 heart sound, and bi-ventricular failure. Echo shows a 'thin-walled, globoid heart' with an Ejection Fraction (EF) of 15%. This is contrasted with a relative (Patient B) who has a 'thickened iv-septum' that obstructs the aortic valve.",
                    "pmh": ["Alcohol Use Disorder", "HTN"],
                    "medications": ["Furosemide", "Carvedilol"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Smith", "note": "Patient A (Dilated pmp) presents with crackles in lung bases and 2+ pedal edema." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.4", "hr": 104, "rr": 22, "bp": "102/60", "o2": "94", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "BNP", "value": "1200", "flag": "H", "ref": "< 100", "unit": "pg/mL" }
                ],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Global hypokinesis. EF 15%. Dilation of all 4 chambers.", "impression": "Dilated Cardiomyopathy (DCM).", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the cardiomyopathy types and patient physiology. Which statements correctly distinguish high-risk behaviors and interventions for Dilated vs Hypertrophic Cardiomyopathy (HCM)?",
                "options": [
                    { "id": "o1", "text": "Recognize that 'Alcohol' and 'Chemotherapy' (Doxorubicin) are common triggers for Dilated Cardiomyopathy", "isCorrect": true, "rationale": "Secondary DCM is often caused by toxic insults to the myocardium." },
                    { "id": "o2", "text": "Advise the Hypertrophic (HCM) patient to avoid extreme physical exertion and competitive sports", "isCorrect": true, "rationale": "In HCM, increased contractility during exercise can worsen the outflow obstruction and lead to sudden cardiac death (SCD)." },
                    { "id": "o3", "text": "Expect an order for Digoxin for the Dilated (DCM) patient with EF 15%", "isCorrect": true, "rationale": "Digoxin (positive inotrope) helps improve contractility in Dilated/Systolic failure." },
                    { "id": "o4", "text": "Encourage the Hypertrophic (HCM) patient to take Nitroglycerin for chest pain", "isCorrect": false, "rationale": "Nitroglycerin reduces preload, which makes the LV smaller, worsening the obstruction in HCM. It is contraindicated." },
                    { "id": "o5", "text": "Support 'Fluid Loading' for the Hypertrophic (HCM) patient to maintain LV volume", "isCorrect": true, "rationale": "Higher volume (preload) keeps the LV stretched out, which keeps the 'Obstructive' septum away from the mitral valve, improving outflow." },
                    { "id": "o6", "text": "Manage both types primarily with high-dose aggressive fluid restriction", "isCorrect": false, "rationale": "DCM needs restriction (due to overload), but HCM often needs maintenance of volume to prevent collapse of the outflow tract." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiomyopathy Phenotypes",
                "caseSummary": "DCM (Systolic Failure/Big Heart) vs HCM (Diastolic Failure/Thick Heart). Nursing care is often opposite for these two.",
                "answerAnalysis": "Correct: o1 (Causes), o2 (Safety), o3 (Inotropes for DCM), o5 (Preload for HCM). Incorrect: o4 (Nitro is bad for HCM), o6 (Fluid needs differ).",
                "trap": "Thinking all CHF needs Nitroglycerin. In HCM, Nitroglycerin can cause immediate cardiovascular collapse.",
                "goldenRule": "Dilated = Fix the Pump (Inotropes). Hypertrophic = Fill the Tank (Beta-blockers/Fluids).",
                "steps": [
                    { "tag": "Assess", "description": "Identify if the heart is 'Big and Baggy' (DCM) or 'Small and Thick' (HCM)." },
                    { "tag": "Teach", "description": "Warn HCM patients about 'Dehydration' and 'Nitro'." }
                ],
                "mnemonic": {
                    "title": "D vs H",
                    "content": "Dilated = Distended/Dilation. Hypertrophic = Heavy/Huge septum.",
                    "explanation": "Summarizes the physical state."
                },
                "cheatSheet": {
                    "title": "CHF Medication Guide",
                    "points": [
                        "DCM: Diuretics, ACEI, Digoxin.",
                        "HCM: Beta-blockers, CCBs, FLUIDS.",
                        "HCM Avoid: Nitrates, Diuretics (if possible), Inotropes."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "HCM typically involves the asymmetric septal hypertrophy (ASH).",
                    "physiology": "Systolic failure (DCM) = EF < 40%. Diastolic failure (HCM) = EF > 60% (hyperdynamic) but low Stroke Volume.",
                    "pharm": "Carvedilol (Beta-blocker) is useful in both but for different reasons (DCM: neurohormonal block; HCM: slowing rate for filling)."
                },
                "difficulty": {
                    "score": 92,
                    "level": 4,
                    "label": "Synthesis/Pharma",
                    "clinicalStrategy": "Differentiate between the 'Baggy' heart and the 'Thick' heart targets.",
                    "recommendedActions": ["Check EF", "Hydrate HCM patients"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-MYOCA-G7H8",
        "typeId": "trend",
        "metadata": {
            "title": "Viral Myocarditis & Nursing monitoring",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:45:00Z",
            "updatedAt": "2026-01-23T19:45:00Z",
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
            "clinicalFocusTopics": ["Myocarditis", "Chest Pain", "Activity Intolerance"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.K.", "age": 21, "gender": "Female", "allergies": "NKDA", "weightKg": 58, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Acute Care",
                "historyPhysical": {
                    "chiefComplaint": "Chest pain and fatigue following a flu-like illness.",
                    "hpi": "Client had a 'severe cold' 10 days ago (Cough, fever, myalgia). She now presents with chest pain that is sharp and worse with movement, and significant fatigue. She appears pale and has a rapid heart rate. No history of cardiac disease.",
                    "pmh": ["Recent Viral Upper Respiratory Infection (URI)"],
                    "medications": ["Ibuprofen"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Patient reports 'heaviness' in chest. EKG shows diffuse ST-segment changes (resembling pericarditis) and some premature ventricular contractions (PVCs)." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "100.8", "hr": 118, "rr": 20, "bp": "110/64", "o2": "97", "o2_device": "RA", "pain": 6 }
                ],
                "labs": [
                    { "test": "Troponin I", "value": "0.45", "flag": "H", "ref": "< 0.04", "unit": "ng/mL" },
                    { "test": "CRP", "value": "42", "flag": "H", "ref": "< 5", "unit": "mg/L" }
                ],
                "radiology": [
                    { "study": "Cardiac MRI", "findings": "Late gadolinium enhancement in the epicardial layer.", "impression": "Acute Myocarditis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical cues and inflammatory markers. Which nursing actions are most appropriate for this client?",
                "options": [
                    { "id": "o1", "text": "Maintain the client on strict bed rest to reduce myocardial oxygen demand", "isCorrect": true, "rationale": "Bed rest is the cornerstone of myocarditis management to prevent overwhelming an inflamed heart." },
                    { "id": "o2", "text": "Encourage the client to participate in 30 minutes of aerobic exercise to improve cardiac conditioning", "isCorrect": false, "rationale": "Exercise during acute myocarditis can trigger focal necrosis and lethal arrhythmias; it is strictly forbidden for months." },
                    { "id": "o3", "text": "Monitor the patient for signs of acute congestive heart failure", "isCorrect": true, "rationale": "Myocarditis (inflammation of the heart muscle) lead to global dysfunction and acute failure." },
                    { "id": "o4", "text": "Recognize the elevated Troponin (0.45) as a sign of myocardial cell injury", "isCorrect": true, "rationale": "Troponin is released whenever the heart cells are damaged, even by inflammation/virus rather than a blockage." },
                    { "id": "o5", "text": "Prepare the client for an emergency cardiac catheterization (stent)", "isCorrect": false, "rationale": "The issue is a virus/inflammation, not a coronary artery blockage. Cath is not indicated unless MI needs to be ruled out." },
                    { "id": "o6", "text": "Administer NSAIDs and watch for improvements in chest pain", "isCorrect": true, "rationale": "NSAIDs help reduce the inflammation (though used cautiously in some cases of myocarditis to avoid affecting healing)." }
                ]
            },
            "rationale": {
                "coreConcept": "Acute Myocarditis Management",
                "caseSummary": "Healthy young person with post-viral heart inflammation. Rising troponin and high HR. Core need is 'Rest'.",
                "answerAnalysis": "Correct: o1 (Rest), o3 (Complication check), o4 (Diagnostics), o6 (Inflammatory Tx). Errors: o2 (Exercise kills), o5 (Wrong patho).",
                "trap": "Thinking an 'Elevated Troponin' (o4) automatically means a 'Blockage/MI' (o5). In myocarditis, it's 'Cell Damage' from 'Inflammation'.",
                "goldenRule": "Myocarditis = High Rest, Low Activity.",
                "steps": [
                    { "tag": "Assess", "description": "Identify recent viral symptoms (the 'flu' 1-2 weeks ago)." },
                    { "tag": "Implement", "description": "Reduce workload on the heart; no strenuous activity for 3-6 months." }
                ],
                "mnemonic": {
                    "title": "M.V.P.",
                    "content": "Muscle inflammation, Viral origin, Post-infection",
                    "explanation": "Summarizes myocarditis."
                },
                "cheatSheet": {
                    "title": "Myocarditis Symptoms",
                    "points": [
                        "Chest pain (often pleuritic).",
                        "Dyspnea / Fatigue.",
                        "Palpitations / Tachycardia.",
                        "Recent Flu-like illness."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Myocardium is the middle muscular layer of the heart.",
                    "physiology": "Viral infection (Coxsackie B is common) triggers an autoimmune response against myocardial proteins.",
                    "pharm": "ACE Inhibitors and Beta-blockers are used if heart failure develops."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Analysis",
                    "clinicalStrategy": "Look for 'Rest' and 'Inflammatory' markers.",
                    "recommendedActions": ["Obtain EKG", "Implement bed rest"]
                }
            }
        }
    }
];
