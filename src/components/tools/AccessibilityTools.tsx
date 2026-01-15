import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [hoverZoomEnabled, setHoverZoomEnabled] = useState(false);
    const [hoverZoomStrengthDisplay, setHoverZoomStrengthDisplay] = useState(1.25);

    // Refs for performance (avoid re-attaching listeners on every zoom tick)
    const zoomStrengthRef = useRef(1.25);
    const activePanelRef = useRef<HTMLElement | null>(null);

    const applyZoom = useCallback((level: number) => {
        globalZoomLevel = level;
        const scale = level / 100;

        const panels = document.querySelectorAll('.ehr-panel, .question-section, .expert-dashboard');

        panels.forEach(el => {
            const hEl = el as HTMLElement;
            const style = hEl.style as any;

            if (typeof style.zoom !== 'undefined') {
                style.zoom = scale;
            } else {
                style.transform = level !== 100 ? `scale(${scale})` : '';
                style.transformOrigin = 'top left';
                style.width = level !== 100 ? `${100 / scale}%` : '';
            }
        });

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

        zoomListeners.forEach(listener => listener(level));
    }, []);

    useEffect(() => {
        applyZoom(zoomLevel);
    }, [zoomLevel, applyZoom]);

    // Magnifier & Scroll-Zoom Logic
    useEffect(() => {
        if (!isMagnifierActive) {
            const existingOverlay = document.getElementById('magnifier-overlay');
            if (existingOverlay) existingOverlay.remove();

            if (activePanelRef.current) {
                activePanelRef.current.style.transform = '';
                activePanelRef.current.style.zIndex = '';
                activePanelRef.current.style.boxShadow = '';
                activePanelRef.current.style.transition = '';
                activePanelRef.current.style.position = '';
                activePanelRef.current = null;
            }

            document.body.style.cursor = '';
            const panels = document.querySelectorAll('.ehr-panel, .question-section, .expert-dashboard');
            panels.forEach(p => (p as HTMLElement).style.cursor = '');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'magnifier-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '9999',
            mixBlendMode: 'multiply',
            transition: 'background 0.1s ease',
            background: 'rgba(0, 0, 0, 0.4)'
        });
        document.body.appendChild(overlay);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            overlay.style.background = `radial-gradient(circle 120px at ${clientX}px ${clientY}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.8) 100%)`;

            if (hoverZoomEnabled) {
                const target = e.target as HTMLElement;
                const panel = target.closest('.ehr-panel, .question-section, .expert-dashboard') as HTMLElement;

                if (activePanelRef.current !== panel) {
                    if (activePanelRef.current) {
                        activePanelRef.current.style.transform = '';
                        activePanelRef.current.style.zIndex = '';
                        activePanelRef.current.style.boxShadow = '';
                        activePanelRef.current.style.transition = '';
                        activePanelRef.current.style.position = '';
                    }

                    if (panel) {
                        panel.style.transition = 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'; // Faster transition for scroll response
                        panel.style.transform = `scale(${zoomStrengthRef.current})`;
                        panel.style.zIndex = '10000';
                        panel.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
                        panel.style.position = 'relative';
                    }
                    activePanelRef.current = panel;
                }
            } else {
                if (activePanelRef.current) {
                    activePanelRef.current.style.transform = '';
                    activePanelRef.current.style.zIndex = '';
                    activePanelRef.current.style.boxShadow = '';
                    activePanelRef.current.style.transition = '';
                    activePanelRef.current.style.position = '';
                    activePanelRef.current = null;
                }
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (!hoverZoomEnabled || !activePanelRef.current) return;

            // Prevent page scrolling when zooming a panel
            e.preventDefault();

            // Calculate new zoom
            const delta = -Math.sign(e.deltaY) * 0.1; // 10% steps
            const prev = zoomStrengthRef.current;
            const next = Math.min(Math.max(prev + delta, 1.1), 3.0); // Limit 1.1x to 3.0x

            zoomStrengthRef.current = next;
            activePanelRef.current.style.transform = `scale(${next})`;

            // Update UI (throttled naturally by React batching or can be debounced)
            setHoverZoomStrengthDisplay(next);
        };

        const style = document.createElement('style');
        style.id = 'magnifier-style';
        style.innerHTML = `
            body, .ehr-panel, .question-section, .expert-dashboard {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: false }); // Non-passive to allow preventDefault

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('wheel', handleWheel);
            overlay.remove();
            const s = document.getElementById('magnifier-style');
            if (s) s.remove();
            document.body.style.cursor = '';

            if (activePanelRef.current) {
                activePanelRef.current.style.transform = '';
                activePanelRef.current.style.zIndex = '';
                activePanelRef.current.style.boxShadow = '';
                activePanelRef.current.style.transition = '';
                activePanelRef.current.style.position = '';
                activePanelRef.current = null;
            }
        };
    }, [isMagnifierActive, hoverZoomEnabled]); // No dependency on strength value to prevent reset

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
                    Global Text Size
                </div>
            </div>

            {/* Global Zoom Controls */}
            <div style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 16
            }}>
                <button onClick={() => adjustZoom(-10)} style={{ width: 48, height: 48, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #334155, #1e293b)', color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A-</button>
                <button onClick={() => adjustZoom(10)} style={{ width: 48, height: 48, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #334155, #1e293b)', color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A+</button>
                <button onClick={() => setZoomLevel(100)} style={{ padding: '0 20px', height: 48, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>Reset</button>
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

                {/* Hover Zoom Controls */}
                {isMagnifierActive && (
                    <div style={{ marginTop: 12 }}>
                        {/* Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <div style={{
                                    width: 36, height: 20,
                                    background: hoverZoomEnabled ? '#10b981' : '#475569',
                                    borderRadius: 10, position: 'relative',
                                    transition: '0.2s',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{
                                        width: 16, height: 16, background: 'white', borderRadius: '50%',
                                        position: 'absolute', top: 2,
                                        left: hoverZoomEnabled ? 18 : 2,
                                        transition: '0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={hoverZoomEnabled}
                                    onChange={(e) => setHoverZoomEnabled(e.target.checked)}
                                    style={{ display: 'none' }}
                                />
                                <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 500 }}>
                                    Enable Hover Zoom
                                </span>
                            </label>
                        </div>

                        {/* Zoom Strength Display (Scroll Info) */}
                        {hoverZoomEnabled && (
                            <div style={{ marginTop: 12, textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    {Math.round((hoverZoomStrengthDisplay - 1) * 100)}%
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                                    Magnification Power
                                </div>
                                <div style={{
                                    marginTop: 8,
                                    fontSize: '0.65rem',
                                    color: '#60a5fa',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    padding: '4px 8px',
                                    display: 'inline-block',
                                    borderRadius: 4
                                }}>
                                    🖱️ Scroll mouse wheel to zoom in/out
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
                    ? (hoverZoomEnabled ? '✨ Hover panels to pop-out • Scroll to zoom' : '💡 Enable "Hover Zoom" for advanced magnification')
                    : '📝 Standard Zoom applies to EHR and Question panels'}
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
