# NGN Clinical Reasoning (Rationale) Standards (Golden v3.2)

> **ACTIVE SOURCE OF TRUTH**
> Effective Date: 2026-01-14
> Inherits from: Golden-NGN-Case-Study-6Q.md

This document defines the **Rich Rationale Object** required for every NGN item. A simple text explanation is **NOT ACCEPTABLE**.

---

## 1. The Rationale Object Schema
**Location:** `content.rationale` (and `structure.screens[i].rationale`)

Every item must include this exact JSON structure filled with high-quality educational content.

```json
{
  "coreConcept": "Heart Failure Management",
  "caseSummary": "A patient presents with acute decompensated heart failure and pulmonary edema.",
  "answerAnalysis": "Furosemide is the priority to reduce preload. Beta-blockers are contraindicated in acute decompensation. Morphine is no longer routinely recommended.",
  "trap": "Thinking that oxygen is the ONLY priority when fluid overload is the root cause.",
  "goldenRule": "In acute pulmonary edema, unload the heart (Diuretics) before slowing the heart (Beta-blockers).",
  "steps": [
    { "tag": "Recognize", "description": "Identify signs of fluid overload (crackles, JVD)." },
    { "tag": "Analyze", "description": "Determine this is 'Wet and Warm' heart failure." },
    { "tag": "Take Action", "description": "Administer IV diuretics and monitor output." }
  ],
  "mnemonic": {
    "title": "LMNOP",
    "content": "L-Lasix, M-Morphine (historical), N-Nitrates, O-Oxygen, P-Position/Positive Pressure",
    "explanation": "Standard protocol for acute pulmonary edema."
  },
  "cheatSheet": {
    "title": "Heart Failure Pearls",
    "points": [
      "BNP > 100 indicates Heart Failure",
      "Daily weights are best indicator of fluid status",
      "Avoid Calcium Channel Blockers in HFrEF"
    ]
  },
  "referenceInfo": {
    "anatomy": "Left ventricular failure causes backup into pulmonary veins (pulmonary edema).",
    "physiology": "Increased hydrostatic pressure pushes fluid into alveoli, impairing gas exchange.",
    "pharm": "Furosemide: Loop diuretic, inhibits Na/K/2Cl reabsorption in Loop of Henle."
  },
  "difficulty": {
    "score": 75,
    "level": 3,
    "label": "Hard",
    "clinicalStrategy": "Prioritize ABCs then Preload reduction.",
    "recommendedActions": ["Review Diuretic onset times"]
  }
}
```

---

## 2. Content Quality Rules

### ✅ Core Concept
1-2 sentences. Broad topic (e.g., "Sepsis", "Stroke").

### ✅ Answer Analysis
Must explain **WHY** the correct answer is right AND **WHY** every distractor is wrong.
*   **Good**: "Option A is correct because... Option B is incorrect because..."
*   **Bad**: "A is the answer."

### ✅ Trap (The Pitfall)
Identify the common logical error students make (e.g., "Confusing hypoglycemia signs with hyperglycemia").

### ✅ Golden Rule
A memorable "One-Liner" takeaway.

### ✅ Reference Info
**MUST BE CASE SPECIFIC.**
*   **Anatomy**: Relate to the specific condition.
*   **Physiology**: Pathophysiology of the specific event.
*   **Pharm**: Mechanism of action for the drugs in the question.
