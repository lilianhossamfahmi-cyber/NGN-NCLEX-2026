import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { MatrixRowAnalysis } from '../../types/RationaleTypes';

interface MatrixFeedbackProps {
    rows: MatrixRowAnalysis[];
    columns: { id: string; text: string }[];
}

export const MatrixFeedback: React.FC<MatrixFeedbackProps> = ({ rows, columns }) => {
    // State to track expanded rationales
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left text-slate-400 font-medium text-sm w-1/3 border-b border-slate-700">
                                Assessment / Finding
                            </th>
                            {columns.map(col => (
                                <th key={col.id} className="p-4 text-center text-slate-300 font-semibold text-sm w-1/4 border-b border-slate-700">
                                    {col.text}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <tr
                                    className={`
                                        group transition-colors duration-200 cursor-pointer
                                        ${expandedRows[row.id] ? 'bg-slate-700/30' : 'hover:bg-slate-700/20'}
                                    `}
                                    onClick={() => toggleRow(row.id)}
                                >
                                    <td className="p-4 border-b border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            {expandedRows[row.id] ? (
                                                <ChevronUp className="w-4 h-4 text-slate-500" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-500" />
                                            )}
                                            <span className="text-slate-200 font-medium">{row.text}</span>
                                        </div>
                                    </td>
                                    {columns.map(col => {
                                        const isSelected = row.userAnswer === col.id;
                                        const isCorrectAnswer = row.correctAnswer === col.id;

                                        let cellStatus = 'neutral';
                                        if (isSelected && isCorrectAnswer) cellStatus = 'correct';
                                        else if (isSelected && !isCorrectAnswer) cellStatus = 'incorrect';
                                        else if (!isSelected && isCorrectAnswer) cellStatus = 'missed';

                                        return (
                                            <td key={col.id} className="p-4 border-b border-slate-700/50 align-middle">
                                                <div className="flex justify-center">
                                                    {cellStatus === 'correct' && (
                                                        <div className="flex flex-col items-center gap-1 animate-in zoom-in duration-300">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                                                                <Check className="w-5 h-5 text-emerald-400" />
                                                            </div>
                                                            <span className="text-xs font-bold text-emerald-400">Correct</span>
                                                        </div>
                                                    )}

                                                    {cellStatus === 'incorrect' && (
                                                        <div className="flex flex-col items-center gap-1 animate-in zoom-in duration-300">
                                                            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
                                                                <X className="w-5 h-5 text-rose-400" />
                                                            </div>
                                                            <span className="text-xs font-bold text-rose-400">Incorrect</span>
                                                        </div>
                                                    )}

                                                    {cellStatus === 'missed' && (
                                                        <div className="flex flex-col items-center gap-1 opacity-60">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-dashed border-emerald-500/30 flex items-center justify-center">
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            </div>
                                                            <span className="text-xs font-medium text-emerald-500">Correct Answer</span>
                                                        </div>
                                                    )}

                                                    {cellStatus === 'neutral' && (
                                                        <div className="w-6 h-6 rounded-full border border-slate-600 bg-slate-800 opacity-20" />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Expanded Rationale Row */}
                                {expandedRows[row.id] && (
                                    <tr className="bg-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <td colSpan={columns.length + 1} className="p-4 border-b border-slate-700">
                                            {(() => {
                                                const isRowCorrect = row.isCorrect;
                                                const isRowIncorrect = !isRowCorrect && row.userAnswer;

                                                return (
                                                    <div className={`
                                                        flex items-start gap-3 ml-8 p-3 rounded-lg border 
                                                        ${isRowCorrect
                                                            ? 'bg-emerald-500/10 border-emerald-500/20'
                                                            : isRowIncorrect
                                                                ? 'bg-rose-500/10 border-rose-500/20'
                                                                : 'bg-indigo-500/10 border-indigo-500/20' // Default/Missed
                                                        }
                                                    `}>
                                                        {isRowCorrect ? (
                                                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                                        ) : isRowIncorrect ? (
                                                            <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                                        )}

                                                        <div className="space-y-1">
                                                            <h4 className={`text-sm font-semibold ${isRowCorrect ? 'text-emerald-300' : isRowIncorrect ? 'text-rose-300' : 'text-indigo-300'
                                                                }`}>
                                                                {isRowCorrect ? 'Correct Analysis' : isRowIncorrect ? 'Correction & Rationale' : 'Clinical Rationale'}
                                                            </h4>
                                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                                {row.rationale || "No detailed rationale provided for this item."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                    <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                    <span>Incorrect</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/10 border border-dashed border-emerald-500/30"></div>
                    <span>Missed Option</span>
                </div>
            </div>
        </div>
    );
};
