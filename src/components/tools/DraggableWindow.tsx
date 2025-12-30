import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './ToolSuite.css';

interface DraggableWindowProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    zIndex: number;
    onFocus: () => void;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    headerColor?: string; // Custom header color
    resizable?: boolean;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    title,
    isOpen,
    onClose,
    zIndex,
    onFocus,
    width = 300,
    minWidth = 200,
    maxWidth = 600,
    children,
    defaultPosition = { x: 100, y: 100 },
    headerColor,
    resizable = true
}) => {
    const [currentWidth, setCurrentWidth] = useState(width);
    const [isResizing, setIsResizing] = useState(false);
    const nodeRef = React.useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startWidth = currentWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
            setCurrentWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Default gradient header based on tool type
    const getHeaderStyle = () => {
        if (headerColor) {
            return { background: headerColor };
        }
        // Premium dark gradient default
        return {
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
        };
    };

    return (
        <Draggable
            handle=".window-header"
            defaultPosition={defaultPosition}
            onMouseDown={onFocus}
            nodeRef={nodeRef}
            bounds="body"
            disabled={isResizing}
        >
            <div
                ref={nodeRef}
                className="glass-panel drag-window-container"
                style={{
                    width: `${currentWidth}px`,
                    zIndex: zIndex,
                    position: 'fixed'
                }}
            >
                {/* Premium Header */}
                <div
                    className="window-header"
                    style={{
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none',
                        cursor: 'move',
                        ...getHeaderStyle()
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                            boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)'
                        }} />
                        <span style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#e2e8f0',
                            letterSpacing: '0.02em'
                        }}>
                            {title}
                        </span>
                    </div>
                    <div className="window-controls" style={{ display: 'flex', gap: 4 }}>
                        <button
                            className="close-btn"
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                e.currentTarget.style.color = '#f87171';
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ position: 'relative' }}>
                    {children}
                </div>

                {/* Resize Handle */}
                {resizable && (
                    <div
                        onMouseDown={handleResizeStart}
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: 16,
                            height: 16,
                            cursor: 'se-resize',
                            background: 'linear-gradient(135deg, transparent 50%, rgba(99, 102, 241, 0.5) 50%)',
                            borderBottomRightRadius: 12
                        }}
                    />
                )}
            </div>
        </Draggable>
    );
};
