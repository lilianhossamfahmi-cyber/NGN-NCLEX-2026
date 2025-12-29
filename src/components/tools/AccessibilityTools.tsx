import React, { useState, useEffect } from 'react';
import './ToolSuite.css';

export const AccessibilityTools: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(100);

    // --- ZOOM LOGIC ---
    useEffect(() => {
        const content = document.querySelector('.split-layout-container') as HTMLElement || document.body;
        if (content) {
            content.style.fontSize = `${zoomLevel}%`;
        }
    }, [zoomLevel]);

    const adjustZoom = (delta: number) => {
        setZoomLevel(prev => {
            const next = prev + delta;
            return Math.min(Math.max(next, 75), 150); // Clamp 75% - 150%
        });
    };

    return (
        <div className="access-panel">
            {/* Zoom Control */}
            <div className="access-row">
                <span style={{ fontWeight: 500 }}>Text Size</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="font-btn" onClick={() => adjustZoom(-10)}>A-</button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{zoomLevel}%</span>
                    <button className="font-btn" onClick={() => adjustZoom(10)}>A+</button>
                    <button className="font-btn" onClick={() => setZoomLevel(100)} style={{ width: 'auto', padding: '0 8px' }}>Reset</button>
                </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                Adjusts content font size for better readability.
            </div>
        </div>
    );
};
