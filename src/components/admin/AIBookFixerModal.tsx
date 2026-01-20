import React, { useState, useRef, useEffect } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import {
    Save, Wand2, RefreshCcw, X, Sparkles, Layout, BrainCircuit,
    Settings, ShieldCheck, Trash2, Plus, Check, ImageIcon
} from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { magicFixItem } from '../../services/geminiService';
import { DataSanitizer, StructuredNote } from '../../utils/DataSanitizer';

interface AIBookFixerModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

export const AIBookFixerModal: React.FC<AIBookFixerModalProps> = ({ item, onClose, onSuccess }) => {
    const [liveItem, setLiveItem] = useState<MasterQuestionItem>(JSON.parse(JSON.stringify(item)));
    const [activeSection, setActiveSection] = useState<'clinical' | 'question' | 'metadata' | 'quality'>('clinical');
    const [isSaving, setIsSaving] = useState(false);
    const [isAiWorking, setIsAiWorking] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiModal, setShowAiModal] = useState(false);

    // --- SAVE ---
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateItem(liveItem);
            await syncItemToSupabase(liveItem);
            alert('✅ All changes saved permanently!');
            onSuccess();
            onClose();
        } catch (e) {
            console.error(e);
            alert('Save failed.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- AI REWRITE ---
    const handleAiRewrite = async () => {
        if (!aiPrompt.trim() || !editingField) return;
        setIsAiWorking(true);
        try {
            const prompt = `Rewrite this specific part: ${editingField}. Instruction: ${aiPrompt}. Return the full updated item JSON.`;
            const result = await magicFixItem(liveItem, prompt);
            // Re-merge to preserve IDs
            const merged = { ...liveItem, ...result, id: liveItem.id };
            setLiveItem(merged);
            setShowAiModal(false);
            setAiPrompt('');
        } catch (e: any) {
            alert('AI Error: ' + e.message);
        } finally {
            setIsAiWorking(false);
        }
    };

    // --- FIELD UPDATE ---
    const updateField = (path: string, value: any) => {
        const updated = JSON.parse(JSON.stringify(liveItem));
        const keys = path.split('.');
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        setLiveItem(updated);
    };

    // --- EDITABLE COMPONENT (DOUBLE CLICK) ---
    const EditableField = ({ value, path, className = '', multiline = false, placeholder = '...' }: { value: string, path: string, className?: string, multiline?: boolean, placeholder?: string }) => {
        const [editing, setEditing] = useState(false);
        const [localVal, setLocalVal] = useState(value || '');
        const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

        useEffect(() => { setLocalVal(value || ''); }, [value]);

        const save = () => {
            setEditing(false);
            if (localVal !== value) updateField(path, localVal);
        };

        const startEdit = (e: React.MouseEvent) => {
            e.stopPropagation();
            setEditing(true);
            setEditingField(path);
            setTimeout(() => ref.current?.focus(), 50);
        };

        if (editing) {
            return multiline ? (
                <textarea
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    className={`border-2 border-blue-500 rounded p-2 bg-white outline-none w-full text-slate-800 ${className}`}
                    rows={4}
                />
            ) : (
                <input
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    onKeyDown={e => e.key === 'Enter' && save()}
                    className={`border-2 border-blue-500 rounded px-2 py-1 bg-white outline-none w-full text-slate-800 ${className}`}
                />
            );
        }

        return (
            <div
                onDoubleClick={startEdit}
                className={`cursor-pointer hover:bg-yellow-200 hover:outline hover:outline-2 hover:outline-yellow-500 rounded px-1 transition-all ${className} ${!value ? 'text-gray-300 italic' : ''}`}
                title="Double-click to edit content"
            >
                {value || placeholder}
            </div>
        );
    };

    // ========== AREA 1: CLINICAL DATA ==========
    const renderClinicalArea = () => {
        const patientInfo = liveItem.content.clinicalData?.patientInfo || {};
        const notes = DataSanitizer.sanitizeNursesNotes(liveItem.content.clinicalData?.history || '');

        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Visual EHR Header */}
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-black">
                                {(patientInfo.name || 'P')[0]}
                            </div>
                            <div className="text-white">
                                <div className="text-[10px] uppercase tracking-widest opacity-70">Patient Record</div>
                                <div className="text-lg font-bold flex items-center gap-2">
                                    <EditableField value={patientInfo.name || 'New Patient'} path="content.clinicalData.patientInfo.name" className="text-white" />
                                    <span className="opacity-50">/</span>
                                    <EditableField value={patientInfo.age || 'Adult'} path="content.clinicalData.patientInfo.age" className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded text-[10px] font-bold">ALLERGIES: NKDA</div>
                            <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-3 py-1 rounded text-[10px] font-bold">FALL RISK</div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-4 gap-6 text-slate-300 bg-slate-800/50">
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 mb-1">Diagnosis</div>
                            <EditableField value={patientInfo.diagnosis || 'Undiagnosed'} path="content.clinicalData.patientInfo.diagnosis" className="font-bold text-white text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 mb-1">Location</div>
                            <EditableField value={patientInfo.room || 'TBD'} path="content.clinicalData.patientInfo.room" className="font-bold text-blue-400 text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 mb-1">Provider</div>
                            <EditableField value={patientInfo.physician || 'Attending'} path="content.clinicalData.patientInfo.physician" className="font-bold text-white text-sm" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 mb-1">Isolation</div>
                            <EditableField value={patientInfo.isolation || 'Standard'} path="content.clinicalData.patientInfo.isolation" className="font-bold text-white text-sm" />
                        </div>
                    </div>
                </div>

                {/* Nurses Notes Section */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Nurses Notes</h3>
                        <button
                            onClick={() => { setEditingField('content.clinicalData.history'); setShowAiModal(true); }}
                            className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                        >
                            <Sparkles size={14} /> AI Rewrite
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        {notes.map((note: StructuredNote, idx: number) => (
                            <div key={idx} className="flex gap-6 items-start group">
                                <div className="flex-shrink-0 text-center pt-1">
                                    <div className="text-lg font-black text-slate-900 leading-none">{note.time.split(':')[0]}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{note.time.split(':')[1]}</div>
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                                    <div className="text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase flex justify-between">
                                        <span>Section {idx + 1}</span>
                                        <span className="text-slate-300">RN Signature: {note.initial || 'STAFF'}</span>
                                    </div>
                                    <EditableField
                                        value={note.note}
                                        path={`content.clinicalData.history`}
                                        multiline
                                        className="text-slate-700 text-sm leading-relaxed italic"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // ========== AREA 2: QUESTION STRUCTURE ==========
    const renderQuestionArea = () => {
        const prompt = liveItem.content.structure?.prompt || '';
        const options = liveItem.content.structure?.options || [];

        return (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">?</div>
                                <h3 className="font-black text-slate-900 uppercase">Question Stem</h3>
                            </div>
                            <button
                                onClick={() => { setEditingField('content.structure.prompt'); setShowAiModal(true); }}
                                className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                            >
                                <Sparkles size={14} className="inline mr-1" /> Enhance with AI
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                            <EditableField
                                value={prompt}
                                path="content.structure.prompt"
                                multiline
                                className="text-xl font-medium text-slate-800 leading-normal"
                                placeholder="Enter your question prompt here..."
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white uppercase tracking-widest text-sm">Response Options</h3>
                            <button
                                onClick={() => {
                                    const newOpts = [...options, { id: crypto.randomUUID(), text: 'New Option', isCorrect: false }];
                                    updateField('content.structure.options', newOpts);
                                }}
                                className="text-[10px] bg-green-500 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
                            >
                                <Plus size={12} className="inline mr-1" /> Add Option
                            </button>
                        </div>

                        <div className="space-y-4">
                            {options.map((opt: any, idx: number) => (
                                <div key={opt.id || idx} className={`flex items-start gap-4 p-4 rounded-xl transition-all group ${opt.isCorrect ? 'bg-green-500/10 border-2 border-green-500/50' : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-500'}`}>
                                    <button
                                        onClick={() => {
                                            const newOpts = [...options];
                                            newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
                                            updateField('content.structure.options', newOpts);
                                        }}
                                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/30' : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'}`}
                                    >
                                        {opt.isCorrect && <Check size={14} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <EditableField
                                            value={opt.text}
                                            path={`content.structure.options.${idx}.text`}
                                            className="text-white font-bold text-sm"
                                            placeholder="Enter option text..."
                                        />
                                        <div className="mt-2 text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                                            <span>Rationale:</span>
                                            <EditableField
                                                value={opt.rationale || ''}
                                                path={`content.structure.options.${idx}.rationale`}
                                                className="text-slate-400 italic font-normal normal-case"
                                                placeholder="Explain why this is correct/incorrect..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newOpts = options.filter((_: any, i: number) => i !== idx);
                                            updateField('content.structure.options', newOpts);
                                        }}
                                        className="text-red-400 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========== AREA 3: METADATA & PEDAGOGY ==========
    const renderMetadataArea = () => {
        const rationale = (liveItem.pedagogy as any)?.rationale || (liveItem as any).rationale || '';

        return (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Pedagogical Stats</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-600 uppercase mb-3 block">Complexity Level (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => updateField('pedagogy.difficultyLevel', lvl)}
                                            className={`flex-1 py-4 rounded-xl font-black text-xl transition-all ${liveItem.pedagogy?.difficultyLevel === lvl ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block">Clinical Focused Domain</label>
                                <EditableField
                                    value={liveItem.pedagogy?.clinicalFocus || 'Clinical Judgment'}
                                    path="pedagogy.clinicalFocus"
                                    className="bg-slate-800 text-cyan-400 font-black p-3 rounded-xl border border-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon size={32} />
                        </div>
                        <h4 className="font-black text-slate-800">Add Clinical Image</h4>
                        <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Images help simulate real clinical environments (X-rays, wounds, charts).</p>
                        <button className="mt-4 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2 rounded-lg transition-all">
                            UPLOAD ASSET
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Global Item Rationale</h3>
                        <button
                            onClick={() => { setEditingField('pedagogy.rationale'); setShowAiModal(true); }}
                            className="text-[10px] bg-purple-600 text-white px-3 py-1 rounded font-black hover:bg-purple-500 transition-all"
                        >
                            AUTO-GENERATE
                        </button>
                    </div>
                    <div className="p-8">
                        <EditableField
                            value={rationale}
                            path="pedagogy.rationale"
                            multiline
                            className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 text-base italic leading-relaxed"
                            placeholder="Explain the logic behind the correct answer and why distractors are incorrect..."
                        />
                    </div>
                </div>
            </div>
        );
    };

    // ========== AREA 4: AI SAFETY & QUALITY ==========
    const renderQualityArea = () => {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 uppercase text-lg">Quality & Safety Audit</h3>
                            <p className="text-sm text-slate-500">AI-powered validation against NCLEX standard protocols.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                            <div className="text-[10px] font-black text-green-600 uppercase mb-1">Copyright Check</div>
                            <div className="text-sm font-bold text-green-800 flex items-center gap-2">
                                <Check size={16} /> 100% Unique
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="text-[10px] font-black text-blue-600 uppercase mb-1">Bias Detection</div>
                            <div className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                <Check size={16} /> Bias-Free Content
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                            <div className="text-[10px] font-black text-purple-600 uppercase mb-1">Policy Sync</div>
                            <div className="text-sm font-bold text-purple-800 flex items-center gap-2">
                                <Check size={16} /> Compliant
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                            <RefreshCcw size={18} className="text-slate-400" /> Administrative Status
                        </h4>
                        <div className="flex gap-4">
                            {['draft', 'published', 'archived'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateField('metadata.status', status)}
                                    className={`flex-1 py-4 rounded-xl border-2 font-black uppercase text-xs tracking-widest transition-all ${liveItem.metadata?.status === status ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
                    <h3 className="text-xl font-black mb-2">Final Review Required?</h3>
                    <p className="text-sm text-slate-400 max-w-md">Our AI Engine suggests this item is 98% ready for publication. Perform one last manual check before saving.</p>
                    <div className="mt-6 flex gap-4">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all">
                            DEBUG LOGS
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 transition-all">
                            GENERATE PRE-FLIGHT REPORT
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col font-sans text-slate-900 overflow-hidden h-screen">
            {/* TOP DYNAMIC HUD */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-md z-[120]">
                <div className="flex items-center gap-5">
                    <div className="bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 animate-pulse-slow">
                        <Wand2 size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 leading-none">AI BookFixer™</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Elite Visual Item Editorial Suite</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 rounded-full px-4 py-2 flex items-center gap-3 border border-slate-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Sync Alpha 2.0</span>
                    </div>

                    <div className="w-px h-8 bg-slate-200" />

                    <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                        <X size={24} />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* MAIN PORTAL */}
            <div className="flex-1 flex overflow-hidden">
                {/* 4 AREAS OF POWER SIDEBAR */}
                <div className="w-80 bg-slate-950 p-6 flex flex-col gap-3 shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-[110]">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 px-2">4 Areas of Power</div>

                    <button
                        onClick={() => setActiveSection('clinical')}
                        className={`group relative text-left px-5 py-5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeSection === 'clinical' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    >
                        <Layout size={24} className={activeSection === 'clinical' ? 'text-white' : 'group-hover:text-blue-400'} />
                        <div>
                            <div className="font-black text-xs uppercase tracking-widest">Clinical Data</div>
                            <div className="text-[9px] opacity-60 font-bold mt-1">EHR, Notes, Vitals</div>
                        </div>
                        {activeSection === 'clinical' && <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                    </button>

                    <button
                        onClick={() => setActiveSection('question')}
                        className={`group relative text-left px-5 py-5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeSection === 'question' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    >
                        <BrainCircuit size={24} className={activeSection === 'question' ? 'text-white' : 'group-hover:text-indigo-400'} />
                        <div>
                            <div className="font-black text-xs uppercase tracking-widest">Structure</div>
                            <div className="text-[9px] opacity-60 font-bold mt-1">Stems, Options, Keys</div>
                        </div>
                        {activeSection === 'question' && <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                    </button>

                    <button
                        onClick={() => setActiveSection('metadata')}
                        className={`group relative text-left px-5 py-5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeSection === 'metadata' ? 'bg-orange-600 text-white shadow-2xl shadow-orange-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    >
                        <Settings size={24} className={activeSection === 'metadata' ? 'text-white' : 'group-hover:text-orange-400'} />
                        <div>
                            <div className="font-black text-xs uppercase tracking-widest">Pedagogy</div>
                            <div className="text-[9px] opacity-60 font-bold mt-1">Difficulty, Topic, Assets</div>
                        </div>
                        {activeSection === 'metadata' && <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                    </button>

                    <button
                        onClick={() => setActiveSection('quality')}
                        className={`group relative text-left px-5 py-5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeSection === 'quality' ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    >
                        <ShieldCheck size={24} className={activeSection === 'quality' ? 'text-white' : 'group-hover:text-emerald-400'} />
                        <div>
                            <div className="font-black text-xs uppercase tracking-widest">Validation</div>
                            <div className="text-[9px] opacity-60 font-bold mt-1">AI Safety, Rules, Sync</div>
                        </div>
                        {activeSection === 'quality' && <div className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                    </button>

                    <div className="flex-1" />

                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Editor Hint</div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Double-click any highlighted text to modify it directly. AI buttons allow you to regenerate entire sections instantly.
                        </p>
                    </div>
                </div>

                {/* EDITORIAL CANVAS */}
                <div className="flex-1 overflow-auto bg-slate-100 p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center gap-2 text-slate-400">
                            <span className="font-mono text-xs opacity-50">{liveItem.id}</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Power Area {activeSection}</span>
                        </div>

                        {activeSection === 'clinical' && renderClinicalArea()}
                        {activeSection === 'question' && renderQuestionArea()}
                        {activeSection === 'metadata' && renderMetadataArea()}
                        {activeSection === 'quality' && renderQualityArea()}
                    </div>
                </div>
            </div>

            {/* AI OVERLAY */}
            {showAiModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[200] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-10 w-[600px] border border-slate-200 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Content Refinery</h3>
                                <p className="text-slate-500 font-medium">Instruction the engine to rebuild this section</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full border-2 border-slate-100 rounded-2xl p-6 min-h-[150px] text-lg text-slate-800 focus:border-purple-500 outline-none transition-all placeholder-slate-300"
                            placeholder="e.g., 'Rewrite the history to include more relevant cues for a heart failure case'..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => { setShowAiModal(false); setAiPrompt(''); }}
                                className="px-8 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleAiRewrite}
                                disabled={isAiWorking}
                                className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-purple-700 shadow-xl shadow-purple-600/30 transition-all hover:-translate-y-1"
                            >
                                {isAiWorking ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                Execute Transformation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
