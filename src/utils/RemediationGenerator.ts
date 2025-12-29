
import { ScoreRuleResult, AnalyticMetadata, CognitiveAnalyticsEngine } from './scoringEngine';
import { RemediationModel, CJFeedback } from '../types/RationaleTypes';

export interface MicroRationaleInput {
    itemType: 'mcq' | 'matrix' | 'sata' | 'other';
    isOptionCorrect: boolean;
    userSelected: boolean;

    // Context strings (usually from the item content)
    concept: string;      // e.g. "Hypoxia" or "Insulin Sensitivity"
    mechanism: string;    // e.g. "increases cellular uptake"
    safetyRisk?: string;  // e.g. "risk of hypoglycemia"
    missedCue?: string;   // e.g. "SpO2 88%"
    trap?: string;        // e.g. "BP is stable"
}

// --- Constants ---

const MAX_CHARS = 240;

const CJ_DEFINITIONS: Record<string, string> = {
    'Recognize Cues': 'relevant data points',
    'Analyze Cues': 'clinical patterns',
    'Prioritize Hypotheses': 'urgent needs',
    'Generate Solutions': 'care options',
    'Take Action': 'safety interventions',
    'Evaluate Outcomes': 'response to treatment'
};

// --- Main Generator Functions ---

/**
 * Standardized Generator for Micro-Rationales
 * Enforces strict length limits and phrasing patterns.
 */
export const generateMicroRationale = (input: MicroRationaleInput): RemediationModel => {
    const { isOptionCorrect, userSelected, concept, mechanism, safetyRisk, missedCue, trap } = input;

    // 1. Why Correct
    // Pattern: "Because [Mechanism] leads to [Concept/Outcome]."
    let whyCorrect = `Because ${mechanism}, it directly addresses ${concept}.`;
    if (whyCorrect.length > MAX_CHARS) whyCorrect = whyCorrect.substring(0, MAX_CHARS - 3) + '...';

    // 2. Why Wrong / Why Others Wrong (Mapped to 'prevention' / Common Trap)
    // Pattern depends on scenario
    let whyWrong = "";
    if (isOptionCorrect && !userSelected) {
        // Missed it
        whyWrong = `Missed affirmative cue: ${missedCue || concept}.`;
    } else if (!isOptionCorrect && userSelected) {
        // Picked wrong
        whyWrong = safetyRisk
            ? `Unsafe: This causes ${safetyRisk}.`
            : `Incorrect: This does not address ${concept}.`;
    } else {
        // Distractor not selected (Why it WOULD be wrong)
        whyWrong = `Contraindicated due to ${safetyRisk || 'mechanism mismatch'}.`;
    }

    // Append trap to prevention if present
    let trapText = trap ? ` Trap: ${trap}` : "";
    let prevention = whyWrong + trapText;
    if (prevention.length > MAX_CHARS) prevention = prevention.substring(0, MAX_CHARS - 3) + '...';

    // 3. Fix Rule (Mapped to 'takeaway')
    // Pattern: "Select this ONLY if [Condition]."
    let fixRule = `Valid only if ${missedCue || 'specific indications'} were present.`;
    if (isOptionCorrect) {
        fixRule = `Required when ${concept} is indicated.`;
    }
    let takeaway = fixRule;
    if (takeaway.length > MAX_CHARS) takeaway = takeaway.substring(0, MAX_CHARS - 3) + '...';

    return {
        whyCorrect,
        prevention,
        takeaway
    };
};

/**
 * Generates the "Clinical Judgment Mapping" Feedback (2 bullets)
 */
export const generateCJFeedback = (
    result: ScoreRuleResult,
    metadata?: AnalyticMetadata,
    timeSpent?: number
): CJFeedback => {
    const stepName = metadata?.cjmmStep || 'General';
    const stepConcept = CJ_DEFINITIONS[stepName] || 'clinical reasoning';

    // 1. "What you did well"
    let well = "";
    if (result.isCorrect) {
        well = `Perfectly identified ${stepConcept}.`;
    } else if ((result.score > 0) || (result.correctCount && result.correctCount > 0)) {
        well = `Correctly grasped parts of ${stepConcept}, but missed details.`;
    } else {
        well = `Attempted to address ${stepConcept}, but approach was off.`;
    }

    // 2. "Next Time" / Improvements
    // Use error analys logic
    let improve = "";
    const errorTag = CognitiveAnalyticsEngine.analyzeError(result, timeSpent || 60, metadata || { clientNeeds: '' });

    switch (errorTag) {
        case 'Rushing Warning':
            improve = "Slow down. You missed critical cues by rushing.";
            break;
        case 'Over-Thinking':
            improve = "Trust your gut. Over-analyzing leads to changing correct answers.";
            break;
        case 'Precision Error':
            improve = "Refine precision. You selected valid options but included distractors.";
            break;
        case 'Knowledge Gap':
            improve = "Review foundation. This topic requires core knowledge review.";
            break;
        default:
            // Fallback based on item type or score
            if (result.isCorrect) {
                improve = "Maintain this pace and focus.";
            } else {
                improve = `Focus on distinguishing ${stepConcept} from distractors.`;
            }
    }

    return { well, improve };
};


// --- Unit Test / Examples (as requested) ---

/*
export const TEST_EXAMPLES = () => {
    // MCQ Example
    const mcqResult = generateMicroRationale({
        itemType: 'mcq',
        isOptionCorrect: true, 
        userSelected: true,
        concept: "Hypoxia",
        mechanism: "improving gas exchange",
        missedCue: "SpO2 88%"
    });
    console.log('MCQ Success:', mcqResult);

    // Matrix Row Example
    const matrixResult = generateMicroRationale({
        itemType: 'matrix',
        isOptionCorrect: false,
        userSelected: true, // User chose 'Adverse' but row was 'Expected'
        concept: "Side Effect",
        mechanism: "action of insulin",
        safetyRisk: "severe hypoglycemia",
        trap: "Confusing peak time with onset"
    });
    console.log('Matrix Failure:', matrixResult);
};
*/
