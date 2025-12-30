import React, { useState, useEffect, useCallback } from 'react';
import './ToolSuite.css';

// Global state for zoom synchronization
let globalZoomLevel = 100;
const zoomListeners: Set<(level: number) => void> = new Set();

export const getGlobalZoom = () => globalZoomLevel;

export const subscribeToZoom = (callback: (level: number) => void) => {
    zoomListeners.add(callback);
    return () => zoomListeners.delete(callback);
};

export const AccessibilityTools: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isMagnifierActive, setIsMagnifierActive] = useState(false);

    const applyZoom = useCallback((level: number) => {
        globalZoomLevel = level;
        const scale = level / 100;

        // Target specific scrollable panels to preserve layout structure
        const panels = document.querySelectorAll('.ehr-panel, .question-section');

        panels.forEach(el => {
            const hEl = el as HTMLElement;
            const style = hEl.style as any;

            // Use CSS zoom property (standard in Chrome/Edge/modern browsers) for best reflow
            if (typeof style.zoom !== 'undefined') {
                style.zoom = scale;
            } else {
                // Fallback for Firefox
                style.transform = level !== 100 ? `scale(${scale})` : '';
                style.transformOrigin = 'top left';
                style.width = level !== 100 ? `${100 / scale}%` : '';
            }
        });

        // Use a fallback for the main container if individual panels aren't found
        if (panels.length === 0) {
            const container = document.querySelector('.split-layout-container') as HTMLElement;
            if (container) {
                const style = container.style as any;
                if (typeof style.zoom !== 'undefined') {
                    style.zoom = scale;
                } else {
                    style.transform = level !== 100 ? `scale(${scale})` : '';
                    style.transformOrigin = 'top left';
                    style.width = level !== 100 ? `${100 / scale}%` : '';
                }
            }
        }

        // Notify global listeners
        zoomListeners.forEach(listener => listener(level));
    }, []);

    useEffect(() => {
        applyZoom(zoomLevel);
    }, [zoomLevel, applyZoom]);

    // Magnifier Tool Logic
    useEffect(() => {
        const panels = document.querySelectorAll('.ehr-panel, .question-section');

        if (!isMagnifierActive) {
            panels.forEach(p => (p as HTMLElement).style.cursor = '');
            return;
        }

        const handleMagnifyClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.ehr-panel') || target.closest('.question-section')) {
                setZoomLevel(prev => prev > 100 ? 100 : 125);
            }
        };

        panels.forEach(p => (p as HTMLElement).style.cursor = 'zoom-in');

        document.addEventListener('click', handleMagnifyClick, true);
        return () => {
            document.removeEventListener('click', handleMagnifyClick, true);
            panels.forEach(p => (p as HTMLElement).style.cursor = '');
        };
    }, [isMagnifierActive]);


    const adjustZoom = (delta: number) => {
        setZoomLevel(prev => Math.min(Math.max(prev + delta, 75), 150));
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px'
        }}>
            {/* Zoom Level Display */}
            <div style={{
                textAlign: 'center',
                marginBottom: 20,
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)',
                borderRadius: 12,
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: '#f8fafc',
                    fontFamily: '"JetBrains Mono", monospace'
                }}>
                    {zoomLevel}%
                </div>
                <div style={{
                    fontSize: '0.7rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: 4
                }}>
                    Current Zoom Level
                </div>
            </div>

            {/* Zoom Controls */}
            <div style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 16
            }}>
                <button
                    onClick={() => adjustZoom(-10)}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #334155, #1e293b)',
                        color: '#f8fafc',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    A-
                </button>
                <button
                    onClick={() => adjustZoom(10)}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #334155, #1e293b)',
                        color: '#f8fafc',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    A+
                </button>
                <button
                    onClick={() => setZoomLevel(100)}
                    style={{
                        padding: '0 20px',
                        height: 48,
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Magnifier Toggle */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 16
            }}>
                <button
                    onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: isMagnifierActive
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
                            : 'rgba(255,255,255,0.05)',
                        border: isMagnifierActive
                            ? '1px solid rgba(16, 185, 129, 0.4)'
                            : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        color: isMagnifierActive ? '#34d399' : '#94a3b8',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    {isMagnifierActive ? 'Magnifier Active' : 'Enable Magnifier'}
                </button>
            </div>

            {/* Help Text */}
            <div style={{
                marginTop: 12,
                fontSize: '0.65rem',
                color: '#64748b',
                textAlign: 'center',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8
            }}>
                {isMagnifierActive
                    ? '👆 Click any area to toggle Zoom In/Out'
                    : '📝 Applies to EHR and Question panels'}
            </div>
        </div>
    );
};

// Standalone zoom controls
export const ZoomControls: React.FC<{ position?: 'left' | 'right' }> = ({ position: _position = 'left' }) => {
    const [zoomLevel, setZoomLevel] = useState(100);

    useEffect(() => {
        const unsubscribe = subscribeToZoom(setZoomLevel);
        return () => { unsubscribe(); };
    }, []);

    const adjustZoom = (delta: number) => {
        const next = Math.min(Math.max(zoomLevel + delta, 75), 150);
        setZoomLevel(next);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: 'rgba(255,255,255,0.9)', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <button onClick={() => adjustZoom(-10)} style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>A-</button>
            <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#334155' }}>{zoomLevel}%</span>
            <button onClick={() => adjustZoom(10)} style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>A+</button>
        </div>
    );
};
