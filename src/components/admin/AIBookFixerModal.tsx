import React, { useState, useRef, useEffect } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import {
    Save, Wand2, RefreshCcw, X, Sparkles, Layout, BrainCircuit,
    Settings, ShieldCheck, Trash2, Plus, Check, ImageIcon,
    Table as TableIcon, Box, Activity, FlaskConical, Stethoscope,
    ClipboardList, FileSearch, ArrowRight, Type, ImagePlus
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
    const [activeSection, setActiveSection] = useState<'clinical' | 'question' | 'rationale' | 'metadata'>('clinical');
    const [subSection, setSubSection] = useState<string>('notes');
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

    // --- RICH CONTENT INSERTION ---
    const insertRichContent = (type: 'image' | 'box' | 'table') => {
        if (!editingField) {
            alert("Select a text area first (Double-click to edit) before adding rich content.");
            return;
        }

        let snippet = '';
        if (type === 'image') snippet = '\n\n![Image Placeholder](https://via.placeholder.com/600x400?text=Clinical+Finding)\n\n';
        if (type === 'box') snippet = '\n\n:::info-box\n**Clinical Alert:** Insert important notice here.\n:::\n\n';
        if (type === 'table') snippet = '\n\n| Assessment | Finding |\n| :--- | :--- |\n| Body System | Normal/Abnormal |\n\n';

        // Get current value
        const updated = JSON.parse(JSON.stringify(liveItem));
        const keys = editingField.split('.');
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];

        const currentValue = obj[keys[keys.length - 1]] || '';
        obj[keys[keys.length - 1]] = currentValue + snippet;
        setLiveItem(updated);
    };

    // --- EDITABLE COMPONENT ---
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
                    rows={6}
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
                className={`cursor-pointer hover:bg-yellow-100 hover:ring-2 hover:ring-yellow-400 rounded px-1 transition-all ${className} ${!value ? 'text-gray-300 italic' : ''}`}
            >
                {value || placeholder}
            </div>
        );
    };

    // ========== RENDER: CLINICAL AREA ==========
    const renderClinicalArea = () => {
        const ehrTabs = [
            { id: 'notes', label: 'Notes', icon: <ClipboardList size={16} /> },
            { id: 'vitals', label: 'Vitals', icon: <Activity size={16} /> },
            { id: 'labs', label: 'Labs', icon: <FlaskConical size={16} /> },
            { id: 'orders', label: 'Orders', icon: <ArrowRight size={16} /> },
            { id: 'hp', label: 'H&P', icon: <Stethoscope size={16} /> },
            { id: 'radiology', label: 'Imaging', icon: <FileSearch size={16} /> },
        ];

        return (
            <div className="space-y-6">
                {/* EHR Header */}
                <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-xl border border-slate-700">
                    <div className="bg-blue-600 p-4 font-black flex justify-between items-center text-xs tracking-tighter uppercase">
                        <span>Patient: <EditableField value={liveItem.content.clinicalData?.patientInfo?.name || 'A. Patient'} path="content.clinicalData.patientInfo.name" className="text-white inline" /></span>
                        <span>DOB: <EditableField value={liveItem.content.clinicalData?.patientInfo?.age || 'XX/XX/XXXX'} path="content.clinicalData.patientInfo.age" className="text-white inline" /></span>
                        <span className="bg-white/20 px-2 py-0.5 rounded">ID: {liveItem.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex bg-slate-800 border-t border-slate-700">
                        {ehrTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSubSection(tab.id)}
                                className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all ${subSection === tab.id ? 'bg-slate-900 border-b-2 border-blue-400 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub-Section Content */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                            {ehrTabs.find(t => t.id === subSection)?.icon}
                            {ehrTabs.find(t => t.id === subSection)?.label}
                        </h3>
                        <button
                            onClick={() => { setEditingField(`content.clinicalData.${subSection === 'notes' ? 'history' : subSection}`); setShowAiModal(true); }}
                            className="text-[10px] bg-purple-600 text-white px-4 py-2 rounded-xl font-black hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                        >
                            AI TRANSFORMATION
                        </button>
                    </div>

                    {subSection === 'notes' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.history || ''}
                            path="content.clinicalData.history"
                            multiline
                            className="text-slate-700 leading-relaxed font-serif text-lg"
                            placeholder="Enter clinical notes and history..."
                        />
                    )}
                    {subSection === 'vitals' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.vitals || ''}
                            path="content.clinicalData.vitals"
                            multiline
                            className="text-slate-700 leading-relaxed font-mono"
                            placeholder="Enter vital signs data..."
                        />
                    )}
                    {subSection === 'labs' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.labs || ''}
                            path="content.clinicalData.labs"
                            multiline
                            className="text-slate-700 leading-relaxed font-mono"
                            placeholder="Enter laboratory results..."
                        />
                    )}
                    {subSection === 'orders' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.orders || ''}
                            path="content.clinicalData.orders"
                            multiline
                            className="text-slate-700 leading-relaxed font-mono"
                            placeholder="Enter provider orders..."
                        />
                    )}
                    {subSection === 'hp' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.hp || ''}
                            path="content.clinicalData.hp"
                            multiline
                            className="text-slate-700 leading-relaxed"
                            placeholder="Enter History & Physical data..."
                        />
                    )}
                    {subSection === 'radiology' && (
                        <EditableField
                            value={liveItem.content.clinicalData?.radiology || ''}
                            path="content.clinicalData.radiology"
                            multiline
                            className="text-slate-700 leading-relaxed"
                            placeholder="Enter radiology findings..."
                        />
                    )}
                </div>
            </div>
        );
    };

    // ========== RENDER: QUESTION AREA ==========
    const renderQuestionArea = () => {
        const options = liveItem.content.structure?.options || [];

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 border border-slate-200">
                    <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Selected Item Stem</h3>
                    <EditableField
                        value={liveItem.content.structure?.prompt || ''}
                        path="content.structure.prompt"
                        multiline
                        className="text-2xl font-black text-slate-900 leading-tight"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {options.map((opt: any, idx: number) => (
                        <div key={idx} className={`p-6 rounded-xl border-2 transition-all flex gap-4 ${opt.isCorrect ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white'}`}>
                            <button
                                onClick={() => {
                                    const newOpts = [...options];
                                    newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
                                    updateField('content.structure.options', newOpts);
                                }}
                                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'border-slate-200 text-transparent'}`}
                            >
                                <Check size={16} />
                            </button>
                            <div className="flex-1">
                                <EditableField
                                    value={opt.text}
                                    path={`content.structure.options.${idx}.text`}
                                    className="font-black text-slate-800"
                                />
                                <div className="mt-2 pt-2 border-t border-slate-100 opacity-50 italic text-xs">
                                    Rationale: <EditableField value={opt.rationale || ''} path={`content.structure.options.${idx}.rationale`} className="inline" />
                                </div>
                            </div>
                            <button
                                onClick={() => updateField('content.structure.options', options.filter((_: any, i: number) => i !== idx))}
                                className="text-red-300 hover:text-red-600 px-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => updateField('content.structure.options', [...options, { text: 'New Distractor', isCorrect: false }])}
                        className="border-4 border-dashed border-slate-100 p-4 rounded-xl text-slate-300 font-black uppercase hover:border-blue-200 hover:text-blue-400 transition-all"
                    >
                        + ADD OPTION
                    </button>
                </div>
            </div>
        );
    };

    // ========== RENDER: RATIONALE AREA ==========
    const renderRationaleArea = () => {
        const rationaleSections = [
            { id: 'review', label: 'Option Review', icon: <ClipboardList size={16} /> },
            { id: 'logic', label: 'Clinical Logic', icon: <BrainCircuit size={16} /> },
            { id: 'strategy', label: 'Strategy', icon: <Settings size={16} /> },
            { id: 'knowledge', label: 'Knowledge', icon: <FlaskConical size={16} /> },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl">
                    <div className="flex bg-slate-800">
                        {rationaleSections.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSubSection(tab.id === 'review' ? 'notes' : tab.id)} // Reset subSection if needed
                                className={`flex-1 py-4 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${subSection === tab.id ? 'bg-slate-900 text-white border-b-2 border-teal-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-slate-200 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                            Clinical Reasoning Protocol
                        </h3>
                        <button className="text-[10px] bg-teal-600 text-white px-4 py-2 rounded-xl font-black">AI REASONING SYNC</button>
                    </div>

                    <EditableField
                        value={(liveItem.pedagogy as any)?.rationale || ''}
                        path="pedagogy.rationale"
                        multiline
                        className="text-slate-700 text-lg leading-relaxed"
                        placeholder="Define the core clinical reasoning and remediation logic here..."
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans h-screen">
            {/* TOP BAR / RICH TOOLBAR */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center z-[110]">
                <div className="flex items-center gap-6">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Wand2 size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none">AI BookFixer™ 4.0</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Universal Visual Editorial Suite</p>
                    </div>
                </div>

                {/* RICH TOOLBAR */}
                <div className="flex bg-slate-900 p-1.5 rounded-2xl shadow-xl border border-slate-800 gap-1">
                    <button onClick={() => insertRichContent('image')} className="p-2.5 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner" title="Point and Add Image"><ImagePlus size={20} /></button>
                    <button onClick={() => insertRichContent('table')} className="p-2.5 rounded-xl text-slate-400 hover:bg-teal-600 hover:text-white transition-all" title="Add Table Structure"><TableIcon size={20} /></button>
                    <button onClick={() => insertRichContent('box')} className="p-2.5 rounded-xl text-slate-400 hover:bg-orange-600 hover:text-white transition-all" title="Add Information Box"><Box size={20} /></button>
                    <div className="w-px h-10 bg-slate-800 mx-2" />
                    <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-500 shadow-lg shadow-green-600/20 active:translate-y-0.5 transition-all outline-none">SAVE ALL DATA</button>
                    <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:bg-red-600 hover:text-white transition-all"><X size={20} /></button>
                </div>
            </div>

            {/* MAIN APP ENGINE */}
            <div className="flex-1 flex overflow-hidden">
                {/* 4 STAGES SIDEBAR */}
                <div className="w-72 bg-slate-50 p-6 flex flex-col gap-4 border-r border-slate-200">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Editor Protocol</div>

                    <button onClick={() => setActiveSection('clinical')} className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${activeSection === 'clinical' ? 'bg-white shadow-2xl border-2 border-blue-100 text-blue-600 scale-105' : 'text-slate-400 hover:bg-white'}`}>
                        <Layout className={activeSection === 'clinical' ? 'text-blue-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Clinical Record</div>
                            <div className="text-[10px] opacity-60">Chart, Tabs, Labs</div>
                        </div>
                    </button>

                    <button onClick={() => setActiveSection('question')} className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${activeSection === 'question' ? 'bg-white shadow-2xl border-2 border-indigo-100 text-indigo-600 scale-105' : 'text-slate-400 hover:bg-white'}`}>
                        <BrainCircuit className={activeSection === 'question' ? 'text-indigo-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Question Structure</div>
                            <div className="text-[10px] opacity-60">Stem, Options, Keys</div>
                        </div>
                    </button>

                    <button onClick={() => setActiveSection('rationale')} className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${activeSection === 'rationale' ? 'bg-white shadow-2xl border-2 border-teal-100 text-teal-600 scale-105' : 'text-slate-400 hover:bg-white'}`}>
                        <Activity className={activeSection === 'rationale' ? 'text-teal-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Clinical Logic</div>
                            <div className="text-[10px] opacity-60">Rationales, Strategy</div>
                        </div>
                    </button>

                    <button onClick={() => setActiveSection('metadata')} className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${activeSection === 'metadata' ? 'bg-white shadow-2xl border-2 border-orange-100 text-orange-600 scale-105' : 'text-slate-400 hover:bg-white'}`}>
                        <Settings className={activeSection === 'metadata' ? 'text-orange-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Item Meta</div>
                            <div className="text-[10px] opacity-60">Difficulty, Topics</div>
                        </div>
                    </button>

                    <div className="flex-1" />
                    <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group active:scale-95 transition-all">
                        <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20" />
                        <div className="text-[10px] font-black uppercase tracking-widest mb-1">Full AI Rebuild</div>
                        <h4 className="text-lg font-black leading-tight">Rewrite Entire Item</h4>
                        <button onClick={() => { setEditingField('fullItem'); setShowAiModal(true); }} className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase">ACTIVATE</button>
                    </div>
                </div>

                {/* EDIT Canvas */}
                <div className="flex-1 bg-white p-12 overflow-auto">
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        {activeSection === 'clinical' && renderClinicalArea()}
                        {activeSection === 'question' && renderQuestionArea()}
                        {activeSection === 'rationale' && renderRationaleArea()}
                        {activeSection === 'metadata' && (
                            <div className="space-y-8">
                                <div className="bg-slate-900 text-white rounded-[2rem] p-10 shadow-2xl border border-slate-800">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10">Administrative Metadata</h3>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-600 uppercase mb-4 block">Item Difficulty</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                    <button key={lvl} onClick={() => updateField('pedagogy.difficultyLevel', lvl)} className={`flex-1 py-6 rounded-2xl font-black text-xl transition-all ${liveItem.pedagogy?.difficultyLevel === lvl ? 'bg-orange-500 text-white shadow-2xl scale-110' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>{lvl}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-600 uppercase mb-4 block">Clinical Focus</label>
                                            <EditableField value={liveItem.pedagogy?.clinicalFocus || 'Standard Evaluation'} path="pedagogy.clinicalFocus" className="bg-slate-800 p-4 rounded-2xl text-cyan-400 font-black border border-slate-700 h-[72px] flex items-center" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI SYSTEM MODAL */}
            {showAiModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-10">
                    <div className="bg-white rounded-[4rem] shadow-2xl p-16 w-full max-w-2xl border-8 border-slate-50 relative animate-in zoom-in-95 duration-500">
                        <div className="absolute top-10 right-10 text-slate-100 font-black text-9xl select-none">AI</div>
                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="bg-purple-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-600/40">
                                <Sparkles size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Content Neural Engine</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Generating optimized NCLEX curriculum data</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] p-10 min-h-[250px] text-2xl text-slate-800 focus:border-purple-600 outline-none transition-all placeholder:text-slate-200 font-black select-all mb-10 relative z-10"
                            placeholder="INSTRUCT THE NEURAL ENGINE..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-between items-center relative z-10">
                            <button onClick={() => setShowAiModal(false)} className="px-10 py-5 text-slate-300 font-black uppercase text-xs tracking-widest hover:text-slate-900 transition-all">Abort Sequence</button>
                            <button
                                onClick={handleAiRewrite}
                                disabled={isAiWorking}
                                className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center gap-4 hover:shadow-2xl hover:bg-black transition-all group overflow-hidden"
                            >
                                {isAiWorking ? <RefreshCcw className="animate-spin" size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                                <span>EXECUTE PAYLOAD</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
