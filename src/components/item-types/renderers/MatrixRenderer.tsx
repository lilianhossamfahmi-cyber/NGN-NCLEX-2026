import React from 'react';
import { GenericRendererProps } from './types';


// PART 4: MATRIX MULTIPLE RESPONSE – GOLD STANDARD UPGRADE (Responsive Mobile Fix)
// Features: Sticky Headers, Responsive Scroll Table, Full-Cell Clickability, Premium Aesthetics
export const MatrixRenderer: React.FC<GenericRendererProps> = ({ config, answers, setAnswers, isSubmitted }) => {
    // No separate mobile view - Unified Responsive Table
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
            // [LOG-01 Fix Support] Helper check for plural IDs in rendering too
            const correctCols = row.correctColumns || row.correctColumnIds || (row.correctColumnId ? [row.correctColumnId] : []);
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
            baseStyle.borderColor = '#22c55e'; // success
            baseStyle.background = '#22c55e';
        } else if (incorrect) {
            baseStyle.borderColor = '#ef4444'; // danger
            baseStyle.background = '#ef4444';
        } else if (checked) {
            baseStyle.borderColor = '#3b82f6'; // blue-500
            baseStyle.background = '#3b82f6';
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

    // Unified View with Mobile Scroll Wrapper
    // GUARD: Early return if rows/columns are missing to prevent crash
    if (!config.rows?.length || !config.columns?.length) {
        return (
            <div className="matrix-renderer font-inter p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Matrix Configuration Error</span>
                </div>
                <p className="text-sm text-red-600 mt-2">
                    Missing required data: {!config.rows?.length && 'rows'}{!config.rows?.length && !config.columns?.length && ' and '}{!config.columns?.length && 'columns'}.
                    <br />
                    <span className="text-xs text-red-500">Item ID: {config.id || 'unknown'}</span>
                </p>
            </div>
        );
    }

    return (
        <div className="matrix-renderer font-inter" style={{ margin: '1rem 0' }}>
            <style>{`
                .matrix-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                    position: relative;
                    /* [UI-01 Fix] Responsive Overflow Wrapper */
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    max-width: 100%;
                }
                .matrix-table {
                    width: 100%;
                    border-collapse: separate; 
                    border-spacing: 0;
                    /* Prevent crushing on mobile */
                    min-width: 600px;
                }
                .matrix-th {
                    position: sticky;
                    top: 0;
                    z-index: 20; 
                    background: #1e293b; /* Gold Standard Navy */
                    color: white;
                    padding: 16px 24px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 0.85em;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #0f172a;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    white-space: nowrap;
                    /* [UI-01 Fix] Min widths */
                    min-width: 120px;
                }
                .matrix-th:first-child {
                    text-align: left;
                    left: 0;
                    z-index: 30; /* Higher than other headers */
                    min-width: 180px;
                    position: sticky;
                }
                .matrix-row {
                    transition: background 0.15s ease;
                }
                .matrix-row:not(:last-child) {
                    border-bottom: 1px solid #e2e8f0;
                }
                
                /* Zebra Striping */
                .matrix-row:nth-child(even) {
                    background-color: #f8fafc;
                }
                
                /* Hover Effect */
                .matrix-row:hover:not(.submitted) {
                    background-color: #e0f2fe !important; 
                }
                .matrix-row.answered {
                     border-left: 3px solid #3b82f6; 
                }

                .matrix-td {
                    padding: 16px;
                    text-align: center;
                    position: relative;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e8f0;
                    cursor: pointer;
                }
                .matrix-row-label {
                    text-align: left;
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 1em;
                    padding: 16px 24px;
                    border-right: 1px solid #f1f5f9;
                    position: sticky; /* Make row label sticky too? Optional */
                    left: 0;
                    background: inherit; /* Should match row bg */
                    z-index: 10;
                    /* [UI-01 Fix] Elevation for sticky col */
                    box-shadow: 4px 0 6px -4px rgba(0,0,0,0.1);
                }
                /* Need to ensure row background propagates to sticky cell */
                .matrix-row:nth-child(even) .matrix-row-label { background: #f8fafc; }
                .matrix-row:nth-child(odd) .matrix-row-label { background: white; }
                .matrix-row:hover:not(.submitted) .matrix-row-label { background: #e0f2fe !important; }

                /* Feedback Pill */
                .feedback-pill {
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.65rem;
                    font-weight: 700;
                    opacity: 0;
                    animation: fadeInUp 0.3s forwards;
                    background: white;
                    padding: 2px 6px;
                    border-radius: 99px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 5;
                    white-space: nowrap;
                    border: 1px solid #e2e8f0;
                }
                @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 4px); } to { opacity: 1; transform: translate(-50%, 0); } }
            `}</style>

            <div className="matrix-container relative">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-th">
                                {config.rowLabel || "Assessment Findings"}
                            </th>
                            {config.columns?.map((col: any) => (
                                <th key={col.id} className="matrix-th">
                                    {col.label || col.text}
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
                                        if (status === 'correct') cellBg = 'rgba(16, 185, 129, 0.1)';
                                        if (status === 'incorrect') cellBg = 'rgba(225, 29, 72, 0.1)';
                                        if (status === 'missed') cellBg = 'rgba(245, 158, 11, 0.1)';

                                        return (
                                            <td
                                                key={col.id}
                                                className="matrix-td"
                                                style={{ backgroundColor: cellBg !== 'transparent' ? cellBg : undefined }}
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
                                                        {status === 'correct' && <div className="feedback-pill text-green-600 border-green-200">Correct</div>}
                                                        {status === 'incorrect' && <div className="feedback-pill text-red-600 border-red-200">Incorrect</div>}
                                                        {status === 'missed' && <div className="feedback-pill text-amber-600 border-amber-200">Missed</div>}
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
            <div className="mt-3 text-slate-500 text-sm flex gap-4 items-center flex-wrap">
                <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                    Click cell to select
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200"></div>
                    Highlighted row = Answered
                </span>
                {isMultipleResponse && <span className="text-xs bg-slate-100 px-2 py-1 rounded">Select all that apply</span>}
            </div>
        </div>
    );
};
