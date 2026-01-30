import React from 'react';
import { GenericRendererProps } from './types';

/**
 * DropClozeRenderer
 * 
 * Renders NGN Drop-Cloze (Select-from-Dropdown or Drag-and-Drop).
 * Aligned with Canonical Object-based Options Schema.
 */
export const DropClozeRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // answers: { [blankId]: tokenText } 
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

    // Canonical source detection
    const clozeText = config.text || config.sentence || config.content || '';
    const dropdowns = config.dropdowns || [];

    /**
     * Runtime Normalization Shim (Backward Compatibility)
     * Ensures options are objects even if legacy data is missing an ID or is a string array.
     */
    const normalizeOptions = (options: any[], dropdownId: string): any[] => {
        if (!Array.isArray(options)) return [];
        return options.map((opt, i) => {
            if (typeof opt === 'string') {
                return { id: `${dropdownId}-shim-${i}`, text: opt, isCorrect: false };
            }
            return {
                id: opt.id || `${dropdownId}-o${i}`,
                text: opt.text || opt.label || "",
                isCorrect: !!opt.isCorrect
            };
        });
    };

    const isFormatSelect = !config.sentences && clozeText && dropdowns.length > 0;

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

            {/* TOKEN BANK - Only for Drag Mode */}
            {(!isFormatSelect) && (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '24px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>DRAG OPTIONS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(() => {
                            const allTokens = new Set<string>();
                            dropdowns.forEach((d: any) => {
                                (d.options || []).forEach((o: any) => {
                                    if (typeof o === 'string') allTokens.add(o);
                                    else if (o.text) allTokens.add(o.text);
                                });
                            });
                            // Fallback to explicit tokens if available
                            if (config.tokens) config.tokens.forEach((t: string) => allTokens.add(t));

                            return Array.from(allTokens).map((t, idx) => (
                                <div
                                    key={idx}
                                    className="token-chip"
                                    draggable={!isSubmitted}
                                    onDragStart={(e) => handleDragStart(e, t)}
                                >
                                    {t}
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}

            {/* SENTENCES AREA */}
            <div style={{ fontSize: '1.1rem', lineHeight: '2.0', color: '#334155' }}>
                {/* Format 1: sentences array (Drag Mode) */}
                {config.sentences?.map((sent: any, i: number) => {
                    let text = sent.text || (typeof sent === 'string' ? sent : '');
                    const parts = text.split(/(%\{?[a-zA-Z0-9_.-]+\}?%)/);

                    return (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            {parts.map((part: string, idx: number) => {
                                const match = part.match(/^%\{?([a-zA-Z0-9_.-]+)\}?%$/);
                                if (match) {
                                    const blankId = match[1];
                                    const dropdown = sent.dropdowns?.find((d: any) => d.id === blankId);
                                    const options = normalizeOptions(dropdown?.options || [], blankId);
                                    const correctOpt = options.find(o => o.isCorrect);
                                    const correctText = correctOpt?.text || "";

                                    const userVal = currentAnswers[blankId];
                                    const isCorrect = isSubmitted && userVal === correctText;
                                    const isWrong = isSubmitted && userVal && userVal !== correctText;

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

                {/* Format 2: Select Mode */}
                {isFormatSelect && (
                    <div style={{ marginBottom: '1rem' }}>
                        {clozeText.split(/(%\{[a-zA-Z0-9_]+\})/).map((part: string, idx: number) => {
                            const match = part.match(/^%\{([a-zA-Z0-9_]+)\}$/);
                            if (match) {
                                const blankId = match[1];
                                const dropdown = dropdowns.find((d: any) => d.id === blankId) || dropdowns[idx]; // Robust fallback
                                if (!dropdown) return <span key={idx}>[Missing Dropdown]</span>;

                                const options = normalizeOptions(dropdown.options, blankId);
                                const correctOpt = options.find(o => o.isCorrect);
                                const correctText = correctOpt?.text || '';

                                const userVal = currentAnswers[blankId] || currentAnswers[dropdown.id];
                                const isCorrect = isSubmitted && userVal === correctText;
                                const isWrong = isSubmitted && userVal && userVal !== correctText;

                                return (
                                    <select
                                        key={idx}
                                        value={userVal || ''}
                                        onChange={(e) => !isSubmitted && setAnswers({ ...currentAnswers, [dropdown.id || blankId]: e.target.value })}
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
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
