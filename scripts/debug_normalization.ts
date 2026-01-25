
import { MgtCareItems_Final_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch1';

// Simulated normalizeConfig from ItemRenderer.tsx
const normalizeConfig = (raw: any): any => {
    if (!raw) return { type: 'unknown' };

    if (raw._unifiedPipelineProcessed || true) { // Force true for test
        const config = raw.content?.structure || raw;
        return {
            ...config,
            id: raw.id || config.id,
            type: raw.type || config.type || 'unknown',
            clinicalData: raw.content?.clinicalData || config.clinicalData,
            actions: config.actions || raw.actions,
            conditions: config.conditions || raw.conditions,
            parameters: config.parameters || raw.parameters,
            trendTable: config.trendTable || raw.trendTable, // ADD THIS LINE
        };
    }
    return {};
};

const item = MgtCareItems_Final_Batch1[2]; // Ethics Item
// Simulate the flag being set by the push script
(item as any)._unifiedPipelineProcessed = true;

const config = normalizeConfig(item);

console.log('--- TEST: normalizeConfig result ---');
console.log('ID:', config.id);
console.log('Type:', config.type);
console.log('Prompt:', config.prompt);
console.log('Has TrendTable:', !!config.trendTable);
if (config.trendTable) {
    console.log('TrendTable Columns:', config.trendTable.columns);
    console.log('TrendTable Rows count:', config.trendTable.rows?.length);
}
console.log('Options count:', config.options?.length);
console.log('isSATA (sim):', (config.questionFormat === 'sata' || !!config.selectCount));
