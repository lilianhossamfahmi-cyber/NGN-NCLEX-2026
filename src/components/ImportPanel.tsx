import React, { useState } from 'react';
import { parseJsonInput, parseCsvInput, attemptAiJsonFix, aggressiveRepairJson } from '../services/importService';
import { MasterQuestionItem } from '../types/master-schema';

interface ImportPanelProps {
    onImport: (items: MasterQuestionItem[]) => void;
    onCancel: () => void;
}

export const ImportPanel: React.FC<ImportPanelProps> = ({ onImport, onCancel }) => {
    const [mode, setMode] = useState<'json' | 'csv'>('json');
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isFixing, setIsFixing] = useState(false);

    const handleLocalFix = () => {
        try {
            const fixed = aggressiveRepairJson(textInput);
            setTextInput(fixed);
            setError("🪄 Local Auto-Fix applied! We've cleaned syntax, unescaped quotes, and fixed common AI errors. Please click 'Parse & Import' to try again.");
        } catch (e: any) {
            setError("Local Auto-Fix encountered an error: " + e.message);
        }
    };

    const handleImport = async () => {
        setError(null);

        if (mode === 'csv') {
            const result = parseCsvInput(textInput);
            if (result.success && result.data) {
                onImport(result.data);
            } else {
                setError(result.error || "Unknown Import Error");
            }
            return;
        }

        // JSON Mode - Try Standard Parse First
        const result = await parseJsonInput(textInput);
        if (result.success && result.data) {
            onImport(result.data);
            return;
        }

        // If Standard Parse Fails, Attempt AI Fix (as fallback)
        setIsFixing(true);
        try {
            console.log("Standard Parse Failed, attempting AI Fix...");
            const aiResult = await attemptAiJsonFix(textInput);

            if (aiResult.success && aiResult.data) {
                onImport(aiResult.data);
            } else {
                // If AI also fails, we show a detailed error with a direct call to action
                const msg = `⚠️ JSON Parse Failed\n\n- Local Status: ${result.error}\n- AI Status: ${aiResult.error}\n\nOur '🪄 Local Auto-Fix' (top right) can often fix these structural issues by force-escaping clinical text. Give it a try!`;
                setError(msg);
            }
        } catch (e: any) {
            setError("Critical Error during Import: " + e.message);
        } finally {
            setIsFixing(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            setTextInput(evt.target?.result as string);
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ padding: '2rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#f8fafc', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Import Question Items</h2>
                {mode === 'json' && textInput.trim().length > 0 && (
                    <button
                        onClick={handleLocalFix}
                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                        🪄 Local Auto-Fix
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setMode('json')}
                    style={{
                        padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
                        background: mode === 'json' ? '#3b82f6' : '#334155', color: 'white', border: 'none'
                    }}
                >
                    Paste JSON
                </button>
                <button
                    onClick={() => setMode('csv')}
                    style={{
                        padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
                        background: mode === 'csv' ? '#3b82f6' : '#334155', color: 'white', border: 'none'
                    }}
                >
                    Upload CSV
                </button>
            </div>

            {error && <div style={{
                background: error.includes('applied') ? '#065f46' : '#7f1d1d',
                color: error.includes('applied') ? '#a7f3d0' : '#fca5a5',
                padding: '1rem', borderRadius: '6px', marginBottom: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem', border: '1px solid'
            }}>{error}</div>}

            <div style={{ marginBottom: '1.5rem' }}>
                {mode === 'json' ? (
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste JSON array, object, or AI-generated text here..."
                        style={{ width: '100%', height: '300px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace' }}
                        disabled={isFixing}
                    />
                ) : (
                    <div style={{ border: '2px dashed #475569', padding: '2rem', textAlign: 'center', borderRadius: '6px' }}>
                        <input type="file" accept=".csv" onChange={handleFileUpload} />
                        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Or paste CSV content below:</p>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            style={{ width: '100%', height: '200px', marginTop: '1rem', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', padding: '1rem' }}
                        />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                    onClick={onCancel}
                    disabled={isFixing}
                    style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: isFixing ? 'not-allowed' : 'pointer' }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleImport}
                    disabled={isFixing || !textInput.trim()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: isFixing ? '#64748b' : '#22c55e',
                        border: 'none',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: isFixing ? 'wait' : 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isFixing ? "Auto-Repairing..." : "Parse & Import"}
                </button>
            </div>
        </div>
    );
};
