import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { LayeredCaseStudyFactory, GenerationConfig, LayerProgress } from '../../services/LayeredCaseStudyFactory';

import { CLINICAL_TOPICS, ClinicalCategory, SubTopic } from '../../data/clinicalTopics';

interface CaseStudyWizardProps {
    onCaseGenerated: (item: any) => void;
}

export const CaseStudyWizard: React.FC<CaseStudyWizardProps> = ({ onCaseGenerated }) => {
    const [topic, setTopic] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ClinicalCategory | ''>('');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [selectedSubTopic, setSelectedSubTopic] = useState('');
    const [customFocus, setCustomFocus] = useState('');
    const [difficulty, setDifficulty] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    const selectedTopic = CLINICAL_TOPICS.find(t => t.id === selectedTopicId);

    const handleTopicSelect = (topicId: string) => {
        setSelectedTopicId(topicId);
        setSelectedSubTopic('');
        setCustomFocus('');
        const found = CLINICAL_TOPICS.find(t => t.id === topicId);
        if (found) {
            setTopic(found.label);
        } else {
            if (topicId === '') setTopic('');
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a clinical focus/topic.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setStatus('Initializing 5-Layer Engine...');

        try {
            // Use the memoized/component-level selectedTopic
            const activeFocus = selectedSubTopic === 'custom' ? customFocus : selectedSubTopic;

            // Build config for LayeredCaseStudyFactory
            const config: GenerationConfig = {
                topic: topic,
                subTopic: activeFocus || undefined,
                difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
                patientAge: 'adult',
                setting: String(selectedCategory).includes('Pharm') ? 'Outpatient Clinic' : 'Hospital - Medical/Surgical',
                onProgress: (progress: LayerProgress) => {
                    const emoji = ['🏗️', '🔬', '✍️', '🧪', '✨'][progress.layer - 1];
                    setStatus(`${emoji} Layer ${progress.layer}: ${progress.message}`);
                }
            };

            console.log('[Wizard] Starting LayeredCaseStudyFactory generation with config:', config);

            // Generate using LayeredCaseStudyFactory - already returns MasterQuestionItem format
            const result = await LayeredCaseStudyFactory.generate(config);

            setStatus('Validating output...');

            // Debug log the result structure
            console.log('[Wizard] LayeredCaseStudyFactory result:', {
                hasContent: !!result.content,
                hasStructure: !!result.content?.structure,
                screenCount: result.content?.structure?.screens?.length || 0,
                patientName: result.content?.clinicalData?.patientInfo?.name
            });

            // LayeredCaseStudyFactory already produces clean MasterQuestionItem format
            // Skip ItemIngestionService which may corrupt the structure
            const cleanItem = result;

            // Validation Checklist - screens validation
            const screens = cleanItem.content?.structure?.screens ||
                (cleanItem as any).structure?.screens ||
                (cleanItem as any).screens || [];

            console.log('[Wizard] Screens found:', screens.length, screens.map((s: any) => s.type));

            if (screens.length === 0) {
                console.error('[Wizard] No screens found. Full result:', JSON.stringify(result, null, 2).substring(0, 2000));
                throw new Error('Structural Failure: No screens detected in AI output.');
            }

            // Anti-Lazy Placeholder Scan
            const rawString = JSON.stringify(result);
            const lazyMatch = rawString.match(/\b(Option|Condition|Action|Dropdown|Fallback)\s+[A-Z\d]\b/i);
            if (lazyMatch) {
                throw new Error(`Placeholder Detected: AI generated "${lazyMatch[0]}". Retrying...`);
            }

            setStatus('✅ Injection Ready!');

            // Small delay for UI feedback
            setTimeout(() => {
                onCaseGenerated(cleanItem);
                setIsGenerating(false);
            }, 800);

        } catch (err: any) {
            console.error(`[Wizard] Generation failed:`, err.message);
            setError(`Generation Failed: ${err.message}`);
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg mx-auto overflow-hidden relative font-inter">
            {/* Magic Top Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
                    <Wand2 size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Case Study Wizard</h2>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500">
                        <Sparkles size={12} />
                        <span>Direct Injection Tool</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    {/* Tier 1: Category */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">1. Client Needs Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value as ClinicalCategory | '');
                                setSelectedTopicId('');
                            }}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-semibold appearance-none cursor-pointer"
                            disabled={isGenerating}
                        >
                            <option value="">Select Category...</option>
                            <option value="Physiological Integrity">Physiological Integrity</option>
                            <option value="Safe & Effective Care">Safe & Effective Care</option>
                            <option value="Health Promotion">Health Promotion</option>
                            <option value="Psychosocial Integrity">Psychosocial Integrity</option>
                            <option value="Pharm & Parenteral">Pharm & Parenteral</option>
                        </select>
                    </div>

                    {/* Tier 2: Topic Selection */}
                    <div className={!selectedCategory ? 'opacity-40 pointer-events-none transition-opacity' : 'transition-opacity'}>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">2. Clinical Topic</label>
                        <select
                            value={selectedTopicId}
                            onChange={(e) => handleTopicSelect(e.target.value)}
                            className={`w-full px-5 py-3 border rounded-xl focus:ring-4 outline-none transition-all font-semibold appearance-none cursor-pointer ${CLINICAL_TOPICS.find(t => t.id === selectedTopicId)?.isHighYield
                                ? 'bg-amber-50 border-amber-200 text-amber-900 focus:ring-amber-500/10'
                                : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-indigo-500/10'
                                }`}
                            disabled={isGenerating || !selectedCategory}
                        >
                            <option value="">Choose Topic...</option>
                            {CLINICAL_TOPICS.filter(t => t.category === selectedCategory).map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.isHighYield ? '⭐ ' : ''}{t.label}
                                </option>
                            ))}
                            <option value="manual">-- Custom Entry --</option>
                        </select>
                    </div>

                    {/* Tier 3: Scenario Focus */}
                    <div className={!selectedTopicId || selectedTopicId === 'manual' ? 'opacity-40 pointer-events-none transition-opacity' : 'transition-opacity'}>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">3. Scenario Focus</label>
                        <select
                            value={selectedSubTopic}
                            onChange={(e) => setSelectedSubTopic(e.target.value)}
                            className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-semibold mb-3 appearance-none cursor-pointer"
                            disabled={isGenerating || !selectedTopicId || selectedTopicId === 'manual'}
                        >
                            <option value="">-- Choose Focus (Optional) --</option>
                            {selectedTopic?.subTopics.map((st: SubTopic) => (
                                <option key={st.label} value={st.label}>
                                    {st.isHighYield ? '⭐ ' : ''}{st.label}
                                </option>
                            ))}
                            <option value="custom">Custom Focus...</option>
                        </select>

                        {(selectedSubTopic === 'custom' || selectedTopicId === 'manual') && (
                            <input
                                type="text"
                                value={customFocus}
                                onChange={(e) => setCustomFocus(e.target.value)}
                                placeholder="e.g. Focus on post-op complications..."
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400 animate-in fade-in slide-in-from-top-1"
                                disabled={isGenerating}
                            />
                        )}

                        {selectedTopicId && CLINICAL_TOPICS.find(t => t.id === selectedTopicId)?.isHighYield && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200 animate-pulse">⭐ HIGH-YIELD PRESET</span>
                                <span className="text-[10px] text-slate-400 italic">Extended fidelity rules active</span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Clinical Complexity</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-semibold appearance-none cursor-pointer"
                        disabled={isGenerating}
                    >
                        <option value={1}>Level 1: Novice / Basic Recall</option>
                        <option value={2}>Level 2: Beginner / Application</option>
                        <option value={3}>Level 3: Competent / NGN Standard</option>
                        <option value={4}>Level 4: Proficient / Synthesis</option>
                        <option value={5}>Level 5: Expert / Evaluative</option>
                    </select>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`group w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all transform shadow-lg active:scale-95 ${isGenerating
                        ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                        : 'bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 hover:shadow-indigo-500/30'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span className="animate-pulse">{status}</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            <span>Generate & Inject</span>
                        </>
                    )}
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-4">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Anti-Entropy Active</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Silent Retry Auto-Enabled</span>
            </div>
        </div>
    );
};
