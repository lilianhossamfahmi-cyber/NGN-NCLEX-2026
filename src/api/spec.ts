/**
 * MASTER NGN QUESTION CREATOR - API SPECIFICATION v2.0
 * 
 * Base URL: https://api.masterngn.com/v1
 * Auth: proper Bearer Token required for all endpoints.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

// --- 1. QUESTION GENERATION ---

/**
 * POST /api/questions/generate
 * Generates NGN question items based on provided settings and context.
 * 
 * Headers:
 *   Authorization: Bearer <token>
 * 
 * Rate Limit: 10 requests / hour / user
 */
type GenerateRequest = {
    settings: {
        mode: 'upload' | 'manual' | 'ai' | 'hybrid';
        targetTypes: string[]; // ['case-study-6-screen', 'trend-standalone', ...]
        quantityPerType: number; // 1-10
        temperature: number; // 0.0 - 2.0
        clinicalFocus: string[]; // ['Critical Care', 'Pediatrics']
    };
    referenceContext?: {
        referenceIds: string[]; // IDs of uploaded docs
    };
    manualContext?: string; // Raw clinical text
    aiPrompt?: string; // User scenario description
};

type GenerateResponse = {
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    items?: any[]; // MasterQuestionItem[]
    metadata?: {
        generatedCount: number;
        tokensUsed: number;
    };
};

// --- 2. COPYRIGHT DETECTION ---

/**
 * POST /api/copyright/detect
 * Checks text content against known proprietary databases and uploaded references.
 */
type CopyrightCheckRequest = {
    content: string; // The text to check
    contextReferenceIds?: string[];
};

type CopyrightCheckResponse = {
    status: 'clean' | 'flagged' | 'blocked';
    matches: {
        sourceId: string;
        sourceName: string;
        similarity: number; // 0-100%
        matchedText: string;
    }[];
    requiredAction: 'none' | 'attribute' | 'paraphrase';
    attributionText?: string;
};

// --- 3. DEDUPLICATION ---

/**
 * POST /api/deduplication/check
 * Checks a new item against the existing item bank for duplicates.
 */
type DedupeRequest = {
    newItem: any; // MasterQuestionItem
    scope?: 'global' | 'organization' | 'user';
};

type DedupeResponse = {
    isDuplicate: boolean;
    riskScore: number; // 0-100
    recommendation: 'APPROVE' | 'REVIEW' | 'REGENERATE' | 'REJECT';
    similarItems: {
        itemId: string;
        similarityScore: number;
    }[];
};

// --- 4. EXPORT ---

/**
 * POST /api/export
 * Generates a downloadable file for a batch of items.
 * 
 * Rate Limit: 20 requests / hour
 */
type ExportRequest = {
    itemIds: string[];
    format: 'pdf' | 'word' | 'json' | 'csv';
    options: {
        includeAnswerKeys: boolean;
        includeRationales: boolean;
        includeDiffculty: boolean;
    };
};

// Response is Binary Blob (application/pdf, etc.)

// --- 5. REFERENCE MANAGEMENT ---

/**
 * POST /api/references
 * Uploads a new reference document.
 * Multipart/form-data
 */
type UploadReferenceRequest = FormData; // file field

type UploadReferenceResponse = {
    referenceId: string;
    status: 'uploaded' | 'processing' | 'ready';
    extractedMetadata: {
        title: string;
        tags: string[];
    };
};

/**
 * GET /api/references
 * Lists available references for the user.
 */
type ListReferencesResponse = {
    references: {
        id: string;
        fileName: string;
        fileType: string;
        uploadDate: string;
        tags: string[];
        status: 'ready' | 'processing' | 'error';
    }[];
};
