# NCLEX-NGN Scoring Gold Standards
**Last Updated:** 2025-12-30

This document defines the **Official Scoring Rules** for all item types in the NCLEX NGN Simulator. These rules are enforced by `scoringEngine.ts` and must be followed by all AI generation prompts.

---

## 1. Exam Behavior Rules

### 1.1 "Leave Blank" Policy
| Context | Allowed? | Behavior |
|---------|----------|----------|
| **On the Exam (Navigation)** | ❌ NO | The "Next" button is disabled until the response requirements are met. |
| **SATA / Highlight / Matrix** | ✅ YES (Strategic) | Leaving a distractor (wrong answer) blank is **good**—it saves you from a -1 point deduction. |
| **Cloze / Drop-Down** | ❌ NO | You must make a selection for every box to submit. |

---

## 2. Scoring Methods Overview

### 2.1 Scoring Rule Types
| Rule | Symbol | Description |
|------|--------|-------------|
| **Zero/One** | `0/1` | You get 1 point for getting it right, 0 for wrong. No penalties for wrong answers. |
| **Plus/Minus** | `+/-` | +1 for each correct selection, -1 for each incorrect selection. Total floors at 0. |
| **Rationale** | `Linked` | Both parts of a "Cause & Effect" pair must be correct to get the point. |
| **Sequence** | `0/1 All` | All-or-Nothing. The entire sequence must be correct to earn the point. |

---

## 3. Scoring Table by Item Type

| File / Item Type | Scoring Method | Rule Description | Max Points (Typical) | `rule` Tag in Engine |
|------------------|----------------|------------------|---------------------|---------------------|
| `01_CASE_STUDY` | Varies | A container for 6 sequential questions. Scoring depends on specific item type per screen. | ~12-18 pts total | (Per-screen) |
| `02_BOW_TIE` | 0/1 (per target) | 1 point for each correct target dropped (2 Actions + 2 Parameters + 1 Condition). | **5 points** | `0/1 (Component)` |
| `03_TREND` | Varies | Scenario with changing data over time. Scored based on embedded item type. | 1-4 pts | (Per-item) |
| `04_CLOZE` | 0/1 (per blank) | 1 point for each correct token placed in a blank. | Variable | `Rationale (Linked)` |
| `05_HIGHLIGHT` | +/- | +1 for correct highlights, -1 for incorrect. Total floors at 0. | Variable | `+/- (Polytomous)` |
| `06_MATRIX` | 0/1 per row | 1 point for each correct row selection (Single Choice per row). | Variable (# rows) | `+/- (Polytomous)` |
| `07_ORDERED_RESPONSE` | 0/1 All-or-Nothing | ALL options must be in the CORRECT order to earn the point. | **1 point** | `0/1 (Sequence)` |
| `08_MULTIPLE_RESPONSE` | +/- | (SATA) +1 for correct, -1 for incorrect. Total floors at 0. | Variable | `+/- (Polytomous)` |
| `09_DROP_CLOZE` | 0/1 (per dropdown) | 1 point for each correct drop-down selection. | Variable | `Rationale (Linked)` |
| `10_HOT_SPOT` | 0/1 All-or-Nothing | Must click the precise correct area. | **1 point** | `0/1 (Component)` |
| `11_SINGLE_RESPONSE` | 0/1 | Standard Multiple Choice. 1 point for correct, 0 for wrong. | **1 point** | `0/1 (Component)` |
| `12_CALCULATION` | 0/1 | Must type the exact number (within acceptable range). No partial credit. | **1 point** | `0/1 (Exact Match)` |
| `new_SINGLE_RESPONSE` | 0/1 | Same as standard Single Response. | **1 point** | `0/1 (Component)` |

---

## 4. Detailed Rule Explanations

### 4.1 Plus/Minus (+/-) Scoring
**Used For:** SATA, Multiple Response, Highlight, Matrix (Multi-Response rows)

**Formula:**
```
Score = (Correct Selections) - (Incorrect Selections)
If Score < 0, Score = 0  // Floor at zero
```

**Example (SATA with 3 correct answers):**
| User Selection | Correct? | Points |
|---------------|----------|--------|
| Option A | ✅ Correct | +1 |
| Option B | ✅ Correct | +1 |
| Option C | ❌ Wrong | -1 |
| Option D | (Not Selected, Correct) | 0 (Missed) |
| **Total** | | **1/3** |

**Key Insight:** Leaving distractors blank is **strategic**. Selecting wrong answers costs you points.

### 4.2 Zero/One (0/1) Scoring
**Used For:** Single Response, Calculation, Ordered Response, Hot Spot, Bow-Tie (per component), Cloze (per blank)

**Formula:**
```
Score = (All conditions met) ? 1 : 0
```

**No penalty for wrong answers.** You simply don't earn the point.

### 4.3 Rationale (Linked) Scoring
**Used For:** Cloze, Drop-Cloze

**Rule:** Each blank/dropdown is scored independently (0/1 per blank).
**Note:** In some "Cause & Effect" formats, BOTH linked blanks must be correct to earn a single point.

---

## 5. Focus Monitor Integration

The **Focus Monitor** (Exam Stress Metric) uses the following formula:

```
Ratio = Answer Reversals / Total Option Base
```

| Ratio | Status | Color | Meaning |
|-------|--------|-------|---------|
| ≤ 1.0x | Decisive | Green | Confident execution |
| 1.0x - 2.0x | Deliberate | Teal | Careful consideration |
| 2.0x - 3.0x | Hesitant | Yellow | Second-guessing |
| 3.0x - 4.0x | Scattered | Orange | Loss of focus |
| > 4.0x | Panic | Red | Random/Frantic inputs |

**Option Base Calculation by Type:**
- **Standard Items:** `options.length`
- **Bow-Tie:** Actions + Conditions + Parameters pools
- **Matrix:** Rows × Columns
- **Highlight:** Count of `<span id='hX'>` tokens
- **Cloze:** Sum of options across all dropdowns

---

## 6. Implementation Reference

**Scoring Engine Location:** `src/utils/scoringEngine.ts`

**Key Function:** `CognitiveAnalyticsEngine.calculateScore(type, userAns, correctAns)`

**Return Object:**
```typescript
interface ScoreRuleResult {
    score: number;          // Points earned
    maxScore: number;       // Maximum possible points
    correctCount?: number;  // For +/- scoring
    incorrectCount?: number; // For +/- scoring
    isCorrect: boolean;     // 100% correct?
    rule?: string;          // "0/1", "+/-", etc.
}
```

---

## 7. AI Generation Compliance

All AI generation prompts (`docs/external_prompts/*.md`) MUST:

1. **Include `scoringRule` in metadata** (e.g., `"scoringRule": "0/1"`)
2. **Specify Max Points** where applicable
3. **Follow Option Count Guidelines:**
   - Single Response: 4-5 options
   - SATA: 5-8 options (2-4 correct)
   - Matrix: 3-6 rows
   - Bow-Tie: 4 Actions, 3 Conditions, 4 Parameters (standard)
   - Highlight: 4-8 highlightable tokens
   - Ordered Response: 4-6 items to order

4. **Ensure Distractor Quality:** Wrong answers must be clinically plausible to prevent artificial "easy" scores.
