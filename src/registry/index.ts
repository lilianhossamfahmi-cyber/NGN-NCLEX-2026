import { QuestionTypeDefinition } from '../types/master-schema';
import { CaseStudyConfig } from './case-study/config';
import { TrendConfig } from './trend/config';
import { BowTieConfig } from './bow-tie/config';
import { MatrixMRConfig } from './matrix-mr/config';
import { HighlightConfig } from './highlight/config';
import { ClozeConfig } from './cloze/config';
import { SATAConfig } from './sata/config';
import { SingleResponseConfig } from './single-response/config';
import { OrderedResponseConfig } from './ordered-response/config';
import { CalculationConfig } from './calculation/config';
import { HotSpotConfig } from './hot-spot/config';

/**
 * The Master Registry of all NGN Question Types.
 * This is the SINGLE SOURCE OF TRUTH for the Master Creator.
 * 
 * STATUS REPORT:
 *  - Case Study: Completed
 *  - Trend: Completed
 *  - Bow-Tie: Completed
 *  - Matrix MR: Completed
 *  - Highlight: Completed
 *  - Cloze: Completed
 *  - SATA: Completed
 *  - Single Response: Completed
 *  - Ordered Response: Completed
 * 
 * ALL MODULES IMPLEMENTED.
 */
export const QuestionTypeRegistry: QuestionTypeDefinition[] = [
    CaseStudyConfig,
    TrendConfig,
    BowTieConfig,
    MatrixMRConfig,
    HighlightConfig,
    ClozeConfig,
    SATAConfig,
    SingleResponseConfig,
    OrderedResponseConfig,
    CalculationConfig,
    HotSpotConfig
];

export const getQuestionType = (typeId: string) => {
    return QuestionTypeRegistry.find(q => q.typeId === typeId);
};
