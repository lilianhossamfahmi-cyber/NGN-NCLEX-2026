import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthorizedApiKey } from '../config/apiConfig';
import { ItemIngestionService } from './ingestion/ItemIngestionService';
import { trackEvent } from './analyticsService';

/**
 * CaseStudyGeneratorV2.ts
 * 
 * Implements the Golden Prompt V2 strategy for high-fidelity case study generation.
 * Focused on zero-error output and direct path to the Item Bank.
 * 
 * BROWSER COMPATIBLE VERSION
 */
export class CaseStudyGeneratorV2 {
    private genAI: GoogleGenerativeAI | null = null;

    private async init() {
        const apiKey = await getAuthorizedApiKey();
        if (!apiKey) throw new Error("Missing Gemini API Key");
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Loads the Golden Prompt V2 text.
     */
    async preparePrompt(topic: string): Promise<string> {
        // Embed the prompt directly for browser compatibility
        // This ensures the generator works even if file access is restricted in the browser
        return `
# NGN Case Study Generator - Golden Prompt V2

## Your Role
You are an expert NCLEX-NGN item writer creating clinical case studies for nursing students.

## Output Requirements
- Pure JSON only (no markdown, no explanations)
- Every field is required unless marked optional

## CRITICAL GENERATION RULES
1. EVERY option MUST have: {id, text, isCorrect, rationale}
2. Bow-Tie pools MUST be object arrays, NEVER string arrays
3. Highlight rationales MUST use key 'rationales' (plural) with span IDs as keys
4. Matrix rows MUST have: {id, text, correctColumnId, correctColumnIds, rationale}
5. Drop-Cloze options MUST have: {id, text, isCorrect, rationale}
6. MINIMUM 15 words per rationale. BANNED phrases: "correct answer", "this is correct".
7. MUST explain WHY using clinical reasoning (ABCs, perfusion, trends).

## Case Study Topic: ${topic}

## Schema Template
(Return a JSON object following the canonical MasterQuestionItem structure)
{
  "id": "case-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}",
  "typeId": "case-study",
  "type": "case-study",
  "metadata": {
    "title": "${topic} Case Study",
    "sourceOrigin": "ai_generated",
    "status": "draft"
  },
  "content": {
    "clinicalData": {
      "patientProfile": { "name": "Client, A.", "age": 45, "gender": "M" },
      "setting": "Emergency Department",
      "timeProgression": [ { "timestamp": "0800", "vitals": {}, "notes": "", "labs": [], "orders": [] } ]
    },
    "structure": {
      "screens": [
        { "id": "s1", "type": "highlight", "cjmmStep": "Recognize Cues", "prompt": "Identify...", "text": "...", "correct": [], "rationales": {} },
        { "id": "s2", "type": "matrix", "cjmmStep": "Analyze Cues", "prompt": "...", "columns": [], "rows": [] },
        { "id": "s3", "type": "multiple-choice", "cjmmStep": "Prioritize Hypotheses", "prompt": "...", "options": [] },
        { "id": "s4", "type": "bow-tie", "cjmmStep": "Generate Solutions", "prompt": "...", "conditions": [], "actions": [], "parameters": [], "correct": {} },
        { "id": "s5", "type": "drop-cloze", "cjmmStep": "Take Action", "prompt": "...", "text": "...", "dropdowns": [] },
        { "id": "s6", "type": "multiple-response", "cjmmStep": "Evaluate Outcomes", "prompt": "...", "options": [] }
      ]
    }
  },
  "rationale": {
    "coreConcept": "...",
    "caseSummary": "...",
    "goldenRule": "...",
    "pitfalls": [],
    "cheatSheet": { "title": "Clinical Pearls", "points": [] },
    "mnemonic": { "title": "...", "content": "...", "explanation": "..." }
  }
}
`.trim();
    }

    /**
     * Generates a complete 6-screen case study for a given topic.
     */
    async generate(topic: string): Promise<any> {
        await this.init();
        const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const finalPrompt = await this.preparePrompt(topic);

        console.log(`[GeneratorV2] Starting generation for topic: ${topic}`);
        const startTime = Date.now();

        try {
            const result = await model.generateContent(finalPrompt);
            const text = result.response.text();

            const cleanJson = this.extractJson(text);
            const rawData = JSON.parse(cleanJson);

            trackEvent('GENERATION_SUCCESS_V2', {
                topic,
                duration_ms: Date.now() - startTime
            });

            // 4. Ingest via Unified Pipeline (Now with AutoFill and Enhanced Rationale support)
            return await ItemIngestionService.ingest(rawData);

        } catch (error: any) {
            console.error(`[GeneratorV2] Generation failed:`, error);
            throw error;
        }
    }

    private extractJson(text: string): string {
        let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start < 0 || end < 0) throw new Error("AI did not return a valid JSON object.");
        return clean.substring(start, end + 1);
    }

    // Compatibility methods for Admin Panel
    parseResponse(text: string): any {
        return JSON.parse(this.extractJson(text));
    }

    validate(data: any): { valid: boolean; errors: string[]; warnings: string[] } {
        const errors: string[] = [];
        if (!data.content?.structure?.screens) errors.push("Missing screens array");
        if (data.content?.structure?.screens?.length < 1) errors.push("At least one screen required");
        return { valid: errors.length === 0, errors, warnings: [] };
    }
}
