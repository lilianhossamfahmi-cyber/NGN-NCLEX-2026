# NGN CALCULATION: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a fully generated NGN Calculation item. Used for dosage calculations, IV rates, and conversions.

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-Calculation-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/calculation.ts` | Validates numeric constraints. |
| **Ingestion Logic** | `src/services/ingestion/ItemIngestionService.ts` | Parses units/labels. |

---

## 2. 🧠 METADATA (EXPERT HUD COMPLIANCE)
| Field | Requirement | Perfect Content Example |
|-------|-------------|-------------------------|
| **difficulty** | `number` (1-5) | `2` (Simple) or `4` (Complex/Weight-based) |
| **targetScore** | `number` | `80` |
| **clientNeeds** | `string` | `"Pharmacological and Parenteral Therapies"` |
| **cjmmStep** | `string` | `"Generate Solutions"` or `"Take Action"` |
| **topic** | `string` | `"Pediatric Weight-Based Dosing"` |

---

## 3. ❓ QUESTION STEM & MECHANICS

### The Stem (`prompt`)
**Requirement:** Must provide the prescription, the supply on hand, and the specific question (e.g. "How many mL...").
**Perfect Example:**
> "The provider orders Amoxicillin 250 mg PO every 8 hours. The pharmacy supplies Amoxicillin suspension 125 mg/5 mL. How many mL should the nurse administer per dose?"

### The Input Structure (`structure`)
**Strict Rule:** Must define the unit and correct value.

```json
"structure": {
  "inputLabel": "mL",
  "units": "mL",
  "correctValue": 10,
  "precision": 1 // (e.g. round to tenth, whole number)
}
```

---

## 4. 🏥 CLINICAL DATA (CONTEXT)
- **Orders:** Must explicitly state the *Written Order* (e.g. "Med X 50 mg").
- **Pharmacy Note/MAR:** Must explicitly state the *Supply* (e.g. "Bottle label reads 10 mg/mL").
- **Vitals/Weight:** **CRITICAL** for weight-based calc. If order is "5 mg/kg", Patient Weight MUST be in Vitals (e.g. `weightKg: 20`).

---

## 5. 🎓 RATIONALE
*The "Why" - Show the Math.*
| Key | Content Requirement |
|-----|---------------------|
| **general** | Formula used (e.g. "Desired / Have * Quantity"). |
| **pathophysiology** | Show the Step-by-Step math. `250 / 125 * 5 = 10`. |
| **safetyCheck** | Rounding rules (e.g. "Round to nearest tenth"). |
| **clinicalTakeaway** | Double check calculations for pediatrics. |

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] Correct Value matches the Math.
2. [ ] Units are clearly specified (mL, tabs, gtt/min).
3. [ ] Patient Weight is present (if weight-based).
4. [ ] Rationale writes out the full equation.
