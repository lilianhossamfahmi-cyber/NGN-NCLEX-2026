import React from 'react';
import { OrderedReview } from '../../types/RationaleTypes';
import { Check, X, ArrowDown, ListOrdered } from 'lucide-react';

export const OrderedFeedback = ({ review }: { review: OrderedReview }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <div className="p-2 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                    <ListOrdered className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Correct Sequence Analysis</h3>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/50">
                {review.items.map((item, index) => (
                    <div key={item.id} className="p-4 group hover:bg-slate-700/20 transition-colors">
                        <div className="flex gap-4">
                            {/* Rank Column */}
                            <div className="flex flex-col items-center gap-2 shrink-0 w-16 pt-1">
                                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Rank</div>
                                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-black text-xl text-slate-300">
                                    {item.correctRank}
                                </div>
                                {index < review.items.length - 1 && (
                                    <ArrowDown className="w-4 h-4 text-slate-600 mt-2" />
                                )}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-semibold text-slate-100 text-lg leading-snug">
                                        {item.text}
                                    </h4>

                                    {/* User Status Badge */}
                                    <div className="shrink-0 flex items-center gap-2">
                                        {item.isCorrectPosition ? (
                                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-400">Correct Position</span>
                                            </div>
                                        ) : item.userRank ? (
                                            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                                                <X className="w-4 h-4 text-rose-400" />
                                                <span className="text-xs font-bold text-rose-400">You placed: #{item.userRank}</span>
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                                <span className="text-xs font-bold text-amber-400">Not selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sequencing Rationale */}
                                <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                                        Sequencing Logic
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {item.rationale}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
