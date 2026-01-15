import React, { useState } from 'react';
import { HighlightReview } from '../../types/RationaleTypes';
import { CheckCircle2, XCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface HighlightFeedbackProps {
    review: HighlightReview;
}

type Segment =
    | { type: 'text'; content: string; id?: never; text?: never }
    | { type: 'span'; id: string; text: string; content?: never };

export const HighlightFeedback: React.FC<HighlightFeedbackProps> = ({ review }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Parse the HTML string into segments
    // We assume the HTML is simple: text + <span id="...">text</span> + text
    const parseContent = (): Segment[] => {
        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        const parts: Segment[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(review.originalText)) !== null) {
            // Text before match
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: review.originalText.substring(lastIndex, match.index)
                });
            }

            // The Match (Span)
            const id = match[1];
            const text = match[2];
            parts.push({
                type: 'span',
                id: id,
                text: text
            });

            lastIndex = regex.lastIndex;
        }

        // Remaining text
        if (lastIndex < review.originalText.length) {
            parts.push({
                type: 'text',
                content: review.originalText.substring(lastIndex)
            });
        }

        return parts;
    };

    const segments = parseContent();
    const activeSpan = selectedId ? review.spans[selectedId] : null;

    return (
        <div className="space-y-6">
            {/* CHART VIEW CONTAINER - Light Paper Theme */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 overflow-hidden shadow-xl relative">
                {/* Subtle paper texture effect */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

                {/* Header (Medical Record Style - Light) */}
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500/20 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Electronic Health Record • Clinical Notes</span>
                    </div>
                </div>

                {/* Content Area - Light readable text */}
                <div className="p-8 font-serif text-lg leading-loose text-slate-700 relative z-10">
                    {segments.map((part, idx) => {
                        if (part.type === 'text') {
                            return <span key={idx} dangerouslySetInnerHTML={{ __html: part.content }} />;
                        } else {
                            const spanData = review.spans[part.id];
                            if (!spanData) return <span key={idx}>{part.text}</span>;

                            const isSelected = selectedId === part.id;
                            let styleClass = "border-b-2 border-slate-300 hover:bg-slate-100"; // Neutral

                            if (spanData.status === 'correct') {
                                // Green highlight for correct - vibrant on light bg
                                styleClass = "bg-emerald-100 border-b-2 border-emerald-500 text-emerald-800 font-semibold";
                            } else if (spanData.status === 'incorrect') {
                                // Red highlight for incorrect
                                styleClass = "bg-red-100 border-b-2 border-red-500 text-red-800 font-semibold";
                            } else if (spanData.status === 'missed') {
                                // Amber dashed for missed opportunities
                                styleClass = "border-2 border-dashed border-amber-500 text-amber-800 bg-amber-50 rounded px-1 font-medium";
                            } else if (spanData.status === 'neutral') {
                                // Subtle gray for neutral distractors
                                styleClass = "border-b border-slate-300 text-slate-500 hover:bg-slate-100";
                            }

                            if (isSelected) {
                                styleClass += " ring-2 ring-offset-2 ring-offset-white ring-blue-500 z-10 relative rounded box-decoration-clone shadow-md";
                            }

                            return (
                                <span
                                    key={idx}
                                    onClick={() => setSelectedId(part.id)}
                                    className={`cursor-pointer transition-all duration-200 mx-0.5 px-0.5 ${styleClass}`}
                                >
                                    {part.text}
                                </span>
                            );
                        }
                    })}
                </div>
            </div>

            {/* LEGEND (Explicit explanation of colors) */}
            <div className="flex flex-wrap gap-4 px-2 py-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span className="w-4 h-4 bg-emerald-100 border-b-2 border-emerald-500 rounded"></span> Correctly Highlighted
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                    <span className="w-4 h-4 bg-red-100 border-b-2 border-red-500 rounded"></span> Incorrectly Highlighted
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                    <span className="w-4 h-4 border-2 border-dashed border-amber-500 bg-amber-50 rounded"></span> Missed Opportunity
                </div>
            </div>

            {/* INSIGHT CARD (Modern Design with Why Correct / Why Incorrect) */}
            {activeSpan ? (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                    <div className={`rounded-2xl border shadow-2xl relative overflow-hidden
                        ${activeSpan.status === 'correct' || activeSpan.status === 'missed' ? 'bg-gradient-to-br from-emerald-950/60 to-slate-950 border-emerald-500/30' :
                            activeSpan.status === 'incorrect' ? 'bg-gradient-to-br from-red-950/60 to-slate-950 border-red-500/30' :
                                'bg-slate-900 border-slate-800'}
                     `}>
                        {/* Glow Effect */}
                        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none ${activeSpan.status === 'correct' || activeSpan.status === 'missed' ? 'bg-emerald-500/10' :
                            activeSpan.status === 'incorrect' ? 'bg-red-500/10' : 'bg-blue-500/5'
                            }`} />

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${activeSpan.status === 'correct' ? 'bg-emerald-500/20 text-emerald-400' :
                                    activeSpan.status === 'incorrect' ? 'bg-red-500/20 text-red-400' :
                                        activeSpan.status === 'missed' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-800 text-slate-500'
                                    }`}>
                                    {activeSpan.status === 'correct' && <CheckCircle2 className="w-5 h-5" />}
                                    {activeSpan.status === 'incorrect' && <XCircle className="w-5 h-5" />}
                                    {activeSpan.status === 'missed' && <AlertTriangle className="w-5 h-5" />}
                                    {activeSpan.status === 'neutral' && <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className={`text-[10px] font-black uppercase tracking-[0.15em] ${activeSpan.status === 'correct' ? 'text-emerald-400' :
                                        activeSpan.status === 'incorrect' ? 'text-red-400' :
                                            activeSpan.status === 'missed' ? 'text-amber-400' : 'text-slate-400'
                                        }`}>
                                        {activeSpan.status === 'correct' ? '✓ CORRECTLY IDENTIFIED' :
                                            activeSpan.status === 'incorrect' ? '✗ INCORRECTLY SELECTED' :
                                                activeSpan.status === 'missed' ? '⚠ MISSED CUE' : 'FINDING'}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mt-0.5">"{activeSpan.text}"</h3>
                                </div>
                            </div>
                        </div>

                        {/* Content: Why Correct / Why Incorrect */}
                        <div className="p-6 space-y-4 relative z-10">
                            {/* Why Correct Section */}
                            {activeSpan.whyCorrect && activeSpan.whyCorrect !== 'N/A' && (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Why This is Correct</span>
                                    </div>
                                    <p className="text-sm text-emerald-100/90 leading-relaxed">
                                        {activeSpan.whyCorrect.replace(/\[Hook\]\s*/g, '').replace(/\[Hook\]/g, '')}
                                    </p>
                                </div>
                            )}

                            {/* Why Incorrect Section */}
                            {activeSpan.whyIncorrect && activeSpan.whyIncorrect !== 'N/A' && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Why This is Incorrect</span>
                                    </div>
                                    <p className="text-sm text-red-100/90 leading-relaxed">
                                        {activeSpan.whyIncorrect.replace(/\[Hook\]\s*/g, '').replace(/\[Hook\]/g, '')}
                                    </p>
                                </div>
                            )}

                            {/* Fallback for legacy data */}
                            {(!activeSpan.whyCorrect || activeSpan.whyCorrect === 'N/A') &&
                                (!activeSpan.whyIncorrect || activeSpan.whyIncorrect === 'N/A') && (
                                    <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4 text-slate-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Rationale</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {activeSpan.rationale.replace(/\[Hook\]\s*/g, '').replace(/\[Hook\]/g, '')}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                        <AlertCircle className="w-6 h-6" />
                        <p className="text-sm font-medium">Select a highlighted segment above to view clinical rationale</p>
                    </div>
                </div>
            )}
        </div>
    );
};
