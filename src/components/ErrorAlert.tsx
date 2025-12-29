import React, { useEffect, useState } from 'react';

/**
 * Reusable Error Alert Component
 * Displays a dismissible error message with auto-hide capability.
 */

interface ErrorAlertProps {
    message: string;
    onDismiss: () => void;
    autoDismiss?: boolean;
    duration?: number;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, autoDismiss = false, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoDismiss) {
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onDismiss, 300); // Wait for fade out
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoDismiss, duration, onDismiss]);

    if (!visible) return null;

    return (
        <div
            role="alert"
            style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'opacity 0.3s ease-in-out',
                opacity: visible ? 1 : 0
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>❌</span>
                <span style={{ fontWeight: 500 }}>{message}</span>
            </div>
            <button
                onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#991b1b',
                    padding: 0
                }}
                aria-label="Dismiss error"
            >
                ×
            </button>
        </div>
    );
};
