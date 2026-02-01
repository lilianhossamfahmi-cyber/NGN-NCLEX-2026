import React, { useState, useEffect } from 'react';
import { GenericRendererProps } from './types';
import { InteractionDispatcher } from '../InteractionDispatcher';
import {
    Clipboard,
    ChevronRight,
    ChevronLeft,
    FileText,
    Activity,
    Beaker,
    Pill,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { normalizeConfig } from '../ItemRenderer';

export const CaseStudyRenderer: React.FC<GenericRendererProps> = ({
    config,
    answers,
    setAnswers,
    isSubmitted,
    mode = 'student'
}) => {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

    // --- FIX: GREEDY SEARCH (Finds screens wherever they hide) ---
    // 1. Root (Ideal)
    // 2. Structure (Golden Standard)
    // 3. Content.Structure (Pipeline Artifact)
    const screens = config.screens ||
        config.structure?.screens ||
        config.content?.structure?.screens ||
        [];

    // Safety fallback
    const rawScreen = screens[currentScreenIndex] || { type: 'unknown', prompt: 'System Error: No screen content found.' };
    const currentScreen = normalizeConfig(rawScreen);

    // DEBUG: Alert if ghost screens are detected
    useEffect(() => {
        if (!screens || screens.length === 0) {
            console.error('[CaseStudyRenderer] CRITICAL: No screens found!', {
                rootKeys: Object.keys(config),
                hasStructure: !!config.structure,
                hasContent: !!config.content
            });
        }
    }, [config, screens]);

    // DEBUG: Log the config and current screen to diagnose matrix issue
    console.log('[CaseStudyRenderer] config keys:', Object.keys(config || {}));
    console.log('[CaseStudyRenderer] screens count:', screens.length);
    console.log('[CaseStudyRenderer] currentScreen:', currentScreen?.type, 'has rows:', !!currentScreen?.rows, 'has columns:', !!currentScreen?.columns);

    // EHR Data - Fallback to global if screen doesn't have specific updates
    const clinicalData = config.clinicalData || {};

    // In a real unfolding case, we might filter clinical data by "unfold" metadata
    // For now, we show what's available.

    const handleAnswerChange = (screenAns: any) => {
        const newAnswers = { ...(answers || {}) };
        newAnswers[currentScreenIndex] = screenAns;
        setAnswers(newAnswers);
    };

    const isLastScreen = currentScreenIndex === screens.length - 1;
    const isFirstScreen = currentScreenIndex === 0;

    const navigate = (dir: 'next' | 'prev') => {
        if (dir === 'next' && !isLastScreen) setCurrentScreenIndex(v => v + 1);
        if (dir === 'prev' && !isFirstScreen) setCurrentScreenIndex(v => v - 1);
    };

    // Helper to render clinical data tabs (EHR style)
    const renderEHR = () => {
        const p = clinicalData.patientInfo || { name: 'Unknown Patient', age: '??', gender: '?' };

        return (
            <div className="flex flex-col h-full bg-[#f8fafc] border-r border-[#e2e8f0] overflow-hidden">
                {/* EHR Header */}
                <div className="p-4 bg-white border-b border-[#e2e8f0] shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Clipboard className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Patient Record</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                        Age: {p.age} | Sex: {p.gender} | {p.codeStatus}
                    </div>
                </div>

                {/* EHR Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Notes */}
                    {clinicalData.history?.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0] shadow-sm">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2">
                                <FileText className="w-3 h-3" /> Progress Notes
                            </h4>
                            <div className="space-y-2">
                                {Array.isArray(clinicalData.history) ? (
                                    clinicalData.history.map((note: any, i: number) => (
                                        <div key={i} className="text-xs leading-relaxed border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                            <span className="font-bold text-blue-600 mr-2">{note.time}</span>
                                            {note.note}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: clinicalData.history }} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Vitals */}
                    {clinicalData.vitals?.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0] shadow-sm">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2">
                                <Activity className="w-3 h-3" /> Vital Signs
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[10px]">
                                    <thead>
                                        <tr className="text-slate-400 border-b border-slate-100">
                                            <th className="py-1 text-left">Time</th>
                                            <th className="py-1">BP</th>
                                            <th className="py-1">HR</th>
                                            <th className="py-1">RR</th>
                                            <th className="py-1">O2</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {clinicalData.vitals.map((v: any, i: number) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-0">
                                                <td className="py-2 text-left font-bold text-blue-600">{v.time}</td>
                                                <td className="py-2 font-medium">{v.bp}</td>
                                                <td className="py-2 font-medium">{v.hr}</td>
                                                <td className="py-2 font-medium">{v.rr}</td>
                                                <td className="py-2 font-medium">{v.o2}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Labs */}
                    {clinicalData.labs?.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0] shadow-sm">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2">
                                <Beaker className="w-3 h-3" /> Laboratory
                            </h4>
                            <div className="space-y-2">
                                {clinicalData.labs.map((l: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-600">{l.test}</span>
                                        <span className={`font-bold ${l.flag ? 'text-red-600' : 'text-slate-900'}`}>{l.value} <span className="text-[10px] font-normal text-slate-400">{l.unit}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders */}
                    {clinicalData.orders?.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0] shadow-sm">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2">
                                <Pill className="w-3 h-3" /> Medical Orders
                            </h4>
                            <div className="space-y-2">
                                {clinicalData.orders.map((o: any, i: number) => (
                                    <div key={i} className="text-xs border-b border-slate-50 pb-1 last:border-0">
                                        <div className="font-bold text-slate-800">{o.drug}</div>
                                        <div className="text-[10px] text-slate-500">{o.dose} {o.route} {o.freq}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[700px] border border-[#e2e8f0] rounded-2xl overflow-hidden bg-white shadow-xl">
            {/* Header / Stepper */}
            <div className="flex-none h-14 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Case Study</span>
                    </div>
                    <div className="h-4 w-px bg-slate-700 mx-2" />
                    <div className="flex gap-2">
                        {screens.map((_: any, i: number) => (
                            <div
                                key={i}
                                className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i === currentScreenIndex ? 'bg-indigo-500 w-12' :
                                    (answers && answers[i]) ? 'bg-emerald-500/50' : 'bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('prev')}
                        disabled={isFirstScreen}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Screen {currentScreenIndex + 1} of {screens.length}
                    </span>
                    <button
                        onClick={() => navigate('next')}
                        disabled={isLastScreen}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: EHR */}
                <div className="w-[300px] flex-none">
                    {renderEHR()}
                </div>

                {/* Right: Question */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {/* Phase Header */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                        <AlertCircle className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                            {currentScreen.cjmmStep || 'Clinical Reasoning'}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
                        {currentScreen.prompt || config.prompt}
                    </h2>

                    {/* Sub-Renderer Dispatcher */}
                    <div className="min-h-[300px]">
                        <InteractionDispatcher
                            config={currentScreen}
                            answers={(answers || {})[currentScreenIndex]}
                            setAnswers={handleAnswerChange}
                            isSubmitted={isSubmitted}
                            mode={mode}
                        />
                    </div>

                    {/* Screen Navigation Footer */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                        <button
                            disabled={isFirstScreen}
                            onClick={() => navigate('prev')}
                            className="text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-0 transition-all flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous Step
                        </button>

                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Progress {Math.round(((currentScreenIndex + 1) / screens.length) * 100)}%
                        </div>

                        <button
                            disabled={isLastScreen}
                            onClick={() => navigate('next')}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-0 transition-all flex items-center gap-1"
                        >
                            Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
