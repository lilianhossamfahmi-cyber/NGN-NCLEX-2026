import React from 'react';
import { GenericRendererProps } from './types';

// PART 12: CALCULATION RENDERER (Numeric Entry)
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '1rem 0' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                        {config.label || "Answer"}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="number"
                            step="any"
                            value={answers || ''}
                            onChange={handleChange}
                            disabled={isSubmitted}
                            placeholder="0"
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: isSubmitted
                                    ? (isCorrect ? '2px solid #10b981' : '2px solid #f43f5e')
                                    : '2px solid #cbd5e1',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                width: '120px',
                                outline: 'none',
                                background: isSubmitted ? '#f8fafc' : 'white',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => !isSubmitted && (e.target.style.borderColor = '#2563eb')}
                            onBlur={(e) => !isSubmitted && (e.target.style.borderColor = '#cbd5e1')}
                        />
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
                            {config.inputLabel || config.units || ''}
                        </span>
                    </div>
                </div>

                {isSubmitted && (
                    <div style={{
                        marginLeft: 'auto',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: isCorrect ? '#ecfdf5' : '#fff1f2',
                        border: isCorrect ? '1px solid #d1fae5' : '1px solid #fecdd3',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        {isCorrect ? (
                            <div style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: '1.2em' }}>✓</span> Correct
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: '#e11d48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: '1.2em' }}>✗</span> Incorrect
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#be123c', marginTop: 2 }}>
                                    Correct Answer: <strong>{correctVal} {config.inputLabel || config.units}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
