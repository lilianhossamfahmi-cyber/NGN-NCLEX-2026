import React, { useState } from 'react';
import {
    X,
    Copy,
    Thermometer,
    Heart,
    Wind,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Stethoscope,
    Brain,
    Flame
} from 'lucide-react';

// --- Types ---
export interface VitalData {
    label: string;
    value: string;
    status: 'critical' | 'warning' | 'normal' | 'neutral';
    reasoning: string;
}

export interface RationaleData {
    concept: string;
    vitals: VitalData[];
    pitfalls: string[];
    takeaway: string;
    algorithm: string[];
}

interface RationaleEngineProps {
    data: RationaleData;
    onClose?: () => void;
    className?: string; // Allow external positioning/sizing if needed
}

// --- Helper Functions ---
const getStatusColor = (status: VitalData['status']) => {
    switch (status) {
        case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200';
        case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'normal': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const getStatusIcon = (status: VitalData['status']) => {
    switch (status) {
        case 'critical': return <Flame className="w-4 h-4 text-rose-500 animate-pulse" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case 'normal': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
};

const getVitalIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('temp')) return <Thermometer className="w-4 h-4" />;
    if (l.includes('hr') || l.includes('heart')) return <Heart className="w-4 h-4" />;
    if (l.includes('bp') || l.includes('pressure')) return <Activity className="w-4 h-4" />; // Or specific BP icon
    if (l.includes('rr') || l.includes('resp')) return <Wind className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
};

export const RationaleEngine: React.FC<RationaleEngineProps> = ({ data, onClose, className }) => {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const copyKeyPoints = () => {
        const text = `
Concept: ${data.concept}
Takeaway: ${data.takeaway}
Pitfalls: ${data.pitfalls.join(', ')}
        `.trim();
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <div className={`relative flex flex-col w-full h-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-slate-200 ring-1 ring-slate-900/5 ${className}`}>

            {/* --- Header --- */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            Clinical Reasoning Key
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            High-Fidelity Analysis
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyKeyPoints}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Key Points
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </header>

            {/* --- Main Content Split --- */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">

                {/* --- Section A: Visual Triage (Left) --- */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">

                    {/* Core Concept */}
                    <div className="mb-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-4 border border-slate-200">
                            <Stethoscope className="w-3 h-3" />
                            Core Concept
                        </span>
                        <h1 className="text-2xl md:text-3xl font-serif text-slate-800 leading-tight">
                            {data.concept}
                        </h1>
                    </div>

                    {/* Vitals Analysis */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Hemodynamic Profiling
                        </h3>
                        <div className="space-y-4">
                            {data.vitals.map((vital, idx) => (
                                <div
                                    key={idx}
                                    className={`group relative p-4 rounded-xl border transition-all duration-300 ${getStatusColor(vital.status)} ${
                                        // Highlight logic could go here
                                        'hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getVitalIcon(vital.label)}
                                            <span className="font-bold text-sm uppercase tracking-wider opactiy-80">{vital.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-lg">{vital.value}</span>
                                            {getStatusIcon(vital.status)}
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium opacity-90 pl-6 border-l-2 border-current/20">
                                        {vital.reasoning}
                                    </div>

                                    {/* Pulse effect for critical */}
                                    {vital.status === 'critical' && (
                                        <div className="absolute inset-0 rounded-xl ring-2 ring-rose-500/20 animate-pulse pointer-events-none" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Section B: CJMM Timeline (Right) --- */}
                <div className="w-full md:w-[400px] bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Clinical Algorithm
                    </h3>

                    <div className="relative pl-4 space-y-8">
                        {/* Vertical Line */}
                        <div className="absolute top-2 bottom-2 left-[21px] w-0.5 bg-slate-200 border-l border-dashed border-slate-300" />

                        {data.algorithm.map((step, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveStep(idx)}
                                className={`relative pl-8 cursor-pointer transition-opacity duration-200 ${activeStep !== null && activeStep !== idx ? 'opacity-40' : 'opacity-100'}`}
                            >
                                {/* Step Dot */}
                                <div className={`absolute left-0 top-1 w-11 h-11 rounded-full border-4 border-slate-50 shadow-sm flex items-center justify-center font-bold text-sm transition-colors duration-300 z-10 ${activeStep === idx
                                    ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200'
                                    : 'bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                                    }`}>
                                    {idx + 1}
                                </div>

                                {/* Content */}
                                <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all duration-300 ${activeStep === idx ? 'ring-2 ring-indigo-500/20 border-indigo-200' : 'border-slate-200 hover:border-indigo-200'
                                    }`}>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Section C: Golden Rule Footer --- */}
            <div className="bg-slate-900 text-slate-200 p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Takeaway */}
                    <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            Clinical Takeaway
                        </h4>
                        <p className="text-lg font-medium text-white leading-relaxed font-serif italic">
                            "{data.takeaway}"
                        </p>
                    </div>

                    {/* Pitfalls */}
                    <div className="w-full md:w-auto flex flex-col gap-2 min-w-[200px]">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            Avoid These Traps
                        </h4>
                        {data.pitfalls.map((trap, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20"
                            >
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                {trap}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
