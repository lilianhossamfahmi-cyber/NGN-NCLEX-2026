import React, { useState, useEffect } from 'react';
import '../index.css'; // Global Design System
import { MasterQuestionItem, ReferenceSource, GenerationSettings } from '../types/master-schema';
import { ResultsGrid } from '../components/ResultsGrid';
import { ItemAuthoring } from '../components/ItemAuthoring';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImportPanel } from '../components/ImportPanel';
import { generateQuestions } from '../services/questionGenerationService';
import { validateGenerationSettings } from '../services/validationService';
import { ErrorAlert } from '../components/ErrorAlert';
import { loadSession, saveSession, clearSession } from '../services/sessionService';
import { saveBatchToBank, getBankItems, deleteItemFromBank, deleteBatchFromBank } from '../services/itemStorageService';
import { getQuestionType } from '../registry';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { HeaderProgressBar } from '../components/analytics/HeaderProgressBar';
import { getMockAnalytics } from '../services/analyticsService';
import { AnalyticsSummary } from '../types/analytics-schema';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { EmptyState } from '../components/common/EmptyState';
import { MobileNavigation } from '../components/mobile/MobileNavigation';
import { GeneratorWorkflow } from './GeneratorWorkflow';


/**
 * MASTER NGN CREATOR ENGINE v2.1
 * The central controller for the NGN Question Creation workflow.
 * Updated with Analytics Dashboard.
 */

// --- DATA ---

const INITIAL_SETTINGS: GenerationSettings = {
    mode: 'hybrid',
    selectedReferenceIds: [],
    targetTypes: [],
    quantityPerType: 1,
    clinicalFocus: [],
    difficultyLevel: 3, // Default to NGN Standard (3)
    temperature: 0.7,
    manualContext: '',
    aiPrompt: '',
    advanced: {
        includeAnswerKeys: true,
        includeRationales: true,
        detectDuplicates: true,
        flagCopyright: true,
        paraphraseStrictness: 'standard'
    }
};

const MOCK_REFERENCES: ReferenceSource[] = [
    { referenceId: 'ref-mock-1', fileName: 'Sepsis_Guidelines_2024.pdf', fileType: 'pdf', uploadDate: '2025-12-10', uploadedBy: 'System', topicTags: ['Sepsis', 'Guidelines'], copyrightStatus: 'ncsbn_official', isActive: true },
    { referenceId: 'ref-mock-2', fileName: 'Pediatric_Cases.json', fileType: 'json', uploadDate: '2025-12-15', uploadedBy: 'Dr. Lee', topicTags: ['Pediatrics'], copyrightStatus: 'cc_by', isActive: true },
];

export const MasterCreatorEngine: React.FC = () => {
    // --- STATE ---
    const [viewState, setViewState] = useState<'dashboard' | 'generating' | 'review' | 'authoring' | 'import' | 'bank' | 'analytics'>('dashboard');
    const [references, setReferences] = useState<ReferenceSource[]>(MOCK_REFERENCES);
    const [genSettings, setGenSettings] = useState<GenerationSettings>(INITIAL_SETTINGS);
    const [generatedBatch, setGeneratedBatch] = useState<MasterQuestionItem[]>([]);
    const [bankItems, setBankItems] = useState<MasterQuestionItem[]>([]);
    const [activeItem, setActiveItem] = useState<MasterQuestionItem | null>(null);

    // Selection & Filter State
    const [reviewSelectedIds, setReviewSelectedIds] = useState<string[]>([]);
    const [bankSelectedIds, setBankSelectedIds] = useState<string[]>([]);
    const [bankCategoryFilter, setBankCategoryFilter] = useState<string>('All');

    // UI State
    const [error, setError] = useState<string | null>(null);
    const [progressMsg, setProgressMsg] = useState("Initializing...");
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Analytics Data (Lightweight summary for header)
    const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        // Load initial analytics
        setAnalyticsData(getMockAnalytics());
    }, []);

    // Session Restore
    useEffect(() => {
        const session = loadSession();
        if (session) {
            setGenSettings(session.genSettings);
            if (session.generatedBatch.length > 0) {
                setGeneratedBatch(session.generatedBatch);
                setViewState('review');
            }
        }
        setBankItems(getBankItems());
    }, []);

    // Auto-Save Session
    useEffect(() => {
        if (viewState !== 'generating' && viewState !== 'bank') {
            saveSession(genSettings, generatedBatch, activeItem);
        }
    }, [genSettings, generatedBatch, activeItem, viewState]);

    // --- SORTING & VIEW STATE ---
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title' | 'level'>('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // New View Mode

    // Derived Bank Items (Filtered & Sorted)
    const filteredBankItems = bankItems
        .filter(item => {
            const matchesCategory = bankCategoryFilter === 'All' || item.typeId === bankCategoryFilter;
            const matchesSearch = item.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.pedagogy.clinicalFocus || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'newest': return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
                case 'oldest': return new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime();
                case 'title': return a.metadata.title.localeCompare(b.metadata.title);
                case 'level': return (b.pedagogy.difficultyLevel || 0) - (a.pedagogy.difficultyLevel || 0);
                default: return 0;
            }
        });

    const availableBankTypes = ['All', ...Array.from(new Set(bankItems.map(i => i.typeId)))].sort();

    // --- HANDLERS ---

    const handleStartGeneration = async () => {
        setError(null);
        const validRes = validateGenerationSettings(genSettings);
        if (!validRes.valid) {
            setError(`Validation Error: ${validRes.errors[0]}`);
            return;
        }

        setViewState('generating');
        setProgressMsg("Starting AI Engine...");

        const response = await generateQuestions(genSettings, references, (msg) => setProgressMsg(msg));

        if (response.success && response.data) {
            setGeneratedBatch(response.data);
            setReviewSelectedIds([]); // Reset selection
            setViewState('review');
        } else {
            setError(response.error || "Unknown Generation Error");
            setViewState('dashboard');
        }
    };

    const handleEditItem = (item: MasterQuestionItem) => {
        setActiveItem(item);
        setViewState('authoring');
    };

    const handleUpdateItem = (updated: MasterQuestionItem) => {
        const newBatch = generatedBatch.map(i => i.id === updated.id ? updated : i);
        setGeneratedBatch(newBatch);

        const bankIdx = bankItems.findIndex(i => i.id === updated.id);
        if (bankIdx >= 0) {
            saveBatchToBank([updated]);
            setBankItems(getBankItems());
        }

        setActiveItem(updated);
    };

    const handleReferencesChange = (newRefs: ReferenceSource[]) => {
        setReferences(newRefs);
        const activeIds = newRefs.filter(r => r.isActive).map(r => r.referenceId);
        setGenSettings(prev => ({ ...prev, selectedReferenceIds: activeIds }));
    };

    const handleImportSuccess = (items: MasterQuestionItem[]) => {
        const processed = items.map(i => ({
            ...i,
            id: i.id ? String(i.id) : crypto.randomUUID(),
            metadata: {
                ...i.metadata,
                createdAt: i.metadata.createdAt || new Date().toISOString()
            }
        }));
        setGeneratedBatch(processed);
        setReviewSelectedIds([]);
        setViewState('review');
        setError(null);
        setSuccessMsg(`Imported ${items.length} items.`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    const toggleReviewSelection = (id: string) => {
        setReviewSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const selectAllReview = () => {
        if (reviewSelectedIds.length === generatedBatch.length) setReviewSelectedIds([]);
        else setReviewSelectedIds(generatedBatch.map(i => String(i.id)));
    };

    const handleSaveSelectedToBank = () => {
        const toSave = reviewSelectedIds.length > 0
            ? generatedBatch.filter(i => reviewSelectedIds.includes(i.id))
            : generatedBatch;

        const count = saveBatchToBank(toSave);
        setBankItems(getBankItems());
        setSuccessMsg(`Saved ${count} items to Item Bank.`);
        setTimeout(() => setSuccessMsg(null), 3000);
        setReviewSelectedIds([]);
    };

    const handleDiscardSelectedReview = () => {
        const count = reviewSelectedIds.length;
        if (count === 0) {
            if (window.confirm("Discard ALL items?")) {
                setGeneratedBatch([]);
                setReviewSelectedIds([]);
                setViewState('dashboard');
                clearSession();
            }
            return;
        }

        console.log("Discarding IDs:", reviewSelectedIds);
        setGeneratedBatch(currentBatch => {
            const remaining = currentBatch.filter(item =>
                !reviewSelectedIds.includes(String(item.id))
            );
            if (remaining.length === 0) {
                setTimeout(() => setViewState('dashboard'), 50);
            }
            return remaining;
        });
        setReviewSelectedIds([]);
    };

    const toggleBankSelection = (id: string) => {
        setBankSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const selectAllBank = () => {
        if (bankSelectedIds.length === filteredBankItems.length) setBankSelectedIds([]);
        else setBankSelectedIds(filteredBankItems.map(i => String(i.id)));
    };

    const handleDeleteSelectedBank = () => {
        if (bankSelectedIds.length === 0) return;
        deleteBatchFromBank(bankSelectedIds);
        const updatedBank = getBankItems();
        setBankItems(updatedBank);
        setBankSelectedIds([]);
        setSuccessMsg(`Deleted ${bankSelectedIds.length} items (Refreshed).`);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleDeleteFromBank = (id: string) => {
        deleteItemFromBank(String(id));
        setBankItems(getBankItems());
    };

    const handleExportBank = () => {
        const itemsToExport = bankSelectedIds.length > 0
            ? filteredBankItems.filter(i => bankSelectedIds.includes(i.id))
            : filteredBankItems;

        const blob = new Blob([JSON.stringify(itemsToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ngn_bank_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="dashboard-container" style={{ paddingBottom: '4rem', background: 'var(--bg-app)', minHeight: '100vh', transition: 'background-color 0.3s' }}>


            <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}>
                    <ThemeToggle />
                </div>
                {viewState !== 'analytics' && viewState !== 'generating' && analyticsData && (
                    <HeaderProgressBar
                        domains={analyticsData.domains}
                        onViewDashboard={() => setViewState('analytics')}
                    />
                )}
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>Master NGN Question Creator v2.1</h1>

            <div style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
                {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
                {successMsg && (
                    <div className="animate-success" style={{
                        padding: '1rem', background: 'var(--color-success-bg, #ecfdf5)', color: 'var(--color-success-text, #065f46)',
                        border: '1px solid var(--color-success-border, #6ee7b7)', borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.25rem' }}>✅</span>
                        <div style={{ flex: 1, fontWeight: 500 }}>{successMsg}</div>
                        <button onClick={() => setSuccessMsg(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', opacity: 0.6 }}>×</button>
                    </div>
                )}
            </div>

            <MobileNavigation
                currentView={viewState === 'generating' ? 'dashboard' : viewState as any}
                onNavigate={(v) => setViewState(v)}
                bankCount={bankItems.length}
            />

            <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
                <button onClick={() => setViewState('dashboard')} className="btn-animate" style={{ padding: '0.5rem 1rem', background: viewState === 'dashboard' ? 'var(--color-primary-600)' : 'var(--bg-surface-elevated)', color: viewState === 'dashboard' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Generator</button>
                <button onClick={() => setViewState('bank')} className="btn-animate" style={{ padding: '0.5rem 1rem', background: viewState === 'bank' ? 'var(--color-primary-600)' : 'var(--bg-surface-elevated)', color: viewState === 'bank' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Item Bank ({bankItems.length})</button>
                <button onClick={() => setViewState('analytics')} className="btn-animate" style={{ padding: '0.5rem 1rem', background: viewState === 'analytics' ? 'var(--color-primary-600)' : 'var(--bg-surface-elevated)', color: viewState === 'analytics' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Analytics 📊</button>
            </div>

            {viewState === 'analytics' && (
                <div className="page-enter">
                    <AnalyticsDashboard onBack={() => setViewState('dashboard')} />
                </div>
            )}

            {(viewState === 'dashboard' || viewState === 'generating') && (
                <GeneratorWorkflow
                    references={references}
                    onReferencesChange={handleReferencesChange}
                    genSettings={genSettings}
                    onSettingsChange={setGenSettings}
                    onGenerate={handleStartGeneration}
                    onImportClick={() => setViewState('import')}
                />
            )}

            {viewState === 'generating' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '400px', width: '90%' }}>
                        <div style={{ marginBottom: '20px' }}><LoadingSpinner progress={65} message={progressMsg} /></div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#1e293b' }}>Generating Content...</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>The AI is crafting your clinical scenarios. This may take up to a minute.</p>
                        <button onClick={() => { if (confirm("Cancel generation? Data may be lost.")) { setViewState('dashboard'); setError('Generation Cancelled'); } }} style={{ background: 'white', border: '2px solid #ef4444', color: '#ef4444', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel Generation</button>
                    </div>
                </div>
            )}

            {viewState === 'import' && (
                <ImportPanel onImport={handleImportSuccess} onCancel={() => setViewState('dashboard')} />
            )}

            {viewState === 'review' && (
                <>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: '#1e293b', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input type="checkbox" checked={generatedBatch.length > 0 && reviewSelectedIds.length === generatedBatch.length} onChange={selectAllReview} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                            <h2 style={{ margin: 0 }}>Review Generated Items ({generatedBatch.length})</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleDiscardSelectedReview} style={{ background: 'var(--color-danger-500)', border: 'none', padding: '0.5rem 1rem', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', opacity: generatedBatch.length ? 1 : 0.5 }}>{reviewSelectedIds.length > 0 ? `Discard Selected (${reviewSelectedIds.length})` : 'Discard All'}</button>
                            <button onClick={handleSaveSelectedToBank} style={{ background: 'var(--color-primary-600)', border: 'none', padding: '0.5rem 1rem', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>{reviewSelectedIds.length > 0 ? `💾 Save Selected (${reviewSelectedIds.length})` : '💾 Save All'}</button>
                        </div>
                    </header>
                    <ResultsGrid items={generatedBatch} onEditItem={handleEditItem} selectionMode={true} selectedIds={reviewSelectedIds} onToggleSelection={toggleReviewSelection} />
                </>
            )}

            {viewState === 'bank' && (
                <div className="page-enter">
                    {/* EXPERT TOOLBAR */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center',
                        marginBottom: '24px', padding: '20px', background: 'white',
                        borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0'
                    }}>
                        {/* 0. SELECT ALL */}
                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '12px', borderRight: '1px solid #e2e8f0', height: '40px' }}>
                            <input
                                type="checkbox"
                                checked={filteredBankItems.length > 0 && bankSelectedIds.length === filteredBankItems.length}
                                onChange={selectAllBank}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                title="Select All Visible"
                            />
                        </div>

                        {/* 1. FILTER & SEARCH */}
                        <div style={{ flex: 1, display: 'flex', gap: '12px', minWidth: '300px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by title, topic..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                />
                            </div>
                            <select
                                value={bankCategoryFilter}
                                onChange={(e) => { setBankCategoryFilter(e.target.value); setBankSelectedIds([]); }}
                                style={{ padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 500 }}
                            >
                                {availableBankTypes.map(t => (
                                    <option key={t} value={t}>{t === 'All' ? 'All Types' : (getQuestionType(t)?.typeName || t)}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. SORT & LAYOUT */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Sort:</span>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as any)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '0.9rem' }}
                                >
                                    <option value="newest">📅 Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="title">Aa Title</option>
                                    <option value="level">⚡ Difficulty</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                        background: viewMode === 'grid' ? 'white' : 'transparent',
                                        boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        fontWeight: 500, color: viewMode === 'grid' ? '#0f172a' : '#64748b'
                                    }}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                        background: viewMode === 'list' ? 'white' : 'transparent',
                                        boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        fontWeight: 500, color: viewMode === 'list' ? '#0f172a' : '#64748b'
                                    }}
                                >
                                    List
                                </button>
                            </div>
                        </div>

                        {/* 3. BULK ACTIONS (Conditional) */}
                        {bankSelectedIds.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid #e2e8f0' }}>
                                <button onClick={handleDeleteSelectedBank} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                    Delete ({bankSelectedIds.length})
                                </button>
                                <button onClick={handleExportBank} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                    Export
                                </button>
                            </div>
                        )}

                        {/* 4. NEW BUTTON */}
                        <button
                            onClick={() => setViewState('dashboard')}
                            className="btn-animate"
                            style={{
                                background: '#0891b2', border: 'none', color: 'white',
                                padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                                marginLeft: 'auto', boxShadow: '0 4px 6px -1px rgba(8, 145, 178, 0.2)'
                            }}
                        >
                            + New
                        </button>
                    </div>

                    {filteredBankItems.length === 0 ? (
                        <EmptyState
                            title={searchQuery ? "No Matches Found" : "Item Bank is Empty"}
                            message={searchQuery ? "Try adjusting your search terms or filters." : "Generate some questions to get started."}
                            actionLabel={searchQuery ? "Clear Filters" : "Generate New Questions"}
                            onAction={searchQuery ? () => { setSearchQuery(''); setBankCategoryFilter('All'); } : () => setViewState('dashboard')}
                            icon="🔍"
                        />
                    ) : (
                        <ResultsGrid
                            items={filteredBankItems}
                            onEditItem={handleEditItem}
                            onDelete={handleDeleteFromBank}
                            selectionMode={true}
                            selectedIds={bankSelectedIds}
                            onToggleSelection={toggleBankSelection}
                            viewMode={viewMode}
                        />
                    )}
                </div>
            )}

            {viewState === 'authoring' && activeItem && (
                <>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button onClick={() => setViewState(generatedBatch.includes(activeItem) ? 'review' : 'bank')} style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '6px' }}>
                            ← Back
                        </button>
                        <div style={{ color: '#94a3b8' }}>Editing: {activeItem.metadata.title}</div>
                    </header>
                    <div className="card">
                        <ItemAuthoring item={activeItem} onSave={handleUpdateItem} />
                    </div>
                </>
            )}
        </div>
    );
};
