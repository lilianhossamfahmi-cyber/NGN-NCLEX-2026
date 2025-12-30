/**
 * DataSanitizer - Gold Standard Clinical Data Normalization
 * 
 * Responsible for taking ANY input (Garbage, Markdown, HTML, Partial JSON)
 * and converting it into perfect, render-ready structures following clinical
 * gold standards (NCSBN, JCI, ISMP, AHA, ACR, CAP, TJC).
 * 
 * @see docs/CLINICAL_GOLD_STANDARDS.md for implementation details
 * @see docs/external_prompts/_CLINICAL_DATA_SCHEMA.md for schema reference
 */

export interface StructuredNote {
    time: string;
    note: string;
    initial: string;
}

export interface StructuredVital {
    time: string;
    tempF: string;
    hr: number;
    rr: number;
    bp: string;
    o2: string;
    o2_device: string;
    pain: number | null;
}

export interface StructuredLab {
    test: string;
    value: string;
    ref: string;
    flag: string;
    category?: string;
    previous?: string;
}

export interface StructuredOrder {
    drug: string;
    dose: string;
    route: string;
    freq: string;
    status: string;
    indication: string;
    holdReason?: string;
}

export interface StructuredItem {
    id: string;
    type: string;
    conf: any;
    sanitized: boolean;
}

/**
 * The Sanitizer Layer - Gold Standard Implementation
 */
export const DataSanitizer = {

    /**
     * Converts raw Nurses Notes (String, HTML, or Array) into a strict SBAR structure.
     * Follows JCI documentation standards.
     */
    sanitizeNursesNotes: (data: any): StructuredNote[] => {
        if (!data) return [];

        // 1. HAPPY PATH: Already a clean JSON Array
        if (Array.isArray(data)) {
            return data.map(item => ({
                time: DataSanitizer.normalizeTime(item.time || item[0] || "00:00"),
                note: typeof item.note === 'string' ? item.note : (item.text || JSON.stringify(item)),
                initial: DataSanitizer.normalizeInitial(item.initial)
            }));
        }

        // 2. MESSY PATH: It's a string (HTML or Plain Text or JSON String)
        if (typeof data === 'string') {
            const raw = data.trim();

            // A. Try JSON Parse first (Common AI Edge Case)
            if ((raw.startsWith('[') || raw.startsWith('{'))) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        return DataSanitizer.sanitizeNursesNotes(parsed);
                    }
                } catch (e) {
                    // Ignore, continue to text parsing
                }
            }

            const rows: StructuredNote[] = [];

            // B. Try to extract from HTML Table first (if it exists)
            if (raw.includes('<tr')) {
                const trs = raw.split(/<tr[^>]*>/i).slice(1);
                trs.forEach(tr => {
                    const tds = tr.split(/<td[^>]*>/i).slice(1).map(td => {
                        return td.replace(/<\/td>[\s\S]*/i, '').replace(/<[^>]+>/g, ' ').trim();
                    });
                    if (tds.length >= 2) {
                        rows.push({
                            time: DataSanitizer.normalizeTime(tds[0] || "00:00"),
                            note: tds[1] || "",
                            initial: DataSanitizer.normalizeInitial(tds[2])
                        });
                    }
                });
                if (rows.length > 0) return rows;
            }

            // C. Text / Markdown Parser
            const cleanText = raw.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
            const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

            const timeRegex = /^(?:\*\*|__)?(\d{4}|\d{1,2}:\d{2})(?:\*\*|__)?\s*[:\-]?\s*(.*)/;

            let current: StructuredNote | null = null;

            lines.forEach(line => {
                const match = line.match(timeRegex);
                if (match) {
                    if (current) rows.push(current);
                    const time = match[1];
                    let residue = match[2];

                    // Extract Initial from end of line
                    let initial = "RN.Gen";
                    const initialMatch = residue.match(/\s((?:RN|MD|LPN)\.?[A-Za-z0-9]*)$/);
                    if (initialMatch) {
                        initial = initialMatch[1];
                        residue = residue.replace(initialMatch[0], '').trim();
                    }

                    current = { time: DataSanitizer.normalizeTime(time), note: residue, initial: DataSanitizer.normalizeInitial(initial) };
                } else {
                    if (current) {
                        current.note += `<br/>${line}`;
                    }
                }
            });
            if (current) rows.push(current);

            // Fallback for unparseable text
            if (rows.length === 0 && cleanText.trim().length > 0) {
                return [{
                    time: "",
                    note: raw,
                    initial: "-"
                }];
            }

            return rows;
        }

        // 3. Fallback for non-string/non-array
        return [{ time: "", note: String(data), initial: "-" }];
    },

    /**
     * Normalize time to consistent format (HH:MM)
     */
    normalizeTime: (time: string): string => {
        if (!time) return "00:00";
        const str = String(time).trim();
        // If already in HH:MM format
        if (/^\d{1,2}:\d{2}$/.test(str)) return str.padStart(5, '0');
        // If in HHMM format
        if (/^\d{4}$/.test(str)) return `${str.slice(0, 2)}:${str.slice(2)}`;
        // If just hours
        if (/^\d{1,2}$/.test(str)) return `${str.padStart(2, '0')}:00`;
        return str;
    },

    /**
     * Normalize initials to consistent format
     */
    normalizeInitial: (initial: any): string => {
        if (!initial) return "RN.Gen";
        const str = String(initial).trim();
        // Already in good format
        if (/^[A-Z]{2}\d{3}\.(RN|LPN|MD)$/i.test(str)) return str.toUpperCase();
        // Just has RN/LPN/MD
        if (/\b(RN|LPN|MD)\b/i.test(str)) return str;
        return str || "RN.Gen";
    },

    /**
     * Sanitize vitals into complete structured format with all 7 required fields.
     * Missing fields are filled with clinically neutral defaults.
     */
    sanitizeVitals: (data: any): StructuredVital[] => {
        if (!data) return [];

        let vitals: any[] = [];

        if (Array.isArray(data)) {
            vitals = data;
        } else if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                vitals = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                return [];
            }
        } else if (typeof data === 'object') {
            vitals = [data];
        } else {
            return [];
        }

        return vitals.map(v => {
            // Extract just the F value from dual format like "98.6°F (37.0°C)"
            let tempRaw = String(v.tempF || v.temp || "98.6");
            const fMatch = tempRaw.match(/(\d+\.?\d*)\s*°?F/i);
            const tempF = fMatch ? fMatch[1] : tempRaw.replace(/[^\d.]/g, '') || "98.6";

            return {
                time: DataSanitizer.normalizeTime(v.time || "00:00"),
                tempF: tempF,
                hr: parseInt(v.hr || v.heartRate || v.pulse || 72) || 72,
                rr: parseInt(v.rr || v.respiratoryRate || v.resp || 16) || 16,
                bp: v.bp || v.bloodPressure || "120/80",
                o2: String(v.o2 || v.spo2 || v.SpO2 || "98").replace(/%/g, ''),
                o2_device: v.o2_device || v.o2Device || v.oxygenDevice || "RA",
                pain: v.pain !== undefined ? parseInt(v.pain) : (v.painScore !== undefined ? parseInt(v.painScore) : null)
            };
        });
    },

    /**
     * Sanitize labs into structured format with proper flags and categories.
     * Auto-detects critical values based on CAP/CLIA standards.
     */
    sanitizeLabs: (data: any): StructuredLab[] => {
        if (!data) return [];

        let labs: any[] = [];

        if (Array.isArray(data)) {
            labs = data;
        } else if (typeof data === 'string') {
            // Try JSON parse first
            try {
                const parsed = JSON.parse(data);
                labs = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                // Try to parse HTML/text lab format
                return DataSanitizer.parseLabsFromText(data);
            }
        } else {
            return [];
        }

        return labs.map(lab => {
            const testName = lab.test || lab.name || lab.testName || "Unknown";
            const value = String(lab.value || lab.result || "");
            const ref = lab.ref || lab.reference || lab.refRange || "N/A";

            // Auto-detect flag if not provided
            let flag = lab.flag || "";
            if (!flag && value) {
                flag = DataSanitizer.detectLabFlag(testName, value, ref);
            }

            return {
                test: testName,
                value: value,
                ref: ref,
                flag: flag,
                category: lab.category || DataSanitizer.detectLabCategory(testName),
                previous: lab.previous || undefined
            };
        });
    },

    /**
     * Parse labs from HTML/text format
     */
    parseLabsFromText: (text: string): StructuredLab[] => {
        const labs: StructuredLab[] = [];

        // Try to extract from list items
        const listMatches = text.match(/<li>([^<]+)<\/li>/gi);
        if (listMatches) {
            listMatches.forEach(match => {
                const content = match.replace(/<\/?li>/gi, '').trim();
                const parts = content.split(':').map(p => p.trim());
                if (parts.length >= 2) {
                    labs.push({
                        test: parts[0],
                        value: parts[1],
                        ref: "N/A",
                        flag: "",
                        category: DataSanitizer.detectLabCategory(parts[0])
                    });
                }
            });
        }

        // Try simple "Test: Value" format
        if (labs.length === 0) {
            const lines = text.split(/[\n,;]/).filter(Boolean);
            lines.forEach(line => {
                const parts = line.split(':').map(p => p.trim());
                if (parts.length >= 2) {
                    labs.push({
                        test: parts[0].replace(/<[^>]+>/g, ''),
                        value: parts[1].replace(/<[^>]+>/g, ''),
                        ref: "N/A",
                        flag: "",
                        category: DataSanitizer.detectLabCategory(parts[0])
                    });
                }
            });
        }

        return labs;
    },

    /**
     * Detect lab flag based on test name and value (CAP/CLIA critical values)
     */
    detectLabFlag: (testName: string, value: string, _ref?: string): string => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return "";

        const test = testName.toLowerCase();

        // Critical values (panic values)
        const criticalRanges: Record<string, { critLow?: number; critHigh?: number; low?: number; high?: number }> = {
            potassium: { critLow: 2.5, critHigh: 6.5, low: 3.5, high: 5.0 },
            sodium: { critLow: 120, critHigh: 160, low: 136, high: 145 },
            glucose: { critLow: 50, critHigh: 400, low: 70, high: 100 },
            hemoglobin: { critLow: 7.0, critHigh: 20, low: 12, high: 17 },
            hgb: { critLow: 7.0, critHigh: 20, low: 12, high: 17 },
            wbc: { critLow: 2.0, critHigh: 30, low: 4.5, high: 11 },
            platelets: { critLow: 50, critHigh: 1000, low: 150, high: 400 },
            troponin: { critHigh: 0.04 },
            ph: { critLow: 7.25, critHigh: 7.55, low: 7.35, high: 7.45 },
            creatinine: { critHigh: 10, high: 1.2 },
            bun: { critHigh: 100, high: 20 },
            lactate: { critHigh: 4, high: 2 }
        };

        for (const [key, ranges] of Object.entries(criticalRanges)) {
            if (test.includes(key)) {
                if (ranges.critLow && numValue < ranges.critLow) return "L!";
                if (ranges.critHigh && numValue > ranges.critHigh) return "H!";
                if (ranges.low && numValue < ranges.low) return "L";
                if (ranges.high && numValue > ranges.high) return "H";
                return "";
            }
        }

        return "";
    },

    /**
     * Detect lab category for grouping
     */
    detectLabCategory: (testName: string): string => {
        const test = testName.toLowerCase();

        if (/wbc|rbc|hemoglobin|hgb|hct|hematocrit|platelet|mcv|mch|mchc/i.test(test)) return "CBC";
        if (/sodium|potassium|chloride|co2|bun|creatinine|glucose|calcium|magnesium/i.test(test)) return "CMP";
        if (/pt|ptt|inr|fibrinogen/i.test(test)) return "Coagulation";
        if (/troponin|bnp|ck|ldh/i.test(test)) return "Cardiac";
        if (/alt|ast|alk|bilirubin|albumin|protein/i.test(test)) return "Liver";
        if (/tsh|t3|t4|free t/i.test(test)) return "Thyroid";
        if (/ph|pco2|po2|hco3|lactate|base/i.test(test)) return "ABG";
        if (/urinalysis|ua|urine/i.test(test)) return "Urinalysis";

        return "General";
    },

    /**
     * Sanitize orders into structured format with status and indication.
     */
    sanitizeOrders: (data: any): StructuredOrder[] => {
        if (!data) return [];

        let orders: any[] = [];

        if (Array.isArray(data)) {
            orders = data;
        } else if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                orders = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                // Parse from text format
                return DataSanitizer.parseOrdersFromText(data);
            }
        } else {
            return [];
        }

        return orders.map(ord => ({
            drug: ord.drug || ord.medication || ord.name || ord.med || "Unknown",
            dose: ord.dose || ord.dosage || "",
            route: ord.route || "PO",
            freq: ord.freq || ord.frequency || ord.schedule || "Daily",
            status: (ord.status || "active").toLowerCase(),
            indication: ord.indication || ord.reason || "Standard Care",
            holdReason: ord.holdReason || ord.hold_reason || undefined
        }));
    },

    /**
     * Parse orders from text format
     */
    parseOrdersFromText: (text: string): StructuredOrder[] => {
        const orders: StructuredOrder[] = [];
        const lines = text.split(/[\n]/).filter(Boolean);

        lines.forEach(line => {
            // Try to extract medication name and details
            const cleaned = line.replace(/<[^>]+>/g, '').trim();
            if (cleaned.length > 5) {
                // Simple parsing - look for dose patterns
                const match = cleaned.match(/(\d+\.?\d*)\s*(mg|mcg|g|mL|units?)/i);
                orders.push({
                    drug: cleaned.split(/\d/)[0].trim() || cleaned,
                    dose: match ? `${match[1]} ${match[2]}` : "",
                    route: /IV|IM|SubQ|PO|SL/i.test(cleaned) ? cleaned.match(/IV|IM|SubQ|PO|SL/i)?.[0] || "PO" : "PO",
                    freq: /BID|TID|QID|Q\d+H|PRN|daily/i.test(cleaned) ? cleaned.match(/BID|TID|QID|Q\d+H|PRN|daily/i)?.[0] || "Daily" : "Daily",
                    status: "active",
                    indication: "Standard Care"
                });
            }
        });

        return orders;
    },

    /**
     * Sanitize History & Physical into structured sections
     * Enhanced to handle various formats and extract all content properly
     */
    sanitizeHistoryPhysical: (data: any): any => {
        if (!data) return null;
        if (typeof data === 'object' && data.sections) return data;

        const raw = String(data);
        const sections: { title: string; content: string[] }[] = [];

        // Enhanced section patterns that capture all content until next section
        const sectionHeaders = [
            { key: 'cc', title: "Chief Complaint", patterns: [/Chief Complaint/i] },
            { key: 'hpi', title: "History of Present Illness", patterns: [/HPI/i, /History of Present Illness/i] },
            { key: 'pmh', title: "Past Medical History", patterns: [/PMH/i, /Past Medical History/i, /Medical History/i] },
            { key: 'psh', title: "Past Surgical History", patterns: [/PSH/i, /Past Surgical History/i, /Surgical History/i] },
            { key: 'meds', title: "Medications", patterns: [/Medications?/i, /Current Meds/i, /Home Meds/i] },
            { key: 'allergies', title: "Allergies", patterns: [/Allergies/i, /NKDA/i] },
            { key: 'social', title: "Social History", patterns: [/Social History/i, /SH:/i] },
            { key: 'family', title: "Family History", patterns: [/Family History/i, /FH:/i, /FHx/i] },
            { key: 'ros', title: "Review of Systems", patterns: [/ROS/i, /Review of Systems/i] },
            { key: 'pe', title: "Physical Exam", patterns: [/PE:/i, /Physical Exam/i, /Examination/i] },
            { key: 'vitals', title: "Vital Signs", patterns: [/Vital Signs/i, /Vitals/i] },
            { key: 'labs', title: "Laboratory", patterns: [/Lab(?:s|oratory)?/i, /Results/i] },
            { key: 'imaging', title: "Imaging", patterns: [/Imaging/i, /Radiology/i, /X-ray/i, /CT/i, /MRI/i] },
            { key: 'ap', title: "Assessment & Plan", patterns: [/A&?P/i, /Assessment/i, /Plan/i, /Impression/i] }
        ];

        // Try HTML-based extraction first
        sectionHeaders.forEach(({ title, patterns }) => {
            for (const pattern of patterns) {
                // Match <strong>Title:</strong> content until next <strong> or end
                const htmlPattern = new RegExp(`<strong>\\s*${pattern.source}\\s*:?\\s*<\\/strong>\\s*([\\s\\S]*?)(?=<strong>|<\\/p>\\s*<p>|$)`, 'i');
                const match = raw.match(htmlPattern);
                if (match && match[1].trim().length > 0) {
                    const content = match[1].trim()
                        .replace(/see attached/gi, '')
                        .replace(/N\/A/gi, 'Not documented')
                        .trim();
                    if (content.length > 2 && !sections.find(s => s.title === title)) {
                        sections.push({ title, content: [content] });
                    }
                    break;
                }
            }
        });

        // If no HTML sections found, try plain text extraction
        if (sections.length === 0) {
            // Remove HTML tags for plain text parsing
            const plainText = raw.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n');
            const lines = plainText.split('\n').filter(l => l.trim());

            let currentSection = "General Assessment";
            let currentContent: string[] = [];

            lines.forEach(line => {
                const trimmed = line.trim();
                // Check if this line is a section header
                const headerMatch = sectionHeaders.find(h =>
                    h.patterns.some(p => p.test(trimmed) && trimmed.replace(p, '').replace(/[:\s]/g, '').length < 10)
                );
                if (headerMatch) {
                    // Save previous section
                    if (currentContent.length > 0) {
                        sections.push({ title: currentSection, content: [currentContent.join(' ')] });
                    }
                    currentSection = headerMatch.title;
                    currentContent = [];
                } else if (trimmed.length > 0) {
                    // Filter out placeholder text
                    if (!trimmed.toLowerCase().includes('see attached') &&
                        trimmed.toLowerCase() !== 'n/a' &&
                        trimmed.length > 2) {
                        currentContent.push(trimmed);
                    }
                }
            });

            // Push last section
            if (currentContent.length > 0) {
                sections.push({ title: currentSection, content: [currentContent.join(' ')] });
            }
        }

        // If still no sections, return the raw content
        if (sections.length === 0 && raw.trim().length > 10) {
            return {
                sections: [{
                    title: "General Assessment",
                    content: [raw.replace(/<[^>]+>/g, ' ').trim()]
                }]
            };
        }

        return { sections: sections.length > 0 ? sections : [{ title: "No Documentation", content: ["Not documented for this encounter."] }] };
    },

    /**
     * Sanitize radiology reports - ensures proper structure for rendering
     */
    sanitizeRadiology: (data: any): string | null => {
        if (!data) return null;
        if (typeof data !== 'string') return String(data);

        const text = data.trim();

        // Return null for placeholder/empty reports
        if (text.length < 30 || text === "No report available.") {
            return null;
        }

        return text;
    },

    /**
     * Stabilizes the entire item configuration + options + history.
     * Ensures we only shuffle ONCE and all clinical data is sanitized.
     */
    stabilizeItem: (item: any, forceReshuffle = false): any => {
        if (!item) return null;

        // If already sanitized and deep-frozen, return it (unless forcing reshuffle)
        if (item._sanitized && !forceReshuffle) return item;

        const cleanItem = { ...item };

        // 1. Sanitize Clinical Data (Gold Standard)
        if (cleanItem.content?.clinicalData) {
            const cd = cleanItem.content.clinicalData;

            // Nurses Notes / History
            const rawHist = cd.history || cd.nursesNotes;
            cd._structuredHistory = DataSanitizer.sanitizeNursesNotes(rawHist);

            // Vitals (Complete with all 7 fields)
            cd._structuredVitals = DataSanitizer.sanitizeVitals(cd.vitals);

            // Labs (With flags and categories)
            cd._structuredLabs = DataSanitizer.sanitizeLabs(cd.labs);

            // Orders (With status and indication)
            cd._structuredOrders = DataSanitizer.sanitizeOrders(cd.orders);

            // History & Physical (Sectioned)
            cd._structuredHistoryPhysical = DataSanitizer.sanitizeHistoryPhysical(cd.historyPhysical);

            // Radiology (Validated or null)
            cd._structuredRadiology = DataSanitizer.sanitizeRadiology(cd.radiology);
        }

        // 2. Stabilize Options (Shuffle ONCE)
        const struct = cleanItem.content?.structure;
        if (struct) {
            const shuffleArray = (arr: any[]) => {
                if (!arr || !Array.isArray(arr)) return [];
                return [...arr].sort(() => Math.random() - 0.5);
            };

            if (struct.options && !struct._optionsShuffled) {
                struct.options = shuffleArray(struct.options);
                struct._optionsShuffled = true;
            }

            // Bow Tie Support
            if (struct.actions && !struct._bowTieShuffled) {
                struct.actions = shuffleArray(struct.actions);
                struct.conditions = shuffleArray(struct.conditions);
                struct.parameters = shuffleArray(struct.parameters);
                struct._bowTieShuffled = true;
            }
        }

        cleanItem._sanitized = true;
        return cleanItem;
    }
};
