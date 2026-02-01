/**
 * Case Study Validation Script
 * Validates a case study JSON for completeness and adherence to anti-generic rationale rules.
 * 
 * Usage: npx ts-node scripts/validate_case_study.ts <path-to-json>
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
    screen: string;
    type: string;
    issues: string[];
    warnings: string[];
}

interface Gap {
    location: string;
    issue: string;
    severity: 'ERROR' | 'WARNING';
}

const GENERIC_PHRASES = [
    'correct finding',
    'appropriate choice',
    'this is correct',
    'this is incorrect',
    'good answer',
    'wrong answer',
    'correct answer',
    'incorrect answer',
    'option is correct',
    'option is incorrect',
    'correct option',
    'incorrect option'
];

function validateHighlightScreen(screen: any): Gap[] {
    const gaps: Gap[] = [];
    const screenId = screen.id || 'unknown';

    // Check for rationales map
    if (!screen.rationales) {
        gaps.push({
            location: `Screen ${screenId} (Highlight)`,
            issue: 'Missing "rationales" (plural) map - pipeline cannot read per-highlight feedback',
            severity: 'ERROR'
        });
    } else {
        // Extract all span IDs from text
        const spanMatches = screen.text?.match(/id=\\"([^"]+)\\"|id="([^"]+)"/g) || [];
        const spanIds = spanMatches.map((m: string) => {
            const match = m.match(/id=\\"?([^"\\]+)/);
            return match ? match[1].toLowerCase() : null;
        }).filter(Boolean);

        // Check each span has a rationale
        for (const spanId of spanIds) {
            const rat = screen.rationales[spanId] || screen.rationales[spanId.toUpperCase()];
            if (!rat) {
                gaps.push({
                    location: `Screen ${screenId} > Highlight ${spanId}`,
                    issue: `Missing rationale for span "${spanId}"`,
                    severity: 'ERROR'
                });
            } else {
                // Check for structured format
                const hasHook = (rat.whyCorrect?.includes('[Hook]') || rat.whyIncorrect?.includes('[Hook]'));
                if (!hasHook) {
                    gaps.push({
                        location: `Screen ${screenId} > Highlight ${spanId}`,
                        issue: 'Missing structured format [Hook]...[Breakdown]...[Trap] in rationale',
                        severity: 'WARNING'
                    });
                }

                // Check for generic phrases
                const allText = JSON.stringify(rat).toLowerCase();
                for (const phrase of GENERIC_PHRASES) {
                    if (allText.includes(phrase)) {
                        gaps.push({
                            location: `Screen ${screenId} > Highlight ${spanId}`,
                            issue: `Contains generic phrase: "${phrase}"`,
                            severity: 'ERROR'
                        });
                    }
                }
            }
        }
    }

    return gaps;
}

function validateMatrixScreen(screen: any): Gap[] {
    const gaps: Gap[] = [];
    const screenId = screen.id || 'unknown';

    if (!screen.rows || !Array.isArray(screen.rows)) {
        gaps.push({
            location: `Screen ${screenId} (Matrix)`,
            issue: 'Missing or invalid "rows" array',
            severity: 'ERROR'
        });
        return gaps;
    }

    for (const row of screen.rows) {
        if (!row.rationale) {
            gaps.push({
                location: `Screen ${screenId} > Row ${row.id}`,
                issue: 'Missing rationale field on matrix row',
                severity: 'ERROR'
            });
        } else {
            const ratLower = row.rationale.toLowerCase();
            for (const phrase of GENERIC_PHRASES) {
                if (ratLower.includes(phrase)) {
                    gaps.push({
                        location: `Screen ${screenId} > Row ${row.id}`,
                        issue: `Contains generic phrase: "${phrase}"`,
                        severity: 'ERROR'
                    });
                }
            }
        }

        if (!row.correctColumnIds && !row.correctColumnId) {
            gaps.push({
                location: `Screen ${screenId} > Row ${row.id}`,
                issue: 'Missing correctColumnIds/correctColumnId',
                severity: 'ERROR'
            });
        }
    }

    return gaps;
}

function validateMCQScreen(screen: any): Gap[] {
    const gaps: Gap[] = [];
    const screenId = screen.id || 'unknown';

    if (!screen.options || !Array.isArray(screen.options)) {
        gaps.push({
            location: `Screen ${screenId} (MCQ/MR)`,
            issue: 'Missing or invalid "options" array',
            severity: 'ERROR'
        });
        return gaps;
    }

    for (const opt of screen.options) {
        if (!opt.rationale) {
            gaps.push({
                location: `Screen ${screenId} > Option ${opt.id}`,
                issue: 'Missing rationale field on option',
                severity: 'ERROR'
            });
        } else {
            const ratLower = opt.rationale.toLowerCase();
            for (const phrase of GENERIC_PHRASES) {
                if (ratLower.includes(phrase)) {
                    gaps.push({
                        location: `Screen ${screenId} > Option ${opt.id}`,
                        issue: `Contains generic phrase: "${phrase}"`,
                        severity: 'ERROR'
                    });
                }
            }
        }
    }

    return gaps;
}

function validateDropClozeScreen(screen: any): Gap[] {
    const gaps: Gap[] = [];
    const screenId = screen.id || 'unknown';

    // Handle both formats: top-level dropdowns OR sentences with nested dropdowns
    let allDropdowns: any[] = [];

    if (screen.dropdowns && Array.isArray(screen.dropdowns)) {
        allDropdowns = screen.dropdowns;
    } else if (screen.sentences && Array.isArray(screen.sentences)) {
        // Extract dropdowns from sentences
        for (const sentence of screen.sentences) {
            if (sentence.dropdowns && Array.isArray(sentence.dropdowns)) {
                allDropdowns.push(...sentence.dropdowns);
            }
        }
    }

    if (allDropdowns.length === 0) {
        gaps.push({
            location: `Screen ${screenId} (Drop-Cloze)`,
            issue: 'Missing or invalid "dropdowns" or "sentences" array',
            severity: 'ERROR'
        });
        return gaps;
    }

    for (const dropdown of allDropdowns) {
        if (!dropdown.options || !Array.isArray(dropdown.options)) {
            gaps.push({
                location: `Screen ${screenId} > Dropdown ${dropdown.id}`,
                issue: 'Missing or invalid "options" array in dropdown',
                severity: 'ERROR'
            });
            continue;
        }

        for (const opt of dropdown.options) {
            if (typeof opt === 'string') {
                gaps.push({
                    location: `Screen ${screenId} > Dropdown ${dropdown.id}`,
                    issue: 'Options are strings instead of objects - missing rationale',
                    severity: 'ERROR'
                });
                break;
            }

            if (!opt.rationale) {
                gaps.push({
                    location: `Screen ${screenId} > Dropdown ${dropdown.id} > Option ${opt.id}`,
                    issue: 'Missing rationale field on dropdown option',
                    severity: 'ERROR'
                });
            } else {
                const ratLower = opt.rationale.toLowerCase();
                for (const phrase of GENERIC_PHRASES) {
                    if (ratLower.includes(phrase)) {
                        gaps.push({
                            location: `Screen ${screenId} > Dropdown ${dropdown.id} > Option ${opt.id}`,
                            issue: `Contains generic phrase: "${phrase}"`,
                            severity: 'ERROR'
                        });
                    }
                }
            }
        }
    }

    return gaps;
}

function validateBowTieScreen(screen: any): Gap[] {
    const gaps: Gap[] = [];
    const screenId = screen.id || 'unknown';

    const pools = ['conditions', 'actions', 'parameters'];

    for (const poolName of pools) {
        // Handle both formats: top-level arrays OR nested in options object
        let pool = screen[poolName];
        if (!pool && screen.options && screen.options[poolName]) {
            pool = screen.options[poolName];
        }

        if (!pool || !Array.isArray(pool)) {
            gaps.push({
                location: `Screen ${screenId} (Bow-Tie)`,
                issue: `Missing or invalid "${poolName}" array`,
                severity: 'ERROR'
            });
            continue;
        }

        for (let i = 0; i < pool.length; i++) {
            const item = pool[i];
            if (typeof item === 'string') {
                gaps.push({
                    location: `Screen ${screenId} > ${poolName}[${i}]`,
                    issue: `Pool item is a string instead of object - missing rationale`,
                    severity: 'ERROR'
                });
            } else {
                if (!item.rationale) {
                    gaps.push({
                        location: `Screen ${screenId} > ${poolName} > ${item.id || i}`,
                        issue: 'Missing rationale field on bow-tie item',
                        severity: 'ERROR'
                    });
                } else {
                    const ratLower = item.rationale.toLowerCase();
                    for (const phrase of GENERIC_PHRASES) {
                        if (ratLower.includes(phrase)) {
                            gaps.push({
                                location: `Screen ${screenId} > ${poolName} > ${item.id || i}`,
                                issue: `Contains generic phrase: "${phrase}"`,
                                severity: 'ERROR'
                            });
                        }
                    }
                }
            }
        }
    }

    return gaps;
}

function validateCaseStudy(filePath: string): void {
    console.log(`\n🔍 Validating: ${filePath}\n`);
    console.log('='.repeat(80));

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    let data: any;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e: any) {
        console.error(`❌ Invalid JSON: ${e.message}`);
        process.exit(1);
    }

    const screens = data.content?.structure?.screens || [];
    if (screens.length === 0) {
        console.error('❌ No screens found in case study');
        process.exit(1);
    }

    console.log(`📋 Found ${screens.length} screens\n`);

    const allGaps: Gap[] = [];

    for (const screen of screens) {
        const type = screen.type?.toLowerCase() || 'unknown';
        let gaps: Gap[] = [];

        switch (type) {
            case 'highlight':
                gaps = validateHighlightScreen(screen);
                break;
            case 'matrix':
                gaps = validateMatrixScreen(screen);
                break;
            case 'multiple-choice':
            case 'single-response':
            case 'multiple-response':
            case 'multiple-response-sata':
                gaps = validateMCQScreen(screen);
                break;
            case 'drop-cloze':
            case 'dropdown':
            case 'cloze-dropdown':
                gaps = validateDropClozeScreen(screen);
                break;
            case 'bow-tie':
                gaps = validateBowTieScreen(screen);
                break;
            default:
                console.log(`⚠️  Unknown screen type: ${type} (${screen.id})`);
        }

        allGaps.push(...gaps);
    }

    // Report
    const errors = allGaps.filter(g => g.severity === 'ERROR');
    const warnings = allGaps.filter(g => g.severity === 'WARNING');

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ No gaps found! Case study passes all validation checks.\n');
    } else {
        if (errors.length > 0) {
            console.log(`\n❌ ERRORS (${errors.length}):`);
            console.log('-'.repeat(40));
            for (const e of errors) {
                console.log(`  [${e.location}]`);
                console.log(`     → ${e.issue}\n`);
            }
        }

        if (warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
            console.log('-'.repeat(40));
            for (const w of warnings) {
                console.log(`  [${w.location}]`);
                console.log(`     → ${w.issue}\n`);
            }
        }
    }

    console.log('='.repeat(80));
    console.log(`\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings\n`);

    if (errors.length > 0) {
        process.exit(1);
    }
}

// Main
const args = process.argv.slice(2);
const filePath = args[0] || path.join(__dirname, '../src/dataStore/case-acute-hf-cardiogenic-shock.json');
validateCaseStudy(filePath);
