import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import {
    Wand2, RefreshCcw, X, Sparkles, Layout, BrainCircuit,
    Settings, Trash2, Check, Activity, FlaskConical, Stethoscope,
    ClipboardList, FileSearch, ArrowRight, Undo2, Redo2,
    Upload, Aperture, MousePointerClick
} from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { magicFixItem } from '../../services/geminiService';

interface AIBookFixerModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

const CLINICAL_TOPICS = [
    "General Mix",
    "Cardiology",
    "Respiratory",
    "Neurology",
    "Pediatrics",
    "Pharmacology",
    "Mental Health",
    "Maternal",
    "Critical Care",
    "Fundamentals",
    "Leadership",
    "Gastrointestinal",
    "Endocrine",
    "Renal",
    "Musculoskeletal"
];

// History Hook
function useHistoryState<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const [past, setPast] = useState<T[]>([]);
    const [future, setFuture] = useState<T[]>([]);

    const set = useCallback((newState: T | ((prev: T) => T)) => {
        setState((currentState) => {
            const nextState = typeof newState === 'function' ? (newState as any)(currentState) : newState;
            setPast(p => [...p, currentState]);
            setFuture([]); // Clear future on new change
            return nextState;
        });
    }, []);

    const undo = useCallback(() => {
        setPast(p => {
            if (p.length === 0) return p;
            const previous = p[p.length - 1];
            const newPast = p.slice(0, p.length - 1);
            setFuture(f => [state, ...f]);
            setState(previous);
            return newPast;
        });
    }, [state]);

    const redo = useCallback(() => {
        setFuture(f => {
            if (f.length === 0) return f;
            const next = f[0];
            const newFuture = f.slice(1);
            setPast(p => [...p, state]);
            setState(next);
            return newFuture;
        });
    }, [state]);

    return { state, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

export const AIBookFixerModal: React.FC<AIBookFixerModalProps> = ({ item: initialItem, onClose, onSuccess }) => {
    // --- STATE ---
    const { state: liveItem, set: setLiveItem, undo, redo, canUndo, canRedo } = useHistoryState<MasterQuestionItem>(JSON.parse(JSON.stringify(initialItem)));

    const [activeSection, setActiveSection] = useState<'clinical' | 'question' | 'rationale' | 'metadata'>('clinical');
    const [subSection, setSubSection] = useState<string>('notes');
    const [aiProcessing, setAiProcessing] = useState(false);

    // Media & Edit States
    const [editingField, setEditingField] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiModal, setShowAiModal] = useState(false);

    // Image Insertion States
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaTargetField, setMediaTargetField] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- SAVE ---
    const handleSave = async () => {
        try {
            await updateItem(liveItem);
            await syncItemToSupabase(liveItem);
            alert('✅ All changes saved permanently!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Save failed.');
        }
    };

    // --- AI REWRITE ---
    const handleAiRewrite = async () => {
        if (!aiPrompt.trim() || !editingField) return;
        setAiProcessing(true);
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
            setAiProcessing(false);
        }
    };

    // --- FIELD UPDATE ---
    const updateField = (path: string, value: any) => {
        setLiveItem((prev: MasterQuestionItem) => {
            const updated = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let obj: any = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    // --- MOUSE SELECTION LOGIC ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isSelectionMode) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setSelectionBox({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragStart) return;
        setSelectionBox({
            x: Math.min(e.clientX, dragStart.x),
            y: Math.min(e.clientY, dragStart.y),
            w: Math.abs(e.clientX - dragStart.x),
            h: Math.abs(e.clientY - dragStart.y)
        });
    };

    const handleMouseUp = (_e: React.MouseEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        setDragStart(null);

        // Determine target field based on current view
        let target = '';
        if (activeSection === 'clinical') {
            // Map subsection ID to data path key
            const keyMap: { [key: string]: string } = {
                'notes': 'history',
                'vitals': 'vitals',
                'labs': 'labs',
                'orders': 'orders',
                'hp': 'hp',
                'radiology': 'radiology'
            };
            target = `content.clinicalData.${keyMap[subSection] || 'history'}`;
        }
        else if (activeSection === 'question') target = 'content.structure.prompt';
        else if (activeSection === 'rationale') target = 'pedagogy.rationale';
        else target = 'content.clinicalData.history'; // Fallback

        setMediaTargetField(target);
        setShowMediaModal(true);
        setIsSelectionMode(false); // Turn off after selection
    };

    // --- MEDIA INSERTION ---
    const handleInsertMedia = (type: 'upload' | 'ai', content: string) => {
        if (!mediaTargetField) {
            alert("Error: No target field selected. Please try selecting an area again.");
            return;
        }

        let snippet = '';
        if (type === 'upload') {
            snippet = `\n\n![Uploaded Image](${content})\n\n`;
        } else {
            // AI Generation Placeholder
            snippet = `\n\n![AI GENERATED: ${content}](https://via.placeholder.com/600x400?text=AI+Gen:+${encodeURIComponent(content)})\n\n`;
        }

        // Apply to field
        const updated = JSON.parse(JSON.stringify(liveItem));
        const keys = mediaTargetField.split('.');
        let obj: any = updated;

        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {}; // Create if missing
            obj = obj[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        const currentVal = obj[lastKey] || '';
        obj[lastKey] = currentVal + snippet;

        setLiveItem(updated);
        setShowMediaModal(false);
        setSelectionBox(null);
    };


    // --- EDITABLE COMPONENT ---
    const EditableField = ({ value, path, className = '', multiline = false, placeholder = '...' }: { value: any, path: string, className?: string, multiline?: boolean, placeholder?: string }) => {
        const [editing, setEditing] = useState(false);
        const [localVal, setLocalVal] = useState('');
        const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

        useEffect(() => {
            if (value === undefined || value === null) setLocalVal('');
            else if (typeof value === 'object') setLocalVal(JSON.stringify(value, null, 2));
            else setLocalVal(String(value));
        }, [value]);

        const save = () => {
            setEditing(false);
            let finalValue: any = localVal;
            if (typeof value === 'object') {
                try {
                    finalValue = JSON.parse(localVal);
                } catch { return; }
            }
            if (finalValue !== value) updateField(path, finalValue);
        };

        if (editing) {
            return multiline || typeof value === 'object' ? (
                <textarea
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    className={`border-2 border-blue-500 rounded p-2 bg-white outline-none w-full text-slate-800 ${className}`}
                    rows={typeof value === 'object' ? 10 : 8}
                    autoFocus
                />
            ) : (
                <input
                    ref={ref as any}
                    value={localVal}
                    onChange={e => setLocalVal(e.target.value)}
                    onBlur={save}
                    onKeyDown={e => e.key === 'Enter' && save()}
                    className={`border-2 border-blue-500 rounded px-2 py-1 bg-white outline-none w-full text-slate-800 ${className}`}
                    autoFocus
                />
            );
        }

        const displayValue = typeof value === 'object' ? 'Click to edit complex object' : String(value || '');

        return (
            <div
                onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); setEditingField(path); }}
                className={`cursor-pointer hover:bg-yellow-100/50 hover:ring-2 hover:ring-yellow-400/50 rounded px-1 transition-all ${className} ${!displayValue ? 'text-gray-300 italic' : ''}`}
            >
                {displayValue || placeholder}
            </div>
        );
    };

    // ========== RENDERERS (Clinical, Question, Rationale) ==========
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
                            <button key={tab.id} onClick={() => setSubSection(tab.id)} className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase transition-all whitespace-nowrap ${subSection === tab.id ? 'bg-slate-900 border-b-2 border-blue-400 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>{tab.icon} {tab.label}</button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 min-h-[60vh] relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">{ehrTabs.find(t => t.id === subSection)?.icon}{ehrTabs.find(t => t.id === subSection)?.label}</h3>
                        <button onClick={() => { setEditingField(`content.clinicalData.${subSection === 'notes' ? 'history' : subSection}`); setShowAiModal(true); }} className="text-[10px] bg-purple-600 text-white px-4 py-2 rounded-xl font-black hover:bg-purple-700 shadow-lg shadow-purple-600/20">AI TRANSFORMATION</button>
                    </div>
                    <EditableField
                        value={liveItem.content.clinicalData?.[subSection === 'notes' ? 'history' : (subSection as keyof typeof liveItem.content.clinicalData)]}
                        path={`content.clinicalData.${subSection === 'notes' ? 'history' : subSection}`}
                        multiline
                        className={`text-slate-700 leading-relaxed ${['vitals', 'labs', 'orders'].includes(subSection) ? 'font-mono' : ''}`}
                    />
                </div>
            </div>
        );
    };

    const renderQuestionArea = () => {
        const typeId = (liveItem as any).typeId || 'standard';
        const isComplex = typeId !== 'standard';

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Prompt</h3>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">TYPE: {typeId}</div>
                    </div>
                    <EditableField value={liveItem.content.structure?.prompt} path="content.structure.prompt" multiline className="text-2xl font-black text-slate-900 leading-tight" />
                </div>
                {isComplex ? (
                    <div className="bg-slate-900 rounded-xl p-6 text-white overflow-x-auto">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Complex Structure Editor</h4>
                        <EditableField value={liveItem.content.structure} path="content.structure" multiline className="font-mono text-xs bg-slate-950 border-slate-800 text-green-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {liveItem.content.structure?.options?.map((opt: any, idx: number) => (
                            <div key={idx} className={`p-6 rounded-xl border-2 transition-all flex gap-4 ${opt.isCorrect ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white'}`}>
                                <button onClick={() => { const newOpts = [...liveItem.content.structure.options]; newOpts[idx].isCorrect = !newOpts[idx].isCorrect; updateField('content.structure.options', newOpts); }} className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 ${opt.isCorrect ? 'bg-green-500 border-green-600 text-white' : 'border-slate-200 text-transparent'}`}><Check size={16} /></button>
                                <div className="flex-1">
                                    <EditableField value={opt.text} path={`content.structure.options.${idx}.text`} className="font-black text-slate-800" />
                                    <div className="mt-2 pt-2 border-t border-slate-100 opacity-50 italic text-xs">Rationale: <EditableField value={opt.rationale} path={`content.structure.options.${idx}.rationale`} className="inline" /></div>
                                </div>
                                <button onClick={() => updateField('content.structure.options', liveItem.content.structure.options.filter((_: any, i: number) => i !== idx))} className="text-red-300 hover:text-red-600 px-2"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderRationaleArea = () => {
        const sections = [
            { id: 'rationale', label: 'Option Review' },
            { id: 'clinicalLogic', label: 'Clinical Logic' },
            { id: 'strategy', label: 'Strategy' },
            { id: 'knowledge', label: 'Knowledge' },
        ];
        return (
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700">
                    <div className="flex bg-slate-800 overflow-x-auto">
                        {sections.map(tab => (
                            <button key={tab.id} onClick={() => setSubSection(tab.id)} className={`flex-1 py-4 px-6 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${subSection === tab.id ? 'bg-slate-900 text-white border-b-2 border-teal-400' : 'text-slate-500 hover:text-slate-300'}`}>{tab.label}</button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-8 border border-slate-200 min-h-[60vh] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{sections.find(s => s.id === subSection)?.label || 'Reasoning'}</h3>
                        <button className="text-[10px] bg-teal-600 text-white px-4 py-2 rounded-xl font-black shadow-lg shadow-teal-600/20">AI SYNC</button>
                    </div>
                    <EditableField value={(liveItem.pedagogy as any)?.[subSection === 'notes' ? 'rationale' : subSection]} path={`pedagogy.${subSection === 'notes' ? 'rationale' : subSection}`} multiline className="text-slate-700 text-lg leading-relaxed font-serif" />
                </div>
            </div>
        );
    };

    // ========== RENDER: METADATA & TOPIC DROPDOWN ==========
    const renderMetadataArea = () => {
        return (
            <div className="space-y-8 animate-in zoom-in-95">
                <div className="bg-slate-950 text-white rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] mb-12">Universal Metadata Context</h3>
                    <div className="grid grid-cols-2 gap-16 relative z-10">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-6 block tracking-widest">Difficulty Index</label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => updateField('pedagogy.difficultyLevel', lvl)}
                                        className={`flex-1 py-10 rounded-[2rem] font-black text-2xl transition-all ${liveItem.pedagogy?.difficultyLevel === lvl ? 'bg-blue-600 text-white scale-110 shadow-2xl' : 'bg-slate-900 text-slate-600 hover:bg-slate-800'}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-6 block tracking-widest">Clinical Topic Area</label>
                            <div className="bg-slate-900 p-2 rounded-[2rem] border border-slate-800 flex items-center shadow-inner h-32">
                                <select
                                    value={liveItem.pedagogy?.clinicalFocus || 'General Mix'}
                                    onChange={(e) => updateField('pedagogy.clinicalFocus', e.target.value)}
                                    className="w-full h-full bg-transparent text-blue-400 font-black text-3xl px-6 outline-none appearance-none cursor-pointer text-center"
                                >
                                    {CLINICAL_TOPICS.map(topic => (
                                        <option key={topic} value={topic} className="bg-slate-900 text-lg">{topic}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans h-screen overflow-hidden select-none"
            ref={containerRef}
        >
            {/* Top Toolbar */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center z-[110] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"><Wand2 size={28} /></div>
                    <div><h1 className="text-xl font-black tracking-tighter uppercase leading-none text-slate-900">AI BookFixer™ 4.1</h1></div>
                </div>
                <div className="flex bg-slate-900 p-1.5 rounded-2xl shadow-xl border border-slate-800 gap-1 items-center">
                    <button onClick={undo} disabled={!canUndo} className={`p-2.5 rounded-xl transition-all ${canUndo ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-700'}`} title="Undo"><Undo2 size={20} /></button>
                    <button onClick={redo} disabled={!canRedo} className={`p-2.5 rounded-xl transition-all ${canRedo ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-700'}`} title="Redo"><Redo2 size={20} /></button>
                    <div className="w-px h-8 bg-slate-800 mx-2" />
                    <button
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-2 font-black text-xs uppercase px-4 ${isSelectionMode ? 'bg-orange-600 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                        title="Drag a box on screen to insert media"
                    >
                        <MousePointerClick size={20} /> Select Area
                    </button>
                    <div className="w-px h-8 bg-slate-800 mx-2" />
                    <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-green-500 shadow-xl shadow-green-600/20 active:translate-y-0.5 transition-all outline-none">SAVE</button>
                    <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:bg-red-600 hover:text-white transition-all"><X size={20} /></button>
                </div>
            </div>

            {/* Drag Selection Overlay */}
            {isSelectionMode && (
                <div
                    className="absolute inset-0 z-[105] cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {selectionBox && (
                        <div
                            className="bg-blue-500/20 border-2 border-blue-500 absolute pointer-events-none"
                            style={{
                                left: selectionBox.x,
                                top: selectionBox.y,
                                width: selectionBox.w,
                                height: selectionBox.h
                            }}
                        />
                    )}
                </div>
            )}

            {/* Sidebar & Content */}
            <div className="flex-1 flex overflow-hidden relative">
                <div className="w-80 bg-slate-50 p-6 flex flex-col gap-4 border-r border-slate-200 overflow-y-auto z-[90]">
                    {/* ... Sidebar Nav Buttons ... */}
                    <button onClick={() => { setActiveSection('clinical'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'clinical' ? 'bg-white shadow-2xl ring-2 ring-blue-500/10 text-blue-600 scale-[1.02]' : 'text-slate-400 hover:bg-white'}`}><Layout size={20} /><div className="text-left"><div className="font-black text-xs uppercase">Clinical Record</div></div></button>
                    <button onClick={() => { setActiveSection('question'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'question' ? 'bg-white shadow-2xl ring-2 ring-indigo-500/10 text-indigo-600 scale-[1.02]' : 'text-slate-400 hover:bg-white'}`}><BrainCircuit size={20} /><div className="text-left"><div className="font-black text-xs uppercase">Question Suite</div></div></button>
                    <button onClick={() => { setActiveSection('rationale'); setSubSection('rationale'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'rationale' ? 'bg-white shadow-2xl ring-2 ring-teal-500/10 text-teal-600 scale-[1.02]' : 'text-slate-400 hover:bg-white'}`}><Activity size={20} /><div className="text-left"><div className="font-black text-xs uppercase">Reasoning</div></div></button>
                    <button onClick={() => { setActiveSection('metadata'); setSubSection('notes'); }} className={`group flex items-center gap-4 p-5 rounded-3xl transition-all ${activeSection === 'metadata' ? 'bg-white shadow-2xl ring-2 ring-orange-500/10 text-orange-600 scale-[1.02]' : 'text-slate-400 hover:bg-white'}`}><Settings size={20} /><div className="text-left"><div className="font-black text-xs uppercase">Item Context</div></div></button>
                </div>

                <div className="flex-1 bg-white p-16 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 flex items-center justify-between pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-3"><span className="font-mono text-xs text-slate-300">REF: {liveItem.id.slice(0, 16)}</span></div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{activeSection} // {subSection}</div>
                        </div>
                        {activeSection === 'clinical' && renderClinicalArea()}
                        {activeSection === 'question' && renderQuestionArea()}
                        {activeSection === 'rationale' && renderRationaleArea()}
                        {activeSection === 'metadata' && renderMetadataArea()}
                    </div>
                </div>
            </div>

            {/* ADD MEDIA MODAL */}
            {showMediaModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 uppercase">Insert Rich Media</h3>
                            <button onClick={() => { setShowMediaModal(false); setIsSelectionMode(false); }} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => {
                                    const url = prompt("Enter Image URL or File Path:");
                                    if (url) handleInsertMedia('upload', url);
                                }}
                                className="bg-blue-50 hover:bg-blue-100 p-6 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-blue-500"
                            >
                                <Upload size={32} className="text-blue-600" />
                                <span className="font-bold text-sm text-slate-700">Upload File</span>
                            </button>
                            <button
                                onClick={() => { const p = prompt("Describe the chart/graph/image to generate:"); if (p) handleInsertMedia('ai', p); }}
                                className="bg-purple-50 hover:bg-purple-100 p-6 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-purple-500"
                            >
                                <Aperture size={32} className="text-purple-600" />
                                <span className="font-bold text-sm text-slate-700">AI Generate</span>
                            </button>
                        </div>
                        <div className="text-center text-xs text-slate-400">Target Area: {mediaTargetField}</div>
                    </div>
                </div>
            )}

            {/* AI Text Modal (Existing) */}
            {showAiModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-10">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-16 w-full max-w-2xl border-8 border-slate-50 relative animate-in zoom-in-95">
                        <div className="flex items-center gap-6 mb-12"><div className="bg-purple-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center"><Sparkles size={40} /></div><div><h3 className="text-4xl font-black text-slate-900 tracking-tighter">AI Neuro-Refinery</h3></div></div>
                        <textarea className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] p-10 min-h-[20rem] text-2xl font-black mb-10 outline-none focus:border-purple-600" placeholder="INSTRUCT THE AI..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} autoFocus />
                        <div className="flex justify-between"><button onClick={() => setShowAiModal(false)} className="px-10 py-5 font-black uppercase text-xs">Abort</button><button onClick={handleAiRewrite} disabled={aiProcessing} className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs flex gap-4">{aiProcessing ? <RefreshCcw className="animate-spin" /> : 'EXECUTE'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};
