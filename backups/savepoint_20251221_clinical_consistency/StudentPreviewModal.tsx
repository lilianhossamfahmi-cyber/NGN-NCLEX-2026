import React, { useState } from 'react';
import { MasterQuestionItem } from '../types/master-schema';
import { renderQuestion } from './item-types/ItemRenderer';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileDrawer } from './mobile/MobileDrawer';

interface StudentPreviewModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
}

// Icons
// Icons
const NoteIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ActivityIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const BeakerIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>;
const FileTextIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;


const PatientHeader = ({ data }: { data: any }) => (
    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}>
        {/* Top Row: Primary Identity - BLACK BACKGROUND */}
        <div style={{ background: '#000000', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                    {data?.age > 0 ? 'CL, TEST' : 'Client, Generic'}
                </div>
                <div style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94a3b8', marginRight: '6px' }}>Age/Gen:</span>
                    <span style={{ fontWeight: 600 }}>{data?.age || 72}y {data?.gender || 'F'}</span>
                </div>
                <div style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94a3b8', marginRight: '6px' }}>DOB:</span>
                    <span style={{ fontWeight: 600 }}>{data?.dob || '03/15/1953'}</span>
                </div>
                <div style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94a3b8', marginRight: '6px' }}>MRN:</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '1rem' }}>{data?.mrn || '2025-04-1847'}</span>
                </div>
            </div>
            <div>
                <span style={{ color: '#94a3b8', marginRight: '8px', fontSize: '0.85rem' }}>Code:</span>
                <span style={{ fontWeight: 700, color: '#fca5a5', border: '1px solid #ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                    {data?.codeStatus || 'FULL CODE'}
                </span>
            </div>
        </div>

        {/* Bottom Grid: Clinical Logistics - DARK BLUE BACKGROUND (Midpoint) */}
        <div style={{ background: '#0B1221', padding: '16px', fontSize: '0.8rem', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px 24px' }}>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Admission Date</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data?.admissionDate || '10/24/2025 07:30'}</span>
                </div>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Location</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data?.room || 'ICU-12'}</span>
                </div>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Attending Prov.</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data?.physician || 'Dr. S. Esposito'}</span>
                </div>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Primary Nurse</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{data?.nurse || 'R. Jones, RN'}</span>
                </div>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Allergies</span>
                    <span style={{ fontWeight: 700, color: data?.allergies && data.allergies !== 'NKDA' && data.allergies !== 'NKA' ? '#fca5a5' : '#86efac', fontSize: '0.9rem' }}>
                        {data?.allergies || 'NKA'}
                    </span>
                </div>
                <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Isolation</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.9rem' }}>{data?.isolation || 'Standard Precautions'}</span>
                </div>
            </div>
        </div>
    </div>
);

const CaseTabSystem = ({ activeTab, onTabChange }: any) => {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    // Unique colors for each tab to make them "obvious and catchy"
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
                                // Interactive border: Solid when active, transparent-ish when hovered, invisible otherwise
                                borderBottom: isActive ? `3px solid ${sec.color}` : (isHovered ? `3px solid ${sec.color}40` : '3px solid transparent'),
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                // Text is always dark grey unless active, then it takes the color
                                color: isActive ? sec.color : '#64748b',
                                fontWeight: isActive ? 800 : 600,
                                fontSize: '0.8rem',
                                // Lift effect on hover
                                transform: isHovered && !isActive ? 'translateY(-2px)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                // Shadow on hover to pop out
                                boxShadow: isHovered && !isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : (isActive ? `inset 0 -2px 0 0 ${sec.color}20` : 'none')
                            }}
                        >
                            {/* Icon Container: Always Colored */}
                            <span style={{
                                color: sec.color, // Always colored as requested
                                padding: '8px',
                                borderRadius: '12px',
                                background: isActive || isHovered ? sec.bg : 'transparent', // Background appears on hover/active
                                display: 'flex',
                                transition: 'all 0.2s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}>
                                {React.cloneElement(sec.icon as any, { width: 24, height: 24, strokeWidth: isActive ? 2.5 : 2 })}
                            </span>
                            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>{sec.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


export const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({ item, onClose }) => {
    const screens = item.content?.structure?.screens || [];
    const isCaseStudy = screens.length > 0;
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

    // Determine the current question config based on index
    const currentQ = isCaseStudy ? screens[currentScreenIndex] : item.content.structure;
    // Ensure currentQ has an ID for state mapping, fallback to index
    const qKey = currentQ?.id || `q_${currentScreenIndex}`;

    const [activeTab, setActiveTab] = useState('notes');
    const [answers, setAnswers] = useState<Record<string, any>>({}); // Keyed by qKey
    const [submissionState, setSubmissionState] = useState<Record<string, boolean>>({}); // Keyed by qKey

    // Derived states for current view
    const currentAnswer = answers[qKey];
    const isCurrentSubmitted = submissionState[qKey] || false;
    const showRationale = isCurrentSubmitted;

    const [leftFontSize, setLeftFontSize] = useState(1);
    const [rightFontSize, setRightFontSize] = useState(1);

    // Mobile
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Helper for dynamic font scaling
    const getFontSize = (baseRem: number, level: number) => {
        return `${baseRem + (level * 0.1)}rem`;
    };

    // Styles for left content panel
    const leftContentStyle = {
        padding: '24px 32px',
        fontSize: getFontSize(1.0, leftFontSize),
        lineHeight: 1.7,
        color: '#334155',
        background: 'white',
        minHeight: '100%'
    };

    const FontControl = ({ level, setLevel }: { level: number, setLevel: React.Dispatch<React.SetStateAction<number>> }) => (
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: 'white' }}>
            <button
                onClick={() => setLevel(p => Math.max(0, p - 1))}
                style={{ padding: '6px 12px', background: 'white', border: 'none', borderRight: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}
                title="Decrease Font Size"
            >
                A-
            </button>
            <div style={{ padding: '0 10px', background: '#f8fafc', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, minWidth: '45px', textAlign: 'center' }}>
                {level * 10 + 100}%
            </div>
            <button
                onClick={() => setLevel(p => Math.min(5, p + 1))}
                style={{ padding: '6px 12px', background: 'white', border: 'none', borderLeft: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}
                title="Increase Font Size"
            >
                A+
            </button>
        </div>
    );

    const handleSubmit = () => {
        setSubmissionState(prev => ({ ...prev, [qKey]: true }));
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

    const progressPercentage = isCaseStudy
        ? ((currentScreenIndex + 1) / screens.length) * 100
        : 100;

    const formatTemp = (tempF: any) => {
        if (!tempF) return '';
        const f = parseFloat(tempF);
        if (isNaN(f)) return tempF;
        const c = ((f - 32) * 5 / 9).toFixed(1);
        return `${f}°F (${c}°C)`;
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 9999, display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>

            {/* Top Bar - NCLEX Style */}
            <div style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e3a8a', letterSpacing: '-0.02em' }}>NCLEX-RN Simulator</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>Item ID: {item.id ? item.id.slice(0, 8) : '-----'}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>


                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Time: <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700 }}>02:59:45</span>
                    </div>
                    <button onClick={onClose} style={{ padding: '8px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.9rem', transition: 'all 0.2s' }}>Pause / Exit</button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left Panel - EHR */}
                <div style={{
                    width: isMobile ? '0px' : '38%',
                    display: isMobile ? 'none' : 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #cbd5e1',
                    background: '#f8fafc'
                }}>
                    {/* Patient Header */}
                    <PatientHeader data={item.content.clinicalData?.patientInfo} />

                    <CaseTabSystem activeTab={activeTab} onTabChange={setActiveTab} />
                    <div style={{ flex: 1, overflowY: 'auto', background: 'white' }}>
                        <div style={leftContentStyle}>
                            {activeTab === 'notes' && (
                                <div>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '3px solid #2563eb', paddingBottom: '12px', marginBottom: '20px', color: '#1e3a8a', fontWeight: 700 }}>Nurses Notes</h3>
                                    <div style={{ color: '#1e3a8b', fontSize: getFontSize(1.05, leftFontSize), fontFamily: 'sans-serif' }} dangerouslySetInnerHTML={{ __html: item.content.clinicalData?.history || "No notes available." }} />
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', color: '#334155', fontWeight: 700 }}>History & Physical</h3>
                                    <div style={{ color: '#334155', fontSize: getFontSize(1.0, leftFontSize) }} dangerouslySetInnerHTML={{ __html: item.content.clinicalData?.historyPhysical || "No H&P data." }} />
                                </div>
                            )}
                            {activeTab === 'vitals' && (
                                <div>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', fontWeight: 700 }}>Vital Signs</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: getFontSize(0.95, leftFontSize), boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569' }}>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>Time</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>Temp</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>HR</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>RR</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>BP</th>
                                                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', fontWeight: 600 }}>O2 Sat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(item.content.clinicalData?.vitals) ? item.content.clinicalData.vitals.map((v: any, i: number) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{v.time || '08:00'}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155' }}>{formatTemp(v.tempF)}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155' }}>{v.hr}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155' }}>{v.rr}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155' }}>{v.bp}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155' }}>{v.o2}%</td>
                                                </tr>
                                            )) : <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No vitals recorded</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {activeTab === 'labs' && (
                                <div>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', fontWeight: 700 }}>Laboratory Results</h3>
                                    <div style={{ fontSize: getFontSize(1.0, leftFontSize) }} dangerouslySetInnerHTML={{ __html: item.content.clinicalData?.labs || "No Labs." }} />
                                </div>
                            )}
                            {activeTab === 'orders' && (
                                <div>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', fontWeight: 700 }}>Medical Orders</h3>
                                    <div style={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: getFontSize(0.95, leftFontSize), background: '#f8fafc', padding: '24px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: item.content.clinicalData?.orders || "No Orders." }} />
                                </div>
                            )}
                            {activeTab === 'rad' && (
                                <div>
                                    <h3 style={{ marginTop: 0, fontSize: getFontSize(1.3, leftFontSize), borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', fontWeight: 700 }}>Radiology Reports</h3>
                                    <div style={{ fontSize: getFontSize(1.0, leftFontSize) }} dangerouslySetInnerHTML={{ __html: item.content.clinicalData?.radiology || "No Imaging Reports available." }} />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Left Panel Footer - Font Controls */}
                    <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FontControl level={leftFontSize} setLevel={setLeftFontSize} />
                    </div>
                </div>

                {/* Right Panel - Question */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>

                    {/* Progress Bar (if case study) */}
                    {isCaseStudy && (
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9' }}>
                            <div style={{
                                height: '100%',
                                width: `${progressPercentage}%`,
                                background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                                transition: 'width 0.3s ease-in-out'
                            }} />
                        </div>
                    )}

                    <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto', fontSize: getFontSize(1.0, rightFontSize) }}>
                        <div style={{ maxWidth: '850px', margin: '0 0' }}>
                            {isCaseStudy && (
                                <div style={{ marginBottom: '16px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Case Study: Question {currentScreenIndex + 1} of {screens.length}
                                </div>
                            )}

                            <div style={{ marginBottom: '32px', fontSize: '1.2em', lineHeight: 1.6, color: '#1e293b' }}>
                                {currentQ?.prompt || item.content.structure?.prompt}
                            </div>

                            {currentQ ? renderQuestion(
                                currentQ,
                                'student',
                                undefined,
                                currentAnswer,
                                (ans) => setAnswers(prev => ({ ...prev, [qKey]: ans })),
                                isCurrentSubmitted,
                                true // hideFooter to avoid duplicate button
                            ) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #e2e8f0' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#334155' }}>Question Content Missing</h3>
                                    <p>Unable to load the content for Question {currentScreenIndex + 1}.</p>
                                    <div style={{ fontSize: '0.8rem', marginTop: '12px', fontFamily: 'monospace' }}>ID: {item.id} | Index: {currentScreenIndex}</div>
                                </div>
                            )}

                            {/* Legend (Re-created since we hid the footer) */}
                            {isCurrentSubmitted && currentQ && (
                                <div style={{ marginTop: '24px', padding: '12px', background: '#f8fafc', borderRadius: '6px', display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}></span>
                                        <span>Correct</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)' }}></span>
                                        <span>Incorrect</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)' }}></span>
                                        <span>Missed</span>
                                    </div>
                                </div>
                            )}

                            {/* Rationale Section */}
                            {showRationale && currentQ && (
                                <div style={{ marginTop: '48px', animation: 'slideUp 0.3s ease-out' }}>
                                    <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

                                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ background: '#e0f2fe', padding: '12px 16px', color: '#0369a1', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            Rationale & Educational Key
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontWeight: 700, marginBottom: 8, color: '#334155' }}>Clinical Reasoning:</div>
                                                <div style={{ lineHeight: 1.6, color: '#444' }}>
                                                    {currentQ?.rationale || currentQ?.clinicalSummary || "Review the clinical findings and prioritize based on ABCs and safety."}
                                                </div>
                                            </div>

                                            <div style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    🎯 Test-Taking Strategy
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                                    {currentQ?.strategy || "Focus on distinguishing relevant data from distractors."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Footer - Sticky Submit & Right Font Controls */}
                    <div style={{
                        padding: '16px 24px',
                        background: 'white',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)',
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <FontControl level={rightFontSize} setLevel={setRightFontSize} />
                            {/* Previous Button */}
                            {isCaseStudy && (
                                <button
                                    onClick={handlePrev}
                                    disabled={currentScreenIndex === 0}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'white',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        color: currentScreenIndex === 0 ? '#cbd5e1' : '#475569',
                                        cursor: currentScreenIndex === 0 ? 'not-allowed' : 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Previous
                                </button>
                            )}
                        </div>

                        {!isCurrentSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!currentQ} // Disable submit if no question
                                style={{
                                    padding: '12px 32px',
                                    background: !currentQ ? '#94a3b8' : '#0ea5e9',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    cursor: !currentQ ? 'not-allowed' : 'pointer',
                                    boxShadow: !currentQ ? 'none' : '0 2px 4px rgba(14, 165, 233, 0.3)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => currentQ && (e.currentTarget.style.background = '#0284c7')}
                                onMouseOut={(e) => currentQ && (e.currentTarget.style.background = '#0ea5e9')}
                            >
                                Submit Answer
                            </button>
                        ) : (
                            isCaseStudy && currentScreenIndex < screens.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    style={{
                                        padding: '12px 32px',
                                        background: '#0284c7',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    Next Question →
                                </button>
                            ) : (
                                <button
                                    onClick={onClose}
                                    style={{
                                        padding: '12px 32px',
                                        background: '#15803d', // Green for final submit
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
                                    }}
                                >
                                    Final Submit
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
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
    );
};
