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
        if (window.confirm('Clear notes?')) {
            setNote('');
            localStorage.setItem(STORAGE_KEY, '');
        }
    };

    return (
        <div className="notepad-body" style={{ minHeight: '300px' }}>
            <div className="notepad-toolbar">
                <button
                    onClick={handleClear}
                    style={{ background: 'transparent', border: 'none', color: '#b45309', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                    CLEAR
                </button>
                <div style={{ color: '#b45309', fontWeight: 700, fontSize: '12px', letterSpacing: '1px' }}>NOTES</div>
                <button
                    onClick={handleCopy}
                    style={{ background: 'transparent', border: 'none', color: '#b45309', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                    COPY
                </button>
            </div>
            <textarea
                className="notepad-textarea"
                value={note}
                onChange={handleChange}
                placeholder="Type your notes here... (Auto-saved)"
            />
        </div>
    );
};
