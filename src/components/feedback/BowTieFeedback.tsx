import React from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Target,
    Activity,
    Thermometer,
    ArrowRight,
    Minus
} from 'lucide-react';
import { BowTieReview } from '../../services/RationalePipeline';

export const BowTieFeedback: React.FC<{ review: BowTieReview }> = ({ review }) => {
    // Condition Status
    const condStatus = review.condition.isCorrect ? 'correct' : 'incorrect';
    const condColor = condStatus === 'correct' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500">Clinical Judgment</h3>
                    <div className="text-xs text-slate-400 font-medium">Bow-Tie Analysis</div>
                </div>
            </div>

            {/* Main Diagram Feedback */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* 1. Condition (Centerpiece) */}
                <div className="border-b border-slate-100 p-6 bg-gradient-to-br from-indigo-50 to-white">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Target Condition</div>

                        <div className={`relative px-8 py-4 rounded-xl border-2 ${condColor} shadow-sm backdrop-blur-sm min-w-[200px]`}>
                            {review.condition.isCorrect ? (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="font-black text-lg">{review.condition.correctChoice.text || 'Correct Condition'}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <XCircle className="w-6 h-6" />
                                    <span className="line-through opacity-75">{review.condition.userChoice?.text || 'No Selection'}</span>
                                    <div className="flex items-center gap-2 mt-2 text-emerald-600 font-bold bg-white/50 px-3 py-1 rounded-lg">
                                        <ArrowRight className="w-4 h-4" />
                                        <span>{review.condition.correctChoice.text}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-sm text-slate-600 max-w-lg bg-white/50 p-3 rounded-lg border border-indigo-100">
                            <span className="font-bold text-indigo-600">Rationale: </span>
                            {review.condition.rationale || 'This is the priority condition based on clinical cues.'}
                        </div>
                    </div>
                </div>

                {/* 2. Actions & Parameters Grid */}
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* Actions Column */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-blue-500">
                            <Activity className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Actions Taken</h4>
                        </div>
                        <div className="space-y-3">
                            {review.actions.map((action) => {
                                // Logic: Show if User Selected OR Correct (to show what was missed)
                                // We can show ALL, but style them appropriately
                                const isSelected = action.userSelected;
                                const isCorrect = action.isCorrect;

                                let statusColor = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'; // Irrelevant
                                let icon = <Minus className="w-4 h-4" />;

                                if (isSelected && isCorrect) {
                                    statusColor = 'border-emerald-200 bg-emerald-50 text-emerald-900';
                                    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                                } else if (isSelected && !isCorrect) {
                                    statusColor = 'border-rose-200 bg-rose-50 text-rose-900';
                                    icon = <XCircle className="w-4 h-4 text-rose-600" />;
                                } else if (!isSelected && isCorrect) {
                                    statusColor = 'border-amber-200 bg-amber-50 text-amber-900 border-dashed';
                                    icon = <AlertCircle className="w-4 h-4 text-amber-500" />;
                                } else {
                                    // Not selected, Not correct = Correctly avoided? 
                                    // Usually just hide standard distractors unless we want full transparency
                                    // Let's hide unrelated distractors to reduce noise, unless there are few options
                                    return null;
                                }

                                return (
                                    <div key={action.id} className={`p-3 rounded-lg border text-sm flex gap-3 ${statusColor}`}>
                                        <div className="mt-0.5 shrink-0">{icon}</div>
                                        <div>
                                            <div className="font-medium leading-snug">{action.text}</div>
                                            {(isSelected || isCorrect) && action.rationale && (
                                                <div className="mt-1 text-xs opacity-80 leading-relaxed border-t border-black/5 pt-1">
                                                    {action.rationale}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Parameters Column */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-emerald-500">
                            <Thermometer className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Parameters Monitored</h4>
                        </div>
                        <div className="space-y-3">
                            {review.parameters.map((param) => {
                                const isSelected = param.userSelected;
                                const isCorrect = param.isCorrect;

                                let statusColor = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                                let icon = <Minus className="w-4 h-4" />;

                                if (isSelected && isCorrect) {
                                    statusColor = 'border-emerald-200 bg-emerald-50 text-emerald-900';
                                    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                                } else if (isSelected && !isCorrect) {
                                    statusColor = 'border-rose-200 bg-rose-50 text-rose-900';
                                    icon = <XCircle className="w-4 h-4 text-rose-600" />;
                                } else if (!isSelected && isCorrect) {
                                    statusColor = 'border-amber-200 bg-amber-50 text-amber-900 border-dashed';
                                    icon = <AlertCircle className="w-4 h-4 text-amber-500" />;
                                } else {
                                    return null;
                                }

                                return (
                                    <div key={param.id} className={`p-3 rounded-lg border text-sm flex gap-3 ${statusColor}`}>
                                        <div className="mt-0.5 shrink-0">{icon}</div>
                                        <div>
                                            <div className="font-medium leading-snug">{param.text}</div>
                                            {(isSelected || isCorrect) && param.rationale && (
                                                <div className="mt-1 text-xs opacity-80 leading-relaxed border-t border-black/5 pt-1">
                                                    {param.rationale}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
