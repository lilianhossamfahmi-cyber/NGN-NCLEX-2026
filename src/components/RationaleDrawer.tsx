import React, { useMemo } from 'react';
import type { RationaleDrawerProps } from '../types';
import { RationalePipeline } from '../services/RationalePipeline';
import { RationaleSheet } from './RationaleSheet';
import { X } from 'lucide-react';

export const RationaleDrawer: React.FC<RationaleDrawerProps> = ({
    open,
    onClose,
    question,
    fullItem,
    metadata,
}) => {
    // ✅ NEW: Extract rationale directly from fullItem
    const rationale = useMemo(() => {
        if (!fullItem?.content?.rationale) {
            console.warn('⚠️ RationaleDrawer: No fullItem.content.rationale found');
            // Fallback to question.rationale if possible
            if (question?.rationale) {
                return RationalePipeline.generateRationale(question, metadata?.userAns, question.rationale);
            }
            return null;
        }

        try {
            console.log('📦 RationaleDrawer: Processing fullItem.content', fullItem.content);
            const processed = RationalePipeline.processQuestion(fullItem.content);
            console.log('✅ RationaleDrawer: Successfully extracted rationale', processed);
            return processed;
        } catch (error) {
            console.error('❌ RationaleDrawer: Error processing rationale', error);
            return null;
        }
    }, [fullItem?.content?.rationale, question?.rationale]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-4xl bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col h-full">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                        <h2 className="text-xl font-bold tracking-tight">Clinical Rationale & Logic</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <RationaleSheet
                        question={question}
                        fullItem={fullItem}
                        rationale={rationale || undefined}
                        metadata={metadata}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
};
