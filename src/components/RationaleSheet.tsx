import React, { useMemo } from 'react';
import { UltimateRationale } from './UltimateRationale';
import { generateCJFeedback } from '../utils/RemediationGenerator';
import * as RationalePipeline from '../services/RationalePipeline';

// Update Interface
interface RationaleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    question: any;
    result?: any;
    onNextQuestion?: () => void;
}

export const RationaleDrawer: React.FC<RationaleDrawerProps> = ({ isOpen, onClose, question, result, onNextQuestion }) => {
    // ... existing ...
    // Extract CJMM Step
    const cjmmStep = question?.cjmmStep || question?.content?.metadata?.cjmmStep || question?.metadata?.cjmmStep || "Clinical Judgment";

    const smartRationale = useMemo(() => {
        if (!question) return null;

        // CRITICAL: Merge both rationale sources to ensure mnemonic and all fields are preserved
        // content.rationale has processed fields from UnifiedDataPipeline (mnemonic is here!)
        // question.rationale has original user-provided fields
        const contentRationale = question.content?.rationale || {};
        const rootRationale = question.rationale || {};

        // CRITICAL FIX: Prefer contentRationale.mnemonic FIRST (where UnifiedDataPipeline saves it)
        const finalMnemonic = contentRationale.mnemonic || rootRationale.mnemonic;

        // Merge: content (processed) as base, then overlay with root (original) non-mnemonic fields
        const explicitRationale = {
            ...contentRationale,
            ...rootRationale,
            // Ensure mnemonic is preserved from content (UnifiedDataPipeline saved it there)
            mnemonic: finalMnemonic
        };

        return RationalePipeline.generateRationale(question, result?.userAns, explicitRationale);
    }, [question, result]);

    if (!smartRationale) return null;

    // Map Pipeline Outcome to UltimateRationale format
    const badge = smartRationale.outcome?.badge || 'PARTIAL'; // Default to partial if missing
    const outcome = {
        title: badge === 'CORRECT' ? 'Optimal Clinical Decision' : (badge === 'PARTIAL' ? 'Partial Clinical Decision' : 'Suboptimal Clinical Decision'),
        score: smartRationale.outcome?.earnedPoints || 0,
        maxScore: smartRationale.outcome?.totalPoints || 1,
        status: (badge.toLowerCase() || 'partial') as 'correct' | 'incorrect' | 'partial'
    };

    // CJ Feedback Generation
    const cjFeedback = result ? generateCJFeedback(
        result,
        question?.content?.metadata || question?.metadata,
        result.timeSpent
    ) : undefined;

    return (
        <UltimateRationale
            isOpen={isOpen}
            onClose={onClose}
            onNextQuestion={onNextQuestion}
            outcome={outcome}
            cjmmStep={smartRationale.cjmmStep || cjmmStep}
            cjFeedback={cjFeedback}
            coreConcept={smartRationale.coreConcept || "Clinical Concept"}
            goldenRule={smartRationale.goldenRule}
            caseSummary={smartRationale.caseSummary}
            answerAnalysis={smartRationale.answerAnalysis}
            trap={smartRationale.trap}
            steps={smartRationale.steps}
            mnemonic={smartRationale.mnemonic}
            cheatSheet={smartRationale.cheatSheet}
            optionReviews={smartRationale.optionReviews}
            bowTieReview={smartRationale.bowTieReview}
            highlightReview={smartRationale.highlightReview}
            clozeReview={smartRationale.clozeReview}
            orderedReview={smartRationale.orderedReview}
            matrixRows={smartRationale.matrixRows}
            matrixColumns={smartRationale.matrixColumns}
            pitfalls={smartRationale.pitfalls}
            referenceInfo={smartRationale.referenceInfo}
            formulaMethod={smartRationale.formulaMethod}
            dimensionalAnalysis={smartRationale.dimensionalAnalysis}
            metadata={{
                type: question?.type,
                correctValue: question?.correctValue || question?.structure?.correctValue,
                inputLabel: question?.inputLabel || question?.structure?.inputLabel,
                units: question?.units || question?.structure?.units,
                fullItem: question,
                rationale: smartRationale,
                rationaleDifficulty: smartRationale.difficulty,
                ...question?.metadata,
                ...question?.pedagogy,
                // FIX: Prioritize the explicit difficulty level over the pipeline's inferred one
                difficultyLevel: question?.pedagogy?.difficultyLevel || question?.metadata?.difficultyLevel || smartRationale.difficulty?.level || 3
            }}
        />
    );
};
