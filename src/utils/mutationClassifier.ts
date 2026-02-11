import type { MasterQuestionItem } from '../types/master-schema';

export type MutationClass = 'COSMETIC' | 'STRUCTURAL';

export interface SanitizeResult {
    action: 'UPDATE_IN_PLACE' | 'FORK_NEW_ITEM';
    newItem: MasterQuestionItem;
    retireOriginalId?: string;
    mutationClass: MutationClass;
    changedPaths?: string[];
}

const SCORING_CRITICAL_PATHS = [
    'content.structure.options',
    'content.structure.correctAnswers',
    'content.structure.correctAnswer',
    'content.structure.rows',
    'content.structure.columns',
    'content.structure.screens',
    'content.structure.conditions',
    'content.structure.actions',
    'content.structure.sequenceOrder',
    'content.structure.categories',
    'content.structure.targets',
    'content.structure.parameters', // Bow-Tie
    'content.structure.sentences', // Drop-Cloze
    'content.structure.dropdowns', // Drop-Cloze
    'content.structure.correctValue', // Calculation
    'content.structure.tolerance', // Calculation
    'content.structure.correct', // Highlight
    'typeId',
    'type', // Added since both are used
] as const;

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, key) =>
        curr && typeof curr === 'object' ? curr[key] : undefined, obj);
}

export function classifyMutation(
    original: MasterQuestionItem,
    patched: MasterQuestionItem
): { mutationClass: MutationClass; changedPaths: string[] } {
    const changedPaths: string[] = [];
    for (const path of SCORING_CRITICAL_PATHS) {
        const oldVal = JSON.stringify(getNestedValue(original, path));
        const newVal = JSON.stringify(getNestedValue(patched, path));
        if (oldVal !== newVal) {
            changedPaths.push(path);
        }
    }
    return {
        mutationClass: changedPaths.length > 0 ? 'STRUCTURAL' : 'COSMETIC',
        changedPaths,
    };
}
