import React from 'react';
import { GenerationSettings } from '../types/master-schema';
import { QuestionTypeRegistry } from '../registry';

interface GenerationParametersPanelProps {
    settings: GenerationSettings;
    onSettingsChange: (settings: GenerationSettings) => void;
    onGenerate: () => void;
    clinicalFocusAreas: string[];
    isGenerating?: boolean;
}

export const GenerationParametersPanel: React.FC<GenerationParametersPanelProps> = ({
    settings, onSettingsChange, onGenerate, clinicalFocusAreas, isGenerating = false
}) => {

    // Estimate calculations
    const typeCount = settings.targetTypes.includes('mix-all') ? 1 : settings.targetTypes.length;
    const totalItems = typeCount * settings.quantityPerType;
    const estTime = totalItems * 15; // 15 seconds per item roughly

    // Toggle generic/specific logic
    const handleTypeToggle = (typeId: string) => {
        let newTypes = [...settings.targetTypes];
        if (typeId === 'mix-all') {
            newTypes = ['mix-all']; // Exclusive
        } else {
            // Remove mix-all if picking specific
            newTypes = newTypes.filter(t => t !== 'mix-all');

            if (newTypes.includes(typeId)) {
                newTypes = newTypes.filter(t => t !== typeId);
            } else {
                newTypes.push(typeId);
            }
        }
        onSettingsChange({ ...settings, targetTypes: newTypes });
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) minmax(250px, 1fr)', gap: '2rem', marginBottom: '2rem' }}>

                {/* LEFT COLUMN: Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* 1. TYPES */}
                    <div>
                        <label className="section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>🎯 Target Types</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>Select at least one</span>
                        </label>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px',
                                background: settings.targetTypes.includes('mix-all') ? '#f0fdfa' : 'white',
                                border: settings.targetTypes.includes('mix-all') ? '1px solid #0891b2' : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                color: settings.targetTypes.includes('mix-all') ? '#0e7490' : '#475569'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={settings.targetTypes.includes('mix-all')}
                                    onChange={() => handleTypeToggle('mix-all')}
                                    style={{ width: '18px', height: '18px', accentColor: '#0891b2' }}
                                />
                                🎲 General Mix (Random Selection)
                            </label>

                            {!settings.targetTypes.includes('mix-all') && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '8px' }}>
                                    {QuestionTypeRegistry.map(type => (
                                        <label key={type.typeId} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px',
                                            background: settings.targetTypes.includes(type.typeId) ? 'white' : 'transparent',
                                            border: settings.targetTypes.includes(type.typeId) ? '1px solid #0891b2' : '1px solid transparent',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={settings.targetTypes.includes(type.typeId)}
                                                onChange={() => handleTypeToggle(type.typeId)}
                                                style={{ accentColor: '#0891b2' }}
                                            />
                                            {type.typeName}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. QUANTITY & DIFFICULTY */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="section-label">📊 Qty (Per Type)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number" min="1" max="10"
                                    value={settings.quantityPerType}
                                    onChange={e => {
                                        let val = parseInt(e.target.value);
                                        if (val < 1) val = 1;
                                        if (val > 10) val = 10;
                                        onSettingsChange({ ...settings, quantityPerType: val });
                                    }}
                                    style={{
                                        width: '100%', padding: '12px', fontSize: '16px', fontWeight: 600,
                                        borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none'
                                    }}
                                />
                                <span style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8', fontSize: '0.8rem' }}>max 10</span>
                            </div>
                        </div>
                        <div>
                            <label className="section-label">🧠 Difficulty (1-5)</label>
                            <select
                                value={settings.difficultyLevel}
                                onChange={e => onSettingsChange({ ...settings, difficultyLevel: parseInt(e.target.value) })}
                                style={{
                                    width: '100%', padding: '12px', fontSize: '16px', fontWeight: 600,
                                    borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white'
                                }}
                            >
                                <option value={1}>1 - Novice (Recall)</option>
                                <option value={2}>2 - Adv. Beginner (Application)</option>
                                <option value={3}>3 - NGN Standard (Analysis)</option>
                                <option value={4}>4 - Proficient (Synthesis)</option>
                                <option value={5}>5 - Expert (Evaluation)</option>
                            </select>
                        </div>
                    </div>

                    {/* 3. CLINICAL FOCUS */}
                    <div>
                        <label className="section-label">🎓 Clinical Focus</label>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    onSettingsChange({ ...settings, clinicalFocus: [e.target.value] });
                                }
                            }}
                            value={settings.clinicalFocus[0] || ''}
                            style={{
                                width: '100%', padding: '12px', fontSize: '15px',
                                borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', marginBottom: '8px'
                            }}
                        >
                            <option value="">Select Focus...</option>
                            <option value="General Mix">🎲 General Mix (Random)</option>
                            <option disabled>---</option>
                            {clinicalFocusAreas.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Or type custom focus..."
                            value={settings.customClinicalFocus || ''}
                            onChange={e => onSettingsChange({ ...settings, customClinicalFocus: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', fontSize: '14px',
                                borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc'
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Preview & Estimates */}
                <div style={{ paddingTop: '24px' }}>
                    <div style={{
                        background: '#f8fafc', borderRadius: '12px', padding: '24px',
                        border: '1px solid #e2e8f0', height: '100%',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <h4 style={{ margin: '0 0 16px 0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                            Generation Preview
                        </h4>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>Total Questions</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{totalItems}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>Difficulty</span>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600,
                                    background: settings.difficultyLevel > 3 ? '#fee2e2' : '#f0fdfa',
                                    color: settings.difficultyLevel > 3 ? '#b91c1c' : '#0f766e'
                                }}>
                                    Level {settings.difficultyLevel}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b' }}>Est. Time</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                                    ⏱️ ~{Math.ceil(estTime / 60)} min
                                </span>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Selected Types:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {settings.targetTypes.map(t => (
                                        <span key={t} style={{ fontSize: '0.75rem', background: 'white', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                                            {t === 'mix-all' ? 'Variable Mix' : t}
                                        </span>
                                    ))}
                                    {settings.targetTypes.length === 0 && <span style={{ color: '#ef4444' }}>None selected</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GENERATE BUTTON */}
            <button
                onClick={onGenerate}
                disabled={isGenerating || settings.targetTypes.length === 0}
                style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '8px',
                    background: settings.targetTypes.length > 0 ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' : '#e2e8f0',
                    color: settings.targetTypes.length > 0 ? 'white' : '#94a3b8',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: settings.targetTypes.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    boxShadow: settings.targetTypes.length > 0 ? '0 4px 6px -1px rgba(8, 145, 178, 0.2)' : 'none',
                    transition: 'all 0.2s',
                    marginTop: '1rem',
                    position: 'sticky', bottom: '0', zIndex: 10 // Sticky effect if needed
                }}
                onMouseOver={(e) => { if (!isGenerating && settings.targetTypes.length > 0) e.currentTarget.style.transform = 'scale(1.01)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                {isGenerating ? (
                    <>
                        <span className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                        Generating {totalItems} items...
                    </>
                ) : (
                    <>✨ Generate Questions</>
                )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
