import React, { useState } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { Save, Wand2, RefreshCcw, Layout, BrainCircuit, Check, X, Plus, Trash2, Edit3, Settings } from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { magicFixItem } from '../../services/geminiService';
import { StudentPreviewModal } from '../StudentPreviewModal';

// --- VISUAL SUB-EDITORS (No JSON!) ---

const VisualQuestionEditor = ({ item, onUpdate, onClose }: any) => {
    const options = item.content.structure.options || [];

    const updateOption = (idx: number, field: string, val: any) => {
        const newOpts = [...options];
        newOpts[idx] = { ...newOpts[idx], [field]: val };
        onUpdate({ ...item, content: { ...item.content, structure: { ...item.content.structure, options: newOpts } } });
    };

    const addOption = () => {
        const newOpts = [...options, { id: crypto.randomUUID(), text: 'New Option', isCorrect: false }];
        onUpdate({ ...item, content: { ...item.content, structure: { ...item.content.structure, options: newOpts } } });
    };

    const removeOption = (idx: number) => {
        const newOpts = options.filter((_: any, i: number) => i !== idx);
        onUpdate({ ...item, content: { ...item.content, structure: { ...item.content.structure, options: newOpts } } });
    };

    return (
        <div className="absolute top-20 right-20 w-96 bg-white shadow-2xl rounded-xl border border-blue-200 z-50 p-4 animate-in slide-in-from-right-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><BrainCircuit size={18} /> Edit Questions</h3>
                <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
            </div>

            <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Prompt Stem</label>
                <textarea
                    className="w-full border p-2 rounded text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500"
                    value={item.content.structure.prompt}
                    onChange={e => onUpdate({ ...item, content: { ...item.content, structure: { ...item.content.structure, prompt: e.target.value } } })}
                />
            </div>

            <div className="max-h-[300px] overflow-auto space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Options</label>
                {options.map((opt: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start bg-slate-50 p-2 rounded border border-slate-200">
                        <button
                            onClick={() => updateOption(idx, 'isCorrect', !opt.isCorrect)}
                            className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-slate-300'}`}
                        >
                            {opt.isCorrect && <Check size={10} />}
                        </button>
                        <div className="flex-1">
                            <input
                                className="w-full text-sm bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-0 p-0"
                                value={opt.text}
                                onChange={e => updateOption(idx, 'text', e.target.value)}
                            />
                        </div>
                        <button onClick={() => removeOption(idx)} className="text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                ))}
                <button onClick={addOption} className="w-full py-2 border-2 border-dashed border-slate-200 rounded text-slate-400 hover:border-blue-300 hover:text-blue-500 text-xs font-bold flex justify-center items-center gap-1">
                    <Plus size={14} /> Add Option
                </button>
            </div>
        </div>
    );
};

const VisualConfigEditor = ({ item, onUpdate, onClose }: any) => {
    return (
        <div className="absolute bottom-20 left-20 w-80 bg-white shadow-2xl rounded-xl border border-orange-200 z-50 p-4 animate-in slide-in-from-left-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Settings size={18} /> Stats & Config</h3>
                <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Difficulty (1-5)</label>
                    <div className="flex gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => onUpdate({ ...item, pedagogy: { ...item.pedagogy, difficultyLevel: lvl } })}
                                className={`flex-1 py-2 rounded font-bold text-sm ${item.pedagogy.difficultyLevel === lvl ? 'bg-orange-500 text-white shadow' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Clinical Topic</label>
                    <input
                        className="w-full border p-2 rounded text-sm mt-1"
                        value={item.pedagogy.clinicalFocus || ''}
                        onChange={e => onUpdate({ ...item, pedagogy: { ...item.pedagogy, clinicalFocus: e.target.value } })}
                    />
                </div>
            </div>
        </div>
    );
};

export const AIBookFixerModal: React.FC<{ item: MasterQuestionItem, onClose: () => void, onSuccess: () => void }> = ({ item, onClose, onSuccess }) => {
    const [liveItem, setLiveItem] = useState(item);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateItem(liveItem);
            await syncItemToSupabase(liveItem);
            alert('✅ Updates Saved!');
            onSuccess();
            onClose();
        } catch (e) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            {/* 1. THE PREVIEW (Background) */}
            <div className="absolute inset-0 z-0">
                <StudentPreviewModal
                    item={liveItem}
                    onClose={onClose}
                    // @ts-ignore
                    enableAdminEditing={true} // Enables Text Selection "Magic Bubble"
                    onItemChange={setLiveItem}
                />
            </div>

            {/* 2. THE FLOATING "BOOKFIXER HUB" DOCK */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-20 mb-10">

                <div className="flex items-center gap-1 pr-4 border-r border-slate-700 mr-2">
                    <Wand2 className="text-purple-400 ml-3 mr-2" />
                    <span className="text-white font-bold text-sm tracking-wide mr-2">AI BookFixer™</span>
                </div>

                {/* 4 AREAS OF POWER */}
                <button
                    onClick={() => setActiveTool(activeTool === 'scenario' ? null : 'scenario')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:scale-105 ${activeTool === 'scenario' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Layout size={20} />
                    <span className="text-[10px] font-bold uppercase">Scenario</span>
                </button>

                <button
                    onClick={() => setActiveTool(activeTool === 'question' ? null : 'question')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:scale-105 ${activeTool === 'question' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <BrainCircuit size={20} />
                    <span className="text-[10px] font-bold uppercase">Question</span>
                </button>

                <button
                    onClick={() => setActiveTool(activeTool === 'rationale' ? null : 'rationale')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:scale-105 ${activeTool === 'rationale' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Check size={20} />
                    <span className="text-[10px] font-bold uppercase">Rationale</span>
                </button>

                <button
                    onClick={() => setActiveTool(activeTool === 'config' ? null : 'config')}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all hover:scale-105 ${activeTool === 'config' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Settings size={20} />
                    <span className="text-[10px] font-bold uppercase">Config</span>
                </button>

                <div className="w-px h-10 bg-slate-700 mx-2"></div>

                {/* SAVE ACTION */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/50 transition-all hover:scale-105 active:scale-95"
                >
                    {isSaving ? <RefreshCcw className="animate-spin" /> : <Save size={20} />}
                    <span>Save</span>
                </button>
            </div>

            {/* 3. VISUAL EDITOR OVERLAYS */}
            {activeTool === 'question' && (
                <VisualQuestionEditor
                    item={liveItem}
                    onUpdate={setLiveItem}
                    onClose={() => setActiveTool(null)}
                />
            )}
            {activeTool === 'config' && (
                <VisualConfigEditor
                    item={liveItem}
                    onUpdate={setLiveItem}
                    onClose={() => setActiveTool(null)}
                />
            )}

            {/* Hints for other tools */}
            {activeTool === 'scenario' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-xl z-50 animate-bounce">
                    👇 Highlight any text in the chart to Magic Fix it!
                </div>
            )}
        </div>
    );
};
