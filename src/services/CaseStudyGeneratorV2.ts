/**
 * Case Study Generator V2
 * 
 * Simple, direct case study generation service using Golden Prompt V2.
 * Minimal dependencies - bypasses complex pipelines.
 * Works in both Node.js and browser environments.
 * 
 * Usage:
 *   const generator = new CaseStudyGeneratorV2();
 *   const prompt = await generator.preparePrompt('Septic Shock');
 *   // Send prompt to AI, get JSON response
 *   const caseStudy = generator.parseResponse(aiResponse);
 *   const validation = generator.validate(caseStudy);
 */

// Types
export interface GeneratedCaseStudy {
    id: string;
    typeId: string;
    difficulty: number;
    content: {
        clinicalData: any;
        structure: {
            type: string;
            screens: Screen[];
        };
    };
    rationale: any;
}

export interface Screen {
    id: string;
    type: string;
    cjmmStep: string;
    cjmmPhase: string;
    prompt: string;
    [key: string]: any;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// Banned phrases for rationale validation
const BANNED_PHRASES = [
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

export class CaseStudyGeneratorV2 {
    private promptPath: string;

    constructor() {
        // Path relative to public/src for browser, or file path for Node
        this.promptPath = '/src/prompts/case-study-golden-v2.md';
    }

    /**
     * Load the golden prompt template
     * Works in both browser (fetch) and Node.js (fs) environments
     */
    async loadPrompt(): Promise<string> {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
            // Browser: use fetch
            const response = await fetch(this.promptPath);
            if (!response.ok) {
                throw new Error(`Failed to load prompt: ${response.statusText}`);
            }
            return response.text();
        } else {
            // Node.js: use dynamic import for fs
            const fs = await import('fs');
            const path = await import('path');
            const { fileURLToPath } = await import('url');

            // Get current file's directory
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const fullPath = path.join(__dirname, '../prompts/case-study-golden-v2.md');

            if (!fs.existsSync(fullPath)) {
                throw new Error(`Golden Prompt V2 not found at: ${fullPath}`);
            }
            return fs.readFileSync(fullPath, 'utf-8');
        }
    }

    /**
     * Generate a case study for the given topic
     * This method prepares the prompt - actual AI call happens externally
     */
    async preparePrompt(topic: string): Promise<string> {
        const template = await this.loadPrompt();
        return template.replace(/\{TOPIC\}/g, topic);
    }

    /**
     * Parse and validate the AI response
     */
    parseResponse(jsonString: string): GeneratedCaseStudy {
        // Clean up common AI output issues
        let cleaned = jsonString.trim();

        // Remove markdown code blocks if present
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Parse JSON
        let caseStudy: GeneratedCaseStudy;
        try {
            caseStudy = JSON.parse(cleaned);
        } catch (e: any) {
            throw new Error(`Invalid JSON response: ${e.message}`);
        }

        return caseStudy;
    }

    /**
     * Validate the generated case study structure
     */
    validate(caseStudy: GeneratedCaseStudy): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check basic structure
        if (!caseStudy.id) errors.push('Missing case study ID');
        if (!caseStudy.typeId) errors.push('Missing typeId');
        if (!caseStudy.content?.structure?.screens) {
            errors.push('Missing screens array');
            return { valid: false, errors, warnings };
        }

        const screens = caseStudy.content.structure.screens;

        // Check screen count
        if (screens.length !== 6) {
            errors.push(`Expected 6 screens, found ${screens.length}`);
        }

        // Validate each screen
        for (const screen of screens) {
            const screenId = screen.id || 'unknown';
            const type = screen.type?.toLowerCase() || 'unknown';

            switch (type) {
                case 'highlight':
                    this.validateHighlightScreen(screen, errors, warnings);
                    break;
                case 'matrix':
                    this.validateMatrixScreen(screen, errors, warnings);
                    break;
                case 'multiple-choice':
                    this.validateMCQScreen(screen, errors, warnings);
                    break;
                case 'bow-tie':
                    this.validateBowTieScreen(screen, errors, warnings);
                    break;
                case 'drop-cloze':
                    this.validateDropClozeScreen(screen, errors, warnings);
                    break;
                case 'multiple-response':
                    this.validateMRScreen(screen, errors, warnings);
                    break;
                default:
                    warnings.push(`Unknown screen type: ${type} (${screenId})`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    private validateHighlightScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;

        if (!screen.rationales) {
            errors.push(`[${sid}] Missing 'rationales' map (must use plural key)`);
        } else if (screen.highlightReview) {
            errors.push(`[${sid}] Using 'highlightReview' instead of 'rationales' (plural)`);
        }

        if (!screen.text) {
            errors.push(`[${sid}] Missing highlight text`);
        }

        if (!screen.correct || !Array.isArray(screen.correct)) {
            errors.push(`[${sid}] Missing or invalid 'correct' array`);
        }
    }

    private validateMatrixScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;

        if (!screen.rows || !Array.isArray(screen.rows)) {
            errors.push(`[${sid}] Missing or invalid 'rows' array`);
            return;
        }

        for (const row of screen.rows) {
            if (!row.rationale) {
                errors.push(`[${sid}] Row ${row.id} missing rationale`);
            } else {
                this.checkRationaleQuality(row.rationale, `${sid} Row ${row.id}`, errors, warnings);
            }

            if (!row.correctColumnIds && !row.correctColumnId) {
                errors.push(`[${sid}] Row ${row.id} missing correctColumnIds`);
            }
        }
    }

    private validateMCQScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;

        if (!screen.options || !Array.isArray(screen.options)) {
            errors.push(`[${sid}] Missing or invalid 'options' array`);
            return;
        }

        let correctCount = 0;
        for (const opt of screen.options) {
            if (opt.isCorrect) correctCount++;

            if (!opt.rationale) {
                errors.push(`[${sid}] Option ${opt.id} missing rationale`);
            } else {
                this.checkRationaleQuality(opt.rationale, `${sid} Option ${opt.id}`, errors, warnings);
            }
        }

        if (correctCount !== 1) {
            errors.push(`[${sid}] MCQ must have exactly 1 correct option, found ${correctCount}`);
        }
    }

    private validateBowTieScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;
        const pools = ['conditions', 'actions', 'parameters'];

        for (const poolName of pools) {
            let pool = screen[poolName];
            if (!pool && screen.options?.[poolName]) {
                pool = screen.options[poolName];
            }

            if (!pool || !Array.isArray(pool)) {
                errors.push(`[${sid}] Missing or invalid '${poolName}' array`);
                continue;
            }

            for (const item of pool) {
                if (typeof item === 'string') {
                    errors.push(`[${sid}] ${poolName} contains string instead of object - missing rationale`);
                    break;
                }

                if (!item.rationale) {
                    errors.push(`[${sid}] ${poolName} item ${item.id} missing rationale`);
                } else {
                    this.checkRationaleQuality(item.rationale, `${sid} ${poolName} ${item.id}`, errors, warnings);
                }
            }
        }
    }

    private validateDropClozeScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;

        // Handle both formats
        let allDropdowns: any[] = [];
        if (screen.dropdowns && Array.isArray(screen.dropdowns)) {
            allDropdowns = screen.dropdowns;
        } else if (screen.sentences && Array.isArray(screen.sentences)) {
            for (const sentence of screen.sentences) {
                if (sentence.dropdowns && Array.isArray(sentence.dropdowns)) {
                    allDropdowns.push(...sentence.dropdowns);
                }
            }
        }

        if (allDropdowns.length === 0) {
            errors.push(`[${sid}] Missing dropdowns array`);
            return;
        }

        for (const dropdown of allDropdowns) {
            if (!dropdown.options || !Array.isArray(dropdown.options)) {
                errors.push(`[${sid}] Dropdown ${dropdown.id} missing options`);
                continue;
            }

            let correctCount = 0;
            for (const opt of dropdown.options) {
                if (opt.isCorrect) correctCount++;

                if (!opt.rationale) {
                    errors.push(`[${sid}] Dropdown ${dropdown.id} Option ${opt.id} missing rationale`);
                } else {
                    this.checkRationaleQuality(opt.rationale, `${sid} Dropdown ${dropdown.id} Option ${opt.id}`, errors, warnings);
                }
            }

            if (correctCount !== 1) {
                errors.push(`[${sid}] Dropdown ${dropdown.id} must have exactly 1 correct, found ${correctCount}`);
            }
        }
    }

    private validateMRScreen(screen: Screen, errors: string[], warnings: string[]): void {
        const sid = screen.id;

        if (!screen.options || !Array.isArray(screen.options)) {
            errors.push(`[${sid}] Missing or invalid 'options' array`);
            return;
        }

        let correctCount = 0;
        for (const opt of screen.options) {
            if (opt.isCorrect) correctCount++;

            if (!opt.rationale) {
                errors.push(`[${sid}] Option ${opt.id} missing rationale`);
            } else {
                this.checkRationaleQuality(opt.rationale, `${sid} Option ${opt.id}`, errors, warnings);
            }
        }

        if (correctCount < 2) {
            warnings.push(`[${sid}] Multiple-response typically has 2+ correct, found ${correctCount}`);
        }
    }

    private checkRationaleQuality(rationale: string, location: string, errors: string[], warnings: string[]): void {
        // Check for empty
        if (!rationale || rationale.trim() === '') {
            errors.push(`[${location}] Empty rationale`);
            return;
        }

        // Check minimum length (15 words)
        const wordCount = rationale.split(/\s+/).length;
        if (wordCount < 15) {
            warnings.push(`[${location}] Rationale too short (${wordCount} words, min 15)`);
        }

        // Check for banned phrases
        const lower = rationale.toLowerCase();
        for (const phrase of BANNED_PHRASES) {
            if (lower.includes(phrase)) {
                errors.push(`[${location}] Contains banned phrase: "${phrase}"`);
            }
        }
    }

    /**
     * Save the case study to the data store (Node.js only)
     * In browser, use the item bank service instead
     */
    async saveToDataStore(caseStudy: GeneratedCaseStudy, filename?: string): Promise<string> {
        // This method only works in Node.js
        if (typeof window !== 'undefined') {
            throw new Error('saveToDataStore is not available in browser. Use item bank service instead.');
        }

        // Dynamic imports for Node.js
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const dataStorePath = path.join(__dirname, '../dataStore');

        // Generate filename if not provided
        if (!filename) {
            const timestamp = Date.now();
            const condition = caseStudy.id?.split('-')[1] || 'case';
            filename = `generated_${condition}_${timestamp}.json`;
        }

        const filePath = path.join(dataStorePath, filename);

        // Ensure directory exists
        if (!fs.existsSync(dataStorePath)) {
            fs.mkdirSync(dataStorePath, { recursive: true });
        }

        // Add processing flags
        const enrichedCase = {
            ...caseStudy,
            _generatedAt: new Date().toISOString(),
            _generatorVersion: 'GoldenPromptV2',
            _validated: true
        };

        // Write file
        fs.writeFileSync(filePath, JSON.stringify(enrichedCase, null, 2), 'utf-8');

        console.log(`✅ Case study saved to: ${filePath}`);
        return filePath;
    }

    /**
     * Full generation pipeline: prepare → parse → validate → save
     */
    async processAIResponse(topic: string, aiResponse: string): Promise<{
        caseStudy: GeneratedCaseStudy;
        validation: ValidationResult;
        savedPath?: string;
    }> {
        // Parse the response
        const caseStudy = this.parseResponse(aiResponse);

        // Validate
        const validation = this.validate(caseStudy);

        // Log results
        if (validation.valid) {
            console.log('✅ Validation passed!');
        } else {
            console.log(`❌ Validation failed with ${validation.errors.length} errors:`);
            validation.errors.forEach(e => console.log(`   - ${e}`));
        }

        if (validation.warnings.length > 0) {
            console.log(`⚠️  ${validation.warnings.length} warnings:`);
            validation.warnings.forEach(w => console.log(`   - ${w}`));
        }

        // Save if valid (only works in Node.js)
        let savedPath: string | undefined;
        if (validation.valid && typeof window === 'undefined') {
            savedPath = await this.saveToDataStore(caseStudy);
        }

        return { caseStudy, validation, savedPath };
    }
}

// Export singleton for easy use
export const caseStudyGeneratorV2 = new CaseStudyGeneratorV2();
