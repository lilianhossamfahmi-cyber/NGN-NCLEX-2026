import { trackEvent } from './analyticsService';
import { getGenAI } from '../config/apiConfig';
import { MasterQuestionItem } from '../types/master-schema';
import { classifyMutation, type SanitizeResult } from '../utils/mutationClassifier';
import { logRepairEvent } from './repairAuditService';

/**
 * ULTRA FIXER SERVICE
 * High-Authority AI engine for NGN Item Remediation.
 */
export const ultraFixerService = {

    /**
     * Executes an AI fix with full system authority.
     */
    async execute(
        item: MasterQuestionItem,
        instruction: string,
        mode: 'surgical' | 'structural'
    ): Promise<SanitizeResult> {

        // 1. Identify Golden Prompt to inject
        const itemType = item.typeId || (item as any).type || 'multiple-choice';
        const goldenPrompt = await this.getGoldenKnowledge(itemType);

        // 2. Build the Global Rules from Memory
        const globalRules = `
            GLOBAL RULES (MANDATORY):
            - Never use generic placeholder names like [Patient Name]. Use realistic initials (e.g., L.S.).
            - Vitals MUST always include a trend (at least 2 timepoints) for Level 4-5 items.
            - Ensure cjmm_step and client_needs are explicitly populated in the root metadata.
            - Rationales must be deep, clinical, and pathophysiology-focused. 
        `;

        // 3. Assemble the Master Prompt
        const prompt = `
            ROLE: High-Authority NGN Editorial Engine
            CONTEXT: You are fixing/rebuilding an NGN item for a production exam.
            
            AUTHORITY MODE: ${mode.toUpperCase()}
            ${mode === 'surgical'
                ? "PRESERVE as much of the existing structure as possible. Only fix the specific flaws requested."
                : "REBUILD following the Golden Standards strictly. Use the original item ONLY as a clinical source."
            }

            ${goldenPrompt}

            ${globalRules}

            USER INSTRUCTION:
            "${instruction}"

            CURRENT ITEM JSON Data (SOURCE):
            ${JSON.stringify(item, null, 2)}

            OUTPUT: Return ONLY the corrected RAW JSON. No chat.
        `;

        try {
            const genAI = getGenAI();
            if (!genAI) throw new Error("Generative AI not initialized. Check your API Key.");

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            const aiResult = await model.generateContent(prompt);
            const response = await aiResult.response;
            const text = response.text();

            // Extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("AI failed to return valid JSON.");

            let fixedItem = JSON.parse(jsonMatch[0]);

            // 4. ATOMIC SANITIZATION (The Vice-Versa Logic)
            const sanitizeResult = this.sanitizeOutput(item, fixedItem);
            await logRepairEvent(item, sanitizeResult, 'ultraFixer');

            trackEvent('REPAIR_EXECUTED', {
                item_id: item.id,
                mutation_class: sanitizeResult.mutationClass,
                action: sanitizeResult.action,
                changed_paths_count: sanitizeResult.changedPaths?.length || 0
            });

            return sanitizeResult;

        } catch (err) {
            console.error("UltraFixer Service Error:", err);
            throw err;
        }
    },

    /**
     * Executes a targeted AI fix on a specific text selection.
     */
    async executePartial(
        item: MasterQuestionItem,
        selection: string,
        instruction: string
    ): Promise<SanitizeResult> {
        const prompt = `
            ROLE: Surgical NGN Editor
            CONTEXT: You are modifying ONLY A SPECIFIC CLIP from an NGN item.
            
            FULL ITEM FOR CONTEXT:
            ${JSON.stringify(item, null, 2)}

            SELECTED TEXT:
            "${selection}"

            INSTRUCTION FOR THIS SELECTION:
            "${instruction}"

            GOAL: Return the FULL UPDATED ITEM JSON with your localized changes applied. 
            Ensure the clinical consistency remains perfect. Output ONLY RAW JSON.
        `;

        try {
            const genAI = getGenAI();
            if (!genAI) throw new Error("Generative AI not initialized.");
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("AI failed to return valid JSON.");

            const sanitizeResult = this.sanitizeOutput(item, JSON.parse(jsonMatch[0]));
            await logRepairEvent(item, sanitizeResult, 'ultraFixer-partial');
            return sanitizeResult;
        } catch (err) {
            console.error("Partial Execute Error:", err);
            throw err;
        }
    },

    /**
     * Atomic Sanitizer: Ensures the AI output never breaks the DB.
     */
    sanitizeOutput(
        original: MasterQuestionItem,
        repaired: MasterQuestionItem
    ): SanitizeResult {
        // Construct the full object by merging original and AI output
        // This ensures all required fields (authorId, createdAt, etc.) are preserved
        // but overridden by AI if provided.
        const patched: MasterQuestionItem = {
            ...original,
            ...repaired,
            metadata: {
                ...original.metadata,
                ...(repaired.metadata || {})
            }
        };

        const { mutationClass, changedPaths } = classifyMutation(original, patched);

        // GUARD: Published items with structural changes get forked
        if (original.metadata?.status === 'published' && mutationClass === 'STRUCTURAL') {
            console.warn('[PUBLISH_GUARD] Structural mutation on published item. Forking new UUID.', {
                originalId: original.id,
                changedPaths,
            });
            return {
                action: 'FORK_NEW_ITEM',
                mutationClass,
                changedPaths,
                newItem: {
                    ...patched,
                    id: crypto.randomUUID(),
                    metadata: {
                        ...patched.metadata,
                        status: 'draft',
                        contentVersion: 1,
                        supersedesId: original.id,
                        repairNotes: (original.metadata?.repairNotes || []).concat(
                            `Forked from published item due to structural changes: ${changedPaths.join(', ')}`
                        )
                    } as any,
                },
                retireOriginalId: original.id,
            };
        }

        // Cosmetic repair on published item: bump version
        if (original.metadata?.status === 'published' && mutationClass === 'COSMETIC') {
            patched.metadata = {
                ...patched.metadata,
                contentVersion: (original.metadata.contentVersion || 1) + 1,
            };
        }

        // Preserve original ID for non-forked updates
        patched.id = original.id;

        // Preserve status if missing
        if (!patched.metadata.status) {
            patched.metadata.status = (original.metadata.status || 'draft').toLowerCase() as any;
        }

        // Ensure NOT NULL columns have defaults
        patched.clinical_focus = (patched.metadata.topic || patched.pedagogy?.clinicalFocus || original.clinical_focus || 'General');
        patched.client_needs = (patched.metadata.clientNeeds || original.client_needs || 'Physiological Integrity');
        patched.cjmm_step = (patched.metadata.cjmmStep || original.cjmm_step || 'Analyze Cues');

        return { action: 'UPDATE_IN_PLACE', newItem: patched, mutationClass, changedPaths };
    },

    /**
     * Fetches the appropriate Golden Prompt from the knowledge base.
     */
    async getGoldenKnowledge(type: string): Promise<string> {
        const typeMap: any = {
            'bow-tie': 'Golden-NGN-BowTie-Item.md',
            'calculation': 'Golden-NGN-Calculation-Item.md',
            'case-study': 'Golden-NGN-Case-Study-6Q.md',
            'highlight': 'Golden-NGN-Highlight-Item.md',
            'matrix': 'Golden-NGN-Matrix-Item.md',
            'multiple-response': 'Golden-NGN-MultipleResponse-Item.md'
        };

        const fileName = typeMap[type] || 'Golden-NGN-SingleResponse-Item.md';
        return `KNOWLEDGE SOURCE: ${fileName}`;
    }
};
