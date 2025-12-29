import React, { useMemo } from 'react';
import { GenericRendererProps } from './types';

/**
 * HIGHLIGHT RENDERER - Professional Implementation
 * 
 * DESIGN PRINCIPLES:
 * 1. Extract all highlightable items upfront for consistent processing
 * 2. Use a unified correctness check that works with multiple data formats
 * 3. Clear visual feedback with proper color coding
 * 4. Comprehensive rationale display grouped by result type
 */

interface HighlightItem {
    id: string;
    text: string;
    isCorrect: boolean;
    rationale?: string;
}

export const HighlightRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // Normalize answers to always be an array
    const userSelections: string[] = useMemo(() => {
        if (!answers) return [];
        if (Array.isArray(answers)) return answers;
        return [];
    }, [answers]);

    // Helper: Normalize text for fuzzy matching (remove punctuation, lower case, trim)
    const normalizeText = (text: string) => {
        return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
    };

    // Extract all highlightable items from the text
    // Extract all highlightable items from the text
    const highlightItems: HighlightItem[] = useMemo(() => {
        const items: HighlightItem[] = [];
        const html = config.text || '';

        // Build a correctness lookup from various possible sources
        const correctSet = new Set<string>();

        // Helper to add to set safely
        const addToCorrect = (val: any) => {
            if (val === undefined || val === null) return;
            correctSet.add(String(val));
            correctSet.add(normalizeText(String(val))); // Also add normalized version
        };

        // Source 1: config.correct array
        if (config.correct && Array.isArray(config.correct)) config.correct.forEach(addToCorrect);
        // Source 2: config.correctAnswers array
        if (config.correctAnswers && Array.isArray(config.correctAnswers)) config.correctAnswers.forEach(addToCorrect);
        // Source 3: config.correctIds array
        if (config.correctIds && Array.isArray(config.correctIds)) config.correctIds.forEach(addToCorrect);
        // Source 4: config.key array
        if (config.key && Array.isArray(config.key)) config.key.forEach(addToCorrect);

        // Source 5: Derive from rationales
        const rationaleMap = new Map<string, any>(); // Map normalized key -> rationale object

        if (config.rationales && typeof config.rationales === 'object') {
            Object.entries(config.rationales).forEach(([key, rat]: [string, any]) => {
                const normKey = normalizeText(key);
                rationaleMap.set(normKey, rat);
                rationaleMap.set(key, rat); // Keep original too

                if (typeof rat === 'object' && (rat.isCorrect === true || rat.isCorrect === 'true' || rat.correct === true)) {
                    addToCorrect(key);
                }
            });
        }

        // Regex to find all <span id="X">text</span> patterns
        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        let match;
        let spanIndex = 0;

        while ((match = regex.exec(html)) !== null) {
            const id = match[1];
            const text = match[2];
            const cleanText = text.trim();
            const normText = normalizeText(cleanText);

            // Check correctness with FUZZY fallbacks
            let isCorrect =
                correctSet.has(id) ||
                correctSet.has(cleanText) ||
                correctSet.has(normText) ||
                correctSet.has(String(spanIndex));

            // Get rationale text using fuzzy lookup
            let rationale = '';
            // Try explicit ID match
            let ratObj = config.rationales?.[id] || config.rationales?.[cleanText] || config.rationales?.[spanIndex];

            // Try fuzzy match if exact failed
            if (!ratObj) {
                ratObj = rationaleMap.get(normText);
            }

            // FALLBACK: Aggressive Partial Text Match for Rationales
            if (!ratObj && config.rationales && typeof config.rationales === 'object') {
                const keys = Object.keys(config.rationales);
                for (const key of keys) {
                    const k = normalizeText(key);
                    const t = normText;
                    // Check if key contains text OR text contains key (length > 5 to avoid short noise like "BP")
                    if ((k.includes(t) || t.includes(k)) && k.length > 5 && t.length > 5) {
                        ratObj = config.rationales[key];
                        break;
                    }
                }
            }

            if (ratObj) {
                rationale = typeof ratObj === 'string' ? ratObj : (ratObj.text || ratObj.detailedReason || ratObj.rationale || '');
                // Double check correctness from the rationale object itself if we found one
                if (!isCorrect && typeof ratObj === 'object' && (ratObj.isCorrect === true || ratObj.isCorrect === 'true')) {
                    isCorrect = true;
                }
            }

            items.push({
                id,
                text: cleanText,
                isCorrect,
                rationale
            });
            spanIndex++;
        }

        return items;
    }, [config]);

    // Compute results after submission
    const results = useMemo(() => {
        if (!isSubmitted) return { correct: [], incorrect: [], missed: [] };

        const correct: HighlightItem[] = [];
        const incorrect: HighlightItem[] = [];
        const missed: HighlightItem[] = [];

        highlightItems.forEach(item => {
            const isSelected = userSelections.includes(item.id);

            if (isSelected && item.isCorrect) {
                correct.push(item);
            } else if (isSelected && !item.isCorrect) {
                incorrect.push(item);
            } else if (!isSelected && item.isCorrect) {
                missed.push(item);
            }
        });

        return { correct, incorrect, missed };
    }, [isSubmitted, highlightItems, userSelections]);

    // Handle click on highlightable text
    const handleClick = (e: React.MouseEvent) => {
        if (isSubmitted) return;
        const target = e.target as HTMLElement;

        if (target.tagName === 'SPAN' && target.id) {
            const id = target.id;
            if (userSelections.includes(id)) {
                setAnswers(userSelections.filter(x => x !== id));
            } else {
                setAnswers([...userSelections, id]);
            }
        }
    };

    // Generate styled HTML for display
    const getProcessedHtml = () => {
        let html = config.text || '';

        html = html.replace(/<span\s+([^>]*?)id=["']([^"']+)["']([^>]*?)>(.*?)<\/span>/gi,
            (_match: string, preAttrs: string, id: string, postAttrs: string, content: string) => {
                const item = highlightItems.find(i => i.id === id);
                const isSelected = userSelections.includes(id);
                const isCorrect = item?.isCorrect || false;

                let className = '';
                let style = 'cursor: pointer; padding: 3px 6px; border-radius: 4px; transition: all 0.2s; display: inline;';

                if (!isSubmitted) {
                    // INTERACTION PHASE
                    if (isSelected) {
                        style += ' background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); border: 2px solid #eab308; color: #713f12; font-weight: 600;';
                        className = 'highlight-selected';
                    } else {
                        style += ' background: rgba(148, 163, 184, 0.1); border-bottom: 2px dotted #94a3b8;';
                        className = 'highlight-selectable';
                    }
                } else {
                    // FEEDBACK PHASE
                    if (isSelected && isCorrect) {
                        // ✓ CORRECT SELECTION - Green solid
                        style += ' background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%); border: 2px solid #16a34a; color: #052e16; font-weight: 700;';
                        className = 'highlight-correct';
                    } else if (isSelected && !isCorrect) {
                        // ✗ INCORRECT SELECTION - Red solid with strikethrough
                        style += ' background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%); border: 2px solid #dc2626; color: #450a0a; font-weight: 600; text-decoration: line-through;';
                        className = 'highlight-incorrect';
                    } else if (!isSelected && isCorrect) {
                        // ⚠ MISSED CORRECT - Quarter Green, Rest Yellow, Dotted
                        style += ' background: linear-gradient(to right, #dcfce7 25%, #fef9c3 25%); border: 2px dotted #16a34a; color: #166534; font-weight: 500;';
                        className = 'highlight-missed';
                    } else {
                        // Neutral - not selected, not correct
                        style += ' background: transparent; color: #94a3b8; opacity: 0.6;';
                        className = 'highlight-neutral';
                    }
                }

                return `<span ${preAttrs} id="${id}" ${postAttrs} class="${className}" style="${style}">${content}</span>`;
            }
        );
        return html;
    };

    // Render a result category
    {/*
    const renderResultCategory = (
        title: string,
        items: HighlightItem[],
        icon: string,
        bgColor: string,
        borderColor: string,
        textColor: string
    ) => {
        if (items.length === 0) return null;

        return (
            <div style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '8px', border: `1px solid ${borderColor}40`, overflow: 'hidden' }}>
                <div style={{
                    padding: '10px 16px',
                    background: bgColor,
                    borderBottom: `1px solid ${borderColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <strong style={{ color: textColor, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{icon}</span> {title} ({items.length})
                    </strong>
                </div>
                <div style={{ padding: '0' }}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '0.9rem',
                            display: 'flex', flexDirection: 'column', gap: '4px'
                        }}>
                            <div style={{ fontWeight: 500, color: '#334155' }}>
                                "{item.text}"
                            </div>
                            {(item.rationale) && (
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', paddingLeft: '8px', borderLeft: `2px solid ${borderColor}60` }}>
                                    {item.rationale}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    */}

    // Calculate score
    const totalCorrect = highlightItems.filter(i => i.isCorrect).length;
    const userCorrect = results.correct.length;
    const userIncorrect = results.incorrect.length;
    // NGN Scoring Algorithm: Net Score = Correct - Incorrect (Min 0)
    const netScore = Math.max(0, userCorrect - userIncorrect);
    const scorePercent = totalCorrect > 0 ? Math.round((netScore / totalCorrect) * 100) : 0;

    return (
        <div className="highlight-renderer">
            {/* Main Text Area */}
            <div
                onClick={handleClick}
                style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    lineHeight: '2.0',
                    fontSize: '1.05rem',
                    color: '#334155',
                    cursor: isSubmitted ? 'default' : 'text'
                }}
                dangerouslySetInnerHTML={{ __html: getProcessedHtml() }}
            />

            {/* Legend - Show during interaction */}
            {!isSubmitted && (
                <div style={{ marginTop: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                    <strong>Instructions:</strong> Click on the highlighted text segments to select your answers.
                    Selected items appear with a <span style={{ background: '#fef08a', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>yellow highlight</span>.
                </div>
            )}

            {/* Results Section - After Submission */}
            {isSubmitted && (
                <div style={{ marginTop: '1.5rem' }}>
                    {/* Score Summary */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '1.5rem',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: '1', minWidth: '120px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#166534' }}>{scorePercent}%</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>NGN Score</div>
                        </div>
                        <div style={{ flex: '1', minWidth: '80px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>{userCorrect}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Correct</div>
                        </div>
                        <div style={{ flex: '1', minWidth: '80px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>{userIncorrect}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Incorrect</div>
                        </div>
                        <div style={{ flex: '1', minWidth: '80px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ca8a04' }}>{results.missed.length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Missed</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '1.5rem',
                        padding: '10px 16px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #bbf7d0, #86efac)', border: '2px solid #16a34a', borderRadius: '3px' }}></span>
                            <span>Correct Selection</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '20px', height: '14px', background: 'linear-gradient(to right, #dcfce7 25%, #fef9c3 25%)', border: '2px dotted #16a34a', borderRadius: '3px' }}></span>
                            <span>Missed Correct</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #fecaca, #fca5a5)', border: '2px solid #dc2626', borderRadius: '3px' }}></span>
                            <span>Incorrect Selection</span>
                        </div>
                    </div>

                    {/* Global Rationale / Explanation */}
                    {(config.rationale || config.explanation) && (
                        <div style={{ marginBottom: '1.5rem', background: '#f0f9ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0ea5e9' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>💡</span> Clinical Explanation
                            </h4>
                            <div style={{ color: '#334155', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                {typeof config.rationale === 'object' ?
                                    (config.rationale.answerAnalysis || config.rationale.caseSummary || "Please verify the Rationale tab for detailed analysis.") :
                                    (config.rationale || config.explanation)
                                }
                            </div>
                        </div>
                    )}

                    {/* Grouped Results with Rationales */}
                    {/* Grouped Results with Rationales - HIDDEN PER REQUEST */}
                    {/*
                    <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1rem' }}>Detailed Analysis</h4>

                        {renderResultCategory(
                            'Correct Selections',
                            results.correct,
                            '✓',
                            '#dcfce7',
                            '#16a34a',
                            '#166534'
                        )}

                        {renderResultCategory(
                            'Incorrect Selections',
                            results.incorrect,
                            '✗',
                            '#fee2e2',
                            '#dc2626',
                            '#991b1b'
                        )}

                        {renderResultCategory(
                            'Missed Correct Answers',
                            results.missed,
                            '⚠',
                            '#fef9c3',
                            '#ca8a04',
                            '#854d0e'
                        )}

                        {results.correct.length === 0 && results.incorrect.length === 0 && results.missed.length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                No highlightable items found in this question.
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                            <details>
                                <summary style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Show Debug Data (Troubleshooting)
                                </summary>
                                <div style={{ marginTop: '0.5rem', padding: '10px', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'monospace', overflowX: 'auto' }}>
                                    <div><strong>Correct Arrays Found:</strong></div>
                                    <div>config.correct: {JSON.stringify(config.correct)}</div>
                                    <div>config.correctAnswers: {JSON.stringify(config.correctAnswers)}</div>
                                    <div>config.correctIds: {JSON.stringify(config.correctIds)}</div>
                                    <div>config.key: {JSON.stringify(config.key)}</div>
                                    <div style={{ marginTop: '6px' }}><strong>Rationale Keys:</strong></div>
                                    <div>{JSON.stringify(config.rationales ? Object.keys(config.rationales) : 'None')}</div>
                                    <div style={{ marginTop: '6px' }}><strong>Detected Highlight Items (Total {highlightItems.length}):</strong></div>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {highlightItems.map(i => (
                                            <div key={i.id} style={{ borderBottom: '1px solid #e2e8f0', padding: '2px 0' }}>
                                                [{i.id}] IsCorrect: {String(i.isCorrect)} | Text: "{i.text.substring(0, 30)}..."
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                    */}
                </div>
            )}
        </div>
    );
};
