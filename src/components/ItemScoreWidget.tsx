import React, { useEffect, useState } from 'react';

interface ItemScoreWidgetProps {
    score: number;
    maxScore: number;
    correctCount: number;
    incorrectCount: number;
    isVisible: boolean;
}

// Solid Icons for "Visual Math"
const CheckIcon = () => (
    <svg style={{ width: 20, height: 20, color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg style={{ width: 20, height: 20, color: '#e11d48' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ItemScoreWidget: React.FC<ItemScoreWidgetProps> = ({
    score,
    maxScore,
    correctCount,
    incorrectCount,
    isVisible
}) => {
    const [displayScore, setDisplayScore] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    const getScoringRule = () => {
        if (incorrectCount > 0 && correctCount > 0) return '+/- Scoring Applied';
        if (maxScore === 1) return '0/1 Scoring Rule';
        return 'Standard NGN Scoring';
    };

    const getRuleExplanation = (rule: string) => {
        if (rule === '+/- Scoring Applied') return "Plus/Minus Rule: +1 for correct, -1 for incorrect. Minimum score is 0.";
        if (rule === '0/1 Scoring Rule') return "All-or-Nothing Rule: Credit is awarded ONLY if the entire question is correct.";
        return "Standard Rule: +1 point for each correct response. No penalties.";
    };

    useEffect(() => {
        if (isVisible) {
            let current = 0;
            const step = Math.ceil(score / 20) || 1;
            const timer = setInterval(() => {
                current += step;
                if (current >= score) {
                    setDisplayScore(score);
                    clearInterval(timer);
                } else {
                    setDisplayScore(current);
                }
            }, 30);
            return () => clearInterval(timer);
        } else {
            setDisplayScore(0);
        }
    }, [score, isVisible]);

    if (!isVisible) return null;

    const bubbleArray = [
        ...Array(correctCount).fill(true),
        ...Array(incorrectCount).fill(false)
    ];

    const currentRule = getScoringRule();

    return (
        <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{
                background: '#4f46e5', // Indigo-600
                borderRadius: 16,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: 20,
                color: 'white',
                position: 'relative',
                overflow: 'hidden', // Contain overlay
                marginBottom: 24,
                transition: 'all 0.5s ease',
                cursor: 'pointer', // UPDATED TO POINTER
                animation: 'fadeIn 0.5s ease-out'
            }}
        >
            {/* Overlay Tooltip */}
            {showTooltip && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(30, 41, 59, 0.98)',
                    color: 'white',
                    padding: 16,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    zIndex: 20,
                    animation: 'fadeIn 0.2s',
                    pointerEvents: 'none' // Ensures click passes through to parent wrapper
                }}>
                    <strong style={{ display: 'block', marginBottom: 4, color: '#a5b4fc', fontSize: '0.85rem' }}>{currentRule}</strong>
                    <p style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{getRuleExplanation(currentRule)}</p>
                </div>
            )}

            {/* Background Decoration */}
            <div style={{ position: 'absolute', top: 0, right: 0, padding: 16, opacity: 0.1, pointerEvents: 'none', overflow: 'hidden', inset: 0 }}>
                <svg width="96" height="96" fill="currentColor" viewBox="0 0 24 24" style={{ position: 'absolute', top: 16, right: 16 }}><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>

                {/* Big Score */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
                            +{displayScore}
                        </span>
                        <span style={{ color: '#c7d2fe', fontSize: '1.125rem', fontWeight: 500 }}>
                            / {maxScore}
                        </span>
                    </div>
                </div>

                {/* Visual Math Bubbles */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6, maxWidth: 120 }}>
                        {bubbleArray.length > 0 ? bubbleArray.map((isCorrect, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: 32, height: 32, borderRadius: 999, background: 'white',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transform: 'scale(1)', transition: 'transform 0.2s'
                                }}
                            >
                                {isCorrect ? <CheckIcon /> : <XIcon />}
                            </div>
                        )) : (
                            <span style={{ fontSize: '0.75rem', color: '#c7d2fe', fontStyle: 'italic' }}>No Impact</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Rule Text */}
            <div style={{
                marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(99, 102, 241, 0.5)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem'
            }}>
                <span style={{ color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Result
                </span>
                <span style={{ background: 'rgba(55, 48, 163, 0.4)', padding: '4px 8px', borderRadius: 4, color: '#e0e7ff', fontWeight: 500 }}>
                    {currentRule}
                </span>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
