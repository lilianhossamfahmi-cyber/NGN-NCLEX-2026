import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

interface StickyNote {
    id: string;
    content: string;
    color: string;
    fontSize: number;
}

const NOTE_COLORS = [
    { name: 'Yellow', value: '#fef08a', textColor: '#1e3a8a' },
    { name: 'Pink', value: '#fecdd3', textColor: '#881337' },
    { name: 'Green', value: '#bbf7d0', textColor: '#14532d' },
    { name: 'Blue', value: '#bfdbfe', textColor: '#1e3a8a' },
    { name: 'Purple', value: '#e9d5ff', textColor: '#581c87' },
];

const FONT_SIZES = [
    { label: 'S', value: 1.2 },
    { label: 'M', value: 1.5 },
    { label: 'L', value: 1.8 },
];

export const SmartNotepad: React.FC = () => {
    const STORAGE_KEY = 'ngn_smart_notepad_v2';

    const [notes, setNotes] = useState<StickyNote[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Initialize with default note
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNotes(parsed);
                    setActiveNoteId(parsed[0].id);
                    return;
                }
            } catch {
                // Invalid data, create default
            }
        }
        // Create default note
        const defaultNote: StickyNote = {
            id: `note_${Date.now()}`,
            content: '',
            color: NOTE_COLORS[0].value,
            fontSize: 1.5
        };
        setNotes([defaultNote]);
        setActiveNoteId(defaultNote.id);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        }
    }, [notes]);

    const activeNote = notes.find(n => n.id === activeNoteId);
    const activeColorConfig = NOTE_COLORS.find(c => c.value === activeNote?.color) || NOTE_COLORS[0];

    const updateNote = (id: string, updates: Partial<StickyNote>) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const addNote = () => {
        const newNote: StickyNote = {
            id: `note_${Date.now()}`,
            content: '',
            color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].value,
            fontSize: 1.5
        };
        setNotes(prev => [...prev, newNote]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (id: string) => {
        if (notes.length <= 1) {
            alert('You must keep at least one note!');
            return;
        }
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (activeNoteId === id) {
            setActiveNoteId(newNotes[0]?.id || null);
        }
    };

    const handleCopy = () => {
        if (activeNote) {
            navigator.clipboard.writeText(activeNote.content);
        }
    };

    return (
        <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column' }}>
            {/* Note Tabs */}
            <div style={{
                display: 'flex',
                gap: 4,
                padding: '8px 12px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                overflowX: 'auto',
                alignItems: 'center'
            }}>
                {notes.map((note, idx) => (
                    <div
                        key={note.id}
                        onClick={() => setActiveNoteId(note.id)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            background: activeNoteId === note.id ? note.color : 'rgba(255,255,255,0.1)',
                            color: activeNoteId === note.id
                                ? (NOTE_COLORS.find(c => c.value === note.color)?.textColor || '#1e3a8a')
                                : '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>📝 {idx + 1}</span>
                        {notes.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    padding: 0,
                                    fontSize: '0.65rem',
                                    opacity: 0.7
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={addNote}
                    style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px dashed rgba(99, 102, 241, 0.5)',
                        color: '#818cf8',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}
                >
                    + New
                </button>
            </div>

            {/* Note Body */}
            {activeNote && (
                <div
                    className="notepad-body"
                    style={{
                        flex: 1,
                        background: activeNote.color,
                        backgroundImage: `linear-gradient(${activeColorConfig.textColor}15 1px, transparent 1px)`,
                        backgroundSize: '100% 32px'
                    }}
                >
                    {/* Toolbar */}
                    <div style={{
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `1px solid ${activeColorConfig.textColor}20`,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeColorConfig.textColor,
                                cursor: 'pointer',
                                fontWeight: 800,
                                fontSize: '12px',
                                fontFamily: '"JetBrains Mono", monospace',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}
                        >
                            ⚙️ Settings
                        </button>
                        <div style={{
                            color: activeColorConfig.textColor,
                            fontWeight: 800,
                            fontSize: '11px',
                            letterSpacing: '1px',
                            fontFamily: '"JetBrains Mono", monospace',
                            opacity: 0.5
                        }}>
                            STICKY NOTE #{notes.findIndex(n => n.id === activeNoteId) + 1}
                        </div>
                        <button
                            onClick={handleCopy}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeColorConfig.textColor,
                                cursor: 'pointer',
                                fontWeight: 800,
                                fontSize: '12px',
                                fontFamily: '"JetBrains Mono", monospace'
                            }}
                        >
                            📋 COPY
                        </button>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.5)',
                            backdropFilter: 'blur(8px)',
                            borderBottom: `1px solid ${activeColorConfig.textColor}20`,
                            display: 'flex',
                            gap: 16,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {/* Color Picker */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: activeColorConfig.textColor }}>Color:</span>
                                {NOTE_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => updateNote(activeNote.id, { color: color.value })}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 6,
                                            background: color.value,
                                            border: activeNote.color === color.value
                                                ? `2px solid ${color.textColor}`
                                                : '2px solid transparent',
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>

                            {/* Font Size */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: activeColorConfig.textColor }}>Size:</span>
                                {FONT_SIZES.map(size => (
                                    <button
                                        key={size.label}
                                        onClick={() => updateNote(activeNote.id, { fontSize: size.value })}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 6,
                                            background: activeNote.fontSize === size.value ? activeColorConfig.textColor : 'rgba(255,255,255,0.7)',
                                            color: activeNote.fontSize === size.value ? 'white' : activeColorConfig.textColor,
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Textarea */}
                    <textarea
                        value={activeNote.content}
                        onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                        placeholder="Write your clinical notes here..."
                        spellCheck={false}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            padding: '16px 24px',
                            outline: 'none',
                            resize: 'none',
                            fontFamily: '"Caveat", cursive',
                            fontSize: `${activeNote.fontSize}rem`,
                            fontWeight: 700,
                            lineHeight: 1.6,
                            color: activeColorConfig.textColor,
                            minHeight: '200px'
                        }}
                    />
                </div>
            )}
        </div>
    );
};
