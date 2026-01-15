import React, { useState } from 'react'; // Re-trigger build
import { WeaknessDetectionEngine, DetectedWeakness } from '../learning/WeaknessDetectionEngine';
import { generateQuestions } from '../../services/questionGenerationService';
import { MasterQuestionItem } from '../../types/master-schema';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Button } from '../../components/ui/button';
// Simple local Progress component to avoid import resolution issues in some environments
const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number | null }>(
    ({ className, value, ...props }, ref) => (
        <div ref={ref} className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`} {...props}>
            <div className="h-full w-full flex-1 bg-red-600 transition-all" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
        </div>
    )
);
Progress.displayName = "Progress";
import { Target, TrendingUp, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

export const WeaknessAttackMode: React.FC<{
    studentId: string;
    weakness: DetectedWeakness;
    onExit: () => void;
    onComplete: (score: number) => void;
}> = ({ weakness, onExit, onComplete }) => {

    const config = weakness.recommendedDrill;

    // State
    const [status, setStatus] = useState<'LOADING' | 'INTRO' | 'DRILL' | 'SUMMARY'>('INTRO');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState<MasterQuestionItem[]>([]);
    const [loadingItem, setLoadingItem] = useState(false);

    // Performance Tracking
    const [history, setHistory] = useState<boolean[]>([]);

    // Use generic number type for flexible difficulty scaling
    const [currentDiff, setCurrentDiff] = useState<number>(config.startDifficulty);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [coachingMsg, setCoachingMsg] = useState<string | null>(null);

    // Generate Initial Batch
    const startDrill = async () => {
        setStatus('LOADING');
        // Pre-load first item
        await loadNextItem(config.startDifficulty);
        setStatus('DRILL');
    };

    const loadNextItem = async (difficulty: number) => {
        setLoadingItem(true);
        try {
            // Mock Fetch targeted item
            const response = await generateQuestions({
                mode: 'ai',
                clinicalFocus: config.focusDomains,
                difficultyLevel: difficulty as 1 | 2 | 3 | 4 | 5,
                quantityPerType: 1,
                targetTypes: config.focusTypes || ['multiple-choice', 'case-study'], // Default mix
                temperature: 0.7,
                selectedReferenceIds: [],
                aiPrompt: `A specific question about ${config.topic}`,
                manualContext: '',
                advanced: {
                    includeAnswerKeys: true,
                    includeRationales: true,
                    detectDuplicates: false,
                    flagCopyright: false,
                    paraphraseStrictness: 'standard'
                }
            }, []);

            if (response.data && response.data[0]) {
                const newItem = response.data[0];
                // Hydrate difficulty
                if (!newItem.pedagogy) newItem.pedagogy = {} as any;
                newItem.pedagogy.difficultyLevel = difficulty as 1 | 2 | 3 | 4 | 5;

                setItems(prev => [...prev, newItem]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingItem(false);
        }
    };

    const processAnswer = (isCorrect: boolean) => {
        // Record
        const newHistory = [...history, isCorrect];
        setHistory(newHistory);
        const newStreak = isCorrect ? currentStreak + 1 : 0;
        setCurrentStreak(newStreak);

        // Coaching
        setCoachingMsg(WeaknessDetectionEngine.getCoachingMessage(isCorrect, newStreak));

        // Adapt Difficulty
        const nextDiff = WeaknessDetectionEngine.getAdaptiveDifficulty(currentDiff, newHistory, config.adaptiveRules);
        setCurrentDiff(nextDiff);

        // Prepare Next
        if (currentIndex + 1 < config.itemCount) {
            // Load next in background while user reads rationale? 
            // Ideally we load next now.
            loadNextItem(nextDiff);
        }
    };

    const handleNext = () => {
        setCoachingMsg(null);
        if (currentIndex < config.itemCount - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            finishDrill();
        }
    };

    const finishDrill = () => {
        setStatus('SUMMARY');
        const correct = history.filter(x => x).length;
        const score = Math.round((correct / history.length) * 100);
        onComplete(score);
    };

    // RENDERERS

    if (status === 'INTRO') {
        return (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 text-center">
                <div className="mb-6 p-6 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Target className="w-16 h-16 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Weakness Detect: {weakness.topic}</h1>
                <p className="text-xl text-slate-600 mb-8">
                    We noticed your accuracy is <b>{weakness.currentScore}%</b> in this area.
                    Let's fix that with a quick, targeted drill.
                </p>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm w-full mb-8 text-left">
                    <h3 className="font-bold text-slate-500 uppercase text-sm mb-4">Drill Plan</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Topic Focus</span>
                            <span className="font-mono font-bold">{config.topic}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Intensity</span>
                            <span className="font-mono font-bold">{config.itemCount} Questions</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Strategy</span>
                            <span className="font-mono font-bold capitalize">{config.adaptiveRules} Mode</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onExit}>Ignore for Now</Button>
                    <Button size="lg" onClick={startDrill} className="bg-red-600 hover:bg-red-700 text-white">
                        <Zap className="w-4 h-4 mr-2" /> Attack Weakness
                    </Button>
                </div>
            </div>
        );
    }

    if (status === 'SUMMARY') {
        const correct = history.filter(x => x).length;
        const score = Math.round((correct / history.length) * 100);
        const improved = score > weakness.currentScore;

        return (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 text-center">
                <h1 className="text-4xl font-black mb-4">Drill Complete!</h1>

                <div className="relative mb-8">
                    <div className={`text-6xl font-black ${improved ? 'text-green-600' : 'text-slate-600'}`}>
                        {score}%
                    </div>
                    {improved && (
                        <div className="absolute -right-16 top-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +{score - weakness.currentScore}%
                        </div>
                    )}
                </div>

                <p className="text-xl text-slate-600 mb-8">
                    {improved
                        ? "Great work! You've successfully strengthened this topic."
                        : "Good effort. Keep practicing to master this area."}
                </p>

                <Button size="lg" onClick={onExit}>Return to Dashboard</Button>
            </div>
        );
    }

    // DRILL UI
    const currentItem = items[currentIndex];

    // MVP: Simulate grading state since StudentPreviewModal is read-only for now
    // In a real app, StudentPreviewModal would emit "onAnswer"
    const [simulatedAnswerState, setSimulatedAnswerState] = useState<'UNANSWERED' | 'REVIEW'>('UNANSWERED');

    const handleSimulatedAnswer = (correct: boolean) => {
        setSimulatedAnswerState('REVIEW');
        processAnswer(correct);
    };

    const handleNextQuestion = () => {
        setSimulatedAnswerState('UNANSWERED');
        handleNext();
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="h-16 px-6 bg-white dark:bg-slate-800 border-b flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4 w-full">
                    <ShieldAlert className="text-red-600" />
                    <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase">
                            <span>{config.title}</span>
                            <span>{currentIndex + 1} / {config.itemCount}</span>
                        </div>
                        <Progress value={((currentIndex) / config.itemCount) * 100} className="h-2" />
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onExit} className="ml-4">Exit</Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {(!currentItem || loadingItem && !currentItem) ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl min-h-[50vh] flex flex-col relative">
                            {/* Overlay Message */}
                            {coachingMsg && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-2 rounded-full shadow-lg font-bold animate-in fade-in slide-in-from-top-4">
                                    {coachingMsg}
                                </div>
                            )}

                            <StudentPreviewModal item={currentItem} onClose={() => { }} />

                            {/* Simulated Controls Overlay */}
                            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-800 border-t flex items-center justify-between z-40">
                                {simulatedAnswerState === 'UNANSWERED' ? (
                                    <div className="flex items-center gap-4 w-full justify-center bg-yellow-50 p-2 rounded border border-yellow-200">
                                        <span className="text-xs font-bold text-yellow-800 uppercase">SIMULATE ANSWER</span>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleSimulatedAnswer(false)} variant="destructive">
                                                Missed It
                                            </Button>
                                            <Button onClick={() => handleSimulatedAnswer(true)} className="bg-green-600 hover:bg-green-700">
                                                Got It Right
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end w-full">
                                        <Button onClick={handleNextQuestion} size="lg" className="w-full md:w-auto">
                                            Next Question <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
