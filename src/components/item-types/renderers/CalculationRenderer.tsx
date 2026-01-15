import React, { useState, useEffect } from 'react';
import { GenericRendererProps } from './types';

// PART 12: CALCULATION RENDERER – PREMIUM MODERN DESIGN
// Features: Glassmorphism, Animated Feedback, Gradient Accents, Premium UX
export const CalculationRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // Safety check for answers type (must be string/number)
    const safeValue = (typeof answers === 'string' || typeof answers === 'number') ? answers : '';
    const [isFocused, setIsFocused] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSubmitted) return;
        setAnswers(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    // Determine correctness 
    const userVal = parseFloat(String(safeValue));
    const correctVal = parseFloat(config.correctValue || config.answer);
    // Extract units - filter out prompt-like values that aren't actual units
    const rawUnits = config.inputLabel || config.units || '';
    const isValidUnit = (val: string) => {
        if (!val || val.length > 15) return false; // Units are typically short
        const invalidPatterns = ['enter', 'answer', 'your', 'type', 'input', 'response', 'here'];
        const lower = val.toLowerCase();
        return !invalidPatterns.some(p => lower.includes(p));
    };
    const units = isValidUnit(rawUnits) ? rawUnits : '';

    // Calculate correctness logic
    let isCorrect = false;
    let correctDisplay = '';
    let toleranceText = '';

    if (isSubmitted) {
        if (!isNaN(userVal) && config.acceptableRange && Array.isArray(config.acceptableRange)) {
            isCorrect = userVal >= config.acceptableRange[0] && userVal <= config.acceptableRange[1];
            correctDisplay = `${config.acceptableRange[0]} – ${config.acceptableRange[1]}`;
            toleranceText = 'Acceptable range';
        } else if (config.acceptableRange && Array.isArray(config.acceptableRange)) {
            isCorrect = false;
            correctDisplay = `${config.acceptableRange[0]} – ${config.acceptableRange[1]}`;
            toleranceText = 'Acceptable range';
        } else {
            const isExact = userVal === correctVal;
            const isMathClose = !isNaN(userVal) && Math.abs(userVal - correctVal) <= (correctVal * 0.02);
            isCorrect = isExact || isMathClose;
            correctDisplay = String(correctVal);
            toleranceText = '±2% tolerance';
        }
    }

    // Animate success checkmark
    useEffect(() => {
        if (isSubmitted && isCorrect) {
            setTimeout(() => setShowSuccess(true), 100);
        }
    }, [isSubmitted, isCorrect]);

    return (
        <div className="flex flex-col gap-5 my-6 max-w-md mx-auto font-inter">

            {/* Main Card - Glassmorphism Design */}
            <div className={`
                relative overflow-hidden rounded-3xl p-1
                ${isSubmitted
                    ? (isCorrect
                        ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600'
                        : 'bg-gradient-to-br from-rose-400 via-red-500 to-pink-600')
                    : 'bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500'
                }
                shadow-2xl transition-all duration-500 ease-out
            `}>
                {/* Inner Glass Panel */}
                <div className={`
                    relative rounded-[22px] p-6 backdrop-blur-xl
                    ${isSubmitted
                        ? (isCorrect ? 'bg-white/95' : 'bg-white/95')
                        : 'bg-white/98'
                    }
                `}>
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-current to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-current to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Header Row */}
                    <div className="flex justify-between items-center mb-5 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center text-lg
                                ${isSubmitted
                                    ? (isCorrect
                                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg shadow-rose-500/30')
                                    : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
                                }
                                transition-all duration-300
                            `}>
                                {isSubmitted ? (isCorrect ? '✓' : '✗') : '📊'}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    {config.label || "Numeric Entry"}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {isSubmitted ? (isCorrect ? 'Well done!' : 'Review the solution') : 'Calculate and enter your answer'}
                                </p>
                            </div>
                        </div>

                        {/* Calculator Button */}
                        {!isSubmitted && (
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-tool', { detail: 'calc' }))}
                                className="
                                    group flex items-center gap-2 px-4 py-2 rounded-xl
                                    bg-gradient-to-r from-slate-100 to-slate-50
                                    hover:from-indigo-100 hover:to-purple-50
                                    border border-slate-200 hover:border-indigo-300
                                    text-slate-600 hover:text-indigo-600
                                    font-medium text-sm
                                    shadow-sm hover:shadow-md
                                    transition-all duration-200
                                "
                            >
                                <span className="text-base group-hover:scale-110 transition-transform">🧮</span>
                                <span>Calculator</span>
                            </button>
                        )}
                    </div>

                    {/* Input Container */}
                    <div className={`
                        relative rounded-2xl overflow-hidden
                        ${isFocused && !isSubmitted ? 'ring-4 ring-indigo-500/20' : ''}
                        transition-all duration-300
                    `}>
                        {/* Gradient Border Effect */}
                        <div className={`
                            absolute inset-0 rounded-2xl p-[2px]
                            ${isSubmitted
                                ? (isCorrect
                                    ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400'
                                    : 'bg-gradient-to-r from-rose-400 via-red-500 to-pink-400')
                                : (isFocused
                                    ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500'
                                    : 'bg-slate-200')
                            }
                            transition-all duration-300
                        `}>
                            <div className="w-full h-full rounded-[14px] bg-white" />
                        </div>

                        {/* Actual Input */}
                        <div className="relative flex items-center">
                            <input
                                type="number"
                                step="any"
                                value={safeValue}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                disabled={isSubmitted}
                                placeholder="0"
                                className={`
                                    w-full px-5 py-5 pr-20 rounded-2xl
                                    text-2xl font-bold text-center
                                    outline-none bg-transparent relative z-10
                                    placeholder:text-slate-300 placeholder:font-normal placeholder:text-lg
                                    ${isSubmitted
                                        ? (isCorrect ? 'text-emerald-700' : 'text-rose-700')
                                        : 'text-slate-800'
                                    }
                                    disabled:cursor-not-allowed
                                    transition-colors duration-300
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                `}
                            />

                            {/* Units Badge */}
                            {units && (
                                <div className={`
                                    absolute right-4 top-1/2 -translate-y-1/2 z-10
                                    px-3 py-1.5 rounded-lg
                                    text-sm font-bold
                                    ${isSubmitted
                                        ? (isCorrect
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-rose-100 text-rose-600')
                                        : 'bg-slate-100 text-slate-500'
                                    }
                                    transition-colors duration-300
                                `}>
                                    {units}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subtle label below input - only show when not submitted */}
                    {!isSubmitted && (
                        <div className="text-center mt-2 opacity-40 text-xs text-slate-500 italic">
                            Enter your answer above
                        </div>
                    )}

                    {/* Feedback Panel */}
                    {isSubmitted && (
                        <div className={`
                            mt-5 p-4 rounded-2xl
                            ${isCorrect
                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
                                : 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200'
                            }
                            animate-in slide-in-from-bottom-2 duration-300
                        `}>
                            <div className="flex items-start gap-4">
                                {/* Icon with Animation */}
                                <div className={`
                                    flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                                    ${isCorrect
                                        ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                                        : 'bg-gradient-to-br from-rose-400 to-red-500'
                                    }
                                    shadow-lg
                                    ${isCorrect ? 'shadow-emerald-500/30' : 'shadow-rose-500/30'}
                                    ${showSuccess ? 'scale-100' : 'scale-0'}
                                    transition-transform duration-500 ease-out
                                `}>
                                    <span className="text-white text-xl font-bold">
                                        {isCorrect ? '✓' : '✗'}
                                    </span>
                                </div>

                                {/* Feedback Text */}
                                <div className="flex-1">
                                    <div className={`
                                        text-lg font-bold mb-1
                                        ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}
                                    `}>
                                        {isCorrect ? 'Excellent!' : 'Incorrect'}
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-sm ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            Correct answer:
                                        </span>
                                        <span className={`
                                            inline-flex items-center gap-1 px-3 py-1 rounded-full
                                            text-sm font-bold
                                            ${isCorrect
                                                ? 'bg-emerald-200 text-emerald-800'
                                                : 'bg-rose-200 text-rose-800'
                                            }
                                        `}>
                                            {correctDisplay} {units}
                                        </span>
                                    </div>

                                    {toleranceText && (
                                        <div className={`
                                            mt-2 text-xs
                                            ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}
                                        `}>
                                            {toleranceText}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Comparison Bar */}
                            {!isCorrect && !isNaN(userVal) && (
                                <div className="mt-4 pt-4 border-t border-rose-200">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-rose-600 font-medium">Your answer: {safeValue} {units}</span>
                                        <span className="text-rose-600 font-medium">Off by: {Math.abs(userVal - parseFloat(correctDisplay.split('–')[0] || correctDisplay)).toFixed(1)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Help Text - Only before submission */}
            {!isSubmitted && (
                <div className="flex flex-col gap-3">
                    {/* Tip 1: Numeric only */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-white text-sm">💡</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-amber-800 font-medium">
                                Enter numeric value only
                            </p>
                            {units && (
                                <p className="text-xs text-amber-600">
                                    Units ({units}) will be added automatically
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tip 2: Rounding example */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <span className="text-white text-sm">🔢</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-sky-800 font-medium">
                                Round to the nearest whole number
                            </p>
                            <p className="text-xs text-sky-600">
                                Example: 124.6 → <span className="font-bold">125</span> &nbsp;|&nbsp; 124.4 → <span className="font-bold">124</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
