import { z } from 'zod';

// -----------------------------------------------------------------------------
// ITEM INGESTION SCHEMA (For Batch Uploads)
// -----------------------------------------------------------------------------
export const ItemIngestSchema = z.object({
    type: z.enum([
        'case-study',
        'bow-tie',
        'matrix',
        'ordered-response',
        'highlight',
        'drop-cloze',
        'multiple-response'
    ]),
    content: z.object({
        clinicalData: z.object({
            vitals: z.array(z.object({
                time: z.string(),
                tempF: z.string(),
                hr: z.number(),
                rr: z.number(),
                bp: z.string(),
                o2: z.string(),
                pain: z.union([z.number(), z.string()])
            })).min(1, "At least one set of vitals is required"),
            labResults: z.array(z.any()).optional(),
            patientInfo: z.object({
                age: z.union([z.number(), z.string()]),
                gender: z.string()
            }).optional()
        }),
        structure: z.object({
            screens: z.array(z.any()).optional().describe("For Case Studies"),
            prompt: z.string().optional()
        }),
        rationale: z.object({
            coreConcept: z.string().min(10),
            difficulty: z.object({
                level: z.number().min(1).max(5),
                score: z.number().min(0).max(100)
            })
        })
    }),
    metadata: z.object({
        difficulty: z.number().min(1).max(5),
        topic: z.string(),
        tags: z.array(z.string()).optional()
    })
});

// -----------------------------------------------------------------------------
// STUDENT RESPONSE SCHEMA (For Submissions)
// -----------------------------------------------------------------------------
export const StudentResponseSchema = z.object({
    sessionId: z.string().uuid(),
    itemId: z.string().uuid(),
    studentAnswer: z.union([
        z.string(),              // Single Choice
        z.array(z.string()),     // Multi Choice / Ordered
        z.record(z.string())     // Matrix / Bowtie { rowId: colId }
    ]),
    timeSpentSeconds: z.number().min(0),
    timestamp: z.string().datetime().optional()
});

// -----------------------------------------------------------------------------
// SESSION START SCHEMA
// -----------------------------------------------------------------------------
export const SessionStartSchema = z.object({
    studentId: z.string().uuid(),
    mode: z.enum(['tutorial', 'exam', 'cat']),
    config: z.object({
        topicFilter: z.string().optional(),
        difficultyFilter: z.number().optional(),
        itemCount: z.number().min(1).max(100).default(10)
    }).optional()
});
