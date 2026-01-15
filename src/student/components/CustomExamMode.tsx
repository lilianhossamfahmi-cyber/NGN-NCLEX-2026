import React, { useState } from 'react';
import { CustomExamEngine, ExamConfiguration, EXAM_PRESETS, ExamPresetName } from '../learning/CustomExamEngine';
import { MasterQuestionItem } from '../../types/master-schema';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Settings, Play, Clock, BarChart, CheckSquare, Save, ChevronRight, Calculator, FileText, ArrowLeft } from 'lucide-react';

export const CustomExamMode: React.FC<{
    onExit: () => void;
}> = ({ onExit }) => {

    // VIEW STATE
    const [step, setStep] = useState<'PRESET' | 'CONFIG' | 'EXAM' | 'RESULTS'>('PRESET');
    const [loading, setLoading] = useState(false);

    // CONFIG STATE
    const [config, setConfig] = useState<ExamConfiguration>(EXAM_PRESETS.FULL_SIM);

    // EXAM STATE
    const [examItems, setExamItems] = useState<MasterQuestionItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // --- STEP 1: PRESET SELECTION ---
    const selectPreset = (key: ExamPresetName) => {
        setConfig(EXAM_PRESETS[key]);
        setStep('CONFIG');
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const items = await CustomExamEngine.buildExam(config);
            setExamItems(items);
            if (config.timeLimitMinutes) {
                setTimeLeft(config.timeLimitMinutes * 60);
            }
            setStep('EXAM');
        } catch (e) {
            alert("Failed to generate exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERERS ---

    if (step === 'PRESET') {
        return (
            <div className="max-w-6xl mx-auto p-8 h-full overflow-y-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={onExit}><ArrowLeft className="mr-2" /> Dashboard</Button>
                    <h1 className="text-3xl font-bold">Custom Exam Builder</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CUSTOM CARD */}
                    <div
                        onClick={() => {
                            setConfig({ ...EXAM_PRESETS.FULL_SIM, title: "My Custom Exam", type: 'CUSTOM' });
                            setStep('CONFIG');
                        }}
                        className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-[1.02] transition-all group relative overflow-hidden"
                    >
                        <Settings className="w-16 h-16 text-slate-600 absolute bottom-[-10px] right-[-10px] group-hover:text-slate-500 transition-colors" />
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Settings size={20} /> Build Scratch</h3>
                        <p className="text-slate-400 text-sm mb-4">Total control. Pick domains, difficulty, timing, and types.</p>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-200">Start Custom</Button>
                    </div>

                    {Object.entries(EXAM_PRESETS).map(([key, preset]) => (
                        <div
                            key={key}
                            onClick={() => selectPreset(key as ExamPresetName)}
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all relative group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800">{preset.title}</h3>
                                {preset.type === 'FULL' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded">HARD</span>}
                                {preset.type === 'MINI' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">EASY</span>}
                            </div>
                            <p className="text-xs text-slate-500 mb-4 h-8 overflow-hidden">
                                {preset.itemCount} items • {preset.timeLimitMinutes || 'Untimed'} • {preset.domains.includes('All') ? 'All Domains' : preset.domains.join(', ')}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-6 right-6">
                                Configure <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 'CONFIG') {
        const estDuration = CustomExamEngine.estimateDuration(config.itemCount, config.includeCaseStudies);

        return (
            <div className="max-w-4xl mx-auto p-8 h-full overflow-y-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => setStep('PRESET')}><ArrowLeft className="mr-2" /> Back</Button>
                    <h1 className="text-2xl font-bold">Configure: {config.title}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT SETTINGS */}
                    <div className="md:col-span-2 space-y-6">

                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock size={18} /> Timing & Pacing</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Time Limit</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={config.timeLimitMinutes || 'null'}
                                        onChange={(e) => setConfig({ ...config, timeLimitMinutes: e.target.value === 'null' ? null : parseInt(e.target.value) })}
                                    >
                                        <option value="null">Untimed (Stress Free)</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="60">60 Minutes</option>
                                        <option value="120">2 Hours</option>
                                        <option value="300">5 Hours (Sim)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={config.showTimer} onChange={(e) => setConfig({ ...config, showTimer: e.target.checked })} />
                                        Show Timer
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={config.allowBackNavigation} onChange={(e) => setConfig({ ...config, allowBackNavigation: e.target.checked })} />
                                        Allow Back Navigation
                                    </label>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart size={18} /> Scope & Content</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions: {config.itemCount}</label>
                                    <input
                                        type="range" min="5" max="150" step="5"
                                        className="w-full"
                                        value={config.itemCount}
                                        onChange={(e) => setConfig({ ...config, itemCount: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="p-4 bg-slate-50 rounded border">
                                    <label className="flex items-center gap-2 font-bold text-sm mb-2">
                                        <input type="checkbox" checked={config.includeCaseStudies} onChange={e => setConfig({ ...config, includeCaseStudies: e.target.checked })} />
                                        Include NGN Case Studies
                                    </label>
                                    <p className="text-xs text-slate-500">Enable this to include 6-screen unfolding case studies. Increases difficulty and duration.</p>
                                </div>
                            </div>
                        </Card>

                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl sticky top-8">
                            <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Exam Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Items</span>
                                    <span className="font-mono">{config.itemCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Total Time</span>
                                    <span className="font-mono">{config.timeLimitMinutes ? `${config.timeLimitMinutes}m` : '∞'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Est. Duration</span>
                                    <span className="font-mono text-blue-300">{estDuration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Mode</span>
                                    <span className="font-mono uppercase">{config.type}</span>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-6 text-lg shadow-lg shadow-blue-900/50" disabled={loading}>
                                {loading ? 'Generating...' : 'Start Exam'} <Play size={20} className="ml-2 fill-current" />
                            </Button>

                            <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                <Save size={16} className="mr-2" /> Save Preset
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    if (step === 'EXAM') {
        const currentItem = examItems[currentIndex];

        // Mock finishing
        const handleFinish = () => {
            alert(`Exam Complete!`);
            setStep('RESULTS'); // Needs Implementation
            onExit();
        };

        const handleNext = () => {
            if (currentIndex < examItems.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                handleFinish();
            }
        };

        return (
            <div className="h-full flex flex-col bg-slate-50">
                {/* EXAM HEADER */}
                <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500 uppercase">{config.title}</span>
                        <div className="h-4 w-[1px] bg-slate-200"></div>
                        <span className="text-sm font-mono text-slate-900">Question {currentIndex + 1} of {examItems.length}</span>
                    </div>

                    <div className="flex items-center gap-8">
                        {config.showTimer && (
                            <div className="flex items-center gap-2 font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">
                                <Clock size={16} /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </div>
                        )}
                        <Button size="sm" variant="destructive" onClick={onExit}>Quit Exam</Button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl min-h-[600px] flex flex-col relative">
                        {currentItem ? (
                            <>
                                <StudentPreviewModal item={currentItem} onClose={() => { }} />

                                {/* CONTROLS */}
                                <div className="p-4 border-t bg-slate-50 flex justify-between items-center sticky bottom-0 rounded-b-xl border-b-0">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-slate-500"><CheckSquare size={16} className="mr-2" /> Mark for Review</Button>
                                        <Button variant="outline" size="sm" className="text-slate-500"><Calculator size={16} className="mr-2" /> Calculator</Button>
                                        <Button variant="outline" size="sm" className="text-slate-500"><FileText size={16} className="mr-2" /> Notes</Button>
                                    </div>
                                    <div className="flex gap-2">
                                        {config.allowBackNavigation && (
                                            <Button
                                                variant="outline"
                                                disabled={currentIndex === 0}
                                                onClick={() => setCurrentIndex(prev => prev - 1)}
                                            >
                                                Previous
                                            </Button>
                                        )}
                                        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                                            {currentIndex === examItems.length - 1 ? 'Finish Exam' : 'Next Question'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">Loading Question...</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
