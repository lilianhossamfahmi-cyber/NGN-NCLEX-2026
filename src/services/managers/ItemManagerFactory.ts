
import { ItemManager } from './ItemManager';
import { AbstractItemManager } from './AbstractItemManager';
import { BowTieManager } from './BowTieManager';
import { HighlightManager } from './HighlightManager';

// Placeholder for future managers
class PlaceholderManager extends AbstractItemManager {
    typeKeys = [];
    repairSpecific(item: any) { return Promise.resolve(item); }
    validate() { return { isValid: true, issues: [] }; }
    formatForDisplay(item: any) { return item; }
    grade() { return { score: 0, maxScore: 0, feedback: '', correctIds: [] }; }
}

/**
 * THE MANAGER FACTORY
 * The Central Router that assigns the right "CEO" to each item type.
 */
export class ItemManagerFactory {
    private static managers: Map<string, ItemManager> = new Map();

    /**
     * Registers all managers (Run this once at app startup)
     */
    static registerAll() {
        // Phase 2: Managers
        this.register(new BowTieManager());
        this.register(new HighlightManager());
        // Future: this.register(new CaseStudyManager());
    }

    static register(manager: ItemManager) {
        manager.typeKeys.forEach(key => {
            this.managers.set(key, manager);
        });
    }

    /**
     * Gets the specific manager for an item type.
     * Returns a "Generic Manager" if no specialist is found (Graceful Fallback).
     */
    static getManager(type: string): ItemManager {
        const specialized = this.managers.get(type);
        if (specialized) return specialized;

        // Fallback: Return a generic manager that just does basic clinical cleanup
        return new PlaceholderManager();
    }
}
