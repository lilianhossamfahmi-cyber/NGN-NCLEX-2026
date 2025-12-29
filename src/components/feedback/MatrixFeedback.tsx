
import React from 'react';
import { CheckCircle2, AlertTriangle, X, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { MatrixRowAnalysis } from '../../types/RationaleTypes';

interface MatrixFeedbackProps {
    rows: MatrixRowAnalysis[];
    filter: 'all' | 'correct' | 'incorrect' | 'missed';
    setFilter: (f: 'all' | 'correct' | 'incorrect' | 'missed') => void;
    openRowId: string | null;
    setOpenRowId: (id: string | null) => void;
}

export const MatrixFeedback: React.FC<MatrixFeedbackProps> = ({ rows, filter, setFilter, openRowId, setOpenRowId }) => {
    if (!rows || rows.length === 0) return null;

    // Extract columns from the first row
    const columns = rows[0].allBuckets || [];

    // Calculate stats
    const total = rows.length;
    const correctCount = rows.filter(r => r.verdict === 'correct').length;

    return (
        <div className="space-y-6">
            {/* 1. Statistics Header */}
            <div className={`rounded-xl px-6 py-4 border flex items-center justify-between bg-slate-900/40 border-slate-800 shadow-2xl`}>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">
                            {correctCount}/{total}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rows Correctly Evaluated</span>
                    </div>
                    <div className="h-10 w-px bg-white/5" />
                    <div className="flex gap-1.5">
                        {rows.map((r, i) => (
                            <div
                                key={i}
                                className={`w-2 h-8 rounded-full transition-all duration-500 ${r.verdict === 'correct' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                    r.verdict === 'incorrect' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                        'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5">
                    {(['all', 'correct', 'incorrect', 'missed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Professional Matrix Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950/20">
                <table className="w-full border-collapse">
                    <thead>
                        {/* Primary Top Header */}
                        <tr className="bg-slate-900/80 border-b border-slate-800">
                            <th className="p-4 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/3">
                                ASSESSMENT FINDING
                            </th>
                            <th colSpan={columns.length} className="bg-blue-900/40 p-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-blue-300 border-l border-slate-800">
                                CATEGORY ANALYSIS
                            </th>
                        </tr>
                        {/* Column Labels If Multiple Categories */}
                        {columns.length > 1 && (
                            <tr className="bg-slate-900 border-b border-slate-800">
                                <th className="p-2"></th>
                                {columns.map(col => (
                                    <th key={col.id} className="p-3 text-[10px] font-black text-center text-slate-500 uppercase tracking-widest border-l border-slate-800 bg-slate-900/50">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {rows.filter(row => filter === 'all' || row.verdict === filter).map((row) => {
                            const isOpen = openRowId === row.rowId;

                            return (
                                <React.Fragment key={row.rowId}>
                                    {/* Table Row */}
                                    <tr
                                        onClick={() => setOpenRowId(isOpen ? null : row.rowId)}
                                        className={`group transition-all cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/5 ${isOpen ? 'bg-white/5' : ''}`}
                                    >
                                        <td className="p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                                        {row.findingText}
                                                    </div>
                                                </div>
                                                <div className={`mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-600'}`}>
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Feedback Cells */}
                                        {columns.map(col => {
                                            const isCorrectBucket = col.label === row.correctBucket;
                                            const isUserBucket = col.label === row.userBucket;

                                            // Determine Cell State
                                            let cellBg = '';
                                            let content = null;

                                            if (isUserBucket && isCorrectBucket) {
                                                // 🟢 CORRECT SELECTION
                                                cellBg = 'bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]';
                                                content = (
                                                    <div className="flex flex-col items-center gap-1 animate-in zoom-in-50 duration-300">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                                            <Check className="w-5 h-5" strokeWidth={3} />
                                                        </div>
                                                        <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center bg-white">
                                                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={4} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (isUserBucket && !isCorrectBucket) {
                                                // 🔴 INCORRECT SELECTION
                                                cellBg = 'bg-red-500/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]';
                                                content = (
                                                    <div className="flex flex-col items-center gap-1 animate-in shake-in duration-300">
                                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                                            <X className="w-5 h-5" strokeWidth={3} />
                                                        </div>
                                                        <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center bg-white">
                                                            <X className="w-3 h-3 text-red-500" strokeWidth={4} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (isCorrectBucket && !isUserBucket) {
                                                // ⚠️ MISSED CORRECT ANSWER
                                                cellBg = 'bg-amber-500/5 shadow-[inset_0_0_20px_rgba(245,158,11,0.03)]';
                                                content = (
                                                    <div className="flex flex-col items-center gap-1 animate-in pulse duration-1000 iteration-infinite">
                                                        <div className="w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center">
                                                            <div className="w-4 h-4 rounded-full bg-slate-800" />
                                                        </div>
                                                        <div className="w-6 h-6 rounded-full border-2 border-amber-500 flex items-center justify-center bg-white shadow-lg shadow-amber-500/40">
                                                            <AlertCircle className="w-4 h-4 text-amber-500" strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                // ⚪ UNSELECTED DISTRACTOR
                                                content = (
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center opacity-40">
                                                        <div className="w-px h-px" />
                                                    </div>
                                                );
                                            }

                                            return (
                                                <td key={col.id} className={`p-4 border-l border-white/5 transition-colors text-center ${cellBg}`}>
                                                    <div className="flex flex-col items-center justify-center min-h-[60px]">
                                                        {content}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* Rationale Row (Expanded) */}
                                    {isOpen && (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="p-0 bg-slate-900">
                                                <div className="p-8 border-t border-white/5 animate-in slide-in-from-top-4 duration-500 flex gap-8">
                                                    {/* Side Badge */}
                                                    <div className="shrink-0">
                                                        <div className={`
                                                            px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest flex items-center gap-2
                                                            ${row.verdict === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                                                row.verdict === 'incorrect' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                                                    'bg-amber-500/10 border-amber-500/30 text-amber-400'}
                                                        `}>
                                                            {row.verdict === 'correct' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                                            {row.verdict}
                                                        </div>
                                                    </div>

                                                    {/* Rationale Content */}
                                                    <div className="flex-1 space-y-6">
                                                        <div>
                                                            <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${row.verdict === 'missed' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                                Clinical Rationale
                                                            </div>
                                                            <div className="text-base leading-relaxed text-slate-200 p-6 rounded-2xl bg-black/40 border border-white/5">
                                                                {row.whyCorrect}
                                                            </div>
                                                        </div>

                                                        {row.trap && (
                                                            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 relative overflow-hidden group/trap">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
                                                                <div className="flex items-start gap-4 relative z-10">
                                                                    <div className="shrink-0 p-3 bg-red-500/20 rounded-xl text-red-400">
                                                                        <AlertCircle className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Common Trap Alert</div>
                                                                        <p className="text-sm text-red-200/80 leading-relaxed italic">"{row.trap}"</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 3. Footer mastery tip */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-500/20 flex gap-5 items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                    <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Matrix Mastering Guide</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Matrix items test your ability to differentiate across similar categories. Always prioritize <strong>safety</strong> over <strong>comfort</strong> when evaluative findings conflict.</p>
                </div>
            </div>
        </div>
    );
};
