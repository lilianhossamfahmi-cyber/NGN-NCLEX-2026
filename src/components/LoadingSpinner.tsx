import React from 'react';

/**
 * Loading Spinner Component
 * Displays generate progress and status messages.
 */

interface LoadingSpinnerProps {
    progress?: number; // 0-100
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ progress = 0, message = "Generating questions..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white'
        }}>
            {/* Spinner CSS managed via inline style for simplicity here, 
                usually would be in CSS file or styled-component */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div style={{
                width: '60px',
                height: '60px',
                border: '6px solid rgba(59, 130, 246, 0.2)',
                borderTop: '6px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.5rem'
            }}></div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {message} {progress > 0 && `${progress}%`}
            </h2>

            {progress > 0 && (
                <div style={{ width: '300px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '1rem' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#3b82f6',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease-out'
                    }}></div>
                </div>
            )}
        </div>
    );
};
