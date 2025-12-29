import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Calculator,
    Check,
    ArrowRight,
    ArrowLeft,
    AlertTriangle,
    Info
} from 'lucide-react';

const FormulaCard = ({ title, formula, note }: { title: string; formula: string; note?: string }) => (
    <div className="p-3 bg-white dark:bg-black/20 rounded border border-amber-100 dark:border-amber-800/30">
        <div className="text-xs font-bold uppercase text-slate-500 mb-1">{title}</div>
        <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{formula}</div>
        {note && <div className="text-[10px] text-amber-600 mt-1 italic">{note}</div>}
    </div>
);


/* --------------------------------------------------------------------------------
   TYPES & INTERFACES
   -------------------------------------------------------------------------------- */

interface CalculationFrameworkProps {
    question: any; // Full item object
    onClose?: () => void;
}

type CalculationMethod = 'formula' | 'dimensional' | 'ratio';
type CalculationType = 'basic' | 'weight-based' | 'bsa' | 'iv-rate';

interface FrameworkData {
    patient: {
        age: string;
        weight: string;
        weightKg: string;
        allergies: string;
    };
    medication: {
        name: string;
        doseOrdered: string;
        route: string;
        frequency: string;
        supplyStrength: string;
        supplyForm: string;
        timeInfusion: string;
        dropFactor: string;
    };
    strategy: {
        type: CalculationType;
        method: CalculationMethod;
    };
    execution: {
        step1Verified: boolean;
        step2Verified: boolean;
        step3Verified: boolean;
        finalAnswer: string;
    };
    verification: {
        recalculated: boolean;
        safeRange: boolean;
        fiveRights: boolean;
        noContraindications: boolean;
    };
}

/* --------------------------------------------------------------------------------
   HELPER COMPONENTS
   -------------------------------------------------------------------------------- */



/* --------------------------------------------------------------------------------
   KEY TYPES (Implicitly defined above in logic, but good to know)
   -------------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------------
   MAIN COMPONENT
   -------------------------------------------------------------------------------- */

export const CalculationFrameworkApplicator: React.FC<CalculationFrameworkProps> = ({ question }) => {

    // --- STATE ---
    const [activePhase, setActivePhase] = useState(0);
    const [completedPhases, setCompletedPhases] = useState<number[]>([]);
    const [data, setData] = useState<FrameworkData>({
        patient: { age: '', weight: '', weightKg: '', allergies: 'None documented' },
        medication: { name: '', doseOrdered: '', route: 'PO', frequency: 'Daily', supplyStrength: '', supplyForm: '', timeInfusion: '', dropFactor: '' },
        strategy: { type: 'basic', method: 'dimensional' },
        execution: { step1Verified: false, step2Verified: false, step3Verified: false, finalAnswer: '' },
        verification: { recalculated: false, safeRange: false, fiveRights: false, noContraindications: false }
    });
    const [showAutoCalc, setShowAutoCalc] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState<number | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>(''); // DEBUG STATE

    // --- PHASES DEFINITION (Reordered & Enhanced) ---
    const PHASES = [
        {
            title: "Clinical Assessment",
            summary: "Gather patient data relevant to dosing",
            points: ["Identify age & weight", "Check renal/hepatic function", "Review allergies", "Verify indications"],
            details: {
                what: "The systematic collection of patient data needed for safe medication administration.",
                why: "Medications are not 'one size fits all'. Dosing depends on dynamic physiological variables.",
                when: "ALWAYS before even beginning the calculation or opening the medication.",
                how: "Reviewing the EHR (History, Vitals, Labs) and assessing the patient physically.",
                who: "The Registered Nurse (You) - you are the final safety checkpoint.",
                where: "At the computer terminal or bedside assessment.",
                example: "Noticing a patient's creatinine is 2.5 (High) implies renal impairment, requiring a lower dose of Vancomycin."
            }
        },
        {
            title: "Info Extraction",
            summary: "What do you need? vs What do you have?",
            points: ["What is the Order?", "What is in your hand?", "Identify the Goal"],
            details: {
                what: "Isolating the specific numbers needed for the clinical calculation from the narrative.",
                why: "Distractors in charts can lead to dosage errors. You must filter for only the variables that affect the dose.",
                when: "After assessing the patient's baseline labs and safety constraints.",
                how: "Scanning the chart for 'Desired' (D), 'Have' (H), and 'Quantity' (Q).",
                who: "The RN (The Final Gatekeeper).",
                where: "The eMAR and the Medication Room.",
                example: "Focusing on 'Ordered: 25mg' and 'Supply: 50mg' while ignoring the patient's room number."
            }
        },
        {
            title: "Methodology", // Moved from Phase 7 to 3
            summary: "Teaching the 'Why' behind the math",
            points: ["Process over Product", "Dimensional Analysis Logic", "Error Prevention"],
            details: {
                what: "Understanding the underlying logic of the calculation method, not just memorizing steps.",
                why: "Rote memorization fails under stress. Understanding logic allows you to catch errors.",
                when: "During study and practice, to build a mental safety net.",
                how: "By asking 'Does this setup make sense?' rather than just plugging numbers.",
                who: "The Learner / Critical Thinker.",
                where: "In your cognitive process.",
                example: "Realizing that multiplying lbs by kg doesn't cancel units, signaling a setup error immediately."
            }
        },
        {
            title: "Calculation Type", // Phase 4 (Index 3)
            summary: "Identify the problem category",
            points: ["Basic Dosing", "Weight-based (mg/kg)", "IV Flow Rates (mL/hr)"],
            details: {
                what: "Identifying the mathematical category of the medication order.",
                why: "Different categories require different variables (e.g., patient weight vs. drop factor).",
                when: "Immediately after extracting the raw data.",
                how: "Analyzing the units in the order (e.g., 'mg/kg' signals weight-based).",
                who: "The RN.",
                where: "Clinical Thinking.",
                example: "Recognizing 'Dopamine 5 mcg/kg/min' is a complex weight-based IV rate problem."
            }
        },
        {
            title: "Method Selection", // Phase 5 (Index 4)
            summary: "Choose your mathematical tool",
            points: ["Formula Method", "Dimensional Analysis", "Ratio & Proportion"],
            details: {
                what: "Selecting the specific mathematical approach to solve the problem.",
                why: "Using a consistent, familiar tool reduces cognitive load and calculation errors.",
                when: "After the problem type is identified but before writing the equation.",
                how: "Choosing 'Formula' for simple tasks or 'Dimensional Analysis' for complex conversions.",
                who: "The RN.",
                where: "Problem Workspace.",
                example: "Selecting 'Dimensional Analysis' to ensure all 3 unit conversions cancel out correctly."
            }
        },
        {
            title: "Execution",
            summary: "Perform the math step by step",
            points: ["Convert units", "Calculate dose", "Determine volume", "Show work"],
            details: {
                what: "The actual mathematical operation (multiplication/division).",
                why: "To find the precise volume or rate to administer.",
                when: "After setup is verified.",
                how: "Using a calculator or manual math, following the selected strategy.",
                who: "The RN.",
                where: "Calculator / Paper.",
                example: "Dividing 500 mg (Desired) by 250 mg (Have) to get 2 tablets."
            }
        },
        {
            title: "Verification",
            summary: "Safety checks and 5 Rights",
            points: ["Is the answer reasonable?", "Check Therapeutic Range", "Verify Max Dose"],
            details: {
                what: "The 'Sanity Check' comparison of your answer against clinical reality.",
                why: "To prevent catastrophic overdose from decimal point errors.",
                when: "IMMEDIATELY after getting a result, BEFORE administering.",
                how: "Asking 'Is 50 tablets reasonable?' or comparing to max daily limits.",
                who: "The RN (and the rights of medication admin).",
                where: "Mental Check.",
                example: "You calculate 15 mL for an IM injection. You STOP because max IM volume is 3 mL. You re-calculate."
            }
        },
        {
            title: "Special Formulas",
            summary: "IV Rates, BSA, Drip Factors",
            points: ["IV Flow Rates", "BSA Calculation", "Pediatric fluid rules"],
            details: {
                what: "Specific equations for specialized situations (IV pumps, Burn fluids, BSA).",
                why: "Standard D/H*Q doesn't apply to rates or body surface area.",
                when: "When the order specifies rate (mL/hr) or specialized dosing.",
                how: "Applying the specific formula reference.",
                who: "RN in specialized units (ICU, Peds, ER).",
                where: "Reference Guide.",
                example: "Using the Parkland Formula to calculate 24-hour fluid needs for a burn victim."
            }
        },
        {
            title: "Critical Thinking",
            summary: "Clinical Judgment Integration",
            points: ["Feasibility Check", "Priority Action", "Contraindications"],
            details: {
                what: "Integrating the math into the full clinical picture.",
                why: "A correct number given to the wrong patient or at the wrong time is still an error.",
                when: "Throughout the entire process.",
                how: "Connecting the drug class, patient status, and result.",
                who: "The Thinking Nurse.",
                where: "Holistic Patient Care.",
                example: "Math is correct for Digoxin, but HR is 50. Critical Thinking dictates HOLDING the dose."
            }
        },
        {
            title: "Documentation",
            summary: "Chart the administration",
            points: ["Record Drug/Dose/Time", "Note Patient Response", "Sign Record"],
            details: {
                what: "The legal record of the medication administration.",
                why: "If it wasn't charted, it wasn't done. Ensures continuity of care.",
                when: "Immediately AFTER administration (never before).",
                how: "Electronic Health Record (eMAR).",
                who: "The Administering RN.",
                where: "eMAR.",
                example: "Documenting 'Morphine 2mg IVP given at 10:00, pain 8/10' and reassessment plans."
            }
        }
    ];

    // --- EXTRACTION LOGIC ---
    const extractAndPopulate = () => {
        if (!question) return;

        // SMART RESOLUTION: Handle both "full item" root and "flat structure" objects
        const clinical = question.clinicalData || question.content?.clinicalData || {};
        const structure = question.structure || question.content?.structure || (question.prompt ? question : {});
        const patientInfo = clinical.patientInfo || {};

        // Combine all potential text sources to ensure we catch data hidden in tabs
        const text = [
            (structure as any).prompt,
            (question as any).text || (question as any).content?.text,
            clinical.historyPhysical,
            clinical.orders,
            clinical.history,
            // Explicitly dump patient/scenario data if available
            JSON.stringify((question as any).patient || {}),
            JSON.stringify((question as any).scenario || {}),
            JSON.stringify(patientInfo),
            // Fallback to stringify if structure is unknown
            JSON.stringify(question)
        ].filter(Boolean).join(' \n ');

        // DEBUG: Capture text and matches
        let debugLog = `Scan Text Length: ${text.length}\nSample: ${text.slice(0, 500)}...\n\n`;

        // STRATEGY 1: Key-Value Lookup (Most reliable for structured headers)
        const ageKV = text.match(/(?:Age|Yo|Years?)[\s:.-]*(\d+(?:\.\d+)?)/i);
        const weightKV = text.match(/(?:Weight|Wt)[\s:.-]*(\d+(?:\.\d+)?)/i);

        // STRATEGY 2: Contextual Unit Search (Good for narrative)
        const weightUnit = text.match(/(\d[\d,.]*)\s*(?:lbs?|pounds?|kg|kilograms?)/i);
        // Supports: "5 years", "5-year-old", "5 yo", "3y"
        const ageUnit = text.match(/(\d+(?:\.\d+)?)\s*(?:[-]?year(?:s)?(?:-old)?|[-]?month(?:s)?(?:-old)?|yo|yr|mo|y)/i);

        // STRATEGY 3: Parentheticals (e.g. "Child (5)")
        const ageParen = text.match(/(?:Child|Patient|Boy|Girl)\s*\(\s*(\d+)\s*\)/i);

        // FALLBACK: Generic Keyword
        const lowerText = text.toLowerCase();
        const hasChildKeyword = lowerText.includes('child') || lowerText.includes('pediatric') || lowerText.includes('infant') || lowerText.includes('toddler');

        // DECISION LOGIC
        // "LOCKED SYSTEM" PRIORITY:
        // 1. Explicit JSON Data (Zero Error)
        // 2. Structured 'patientInfo' object
        // 3. Regex / Text Mining (Fallback)

        const safePatient = patientInfo || {};
        const safeMed = (question as any).medication || {}; // Direct medication object if exists

        const finalAgeVal = safePatient.age || (ageUnit ? ageUnit[1] : (ageKV ? ageKV[1] : (ageParen ? ageParen[1] : null)));
        const finalAgeUnit = typeof finalAgeVal === 'string' && finalAgeVal.includes('mo') ? ' months' : ' years';

        const calculatedAge = finalAgeVal ? `${String(finalAgeVal).replace(/[^0-9.]/g, '')}${finalAgeUnit}` : (hasChildKeyword ? "Child (Unspecified)" : null);

        const finalWeightVal = safePatient.weight || (weightUnit ? weightUnit[1] : (weightKV ? weightKV[1] : null));
        const finalWeightUnit = (typeof finalWeightVal === 'string' && finalWeightVal.toLowerCase().includes('k')) || (weightUnit && weightUnit[0].toLowerCase().includes('k')) ? ' kg' : ' lbs';

        // DEBUG UPDATE
        if (debugLog) {
            debugLog += `\nLOCKED DATA CHECK:\n`;
            debugLog += `Explicit Patient: ${JSON.stringify(safePatient)}\n`;
            debugLog += `Explicit Med: ${JSON.stringify(safeMed)}\n`;
            setDebugInfo(debugLog);
        }

        // Allergies extraction
        const allergyMatch = text.match(/(?:allergies|allergic to)[:\s]*([a-z0-9\s,]+)(?:\.|;|\n|$)|(NKDA|No known drug allergies|NKA)/i);

        // Dose: Look for "prescribed ... 80 units" (multi-line safe)
        const doseMatch = text.match(/(?:administer|order|prescribe|prescribes|prescribed|give|infuse)[\s\S]*?(\d[\d,.]*)\s*(units?|mg|mcg|g|mL|L|gtt)(?:\s*\/|\s*per)?\s*(?:kg|min|hr|day|dose)?/i);

        // Drug Name: Look for capitalized word after keyword
        const drugMatch = text.match(/(?:administer|order|prescribe|prescribes|prescribed|medication|supplies|supply)[\s\S]*?([A-Z][a-z]+)/);

        // Supply: Look for "supplies ... 1,000 units/mL" or "dilute in 250 mL"
        // Keywords: supply, supplies, available, have, hand, factor, pharmacy, bag, dilute
        const supplyMatch = text.match(/(?:supply|supplies|available|have|hand|factor|pharmacy|pharmacist|bag|dilute|concentration)[\s\S]*?(\d[\d,.]*)\s*(units?|mg|mcg|g|mL|L|gtt)(?:\s*(?:\/|in|per|of)\s*(\d[\d,.]*)\s*(mL|tab|cap|tablet|capsule))?/i);

        // Specific Fallback for IV Drop Factor
        const dropFactorMatch = text.match(/(?:drop|drip)\s*factor\s*(?:of|is)?\s*(\d[\d,.]*)\s*(gtt\/mL|gtt)/i);

        // Specific Fallback for Total Bag Volume (for cases where strength and volume are separate)
        const bagVolumeMatch = text.match(/(?:bag|container|vial|diluted? in|total volume|volume)[:\s]*(\d[\d,.]*)\s*(mL|L)/i);

        // Infusion Time: Look for "over 8 hours" or "for 30 minutes"
        const timeMatch = text.match(/(?:over|for|in|during)\s*(\d[\d,.]*)\s*(hours?|hr|minutes?|min)/i);

        setData(prev => {
            // Priority: regex match > bag match > previous
            const extractedSupplyStrength = supplyMatch ? `${supplyMatch[1]} ${supplyMatch[2]}` : (dropFactorMatch ? `${dropFactorMatch[1]} gtt` : prev.medication.supplyStrength);
            // Enhanced Supply Form Logic
            const extractedSupplyForm = supplyMatch && supplyMatch[3] ? `${supplyMatch[3]} ${supplyMatch[4]}` : (bagVolumeMatch ? `${bagVolumeMatch[1]} ${bagVolumeMatch[2]}` : (supplyMatch ? `1 ${supplyMatch[4]}` : prev.medication.supplyForm));

            // LOCK: Prefer Explicit JSON over Regex
            return {
                ...prev,
                patient: {
                    ...prev.patient,
                    age: calculatedAge || prev.patient.age,
                    weight: finalWeightVal ? `${String(finalWeightVal).replace(/[^0-9.]/g, '')}${finalWeightUnit}` : prev.patient.weight,
                    weightKg: finalWeightVal ? (finalWeightUnit.includes('kg') ? String(finalWeightVal).replace(/[^0-9.]/g, '') : (parseFloat(String(finalWeightVal).replace(/,/g, '')) / 2.2).toFixed(1)) : prev.patient.weightKg,
                    allergies: safePatient.allergies || (allergyMatch ? (allergyMatch[1] || allergyMatch[2]).trim() : prev.patient.allergies)
                },
                medication: {
                    ...prev.medication,
                    name: safeMed.name || (drugMatch ? drugMatch[1] : prev.medication.name),
                    doseOrdered: safeMed.dose || (doseMatch ? (doseMatch[1] + ' ' + doseMatch[2]) : prev.medication.doseOrdered),
                    supplyStrength: safeMed.supplyStrength || (extractedSupplyStrength || (bagVolumeMatch ? (doseMatch ? `${doseMatch[1]} ${doseMatch[2]}` : '') : prev.medication.supplyStrength)),
                    supplyForm: safeMed.supplyForm || extractedSupplyForm,
                    timeInfusion: safeMed.time || (timeMatch ? `${timeMatch[1]} ${timeMatch[2]}` : prev.medication.timeInfusion),
                    dropFactor: safeMed.dropFactor || (dropFactorMatch ? `${dropFactorMatch[1]} gtt/mL` : prev.medication.dropFactor)
                }
            };
        });

        // Auto-detect type
        if (finalWeightVal && doseMatch && text.includes('/kg')) {
            updateData('strategy', 'type', 'weight-based');
        } else if (text.includes('IV') || text.includes('drip') || text.includes('mL/hr') || text.includes('gtt') || dropFactorMatch || bagVolumeMatch) {
            updateData('strategy', 'type', 'iv-rate');
        }

        // Auto-Complete Phases if Data Found (User Request)
        setCompletedPhases(prev => {
            const next = new Set(prev);
            if (finalAgeVal || finalWeightVal) next.add(0); // Mark Assessment Complete
            if (doseMatch || drugMatch || supplyMatch) next.add(1); // Mark Extraction Complete
            return Array.from(next);
        });
    };

    // Auto-run on mount
    useEffect(() => {
        extractAndPopulate();
    }, [question]);

    // --- HANDLERS ---
    const updateData = (section: keyof FrameworkData, field: string, value: any) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const markPhaseComplete = (idx: number) => {
        if (!completedPhases.includes(idx)) {
            setCompletedPhases([...completedPhases, idx]);
        }
    };

    const nextPhase = () => {
        markPhaseComplete(activePhase);
        if (activePhase < PHASES.length - 1) setActivePhase(activePhase + 1);
    };

    const prevPhase = () => {
        if (activePhase > 0) setActivePhase(activePhase - 1);
    };

    const resetData = () => {
        setData({
            patient: { age: '', weight: '', weightKg: '', allergies: 'None documented' },
            medication: { name: '', doseOrdered: '', route: 'PO', frequency: 'Daily', supplyStrength: '', supplyForm: '', timeInfusion: '', dropFactor: '' },
            strategy: { type: 'basic', method: 'dimensional' },
            execution: { step1Verified: false, step2Verified: false, step3Verified: false, finalAnswer: '' },
            verification: { recalculated: false, safeRange: false, fiveRights: false, noContraindications: false }
        });
        setCompletedPhases([]);
        setActivePhase(0);
        setShowAutoCalc(false);
        setTimeout(() => extractAndPopulate(), 10);
    };

    // --- RENDERERS FOR RIGHT COLUMN ---

    const renderPhaseContent = () => {
        // Phase 1: Assessment
        if (activePhase === 0) return (
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-teal-600 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Patient Data Extracted
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Age</label>
                            <input
                                type="text"
                                value={data.patient.age}
                                onChange={(e) => updateData('patient', 'age', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Weight</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={data.patient.weight}
                                    onChange={(e) => updateData('patient', 'weight', e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm mt-1"
                                />
                                {data.patient.weight.toLowerCase().includes('lb') && (
                                    <div className="mt-1 p-2 bg-amber-100 text-amber-800 rounded text-xs font-bold whitespace-nowrap flex items-center">
                                        → {data.patient.weightKg} kg
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Allergies</label>
                            <input
                                type="text"
                                value={data.patient.allergies}
                                onChange={(e) => updateData('patient', 'allergies', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm mt-1"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 cursor-pointer p-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => markPhaseComplete(0)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${completedPhases.includes(0) ? 'bg-teal-500 border-teal-500' : 'border-slate-400'}`}>
                        {completedPhases.includes(0) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium">I have reviewed all patient factors affecting dosing.</span>
                </div>

                {/* DEBUG BOX: Diagnostics for Extraction */}
                {debugInfo && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-[10px] font-mono text-red-800 whitespace-pre-wrap h-32 overflow-auto select-all">
                        <strong>DEBUG DIAGNOSTICS:</strong>
                        <br />
                        {debugInfo}
                    </div>
                )}
            </div>
        );

        // Phase 1: Info Extraction
        if (activePhase === 1) return (
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-xs text-slate-500 italic mb-4">
                        Extract the "Hard Numbers" from the scenario below. Filter out any distractors.
                    </p>

                    <div className="grid gap-6">
                        {/* THE ORDER */}
                        <div className="relative p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-sm">
                            <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                1. The Physician's Order
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Drug Name</label>
                                    <input
                                        className="w-full bg-white dark:bg-black/20 border border-blue-500/20 focus:border-blue-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                        value={data.medication.name}
                                        onChange={e => updateData('medication', 'name', e.target.value)}
                                        placeholder="Label on the Order..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Dose (The Desired Amount)</label>
                                    <input
                                        className="w-full bg-white dark:bg-black/20 border border-blue-500/20 focus:border-blue-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                        value={data.medication.doseOrdered}
                                        onChange={e => updateData('medication', 'doseOrdered', e.target.value)}
                                        placeholder="e.g. 500 mg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* THE SUPPLY */}
                        <div className="relative p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
                            <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                2. Medication in Your Hand (Supply)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Supply Strength (What you Have)</label>
                                    <input
                                        className="w-full bg-white dark:bg-black/20 border border-emerald-500/20 focus:border-emerald-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                        value={data.medication.supplyStrength}
                                        onChange={e => updateData('medication', 'supplyStrength', e.target.value)}
                                        placeholder="e.g. 250 mg"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Unit Volume (Per...)</label>
                                    <input
                                        className="w-full bg-white dark:bg-black/20 border border-emerald-500/20 focus:border-emerald-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                        value={data.medication.supplyForm}
                                        onChange={e => updateData('medication', 'supplyForm', e.target.value)}
                                        placeholder="e.g. per 5 mL"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* IV PARAMETERS (Optional/Logical) */}
                        {(data.medication.timeInfusion || data.medication.dropFactor || data.strategy.type === 'iv-rate') && (
                            <div className="relative p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 shadow-sm">
                                <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-amber-600">
                                    3. IV & Timing Details
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Infusion Time</label>
                                        <input
                                            className="w-full bg-white dark:bg-black/20 border border-amber-500/20 focus:border-amber-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                            value={data.medication.timeInfusion}
                                            onChange={e => updateData('medication', 'timeInfusion', e.target.value)}
                                            placeholder="e.g. 30 min or 1 hr"
                                        />
                                        {!data.medication.timeInfusion && data.strategy.type === 'iv-rate' && (
                                            <div className="text-[9px] text-red-500 font-bold mt-1">⚠️ Required for IV Rate</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Drop Factor (if gravity)</label>
                                        <input
                                            className="w-full bg-white dark:bg-black/20 border border-amber-500/20 focus:border-amber-500 p-2.5 rounded-lg text-sm font-bold transition-all outline-none"
                                            value={data.medication.dropFactor}
                                            onChange={e => updateData('medication', 'dropFactor', e.target.value)}
                                            placeholder="e.g. 20 gtt/mL"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group" onClick={() => markPhaseComplete(1)}>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${completedPhases.includes(1) ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/20' : 'border-slate-300 dark:border-slate-600 group-hover:border-teal-500'}`}>
                        {completedPhases.includes(1) && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Values Extracted</div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">I have isolated all variables required for safe calculation.</p>
                    </div>
                </div>
            </div>
        );

        // Phase 2: Methodology (Teaching the Why)
        if (activePhase === 2) return (
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Teaching the "Why"</h3>
                <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Process vs Product</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Calculation is not just about the final number. It is about checking logic at every step.
                            A mathematical error is a medication error.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                        <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">Dimensional Analysis Advantage</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            By focusing on unit cancellation, DA proves setup correctness before calculation.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95" onClick={nextPhase}>
                        Proceed to Strategy
                    </button>
                </div>
            </div>
        );

        // Phase 3: Calculation Type (Index 3)
        if (activePhase === 3) {
            const types: Record<CalculationType, any> = {
                'basic': {
                    what: "Simple dosing where the order is a fixed amount (mg, units, etc).",
                    why: "To find the volume or quantity required for a standard dose.",
                    when: "Ordered dose is not dependent on weight or time (e.g., 'Amlodipine 5mg').",
                    how: "Compare Order (D) to Supply (H) and Quantity (Q).",
                    equation: "(Desired / Have) × Quantity = X",
                    example: "Order: 10mg. Have: 5mg tabs. Result: 2 tabs."
                },
                'weight-based': {
                    what: "Dosing based on patient body mass (mg/kg, mcg/kg).",
                    why: "Safest for pediatrics and high-alert drugs with narrow therapeutic ranges.",
                    when: "Ordered dose is written per kg (e.g., 'Dopamine 5mcg/kg/min').",
                    how: "Must convert lbs to kg first, then multiply dose by patient weight.",
                    equation: "Dose (mg) × Weight (kg) = Total Dose",
                    example: "Dose: 2mg/kg. Patient: 10kg. Total: 20mg."
                },
                'bsa': {
                    what: "Dosing based on Body Surface Area (m²).",
                    why: "Most accurate for drugs where metabolic clearing is critical (Chemo).",
                    when: "Prescribed using m² (e.g., 'Cisplatin 75mg/m²').",
                    how: "Calculate BSA via height/weight formula, then multiply by dose.",
                    equation: "Dose (mg) × BSA (m²) = Total Dose",
                    example: "Dose: 100mg/m². Patient: 1.5 m². Total: 150mg."
                },
                'iv-rate': {
                    what: "Calculates infusion speed (mL/hr) or gravity drops (gtt/min).",
                    why: "Ensures dangerous IV fluids/meds are infused over the specific safe time.",
                    when: "Administering IV fluids or infusions over a duration.",
                    how: "Volume / Time (hr) = mL/hr OR (Vol * DF) / Time (min) = gtt/min.",
                    equation: "Total Volume / Total Time = Rate",
                    example: "1000mL over 8 hours = 125 mL/hr."
                }
            };

            const current = types[data.strategy.type];

            return (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 text-center">Identify Problem Category</h4>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {(['basic', 'weight-based', 'bsa', 'iv-rate'] as CalculationType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => updateData('strategy', 'type', type)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all border-2 ${data.strategy.type === type
                                        ? 'bg-teal-500 text-white border-teal-500 shadow-lg scale-105'
                                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-200'
                                        }`}
                                >
                                    {type.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                <h5 className="font-bold text-slate-800 dark:text-white capitalize">{data.strategy.type.replace('-', ' ')} Breakdown</h5>
                            </div>
                            <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-mono font-black text-teal-600">
                                {current.equation}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <div className="space-y-3">
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5">WHAT:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.what}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5">WHY:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.why}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5">WHEN:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.when}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5">HOW:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.how}</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-800 border-l-4 border-teal-500 rounded shadow-sm">
                                    <span className="font-bold text-teal-600 text-[10px] block mb-1 uppercase tracking-wider">Example:</span>
                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 italic">"{current.example}"</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Abbreviation Legend & Roles */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-800">
                        {[
                            { abbr: 'D', name: 'Desired', role: 'Physician Order (Amount)' },
                            { abbr: 'H', name: 'Have', role: 'Pharmacy Supply (Strength)' },
                            { abbr: 'Q', name: 'Quantity', role: 'Unit Vehicle (1 cap, 5mL)' },
                            { abbr: 'V', name: 'Volume', role: 'Total Fluid Amount' },
                            { abbr: 'DF', name: 'Drop Factor', role: 'Tubing Calibration' },
                            { abbr: 'X', name: 'Unknown', role: 'The Final Administered Dose' }
                        ].map((item) => (
                            <div key={item.abbr} className="flex gap-2 items-start">
                                <div className="w-6 h-6 flex items-center justify-center bg-teal-500 rounded text-[10px] font-black text-white shrink-0 shadow-sm">
                                    {item.abbr}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</div>
                                    <div className="text-[9px] text-slate-500 leading-tight">{item.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95" onClick={nextPhase}>
                            Next: Select Method
                        </button>
                    </div>
                </div>
            );
        }

        // Phase 4: Method Selection (Index 4)
        if (activePhase === 4) {
            const methods: Record<CalculationMethod, any> = {
                'formula': {
                    what: "The standard 'Desired over Have' equation (D/H * Q = X).",
                    why: "Fast and effective for simple, one-step oral or injectable calculations.",
                    when: "When there are minimal unit conversions required and variables are limited.",
                    how: "Plug the ordered dose and available supply directly into the ratio.",
                    equation: "(D / H) × Q = X",
                    example: "Order: 250mg. Have: 125mg/5mL. (250 / 125) * 5 = X."
                },
                'dimensional': {
                    what: "A mathematical process that focuses on unit cancellation (Factor-Label).",
                    why: "Highest safety profile; proves setup accuracy by ensuring final units match.",
                    when: "Essential for complex IV drips with multiple conversions (mcg to mg, hr to min).",
                    how: "Line up fractions such that unwanted units cancel out vertically/diagonally.",
                    equation: "[Goal Unit] = [Order] × [Conversion] × [Supply]",
                    example: "Starting with 'mcg/kg/min' and cancelling units into 'mL/hr'."
                },
                'ratio': {
                    what: "Solving for an unknown variable using two equal ratios (H:V :: D:X).",
                    why: "Provides a clear logical relationship between what is available and what is needed.",
                    when: "Preferred by learners who visualize math as 'parts' or proportions.",
                    how: "Cross-multiply the means and extremes to solve for the unknown X.",
                    equation: "H : V :: D : X",
                    example: "125mg is to 5mL as 250mg is to X mL."
                }
            };

            const current = methods[data.strategy.method];

            return (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 mb-4 text-center">Choose Mathematical Approach</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(['formula', 'dimensional', 'ratio'] as CalculationMethod[]).map(method => (
                                <label key={method} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.strategy.method === method ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-teal-100'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="calc-method"
                                        checked={data.strategy.method === method}
                                        onChange={() => updateData('strategy', 'method', method)}
                                        className="accent-teal-500 w-4 h-4"
                                    />
                                    <span className="font-bold text-sm capitalize">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Method Detail Breakdown */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                <h5 className="font-bold text-slate-800 dark:text-white capitalize">{data.strategy.method === 'dimensional' ? 'Dimensional Analysis' : data.strategy.method + ' Method'}</h5>
                            </div>
                            <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-mono font-black text-teal-600">
                                {current.equation}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <div className="space-y-3">
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5 uppercase tracking-tighter">What it is:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.what}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5 uppercase tracking-tighter">Why use it:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.why}</span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5 uppercase tracking-tighter">When to use:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.when}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs">
                                    <span className="font-bold text-teal-600 block mb-0.5 uppercase tracking-tighter">How it works:</span>
                                    <span className="text-slate-600 dark:text-slate-400">{current.how}</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-800 border-l-4 border-teal-500 rounded shadow-sm">
                                    <span className="font-bold text-teal-600 text-[10px] block mb-1 uppercase tracking-wider">Example:</span>
                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 italic">"{current.example}"</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Abbreviation Legend & Roles */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-800">
                        {[
                            { abbr: 'D', name: 'Desired', role: 'Physician Order (Amount)' },
                            { abbr: 'H', name: 'Have', role: 'Pharmacy Supply (Strength)' },
                            { abbr: 'Q', name: 'Quantity', role: 'Unit Vehicle (1 cap, 5mL)' },
                            { abbr: 'V', name: 'Volume', role: 'Total Fluid Amount' },
                            { abbr: 'DF', name: 'Drop Factor', role: 'Tubing Calibration' },
                            { abbr: 'X', name: 'Unknown', role: 'The Final Administered Dose' }
                        ].map((item) => (
                            <div key={item.abbr} className="flex gap-2 items-start">
                                <div className="w-6 h-6 flex items-center justify-center bg-teal-500 rounded text-[10px] font-black text-white shrink-0 shadow-sm">
                                    {item.abbr}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</div>
                                    <div className="text-[9px] text-slate-500 leading-tight">{item.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95" onClick={nextPhase}>
                            Proceed to Execution
                        </button>
                    </div>
                </div>
            );
        }

        // Phase 5: Execution (Index 5)
        if (activePhase === 5) {
            const doseVal = parseFloat(data.medication.doseOrdered.replace(/[^0-9.]/g, '')) || 0;
            const weightVal = parseFloat(data.patient.weightKg.replace(/[^0-9.]/g, '')) || 0;
            const supplyStrengthVal = parseFloat(data.medication.supplyStrength.replace(/[^0-9.]/g, '')) || 0;
            const supplyFormVal = parseFloat(data.medication.supplyForm.replace(/[^0-9.]/g, '')) || 1;

            // IV Specifics
            const timeVal = parseFloat(data.medication.timeInfusion.replace(/[^0-9.]/g, '')) || 1;
            const isMin = data.medication.timeInfusion.toLowerCase().includes('min');
            const totalMinutes = isMin ? timeVal : timeVal * 60;
            const dfVal = parseFloat(data.medication.dropFactor.replace(/[^0-9.]/g, '')) || 0;

            let finalResult = 0;
            let resultUnit = 'units';

            // Expert Logic: Derived Volume
            // If the order is "1.5g" but pharmacy sends "1.5g in 250mL", 
            // the Volume (V) to be used in IV calculations is (D/H)*Q = (1.5/1.5)*250 = 250mL.
            let derivedVolume = supplyStrengthVal > 0 ? (doseVal / supplyStrengthVal) * supplyFormVal : doseVal;

            // LOCK: If it's an IV Rate and we have NO Derived Volume (e.g. 0), but we have a Dose, Assume Dose IS Volume (Safety Fallback)
            if (data.strategy.type === 'iv-rate' && derivedVolume === 0 && doseVal > 0) {
                derivedVolume = doseVal;
            }

            if (data.strategy.type === 'iv-rate') {
                const safeTime = totalMinutes > 0 ? totalMinutes : 60; // Prevent div/0
                if (dfVal > 0) {
                    // gtt/min formula: (Vol * DF) / Time in min
                    finalResult = (derivedVolume * dfVal) / safeTime;
                    resultUnit = 'gtt/min';
                } else {
                    // mL/hr formula: Vol / Time in hr
                    const hr = safeTime / 60;
                    finalResult = derivedVolume / hr;
                    resultUnit = 'mL/hr';
                }
            } else {
                const totalDose = (data.strategy.type === 'weight-based' || data.strategy.type === 'bsa')
                    ? (weightVal * doseVal)
                    : doseVal;
                finalResult = supplyStrengthVal > 0 ? ((totalDose / supplyStrengthVal) * supplyFormVal) : 0;
                resultUnit = 'mL';
            }

            const doseUnit = data.medication.doseOrdered.replace(/[0-9.,\s]/g, '') || 'units';

            return (
                <div className="space-y-6">
                    {/* Strategy Lock-in Header (Repeated for context) */}
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="p-2 rounded bg-teal-500/5 border border-teal-500/10">
                                <div className="text-[9px] font-black text-teal-600/50 uppercase tracking-widest leading-none mb-1">Type</div>
                                <div className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{data.strategy.type}</div>
                            </div>
                            <div className="p-2 rounded bg-teal-500/5 border border-teal-500/10">
                                <div className="text-[9px] font-black text-teal-600/50 uppercase tracking-widest leading-none mb-1">Method</div>
                                <div className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{data.strategy.method}</div>
                            </div>
                        </div>
                        <button onClick={() => setShowAutoCalc(true)} className="text-[10px] font-bold bg-teal-500 text-white px-3 py-1.5 rounded shadow-lg shadow-teal-500/20 active:scale-95 transition-all ml-4">
                            ⚡ Solve
                        </button>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Calculation Workspace</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                <div className="w-2 h-2 rounded-full bg-amber-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                            </div>
                        </div>

                        <div className="p-6 space-y-8 font-mono">
                            {(data.strategy.type === 'weight-based' || data.strategy.type === 'bsa') && (
                                <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">1</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Step 1: Patient Prep</div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="bg-slate-50 dark:bg-black/20 p-2 rounded">
                                            {data.patient.weight} ÷ 2.2 = <span className="text-teal-600 font-bold">{data.patient.weightKg || '??'} kg</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                        <div className="bg-slate-50 dark:bg-black/20 p-2 rounded">
                                            {data.patient.weightKg || '??'} kg × {data.medication.doseOrdered || '??'} = <span className="text-teal-600 font-bold">{showAutoCalc ? (weightVal * doseVal).toLocaleString() : '??'} {doseUnit}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(data.strategy.type === 'iv-rate') && (
                                <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">1</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Step 1: Time & Supply Prep</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="bg-slate-50 dark:bg-black/20 p-2 rounded">
                                            <span className="text-slate-400">Time:</span> {data.medication.timeInfusion} = <span className="text-teal-600 font-bold">{totalMinutes} min</span>
                                        </div>
                                        {dfVal > 0 && (
                                            <div className="bg-slate-50 dark:bg-black/20 p-2 rounded">
                                                <span className="text-slate-400">Supply:</span> {data.medication.dropFactor}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">{data.strategy.type === 'basic' ? '1' : '2'}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-sm">Step {data.strategy.type === 'basic' ? '1' : '2'}: {data.strategy.method} Setup</div>

                                {data.strategy.method === 'formula' && (
                                    <div className="flex items-center gap-4 py-4">
                                        {data.strategy.type === 'iv-rate' ? (
                                            dfVal > 0 ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="px-4 py-2 bg-slate-50 dark:bg-black/20 rounded border-b-2 border-slate-300 dark:border-slate-700 min-w-[120px] text-center font-bold">
                                                        {derivedVolume} mL × {dfVal} gtt
                                                    </div>
                                                    <div className="px-4 py-2 font-bold">{totalMinutes} min</div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="px-4 py-2 bg-slate-50 dark:bg-black/20 rounded border-b-2 border-slate-300 dark:border-slate-700 min-w-[120px] text-center font-bold">
                                                        {derivedVolume} mL
                                                    </div>
                                                    <div className="px-4 py-2 font-bold">{totalMinutes / 60} hr</div>
                                                </div>
                                            )
                                        ) : (
                                            <>
                                                <div className="flex flex-col items-center">
                                                    <div className="px-4 py-2 bg-slate-50 dark:bg-black/20 rounded border-b-2 border-slate-300 dark:border-slate-700 min-w-[80px] text-center font-bold">
                                                        {showAutoCalc ? ((data.strategy.type === 'weight-based' || data.strategy.type === 'bsa') ? (weightVal * doseVal) : doseVal).toLocaleString() : 'D'}
                                                    </div>
                                                    <div className="px-4 py-2 font-bold">
                                                        {data.medication.supplyStrength || 'H'}
                                                    </div>
                                                </div>
                                                <div className="text-xl">×</div>
                                                <div className="px-4 py-2 bg-slate-50 dark:bg-black/20 rounded font-bold">
                                                    {data.medication.supplyForm || 'Q'}
                                                </div>
                                            </>
                                        )}
                                        <div className="text-xl">=</div>
                                        <div className="text-2xl font-black text-teal-600">
                                            {showAutoCalc ? `${resultUnit === 'gtt/min' ? Math.round(finalResult) : parseFloat(finalResult.toFixed(2))} ${resultUnit}` : `X ${resultUnit}`}
                                        </div>
                                    </div>
                                )}

                                {data.strategy.method === 'dimensional' && (
                                    <div className="flex items-center gap-1 overflow-x-auto py-4">
                                        <div className="text-lg font-bold pr-2">X {resultUnit} =</div>
                                        {data.strategy.type === 'iv-rate' ? (
                                            dfVal > 0 ? (
                                                <>
                                                    <div className="flex flex-col items-center px-3 border-r border-slate-200 dark:border-slate-700">
                                                        <div className="pb-1 border-b border-slate-400 font-bold">{dfVal} gtt</div>
                                                        <div className="pt-1 font-bold">1 mL</div>
                                                    </div>
                                                    <div className="text-lg px-1">×</div>
                                                    <div className="flex flex-col items-center px-3">
                                                        <div className="pb-1 border-b border-slate-400 font-bold">{derivedVolume} mL</div>
                                                        <div className="pt-1 font-bold">{totalMinutes} min</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col items-center px-3 border-r border-slate-200 dark:border-slate-700">
                                                        <div className="pb-1 border-b border-slate-400 font-bold">{derivedVolume} mL</div>
                                                        <div className="pt-1 font-bold">{data.medication.timeInfusion}</div>
                                                    </div>
                                                    {isMin && (
                                                        <>
                                                            <div className="text-lg px-1">×</div>
                                                            <div className="flex flex-col items-center px-3">
                                                                <div className="pb-1 border-b border-slate-400 font-bold">60 min</div>
                                                                <div className="pt-1 font-bold">1 hr</div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <div className="flex flex-col items-center px-3 border-r border-slate-200 dark:border-slate-700">
                                                    <div className="pb-1 border-b border-slate-400 font-bold">{data.medication.supplyForm || 'Q'}</div>
                                                    <div className="pt-1 font-bold">{data.medication.supplyStrength || 'H'}</div>
                                                </div>
                                                <div className="text-lg px-1">×</div>
                                                <div className="flex flex-col items-center px-3">
                                                    <div className="pb-1 border-b border-slate-400 font-bold">{showAutoCalc ? ((data.strategy.type === 'weight-based' || data.strategy.type === 'bsa') ? (weightVal * doseVal) : doseVal).toLocaleString() : 'D'}</div>
                                                    <div className="pt-1 font-bold">1</div>
                                                </div>
                                            </>
                                        )}
                                        <div className="text-2xl font-black text-teal-600 pl-4 whitespace-nowrap">= {showAutoCalc ? `${resultUnit === 'gtt/min' ? Math.round(finalResult) : parseFloat(finalResult.toFixed(2))} ${resultUnit}` : '...'}</div>
                                    </div>
                                )}

                                {data.strategy.method === 'ratio' && (
                                    <div className="flex items-center gap-4 py-4 text-lg">
                                        <div className="bg-slate-50 dark:bg-black/20 p-3 rounded font-bold">
                                            {data.strategy.type === 'iv-rate' && dfVal > 0 ? `${totalMinutes} min : ${doseVal * dfVal} gtt` : `${data.medication.supplyStrength || 'H'} : ${data.medication.supplyForm || 'Q'}`}
                                        </div>
                                        <div className="text-teal-500 font-bold">::</div>
                                        <div className="bg-slate-50 dark:bg-black/20 p-3 rounded font-bold">
                                            {data.strategy.type === 'iv-rate' && dfVal > 0 ? `1 min : X gtt` : `${showAutoCalc ? ((data.strategy.type === 'weight-based' || data.strategy.type === 'bsa') ? (weightVal * doseVal) : doseVal).toLocaleString() : 'D'} : X`}
                                        </div>
                                        <ArrowRight className="w-5 h-5" />
                                        <div className="text-2xl font-black text-teal-600">
                                            {showAutoCalc ? `${resultUnit === 'gtt/min' ? Math.round(finalResult) : parseFloat(finalResult.toFixed(2))} ${resultUnit}` : `X ${resultUnit}`}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Smart Answer Entry & Validation */}
                        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider">Your Final Finding</label>
                                <button
                                    onClick={() => setShowAutoCalc(!showAutoCalc)}
                                    className="text-[10px] font-bold text-teal-600 hover:text-teal-700 underline"
                                >
                                    {showAutoCalc ? "Hide Solution" : "Reveal Expert Calculation"}
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={data.execution.finalAnswer}
                                        onChange={(e) => updateData('execution', 'finalAnswer', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-teal-500 rounded-lg p-3 font-mono font-bold text-lg outline-none transition-all"
                                        placeholder={`Enter ${resultUnit}...`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{resultUnit}</div>
                                </div>

                                {data.execution.finalAnswer && (
                                    <div className="animate-in zoom-in duration-300">
                                        {(() => {
                                            const studentVal = parseFloat(data.execution.finalAnswer.replace(/[^0-9.]/g, ''));
                                            const expectedVal = finalResult;

                                            // Fracture Logic: Determine clinical decimal limits

                                            // Fracture Logic: Determine clinical decimal limits
                                            let allowedDecimals = 1; // Default: Tenths
                                            if (resultUnit === 'gtt/min') allowedDecimals = 0; // Drops: Whole
                                            if (resultUnit === 'mg' || resultUnit === 'mcg') allowedDecimals = 2; // Precise

                                            const isMathematicallyEqual = !isNaN(studentVal) && (
                                                studentVal === expectedVal ||
                                                studentVal.toFixed(allowedDecimals) === expectedVal.toFixed(allowedDecimals) ||
                                                Math.round(studentVal) === Math.round(expectedVal) ||
                                                Math.abs(studentVal - expectedVal) < 0.05
                                            );

                                            if (isMathematicallyEqual) {
                                                return (
                                                    <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        <span className="font-bold text-sm">Correct</span>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span className="font-bold text-sm">Review Math</span>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>

                            {data.execution.finalAnswer && resultUnit === 'gtt/min' && !isNaN(parseFloat(data.execution.finalAnswer)) && (
                                <p className="text-[10px] text-slate-500 italic">
                                    Expert Note: For gravity infusions, we always round to the nearest whole drop ({Math.round(finalResult)} gtt/min).
                                </p>
                            )}
                        </div>

                        {/* Verification Toggles */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => updateData('execution', 'step1Verified', !data.execution.step1Verified)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${data.execution.step1Verified ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {data.execution.step1Verified && <Check className="w-3 h-3" />}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Units Verified</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => updateData('execution', 'step2Verified', !data.execution.step2Verified)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${data.execution.step2Verified ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {data.execution.step2Verified && <Check className="w-3 h-3" />}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Math Audited</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button className="bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-8 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95" onClick={nextPhase}>
                            Final Safety Verification
                        </button>
                    </div>
                </div>
            );
        }

        // Phase 6: Verification (Index 6)
        if (activePhase === 6) return (
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Safety Verification</h3>
                    <div className="space-y-3">
                        {[
                            { id: 'recalculated', label: 'Recalculated using a second method (math verified)' },
                            { id: 'safeRange', label: 'Dose is within safe therapeutic range' },
                            { id: 'noContraindications', label: 'No allergies or contraindications identified' },
                            { id: 'fiveRights', label: 'Verified 5 Rights (Patient, Drug, Dose, Route, Time)' }
                        ].map((check) => (
                            <label key={check.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={(data.verification as any)[check.id]}
                                    onChange={() => updateData('verification', check.id, !(data.verification as any)[check.id])}
                                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={`p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-500 ${Object.values(data.verification).every(Boolean)
                    ? 'bg-green-500 text-white shadow-lg scale-100'
                    : 'bg-slate-100 text-slate-400 scale-95 opacity-50'
                    }`}>
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold text-lg uppercase">Safe to Administer</span>
                </div>
            </div>
        );

        // Phase 7: Special Formulas (Index 7)
        if (activePhase === 7) return (
            <div className="space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500 mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5" /> Reference Formulas
                    </h3>

                    <div className="space-y-6">
                        {/* 1. Core Dosage */}
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-800/60 mb-2 border-b border-amber-200 pb-1">Core Dosage & IV</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormulaCard title="Basic Formula (Solid/Liquid)" formula="D (Desired) ÷ H (Have) × Q (Quantity) = X" />
                                <FormulaCard title="IV Flow Rate (Pump)" formula="Total Volume (mL) ÷ Time (hr) = mL/hr" />
                                <FormulaCard title="IV Drip Rate (Gravity)" formula="(Volume (mL) × Drop Factor (gtt/mL)) ÷ Time (min) = gtt/min" />
                                <FormulaCard title="Fluid Maintenance (Peds)" formula="100/50/20 Rule: 100mL for 1st 10kg + 50mL for 2nd 10kg + 20mL for rest" />
                            </div>
                        </div>

                        {/* 2. Assessment & Vitals */}
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-800/60 mb-2 border-b border-amber-200 pb-1">Patient Assessment</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormulaCard title="MAP (Mean Arterial Pressure)" formula="(SBP + 2 × DBP) ÷ 3" note="Normal: 70-100 mmHg" />
                                <FormulaCard title="BMI (Body Mass Index)" formula="Weight (kg) ÷ Height (m)²" />
                                <FormulaCard title="Temp Conversion (F to C)" formula="(°F - 32) ÷ 1.8 = °C" />
                                <FormulaCard title="BSA (Mosteller)" formula="√ [ (Ht(cm) × Wt(kg)) ÷ 3600 ]" />
                            </div>
                        </div>

                        {/* 3. Critical Care */}
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-800/60 mb-2 border-b border-amber-200 pb-1">Critical Care & Specialty</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormulaCard title="Parkland Formula (Burns)" formula="4 mL × kg × %BSA Burned = Total 24hr Fluid" note="Give 1st half in 8 hrs, 2nd half in 16 hrs" />
                                <FormulaCard title="ANC (Abs. Neutrophil Count)" formula="WBC × (%Segs + %Bands) ÷ 100" note="<500 = Severe Neutropenia" />
                                <FormulaCard title="Pulse Pressure" formula="SBP - DBP" note="Normal: 30-50 mmHg" />
                                <FormulaCard title="CPP (Cerebral Perfusion)" formula="MAP - ICP" note="Target: 60-100 mmHg" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-200">
                        {/* 4. Common Conversions */}
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-800/60 mb-2">⚡ High-Yield Conversions</h4>
                            <div className="bg-white dark:bg-black/20 rounded border border-amber-100 dark:border-amber-800/30 p-3 text-xs space-y-2">
                                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1"><span>1 teaspoon (tsp)</span> <span className="font-bold">5 mL</span></div>
                                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1"><span>1 tablespoon (tbsp)</span> <span className="font-bold">15 mL</span></div>
                                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1"><span>1 ounce (oz)</span> <span className="font-bold">30 mL</span></div>
                                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1"><span>1 cup (8 oz)</span> <span className="font-bold">240 mL</span></div>
                                <div className="flex justify-between"><span>1 kg</span> <span className="font-bold">2.2 lbs</span></div>
                            </div>
                        </div>

                        {/* 5. Safety & Rounding Rules */}
                        <div>
                            <h4 className="text-xs font-black uppercase text-amber-800/60 mb-2">⛔ Safety & Rounding Rules</h4>
                            <ul className="bg-white dark:bg-black/20 rounded border border-amber-100 dark:border-amber-800/30 p-3 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">●</span>
                                    <span><strong>Leading Zeros:</strong> ALWAYS use (0.5 mg ✅, .5 mg ❌)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">●</span>
                                    <span><strong>Trailing Zeros:</strong> NEVER use (1 mg ✅, 1.0 mg ❌)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-500 font-bold">●</span>
                                    <span><strong>IM Max Volume:</strong> 3 mL (Large muscle), 1 mL (Deltoid)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-500 font-bold">●</span>
                                    <span><strong>Rounding:</strong> &lt;1 mL round to 100th, &gt;1 mL round to 10th</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center text-xs text-slate-400 italic">
                    These formulas are for reference only. Always verify with facility policy.
                </div>
            </div>
        );

        // Phase 8: Critical Thinking (Index 8)
        if (activePhase === 8) return (
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Clinical Judgment Layer</h3>
                <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors bg-white dark:bg-slate-800">
                        <div className="mt-1"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
                        <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Is the dose feasible?</div>
                            <p className="text-xs text-slate-500 mt-1">Example: A calculation resulting in 14 tablets per dose is likely an error.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors bg-white dark:bg-slate-800">
                        <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                        <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Therapeutic Range</div>
                            <p className="text-xs text-slate-500 mt-1">If the result is 1500 mg but max daily dose is 1000 mg, HOLD the med.</p>
                        </div>
                    </div>
                </div>
            </div>
        );

        // Phase 9: Documentation (Index 9)
        if (activePhase === 9) return (
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            Documentation Record
                        </h3>
                        <div className="text-xs font-mono text-slate-400">EHR MOCKUP</div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Medication Administered</label>
                            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold">
                                {data.medication.name || '---'} {data.medication.doseOrdered || '---'}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Notes</label>
                            <textarea
                                className="w-full h-24 p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                placeholder="Patient tolerated procedure well. 5 Rights verified. Education provided on side effects..."
                            />
                        </div>
                        <button className="w-full py-2 bg-slate-800 text-white rounded font-bold text-sm hover:bg-slate-700">
                            Sign & Chart
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-teal-600 font-bold p-4 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" /> All Phases Complete
                </div>
            </div>
        );

        return null;
    };


    return (
        <div className="flex flex-col h-[600px] w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">

            {/* --- HEADER --- */}
            <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-teal-500" />
                        Calculation Framework
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${((activePhase + 1) / PHASES.length) * 100}%` }} />
                        </div>
                        <span>Phase {activePhase + 1} of {PHASES.length}: {PHASES[activePhase].title}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={resetData}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-300"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT COLUMN: FRAMEWORK */}
                <div className="w-[35%] bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 custom-scrollbar space-y-2">
                    {PHASES.map((phase, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActivePhase(idx)}
                            className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer ${activePhase === idx
                                ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10'
                                : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors mt-0.5 ${completedPhases.includes(idx)
                                    ? 'bg-green-500 text-white'
                                    : activePhase === idx ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                    }`}>
                                    {completedPhases.includes(idx) ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm font-bold leading-tight ${activePhase === idx ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
                                        {phase.title}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{phase.summary}</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailModalOpen(idx); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-teal-600"
                                    title="View Phase Details"
                                >
                                    <Info className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Connector Line */}
                            {idx !== PHASES.length - 1 && (
                                <div className={`absolute left-6 top-9 bottom-[-8px] w-px ${completedPhases.includes(idx) ? 'bg-green-500/50' : 'bg-slate-200 dark:bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                    <div className="h-10" />
                </div>

                {/* RIGHT COLUMN: APPLICATION */}
                <div className="w-[65%] bg-white dark:bg-slate-900 overflow-y-auto p-6 custom-scrollbar relative">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                {PHASES[activePhase].title}
                            </h3>
                            <button
                                onClick={extractAndPopulate}
                                className="px-2 py-1 bg-teal-500/10 hover:bg-teal-500/20 cursor-pointer text-teal-600 rounded text-xs font-bold uppercase tracking-wider border border-teal-500/20 transition-all active:scale-95"
                                title="Re-extract data from question"
                            >
                                Apply to Question ⟳
                            </button>
                        </div>

                        {/* DYNAMIC CONTENT */}
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            {renderPhaseContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20">
                <button
                    onClick={prevPhase}
                    disabled={activePhase === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent font-medium text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActivePhase(6)} // Jump to verify (Index 6)
                        className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-teal-500 transition-colors"
                    >
                        Jump to Verify
                    </button>
                </div>

                <button
                    onClick={nextPhase}
                    disabled={activePhase === PHASES.length - 1}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:bg-slate-300 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                >
                    {activePhase === 9 ? 'Complete' : 'Next Phase'} <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* DETAIL MODAL */}
            {detailModalOpen !== null && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-teal-500 p-4 text-white flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Phase {detailModalOpen + 1}</div>
                                <h3 className="text-xl font-bold leading-tight">{PHASES[detailModalOpen]?.title}</h3>
                            </div>
                            <button onClick={() => setDetailModalOpen(null)} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                            {PHASES[detailModalOpen]?.details ? (
                                <>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-teal-600 uppercase">What</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{PHASES[detailModalOpen].details.what}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-teal-600 uppercase">Why</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{PHASES[detailModalOpen].details.why}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <div className="text-xs font-bold text-teal-600 uppercase">Who</div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{PHASES[detailModalOpen].details.who}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs font-bold text-teal-600 uppercase">When</div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">{PHASES[detailModalOpen].details.when}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mt-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Example</div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic">"{PHASES[detailModalOpen].details.example}"</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-slate-400 py-10">No details available.</div>
                            )}
                        </div>
                    </div>
                    {/* Backdrop Close */}
                    <div className="absolute inset-0 z-[-1]" onClick={() => setDetailModalOpen(null)} />
                </div>
            )}
        </div>
    );
};
