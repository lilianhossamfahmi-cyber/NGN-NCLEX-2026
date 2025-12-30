import React, { useMemo } from 'react';
import { GenericRendererProps } from './types';

/**
 * HIGHLIGHT RENDERER - Gold Standard Upgrade
 * 
 * Features:
 * - "Highlighter Pen" visual metaphor
 * - Custom cursor support
 * - Accessible contrast ratios
 * - Clean CSS-based interaction states
 */

interface HighlightItem {
    id: string;
    text: string;
    isCorrect: boolean;
    rationale?: string;
}

export const HighlightRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // CSS Styles for the Gold Standard Highlighter
    // In production, these should move to a CSS file, but for portability we inject them here.
    const styles = `
        .highlight-renderer {
            font-family: 'Inter', system-ui, sans-serif;
            color: #334155;
            line-height: 2.0;
        }

        .highlight-token {
            transition: all 0.15s ease-out;
            padding: 2px 1px;
            margin: 0 1px;
            border-radius: 2px;
            position: relative;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
        }

        /* Interaction Phase States */
        .highlight-renderer:not(.submitted) .highlight-token.selectable:hover {
            background-color: #FEFCE8; /* bg-yellow-50 */
            cursor: text; /* Fallback */
            cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z" fill="%23FACC15" stroke="%23A16207" stroke-width="1.5"/><path d="M14 18L5 21" stroke="%23A16207" stroke-width="1.5"/></svg>') 0 24, pointer;
            border-bottom: 2px solid #FEF08A;
        }

        .highlight-renderer:not(.submitted) .highlight-token.selected {
            background-color: #FEF08A; /* bg-yellow-200 */
            border-bottom: 3px solid #EAB308; /* border-yellow-500 */
            color: #1F2937; /* Grey 800 for contrast */
            font-weight: 500;
        }

        .highlight-renderer:not(.submitted) .highlight-token.selectable {
            cursor: text;
             cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z" fill="%23FEF9C3" stroke="%23CA8A04" stroke-width="1.5"/><path d="M14 18L5 21" stroke="%23CA8A04" stroke-width="1.5"/></svg>') 0 24, pointer;
        }

        /* Feedback Phase States */
        /* Correct Selection (Green Marker) */
        .highlight-token.correct-selection {
            background-color: #BBF7D0; /* green-200 */
            border-bottom: 3px solid #16A34A; /* green-600 */
            color: #064E3B; /* green-900 */
            font-weight: 600;
        }

        /* Incorrect Selection (Red Marker) */
        .highlight-token.incorrect-selection {
            background-color: #FECACA; /* red-200 */
            border-bottom: 3px solid #DC2626; /* red-600 */
            color: #7F1D1D; /* red-900 */
            text-decoration: line-through;
            opacity: 0.9;
        }

        /* Missed Correct (Dotted Green) */
        .highlight-token.missed-correct {
            background: linear-gradient(to right, #DCFCE7 30%, transparent 30%);
            background-size: 8px 100%;
            border-bottom: 2px dotted #16A34A;
            color: #166534;
        }
    `;

    // Normalize answers array
    const userSelections: string[] = useMemo(() => {
        if (!answers) return [];
        return Array.isArray(answers) ? answers : [];
    }, [answers]);

    // Text Normalization Helper
    const normalizeText = (text: string) => {
        return text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
    };

    // Extract highlight items - Same logic as before to ensure compatibility
    const highlightItems: HighlightItem[] = useMemo(() => {
        const items: HighlightItem[] = [];
        const html = config.text || '';
        const correctSet = new Set<string>();

        const addToCorrect = (val: any) => {
            if (val === undefined || val === null) return;
            correctSet.add(String(val));
            correctSet.add(normalizeText(String(val)));
        };

        if (config.correct && Array.isArray(config.correct)) config.correct.forEach(addToCorrect);
        if (config.correctAnswers && Array.isArray(config.correctAnswers)) config.correctAnswers.forEach(addToCorrect);
        if (config.correctIds && Array.isArray(config.correctIds)) config.correctIds.forEach(addToCorrect);
        if (config.key && Array.isArray(config.key)) config.key.forEach(addToCorrect);

        const rationaleMap = new Map<string, any>();
        if (config.rationales && typeof config.rationales === 'object') {
            Object.entries(config.rationales).forEach(([key, rat]: [string, any]) => {
                const normKey = normalizeText(key);
                rationaleMap.set(normKey, rat);
                rationaleMap.set(key, rat);
                if (typeof rat === 'object' && (rat.isCorrect === true || rat.isCorrect === 'true' || rat.correct === true)) {
                    addToCorrect(key);
                }
            });
        }

        // Parse HTML for spans
        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        let match;
        let spanIndex = 0;

        while ((match = regex.exec(html)) !== null) {
            const id = match[1];
            const text = match[2];
            const cleanText = text.trim();
            const normText = normalizeText(cleanText);

            let isCorrect = correctSet.has(id) || correctSet.has(cleanText) || correctSet.has(normText) || correctSet.has(String(spanIndex));

            // Rationale lookup logic (preserved)
            let ratObj = config.rationales?.[id] || config.rationales?.[cleanText] || config.rationales?.[spanIndex] || rationaleMap.get(normText);

            if (!ratObj && config.rationales) {
                const keys = Object.keys(config.rationales);
                for (const key of keys) {
                    const k = normalizeText(key);
                    const t = normText;
                    if ((k.includes(t) || t.includes(k)) && k.length > 5 && t.length > 5) {
                        ratObj = config.rationales[key];
                        break;
                    }
                }
            }

            if (ratObj) {
                if (!isCorrect && typeof ratObj === 'object' && (ratObj.isCorrect === true || ratObj.isCorrect === 'true')) {
                    isCorrect = true;
                }
            }

            items.push({ id, text: cleanText, isCorrect, rationale: '' }); // Rationale text logic omitted for highlight-inline speed, can be re-added if needed
            spanIndex++;
        }

        return items;
    }, [config]);

    // Handle Click
    const handleClick = (e: React.MouseEvent) => {
        if (isSubmitted) return;
        const target = e.target as HTMLElement;

        // Handle clicks on the span or internal text
        const span = target.closest('span');
        if (span && span.id) {
            const id = span.id;
            // Ensure this ID is actually part of our highlightable set
            if (highlightItems.some(i => i.id === id)) {
                if (userSelections.includes(id)) {
                    setAnswers(userSelections.filter(x => x !== id));
                } else {
                    setAnswers([...userSelections, id]);
                }
            }
        }
    };

    // Render HTML
    const getProcessedHtml = () => {
        let html = config.text || '';

        html = html.replace(/<span\s+([^>]*?)id=["']([^"']+)["']([^>]*?)>(.*?)<\/span>/gi,
            (_match: string, preAttrs: string, id: string, postAttrs: string, content: string) => {
                const item = highlightItems.find(i => i.id === id);
                if (!item) return `<span ${preAttrs} id="${id}" ${postAttrs}>${content}</span>`;

                const isSelected = userSelections.includes(id);
                const isCorrect = item.isCorrect;

                let classes = 'highlight-token';

                if (!isSubmitted) {
                    classes += ' selectable';
                    if (isSelected) classes += ' selected';
                } else {
                    if (isSelected && isCorrect) classes += ' correct-selection';
                    else if (isSelected && !isCorrect) classes += ' incorrect-selection';
                    else if (!isSelected && isCorrect) classes += ' missed-correct';
                    else classes += ' neutral';
                }

                // Clean existing inline styles from the span if any (user content might have them)
                // We append our class
                return `<span ${preAttrs} id="${id}" ${postAttrs} class="${classes}">${content}</span>`;
            }
        );
        return html;
    };

    // Results Calculation
    const totalCorrect = highlightItems.filter(i => i.isCorrect).length;
    const userCorrectCount = userSelections.filter(id => highlightItems.find(i => i.id === id)?.isCorrect).length;
    const userIncorrectCount = userSelections.filter(id => {
        const item = highlightItems.find(i => i.id === id);
        return item && !item.isCorrect;
    }).length;
    const netScore = Math.max(0, userCorrectCount - userIncorrectCount);
    const scorePercent = totalCorrect > 0 ? Math.round((netScore / totalCorrect) * 100) : 0;
    const missedCount = totalCorrect - userCorrectCount;

    return (
        <div className={`highlight-renderer ${isSubmitted ? 'submitted' : ''}`}>
            <style>{styles}</style>

            {/* Main Text Area */}
            <div
                onClick={handleClick}
                style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1.05rem',
                }}
                dangerouslySetInnerHTML={{ __html: getProcessedHtml() }}
            />

            {/* Legacy Instruction/Legend */}
            {!isSubmitted && (
                <div style={{ marginTop: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🖊️</span>
                    <span><strong>Click text to highlight</strong> key findings. Deselect by clicking again.</span>
                </div>
            )}

            {/* Results Section */}
            {isSubmitted && (
                <div style={{ marginTop: '1.5rem' }}>
                    {/* Score Ribbon */}
                    <div style={{
                        display: 'flex',
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '8px',
                        padding: '16px',
                        justifyContent: 'space-around',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#15803D' }}>{scorePercent}%</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SCORE</div>
                        </div>
                        <div style={{ width: '1px', background: '#BBF7D0' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#166534' }}>{userCorrectCount}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CORRECT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#DC2626' }}>{userIncorrectCount}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>INCORRECT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#CA8A04' }}>{missedCount}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MISSED</div>
                        </div>
                    </div>

                    {/* Rationale Section */}
                    {(config.rationale || config.explanation) && (
                        <div style={{ background: '#F0F9FF', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0EA5E9' }}>
                            <div style={{ fontWeight: 600, color: '#0369A1', marginBottom: '8px' }}>Clinical Explanation</div>
                            <div style={{ color: '#334155', lineHeight: '1.6' }}>
                                {typeof config.rationale === 'object' ?
                                    (config.rationale.answerAnalysis || config.rationale.caseSummary || "Refer to rationale for details.") :
                                    (config.rationale || config.explanation)
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
