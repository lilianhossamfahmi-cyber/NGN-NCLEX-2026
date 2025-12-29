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

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
                <FloatingDock activeTools={activeTools} onToggle={toggleTool} />
            </div>

            <div style={{ pointerEvents: 'auto' }}>
                <DraggableWindow
                    title="Pro Calculator"
                    isOpen={activeTools.includes('calc')}
                    onClose={() => closeTool('calc')}
                    zIndex={zIndices['calc']}
                    onFocus={() => bringToFront('calc')}
                    width={280}
                    defaultPosition={{ x: 100, y: 100 }}
                >
                    <ProCalculator />
                </DraggableWindow>

                <DraggableWindow
                    title="Smart Notepad"
                    isOpen={activeTools.includes('notes')}
                    onClose={() => closeTool('notes')}
                    zIndex={zIndices['notes']}
                    onFocus={() => bringToFront('notes')}
                    width={320}
                    defaultPosition={{ x: 400, y: 100 }}
                >
                    <SmartNotepad />
                </DraggableWindow>

                <DraggableWindow
                    title="Exam Timer"
                    isOpen={activeTools.includes('timer')}
                    onClose={() => closeTool('timer')}
                    zIndex={zIndices['timer']}
                    onFocus={() => bringToFront('timer')}
                    width={250}
                    defaultPosition={{ x: 750, y: 50 }}
                >
                    <ExamTimer />
                </DraggableWindow>

                <DraggableWindow
                    title="Reference Labs"
                    isOpen={activeTools.includes('labs')}
                    onClose={() => closeTool('labs')}
                    zIndex={zIndices['labs']}
                    onFocus={() => bringToFront('labs')}
                    width={400}
                    defaultPosition={{ x: 150, y: 300 }}
                >
                    <ReferenceLabs />
                </DraggableWindow>

                <DraggableWindow
                    title="Text Size Control"
                    isOpen={activeTools.includes('access')}
                    onClose={() => closeTool('access')}
                    zIndex={zIndices['access']}
                    onFocus={() => bringToFront('access')}
                    width={300}
                    defaultPosition={{ x: 600, y: 300 }}
                >
                    <AccessibilityTools />
                </DraggableWindow>

                <DraggableWindow
                    title="Smart Highlighter"
                    isOpen={activeTools.includes('highlighter')}
                    onClose={() => closeTool('highlighter')}
                    zIndex={zIndices['highlighter']}
                    onFocus={() => bringToFront('highlighter')}
                    width={250}
                    defaultPosition={{ x: 500, y: 200 }}
                >
                    <SmartHighlighter />
                </DraggableWindow>
            </div>
        </div>
    );
};
