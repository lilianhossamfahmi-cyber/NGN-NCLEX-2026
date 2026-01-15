import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { quotaTracker } from '../lib/quotaTracker';
import { geminiRateLimiter } from '../lib/rateLimiter';
import { requestQueue } from '../lib/requestQueue';

interface QuotaDisplayProps {
    compact?: boolean;
    showDetails?: boolean;
}

/**
 * Displays API quota usage and rate limit status
 */
export const QuotaDisplay: React.FC<QuotaDisplayProps> = ({ compact = false, showDetails = true }) => {
    const [report, setReport] = useState(quotaTracker.getDetailedReport());
    const [rateLimitStatus, setRateLimitStatus] = useState(geminiRateLimiter.getStatus());
    const [queueStats, setQueueStats] = useState(requestQueue.getStats());

    useEffect(() => {
        const interval = setInterval(() => {
            setReport(quotaTracker.getDetailedReport());
            setRateLimitStatus(geminiRateLimiter.getStatus());
            setQueueStats(requestQueue.getStats());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <QuotaStatusBadge status={report.status} />
                <span className="text-slate-600">
                    {report.remaining.requests.toLocaleString()} / {report.limits.maxDailyRequests.toLocaleString()} requests
                </span>
            </div>
        );
    }

    const getStatusColor = () => {
        switch (report.status) {
            case 'healthy': return 'bg-green-50 border-green-200';
            case 'warning': return 'bg-amber-50 border-amber-200';
            case 'exceeded': return 'bg-red-50 border-red-200';
        }
    };

    const getProgressColor = () => {
        if (report.remaining.percentage >= 80) return 'bg-red-500';
        if (report.remaining.percentage >= 60) return 'bg-amber-500';
        return 'bg-green-500';
    };

    return (
        <div className={`rounded-xl border-2 p-4 ${getStatusColor()}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <QuotaStatusIcon status={report.status} />
                    <h3 className="font-bold text-slate-800">API Quota Status</h3>
                </div>
                <QuotaStatusBadge status={report.status} />
            </div>

            {/* Request Progress */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Daily Requests</span>
                    <span className="font-bold text-slate-900">
                        {report.usage.requests.toLocaleString()} / {report.limits.maxDailyRequests.toLocaleString()}
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${getProgressColor()}`}
                        style={{ width: `${Math.min(100, report.remaining.percentage)}%` }}
                    />
                </div>
                <div className="text-xs text-slate-500">
                    {report.remaining.requests.toLocaleString()} requests remaining
                </div>
            </div>

            {showDetails && (
                <>
                    {/* Cost & Tokens */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="text-xs text-slate-600 mb-1">Estimated Cost</div>
                            <div className="text-lg font-bold text-slate-900">
                                ${report.usage.cost.toFixed(3)}
                            </div>
                            <div className="text-xs text-slate-500">
                                / ${report.limits.maxDailyCost}
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-50 rounded-lg p-3">
                            <div className="text-xs text-slate-600 mb-1">Tokens Used</div>
                            <div className="text-lg font-bold text-slate-900">
                                {(report.usage.tokensUsed / 1000).toFixed(1)}K
                            </div>
                            <div className="text-xs text-slate-500">
                                / {(report.limits.maxDailyTokens / 1000000).toFixed(1)}M
                            </div>
                        </div>
                    </div>

                    {/* Rate Limiter Status */}
                    <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-slate-600">Rate Limit</div>
                            <div className={`text-xs font-bold ${rateLimitStatus.remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {rateLimitStatus.remaining} / {rateLimitStatus.max} available
                            </div>
                        </div>
                        {rateLimitStatus.timeUntilReset > 0 && (
                            <div className="text-xs text-slate-500">
                                Next slot in {(rateLimitStatus.timeUntilReset / 1000).toFixed(0)}s
                            </div>
                        )}
                    </div>

                    {/* Queue Status */}
                    {queueStats.queueLength > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp size={14} className="text-blue-600" />
                                <span className="text-xs font-bold text-blue-900">
                                    {queueStats.queueLength} requests in queue
                                </span>
                            </div>
                            <div className="text-xs text-blue-700">
                                Processed: {queueStats.processed} | Failed: {queueStats.failed}
                            </div>
                        </div>
                    )}

                    {/* Reset Info */}
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                        Resets daily at midnight | Last reset: {new Date(report.usage.lastReset).toLocaleTimeString()}
                    </div>
                </>
            )}
        </div>
    );
};

const QuotaStatusIcon: React.FC<{ status: 'healthy' | 'warning' | 'exceeded' }> = ({ status }) => {
    switch (status) {
        case 'healthy':
            return <CheckCircle size={20} className="text-green-600" />;
        case 'warning':
            return <AlertTriangle size={20} className="text-amber-600" />;
        case 'exceeded':
            return <XCircle size={20} className="text-red-600" />;
    }
};

const QuotaStatusBadge: React.FC<{ status: 'healthy' | 'warning' | 'exceeded' }> = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'warning':
                return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'exceeded':
                return 'bg-red-100 text-red-700 border-red-300';
        }
    };

    const getLabel = () => {
        switch (status) {
            case 'healthy': return 'Healthy';
            case 'warning': return 'Warning';
            case 'exceeded': return 'Exceeded';
        }
    };

    return (
        <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getStyles()}`}>
            {getLabel()}
        </div>
    );
};

/**
 * Compact quota indicator for header/status bar
 */
export const QuotaIndicator: React.FC = () => {
    const [remaining, setRemaining] = useState(quotaTracker.getRemainingQuota());

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(quotaTracker.getRemainingQuota());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getColor = () => {
        if (remaining.percentage >= 80) return 'text-red-600';
        if (remaining.percentage >= 60) return 'text-amber-600';
        return 'text-green-600';
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getColor().replace('text', 'bg')}`} />
            <span className={`text-sm font-medium ${getColor()}`}>
                {remaining.requests.toLocaleString()}
            </span>
        </div>
    );
};

export default QuotaDisplay;
