
import { getBankItems } from './itemDbService';
import { logSessionAudit, DriftMetrics, FallbackEvent } from './sessionAuditDbService';
import { MasterQuestionItem } from '../types/master-schema';

export interface DifficultyRequest {
    [level: number]: number; // Level -> Count
}

export interface SessionRequest {
    mode: 'tutor' | 'exam';
    totalItems: number;
    difficultyDistribution: DifficultyRequest; // Requested counts per level
    filters?: {
        domains?: string[];
        types?: string[];
        cjmm?: string[];
    };
    config?: {
        maxDistance?: number; // Max levels to drift. Default 2.
        allowDriftWarning?: boolean; // If true, allows session even if high drift
    };
}

export interface SessionResult {
    sessionId: string;
    items: string[]; // Selected Item IDs
    itemsWithDetails?: Partial<MasterQuestionItem>[];
    audit: {
        fallbackOccurred: boolean;
        driftMetrics: DriftMetrics;
    };
}

/**
 * Flexible Difficulty Fallback System
 */
export async function generateFlexibleSession(req: SessionRequest): Promise<SessionResult> {

    // 1. Fetch Candidates (Fetch all for in-memory processing)
    const result = await getBankItems({ limit: 100000 });
    const allItems = result.items;

    // 2. Filter Candidates
    let candidates = allItems.filter(i => {
        const isPublished = (i.metadata?.status || (i as any).status) === 'published';
        if (!isPublished) return false;

        if (req.filters?.domains && req.filters.domains.length > 0) {
            const itemDomain = i.pedagogy.clinicalFocus || (i as any).clinicalFocus || 'General';
            if (!req.filters.domains.some(d => itemDomain.toLowerCase().includes(d.toLowerCase()))) return false;
        }

        if (req.filters?.types && req.filters.types.length > 0) {
            // Support legacy type vs typeId
            const type = i.typeId || (i as any).type;
            if (!req.filters.types.includes(type)) return false;
        }

        return true;
    });

    // 3. Pool Organization
    const pool: Record<number, MasterQuestionItem[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

    candidates.forEach(item => {
        const lvl = Math.round(item.pedagogy.difficultyLevel || 3);
        const saneLvl = Math.max(1, Math.min(5, lvl));
        if (pool[saneLvl]) {
            pool[saneLvl].push(item);
        }
    });

    // Shuffle pools
    Object.keys(pool).forEach(k => shuffle(pool[Number(k)]));

    // 4. Selection Logic (Delegated)
    const configMaxDist = req.config?.maxDistance ?? 2;
    const selection = selectItemsFromPool(pool, req.difficultyDistribution, configMaxDist);

    // 5. Build Result
    const { selectedItems, fallbackEvents, totalDeltaSum } = selection;
    const avgDrift = selectedItems.length > 0 ? (totalDeltaSum / selectedItems.length) : 0;

    const driftMetrics: DriftMetrics = {
        totalRequested: req.totalItems,
        totalSelected: selectedItems.length,
        avgDifficultyDelta: parseFloat(avgDrift.toFixed(3)),
        maxDifficultyDelta: configMaxDist,
        driftWarning: avgDrift > 1.0
    };

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 6. Audit
    const auditLog = {
        id: crypto.randomUUID(),
        sessionId,
        mode: req.mode,
        requestedConfig: req.difficultyDistribution,
        actualConfig: { selectedCount: selectedItems.length, drift: avgDrift },
        fallbackEvents,
        driftMetrics,
        createdAt: new Date().toISOString()
    };

    await logSessionAudit(sessionId, req.mode, driftMetrics, fallbackEvents, auditLog);

    console.log(`[SessionGenerator] Generated ${selectedItems.length}/${req.totalItems} items. Drift: ${avgDrift.toFixed(2)}. Fallbacks: ${fallbackEvents.length}`);
    fallbackEvents.forEach(fe => {
        if (fe.foundExact < fe.needed) {
            console.log(`   > Level ${fe.requestedLevel}: Needed ${fe.needed}, Found ${fe.foundExact}. Substituted from ${JSON.stringify(fe.sources.filter(s => s.level !== fe.requestedLevel))}`);
        }
    });

    return {
        sessionId,
        items: selectedItems.map(i => i.id),
        itemsWithDetails: selectedItems,
        audit: {
            fallbackOccurred: fallbackEvents.some(e => e.foundExact < e.needed),
            driftMetrics
        }
    };
}

/**
 * Pure Logic: Selects items from organized pool based on distribution.
 * Exported for Unit Testing.
 */
export function selectItemsFromPool(
    pool: Record<number, MasterQuestionItem[]>,
    distribution: DifficultyRequest,
    maxDistance: number
) {
    const selectedIds = new Set<string>();
    const selectedItems: MasterQuestionItem[] = [];
    const fallbackEvents: FallbackEvent[] = [];
    let totalDeltaSum = 0;

    // Create a local shallow copy of arrays so we can pop without affecting original pool if reused
    // (though in this context, we consume it)
    const localPool: Record<number, MasterQuestionItem[]> = {};
    for (let i = 1; i <= 5; i++) {
        localPool[i] = [...(pool[i] || [])];
    }

    for (const [lvlStr, needed] of Object.entries(distribution)) {
        const targetLvl = Number(lvlStr);
        let countAndSource: { level: number, count: number }[] = [];
        let remainingNeeded = needed;

        // A. Try Exact
        const exactPool = localPool[targetLvl];
        const exactTake = Math.min(remainingNeeded, exactPool.length);

        for (let i = 0; i < exactTake; i++) {
            const item = exactPool.pop()!;
            selectedIds.add(item.id);
            selectedItems.push(item);
        }

        remainingNeeded -= exactTake;
        if (exactTake > 0) countAndSource.push({ level: targetLvl, count: exactTake });

        // B. Fallback Strategy
        if (remainingNeeded > 0) {
            const searchOrder: number[] = [];

            for (let dist = 1; dist <= maxDistance; dist++) {
                // Priority: Higher first on ties (Target + Dist)
                if (targetLvl + dist <= 5) searchOrder.push(targetLvl + dist);
                // Then Lower (Target - Dist)
                if (targetLvl - dist >= 1) searchOrder.push(targetLvl - dist);
            }

            for (const fallbackLvl of searchOrder) {
                if (remainingNeeded <= 0) break;

                const fallbackPool = localPool[fallbackLvl];
                const take = Math.min(remainingNeeded, fallbackPool.length);

                if (take > 0) {
                    for (let i = 0; i < take; i++) {
                        const item = fallbackPool.pop()!;
                        selectedIds.add(item.id);
                        selectedItems.push(item);

                        totalDeltaSum += Math.abs(fallbackLvl - targetLvl);
                    }
                    remainingNeeded -= take;
                    countAndSource.push({ level: fallbackLvl, count: take });
                }
            }

            const exactCount = countAndSource.find(x => x.level === targetLvl)?.count || 0;
            const filledTotal = needed - remainingNeeded;

            fallbackEvents.push({
                requestedLevel: targetLvl,
                needed: needed,
                foundExact: exactCount,
                filled: filledTotal,
                sources: countAndSource
            });
        }
    }

    return { selectedItems, fallbackEvents, totalDeltaSum };
}
