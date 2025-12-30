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
            // Check if clicking inside EHR or Question panels
            const target = e.target as HTMLElement;
            if (target.closest('.ehr-panel') || target.closest('.question-section')) {
                // Prevent default interaction if we are just toggling zoom
                // But maybe we want to allow selecting text? 
                // "Act as magnifier" usually implies tool mode.
                // e.preventDefault(); // Optional, might block buttons

                // Toggle Zoom: If > 100, reset to 100. If 100, go to 125.
                setZoomLevel(prev => prev > 100 ? 100 : 125);
            }
        };

        // Set cursor for feedback
        panels.forEach(p => (p as HTMLElement).style.cursor = 'zoom-in');

        document.addEventListener('click', handleMagnifyClick, true); // Capture phase to detect click
        return () => {
            document.removeEventListener('click', handleMagnifyClick, true);
            panels.forEach(p => (p as HTMLElement).style.cursor = '');
        };
    }, [isMagnifierActive]);


    const adjustZoom = (delta: number) => {
        setZoomLevel(prev => Math.min(Math.max(prev + delta, 75), 150));
    };

    return (
        <div className="access-panel">
            <div className="access-row">
                <span style={{ fontWeight: 500 }}>Text Size</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="font-btn" onClick={() => adjustZoom(-10)}>A-</button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{zoomLevel}%</span>
                    <button className="font-btn" onClick={() => adjustZoom(10)}>A+</button>
                    <button className="font-btn" onClick={() => setZoomLevel(100)} style={{ width: 'auto', padding: '0 8px' }}>Reset</button>
                </div>
            </div>

            <div className="access-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: isMagnifierActive ? '#dbeafe' : '#f8fafc',
                        border: isMagnifierActive ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                        borderRadius: '6px',
                        color: isMagnifierActive ? '#1e40af' : '#475569',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <span>{isMagnifierActive ? '🔍 Magnifier ON' : '🔍 Enable Magnifier'}</span>
                </button>
            </div>

            <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                {isMagnifierActive ? 'Click any area to Zoom In/Out' : 'Applies to EHR and Question panels'}
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
