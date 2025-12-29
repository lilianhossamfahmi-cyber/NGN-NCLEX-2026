import React from 'react';

interface RationaleFabProps {
    onClick: () => void;
    isVisible: boolean;
    style?: React.CSSProperties; // Allow custom styles
}

export const RationaleFab: React.FC<RationaleFabProps> = ({ onClick, isVisible, style }) => {
    if (!isVisible) return null;

    const BulbIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-7 7c0 2 2 3 2 6h10c0-3 2-4 2-6a7 7 0 0 0-7-7z" />
        </svg>
    );

    return (
        <button
            onClick={onClick}
            style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7', // amber-100
                color: '#d97706', // amber-600
                borderRadius: '50%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
                border: '1px solid #fde68a', // amber-200
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                // No longer valid 'fixed' by default to allow flex placement
                ...style
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="View Rationale"
            title="View Rationale"
        >
            <BulbIcon />
        </button>
    );
};
