
import React, { useState, useEffect } from 'react';
import { fetchItemById } from '../services/QuestionService';
import { MasterQuestionItem } from '../../types/master-schema';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Brain, AlertTriangle } from 'lucide-react';

export const SingleItemPreviewMode: React.FC<{ itemId: string; onExit: () => void }> = ({ itemId, onExit }) => {
    const [status, setStatus] = useState<'LOADING' | 'READY' | 'ERROR'>('LOADING');
    const [item, setItem] = useState<MasterQuestionItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadItem();
    }, [itemId]);

    const loadItem = async () => {
        setStatus('LOADING');
        try {
            const fetched = await fetchItemById(itemId);
            if (fetched) {
                setItem(fetched);
                setStatus('READY');
            } else {
                setError(`Item not found: ${itemId}`);
                setStatus('ERROR');
            }
        } catch (e) {
            setError("Failed to load item.");
            setStatus('ERROR');
        }
    };

    if (status === 'LOADING') {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <LoadingSpinner progress={50} message={`Loading Item ${itemId}...`} />
            </div>
        );
    }

    if (status === 'ERROR') {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
                <div className="bg-red-100 p-6 rounded-full mb-4 text-red-600">
                    <AlertTriangle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Unavailable</h2>
                <p className="text-slate-500 mb-6 max-w-md">{error}</p>
                <div className="flex gap-4">
                    <Button onClick={loadItem}>Retry</Button>
                    <Button variant="outline" onClick={onExit}>Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="h-16 px-6 bg-white dark:bg-slate-800 border-b flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                        <Brain size={18} />
                    </div>
                    <div>
                        <span className="font-bold text-lg block leading-tight">Single Item Preview</span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {itemId}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">
                        Preview Mode
                    </span>
                    <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {item && (
                    <div className="h-full overflow-y-auto p-4 md:p-8">
                        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl min-h-[60vh] flex flex-col border border-slate-200">
                            <StudentPreviewModal
                                item={item}
                                onClose={() => { }} // No-op for direct mode
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
