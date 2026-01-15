/**
 * MobileNavBar.tsx
 * Bottom navigation for mobile viewports.
 * Only visible on screens < 768px.
 */

import React from 'react';
import { Home, ClipboardList, Activity, User, Settings } from 'lucide-react';

interface MobileNavBarProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ currentView, onNavigate }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-16">
                <NavButton
                    icon={<Home size={24} />}
                    label="Home"
                    isActive={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                />
                <NavButton
                    icon={<ClipboardList size={24} />}
                    label="Bank"
                    isActive={currentView === 'bank'}
                    onClick={() => onNavigate('bank')}
                />
                <NavButton
                    icon={<Activity size={24} />}
                    label="Analytics"
                    isActive={currentView === 'analytics' || currentView === 'student'}
                    onClick={() => onNavigate('student')}
                />
                <NavButton
                    icon={<Settings size={24} />}
                    label="Admin"
                    isActive={currentView === 'admin'}
                    onClick={() => onNavigate('admin')}
                />
            </div>
        </div>
    );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);
