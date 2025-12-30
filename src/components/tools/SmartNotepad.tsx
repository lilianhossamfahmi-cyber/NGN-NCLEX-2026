import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

export const SmartNotepad: React.FC = () => {
    const [note, setNote] = useState('');
    const STORAGE_KEY = 'ngn_smart_notepad';

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setNote(saved);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setNote(newVal);
        localStorage.setItem(STORAGE_KEY, newVal);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(note);
    };

    const handleClear = () => {
        if (window.confirm('Clear your messy notes?')) {
            setNote('');
            localStorage.setItem(STORAGE_KEY, '');
        }
    };

    return (
        <div className="notepad-body" style={{ minHeight: '320px' }}>
            <div className="notepad-toolbar">
                <button
                    onClick={handleClear}
                    style={{ background: 'transparent', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontWeight: 800, fontSize: '12px', fontFamily: '"JetBrains Mono", monospace' }}
                >
                    CLEAR
                </button>
                <div style={{ color: '#1e3a8a', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace', opacity: 0.5 }}>STICKY NOTE</div>
                <button
                    onClick={handleCopy}
                    style={{ background: 'transparent', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontWeight: 800, fontSize: '12px', fontFamily: '"JetBrains Mono", monospace' }}
                >
                    COPY
                </button>
            </div>
            <textarea
                className="notepad-textarea"
                value={note}
                onChange={handleChange}
                placeholder="Write your clinical notes here..."
                spellCheck={false}
            />
        </div>
    );
};
