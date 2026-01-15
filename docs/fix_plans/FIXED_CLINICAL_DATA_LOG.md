# 🛠️ FIXED: CLINICAL DATA RICHNESS LOG

**Date:** January 9, 2026  
**Status:** ✅ COMPLETE & VERIFIED  
**Focus:** Nurse's Notes Depth & Progression

---

## 🎯 PROBLEM SUMMARY

Users reported that items generated with **high difficulty (Level 5/Expert)** often contained only a **single** Nurse's Note. 

**Impact:**
- Level 5 questions require analyzing **clinical progression** or **deterioration** over time.
- A single note fails to provide the temporal context needed for these complex judgments.
- The item difficulty felt artificial without this richness.

---

## 🔧 FIX: PROMPT ENGINEERING UPDATES

We have updated the **Golden Prompts** for the following item types to strictly enforce clinical data volume based on difficulty level.

**Files Updated:**
1.  `docs/external_prompts/Golden Prompts/Golden-NGN-MultipleResponse-Item.md` (SATA)
2.  `docs/external_prompts/Golden Prompts/Golden-NGN-Highlight-Item.md`
3.  `docs/external_prompts/Golden Prompts/Golden-NGN-OrderedResponse-Item.md`

*(Note: `Golden-NGN-BowTie-Item.md` already contained this standard)*

---

## 📜 NEW STANDARD (APPLIED ACROSS PROMPTS)

A new **Nurse's Notes (Difficulty Based)** constraint has been added to the "CLINICAL DATA GOLD STANDARDS" section of each prompt:

```markdown
**Nurse's Notes (Difficulty Based):**
- **Level 3 (Analysis):** Minimum 1 detailed note (100+ words).
- **Level 4/5 (Expert):** MUST include **2-3 notes** at different timepoints (e.g., 0800, 0815, 0830) to show clinical progression or deterioration.

/* Example for AI */
"nursesNotes": [
  { "time": "0800", "author": "RN", "note": "Initial assessment shows..." },
  { "time": "0815", "author": "RN", "note": "Patient status deteriorating..." }
]
```

---

## ✅ EXPECTED OUTCOME

When generating new items at **Level 4 or 5**:
1.  The AI will now generate a **timeline** of clinical events.
2.  Users will see **progression** (e.g., vitals dropping, symptoms worsening) in the EHR tab.
3.  This aligns the **Content Complexity** with the **Item Difficulty Label**, making "Expert" items genuinely challenging due to clinical nuance rather than just obscure knowledge.
