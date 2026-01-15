# NGN SINGLE RESPONSE: PERFECT CONTENT SPECIFICATION (100% MASTERY)

This document defines the **"Platinum Standard"** for a NGN Single Response item (Traditional Multiple Choice).

## 1. 📂 ASSOCIATED FILES MAP
| Component | File Path | Purpose |
|-----------|-----------|---------|
| **Golden Prompt** | `docs/external_prompts/Golden Prompts/Golden-NGN-SingleResponse-Item.md` | Generation instructions. |
| **Zod Schema** | `src/schemas/multires.ts` (Shared) | Validates option logic. |

---

## 2. 🧠 METADATA
| Field | Requirement | Example |
|-------|-------------|---------|
| **difficulty** | `number` (1-5) | `3` (Application) |
| **cjmmStep** | `string` | `"Generate Solutions"` or `"Take Action"` |

---

## 3. ❓ QUESTION STEM & MECHANICS

### The Stem (`prompt`)
**Requirement:** clear question.
**Perfect Example:**
> "Which action should the nurse take first?"

### The Options (`structure.options`)
**Strict Rule:** 4 Options. Exactly 1 Correct.

```json
"structure": {
  "options": [
    { "id": "o1", "text": "Correct Answer", "isCorrect": true },
    { "id": "o2", "text": "Distractor 1", "isCorrect": false },
    { "id": "o3", "text": "Distractor 2", "isCorrect": false },
    { "id": "o4", "text": "Distractor 3", "isCorrect": false }
  ]
}
```

---

## 4. 🏥 CLINICAL DATA
- **Notes/Vitals:** Must present a situation requiring a decision (Prioritization or Knowledge).

---

## 5. 🎓 RATIONALE
- **pathophysiology:** Why the answer is correct.
- **safetyCheck:** Why the distractors are wrong (or dangerous).

---

## 6. ✅ PASS CRITERIA CHECKLIST
1. [ ] Exactly 4 options.
2. [ ] Exactly 1 Correct.
3. [ ] Distractors are plausible.
