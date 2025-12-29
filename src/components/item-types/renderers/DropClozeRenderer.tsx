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

    // Tokens Pool (All correct + distractors)
    // Extract from config.tokens or config.options
    // If tokens not explicit, maybe derive from sentences? No, usually a pool is provided.
    const tokens = config.tokens || config.options?.map((o: any) => o.text) || [];

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

            {/* TOKEN BANK */}
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

            {/* SENTENCES AREA */}
            <div style={{ fontSize: '1.1rem', lineHeight: '2.0', color: '#334155' }}>
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
            </div>
        </div>
    );
};
