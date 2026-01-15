import DOMPurify from 'isomorphic-dompurify';

// ==================== TYPES ====================

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface Vital {
    time?: string;
    tempF?: number;
    hr?: number;
    rr?: number;
    bp?: string;
    o2?: number;
    [key: string]: any;
}

// ==================== A. HTML SANITIZATION ====================

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe tags and attributes for clinical data display
 */
export function sanitizeHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'span', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'br', 'p', 'ul', 'ol', 'li', 'div'],
        ALLOWED_ATTR: ['class', 'style', 'id'],
        KEEP_CONTENT: true,
        FORCE_BODY: false
    });
}

// ==================== B. CLINICAL DATA VALIDATION ====================

/**
 * Validates vital signs against clinical ranges
 * Returns validation result with specific error messages
 */
export function validateVitals(vitals: Vital[]): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(vitals)) {
        return { valid: false, errors: ['Vitals must be an array'] };
    }

    vitals.forEach((vital, index) => {
        const prefix = `Vital ${index + 1}`;

        // Temperature validation (95-106°F or 35-41°C)
        if (vital.tempF !== undefined && vital.tempF !== null) {
            if (vital.tempF < 95 || vital.tempF > 106) {
                errors.push(`${prefix}: Temperature ${vital.tempF}°F is out of safe range (95-106°F)`);
            }
        }

        // Heart rate validation (40-200 bpm)
        if (vital.hr !== undefined && vital.hr !== null) {
            if (vital.hr < 40 || vital.hr > 200) {
                errors.push(`${prefix}: Heart rate ${vital.hr} bpm is out of safe range (40-200 bpm)`);
            }
        }

        // Respiratory rate validation (8-40 breaths/min)
        if (vital.rr !== undefined && vital.rr !== null) {
            if (vital.rr < 8 || vital.rr > 40) {
                errors.push(`${prefix}: Respiratory rate ${vital.rr} is out of safe range (8-40 breaths/min)`);
            }
        }

        // Blood pressure validation
        if (vital.bp) {
            const bpParts = vital.bp.split('/').map(s => parseFloat(s.trim()));
            if (bpParts.length === 2) {
                const [systolic, diastolic] = bpParts;

                if (isNaN(systolic) || isNaN(diastolic)) {
                    errors.push(`${prefix}: Blood pressure "${vital.bp}" is not formatted correctly (use "120/80")`);
                } else {
                    if (systolic < 70 || systolic > 250) {
                        errors.push(`${prefix}: Systolic BP ${systolic} is out of safe range (70-250 mmHg)`);
                    }
                    if (diastolic < 40 || diastolic > 150) {
                        errors.push(`${prefix}: Diastolic BP ${diastolic} is out of safe range (40-150 mmHg)`);
                    }
                    if (systolic <= diastolic) {
                        errors.push(`${prefix}: Systolic BP must be higher than diastolic BP`);
                    }
                }
            } else {
                errors.push(`${prefix}: Blood pressure must be in format "systolic/diastolic" (e.g., "120/80")`);
            }
        }

        // SpO2 validation (70-100%)
        if (vital.o2 !== undefined && vital.o2 !== null) {
            if (vital.o2 < 70 || vital.o2 > 100) {
                errors.push(`${prefix}: SpO2 ${vital.o2}% is out of safe range (70-100%)`);
            }
        }
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Validates lab results HTML table structure
 * Ensures required columns are present
 */
export function validateLabs(labs: string): ValidationResult {
    const errors: string[] = [];

    if (!labs || typeof labs !== 'string') {
        return { valid: false, errors: ['Labs content is required'] };
    }

    // Check if labs contains a table
    const parser = new DOMParser();
    const doc = parser.parseFromString(labs, 'text/html');

    const table = doc.querySelector('table');
    if (!table) {
        errors.push('Labs must be formatted as an HTML table');
        return { valid: false, errors };
    }

    // Check for required columns
    const headers = Array.from(doc.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
    const required = ['Test', 'Result', 'Units', 'Range'];

    required.forEach(col => {
        const found = headers.some(h => h.toLowerCase().includes(col.toLowerCase()));
        if (!found) {
            errors.push(`Missing required column: "${col}"`);
        }
    });

    // Check if table has data rows
    const rows = doc.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        errors.push('Lab table must contain at least one data row');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validates nurse's notes for minimum content requirements
 */
export function validateNursesNotes(notes: string): ValidationResult {
    const errors: string[] = [];

    if (!notes || typeof notes !== 'string') {
        return { valid: false, errors: ['Nurses notes content is required'] };
    }

    const cleanText = notes.replace(/<[^>]*>/g, '').trim();

    if (cleanText.length < 50) {
        errors.push('Nurses notes must contain at least 50 characters of meaningful content');
    }

    // Check for timestamp format (e.g., "1200 - ", "12:00 - ")
    const hasTimestamp = /\d{2}:?\d{2}\s*-/.test(notes);
    if (!hasTimestamp) {
        errors.push('Nurses notes should include timestamps in format "HH:MM - " or "HHMM - "');
    }

    return { valid: errors.length === 0, errors };
}

// ==================== C. FORMAT STANDARDIZATION ====================

/**
 * Standardizes temperature to display both Fahrenheit and Celsius
 * @param temp - Temperature as string or number
 * @returns Formatted string "99.1°F (37.3°C)"
 */
export function standardizeTemperature(temp: string | number): string {
    let tempF: number;

    if (typeof temp === 'string') {
        // Extract numeric value
        tempF = parseFloat(temp.replace(/[^0-9.-]/g, ''));
    } else {
        tempF = temp;
    }

    if (isNaN(tempF)) {
        return 'Invalid temperature';
    }

    const tempC = ((tempF - 32) * 5 / 9).toFixed(1);
    return `${tempF.toFixed(1)}°F (${tempC}°C)`;
}

/**
 * Standardizes blood pressure format
 * @param bp - Blood pressure as string or object
 * @returns Formatted string "120/80"
 */
export function standardizeBP(bp: string | { systolic: number, diastolic: number }): string {
    if (typeof bp === 'string') {
        // Clean and validate format
        const cleaned = bp.replace(/\s+/g, '');
        const match = cleaned.match(/^(\d+)\/(\d+)$/);
        if (match) {
            return `${match[1]}/${match[2]}`;
        }
        return bp; // Return as-is if already formatted
    }

    if (typeof bp === 'object' && bp.systolic !== undefined && bp.diastolic !== undefined) {
        return `${Math.round(bp.systolic)}/${Math.round(bp.diastolic)}`;
    }

    return 'Invalid BP';
}

/**
 * Standardizes SpO2 format
 */
export function standardizeSpO2(o2: string | number): string {
    let value: number;

    if (typeof o2 === 'string') {
        value = parseFloat(o2.replace(/[^0-9.-]/g, ''));
    } else {
        value = o2;
    }

    if (isNaN(value)) {
        return 'Invalid SpO2';
    }

    return `${Math.round(value)}%`;
}

/**
 * Standardizes time format to HH:MM
 */
export function standardizeTime(time: string): string {
    if (!time) return '';

    // Handle various formats: "1200", "12:00", "12.00"
    const cleaned = time.replace(/[^\d]/g, '');

    if (cleaned.length === 4) {
        const hours = cleaned.substring(0, 2);
        const minutes = cleaned.substring(2, 4);
        return `${hours}:${minutes}`;
    }

    return time; // Return original if can't parse
}

// ==================== D. XSS PREVENTION ====================

/**
 * Strips dangerous content from strings
 * Removes script tags, javascript: protocols, and inline event handlers
 */
export function stripDangerousContent(content: string): string {
    if (!content || typeof content !== 'string') return '';

    return content
        // Remove script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove inline event handlers (onclick, onload, etc.)
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove data: protocol (can be used for XSS)
        .replace(/data:text\/html/gi, '')
        // Remove vbscript: protocol
        .replace(/vbscript:/gi, '');
}

/**
 * Comprehensive sanitization for all clinical content
 * Combines HTML sanitization with dangerous content stripping
 */
export function sanitizeClinicalContent(content: string): string {
    if (!content) return '';

    // First strip dangerous content
    let cleaned = stripDangerousContent(content);

    // Then sanitize HTML
    cleaned = sanitizeHtml(cleaned);

    return cleaned;
}

// ==================== E. AUTO-REPAIR BROKEN HTML ====================

/**
 * Attempts to repair broken HTML by closing unclosed tags
 * Focuses on common HTML table tags used in clinical data
 */
export function repairBrokenHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';

    let repaired = html;

    // Common tags that need closing
    const tagsToClose = ['table', 'thead', 'tbody', 'tr', 'td', 'th', 'div', 'p', 'ul', 'ol', 'li'];

    tagsToClose.forEach(tag => {
        // Count opening tags
        const openRegex = new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'gi');
        const openCount = (repaired.match(openRegex) || []).length;

        // Count closing tags
        const closeRegex = new RegExp(`<\\/${tag}>`, 'gi');
        const closeCount = (repaired.match(closeRegex) || []).length;

        // Add missing closing tags
        if (openCount > closeCount) {
            const missing = openCount - closeCount;
            repaired += `</${tag}>`.repeat(missing);
        }
    });

    return repaired;
}

/**
 * Validates and repairs HTML table structure
 * Ensures proper nesting of table elements
 */
export function repairTableStructure(html: string): string {
    if (!html || !html.includes('<table')) return html;

    let repaired = html;

    // Ensure table has tbody if it has tr but no tbody/thead
    if (repaired.includes('<tr') && !repaired.includes('<tbody') && !repaired.includes('<thead')) {
        repaired = repaired.replace(/<table([^>]*)>/, '<table$1><tbody>');
        repaired = repaired.replace(/<\/table>/, '</tbody></table>');
    }

    // Auto-repair using DOMParser and serialization
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(repaired, 'text/html');
        const table = doc.querySelector('table');

        if (table) {
            repaired = table.outerHTML;
        }
    } catch (e) {
        console.warn('Failed to parse and repair table HTML:', e);
    }

    return repaired;
}

// ==================== BATCH VALIDATION ====================

/**
 * Validates entire clinical case data structure
 */
export interface ClinicalCaseData {
    vitals?: Vital[];
    labs?: string;
    nursesNotes?: string;
    radiology?: string;
    [key: string]: any;
}

export function validateClinicalCase(caseData: ClinicalCaseData): ValidationResult {
    const errors: string[] = [];

    // Validate vitals if present
    if (caseData.vitals && Array.isArray(caseData.vitals)) {
        const vitalResult = validateVitals(caseData.vitals);
        if (!vitalResult.valid) {
            errors.push(...vitalResult.errors);
        }
    }

    // Validate labs if present
    if (caseData.labs) {
        const labResult = validateLabs(caseData.labs);
        if (!labResult.valid) {
            errors.push(...labResult.errors);
        }
    }

    // Validate nurses notes if present
    if (caseData.nursesNotes) {
        const notesResult = validateNursesNotes(caseData.nursesNotes);
        if (!notesResult.valid) {
            errors.push(...notesResult.errors);
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Sanitizes entire clinical case data
 * Returns a new object with all HTML sanitized
 */
export function sanitizeClinicalCase(caseData: ClinicalCaseData): ClinicalCaseData {
    const sanitized: ClinicalCaseData = { ...caseData };

    // Sanitize HTML fields
    if (sanitized.labs) {
        sanitized.labs = sanitizeClinicalContent(repairTableStructure(sanitized.labs));
    }

    if (sanitized.nursesNotes) {
        sanitized.nursesNotes = sanitizeClinicalContent(sanitized.nursesNotes);
    }

    if (sanitized.radiology) {
        sanitized.radiology = sanitizeClinicalContent(sanitized.radiology);
    }

    // Standardize vitals format
    if (sanitized.vitals && Array.isArray(sanitized.vitals)) {
        sanitized.vitals = sanitized.vitals.map(vital => ({
            ...vital,
            tempF: vital.tempF !== undefined ? parseFloat(String(vital.tempF)) : undefined,
            hr: vital.hr !== undefined ? Math.round(parseFloat(String(vital.hr))) : undefined,
            rr: vital.rr !== undefined ? Math.round(parseFloat(String(vital.rr))) : undefined,
            bp: vital.bp ? standardizeBP(vital.bp) : undefined,
            o2: vital.o2 !== undefined ? Math.round(parseFloat(String(vital.o2))) : undefined
        }));
    }

    return sanitized;
}

// ==================== EXPORT ALL ====================

export const DataSanitizer = {
    // HTML
    sanitizeHtml,
    repairBrokenHtml,
    repairTableStructure,
    stripDangerousContent,
    sanitizeClinicalContent,

    // Validation
    validateVitals,
    validateLabs,
    validateNursesNotes,
    validateClinicalCase,

    // Standardization
    standardizeTemperature,
    standardizeBP,
    standardizeSpO2,
    standardizeTime,

    // Batch operations
    sanitizeClinicalCase
};

export default DataSanitizer;
