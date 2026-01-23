
import { ItemManager } from './ItemManager';
import { AbstractItemManager } from './AbstractItemManager';
import { BowTieManager } from './BowTieManager';
import { HighlightManager } from './HighlightManager';
import { CaseStudyManager } from './CaseStudyManager';
import { TrendManager } from './TrendManager';
import { CalculationManager } from './CalculationManager';
import { HotSpotManager } from './HotSpotManager';
import { MatrixManager } from './MatrixManager';
import { OrderedResponseManager } from './OrderedResponseManager';
import { ClozeDropDownManager } from './ClozeDropDownManager';
import { DropClozeManager } from './DropClozeManager';
import { MultipleResponseManager } from './MultipleResponseManager';

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
    private static initialized = false;

    /**
     * Registers all managers (Run this once at app startup)
     */
    static registerAll() {
        if (this.initialized) return;
        this.initialized = true;

        // Phase 2: Managers
        this.register(new BowTieManager());
        this.register(new HighlightManager());
        this.register(new CaseStudyManager());

        // Phase 3: Specialists
        this.register(new TrendManager());
        this.register(new CalculationManager());
        this.register(new HotSpotManager());
        this.register(new MatrixManager());

        this.register(new OrderedResponseManager());
        this.register(new ClozeDropDownManager());
        this.register(new DropClozeManager());
        this.register(new MultipleResponseManager());
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
