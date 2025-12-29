import React, { useState } from 'react';
import { GenerationSettings, InputMode, ReferenceSource } from '../types/master-schema';

interface InputConfigPanelProps {
    settings: GenerationSettings;
    onSettingsChange: (settings: GenerationSettings) => void;
    activeReferences: ReferenceSource[];
}

export const InputConfigPanel: React.FC<InputConfigPanelProps> = ({ settings, onSettingsChange, activeReferences }) => {

    // Toggle for Auto-Describe logic
    const [useAutoDescribe, setUseAutoDescribe] = useState(true);

    const setMode = (mode: InputMode) => onSettingsChange({ ...settings, mode });



    return (
        <div>
            {/* Mode Selection Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
                {(['hybrid', 'manual', 'upload', 'ai'] as InputMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: settings.mode === m ? 'white' : 'transparent',
                            color: settings.mode === m ? '#0891b2' : '#64748b',
                            border: 'none',
                            borderBottom: settings.mode === m ? '2px solid #0891b2' : '2px solid transparent',
                            fontWeight: settings.mode === m ? 600 : 500,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem'
                        }}
                    >
                        {m === 'upload' ? 'Files' : m} Mode
                    </button>
                ))}
            </div>

            <div style={{ padding: '0 0.5rem' }}>

                {/* UPLOAD / REFERENCE CONTEXT */}
                {(settings.mode === 'upload' || settings.mode === 'hybrid') && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Active References</label>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeReferences.length} selected</span>
                        </div>

                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px',
                            minHeight: '60px'
                        }}>
                            {activeReferences.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {activeReferences.map(r => (
                                        <span key={r.referenceId} style={{
                                            fontSize: '0.8rem',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            color: '#334155',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            📄 {r.fileName}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                                    No references selected. Go back to Step 1 to add sources.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MANUAL DATA INPUT */}
                {(settings.mode === 'manual' || settings.mode === 'hybrid') && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.8rem' }}>
                            Manual Clinical Data
                        </label>
                        <textarea
                            placeholder="Paste case history, vitals, labs, or nuring notes here..."
                            style={{
                                width: '100%',
                                height: '140px',
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '14px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '2px solid #e2e8f0',
                                background: '#f8fafc',
                                color: '#1e293b',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            value={settings.manualContext || ''}
                            onChange={e => onSettingsChange({ ...settings, manualContext: e.target.value })}
                        />
                    </div>
                )}

                {/* AI PROMPT INPUT (With Auto-Describe) */}
                {(settings.mode === 'ai' || settings.mode === 'hybrid') && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>AI Scenario Description</label>
                            <label style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#0891b2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                    type="checkbox"
                                    checked={useAutoDescribe}
                                    onChange={(e) => {
                                        setUseAutoDescribe(e.target.checked);
                                        if (e.target.checked) onSettingsChange({ ...settings, aiPrompt: '' });
                                    }}
                                    style={{ accentColor: '#0891b2' }}
                                />
                                Auto-Describe
                            </label>
                        </div>

                        {!useAutoDescribe ? (
                            <textarea
                                placeholder="e.g. '78-year-old female, sepsis signs, 4-day hospitalization...'"
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid #e2e8f0',
                                    background: 'white',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                value={settings.aiPrompt || ''}
                                onChange={e => onSettingsChange({ ...settings, aiPrompt: e.target.value })}
                            />
                        ) : (
                            <div style={{
                                padding: '1rem',
                                background: '#f0fdfa',
                                border: '1px dashed #0891b2',
                                borderRadius: '8px',
                                color: '#0e7490',
                                fontSize: '0.9rem',
                            }}>
                                ✨ AI will automatically generate a realistic clinical scenario based on your <strong>Clinical Focus</strong> and <strong>Difficulty Level</strong>.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
