import React, { useState, useEffect } from 'react';
import { BowTieRenderer } from './renderers/BowTieRenderer';
import { MatrixRenderer } from './renderers/MatrixRenderer';
import { HighlightRenderer } from './renderers/HighlightRenderer';
import { ClozeRenderer } from './renderers/ClozeRenderer';
import { SATARenderer } from './renderers/SATARenderer';
import { SingleChoiceRenderer } from './renderers/SingleChoiceRenderer';
import { TrendRenderer } from './renderers/TrendRenderer';
import { OrderedResponseRenderer } from './renderers/OrderedResponseRenderer';
import { DropClozeRenderer } from './renderers/DropClozeRenderer';
import { HotSpotRenderer } from './renderers/HotSpotRenderer';
import { CalculationRenderer } from './renderers/CalculationRenderer';

// --- SHARED TYPES ---
interface QuestionConfig {
    type: string;
    id?: string;
    stem?: string;
    prompt?: string;
    [key: string]: any;
}



// --- DATA NORMALIZER ---
export const normalizeConfig = (raw: any): QuestionConfig => {
    if (!raw) return { type: 'unknown' } as QuestionConfig;

    // 0. TYPE INFERENCE (If type is missing or generic)
    const norm = { ...raw };

    if (!norm.type || norm.type === 'unknown') {
        if (norm.typeId) norm.type = norm.typeId;
        else if (norm.itemType) norm.type = norm.itemType;
        // Heuristics
        else if (norm.bowTieConfiguration || (norm.conditions && norm.actions && norm.parameters)) norm.type = 'bow-tie';
        else if (norm.trendData) norm.type = 'trend';
        else if (norm.orderedOptions) norm.type = 'ordered-response';
        else if (norm.cloze || (norm.sentences && norm.sentences.some((s: any) => s.dropdowns))) norm.type = 'cloze';
        else if (norm.matrix || (norm.rows && norm.columns)) norm.type = 'matrix';
        else if (norm.highlightText || (norm.text && norm.text.includes('<span'))) norm.type = 'highlight';
        else if (norm.sataOptions) norm.type = 'multiple-response';
        else if (norm.options && norm.options.some((o: any) => o.isCorrect)) {
            // Smart Heuristic: If multiple correct, it's SATA. If only 1, Single Response.
            const correctCount = norm.options.filter((o: any) => o.isCorrect).length;
            norm.type = correctCount > 1 ? 'multiple-response' : 'single-response';
        }
        else if (norm.responseOptions) norm.type = 'single-response';
        // CALCULATION HEURISTIC: Detect by unique structure fields
        else if (norm.correctValue !== undefined || norm.inputLabel || norm.acceptableRange ||
            norm.structure?.correctValue !== undefined || norm.structure?.inputLabel || norm.structure?.acceptableRange) {
            norm.type = 'calculation';
        }
        else if (String(norm.type).includes('calculation') || String(norm.type).includes('numeric') || String(norm.type).includes('12_')) norm.type = 'calculation';
    }

    // 0.5 Explicit Type Aliases
    if (norm.type === 'multiple-choice') norm.type = 'single-response';

    // 1. Unified Prompt/Stem
    if (!norm.prompt) {
        // Handle stem as direct string (common AI output)
        if (typeof norm.stem === 'string') norm.prompt = norm.stem;
        else if (norm.stem?.promptText) norm.prompt = norm.stem.promptText;
        else if (norm.itemStem?.en) norm.prompt = norm.itemStem.en;
        else if (norm.cloze?.taskPrompt?.en) norm.prompt = norm.cloze.taskPrompt.en;
        else if (norm.task?.instruction) norm.prompt = norm.task.instruction;
        else if (norm.stimulus?.prompt?.en) norm.prompt = norm.stimulus.prompt.en;
        else if (norm.structure?.prompt) norm.prompt = norm.structure.prompt;
    }

    // 1.5 Unified Rationale (Catch-all)
    if (!norm.rationale) {
        if (norm.explanation) norm.rationale = norm.explanation;
        else if (norm.rational) norm.rationale = norm.rational; // Catch typo
        else if (norm.answerExplanation) norm.rationale = norm.answerExplanation;
    }

    // 2. Unified Options/Choices
    if (!norm.options) {
        if (norm.responseOptions) {
            norm.options = norm.responseOptions.map((opt: any, idx: number) => ({
                id: opt.id || `opt_${idx}`,
                text: typeof opt.text === 'object' ? opt.text.en : opt.text,
                isCorrect: opt.isCorrect,
                rationale: typeof opt.rationale === 'object' ? opt.rationale.en : opt.rationale
            }));
        } else if (norm.task?.options) {
            norm.options = norm.task.options.map((opt: any, idx: number) => ({
                id: opt.id || `opt_${idx}`,
                text: opt.text,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale
            }));
        } else if (norm.sataOptions) {
            norm.options = norm.sataOptions.map((opt: any, idx: number) => ({
                id: opt.id || `sata_${idx}`,
                text: typeof opt.text === 'object' ? opt.text.en : opt.text,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale
            }));
        }
    }

    // 3. Type-Specific Normalization

    // CLOZE / DROPDOWN / DROP-CLOZE
    if (String(norm.type).includes('cloze') || String(norm.type).includes('dropdown') || String(norm.type).includes('drop-cloze')) {
        // FIX: Preserve drop-cloze type so it uses DropClozeRenderer
        // Only normalize to 'cloze' if NOT already drop-cloze
        const isDropCloze = String(norm.type).includes('drop-cloze');
        if (!isDropCloze) {
            norm.type = 'cloze';
        }

        // [FIX] Convert legacy/simple 'text' to 'sentences' structure
        // But SKIP for drop-cloze which uses direct text + dropdowns format
        if (norm.text && !norm.sentences && !norm.cloze?.sentences && !isDropCloze) {
            norm.sentences = [{
                sentenceId: 's1',
                text: norm.text,
                dropdowns: norm.dropdowns || norm.blanks
            }];
        }

        if ((norm.cloze?.sentences) && !norm.sentences) {
            norm.sentences = norm.cloze.sentences.map((s: any) => {
                let text = typeof s.template === 'object' ? s.template.en : s.template;

                const dropdowns: any[] = [];
                let blankCounter = 0;

                // Replace [Anything] with %BLANKn%
                const processedText = text.replace(/\[(.*?)\]/g, () => {
                    const dConfig = s.dropdowns?.[blankCounter];
                    const blankId = `BLANK${blankCounter + 1}`;
                    blankCounter++;

                    if (dConfig) {
                        dropdowns.push({
                            id: blankId,
                            options: dConfig.options?.itemSchema?.map((o: any) => ({
                                id: o.key,
                                text: typeof o.text === 'object' ? o.text.en : o.text,
                                isCorrect: o.correct || o.isCorrect
                            })) || dConfig.options
                        });
                    } else {
                        dropdowns.push({ id: blankId, options: [{ text: 'Option 1' }, { text: 'Option 2' }] });
                    }

                    return `%${blankId}%`;
                });

                return {
                    id: s.sentenceId,
                    text: processedText,
                    dropdowns: dropdowns
                };
            });
        }

        // Normalize existing sentences (e.g. from Standalone Mock using 'blanks')
        if (norm.sentences) {
            norm.sentences = norm.sentences.map((s: any) => {
                if (s.blanks && !s.dropdowns) {
                    return { ...s, dropdowns: s.blanks };
                }
                return s;
            });
        }
    }

    // HIGHLIGHT
    if (String(norm.type).includes('highlight')) {
        norm.type = 'highlight';
        if (!norm.text) {
            if (norm.highlightText) norm.text = norm.highlightText;
            else if (norm.stimulus?.narrative?.en) norm.text = norm.stimulus.narrative.en;
            else if (norm.vignette?.narrative) norm.text = norm.vignette.narrative;
        }

        if (norm.text && !norm.text.includes('<span id=')) {
            const words = norm.text.split(' ');
            norm.text = words.map((w: string, i: number) => `<span id="hl_${i}">${w}</span>`).join(' ');
        }

        // Ensure correct answers are passed through
        if (!norm.correct) {
            norm.correct = norm.correctAnswers || norm.correctIds || norm.key || norm.correctResponse || [];
        }
    }

    // TREND
    if (String(norm.type).includes('trend')) {
        norm.type = 'trend';
        if (norm.trendData && !norm.trendTable) {
            norm.trendTable = generateTrendTableHtml(norm.trendData);
        }
        if (!norm.questionFormat) {
            norm.questionFormat = 'sata';
            if (norm.options && norm.options.length > 0) {
                const correctCount = norm.options.filter((o: any) => o.isCorrect).length;
                if (correctCount === 1) norm.questionFormat = 'single';
            }
        }
    }

    // BOWTIE
    if (String(norm.type).includes('bow')) {
        norm.type = 'bow-tie';
        if (norm.bowTieConfiguration) {
            const btc = norm.bowTieConfiguration;
            if (!norm.conditions) {
                const src = btc.conditionOptions || btc.conditions;
                norm.conditions = {
                    pool: src?.map((o: any, i: number) => ({ id: `c_${i}`, text: o.text, isCorrect: o.isCorrect })) || []
                };
            }
            if (!norm.actions) {
                const src = btc.actionOptions || btc.actions;
                norm.actions = {
                    pool: src?.map((o: any, i: number) => ({ id: `a_${i}`, text: o.text, isCorrect: o.isCorrect })) || []
                };
            }
            if (!norm.parameters) {
                const src = btc.parameterOptions || btc.parameters;
                norm.parameters = {
                    pool: src?.map((o: any, i: number) => ({ id: `p_${i}`, text: o.text, isCorrect: o.isCorrect })) || []
                };
            }
        }

        // Handle Direct Arrays (Mock Data)
        if (Array.isArray(norm.actions) && !norm.actions.pool) {
            norm.actions = { pool: norm.actions };
        }
        if (Array.isArray(norm.conditions) && !norm.conditions.pool) {
            norm.conditions = { pool: norm.conditions };
        }
        if (Array.isArray(norm.parameters) && !norm.parameters.pool) {
            norm.parameters = { pool: norm.parameters };
        }
    }

    // MATRIX
    if (String(norm.type).includes('matrix')) {
        norm.type = 'matrix';
        if (!norm.rows && norm.matrix?.rows) norm.rows = norm.matrix.rows;
        if (!norm.columns && norm.matrix?.columns) norm.columns = norm.matrix.columns;

        // [FIX] Support 'options' array structure (AI Generation Fallback)
        // If rows are missing but we have options with columns, transform them.
        if (!norm.rows && norm.options && Array.isArray(norm.options) && !norm.columns) {
            // 1. Deduce Global Columns from the first option
            if (norm.options[0]?.columns) {
                norm.columns = norm.options[0].columns.map((c: any, idx: number) => ({
                    id: c.id || `c_${idx}`,
                    label: c.label || c.text || `Col ${idx + 1}`,
                }));
            }

            // 2. Deduce Rows and map correct answers
            norm.rows = norm.options.map((opt: any, idx: number) => {
                // Determine correct column IDs for this row
                const correctIds = opt.columns
                    ?.map((c: any, cIdx: number) => {
                        // Match the column ID generation logic above
                        return c.isCorrect ? (c.id || `c_${cIdx}`) : null;
                    })
                    .filter(Boolean) || [];

                return {
                    id: opt.id || `r_${idx}`,
                    text: opt.text || opt.label || `Row ${idx + 1}`,
                    correctColumnIds: correctIds // For Checkbox (Multi-Select)
                };
            });

            // [FIX] Auto-detect Checkbox mode (Multiple selections per row)
            const hasMultipleCorrect = norm.rows.some((r: any) => r.correctColumnIds && r.correctColumnIds.length > 1);
            if (hasMultipleCorrect) {
                norm.inputType = 'checkbox';
                norm.questionFormat = 'checkbox';
            }
        }

        // [FIX] Map text->label for columns (Golden Prompt compatibility)
        if (norm.columns) {
            norm.columns = norm.columns.map((c: any) => ({
                ...c,
                label: c.label || c.text
            }));
        }
    }

    // ORDERED RESPONSE (Drag/Drop)
    if (String(norm.type).includes('ordered') || String(norm.type).includes('drag-drop')) {
        norm.type = 'ordered-response';
        if (norm.orderedOptions && (!norm.options || norm.options.length === 0)) {
            norm.options = norm.orderedOptions.map((o: any, idx: number) => ({
                id: o.id || `ord_${idx}`,
                text: o.text,
                rationale: o.rationale
            }));
        }
    }

    // MULTIPLE RESPONSE (SATA)
    if (String(norm.type).includes('multiple-response') || String(norm.type).includes('sata')) {
        norm.type = 'multiple-response';
        if (!norm.options && norm.sataOptions) {
            norm.options = norm.sataOptions.map((opt: any, idx: number) => ({
                id: opt.id || `sata_${idx}`,
                text: typeof opt.text === 'object' ? opt.text.en : opt.text,
                isCorrect: opt.isCorrect,
                rationale: opt.rationale
            }));
        }
    }

    // CALCULATION / NUMERIC
    if (String(norm.type).toLowerCase().includes('calculation') || String(norm.type).toLowerCase().includes('numeric') || String(norm.type).includes('12_')) {
        norm.type = 'calculation';
    }
    // Flatten structure for calculation items
    if (norm.type === 'calculation' && norm.structure) {
        if (norm.structure.correctValue !== undefined) norm.correctValue = norm.structure.correctValue;
        if (norm.structure.answer !== undefined) norm.answer = norm.structure.answer;
        if (norm.structure.inputLabel) norm.inputLabel = norm.structure.inputLabel;
        if (norm.structure.units) norm.units = norm.structure.units;
        if (norm.structure.label) norm.label = norm.structure.label;
        if (norm.structure.acceptableRange) norm.acceptableRange = norm.structure.acceptableRange;
        if (norm.structure.prompt && !norm.prompt) norm.prompt = norm.structure.prompt;
    }

    // --- RANDOMIZATION ---
    // Helper to shuffle arrays safely
    const shuffle = (array: any[]) => {
        if (!array || array.length <= 1) return array;
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    // Apply Randomization to Options (Standard Types & Trend)
    // We check for 'multiple-choice' explicitly as it's a common alias for single-response in our prompt templates
    if (norm.options && !norm._shuffled_opts && (
        norm.type === 'single-response' ||
        norm.type === 'multiple-response' ||
        norm.type === 'sata' ||
        norm.type === 'trend' ||
        norm.type === 'multiple-choice'
    )) {
        norm.options = shuffle(norm.options); // Enabled randomization
        norm._shuffled_opts = true;
    }

    // Apply Randomization to Bow-Tie Pools
    if (norm.type === 'bow-tie' && !norm._shuffled) {
        if (norm.actions?.pool) norm.actions.pool = shuffle(norm.actions.pool);
        if (norm.conditions?.pool) norm.conditions.pool = shuffle(norm.conditions.pool);
        if (norm.parameters?.pool) norm.parameters.pool = shuffle(norm.parameters.pool);
        norm._shuffled = true;
    }

    // Apply Randomization to Matrix Rows
    if (norm.type === 'matrix' && norm.rows) {
        // norm.rows = shuffle(norm.rows); // Disabled to ensure Option Review sequence matches
    }

    // Apply Randomization to Cloze Dropdowns
    if (norm.type === 'cloze' && norm.sentences) {
        norm.sentences.forEach((s: any) => {
            if (s.dropdowns) {
                s.dropdowns.forEach((d: any) => {
                    if (d.options) {
                        d.options = shuffle(d.options);
                    }
                });
            }
        });
    }

    // FINAL SANITIZATION: Ensure text fields are strings
    const extractText = (val: any) => {
        if (typeof val === 'object' && val !== null) return val.en || val.text || JSON.stringify(val);
        return val;
    };

    if (norm.rationale) {
        // V2 PROTECTION: Do not stringify Rich Rationale objects (containing coreConcept, difficulty, etc.)
        const isV2Rationale = typeof norm.rationale === 'object' && (norm.rationale.coreConcept || norm.rationale.difficulty);
        if (!isV2Rationale) {
            norm.rationale = extractText(norm.rationale);
        }
    }
    if (norm.clinicalSummary) norm.clinicalSummary = extractText(norm.clinicalSummary);
    if (norm.strategy) norm.strategy = extractText(norm.strategy);

    if (norm.options) {
        norm.options = norm.options.map((o: any) => ({
            ...o,
            text: extractText(o.text),
            rationale: extractText(o.rationale)
        }));
    }

    // console.log('[ItemRenderer] Normalized Config (Randomized & Sanitized):', norm); // Disabled for production
    // [FIX] Sync Difficulty Level (Ensure Expert HUD matches Clinical Reasoning)
    if (norm.rationale?.difficulty?.level) {
        if (!norm.metadata) norm.metadata = {};
        norm.metadata.difficultyLevel = norm.rationale.difficulty.level;
    }

    return norm;
};

// Helper: Trend Table Generator
const generateTrendTableHtml = (data: any) => {
    if (!data || !data.timePoints) return '';
    const timeLabels = data.timePoints.map((tp: any) => tp.timeLabel);
    const params = data.parameters || [];
    let html = '<table style="width:100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9rem;">';
    html += '<thead><tr style="background:#f1f5f9; border-bottom: 2px solid #cbd5e1;">';
    html += '<th style="padding:8px; text-align:left;">Parameter</th>';
    timeLabels.forEach((t: string) => html += `<th style="padding:8px; text-align:center;">${t}</th>`);
    html += '</tr></thead><tbody>';
    if (params.length === 0) {
        html += '<tr><td colspan="' + (timeLabels.length + 1) + '" style="padding:16px; text-align:center;">No trend parameters defined.</td></tr>';
    } else {
        params.forEach((p: any, idx: number) => {
            html += `<tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? 'white' : '#f8fafc'}">`;
            html += `<td style="padding:8px; font-weight:600;">${p.name}</td>`;
            p.values?.forEach((v: string) => {
                html += `<td style="padding:8px; text-align:center;">${v}</td>`;
            });
            html += '</tr>';
        });
    }
    html += '</tbody></table>';
    return html;
};

// --- MAIN RUNTIME & HELPERS ---
const initializeAnswers = (config: QuestionConfig) => {
    if (!config) return null;
    const type = (config.type || '').toLowerCase();
    if (type.includes('bow-tie')) return { actions: [null, null], condition: null, parameters: [null, null] };
    if (type.includes('matrix')) return {};
    if (type.includes('highlight')) return [];
    if (type.includes('cloze')) return {};
    if (type.includes('multiple-response') || type.includes('sata')) return {};
    if (type.includes('trend')) {
        if (config.questionFormat === 'sata' || config.selectCount) return {};
        return null; // SC
    }
    if (type.includes('ordered-response')) {
        if (config.options && config.options.length > 0) {
            // Initial Scramble
            return [...config.options]
                .sort(() => Math.random() - 0.5)
                .map((o: any) => o.id);
        }
        return [];
    }
    if (type.includes('calculation')) return '';
    return null;
};

const validateAnswers = (answers: any, config: QuestionConfig) => {
    if (!answers && answers !== 0) return false;
    const type = (config.type || '').toLowerCase();

    if (type.includes('bow-tie')) {
        return answers.condition &&
            answers.actions?.every((a: any) => a) &&
            answers.parameters?.every((p: any) => p) &&
            answers.actions.length === 2 && answers.parameters.length === 2;
    }

    if (type.includes('highlight')) return Array.isArray(answers) && answers.length > 0;

    if (type.includes('multiple-response') || type.includes('sata') || (type.includes('trend') && (config.questionFormat === 'sata' || config.selectCount))) {
        const count = Object.values(answers).filter(Boolean).length;
        if (config.selectCount) return count === config.selectCount;
        return count > 0;
    }

    if (type.includes('matrix')) {
        if (!config.rows) return true;
        return config.rows.every((r: any) => {
            const rowAns = answers[r.id];
            if (!rowAns) return false;
            if (typeof rowAns === 'object') return Object.values(rowAns).some(Boolean);
            return true;
        });
    }

    if (type.includes('cloze')) {
        let blankCount = config.blanks?.length || 0;
        if (!blankCount && config.sentences) {
            config.sentences.forEach((s: any) => {
                // Count explicitly defined dropdowns first (most reliable)
                if (s.dropdowns?.length) {
                    blankCount += s.dropdowns.length;
                } else {
                    // Fallback: match any placeholder format %id%
                    const matches = s.text.match(/%[a-zA-Z0-9_.-]+%/g);
                    if (matches) blankCount += matches.length;
                }
            });
        }
        return Object.keys(answers).length === blankCount && Object.values(answers).every(Boolean);
    }

    if (type.includes('ordered-response')) return Array.isArray(answers) && answers.length > 0;

    if (type.includes('calculation')) return answers !== '' && answers !== null;
    return !!answers;
};

const InteractionDispatcher = (props: any) => {
    const { config } = props;
    const type = (config.type || '').toLowerCase();

    // console.log('[ItemRenderer] Dispatching Type:', type); // Disabled for production

    if (type.includes('bow-tie')) return <BowTieRenderer {...props} />;
    if (type.includes('matrix')) return <MatrixRenderer {...props} />;
    if (type.includes('highlight')) return <HighlightRenderer {...props} />;

    // FIX: Check drop-cloze BEFORE cloze (drop-cloze contains "cloze")
    if (type.includes('drop-cloze')) return <DropClozeRenderer {...props} />;
    if (type.includes('cloze')) return <ClozeRenderer {...props} />;

    if (type.includes('multiple-response') || type.includes('sata')) return <SATARenderer {...props} />;
    if (type.includes('trend')) return <TrendRenderer {...props} />;
    if (type.includes('ordered-response')) return <OrderedResponseRenderer {...props} />;

    // New Types
    if (type.includes('hot-spot')) return <HotSpotRenderer {...props} />;
    if (type.includes('calculation')) return <CalculationRenderer {...props} />;

    // Default Fallback
    return <SingleChoiceRenderer {...props} />;
};

const RationaleDisplay = ({ config }: { config: any }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Helper to format text with superscript references
    const formatText = (text: any) => {
        if (!text) return null;

        // Safety: Handle if text is an object (common with i18n data)
        const str = typeof text === 'object' ? (text.en || text.text || JSON.stringify(text)) : String(text);

        const parts = str.split(/\[(\d+)\]/g);
        return parts.map((part: string, i: number) => {
            if (i % 2 === 1) {
                return <sup key={i} style={{ fontSize: '0.6em', fontWeight: 700, marginLeft: '0px', color: '#94a3b8', verticalAlign: 'super' }}>{part}</sup>;
            }
            return part;
        });
    };

    const renderRationaleCard = (id: string, label: string, data: any, isCorrectOption: boolean) => {
        let statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#64748b' }}>ℹ️</span>;

        if (isCorrectOption) {
            statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#10b981' }}>✓</span>;
        } else {
            statusIcon = <span style={{ marginRight: '8px', fontSize: '1.2em', color: '#e11d48' }}>✗</span>;
        }

        return (
            <div key={id} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: isCorrectOption ? '4px solid #10b981' : '4px solid #e11d48',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flexShrink: 0 }}>{statusIcon}</div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', lineHeight: '1.4' }}>{label}</div>
                        {isCorrectOption ?
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase' }}>Correct Option</span> :
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e11d48', textTransform: 'uppercase' }}>Incorrect Option</span>
                        }
                    </div>
                </div>

                <div style={{ marginLeft: '32px', fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
                    {typeof data === 'string' ? formatText(data) : (
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600, color: isCorrectOption ? '#059669' : '#be123c' }}>
                                    {isCorrectOption ? "Why this is correct:" : "Why this is incorrect:"}
                                </span>{" "}
                                {formatText(data.detailedReason || data.text || "No detailed rationale provided.")}
                            </div>
                            {data.citation && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Source: {data.citation}</div>}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div id="rationale-section" style={{ marginTop: '2rem', scrollMarginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Rationale & Educational Key</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ background: 'transparent', border: 'none', color: '#0891b2', fontWeight: 600, cursor: 'pointer' }}
                >
                    {isExpanded ? 'Hide' : 'Show'}
                </button>
            </div>

            {isExpanded && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>

                    {/* KEY TAKEAWAY */}
                    {(config.clinicalSummary || config.rationale) && (
                        <div style={{
                            background: 'rgba(245,158,11,0.1)',
                            borderLeft: '4px solid #f59e0b',
                            padding: '16px',
                            borderRadius: '0 8px 8px 0',
                            marginBottom: '24px',
                            display: 'flex', gap: '12px'
                        }}>
                            <span style={{ fontSize: '24px' }}>💡</span>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '4px' }}>Key Takeaway</div>
                                <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.5' }}>
                                    {formatText(config.clinicalSummary || config.rationale)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTION CARDS */}
                    <div style={{ marginBottom: '24px' }}>
                        {/* Iterate same logic as before but using new card renderer */}
                        {(config.rationales || (config.type === 'highlight' && config.rationales)) && (
                            Object.entries(config.rationales).map(([key, text]: any, index: number) => {
                                // Simplify highlight label extraction for this pass
                                let label = key;
                                if (config.type === 'highlight' && config.text) {
                                    const snippetMatch = new RegExp(`<span[^>]*id=["']${key}["'][^>]*>(.*?)<\\/span>`, 'i').exec(config.text);
                                    if (snippetMatch && snippetMatch[1]) label = snippetMatch[1].trim();
                                    else label = `Highlight ${index + 1}`;
                                }

                                const correctArray = config.correct || config.correctAnswers || [];
                                const isCorrectOption = correctArray.includes(key);
                                // Pass selection status if needed for badge, but per prompt we rely on "Correct Option" / "Incorrect Option" static state
                                return renderRationaleCard(key, label, text, isCorrectOption);
                            })
                        )}

                        {/* Fallbacks */}
                        {/* Generic Options Fallback */}
                        {(config.options || config.orderedOptions)?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(opt.id, opt.text, opt.rationale, opt.isCorrect)
                        )}

                        {/* Bow-Tie Specific Pools */}
                        {config.actions?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`act_${opt.id}`, `Action: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {config.conditions?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`cond_${opt.id}`, `Condition: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {config.parameters?.pool?.map((opt: any) =>
                            opt.rationale && renderRationaleCard(`param_${opt.id}`, `Parameter: ${opt.text}`, opt.rationale, opt.isCorrect)
                        )}
                        {/* ... map other pools if needed ... */}
                    </div>

                    {/* TEST STRATEGY */}
                    <div style={{
                        background: 'rgba(59,130,246,0.1)',
                        borderLeft: '4px solid #3b82f6',
                        padding: '16px',
                        borderRadius: '0 8px 8px 0',
                        display: 'flex', gap: '12px'
                    }}>
                        <span style={{ fontSize: '24px' }}>🎯</span>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>Test-Taking Strategy</div>
                            <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.5' }}>
                                {config.strategy ? formatText(config.strategy) : "Focus on prioritizing the most urgent findings first."}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

// --- COMPONENT ---
// --- COMPONENT ---
// --- COMPONENT ---
export const renderQuestion = (
    config: QuestionConfig,
    mode: 'student' | 'author' | 'review' = 'student',
    onComplete?: (res: any) => void,
    // New Controlled Props
    answers?: any,
    onAnswersChange?: (ans: any) => void,
    isSubmitted?: boolean,
    hideFooter?: boolean,
    scale?: number
) => {
    return <QuestionRuntime
        config={config}
        mode={mode}
        onComplete={onComplete}
        controlledAnswers={answers}
        onAnswersChange={onAnswersChange}
        controlledIsSubmitted={isSubmitted}
        hideFooter={hideFooter}
        scale={scale}
    />;
};

interface QuestionRuntimePropsV2 {
    config: QuestionConfig;
    onComplete?: (result: any) => void;
    mode?: 'student' | 'author' | 'review';
    controlledAnswers?: any;
    onAnswersChange?: (ans: any) => void;
    controlledIsSubmitted?: boolean;
    hideFooter?: boolean;
    scale?: number;
}

const QuestionRuntime: React.FC<QuestionRuntimePropsV2> = (props) => {
    return (
        <React.Fragment>
            <QuestionRuntimeInner {...props} />
        </React.Fragment>
    );
};

// Inner component to handle memoization properly
const QuestionRuntimeInner: React.FC<QuestionRuntimePropsV2 & { rawConfig?: any }> = ({
    config: rawConfig,
    mode,
    onComplete,
    controlledAnswers,
    onAnswersChange,
    controlledIsSubmitted,
    hideFooter,
    scale = 1
}) => {
    const config = React.useMemo(() => normalizeConfig(rawConfig), [rawConfig]);

    // Internal state (fallback)
    const [internalAnswers, setInternalAnswers] = useState<any>(null);
    const [internalIsSubmitted, setInternalIsSubmitted] = useState(false);
    const [showRationale, setShowRationale] = useState(mode === 'author');

    // Determine effective state (Controlled vs Internal)
    const answers = controlledAnswers !== undefined ? controlledAnswers : internalAnswers;
    const isSubmitted = controlledIsSubmitted !== undefined ? controlledIsSubmitted : internalIsSubmitted;

    // Handler wrapper
    const handleSetAnswers = (newAns: any) => {
        if (onAnswersChange) {
            onAnswersChange(newAns);
        } else {
            setInternalAnswers(newAns);
        }
    };

    useEffect(() => {
        if (controlledAnswers === undefined) {
            setInternalAnswers(initializeAnswers(config));
        }
        if (controlledIsSubmitted === undefined) {
            setInternalIsSubmitted(false);
        }
        setShowRationale(mode === 'author' || mode === 'review');
    }, [config, mode]); // removed dependencies to avoid reset loops if controlled

    const handleSubmit = () => {
        if (!validateAnswers(answers, config)) {
            alert("Please complete the required fields before submitting.");
            return;
        }
        setInternalIsSubmitted(true);
        setShowRationale(true);
        if (onComplete) onComplete({ answers, isSubmitted: true });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', zoom: scale }}>
            <div style={{ flex: 1 }}>
                <InteractionDispatcher
                    config={config}
                    answers={answers}
                    setAnswers={handleSetAnswers}
                    isSubmitted={isSubmitted}
                    mode={mode}
                />

                {/* Internal Rationale (Only if footer not hidden) */}
                {isSubmitted && !hideFooter && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-card-border)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legend:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: 'var(--color-success-500)', border: '1px solid var(--color-success-700)', borderRadius: '2px' }}></span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Correct Selection</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: 'var(--color-danger-500)', border: '1px solid var(--color-danger-700)', borderRadius: '2px' }}></span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Incorrect Selection</span>
                        </div>
                    </div>
                )}
            </div>

            {!hideFooter && (
                <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '1rem', background: 'var(--color-bg-surface)', padding: '1rem', borderRadius: '8px' }}>
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!validateAnswers(answers, config)}
                            className="btn-submit-exam"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-success-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: 'var(--color-success-100)', color: 'var(--color-success-700)', padding: '4px 8px', borderRadius: '4px' }}>Submitted</span>
                                {mode === 'author' && <span style={{ fontSize: '0.8em', color: 'var(--color-text-secondary)' }}>(Preview Mode: Rationales Visible)</span>}
                            </div>
                            {showRationale && <RationaleDisplay config={config} />}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

