import React from 'react';
import { GenericRendererProps } from './types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// PART 7: MULTIPLE RESPONSE (SATA) – VISUAL REDESIGN
export const SATARenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

    // answers is { [optionId]: boolean }

    const toggle = (id: string) => {
        if (isSubmitted) return;
        setAnswers({ ...answers, [id]: !answers?.[id] });
    };

    // Calculate how many selected
    const selectedCount = Object.values(answers || {}).filter(Boolean).length;
    const requiredCount = config.selectCount;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '4px',
                fontStyle: 'italic'
            }}>
                {requiredCount ? `Select ${requiredCount} options:` : "Select all that apply."}
                {requiredCount && (
                    <span style={{
                        marginLeft: '8px',
                        color: selectedCount === requiredCount ? '#16a34a' : '#ef4444',
                        fontWeight: 700
                    }}>
                        ({selectedCount}/{requiredCount})
                    </span>
                )}
            </div>

            {config.options?.map((opt: any) => {
                const isSelected = !!answers?.[opt.id];
                const isCorrect = opt.isCorrect;

                // Base Styles
                let containerStyle: React.CSSProperties = {
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    cursor: isSubmitted ? 'default' : 'pointer',
                    transition: 'all 0.1s ease-in-out',
                    position: 'relative'
                };

                // Checkbox Visual
                let checkboxBorder = '#cbd5e1';
                let checkboxBg = 'white';
                let checkMarkColor = 'white';

                if (!isSubmitted) {
                    // Interactive Mode
                    if (isSelected) {
                        containerStyle.background = '#eff6ff'; // Light Blue
                        containerStyle.border = '1px solid #3b82f6';
                        containerStyle.boxShadow = '0 0 0 1px #3b82f6';
                        checkboxBg = '#3b82f6';
                        checkboxBorder = '#3b82f6';
                    }
                } else {
                    // Submitted Mode (Feedback)
                    if (isCorrect) {
                        if (isSelected) {
                            // Correct + Selected = Green
                            containerStyle.background = '#f0fdf4';
                            containerStyle.border = '1px solid #16a34a';
                            checkboxBg = '#16a34a';
                            checkboxBorder = '#16a34a';
                        } else {
                            // Correct + Not Selected = Missed (Yellow/Orange)
                            containerStyle.background = '#fffbeb'; // Amber-50
                            containerStyle.border = '1px solid #f59e0b'; // Amber-500
                            containerStyle.borderStyle = 'dashed'; // Dashed to indicate "Missing"
                            checkboxBg = 'transparent';
                            checkboxBorder = '#f59e0b';
                        }
                    } else if (isSelected) {
                        // Incorrect Selection = Red
                        containerStyle.background = '#fef2f2';
                        containerStyle.border = '1px solid #ef4444';
                        checkboxBg = '#ef4444';
                        checkboxBorder = '#ef4444';
                        checkMarkColor = 'white';
                    }
                }

                return (
                    <div
                        key={opt.id}
                        onClick={() => toggle(opt.id)}
                        style={containerStyle}
                        className={!isSubmitted ? "hover:bg-slate-50" : ""}
                    >
                        {/* Custom Checkbox */}
                        <div style={{
                            width: '24px',
                            height: '24px',
                            minWidth: '24px',
                            borderRadius: '4px',
                            border: `2px solid ${checkboxBorder}`,
                            background: checkboxBg,
                            marginRight: '16px',
                            marginTop: '2px', // Align with text top line
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}>
                            {(isSelected || (isSubmitted && isCorrect)) && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isSelected ? checkMarkColor : (isSubmitted ? '#16a34a' : 'white')} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>

                        {/* Text */}
                        <div style={{
                            fontSize: isMobile ? '1rem' : '1.05rem',
                            lineHeight: '1.6',
                            color: '#1e293b',
                            fontWeight: 500
                        }}>
                            {opt.text}
                        </div>

                        {/* Feedback Icon / Badge (Submitted) */}
                        {isSubmitted && (
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                                {isCorrect && (
                                    <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✔</span>
                                )}
                                {isSelected && !isCorrect && (
                                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>✘</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

