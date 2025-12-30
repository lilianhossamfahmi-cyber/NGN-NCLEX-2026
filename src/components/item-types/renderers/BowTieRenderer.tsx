import React, { useState } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { GenericRendererProps } from './types';

// PART 3: BOW-TIE – GOLD STANDARD UPGRADE
// Features: Drag Pulse, Snap Animation, Enhanced Connectors, Mobile Optimization
export const BowTieRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDragging, setIsDragging] = useState<string | null>(null); // 'actions', 'condition', 'parameters' or null

    // answers: { actions: [id, id], condition: id, parameters: [id, id] }

    const handleDragStart = (e: React.DragEvent, item: any, category: string) => {
        if (isSubmitted) return;
        e.dataTransfer.setData("item", JSON.stringify({ ...item, category }));
        e.dataTransfer.effectAllowed = "copyMove";
        setIsDragging(category); // "actions", "conditions", "parameters"
    };

    const handleDragEnd = () => {
        setIsDragging(null);
    };

    const handleDrop = (e: React.DragEvent, slotType: 'actions' | 'condition' | 'parameters', index?: number) => {
        if (isSubmitted) return;
        e.preventDefault();
        setIsDragging(null);

        try {
            const data = JSON.parse(e.dataTransfer.getData("item"));
            const newAns = { ...answers };

            // Logic to clear if item moved from another slot logic could be added here, but simplified:
            if (slotType === 'condition') {
                if (config.conditions?.pool?.find((c: any) => c.id === data.id)) newAns.condition = data.id;
            } else if (index !== undefined) {
                if (!newAns[slotType]) newAns[slotType] = [null, null];
                // Validate category (Basic safety check)
                // Note: category from drag is 'conditions', 'actions', 'parameters'. slotType is singular/plural mix.
                // We trust the user drops in visually correct zone or we can enforce:
                // if (data.category !== slotType) return; 

                const pool = slotType === 'actions' ? config.actions?.pool : config.parameters?.pool;
                // Allow drop if id exists in appropriate pool
                if (pool?.find((c: any) => c.id === data.id)) newAns[slotType][index] = data.id;
            }
            setAnswers(newAns);
        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    const handleMobileSelect = (slotType: 'actions' | 'condition' | 'parameters', newVal: string, index?: number) => {
        const newAns = { ...answers };
        if (slotType === 'condition') {
            newAns.condition = newVal;
        } else if (index !== undefined) {
            if (!newAns[slotType]) newAns[slotType] = [null, null];
            newAns[slotType][index] = newVal;
        }
        setAnswers(newAns);
    };

    const getLabel = (id: string, pool: any[]) => pool?.find(x => x.id === id)?.text || id;
    const getSlotStatus = (id: string, pool: any[]) => {
        if (!isSubmitted || !id || !pool) return 'normal';
        const item = pool.find(x => x.id === id);
        return item?.isCorrect ? 'correct' : 'incorrect';
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

    // --- MOBILE RENDERER ---
    if (isMobile) {
        return (
            <div className="bow-tie-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#334155', marginBottom: '8px' }}>1. Select Actions to Take (2):</div>
                    {[0, 1].map(i => (
                        <select
                            key={i}
                            disabled={isSubmitted}
                            value={answers?.actions?.[i] || ""}
                            onChange={(e) => handleMobileSelect('actions', e.target.value, i)}
                            className={`mobile-select ${getSlotStatus(answers?.actions?.[i], config.actions?.pool)}`}
                            style={{ width: '100%', marginBottom: '8px', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">Select Action {i + 1}...</option>
                            {config.actions?.pool?.map((opt: any) => (
                                <option key={opt.id} value={opt.id} disabled={answers?.actions?.includes(opt.id) && answers?.actions?.[i] !== opt.id}>
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>

                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>2. Select Potential Condition:</div>
                    <select
                        disabled={isSubmitted}
                        value={answers?.condition || ""}
                        onChange={(e) => handleMobileSelect('condition', e.target.value)}
                        className={`mobile-select ${getSlotStatus(answers?.condition, config.conditions?.pool)}`}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #93c5fd' }}
                    >
                        <option value="">Select Condition...</option>
                        {config.conditions?.pool?.map((opt: any) => (
                            <option key={opt.id} value={opt.id}>{opt.text}</option>
                        ))}
                    </select>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#334155', marginBottom: '8px' }}>3. Select Parameters to Monitor (2):</div>
                    {[0, 1].map(i => (
                        <select
                            key={i}
                            disabled={isSubmitted}
                            value={answers?.parameters?.[i] || ""}
                            onChange={(e) => handleMobileSelect('parameters', e.target.value, i)}
                            className={`mobile-select ${getSlotStatus(answers?.parameters?.[i], config.parameters?.pool)}`}
                            style={{ width: '100%', marginBottom: '8px', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="">Select Parameter {i + 1}...</option>
                            {config.parameters?.pool?.map((opt: any) => (
                                <option key={opt.id} value={opt.id} disabled={answers?.parameters?.includes(opt.id) && answers?.parameters?.[i] !== opt.id}>
                                    {opt.text}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            </div>
        );
    }

    // --- DESKTOP RENDERER (Premium Flow) ---
    const ArrowConnector = ({ color }: { color: string }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', alignSelf: 'center' }}>
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    {`
                    @keyframes flow-animation {
                        to { stroke-dashoffset: -20; }
                    }
                    `}
                </style>
                <path d="M0 12H50" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 6" style={{ animation: 'flow-animation 1s linear infinite' }} />
                <path d="M45 5L52 12L45 19" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );

    return (
        <div className="bow-tie-renderer" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', userSelect: 'none', padding: '1rem' }}>
            <style>{`
                @keyframes pulseRing {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    60% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .drop-zone-active {
                    animation: pulseRing 1.5s infinite;
                    border-style: solid !important;
                    border-width: 2px !important;
                    background: #f0f9ff !important;
                }
                .filled-pop {
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                /* Hide native drag image if possible, or just style source */
            `}</style>

            {/* DIAGRAM AREA */}
            <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>

                {/* 1. ACTIONS (Left Side) - Blue Theme */}
                <div style={{ flex: 1, border: '2px solid #60a5fa', borderRadius: '16px', padding: '1.5rem', background: '#eff6ff', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.1)' }}>
                    <div style={{ textAlign: 'center', fontWeight: '800', color: '#1e40af', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Actions to Take</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        {[0, 1].map(i => {
                            const currentId = answers?.actions?.[i];
                            const status = getSlotStatus(currentId, config.actions?.pool);
                            const filledStyle = currentId ? { background: 'white', borderColor: '#3b82f6', color: '#1e40af', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } : {};
                            const isActiveTarget = isDragging === 'actions' && !isSubmitted;

                            return (
                                <div key={i}
                                    onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                                    onDrop={e => handleDrop(e, 'actions', i)}
                                    onClick={() => handleSlotClick('actions', i)}
                                    title={currentId ? "Click to remove" : "Drag action here"}
                                    className={`ngn-drop-slot ${currentId ? 'filled' : ''} ${status} ${isActiveTarget ? 'drop-zone-active' : ''}`}
                                    style={{
                                        cursor: isSubmitted ? 'default' : (currentId ? 'pointer' : 'default'),
                                        background: 'white',
                                        border: isActiveTarget ? '2px solid #3b82f6' : '2px dashed #93c5fd',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        minHeight: '60px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                        ...filledStyle
                                    }}
                                >
                                    {currentId ? (
                                        <div className="filled-pop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                textDecoration: status === 'incorrect' ? 'line-through' : 'none',
                                                textDecorationColor: status === 'incorrect' ? '#dc2626' : 'currentColor',
                                                textDecorationThickness: '2px'
                                            }}>
                                                {getLabel(currentId, config.actions?.pool)}
                                            </span>
                                            {status === 'correct' && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>}
                                            {status === 'incorrect' && <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✗</span>}
                                        </div>
                                    ) : "Drag Action Here"}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ArrowConnector color="#3b82f6" />

                {/* 2. CONDITION (Center) - Purple Theme */}
                <div style={{ width: '280px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        border: '4px solid #c084fc',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        boxShadow: '0 10px 15px -3px rgba(126, 34, 206, 0.1), 0 4px 6px -2px rgba(126, 34, 206, 0.05)',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '20px', fontWeight: '800', color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Condition</div>

                        <div
                            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                            onDrop={e => handleDrop(e, 'condition')}
                            onClick={() => handleSlotClick('condition')}
                            title={answers?.condition ? "Click to remove" : "Drag condition here"}
                            className={`${(isDragging === 'conditions' || isDragging === 'condition') && !isSubmitted ? 'drop-zone-active' : ''}`}
                            style={{
                                width: '80%',
                                height: '40%',
                                background: answers?.condition ? 'white' : 'rgba(255,255,255,0.8)',
                                border: answers?.condition ? '2px solid #a855f7' : '2px dashed #a855f7',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                padding: '10px',
                                fontWeight: 600,
                                color: answers?.condition ? '#6b21a8' : '#a855f7',
                                cursor: isSubmitted ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '1rem'
                            }}
                        >
                            {answers?.condition ? (
                                <div className="filled-pop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        textDecoration: getSlotStatus(answers.condition, config.conditions?.pool) === 'incorrect' ? 'line-through' : 'none',
                                        textDecorationColor: getSlotStatus(answers.condition, config.conditions?.pool) === 'incorrect' ? '#dc2626' : 'currentColor',
                                        textDecorationThickness: '2px'
                                    }}>
                                        {getLabel(answers.condition, config.conditions?.pool)}
                                    </span>
                                    {getSlotStatus(answers.condition, config.conditions?.pool) === 'correct' && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>}
                                    {getSlotStatus(answers.condition, config.conditions?.pool) === 'incorrect' && <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✗</span>}
                                </div>
                            ) : "Drag Condition"}
                        </div>
                    </div>
                </div>

                <ArrowConnector color="#10b981" />

                {/* 3. PARAMETERS (Right Side) - Green Theme */}
                <div style={{ flex: 1, border: '2px solid #34d399', borderRadius: '16px', padding: '1.5rem', background: '#ecfdf5', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)' }}>
                    <div style={{ textAlign: 'center', fontWeight: '800', color: '#047857', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Parameters to Monitor</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        {[0, 1].map(i => {
                            const currentId = answers?.parameters?.[i];
                            const status = getSlotStatus(currentId, config.parameters?.pool);
                            const filledStyle = currentId ? { background: 'white', borderColor: '#10b981', color: '#065f46', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } : {};
                            const isActiveTarget = isDragging === 'parameters' && !isSubmitted;

                            return (
                                <div key={i}
                                    onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                                    onDrop={e => handleDrop(e, 'parameters', i)}
                                    onClick={() => handleSlotClick('parameters', i)}
                                    title={currentId ? "Click to remove" : "Drag parameter here"}
                                    className={`ngn-drop-slot ${currentId ? 'filled' : ''} ${status} ${isActiveTarget ? 'drop-zone-active' : ''}`}
                                    style={{
                                        cursor: isSubmitted ? 'default' : (currentId ? 'pointer' : 'default'),
                                        background: 'white',
                                        border: isActiveTarget ? '2px solid #10b981' : '2px dashed #6ee7b7',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        minHeight: '60px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                        ...filledStyle
                                    }}
                                >
                                    {currentId ? (
                                        <div className="filled-pop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                textDecoration: status === 'incorrect' ? 'line-through' : 'none',
                                                textDecorationColor: status === 'incorrect' ? '#dc2626' : 'currentColor',
                                                textDecorationThickness: '2px'
                                            }}>
                                                {getLabel(currentId, config.parameters?.pool)}
                                            </span>
                                            {status === 'correct' && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>}
                                            {status === 'incorrect' && <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✗</span>}
                                        </div>
                                    ) : "Drag Parameter"}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* OPTION POOLS - Styled Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 1fr', gap: '60px', marginTop: '1rem', padding: '0 1rem' }}>
                <PoolColumn
                    title="Action Choices"
                    list={config.actions?.pool?.filter((o: any) => !answers?.actions?.includes(o.id))}
                    category="actions"
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    disabled={isSubmitted}
                    themeColor="#3b82f6"
                    bgColor="#dbeafe"
                />
                <PoolColumn
                    title="Condition Choices"
                    list={config.conditions?.pool?.filter((o: any) => o.id !== answers?.condition)}
                    category="conditions" // Matches logic in handleDrop check
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    disabled={isSubmitted}
                    themeColor="#a855f7"
                    bgColor="#f3e8ff"
                />
                <PoolColumn
                    title="Parameter Choices"
                    list={config.parameters?.pool?.filter((o: any) => !answers?.parameters?.includes(o.id))}
                    category="parameters"
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    disabled={isSubmitted}
                    themeColor="#10b981"
                    bgColor="#d1fae5"
                />
            </div>

            {/* Feedback / Instructions */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                {!isSubmitted ? (
                    <div style={{ display: 'inline-block', padding: '8px 16px', background: '#f8fafc', borderRadius: '20px', fontSize: '0.85rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        💡 Drag items from the bottom pools to the corresponding diagram slots.
                    </div>
                ) : (
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Review your clinical judgment path above.</div>
                )}
            </div>
        </div>
    );
};

const PoolColumn = ({ title, list, category, onDragStart, onDragEnd, disabled, themeColor, bgColor }: any) => (
    <div style={{
        border: `1px solid ${themeColor}40`,
        padding: '0',
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        overflow: 'hidden'
    }}>
        <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: themeColor,
            padding: '12px',
            background: bgColor,
            borderBottom: `1px solid ${themeColor}20`,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '0.05em'
        }}>
            {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', minHeight: '100px' }}>
            {list?.length === 0 && <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>All items placed</div>}

            {list?.map((opt: any) => {
                const isMissed = disabled && opt.isCorrect;
                return (
                    <div key={opt.id}
                        draggable={!disabled}
                        onDragStart={e => onDragStart(e, opt, category)}
                        onDragEnd={onDragEnd}
                        className={`ngn-draggable-tile ${disabled ? 'disabled' : ''}`}
                        style={{
                            padding: '10px 14px',
                            background: isMissed ? '#fde047' : 'white',
                            border: isMissed ? '2px dashed #ca8a04' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: isMissed ? 'black' : '#334155',
                            fontWeight: isMissed ? 600 : 500,
                            cursor: disabled ? 'not-allowed' : 'grab',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = themeColor; } }}
                        onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; } }}
                    >
                        {opt.text}
                        {isMissed && <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'black' }}>(Missed)</span>}
                    </div>
                );
            })}
        </div>
    </div>
);
