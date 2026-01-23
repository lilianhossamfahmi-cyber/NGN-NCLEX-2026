import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 4: Items 8-10 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch4: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-RENAL-M1N2",
        "typeId": "trend",
        "metadata": {
            "title": "Type 1 Cardiorenal Syndrome during HF Treatment",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:30:00Z",
            "updatedAt": "2026-01-23T13:30:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Evaluate Outcomes",
            "clinicalFocusTopics": ["Heart Failure", "Renal Failure", "Diuretics", "Fluid Management"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "B.K.", "age": 72, "gender": "Male", "allergies": "Sulfa", "weightKg": 105, "codeStatus": "Full Code"
                },
                "setting": "Medical-Surgical Unit",
                "historyPhysical": {
                    "chiefComplaint": "Severe pitting edema and dyspnea.",
                    "hpi": "Client with known HFrEF (EF 25%) was admitted 48 hours ago for acute decompensated heart failure (ADHF). He had 4+ pitting edema to the thighs and significant bibasilar crackles. An aggressive IV furosemide regimen (80mg IV BID) was initiated, and the client was placed on a strict 1.5L fluid restriction.",
                    "pmh": ["Congestive Heart Failure", "Hypertension", "Chronic Kidney Disease Stage 2"],
                    "medications": ["Furosemide 80mg IV BID", "Sacubitril/Valsartan 24/26mg BID", "Carvedilol 3.125mg BID", "Spironolactone 25mg daily"]
                },
                "history": [
                    { "time": "Mon 0800", "author": "RN Chen", "note": "Client admitted. Severe respiratory distress. Bibasilar crackles. 4+ pitting edema. Net I/O goal: -2000mL daily." },
                    { "time": "Tue 0800", "author": "RN Chen", "note": "Client report significant improvement in breathing. Net balance yesterday: -2800mL. Weight down 3kg. Urine output brisk." },
                    { "time": "Wed 0800", "author": "RN Chen", "note": "Client report feeling 'dizzy' when sitting up. Mucous membranes dry. Urine output slowed to 15mL/hr. Labs pending." }
                ],
                "vitals": [
                    { "time": "Mon 0800", "tempF": "98.2", "hr": 92, "rr": 24, "bp": "148/92", "o2": "89", "o2_device": "4L NC", "pain": 2 },
                    { "time": "Tue 0800", "tempF": "98.1", "hr": 84, "rr": 18, "bp": "122/78", "o2": "94", "o2_device": "2L NC", "pain": 0 },
                    { "time": "Wed 0800", "tempF": "98.0", "hr": 106, "rr": 20, "bp": "88/54", "o2": "96", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Creatinine", "value": "1.1", "time": "Mon", "flag": "N", "ref": "0.6 - 1.2", "unit": "mg/dL" },
                    { "test": "Creatinine", "value": "2.8", "time": "Wed", "flag": "H", "ref": "0.6 - 1.2", "unit": "mg/dL" },
                    { "test": "BUN", "value": "18", "time": "Mon", "flag": "N", "ref": "7 - 20", "unit": "mg/dL" },
                    { "test": "BUN", "value": "64", "time": "Wed", "flag": "H", "ref": "7 - 20", "unit": "mg/dL" },
                    { "test": "Sodium", "value": "138", "time": "Mon", "ref": "136 - 145", "unit": "mEq/L" }
                ],
                "orders": [
                    { "order": "Hold Furosemide", "status": "Active", "indication": "Rising Creatinine/Hypotension" },
                    { "order": "Stat IV Bolus 250mL NS", "status": "Active", "indication": "Evaluate Renal Responsiveness" }
                ],
                "radiology": [
                    { "study": "CXR (Wed)", "findings": "Significant clearing of pulmonary vascular congestion compared to admission. No pleural effusions.", "impression": "Resolution of pulmonary edema.", "date": "Wed" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse evaluates the trend from Monday to Wednesday. Which findings indicate that the client has developed Type 1 Cardiorenal Syndrome due to 'over-diuresis'?",
                "options": [
                    { "id": "o1", "text": "Rising Creatinine (1.1 to 2.8 mg/dL)", "isCorrect": true, "rationale": "An acute rise in creatinine (AKI) following aggressive diuresis is a hallmark of Type 1 Cardiorenal syndrome (heart failure causing kidney failure)." },
                    { "id": "o2", "text": "Profoundly elevated BUN/Creatinine ratio (>20:1)", "isCorrect": true, "rationale": "The Wednesday labs (BUN 64 / Cr 2.8 = 22.8) indicate a pre-renal pattern caused by intravascular volume depletion." },
                    { "id": "o3", "text": "Transition to Hypotension and compensatory Tachycardia", "isCorrect": true, "rationale": "BP 148/92 to 88/54 with HR 106 suggests that intravascular volume has been depleted faster than interstitial fluid (edema) can migrate back into the vessels." },
                    { "id": "o4", "text": "Cleared lung fields on CXR", "isCorrect": false, "rationale": "This is a sign of therapeutic success in treating the HEART failure but does not indicate the renal complication." },
                    { "id": "o5", "text": "Decreased urine output (Oliguria)", "isCorrect": true, "rationale": "Brish diuresis followed by a drop to 15mL/hr indicates the kidneys are now responding to low perfusion/dehydration." },
                    { "id": "o6", "text": "3kg weight loss in 48 hours", "isCorrect": false, "rationale": "While significant, weight loss is the goal of diuresis; the complication is defined by the labs and perfusion status, not the weight itself." }
                ]
            },
            "rationale": {
                "coreConcept": "Type 1 Cardiorenal Syndrome",
                "caseSummary": "Patient aggressively diuresed for HF. Now shows clearing lungs (success) but rising kidney markers and low BP (renal complication).",
                "answerAnalysis": "The diagnosis is confirmed by o1, o2, o3, and o5. The intravascular space was 'dried out' too quickly. The fluid in the tissues (4+ edema) cannot move back into the capillaries fast enough to maintain BP, leading to pre-renal AKI.",
                "trap": "Thinking that because the lungs are clear (o4), the therapy should continue. This is the moment to HOLD or SLOW the diuretic.",
                "goldenRule": "Diuresis must not exceed the 'plasma refill rate'. If Cr rises and BP falls, you have exceeded the heart's ability to maintain kidney perfusion.",
                "steps": [
                    { "tag": "Analyze", "description": "Compare the daily weights and net fluids (I/O) to the renal labs (BUN/Cr)." },
                    { "tag": "Collaborate", "description": "Notify the provider to pull back on diuretics and potentially provide a small volume challenge." }
                ],
                "mnemonic": {
                    "title": "C.R.S",
                    "content": "C-Creatinine climbs, R-Refill rate surpassed, S-Shrinking BP",
                    "explanation": "Summarizes the cardiac-driven renal insult."
                },
                "cheatSheet": {
                    "title": "BUN/Cr Ratios",
                    "points": [
                        "> 20:1 = Pre-renal (Dehydration/Heart Failure)",
                        "10:1 - 20:1 = Normal or Post-renal",
                        "< 10:1 = Intra-renal (Intrinsic kidney damage)"
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The renal afferent arterioles sense pressure and trigger the RAAS system.",
                    "physiology": "In HF, low cardiac output already reduces renal blood flow. Adding high-dose diuretics further reduces the Effective Circulating Volume (ECV).",
                    "pharm": "Sacubitril/Valsartan (Entresto) can also contribute to rising creatinine and must be monitored closely during aggressive diuresis."
                },
                "difficulty": {
                    "score": 93,
                    "level": 5,
                    "label": "Evaluation",
                    "clinicalStrategy": "Look for the trade-off: Breathing is better (lungs clear) BUT kidneys are failing (Cr up).",
                    "recommendedActions": ["Hold Furosemide", "Check orthostatic Vitals"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-WPW-A7B8",
        "typeId": "trend",
        "metadata": {
            "title": "WPW with Rapid AFib: Management Pitfalls",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:35:00Z",
            "updatedAt": "2026-01-23T13:35:00Z",
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
            "clinicalFocusTopics": ["WPW Syndrome", "Atrial Fibrillation", "Pharmacology Contraindications"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.M.", "age": 28, "gender": "Male", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Extreme palpitations, 'fluttering' in chest, and feeling faint.",
                    "hpi": "Young male collapsed during a crossfit session. He has a known history of Wolff-Parkinson-White (WPW) syndrome but has not had an ablation. Upon arrival, he is pale and speaking in short sentences. The monitor shows a chaotic, wide-complex, very rapid rhythm.",
                    "pmh": ["WPW Syndrome", "Occasional SVT", "Exercise-induced asthma"],
                    "medications": ["Albuterol (PRN)", "None other"]
                },
                "history": [
                    { "time": "1100", "author": "Triage RN", "note": "Client arrived via POV. Reports sudden heart racing. Rate on monitor 220-250 bpm." },
                    { "time": "1110", "author": "RN Smith", "note": "EKG performed. Very irregular, wide-complex rhythm. Patient's BP dropping. MD at bedside." },
                    { "time": "1115", "author": "RN Smith", "note": "Client became unresponsive and pulseless. Defibrillation performed x1." }
                ],
                "vitals": [
                    { "time": "1100", "tempF": "98.4", "hr": 240, "rr": 26, "bp": "104/62", "o2": "94", "o2_device": "RA", "pain": 4 },
                    { "time": "1110", "hr": 260, "bp": "82/40", "o2": "90", "o2_device": "Non-rebreather" },
                    { "time": "1115", "hr": 0, "bp": "0/0" }
                ],
                "labs": [
                    { "test": "Potassium", "value": "4.1", "ref": "3.5 - 5.0", "unit": "mEq/L" },
                    { "test": "Magnesium", "value": "2.0", "ref": "1.7 - 2.2", "unit": "mg/dL" }
                ],
                "radiology": [
                    { "study": "EKG (1110)", "findings": "Irregularly irregular rhythm. QRS complexes are wide and vary in width (morphology). Ventricular rate averages 250 bpm.", "impression": "Atrial Fibrillation with pre-excitation (WPW).", "date": "1110" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The monitor shows Atrial Fibrillation in a client with WPW (Pre-excited AFib). Which nursing actions are strictly CONTRAINDICATED and must be questioned?",
                "options": [
                    { "id": "o1", "text": "Administering Adenosine 6mg rapid IV push", "isCorrect": true, "rationale": "Blocking the AV node in WPW AFib forces all electrical impulses through the accessory pathway, leading to a 1:1 conduction that will cause Ventricular Fibrillation and cardiac arrest." },
                    { "id": "o2", "text": "Administering IV Diltiazem titration", "isCorrect": true, "rationale": "Calcium channel blockers block the AV node, which is contraindicated in pre-excited AFib. It paradoxically increases the ventricular rate." },
                    { "id": "o3", "text": "Administering IV Metoprolol", "isCorrect": true, "rationale": "Beta-blockers block the AV node and are contraindicated in this specific rhythm." },
                    { "id": "o4", "text": "Administering IV Digoxin", "isCorrect": true, "rationale": "Digoxin blocks the AV node AND can shorten the refractory period of the accessory pathway, making it double-dangerous in WPW." },
                    { "id": "o5", "text": "Preparing for Synchronized Cardioversion", "isCorrect": false, "rationale": "This is the preferred and life-saving treatment for unstable WPW with AFib. Do not question this." },
                    { "id": "o6", "text": "Administering IV Procainamide", "isCorrect": false, "rationale": "Procainamide is an antiarrhythmic that slows conduction in the accessory pathway (the target), making it one of the few safe drugs if cardioversion is delayed." }
                ]
            },
            "rationale": {
                "coreConcept": "WPW Contraindications",
                "caseSummary": "Young client with WPW in rapid AFib. This is a medical emergency because the normal AV node 'filter' is bypassed. Use of AV nodal blockers can be fatal.",
                "answerAnalysis": "In WPW with AFib, the heart rate is extremely fast because the accessory pathway (Bundle of Kent) has a shorter refractory period than the AV node. If you block the AV node (o1, o2, o3, o4), the chaos goes entirely through the 'super highway', leading to V-Fib.",
                "trap": "Thinking that because AFib is usually treated with Diltiazem or Metoprolol, those are safe. WPW + AFib = No AV Nodal Blockers.",
                "goldenRule": "Avoid ABCD: Adenosine, Beta-blockers, Calcium channel blockers, Digoxin in WPW + AFib.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify the 'FBI' rhythm: Fast, Broad (Wide), and Irregular." },
                    { "tag": "Refuse", "description": "Strictly refuse any AV nodal blocking agents." }
                ],
                "mnemonic": {
                    "title": "A.B.C.D (NO!)",
                    "content": "A-Adenosine, B-Beta blockers, C-Calcium channel blockers, D-Digoxin",
                    "explanation": "These four classes are contraindicated in pre-excited Atrial Fibrillation."
                },
                "cheatSheet": {
                    "title": "WPW AFib Treatment",
                    "points": [
                        "Unstable: Immediate Cardioversion.",
                        "Stable: Procainamide or Ibutilide.",
                        "AVOID: AV nodal blockers."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Bundle of Kent is an extra piece of heart muscle that connects the atria and ventricles.",
                    "physiology": "Normal conduction stops at the AV node. In WPW, the impulse can bypass the node, creating a delta wave (slurred upstroke of QRS).",
                    "pharm": "Procainamide slows conduction in the accessory pathway, helping to rate control the rhythm safely."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "High Stakes Analysis",
                    "clinicalStrategy": "Identify the contraindications that cause '1:1 conduction' death.",
                    "recommendedActions": ["Prepare for shocking", "Verify WPW history"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-TAKOTSU-S3T4",
        "typeId": "trend",
        "metadata": {
            "title": "Takotsubo (Stress) Cardiomyopathy",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:40:00Z",
            "updatedAt": "2026-01-23T13:40:00Z",
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
            "clinicalFocusTopics": ["Stress Cardiomyopathy", "STEMI Mimickers", "Echocardiography"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "E.T.", "age": 65, "gender": "Female", "allergies": "NKDA", "weightKg": 64, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Cath Lab",
                "historyPhysical": {
                    "chiefComplaint": "Crushing substernal chest pain and shortness of breath.",
                    "hpi": "Client presented to the ED after witnessing her husband collapse with a fatal stroke this morning. She describes her chest pain as a 'tight bands' around her heart. She is extremely emotionally distressed. Initial EKG in the ambulance showed significant ST-elevation in V1-V3.",
                    "pmh": ["Generalized Anxiety Disorder", "Hypertension", "Osteoporosis"],
                    "medications": ["Sertraline 50mg daily", "Amlodipine 5mg daily"]
                },
                "history": [
                    { "time": "0900", "author": "ED RN", "note": "Client distraught. Chest pain 9/10. EKG shows STEMI pattern V1-V3. Aspirin 325mg given. Cath lab activated." },
                    { "time": "1000", "author": "MD Garcia", "note": "Emergency Angiogram performed. Result: Clean coronary arteries. No obstructive disease found. Ventriculogram performed." },
                    { "time": "1100", "author": "ER RN", "note": "Ventriculogram shows 'apical ballooning' and hypercontractile base. EF calculated at 32%. Patient admitted to CCU." }
                ],
                "vitals": [
                    { "time": "0900", "tempF": "98.8", "hr": 112, "rr": 24, "bp": "142/88", "o2": "94", "o2_device": "2L NC", "pain": 9 },
                    { "time": "1000", "tempF": "98.7", "hr": 108, "rr": 20, "bp": "128/76", "o2": "95", "o2_device": "2L NC", "pain": 4 },
                    { "time": "1100", "tempF": "98.6", "hr": 114, "rr": 22, "bp": "98/62", "o2": "93", "o2_device": "2L NC", "pain": 5 }
                ],
                "labs": [
                    { "test": "Troponin I", "value": "0.15", "flag": "H", "ref": "< 0.04", "unit": "ng/mL" },
                    { "test": "BNP", "value": "1200", "flag": "H", "ref": "< 100", "unit": "pg/mL" }
                ],
                "radiology": [
                    { "study": "Left Ventricular Ventriculogram", "findings": "Systolic apical akinesis and ballooning with hypercontractile basal segments.", "impression": "Takotsubo Cardiomyopathy; clean coronary arteries.", "date": "1000" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend from 0900 to 1100. Which characteristics define Takotsubo Cardiomyopathy and distinguish it from a traditional Myocardial Infarction?",
                "options": [
                    { "id": "o1", "text": "Absence of obstructive coronary artery disease on angiogram", "isCorrect": true, "rationale": "Unlike a traditional MI, Takotsubo is non-ischemic; the coronary arteries are clear of blockages." },
                    { "id": "o2", "text": "Classic 'apical ballooning' appearance on ventriculogram", "isCorrect": true, "rationale": "The LV takes on a shape similar to a Japanese octopus trap (Takotsubo) due to apical akinesis." },
                    { "id": "o3", "text": "Presence of a recent intense emotional or physical stressor", "isCorrect": true, "rationale": "Commonly triggered by 'bad' stress (grief) or 'good' stress (winning lottery)." },
                    { "id": "o4", "text": "Elevated Troponin levels (0.15 ng/mL)", "isCorrect": false, "rationale": "Troponin is elevated in BOTH Takotsubo and MI; it does not help distinguish the two." },
                    { "id": "o5", "text": "Rapid recovery of left ventricular function (within weeks)", "isCorrect": true, "rationale": "Unlike the permanent damage of an MI, Takotsubo is typically reversible after the catecholamine surge subsides." },
                    { "id": "o6", "text": "ST-segment elevation on EKG", "isCorrect": false, "rationale": "Both can present with ST elevation; it is a mimicker, not a distinguishing characteristic." }
                ]
            },
            "rationale": {
                "coreConcept": "Takotsubo Cardiomyopathy",
                "caseSummary": "Post-menopausal female with massive grief stressor. Presents like an MI with ST elevation and pain, but has clear coronaries and the 'octopus trap' heart shape.",
                "answerAnalysis": "The keys to Takotsubo are CLEAR coronaries (o1), apical ballooning (o2), stressful trigger (o3), and its REVERSIBLE nature (o5). It is often called 'Broken Heart Syndrome'.",
                "trap": "Thinking that because Troponin is 'high', it must be an MI. High Troponin just means 'heart muscle stress/injury', not necessarily a blockage.",
                "goldenRule": "Any 'STEMI' in a post-menopausal woman following a major emotional stressor should have Takotsubo on the differential, even before the cath lab.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify the high-stress trigger (husband's death)." },
                    { "tag": "Compare", "description": "Note the clean coronary results vs the abnormal LV shape." }
                ],
                "mnemonic": {
                    "title": "TRAP",
                    "content": "T-Trigger (Stress), R-Regional wall motion abnormality (Apex), A-Angio (Clear), P-Post-menopausal common",
                    "explanation": "Summarizes the Takotsubo trap for clinicians."
                },
                "cheatSheet": {
                    "title": "Broken Heart Syndrome",
                    "points": [
                        "Mimics STEMI on EKG.",
                        "Caused by 'Catecholamine Surge' stunning the myocardium.",
                        "Managed like HF (Beta blockers, ACEi) until EF recovers."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The apex of the heart is the bottom tip of the left ventricle.",
                    "physiology": "Excess adrenaline causes microvascular spasm or direct toxic effects on heart cells, especially at the apex where nerve endings are dense.",
                    "pharm": "ACE inhibitors and Beta blockers are used to support the heart during the 2-4 week recovery phase."
                },
                "difficulty": {
                    "score": 90,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Search for the 'discrepancy' between the EKG/Pain and the Angiogram results.",
                    "recommendedActions": ["Counsel on stress management", "Ensure cardiology follow-up for EF recovery info"]
                }
            }
        }
    }
];
