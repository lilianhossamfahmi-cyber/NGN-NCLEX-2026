/**
 * EXPORT SERVICE - Multi-format export (CSV, JSON, PDF, QTI 2.1)
 * Supports exporting NCLEX-NGN question items to various formats
 */

import type { MasterQuestionItem } from '../types/master-schema';

export interface ExportOptions {
  filename?: string;
  includeAnswerKeys?: boolean;
  includeRationales?: boolean;
  includeReferences?: boolean;
  includeClinicalData?: boolean;
  includeDifficulty?: boolean;
  includeQualityScores?: boolean;
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  data?: string;
  filename: string;
  error?: string;
}

export type ExportFormat = 'pdf' | 'word' | 'json' | 'csv' | 'qti';

// ==================== A. CSV EXPORT ====================

/**
 * Exports items to CSV format (compatible with Excel)
 */
export function exportToCsv(items: MasterQuestionItem[], options?: ExportOptions): ExportResult {
  try {
    const headers = [
      'ID',
      'Type',
      'Title',
      'Clinical Focus',
      'Difficulty',
      'Client Need',
      'CJMM Step',
      'Created Date',
      'Status',
      'Quality Score'
    ];

    const rows = items.map(item => [
      item.id || '',
      item.typeId || '',
      item.metadata?.title || '',
      item.pedagogy?.clinicalFocus || '',
      item.pedagogy?.difficultyLevel || '',
      (item.pedagogy as any)?.clientNeeds || '',
      (item.pedagogy as any)?.cjmmStep || '',
      item.metadata?.createdAt || new Date().toISOString(),
      item.metadata?.status || 'draft',
      item.metadata?.qualityScore || 0
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = options?.filename || generateFilename('csv');

    return {
      success: true,
      blob,
      filename
    };
  } catch (error) {
    console.error('[ExportService] CSV export failed:', error);
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'CSV export failed'
    };
  }
}

/**
 * Escapes special characters for CSV
 */
function escapeCsv(value: any): string {
  const str = String(value ?? '');

  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

// ==================== B. JSON EXPORT ====================

/**
 * Exports items to formatted JSON
 */
export function exportToJson(items: MasterQuestionItem[], options?: ExportOptions): ExportResult {
  try {
    const jsonContent = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const filename = options?.filename || generateFilename('json');

    return {
      success: true,
      blob,
      data: jsonContent,
      filename
    };
  } catch (error) {
    console.error('[ExportService] JSON export failed:', error);
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'JSON export failed'
    };
  }
}

// ==================== C. PDF EXPORT ====================

/**
 * Exports items to PDF (requires jsPDF)
 */
export async function exportToPdf(items: MasterQuestionItem[], options?: ExportOptions): Promise<ExportResult> {
  try {
    // Dynamic import to avoid bundling if not used
    const jsPDF = (await import('jspdf')).default;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yOffset = margin;

    // Title page
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NCLEX-NGN Generated Items', margin, yOffset);
    yOffset += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yOffset);
    pdf.text(`Total Items: ${items.length}`, margin, yOffset + 5);
    yOffset += 15;

    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if we need a new page
      if (yOffset > pageHeight - 40) {
        pdf.addPage();
        yOffset = margin;
      }

      // Item number and title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${i + 1}. ${item.metadata?.title || 'Untitled Item'}`, margin, yOffset);
      yOffset += 8;

      // Type badge and metadata
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Type: ${item.typeId}  |  Difficulty: ${item.pedagogy?.difficultyLevel || 'N/A'}  |  Clinical Focus: ${item.pedagogy?.clinicalFocus || 'General'}`, margin, yOffset);
      yOffset += 6;

      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 6;

      // Question prompt
      if (item.content?.structure?.prompt) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const promptLines = pdf.splitTextToSize(item.content.structure.prompt, contentWidth);
        pdf.text(promptLines, margin, yOffset);
        yOffset += promptLines.length * 5;
        yOffset += 5;
      }

      // Options (for multiple choice types)
      if (item.content?.structure?.options && Array.isArray(item.content.structure.options)) {
        pdf.setFontSize(10);
        item.content.structure.options.forEach((option: any, idx: number) => {
          const prefix = option.isCorrect ? '✓' : '○';
          const text = option.text || option.label || `Option ${idx + 1}`;
          const optionLines = pdf.splitTextToSize(`${prefix} ${text}`, contentWidth - 10);
          pdf.text(optionLines, margin + 5, yOffset);
          yOffset += optionLines.length * 5;
        });
        yOffset += 5;
      }

      // Rationale (if included)
      if (options?.includeRationales && item.content?.rationale) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(80, 80, 80);
        pdf.text('Rationale:', margin, yOffset);
        yOffset += 5;

        const rationaleText = typeof item.content.rationale === 'string'
          ? item.content.rationale
          : JSON.stringify(item.content.rationale);
        const rationaleLines = pdf.splitTextToSize(rationaleText, contentWidth);
        pdf.text(rationaleLines, margin + 5, yOffset);
        yOffset += rationaleLines.length * 5;
      }

      yOffset += 10; // Space before next item
    }

    const blob = pdf.output('blob');
    const filename = options?.filename || generateFilename('pdf');

    return {
      success: true,
      blob,
      filename
    };
  } catch (error) {
    console.error('[ExportService] PDF export failed:', error);
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'PDF export failed'
    };
  }
}

// ==================== D. QTI 2.1 EXPORT ====================

/**
 * Exports items to QTI 2.1 XML format (LMS compatible)
 */
export function exportToQti(items: MasterQuestionItem[], options?: ExportOptions): ExportResult {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const assessmentId = `NCLEX_NGN_${timestamp}`;

    const qtiXml = `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="${assessmentId}" title="NCLEX-NGN Generated Items">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>qmd_assessmenttype</fieldlabel>
        <fieldentry>Examination</fieldentry>
      </qtimetadatafield>
      <qtimetadatafield>
        <fieldlabel>qmd_scoringpermitted</fieldlabel>
        <fieldentry>Yes</fieldentry>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="main_section" title="Main Section">
      ${items.map(item => generateQtiItem(item)).join('\n')}
    </section>
  </assessment>
</questestinterop>`;

    const blob = new Blob([qtiXml], { type: 'application/xml' });
    const filename = options?.filename || generateFilename('xml');

    return {
      success: true,
      blob,
      data: qtiXml,
      filename
    };
  } catch (error) {
    console.error('[ExportService] QTI export failed:', error);
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'QTI export failed'
    };
  }
}

/**
 * Generates QTI XML for a single item
 */
function generateQtiItem(item: MasterQuestionItem): string {
  const typeId = item.typeId || 'multiple-choice';

  // Map to QTI type
  if (typeId.includes('multiple-choice') || typeId === 'mcq') {
    return generateMultipleChoiceQti(item);
  } else if (typeId.includes('sata') || typeId.includes('multiple-response')) {
    return generateMultipleResponseQti(item);
  } else if (typeId.includes('calculation')) {
    return generateNumericQti(item);
  } else {
    // Default to multiple choice for unsupported types
    return generateMultipleChoiceQti(item);
  }
}

/**
 * Generates QTI for multiple choice items
 */
function generateMultipleChoiceQti(item: MasterQuestionItem): string {
  const options = item.content?.structure?.options || [];
  const correctOption = options.find((o: any) => o.isCorrect || o.correct);
  const correctId = correctOption?.id || 'opt_0';
  const prompt = item.content?.structure?.prompt || item.metadata?.title || 'Question';

  return `    <item ident="${escapeXml(item.id)}" title="${escapeXml(item.metadata?.title || 'Item')}">
      <itemmetadata>
        <qtimetadata>
          <qtimetadatafield>
            <fieldlabel>question_type</fieldlabel>
            <fieldentry>multiple_choice_question</fieldentry>
          </qtimetadatafield>
          <qtimetadatafield>
            <fieldlabel>points_possible</fieldlabel>
            <fieldentry>1.0</fieldentry>
          </qtimetadatafield>
        </qtimetadata>
      </itemmetadata>
      <presentation>
        <material>
          <mattext texttype="text/html"><![CDATA[${prompt}]]></mattext>
        </material>
        <response_lid ident="response1" rcardinality="Single">
          <render_choice shuffle="Yes">
            ${options.map((opt: any) => `
            <response_label ident="${escapeXml(opt.id || `opt_${opt.index || 0}`)}">
              <material>
                <mattext texttype="text/plain"><![CDATA[${opt.text || opt.label || ''}]]></mattext>
              </material>
            </response_label>`).join('')}
          </render_choice>
        </response_lid>
      </presentation>
      <resprocessing>
        <outcomes>
          <decvar maxvalue="1" minvalue="0" varname="SCORE" vartype="Decimal"/>
        </outcomes>
        <respcondition continue="No">
          <conditionvar>
            <varequal respident="response1">${escapeXml(correctId)}</varequal>
          </conditionvar>
          <setvar action="Set" varname="SCORE">1</setvar>
          <displayfeedback feedbacktype="Response" linkrefid="correct_fb"/>
        </respcondition>
        <respcondition continue="Yes">
          <conditionvar>
            <other/>
          </conditionvar>
          <displayfeedback feedbacktype="Response" linkrefid="incorrect_fb"/>
        </respcondition>
      </resprocessing>
    </item>`;
}

/**
 * Generates QTI for multiple response (SATA) items
 */
function generateMultipleResponseQti(item: MasterQuestionItem): string {
  const options = item.content?.structure?.options || [];
  const correctIds = options
    .filter((o: any) => o.isCorrect || o.correct)
    .map((o: any) => o.id || `opt_${o.index || 0}`);
  const prompt = item.content?.structure?.prompt || item.metadata?.title || 'Question';

  return `    <item ident="${escapeXml(item.id)}" title="${escapeXml(item.metadata?.title || 'Item')}">
      <itemmetadata>
        <qtimetadata>
          <qtimetadatafield>
            <fieldlabel>question_type</fieldlabel>
            <fieldentry>multiple_answers_question</fieldentry>
          </qtimetadatafield>
          <qtimetadatafield>
            <fieldlabel>points_possible</fieldlabel>
            <fieldentry>1.0</fieldentry>
          </qtimetadatafield>
        </qtimetadata>
      </itemmetadata>
      <presentation>
        <material>
          <mattext texttype="text/html"><![CDATA[${prompt}]]></mattext>
        </material>
        <response_lid ident="response1" rcardinality="Multiple">
          <render_choice shuffle="Yes">
            ${options.map((opt: any) => `
            <response_label ident="${escapeXml(opt.id || `opt_${opt.index || 0}`)}">
              <material>
                <mattext texttype="text/plain"><![CDATA[${opt.text || opt.label || ''}]]></mattext>
              </material>
            </response_label>`).join('')}
          </render_choice>
        </response_lid>
      </presentation>
      <resprocessing>
        <outcomes>
          <decvar maxvalue="1" minvalue="0" varname="SCORE" vartype="Decimal"/>
        </outcomes>
        <respcondition continue="No">
          <conditionvar>
            <and>
              ${correctIds.map((id: string) => `<varequal respident="response1">${escapeXml(id)}</varequal>`).join('\n              ')}
            </and>
          </conditionvar>
          <setvar action="Set" varname="SCORE">1</setvar>
        </respcondition>
      </resprocessing>
    </item>`;
}

/**
 * Generates QTI for numeric/calculation items
 */
function generateNumericQti(item: MasterQuestionItem): string {
  const correctValue = item.content?.structure?.correctValue || 0;
  const prompt = item.content?.structure?.prompt || item.metadata?.title || 'Question';

  return `    <item ident="${escapeXml(item.id)}" title="${escapeXml(item.metadata?.title || 'Item')}">
      <itemmetadata>
        <qtimetadata>
          <qtimetadatafield>
            <fieldlabel>question_type</fieldlabel>
            <fieldentry>numerical_question</fieldentry>
          </qtimetadatafield>
        </qtimetadata>
      </itemmetadata>
      <presentation>
        <material>
          <mattext texttype="text/html"><![CDATA[${prompt}]]></mattext>
        </material>
        <response_num ident="response1" rcardinality="Single">
          <render_fib fibtype="Decimal"/>
        </response_num>
      </presentation>
      <resprocessing>
        <outcomes>
          <decvar maxvalue="1" minvalue="0" varname="SCORE" vartype="Decimal"/>
        </outcomes>
        <respcondition continue="No">
          <conditionvar>
            <varequal respident="response1">${correctValue}</varequal>
          </conditionvar>
          <setvar action="Set" varname="SCORE">1</setvar>
        </respcondition>
      </resprocessing>
    </item>`;
}

/**
 * Escapes special XML characters
 */
function escapeXml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace

    (/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ==================== UTILITIES ====================

/**
 * Generates standardized filename
 */
function generateFilename(extension: string): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `NCLEX_NGN_Export_${timestamp}.${extension}`;
}

/**
 * Triggers browser download
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Main export function with progress tracking
 */
export async function exportItems(
  items: MasterQuestionItem[],
  format: 'csv' | 'json' | 'pdf' | 'qti',
  options?: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<ExportResult> {
  try {
    if (onProgress) onProgress(0);

    let result: ExportResult;

    switch (format) {
      case 'csv':
        if (onProgress) onProgress(50);
        result = exportToCsv(items, options);
        break;
      case 'json':
        if (onProgress) onProgress(50);
        result = exportToJson(items, options);
        break;
      case 'pdf':
        if (onProgress) onProgress(30);
        result = await exportToPdf(items, options);
        break;
      case 'qti':
        if (onProgress) onProgress(50);
        result = exportToQti(items, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    if (onProgress) onProgress(100);
    return result;
  } catch (error) {
    console.error(`[ExportService] Export failed for format ${format}:`, error);
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Export failed'
    };
  }
}

// Legacy compatibility
export const exportQuestions = async (
  items: MasterQuestionItem[],
  format: ExportFormat,
  options: ExportOptions
): Promise<Blob> => {
  const result = await exportItems(items, format as any, options);
  if (!result.success || !result.blob) {
    throw new Error(result.error || 'Export failed');
  }
  return result.blob;
};

export const ExportService = {
  exportToCsv,
  exportToJson,
  exportToPdf,
  exportToQti,
  exportItems,
  exportQuestions,
  downloadFile,
  generateFilename
};

export default ExportService;
