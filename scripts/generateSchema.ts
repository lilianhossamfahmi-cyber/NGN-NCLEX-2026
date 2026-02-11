import { zodToJsonSchema } from 'zod-to-json-schema';
import { MasterQuestionItemSchema } from '../src/schemas/MasterQuestionItemSchema';
import fs from 'fs';
import path from 'path';

/**
 * scripts/generateSchema.ts
 * 
 * Exports the MasterQuestionItem Zod schema to a versioned JSON Schema file.
 * This file is used by Ajv for high-performance validation and by CI/CD
 * for schema-diff gates.
 */

const schemaDir = path.resolve(process.cwd(), 'src/schemas/v1.0.0');
const schemaFile = path.resolve(schemaDir, 'MasterQuestionItem.schema.json');

try {
    // Ensure directory exists
    if (!fs.existsSync(schemaDir)) {
        fs.mkdirSync(schemaDir, { recursive: true });
    }

    // Generate JSON Schema
    const jsonSchema = zodToJsonSchema(MasterQuestionItemSchema as any, {
        name: 'MasterQuestionItem',
        target: 'jsonSchema7'
    });

    // Write to file
    fs.writeFileSync(schemaFile, JSON.stringify(jsonSchema, null, 2));

    console.log(`✅ Versioned JSON Schema generated at: ${schemaFile}`);
} catch (error) {
    console.error('❌ Failed to generate schema:');
    if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
    } else {
        console.error(error);
    }
    process.exit(1);
}
