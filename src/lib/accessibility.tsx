/**
 * ACCESSIBILITY UTILITIES - WCAG 2.1 AA Compliance
 * Keyboard navigation, ARIA helpers, screen reader support
 */

import React, { useEffect, useCallback, useState, createContext, useContext } from 'react';

// ==================== KEYBOARD SHORTCUTS ====================

export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    description: string;
    action: () => void;
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA' ||
                (document.activeElement as HTMLElement)?.isContentEditable
            ) {
                // Allow Escape to still work
                if (e.key !== 'Escape') return;
            }

            for (const shortcut of shortcuts) {
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = !shortcut.ctrlKey || e.ctrlKey || e.metaKey;
                const shiftMatch = !shortcut.shiftKey || e.shiftKey;
                const altMatch = !shortcut.altKey || e.altKey;

                if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                    e.preventDefault();
                    shortcut.action();
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}

/**
 * Default application shortcuts
 */
export function getDefaultShortcuts(actions: {
    createNew?: () => void;
    save?: () => void;
    closeModal?: () => void;
    search?: () => void;
    help?: () => void;
}): KeyboardShortcut[] {
    const shortcuts: KeyboardShortcut[] = [];

    if (actions.createNew) {
        shortcuts.push({
            key: 'n',
            ctrlKey: true,
            description: 'Create new item',
            action: actions.createNew
        });
    }

    if (actions.save) {
        shortcuts.push({
            key: 's',
            ctrlKey: true,
            description: 'Save current item',
            action: actions.save
        });
    }

    if (actions.closeModal) {
        shortcuts.push({
            key: 'Escape',
            description: 'Close modal or cancel',
            action: actions.closeModal
        });
    }

    if (actions.search) {
        shortcuts.push({
            key: 'k',
            ctrlKey: true,
            description: 'Open search',
            action: actions.search
        });
    }

    if (actions.help) {
        shortcuts.push({
            key: '?',
            shiftKey: true,
            description: 'Show keyboard shortcuts',
            action: actions.help
        });
    }

    return shortcuts;
}

// ==================== SCREEN READER ANNOUNCEMENTS ====================

interface AnnouncementContextType {
    announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AnnouncementContext = createContext<AnnouncementContextType>({
    announce: () => { }
});

/**
 * Provider for screen reader announcements
 */
export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [politeMessage, setPoliteMessage] = useState('');
    const [assertiveMessage, setAssertiveMessage] = useState('');

    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        if (priority === 'assertive') {
            setAssertiveMessage(message);
            setTimeout(() => setAssertiveMessage(''), 1000);
        } else {
            setPoliteMessage(message);
            setTimeout(() => setPoliteMessage(''), 1000);
        }
    }, []);

    return (
        <AnnouncementContext.Provider value={{ announce }}>
            {children}

            {/* Polite announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {politeMessage}
            </div>

            {/* Assertive announcements (interrupts) */}
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            >
                {assertiveMessage}
            </div>
        </AnnouncementContext.Provider>
    );
};

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
    return useContext(AnnouncementContext);
}

// ==================== FOCUS MANAGEMENT ====================

/**
 * Hook to trap focus within a container (for modals)
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element on mount
        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab: going backwards
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab: going forwards
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    }, [containerRef, isActive]);
}

/**
 * Hook to restore focus when a component unmounts
 */
export function useRestoreFocus() {
    const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPreviousFocus(document.activeElement as HTMLElement);

        return () => {
            previousFocus?.focus();
        };
    }, []);

    return previousFocus;
}

// ==================== ARIA HELPERS ====================

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function useAriaId(prefix: string = 'aria'): string {
    const [id] = useState(() => `${prefix}-${++idCounter}`);
    return id;
}

/**
 * Props for accessible buttons
 */
export interface AccessibleButtonProps {
    label: string;
    description?: string;
    disabled?: boolean;
    pressed?: boolean;
    expanded?: boolean;
    controls?: string;
}

export function getButtonAriaProps(props: AccessibleButtonProps) {
    return {
        'aria-label': props.label,
        'aria-describedby': props.description ? `${props.label}-desc` : undefined,
        'aria-disabled': props.disabled,
        'aria-pressed': props.pressed,
        'aria-expanded': props.expanded,
        'aria-controls': props.controls,
        tabIndex: props.disabled ? -1 : 0
    };
}

// ==================== SKIP LINKS ====================

/**
 * Skip to main content link
 */
export const SkipLink: React.FC<{ targetId: string }> = ({ targetId }) => (
    <a
        href={`#${targetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById(targetId);
            target?.focus();
            target?.scrollIntoView({ behavior: 'smooth' });
        }}
    >
        Skip to main content
    </a>
);

// ==================== COLOR CONTRAST UTILITIES ====================

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        const val = c / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Check if color combination meets WCAG requirements
 */
export function meetsWcagContrast(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = getContrastRatio(foreground, background);
    return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
}

// ==================== REDUCED MOTION ====================

/**
 * Hook to check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

// ==================== ACCESSIBLE COMPONENTS ====================

/**
 * Visually hidden text (for screen readers only)
 */
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="sr-only">{children}</span>
);

/**
 * Loading indicator with screen reader support
 */
export const AccessibleLoading: React.FC<{ label?: string }> = ({ label = 'Loading' }) => (
    <div role="status" aria-live="polite" className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
        <span className="sr-only">{label}</span>
    </div>
);

/**
 * Keyboard shortcuts help modal
 */
export const KeyboardShortcutsHelp: React.FC<{
    shortcuts: KeyboardShortcut[];
    isOpen: boolean;
    onClose: () => void;
}> = ({ shortcuts, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
        >
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                <h2 id="shortcuts-title" className="text-xl font-bold text-slate-900 mb-4">
                    Keyboard Shortcuts
                </h2>

                <ul className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span className="text-slate-600">{shortcut.description}</span>
                            <kbd className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                                {shortcut.ctrlKey && 'Ctrl + '}
                                {shortcut.shiftKey && 'Shift + '}
                                {shortcut.altKey && 'Alt + '}
                                {shortcut.key.toUpperCase()}
                            </kbd>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
                    autoFocus
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// ==================== CSS FOCUS STYLES (to be added to global CSS) ====================

export const FOCUS_STYLES = `
/* Visible focus ring for all interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Screen reader only class */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Show on focus for skip links */
.sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
}

/* Ensure minimum touch target size */
button,
a,
input[type="checkbox"],
input[type="radio"],
[role="button"] {
    min-width: 44px;
    min-height: 44px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    button, a {
        border: 2px solid currentColor;
    }
}
`;

export default {
    useKeyboardShortcuts,
    getDefaultShortcuts,
    useAnnounce,
    AnnouncementProvider,
    useFocusTrap,
    useRestoreFocus,
    useAriaId,
    SkipLink,
    VisuallyHidden,
    AccessibleLoading,
    KeyboardShortcutsHelp,
    getContrastRatio,
    meetsWcagContrast,
    usePrefersReducedMotion
};
