import React from 'react';
import { GenericRendererProps } from './types';

export const DropClozeRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // answers: { [blankId]: tokenText } 
    // Init state if null
    const currentAnswers = answers || {};

    const handleDragStart = (e: React.DragEvent, token: string) => {
        if (isSubmitted) return;
        e.dataTransfer.setData('token', token);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDrop = (e: React.DragEvent, blankId: string) => {
        e.preventDefault();
        if (isSubmitted) return;
        const token = e.dataTransfer.getData('token');
        if (token) {
            setAnswers({ ...currentAnswers, [blankId]: token });
        }
    };

    const handleClear = (blankId: string) => {
        if (isSubmitted) return;
        const newAns = { ...currentAnswers };
        delete newAns[blankId];
        setAnswers(newAns);
    };

    // FIX: Detect text field from multiple possible sources
    const clozeText = config.text || config.content || config.sentence || '';

    // FIX: Detect dropdowns from multiple possible sources
    const dropdowns = config.dropdowns || [];

    // Tokens Pool: Extract from explicit tokens, or collect all options from dropdowns
    let tokens: string[] = config.tokens || config.options?.map((o: any) => o.text) || [];

    // If no explicit tokens but we have dropdowns, extract all options
    if (tokens.length === 0 && dropdowns.length > 0) {
        dropdowns.forEach((dd: any) => {
            if (dd.options && Array.isArray(dd.options)) {
                dd.options.forEach((opt: any) => {
                    if (opt.text && !tokens.includes(opt.text)) {
                        tokens.push(opt.text);
                    }
                });
            }
        });
    }

    const isFormat2 = !config.sentences && clozeText && dropdowns.length > 0;

    return (
        <div className="drop-cloze-renderer">
            <style>{`
                .token-chip {
                    display: inline-block;
                    padding: 4px 12px;
                    background: white;
                    border: 1px solid #cbd5e1;
                    border-radius: 999px;
                    margin: 4px;
                    cursor: grab;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    user-select: none;
                }
                .token-chip:active { cursor: grabbing; }
                .drop-zone {
                    display: inline-block;
                    min-width: 100px;
                    height: 1.5em;
                    border-bottom: 2px solid #3b82f6;
                    background: #eff6ff;
                    margin: 0 4px;
                    vertical-align: bottom;
                    text-align: center;
                    color: #1e40af;
                    font-weight: 500;
                    cursor: pointer;
                }
                .drop-zone.filled {
                    border-bottom-style: solid;
                    background: #dbeafe;
                }
                .drop-zone.correct {
                    border-color: #16a34a;
                    background: #dcfce7;
                    color: #166534;
                }
                .drop-zone.incorrect {
                    border-color: #dc2626;
                    background: #fee2e2;
                    color: #991b1b;
                }
            `}</style>


            {/* TOKEN BANK - Hide if in Format 2 (Select Mode) */}
            {(!isFormat2) && (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '24px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>DRAG OPTIONS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tokens.map((t: string, idx: number) => (
                            <div
                                key={idx}
                                className="token-chip"
                                draggable={!isSubmitted}
                                onDragStart={(e) => handleDragStart(e, t)}
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SENTENCES AREA - Handle both sentences[] and text+dropdowns formats */}
            <div style={{ fontSize: '1.1rem', lineHeight: '2.0', color: '#334155' }}>
                {/* Format 1: sentences array */}
                {config.sentences?.map((sent: any, i: number) => {
                    let repairedText = sent.text || sent.sentence || sent.content || (typeof sent === 'string' ? sent : '') || '[ System: Content Generation Error - Sentence Text Missing ]';

                    // Auto-Repair Malformed Underscores
                    if (!repairedText.match(/%[a-zA-Z0-9_]+%/)) {
                        const placeholderRegex = /_{3,}|\[\.\.\.\]|\[dropdown\d+\]|<b>\[\d+\]<\/b>|\{\}|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*><\/span>|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*>.*?<\/span>/gi;
                        let matchIndex = 0;
                        repairedText = repairedText.replace(placeholderRegex, () => {
                            if (sent.dropdowns && sent.dropdowns[matchIndex]) {
                                const dId = sent.dropdowns[matchIndex].id;
                                matchIndex++;
                                return `%${dId}%`; // Auto-inject token
                            }
                            return '____';
                        });
                    }

                    const parts = repairedText.split(/(%[a-zA-Z0-9_]+%)/);
                    return (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            {parts.map((part: string, idx: number) => {
                                const match = part.match(/^%([a-zA-Z0-9_]+)%$/);
                                if (match) {
                                    const blankId = match[1];
                                    // Find correct answer for validation
                                    const correctToken = sent.dropdowns?.find((d: any) => d.id === blankId)?.correctOptionText ||
                                        config.correct?.[blankId]; // Fallback

                                    const userVal = currentAnswers[blankId];
                                    const isCorrect = isSubmitted && userVal === correctToken;
                                    const isWrong = isSubmitted && userVal && userVal !== correctToken;

                                    let zoneClass = 'drop-zone';
                                    if (userVal) zoneClass += ' filled';
                                    if (isCorrect) zoneClass += ' correct';
                                    if (isWrong) zoneClass += ' incorrect';

                                    return (
                                        <span
                                            key={idx}
                                            className={zoneClass}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, blankId)}
                                            onClick={() => handleClear(blankId)}
                                            title={isSubmitted ? `Correct: ${correctToken}` : "Click to clear"}
                                        >
                                            {userVal || (isSubmitted ? <span style={{ color: '#ef4444' }}>(Missed)</span> : "")}
                                        </span>
                                    );
                                }
                                return <span key={idx}>{part}</span>;
                            })}
                        </div>
                    );
                })}

                {/* Format 2: Golden Prompt (text + dropdowns) - use extracted values */}
                {!config.sentences && clozeText && dropdowns.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                        {(() => {
                            // Parse text like "The nurse anticipates orders for %{d1} to manage %{d2}."
                            const parts = clozeText.split(/(%\{[a-zA-Z0-9_]+\})/);
                            let dropdownIndex = 0; // Track which dropdown we're on

                            return parts.map((part: string, idx: number) => {
                                const match = part.match(/^%\{([a-zA-Z0-9_]+)\}$/);
                                if (match) {
                                    const blankId = match[1];

                                    // Find the dropdown configuration - try multiple matching strategies
                                    let dropdown = dropdowns.find((d: any) => d.id === blankId);

                                    // Fallback 1: Try matching by index if ID doesn't match
                                    if (!dropdown && dropdownIndex < dropdowns.length) {
                                        dropdown = dropdowns[dropdownIndex];
                                    }

                                    // Fallback 2: Try matching with different ID formats
                                    if (!dropdown) {
                                        dropdown = dropdowns.find((d: any) =>
                                            d.id === `dropdown${dropdownIndex + 1}` ||
                                            d.id === `d${dropdownIndex + 1}` ||
                                            d.id === `blank${dropdownIndex + 1}`
                                        );
                                    }

                                    dropdownIndex++; // Move to next dropdown

                                    const options = dropdown?.options || [];

                                    // Debug: Log if no options found
                                    if (options.length === 0) {
                                        console.warn(`[DropClozeRenderer] No options for blank ${blankId}. Dropdown:`, dropdown, 'All dropdowns:', dropdowns);
                                    }

                                    const correctOpt = options.find((o: any) => o.isCorrect);
                                    const correctText = correctOpt?.text || '';

                                    const userVal = currentAnswers[blankId] || currentAnswers[dropdown?.id];
                                    const isCorrect = isSubmitted && userVal === correctText;
                                    const isWrong = isSubmitted && userVal && userVal !== correctText;

                                    // Render as select dropdown
                                    return (
                                        <select
                                            key={idx}
                                            value={userVal || ''}
                                            onChange={(e) => !isSubmitted && setAnswers({ ...currentAnswers, [dropdown?.id || blankId]: e.target.value })}
                                            disabled={isSubmitted}
                                            style={{
                                                padding: '4px 8px',
                                                margin: '0 4px',
                                                borderRadius: '4px',
                                                border: `2px solid ${isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#3b82f6'}`,
                                                background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#eff6ff',
                                                color: isCorrect ? '#166534' : isWrong ? '#991b1b' : '#1e40af',
                                                fontWeight: 500,
                                                minWidth: '150px',
                                                cursor: isSubmitted ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            {options.map((opt: any, oi: number) => (
                                                <option key={oi} value={opt.text}>{opt.text}</option>
                                            ))}
                                        </select>
                                    );
                                }
                                return <span key={idx}>{part}</span>;
                            });
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};
