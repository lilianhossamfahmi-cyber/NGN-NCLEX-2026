import React, { useEffect, useState, useCallback } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { getBankItems, deleteItemFromBank, saveItemToBank, updateItem, deleteBatchFromBank, repairAllItemsInBank, repairSelectiveItems } from '../../services/itemApiService';
import { syncItemToSupabase } from '../../services/itemSyncService';
import { enrichItemWithQuality } from '../../utils/autoQuality';
import { StudentPreviewModal } from '../../components/StudentPreviewModal';
import { Eye, Copy, ExternalLink, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, Zap, RefreshCcw, Trash2, Archive, CheckCircle, Download, Plus, Wand2, Lock, Save } from 'lucide-react';
import { AIBookFixerModal } from './AIBookFixerModal';
import { MagicFixModal } from './MagicFixModal';
import { AddItemModal } from './AddItemModal';

/**
 * Enhanced Admin Grid with Server-Side Pagination, Sorting, and Filtering.
 */

interface ItemBankGridProps {
    onEdit?: (id: string) => void;
}

export const ItemBankGrid: React.FC<ItemBankGridProps> = ({ onEdit }) => {
    // Data State
    const [items, setItems] = useState<MasterQuestionItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [repairing, setRepairing] = useState(false);
    const [repairProgress, setRepairProgress] = useState({ current: 0, total: 0 });
    const [savingId, setSavingId] = useState<string | null>(null);

    const handleRepairBank = async () => {
        if (!confirm('This will fetch ALL items from society and run them through the new Smart Repair pipeline. This may take a minute. Continue?')) return;

        setRepairing(true);
        try {
            const success = await repairAllItemsInBank((current, total) => {
                setRepairProgress({ current, total });
            });
            alert(`✅ Successfully repaired and updated ${success} items in the bank.`);
            fetchItems();
        } catch (err) {
            console.error(err);
            alert('❌ Bulk repair failed. Check console.');
        } finally {
            setRepairing(false);
        }
    };



    const handleToggleFreeze = async (item: MasterQuestionItem) => {
        const isFrozen = (item as any).metadata?.finalSaved;
        setSavingId(String(item.id));

        try {
            if (isFrozen) {
                // UNFREEZE FLOW
                const reason = prompt("UNFREEZE ITEM: Please provide a reason for reopening this finalized item. (Audit Trail)");
                if (!reason) return; // Cancelled

                const updated = {
                    ...item,
                    metadata: {
                        ...item.metadata,
                        finalSaved: false,
                        unfrozenAt: new Date().toISOString(),
                        lastChangeReason: reason
                    }
                };
                await updateItem(updated);
                await syncItemToSupabase(updated as any);
                alert("🔓 Item Unfrozen. Editing is now enabled.");
            } else {
                // FREEZE / FINAL SAVE FLOW
                if (!confirm("FINAL SAVE: This will lock the item as an approved snapshot.\n\nFuture schema updates will not affect it. To edit later, you must explicitly Unfreeze.\n\nProceed?")) return;

                const updated = {
                    ...item,
                    metadata: {
                        ...item.metadata,
                        finalSaved: true,
                        finalizedAt: new Date().toISOString(),
                        status: 'published' as any // Auto-publish on final save
                    }
                };
                await updateItem(updated);
                await syncItemToSupabase(updated as any);
                // alert("🔒 Item Finalized and Locked.");
            }
            await fetchItems();
        } catch (e) {
            console.error(e);
            alert("Error toggling freeze state");
        } finally {
            setSavingId(null);
        }
    };

    // Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filter State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Sort State
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const [previewItem, setPreviewItem] = useState<MasterQuestionItem | null>(null);
    const [fixItem, setFixItem] = useState<MasterQuestionItem | null>(null);
    const [magicFixItem, setMagicFixItem] = useState<MasterQuestionItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const LIMIT = 25;

    // Data fetching
    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getBankItems({
                page,
                limit: LIMIT,
                search,
                topic: topicFilter,
                type: typeFilter,
                status: statusFilter,
                sortField,
                sortDir
            });
            if (Array.isArray(result)) {
                setItems(result);
                setTotal(result.length);
            } else {
                setItems(result.items);
                setTotal(result.total);
            }
            // Clear selection on new page/filter
            // setSelectedIds(new Set()); // Optional: whether to persist selection across pages
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, topicFilter, typeFilter, statusFilter, sortField, sortDir]);

    // Debounce load on filter change? For simplicity, we trigger load on effect dependencies match
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Handlers
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc'); // Default new sort to desc
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        await deleteItemFromBank(id);
        fetchItems();
    };

    const handleDuplicate = async (item: MasterQuestionItem) => {
        const clone = JSON.parse(JSON.stringify(item));
        clone.id = crypto.randomUUID();
        clone.metadata = {
            ...clone.metadata,
            title: (clone.metadata?.title || 'Untitled') + ' (Copy)',
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await saveItemToBank(clone);
        fetchItems();
    };

    const handlePublish = async (item: MasterQuestionItem) => {
        const enriched = enrichItemWithQuality(item);
        (enriched as any).metadata = { ...(enriched as any).metadata, status: 'published' };
        await saveItemToBank(enriched);
        fetchItems();
    };

    const handleTopicChange = async (item: MasterQuestionItem, newTopic: string) => {
        (item as any).metadata = { ...(item as any).metadata, topic: newTopic };
        if (item.pedagogy) {
            item.pedagogy.clinicalFocus = newTopic;
        }
        await saveItemToBank(item);
        fetchItems();
    };

    // Selection Handlers
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === items.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(i => String(i.id))));
        }
    };

    // Bulk Mode Send
    const handleBulkSendToMode = async (mode: string) => {
        if (selectedIds.size === 0) return;
        const confirmMsg = `Send ${selectedIds.size} items to ${mode.toUpperCase()}?`;
        if (!window.confirm(confirmMsg)) return;

        const itemsToProcess = items.filter(i => selectedIds.has(String(i.id)));

        for (const item of itemsToProcess) {
            // Re-use logic for adding mode
            let modesToAdd = [mode];
            if (mode === 'all') {
                modesToAdd = ['exam', 'tutor', 'memory_master', 'survival', 'exam_builder', 'clinical_cases'];
                if (!(item as any).typeId?.includes('case-study')) {
                    modesToAdd = modesToAdd.filter(m => m !== 'clinical_cases');
                }
            }

            const currentModes = (item as any).allowed_modes || [];
            const newModes = Array.from(new Set([...currentModes, ...modesToAdd]));

            const updatedItem = {
                ...item,
                allowed_modes: newModes,
                metadata: {
                    ...item.metadata,
                    status: (item.metadata.status === 'draft' && mode !== 'exam_builder') ? 'published' : item.metadata.status
                }
            };

            await updateItem(updatedItem);
            await syncItemToSupabase(updatedItem as any);
        }

        alert(`Processed ${itemsToProcess.length} items.`);
        fetchItems();
        setSelectedIds(new Set());
    };

    // Helper functions for UI
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 border-green-200';
            case 'review_needed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'auto_deleted': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getModeBadgeColor = (mode: string) => {
        switch (mode) {
            case 'exam': return 'bg-red-50 text-red-700 border-red-100';
            case 'tutor': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'memory_master': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'survival': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'clinical_cases': return 'bg-teal-50 text-teal-700 border-teal-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    }

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const TOPIC_OPTIONS = [
        'Cardiology', 'Respiratory', 'Neurology', 'Pediatrics',
        'Pharmacology', 'Mental Health', 'Maternal', 'Critical Care',
        'Fundamentals', 'Leadership', 'Gastrointestinal', 'Endocrine', 'Renal', 'Musculoskeletal'
    ];

    const totalPages = Math.ceil(total / LIMIT);

    // --- NEW: SEND TO MODE Logic ---
    const handleSendToMode = async (item: MasterQuestionItem, mode: string) => {
        try {
            // Updated list of modes to add
            let modesToAdd: string[] = [];
            if (mode === 'all') {
                modesToAdd = ['exam', 'tutor', 'memory_master', 'survival', 'exam_builder', 'clinical_cases'];
                // Only add clinical_cases if it matches type
                if (!(item as any).typeId?.includes('case-study')) {
                    modesToAdd = modesToAdd.filter(m => m !== 'clinical_cases');
                }
            } else {
                modesToAdd = [mode];
            }

            // 1. Update Local State & DB (Optimistic UI)
            const currentModes = (item as any).allowed_modes || [];
            const newModes = Array.from(new Set([...currentModes, ...modesToAdd]));

            const updatedItem = {
                ...item,
                allowed_modes: newModes,
                metadata: {
                    ...item.metadata,
                    // If sending to a live mode, auto-publish if drafting
                    status: (item.metadata.status === 'draft' && mode !== 'exam_builder') ? 'published' : item.metadata.status
                }
            };

            // Call API to save to SQLite (Admin Side)
            await updateItem(updatedItem);

            // Sync to Supabase
            await syncItemToSupabase(updatedItem as any);
            alert(`✅ Item sent to ${mode.replace('_', ' ').toUpperCase()}!\n\n(Synced to Supabase)`);

            // Refresh Grid
            fetchItems();

        } catch (error) {
            console.error('Failed to send item to mode:', error);
            alert('❌ Error sending item. Check console.');
        }
    };

    // --- BULK ACTION HANDLERS ---
    const handleSmartRepair = async () => {
        if (!confirm(`Are you sure you want to perform SMART REPAIR on ${selectedIds.size} items? This may take a moment for AI generation.`)) return;

        setRepairing(true);
        try {
            const itemsToRepair = items.filter(i => selectedIds.has(String(i.id)));
            const fixedCount = await repairSelectiveItems(
                itemsToRepair,
                { autofill: true },
                (current, total) => console.log(`Repaired ${current}/${total}`)
            );

            setSelectedIds(new Set());
            await fetchItems();
            alert(`✅ Successfully repaired ${fixedCount} items with AI Autofill.`);
        } catch (e) {
            console.error(e);
            alert('❌ Selective repair failed. See console for details.');
        } finally {
            setRepairing(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${selectedIds.size} items?`)) return;

        setLoading(true);
        try {
            await deleteBatchFromBank(Array.from(selectedIds));
            setSelectedIds(new Set()); // Clear selection
            await fetchItems();
            alert('✅ Items deleted successfully.');
        } catch (e) {
            console.error(e);
            alert('❌ Bulk delete failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkStatus = async (status: 'published' | 'draft') => {
        if (!confirm(`Set ${selectedIds.size} items to ${status.toUpperCase()}?`)) return;

        setLoading(true);
        try {
            const itemsToUpdate = items.filter(i => selectedIds.has(String(i.id)));
            // We have to loop because we need full item data to sync
            // Ideally backend handles this, but for now we iterate to ensure sync
            let successCount = 0;

            for (const item of itemsToUpdate) {
                const updated = {
                    ...item,
                    metadata: { ...item.metadata, status: status }
                };
                // Local DB
                await updateItem(updated); // Syncs to Supabase internally inside updateItem or strictly call sync
                successCount++;
            }

            await fetchItems();
            alert(`✅ ${successCount} items updated to ${status}.`);
        } catch (e) {
            console.error(e);
            alert('❌ Bulk status update failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkExport = () => {
        const selectedItems = items.filter(i => selectedIds.has(String(i.id)));
        const blob = new Blob([JSON.stringify(selectedItems, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ngn_export_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Toolbar */}
            <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 items-center flex-1 min-w-[200px]">
                    <Search className="text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="p-2 border rounded text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                    <button
                        onClick={fetchItems}
                        className={`p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Refresh Items"
                        disabled={loading}
                    >
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>

                    <button
                        onClick={handleRepairBank}
                        className={`p-2 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 text-indigo-700 transition-colors flex items-center gap-2 ${repairing ? 'opacity-50' : ''}`}
                        title="Repair & Migrate All Items"
                        disabled={repairing}
                    >
                        {repairing ? (
                            <div className="flex items-center gap-2">
                                <RefreshCcw size={18} className="animate-spin" />
                                <span className="text-xs font-bold">Repairing {repairProgress.current}/{repairProgress.total}...</span>
                            </div>
                        ) : (
                            <Wand2 size={18} />
                        )}
                        {!repairing && <span className="text-sm font-bold">Repair All</span>}
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-2 bg-blue-600 border border-blue-700 rounded hover:bg-blue-700 text-white transition-colors flex items-center gap-2 font-bold px-3 shadow-sm"
                        title="Add New Item"
                    >
                        <Plus size={18} /> New Item
                    </button>
                </div>

                {/* Bulk Actions Toolbar */}
                {selectedIds.size > 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded border border-blue-200 animate-in fade-in overflow-x-auto">
                        <span className="text-xs font-bold text-blue-700 whitespace-nowrap">{selectedIds.size} Selected</span>

                        <div className="h-4 w-px bg-blue-200 mx-1"></div>

                        {/* SEND TO Buttons */}
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase font-bold text-blue-400">Send To:</span>
                            <button onClick={() => handleBulkSendToMode('exam')} className="text-[10px] bg-white border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 font-medium">Exam</button>
                            <button onClick={() => handleBulkSendToMode('tutor')} className="text-[10px] bg-white border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 font-medium">Tutor</button>
                            <button onClick={() => handleBulkSendToMode('all')} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold shadow-sm">ALL Modes</button>
                        </div>

                        <div className="h-4 w-px bg-blue-200 mx-1"></div>

                        {/* REPAIR Button */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleSmartRepair}
                                className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 font-bold shadow-sm flex items-center gap-1"
                                disabled={repairing}
                            >
                                <Zap size={12} /> {repairing ? 'Repairing...' : 'Smart Repair'}
                            </button>
                        </div>

                        <div className="h-4 w-px bg-blue-200 mx-1"></div>

                        {/* STATUS Buttons */}
                        <div className="flex items-center gap-1">
                            <button onClick={() => handleBulkStatus('published')} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-1 rounded hover:bg-green-50 font-medium flex items-center gap-1" title="Publish Selected">
                                <CheckCircle size={12} /> Publish
                            </button>
                            <button onClick={() => handleBulkStatus('draft')} className="text-[10px] bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 font-medium flex items-center gap-1" title="Unpublish (Draft)">
                                <Archive size={12} /> Unpublish
                            </button>
                        </div>

                        <div className="h-4 w-px bg-blue-200 mx-1"></div>

                        {/* DANGER Buttons */}
                        <div className="flex items-center gap-1">
                            <button onClick={handleBulkExport} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Export JSON">
                                <Download size={14} />
                            </button>
                            <button onClick={handleBulkDelete} className="p-1 hover:bg-red-100 rounded text-red-600" title="Delete Selected">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 items-center">
                    <Filter className="text-gray-400" size={18} />
                    <select
                        className="p-2 border rounded text-sm bg-white"
                        value={topicFilter}
                        onChange={e => { setTopicFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Topics</option>
                        {TOPIC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>

                    <select
                        className="p-2 border rounded text-sm bg-white"
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="review_needed">Review Needed</option>
                    </select>

                    <select
                        className="p-2 border rounded text-sm bg-white"
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Types</option>
                        <option value="matrix">Matrix</option>
                        <option value="bow-tie">Bow Tie</option>
                        <option value="trend">Trend</option>
                        <option value="highlight">Highlight</option>
                        <option value="case-study">Case Study</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold sticky top-0 z-10">
                        <tr>
                            <th className="p-3 border-b text-center w-10">
                                <input
                                    type="checkbox"
                                    checked={items.length > 0 && selectedIds.size === items.length}
                                    onChange={toggleSelectAll}
                                    className="cursor-pointer w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="p-3 border-b text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('created_at')}>
                                <div className="flex items-center gap-1">Date {sortField === 'created_at' && <ArrowUpDown size={12} />}</div>
                            </th>
                            <th className="p-3 border-b text-left">ID</th>
                            <th className="p-3 border-b text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('type_id')}>
                                <div className="flex items-center gap-1">Type {sortField === 'type_id' && <ArrowUpDown size={12} />}</div>
                            </th>
                            <th className="p-3 border-b text-left">Topic</th>
                            <th className="p-3 border-b text-center cursor-pointer hover:bg-gray-200" onClick={() => handleSort('difficulty_level')}>
                                <div className="flex items-center gap-1 justify-center">Lvl {sortField === 'difficulty_level' && <ArrowUpDown size={12} />}</div>
                            </th>
                            <th className="p-3 border-b text-center cursor-pointer hover:bg-gray-200" onClick={() => handleSort('quality_score')}>
                                <div className="flex items-center gap-1 justify-center">QI {sortField === 'quality_score' && <ArrowUpDown size={12} />}</div>
                            </th>
                            <th className="p-3 border-b text-left cursor-pointer hover:bg-gray-200" onClick={() => handleSort('status')}>
                                <div className="flex items-center gap-1">Status {sortField === 'status' && <ArrowUpDown size={12} />}</div>
                            </th>
                            <th className="p-3 border-b text-left">Send To</th>
                            {/* New Column for Sent Modes display */}
                            <th className="p-3 border-b text-left">Active Modes</th>
                            <th className="p-3 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {loading && (
                            <tr><td colSpan={11} className="p-8 text-center text-gray-500">Loading items...</td></tr>
                        )}
                        {!loading && items.length === 0 && (
                            <tr><td colSpan={11} className="p-8 text-center text-gray-500">No items found matching your criteria.</td></tr>
                        )}
                        {!loading && items.map(item => (
                            <tr key={item.id} className={`hover:bg-blue-50 transition-colors border-l-4 ${(item.tags || []).includes('SKELETON') ? 'border-purple-400 bg-purple-50/30' : 'border-transparent'} ${selectedIds.has(String(item.id)) ? '!bg-blue-100' : ''}`}>
                                <td className="p-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(String(item.id))}
                                        onChange={() => toggleSelection(String(item.id))}
                                        className="cursor-pointer w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3 whitespace-nowrap text-gray-500 text-xs">
                                    {formatDateTime((item as any).metadata?.createdAt ?? (item as any).created_at)}
                                </td>
                                <td className="p-3 font-mono text-xs text-blue-600 max-w-[100px] truncate" title={String(item.id)}>
                                    {String(item.id).substring(0, 8)}...
                                </td>
                                <td className="p-3 capitalize font-medium text-gray-700">
                                    {String((item as any).typeId ?? '').replace(/-/g, ' ')}
                                </td>
                                <td className="p-3">
                                    <select
                                        className="w-full text-xs p-1 border rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                        value={(item as any).pedagogy?.clinicalFocus || (item as any).metadata?.topic || ''}
                                        onChange={(e) => handleTopicChange(item, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="">— Select —</option>
                                        {TOPIC_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                        {/* Add current value if not in list to avoid hidden data */}
                                        {!TOPIC_OPTIONS.includes((item as any).pedagogy?.clinicalFocus || (item as any).metadata?.topic) && (
                                            <option value={(item as any).pedagogy?.clinicalFocus || (item as any).metadata?.topic}>
                                                {(item as any).pedagogy?.clinicalFocus || (item as any).metadata?.topic}
                                            </option>
                                        )}
                                    </select>
                                </td>
                                <td className="p-3 text-center">
                                    <span className="inline-block w-6 h-6 leading-6 rounded-full bg-gray-100 text-xs font-bold">
                                        {(item as any).pedagogy?.difficultyLevel ?? (item as any).metadata?.difficultyLevel ?? '-'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <span className={`font-bold ${(item as any).metadata?.score >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
                                        {(item as any).metadata?.score ?? 0}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle((item as any).metadata?.status ?? 'draft')}`}>
                                        {String((item as any).metadata?.status ?? 'draft').replace(/_/g, ' ')}
                                    </span>
                                </td>
                                {/* SEND TO ACTIONS */}
                                <td className="p-3 relative group">
                                    <div className="relative inline-block text-left">
                                        <button className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                                            Send To... ▾
                                        </button>
                                        {/* DROPDOWN MENU */}
                                        <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden group-hover:block">
                                            <div className="py-1">
                                                {['Exam', 'Tutor', 'Memory Master', 'Survival', 'Exam Builder'].map(mode => (
                                                    <button
                                                        key={mode}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendToMode(item, mode.toLowerCase().replace(' ', '_'));
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                    >
                                                        + {mode}
                                                    </button>
                                                ))}
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSendToMode(item, 'clinical_cases');
                                                    }}
                                                    disabled={!(item as any).typeId?.includes('case-study')}
                                                    className={`block w-full text-left px-4 py-2 text-sm ${(item as any).typeId?.includes('case-study')
                                                        ? 'text-purple-700 hover:bg-purple-50'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    + Clinical Cases (6Q Only)
                                                </button>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSendToMode(item, 'all');
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-50"
                                                >
                                                    + Send to ALL
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                {/* Active Modes Display */}
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                                        {((item as any).allowed_modes || []).length > 0 ? (
                                            (item as any).allowed_modes.map((mode: string) => (
                                                <span
                                                    key={mode}
                                                    className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${getModeBadgeColor(mode)}`}
                                                    title={mode}
                                                >
                                                    {mode.replace('_', ' ')}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">None</span>
                                        )}
                                    </div>
                                </td>
                                {/* Actions */}
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setPreviewItem(item)} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Preview">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => window.open(`/?mode=student&itemId=${item.id}`, '_blank')} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Open Live">
                                            <ExternalLink size={16} />
                                        </button>
                                        <button onClick={() => handleDuplicate(item)} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Clone">
                                            <Copy size={16} />
                                        </button>
                                        {onEdit && (
                                            <button onClick={() => onEdit(String(item.id))} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handlePublish(item)}
                                            className={`text-xs px-2 py-1 rounded ${(item as any).metadata?.status === 'published' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-100'}`}
                                        >
                                            {(item as any).metadata?.status === 'published' ? 'Republish' : 'Publish'}
                                        </button>
                                        <button onClick={() => setFixItem(item)} className="p-1 hover:bg-purple-100 rounded text-purple-600" title="AI BookFixer">
                                            <Wand2 size={16} />
                                        </button>

                                        {/* Final Save / Freeze Button */}
                                        <button
                                            onClick={() => handleToggleFreeze(item)}
                                            disabled={savingId === String(item.id)}
                                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-all ${savingId === String(item.id) ? 'opacity-70 cursor-wait' : ''} ${(item as any).metadata?.finalSaved ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}
                                            title={(item as any).metadata?.finalSaved ? "Item is Locked (Click to Unfreeze)" : "Final Save (Freeze Item)"}
                                        >
                                            {savingId === String(item.id) ? <RefreshCcw size={12} className="animate-spin" /> : ((item as any).metadata?.finalSaved ? <Lock size={12} /> : <Save size={12} />)}
                                            {savingId === String(item.id) ? 'Saving...' : ((item as any).metadata?.finalSaved ? 'Locked' : 'Save')}
                                        </button>

                                        <button onClick={() => handleDelete(String(item.id))} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100">
                                            Del
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing {items.length} of {total} items
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium">Page {page} of {totalPages || 1}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col relative">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg">Preview Case: {previewItem.id}</h3>
                                <div className="text-xs text-gray-500">{((previewItem as any).typeId || '').toUpperCase()} • {(previewItem as any).pedagogy?.clinicalFocus}</div>
                            </div>
                            <button onClick={() => setPreviewItem(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">Close</button>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-100 p-4">
                            <div className="bg-white shadow rounded-lg h-full overflow-hidden">
                                {/* @ts-ignore */}
                                <StudentPreviewModal
                                    item={previewItem}
                                    onClose={() => setPreviewItem(null)}
                                    enableAdminEditing={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI BookFixer Modal */}
            {fixItem && (
                <AIBookFixerModal
                    item={fixItem}
                    onClose={() => setFixItem(null)}
                    onSuccess={() => {
                        fetchItems(); // Refresh grid
                    }}
                />
            )}

            {/* AI Magic Fixer Modal (Smart Agent) */}
            {magicFixItem && (
                <MagicFixModal
                    item={magicFixItem}
                    onClose={() => setMagicFixItem(null)}
                    onSuccess={() => {
                        fetchItems(); // Refresh grid
                    }}
                />
            )}

            {showAddModal && (
                <AddItemModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={(newItem) => {
                        setShowAddModal(false);
                        fetchItems();
                        // AUTO-OPEN MAGIC FIXER FOR NEW ITEMS (To fill the skeleton)
                        setMagicFixItem(newItem);
                    }}
                />
            )}
        </div>
    );
};
