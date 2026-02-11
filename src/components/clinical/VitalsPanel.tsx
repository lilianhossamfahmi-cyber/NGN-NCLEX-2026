
import React from 'react';
import { DataSanitizer } from '../../utils/DataSanitizer';
import {
    calculateMAP,
    calculateMEWS,
    parseBP,
    getVitalStatus,
    calculateDelta
} from '../../utils/ClinicalHelpers';

export interface VitalsPanelProps {
    data: any;
    item?: any;
}

export const VitalsPanel: React.FC<VitalsPanelProps> = ({ data, item }) => {
    // 3. HELPER: Vitals - GOLD STANDARD with MEWS & MAP (Horizontal Grid Layout) logic ported
    const vitals = (item?.content?.clinicalData as any)?._structuredVitals || DataSanitizer.sanitizeVitals(data);

    // Empty state
    if (!vitals || vitals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-5xl mb-4 opacity-50">💓</div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Vital Signs Recorded</h3>
                <p className="text-sm text-slate-400 text-center max-w-sm">
                    Vital signs have not been documented for this encounter.
                </p>
            </div>
        );
    }

    // Calculate MEWS for latest vitals
    const latest = vitals[vitals.length - 1];
    const bpParsed = parseBP(latest?.bp);
    const mews = calculateMEWS({
        hr: latest?.hr,
        sbp: bpParsed?.sbp,
        rr: latest?.rr,
        tempF: parseFloat(latest?.tempF)
    });
    const map = bpParsed ? calculateMAP(bpParsed.sbp, bpParsed.dbp) : null;

    const mewsColors: Record<string, string> = {
        low: 'bg-green-100 text-green-800 border-green-300',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        high: 'bg-orange-100 text-orange-800 border-orange-300',
        critical: 'bg-red-100 text-red-800 border-red-300 animate-pulse'
    };

    const statusColors: Record<string, string> = {
        normal: 'text-slate-800',
        abnormal: 'text-orange-600 bg-orange-50 px-1 rounded',
        critical: 'text-red-600 bg-red-100 px-1 rounded animate-pulse font-black'
    };

    // Pain color helper
    const getPainColor = (pain: number) => {
        if (pain >= 7) return 'text-red-600 bg-red-100';
        if (pain >= 4) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    return (
        <div className="space-y-4">
            {/* MEWS Score Banner */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${mewsColors[mews.level]}`}>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">MEWS: {mews.score}</span>
                    <span className="text-sm font-medium uppercase">{mews.level} Risk</span>
                </div>
                {map && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase">MAP:</span>
                        <span className={`font-bold ${map < 65 ? 'text-red-700' : 'text-slate-800'}`}>{map} mmHg</span>
                        {map < 65 && <span className="text-red-500 text-xs">⚠ Low</span>}
                    </div>
                )}
            </div>

            {/* Vitals Grid - Horizontal Rows per Time */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="px-3 py-2 text-center">Time</div>
                    <div className="px-3 py-2 text-center">Temp</div>
                    <div className="px-3 py-2 text-center">HR</div>
                    <div className="px-3 py-2 text-center">BP</div>
                    <div className="px-3 py-2 text-center">RR</div>
                    <div className="px-3 py-2 text-center">SpO2</div>
                    <div className="px-3 py-2 text-center">Pain</div>
                </div>

                {/* Data Rows */}
                {vitals.map((v: any, i: number) => {
                    const bp = parseBP(v.bp);
                    const tempStatus = getVitalStatus('tempF', parseFloat(v.tempF) || 98.6);
                    const hrStatus = getVitalStatus('hr', v.hr || 80);
                    const rrStatus = getVitalStatus('rr', v.rr || 16);
                    const o2Status = getVitalStatus('spo2', parseFloat(v.o2 || v.spo2 || 98));
                    const bpStatus = bp && bp.sbp < 90 ? 'critical' : 'normal';

                    // Trend arrows (compare to previous)
                    const prev = i > 0 ? vitals[i - 1] : null;
                    const hrTrend = prev ? calculateDelta(v.hr, prev.hr) : null;
                    const tempTrend = prev ? calculateDelta(parseFloat(v.tempF), parseFloat(prev.tempF)) : null;

                    // Pain value with fallback
                    const painValue = v.pain !== undefined ? v.pain : (v.painScore !== undefined ? v.painScore : (v.painLevel !== undefined ? v.painLevel : null));

                    return (
                        <div key={i} className={`grid grid-cols-7 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            {/* Time */}
                            <div className="px-3 py-3 text-center">
                                <span className="text-sm font-bold text-slate-700">{v.time || '00:00'}</span>
                            </div>

                            {/* Temp */}
                            <div className="px-3 py-3 text-center">
                                <span className={`text-sm font-bold ${statusColors[tempStatus]}`}>
                                    {v.tempF || '98.6'}°F
                                    {tempTrend && tempTrend.direction !== 'stable' && (
                                        <span className={`ml-1 text-xs ${tempTrend.direction === 'up' ? 'text-red-500' : 'text-blue-500'}`}>
                                            {tempTrend.direction === 'up' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* HR */}
                            <div className="px-3 py-3 text-center">
                                <span className={`text-sm font-bold ${statusColors[hrStatus]}`}>
                                    {v.hr || '--'}
                                    {hrTrend && hrTrend.direction !== 'stable' && (
                                        <span className={`ml-1 text-xs ${hrTrend.direction === 'up' ? 'text-red-500' : 'text-blue-500'}`}>
                                            {hrTrend.direction === 'up' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* BP */}
                            <div className="px-3 py-3 text-center">
                                <span className={`text-sm font-bold ${statusColors[bpStatus]}`}>
                                    {v.bp || '--/--'}
                                </span>
                            </div>

                            {/* RR */}
                            <div className="px-3 py-3 text-center">
                                <span className={`text-sm font-bold ${statusColors[rrStatus]}`}>
                                    {v.rr || '--'}
                                </span>
                            </div>

                            {/* SpO2 */}
                            <div className="px-3 py-3 text-center">
                                <div className="flex flex-col items-center">
                                    <span className={`text-sm font-bold ${statusColors[o2Status]}`}>
                                        {v.o2 || v.spo2 || '98'}%
                                    </span>
                                    <span className="text-[9px] text-slate-400">
                                        {v.o2_device === 'RA' ? 'RA' : v.o2_device || 'RA'}
                                    </span>
                                </div>
                            </div>

                            {/* Pain */}
                            <div className="px-3 py-3 text-center">
                                {painValue !== null ? (
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${getPainColor(painValue)}`}>
                                        {painValue}/10
                                    </span>
                                ) : (
                                    <span className="text-sm text-slate-300">--</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Normal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Abnormal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Critical</span>
            </div>
        </div>
    );
};
