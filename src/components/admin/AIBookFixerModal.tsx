import React, { useState, useRef } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import {
    Save, Wand2, RefreshCcw, Layout, BrainCircuit, Check, X, Plus, Trash2,
    Edit3, Settings, Image as ImageIcon, MousePointer2, Type, List, Sparkles
} from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { magicFixItem } from '../../services/geminiService';
import { DataSanitizer } from '../../utils/DataSanitizer';

interface AIBookFixerModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

type EditMode = 'select' | 'edit' | 'delete' | 'add' | 'ai';
type ActiveSection = 'scenario' | 'question' | 'rationale' | 'config';

export const AIBookFixerModal: React.FC<AIBookFixerModalProps> = ({ item, onClose, onSuccess }) => {
    const [liveItem, setLiveItem] = useState<MasterQuestionItem>(JSON.parse(JSON.stringify(item)));
    const [editMode, setEditMode] = useState<EditMode>('edit');
    const [activeSection, setActiveSection] = useState<ActiveSection>('scenario');
    const [isSaving, setIsSaving] = useState(false);
    const [isAiWorking, setIsAiWorking] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiInput, setShowAiInput] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    // --- SAVE HANDLER ---
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

    // --- AI REWRITE HANDLER ---
    const handleAiRewrite = async (field: string, currentValue: string) => {
        if (!aiPrompt.trim()) {
            alert('Please enter an instruction for the AI');
            return;
        }
        setIsAiWorking(true);
        try {
            const prompt = `
            TASK: Rewrite the following content based on the instruction.
            FIELD: ${field}
            CURRENT CONTENT: "${currentValue}"
            INSTRUCTION: ${aiPrompt}
            
            Return ONLY the rewritten text, nothing else.
            `;

            const result = await magicFixItem(liveItem, prompt);
            // Extract the rewritten field from result
            const newValue = (result as any)[field] || (result.content as any)?.[field] || currentValue;

            // Update the specific field
            updateField(field, newValue);
            setShowAiInput(false);
            setAiPrompt('');
        } catch (e: any) {
            alert('AI Error: ' + e.message);
        } finally {
            setIsAiWorking(false);
        }
    };

    // --- FIELD UPDATER ---
    const updateField = (path: string, value: any) => {
        const updated = { ...liveItem };
        const keys = path.split('.');
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        setLiveItem(updated);
    };

    // --- OPTION HANDLERS ---
    const addOption = () => {
        const options = liveItem.content.structure?.options || [];
        const newOpts = [...options, { id: crypto.randomUUID(), text: 'New Option', isCorrect: false }];
        updateField('content.structure.options', newOpts);
    };

    const removeOption = (idx: number) => {
        const options = liveItem.content.structure?.options || [];
        updateField('content.structure.options', options.filter((_: any, i: number) => i !== idx));
    };

    const updateOption = (idx: number, field: string, value: any) => {
        const options = [...(liveItem.content.structure?.options || [])];
        options[idx] = { ...options[idx], [field]: value };
        updateField('content.structure.options', options);
    };

    // --- EDITABLE TEXT COMPONENT ---
    const EditableText = ({ value, onChange, multiline = false, className = '', placeholder = 'Click to edit...' }: any) => {
        const [isEditing, setIsEditing] = useState(false);
        const [localValue, setLocalValue] = useState(value);
        const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

        const handleBlur = () => {
            setIsEditing(false);
            if (localValue !== value) {
                onChange(localValue);
            }
        };

        const handleDoubleClick = () => {
            if (editMode === 'edit') {
                setIsEditing(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
        };

        if (isEditing) {
            return multiline ? (
                <textarea
                    ref={inputRef as any}
                    className={`w-full p-2 border-2 border-blue-500 rounded bg-white focus:outline-none ${className}`}
                    value={localValue}
                    onChange={e => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={e => { if (e.key === 'Escape') handleBlur(); }}
                    rows={4}
                />
            ) : (
                <input
                    ref={inputRef as any}
                    type="text"
                    className={`w-full p-2 border-2 border-blue-500 rounded bg-white focus:outline-none ${className}`}
                    value={localValue}
                    onChange={e => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') handleBlur(); }}
                />
            );
        }

        return (
            <div
                onDoubleClick={handleDoubleClick}
                className={`cursor-pointer hover:bg-yellow-100 hover:outline hover:outline-2 hover:outline-yellow-400 rounded p-1 transition-all ${className} ${!value ? 'text-gray-400 italic' : ''}`}
                title="Double-click to edit"
            >
                {value || placeholder}
            </div>
        );
    };

    // --- RENDER SECTION: SCENARIO ---
    const renderScenarioSection = () => {
        const patientInfo = liveItem.content.clinicalData?.patientInfo || {};
        const history = liveItem.content.clinicalData?.history || '';

        return (
            <div className="space-y-6">
                <div className="bg-slate-900 text-white p-4 rounded-lg">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500">Age/Gender</label>
                            <EditableText
                                value={patientInfo.age || ''}
                                onChange={(v: string) => updateField('content.clinicalData.patientInfo.age', v)}
                                className="text-white font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Diagnosis</label>
                            <EditableText
                                value={patientInfo.diagnosis || ''}
                                onChange={(v: string) => updateField('content.clinicalData.patientInfo.diagnosis', v)}
                                className="text-white font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Allergies</label>
                            <EditableText
                                value={patientInfo.allergies || ''}
                                onChange={(v: string) => updateField('content.clinicalData.patientInfo.allergies', v)}
                                className="text-white font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Room/Location</label>
                            <EditableText
                                value={patientInfo.room || ''}
                                onChange={(v: string) => updateField('content.clinicalData.patientInfo.room', v)}
                                className="text-white font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-700">Nurses Notes / History</h3>
                        <button
                            onClick={() => { setSelectedField('content.clinicalData.history'); setShowAiInput(true); }}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
                        >
                            <Sparkles size={12} /> AI Rewrite
                        </button>
                    </div>
                    <EditableText
                        value={typeof history === 'string' ? history : JSON.stringify(history)}
                        onChange={(v: string) => updateField('content.clinicalData.history', v)}
                        multiline={true}
                        className="bg-white border border-slate-200 rounded-lg p-4 min-h-[200px] text-sm"
                    />
                </div>
            </div>
        );
    };

    // --- RENDER SECTION: QUESTION ---
    const renderQuestionSection = () => {
        const options = liveItem.content.structure?.options || [];
        const prompt = liveItem.content.structure?.prompt || '';

        return (
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-700">Question Stem</h3>
                        <button
                            onClick={() => { setSelectedField('content.structure.prompt'); setShowAiInput(true); }}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
                        >
                            <Sparkles size={12} /> AI Rewrite
                        </button>
                    </div>
                    <EditableText
                        value={prompt}
                        onChange={(v: string) => updateField('content.structure.prompt', v)}
                        multiline={true}
                        className="bg-white border border-slate-200 rounded-lg p-4 min-h-[100px] text-lg font-medium"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-700">Answer Options</h3>
                        <button onClick={addOption} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-200">
                            <Plus size={12} /> Add Option
                        </button>
                    </div>

                    <div className="space-y-3">
                        {options.map((opt: any, idx: number) => (
                            <div key={opt.id || idx} className="flex gap-3 items-start bg-white border border-slate-200 rounded-lg p-3 group hover:border-blue-300 transition-all">
                                <button
                                    onClick={() => updateOption(idx, 'isCorrect', !opt.isCorrect)}
                                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-slate-300 hover:border-green-400'}`}
                                    title={opt.isCorrect ? 'Correct Answer' : 'Click to mark as correct'}
                                >
                                    {opt.isCorrect && <Check size={14} />}
                                </button>
                                <div className="flex-1">
                                    <EditableText
                                        value={opt.text}
                                        onChange={(v: string) => updateOption(idx, 'text', v)}
                                        className="font-medium"
                                    />
                                    <EditableText
                                        value={opt.rationale || ''}
                                        onChange={(v: string) => updateOption(idx, 'rationale', v)}
                                        placeholder="Add rationale for this option..."
                                        className="text-xs text-slate-500 mt-1"
                                    />
                                </div>
                                <button
                                    onClick={() => removeOption(idx)}
                                    className="p-1 text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete option"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER SECTION: RATIONALE ---
    const renderRationaleSection = () => {
        const rationale = (liveItem.pedagogy as any)?.rationale || (liveItem as any).rationale || '';

        return (
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-700">Global Rationale</h3>
                        <button
                            onClick={() => { setSelectedField('pedagogy.rationale'); setShowAiInput(true); }}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
                        >
                            <Sparkles size={12} /> AI Generate
                        </button>
                    </div>
                    <EditableText
                        value={rationale}
                        onChange={(v: string) => updateField('pedagogy.rationale', v)}
                        multiline={true}
                        className="bg-white border border-slate-200 rounded-lg p-4 min-h-[200px]"
                        placeholder="Write the explanation for the correct answer..."
                    />
                </div>
            </div>
        );
    };

    // --- RENDER SECTION: CONFIG ---
    const renderConfigSection = () => {
        return (
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl text-white">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Difficulty & Topics</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-slate-500 block mb-2">Difficulty Level (1-5)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => updateField('pedagogy.difficultyLevel', lvl)}
                                        className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${liveItem.pedagogy?.difficultyLevel === lvl ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-2">Clinical Topic</label>
                            <EditableText
                                value={liveItem.pedagogy?.clinicalFocus || ''}
                                onChange={(v: string) => updateField('pedagogy.clinicalFocus', v)}
                                className="text-white font-bold bg-slate-800 rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                    <h3 className="font-bold text-slate-700 mb-3">Item Metadata</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="text-xs text-slate-500">Item ID</label>
                            <div className="font-mono text-slate-600">{liveItem.id}</div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Type</label>
                            <div className="font-bold">{(liveItem as any).typeId || 'unknown'}</div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Status</label>
                            <select
                                className="w-full border rounded p-1"
                                value={liveItem.metadata?.status || 'draft'}
                                onChange={e => updateField('metadata.status', e.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col">
            {/* TOP HEADER */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                        <Wand2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">AI BookFixer™</h1>
                        <span className="text-xs text-slate-500">Double-click any text to edit • Changes are live</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all"
                    >
                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT SIDEBAR - 4 AREAS OF POWER */}
                <div className="w-64 bg-slate-900 p-4 flex flex-col gap-2">
                    <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">4 Areas of Power</div>

                    <button
                        onClick={() => setActiveSection('scenario')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeSection === 'scenario' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Layout size={20} />
                        <div>
                            <div className="font-bold text-sm">Clinical Scenario</div>
                            <div className="text-xs opacity-70">Patient info, notes, vitals</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection('question')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeSection === 'question' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <BrainCircuit size={20} />
                        <div>
                            <div className="font-bold text-sm">Question & Options</div>
                            <div className="text-xs opacity-70">Stem, choices, answers</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection('rationale')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeSection === 'rationale' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Check size={20} />
                        <div>
                            <div className="font-bold text-sm">Rationale</div>
                            <div className="text-xs opacity-70">Explanations, feedback</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection('config')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeSection === 'config' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Settings size={20} />
                        <div>
                            <div className="font-bold text-sm">Config & Stats</div>
                            <div className="text-xs opacity-70">Difficulty, topic, status</div>
                        </div>
                    </button>

                    <div className="flex-1"></div>

                    {/* TOOL MODE SELECTOR */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                        <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Edit Mode</div>
                        <div className="flex flex-wrap gap-1">
                            <button
                                onClick={() => setEditMode('edit')}
                                className={`p-2 rounded ${editMode === 'edit' ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                title="Edit Mode"
                            >
                                <Type size={16} />
                            </button>
                            <button
                                onClick={() => setEditMode('add')}
                                className={`p-2 rounded ${editMode === 'add' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                title="Add Mode"
                            >
                                <Plus size={16} />
                            </button>
                            <button
                                onClick={() => setEditMode('delete')}
                                className={`p-2 rounded ${editMode === 'delete' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                title="Delete Mode"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={() => setEditMode('ai')}
                                className={`p-2 rounded ${editMode === 'ai' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                title="AI Mode"
                            >
                                <Sparkles size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT EDITOR CANVAS */}
                <div className="flex-1 overflow-auto p-8 bg-slate-50">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 min-h-[600px]">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 pb-4 border-b">
                            <span className="font-mono">{liveItem.id.substring(0, 8)}...</span>
                            <span>/</span>
                            <span className="font-bold uppercase text-slate-600">{activeSection}</span>
                        </div>

                        {activeSection === 'scenario' && renderScenarioSection()}
                        {activeSection === 'question' && renderQuestionSection()}
                        {activeSection === 'rationale' && renderRationaleSection()}
                        {activeSection === 'config' && renderConfigSection()}
                    </div>
                </div>
            </div>

            {/* AI INPUT MODAL */}
            {showAiInput && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110]">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-[500px] animate-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Sparkles className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">AI Rewrite</h3>
                                <p className="text-sm text-slate-500">Tell the AI how to improve this content</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full border border-slate-200 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Make it more challenging, Add more clinical details, Simplify the language..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => { setShowAiInput(false); setAiPrompt(''); }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => selectedField && handleAiRewrite(selectedField, '')}
                                disabled={isAiWorking}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700"
                            >
                                {isAiWorking ? <RefreshCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                Rewrite with AI
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
