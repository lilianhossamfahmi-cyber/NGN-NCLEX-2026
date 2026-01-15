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
            // FIX: Golden Prompt uses 'order' field for the full order text
            drug: ord.drug || ord.medication || ord.name || ord.med || ord.order || "Unknown",
            dose: ord.dose || ord.dosage || "",
            route: ord.route || "PO",
            freq: ord.freq || ord.frequency || ord.schedule || "Daily",
            status: (ord.status || "active").toLowerCase(),
            indication: ord.indication || ord.reason || (ord.orderedBy ? `Ordered by: ${ord.orderedBy}` : "Standard Care"),
            holdReason: ord.holdReason || ord.hold_reason || undefined,
            // Preserve additional Golden fields
            time: ord.time,
            orderedBy: ord.orderedBy
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

        // FIX: Handle Golden Prompt format with direct properties
        if (typeof data === 'object' && (data.chiefComplaint || data.hpi || data.pmh || data.physicalExam)) {
            const sections: { title: string; content: string[] }[] = [];

            // Helper to format value (handle strings, arrays, objects)
            const formatValue = (val: any): string => {
                if (!val) return '';
                if (typeof val === 'string') return val;
                if (Array.isArray(val)) return val.join(', ');
                if (typeof val === 'object') {
                    // Convert object keys/values to readable text
                    return Object.entries(val)
                        .map(([k, v]) => `<strong>${k}:</strong> ${typeof v === 'string' ? v : JSON.stringify(v)}`)
                        .join('<br/>');
                }
                return String(val);
            };

            // Map Golden Prompt fields to sections
            if (data.chiefComplaint) sections.push({ title: 'Chief Complaint', content: [formatValue(data.chiefComplaint)] });
            if (data.hpi) sections.push({ title: 'History of Present Illness', content: [formatValue(data.hpi)] });
            if (data.pmh) sections.push({ title: 'Past Medical History', content: [formatValue(data.pmh)] });
            if (data.psh) sections.push({ title: 'Past Surgical History', content: [formatValue(data.psh)] });
            if (data.medications) sections.push({ title: 'Medications', content: [formatValue(data.medications)] });
            if (data.allergies) sections.push({ title: 'Allergies', content: [formatValue(data.allergies)] });
            if (data.socialHistory) sections.push({ title: 'Social History', content: [formatValue(data.socialHistory)] });
            if (data.familyHistory) sections.push({ title: 'Family History', content: [formatValue(data.familyHistory)] });
            if (data.reviewOfSystems) sections.push({ title: 'Review of Systems', content: [formatValue(data.reviewOfSystems)] });
            if (data.physicalExam) sections.push({ title: 'Physical Exam', content: [formatValue(data.physicalExam)] });

            // Return structured format if we found any sections
            if (sections.length > 0) {
                return { sections };
            }
        }

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
     * Sanitize Rationale - Ensures V2 Schema compliance
     * Injects default difficulty object if missing (fixes Legacy/Mock bugs)
     */
    sanitizeRationale: (rat: any): any => {
        const DEFAULT_DIFFICULTY = {
            score: 50,
            level: 3,
            label: "Application",
            clinicalStrategy: "Standard clinical reasoning applies.",
            recommendedActions: ["Review core concepts"]
        };

        if (!rat) return {
            coreConcept: "Clinical Judgment",
            caseSummary: "Generated Clinical Scenario",
            answerAnalysis: "Detailed analysis pending.",
            trap: "N/A",
            goldenRule: "Assess before action.",
            steps: [],
            difficulty: DEFAULT_DIFFICULTY
        };

        // If exists but missing difficulty logic
        if (!rat.difficulty) {
            rat.difficulty = DEFAULT_DIFFICULTY;
        }

        return rat;
    },

    /**
     * Enriches rationale with smart clinical defaults based on focus area.
     * Ensures Knowledge and Strategy tabs always have content.
     */
    enrichRationale: (rationale: any, clinicalFocus?: string, cjmmStep?: string): any => {
        const focus = clinicalFocus || 'Clinical Assessment';
        const r = rationale || {};

        // Smart defaults based on clinical focus keywords
        const KNOWLEDGE_DEFAULTS: Record<string, { anatomy: string; physiology: string; pharm: string }> = {
            'depression': {
                anatomy: 'Limbic system including hippocampus, amygdala, and prefrontal cortex regulate mood and emotional processing.',
                physiology: 'Neurotransmitter imbalances (serotonin, norepinephrine, dopamine) affect mood regulation. HPA axis dysregulation contributes to stress response.',
                pharm: 'SSRIs (e.g., sertraline) increase serotonin availability. MAOIs require dietary restrictions. Onset of action typically 2-4 weeks.'
            },
            'cardiac': {
                anatomy: 'Four-chambered heart with SA node, AV node, Bundle of His, and Purkinje fibers for electrical conduction.',
                physiology: 'Frank-Starling mechanism regulates cardiac output. Preload, afterload, and contractility determine stroke volume.',
                pharm: 'Beta-blockers reduce heart rate and contractility. ACE inhibitors reduce preload and afterload. Digoxin increases contractility.'
            },
            'respiratory': {
                anatomy: 'Upper and lower airways, alveoli for gas exchange, diaphragm and intercostal muscles for breathing mechanics.',
                physiology: 'Ventilation-perfusion matching optimizes oxygen delivery. CO2 diffuses 20x faster than oxygen.',
                pharm: 'Beta-2 agonists (albuterol) cause bronchodilation. Corticosteroids reduce airway inflammation. Anticholinergics reduce secretions.'
            },
            'sepsis': {
                anatomy: 'Vascular system including capillary beds where inflammatory mediators cause increased permeability.',
                physiology: 'Systemic inflammatory response leads to vasodilation, capillary leak, and tissue hypoperfusion. Lactate accumulates with anaerobic metabolism.',
                pharm: 'Broad-spectrum antibiotics within 1 hour of recognition. Vasopressors (norepinephrine) for refractory hypotension. Crystalloid fluids for resuscitation.'
            },
            'mental health': {
                anatomy: 'Brain structures including prefrontal cortex (executive function), limbic system (emotions), and neurotransmitter pathways.',
                physiology: 'Serotonin, dopamine, and norepinephrine regulate mood, motivation, and stress response. HPA axis mediates stress hormones.',
                pharm: 'SSRIs for depression/anxiety, antipsychotics for psychosis, benzodiazepines for acute anxiety (short-term only).'
            },
            'default': {
                anatomy: 'Review the relevant anatomical structures affected by this clinical presentation.',
                physiology: 'Consider the physiological mechanisms and compensatory responses involved in this condition.',
                pharm: 'Identify the pharmacological interventions and their mechanisms of action for this clinical scenario.'
            }
        };

        // Helper: Check if content is generic placeholder (should be replaced)
        const isGenericPlaceholder = (text: string | undefined): boolean => {
            if (!text) return true;
            const genericPhrases = [
                'review the relevant',
                'consider the',
                'identify the',
                'relevant anatomy',
                'relevant physiology',
                'relevant pharmacology',
                'appropriate interventions',
                'see above',
                'n/a'
            ];
            const lower = text.toLowerCase();
            return genericPhrases.some(phrase => lower.includes(phrase)) || text.length < 30;
        };

        // Find best match for focus
        const focusLower = focus.toLowerCase();
        const key = Object.keys(KNOWLEDGE_DEFAULTS).find(k => focusLower.includes(k)) || 'default';
        const defaults = KNOWLEDGE_DEFAULTS[key];

        // Build enriched rationale
        return {
            coreConcept: r.coreConcept || `Understanding ${focus} requires systematic clinical reasoning and evidence-based decision making.`,
            caseSummary: r.caseSummary || `This case presents a clinical scenario requiring ${cjmmStep || 'clinical judgment'} skills.`,
            answerAnalysis: r.answerAnalysis || 'Analyze each option based on clinical evidence and patient-specific factors.',
            trap: r.trap || 'Common mistake: Overlooking subtle but critical findings or selecting an intervention without proper assessment.',
            goldenRule: r.goldenRule || 'Always prioritize patient safety and use clinical judgment based on the complete clinical picture.',
            pitfalls: r.pitfalls || [r.trap || 'Rushing to intervention without complete assessment'],
            steps: r.steps?.length > 0 ? r.steps : [
                { tag: 'Recognize', description: `Identify abnormal findings related to ${focus}` },
                { tag: 'Analyze', description: 'Connect findings to underlying pathophysiology and prioritize concerns' },
                { tag: 'Prioritize', description: 'Rank interventions by urgency using ABC and Maslow\'s hierarchy' },
                { tag: 'Act', description: 'Implement evidence-based nursing actions within scope of practice' },
                { tag: 'Evaluate', description: 'Monitor response to interventions and reassess as needed' }
            ],
            mnemonic: r.mnemonic?.title ? r.mnemonic : {
                title: 'ADPIE',
                content: 'A-Assessment, D-Diagnosis, P-Planning, I-Implementation, E-Evaluation',
                explanation: 'The nursing process provides a systematic framework for clinical decision-making and ensures comprehensive patient care.'
            },
            cheatSheet: r.cheatSheet?.points?.length > 0 ? r.cheatSheet : {
                title: 'Clinical Pearls',
                points: [
                    'Assess before acting - complete data collection precedes intervention',
                    'Document all findings objectively and thoroughly',
                    'Communicate changes promptly using SBAR format',
                    'Follow up on interventions to evaluate effectiveness'
                ]
            },
            referenceInfo: {
                // Only use AI content if it's NOT a generic placeholder - otherwise use topic defaults
                anatomy: (!isGenericPlaceholder(r.referenceInfo?.anatomy)) ? r.referenceInfo.anatomy : defaults.anatomy,
                physiology: (!isGenericPlaceholder(r.referenceInfo?.physiology)) ? r.referenceInfo.physiology : defaults.physiology,
                pharm: (!isGenericPlaceholder(r.referenceInfo?.pharm)) ? r.referenceInfo.pharm : defaults.pharm
            },
            difficulty: r.difficulty || {
                score: 75,
                level: 3,
                label: 'Medium',
                clinicalStrategy: 'Apply systematic clinical reasoning using the nursing process.',
                recommendedActions: ['Review case data thoroughly', 'Identify priority concerns', 'Select evidence-based interventions']
            }
        };
    },

    /**
     * Normalizes Golden Prompt v3 JSON structure to internal viewer format.
     * Maps:
     *   - content.patient -> content.clinicalData.patientInfo
     *   - content.vitals -> content.clinicalData.vitals
     *   - content.assessmentData -> content.clinicalData.assessmentData
     *   - structure.screens -> content.structure.screens
     *   - content.chiefComplaint -> content.clinicalData.history
     *   - content.rationale -> content.rationale
     */
    normalizeGoldenPromptFormat: (item: any): void => {
        if (!item) return;
        if (!item.content) item.content = {};

        const c = item.content;

        // Detect Golden Prompt v3 format: has `content.patient` or root `structure.screens`
        const isGoldenV3 = c.patient || (item.structure?.screens && !c.structure?.screens);

        if (!isGoldenV3) return; // Already in internal format

        // 1. Initialize clinicalData if missing
        if (!c.clinicalData) c.clinicalData = {};
        const cd = c.clinicalData;

        // 2. Map patient -> patientInfo
        if (c.patient && !cd.patientInfo) {
            const p = c.patient;
            cd.patientInfo = {
                name: p.name || "Client, Generic",
                age: p.age || 35,
                gender: p.sex === 'Female' ? 'F' : (p.sex === 'Male' ? 'M' : (p.sex || 'M')),
                codeStatus: "FULL CODE",
                admissionDate: new Date().toLocaleDateString() + " 07:30",
                room: c.setting?.includes('ED') ? 'ED-04' : 'MedSurg-12',
                physician: "Dr. S. Specialist",
                nurse: "RN Staff",
                allergies: p.allergies || "NKDA",
                isolation: "Standard Precautions",
                // Extended patient data
                weightKg: p.weightKg,
                history: Array.isArray(p.history) ? p.history : [],
                homeMeds: Array.isArray(p.homeMeds) ? p.homeMeds : []
            };
        }

        // 3. Map vitals
        if (c.vitals && !cd.vitals) {
            cd.vitals = Array.isArray(c.vitals) ? c.vitals : [c.vitals];
        }

        // 3b. Map labs
        if (c.labs && !cd.labs) {
            cd.labs = Array.isArray(c.labs) ? c.labs : [c.labs];
        }

        // 3c. Map setting
        if (c.setting && !cd.setting) {
            cd.setting = c.setting;
        }

        // 3d. Map orders (medical orders)
        if ((c.orders || c.medicalOrders) && !cd.orders) {
            const ordersData = c.orders || c.medicalOrders || [];
            cd.orders = Array.isArray(ordersData) ? ordersData : [ordersData];
        }

        // 3e. Map historyPhysical (History & Physical)
        if (c.historyPhysical && !cd.historyPhysical) {
            cd.historyPhysical = c.historyPhysical;
        }

        // 3f. Map radiology
        if (c.radiology && !cd.radiology) {
            cd.radiology = Array.isArray(c.radiology) ? c.radiology : [c.radiology];
        }

        // 4. Map history/nursesNotes -> clinicalData.history
        // PRIORITY 1: Use AI-provided history/nursesNotes if available
        if (!cd.history) {
            if (c.history && typeof c.history === 'string') {
                // Already formatted HTML history
                cd.history = c.history;
            } else if (c.nursesNotes && Array.isArray(c.nursesNotes)) {
                // Convert array format to HTML
                const notesHtml = c.nursesNotes.map((note: any) => {
                    const time = note.time || '';
                    const author = note.author || 'RN';
                    const entry = note.entry || note.text || '';
                    return `<p><strong>${time} - ${author}:</strong> ${entry}</p>`;
                }).join('\n');
                cd.history = notesHtml;
            } else if (c.chiefComplaint) {
                // FALLBACK: Build from chiefComplaint + patient data
                const patient = c.patient || {};
                const assessmentData = c.assessmentData || {};

                // Build comprehensive nursing notes from available data
                let historyHtml = '';

                // Admission Assessment Header
                historyHtml += `<p><strong>ADMISSION ASSESSMENT</strong></p>`;

                // Chief Complaint
                historyHtml += `<p><strong>Chief Complaint:</strong> ${c.chiefComplaint}</p>`;

                // PMH
                if (patient.history && Array.isArray(patient.history) && patient.history.length > 0) {
                    historyHtml += `<p><strong>Past Medical History:</strong> ${patient.history.join(', ')}</p>`;
                }

                // Allergies
                if (patient.allergies) {
                    historyHtml += `<p><strong>Allergies:</strong> ${patient.allergies}</p>`;
                }

                // Home Meds - Put in a separate section, NOT as nursing notes
                // (They should go to Medications tab if available, or brief mention here)
                if (patient.homeMeds && Array.isArray(patient.homeMeds) && patient.homeMeds.length > 0) {
                    const medStrings = patient.homeMeds.map((m: any) =>
                        `${m.name} ${m.dose || ''} ${m.route || ''} ${m.frequency || ''}`
                    ).join('; ');
                    historyHtml += `<p><strong>Home Medications:</strong> ${medStrings}</p>`;
                }

                // Assessment Data (PHQ-9, Suicide Risk, etc.)
                if (assessmentData.screening) {
                    historyHtml += `<p><strong>${assessmentData.screening.tool || 'Screening'}:</strong> Score ${assessmentData.screening.score} - ${assessmentData.screening.interpretation}</p>`;
                }
                if (assessmentData.suicideRisk) {
                    const sr = assessmentData.suicideRisk;
                    historyHtml += `<p><strong>Suicide Risk Assessment:</strong> Ideation: ${sr.ideation || 'N/A'}, Plan: ${sr.plan || 'N/A'}, Intent: "${sr.intent || 'N/A'}", Means: ${sr.means || 'N/A'}</p>`;
                }

                cd.history = historyHtml;
            }
        }

        // 5. Map structure.screens -> content.structure.screens
        if (item.structure?.screens && !c.structure?.screens) {
            if (!c.structure) c.structure = {};
            c.structure.screens = item.structure.screens;
        }

        // 5b. Process each screen - add IDs, enrich rationale, preserve cjmmStep
        if (c.structure?.screens && Array.isArray(c.structure.screens)) {
            const clinicalFocus = c.chiefComplaint || c.metadata?.clinicalFocus || 'Clinical Assessment';

            c.structure.screens.forEach((screen: any, idx: number) => {
                // Ensure screen has an ID
                if (!screen.id) {
                    screen.id = `screen_${idx}_${Date.now().toString(36)}`;
                }

                // Preserve cjmmStep for Expert HUD CJMM Grid
                if (!screen.cjmmStep && screen.type) {
                    const cjmmMap: Record<string, string> = {
                        'highlight': 'Recognize Cues',
                        'matrix': 'Analyze Cues',
                        'ordered-response': 'Prioritize Hypotheses',
                        'bow-tie': 'Generate Solutions',
                        'drop-cloze': 'Take Action',
                        'multiple-response': 'Evaluate Outcomes',
                        'sata': 'Evaluate Outcomes'
                    };
                    screen.cjmmStep = cjmmMap[screen.type] || `Screen ${idx + 1}`;
                }

                // Enrich rationale with smart defaults
                screen.rationale = DataSanitizer.enrichRationale(
                    screen.rationale || {},
                    clinicalFocus,
                    screen.cjmmStep
                );
            });
        }

        // 6. Map content.rationale (use enricher to ensure proper structure)
        if (c.rationale) {
            c.rationale = DataSanitizer.enrichRationale(
                c.rationale,
                c.chiefComplaint || c.metadata?.clinicalFocus || 'Clinical Assessment'
            );
        } else {
            // Create global rationale if missing
            c.rationale = DataSanitizer.enrichRationale(
                {},
                c.chiefComplaint || c.metadata?.clinicalFocus || 'Clinical Assessment'
            );
        }

        // 7. Set type if missing (Case Study)
        if (!item.type && c.structure?.screens?.length > 0) {
            item.type = 'case-study';
        }

        // 8. Ensure Item has ID
        if (!item.id) {
            item.id = `golden_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }

        // 9. Set metadata from content.metadata if present
        if (c.metadata) {
            item.metadata = {
                ...item.metadata,
                generator: c.metadata.generator,
                clinicalFocus: c.metadata.clinicalFocus,
                difficultyLevel: c.metadata.level,
                targetScore: c.metadata.targetScore
            };
        }
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

        // ==== GOLDEN PROMPT V3 NORMALIZATION LAYER ====
        // Converts Golden Prompt structure to internal Viewer structure
        // This ensures AI-generated JSON is compatible with the StudentPreviewModal
        DataSanitizer.normalizeGoldenPromptFormat(cleanItem);

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

        // 1.5 Sanitize Rationale (Ensure UI Safety)
        if (cleanItem.content) {
            cleanItem.content.rationale = DataSanitizer.sanitizeRationale(cleanItem.content.rationale);
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
