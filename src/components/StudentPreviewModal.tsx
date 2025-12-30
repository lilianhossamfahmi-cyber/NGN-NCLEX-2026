import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MasterQuestionItem } from '../types/master-schema';
import { renderQuestion } from './item-types/ItemRenderer';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileDrawer } from './mobile/MobileDrawer';
// import { RationaleTriggerBar } from './RationaleTriggerBar'; // Removed
import { RationaleDrawer } from './RationaleSheet';
import { ToolSuite } from './tools/ToolSuite';
import ExpertDashboard from './ExpertDashboard';
import { CognitiveAnalyticsEngine, SessionHistoryItem } from '../utils/scoringEngine';
import { InteractionData } from '../utils/stressEngine';
import { FloatingPatientHeader } from './FloatingPatientHeader';
import { FloatingControls } from './FloatingControls';

interface StudentPreviewModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
}

// Icons
const NoteIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const UserIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ActivityIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const BeakerIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>;
const FileTextIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const ImageIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

// Clinical Logistics Icons
const CalendarClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /><path d="M18 22l3-3" /><path d="M18 19l3 3" /><circle cx="12" cy="17" r="5" /><polyline points="12 15 12 17 14 17" /></svg>;
const MapPinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const StethoscopeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2v2" /><path d="M5 2v2" /><path d="M5 5h6" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M8 7v2" /><path d="M16 7v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7" /></svg>;
const UserMdIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;

// Helper Component for Font Control
const ProfessionalFontControl = ({ level, setLevel }: { level: number, setLevel: (n: number) => void }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            overflow: 'hidden',
        }}>
            <button
                onClick={() => setLevel(Math.max(0.8, level - 0.1))}
                style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: 'transparent',
                    borderRight: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    minWidth: '36px'
                }}
                disabled={level <= 0.8}
            >
                A-
            </button>
            <div style={{
                padding: '0 12px',
                fontSize: '0.8rem',
                color: '#334155',
                fontWeight: 600,
                minWidth: '48px',
                textAlign: 'center',
                background: '#f8fafc'
            }}>
                {Math.round(level * 100)}%
            </div>
            <button
                onClick={() => setLevel(Math.min(1.5, level + 0.1))}
                style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: 'transparent',
                    borderLeft: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    minWidth: '36px'
                }}
                disabled={level >= 1.5}
            >
                A+
            </button>
        </div>
    );
};
const ShieldAlertIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;


const PatientHeader = ({ data }: { data: any }) => (
    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>
        {/* Bottom Grid: Clinical Logistics - SLATE 900 BACKGROUND (Lighter) */}
        <div style={{ background: '#0F172A', padding: '16px 24px', fontSize: '0.8rem', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px 24px' }}>
                {/* Admission */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '6px', borderRadius: '6px', color: '#60a5fa' }}>
                        <CalendarClockIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Admission Date</span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{data?.admissionDate || '10/24/2025 07:30'}</span>
                    </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '6px', color: '#34d399' }}>
                        <MapPinIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Location</span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{data?.room || 'ICU-12'}</span>
                    </div>
                </div>

                {/* Provider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '6px', borderRadius: '6px', color: '#fb923c' }}>
                        <StethoscopeIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Attending Prov.</span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{data?.physician || 'Dr. S. Esposito'}</span>
                    </div>
                </div>

                {/* Nurse */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '6px', borderRadius: '6px', color: '#c084fc' }}>
                        <UserMdIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Primary Nurse</span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{data?.nurse || 'R. Jones, RN'}</span>
                    </div>
                </div>

                {/* Allergies */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '6px', color: '#f87171' }}>
                        <ShieldAlertIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Allergies</span>
                        <span style={{ fontWeight: 700, color: data?.allergies && data.allergies !== 'NKDA' && data.allergies !== 'NKA' ? '#fca5a5' : '#86efac', fontSize: '0.85rem' }}>
                            {data?.allergies || 'NKA'}
                        </span>
                    </div>
                </div>

                {/* Isolation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '6px', borderRadius: '6px', color: '#facc15' }}>
                        <LockIcon />
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Isolation</span>
                        <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.85rem' }}>{data?.isolation || 'Standard Precautions'}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CaseTabSystem = ({ activeTab, onTabChange }: any) => {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const sections = [
        { id: 'notes', label: 'Nurses Notes', icon: <NoteIcon />, color: '#3b82f6', bg: '#eff6ff' },   // Blue
        { id: 'history', label: 'History & Physical', icon: <UserIcon />, color: '#06b6d4', bg: '#ecfeff' }, // Cyan
        { id: 'vitals', label: 'Vital Signs', icon: <ActivityIcon />, color: '#ef4444', bg: '#fef2f2' },  // Red
        { id: 'labs', label: 'Laboratory Results', icon: <BeakerIcon />, color: '#a855f7', bg: '#faf5ff' }, // Purple
        { id: 'orders', label: 'Orders', icon: <FileTextIcon />, color: '#f59e0b', bg: '#fffbeb' },   // Amber
        { id: 'rad', label: 'Radiology', icon: <ImageIcon />, color: '#10b981', bg: '#ecfdf5' }       // Emerald
    ];

    return (
        <div style={{
            display: 'flex',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            width: '100%',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {sections.map(sec => {
                    const isActive = activeTab === sec.id;
                    const isHovered = hoveredTab === sec.id;

                    return (
                        <button
                            key={sec.id}
                            onClick={() => onTabChange(sec.id)}
                            onMouseEnter={() => setHoveredTab(sec.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '16px 12px',
                                background: isActive ? sec.bg : (isHovered ? '#f8fafc' : 'white'),
                                border: 'none',
                                borderBottom: isActive ? `3px solid ${sec.color}` : (isHovered ? `3px solid ${sec.color}40` : '3px solid transparent'),
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                color: isActive ? sec.color : '#64748b',
                                fontWeight: isActive ? 800 : 600,
                                fontSize: '0.8rem',
                                transform: isHovered && !isActive ? 'translateY(-2px)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isHovered && !isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : (isActive ? `inset 0 -2px 0 0 ${sec.color}20` : 'none')
                            }}
                        >
                            <span style={{
                                color: sec.color,
                                padding: '8px',
                                borderRadius: '12px',
                                background: isActive || isHovered ? sec.bg : 'transparent',
                                display: 'flex',
                                transition: 'all 0.2s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}>
                                {React.cloneElement(sec.icon as any, { width: 32, height: 32, strokeWidth: isActive ? 2.5 : 2.5 })}
                            </span>
                            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>{sec.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


import { normalizeConfig } from './item-types/ItemRenderer';
import { PerfectFillService } from '../utils/perfectFillSystem';
import { DataSanitizer, StructuredNote } from '../utils/DataSanitizer';
import {
    calculateMAP,
    calculateMEWS,
    parseBP,
    getVitalStatus,
    getLabStatus,
    calculateDelta,
    applyTallManLettering,
    isHighAlertMedication,
    isCriticalNote,
    isInterventionNote,
    hasDocumentedResponse,
    hasCriticalRadiologyFinding
} from '../utils/ClinicalHelpers';

export const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({ item: rawItem, onClose }) => {
    // 1. RADICAL STABILIZATION & ENRICHMENT
    // Stabilize (Sanitize + Shuffle Once) -> Enrich (Perfect Fill)
    const item = useMemo(() => {
        if (!rawItem) return null;
        const stable = DataSanitizer.stabilizeItem(rawItem);
        return PerfectFillService.enrich(stable);
    }, [rawItem?.id]); // Only re-run if ID changes

    if (!item) return null;

    // 2. HELPER: Render the "Timeline Feed" (Nurses Notes) - GOLD STANDARD
    const renderNursesNotes = (data: any) => {
        let notes: StructuredNote[] = (item.content?.clinicalData as any)?._structuredHistory;
        if (!notes) {
            const rawData = data || item.content?.clinicalData?.history || (item.content?.clinicalData as any)?.nursesNotes;
            notes = DataSanitizer.sanitizeNursesNotes(rawData);
        }

        // Empty State
        if (!notes || notes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="text-5xl mb-4 opacity-50">📋</div>
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Nursing Documentation</h3>
                    <p className="text-sm text-slate-400 text-center max-w-sm">
                        Nursing notes have not been documented for this encounter yet.
                    </p>
                </div>
            );
        }

        // Detect shift changes (0700-1900 = Day, 1900-0700 = Night)
        let lastShift = '';

        return (
            <div className="flex flex-col relative pl-2 pr-2">
                {/* Vertical Timeline Line - moved closer to content */}
                <div className="absolute left-[72px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-200 via-slate-200 to-blue-200"></div>

                {notes.map((row, idx) => {
                    // Determine shift
                    const hourMatch = row.time.match(/(\d{1,2}):/);
                    const hour = hourMatch ? parseInt(hourMatch[1]) : 12;
                    const currentShift = (hour >= 7 && hour < 19) ? 'Day Shift' : 'Night Shift';
                    const showShiftChange = currentShift !== lastShift && idx > 0;
                    lastShift = currentShift;

                    // Check for critical note
                    const critical = isCriticalNote(row.note);

                    // Check if intervention needs response (JCI requirement)
                    const needsResponse = isInterventionNote(row.note) && !hasDocumentedResponse(row.note);

                    // Smart parsing for Assessment/Action/Response
                    const parts = {
                        assessment: row.note.match(/(?:Assessment|S:|Situation:)([^]*?)(?=(?:Action|A:|Response|R:|$))/i)?.[1] || "",
                        action: row.note.match(/(?:Action|A:|Intervention:)([^]*?)(?=(?:Response|R:|$))/i)?.[1] || "",
                        response: row.note.match(/(?:Response|R:|Outcome:)([^]*?$)/i)?.[1] || "",
                        general: ""
                    };
                    if (!parts.assessment && !parts.action && !parts.response) parts.general = row.note;

                    return (
                        <React.Fragment key={idx}>
                            {/* Shift Change Separator */}
                            {showShiftChange && (
                                <div className="flex items-center gap-3 my-3 ml-16">
                                    <div className="flex-1 h-px bg-slate-300"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                        {currentShift}
                                    </span>
                                    <div className="flex-1 h-px bg-slate-300"></div>
                                </div>
                            )}

                            {/* Tighter Timeline Row */}
                            <div className="flex gap-4 mb-5 relative">
                                {/* Time Zone - more compact */}
                                <div className="flex flex-col items-end w-14 flex-shrink-0 pt-1 relative z-10">
                                    <span className="text-sm font-bold text-slate-700 leading-none">{row.time}</span>
                                    <span className="text-[9px] text-slate-400 mt-0.5">Today</span>
                                    {/* Timeline Dot */}
                                    <div className={`absolute -right-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${critical ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                </div>

                                {/* Content Zone - improved styling */}
                                <div className={`flex-1 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${critical
                                    ? 'bg-red-50 border-red-200 border-l-4 border-l-red-500'
                                    : 'bg-white border-slate-200 border-l-4 border-l-blue-400'
                                    }`}>
                                    {/* Header Row */}
                                    <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100/80">
                                        <div className="flex items-center gap-2">
                                            {critical && <span className="animate-pulse">🚨</span>}
                                            <span className={`font-semibold text-xs uppercase tracking-wider ${critical ? 'text-red-800' : 'text-slate-600'}`}>
                                                {idx === 0 ? 'Admission' : critical ? 'Critical' : 'Progress'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">{row.initial}</span>
                                    </div>

                                    {/* Note Content */}
                                    <div className="px-4 py-3 space-y-2 text-sm text-slate-700 leading-relaxed">
                                        {parts.general && <div dangerouslySetInnerHTML={{ __html: parts.general.replace(/\n/g, '<br/>') }} />}

                                        {parts.assessment && (
                                            <div className="bg-slate-50/80 p-2 rounded text-xs border-l-2 border-slate-300">
                                                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">SITUATION</span>
                                                <div className="mt-1 text-slate-600" dangerouslySetInnerHTML={{ __html: parts.assessment.trim() }} />
                                            </div>
                                        )}
                                        {parts.action && (
                                            <div className="bg-blue-50/50 p-2 rounded text-xs border-l-2 border-blue-300">
                                                <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">ACTION</span>
                                                <div className="mt-1 text-slate-600" dangerouslySetInnerHTML={{ __html: parts.action.trim() }} />
                                            </div>
                                        )}
                                        {parts.response && (
                                            <div className="bg-green-50/50 p-2 rounded text-xs border-l-2 border-green-300">
                                                <span className="font-bold text-green-600 uppercase tracking-wider text-[10px]">RESPONSE</span>
                                                <div className="mt-1 text-slate-600" dangerouslySetInnerHTML={{ __html: parts.response.trim() }} />
                                            </div>
                                        )}

                                        {/* JCI Response Pending Alert */}
                                        {needsResponse && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1.5 flex items-center gap-2 text-xs">
                                                <span className="text-yellow-600">⚠</span>
                                                <span className="text-yellow-700 font-medium">Response pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    // 3. HELPER: Vitals - GOLD STANDARD with MEWS & MAP (Horizontal Grid Layout)
    const renderVitals = (data: any) => {
        const vitals = (item.content?.clinicalData as any)?._structuredVitals || DataSanitizer.sanitizeVitals(data);

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
                        const painValue = v.pain !== undefined ? v.pain : (v.painScore !== undefined ? v.painScore : null);

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

    // 4. HELPER: Labs Inbox - GOLD STANDARD with Critical Communication
    const renderLabs = (data: any) => {
        const labs = (item.content?.clinicalData as any)?._structuredLabs || DataSanitizer.sanitizeLabs(data);
        if (!labs || labs.length === 0) return <div className="p-4 text-slate-400 italic">No labs found.</div>;

        // Group labs by category (if category provided)
        const categories: Record<string, any[]> = { 'General': [] };
        labs.forEach((lab: any) => {
            const cat = lab.category || 'General';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(lab);
        });

        return (
            <div className="space-y-4">
                {Object.entries(categories).map(([cat, catLabs]) => (
                    <div key={cat} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        {/* Category Header */}
                        {Object.keys(categories).length > 1 && (
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                <span className="font-bold text-sm text-slate-600 uppercase tracking-wider">{cat}</span>
                            </div>
                        )}

                        {catLabs.map((lab: any, i: number) => {
                            // Smart status detection using ClinicalHelpers
                            const numericValue = parseFloat(lab.value || lab.result);
                            const labStatus = !isNaN(numericValue)
                                ? getLabStatus(lab.test || lab.name, numericValue)
                                : { status: 'normal', flag: lab.flag || '' };

                            const isCritical = labStatus.status === 'critLow' || labStatus.status === 'critHigh';
                            const isAbnormal = labStatus.status === 'low' || labStatus.status === 'high';

                            // Delta calculation (if previous value exists)
                            const delta = lab.previous
                                ? calculateDelta(numericValue, parseFloat(lab.previous))
                                : null;

                            const statusStyles: Record<string, string> = {
                                critLow: 'bg-red-50 border-l-4 border-red-500',
                                critHigh: 'bg-red-50 border-l-4 border-red-500',
                                low: 'bg-yellow-50/50 border-l-4 border-yellow-400',
                                high: 'bg-orange-50/50 border-l-4 border-orange-400',
                                normal: ''
                            };

                            return (
                                <div key={i} className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${statusStyles[labStatus.status] || ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                {lab.test || lab.name}
                                                {delta && delta.significant && (
                                                    <span className={`text-[10px] px-1 py-0.5 rounded font-bold ${delta.direction === 'up' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        ⚡ {delta.direction === 'up' ? '+' : ''}{delta.percent}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                                                Ref: {lab.ref || lab.reference || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold text-lg flex items-center gap-1 justify-end ${isCritical ? 'text-red-700' : isAbnormal ? 'text-orange-600' : 'text-slate-900'}`}>
                                                {lab.value || lab.result}
                                                {labStatus.flag && (
                                                    <span className={`text-[10px] px-1 rounded transform -translate-y-1 ${labStatus.flag.includes('!')
                                                        ? 'bg-red-600 text-white font-black animate-pulse'
                                                        : labStatus.flag === 'H'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {labStatus.flag}
                                                    </span>
                                                )}
                                                {delta && delta.direction !== 'stable' && (
                                                    <span className={`text-xs ${delta.direction === 'up' ? 'text-red-500' : 'text-blue-500'}`}>
                                                        {delta.direction === 'up' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Critical Value Communication Footer (CAP/CLIA requirement) */}
                                    {isCritical && (
                                        <div className="mt-2 pt-2 border-t border-red-200 text-xs text-red-700 font-medium flex items-center gap-1">
                                            <span>📞</span>
                                            <span>Critical value reported to Dr. {item.content?.clinicalData?.patientInfo?.physician || 'Provider'} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // 5. HELPER: Orders Grid - GOLD STANDARD with Tall Man & High-Alert
    const renderOrders = (data: any) => {
        const orders = (item.content?.clinicalData as any)?._structuredOrders || DataSanitizer.sanitizeOrders(data);
        if (!orders || orders.length === 0) return <div className="p-4 text-slate-400 italic">No active orders.</div>;

        // Status-based styling
        const statusStyles: Record<string, { border: string; badge: string; bgBadge: string }> = {
            active: { border: 'border-green-500', badge: 'ACTIVE', bgBadge: 'bg-green-50 text-green-700' },
            hold: { border: 'border-orange-500', badge: 'HOLD', bgBadge: 'bg-orange-50 text-orange-700' },
            discontinued: { border: 'border-slate-400', badge: 'D/C', bgBadge: 'bg-slate-100 text-slate-500' },
            stat: { border: 'border-red-500', badge: 'STAT', bgBadge: 'bg-red-50 text-red-700 animate-pulse' }
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((ord: any, i: number) => {
                    const drugName = ord.drug || ord.name || 'Unknown';
                    const tallManName = applyTallManLettering(drugName);
                    const isHighAlert = isHighAlertMedication(drugName);
                    const status = (ord.status || 'active').toLowerCase();
                    const style = statusStyles[status] || statusStyles.active;
                    const isDiscontinued = status === 'discontinued';

                    return (
                        <div key={i} className={`bg-white border-l-4 ${style.border} rounded-r-lg shadow-sm p-4 relative overflow-hidden group hover:shadow-md transition-all ${isDiscontinued ? 'opacity-60' : ''}`}>
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 text-[10px] font-bold px-2 py-1 rounded-bl ${style.bgBadge}`}>
                                {style.badge}
                            </div>

                            {/* High Alert Badge */}
                            {isHighAlert && (
                                <div className="absolute top-0 left-4 -translate-y-1/2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                    💊 HIGH-ALERT
                                </div>
                            )}

                            {/* Drug Name with Tall Man Lettering */}
                            <div className={`font-bold text-lg mb-1 mt-2 ${isDiscontinued ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                {tallManName !== drugName ? (
                                    <span dangerouslySetInnerHTML={{
                                        __html: tallManName.replace(/([A-Z]+)/g, '<span class="text-red-600 font-black">$1</span>')
                                    }} />
                                ) : (
                                    drugName
                                )}
                            </div>

                            {/* Dose/Route/Freq */}
                            <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-3 font-medium">
                                <span className="bg-slate-100 px-2 py-0.5 rounded">{ord.dose}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded italic">{ord.route}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded">{ord.freq || ord.frequency}</span>
                            </div>

                            {/* PRN Indication (required by ISMP) */}
                            <div className="text-xs text-slate-400 border-t border-slate-100 pt-2 mt-2">
                                Indication: <span className="text-slate-600">{ord.indication || 'Standard Care'}</span>
                            </div>

                            {/* Hold Reason */}
                            {status === 'hold' && ord.holdReason && (
                                <div className="mt-2 text-xs text-orange-600 font-medium">
                                    ⚠ Hold Reason: {ord.holdReason}
                                </div>
                            )}

                            {/* IV Compatibility Warning (placeholder) */}
                            {ord.route && ord.route.toLowerCase().includes('iv') && isHighAlert && (
                                <div className="mt-2 text-[10px] text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                                    ⚠ Verify Y-site compatibility before administration
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // 6. HELPER: Radiology Paper - GOLD STANDARD with Critical Finding Detection
    const renderRadiology = (data: any) => {
        // Check if there's actually a report
        const hasReport = data && typeof data === 'string' && data.trim().length > 20 && data.trim() !== "No report available.";

        // Empty State: No imaging studies
        if (!hasReport) {
            return (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-lg p-8 text-center shadow-sm">
                        <div className="text-6xl mb-4 opacity-60">🩻</div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Imaging Studies Available</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            There are no radiology reports on file for this encounter.
                            Imaging studies may not have been ordered, or results are still pending.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                📋 Check Orders Tab
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Parse actual report
        const text = data.trim();
        const hasCritical = hasCriticalRadiologyFinding(text);

        // Try to extract impression section (only if report contains real content)
        const impressionMatch = text.match(/(?:IMPRESSION|CONCLUSION|SUMMARY)[:.]?\s*([^]*?)(?=$|RECOMMENDATIONS?|COMPARISON)/i);
        const impression = impressionMatch ? impressionMatch[1].trim() : null;

        // Extract comparison if present
        const comparisonMatch = text.match(/(?:COMPARISON|COMPARED? TO|PRIOR)[:.]?\s*([^\n]+)/i);
        const comparison = comparisonMatch ? comparisonMatch[1].trim() : null;

        // Extract exam type
        const examMatch = text.match(/(?:EXAM|STUDY|PROCEDURE)[:.]?\s*([^\n]+)/i);
        const examType = examMatch ? examMatch[1].trim() : "Diagnostic Imaging";

        return (
            <div className="max-w-2xl mx-auto">
                {/* Parchment-style paper simulation */}
                <div className="bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 shadow-lg border border-amber-200/60 p-8 min-h-[400px] relative"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4b896\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>

                    {/* Critical Finding Stamp */}
                    {hasCritical && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded shadow-lg animate-pulse flex items-center gap-2 z-10">
                            <span>🚨</span> CRITICAL FINDING
                        </div>
                    )}

                    {/* Letterhead */}
                    <div className={`text-center border-b-2 pb-4 mb-6 ${hasCritical ? 'border-red-600' : 'border-slate-700'}`}>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Medical Center</div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide">DEPARTMENT OF RADIOLOGY</h2>
                        <div className="flex justify-between text-xs text-slate-500 mt-3 font-mono">
                            <span>MRN: {item.id.slice(0, 8).toUpperCase()}</span>
                            <span>Exam: {examType}</span>
                            <span>Date: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Comparison (if present) */}
                    {comparison && (
                        <div className="mb-4 text-xs text-slate-600 italic bg-slate-50/80 p-2 rounded border border-slate-200">
                            <span className="font-bold text-slate-700 not-italic">COMPARISON: </span>{comparison}
                        </div>
                    )}

                    {/* Findings Section Header */}
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                        FINDINGS
                    </div>

                    {/* Report Body */}
                    <div className="font-serif text-slate-800 text-sm leading-relaxed mb-6 pl-2"
                        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />

                    {/* Impression Box (only if found in report) */}
                    {impression && (
                        <div className={`p-4 rounded-lg border-2 ${hasCritical ? 'bg-red-50 border-red-300' : 'bg-blue-50/80 border-blue-200'}`}>
                            <div className={`text-xs font-bold uppercase mb-2 flex items-center gap-2 ${hasCritical ? 'text-red-800' : 'text-blue-800'}`}>
                                <span>📋</span> IMPRESSION
                            </div>
                            <div className={`font-medium text-sm ${hasCritical ? 'text-red-900 font-bold' : 'text-blue-900'}`}>
                                {impression}
                            </div>
                        </div>
                    )}

                    {/* Critical Finding Communication (TJC requirement) */}
                    {hasCritical && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 font-medium">
                            <div className="flex items-center gap-2">
                                <span>📞</span>
                                <span>
                                    CRITICAL FINDING verbally communicated to Dr. {item.content?.clinicalData?.patientInfo?.physician || 'Attending Provider'}
                                    at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Signature Block */}
                    <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-500 flex justify-between items-end">
                        <div>
                            <div className="font-mono text-slate-400">Electronically Signed:</div>
                            <div className="font-semibold text-slate-700 text-sm mt-1">John Smith, MD</div>
                            <div className="text-slate-400">Board-Certified Radiologist</div>
                        </div>
                        <div className="text-right font-mono text-[10px] text-slate-400">
                            <div>Dictated: {new Date().toLocaleString()}</div>
                            <div>Verified: {new Date().toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 7. HELPER: History & Physical (Accordion Stack)
    const renderHistoryPhysical = (data: any) => {
        const history = (item.content?.clinicalData as any)?._structuredHistoryPhysical || DataSanitizer.sanitizeHistoryPhysical(data);
        if (!history) return <div className="p-4 text-slate-400 italic">No History & Physical available.</div>;

        return (
            <div className="space-y-3 font-sans">
                {history.sections.map((section: any, idx: number) => (
                    <details key={idx} className="group bg-white border border-slate-200 rounded-lg overflow-hidden open:shadow-md transition-all" open={idx === 0}>
                        <summary className="bg-slate-50 text-slate-800 px-4 py-3 font-bold cursor-pointer hover:bg-slate-100 list-none flex justify-between items-center select-none border-b border-transparent group-open:border-slate-200">
                            <span className="text-sm uppercase tracking-wider text-blue-900">{section.title}</span>
                            <span className="transform group-open:rotate-180 transition-transform text-slate-400 text-xs">▼</span>
                        </summary>
                        <div className="p-4 text-slate-700 text-sm leading-relaxed bg-white">
                            {section.content.map((paragraph: string, pIdx: number) => (
                                <p key={pIdx} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br/>') }} />
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        );
    };

    const screens = item.content?.structure?.screens || [];


    const isCaseStudy = screens.length > 0;
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [stressMetrics, setStressMetrics] = useState<InteractionData>({ changeCount: 0, timeSpent: 0, peerAvg: item.peerAverageTime || 60 });
    const [elapsedTime, setElapsedTime] = useState(0);

    // Live Timer for Pace Analysis


    const rawCurrentQ = useMemo(() => {
        if (isCaseStudy) {
            const screen = screens[currentScreenIndex];
            // If screen doesn't have its own clinicalData, provide the parent one
            return {
                ...screen,
                clinicalData: screen.clinicalData || item.content.clinicalData
            };
        }
        // For single items, merge sibling rationale/metadata into the structure
        return {
            ...item.content.structure,
            clinicalData: item.content.clinicalData, // CRITICAL: Ensure clinical data (patientInfo, etc) is preserved
            type: item.type || (item.content as any).type,
            rationale: item.content.rationale,
            metadata: {
                ...(item.content as any).metadata,
                ...item.content.structure?.metadata
            }
        };
    }, [isCaseStudy, screens, currentScreenIndex, item.content, item.type]);

    // Normalize ONCE to ensure IDs and structure are consistent between Renderer and Rationale
    const currentQ = useMemo(() => normalizeConfig(rawCurrentQ), [rawCurrentQ]);

    const qKey = currentQ?.id || `q_${currentScreenIndex}`;
    const isLastScreen = isCaseStudy ? currentScreenIndex === screens.length - 1 : true;

    const [activeTab, setActiveTab] = useState('notes');
    const [leftPanelWidth, setLeftPanelWidth] = useState(35);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 70) {
            setLeftPanelWidth(newWidth);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            // Disable text selection/iframe pointer events while dragging if needed
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);
    const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]); // Track flagged questions

    const toggleFlag = (index: number) => {
        setFlaggedIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };
    const [isRationaleOpen, setIsRationaleOpen] = useState(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submissionState, setSubmissionState] = useState<Record<string, boolean>>({});

    const currentAnswer = answers[qKey];
    const isCurrentSubmitted = submissionState[qKey] || false;

    // Live Timer for Pace Analysis (Moved here to access isCurrentSubmitted)
    useEffect(() => {
        if (isCurrentSubmitted) return;

        setElapsedTime(0);
        setStressMetrics({ changeCount: 0, timeSpent: 0, peerAvg: 0 }); // Reset Focus Monitor per item
        const start = Date.now();
        const timer = setInterval(() => {
            const seconds = Math.round((Date.now() - start) / 1000);
            setElapsedTime(seconds);
        }, 1000);
        return () => clearInterval(timer);
    }, [currentScreenIndex, item.id, isCurrentSubmitted]);

    const [leftFontSize, setLeftFontSize] = useState(1);
    const [rightFontSize, setRightFontSize] = useState(1);
    const [mode, setMode] = useState<'tutor' | 'exam'>('tutor');

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Split Screen Resizer State

    // --- STRESS ENGINE: FOCUS TRACKER ---
    // We rely mostly on 'changeCount' (Answer Reversals) which is updated in setAnswers callback.
    // Logic: Frequent changing = Indecision.

    // --- EXAM MODE: COUNTDOWN TIMER ---
    const [timeLeft, setTimeLeft] = useState(300); // 5 Minutes
    useEffect(() => {
        if (mode === 'exam' && !isCurrentSubmitted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (mode === 'tutor') {
            setTimeLeft(300); // Reset for Tutor
        }
    }, [mode, isCurrentSubmitted, timeLeft]);

    const getFontSize = (baseRem: number, level: number) => {
        return `${baseRem + (level * 0.1)}rem`;
    };

    const leftContentStyle = {
        padding: '24px 32px',
        fontSize: getFontSize(1.0, leftFontSize),
        zoom: leftFontSize as any, // Fix: Ensure zoom affects Tailwind components
        lineHeight: 1.7,
        color: '#334155',
        background: 'white',
        minHeight: '100%'
    };

    // --- ANALYTICS INTEGRATION ---
    const sessionAnalytics = useMemo(() => {
        const history: SessionHistoryItem[] = [];
        const rawScreens = isCaseStudy ? screens : [currentQ];

        // Process all submissions to build history
        rawScreens.forEach((rawQ: any, idx: number) => {
            const q = normalizeConfig(rawQ);
            const key = q?.id || `q_${idx}`;
            if (submissionState[key]) {
                const nType = (q.type || '').toLowerCase().replace(/_/g, '-');
                // Re-construct correct answer (same logic as before)
                let correctObj: any = null;
                if (nType === 'matrix') {
                    correctObj = {};
                    if (Array.isArray(q.rows)) q.rows.forEach((r: any) => correctObj[r.id] = r.correctColumnId || r.correctColumn || r.correctAnswer);
                } else if (nType.includes('multiple-response') || nType === 'sata') {
                    correctObj = Array.isArray(q.options) ? q.options.filter((o: any) => o.isCorrect).map((o: any) => o.id) : [];
                } else if (nType === 'highlight') {
                    correctObj = q.correct || [];
                } else if (nType === 'bow-tie') {
                    correctObj = {
                        actions: q.actions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                        condition: q.conditions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                        parameters: q.parameters?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || []
                    };
                } else if (nType.includes('cloze') || nType === 'dropdown') {
                    correctObj = {};
                    if (q.dropdowns) {
                        q.dropdowns.forEach((d: any) => {
                            if (d.correctOptionId) correctObj[d.id] = d.correctOptionId;
                        });
                    }
                    if (q.sentences) {
                        q.sentences.forEach((s: any) => {
                            if (s.dropdowns) {
                                s.dropdowns.forEach((d: any) => {
                                    if (d.correctOptionId) correctObj[d.id] = d.correctOptionId;
                                });
                            }
                        });
                    }
                } else if (nType.includes('calculation') || nType.includes('numeric')) {
                    // Calculation items - extract correct value
                    correctObj = q.correctValue || q.structure?.correctValue || q.answer;
                    if (q.acceptableRange) {
                        correctObj = { value: correctObj, range: q.acceptableRange };
                    }
                } else {
                    const cOpt = q.options?.find((o: any) => o.isCorrect);
                    if (cOpt) correctObj = cOpt.id;
                    if (!correctObj && nType.includes('ordered-response')) {
                        correctObj = q.orderedOptions?.map((o: any) => o.id) || q.options?.map((o: any) => o.id);
                    }
                }
                const result = CognitiveAnalyticsEngine.calculateScore(q.type, answers[key], correctObj);

                // Fallback Metadata with Zero Error Fill System
                let effectiveMetadata = q.metadata;
                if (!effectiveMetadata || !effectiveMetadata.cjmmStep) {
                    // Infer CJMM Step from Item Type (Zero Error Fill)
                    const inferCjmmStep = (type: string, idx: number): string => {
                        const t = (type || '').toLowerCase();
                        if (t.includes('highlight')) return 'Recognize Cues';
                        if (t.includes('trend') || t.includes('matrix')) return 'Analyze Cues';
                        if (t.includes('ordered') || t.includes('drag')) return 'Prioritize Hypotheses';
                        if (t.includes('bow') || t.includes('cloze') || t.includes('dropdown')) return 'Generate Solutions';
                        if (t.includes('multiple') || t.includes('sata') || t.includes('calculation') || t.includes('numeric')) return 'Take Action';
                        if (t.includes('single') || t.includes('choice')) return 'Evaluate Outcomes';
                        // Case Study Fallback by Position
                        const cjmmSteps = ['Recognize Cues', 'Analyze Cues', 'Prioritize Hypotheses', 'Generate Solutions', 'Take Action', 'Evaluate Outcomes'];
                        return cjmmSteps[idx % 6] || 'Recognize Cues';
                    };

                    effectiveMetadata = {
                        ...(effectiveMetadata || {}),
                        clientNeeds: effectiveMetadata?.clientNeeds || 'Physiological Integrity',
                        cjmmStep: inferCjmmStep(q.type, idx),
                        difficulty: effectiveMetadata?.difficulty || 'Medium'
                    };
                }

                history.push({
                    isCorrect: result.isCorrect,
                    score: result.score,
                    maxScore: result.maxScore,
                    metadata: effectiveMetadata
                });
            }
        });

        // Use new aggregators
        const passProbability = CognitiveAnalyticsEngine.calculatePassProbability(history);
        const clientNeeds = CognitiveAnalyticsEngine.getClientNeedsStats(history);
        const cjmmGrid = CognitiveAnalyticsEngine.getCJMMGrid(history);

        // Calculate CURRENT item result separately for the widget
        let currentResult = null;
        const currentKey = currentQ?.id || `q_${isCaseStudy ? currentScreenIndex : 0}`;
        if (submissionState[currentKey]) {
            const qType = (currentQ.type || '').toLowerCase().replace(/_/g, '-');
            let correctObj: any = null;
            if (qType === 'matrix') {
                correctObj = {};
                if (Array.isArray(currentQ.rows)) currentQ.rows.forEach((r: any) => correctObj[r.id] = r.correctColumnId || r.correctColumn || r.correctAnswer);
            } else if (qType.includes('multiple-response') || qType === 'sata') {
                correctObj = Array.isArray(currentQ.options) ? currentQ.options.filter((o: any) => o.isCorrect).map((o: any) => o.id) : [];
            } else if (qType === 'highlight') {
                correctObj = currentQ.correct || [];
            } else if (qType.includes('cloze') || qType === 'dropdown') {
                correctObj = {};

                const processDropdown = (d: any) => {
                    if (!d) return;

                    // 1. Normalize Options (Match Renderer Logic)
                    const normOptions = (d.options || []).map((o: any, i: number) => {
                        if (typeof o === 'string') return { id: o, text: o, isCorrect: false };
                        return {
                            id: o.id || `opt-${i}`,
                            text: o.text || o.label || o.value || o,
                            isCorrect: !!o.isCorrect
                        };
                    });

                    // 2. Resolve Correct ID
                    let cid = d.correctOptionId;
                    let foundMatch = false;

                    // Strategy A: Explicit Key
                    if (cid) {
                        // Check strict ID match first
                        const idMatch = normOptions.find((o: any) => o.id === cid);
                        if (idMatch) {
                            cid = idMatch.id;
                            foundMatch = true;
                        } else {
                            // Check Fuzzy Text Match
                            const textMatch = normOptions.find((o: any) =>
                                String(o.text).toLowerCase().trim() === String(cid).toLowerCase().trim()
                            );
                            if (textMatch) {
                                cid = textMatch.id;
                                foundMatch = true;
                            }
                        }
                    }

                    // Strategy B: Boolean Flag
                    if (!foundMatch) {
                        const boolMatch = normOptions.find((o: any) => o.isCorrect);
                        if (boolMatch) {
                            cid = boolMatch.id;
                            foundMatch = true;
                        }
                    }

                    if (cid) correctObj[d.id] = cid;
                };

                // Handle root and nested
                if (currentQ.dropdowns) currentQ.dropdowns.forEach(processDropdown);
                if (currentQ.sentences) {
                    currentQ.sentences.forEach((s: any) => {
                        if (s.dropdowns) s.dropdowns.forEach(processDropdown);
                    });
                }
            } else if (currentQ.type === 'bow-tie') {
                correctObj = {
                    actions: currentQ.actions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                    condition: currentQ.conditions?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || [],
                    parameters: currentQ.parameters?.pool?.filter((x: any) => x.isCorrect).map((x: any) => x.id) || []
                };
            } else if (currentQ.type === 'cloze' || currentQ.type === 'drop-cloze' || currentQ.type === 'dropdown') {
                correctObj = {};
                // Handle root dropdowns
                if (currentQ.dropdowns) {
                    currentQ.dropdowns.forEach((d: any) => {
                        if (d.correctOptionId) correctObj[d.id] = d.correctOptionId;
                    });
                }
                // Handle nested sentences
                if (currentQ.sentences) {
                    currentQ.sentences.forEach((s: any) => {
                        if (s.dropdowns) {
                            s.dropdowns.forEach((d: any) => {
                                if (d.correctOptionId) correctObj[d.id] = d.correctOptionId;
                            });
                        }
                    });
                }
            } else if (qType.includes('calculation') || qType.includes('numeric')) {
                // Calculation items - extract correct value
                correctObj = currentQ.correctValue || currentQ.structure?.correctValue || currentQ.answer;
                if (currentQ.acceptableRange) {
                    correctObj = { value: correctObj, range: currentQ.acceptableRange };
                }
            } else {
                const cOpt = currentQ.options?.find((o: any) => o.isCorrect);
                if (cOpt) correctObj = cOpt.id;
                if (!correctObj && currentQ.type === 'ordered-response') {
                    correctObj = currentQ.orderedOptions?.map((o: any) => o.id) || currentQ.options?.map((o: any) => o.id);
                }
            }
            currentResult = {
                ...CognitiveAnalyticsEngine.calculateScore(currentQ.type, answers[currentKey], correctObj),
                userAns: answers[currentKey] // Attach actual user input for Rationale/Feedback visualization
            };
        }

        return {
            passProbability,
            clientNeeds,
            cjmmGrid,
            currentResult,
            hasData: history.length > 0
        };

    }, [submissionState, answers, screens, currentQ, isCaseStudy, currentScreenIndex]);


    const handleSubmit = () => {
        setSubmissionState(prev => ({ ...prev, [qKey]: true }));
        // Auto-open rationale modal after brief delay to show on-screen feedback first
        setTimeout(() => setIsRationaleOpen(true), 800);
    };

    const handleNext = () => {
        if (currentScreenIndex < screens.length - 1) {
            setCurrentScreenIndex(p => p + 1);
        }
    };

    const handlePrev = () => {
        if (currentScreenIndex > 0) {
            setCurrentScreenIndex(p => p - 1);
        }
    };

    // const progressPercentage removed



    const finalConfig = useMemo(() => {
        if (!currentQ) return null;
        if (currentQ.type === item.type) return currentQ;
        return { ...currentQ, type: currentQ.type || item.type };
    }, [currentQ, item.type]);

    // Ratio Logic: Calculate Base Item Options Count
    const interactionBase = useMemo(() => {
        const q = finalConfig;
        if (!q) return 4; // Default

        // 1. Standard Options (Single/Multi/Ordered)
        if (q.options) return q.options.length;
        if (q.orderedOptions) return q.orderedOptions.length;

        // 2. Bow Tie
        if (q.type === 'bow-tie') {
            return (q.actions?.pool?.length || 0) + (q.conditions?.pool?.length || 0) + (q.parameters?.pool?.length || 0);
        }

        // 3. Matrix
        if (q.rows && q.columns) return q.rows.length * q.columns.length;

        // 4. Dropdowns / Cloze
        if (q.dropdowns) return q.dropdowns.reduce((acc: number, d: any) => acc + (d.options?.length || 0), 0);
        if (q.sentences) {
            return q.sentences.reduce((acc: number, s: any) => acc + (s.dropdowns?.reduce((dAcc: number, d: any) => dAcc + (d.options?.length || 0), 0) || 0), 0);
        }

        // 5. Highlight (Count highlightable tokens)
        if (q.type === 'highlight' && typeof q.text === 'string') {
            const matches = q.text.match(/id=['"]h/g);
            return matches ? matches.length : 6;
        }

        return 4;
    }, [finalConfig]);

    return (
        <>
            <style>{`
                @keyframes fadeInSlide {
                    from { opacity: 0; transform: translateX(8px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .tab-animate {
                    animation: fadeInSlide 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    height: 100%; /* Ensure it fills container */
                }
                .glass-header {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
                }
            `}</style>
            <div style={{ position: 'fixed', inset: 0, background: '#F3F4F6', backgroundImage: 'radial-gradient(circle at 50% 0%, #F9FAFB, #F3F4F6)', zIndex: 9999, display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
                <div className="glass-header" style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', zIndex: 50 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e3a8a', letterSpacing: '-0.02em' }}>NCLEX-RN Simulator</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>Item ID: {item.id ? item.id.slice(0, 8) : '-----'}</div>
                        {mode === 'exam' && (
                            <div style={{ marginLeft: 16, fontSize: '1rem', fontWeight: 800, color: timeLeft < 60 ? '#f43f5e' : '#334155', display: 'flex', alignItems: 'center', gap: 6, background: timeLeft < 60 ? '#fecdd3' : 'transparent', padding: '4px 12px', borderRadius: 8 }}>
                                <span>⏱</span>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                        <button onClick={onClose} style={{ padding: '8px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9rem', transition: 'all 0.2s' }}>Pause / Exit</button>
                        <ToolSuite />
                    </div>
                </div>

                <div className="split-layout-container" style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: isMobile ? '0' : '16px', gap: isMobile ? '0' : '16px' }}>
                    <div className="ehr-panel" style={{
                        width: isMobile ? '0px' : `${leftPanelWidth}%`,
                        display: isMobile ? 'none' : 'flex',
                        flexDirection: 'column',
                        // borderRight: '1px solid #cbd5e1', // REMOVED for Card Look
                        background: 'white', // Gold Standard Check: Main Panels White
                        borderRadius: isMobile ? '0' : '16px',
                        boxShadow: isMobile ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.5)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '12px 0 12px 0', textAlign: 'center' }}>
                            <FloatingPatientHeader
                                patientName={item.content.clinicalData?.patientInfo?.name || "Client, Generic"}
                                age={item.content.clinicalData?.patientInfo?.age || 35}
                                gender={item.content.clinicalData?.patientInfo?.gender || "M"}
                                codeStatus={item.content.clinicalData?.patientInfo?.codeStatus || "FULL CODE"}
                            />
                        </div>
                        <PatientHeader data={item.content.clinicalData?.patientInfo} />
                        <CaseTabSystem activeTab={activeTab} onTabChange={setActiveTab} />
                        <div style={{ flex: 1, overflowY: 'auto', background: 'white' }}>
                            <div style={leftContentStyle} className="tab-animate">
                                {activeTab === 'notes' && (
                                    <div className="p-4 bg-slate-50 min-h-full">
                                        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-2">
                                            <h3 className="text-xl font-bold text-slate-800">Nurses Notes</h3>
                                            <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">Live Feed</span>
                                        </div>
                                        {renderNursesNotes(item.content.clinicalData?.history)}
                                    </div>
                                )}
                                {activeTab === 'history' && (
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-6">History & Physical</h3>
                                        {renderHistoryPhysical(item.content.clinicalData?.historyPhysical)}
                                    </div>
                                )}
                                {activeTab === 'vitals' && (
                                    <div className="p-6 bg-slate-50">
                                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">Vital Signs Trend</h3>
                                        {renderVitals(item.content.clinicalData?.vitals)}
                                        <div className="mt-4 text-center">
                                            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">← Scroll to see earlier vitals →</span>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'labs' && (
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-slate-800">Laboratory Results</h3>
                                            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Criticals Highlighted</span>
                                        </div>
                                        {renderLabs(item.content.clinicalData?.labs)}
                                    </div>
                                )}
                                {activeTab === 'orders' && (
                                    <div className="p-6 bg-slate-50">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6">Medical Orders</h3>
                                        {renderOrders(item.content.clinicalData?.orders)}
                                    </div>
                                )}
                                {activeTab === 'rad' && (
                                    <div className="p-6 bg-gray-200 min-h-full">
                                        {renderRadiology(item.content.clinicalData?.radiology)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="flex items-center gap-4">
                                <ProfessionalFontControl level={leftFontSize} setLevel={setLeftFontSize} />
                                {/* Mode Toggle */}
                                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button
                                        onClick={() => setMode('tutor')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'tutor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        TUTOR
                                    </button>
                                    <button
                                        onClick={() => setMode('exam')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'exam' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        EXAM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resizer Handle */}
                    {!isMobile && (
                        <div
                            onMouseDown={() => setIsResizing(true)}
                            style={{
                                width: '12px',
                                margin: '0 -6px', // Negative margin to overlap slightly or center
                                cursor: 'col-resize',
                                zIndex: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'transparent' // Invisible hit area
                            }}
                        >
                            <div style={{
                                width: '2px', // Visible line
                                height: '100%',
                                background: isResizing ? '#3b82f6' : '#e2e8f0', // Blue when resizing, Grey usually
                                transition: 'background 0.2s, width 0.2s',
                                boxShadow: isResizing ? '0 0 0 1px rgba(59, 130, 246, 0.5)' : 'none'
                            }} />
                        </div>
                    )}

                    <div className="question-section" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'white',
                        overflow: 'hidden',
                        borderRadius: isMobile ? '0' : '16px',
                        boxShadow: isMobile ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.5)'
                    }}>
                        {isCaseStudy && (
                            <div style={{ width: '100%', height: '8px', display: 'flex', gap: '2px', background: '#f1f5f9' }}>
                                {screens.map((_: any, idx: number) => {
                                    let bg = '#cbd5e1'; // Unseen
                                    if (idx < currentScreenIndex) bg = '#10b981'; // Completed (Green)
                                    if (idx === currentScreenIndex) bg = '#3b82f6'; // Current (Blue)
                                    if (flaggedIndices.includes(idx)) bg = '#f97316'; // Flagged (Orange)
                                    return (
                                        <div key={idx} style={{
                                            flex: 1,
                                            background: bg,
                                            transition: 'all 0.3s ease',
                                            borderRadius: '1px'
                                        }} />
                                    );
                                })}
                            </div>
                        )}
                        <div style={{
                            padding: '16px 24px',
                            background: '#f0f9ff',
                            borderBottom: '2px solid #bae6fd',
                            flexShrink: 0,
                            zIndex: 5
                        }}>
                            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                                <div>
                                    {isCaseStudy && (
                                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Question {currentScreenIndex + 1} of {screens.length}
                                            </div>
                                            <button
                                                onClick={() => toggleFlag(currentScreenIndex)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    color: flaggedIndices.includes(currentScreenIndex) ? '#f97316' : '#94a3b8',
                                                    fontWeight: 600, fontSize: '0.85rem'
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill={flaggedIndices.includes(currentScreenIndex) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                                    <line x1="4" y1="22" x2="4" y2="15"></line>
                                                </svg>
                                                {flaggedIndices.includes(currentScreenIndex) ? "Marked" : "Mark for Review"}
                                            </button>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            minWidth: '40px', height: '40px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            border: '2px solid #0ea5e9',
                                            color: '#0ea5e9',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 800, fontSize: '1.2rem',
                                            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                                        }}>
                                            ?
                                        </div>
                                        <div style={{
                                            fontSize: getFontSize(1.15, rightFontSize),
                                            lineHeight: 1.6,
                                            color: '#0f172a',
                                            fontWeight: 500,
                                            fontFamily: 'Inter, sans-serif'
                                        }}>
                                            {currentQ?.prompt || item.content.structure?.prompt}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
                            <div style={{ maxWidth: '850px', margin: '0 auto' }}>

                                {finalConfig ? renderQuestion(
                                    finalConfig,
                                    'student',
                                    undefined,
                                    currentAnswer,
                                    (ans) => {
                                        // Smart Indecision Tracking
                                        // 1. Single Select: Changing an existing answer = Indecision (+1)
                                        // 2. Multi Select (SATA): UN-checking an option = Indecision (+1). Adding is valid.
                                        let isIndecision = false;
                                        const prev = currentAnswer;

                                        if (Array.isArray(ans) && Array.isArray(prev)) {
                                            // SATA: If count dropped, they removed an answer (Second guessing)
                                            if (ans.length < prev.length) isIndecision = true;
                                        } else if (prev && prev !== ans && !Array.isArray(ans)) {
                                            // Single: Changed mind
                                            isIndecision = true;
                                        }

                                        setAnswers(p => ({ ...p, [qKey]: ans }));
                                        if (isIndecision) {
                                            setStressMetrics(s => ({ ...s, changeCount: s.changeCount + 1 }));
                                        }
                                    },
                                    isCurrentSubmitted,
                                    true,
                                    rightFontSize
                                ) : (
                                    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #e2e8f0' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#334155' }}>Question Content Missing</h3>
                                        <p>Unable to load the content for Question {currentScreenIndex + 1}.</p>
                                        <div style={{ fontSize: '0.8rem', marginTop: '12px', fontFamily: 'monospace' }}>ID: {item.id} | Index: {currentScreenIndex}</div>
                                    </div>
                                )}

                                {currentQ && (
                                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {isCurrentSubmitted && (
                                            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#10b981', border: '1px solid #059669' }}></span>
                                                    <span>Correct</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#ef4444', border: '1px solid #b91c1c' }}></span>
                                                    <span>Incorrect</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#f59e0b', border: '1px solid #b45309' }}></span>
                                                    <span>Missed</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ padding: '48px 0 64px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                    {/* MOVED TO FOOTER: FloatingControls */}
                                    {/* <FloatingControls ... /> */}
                                    {/* MOVED TO FOOTER: RationaleFab */}
                                    {/* <RationaleFab ... /> */}
                                </div>
                            </div>
                        </div>
                        <div style={{
                            padding: '12px 24px',
                            background: 'white',
                            borderTop: '1px solid #e2e8f0',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)',
                            zIndex: 10
                        }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <ProfessionalFontControl level={rightFontSize} setLevel={setRightFontSize} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                                <FloatingControls
                                    onPrev={handlePrev}
                                    onNext={isLastScreen ? onClose : handleNext}
                                    onSubmit={handleSubmit}
                                    canPrev={currentScreenIndex > 0}
                                    canNext={isCurrentSubmitted}
                                    canSubmit={!!currentQ && !isCurrentSubmitted}
                                    isSubmitted={isCurrentSubmitted}
                                    isLast={isLastScreen}
                                    style={{ boxShadow: 'none', background: 'transparent', border: 'none', padding: 0 }}
                                />
                                {isCurrentSubmitted && mode !== 'exam' && (
                                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <style>{`
                                            @keyframes ripple-glow {
                                                0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                                                70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
                                                100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                                            }
                                        `}</style>

                                        <button
                                            onClick={() => setIsRationaleOpen(true)}
                                            style={{
                                                width: '52px',
                                                height: '52px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                                border: '3px solid #F59E0B',
                                                color: '#92400E',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.4)',
                                                transition: 'all 0.3s ease',
                                                animation: 'ripple-glow 2s infinite'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(245, 158, 11, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(245, 158, 11, 0.4)';
                                            }}
                                            title="View Clinical Reasoning"
                                        >
                                            <span style={{
                                                fontFamily: 'Georgia, serif',
                                                fontSize: '28px',
                                                fontWeight: 700,
                                                fontStyle: 'italic'
                                            }}>
                                                i
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div></div> {/* Right spacer */}
                        </div>
                    </div>

                    {!isMobile && (
                        <div className="w-[300px] bg-slate-900 border-l border-slate-700 flex flex-col shadow-2xl z-20">
                            {/* Bio-statistical Background Pattern */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative z-10">
                                <ExpertDashboard
                                    passProbability={sessionAnalytics.passProbability}
                                    clientNeeds={sessionAnalytics.clientNeeds}
                                    cjmmGrid={sessionAnalytics.cjmmGrid}
                                    currentItemResult={sessionAnalytics.currentResult}
                                    pace={{
                                        userTime: elapsedTime,
                                        peerTime: item.peerAverageTime || 60
                                    }}
                                    stress={stressMetrics}
                                    mode={mode}
                                    interactionBase={interactionBase}
                                />
                            </div>
                        </div>
                    )}

                </div>

                <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Clinical Record">
                    <PatientHeader data={item.content.clinicalData?.patientInfo} />
                    <CaseTabSystem activeTab={activeTab} onTabChange={setActiveTab} />
                </MobileDrawer>

                {isMobile && !isDrawerOpen && (
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        style={{ position: 'fixed', bottom: '80px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', background: '#0284c7', color: 'white', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <NoteIcon />
                    </button>
                )}

            </div>

            {/* Render RationaleDrawer OUTSIDE the main container to avoid stacking context issues */}
            <RationaleDrawer
                isOpen={isRationaleOpen}
                onClose={() => setIsRationaleOpen(false)}
                question={currentQ}
                result={sessionAnalytics.currentResult}
            />
        </>
    );
};
