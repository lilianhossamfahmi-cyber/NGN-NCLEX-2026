import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 2: Items 3-4 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch2: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-TAMP-E5F6",
        "typeId": "trend",
        "metadata": {
            "title": "Post-Procedural Cardiac Tamponade",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:05:00Z",
            "updatedAt": "2026-01-23T13:05:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 99,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Cardiac Tamponade", "Post-Op Complications", "Hemodynamics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "L.P.", "age": 54, "gender": "Male", "allergies": "Shellfish", "weightKg": 88, "codeStatus": "Full Code"
                },
                "setting": "Post-Anesthesia Care Unit (PACU)",
                "historyPhysical": {
                    "chiefComplaint": "Agitation, shortness of breath, and chest pressure.",
                    "hpi": "Client is 2 hours post-pericardiocentesis for large pericardial effusion. Procedure went as planned with 400mL of serosanguinous fluid drained. Upon arrival at PACU, client was stable. In the last 45 minutes, he has become increasingly anxious and restless.",
                    "pmh": ["Metastatic Lung Cancer", "Pericarditis", "Hypertension"],
                    "medications": ["Morphine (PRN)", "Lisinopril 20mg daily", "Dexamethasone 4mg BID"]
                },
                "history": [
                    { "time": "1400", "author": "J. RN", "note": "Client arrived from procedure. Pericardial drain in place, draining minimal amount. Vitals stable. Client resting comfortably." },
                    { "time": "1430", "author": "J. RN", "note": "Client reports 'feeling like I can't catch my breath'. Lungs clear to auscultation. Drain output 5mL in last 30 min. Agitated." },
                    { "time": "1500", "author": "J. RN", "note": "Client severely agitated. Neck veins distended when head of bed at 45 degrees. Heart sounds muffled. Extremities cool. Rapid Response Team called." }
                ],
                "vitals": [
                    { "time": "1400", "tempF": "98.9", "hr": 82, "rr": 18, "bp": "132/82", "o2": "97", "o2_device": "RA", "pain": 2 },
                    { "time": "1430", "tempF": "98.8", "hr": 98, "rr": 24, "bp": "118/78", "o2": "94", "o2_device": "2L NC", "pain": 4 },
                    { "time": "1500", "tempF": "98.7", "hr": 126, "bp": "92/80", "o2": "89", "o2_device": "4L NC", "pain": 6 }
                ],
                "labs": [
                    { "test": "CVP", "value": "18", "flag": "H", "ref": "2 - 8", "unit": "mmHg" },
                    { "test": "Hgb", "value": "10.2", "flag": "L", "ref": "13.5 - 17.5", "unit": "g/dL" }
                ],
                "radiology": [
                    { "study": "Bedside Echo (FAST)", "findings": "Significant re-accumulation of fluid in the pericardial space; right ventricular collapse during diastole.", "impression": "Acute Cardiac Tamponade.", "date": "1510" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse identifies the trend from 1400 to 1500 as Cardiac Tamponade. Which three clinical findings from this period comprise 'Beck’s Triad'?",
                "options": [
                    { "id": "o1", "text": "Narrowing pulse pressure (50 to 12 mmHg)", "isCorrect": false, "rationale": "While a classic sign of tamponade, narrowing pulse pressure is NOT part of the official Beck's Triad." },
                    { "id": "o2", "text": "Hypotension (BP 92/80)", "isCorrect": true, "rationale": "One of the three components of Beck's Triad, caused by reduced stroke volume." },
                    { "id": "o3", "text": "Muffled heart sounds (noted at 1500)", "isCorrect": true, "rationale": "One of the three components of Beck's Triad, caused by fluid insulating the heart." },
                    { "id": "o4", "text": "Jugular Venous Distension (JVD)", "isCorrect": true, "rationale": "One of the three components of Beck's Triad, caused by high filling pressures in the right heart." },
                    { "id": "o5", "text": "Pulsus paradoxus (drop of >10 mmHg in SBP on inspiration)", "isCorrect": false, "rationale": "A common sign of tamponade, but not part of Beck's Triad." },
                    { "id": "o6", "text": "Tachycardia (HR 126)", "isCorrect": false, "rationale": "Tachycardia is a compensatory mechanism, not a component of Beck's Triad." }
                ]
            },
            "rationale": {
                "coreConcept": "Cardiac Tamponade Identification",
                "caseSummary": "Post-pericardiocentesis patient with cancer develops sudden obstructive shock. Vitals show rapid narrowing of pulse pressure and the classic Beck's Triad signs.",
                "answerAnalysis": "Beck's Triad consists of 1) Hypotension, 2) Distended Neck Veins (JVD), and 3) Muffled Heart Sounds. This indicates the heart is being compressed by fluid (the 'tampon' effect).",
                "trap": "Including 'Pulsus Paradoxus' or 'Narrow Pulse Pressure' as part of the TRIAD. They are findings, but not part of that specific named triad.",
                "goldenRule": "Any patient with a history of trauma, recent heart procedure, or malignancy who becomes hypotensive and has a high CVP/JVD should be evaluated for Tamponade immediately.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify that BP is falling (132 -> 92) and HR is rising (82 -> 126)." },
                    { "tag": "Evaluate", "description": "Check JVD and Heart Sounds to confirm Beck's Triad." }
                ],
                "mnemonic": {
                    "title": "BECK (3 D's)",
                    "content": "D-Distended neck veins, D-Distant/muffled heart sounds, D-Decreased BP",
                    "explanation": "Simple way to remember the triad components."
                },
                "cheatSheet": {
                    "title": "Tamponade vs Shock",
                    "points": [
                        "Tamponade: High CVP, Low BP, Muffled Sounds.",
                        "Tension Pneumo: High CVP, Low BP, Absent Breath Sounds (Unilateral).",
                        "Hemothorax: Low CVP, Low BP, Absent Breath Sounds."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The pericardium is a double-walled sac containing the heart. Normal fluid space contains 15-50mL.",
                    "physiology": "In tamponade, the intrapericardial pressure exceeds the intracardiac pressure, preventing the chambers (starting with the thin-walled RA/RV) from filling. This leads to profound drop in cardiac output.",
                    "pharm": "The most effective 'medicine' for tamponade is physically removing the fluid (Pericardiocentesis). IV fluids can provide a temporary bridge by increasing preload to overcome the external pressure."
                },
                "difficulty": {
                    "score": 88,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Search for the three specific components defined by the namesake triad.",
                    "recommendedActions": ["Prepare for emergency pericardiocentesis", "Increase IV fluid rate"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-DIG-X9Y0",
        "typeId": "trend",
        "metadata": {
            "title": "Digoxin Toxicity with Electrolyte Imbalance",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:10:00Z",
            "updatedAt": "2026-01-23T13:10:00Z",
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
            "clinicalFocusTopics": ["Pharmacology", "Digoxin", "Electrolytes", "Rhythm Recognition"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.D.", "age": 75, "gender": "Female", "allergies": "Codeine", "weightKg": 58, "codeStatus": "Full Code"
                },
                "setting": "Skilled Nursing Facility (SNF); transitioning to ED",
                "historyPhysical": {
                    "chiefComplaint": "Profound weakness, loss of appetite, and 'blurry yellow vision'.",
                    "hpi": "Client with Chronic Heart Failure and Atrial Fibrillation was started on Furosemide (Lasix) 40mg BID one week ago to treat worsening peripheral edema. For the past 2 days, she has refused to eat and reports feeling 'extremely tired'. Staff at the facility noted she was slow to respond this morning and had a pulse of 44 bpm.",
                    "pmh": ["Congestive Heart Failure (NYHA Class III)", "Permanent Atrial Fibrillation", "Stage 3 CKD"],
                    "medications": ["Digoxin 0.125mg daily", "Furosemide 40mg BID", "Carvedilol 6.25mg BID", "Warfarin 4mg daily"]
                },
                "history": [
                    { "time": "1 Wk Ago", "author": "Dr. V", "note": "CHF exacerbation. Increasing Furosemide to 40mg BID. Stable Digoxin dosing. Follow up Labs ordered." },
                    { "time": "Yesterday", "author": "LPN Smith", "note": "Client refused breakfast and lunch. Complained of 'objects looking like they have yellow halos around them'. Encouraged fluids." },
                    { "time": "Today", "author": "LPN Smith", "note": "Client bradycardic and lethargic. BP 90/60. Pulse 42 and regular. EKG shows Junctional rhythm. Transfer to ED via 911." }
                ],
                "vitals": [
                    { "time": "1 Wk Ago", "tempF": "98.2", "hr": 74, "rr": 18, "bp": "122/76", "o2": "96", "o2_device": "RA", "pain": 0 },
                    { "time": "Yesterday", "tempF": "98.1", "hr": 58, "rr": 16, "bp": "110/64", "o2": "95", "o2_device": "RA", "pain": 0 },
                    { "time": "Today", "tempF": "97.9", "hr": 42, "rr": 14, "bp": "88/58", "o2": "92", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Potassium (K+)", "value": "2.8", "flag": "L", "ref": "3.5 - 5.0", "unit": "mEq/L" },
                    { "test": "Creatinine", "value": "1.9", "flag": "H", "ref": "0.6 - 1.2", "unit": "mg/dL" },
                    { "test": "Digoxin Level", "value": "2.4", "flag": "H", "ref": "0.5 - 2.0", "unit": "ng/mL" },
                    { "test": "BUN", "value": "38", "flag": "H", "ref": "7 - 20", "unit": "mg/dL" }
                ],
                "orders": [
                    { "order": "Atropine 0.5mg IV (PRN)", "status": "Active", "indication": "Symptomatic Bradycardia" },
                    { "order": "Slow Potassium Chloride Infusion", "status": "Pending", "indication": "Severe Hypokalemia" },
                    { "order": "Hold Digoxin and Carvedilol", "status": "Active", "indication": "Toxicity/Bradycardia" }
                ],
                "radiology": [
                    { "study": "EKG", "findings": "Absent P-waves, regular rhythm at rate of 42. Narrow QRS. Classic 'Digoxin dip' ST depression in V4-V6.", "impression": "Junctional Escape Rhythm secondary to Digitalis Toxicity.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Review the client's progress from one week ago to today. Which factors contributed to the client's current clinical state of Digoxin toxicity?",
                "options": [
                    { "id": "o1", "text": "Initiation of high-dose Furosemide", "isCorrect": true, "rationale": "Loop diuretics waste potassium. Hypokalemia does not increase digoxin level but it DOES increase digoxin binding, worsening toxicity." },
                    { "id": "o2", "text": "Hypokalemia (Potassium of 2.8)", "isCorrect": true, "rationale": "Potassium competes with digoxin for the same binding site on the Na+/K+ ATPase pump. Low K+ allows more digoxin to bind." },
                    { "id": "o3", "text": "Elevated Creatinine (1.9 mg/dL)", "isCorrect": true, "rationale": "Digoxin is primarily excreted by the kidneys. Renal impairment (Stage 3 CKD) increases the serum concentration of the drug." },
                    { "id": "o4", "text": "Age-related changes in drug metabolism", "isCorrect": true, "rationale": "Older adults have decreased lean body mass and decreased renal clearance, placing them at higher risk for digoxin toxicity." },
                    { "id": "o5", "text": "Initiation of Carvedilol", "isCorrect": false, "rationale": "Beta-blockers can lower HR, but they do not cause Digoxin toxicity. They are a separate class." },
                    { "id": "o6", "text": "Yellow-tinged vision (Xanthopsia)", "isCorrect": false, "rationale": "This is a SYMPTOM of the toxicity, not a FACTOR that contributed to it." }
                ]
            },
            "rationale": {
                "coreConcept": "Digoxin Toxicity Risk Factors",
                "caseSummary": "Elderly client on Digoxin with CKD was given Lasix. This caused Hypokalemia, which, combined with her impaired renal clearance, led to severe Digoxin toxicity and heart block.",
                "answerAnalysis": "The keys to Digoxin toxicity are 1) Renal insufficiency (Dig is cleared renally), 2) Hypokalemia (Loop diuretics), and 3) Advanced Age. Correct answers identify these physiological/pharmacological contributors.",
                "trap": "Confusing signs/symptoms (yellow vision) with risk factors (hypokalemia, renal failure).",
                "goldenRule": "Hypokalemia does not change the digoxin blood level, but it potentiates its toxic EFFECTS. Always check K+ before giving Digoxin.",
                "steps": [
                    { "tag": "Analyze", "description": "Identify the link between Furosemide and the drop in Potassium." },
                    { "tag": "Recognize", "description": "Interpret the regular junctional rhythm in an AFib patient as a sign of complete heart block (toxicity)." }
                ],
                "mnemonic": {
                    "title": "Low K+ = High Dig",
                    "content": "When K is LOW, Digoxin toxicity is HIGH.",
                    "explanation": "Simple memory aid for the most common cause of toxicity."
                },
                "cheatSheet": {
                    "title": "Digoxin Toxicity Signs",
                    "points": [
                        "GI: Nausea, Vomiting, Anorexia (Early)",
                        "CNS: Confusion, Fatigue, Xanthopsia (Yellow-Green halos)",
                        "Cardiac: Bradycardia, Heart Blocks, PVCs"
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The heart contains the Na+/K+ ATPase pump in the sarcolemma of myocardiocytes.",
                    "physiology": "Digoxin inhibits the Na+/K+ ATPase pump. This increases intracellular Sodium, which slows the Na+/Ca2+ exchanger, resulting in more intracellular Calcium and stronger contractility (positive inotropy).",
                    "pharm": "Digibind (Digoxin Immune Fab) is the antidote for life-threatening toxicity."
                },
                "difficulty": {
                    "score": 96,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Look for the interaction between diuretics and potassium levels.",
                    "recommendedActions": ["Hold the dose", "Administer Atropine for bradycardia", "Obtain serum K+"]
                }
            }
        }
    }
];
