import React, { useState } from 'react';
import { MasterQuestionItem } from '../types/master-schema';
import { getQuestionType } from '../registry';
import { StudentPreviewModal } from './StudentPreviewModal';

interface ResultsGridProps {
    items: MasterQuestionItem[];
    onEditItem: (item: MasterQuestionItem) => void;
    onDelete?: (id: string) => void;

    // Selection Props
    selectionMode?: boolean;
    selectedIds?: string[];
    onToggleSelection?: (id: string) => void;

    // View Config
    viewMode?: 'grid' | 'list';
}

const TYPE_COLORS: Record<string, string> = {
    'case-study': '#3B82F6',   // Blue
    'matrix': '#0891B2',       // Teal
    'bow-tie': '#EC4899',      // Pink
    'cloze': '#F59E0B',        // Amber
    'highlight': '#8B5CF6',    // Purple
    'ordered-response': '#10B981', // Emerald
    'sata': '#A855F7',         // Violet
    'default': '#64748B'       // Slate
};

const TYPE_ICONS: Record<string, string> = {
    'case-study': '📋',
    'matrix': '⊞',
    'bow-tie': '🎀',
    'cloze': '📝',
    'highlight': '🖊️',
    'ordered-response': '🔢',
    'sata': '☑️',
    'default': '❓'
};

export const ResultsGrid: React.FC<ResultsGridProps> = ({
    items,
    onEditItem,
    onDelete,
    selectionMode,
    selectedIds,
    onToggleSelection,
    viewMode = 'grid'
}) => {
    const [previewItem, setPreviewItem] = useState<MasterQuestionItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);


    // Helpers
    const getTypeColor = (typeId: string = '') => {
        if (!typeId) return TYPE_COLORS['default'];
        const key = Object.keys(TYPE_COLORS).find(k => (typeId || '').toLowerCase().includes(k)) || 'default';
        return TYPE_COLORS[key] || TYPE_COLORS['default'];
    };

    const getTypeIcon = (typeId: string = '') => {
        if (!typeId) return TYPE_ICONS['default'];
        const key = Object.keys(TYPE_ICONS).find(k => (typeId || '').toLowerCase().includes(k)) || 'default';
        return TYPE_ICONS[key] || TYPE_ICONS['default'];
    };

    const formatDateTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <style>
                {`
                /* GRID LAYOUT */
                .results-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @media (min-width: 768px) { .results-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1200px) { .results-grid { grid-template-columns: repeat(3, 1fr); } }

                /* LIST LAYOUT */
                .results-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                /* CARD STYLE */
                .item-card {
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                    position: relative;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                }
                .item-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                    border-color: #cbd5e1;
                }
                .item-card.selected {
                    border-color: #0891b2;
                    background-color: #f0fdfa;
                }

                /* LIST ROW STYLE */
                .item-list-row {
                    display: grid;
                    grid-template-columns: 40px minmax(200px, 2fr) 120px 100px 150px 100px; 
                    align-items: center;
                    gap: 16px;
                    padding: 12px 16px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .item-list-row:hover {
                    background: #f8fafc;
                }
                .item-list-row.selected {
                    background: #f0fdfa;
                    border-color: #0891b2;
                }

                /* UTILS */
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .btn-icon-ghost {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 4px;
                }
                .btn-icon-ghost:hover {
                     background: #f1f5f9;
                     color: #0891b2;
                }
                `}
            </style>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                    <h3>No items found</h3>
                </div>
            ) : viewMode === 'grid' ? (
                // GRID VIEW
                <div className="results-grid">
                    {paginatedItems.map((item) => {
                        const typeName = getQuestionType(item.typeId)?.typeName || item.typeId;
                        const typeColor = getTypeColor(item.typeId);
                        const typeIcon = getTypeIcon(item.typeId);
                        const isSelected = selectedIds?.includes(String(item.id));

                        return (
                            <div
                                key={item.id}
                                className={`item-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => selectionMode && onToggleSelection && onToggleSelection(String(item.id))}
                                style={{ borderLeft: `8px solid ${typeColor}`, position: 'relative', padding: '12px' }}
                            >
                                {selectionMode && (
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => { e.stopPropagation(); onToggleSelection?.(String(item.id)); }}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0891b2' }}
                                        />
                                    </div>
                                )}

                                {/* Top Row: Item Type & Source Badges - More Compact */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div className="badge" style={{ background: `${typeColor}20`, color: typeColor, border: `1px solid ${typeColor}40`, fontWeight: 700, fontSize: '10px' }}>
                                        <span style={{ marginRight: '4px', fontSize: '12px' }}>{typeIcon}</span> {typeName}
                                    </div>
                                    <div className="badge" style={{
                                        background: item.metadata?.sourceOrigin === 'upload' ? '#f8fafc' : '#eff6ff',
                                        color: item.metadata?.sourceOrigin === 'upload' ? '#64748b' : '#2563eb',
                                        border: item.metadata?.sourceOrigin === 'upload' ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                                        fontSize: '10px', padding: '1px 6px'
                                    }}>
                                        {item.metadata?.sourceOrigin === 'upload' ? '📥 Import' : '✨ AI'}
                                    </div>
                                </div>

                                {/* Title Area - Compact */}
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#0f172a', lineHeight: '1.3', fontWeight: 600, minHeight: '38px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {item.metadata?.title || "Untitled Question Item"}
                                </h4>

                                {/* Metadata Grid - Compact */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span>📅 {String(formatDateTime(item.metadata?.createdAt || '')).split(',')[0]}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{
                                            fontWeight: 700,
                                            color: ((item.content?.rationale?.difficulty?.level || item.pedagogy?.difficultyLevel) ?? 3) >= 4 ? '#ef4444' : '#64748b',
                                            background: ((item.content?.rationale?.difficulty?.level || item.pedagogy?.difficultyLevel) ?? 3) >= 4 ? '#fef2f2' : 'transparent',
                                            padding: '0 4px', borderRadius: '2px'
                                        }}>
                                            Lvl {(item.content?.rationale?.difficulty?.level || item.pedagogy?.difficultyLevel) ?? 3}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons - Compact */}
                                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                                        className="btn-icon-ghost"
                                        style={{ flex: 1, justifyContent: 'center', padding: '4px', fontSize: '12px' }}
                                    >
                                        👁️ Preview
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditItem(item); }}
                                        style={{
                                            flex: 1, background: '#0891b2', color: 'white', border: 'none', borderRadius: '4px',
                                            height: '28px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // LIST VIEW
                <div className="results-list">
                    <div style={{ display: 'grid', gridTemplateColumns: '40px minmax(200px, 2fr) 120px 100px 150px 100px', padding: '0 16px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                        <div></div>
                        <div>Title / Focus</div>
                        <div>Type</div>
                        <div>Level</div>
                        <div>Date</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                    </div>

                    {paginatedItems.map((item) => {
                        const typeName = getQuestionType(item.typeId)?.typeName || item.typeId;
                        const typeColor = getTypeColor(item.typeId);
                        const isSelected = selectedIds?.includes(String(item.id));

                        return (
                            <div
                                key={item.id}
                                className={`item-list-row ${isSelected ? 'selected' : ''}`}
                                onClick={() => selectionMode && onToggleSelection && onToggleSelection(String(item.id))}
                            >
                                <div onClick={(e) => e.stopPropagation()}>
                                    {selectionMode && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelection?.(String(item.id))}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0891b2' }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{item.metadata?.title || 'Untitled'}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{item.pedagogy?.clinicalFocus || 'General'}</div>
                                </div>

                                <div>
                                    <span className="badge" style={{ background: `${typeColor}20`, color: typeColor }}>
                                        {typeName}
                                    </span>
                                </div>

                                <div style={{ fontSize: '13px', color: '#475569' }}>
                                    Level {item.pedagogy?.difficultyLevel ?? 3}/5
                                </div>

                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                    {formatDateTime(item.metadata?.createdAt || '')}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                                        title="Preview"
                                        style={{ background: 'transparent', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        👁️
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditItem(item); }}
                                        title="Edit"
                                        style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        ✏️
                                    </button>
                                    {onDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) onDelete(item.id); }}
                                            title="Delete"
                                            style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}


            {/* PREVIEW MODAL */}
            {previewItem && (
                <StudentPreviewModal
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                />
            )}
        </>
    );
};
