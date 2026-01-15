import React, { useState } from 'react';
import { CatEngine } from '../learning/CatEngine';
import { CatSession } from '../types/learning-schema';
import { fetchNextQuestion } from '../services/QuestionService';
import { StudentHistoryService } from '../services/StudentHistoryService';
// Removed unused generateQuestions import
import { MasterQuestionItem } from '../../types/master-schema';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Button } from '../../components/ui/button';
// Removed unused Card imports
import { Brain, CheckCircle, XCircle, GraduationCap, Timer } from 'lucide-react';

type ExamMode = 'TUTOR' | 'REAL_EXAM';

export const AdaptiveCatMode: React.FC<{ studentId: string; onExit: () => void }> = ({ studentId, onExit }) => {
    // Session State
    const [engine, setEngine] = useState<CatEngine | null>(null);
    const [session, setSession] = useState<CatSession | null>(null);
    const [mode, setMode] = useState<ExamMode>('TUTOR');

    // Quiz State
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'QUESTION' | 'FEEDBACK' | 'FINISHED'>('IDLE');
    const [currentItem, setCurrentItem] = useState<MasterQuestionItem | null>(null);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctCount: number; incorrectCount: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initial Start
    const startExam = async (selectedMode: ExamMode) => {
        setMode(selectedMode);
        const newEngine = CatEngine.startSession(studentId);
        setEngine(newEngine);
        setSession(newEngine.getSession());
        setStatus('LOADING');
        await loadNextQuestion(newEngine);
    };

    // Load Next Question based on Engine Target
    const loadNextQuestion = async (currentEngine: CatEngine) => {
        try {
            setError(null);
            const target = currentEngine.getNextItemTarget();

            // Use the new QuestionService to fetch from the BANK first
            // Fallback to AI is allowed if bank is empty (for demo purposes), but bank is prioritized.
            const sessionExcludes = session?.history.map(h => h.questionId) || [];
            const globalExcludes = StudentHistoryService.getAnsweredIds(studentId); // Load global history
            const allExcludedIds = Array.from(new Set([...sessionExcludes, ...globalExcludes]));

            const globalSigs = StudentHistoryService.getAnsweredSignatures(studentId); // Load global content hashes

            console.log(`[AdaptiveCatMode] Loading next question. Excluded IDs: ${allExcludedIds.length}, Excluded Sigs: ${globalSigs.length}`);

            const item = await fetchNextQuestion({
                targetDifficulty: target.level as number,
                excludedIds: allExcludedIds,
                excludedSignatures: globalSigs,
                allowAiFallback: true
            });

            if (item) {
                // Ensure difficulty level is set (if missing from item)
                if (!item.pedagogy) item.pedagogy = {} as any;
                if (!item.pedagogy.difficultyLevel) item.pedagogy.difficultyLevel = target.level as 1 | 2 | 3 | 4 | 5;

                setCurrentItem(item);
                setStatus('QUESTION');
            } else {
                throw new Error("No available questions found in Bank or Generator.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load question. Bank might be empty.");
            setStatus('IDLE');
        }
    };

    const processResult = (isCorrect: boolean) => {
        if (!engine || !currentItem) return;

        const newSession = engine.processAnswer(currentItem, isCorrect, 60); // 60s assumed

        // Mark as answered in global history
        // Mark as answered in global history (ID + Content Hash)
        if (currentItem.id) {
            const itemAny = currentItem as any;
            const sig = itemAny.stem || itemAny.questionText || itemAny.prompt || JSON.stringify(itemAny.content);
            const cleanSig = sig?.toString().trim().toLowerCase().replace(/\s+/g, '').substring(0, 100);
            StudentHistoryService.markAsAnswered(studentId, currentItem.id, cleanSig);
        }

        setSession({ ...newSession }); // Clone to trigger re-render

        if (mode === 'TUTOR') {
            setFeedback({ isCorrect, correctCount: isCorrect ? 1 : 0, incorrectCount: isCorrect ? 0 : 1 });
            setStatus('FEEDBACK');
        } else {
            // REAL EXAM mode: Skip feedback, go to next immediately
            // Check if finished first
            if (newSession.status !== 'OPTIMIZING') {
                setStatus('FINISHED');
            } else {
                setStatus('LOADING');
                loadNextQuestion(engine);
            }
        }
    };

    const handleNext = () => {
        if (!engine || !session) return;

        // In Tutor mode we want to continue through the item bank regardless of the CAT stopping status,
        // only stop when the maximum number of questions is reached.
        if (mode === 'TUTOR') {
            const maxQuestions = session.config?.maxQuestions ?? 150;
            if (session.itemsAnswered >= maxQuestions) {
                setStatus('FINISHED');
            } else {
                setStatus('LOADING');
                loadNextQuestion(engine);
            }
        } else {
            // Real Exam mode respects the CAT stopping condition
            if (session.status !== 'OPTIMIZING') {
                setStatus('FINISHED');
            } else {
                setStatus('LOADING');
                loadNextQuestion(engine);
            }
        }
    };

    // RENDERERS --------------------------------------------------------------

    if (status === 'IDLE') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 max-w-4xl mx-auto text-center space-y-8">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Brain className="w-16 h-16 text-blue-600 dark:text-blue-300" />
                </div>

                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl font-black tracking-tight">Adaptive NCLEX Simulation</h1>
                    <p className="text-slate-500 text-lg">
                        Select your exam mode. The Computer Adaptive Testing (CAT) algorithm works identically in both modes, adjusting difficulty to your ability level.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    {/* TUTOR MODE CARD */}
                    <div
                        onClick={() => startExam('TUTOR')}
                        className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl cursor-pointer transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                            <GraduationCap size={100} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><GraduationCap size={24} /></div>
                            <h3 className="text-xl font-bold">Tutor Mode</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600 mb-6">
                            <li className="flex items-center gap-2">✅ Immediate Rationales</li>
                            <li className="flex items-center gap-2">✅ "Why Correct/Incorrect" Feedback</li>
                            <li className="flex items-center gap-2">✅ Low Stress Learning</li>
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Tutor Mode</Button>
                    </div>

                    {/* REAL EXAM MODE CARD */}
                    <div
                        onClick={() => startExam('REAL_EXAM')}
                        className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-red-500 hover:shadow-xl cursor-pointer transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                            <Timer size={100} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Timer size={24} /></div>
                            <h3 className="text-xl font-bold">Real Exam Mode</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600 mb-6">
                            <li className="flex items-center gap-2">🚫 No Rationales During Exam</li>
                            <li className="flex items-center gap-2">🚫 Simulates Test Day Pressure</li>
                            <li className="flex items-center gap-2">✅ Full Report at End</li>
                        </ul>
                        <Button variant="destructive" className="w-full">Start Real Exam</Button>
                    </div>
                </div>

                {error && <div className="text-red-500 font-bold bg-red-50 p-4 rounded-lg border border-red-100">{error}</div>}
            </div>
        );
    }

    if (status === 'FINISHED' && session) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Exam Completed</h1>
                <div className={`text-6xl font-black ${session.status === 'PASSED' ? 'text-green-500' : 'text-red-500'}`}>
                    {session.status}
                </div>
                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="text-center p-4 border rounded-xl">
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Final Ability (Theta)</div>
                        <div className="text-4xl font-mono mt-2">{session.currentTheta.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground mt-1">Passing Std: 0.00</div>
                    </div>
                    <div className="text-center p-4 border rounded-xl">
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Items Answered</div>
                        <div className="text-4xl font-mono mt-2">{session.itemsAnswered}</div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Performance Trend</h3>
                    <div className="h-16 flex items-end justify-between gap-1">
                        {session.history.map((h, i) => (
                            <div key={i} className="w-full bg-blue-200 relative group" style={{ height: `${((h.thetaAfter + 3) / 6) * 100}%` }}>
                                <div className={`absolute top-0 w-full h-1 ${h.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <Button onClick={onExit} variant="outline">Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="h-16 px-6 bg-white dark:bg-slate-800 border-b flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-1.5 rounded-lg ${mode === 'TUTOR' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {mode === 'TUTOR' ? <GraduationCap size={18} /> : <Timer size={18} />}
                    </div>
                    <span className="font-bold text-xl">
                        {mode === 'TUTOR' ? 'Tutor Mode' : 'Real Exam Mode'}
                    </span>
                    <span className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full font-mono">
                        Question {session?.itemsAnswered! + 1}
                    </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onExit}>Exit Exam</Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative">
                {status === 'LOADING' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/50 z-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {currentItem && (
                    <div className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl min-h-[60vh] flex flex-col">
                            <StudentPreviewModal
                                item={currentItem}
                                onClose={handleNext}
                                hideRationales={mode === 'REAL_EXAM'}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Controls */}
            <div className="h-24 bg-white dark:bg-slate-800 border-t px-8 flex items-center justify-between z-10">
                {status === 'QUESTION' ? (
                    <div className="flex items-center gap-4 w-full justify-center">
                        <div className="flex flex-col items-center gap-2 p-2 px-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <span className="text-xs font-bold text-yellow-800 uppercase">SIMULATE ACTION ({mode})</span>
                            {/* In Real Exam, this acts as the "Next" button after selection. In Tutor, it reveals feedback. */}
                            <div className="flex gap-2">
                                <Button onClick={() => processResult(false)} variant="destructive" className="w-32">
                                    <XCircle className="mr-2 h-4 w-4" /> Incorrect
                                </Button>
                                <Button onClick={() => processResult(true)} className="bg-green-600 hover:bg-green-700 w-32">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Correct
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : status === 'FEEDBACK' ? (
                    <div className="flex items-center gap-4 w-full justify-between">
                        <div className={`text-lg font-bold ${feedback?.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                            {feedback?.isCorrect ? 'Correct!' : 'Incorrect'}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                Difficulty updated for next item.
                            </span>
                        </div>
                        <Button onClick={handleNext} size="lg">Next Question &rarr;</Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

