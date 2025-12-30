import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

export const SmartHighlighter: React.FC = () => {
    const [color, setColor] = useState<'yellow' | 'green' | 'pink' | 'blue' | 'purple'>('yellow');
    const [active, setActive] = useState(false);

    // Colors with premium styling
    const colors = {
        yellow: { bg: '#fef08a', border: '#eab308', text: '#854d0e', label: 'Yellow' },
        green: { bg: '#bbf7d0', border: '#22c55e', text: '#14532d', label: 'Green' },
        pink: { bg: '#fbcfe8', border: '#ec4899', text: '#831843', label: 'Pink' },
        blue: { bg: '#bfdbfe', border: '#3b82f6', text: '#1e3a8a', label: 'Blue' },
        purple: { bg: '#e9d5ff', border: '#a855f7', text: '#581c87', label: 'Purple' }
    };

    // --- HIGHLIGHTER LOGIC ---
    useEffect(() => {
        const handleSelection = () => {
            if (!active) return;

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

            const range = selection.getRangeAt(0);

            // Basic safety: Ensure we aren't highlighting inside fixed tools
            let parent: HTMLElement | null = range.commonAncestorContainer.parentElement;
            while (parent) {
                if (parent.classList.contains('drag-window-container') || parent.classList.contains('tool-dock')) return;
                parent = parent.parentElement;
            }

            try {
                const mark = document.createElement('mark');
                mark.style.backgroundColor = colors[color].bg;
                mark.style.padding = '2px 0';
                mark.style.cursor = 'pointer';
                mark.title = 'Click to remove highlight';
                mark.classList.add('user-highlight');

                // Add click listener to remove
                mark.onclick = (e) => {
                    e.stopPropagation(); // prevent re-selection
                    const text = document.createTextNode(mark.textContent || '');
                    mark.parentNode?.replaceChild(text, mark);
                };

                range.surroundContents(mark);
                selection.removeAllRanges();
            } catch (e) {
                console.warn("Cannot highlight complex range", e);
            }
        };

        const container = document.querySelector('.split-layout-container') || document.body;
        if (active) {
            container.addEventListener('mouseup', handleSelection);
        }

        return () => {
            container.removeEventListener('mouseup', handleSelection);
        };
    }, [active, color]);

    const handleClearAll = () => {
        const marks = document.querySelectorAll('.user-highlight');
        marks.forEach(mark => {
            const text = document.createTextNode(mark.textContent || '');
            mark.parentNode?.replaceChild(text, mark);
        });
    };

    const highlightCount = document.querySelectorAll('.user-highlight').length;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px'
        }}>
            {/* Status Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                padding: '12px 16px',
                background: active
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)'
                    : 'rgba(255,255,255,0.05)',
                borderRadius: 10,
                border: active ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.1)'
            }}>
                <div>
                    <div style={{
                        fontWeight: 700,
                        color: active ? '#10b981' : '#94a3b8',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />}
                        {active ? '✨ Highlighter Active' : '🖍️ Highlighter Off'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
                        {active ? 'Select any text to highlight it' : 'Enable to start highlighting'}
                    </div>
                </div>
                <div
                    onClick={() => setActive(!active)}
                    style={{
                        width: 52,
                        height: 28,
                        background: active ? 'linear-gradient(135deg, #10b981, #059669)' : '#334155',
                        borderRadius: 14,
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: active ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                >
                    <div style={{
                        width: 24,
                        height: 24,
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 2,
                        left: active ? 26 : 2,
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>
            </div>

            {/* Color Selection */}
            <div style={{ marginBottom: 16 }}>
                <div style={{
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600
                }}>
                    🎨 Choose Color
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    opacity: active ? 1 : 0.5,
                    pointerEvents: active ? 'auto' : 'none',
                    transition: 'opacity 0.2s'
                }}>
                    {(Object.keys(colors) as Array<keyof typeof colors>).map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            style={{
                                background: colors[c].bg,
                                border: color === c ? `3px solid white` : '3px solid transparent',
                                height: '36px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                padding: 0,
                                position: 'relative',
                                boxShadow: color === c
                                    ? `0 0 0 2px ${colors[c].border}, 0 4px 8px rgba(0,0,0,0.2)`
                                    : '0 2px 4px rgba(0,0,0,0.1)',
                                transform: color === c ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.2s'
                            }}
                            title={colors[c].label}
                        >
                            {color === c && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: colors[c].text,
                                    fontSize: '16px',
                                    fontWeight: 700
                                }}>
                                    ✓
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats & Actions */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
            }}>
                {/* Highlight Count */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8
                }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Highlights on Page
                    </span>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: highlightCount > 0 ? '#818cf8' : '#64748b',
                        background: highlightCount > 0 ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        padding: '2px 8px',
                        borderRadius: 4
                    }}>
                        {highlightCount}
                    </span>
                </div>

                {/* Clear Button */}
                <button
                    onClick={handleClearAll}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 8,
                        color: '#fca5a5',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))';
                        e.currentTarget.style.color = '#fca5a5';
                    }}
                >
                    🗑️ Clear All Highlights
                </button>
            </div>
        </div>
    );
};
