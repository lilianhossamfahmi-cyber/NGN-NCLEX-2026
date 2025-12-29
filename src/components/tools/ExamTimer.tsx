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

    return (
        <div style={{ padding: '8px', textAlign: 'center' }}>
            <div className={`timer-face ${isWarning ? 'warning' : ''}`}>
                {mode === 'countdown' ? formatTime(timeLeft) : formatTime(elapsed)}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                    onClick={() => setIsActive(!isActive)}
                    style={{ padding: '6px 12px', background: isActive ? '#334155' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={() => setMode(mode === 'countdown' ? 'elapsed' : 'countdown')}
                    style={{ padding: '6px 12px', background: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {mode === 'countdown' ? 'Mode: Count Up' : 'Mode: Count Down'}
                </button>
                <button
                    onClick={() => { setTimeLeft(60 * 60); setElapsed(0); setIsActive(false); }}
                    style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Reset
                </button>
            </div>
            {isWarning && <div style={{ color: '#ef4444', marginTop: '8px', fontSize: '12px', fontWeight: 'bold' }}>LESS THAN 5 MINS!</div>}
        </div>
    );
};
