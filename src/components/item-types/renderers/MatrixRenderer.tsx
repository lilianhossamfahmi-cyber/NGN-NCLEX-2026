import React from 'react';
import { GenericRendererProps } from './types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// PART 4: MATRIX MULTIPLE RESPONSE – COMPLETE AUDIT & FIX
// Also handles Screen 4 (Indicated/Not) and Screen 6 (Status)
export const MatrixRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

    // answers structure:
    // Radio: { [rowId]: columnId }
    // Checkbox: { [rowId]: { [colId]: boolean } }
    const isMultipleResponse = config.type.includes('multiple-response') || config.type === 'matrix-mr';

    const handleCellClick = (rowId: string, colId: string) => {
        if (isSubmitted) return;

        const newAnswers = { ...(answers || {}) };

        if (isMultipleResponse) {
            if (!newAnswers[rowId]) newAnswers[rowId] = {};
            // Toggle
            if (newAnswers[rowId][colId]) {
                delete newAnswers[rowId][colId];
            } else {
                newAnswers[rowId][colId] = true;
            }
        } else {
            // Radio logic
            newAnswers[rowId] = colId;
        }

        setAnswers(newAnswers);
    };

    const isSelected = (rowId: string, colId: string) => {
        if (!answers) return false;
        if (isMultipleResponse) {
            return !!answers[rowId]?.[colId];
        } else {
            return answers[rowId] === colId;
        }
    };

    const getCellStatus = (rowId: string, colId: string) => {
        if (!isSubmitted) return 'normal';
        const row = config.rows.find((r: any) => r.id === rowId);
        if (!row) return 'normal';

        const selected = isSelected(rowId, colId);
        let isCorrectCell = false;
        if (isMultipleResponse) {
            const correctCols = row.correctColumns || row.correctColumnIds || [];
            isCorrectCell = correctCols.includes(colId);
        } else {
            const correctCol = row.correctColumn || row.correctColumnId || row.correctAnswer;
            isCorrectCell = correctCol === colId;
        }

        if (selected && isCorrectCell) return 'correct';
        if (selected && !isCorrectCell) return 'incorrect';
        if (!selected && isCorrectCell) return 'missed';
        return 'normal';
    };

    // Icons
    const SuccessIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
    const ErrorIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
    const MissedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    );

    // Custom Checkbox/Radio Visuals
    const InputVisual = ({ type, checked, correct, incorrect }: { type: 'checkbox' | 'radio', checked: boolean, correct?: boolean, incorrect?: boolean }) => {
        const baseStyle: React.CSSProperties = {
            width: '24px',
            height: '24px',
            borderRadius: type === 'radio' ? '50%' : '6px',
            border: '2px solid',
            borderColor: checked ? 'var(--pearson-blue)' : '#cbd5e1',
            background: checked ? 'var(--pearson-blue)' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        };

        if (correct) {
            baseStyle.borderColor = 'var(--color-success)';
            baseStyle.background = 'var(--color-success)';
        } else if (incorrect) {
            baseStyle.borderColor = 'var(--color-danger)';
            baseStyle.background = 'var(--color-danger)';
        }

        return (
            <div style={baseStyle}>
                {checked && (
                    type === 'radio' ? (
                        <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }} />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )
                )}
            </div>
        );
    };

    // Mobile View
    if (isMobile) {
        return (
            <div className="matrix-mobile-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <style>{`
                    .mobile-card {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                        overflow: hidden;
                        border: 1px solid var(--border-color);
                    }
                    .mobile-header {
                        padding: 16px;
                        background: #f8fafc;
                        border-bottom: 1px solid var(--border-color);
                        font-weight: 600;
                        color: var(--clinical-navy);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .mobile-body {
                        padding: 16px;
                    }
                    .mobile-option {
                        display: flex;
                        align-items: center;
                        padding: 12px;
                        border-radius: 8px;
                        border: 1px solid transparent;
                        margin-bottom: 8px;
                        transition: all 0.2s;
                        cursor: pointer;
                    }
                    .mobile-option:active {
                        background-color: var(--pearson-blue-light);
                    }
                    .mobile-option.selected {
                        background-color: var(--pearson-blue-light);
                        border-color: var(--pearson-blue);
                    }
                `}</style>
                {config.rows?.map((row: any) => (
                    <div key={row.id} className="mobile-card">
                        <div className="mobile-header">
                            <div style={{ width: 4, height: 16, background: 'var(--pearson-blue)', borderRadius: 2 }}></div>
                            {row.text || row.label}
                        </div>
                        <div className="mobile-body">
                            {config.columns?.map((col: any) => {
                                const status = getCellStatus(row.id, col.id);
                                const selected = isSelected(row.id, col.id);

                                let bg = 'transparent';
                                if (status === 'correct') bg = 'var(--color-success-bg)';
                                if (status === 'incorrect') bg = 'var(--color-danger-bg)';
                                if (status === 'missed') bg = 'var(--color-warning-bg)';

                                return (
                                    <div
                                        key={col.id}
                                        className={`mobile-option ${selected ? 'selected' : ''}`}
                                        style={{ background: bg }}
                                        onClick={() => !isSubmitted && handleCellClick(row.id, col.id)}
                                    >
                                        <div style={{ marginRight: 12 }}>
                                            <InputVisual
                                                type={isMultipleResponse ? 'checkbox' : 'radio'}
                                                checked={selected}
                                                correct={status === 'correct'}
                                                incorrect={status === 'incorrect'}
                                            />
                                        </div>
                                        <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 500 }}>{col.label}</div>
                                        {isSubmitted && (
                                            <div>
                                                {status === 'correct' && <SuccessIcon />}
                                                {status === 'incorrect' && <ErrorIcon />}
                                                {status === 'missed' && <MissedIcon />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Desktop View
    return (
        <div className="matrix-renderer" style={{ margin: '1rem 0' }}>
            <style>{`
                .matrix-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                }
                .matrix-table {
                    width: 100%;
                    border-collapse: separate; 
                    border-spacing: 0;
                }
                .matrix-th {
                    background: #1e3a8a; /* Deep Navy Blue - Professional & Clean */
                    color: white;
                    padding: 16px 24px;
                    text-align: center;
                    font-weight: 800;
                    font-size: 0.85em;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #172554;
                }
                .matrix-th:last-child {
                    border-top-right-radius: 12px;
                }
                .matrix-th-first {
                    text-align: left;
                    width: 40%;
                    background: #0f172a; /* Dark Slate - High Contrast */
                    border-top-left-radius: 12px;
                    border-bottom: 1px solid #020617;
                }
                .matrix-row {
                    transition: background 0.1s ease;
                }
                .matrix-row:not(:last-child) {
                    border-bottom: 1px solid #e2e8f0;
                }
                /* Defined Zebra Striping */
                .matrix-row:nth-child(even) {
                    background-color: #f8fafc; /* Very light slate */
                }
                .matrix-row:hover:not(.submitted) {
                    background-color: #e0f2fe !important; /* Sky 100 on hover */
                }
                .matrix-td {
                    padding: 12px 16px; /* Compact vertical padding */
                    text-align: center;
                    position: relative;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e8f0;
                }
                .matrix-row-label {
                    text-align: left;
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 1em;
                    padding: 12px 24px; /* Compact padding */
                    border-right: 1px solid #f1f5f9;
                    border-bottom: 1px solid #e2e8f0;
                }
                .interaction-area {
                    display: inline-flex;
                    padding: 8px; /* Compact hit area */
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent; /* Prevent layout shift */
                }
                .interaction-area:hover:not(.disabled) {
                    background-color: #dbeafe; /* Blue 100 */
                    transform: scale(1.05);
                    border-color: #bfdbfe;
                }
                
                /* Feedback Animations */
                .feedback-pill {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.7rem;
                    font-weight: 700;
                    opacity: 0;
                    animation: fadeInUp 0.3s forwards;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    z-index: 10;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 8px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>

            <div className="matrix-container">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-th matrix-th-first">
                                {config.rowLabel || "Assessment Finding"}
                            </th>
                            {config.columns?.map((col: any) => (
                                <th key={col.id} className="matrix-th">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {config.rows?.map((row: any) => (
                            <tr key={row.id} className={`matrix-row ${isSubmitted ? 'submitted' : ''}`}>
                                <td className="matrix-row-label">{row.text || row.label}</td>
                                {config.columns?.map((col: any) => {
                                    const status = getCellStatus(row.id, col.id);
                                    let cellBg = 'transparent';

                                    // Subtle full-cell background for feedback
                                    if (status === 'correct') cellBg = 'rgba(16, 185, 129, 0.08)';
                                    if (status === 'incorrect') cellBg = 'rgba(225, 29, 72, 0.08)';
                                    if (status === 'missed') cellBg = 'rgba(245, 158, 11, 0.08)';

                                    return (
                                        <td
                                            key={col.id}
                                            className="matrix-td"
                                            style={{ backgroundColor: cellBg }}
                                            onClick={() => !isSubmitted && handleCellClick(row.id, col.id)}
                                        >
                                            <div className={`interaction-area ${isSubmitted ? 'disabled' : ''}`}>
                                                <InputVisual
                                                    type={isMultipleResponse ? 'checkbox' : 'radio'}
                                                    checked={isSelected(row.id, col.id)}
                                                    correct={status === 'correct'}
                                                    incorrect={status === 'incorrect'}
                                                />
                                            </div>

                                            {isSubmitted && (
                                                <>
                                                    {status === 'correct' && (
                                                        <div className="feedback-pill" style={{ color: 'var(--color-success)' }}>
                                                            <SuccessIcon />
                                                        </div>
                                                    )}
                                                    {status === 'incorrect' && (
                                                        <div className="feedback-pill" style={{ color: 'var(--color-danger)' }}>
                                                            <ErrorIcon />
                                                        </div>
                                                    )}
                                                    {status === 'missed' && (
                                                        <div className="feedback-pill" style={{ color: 'var(--color-warning)' }}>
                                                            <MissedIcon />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {config.constraint && (
                <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#f1f5f9',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    borderLeft: '3px solid var(--pearson-blue)'
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    {config.constraint === 'each-column-at-least-one'
                        ? 'Select at least one option for each column.'
                        : 'Select an option for each row.'}
                </div>
            )}
        </div>
    );
};
