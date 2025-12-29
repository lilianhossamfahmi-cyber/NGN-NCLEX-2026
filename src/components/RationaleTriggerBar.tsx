import React from 'react';

interface RationaleTriggerBarProps {
    isSubmitted: boolean;
    onClick: () => void;
}

export const RationaleTriggerBar: React.FC<RationaleTriggerBarProps> = ({ isSubmitted, onClick }) => {
    return (
        <div
            onClick={isSubmitted ? onClick : undefined}
            title={!isSubmitted ? "Submit answer to view rationale" : "View Rationale"}
            style={{
                width: '100%',
                marginTop: '32px',
                padding: '2px', // Gradient border effect
                background: isSubmitted
                    ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                    : '#f1f5f9',
                borderRadius: '12px',
                cursor: isSubmitted ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSubmitted ? 'scale(1)' : 'scale(1)',
                boxShadow: isSubmitted
                    ? '0 4px 6px -1px rgba(59, 130, 246, 0.25), 0 2px 4px -1px rgba(59, 130, 246, 0.15)'
                    : 'none',
                userSelect: 'none'
            }}
            onMouseEnter={e => {
                if (isSubmitted) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
                }
            }}
            onMouseLeave={e => {
                if (isSubmitted) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.25)';
                }
            }}
        >
            <div style={{
                background: isSubmitted ? 'white' : '#f8fafc',
                borderRadius: '10px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Icon Badge */}
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '10px',
                        background: isSubmitted ? '#eff6ff' : '#e2e8f0',
                        color: isSubmitted ? '#2563eb' : '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        🧠
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: isSubmitted ? '#1e293b' : '#94a3b8',
                            letterSpacing: '-0.01em'
                        }}>
                            Clinical Reasoning Key
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: isSubmitted ? '#3b82f6' : '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {isSubmitted ? 'Tap to Reveal Analysis' : 'Locked until submission'}
                        </span>
                    </div>
                </div>

                <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: isSubmitted ? '#eff6ff' : 'transparent',
                    color: isSubmitted ? '#2563eb' : '#cbd5e1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700,
                    transform: 'rotate(-90deg)',
                    border: isSubmitted ? 'none' : '2px solid #e2e8f0'
                }}>
                    ➜
                </div>
            </div>
        </div>
    );
};
