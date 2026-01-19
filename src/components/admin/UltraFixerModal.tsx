import React, { useState, useEffect } from 'react';
import {
    X, Send, History, AlertCircle, CheckCircle2,
    MousePointer2, Eraser, Copy, Sparkles, Wand2,
    Save, Loader2, Zap
} from 'lucide-react';
import { MasterQuestionItem } from '../../types/master-schema';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { ultraFixerService } from '../../services/ultraFixerService';
import { diffTexts } from '../../utils/diffUtils';

interface UltraFixerModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

export const UltraFixerModal: React.FC<UltraFixerModalProps> = ({ item, onClose, onSuccess }) => {
    // Stage Management: 'input' | 'preview'
    const [stage, setStage] = useState<'input' | 'preview'>('input');
    const [instruction, setInstruction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Command History (Global Memory)
    const [history, setHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('ultra_fixer_history');
        if (saved) {
            try { return JSON.parse(saved); } catch { return []; }
        }
        return [
            "Convert to Level 5 Sepsis Case Study",
            "Follow Golden Rules for Bow-Tie item",
            "Fix vitals trend & update rationales",
            "Standardize pharmacological explanations"
        ];
    });

    // Authority State
    const [authorityMode, setAuthorityMode] = useState<'surgical' | 'structural'>('surgical');

    // Result States
    const [modifiedItem, setModifiedItem] = useState<MasterQuestionItem | null>(null);
    const [healthStatus, setHealthStatus] = useState<{ status: 'ok' | 'error', message?: string }>({ status: 'ok' });

    // Selection States
    const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
    const [showContextAI, setShowContextAI] = useState(false);
    const [contextInstruction, setContextInstruction] = useState('');

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem('ultra_fixer_history', JSON.stringify(history));
    }, [history]);

    const handleExecute = async (cmd?: string) => {
        const activeCmd = cmd || instruction;
        if (!activeCmd.trim()) return;

        setLoading(true);
        setError(null);

        if (!history.includes(activeCmd)) {
            setHistory(prev => [activeCmd, ...prev.slice(0, 9)]);
        }

        try {
            const result = await ultraFixerService.execute(item, activeCmd, authorityMode);
            setModifiedItem(result);
            setStage('preview');
            validateAtomicHealth(result);
        } catch (err: any) {
            setError(err.message || 'AI Execution Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleContextAction = async (action: string) => {
        if (!selection) return;
        setLoading(true);
        try {
            const result = await ultraFixerService.executePartial(
                modifiedItem || item,
                selection.text,
                `${action}: ${contextInstruction}`
            );
            setModifiedItem(result);
            setSelection(null);
            setShowContextAI(false);
            setContextInstruction('');
            validateAtomicHealth(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (stage !== 'preview' || loading) return;

        const selected = window.getSelection();
        const text = selected?.toString().trim();

        if (text && text.length > 2) {
            setSelection({
                text,
                x: e.clientX,
                y: e.clientY
            });
        } else {
            setSelection(null);
            setShowContextAI(false);
        }
    };

    const validateAtomicHealth = (target: MasterQuestionItem) => {
        const missing = [];
        if (!target.id) missing.push("ID");
        const meta = target.metadata as any;
        if (!meta?.clientNeeds && !(target as any).client_needs) missing.push("Client Needs");
        if (!meta?.cjmmStep && !(target as any).cjmm_step) missing.push("CJMM Step");

        if (missing.length > 0) {
            setHealthStatus({ status: 'error', message: `Missing: ${missing.join(', ')}` });
        } else {
            setHealthStatus({ status: 'ok' });
        }
    };

    const renderDiffContent = (oldText: string, newText: string) => {
        const diffs = diffTexts(oldText, newText);
        return diffs.map((part, i) => (
            <span key={i} className={
                part.type === 'added' ? 'bg-emerald-500/20 text-emerald-400 font-bold px-0.5 rounded' :
                    part.type === 'removed' ? 'bg-rose-500/20 text-rose-400 line-through px-0.5 rounded opacity-50' :
                        'text-slate-300'
            }>
                {part.value}
            </span>
        ));
    };

    const handleApply = async () => {
        if (!modifiedItem) return;
        setLoading(true);
        try {
            await updateItem(modifiedItem);
            await syncItemToSupabase(modifiedItem);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(`Save Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-700/50 flex flex-col max-h-[90vh] text-slate-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-4 flex justify-between items-center shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Zap className="text-yellow-300 fill-yellow-300" size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg tracking-tight">UltraFixer Central Hub</h2>
                            <p className="text-[10px] uppercase tracking-widest text-indigo-100/70 font-bold">High Authority Neural Interface</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {stage === 'input' && (
                            <div className="flex bg-black/30 rounded-full p-1 border border-white/10 shadow-inner">
                                <button
                                    onClick={() => setAuthorityMode('surgical')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${authorityMode === 'surgical' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-300 hover:text-white'}`}
                                >
                                    Surgical
                                </button>
                                <button
                                    onClick={() => setAuthorityMode('structural')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${authorityMode === 'structural' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-300 hover:text-white'}`}
                                >
                                    Structural
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-all hover:rotate-90">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto bg-slate-950 p-6 flex flex-col gap-6">
                    {stage === 'input' ? (
                        <div className="space-y-6 max-w-2xl mx-auto w-full py-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">What needs improvement?</h3>
                                <p className="text-slate-400 text-sm">Target any clinical area, metadata, or rebuild the entire logic.</p>
                            </div>

                            <div className="relative group">
                                <textarea
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    placeholder="Type your command (e.g., 'Convert to Level 4 COPD trend case')..."
                                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 pr-14 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none h-40 shadow-2xl"
                                />
                                <button
                                    onClick={() => handleExecute()}
                                    disabled={loading || !instruction.trim()}
                                    className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 p-3 rounded-xl shadow-lg transition-all active:scale-95 group-hover:shadow-indigo-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-1">
                                    <History size={12} />
                                    <span>Recent Knowledge</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {history.map((cmd, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInstruction(cmd);
                                                handleExecute(cmd);
                                            }}
                                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-white transition-all hover:border-indigo-500/30"
                                        >
                                            {cmd}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden">
                                <div className="bg-slate-800/50 p-3 border-b border-slate-700 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Track Changes Preview</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span>Additions</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <span>Deletions</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 font-mono text-sm overflow-auto space-y-8 select-text" onMouseUp={onMouseUp}>
                                    {modifiedItem && (
                                        <>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Scenario / Text</h4>
                                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 leading-relaxed">
                                                    {renderDiffContent(
                                                        (item.content as any)?.scenario || (item.content as any)?.text || (item as any).prompt || '',
                                                        (modifiedItem.content as any)?.scenario || (modifiedItem.content as any)?.text || (modifiedItem as any).prompt || ''
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Structure / Correct Options</h4>
                                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 leading-relaxed text-xs text-slate-400">
                                                    {renderDiffContent(
                                                        JSON.stringify((item as any).structure || {}, null, 2),
                                                        JSON.stringify((modifiedItem as any).structure || {}, null, 2)
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Rationale</h4>
                                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 leading-relaxed">
                                                    {renderDiffContent(
                                                        (item.content as any)?.rationale || (item as any).rationale || (item as any).rationale?.general || '',
                                                        (modifiedItem.content as any)?.rationale || (modifiedItem as any).rationale || (modifiedItem as any).rationale?.general || ''
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${healthStatus.status === 'ok'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}>
                            {healthStatus.status === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span className="text-xs font-bold tracking-tight">
                                {healthStatus.status === 'ok' ? 'Atomic Health: READY' : `Issue: ${healthStatus.message}`}
                            </span>
                        </div>

                        {stage === 'preview' && (
                            <div className="hidden md:flex items-center gap-1 text-slate-500 text-xs font-medium">
                                <MousePointer2 size={14} className="animate-bounce" />
                                <span>Highlight text for Precision AI tools</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {stage === 'preview' ? (
                            <>
                                <button
                                    onClick={() => setStage('input')}
                                    className="px-5 py-2 hover:bg-slate-800 text-slate-400 rounded-xl font-bold text-sm transition-all"
                                >
                                    Modify Global Fix
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={loading}
                                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Permanent Sync
                                </button>
                            </>
                        ) : (
                            <button onClick={onClose} className="px-5 py-2 hover:bg-slate-800 text-slate-400 rounded-xl font-bold text-sm transition-all">
                                Close
                            </button>
                        )}
                    </div>
                </div>

                {/* Precision Floating Toolbar */}
                {selection && (
                    <div
                        className="fixed z-[150] bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-2 flex flex-col gap-2 min-w-[240px] animate-in zoom-in-95 duration-200"
                        style={{ left: selection.x, top: Math.max(80, selection.y - 120) }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!showContextAI ? (
                            <div className="flex flex-col gap-1">
                                <div className="px-2 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selection Action</div>
                                <button
                                    onClick={() => setShowContextAI(true)}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-600 rounded-lg text-sm text-left transition-all"
                                >
                                    <Sparkles size={14} className="text-yellow-400" />
                                    Ask AI to Fix/Rewrite
                                </button>
                                <button
                                    onClick={() => handleContextAction('Delete Selection')}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-rose-600 rounded-lg text-sm text-left transition-all text-rose-400 hover:text-white"
                                >
                                    <Eraser size={14} />
                                    Delete Selection
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selection.text);
                                        setSelection(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-700 rounded-lg text-sm text-left transition-all"
                                >
                                    <Copy size={14} />
                                    Copy Text
                                </button>
                            </div>
                        ) : (
                            <div className="p-2 space-y-3">
                                <textarea
                                    autoFocus
                                    value={contextInstruction}
                                    onChange={(e) => setContextInstruction(e.target.value)}
                                    placeholder="Tell AI what to do..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:border-indigo-500 outline-none h-24"
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowContextAI(false)} className="px-3 py-1 text-xs text-slate-500 hover:text-white transition-all">Cancel</button>
                                    <button
                                        onClick={() => handleContextAction('Modify selection')}
                                        className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-lg"
                                    >
                                        <Wand2 size={12} />
                                        Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
