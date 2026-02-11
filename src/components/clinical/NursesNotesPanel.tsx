
import React from 'react';
import { DataSanitizer, StructuredNote } from '../../utils/DataSanitizer';
import { isCriticalNote, isInterventionNote, hasDocumentedResponse } from '../../utils/ClinicalHelpers';

export interface NursesNotesPanelProps {
    data: any;
    item?: any;
}

export const NursesNotesPanel: React.FC<NursesNotesPanelProps> = ({ data, item }) => {
    // 2. HELPER: Render the "Timeline Feed" (Nurses Notes) - GOLD STANDARD logic ported
    let notes: StructuredNote[] = (item?.content?.clinicalData as any)?._structuredHistory;

    if (!notes) {
        const rawData = data || item?.content?.clinicalData?.history || (item?.content?.clinicalData as any)?.nursesNotes;
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
