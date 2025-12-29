import React, { useState } from 'react';
import { GenericRendererProps } from './types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

export const OrderedResponseRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

    // 1. Initialize State
    // Logic handled by parent initializeAnswers now.
    const currentList = (answers as string[]) || [];

    // Helper to get Option Text by ID
    const getOptionText = (id: string) => {
        const opt = config.options?.find((o: any) => o.id === id);
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

    if (config.options?.length === 0) return <div>No options defined.</div>;

    return (
        <div className="ordered-response-renderer">
            <p style={{ marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#64748b' }}>
                {isMobile
                    ? "Use the arrows to reorder the items (1 being the first step)."
                    : "Drag and drop the items to place them in the correct order (1 being the first step)."}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {currentList.map((id, index) => {
                    // Logic to determine feedback
                    let itemStyle: React.CSSProperties = {
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: 'inherit'
                    };
                    let feedbackContent = null;

                    if (isSubmitted) {
                        const correctIdAtThisIndex = config.options?.[index]?.id;
                        const isCorrectPosition = correctIdAtThisIndex === id;

                        if (isCorrectPosition) {
                            itemStyle = { border: '2px solid #16a34a', background: '#86efac', color: '#052e16' };
                            feedbackContent = (
                                <div style={{ color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>✔</span> Correct
                                </div>
                            );
                        } else {
                            itemStyle = { border: '2px solid #dc2626', background: '#fca5a5', color: '#450a0a' };
                            const correctIndex = config.options?.findIndex((o: any) => o.id === id);
                            feedbackContent = (
                                <div style={{ color: '#991b1b', fontSize: '0.85rem', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontWeight: 'bold' }}>✘ Incorrect</div>
                                    <div>Should be step {correctIndex !== undefined ? correctIndex + 1 : '?'}</div>
                                </div>
                            );
                        }
                    }

                    return (
                        <li key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                            {/* Mobile Arrows */}
                            {isMobile && !isSubmitted && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <button
                                        onClick={() => moveItem(index, -1)}
                                        disabled={index === 0}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #e2e8f0',
                                            background: index === 0 ? '#f1f5f9' : '#fff',
                                            opacity: index === 0 ? 0.5 : 1,
                                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        aria-label="Move Up"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 1)}
                                        disabled={index === currentList.length - 1}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #e2e8f0',
                                            background: index === currentList.length - 1 ? '#f1f5f9' : '#fff',
                                            opacity: index === currentList.length - 1 ? 0.5 : 1,
                                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        aria-label="Move Down"
                                    >
                                        ▼
                                    </button>
                                </div>
                            )}

                            {/* The Card */}
                            <div
                                draggable={!isSubmitted && !isMobile}
                                onDragStart={(e) => handleDragStart(e, id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderRadius: '6px',
                                    cursor: isSubmitted ? 'default' : (isMobile ? 'default' : 'grab'),
                                    userSelect: 'none',
                                    transition: 'all 0.2s',
                                    ...itemStyle
                                }}
                            >
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '24px',
                                    height: '24px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    borderRadius: '50%',
                                    fontSize: '0.8rem',
                                    marginRight: '12px',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </span>
                                <span style={{ fontSize: '1rem' }}>{getOptionText(id)}</span>
                            </div>

                            {/* The Feedback */}
                            {feedbackContent && (
                                <div style={{ marginLeft: '4px', minWidth: '100px' }}>
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
