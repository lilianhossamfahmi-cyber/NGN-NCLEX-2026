import React, { useEffect, useState } from 'react';
import '../../index.css';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, title, children }) => {
    const [render, setRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setRender(true);
        else setTimeout(() => setRender(false), 300); // Wait for transition
    }, [isOpen]);

    if (!render) return null;

    return (
        <>
            <div
                className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
                style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.3s' }}
                onClick={onClose}
            />
            <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
                <div
                    className="drawer-handle"
                    onClick={onClose} // Clicking handle also closes or could use for drag later
                />
                <div className="drawer-header">
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', padding: '8px' }}
                    >
                        ✕
                    </button>
                </div>
                <div className="drawer-content">
                    {children}
                </div>
            </div>
        </>
    );
};
