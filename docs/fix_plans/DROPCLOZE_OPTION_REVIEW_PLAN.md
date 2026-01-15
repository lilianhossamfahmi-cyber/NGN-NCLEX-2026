# 📝 DROP/CLOZE OPTION REVIEW DESIGN PLAN

**Date:** January 9, 2026  
**Status:** ✅ IMPLEMENTED (Option A: Annotated Sentence View)  
**Item Type:** Drop/Cloze (Fill-in-the-Blank with Dropdowns)  

---

## 🎯 OBJECTIVE

Design a **student-centric Option Review** experience for Drop/Cloze items that:
1. Shows answers **in context** (within the original sentence)
2. Provides **clear visual feedback** (correct/incorrect at a glance)
3. Explains **why** each answer is correct or incorrect
4. Connects to the **scoring system** seamlessly

---

## 📸 CURRENT STATE ANALYSIS

### Problems with Current View:
| Issue | Description |
|-------|-------------|
| **No Context** | Options shown as isolated `[d1, ] Dextrose 50%...` without the original sentence |
| **Raw IDs Visible** | Students see technical IDs like `d1`, `d2` which are meaningless |
| **No Visual Feedback** | Options have checkboxes but no color-coding for correct/incorrect |
| **Missing "Your Answer"** | Doesn't show what the student selected vs. the correct answer |
| **Generic List Format** | Uses same accordion format as MCQs, not suited for fill-in-blank |

---

## 🎨 PROPOSED DESIGNS

### Option A: "Annotated Sentence View" (RECOMMENDED)

**Concept:** Show the original sentence with blanks replaced by interactive chips showing:
- Student's answer (with color: green ✓ / red ✗)
- Correct answer (shown on error)

**Mockup:**
```
╔══════════════════════════════════════════════════════════════════════════╗
║ 📋 COMPLETED CLINICAL SENTENCE                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   The nurse should first administer                                      ║
║                                                                          ║
║   ┌─────────────────────────────────────┐                               ║
║   │ ❌ Dextrose 50% in Water (D50W) IV  │ ← Your Answer (Incorrect)     ║
║   │ ✓  4 oz of orange juice orally     │ ← Correct Answer              ║
║   └─────────────────────────────────────┘                               ║
║                                                                          ║
║   to treat the patient's symptoms because                                ║
║                                                                          ║
║   ┌─────────────────────────────────────┐                               ║
║   │ ✓  fastest                         │ ← Correct!                    ║
║   └─────────────────────────────────────┘                               ║
║                                                                          ║
║   absorption occurs through the oral mucosa.                             ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**Pros:**
- ✅ Students see answers in FULL context
- ✅ Easy to understand at a glance
- ✅ Natural reading flow
- ✅ Mirrors the original question format

**Cons:**
- ⚠️ May need scrolling for long sentences
- ⚠️ Complex implementation

---

### Option B: "Table Comparison View"

**Concept:** Side-by-side table showing each blank with student vs. correct answer.

**Mockup:**
```
╔════════════════════════════════════════════════════════════════════════════╗
║  #  │  BLANK CONTEXT        │  YOUR ANSWER      │  CORRECT ANSWER  │  ✓/✗ ║
╠════════════════════════════════════════════════════════════════════════════╣
║  1  │  "...administer ___   │  D50W IV push     │  Orange juice    │  ❌   ║
║     │   to treat..."        │                   │  orally          │      ║
╠═════════════════════════════════════════════════════════════════════════════╣
║  2  │  "...because ___      │  fastest          │  fastest         │  ✓   ║
║     │   absorption..."      │                   │                  │      ║
╚════════════════════════════════════════════════════════════════════════════╝
```

**Pros:**
- ✅ Quick comparison
- ✅ Easy to scan for errors
- ✅ Compact format

**Cons:**
- ⚠️ Loses sentence flow
- ⚠️ May feel clinical/impersonal

---

### Option C: "Card Stack with Context"

**Concept:** Each blank gets its own expandable card with context snippet.

**Mockup:**
```
┌────────────────────────────────────────────────────────────────┐
│ BLANK 1                                           ❌ INCORRECT │
├────────────────────────────────────────────────────────────────┤
│ "...administer ___ to treat..."                                │
│                                                                │
│ ┌────────────────────┐    ┌────────────────────┐              │
│ │ YOUR ANSWER        │    │ CORRECT ANSWER     │              │
│ │ D50W IV push       │    │ Orange juice orally│              │
│ │ (Selected)         │    │ ✓ Correct Choice   │              │
│ └────────────────────┘    └────────────────────┘              │
│                                                                │
│ 💡 WHY INCORRECT:                                              │
│ D50W IV requires IV access and is used when patient is        │
│ unable to swallow. This patient is responsive and able to     │
│ take oral intake, making oral glucose the first-line choice.  │
│                                                                │
│ 💡 WHY [CORRECT] IS CORRECT:                                   │
│ Orange juice provides rapid glucose through oral absorption,  │
│ is safe for conscious patients, and does not require IV       │
│ access.                                                        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ BLANK 2                                             ✓ CORRECT  │
├────────────────────────────────────────────────────────────────┤
│ "...because ___ absorption..."                                 │
│                                                                │
│ ┌────────────────────┐                                        │
│ │ YOUR ANSWER        │   ✓ CORRECT!                           │
│ │ fastest            │                                        │
│ └────────────────────┘                                        │
│                                                                │
│ 💡 WHY CORRECT:                                                │
│ "Fastest" accurately describes how oral glucose gel is        │
│ absorbed through the buccal mucosa, providing rapid blood     │
│ glucose elevation without needing GI absorption.              │
└────────────────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ Most detailed feedback
- ✅ Clear separation of each blank
- ✅ Room for detailed rationale

**Cons:**
- ⚠️ Takes more vertical space
- ⚠️ May feel overwhelming for simple items

---

## 🔗 SCORING CONNECTION

The Option Review must accurately reflect the scoring logic:

### Scoring Model (from `calculateClozeScore`):
```typescript
// Each dropdown is scored independently: 1 point if correct, 0 if incorrect
// Total score = sum of correct answers / total blanks
// Percentage = (earned / total) * 100
```

### Display Requirements:
1. **Score Summary at Top:**
   ```
   ┌─────────────────────────────────────────┐
   │  SCORE: 1/2 BLANKS CORRECT (50%)        │
   │  ═════════════════░░░░░░░░░░░  (50%)    │
   └─────────────────────────────────────────┘
   ```

2. **Per-Blank Verdict:**
   - ✓ Correct → Green chip/badge
   - ✗ Incorrect → Red chip/badge with correct answer shown

3. **Match Question Screen:**
   - If Question Screen shows a blank as green, Option Review MUST show green
   - Ensure same `checkIsCorrect` logic is used

---

## 📐 DATA REQUIREMENTS

### From RationalePipeline:
```typescript
interface ClozeBlankReview {
  id: string;              // e.g., "d1"
  beforeText: string;      // Text before the blank
  afterText: string;       // Text after the blank
  userAnswer: string;      // What student selected
  correctAnswer: string;   // The correct option text
  isCorrect: boolean;
  allOptions: { id: string; text: string }[];  // All available choices
  whyCorrect?: string;     // Why the correct answer is right
  whyIncorrect?: string;   // Why the user's answer is wrong (if applicable)
}

interface ClozeReview {
  originalSentence: string;
  blanks: ClozeBlankReview[];
  score: { earned: number; total: number; percentage: number };
}
```

### Golden Prompt Requirements:
The prompt should generate a `blankMap` similar to Highlight's `tokenMap`:
```json
{
  "blankMap": {
    "d1": {
      "correctOptionId": "opt1",
      "whyCorrect": "Orange juice is first-line for conscious hypoglycemic patients...",
      "distractorRationales": {
        "opt2": "D50W IV is reserved for unconscious patients...",
        "opt3": "Glucagon IM is slower than oral glucose..."
      }
    },
    "d2": {
      "correctOptionId": "opt4",
      "whyCorrect": "Buccal absorption bypasses the GI tract for rapid effect..."
    }
  }
}
```

---

## 🏆 RECOMMENDATION

**OPTION A: Annotated Sentence View** is recommended because:
1. **Most intuitive for students** - mirrors how they answered the question
2. **Maintains context** - answers make sense within the sentence
3. **Familiar format** - similar to reading comprehension feedback
4. **Matches Highlight approach** - consistent with the Annotated Chart we built

### Enhanced Version (A+):
Combine Option A's sentence view with Option C's expandable rationale:
- Default: Show annotated sentence
- On click: Expand to show detailed "Why Correct/Incorrect"

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Data Preparation ✅
- [x] Update `RationalePipeline.ts` to generate `clozeReview` object
- [x] Extract blank text, user answer, correct answer from config
- [x] Handle `blankMap` for specific rationale (like tokenMap for Highlight)

### Phase 2: Component Creation ✅
- [x] Create `ClozeFeedback.tsx` component (similar to `HighlightFeedback.tsx`)
- [x] Implement annotated sentence rendering with inline chips
- [x] Add expandable rationale cards

### Phase 3: Integration ✅
- [x] Pass `clozeReview` from `RationalePipeline` to `UltimateRationale`
- [x] Conditionally render `ClozeFeedback` for cloze/dropdown items
- [x] Ensure score display matches calculated score

### Phase 4: Golden Prompt Update ✅
- [x] Add `blankMap` requirement to `Golden-NGN-DropCloze-Item.md`
- [x] Include `whyCorrect` and `distractorRationales` fields
- [x] Provide examples with specific clinical explanations

---

## ✅ FINAL IMPLEMENTATION SUMMARY

### Files Modified:
| File | Changes |
|------|---------|
| `src/types/RationaleTypes.ts` | Added `ClozeBlankReview` and `ClozeReview` interfaces |
| `src/services/RationalePipeline.ts` | Added clozeReview generation with blankMap extraction |
| `src/components/feedback/ClozeFeedback.tsx` | **NEW** - Annotated Sentence View component |
| `src/components/UltimateRationale.tsx` | Added clozeReview prop and ClozeFeedback rendering |
| `src/components/RationaleSheet.tsx` | Added clozeReview pass-through |
| `docs/external_prompts/Golden Prompts/Golden-NGN-DropCloze-Item.md` | Added blankMap requirement |

### Data Flow:
1. **AI generates** Drop/Cloze item with `blankMap` in `structure`
2. **RationalePipeline** extracts `blankMap.whyCorrect` and `blankMap.distractorRationales`
3. **ClozeFeedback** displays in Annotated Sentence View with expandable rationale
4. **Student clicks** on blank card → sees specific "Why Correct" / "Why Incorrect"

### BlankMap Format (Required in AI-generated JSON):
```json
"blankMap": {
  "d1": {
    "correctOptionId": "o1",
    "whyCorrect": "Oral glucose gel is first-line treatment for conscious hypoglycemic patients...",
    "distractorRationales": {
      "o2": "D50W IV push requires IV access and is reserved for unconscious patients..."
    }
  }
}
```
