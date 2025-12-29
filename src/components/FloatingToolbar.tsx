import React, { useState, useEffect } from 'react';

// --- Icons ---
const CalculatorIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>;
const StickyNoteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M15 3v6h6" /></svg>;
const ZoomInIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// --- Components ---

// 1. Draggable Window Wrapper
const DraggableWindow = ({ title, children, onClose, initialPos = { x: 50, y: 100 } }: any) => {
    const [pos, setPos] = useState(initialPos);
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setDragging(true);
        setRel({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!dragging) return;
        setPos({
            x: e.clientX - rel.x,
            y: e.clientY - rel.y
        });
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
                zIndex: 1000,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden w-64 flex flex-col"
        >
            <div
                onMouseDown={onMouseDown}
                className="bg-slate-100 px-3 py-2 flex justify-between items-center cursor-move border-b border-slate-200"
            >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</span>
                <button onClick={onClose} className="text-slate-400 hover:text-rose-500">
                    <XIcon />
                </button>
            </div>
            <div className="p-0 bg-white">
                {children}
            </div>
        </div>
    );
};

// 2. Calculator Component
const Calculator = () => {
    const [display, _setDisplay] = useState('0');

    const btnClass = "flex-1 h-10 text-sm font-medium border border-slate-100 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors";
    const opClass = "flex-1 h-10 text-sm font-bold bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 flex items-center justify-center";

    return (
        <div className="p-2">
            <div className="bg-slate-900 text-white text-right p-3 mb-2 rounded font-mono text-xl overflow-hidden">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-1">
                {['7', '8', '9', '/'].map(k => <button key={k} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['4', '5', '6', '*'].map(k => <button key={k} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['1', '2', '3', '-'].map(k => <button key={k} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
                {['C', '0', '=', '+'].map(k => <button key={k} className={isNaN(Number(k)) ? opClass : btnClass}>{k}</button>)}
            </div>
        </div>
    );
};

// 3. Notepad Component
const Notepad = () => {
    const [text, setText] = useState(() => localStorage.getItem('ngn_notepad') || '');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        localStorage.setItem('ngn_notepad', e.target.value);
    };

    return (
        <div className="bg-yellow-50 h-48 flex flex-col">
            <textarea
                className="flex-1 bg-transparent p-3 text-sm text-slate-700 resize-none focus:outline-none font-handwriting"
                placeholder="Type notes here..."
                value={text}
                onChange={handleChange}
                style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
            />
        </div>
    );
};

interface FloatingToolbarProps {
    offsetRight?: string | number;
    marginTop?: string | number;
}

// --- Main Toolbar Component ---
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    offsetRight = '2rem',
    marginTop = '5rem'
}) => {
    const [activeTool, setActiveTool] = useState<'calc' | 'note' | null>(null);
    const [zoom, setZoom] = useState(false);

    // Dynamic style for positioning
    const style: React.CSSProperties = {
        top: marginTop,
        right: offsetRight,
        zIndex: 10000 // Boost z-index to ensure visibility over modals
    };

    return (
        <>
            <div
                className="fixed flex flex-col gap-3"
                style={style}
            >
                <div className="bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 rounded-full p-2 flex flex-col gap-2 items-center">

                    {/* Calculator Toggle */}
                    <button
                        onClick={() => setActiveTool(activeTool === 'calc' ? null : 'calc')}
                        className={`p-2 rounded-full transition-all ${activeTool === 'calc' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Calculator"
                    >
                        <CalculatorIcon />
                    </button>

                    {/* Note Toggle */}
                    <button
                        onClick={() => setActiveTool(activeTool === 'note' ? null : 'note')}
                        className={`p-2 rounded-full transition-all ${activeTool === 'note' ? 'bg-amber-100 text-amber-600' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Notes"
                    >
                        <StickyNoteIcon />
                    </button>

                    {/* Zoom Toggle */}
                    <button
                        onClick={() => setZoom(!zoom)}
                        className={`p-2 rounded-full transition-all ${zoom ? 'bg-emerald-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Zoom Text"
                    >
                        <ZoomInIcon />
                    </button>
                </div>
            </div>

            {/* Render Active Tool Windows */}
            {activeTool === 'calc' && (
                <DraggableWindow title="Calculator" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth - 450, y: 150 }}>
                    <Calculator />
                </DraggableWindow>
            )}

            {activeTool === 'note' && (
                <DraggableWindow title="Scratch Pad" onClose={() => setActiveTool(null)} initialPos={{ x: window.innerWidth - 450, y: 400 }}>
                    <Notepad />
                </DraggableWindow>
            )}

            {/* Zoom Effect (Global Style Injection for simplicity) */}
            {zoom && (
                <style>{`
          .question-content, .rationales {
             transform: scale(1.1);
             transform-origin: top left;
             transition: transform 0.2s;
          }
        `}</style>
            )}
        </>
    );
};
