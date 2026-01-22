
import { ItemManager } from './ItemManager';
import { AbstractItemManager } from './AbstractItemManager'; // Using base class for shared logic

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
        // Phase 2: We will register actual managers here
        // this.register(new BowTieManager());
        // this.register(new CaseStudyManager());
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
