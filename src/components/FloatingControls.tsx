import React, { useState } from 'react';

interface FloatingControlsProps {
    onPrev?: () => void;
    onNext?: () => void;
    onSubmit?: () => void;
    canPrev?: boolean;
    canNext?: boolean;
    canSubmit?: boolean;
    isSubmitted?: boolean;
    isLast?: boolean;
    style?: React.CSSProperties; // Allow custom styling/positioning
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
    onPrev,
    onNext,
    onSubmit,
    canPrev = false,
    canNext = false,
    canSubmit = false,
    isSubmitted = false,
    isLast = false,
    style = {}
}) => {
    const [isSpinning, setIsSpinning] = useState(false);

    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleSubmitClick = () => {
        if (!canSubmit) return;
        setIsSpinning(true);
        // Micro-interaction: Spin for 600ms, then trigger submit
        timerRef.current = setTimeout(() => {
            setIsSpinning(false);
            if (onSubmit) onSubmit();
        }, 600);
    };

    // Icons
    const ChevronLeft = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );

    const ChevronRight = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );

    const Check = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );

    const Spinner = () => (
        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div style={{
            height: '64px',
            backgroundColor: 'rgba(203, 213, 225, 0.75)', // Glassmorphic Grey (Slate-300 @ 75% for visibility)
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            gap: '16px',
            fontFamily: '"Inter", sans-serif',
            ...style
        }}>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>

            {/* Prev Button: Square Ghost */}
            <button
                onClick={onPrev}
                disabled={!canPrev}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: '1px solid transparent',
                    background: canPrev ? '#f8fafc' : 'transparent',
                    color: canPrev ? '#64748b' : '#cbd5e1',
                    cursor: canPrev ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: canPrev ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
                onMouseOver={(e) => canPrev && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseOut={(e) => canPrev && (e.currentTarget.style.backgroundColor = '#f8fafc')}
            >
                <ChevronLeft />
            </button>

            {/* Submit Button: Solid Green Pill */}
            {!isSubmitted ? (
                <button
                    onClick={handleSubmitClick}
                    disabled={!canSubmit || isSpinning}
                    style={{
                        backgroundColor: canSubmit ? '#10b981' : '#f1f5f9',
                        color: canSubmit ? 'white' : '#cbd5e1',
                        padding: '0 32px',
                        height: '44px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        border: 'none',
                        boxShadow: canSubmit ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : 'none',
                        cursor: (canSubmit && !isSpinning) ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        letterSpacing: '0.025em',
                        gap: '8px',
                        minWidth: '200px' // Prevent width jump when text changes
                    }}
                    onMouseOver={(e) => (canSubmit && !isSpinning) && (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
                >
                    {isSpinning ? (
                        <>
                            <Spinner />
                            <span>PROCESSING...</span>
                        </>
                    ) : (
                        "SUBMIT ANSWER"
                    )}
                </button>
            ) : (
                <div style={{
                    padding: '0 24px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#475569', // Slate 600 (Grey text)
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: 'rgba(241, 245, 249, 0.6)', // Slate 100 with opacity (Glassy)
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(226, 232, 240, 0.8)', // Slate 200 (Grey border)
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)' // Subtle inner gloss
                }}>
                    <span style={{ color: '#10b981' }}><Check /></span>
                    <span>Answer Saved</span>
                </div>
            )}

            {/* Next Button: Solid Blue Square */}
            <button
                onClick={onNext}
                disabled={!canNext}
                style={{
                    backgroundColor: canNext ? (isLast ? '#15803d' : '#2563eb') : '#f1f5f9',
                    color: canNext ? 'white' : '#cbd5e1',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    boxShadow: canNext ? '0 4px 6px -1px rgba(37, 99, 235, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => canNext && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
            >
                <ChevronRight />
            </button>
        </div>
    );
};
