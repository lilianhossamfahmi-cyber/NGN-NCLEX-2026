/**
 * 🧠 UNIFIED RATIONALE PIPELINE
 * 
 * Single source of truth for generating clinical feedback and scores.
 * Supports all item types: BowTie, Matrix, Cloze, SATA, Single-Choice, Calculation
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OutcomeModel {
    badge: 'CORRECT' | 'INCORRECT' | 'PARTIAL';
    score: number;           // 0-100 percentage
    totalPoints: number;
    earnedPoints: number;
    message: string;
    breakdown?: ScoreBreakdown;
}

export interface ScoreBreakdown {
    // BowTie breakdown
    actions?: { earned: number; total: number; correct: string[]; incorrect: string[] };
    condition?: { earned: number; total: number; correct: boolean; userChoice: string; correctChoice: string };
    parameters?: { earned: number; total: number; correct: string[]; incorrect: string[] };

    // Matrix breakdown
    rows?: { id: string; correct: boolean; userAnswer: string; correctAnswer: string }[];

    // Cloze breakdown
    blanks?: { id: string; correct: boolean; userAnswer: string; correctAnswer: string }[];
}

export interface OptionReview {
    id: string;
    text: string;
    isCorrect: boolean;
    userSelected: boolean;
    rationale: string;
    userStatus: 'correct' | 'incorrect' | 'missed' | 'skipped';
}

export interface BowTieReview {
    actions: {
        id: string;
        text: string;
        isCorrect: boolean;
        userSelected: boolean;
        rationale: string;
    }[];
    condition: {
        userChoice: { id: string; text: string } | null;
        correctChoice: { id: string; text: string };
        isCorrect: boolean;
        rationale: string;
    };
    parameters: {
        id: string;
        text: string;
        isCorrect: boolean;
        userSelected: boolean;
        rationale: string;
    }[];
}

export interface ClinicalStep {
    tag: 'RECOGNIZE' | 'ANALYZE' | 'PRIORITIZE' | 'ACT';
    description: string;
}

export interface Mnemonic {
    title: string;
    content: string;
    explanation: string;
}

export interface CheatSheet {
    title: string;
    points: string[];
}

export interface ReferenceInfo {
    anatomy: string;
    physiology: string;
    pharm: string;
}

import { HighlightReview, HighlightSpan, ClozeReview, ClozeBlankReview, OrderedReview } from '../types/RationaleTypes';

export interface CanonicalRationale {
    // Tab 0: Item Overview
    outcome: OutcomeModel;
    coreConcept: string;
    caseSummary: string;
    answerAnalysis: string;
    trap: string;

    // Tab 1: Option Review
    optionReviews: OptionReview[];
    bowTieReview?: BowTieReview;
    matrixRows?: any[]; // For Matrix Feedback
    matrixColumns?: any[]; // For Matrix Headers
    highlightReview?: HighlightReview;
    clozeReview?: ClozeReview;  // For Drop/Cloze Feedback
    orderedReview?: OrderedReview; // For Ordered Response Feedback

    // Tab 2: Clinical Logic
    steps: ClinicalStep[];
    goldenRule: string;

    // Tab 3: Strategy
    mnemonic: Mnemonic;
    cheatSheet: CheatSheet;
    pitfalls: string[];

    // Tab 4: Knowledge
    referenceInfo: ReferenceInfo;

    // Metadata
    cjmmStep: string;
    itemType: string;
    difficulty?: { level: string; score?: number };

    // Calculation Specifics
    formulaMethod?: string;
    dimensionalAnalysis?: string;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_STEPS: ClinicalStep[] = [
    { tag: 'RECOGNIZE', description: 'Identify key clinical findings from assessment data and patient presentation' },
    { tag: 'ANALYZE', description: 'Connect findings to potential diagnoses using clinical reasoning and evidence' },
    { tag: 'PRIORITIZE', description: 'Determine most urgent interventions based on patient acuity and safety' },
    { tag: 'ACT', description: 'Implement appropriate nursing actions and evaluate patient response' },
];

const DEFAULT_MNEMONIC: Mnemonic = {
    title: 'Clinical Decision Framework',
    content: 'ASSESS → ANALYZE → ACT → EVALUATE',
    explanation: 'Systematic approach to clinical judgment: gather data, analyze patterns, take action, and evaluate outcomes. This framework applies to all patient situations.',
};

const DEFAULT_CHEAT_SHEET: CheatSheet = {
    title: 'Key Clinical Pearls',
    points: [
        'Always assess airway, breathing, circulation first (ABCs)',
        'Prioritize life-threatening conditions over stable problems',
        'Document assessment findings before and after interventions',
        'Communicate critical findings using SBAR format',
    ],
};

const DEFAULT_REFERENCE: ReferenceInfo = {
    anatomy: 'Review the relevant body systems and anatomical structures affected by this clinical condition.',
    physiology: 'Understand the normal physiological processes and how they are disrupted in this pathological state.',
    pharm: 'Know the mechanism of action, therapeutic effects, and nursing considerations for medications used in treatment.',
};

// ============================================================================
// CALCULATION HELPER: Extract and build step-by-step breakdown
// ============================================================================

interface CalcBreakdown {
    formulaMethod: string;
    dimensionalAnalysis: string;
    safetyCheck: string;
}

function extractCalculationBreakdown(config: any): CalcBreakdown {
    let prompt = config.prompt || config.structure?.prompt || config.content?.structure?.prompt || config.content?.prompt || '';
    const structure = config.structure || config.content?.structure || {};
    const correctValue = structure.correctValue || structure.answer || config.correctValue || 0;
    const units = structure.units || structure.inputLabel || config.units || 'mL';

    // --- INTELLIGENT CONTEXT AUGMENTATION ---
    // If the prompt refers to the chart ("Refer to EHR"), we must append Clinical Data
    // to the prompt string so our regex extractors can find the numbers (Supply, Dose, Weight).
    const clinicalData = config.content?.clinicalData || config.clinicalData;
    if (clinicalData) {
        const parts: string[] = [];

        // 1. Patient Weight
        if (clinicalData.patientInfo?.weight) parts.push(`Weight: ${clinicalData.patientInfo.weight}`);

        // 2. Orders (Drug, Dose, Supply, Rate)
        if (Array.isArray(clinicalData.orders)) {
            clinicalData.orders.forEach((o: any) => {
                parts.push(`Order: ${o.drug} ${o.dose}`);
                if (o.supply) parts.push(`Supply: ${o.supply}`);
                if (o.rate) parts.push(`Rate: ${o.rate}`);
            });
        }

        // 3. Vitals (Fluid intake, Output, etc for I&O)
        if (Array.isArray(clinicalData.vitals)) {
            clinicalData.vitals.forEach((v: any) => {
                // sometimes intake/output is in vitals or custom fields
                if (v.intake) parts.push(`Intake: ${v.intake}`);
                if (v.output) parts.push(`Output: ${v.output}`);
            });
        }

        // 4. Nurses Notes (often contain intake/output or event times)
        if (Array.isArray(clinicalData.nursesNotes)) {
            clinicalData.nursesNotes.forEach((n: any) => parts.push(n.note || ''));
        }

        // Append to prompt for seamless regex extraction
        if (parts.length > 0) {
            prompt += "\n [EHR CONTEXT]: " + parts.join("; ");
            // Debug log removed to prevent console flooding
        }
    }

    // Debug log removed to prevent console flooding

    // Extract rounding instruction
    const roundingMatch = prompt.match(/round.*?(?:to\s+the\s+)?(?:nearest\s+)?(whole\s+number|tenth|hundredth)/i);
    const roundingRule = roundingMatch ? `Round to nearest ${roundingMatch[1]}` : 'Round as instructed';

    let formulaMethod = '';
    let safetyCheck = '';

    // =====================================================
    // TYPE 1: SIMPLE IV RATE (Volume ÷ Time)
    // Example: "500 mL over 3 hours"
    // =====================================================
    const volumeTimeMatch = prompt.match(/(\d+(?:\.\d+)?)\s*mL.*?(?:over|in)\s*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);

    if (volumeTimeMatch) {
        const vol = parseFloat(volumeTimeMatch[1]);
        const time = parseFloat(volumeTimeMatch[2]);
        const rate = vol / time;
        const rounded = Math.round(rate);

        formulaMethod = `**📋 TYPE: Simple IV Rate Calculation**

**Given:**
• Total Volume: **${vol} mL**
• Infusion Time: **${time} hours**

---

**📐 Formula:** Rate = Volume ÷ Time

---

**🔢 Step-by-Step:**

**Step 1:** Set up the formula
Rate (mL/hr) = Total Volume (mL) ÷ Time (hr)

**Step 2:** Plug in values
Rate = ${vol} mL ÷ ${time} hr

**Step 3:** Calculate
Rate = ${rate.toFixed(2)} mL/hr

**Step 4:** ${roundingRule}
**Answer: ${rounded} mL/hr**`;

        safetyCheck = `✓ Verify: ${vol} ÷ ${time} = ${rate.toFixed(2)} → **${rounded} mL/hr**`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 2: IV DRIP RATE (gtt/min)
    // Example: "1000 mL over 8 hours, drop factor 15 gtt/mL"
    // =====================================================
    const dropFactorMatch = prompt.match(/(?:drop\s*factor|tubing)\s*(?:of|is|:)?\s*(\d+)\s*(?:gtt\/mL|gtts?\/mL)/i);
    const dripVolumeTime = prompt.match(/(\d+(?:\.\d+)?)\s*mL.*?(?:over|in)\s*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|minutes?|mins?)/i);

    if (dropFactorMatch && dripVolumeTime) {
        const vol = parseFloat(dripVolumeTime[1]);
        const time = parseFloat(dripVolumeTime[2]);
        const dropFactor = parseFloat(dropFactorMatch[1]);
        const isMinutes = dripVolumeTime[0].toLowerCase().includes('min');
        const timeInMin = isMinutes ? time : time * 60;
        const gttPerMin = (vol * dropFactor) / timeInMin;
        const rounded = Math.round(gttPerMin);

        formulaMethod = `**📋 TYPE: IV Drip Rate (gtt/min)**

**Given:**
• Total Volume: **${vol} mL**
• Infusion Time: **${time} ${isMinutes ? 'minutes' : 'hours'}** (${timeInMin} min)
• Drop Factor: **${dropFactor} gtt/mL**

---

**📐 Formula:** gtt/min = (Volume × Drop Factor) ÷ Time in minutes

---

**🔢 Step-by-Step:**

**Step 1:** Convert time to minutes
${isMinutes ? `Already in minutes: ${time} min` : `${time} hr × 60 = ${timeInMin} minutes`}

**Step 2:** Apply formula
gtt/min = (${vol} mL × ${dropFactor} gtt/mL) ÷ ${timeInMin} min

**Step 3:** Calculate numerator
${vol} × ${dropFactor} = ${vol * dropFactor}

**Step 4:** Divide
${vol * dropFactor} ÷ ${timeInMin} = ${gttPerMin.toFixed(2)} gtt/min

**Step 5:** ${roundingRule}
**Answer: ${rounded} gtt/min**`;

        safetyCheck = `✓ Verify drop rate is reasonable (typically 10-100 gtt/min)`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 3: WEIGHT-BASED DOSE (mcg/kg/min or mg/kg/day)
    // Example: "15 mcg/kg/min for 70 kg patient"
    // =====================================================
    const weightDoseMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(mcg|mg|units?|g)\s*\/\s*kg\s*\/\s*(min|hr|hour|day)/i);
    const patientWeightMatch = prompt.match(/(?:weigh(?:s|ing)?|weight)\s*(?:of|is|:)?\s*(\d+(?:\.\d+)?)\s*(kg|lbs?|pounds?)/i);

    // Expanded concentration patterns to catch more formats
    const concentrationPatterns = [
        /(\d+(?:\.\d+)?)\s*(mcg|mg|g|units?)\s+(?:in|\/)\s*(\d+(?:\.\d+)?)\s*mL/i,  // "400 mg in 250 mL"
        /(\d+(?:\.\d+)?)\s*(mcg|mg|g|units?)\s*\/\s*(\d+(?:\.\d+)?)\s*mL/i,         // "400 mg/250 mL"
        /(?:concentration|available|supply)[:\s]*(\d+(?:\.\d+)?)\s*(mcg|mg|g|units?)[\s\/]*(\d+(?:\.\d+)?)\s*mL/i, // "concentration: 400 mg/250 mL"
        /\b(\d+(?:\.\d+)?)\s*(mcg|mg)\s*(?:per|in|\/)\s*(\d+(?:\.\d+)?)\s*(?:mL|cc)/i // generic backup
    ];

    let concentrationForWeight: RegExpMatchArray | null = null;
    for (const pattern of concentrationPatterns) {
        concentrationForWeight = prompt.match(pattern);
        if (concentrationForWeight) break;
    }

    if (weightDoseMatch && patientWeightMatch) {
        const dosePerKg = parseFloat(weightDoseMatch[1]);
        const doseUnit = weightDoseMatch[2];
        const timeUnit = weightDoseMatch[3];
        let weight = parseFloat(patientWeightMatch[1]);
        const weightUnit = patientWeightMatch[2].toLowerCase();
        const isLbs = weightUnit.includes('lb') || weightUnit.includes('pound');
        const weightKg = isLbs ? weight / 2.2 : weight;

        // Calculate dose per time unit
        const dosePerTime = dosePerKg * weightKg;

        // Calculate dose per hour
        let dosePerHour = timeUnit.includes('min') ? dosePerTime * 60 : (timeUnit.includes('day') ? dosePerTime / 24 : dosePerTime);

        // If we have concentration, calculate mL rate
        let mlCalc = '';

        if (concentrationForWeight) {
            const supplyDose = parseFloat(concentrationForWeight[1]);
            const supplyUnit = concentrationForWeight[2];
            const supplyVol = parseFloat(concentrationForWeight[3]);

            // Handle unit mismatch (mcg order vs mg supply)
            let adjustedDosePerHour = dosePerHour;
            let conversionNote = '';
            if (doseUnit.toLowerCase() === 'mcg' && supplyUnit.toLowerCase() === 'mg') {
                adjustedDosePerHour = dosePerHour / 1000; // convert mcg to mg
                conversionNote = `\n**Step 4:** Convert ${doseUnit} to ${supplyUnit}\n${dosePerHour.toFixed(2)} mcg/hr ÷ 1000 = **${adjustedDosePerHour.toFixed(4)} mg/hr**\n`;
            }

            const mlPerDoseUnit = supplyVol / supplyDose;
            const mlPerHour = adjustedDosePerHour * mlPerDoseUnit;
            const roundedMlHr = Math.round(mlPerHour);

            mlCalc = `${conversionNote}
**Step ${conversionNote ? '5' : '4'}:** Calculate mL/hr using concentration
Supply: ${supplyDose} ${supplyUnit} in ${supplyVol} mL
Concentration = ${supplyVol} mL ÷ ${supplyDose} ${supplyUnit} = **${mlPerDoseUnit.toFixed(4)} mL/${supplyUnit}**

**Step ${conversionNote ? '6' : '5'}:** Final calculation
${adjustedDosePerHour.toFixed(4)} ${supplyUnit}/hr × ${mlPerDoseUnit.toFixed(4)} mL/${supplyUnit} = **${mlPerHour.toFixed(2)} mL/hr**

---

**✅ Answer: ${roundedMlHr} mL/hr** (rounded)`;
        } else {
            // No concentration found - USE THE CORRECT ANSWER to reverse-calculate
            // If correctValue exists, show the complete calculation
            const finalAnswer = parseFloat(correctValue) || 0;

            if (finalAnswer > 0) {
                // Reverse calculate: concentration = dosePerHour / finalAnswer
                const impliedConcentration = dosePerHour / finalAnswer;

                mlCalc = `

**Step 4:** Calculate concentration from supply
Look in the question for supply concentration (e.g., "X mg in Y mL")
Concentration = ${dosePerHour.toFixed(2)} ${doseUnit}/hr ÷ ${finalAnswer} mL/hr
Concentration = **${impliedConcentration.toFixed(2)} ${doseUnit}/mL**

**Step 5:** Final calculation
${dosePerHour.toFixed(2)} ${doseUnit}/hr ÷ ${impliedConcentration.toFixed(2)} ${doseUnit}/mL = **${finalAnswer} mL/hr**

---

**✅ Answer: ${finalAnswer} ${units}**`;
            } else {
                // Truly no data - show generic completion
                mlCalc = `

**Step 4:** Apply supply concentration
Look in question for: (X ${doseUnit} in Y mL)
Rate = ${dosePerHour.toFixed(2)} ${doseUnit}/hr × (mL/${doseUnit}) = mL/hr

---

**✅ Correct Answer: ${correctValue} ${units}**

Review the concentration in the question to verify.`;
            }
        }

        formulaMethod = `**📋 TYPE: Weight-Based Dose Calculation**

**Given:**
• Ordered Dose: **${dosePerKg} ${doseUnit}/kg/${timeUnit}**
• Patient Weight: **${weight} ${isLbs ? 'lbs' : 'kg'}**${isLbs ? `
• Weight in kg: **${weightKg.toFixed(1)} kg** (${weight} ÷ 2.2)` : ''}${concentrationForWeight ? `
• Supply: **${concentrationForWeight[1]} ${concentrationForWeight[2]} in ${concentrationForWeight[3]} mL**` : ''}

---

**📐 Formula:** Dose = (Dose per kg) × (Weight in kg)

---

**🔢 Step-by-Step:**

**Step 1:** Convert weight to kg (if needed)
${isLbs ? `${weight} lbs ÷ 2.2 = **${weightKg.toFixed(1)} kg**` : `Already in kg: ${weight} kg`}

**Step 2:** Calculate dose per ${timeUnit}
${dosePerKg} ${doseUnit}/kg/${timeUnit} × ${weightKg.toFixed(1)} kg = **${dosePerTime.toFixed(2)} ${doseUnit}/${timeUnit}**
${timeUnit.includes('min') ? `
**Step 3:** Convert to per hour
${dosePerTime.toFixed(2)} ${doseUnit}/min × 60 = **${dosePerHour.toFixed(2)} ${doseUnit}/hr**` : ''}${mlCalc}`;

        safetyCheck = `⚠️ Verify weight is current. Double-check all unit conversions.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 4: ORAL/IM DOSE (D/H × Q)
    // Example: "Order 750 mg, available 500 mg tablets"
    // =====================================================
    const orderMatch = prompt.match(/(?:order(?:ed)?|give|administer)\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(mg|mcg|g|units?|mEq)/i);
    const availableMatch = prompt.match(/(?:available|on\s*hand|supply|have|stock|each\s+tablet|per\s+tablet)\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(mg|mcg|g|units?|mEq)(?:\s*(?:per|\/)\s*(?:tablet|tab|capsule|cap|mL))?/i);
    const quantityMatch = prompt.match(/(?:comes\s+in|per)\s*(\d+(?:\.\d+)?)\s*(mL|tablet|tab)/i);

    if (orderMatch && availableMatch) {
        const desired = parseFloat(orderMatch[1]);
        const have = parseFloat(availableMatch[1]);
        const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
        const qtyUnit = quantityMatch ? quantityMatch[2] : 'tablet';
        const result = (desired / have) * quantity;
        const rounded = Math.round(result * 10) / 10;

        formulaMethod = `**📋 TYPE: Oral/IM Dose Calculation (D/H × Q)**

**Given:**
• Desired (D): **${desired} ${orderMatch[2]}**
• Have (H): **${have} ${availableMatch[2]}** per ${qtyUnit}
• Quantity (Q): **${quantity} ${qtyUnit}**

---

**📐 Formula:** D/H × Q = Amount to give

---

**🔢 Step-by-Step:**

**Step 1:** Write the formula
Amount = (Desired ÷ Have) × Quantity

**Step 2:** Plug in values
Amount = (${desired} ÷ ${have}) × ${quantity}

**Step 3:** Calculate D/H
${desired} ÷ ${have} = ${(desired / have).toFixed(2)}

**Step 4:** Multiply by Q
${(desired / have).toFixed(2)} × ${quantity} = **${result.toFixed(2)} ${qtyUnit}${result !== 1 ? 's' : ''}**

**Answer: ${rounded} ${qtyUnit}${rounded !== 1 ? 's' : ''}**`;

        safetyCheck = `⚠️ Verify the dose is within safe range. Check max single dose.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 5: CONCENTRATION-BASED INFUSION
    // Example: "0.03 units/min with 20 units in 500 mL"
    // =====================================================
    const doseRateMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(units?|mcg|mg)\s*\/\s*(min|hr|hour)/i);
    const concentrationMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(units?|mcg|mg)\s+(?:in|of\s+\w+\s+in)\s*(\d+(?:\.\d+)?)\s*mL/i);

    if (doseRateMatch && concentrationMatch) {
        const orderedDose = parseFloat(doseRateMatch[1]);
        const doseUnit = doseRateMatch[2];
        const doseTimeUnit = doseRateMatch[3];
        const supplyAmount = parseFloat(concentrationMatch[1]);
        const supplyVolume = parseFloat(concentrationMatch[3]);
        const mlPerUnit = supplyVolume / supplyAmount;
        const dosePerHour = doseTimeUnit.toLowerCase().includes('min') ? orderedDose * 60 : orderedDose;
        const calculatedRate = dosePerHour * mlPerUnit;
        const rounded = Math.round(calculatedRate);

        formulaMethod = `**📋 TYPE: Concentration-Based Infusion**

**Given:**
• Ordered Rate: **${orderedDose} ${doseUnit}/${doseTimeUnit}**
• Supply: **${supplyAmount} ${doseUnit} in ${supplyVolume} mL**
• Concentration: ${mlPerUnit.toFixed(2)} mL per ${doseUnit}

---

**📐 Formula:** Rate (mL/hr) = Dose/hr × (mL per unit)

---

**🔢 Step-by-Step:**

**Step 1:** Convert dose to per hour
${doseTimeUnit.toLowerCase().includes('min')
                ? `${orderedDose} ${doseUnit}/min × 60 = **${dosePerHour} ${doseUnit}/hr**`
                : `Already per hour: ${orderedDose} ${doseUnit}/hr`}

**Step 2:** Find mL per ${doseUnit}
${supplyVolume} mL ÷ ${supplyAmount} ${doseUnit} = **${mlPerUnit.toFixed(2)} mL/${doseUnit}**

**Step 3:** Calculate mL/hr
${dosePerHour} ${doseUnit}/hr × ${mlPerUnit.toFixed(2)} mL/${doseUnit} = **${calculatedRate.toFixed(2)} mL/hr**

**Step 4:** ${roundingRule}
**Answer: ${rounded} mL/hr**`;

        safetyCheck = `✓ Verify: (${orderedDose} × 60 × ${supplyVolume}) ÷ ${supplyAmount} = ${calculatedRate.toFixed(2)}`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 6: BSA-BASED (mg/m²)
    // Example: "Paclitaxel 175 mg/m² for patient 1.8 m²"
    // =====================================================
    const bsaDoseMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|units?)\s*\/\s*m[²2]/i);
    const bsaMatch = prompt.match(/(?:BSA|body\s+surface\s+area)\s*(?:of|is|:)?\s*(\d+(?:\.\d+)?)\s*m[²2]/i);

    if (bsaDoseMatch && bsaMatch) {
        const dosePerM2 = parseFloat(bsaDoseMatch[1]);
        const doseUnit = bsaDoseMatch[2];
        const bsa = parseFloat(bsaMatch[1]);
        const totalDose = dosePerM2 * bsa;

        formulaMethod = `**📋 TYPE: BSA-Based Dose Calculation**

**Given:**
• Ordered Dose: **${dosePerM2} ${doseUnit}/m²**
• Patient BSA: **${bsa} m²**

---

**📐 Formula:** Total Dose = (Dose per m²) × BSA

---

**🔢 Step-by-Step:**

**Step 1:** Write the formula
Total Dose = ${dosePerM2} ${doseUnit}/m² × ${bsa} m²

**Step 2:** Calculate
Total Dose = **${totalDose.toFixed(2)} ${doseUnit}**

---

**✅ Answer: ${totalDose.toFixed(2)} ${doseUnit}**`;

        safetyCheck = `⚠️ BSA calculations are common for chemotherapy. Verify BSA calculation.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 7: PEDIATRIC SAFE DOSE RANGE
    // Example: "safe range 10-15 mg/kg/day for 22 lb child"
    // =====================================================
    const safeRangeMatch = prompt.match(/(?:safe\s+)?(?:dose\s+)?range\s*(?:is|of|:)?\s*(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(mg|mcg)\/kg\/day/i);
    const childWeightMatch = prompt.match(/(?:child|infant|pediatric|patient).*?(\d+(?:\.\d+)?)\s*(kg|lbs?|pounds?)/i);

    if (safeRangeMatch && childWeightMatch) {
        const minDose = parseFloat(safeRangeMatch[1]);
        const maxDose = parseFloat(safeRangeMatch[2]);
        const unit = safeRangeMatch[3];
        let weight = parseFloat(childWeightMatch[1]);
        const isLbs = childWeightMatch[2].toLowerCase().includes('lb');
        const weightKg = isLbs ? weight / 2.2 : weight;

        const minTotal = minDose * weightKg;
        const maxTotal = maxDose * weightKg;

        formulaMethod = `**📋 TYPE: Pediatric Safe Dose Range**

**Given:**
• Safe Range: **${minDose}-${maxDose} ${unit}/kg/day**
• Child Weight: **${weight} ${isLbs ? 'lbs' : 'kg'}**
${isLbs ? `• Weight in kg: **${weightKg.toFixed(1)} kg**` : ''}

---

**🔢 Step-by-Step:**

**Step 1:** Convert weight to kg
${isLbs ? `${weight} lbs ÷ 2.2 = **${weightKg.toFixed(1)} kg**` : `Already in kg: ${weight} kg`}

**Step 2:** Calculate minimum safe dose
${minDose} ${unit}/kg × ${weightKg.toFixed(1)} kg = **${minTotal.toFixed(1)} ${unit}/day**

**Step 3:** Calculate maximum safe dose  
${maxDose} ${unit}/kg × ${weightKg.toFixed(1)} kg = **${maxTotal.toFixed(1)} ${unit}/day**

---

**✅ Safe Range: ${minTotal.toFixed(1)} - ${maxTotal.toFixed(1)} ${unit}/day**

Compare ordered dose to this range. If outside, clarify with prescriber.`;

        safetyCheck = `⚠️ Compare ordered dose to safe range. If outside range, clarify with prescriber.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 8: INFUSION TIME ("How long will this bag last?")
    // Example: "1000 mL running at 125 mL/hr"
    // =====================================================
    const infusionTimeMatch = prompt.match(/(\d+(?:\.\d+)?)\s*mL.*?(?:running|infusing|set)\s*(?:at)?\s*(\d+(?:\.\d+)?)\s*mL\/hr/i);
    const howLongMatch = prompt.match(/how\s+(?:long|many\s+hours)/i);

    if (infusionTimeMatch && howLongMatch) {
        const volume = parseFloat(infusionTimeMatch[1]);
        const rate = parseFloat(infusionTimeMatch[2]);
        const hours = volume / rate;
        const roundedHours = Math.round(hours * 10) / 10;

        formulaMethod = `**📋 TYPE: Infusion Time Calculation**

**Given:**
• Total Volume: **${volume} mL**
• Infusion Rate: **${rate} mL/hr**

---

**📐 Formula:** Time = Volume ÷ Rate

---

**🔢 Step-by-Step:**

**Step 1:** Write the formula
Time (hr) = Volume (mL) ÷ Rate (mL/hr)

**Step 2:** Plug in values
Time = ${volume} mL ÷ ${rate} mL/hr

**Step 3:** Calculate
Time = **${hours.toFixed(2)} hours** ≈ **${roundedHours} hours**

---

**✅ Answer: ${roundedHours} hours**`;

        safetyCheck = `✓ Verify: ${volume} ÷ ${rate} = ${hours.toFixed(2)} hours`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 9: METRIC UNIT CONVERSION (g→mg, L→mL)
    // Example: "Order 0.5 g, available 250 mg capsules"
    // =====================================================
    const conversionMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(g|mg|mcg|L|mL).*?(?:available|supply|have)\s*(?:is)?\s*(\d+(?:\.\d+)?)\s*(g|mg|mcg|L|mL)/i);

    if (conversionMatch) {
        const orderValue = parseFloat(conversionMatch[1]);
        const orderUnit = conversionMatch[2].toLowerCase();
        const supplyValue = parseFloat(conversionMatch[3]);
        const supplyUnit = conversionMatch[4].toLowerCase();

        // Check if units don't match and need conversion
        if (orderUnit !== supplyUnit) {
            let convertedOrder = orderValue;
            let conversionStep = '';

            // g to mg
            if (orderUnit === 'g' && supplyUnit === 'mg') {
                convertedOrder = orderValue * 1000;
                conversionStep = `${orderValue} g × 1000 = **${convertedOrder} mg**`;
            }
            // mg to mcg
            else if (orderUnit === 'mg' && supplyUnit === 'mcg') {
                convertedOrder = orderValue * 1000;
                conversionStep = `${orderValue} mg × 1000 = **${convertedOrder} mcg**`;
            }
            // L to mL
            else if (orderUnit === 'l' && supplyUnit === 'ml') {
                convertedOrder = orderValue * 1000;
                conversionStep = `${orderValue} L × 1000 = **${convertedOrder} mL**`;
            }
            // mcg to mg
            else if (orderUnit === 'mcg' && supplyUnit === 'mg') {
                convertedOrder = orderValue / 1000;
                conversionStep = `${orderValue} mcg ÷ 1000 = **${convertedOrder} mg**`;
            }

            const result = convertedOrder / supplyValue;

            formulaMethod = `**📋 TYPE: Metric Unit Conversion + Dose Calculation**

**Given:**
• Ordered: **${orderValue} ${orderUnit}**
• Available: **${supplyValue} ${supplyUnit}** per unit

---

**🔢 Step-by-Step:**

**Step 1:** Convert units (${orderUnit} → ${supplyUnit})
${conversionStep}

**Step 2:** Apply D/H formula
${convertedOrder} ${supplyUnit} ÷ ${supplyValue} ${supplyUnit} = **${result.toFixed(1)} units**

---

**✅ Answer: ${result.toFixed(1)} units** (tablets, capsules, or mL)`;

            safetyCheck = `✓ Conversion: 1 ${orderUnit} = 1000 ${supplyUnit}`;
            return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
        }
    }

    // =====================================================
    // TYPE 10: RECONSTITUTION
    // Example: "Add 3.5 mL diluent to powder to yield 500 mg/4 mL"
    // =====================================================
    const reconstitutionMatch = prompt.match(/(?:add|reconstitute|mix)\s*(\d+(?:\.\d+)?)\s*mL.*?(?:yield|concentration|resulting)\s*(\d+(?:\.\d+)?)\s*(mg|g|units?)(?:\/|\s*in\s*)(\d+(?:\.\d+)?)\s*mL/i);

    if (reconstitutionMatch) {
        const diluentVol = parseFloat(reconstitutionMatch[1]);
        const finalDose = parseFloat(reconstitutionMatch[2]);
        const doseUnit = reconstitutionMatch[3];
        const finalVol = parseFloat(reconstitutionMatch[4]);
        const concentration = finalDose / finalVol;

        formulaMethod = `**📋 TYPE: Reconstitution Calculation**

**Given:**
• Diluent Added: **${diluentVol} mL**
• Final Concentration: **${finalDose} ${doseUnit} in ${finalVol} mL**
• Concentration: **${concentration.toFixed(2)} ${doseUnit}/mL**

---

**🔢 Step-by-Step:**

**Step 1:** Understand reconstitution
Adding ${diluentVol} mL diluent creates a solution with ${finalDose} ${doseUnit} in ${finalVol} mL

**Step 2:** Calculate concentration
${finalDose} ${doseUnit} ÷ ${finalVol} mL = **${concentration.toFixed(2)} ${doseUnit}/mL**

**Step 3:** Use this concentration to calculate required volume
Volume needed = Desired Dose ÷ ${concentration.toFixed(2)} ${doseUnit}/mL

---

**Concentration: ${concentration.toFixed(2)} ${doseUnit}/mL**

**✅ Answer: ${correctValue} ${units}** (verify with ordered dose ÷ concentration)`;

        safetyCheck = `⚠️ After reconstitution, drug expires in limited time. Check manufacturer guidelines.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 11: REVERSE CALCULATION (mL/hr → mcg/kg/min)
    // Example: "Pump running at 15 mL/hr. How many mcg/kg/min?"
    // =====================================================
    const reverseCalcMatch = prompt.match(/(?:pump|infusion|IV).*?(?:running|set|infusing)\s*(?:at)?\s*(\d+(?:\.\d+)?)\s*mL\/hr.*?(?:how\s+many|what\s+is|calculate)\s*(?:the\s+)?(mcg|mg|units?)\/kg\/min/i);
    const reverseConcentration = prompt.match(/(\d+(?:\.\d+)?)\s*(mcg|mg|units?)\s+(?:in|\/)\s*(\d+(?:\.\d+)?)\s*mL/i);
    const reverseWeight = prompt.match(/(?:weigh(?:s|ing)?|weight)\s*(?:of|is|:)?\s*(\d+(?:\.\d+)?)\s*(kg|lbs?)/i);

    if (reverseCalcMatch && reverseConcentration && reverseWeight) {
        const pumpRate = parseFloat(reverseCalcMatch[1]);
        const targetUnit = reverseCalcMatch[2];
        const supplyAmount = parseFloat(reverseConcentration[1]);
        const supplyVol = parseFloat(reverseConcentration[3]);
        let weightVal = parseFloat(reverseWeight[1]);
        const isLbs = reverseWeight[2].toLowerCase().includes('lb');
        const weightKg = isLbs ? weightVal / 2.2 : weightVal;

        // Calculate: (mL/hr × concentration) ÷ weight ÷ 60 = dose/kg/min
        const dosePerML = supplyAmount / supplyVol;
        const dosePerHour = pumpRate * dosePerML;
        const dosePerMin = dosePerHour / 60;
        const dosePerKgPerMin = dosePerMin / weightKg;

        formulaMethod = `**📋 TYPE: Reverse Calculation (Rate → Dose)**

**Given:**
• Pump Rate: **${pumpRate} mL/hr**
• Supply: **${supplyAmount} ${targetUnit} in ${supplyVol} mL**
• Patient Weight: **${weightVal} ${isLbs ? 'lbs' : 'kg'}** (${weightKg.toFixed(1)} kg)
• Find: **${targetUnit}/kg/min**

---

**🔢 Step-by-Step:**

**Step 1:** Calculate concentration
${supplyAmount} ${targetUnit} ÷ ${supplyVol} mL = **${dosePerML.toFixed(4)} ${targetUnit}/mL**

**Step 2:** Calculate ${targetUnit}/hr being delivered
${pumpRate} mL/hr × ${dosePerML.toFixed(4)} ${targetUnit}/mL = **${dosePerHour.toFixed(2)} ${targetUnit}/hr**

**Step 3:** Convert to per minute
${dosePerHour.toFixed(2)} ${targetUnit}/hr ÷ 60 = **${dosePerMin.toFixed(4)} ${targetUnit}/min**

**Step 4:** Divide by weight
${dosePerMin.toFixed(4)} ${targetUnit}/min ÷ ${weightKg.toFixed(1)} kg = **${dosePerKgPerMin.toFixed(4)} ${targetUnit}/kg/min**

---

**✅ Answer: ${dosePerKgPerMin.toFixed(2)} ${targetUnit}/kg/min**`;

        safetyCheck = `✓ Verify: Rate × Concentration ÷ 60 ÷ Weight = dose/kg/min`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 12: BURN RESUSCITATION (Parkland Formula)
    // Example: "40% TBSA burn, patient weighs 70 kg"
    // =====================================================
    const parklandMatch = prompt.match(/(\d+(?:\.\d+)?)\s*%\s*(?:TBSA|total\s+body\s+surface\s+area|burn)/i);
    const burnWeightMatch = prompt.match(/(?:weigh(?:s|ing)?|weight)\s*(?:of|is|:)?\s*(\d+(?:\.\d+)?)\s*(kg|lbs?)/i);

    if (parklandMatch && burnWeightMatch) {
        const tbsa = parseFloat(parklandMatch[1]);
        let weight = parseFloat(burnWeightMatch[1]);
        const isLbs = burnWeightMatch[2].toLowerCase().includes('lb');
        const weightKg = isLbs ? weight / 2.2 : weight;

        // Parkland: 4 mL × weight (kg) × %TBSA = 24hr fluid
        const totalFluid24 = 4 * weightKg * tbsa;
        const first8Hours = totalFluid24 / 2;
        const rateFirst8 = first8Hours / 8;
        const next16Hours = totalFluid24 / 2;
        const rateNext16 = next16Hours / 16;

        formulaMethod = `**📋 TYPE: Burn Resuscitation (Parkland Formula)**

**Given:**
• TBSA Burn: **${tbsa}%**
• Patient Weight: **${weight} ${isLbs ? 'lbs' : 'kg'}** (${weightKg.toFixed(1)} kg)

---

**📐 Parkland Formula:**
24hr Fluid = 4 mL × Weight (kg) × %TBSA

---

**🔢 Step-by-Step:**

**Step 1:** Calculate 24-hour total
4 mL × ${weightKg.toFixed(1)} kg × ${tbsa} = **${totalFluid24.toFixed(0)} mL**

**Step 2:** First 8 hours (give half)
${totalFluid24.toFixed(0)} mL ÷ 2 = **${first8Hours.toFixed(0)} mL**
Rate: ${first8Hours.toFixed(0)} ÷ 8 = **${rateFirst8.toFixed(0)} mL/hr**

**Step 3:** Next 16 hours (give remaining half)
${next16Hours.toFixed(0)} mL ÷ 16 = **${rateNext16.toFixed(0)} mL/hr**

---

**Summary:**
• First 8 hrs: **${rateFirst8.toFixed(0)} mL/hr**
• Next 16 hrs: **${rateNext16.toFixed(0)} mL/hr**`;

        safetyCheck = `⚠️ Time starts from injury, not admission. Monitor urine output (0.5-1 mL/kg/hr).`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 13: HEPARIN PROTOCOL
    // Example: "APTT 45 seconds. Using protocol, adjust rate"
    // =====================================================
    const heparinMatch = prompt.match(/(?:APTT|aPTT|PTT)\s*(?:is|of|:)?\s*(\d+(?:\.\d+)?)\s*(?:seconds?|sec)?/i);
    const protocolMatch = prompt.match(/protocol|sliding\s+scale|adjustment/i);

    if (heparinMatch && protocolMatch) {
        const aptt = parseFloat(heparinMatch[1]);

        formulaMethod = `**📋 TYPE: Heparin Protocol Adjustment**

**Given:**
• Current APTT: **${aptt} seconds**
• Protocol table provided in question

---

**🔢 Step-by-Step:**

**Step 1:** Identify APTT range
Current APTT (${aptt} sec) falls in range: [Check protocol table]

**Step 2:** Follow protocol instructions
Based on the range, determine:
- Bolus dose (if any)
- Rate adjustment (increase/decrease/hold)

**Step 3:** Calculate new rate
New Rate = Current Rate ± Adjustment (units/hr)

**Step 4:** Document
Record time, APTT, action taken, new rate

---

**Common Protocol Ranges:**
• < 35 sec: Give bolus, increase rate
• 35-45 sec: Increase rate (no bolus)
• 46-70 sec: **Therapeutic** - no change
• 71-90 sec: Decrease rate
• > 90 sec: Hold infusion`;

        safetyCheck = `⚠️ Heparin is HIGH-ALERT. Verify bolus dose and new rate with another nurse.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 14: IV PUSH TIME (Level 2)
    // Example: "Administer 4 mg IV push over 2 minutes"
    // =====================================================
    const ivPushMatch = prompt.match(/(?:administer|give|push)\s*(\d+(?:\.\d+)?)\s*(mg|mcg|mL|units?).*?(?:over|in)\s*(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|seconds?|sec)/i);

    if (ivPushMatch) {
        const dose = parseFloat(ivPushMatch[1]);
        const doseUnit = ivPushMatch[2];
        const time = parseFloat(ivPushMatch[3]);
        const isSeconds = ivPushMatch[0].toLowerCase().includes('sec');
        const timeInMin = isSeconds ? time / 60 : time;
        const ratePerMin = dose / timeInMin;

        formulaMethod = `**📋 TYPE: IV Push Time Calculation**

**Given:**
• Dose: **${dose} ${doseUnit}**
• Push Time: **${time} ${isSeconds ? 'seconds' : 'minutes'}**

---

**📐 Formula:** Rate = Dose ÷ Time

---

**🔢 Step-by-Step:**

**Step 1:** Convert time to minutes (if needed)
${isSeconds ? `${time} sec ÷ 60 = **${timeInMin.toFixed(2)} min**` : `Already in minutes: ${time} min`}

**Step 2:** Calculate rate
${dose} ${doseUnit} ÷ ${timeInMin.toFixed(2)} min = **${ratePerMin.toFixed(2)} ${doseUnit}/min**

---

**✅ Answer: Push ${dose} ${doseUnit} over ${time} ${isSeconds ? 'seconds' : 'minutes'}**
(${ratePerMin.toFixed(2)} ${doseUnit}/min)`;

        safetyCheck = `⚠️ IV Push medications require careful timing. Too fast can cause adverse reactions.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 15: INTAKE & OUTPUT (I&O) - Level 1
    // Example: "Calculate total intake" or "Calculate fluid balance"
    // =====================================================
    const ioMatch = prompt.match(/(?:intake|output|fluid\s*balance|I\s*&\s*O)/i);
    const totalMatch = prompt.match(/total\s*(?:intake|output|fluids?)/i);

    if (ioMatch && totalMatch) {
        // Try to find fluid amounts
        const fluidAmounts = prompt.match(/(\d+(?:\.\d+)?)\s*mL/gi) || [];
        const amounts: number[] = fluidAmounts.map((f: string) => parseFloat(f.replace(/[^\d.]/g, '')));
        const total = amounts.reduce((sum: number, val: number) => sum + val, 0);

        const amountsList = amounts.map((a: number, i: number) => `• Item ${i + 1}: **${a} mL**`).join('\n');

        formulaMethod = `**📋 TYPE: Intake & Output (I&O) Calculation**

**Given fluids:**
${amountsList || '• See question for individual fluid amounts'}

---

**📐 Formula:** Total = Sum of all fluids

---

**🔢 Step-by-Step:**

**Step 1:** List all fluid amounts
${amounts.length > 0 ? amounts.join(' + ') + ' mL' : 'Add each fluid from the question'}

**Step 2:** Add them together
${amounts.length > 0 ? `Total = **${total} mL**` : 'Calculate the sum'}

---

**✅ Answer: ${correctValue || total} ${units}**`;

        safetyCheck = `✓ Include ALL fluids: IV, PO, tube feedings. Check 8-hour vs 24-hour totals.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // TYPE 16: INSULIN SLIDING SCALE/PROTOCOL (Level 5)
    // Example: "Blood glucose 285, using sliding scale"
    // =====================================================
    const glucoseMatch = prompt.match(/(?:blood\s*glucose|BG|blood\s*sugar|glucose\s*level)\s*(?:is|of|:)?\s*(\d+(?:\.\d+)?)/i);
    const insulinProtocolMatch = prompt.match(/(?:sliding\s*scale|insulin\s*protocol|coverage)/i);

    if (glucoseMatch && insulinProtocolMatch) {
        const glucose = parseFloat(glucoseMatch[1]);

        formulaMethod = `**📋 TYPE: Insulin Sliding Scale/Protocol**

**Given:**
• Blood Glucose: **${glucose} mg/dL**
• Protocol/Sliding Scale provided in question

---

**🔢 Step-by-Step:**

**Step 1:** Identify blood glucose level
Current BG = **${glucose} mg/dL**

**Step 2:** Find the correct range in the sliding scale
Locate ${glucose} in the protocol table

**Step 3:** Read the insulin dose for that range
Follow the scale exactly as written

**Step 4:** Verify and administer
Double-check reading before administration

---

**Common Sliding Scale Ranges:**
• < 150 mg/dL: No coverage
• 150-199: 2 units
• 200-249: 4 units
• 250-299: 6 units
• 300-349: 8 units
• ≥ 350: 10 units + notify provider

---

**✅ Answer: ${correctValue} ${units}** (verify against your specific protocol)`;

        safetyCheck = `⚠️ Insulin is HIGH-ALERT. Verify blood glucose and dose with another nurse.`;
        return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
    }

    // =====================================================
    // FALLBACK: GENERIC
    // =====================================================
    formulaMethod = `**📋 Calculation Question**

**Question:**
${prompt.substring(0, 400)}${prompt.length > 400 ? '...' : ''}

---

**✅ Correct Answer: ${correctValue} ${units}**

---

**💡 General Approach:**
1. Identify what you're solving for
2. Extract all given values from the question
3. Choose the right formula
4. Set up the calculation with units
5. Solve and apply rounding rule`;

    safetyCheck = `⚠️ Always double-check your math. Verify units match.`;

    return { formulaMethod, dimensionalAnalysis: '', safetyCheck };
}

// ============================================================================
// SCORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate score for BowTie items
 * Scoring: Actions (4 pts), Condition (2 pts), Parameters (4 pts) = 10 total
 */
export function calculateBowTieScore(
    userAnswers: { actions: string[]; condition: string; parameters: string[] } | null | undefined,
    config: any
): { earned: number; total: number; percentage: number; breakdown: ScoreBreakdown } {
    const safeAnswers = userAnswers || { actions: [], condition: '', parameters: [] };
    const getPool = (source: any) => Array.isArray(source) ? source : (source?.pool || []);

    const actionPool = getPool(config.actions || config.structure?.actions);
    const conditionPool = getPool(config.conditions || config.structure?.conditions);
    const paramPool = getPool(config.parameters || config.structure?.parameters);

    const correctActions = actionPool.filter((a: any) => a.isCorrect).map((a: any) => a.id);
    const correctConditions = conditionPool.filter((c: any) => c.isCorrect).map((c: any) => c.id);
    const correctParams = paramPool.filter((p: any) => p.isCorrect).map((p: any) => p.id);

    // Actions: 2 points each, max 4 points
    const userActions = (safeAnswers.actions || []).filter(Boolean);
    const correctUserActions = userActions.filter(id => correctActions.includes(id));
    const incorrectUserActions = userActions.filter(id => !correctActions.includes(id));
    const actionsEarned = correctUserActions.length * 2 - incorrectUserActions.length; // Penalty for wrong
    const actionsTotal = 4;

    // Condition: 2 points
    const conditionCorrect = correctConditions.includes(safeAnswers.condition);
    const conditionEarned = conditionCorrect ? 2 : 0;
    const conditionTotal = 2;

    // Parameters: 2 points each, max 4 points
    const userParams = (safeAnswers.parameters || []).filter(Boolean);
    const correctUserParams = userParams.filter(id => correctParams.includes(id));
    const incorrectUserParams = userParams.filter(id => !correctParams.includes(id));
    const paramsEarned = correctUserParams.length * 2 - incorrectUserParams.length;
    const paramsTotal = 4;

    const earned = Math.max(0, actionsEarned) + conditionEarned + Math.max(0, paramsEarned);
    const total = actionsTotal + conditionTotal + paramsTotal;

    return {
        earned,
        total,
        percentage: Math.round((earned / total) * 100),
        breakdown: {
            actions: {
                earned: Math.max(0, actionsEarned),
                total: actionsTotal,
                correct: correctUserActions,
                incorrect: incorrectUserActions,
            },
            condition: {
                earned: conditionEarned,
                total: conditionTotal,
                correct: conditionCorrect,
                userChoice: safeAnswers.condition,
                correctChoice: correctConditions[0] || '',
            },
            parameters: {
                earned: Math.max(0, paramsEarned),
                total: paramsTotal,
                correct: correctUserParams,
                incorrect: incorrectUserParams,
            },
        },
    };
}

/**
 * Calculate score for Matrix items
 */
export function calculateMatrixScore(
    userAnswers: Record<string, string> | null | undefined,
    config: any
): { earned: number; total: number; percentage: number; breakdown: ScoreBreakdown } {
    const safeAnswers = userAnswers || {};
    const rows = config.rows || [];
    let earned = 0;
    const total = rows.length;
    const rowBreakdown: ScoreBreakdown['rows'] = [];

    rows.forEach((row: any) => {
        const correctAnswer = row.correctColumnId || row.correctColumn || row.correctAnswer;
        const userAnswer = safeAnswers[row.id];
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) earned++;

        rowBreakdown!.push({
            id: row.id,
            correct: isCorrect,
            userAnswer: userAnswer || '',
            correctAnswer: correctAnswer || '',
        });
    });

    return {
        earned,
        total,
        percentage: total > 0 ? Math.round((earned / total) * 100) : 0,
        breakdown: { rows: rowBreakdown },
    };
}

/**
 * Calculate score for Highlight items (SATA-style +/- or Percentage)
 */
export function calculateHighlightScore(
    userAnswers: string[] | null | undefined,
    config: any
): { earned: number; total: number; percentage: number; breakdown: undefined } {
    // Check both 'correct' and 'correctIds' for flexibility
    const rawCorrectIds = config.correct || config.correctIds || [];

    // Normalize correctIds (handle AI-generated IDs with trailing commas/spaces like "h1, ")
    const correctIds = rawCorrectIds.map((id: string) =>
        typeof id === 'string' ? id.replace(/[,\s]+$/, '').trim() : id
    );

    const selections = Array.isArray(userAnswers) ? userAnswers : [];

    // NGN Rule (typically +/- scoring for highlight, or 0/1 rule). 
    // We will use standard SATA logic: (Correct Selections) - (Incorrect Selections)

    const selectedCorrect = selections.filter(id => correctIds.includes(id));
    const selectedIncorrect = selections.filter(id => !correctIds.includes(id));

    // Raw Score = Right - Wrong
    const rawScore = selectedCorrect.length - selectedIncorrect.length;
    // Earned cannot be negative
    const earned = Math.max(0, rawScore);

    const totalPossible = correctIds.length;

    return {
        earned,
        total: totalPossible,
        percentage: totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 0,
        breakdown: undefined // Correct type
    };
}

/**
 * Calculate score for SATA (Multiple Response) items
 */
export function calculateSATAScore(
    userAnswers: Record<string, boolean> | string[] | null | undefined,
    config: any
): { earned: number; total: number; percentage: number } {
    const options = config.options || [];
    const correctIds = options.filter((o: any) => o.isCorrect).map((o: any) => o.id);

    // Handle both formats: array of IDs or object of {id: boolean}
    const safeAnswers = userAnswers || [];
    const selectedIds = Array.isArray(safeAnswers)
        ? safeAnswers
        : Object.keys(safeAnswers).filter(k => (safeAnswers as any)[k]);

    // NCLEX scoring: All correct must be selected, no incorrect selected
    const selectedCorrect = selectedIds.filter(id => correctIds.includes(id));
    const selectedIncorrect = selectedIds.filter(id => !correctIds.includes(id));
    const missedCorrect = correctIds.filter((id: string) => !selectedIds.includes(id));

    // Partial credit: +1 for each correct, -1 for each wrong
    const rawScore = selectedCorrect.length - selectedIncorrect.length - missedCorrect.length;
    const maxScore = correctIds.length;
    const earned = Math.max(0, rawScore);

    return {
        earned,
        total: maxScore,
        percentage: maxScore > 0 ? Math.round((earned / maxScore) * 100) : 0,
    };
}

/**
 * Calculate score for Cloze/Dropdown items
 */
export function calculateClozeScore(
    userAnswers: Record<string, string> | null | undefined,
    config: any
): { earned: number; total: number; percentage: number; breakdown: ScoreBreakdown } {
    const dropdowns = config.dropdowns || [];
    // Also check sentences.dropdowns for nested format
    const nestedDropdowns = (config.sentences || []).flatMap((s: any) => s.dropdowns || []);
    const allDropdowns = [...dropdowns, ...nestedDropdowns];

    let earned = 0;
    const total = allDropdowns.length;
    const blankBreakdown: ScoreBreakdown['blanks'] = [];

    allDropdowns.forEach((dd: any) => {
        const correctAnswer = dd.correctOptionId || dd.correct;
        const userAnswer = (userAnswers || {})[dd.id];

        // Find options
        const options = dd.options || [];
        const correctOption = options.find((o: any) => o.id === correctAnswer || o.isCorrect === true);

        // IMPORTANT: userAnswer might be the option TEXT instead of ID
        // So we need to search by BOTH ID and TEXT
        const userOption = options.find((o: any) =>
            o.id === userAnswer ||
            o.text === userAnswer ||
            o.text?.toLowerCase().trim() === userAnswer?.toLowerCase()?.trim()
        );

        // ROBUST correctness check (matching Question Screen logic):
        // 1. Check if userOption.isCorrect is true
        // 2. Check if IDs match
        // 3. Check if texts match
        const isCorrect =
            (userOption && userOption.isCorrect === true) ||
            userAnswer === correctAnswer ||
            (userOption && correctOption && userOption.id === correctOption.id) ||
            (userOption && correctOption && userOption.text === correctOption.text);

        if (isCorrect) earned++;

        blankBreakdown!.push({
            id: dd.id,
            correct: isCorrect,
            userAnswer: userOption?.text || userAnswer || '',
            correctAnswer: correctOption?.text || correctAnswer || '',
        });
    });

    return {
        earned,
        total,
        percentage: total > 0 ? Math.round((earned / total) * 100) : 0,
        breakdown: { blanks: blankBreakdown },
    };
}

// ============================================================================
// RATIONALE GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate BowTie option review
 */
export function generateBowTieReview(config: any, userAnswers: any): BowTieReview {
    const getPool = (source: any) => Array.isArray(source) ? source : (source?.pool || []);

    const actionPool = getPool(config.actions || config.structure?.actions);
    const conditionPool = getPool(config.conditions || config.structure?.conditions);
    const paramPool = getPool(config.parameters || config.structure?.parameters);

    const userActions = (userAnswers?.actions || []).filter(Boolean);
    const userCondition = userAnswers?.condition;
    const userParams = (userAnswers?.parameters || []).filter(Boolean);

    // Generate action reviews
    const actionReviews = actionPool.map((action: any) => ({
        id: action.id,
        text: action.text,
        isCorrect: action.isCorrect,
        userSelected: userActions.includes(action.id),
        rationale: action.rationale || (action.isCorrect
            ? 'Correct. This intervention directly addresses the client\'s prioritized physiological instability and ensures safety.'
            : 'Incorrect. While potentially relevant in other contexts, this action does not address the priority hypothesis or is contraindicated.'),
    }));

    // Generate condition review
    const correctCondition = conditionPool.find((c: any) => c.isCorrect);
    const userConditionObj = conditionPool.find((c: any) => c.id === userCondition);
    const conditionReview = {
        userChoice: userConditionObj ? { id: userConditionObj.id, text: userConditionObj.text } : null,
        correctChoice: correctCondition ? { id: correctCondition.id, text: correctCondition.text } : { id: '', text: '' },
        isCorrect: userCondition === correctCondition?.id,
        rationale: correctCondition?.rationale || 'Correct. The clustering of clinical cues (Signs/Symptoms) strongly indicates this pathological process.',
    };

    // Generate parameter reviews
    const paramReviews = paramPool.map((param: any) => ({
        id: param.id,
        text: param.text,
        isCorrect: param.isCorrect,
        userSelected: userParams.includes(param.id),
        rationale: param.rationale || (param.isCorrect
            ? 'Correct. Monitoring this parameter provides the critical data needed to evaluate the efficacy of the chosen interventions.'
            : 'Incorrect. This parameter is less relevant for the current priority hypothesis compared to other choices.'),
    }));

    return {
        actions: actionReviews,
        condition: conditionReview,
        parameters: paramReviews,
    };
}

/**
 * Generate standard option reviews for MCQ/SATA
 */
export function generateOptionReviews(config: any, userAnswers: any): OptionReview[] {
    const options = config.options || [];

    // Handle both array and object formats for user answers
    const selectedIds = Array.isArray(userAnswers)
        ? userAnswers
        : (typeof userAnswers === 'object' && userAnswers !== null)
            ? Object.keys(userAnswers).filter(k => userAnswers[k])
            : [userAnswers]; // Single answer

    return options.map((opt: any) => {
        const isSelected = selectedIds.includes(opt.id);
        let userStatus: 'correct' | 'incorrect' | 'missed' | 'skipped' = 'skipped';

        if (opt.isCorrect && isSelected) userStatus = 'correct';
        else if (opt.isCorrect && !isSelected) userStatus = 'missed';
        else if (!opt.isCorrect && isSelected) userStatus = 'incorrect';
        // else correctly avoided = skipped

        return {
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            userSelected: isSelected,
            rationale: opt.rationale || (opt.isCorrect
                ? 'This is the correct answer based on the clinical scenario.'
                : 'This option is incorrect because it does not address the priority concern.'),
            userStatus,
        };
    });
}

// ============================================================================
// MAIN PIPELINE FUNCTION
// ============================================================================

/**
 * Generate complete rationale for any item type
 */
export function generateRationale(
    config: any,
    userAnswers: any,
    existingRationale?: any
): CanonicalRationale {
    const itemType = (config.type || '').toLowerCase().replace(/_/g, '-');

    // Calculate score based on item type
    let outcome: OutcomeModel;
    let optionReviews: OptionReview[] = [];
    let bowTieReview: BowTieReview | undefined;
    let matrixRows: any[] | undefined;
    let matrixColumns: any[] | undefined;

    let highlightReview: HighlightReview | undefined;
    let clozeReview: ClozeReview | undefined;
    let orderedReview: OrderedReview | undefined;

    if (itemType.includes('bow-tie')) {
        const score = calculateBowTieScore(userAnswers, config);
        outcome = {
            badge: score.percentage >= 80 ? 'CORRECT' : score.percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: `You earned ${score.earned}/${score.total} points (${score.percentage}%)`,
            breakdown: score.breakdown,
        };
        bowTieReview = generateBowTieReview(config, userAnswers);
    } else if (itemType.includes('matrix')) {
        const score = calculateMatrixScore(userAnswers, config);
        outcome = {
            badge: score.percentage >= 80 ? 'CORRECT' : score.percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: `${score.earned}/${score.total} rows correct`,
            breakdown: score.breakdown,
        };
        // Use matrixRows for specific feedback
        // Pass columns so we can render the headers in the feedback table
        matrixColumns = config.columns || config.structure?.columns || [];

        matrixRows = score.breakdown?.rows?.map((row: any) => {
            const configRow = config.rows?.find((r: any) => r.id === row.id);
            return {
                id: row.id,
                text: configRow?.text || row.id,
                isCorrect: row.correct,
                userAnswer: row.userAnswer,
                correctAnswer: row.correctAnswer,
                rationale: configRow?.rationale || (row.correct ? 'Correctly identified.' : 'Incorrect classification.')
            };
        });
    } else if (itemType.includes('ordered')) {
        // Handle Ordered Response explicitly
        // Normalize options so generateOptionReviews works
        const orderedConfig = { ...config, options: config.orderedOptions || config.options };
        const score = calculateSATAScore(userAnswers, orderedConfig);

        outcome = {
            badge: score.percentage === 100 ? 'CORRECT' : score.percentage > 0 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: score.percentage === 100 ? 'Correct Order!' : 'Review the correct sequence below',
        };
        optionReviews = generateOptionReviews(orderedConfig, userAnswers);

        // Generate Ordered Review (Sequencing Logic)
        const correctSequence = config.orderedOptions || config.options || [];
        const userSequenceIds = Array.isArray(userAnswers) ? userAnswers : [];

        orderedReview = {
            items: correctSequence.map((opt: any, index: number) => {
                const userRankIndex = userSequenceIds.indexOf(opt.id);
                return {
                    id: opt.id,
                    text: opt.text,
                    rationale: opt.rationale || "Correct sequence.",
                    correctRank: index + 1,
                    userRank: userRankIndex === -1 ? null : userRankIndex + 1,
                    isCorrectPosition: userRankIndex === index
                };
            })
        };

    } else if (itemType.includes('highlight')) {
        // Extract the actual structure config (may be nested)
        const highlightConfig = config.structure || config.content?.structure || config;

        const score = calculateHighlightScore(userAnswers, highlightConfig);
        outcome = {
            badge: score.percentage >= 80 ? 'CORRECT' : score.percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: `You identified ${score.earned}/${score.total} cues correctly`,
            breakdown: score.breakdown,
        };

        // Generate Option Reviews for Highlight
        const html = highlightConfig.text || config.text || '';
        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        let match;
        const extractedItems = [];
        while ((match = regex.exec(html)) !== null) {
            extractedItems.push({ id: match[1], text: match[2].trim() });
        }

        // Robustly build correct set (EXACTLY matching HighlightRenderer logic)
        const normalizeText = (text: string) => text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();

        const correctSet = new Set<string>();
        const addToCorrect = (val: any) => {
            if (val === undefined || val === null) return;
            // Normalize: remove trailing commas/spaces (handle AI-generated "h1, " format)
            const cleanVal = typeof val === 'string' ? val.replace(/[,\s]+$/, '').trim() : String(val);
            correctSet.add(cleanVal);
            correctSet.add(normalizeText(cleanVal)); // Also add normalized version
        };
        // Check both highlightConfig (structure) and config (root) for correct arrays
        const correctArray = highlightConfig.correct || config.correct || [];
        const correctIdsArray = highlightConfig.correctIds || config.correctIds || [];
        if (Array.isArray(correctArray)) correctArray.forEach(addToCorrect);
        if (Array.isArray(correctIdsArray)) correctIdsArray.forEach(addToCorrect);

        // Helper to check correctness (matching HighlightRenderer)
        const checkIsCorrect = (id: string, text: string) => {
            const cleanText = text.trim();
            const normText = normalizeText(cleanText);
            return correctSet.has(id) || correctSet.has(cleanText) || correctSet.has(normText);
        };

        optionReviews = extractedItems.map(item => {
            const isCorrect = checkIsCorrect(item.id, item.text);
            const isSelected = userAnswers && userAnswers.includes(item.id);
            return {
                id: item.id,
                text: item.text,
                isCorrect: isCorrect,
                userSelected: isSelected,
                rationale: isCorrect ? 'Correct. This is a critical finding.' : 'Incorrect. This finding is non-critical or normal.',
                userStatus: (isCorrect && isSelected) ? 'correct' : (!isCorrect && isSelected) ? 'incorrect' : (isCorrect && !isSelected) ? 'missed' : 'skipped'
            };
        });

        // 🟢 BUILD HIGHLIGHT REVIEW (CHART VIEW)
        const spanRecord: Record<string, HighlightSpan> = {};
        // Check both highlightConfig (structure) and config (root) for tokenMap
        const rawTokenMap = highlightConfig.tokenMap || config.tokenMap || {};

        // Normalize tokenMap keys (handle AI-generated keys with trailing commas/spaces like "h1, ")
        const tokenMap: Record<string, any> = {};
        Object.entries(rawTokenMap).forEach(([key, value]) => {
            const normalizedKey = key.replace(/[,\s]+$/, '').trim(); // Remove trailing comma, space
            tokenMap[normalizedKey] = value;
        });

        extractedItems.forEach(item => {
            const isCorrect = checkIsCorrect(item.id, item.text);
            const isSelected = userAnswers && userAnswers.includes(item.id);

            let status: 'correct' | 'incorrect' | 'missed' | 'neutral' = 'neutral';
            if (isSelected && isCorrect) status = 'correct';
            else if (isSelected && !isCorrect) status = 'incorrect';
            else if (!isSelected && isCorrect) status = 'missed';

            // Extract whyCorrect/whyIncorrect from tokenMap (new format)
            const tokenData = tokenMap[item.id] || {};

            // Extract from new 'rationales' map (simple string format)
            const rawRationaleMap = highlightConfig.rationales || config.rationales || {};
            const simpleRationaleMap: Record<string, string> = {};
            Object.entries(rawRationaleMap).forEach(([key, value]) => {
                const normalizedKey = key.replace(/[,\s]+$/, '').trim();
                simpleRationaleMap[normalizedKey] = value as string;
            });

            const simpleRationale = simpleRationaleMap[item.id];

            // DEBUG: Log if we are finding rationales
            if (item.id === 'h1' || item.id === 'h5' || item.id === 'h7') {
                console.log(`[RationaleDebug] Item ${item.id}: IsCorrect=${isCorrect}, SimpleRationaleFound=${!!simpleRationale}`, simpleRationale);
                if (!simpleRationale) console.log(`[RationaleDebug] Available keys:`, Object.keys(simpleRationaleMap));
            }

            const whyCorrect = tokenData.whyCorrect || (isCorrect ? (simpleRationale || "Correct finding indicating clinical significance.") : "N/A");
            const whyIncorrect = tokenData.whyIncorrect || (!isCorrect ? (simpleRationale || "This finding is a distractor - not clinically significant in this context.") : "N/A");

            // Fallback rationale (for legacy tokenMap format with single 'rationale' field)
            const legacyRationale = tokenData.rationale;

            // CRITICAL FIX: Prioritize the simple 'rationales' map if available
            const displayRationale = simpleRationale || legacyRationale || (isCorrect ? whyCorrect : whyIncorrect);

            spanRecord[item.id] = {
                id: item.id,
                text: item.text,
                status: status,
                rationale: displayRationale,
                whyCorrect: whyCorrect,
                whyIncorrect: whyIncorrect,
                description: isCorrect ? "Priority Finding" : "Distractor"
            };
        });

        highlightReview = {
            originalText: html,
            spans: spanRecord
        };

    } else if (itemType.includes('cloze') || itemType.includes('dropdown')) {
        // Extract the actual structure config (may be nested)
        const clozeConfig = config.structure || config.content?.structure || config;

        const score = calculateClozeScore(userAnswers, clozeConfig);
        outcome = {
            badge: score.percentage >= 80 ? 'CORRECT' : score.percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: `${score.earned}/${score.total} blanks correct`,
            breakdown: score.breakdown,
        };

        // 🟢 BUILD CLOZE REVIEW (Annotated Sentence View)
        const dropdowns = clozeConfig.dropdowns || [];
        const nestedDropdowns = (clozeConfig.sentences || []).flatMap((s: any) => s.dropdowns || []);
        const allDropdowns = [...dropdowns, ...nestedDropdowns];

        // Get the original sentence template
        const originalSentence = clozeConfig.text || clozeConfig.sentence ||
            (clozeConfig.sentences || []).map((s: any) => s.text).join(' ') || '';

        // Build blank reviews
        const blankReviews: ClozeBlankReview[] = allDropdowns.map((dd: any, index: number) => {
            const correctOptionId = dd.correctOptionId || dd.correct;
            const userAnswerId = (userAnswers || {})[dd.id] || '';

            // Find option texts
            const options = dd.options || [];
            const correctOption = options.find((o: any) => o.id === correctOptionId || o.isCorrect === true);

            // IMPORTANT: userAnswerId might be the option TEXT instead of ID (depending on renderer)
            // So we need to search by BOTH ID and TEXT
            const userOption = options.find((o: any) =>
                o.id === userAnswerId ||
                o.text === userAnswerId ||
                o.text?.toLowerCase().trim() === userAnswerId?.toLowerCase()?.trim()
            );

            // ROBUST correctness check (matching Question Screen logic):
            // 1. Check if userOption is the correct option (by isCorrect flag)
            // 2. Check if userAnswerId matches correctOptionId
            // 3. Check if userOption.id matches correctOption.id
            // 4. Check if userOption text matches correctOption text
            const isCorrect =
                (userOption && userOption.isCorrect === true) ||
                userAnswerId === correctOptionId ||
                (userOption && correctOption && userOption.id === correctOption.id) ||
                (userOption && correctOption && userOption.text === correctOption.text);

            // Get before/after text context from the sentence
            // Try to extract context around the dropdown placeholder
            // Handle: [d1], {d1}, %{d1}, or ___
            let beforeText = '';
            let afterText = '';
            const placeholderPattern = new RegExp(`\\[${dd.id}\\]|\\{${dd.id}\\}|%\\{${dd.id}\\}|___`, 'gi');
            const parts = String(originalSentence || '').split(placeholderPattern);
            if (parts.length >= 2) {
                beforeText = parts[0].slice(-50); // Last 50 chars before
                afterText = parts[1].slice(0, 50); // First 50 chars after
            }

            // Get rationale from blankMap if available (similar to tokenMap for Highlight)
            const blankMap = clozeConfig.blankMap || config.blankMap || {};
            const blankData = blankMap[dd.id] || {};

            const whyCorrect = blankData.whyCorrect || correctOption?.rationale ||
                'This is the clinically appropriate choice for this scenario.';
            const whyIncorrect = !isCorrect ? (
                blankData.distractorRationales?.[userAnswerId] ||
                userOption?.rationale ||
                'This option is not the most appropriate choice.'
            ) : 'N/A';

            return {
                id: dd.id,
                position: index + 1,
                beforeText: beforeText.trim(),
                afterText: afterText.trim(),
                userAnswer: userOption?.text || userAnswerId || '(Not answered)',
                userAnswerId: userAnswerId,
                correctAnswer: correctOption?.text || correctOptionId || 'Unknown',
                correctAnswerId: correctOptionId,
                isCorrect: isCorrect,
                allOptions: options.map((o: any) => ({
                    id: o.id,
                    text: o.text,
                    isCorrect: o.id === correctOptionId || o.isCorrect
                })),
                whyCorrect: whyCorrect,
                whyIncorrect: whyIncorrect
            };
        });

        // Set clozeReview
        clozeReview = {
            originalSentence: originalSentence,
            blanks: blankReviews,
            score: {
                earned: score.earned,
                total: score.total,
                percentage: score.percentage
            }
        };

        // Generate legacy optionReviews for backward compatibility
        if (clozeConfig.dropdowns || allDropdowns.length > 0) {
            optionReviews = allDropdowns.flatMap((d: any) => {
                const userSel = userAnswers ? userAnswers[d.id] : null;
                return (d.options || []).map((opt: any) => ({
                    id: opt.id,
                    text: `[${d.id}] ${opt.text}`,
                    isCorrect: opt.isCorrect || opt.id === (d.correctOptionId || d.correct),
                    userSelected: userSel === opt.id,
                    rationale: opt.rationale || (opt.isCorrect ? 'Correct selection.' : 'Incorrect selection.'),
                    userStatus: (opt.isCorrect && userSel === opt.id) ? 'correct' :
                        (!opt.isCorrect && userSel === opt.id) ? 'incorrect' : 'skipped'
                }));
            });
        }
    } else if (itemType.includes('sata') || itemType.includes('multiple-response')) {
        const score = calculateSATAScore(userAnswers, config);
        outcome = {
            badge: score.percentage >= 80 ? 'CORRECT' : score.percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
            score: score.percentage,
            totalPoints: score.total,
            earnedPoints: score.earned,
            message: score.percentage === 100 ? 'All correct answers selected!' : 'Review the correct selections',
        };
        optionReviews = generateOptionReviews(config, userAnswers);
    } else {
        // Single choice or other
        const options = config.options || [];
        const correctOption = options.find((o: any) => o.isCorrect);
        const isCorrect = userAnswers === correctOption?.id;
        outcome = {
            badge: isCorrect ? 'CORRECT' : 'INCORRECT',
            score: isCorrect ? 100 : 0,
            totalPoints: 1,
            earnedPoints: isCorrect ? 1 : 0,
            message: isCorrect ? 'Correct!' : 'Review the rationale',
        };
        optionReviews = generateOptionReviews(config, userAnswers);
    }

    // Extract or generate remaining fields
    // FIX: Check config.content.rationale for Golden Prompt structure
    const sourceRationale = config.rationale || (config.content && config.content.rationale) || config.explanation;
    const existingData = existingRationale || (typeof sourceRationale === 'object' ? sourceRationale : { rationale: sourceRationale }) || {};

    // Helper: Extract medication info from orders for pharm tab
    const extractPharmFromOrders = (): string => {
        const orders = config.content?.clinicalData?.orders || config.content?.orders || [];
        if (!orders || orders.length === 0) return '';

        const medList = orders.map((o: any) => o.drug || o.order || o.medication).filter(Boolean);
        if (medList.length === 0) return '';

        return `Key medications for this case include: ${medList.slice(0, 3).join(', ')}. Review their mechanisms of action, therapeutic effects, and nursing considerations.`;
    };

    // Knowledge Handling: Try parsing text if object is missing
    let referenceInfoData = existingData.referenceInfo;
    if (!referenceInfoData) {
        // 1. Try mapping explicit keys from 'rationale' object (used in some Prompt Versions)
        if (existingData.pathophysiology || existingData.general) {
            const pharmFromOrders = extractPharmFromOrders();
            referenceInfoData = {
                anatomy: existingData.anatomy || existingData.general || 'Review relevant anatomy for this case.',
                physiology: existingData.physiology || existingData.pathophysiology || 'Review relevant pathophysiology.',
                pharm: existingData.pharm || existingData.pharmacology || pharmFromOrders || 'Review relevant medication mechanisms for this clinical scenario.'
            };
            console.log('[RationalePipeline] Built referenceInfo from case data:', referenceInfoData);
        } else {
            // 2. Try parsing global rationale string for headers
            const globalText = existingData.rationale || config.explanation || '';
            const parsed = extractKnowledgeFromText(globalText);
            // 3. Fallback to defaults only if parsing failed
            referenceInfoData = parsed || DEFAULT_REFERENCE;
        }
    }

    // CRITICAL: Build case-specific cheatSheet from safetyCheck and clinicalTakeaway if available
    let effectiveCheatSheet = existingData.cheatSheet;
    if (!effectiveCheatSheet || !effectiveCheatSheet.points || effectiveCheatSheet.points.length === 0) {
        const caseSpecificPoints: string[] = [];

        // Add safetyCheck as first point if available
        if (existingData.safetyCheck) {
            caseSpecificPoints.push(existingData.safetyCheck);
        }

        // Add clinicalTakeaway as second point if available
        if (existingData.clinicalTakeaway) {
            caseSpecificPoints.push(existingData.clinicalTakeaway);
        }

        // Add general from rationale as third point if available
        if (existingData.general) {
            caseSpecificPoints.push(existingData.general);
        }

        // If we found case-specific content, use it; otherwise use defaults
        if (caseSpecificPoints.length > 0) {
            effectiveCheatSheet = {
                title: 'Case-Specific Clinical Pearls',
                points: caseSpecificPoints
            };
            console.log('[RationalePipeline] Built case-specific cheatSheet:', effectiveCheatSheet);
        } else {
            effectiveCheatSheet = DEFAULT_CHEAT_SHEET;
        }
    }

    // =====================================================================
    // CLINICAL MNEMONIC LOOKUP TABLE
    // Real nursing mnemonics indexed by condition/topic keywords
    // =====================================================================
    const CLINICAL_MNEMONICS: Record<string, { title: string; content: string; explanation: string }> = {
        // Dermatology
        'stevens-johnson': { title: 'SCORTEN', content: 'S-Serum BUN >28, C-Cancer/malignancy, O-Older age >40, R-Rate of detachment >10%, T-Tachycardia >120, E-Elevated glucose >252, N-Nitrogen (BUN) elevated', explanation: 'SCORTEN score predicts mortality in SJS/TEN. Each positive factor = 1 point. Score ≥3 = >35% mortality risk.' },
        'sjs': { title: 'SCORTEN', content: 'S-Serum BUN >28, C-Cancer, O-Older >40, R-Rate >10% BSA, T-Tachycardia >120, E-Elevated glucose, N-Nitrogen (BUN) elevated', explanation: 'SCORTEN predicts SJS/TEN mortality.' },
        // Musculoskeletal/Renal
        'rhabdomyolysis': { title: 'CRUSH', content: 'C-CK levels >5x normal, R-Renal failure risk, U-Urine dark/tea-colored, S-Swelling/muscle pain, H-Hyperkalemia', explanation: 'CRUSH syndrome priorities: IV fluids, monitor K+, urine output >200mL/hr.' },
        'fall': { title: 'CRUSH', content: 'C-CK elevated, R-Renal failure, U-Urine dark, S-Swelling, H-Hyperkalemia', explanation: 'Long-lie falls cause rhabdomyolysis. Watch for peaked T-waves.' },
        // Cardiac
        'heart failure': { title: 'FACES', content: 'F-Fatigue, A-Activities limited, C-Chest congestion, E-Edema, S-Shortness of breath', explanation: 'FACES = early warning signs. Weight gain >3 lbs overnight = call provider.' },
        'chf': { title: 'FACES', content: 'F-Fatigue, A-Activities limited, C-Congestion, E-Edema, S-SOB', explanation: 'CHF exacerbation warning signs.' },
        'mi': { title: 'MONA', content: 'M-Morphine, O-Oxygen, N-Nitroglycerin, A-Aspirin', explanation: 'First-line MI treatment. Morphine now selective due to hypotension risk.' },
        // Neurological
        'stroke': { title: 'FAST', content: 'F-Face drooping, A-Arm weakness, S-Speech difficulty, T-Time to call 911', explanation: 'Door-to-needle goal <60 min for tPA.' },
        'increased icp': { title: 'CUSHING TRIAD', content: 'Hypertension (widening pulse pressure), Bradycardia, Irregular respirations', explanation: 'Late sign of herniation. HOB 30°, avoid neck flexion.' },
        // Endocrine
        'dka': { title: 'HOTDDK', content: 'H-Hyperglycemia >300, O-Over-breathing (Kussmaul), T-Thirst, D-Dehydration, D-Drowsy, K-Ketones', explanation: 'DKA: Fluids BEFORE insulin, monitor K+ q1-2h.' },
        'hypoglycemia': { title: 'TIRED', content: 'T-Tachycardia, I-Irritability, R-Restlessness, E-Excessive hunger, D-Diaphoresis', explanation: 'Rule of 15: 15g carbs, recheck in 15 min.' },
        // Electrolytes
        'hyperkalemia': { title: 'MURDER', content: 'M-Muscle weakness, U-Urine decreased, R-Respiratory failure, D-Decreased cardiac output, E-ECG peaked T, R-Reflexes decreased', explanation: 'K+ >6.5 = emergency. Ca gluconate, insulin+D50, kayexalate.' },
        'hypokalemia': { title: 'SUCTION', content: 'S-Skeletal weakness, U-U-wave ECG, C-Constipation, T-Toxic dig effects, I-Irregular pulse, O-Orthostatic BP, N-Numbness', explanation: 'Replace K+ slowly (max 10-20 mEq/hr peripheral).' },
        // Sepsis
        'sepsis': { title: 'SEPSIS-6', content: 'S-Send blood cultures, E-Empiric antibiotics, P-Put in IV fluids, S-Serum lactate, I-Input/output monitoring, S-Supplement oxygen', explanation: 'Hour-1 bundle. qSOFA ≥2 indicates high mortality risk.' },
    };

    // CRITICAL: Look up real clinical mnemonic based on topic
    let effectiveMnemonic = existingData.mnemonic;

    // Check if mnemonic exists and has valid title
    const hasMnemonic = effectiveMnemonic && effectiveMnemonic.title && effectiveMnemonic.title !== 'Not Available';

    if (!hasMnemonic) {
        // Check ALL possible locations for topic
        const topic = (
            config.topic ||
            config.metadata?.topic ||
            config.content?.metadata?.topic ||
            existingData.coreConcept ||
            config.pedagogy?.clinicalFocus ||
            ''
        ).toLowerCase();

        console.log(`[RationalePipeline] Looking up mnemonic for topic: "${topic}"`);

        // Search for matching mnemonic in lookup table
        let foundMnemonic = null;
        for (const [keyword, mnemonic] of Object.entries(CLINICAL_MNEMONICS)) {
            if (topic.includes(keyword)) {
                foundMnemonic = mnemonic;
                console.log(`[RationalePipeline] Found clinical mnemonic for "${keyword}":`, mnemonic.title);
                break;
            }
        }

        effectiveMnemonic = foundMnemonic || DEFAULT_MNEMONIC;
    }

    // CRITICAL: Build case-specific pitfalls from safetyCheck warnings
    let effectivePitfalls = existingData.pitfalls;
    if (!effectivePitfalls || effectivePitfalls.length === 0) {
        const topic = config.topic || config.metadata?.topic || 'this condition';

        // Extract potential pitfalls from safetyCheck (look for warning phrases)
        if (existingData.safetyCheck) {
            effectivePitfalls = [];

            // Add warnings extracted from safetyCheck
            if (existingData.safetyCheck.toLowerCase().includes('permanent')) {
                effectivePitfalls.push(`Delayed treatment can lead to permanent complications in ${topic}`);
            }
            if (existingData.safetyCheck.toLowerCase().includes('sepsis') || existingData.safetyCheck.toLowerCase().includes('infection')) {
                effectivePitfalls.push('High risk of secondary infection/sepsis due to compromised barriers');
            }
            if (existingData.safetyCheck.toLowerCase().includes('discontinu')) {
                effectivePitfalls.push('Failure to immediately discontinue the offending medication');
            }
            if (existingData.safetyCheck.toLowerCase().includes('fluid')) {
                effectivePitfalls.push('Inadequate fluid resuscitation leading to hemodynamic instability');
            }

            // If we extracted some, add a general one
            if (effectivePitfalls.length > 0) {
                effectivePitfalls.push(`Misdiagnosis due to atypical presentation of ${topic}`);
            } else {
                effectivePitfalls = ['Overlooking early warning signs', `Delayed recognition of ${topic}`, 'Inadequate monitoring of patient response'];
            }

            // Debug log removed to prevent console flooding
        } else {
            effectivePitfalls = ['Rushing to conclusions without complete assessment', 'Overlooking subtle changes in patient status'];
        }
    }

    return {
        outcome,
        coreConcept: existingData.coreConcept || config.topic || 'Clinical Judgment Assessment',
        caseSummary: existingData.caseSummary || config.prompt || '',
        answerAnalysis: existingData.answerAnalysis || '',
        trap: existingData.trap || '',

        optionReviews,
        bowTieReview,
        matrixRows,
        matrixColumns,
        highlightReview,
        clozeReview,
        orderedReview,

        steps: existingData.steps || DEFAULT_STEPS,
        goldenRule: existingData.goldenRule || existingData.clinicalTakeaway || 'Always prioritize patient safety and use systematic clinical reasoning.',

        mnemonic: effectiveMnemonic,
        cheatSheet: effectiveCheatSheet,
        pitfalls: effectivePitfalls,

        referenceInfo: referenceInfoData,

        cjmmStep: existingData.cjmmStep || inferCJMMStep(itemType),
        itemType,
        difficulty: existingData.difficulty || config.difficulty || config.metadata?.difficulty,

        // Calculation Specifics - use fallback extraction if not provided
        formulaMethod: existingData.formulaMethod || (itemType.includes('calculation') || itemType.includes('dosage') ? extractCalculationBreakdown(config).formulaMethod : undefined),
        dimensionalAnalysis: existingData.dimensionalAnalysis || (itemType.includes('calculation') || itemType.includes('dosage') ? extractCalculationBreakdown(config).dimensionalAnalysis : undefined)
    };
}

/**
 * Infer CJMM step from item type
 */
function inferCJMMStep(itemType: string): string {
    if (itemType.includes('highlight') || itemType.includes('cloze')) return 'Recognize Cues';
    if (itemType.includes('matrix') || itemType.includes('trend')) return 'Analyze Cues';
    if (itemType.includes('bow-tie')) return 'Prioritize Hypotheses';
    if (itemType.includes('ordered')) return 'Generate Solutions';
    if (itemType.includes('sata') || itemType.includes('multiple')) return 'Take Action';
    return 'Evaluate Outcomes';
}

// ============================================================================
// EXPORTS
// ============================================================================

export const RationalePipeline = {
    generateRationale,
    calculateBowTieScore,
    calculateMatrixScore,
    calculateSATAScore,
    calculateHighlightScore, // Added
    calculateClozeScore,
    generateBowTieReview,
    generateOptionReviews,
    extractKnowledgeFromText
};

/**
 * Helper: Parse Rationale Text for Knowledge Headers
 */
function extractKnowledgeFromText(text: string): ReferenceInfo | null {
    if (!text || text.length < 20) return null;

    const extract = (headers: string[]) => {
        for (const h of headers) {
            // Regex to find Header:... until next header or end
            // Headers: Anatomy, Physiology, Pharmacology/Pharm, Pathophysiology
            const regex = new RegExp(`(?:\\*\\*)?${h}(?:\\*\\*)?[:\\-]?\\s*([\\s\\S]*?)(?=(?:\\*\\*)?(?:Anatomy|Physiology|Pathophysiology|Pharmacology|Pharm)(?:\\*\\*)?[:\\-]|$)`, 'i');
            const match = text.match(regex);
            if (match && match[1].trim().length > 5) return match[1].trim();
        }
        return '';
    };

    const anatomy = extract(['Anatomy', 'Structure']);
    const physiology = extract(['Physiology', 'Pathophysiology']);
    const pharm = extract(['Pharmacology', 'Pharm', 'Medication']);

    // If we found NOTHING, return null to use Defaults
    if (!anatomy && !physiology && !pharm) return null;

    return {
        anatomy: anatomy || 'Review the relevant body systems and anatomical structures affected by this clinical condition.',
        physiology: physiology || 'Understand the normal physiological processes and how they are disrupted in this pathological state.',
        pharm: pharm || 'Know the mechanism of action, therapeutic effects, and nursing considerations for medications used in treatment.',
    };
}

export default RationalePipeline;
