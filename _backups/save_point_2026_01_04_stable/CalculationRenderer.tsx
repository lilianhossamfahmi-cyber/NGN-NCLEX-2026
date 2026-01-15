import React from 'react';
import { GenericRendererProps } from './types';

// PART 12: CALCULATION RENDERER – GOLD STANDARD UPGRADE
// Features: Embedded Unit Labels, Validation, Acceptable Range Feedback
export const CalculationRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // Safety check for answers type (must be string/number)
    const safeValue = (typeof answers === 'string' || typeof answers === 'number') ? answers : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSubmitted) return;
        setAnswers(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Block 'e', 'E', '+', '-' (unless specific neg requirement, but usually vital calculations are positive)
        // Allow Backspace, Delete, Tab, Arrow keys, decimal point
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    // Determine correctness 
    const userVal = parseFloat(String(safeValue));
    const correctVal = parseFloat(config.correctValue || config.answer);

    // Logic extraction for display
    let isCorrect = false;
    let feedbackContent = <></>;
    const units = config.inputLabel || config.units || '';

    // If submitted, calculate logic strictly to match scoring engine visual
    if (isSubmitted && !isNaN(userVal)) {
        if (config.acceptableRange && Array.isArray(config.acceptableRange)) {
            isCorrect = userVal >= config.acceptableRange[0] && userVal <= config.acceptableRange[1];
            feedbackContent = (
                <div className="flex flex-col gap-1">
                    <div>Correct Range: <span className="font-bold">{config.acceptableRange[0]} - {config.acceptableRange[1]} {units}</span></div>
                </div>
            );
        } else {
            // Fallback Logic (same as before or simplified)
            const isExact = userVal === correctVal;
            const isMathClose = Math.abs(userVal - correctVal) <= (correctVal * 0.02); // 2% tolerance
            isCorrect = isExact || isMathClose;
            feedbackContent = (
                <div className="flex flex-col gap-1">
                    <div>Correct Value: <span className="font-bold">{correctVal} {units}</span></div>
                    <div className="text-xs opacity-75">(±2% tolerance allowed)</div>
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col gap-4 my-6 max-w-sm font-inter">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {config.label || "Numeric Entry"}
                    </label>
                    {!isSubmitted && (
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-tool', { detail: 'calc' }))}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                        >
                            <span>🧮</span> Calculator
                        </button>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative flex items-center">
                    <input
                        type="number"
                        step="any"
                        value={safeValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitted}
                        placeholder="0"
                        className={`
                            w-full p-4 pr-16 rounded-xl text-2xl font-bold text-right outline-none transition-all
                            ${isSubmitted
                                ? (isCorrect ? 'bg-green-50 border-2 border-green-500 text-green-900' : 'bg-red-50 border-2 border-red-500 text-red-900')
                                : 'bg-white border-2 border-slate-300 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            }
                        `}
                    />

                    {units && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400 pointer-events-none select-none">
                            {units}
                        </div>
                    )}
                </div>

                {/* Feedback */}
                {isSubmitted && (
                    <div className={`
                        mt-2 p-3 rounded-lg border flex items-start gap-3 text-sm
                        ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
                    `}>
                        <div className="text-lg font-bold">
                            {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold mb-1">{isCorrect ? 'Correct' : 'Incorrect'}</div>
                            {feedbackContent}
                        </div>
                    </div>
                )}
            </div>

            {!isSubmitted && (
                <div className="px-2 text-sm text-slate-500 flex items-center gap-2">
                    <span>💡</span>
                    Enter numeric value only. {units && `(${units} already included)`}
                </div>
            )}
        </div>
    );
};
