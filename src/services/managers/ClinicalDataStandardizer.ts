
import { MasterQuestionItem } from '../../types/master-schema';

/**
 * THE CLINICAL DATA STANDARDIZER (CDS)
 * The "High Standards" Enforcer.
 * 
 * Responsibility: Ensure every item, regardless of type, has:
 * 1. Clean, normalized Vitals, Labs, and Orders.
 * 2. Proper Rationale structure (Clinical Logic, Strategy, Knowledge).
 * 3. Consistent Patient Demographics.
 */
export class ClinicalDataStandardizer {

    public static normalize(item: MasterQuestionItem): MasterQuestionItem {
        const copy = JSON.parse(JSON.stringify(item));

        // 1. Ensure Clinical Data Bucket Exists
        if (!copy.content) copy.content = {};
        if (!copy.content.clinicalData) copy.content.clinicalData = {};

        // 2. Standardize Patient Info
        copy.content.patient = this.normalizePatient(copy.content.patient || copy.content.demographics);

        // 3. Standardize Rationale (Golden Standard)
        copy.rationale = this.normalizeRationale(copy.rationale);

        // 4. Standardize Vitals (Unit safety)
        if (copy.content.vitalSigns) {
            copy.content.vitalSigns = this.normalizeVitals(copy.content.vitalSigns);
        }

        // 5. Standardize Orders (Status and Time)
        if (copy.content.orders) {
            copy.content.orders = this.normalizeOrders(copy.content.orders);
        }

        return copy;
    }

    private static normalizePatient(input: any): any {
        if (!input) return { age: 'Unknown', gender: 'Unknown', diagnosis: 'Pending' };

        return {
            age: input.age || 'Adult',
            gender: input.gender || input.sex || 'Unknown',
            diagnosis: input.diagnosis || input.condition || 'Under Evaluation',
            allergies: input.allergies || 'NKA',
            codeStatus: input.codeStatus || 'Full Code'
        };
    }

    /**
     * Enforces the 4-Pillar Rationale requested by the Expert User
     */
    private static normalizeRationale(input: any): any {
        // If it's just a string, we need to (eventually) explode it.
        // For now, we put the string into 'Clinical Logic' as a fallback.
        if (typeof input === 'string') {
            return {
                clinicalLogic: input,
                optionReview: "Pending detailed review.",
                strategy: "Assess then Act.",
                knowledge: "Review pathophysiology.",
                general: input // Backwards compatibility for UI
            };
        }

        if (!input) {
            return {
                clinicalLogic: "Rationale not provided.",
                optionReview: "",
                strategy: "",
                knowledge: "",
                general: "Rationale not provided."
            };
        }

        return {
            clinicalLogic: input.clinicalLogic || input.general || input.explanation || "Detailed logic pending.",
            optionReview: input.optionReview || "",
            strategy: input.strategy || input.strategies || "",
            knowledge: input.knowledge || input.keyConcepts || "",
            general: input.general || input.clinicalLogic || "" // Ensure UI compatibility
        };
    }

    private static normalizeVitals(vitals: any): any[] {
        const arr = Array.isArray(vitals) ? vitals : [vitals];
        return arr.map((v: any) => ({
            ...v,
            bp: v.bp ? String(v.bp).replace(/\s/g, '') : v.bp, // Remove spaces in BP "120 / 80" -> "120/80"
            tempF: v.tempF ? parseFloat(String(v.tempF)) : undefined,
            hr: v.hr ? parseInt(String(v.hr)) : undefined,
            rr: v.rr ? parseInt(String(v.rr)) : undefined,
            o2: v.o2 ? String(v.o2).replace(/%/g, '') + '%' : undefined // Ensure % sign
        }));
    }

    private static normalizeOrders(orders: any): any[] {
        const arr = Array.isArray(orders) ? orders : [orders];
        return arr.map((o: any) => ({
            ...o,
            status: ['active', 'pending', 'completed', 'discontinued'].includes((o.status || '').toLowerCase())
                ? o.status.toLowerCase()
                : 'active',
            order: o.order ? o.order.trim() : "Unspecified Order"
        }));
    }
}
