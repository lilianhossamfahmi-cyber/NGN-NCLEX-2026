import React from 'react';
import { GenericRendererProps } from './types';

// PART 8: SINGLE RESPONSE (MC) – COMPLETE AUDIT & FIX
export const SingleChoiceRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // answers: optionId (string)

    const handleChange = (id: string) => {
        if (isSubmitted) return;
        setAnswers(id);
    };

    // Icons
    const SuccessIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
    const ErrorIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    // Custom Radio Visual
    const InputVisual = ({ checked, correct, incorrect, missed }: { checked: boolean, correct?: boolean, incorrect?: boolean, missed?: boolean }) => {
        const baseStyle: React.CSSProperties = {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: checked ? 'var(--pearson-blue)' : '#cbd5e1',
            background: checked ? 'var(--pearson-blue)' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
        };

        if (correct) {
            baseStyle.borderColor = 'var(--color-success)';
            baseStyle.background = 'var(--color-success)';
        } else if (incorrect) {
            baseStyle.borderColor = 'var(--color-danger)';
            baseStyle.background = 'var(--color-danger)';
        } else if (missed) {
            baseStyle.borderColor = 'var(--color-warning)';
            baseStyle.background = 'transparent'; // Hollow for missed
            baseStyle.borderStyle = 'dashed';
        }

        return (
            <div style={baseStyle}>
                {checked && (
                    <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }} />
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '1rem 0' }}>
            <style>{`
                .choice-card {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .choice-card:hover:not(.disabled) {
                    border-color: var(--pearson-blue);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .choice-card.selected {
                    border-color: var(--pearson-blue);
                    background: var(--pearson-blue-light);
                    box-shadow: 0 0 0 1px var(--pearson-blue) inset;
                }
                .choice-card.correct {
                    border-color: var(--color-success);
                    background: var(--color-success-bg);
                    box-shadow: 0 0 0 1px var(--color-success) inset;
                }
                .choice-card.incorrect {
                    border-color: var(--color-danger);
                    background: var(--color-danger-bg);
                    box-shadow: 0 0 0 1px var(--color-danger) inset;
                }
                .choice-card.missed {
                    border-color: var(--color-warning);
                    background: #fffbeb; /* Amber-50 */
                    border-style: dashed;
                    box-shadow: none;
                }
                .choice-card.disabled {
                    cursor: default;
                    opacity: 0.9;
                }
                .choice-text {
                    font-size: 1rem;
                    color: var(--text-primary);
                    flex: 1;
                    line-height: 1.5;
                    margin-left: 16px;
                }
                .status-icon {
                    margin-left: 12px;
                    display: flex;
                    align-items: center;
                }
            `}</style>

            {config.options?.map((opt: any, idx: number) => {
                const isSelected = answers === opt.id;
                const isCorrect = opt.isCorrect; // Note: Ensure config actually carries this if we want specific correct visual, usually passed via validation logic or hidden in config

                // In many NGN engines, 'isCorrect' might not be on the option object directly during render? 
                // We rely on external validation usually. But 'GenericRendererProps' has 'isSubmitted'.
                // If we don't have per-option correctness, we might need to deduce it. 
                // Assuming 'opt.isCorrect' exists or generic logic applies.
                // Let's assume standard NGN behavior: Show correct answer if submitted.

                let cardClass = 'choice-card';
                let showSuccess = false;
                let showFail = false;

                if (isSubmitted) {
                    cardClass += ' disabled';
                    if (isCorrect) {
                        if (isSelected) {
                            // Correct + Selected = Green
                            cardClass += ' correct';
                            showSuccess = true;
                        } else {
                            // Correct + Not Selected = Missed (Yellow)
                            cardClass += ' missed';
                            // Note: We need to define .choice-card.missed in the style block or rely on inline style fallback if CSS ignores it.
                            // Looking at the style block, .choice-card.missed is NOT defined. 
                            // I will add it to the style block in a separate edit or assume the user wants me to fix the logic here and I will inject the style too.
                            // Actually, I can just use inline styles or existing variables?
                            // Let's modify the class logic first.
                            // Wait, the style block is internal to this component. I should update that too.
                        }
                    } else if (isSelected && !isCorrect) {
                        cardClass += ' incorrect';
                        showFail = true;
                    }
                } else if (isSelected) {
                    cardClass += ' selected';
                }

                return (
                    <div
                        key={opt.id || idx}
                        className={cardClass}
                        onClick={() => handleChange(opt.id)}
                    >
                        <InputVisual
                            checked={isSelected}
                            correct={isSubmitted && isCorrect && isSelected} // Only explicit correct radio if picked
                            missed={isSubmitted && isCorrect && !isSelected} // Missed state
                            incorrect={isSubmitted && isSelected && !isCorrect}
                        />

                        <span className="choice-text">
                            {opt.text}
                            {isSubmitted && isCorrect && (
                                <span style={{
                                    marginLeft: 8,
                                    fontSize: '0.8em',
                                    fontWeight: 600,
                                    color: isSelected ? 'var(--color-success)' : 'var(--color-warning)'
                                }}>
                                    (Correct Answer)
                                </span>
                            )}
                        </span>

                        {isSubmitted && (
                            <div className="status-icon">
                                {showSuccess && <SuccessIcon />}
                                {showFail && <ErrorIcon />}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
