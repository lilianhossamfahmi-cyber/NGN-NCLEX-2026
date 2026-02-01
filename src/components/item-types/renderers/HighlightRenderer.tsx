import React, { useMemo } from 'react';
import { GenericRendererProps } from './types';

/**
 * HIGHLIGHT RENDERER - Gold Standard Upgrade
 * 
 * Features:
 * - Blue Background / White Text for selection
 * - Click to Select
 * - Keyboard Navigation (Tab + Space)
 * - Selection Counter
 */

interface HighlightItem {
    id: string;
    text: string;
    isCorrect: boolean;
    rationale?: string;
}

export const HighlightRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // CSS Styles - Injected for simplicity
    const styles = `
        .highlight-renderer {
            font-family: 'Inter', system-ui, sans-serif;
            color: #334155;
            line-height: 2.0;
        }

        .highlight-token {
            transition: all 0.1s ease-out;
            padding: 2px 4px;
            margin: 0 1px;
            border-radius: 4px;
            position: relative;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            cursor: default;
        }

        /* Interaction Phase States */
        /* HOVER */
        .highlight-renderer:not(.submitted) .highlight-token.selectable:hover {
            background-color: #dbeafe; /* blue-100 */
            color: #1e3a8a; /* blue-900 */
            cursor: pointer;
            outline: 1px dashed #3b82f6;
        }

        /* SELECTED (User Requirement: Blue bg, White text) */
        .highlight-renderer:not(.submitted) .highlight-token.selected {
            background-color: #2563eb; /* blue-600 */
            color: white !important;
            font-weight: 500;
            outline: none;
            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }

        /* FOCUS (Keyboard) */
        .highlight-renderer:not(.submitted) .highlight-token.selectable:focus-visible {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
            z-index: 10;
        }

        /* Feedback Phase States */
        /* Correct Selection */
        .highlight-token.correct-selection {
            background-color: #bbf7d0; /* green-200 */
            border-bottom: 2px solid #16a34a; /* green-600 */
            color: #14532d; /* green-900 */
            font-weight: 600;
        }

        /* Incorrect Selection */
        .highlight-token.incorrect-selection {
            background-color: #fecaca; /* red-200 */
            border-bottom: 2px solid #dc2626; /* red-600 */
            color: #7f1d1d; /* red-900 */
            text-decoration: line-through;
        }

        /* Missed Correct */
        .highlight-token.missed-correct {
            border: 1px dashed #16a34a;
            background-color: #f0fdf4;
            color: #15803d;
        }
    `;

    // GREEDY SEARCH FOR CONTENT (Fix for Data Entropy)
    // We search across root, structure, and content.structure to find the data
    const text = config.text || config.structure?.text || config.content?.structure?.text || "";
    const rationales = config.rationales || config.structure?.rationales || config.content?.structure?.rationales || {};
    const correctIds = config.correct || config.structure?.correct || config.content?.structure?.correct ||
        config.correctIds || config.structure?.correctIds || config.content?.structure?.correctIds || [];

    // Normalize answers array
    const userSelections: string[] = useMemo(() => {
        if (!answers) return [];
        return Array.isArray(answers) ? answers : [];
    }, [answers]);

    // Counter
    const selectionCount = userSelections.length;
    // Attempt to find max limit from config if specified, else generic
    const maxSelections = config.maxSelections || correctIds.length;

    // Text Normalization & Item Extraction
    // ... (Same Logic as previous renderer for extraction)
    const normalizeText = (t: string) => t.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();

    const highlightItems: HighlightItem[] = useMemo(() => {
        const items: HighlightItem[] = [];
        const html = text;
        const correctSet = new Set<string>();

        const addToCorrect = (val: any) => {
            if (val === undefined || val === null) return;
            correctSet.add(String(val));
            correctSet.add(normalizeText(String(val)));
        };

        if (Array.isArray(correctIds)) {
            correctIds.forEach(addToCorrect);
        }

        // Parse HTML for spans
        const regex = /<span[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const id = match[1];
            const contentText = match[2];
            const cleanText = contentText.trim();
            const normText = normalizeText(cleanText);
            const isCorrect = correctSet.has(id) || correctSet.has(cleanText) || correctSet.has(normText);

            // Assign rationale if it exists in the greedy rationales object
            const itemRationale = rationales[id] || rationales[cleanText] || rationales[normText];

            items.push({
                id,
                text: cleanText,
                isCorrect,
                rationale: typeof itemRationale === 'object' ? itemRationale.whyCorrect : itemRationale
            });
        }
        return items;
    }, [text, correctIds, rationales]);

    // Handlers
    const toggleId = (id: string) => {
        if (isSubmitted) return;
        // Verify existence
        if (!highlightItems.some(i => i.id === id)) return;

        if (userSelections.includes(id)) {
            setAnswers(userSelections.filter(x => x !== id));
        } else {
            // Optional logic: Max selections enforcement
            // if (maxSelections && userSelections.length >= maxSelections) return;
            setAnswers([...userSelections, id]);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isSubmitted) return;
        const target = e.target as HTMLElement;
        const span = target.closest('span');
        if (span && span.id) {
            toggleId(span.id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isSubmitted) return;
        if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target as HTMLElement;
            if (target.id && target.tagName === 'SPAN') {
                e.preventDefault();
                toggleId(target.id);
            }
        }
    };

    // Render HTML with attributes
    const getProcessedHtml = () => {
        let html = text;
        html = html.replace(/<span\s+([^>]*?)id=["']([^"']+)["']([^>]*?)>(.*?)<\/span>/gi,
            (_match: string, preAttrs: string, id: string, postAttrs: string, content: string) => {
                const item = highlightItems.find(i => i.id === id);
                if (!item) return `<span ${preAttrs} id="${id}" ${postAttrs}>${content}</span>`;

                const isSelected = userSelections.includes(id);
                const isCorrect = item.isCorrect;

                let classes = 'highlight-token';
                if (!isSubmitted) {
                    classes += ' selectable';
                    if (isSelected) classes += ' selected';
                } else {
                    if (isSelected && isCorrect) classes += ' correct-selection';
                    else if (isSelected && !isCorrect) classes += ' incorrect-selection';
                    else if (!isSelected && isCorrect) classes += ' missed-correct';
                }

                // Add tabindex for keyboard
                const tabIndex = (!isSubmitted) ? 'tabindex="0"' : '';
                const role = 'role="button"';
                const ariaLabel = `aria-label="${item.text}. ${isSelected ? 'Selected' : 'Not selected'}"`;
                const ariaPressed = `aria-pressed="${isSelected}"`;

                return `<span ${preAttrs} id="${id}" ${postAttrs} class="${classes}" ${tabIndex} ${role} ${ariaLabel} ${ariaPressed}>${content}</span>`;
            }
        );
        return html;
    };

    return (
        <div className={`highlight-renderer ${isSubmitted ? 'submitted' : ''} font-inter`}>
            <style>{styles}</style>

            {/* Counter Badge */}
            {!isSubmitted && (
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <span>🖊️</span> Click or use Spacebar to highlight findings
                    </div>
                    <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                        Selected: <span className="text-blue-600">{selectionCount} {maxSelections ? `/ ${maxSelections}` : ''}</span>
                    </div>
                </div>
            )}

            {/* Main Text Area */}
            <div
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className="p-6 bg-white border border-slate-200 rounded-xl leading-8 selection:bg-blue-100 selection:text-blue-900"
                dangerouslySetInnerHTML={{ __html: getProcessedHtml() }}
            />

            {/* Results */}
            {isSubmitted && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
                    <strong>Review:</strong> Correct highlights are green. Incorrect are red strikethrough. Missed are dashed green.
                </div>
            )}
        </div>
    );
};
