
import { BowTieRenderer } from './renderers/BowTieRenderer';
import { MatrixRenderer } from './renderers/MatrixRenderer';
import { HighlightRenderer } from './renderers/HighlightRenderer';
import { ClozeRenderer } from './renderers/ClozeRenderer';
import { SATARenderer } from './renderers/SATARenderer';
import { SingleChoiceRenderer } from './renderers/SingleChoiceRenderer';
import { TrendRenderer } from './renderers/TrendRenderer';
import { OrderedResponseRenderer } from './renderers/OrderedResponseRenderer';
import { DropClozeRenderer } from './renderers/DropClozeRenderer';
import { HotSpotRenderer } from './renderers/HotSpotRenderer';
import { CalculationRenderer } from './renderers/CalculationRenderer';
import { ErrorRenderer } from './renderers/ErrorRenderer';
import { CaseStudyRenderer } from './renderers/CaseStudyRenderer';

export const InteractionDispatcher = (props: any) => {
    const { config } = props;
    const type = (config.type || '').toLowerCase().trim();

    if (type === 'error') return <ErrorRenderer {...props} />;
    if (type.includes('case-study')) return <CaseStudyRenderer {...props} />;
    if (type.includes('bow-tie')) return <BowTieRenderer {...props} />;
    if (type.includes('matrix')) return <MatrixRenderer {...props} />;
    if (type.includes('highlight')) return <HighlightRenderer {...props} />;

    if (type.includes('drop-cloze')) return <DropClozeRenderer {...props} />;
    if (type.includes('cloze')) return <ClozeRenderer {...props} />;

    if (type.includes('multiple-response') || type.includes('multiple_response') || type.includes('sata')) return <SATARenderer {...props} />;
    if (type.includes('trend')) return <TrendRenderer {...props} />;
    if (type.includes('ordered-response')) return <OrderedResponseRenderer {...props} />;

    if (type.includes('hot-spot') || type.includes('hot_spot') || type.includes('hotspot')) return <HotSpotRenderer {...props} />;
    if (type.includes('calculation') || type.includes('numeric') || type === 'math') return <CalculationRenderer {...props} />;

    if (type.includes('single-response') || type.includes('single_response') || type.includes('single-choice') || type.includes('single_choice')) return <SingleChoiceRenderer {...props} />;

    return (
        <div className="p-4 border-2 border-red-500 rounded text-red-600 bg-red-50 mb-4">
            <strong>DEBUG: Fallback Renderer Triggered</strong><br />
            Resolved Type: "{type}"<br />
            Original Type: "{config.type}"<br />
            <SingleChoiceRenderer {...props} />
        </div>
    );
};
