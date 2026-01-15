/**
 * 📝 ClozeFeedback.tsx
 * 
 * Displays feedback for Drop/Cloze (Fill-in-the-blank with Dropdowns) items
 * using the "Annotated Sentence View" design.
 * 
 * Shows the original sentence with blanks replaced by interactive chips
 * showing the student's answer and correct answer with color coding.
 */

import React, { useState } from 'react';
import { ClozeReview } from '../../types/RationaleTypes';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ClozeFeedbackProps {
    review: ClozeReview;
}

export default function ClozeFeedback({ review }: ClozeFeedbackProps) {
    const [expandedBlank, setExpandedBlank] = useState<string | null>(null);

    if (!review || !review.blanks || review.blanks.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                No cloze review data available.
            </div>
        );
    }

    const toggleBlank = (id: string) => {
        setExpandedBlank(expandedBlank === id ? null : id);
    };

    return (
        <div className="space-y-6">
            {/* SCORE SUMMARY */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${review.score.percentage >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                            review.score.percentage >= 50 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {review.score.percentage >= 80 ? <CheckCircle2 className="w-6 h-6" /> :
                                review.score.percentage >= 50 ? <AlertCircle className="w-6 h-6" /> :
                                    <XCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Blanks Completed
                            </div>
                            <div className="text-2xl font-black text-white">
                                {review.score.earned}/{review.score.total} Correct
                            </div>
                        </div>
                    </div>
                    <div className={`text-4xl font-black ${review.score.percentage >= 80 ? 'text-emerald-400' :
                        review.score.percentage >= 50 ? 'text-amber-400' :
                            'text-red-400'
                        }`}>
                        {review.score.percentage}%
                    </div>
                </div>
            </div>

            {/* ANNOTATED SENTENCE VIEW */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                            Completed Sentence Review
                        </span>
                    </div>
                </div>

                {/* Sentence with Inline Blanks */}
                <div className="p-8 font-serif text-lg leading-loose text-slate-700">
                    {/* Reconstruct sentence with blanks */}
                    {review.blanks.map((blank, index) => (
                        <React.Fragment key={blank.id}>
                            {/* Text before this blank */}
                            {blank.beforeText && (
                                <span>{blank.beforeText} </span>
                            )}

                            {/* The Blank Chip */}
                            <span
                                onClick={() => toggleBlank(blank.id)}
                                className={`inline-flex flex-col items-center cursor-pointer mx-1 rounded-lg px-3 py-1 border-2 transition-all duration-200 shadow-sm hover:shadow-md ${blank.isCorrect
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                                    : 'bg-red-100 border-red-500 text-red-800'
                                    }`}
                            >
                                {/* User's Answer */}
                                <span className="font-bold flex items-center gap-1">
                                    {blank.isCorrect ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    {blank.userAnswer}
                                </span>

                                {/* If incorrect, show correct answer below */}
                                {!blank.isCorrect && (
                                    <span className="text-xs text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {blank.correctAnswer}
                                    </span>
                                )}
                            </span>

                            {/* Text after this blank (only for last item) */}
                            {index === review.blanks.length - 1 && blank.afterText && (
                                <span> {blank.afterText}</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* LEGEND */}
            <div className="flex flex-wrap gap-4 px-2 py-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span className="w-4 h-4 bg-emerald-100 border-2 border-emerald-500 rounded"></span> Correct Answer
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                    <span className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></span> Your Answer (Incorrect)
                </div>
            </div>

            {/* DETAILED BLANK CARDS */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                    Detailed Blank Analysis
                </h3>

                {review.blanks.map((blank) => (
                    <div
                        key={blank.id}
                        className={`rounded-xl border overflow-hidden transition-all duration-200 ${blank.isCorrect
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-red-50 border-red-200'
                            }`}
                    >
                        {/* Card Header - Always visible */}
                        <div
                            onClick={() => toggleBlank(blank.id)}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-opacity-50 ${blank.isCorrect ? 'bg-emerald-100/50' : 'bg-red-100/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${blank.isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-600'
                                    : 'bg-red-500/20 text-red-600'
                                    }`}>
                                    {blank.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${blank.isCorrect ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        Blank {blank.position}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-700">
                                        {blank.isCorrect ? 'Correct!' : `You selected: ${blank.userAnswer}`}
                                    </div>
                                    {!blank.isCorrect && (
                                        <div className="text-xs text-emerald-600 font-medium">
                                            Correct answer: {blank.correctAnswer}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {expandedBlank === blank.id ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                        </div>

                        {/* Expanded Content */}
                        {expandedBlank === blank.id && (
                            <div className="px-4 py-4 border-t border-slate-200 bg-white space-y-3">
                                {/* Why Correct */}
                                {blank.whyCorrect && blank.whyCorrect !== 'N/A' && (
                                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                Why "{blank.correctAnswer}" is Correct
                                            </span>
                                        </div>
                                        <p className="text-sm text-emerald-800">{blank.whyCorrect}</p>
                                    </div>
                                )}

                                {/* Why Incorrect */}
                                {!blank.isCorrect && blank.whyIncorrect && blank.whyIncorrect !== 'N/A' && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                                                Why "{blank.userAnswer}" is Incorrect
                                            </span>
                                        </div>
                                        <p className="text-sm text-red-800">{blank.whyIncorrect}</p>
                                    </div>
                                )}

                                {/* All Options */}
                                <div className="mt-3">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        All Available Options
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {blank.allOptions.map((opt) => (
                                            <span
                                                key={opt.id}
                                                className={`px-2 py-1 rounded text-xs font-medium ${opt.isCorrect
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                                    : opt.id === blank.userAnswerId
                                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                {opt.text}
                                                {opt.isCorrect && ' ✓'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
