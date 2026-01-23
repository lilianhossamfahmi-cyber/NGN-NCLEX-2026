import React, { useState } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { X, Plus, Sparkles, Layers, Activity, Copy, Shuffle } from 'lucide-react';
import { NCLEX_TOPICS } from '../../data/nclexTopics';
import { saveItemToBank } from '../../services/itemApiService';

interface AddItemModalProps {
    onClose: () => void;
    onCreated: (item: MasterQuestionItem) => void;
}

const ITEM_TYPES = [
    { id: 'case-study', label: 'NGN Case Study (6-Screen)', icon: Layers },
    { id: 'bow-tie', label: 'Bow-Tie', icon: Activity },
    { id: 'trend', label: 'Trend', icon: Activity },
    { id: 'highlight', label: 'Highlight', icon: Activity },
    { id: 'matrix', label: 'Matrix', icon: Activity },
    { id: 'ordered-response', label: 'Ordered Response', icon: Activity },
    { id: 'drop-cloze', label: 'Drop Cloze', icon: Activity },
    { id: 'multiple-response', label: 'Multiple Response', icon: Activity },
    { id: 'single-response', label: 'Single Response', icon: Activity },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onCreated }) => {
    const [selectedCategory, setSelectedCategory] = useState(NCLEX_TOPICS[0].category);
    const [selectedTopic, setSelectedTopic] = useState(NCLEX_TOPICS[0].topics[0]);
    const [selectedType, setSelectedType] = useState('case-study');

    // Level State: 1-5 or 'mix'
    const [level, setLevel] = useState<number | 'mix'>(3);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    // Get topics for current category
    const currentTopics = NCLEX_TOPICS.find(c => c.category === selectedCategory)?.topics || [];

    const handleCreate = async () => {
        setLoading(true);
        try {
            let availableTopics = [...currentTopics];
            const itemsCreated: any[] = [];

            // Batch Creation Loop
            for (let i = 0; i < quantity; i++) {

                // --- Topic Selection Logic ---
                let topicToUse = selectedTopic;
                if (selectedTopic === 'Mix Randomly') {
                    // Refill if exhausted
                    if (availableTopics.length === 0) availableTopics = [...currentTopics];

                    // Pick random
                    const randomIndex = Math.floor(Math.random() * availableTopics.length);
                    topicToUse = availableTopics[randomIndex];

                    // Remove from available (to ensure no repeat until exhausted)
                    availableTopics.splice(randomIndex, 1);
                }

                // --- Level Selection Logic ---
                let levelToUse = typeof level === 'number' ? level : 3;
                if (level === 'mix') {
                    // Random 1 to 5
                    levelToUse = Math.floor(Math.random() * 5) + 1;
                }

                // Determine Difficulty String
                const diffString = levelToUse === 5 ? 'Expert' : levelToUse === 4 ? 'Hard' : levelToUse === 3 ? 'Moderate' : levelToUse === 2 ? 'Easy' : 'Recall';

                const newItem: any = {
                    id: `unified_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
                    type: selectedType as any,
                    typeId: selectedType,
                    metadata: {
                        title: topicToUse + (quantity > 1 ? ` (Batch ${i + 1})` : ''),
                        topic: selectedCategory,
                        subTopic: topicToUse,
                        status: 'draft',
                        difficulty: diffString,
                        difficultyLevel: levelToUse, // Store numeric level
                        authorId: 'admin',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        sourceOrigin: 'manual',
                        sourceReferences: [],
                        allowed_modes: ['practice', 'exam', 'tutor'],
                        hasStudentPreview: true
                    },
                    content: {
                        clinicalData: {
                            patientInfo: { name: 'Placeholder Initials', age: 45, gender: 'F', allergies: 'NKDA', codeStatus: 'Full Code', weightKg: 70 },
                            setting: 'Acute Care',
                            historyPhysical: {
                                chiefComplaint: 'Pending...',
                                hpi: 'Pending...',
                                pmh: [],
                                medications: []
                            },
                            history: [
                                { time: '0800', author: 'RN', note: 'Initial assessment pending...' }
                            ],
                            vitals: [
                                { time: '0800', tempF: '98.6', hr: 80, rr: 18, bp: '120/80', o2: '98', o2_device: 'RA', pain: 0 }
                            ],
                            labs: [],
                            orders: [],
                            radiology: []
                        },
                        rationale: {
                            coreConcept: topicToUse,
                            caseSummary: "Pending generation...",
                            answerAnalysis: "Pending generation...",
                            trap: "Pending generation...",
                            goldenRule: "Pending generation...",
                            steps: [],
                            referenceInfo: { anatomy: "", physiology: "", pharm: "" }
                        },
                        structure: {
                            type: selectedType,
                            prompt: "Pending generation...",
                            screens: selectedType === 'case-study' ? [] : undefined
                        }
                    },
                    tags: [selectedCategory, selectedType, 'SKELETON']
                };

                await saveItemToBank(newItem);
                itemsCreated.push(newItem);
            }

            // Handoff Logic
            if (quantity === 1) {
                // If single item, open preview.
                onCreated(itemsCreated[0]);
            } else {
                // If batch, notify and refresh.
                const levelMsg = level === 'mix' ? 'Random Levels' : `Level ${level}`;
                const topicMsg = selectedTopic === 'Mix Randomly' ? 'Mixed Topics' : selectedTopic;
                alert(`✅ Created ${quantity} items!\n\nTopic: ${topicMsg}\nLevel: ${levelMsg}`);
                onCreated(itemsCreated[0]);
            }

        } catch (err) {
            console.error(err);
            alert("Failed to create item(s).");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-blue-100 flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Create New Item Skeleton</h2>
                            <p className="text-xs text-blue-100 opacity-80">Define parameters, then Auto-Fill with AI.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* 1. Category & Topic */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    const newTopics = NCLEX_TOPICS.find(c => c.category === e.target.value)?.topics || [];
                                    setSelectedTopic(newTopics[0] || '');
                                }}
                            >
                                {NCLEX_TOPICS.map(cat => (
                                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Topic / Concept</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                <option value="Mix Randomly" className="font-bold text-blue-600">✨ Mix Randomly (No Repeats)</option>
                                <hr />
                                {currentTopics.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 2. Item Type & Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Item Type</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {ITEM_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Difficulty Level (1-5)</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setLevel(lvl as number)}
                                        className={`flex-1 p-3 rounded-lg font-bold border transition-colors ${level === lvl ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                        title={`Level ${lvl}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                                {/* Mix Button */}
                                <button
                                    onClick={() => setLevel('mix')}
                                    className={`p-3 rounded-lg font-bold border transition-colors flex items-center justify-center ${level === 'mix' ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-purple-600'}`}
                                    title="Mix Content Levels Randomly"
                                >
                                    <Shuffle className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Quantity (Batch) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                            Quantity to Create <span className="text-xs font-normal text-slate-400 lowercase">(batch mode)</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-24 p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <div className="flex-1 text-sm text-slate-500">
                                {quantity > 1 ? (
                                    <span className="text-blue-600 font-medium flex items-center gap-2">
                                        <Copy className="w-4 h-4" />
                                        Batch Mode: {quantity} Items
                                        {level === 'mix' && <span className="text-purple-600 font-bold ml-1">• Mixed Levels</span>}
                                    </span>
                                ) : (
                                    "Single item creation"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div className="text-sm text-indigo-800">
                            <strong>Workflow:</strong>
                            {quantity > 1 ? (
                                <span> Batch creating <strong>{quantity} items</strong>. They will appear in your 'Drafts' list with <strong>{level === 'mix' ? 'Random Levels' : `Level ${level}`}</strong>.</span>
                            ) : (
                                <span> This creates a blank "{selectedType}" item. The <strong>Magic Fixer</strong> will launch automatically to help you generate content.</span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Cancel</button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Plus className="w-4 h-4" />
                                {quantity > 1 ? `Create ${quantity} Items` : 'Create & Open Magic Fixer'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
