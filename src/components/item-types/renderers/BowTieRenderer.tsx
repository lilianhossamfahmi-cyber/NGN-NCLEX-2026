import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { GenericRendererProps } from './types';

// PART 3: BOW-TIE – GOLD STANDARD UPGRADE
// Features: Drag Pulse, Snap Animation, Dynamic Sizing, Mobile Checkboxes
export const BowTieRenderer: React.FC<GenericRendererProps> = ({ config, answers: propAnswers, setAnswers: parentSetAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDragging, setIsDragging] = useState<string | null>(null);

    // FIX: Use LOCAL state for answers to avoid controlled component flow issues
    // Initialize from props if available, otherwise use default BowTie structure
    const [localAnswers, setLocalAnswers] = useState(() => {
        const initial = propAnswers && typeof propAnswers === 'object' && (propAnswers.actions || propAnswers.condition || propAnswers.parameters)
            ? propAnswers
            : { actions: [null, null], condition: null, parameters: [null, null] };
        console.log('[BowTieRenderer] Initializing local state:', JSON.stringify(initial));
        return initial;
    });

    // Use a ref for the latest answers to avoid stale closures in event handlers
    const answersRef = useRef(localAnswers);
    useEffect(() => {
        answersRef.current = localAnswers;
    }, [localAnswers]);

    // Wrapper to update both local state and notify parent
    const setAnswers = useCallback((newAns: any) => {
        console.log('[BowTieRenderer] setAnswers called:', JSON.stringify(newAns));
        setLocalAnswers(newAns);
        answersRef.current = newAns; // Update ref immediately
        if (parentSetAnswers) {
            parentSetAnswers(newAns);
        }
    }, [parentSetAnswers]);

    // Use local answers for rendering
    const answers = localAnswers;

    // --- DATA NORMALIZATION (Fix for R-01: Support flat arrays vs legacy pool objects) ---
    // FIX: Also check config.structure fallback for nested format
    const getPool = (source: any) => Array.isArray(source) ? source : (source?.pool || []);
    const actionPool = getPool(config.actions || config.structure?.actions);
    const conditionPool = getPool(config.conditions || config.structure?.conditions);
    const paramPool = getPool(config.parameters || config.structure?.parameters);

    // DEBUG: Log current state
    console.log('[BowTieRenderer] Current answers:', JSON.stringify(answers));


    // --- HELPER WRAPPERS ---
    const handleSelectAction = (id: string, max: number) => {
        if (isSubmitted) return;
        const current = answers?.actions || [];
        // Toggle logic with limit
        if (current.includes(id)) {
            setAnswers({ ...answers, actions: current.filter((x: any) => x !== id) });
        } else {
            if (current.length < max) {
                setAnswers({ ...answers, actions: [...current, id] });
            }
        }
    };

    const handleSelectCondition = (id: string) => {
        if (isSubmitted) return;
        setAnswers({ ...answers, condition: id === answers?.condition ? null : id });
    };

    const handleSelectParameter = (id: string, max: number) => {
        if (isSubmitted) return;
        const current = answers?.parameters || [];
        if (current.includes(id)) {
            setAnswers({ ...answers, parameters: current.filter((x: any) => x !== id) });
        } else {
            if (current.length < max) {
                setAnswers({ ...answers, parameters: [...current, id] });
            }
        }
    };

    // --- DRAG HANDLERS (Desktop) ---
    const handleDragStart = (e: React.DragEvent, item: any, category: string) => {
        if (isSubmitted) return;
        e.dataTransfer.setData("item", JSON.stringify({ ...item, category }));
        e.dataTransfer.effectAllowed = "copyMove";
        setIsDragging(category);
    };

    const handleDrop = (e: React.DragEvent, slotType: 'actions' | 'condition' | 'parameters', index?: number) => {
        if (isSubmitted) return;
        e.preventDefault();
        setIsDragging(null);

        try {
            const rawData = e.dataTransfer.getData("item");
            console.log('[BowTie Drop] Raw data:', rawData);

            if (!rawData) {
                console.error('[BowTie Drop] No data in dataTransfer!');
                return;
            }

            const data = JSON.parse(rawData);
            console.log('[BowTie Drop] Parsed data:', data);
            console.log('[BowTie Drop] SlotType:', slotType, 'Index:', index);

            // FIX: Use ref to get the LATEST answers (not stale closure value)
            const currentAnswers = answersRef.current;
            const newAns = {
                actions: Array.isArray(currentAnswers?.actions) ? [...currentAnswers.actions] : [null, null],
                condition: currentAnswers?.condition || null,
                parameters: Array.isArray(currentAnswers?.parameters) ? [...currentAnswers.parameters] : [null, null]
            };

            if (slotType === 'condition') {
                const found = conditionPool.find((c: any) => c.id === data.id);
                console.log('[BowTie Drop] Looking for condition ID:', data.id, 'Found:', !!found);
                if (found) newAns.condition = data.id;
            } else if (index !== undefined) {
                const pool = slotType === 'actions' ? actionPool : paramPool;
                const found = pool?.find((c: any) => c.id === data.id);
                console.log('[BowTie Drop] Looking for', slotType, 'ID:', data.id, 'Pool size:', pool?.length, 'Found:', !!found);
                if (found) {
                    // Ensure we have a proper array
                    if (!Array.isArray(newAns[slotType])) {
                        newAns[slotType] = [null, null];
                    }
                    newAns[slotType][index] = data.id;
                }
            }

            console.log('[BowTie Drop] Setting answers:', JSON.stringify(newAns));
            setAnswers(newAns);
        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    const handleSlotClick = (slotType: 'actions' | 'condition' | 'parameters', index?: number) => {
        if (isSubmitted) return;
        const newAns = { ...answers };
        if (slotType === 'condition') {
            newAns.condition = null;
        } else if (index !== undefined) {
            if (newAns[slotType]) newAns[slotType][index] = null;
        }
        setAnswers(newAns);
    };

    const getSlotStatus = (id: string, pool: any[]) => {
        if (!isSubmitted || !id || !pool) return 'normal';
        const item = pool.find(x => x.id === id);
        return item?.isCorrect ? 'correct' : 'incorrect';
    };

    // --- MOBILE RENDERER (Checkbox Groups) ---
    if (isMobile) {
        return (
            <div className="bow-tie-mobile space-y-6 font-inter">
                {/* ACTIONS */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">1</span>
                        Select Actions (Max 2)
                    </div>
                    <div className="space-y-2">
                        {actionPool.map((opt: any) => {
                            const isSelected = answers?.actions?.includes(opt.id);
                            const atLimit = (answers?.actions?.length || 0) >= 2;
                            return (
                                <div key={opt.id}
                                    onClick={() => !isSubmitted && (isSelected || !atLimit) && handleSelectAction(opt.id, 2)}
                                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${isSelected
                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                        : atLimit ? 'opacity-50 border-slate-200 bg-slate-50' : 'bg-white border-slate-200 active:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                        {isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CONDITION */}
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">2</span>
                        Select Condition (Max 1)
                    </div>
                    <div className="space-y-2">
                        {conditionPool.map((opt: any) => {
                            const isSelected = answers?.condition === opt.id;
                            return (
                                <div key={opt.id}
                                    onClick={() => !isSubmitted && handleSelectCondition(opt.id)}
                                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${isSelected
                                        ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                                        : 'bg-white border-slate-200 active:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* PARAMETERS */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm">3</span>
                        Select Parameters (Max 2)
                    </div>
                    <div className="space-y-2">
                        {paramPool.map((opt: any) => {
                            const isSelected = answers?.parameters?.includes(opt.id);
                            const atLimit = (answers?.parameters?.length || 0) >= 2;
                            return (
                                <div key={opt.id}
                                    onClick={() => !isSubmitted && (isSelected || !atLimit) && handleSelectParameter(opt.id, 2)}
                                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${isSelected
                                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                        : atLimit ? 'opacity-50 border-slate-200 bg-emerald-50/50' : 'bg-white border-slate-200 active:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                                        {isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // --- DESKTOP RENDERER ---
    return (
        <div className="bow-tie-renderer relative flex flex-col gap-8 p-4 select-none font-inter">
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                <span>⚡</span>
                CLINICAL JUDGMENT
            </div>

            {/* DIAGRAM */}
            <div className="flex items-stretch justify-between relative mt-4">

                {/* 1. ACTIONS */}
                <div className="flex-1 border-2 border-blue-400 bg-blue-50 rounded-2xl p-6 flex flex-col shadow-sm relative z-10">
                    <div className="text-center font-extrabold text-blue-900 uppercase tracking-widest text-xs mb-4">Actions to Take</div>
                    <div className="flex flex-col gap-4 flex-1">
                        {[0, 1].map(i => {
                            const val = answers?.actions?.[i];
                            const status = getSlotStatus(val, actionPool);
                            return (
                                <DropSlot
                                    key={i}
                                    id={val}
                                    label={val ? actionPool.find((x: any) => x.id === val)?.text : null}
                                    status={status}
                                    placeholder="Drag Action Here"
                                    isActive={isDragging === 'actions'}
                                    color="blue"
                                    onClick={() => handleSlotClick('actions', i)}
                                    onDrop={(e: any) => handleDrop(e, 'actions', i)}
                                    isSubmitted={isSubmitted}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* DYNAMIC ARROW 1 */}
                <DynamicArrow color="#60a5fa" />

                {/* 2. CONDITION */}
                <div className="w-72 flex-shrink-0 flex items-center justify-center z-10 relative">
                    <div className="w-full aspect-square rounded-full border-4 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col items-center justify-center shadow-lg relative p-8">
                        <div className="absolute top-6 font-extrabold text-purple-900 uppercase tracking-widest text-xs">Condition</div>
                        <div
                            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                            onDrop={e => handleDrop(e, 'condition')}
                            onClick={() => handleSlotClick('condition')}
                            className={`w-full h-24 bg-white/80 backdrop-blur border-2 border-dashed border-purple-400 rounded-xl flex items-center justify-center p-2 text-center transition-all cursor-pointer hover:border-solid hover:border-purple-600
                                ${answers?.condition ? 'border-solid border-purple-600 bg-white shadow-sm' : ''}
                            `}
                        >
                            {answers?.condition ? (
                                <SlotContent
                                    text={conditionPool.find((x: any) => x.id === answers.condition)?.text}
                                    status={getSlotStatus(answers.condition, conditionPool)}
                                />
                            ) : <span className="text-purple-400 font-bold text-sm">Drag Condition</span>}
                        </div>
                    </div>
                </div>

                {/* DYNAMIC ARROW 2 */}
                <DynamicArrow color="#34d399" />

                {/* 3. PARAMETERS */}
                <div className="flex-1 border-2 border-emerald-400 bg-emerald-50 rounded-2xl p-6 flex flex-col shadow-sm relative z-10">
                    <div className="text-center font-extrabold text-emerald-900 uppercase tracking-widest text-xs mb-4">Parameters to Monitor</div>
                    <div className="flex flex-col gap-4 flex-1">
                        {[0, 1].map(i => {
                            const val = answers?.parameters?.[i];
                            const status = getSlotStatus(val, paramPool);
                            return (
                                <DropSlot
                                    key={i}
                                    id={val}
                                    label={val ? paramPool.find((x: any) => x.id === val)?.text : null}
                                    status={status}
                                    placeholder="Drag Parameter Here"
                                    isActive={isDragging === 'parameters'}
                                    color="emerald"
                                    onClick={() => handleSlotClick('parameters', i)}
                                    onDrop={(e: any) => handleDrop(e, 'parameters', i)}
                                    isSubmitted={isSubmitted}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* POOLS */}
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_280px_1fr]'} gap-8 mt-4`}>
                <PoolColumn title="Action Choices" items={actionPool} currentAnswers={answers?.actions} category="actions" color="blue" onDragStart={handleDragStart} disabled={isSubmitted} />
                <PoolColumn title="Condition Choices" items={conditionPool} currentAnswers={[answers?.condition]} category="conditions" color="purple" onDragStart={handleDragStart} disabled={isSubmitted} />
                <PoolColumn title="Parameter Choices" items={paramPool} currentAnswers={answers?.parameters} category="parameters" color="emerald" onDragStart={handleDragStart} disabled={isSubmitted} />
            </div>

        </div>
    );
};

// --- SUB-COMPONENTS ---

const DynamicArrow = ({ color }: { color: string }) => (
    <div className="flex items-center justify-center w-16 relative z-0 self-center">
        <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" className="overflow-visible">
            <path d="M0 20 H80" stroke={color} strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
            </path>
            <path d="M75 10 L85 20 L75 30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    </div>
);

const DropSlot = ({ id, label, status, placeholder, isActive, color, onClick, onDrop }: any) => {
    // Safely generate Tailwind classes using template literals but being careful about JIT purge
    // We will use inline styles or standard classes.
    // color is 'blue', 'purple', 'emerald'

    let borderColor = 'border-slate-300';
    let bgColor = 'bg-white/50';
    let textColor = 'text-slate-400';

    if (color === 'blue') {
        if (id) borderColor = 'border-blue-500';
        if (isActive) borderColor = 'border-blue-400';
        textColor = 'text-blue-400';
    } else if (color === 'emerald') {
        if (id) borderColor = 'border-emerald-500';
        textColor = 'text-emerald-400';
    }

    if (id) bgColor = 'bg-white';
    if (isActive) bgColor = 'bg-blue-50'; // Assuming blue theme active generic

    return (
        <div
            onClick={onClick}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
            onDrop={onDrop}
            className={`
                min-h-[64px] rounded-xl border-2 ${isActive ? 'border-dashed animate-pulse ring-2 ring-offset-2' : (id ? 'border-solid' : 'border-dashed')} ${borderColor} ${bgColor}
                flex items-center justify-center text-center p-3 cursor-pointer transition-all hover:shadow-md
            `}
        >
            {id ? <SlotContent text={label} status={status} /> : <span className={`${textColor} font-bold text-sm`}>{placeholder}</span>}
        </div>
    );
};

const SlotContent = ({ text, status }: any) => (
    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 leading-tight">
        <span className={status === 'incorrect' ? 'line-through decoration-red-500 decoration-2' : ''}>{text}</span>
        {status === 'correct' && <span className="text-green-500 text-lg">✓</span>}
        {status === 'incorrect' && <span className="text-red-500 text-lg">✗</span>}
    </div>
);

const PoolColumn = ({ title, items, currentAnswers, category, color, onDragStart, disabled }: any) => {
    const remaining = items?.filter((x: any) => !currentAnswers?.includes(x.id)) || [];

    // Fallback colors for simplicity
    let headerBg = 'bg-slate-100';
    let headerText = 'text-slate-700';

    if (color === 'blue') { headerBg = 'bg-blue-50'; headerText = 'text-blue-700'; }
    if (color === 'purple') { headerBg = 'bg-purple-50'; headerText = 'text-purple-700'; }
    if (color === 'emerald') { headerBg = 'bg-emerald-50'; headerText = 'text-emerald-700'; }

    return (
        <div className={`border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full`}>
            <div className={`${headerBg} p-3 text-center border-b border-slate-100 font-bold ${headerText} text-xs uppercase tracking-wider`}>
                {title}
            </div>
            <div className="p-3 gap-2 flex flex-col flex-1 min-h-[120px]">
                {remaining.length === 0 && <div className="text-center text-slate-400 text-xs py-4 italic">All items placed</div>}

                {remaining.map((opt: any) => (
                    <div
                        key={opt.id}
                        draggable={!disabled}
                        onDragStart={(e) => onDragStart(e, opt, category)}
                        className={`
                            p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm
                            cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all
                            ${disabled ? 'opacity-50 pointer-events-none' : ''}
                        `}
                    >
                        {opt.text}
                    </div>
                ))}
            </div>
        </div>
    );
};
