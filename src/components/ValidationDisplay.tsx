import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';
import type { ValidationResult } from '../lib/DataSanitizer';

interface ValidationDisplayProps {
    validation: ValidationResult | null;
    onDismiss?: () => void;
    title?: string;
}

/**
 * Component to display validation errors and warnings
 * Used when clinical data fails sanitization checks
 */
export const ValidationDisplay: React.FC<ValidationDisplayProps> = ({
    validation,
    onDismiss,
    title = 'Data Validation'
}) => {
    if (!validation) return null;

    // Success state
    if (validation.valid) {
        return (
            <div className="fixed bottom-4 right-4 bg-green-50 border-2 border-green-500 rounded-xl shadow-lg p-4 max-w-md z-50 animate-slide-in">
                <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                    <div className="flex-1">
                        <div className="font-bold text-green-900">{title}</div>
                        <div className="text-sm text-green-700 mt-1">
                            All clinical data validated successfully. No errors detected.
                        </div>
                    </div>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Error state
    const errorCount = validation.errors.length;
    const isCritical = errorCount > 5 || validation.errors.some(e =>
        e.toLowerCase().includes('dangerously') ||
        e.toLowerCase().includes('critical') ||
        e.toLowerCase().includes('xss')
    );

    return (
        <div
            className={`fixed bottom-4 right-4 rounded-xl shadow-2xl p-5 max-w-lg z-50 animate-slide-in border-2 ${isCritical
                ? 'bg-red-50 border-red-500'
                : 'bg-amber-50 border-amber-500'
                }`}
        >
            <div className="flex items-start gap-3">
                {isCritical ? (
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                ) : (
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
                )}

                <div className="flex-1 min-w-0">
                    <div className={`font-bold ${isCritical ? 'text-red-900' : 'text-amber-900'}`}>
                        {title} - {errorCount} {errorCount === 1 ? 'Issue' : 'Issues'} Found
                    </div>

                    <div className="text-sm mt-2 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                        {validation.errors.map((error, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-2 p-2 rounded ${isCritical ? 'bg-red-100/50' : 'bg-amber-100/50'
                                    }`}
                            >
                                <span className={`font-bold flex-shrink-0 ${isCritical ? 'text-red-700' : 'text-amber-700'
                                    }`}>
                                    {index + 1}.
                                </span>
                                <span className={`flex-1 ${isCritical ? 'text-red-800' : 'text-amber-800'
                                    }`}>
                                    {error}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={`text-xs mt-3 pt-3 border-t ${isCritical ? 'border-red-200 text-red-700' : 'border-amber-200 text-amber-700'
                        }`}>
                        <strong>Action Required:</strong> {isCritical
                            ? 'Critical validation errors must be fixed before continuing.'
                            : 'Please review and correct the highlighted issues.'}
                    </div>
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className={`${isCritical ? 'text-red-600 hover:text-red-800' : 'text-amber-600 hover:text-amber-800'
                            } transition-colors flex-shrink-0`}
                        aria-label="Dismiss"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}} />
        </div>
    );
};

/**
 * Inline validation badge for individual fields
 */
interface ValidationBadgeProps {
    errors: string[];
    showOnlyIfErrors?: boolean;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
    errors,
    showOnlyIfErrors = true
}) => {
    if (showOnlyIfErrors && errors.length === 0) return null;

    const isValid = errors.length === 0;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isValid
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {isValid ? (
                <>
                    <CheckCircle size={12} />
                    <span>Valid</span>
                </>
            ) : (
                <>
                    <AlertCircle size={12} />
                    <span>{errors.length} {errors.length === 1 ? 'Error' : 'Errors'}</span>
                </>
            )}
        </div>
    );
};

export default ValidationDisplay;
