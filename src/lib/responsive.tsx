/**
 * MOBILE RESPONSIVENESS - Touch optimization & responsive utilities
 * Breakpoints, touch gestures, mobile navigation
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ==================== BREAKPOINTS ====================

export const BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width >= BREAKPOINTS['2xl']) setBreakpoint('2xl');
            else if (width >= BREAKPOINTS.xl) setBreakpoint('xl');
            else if (width >= BREAKPOINTS.lg) setBreakpoint('lg');
            else if (width >= BREAKPOINTS.md) setBreakpoint('md');
            else if (width >= BREAKPOINTS.sm) setBreakpoint('sm');
            else setBreakpoint('xs');
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return breakpoint;
}

/**
 * Hook to check if current viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/**
 * Common media query hooks
 */
export function useIsMobile(): boolean {
    return useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
}

export function useIsTablet(): boolean {
    return useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
}

export function useIsDesktop(): boolean {
    return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

// ==================== TOUCH GESTURES ====================

interface SwipeState {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    swiping: boolean;
}

interface SwipeHandlers {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    onSwipedUp?: () => void;
    onSwipedDown?: () => void;
    onSwiping?: (deltaX: number, deltaY: number) => void;
    threshold?: number;
    preventScroll?: boolean;
}

/**
 * Hook for swipe gesture detection
 */
export function useSwipeable(handlers: SwipeHandlers) {
    const { threshold = 50, preventScroll = false } = handlers;
    const [swipeState, setSwipeState] = useState<SwipeState>({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        swiping: false
    });

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        setSwipeState({
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY,
            swiping: true
        });
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!swipeState.swiping) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - swipeState.startX;
        const deltaY = touch.clientY - swipeState.startY;

        if (preventScroll) {
            e.preventDefault();
        }

        setSwipeState(prev => ({
            ...prev,
            currentX: touch.clientX,
            currentY: touch.clientY
        }));

        handlers.onSwiping?.(deltaX, deltaY);
    }, [swipeState.swiping, swipeState.startX, swipeState.startY, handlers, preventScroll]);

    const handleTouchEnd = useCallback(() => {
        if (!swipeState.swiping) return;

        const deltaX = swipeState.currentX - swipeState.startX;
        const deltaY = swipeState.currentY - swipeState.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > threshold && absX > absY) {
            if (deltaX > 0) {
                handlers.onSwipedRight?.();
            } else {
                handlers.onSwipedLeft?.();
            }
        } else if (absY > threshold && absY > absX) {
            if (deltaY > 0) {
                handlers.onSwipedDown?.();
            } else {
                handlers.onSwipedUp?.();
            }
        }

        setSwipeState(prev => ({ ...prev, swiping: false }));
    }, [swipeState, threshold, handlers]);

    return {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd
    };
}

// ==================== MOBILE NAVIGATION ====================

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * Slide-out mobile navigation drawer
 */
export const MobileNavDrawer: React.FC<MobileNavProps> = ({ isOpen, onClose, children }) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Swipe to close
    const swipeHandlers = useSwipeable({
        onSwipedLeft: onClose,
        threshold: 100
    });

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform"
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                {...swipeHandlers}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>
                <nav className="p-4">
                    {children}
                </nav>
            </div>
        </>
    );
};

/**
 * Hamburger menu button
 */
export const HamburgerButton: React.FC<{
    isOpen: boolean;
    onClick: () => void;
}> = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
    >
        <span
            className={`w-6 h-0.5 bg-slate-700 transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
            aria-hidden="true"
        />
        <span
            className={`w-6 h-0.5 bg-slate-700 transition-opacity ${isOpen ? 'opacity-0' : ''}`}
            aria-hidden="true"
        />
        <span
            className={`w-6 h-0.5 bg-slate-700 transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
            aria-hidden="true"
        />
    </button>
);

// ==================== RESPONSIVE COMPONENTS ====================

/**
 * Container with responsive padding
 */
export const ResponsiveContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
        {children}
    </div>
);

/**
 * Responsive grid
 */
export const ResponsiveGrid: React.FC<{
    children: React.ReactNode;
    cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
    gap?: number;
    className?: string;
}> = ({ children, cols = {}, gap = 4, className = '' }) => {
    const { xs = 1, sm = 2, md = 2, lg = 3, xl = 4 } = cols;

    return (
        <div
            className={`grid gap-${gap} ${className}`}
            style={{
                gridTemplateColumns: `repeat(${xs}, minmax(0, 1fr))`
            }}
        >
            <style>{`
                @media (min-width: ${BREAKPOINTS.sm}px) {
                    .responsive-grid { grid-template-columns: repeat(${sm}, minmax(0, 1fr)); }
                }
                @media (min-width: ${BREAKPOINTS.md}px) {
                    .responsive-grid { grid-template-columns: repeat(${md}, minmax(0, 1fr)); }
                }
                @media (min-width: ${BREAKPOINTS.lg}px) {
                    .responsive-grid { grid-template-columns: repeat(${lg}, minmax(0, 1fr)); }
                }
                @media (min-width: ${BREAKPOINTS.xl}px) {
                    .responsive-grid { grid-template-columns: repeat(${xl}, minmax(0, 1fr)); }
                }
            `}</style>
            {children}
        </div>
    );
};

/**
 * Touch-optimized button
 */
export const TouchButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    'aria-label': ariaLabel
}) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

        const variantStyles = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500',
            ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500'
        };

        const sizeStyles = {
            sm: 'px-3 py-2 text-sm min-w-[44px] min-h-[44px]',
            md: 'px-4 py-3 text-base min-w-[44px] min-h-[44px]',
            lg: 'px-6 py-4 text-lg min-w-[44px] min-h-[44px]'
        };

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                aria-label={ariaLabel}
            >
                {children}
            </button>
        );
    };

// ==================== RESPONSIVE CSS ====================

export const RESPONSIVE_STYLES = `
/* Mobile-first responsive breakpoints */

/* Base (Mobile: 0-639px) */
html {
    font-size: 16px;
    -webkit-tap-highlight-color: transparent;
}

/* Ensure minimum touch target size */
button, 
a, 
[role="button"],
input[type="checkbox"],
input[type="radio"] {
    min-width: 44px;
    min-height: 44px;
}

/* Safe area padding for notched devices */
.safe-area-inset {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
}

/* Prevent horizontal scroll */
body {
    overflow-x: hidden;
}

/* Mobile container padding */
@media (max-width: 639px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    /* Stack elements vertically */
    .mobile-stack {
        flex-direction: column !important;
    }
    
    /* Full width on mobile */
    .mobile-full-width {
        width: 100% !important;
    }
    
    /* Hide on mobile */
    .desktop-only {
        display: none !important;
    }
}

/* Tablet: 640-1023px */
@media (min-width: 640px) and (max-width: 1023px) {
    .container {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    
    /* 2 column grid on tablet */
    .responsive-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
    .container {
        padding-left: 2rem;
        padding-right: 2rem;
    }
    
    /* Hide on desktop */
    .mobile-only {
        display: none !important;
    }
    
    /* 3+ column grid on desktop */
    .responsive-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Touch device optimizations */
@media (pointer: coarse) {
    /* Larger touch targets */
    button, a, [role="button"] {
        padding: 12px 16px;
    }
    
    /* Remove hover states on touch */
    .no-touch-hover:hover {
        background-color: inherit;
    }
}

/* Print styles */
@media print {
    .no-print {
        display: none !important;
    }
}
`;

// ==================== VIEWPORT UTILITIES ====================

/**
 * Hook to get viewport dimensions
 */
export function useViewport() {
    const [viewport, setViewport] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768
    });

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewport;
}

/**
 * Hook to detect if device is touch-enabled
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    return isTouch;
}

/**
 * Hook to detect device orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        handleOrientationChange();
        window.addEventListener('resize', handleOrientationChange);
        return () => window.removeEventListener('resize', handleOrientationChange);
    }, []);

    return orientation;
}

export default {
    BREAKPOINTS,
    useBreakpoint,
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useSwipeable,
    MobileNavDrawer,
    HamburgerButton,
    ResponsiveContainer,
    ResponsiveGrid,
    TouchButton,
    useViewport,
    useIsTouchDevice,
    useOrientation
};
