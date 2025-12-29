/**
 * Temperature Unit Service
 * Recursively scans content to auto-detect and convert temperatures to standardized format: "X°F (Y°C)"
 */

const KEY_PATTERNS = [/temp/i, /vital/i, /fever/i];
const VALUE_PATTERN = /^(\d+(\.\d)?)\s*([°]?[FC]|degrees?\s*[FC])?$/i;

/**
 * Main recursive function to walk the object tree and convert temperatures.
 * Returns a new object with converted values, preserving all other data.
 */
export const autoConvertTemperatures = (content: any): any => {
    if (Array.isArray(content)) {
        return content.map(item => autoConvertTemperatures(item));
    }

    if (typeof content === 'object' && content !== null) {
        const newObj: any = {};
        for (const [key, value] of Object.entries(content)) {
            // Check if key is relevant and value is candidate string/number
            if (isTemperatureField(key) && (typeof value === 'string' || typeof value === 'number')) {
                const converted = processTemperatureValue(value);
                newObj[key] = converted || value; // Use converted or keep original if parse failed
            } else {
                newObj[key] = autoConvertTemperatures(value); // Recurse
            }
        }
        return newObj;
    }

    return content;
};

// --- HELPERS ---

const isTemperatureField = (key: string): boolean => {
    return KEY_PATTERNS.some(p => p.test(key));
};

const processTemperatureValue = (value: string | number): string | null => {
    let numVal: number;
    let unit: 'F' | 'C' = 'F'; // Default to F if ambiguous

    if (typeof value === 'number') {
        numVal = value;
    } else {
        const match = value.match(VALUE_PATTERN);
        if (!match) return null;
        numVal = parseFloat(match[1]);
        if (match[3] && match[3].toUpperCase().includes('C')) unit = 'C';
    }

    if (unit === 'F') {
        const c = convertFtoC(numVal);
        return formatTemperature(numVal, c);
    } else {
        const f = convertCtoF(numVal);
        return formatTemperature(f, numVal);
    }
};

export const convertFtoC = (f: number): number => {
    return Math.round(((f - 32) * 5 / 9) * 10) / 10;
};

export const convertCtoF = (c: number): number => {
    return Math.round(((c * 9 / 5) + 32) * 10) / 10;
};

export const formatTemperature = (f: number, c: number): string => {
    return `${f.toFixed(1)}°F (${c.toFixed(1)}°C)`;
};
