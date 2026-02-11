import { supabase } from '../lib/supabase';
import type { SanitizeResult } from '../utils/mutationClassifier';
import type { MasterQuestionItem } from '../types/master-schema';

export async function logRepairEvent(
    originalItem: MasterQuestionItem,
    result: SanitizeResult,
    source: string = 'ultraFixer'
): Promise<void> {
    try {
        const { error } = await supabase.from('repair_audit_log').insert({
            item_id: originalItem.id,
            mutation_class: result.mutationClass,
            action_taken: result.action,
            changed_paths: result.changedPaths || [],
            before_snapshot: JSON.parse(JSON.stringify(originalItem)),
            after_snapshot: JSON.parse(JSON.stringify(result.newItem)),
            repair_source: source,
            content_version_before: (originalItem.metadata as any)?.contentVersion || 1,
            content_version_after: (result.newItem.metadata as any)?.contentVersion || 1,
        });
        if (error) console.error('[REPAIR_AUDIT] Failed to log:', error.message);
    } catch (e) {
        // Audit logging must never crash the pipeline
        console.error('[REPAIR_AUDIT] Exception:', e);
    }
}
