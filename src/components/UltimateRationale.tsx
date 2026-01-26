import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type {
    UltimateRationaleProps,
    FullItemData,
    QuestionConfig,
    CanonicalRationale
} from '../types';
import { RationalePipeline } from '../services/RationalePipeline';
import { MatrixFeedback } from './feedback/MatrixFeedback';
import { OrderedFeedback } from './feedback/OrderedFeedback';
import { OptionReviewV2 } from './OptionReviewV2';
import { NCJMMPhase, OptionReview, OutcomeModel, MatrixRowAnalysis, CJFeedback, OrderedReview } from '../types/RationaleTypes';
import {
    X,
    XCircle,
    Brain,
    Activity,
    Target,
    Lightbulb,
    Zap,
    CheckCircle2,
    FileText,
    BookOpen,
    Microscope,
    AlertOctagon,
    ListChecks,
    ScrollText,
    Sparkles,
    Ban,
    Calculator,
    Timer,
    FlaskConical,
    ZoomIn,
    PenTool,
    Highlighter,
    Moon,
    Sun,
    GripVertical,
    Play,
    Pause,
    RotateCcw,
    Eraser,
    Trash2,
    StickyNote as StickyIcon,
    CheckSquare,
    Square,
    ChevronDown,
    AlertTriangle,
    GitBranch,
    Scale,
    Syringe,
    Info
} from 'lucide-react';
import { BowTieFeedback } from './feedback/BowTieFeedback';
import { HighlightFeedback } from './feedback/HighlightFeedback';
import ClozeFeedback from './feedback/ClozeFeedback';
import { BowTieReview } from '../services/RationalePipeline';
import { HighlightReview, ClozeReview } from '../types/RationaleTypes';



/* --------------------------------------------------------------
   2️⃣  HELPER COMPONENTS
   -------------------------------------------------------------- */

const InfoTooltip = ({ text, children, side = 'top' }: { text: string, children: React.ReactNode, side?: 'top' | 'bottom' }) => (
    <div className="group relative flex items-center gap-1 cursor-help">
        {children}
        <div className={`absolute ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 px-3 py-2 bg-black/90 backdrop-blur border border-white/10 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-48 text-center pointer-events-none`}>
            {text}
            <div className={`absolute ${side === 'top' ? 'top-full border-t-black/90' : 'bottom-full border-b-black/90'} left-1/2 -translate-x-1/2 border-8 border-transparent`} />
        </div>
    </div>
);

const formatBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;
    return (
        <div className="space-y-1 font-mono text-sm">
            {content.split('\n').map((line, i) => {
                const trimmed = line.trim();

                // Special Header: CORRECT RESULT (green prominent)
                if (trimmed.startsWith('### ✅') || trimmed.includes('CORRECT RESULT')) {
                    const text = trimmed.replace('### ', '').replace('✅ ', '');
                    return (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mt-2 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                            <span className="text-lg font-bold text-emerald-400">{formatBold(text)}</span>
                        </div>
                    );
                }

                // Special Header: HOW WE GOT IT (blue section)
                if (trimmed.includes('HOW WE GOT IT') || trimmed.includes('🟢')) {
                    const text = trimmed.replace('### ', '').replace('🟢 ', '');
                    return (
                        <h3 key={i} className="text-sm font-bold text-blue-400 mt-6 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            {formatBold(text)}
                        </h3>
                    );
                }

                // Special Header: Safety Check (amber warning)
                if (trimmed.includes('Safety Check') || trimmed.includes('🛡️')) {
                    const text = trimmed.replace('### ', '').replace('🛡️ ', '');
                    return (
                        <h3 key={i} className="text-sm font-bold text-amber-400 mt-6 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            {formatBold(text)}
                        </h3>
                    );
                }

                // Numbered Sections (1. The Setup, 2. The Math, etc.)
                if (/^\*\*\d+\./.test(trimmed)) {
                    const text = trimmed;
                    return (
                        <h4 key={i} className="text-sm font-bold text-slate-200 mt-4 mb-2">
                            {formatBold(text)}
                        </h4>
                    );
                }

                // Standard Headers (### )
                if (line.startsWith('### ')) {
                    const text = line.replace('### ', '');
                    return <h3 key={i} className="text-sm font-bold text-emerald-400 mt-6 mb-3 uppercase tracking-wider border-b border-emerald-500/20 pb-2">{formatBold(text)}</h3>;
                }

                // Bullet List (* )
                if (trimmed.startsWith('* ')) {
                    return (
                        <div key={i} className="flex gap-3 mb-2 ml-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            <span className="flex-1 text-slate-300 leading-relaxed">{formatBold(trimmed.replace('* ', ''))}</span>
                        </div>
                    );
                }

                // Separator (---)
                if (line.includes('---')) {
                    return <div key={i} className="h-px bg-slate-700 my-4" />;
                }

                // Empty line
                if (trimmed === '') return <div key={i} className="h-2" />;

                // Regular Paragraph
                return <p key={i} className="text-slate-300 leading-relaxed">{formatBold(line)}</p>;
            })}
        </div>
    );
};

/* --------------------------------------------------------------
   3️⃣  SUB-COMPONENTS: Functional Tools
   -------------------------------------------------------------- */

// --- Draggable Wrapper ---
const DraggableTool = ({ title, children, onClose, initialPos, theme, className = "" }: any) => {
    const [pos, setPos] = useState(initialPos);
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0 || (e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).closest('.no-drag')) return;
        setDragging(true);
        setRel({ x: e.clientX - pos.x, y: e.clientY - pos.y });
        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!dragging) return;
        setPos({ x: e.clientX - rel.x, y: e.clientY - rel.y });
        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging]);

    return (
        <div
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                zIndex: 2147483650, // Topmost
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
            }}
            className={`rounded-xl border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 ${className}`}
        >
            <div
                onMouseDown={onMouseDown}
                className="px-3 py-2 flex justify-between items-center cursor-move border-b bg-black/10 select-none"
                style={{ borderColor: theme.border }}
            >
                <span className="text-xs font-bold uppercase tracking-wide opacity-80">{title}</span>
                <button onClick={onClose} className="hover:text-red-400 no-drag">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="p-0 text-sm">
                {children}
            </div>
        </div>
    );
};

// --- Calculator ---
const CalculatorTool = ({ theme: _theme }: { theme: any }) => {
    const [display, setDisplay] = useState('0');
    const [newNumber, setNewNumber] = useState(true);

    const handlePress = (val: string) => {
        if (val === 'C') {
            setDisplay('0');
            setNewNumber(true);
        } else if (val === '=') {
            try {
                // eslint-disable-next-line no-eval
                setDisplay(String(eval(display)));
                setNewNumber(true);
            } catch {
                setDisplay('Error');
                setNewNumber(true);
            }
        } else {
            if (newNumber && !['+', '-', '*', '/'].includes(val)) {
                setDisplay(val);
                setNewNumber(false);
            } else {
                setDisplay(display === '0' ? val : display + val);
                setNewNumber(false);
            }
        }
    };

    const btnClass = "flex-1 h-12 text-sm font-medium border border-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center transition-colors";
    const opClass = "flex-1 h-12 text-sm font-bold bg-blue-500/20 text-blue-400 border border-white/5 hover:bg-blue-500/30 flex items-center justify-center";

    return (
        <div className="p-2 w-64">
            <div className="bg-black/40 text-right p-3 mb-2 rounded font-mono text-xl overflow-hidden truncate">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-1">
                {['7', '8', '9', '/'].map(k => <button key={k} onClick={() => handlePress(k)} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['4', '5', '6', '*'].map(k => <button key={k} onClick={() => handlePress(k)} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['1', '2', '3', '-'].map(k => <button key={k} onClick={() => handlePress(k)} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['C', '0', '=', '+'].map(k => <button key={k} onClick={() => handlePress(k)} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
            </div>
        </div>
    );
};

// --- Sticky Note ---
const StickyNote = ({ id, note, onDelete, onUpdate, initialPos }: any) => {
    const colors = {
        yellow: { bg: '#fef9c3', text: '#854d0e', border: '#eab308' },
        blue: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
        green: { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
        pink: { bg: '#fce7f3', text: '#9d174d', border: '#ec4899' },
    };

    const style = colors[note.color as keyof typeof colors] || colors.yellow;

    return (
        <DraggableTool
            title="Note"
            onClose={() => onDelete(id)}
            initialPos={initialPos}
            theme={{ card: style.bg, text: style.text, border: style.border }}
            className="w-64"
        >
            <div className="flex flex-col h-48">
                <div className="flex gap-1 p-2 border-b border-black/5 no-drag justify-center bg-black/5">
                    {(Object.keys(colors) as Array<keyof typeof colors>).map(c => (
                        <button
                            key={c}
                            onClick={() => onUpdate(id, { color: c })}
                            className={`w-4 h-4 rounded-full border border-black/20 ${note.color === c ? 'ring-2 ring-offset-1 ring-offset-transparent ring-black/30' : ''}`}
                            style={{ backgroundColor: colors[c].bg }}
                        />
                    ))}
                </div>
                <textarea
                    className="flex-1 bg-transparent p-3 text-sm resize-none focus:outline-none font-medium placeholder-black/30 leading-relaxed font-handwriting no-drag"
                    placeholder="Type clinical notes..."
                    value={note.text}
                    onChange={(e) => onUpdate(id, { text: e.target.value })}
                    autoFocus
                    spellCheck={false}
                    style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
                />
            </div>
        </DraggableTool>
    );
};

// --- Timer ---
const TimerTool = ({ theme: _theme }: { theme: any }) => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval: any;
        if (running) {
            interval = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [running]);

    const format = (t: number) => {
        const mins = Math.floor(t / 60);
        const secs = t % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 flex flex-col items-center w-64">
            <div className="text-4xl font-mono font-bold mb-4">{format(time)}</div>
            <div className="flex gap-2 w-full">
                <button
                    onClick={() => setRunning(!running)}
                    className={`flex-1 py-2 rounded flex items-center justify-center gap-2 font-bold transition-colors ${running ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
                >
                    {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {running ? 'Stop' : 'Start'}
                </button>
                <button
                    onClick={() => { setRunning(false); setTime(0); }}
                    className="p-2 rounded bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// --- Labs Reference (Expanded) ---
const LabsTool = ({ theme: _theme }: { theme: any }) => {
    const sections = [
        {
            title: "Chem 7 (BMP)",
            items: [
                { name: 'Na+', val: '135-145 mEq/L' },
                { name: 'K+', val: '3.5-5.0 mEq/L' },
                { name: 'Cl-', val: '98-106 mEq/L' },
                { name: 'CO2', val: '23-29 mEq/L' },
                { name: 'BUN', val: '10-20 mg/dL' },
                { name: 'Cr', val: '0.6-1.2 mg/dL' },
                { name: 'Glu', val: '70-100 mg/dL' },
            ]
        },
        {
            title: "CBC",
            items: [
                { name: 'WBC', val: '4.5-11.0 k/µL' },
                { name: 'Hgb (M)', val: '13.5-17.5 g/dL' },
                { name: 'Hgb (F)', val: '12.0-15.5 g/dL' },
                { name: 'Hct (M)', val: '41-50%' },
                { name: 'Hct (F)', val: '36-48%' },
                { name: 'Plt', val: '150-400 k/µL' },
            ]
        },
        {
            title: "Coagulation",
            items: [
                { name: 'PT', val: '11-13.5 sec' },
                { name: 'INR', val: '0.8-1.1 (Standard)' },
                { name: 'aPTT', val: '30-40 sec' },
            ]
        },
        {
            title: "ABG (Arterial)",
            items: [
                { name: 'pH', val: '7.35-7.45' },
                { name: 'pCO2', val: '35-45 mmHg' },
                { name: 'pO2', val: '80-100 mmHg' },
                { name: 'HCO3', val: '22-26 mEq/L' },
                { name: 'SaO2', val: '>95%' },
            ]
        },
        {
            title: "Lipid/Cardiac",
            items: [
                { name: 'Tot Chol', val: '<200 mg/dL' },
                { name: 'LDL', val: '<100 mg/dL' },
                { name: 'HDL', val: '>40 (M), >50 (F)' },
                { name: 'Trig', val: '<150 mg/dL' },
                { name: 'Trop I', val: '<0.03 ng/mL' },
                { name: 'BNP', val: '<100 pg/mL' },
            ]
        }
    ];

    return (
        <div className="h-[400px] w-72 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/20 select-none">
            {sections.map((section, idx) => (
                <div key={idx} className="mb-0">
                    <div className="sticky top-0 bg-black/20 backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90 border-b border-white/5">
                        {section.title}
                    </div>
                    <table className="w-full text-xs">
                        <tbody>
                            {section.items.map((lab, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="py-2 px-3 font-bold opacity-80">{lab.name}</td>
                                    <td className="py-2 px-3 text-right font-mono opacity-100 font-semibold">{lab.val}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

// --- Highlighter Controls ---
const HighlighterControls = ({ onColor, activeColor, onClear }: any) => {
    const colors = {
        yellow: '#fef08a',
        green: '#bbf7d0',
        pink: '#fbcfe8'
    };

    return (
        <div className="p-4 flex flex-col gap-4 w-64">
            <div className="text-xs text-center font-bold opacity-90 uppercase tracking-wide">
                Select Highlight Color
            </div>
            <div className="flex gap-2 justify-center">
                {(Object.keys(colors) as Array<keyof typeof colors>).map(c => (
                    <button
                        key={c}
                        onClick={() => onColor(c)}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${activeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                        style={{ backgroundColor: colors[c] }}
                    />
                ))}
            </div>
            <button
                onClick={onClear}
                className="py-2 px-3 rounded hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 mt-2"
            >
                <Trash2 className="w-3 h-3" /> Remove All Highlights
            </button>
        </div>
    );
};

// --- Drawing Controls ---
const DrawControls = ({ onColor, activeColor, onClear }: any) => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff'];

    return (
        <div className="p-4 flex flex-col gap-4 w-64">
            <div className="text-xs text-center font-bold opacity-90 uppercase tracking-wide">
                Pen Color
            </div>
            <div className="flex gap-2 justify-center">
                {colors.map(c => (
                    <button
                        key={c}
                        onClick={() => onColor(c)}
                        className={`w-8 h-8 rounded-full border-4 transition-all ${activeColor === c ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>
            <button
                onClick={onClear}
                className="py-2 px-3 rounded hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 mt-2"
            >
                <Eraser className="w-3 h-3" /> Clear Canvas
            </button>
        </div>
    );
};

/* --------------------------------------------------------------
   4️⃣  MAIN COMPONENT
   -------------------------------------------------------------- */
export const UltimateRationale = ({
    item,
    referenceInfo,
    difficulty,
    mnemonic,
    cheatSheet,
    strategy,
    itemId,
    activeTab,
    onTabChange,
    onNextQuestion,
    // Existing props to keep for sub-components or backward compatibility
    isOpen,
    onClose,
    outcome,
    cjmmStep = "clinical judgment",
    coreConcept,
    steps = [],
    goldenRule,
    pitfalls = [],
    answerAnalysis,
    trap,
    optionReviews,
    matrixRows,
    matrixColumns,
    cjFeedback,
    reviewUnits,
    bowTieReview,
    highlightReview,
    clozeReview,
    orderedReview,
    metadata,
    formulaMethod,
    dimensionalAnalysis,
    clinicalStrategy
}: UltimateRationaleProps) => {

    // ✅ NEW: Validate and structure rationale data for rendering
    const validatedRationale = useMemo(() => {
        console.log('🔍 UltimateRationale: Validating rationale structure...');

        const validated = {
            reference: referenceInfo || {
                anatomy: 'Reference information not available',
                physiology: 'Reference information not available',
                pharm: 'Reference information not available',
            },
            difficulty: difficulty || {
                level: 3,
                clinicalStrategy: 'Apply standard clinical reasoning',
                recommendedActions: [],
            },
            mnemonicData: mnemonic || {
                title: 'Clinical Tool',
                content: 'N/A',
                explanation: 'No memory aid available for this scenario.',
            },
            cheatSheetData: cheatSheet || {
                title: 'Quick Reference',
                points: [],
            },
            clinicalStrategy: strategy || clinicalStrategy || 'Apply standard clinical reasoning',
            itemId: itemId || (item as any)?.id || 'unknown',
        };

        console.log('✅ UltimateRationale: Rationale validation complete', validated);
        return validated;
    }, [referenceInfo, difficulty, mnemonic, cheatSheet, strategy, itemId, clinicalStrategy, item]);

    // ✅ OPTIONAL: Log rendering state
    useEffect(() => {
        console.log('📊 UltimateRationale: Rendering with active tab:', activeTab);
        console.log('📊 UltimateRationale: Validated rationale state:', validatedRationale);
    }, [activeTab, validatedRationale]);
    // Detect if this is a calculation item
    const isCalculation = useMemo(() => {
        return metadata?.type?.toLowerCase().includes('calculation') ||
            metadata?.type?.toLowerCase().includes('numeric') ||
            metadata?.correctValue !== undefined;
    }, [metadata]);

    // GENERIC FALLBACK DEFAULTS (No hardcoded clinical content)
    const GENERIC_DEFAULTS = {
        mnemonic: {
            title: "Not Available",
            content: "No mnemonic provided for this item.",
            explanation: "This clinical scenario does not have an associated learning mnemonic."
        },
        cheatSheet: {
            title: "Clinical Pearls",
            points: ["Review the rationale for key learning points.", "Focus on the clinical findings that led to the correct answer."]
        },
        referenceInfo: {
            anatomy: "No anatomical reference provided for this item.",
            physiology: "No physiological explanation provided for this item.",
            pharm: "No pharmacological information provided for this item."
        },
        trap: "Review the rationale to understand common mistakes for this item type.",
        answerAnalysis: "Review the option-by-option analysis above for detailed explanations.",
        goldenRule: "Always prioritize patient safety and use clinical judgment."
    };


    // --- SMART FALLBACK: Extract real numbers from content if available ---
    const promptText = metadata?.fullItem?.content?.structure?.prompt || metadata?.fullItem?.content?.text || "";

    const weightMatch = promptText.match(/(\d+(?:\.\d+)?) (?:lbs|pounds)/i);
    const weightDisplay = weightMatch ? `${weightMatch[1]} lbs` : "lbs";
    const kgDisplay = weightMatch ? `${(parseFloat(weightMatch[1]) / 2.2).toFixed(1)} kg` : "kg";

    // Try to find order (e.g. "administer 15 mg" or "Order: 15 mg")
    const doseMatch = promptText.match(/(?:administer|order:?|prescribed) (\d+(?:\.\d+)?) (mg|mcg)/i);
    const doseDisplay = doseMatch ? `${doseMatch[1]} ${doseMatch[2]}` : "Order Amount";

    // Try to find supply (e.g. "supply 160 mg/5 mL" or "available 160 mg / 5 mL")
    const supplyMatch = promptText.match(/(?:supply|available|have|hand):?.*?(\d+(?:\.\d+)?) (mg|mcg) ?(?:\/|in|per)? ?(\d+(?:\.\d+)?) (mL|tab)/i);
    const supplyDoseDisplay = supplyMatch ? `${supplyMatch[1]} ${supplyMatch[2]}` : "Supply Amount";
    const supplyVolDisplay = supplyMatch ? `${supplyMatch[3]} ${supplyMatch[4]}` : "Supply Vol";

    const CALC_DEFAULTS = {
        mnemonic: {
            title: "D.O.S.E.",
            content: "D-Desired dose, O-On-hand concentration, S-Solve using formula, E-Evaluate reasonability",
            explanation: "Use the formula: Dose = (Desired / On-Hand) × Quantity. Always verify units match and double-check your math."
        },
        cheatSheet: {
            title: "Medication Calculation Pearls",
            points: ["Convert lbs to kg: divide by 2.2", "Verify mg/kg/day vs mg/kg/dose", "Round to the nearest whole number unless specified", "Always double-check decimal placement"]
        },
        referenceInfo: {
            physiology: "Pediatric patients require weight-based dosing regarding metabolism. Always calculate doses using actual body weight unless otherwise specified.",
            anatomy: "Drug distribution varies by age. Infants have higher body water content, affecting drug volume of distribution.",
            pharm: "Safe medication administration relies on accurate math. Narrow therapeutic index drugs require double verification."
        },
        trap: "Watch for unit conversion errors, rounding too early, or confusing per-dose vs per-day orders.",
        answerAnalysis: `<h3>⚠️ Safety Check</h3><table class='calc-table'><tr><th>Check</th><th>Case Finding</th><th>Action</th></tr><tr><td>Weight</td><td>${weightDisplay}</td><td>Convert to <strong>${kgDisplay}</strong> (÷ 2.2)</td></tr><tr><td>Units</td><td>Order vs Supply</td><td>Ensure Match</td></tr></table><hr><h3>Method 1: Formula Method</h3><table class='calc-table'><tr><th>Variable</th><th>Case Finding</th></tr><tr><td><strong>D</strong> (Desired)</td><td>${doseDisplay}</td></tr><tr><td><strong>H</strong> (Have)</td><td>${supplyDoseDisplay}</td></tr><tr><td><strong>Q</strong> (Quantity)</td><td>${supplyVolDisplay}</td></tr></table><p class='equation-box'><strong>Equation:</strong> (D ÷ H) × Q = <strong>X mL</strong></p><hr><h3>Method 2: Dimensional Analysis</h3><p>Set up fractions so units cancel: (mL / mg) × (mg / kg) × (kg / lbs) × lbs</p><hr><h3>⛔ Common Error</h3><p>Using weight in pounds instead of kg results in an overdose! Always convert first.</p>`,
        goldenRule: "Always verify units, use the formula method, and double-check your math before administering any medication."
    };

    // Use item-specific data first, then fall back to calculation defaults for calc items, otherwise generic
    const effectiveMnemonic = useMemo(() => {
        if (mnemonic?.title && mnemonic.title !== 'Not Available') return mnemonic;

        const metaRationale = metadata?.rationale || metadata?.fullItem?.content?.rationale;
        if (metaRationale?.mnemonic?.title && metaRationale.mnemonic.title !== 'Not Available') {
            return metaRationale.mnemonic;
        }

        return isCalculation ? CALC_DEFAULTS.mnemonic : GENERIC_DEFAULTS.mnemonic;
    }, [mnemonic, isCalculation, metadata]);

    const effectiveCheatSheet = useMemo(() => {
        if (cheatSheet?.points && cheatSheet.points.length > 0) return cheatSheet;

        const metaRationale = metadata?.rationale || metadata?.fullItem?.content?.rationale;
        if (metaRationale?.cheatSheet?.points && metaRationale.cheatSheet.points.length > 0) {
            return metaRationale.cheatSheet;
        }

        return isCalculation ? CALC_DEFAULTS.cheatSheet : GENERIC_DEFAULTS.cheatSheet;
    }, [cheatSheet, isCalculation, metadata]);

    const effectiveReferenceInfo = useMemo(() => {
        // PRIORITY 1: The explicit referenceInfo prop
        const hasRealContent = referenceInfo && (
            (referenceInfo.anatomy && !referenceInfo.anatomy.includes('No anatomical')) ||
            (referenceInfo.physiology && !referenceInfo.physiology.includes('No physiological')) ||
            (referenceInfo.pharm && !referenceInfo.pharm.includes('No pharmacological'))
        );
        if (hasRealContent) return referenceInfo;

        // PRIORITY 2: The metadata.rationale.referenceInfo (Backdoor check)
        const metaRationale = metadata?.rationale || metadata?.fullItem?.content?.rationale;
        if (metaRationale?.referenceInfo) return metaRationale.referenceInfo;

        return isCalculation ? CALC_DEFAULTS.referenceInfo : GENERIC_DEFAULTS.referenceInfo;
    }, [referenceInfo, isCalculation, metadata]);

    // Fallback strings - prioritize item data
    const displayTrap = trap || (isCalculation ? CALC_DEFAULTS.trap : GENERIC_DEFAULTS.trap);
    const displayAnalysis = isCalculation
        ? (answerAnalysis && typeof answerAnalysis === 'string' && answerAnalysis.trim().startsWith('<h3') ? answerAnalysis : CALC_DEFAULTS.answerAnalysis)
        : (typeof answerAnalysis === 'string' ? answerAnalysis : (answerAnalysis ? String(answerAnalysis) : GENERIC_DEFAULTS.answerAnalysis));
    const displayGoldenRule = goldenRule || (isCalculation ? CALC_DEFAULTS.goldenRule : GENERIC_DEFAULTS.goldenRule);

    const [show, setShow] = useState(isOpen);
    const [animateIn, setAnimateIn] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'glass'>('dark');
    const modalRef = useRef<HTMLDivElement>(null);

    // TOOL STATES
    const [activeTool, setActiveTool] = useState<'calc' | 'timer' | 'labs' | 'highlight' | 'draw' | null>(null);
    const [notes, setNotes] = useState<{ id: string, text: string, color: string, x: number, y: number }[]>([]);
    const [scale, setScale] = useState(1);
    // Accordion state

    // Matrix & Option Filters
    const [optFilter, setOptFilter] = useState<'all' | 'correct' | 'incorrect' | 'missed'>('all');
    const [openOptId, setOpenOptId] = useState<string | null>(null);

    // ... (Highlighter & Drawing logic preserved) ...

    /* (Skipping logic block for brevity - usually I wouldn't do this but the tool allows context matching. 
       Actually, I must be careful not to delete logic. 
       I will target the specific state block and then the render block separately if possible, 
       but given the monolithic nature, I might need to just insert the state.)
    */

    // Highlighter State
    const [hlColor, setHlColor] = useState<'yellow' | 'green' | 'pink'>('yellow');
    // Canvas State
    const [drawColor, setDrawColor] = useState('#ef4444');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // ... (Effect hooks) ...

    /* I will only insert the State here. Next call will handle the Render logic. */


    useEffect(() => {
        if (isOpen) {
            setShow(true);
            setTimeout(() => setAnimateIn(true), 50);
            document.body.style.overflow = 'hidden';
        } else {
            setAnimateIn(false);
            const t = setTimeout(() => setShow(false), 300);
            return () => { clearTimeout(t); document.body.style.overflow = ''; };
        }
    }, [isOpen]);

    // Sticky Note Logic
    const addNote = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotes([...notes, { id, text: '', color: 'yellow', x: window.innerWidth / 2 - 100, y: 300 }]);
    };

    const updateNote = (id: string, updates: any) => {
        setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    // Highlighter Logic
    useEffect(() => {
        if (activeTool !== 'highlight' || !modalRef.current) return;

        const colors = { yellow: '#fef08a', green: '#bbf7d0', pink: '#fbcfe8' };

        const handleMouseUp = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
            if (!modalRef.current?.contains(selection.anchorNode)) return;

            try {
                const range = selection.getRangeAt(0);
                const mark = document.createElement('mark');
                mark.style.backgroundColor = colors[hlColor];
                mark.style.color = '#000';
                mark.style.padding = '0 2px';
                mark.classList.add('cr-highlight');
                mark.onclick = (e) => {
                    e.stopPropagation();
                    const text = document.createTextNode(mark.textContent || '');
                    mark.parentNode?.replaceChild(text, mark);
                };
                range.surroundContents(mark);
                selection.removeAllRanges();
            } catch (e) {
                console.warn('Highlight failed', e);
            }
        };

        const el = modalRef.current;
        el.addEventListener('mouseup', handleMouseUp);
        return () => el.removeEventListener('mouseup', handleMouseUp);
    }, [activeTool, hlColor]);

    const clearHighlights = () => {
        document.querySelectorAll('.cr-highlight').forEach(mark => {
            const text = document.createTextNode(mark.textContent || '');
            mark.parentNode?.replaceChild(text, mark);
        });
    };

    // Drawing Logic
    const startDrawing = (e: React.MouseEvent) => {
        if (activeTool !== 'draw' || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || activeTool !== 'draw' || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx?.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    useEffect(() => {
        if (activeTool === 'draw' && canvasRef.current && modalRef.current) {
            canvasRef.current.width = modalRef.current.clientWidth;
            canvasRef.current.height = modalRef.current.clientHeight;
        }
    }, [activeTool, isOpen, activeTab]);

    if (!isOpen && !show) return null;

    // 🎨 THEME COLORS - ENSURING HIGH CONTRAST & CONSISTENCY
    const COLORS = {
        primary: theme === 'dark' ? '#60A5FA' : '#3B82F6',
        secondary: theme === 'dark' ? '#A78BFA' : '#8B5CF6',
        accent: theme === 'dark' ? '#F472B6' : '#EC4899',
        success: theme === 'dark' ? '#34D399' : '#10B981',
        warning: theme === 'dark' ? '#FBBF24' : '#F59E0B',
        critical: theme === 'dark' ? '#F87171' : '#EF4444',
    };

    const THEME = {
        background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
        card: theme === 'dark' ? '#1E293B' : '#FFFFFF',
        text: theme === 'dark' ? '#F1F5F9' : '#1E293B',
        subtext: theme === 'dark' ? '#94A3B8' : '#64748B',
        border: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    };







    const tabs = [
        { id: "0", label: "Item Overview & Actions", icon: FileText },
        { id: "1", label: "Option Review", icon: ListChecks },
        { id: "2", label: "Clinical Logic", icon: Brain },
        { id: "3", label: "Strategy", icon: Target },
        { id: "4", label: "Knowledge", icon: BookOpen },
    ];

    const ncjmmStages: { phase: NCJMMPhase; color: string; icon: React.ElementType }[] = [
        { phase: 'Recognize Cues', color: COLORS.critical, icon: Target },
        { phase: 'Analyze Cues', color: '#F97316', icon: Microscope },
        { phase: 'Prioritize Hypotheses', color: COLORS.warning, icon: ListChecks },
        { phase: 'Generate Solutions', color: COLORS.success, icon: Lightbulb },
        { phase: 'Take Action', color: COLORS.primary, icon: Zap },
        { phase: 'Evaluate Outcomes', color: COLORS.accent, icon: CheckCircle2 },
    ];

    const getStepContent = (phase: string) => {
        if (!phase || typeof phase !== 'string') return null;
        const keyword = phase.split(' ')[0].toLowerCase();
        const match = steps.find(s => s.tag && s.tag.toLowerCase().includes(keyword));
        if (match) return match.description;

        // Fallback for Single Response Items:
        // If this phase matches the Item's declared CJMM Step (e.g. "Analyze Cues"), show the main analysis.
        if (cjmmStep && cjmmStep.toLowerCase().includes(keyword)) {
            return answerAnalysis || "Primary clinical judgment focus for this item.";
        }

        // CALCULATION ITEM FALLBACK: Map calculation breakdown to CJMM phases
        // This ensures Calculation items show meaningful content instead of "Not applicable"
        if (formulaMethod || dimensionalAnalysis || (answerAnalysis && answerAnalysis.includes('Step'))) {
            const calcContent: Record<string, string> = {
                'recognize': typeof formulaMethod === 'string'
                    ? `Identify the calculation type and gather required values: ${formulaMethod.split('.')[0]}.`
                    : 'Identify relevant clinical values from the patient record (weight, lab results, current rate, medication concentration).',
                'analyze': typeof dimensionalAnalysis === 'string'
                    ? `Apply dimensional analysis: ${dimensionalAnalysis.split('.')[0]}.`
                    : 'Analyze the relationship between values and determine which formula applies based on the clinical context.',
                'prioritize': 'Prioritize accuracy in calculation - verify units match and conversion factors are correct before proceeding.',
                'generate': formulaMethod
                    ? `Set up the calculation using the appropriate formula and gathered values.`
                    : 'Generate the solution by applying the correct formula with verified input values.',
                'take': 'Execute the calculation step-by-step, documenting each operation for verification.',
                'evaluate': 'Evaluate the result for clinical reasonableness. Round to appropriate precision for the clinical context (whole numbers for IV rates). Verify using independent double-check for high-alert medications.'
            };

            if (calcContent[keyword]) return calcContent[keyword];
        }

        return null;
    };

    // --- NGN DIFFICULTY CALCULATION ENGINE ---
    const calculateNGNDifficulty = () => {
        // V2 SOURCE OF TRUTH (PRIORITY 1): rationale.difficulty object from AI
        // This is embedded directly in the question by the AI generation prompt
        // Check multiple paths for the embedded difficulty
        const embeddedDiff = metadata?.rationaleDifficulty ||
            metadata?.rationale?.difficulty ||
            metadata?.fullItem?.content?.rationale?.difficulty;

        if (embeddedDiff && typeof embeddedDiff === 'object' && embeddedDiff.level) {
            const lvl = Math.min(5, Math.max(1, Number(embeddedDiff.level)));
            const definitions = [
                { label: "Novice / Recall", subtext: "Requires basic recall of facts and definitions." },
                { label: "Adv. Beginner (Application)", subtext: "Requires applying rules or protocols to a scenario." },
                { label: "NGN Standard (Analysis)", subtext: "Requires analyzing trends and distinguishing relevant cues." },
                { label: "Proficient (Synthesis)", subtext: "Requires prioritizing conflicting needs and planning care." },
                { label: "Expert (Evaluation)", subtext: "Requires managing high-stakes complexity and uncertainty." }
            ];
            const def = definitions[lvl - 1];
            return {
                score: embeddedDiff.score || (lvl * 20),
                level: lvl,
                label: embeddedDiff.label || def.label,
                subtext: embeddedDiff.subtext || embeddedDiff.clinicalStrategy || def.subtext,
                clinicalStrategy: embeddedDiff.clinicalStrategy,
                recommendedActions: embeddedDiff.recommendedActions
            };
        }

        // V1.5 FALLBACK: Pedagogy or Metadata difficultyLevel
        const rawLevel = metadata?.pedagogy?.difficultyLevel || metadata?.difficultyLevel || metadata?.difficulty;

        // Helper to normalize level
        const normalizeLevel = (val: any): number | null => {
            if (!val) return null;
            if (typeof val === 'number') return Math.min(5, Math.max(1, val));
            const s = String(val).toLowerCase();
            if (s.includes('hard') || s.includes('expert')) return 5;
            if (s.includes('proficient') || s === '4') return 4;
            if (s.includes('moderate') || s.includes('standard') || s === '3') return 3;
            if (s.includes('easy') || s.includes('novice') || s === '1') return 1;
            return 2; // Default for "Application" etc
        };

        const explicitLevel = normalizeLevel(rawLevel);

        if (explicitLevel) {
            const lvl = explicitLevel;
            const definitions = [
                { label: "Novice / Recall", subtext: "Requires basic recall of facts and definitions." },
                { label: "Adv. Beginner (Application)", subtext: "Requires applying rules or protocols to a scenario." },
                { label: "NGN Standard (Analysis)", subtext: "Requires analyzing trends and distinguishing relevant cues." },
                { label: "Proficient (Synthesis)", subtext: "Requires prioritizing conflicting needs and planning care." },
                { label: "Expert (Evaluation)", subtext: "Requires managing high-stakes complexity and uncertainty." }
            ];
            const def = definitions[lvl - 1];
            return {
                score: lvl * 20,
                level: lvl,
                label: def.label,
                subtext: def.subtext
            };
        }

        let score = 0;

        // 0.5 Type Base Score
        const type = String(metadata?.type || '').toLowerCase();
        if (type.includes('bow') && type.includes('tie')) score += 40; // Bow-Tie starts high
        else if (type.includes('case')) score += 30;
        else if (type.includes('matrix')) score += 20;



        // 2. Cue Complexity
        const cues = metadata?.cueCount || 0;
        if (cues > 3) score += 15;
        else if (cues > 1) score += 10;
        else score += 5;

        // 3. Time Pressure
        const pressure = metadata?.timePressure || 'medium';
        if (pressure === 'high') score += 10;
        else if (pressure === 'medium') score += 5;
        else score += 0; // Low pressure

        // 4. Clinical Focus Modifier (from metadata.topic)
        const topic = metadata?.topic?.toLowerCase() || '';
        if (topic.includes('critical') || topic.includes('sepsis')) score += 8;
        else if (topic.includes('pharm')) score += 6;
        else if (topic.includes('cardio')) score += 6;
        else score += 3; // Base complexity

        // Map to Level
        let level = 1;
        let label = "Recall / Foundational";
        let subtext = "Requires basic recall of facts.";

        if (score > 80) { level = 5; label = "High-Stakes Clinical Judgment"; subtext = `Requires ${cjmmStep} under high-stakes uncertainty.`; }
        else if (score > 60) { level = 4; label = "Complex Prioritization"; subtext = `Requires ${cjmmStep} with competing priority cues.`; }
        else if (score > 40) { level = 3; label = "Multi-Cue Integration"; subtext = `Requires integrating multiple data points for ${cjmmStep}.`; }
        else if (score > 20) { level = 2; label = "Single-Step Application"; subtext = `Requires applying knowledge to ${cjmmStep}.`; }

        return { score: Math.min(score, 100), level, label, subtext };
    };

    const diffData = calculateNGNDifficulty();

    const getRecommendedActions = () => {
        const isCorrect = outcome?.status === 'correct';

        // Use embedded actions if available
        if (diffData.recommendedActions && Array.isArray(diffData.recommendedActions)) {
            return {
                focus: coreConcept || 'Clinical Judgment',
                immediate: diffData.recommendedActions[0] || "Review the core concept.",
                next: diffData.recommendedActions[1] || "Try more questions at this level."
            };
        }

        const actions = {
            focus: coreConcept || 'Clinical Judgment',
            immediate: '',
            next: ''
        };

        if (!isCorrect) {
            // Error Remediation
            if (cjmmStep?.toLowerCase().includes('recognize')) actions.immediate = "Re-scan the stem and list 3 abnormal cues you missed.";
            else if (cjmmStep?.toLowerCase().includes('analyze')) actions.immediate = "Link the key cue to a specific pathology.";
            else if (cjmmStep?.toLowerCase().includes('prioritize')) actions.immediate = "Compare the top 2 options and identify the immediate risk difference.";
            else actions.immediate = `Perform a ${cjmmStep} drill: identify the safety gap.`;

            actions.next = `Complete 2 similar items at Level ${Math.max(1, diffData.level - 1)} to build confidence.`;
        } else {
            // Mastery Challenge
            actions.immediate = `Good job recognizing the key cues for ${coreConcept}.`;
            actions.next = `Try a similar item at Level ${Math.min(5, diffData.level + 1)} with added time pressure.`;
        }
        return actions;
    };

    const recActions = getRecommendedActions();

    // Dynamic Key Integration Text
    const getKeyIntegrationText = () => {
        const cues = metadata?.cueCount || 0;
        const pressure = metadata?.timePressure || 'medium';
        const integration = metadata?.integrationLevel || 'basic';

        let text = "This item required ";

        if (integration === 'complex') text += "synthesizing competing cues ";
        else if (cues > 2) text += "linking multiple data points ";
        else text += "identifying a key finding ";

        if (pressure === 'high') text += "under significant time pressure.";
        else if (pressure === 'low') text += "with careful analysis.";
        else text += "to determine the priority.";

        return text;
    };
    const keyIntegrationText = getKeyIntegrationText();



    const content = (
        <>
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
                style={{ zIndex: 2147483646 }}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 2147483647, pointerEvents: 'none' }}>
                <div
                    ref={modalRef}
                    className={`w-full max-w-7xl h-[92vh] pointer-events-auto transition-all duration-500 flex flex-col relative ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{
                        backgroundColor: THEME.background,
                        backdropFilter: theme === 'glass' ? 'blur(20px) saturate(180%)' : 'none',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: `1px solid ${THEME.border}`,
                        color: THEME.text
                    }}
                >
                    {activeTool === 'draw' && (
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 z-50 cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            style={{ touchAction: 'none' }}
                        />
                    )}

                    {/* Top Bar */}
                    <div
                        className="flex-none px-6 py-3 border-b flex items-center justify-between gap-6 relative z-[60]"
                        style={{ borderColor: THEME.border, backgroundColor: theme === 'glass' ? 'rgba(255,255,255,0.4)' : 'transparent' }}
                    >
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` }}>
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-tight">Clinical Reasoning</h2>
                                <p className="text-xs font-semibold" style={{ color: COLORS.primary }}>{coreConcept}</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-slate-100/10 rounded-lg p-1 border border-white/10 overflow-hidden shadow-sm">
                            <div className="px-2 border-r border-white/10 text-slate-400">
                                <GripVertical className="w-4 h-4" />
                            </div>

                            {[
                                { id: 'calc', icon: Calculator, label: "Calc" },
                                { id: 'add_note', icon: StickyIcon, label: "Note", action: addNote },
                                { id: 'timer', icon: Timer, label: "Timer" },
                                { id: 'labs', icon: FlaskConical, label: "Labs" },
                            ].map((tool: any) => (
                                <button
                                    key={tool.id}
                                    onClick={() => tool.action ? tool.action() : setActiveTool(activeTool === tool.id ? null : tool.id)}
                                    className={`p-2.5 transition-colors relative group ${activeTool === tool.id ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                    title={tool.label}
                                >
                                    <tool.icon className="w-5 h-5" />
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {tool.label}
                                    </span>
                                </button>
                            ))}

                            <div className="w-px h-6 bg-white/10 mx-1" />

                            <button
                                onClick={() => setScale(s => s === 1 ? 1.1 : 1)}
                                className={`p-2.5 transition-colors relative group ${scale > 1 ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                title="Zoom"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setActiveTool(activeTool === 'draw' ? null : 'draw')}
                                className={`p-2.5 transition-colors relative group ${activeTool === 'draw' ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                title="Draw"
                            >
                                <PenTool className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setActiveTool(activeTool === 'highlight' ? null : 'highlight')}
                                className={`p-2.5 transition-colors relative group ${activeTool === 'highlight' ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                title="Highlight"
                            >
                                <Highlighter className="w-5 h-5" />
                            </button>

                            <div className="w-px h-6 bg-white/10 mx-1" />

                            <button
                                onClick={() => setTheme(prev => prev === 'dark' ? 'glass' : 'dark')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white/10 opacity-80 hover:opacity-100"
                                style={{ color: theme === 'dark' ? 'white' : '#0F172A' }}
                            >
                                {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                                {theme === 'dark' ? 'Dark' : 'Glass'}
                            </button>

                            <div className="w-px h-6 bg-white/10 mx-1" />

                            {onNextQuestion && (
                                <button
                                    onClick={onNextQuestion}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 animate-pulse"
                                >
                                    Next Question <Play className="w-4 h-4 fill-current" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ABSOLUTE CLOSE BUTTON (REPLACED FROM TOOLBAR FOR SAFETY) */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 z-[200] p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group"
                        title="Close Reasoning (Esc)"
                    >
                        <X className="w-8 h-8 transition-transform group-hover:rotate-90" />
                        <span className="sr-only">Close</span>
                    </button>

                    {/* 🔹 CJ MAPPING BLOCK (ALWAYS VISIBLE) */}
                    {
                        cjFeedback && (
                            <div className="flex-none px-6 pb-2 relative z-[55]">
                                <div className="flex items-center gap-4 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                                    <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Brain className="w-6 h-6 mb-0.5" />
                                    </div>
                                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-0.5">What you did well</div>
                                                <div className="text-sm font-medium leading-snug opacity-90">{cjFeedback.well}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 border-l border-white/10 pl-4">
                                            <Target className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-0.5">Next time focus on</div>
                                                <div className="text-sm font-medium leading-snug opacity-90">{cjFeedback.improve}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* 1. OUTCOME STRIP (Sticky) */}
                    {
                        outcome && (
                            <div className="flex-none px-6 py-3 flex items-center justify-between relative z-50 border-b"
                                style={{
                                    backgroundColor: outcome.status === 'correct' ? 'rgba(16, 185, 129, 0.1)' : outcome.status === 'partial' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    borderColor: outcome.status === 'correct' ? COLORS.success : outcome.status === 'partial' ? COLORS.warning : COLORS.critical
                                }}>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${outcome.status === 'correct' ? 'text-emerald-500 bg-emerald-500/20' : outcome.status === 'partial' ? 'text-amber-500 bg-amber-500/20' : 'text-red-500 bg-red-500/20'}`}>
                                        {outcome.status === 'correct' ? 'OPTIMAL' : outcome.status === 'partial' ? 'PARTIAL' : 'SUBOPTIMAL'}
                                    </div>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="text-sm font-medium opacity-80">
                                        Score: <span className="font-bold text-white">{outcome.score}</span> / {outcome.maxScore}
                                    </div>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                                        <Target className="w-3 h-3" />
                                        {cjmmStep}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* 2. THREE-LINE REMEDIATION (REMOVED as per User Request) */}
                    {/* Content moved to Case Overview */}

                    {/* TABS (Existing) */}
                    <div className="flex-none px-8 pt-4 pb-0 border-b flex gap-4 overflow-x-auto relative z-40" style={{ borderColor: THEME.border }}>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const tabColor = [COLORS.primary, COLORS.accent, '#06B6D4', COLORS.warning, COLORS.success][parseInt(tab.id)];

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`relative flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-bold transition-all ${isActive ? 'translate-y-[1px]' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                                        }`}
                                    style={{
                                        color: isActive ? tabColor : THEME.subtext,
                                        backgroundColor: isActive ? (theme === 'dark' ? '#1E293B' : 'white') : 'transparent',
                                        borderTop: isActive ? `2px solid ${tabColor}` : '2px solid transparent',
                                        borderLeft: isActive && theme === 'glass' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                        borderRight: isActive && theme === 'glass' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                    }}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-30"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            width: scale > 1 ? `${100 / scale}%` : '100%',
                            height: scale > 1 ? `${100 / scale}%` : 'auto'
                        }}
                    >

                        {activeTab === "0" && !isCalculation && (

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500">
                                {/* LEFT COLUMN: Item Difficulty (3/12) */}
                                <div className="col-span-1 md:col-span-3 space-y-6">
                                    {/* 1. DIFFICULTY THERMOMETER */}
                                    <div className="rounded-2xl border p-6" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
                                            <Activity className="w-4 h-4" /> Item Difficulty
                                        </h3>
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden relative">
                                                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 w-full opacity-30" />
                                                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 origin-left transition-all duration-1000"
                                                    style={{ width: `${diffData.score}%` }} />
                                            </div>
                                            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-wider opacity-50">
                                                <span>Level 1</span>
                                                <span>Level 3</span>
                                                <span>Level 5</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black mb-1">Level {diffData.level}: <span className="text-blue-500">{diffData.label}</span></div>
                                                <div className="text-xs opacity-70 mt-1 max-w-[200px] mx-auto leading-relaxed">
                                                    {diffData.subtext}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* CENTER MAIN COLUMN: Recommended Actions (6/12) */}
                                <div className="col-span-1 md:col-span-6 space-y-6">
                                    <div className="rounded-2xl border p-6 h-full flex flex-col" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60">
                                            <Sparkles className="w-4 h-4" /> Recommended Actions
                                        </h3>
                                        <div className="space-y-6 flex-1">
                                            {/* Focus Area Card - Prominent */}
                                            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
                                                <div className="relative z-10">
                                                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Primary Focus Area</div>
                                                    <div className="text-lg font-bold text-white leading-snug">{recActions.focus}</div>
                                                </div>
                                            </div>

                                            {/* Action Steps - Detailed */}
                                            <div className="relative pl-6 border-l-2 border-slate-500/20 space-y-8 py-2">
                                                <div className="relative group">
                                                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-slate-500/30 border-2 border-[#0F172A] group-hover:border-slate-500/50 transition-colors" />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Immediate Action</div>
                                                        <div className="text-base leading-relaxed font-medium opacity-90">{recActions.immediate}</div>
                                                    </div>
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-slate-500/30 border-2 border-[#0F172A] group-hover:border-slate-500/50 transition-colors" />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">{outcome?.status === 'correct' ? 'Mastery Challenge' : 'Next Step'}</div>
                                                        <div className="text-base leading-relaxed font-medium opacity-90">{recActions.next}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Stats & Rationale (3/12) */}
                                <div className="col-span-1 md:col-span-3 space-y-6">
                                    {/* 1. KEY STATS GRID (2x2) */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoTooltip side="bottom" text="The medical topic or concept this item evaluates.">
                                            <div className="p-3 rounded-xl border border-white/5 bg-white/5 w-full">
                                                <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Focus</div>
                                                <div className="text-xs font-bold truncate" style={{ color: COLORS.primary }}>{metadata?.topic || coreConcept}</div>
                                            </div>
                                        </InfoTooltip>

                                        <InfoTooltip side="bottom" text="The specific cognitive operation required (e.g., Recognize Cues).">
                                            <div className="p-3 rounded-xl border border-white/5 bg-white/5 w-full">
                                                <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Skill</div>
                                                <div className="text-xs font-bold truncate" style={{ color: COLORS.accent }}>{cjmmStep}</div>
                                            </div>
                                        </InfoTooltip>

                                        <InfoTooltip side="bottom" text="Number of critical data points you needed to identify.">
                                            <div className="p-3 rounded-xl border border-white/5 bg-white/5 w-full">
                                                <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Cues</div>
                                                <div className="text-xs font-bold truncate text-emerald-400">{metadata?.cueCount ? `${metadata.cueCount} Active` : 'Multi-Source'}</div>
                                            </div>
                                        </InfoTooltip>

                                        <InfoTooltip side="bottom" text="The urgency level required for decision making.">
                                            <div className="p-3 rounded-xl border border-white/5 bg-white/5 w-full">
                                                <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Pressure</div>
                                                <div className="text-xs font-bold truncate text-orange-400 capitalize">{metadata?.timePressure || 'Medium'}</div>
                                            </div>
                                        </InfoTooltip>
                                    </div>

                                    {/* 2. RATIONALE & INTEGRATION */}
                                    <div className="rounded-2xl border p-6" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><FileText className="w-5 h-5" /></div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Rationale Breakdown</h4>
                                        </div>

                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <p className="text-sm leading-relaxed opacity-90 mb-4 italic" style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: '1rem', color: THEME.text }}>
                                                "{answerAnalysis || "Accurate evaluation of cues is critical for determining the correct priority. See Option Review for specific details."}"
                                            </p>
                                        </div>

                                        {/* Key Integration Block */}
                                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
                                            <div className="flex items-start gap-3">
                                                <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Clinical Linkage</div>
                                                    <p className="text-xs opacity-80">{keyIntegrationText}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Golden Rule (Integrated) */}
                                        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-4">
                                            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Clinical Pearl</div>
                                            <p className="text-xs font-medium opacity-90">"{goldenRule || "Focus on the patient's immediate physiological needs."}"</p>
                                        </div>

                                        {/* Clinical Strategy (Moved from Tab to Card) */}
                                        {/* Make sure this is activeTab === 0 (Item Overview & Actions) */}
                                        {(clinicalStrategy || diffData.clinicalStrategy) && (
                                            <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
                                                <div className="flex items-start gap-3">
                                                    <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Clinical Strategy</div>
                                                        <p className="text-xs font-medium opacity-90 leading-relaxed">
                                                            "{clinicalStrategy || diffData.clinicalStrategy}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {isCalculation && (formulaMethod || dimensionalAnalysis) && (
                                        <div className="rounded-2xl border p-6 mt-4" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Calculator className="w-5 h-5" /></div>
                                                    <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Clinical Math Lab</h4>
                                                </div>
                                            </div>

                                            {/* Clinical Setup Variables */}
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center text-center">
                                                    <Scale className="w-4 h-4 text-indigo-400 mb-2" />
                                                    <div className="text-[10px] uppercase font-bold text-indigo-300 opacity-70">Weight</div>
                                                    <div className="text-sm font-bold text-indigo-100">{weightDisplay}</div>
                                                    <div className="text-[10px] opacity-60">({kgDisplay})</div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 flex flex-col items-center text-center">
                                                    <FileText className="w-4 h-4 text-pink-400 mb-2" />
                                                    <div className="text-[10px] uppercase font-bold text-pink-300 opacity-70">Order</div>
                                                    <div className="text-sm font-bold text-pink-100">{doseDisplay}</div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center text-center">
                                                    <Syringe className="w-4 h-4 text-cyan-400 mb-2" />
                                                    <div className="text-[10px] uppercase font-bold text-cyan-300 opacity-70">Supply</div>
                                                    <div className="text-sm font-bold text-cyan-100">{supplyDoseDisplay} / {supplyVolDisplay}</div>
                                                </div>
                                            </div>

                                            {/* Correct Answer Display */}
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6 font-mono">
                                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Target Answer</span>
                                                <span className="text-lg font-bold text-blue-400">
                                                    {metadata?.correctValue || '?'} {metadata?.units || metadata?.inputLabel || ''}
                                                </span>
                                            </div>


                                            {/* Formula Method and Dimensional Analysis moved to Clinical Logic tab */}

                                            {/* Safety Check */}
                                            {metadata?.rationale?.safetyCheck && (
                                                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                                                    <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Safety Reality Check</div>
                                                        <p className="text-sm text-amber-100/90 leading-relaxed italic">
                                                            "{metadata.rationale.safetyCheck}"
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 3. TRAP ALERT (Separate Card) */}
                                    {trap && (
                                        <div className="rounded-xl border p-4 flex items-start gap-4" style={{ borderColor: `${COLORS.critical}40`, backgroundColor: `${COLORS.critical}10` }}>
                                            <AlertOctagon className="w-5 h-5 shrink-0" style={{ color: COLORS.critical }} />
                                            <div>
                                                <h5 className="text-[10px] font-bold uppercase mb-1" style={{ color: COLORS.critical }}>Common Trap</h5>
                                                <p className="text-xs opacity-90">{trap}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        )}


                        {activeTab === "1" && (
                            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">

                                {bowTieReview ? (
                                    /* 1. BOW TIE REVIEW MODE (Highest Priority specialized visual) */
                                    <div className="space-y-6">
                                        <BowTieFeedback review={bowTieReview} />
                                    </div>
                                ) : highlightReview ? (
                                    /* 2. HIGHLIGHT CHART REVIEW MODE */
                                    <div className="space-y-6">
                                        <HighlightFeedback review={highlightReview} />
                                    </div>
                                ) : clozeReview ? (
                                    /* 3. DROP/CLOZE REVIEW MODE */
                                    <div className="space-y-6">
                                        <ClozeFeedback review={clozeReview} />
                                    </div>
                                ) : orderedReview ? (
                                    /* 4. ORDERED RESPONSE REVIEW MODE */
                                    <div className="space-y-6">
                                        <OrderedFeedback review={orderedReview} />
                                    </div>
                                ) : (matrixRows && matrixRows.length > 0) ? (
                                    /* 5. MATRIX ROW REVIEW MODE */
                                    <div className="space-y-6">
                                        <MatrixFeedback
                                            rows={matrixRows}
                                            columns={matrixColumns || []}
                                        />
                                    </div>
                                ) : (reviewUnits && reviewUnits.length > 0) ? (
                                    /* 6. FEATURE FLAG: V2 OPTION REVIEW SYSTEM (General SATA/MCQ fallback) */
                                    <div className="space-y-6">
                                        <div className="mb-6 flex flex-col gap-4">
                                            <div className="flex items-center gap-3 mb-2 px-1">
                                                <div className="p-2 rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
                                                    <Activity className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Expert Analytics</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* 1. Overall Score */}
                                                <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden relative">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                                                    <div className="text-4xl font-black text-emerald-500 mb-1 leading-none text-center">
                                                        {outcome?.score !== undefined && outcome?.maxScore ? Math.round((Number(outcome.score) / Number(outcome.maxScore)) * 100) : 0}%
                                                    </div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Score</div>
                                                </div>
                                                {/* 2. Points (The +4/5 Block) */}
                                                <div className="bg-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 delay-75 shadow-xl shadow-blue-600/20 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full pointer-events-none" />
                                                    <div className="text-4xl font-black text-white mb-1 leading-none text-center">
                                                        +{Number(outcome?.score || 0)}<span className="text-blue-200 text-xl font-bold ml-1">/ {Number(outcome?.maxScore || 0) || 0}</span>
                                                    </div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">Points</div>
                                                </div>
                                            </div>
                                        </div>
                                        <OptionReviewV2 units={reviewUnits} />
                                    </div>
                                ) : (
                                    /* 7. LEGACY FALLBACK */
                                    <div className="space-y-6">
                                            /* STANDARD OPTION REVIEW MODE (Existing) */
                                        <div className="space-y-2">
                                            {(!optionReviews || optionReviews.length === 0) && (
                                                <div className="space-y-6">
                                                    {/* Check if it's a calculation item */}
                                                    {(metadata?.type?.toLowerCase().includes('calculation') || metadata?.correctValue !== undefined) ? (
                                                        <>
                                                            {/* Score Summary for Calculation */}
                                                            <div className="mb-6 flex flex-col gap-4">
                                                                <div className="flex items-center gap-3 mb-2 px-1">
                                                                    <div className="p-2 rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
                                                                        <Activity className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Calculation Analysis</h3>
                                                                </div>
                                                                {/* DIFFICULTY DISPLAY ADDED HERE FOR CALCULATION */}
                                                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <Zap className="w-4 h-4 text-amber-500" />
                                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Difficulty</span>
                                                                        </div>
                                                                        <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded">
                                                                            Level {metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3}
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600"
                                                                            style={{ width: `${((metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3) / 5) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-2 text-xs text-slate-400 font-medium">
                                                                        {metadata?.rationaleDifficulty?.label || "Standard Difficulty"}
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center">
                                                                        <div className="text-4xl font-black text-emerald-500 mb-1 leading-none text-center">
                                                                            {outcome?.score !== undefined && outcome?.maxScore ? Math.round((Number(outcome.score) / Number(outcome.maxScore)) * 100) : 0}%
                                                                        </div>
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Score</div>
                                                                    </div>
                                                                    <div className="bg-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl shadow-blue-600/20">
                                                                        <div className="text-4xl font-black text-white mb-1 leading-none text-center">
                                                                            +{Number(outcome?.score || 0)}<span className="text-blue-200 text-xl font-bold ml-1">/ {Number(outcome?.maxScore || 1)}</span>
                                                                        </div>
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">Points</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Answer Comparison */}
                                                            <div className="rounded-2xl border p-6" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-60">
                                                                    <Calculator className="w-4 h-4" /> Answer Breakdown
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                                    <div className={`p-4 rounded-xl border-2 relative overflow-hidden ${outcome?.status === 'correct' ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className="text-xs font-bold uppercase tracking-wider opacity-60">Your Answer</div>
                                                                            {outcome?.status === 'correct' ? (
                                                                                <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest bg-emerald-500 text-black px-2 py-0.5 rounded-full">
                                                                                    <CheckCircle2 className="w-3 h-3" /> Correct
                                                                                </span>
                                                                            ) : (
                                                                                <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest bg-red-500 text-white px-2 py-0.5 rounded-full">
                                                                                    <XCircle className="w-3 h-3" /> Incorrect
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-3xl font-black truncate">
                                                                            {(outcome as any)?.userAnswer || '—'}
                                                                            <span className="text-sm font-medium ml-2 opacity-60">{metadata?.inputLabel || metadata?.units || ''}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 flex flex-col justify-center">
                                                                        <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Correct Answer</div>
                                                                        <div className="text-3xl font-black text-emerald-400 truncate">
                                                                            {metadata?.correctValue || 'N/A'}
                                                                            <span className="text-sm font-medium ml-2 opacity-60">{metadata?.inputLabel || metadata?.units || ''}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Step-by-Step Explanation (Parsed or HTML) */}
                                                                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                                                    <div className="flex items-center gap-2 mb-4">
                                                                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><ListChecks className="w-4 h-4" /></div>
                                                                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Solution Methodology</div>
                                                                    </div>

                                                                    {/* Check if answerAnalysis is HTML (starts with <h3) */}
                                                                    {(typeof displayAnalysis === 'string' ? displayAnalysis : '').trim().startsWith('<h3') ? (
                                                                        <div
                                                                            className="calculation-html-review prose prose-invert max-w-none text-sm"
                                                                            dangerouslySetInnerHTML={{ __html: displayAnalysis }}
                                                                            style={{
                                                                                // Custom styles for the HTML content
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="space-y-4">
                                                                            {(typeof displayAnalysis === 'string' ? displayAnalysis : '').split(/(?=Step \d+:|Method \d:)/g).map((step: string, idx: number) => {
                                                                                const cleanStep = step.trim();
                                                                                if (!cleanStep) return null;
                                                                                const isStep = cleanStep.match(/^Step \d+:/);
                                                                                const isMethod = cleanStep.match(/^Method \d:/);

                                                                                return (
                                                                                    <div key={idx} className={`text-sm leading-relaxed p-3 rounded-lg border ${isStep ? 'bg-blue-500/10 border-blue-500/20' : isMethod ? 'bg-indigo-500/10 border-indigo-500/20 font-bold text-indigo-300' : 'border-transparent opacity-90'}`}>
                                                                                        {isStep ? (
                                                                                            <>
                                                                                                <strong className="text-blue-300 block mb-1 text-xs uppercase tracking-widest">{cleanStep.split(':')[0]}</strong>
                                                                                                <span className="opacity-90">{cleanStep.split(':').slice(1).join(':').trim()}</span>
                                                                                            </>
                                                                                        ) : (
                                                                                            cleanStep
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Common Trap Alert */}
                                                            <div className="rounded-xl border p-4 flex items-start gap-4" style={{ borderColor: `${COLORS.critical}40`, backgroundColor: `${COLORS.critical}10` }}>
                                                                <AlertOctagon className="w-5 h-5 shrink-0" style={{ color: COLORS.critical }} />
                                                                <div>
                                                                    <h5 className="text-[10px] font-bold uppercase mb-1" style={{ color: COLORS.critical }}>Common Calculation Errors</h5>
                                                                    <p className="text-xs opacity-90">
                                                                        {displayTrap}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Golden Rule */}
                                                            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                                                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Calculation Safety Tip</div>
                                                                <p className="text-sm font-medium opacity-90">
                                                                    "{displayGoldenRule}"
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        /* FALLBACK: Generic Analysis for Non-Calculation Items (e.g. Trend, Highlight, Matrix) */
                                                        <>
                                                            {(displayAnalysis || displayGoldenRule || displayTrap) ? (
                                                                <div className="space-y-6">
                                                                    {/* Analysis Section */}
                                                                    {displayAnalysis && (
                                                                        <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                                                            {/* DIFFICULTY DISPLAY ADDED HERE FOR GENERIC */}
                                                                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Zap className="w-4 h-4 text-amber-500" />
                                                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Difficulty</span>
                                                                                    </div>
                                                                                    <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded">
                                                                                        Level {metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600"
                                                                                        style={{ width: `${((metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3) / 5) * 100}%` }}
                                                                                    />
                                                                                </div>
                                                                                <div className="mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                                                    {metadata?.rationaleDifficulty?.label || "Standard Difficulty"}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-2 mb-4">
                                                                                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><ListChecks className="w-4 h-4" /></div>
                                                                                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Clinical Reasoning</div>
                                                                            </div>
                                                                            {displayAnalysis.trim().startsWith('<h') ? (
                                                                                <div className="prose prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: displayAnalysis }} />
                                                                            ) : (
                                                                                <p className="text-sm leading-relaxed opacity-90">{displayAnalysis}</p>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Trap Section */}
                                                                    {displayTrap && (
                                                                        <div className="rounded-xl border p-4 flex items-start gap-4" style={{ borderColor: `${COLORS.critical}40`, backgroundColor: `${COLORS.critical}10` }}>
                                                                            <AlertOctagon className="w-5 h-5 shrink-0" style={{ color: COLORS.critical }} />
                                                                            <div>
                                                                                <h5 className="text-[10px] font-bold uppercase mb-1" style={{ color: COLORS.critical }}>Clinical Pitfall</h5>
                                                                                <p className="text-xs opacity-90">{displayTrap}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Golden Rule Section */}
                                                                    {displayGoldenRule && (
                                                                        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                                                            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Golden Rule</div>
                                                                            <p className="text-sm font-medium opacity-90">"{displayGoldenRule}"</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="p-8 text-center text-slate-400 border border-dashed border-white/10 rounded-xl bg-white/5">
                                                                    <div className="mb-2 text-lg font-bold">No Option Analysis Available</div>
                                                                    <p className="text-sm opacity-70">Detailed option breakdowns are not available for this item type yet.</p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {!isCalculation && optionReviews && optionReviews.length > 0 && (
                                                <div className="space-y-6">
                                                    {/* 🔹 EXPERT SCORE SUMMARY (Transfer from Question Feedback) */}
                                                    <div className="mb-6 flex flex-col gap-4">
                                                        <div className="flex items-center gap-3 mb-2 px-1">
                                                            <div className="p-2 rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
                                                                <Activity className="w-4 h-4 text-white" />
                                                            </div>
                                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Expert Analytics</h3>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            {/* 1. Overall Score */}
                                                            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden relative">
                                                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                                                                <div className="text-4xl font-black text-emerald-500 mb-1 leading-none text-center">
                                                                    {outcome?.score !== undefined && outcome?.maxScore ? Math.round((Number(outcome.score) / Number(outcome.maxScore)) * 100) : 0}%
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/50">Score</div>
                                                            </div>

                                                            {/* 2. Points (The +4/5 Block) */}
                                                            <div className="bg-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 delay-75 shadow-xl shadow-blue-600/20 relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full pointer-events-none" />
                                                                <div className="text-4xl font-black text-white mb-1 leading-none text-center">
                                                                    +{Number(outcome?.score || 0)}<span className="text-blue-200 text-xl font-bold ml-1">/ {Number(outcome?.maxScore || 0) || 0}</span>
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">Points</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Filter Bar for Standard Options */}
                                                    <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 w-max ml-auto mb-4">
                                                        {(['all', 'correct', 'incorrect', 'missed'] as const).map(f => (
                                                            <button
                                                                key={f}
                                                                onClick={() => setOptFilter(f)}
                                                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${optFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                                                    }`}
                                                            >
                                                                {f}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {Array.isArray(optionReviews) && optionReviews
                                                        .filter(opt => !!opt)
                                                        .filter(opt => {
                                                            if (optFilter === 'all') return true;
                                                            if (optFilter === 'correct') return opt.userStatus === 'correct';
                                                            if (optFilter === 'incorrect') return opt.userStatus === 'incorrect';
                                                            if (optFilter === 'missed') return opt.userStatus === 'missed' && opt.isCorrect;
                                                            return true;
                                                        })
                                                        .map((opt) => {
                                                            const isSelectedCorrect = opt.userStatus === 'correct';
                                                            const isSelectedIncorrect = opt.userStatus === 'incorrect';
                                                            const isMissedCorrect = opt.userStatus === 'missed' && opt.isCorrect;
                                                            const isMissedIncorrect = (opt.userStatus === 'missed' || opt.userStatus === 'skipped') && !opt.isCorrect;
                                                            const userSelected = opt.userSelected;
                                                            const isOpen = openOptId === opt.id;

                                                            // Row styling matching Question Feedback Image
                                                            let rowBg = 'rgba(255,255,255,0.03)';
                                                            let rowBorder = 'rgba(255,255,255,0.1)';
                                                            let rowBorderStyle = 'solid';
                                                            let checkboxColor = '#94a3b8';
                                                            let statusIcon = null;

                                                            if (isSelectedCorrect) {
                                                                rowBg = 'rgba(16, 185, 129, 0.1)';
                                                                rowBorder = '#10b981';
                                                                checkboxColor = '#10b981';
                                                                statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                                                            } else if (isSelectedIncorrect) {
                                                                rowBg = 'rgba(239, 68, 68, 0.1)';
                                                                rowBorder = '#ef4444';
                                                                checkboxColor = '#ef4444';
                                                                statusIcon = <XCircle className="w-5 h-5 text-red-500" />;
                                                            } else if (isMissedCorrect) {
                                                                rowBg = 'rgba(245, 158, 11, 0.05)';
                                                                rowBorder = '#f59e0b';
                                                                checkboxColor = '#f59e0b';
                                                                rowBorderStyle = 'dashed';
                                                                statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                                                            } else if (isMissedIncorrect) {
                                                                rowBg = 'rgba(255,255,255,0.02)';
                                                                rowBorder = 'rgba(245, 158, 11, 0.3)';
                                                                checkboxColor = '#475569';
                                                                rowBorderStyle = 'dashed';
                                                            }

                                                            return (
                                                                <div key={opt.id} className="flex flex-col gap-2 group animate-in slide-in-from-bottom-2 duration-300">
                                                                    {/* 1. SELECTION ROW (Matches Question Feedback Style) */}
                                                                    <div
                                                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:brightness-110 active:scale-[0.99] ${isOpen ? 'ring-2 ring-blue-500/50' : ''}`}
                                                                        onClick={() => setOpenOptId(isOpen ? null : opt.id)}
                                                                        style={{
                                                                            backgroundColor: rowBg,
                                                                            borderColor: rowBorder,
                                                                            borderStyle: rowBorderStyle as any
                                                                        }}
                                                                    >
                                                                        <div className="shrink-0">
                                                                            {userSelected ? (
                                                                                <CheckSquare className="w-6 h-6" style={{ color: checkboxColor }} />
                                                                            ) : (
                                                                                <Square className="w-6 h-6" style={{ color: '#475569' }} />
                                                                            )}
                                                                        </div>

                                                                        <div className="flex-1 text-base font-medium text-white/90">
                                                                            {opt.text}
                                                                        </div>

                                                                        <div className="shrink-0 flex items-center gap-3">
                                                                            {statusIcon && (
                                                                                <div className="ml-2">
                                                                                    {statusIcon}
                                                                                </div>
                                                                            )}
                                                                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                                                                        </div>
                                                                    </div>

                                                                    {/* 2. RATIONALE BOX (Directly Underneath - Only if Open) */}
                                                                    {isOpen && (
                                                                        <div className="ml-10 p-5 rounded-xl relative overflow-hidden bg-black/40 border border-white/5 border-l-4 animate-in slide-in-from-top-2 duration-300" style={{ borderLeftColor: opt.isCorrect ? '#10b981' : '#ef4444' }}>
                                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none blur-3xl opacity-20" style={{ backgroundColor: opt.isCorrect ? '#10b981' : '#ef4444' }} />

                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${opt.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                                    {opt.isCorrect ? 'Why this is correct' : 'Why this is incorrect'}
                                                                                </div>
                                                                            </div>

                                                                            <div className="text-base leading-relaxed text-slate-200">
                                                                                {(() => {
                                                                                    const text = opt.rationale || "No rationale provided.";
                                                                                    const extract = (tag: string) => {
                                                                                        const regex = new RegExp(`\\[${tag}\\](.*?)(?=\\[|$)`, 's');
                                                                                        const match = text.match(regex);
                                                                                        return match ? match[1].trim() : null;
                                                                                    };
                                                                                    const breakdown = extract('Breakdown');
                                                                                    if (breakdown) return String(breakdown);
                                                                                    return String(text).replace(/^(Correct|Incorrect|Why this is correct|Why this is incorrect)(\.|:)?/i, '').trim();
                                                                                })()}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === "2" && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex flex-col items-center mb-12">
                                    <div className="px-4 py-1 rounded-full border mb-4 text-xs font-bold uppercase tracking-widest" style={{ borderColor: THEME.border, backgroundColor: THEME.card }}>NCSBN Clinical Judgment Model</div>
                                    <h3 className="text-3xl font-bold mb-2">Cognitive Pathway</h3>
                                    <p className="opacity-60 max-w-xl text-center">Visualizing the six systematic steps required to make safe, effective clinical decisions.</p>
                                </div>
                                <div className="relative max-w-6xl mx-auto">
                                    <div className="absolute left-[50%] top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
                                    <div className="space-y-16">
                                        {ncjmmStages.map((stage, idx) => {
                                            const content = getStepContent(stage.phase);
                                            const isLeft = idx % 2 === 0;
                                            return (
                                                <div key={idx} className={`flex items-center justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'} relative group`}>
                                                    <div className="w-[42%]">
                                                        <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${content ? 'hover:-translate-y-1 hover:shadow-2xl' : 'opacity-40 grayscale'}`} style={{ backgroundColor: THEME.card, borderColor: content ? stage.color : THEME.border, boxShadow: content ? `0 10px 40px -10px ${stage.color}20` : 'none' }}>
                                                            {content && <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none" style={{ backgroundColor: stage.color, opacity: 0.1 }} />}
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: stage.color }}>{idx + 1}</div>
                                                                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: stage.color }}>{stage.phase}</h4>
                                                            </div>
                                                            {content ? <p className="text-sm leading-relaxed opacity-90 font-medium">{content}</p> : <div className="flex items-center gap-2 text-xs opacity-50 italic"><Ban className="w-3 h-3" /> Not applicable for this item type</div>}
                                                        </div>
                                                    </div>
                                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                                        <div className="w-4 h-4 rounded-full border-2 bg-[#0F172A] transition-all duration-500 group-hover:scale-150" style={{ borderColor: stage.color, boxShadow: `0 0 15px ${stage.color}` }} />
                                                    </div>
                                                    <div className="w-[42%]" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "3" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                                <div className="rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="h-full rounded-[20px] bg-[#0F172A] p-8 relative z-10 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20"><Lightbulb className="w-8 h-8 text-white" /></div>
                                        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">{effectiveMnemonic?.title}</h3>
                                        <div className="text-3xl font-black text-white mb-4 tracking-tight">{effectiveMnemonic?.content.split(',')[0]}...</div>
                                        <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 mb-4 text-sm font-mono text-amber-200/90 text-left">{effectiveMnemonic?.content}</div>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-md">{effectiveMnemonic?.explanation}</p>
                                    </div>
                                </div>
                                <div className="rounded-3xl border p-8 flex flex-col" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><ScrollText className="w-6 h-6" /></div>
                                        <h3 className="text-lg font-bold">Clinical Pearls</h3>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        {effectiveCheatSheet?.points.map((point: string, i: number) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</div>
                                                <p className="text-sm font-medium opacity-90">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strategy Section */}
                                {clinicalStrategy && (
                                    <div className="lg:col-span-2 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 flex flex-col md:flex-row gap-8 items-center shadow-xl">
                                        <div className="shrink-0 p-6 rounded-full bg-blue-500/10 border border-blue-500/20"><Zap className="w-10 h-10 text-blue-400" /></div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-lg font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                                Rationalizing Your Approach
                                            </h3>
                                            <p className="text-white/90 text-sm font-medium italic leading-relaxed">
                                                "{clinicalStrategy}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Pitfalls Section */}
                                <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-300 p-8 flex flex-col md:flex-row gap-8 items-center shadow-xl">
                                    <div className="shrink-0 p-6 rounded-full bg-red-500/10 border border-red-500/20"><AlertOctagon className="w-10 h-10 text-red-500" /></div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-lg font-bold text-red-500 mb-2 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                            Critical Safety Warnings
                                        </h3>
                                        <p className="text-neutral-400 mb-6 text-sm font-medium">Overlooking these signs can lead to delayed intervention and patient harm.</p>
                                        <div className="grid md:grid-cols-2 gap-4 text-left">
                                            {pitfalls.map((p, i) => (
                                                <div key={i} className="flex items-start gap-3 text-neutral-300 text-sm font-medium bg-black/40 px-4 py-3 rounded-lg border border-white/5">
                                                    <span className="text-red-500 font-bold mt-0.5">•</span>
                                                    {p}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}




                        {activeTab === "0" && isCalculation && (
                            <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* 1. HEADER: CORRECT ANSWER */}
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div>
                                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Correct Answer</div>
                                        <div className="text-3xl font-black text-emerald-400">
                                            {metadata?.correctValue || (metadata?.answer ? metadata.answer : '—')} <span className="text-lg opacity-60 font-bold">{metadata?.units || ''}</span>
                                        </div>
                                    </div>
                                    {metadata?.roundingRule && (
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">{metadata.roundingRule}</div>
                                        </div>
                                    )}
                                </div>

                                {/* 2. DETAILED RATIONALE (MARKDOWN) */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner overflow-hidden">
                                    {(() => {
                                        // Check if we have a proper new-format answerAnalysis
                                        const rawAnalysis = metadata?.rationale?.answerAnalysis;
                                        if (rawAnalysis && (rawAnalysis.includes('CORRECT RESULT') || rawAnalysis.includes('HOW WE GOT IT') || rawAnalysis.includes('Step 1'))) {
                                            return <MarkdownRenderer content={rawAnalysis} />;
                                        }

                                        // Use the formulaMethod from pipeline (now contains step-by-step breakdown)
                                        const formula = formulaMethod || metadata?.rationale?.formulaMethod || '';
                                        const safety = metadata?.rationale?.safetyCheck || '';

                                        if (formula && formula.includes('Step')) {
                                            // We have a real step-by-step breakdown from parsing the prompt
                                            return (
                                                <div className="space-y-4">
                                                    <MarkdownRenderer content={formula} />
                                                    {safety && (
                                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-4">
                                                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                                            <MarkdownRenderer content={safety} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // Clean fallback for items we couldn't parse
                                        return (
                                            <div className="space-y-6">
                                                {/* Info Banner */}
                                                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-blue-300 font-medium">Step-by-step breakdown</p>
                                                        <p className="text-xs text-slate-400 mt-1">Review the calculation methodology below.</p>
                                                    </div>
                                                </div>

                                                {/* Show whatever we have */}
                                                {formula && <MarkdownRenderer content={formula} />}

                                                {/* Safety Reminder */}
                                                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-amber-300 font-medium">Safety Reminder</p>
                                                        <p className="text-xs text-slate-400 mt-1">Always double-check calculations. For high-alert medications, verify with a second nurse.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}


                        {activeTab === "4" && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <div><h3 className="text-2xl font-bold mb-1">Foundational Knowledge</h3><p className="opacity-60">The "Why" behind the "What".</p></div>
                                    {/* DIFFICULTY DISPLAY ADDED TO KNOWLEDGE TAB */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 min-w-[200px]">
                                        <div className="flex items-center justify-between mb-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complexity</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                                                Level {metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600"
                                                style={{ width: `${((metadata?.difficultyLevel || metadata?.rationaleDifficulty?.level || 3) / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isCalculation ? (
                                    /* CALCULATION FRAMEWORK (Static Educational Content) */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* 4. Calculation Type */}
                                        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Activity className="w-5 h-5" /></div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400">4. Calculation Type</h4>
                                            </div>
                                            <p className="text-sm opacity-80 leading-relaxed">
                                                This item requires <span className="font-bold text-white">{metadata?.topic || 'Dosage Calculation'}</span> logic.
                                                Identify if this is a Single-Step (Simple Dose), Multi-Step (Weight-based), or Complex Rate (Drip Factor) calculation.
                                                The units required in the answer (e.g., mL/hr vs gtt/min) dictate the path.
                                            </p>
                                        </div>

                                        {/* 5. Method Selection */}
                                        <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><GitBranch className="w-5 h-5" /></div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-purple-400">5. Method Selection</h4>
                                            </div>
                                            <p className="text-sm opacity-80 leading-relaxed">
                                                <strong className="text-white">Dimensional Analysis</strong> is the Gold Standard for complex unit conversions to avoid "setup errors".
                                                Use the <strong className="text-white">Formula Method (D/H x Q)</strong> only for simple single-step volume extractions where units already match.
                                            </p>
                                        </div>

                                        {/* 8. Special Formulas */}
                                        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><FlaskConical className="w-5 h-5" /></div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">8. Special Formulas</h4>
                                            </div>
                                            <ul className="text-sm opacity-80 space-y-2 font-mono">
                                                <li>• Flow Rate (mL/hr) = Total Vol / Total Hours</li>
                                                <li>• Drop Rate (gtt/min) = (Vol mL x Drop Factor) / Time min</li>
                                                <li>• Weight Based = mg/kg/min → Convert lb to kg first (÷ 2.2)</li>
                                            </ul>
                                        </div>

                                        {/* 9. Critical Thinking */}
                                        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Brain className="w-5 h-5" /></div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">9. Critical Thinking</h4>
                                            </div>
                                            <p className="text-sm opacity-80 leading-relaxed">
                                                Does the answer make clinical sense? (e.g. A flow rate of 1000 mL/hr for an infant is unstable).
                                                Always double-check rounding rules (whole number vs tenth).
                                                Ensure "Safety Checks" match the High Alert status of the medication.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* STANDARD KNOWLEDGE GRID */
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Physiology', icon: Activity, color: COLORS.success, content: effectiveReferenceInfo.physiology },
                                            { title: 'Anatomy', icon: Microscope, color: '#06B6D4', content: effectiveReferenceInfo.anatomy },
                                            { title: 'Pharmacology', icon: Zap, color: COLORS.accent, content: effectiveReferenceInfo.pharm },
                                        ].map((item, idx) => (
                                            <div key={idx} className="group rounded-3xl p-1 relative overflow-hidden transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${item.color}20, transparent)` }}>
                                                <div className="h-full rounded-[20px] p-6 flex flex-col border transition-colors relative z-10" style={{ backgroundColor: THEME.card, borderColor: THEME.border }}>
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg" style={{ backgroundColor: item.color }}><item.icon className="w-6 h-6 text-white" /></div>
                                                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: item.color }}>{item.title}</h4>
                                                    <div className="w-8 h-1 rounded-full mb-4 opacity-50" style={{ backgroundColor: item.color }} />
                                                    <p className="text-sm leading-relaxed opacity-80">{item.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Draggable Tools */}
                    {
                        activeTool === 'calc' && (
                            <DraggableTool title="Calculator" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth / 2 - 120, y: 150 }} theme={THEME}>
                                <CalculatorTool theme={THEME} />
                            </DraggableTool>
                        )
                    }
                    {
                        activeTool === 'timer' && (
                            <DraggableTool title="Stopwatch" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth / 2 - 120, y: 250 }} theme={THEME}>
                                <TimerTool theme={THEME} />
                            </DraggableTool>
                        )
                    }
                    {
                        activeTool === 'labs' && (
                            <DraggableTool title="Reference Labs" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth / 2 + 150, y: 100 }} theme={THEME}>
                                <LabsTool theme={THEME} />
                            </DraggableTool>
                        )
                    }
                    {
                        activeTool === 'highlight' && (
                            <DraggableTool title="Highlighter" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth / 2 + 200, y: 150 }} theme={THEME}>
                                <HighlighterControls onColor={setHlColor} activeColor={hlColor} onClear={clearHighlights} />
                            </DraggableTool>
                        )
                    }
                    {
                        activeTool === 'draw' && (
                            <DraggableTool title="Pen Settings" onClose={() => setActiveTool(null)} initialPos={{ x: 100, y: 150 }} theme={THEME}>
                                <DrawControls onColor={setDrawColor} activeColor={drawColor} onClear={clearCanvas} />
                            </DraggableTool>
                        )
                    }

                    {/* Render Sticky Notes */}
                    {
                        notes.map(note => (
                            <StickyNote
                                key={note.id}
                                id={note.id}
                                note={note}
                                onDelete={deleteNote}
                                onUpdate={updateNote}
                                initialPos={{ x: note.x, y: note.y }}
                            />
                        ))
                    }

                </div >
            </div >
        </>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
};
