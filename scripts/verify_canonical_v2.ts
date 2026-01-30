import { supabase } from '../src/lib/supabase';
import { MatrixRowSchema, DropClozeDropdownSchema } from '../src/schemas/standard';
import fs from 'fs';
import path from 'path';

async function verify() {
    console.log('🧐 Starting Post-Migration Verification...');

    let totalChecked = 0;
    let errors: string[] = [];

    // 1. Check Local Files
    const localDirs = ['./src/dataStore', './src/data'];
    for (const dir of localDirs) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
            checkItem(data, `Local:${file}`, errors);
            totalChecked++;
        }
    }

    // 2. Check DB Items
    console.log('📡 Fetching all items from DB for verification...');
    let hasMore = true;
    let offset = 0;
    const dbLimit = 1000;

    while (hasMore) {
        const { data: rows, error } = await supabase
            .from('item_bank')
            .select('id, item_json')
            .range(offset, offset + dbLimit - 1);

        if (error) throw error;
        if (!rows || rows.length === 0) {
            hasMore = false;
            break;
        }

        console.log(`Verifying DB items ${offset} to ${offset + rows.length}...`);
        for (const row of rows) {
            const item = typeof row.item_json === 'string' ? JSON.parse(row.item_json) : row.item_json;
            checkItem(item, `DB:${row.id}`, errors);
            totalChecked++;
        }

        offset += dbLimit;
        if (rows.length < dbLimit) hasMore = false;
    }

    console.log(`\n--- Verification Summary ---`);
    console.log(`Total items checked: ${totalChecked}`);
    if (errors.length === 0) {
        console.log('✅ ALL checked items are CANONICAL.');
    } else {
        console.log(`❌ Found ${errors.length} canonical violations:`);
        errors.slice(0, 20).forEach(e => console.log(`  - ${e}`));
        if (errors.length > 20) console.log(`  ... and ${errors.length - 20} more.`);
    }
}

function checkItem(item: any, source: string, errors: string[]) {
    const struct = item.content?.structure || {};
    const screens = struct.screens || [];

    const checkScreen = (s: any, path: string) => {
        if (!s) return;

        // Matrix Check
        if (s.type === 'matrix' || s.type === 'matrix-mr' || s.type === 'matrix-standard') {
            if (!Array.isArray(s.rows) || s.rows.length === 0) {
                errors.push(`${path}: Matrix missing rows`);
            } else {
                s.rows.forEach((r: any, i: number) => {
                    if (!r.correctColumnIds || !Array.isArray(r.correctColumnIds) || r.correctColumnIds.length === 0) {
                        errors.push(`${path}: Matrix row ${i} missing canonical correctColumnIds`);
                    }
                });
            }
        }

        // Drop-Cloze Check
        if (s.type === 'drop-cloze' || s.type === 'dropdown' || s.type === 'cloze-dropdown') {
            if (!Array.isArray(s.dropdowns) || s.dropdowns.length === 0) {
                // Might be missing dropdowns but verify options if they exist
            } else {
                s.dropdowns.forEach((d: any, i: number) => {
                    const result = DropClozeDropdownSchema.safeParse(d);
                    if (!result.success) {
                        errors.push(`${path}: Dropdown ${i} invalid schema: ${result.error.message}`);
                    } else {
                        const hasCorrect = d.options.some((o: any) => o.isCorrect);
                        if (!hasCorrect) errors.push(`${path}: Dropdown ${i} missing correct option`);
                    }
                });
            }
        }

        // Sanitization Check (Simple heuristic)
        const checkText = (text: any, field: string) => {
            if (typeof text === 'string' && text.length > 0) {
                if (text.startsWith(' ') || text.includes('  ')) {
                    errors.push(`${path}: Sanitization failed on ${field} ("${text.substring(0, 20)}...")`);
                }
            }
        };

        checkText(s.prompt, 'prompt');
        if (Array.isArray(s.options)) s.options.forEach((o: any) => checkText(o.text, 'option.text'));
    };

    if (screens.length > 0) {
        screens.forEach((s: any, i: number) => checkScreen(s, `${source}:Screen[${i}]`));
    } else {
        checkScreen(struct, `${source}:Root`);
    }
}

verify().catch(console.error);
