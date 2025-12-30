import React from 'react';
import { GenericRendererProps } from './types';
import { Calculator } from 'lucide-react';

// PART 12: CALCULATION RENDERER – GOLD STANDARD UPGRADE
// Features: Embedded Unit Labels, Large Typography, Calculator Hint
export const CalculationRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSubmitted) return;
        setAnswers(e.target.value);
    };

    // Determine correctness using Expert Clinical Logic
    const userVal = parseFloat(answers);
    const correctVal = parseFloat(config.correctValue || config.answer);

    // Determine correctness using Expert Clinical Logic (Fracture Logic)
    let isCorrect = false;
    if (isSubmitted && !isNaN(userVal)) {
        if (config.acceptableRange && Array.isArray(config.acceptableRange)) {
            isCorrect = userVal >= config.acceptableRange[0] && userVal <= config.acceptableRange[1];
        } else {
            // EXPERT LOGIC: Determine clinical decimal limits based on units
            const units = (config.inputLabel || config.units || '').toLowerCase();

            let allowedDecimals = 1; // Default: Tenths
            if (units.includes('gtt')) allowedDecimals = 0; // Drops: Whole numbers
            if (units.includes('mg') || units.includes('mcg') || units.includes('unit')) allowedDecimals = 2; // Precision doses

            const isExact = userVal === correctVal;
            const isMathClose = Math.abs(userVal - correctVal) <= 0.05;

            // Expert Clinical Check: Do they both round to the same clinical goal?
            // (Uses Math.round to handle the .5 threshold typical in nursing school)
            const roundsToMatch = Math.round(userVal) === Math.round(correctVal);

            // Fractional (Fracture) match using toFixed for tenths/hundredths standard
            const fractionalMatch = userVal.toFixed(allowedDecimals) === correctVal.toFixed(allowedDecimals);

            isCorrect = isExact || isMathClose || roundsToMatch || fractionalMatch;
        }
    }

    const units = config.inputLabel || config.units || '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '1rem 0', maxWidth: '400px' }}>
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                        {config.label || "Numeric Entry"}
                    </label>
                    {!isSubmitted && (
                        <div
                            onClick={() => window.dispatchEvent(new CustomEvent('open-tool', { detail: 'calc' }))}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
                                color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '4px',
                                cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s',
                                border: '1px solid transparent'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = 'transparent'; }}
                        >
                            <Calculator size={14} /> Open Calculator
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="number"
                        step="any"
                        value={answers || ''}
                        onChange={handleChange}
                        disabled={isSubmitted}
                        placeholder="0"
                        style={{
                            width: '100%',
                            padding: '16px',
                            paddingRight: units ? `${units.length * 10 + 20}px` : '16px', // Dynamic padding for units
                            borderRadius: '12px',
                            border: isSubmitted
                                ? (isCorrect ? '2px solid #10b981' : '2px solid #f43f5e')
                                : '2px solid #cbd5e1',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            outline: 'none',
                            background: isSubmitted ? '#f8fafc' : 'white',
                            color: '#1e293b',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            textAlign: 'right'
                        }}
                        onFocus={(e) => !isSubmitted && (e.target.style.borderColor = '#3b82f6', e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)')}
                        onBlur={(e) => !isSubmitted && (e.target.style.borderColor = '#cbd5e1', e.target.style.boxShadow = 'none')}
                    />

                    {units && (
                        <div style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontWeight: 600,
                            color: '#94a3b8',
                            fontSize: '1rem',
                            pointerEvents: 'none', // Allow clicking through to input
                            userSelect: 'none'
                        }}>
                            {units}
                        </div>
                    )}
                </div>

                {isSubmitted && (
                    <div style={{
                        marginTop: '8px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: isCorrect ? '#ecfdf5' : '#fff1f2',
                        border: isCorrect ? '1px solid #d1fae5' : '1px solid #fecdd3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {isCorrect ? (
                            <div style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1.2em' }}>✓</span> Answer is Correct
                            </div>
                        ) : (
                            <div style={{ width: '100%' }}>
                                <div style={{ color: '#e11d48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: '4px' }}>
                                    <span style={{ fontSize: '1.2em' }}>✗</span> Incorrect
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#be123c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Correct Value:</span>
                                    <span style={{ fontWeight: 800 }}>{correctVal} {units}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!isSubmitted && (
                <div style={{ padding: '0 8px', fontSize: '0.85rem', color: '#64748b' }}>
                    💡 Enter the numeric value only. {units ? ` The unit (${units}) is already included.` : ''}
                </div>
            )}
        </div>
    );
};
