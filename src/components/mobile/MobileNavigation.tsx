import React, { useState } from 'react';

interface MobileNavigationProps {
    currentView: 'dashboard' | 'bank' | 'analytics';
    onNavigate: (view: 'dashboard' | 'bank' | 'analytics') => void;
    bankCount: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onNavigate, bankCount }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Generator', icon: '⚡' },
        { id: 'bank', label: `Item Bank (${bankCount})`, icon: '📂' },
        { id: 'analytics', label: 'Analytics', icon: '📊' }
    ];

    const handleNav = (view: any) => {
        onNavigate(view);
        setIsOpen(false);
    };

    return (
        <div className="mobile-nav-container mobile-only">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 60,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem',
                    cursor: 'pointer'
                }}
                aria-label="Open Menu"
            >
                ☰
            </button>

            {/* Slide-in Drawer */}
            <div
                className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
                style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.3s' }}
                onClick={() => setIsOpen(false)}
            />

            <div
                style={{
                    position: 'fixed',
                    top: 0, bottom: 0, left: 0,
                    width: '280px',
                    background: 'var(--bg-surface)',
                    zIndex: 1002,
                    padding: '2rem 1rem',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column'
                }}
            >
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Menu</h2>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                background: currentView === item.id ? 'var(--color-primary-100)' : 'transparent',
                                color: currentView === item.id ? 'var(--color-primary-700)' : 'var(--text-primary)',
                                border: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Master NGN Generator v2.1
                </div>
            </div>
        </div>
    );
};
