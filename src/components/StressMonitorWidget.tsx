import React, { useState, useEffect } from 'react';
import { StressDetectionEngine, InteractionData, StressResult } from '../utils/stressEngine';

interface StressMonitorProps {
    data: InteractionData;
}

export const StressMonitorWidget: React.FC<StressMonitorProps> = ({ data }) => {
    const [stress, setStress] = useState<StressResult | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

    useEffect(() => {
        const result = StressDetectionEngine.calculateStressLevel(data);
        setStress(result);
    }, [data]);

    useEffect(() => {
        if (showBreathing) {
            const cycle = async () => {
                setBreathPhase('Inhale');
                await new Promise(r => setTimeout(r, 4000));
                setBreathPhase('Hold');
                await new Promise(r => setTimeout(r, 4000));
                setBreathPhase('Exhale');
                await new Promise(r => setTimeout(r, 4000));
                cycle();
            };
            cycle();
        }
    }, [showBreathing]);

    if (!stress) return null;

    // 5-Level Logic
    const getLevelInfo = (score: number) => {
        if (score >= 80) return { label: '⚠️ Panic', color: '#ef4444', speed: '0.4s' }; // Red
        if (score >= 60) return { label: '🟠 High Anxiety', color: '#f97316', speed: '0.6s' }; // Orange
        if (score >= 40) return { label: '🟡 Unsure', color: '#facc15', speed: '1.0s' }; // Yellow
        if (score >= 20) return { label: '🔵 Focused', color: '#3b82f6', speed: '1.5s' }; // Blue (Teal/Green replacement for focus)
        return { label: '✅ Calm', color: '#10b981', speed: '2.0s' }; // Green
    };

    const info = getLevelInfo(stress.score);
    const lineColor = info.color;
    const pulseSpeed = info.speed;

    return (
        <div style={{ position: 'relative', marginBottom: 16, zIndex: 30 }}>
            {/* CSS ANIMATIONS */}
            <style>{`
                @keyframes ecgMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @keyframes inhale { from { transform: scale(1); } to { transform: scale(1.5); } }
                @keyframes hold { from { transform: scale(1.5); } to { transform: scale(1.5); } }
                @keyframes exhale { from { transform: scale(1.5); } to { transform: scale(1); } }
                @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
            `}</style>

            {/* MAIN WIDGET CARD */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: '#0f172a', // Slate 900
                    borderRadius: 12,
                    padding: '12px 16px',
                    color: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                    cursor: 'pointer', // UPDATED TO POINTER
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: `1px solid ${lineColor}`,
                    position: 'relative',
                    overflow: 'hidden', // Contain the overlay
                    height: 64
                }}
            >
                {/* OVERLAY TOOLTIP (The Fix) */}
                {isHovered && !showBreathing && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(15, 23, 42, 0.98)',
                        zIndex: 50,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        padding: '0 16px',
                        animation: 'fadeInOverlay 0.2s ease-out',
                        pointerEvents: 'none' // Click passes through to parent
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: '1rem' }}>🩺</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Clinical Note</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#e2e8f0', lineHeight: 1.3 }}>
                            "{stress.copingStrategy}"
                        </div>
                    </div>
                )}

                {/* Normal Content */}
                <div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                        Bio-Feedback
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: info.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {info.label}
                    </div>
                </div>

                {/* ECG VISUALIZER */}
                <div style={{ width: 80, height: 32, background: '#020617', borderRadius: 6, position: 'relative', overflow: 'hidden', border: '1px solid #1e293b' }}>
                    <svg viewBox="0 0 200 60" style={{ position: 'absolute', top: 5, left: 0, width: '200%', height: '80%', fill: 'none', stroke: lineColor, strokeWidth: 2, animation: `ecgMove ${pulseSpeed} linear infinite` }}>
                        <polyline points="0,30 20,30 25,10 30,50 35,30 200,30 220,30 225,10 230,50 235,30 400,30" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0) 80%, rgba(2,6,23,1) 100%)' }}></div>
                </div>

                {/* Reset Button (Only visible if high stress and not hovered to avoid conflict) */}
                {stress.score >= 60 && !isHovered && !showBreathing && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowBreathing(true); }}
                        style={{
                            position: 'absolute', right: 16,
                            background: '#ef4444', color: 'white', border: 'none', borderRadius: 6,
                            padding: '4px 8px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                            animation: 'pulse 2s infinite', boxShadow: '0 2px 4px rgba(239,68,68,0.4)'
                        }}
                    >
                        RESET
                    </button>
                )}
            </div>

            {/* BREATHING EXERCISE OVERLAY (Global) */}
            {showBreathing && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.98)',
                    zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginBottom: 40 }}>
                        {breathPhase}
                    </div>
                    <div style={{
                        width: 200, height: 200, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0) 70%)',
                        border: '4px solid #38bdf8', boxShadow: '0 0 40px rgba(56,189,248,0.3)',
                        animation: breathPhase === 'Inhale' ? 'inhale 4s ease-in-out forwards' :
                            breathPhase === 'Hold' ? 'hold 4s linear forwards' :
                                'exhale 4s ease-in-out forwards'
                    }}></div>
                    <div style={{ marginTop: 40, color: '#94a3b8', fontSize: '0.9rem' }}>Follow the rhythm to reset your amygdala.</div>
                    <button
                        onClick={() => setShowBreathing(false)}
                        style={{
                            marginTop: 32, padding: '12px 32px', background: 'transparent',
                            border: '1px solid #475569', color: 'white', borderRadius: 999,
                            cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        I feel calm now
                    </button>
                </div>
            )}
        </div>
    );
};
