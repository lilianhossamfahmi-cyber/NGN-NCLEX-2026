import { MasterQuestionItem } from '../../../src/types/master-schema';

/**
 * HIGH-FIDELITY CARDIOLOGY (Batch 4: Items 24-31)
 * Focus: Pacemakers, AICDs, Stroke/Embolism risk, Heart Block
 */

export const CardiologyItems_Final_Batch4: MasterQuestionItem[] = [
    {
        "id": "CARDIOLOGY-TRD-PACE-G4H5",
        "typeId": "trend",
        "metadata": {
            "title": "Pacemaker Malfunction & Failure to Sense",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:50:00Z",
            "updatedAt": "2026-01-23T18:50:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 98,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Pacemakers", "Arrhythmias", "EKG Analysis"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "H.L.", "age": 72, "gender": "Male", "allergies": "NKDA", "weightKg": 82, "codeStatus": "Full Code"
                },
                "setting": "Telemetry Unit",
                "historyPhysical": {
                    "chiefComplaint": "Dizziness and palpitations.",
                    "hpi": "Client has a permanent dual-chamber pacemaker (DDD) for high-grade AV block. He reports 'skipped beats' and feeling lightheaded. EKG strip shows pacemaker spikes occurring randomly, including during the patient's own QRS complexes (R-on-T risk).",
                    "pmh": ["AV Block", "Hypertension"],
                    "medications": ["Atenolol", "Lisinopril"]
                },
                "history": [
                    { "time": "0800", "author": "RN Rivera", "note": "Client reports feeling 'fluttering' in chest. Pulse is irregular." },
                    { "time": "0815", "author": "Telemetry", "note": "Visible 'Failure to Sense' on monitor. Spikes noted on T-waves." },
                    { "time": "0830", "author": "MD", "note": "Pacemaker interrogation requested." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.4", "hr": 58, "rr": 18, "bp": "112/64", "o2": "97", "o2_device": "RA", "pain": 0 },
                    { "time": "0815", "tempF": "98.4", "hr": 52, "rr": 20, "bp": "104/58", "o2": "96", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the telemetry trend and patient symptoms. Which findings and nursing actions are most appropriate for this pacemaker malfunction?",
                "options": [
                    { "id": "o1", "text": "Identify the malfunction as 'Failure to Sense'", "isCorrect": true, "rationale": "Failure to sense occurs when the pacemaker does not recognize the heart's own electrical activity and fires at inappropriate times." },
                    { "id": "o2", "text": "Position the patient on their left side to improve lead contact", "isCorrect": false, "rationale": "Positioning does not fix sensing thresholds; this is a programming or lead integrity issue." },
                    { "id": "o3", "text": "Assess the client for symptoms of decreased cardiac output", "isCorrect": true, "rationale": "Lightheadedness and hypotension (104/58) indicate poor perfusion due to the arrhythmia." },
                    { "id": "o4", "text": "Prepare for temporary transcutaneous pacing if the heart rate continues to drop", "isCorrect": true, "rationale": "If the permanent pacer is failing and the patient is symptomatic, back-up pacing is the priority." },
                    { "id": "o5", "text": "Notify the provider and the pacemaker technician immediately", "isCorrect": true, "rationale": "Interrogation and re-programming are required to adjust sensing sensitivities." },
                    { "id": "o6", "text": "Apply a magnet over the pacemaker site to reset the sensing threshold", "isCorrect": false, "rationale": "A magnet usually forces the pacer into a fixed 'asynchronous' mode (DOO/VOO), which might actually worsen the R-on-T risk in this specific scenario." }
                ]
            },
            "rationale": {
                "coreConcept": "Pacemaker Sensing Malfunction",
                "caseSummary": "Client has Failure to Sense. Pacemaker spikes are hitting the patient's own beats. High risk for V-Fib (R-on-T).",
                "answerAnalysis": "Correct: o1 (Diagnosis), o3 (Assessment), o4 (Safety net), o5 (Escalation). o2 is ineffective. o6 is dangerous here.",
                "trap": "Thinking a magnet fixes everything. Magnets convert to 'Fixed Rate', which is the definition of NOT sensing.",
                "goldenRule": "Failure to Sense = Sensing threshold is TOO HIGH (doesn't 'see' the heart).",
                "steps": [
                    { "tag": "Analyze", "description": "Look at the EKG: Is there a spike where there shouldn't be? (Failure to Sense)." },
                    { "tag": "Implement", "description": "Prepare for emergency pacing if the pacer fully fails." }
                ],
                "mnemonic": {
                    "title": "S.P.C.",
                    "content": "S-Sense (fails to see), P-Pace (fails to fire), C-Capture (fails to beat)",
                    "explanation": "The three failure modes of pacing."
                },
                "cheatSheet": {
                    "title": "Pacemaker Settings",
                    "points": [
                        "Rate: The base BPM.",
                        "Output (mA): The strength of the spike.",
                        "Sensitivity (mV): The ability to see intrinsic beats."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "Pacemaker leads are typically placed in the RA and RV apex.",
                    "physiology": "R-on-T phenomenon occurs when a spike hits the vulnerable repolarization period of the ventricle.",
                    "pharm": "Atropine is often ineffective in high-grade AV blocks where the issue is below the AV node."
                },
                "difficulty": {
                    "score": 88,
                    "level": 4,
                    "label": "Analysis",
                    "clinicalStrategy": "Identify the 'Mismatch' between the spike and the patient's beat.",
                    "recommendedActions": ["Telemetry monitoring", "Pacemaker interrogation"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-AICD-J9K0",
        "typeId": "trend",
        "metadata": {
            "title": "AICD Discharge & Psychosocial Impact",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T18:55:00Z",
            "updatedAt": "2026-01-23T18:55:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 96,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Take Action",
            "clinicalFocusTopics": ["AICD", "Safety", "Patient Teaching"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "P.S.", "age": 55, "gender": "Female", "allergies": "NKDA", "weightKg": 68, "codeStatus": "Full Code"
                },
                "setting": "Cardiac Rehab Unit",
                "historyPhysical": {
                    "chiefComplaint": "Fear of AICD activation.",
                    "hpi": "Client received an Automated Implantable Cardioverter Defibrillator (AICD) after surviving sudden cardiac arrest due to V-Tach. She is now afraid to exercise or leave the house. She states, 'What if it goes off? Is it going to hurt? What do I do if it shocks me while I'm driving?'",
                    "pmh": ["V-Tach", "Cardiomyopathy (EF 25%)"],
                    "medications": ["Amiodarone", "Carvedilol"]
                },
                "history": [
                    { "time": "Initial", "author": "RN Rivera", "note": "Discharge teaching initiated. Client expressing high anxiety regarding the device." }
                ],
                "vitals": [
                    { "time": "Today", "tempF": "98.6", "hr": 64, "rr": 16, "bp": "114/70", "o2": "98", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "Magnesium", "value": "1.4", "flag": "L", "ref": "1.7 - 2.2", "unit": "mg/dL" },
                    { "test": "Potassium", "value": "3.3", "flag": "L", "ref": "3.5 - 5.0", "unit": "mEq/L" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the patient's concerns and laboratory data. Which nursing interventions and education points are essential for this client?",
                "options": [
                    { "id": "o1", "text": "Advise the client to notify the physician immediately if the AICD delivers a shock", "isCorrect": true, "rationale": "Every shock must be evaluated to ensure the device is firing correctly and to assess for arrhythmia triggers." },
                    { "id": "o2", "text": "Inform the client that she must call EMS (911) if she receives more than one shock or feels symptomatic", "isCorrect": true, "rationale": "Successive shocks ('Storm') indicate refractory arrhythmia and require emergency medical intervention." },
                    { "id": "o3", "text": "Encourage the client to avoid all physical exercise to prevent a 'mis-fire'", "isCorrect": false, "rationale": "Cardiac rehab and exercise are encouraged; the device is programmed to distinguish between sinus tachycardia and V-Tach." },
                    { "id": "o4", "text": "Notify the provider about the low Potassium (3.3) and Magnesium (1.4)", "isCorrect": true, "rationale": "Hypokalemia and hypomagnesemia are potent triggers for lethal arrhythmias (V-Tach/Torsades) and must be corrected." },
                    { "id": "o5", "text": "Teach family members how to perform CPR in case the device fails", "isCorrect": true, "rationale": "Family training is a standard safety requirement for ICD patients." },
                    { "id": "o6", "text": "Instruct the client to avoid using cell phones on the same side as the device", "isCorrect": true, "rationale": "Cell phones should be kept at least 6 inches (15cm) away from the generator to prevent interference." }
                ]
            },
            "rationale": {
                "coreConcept": "AICD Management & Safety",
                "caseSummary": "AICD patient with anxiety and electrolyte triggers. Nurse must address safety and clinical risk.",
                "answerAnalysis": "Correct: o1 (Documentation), o2 (Emergency criteria), o4 (Electrolyte risk), o5 (Family readiness), o6 (Interference). o3 is a myth that limits quality of life.",
                "trap": "Focusing only on the 'Device' and ignoring the 'Electrolytes' (o4) that cause it to fire.",
                "goldenRule": "Correct the electrolytes to prevent the shock.",
                "steps": [
                    { "tag": "Assess", "description": "Check K+ and Mg+ for all arrhythmia patients." },
                    { "tag": "Educate", "description": "Reinforce that the AICD is a 'Safety Net', not a cage." }
                ],
                "mnemonic": {
                    "title": "A.I.C.D. Safety",
                    "content": "A-Avoid magnets/EMF, I-Identify (Carry card), C-Call 911 for storm, D-Daily weight for CHF",
                    "explanation": "Core teaching for ICD patients."
                },
                "cheatSheet": {
                    "title": "Driving Restrictions",
                    "points": [
                        "Usually no driving for 6 months after a shock.",
                        "Usually no driving for 1 week after initial implant.",
                        "Local laws vary by state/country."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The generator is placed in a sub-costal or sub-pectoral pocket.",
                    "physiology": "V-Tach (Ventricular Tachycardia) results in poor ventricular filling and collapse.",
                    "pharm": "Amiodarone (antiarrhythmic) helps reduce the frequency of shocks."
                },
                "difficulty": {
                    "score": 82,
                    "level": 4,
                    "label": "Application/Synthesis",
                    "clinicalStrategy": "Prioritize 'Life-saving' education and 'Electrolyte' correction.",
                    "recommendedActions": ["Replace K/Mg", "Verify device card"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-EMBOL-X5Y6",
        "typeId": "trend",
        "metadata": {
            "title": "Atrial Fibrillation & Thromboembolic Risk",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:00:00Z",
            "updatedAt": "2026-01-23T19:00:00Z",
            "status": "published",
            "sourceOrigin": "ai",
            "sourceReferences": [],
            "qualityScore": 97,
            "hasStudentPreview": true
        },
        "pedagogy": {
            "difficultyLevel": 4,
            "clinicalFocus": "Cardiology",
            "cjmmPhase": "Analyze Cues",
            "clinicalFocusTopics": ["Atrial Fibrillation", "Stroke", "Anticoagulation"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "J.B.", "age": 82, "gender": "Male", "allergies": "NKDA", "weightKg": 75, "codeStatus": "Full Code"
                },
                "setting": "Skilled Nursing Facility",
                "historyPhysical": {
                    "chiefComplaint": "New onset confusion and left-sided weakness.",
                    "hpi": "Client has a history of chronic Atrial Fibrillation. He has been taking Warfarin for 5 years but recently started taking St. John's Wort for depression. Today, he is found with slurred speech and a left-sided facial droop.",
                    "pmh": ["Atrial Fibrillation", "HTN", "Depression"],
                    "medications": ["Warfarin (2mg)", "St. John's Wort", "Metoprolol"]
                },
                "history": [
                    { "time": "0800", "author": "RN Smith", "note": "Client found sitting in chair. Slurred speech noted. Left-sided neglect." },
                    { "time": "0815", "author": "MD", "note": "Suspected embolic stroke. Stat transfer to Acute Care." }
                ],
                "vitals": [
                    { "time": "0800", "tempF": "98.6", "hr": "110 (Irreg)", "rr": 18, "bp": "168/94", "o2": "94", "o2_device": "RA", "pain": 0 }
                ],
                "labs": [
                    { "test": "INR", "value": "1.2", "flag": "L", "ref": "2.0 - 3.0", "unit": "" }
                ],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the clinical trend and medication interactions. Which factors contributed to this client's current neurologic status?",
                "options": [
                    { "id": "o1", "text": "Subtherapeutic INR (1.2) due to St. John's Wort interaction", "isCorrect": true, "rationale": "St. John's Wort is a strong inducer of CYP enzymes and significantly reduces the efficacy of Warfarin, leading to a low INR." },
                    { "id": "o2", "text": "Formation of an atrial mural thrombus during fibrillation", "isCorrect": true, "rationale": "AFib causes stasis of blood in the atria, primarily the left atrial appendage, leading to clot formation." },
                    { "id": "o3", "text": "Embolization of a clot to the right middle cerebral artery (MCA)", "isCorrect": true, "rationale": "Left-sided weakness and facial droop indicate a stroke in the right hemisphere of the brain." },
                    { "id": "o4", "text": "Hypertensive crisis (BP 168/94) leading to hemorrhagic stroke", "isCorrect": false, "rationale": "While BP is elevated, 168/94 is not typically a 'crisis' level for ICH; its status as embolic (from AFib) is far more likely given the low INR." },
                    { "id": "o5", "text": "Loss of 'Atrial Kick' resulting in decreased cerebral perfusion", "isCorrect": false, "rationale": "Loss of atrial kick reduces CO by 20-30% but does not cause focal neurologic deficits like slurred speech/droop; those are embolic signs." },
                    { "id": "o6", "text": "Improper dosing of Metoprolol", "isCorrect": false, "rationale": "Metoprolol controls rate, not rhythm/clotting. It is not the cause of the stroke." }
                ]
            },
            "rationale": {
                "coreConcept": "AFib & Stroke Risk (CHA2DS2-VASc)",
                "caseSummary": "Patient has AFib and a subtherapeutic INR due to a herb-drug interaction (St. John's Wort + Warfarin). Result is an embolic stroke.",
                "answerAnalysis": "Correct: o1 (Interaction), o2 (Patho of AFib clot), o3 (Neurologic localization). o4, o5, o6 are distractors related to general AFib but not the specific 'Focal' insult.",
                "trap": "Focusing on the BP (o4) instead of the INR (o1) in an AFib patient.",
                "goldenRule": "AFib + Low INR = Ischemic Stroke until proven otherwise.",
                "steps": [
                    { "tag": "Analyze", "description": "Link the herbal medication (St. John's Wort) to the low INR." },
                    { "tag": "Assess", "description": "Identify that left-sided symptoms = right-sided brain insult." }
                ],
                "mnemonic": {
                    "title": "F.A.S.T.",
                    "content": "Face droop, Arm weakness, Speech difficulty, Time to call 911",
                    "explanation": "Classic stroke identification."
                },
                "cheatSheet": {
                    "title": "Warfarin Interactions",
                    "points": [
                        "DECREASE INR: St. John's Wort, Green leafy veg (Vitamin K), Rifampin.",
                        "INCREASE INR: Garlic, Ginger, Ginkgo, NSAIDs, Antibiotics."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The Right MCA supplies the motor and sensory cortex for the left side of the body.",
                    "physiology": "Atrial kick is the final 30% of ventricular filling provided by atrial contraction.",
                    "pharm": "Warfarin inhibits Vitamin K-dependent clotting factors (II, VII, IX, X)."
                },
                "difficulty": {
                    "score": 85,
                    "level": 4,
                    "label": "Synthesis/Pharma",
                    "clinicalStrategy": "Look for the Herb-Drug interaction that crashed the INR.",
                    "recommendedActions": ["Stat Head CT", "Neurologic assessment"]
                }
            }
        }
    },
    {
        "id": "CARDIOLOGY-TRD-BLOCK-M1N2",
        "typeId": "trend",
        "metadata": {
            "title": "Third-Degree (Complete) Heart Block",
            "authorId": "AI-Expert-Writer",
            "createdAt": "2026-01-23T19:05:00Z",
            "updatedAt": "2026-01-23T19:05:00Z",
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
            "clinicalFocusTopics": ["Heart Block", "EKG", "Bradycardia"]
        },
        "content": {
            "clinicalData": {
                "patientInfo": {
                    "name": "R.V.", "age": 78, "gender": "Female", "allergies": "NKDA", "weightKg": 64, "codeStatus": "Full Code"
                },
                "setting": "Emergency Department",
                "historyPhysical": {
                    "chiefComplaint": "Syncopal episode at home.",
                    "hpi": "Client arrived via EMS after a syncopal episode. Telemetry shows a regular P-P interval and a regular R-R interval, but the P-waves and QRS complexes have no relationship ('AV Dissociation'). The ventricular rate is 28 bpm.",
                    "pmh": ["Hypothyroidism", "CAD"],
                    "medications": ["Levothyroxine", "Aspirin"]
                },
                "history": [
                    { "time": "1800", "author": "EMS", "note": "Patient found pale and diaphoretic. HR 30 on monitor. 12-lead shows 3rd degree block." },
                    { "time": "1815", "author": "RN Rivera", "note": "Transcutaneous pacing initiated. Patient is responsive but reports chest discomfort from the pacing." }
                ],
                "vitals": [
                    { "time": "1800", "tempF": "97.8", "hr": 28, "rr": 22, "bp": "78/42", "o2": "90", "o2_device": "RA", "pain": 4 },
                    { "time": "1815 (Pacing)", "tempF": "98.0", "hr": 70, "rr": 18, "bp": "102/60", "o2": "96", "o2_device": "4L NC", "pain": 6 }
                ],
                "labs": [],
                "radiology": []
            },
            "structure": {
                "type": "trend",
                "questionFormat": "sata",
                "prompt": "Evaluate the neurologic and hemodynamic trend. Which findings and interventions are critical for this client's survival?",
                "options": [
                    { "id": "o1", "text": "Recognize the rhythm as 'Complete AV Block'", "isCorrect": true, "rationale": "AV dissociation (P and QRS independent) with a junctional/ventricular escape rhythm is 3rd degree block." },
                    { "id": "o2", "text": "Assess for 'Failure to Capture' on the transcutaneous pacer", "isCorrect": true, "rationale": "The nurse must verify that each pacer spike is followed by a QRS and a palpable pulse to ensure effective cardiac output." },
                    { "id": "o3", "text": "Administer IV Atropine 0.5mg to rapidly increase the heart rate", "isCorrect": false, "rationale": "Atropine works at the SA/AV nodes. In 3rd degree block (especially infra-nodal), it is rarely effective and may even worsen ischemia." },
                    { "id": "o4", "text": "Prepare the client for emergent permanent pacemaker insertion", "isCorrect": true, "rationale": "3rd degree block is a permanent conduction system failure requiring an implanted device." },
                    { "id": "o5", "text": "Monitor for symptoms of cardiogenic shock (cool skin, low BP, confusion)", "isCorrect": true, "rationale": "A backup rate of 28 bpm is insufficient to maintain perfusion to major organs." },
                    { "id": "o6", "text": "Inform the client that the discomfort from the pacer is normal and expected", "isCorrect": true, "rationale": "Transcutaneous pacing is skin-stimulating and very painful; the patient should be told this and offered sedation/analgesia if possible." }
                ]
            },
            "rationale": {
                "coreConcept": "3rd Degree (Complete) AV Block",
                "caseSummary": "Total disconnect between atria and ventricles. HR 28. Hypotension. Emergently pacing.",
                "answerAnalysis": "Correct: o1 (ID rhythm), o2 (Assess pacer), o4 (Long term fix), o5 (Shock signs), o6 (Patient comfort). o3 is the 'Atropine Trap'.",
                "trap": "Trying to use Atropine for a 3rd degree block. It's like trying to fix a cut power line with a faster lightbulb; the line is severed.",
                "goldenRule": "3rd Degree Block = Pacing (Temporal -> Permanent).",
                "steps": [
                    { "tag": "Implement", "description": "Apply pacing pads immediately for any symptomatic bradycardia." },
                    { "tag": "Evaluate", "description": "Palpate a femoral or radial pulse to confirm 'Mechanical' capture, not just 'Electrical' capture." }
                ],
                "mnemonic": {
                    "title": "Block Hierarchy",
                    "content": "1st (Delay), 2nd-I (Longer, longer, drop), 2nd-II (Fixed skip), 3rd (Divorce/Dissociation)",
                    "explanation": "Summarizes Heart Blocks."
                },
                "cheatSheet": {
                    "title": "EKG Clues for 3rd Degree",
                    "points": [
                        "P-waves are 'marching' through the QRS.",
                        "PR interval is completely inconsistent.",
                        "QRS is often wide (> 0.12s) if the escape is ventricular."
                    ]
                },
                "referenceInfo": {
                    "anatomy": "The conduction block usually occurs at the Bundle of His or the Purkinje fibers.",
                    "physiology": "Intrinsic ventricular escape rates are typically 20-40 bpm.",
                    "pharm": "Dopamine or Epinephrine infusions are preferred over Atropine for hemodynamics in 3rd degree block."
                },
                "difficulty": {
                    "score": 98,
                    "level": 5,
                    "label": "Emergency Analysis",
                    "clinicalStrategy": "Recognize the total disconnect between P and QRS.",
                    "recommendedActions": ["Immediate pacing", "Notify Surgery"]
                }
            }
        }
    }
];
