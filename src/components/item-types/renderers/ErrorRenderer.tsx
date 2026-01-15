import React from 'react';

export const ErrorRenderer = ({ config }: { config: any }) => {
    return (
        <div className="p-6 my-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
            <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                <span>⚠️</span> Generation Error
            </h3>
            <p className="text-red-700 mb-4 text-sm">
                The AI generated an item that failed strict clinical validation.
            </p>

            {config.errorDetails && (
                <details className="mb-4 text-xs">
                    <summary className="cursor-pointer text-red-600 font-medium hover:text-red-800">
                        View Technical Details
                    </summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded text-red-900 border border-red-200 overflow-auto max-h-40">
                        {JSON.stringify(config.errorDetails, null, 2)}
                    </pre>
                </details>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
                >
                    Regenerate Item
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-red-200 text-[10px] text-red-400 font-mono">
                Result: REJECTED_BY_ZOD_PIPELINE
            </div>
        </div>
    );
};
