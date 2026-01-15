import React, { useMemo } from 'react';
import { useStudentMetrics } from '../../hooks/useStudentMetrics';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TrendChart } from './widgets/TrendChart';

import { AdaptiveCatMode } from '../AdaptiveCatMode';
import { SpacedRepetitionMode } from '../SpacedRepetitionMode';
import { WeaknessAttackMode } from '../WeaknessAttackMode';
import { CaseStudyMode } from '../CaseStudyMode';
import { SurvivalMode } from '../SurvivalMode';
import { CustomExamMode } from '../CustomExamMode';
import { StudyPlannerMode } from '../StudyPlannerMode';
import { WellnessMode } from '../WellnessMode';
import { WeaknessDetectionEngine, DetectedWeakness } from '../../learning/WeaknessDetectionEngine';
import { SingleItemPreviewMode } from '../SingleItemPreviewMode';
import { Button } from '../../../components/ui/button';
import {
    Repeat, Target, AlertTriangle, ShieldCheck, FileText, Flame,
    Settings, TrendingUp, Activity, Calendar, ArrowRight, Layers,
    BarChart3, Clock, Trophy, ChevronRight
} from 'lucide-react';

// --- MODERN UI COMPONENTS ---

const MetricTile = ({ label, value, subtext, icon: Icon, trend, color, percentage }: any) => {
    // Calculate simple gauge rotation
    const rotation = (percentage / 100) * 180; // 0 to 180 degrees map

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden h-full min-h-[160px]">
            {/* Header */}
            <div className="flex justify-between items-start z-10 relative">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                {trend && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full flex items-center">
                        {trend} <TrendingUp size={10} className="ml-0.5" />
                    </span>
                )}
            </div>

            {/* Gauge Visualization (CSS/SVG Hybrid) */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-16 overflow-hidden mt-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 box-border"></div>
                <div
                    className={`absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] ${color.replace('bg-', 'border-')} box-border transition-all duration-1000 ease-out`}
                    style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)', transform: `rotate(${rotation - 180}deg)` }}
                />
            </div>

            {/* Main Value */}
            <div className="text-center z-10 relative mt-4">
                <div className="text-3xl font-black text-slate-800 tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">{subtext}</div>
            </div>

            {/* Footer Icon */}
            <div className={`mt-auto pt-4 flex justify-between items-center text-xs font-bold ${color.replace('bg-', 'text-')} opacity-80 z-10 relative`}>
                <span>View Details</span>
                <Icon size={14} />
            </div>
        </div>
    );
};

const BioSignalCard = ({ onClick }: { onClick: () => void }) => (
    <div
        onClick={onClick}
        className="bg-slate-900 rounded-2xl p-0 shadow-md border border-slate-800 flex flex-col relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-full min-h-[160px]"
    >
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[40px] pointer-events-none" />

        <div className="p-5 flex flex-col h-full relative z-10 justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Live Bio-Signals</span>
                </div>
                <Activity size={14} className="text-teal-500" />
            </div>

            {/* Stats */}
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-black text-white">Optimal</span>
                <span className="text-xs text-slate-400 font-bold mb-1">State</span>
            </div>

            {/* White ECG Printout Box */}
            <div className="bg-white/5 rounded-lg h-10 relative overflow-hidden border border-white/10 flex items-center mt-auto">
                <style>
                    {`
                        @keyframes ecg-draw {
                            0% { stroke-dashoffset: 1000; }
                            100% { stroke-dashoffset: 0; }
                        }
                        .animate-ecg-line {
                            stroke-dasharray: 1000;
                            stroke-dashoffset: 1000;
                            animation: ecg-draw 4s linear infinite;
                        }
                    `}
                </style>
                <div className="w-full h-full relative px-1">
                    <svg height="100%" width="100%" viewBox="0 0 400 56" preserveAspectRatio="none" className="text-teal-400">
                        <path
                            className="animate-ecg-line"
                            d="M0,28 L20,28 L25,24 L30,28 L40,28 L45,38 L50,10 L55,38 L60,28 L70,28 L75,24 L80,28 L100,28 L120,28 L125,24 L130,28 L140,28 L145,38 L150,10 L155,38 L160,28 L170,28 L175,24 L180,28 L200,28 L220,28 L225,24 L230,28 L240,28 L245,38 L250,10 L255,38 L260,28 L270,28 L275,24 L280,28 L300,28 L320,28 L325,24 L330,28 L340,28 L345,38 L350,10 L355,38 L360,28 L370,28 L375,24 L380,28 L400,28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
);

const ModeCard = ({ title, subtitle, icon: Icon, color, onClick, badge }: any) => (
    <div
        onClick={onClick}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-lg hover:translate-y-[-2px] transition-all group relative overflow-hidden h-full"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 ${color.replace('bg-', 'text-')}`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${color} text-white shadow-md mb-4`}>
                    <Icon size={20} />
                </div>
                {badge && (
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[90%]">{subtitle}</p>
            </div>
        </div>
    </div>
);

export const StudentDashboard: React.FC = () => {
    const { data, loading, error } = useStudentMetrics();
    const [view, setView] = React.useState<'dashboard' | 'cat' | 'srs' | 'weakness' | 'case' | 'survival' | 'custom' | 'planner' | 'wellness' | 'single'>('dashboard');
    const [activeWeakness, setActiveWeakness] = React.useState<DetectedWeakness | null>(null);
    const [previewItemId, setPreviewItemId] = React.useState<string | null>(null);

    // Deep Link Check
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('itemId');
        if (itemId) {
            setPreviewItemId(itemId);
            setView('single');
        }
    }, []);

    // Calculate Weaknesses
    const weaknesses = useMemo(() => {
        if (!data) return [];
        return WeaknessDetectionEngine.analyze(data);
    }, [data]);

    const handleStartWeakness = (weakness: DetectedWeakness) => {
        setActiveWeakness(weakness);
        setView('weakness');
    };

    // --- VIEW ROUTING ---
    if (view === 'cat') return <div className="h-screen bg-background"><AdaptiveCatMode studentId="student_mock_001" onExit={() => setView('dashboard')} /></div>;
    if (view === 'srs') return <div className="h-screen bg-background"><SpacedRepetitionMode onExit={() => setView('dashboard')} /></div>;
    if (view === 'weakness' && activeWeakness) return <div className="h-screen bg-background"><WeaknessAttackMode studentId="student_mock_001" weakness={activeWeakness} onExit={() => { setView('dashboard'); setActiveWeakness(null); }} onComplete={() => { setView('dashboard'); setActiveWeakness(null); }} /></div>;
    if (view === 'case') return <div className="h-screen bg-background"><CaseStudyMode onExit={() => setView('dashboard')} /></div>;
    if (view === 'survival') return <div className="h-screen bg-background"><SurvivalMode onExit={() => setView('dashboard')} /></div>;
    if (view === 'custom') return <div className="h-screen bg-background"><CustomExamMode onExit={() => setView('dashboard')} /></div>;
    if (view === 'planner') return <StudyPlannerMode onExit={() => setView('dashboard')} />;

    if (view === 'wellness') return <WellnessMode onExit={() => setView('dashboard')} />;
    if (view === 'single' && previewItemId) return <SingleItemPreviewMode itemId={previewItemId} onExit={() => {
        // Clear URL param on exit
        const url = new URL(window.location.href);
        url.searchParams.delete('itemId');
        window.history.pushState({}, '', url);
        setView('dashboard');
    }} />;

    if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner progress={50} message="Loading Analytics..." /></div>;
    if (error) return <div className="p-8 text-red-500">Error loading dashboard: {error}</div>;
    if (!data) return null;

    const { stats } = data;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">

            {/* --- TOP NAVIGATION BAR --- */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200">
                            NGN
                        </div>
                        <span className="font-bold text-slate-800 tracking-tight">Master Creator</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> Jan 12</span>
                            <span className="w-px h-3 bg-slate-200" />
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500" /> 42 Days to NCLEX</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                            JD
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">

                {/* --- SECTION 1: PERFORMANCE METRICS (Top Row) --- */}
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                        <Activity size={16} /> Performance Scorecards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricTile
                            label="Pass Success"
                            value={`${stats.passProbability}%`}
                            trend="+2.4%"
                            color="bg-green-500"
                            icon={Trophy}
                            subtext="High Confidence"
                            percentage={stats.passProbability}
                        />
                        <MetricTile
                            label="Overall Accuracy"
                            value={`${stats.accuracy}%`}
                            trend="Stable"
                            color="bg-blue-500"
                            icon={Target}
                            subtext="Last 30 Days"
                            percentage={stats.accuracy}
                        />
                        <MetricTile
                            label="Time Efficiency"
                            value={`${stats.timeEfficiency}x`}
                            color="bg-amber-500"
                            icon={Clock}
                            subtext="Seconds / Question"
                            percentage={80} // Mock percentage for gauge
                        />
                        <BioSignalCard onClick={() => setView('wellness')} />
                    </div>
                </div>

                {/* --- SECTION 2: HERO & PRIMARY ACTIONS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ADAPTIVE ENGINE (HERO) */}
                    <div
                        onClick={() => setView('cat')}
                        className="lg:col-span-8 relative bg-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden cursor-pointer group shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.005]"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-600/30 transition-all duration-700" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">AI Engine Ready</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                                    Adaptive NCLEX<br />Simulation
                                </h1>
                                <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">
                                    Your personal AI tutor constructs a unique exam path tailored to your real-time performance.
                                </p>
                            </div>
                            <div className="mt-10 flex items-center gap-4">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 px-8 py-7 rounded-xl text-lg font-bold shadow-lg shadow-blue-900/50 transition-all group-hover:pl-10">
                                    Start Session <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* SMART PLANNER */}
                    <div
                        onClick={() => setView('planner')}
                        className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer group relative overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 mb-1">Smart Planner</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Roadmap</p>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                <Calendar size={24} />
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                                <div>
                                    <div className="text-sm font-bold text-slate-700">Pharmacology Review</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">2:00 PM • Active Recall</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors opacity-60">
                                <div className="w-1.5 h-8 bg-slate-300 rounded-full" />
                                <div>
                                    <div className="text-sm font-bold text-slate-700">Pediatrics Quiz</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">4:30 PM • 30 Min</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                            <span>Open Full Schedule</span>
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: TRAINING & ANALYSIS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: TRAINING MODULES */}
                    <div className="lg:col-span-8">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                            <Layers size={16} /> Training Modules
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <ModeCard
                                title="Memory Master"
                                subtitle="Optimize retention with Spaced Repetition algorithms."
                                icon={Repeat}
                                color="bg-purple-600"
                                onClick={() => setView('srs')}
                                badge={data.srsDueCount > 0 ? `${data.srsDueCount} DUE` : undefined}
                            />
                            <ModeCard
                                title="Clinical Cases"
                                subtitle="Master the NGN Folding Case Study format."
                                icon={FileText}
                                color="bg-pink-600"
                                onClick={() => setView('case')}
                            />
                            <ModeCard
                                title="Survival Mode"
                                subtitle="High-stakes sudden death challenge."
                                icon={Flame}
                                color="bg-orange-600"
                                onClick={() => setView('survival')}
                            />
                            <ModeCard
                                title="Exam Builder"
                                subtitle="Create custom mock exams by topic."
                                icon={Settings}
                                color="bg-slate-600"
                                onClick={() => setView('custom')}
                            />
                        </div>
                    </div>

                    {/* RIGHT: ANALYTICS SIDEBAR */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                            <BarChart3 size={16} /> Analysis
                        </h2>

                        {/* ALERT CARD */}
                        {weaknesses.length > 0 ? (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-4 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div className="font-bold text-red-900 text-sm">Attention Needed</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-800">{weaknesses[0].topic}</div>
                                    <div className="text-xs font-medium text-red-600/80 mt-1">Error pattern detected in last 3 sessions.</div>
                                </div>
                                <Button size="sm" onClick={() => handleStartWeakness(weaknesses[0])} variant="destructive" className="w-full mt-1 shadow-lg shadow-red-200">
                                    Fix Weakness
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-4 shadow-sm flex items-center gap-4">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-green-900 text-sm">All Systems Nominal</div>
                                    <div className="text-xs text-green-700/80">You are on track.</div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm">Score Trend</h3>
                            <div className="h-[200px]">
                                <TrendChart attempts={data.recentAttempts} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
