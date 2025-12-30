import React, { useState } from 'react';
import { FloatingDock } from './FloatingDock';
import { DraggableWindow } from './DraggableWindow';
import { ProCalculator } from './ProCalculator';
import { SmartNotepad } from './SmartNotepad';
import { ExamTimer } from './ExamTimer';
import { ReferenceLabs } from './ReferenceLabs';
import { AccessibilityTools } from './AccessibilityTools';
import { SmartHighlighter } from './SmartHighlighter';

export const ToolSuite: React.FC = () => {
    const [activeTools, setActiveTools] = useState<string[]>([]);
    const [zIndices, setZIndices] = useState<Record<string, number>>({
        calc: 100,
        notes: 100,
        timer: 100,
        labs: 100,
        access: 100,
        highlighter: 100
    });
    const [maxZ, setMaxZ] = useState(100);

    const toggleTool = (tool: string) => {
        if (activeTools.includes(tool)) {
            setActiveTools(activeTools.filter(t => t !== tool));
        } else {
            setActiveTools([...activeTools, tool]);
            bringToFront(tool);
        }
    };

    const closeTool = (tool: string) => {
        setActiveTools(activeTools.filter(t => t !== tool));
    };

    const bringToFront = (tool: string) => {
        const newMax = maxZ + 1;
        setMaxZ(newMax);
        setZIndices(prev => ({ ...prev, [tool]: newMax }));
    };

    // Global Event Listener for Tool Opening (e.g. from Calculation Question)
    React.useEffect(() => {
        const handleOpenTool = (e: Event) => {
            const customEvent = e as CustomEvent;
            const tool = customEvent.detail;
            // Use functional update to avoid dependency issues
            setActiveTools(prev => {
                if (!prev.includes(tool)) return [...prev, tool];
                return prev;
            });
            // We can't strictly bringToFront here without zIndices state dependency, 
            // but opening it is the main goal.
        };

        window.addEventListener('open-tool', handleOpenTool);
        return () => window.removeEventListener('open-tool', handleOpenTool);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
                <FloatingDock activeTools={activeTools} onToggle={toggleTool} />
            </div>

            <div style={{ pointerEvents: 'auto' }}>
                {/* Calculator - Top Left, compact */}
                <DraggableWindow
                    title="Pro Calculator"
                    isOpen={activeTools.includes('calc')}
                    onClose={() => closeTool('calc')}
                    zIndex={zIndices['calc']}
                    onFocus={() => bringToFront('calc')}
                    width={260}
                    defaultPosition={{ x: 20, y: 80 }}
                >
                    <ProCalculator />
                </DraggableWindow>

                {/* Notepad - Below Calculator */}
                <DraggableWindow
                    title="Smart Notepad"
                    isOpen={activeTools.includes('notes')}
                    onClose={() => closeTool('notes')}
                    zIndex={zIndices['notes']}
                    onFocus={() => bringToFront('notes')}
                    width={300}
                    defaultPosition={{ x: 20, y: 350 }}
                >
                    <SmartNotepad />
                </DraggableWindow>

                {/* Timer - Top Center-Left */}
                <DraggableWindow
                    title="Exam Timer"
                    isOpen={activeTools.includes('timer')}
                    onClose={() => closeTool('timer')}
                    zIndex={zIndices['timer']}
                    onFocus={() => bringToFront('timer')}
                    width={220}
                    defaultPosition={{ x: 300, y: 80 }}
                >
                    <ExamTimer />
                </DraggableWindow>

                {/* Reference Labs - Center, wider */}
                <DraggableWindow
                    title="Reference Labs"
                    isOpen={activeTools.includes('labs')}
                    onClose={() => closeTool('labs')}
                    zIndex={zIndices['labs']}
                    onFocus={() => bringToFront('labs')}
                    width={380}
                    defaultPosition={{ x: 350, y: 200 }}
                >
                    <ReferenceLabs />
                </DraggableWindow>

                {/* Text Size - Middle Left */}
                <DraggableWindow
                    title="Text Size Control"
                    isOpen={activeTools.includes('access')}
                    onClose={() => closeTool('access')}
                    zIndex={zIndices['access']}
                    onFocus={() => bringToFront('access')}
                    width={280}
                    defaultPosition={{ x: 20, y: 200 }}
                >
                    <AccessibilityTools />
                </DraggableWindow>

                {/* Highlighter - Top Right of left area */}
                <DraggableWindow
                    title="Smart Highlighter"
                    isOpen={activeTools.includes('highlighter')}
                    onClose={() => closeTool('highlighter')}
                    zIndex={zIndices['highlighter']}
                    onFocus={() => bringToFront('highlighter')}
                    width={240}
                    defaultPosition={{ x: 550, y: 80 }}
                >
                    <SmartHighlighter />
                </DraggableWindow>
            </div>
        </div>
    );
};
