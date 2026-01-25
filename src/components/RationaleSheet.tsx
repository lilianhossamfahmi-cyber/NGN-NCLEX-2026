import React, { useMemo, useEffect } from 'react';
import { UltimateRationale } from './UltimateRationale';
import { RationaleSheetProps } from '../types';
import { RationalePipeline } from '../services/RationalePipeline';

export const RationaleSheet: React.FC<RationaleSheetProps> = ({
    question,
    fullItem,
    rationale: explicitRationale,
    metadata,
}) => {
    // ✅ Manage active tab state locally in RationaleSheet
    const [activeTab, setActiveTab] = React.useState<number>(0);
    // ✅ Priority hierarchy extraction - tries multiple sources
    const smartRationale = useMemo(() => {
        console.log('🔍 RationaleSheet: Starting rationale extraction...');

        // OPTION 1: Use explicit rationale if provided (highest priority)
        if (explicitRationale) {
            console.log('✅ RationaleSheet: Using explicit rationale from props');
            return explicitRationale;
        }

        // OPTION 2: Extract from fullItem (if available)
        if (fullItem?.content?.rationale) {
            console.log('✅ RationaleSheet: Extracting from fullItem.content.rationale');
            try {
                const processed = RationalePipeline.processQuestion(fullItem.content);
                console.log('✅ RationaleSheet: Successfully processed fullItem rationale', processed);
                return processed;
            } catch (error) {
                console.error('❌ RationaleSheet: Error processing fullItem rationale', error);
            }
        }

        // OPTION 3: Try question as fallback
        if (question?.content?.rationale) {
            console.log('✅ RationaleSheet: Extracting from question.content.rationale (fallback)');
            try {
                const processed = RationalePipeline.processQuestion(question.content);
                console.log('✅ RationaleSheet: Successfully processed question rationale', processed);
                return processed;
            } catch (error) {
                console.error('❌ RationaleSheet: Error processing question rationale', error);
            }
        }

        // OPTION 4: Create default rationale (last resort)
        console.error('🔴 RationaleSheet: No rationale found anywhere, creating defaults');
        return RationalePipeline.createDefaultRationale();
    }, [explicitRationale, fullItem?.content?.rationale, question?.content?.rationale]);

    // ✅ OPTIONAL: Log when we're using defaults
    useEffect(() => {
        if (!smartRationale?.referenceInfo?.anatomy && !smartRationale?.referenceInfo?.physiology) {
            console.warn('⚠️ RationaleSheet: Using default reference info (no anatomical/physiological data)');
        }
    }, [smartRationale]);

    return (
        <div>
            <UltimateRationale
                isOpen={true}
                onClose={() => { }}
                item={fullItem || question}
                referenceInfo={smartRationale?.referenceInfo}
                difficulty={smartRationale?.difficulty}
                mnemonic={smartRationale?.mnemonic}
                cheatSheet={smartRationale?.cheatSheet}
                strategy={smartRationale?.difficulty?.clinicalStrategy}
                itemId={fullItem?.id || question?.id}
                // Preserve other mappings from previous version if relevant, but user said REPLACE
                outcome={smartRationale?.outcome}
                cjmmStep={smartRationale?.cjmmStep}
                coreConcept={smartRationale?.coreConcept}
                goldenRule={smartRationale?.goldenRule}
                caseSummary={smartRationale?.caseSummary}
                answerAnalysis={smartRationale?.answerAnalysis}
                trap={smartRationale?.trap}
                steps={smartRationale?.steps}
                optionReviews={smartRationale?.optionReviews}
                bowTieReview={smartRationale?.bowTieReview}
                highlightReview={smartRationale?.highlightReview}
                clozeReview={smartRationale?.clozeReview}
                orderedReview={smartRationale?.orderedReview}
                matrixRows={(smartRationale as any)?.matrixRows}
                matrixColumns={(smartRationale as any)?.matrixColumns}
                pitfalls={smartRationale?.pitfalls}
                formulaMethod={(smartRationale as any)?.formulaMethod}
                dimensionalAnalysis={(smartRationale as any)?.dimensionalAnalysis}
                metadata={{
                    type: question?.type,
                    correctValue: question?.correctValue || question?.structure?.correctValue,
                    inputLabel: question?.inputLabel || question?.structure?.inputLabel,
                    units: question?.units || question?.structure?.units,
                    fullItem: question,
                    rationale: smartRationale,
                    rationaleDifficulty: smartRationale?.difficulty,
                    ...question?.metadata,
                    ...metadata,
                    ...question?.pedagogy,
                    difficultyLevel: question?.pedagogy?.difficultyLevel || question?.metadata?.difficultyLevel || smartRationale?.difficulty?.level || 3
                }}
                activeTab={activeTab.toString()}
                onTabChange={(id) => setActiveTab(parseInt(id))}
            />
        </div>
    );
};
