import React, { useState, useEffect } from 'react';
import { GenericRendererProps } from './types';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown } from 'lucide-react';

// PART 6: CLOZE (DROP-DOWN) – GOLD STANDARD UPGRADE
export const ClozeRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // answers: { [blankId]: selectedOptionId }

    const handleChange = (blankId: string, val: string) => {
        setAnswers({ ...answers, [blankId]: val });
    };

    const getOptionText = (blank: any, optId: string) => {
        if (!blank || !blank.options) return optId;

        // 1. Try direct find by ID
        const found = blank.options.find((o: any) => o.id === optId);
        if (found) return found.text || found.label || found;

        // 2. Try matching by raw string value
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

    // Helper Component for Custom Dropdown
    const CustomSelect = ({
        id,
        options,
        value,
        onChange,
        placeholder,
        isOpen,
        onToggle
    }: {
        id: string,
        options: any[],
        value: string,
        onChange: (val: string) => void,
        placeholder: string,
        isOpen: boolean,
        onToggle: () => void
    }) => {
        const selectedText = value ? (options.find(o => o.id === value)?.text ||
            options.find(o => o.id === value)?.label ||
            value) : placeholder;

        return (
            <div style={{ position: 'relative', display: 'inline-block', minWidth: '180px', margin: '0 4px', verticalAlign: 'middle' }}>
                <button
                    id={id}
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    style={{
                        width: '100%',
                        padding: '10px 36px 10px 14px',
                        textAlign: 'left',
                        background: 'white',
                        border: isOpen ? '2px solid #3b82f6' : (value ? '1px solid #94a3b8' : '1px solid #cbd5e1'),
                        borderRadius: '8px',
                        color: value ? '#0f172a' : '#64748b',
                        fontWeight: value ? 600 : 500,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        lineHeight: '1.4'
                    }}
                >
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedText}
                    </span>
                    <div style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
                        color: isOpen ? '#3b82f6' : '#94a3b8',
                        transition: 'transform 0.2s ease'
                    }}>
                        <ChevronDown size={18} />
                    </div>
                </button>

                {isOpen && (
                    <div className="custom-select-menu" style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        minWidth: '220px', // Slightly wider than trigger for better read
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 100,
                        maxHeight: '260px',
                        overflowY: 'auto',
                        padding: '4px',
                        animation: 'fadeInUp 0.15s ease-out'
                    }}>
                        {options.map((opt, idx) => {
                            const optId = typeof opt === 'string' ? opt : (opt.id || opt.value || `opt-${idx}`);
                            const optText = typeof opt === 'string' ? opt : (opt.text || opt.label || opt.value || opt);
                            const isSelected = value === optId;

                            return (
                                <div
                                    key={optId}
                                    onClick={(e) => { e.stopPropagation(); onChange(optId); }}
                                    className="custom-option"
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        color: isSelected ? '#3b82f6' : '#334155',
                                        fontWeight: isSelected ? 600 : 400,
                                        background: isSelected ? '#eff6ff' : 'transparent',
                                        borderRadius: '6px',
                                        marginBottom: '2px',
                                        transition: 'background 0.1s'
                                    }}
                                >
                                    {optText}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Track global blank index across all sentences
    let globalBlankIndex = 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.1rem', lineHeight: '2.2', color: '#334155' }}>
            <style>{`
                .custom-option:hover {
                    background-color: #f8fafc !important;
                    color: #1e293b !important;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {config.sentences?.map((sent: any, i: number) => {
                let repairedText = sent.text || sent.sentence || sent.content || (typeof sent === 'string' ? sent : '') || '[ System: Content Generation Error - Sentence Text Missing ]';

                // Auto-Repair Placeholders to Tokens
                if (!repairedText.match(/%[a-zA-Z0-9_.-]+%/)) {
                    const placeholderRegex = /_{3,}|\[\.\.\.\]|\[blank\]|\[dropdown\d+\]|<b>\[\d+\]<\/b>|\{\}|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*><\/span>|<span\s+id=['"]?[a-zA-Z0-9_]+['"]?[^>]*>.*?<\/span>/gi;
                    let matchIndex = 0;
                    const localDropdowns = Array.isArray(sent.dropdowns) ? sent.dropdowns : null;
                    const globalDropdowns = (Array.isArray(config.blanks) ? config.blanks : null) || (Array.isArray(config.dropdowns) ? config.dropdowns : null);
                    const dropdownSource = localDropdowns || globalDropdowns || [];
                    const isGlobalSource = !localDropdowns && !!globalDropdowns;

                    repairedText = repairedText.replace(placeholderRegex, () => {
                        const currentIndex = isGlobalSource ? globalBlankIndex : matchIndex;
                        matchIndex++;
                        if (isGlobalSource) globalBlankIndex++;
                        if (dropdownSource[currentIndex]) {
                            const dId = dropdownSource[currentIndex].id || `BLANK${currentIndex + 1}`;
                            return `%${dId}%`;
                        }
                        const autoId = `AUTO_BLANK_${i}_${matchIndex}`;
                        return `%${autoId}%`;
                    });
                }

                const parts = repairedText.split(/(%[a-zA-Z0-9_.-]+%)/);

                return (
                    <div key={i}>
                        {parts.map((part: string, idx: number) => {
                            const match = part.match(/^%([a-zA-Z0-9_.-]+)%$/);
                            if (match) {
                                const blankId = match[1];
                                const safeFind = (arr: any, predicate: (item: any) => boolean) => Array.isArray(arr) ? arr.find(predicate) : undefined;

                                let blankDef: any = safeFind(sent.dropdowns, (d: any) => d.id === blankId);
                                if (!blankDef) blankDef = safeFind(config.blanks, (b: any) => b.id === blankId);
                                if (!blankDef) blankDef = safeFind(config.dropdowns, (b: any) => b.id === blankId);

                                if (!blankDef && blankId.startsWith('BLANK')) {
                                    const num = parseInt(blankId.replace('BLANK', ''), 10);
                                    if (!isNaN(num)) {
                                        const index = num - 1;
                                        if (Array.isArray(sent.dropdowns) && sent.dropdowns[index]) blankDef = sent.dropdowns[index];
                                        else if (Array.isArray(config.blanks) && config.blanks[index]) blankDef = config.blanks[index];
                                        else if (Array.isArray(config.dropdowns) && config.dropdowns[index]) blankDef = config.dropdowns[index];
                                    }
                                }

                                if (!blankDef && blankId.startsWith('AUTO_BLANK_')) {
                                    const globalOptions = Array.isArray(config.tokens) ? config.tokens : (Array.isArray(config.options) ? config.options : []);
                                    blankDef = {
                                        id: blankId,
                                        options: globalOptions.map((opt: any, oi: number) => ({
                                            id: typeof opt === 'string' ? opt : (opt.id || `opt-${oi}`),
                                            text: typeof opt === 'string' ? opt : (opt.text || opt.label || opt)
                                        })),
                                        correctOptionId: null
                                    };
                                }

                                if (!blankDef) return <span key={idx} style={{ color: 'red' }}>[Missing]</span>;

                                const selectedValue = answers?.[blankDef.id] || '';
                                const displaySelected = getOptionText(blankDef, selectedValue) || '';
                                const isUnanswered = !selectedValue;
                                const targetCorrectId = blankDef.correctOptionId || blankDef.correctId || blankDef.correctAnswer || blankDef.correct || blankDef.answer;
                                let isCorrect = !isUnanswered && (selectedValue === targetCorrectId);
                                const correctText = getOptionText(blankDef, targetCorrectId) || targetCorrectId;

                                if (!isCorrect && !isUnanswered && displaySelected && correctText) {
                                    const normalize = (s: string) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
                                    if (normalize(displaySelected) === normalize(correctText)) isCorrect = true;
                                }

                                if (isSubmitted) {
                                    // FEEDBACK STATE
                                    if (isUnanswered) {
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle', background: '#fffbeb', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fcd34d' }}>
                                                <span style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9em' }}>
                                                    <AlertTriangle size={14} /> Missed
                                                </span>
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>
                                                    {correctText || "Correct Option"}
                                                </span>
                                            </span>
                                        );
                                    } else if (isCorrect) {
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', border: '1px solid #86efac' }}>
                                                <span style={{ color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9em' }}>
                                                    <CheckCircle2 size={14} /> Correct
                                                </span>
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>
                                                    {correctText}
                                                </span>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span key={idx} style={{ margin: '0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle', background: '#fee2e2', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                                                <span style={{ color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9em' }}>
                                                    <XCircle size={14} /> Incorrect
                                                </span>
                                                <span style={{ textDecoration: 'line-through', color: '#64748b' }}>{displaySelected}</span>
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>
                                                    {correctText || "Correct Option"}
                                                </span>
                                            </span>
                                        );
                                    }
                                }

                                // OPEN / ACTIVE STATE
                                const isOpen = activeDropdownId === blankDef.id;
                                const optionsList = (blankDef.options || blankDef.choices || config.tokens || config.options || []).map((opt: any, oi: number) => ({
                                    id: typeof opt === 'string' ? opt : (opt.id || opt.value || `opt-${oi}`),
                                    text: typeof opt === 'string' ? opt : (opt.text || opt.label || opt.value || opt)
                                }));

                                return (
                                    <CustomSelect
                                        key={idx}
                                        id={blankDef.id}
                                        options={optionsList}
                                        value={selectedValue}
                                        onChange={(val) => {
                                            handleChange(blankDef.id, val);
                                            setActiveDropdownId(null);
                                        }}
                                        placeholder="Select..."
                                        isOpen={isOpen}
                                        onToggle={() => {
                                            if (isOpen) setActiveDropdownId(null);
                                            else setActiveDropdownId(blankDef.id);
                                        }}
                                    />
                                );
                            } else {
                                return <span key={idx}>{part}</span>;
                            }
                        })}
                    </div>
                );
            })}
        </div>
    );
};
