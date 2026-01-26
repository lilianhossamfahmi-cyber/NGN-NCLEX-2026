import React, { useMemo, useEffect } from 'react';
import { UltimateRationale } from './UltimateRationale';
import { RationaleSheetProps } from '../types';
import { RationalePipeline } from '../services/RationalePipeline';

export const RationaleSheet: React.FC<RationaleSheetProps> = ({
    question,
    fullItem,
    rationale: explicitRationale,
    metadata,
    onClose,
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

        // OPTION 2: Use question (specific screen) FIRST for interaction mapping
        // This is crucial for Case Studies where Question 2 is a Matrix but fullItem is "Case Study"
        if (question) {
            console.log('✅ RationaleSheet: Extracting from question (specific screen)');
            try {
                // Merge question content with full item rationale for the best of both worlds
                const configForPipeline = {
                    ...question,
                    content: {
                        ...(question.content || {}),
                        // Inherit rationale from fullItem if screen-level is missing
                        rationale: question.content?.rationale || fullItem?.content?.rationale
                    }
                };
                const processed = RationalePipeline.generateRationale(configForPipeline, metadata?.userAns, configForPipeline.content.rationale);
                console.log('✅ RationaleSheet: Successfully processed screen rationale', processed);
                return processed;
            } catch (error) {
                console.error('❌ RationaleSheet: Error processing screen rationale', error);
            }
        }

        // OPTION 3: Extract from fullItem (fallback)
        if (fullItem?.content?.rationale) {
            console.log('✅ RationaleSheet: Extracting from fullItem.content.rationale (root)');
            try {
                const configForPipeline = { ...fullItem.content, type: fullItem.type, id: fullItem.id };
                const processed = RationalePipeline.generateRationale(configForPipeline, metadata?.userAns, fullItem.content.rationale);
                return processed;
            } catch (error) {
                console.error('❌ RationaleSheet: Error processing fullItem rationale', error);
            }
        }

        // OPTION 4: Create default rationale (last resort)
        return RationalePipeline.createDefaultRationale();
    }, [explicitRationale, fullItem?.content?.rationale, question]);

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
                onClose={onClose}
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
                reviewUnits={smartRationale?.reviewUnits || smartRationale?.optionReviews?.map((opt: any, idx: number) => ({
                    id: opt.id || `opt-${idx}`,
                    itemType: question?.type || 'multiple-choice',
                    sequence: idx + 1,
                    label: String.fromCharCode(65 + idx), // A, B, C...
                    optionText: opt.text,
                    keyIsCorrect: opt.isCorrect,
                    userSelected: opt.userSelected,
                    status: (opt.isCorrect && opt.userSelected) ? 'SELECTED_CORRECT' :
                        (!opt.isCorrect && opt.userSelected) ? 'SELECTED_INCORRECT' :
                            (opt.isCorrect && !opt.userSelected) ? 'MISSED_CORRECT' : 'NOT_SELECTED_INCORRECT',
                    whyCorrect: opt.isCorrect ? opt.rationale : undefined,
                    whyIncorrect: !opt.isCorrect ? opt.rationale : undefined
                }))}
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
