import React, { useState, useEffect } from 'react';
import { MasterQuestionItem } from '../types/master-schema';
import { validateItemContent } from '../services/validationService';
// import { getQuestionType } from '../registry';

interface ItemAuthoringProps {
    item: MasterQuestionItem;
    onSave: (item: MasterQuestionItem) => void;
}

export const ItemAuthoring: React.FC<ItemAuthoringProps> = ({ item, onSave }) => {
    // Local state for edits
    const [localItem, setLocalItem] = useState(item);
    const [activeTab, setActiveTab] = useState<'quick-start' | 'clinical-data' | 'structure' | 'review'>('quick-start');

    // Dynamic Validation Calculation
    const validationResult = validateItemContent(localItem);
    const hasErrors = !validationResult.valid;
    const allIssues = [...(localItem.aiSafetyChecks?.issues || []), ...validationResult.warnings.map(w => ({ type: 'content', severity: 'warning', message: w }))];
    const uniqueIssues = Array.from(new Set(allIssues.map(i => i.message))).map(msg => allIssues.find(i => i.message === msg));
    const currentStatus = hasErrors ? 'Warnings' : (localItem.aiSafetyChecks?.validationStatus || 'Pass');

    // Auto-save debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(localItem) !== JSON.stringify(item)) {
                onSave(localItem);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [localItem, onSave, item]);

    // Sync if parent updates (e.g. from generated batch changes)
    useEffect(() => {
        if (item.id !== localItem.id) {
            setLocalItem(item);
        }
    }, [item]);

    const handleContentChange = (path: string, value: any) => {
        setLocalItem(prev => {
            const newContent = JSON.parse(JSON.stringify(prev.content || {}));
            // If path starts with 'metadata' or 'pedagogy', handle top level
            if (path.startsWith('metadata.') || path.startsWith('pedagogy.')) {
                const updated = JSON.parse(JSON.stringify(prev));
                setNestedValue(updated, path, value);
                return updated;
            }
            // Else handle content
            setNestedValue(newContent, path, value);
            return { ...prev, content: newContent };
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const color = status === 'Pass' ? '#10b981' : (status === 'Warnings' ? '#f59e0b' : '#ef4444');
        return <span style={{ color, fontWeight: 600 }}>{status}</span>;
    };

    return (
        <div className="authoring-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* TOP NAVIGATION TABS (Standardized 4 Steps) */}
            <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid #334155', background: '#0f172a', marginBottom: '1rem' }}>
                {[
                    { id: 'quick-start', label: '1. Quick Start' },
                    { id: 'clinical-data', label: '2. Clinical Data' },
                    { id: 'structure', label: '3. Diagram & Answers' },
                    { id: 'review', label: '4. Review & Validate' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            flex: 1, padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer',
                            color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                            borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                            fontWeight: activeTab === tab.id ? 600 : 400
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT AREAS */}
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>

                {/* 1. QUICK START */}
                {activeTab === 'quick-start' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card">
                            <h3 style={{ marginTop: 0 }}>Item Metadata</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Field label="Item Title" value={localItem.metadata.title} onChange={(v: string) => handleContentChange('metadata.title', v)} />
                                <Field label="Difficulty Level (1-5)" type="number" value={localItem.pedagogy.difficultyLevel} onChange={(v: string) => handleContentChange('pedagogy.difficultyLevel', parseInt(v))} />
                                <Field label="Clinical Focus" value={localItem.pedagogy.clinicalFocus} onChange={(v: string) => handleContentChange('pedagogy.clinicalFocus', v)} />
                                <Field label="Scenario Summary" type="textarea" value={localItem.content.quickStart?.summary} onChange={(v: string) => handleContentChange('quickStart.summary', v)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. CLINICAL DATA (Professional 5-Section) */}
                {activeTab === 'clinical-data' && (
                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Professional Clinical Data</h3>

                        <Field label="1. Nurses Notes" type="textarea" rows={6} value={localItem.content.clinicalData?.history} onChange={(v: string) => handleContentChange('clinicalData.history', v)} />

                        <Field label="2. History & Physical" type="textarea" rows={6} value={localItem.content.clinicalData?.historyPhysical} onChange={(v: string) => handleContentChange('clinicalData.historyPhysical', v)} />

                        <h4 style={{ marginBottom: '0.5rem' }}>3. Vital Signs (JSON Series)</h4>
                        <JsonEditor value={localItem.content.clinicalData?.vitals} onChange={(v: any) => handleContentChange('clinicalData.vitals', v)} />

                        <Field label="4. Lab Results (Rich Text Table)" type="textarea" rows={6} value={localItem.content.clinicalData?.labs} onChange={(v: string) => handleContentChange('clinicalData.labs', v)} />

                        <Field label="5. Medical Orders (JCIA Standard)" type="textarea" rows={6} value={localItem.content.clinicalData?.orders} onChange={(v: string) => handleContentChange('clinicalData.orders', v)} />

                        <Field label="6. Radiology / Imaging" type="textarea" rows={4} value={localItem.content.clinicalData?.radiology} onChange={(v: string) => handleContentChange('clinicalData.radiology', v)} />
                    </div>
                )}

                {/* 3. STRUCTURE */}
                {activeTab === 'structure' && (
                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Question Interaction</h3>
                        {/* Fallback for type-specific structure editing */}
                        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Prompt / Question Stem</label>
                            <input
                                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '4px' }}
                                value={localItem.content.structure?.prompt || ''}
                                onChange={e => handleContentChange('structure.prompt', e.target.value)}
                            />
                        </div>

                        <h4 style={{ marginBottom: '0.5rem' }}>Dynamic Configuration (JSON)</h4>
                        <JsonEditor value={localItem.content.structure} onChange={(v: any) => handleContentChange('structure', v)} />
                    </div>
                )}



                {/* 4. REVIEW & VALIDATE */}
                {activeTab === 'review' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ borderLeft: !hasErrors ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                            <h3 style={{ marginTop: 0 }}>AI & Content Validation Summary</h3>
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                                <div>Status: <StatusBadge status={currentStatus} /></div>
                                <div>Copyright Score: {localItem.aiSafetyChecks?.copyrightScore}% Safe</div>
                            </div>

                            {uniqueIssues.length ? (
                                <div style={{ background: 'rgba(245,158,11,0.1)', padding: '1rem', borderRadius: '6px' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>Needs Attention:</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#d1d5db' }}>
                                        {uniqueIssues.map((iss: any, i: number) => (
                                            <li key={i}>{iss.message} <span style={{ color: '#60a5fa', cursor: 'pointer' }}>[Apply Fix]</span></li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div style={{ color: '#10b981' }}>Lookin' good! No critical issues found.</div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ flex: 1, padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                🤖 Run AI Auto-Fix
                            </button>
                            <button style={{ flex: 1, padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                                ✓ Approve Item
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const Field = ({ label, value, onChange, type = 'text', rows }: any) => (
    <div style={{ marginBottom: '1rem' }}>
        {label && <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{label}</label>}
        {type === 'textarea' ? (
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                rows={rows || 3}
                style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px', fontFamily: 'inherit' }}
            />
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '6px' }}
            />
        )}
    </div>
);

const JsonEditor = ({ value, onChange }: any) => {
    const [text, setText] = useState(JSON.stringify(value, null, 2));
    const [valid, setValid] = useState(true);

    // Sync external changes
    useEffect(() => {
        setText(JSON.stringify(value, null, 2));
    }, [value]);

    const handleChange = (newText: string) => {
        setText(newText);
        try {
            const parsed = JSON.parse(newText);
            setValid(true);
            onChange(parsed);
        } catch (e) {
            setValid(false);
        }
    };

    return (
        <textarea
            value={text}
            onChange={e => handleChange(e.target.value)}
            style={{
                width: '100%', height: '200px', fontFamily: 'monospace', fontSize: '0.85rem',
                background: '#0f172a', color: valid ? '#a5b4fc' : '#fca5a5',
                border: `1px solid ${valid ? '#334155' : '#ef4444'}`, borderRadius: '6px', padding: '1rem'
            }}
        />
    )
};

// --- UTILS ---
const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(/[\.\[\]\'\"]/).filter(p => p);
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {}; // Auto-create
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
};
