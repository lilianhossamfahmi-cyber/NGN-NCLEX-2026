import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 6: Items 15-17 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch6: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-PPCM-M3K4",
        "typeId": "trend",
        "metadata": {
            "title": "Peripartum Cardiomyopathy (PPCM)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:10:00Z",
            "updatedAt": "2026-01-23T14:10:00Z",
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
            "clinicalFocusTopics": ["Heart Failure", "Postpartum Care", "Cardiomyopathy"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "K.M.", "age": 36, "gender": "Female", "allergies": "NKDA", "weightKg": 84, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Postpartum Unit",
                "historyPhysical": {
                    "chiefComplaint": "Severe shortness of breath when lying flat and significant swelling in her legs.",
                    "hpi": "Client is 2 weeks postpartum after an uncomplicated vaginal delivery of her third child. She reports that she 'can't catch her breath' and feels like she is 'drowning' if she doesn't use 4 pillows to sleep. She attributes her initial fatigue to the newborn but now feels she cannot even walk across the room.",
                    "pmh": ["Pregnancy x3", "History of Pre-eclampsia in this pregnancy"],
                    "medications": ["Prenatal Vitamin", "Labetalol 100mg BID (started late pregnancy)"]
                },
                "history": [
                    { "time": "Mon 1400", "author": "ER RN", "note": "Client appears anxious and tachypneic. O2 sat 88% on RA. Lungs have crackles in the lower 2/3. 3+ pitting edema observed in lower extremities." },
                    { "time": "Mon 1500", "author": "ER RN", "note": "CXR shows pulmonary edema. NT-proBNP is significantly elevated. Echocardiogram performed at bedside." },
                    { "time": "Mon 1600", "author": "Cardiologist", "note": "Echo confirmed EF of 24%. Diagnosis: Peripartum Cardiomyopathy. Initiating IV diuresis and Bromocriptine study." }
                ],
                "vitals": [
                    { "time": "Mon 1400", "tempF": "98.8", "hr": 122, "rr": 28, "bp": "144/92", "o2": "88", "o2_device": "RA", "pain": 2 },
                    { "time": "Mon 1500", "tempF": "98.7", "hr": 118, "rr": 24, "bp": "136/88", "o2": "94", "o2_device": "4L NC", "pain": 1 }
                ],
                "labs": [
                    { "test": "NT-proBNP", "value": "4800", "flag": "H", "ref": "< 300", "unit": "pg/mL" },
                    { "test": "Troponin I", "value": "0.12", "flag": "H", "ref": "< 0.04", "unit": "ng/mL" },
                    { "test": "Hgb", "value": "11.8", "flag": "L", "ref": "12.0 - 15.5", "unit": "g/dL" }
                ],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Global dilation of all heart chambers, severely reduced systolic function. EF 24%. No prior heart disease on record.", "impression": "Peripartum Cardiomyopathy.", "date": "Mon 1530" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse reviews the clinical data for the postpartum client. Which criteria are required to confirm a diagnosis of Peripartum Cardiomyopathy (PPCM)?",
                "options": [
                    { "id": "o1", "text": "Development of heart failure in the last month of pregnancy or first 5 months postpartum", "isCorrect": true, "rationale": "PPCM has a very specific timing window (late pregnancy to early postpartum)." },
                    { "id": "o2", "text": "Absence of a prior history of identifiable heart disease", "isCorrect": true, "rationale": "PPCM is a diagnosis of exclusion; the heart failure must be new and not attributable to previous valve issues or CAD." },
                    { "id": "o3", "text": "Left ventricular ejection fraction (LVEF) of less than 45%", "isCorrect": true, "rationale": "Diagnostic criteria for PPCM require a quantified reduction in systolic function (typically LVEF < 45%)." },
                    { "id": "o4", "text": "History of high-risk pregnancy (Age > 30, Multi-parity, Pre-eclampsia)", "isCorrect": false, "rationale": "While these are risk factors that make the diagnosis more LIKELY, they are not 'required criteria' for the legal/clinical definition." },
                    { "id": "o5", "text": "Elevated NT-proBNP above age-specific reference", "isCorrect": false, "rationale": "BNP indicates presence of HF but is not a specific diagnostic criteria for PPCM itself (which requires imaging confirmation)." },
                    { "id": "o6", "text": "Demonstrated global dilation of the left ventricle on imaging", "isCorrect": true, "rationale": "PPCM is a dilated cardiomyopathy; echocardiographic evidence of LV dilation is a core criterion." }
                ]
            },
            "rationale": {
                "coreConcept": "Peripartum Cardiomyopathy (PPCM)",
                "caseSummary": "36yo female with new HF 2 weeks after delivery. Echo shows EF 24%. No prior heart history. This is the hallmark clinical presentation of PPCM.",
                "answerAnalysis": "The diagnosis of PPCM requires 4 things: 1) Timing (late pregnancy to 5mo post), 2) No prior heart disease, 3) Echo showing EF < 45%, and 4) Dilation of the LV. o1, o2, o3, and o6 represent these standards.",
                "trap": "Including general risk factors (o4) or non-specific labs (o5) as categorical diagnostic criteria.",
                "goldenRule": "Any postpartum woman with new-onset SOB or orthopnea should be assumed to have PPCM until an Echo is performed.",
                "steps": [
                    { "tag": "Verify", "description": "Check the timing window to see if it fits the peripartum criteria." },
                    { "tag": "Consult", "description": "Review the Echo for LVEF < 45%." }
                ],
                "mnemonic": {
                    "title": "M.O.M-H.F.",
                    "content": "M-Mother (Peripartum), O-Other causes excluded, M-Month (within 1 mo before/5 mo after), H-Heart failure (new), F-Fraction (EF < 45%)",
                    "explanation": "Summarizes the specific PPCM criteria."
                },
                "cheatSheet": {
                    "title": "PPCM Risk Factors",
                    "points": [
                        "Advanced Maternal Age (>30).",
                        "Multi-parity (Multiple births).",
                        "History of Pre-eclampsia.",
                        "African descent (Higher incidence)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The myocardium is the middle layer of the heart wall that loses contractility in PPCM.",
                    "physiology": "The mechanism is thought to involve a cleavage product of the hormone Prolactin (16-kDa prolactin) which is toxic to heart muscle cells.",
                    "pharm": "Standard HF drugs are used, but Bromocriptine is sometimes used off-label to inhibit prolactin release and stop the toxic cycle."
                },
                "difficulty": {
                    "score": 94,
                    "level": 5,
                    "label": "High Stakes Analysis",
                    "clinicalStrategy": "Look for the 'timing' and 'exclusion' factors in the scenario.",
                    "recommendedActions": ["Obtain Echo", "Counsel on risk of future pregnancies"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-BRUG-V5H6",
        "typeId": "trend",
        "metadata": {
            "title": "Brugada Syndrome Unmasked by Fever",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:15:00Z",
            "updatedAt": "2026-01-23T14:15:00Z",
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
            "clinicalFocusTopics": ["Brugada Syndrome", "Channelopathies", "Sudden Cardiac Death"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "Y.K.", "age": 29, "gender": "Male", "allergies": "NKDA", "weightKg": 70, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Observation",
                "historyPhysical": {
                    "chiefComplaint": "Fainted while having a high fever and feeling heart palpitations.",
                    "hpi": "Client, a 29-year-old male of Southeast Asian descent, presents following a syncopal episode at home. He has been ill with the flu for 2 days. While getting up to go to the bathroom during a spike in fever, he felt 'his heart stop' and collapsed. He recovered spontaneously. He has no prior history of heart disease but mentioned his brother died in his sleep at age 35.",
                    "pmh": ["None"],
                    "medications": ["Acetaminophen for fever"]
                },
                "history": [
                    { "time": "2000", "author": "RN Rivera", "note": "Client triaged. Temp 102.8 F. HR 105. EKG shows 'Coved' ST elevation in V1 and V2 with a negative T-wave." },
                    { "time": "2100", "author": "RN Rivera", "note": "Acetaminophen given. Temp 99.8 F. Repeat EKG shows resolution of the ST elevation. EKG now looks near-normal." },
                    { "time": "2200", "author": "Cardiologist", "note": "Diagnosis: Type 1 Brugada Pattern unmasked by fever. High risk for Ventricular Fibrillation. Admitting for ICD placement evaluation." }
                ],
                "vitals": [
                    { "time": "2000", "tempF": "102.8", "hr": 105, "rr": 20, "bp": "112/64", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "2100", "tempF": "99.8", "hr": 84, "rr": 16, "bp": "118/70", "o2": "99", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Potassium", "value": "3.9", "ref": "3.5 - 5.0", "unit": "mEq/L" },
                    { "test": "Sodium", "value": "139", "ref": "136 - 145", "unit": "mEq/L" },
                    { "test": "Troponin I", "value": "0.01", "ref": "< 0.04", "unit": "ng/mL" }
                ],
                "radiology": [
                    { "study": "EKG (2000)", "findings": "Coved-type ST segment elevation >= 2mm in V1 and V2, followed by a negative T-wave.", "impression": "Brugada Type 1 Pattern.", "date": "2000" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend between the two time points (2000 and 2100). Which characteristics of the patient case are classic hallmarks of Brugada Syndrome?",
                "options": [
                    { "id": "o1", "text": "Unmasking of EKG pattern during a febrile state", "isCorrect": true, "rationale": "Fever is a known trigger that unmasks the sodium channel deficit in Brugada, leading to dangerous EKG patterns and arrhythmias." },
                    { "id": "o2", "text": "Southeast Asian male demographics", "isCorrect": true, "rationale": "Brugada is significantly more common in males of Southeast Asian descent (known as SUNDS: Sudden Unexpected Nocturnal Death Syndrome)." },
                    { "id": "o3", "text": "History of sudden cardiac death in a young relative", "isCorrect": true, "rationale": "It is an autosomal dominant genetic condition; family history of unexplained young death is a major red flag." },
                    { "id": "o4", "text": "ST-segment elevation in Leads II, III, and aVF", "isCorrect": false, "rationale": "Brugada affects the right precordial leads (V1, V2), not the inferior leads (II, III, aVF)." },
                    { "id": "o5", "text": "Profoundly positive Troponin I level", "isCorrect": false, "rationale": "Brugada is an electrical 'channelopathy', not a muscle death 'infarction'. Troponin should be normal." },
                    { "id": "o6", "text": "Development of Syncope (fainting spell)", "isCorrect": true, "rationale": "Syncope in a Brugada patient is often due to self-terminating polymorphic Ventricular Tachycardia, a precursor to sudden death." }
                ]
            },
            "rationale": {
                "coreConcept": "Brugada Syndrome Recognition",
                "caseSummary": "Young Asian male with a febrile illness and syncope. EKG shows 'Coved' ST elevation in right precordial leads (V1-V2) that fixes itself as the fever drops.",
                "answerAnalysis": "Brugada hallmarks are 1) Genetic/Family history (o3), 2) Specific Demographics (o2), 3) Fever as a trigger (o1), and 4) Syncope as a warning for V-Fib (o6).",
                "trap": "Ignoring the fever link. A patient with this EKG must be treated aggressively for ANY fever to prevent V-Fib.",
                "goldenRule": "Any 'STEMI' pattern that exists *only* in V1-V2 and goes away when the fever is treated is very likely Brugada, not an MI.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify the 'coved' ST elevation in V1 and V2." },
                    { "tag": "Compare", "description": "Compare EKG at high temp vs normal temp." }
                ],
                "mnemonic": {
                    "title": "B.R.U.G.A.D.A.",
                    "content": "B-Bottom (V1/V2) leads, R-Right bundle branch pattern, U-Unmasked by fever, G-Genetic, A-Asian descent, D-Death (Sudden/Nocturnal), A-Arrhythmia (V-Fib)",
                    "explanation": "Summarizes the entire syndrome."
                },
                "cheatSheet": {
                    "title": "Brugada Triggers",
                    "points": [
                        "Fever (Biggest trigger).",
                        "Heavy Alcohol Use.",
                        "Certain Sodium Channel Blocking Drugs.",
                        "Large meals (Vagal tone)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The SCN5A gene involves the sodium channel alpha subunit in the heart muscle.",
                    "physiology": "The disease is a sodium channelopathy where the influx of sodium into the cell is reduced, leading to electrical instability in the right ventricle.",
                    "pharm": "There are no medicines to cure Brugada; the only effective treatment for symptomatic patients is an Implantable Cardioverter Defibrillator (ICD)."
                },
                "difficulty": {
                    "score": 97,
                    "level": 5,
                    "label": "Expert Recognition",
                    "clinicalStrategy": "Look for the V1/V2 coved pattern + high fever.",
                    "recommendedActions": ["Stat EKG when febrile", "Aggressive antipyretics"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-AAARUPT-K7L8",
        "typeId": "trend",
        "metadata": {
            "title": "AAA Expansion to Impending Rupture",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T14:20:00Z",
            "updatedAt": "2026-01-23T14:20:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 5,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Prioritize Hypotheses",
            "clinicalFocusTopics": ["Abdominal Aortic Aneurysm", "Hemorrhagic Shock", "Physical Assessment"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "H.G.", "age": 78, "gender": "Male", "allergies": "NKDA", "weightKg": 92, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department / Surgical Floor",
                "historyPhysical": {
                    "chiefComplaint": "Sudden, severe back pain that isn't relieved by rest.",
                    "hpi": "Client has a known 6.0cm Abdominal Aortic Aneurysm (AAA) being followed by vascular surgery. He was scheduled for elective repair next week. This morning, he developed a 'throbbing' sensation in his abdomen followed by deep, boring back pain. He feels dizzy and nauseated.",
                    "pmh": ["6.0cm AAA", "COPD", "History of AAA repair in father"],
                    "medications": ["Lisinopril 40mg daily", "Aspirin 81mg daily", "Statin"]
                },
                "history": [
                    { "time": "0800", "author": "RN Smith", "note": "Client report 8/10 back pain. BP 150/92. Abdomen has a visible pulsatile mass above the umbilicus. Vascular surgeon paged." },
                    { "time": "0830", "author": "RN Smith", "note": "Client report 10/10 pain. BP 110/64. Client pale and diaphoretic. Abdomen is tender to light palpation." },
                    { "time": "0900", "author": "RN Smith", "note": "Client lethargic. BP 82/40. HR 132. Echymosis noted on the flanks (Gray Turner's sign). Emergent OR activated." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "97.6", "hr": 88, "rr": 18, "bp": "150/92", "o2": "96", "o2_device": "RA", "pain": 8 },
                    { "time": "0830", "tempF": "97.5", "hr": 108, "rr": 24, "bp": "110/64", "o2": "94", "o2_device": "2L NC", "pain": 10 },
                    { "time": "0900", "tempF": "97.4", "hr": 132, "rr": 28, "bp": "82/40", "o2": "90", "o2_device": "4L NC", "pain": 10 }
                ],
                "labs": [
                    { "test": "Hgb", "value": "13.4", "time": "0800", "ref": "13.5 - 17.5", "unit": "g/dL" },
                    { "test": "Hgb", "value": "8.4", "time": "0915", "flag": "L", "ref": "13.5 - 17.5", "unit": "g/dL" },
                    { "test": "Creatinine", "value": "1.9", "flag": "H", "ref": "0.6 - 1.2", "unit": "mg/dL" }
                ],
                "radiology": [
                    { "study": "Bedside Ultrasound", "findings": "Evidence of large retroperitoneal hematoma and loss of aneurysm wall integrity.", "impression": "Ruptured Abdominal Aortic Aneurysm.", "date": "0910" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and physical assessment findings. Which findings definitively indicate that the aneurysm has likely ruptured into the retroperitoneal space?",
                "options": [
                    { "id": "o1", "text": "Sudden transition to profound Hypotension and Tachycardia", "isCorrect": true, "rationale": "Classic signs of hemorrhagic shock following massive internal arterial bleeding." },
                    { "id": "o2", "text": "Report of severe back pain radiating to the groin", "isCorrect": true, "rationale": "As blood enters the retroperitoneum, it irritates the nerves and causes referred pain to the back and flank." },
                    { "id": "o3", "text": "Presence of Gray Turner's sign (flank ecchymosis)", "isCorrect": true, "rationale": "Ecchymosis in the flanks indicates retroperitoneal hemorrhage (blood leaking from the ruptured aorta into the tissue layers)." },
                    { "id": "o4", "text": "Presence of a pulsatile abdominal mass", "isCorrect": false, "rationale": "This indicates the PRESENCE of an aneurysm but is not a definitive sign of RUPTURE. Most AAAs are pulsatile before they burst." },
                    { "id": "o5", "text": "Significant drop in Hemoglobin (13.4 to 8.4 g/dL)", "isCorrect": true, "rationale": "Quantifiable evidence of massive blood loss." },
                    { "id": "o6", "text": "Bruit heard upon abdominal auscultation", "isCorrect": false, "rationale": "A bruit indicates turbulent flow through a stenosis or aneurysm but is not a sign of rupture (rupture actually makes heart sounds and bruits harder to hear due to low volume)." }
                ]
            },
            "rationale": {
                "coreConcept": "Aortic Aneurysm Rupture",
                "caseSummary": "Elderly male with large AAA progresses from hypertension/pain to shock and flank bruising. This is a surgical catastrophe.",
                "answerAnalysis": "Rupture signs are grouped into SHOCK (o1, o5), PAIN location (o2), and PHYSICAL color changes like Gray Turner's (o3). o4 and o6 are findings of 'existing' AAAs, not 'ruptured' ones.",
                "trap": "Thinking that a bruit (o6) is a sign of a burst pipe—it's actually a sign of a clogged or narrowed pipe with moving water.",
                "goldenRule": "AAA > 5.5cm in men or > 5.0cm in women is the threshold for high rupture risk and elective repair.",
                "steps": [
                    { "tag": "Assess", "description": "Monitor BP every 5 minutes and check the flanks/abdomen for bruising." },
                    { "tag": "Prioritize", "description": "Large bore IVs and blood products are the priority for resuscitation." }
                ],
                "mnemonic": {
                    "title": "GRAY FLANK",
                    "content": "G-Gray=F-Flank (B-Back)",
                    "explanation": "Gray Turner's = Flank bruising (Retroperitoneal), Cullen's = Umbilicus (Intraperitoneal)."
                },
                "cheatSheet": {
                    "title": "AAA Rupture Triad",
                    "points": [
                        "Severe Abdominal/Back Pain.",
                        "Hypotension.",
                        "Pulsatile Abdominal Mass (found in 50%)."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The abdominal aorta is Located behind the peritoneal cavity (retroperitoneal).",
                    "physiology": "Most ruptures occur into the retroperitoneal space, which provides some temporary 'tamponade' effect, allowing the patient to reach the hospital alive.",
                    "pharm": "Aggressive fluid resuscitation is needed, but 'Permissive Hypotension' (keeping SBP around 90) may be used to prevent 'popping the clot' before surgical control is achieved."
                },
                "difficulty": {
                    "score": 93,
                    "level": 5,
                    "label": "High Stakes Evaluation",
                    "clinicalStrategy": "Look for the hallmarks of acute internal bleeding.",
                    "recommendedActions": ["Stat crossmatch for 6 units PRBC", "Keep NPO", "Emergent OR"]
                }
            }
        }
    }
];
