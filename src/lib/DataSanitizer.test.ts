import {
    sanitizeHtml,
    validateVitals,
    validateLabs,
    validateNursesNotes,
    standardizeTemperature,
    standardizeBP,
    standardizeSpO2,
    stripDangerousContent,
    repairBrokenHtml,
    repairTableStructure,
    validateClinicalCase,
    sanitizeClinicalCase,
    type Vital,
    type ClinicalCaseData
} from './DataSanitizer';

// ==================== HTML SANITIZATION TESTS ====================

describe('HTML Sanitization', () => {
    test('Should allow safe HTML tags', () => {
        const input = '<b>Bold</b> <i>Italic</i> <span>Span</span>';
        const result = sanitizeHtml(input);
        expect(result).toContain('<b>');
        expect(result).toContain('<i>');
        expect(result).toContain('<span>');
    });

    test('Should remove script tags', () => {
        const input = '<p>Safe</p><script>alert("XSS")</script>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('<p>Safe</p>');
    });

    test('Should remove event handlers', () => {
        const input = '<div onclick="alert(\'XSS\')">Click me</div>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('onclick');
    });

    test('Should preserve table structure', () => {
        const input = '<table><tr><td>Data</td></tr></table>';
        const result = sanitizeHtml(input);
        expect(result).toContain('<table>');
        expect(result).toContain('<tr>');
        expect(result).toContain('<td>');
    });
});

// ==================== VITALS VALIDATION TESTS ====================

describe('Vitals Validation', () => {
    test('Should accept valid vitals', () => {
        const vitals: Vital[] = [
            { tempF: 98.6, hr: 72, rr: 16, bp: '120/80', o2: 98 }
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('Should reject temperature out of range', () => {
        const vitals: Vital[] = [
            { tempF: 107 } // Too high
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Temperature');
        expect(result.errors[0]).toContain('out of safe range');
    });

    test('Should reject heart rate out of range', () => {
        const vitals: Vital[] = [
            { hr: 30 } // Too low
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Heart rate');
    });

    test('Should reject respiratory rate out of range', () => {
        const vitals: Vital[] = [
            { rr: 50 } // Too high
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Respiratory rate');
    });

    test('Should reject invalid blood pressure', () => {
        const vitals: Vital[] = [
            { bp: '260/100' } // Systolic too high
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
    });

    test('Should reject SpO2 out of range', () => {
        const vitals: Vital[] = [
            { o2: 65 } // Too low
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('SpO2');
    });

    test('Should reject systolic <= diastolic', () => {
        const vitals: Vital[] = [
            { bp: '80/90' } // Invalid relationship
        ];
        const result = validateVitals(vitals);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Systolic BP must be higher');
    });
});

// ==================== LAB VALIDATION TESTS ====================

describe('Lab Validation', () => {
    test('Should accept valid lab table', () => {
        const labs = `
            <table>
                <thead>
                    <tr><th>Test</th><th>Result</th><th>Units</th><th>Range</th></tr>
                </thead>
                <tbody>
                    <tr><td>WBC</td><td>7.5</td><td>K/uL</td><td>4.5-11.0</td></tr>
                </tbody>
            </table>
        `;
        const result = validateLabs(labs);
        expect(result.valid).toBe(true);
    });

    test('Should reject non-table content', () => {
        const labs = '<p>This is not a table</p>';
        const result = validateLabs(labs);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('formatted as an HTML table');
    });

    test('Should reject missing required columns', () => {
        const labs = `
            <table>
                <thead><tr><th>Test</th><th>Result</th></tr></thead>
                <tbody><tr><td>WBC</td><td>7.5</td></tr></tbody>
            </table>
        `;
        const result = validateLabs(labs);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('Units'))).toBe(true);
    });

    test('Should reject empty table', () => {
        const labs = '<table><thead><tr><th>Test</th><th>Result</th><th>Units</th><th>Range</th></tr></thead></table>';
        const result = validateLabs(labs);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('at least one data row');
    });
});

// ==================== NURSES NOTES VALIDATION TESTS ====================

describe('Nurses Notes Validation', () => {
    test('Should accept valid nurses notes', () => {
        const notes = '1200 - Patient alert and oriented x3. Vital signs stable. No complaints at this time.';
        const result = validateNursesNotes(notes);
        expect(result.valid).toBe(true);
    });

    test('Should reject notes that are too short', () => {
        const notes = '1200 - OK';
        const result = validateNursesNotes(notes);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('at least 50 characters');
    });

    test('Should reject notes without timestamp', () => {
        const notes = 'Patient is doing well today with no complaints or concerns noted by staff.';
        const result = validateNursesNotes(notes);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('timestamps');
    });
});

// ==================== FORMAT STANDARDIZATION TESTS ====================

describe('Temperature Standardization', () => {
    test('Should format numeric temperature', () => {
        const result = standardizeTemperature(98.6);
        expect(result).toBe('98.6°F (37.0°C)');
    });

    test('Should format string temperature', () => {
        const result = standardizeTemperature('99.5°F');
        expect(result).toContain('99.5°F');
        expect(result).toContain('°C');
    });

    test('Should handle invalid temperature', () => {
        const result = standardizeTemperature('invalid');
        expect(result).toBe('Invalid temperature');
    });
});

describe('Blood Pressure Standardization', () => {
    test('Should format object BP', () => {
        const result = standardizeBP({ systolic: 120, diastolic: 80 });
        expect(result).toBe('120/80');
    });

    test('Should clean string BP', () => {
        const result = standardizeBP('120 / 80');
        expect(result).toBe('120/80');
    });

    test('Should preserve valid BP format', () => {
        const result = standardizeBP('130/85');
        expect(result).toBe('130/85');
    });
});

describe('SpO2 Standardization', () => {
    test('Should format numeric SpO2', () => {
        const result = standardizeSpO2(98);
        expect(result).toBe('98%');
    });

    test('Should format string SpO2', () => {
        const result = standardizeSpO2('97.5%');
        expect(result).toBe('98%'); // Should round
    });
});

// ==================== XSS PREVENTION TESTS ====================

describe('XSS Prevention', () => {
    test('Should strip script tags', () => {
        const input = 'Safe text <script>alert("XSS")</script> more text';
        const result = stripDangerousContent(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('Safe text');
    });

    test('Should remove javascript: protocol', () => {
        const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
        const result = stripDangerousContent(input);
        expect(result).not.toContain('javascript:');
    });

    test('Should remove inline event handlers', () => {
        const input = '<div onclick="doEvil()">Content</div>';
        const result = stripDangerousContent(input);
        expect(result).not.toContain('onclick');
    });

    test('Should block data: protocol', () => {
        const input = '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>';
        const result = stripDangerousContent(input);
        expect(result).not.toContain('data:text/html');
    });
});

// ==================== HTML REPAIR TESTS ====================

describe('HTML Repair', () => {
    test('Should close unclosed table tags', () => {
        const input = '<table><tr><td>Data';
        const result = repairBrokenHtml(input);
        expect(result).toContain('</td>');
        expect(result).toContain('</tr>');
        expect(result).toContain('</table>');
    });

    test('Should not add extra closing tags', () => {
        const input = '<table><tr><td>Data</td></tr></table>';
        const result = repairBrokenHtml(input);
        // Should be same or very similar
        expect(result).toContain('</table>');
    });

    test('Should repair table structure', () => {
        const input = '<table><tr><td>Data</td></tr></table>';
        const result = repairTableStructure(input);
        expect(result).toContain('<tbody>');
    });
});

// ==================== BATCH VALIDATION TESTS ====================

describe('Clinical Case Validation', () => {
    test('Should validate complete clinical case', () => {
        const caseData: ClinicalCaseData = {
            vitals: [{ tempF: 98.6, hr: 72, bp: '120/80' }],
            labs: '<table><thead><tr><th>Test</th><th>Result</th><th>Units</th><th>Range</th></tr></thead><tbody><tr><td>WBC</td><td>7.5</td><td>K/uL</td><td>4-11</td></tr></tbody></table>',
            nursesNotes: '1200 - Patient alert and oriented. Vital signs within normal limits. No acute concerns noted.'
        };
        const result = validateClinicalCase(caseData);
        expect(result.valid).toBe(true);
    });

    test('Should collect errors from all validations', () => {
        const caseData: ClinicalCaseData = {
            vitals: [{ tempF: 107 }], // Invalid
            labs: '<p>Not a table</p>', // Invalid
            nursesNotes: 'Too short' // Invalid
        };
        const result = validateClinicalCase(caseData);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
    });
});

describe('Clinical Case Sanitization', () => {
    test('Should sanitize all HTML fields', () => {
        const caseData: ClinicalCaseData = {
            labs: '<table><script>alert("xss")</script><tr><td>Data</td></tr></table>',
            nursesNotes: '<p onclick="evil()">Notes</p>',
            radiology: '<div>Report<script>bad()</script></div>'
        };
        const result = sanitizeClinicalCase(caseData);

        expect(result.labs).not.toContain('<script>');
        expect(result.nursesNotes).not.toContain('onclick');
        expect(result.radiology).not.toContain('<script>');
    });

    test('Should standardize vital formats', () => {
        const caseData: ClinicalCaseData = {
            vitals: [
                { tempF: 98.6, hr: 72.5, bp: '120 / 80', o2: 97.8 }
            ]
        };
        const result = sanitizeClinicalCase(caseData);

        expect(result.vitals![0].hr).toBe(73); // Rounded
        expect(result.vitals![0].bp).toBe('120/80'); // Cleaned
        expect(result.vitals![0].o2).toBe(98); // Rounded
    });
});
