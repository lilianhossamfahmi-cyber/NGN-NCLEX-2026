/**
 * DISTRACTOR GENERATOR - NCLEX-NGN Smart Distractor Creation
 * Generates clinically plausible distractors based on difficulty level
 */

export interface DistractorContext {
    diagnosis: string;
    symptoms: string[];
    patientAge: number;
    clinicalFocus: string;
}

export interface DistractorOptions {
    correct: string;
    context: DistractorContext;
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    quantity: number;
}

export interface DistractorWithRationale {
    text: string;
    rationale: string;
    category: 'surface' | 'pathophysiology' | 'critical-thinking';
    isCorrect: false;
}

// ===================CONDITION MAPPING====================

const CONTRAINDICATED_INTERVENTIONS: Record<string, string[]> = {
    'Sepsis': [
        'Restrict IV fluids to prevent volume overload',
        'Wait for culture results before starting antibiotics',
        'Administer NSAIDs for fever management',
        'Position client in Trendelenburg position',
        'Apply heating pad to improve circulation'
    ],
    'Heart Failure': [
        'Encourage increased fluid intake to prevent dehydration',
        'Position client flat in bed for comfort',
        'Administer high-sodium diet for energy',
        'Restrict physical activity completely',
        'Discontinue diuretics to preserve kidney function'
    ],
    'Hypertension': [
        'Increase sodium intake to improve taste of food',
        'Encourage vigorous isometric exercises',
        'Administer stimulants for energy',
        'Discontinue antihypertensives if feeling dizzy'
    ],
    'Diabetes Mellitus Type 2': [
        'Increase carbohydrate intake for energy',
        'Skip insulin if blood sugar is normal',
        'Exercise vigorously when blood sugar is high',
        'Drink fruit juice when feeling shaky'
    ],
    'COPD': [
        'Administer high-flow oxygen at 10 L/min',
        'Encourage bedrest to conserve energy',
        'Position client supine for comfort',
        'Administer sedatives for anxiety'
    ],
    'Stroke': [
        'Administer aspirin immediately without MD order',
        'Position client flat to improve cerebral perfusion',
        'Encourage oral intake to prevent dehydration',
        'Apply heating pad to affected side'
    ],
    'Myocardial Infarction': [
        'Encourage ambulation to prevent DVT',
        'Administer IM injections for rapid absorption',
        'Position client flat to reduce cardiac workload',
        'Apply heat to chest for pain relief'
    ],
    'Pneumonia': [
        'Restrict fluid intake to prevent pulmonary edema',
        'Position client flat for comfort',
        'Encourage complete bedrest',
        'Administer cough suppressants'
    ],
    'Acute Pancreatitis': [
        'Encourage high-fat diet for nutrition',
        'Administer pancreatic enzymes with meals',
        'Position client supine',
        'Apply heating pad to abdomen for pain'
    ],
    'Renal Failure': [
        'Encourage high-protein diet',
        'Increase potassium-rich foods',
        'Administer potassium-sparing diuretics',
        'Encourage fluid intake to flush kidneys'
    ],
    'Seizure Disorder': [
        'Restrain client during seizure',
        'Insert oral airway during seizure',
        'Give food/water immediately after seizure',
        'Force mouth open to prevent tongue biting'
    ],
    'Asthma': [
        'Administer sedatives during attack',
        'Position client flat',
        'Encourage deep breathing exercises during attack',
        'Apply chest compressions'
    ],
    'Hypoglycemia': [
        'Administer insulin immediately',
        'Encourage client to lie down and rest',
        'Provide complex carbohydrates only',
        'Wait 30 minutes before rechecking glucose'
    ],
    'Hyperkalemia': [
        'Administer potassium supplements',
        'Encourage banana and orange juice intake',
        'Hold dialysis to preserve kidney function',
        'Administer potassium-sparing diuretics'
    ],
    'Anaphylaxis': [
        'Position client supine with legs elevated',
        'Administer oral antihistamine',
        'Encourage deep breathing exercises',
        'Apply ice packs to reduce swelling'
    ]
};

const WRONG_CONDITION_INTERVENTIONS: Record<string, Record<string, string>> = {
    'Sepsis': {
        'MI': 'Administer nitroglycerin sublingual',
        'Stroke': 'Elevate head of bed to 30 degrees',
        'Asthma': 'Administer albuterol nebulizer treatment'
    },
    'Heart Failure': {
        'Dehydration': 'Encourage increased fluid intake',
        'Hypotension': 'Position client in Trendelenburg',
        'Anemia': 'Encourage iron-rich foods'
    },
    'COPD': {
        'Asthma': 'Administer high-dose corticosteroids',
        'Pneumonia': 'Encourage incentive spirometry',
        'CHF': 'Restrict fluids to 1000 mL/day'
    },
    'Stroke': {
        'Seizure': 'Pad side rails',
        'Hypoglycemia': 'Administer glucose IV',
        'MI': 'Administer morphine for pain'
    },
    'Diabetes': {
        'Hyperthyroid': 'Administer propylthiouracil',
        'Cushings': 'Administer dexamethasone',
        'Addisons': 'Encourage low-sodium diet'
    }
};

const SYMPTOM_FOCUSED_DISTRACTORS: Record<string, string[]> = {
    'fever': ['Apply cooling blanket', 'Administer acetaminophen', 'Encourage cold fluids'],
    'pain': ['Administer morphine', 'Apply heat/cold therapy', 'Encourage relaxation techniques'],
    'dyspnea': ['Elevate head of bed', 'Administer oxygen', 'Encourage pursed-lip breathing'],
    'nausea': ['Administer antiemetic', 'Offer small frequent meals', 'Encourage ginger tea'],
    'confusion': ['Orient client to person/place/time', 'Ensure safe environment', 'Administer sedatives'],
    'hypotension': ['Position in Trendelenburg', 'Administer IV fluids', 'Increase salt intake'],
    'tachycardia': ['Administer beta-blocker', 'Encourage rest', 'Reduce stimulants']
};

// ===================GENERATOR FUNCTIONS====================

/**
 * Generates opposite action distractor
 */
function oppositeAction(correct: string): string {
    const opposites: Record<string, string> = {
        'Increase': 'Decrease',
        'Encourage': 'Restrict',
        'Administer': 'Withhold',
        'Elevate': 'Lower',
        'High': 'Low',
        'Before': 'After',
        'Start': 'Stop',
        'Continue': 'Discontinue'
    };

    for (const [key, value] of Object.entries(opposites)) {
        if (correct.includes(key)) {
            return correct.replace(key, value);
        }
        if (correct.includes(value)) {
            return correct.replace(value, key);
        }
    }

    // Fallback generic opposite
    return `Do the opposite of: ${correct}`;
}

/**
 * Generates wrong timing distractor
 */
function wrongTiming(correct: string): string {
    const timingMap: Record<string, string> = {
        'before meals': 'after meals',
        'after meals': 'before meals',
        'in the morning': 'at bedtime',
        'at bedtime': 'in the morning',
        'with food': 'on empty stomach',
        'on empty stomach': 'with food',
        'immediately': 'after 30 minutes',
        'PRN': 'scheduled every 4 hours'
    };

    for (const [key, value] of Object.entries(timingMap)) {
        if (correct.toLowerCase().includes(key)) {
            return correct.replace(new RegExp(key, 'i'), value);
        }
    }

    return `Perform ${correct} at wrong time`;
}

/**
 * Generates wrong patient population distractor
 */
function wrongPatientPopulation(correct: string, context: DistractorContext): string {
    if (context.patientAge < 18) {
        return correct.replace(/child|pediatric/gi, 'adult');
    } else if (context.patientAge >= 65) {
        return correct.replace(/adult|geriatric/gi, 'pediatric');
    } else {
        return correct + ' (appropriate for different age group)';
    }
}

/**
 * Treats wrong condition
 */
function treatsWrongCondition(_correct: string, context: DistractorContext): string {
    const diagnosis = context.diagnosis;

    if (WRONG_CONDITION_INTERVENTIONS[diagnosis]) {
        const wrongConditions = Object.values(WRONG_CONDITION_INTERVENTIONS[diagnosis]);
        return wrongConditions[Math.floor(Math.random() * wrongConditions.length)];
    }

    return 'Administer treatment for different condition';
}

/**
 * Addresses symptom, not root cause
 */
function addressesSymptomNotCause(_correct: string, context: DistractorContext): string {
    const symptoms = context.symptoms || [];

    for (const symptom of symptoms) {
        const symptomKey = symptom.toLowerCase();
        if (SYMPTOM_FOCUSED_DISTRACTORS[symptomKey]) {
            const distractors = SYMPTOM_FOCUSED_DISTRACTORS[symptomKey];
            return distractors[Math.floor(Math.random() * distractors.length)];
        }
    }

    return 'Treat symptoms without addressing underlying pathophysiology';
}

/**
 * Generates contraindicated intervention
 */
function contraindicated(_correct: string, context: DistractorContext): string {
    const diagnosis = context.diagnosis;

    if (CONTRAINDICATED_INTERVENTIONS[diagnosis]) {
        const options = CONTRAINDICATED_INTERVENTIONS[diagnosis];
        return options[Math.floor(Math.random() * options.length)];
    }

    return 'Perform intervention that could worsen condition';
}

/**
 * Generates delegation error
 */
function delegationError(_correct: string): string {
    const delegationErrors = [
        'Delegate assessment to unlicensed assistive personnel (UAP)',
        'Ask LPN to administer IV push medication',
        'Assign UAP to develop nursing care plan',
        'Delegate client education to nursing student',
        'Ask UAP to perform sterile dressing change',
        'Assign medication administration to family member',
        'Delegate evaluation of client outcomes to UAP'
    ];

    return delegationErrors[Math.floor(Math.random() * delegationErrors.length)];
}

/**
 * Generates wrong priority
 */
// Reserved for future use
// function wrongPriority(_correct: string, _context: DistractorContext): string {
//     return 'Address less urgent need before life-threatening issue';
// }

/**
 * Shuffle array utility
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===================MAIN GENERATOR====================

/**
 * Generates smart distractors based on difficulty level
 */
export async function generateDistractors(options: DistractorOptions): Promise<string[]> {
    const { correct, context, difficultyLevel, quantity } = options;
    const distractors: string[] = [];

    try {
        // Level 1-2: Surface-level distractors
        if (difficultyLevel <= 2) {
            distractors.push(
                oppositeAction(correct),
                wrongTiming(correct),
                wrongPatientPopulation(correct, context)
            );
        }

        // Level 3: Pathophysiology distractors
        if (difficultyLevel === 3) {
            distractors.push(
                treatsWrongCondition(correct, context),
                addressesSymptomNotCause(correct, context),
                oppositeAction(correct)
            );
        }

        // Level 4-5: Critical thinking distractors
        if (difficultyLevel >= 4) {
            distractors.push(
                contraindicated(correct, context),
                delegationError(correct),
                'Continue to monitor - no immediate action needed',
                addressesSymptomNotCause(correct, context)
            );
        }

        // Remove duplicates and shuffle
        const uniqueDistractors = [...new Set(distractors)];
        const shuffled = shuffleArray(uniqueDistractors);

        return shuffled.slice(0, quantity);
    } catch (error) {
        console.error('Error generating distractors:', error);
        // Fallback generic distractors
        return [
            'Alternative intervention A',
            'Alternative intervention B',
            'Alternative intervention C'
        ].slice(0, quantity);
    }
}

/**
 * Generates distractors with educational rationales
 */
export function generateDistractorsWithRationales(options: DistractorOptions): DistractorWithRationale[] {
    const { correct, context, difficultyLevel, quantity } = options;
    const distractorsWithRationale: DistractorWithRationale[] = [];



    // Surface-level
    if (difficultyLevel <= 2) {
        distractorsWithRationale.push({
            text: oppositeAction(correct),
            rationale: 'This is the opposite of what should be done. Review the therapeutic action needed.',
            category: 'surface',
            isCorrect: false
        });

        distractorsWithRationale.push({
            text: wrongTiming(correct),
            rationale: 'The timing of this intervention is incorrect. Proper timing is crucial for efficacy.',
            category: 'surface',
            isCorrect: false
        });
    }

    // Pathophysiology-based
    if (difficultyLevel >= 3) {
        distractorsWithRationale.push({
            text: treatsWrongCondition(correct, context),
            rationale: `This treats a different condition. The client's diagnosis is ${context.diagnosis}, requiring specific interventions.`,
            category: 'pathophysiology',
            isCorrect: false
        });

        distractorsWithRationale.push({
            text: addressesSymptomNotCause(correct, context),
            rationale: 'This addresses symptoms without treating the underlying pathophysiology. Focus on root cause.',
            category: 'pathophysiology',
            isCorrect: false
        });
    }

    // Critical thinking
    if (difficultyLevel >= 4) {
        distractorsWithRationale.push({
            text: contraindicated(correct, context),
            rationale: `This intervention is contraindicated in ${context.diagnosis} and could cause harm. Review contraindications.`,
            category: 'critical-thinking',
            isCorrect: false
        });

        distractorsWithRationale.push({
            text: delegationError(correct),
            rationale: 'This represents improper delegation. Certain tasks require RN judgment and cannot be delegated.',
            category: 'critical-thinking',
            isCorrect: false
        });
    }

    return shuffleArray(distractorsWithRationale).slice(0, quantity);
}

/**
 * Validates distractor quality
 */
export function validateDistractorQuality(distractor: string, correct: string): {
    plausible: boolean;
    issues: string[];
} {
    const issues: string[] = [];

    // Check if too similar to correct answer
    if (distractor.toLowerCase() === correct.toLowerCase()) {
        issues.push('Distractor is identical to correct answer');
    }

    // Check if obviously wrong (contains negative indicators)
    const obviouslyWrongPatterns = ['never', 'always', 'all', 'none', 'impossible'];
    if (obviouslyWrongPatterns.some(pattern => distractor.toLowerCase().includes(pattern))) {
        issues.push('Contains absolute language that makes it obviously incorrect');
    }

    // Check minimum length
    if (distractor.length < 10) {
        issues.push('Distractor is too short to be plausible');
    }

    return {
        plausible: issues.length === 0,
        issues
    };
}

export const DistractorGenerator = {
    generate: generateDistractors,
    generateWithRationales: generateDistractorsWithRationales,
    validateQuality: validateDistractorQuality
};
