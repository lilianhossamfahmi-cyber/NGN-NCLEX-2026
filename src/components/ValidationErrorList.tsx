import React from 'react';

/**
 * Validation Error List Component
 * Displays a list of validation warnings/errors.
 */

interface ValidationErrorListProps {
    errors: string[];
}

export const ValidationErrorList: React.FC<ValidationErrorListProps> = ({ errors }) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div
            style={{
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#92400e'
            }}
            role="alert"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span>⚠️</span>
                <span>Please fix the following:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {errors.map((err, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{err}</li>
                ))}
            </ul>
        </div>
    );
};
