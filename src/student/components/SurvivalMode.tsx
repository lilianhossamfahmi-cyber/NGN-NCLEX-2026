import React, { useState, useEffect } from 'react';
import { SurvivalEngine, SurvivalState } from '../learning/SurvivalEngine';
import { fetchNextQuestion } from '../services/QuestionService';
import { MasterQuestionItem } from '../../types/master-schema';
// import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Button } from '../../components/ui/button';
import { Heart, Flame, AlertTriangle } from 'lucide-react';
// Re-use the inlined one or standard if available
const SimpleProgress: React.FC<{ value: number, className?: string }> = ({ value, className }) => (
    <div className={`h-2 bg-slate-800/30 rounded-full overflow-hidden ${className}`}>
        <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
);

// Unused variables cleared for clean build
export const SurvivalMode: React.FC<{
    onExit: () => void;
}> = ({ onExit }) => {

    const [state, setState] = useState<SurvivalState>(SurvivalEngine.getInitialState());
    const [currentItem, setCurrentItem] = useState<MasterQuestionItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);



    // Initial Load
    useEffect(() => {
        loadNextLevel();
    }, []);

    const loadNextLevel = async () => {
        setLoading(true);
        setShowFeedback(null);
        try {
            // Difficulty Ladder Logic:
            // Levels 1-5. 5 Questions per level.
            // If player answers 5 correctly in a row (or cumulative), they level up.
            // Current level is state.level.

            const targetDiff = Math.min(5, state.level);

            // Fetch real item from bank
            const item = await fetchNextQuestion({
                targetDifficulty: targetDiff,
                // Survival Mode: Broadened to allow ALL question types (Bow Tie, Highlight, etc)
                // We prioritize Level, but if bank is sparse, QuestionService's fuzzy logic matches +/- 1 level.
                targetTypes: ['multiple-choice', 'choice', 'true-false', 'bow-tie', 'highlight', 'sata'],
                allowAiFallback: true
            });

            if (item) {
                setCurrentItem(item);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // MVP: Intercept answer
    // In real app, StudentPreviewModal emits onAnswer. 
    // We wrap it in a container that simulates the answer for now.
    const handleSimulatedAnswer = (isCorrect: boolean) => {
        const newState = SurvivalEngine.processAnswer(state, isCorrect);
        setState(newState);

        if (isCorrect) {
            setShowFeedback('CORRECT');
            setTimeout(() => {
                loadNextLevel();
            }, 1000); // 1s celebration
        } else {
            setShowFeedback('WRONG');
            if (newState.isGameOver) {
                // Stay on screen to show Game Over
            } else {
                setTimeout(() => {
                    loadNextLevel();
                }, 1500); // Longer pause for failure
            }
        }
    };

    if (state.isGameOver) {
        return (
            <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-800 text-white p-8 rounded-2xl max-w-md w-full text-center borderBorder-slate-700 shadow-2xl">
                    <div className="mb-6 flex justify-center">
                        <Heart className="w-24 h-24 text-slate-700 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black mb-2 text-red-500">GAME OVER</h1>
                    <p className="text-slate-400 mb-8 text-lg">You ran out of lives!</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-700 p-4 rounded-xl">
                            <div className="text-xs text-slate-400 uppercase font-bold">Total Score</div>
                            <div className="text-3xl font-mono text-yellow-400">{state.score.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-700 p-4 rounded-xl">
                            <div className="text-xs text-slate-400 uppercase font-bold">Best Streak</div>
                            <div className="text-3xl font-mono text-orange-400">{state.streak} 🔥</div>
                        </div>
                    </div>

                    <Button size="lg" className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold" onClick={onExit}>
                        Return to Base
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col text-white">
            {/* GAMIFIED HEADER */}
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-8 shadow-lg z-20">

                {/* LIVES */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => {
                        if (i > SurvivalEngine.MAX_LIVES) return null;
                        const hasLife = i <= state.lives;
                        return (
                            <Heart
                                key={i}
                                className={`w-6 h-6 transition-all duration-300 ${hasLife ? 'fill-red-500 text-red-600' : 'fill-slate-700 text-slate-800'}`}
                            />
                        )
                    })}
                </div>

                {/* CENTRAL HUD */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Streak</span>
                        <div className={`text-xl font-black font-mono flex items-center gap-1 ${state.streak > 9 ? 'text-orange-500' : 'text-white'}`}>
                            {state.streak} <Flame size={16} className={`${state.streak > 4 ? 'animate-pulse text-orange-500' : 'text-slate-600'}`} />
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
                        <div className="text-xl font-black font-mono text-yellow-400">
                            {state.score.toLocaleString()}
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
                        <div className="text-xl font-black font-mono text-blue-400">
                            {state.level}
                        </div>
                    </div>
                </div>

                {/* EXIT */}
                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={onExit}>
                    Exit
                </Button>
            </div>

            {/* MAIN GAME AREA */}
            <div className={`flex-1 relative overflow-hidden transition-all duration-300 ${showFeedback === 'WRONG' ? 'bg-red-900/20' : ''}`}>

                {loading && !currentItem && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent" />
                    </div>
                )}

                {currentItem && !loading && (
                    <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col justify-center">
                        {/* QUESTION CARD */}
                        <div className={`bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-700 relative overflow-hidden
                            ${showFeedback === 'CORRECT' ? 'ring-4 ring-green-500 scale-[1.02] transition-transform' : ''}
                            ${showFeedback === 'WRONG' ? 'ring-4 ring-red-500 translate-x-1 transition-transform' : ''}
                         `}>
                            {/* FEEDBACK OVERLAY */}
                            {showFeedback && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm animate-in fade-in">
                                    <div className="text-center">
                                        {showFeedback === 'CORRECT' ? (
                                            <>
                                                <div className="text-6xl mb-2">🎉</div>
                                                <h2 className="text-4xl font-black text-green-400 mb-2">PERFECT!</h2>
                                                <div className="text-yellow-400 font-mono text-xl">
                                                    +{Math.round(100 * state.multiplier)} PTS <span className="text-xs text-white opacity-50">({state.multiplier}x)</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-6xl mb-2">💔</div>
                                                <h2 className="text-4xl font-black text-red-500 mb-2">MISSED IT</h2>
                                                <div className="text-slate-400">Streak Lost</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                    {currentItem.typeId || 'Question'}
                                </span>
                                <SimpleProgress value={(state.questionCount % 10) * 10} className="w-24" />
                            </div>

                            <h2 className="text-xl font-bold mb-8 leading-relaxed">
                                <span dangerouslySetInnerHTML={{ __html: currentItem.content?.case_study?.scenario || currentItem.content?.prompt || "Question Text" }} />
                            </h2>

                            {/* DYNAMIC OPTIONS RENDERER */}
                            <div className="grid grid-cols-1 gap-3">
                                {/* Parse options from the item structure.
                                    This is a simplified renderer. A full one would use a proper QuestionComponent.
                                */}
                                {(currentItem.typeId === 'multiple-choice' || currentItem.typeId === 'choice') ? (
                                    // Try to parse options if available in specific format, or fallback
                                    // Assuming 'options' field exists in some normalized way or we extract from prompt
                                    // For MVP of this mode, we will assume standard structure or fallbacks.
                                    // Since MasterQuestionItem structure is complex, we'll try to use the 'bow-tie' or standard options if present.
                                    // If not easily parseable, these buttons are placeholders for the REAL render.
                                    <>
                                        {/* Simulating extracted options for the fetched item */}
                                        <Button onClick={() => handleSimulatedAnswer(true)} variant="outline" className="h-16 text-lg justify-start px-6 border-slate-600 hover:bg-slate-700 text-slate-200">
                                            (Click to Simulate Correct Answer)
                                        </Button>
                                        <Button onClick={() => handleSimulatedAnswer(false)} variant="outline" className="h-16 text-lg justify-start px-6 border-slate-600 hover:bg-slate-700 text-slate-200">
                                            (Click to Simulate Wrong Answer)
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="mb-4">Complex Item Type ({currentItem.typeId})</p>
                                        <div className="flex justify-center gap-4">
                                            <Button onClick={() => handleSimulatedAnswer(true)} className="bg-green-600 hover:bg-green-700">Mark Correct</Button>
                                            <Button onClick={() => handleSimulatedAnswer(false)} className="bg-red-600 hover:bg-red-700">Mark Incorrect</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 text-center text-slate-500 text-sm font-mono">
                            SESSION TIME: 4:32
                        </div>
                    </div>
                )}
                {/* EMPTY STATE */}
                {!loading && !currentItem && (
                    <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                        <div className="bg-slate-800 p-6 rounded-full mb-4 opacity-50">
                            <AlertTriangle className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
                        <p className="text-slate-400 max-w-md">
                            We couldn't find any questions matching this difficulty level in the bank, and AI generation failed.
                        </p>
                        <Button variant="outline" className="mt-6 border-slate-600 hover:bg-slate-800" onClick={onExit}>
                            Return to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
