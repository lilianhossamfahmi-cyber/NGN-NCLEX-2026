import React, { useState } from 'react';
import { ReferenceSource, GenerationSettings } from '../types/master-schema';
import { ReferenceLibraryPanel } from '../components/ReferenceLibraryPanel';
import { InputConfigPanel } from '../components/InputConfigPanel';
import { GenerationParametersPanel } from '../components/GenerationParametersPanel';

// Duplicated for portability - ideally move to a central config
const CLINICAL_FOCUS_AREAS = [
    "Critical Care & Sepsis", "Emergency Department", "Pediatrics", "Obstetrics & Maternity",
    "Surgical/Post-Operative", "Cardiovascular/Cardiac", "Respiratory/Pulmonary", "Gastrointestinal",
    "Neurological", "Mental Health/Psychiatric", "Community Health", "Geriatric Care",
    "Pharmacology", "Infection Control"
];

interface GeneratorWorkflowProps {
    references: ReferenceSource[];
    onReferencesChange: (refs: ReferenceSource[]) => void;
    genSettings: GenerationSettings;
    onSettingsChange: (settings: any) => void;
    onGenerate: () => void;
    onImportClick: () => void;
}

export const GeneratorWorkflow: React.FC<GeneratorWorkflowProps> = ({
    references,
    onReferencesChange,
    genSettings,
    onSettingsChange,
    onGenerate,
    onImportClick
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const goToStep = (step: number) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Helper for Step Indicator
    const StepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                    { num: 1, label: 'References' },
                    { num: 2, label: 'Configuration' },
                    { num: 3, label: 'Generate' }
                ].map((s, idx, arr) => {
                    const isActive = currentStep === s.num;
                    const isCompleted = currentStep > s.num;
                    return (
                        <React.Fragment key={s.num}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <div
                                    onClick={() => isCompleted && goToStep(s.num)}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: isActive || isCompleted ? '#0891b2' : '#e2e8f0',
                                        color: isActive || isCompleted ? 'white' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '18px',
                                        cursor: isCompleted ? 'pointer' : 'default',
                                        transition: 'all 0.3s',
                                        boxShadow: isActive ? '0 0 0 4px rgba(8, 145, 178, 0.2)' : 'none'
                                    }}
                                >
                                    {isCompleted ? '✓' : s.num}
                                </div>
                                <div style={{
                                    marginTop: '8px', fontSize: '14px', fontWeight: 600,
                                    color: isActive ? '#0891b2' : (isCompleted ? '#0e7490' : '#94a3b8')
                                }}>
                                    {s.label}
                                </div>
                            </div>
                            {idx < arr.length - 1 && (
                                <div style={{
                                    width: '100px', height: '3px',
                                    background: isCompleted ? '#0891b2' : '#e2e8f0',
                                    margin: '0 10px', transform: 'translateY(-14px)'
                                }} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );

    // Reusable Section Card Wrapper
    const SectionCard = ({ step, title, children, isCollapsed }: { step: number, title: string, children: React.ReactNode, isCollapsed?: boolean }) => (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            opacity: isCollapsed ? 0.8 : 1,
            transition: 'all 0.3s'
        }}>
            <div
                style={{
                    padding: '16px 24px',
                    background: isCollapsed ? '#f8fafc' : 'white',
                    borderBottom: isCollapsed ? 'none' : '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: isCollapsed ? 'pointer' : 'default'
                }}
                onClick={() => isCollapsed && goToStep(step)}
            >
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: isCollapsed ? '#64748b' : '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        background: isCollapsed ? '#e2e8f0' : '#0891b2', color: isCollapsed ? '#64748b' : 'white',
                        width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {isCollapsed ? '✓' : step}
                    </span>
                    {title}
                </h3>
                {isCollapsed && (
                    <button style={{ border: 'none', background: 'transparent', color: '#0891b2', fontWeight: 600, cursor: 'pointer' }}>
                        Edit
                    </button>
                )}
            </div>
            {!isCollapsed && (
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            )}
            {isCollapsed && step === 1 && (
                <div style={{ padding: '0 24px 16px 24px', fontSize: '0.9rem', color: '#64748b' }}>
                    {references.filter(r => r.isActive).length} references selected
                </div>
            )}
            {isCollapsed && step === 2 && (
                <div style={{ padding: '0 24px 16px 24px', fontSize: '0.9rem', color: '#64748b' }}>
                    Mode: <span style={{ textTransform: 'capitalize' }}>{genSettings.mode}</span> • {genSettings.mode === 'manual' ? 'Manual Data' : (!genSettings.aiPrompt ? 'Auto-Describe' : 'Custom Prompt')}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <StepIndicator />

            {/* STEP 1: REFERENCES */}
            <SectionCard step={1} title="Global Reference Library" isCollapsed={currentStep > 1}>
                <ReferenceLibraryPanel references={references} onReferencesChange={onReferencesChange} />
                {currentStep === 1 && (
                    <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                        <button
                            onClick={() => goToStep(2)}
                            style={{
                                background: '#0891b2', color: 'white', padding: '12px 24px',
                                borderRadius: '8px', border: 'none', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Next: Configuration →
                        </button>
                    </div>
                )}
            </SectionCard>

            {/* STEP 2: CONFIGURATION */}
            {(currentStep >= 2) && (
                <SectionCard step={2} title="Data Source Configuration" isCollapsed={currentStep > 2}>
                    <InputConfigPanel
                        settings={genSettings}
                        onSettingsChange={onSettingsChange}
                        activeReferences={references.filter(r => r.isActive)}
                    />
                    {currentStep === 2 && (
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                            <button
                                onClick={() => goToStep(1)}
                                style={{
                                    background: 'transparent', color: '#64748b', padding: '12px 24px',
                                    borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => goToStep(3)}
                                style={{
                                    background: '#0891b2', color: 'white', padding: '12px 24px',
                                    borderRadius: '8px', border: 'none', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Next: Generation →
                            </button>
                        </div>
                    )}
                </SectionCard>
            )}

            {/* STEP 3: GENERATION */}
            {(currentStep >= 3) && (
                <SectionCard step={3} title="AI Generation Parameters" isCollapsed={false}>
                    <GenerationParametersPanel
                        settings={genSettings}
                        onSettingsChange={onSettingsChange}
                        onGenerate={onGenerate}
                        clinicalFocusAreas={CLINICAL_FOCUS_AREAS}
                        isGenerating={false}
                    />
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                            onClick={() => goToStep(2)}
                            style={{
                                background: 'transparent', color: '#64748b', padding: '12px 24px',
                                borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 500, cursor: 'pointer'
                            }}
                        >
                            ← Back to Config
                        </button>
                    </div>
                </SectionCard>
            )}

            {/* FOOTER ACTIONS: Creation Tools */}
            <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

                    <h4 style={{ margin: 0, color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creation Tools</h4>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* FAST GENERATOR BUTTON - Shortcuts to Step 3 */}
                        <button
                            onClick={() => {
                                // Jump straight to Generation Step
                                setCurrentStep(3);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'white', border: '2px solid #0891b2', color: '#0891b2',
                                padding: '12px 24px', borderRadius: '12px',
                                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(8, 145, 178, 0.1)',
                                transition: 'all 0.2s',
                                minWidth: '220px',
                                justifyContent: 'center'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚡</span>
                            <span>Quick AI Generator</span>
                        </button>

                        <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }} />

                        <button
                            onClick={onImportClick}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'transparent', color: '#64748b',
                                border: '2px solid transparent',
                                padding: '12px 24px',
                                cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                                textDecoration: 'none'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#334155'}
                            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                        >
                            <span style={{ fontSize: '1.2rem' }}>📂</span>
                            <span>Import JSON / CSV</span>
                        </button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '600px', textAlign: 'center', margin: 0 }}>
                        Use the <b>Quick Generator</b> to create batch items immediately using standard prompts,
                        or <b>Import</b> existing datasets to populate your item bank.
                    </p>
                </div>
            </div>
        </div>
    );
};
