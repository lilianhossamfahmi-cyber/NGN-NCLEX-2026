import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * FINAL HIGH-QUALITY REGENERATION (Batch 1: Items 1-2 of 20)
 * Standards: 3-Point Trends, Full Reference Ranges, Extensive Case Study Detail, 6 Options SATA
 */

export const CardiologyItems_Final_Batch1: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-SHOCK-A1B2",
        "typeId": "trend",
        "metadata": {
            "title": "Clinical Progression: Anterior wall MI to Cardiogenic Shock",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:00:00Z",
            "updatedAt": "2026-01-23T13:00:00Z",
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
            "clinicalFocusTopics": ["Myocardial Infarction", "Shock", "Hemodynamics"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.S.",
                    "age": 68,
                    "gender": "Male",
                    "allergies": "Aspirin (Hives)",
                    "weightKg": 94,
                    "codeStatus": "Full Code"
                },
                "setting": "Cardiovascular Intensive Care Unit (CVICU)",
                "historyPhysical": {
                    "chiefComplaint": "Crushing chest pain and worsening shortness of breath.",
                    "hpi": "Client presented to the ED 6 hours ago with ST-elevation in V1-V4. Emergency percutaneous coronary intervention (PCI) was performed with placement of 2 drug-eluting stents in the Proximal Left Anterior Descending (LAD) artery. Post-procedure, the client was transferred to the CVICU for monitoring. Over the last 4 hours, the client has developed increasing respiratory distress and cold, clammy skin despite stable initial post-op recovery.",
                    "pmh": ["Type 2 Diabetes Mellitus", "Hypertension", "Hyperlipidemia", "Tobacco use (30 pack-years)"],
                    "medications": ["Clopidogrel 75mg daily", "Atorvastatin 80mg daily", "Lisinopril 10mg daily", "Metformin 500mg BID", "Heparin Infusion (titrating)"]
                },
                "history": [
                    { "time": "0800", "author": "M. RN", "note": "Client alert and oriented. Pain 0/10. Bibasilar crackles noted. Urine output 45mL/hr." },
                    { "time": "1000", "author": "M. RN", "note": "Client report mild dyspnea. Increased crackles to mid-lung fields. Skin cool to touch. Urine output 20mL/hr." },
                    { "time": "1200", "author": "M. RN", "note": "Client lethargic, difficult to arouse. Profuse diaphoresis. Extremities mottled and cold. S3 gallop heard on auscultation. Nurse practitioner notified." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 88, "rr": 20, "bp": "124/78", "o2": "95", "o2_device": "2L NC", "pain": 0 },
                    { "time": "1000", "tempF": "98.6", "hr": 104, "rr": 26, "bp": "102/72", "o2": "91", "o2_device": "4L NC", "pain": 2 },
                    { "time": "1200", "tempF": "98.2", "hr": 122, "bp": "84/52", "o2": "88", "o2_device": "Non-rebreather", "pain": 0 }
                ],
                "labs": [
                    { "test": "BNP", "value": "1850", "flag": "H", "ref": "< 100", "unit": "pg/mL" },
                    { "test": "Lactate", "value": "4.2", "flag": "H", "ref": "0.5 - 2.2", "unit": "mmol/L" },
                    { "test": "Cardiac Index", "value": "1.8", "flag": "L", "ref": "2.5 - 4.0", "unit": "L/min/m2" },
                    { "test": "PCWP", "value": "24", "flag": "H", "ref": "6 - 12", "unit": "mmHg" }
                ],
                "orders": [
                    { "order": "Norepinephrine titration", "status": "Active", "indication": "Hypotension" },
                    { "order": "Dobutamine infusion", "status": "Pending", "indication": "Inotropic support" }
                ],
                "radiology": [
                    { "study": "Chest X-ray", "findings": "Diffuse pulmonary edema, prominent pulmonary vasculature, enlarged cardiac silhouette.", "impression": "Acute Congestive Heart Failure; Cardiogenic Shock transition.", "date": "1100" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "The nurse analyzes the client's clinical progression from 0800 to 1200. Which findings provide definitive evidence that the client is experiencing pump failure (Cardiogenic Shock) rather than simple hypovolemia?",
                "options": [
                    { "id": "o1", "text": "Elevated Pulmonary Capillary Wedge Pressure (PCWP) of 24 mmHg", "isCorrect": true, "rationale": "High PCWP indicates high left ventricular end-diastolic pressure (fluid backup), which differentiates cardiogenic shock ('wet') from hypovolemic shock ('dry'/'low PCWP')." },
                    { "id": "o2", "text": "Decrease in blood pressure (124/78 to 84/52)", "isCorrect": false, "rationale": "Hypotension occurs in all forms of shock and is not specific to pump failure." },
                    { "id": "o3", "text": "Low Cardiac Index (1.8 L/min/m2)", "isCorrect": true, "rationale": "A low cardiac index in the presence of high filling pressures (PCWP) is diagnostic of cardiogenic shock." },
                    { "id": "o4", "text": "Presence of S3 gallop and mid-lung crackles", "isCorrect": true, "rationale": "These are clinical indicators of volume overload and left ventricular failure, common in cardiogenic shock but absent in hypovolemia." },
                    { "id": "o5", "text": "Elevated serum lactate (4.2 mmol/L)", "isCorrect": false, "rationale": "Lactate elevation indicates tissue hypoperfusion/anaerobic metabolism common to all shock states, not specifically pump failure." },
                    { "id": "o6", "text": "Progressive tachycardia (88 to 122 bpm)", "isCorrect": false, "rationale": "Tachycardia is a general compensatory response to falling cardiac output in both hypovolemic and cardiogenic shock." }
                ]
            },
            "rationale": {
                "coreConcept": "Differential Diagnosis of Shock",
                "caseSummary": "Client post-MI with LAD stents is deteriorating with clear signs of pump failure (S3 gallop, crackles) and high filling pressures (PCWP 24). This is Cardiogenic Shock.",
                "answerAnalysis": "Cardiogenic shock is characterized by the triad of hypotension, low cardiac output (CI < 2.2), and HIGH filling pressures (PCWP > 18). Hypovolemic shock would show LOW PCWP. S3 and crackles confirm the 'wet' nature of pump failure.",
                "trap": "Choosing signs of general hypoperfusion (hypotension, lactate, tachycardia) which do not distinguish the 'type' of shock.",
                "goldenRule": "Cardiogenic shock is 'Wet and Cold' (High PCWP, low CI). Hypovolemic is 'Dry and Cold' (Low PCWP, low CI). Septic is 'Wet and Hot' (Low SVR, high CI initially).",
                "steps": [
                    { "tag": "Recognize", "description": "Identify that BP is falling while respiratory distress increases (crackles/S3)." },
                    { "tag": "Analyze", "description": "Compare filling pressures (PCWP) to cardiac output (Index). High pressure + Low output = Pump failure." }
                ],
                "mnemonic": {
                    "title": "PUMP",
                    "content": "P-PCWP High (>18), U-Urine Out Low, M-Mottled/Cold skin, P-Pressure (BP) Low",
                    "explanation": "Signs of cardiogenic pump failure."
                },
                "cheatSheet": {
                    "title": "Shock Hemodynamics",
                    "points": [
                        "Cardiogenic: PCWP ↑, SVR ↑, CI ↓",
                        "Hypovolemic: PCWP ↓, SVR ↑, CI ↓",
                        "Distributive (Sepsis): PCWP ↓, SVR ↓, CI ↑"
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Left Anterior Descending (LAD) artery, often called the 'widowmaker', supplies the anterior wall of the left ventricle.",
                    "physiology": "Massive Myocardial Infarction leads to loss of contractile tissue. When >40% of the LV is damaged, the heart cannot maintain minimal cardiac output, leading to backward failure (pulmonary edema) and forward failure (systemic shock).",
                    "pharm": "Dobutamine is a positive inotrope that increases contractility (Beta-1) with some peripheral vasodilation (Beta-2) to reduce afterload, which is ideal for cardiogenic shock."
                },
                "difficulty": {
                    "score": 95,
                    "level": 5,
                    "label": "Expert Analysis",
                    "clinicalStrategy": "Focus on the differentiating factors between shock types.",
                    "recommendedActions": ["Check PCWP first", "Assess heart sounds"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-VALVE-C3D4",
        "typeId": "trend",
        "metadata": {
            "title": "Aortic Stenosis Progression (The SAD Triad)",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T13:00:01Z",
            "updatedAt": "2026-01-23T13:00:01Z",
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
            "clinicalFocusTopics": ["Valvular Heart Disease", "Aortic Stenosis", "Cardiac Output"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "M.B.",
                    "age": 82,
                    "gender": "Female",
                    "allergies": "NKDA",
                    "weightKg": 62,
                    "codeStatus": "Full Code"
                },
                "setting": "Outpatient Clinic; transitioning to Emergency Room",
                "historyPhysical": {
                    "chiefComplaint": "Increase in fainting spells and chest pain during walking.",
                    "hpi": "Client has a 20-year history of a heart murmur. Over the last 6 months, she has noticed increasing fatigue. 2 months ago, she developed shortness of breath while gardening (Exertional Dyspnea). 2 weeks ago, she experienced chest pain while walking to the mailbox (Angina). This morning, she fainted while standing up from the breakfast table (Syncope).",
                    "pmh": ["Rheumatic Fever (age 8)", "Bicuspid Aortic Valve", "Osteoarthritis"],
                    "medications": ["Naproxen (PRN)", "Vitamin D", "Multivitamin"]
                },
                "history": [
                    { "time": "6 Mo Ago", "author": "NP Green", "note": "Client reports fatigue. 2/6 systolic murmur heard at right upper sternal border." },
                    { "time": "2 Mo Ago", "author": "NP Green", "note": "Client reports dyspnea on exertion. Murmur now 3/6, harsh, radiating to carotids. Echo ordered." },
                    { "time": "Today", "author": "ER RN", "note": "Client status post-syncopal episode. Murmur 4/6, late-peaking. Pulse is 'parvus et tardus' (weak and slow)." }
                ],
                "vitals": [
                    { "time": "6 Mo Ago", "tempF": "98.6", "hr": 72, "rr": 16, "bp": "138/84", "o2": "98", "o2_device": "RA", "pain": 0 },
                    { "time": "2 Mo Ago", "tempF": "98.4", "hr": 78, "rr": 20, "bp": "122/78", "o2": "96", "o2_device": "RA", "pain": 2 },
                    { "time": "Today", "tempF": "98.3", "hr": 84, "rr": 24, "bp": "94/80", "o2": "93", "o2_device": "RA", "pain": 4 }
                ],
                "labs": [
                    { "test": "Aortic Valve Area", "value": "0.7", "flag": "L", "ref": "2.5 - 4.0", "unit": "cm2" },
                    { "test": "Mean Pressure Gradient", "value": "45", "flag": "H", "ref": "< 10", "unit": "mmHg" }
                ],
                "orders": [
                    { "order": "NPO for possible TAVR", "status": "Active", "indication": "Severe Symptomatic AS" }
                ],
                "radiology": [
                    { "study": "Echocardiogram", "findings": "Heavy calcification of the aortic valve leaflets, severely restricted opening, left ventricular hypertrophy.", "impression": "Severe Aortic Stenosis.", "date": "Today" }
                ]
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Review the client's clinical trajectory over the last 6 months. Which findings represent the 'SAD' triad of symptomatic aortic stenosis, indicating poor prognosis without surgical intervention?",
                "options": [
                    { "id": "o1", "text": "Syncope (reported today)", "isCorrect": true, "rationale": "S in SAD stands for Syncope. It occurs when the fixed cardiac output cannot meet demand during exertion or position change." },
                    { "id": "o2", "text": "Angina (reported 2 weeks ago)", "isCorrect": true, "rationale": "A in SAD stands for Angina. Occurs due to increased myocardial oxygen demand from hypertrophy and reduced supply from low post-stenotic pressure." },
                    { "id": "o3", "text": "Dyspnea on Exertion (reported 2 months ago)", "isCorrect": true, "rationale": "D in SAD stands for Dyspnea. Indicates left heart failure as the heart can no longer compensate for the pressure load." },
                    { "id": "o4", "text": "Narrowing Pulse Pressure (54 -> 44 -> 14 mmHg)", "isCorrect": true, "rationale": "A hallmark of severe AS where the systolic pressure drops due to the obstruction while diastolic remains relatively stable." },
                    { "id": "o5", "text": "Weak and slow pulse (Pulsus Parvus et Tardus)", "isCorrect": false, "rationale": "While a classic finding in AS, it is not part of the 'SAD' mnemonic triad which refers to symptoms (Syncope, Angina, Dyspnea)." },
                    { "id": "o6", "text": "Harsh systolic murmur radiatng to carotids", "isCorrect": false, "rationale": "This is a physical finding of the pathology, not a symptomatic indicator of the 'SAD' triad prognosis." }
                ]
            },
            "rationale": {
                "coreConcept": "Symptomatic Aortic Stenosis (SAD Triad)",
                "caseSummary": "82yo female with progressive AS. Trend shows deteriorating BP/Pulse Pressure and the classic symptom progression: Dyspnea -> Angina -> Syncope.",
                "answerAnalysis": "The 'SAD' triad includes Syncope, Angina, and Dyspnea. Once these symptoms appear, the mortality rate increases drastically (2-5 years survival without valve replacement). Narrow pulse pressure is a quantitative trend that supports the diagnostic severity.",
                "trap": "Including physical exam findings (murmur, parvus et tardus) in the 'symptom' triad.",
                "goldenRule": "As soon as an Aortic Stenosis patient becomes symptomatic (SAD), they are a high-priority surgical candidate.",
                "steps": [
                    { "tag": "Recognize", "description": "Identify the symptoms reported: SOB, Chest Pain, and Fainting." },
                    { "tag": "Analyze", "description": "Link the symptoms to the mnemonic 'SAD' (Syncope/Angina/Dyspnea)." }
                ],
                "mnemonic": {
                    "title": "S.A.D",
                    "content": "S-Syncope, A-Angina, D-Dyspnea",
                    "explanation": "The order of symptom appearance in aortic stenosis often predicts the risk of sudden cardiac death."
                },
                "cheatSheet": {
                    "title": "AS Severity",
                    "points": [
                        "Valve Area < 1.0 cm2 = Severe",
                        "Mean Gradient > 40 mmHg = Severe",
                        "Pulse Pressure: SBP and DBP get closer together."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The aortic valve is the exit door from the left ventricle into the aorta.",
                    "physiology": "Stenosis increases 'afterload.' The heart has to pump much harder against a tiny opening, leading to hypertrophy and eventually failure.",
                    "pharm": "AVOID Nitroglycerin if possible in severe AS, as it can cause profound hypotension by reducing preload to a heart that is already struggling to fill and eject."
                },
                "difficulty": {
                    "score": 92,
                    "level": 5,
                    "label": "Analysis",
                    "clinicalStrategy": "Connect the timeline of symptoms to the physiologic progression.",
                    "recommendedActions": ["Monitor for sudden BP drop", "Teach NPO status for TAVR"]
                }
            }
        }
    }
];
