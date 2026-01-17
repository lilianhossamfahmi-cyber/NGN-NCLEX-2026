
import React, { useState } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { Wand2, X, Check, Loader2, AlertCircle, User, FileText, Gauge, Image as ImageIcon, ChevronDown, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
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

    // Image Upload State
    const [uploadImage, setUploadImage] = useState<string | null>(null);

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

    // Quick Action Handler
    const handleQuickAction = (action: string) => {
        if (action === 'full_case') {
            setInstruction("Generate a complete full case including Nurses Notes, History & Physical, Vitals, Labs, Orders, Question Stem, Answer Options and Rationale. Ensure all fields are filled.");
        }
    };

    // Image Handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setUploadImage(reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    const handleMagicFix = async () => {
        // Construct the full prompt
        const selectedList = Array.from(checkedOptions);
        if (!instruction.trim() && selectedList.length === 0 && !uploadImage) return;

        const fullInstruction = [
            instruction.trim(),
            selectedList.length > 0 ? "\nAPPLY THE FOLLOWING MODIFICATIONS:" : "",
            ...selectedList.map(opt => `- ${opt} `)
        ].filter(Boolean).join('\n');

        setLoading(true);
        setError(null);

        try {
            // Call Vercel Serverless Function for AI Magic Fix
            const response = await fetch('/api/magic-fix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item,
                    instruction: fullInstruction,
                    image: uploadImage // Send image if present
                })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON API Response:", text);
                throw new Error("Server Error: API returned non-JSON response");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'AI Request Failed');
            }

            setNewItem(data.item);
            setStep('preview');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper – shallow diff check for stem / options / highlight
    const hasMeaningfulChanges = (original: any, updated: any): boolean => {
        if (original.prompt !== updated.prompt) return true;
        if (JSON.stringify(original.structure?.options) !== JSON.stringify(updated.structure?.options)) return true;
        if (JSON.stringify(original.structure?.highlight) !== JSON.stringify(updated.structure?.highlight)) return true;
        return false;
    };

    // Push Highlight endpoint (only needed for Highlight items)
    const handlePushHighlight = async () => {
        if (!newItem) return;
        setLoading(true);
        try {
            const resp = await fetch('/api/push-highlight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item: newItem })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Push failed');
            setNewItem(data.item); // refreshed normalized version
            // Auto-apply after push
            // Remove SKELETON tag on save
            const updatedTags = (data.item.tags || []).filter((t: string) => t !== 'SKELETON');

            // Normalize status to prevent check constraint errors
            const normalizedItem = {
                ...data.item,
                tags: updatedTags,
                metadata: {
                    ...data.item.metadata,
                    status: (data.item.metadata?.status || 'draft').toLowerCase() as any
                }
            };

            // Save to Local DB
            await updateItem(normalizedItem);
            // Sync to Supabase
            await syncItemToSupabase(normalizedItem);

            onSuccess();
            onClose();

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!newItem) return;

        // Optional: Warn if no changes
        if (!hasMeaningfulChanges(item, newItem)) {
            const confirm = window.confirm('No changes detected in Stem, Options, or Highlight. Apply anyway?');
            if (!confirm) return;
        }

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

    // Image Generation Handler
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const [imageLoading, setImageLoading] = useState(false);

    const handleGenerateImage = async () => {
        const imagePrompts = Array.from(checkedOptions).filter(opt =>
            opt.includes('X-RAY') || opt.includes('Image')
        );

        if (imagePrompts.length === 0 && !instruction) {
            setError('Please select an image option or describe what image you need');
            return;
        }

        const prompt = imagePrompts.length > 0
            ? imagePrompts.join(', ') + '. ' + instruction
            : instruction;

        const context = `Medical educational content for: ${(item.metadata as any)?.topic || 'NCLEX nursing exam'} `;

        setImageLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, context })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Image generation failed');
            }

            if (data.type === 'description') {
                // Fallback: Show description

                setError(`Image model unavailable.Use this description: \n\n${data.description} \n\nSuggested: ${data.suggestedServices?.join(', ')} `);
            } else if (data.image) {
                setGeneratedImage(data.image);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setImageLoading(false);
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
                            <span className="text-sm font-medium whitespace-pre-wrap">{error}</span>
                        </div>
                    )}

                    {/* Generated Image Display */}
                    {generatedImage && (
                        <div className="mb-4 bg-pink-50 p-4 rounded-lg border border-pink-200">
                            <h4 className="font-bold text-pink-700 mb-2 flex items-center gap-2">
                                🎨 Generated Image
                            </h4>
                            <img
                                src={generatedImage}
                                alt="AI Generated"
                                className="max-w-full h-auto rounded-lg shadow-md border"
                            />
                            <p className="text-xs text-pink-600 mt-2">
                                Right-click to save, or copy this image URL to use in the item.
                            </p>
                        </div>
                    )}

                    {step === 'input' ? (
                        <div className="space-y-6">

                            {/* Quick Actions */}
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => handleQuickAction('full_case')}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg transition-all text-sm font-bold w-full justify-center"
                                >
                                    <Sparkles size={16} className="text-yellow-300" />
                                    Generate Full Case (Golden Standard)
                                </button>
                            </div>

                            {/* Free Text Input */}
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Custom Instructions (Optional)</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 min-h-[80px]"
                                    placeholder="e.g. 'Ensure the patient history mentions diabetes'..."
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    onPaste={handlePaste}
                                />
                                {/* Image Upload Widget */}
                                <div className="mt-3 flex items-center gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition-colors">
                                        <ImageIcon size={14} />
                                        {uploadImage ? 'Change Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                    <span className="text-xs text-gray-400">or paste image (Ctrl+V)</span>

                                    {uploadImage && (
                                        <div className="ml-auto flex items-center gap-2 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                            <ImageIcon size={14} className="text-blue-500" />
                                            <span className="text-xs text-blue-700 font-medium">Image Ready</span>
                                            <button
                                                onClick={() => setUploadImage(null)}
                                                className="text-red-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {uploadImage && (
                                    <div className="mt-2 relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={uploadImage} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
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
                                onClick={handleGenerateImage}
                                disabled={imageLoading}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-pink-200 transition-all"
                            >
                                {imageLoading && <Loader2 size={18} className="animate-spin" />}
                                {imageLoading ? 'Generating...' : '🎨 Generate Image'}
                            </button>
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

                            {/* Push Highlight Button */}
                            {newItem?.typeId === 'highlight' && (
                                <button
                                    onClick={handlePushHighlight}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all mr-2"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    Push Highlight Changes
                                </button>
                            )}

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
