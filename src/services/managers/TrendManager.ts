
import { AbstractItemManager } from './AbstractItemManager';
import { MasterQuestionItem } from '../../types/master-schema';
import { ValidationResult, GradingResult } from './ItemManager';

export class TrendManager extends AbstractItemManager {
    typeKeys = ['trend', 'trend-standalone', 'chart'];

    /**
     * TREND REPAIR LOGIC
     * 1. Extrapolates missing data points if data is sparse (e.g. only 1 point).
     * 2. Auto-calculates min/max Y-axis domains for better visualization.
     * 3. Ensures time-series structure is valid (Array of {time, value}).
     */
    protected async repairSpecific(item: MasterQuestionItem): Promise<MasterQuestionItem> {
        if (!item.content) item.content = {};
        const structure = item.content.structure || {};
        const clinicalData = item.content.clinicalData || {};

        // 1. DATA SOURCE MAPPING: NGN Golden Trend Alignment
        // Check if trend data is at clinicalData.vitals (The NGN Standard)
        const vitals = clinicalData.vitals || (item.content as any).vitalSigns;

        if (vitals && Array.isArray(vitals) && vitals.length > 0) {
            // Map vitals to 'trendTable' format expected by TrendRenderer.tsx
            const columns = ['Time', 'Temp', 'HR', 'RR', 'BP', 'SpO2'];
            const rows = vitals.map(v => [
                v.time || '?',
                v.tempF || v.temp || '-',
                v.hr || '-',
                v.rr || '-',
                v.bp || '-',
                (v.o2 || v.spo2 || '-') + (v.o2_device ? ` (${v.o2_device})` : '')
            ]);

            structure.trendTable = { columns, rows };
            console.log('[TrendManager] Successfully mapped Vitals to TrendTable structure');
        }

        // 2. Legacy Support: Ensure Data Array Exists (for Chart-only types)
        if (!structure.data || !Array.isArray(structure.data)) {
            structure.data = structure.points || structure.series || [];
        }

        // 3. Extrapolate if Sparse (The "Smart Fill" feature)
        if (structure.data.length === 1) {
            const point = structure.data[0];
            structure.data = [
                { time: "0800", value: Math.max(0, point.value * 0.9), label: "Previous" },
                { ...point, time: "1200", label: "Current" },
                { time: "1600", value: point.value * 1.1, label: "Projected" }
            ];
            structure.trendType = structure.trendType || "linear";
        }

        // 4. Ensure Config for Rendering
        if (!structure.config) structure.config = {};
        if (structure.data.length > 0) {
            if (!structure.config.yMin) {
                const values = structure.data.map((d: any) => Number(d.value));
                const min = Math.min(...values);
                structure.config.yMin = Math.floor(min * 0.8);
            }
            if (!structure.config.yMax) {
                const values = structure.data.map((d: any) => Number(d.value));
                const max = Math.max(...values);
                structure.config.yMax = Math.ceil(max * 1.2);
            }
        }

        item.content.structure = structure;
        return item;
    }

    validate(item: MasterQuestionItem): ValidationResult {
        const issues: any[] = [];
        const s = item.content?.structure || {};

        if (!s.data || s.data.length < 2) {
            issues.push({ severity: 'warning', field: 'data', message: 'Trend chart has fewer than 2 data points.' });
        }

        // Check for missing options (Question part)
        if (!s.options || s.options.length === 0) {
            issues.push({ severity: 'critical', field: 'options', message: 'Trend item missing answer options.' });
        }

        return { isValid: issues.filter(i => i.severity === 'critical').length === 0, issues };
    }

    formatForDisplay(item: MasterQuestionItem): any {
        // UI expects 'chartData' often
        const s = item.content?.structure || {};
        return {
            ...item,
            content: {
                ...item.content,
                chartData: s.data // Helper alias for UI
            }
        };
    }

    /**
     * Grading: Standard Single Response or SATA depending on configuration.
     * Defaulting to Single Response (0/1).
     */
    grade(userAnswer: any, correctContent: any): GradingResult {
        const userIds = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctIds = correctContent.content?.structure?.options
            ?.filter((o: any) => o.isCorrect)
            .map((o: any) => o.id) || [];

        let score = 0;
        const maxScore = correctIds.length; // If SATA, max is num correct. If Single, max 1.

        if (maxScore === 1) {
            // Single Response Mode
            score = (userIds[0] === correctIds[0]) ? 1 : 0;
        } else {
            // Multi Response Mode (+/- Rules or 0/1 All-or-Nothing?)
            // For Trend, usually it asks "What is the trend?" (Single) 
            // OR "Which interventions are appropriate?" (SATA)
            // We'll use simple match for now.
            userIds.forEach((id: string) => {
                if (correctIds.includes(id)) score++;
            });
        }

        return {
            score,
            maxScore,
            feedback: score === maxScore ? "Correct interpretation of trends." : "Incorrect analysis of the data.",
            correctIds
        };
    }
}
