import React from 'react';
import { GenericRendererProps } from './types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

// PART 6: CLOZE (DROP-DOWN) – COMPLETE AUDIT & FIX
export const ClozeRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {

    // answers: { [blankId]: selectedOptionId }

    const handleChange = (blankId: string, val: string) => {
        setAnswers({ ...answers, [blankId]: val });
    };

    const getOptionText = (blank: any, optId: string) => {
        if (!blank || !blank.options) return optId;

        // 1. Try direct find by ID
        const found = blank.options.find((o: any) => o.id === optId);
        if (found) return found.text || found.label || found;

        // 2. Try matching by raw string value (if options are just strings)
        if (blank.options.includes(optId)) return optId;

        // 3. Handle synthetic 'opt-X' IDs
        if (typeof optId === 'string' && optId.startsWith('opt-')) {
            const index = parseInt(optId.replace('opt-', ''), 10);
            if (!isNaN(index) && blank.options[index]) {
                const opt = blank.options[index];
                return typeof opt === 'string' ? opt : (opt.text || opt.label || opt);
            }
        }

        return optId;
    };

    // Track global blank index across all sentences for config-level fallbacks
    let globalBlankIndex = 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', lineHeight: '2.0', color: '#334155' }}>
            {config.sentences?.map((sent: any, i: number) => {
                // Auto-Repair: If '____' or '[...]' are found but no %tokens%, try to map to dropdowns by index.
                let repairedText = sent.text || sent.sentence || sent.content || (typeof sent === 'string' ? sent : '') || '[ System: Content Generation Error - Sentence Text Missing ]';

                // If text has NO %tokens% but HAS placeholder patterns, try to map them
                if (!repairedText.match(/%[a-zA-Z0-9_.-]+%/)) {
                    // Match underscores, '[...]', '[blank]', '[dropdownX]', '<b>[X]</b>', '{}', OR '<span id=...>' style placeholders
                    const placeholderRegex = /_{3,}|\[\.\.\.\]|\[blank\]|\[dropdown\d+\]|<b>\[\d+\]<\/b>|\{\}|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*><\/span>|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*>.*?<\/span>/gi;
                    let matchIndex = 0;

                    // Determine if we are using local (sentence-level) or global (config-level) dropdowns
                    const localDropdowns = Array.isArray(sent.dropdowns) ? sent.dropdowns : null;
                    const globalDropdowns = (Array.isArray(config.blanks) ? config.blanks : null) ||
                        (Array.isArray(config.dropdowns) ? config.dropdowns : null);

                    const dropdownSource = localDropdowns || globalDropdowns || [];
                    const isGlobalSource = !localDropdowns && !!globalDropdowns;

                    repairedText = repairedText.replace(placeholderRegex, () => {
                        // Calculate correct index: local for sent.dropdowns, global for config.dropdowns
                        const currentIndex = isGlobalSource ? globalBlankIndex : matchIndex;

                        // Increment counters
                        matchIndex++;
                        if (isGlobalSource) globalBlankIndex++;

                        // Find the corresponding dropdown ID if possible
                        if (dropdownSource[currentIndex]) {
                            const dId = dropdownSource[currentIndex].id || `BLANK${currentIndex + 1}`;
                            return `%${dId}%`; // Inject proper token
                        }

                        // If no explicit dropdown, still create a token for config-level options
                        const autoId = `AUTO_BLANK_${i}_${matchIndex}`;
                        return `%${autoId}%`;
                    });
                }

                const parts = repairedText.split(/(%[a-zA-Z0-9_.-]+%)/);

                return (
                    <div key={i}>
                        {parts.map((part: string, idx: number) => {
                            // Check if this part is a blank marker
                            const match = part.match(/^%([a-zA-Z0-9_.-]+)%$/);
                            if (match) {
                                // It's a blank. Find the definition.
                                const blankId = match[1];

                                // Debug logging
                                console.log('[ClozeRenderer] Looking for blank:', blankId);

                                // Helper to safely find in array
                                const safeFind = (arr: any, predicate: (item: any) => boolean) =>
                                    Array.isArray(arr) ? arr.find(predicate) : undefined;

                                // Try finding the blank definition by explicit ID match (Preferred)
                                let blankDef: any = safeFind(sent.dropdowns, (d: any) => d.id === blankId);

                                // Fallback: Global config blanks or dropdowns
                                if (!blankDef) {
                                    blankDef = safeFind(config.blanks, (b: any) => b.id === blankId);
                                }
                                if (!blankDef) {
                                    blankDef = safeFind(config.dropdowns, (b: any) => b.id === blankId);
                                }

                                // Legacy Fallback for "BLANK1" style if numeric logic was expected
                                if (!blankDef && blankId.startsWith('BLANK')) {
                                    const num = parseInt(blankId.replace('BLANK', ''), 10);
                                    if (!isNaN(num)) {
                                        const index = num - 1;
                                        if (Array.isArray(sent.dropdowns) && sent.dropdowns[index]) blankDef = sent.dropdowns[index];
                                        else if (Array.isArray(config.blanks) && config.blanks[index]) blankDef = config.blanks[index];
                                        else if (Array.isArray(config.dropdowns) && config.dropdowns[index]) blankDef = config.dropdowns[index];
                                    }
                                }

                                // AUTO_BLANK Fallback: Create synthetic def from config options
                                if (!blankDef && blankId.startsWith('AUTO_BLANK_')) {
                                    // Use config-level options/tokens as the options source
                                    const globalOptions = Array.isArray(config.tokens) ? config.tokens :
                                        (Array.isArray(config.options) ? config.options : []);
                                    blankDef = {
                                        id: blankId,
                                        options: globalOptions.map((opt: any, oi: number) => ({
                                            id: typeof opt === 'string' ? opt : (opt.id || `opt-${oi}`),
                                            text: typeof opt === 'string' ? opt : (opt.text || opt.label || opt)
                                        })),
                                        correctOptionId: null // Unknown for auto-generated
                                    };
                                }

                                console.log('[ClozeRenderer] Found blankDef:', blankDef);

                                if (!blankDef) return <span key={idx} style={{ color: 'red' }}>[Unknown Blank {blankId}]</span>;

                                const selectedValue = answers?.[blankDef.id] || '';

                                // Get display text for valid rendering later
                                const displaySelected = getOptionText(blankDef, selectedValue) || '';

                                // Check Answer Status
                                const isUnanswered = !selectedValue || selectedValue === '';

                                // Robust Correct ID Resolution
                                const targetCorrectId = blankDef.correctOptionId || blankDef.correctId || blankDef.correctAnswer || blankDef.correct || blankDef.answer;

                                let isCorrect = !isUnanswered && (selectedValue === targetCorrectId);

                                // Resolve Correct Text for Display & Fuzzy Match
                                const correctText = getOptionText(blankDef, targetCorrectId) || (typeof targetCorrectId === 'string' ? targetCorrectId : '');

                                // Fuzzy Match Fallback: If strict ID fail, compare normalized texts
                                if (!isCorrect && !isUnanswered && displaySelected && correctText) {
                                    const normalize = (s: string) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
                                    if (normalize(displaySelected) === normalize(correctText)) {
                                        isCorrect = true;
                                    }
                                }

                                // Allow fuzzy match if configured, but default to strict ID match 
                                // (Logic omitted for brevity, keeping strict ID match as primary)

                                if (isSubmitted) {
                                    // 3 Distinct States
                                    if (isUnanswered) {
                                        // UNANSWERED
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    padding: '2px 8px', borderRadius: '4px',
                                                    border: '1px solid #f59e0b', background: '#fffbeb', color: '#b45309',
                                                    fontWeight: 700, fontSize: '0.9em'
                                                }}>
                                                    <AlertTriangle size={14} /> Unanswered
                                                </span>
                                                <span style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline' }}>
                                                    {correctText || "Correct Answer"}
                                                </span>
                                            </span>
                                        );
                                    } else if (isCorrect) {
                                        // CORRECT
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '4px', verticalAlign: 'middle' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    padding: '2px 8px', borderRadius: '4px',
                                                    border: '1px solid #16a34a', background: '#dcfce7', color: '#166534',
                                                    fontWeight: 700, fontSize: '0.9em'
                                                }}>
                                                    <CheckCircle2 size={14} /> Correct
                                                </span>
                                                <span style={{ color: '#166534', fontWeight: 700 }}>
                                                    {correctText}
                                                </span>
                                            </span>
                                        );
                                    } else {
                                        // INCORRECT
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    padding: '2px 8px', borderRadius: '4px',
                                                    border: '1px solid #dc2626', background: '#fee2e2', color: '#991b1b',
                                                    fontWeight: 700, fontSize: '0.9em'
                                                }}>
                                                    <XCircle size={14} /> Incorrect
                                                </span>
                                                <span style={{ textDecoration: 'line-through', color: '#64748b' }}>
                                                    {displaySelected}
                                                </span>
                                                <span style={{ color: '#64748b', fontWeight: 800 }}>&rarr;</span>
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>
                                                    {correctText || "Correct Answer"}
                                                </span>
                                            </span>
                                        );
                                    }
                                }

                                // Interactive State
                                return (
                                    <span key={idx} style={{ margin: '0 4px', display: 'inline-block' }}>
                                        <select
                                            value={selectedValue}
                                            onChange={e => handleChange(blankDef.id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #cbd5e1',
                                                background: 'white',
                                                fontWeight: 500,
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <option value="">Select...</option>
                                            {(blankDef.options || blankDef.choices || config.tokens || config.options || []).map((opt: any, oi: number) => {
                                                const optId = typeof opt === 'string' ? opt : (opt.id || opt.value || `opt-${oi}`);
                                                const optText = typeof opt === 'string' ? opt : (opt.text || opt.label || opt.value || opt);
                                                return <option key={optId} value={optId}>{optText}</option>;
                                            })}
                                        </select>
                                    </span>
                                );
                            } else {
                                // Normal text
                                return <span key={idx}>{part}</span>;
                            }
                        })}
                    </div>
                );
            })}
        </div>
    );
};
