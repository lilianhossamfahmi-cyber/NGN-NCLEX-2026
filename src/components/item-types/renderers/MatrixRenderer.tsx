import React from 'react';
import { GenericRendererProps } from './types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// PART 4: MATRIX MULTIPLE RESPONSE – GOLD STANDARD UPGRADE
// Features: Sticky Headers, Row Completion Feedback, Full-Cell Clickability, Premium Aesthetics
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

    const isRowAnswered = (rowId: string) => {
        if (!answers) return false;
        if (isMultipleResponse) {
            const rowAns = answers[rowId];
            return rowAns && Object.keys(rowAns).length > 0;
        } else {
            return answers[rowId] !== undefined;
        }
    };

    // Determine status for feedback phase
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

    // Custom Input Visuals
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
        // Keeps the card stack layout for mobile but updates colors
        return (
            <div className="matrix-mobile-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <style>{`
                    .mobile-card {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                        overflow: hidden;
                        border: 1px solid #e2e8f0;
                    }
                    .mobile-header {
                        padding: 16px;
                        background: #f8fafc;
                        border-bottom: 1px solid #e2e8f0;
                        font-weight: 600;
                        color: #1e293b;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .mobile-body { padding: 16px; }
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
                    .mobile-option.selected {
                        background-color: #eff6ff; /* blue-50 */
                        border-color: #3b82f6; /* blue-500 */
                    }
                `}</style>
                {config.rows?.map((row: any) => (
                    <div key={row.id} className="mobile-card">
                        <div className="mobile-header">
                            <div style={{ width: 4, height: 16, background: '#3b82f6', borderRadius: 2 }}></div>
                            {row.text || row.label}
                        </div>
                        <div className="mobile-body">
                            {config.columns?.map((col: any) => {
                                const status = getCellStatus(row.id, col.id);
                                const selected = isSelected(row.id, col.id);
                                return (
                                    <div
                                        key={col.id}
                                        className={`mobile-option ${selected ? 'selected' : ''}`}
                                        onClick={() => !isSubmitted && handleCellClick(row.id, col.id)}
                                    >
                                        <div style={{ marginRight: 12 }}>
                                            <InputVisual type={isMultipleResponse ? 'checkbox' : 'radio'} checked={selected} correct={status === 'correct'} incorrect={status === 'incorrect'} />
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
                    overflow: hidden; /* Contains the scrollbar corners */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                    overflow-x: auto; /* Enable horizontal scroll if needed */
                }
                .matrix-table {
                    width: 100%;
                    border-collapse: separate; 
                    border-spacing: 0;
                    min-width: 600px; /* Force scroll on small desktop */
                }
                .matrix-th {
                    position: sticky;
                    top: 0;
                    z-index: 20; /* Ensure it stays above content */
                    background: #1e293b; /* Gold Standard Navy (slate-800) */
                    color: white;
                    padding: 16px 24px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 0.85em;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #0f172a;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .matrix-th:first-child {
                    text-align: left;
                    width: 40%;
                    background: #0f172a; /* Darker Slate for Row Label Header */
                    left: 0; /* Sticky Horizontal? Optional, but complex */
                    z-index: 30; /* Higher than other headers if we made it sticky-left */
                }
                .matrix-row {
                    transition: background 0.15s ease;
                }
                .matrix-row:not(:last-child) {
                    border-bottom: 1px solid #e2e8f0;
                }
                
                /* Zebra Striping */
                .matrix-row:nth-child(even) {
                    background-color: #f8fafc; /* slate-50 */
                }
                
                /* Interaction: Row Answered State */
                .matrix-row.answered {
                    background-color: #ffffff; /* Reset zebra? Or blend? */
                    background-image: linear-gradient(to right, #eff6ff, transparent); /* blue-50 fade */
                    border-left: 3px solid #3b82f6;
                }
                .matrix-row.answered:nth-child(even) {
                   background-image: linear-gradient(to right, #eff6ff, #f8fafc);
                }

                /* Hover Effect */
                .matrix-row:hover:not(.submitted) {
                    background-color: #e0f2fe !important; /* sky-100 */
                }

                .matrix-td {
                    padding: 12px 16px;
                    text-align: center;
                    position: relative;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e8f0;
                    cursor: pointer; /* Makes entire cell feel actionable */
                }
                .matrix-row-label {
                    text-align: left;
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 1em;
                    padding: 12px 24px;
                    border-right: 1px solid #f1f5f9;
                }
                
                /* Feedback Pill Animation */
                .feedback-pill {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.7rem;
                    font-weight: 700;
                    opacity: 0;
                    animation: fadeInUp 0.3s forwards;
                    background: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 5;
                    white-space: nowrap;
                }
                @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
            `}</style>

            <div className="matrix-container">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-th">
                                {config.rowLabel || "Assessment Findings"}
                            </th>
                            {config.columns?.map((col: any) => (
                                <th key={col.id} className="matrix-th">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {config.rows?.map((row: any) => {
                            const answered = isRowAnswered(row.id);
                            return (
                                <tr key={row.id} className={`matrix-row ${isSubmitted ? 'submitted' : ''} ${answered && !isSubmitted ? 'answered' : ''}`}>
                                    <td className="matrix-row-label">{row.text || row.label}</td>
                                    {config.columns?.map((col: any) => {
                                        const status = getCellStatus(row.id, col.id);
                                        let cellBg = 'transparent';
                                        if (status === 'correct') cellBg = 'rgba(16, 185, 129, 0.08)';
                                        if (status === 'incorrect') cellBg = 'rgba(225, 29, 72, 0.08)';
                                        if (status === 'missed') cellBg = 'rgba(245, 158, 11, 0.08)';
                                        if (cellBg === 'transparent' && answered && !isSubmitted) cellBg = 'inherit'; // Inherit row gradient

                                        return (
                                            <td
                                                key={col.id}
                                                className="matrix-td"
                                                style={{ backgroundColor: cellBg }}
                                                onClick={() => !isSubmitted && handleCellClick(row.id, col.id)}
                                            >
                                                <div style={{ display: 'inline-flex' }}>
                                                    <InputVisual
                                                        type={isMultipleResponse ? 'checkbox' : 'radio'}
                                                        checked={isSelected(row.id, col.id)}
                                                        correct={status === 'correct'}
                                                        incorrect={status === 'incorrect'}
                                                    />
                                                </div>
                                                {isSubmitted && (
                                                    <>
                                                        {status === 'correct' && <div className="feedback-pill" style={{ color: '#16a34a' }}>Correct</div>}
                                                        {status === 'incorrect' && <div className="feedback-pill" style={{ color: '#dc2626' }}>Incorrect</div>}
                                                        {status === 'missed' && <div className="feedback-pill" style={{ color: '#ca8a04' }}>Missed</div>}
                                                    </>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend / Constraint Helper */}
            <div style={{ marginTop: '12px', color: '#64748b', fontSize: '0.85rem', display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 12, height: 12, border: '2px solid #cbd5e1', borderRadius: '50%' }}></div>
                    Click any cell to select
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 12, height: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}></div>
                    Blue highlight = Answered
                </span>
            </div>
        </div>
    );
};
