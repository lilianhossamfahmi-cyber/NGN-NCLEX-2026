import React, { useRef } from 'react';
import { ReferenceSource } from '../types/master-schema';

interface ReferenceLibraryPanelProps {
    references: ReferenceSource[];
    onReferencesChange: (refs: ReferenceSource[]) => void;
}

export const ReferenceLibraryPanel: React.FC<ReferenceLibraryPanelProps> = ({ references, onReferencesChange }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleReference = (id: string) => {
        const updated = references.map(r => r.referenceId === id ? { ...r, isActive: !r.isActive } : r);
        onReferencesChange(updated);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const type = file.name.split('.').pop()?.toLowerCase() as any || 'pdf';

            const newRef: ReferenceSource = {
                referenceId: crypto.randomUUID(),
                fileName: file.name,
                fileType: type,
                uploadDate: new Date().toISOString(),
                uploadedBy: 'User',
                topicTags: ['Uploaded', 'Pending Scan'],
                copyrightStatus: 'proprietary', // Default safety
                isActive: true
            };
            onReferencesChange([...references, newRef]);
        }
    };

    return (
        <div style={{ padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input
                    type="file"
                    accept=".pdf,.docx,.csv,.json"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        background: 'white',
                        border: '2px solid #0891b2',
                        borderRadius: '8px',
                        color: '#0891b2',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f0fdfa'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
                >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Upload Reference
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {references.map((ref) => (
                    <div
                        key={ref.referenceId}
                        onClick={() => toggleReference(ref.referenceId)}
                        style={{
                            background: ref.isActive ? 'rgba(8, 145, 178, 0.05)' : 'white',
                            border: ref.isActive ? '2px solid #0891b2' : '1px solid #e2e8f0',
                            padding: '16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            boxShadow: ref.isActive ? '0 4px 6px -1px rgba(8, 145, 178, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: '20px', height: '20px',
                                borderRadius: '4px',
                                border: ref.isActive ? 'none' : '2px solid #cbd5e1',
                                background: ref.isActive ? '#0891b2' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold', fontSize: '14px'
                            }}>
                                {ref.isActive && '✓'}
                            </div>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 700,
                                color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {ref.fileType}
                            </span>
                        </div>

                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '8px', lineHeight: '1.4', minHeight: '44px' }}>
                            {ref.fileName}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                            {ref.topicTags.slice(0, 3).map(tag => (
                                <span key={tag} style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                                {ref.uploadedBy.charAt(0)}
                            </div>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{ref.uploadedBy}</span>
                        </div>
                    </div>
                ))}

                {references.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#94a3b8' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
                        No references found. Upload a file to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
