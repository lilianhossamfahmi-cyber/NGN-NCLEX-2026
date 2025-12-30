import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

export const ExamTimer: React.FC = () => {
    const [mode, setMode] = useState<'countdown' | 'elapsed'>('countdown');
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
    const [elapsed, setElapsed] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                if (mode === 'countdown') {
                    setTimeLeft(prev => Math.max(0, prev - 1));
                } else {
                    setElapsed(prev => prev + 1);
                }
            }, 1000);
        } else if (!isActive && timeLeft !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, mode, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isWarning = mode === 'countdown' && timeLeft < 5 * 60 && timeLeft > 0;
    const displayTime = mode === 'countdown' ? timeLeft : elapsed;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px',
            textAlign: 'center'
        }}>
            {/* Timer Display */}
            <div style={{
                background: isWarning
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(127, 29, 29, 0.3) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
                borderRadius: 16,
                padding: '28px 20px',
                border: isWarning
                    ? '2px solid rgba(239, 68, 68, 0.4)'
                    : '2px solid rgba(99, 102, 241, 0.2)',
                marginBottom: 16,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '200px',
                    background: isWarning
                        ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />

                <div style={{
                    fontSize: '3.2rem',
                    fontWeight: 800,
                    fontFamily: '"JetBrains Mono", monospace',
                    letterSpacing: '-2px',
                    color: isWarning ? '#f87171' : '#f8fafc',
                    textShadow: isWarning ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(99, 102, 241, 0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {formatTime(displayTime)}
                </div>

                <div style={{
                    fontSize: '0.7rem',
                    color: '#94a3b8',
                    marginTop: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600
                }}>
                    {mode === 'countdown' ? '⏱️ Remaining' : '⏱️ Elapsed'}
                </div>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setIsActive(!isActive)}
                    style={{
                        padding: '10px 20px',
                        background: isActive
                            ? 'linear-gradient(135deg, #475569, #334155)'
                            : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    {isActive ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button
                    onClick={() => setMode(mode === 'countdown' ? 'elapsed' : 'countdown')}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    🔄 {mode === 'countdown' ? 'Count Up' : 'Countdown'}
                </button>
                <button
                    onClick={() => { setTimeLeft(60 * 60); setElapsed(0); setIsActive(false); }}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    🔄 Reset
                </button>
            </div>

            {/* Warning Message */}
            {isWarning && (
                <div style={{
                    color: '#fca5a5',
                    marginTop: 16,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(239, 68, 68, 0.15)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    animation: 'pulse 1s infinite'
                }}>
                    ⚠️ LESS THAN 5 MINUTES REMAINING!
                </div>
            )}
        </div>
    );
};
