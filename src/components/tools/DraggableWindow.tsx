import React from 'react';
import Draggable from 'react-draggable';
import './ToolSuite.css';

interface DraggableWindowProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    zIndex: number;
    onFocus: () => void;
    width?: number;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    title,
    isOpen,
    onClose,
    zIndex,
    onFocus,
    width = 300,
    children,
    defaultPosition = { x: 100, y: 100 }
}) => {
    if (!isOpen) return null;

    const nodeRef = React.useRef(null);

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={defaultPosition}
            onMouseDown={onFocus}
            nodeRef={nodeRef}
            bounds="body" // Keep inside window
        >
            <div
                ref={nodeRef}
                className="glass-panel drag-window-container"
                style={{
                    width: `${width}px`,
                    zIndex: zIndex,
                    position: 'fixed' // Crucial for draggable to work right with fixed positioning
                }}
            >
                {/* Header */}
                <div
                    className="glass-header window-header"
                    style={{
                        padding: '10px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none'
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{title}</span>
                    <div className="window-controls">
                        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ position: 'relative' }}>
                    {children}
                </div>
            </div>
        </Draggable>
    );
};
