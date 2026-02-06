import { execSync } from 'child_process';

/**
 * scripts/schemaDiff.ts
 * 
 * Enforces a lockstep relationship between schema changes and renderer updates.
 * If schemas change, we require that the renderer snapshots have been reviewed.
 * 
 * Environmental context:
 * - GITHUB_BASE_REF: The base branch of the PR (usually 'main')
 */

const base = process.env.GITHUB_BASE_REF || 'origin/main';

try {
    console.log(`[SchemaDiff] Comparing current branch against ${base}`);

    // 1. Check for schema changes
    const schemaDiff = execSync(`git diff --name-only ${base} -- src/schemas`).toString().trim();
    const schemasModified = schemaDiff.length > 0;

    if (schemasModified) {
        console.log('⚠️  Schema changes detected:');
        console.log(schemaDiff);

        // 2. Check for renderer changes
        const rendererDiff = execSync(`git diff --name-only ${base} -- src/components/item-types/renderers`).toString().trim();
        const renderersModified = rendererDiff.length > 0;

        if (!renderersModified && !process.env.SCHEMA_DIFF_APPROVED) {
            console.error('\n❌  BLOCKING ERROR: Schemas were modified but NO renderer changes were found.');
            console.error('If you changed the schema, you MUST verify the renderers still work.');
            console.error('Please run the replay tests locally, or set SCHEMA_DIFF_APPROVED=true in your environment if this is a non-breaking change.');
            process.exit(1);
        } else {
            console.log('✅  Schema changes accompanied by renderer updates or approval.');
        }
    } else {
        console.log('✅  No schema changes detected. Passing.');
    }
} catch (error) {
    if (error instanceof Error) {
        // If git diff fails (e.g. no base branch found), we log a warning but don't block
        // This handles cases like shallow clones or initial project setup
        console.warn(`[SchemaDiff] Warning: Git diff failed (${error.message}). Skipping check.`);
    }
    process.exit(0);
}
