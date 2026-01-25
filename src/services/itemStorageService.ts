import { MasterQuestionItem } from '../types/master-schema';
import { enrichItemWithQuality } from '../utils/autoQuality';

const STORAGE_KEY = 'ngn_item_bank';

export const saveItemToBank = (item: MasterQuestionItem): boolean => {
    try {
        const bank = getBankItems();
        // Enrich with quality score and status
        const enriched = enrichItemWithQuality(item);
        // Check duplicate ID
        const index = bank.findIndex(i => i.id === enriched.id);
        if (index >= 0) {
            bank[index] = enriched; // Update existing
        } else {
            bank.push(enriched);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
        return true;
    } catch (e) {
        console.error("Failed to save item:", e);
        return false;
    }
};

export const saveBatchToBank = (items: MasterQuestionItem[]): number => {
    try {
        const bank = getBankItems();
        let addedCount = 0;
        items.forEach(item => {
            const enriched = enrichItemWithQuality(item);
            const index = bank.findIndex(i => i.id === enriched.id);
            if (index >= 0) {
                bank[index] = enriched;
            } else {
                bank.push(enriched);
                addedCount++;
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
        return addedCount;
    } catch (e) {
        console.error("Failed to save batch:", e);
        return 0;
    }
};

export const getBankItems = (): MasterQuestionItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
};

export const deleteItemFromBank = (id: string): void => {
    const bank = getBankItems();
    const newBank = bank.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBank));
};

export const deleteBatchFromBank = (ids: string[]): void => {
    const bank = getBankItems();
    const newBank = bank.filter(i => !ids.includes(String(i.id)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBank));
};

export const clearBank = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
