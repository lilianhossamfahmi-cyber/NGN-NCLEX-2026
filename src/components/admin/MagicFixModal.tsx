import React, { useState } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { Wand2, X, Check, Loader2, AlertCircle, User, FileText, Gauge, Image as ImageIcon, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { updateItem } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';

interface MagicFixModalProps {
    item: MasterQuestionItem;
    onClose: () => void;
    onSuccess: () => void;
}

const CHECKLIST_GROUPS = [
    {
        title: "Patient Information (EHR)",
        icon: User,
        color: "text-blue-600",
        bg: "bg-blue-50",
        items: [
            "Make Patient Info more informatics & professional",
            "Add detailed Nurse's Notes aligned to case",
            "Add detailed Vital Signs aligned to case",
            "Add Height, Weight, Intake & Output to Vitals",
            "Add/Generate ECG Strip description in Vitals",
            "Add/Generate Laboratory Results aligned to case",
            "Add/Generate Orders aligned to case",
            "Add/Generate Radiology Report aligned to case"
        ]
    },
    {
        title: "Golden Schema Compliance",
        icon: AlertCircle,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        items: [
            "Standardize LABS to Golden Schema: {test, value, unit, flag: 'H'|'L', reference}",
            "Standardize ORDERS to Golden Schema: {order, status: 'Active', orderedBy, time}",
            "Standardize VITALS to Golden Schema: Must have 7 fields (time, tempF, hr, rr, bp, o2, pain)",
            "Standardize H&P to Golden Schema: PMH/PSH as arrays, strict object structure",
            "Standardize NURSES NOTES to Golden Schema: Strict objects {time, note, initials} or chronological array."
        ]
    },
    {
        title: "Question & Options Standards",
        icon: FileText,
        color: "text-purple-600",
        bg: "bg-purple-50",
        items: [
            "Standardize STEM: Ensure 'Scenario -> Event -> Query' format, no negatives",
            "Standardize OPTIONS: Ensure homogeneity, plausibility, and parallel structure",
            "Improve Distractors: Remove outliers and 'all of the above'"
        ]
    },
    {
        title: "Rationale & Reasoning Standards",
        icon: Check,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        items: [
            "Enforce GOLDEN RATIONALE: Full schema {coreConcept, trap, goldenRule, steps}",
            "Add/Fix MNEMONIC: {title, content, explanation}",
            "Add/Fix CHEAT SHEET: {title, points[]}",
            "REWRITE 'rationale.referenceInfo' IN ALL SCREENS & GLOBAL: Must be detailed case-specific mechanisms (min 2 sentences)."
        ]
    },
    {
        title: "AI Auto-Generation (For Skeletons)",
        icon: Sparkles,
        color: "text-amber-600",
        bg: "bg-amber-50",
        items: [
            "GENERATE FULL CONTENT: Detect 'Pending' fields and fill with realistic clinical data (Vitals, Labs, H&P) matching the specific Topic.",
            "GENERATE CASE SCENARIO: Create a 6-Screen progression (Recognize -> Analyze -> Prioritize -> Generate -> Take Action -> Evaluate) for this Topic.",
            "GENERATE RATIONALE: Create full clinical reasoning object from scratch.",
            "GENERATE NURSES NOTES: realistic chronological entries reflecting the scenario evolution.",
            "GENERATE H&P: History & Physical matching the patient profile and diagnosis."
        ]
    },
    {
        title: "Difficulty Level Override",
        icon: Gauge,
        color: "text-orange-600",
        bg: "bg-orange-50",
        items: [
            "Set Level to 5 (Expert)",
            "Set Level to 4 (Proficient)",
            "Set Level to 3 (Standard)",
            "Set Level to 2 (Application)",
            "Set Level to 1 (Recall)"
        ]
    },
    {
        title: "Media & Images",
        icon: ImageIcon,
        color: "text-pink-600",
        bg: "bg-pink-50",
        items: [
            "Add X-RAY to Question Options",
            "Add X-RAY to Radiology Report",
            "Add Image to Question Stem",
            "Add Image to Question Options space"
        ]
    }
];

export const MagicFixModal: React.FC<MagicFixModalProps> = ({ item, onClose, onSuccess }) => {
    const [instruction, setInstruction] = useState('');
    const [checkedOptions, setCheckedOptions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState<MasterQuestionItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'input' | 'preview'>('input');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(CHECKLIST_GROUPS.map(g => g.title)));

    const toggleOption = (option: string) => {
        const next = new Set(checkedOptions);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        setCheckedOptions(next);
    };

    const toggleGroup = (title: string) => {
        const next = new Set(expandedGroups);
        if (next.has(title)) next.delete(title);
        else next.add(title);
        setExpandedGroups(next);
    };

    const handleMagicFix = async () => {
        // Construct the full prompt
        const selectedList = Array.from(checkedOptions);
        if (!instruction.trim() && selectedList.length === 0) return;

        const fullInstruction = [
            instruction.trim(),
            selectedList.length > 0 ? "\nAPPLY THE FOLLOWING MODIFICATIONS:" : "",
            ...selectedList.map(opt => `- ${opt} `)
        ].filter(Boolean).join('\n');

        setLoading(true);
        setError(null);

        try {
            // TEMPORARY: AI Magic Fix requires backend - show message
            // TODO: Migrate to Supabase Edge Functions
            throw new Error('AI Magic Fix is temporarily unavailable. The feature is being migrated to a new architecture. Please edit items manually for now.');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!newItem) return;
        setLoading(true);
        try {
            // Remove SKELETON tag on save
            const updatedTags = (newItem.tags || []).filter(t => t !== 'SKELETON');

            // Normalize status to prevent check constraint errors
            const normalizedItem = {
                ...newItem,
                tags: updatedTags,
                metadata: {
                    ...newItem.metadata,
                    status: (newItem.metadata?.status || 'draft').toLowerCase() as any
                }
            };

            // Save to Local DB
            await updateItem(normalizedItem);
            // Sync to Supabase
            await syncItemToSupabase(normalizedItem);

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save changes.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-purple-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Wand2 className="text-yellow-300" />
                        <h2 className="font-bold text-lg">Magic AI Fixer</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 border border-red-200">
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {step === 'input' ? (
                        <div className="space-y-6">
                            {/* Free Text Input */}
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Custom Instructions (Optional)</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 min-h-[80px]"
                                    placeholder="e.g. 'Ensure the patient history mentions diabetes'..."
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                />
                            </div>

                            {/* Checklist Groups */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Actions</label>

                                {CHECKLIST_GROUPS.map((group) => {
                                    const isExpanded = expandedGroups.has(group.title);
                                    return (
                                        <div key={group.title} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => toggleGroup(group.title)}
                                                className={`w - full flex items - center justify - between p - 3 ${group.bg} hover: bg - opacity - 80 transition - colors`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <group.icon size={18} className={group.color} />
                                                    <span className={`font - bold text - sm ${group.color} `}>{group.title}</span>
                                                </div>
                                                {isExpanded ? <ChevronDown size={16} className={group.color} /> : <ChevronRight size={16} className={group.color} />}
                                            </button>

                                            {isExpanded && (
                                                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                                                    {group.items.map((itemStr) => (
                                                        <label key={itemStr} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer select-none">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checkedOptions.has(itemStr)}
                                                                    onChange={() => toggleOption(itemStr)}
                                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-purple-600 checked:bg-purple-600 focus:ring-2 focus:ring-purple-500/20"
                                                                />
                                                                <Check size={10} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-700 leading-tight pt-0.5">{itemStr}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="bg-green-50 text-green-800 p-3 rounded-lg border border-green-200 flex items-center gap-2">
                                <Check size={18} />
                                <span className="font-bold">AI Changes Generated!</span>
                            </div>

                            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                                <div className="bg-gray-100 p-2 text-xs font-bold text-gray-500 border-b flex justify-between">
                                    <span>PREVIEW CHANGES</span>
                                    <span className="text-gray-400 font-mono">JSON</span>
                                </div>
                                <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                                    <pre className="whitespace-pre-wrap text-blue-800 break-words">
                                        {JSON.stringify({
                                            content: newItem?.content,
                                            metadata: newItem?.metadata
                                        }, null, 2)}
                                    </pre>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500">
                                Ensure "Images" contain valid placeholder URLs if added.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
                    {step === 'input' ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button
                                onClick={handleMagicFix}
                                disabled={(!instruction.trim() && checkedOptions.size === 0) || loading}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-purple-200 transition-all"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                {loading ? 'Processing...' : 'Generate Fix'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setStep('input')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Back to Edit</button>
                            <button
                                onClick={handleApply}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-green-200 transition-all"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                Apply Changes
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
