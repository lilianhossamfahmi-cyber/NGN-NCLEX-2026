import React from 'react';

interface FloatingPatientHeaderProps {
    patientName?: string;
    age?: number;
    gender?: string;
    codeStatus?: string;
    style?: React.CSSProperties; // Allow position overrides
}

export const FloatingPatientHeader: React.FC<FloatingPatientHeaderProps> = ({
    patientName = "Generic, Client",
    age = 72,
    gender = "F",
    codeStatus = "FULL CODE",
    style = {}
}) => {
    return (
        <div style={{
            borderRadius: '9999px',
            backgroundColor: '#0f172a', // Slate-900 (Solid, no transparency for embedding)
            color: 'white',
            padding: '8px 24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'inline-flex', // Fits content
            alignItems: 'center',
            gap: '16px',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: '1px solid #1e293b',
            ...style // Allow parent to override layout (e.g., margins)
        }}>
            {/* Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6', // blue-500
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span style={{ whiteSpace: 'nowrap' }}>
                    {patientName}, <span style={{ color: '#94a3b8' }}>{age}y {gender}</span>
                </span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '16px', backgroundColor: '#334155' }}></div>

            {/* Code Status Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444', // red-500
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                }}></span>
                <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#fca5a5' // red-300
                }}>
                    {codeStatus}
                </span>
            </div>
        </div>
    );
};
