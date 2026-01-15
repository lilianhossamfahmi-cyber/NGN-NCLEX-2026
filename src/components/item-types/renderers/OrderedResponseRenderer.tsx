import React, { useState } from 'react';
import { GenericRendererProps } from './types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { GripVertical, ArrowUp, ArrowDown, CheckCircle2, XCircle } from 'lucide-react';

export const OrderedResponseRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

    // Fix for P-01: Support orderedOptions (Prompt) vs options (Legacy)
    const options = config.orderedOptions || config.options || [];

    // 1. Initialize State (Assume answers is current list of IDs)
    // SAFETY: Ensure currentList is always an array AND has items. If answers is [] (empty), shuffle default options
    const currentList: string[] = React.useMemo(() => {
        if (Array.isArray(answers) && answers.length > 0) return answers;
        if (options.length > 0) {
            // Shuffle the option IDs for initial display
            const ids = options.map((o: any) => o.id);
            for (let i = ids.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ids[i], ids[j]] = [ids[j], ids[i]];
            }
            return ids;
        }
        return [];
    }, [answers, options]); // Recalculate if props change, but stable otherwise

    // Helper to get Option Text by ID
    const getOptionText = (id: string) => {
        const opt = options.find((o: any) => o.id === id);
        if (opt && typeof opt.text === 'object') {
            return (opt.text as any).en || (opt.text as any).text || JSON.stringify(opt.text);
        }
        return opt ? opt.text : id;
    };

    // DRAG AND DROP HANDLERS
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        if (isSubmitted) return;
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Add transparent drag image or styling here if desired
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (isSubmitted || !draggedId) return;

        const currentOrder = [...currentList];
        const draggedIndex = currentOrder.indexOf(draggedId);

        if (draggedIndex === -1) return;

        // Move item
        currentOrder.splice(draggedIndex, 1);
        currentOrder.splice(targetIndex, 0, draggedId);

        setAnswers(currentOrder);
        setDraggedId(null);
    };

    // Mobile Move Handlers
    const moveItem = (index: number, direction: -1 | 1) => {
        if (isSubmitted) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= currentList.length) return;

        const newOrder = [...currentList];
        const [movedItem] = newOrder.splice(index, 1);
        newOrder.splice(newIndex, 0, movedItem);
        setAnswers(newOrder);
    };

    if (options.length === 0) return <div className="text-red-500">No options defined.</div>;

    return (
        <div className="flex flex-col gap-4 font-inter">
            <div className={`text-sm italic text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2 items-center`}>
                <span>ℹ️</span>
                {isMobile
                    ? "Use arrows to reorder items (1 is first)."
                    : "Drag items to correct order (1 is first)."
                }
            </div>

            <ul className="flex flex-col gap-3">
                {currentList.map((id, index) => {
                    // Logic to determine feedback
                    let itemClass = "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:shadow-sm";
                    let feedbackContent = null;

                    if (isSubmitted) {
                        const correctIdAtThisIndex = options[index]?.id;
                        const isCorrectPosition = correctIdAtThisIndex === id;

                        if (isCorrectPosition) {
                            itemClass = "bg-green-50 border-green-500 text-green-900";
                            feedbackContent = (
                                <div className="flex items-center gap-1 text-green-700 font-bold whitespace-nowrap">
                                    <CheckCircle2 size={16} /> Correct
                                </div>
                            );
                        } else {
                            itemClass = "bg-red-50 border-red-500 text-red-900";
                            const correctIndex = options.findIndex((o: any) => o.id === id);
                            feedbackContent = (
                                <div className="text-red-700 text-xs flex flex-col items-start whitespace-nowrap">
                                    <div className="font-bold flex items-center gap-1"><XCircle size={14} /> Incorrect</div>
                                    <div>Box {correctIndex !== undefined ? correctIndex + 1 : '?'}</div>
                                </div>
                            );
                        }
                    }

                    return (
                        <li key={id} className="flex items-center gap-3">
                            {/* Mobile Arrows */}
                            {isMobile && !isSubmitted && (
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => moveItem(index, -1)}
                                        disabled={index === 0}
                                        className={`w-8 h-8 flex items-center justify-center rounded border ${index === 0 ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-white border-slate-300 text-slate-600 active:bg-slate-100'}`}
                                        aria-label="Move Up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 1)}
                                        disabled={index === currentList.length - 1}
                                        className={`w-8 h-8 flex items-center justify-center rounded border ${index === currentList.length - 1 ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-white border-slate-300 text-slate-600 active:bg-slate-100'}`}
                                        aria-label="Move Down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                </div>
                            )}

                            {/* The Card */}
                            <div
                                draggable={!isSubmitted && !isMobile}
                                onDragStart={(e) => handleDragStart(e, id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`
                                    flex-1 flex items-center p-3 rounded-xl border-2 transition-all select-none
                                    ${itemClass}
                                    ${!isSubmitted && !isMobile ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                                `}
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 mr-4 text-sm flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 text-sm font-medium leading-normal">
                                    {getOptionText(id)}
                                </div>
                                {!isSubmitted && !isMobile && (
                                    <div className="text-slate-400 ml-2">
                                        <GripVertical size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Feedback Side Panel */}
                            {feedbackContent && (
                                <div className="min-w-[80px] hidden sm:block">
                                    {feedbackContent}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
