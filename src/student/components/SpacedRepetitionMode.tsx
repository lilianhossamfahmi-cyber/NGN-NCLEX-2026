import React, { useState, useEffect } from 'react';
import { SpacedRepetitionEngine, SRSItemState } from '../learning/SpacedRepetitionEngine';
import { fetchNextQuestion } from '../services/QuestionService';
import { MasterQuestionItem } from '../../types/master-schema';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Repeat, Calendar, CheckSquare, Clock } from 'lucide-react';

export const SpacedRepetitionMode: React.FC<{ onExit: () => void }> = ({ onExit }) => {

    // Engine State
    const [srsItems, setSrsItems] = useState<SRSItemState[]>([]); // This would normally load from DB
    const [dailyQueue, setDailyQueue] = useState<SRSItemState[]>([]);

    // Quiz State
    const [status, setStatus] = useState<'LOADING' | 'PRESCRIPTION' | 'QUIZ' | 'FINISHED'>('LOADING');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentItemData, setCurrentItemData] = useState<MasterQuestionItem | null>(null);
    // const [isReviewing, setIsReviewing] = useState(false); // Removed unused state

    // Mock Loading of Persistent Data
    useEffect(() => {
        // Create mock SRS states but link them to REAL bank item IDs if possible.
        // For now, we simulate "review needed" simply by picking random IDs.
        // In a real implementation, this would query the 'srs_items' table for due items.
        const mockDb: SRSItemState[] = [];
        for (let i = 0; i < 5; i++) {
            mockDb.push({
                itemId: `bank_item_${i}`, // Placeholder, fetchActual will handle finding real items
                nextReviewDate: Date.now() - 10000000,
                intervalDays: 1,
                easinessFactor: 2.5,
                repetitionCount: 0,
                retentionStrength: 0,
                history: []
            });
        }
        setSrsItems(mockDb);
        const queue = SpacedRepetitionEngine.getDailyPrescription(mockDb, 10);
        setDailyQueue(queue);
        setStatus('PRESCRIPTION');
    }, []);

    // Load Question Content
    const loadItemContent = async (_srsItem: SRSItemState) => {
        // Fetch a real item from the bank
        const item = await fetchNextQuestion({
            targetDifficulty: 3, // SRS mix usually starts generic or tracks specific item difficulty
            allowAiFallback: true
        });

        if (item) {
            setCurrentItemData(item);
        }
    };

    const startSession = async () => {
        if (dailyQueue.length === 0) return;
        setStatus('QUIZ');
        setCurrentIndex(0);
        await loadItemContent(dailyQueue[0]);
    };

    const handleRating = async (rating: 1 | 2 | 3 | 4 | 5) => {
        if (!currentItemData) return;

        const currentSRS = dailyQueue[currentIndex];
        const newState = SpacedRepetitionEngine.processReview(currentSRS, rating);

        // Update Local State (Simulate DB Save)
        setSrsItems(prev => prev.map(i => i.itemId === newState.itemId ? newState : i));

        // Move Next
        if (currentIndex < dailyQueue.length - 1) {
            setCurrentItemData(null); // Clear old
            setCurrentIndex(prev => prev + 1);
            // setIsReviewing(false); // Removed unused state update
            await loadItemContent(dailyQueue[currentIndex + 1]);
        } else {
            setStatus('FINISHED');
        }
    };

    if (status === 'LOADING') return <div className="p-8 text-center">Checking memory banks...</div>;

    if (status === 'PRESCRIPTION') {
        const forecast = SpacedRepetitionEngine.getReviewForecast(srsItems);

        return (
            <div className="max-w-4xl mx-auto p-8 h-full flex flex-col justify-center">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-6">
                        <Repeat className="w-12 h-12 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Daily Memory Prescription</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        We found <span className="font-bold text-purple-600">{dailyQueue.length} items</span> tailored to your forgetting curve.
                        Review them now to reset your memory clock.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card>
                        <CardHeader className="p-6">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <span>Estimated Time</span>
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold text-slate-800">
                                ~{Math.ceil(dailyQueue.length * 1.5)} Minutes
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="p-6">
                            <CardTitle className="flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-green-600" />
                                <span>Retained Mastery</span>
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold text-slate-800">
                                60% Strength
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Upcoming Load</h3>
                    <div className="flex justify-between items-end h-32 gap-2">
                        {forecast.slice(0, 7).map((day, i) => (
                            <div key={day.date} className="flex-1 flex flex-col items-center justify-end group">
                                <div className="text-xs font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{day.count}</div>
                                <div
                                    className={`w-full rounded-t-lg transition-all ${i === 0 ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    style={{ height: `${Math.max(10, Math.min(100, day.count * 10))}%` }}
                                />
                                <div className="text-xs text-slate-500 mt-2 font-mono">{day.date.slice(5)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={onExit}>Skip for Now</Button>
                    <Button size="lg" onClick={startSession} className="px-12 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg">
                        Start Review Session
                    </Button>
                </div>
            </div>
        );
    }

    if (status === 'FINISHED') {
        const retainedCount = srsItems.filter(i => i.retentionStrength > 80).length;

        return (
            <div className="max-w-2xl mx-auto p-8 text-center h-full flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-green-600 mb-6">Prescription Complete! 🎉</h1>
                <p className="text-xl text-slate-600 mb-8">
                    You've successfully reset the forgetting curve for {dailyQueue.length} items.
                    See you tomorrow for your next dose!
                </p>
                <div className="bg-slate-100 p-8 rounded-2xl mb-8">
                    <div className="text-sm uppercase tracking-wider font-bold text-slate-500 mb-2">Total Mastered Items</div>
                    <div className="text-6xl font-black text-purple-600">{retainedCount}</div>
                </div>
                <Button size="lg" onClick={onExit}>Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="h-16 px-6 bg-white dark:bg-slate-800 border-b flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-xl text-purple-600">Memory Master</span>
                    <span className="text-sm px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-mono">
                        Item {currentIndex + 1} of {dailyQueue.length}
                    </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {!currentItemData ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl min-h-[50vh] flex flex-col relative">
                            {/* Overlay to intercept answers and show confidence RATING instead of direct grading */}
                            <StudentPreviewModal item={currentItemData} onClose={() => { }} />

                            {/* CONFIDENCE RATING OVERLAY (appears at bottom) */}
                            <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
                                <div className="text-center mb-4 font-bold text-slate-700">How well did you know this?</div>
                                <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                                    <Button onClick={() => handleRating(1)} variant="outline" className="border-red-200 hover:bg-red-50 flex flex-col h-20 gap-1">
                                        <span className="text-xl">1</span>
                                        <span className="text-[10px] uppercase font-bold text-red-600">Blank Layout</span>
                                    </Button>
                                    <Button onClick={() => handleRating(2)} variant="outline" className="border-orange-200 hover:bg-orange-50 flex flex-col h-20 gap-1">
                                        <span className="text-xl">2</span>
                                        <span className="text-[10px] uppercase font-bold text-orange-600">Difficult</span>
                                    </Button>
                                    <Button onClick={() => handleRating(3)} variant="outline" className="border-yellow-200 hover:bg-yellow-50 flex flex-col h-20 gap-1">
                                        <span className="text-xl">3</span>
                                        <span className="text-[10px] uppercase font-bold text-yellow-600">Hesitant</span>
                                    </Button>
                                    <Button onClick={() => handleRating(4)} variant="outline" className="border-blue-200 hover:bg-blue-50 flex flex-col h-20 gap-1">
                                        <span className="text-xl">4</span>
                                        <span className="text-[10px] uppercase font-bold text-blue-600">Good</span>
                                    </Button>
                                    <Button onClick={() => handleRating(5)} variant="outline" className="border-green-200 hover:bg-green-50 flex flex-col h-20 gap-1">
                                        <span className="text-xl">5</span>
                                        <span className="text-[10px] uppercase font-bold text-green-600">Perfect</span>
                                    </Button>
                                </div>
                                <div className="mt-4 text-center">
                                    <Button onClick={() => handleRating(3)} size="lg" className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                        Next Question &rarr;
                                    </Button>
                                    <p className="text-xs text-slate-400 mt-2">Rate yourself to advance (Next Question)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
