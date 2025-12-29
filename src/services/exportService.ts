import { MasterQuestionItem } from '../types/master-schema';

/**
 * Export Service
 * Generate and download batches in various formats (PDF, JSON, CSV).
 * NOTE: PDF generation logic is mocked for this prototype.
 */

export interface ExportOptions {
    includeAnswerKeys: boolean;
    includeRationales: boolean;
    includeReferences: boolean;
    includeDifficulty: boolean;
    includeQualityScores: boolean;
}

export type ExportFormat = 'pdf' | 'word' | 'json' | 'csv';

/**
 * Generates the export file blob.
 */
export const exportQuestions = async (
    items: MasterQuestionItem[],
    format: ExportFormat,
    options: ExportOptions
): Promise<Blob> => {

    // 1. JSON Export (Native)
    if (format === 'json') {
        const jsonStr = JSON.stringify({ metadata: options, items }, null, 2);
        return new Blob([jsonStr], { type: 'application/json' });
    }

    // 2. CSV Export (Flattened)
    if (format === 'csv') {
        const headers = "ID,Type,Title,Status,Score,ClinicalFocus\n";
        const rows = items.map(i => {
            return `${i.id},${i.typeId},"${i.metadata.title}",${i.metadata.status},${i.metadata.qualityScore || 0},"${i.pedagogy.clinicalFocus}"`;
        }).join("\n");
        return new Blob([headers + rows], { type: 'text/csv' });
    }

    // 3. PDF (Mocked - Real implementation would use jspdf or server-side)
    if (format === 'pdf') {
        return new Blob(["[PDF EXPORT PLACEHOLDER]\n\nThis is a mock PDF file content."], { type: 'application/pdf' });
    }

    // 4. Word (Mocked)
    if (format === 'word') {
        return new Blob(["[WORD EXPORT PLACEHOLDER]\n\nThis is a mock DOCX file content."], { type: 'application/msword' });
    }

    throw new Error('Unsupported format');
};

/**
 * Trigger browser download helper.
 */
export const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
