# NGN Knowledge (Reference Info) Standards (v3.2)

> **ACTIVE SOURCE OF TRUTH**
> Effective Date: 2026-01-14
> **CRITICAL RULE:** The "Knowledge" tab must provide **Case-Specific Deep Dives**. Generic topic headers are FORBIDDEN.

---

## ⛔ The Problem (Unacceptable Generic Content)
Do not populate these fields with broad category names.
*   ❌ **Anatomy:** "Gastrointestinal System"
*   ❌ **Physiology:** "Fluid Balance"
*   ❌ **Pharm:** "Diuretics"

**This provides ZERO educational value.**

---

## ✅ The Gold Standard (Case-Specific Mechanisms)
The content MUST explain the specific mechanism *occurring in this patient scenario*.

### 1. Anatomy
Describe the specific structures *affected by the pathology*.
*   **Example (CHF):** "Left ventricular hypertrophy decreases chamber volume and compliance. Backflow pressure engorges the pulmonary veins, leading to alveolar edema."
*   **Example (Stroke):** "Occlusion of the Middle Cerebral Artery (MCA) deprives the motor cortex of oxygen, causing contralateral hemiparesis."

### 2. Physiology (Pathophysiology)
Describe the *mechanism* driving the symptoms.
*   **Example (DKA):** "Absolute insulin deficiency prevents cellular glucose uptake. The liver switches to lipolysis, releasing ketones (beta-hydroxybutyrate). Accumulation of ketones causes anion-gap metabolic acidosis (pH < 7.35)."
*   **Example (Asthma):** "Inflammatory mediators (histamine, leukotrienes) cause bronchoconstriction and mucus hypersecretion, narrowing the airway radius and increasing resistance (Air Trapping)."

### 3. Pharmacology
Describe the *mechanism of action* relative to the condition.
*   **Example (Lisinopril):** "ACE Inhibitor. Blocks conversion of Angiotensin I to II. This prevents vasoconstriction (lowering SVR) and inhibits aldosterone release (reducing Na/Water retention)."
*   **Example (Albuterol):** "Beta-2 Agonist. Stimulates receptors on bronchial smooth muscle, increasing cAMP and causing rapid smooth muscle relaxation (Bronchodilation)."

---

## 📝 Schema Requirement
**Location:** `content.rationale.referenceInfo`

```json
"referenceInfo": {
  "anatomy": "Detailed string...",
  "physiology": "Detailed string...",
  "pharm": "Detailed string..."
}
```
