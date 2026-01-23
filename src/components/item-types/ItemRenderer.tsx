import React, { useState, useEffect } from 'react';
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
import { ErrorRenderer } from './renderers/ErrorRenderer'; // New: Validation Error Display
import { UnifiedDataPipeline } from '../../services/UnifiedDataPipeline';

// --- SHARED TYPES ---
interface QuestionConfig {
    type: string;
    id?: string;
    stem?: string;
    prompt?: string;
    [key: string]: any;
}

// --- SHUFFLE CACHE (Prevents re-shuffling on every render) ---
// Key: itemId_field, Value: { data: shuffled[], timestamp: number }
const shuffleCache = new Map<string, { data: any[], timestamp: number }>();
// Clear cache for specific item or all items
export const clearShuffleCache = (itemId?: string) => {
    if (itemId) {
        // Clear entries for specific item
        for (const key of shuffleCache.keys()) {
            if (key.startsWith(`${itemId}_`)) {
                shuffleCache.delete(key);
            }
        }
        console.log(`[ItemRenderer] Cleared shuffle cache for item: ${itemId}`);
    } else {
        // Clear entire cache
        shuffleCache.clear();
        console.log('[ItemRenderer] Cleared entire shuffle cache');
    }
};


// --- DATA NORMALIZER (DELEGATED TO UNIFIED PIPELINE) ---
export const normalizeConfig = (raw: any): QuestionConfig => {
    if (!raw) return { type: 'unknown' } as QuestionConfig;

    // 1. If already processed by the modern pipeline, just hoist the structure
    if (raw._unifiedPipelineProcessed) {
        const config = raw.content?.structure || raw;
        return {
            ...config,
            id: raw.id || config.id,
            type: raw.type || config.type || 'unknown',
            // Ensure essential clinical data persists for tooltips/rationale
            clinicalData: raw.content?.clinicalData || config.clinicalData,
            // Individual renderers expect these at root
            actions: config.actions || raw.actions,
            conditions: config.conditions || raw.conditions,
            parameters: config.parameters || raw.parameters,
        } as QuestionConfig;
    }

    // 2. Fallback for un-normalized items (e.g. legacy mocks or raw imports)
    console.log('[ItemRenderer] Item NOT processed by pipeline. Running Sync Transform.');
    const normalized = UnifiedDataPipeline.transformSync(raw);
    return normalizeConfig(normalized); // Recursive call will hit step 1
};

// --- MAIN RUNTIME & HELPERS ---
const initializeAnswers = (config: QuestionConfig) => {
    if (!config) return null;
    const type = (config.type || '').toLowerCase();
    if (type.includes('bow-tie')) return { actions: [null, null], condition: null, parameters: [null, null] };
    if (type.includes('matrix')) return {};
    if (type.includes('highlight')) return [];
    if (type.includes('cloze')) return {};
    if (type.includes('multiple-response') || type.includes('sata')) return {};
    if (type.includes('trend')) {
        if (config.questionFormat === 'sata' || config.selectCount) return {};
        return null; // SC
    }
    if (type.includes('ordered-response')) {
        if (config.options && config.options.length > 0) {
            // Initial Scramble
            return [...config.options]
                .sort(() => Math.random() - 0.5)
                .map((o: any) => o.id);
        }
        return [];
    }
    if (type.includes('calculation')) return '';
    return null;
};

const validateAnswers = (answers: any, config: QuestionConfig) => {
    if (!answers && answers !== 0) return false;
    const type = (config.type || '').toLowerCase();

    if (type.includes('bow-tie')) {
        return answers.condition &&
            answers.actions?.every((a: any) => a) &&
            answers.parameters?.every((p: any) => p) &&
            answers.actions.length === 2 && answers.parameters.length === 2;
    }

    if (type.includes('highlight')) return Array.isArray(answers) && answers.length > 0;

    if (type.includes('multiple-response') || type.includes('sata') || (type.includes('trend') && (config.questionFormat === 'sata' || config.selectCount))) {
        const count = Object.values(answers).filter(Boolean).length;
        if (config.selectCount) return count === config.selectCount;
        return count > 0;
    }

    if (type.includes('matrix')) {
        if (!config.rows) return true;
        return config.rows.every((r: any) => {
            const rowAns = answers[r.id];
            if (!rowAns) return false;
            if (typeof rowAns === 'object') return Object.values(rowAns).some(Boolean);
            return true;
        });
    }

    if (type.includes('cloze')) {
        let blankCount = config.blanks?.length || 0;
        if (!blankCount && config.sentences) {
            config.sentences.forEach((s: any) => {
                // Count explicitly defined dropdowns first (most reliable)
                if (s.dropdowns?.length) {
                    blankCount += s.dropdowns.length;
                } else {
                    // Fallback: match any placeholder format %id%
                    const matches = s.text.match(/%[a-zA-Z0-9_.-]+%/g);
                    if (matches) blankCount += matches.length;
                }
            });
        }
        return Object.keys(answers).length === blankCount && Object.values(answers).every(Boolean);
    }

    if (type.includes('ordered-response')) return Array.isArray(answers) && answers.length > 0;

    if (type.includes('calculation')) return answers !== '' && answers !== null;
    return !!answers;
};

const InteractionDispatcher = (props: any) => {
    const { config } = props;
    const type = (config.type || '').toLowerCase().trim();

    // console.log('[ItemRenderer] Dispatching Type:', type); 

    if (type === 'error') return <ErrorRenderer {...props} />; // New: Validation Errors
    if (type.includes('bow-tie')) return <BowTieRenderer {...props} />;
    if (type.includes('matrix')) return <MatrixRenderer {...props} />;
    if (type.includes('highlight')) return <HighlightRenderer {...props} />;

    // FIX: Check drop-cloze BEFORE cloze (drop-cloze contains "cloze")
    if (type.includes('drop-cloze')) return <DropClozeRenderer {...props} />;
    if (type.includes('cloze')) return <ClozeRenderer {...props} />;

    if (type.includes('multiple-response') || type.includes('multiple_response') || type.includes('sata')) return <SATARenderer {...props} />;
    if (type.includes('trend')) return <TrendRenderer {...props} />;
    if (type.includes('ordered-response')) return <OrderedResponseRenderer {...props} />;

    // New Types (Robust Handling)
    if (type.includes('hot-spot') || type.includes('hot_spot') || type.includes('hotspot')) return <HotSpotRenderer {...props} />;
    if (type.includes('calculation') || type.includes('numeric') || type === 'math') return <CalculationRenderer {...props} />;

    // Explicit check for Single Response to avoid Fallback Renderer
    if (type.includes('single-response') || type.includes('single_response') || type.includes('single-choice') || type.includes('single_choice')) return <SingleChoiceRenderer {...props} />;

    // Default Fallback
    return (
        <div className="p-4 border-2 border-red-500 rounded text-red-600 bg-red-50 mb-4">
            <strong>DEBUG: Fallback Renderer Triggered</strong><br />
            Resolved Type: "{type}"<br />
            Original Type: "{config.type}"<br />
            Please report this to the developer.
            <SingleChoiceRenderer {...props} />
        </div>
    );
};

const RationaleDisplay = ({ config }: { config: any }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Helper to format text with superscript references
    const formatText = (text: any) => {
        if (!text) return null;

        // Safety: Handle if text is an object (common with i18n data)
        const str = typeof text === 'object' ? (text.en || text.text || JSON.stringify(text)) : String(text);

        const parts = str.split(/\[(\d+)\]/g);
        return parts.map((part: string, i: number) => {
            if (i % 2 === 1) {
                return <sup key={i} style={{ fontSize: '0.6em', fontWeight: 700, marginLeft: '0px', color: '#94a3b8', verticalAlign: 'super' }}>{part}</sup>;
            }
            return part;
        });
    };

    const renderRationaleCard = (id: string, label: string, data: any, isCorrectOption: boolean) => {
        let statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#64748b' }}>ℹ️</span>;

        if (isCorrectOption) {
            statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#10b981' }}>✓</span>;
        } else {
            statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#e11d48' }}>✗</span>;
        }

        return (
            <div key={id} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: isCorrectOption ? '4px solid #10b981' : '4px solid #e11d48',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flexShrink: 0 }}>{statusIcon}</div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', lineHeight: '1.4' }}>{label}</div>
                        {isCorrectOption ?
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase' }}>Correct Option</span> :
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e11d48', textTransform: 'uppercase' }}>Incorrect Option</span>
                        }
                    </div>
                </div>

                <div style={{ marginLeft: '32px', fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
                    {typeof data === 'string' ? formatText(data) : (
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600, color: isCorrectOption ? '#059669' : '#be123c' }}>
                                    {isCorrectOption ? "Why this is correct:" : "Why this is incorrect:"}
                                </span>{" "}
                                {formatText(data.detailedReason || data.text || "No detailed rationale provided.")}
                            </div>
                            {data.citation && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Source: {data.citation}</div>}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div id="rationale-section" style={{ marginTop: '2rem', scrollMarginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Rationale & Educational Key</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ background: 'transparent', border: 'none', color: '#0891b2', fontWeight: 600, cursor: 'pointer' }}
                >
                    {isExpanded ? 'Hide' : 'Show'}
                </button>
            </div>

            {isExpanded && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>

                    {/* KEY TAKEAWAY */}
                    {(config.clinicalSummary || config.rationale) && (
                        <div style={{
                            background: 'rgba(245,158,11,0.1)',
                            borderLeft: '4px solid #f59e0b',
                            padding: '16px',
                            borderRadius: '0 8px 8px 0',
                            marginBottom: '24px',
                            display: 'flex', gap: '12px'
                        }}>
                            <span style={{ fontSize: '24px' }}>💡</span>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '4px' }}>Key Takeaway</div>
                                <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.5' }}>
                                    {formatText(config.clinicalSummary || config.rationale)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTION CARDS */}
                    <div style={{ marginBottom: '24px' }}>
                        {/* Iterate same logic as before but using new card renderer */}
                        {(config.rationales || (config.type === 'highlight' && config.rationales)) && (
                            Object.entries(config.rationales).map(([key, text]: any, index: number) => {
                                // Simplify highlight label extraction for this pass
                                let label = key;
                                if (config.type === 'highlight' && config.text) {
                                    const snippetMatch = new RegExp(`<span[^>]*id=["']${key}["'][^>]*>(.*?)<\\/span>`, 'i').exec(config.text);
                                    if (snippetMatch && snippetMatch[1]) label = snippetMatch[1].trim();
                                    else label = `Highlight ${index + 1}`;
                                }

                                const correctArray = config.correct || config.correctAnswers || [];
                                const isCorrectOption = correctArray.includes(key);
                                // Pass selection status if needed for badge, but per prompt we rely on "Correct Option" / "Incorrect Option" static state
                                return renderRationaleCard(key, label, text, isCorrectOption);
                            })
                        )}

                        {/* Fallbacks */}
                        {/* Generic Options Fallback */}
                        {(config.options || config.orderedOptions)?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(opt.id, opt.text, opt.rationale, opt.isCorrect)
                        )}

                        {/* Bow-Tie Specific Pools */}
                        {config.actions?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`act_${opt.id}`, `Action: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {config.conditions?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`cond_${opt.id}`, `Condition: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {config.parameters?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`param_${opt.id}`, `Parameter: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {/* ... map other pools if needed ... */}
                    </div>

                    {/* TEST STRATEGY */}
                    <div style={{
                        background: 'rgba(59,130,246,0.1)',
                        borderLeft: '4px solid #3b82f6',
                        padding: '16px',
                        borderRadius: '0 8px 8px 0',
                        display: 'flex', gap: '12px'
                    }}>
                        <span style={{ fontSize: '24px' }}>🎯</span>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>Test-Taking Strategy</div>
                            <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.5' }}>
                                {config.strategy ? formatText(config.strategy) : "Focus on prioritizing the most urgent findings first."}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

// --- COMPONENT ---
// --- COMPONENT ---
// --- COMPONENT ---
export const renderQuestion = (
    config: QuestionConfig,
    mode: 'student' | 'author' | 'review' = 'student',
    onComplete?: (res: any) => void,
    // New Controlled Props
    answers?: any,
    onAnswersChange?: (ans: any) => void,
    isSubmitted?: boolean,
    hideFooter?: boolean,
    scale?: number
) => {
    // CRITICAL FIX: Use item ID as key to force React to remount when switching items
    // This ensures BowTie options, answers, and all state resets properly
    const itemKey = config.id || `item_${JSON.stringify(config.prompt || config.stem || '').slice(0, 50)}`;

    return <QuestionRuntime
        key={itemKey}  // Force remount when item changes
        config={config}
        mode={mode}
        onComplete={onComplete}
        controlledAnswers={answers}
        onAnswersChange={onAnswersChange}
        controlledIsSubmitted={isSubmitted}
        hideFooter={hideFooter}
        scale={scale}
    />;
};

interface QuestionRuntimePropsV2 {
    config: QuestionConfig;
    onComplete?: (result: any) => void;
    mode?: 'student' | 'author' | 'review';
    controlledAnswers?: any;
    onAnswersChange?: (ans: any) => void;
    controlledIsSubmitted?: boolean;
    hideFooter?: boolean;
    scale?: number;
}

const QuestionRuntime: React.FC<QuestionRuntimePropsV2> = (props) => {
    return (
        <React.Fragment>
            <QuestionRuntimeInner {...props} />
        </React.Fragment>
    );
};

// Inner component to handle memoization properly
const QuestionRuntimeInner: React.FC<QuestionRuntimePropsV2 & { rawConfig?: any }> = ({
    config: rawConfig,
    mode,
    onComplete,
    controlledAnswers,
    onAnswersChange,
    controlledIsSubmitted,
    hideFooter,
    scale = 1
}) => {
    const config = React.useMemo(() => normalizeConfig(rawConfig), [rawConfig]);

    // Internal state (fallback)
    const [internalAnswers, setInternalAnswers] = useState<any>(null);
    const [internalIsSubmitted, setInternalIsSubmitted] = useState(false);
    const [showRationale, setShowRationale] = useState(mode === 'author');

    // Determine effective state (Controlled vs Internal)
    const answers = controlledAnswers !== undefined ? controlledAnswers : internalAnswers;
    const isSubmitted = controlledIsSubmitted !== undefined ? controlledIsSubmitted : internalIsSubmitted;

    // Debug log removed to prevent console flooding

    // Handler wrapper
    const handleSetAnswers = (newAns: any) => {
        if (onAnswersChange) {
            onAnswersChange(newAns);
        } else {
            setInternalAnswers(newAns);
        }
    };

    // Track if we've initialized to prevent resetting on config changes
    const isInitializedRef = React.useRef(false);

    useEffect(() => {
        // Only initialize ONCE on mount, not on every config change
        if (!isInitializedRef.current) {
            if (controlledAnswers === undefined) {
                setInternalAnswers(initializeAnswers(config));
            }
            if (controlledIsSubmitted === undefined) {
                setInternalIsSubmitted(false);
            }
            isInitializedRef.current = true;
        }
        setShowRationale(mode === 'author' || mode === 'review');
    }, [config, mode, controlledAnswers, controlledIsSubmitted]);

    const handleSubmit = () => {
        if (!validateAnswers(answers, config)) {
            alert("Please complete the required fields before submitting.");
            return;
        }
        setInternalIsSubmitted(true);
        setShowRationale(true);
        if (onComplete) onComplete({ answers, isSubmitted: true });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', zoom: scale }}>
            <div style={{ flex: 1 }}>
                <InteractionDispatcher
                    config={config}
                    answers={answers}
                    setAnswers={handleSetAnswers}
                    isSubmitted={isSubmitted}
                    mode={mode}
                />

                {/* Internal Rationale (Only if footer not hidden) */}
                {isSubmitted && !hideFooter && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-card-border)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legend:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: 'var(--color-success-500)', border: '1px solid var(--color-success-700)', borderRadius: '2px' }}></span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Correct Selection</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: 'var(--color-danger-500)', border: '1px solid var(--color-danger-700)', borderRadius: '2px' }}></span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Incorrect Selection</span>
                        </div>
                    </div>
                )}
            </div>

            {!hideFooter && (
                <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem', background: 'var(--color-bg-surface)', padding: '1rem', borderRadius: '8px' }}>
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!validateAnswers(answers, config)}
                            className="btn-submit-exam"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-success-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: 'var(--color-success-100)', color: 'var(--color-success-700)', padding: '4px 8px', borderRadius: '4px' }}>Submitted</span>
                                {mode === 'author' && <span style={{ fontSize: '0.8em', color: 'var(--color-text-secondary)' }}>(Preview Mode: Rationales Visible)</span>}
                            </div>
                            {showRationale && <RationaleDisplay config={config} />}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

