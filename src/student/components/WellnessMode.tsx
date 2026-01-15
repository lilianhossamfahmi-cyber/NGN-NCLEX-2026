import React, { useState, useEffect } from 'react';
import { WellnessEngine, WELLNESS_EXERCISES } from '../learning/WellnessEngine';
import { WellnessExercise } from '../../types/phase-6-5-schema';
import { Button } from '../../components/ui/button';
import { X, Play, Wind, Activity, Brain, Clock, Mountain, Eye, Hand, Ear, Flower, Coffee, Heart, Star, Sun, PhoneOff, Footprints, TreeDeciduous } from 'lucide-react';

// --- ANIMATION STYLES (Inline for portability) ---
const styles = `
    @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.4); opacity: 0.2; }
    }
    .animate-breathe {
        animation: breathe 8s ease-in-out infinite;
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .animate-float {
        animation: float 6s ease-in-out infinite;
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 0.5; }
        100% { transform: scale(1.3); opacity: 0; }
    }
    @keyframes boxMove {
        0% { top: -12px; left: -12px; opacity: 1; }
        25% { top: -12px; left: calc(100% - 12px); opacity: 1; }
        50% { top: calc(100% - 12px); left: calc(100% - 12px); opacity: 1; }
        75% { top: calc(100% - 12px); left: -12px; opacity: 1; }
        100% { top: -12px; left: -12px; opacity: 1; }
    }
    @keyframes pulseText {
        0%, 22% { opacity: 1; content: 'INHALE'; }
        25%, 47% { opacity: 0.7; content: 'HOLD'; }
        50%, 72% { opacity: 1; content: 'EXHALE'; }
        75%, 97% { opacity: 0.7; content: 'HOLD'; }
    }
    @keyframes scanDown {
        0% { top: 0%; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
`;

export const WellnessMode: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [activeExercise, setActiveExercise] = useState<WellnessExercise | null>(null);
    const [, setRecommendation] = useState<{ exercise: WellnessExercise | null, reason: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [mood, setMood] = useState<'STRESSED' | 'TIRED' | 'ANXIOUS' | 'FOCUSED'>('STRESSED');
    const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');

    // --- INITIAL LOAD ---
    useEffect(() => {
        // Run recommendation engine based on current mood context
        const rec = WellnessEngine.getRecommendation(8, 130, 45);
        setRecommendation(rec);
    }, [mood]);

    // --- BREATHING ORB LOGIC ---
    useEffect(() => {
        const interval = setInterval(() => {
            setBreathPhase(prev => {
                if (prev === 'INHALE') return 'HOLD';
                if (prev === 'HOLD') return 'EXHALE';
                return 'INHALE';
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // --- TIMER LOGIC ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartExercise = (ex: WellnessExercise) => {
        setActiveExercise(ex);
        setTimeLeft(ex.durationSeconds);
        setTimerActive(false);
    };

    // --- FILTERED EXERCISES ---
    const getSuggestedExercises = () => {
        // Match schemas: difficultyLevel 1-5, category
        if (mood === 'STRESSED') return WELLNESS_EXERCISES.filter(e => e.category === 'breathing' || e.difficultyLevel <= 2);
        if (mood === 'TIRED') return WELLNESS_EXERCISES.filter(e => e.category === 'movement');
        if (mood === 'ANXIOUS') return WELLNESS_EXERCISES.filter(e => e.category === 'grounding' || e.category === 'meditation');
        if (mood === 'FOCUSED') return WELLNESS_EXERCISES.filter(e => e.category === 'cognitive' || e.category === 'mindfulness');
        return WELLNESS_EXERCISES;
    };
    const suggestedExercises = getSuggestedExercises();

    // Helper for category theming
    const getCategoryTheme = (cat: string) => {
        switch (cat) {
            case 'breathing': return {
                mainColor: 'text-teal-400',
                bg: 'bg-teal-500/10',
                border: 'border-teal-500/20',
                gradient: 'from-teal-500/20 to-blue-500/5',
                icon: Wind,
                hoverBorder: 'hover:border-teal-500/50',
                faintText: 'text-teal-500/5 group-hover:text-teal-500/10'
            };
            case 'movement': return {
                mainColor: 'text-orange-400',
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/20',
                gradient: 'from-orange-500/20 to-red-500/5',
                icon: Activity,
                hoverBorder: 'hover:border-orange-500/50',
                faintText: 'text-orange-500/5 group-hover:text-orange-500/10'
            };
            case 'meditation': return {
                mainColor: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                gradient: 'from-purple-500/20 to-indigo-500/5',
                icon: Brain,
                hoverBorder: 'hover:border-purple-500/50',
                faintText: 'text-purple-500/5 group-hover:text-purple-500/10'
            };
            case 'grounding': return {
                mainColor: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                gradient: 'from-emerald-500/20 to-teal-500/5',
                icon: Mountain,
                hoverBorder: 'hover:border-emerald-500/50',
                faintText: 'text-emerald-500/5 group-hover:text-emerald-500/10'
            };
            default: return {
                mainColor: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                gradient: 'from-blue-500/20 to-cyan-500/5',
                icon: Activity,
                hoverBorder: 'hover:border-blue-500/50',
                faintText: 'text-blue-500/5 group-hover:text-blue-500/10'
            };
        }
    };


    // --- ANIMATION VISUALIZERS ---

    // 1. BOX BREATHING VISUALIZER (4-4-4-4)
    const renderBoxBreathing = () => {
        // Cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s) = 16s total
        return (
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                {/* The Box Path */}
                <div className="absolute inset-0 border-4 border-slate-700/50 rounded-3xl" />

                {/* The Moving Dot */}
                <div className="absolute inset-0">
                    <div className="w-6 h-6 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.8)] animate-[boxMove_16s_linear_infinite]" />
                </div>

                {/* Central Instruction Text */}
                <div className="text-center z-10">
                    <div className="text-5xl md:text-7xl font-black text-white mb-2 animate-[pulseText_16s_linear_infinite]">
                        INHALE
                    </div>
                </div>
            </div>
        );
    };

    // 2. SUCCESS VISUALIZATION (Ethereal / Dreamy)
    const renderVisualization = () => {
        return (
            <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/0 via-purple-500/10 to-blue-500/0 animate-pulse" />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10 blur-xl animate-float"
                        style={{
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            left: `${Math.random() * 80 + 10}%`,
                            top: `${Math.random() * 80 + 10}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    />
                ))}

                <div className="relative z-10 text-center max-w-lg">
                    <Brain size={80} className="mx-auto text-purple-300 mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-4">Mental Rehearsal</h3>
                    <p className="text-purple-200 text-xl leading-relaxed font-light">
                        "I am prepared. <br />I am calm. <br />I am capable."
                    </p>
                </div>
            </div>
        );
    };

    // 3. PROGRESSIVE MUSCLE RELAXATION (Body Scan)
    const renderPMR = () => {
        return (
            <div className="relative w-64 h-96 bg-slate-800/50 rounded-full border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Scanning Bar */}
                <div className="absolute w-full h-4 bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-md animate-[scanDown_10s_ease-in-out_infinite]" />

                <div className="text-center z-10">
                    <span className="text-orange-300 font-bold block mb-4 text-xs tracking-widest uppercase">Scanning Body</span>
                    <Activity size={64} className="mx-auto text-orange-400 mb-4" />
                    <div className="text-4xl font-black text-white animate-pulse tracking-tight">TENSE</div>
                    <div className="text-xs text-orange-500/80 mt-2 font-bold uppercase tracking-widest">Hold for 5s</div>
                </div>
            </div>
        );
    };

    // 4. COLD WATER RESET (Ripple Effect)
    const renderColdWater = () => (
        <div className="relative flex items-center justify-center w-80 h-80">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
            <div className="relative z-10 bg-gradient-to-br from-blue-400 to-cyan-600 w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(56,189,248,0.6)]">
                <Wind size={60} className="text-white animate-pulse" />
            </div>
        </div>
    );

    // 5. 5-4-3-2-1 GROUNDING (Sensory Countdown)
    const renderGrounding = () => {
        const steps = [
            { num: 5, text: 'Things you can SEE', icon: Eye, color: 'text-red-400', bg: 'bg-red-400/20' },
            { num: 4, text: 'Things you can FEEL', icon: Hand, color: 'text-orange-400', bg: 'bg-orange-400/20' },
            { num: 3, text: 'Things you can HEAR', icon: Ear, color: 'text-amber-400', bg: 'bg-amber-400/20' },
            { num: 2, text: 'Things you can SMELL', icon: Flower, color: 'text-green-400', bg: 'bg-green-400/20' },
            { num: 1, text: 'Thing you can TASTE', icon: Coffee, color: 'text-blue-400', bg: 'bg-blue-400/20' },
        ];

        return (
            <div className="flex flex-col gap-3 w-full max-w-sm">
                {steps.map((s, i) => (
                    <div key={s.num} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-white/5 animate-fade-in-up" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl ${s.bg} ${s.color}`}>
                            {s.num}
                        </div>
                        <div className="flex-1">
                            <div className={`text-xs font-bold uppercase tracking-wider ${s.color}`}>{s.text.split(' ').slice(-1)[0]}</div>
                            <div className="text-slate-400 text-sm">{s.text}</div>
                        </div>
                        <s.icon className={`${s.color} opacity-50`} size={24} />
                    </div>
                ))}
            </div>
        );
    };

    // 6. GRATITUDE JOURNAL (Guided Sequence)
    const renderGratitude = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {[
                    { icon: Heart, fill: 'fill-rose-500', color: 'text-rose-500', title: 'Grateful For', desc: 'Write 3 things you appreciate right now.' },
                    { icon: Star, fill: 'fill-yellow-500', color: 'text-yellow-500', title: 'Accomplished', desc: 'Write 1 thing you achieved today.' },
                    { icon: Sun, fill: 'fill-orange-500', color: 'text-orange-500', title: 'Intention', desc: 'Write 1 positive focus for tomorrow.' }
                ].map((card, i) => (
                    <div key={i} className="bg-[#1e1b16] border-2 border-[#3d362b] p-6 rounded-2xl flex flex-col items-center text-center animate-fade-in-up hover:border-[#5c5243] transition-colors" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                            <card.icon size={48} className={`${card.color} ${card.fill} fill-opacity-20`} />
                        </div>
                        <h4 className={`text-xl font-bold mb-2 ${card.color} font-serif tracking-wide`}>{card.title}</h4>
                        <p className="text-[#a8a29e] text-sm leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        );
    };

    // 7. NATURE WALK (Audio Guide Visuals)
    const renderNatureWalk = () => {
        const steps = [
            { icon: PhoneOff, label: 'Disconnect' },
            { icon: Footprints, label: 'Go Outside' },
            { icon: Eye, label: 'Observe' },
            { icon: TreeDeciduous, label: 'Connect' },
            { icon: Wind, label: 'Breathe' },
        ];

        return (
            <div className="w-full max-w-3xl">
                <div className="flex justify-between items-center relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-900/50 via-emerald-500/30 to-emerald-900/50 -translate-y-1/2 rounded-full" />

                    {steps.map((s, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 300}ms` }}>
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1c2e26] border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-110 transition-all duration-300 group cursor-pointer bg-cover">
                                <s.icon className="text-emerald-400 group-hover:text-emerald-300" size={32} />
                            </div>
                            <span className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest bg-[#0A0F1C] px-2">{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <p className="text-emerald-200/60 text-lg italic">"Nature does not hurry, yet everything is accomplished."</p>
                </div>
            </div>
        );
    };

    // 8. GENERIC / DEFAULT
    const renderDefaultVisualizer = () => (
        <div className="mb-8 inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-teal-400/20 to-blue-500/20 text-teal-300 mx-auto shadow-[0_0_40px_rgba(20,184,166,0.2)] border border-teal-500/30 backdrop-blur-xl animate-float">
            <Wind size={80} />
        </div>
    );

    // --- PLAYER VIEW ---
    if (activeExercise) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#0f172a]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                <style>{styles}</style>

                {/* Main Content Card - Constrained to Viewport Height */}
                <div className="bg-[#0A0F1C] border border-slate-700/50 rounded-3xl w-full max-w-7xl max-h-[90vh] h-full shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={() => setActiveExercise(null)}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5"
                    >
                        <X size={24} />
                    </button>

                    {/* LEFT PANE: VISUALS (60%) */}
                    <div className="w-full md:w-3/5 bg-gradient-to-br from-slate-900 via-[#0f1522] to-slate-900 relative flex flex-col items-center justify-between p-6 md:p-12 border-b md:border-b-0 md:border-r border-white/5">

                        {/* 1. Header Area (Mobile Only / Context) */}
                        <div className="md:hidden text-center mb-4">
                            <h2 className="text-2xl font-bold text-white mb-1">{activeExercise.name}</h2>
                        </div>

                        {/* 2. Visualizer Area (Flexible) */}
                        <div className="flex-1 w-full flex items-center justify-center min-h-[300px] relative">
                            {/* Background Atmosphere */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px] animate-pulse" />
                            </div>

                            <div className="transform scale-90 md:scale-100 transition-transform">
                                {activeExercise.name === 'Box Breathing' && renderBoxBreathing()}
                                {activeExercise.name === 'Success Visualization' && renderVisualization()}
                                {activeExercise.name === 'Progressive Muscle Relaxation' && renderPMR()}
                                {activeExercise.name === 'Cold Water Reset' && renderColdWater()}
                                {activeExercise.name === '5-4-3-2-1 Grounding' && renderGrounding()}
                                {activeExercise.name === 'Gratitude Journal' && renderGratitude()}
                                {activeExercise.name.includes('Nature Walk') && renderNatureWalk()}
                                {!['Box Breathing', 'Success Visualization', 'Progressive Muscle Relaxation', 'Cold Water Reset', '5-4-3-2-1 Grounding', 'Gratitude Journal'].includes(activeExercise.name) && !activeExercise.name.includes('Nature Walk') && renderDefaultVisualizer()}
                            </div>
                        </div>

                        {/* 3. Timer & Controls (Bottom Fixed) */}
                        <div className="mt-8 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-xl">
                            <div className="text-center">
                                <div className="text-6xl font-mono font-bold tabular-nums text-teal-50 drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-[10px] text-teal-500/60 font-bold uppercase tracking-[0.2em] mt-2">Session Remaining</div>
                            </div>

                            <div className="flex w-full gap-4">
                                {!timerActive ? (
                                    <Button
                                        className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold h-14 rounded-xl text-lg shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                                        onClick={() => setTimerActive(true)}
                                    >
                                        <Play className="fill-current" size={20} /> Begin
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-slate-600 bg-transparent hover:bg-white/5 text-slate-200 h-14 rounded-xl text-lg"
                                        onClick={() => setTimerActive(false)}
                                    >
                                        Pause
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANE: GUIDE & STEPS (40%) */}
                    <div className="w-full md:w-2/5 bg-[#080c16] flex flex-col h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent">
                        <div className="p-8 flex-shrink-0 border-b border-white/5">
                            <h2 className="hidden md:block text-3xl font-black text-white mb-3 tracking-tight leading-tight">{activeExercise.name}</h2>
                            <p className="text-slate-400 text-sm leading-relaxed font-light border-l-2 border-teal-500/30 pl-4">
                                {activeExercise.benefits}
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 sticky top-0 bg-[#080c16] py-2 z-10">
                                Guided Sequence
                            </h3>
                            <div className="space-y-6 relative">
                                {/* Connecting Line for steps */}
                                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-800" />

                                {activeExercise.instructions.map((step, i) => {
                                    const isActive = timerActive && Math.floor((activeExercise.durationSeconds - timeLeft) / (activeExercise.durationSeconds / activeExercise.instructions.length)) === i;

                                    return (
                                        <div key={i} className={`relative pl-12 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                                            {/* Number Bubble */}
                                            <div className={`
                                                absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 z-10
                                                ${isActive ? 'bg-teal-500 border-teal-500 text-slate-900 scale-110 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'bg-[#0A0F1C] border-slate-700 text-slate-500'}
                                            `}>
                                                {i + 1}
                                            </div>

                                            {/* Step Content */}
                                            <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${isActive ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                {step}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Hint */}
                        <div className="p-4 text-center border-t border-white/5 bg-[#05080f]">
                            <p className="text-[10px] text-slate-600 font-medium">Keep your screen awake during the session</p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // --- FEATURED EXERCISES DATA ---
    const featuredExercises: WellnessExercise[] = [
        {
            id: 'grounding-1',
            name: '5-4-3-2-1 Grounding',
            category: 'grounding',
            durationSeconds: 300,
            difficultyLevel: 1,
            effectivenessRating: 5,
            benefits: 'Immediate anxiety reduction through sensory awareness.',
            instructions: ['Identify 5 things you see', 'Identify 4 things you feel', 'Identify 3 things you hear', 'Identify 2 things you smell', 'Identify 1 thing you taste'],
            whenToUse: ['During panic attacks', 'High anxiety moments']
        },
        {
            id: 'gratitude-1',
            name: 'Gratitude Journal',
            category: 'meditation',
            durationSeconds: 180,
            difficultyLevel: 1,
            effectivenessRating: 5,
            benefits: 'Shifts focus from stress to appreciation.',
            instructions: ['Reflect on 3 things you are grateful for', 'Identify 1 daily accomplishment', 'Set 1 positive intention for tomorrow'],
            whenToUse: ['Daily closing', 'Low mood']
        },
        {
            id: 'nature-1',
            name: 'Nature Walk (Audio)',
            category: 'movement',
            durationSeconds: 600,
            difficultyLevel: 1,
            effectivenessRating: 4,
            benefits: 'Reconnects bio-rhythms with natural surroundings.',
            instructions: ['Disconnect from devices', 'Step outside', 'Observe textures and colors', 'Breathe fresh air deeply'],
            whenToUse: ['Mid-day break', 'Eye strain']
        }
    ];

    // --- MAIN DASHBOARD VIEW ---
    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white p-6 md:p-8 relative overflow-hidden font-sans selection:bg-teal-500/30">
            <style>{styles}</style>

            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-teal-600/5 rounded-full blur-[100px]" />
            </div>

            {/* HEADER */}
            <header className="flex justify-between items-start mb-12 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-teal-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Brain className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Mind & Body</h1>
                        <p className="text-slate-400 font-medium">Neural Restoration Center</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6">Exit Wellness</Button>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* LEFT COL: FEATURED & SUGGESTIONS (8 cols) */}
                <div className="lg:col-span-8 space-y-12">

                    {/* NEW: FEATURED COLLECTIONS (The "Images" User Requested) */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Featured Guides</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {featuredExercises.map((ex, i) => (
                                <div
                                    key={ex.id}
                                    onClick={() => handleStartExercise(ex)}
                                    className="relative group cursor-pointer rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-64 border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] shadow-2xl"
                                >
                                    {/* Visual Backgrounds based on type */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${i === 0 ? 'from-orange-500/20 to-red-500/10' :
                                        i === 1 ? 'from-amber-200/10 to-yellow-600/20' :
                                            'from-emerald-500/20 to-green-800/20'
                                        } transition-transform duration-700 group-hover:scale-110`} />

                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors" />

                                    <div className="relative h-full p-6 flex flex-col items-center justify-center text-center z-10">
                                        <div className={`
                                            w-16 h-16 rounded-2xl mb-4 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500
                                            ${i === 0 ? 'bg-orange-500 text-white' : i === 1 ? 'bg-amber-400 text-amber-900' : 'bg-emerald-500 text-white'}
                                        `}>
                                            {i === 0 && <Hand size={32} />}
                                            {i === 1 && <Sun size={32} />}
                                            {i === 2 && <TreeDeciduous size={32} />}
                                        </div>

                                        <h4 className="text-xl font-bold text-white mb-2 leading-tight">{ex.name}</h4>
                                        <p className="text-xs text-white/70 font-medium uppercase tracking-wider">{i === 0 ? 'Panic Reset' : i === 1 ? 'Daily Focus' : 'Audio Guide'}</p>

                                        <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md">Start Now</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EXISTING: PRESCRIBED GRID */}
                    <div>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Prescribed for {mood}</h3>
                            <span className="text-xs text-slate-600 font-mono hidden md:block">AI RECOMMENDATIONS v2.1</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {suggestedExercises.map((ex, index) => {
                                const theme = getCategoryTheme(ex.category);
                                const ThemeIcon = theme.icon;

                                return (
                                    <div
                                        key={ex.id}
                                        onClick={() => handleStartExercise(ex)}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                        className={`
                                            group relative overflow-hidden rounded-3xl p-0 cursor-pointer 
                                            bg-slate-900/40 border border-white/5 
                                            ${theme.hoverBorder}
                                            transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]
                                            animate-fade-in-up
                                        `}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        <div className={`absolute -right-6 -top-6 ${theme.faintText} transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-12`}>
                                            <ThemeIcon size={180} />
                                        </div>

                                        <div className="relative p-6 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`
                                                    w-12 h-12 rounded-2xl flex items-center justify-center
                                                    ${theme.bg} ${theme.mainColor} border ${theme.border}
                                                    group-hover:scale-110 transition-transform duration-300 shadow-lg
                                                `}>
                                                    <ThemeIcon size={24} />
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                                    <Clock size={12} />
                                                    <span>{Math.round(ex.durationSeconds / 60)}m</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <h4 className="font-extrabold text-xl text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                                    {ex.name}
                                                </h4>
                                                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
                                                    {ex.benefits}
                                                </p>
                                                <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
                                                    <div className={`
                                                        flex items-center gap-3 text-sm font-bold uppercase tracking-wider
                                                        ${theme.mainColor} transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100
                                                    `}>
                                                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                                                            <Play size={12} fill="currentColor" />
                                                        </div>
                                                        <span>Begin Session</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* RIGHT COL: BIO-COHERENCE & STATS (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* MOVED: LIVE BIO-COHERENCE (Vertical Layout) */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-blue-600/5 backdrop-blur-sm" />

                        <div className="relative z-10 w-full">
                            <div className="flex justify-center mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold tracking-wider">LIVE BIO-COHERENCE</span>
                            </div>

                            {/* BREATHING ORB ANIMATION (Slightly Smaller for Sidebar) */}
                            <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
                                <div className={`absolute inset-0 bg-teal-400/20 rounded-full blur-3xl transition-all duration-[4000ms] ${breathPhase === 'INHALE' ? 'scale-150 opacity-40' : 'scale-100 opacity-20'}`} />
                                <div className={`absolute inset-0 border-2 border-teal-500/30 rounded-full transition-all duration-[4000ms] ${breathPhase === 'INHALE' ? 'scale-125' : 'scale-90'}`} />
                                <div className="w-40 h-40 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-[0_0_50px_rgba(20,184,166,0.4)] flex flex-col items-center justify-center relative z-10 animate-float">
                                    <span className="text-white/90 font-black text-2xl tracking-widest">{breathPhase}</span>
                                    <span className="text-white/50 text-xs font-bold mt-1">4 - 7 - 8</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black mb-2 leading-tight text-white">{mood} DETECTED</h2>
                            <p className="text-sm text-slate-400 mb-8 leading-relaxed px-2">
                                System synced. Restore alpha dominance now.
                            </p>

                            {/* MOOD SELECTOR (Grid) */}
                            <div className="grid grid-cols-2 gap-2">
                                {['STRESSED', 'TIRED', 'ANXIOUS', 'FOCUSED'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m as any)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${mood === m ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 bg-black/20 hover:bg-white/5'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MINI HUD */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-teal-400" size={20} />
                            <h3 className="font-bold text-white">System Status</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>COGNITIVE LOAD</span>
                                    <span className="text-teal-400">OPTIMAL</span>
                                </div>
                                <div className="flex gap-1 h-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                        <div key={i} className={`flex-1 rounded-full ${i <= 3 ? 'bg-teal-500' : 'bg-slate-800'}`} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>PHYSICAL TENSION</span>
                                    <span className="text-blue-400">LOW</span>
                                </div>
                                <div className="flex gap-1 h-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                        <div key={i} className={`flex-1 rounded-full ${i <= 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>RECOVERY SCORE</span>
                                    <span className="text-green-400">92%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[92%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WEEKLY ACTIVITY */}
                    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Past 7 Days</h3>
                        <div className="flex items-end gap-2 h-32 w-full">
                            {[40, 65, 30, 85, 50, 90, 60].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className={`w-full rounded-t-lg transition-all ${i === 6 ? 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'bg-slate-700 group-hover:bg-slate-600'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
