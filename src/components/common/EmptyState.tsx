import React from 'react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon = <span style={{ fontSize: '48px' }}>📝</span>,
    actionLabel,
    onAction
}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '2px dashed var(--border-color)',
            color: 'var(--text-secondary)'
        }}>
            <div style={{
                marginBottom: '1.5rem',
                opacity: 0.8,
                animation: 'bounceIn 1s'
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
            }}>
                {title}
            </h3>
            <p style={{
                maxWidth: '400px',
                marginBottom: '2rem',
                lineHeight: 1.5
            }}>
                {message}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn btn-primary btn-animate"
                    style={{
                        padding: '12px 24px',
                        fontSize: '1rem'
                    }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
