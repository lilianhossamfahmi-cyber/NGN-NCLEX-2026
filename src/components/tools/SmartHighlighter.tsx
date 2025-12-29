import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

export const SmartHighlighter: React.FC = () => {
    const [color, setColor] = useState<'yellow' | 'green' | 'pink'>('yellow');
    const [active, setActive] = useState(false);


    // Colors
    const colors = {
        yellow: { bg: '#fef08a', border: '#eab308', text: '#854d0e' },
        green: { bg: '#bbf7d0', border: '#22c55e', text: '#14532d' },
        pink: { bg: '#fbcfe8', border: '#ec4899', text: '#831843' }
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

    return (
        <div className="access-panel">
            {/* Toggle Active Switch */}
            <div className="access-row" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>Highlighter Mode</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {active ? 'Select text to highlight' : 'Disabled'}
                    </span>
                </div>
                <div
                    className={`toggle-switch ${active ? 'active' : ''}`}
                    onClick={() => setActive(!active)}
                >
                    <div className="toggle-knob"></div>
                </div>
            </div>

            {/* Color Selection */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                opacity: active ? 1 : 0.5,
                pointerEvents: active ? 'auto' : 'none',
                transition: 'opacity 0.2s'
            }}>
                {(['yellow', 'green', 'pink'] as const).map(c => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        style={{
                            background: colors[c].bg,
                            border: `2px solid ${color === c ? 'white' : 'transparent'}`,
                            height: '32px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            padding: 0,
                            position: 'relative',
                            boxShadow: color === c ? `0 0 0 2px ${colors[c].border}` : 'none'
                        }}
                        title={`${c.charAt(0).toUpperCase() + c.slice(1)} Highlighter`}
                    >
                        {color === c && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors[c].text,
                                fontSize: '14px'
                            }}>
                                ✓
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <button
                    onClick={handleClearAll}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    Clear All Highlights
                </button>
            </div>
        </div>
    );
};
