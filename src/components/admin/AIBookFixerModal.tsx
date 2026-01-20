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

export const AIBookFixerModal: React.FC<AIBookFixerModalProps> = ({ item: initialItem, onClose, onSuccess }) => {
    const [liveItem, setLiveItem] = useState<MasterQuestionItem>(JSON.parse(JSON.stringify(initialItem)));
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

        const updated = JSON.parse(JSON.stringify(liveItem));
        const keys = editingField.split('.');
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];

        const currentValue = obj[keys[keys.length - 1]] || '';
        obj[keys[keys.length - 1]] = currentValue + snippet;
        setLiveItem(updated);
    };

    // --- EDITABLE COMPONENT ---
    const EditableField = ({ value, path, className = '', multiline = false, placeholder = '...' }: { value: any, path: string, className?: string, multiline?: boolean, placeholder?: string }) => {
        const [editing, setEditing] = useState(false);
        const [localVal, setLocalVal] = useState('');
        const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

        useEffect(() => {
            if (value === undefined || value === null) {
                setLocalVal('');
            } else if (typeof value === 'object') {
                setLocalVal(JSON.stringify(value, null, 2));
            } else {
                setLocalVal(String(value));
            }
        }, [value]);

        const save = () => {
            setEditing(false);
            let finalValue: any = localVal;
            if (typeof value === 'object') {
                try {
                    finalValue = JSON.parse(localVal);
                } catch (e) {
                    console.error("Invalid JSON input for object field");
                    return;
                }
            }
            if (finalValue !== value) updateField(path, finalValue);
        };

        const startEdit = (e: React.MouseEvent) => {
            e.stopPropagation();
            setEditing(true);
            setEditingField(path);
            setTimeout(() => ref.current?.focus(), 50);
        };

        if (editing) {
            return multiline || typeof value === 'object' ? (
                <textarea
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    className={`border-2 border-blue-500 rounded p-2 bg-white outline-none w-full text-slate-800 ${className}`}
                    rows={typeof value === 'object' ? 10 : 6}
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

        const displayValue = typeof value === 'object' ? 'Click to edit complex data' : String(value || '');

        return (
            <div
                onDoubleClick={startEdit}
                className={`cursor-pointer hover:bg-yellow-100 hover:ring-2 hover:ring-yellow-400 rounded px-1 transition-all ${className} ${!displayValue ? 'text-gray-300 italic' : ''}`}
            >
                {displayValue || placeholder}
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
                <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-xl border border-slate-700">
                    <div className="bg-blue-600 p-4 font-black flex justify-between items-center text-xs tracking-tighter uppercase">
                        <span>Patient: <EditableField value={liveItem.content.clinicalData?.patientInfo?.name} path="content.clinicalData.patientInfo.name" className="text-white inline" /></span>
                        <span>DOB: <EditableField value={liveItem.content.clinicalData?.patientInfo?.age} path="content.clinicalData.patientInfo.age" className="text-white inline" /></span>
                        <span className="bg-white/20 px-2 py-0.5 rounded">ID: {liveItem.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex bg-slate-800 border-t border-slate-700 overflow-x-auto">
                        {ehrTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSubSection(tab.id)}
                                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all whitespace-nowrap ${subSection === tab.id ? 'bg-slate-900 border-b-2 border-blue-400 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

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

                    <EditableField
                        value={liveItem.content.clinicalData?.[subSection === 'notes' ? 'history' : (subSection as keyof typeof liveItem.content.clinicalData)]}
                        path={`content.clinicalData.${subSection === 'notes' ? 'history' : subSection}`}
                        multiline
                        className={`text-slate-700 leading-relaxed ${['vitals', 'labs', 'orders'].includes(subSection) ? 'font-mono' : ''}`}
                        placeholder={`Enter ${subSection} data...`}
                    />
                </div>
            </div>
        );
    };

    // ========== RENDER: QUESTION AREA ==========
    const renderQuestionArea = () => {
        const typeId = (liveItem as any).typeId || 'standard';
        const isBowTie = typeId === 'bowtie';
        const isMatrix = typeId === 'matrix' || typeId === 'matrix_multiple';

        const renderStandardOptions = () => {
            const options = liveItem.content.structure?.options || [];
            return (
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
                                    Rationale: <EditableField value={opt.rationale} path={`content.structure.options.${idx}.rationale`} className="inline" />
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
                        onClick={() => updateField('content.structure.options', [...options, { id: crypto.randomUUID(), text: 'New Distractor', isCorrect: false }])}
                        className="border-4 border-dashed border-slate-100 p-4 rounded-xl text-slate-300 font-black uppercase hover:border-blue-200 hover:text-blue-400 transition-all"
                    >
                        + ADD OPTION
                    </button>
                </div>
            );
        };

        const renderComplexStructure = () => (
            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Complex Structure Editor</h4>
                    <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-black">{typeId}</span>
                </div>
                <EditableField
                    value={liveItem.content.structure}
                    path="content.structure"
                    multiline
                    className="font-mono text-xs bg-slate-950 border-slate-800"
                />
            </div>
        );

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Selected Item Stem / Prompt</h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">TYPE: {typeId}</div>
                        </div>
                    </div>
                    <EditableField
                        value={liveItem.content.structure?.prompt}
                        path="content.structure.prompt"
                        multiline
                        className="text-2xl font-black text-slate-900 leading-tight"
                    />
                </div>

                {isBowTie || isMatrix ? renderComplexStructure() : renderStandardOptions()}
            </div>
        );
    };

    // ========== RENDER: RATIONALE AREA ==========
    const renderRationaleArea = () => {
        const sections = [
            { id: 'rationale', label: 'Option Review', path: 'pedagogy.rationale' },
            { id: 'clinicalLogic', label: 'Clinical Logic', path: 'pedagogy.clinicalLogic' },
            { id: 'strategy', label: 'Strategy', path: 'pedagogy.strategy' },
            { id: 'knowledge', label: 'Knowledge', path: 'pedagogy.knowledge' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700">
                    <div className="flex bg-slate-800 overflow-x-auto">
                        {sections.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSubSection(tab.id)}
                                className={`flex-1 py-4 px-6 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${subSection === tab.id ? 'bg-slate-900 text-white border-b-2 border-teal-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-slate-200 min-h-[400px] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                            {sections.find(s => s.id === subSection)?.label || 'Reasoning Protocol'}
                        </h3>
                        <button className="text-[10px] bg-teal-600 text-white px-4 py-2 rounded-xl font-black shadow-lg shadow-teal-600/20">AI SYNC</button>
                    </div>

                    <EditableField
                        value={subSection === 'notes' ? (liveItem.pedagogy as any)?.rationale : (liveItem.pedagogy as any)?.[subSection]}
                        path={`pedagogy.${subSection === 'notes' ? 'rationale' : subSection}`}
                        multiline
                        className="text-slate-700 text-lg leading-relaxed font-serif"
                        placeholder="Define remediation logic here..."
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans h-screen overflow-hidden">
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center z-[110] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Wand2 size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-slate-900">AI BookFixer™ 4.0</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Type Visual Editorial Suite</p>
                    </div>
                </div>

                <div className="flex bg-slate-900 p-1.5 rounded-2xl shadow-xl border border-slate-800 gap-1 items-center">
                    <button onClick={() => insertRichContent('image')} className="p-2.5 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all" title="Add Image"><ImagePlus size={20} /></button>
                    <button onClick={() => insertRichContent('table')} className="p-2.5 rounded-xl text-slate-400 hover:bg-teal-600 hover:text-white transition-all" title="Add Table"><TableIcon size={20} /></button>
                    <button onClick={() => insertRichContent('box')} className="p-2.5 rounded-xl text-slate-400 hover:bg-orange-600 hover:text-white transition-all" title="Add Info Box"><Box size={20} /></button>
                    <div className="w-px h-8 bg-slate-800 mx-2" />
                    <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-green-500 shadow-xl shadow-green-600/20 active:translate-y-0.5 transition-all outline-none">SAVE ALL DATA</button>
                    <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:bg-red-600 hover:text-white transition-all"><X size={20} /></button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 bg-slate-50 p-6 flex flex-col gap-4 border-r border-slate-200 overflow-y-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Editor Workflow</div>

                    <button onClick={() => { setActiveSection('clinical'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'clinical' ? 'bg-white shadow-2xl ring-2 ring-blue-500/10 text-blue-600 scale-[1.02]' : 'text-slate-400 hover:bg-white hover:shadow-md'}`}>
                        <Layout className={activeSection === 'clinical' ? 'text-blue-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Clinical Record</div>
                            <div className="text-[10px] opacity-60 font-bold">Chart, Labs, Vitals</div>
                        </div>
                    </button>

                    <button onClick={() => { setActiveSection('question'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'question' ? 'bg-white shadow-2xl ring-2 ring-indigo-500/10 text-indigo-600 scale-[1.02]' : 'text-slate-400 hover:bg-white hover:shadow-md'}`}>
                        <BrainCircuit className={activeSection === 'question' ? 'text-indigo-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Question Suite</div>
                            <div className="text-[10px] opacity-60 font-bold">Stems, Options, Keys</div>
                        </div>
                    </button>

                    <button onClick={() => { setActiveSection('rationale'); setSubSection('rationale'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'rationale' ? 'bg-white shadow-2xl ring-2 ring-teal-500/10 text-teal-600 scale-[1.02]' : 'text-slate-400 hover:bg-white hover:shadow-md'}`}>
                        <Activity className={activeSection === 'rationale' ? 'text-teal-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Reasoning Logic</div>
                            <div className="text-[10px] opacity-60 font-bold">Rationales, Strategy</div>
                        </div>
                    </button>

                    <button onClick={() => { setActiveSection('metadata'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'metadata' ? 'bg-white shadow-2xl ring-2 ring-orange-500/10 text-orange-600 scale-[1.02]' : 'text-slate-400 hover:bg-white hover:shadow-md'}`}>
                        <Settings className={activeSection === 'metadata' ? 'text-orange-500' : 'group-hover:text-slate-600'} />
                        <div className="text-left">
                            <div className="font-black text-xs uppercase tracking-tighter">Item Context</div>
                            <div className="text-[10px] opacity-60 font-bold">Difficulty, Analytics</div>
                        </div>
                    </button>

                    <div className="flex-1" />
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group active:scale-95 transition-all">
                        <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Extreme Rebuild</div>
                        <h4 className="text-xl font-black leading-tight">AI Master Rewrite</h4>
                        <button onClick={() => { setEditingField('fullItem'); setShowAiModal(true); }} className="mt-6 bg-white text-blue-700 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all">DEPLOY AI</button>
                    </div>
                </div>

                <div className="flex-1 bg-white p-16 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 flex items-center justify-between pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-slate-300">REF: {liveItem.id.slice(0, 16)}</span>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${(liveItem as any).typeId === 'standard' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{(liveItem as any).typeId || 'N/A'}</div>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Screen {activeSection} // Syncing...</div>
                        </div>
                        {activeSection === 'clinical' && renderClinicalArea()}
                        {activeSection === 'question' && renderQuestionArea()}
                        {activeSection === 'rationale' && renderRationaleArea()}
                        {activeSection === 'metadata' && (
                            <div className="space-y-12 animate-in zoom-in-95">
                                <div className="bg-slate-950 text-white rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />
                                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] mb-12">Universal Metadata Context</h3>
                                    <div className="grid grid-cols-2 gap-16 relative z-10">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase mb-6 block tracking-widest">Difficulty Index</label>
                                            <div className="flex gap-3">
                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                    <button key={lvl} onClick={() => updateField('pedagogy.difficultyLevel', lvl)} className={`flex-1 py-10 rounded-[2rem] font-black text-2xl transition-all duration-300 ${liveItem.pedagogy?.difficultyLevel === lvl ? 'bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] scale-110' : 'bg-slate-900 text-slate-600 hover:bg-slate-800'}`}>{lvl}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase mb-6 block tracking-widest">Clinical Topic Area</label>
                                            <EditableField value={liveItem.pedagogy?.clinicalFocus} path="pedagogy.clinicalFocus" className="bg-slate-900 p-8 rounded-[2rem] text-blue-400 font-black text-xl border border-slate-800 h-[120px] flex items-center shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAiModal && (
                <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center z-[200] p-10 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[4rem] shadow-2xl p-20 w-full max-w-3xl border-8 border-slate-50 relative overflow-hidden animate-in scale-95 duration-500">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-100 rounded-full blur-[100px] opacity-50" />
                        <div className="flex items-center gap-8 mb-16 relative z-10">
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-600/40 animate-pulse">
                                <Sparkles size={48} />
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">AI Neuro-Refinery</h3>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4">Redesigning medical curriculum parameters</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full bg-slate-50 border-4 border-slate-100 rounded-[3rem] p-12 min-h-[300px] text-2xl text-slate-800 focus:border-purple-600 outline-none transition-all placeholder:text-slate-200 font-black leading-relaxed mb-12 relative z-10 shadow-inner"
                            placeholder="INSTRUCT THE NEURAL REFINERY..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-between items-center relative z-10">
                            <button onClick={() => setShowAiModal(false)} className="px-10 py-5 text-slate-400 font-black uppercase text-xs tracking-[0.3em] hover:text-slate-900 transition-all">TERMINATE</button>
                            <button
                                onClick={handleAiRewrite}
                                disabled={isAiWorking}
                                className="bg-slate-900 text-white px-16 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] flex items-center gap-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:bg-black transition-all group active:scale-95"
                            >
                                {isAiWorking ? <RefreshCcw className="animate-spin" size={24} /> : <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />}
                                <span>EXECUTE PROTOCOL</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
