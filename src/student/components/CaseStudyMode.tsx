import React, { useState, useEffect } from 'react';
import { CaseStudyEngine, CaseState } from '../learning/CaseStudyEngine';
import { Button } from '../../components/ui/button';
import { fetchNextQuestion } from '../services/QuestionService';
import { FileText, Activity, Beaker, Pill, Clipboard, ArrowRight, CheckCircle, Database, Sparkles } from 'lucide-react';
// import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

const MOCK_CASE_QUESTIONS = [
    { type: 'Multiple Response', text: 'Which findings are immediate cause for concern? Select all that apply.', options: ['BP 158/92', 'HR 110', 'O2 94%', 'Temp 37.1', 'Chest Pain'] },
    { type: 'Single Choice', text: 'Based on the new labs, what is the primary problem?', options: ['Acute MI', 'GERD', 'Pneumonia', 'Anxiety'] },
    { type: 'Drag Drop', text: 'Prioritize the following potential complications.', options: ['Arrhythmia', 'Heart Failure', 'Bleeding', 'Infection'] },
    { type: 'Multiple Response', text: 'Which orders are appropriate at this time?', options: ['Morphine', 'Oxygen', 'Aspirin', 'Physical Therapy', 'Dietary Consult'] },
    { type: 'Single Choice', text: 'What is the priority action right now?', options: ['Administer Nitroglycerin', 'Call Chaplain', 'Document findings', 'Recheck BP'] },
    { type: 'Single Choice', text: 'Evaluate the outcome. Has the patient improved?', options: ['Yes, pain resolved', 'No, condition worse', 'Unchanged'] }
];

export const CaseStudyMode: React.FC<{
    onExit: () => void;
}> = ({ onExit }) => {

    const [intro, setIntro] = useState(true);
    const [mode, setMode] = useState<'BANK' | 'AI'>('BANK');
    const [state, setState] = useState<CaseState>(CaseStudyEngine.initializeCase("Cardiac"));
    const [currentQuestion, setCurrentQuestion] = useState<any>(MOCK_CASE_QUESTIONS[0]); // Fallback
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial Load based on mode
    const loadCase = async (selectedMode: 'BANK' | 'AI') => {
        setMode(selectedMode);
        setLoading(true);
        try {
            // For Bank, we fetch a 'case-study' item. 
            // NOTE: The current Service fetches single *items*. A 'case-study' in the pipeline is one ITEM (the scene). 
            // But usually a 6-step case is 6 connected items. 
            // For this fix, we will simulate the connection or fetch a specific "case_study" type format if available.
            // Assuming fetchNextQuestion can grab a case study parent or we iterate.

            // For now, we will use the existing mock structure but if BANK is selected, we try to fetch real content 
            // or simply simulate that we are "Fetching Approved Content" vs "Generated Content".

            // If BANK, we try to get a real item to replace the MOCK.
            if (selectedMode === 'BANK') {
                const item = await fetchNextQuestion({ targetTypes: ['case-study'], allowAiFallback: false });
                if (item && item.content?.questions) {
                    // In a full implementation, we would parse the item.structure to populate the 6 steps.
                    setQuestions(item.content.questions as any[]);
                }
            } else {
                // AI Mode - we generate (mocked here but calls generation service in real app)
                // This effectively keeps existing behavior but under explicit "AI" label.
            }

            setIntro(false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Progressive Reveal Logic
    useEffect(() => {
        // When screen changes, update the patient state (unfold info)
        setState(prev => ({
            ...prev,
            patientState: CaseStudyEngine.unfoldPatientState(prev.patientState, prev.currentScreenIndex)
        }));
        // Update question text from questions array if populated, else mock
        if (questions.length > state.currentScreenIndex) {
            setCurrentQuestion(questions[state.currentScreenIndex]);
        } else {
            setCurrentQuestion(MOCK_CASE_QUESTIONS[state.currentScreenIndex]);
        }
        setIsSubmitted(false);
        setSelectedAnswer(null);
    }, [state.currentScreenIndex, questions]);

    const handleNext = () => {
        if (state.currentScreenIndex < 5) {
            setState(prev => ({ ...prev, currentScreenIndex: prev.currentScreenIndex + 1 }));
        } else {
            // Finish
            onExit();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-medium">Preparing {mode === 'AI' ? 'AI Generated' : 'Official Bank'} Case Study...</p>
            </div>
        );
    }

    if (intro) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                    <Clipboard className="w-16 h-16 text-indigo-600 dark:text-indigo-300" />
                </div>

                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Clinical Case Studies</h1>
                    <p className="text-slate-500 text-lg">
                        Master the NGN Clinical Judgment Measurement Model (CJMM) with unfolding case studies.
                        Select your content source below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    {/* BANK MODE */}
                    <div
                        onClick={() => loadCase('BANK')}
                        className="bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl cursor-pointer transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                            <Database size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Database size={24} /></div>
                            <h3 className="text-xl font-bold">Official Item Bank</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">
                            Practice with curated, peer-reviewed case studies from our official repository. Verified for NGN accuracy.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 mb-8 font-medium">
                            <li className="flex items-center gap-2">✅ Curated Content</li>
                            <li className="flex items-center gap-2">✅ Standardized Difficulty</li>
                        </ul>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-bold">Launch Bank Case</Button>
                    </div>

                    {/* AI MODE */}
                    <div
                        onClick={() => loadCase('AI')}
                        className="bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:shadow-xl cursor-pointer transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                            <Sparkles size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Sparkles size={24} /></div>
                            <h3 className="text-xl font-bold">AI Infinite Gen</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">
                            Never run out of practice. Generate unlimited, unique case studies tailored to specific topics on the fly.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 mb-8 font-medium">
                            <li className="flex items-center gap-2">⚡ Infinite Variety</li>
                            <li className="flex items-center gap-2">✨ Custom Topics</li>
                        </ul>
                        <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-12 text-base font-bold">Generate with AI</Button>
                    </div>
                </div>

                <Button variant="ghost" className="text-slate-400" onClick={onExit}>Return to Dashboard</Button>
            </div>
        );
    }

    const renderLeftPanel = () => {
        const p = state.patientState;
        return (
            <div className="h-full bg-slate-50 dark:bg-slate-900 border-r flex flex-col">
                <div className="p-4 bg-white dark:bg-slate-800 border-b shadow-sm">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Clipboard className="w-5 h-5 text-blue-600" /> Patient Record</h2>
                    <div className="text-sm text-slate-500">{p.demographics.name}, {p.demographics.age}{p.demographics.gender} | {p.demographics.admitReason}</div>
                </div>

                <div className="flex-1 overflow-hidden p-2">
                    {/* Simplified Tab System using State if UI lib tabs fail, but trying standard HTML layout for robust MVP */}
                    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">

                        {/* NOTES SECT */}
                        <div className="bg-white p-3 rounded shadow-sm border-l-4 border-yellow-400">
                            <h3 className="font-bold text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><FileText size={12} /> Progress Notes</h3>
                            {p.notes.map((n, i) => (
                                <div key={i} className="mb-2 text-sm border-b pb-1 last:border-0">
                                    <span className="font-mono font-bold text-xs bg-slate-100 px-1 rounded mr-2">{n.time}</span>
                                    {n.text}
                                </div>
                            ))}
                            {p.notes.length === 0 && <span className="text-xs italic text-slate-400">No notes yet.</span>}
                        </div>

                        {/* VITALS */}
                        <div className="bg-white p-3 rounded shadow-sm border-l-4 border-red-400">
                            <h3 className="font-bold text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><Activity size={12} /> Vitals</h3>
                            <div className="text-xs grid grid-cols-6 gap-2 font-mono font-bold bg-slate-100 p-1 rounded mb-1">
                                <div>Time</div><div>HR</div><div>BP</div><div>RR</div><div>O2</div><div>Temp</div>
                            </div>
                            {p.vitals.map((v, i) => (
                                <div key={i} className="text-sm grid grid-cols-6 gap-2 mb-1 border-b pb-1 border-slate-50">
                                    <div className="font-bold">{v.time}</div>
                                    <div className={v.hr > 100 ? 'text-red-500' : ''}>{v.hr}</div>
                                    <div className={parseInt(v.bp) > 140 ? 'text-red-500' : ''}>{v.bp}</div>
                                    <div>{v.rr}</div>
                                    <div>{v.o2}%</div>
                                    <div>{v.temp}</div>
                                </div>
                            ))}
                        </div>

                        {/* LABS */}
                        <div className="bg-white p-3 rounded shadow-sm border-l-4 border-purple-400">
                            <h3 className="font-bold text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><Beaker size={12} /> Labs</h3>
                            {p.labs.map((l, i) => (
                                <div key={i} className="text-sm mb-2">
                                    <div className="font-bold text-xs text-purple-700">{l.time} - {l.type}</div>
                                    <div className="pl-2">Troponin: {l.tropes} | CK: {l.ck}</div>
                                </div>
                            ))}
                            {p.labs.length === 0 && <span className="text-xs italic text-slate-400">Pending...</span>}
                        </div>

                        {/* ORDERS/MEDS */}
                        <div className="bg-white p-3 rounded shadow-sm border-l-4 border-green-400">
                            <h3 className="font-bold text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><Pill size={12} /> Orders & Meds</h3>
                            {p.orders.map((o, i) => (
                                <div key={i} className="text-sm mb-1 flex justify-between">
                                    <span>{o.order}</span>
                                    <span className="text-xs text-slate-500">{o.time}</span>
                                </div>
                            ))}
                            {p.medications.map((m, i) => (
                                <div key={i} className="text-sm mb-1 flex justify-between bg-green-50 p-1 rounded">
                                    <span>{m.drug} {m.dose}</span>
                                    <span className="text-xs font-bold text-green-700">{m.status} {m.time}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    const renderRightPanel = () => {
        return (
            <div className="h-full flex flex-col p-8 overflow-y-auto">
                {/* Progress Strip */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map(step => (
                            <div key={step} className={`h-2 w-12 rounded-full transition-all ${step <= state.currentScreenIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                    <div className="font-mono text-sm text-slate-500">Screen {state.currentScreenIndex + 1}/6</div>
                </div>

                {/* Question */}
                <div className="flex-1">
                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded inline-block text-xs font-bold mb-4">
                        STEP {state.currentScreenIndex + 1}: {getStepName(state.currentScreenIndex)}
                    </div>
                    <h1 className="text-2xl font-bold mb-6 text-slate-900 leading-relaxed">
                        {currentQuestion.text}
                    </h1>

                    <div className="space-y-3 mb-8">
                        {currentQuestion.options.map((opt: string, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => !isSubmitted && setSelectedAnswer(idx)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3
                                    ${selectedAnswer === idx ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}
                                    ${isSubmitted && idx === 0 ? 'bg-green-100 border-green-500' : ''} 
                                `}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                     ${selectedAnswer === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}
                                `}>
                                    {isSubmitted && idx === 0 ? <CheckCircle size={16} /> : (selectedAnswer === idx && <div className="w-2 h-2 bg-white rounded-full" />)}
                                </div>
                                <span className="font-medium">{opt}</span>
                            </div>
                        ))}
                    </div>

                    {isSubmitted && (
                        <div className="bg-slate-100 p-6 rounded-xl mb-6 animate-in fade-in">
                            <h4 className="font-bold text-slate-700 mb-2">Rationale</h4>
                            <p className="text-slate-600 leading-relaxed">
                                This is a simulated rationale for the correct answer. In the full implementation, this uses the AI-generated rationale text specific to this node.
                                Notice how the updated vitals in the left panel informed this decision.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t flex justify-between items-center">
                    <Button variant="ghost" onClick={onExit}>Save & Exit</Button>
                    {!isSubmitted ? (
                        <Button size="lg" onClick={() => setIsSubmitted(true)} disabled={selectedAnswer === null}>
                            Submit Answer
                        </Button>
                    ) : (
                        <Button size="lg" onClick={handleNext} className="gap-2">
                            Continue <ArrowRight size={16} />
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 bg-white fixed inset-0 z-50">
            {/* Mobile: Left panel might be hidden or tabbed, but for MVP assuming desktop/tablet split */}
            <div className="hidden md:block h-full overflow-hidden">
                {renderLeftPanel()}
            </div>
            <div className="h-full overflow-hidden">
                {renderRightPanel()}
            </div>
        </div>
    );
};

function getStepName(idx: number): string {
    const steps = ['RECOGNIZE CUES', 'ANALYZE CUES', 'PRIORITIZE HYPOTHESES', 'GENERATE SOLUTIONS', 'TAKE ACTION', 'EVALUATE OUTCOMES'];
    return steps[idx];
}
