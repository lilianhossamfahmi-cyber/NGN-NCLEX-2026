
import { UnifiedDataPipeline } from '../UnifiedDataPipeline';

// Re-export but use the new pipeline logic
export class ItemIngestionService {

    // Kept for backward compatibility, but delegates to the new Pipeline
    static async ingest(raw: any): Promise<any> {
        // The new UnifiedDataPipeline handles all normalization/validation internally
        const item = await UnifiedDataPipeline.transform(raw);
        return item;
    }

    // Synchoronous fallback (should be deprecated eventually)
    // For now we assume transform is mostly sync or we accept promise?
    // transform is async now. We need to check if ANY sync callers exist.
    // If sync callers exist, we might need a sync version in Pipeline or migrate them.
    static ingestSync(raw: any): any {
        console.warn("ItemIngestionService.ingestSync is deprecated. Use async ingest()");
        // Best effort sync normalization (Legacy)
        return UnifiedDataPipeline.transformSync(raw); // We need to add this back to Pipeline?
    }
}
