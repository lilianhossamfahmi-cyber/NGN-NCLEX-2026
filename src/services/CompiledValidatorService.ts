import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';
// import { MasterQuestionItem } from '../types/master-schema'; 

/**
 * CompiledValidatorService.ts
 * 
 * Provides high-performance, schema-based validation using Ajv.
 * Uses the pre-generated JSON Schema (v1.0.0) as the source of truth.
 * 
 * This replaces ad-hoc Zod or custom imperative validation checks
 * with a compiled, production-ready validator.
 */

class CompiledValidatorService {
    private ajv: Ajv;
    private validateItem?: ValidateFunction;
    private schemaVersion: string = '1.0.0';

    constructor() {
        this.ajv = new Ajv({
            allErrors: true, // Surface every violation in one pass
            allowUnionTypes: true,
            verbose: true,
            useDefaults: true,
            removeAdditional: false, // Set to true if we want strict schema enforcement
        });
        addFormats(this.ajv);

        this.init();
    }

    private init() {
        try {
            // Note: During generation we used v1.0.0 but the script path was src/schemas/v1.0.0

            // Note: During generation we used v1.0.0 but the script path was src/schemas/v1.0.0
            // Let's check the actual path generated
            const actualPath = path.resolve(
                process.cwd(),
                'src/schemas/v1.0.0/MasterQuestionItem.schema.json'
            );

            if (fs.existsSync(actualPath)) {
                const schemaData = JSON.parse(fs.readFileSync(actualPath, 'utf8'));
                this.validateItem = this.ajv.compile(schemaData);
                console.log(`[CompiledValidatorService] Schema v${this.schemaVersion} compiled successfully.`);
            } else {
                console.warn(`[CompiledValidatorService] Schema file not found at ${actualPath}. Validation will be disabled until schema is generated.`);
            }
        } catch (error) {
            console.error('[CompiledValidatorService] Initialization failed:', error);
        }
    }

    /**
     * Validates an item against the canonical JSON Schema
     * 
     * @param item - The item to validate
     * @returns { valid: boolean; errors?: string[] }
     */
    public validate(item: any): { valid: boolean; errors?: string[] } {
        if (!this.validateItem) {
            return { valid: true, errors: ['Validator not initialized'] };
        }

        const isValid = this.validateItem(item);

        if (!isValid) {
            const errors = this.validateItem.errors?.map(err => {
                const path = err.instancePath || 'root';
                return `${path}: ${err.message}${err.params ? ' ' + JSON.stringify(err.params) : ''}`;
            });
            return { valid: false, errors };
        }

        return { valid: true };
    }

    /**
     * Returns the current schema version
     */
    public getVersion(): string {
        return this.schemaVersion;
    }
}

// Export singleton instance
export const validatorService = new CompiledValidatorService();
