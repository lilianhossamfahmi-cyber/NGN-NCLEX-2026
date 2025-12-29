

export interface StructuredNote {
    time: string;
    note: string;
    initial: string;
}

export interface StructuredItem {
    id: string;
    type: string;
    conf: any;
    sanitized: boolean;
}

/**
 * The Sanitizer Layer
 * Responsible for taking ANY input (Garbage, Markdown, HTML, Partial JSON)
 * and converting it into perfect, render-ready structures.
 */
export const DataSanitizer = {

    /**
     * Converts raw Nurses Notes (String, HTML, or Array) into a strict 3-column structure.
     */
    sanitizeNursesNotes: (data: any): StructuredNote[] => {
        if (!data) return [];

        // 1. HAPPY PATH: Already a clean JSON Array
        if (Array.isArray(data)) {
            return data.map(item => ({
                // Ensure time is a string
                time: String(item.time || item[0] || "00:00"),
                // Ensure note handles objects or strings
                note: typeof item.note === 'string' ? item.note : (item.text || JSON.stringify(item)),
                // Default initial if missing
                initial: item.initial || "RN.Gen"
            }));
        }

        // 2. MESSY PATH: It's a string (HTML or Plain Text or JSON String)
        if (typeof data === 'string') {
            const raw = data.trim();

            // A. Try JSON Parse first (Common AI Edge Case)
            if ((raw.startsWith('[') || raw.startsWith('{'))) {
                try {
                    const parsed = JSON.parse(raw);
                    // If array, recurse to Step 1
                    if (Array.isArray(parsed)) {
                        return DataSanitizer.sanitizeNursesNotes(parsed);
                    }
                } catch (e) {
                    // Ignore, continue to text parsing
                }
            }

            const rows: StructuredNote[] = [];

            // B. Try to extract from HTML Table first (if it exists)
            // (Simplified Regex for <tr><td>... match)
            if (raw.includes('<tr')) {
                // This is hard to regex perfectly, so we might rely on the text parser fallback 
                // unless we want to use DOMParser (browser only).
                // For safety in SSR/mixed envs, let's try a clever "Split by Row" approach.
                const trs = raw.split(/<tr[^>]*>/i).slice(1);
                trs.forEach(tr => {
                    const tds = tr.split(/<td[^>]*>/i).slice(1).map(td => {
                        return td.replace(/<\/td>[\s\S]*/i, '').replace(/<[^>]+>/g, ' ').trim();
                    });
                    if (tds.length >= 2) {
                        rows.push({
                            time: tds[0] || "00:00",
                            note: tds[1] || "",
                            initial: tds[2] || "RN"
                        });
                    }
                });
                if (rows.length > 0) return rows;
            }

            // B. Text / Markdown Parser (The "Agreed Template" Enforcer)
            // Strategy: Split by "Time-like" patterns at the START of lines
            // "10:00 note..." or "**10:00** note..."

            // Normalize breaks to newlines
            const cleanText = raw.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
            const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

            const timeRegex = /^(?:\*\*|__)?(\d{4}|\d{1,2}:\d{2})(?:\*\*|__)?\s*[:|-]?\s*(.*)/;

            let current: StructuredNote | null = null;

            lines.forEach(line => {
                const match = line.match(timeRegex);
                if (match) {
                    // Save previous
                    if (current) rows.push(current);

                    // Start New
                    const time = match[1];
                    let residue = match[2];

                    // Attempt to extract Initial from end of line (e.g. "RN.J88")
                    // Look for "RN.XXX" or just initials at end
                    let initial = "RN.Gen";
                    const initialMatch = residue.match(/\s((?:RN|MD|LPN)\.?[A-Za-z0-9]*)$/);
                    if (initialMatch) {
                        initial = initialMatch[1];
                        residue = residue.replace(initialMatch[0], '').trim();
                    }

                    current = { time, note: residue, initial };
                } else {
                    // Append to previous note
                    if (current) {
                        current.note += `<br/>${line}`;
                    }
                }
            });
            // Push last
            if (current) rows.push(current);

            // CRITICAL FIX: If strict parsing found nothing (e.g. it's just a paragraph of text),
            // fallback to showing the whole text as one "General Note"
            if (rows.length === 0 && cleanText.trim().length > 0) {
                return [{
                    time: "", // Empty time for general notes
                    note: raw,
                    initial: "-"
                }];
            }

            return rows;
        }

        // 3. Fallback for non-string/non-array
        return [{ time: "", note: String(data), initial: "-" }];
    },

    sanitizeVitals: (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return []; }
        }
        return [];
    },

    sanitizeLabs: (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return []; } // TODO: Add HTML parser if needed
        }
        return [];
    },

    sanitizeOrders: (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return []; }
        }
        return [];
    },

    sanitizeHistoryPhysical: (data: any): any => {
        // Fallback for H&P: return simple structure for the renderer
        if (!data) return null;
        if (typeof data === 'object' && data.sections) return data; // Already structured

        // If string (HTML), try to split by sections or return single block
        const raw = String(data);
        return {
            sections: [{
                title: "General Assessment",
                content: [raw] // Return raw HTML as one chunk for now
            }]
        };
    },

    /**
     * Stablizes the entire item configuration + options + history
     * Ensures we only shuffle ONCE.
     */
    stabilizeItem: (item: any, forceReshuffle = false): any => {
        if (!item) return null; // Logic continues...

        // If already sanitized and deep-frozen, return it (unless forcing reshuffle)
        if (item._sanitized && !forceReshuffle) return item;

        const cleanItem = { ...item };

        // 1. Sanitize History / Clinical Data
        if (cleanItem.content?.clinicalData) {
            const rawHist = cleanItem.content.clinicalData.history;
            const rawNotes = cleanItem.content.clinicalData.nursesNotes; // Some old items might use this key
            const combined = rawHist || rawNotes;

            cleanItem.content.clinicalData._structuredHistory = DataSanitizer.sanitizeNursesNotes(combined);

            cleanItem.content.clinicalData._structuredVitals = DataSanitizer.sanitizeVitals(cleanItem.content.clinicalData.vitals);
            cleanItem.content.clinicalData._structuredLabs = DataSanitizer.sanitizeLabs(cleanItem.content.clinicalData.labs);
            cleanItem.content.clinicalData._structuredOrders = DataSanitizer.sanitizeOrders(cleanItem.content.clinicalData.orders);
            cleanItem.content.clinicalData._structuredHistoryPhysical = DataSanitizer.sanitizeHistoryPhysical(cleanItem.content.clinicalData.historyPhysical);
        }

        // 2. Stabilize Options (Shuffle ONCE)
        // Check content.structure.options (Single/Multi) or actions/conditions/params (BowTie)
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
