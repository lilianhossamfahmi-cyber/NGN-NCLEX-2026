import React from 'react';
import { Activity, Wind, Zap, Cpu, Search, Brain } from 'lucide-react';
import { BiometricData } from '../../../../types/student-schema';

export const ExpertHudWidget: React.FC<{ data: BiometricData }> = ({ data }) => {
    // Simulate a simple sparkline for the "Focus Monitor"
    const focusPoints = data.calmTrend.map((v: number, i: number) => `${i * 10},${100 - v}`).join(' ');

    return (
        <div className="bg-slate-900 text-white rounded-2xl p-0 overflow-hidden shadow-2xl border border-slate-700 font-sans relative group h-full">
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px]" />

            {/* HEADER */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center relative z-10 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <Brain size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wider">EXPERT HUD</h3>
                        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Biometric Analytics</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="text-slate-500 hover:text-white transition-colors"><Activity size={16} /></button>
                </div>
            </div>

            <div className="p-6 relative z-10">
                {/* FOCUS MONITOR SECTION */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Focus Monitor</div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                                </span>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Focused</h2>
                            </div>
                        </div>
                        {/* MINI GRAPH */}
                        <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700 w-32 h-12 flex items-center justify-center relative overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 60 100" preserveAspectRatio="none">
                                <polyline
                                    fill="none"
                                    stroke="#14b8a6"
                                    strokeWidth="2"
                                    points={focusPoints}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent" />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-800 w-full mb-8" />

                {/* STRESS COACH SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* VISUALIZER CIRCLE */}
                    <div className="md:col-span-2 flex items-center justify-center">
                        <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            {/* Rings */}
                            <div className="absolute inset-0 border-2 border-slate-700/50 rounded-full" />
                            <div className="absolute inset-2 border border-slate-600/30 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-0 border-t-2 border-teal-500 rounded-full animate-[spin_3s_linear_infinite]" />

                            {/* Center Content */}
                            <div className="bg-slate-800/80 w-20 h-20 rounded-full flex flex-col items-center justify-center backdrop-blur-md border border-slate-700 shadow-xl">
                                <Wind size={24} className="text-teal-400 mb-1" />
                                <span className="text-[10px] font-bold text-teal-400 tracking-widest">CALM</span>
                            </div>
                        </div>
                    </div>

                    {/* COACHING TEXT */}
                    <div className="md:col-span-3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={12} className="text-orange-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stress Coach</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-4">The Confidence Anchor</h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">1</div>
                                <p className="text-sm text-slate-300">Take 1 deep breath</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">2</div>
                                <p className="text-sm text-slate-300">Think: "I know this. Next."</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex gap-3">
                            <Cpu size={16} className="text-pink-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[10px] font-bold text-pink-400 uppercase block mb-0.5">Why it works</span>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    Anchors success feeling without breaking momentum.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border-t border-slate-800 p-2 text-center text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer flex items-center justify-center gap-1 transition-colors">
                <Search size={10} /> Click to enlarge analytics
            </div>
        </div>
    );
};
