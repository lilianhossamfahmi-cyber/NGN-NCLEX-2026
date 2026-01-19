export interface DiffResult {
    type: 'added' | 'removed' | 'equal';
    value: string;
}

/**
 * A simple word-level diffing utility to show changes between old and new text.
 * For production, consider using 'diff-match-patch' for better character-level diffs.
 */
export function diffTexts(oldText: any, newText: any): DiffResult[] {
    const sOld = String(oldText || '');
    const sNew = String(newText || '');
    const oldWords = sOld.split(/(\s+)/);
    const newWords = sNew.split(/(\s+)/);

    // Using a basic LCS or simple comparison for speed
    // This is a naive implementation; for NGN data it works well for word changes.
    let oldIdx = 0;
    let newIdx = 0;
    const results: DiffResult[] = [];

    while (oldIdx < oldWords.length || newIdx < newWords.length) {
        if (oldIdx < oldWords.length && newIdx < newWords.length && oldWords[oldIdx] === newWords[newIdx]) {
            results.push({ type: 'equal', value: oldWords[oldIdx] });
            oldIdx++;
            newIdx++;
        } else {
            // Check if word was removed
            if (oldIdx < oldWords.length && !newWords.includes(oldWords[oldIdx], newIdx)) {
                results.push({ type: 'removed', value: oldWords[oldIdx] });
                oldIdx++;
            }
            // Check if word was added
            else if (newIdx < newWords.length) {
                results.push({ type: 'added', value: newWords[newIdx] });
                newIdx++;
            }
        }
    }

    return results;
}

/**
 * Utility to diff entire objects by key (especially clinicalData)
 */
export function diffObjects(oldObj: any, newObj: any): Record<string, DiffResult[]> {
    const diffMap: Record<string, DiffResult[]> = {};

    const keys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

    keys.forEach(key => {
        const oldVal = typeof oldObj?.[key] === 'string' ? oldObj[key] : JSON.stringify(oldObj?.[key] || '');
        const newVal = typeof newObj?.[key] === 'string' ? newObj[key] : JSON.stringify(newObj?.[key] || '');

        if (oldVal !== newVal) {
            diffMap[key] = diffTexts(oldVal, newVal);
        }
    });

    return diffMap;
}
