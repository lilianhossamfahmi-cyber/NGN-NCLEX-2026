import React, { useState, useEffect } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { X, Save, Wand2, Image as ImageIcon, Trash2, Plus, Layout, RefreshCcw, Check, BrainCircuit } from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { magicFixItem } from '../../services/geminiService';

// Reusing UI components for consistency
import { DataSanitizer } from '../../utils/DataSanitizer';

// Types for the Editor
interface AIBookFixerModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

type EditSection = 'scenario' | 'question' | 'rationale' | 'metadata';

export const AIBookFixerModal: React.FC<AIBookFixerModalProps> = ({ item, onClose, onSuccess }) => {
    const [editItem, setEditItem] = useState<MasterQuestionItem>(JSON.parse(JSON.stringify(item)));
    const [activeSection, setActiveSection] = useState<EditSection>('scenario');
    const [isSaving, setIsSaving] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiPanel, setShowAiPanel] = useState(false);

    // --- AI ACTIONS ---
    const handleAiAction = async (action: string) => {
        setAiThinking(true);
        try {
            const prompt = `
            TASK: Perform the following edit on the item.
            ACTION: ${action}
            USER INSTRUCTION: ${aiPrompt}
            
            Retain all other data. Return the full updated JSON.
            `;

            const updated = await magicFixItem(editItem, prompt);

            // Merge logic similar to StudentPreviewModal
            const merged = {
                ...editItem,
                ...updated,
                content: { ...editItem.content, ...(updated.content || {}) },
                metadata: { ...editItem.metadata, ...(updated.metadata || {}) }
            };

            setEditItem(merged);
            setAiPrompt('');
            alert('AI Update Complete! Review changes.');
        } catch (e: any) {
            alert('AI Error: ' + e.message);
        } finally {
            setAiThinking(false);
        }
    };

    // --- CRUD ACTIONS ---
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateItem(editItem);
            await syncItemToSupabase(editItem);
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

    // --- RENDERERS FOR EDITABLE SECTIONS ---

    // 1. SCENARIO EDITOR (Tabs)
    const renderScenarioEditor = () => {
        const history = (editItem.content.clinicalData as any)?._structuredHistory ||
            DataSanitizer.sanitizeNursesNotes(editItem.content.clinicalData?.history || '');

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Layout /> Clinical Scenario Editor</h3>
                    <div className="flex gap-2">
                        <button onClick={() => handleAiAction("Rewrite the nurses notes to be more challenging")} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1"><Wand2 size={12} /> Enhance Notes</button>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="border p-4 rounded bg-slate-50 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Patient Age/Gender</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={editItem.content.clinicalData?.patientInfo?.age || ''}
                            onChange={e => {
                                const updated = { ...editItem };
                                if (!updated.content.clinicalData) updated.content.clinicalData = {};
                                if (!updated.content.clinicalData.patientInfo) updated.content.clinicalData.patientInfo = {};
                                updated.content.clinicalData.patientInfo.age = e.target.value;
                                setEditItem(updated);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Diagnosis</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={editItem.content.clinicalData?.patientInfo?.diagnosis || ''}
                            onChange={e => {
                                const updated = { ...editItem };
                                if (!updated.content.clinicalData) updated.content.clinicalData = {};
                                if (!updated.content.clinicalData.patientInfo) updated.content.clinicalData.patientInfo = {};
                                updated.content.clinicalData.patientInfo.diagnosis = e.target.value;
                                setEditItem(updated);
                            }}
                        />
                    </div>
                </div>

                {/* Raw JSON Editor fallback for Tabs (for now, to ensure power) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Raw Clinical Data (JSON)</label>
                    <textarea
                        className="w-full h-96 font-mono text-sm border p-4 rounded focus:ring-2 focus:ring-blue-500"
                        value={JSON.stringify(editItem.content.clinicalData, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setEditItem({ ...editItem, content: { ...editItem.content, clinicalData: parsed } });
                            } catch (err) {
                                // invalid json ignore
                            }
                        }}
                    />
                    <p className="text-xs text-gray-400 mt-1">Edit the JSON directly to modify specific fields like history, vitals, labs, etc.</p>
                </div>
            </div>
        );
    };

    // 2. QUESTION EDITOR
    const renderQuestionEditor = () => {
        const type = (editItem as any).typeId || 'multiple-choice';
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><BrainCircuit /> Question & Options</h3>
                    <div className="flex gap-2">
                        <button onClick={() => handleAiAction("Rewrite prompt for clarity")} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1"><Wand2 size={12} /> Fix Grammar</button>
                        <button onClick={() => handleAiAction("Generate new distractors")} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1"><RefreshCcw size={12} /> New Options</button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Items Question Prompt</label>
                    <textarea
                        className="w-full border p-3 rounded shadow-sm text-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        value={editItem.content.structure?.prompt || ''}
                        onChange={e => {
                            setEditItem({
                                ...editItem,
                                content: {
                                    ...editItem.content,
                                    structure: { ...editItem.content.structure, prompt: e.target.value }
                                }
                            });
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Answer Options</label>
                    <div className="space-y-2">
                        {editItem.content.structure?.options?.map((opt: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-start group">
                                <button
                                    onClick={() => {
                                        const newOpts = [...(editItem.content.structure?.options || [])];
                                        newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
                                        setEditItem({ ...editItem, content: { ...editItem.content, structure: { ...editItem.content.structure, options: newOpts } } });
                                    }}
                                    className={`mt-3 w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300'}`}
                                >
                                    {opt.isCorrect && <Check size={12} />}
                                </button>
                                <div className="flex-1">
                                    <input
                                        className="w-full border p-2 rounded mb-1"
                                        value={opt.text}
                                        onChange={e => {
                                            const newOpts = [...(editItem.content.structure?.options || [])];
                                            newOpts[idx].text = e.target.value;
                                            setEditItem({ ...editItem, content: { ...editItem.content, structure: { ...editItem.content.structure, options: newOpts } } });
                                        }}
                                    />
                                    <input
                                        className="w-full border p-1 rounded text-xs text-gray-500 bg-gray-50"
                                        placeholder="Rationale for this option..."
                                        value={opt.rationale || ''}
                                        onChange={e => {
                                            const newOpts = [...(editItem.content.structure?.options || [])];
                                            newOpts[idx].rationale = e.target.value;
                                            setEditItem({ ...editItem, content: { ...editItem.content, structure: { ...editItem.content.structure, options: newOpts } } });
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const newOpts = (editItem.content.structure?.options || []).filter((_, i) => i !== idx);
                                        setEditItem({ ...editItem, content: { ...editItem.content, structure: { ...editItem.content.structure, options: newOpts } } });
                                    }}
                                    className="p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            const newOpts = [...(editItem.content.structure?.options || []), { id: crypto.randomUUID(), text: 'New Option', isCorrect: false }];
                            setEditItem({ ...editItem, content: { ...editItem.content, structure: { ...editItem.content.structure, options: newOpts } } });
                        }}
                        className="mt-4 text-sm text-blue-600 flex items-center gap-1 font-bold"
                    >
                        <Plus size={16} /> Add Option
                    </button>
                </div>
            </div>
        );
    };

    // 3. RATIONALE EDITOR
    const renderRationaleEditor = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">Rationale & Remediation</h3>
                <div className="flex gap-2">
                    <button onClick={() => handleAiAction("Generate detailed rationale")} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1"><Wand2 size={12} /> Auto-Generate</button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Global Rationale (Overview)</label>
                <textarea
                    className="w-full border p-3 rounded shadow-sm min-h-[150px]"
                    value={(editItem.pedagogy?.rationale || (editItem as any).rationale || '')}
                    onChange={e => {
                        setEditItem({
                            ...editItem,
                            pedagogy: { ...editItem.pedagogy, rationale: e.target.value } as any
                        });
                    }}
                />
            </div>
        </div>
    );

    // 4. METADATA EDITOR
    const renderMetadataEditor = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Metadata & Difficulty</h3>

            <div className="bg-slate-900 p-6 rounded-xl text-white">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">Difficulty Level (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            className="bg-slate-800 border border-slate-700 p-2 rounded text-white w-full font-bold text-lg"
                            value={editItem.pedagogy?.difficultyLevel || 1}
                            onChange={e => {
                                setEditItem({
                                    ...editItem,
                                    pedagogy: { ...editItem.pedagogy, difficultyLevel: parseInt(e.target.value) } as any
                                });
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">Clinical Topic</label>
                        <input
                            className="bg-slate-800 border border-slate-700 p-2 rounded text-white w-full"
                            value={editItem.pedagogy?.clinicalFocus || ''}
                            onChange={e => {
                                setEditItem({
                                    ...editItem,
                                    pedagogy: { ...editItem.pedagogy, clinicalFocus: e.target.value } as any
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/95 flex flex-col backdrop-blur-sm animate-in fade-in duration-200">
            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <Wand2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none">AI BookFixer™</h1>
                        <span className="text-xs text-slate-500 font-medium">Ultimate Item Editor</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* AI QUICK PROMPT */}
                    <div className="relative group">
                        <div className="flex items-center bg-purple-50 border border-purple-200 rounded-full px-2 py-1 focus-within:ring-2 ring-purple-500">
                            <BrainCircuit size={16} className="text-purple-600 mx-2" />
                            <input
                                className="bg-transparent border-none outline-none text-sm w-64 text-purple-900 placeholder-purple-300"
                                placeholder="Ask AI to fix anything..."
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleAiAction('manual_prompt') }}
                            />
                            {aiThinking && <RefreshCcw size={16} className="animate-spin text-purple-600 mx-2" />}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2"></div>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 overflow-hidden flex">
                {/* LEFT: PREVIEW/EDIT TABS - The "4 Areas of Power" */}
                <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 gap-2">
                    <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Editor Sections</div>

                    <button
                        onClick={() => setActiveSection('scenario')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeSection === 'scenario' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Layout size={18} />
                        <span className="font-bold text-sm">Clinical Scenario</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('question')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeSection === 'question' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <BrainCircuit size={18} />
                        <span className="font-bold text-sm">Question & Options</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('rationale')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeSection === 'rationale' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Check size={18} />
                        <span className="font-bold text-sm">Rationale</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('metadata')}
                        className={`text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeSection === 'metadata' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <RefreshCcw size={18} />
                        <span className="font-bold text-sm">Stats & Config</span>
                    </button>
                </div>

                {/* RIGHT: EDITOR CANVAS */}
                <div className="flex-1 bg-gray-50 overflow-auto p-8 flex justify-center">
                    <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl min-h-[600px] flex flex-col overflow-hidden">
                        <div className="bg-slate-50 p-6 border-b border-gray-200">
                            {/* BREADCRUMB */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span>{editItem.id.substring(0, 8)}...</span>
                                <span>/</span>
                                <span className="uppercase font-bold">{activeSection}</span>
                            </div>
                        </div>

                        <div className="p-8">
                            {activeSection === 'scenario' && renderScenarioEditor()}
                            {activeSection === 'question' && renderQuestionEditor()}
                            {activeSection === 'rationale' && renderRationaleEditor()}
                            {activeSection === 'metadata' && renderMetadataEditor()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
