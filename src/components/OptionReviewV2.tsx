import React, { useState, useMemo } from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    CheckSquare
} from 'lucide-react';
import { ReviewUnit } from '../types/OptionReviewV2Types';

interface OptionReviewV2Props {
    units: ReviewUnit[];
}

type FilterType = 'all' | 'selected' | 'missed';

export const OptionReviewV2: React.FC<OptionReviewV2Props> = ({ units }) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [showDistractors, setShowDistractors] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Toggle Expansion
    const toggleExpand = (id: string) => {
        const next = new Set(expandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedIds(next);
    };

    // Detect Cloze Mode
    const isClozeMode = useMemo(() => units.some(u => u.itemType === 'cloze'), [units]);

    // Filter Logic
    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            // "Show all distractors" logic:
            // If NOT showing distractors, hide 'NOT_SELECTED_INCORRECT'
            if (!showDistractors && unit.status === 'NOT_SELECTED_INCORRECT' && !isClozeMode) {
                return false;
            }

            if (filter === 'all') return true;

            if (isClozeMode) {
                // Map filters for Cloze: 'selected' -> Incorrect Answer, 'missed' -> Unanswered
                if (filter === 'selected') return unit.status === 'SELECTED_INCORRECT';
                if (filter === 'missed') return unit.status === 'MISSED_CORRECT'; // i.e., Unanswered
            } else {
                if (filter === 'selected') return unit.userSelected;
                if (filter === 'missed') return unit.status === 'MISSED_CORRECT';
            }
            return true;
        });
    }, [units, filter, showDistractors, isClozeMode]);

    if (!units || units.length === 0) return (
        <div className="p-8 text-center text-slate-500">
            No selectable options found for review.
        </div>
    );

    return (
        <div className="w-full space-y-6">

            {/* 1. Filter & Toggle Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-xl border border-white/5">

                {/* Filter Tabs */}
                <div className="flex bg-black/40 p-1 rounded-lg">
                    {(['all', 'selected', 'missed'] as const).map(f => {
                        let label: string = f;
                        if (isClozeMode) {
                            if (f === 'selected') label = 'Incorrect';
                            if (f === 'missed') label = 'Unanswered';
                            if (f === 'all') label = 'All';
                        }
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                ${filter === f
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>

                {/* Show Distractors Toggle (Hidden for Cloze) */}
                {!isClozeMode && (
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showDistractors ? 'bg-blue-600 border-blue-500' : 'border-slate-600 bg-black/20'}`}
                            onClick={() => setShowDistractors(!showDistractors)}
                        >
                            {showDistractors && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-300 transition-colors uppercase tracking-wide">
                            Show Distractors
                        </span>
                    </label>
                )}
            </div>

            {/* 2. Unit List */}
            <div className="space-y-3">
                {filteredUnits.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic">
                        No items match the current filter.
                    </div>
                )}

                {filteredUnits.map((unit, idx) => {
                    const isExpanded = expandedIds.has(unit.id);

                    // Determine Style based on Status
                    let cardClass = "";
                    let icon = null;
                    let label = "";
                    let keyLabel = "";

                    if (isClozeMode && unit.clozeResult) {
                        // Specific Cloze Styling
                        switch (unit.clozeResult.status) {
                            case 'CORRECT':
                                cardClass = "bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20";
                                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                                label = `Correct ${unit.clozeResult.correctValue}`;
                                // Remove keyLabel for Cloze
                                break;
                            case 'INCORRECT':
                                cardClass = "bg-red-500/10 border-red-500/50 hover:bg-red-500/20";
                                icon = <XCircle className="w-5 h-5 text-red-500" />;
                                label = "Incorrect";
                                break;
                            case 'UNANSWERED':
                                cardClass = "bg-amber-500/10 border-amber-500/50 border-dashed hover:bg-amber-500/20";
                                icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
                                label = "Unanswered";
                                break;
                        }

                    } else {
                        // Standard Styling
                        switch (unit.status) {
                            case 'SELECTED_CORRECT':
                                cardClass = "bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20";
                                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                                label = "Correct";
                                keyLabel = "Key: Correct";
                                break;
                            case 'SELECTED_INCORRECT':
                                cardClass = "bg-red-500/10 border-red-500/50 hover:bg-red-500/20";
                                icon = <XCircle className="w-5 h-5 text-red-500" />;
                                label = "Incorrect";
                                keyLabel = "Key: Incorrect";
                                break;
                            case 'MISSED_CORRECT':
                                cardClass = "bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-transparent border-amber-500/50 border-dashed hover:bg-amber-500/10";
                                icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
                                label = "Missed (Correct)";
                                keyLabel = "Key: Correct";
                                break;
                            case 'NOT_SELECTED_INCORRECT':
                            default:
                                cardClass = "bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 opacity-60";
                                icon = <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
                                label = "Not Selected";
                                keyLabel = "Key: Incorrect";
                                break;
                        }
                    }

                    return (
                        <div
                            key={unit.id || idx}
                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${cardClass}`}
                        >
                            <div
                                onClick={() => toggleExpand(unit.id)}
                                className="p-4 flex items-center gap-4 cursor-pointer select-none"
                            >
                                {/* Icon */}
                                <div className="shrink-0">
                                    {icon}
                                </div>

                                {/* Main Text */}
                                <div className="grow flex flex-col gap-0.5">
                                    {isClozeMode && unit.clozeResult ? (
                                        // CLOZE SPECIFIC HEADER: [Context] - [User] -> [Correct]
                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm text-slate-200">
                                            <span className="font-medium text-slate-400 border-b border-transparent hover:border-slate-500 transition-colors">
                                                {unit.clozeResult.contextLabel}
                                            </span>

                                            <span className="hidden sm:inline text-slate-600">—</span>

                                            <div className="flex items-center gap-2 font-mono text-xs">
                                                <span className={`${unit.clozeResult.status === 'CORRECT' ? 'text-emerald-400' :
                                                    unit.clozeResult.status === 'INCORRECT' ? 'text-red-400 line-through' : 'text-amber-400 italic'}`}>
                                                    {unit.clozeResult.userValue || "No Answer"}
                                                </span>

                                                {(unit.clozeResult.status === 'INCORRECT' || unit.clozeResult.status === 'UNANSWERED') && (
                                                    <>
                                                        <span className="text-slate-500">→</span>
                                                        <span className="text-emerald-400">{unit.clozeResult.correctValue}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // Standard Header
                                        <>
                                            <div className="flex items-center gap-2">
                                                {unit.label && (
                                                    <span className="text-[10px] font-black uppercase tracking-wider opacity-50">
                                                        {unit.label}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm font-medium text-slate-200">
                                                {unit.promptText && <span className="text-slate-500 mr-2">{unit.promptText}:</span>}
                                                {unit.optionText}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Metadata / Status */}
                                <div className="shrink-0 flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${(isClozeMode && unit.clozeResult?.status === 'CORRECT') ? 'text-emerald-500' :
                                            (isClozeMode && unit.clozeResult?.status === 'INCORRECT') ? 'text-red-500' :
                                                (isClozeMode && unit.clozeResult?.status === 'UNANSWERED') ? 'text-amber-500' :
                                                    unit.status.includes('CORRECT') && !unit.status.includes('INCORRECT') ? 'text-emerald-500' :
                                                        unit.status.includes('INCORRECT') ? 'text-red-500' : 'text-amber-500'
                                            }`}>
                                            {label}
                                        </span>
                                        {!isClozeMode && (
                                            <span className="text-[9px] text-slate-500 font-mono">
                                                {keyLabel}
                                            </span>
                                        )}
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                </div>
                            </div>

                            {/* Expanded Content: Rationale */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                                    <div className="bg-black/20 rounded-lg p-4 border-t border-white/5 text-sm space-y-3">

                                        {/* Why Correct Rationale */}
                                        {/* Only show for actually correct statuses, not for SELECTED_INCORRECT or NOT_SELECTED_INCORRECT */}
                                        {((!isClozeMode && (unit.status === 'SELECTED_CORRECT' || unit.status === 'MISSED_CORRECT')) || (isClozeMode && (unit.clozeResult?.status === 'CORRECT' || unit.clozeResult?.status === 'UNANSWERED'))) && unit.whyCorrect && (
                                            <div className="flex gap-3">
                                                <div className="shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase text-emerald-500/60 mb-1">
                                                        {isClozeMode && unit.clozeResult?.status === 'UNANSWERED' ? "Why this is correct" : "Why this is Correct"}
                                                    </h4>
                                                    <p className="text-slate-300 leading-relaxed max-w-prose">
                                                        {unit.whyCorrect}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Why Incorrect Rationale (Standard only, Cloze uses whyCorrect usually) */}
                                        {/* Only show for actually incorrect statuses, not for SELECTED_CORRECT or MISSED_CORRECT */}
                                        {((!isClozeMode && (unit.status === 'SELECTED_INCORRECT' || unit.status === 'NOT_SELECTED_INCORRECT')) || (isClozeMode && unit.clozeResult?.status === 'INCORRECT')) && unit.whyIncorrect && (
                                            <div className="flex gap-3">
                                                <div className="shrink-0 mt-0.5">
                                                    <XCircle className="w-4 h-4 text-red-500/60" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase text-red-500/60 mb-1">Why this is Incorrect</h4>
                                                    <p className="text-slate-300 leading-relaxed max-w-prose">
                                                        {unit.whyIncorrect}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Trap */}
                                        {unit.commonTrap && (
                                            <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
                                                <div className="shrink-0 mt-0.5">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500/60" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase text-amber-500/60 mb-1">Pass Point Trap</h4>
                                                    <p className="text-slate-400 italic">
                                                        {unit.commonTrap}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Cloze Specific Empty State */}
                                        {isClozeMode && !unit.whyCorrect && (
                                            <div className="text-slate-500 italic text-xs">
                                                No specific rationale provided for this blank.
                                            </div>
                                        )}

                                        {!isClozeMode && !unit.whyCorrect && !unit.whyIncorrect && (
                                            <div className="text-slate-500 italic text-xs">
                                                No specific rationale provided for this option.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};
