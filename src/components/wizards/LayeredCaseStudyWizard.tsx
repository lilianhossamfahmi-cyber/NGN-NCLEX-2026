/**
 * LayeredCaseStudyWizard.tsx
 * 
 * A new wizard that uses the 3-Layer Generation System for Case Studies.
 * Provides real-time progress feedback for each generation layer.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { LayeredCaseStudyFactory, LayerProgress, GenerationConfig } from '../../services/LayeredCaseStudyFactory';
import { MasterQuestionItem } from '../../types/master-schema';
import { CLINICAL_TOPICS, SubTopic } from '../../data/clinicalTopics';

interface LayeredCaseStudyWizardProps {
    onComplete: (item: MasterQuestionItem) => void;
    onCancel?: () => void;
}

interface WizardState {
    step: 'config' | 'generating' | 'complete';
    category: string;
    topic: string;
    subTopic: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    patientAge: 'pediatric' | 'adult' | 'geriatric';
    setting: string;
    progress: LayerProgress | null;
    result: MasterQuestionItem | null;
    error: string | null;
}

const SETTINGS = [
    'Medical-Surgical Unit',
    'Emergency Department',
    'Intensive Care Unit',
    'Post-Anesthesia Care Unit',
    'Labor & Delivery',
    'Pediatric Unit',
    'Psychiatric Unit',
    'Outpatient Clinic'
];

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: 'Novice', color: 'bg-emerald-500' },
    2: { label: 'Application', color: 'bg-blue-500' },
    3: { label: 'Analysis', color: 'bg-yellow-500' },
    4: { label: 'Synthesis', color: 'bg-orange-500' },
    5: { label: 'Evaluation', color: 'bg-red-500' }
};

export const LayeredCaseStudyWizard: React.FC<LayeredCaseStudyWizardProps> = ({ onComplete, onCancel }) => {
    const [state, setState] = useState<WizardState>({
        step: 'config',
        category: '',
        topic: '',
        subTopic: '',
        difficulty: 3,
        patientAge: 'adult',
        setting: 'Medical-Surgical Unit',
        progress: null,
        result: null,
        error: null
    });

    // Get unique categories from clinical topics array
    const categories = useMemo(() => {
        const cats = new Set(CLINICAL_TOPICS.map(t => t.category));
        return Array.from(cats);
    }, []);

    // Get topics for selected category
    const topics = useMemo(() => {
        if (!state.category) return [];
        return CLINICAL_TOPICS.filter(t => t.category === state.category);
    }, [state.category]);

    // Get the selected topic object
    const selectedTopic = useMemo(() => {
        return CLINICAL_TOPICS.find(t => t.label === state.topic);
    }, [state.topic]);

    // Get sub-topics for selected topic
    const subTopics = useMemo(() => {
        if (!selectedTopic) return [];
        return selectedTopic.subTopics || [];
    }, [selectedTopic]);


    const handleGenerate = useCallback(async () => {
        if (!state.topic) {
            setState(s => ({ ...s, error: 'Please select a clinical topic' }));
            return;
        }

        setState(s => ({ ...s, step: 'generating', error: null }));

        const config: GenerationConfig = {
            topic: state.topic,
            subTopic: state.subTopic || undefined,
            difficulty: state.difficulty,
            patientAge: state.patientAge,
            setting: state.setting,
            onProgress: (progress) => {
                setState(s => ({ ...s, progress }));
            }
        };

        try {
            const result = await LayeredCaseStudyFactory.generateNextGen(config);
            setState(s => ({ ...s, step: 'complete', result }));
        } catch (error: any) {
            setState(s => ({
                ...s,
                step: 'config',
                error: error.message || 'Generation failed'
            }));
        }
    }, [state.topic, state.subTopic, state.difficulty, state.patientAge, state.setting]);

    const handleAccept = () => {
        if (state.result) {
            onComplete(state.result);
        }
    };

    // ========================================
    // RENDER: CONFIGURATION STEP
    // ========================================
    if (state.step === 'config') {
        return (
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Schema-Driven Case Study Generator</h2>
                    <p className="text-slate-400 text-sm">High-fidelity 6-question NCLEX-NGN (4-Pass Wizard)</p>
                </div>

                {state.error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                        {state.error}
                    </div>
                )}

                {/* Category Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                        value={state.category}
                        onChange={(e) => setState(s => ({ ...s, category: e.target.value, topic: '', subTopic: '' }))}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                        <option value="">Select a category...</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Topic Selection */}
                {state.category && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Clinical Topic</label>
                        <select
                            value={state.topic}
                            onChange={(e) => setState(s => ({ ...s, topic: e.target.value, subTopic: '' }))}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="">Select a topic...</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.label}>{topic.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Sub-Topic Selection */}
                {subTopics.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sub-Topic (Optional)</label>
                        <select
                            value={state.subTopic}
                            onChange={(e) => setState(s => ({ ...s, subTopic: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="">Any sub-topic...</option>
                            {subTopics.map((st: SubTopic) => (
                                <option key={st.label} value={st.label}>{st.label}{st.isHighYield ? ' ⭐' : ''}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Difficulty Slider */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Difficulty: <span className={`px-2 py-0.5 rounded text-white ${DIFFICULTY_LABELS[state.difficulty].color}`}>
                            Level {state.difficulty} - {DIFFICULTY_LABELS[state.difficulty].label}
                        </span>
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={state.difficulty}
                        onChange={(e) => setState(s => ({ ...s, difficulty: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Novice</span>
                        <span>Application</span>
                        <span>Analysis</span>
                        <span>Synthesis</span>
                        <span>Evaluation</span>
                    </div>
                </div>

                {/* Patient Age Group */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Patient Age Group</label>
                    <div className="flex gap-3">
                        {(['pediatric', 'adult', 'geriatric'] as const).map(age => (
                            <button
                                key={age}
                                onClick={() => setState(s => ({ ...s, patientAge: age }))}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${state.patientAge === age
                                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                {age.charAt(0).toUpperCase() + age.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clinical Setting */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Clinical Setting</label>
                    <select
                        value={state.setting}
                        onChange={(e) => setState(s => ({ ...s, setting: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                        {SETTINGS.map(setting => (
                            <option key={setting} value={setting}>{setting}</option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleGenerate}
                        disabled={!state.topic}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🚀 Generate Case Study
                    </button>
                </div>

                {/* Layer Info */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h3 className="text-sm font-semibold text-white mb-2">How it works:</h3>
                    <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">1</span>
                            <span><strong>Blueprint:</strong> Establishes clinical truth and EHR data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">2</span>
                            <span><strong>Skeleton:</strong> Maps the 6-screen CJMM logic flow</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">3</span>
                            <span><strong>Injection:</strong> Populates content and distractors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">4</span>
                            <span><strong>Auditor:</strong> Finalizes logic and remediation</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: GENERATING STEP
    // ========================================
    if (state.step === 'generating') {
        const { progress } = state;

        return (
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 max-w-lg mx-auto text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse">
                    <span className="text-3xl">🧬</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Generating Case Study</h2>
                <p className="text-slate-400 mb-6">{state.topic}</p>

                {/* Layer Progress */}
                <div className="space-y-4 mb-6">
                    {[1, 2, 3, 4].map((layer) => {
                        const isActive = progress?.layer === layer;
                        const isComplete = (progress?.layer || 0) > layer;
                        const layerInfo = {
                            1: { name: 'Blueprint', icon: '🏗️', color: 'blue' },
                            2: { name: 'Skeleton', icon: '📐', color: 'amber' },
                            3: { name: 'Injection', icon: '💉', color: 'violet' },
                            4: { name: 'Auditor', icon: '⚖️', color: 'emerald' }
                        }[layer]!;

                        return (
                            <div key={layer} className={`p-4 rounded-lg border ${isComplete ? 'bg-emerald-500/10 border-emerald-500/30' :
                                isActive ? `bg-${layerInfo.color}-500/10 border-${layerInfo.color}-500/30` :
                                    'bg-slate-800/50 border-slate-700'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{layerInfo.icon}</span>
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">Layer {layer}: {layerInfo.name}</span>
                                            {isComplete && <span className="text-emerald-400">✓</span>}
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            {isActive ? progress?.message : isComplete ? 'Complete' : 'Waiting...'}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progress?.percent || 0}%` }}
                    />
                </div>
                <p className="text-sm text-slate-500 mt-2">{progress?.percent || 0}% complete</p>
            </div>
        );
    }

    // ========================================
    // RENDER: COMPLETE STEP
    // ========================================
    if (state.step === 'complete' && state.result) {
        return (
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 max-w-lg mx-auto text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Case Study Ready!</h2>
                <p className="text-slate-400 mb-6">{state.result.metadata?.title}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">6</div>
                        <div className="text-xs text-slate-400">Screens</div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">
                            {state.result.content?.clinicalData?.labs?.length || 0}
                        </div>
                        <div className="text-xs text-slate-400">Lab Results</div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <div className="text-2xl font-bold text-white">
                            {state.result.content?.clinicalData?.vitals?.length || 0}
                        </div>
                        <div className="text-xs text-slate-400">Vital Sets</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setState(s => ({ ...s, step: 'config' }))}
                        className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Generate Another
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-medium transition-colors"
                    >
                        Add to Item Bank
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default LayeredCaseStudyWizard;
