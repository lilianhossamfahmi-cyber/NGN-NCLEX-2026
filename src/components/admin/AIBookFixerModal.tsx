import React, { useState, useRef, useEffect } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { Save, Wand2, RefreshCcw, X, Sparkles, Edit3, Trash2, Plus, Check } from 'lucide-react';
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
    const [activeScreen, setActiveScreen] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiWorking, setIsAiWorking] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiModal, setShowAiModal] = useState(false);

    // Screen names
    const screens = ['EHR Chart', 'Question', 'Answer Review', 'Rationale'];

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
            const prompt = `Rewrite this field: ${editingField}. Instruction: ${aiPrompt}. Return the full updated item JSON.`;
            const result = await magicFixItem(liveItem, prompt);
            setLiveItem({ ...liveItem, ...result, id: liveItem.id });
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

    // --- EDITABLE COMPONENT ---
    const EditableField = ({ value, path, className = '', multiline = false }: { value: string, path: string, className?: string, multiline?: boolean }) => {
        const [editing, setEditing] = useState(false);
        const [localVal, setLocalVal] = useState(value || '');
        const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

        useEffect(() => { setLocalVal(value || ''); }, [value]);

        const save = () => {
            setEditing(false);
            if (localVal !== value) updateField(path, localVal);
        };

        const startEdit = () => {
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
                    className={`border-2 border-blue-500 rounded p-2 bg-white outline-none w-full ${className}`}
                    rows={4}
                />
            ) : (
                <input
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    onKeyDown={e => e.key === 'Enter' && save()}
                    className={`border-2 border-blue-500 rounded px-2 py-1 bg-white outline-none w-full ${className}`}
                />
            );
        }

        return (
            <span
                onClick={startEdit}
                className={`cursor-pointer hover:bg-yellow-200 hover:outline hover:outline-2 hover:outline-yellow-500 rounded px-1 ${className}`}
                title="Click to edit"
            >
                {value || <span className="text-gray-400 italic">Click to add...</span>}
            </span>
        );
    };

    // ========== SCREEN 1: EHR CHART ==========
    const renderEHRScreen = () => {
        const patientInfo = liveItem.content.clinicalData?.patientInfo || {};
        const notes = DataSanitizer.sanitizeNursesNotes(liveItem.content.clinicalData?.history || '');

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Patient Header - EXACT STYLE from StudentPreview */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                                {(patientInfo.name || 'A')[0]}
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Patient</div>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    <EditableField value={patientInfo.name || 'Client, A.'} path="content.clinicalData.patientInfo.name" className="text-white" />
                                    <span className="text-slate-400">,</span>
                                    <EditableField value={patientInfo.age || '65y M'} path="content.clinicalData.patientInfo.age" className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-600 px-3 py-1 rounded text-sm font-bold">● FULL CODE</div>
                    </div>
                </div>

                {/* Clinical Logistics */}
                <div className="bg-slate-900 text-white p-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-slate-400 text-xs">ADMISSION DATE</div>
                        <EditableField value={patientInfo.admissionDate || '2024-07-10'} path="content.clinicalData.patientInfo.admissionDate" className="font-bold text-white" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">LOCATION</div>
                        <EditableField value={patientInfo.room || 'MedSurg-12'} path="content.clinicalData.patientInfo.room" className="font-bold text-cyan-400" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">ATTENDING PROV.</div>
                        <EditableField value={patientInfo.physician || 'Dr. S. Specialist'} path="content.clinicalData.patientInfo.physician" className="font-bold text-white" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">PRIMARY NURSE</div>
                        <EditableField value={patientInfo.nurse || 'RN Staff'} path="content.clinicalData.patientInfo.nurse" className="font-bold text-white" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">ALLERGIES</div>
                        <EditableField value={patientInfo.allergies || 'NKDA'} path="content.clinicalData.patientInfo.allergies" className="font-bold text-red-400" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs">ISOLATION</div>
                        <EditableField value={patientInfo.isolation || 'Standard Precautions'} path="content.clinicalData.patientInfo.isolation" className="font-bold text-yellow-400" />
                    </div>
                </div>

                {/* Nurses Notes */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Nurses Notes</h3>
                        <button
                            onClick={() => { setEditingField('content.clinicalData.history'); setShowAiModal(true); }}
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200"
                        >
                            <Sparkles size={14} /> AI Rewrite
                        </button>
                    </div>

                    <div className="space-y-4">
                        {notes.map((note: StructuredNote, idx: number) => (
                            <div key={idx} className="flex gap-4 border-l-4 border-blue-400 bg-white rounded-r-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                <div className="text-center flex-shrink-0">
                                    <div className="text-lg font-bold text-slate-700">{note.time.split(':')[0]}</div>
                                    <div className="text-xs text-slate-400">Today</div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                                        {idx === 0 ? 'ADMISSION' : 'PROGRESS'}
                                        <span className="float-right font-mono text-slate-400">{note.initial}</span>
                                    </div>
                                    <div className="text-slate-700" onClick={() => setEditingField(`note_${idx}`)}>
                                        "{note.note}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // ========== SCREEN 2: QUESTION ==========
    const renderQuestionScreen = () => {
        const prompt = liveItem.content.structure?.prompt || '';
        const options = liveItem.content.structure?.options || [];

        const addOption = () => {
            const newOpts = [...options, { id: crypto.randomUUID(), text: 'New option', isCorrect: false }];
            updateField('content.structure.options', newOpts);
        };

        const removeOption = (idx: number) => {
            updateField('content.structure.options', options.filter((_: any, i: number) => i !== idx));
        };

        const toggleCorrect = (idx: number) => {
            const newOpts = [...options];
            newOpts[idx] = { ...newOpts[idx], isCorrect: !newOpts[idx].isCorrect };
            updateField('content.structure.options', newOpts);
        };

        const updateOptionText = (idx: number, text: string) => {
            const newOpts = [...options];
            newOpts[idx] = { ...newOpts[idx], text };
            updateField('content.structure.options', newOpts);
        };

        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Question Stem */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold">?</div>
                            <span className="text-sm font-bold text-slate-500 uppercase">Question Stem</span>
                        </div>
                        <button
                            onClick={() => { setEditingField('content.structure.prompt'); setShowAiModal(true); }}
                            className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                            <Sparkles size={14} /> AI Rewrite
                        </button>
                    </div>
                    <EditableField
                        value={prompt}
                        path="content.structure.prompt"
                        multiline
                        className="text-xl text-slate-800 leading-relaxed block w-full"
                    />
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500 uppercase">Answer Options</span>
                        <button onClick={addOption} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                            <Plus size={14} /> Add Option
                        </button>
                    </div>

                    {options.map((opt: any, idx: number) => (
                        <div
                            key={opt.id || idx}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all group ${opt.isCorrect ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {idx + 1}
                                </span>
                                <button
                                    onClick={() => toggleCorrect(idx)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'border-slate-300 hover:border-green-400'}`}
                                    title={opt.isCorrect ? 'Correct answer' : 'Mark as correct'}
                                >
                                    {opt.isCorrect && <Check size={14} />}
                                </button>
                            </div>
                            <EditableField
                                value={opt.text}
                                path={`option_${idx}`}
                                className="flex-1 text-slate-700"
                            />
                            <button
                                onClick={() => removeOption(idx)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ========== SCREEN 3: ANSWER REVIEW ==========
    const renderAnswerReviewScreen = () => {
        const options = liveItem.content.structure?.options || [];

        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg p-8 text-white">
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-400">65%</div>
                        <div className="text-xs text-green-300 uppercase">PASS</div>
                        <div className="text-xs text-slate-400">Borderline</div>
                    </div>
                    <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400">65<sup>th</sup></div>
                        <div className="text-xs text-purple-300 uppercase">RANK</div>
                        <div className="text-xs text-slate-400">Percentile</div>
                    </div>
                    <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-amber-400">🐇</div>
                        <div className="text-xs text-amber-300 uppercase">PACE</div>
                        <div className="text-xs text-slate-400">Fast 3s</div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-xs text-purple-400 uppercase font-bold mb-2">⚡ ITEM DIFFICULTY</div>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(lvl => (
                            <div key={lvl} className={`flex-1 h-2 rounded ${lvl <= (liveItem.pedagogy?.difficultyLevel || 3) ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500' : 'bg-slate-700'}`} />
                        ))}
                    </div>
                    <div className="text-xl font-bold">
                        Level {liveItem.pedagogy?.difficultyLevel || 3}:
                        <EditableField
                            value={liveItem.pedagogy?.clinicalFocus || 'Clinical Judgment'}
                            path="pedagogy.clinicalFocus"
                            className="text-cyan-400 ml-2"
                        />
                    </div>
                </div>
            </div>
        );
    };

    // ========== SCREEN 4: RATIONALE ==========
    const renderRationaleScreen = () => {
        const rationale = (liveItem.pedagogy as any)?.rationale || (liveItem as any).rationale || '';
        const options = liveItem.content.structure?.options || [];
        const correctOpt = options.find((o: any) => o.isCorrect);

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Tabs */}
                <div className="flex bg-slate-900 text-white">
                    {['Item Overview & Actions', 'Option Review', 'Clinical Logic', 'Strategy', 'Knowledge'].map((tab, idx) => (
                        <button key={tab} className={`flex-1 py-3 text-xs font-bold uppercase ${idx === 0 ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div>
                        <div className="text-xs text-purple-500 uppercase font-bold mb-2">⚡ ITEM DIFFICULTY</div>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => updateField('pedagogy.difficultyLevel', lvl)}
                                    className={`flex-1 h-3 rounded cursor-pointer ${lvl <= (liveItem.pedagogy?.difficultyLevel || 3) ? (lvl <= 2 ? 'bg-green-500' : lvl <= 4 ? 'bg-yellow-500' : 'bg-red-500') : 'bg-slate-200'}`}
                                />
                            ))}
                        </div>
                        <div className="text-lg font-bold text-slate-800">
                            Level {liveItem.pedagogy?.difficultyLevel || 3}: NGN Standard (Analysis)
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Requires analyzing trends and distinguishing relevant cues.</p>
                    </div>

                    {/* Center Column */}
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-2">✦ Recommended Actions</div>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-lg mb-4">
                            <div className="text-xs uppercase font-bold">Primary Focus Area</div>
                            <EditableField
                                value="Clinical Judgment Assessment"
                                path="pedagogy.focusArea"
                                className="text-lg font-bold text-white"
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div><span className="text-slate-400">● IMMEDIATE ACTION</span> Link the key cue to a specific pathology.</div>
                            <div><span className="text-cyan-500">● NEXT STEP</span> Complete 2 similar items at Level 2.</div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div className="bg-slate-900 text-white p-4 rounded-lg">
                            <div className="text-xs uppercase font-bold mb-2">📋 RATIONALE BREAKDOWN</div>
                            <div className="border-l-2 border-purple-500 pl-3 text-sm">
                                <EditableField
                                    value={rationale || '"Accurate evaluation of cues is critical for determining the correct priority. See Option Review for specific details."'}
                                    path="pedagogy.rationale"
                                    multiline
                                    className="text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                            <div className="text-xs text-cyan-700 font-bold uppercase flex items-center gap-1">↔ CLINICAL LINKAGE</div>
                            <p className="text-sm text-slate-600 mt-1">This item required identifying a key finding to determine the priority.</p>
                        </div>

                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="text-xs text-red-700 font-bold uppercase">CLINICAL PEARL</div>
                            <p className="text-sm text-slate-600 mt-1">"Always prioritize patient safety and use systematic clinical reasoning."</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col">
            {/* TOP BAR */}
            <div className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                        <Wand2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">AI BookFixer™</h1>
                        <span className="text-xs text-slate-500">Click any text to edit • Visual editing</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">
                        <X size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg flex items-center gap-2"
                    >
                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save All
                    </button>
                </div>
            </div>

            {/* SCREEN TABS */}
            <div className="bg-white border-b flex justify-center">
                {screens.map((screen, idx) => (
                    <button
                        key={screen}
                        onClick={() => setActiveScreen(idx)}
                        className={`px-8 py-4 font-bold text-sm uppercase transition-all border-b-4 ${activeScreen === idx ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        {idx + 1}. {screen}
                    </button>
                ))}
            </div>

            {/* SCREEN CONTENT */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {activeScreen === 0 && renderEHRScreen()}
                    {activeScreen === 1 && renderQuestionScreen()}
                    {activeScreen === 2 && renderAnswerReviewScreen()}
                    {activeScreen === 3 && renderRationaleScreen()}
                </div>
            </div>

            {/* AI MODAL */}
            {showAiModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110]">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-[500px]">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-purple-600" size={24} />
                            <h3 className="font-bold text-lg">AI Rewrite</h3>
                        </div>
                        <textarea
                            className="w-full border rounded-lg p-3 min-h-[100px]"
                            placeholder="e.g., Make it more challenging..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button
                                onClick={handleAiRewrite}
                                disabled={isAiWorking}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2"
                            >
                                {isAiWorking ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                Rewrite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
