import React from 'react';
import Draggable from 'react-draggable';
import './ToolSuite.css';

// Icons (Simple SVGs)
const CalcIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="9" y2="13" /><line x1="12" y1="13" x2="12" y2="13" /><line x1="15" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="9" y2="17" /><line x1="12" y1="17" x2="12" y2="17" /><line x1="15" y1="17" x2="15" y2="17" /></svg>;
const NoteIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
const ZoomIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;


const TimerIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const LabIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 2v7.31"></path><path d="M14 2v7.31"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path></svg>;

interface FloatingDockProps {
    activeTools: string[];
    onToggle: (tool: string) => void;
}



export const FloatingDock: React.FC<FloatingDockProps> = ({ activeTools, onToggle }) => {
    const nodeRef = React.useRef(null);
    return (
        <Draggable handle=".dock-drag-handle" nodeRef={nodeRef}>
            <div ref={nodeRef} className="tool-dock" style={{ position: 'absolute', right: '110px', top: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                {/* Drag Handle */}
                <div className="dock-drag-handle" style={{ cursor: 'grab', display: 'flex', alignItems: 'center', padding: '0 4px', borderRight: '1px solid #cbd5e1', background: '#f8fafc', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}>
                    <svg width="12" height="24" viewBox="0 0 12 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <circle cx="4" cy="8" r="1" fill="currentColor" />
                        <circle cx="4" cy="12" r="1" fill="currentColor" />
                        <circle cx="4" cy="16" r="1" fill="currentColor" />
                        <circle cx="8" cy="8" r="1" fill="currentColor" />
                        <circle cx="8" cy="12" r="1" fill="currentColor" />
                        <circle cx="8" cy="16" r="1" fill="currentColor" />
                    </svg>
                </div>

                <button
                    className={`dock-btn ${activeTools.includes('calc') ? 'active' : ''}`}
                    onClick={() => onToggle('calc')}
                    style={{ width: '48px', height: '48px' }} // Bigger buttons
                >
                    <CalcIcon />
                    <span className="dock-tooltip">Calculator</span>
                </button>

                <button
                    className={`dock-btn ${activeTools.includes('notes') ? 'active' : ''}`}
                    onClick={() => onToggle('notes')}
                    style={{ width: '48px', height: '48px' }}
                >
                    <NoteIcon />
                    <span className="dock-tooltip">Notepad</span>
                </button>

                <button
                    className={`dock-btn ${activeTools.includes('timer') ? 'active' : ''}`}
                    onClick={() => onToggle('timer')}
                    style={{ width: '48px', height: '48px' }}
                >
                    <TimerIcon />
                    <span className="dock-tooltip">Timer</span>
                </button>

                <button
                    className={`dock-btn ${activeTools.includes('labs') ? 'active' : ''}`}
                    onClick={() => onToggle('labs')}
                    style={{ width: '48px', height: '48px' }}
                >
                    <LabIcon />
                    <span className="dock-tooltip">Ref Labs</span>
                </button>

                <button
                    className={`dock-btn ${activeTools.includes('access') ? 'active' : ''}`}
                    onClick={() => onToggle('access')}
                    style={{ width: '48px', height: '48px' }}
                >
                    <ZoomIcon />
                    <span className="dock-tooltip">Text Size</span>
                </button>

                <button
                    className={`dock-btn ${activeTools.includes('highlighter') ? 'active' : ''}`}
                    onClick={() => onToggle('highlighter')}
                    style={{ width: '48px', height: '48px' }}
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <span className="dock-tooltip">Highlighter</span>
                </button>

                <button
                    className="dock-btn"
                    onClick={() => onToggle('mark')}
                    style={{ width: '48px', height: '48px', borderRight: 'none', color: activeTools.includes('mark') ? '#eab308' : 'currentColor' }}
                >
                    {activeTools.includes('mark') ? (
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    )}
                    <span className="dock-tooltip">{activeTools.includes('mark') ? 'Unmark' : 'Mark for Review'}</span>
                </button>
            </div>
        </Draggable>
    );
};
